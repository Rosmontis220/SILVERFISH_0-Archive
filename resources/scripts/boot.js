  (function () {
    const boot = document.getElementById('boot');
    const fill = document.getElementById('boot-fill');
    const fillV = document.getElementById('boot-fill-v');
    const pctEl = document.getElementById('boot-pct');
    const stateEl = document.getElementById('boot-state');
    const bgimg = document.getElementById('boot-bgimg');
    const curtain = document.getElementById('curtain');
    if (!boot || !fill || !fillV || !pctEl || !stateEl || !bgimg || !curtain) return;

    let entered = false;
    let fromHistory = false;
    let returning = false;
    try { entered = sessionStorage.getItem('sf-entry') === '1'; } catch (e) { /* storage unavailable */ }
    try {
      returning = sessionStorage.getItem('sf-return') === '1';
      if (returning) sessionStorage.removeItem('sf-return');
    } catch (e) { /* storage unavailable */ }
    try {
      const nav = performance.getEntriesByType && performance.getEntriesByType('navigation');
      fromHistory = !!(nav && nav.length && nav[0].type === 'back_forward');
    } catch (e) { /* navigation timing unavailable */ }
    if (entered && (fromHistory || returning)) {
      boot.remove();
      document.documentElement.classList.add('auto-unlock');
      window.dispatchEvent(new Event('archive:ready'));
      return;
    }

    /* 进度文字走打字机：每换一个阶段就退格重打，
       正在打一半时直接停手转退格，不把过期的那段补完。
       打字机不可用时（脚本没加载上）退回普通赋值，功能不受影响。 */
    let typeMachine = null;
    if (window.createTextType) {
      typeMachine = window.createTextType(stateEl, {
        typingSpeed: 10,
        deletingSpeed: 5,
        variableSpeed: { min: 5, max: 12 },
        mistakes: 0.25,
        typeEffect: 'fade'
      });
    }
    const setState = (text) => {
      if (typeMachine) typeMachine.setText(text);
      else stateEl.textContent = text;
    };

    /* 流程：进度跑完 → 停在加载页等点击 → 点击后才播幕布动画进入首页。
       没有点击就绝不自动跳转；进度靠 rAF 推进，后台标签页可能不给帧，
       所以 12 秒兜底只把进度补满并放开按钮，仍然等用户点。 */
    let finished = false;
    let exiting = false;
    let done = false;

    const removeNode = (node) => {
      if (node && node.parentNode) node.remove();
    };

    /* 进度完成：进度条补满、开始接收整页点击/触屏，停在原地等用户进入 */
    function markReady() {
      if (finished) return;
      finished = true;
      pctEl.textContent = '100%';
      fill.style.width = '100%';
      fillV.style.transform = 'scaleY(1)';
      setState('CLICK ANYWHERE // 点击任意位置进入');
      boot.classList.add('is-ready');
      armEntry();
    }

    /* 点击后：幕布盖住 → 摘遮罩 → 发 archive:ready（首页入场）→ 拉开幕布 */
    function exitToArchive() {
      if (exiting) return;
      exiting = true;
      boot.removeEventListener('pointerdown', activate);
      window.removeEventListener('keydown', onKeyDown);
      curtain.classList.add('active');
      window.setTimeout(() => removeNode(boot), 560);
      window.setTimeout(() => {
        if (done) return;
        done = true;
        window.dispatchEvent(new Event('archive:ready'));
      }, 640);
      window.setTimeout(() => removeNode(curtain), 1200);
    }

    function activate(event) {
      if (!finished || exiting) return;
      /* 只认主键/触屏，右键与中键不触发 */
      if (event && event.type === 'pointerdown' && event.pointerType === 'mouse' && event.button !== 0) return;
      if (window.__archiveSfx) window.__archiveSfx.enter();
      exitToArchive();
    }

    function onKeyDown(event) {
      if (!finished || exiting) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      activate();
    }

    function armEntry() {
      boot.addEventListener('pointerdown', activate);
      window.addEventListener('keydown', onKeyDown);
    }

    window.setTimeout(markReady, 12000); /* 只兜底进度，不代替点击 */
    const PRELOAD_FILES = [
      'resources/fonts/novecento-wide-bold.woff2', 'resources/fonts/bender.woff2',
      'resources/fonts/source-han-sans-cn-medium.woff2', 'resources/fonts/source-han-serif-cn-heavy.woff2',
      'resources/images/crimson-background.webp',
      'viewer.html?path=archive%2Fwiki%2Fv1%2Findex.html', 'archive/wiki/v1/style.css', 'archive/wiki/v1/app.js', 'archive/wiki/v1/content.js',
      'viewer.html?path=archive%2Fwiki%2Fv2%2Findex.html', 'archive/wiki/v2/style.css', 'archive/wiki/v2/app.js', 'archive/wiki/v2/content.js',
      'viewer.html?path=archive%2Fwiki%2Fv3%2Findex.html', 'archive/wiki/v3/style.css', 'archive/wiki/v3/app.js',
      'archive/wiki/v3/background.png', 'archive/wiki/v3/god.m4a',
      'viewer.html?path=archive%2Fforecast%2Fv1%2Findex.html',
      'viewer.html?path=archive%2Fforecast%2Fv2%2Findex.html', 'archive/forecast/v2/GDF-ALERT-LEVEL-III.mp3',
      'archive/number-of-motion/files/last-local-record.html',
      'archive/number-of-motion/files/local-copy.html',
      'viewer.html?path=resources%2Flocalized%2Fforecast-v1%2Findex.html', 'viewer.html?path=resources%2Flocalized%2Fforecast-v2%2Findex.html',
      'viewer.html?path=archive%2Fpostal-terminal%2Fv1%2Findex.html', 'viewer.html?path=archive%2Fpostal-terminal%2Fv2%2Findex.html',
      'viewer.html?path=archive%2Fpostal-terminal%2Fv3%2Findex.html', 'viewer.html?path=archive%2Fpostal-terminal%2Fv4%2Findex.html', 'viewer.html?path=archive%2Fpostal-terminal%2Fv5%2Findex.html'
    ];
    const totalFiles = PRELOAD_FILES.length;
    let doneFiles = 0;
    let allDone = false;
    PRELOAD_FILES.forEach((url) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onloadend = () => { doneFiles += 1; };
      xhr.onerror = () => { doneFiles += 1; };
      xhr.send();
    });
    const finishPreload = () => { allDone = true; };
    const waitFiles = window.setInterval(() => {
      if (doneFiles >= totalFiles) {
        window.clearInterval(waitFiles);
        finishPreload();
      }
    }, 120);
    window.setTimeout(finishPreload, 9000); // 网络异常时兜底，不让进度条卡死

    const DURATION = 2200;
    const started = performance.now();
    const stages = [
      [30, 'CONNECTING // 连接中'],
      [65, 'DECRYPTING // 解密中'],
      [92, 'RECONSTRUCTING // 重组中']
    ];
    /* 阶段文案要一段一段打出来，所以推进节奏得跟上打字机：
       pct = 0.45*fileRatio + 0.55*easedTime，预加载一完成 fileRatio 直接到 1，
       pct 会瞬间越过 30 和 65，DECRYPTING 就从来没出现过。
       这里改成「一次只进一格 + 每格至少停留 MIN_DWELL」，
       保证三段文案都露过面，而不是一帧跳到最后一格。
       注意不额外要求「上一段打完」：按需求，打字到一半就该打断换新，
       打字机自己会退格重打。 */
    const MIN_DWELL = 460;
    let stageIndex = 0;
    let stageSince = started;
    const tick = (now) => {
      const t = Math.min(1, (now - started) / DURATION);
      const easedTime = 1 - Math.pow(1 - t, 3);
      const fileRatio = totalFiles ? doneFiles / totalFiles : 0;
      let pct = 0;
      if (allDone && t >= 1) {
        pct = 100;
      } else {
        pct = Math.min(99, Math.round(100 * (0.45 * fileRatio + 0.55 * easedTime)));
      }
      const progress = pct / 100;
      pctEl.textContent = pct + '%';
      fill.style.width = pct + '%';
      fillV.style.transform = 'scaleY(' + progress + ')';
      bgimg.style.filter = 'blur(' + Math.round((1 - progress) * 18) + 'px)';
      bgimg.style.opacity = (0.55 + progress * 0.3).toFixed(3);

      /* 百分比跨到哪一格，就至少要走到那一格；但一次只走一格 */
      const hit = stages.findIndex((s) => pct <= s[0]);
      const wanted = hit === -1 ? stages.length - 1 : hit;
      if (wanted > stageIndex && now - stageSince >= MIN_DWELL) {
        stageIndex += 1;
        stageSince = now;
      }
      /* 同一段文案会被打字机忽略，所以每帧调用是安全的 */
      if (!finished) setState(stages[stageIndex][1]);

      if (pct < 100) {
        window.requestAnimationFrame(tick);
      } else {
        markReady(); /* 跑完就停在加载页，等按钮点击 */
      }
    };
    window.requestAnimationFrame(tick);
  })();

