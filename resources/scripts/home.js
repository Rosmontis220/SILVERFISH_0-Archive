(() => {
  'use strict';
  const localPage = /^(?:archive|resources\/localized)\/.+\.html(?:$|#|\?)/i;
  document.addEventListener('click', event => {
    const link = event.target?.closest?.('a.entry-card');
    if (!link || link.classList.contains('download-card') || link.target === '_blank') return;
    const href = link.getAttribute('href') || '';
    if (!localPage.test(href) || href.startsWith('viewer.html?')) return;
    event.preventDefault();
    location.href = `viewer.html?path=${encodeURIComponent(href)}`;
  }, true);
})();
