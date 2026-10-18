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
    /* 移动端轮播接管后不分页：全部匹配项一次性交给轮播 */
    let carouselActive = false;
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
      const paged = !carouselActive;
      const perPage = paged ? pageSize : matches.length;
      const totalPages = paged ? Math.max(1, Math.ceil(matches.length / pageSize)) : 1;
      currentPage = Math.min(currentPage, totalPages - 1);
      const pageStart = paged ? currentPage * pageSize : 0;
      const pageCards = new Set(paged ? matches.slice(pageStart, pageStart + pageSize) : matches);

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
      pageStatus.textContent = paged ? '第 ' + (currentPage + 1) + ' / ' + totalPages + ' 页' : '全部文件';
      prev.disabled = currentPage === 0 || matches.length === 0;
      next.disabled = currentPage >= totalPages - 1 || matches.length === 0;
      empty.classList.toggle('is-visible', matches.length === 0);
      /* 移动端轮播据此重建圆点并回到第一张 */
      grid.dispatchEvent(new CustomEvent('archive:downloads-update'));
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
    /* 轮播接管 / 退出时切换分页策略 */
    grid.addEventListener('archive:carousel-state', (event) => {
      carouselActive = !!(event.detail && event.detail.active);
      currentPage = 0;
      apply();
    });
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

