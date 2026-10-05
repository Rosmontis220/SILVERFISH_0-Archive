  (function () {
    const grid = document.getElementById('download-grid');
    const search = document.getElementById('download-search');
    const count = document.getElementById('download-result-count');
    const empty = document.getElementById('download-empty');
    const prev = document.getElementById('download-prev');
    const next = document.getElementById('download-next');
    const pageStatus = document.getElementById('download-page-status');
    const filters = Array.from(document.querySelectorAll('[data-download-filter]'));
    if (!grid || !search || !count || !empty || !prev || !next || !pageStatus || !filters.length) return;

    const cards = Array.from(grid.querySelectorAll('.download-card'));
    const pageSize = 4;
    let activeType = 'all';
    let currentPage = 0;

    const apply = (direction) => {
      const query = search.value.trim().toLocaleLowerCase();
      const matches = cards.filter((card) => {
        const typeMatch = activeType === 'all' || card.dataset.downloadType === activeType;
        /* 关键词与可见文字一起匹配，这样按归属模块名也能搜到 */
        const text = ((card.dataset.downloadSearch || '') + ' ' + card.textContent).toLocaleLowerCase();
        return typeMatch && (!query || text.includes(query));
      });
      const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
      currentPage = Math.min(currentPage, totalPages - 1);
      const pageStart = currentPage * pageSize;
      const pageCards = new Set(matches.slice(pageStart, pageStart + pageSize));

      cards.forEach((card) => {
        card.classList.toggle('is-filtered', !matches.includes(card));
        card.classList.toggle('is-page-hidden', !pageCards.has(card));
      });
      grid.classList.remove('download-grid--next', 'download-grid--prev');
      if (direction && matches.length > 0) {
        void grid.offsetWidth;
        grid.classList.add(direction === 'next' ? 'download-grid--next' : 'download-grid--prev');
      }
      count.textContent = '显示 ' + matches.length + ' / ' + cards.length + ' 个文件';
      pageStatus.textContent = '第 ' + (currentPage + 1) + ' / ' + totalPages + ' 页';
      prev.disabled = currentPage === 0 || matches.length === 0;
      next.disabled = currentPage >= totalPages - 1 || matches.length === 0;
      empty.classList.toggle('is-visible', matches.length === 0);
    };

    const resetPage = () => {
      currentPage = 0;
      apply();
    };

    filters.forEach((button) => {
      button.addEventListener('click', () => {
        activeType = button.dataset.downloadFilter || 'all';
        filters.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        resetPage();
      });
    });
    search.addEventListener('input', resetPage);
    prev.addEventListener('click', () => {
      if (currentPage === 0) return;
      currentPage -= 1;
      apply('prev');
    });
    next.addEventListener('click', () => {
      currentPage += 1;
      apply('next');
    });
    apply();
  })();

