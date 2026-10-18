/* 移动端卡片轮播
   参考 React Bits Carousel 的「卡片横向排列」思路，但内容是文字卡，不做 3D 旋转，
   改成横向吸附 + 居中卡片高亮，避免每个模块在手机上被拉成一长条。
   仅 ≤860px 生效。文件下载模块带分页/筛选，卡片可见性会变，
   由 downloads.js 在每次 apply 后派发 archive:downloads-update，这里据此重建圆点。 */
(() => {
  'use strict';

  const mq = window.matchMedia('(max-width: 860px)');
  const grids = Array.from(document.querySelectorAll('.page .card-grid'));
  let instances = [];

  const isVisible = (card) => card.offsetParent !== null;

  const centerOffset = (grid, card) => {
    const g = grid.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    return c.left + c.width / 2 - (g.left + g.width / 2);
  };

  function setup(grid) {
    const allCards = Array.from(grid.querySelectorAll(':scope > .entry-card'));
    if (allCards.length < 2) return null;

    /* 下载模块卡片多、翻页/筛选频繁，固定用计数器，不放圆点 */
    const alwaysCounter = grid.classList.contains('card-grid--clamp2');

    grid.dataset.carousel = '';

    const dots = document.createElement('div');
    dots.className = 'carousel-dots';
    dots.setAttribute('role', 'tablist');
    dots.setAttribute('aria-label', '卡片切换');
    grid.insertAdjacentElement('afterend', dots);

    /* 卡片太多时圆点排不下，改成 01 / 21 这样的计数 */
    const counter = document.createElement('div');
    counter.className = 'carousel-counter';
    counter.hidden = true;
    const counterIndex = document.createElement('b');
    const counterTotal = document.createElement('span');
    counter.append(counterIndex, counterTotal);
    dots.insertAdjacentElement('afterend', counter);

    let cards = [];
    let buttons = [];
    let current = -1;
    let frame = 0;
    let destroyed = false;

    const update = () => {
      frame = 0;
      if (destroyed || !cards.length) return;
      const g = grid.getBoundingClientRect();
      const mid = g.left + g.width / 2;
      let best = 0;
      let bestDistance = Infinity;
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - mid);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
        card.classList.remove('is-center');
      });
      cards[best].classList.add('is-center');
      if (!counter.hidden) {
        counterIndex.textContent = String(best + 1).padStart(2, '0');
        counterTotal.textContent = '/ ' + String(cards.length).padStart(2, '0');
      }
      if (best !== current) {
        current = best;
        buttons.forEach((button, index) => {
          button.classList.toggle('is-current', index === best);
          button.setAttribute('aria-selected', String(index === best));
        });
      }
    };

    /* 可见卡片变化（翻页 / 筛选）时重建指示器，并回到第一张 */
    const rebuild = () => {
      if (destroyed) return;
      cards = allCards.filter(isVisible);
      if (cards.length >= 2) grid.dataset.carousel = '';
      else delete grid.dataset.carousel;
      const many = alwaysCounter || cards.length > 8;
      dots.textContent = '';
      buttons = many ? [] : cards.map((card, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'carousel-dot';
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-label', '第 ' + (index + 1) + ' 张，共 ' + cards.length + ' 张');
        button.addEventListener('click', () => {
          grid.scrollTo({
            left: grid.scrollLeft + centerOffset(grid, card),
            behavior: 'smooth'
          });
        });
        dots.appendChild(button);
        return button;
      });
      dots.hidden = many || cards.length < 2;
      counter.hidden = !many;
      current = -1;
      /* 上一页残留的高亮要清掉，隐藏的卡片也要恢复到普通状态 */
      allCards.forEach((card) => card.classList.remove('is-center'));
      if (grid.scrollLeft !== 0) grid.scrollTo({ left: 0, behavior: 'auto' });
      update();
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    /* 同步重建：下载模块切换分页后会立刻派发事件，不等下一帧 */
    const onDownloadsUpdate = () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      rebuild();
    };

    grid.addEventListener('scroll', onScroll, { passive: true });
    grid.addEventListener('archive:downloads-update', onDownloadsUpdate);

    rebuild();
    /* 通知下载模块：轮播已接管，改用「一次性展示全部」的分页策略。
       事件之后立刻再重建一次，保证即使事件没被接住，指示器也按最终可见卡片算 */
    grid.dispatchEvent(new CustomEvent('archive:carousel-state', { detail: { active: true } }));
    rebuild();

    /* 兜底：若分页逻辑没跟上（旧缓存等），直接把被分页隐藏的卡片放出来 */
    if (alwaysCounter && allCards.some((card) => card.classList.contains('is-page-hidden'))) {
      allCards.forEach((card) => card.classList.remove('is-page-hidden'));
      rebuild();
    }

    return {
      grid,
      update,
      rebuild,
      teardown() {
        destroyed = true;
        if (frame) window.cancelAnimationFrame(frame);
        grid.removeEventListener('scroll', onScroll);
        grid.removeEventListener('archive:downloads-update', onDownloadsUpdate);
        delete grid.dataset.carousel;
        allCards.forEach((card) => card.classList.remove('is-center'));
        if (dots.parentNode) dots.remove();
        if (counter.parentNode) counter.remove();
        /* 轮播退出后把分页交还给下载模块 */
        grid.dispatchEvent(new CustomEvent('archive:carousel-state', { detail: { active: false } }));
      }
    };
  }

  function teardownAll() {
    instances.forEach((item) => item.teardown());
    instances = [];
  }

  function build() {
    teardownAll();
    if (!mq.matches) return;
    instances = grids.map(setup).filter(Boolean);
  }

  build();
  if (mq.addEventListener) mq.addEventListener('change', build);
  else if (mq.addListener) mq.addListener(build);

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (mq.matches) instances.forEach((item) => item.rebuild());
    }, 150);
  }, { passive: true });
})();
