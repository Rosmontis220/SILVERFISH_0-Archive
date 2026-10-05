    (function () {
      var stored = null;
      try { stored = localStorage.getItem('theme'); } catch (e) { /* storage unavailable */ }
      var theme = stored || 'dark'; // 默认暗色
      if (theme === 'light') document.documentElement.classList.add('light');
      else if (theme === 'crimson') document.documentElement.classList.add('crimson');
    })();
  
