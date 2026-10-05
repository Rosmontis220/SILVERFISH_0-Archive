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
  frame.addEventListener('load', () => { injected = false; window.setTimeout(inject, 0); });
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
