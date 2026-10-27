(() => {
  'use strict';
  const frame = document.getElementById('archive-frame');
  const params = new URLSearchParams(location.search);
  const rawPath = params.get('path') || '';
  const path = rawPath.replace(/^\/+/, '');
  if (!frame || !/^(?:archive\/(?:wiki|forecast|number-of-motion|postal-terminal)|resources\/localized)\/.+\.html$/i.test(path)) {
    location.replace('index.html');
    return;
  }
  const sourceUrl = new URL(path, location.href);
  const versionMatch = path.match(/^archive\/postal-terminal\/v([1-5])\//i);
  const postalVersion = versionMatch ? Number(versionMatch[1]) : 0;
  const scriptsRoot = new URL('resources/scripts/', location.href);
  const returnScript = new URL('archive-return.js', scriptsRoot);
  const consoleScript = new URL('postal-console/console.js', scriptsRoot);
  const sound = key => window.__archiveSfx?.play(key);
  let injected = false;

  /* 加载指示器：iframe 加载归档网页期间覆盖在上面的像素指示层 */
  const loadingEl = document.getElementById('viewer-loading');
  let loadingHidden = false;
  let loadingShownAt = 0;
  /* 最小可见时长：本地文件几十毫秒就加载完，指示器一闪而过反而像闪烁。
     至少停留 MIN_VISIBLE 才撤下，让它读起来是「加载过」而不是「闪了一下」。 */
  const MIN_VISIBLE = 420;
  const hideLoading = () => {
    if (loadingHidden || !loadingEl) return;
    loadingHidden = true;
    const elapsed = performance.now() - loadingShownAt;
    const wait = Math.max(0, MIN_VISIBLE - elapsed);
    window.setTimeout(() => {
      loadingEl.classList.add('is-hidden');
      /* 淡出结束后彻底移出，避免挡住 iframe 的点击 */
      window.setTimeout(() => { if (loadingEl && loadingEl.parentNode) loadingEl.parentNode.removeChild(loadingEl); }, 320);
    }, wait);
  };
  if (loadingEl) loadingShownAt = performance.now();
  const addScript = (doc, src, attrs = {}) => {
    const script = doc.createElement('script');
    script.src = src;
    Object.entries(attrs).forEach(([key,value]) => script.setAttribute(key, value));
    (doc.head || doc.body || doc.documentElement).appendChild(script);
    return script;
  };
  const inject = () => {
    const doc = frame.contentDocument;
    if (!doc || !doc.body || doc.documentElement.dataset.archiveEnhanced === '1') return;
    doc.documentElement.dataset.archiveEnhanced = '1';
    addScript(doc, returnScript.href, { 'data-viewer-home': new URL('index.html', location.href).href });
    if (postalVersion) addScript(doc, consoleScript.href, {'data-version': String(postalVersion), 'data-viewer-home': new URL('index.html', location.href).href});
    doc.addEventListener('click', event => {
      const target = event.target?.closest?.('a,button');
      if (target && !target.closest('#postal-control')) window.__archiveSfx?.play(target.classList.contains('archive-return') ? 'close' : 'click');
    }, true);
    injected = true;
  };
  frame.addEventListener('load', () => {
    injected = false;
    /* 归档网页已载入，撤下加载指示器 */
    hideLoading();
    window.setTimeout(inject, 0);
  });
  const reinjectTimer = window.setInterval(() => { if (frame.contentDocument && !frame.contentDocument.documentElement?.dataset.archiveEnhanced) inject(); }, 250);
  window.addEventListener('beforeunload', () => window.clearInterval(reinjectTimer));
  window.addEventListener('message', event => {
    if (event.source !== frame.contentWindow) return;
    const data = event.data || {};
    if (data.type === 'archive-home') { sound('close'); location.href = new URL('index.html', location.href).href; }
    if (data.type === 'archive-sfx') sound(data.key);
  });
  frame.src = sourceUrl.href;
})();
