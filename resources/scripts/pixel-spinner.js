/* Pixel Spinner（像素风加载指示器）
   参考 8bitcn 的 diamond 变体：8 个 4x4 像素方块沿菱形排列，
   每个像素的淡入淡出依次错开 0.1s，形成一圈旋转的点阵光。
   纯 SVG + CSS，无脚本、无依赖。 */

(() => {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';

  /* 菱形 8 个像素的坐标：上、右上、右、右下、下、左下、左、左上 */
  const PIXELS = [
    [8, 0], [12, 4], [16, 8], [12, 12],
    [8, 16], [4, 12], [0, 8], [4, 4]
  ];

  const build = (host) => {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 20 20');
    svg.setAttribute('class', 'pixel-spinner');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');

    PIXELS.forEach(([x, y], i) => {
      const rect = document.createElementNS(SVG_NS, 'rect');
      rect.setAttribute('x', String(x));
      rect.setAttribute('y', String(y));
      rect.setAttribute('width', '4');
      rect.setAttribute('height', '4');
      /* 第 i 个像素延迟 i * 0.1s，形成旋转感 */
      rect.setAttribute('class', 'pixel-spinner__px pixel-spinner__px--' + (i + 1));
      svg.appendChild(rect);
    });

    host.appendChild(svg);
  };

  const hosts = document.querySelectorAll('[data-pixel-spinner]');
  hosts.forEach(build);
})();
