/* 档案库首页滚动引擎
   - Lenis 负责平滑滚动（本地 vendored，不依赖外部 CDN）
   - 每个模块写入 --p（视差进度）与首屏 --hp，CSS 用它们驱动分层位移
   - 右下角模块计数器按数字上下滚动的方式更新
   - 对外暴露 window.__archiveScroll，供导航 / 目录 / 页脚复用 */
(() => {
  'use strict';

  const page = document.getElementById('page');
  if (!page) return;

  const mods = Array.from(page.querySelectorAll(':scope > .module'));
  if (!mods.length) return;

  const root = document.documentElement;
  const body = document.body;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileQuery = window.matchMedia('(max-width: 860px)');

  const hud = document.getElementById('module-hud');
  const hudName = document.getElementById('hud-name');
  const hudTotal = document.getElementById('hud-total');
  const hudBar = document.getElementById('hud-bar-fill');
  const LAST = mods.length - 1;

  /* ---------- 右下角里程表数字 ---------- */
  const reels = {};
  if (hud) {
    document.querySelectorAll('.hud-track').forEach((track) => {
      let cells = '';
      for (let d = 0; d < 10; d += 1) cells += '<span>' + d + '</span>';
      track.innerHTML = cells;
    });
    reels.tens = document.querySelector('.hud-track[data-reel="tens"]');
    reels.units = document.querySelector('.hud-track[data-reel="units"]');
    if (hudTotal) hudTotal.textContent = '/ ' + String(LAST).padStart(2, '0');
  }

  const setDigit = (track, value) => {
    if (!track || track.__digit === value) return;
    track.__digit = value;
    /* 行高固定 1em，整数格位移就是一次完整的滚轮步进 */
    track.style.transform = 'translate3d(0,' + (-value) + 'em,0)';
  };

  /* ---------- 状态 ---------- */
  let offsets = [];
  let headOffsets = [];
  let vh = window.innerHeight;
  let maxScroll = 1;
  let activeIndex = -1;
  let locked = true;
  let lastScroll = -1;
  let measured = false;

  const lenis = (() => {
    if (motionQuery.matches || typeof window.Lenis !== 'function') return null;
    const instance = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.7,
      wheelMultiplier: 1
    });
    instance.on('scroll', requestTick);
    return instance;
  })();

  function measure() {
    vh = window.innerHeight;
    /* 解锁前 html 是 overflow:hidden，Lenis 量到的可滚距离是 0，解锁后必须重算上限 */
    if (lenis && !locked) lenis.resize();
    offsets = mods.map((m) => m.getBoundingClientRect().top + window.scrollY);
    /* 标题相对模块顶部的距离。.module-main 自身是定位元素，head.offsetTop 只到它，
       所以要把 module-main 相对模块的偏移一起加上 */
    headOffsets = mods.map((m) => {
      const main = m.querySelector('.module-main');
      const head = m.querySelector('.series-head');
      if (!head) return 0;
      return (main ? main.offsetTop : 0) + head.offsetTop;
    });
    maxScroll = Math.max(1, root.scrollHeight - vh);
    measured = true;
    lastScroll = -1;
    requestTick();
  }

  function requestTick() {
    if (requestTick.queued) return;
    requestTick.queued = true;
    requestAnimationFrame(tick);
  }

  function setIndex(next) {
    if (next === activeIndex) return;
    activeIndex = next;
    setDigit(reels.tens, Math.floor(next / 10));
    setDigit(reels.units, next % 10);
    if (hudName) hudName.textContent = mods[next].getAttribute('aria-label') || '';
    document.querySelectorAll('.ak-spine-dot').forEach((dot, i) => {
      dot.classList.toggle('is-current', i === next);
    });
    window.dispatchEvent(new CustomEvent('archive:module-change', { detail: { index: next } }));
  }

  function tick() {
    requestTick.queued = false;
    if (!measured) return;

    const sy = window.scrollY;
    const hero = mods[0];
    const heroHeight = Math.max(1, hero.offsetHeight);
    const heroProgress = Math.max(0, Math.min(1, sy / heroHeight));

    /* 首屏淡出进度 */
    hero.style.setProperty('--hp', heroProgress.toFixed(4));

    /* 先批量读取，再批量写入，避免样式无效化引起重复布局 */
    const rects = mods.map((m) => m.getBoundingClientRect());
    let index = 0;
    if (!locked) {
      const focusLine = vh * 0.38;
      for (let i = 0; i < mods.length; i += 1) {
        if (rects[i].top <= focusLine) index = i;
      }
      /* 滚到底时最后一屏不一定能把标题顶到焦点线，直接按位置判定 */
      if (sy >= maxScroll - 2) index = LAST;
    }

    setIndex(index);

    for (let i = 1; i < mods.length; i += 1) {
      const rect = rects[i];
      const half = (vh + rect.height) / 2;
      const p = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - vh / 2) / half));
      if (Math.abs((mods[i].__p || 0) - p) > 0.002) {
        mods[i].__p = p;
        mods[i].style.setProperty('--p', p.toFixed(4));
      }

      /* 标题进度：标题从视口底部走到半屏高度完成落位，0 → 1。
         区间保持半屏，靠缩短横向路程来降速 */
      const titleTop = rect.top + headOffsets[i];
      let t = Math.max(0, Math.min(1, (vh - titleTop) / (vh * 0.5)));
      /* 落位锁定：标题滑到最终位置（顶到左侧）之后就钉住，
         向上回滚时不再退回右侧、也不再重新虚化。
         还没滑到位的标题仍按滚动位置实时计算，行为不变。 */
      if (t >= 1) mods[i].__tLocked = true;
      if (mods[i].__tLocked) t = 1;
      const prevT = mods[i].__t;
      /* 锁定瞬间强制写一次：贴着阈值的旧值差值可能落在容差内，
         否则标题会停在差几个像素的位置上不再归位 */
      if (prevT === undefined || Math.abs(prevT - t) > 0.004 || (t === 1 && prevT !== 1)) {
        mods[i].__t = t;
        mods[i].style.setProperty('--t', t.toFixed(4));
      }
    }

    if (hudBar) hudBar.style.transform = 'scaleX(' + Math.min(1, sy / maxScroll).toFixed(4) + ')';
    if (sy !== lastScroll) lastScroll = sy;
  }

  /* ---------- 入场显隐 ---------- */
  const reveal = (module) => {
    if (module.classList.contains('is-inview')) return;
    module.classList.add('is-inview');
  };

  const revealVisible = () => {
    mods.forEach((m) => {
      const rect = m.getBoundingClientRect();
      if (rect.top < vh * 0.92 && rect.bottom > vh * 0.08) reveal(m);
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (locked) return; /* 入场后统一补显示，避免在加载页背后提前播完 */
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    mods.forEach((m) => observer.observe(m));
  } else {
    mods.forEach(reveal);
  }

  /* 加载页自然收场后若还没进入，至少把首屏显出来，别留一片空白 */
  window.addEventListener('archive:ready', () => {
    body.classList.add('is-booted');
    measure();
    if (locked) revealVisible();
  });

  /* ---------- 滚动锁定 ---------- */
  function lock() {
    locked = true;
    root.classList.add('scroll-locked');
    if (lenis) lenis.stop();
  }

  function unlock() {
    if (!locked) return;
    locked = false;
    root.classList.remove('scroll-locked');
    page.classList.remove('locked');
    body.classList.add('is-entered');
    if (lenis) lenis.start();
    measure();
    requestAnimationFrame(revealVisible);
    window.dispatchEvent(new Event('archive:unlock'));
  }

  function scrollToIndex(index, immediate) {
    measure();
    const target = offsets[Math.max(0, Math.min(LAST, index))];
    if (target == null) return;
    /* 移动端顶部有固定导航，落点让出 64px，避免标题被盖住 */
    const offset = mobileQuery.matches && index > 0 ? -64 : 0;
    if (lenis) {
      lenis.scrollTo(target + offset, { duration: immediate ? 0 : 1.15, immediate: !!immediate });
    } else {
      window.scrollTo({ top: target + offset, behavior: immediate || motionQuery.matches ? 'auto' : 'smooth' });
    }
  }

  window.__archiveScroll = {
    get index() { return activeIndex; },
    lenis,
    lock,
    unlock,
    measure,
    scrollToIndex,
    scrollToTop: (immediate) => scrollToIndex(0, immediate),
    refresh: () => { measure(); requestTick(); }
  };

  /* ---------- 事件 ---------- */
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', () => {
    measure();
    requestTick();
  }, { passive: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measure).catch(() => {});
  }
  window.addEventListener('load', measure);

  if ('ResizeObserver' in window) {
    new ResizeObserver(() => {
      measure();
      lastScroll = -1;
    }).observe(page);
  }

  if (lenis) {
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  /* 页面由「已进入」状态直接恢复时，boot.js 会加 auto-unlock */
  const start = () => {
    if (root.classList.contains('auto-unlock')) {
      unlock();
      scrollToIndex(0, true);
    } else {
      lock();
    }
    measure();
    /* 同步跑一帧，避免首屏绘制前标题还停在 CSS 默认的落位状态 */
    tick();
    requestTick();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
