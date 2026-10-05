(() => {
  'use strict';
  if (window.__archiveReturnLoaded) return;
  window.__archiveReturnLoaded = true;
  const script = document.currentScript;
  const home = script?.dataset.viewerHome || new URL('../../index.html', location.href).href;
  const mount = () => {
    if (!document.body || document.getElementById('archive-return')) return !!document.getElementById('archive-return');
    const style = document.createElement('style');
    style.id = 'archive-return-style';
    style.textContent = '.archive-return{position:fixed;bottom:14px;right:14px;z-index:2147483000;font:11px/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.08em;color:var(--ink,#f3f3f2);background:var(--glass-strong,rgba(20,21,23,.86));border:1px solid var(--line-strong,rgba(255,255,255,.17));padding:10px 12px;border-radius:4px;text-decoration:none;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}.archive-return:hover,.archive-return:focus-visible{color:#d94135;border-color:#d94135;outline:none}';
    (document.head || document.body).appendChild(style);
    const link = document.createElement('a');
    link.id = 'archive-return';
    link.className = 'archive-return';
    link.href = home;
    link.textContent = '← BACK TO ARCHIVE // 返回存档索引';
    link.setAttribute('aria-label', 'BACK TO ARCHIVE / 返回存档索引');
    link.addEventListener('click', event => {
      if (window.parent !== window) { event.preventDefault(); window.parent.postMessage({type:'archive-home'}, '*'); }
    });
    document.body.appendChild(link);
    return true;
  };
  mount();
  const timer = window.setInterval(() => { if (mount()) window.clearInterval(timer); }, 250);
  window.setTimeout(() => window.clearInterval(timer), 15000);
})();
