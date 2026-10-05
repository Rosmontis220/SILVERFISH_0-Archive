(() => {
  'use strict';
  const root = new URL('../sfx/', document.currentScript.src);
  const SOURCES = {
    click: 'legacy/common_click.52e9d4.mp3',
    menu: 'legacy/menu_click.d51e70.mp3',
    slide: 'legacy/arrow_click.a72c10.mp3',
    enter: 'legacy/home_enter.6aefd5.mp3',
    close: 'legacy/close_click.fe1dc4.mp3'
  };
  const prefKey = 'sf-sound';
  let muted = false;
  try { muted = localStorage.getItem(prefKey) === 'off'; } catch (e) {}
  const pools = new Map();
  const maxVoices = 4;
  const allowed = () => !muted;
  const play = key => {
    if (!allowed() || !SOURCES[key]) return;
    let slot = pools.get(key);
    if (!slot) {
      const base = new Audio(new URL(SOURCES[key], root));
      base.preload = 'auto';
      slot = {base, voices: []};
      pools.set(key, slot);
    }
    let voice = slot.voices.find(item => item.paused || item.ended);
    if (!voice) {
      if (slot.voices.length >= maxVoices) {
        try { slot.voices.shift().pause(); } catch (e) {}
      }
      voice = slot.base.cloneNode(true);
      slot.voices.push(voice);
    }
    try { voice.currentTime = 0; } catch (e) {}
    const attempt = voice.play();
    if (attempt?.catch) attempt.catch(() => {});
  };
  Object.keys(SOURCES).forEach(key => {
    const audio = new Audio(new URL(SOURCES[key], root));
    audio.preload = 'auto';
    pools.set(key, {base:audio, voices:[]});
  });
  window.__archiveSfx = {play, click:() => play('click'), menu:() => play('menu'), slide:() => play('slide'), enter:() => play('enter'), close:() => play('close'), setMuted(value){muted=!!value;try{localStorage.setItem(prefKey,muted?'off':'on')}catch(e){}}, isMuted:()=>muted};
  window.addEventListener('message', event => {
    const data = event.data || {};
    if (data.type === 'archive-sfx') play(data.key);
    if (data.type === 'archive-sound-state') { muted = !!data.muted; }
  });
  if (window.parent !== window) window.parent.postMessage({type:'archive-sfx-ready'}, '*');
})();
