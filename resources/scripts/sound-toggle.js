  (function () {
    const btn = document.getElementById('sound-toggle');
    const icon = document.getElementById('sound-icon');
    const music = document.getElementById('archive-music');
    if (!btn || !music) return;
    let pref = 'on';
    try { pref = localStorage.getItem('sf-sound') || 'on'; } catch (e) { /* storage unavailable */ }
    let userMuted = pref === 'off';
    let tempMuted = false;
    window.__archiveSoundAllowed = !userMuted;
    const update = () => {
      const silent = music.paused || music.muted;
      icon.textContent = silent ? '🔇' : '🔊';
      btn.setAttribute('aria-label', silent ? '开启背景音乐' : '静音');
      btn.title = silent ? '开启背景音乐' : '静音';
    };
    const setPref = (val) => {
      try { localStorage.setItem('sf-sound', val); } catch (e) { /* storage unavailable */ }
    };
    btn.addEventListener('click', () => {
      if (music.paused || music.muted) {
        window.__archiveSoundAllowed = true;
        userMuted = false;
        setPref('on');
        music.muted = false;
        const attempt = music.play();
        if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
      } else {
        window.__archiveSoundAllowed = false;
        userMuted = true;
        setPref('off');
        music.pause();
      }
    });
    if (userMuted) music.muted = true;
    const suspendForBackground = () => {
      if (!music.paused && !music.muted && !userMuted) {
        tempMuted = true;
        music.muted = true;
      }
    };
    const resumeFromBackground = () => {
      if (!tempMuted) return;
      tempMuted = false;
      music.muted = false;
      if (!userMuted && music.paused) {
        const attempt = music.play();
        if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) suspendForBackground();
      else resumeFromBackground();
    });
    window.addEventListener('blur', suspendForBackground);
    window.addEventListener('focus', resumeFromBackground);
    window.addEventListener('pagehide', suspendForBackground);
    ['play', 'pause', 'volumechange'].forEach((ev) => music.addEventListener(ev, update));
    update();
  })();

