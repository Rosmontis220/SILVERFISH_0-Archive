/* Decrypted Text 效果（原生实现，不依赖 React）
   参考 React Bits 的 DecryptedText：未解出的字符每帧换成随机字形并压暗，
   按顺序从左到右逐字解出，最后恢复成原文。
   触发时机：加载页点击进入、幕布揭开、首页入场的那一刻（archive:ready）。 */
(() => {
  'use strict';

  const nodes = Array.from(document.querySelectorAll('[data-decrypt]'));
  if (!nodes.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+-/<>';
  const SPEED = 40;        /* 每帧毫秒 */
  const ITERATIONS = 30;   /* 总帧数 */

  const randomGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

  const build = (node) => {
    const text = node.dataset.decrypt || node.textContent.trim();
    node.setAttribute('aria-label', text);
    const inner = document.createElement('span');
    inner.className = 'decrypt-inner';
    inner.setAttribute('aria-hidden', 'true');
    node.textContent = '';
    node.appendChild(inner);
    return { text, inner };
  };

  const run = (node, delay) => {
    const { text, inner } = build(node);
    const cells = [];
    for (let i = 0; i < text.length; i += 1) {
      const ch = text[i];
      const span = document.createElement('span');
      span.className = 'decrypt-char';
      span.textContent = ch;
      inner.appendChild(span);
      cells.push({ span, ch, isSpace: ch === ' ' });
    }

    const paint = (progress) => {
      for (let i = 0; i < cells.length; i += 1) {
        const cell = cells[i];
        if (cell.isSpace) continue;
        /* 从左到右依次解出，最后一小段留作收尾 */
        const revealAt = ((i + 1) / cells.length) * 0.92;
        if (progress >= revealAt) {
          if (cell.span.textContent !== cell.ch) cell.span.textContent = cell.ch;
          cell.span.classList.remove('is-scrambled');
        } else {
          cell.span.textContent = randomGlyph();
          cell.span.classList.add('is-scrambled');
        }
      }
    };

    window.setTimeout(() => {
      paint(0);
      let frame = 0;
      const timer = window.setInterval(() => {
        frame += 1;
        paint(frame / ITERATIONS);
        if (frame >= ITERATIONS) {
          window.clearInterval(timer);
          paint(1);
          inner.textContent = text;
        }
      }, SPEED);
    }, delay);
  };

  let started = false;
  const start = () => {
    if (started || reducedMotion.matches) return;
    started = true;
    nodes.forEach((node, i) => run(node, i * 180));
  };

  window.addEventListener('archive:ready', start);
  /* 回访/直接进入的旁路：没有遮罩也没有 ready 事件 */
  if (document.documentElement.classList.contains('auto-unlock')) start();
})();
