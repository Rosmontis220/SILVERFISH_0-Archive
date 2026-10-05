  (function () {
    const DATA = {
      v1: {
        kicker: 'POSTAL // TERMINAL V1',
        key: '邮路终端 v1',
        href: 'viewer.html?path=archive%2Fpostal-terminal%2Fv1%2Findex.html',
        desc: 'POSTAL ROUTE TERMINAL<br>30 个邮票槽位，本地会话，无提示<br>首版 · 1 枚邮票 · 刷新即归零'
      },
      v2: {
        kicker: 'POSTAL // TERMINAL V2',
        key: '邮路终端 v2',
        href: 'viewer.html?path=archive%2Fpostal-terminal%2Fv2%2Findex.html',
        desc: 'POSTAL ROUTE TERMINAL<br>身份门 · 访客 / ID 双身份<br>重制版 · 2 枚邮票 · AES 加密资源'
      },
      v3: {
        kicker: 'POSTAL // TERMINAL V3',
        key: '邮路终端 v3',
        href: 'viewer.html?path=archive%2Fpostal-terminal%2Fv3%2Findex.html',
        desc: 'POSTAL ROUTE TERMINAL<br>三档身份 · 常驻信号可切换<br>第三版 · 9 个加密资源 · 新增一枚'
      },
      v4: {
        kicker: 'POSTAL // TERMINAL V4',
        key: '邮路终端 v4',
        href: 'viewer.html?path=archive%2Fpostal-terminal%2Fv4%2Findex.html',
        desc: 'POSTAL ROUTE TERMINAL<br>序列门 · 第 4 枚邮票可解锁<br>第四版 · 10 个加密资源 · 新增未署名附件'
      },
      v5: {
        kicker: 'POSTAL // TERMINAL V5',
        key: '邮路终端 v5',
        href: 'viewer.html?path=archive%2Fpostal-terminal%2Fv5%2Findex.html',
        desc: 'POSTAL ROUTE TERMINAL<br>联合处置 · 文件递交门<br>第五版 · 11 个加密资源 · 新增首席代理代表'
      }
    };

    const field = document.getElementById('postal-version');
    const card = document.getElementById('postal-card');
    const kicker = document.getElementById('postal-kicker');
    const desc = document.getElementById('postal-desc');
    const consoleSwitch = document.getElementById('postal-console-switch');
    const consoleEnabledKey = 'archive_postal_console_enabled';
    if (!field || !card || !kicker || !desc || !consoleSwitch) return;
    let consoleEnabled = true;
    try { consoleEnabled = localStorage.getItem(consoleEnabledKey) !== '0'; } catch (e) {}
    const renderConsoleSwitch = () => {
      consoleSwitch.setAttribute('aria-checked', String(consoleEnabled));
      consoleSwitch.title = consoleEnabled ? '进入终端时加载控制台' : '进入终端时不加载控制台';
    };
    renderConsoleSwitch();

    let current = null;
    let target = null;

    const render = (v) => {
      const d = DATA[v];
      if (!d) return empty();
      current = v;
      kicker.textContent = d.kicker;
      desc.innerHTML = d.desc;
      target = d.href;
      card.dataset.cardKey = d.key;
      card.dataset.state = 'ready';
      delete desc.dataset.plain;
      /* 黑红主题会按卡片标题换上「不需要…」，换版后要重算一次 */
      if (window.__archiveApplyCardNotes) window.__archiveApplyCardNotes();
    };

    /* 还没填版本时的状态：kicker 不带版本号，注释当引导，卡片暂时没有目标 */
    const empty = () => {
      current = null;
      target = null;
      kicker.textContent = 'POSTAL // TERMINAL';
      desc.innerHTML = 'POSTAL ROUTE TERMINAL<br>本地邮票收集界面<br>请在上方输入版本';
      delete card.dataset.cardKey;
      card.dataset.state = 'empty';
      delete desc.dataset.plain;
      if (window.__archiveApplyCardNotes) window.__archiveApplyCardNotes();
    };

    const parse = (raw) => {
      const digits = (raw.match(/\d/g) || []).join('');
      return DATA['v' + digits] ? 'v' + digits : null;
    };
    const commit = () => {
      const v = parse(field.value);
      if (v) {
        render(v);
        field.value = v.slice(1);
        return;
      }
      if (current) field.value = current.slice(1);   /* 填过版本又清空 → 退回该版本 */
      else { empty(); field.value = ''; }            /* 从没填过 → 保持空白与引导 */
    };

    /* 点进去即清空，敲到有效数字立刻切；非法或空值在回车/失焦时回到上一个有效状态 */
    field.addEventListener('focus', () => { field.value = ''; });
    field.addEventListener('input', () => {
      const v = parse(field.value);
      if (v) render(v);
    });
    field.addEventListener('change', commit);
    field.addEventListener('blur', commit);
    field.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commit();
      }
    });
    empty();

    consoleSwitch.addEventListener('click', (e) => {
      e.stopPropagation();
      consoleEnabled = !consoleEnabled;
      try { localStorage.setItem(consoleEnabledKey, consoleEnabled ? '1' : '0'); } catch (err) {}
      renderConsoleSwitch();
    });

    /* 整张卡片就是按钮：填了版本才进门，还没填就先聚焦输入框 */
    card.addEventListener('click', (e) => {
      if (e.target === field || e.target === consoleSwitch || consoleSwitch.contains(e.target)) return;
      if (!target) { field.focus(); return; }
      window.location.href = target;
    });
    card.addEventListener('keydown', (e) => {
      if (e.target === field || e.target === consoleSwitch || consoleSwitch.contains(e.target)) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!target) { field.focus(); return; }
        window.location.href = target;
      }
    });
  })();

