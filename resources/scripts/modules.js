  (function () {
    const page = document.getElementById('page');
    if (!page) return;
    const mods = Array.from(page.querySelectorAll(':scope > .module'));
    const body = document.body;
    const root = document.documentElement;
    const scroller = () => window.__archiveScroll;
    const locked = () => !body.classList.contains('is-entered');

    /* 侧边栏目录 */
    const nav = document.querySelector('.nav-system');
    const burger = document.getElementById('nav-burger');
    const tocList = document.getElementById('nav-toc');
    const panelSlot = document.getElementById('nav-panel-slot');
    const navActions = nav ? nav.querySelector('.nav-actions') : null;
    const soundBtn = document.getElementById('sound-toggle');
    const themeBtn = document.getElementById('theme-toggle');
    const repoLink = navActions ? navActions.querySelector('a.nav-action-item') : null;
    const navModules = document.getElementById('nav-modules');
    const navCenter = nav ? nav.querySelector('.nav-center') : null;
    const mobileQuery = window.matchMedia('(max-width: 860px)');
    const isMobile = () => mobileQuery.matches;

    const TOC_ICONS = [
      '<rect x="5.6" y="5.6" width="12.8" height="12.8" transform="rotate(45 12 12)"/><circle cx="12" cy="12" r="2"/>',
      '<path d="M7 3.5h6.5L18 8v12.5H7z"/><path d="M13.5 3.5V8H18"/><path d="M9.8 12h5.4M9.8 15.5h5.4"/>',
      '<path d="M3.5 17.5h17"/><circle cx="12" cy="11" r="4"/><path d="M12 3v2.2M5.6 5.9l1.6 1.6M18.4 5.9l-1.6 1.6"/>',
      '<circle cx="12" cy="12" r="8"/><path d="M12 4v2.4M12 17.6V20M4 12h2.4M17.6 12H20"/><circle cx="12" cy="12" r="2.4"/>',
      '<rect x="3.4" y="6.2" width="17.2" height="11.6" rx="1"/><path d="M3.9 6.9 12 12.4l8.1-5.5"/>',
      '<circle cx="12" cy="12" r="8"/><path d="M4 12h16"/><path d="M12 4c2.6 2.4 2.6 13.6 0 16M12 4c-2.6 2.4-2.6 13.6 0 16"/>',
      '<path d="M12 3.8v9.4"/><path d="M8.2 9.4l3.8 3.8 3.8-3.8"/><path d="M4.8 19.2h14.4"/>',
      '<path d="M10.2 13.8a3.6 3.6 0 0 1 0-5.1l2-2a3.6 3.6 0 0 1 5.1 5.1l-.9.9"/><path d="M13.8 10.2a3.6 3.6 0 0 1 0 5.1l-2 2a3.6 3.6 0 0 1-5.1-5.1l.9-.9"/>',
      '<g transform="scale(1.5)"><path fill="currentColor" stroke="none" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></g>'
    ];
    const makeTocIcon = (idx) => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'toc-icon');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '1.6');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      svg.setAttribute('aria-hidden', 'true');
      svg.innerHTML = TOC_ICONS[idx] || '';
      return svg;
    };

    const go = (index, silent) => {
      const scroller = window.__archiveScroll;
      if (!scroller) return;
      const target = Math.max(0, Math.min(mods.length - 1, index));
      if (target === scroller.index) return;
      if (!silent && window.__archiveSfx) window.__archiveSfx.slide();
      scroller.scrollToIndex(target);
    };

    const closeMenu = () => {
      if (!nav || !nav.classList.contains('menu-open')) return;
      nav.classList.remove('menu-open');
      if (burger) burger.setAttribute('aria-expanded', 'false');
    };

    const tocItems = [];
    if (tocList) {
      mods.forEach((m, idx) => {
        const name = m.getAttribute('aria-label') || ('模块 ' + (idx + 1));
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'nav-toc-item';
        btn.title = name;
        btn.setAttribute('aria-label', name);
        btn.appendChild(makeTocIcon(idx));
        const wrap = document.createElement('span');
        wrap.className = 'toc-label';
        const no = m.querySelector('.series-name .no');
        if (no) {
          const noEl = document.createElement('span');
          noEl.className = 'toc-no';
          noEl.textContent = no.textContent.trim();
          wrap.appendChild(noEl);
        }
        const nameEl = document.createElement('span');
        nameEl.textContent = name;
        wrap.appendChild(nameEl);
        btn.appendChild(wrap);
        btn.addEventListener('click', () => jumpTo(idx));
        li.appendChild(btn);
        tocList.appendChild(li);
        tocItems.push(btn);
      });
    }

    const syncNavLayout = () => {
      if (!nav || !panelSlot) return;
      if (isMobile()) {
        if (navModules) panelSlot.parentNode.insertBefore(navModules, panelSlot);
        [repoLink, themeBtn].forEach((el) => { if (el) panelSlot.appendChild(el); });
        if (soundBtn && burger) nav.insertBefore(soundBtn, burger);
      } else {
        if (navModules && navCenter) navCenter.appendChild(navModules);
        if (navActions && soundBtn) navActions.appendChild(soundBtn);
        if (navActions && repoLink) navActions.insertBefore(repoLink, soundBtn);
        if (navActions && themeBtn) navActions.appendChild(themeBtn);
        closeMenu();
      }
    };

    if (burger) {
      burger.addEventListener('click', () => {
        const open = nav.classList.toggle('menu-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (window.__archiveSfx) (open ? window.__archiveSfx.menu : window.__archiveSfx.close)();
      });
    }
    document.addEventListener('click', (e) => {
      if (!nav || !nav.classList.contains('menu-open')) return;
      const t = e.target;
      if (t && t.closest && t.closest('.nav-system')) return;
      closeMenu();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
    if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', syncNavLayout);
    else if (mobileQuery.addListener) mobileQuery.addListener(syncNavLayout);
    syncNavLayout();

    /* 进入档案库：解锁后停在首屏，不自动跳到第一个内容模块 */
    const unlock = () => {
      if (!locked()) return;
      try { sessionStorage.setItem('sf-entry', '1'); } catch (e) { /* storage unavailable */ }
      const scroller = window.__archiveScroll;
      if (scroller) scroller.unlock();
      else {
        root.classList.remove('scroll-locked');
        page.classList.remove('locked');
        body.classList.add('is-entered');
      }
    };

    const jumpTo = (i) => {
      if (locked()) unlock();
      go(i);
      closeMenu();
    };

    const shift = (dir) => go((window.__archiveScroll?.index ?? 0) + dir);

    /* 加载页点击后，boot 播完幕布并发 archive:ready，这里解锁并停在首屏 */
    window.addEventListener('archive:ready', () => {
      if (locked()) unlock();
    });

    window.addEventListener('archive:module-change', (event) => {
      const index = event.detail ? event.detail.index : 0;
      tocItems.forEach((el, idx) => el.classList.toggle('is-current', idx === index));
    });

    document.addEventListener('click', (e) => {
      const card = e.target && e.target.closest ? e.target.closest('.entry-card') : null;
      if (!card) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      try { sessionStorage.setItem('sf-return', '1'); } catch (err) { /* storage unavailable */ }
      try { sessionStorage.setItem('sf-module', String(window.__archiveScroll?.index ?? 0)); } catch (err) { /* storage unavailable */ }
    }, true);

    window.addEventListener('keydown', (e) => {
      if (locked()) return;
      const tag = (e.target && e.target.tagName) || '';
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); shift(1); }
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); shift(-1); }
      else if (e.key === 'Home') { e.preventDefault(); go(0); }
      else if (e.key === 'End') { e.preventDefault(); go(mods.length - 1); }
    });

    /* 本次会话已进入过：boot.js 会直接跳过遮罩，这里补上解锁与滚动位置 */
    if (root.classList.contains('auto-unlock')) {
      unlock();
      let origin = 1;
      try {
        const raw = sessionStorage.getItem('sf-module');
        const parsed = raw === null ? NaN : parseInt(raw, 10);
        if (!Number.isNaN(parsed)) origin = Math.max(0, Math.min(mods.length - 1, parsed));
      } catch (e) { /* storage unavailable */ }
      window.setTimeout(() => {
        const scroller = window.__archiveScroll;
        if (scroller) scroller.scrollToIndex(origin, true);
      }, 60);
    }
  })();
