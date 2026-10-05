  /* 点击与翻页音效 */
  (function () {
    const SOURCES = {
      click: 'resources/sfx/legacy/common_click.52e9d4.mp3',
      menu: 'resources/sfx/legacy/menu_click.d51e70.mp3',
      page: 'resources/sfx/legacy/arrow_click.a72c10.mp3',
      enter: 'resources/sfx/legacy/home_enter.6aefd5.mp3',
      close: 'resources/sfx/legacy/close_click.fe1dc4.mp3'
    };
    const VOLUME = 1;
    const MUSIC_VOLUME = 1;
    const MAX_VOICES = 4;
    const pools = {};

    const allowed = () => window.__archiveSoundAllowed !== false;

    const music = document.getElementById('archive-music');
    if (music) music.volume = MUSIC_VOLUME;

    const slotFor = (key) => {
      const src = SOURCES[key];
      if (!src || typeof window.Audio !== 'function') return null;
      if (!pools[key]) {
        const base = new window.Audio(src);
        base.preload = 'auto';
        base.volume = VOLUME;
        pools[key] = { base, voices: [] };
      }
      return pools[key];
    };

    const play = (key) => {
      if (!allowed()) return;
      const slot = slotFor(key);
      if (!slot) return;
      let voice = slot.voices.find((v) => v.paused || v.ended);
      if (!voice) {
        if (slot.voices.length >= MAX_VOICES) {
          const oldest = slot.voices.shift();
          try { oldest.pause(); } catch (e) { /* 忽略 */ }
        }
        voice = slot.base.cloneNode(true);
        voice.volume = VOLUME;
        slot.voices.push(voice);
      }
      try { voice.currentTime = 0; } catch (e) { /* 忽略 */ }
      const attempt = voice.play();
      if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
    };

    window.__archiveSfx = {
      click: () => play('click'),
      menu: () => play('menu'),
      slide: () => play('page'),
      enter: () => play('enter'),
      close: () => play('close'),
      preload: () => Object.keys(SOURCES).forEach(slotFor)
    };

    window.__archiveSfx.preload();

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!target || !target.closest) return;
      if (target.closest('#sound-toggle')) return;
      if (target.closest('#module-up, #module-down')) return;
      if (target.closest('.nav-toc-item')) { play('menu'); return; }
      if (target.closest('a, button, .entry-card')) play('click');
    }, true);
  })();

