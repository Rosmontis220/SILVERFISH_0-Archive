/* TextType 打字机效果（原生实现，不依赖 React / gsap）
   参考 React Bits 的 TextType，只取这个站点用得上的部分：
   - 逐字符打出文本，尾部跟一个会呼吸的光标
   - 可选「打错字再自我纠正」的拟真（按键盘相邻键取错字）
   - 变速打字 / 变速退格 / 字符入场动画（用 Web Animations API，不需要动画库）
   - 被要求换文本时：正在打字就立刻停手转退格；退格过程中若又来新文本，
     退完直接打最新那一段，不会把过期的那段补完
   无障碍：完整文本放在 .text-type__sr 里供读屏朗读，视觉层整体 aria-hidden，
   否则逐字刷新会被读屏当成流水播报。 */
(() => {
  'use strict';

  /* 键盘相邻键表：用来生成「像手滑打错」的字 */
  const NEIGHBORS = {
    a: 'qwsz', b: 'vghn', c: 'xdfv', d: 'serfcx', e: 'wsdr', f: 'drtgvc',
    g: 'ftyhbv', h: 'gyujnb', i: 'ujko', j: 'huikmn', k: 'jiolm', l: 'kop',
    m: 'njk', n: 'bhjm', o: 'iklp', p: 'ol', q: 'wa', r: 'edft', s: 'awedxz',
    t: 'rfgy', u: 'yhji', v: 'cfgb', w: 'qase', x: 'zsdc', y: 'tghu', z: 'asx',
    0: '9p', 1: '2q', 2: '13w', 3: '24e', 4: '35r', 5: '46t', 6: '57y',
    7: '68u', 8: '79i', 9: '80o'
  };

  /* 字符入场动画：用 WAAPI 实现，替代 React Bits 里的 gsap */
  const EFFECTS = {
    fade: {
      keyframes: [{ opacity: 0 }, { opacity: 1 }],
      options: { duration: 140, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' }
    },
    blur: {
      keyframes: [{ opacity: 0, filter: 'blur(0.2em)' }, { opacity: 1, filter: 'blur(0em)' }],
      options: { duration: 260, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
    },
    rise: {
      keyframes: [{ opacity: 0, transform: 'translateY(0.3em)' }, { opacity: 1, transform: 'translateY(0)' }],
      options: { duration: 220, easing: 'cubic-bezier(0.34, 1.4, 0.64, 1)' }
    }
  };

  /* 按字素簇切分：中文和 emoji 都算「一个字」，不会被拆开 */
  const graphemes = (value) => {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      return Array.from(
        new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(value),
        (part) => part.segment
      );
    }
    return Array.from(value);
  };

  const typoFor = (char) => {
    const keys = NEIGHBORS[char.toLowerCase()];
    if (!keys) return null;
    const pick = keys[Math.floor(Math.random() * keys.length)];
    return char === char.toLowerCase() ? pick : pick.toUpperCase();
  };

  /**
   * @param {HTMLElement} el 承载文字的元素
   * @param {object} options
   *   typingSpeed    每个字的毫秒数
   *   deletingSpeed  退格每个字的毫秒数
   *   variableSpeed  {min,max} 随机速度区间（毫秒），给了就覆盖 typingSpeed
   *   mistakes       0~1，打错字的概率强度
   *   typeEffect     none | fade | blur | rise，字符入场动画
   *   cursor         是否显示光标
   *   onComplete     一段文本打完之后回调（参数为该段文本）
   */
  window.createTextType = function createTextType(el, options) {
    if (!el) return null;

    const opts = Object.assign({
      typingSpeed: 18,
      deletingSpeed: 10,
      variableSpeed: null,
      mistakes: 0,
      typeEffect: 'fade',
      cursor: true,
      onComplete: null
    }, options || {});

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* DOM：sr（读屏用全文）+ content（视觉层，逐字 + 光标）
       光标本身也是插入锚点，新字符插在它前面，光标自然跟着走。 */
    const root = document.createElement('span');
    root.className = 'text-type';

    const sr = document.createElement('span');
    sr.className = 'text-type__sr';

    const content = document.createElement('span');
    content.className = 'text-type__content';
    content.setAttribute('aria-hidden', 'true');

    const cursor = document.createElement('span');
    cursor.className = 'text-type__cursor';
    if (opts.cursor === false) cursor.style.display = 'none';

    content.appendChild(cursor);

    root.appendChild(sr);
    root.appendChild(content);
    el.textContent = '';
    el.appendChild(root);

    let target = '';        /* 正在打 towards 的文本 */
    let pending = null;     /* 期间要求换成的最新文本 */
    let chars = [];
    let count = 0;          /* 已落地的字数 */
    let typo = null;        /* {plan, tail, fixing} */
    let lastTypoAt = -1;
    let mode = 'idle';      /* idle | typing | paused | deleting */
    let timer = null;
    let epoch = 0;          /* 世代号：切换模式时 +1，作废旧链路的回调 */
    let charEls = [];
    let typoEl = null;
    let destroyed = false;

    const speed = () => {
      if (opts.variableSpeed) {
        const min = opts.variableSpeed.min;
        const max = opts.variableSpeed.max;
        return min + Math.random() * (max - min);
      }
      return opts.typingSpeed;
    };

    /* 错字惩罚要跟打字速度成比例，不能写死绝对值：
       打字 8ms/字时，一次 300ms 的停顿等于卡住 37 个字的时长，
       观感上就是「打字机卡死了」。所以这里都从 typingSpeed 推导。 */
    const baseSpeed = opts.variableSpeed
      ? (opts.variableSpeed.min + opts.variableSpeed.max) / 2
      : opts.typingSpeed;
    const typoPause = () => baseSpeed * 9 + Math.random() * baseSpeed * 6;
    const typoErase = Math.max(30, opts.deletingSpeed);
    const typoSettle = () => baseSpeed * 4 + Math.random() * baseSpeed * 5;

    const animateChar = (node) => {
      const effect = EFFECTS[opts.typeEffect];
      if (!node || !effect || reduced || typeof node.animate !== 'function') return;
      try { node.animate(effect.keyframes, effect.options); } catch (e) { /* 动画失败不影响文字 */ }
    };

    /* 同步已落地的字符 */
    const paint = () => {
      while (charEls.length > count) {
        const node = charEls.pop();
        if (node && node.parentNode) node.parentNode.removeChild(node);
      }
      while (charEls.length < count) {
        const index = charEls.length;
        const span = document.createElement('span');
        span.className = 'text-type__char';
        span.textContent = chars[index];
        content.insertBefore(span, cursor);
        charEls.push(span);
        animateChar(span);
      }
    };

    /* 错字单独一段，跟在正确字符后面 */
    const paintTypo = () => {
      if (!typo) {
        if (typoEl && typoEl.parentNode) typoEl.parentNode.removeChild(typoEl);
        typoEl = null;
        return;
      }
      if (!typoEl) {
        typoEl = document.createElement('span');
        typoEl.className = 'text-type__char text-type__char--typo';
        content.insertBefore(typoEl, cursor);
      }
      typoEl.textContent = typo.tail;
    };

    /* 每次起链都带上一个世代号：调度时记下当时的 epoch，
       回调执行前先比对，世代号过期就直接放弃。
       不这么做的话，打字中途被 setText 打断时，
       旧的打字链的定时器并没有被取消，会和新的退格链同时改 count，
       结果是屏幕上冒出重复错位的字符。 */
    const schedule = (fn, ms, ep) => {
      timer = window.setTimeout(() => {
        if (ep !== epoch) return;
        fn();
      }, ms);
    };

    const tickTyping = (ep) => {
      if (destroyed || ep !== epoch) return;

      if (typo) {
        if (!typo.fixing) {
          if (typo.tail.length < typo.plan.length) {
            schedule(() => {
              typo.tail += typo.plan[typo.tail.length];
              paintTypo();
              tickTyping(ep);
            }, speed(), ep);
          } else {
            schedule(() => { typo.fixing = true; tickTyping(ep); }, typoPause(), ep);
          }
        } else if (typo.tail.length) {
          schedule(() => {
            typo.tail = typo.tail.slice(0, -1);
            paintTypo();
            tickTyping(ep);
          }, typoErase, ep);
        } else {
          schedule(() => { typo = null; paintTypo(); tickTyping(ep); }, typoSettle(), ep);
        }
        return;
      }

      if (count < chars.length) {
        const next = chars[count];
        const wrong = opts.mistakes > 0 && count > 0 && lastTypoAt !== count ? typoFor(next) : null;
        if (wrong && Math.random() < Math.min(1, opts.mistakes) * 0.16) {
          lastTypoAt = count;
          const plan = [wrong];
          const follow = chars[count + 1];
          if (follow && follow.trim() && Math.random() < 0.4) plan.push(follow);
          schedule(() => {
            typo = { plan, tail: wrong, fixing: false };
            paintTypo();
            tickTyping(ep);
          }, speed(), ep);
        } else {
          schedule(() => {
            count += 1;
            paint();
            tickTyping(ep);
          }, speed(), ep);
        }
        return;
      }

      /* 打完：停住，等下一段指令 */
      mode = 'paused';
      root.classList.remove('is-typing');
      if (typeof opts.onComplete === 'function') opts.onComplete(target);
    };

    const tickDeleting = (ep) => {
      if (destroyed || ep !== epoch) return;
      if (count > 0 && !reduced) {
        schedule(() => {
          count -= 1;
          paint();
          tickDeleting(ep);
        }, opts.deletingSpeed, ep);
        return;
      }
      /* 退格结束：直接打最新要求的那一段 */
      count = 0;
      paint();
      target = pending === null ? '' : pending;
      pending = null;
      beginTyping();
    };

    function beginTyping() {
      chars = graphemes(target);
      count = 0;
      typo = null;
      lastTypoAt = -1;
      charEls.forEach((node) => { if (node.parentNode) node.parentNode.removeChild(node); });
      charEls = [];
      paintTypo();
      sr.textContent = target;

      if (reduced) {
        count = chars.length;
        paint();
        mode = 'paused';
        if (typeof opts.onComplete === 'function') opts.onComplete(target);
        return;
      }
      mode = 'typing';
      root.classList.add('is-typing');
      epoch += 1;
      tickTyping(epoch);
    }

    /* 切到退格：正在打的字立刻停手。
       epoch +1 作废当前打字链，它的定时器回调到点也不会再改 count。 */
    const switchToDeleting = () => {
      epoch += 1;
      typo = null;
      paintTypo();
      root.classList.remove('is-typing');
      mode = 'deleting';
      tickDeleting(epoch);
    };

    const controller = {
      /** 换一段文字：正在打字就立刻停手转退格，退完打最新的一段 */
      setText(text) {
        if (destroyed) return;
        const next = text === null || text === undefined ? '' : String(text);
        /* 同一段忽略：进度每帧都会推一次当前阶段文案，
           若不拦截就会把正在打的这一段反复打断。 */
        if (next === target || next === pending) return;
        pending = next;
        if (mode === 'idle') {
          target = pending;
          pending = null;
          beginTyping();
        } else if (mode === 'deleting') {
          /* 正在退格：只把目标换成最新的，退完自然打新的一段 */
        } else {
          switchToDeleting();
        }
      },
      /** 当前正在打 towards 的文本 */
      getText() { return target; },
      /** 是否正在打字 */
      isTyping() { return mode === 'typing'; },
      /** 是否正忙（打字中或退格中）：外部据此判断能不能换下一段 */
      isBusy() { return mode === 'typing' || mode === 'deleting'; },
      destroy() {
        destroyed = true;
        epoch += 1;
        if (timer) window.clearTimeout(timer);
        timer = null;
        root.remove();
      }
    };

    return controller;
  };
})();
