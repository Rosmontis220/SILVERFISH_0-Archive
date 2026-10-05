  
  (function () {
    var el = document.getElementById('ak-hud-clock');
    if (!el) return;
    function pad(n) { return String(n).padStart(2, '0'); }
    function tick() {
      var d = new Date();
      el.textContent =
        d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
        '  ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    }
    tick();
    setInterval(tick, 1000);
  })();

