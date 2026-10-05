  (function () {
    const THEMES = ['dark', 'light', 'crimson'];
    const NAMES = { dark: '暗色', light: '亮色', crimson: '黑红' };
    const ICONS = { dark: '🌙', light: '☀️', crimson: '🩸' };
    const TRACKS = {
      dark: 'resources/music/call-of-iberia.mp3',
      light: 'resources/music/CONFRONT.mp3',
      crimson: 'resources/music/Mayors-the-Yearning-Flotsam.mp3'
    };
    const CARD_GOD = {
      '调查维基 v1': '不需要阅读。',
      '调查维基 v2': '不需要阅读。',
      '调查维基 v3': '不需要阅读。',
      '大黄昏预测 v1': '不需要预报。',
      '大黄昏预测 v2': '不需要警报。',
      '本地记录': '不需要打开。',
      '本地副本': '不需要备份。',
      '大黄昏预测 v1 · 汉化': '不需要翻译。',
      '大黄昏预测 v2 · 汉化': '不需要查看。',
      '密码.txt': '不需要密码。',
      'readme.zip': '不需要原件。',
      'local-continuity-probe-0.1.0.jar': '不需要探针。',
      'CHECKSUMS.txt': '不需要校验。',
      'LOCAL_COPY.txt': '不需要改口。',
      'god.m4a': '不需要听。',
      'GDF-ALERT-LEVEL-III.mp3': '不需要编号。',
      'B站 · XIKM HLQA ONYIEN': '不需要关注。',
      '抖音 · VHQ-4K/19': '不需要观看。',
      'XIKM HLQA ONYIEN 解谜': '不需要解谜。',
      '邮路终端解谜': '不需要解答。',
      'B站 · Silverfish_0': '不需要记录。',
      '迷雾论坛': '不需要讨论。',
      'QQ 群链接': '不需要加入。',
      '邮路终端 v1': '不需要投递。',
      '邮路终端 v2': '不需要重发。',
      '邮路终端 v3': '不需要开门。',
      '邮路终端 v4': '不需要归档。',
      '邮路终端 v5': '不需要签署。',
      'first-stamp.png': '不需要盖章。',
      'unattributed-attachment.png': '不需要署名。',
      'life-flow.mp3': '不需要循环。',
      'starrev-stamp.png': '不需要点亮。',
      'night-route-signal.m4a': '不需要收听。',
      'return-portrait.jpg': '不需要回望。',
      '0-silverfish': '不需要前往。',
      'Silverfish-0': '不需要回访。',
      'Rosmontis220': '不需要收藏。'
    };
    const root = document.documentElement;
    const toggle = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    const music = document.getElementById('archive-music');
    let unlocked = false;
    try { unlocked = localStorage.getItem('sf-unlocked') === '1'; } catch (e) { /* storage unavailable */ }

    const available = () => (unlocked ? THEMES : THEMES.slice(0, 2));
    const current = () => THEMES.find((t) => root.classList.contains(t)) || 'dark';

    const applyTrack = (theme) => {
      const file = TRACKS[theme] || TRACKS.dark;
      if (!music || (music.getAttribute('src') || '').indexOf(file) !== -1) return;
      const wasPlaying = !music.paused && !music.muted && window.__archiveSoundAllowed !== false;
      music.setAttribute('src', file);
      try { music.load(); } catch (e) { /* load unavailable */ }
      if (wasPlaying) {
        const attempt = music.play();
        if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
      }
    };

    const applyCardNotes = (theme) => {
      const god = theme === 'crimson';
      document.querySelectorAll('.entry-card').forEach((card) => {
        const desc = card.querySelector('.card-desc');
        const title = card.querySelector('.card-title');
        if (!desc || !title) return;
        if (!desc.dataset.plain) desc.dataset.plain = desc.innerHTML;
        /* 邮路终端的标题里嵌着版本下拉，textContent 会把所有选项文字一起拼进来，
           所以那张卡片自己给出查找用的键（cardKey），其余卡片仍按标题匹配 */
        const note = CARD_GOD[(card.dataset.cardKey || title.textContent).trim()];
        desc.innerHTML = god && note ? note : desc.dataset.plain;
      });
    };

    /* 邮路终端切换版本后要重算这张卡片的描述，所以把入口暴露出来 */
    window.__archiveApplyCardNotes = () => applyCardNotes(current());

    const apply = (theme, persist) => {
      THEMES.forEach((t) => root.classList.toggle(t, t === theme));
      if (icon) icon.textContent = ICONS[theme] || ICONS.dark;
      if (toggle) toggle.setAttribute('aria-label', '切换主题（当前：' + (NAMES[theme] || theme) + '）');
      if (persist) {
        try { localStorage.setItem('theme', theme); } catch (e) { /* storage unavailable */ }
      }
      applyTrack(theme);
      applyCardNotes(theme);
    };

    apply(current(), false);

    if (toggle) {
      let count = 0;
      toggle.addEventListener('click', () => {
        count += 1;

        /* 连点五次解锁 */
        if (count >= 5) {
          count = 0;
          unlocked = true;
          try { localStorage.setItem('sf-unlocked', '1'); } catch (e) { /* storage unavailable */ }
          apply('crimson', true);
          return;
        }

        const list = available();
        const i = list.indexOf(current());
        apply(list[(i + 1) % list.length], true);
      });
    }
  })();

