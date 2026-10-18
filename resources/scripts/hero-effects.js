  
  (function () {
    function init() {
      const page = document.getElementById('page');
      if (!page) return;
      const mods = Array.from(page.querySelectorAll(':scope > .module'));
      const spine = document.getElementById('ak-spine');

      mods.forEach(function (m, i) {
        var n = i.toString().padStart(2, '0');
        m.setAttribute('data-ak-idx', n);
      });

      /* 右侧菱形定位点：点击交给滚动引擎，选中态也由引擎统一维护 */
      if (spine) {
        mods.forEach(function (m, i) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'ak-spine-dot';
          var label = m.getAttribute('aria-label') || ('模块 ' + (i + 1));
          btn.setAttribute('aria-label', label);
          btn.setAttribute('title', label);
          btn.addEventListener('click', function () {
            if (window.__archiveScroll) window.__archiveScroll.scrollToIndex(i);
            if (window.__archiveSfx) window.__archiveSfx.slide();
          });
          spine.appendChild(btn);
        });
      }

      var hero = document.querySelector('.hero');
      if (hero) {
        var now = new Date();
        var dateStr = now.getFullYear() + '-'
          + String(now.getMonth() + 1).padStart(2, '0') + '-'
          + String(now.getDate()).padStart(2, '0');
        var col = document.createElement('div');
        col.className = 'hero-tech-col';
        col.setAttribute('aria-hidden', 'true');
        col.innerHTML =
          '<div class="htc-bar"></div>' +
          '<div class="htc-row"><span class="htc-key">REF</span><span class="htc-val">SF-0-ARC</span></div>' +
          '<div class="htc-row"><span class="htc-key">DATE</span><span class="htc-val">' + dateStr + '</span></div>' +
          '<div class="htc-row"><span class="htc-key">MOD</span><span class="htc-val">08 / 08</span></div>' +
          '<div class="htc-row"><span class="htc-key">STA</span><span class="htc-val">ACTIVE</span></div>';
        hero.style.position = 'relative';
        hero.appendChild(col);
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();
