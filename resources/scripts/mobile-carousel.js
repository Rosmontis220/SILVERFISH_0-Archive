/* 移动端卡片轮播
   参考 React Bits Carousel 的「卡片横向排列」思路，但内容是文字卡，不做 3D 旋转，
   改成横向吸附 + 居中卡片高亮，避免每个模块在手机上被拉成一长条。
   仅 ≤860px 生效；下载模块有自己的分页器，不参与。 */
(() => {
  'use strict';

  const mq = window.matchMedia('(max-width: 860px)');
  const grids = Array.from(document.querySelectorAll('.page .card-grid'))
    .filter((grid) => !grid.classList.contains('card-grid--clamp2'));
  let instances = [];

  const centerOffset = (grid, card) => {
    const g = grid.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    return c.left + c.width / 2 - (g.left + g.width / 2);
  };

  function setup(grid) {
    const cards = Array.from(grid.querySelectorAll(':scope > .entry-card'));
    if (cards.length < 2) return null;

    grid.dataset.carousel = '';

    const dots = document.createElement('div');
    dots.className = 'carousel-dots';
    dots.setAttribute('role', 'tablist');
    dots.setAttribute('aria-label', '卡片切换');

    let current = -1;
    const buttons = cards.map((card, index) => {
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
    grid.insertAdjacentElement('afterend', dots);

    let frame = 0;
    const update = () => {
      frame = 0;
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
      if (best !== current) {
        current = best;
        buttons.forEach((button, index) => {
          button.classList.toggle('is-current', index === best);
          button.setAttribute('aria-selected', String(index === best));
        });
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    grid.addEventListener('scroll', onScroll, { passive: true });

    update();

    return {
      grid,
      dots,
      cards,
      buttons,
      update,
      onScroll,
      teardown() {
        grid.removeEventListener('scroll', onScroll);
        delete grid.dataset.carousel;
        cards.forEach((card) => card.classList.remove('is-center'));
        if (dots.parentNode) dots.remove();
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
      if (mq.matches && instances.length) instances.forEach((item) => item.update());
    }, 150);
  }, { passive: true });
})();
