(() => {
  'use strict';
  if (document.getElementById('postal-control')) return;
  const script = document.currentScript;
  const version = Number(script.dataset.version);
  const config = {
    1: {keys: {}, nodes: ['first']},
    2: {keys: {first:'prt_firstcover_v1', second:'prt_starrev_v2'}, nodes:['first','second','identity']},
    3: {keys: {first:'prt_first_stamp_v4',second:'prt_starrev_v2',third:'prt_unposted_gate_v1',full:'prt_full_terminal_v1'},nodes:['first','second','full','third','identity']},
    4: {keys: {first:'prt_first_stamp_v4',second:'prt_starrev_v2',third:'prt_unposted_gate_v2',fourth:'prt_unattributed_attachment_v1',full:'prt_full_terminal_v1'},nodes:['first','second','full','third','fourth','identity']}
  }[version];
  if (!config) return;
  const base = new URL('.', script.src);
  const enabledKey = 'archive_postal_console_enabled';
  let consoleEnabled = true;
  try {consoleEnabled = localStorage.getItem(enabledKey) !== '0';} catch {}
  if (!consoleEnabled) return;
  const prefKey = 'archive_postal_control_preferences';
  let prefs = {skip:false, closed:innerWidth<1000};
  try {prefs = {...prefs,...JSON.parse(localStorage.getItem(prefKey)||'{}')};} catch {}
  const $ = s => document.querySelector(s);
  const labels = {first:'01 / 雨前首封',second:'02 / 星幻',third:'03 / 未寄之门',fourth:'04 / 未署名附件',full:'完整终端',identity:'星幻身份'};
  const letters = {first:'1',second:'2',third:'3',fourth:'4',full:'F',identity:'*'};
  const host = document.createElement('aside'); host.id = 'postal-control';
  host.style.cssText = 'position:fixed;right:0;top:0;height:100dvh;width:320px;z-index:2147483646;pointer-events:none;';
  document.body.append(host);
  const root = host.attachShadow({mode:'open'});
  root.innerHTML = `<link rel="stylesheet" href="${new URL('console.css?v=4',base)}"><button class="tab" aria-label="展开控制台">POSTAL // CONTROL</button><section class="panel" aria-label="邮路终端控制台"><header><span>POSTAL // CONTROL</span><div class="head-actions"><a class="archive" href="../../index.html">↩ 存档索引</a><button id="close" aria-label="收起控制台">×</button></div></header><div class="body"><div class="version">LOCAL ASSIST / VERSION 0${version}</div><h2>邮路控制台</h2><p class="intro">操作当前存档版本 · 保留原解锁演出</p><h3>01 / 邮票与身份</h3><div class="nodes">${config.nodes.map(n=>`<button class="node" data-node="${n}"><span>${labels[n]}</span><small>待确认</small></button>`).join('')}</div>${version>=2?'<button class="wide" id="guest">切换访客身份</button>':''}<h3>02 / 本版快捷操作</h3><div class="row"><button id="all">解锁本版全部</button><button id="reset" class="danger">重置本版</button></div><h3>03 / 进度码</h3><div class="code" id="code">0</div><div class="row"><button id="copy">复制</button><button id="import">导入</button></div><div class="import" hidden><label for="input">进度码（1–4、F、*）</label><input id="input" autocomplete="off" placeholder="例如 1234F"><button id="apply">应用本版支持项</button><p id="import-note"></p></div><h3>04 / 体验设置</h3><label class="check"><input type="checkbox" id="skip">开场就绪后自动进入</label><div class="row"><button data-go="#collection">收集槽位</button>${version>=3?'<button data-go="#aperturePortal">光圈入口</button>':''}</div><button class="wide" data-go="#secretVoid">坐标区域</button><div class="status" id="status" role="status" aria-live="polite">控制台就绪</div><footer id="summary"></footer></div></section>`;
  const ui = s=>root.querySelector(s);
  let busy=false;
  function save(){try{localStorage.setItem(prefKey,JSON.stringify(prefs));}catch{}}
  function layout(){host.dataset.closed=String(prefs.closed);document.body.classList.toggle('postal-control-open',!prefs.closed);document.body.classList.toggle('postal-control-mobile-open',!prefs.closed&&innerWidth<1000);document.querySelectorAll('.archive-return').forEach(e=>e.classList.toggle('postal-return-managed',true));}
  function syncTheme(){
    const tide=document.body.classList.contains('full-flux')||document.body.classList.contains('terminal-full')&&document.body.classList.contains('full-flux');
    const dark=document.body.classList.contains('dark');
    const theme=tide?'tide':dark?'dark':'light';
    host.dataset.theme=theme;
    const vars=theme==='tide'
      ? {'--postal-accent':'#39d5ff','--postal-accent-soft':'rgba(57,213,255,.10)','--postal-panel':'#061315','--postal-panel-strong':'rgba(6,25,28,.98)','--postal-ink':'#eafffb','--postal-muted':'#7fb7b0','--postal-line':'rgba(121,244,226,.22)','--postal-input':'#092225','--postal-shadow':'-12px 0 40px rgba(0,20,24,.38)'}
      : theme==='dark'
        ? {'--postal-accent':'#facc15','--postal-accent-soft':'rgba(250,204,21,.09)','--postal-panel':'#0a0a0a','--postal-panel-strong':'rgba(17,17,17,.98)','--postal-ink':'#f4f4f4','--postal-muted':'#949494','--postal-line':'rgba(128,128,128,.3)','--postal-input':'#151515','--postal-shadow':'-12px 0 40px rgba(0,0,0,.32)'}
        : {'--postal-accent':'#0a66c2','--postal-accent-soft':'rgba(10,102,194,.09)','--postal-panel':'#f7f9fc','--postal-panel-strong':'rgba(255,255,255,.96)','--postal-ink':'#101114','--postal-muted':'#637083','--postal-line':'rgba(20,54,90,.18)','--postal-input':'#fff','--postal-shadow':'-12px 0 40px rgba(28,64,104,.12)'};
    Object.entries(vars).forEach(([key,value])=>host.style.setProperty(key,value));
  }
  const layoutStyle=document.createElement('style');
  layoutStyle.textContent='@media(min-width:1000px){body.postal-control-open{padding-right:320px!important;box-sizing:border-box}body.postal-control-open .nav{right:340px!important}body.postal-control-open .archive-return{display:none!important}}@media(max-width:999px){body.postal-control-open .archive-return{display:none!important}}';
  document.head.append(layoutStyle);
  function has(n){
    if(n==='identity'){try{const x=JSON.parse(sessionStorage.getItem('prt_identity_v3')||'null');return x?.type==='id'&&x.id==='1142081338';}catch{return false;}}
    if(version===1)return !!$('.slot[data-i="0"].unlocked');
    return localStorage.getItem(config.keys[n])==='1';
  }
  function code(){return ['first','second','third','fourth','full','identity'].filter(n=>config.nodes.includes(n)&&has(n)).map(n=>letters[n]).join('')||'0';}
  function render(){
    root.querySelectorAll('[data-node]').forEach(b=>{const on=has(b.dataset.node);b.classList.toggle('on',on);b.querySelector('small').textContent=on?'已启用':'未启用';});
    ui('#code').textContent=code();
    const count=['first','second','third','fourth'].filter(n=>config.nodes.includes(n)&&has(n)).length;
    ui('#summary').textContent=`已归档 ${count} / 30 · 本版可用 ${version} 枚`;
  }
  function status(s){ui('#status').textContent=s;}
  function setValue(selector,value){const e=$(selector);if(!e)throw Error('当前页面缺少输入入口');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,value);e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));return e;}
  function click(selector){const e=$(selector);if(!e)throw Error('当前页面缺少操作入口');e.click();}
  function coordinate(value){const e=setValue('#coordinateInput',value);e.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));}
  function waitFor(test,timeout=25000){return new Promise((resolve,reject)=>{const start=Date.now();const timer=setInterval(()=>{try{if(test()){clearInterval(timer);resolve();}else if(Date.now()-start>timeout){clearInterval(timer);reject(Error('等待页面完成超时，请检查身份门或动画'));}}catch(e){clearInterval(timer);reject(e);}},120);});}
  function idle(){return !document.body.classList.contains('locked')&&!document.body.classList.contains('full-activation-running')&&!$('#unlockCeremony')?.classList.contains('open')&&!$('#identityWelcome')?.classList.contains('open');}
  async function ready(){
    const gate=$('#identityGate');if(gate&&!gate.classList.contains('off'))click('#guestLogin');
    const boot=$('#boot');if(boot&&!boot.classList.contains('off')){await waitFor(()=>boot.classList.contains('ready')||boot.classList.contains('off'));if(!boot.classList.contains('off'))boot.click();}
    await waitFor(idle);
  }
  async function unlock(n){
    if(has(n))return;
    if(n==='third')await unlock('full');
    if(n==='fourth'){await unlock('full');await unlock('third');}
    status('执行中：'+labels[n]);
    if(n==='first')coordinate('6825');
    else if(n==='full')coordinate('62415');
    else if(n==='second'||n==='identity'){setValue('#identityInput','1142081338');click('#idLogin');}
    else if(n==='third')click(version===3?'#apertureClaim':'#aperturePortal');
    else if(n==='fourth'){click('#aperturePortal');setValue('#submissionSerial','C-4173-6');click('#submitSerial');}
    await waitFor(()=>has(n)&&idle(),35000);render();
  }
  async function run(fn){if(busy)return;busy=true;root.querySelectorAll('button:not(#close):not(.tab)').forEach(b=>b.disabled=true);try{await ready();await fn();status('操作完成');}catch(e){status(e.message);}finally{busy=false;root.querySelectorAll('button').forEach(b=>b.disabled=false);render();}}
  root.querySelectorAll('[data-node]').forEach(b=>b.onclick=()=>run(()=>unlock(b.dataset.node)));
  ui('#all').onclick=()=>run(async()=>{for(const n of config.nodes.filter(n=>n!=='identity'))await unlock(n);});
  ui('#reset').onclick=()=>{if(busy||!confirm(`重置 v${version} 的邮票与身份记录？其他版本专属记录保留，共用记录也会同步受影响。`))return;Object.values(config.keys).forEach(k=>localStorage.removeItem(k));if(version>=2)sessionStorage.removeItem('prt_identity_v3');location.hash='';location.reload();};
  if(ui('#guest'))ui('#guest').onclick=()=>run(async()=>{if(has('identity'))click('#identitySwitch');click('#guestLogin');});
  ui('#close').onclick=()=>{prefs.closed=true;save();layout();ui('.tab').focus();};
  ui('.tab').onclick=()=>{prefs.closed=false;save();layout();ui('#close').focus();};
  root.addEventListener('keydown',e=>{if(e.key==='Escape'){prefs.closed=true;save();layout();ui('.tab').focus();}});
  ui('#skip').checked=prefs.skip;ui('#skip').onchange=e=>{prefs.skip=e.target.checked;save();};
  ui('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(code());status('已复制进度码');}catch{status('复制失败，可手动选择进度码');}};
  ui('#import').onclick=()=>{ui('.import').hidden=!ui('.import').hidden;if(!ui('.import').hidden)ui('#input').focus();};
  ui('#apply').onclick=()=>{const value=ui('#input').value.trim().toUpperCase();if(!/^(0|[1234F*]+)$/.test(value)){status('进度码仅支持 0、1–4、F 和 *');return;}const wanted=config.nodes.filter(n=>value.includes(letters[n]));const skipped=[...new Set(value.replace('0','').split(''))].filter(c=>!Object.values(letters).filter((_,i)=>config.nodes.includes(Object.keys(letters)[i])).includes(c));ui('#import-note').textContent=skipped.length?'本版忽略：'+skipped.join('、'):'';if(value==='0'){ui('#reset').click();return;}run(async()=>{for(const n of wanted)await unlock(n);status('已合并本版支持的进度');});};
  root.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{const e=$(version===3&&b.dataset.go==='#aperturePortal'?'#stampAperture':b.dataset.go);if(e)e.scrollIntoView({behavior:'smooth',block:'center'});else status('当前版本没有此视图');});
  let scheduled=false;const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;render();syncTheme();const b=$('#boot');if(prefs.skip&&b?.classList.contains('ready')&&!b.classList.contains('off'))b.click();});});observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  window.addEventListener('storage',()=>{render();syncTheme();});layout();render();syncTheme();
})();
