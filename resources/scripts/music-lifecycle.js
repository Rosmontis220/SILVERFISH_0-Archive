  (function () {
    const music = document.getElementById('archive-music');
    if (!music) return;
    const play = () => {
      if (window.__archiveSoundAllowed === false) return;
      const attempt = music.play();
      if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
    };
    window.addEventListener('pageshow', play);
    window.addEventListener('pointerdown', play, { once: true });
    window.addEventListener('keydown', play, { once: true });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) play();
    });
    music.addEventListener('canplay', play, { once: true });
    window.setTimeout(play, 80);
  })();

