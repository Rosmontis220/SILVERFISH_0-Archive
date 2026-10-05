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

    /* 收场只留这一个出口：摘遮罩、摘幕布、发 archive:ready。
       进度是靠 rAF 推进的，而浏览器在后台标签页、被完全遮挡的窗口等情况下会不给帧，
       那样百分比会永远停在 99% 以下，遮罩连同「进入档案库」按钮一起盖住——
       整页就再也点不动了。所以到点无条件撤掉，不等动画。
       正常路径最慢是「预载兜底 9 秒 + 收场 1.7 秒」，12 秒不会误伤。
       这里刻意不发 auto-unlock：那是「本次会话已进入过」的自动解锁旁路，
       而兜底只是把遮罩撤掉，页面仍应停在入口，等用户自己点「进入档案库」。 */
    let done = false;
    const teardown = () => {
      if (done) return;
      done = true;
      if (boot.parentNode) boot.remove();
      if (curtain.parentNode) curtain.remove();
      window.dispatchEvent(new Event('archive:ready'));
    };
    window.setTimeout(teardown, 12000);
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
      [92, 'RECONSTRUCTING // 重组中'],
      [100, 'ARCHIVE READY // 档案就绪']
    ];
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
      const stage = stages.find((s) => pct <= s[0]) || stages[stages.length - 1];
      stateEl.textContent = stage[1];
      if (pct < 100) {
        window.requestAnimationFrame(tick);
      } else {
        stateEl.textContent = 'ARCHIVE READY // 档案就绪';
        window.setTimeout(() => {
          curtain.classList.add('active');
          window.setTimeout(() => {
            boot.remove();
          }, 620);
          window.setTimeout(teardown, 1450);
        }, 260);
      }
    };
    window.requestAnimationFrame(tick);
  })();

