
        'use strict';
/* ═══════════════════════════
   AUDIO ENGINE
═══════════════════════════ */

const AC=window.AudioContext||window.webkitAudioContext;
let actx=null, sOn=true, vol=0.4;
function gac(){if(!actx){try{actx=new AC()}catch(e){}}return actx}
function tone(f1,f2,dur,type='sine',v=0.18){
  if(!sOn)return;const ac=gac();if(!ac)return;
  const o=ac.createOscillator(),g=ac.createGain();
  o.type=type;o.connect(g);g.connect(ac.destination);
  o.frequency.setValueAtTime(f1,ac.currentTime);
  if(f2)o.frequency.exponentialRampToValueAtTime(f2,ac.currentTime+dur);
  g.gain.setValueAtTime(vol*v,ac.currentTime);
  g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+dur);
  o.start();o.stop(ac.currentTime+dur+.01);
}
const click=()=>tone(900,400,.07,'sine',.22);
const hover=()=>tone(600,800,.05,'sine',.04);
function procSound(){
  if(!sOn)return;const ac=gac();if(!ac)return;
  [200,350,500,700,900,1100].forEach((f,i)=>{
    const o=ac.createOscillator(),g=ac.createGain();
    o.type=i%2?'sawtooth':'square';o.connect(g);g.connect(ac.destination);
    const t=ac.currentTime+i*.1;
    o.frequency.setValueAtTime(f,t);o.frequency.linearRampToValueAtTime(f*.7,t+.12);
    g.gain.setValueAtTime(vol*.08,t);g.gain.exponentialRampToValueAtTime(.001,t+.14);
    o.start(t);o.stop(t+.17);
  });
}
function uploadSound(){
  if(!sOn)return;const ac=gac();if(!ac)return;
  [200,350,520,680,860].forEach((f,i)=>{
    const o=ac.createOscillator(),g=ac.createGain();
    o.type='sawtooth';o.connect(g);g.connect(ac.destination);
    const t=ac.currentTime+i*.08;
    o.frequency.setValueAtTime(f,t);
    g.gain.setValueAtTime(vol*.1,t);g.gain.exponentialRampToValueAtTime(.001,t+.1);
    o.start(t);o.stop(t+.12);
  });
}
function successSound(){
  if(!sOn)return;const ac=gac();if(!ac)return;
  [523,659,784,1047].forEach((f,i)=>{
    const t=ac.currentTime+i*.1;
    const o=ac.createOscillator(),g=ac.createGain();
    o.type='sine';o.connect(g);g.connect(ac.destination);
    o.frequency.setValueAtTime(f,t);
    g.gain.setValueAtTime(vol*.2,t);g.gain.exponentialRampToValueAtTime(.001,t+.35);
    o.start(t);o.stop(t+.38);
  });
}
const errSound=()=>tone(220,120,.3,'sawtooth',.18);
function setVol(v){vol=parseFloat(v)}
function toggleSound(){
  sOn=!sOn;
  document.getElementById('stoggle').textContent=sOn?'🔊 ON':'🔇 OFF';
  if(sOn)click();
}

/* ═══════════════════════════
   PARTICLE BG
═══════════════════════════ */
(()=>{
  const cv=document.getElementById('bgc'),cx=cv.getContext('2d');
  let W,H,P=[];const N=52;
  const rsz=()=>{W=cv.width=window.innerWidth;H=cv.height=window.innerHeight};
  rsz();window.addEventListener('resize',rsz);
  for(let i=0;i<N;i++)P.push({x:Math.random()*1920,y:Math.random()*1080,vx:(Math.random()-.5)*.32,vy:(Math.random()-.5)*.32,r:Math.random()*1.4+.5,h:[190,240,270,140][i%4]});
  function draw(){
    cx.clearRect(0,0,W,H);
    P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);cx.fillStyle=`hsl(${p.h},100%,60%)`;cx.fill()});
    for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){const d=Math.hypot(P[i].x-P[j].x,P[i].y-P[j].y);if(d<125){cx.beginPath();cx.moveTo(P[i].x,P[i].y);cx.lineTo(P[j].x,P[j].y);cx.strokeStyle=`rgba(0,200,255,${.11*(1-d/125)})`;cx.lineWidth=.5;cx.stroke()}}
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ═══════════════════════════
   TOOLS DATA
═══════════════════════════ */
const TOOLS=[
  {id:'pdf-merge',cat:'pdf',icon:'🔗',name:'Merge PDF',desc:'Combine multiple PDFs into one file'},
  {id:'pdf-split',cat:'pdf',icon:'✂️',name:'Split PDF',desc:'Extract specific pages from a PDF'},
  {id:'pdf-compress',cat:'pdf',icon:'🗜️',name:'Compress PDF',desc:'Reduce PDF file size'},
  {id:'img-to-pdf',cat:'pdf',icon:'🖼️',name:'Image to PDF',desc:'Convert images to PDF format'},
  {id:'text-to-pdf',cat:'pdf',icon:'📝',name:'Text to PDF',desc:'Convert plain text to PDF'},
  {id:'pdf-to-img',cat:'pdf',icon:'📸',name:'PDF to Image',desc:'Extract PDF page 1 as file'},
  {id:'pdf-watermark',cat:'pdf',icon:'💧',name:'Add Watermark',desc:'Stamp diagonal text watermark'},
  {id:'pdf-rotate',cat:'pdf',icon:'🔄',name:'Rotate PDF',desc:'Rotate all pages 90/180/270°'},
  {id:'pdf-pagenums',cat:'pdf',icon:'🔢',name:'Page Numbers',desc:'Auto-stamp page numbers'},
  {id:'pdf-lock',cat:'pdf',icon:'🔒',name:'Lock PDF',desc:'Simulate PDF password lock'},
  {id:'pdf-reorder',cat:'pdf',icon:'📋',name:'Reorder Pages',desc:'Specify custom page order'},
  {id:'text-case',cat:'text',icon:'Aa',name:'Case Converter',desc:'UPPER, lower, Title, camelCase…'},
  {id:'text-clean',cat:'text',icon:'🧹',name:'Text Cleaner',desc:'Remove spaces, lines, special chars'},
  {id:'text-counter',cat:'text',icon:'📊',name:'Word Counter',desc:'Count words, chars, lines, read time'},
  {id:'text-tts',cat:'text',icon:'🔈',name:'Text to Speech',desc:'Speak text via browser TTS'},
  {id:'text-stt',cat:'text',icon:'🎤',name:'Speech to Text',desc:'Transcribe via microphone'},
  {id:'text-format',cat:'text',icon:'✍️',name:'Text Formatter',desc:'Bullet, numbered, markdown'},
  {id:'text-random',cat:'text',icon:'🎲',name:'Random Text',desc:'Lorem ipsum, UUIDs, hex strings'},
  {id:'img-compress',cat:'image',icon:'🗜️',name:'Compress Image',desc:'Reduce image size smartly'},
  {id:'img-resize',cat:'image',icon:'📐',name:'Resize Image',desc:'Custom width × height'},
  {id:'img-convert',cat:'image',icon:'🔁',name:'Convert Format',desc:'JPG ↔ PNG ↔ WEBP'},
  {id:'img-crop',cat:'image',icon:'✂️',name:'Crop Image',desc:'Canvas drag-to-crop'},
  {id:'img-base64',cat:'image',icon:'💾',name:'Image ↔ Base64',desc:'Encode/decode image as base64'},
  {id:'img-screenshot',cat:'image',icon:'📷',name:'Screenshot',desc:'Capture screen via browser API'},
  {id:'dev-json',cat:'dev',icon:'{}',name:'JSON Formatter',desc:'Prettify, minify and validate JSON'},
  {id:'dev-base64',cat:'dev',icon:'🔑',name:'Base64 Codec',desc:'Encode and decode base64 strings'},
  {id:'dev-url',cat:'dev',icon:'🔗',name:'URL Codec',desc:'URL encode and decode'},
  {id:'dev-pass',cat:'dev',icon:'🛡️',name:'Password Gen',desc:'Strong random passwords'},
  {id:'dev-color',cat:'dev',icon:'🎨',name:'Color Picker',desc:'Pick color + generate palette'},
  {id:'dev-minify',cat:'dev',icon:'📦',name:'Code Minifier',desc:'Minify JS or CSS code'},
  {id:'dev-regex',cat:'dev',icon:'🔍',name:'Regex Tester',desc:'Test regular expressions live'},
  {id:'stu-cgpa',cat:'student',icon:'🎓',name:'CGPA Calculator',desc:'Dynamic subjects with grade picker'},
  {id:'stu-attend',cat:'student',icon:'📅',name:'Attendance Calc',desc:'Track & forecast attendance %'},
  {id:'stu-pomo',cat:'student',icon:'⏱️',name:'Pomodoro Timer',desc:'Focus sessions with breaks'},
  {id:'stu-notes',cat:'student',icon:'📓',name:'Notes → PDF',desc:'Export notes as PDF'},
  {id:'stu-resume',cat:'student',icon:'📄',name:'Resume Builder',desc:'Build & download clean PDF resume'},
  /* ── POWER TOOLS ── */
  {id:'pw-text2json',cat:'power',icon:'{}',name:'Text → JSON 🔥',desc:'Auto-detect key:value pairs from plain text · validate · download'},
  {id:'pw-html2pdf',cat:'power',icon:'🖨️',name:'HTML → PDF Ultra 🔥',desc:'Paste HTML or upload file · full-page capture · A4/Letter · dark mode'},
  {id:'pw-url2pdf',cat:'power',icon:'🌐',name:'URL → PDF 🔥',desc:'Enter a URL · proxy-fetch page · render to multi-page PDF'},
  /* ── 11 NEW UTILITY TOOLS ── */
  {id:'ut-qrcode',cat:'power',icon:'📱',name:'QR Code Generator',desc:'Generate QR for any URL, text or contact — download PNG'},
  {id:'ut-pwstrength',cat:'power',icon:'🔐',name:'Password Strength',desc:'Real-time entropy · crack time estimate · strength meter'},
  {id:'ut-hash',cat:'power',icon:'#️⃣',name:'Hash Generator',desc:'SHA-256 · SHA-1 · SHA-512 · MD5-style — copy hash instantly'},
  {id:'ut-jwt',cat:'dev',icon:'🪙',name:'JWT Decoder',desc:'Paste a JWT token · decode header & payload · check expiry'},
  {id:'ut-markdown',cat:'text',icon:'📖',name:'Markdown → HTML',desc:'Live preview as you type · export HTML or copy rendered'},
  {id:'ut-boxshadow',cat:'dev',icon:'🌫️',name:'Box Shadow Gen',desc:'Visual sliders for CSS box-shadow · live preview · copy CSS'},
  {id:'ut-countdown',cat:'power',icon:'⏳',name:'Countdown Timer',desc:'Set any future date/time · live days-hours-mins-secs countdown'},
  {id:'ut-diff',cat:'text',icon:'🔀',name:'Text Diff Checker',desc:'Compare two texts side-by-side · highlight added & removed lines'},
  {id:'ut-units',cat:'power',icon:'📏',name:'Unit Converter',desc:'Length · Weight · Temperature · Speed · Area — instant convert'},
  {id:'ut-typing',cat:'power',icon:'⌨️',name:'Typing Speed Test',desc:'60-second WPM test · accuracy · mistakes — real-time feedback'},
  {id:'ut-contrast',cat:'dev',icon:'🎭',name:'Contrast Checker',desc:'WCAG AA/AAA accessibility · contrast ratio · pass/fail badge'},
];

/* ═══════════════════════════
   STATE + PERSISTENCE
═══════════════════════════ */
let favs   = JSON.parse(localStorage.getItem('akdev_favs')   || '[]');
let recent = JSON.parse(localStorage.getItem('akdev_recent') || '[]');
let uses   = parseInt(localStorage.getItem('akdev_uses')     || '0');
function saveFavs(){localStorage.setItem('akdev_favs',JSON.stringify(favs))}
function saveRecent(){localStorage.setItem('akdev_recent',JSON.stringify(recent))}
function addRecent(id){
  recent=recent.filter(r=>r.id!==id);
  const t=TOOLS.find(x=>x.id===id);if(!t)return;
  recent.unshift({id,icon:t.icon,name:t.name,ts:Date.now()});
  if(recent.length>20)recent.pop();
  saveRecent();uses++;localStorage.setItem('akdev_uses',uses);
}
function ago(ts){
  const s=Math.floor((Date.now()-ts)/1000);
  if(s<60)return s+'s ago';if(s<3600)return Math.floor(s/60)+'m ago';
  if(s<86400)return Math.floor(s/3600)+'h ago';return Math.floor(s/86400)+'d ago';
}

/* ═══════════════════════════
   NOTIFICATIONS
═══════════════════════════ */
function notify(msg,type='info'){
  const stack=document.getElementById('nstack');
  const el=document.createElement('div');el.className='notif '+type;
  const ico={success:'✓',error:'✕',info:'◈',warn:'⚠'}[type]||'◈';
  el.innerHTML=`<span>${ico}</span><span style="flex:1">${msg}</span><button class="notif-x" aria-label="Dismiss">✕</button>`;
  el.querySelector('.notif-x').onclick=()=>el.remove();
  stack.appendChild(el);
  if(type==='success')successSound();
  else if(type==='error')errSound();
  setTimeout(()=>{el.style.opacity='0';el.style.transition='opacity .4s';setTimeout(()=>el.remove(),400)},4000);
}

/* ═══════════════════════════
   RENDER CARDS
═══════════════════════════ */
function mkCard(tool){
  const isFav=favs.includes(tool.id);
  const d=document.createElement('div');
  d.className='tcard'+(isFav?' fav':'');
  d.dataset.tid=tool.id;
  d.setAttribute('role','button');d.setAttribute('tabindex','0');
  d.setAttribute('aria-label','Open '+tool.name);
  d.innerHTML=`<button class="c-star${isFav?' on':''}" data-id="${tool.id}" onclick="toggleFav(event,'${tool.id}')" aria-label="${isFav?'Remove from':'Add to'} favorites" title="Favorite">★</button>
    <div class="c-ico" aria-hidden="true">${tool.icon}</div>
    <div class="c-name">${tool.name}</div>
    <div class="c-desc">${tool.desc}</div>`;
  d.addEventListener('mouseenter',hover);
  d.addEventListener('click',e=>{if(e.target.classList.contains('c-star'))return;click();openTool(tool.id)});
  d.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openTool(tool.id)}});
  return d;
}
function fillGrid(id,tools){
  const el=document.getElementById(id);if(!el)return;
  el.innerHTML='';tools.forEach(t=>el.appendChild(mkCard(t)));
}
function buildAll(){
  fillGrid('home-grid',TOOLS);
  fillGrid('pdf-grid',TOOLS.filter(t=>t.cat==='pdf'));
  fillGrid('text-grid',TOOLS.filter(t=>t.cat==='text'));
  fillGrid('image-grid',TOOLS.filter(t=>t.cat==='image'));
  fillGrid('dev-grid',TOOLS.filter(t=>t.cat==='dev'));
  fillGrid('student-grid',TOOLS.filter(t=>t.cat==='student'));
  fillGrid('power-grid',TOOLS.filter(t=>t.cat==='power'));
  buildFavs();buildDash();buildRecentFull();
  document.getElementById('fav-cnt').textContent=favs.length;
}
function buildFavs(){
  const el=document.getElementById('fav-grid'),em=document.getElementById('fav-empty');
  const ft=TOOLS.filter(t=>favs.includes(t.id));
  if(el){el.innerHTML='';ft.forEach(t=>el.appendChild(mkCard(t)))}
  if(em)em.style.display=ft.length?'none':'block';
}
function buildDash(){
  const el=document.getElementById('dash-stats');if(!el)return;
  el.innerHTML=`
    <div class="dcard"><div class="dv">${TOOLS.length}</div><div class="dk">Total Tools</div></div>
    <div class="dcard"><div class="dv">${favs.length}</div><div class="dk">Favorites</div></div>
    <div class="dcard"><div class="dv">${uses}</div><div class="dk">Tool Uses</div></div>
    <div class="dcard"><div class="dv">${recent.length}</div><div class="dk">Recent</div></div>`;
  /* Populate new-tools spotlight */
  const ntg=document.getElementById('new-tools-grid');
  if(ntg){
    ntg.innerHTML='';
    TOOLS.filter(t=>t.cat==='power').forEach(t=>ntg.appendChild(mkCard(t)));
  }
  const rc=document.getElementById('dash-recent');
  rc.innerHTML=recent.slice(0,5).map(r=>`
    <div class="recent-item" onclick="openTool('${r.id}')" role="button" tabindex="0" aria-label="Reopen ${r.name}">
      <span class="ri-ico">${r.icon}</span><span class="ri-name">${r.name}</span>
      <span class="ri-time">${ago(r.ts)}</span>
    </div>`).join('')||'<div style="color:var(--dim);font-size:13px;padding:10px 0">No recent activity yet.</div>';
}
function buildRecentFull(){
  const el=document.getElementById('recent-full'),em=document.getElementById('recent-empty');
  if(!recent.length){if(el)el.innerHTML='';if(em)em.style.display='block';return}
  if(em)em.style.display='none';
  el.innerHTML=recent.map(r=>`
    <div class="recent-item" onclick="openTool('${r.id}')" role="button" tabindex="0">
      <span class="ri-ico">${r.icon}</span><span class="ri-name">${r.name}</span>
      <span class="ri-time">${ago(r.ts)}</span>
    </div>`).join('');
}
function toggleFav(e,id){
  e.stopPropagation();click();
  if(favs.includes(id))favs=favs.filter(f=>f!==id);
  else favs.push(id);
  saveFavs();buildAll();
  notify(favs.includes(id)?'Added to favorites!':'Removed from favorites','info');
}

/* ═══════════════════════════
   NAVIGATION
═══════════════════════════ */
function showSec(name){
  click();
  document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.sb-item').forEach(s=>s.classList.remove('active'));
  document.getElementById('sec-'+name).classList.add('active');
  document.querySelector(`[data-sec="${name}"]`)?.classList.add('active');
  if(name==='recent')buildRecentFull();
  if(name==='favs')buildFavs();
  if(name==='home')buildDash();
  if(name==='power')fillGrid('power-grid',TOOLS.filter(t=>t.cat==='power'));
  if(window.innerWidth<=900)closeSB();
}
function toggleSB(){
  const sb=document.getElementById('sidebar'),ov=document.getElementById('sb-overlay');
  sb.classList.toggle('open');ov.style.display=sb.classList.contains('open')?'block':'none';
}
function closeSB(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sb-overlay').style.display='none';
}
function filterTools(q){
  q=q.toLowerCase().trim();
  document.querySelectorAll('[data-tid]').forEach(c=>{
    const t=TOOLS.find(x=>x.id===c.dataset.tid);if(!t)return;
    c.style.display=!q||t.name.toLowerCase().includes(q)||t.desc.toLowerCase().includes(q)||t.cat.includes(q)?'':'none';
  });
}

/* ═══════════════════════════
   TOOL PANEL
═══════════════════════════ */
function openTool(id){
  const t=TOOLS.find(x=>x.id===id);if(!t)return;
  addRecent(id);procSound();
  document.getElementById('p-ico').textContent=t.icon;
  document.getElementById('panel-title').textContent=t.name;
  document.getElementById('pbody').innerHTML='<div class="scan"></div>'+getUI(id);
  const ov=document.getElementById('overlay');
  ov.classList.add('open');ov.setAttribute('aria-hidden','false');
  buildDash();initTool(id);
}
function closePanel(){
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('overlay').setAttribute('aria-hidden','true');
  click();
}
function closePanelBg(e){if(e.target===document.getElementById('overlay'))closePanel()}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(document.getElementById('overlay').classList.contains('open'))closePanel();
    else if(document.getElementById('fb-panel').classList.contains('open'))toggleFB();
  }
});

/* Suggest next tools in same category */
function suggest(id){
  const cur=TOOLS.find(t=>t.id===id);
  const next=TOOLS.filter(t=>t.cat===cur.cat&&t.id!==id).slice(0,3);
  if(!next.length)return '';
  return `<div class="suggest"><span class="suggest-lbl">⚡ TRY NEXT:</span>${next.map(t=>`<button class="sbtn" onclick="openTool('${t.id}')">${t.icon} ${t.name}</button>`).join('')}</div>`;
}

/* ═══════════════════════════
   HELPERS
═══════════════════════════ */
const $=id=>document.getElementById(id);
const val=id=>$(id)?.value||'';
function showProc(id,msg='Processing…'){const el=$(id);if(el){el.innerHTML=`<div class="spin"></div>${msg}`;el.classList.add('on')}}
function hideProc(id){const el=$(id);if(el)el.classList.remove('on')}
function setProg(bid,p){const b=$(bid);if(b)b.style.width=p+'%'}
function showProg(wid,bid){const w=$(wid);if(w)w.style.display='block';setProg(bid,12)}
function hideProg(wid){const w=$(wid);if(w)w.style.display='none'}
function validNum(v,lbl,min=null,max=null){
  if(v===''||isNaN(+v)){notify(lbl+' must be a number','error');return false}
  if(min!==null&&+v<min){notify(lbl+' must be ≥ '+min,'error');return false}
  if(max!==null&&+v>max){notify(lbl+' must be ≤ '+max,'error');return false}
  return true;
}
function dl(data,name,mime){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([data],{type:mime}));
  a.download=name;a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),5000);
}
function fmtBytes(b){if(b<1024)return b+' B';if(b<1048576)return(b/1024).toFixed(1)+' KB';return(b/1048576).toFixed(2)+' MB'}
function parseRange(str,total){
  const pages=[];
  str.split(',').forEach(p=>{
    p=p.trim();
    if(p.includes('-')){const[a,b]=p.split('-').map(Number);for(let i=a;i<=Math.min(b,total);i++)if(i>0)pages.push(i)}
    else{const n=parseInt(p);if(n>0&&n<=total)pages.push(n)}
  });
  return[...new Set(pages)].sort((a,b)=>a-b);
}
function toDataURL(file){return new Promise(r=>{const fr=new FileReader();fr.onload=e=>r(e.target.result);fr.readAsDataURL(file)})}
function loadImg(src){return new Promise((res,rej)=>{const img=new Image();img.onload=()=>res(img);img.onerror=rej;img.src=src})}
function dzLabel(dz,file){
  let fn=dz.querySelector('.dz-fn');
  if(!fn){fn=document.createElement('div');fn.className='dz-fn';dz.appendChild(fn)}
  fn.textContent='📎 '+file.name+' ('+fmtBytes(file.size)+')';
}
function copyEl(id){
  const el=$(id);if(!el)return;
  const t=el.value||el.textContent;
  navigator.clipboard.writeText(t).then(()=>notify('Copied!','success')).catch(()=>notify('Copy failed','error'));
  click();
}

/* ═══════════════════════════
   TOOL UIs
═══════════════════════════ */
function getUI(id){
/* ── PDF TOOLS ── */
if(id==='pdf-merge')return`
<div class="fg"><label class="lbl">Upload PDFs (2 or more)</label>
<div class="dz" id="dz-m"><input type="file" id="in-m" accept=".pdf" multiple aria-label="Upload PDFs">
<div class="dz-ico">📎</div><div class="dz-txt">Drag & drop PDFs here or click to browse</div>
<div class="dz-sub">Multiple files · PDF only</div></div></div>
<div id="m-list" style="font-family:var(--fM);font-size:12px;color:var(--cyan);margin-bottom:8px"></div>
<div class="brow"><button class="btn btn-p" onclick="doMerge()">🔗 MERGE PDFs</button></div>
<div style="display:none" id="pw-m"><div class="prog-wrap"><div class="prog-bar" id="pb-m"></div></div></div>
<div class="proc" id="pc-m"></div>${suggest(id)}`;

if(id==='pdf-split')return`
<div class="fg"><label class="lbl">Upload PDF</label>
<div class="dz"><input type="file" id="in-s" accept=".pdf">
<div class="dz-ico">✂️</div><div class="dz-txt">Drop PDF to split</div></div></div>
<div class="fg"><label class="lbl" for="s-range">Page Range</label>
<input class="inp" id="s-range" placeholder="e.g. 1-3,5,7-9" aria-describedby="s-hint">
<div id="s-hint" style="font-size:11px;color:var(--dim);font-family:var(--fM);margin-top:4px">Separate ranges with commas · Example: 1-3,5,8</div>
<div class="ferr" id="s-err"></div></div>
<div class="brow"><button class="btn btn-p" onclick="doSplit()">✂️ EXTRACT PAGES</button></div>
<div class="proc" id="pc-s"></div>${suggest(id)}`;

if(id==='pdf-compress')return`
<div class="fg"><label class="lbl">Upload PDF</label>
<div class="dz"><input type="file" id="in-cp" accept=".pdf">
<div class="dz-ico">🗜️</div><div class="dz-txt">Drop PDF to compress</div>
<div class="dz-sub">Strips metadata to reduce size</div></div></div>
<div class="brow"><button class="btn btn-p" onclick="doCompress()">🗜️ COMPRESS</button></div>
<div class="proc" id="pc-cp"></div>
<div id="cp-res" style="margin-top:10px;font-family:var(--fM);font-size:13px"></div>${suggest(id)}`;

if(id==='img-to-pdf')return`
<div class="fg"><label class="lbl">Upload Images</label>
<div class="dz"><input type="file" id="in-i2p" accept="image/*" multiple>
<div class="dz-ico">🖼️</div><div class="dz-txt">Drop images to convert</div>
<div class="dz-sub">JPG · PNG · WEBP</div></div></div>
<div class="fg"><label class="lbl" for="i2p-sz">Page Size</label>
<select class="inp" id="i2p-sz"><option>A4</option><option>Letter</option><option>Legal</option></select></div>
<div class="brow"><button class="btn btn-p" onclick="doI2P()">📄 CONVERT TO PDF</button></div>
<div class="proc" id="pc-i2p"></div>${suggest(id)}`;

if(id==='text-to-pdf')return`
<div class="fg"><label class="lbl" for="t2p-in">Enter Text</label>
<textarea class="inp" id="t2p-in" rows="9" placeholder="Type or paste text here…"></textarea>
<div class="ferr" id="t2p-err"></div></div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="fg" style="flex:1"><label class="lbl" for="t2p-fs">Font Size</label><input class="inp" type="number" id="t2p-fs" value="12" min="8" max="48"></div>
  <div class="fg" style="flex:1"><label class="lbl" for="t2p-ti">Title (optional)</label><input class="inp" id="t2p-ti" placeholder="Document title"></div>
</div>
<div class="brow"><button class="btn btn-p" onclick="doT2P()">📝 GENERATE PDF</button></div>
<div class="proc" id="pc-t2p"></div>${suggest(id)}`;

if(id==='pdf-to-img')return`
<div style="font-size:12px;color:var(--dim);line-height:1.6;background:rgba(255,107,53,.06);border:1px solid rgba(255,107,53,.15);border-radius:8px;padding:10px;margin-bottom:14px;font-family:var(--fM)">
⚠ Browser limitation — extracts page 1 as a downloadable PDF unit. For image render use Chrome → Print → Save as Image.</div>
<div class="fg"><label class="lbl">Upload PDF</label>
<div class="dz"><input type="file" id="in-p2i" accept=".pdf">
<div class="dz-ico">📸</div><div class="dz-txt">Drop PDF</div></div></div>
<div class="brow"><button class="btn btn-p" onclick="doP2I()">📸 EXTRACT PAGE 1</button></div>
<div class="proc" id="pc-p2i"></div><div id="p2i-out" style="margin-top:12px"></div>${suggest(id)}`;

if(id==='pdf-watermark')return`
<div class="fg"><label class="lbl">Upload PDF</label>
<div class="dz"><input type="file" id="in-wm" accept=".pdf">
<div class="dz-ico">💧</div><div class="dz-txt">Drop PDF</div></div></div>
<div class="fg"><label class="lbl" for="wm-t">Watermark Text</label>
<input class="inp" id="wm-t" value="CONFIDENTIAL"></div>
<div class="fg"><label class="lbl" for="wm-op">Opacity: <span id="wm-op-v">0.30</span></label>
<input class="inp" type="range" id="wm-op" value="0.3" min="0.05" max="1" step="0.05" oninput="$('wm-op-v').textContent=parseFloat(this.value).toFixed(2)"></div>
<div class="brow"><button class="btn btn-p" onclick="doWM()">💧 ADD WATERMARK</button></div>
<div class="proc" id="pc-wm"></div>${suggest(id)}`;

if(id==='pdf-rotate')return`
<div class="fg"><label class="lbl">Upload PDF</label>
<div class="dz"><input type="file" id="in-rt" accept=".pdf">
<div class="dz-ico">🔄</div><div class="dz-txt">Drop PDF to rotate</div></div></div>
<div class="fg"><label class="lbl" for="rt-d">Rotation</label>
<select class="inp" id="rt-d"><option value="90">90° Clockwise</option><option value="180">180°</option><option value="270">270° (Counter-CW)</option></select></div>
<div class="brow"><button class="btn btn-p" onclick="doRotate()">🔄 ROTATE ALL PAGES</button></div>
<div class="proc" id="pc-rt"></div>${suggest(id)}`;

if(id==='pdf-pagenums')return`
<div class="fg"><label class="lbl">Upload PDF</label>
<div class="dz"><input type="file" id="in-pn" accept=".pdf">
<div class="dz-ico">🔢</div><div class="dz-txt">Drop PDF</div></div></div>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="fg" style="flex:1"><label class="lbl" for="pn-p">Position</label>
  <select class="inp" id="pn-p"><option value="bottom">Bottom Center</option><option value="top">Top Center</option></select></div>
  <div class="fg" style="flex:1"><label class="lbl" for="pn-s">Start Number</label>
  <input class="inp" type="number" id="pn-s" value="1" min="1"><div class="ferr" id="pn-err"></div></div>
</div>
<div class="brow"><button class="btn btn-p" onclick="doPN()">🔢 ADD PAGE NUMBERS</button></div>
<div class="proc" id="pc-pn"></div>${suggest(id)}`;

if(id==='pdf-lock')return`
<div class="fg"><label class="lbl">Upload PDF</label>
<div class="dz"><input type="file" id="in-lk" accept=".pdf">
<div class="dz-ico">🔒</div><div class="dz-txt">Drop PDF</div></div></div>
<div class="fg"><label class="lbl" for="lk-p">Password</label>
<input class="inp" type="password" id="lk-p" placeholder="Enter password" autocomplete="new-password">
<div class="ferr" id="lk-err"></div></div>
<div style="font-size:11px;color:var(--dim);font-family:var(--fM);margin-bottom:12px;line-height:1.5">
⚠ Browser simulation only — adds a metadata tag. For real encryption use a server-side tool.</div>
<div class="brow">
  <button class="btn btn-p" onclick="doLock()">🔒 SIMULATE LOCK</button>
  <button class="btn btn-s" onclick="doUnlock()">🔓 REMOVE TAG</button>
</div>
<div class="proc" id="pc-lk"></div>${suggest(id)}`;

if(id==='pdf-reorder')return`
<div class="fg"><label class="lbl">Upload PDF</label>
<div class="dz"><input type="file" id="in-ro" accept=".pdf" onchange="loadReorder()">
<div class="dz-ico">📋</div><div class="dz-txt">Drop PDF (loads page count)</div></div></div>
<div id="ro-info" style="font-family:var(--fM);font-size:12px;color:var(--cyan);margin-bottom:8px"></div>
<div class="fg"><label class="lbl" for="ro-seq">New Page Order (comma-separated)</label>
<input class="inp" id="ro-seq" placeholder="e.g. 3,1,2,4">
<div class="ferr" id="ro-err"></div></div>
<div class="brow"><button class="btn btn-p" onclick="doReorder()">📋 REORDER & EXPORT</button></div>
<div class="proc" id="pc-ro"></div>${suggest(id)}`;

/* ── TEXT TOOLS ── */
if(id==='text-case')return`
<div class="fg"><label class="lbl" for="tc-i">Input Text</label>
<textarea class="inp" id="tc-i" rows="5" placeholder="Enter text to convert…"></textarea></div>
<div class="fg"><label class="lbl">Convert To</label>
<div style="display:flex;gap:7px;flex-wrap:wrap" role="group">
  ${['UPPERCASE','lowercase','Title Case','camelCase','snake_case','kebab-case','PascalCase','CONSTANT_CASE'].map(c=>`<button class="btn btn-s btn-sm" onclick="doCase('${c}')">${c}</button>`).join('')}
</div></div>
<div class="fg"><label class="lbl" for="tc-o">Output</label>
<textarea class="inp" id="tc-o" rows="5" readonly></textarea></div>
<div class="brow">
  <button class="btn btn-g" onclick="copyEl('tc-o')">📋 COPY</button>
  <button class="btn btn-w btn-sm" onclick="$('tc-i').value='';$('tc-o').value=''">↺ RESET</button>
</div>${suggest(id)}`;

if(id==='text-clean')return`
<div class="fg"><label class="lbl" for="cl-i">Input Text</label>
<textarea class="inp" id="cl-i" rows="7" placeholder="Paste messy text…"></textarea></div>
<fieldset style="border:1px solid var(--border);border-radius:8px;padding:11px 13px;margin-bottom:13px">
  <legend style="font-family:var(--fH);font-size:9px;color:var(--cyan);letter-spacing:2px;padding:0 5px">OPTIONS</legend>
  <div style="display:flex;flex-wrap:wrap;gap:12px">
    <label style="display:flex;align-items:center;gap:6px;font-family:var(--fM);font-size:12px;cursor:pointer"><input type="checkbox" id="cl-sp" checked> Extra spaces</label>
    <label style="display:flex;align-items:center;gap:6px;font-family:var(--fM);font-size:12px;cursor:pointer"><input type="checkbox" id="cl-bl"> Blank lines</label>
    <label style="display:flex;align-items:center;gap:6px;font-family:var(--fM);font-size:12px;cursor:pointer"><input type="checkbox" id="cl-tr"> Trim lines</label>
    <label style="display:flex;align-items:center;gap:6px;font-family:var(--fM);font-size:12px;cursor:pointer"><input type="checkbox" id="cl-sc"> Special chars</label>
  </div>
</fieldset>
<div class="brow">
  <button class="btn btn-p" onclick="doClean()">🧹 CLEAN</button>
  <button class="btn btn-w btn-sm" onclick="$('cl-i').value='';$('cl-o').value=''">↺ RESET</button>
</div>
<div class="fg" style="margin-top:13px"><label class="lbl" for="cl-o">Output</label>
<textarea class="inp" id="cl-o" rows="7" readonly></textarea></div>
<div class="brow"><button class="btn btn-g" onclick="copyEl('cl-o')">📋 COPY</button></div>${suggest(id)}`;

if(id==='text-counter')return`
<div class="fg"><label class="lbl" for="wc-i">Input Text</label>
<textarea class="inp" id="wc-i" rows="11" placeholder="Type or paste…" oninput="doCount()"></textarea></div>
<div class="srow" id="wc-s" role="status" aria-live="polite">
  <div class="schip"><span id="wc-w">0</span>Words</div>
  <div class="schip"><span id="wc-c">0</span>Chars</div>
  <div class="schip"><span id="wc-ns">0</span>No Spaces</div>
  <div class="schip"><span id="wc-l">0</span>Lines</div>
  <div class="schip"><span id="wc-st">0</span>Sentences</div>
  <div class="schip"><span id="wc-r">0</span>Min Read</div>
</div>
<div class="brow"><button class="btn btn-w btn-sm" onclick="$('wc-i').value='';doCount()">↺ CLEAR</button></div>${suggest(id)}`;

if(id==='text-tts')return`
<div class="fg"><label class="lbl" for="tts-t">Text to Speak</label>
<textarea class="inp" id="tts-t" rows="7" placeholder="Enter text…">Welcome to AKDEV Ultra Tools. Everything. Faster. Smarter.</textarea></div>
<div style="display:flex;gap:14px;flex-wrap:wrap">
  <div class="fg" style="flex:1"><label class="lbl" for="tts-r">Rate: <span id="tts-rv">1.0</span>x</label>
  <input class="inp" type="range" id="tts-r" min="0.5" max="2" step="0.1" value="1" oninput="$('tts-rv').textContent=parseFloat(this.value).toFixed(1)"></div>
  <div class="fg" style="flex:1"><label class="lbl" for="tts-p">Pitch: <span id="tts-pv">1.0</span></label>
  <input class="inp" type="range" id="tts-p" min="0.5" max="2" step="0.1" value="1" oninput="$('tts-pv').textContent=parseFloat(this.value).toFixed(1)"></div>
</div>
<div class="fg"><label class="lbl" for="tts-v">Voice</label><select class="inp" id="tts-v"></select></div>
<div class="brow">
  <button class="btn btn-p" onclick="doTTS()">🔈 SPEAK</button>
  <button class="btn btn-d" onclick="stopTTS()">⏹ STOP</button>
</div>${suggest(id)}`;

if(id==='text-stt')return`
<div style="text-align:center;padding:16px">
  <div id="stt-ind" style="width:74px;height:74px;border-radius:50%;background:rgba(0,200,255,.08);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 14px;transition:all .3s">🎤</div>
  <button class="btn btn-p" id="stt-btn" onclick="toggleSTT()">🎤 START RECORDING</button>
</div>
<div class="fg"><label class="lbl" for="stt-o">Transcript</label>
<textarea class="inp" id="stt-o" rows="7" placeholder="Transcript appears here…" aria-live="polite"></textarea></div>
<div class="brow">
  <button class="btn btn-g" onclick="copyEl('stt-o')">📋 COPY</button>
  <button class="btn btn-w btn-sm" onclick="$('stt-o').value=''">🗑 CLEAR</button>
</div>${suggest(id)}`;

if(id==='text-format')return`
<div class="fg"><label class="lbl" for="fm-i">Input Notes</label>
<textarea class="inp" id="fm-i" rows="7" placeholder="Paste messy notes…"></textarea></div>
<div class="fg"><label class="lbl" for="fm-s">Format Style</label>
<select class="inp" id="fm-s">
  <option value="bullet">Bullet Points (•)</option>
  <option value="numbered">Numbered List</option>
  <option value="clean">Clean Paragraphs</option>
  <option value="markdown">Markdown Headers</option>
</select></div>
<div class="brow">
  <button class="btn btn-p" onclick="doFmt()">✍️ FORMAT</button>
  <button class="btn btn-w btn-sm" onclick="$('fm-i').value='';$('fm-o').value=''">↺ RESET</button>
</div>
<div class="fg" style="margin-top:13px"><label class="lbl" for="fm-o">Output</label>
<textarea class="inp" id="fm-o" rows="7" readonly></textarea></div>
<div class="brow"><button class="btn btn-g" onclick="copyEl('fm-o')">📋 COPY</button></div>${suggest(id)}`;

if(id==='text-random')return`
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="fg" style="flex:1"><label class="lbl" for="rnd-t">Type</label>
  <select class="inp" id="rnd-t">
    <option value="lorem">Lorem Ipsum</option>
    <option value="words">Random Words</option>
    <option value="sentences">Sentences</option>
    <option value="uuid">UUID v4</option>
    <option value="hex">Hex String</option>
  </select></div>
  <div class="fg" style="flex:1"><label class="lbl" for="rnd-c">Count/Length</label>
  <input class="inp" type="number" id="rnd-c" value="5" min="1" max="200">
  <div class="ferr" id="rnd-err"></div></div>
</div>
<div class="brow">
  <button class="btn btn-p" onclick="doRnd()">🎲 GENERATE</button>
  <button class="btn btn-w btn-sm" onclick="$('rnd-o').value=''">↺ CLEAR</button>
</div>
<div class="fg" style="margin-top:13px"><label class="lbl" for="rnd-o">Output</label>
<textarea class="inp" id="rnd-o" rows="8" readonly></textarea></div>
<div class="brow"><button class="btn btn-g" onclick="copyEl('rnd-o')">📋 COPY</button></div>${suggest(id)}`;

/* ── IMAGE TOOLS ── */
if(id==='img-compress')return`
<div class="fg"><label class="lbl">Upload Image</label>
<div class="dz"><input type="file" id="in-ic" accept="image/*" onchange="prevImg('in-ic','ipv-ic')">
<div class="dz-ico">🖼️</div><div class="dz-txt">Drop image to compress</div></div></div>
<img id="ipv-ic" class="iprev" alt="Preview">
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="fg" style="flex:1"><label class="lbl" for="ic-sz">Max Size (KB)</label>
  <input class="inp" type="number" id="ic-sz" value="200" min="10">
  <div class="ferr" id="ic-err"></div></div>
  <div class="fg" style="flex:1"><label class="lbl" for="ic-w">Max Width (px)</label>
  <input class="inp" type="number" id="ic-w" value="1920" min="100"></div>
</div>
<div class="brow"><button class="btn btn-p" onclick="doIC()">🗜️ COMPRESS & DOWNLOAD</button></div>
<div class="proc" id="pc-ic"></div>
<div id="ic-res" style="margin-top:10px;font-family:var(--fM);font-size:13px"></div>${suggest(id)}`;

if(id==='img-resize')return`
<div class="fg"><label class="lbl">Upload Image</label>
<div class="dz"><input type="file" id="in-ir" accept="image/*" onchange="prevImg('in-ir','ipv-ir')">
<div class="dz-ico">📐</div><div class="dz-txt">Drop image to resize</div></div></div>
<img id="ipv-ir" class="iprev" alt="Preview">
<div style="display:flex;gap:12px">
  <div class="fg" style="flex:1"><label class="lbl" for="ir-w">Width (px)</label>
  <input class="inp" type="number" id="ir-w" placeholder="e.g. 800">
  <div class="ferr" id="ir-err"></div></div>
  <div class="fg" style="flex:1"><label class="lbl" for="ir-h">Height (px)</label>
  <input class="inp" type="number" id="ir-h" placeholder="e.g. 600"></div>
</div>
<label style="display:flex;align-items:center;gap:8px;font-family:var(--fM);font-size:12px;cursor:pointer;margin-bottom:13px">
  <input type="checkbox" id="ir-ar" checked> Maintain aspect ratio</label>
<div class="brow"><button class="btn btn-p" onclick="doIR()">📐 RESIZE & DOWNLOAD</button></div>
<div class="proc" id="pc-ir"></div>${suggest(id)}`;

if(id==='img-convert')return`
<div class="fg"><label class="lbl">Upload Image</label>
<div class="dz"><input type="file" id="in-cv" accept="image/*" onchange="prevImg('in-cv','ipv-cv')">
<div class="dz-ico">🔁</div><div class="dz-txt">Drop image to convert</div></div></div>
<img id="ipv-cv" class="iprev" alt="Preview">
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="fg" style="flex:1"><label class="lbl" for="cv-f">Output Format</label>
  <select class="inp" id="cv-f"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WEBP</option></select></div>
  <div class="fg" style="flex:1"><label class="lbl" for="cv-q">Quality: <span id="cv-qv">90%</span></label>
  <input class="inp" type="range" id="cv-q" min="0.1" max="1" step="0.05" value="0.9" oninput="$('cv-qv').textContent=Math.round(this.value*100)+'%'"></div>
</div>
<div class="brow"><button class="btn btn-p" onclick="doCV()">🔁 CONVERT & DOWNLOAD</button></div>
<div class="proc" id="pc-cv"></div>${suggest(id)}`;

if(id==='img-crop')return`
<div class="fg"><label class="lbl">Upload Image</label>
<div class="dz"><input type="file" id="in-cr" accept="image/*" onchange="loadCrop()">
<div class="dz-ico">✂️</div><div class="dz-txt">Drop image to crop</div></div></div>
<div id="crop-wrap" style="position:relative;display:inline-block;max-width:100%;margin:8px 0">
  <canvas id="crop-cv" style="max-width:100%;border:1px solid var(--border);border-radius:8px;display:block;cursor:crosshair"></canvas>
  <canvas id="crop-ov" style="position:absolute;top:0;left:0;max-width:100%;cursor:crosshair;pointer-events:auto"></canvas>
</div>
<div id="crop-dims" style="font-family:var(--fM);font-size:11px;color:var(--cyan);margin-bottom:8px" aria-live="polite"></div>
<div class="brow"><button class="btn btn-p" onclick="doCrop()">✂️ CROP & DOWNLOAD</button></div>${suggest(id)}`;

if(id==='img-base64')return`
<div class="fg"><label class="lbl">Image → Base64</label>
<div class="dz"><input type="file" id="in-b64" accept="image/*" onchange="doI2B64()">
<div class="dz-ico">💾</div><div class="dz-txt">Drop image to encode</div></div></div>
<div class="fg" style="margin-top:11px"><label class="lbl" for="b64-o">Base64 Output</label>
<textarea class="inp" id="b64-o" rows="5" readonly placeholder="Base64 string appears here…"></textarea></div>
<div class="brow"><button class="btn btn-g" onclick="copyEl('b64-o')">📋 COPY</button></div>
<div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border)">
<div class="fg"><label class="lbl" for="b64-i">Base64 → Image</label>
<textarea class="inp" id="b64-i" rows="4" placeholder="Paste base64 data URL…"></textarea></div>
<div class="brow"><button class="btn btn-s" onclick="doB2Img()">🖼️ DECODE & PREVIEW</button></div>
<div id="b64-dec" style="margin-top:8px"></div></div>${suggest(id)}`;

if(id==='img-screenshot')return`
<div style="text-align:center;padding:18px">
  <div style="font-size:46px;margin-bottom:10px">📷</div>
  <div style="font-size:13px;color:var(--dim);font-family:var(--fM);max-width:380px;margin:0 auto 18px;line-height:1.6">
    Uses the Screen Capture API. You will see a browser permission prompt.</div>
  <button class="btn btn-p" onclick="doSS()">📷 CAPTURE SCREEN</button>
</div>
<div id="ss-out" style="margin-top:14px"></div>${suggest(id)}`;

/* ── DEV TOOLS ── */
if(id==='dev-json')return`
<div class="fg"><label class="lbl" for="js-i">Input JSON</label>
<textarea class="inp" id="js-i" rows="8" placeholder='{"key":"value","arr":[1,2,3]}'></textarea></div>
<div class="brow">
  <button class="btn btn-p" onclick="doFmtJ()">✨ FORMAT</button>
  <button class="btn btn-s" onclick="doMinJ()">📦 MINIFY</button>
  <button class="btn btn-g" onclick="doValJ()">✓ VALIDATE</button>
  <button class="btn btn-w btn-sm" onclick="$('js-i').value='';$('js-o').value='';$('js-vm').innerHTML=''">↺ RESET</button>
</div>
<div id="js-vm" style="font-family:var(--fM);font-size:12px;margin:7px 0"></div>
<div class="fg"><label class="lbl" for="js-o">Output</label>
<textarea class="inp" id="js-o" rows="8" readonly></textarea></div>
<div class="brow"><button class="btn btn-g" onclick="copyEl('js-o')">📋 COPY</button></div>${suggest(id)}`;

if(id==='dev-base64')return`
<div class="fg"><label class="lbl" for="d64-i">Input</label>
<textarea class="inp" id="d64-i" rows="5" placeholder="Text to encode, or base64 to decode…"></textarea></div>
<div class="brow">
  <button class="btn btn-p" onclick="doEnc64()">🔒 ENCODE</button>
  <button class="btn btn-s" onclick="doDec64()">🔓 DECODE</button>
  <button class="btn btn-w btn-sm" onclick="$('d64-i').value='';$('d64-o').value='';$('d64-e').classList.remove('show')">↺ RESET</button>
</div>
<div class="ferr" id="d64-e"></div>
<div class="fg" style="margin-top:11px"><label class="lbl" for="d64-o">Output</label>
<textarea class="inp" id="d64-o" rows="5" readonly></textarea></div>
<div class="brow"><button class="btn btn-g" onclick="copyEl('d64-o')">📋 COPY</button></div>${suggest(id)}`;

if(id==='dev-url')return`
<div class="fg"><label class="lbl" for="url-i">Input</label>
<textarea class="inp" id="url-i" rows="5" placeholder="URL or URL-encoded string…"></textarea></div>
<div class="brow">
  <button class="btn btn-p" onclick="doEncURL()">🔒 ENCODE</button>
  <button class="btn btn-s" onclick="doDecURL()">🔓 DECODE</button>
  <button class="btn btn-w btn-sm" onclick="$('url-i').value='';$('url-o').value='';$('url-e').classList.remove('show')">↺ RESET</button>
</div>
<div class="ferr" id="url-e"></div>
<div class="fg" style="margin-top:11px"><label class="lbl" for="url-o">Output</label>
<textarea class="inp" id="url-o" rows="5" readonly></textarea></div>
<div class="brow"><button class="btn btn-g" onclick="copyEl('url-o')">📋 COPY</button></div>${suggest(id)}`;

if(id==='dev-pass')return`
<fieldset style="border:1px solid var(--border);border-radius:8px;padding:11px 13px;margin-bottom:13px">
  <legend style="font-family:var(--fH);font-size:9px;color:var(--cyan);letter-spacing:2px;padding:0 5px">CHARACTER SETS</legend>
  <div style="display:flex;flex-wrap:wrap;gap:11px">
    <label style="display:flex;align-items:center;gap:6px;font-family:var(--fM);font-size:12px;cursor:pointer"><input type="checkbox" id="pw-u" checked> A-Z</label>
    <label style="display:flex;align-items:center;gap:6px;font-family:var(--fM);font-size:12px;cursor:pointer"><input type="checkbox" id="pw-l" checked> a-z</label>
    <label style="display:flex;align-items:center;gap:6px;font-family:var(--fM);font-size:12px;cursor:pointer"><input type="checkbox" id="pw-n" checked> 0-9</label>
    <label style="display:flex;align-items:center;gap:6px;font-family:var(--fM);font-size:12px;cursor:pointer"><input type="checkbox" id="pw-s" checked> !@#$</label>
  </div>
</fieldset>
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="fg" style="flex:1"><label class="lbl" for="pw-len">Length: <span id="pw-lv">16</span></label>
  <input class="inp" type="range" id="pw-len" min="6" max="128" value="16" oninput="$('pw-lv').textContent=this.value"></div>
  <div class="fg" style="flex:1"><label class="lbl" for="pw-cnt">Count</label>
  <input class="inp" type="number" id="pw-cnt" value="5" min="1" max="50">
  <div class="ferr" id="pw-err"></div></div>
</div>
<div class="brow">
  <button class="btn btn-p" onclick="doPass()">🛡️ GENERATE</button>
  <button class="btn btn-w btn-sm" onclick="$('pw-o').textContent=''">↺ CLEAR</button>
</div>
<div class="obox" id="pw-o" style="margin-top:11px" aria-live="polite"></div>
<div class="brow"><button class="btn btn-g" onclick="copyEl('pw-o')">📋 COPY ALL</button></div>${suggest(id)}`;

if(id==='dev-color')return`
<div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;flex-wrap:wrap">
  <label for="col-p" class="lbl" style="margin:0">PICK COLOR</label>
  <input type="color" id="col-p" value="#00c8ff" oninput="updColor()"
    style="width:54px;height:54px;border:none;cursor:pointer;border-radius:9px;background:none;padding:0">
  <div class="obox" id="col-i" style="max-height:none;flex:1;min-width:180px">Select →</div>
</div>
<div class="brow">
  <button class="btn btn-p" onclick="genPal()">🎨 GENERATE PALETTE</button>
  <button class="btn btn-s" onclick="rndColor()">🎲 RANDOM</button>
</div>
<div id="col-pal" class="sw-grid" style="margin-top:14px" role="list"></div>${suggest(id)}`;

if(id==='dev-minify')return`
<div class="fg"><label class="lbl" for="mn-t">Code Type</label>
<select class="inp" id="mn-t"><option value="js">JavaScript</option><option value="css">CSS</option></select></div>
<div class="fg"><label class="lbl" for="mn-i">Input Code</label>
<textarea class="inp" id="mn-i" rows="8" placeholder="Paste code…"></textarea></div>
<div class="brow">
  <button class="btn btn-p" onclick="doMin()">📦 MINIFY</button>
  <button class="btn btn-w btn-sm" onclick="$('mn-i').value='';$('mn-o').value='';$('mn-st').textContent=''">↺ RESET</button>
</div>
<div class="fg" style="margin-top:11px"><label class="lbl" for="mn-o">Output</label>
<textarea class="inp" id="mn-o" rows="5" readonly></textarea></div>
<div id="mn-st" style="font-family:var(--fM);font-size:11px;color:var(--cyan);margin-top:5px" aria-live="polite"></div>
<div class="brow"><button class="btn btn-g" onclick="copyEl('mn-o')">📋 COPY</button></div>${suggest(id)}`;

if(id==='dev-regex')return`
<div class="fg"><label class="lbl" for="rx-p">Pattern (no slashes)</label>
<input class="inp" id="rx-p" placeholder='e.g. \\d+ or [a-z]+' oninput="doRX()">
<div class="ferr" id="rx-e"></div></div>
<div style="display:flex;gap:13px;margin-bottom:11px;flex-wrap:wrap" role="group" aria-label="Regex flags">
  ${['g','i','m','s'].map(f=>`<label style="display:flex;align-items:center;gap:5px;font-family:var(--fM);font-size:12px;cursor:pointer"><input type="checkbox" id="rx-${f}" ${f==='g'?'checked':''} oninput="doRX()"> /${f}</label>`).join('')}
</div>
<div class="fg"><label class="lbl" for="rx-t">Test String</label>
<textarea class="inp" id="rx-t" rows="5" placeholder="Enter test string…" oninput="doRX()"></textarea></div>
<div class="srow" aria-live="polite"><div class="schip"><span id="rx-cnt">0</span>Matches</div></div>
<div class="obox" id="rx-o" style="margin-top:10px"></div>${suggest(id)}`;

/* ── STUDENT TOOLS ── */
/* CGPA — dynamic rows with full localStorage restoration */
if(id==='stu-cgpa')return`
<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:11px">
  <button class="btn btn-s btn-sm" onclick="addCGPA()" aria-label="Add subject row">+ ADD SUBJECT</button>
  <button class="btn btn-w btn-sm" onclick="resetCGPA()" aria-label="Reset all subjects">↺ RESET ALL</button>
  <span style="font-family:var(--fM);font-size:11px;color:var(--dim);margin-left:auto" id="cgpa-cnt"></span>
</div>
<div id="cgpa-rows" role="list" aria-label="Subjects"></div>
<div class="ferr" id="cgpa-err"></div>
<div class="brow"><button class="btn btn-p" onclick="calcCGPA()" aria-label="Calculate CGPA">🎓 CALCULATE CGPA</button></div>
<div class="proc" id="pc-cgpa"></div>
<div id="cgpa-res"></div>${suggest(id)}`;

if(id==='stu-attend')return`
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="fg" style="flex:1"><label class="lbl" for="at-tot">Total Classes</label>
  <input class="inp" type="number" id="at-tot" value="100" min="1" oninput="calcAtt()"></div>
  <div class="fg" style="flex:1"><label class="lbl" for="at-att">Attended</label>
  <input class="inp" type="number" id="at-att" value="75" min="0" oninput="calcAtt()"></div>
  <div class="fg" style="flex:1"><label class="lbl" for="at-req">Required %</label>
  <input class="inp" type="number" id="at-req" value="75" min="1" max="100" oninput="calcAtt()"></div>
</div>
<div class="ferr" id="at-err"></div>
<div id="at-res" aria-live="polite"></div>
<div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border)">
  <label class="lbl" for="at-plan">Plan to attend (additional classes)</label>
  <input class="inp" type="number" id="at-plan" value="0" min="0" oninput="calcAtt()" style="max-width:160px">
</div>
<div class="brow"><button class="btn btn-w btn-sm" onclick="resetAtt()">↺ RESET</button></div>${suggest(id)}`;

if(id==='stu-pomo')return`
<div style="text-align:center">
  <div class="pring" id="pr" role="timer" aria-live="polite"><div class="pring-inner">
    <div class="ptime" id="pt">25:00</div><div class="pmode" id="pm">FOCUS</div>
  </div></div>
  <div class="brow" style="justify-content:center">
    <button class="btn btn-p" id="pb2" onclick="togglePomo()">▶ START</button>
    <button class="btn btn-s" onclick="resetPomo()">⏮ RESET</button>
  </div>
  <div style="display:flex;gap:13px;justify-content:center;margin-top:16px;flex-wrap:wrap">
    <div class="fg"><label class="lbl" for="po-f">Focus (min)</label><input class="inp" type="number" id="po-f" value="25" min="1" max="90" style="width:76px;text-align:center"></div>
    <div class="fg"><label class="lbl" for="po-b">Short Break</label><input class="inp" type="number" id="po-b" value="5" min="1" max="30" style="width:76px;text-align:center"></div>
    <div class="fg"><label class="lbl" for="po-l">Long Break</label><input class="inp" type="number" id="po-l" value="15" min="5" max="60" style="width:76px;text-align:center"></div>
  </div>
  <div style="font-family:var(--fM);font-size:12px;color:var(--dim);margin-top:5px" aria-live="polite">
    Sessions: <span id="po-ses" style="color:var(--cyan)">0</span> / 4</div>
</div>${suggest(id)}`;

if(id==='stu-notes')return`
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="fg" style="flex:1"><label class="lbl" for="no-ti">Title</label><input class="inp" id="no-ti" value="My Study Notes"></div>
  <div class="fg" style="flex:1"><label class="lbl" for="no-su">Subject</label><input class="inp" id="no-su" placeholder="e.g. Data Structures"></div>
</div>
<div class="fg"><label class="lbl" for="no-da">Date</label><input class="inp" type="date" id="no-da" value="${new Date().toISOString().split('T')[0]}"></div>
<div class="fg"><label class="lbl" for="no-co">Notes</label>
<textarea class="inp" id="no-co" rows="11" placeholder="Write notes here…"></textarea>
<div class="ferr" id="no-err"></div></div>
<div class="brow">
  <button class="btn btn-p" onclick="doNotes()">📓 EXPORT PDF</button>
  <button class="btn btn-w btn-sm" onclick="$('no-co').value=''">↺ CLEAR</button>
</div>
<div class="proc" id="pc-no"></div>${suggest(id)}`;

if(id==='stu-resume')return`
<div style="display:flex;gap:14px;flex-wrap:wrap">
  <div style="flex:1;min-width:240px">
    <div class="fg"><label class="lbl" for="rs-n">Full Name</label><input class="inp" id="rs-n" placeholder="Your Name" oninput="updResume()"><div class="ferr" id="rs-nerr"></div></div>
    <div class="fg"><label class="lbl" for="rs-c">Contact</label><input class="inp" id="rs-c" placeholder="email | phone" oninput="updResume()"></div>
    <div class="fg"><label class="lbl" for="rs-lk">LinkedIn/GitHub</label><input class="inp" id="rs-lk" placeholder="linkedin.com/in/…" oninput="updResume()"></div>
    <div class="fg"><label class="lbl" for="rs-ob">Objective</label><textarea class="inp" id="rs-ob" rows="3" placeholder="Career objective…" oninput="updResume()"></textarea></div>
    <div class="fg"><label class="lbl" for="rs-ed">Education</label><textarea class="inp" id="rs-ed" rows="3" placeholder="B.E CSE, XYZ College, 2025" oninput="updResume()"></textarea></div>
    <div class="fg"><label class="lbl" for="rs-sk">Skills</label><textarea class="inp" id="rs-sk" rows="3" placeholder="Python, React, MySQL…" oninput="updResume()"></textarea></div>
    <div class="fg"><label class="lbl" for="rs-pr">Projects</label><textarea class="inp" id="rs-pr" rows="4" placeholder="Project — Description" oninput="updResume()"></textarea></div>
    <div class="fg"><label class="lbl" for="rs-ex">Achievements (optional)</label><textarea class="inp" id="rs-ex" rows="3" oninput="updResume()"></textarea></div>
    <div class="brow">
      <button class="btn btn-p" onclick="doResume()">📄 DOWNLOAD PDF</button>
      <button class="btn btn-w btn-sm" onclick="rstResume()">↺ RESET</button>
    </div>
    <div class="proc" id="pc-rs"></div>
  </div>
  <div style="flex:1;min-width:240px">
    <div class="lbl" style="margin-bottom:7px">LIVE PREVIEW</div>
    <div class="rprev" id="rs-prev">
      <div class="rn" id="rp-n">Your Name</div>
      <div class="rc" id="rp-c">contact info</div>
      <div class="rc" id="rp-lk" style="font-size:9px"></div>
      <div class="rsec">OBJECTIVE</div><div id="rp-ob" style="font-size:11px">—</div>
      <div class="rsec">EDUCATION</div><div id="rp-ed" style="font-size:11px">—</div>
      <div class="rsec">SKILLS</div><div id="rp-sk" style="font-size:11px">—</div>
      <div class="rsec">PROJECTS</div><div id="rp-pr" style="font-size:11px">—</div>
      <div class="rsec" id="rp-exsec" style="display:none">ACHIEVEMENTS</div>
      <div id="rp-ex" style="font-size:11px"></div>
    </div>
  </div>
</div>${suggest(id)}`;

/* ── POWER TOOLS ── */

/* ── TEXT → JSON ── */
if(id==='pw-text2json')return`
<div style="font-family:var(--fM);font-size:11px;color:var(--dim);line-height:1.6;margin-bottom:12px">
  Paste plain text with <strong style="color:var(--cyan)">key: value</strong> pairs (one per line), or any structured text. Auto-converts to valid JSON.
</div>
<div class="fg"><label class="lbl" for="t2j-in">Input Text</label>
<textarea class="inp" id="t2j-in" rows="8" placeholder="name: Aadhavan&#10;college: XYZ Engineering&#10;year: 3&#10;cgpa: 9.1&#10;skills: Python, React, C++&#10;active: true"></textarea></div>
<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:13px">
  <label class="opt-chip"><input type="radio" name="t2j-mode" id="t2j-auto" checked value="auto"> Auto-detect pairs</label>
  <label class="opt-chip"><input type="radio" name="t2j-mode" id="t2j-lines" value="lines"> Each line = item</label>
  <label class="opt-chip"><input type="radio" name="t2j-mode" id="t2j-words" value="words"> Word-count map</label>
</div>
<div class="brow">
  <button class="btn btn-p" onclick="doText2JSON()">⚡ CONVERT TO JSON</button>
  <button class="btn btn-w btn-sm" onclick="$('t2j-in').value='';$('t2j-out').textContent='';$('t2j-err').classList.remove('show');$('t2j-stats').textContent=''">↺ RESET</button>
</div>
<div class="ferr" id="t2j-err"></div>
<div id="t2j-stats" style="font-family:var(--fM);font-size:11px;color:var(--dim);margin:7px 0"></div>
<div class="fg" style="margin-top:10px"><label class="lbl" for="t2j-out">JSON Output</label>
<div class="json-tree" id="t2j-out" aria-live="polite"></div></div>
<div class="brow" id="t2j-btns" style="display:none">
  <button class="btn btn-g" onclick="copyT2J()">📋 COPY JSON</button>
  <button class="btn btn-s" onclick="dlT2J()">📥 DOWNLOAD .json</button>
  <button class="btn btn-s btn-sm" onclick="validateT2J()">✓ RE-VALIDATE</button>
</div>
${suggest(id)}`;

/* ── HTML → PDF ULTRA ── */
if(id==='pw-html2pdf')return`
<div class="tab-row" role="tablist">
  <button class="tab-btn active" id="h2p-tab-code" onclick="switchH2PTab('code')" role="tab">📝 Paste HTML</button>
  <button class="tab-btn" id="h2p-tab-file" onclick="switchH2PTab('file')" role="tab">📎 Upload File</button>
</div>

<div class="tab-pane active" id="h2p-pane-code">
  <div class="fg"><label class="lbl" for="h2p-code">HTML Code</label>
  <textarea class="inp" id="h2p-code" rows="10" placeholder="Paste any HTML here — all sets/tabs will be captured exactly as they appear…"></textarea></div>
</div>

<div class="tab-pane" id="h2p-pane-file">
  <div class="fg"><label class="lbl">Upload HTML File</label>
  <div class="dz"><input type="file" id="h2p-file" accept=".html,.htm" onchange="loadH2PFile()">
  <div class="dz-ico">📎</div><div class="dz-txt">Drag & drop .html file</div>
  <div class="dz-sub">.html · .htm — all tab sets captured</div></div></div>
</div>

<!-- Render width -->
<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:8px;align-items:flex-end">
  <div class="fg" style="flex:1;margin:0"><label class="lbl" for="h2p-width">Render Width (px)</label>
  <input class="inp" type="number" id="h2p-width" value="1080" min="400" max="3000" step="10"
    placeholder="1080" style="font-size:13px">
  <div style="font-size:10px;color:var(--dim);font-family:var(--fM);margin-top:3px">Actual pixel width of the rendered page. Does NOT resize content.</div>
  </div>
  <div class="fg" style="flex:1;margin:0"><label class="lbl" for="h2p-dpr">Resolution (DPR)</label>
  <select class="inp" id="h2p-dpr" style="font-size:13px">
    <option value="1">1× — Normal</option>
    <option value="2" selected>2× — Sharp (recommended)</option>
    <option value="3">3× — Ultra HD (slow)</option>
  </select>
  <div style="font-size:10px;color:var(--dim);font-family:var(--fM);margin-top:3px">Higher = crisper text but slower.</div>
  </div>
</div>

<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px">
  <label class="opt-chip"><input type="checkbox" id="h2p-dark"> Dark mode</label>
  <label class="opt-chip"><input type="checkbox" id="h2p-preview" checked> Show preview</label>
</div>

<div style="background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.15);border-radius:8px;padding:10px 13px;font-family:var(--fM);font-size:11px;color:var(--cyan);line-height:1.7;margin-bottom:14px">
  ✓ <strong>Pixel-perfect mode:</strong> No A4, no squeezing, no splitting.<br>
  Each tab/set is captured at exact pixel size → one continuous PDF page per set.<br>
  PDF page = exact canvas size of the rendered content.
</div>

<div id="h2p-preview-wrap" class="html-preview-wrap" style="display:none">
  <iframe id="h2p-frame" sandbox="allow-same-origin" title="HTML preview"></iframe>
  <div class="preview-overlay"></div>
</div>

<div class="brow">
  <button class="btn btn-s" onclick="previewH2P()">👁 PREVIEW</button>
  <button class="btn btn-p" onclick="doHTML2PDF()">🖨️ EXPORT PIXEL-PERFECT PDF</button>
  <button class="btn btn-w btn-sm" onclick="resetH2P()">↺ RESET</button>
</div>

<div id="h2p-steps" style="display:none;margin-top:12px">
  <div class="step-row" id="h2p-s1"><div class="step-dot"></div>Loading HTML into renderer…</div>
  <div class="step-row" id="h2p-s2"><div class="step-dot"></div>Detecting tabs/sets & capturing each…</div>
  <div class="step-row" id="h2p-s3"><div class="step-dot"></div>Building PDF pages…</div>
  <div class="step-row" id="h2p-s4"><div class="step-dot"></div>Saving PDF…</div>
  <div class="step-row" id="h2p-s5"><div class="step-dot"></div>Done!</div>
</div>
<div class="proc" id="pc-h2p"></div>
<div class="prog-wrap" id="h2p-prog-w" style="display:none"><div class="prog-bar" id="h2p-prog"></div></div>
${suggest(id)}`;

if(id==='pw-url2pdf')return`
<div class="cors-warn">
  ⚠ <strong>Browser CORS limit:</strong> Direct URL fetching is blocked for most sites due to browser security policies. This tool uses a CORS proxy (allOrigins) for public pages. For private/protected pages, paste the HTML source instead using the HTML→PDF tool above.
</div>
<div class="fg"><label class="lbl" for="u2p-url">Website URL</label>
<input class="inp" id="u2p-url" type="url" placeholder="https://example.com" autocomplete="url">
<div class="ferr" id="u2p-err"></div></div>
<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:13px">
  <div class="fg" style="flex:1"><label class="lbl" for="u2p-size">Page Size</label>
  <select class="inp" id="u2p-size"><option value="a4">A4</option><option value="letter">Letter</option><option value="legal">Legal</option></select></div>
  <div class="fg" style="flex:1"><label class="lbl" for="u2p-orient">Orientation</label>
  <select class="inp" id="u2p-orient"><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></div>
</div>
<label class="opt-chip" style="margin-bottom:13px"><input type="checkbox" id="u2p-strip"> Strip scripts & ads before rendering</label>

<div class="brow">
  <button class="btn btn-p" onclick="doURL2PDF()">🌐 FETCH & EXPORT PDF</button>
  <button class="btn btn-w btn-sm" onclick="$('u2p-url').value='';$('u2p-err').classList.remove('show');$('u2p-preview').innerHTML='';$('u2p-steps').style.display='none'">↺ CLEAR</button>
</div>

<!-- Steps -->
<div id="u2p-steps" style="display:none;margin-top:12px">
  <div class="step-row" id="u2p-s1"><div class="step-dot"></div>Fetching URL via proxy…</div>
  <div class="step-row" id="u2p-s2"><div class="step-dot"></div>Injecting into renderer…</div>
  <div class="step-row" id="u2p-s3"><div class="step-dot"></div>Capturing full page…</div>
  <div class="step-row" id="u2p-s4"><div class="step-dot"></div>Building PDF…</div>
  <div class="step-row" id="u2p-s5"><div class="step-dot"></div>Downloading…</div>
</div>
<div class="proc" id="pc-u2p"></div>
<div class="prog-wrap" id="u2p-prog-w" style="display:none"><div class="prog-bar" id="u2p-prog"></div></div>
<div id="u2p-preview" style="margin-top:12px"></div>
${suggest(id)}`;

/* ══════════════════════════════════════════════════
   11 NEW UTILITY TOOLS — UIs
══════════════════════════════════════════════════ */

/* ── QR CODE GENERATOR ── */
if(id==='ut-qrcode')return`
<div class="fg"><label class="lbl" for="qr-txt">Text or URL</label>
<input class="inp" id="qr-txt" placeholder="https://akdev-official.vercel.app" oninput="genQR()" autocomplete="off">
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:13px">
  <div class="fg" style="flex:1"><label class="lbl" for="qr-size">Size (px)</label>
  <select class="inp" id="qr-size" onchange="genQR()">
    <option value="200">200×200</option><option value="300" selected>300×300</option>
    <option value="400">400×400</option><option value="512">512×512</option>
  </select></div>
  <div class="fg" style="flex:1"><label class="lbl" for="qr-fg">Foreground</label>
  <input type="color" id="qr-fg" value="#000000" onchange="genQR()"
    style="width:100%;height:42px;border:1px solid var(--border);border-radius:8px;cursor:pointer;background:none;padding:2px"></div>
  <div class="fg" style="flex:1"><label class="lbl" for="qr-bg">Background</label>
  <input type="color" id="qr-bg" value="#ffffff" onchange="genQR()"
    style="width:100%;height:42px;border:1px solid var(--border);border-radius:8px;cursor:pointer;background:none;padding:2px"></div>
</div>
<div id="qr-out" style="text-align:center;margin:14px 0"></div>
<div style="font-family:var(--fM);font-size:11px;color:var(--dim);margin-bottom:8px;line-height:1.5">
  💡 For best Google Lens / scanner compatibility: keep <strong style="color:var(--text)">dark foreground</strong> on <strong style="color:var(--text)">light background</strong> (default black/white). Custom colors may reduce scanability.
</div>
<div class="brow" id="qr-btns" style="display:none">
  <button class="btn btn-g" onclick="dlQR()">📥 DOWNLOAD PNG</button>
  <button class="btn btn-s" onclick="copyQR()">📋 COPY IMAGE</button>
</div>
<div class="ferr" id="qr-err"></div>
${suggest(id)}`;

/* ── PASSWORD STRENGTH ── */
if(id==='ut-pwstrength')return`
<div class="fg"><label class="lbl" for="pws-inp">Enter Password</label>
<div style="position:relative">
  <input class="inp" id="pws-inp" type="password" placeholder="Type any password…" oninput="checkPWS()" autocomplete="new-password" style="padding-right:42px">
  <button onclick="togglePWSVis()" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--dim);cursor:pointer;font-size:16px" id="pws-eye">👁</button>
</div></div>
<!-- Strength bar -->
<div style="margin-bottom:14px">
  <div style="display:flex;justify-content:space-between;margin-bottom:6px">
    <span style="font-family:var(--fM);font-size:11px;color:var(--dim)">STRENGTH</span>
    <span id="pws-label" style="font-family:var(--fH);font-size:11px;font-weight:700">—</span>
  </div>
  <div style="background:rgba(0,200,255,.08);border-radius:4px;height:6px;overflow:hidden">
    <div id="pws-bar" style="height:100%;width:0%;border-radius:4px;transition:all .4s"></div>
  </div>
</div>
<!-- Stats grid -->
<div class="srow" id="pws-stats">
  <div class="schip"><span id="pws-len">0</span>Length</div>
  <div class="schip"><span id="pws-ent">0</span>Entropy bits</div>
  <div class="schip"><span id="pws-crack">—</span>Crack time</div>
</div>
<!-- Criteria checklist -->
<div id="pws-checks" style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:6px;font-family:var(--fM);font-size:12px"></div>
<div class="brow" style="margin-top:14px">
  <button class="btn btn-w btn-sm" onclick="$('pws-inp').value='';checkPWS()">↺ CLEAR</button>
</div>
${suggest(id)}`;

/* ── HASH GENERATOR ── */
if(id==='ut-hash')return`
<div class="fg"><label class="lbl" for="hash-in">Input Text</label>
<textarea class="inp" id="hash-in" rows="5" placeholder="Enter any text to hash…"></textarea></div>
<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:13px" role="group">
  ${['SHA-256','SHA-1','SHA-512','SHA-384'].map(a=>`<label class="opt-chip"><input type="radio" name="hash-alg" value="${a}" ${a==='SHA-256'?'checked':''}> ${a}</label>`).join('')}
</div>
<div class="brow">
  <button class="btn btn-p" onclick="doHash()">🔒 GENERATE HASH</button>
  <button class="btn btn-w btn-sm" onclick="$('hash-in').value='';$('hash-out').value='';$('hash-meta').textContent=''">↺ RESET</button>
</div>
<div class="proc" id="pc-hash"></div>
<div class="fg" style="margin-top:12px"><label class="lbl" for="hash-out">Hash Output</label>
<textarea class="inp" id="hash-out" rows="3" readonly style="font-size:11px;word-break:break-all"></textarea></div>
<div id="hash-meta" style="font-family:var(--fM);font-size:11px;color:var(--dim);margin-top:5px"></div>
<div class="brow"><button class="btn btn-g" onclick="copyEl('hash-out')">📋 COPY HASH</button></div>
${suggest(id)}`;

/* ── JWT DECODER ── */
if(id==='ut-jwt')return`
<div class="fg"><label class="lbl" for="jwt-in">JWT Token</label>
<textarea class="inp" id="jwt-in" rows="4" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFhZGhhdmFuIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"></textarea></div>
<div class="brow">
  <button class="btn btn-p" onclick="decodeJWT()">🪙 DECODE TOKEN</button>
  <button class="btn btn-w btn-sm" onclick="$('jwt-in').value='';$('jwt-res').innerHTML=''">↺ CLEAR</button>
</div>
<div class="ferr" id="jwt-err"></div>
<div id="jwt-res" style="margin-top:13px"></div>
${suggest(id)}`;

/* ── MARKDOWN → HTML ── */
if(id==='ut-markdown')return`
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="fg" style="flex:1;min-width:200px"><label class="lbl" for="md-in">Markdown</label>
  <textarea class="inp" id="md-in" rows="12" placeholder="# Hello World&#10;&#10;**Bold**, *italic*, \`code\`&#10;&#10;- Item 1&#10;- Item 2&#10;&#10;[Link](https://akdev-official.netlify.app)" oninput="renderMD()"></textarea></div>
  <div class="fg" style="flex:1;min-width:200px"><label class="lbl">Live Preview</label>
  <div id="md-prev" style="background:#fff;color:#111;border-radius:8px;padding:14px;min-height:220px;font-family:Georgia,serif;font-size:13px;line-height:1.7;border:1px solid var(--border);overflow-y:auto;max-height:300px"></div></div>
</div>
<div class="fg"><label class="lbl" for="md-out">HTML Output</label>
<textarea class="inp" id="md-out" rows="5" readonly placeholder="HTML will appear here…"></textarea></div>
<div class="brow">
  <button class="btn btn-g" onclick="copyEl('md-out')">📋 COPY HTML</button>
  <button class="btn btn-s" onclick="dlMD()">📥 DOWNLOAD .html</button>
  <button class="btn btn-w btn-sm" onclick="$('md-in').value='';renderMD()">↺ CLEAR</button>
</div>
${suggest(id)}`;

/* ── CSS BOX SHADOW GENERATOR ── */
if(id==='ut-boxshadow')return`
<div style="display:flex;gap:14px;flex-wrap:wrap">
  <div style="flex:1;min-width:220px">
    ${[
      ['bs-x','Horizontal (px)','-50','50','0'],
      ['bs-y','Vertical (px)','-50','50','4'],
      ['bs-blur','Blur (px)','0','100','10'],
      ['bs-spread','Spread (px)','-30','60','0'],
    ].map(([id,lbl,mn,mx,def])=>`
    <div class="fg"><label class="lbl" for="${id}">${lbl}: <span id="${id}-v">${def}</span></label>
    <input class="inp" type="range" id="${id}" min="${mn}" max="${mx}" value="${def}" oninput="updBS()"></div>`).join('')}
    <div class="fg"><label class="lbl" for="bs-color">Shadow Color</label>
    <input type="color" id="bs-color" value="#00c8ff" onchange="updBS()"
      style="width:100%;height:42px;border:1px solid var(--border);border-radius:8px;cursor:pointer;background:none;padding:2px"></div>
    <label class="opt-chip" style="margin-bottom:13px"><input type="checkbox" id="bs-inset" onchange="updBS()"> Inset shadow</label>
    <label class="opt-chip" style="margin-bottom:13px"><input type="checkbox" id="bs-multi" onchange="updBS()"> Add 2nd layer</label>
  </div>
  <!-- Preview -->
  <div style="flex:1;min-width:200px;display:flex;flex-direction:column;gap:12px">
    <div class="lbl">LIVE PREVIEW</div>
    <div style="flex:1;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:8px;display:flex;align-items:center;justify-content:center;min-height:180px">
      <div id="bs-box" style="width:100px;height:100px;background:var(--cyan);border-radius:10px;transition:box-shadow .2s"></div>
    </div>
    <div class="fg"><label class="lbl" for="bs-out">CSS Output</label>
    <textarea class="inp" id="bs-out" rows="3" readonly style="font-size:11px"></textarea></div>
    <div class="brow"><button class="btn btn-g" onclick="copyEl('bs-out')">📋 COPY CSS</button></div>
  </div>
</div>
${suggest(id)}`;

/* ── COUNTDOWN TIMER ── */
if(id==='ut-countdown')return`
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="fg" style="flex:1"><label class="lbl" for="cd-title">Event Name</label>
  <input class="inp" id="cd-title" placeholder="Exam day · New Year · Project deadline…" value="My Event"></div>
  <div class="fg" style="flex:1"><label class="lbl" for="cd-dt">Target Date & Time</label>
  <input class="inp" type="datetime-local" id="cd-dt"></div>
</div>
<div class="brow">
  <button class="btn btn-p" onclick="startCD()">⏳ START COUNTDOWN</button>
  <button class="btn btn-w btn-sm" onclick="stopCD()">⏹ STOP</button>
</div>
<!-- Big display -->
<div id="cd-disp" style="display:none;margin-top:18px">
  <div id="cd-name" style="font-family:var(--fH);font-size:12px;color:var(--cyan);letter-spacing:2px;text-align:center;margin-bottom:16px"></div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;text-align:center">
    ${['cd-d','cd-h','cd-m','cd-s'].map((id,i)=>`
    <div style="background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:16px 8px">
      <div id="${id}" style="font-family:var(--fH);font-size:32px;font-weight:800;color:var(--cyan)">00</div>
      <div style="font-family:var(--fM);font-size:9px;color:var(--dim);letter-spacing:2px;margin-top:4px">${['DAYS','HRS','MIN','SEC'][i]}</div>
    </div>`).join('')}
  </div>
  <div id="cd-done" style="display:none;text-align:center;margin-top:18px;font-family:var(--fH);font-size:20px;color:var(--green)">🎉 Time's up!</div>
</div>
<div class="ferr" id="cd-err"></div>
${suggest(id)}`;

/* ── DIFF CHECKER ── */
if(id==='ut-diff')return`
<div style="display:flex;gap:12px;flex-wrap:wrap">
  <div class="fg" style="flex:1;min-width:200px"><label class="lbl" for="df-a">Original Text</label>
  <textarea class="inp" id="df-a" rows="9" placeholder="Paste original text here…"></textarea></div>
  <div class="fg" style="flex:1;min-width:200px"><label class="lbl" for="df-b">Modified Text</label>
  <textarea class="inp" id="df-b" rows="9" placeholder="Paste modified text here…"></textarea></div>
</div>
<div class="brow">
  <button class="btn btn-p" onclick="doDiff()">🔀 COMPARE</button>
  <button class="btn btn-w btn-sm" onclick="$('df-a').value='';$('df-b').value='';$('df-out').innerHTML='';$('df-stats').textContent=''">↺ CLEAR</button>
</div>
<div id="df-stats" style="font-family:var(--fM);font-size:11px;color:var(--dim);margin:8px 0"></div>
<div id="df-out" style="margin-top:8px;border:1px solid var(--border);border-radius:8px;padding:12px;font-family:var(--fM);font-size:12px;line-height:1.8;max-height:300px;overflow-y:auto;white-space:pre-wrap"></div>
${suggest(id)}`;

/* ── UNIT CONVERTER ── */
if(id==='ut-units')return`
<div class="fg"><label class="lbl" for="uc-cat">Category</label>
<select class="inp" id="uc-cat" onchange="initUC()">
  <option value="length">📏 Length</option>
  <option value="weight">⚖️ Weight</option>
  <option value="temp">🌡️ Temperature</option>
  <option value="speed">💨 Speed</option>
  <option value="area">🗺️ Area</option>
  <option value="data">💾 Data Storage</option>
</select></div>
<div style="display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap">
  <div class="fg" style="flex:2"><label class="lbl" for="uc-val">Value</label>
  <input class="inp" type="number" id="uc-val" placeholder="Enter value" oninput="doUC()"></div>
  <div class="fg" style="flex:1"><label class="lbl" for="uc-from">From</label>
  <select class="inp" id="uc-from" onchange="doUC()"></select></div>
  <div style="font-family:var(--fH);font-size:14px;color:var(--cyan);padding-bottom:16px">→</div>
  <div class="fg" style="flex:1"><label class="lbl" for="uc-to">To</label>
  <select class="inp" id="uc-to" onchange="doUC()"></select></div>
</div>
<div id="uc-res" class="result-box" style="display:none">
  <div class="rl">RESULT</div>
  <div class="rv" id="uc-rv" style="font-size:32px"></div>
  <div class="rs" id="uc-rs"></div>
</div>
<div id="uc-table" style="margin-top:14px;display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px"></div>
${suggest(id)}`;

/* ── TYPING SPEED TEST ── */
if(id==='ut-typing')return`
<div style="display:flex;gap:10px;margin-bottom:13px;align-items:center;flex-wrap:wrap">
  <div class="fg" style="margin:0;flex:1"><label class="lbl" for="ty-dur">Duration</label>
  <select class="inp" id="ty-dur" style="max-width:140px"><option value="60">60 seconds</option><option value="30">30 seconds</option><option value="120">2 minutes</option></select></div>
  <div id="ty-timer" style="font-family:var(--fH);font-size:24px;color:var(--cyan);font-weight:800;min-width:60px;text-align:right">—</div>
</div>
<!-- Test passage display -->
<div id="ty-passage" style="background:rgba(0,0,0,.5);border:1px solid var(--border);border-radius:8px;padding:14px;font-family:var(--fM);font-size:14px;line-height:1.9;margin-bottom:12px;min-height:80px;color:var(--dim)">Press START to begin</div>
<!-- Input -->
<textarea class="inp" id="ty-inp" rows="4" placeholder="Start typing when the test begins…" disabled oninput="tyCheck()" style="font-size:14px;resize:none"></textarea>
<!-- Stats -->
<div class="srow" id="ty-stats" style="margin-top:10px">
  <div class="schip"><span id="ty-wpm">0</span>WPM</div>
  <div class="schip"><span id="ty-acc">100</span>% Accuracy</div>
  <div class="schip"><span id="ty-errs">0</span>Mistakes</div>
  <div class="schip"><span id="ty-words">0</span>Words</div>
</div>
<div class="brow">
  <button class="btn btn-p" id="ty-start" onclick="startTyping()">▶ START TEST</button>
  <button class="btn btn-w btn-sm" onclick="resetTyping()">↺ RESET</button>
</div>
<div id="ty-result" style="margin-top:12px"></div>
${suggest(id)}`;

/* ── CONTRAST CHECKER ── */
if(id==='ut-contrast')return`
<div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:14px">
  <div class="fg" style="flex:1">
    <label class="lbl" for="cc-fg">Text (Foreground) Color</label>
    <div style="display:flex;gap:8px;align-items:center">
      <input type="color" id="cc-fg" value="#ffffff" onchange="checkCC()"
        style="width:54px;height:42px;border:1px solid var(--border);border-radius:8px;cursor:pointer;background:none;padding:2px">
      <input class="inp" id="cc-fg-hex" value="#ffffff" oninput="syncCC('fg')" style="font-family:var(--fM);font-size:13px" maxlength="7">
    </div>
  </div>
  <div class="fg" style="flex:1">
    <label class="lbl" for="cc-bg">Background Color</label>
    <div style="display:flex;gap:8px;align-items:center">
      <input type="color" id="cc-bg" value="#020408" onchange="checkCC()"
        style="width:54px;height:42px;border:1px solid var(--border);border-radius:8px;cursor:pointer;background:none;padding:2px">
      <input class="inp" id="cc-bg-hex" value="#020408" oninput="syncCC('bg')" style="font-family:var(--fM);font-size:13px" maxlength="7">
    </div>
  </div>
</div>
<!-- Live preview -->
<div id="cc-preview" style="border-radius:10px;padding:20px;margin-bottom:14px;text-align:center;transition:all .3s;border:1px solid var(--border)">
  <div id="cc-prev-large" style="font-size:24px;font-weight:700;margin-bottom:6px">Large Text Sample</div>
  <div id="cc-prev-small" style="font-size:14px">Small body text for readability testing — The quick brown fox jumps over the lazy dog.</div>
</div>
<!-- Results -->
<div id="cc-res" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin-bottom:12px"></div>
<div id="cc-ratio" style="font-family:var(--fH);font-size:13px;color:var(--cyan);text-align:center"></div>
<div class="brow" style="justify-content:center;margin-top:10px">
  <button class="btn btn-s" onclick="swapCC()">⇄ SWAP COLORS</button>
  <button class="btn btn-w btn-sm" onclick="$('cc-fg').value='#ffffff';$('cc-fg-hex').value='#ffffff';$('cc-bg').value='#020408';$('cc-bg-hex').value='#020408';checkCC()">↺ RESET</button>
</div>
${suggest(id)}`;

return`<div style="text-align:center;padding:40px;color:var(--dim)">Tool UI unavailable.</div>`;
}

/* ═══════════════════════════
   TOOL INIT (after panel injected)
═══════════════════════════ */
function initTool(id){
  /* Setup drag&drop + sound on all dropzones */
  document.querySelectorAll('.dz').forEach(dz=>{
    dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('over');hover()});
    dz.addEventListener('dragleave',()=>dz.classList.remove('over'));
    dz.addEventListener('drop',e=>{
      e.preventDefault();dz.classList.remove('over');
      const inp=dz.querySelector('input[type=file]');
      if(inp&&e.dataTransfer.files.length){
        const dt=new DataTransfer();
        for(const f of e.dataTransfer.files)dt.items.add(f);
        inp.files=dt.files;
        inp.dispatchEvent(new Event('change',{bubbles:true}));
        dzLabel(dz,e.dataTransfer.files[0]);
        uploadSound();
      }
    });
    const inp=dz.querySelector('input[type=file]');
    if(inp)inp.addEventListener('change',()=>{uploadSound();if(inp.files[0])dzLabel(dz,inp.files[0])});
  });
  switch(id){
    case 'text-tts':   initTTS(); break;
    case 'stu-cgpa':   initCGPA(); break;
    case 'stu-attend': calcAtt(); break;
    case 'stu-pomo':   initPomo(); break;
    case 'dev-color':  updColor(); break;
    case 'text-counter': doCount(); break;
    case 'ut-qrcode':   setTimeout(genQR,100); break;
    case 'ut-pwstrength': checkPWS(); break;
    case 'ut-boxshadow': updBS(); break;
    case 'ut-units':    initUC(); break;
    case 'ut-markdown': renderMD(); break;
    case 'ut-contrast': checkCC(); break;
    case 'ut-typing':   resetTyping(); break;
  }
}

/* ═══════════════════════════
   PDF TOOLS
═══════════════════════════ */
async function doMerge(){
  const inp=$('in-m');
  if(!inp||inp.files.length<2){notify('Select 2 or more PDF files','error');return}
  showProc('pc-m','Merging PDFs…');showProg('pw-m','pb-m');
  try{
    const{PDFDocument}=PDFLib;const merged=await PDFDocument.create();
    for(let i=0;i<inp.files.length;i++){
      setProg('pb-m',((i+1)/inp.files.length)*100);
      const doc=await PDFDocument.load(await inp.files[i].arrayBuffer());
      const pages=await merged.copyPages(doc,doc.getPageIndices());
      pages.forEach(p=>merged.addPage(p));
    }
    dl(await merged.save(),'merged.pdf','application/pdf');
    notify(`Merged ${inp.files.length} PDFs!`,'success');
  }catch(e){notify('Error: '+e.message,'error')}
  hideProc('pc-m');hideProg('pw-m');
}
async function doSplit(){
  const inp=$('in-s');
  if(!inp?.files[0]){notify('Select a PDF','error');return}
  const rng=val('s-range').trim();
  const errEl=$('s-err');
  if(!rng){errEl.textContent='Enter a page range';errEl.classList.add('show');return}
  errEl.classList.remove('show');
  showProc('pc-s','Splitting…');
  try{
    const{PDFDocument}=PDFLib;
    const doc=await PDFDocument.load(await inp.files[0].arrayBuffer());
    const pages=parseRange(rng,doc.getPageCount());
    if(!pages.length){notify('Invalid range. Try: 1-3,5','error');hideProc('pc-s');return}
    const out=await PDFDocument.create();
    const cp=await out.copyPages(doc,pages.map(p=>p-1));
    cp.forEach(p=>out.addPage(p));
    dl(await out.save(),`pages_${rng.replace(/,/g,'_')}.pdf`,'application/pdf');
    notify(`Extracted ${pages.length} page(s)!`,'success');
  }catch(e){notify('Error: '+e.message,'error')}
  hideProc('pc-s');
}
async function doCompress(){
  const inp=$('in-cp');if(!inp?.files[0]){notify('Select a PDF','error');return}
  showProc('pc-cp','Compressing…');
  try{
    const{PDFDocument}=PDFLib;
    const bytes=await inp.files[0].arrayBuffer();
    const doc=await PDFDocument.load(bytes,{ignoreEncryption:true});
    doc.setTitle('');doc.setAuthor('');doc.setSubject('');doc.setKeywords([]);doc.setCreator('AKDEV Ultra Tools');
    const out=await doc.save({objectsPerTick:50,useObjectStreams:false});
    const orig=bytes.byteLength,nw=out.byteLength;
    $('cp-res').innerHTML=`<span style="color:var(--green)">✓ ${fmtBytes(orig)} → ${fmtBytes(nw)} (${((orig-nw)/orig*100).toFixed(1)}% saved)</span>`;
    dl(out,'compressed.pdf','application/pdf');notify('Compressed!','success');
  }catch(e){notify('Error: '+e.message,'error')}
  hideProc('pc-cp');
}
async function doI2P(){
  const inp=$('in-i2p');if(!inp?.files.length){notify('Select image(s)','error');return}
  showProc('pc-i2p','Converting…');
  try{
    const{jsPDF}=window.jspdf;
    const sm={'A4':[210,297],'Letter':[216,279],'Legal':[216,356]};
    const[pw,ph]=sm[val('i2p-sz')]||sm['A4'];
    const pdf=new jsPDF({unit:'mm',format:[pw,ph]});
    for(let i=0;i<inp.files.length;i++){
      if(i>0)pdf.addPage();
      const url=await toDataURL(inp.files[i]);
      const img=await loadImg(url);
      const r=Math.min((pw-10)/img.naturalWidth,(ph-10)/img.naturalHeight);
      const w=img.naturalWidth*r,h=img.naturalHeight*r;
      pdf.addImage(url,inp.files[i].type.includes('png')?'PNG':'JPEG',(pw-w)/2,(ph-h)/2,w,h);
    }
    pdf.save('images.pdf');notify('Converted!','success');
  }catch(e){notify('Error: '+e.message,'error')}
  hideProc('pc-i2p');
}
async function doT2P(){
  const text=val('t2p-in');const err=$('t2p-err');
  if(!text.trim()){err.textContent='Please enter some text';err.classList.add('show');return}
  err.classList.remove('show');
  const fs=parseInt(val('t2p-fs'))||12;
  if(!validNum(fs,'Font size',8,48))return;
  const title=val('t2p-ti');
  showProc('pc-t2p','Generating…');
  try{
    const{jsPDF}=window.jspdf;const pdf=new jsPDF({unit:'pt',format:'a4'});
    let y=60;
    if(title){pdf.setFontSize(fs+6);pdf.setFont(undefined,'bold');pdf.text(title,40,y);y+=30;pdf.setFont(undefined,'normal')}
    pdf.setFontSize(fs);
    pdf.splitTextToSize(text,515).forEach(l=>{if(y>750){pdf.addPage();y=60}pdf.text(l,40,y);y+=fs*1.3});
    pdf.save('document.pdf');notify('PDF generated!','success');
  }catch(e){notify('Error: '+e.message,'error')}
  hideProc('pc-t2p');
}
async function doP2I(){
  const inp=$('in-p2i');if(!inp?.files[0]){notify('Select a PDF','error');return}
  showProc('pc-p2i','Extracting…');
  try{
    const{PDFDocument}=PDFLib;
    const doc=await PDFDocument.load(await inp.files[0].arrayBuffer());
    const n=doc.getPageCount();
    const single=await PDFDocument.create();
    const[p]=await single.copyPages(doc,[0]);single.addPage(p);
    const blob=new Blob([await single.save()],{type:'application/pdf'});
    const url=URL.createObjectURL(blob);
    $('p2i-out').innerHTML=`<div style="font-family:var(--fM);font-size:12px;color:var(--cyan);margin-bottom:9px">PDF has ${n} page(s). Page 1 ready:</div>
      <a href="${url}" download="page1.pdf" class="btn btn-g" style="text-decoration:none;display:inline-flex">📥 DOWNLOAD PAGE 1</a>
      <div style="font-size:11px;color:var(--dim);font-family:var(--fM);margin-top:9px">💡 Tip: Chrome → Print (Ctrl+P) → Save as PDF/Image</div>`;
    notify('Page extracted!','success');
  }catch(e){notify('Error: '+e.message,'error')}
  hideProc('pc-p2i');
}
async function doWM(){
  const inp=$('in-wm');if(!inp?.files[0]){notify('Select a PDF','error');return}
  const txt=val('wm-t')||'CONFIDENTIAL';
  const op=parseFloat($('wm-op').value)||0.3;
  showProc('pc-wm','Adding watermark…');
  try{
    const{PDFDocument,rgb,StandardFonts,degrees}=PDFLib;
    const doc=await PDFDocument.load(await inp.files[0].arrayBuffer());
    const font=await doc.embedFont(StandardFonts.HelveticaBold);
    doc.getPages().forEach(pg=>{
      const{width,height}=pg.getSize();
      pg.drawText(txt,{x:width/2-txt.length*16,y:height/2,size:54,font,color:rgb(.5,.5,.5),opacity:op,rotate:degrees(45)});
    });
    dl(await doc.save(),'watermarked.pdf','application/pdf');notify('Watermark added!','success');
  }catch(e){notify('Error: '+e.message,'error')}
  hideProc('pc-wm');
}
async function doRotate(){
  const inp=$('in-rt');if(!inp?.files[0]){notify('Select a PDF','error');return}
  const deg=parseInt(val('rt-d'));
  showProc('pc-rt','Rotating…');
  try{
    const{PDFDocument,degrees}=PDFLib;
    const doc=await PDFDocument.load(await inp.files[0].arrayBuffer());
    doc.getPages().forEach(p=>p.setRotation(degrees((p.getRotation().angle+deg)%360)));
    dl(await doc.save(),'rotated.pdf','application/pdf');notify(`Rotated ${deg}°!`,'success');
  }catch(e){notify('Error: '+e.message,'error')}
  hideProc('pc-rt');
}
async function doPN(){
  const inp=$('in-pn');if(!inp?.files[0]){notify('Select a PDF','error');return}
  const start=parseInt(val('pn-s'))||1;
  const err=$('pn-err');
  if(!validNum(start,'Starting number',1)){err.textContent='Must be ≥ 1';err.classList.add('show');return}
  err.classList.remove('show');
  showProc('pc-pn','Adding numbers…');
  try{
    const{PDFDocument,rgb,StandardFonts}=PDFLib;
    const doc=await PDFDocument.load(await inp.files[0].arrayBuffer());
    const font=await doc.embedFont(StandardFonts.Helvetica);
    const pos=val('pn-p');
    doc.getPages().forEach((pg,i)=>{
      const{width,height}=pg.getSize();
      const txt=String(start+i);
      pg.drawText(txt,{x:width/2-txt.length*3,y:pos==='bottom'?16:height-26,size:11,font,color:rgb(.3,.3,.3)});
    });
    dl(await doc.save(),'numbered.pdf','application/pdf');notify('Page numbers added!','success');
  }catch(e){notify('Error: '+e.message,'error')}
  hideProc('pc-pn');
}
async function doLock(){
  const inp=$('in-lk'),pw=val('lk-p'),err=$('lk-err');
  if(!inp?.files[0]){notify('Select a PDF','error');return}
  if(!pw){err.textContent='Please enter a password';err.classList.add('show');return}
  err.classList.remove('show');
  showProc('pc-lk','Applying…');
  try{
    const{PDFDocument}=PDFLib;
    const doc=await PDFDocument.load(await inp.files[0].arrayBuffer());
    doc.setKeywords(['LOCKED','akdev-protected']);doc.setCreator('AKDEV Tools — Protected');
    dl(await doc.save(),'locked.pdf','application/pdf');notify('Lock tag applied','success');
  }catch(e){notify('Error: '+e.message,'error')}
  hideProc('pc-lk');
}
async function doUnlock(){
  const inp=$('in-lk');if(!inp?.files[0]){notify('Select a PDF','error');return}
  showProc('pc-lk','Removing tag…');
  try{
    const{PDFDocument}=PDFLib;
    const doc=await PDFDocument.load(await inp.files[0].arrayBuffer(),{ignoreEncryption:true});
    doc.setKeywords([]);doc.setCreator('AKDEV Ultra Tools');
    dl(await doc.save(),'unlocked.pdf','application/pdf');notify('Lock tag removed!','success');
  }catch(e){notify('Error: '+e.message,'error')}
  hideProc('pc-lk');
}
async function loadReorder(){
  const inp=$('in-ro');if(!inp?.files[0])return;
  try{
    const{PDFDocument}=PDFLib;
    const doc=await PDFDocument.load(await inp.files[0].arrayBuffer());
    const n=doc.getPageCount();
    $('ro-info').textContent=`✓ Loaded: ${n} pages`;
    $('ro-seq').value=Array.from({length:n},(_,i)=>i+1).join(',');
  }catch(e){}
}
async function doReorder(){
  const inp=$('in-ro'),err=$('ro-err');
  if(!inp?.files[0]){notify('Select a PDF','error');return}
  const seq=val('ro-seq').trim();
  if(!seq){err.textContent='Enter page order';err.classList.add('show');return}
  err.classList.remove('show');
  showProc('pc-ro','Reordering…');
  try{
    const{PDFDocument}=PDFLib;
    const bytes=await inp.files[0].arrayBuffer();
    const doc=await PDFDocument.load(bytes);
    const total=doc.getPageCount();
    const order=seq.split(',').map(s=>parseInt(s.trim())-1).filter(n=>n>=0&&n<total);
    if(!order.length){notify('Invalid page order','error');hideProc('pc-ro');return}
    const out=await PDFDocument.create();
    const cp=await out.copyPages(doc,order);
    cp.forEach(p=>out.addPage(p));
    dl(await out.save(),'reordered.pdf','application/pdf');notify('Reordered!','success');
  }catch(e){notify('Error: '+e.message,'error')}
  hideProc('pc-ro');
}

/* ═══════════════════════════
   TEXT TOOLS
═══════════════════════════ */
function doCase(type){
  const inp=val('tc-i');if(!inp.trim()){notify('Enter some text first','error');return}
  const m={
    'UPPERCASE':s=>s.toUpperCase(),
    'lowercase':s=>s.toLowerCase(),
    'Title Case':s=>s.replace(/\w\S*/g,t=>t[0].toUpperCase()+t.slice(1).toLowerCase()),
    'camelCase':s=>s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g,(_,c)=>c.toUpperCase()),
    'snake_case':s=>s.toLowerCase().replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,''),
    'kebab-case':s=>s.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''),
    'PascalCase':s=>s.replace(/\w\S*/g,t=>t[0].toUpperCase()+t.slice(1).toLowerCase()).replace(/\s+/g,''),
    'CONSTANT_CASE':s=>s.toUpperCase().replace(/\s+/g,'_').replace(/[^A-Z0-9_]/g,''),
  };
  $('tc-o').value=(m[type]||((s)=>s))(inp);click();notify('Converted to '+type,'info');
}
function doClean(){
  let t=val('cl-i');if(!t){notify('Enter some text','error');return}
  if($('cl-sp').checked)t=t.replace(/[ \t]+/g,' ');
  if($('cl-tr').checked)t=t.split('\n').map(l=>l.trim()).join('\n');
  if($('cl-bl').checked)t=t.split('\n').filter(l=>l.trim()).join('\n');
  if($('cl-sc').checked)t=t.replace(/[^\w\s.,!?;:'"()\-\n]/g,'');
  $('cl-o').value=t;notify('Cleaned!','success');
}
function doCount(){
  const t=val('wc-i');
  const w=t.trim()?t.trim().split(/\s+/).length:0;
  $('wc-w').textContent=w;$('wc-c').textContent=t.length;
  $('wc-ns').textContent=t.replace(/\s/g,'').length;
  $('wc-l').textContent=t?t.split('\n').length:0;
  $('wc-st').textContent=t.trim()?t.split(/[.!?]+/).filter(s=>s.trim()).length:0;
  const r=Math.ceil(w/200);$('wc-r').textContent=r<1?'<1':r;
}
function initTTS(){
  const sel=$('tts-v');if(!sel)return;
  const pop=()=>{sel.innerHTML='';speechSynthesis.getVoices().forEach((v,i)=>{const o=document.createElement('option');o.value=i;o.textContent=`${v.name} (${v.lang})`;sel.appendChild(o)})};
  pop();speechSynthesis.onvoiceschanged=pop;
}
function doTTS(){
  const t=val('tts-t');if(!t.trim()){notify('Enter text','error');return}
  speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);
  u.rate=parseFloat($('tts-r').value);u.pitch=parseFloat($('tts-p').value);
  const vs=speechSynthesis.getVoices();const vi=parseInt(val('tts-v'));
  if(vs[vi])u.voice=vs[vi];speechSynthesis.speak(u);notify('Speaking…','info');
}
function stopTTS(){speechSynthesis.cancel();notify('Stopped','info')}
let sttR=null,sttOn=false;
function toggleSTT(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){notify('Not supported — try Chrome','error');return}
  if(sttOn){sttR?.stop();sttOn=false;$('stt-btn').textContent='🎤 START RECORDING';$('stt-ind').style.cssText='width:74px;height:74px;border-radius:50%;background:rgba(0,200,255,.08);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 14px;transition:all .3s';return}
  sttR=new SR();sttR.continuous=true;sttR.interimResults=true;
  sttR.onresult=e=>{let f='';for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)f+=e.results[i][0].transcript;if(f)$('stt-o').value+=f+' '};
  sttR.onerror=e=>{notify('Mic error: '+e.error,'error');sttOn=false};
  sttR.start();sttOn=true;
  $('stt-btn').textContent='⏹ STOP';
  $('stt-ind').style.cssText='width:74px;height:74px;border-radius:50%;background:rgba(255,51,102,.14);border:2px solid var(--red);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 14px;box-shadow:0 0 18px rgba(255,51,102,.4)';
  notify('Listening…','info');
}
function doFmt(){
  const inp=val('fm-i');if(!inp.trim()){notify('Enter some text','error');return}
  const lines=inp.split('\n').map(l=>l.trim()).filter(l=>l);
  const style=val('fm-s');
  const fmts={bullet:ls=>ls.map(l=>`• ${l}`).join('\n'),numbered:ls=>ls.map((l,i)=>`${i+1}. ${l}`).join('\n'),clean:ls=>ls.join('\n\n'),markdown:ls=>ls.map((l,i)=>i===0?`# ${l}`:`## ${l}`).join('\n\n')};
  $('fm-o').value=(fmts[style]||fmts['clean'])(lines);notify('Formatted!','success');
}
const LOREM='Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat'.split(' ');
const WORDS='alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omicron pi rho sigma tau upsilon phi chi psi omega'.split(' ');
function doRnd(){
  const type=val('rnd-t');const count=parseInt(val('rnd-c'))||5;
  const err=$('rnd-err');
  if(!validNum(count,'Count',1,200)){err.textContent='Must be 1–200';err.classList.add('show');return}
  err.classList.remove('show');
  const o={
    lorem:()=>LOREM.slice(0,count).join(' '),
    words:()=>Array.from({length:count},()=>WORDS[Math.floor(Math.random()*WORDS.length)]).join(' '),
    sentences:()=>Array.from({length:count},(_,i)=>{const s=LOREM.slice(i*8,(i+1)*8).join(' ');return s[0].toUpperCase()+s.slice(1)+'.'}).join(' '),
    uuid:()=>Array.from({length:count},()=>'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:r&3|8).toString(16)})).join('\n'),
    hex:()=>Array.from({length:count},()=>Array.from({length:32},()=>Math.floor(Math.random()*16).toString(16)).join('')).join('\n'),
  }[type]?.();
  $('rnd-o').value=o||'';notify('Generated!','success');
}

/* ═══════════════════════════
   IMAGE TOOLS
═══════════════════════════ */
function prevImg(inpId,prevId){
  const inp=$(inpId),prev=$(prevId);
  if(!inp||!prev||!inp.files[0])return;
  prev.src=URL.createObjectURL(inp.files[0]);prev.style.display='block';
}
async function doIC(){
  const inp=$('in-ic');if(!inp?.files[0]){notify('Select an image','error');return}
  const maxKB=parseInt(val('ic-sz'))||200;const err=$('ic-err');
  if(!validNum(maxKB,'Max size',10)){err.textContent='Must be ≥ 10 KB';err.classList.add('show');return}
  err.classList.remove('show');
  const maxW=parseInt(val('ic-w'))||1920;
  showProc('pc-ic','Compressing…');
  try{
    const orig=inp.files[0];
    const comp=await imageCompression(orig,{maxSizeMB:maxKB/1024,maxWidthOrHeight:maxW,useWebWorker:true});
    $('ic-res').innerHTML=`<span style="color:var(--green)">✓ ${fmtBytes(orig.size)} → ${fmtBytes(comp.size)} — ${((orig.size-comp.size)/orig.size*100).toFixed(1)}% saved</span>`;
    const a=document.createElement('a');a.href=URL.createObjectURL(comp);a.download='compressed_'+orig.name;a.click();
    notify('Compressed!','success');
  }catch(e){notify('Error: '+e.message,'error')}
  hideProc('pc-ic');
}
async function doIR(){
  const inp=$('in-ir'),err=$('ir-err');
  if(!inp?.files[0]){notify('Select an image','error');return}
  const tw=parseInt(val('ir-w'))||0;const th=parseInt(val('ir-h'))||0;
  if(!tw&&!th){err.textContent='Enter width or height';err.classList.add('show');return}
  err.classList.remove('show');
  showProc('pc-ir','Resizing…');
  const img=await loadImg(URL.createObjectURL(inp.files[0]));
  let nw=tw||img.naturalWidth,nh=th||img.naturalHeight;
  if($('ir-ar').checked){if(tw&&!th)nh=Math.round(img.naturalHeight*(tw/img.naturalWidth));else if(th&&!tw)nw=Math.round(img.naturalWidth*(th/img.naturalHeight))}
  const cv=document.createElement('canvas');cv.width=nw;cv.height=nh;
  cv.getContext('2d').drawImage(img,0,0,nw,nh);
  cv.toBlob(blob=>{
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='resized.'+inp.files[0].name.split('.').pop();a.click();
    notify(`Resized to ${nw}×${nh}!`,'success');hideProc('pc-ir');
  },'image/jpeg',0.92);
}
async function doCV(){
  const inp=$('in-cv');if(!inp?.files[0]){notify('Select an image','error');return}
  const fmt=val('cv-f');const q=parseFloat($('cv-q').value)||0.9;
  showProc('pc-cv','Converting…');
  const img=await loadImg(URL.createObjectURL(inp.files[0]));
  const cv=document.createElement('canvas');cv.width=img.naturalWidth;cv.height=img.naturalHeight;
  cv.getContext('2d').drawImage(img,0,0);
  const ext={['image/jpeg']:'jpg',['image/png']:'png',['image/webp']:'webp'}[fmt];
  cv.toBlob(blob=>{
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='converted.'+ext;a.click();
    notify('Converted to '+ext.toUpperCase()+'!','success');hideProc('pc-cv');
  },fmt,q);
}
let CS={sx:0,sy:0,ex:0,ey:0,drag:false,img:null,sc:1};
function loadCrop(){
  const inp=$('in-cr');if(!inp?.files[0])return;
  const cv=$('crop-cv'),ov=$('crop-ov');if(!cv||!ov)return;
  const img=new Image();
  img.onload=()=>{
    CS.img=img;
    const mw=Math.min(580,$('tpanel').offsetWidth-60);
    const sc=Math.min(1,mw/img.naturalWidth);
    cv.width=img.naturalWidth*sc;cv.height=img.naturalHeight*sc;
    ov.width=cv.width;ov.height=cv.height;CS.sc=1/sc;
    cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
    setupCrop(ov);$('crop-dims').textContent='Click & drag on the image to select crop area';
  };
  img.src=URL.createObjectURL(inp.files[0]);
}
function setupCrop(ov){
  let x0,y0;
  const pos=e=>{const r=ov.getBoundingClientRect();return e.touches?{x:e.touches[0].clientX-r.left,y:e.touches[0].clientY-r.top}:{x:e.clientX-r.left,y:e.clientY-r.top}};
  ov.onmousedown=ov.ontouchstart=e=>{e.preventDefault();const{x,y}=pos(e);x0=x;y0=y;CS.drag=true};
  ov.onmousemove=ov.ontouchmove=e=>{
    if(!CS.drag)return;e.preventDefault();const{x,y}=pos(e);
    const ctx=ov.getContext('2d');ctx.clearRect(0,0,ov.width,ov.height);
    ctx.fillStyle='rgba(0,200,255,.1)';ctx.strokeStyle='rgba(0,200,255,.9)';ctx.lineWidth=1.5;
    ctx.fillRect(x0,y0,x-x0,y-y0);ctx.strokeRect(x0,y0,x-x0,y-y0);
    CS.sx=x0;CS.sy=y0;CS.ex=x;CS.ey=y;
    $('crop-dims').textContent=`Selection: ${Math.abs(Math.round((x-x0)*CS.sc))}×${Math.abs(Math.round((y-y0)*CS.sc))}px`;
  };
  ov.onmouseup=ov.ontouchend=()=>{CS.drag=false};
}
function doCrop(){
  if(!CS.img){notify('Load an image first','error');return}
  const sc=CS.sc;
  const sx=Math.min(CS.sx,CS.ex)*sc,sy=Math.min(CS.sy,CS.ey)*sc;
  const sw=Math.abs(CS.ex-CS.sx)*sc,sh=Math.abs(CS.ey-CS.sy)*sc;
  if(sw<2||sh<2){notify('Draw a selection area first','error');return}
  const cv=document.createElement('canvas');cv.width=sw;cv.height=sh;
  cv.getContext('2d').drawImage(CS.img,sx,sy,sw,sh,0,0,sw,sh);
  cv.toBlob(blob=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='cropped.png';a.click();notify(`Cropped ${Math.round(sw)}×${Math.round(sh)}px!`,'success')},'image/png');
}
function doI2B64(){
  const inp=$('in-b64');if(!inp?.files[0])return;
  const fr=new FileReader();fr.onload=e=>{$('b64-o').value=e.target.result;notify('Encoded!','success')};
  fr.readAsDataURL(inp.files[0]);
}
function doB2Img(){
  const src=val('b64-i').trim();if(!src){notify('Paste a base64 string','error');return}
  const out=$('b64-dec');
  const img=document.createElement('img');
  img.src=src.startsWith('data:')?src:'data:image/png;base64,'+src;
  img.alt='Decoded';img.style.cssText='max-width:100%;border-radius:8px;border:1px solid var(--border);margin-top:6px;display:block';
  img.onerror=()=>notify('Invalid base64','error');
  const a=document.createElement('a');a.href=img.src;a.download='decoded.png';
  const btn=document.createElement('button');btn.className='btn btn-g';btn.style.marginTop='7px';btn.textContent='📥 DOWNLOAD';btn.onclick=()=>a.click();
  out.innerHTML='';out.appendChild(img);out.appendChild(btn);notify('Decoded!','success');
}
async function doSS(){
  try{
    const stream=await navigator.mediaDevices.getDisplayMedia({video:true});
    const video=document.createElement('video');video.srcObject=stream;await video.play();
    await new Promise(r=>setTimeout(r,200));
    const cv=document.createElement('canvas');cv.width=video.videoWidth;cv.height=video.videoHeight;
    cv.getContext('2d').drawImage(video,0,0);stream.getTracks().forEach(t=>t.stop());
    const url=cv.toDataURL('image/png');
    const out=$('ss-out');
    const img=document.createElement('img');img.src=url;img.alt='Screenshot';
    img.style.cssText='max-width:100%;border-radius:8px;border:1px solid var(--border);display:block';
    const btn=document.createElement('button');btn.className='btn btn-g';btn.style.marginTop='9px';
    btn.textContent='📥 DOWNLOAD';btn.onclick=()=>{const a=document.createElement('a');a.href=url;a.download='screenshot.png';a.click()};
    out.innerHTML='';out.appendChild(img);out.appendChild(btn);notify('Captured!','success');
  }catch(e){notify('Cancelled or not supported','error')}
}

/* ═══════════════════════════
   DEV TOOLS
═══════════════════════════ */
function doFmtJ(){try{$('js-o').value=JSON.stringify(JSON.parse(val('js-i')),null,2);$('js-vm').innerHTML='<span style="color:var(--green)">✓ Valid JSON</span>';notify('Formatted!','success')}catch(e){$('js-vm').innerHTML=`<span style="color:var(--red)">✕ ${e.message}</span>`;notify('Invalid JSON','error')}}
function doMinJ(){try{$('js-o').value=JSON.stringify(JSON.parse(val('js-i')));notify('Minified!','success')}catch(e){notify('Invalid JSON','error')}}
function doValJ(){try{JSON.parse(val('js-i'));$('js-vm').innerHTML='<span style="color:var(--green)">✓ Valid JSON!</span>';notify('Valid!','success')}catch(e){$('js-vm').innerHTML=`<span style="color:var(--red)">✕ ${e.message}</span>`;notify('Invalid JSON','error')}}
function doEnc64(){const e=$('d64-e');try{$('d64-o').value=btoa(unescape(encodeURIComponent(val('d64-i'))));e.classList.remove('show');notify('Encoded!','success')}catch(ex){e.textContent='Encoding failed: '+ex.message;e.classList.add('show');notify('Failed','error')}}
function doDec64(){const e=$('d64-e');try{$('d64-o').value=decodeURIComponent(escape(atob(val('d64-i'))));e.classList.remove('show');notify('Decoded!','success')}catch(ex){e.textContent='Invalid base64: '+ex.message;e.classList.add('show');notify('Invalid base64','error')}}
function doEncURL(){$('url-o').value=encodeURIComponent(val('url-i'));notify('Encoded!','success')}
function doDecURL(){const e=$('url-e');try{$('url-o').value=decodeURIComponent(val('url-i'));e.classList.remove('show');notify('Decoded!','success')}catch(ex){e.textContent='Decode failed: '+ex.message;e.classList.add('show');notify('Failed','error')}}
function doPass(){
  const pool=[$('pw-u').checked?'ABCDEFGHIJKLMNOPQRSTUVWXYZ':'',
    $('pw-l').checked?'abcdefghijklmnopqrstuvwxyz':'',
    $('pw-n').checked?'0123456789':'',
    $('pw-s').checked?'!@#$%^&*()_+-=[]{}|;:,.<>?':''].join('');
  if(!pool){notify('Select at least one charset','error');return}
  const len=parseInt($('pw-len').value)||16;
  const cnt=parseInt(val('pw-cnt'))||5;const err=$('pw-err');
  if(!validNum(cnt,'Count',1,50)){err.textContent='Must be 1–50';err.classList.add('show');return}
  err.classList.remove('show');
  $('pw-o').textContent=Array.from({length:cnt},()=>Array.from({length:len},()=>pool[Math.floor(Math.random()*pool.length)]).join('')).join('\n');
  notify('Generated!','success');
}
function updColor(){
  const hex=val('col-p')||'#00c8ff';
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  const max=Math.max(r,g,b)/255,min=Math.min(r,g,b)/255,l=(max+min)/2,d=max-min;
  const s=d===0?0:d/(1-Math.abs(2*l-1));
  const h=d===0?0:max===r/255?((g/255-b/255)/d)%6:max===g/255?(b/255-r/255)/d+2:(r/255-g/255)/d+4;
  const ci=$('col-i');if(ci)ci.textContent=`HEX: ${hex}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${Math.round(h*60+360)%360}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;
}
function rndColor(){const h='#'+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0');$('col-p').value=h;updColor()}
function genPal(){
  const hex=val('col-p');
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  const h=(r,g,b)=>'#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
  const pal=[hex,h(r+80,g,b),h(r,g+80,b),h(r,g,b+80),h(255-r,255-g,255-b),h(r*.6,g*.6,b*.6),h(r*1.4,g*1.4,b*1.4),h((r+g)/2,(g+b)/2,(r+b)/2)];
  $('col-pal').innerHTML=pal.map(c=>`<div class="sw" style="background:${c}" title="Copy ${c}" role="button" tabindex="0"
    onclick="navigator.clipboard.writeText('${c}');notify('Copied: ${c}','success')"
    onkeydown="if(event.key==='Enter')this.click()"><span class="sw-hex">${c}</span></div>`).join('');
  notify('Palette generated! Click to copy.','success');
}
function doMin(){
  const code=val('mn-i');if(!code.trim()){notify('Enter code','error');return}
  const type=val('mn-t');
  let out=type==='js'
    ?code.replace(/\/\/[^\n]*/g,'').replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').replace(/\s*([{};:,=+\-*\/()[\]<>!&|])\s*/g,'$1').trim()
    :code.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').replace(/\s*([{};:,])\s*/g,'$1').trim();
  $('mn-o').value=out;
  $('mn-st').textContent=`${code.length} → ${out.length} chars · ${((code.length-out.length)/code.length*100).toFixed(1)}% saved`;
  notify('Minified!','success');
}
function doRX(){
  const pat=val('rx-p'),test=val('rx-t'),out=$('rx-o'),err=$('rx-e');
  if(!pat){out.textContent=test;$('rx-cnt').textContent='0';err.classList.remove('show');return}
  try{
    const flags=['g','i','m','s'].filter(f=>$('rx-'+f)?.checked).join('');
    const rx=new RegExp(pat,flags);
    const mc=[...test.matchAll(new RegExp(pat,'g'+flags.replace('g','')))];
    $('rx-cnt').textContent=mc.length;
    out.innerHTML=test.replace(rx,'<mark class="rmatch">$&</mark>');
    err.classList.remove('show');
  }catch(e){out.textContent='Invalid regex: '+e.message;err.textContent=e.message;err.classList.add('show')}
}

/* ═══════════════════════════
   STUDENT — CGPA (Dynamic rows + localStorage)
   Requirements: add rows, delete each with ❌, reset all, validation, result display, persistence
═══════════════════════════ */
const GP={'O':10,'A+':9,'A':8,'B+':7,'B':6,'C':5,'P':4,'F':0};
const GOPTS=Object.keys(GP).map(g=>`<option value="${g}">${g} (${GP[g]})</option>`).join('');
let cgpaRowN=0;

function initCGPA(){
  /* 1. Restore from localStorage, or seed 4 default rows */
  const saved=JSON.parse(localStorage.getItem('akdev_cgpa')||'null');
  const rows=saved||Array.from({length:4},()=>({name:'',credits:'3',grade:'O'}));
  $('cgpa-rows').innerHTML='';cgpaRowN=0;
  rows.forEach(r=>addCGPA(r));
}

function addCGPA(data={}){
  const container=$('cgpa-rows');if(!container)return;
  const rowId='cr'+cgpaRowN++;
  const div=document.createElement('div');
  div.className='drow';div.dataset.rowId=rowId;div.setAttribute('role','listitem');
  div.innerHTML=`
    <!-- Subject name -->
    <input class="inp" placeholder="Subject ${cgpaRowN}" value="${data.name||''}"
      style="flex:2" aria-label="Subject name" oninput="saveCGPA()">
    <!-- Credits -->
    <input class="inp" type="number" value="${data.credits||'3'}" min="1" max="6"
      placeholder="Credits" style="flex:0.8;min-width:68px"
      aria-label="Credits" oninput="saveCGPA()">
    <!-- Grade -->
    <select class="inp" style="flex:1;min-width:88px" aria-label="Grade" onchange="saveCGPA()">
      ${GOPTS}
    </select>
    <!-- ❌ delete button — each row has its own delete -->
    <button class="del-btn" onclick="delCGPA(this)" aria-label="Remove this subject" title="Remove subject">❌</button>`;
  /* Restore grade */
  const sel=div.querySelector('select');
  if(data.grade)sel.value=data.grade;
  container.appendChild(div);
  updCGPACnt();
}

function delCGPA(btn){
  const rows=$('cgpa-rows');
  if(rows.children.length<=1){notify('Need at least 1 subject','warn');return}
  btn.closest('.drow').remove();
  updCGPACnt();saveCGPA();click();
}

function updCGPACnt(){
  const el=$('cgpa-cnt'),n=$('cgpa-rows')?.children.length||0;
  if(el)el.textContent=n+' subject'+(n!==1?'s':'');
}

/* Save current state to localStorage so data survives page refresh */
function saveCGPA(){
  const rows=[...$('cgpa-rows').querySelectorAll('.drow')].map(row=>{
    const ins=row.querySelectorAll('input'),sel=row.querySelector('select');
    return{name:ins[0].value,credits:ins[1].value,grade:sel.value};
  });
  localStorage.setItem('akdev_cgpa',JSON.stringify(rows));
}

function resetCGPA(){
  localStorage.removeItem('akdev_cgpa');
  $('cgpa-rows').innerHTML='';cgpaRowN=0;
  for(let i=0;i<4;i++)addCGPA();
  $('cgpa-res').innerHTML='';
  $('cgpa-err').textContent='';$('cgpa-err').classList.remove('show');
  notify('Reset!','info');click();
}

function calcCGPA(){
  const rows=[...$('cgpa-rows').querySelectorAll('.drow')];
  const err=$('cgpa-err');err.textContent='';err.classList.remove('show');
  let totalPts=0,totalCred=0,hasErr=false;
  rows.forEach((row,i)=>{
    const ins=row.querySelectorAll('input');
    const credInp=ins[1];
    const cred=parseFloat(credInp.value);
    const grade=row.querySelector('select').value;
    if(isNaN(cred)||cred<0||cred>6){
      credInp.classList.add('err');hasErr=true;
      err.textContent=`Row ${i+1}: Credits must be a number between 0 and 6`;err.classList.add('show');
    } else { credInp.classList.remove('err') }
    totalPts+=(GP[grade]||0)*cred;totalCred+=cred;
  });
  if(hasErr)return;
  if(!totalCred){notify('Add at least one subject with credits','error');return}
  /* Show processing indicator for nice feedback */
  showProc('pc-cgpa','Calculating…');
  setTimeout(()=>{
    hideProc('pc-cgpa');
    const gpa=(totalPts/totalCred).toFixed(2);
    const g=parseFloat(gpa);
    const ltr=g>=9?'O':g>=8?'A+':g>=7?'A':g>=6?'B+':g>=5?'B':g>=4?'P':'F';
    const color=g>=8?'var(--green)':g>=6?'var(--cyan)':g>=4?'var(--orange)':'var(--red)';
    /* Large highlighted result as per requirement */
    $('cgpa-res').innerHTML=`
      <div class="result-box">
        <div class="rl">YOUR CGPA / GPA</div>
        <div class="rv" style="color:${color};-webkit-text-fill-color:${color}">${gpa}</div>
        <div class="rs">Grade: <strong>${ltr}</strong> &nbsp;·&nbsp; Credits: <strong>${totalCred}</strong></div>
      </div>`;
    saveCGPA();notify('CGPA: '+gpa,'success');
  },550);
}

/* ═══════════════════════════
   STUDENT — Attendance
═══════════════════════════ */
function calcAtt(){
  const tot=parseInt(val('at-tot'))||0;
  const att=parseInt(val('at-att'))||0;
  const req=parseInt(val('at-req'))||75;
  const plan=parseInt(val('at-plan'))||0;
  const err=$('at-err'),res=$('at-res');
  err.textContent='';err.classList.remove('show');
  if(!tot){res.innerHTML='';return}
  if(att>tot){err.textContent='Attended cannot exceed total';err.classList.add('show');res.innerHTML='';return}
  if(req<1||req>100){err.textContent='Required % must be 1–100';err.classList.add('show');res.innerHTML='';return}
  const pct=(att/tot*100).toFixed(2);const color=parseFloat(pct)>=req?'var(--green)':'var(--red)';
  let advice='';
  if(parseFloat(pct)<req){const need=Math.ceil((req*tot-100*att)/(100-req));advice=`<div style="color:var(--red);font-family:var(--fM);font-size:13px;margin-top:7px">⚠ Need <strong>${need}</strong> more class(es) to reach ${req}%</div>`}
  else{const can=Math.floor((att-req/100*tot)/(req/100));advice=`<div style="color:var(--green);font-family:var(--fM);font-size:13px;margin-top:7px">✓ Can miss up to <strong>${can}</strong> more class(es) and stay above ${req}%</div>`}
  let fc='';
  if(plan>0){const fp=((att+plan)/(tot+plan)*100).toFixed(2);fc=`<div style="color:var(--cyan);font-family:var(--fM);font-size:12px;margin-top:5px">After ${plan} more: <strong>${fp}%</strong></div>`}
  res.innerHTML=`<div class="result-box" style="text-align:left;padding:15px">
    <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
      <div><div class="rl">ATTENDANCE</div>
        <div class="rv" style="font-size:36px;color:${color};-webkit-text-fill-color:${color}">${pct}%</div></div>
      <div style="font-family:var(--fM);font-size:12px;color:var(--dim);line-height:2">
        <div>Attended: <span style="color:var(--text)">${att}</span></div>
        <div>Total: <span style="color:var(--text)">${tot}</span></div>
        <div>Required: <span style="color:var(--text)">${req}%</span></div>
      </div>
    </div>${advice}${fc}</div>`;
}
function resetAtt(){
  ['at-tot','at-att','at-plan'].forEach(id=>{const el=$(id);if(el)el.value=''});
  $('at-req').value='75';$('at-res').innerHTML='';$('at-err').classList.remove('show');
  notify('Reset!','info');click();
}

/* ═══════════════════════════
   STUDENT — Pomodoro
═══════════════════════════ */
let pomoT=null,pomoSec=0,pomoFocus=true,pomoSes=0,pomoPaused=true;
function initPomo(){pomoSec=(parseInt(val('po-f'))||25)*60;updPomo()}
function togglePomo(){
  if(pomoPaused){
    pomoPaused=false;$('pb2').textContent='⏸ PAUSE';
    pomoT=setInterval(()=>{
      pomoSec--;updPomo();
      if(pomoSec<=0){
        clearInterval(pomoT);pomoPaused=true;$('pb2').textContent='▶ START';
        if(pomoFocus){
          pomoSes++;$('po-ses').textContent=pomoSes;
          if(pomoSes%4===0){pomoSec=(parseInt(val('po-l'))||15)*60;$('pm').textContent='LONG BREAK';notify('Long break!','success')}
          else{pomoSec=(parseInt(val('po-b'))||5)*60;$('pm').textContent='BREAK';notify('Short break!','success')}
          pomoFocus=false;
        }else{pomoFocus=true;pomoSec=(parseInt(val('po-f'))||25)*60;$('pm').textContent='FOCUS';notify('Focus time!','info')}
        updPomo();
      }
    },1000);
  }else{pomoPaused=true;clearInterval(pomoT);$('pb2').textContent='▶ START'}
}
function resetPomo(){clearInterval(pomoT);pomoPaused=true;pomoFocus=true;pomoSes=0;$('pb2').textContent='▶ START';$('po-ses').textContent='0';$('pm').textContent='FOCUS';initPomo();notify('Reset!','info')}
function updPomo(){
  const m=Math.floor(pomoSec/60),s=pomoSec%60;
  const el=$('pt');if(el)el.textContent=`${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  const total=(parseInt(val(pomoFocus?'po-f':'po-b'))||25)*60;
  const pct=(1-pomoSec/total)*100;
  const ring=$('pr');if(ring)ring.style.background=`conic-gradient(var(--cyan) ${Math.max(0,Math.min(100,pct))}%,rgba(0,200,255,.1) ${Math.max(0,Math.min(100,pct))}%)`;
}

/* ═══════════════════════════
   STUDENT — Notes to PDF
═══════════════════════════ */
async function doNotes(){
  const content=val('no-co');const err=$('no-err');
  if(!content.trim()){err.textContent='Enter some notes first';err.classList.add('show');return}
  err.classList.remove('show');
  showProc('pc-no','Generating…');
  try{
    const{jsPDF}=window.jspdf;const pdf=new jsPDF({unit:'pt',format:'a4'});
    let y=58;const title=val('no-ti'),subj=val('no-su'),date=val('no-da');
    pdf.setFontSize(20);pdf.setFont(undefined,'bold');pdf.text(title||'Notes',40,y);y+=26;
    if(subj||date){pdf.setFontSize(10);pdf.setFont(undefined,'italic');pdf.setTextColor(100);if(subj)pdf.text(subj,40,y);if(date)pdf.text(date,555.6,y,{align:'right'});y+=16;pdf.setTextColor(0)}
    pdf.setFontSize(11);pdf.setFont(undefined,'normal');pdf.line(40,y,555.6,y);y+=13;
    pdf.splitTextToSize(content,515).forEach(l=>{if(y>750){pdf.addPage();y=58}pdf.text(l,40,y);y+=13});
    pdf.save('notes.pdf');notify('Notes exported!','success');
  }catch(e){notify('Error: '+e.message,'error')}
  hideProc('pc-no');
}

/* ═══════════════════════════
   STUDENT — Resume
═══════════════════════════ */
function updResume(){
  const v=id=>$(id)?.value||'';
  $('rp-n').textContent=v('rs-n')||'Your Name';$('rp-c').textContent=v('rs-c')||'contact info';
  $('rp-lk').textContent=v('rs-lk');$('rp-ob').textContent=v('rs-ob')||'—';
  $('rp-ed').textContent=v('rs-ed')||'—';$('rp-sk').textContent=v('rs-sk')||'—';
  $('rp-pr').textContent=v('rs-pr')||'—';
  const ex=v('rs-ex');$('rp-exsec').style.display=ex?'':'none';$('rp-ex').textContent=ex;
}
function rstResume(){
  ['rs-n','rs-c','rs-lk','rs-ob','rs-ed','rs-sk','rs-pr','rs-ex'].forEach(id=>{const el=$(id);if(el)el.value=''});
  updResume();notify('Resume cleared','info');click();
}
function doResume(){
  const name=val('rs-n');const err=$('rs-nerr');
  if(!name.trim()){err.textContent='Enter your name';err.classList.add('show');$('rs-n').classList.add('err');return}
  err.classList.remove('show');$('rs-n').classList.remove('err');
  showProc('pc-rs','Building…');
  setTimeout(()=>{
    try{
      const{jsPDF}=window.jspdf;const pdf=new jsPDF({unit:'pt',format:'a4'});
      let y=58;
      pdf.setFontSize(22);pdf.setFont(undefined,'bold');pdf.text(name,297.6,y,{align:'center'});y+=20;
      const c=val('rs-c');if(c){pdf.setFontSize(10);pdf.setFont(undefined,'normal');pdf.setTextColor(80);pdf.text(c,297.6,y,{align:'center'});y+=13;pdf.setTextColor(0)}
      const lk=val('rs-lk');if(lk){pdf.setFontSize(10);pdf.setTextColor(0,100,180);pdf.text(lk,297.6,y,{align:'center'});y+=13;pdf.setTextColor(0)}
      [{t:'OBJECTIVE',v:val('rs-ob')},{t:'EDUCATION',v:val('rs-ed')},{t:'SKILLS',v:val('rs-sk')},{t:'PROJECTS',v:val('rs-pr')},{t:'ACHIEVEMENTS',v:val('rs-ex')}].filter(s=>s.v).forEach(sec=>{
        y+=9;pdf.setFontSize(11);pdf.setFont(undefined,'bold');pdf.text(sec.t,40,y);pdf.line(40,y+2,555.6,y+2);y+=13;
        pdf.setFont(undefined,'normal');pdf.setFontSize(10);
        pdf.splitTextToSize(sec.v,515).forEach(l=>{if(y>750){pdf.addPage();y=58}pdf.text(l,40,y);y+=11});
      });
      pdf.save(name.replace(/\s+/g,'_')+'_Resume.pdf');notify('Resume downloaded!','success');
    }catch(e){notify('Error: '+e.message,'error')}
    hideProc('pc-rs');
  },400);
}
/* ═══════════════════════════
FEEDBACK SYSTEM
─────────────────────────
Chat widget + Star Rating sending via EmailJS
═══════════════════════════ */
let fbOpen=false,fbIntro=false;
const BOT=[
'Hi! 👋 How can I help you today?',
'Tell me about any bugs, slow tools, or features you\'d love to see!',
'Your message goes straight to the dev — I\'ll look into it 🛠️',
];

function toggleFB(){
fbOpen=!fbOpen;
const panel=$('fb-panel');
if (!panel) return;
panel.classList.toggle('open',fbOpen);
panel.setAttribute('aria-hidden',String(!fbOpen));
if(fbOpen&&!fbIntro){fbIntro=true;BOT.forEach((m,i)=>setTimeout(()=>addMsg(m,'bot'),i*600))}
if(fbOpen)setTimeout(()=>$('fb-inp')?.focus(),220);
}

function addMsg(text,role){
const chat=$('fb-chat');
if (!chat) return;
const d=document.createElement('div');d.className='cmsg '+role;d.textContent=text;
chat.appendChild(d);chat.scrollTop=chat.scrollHeight;
}

function fbResize(el){
el.style.height='auto';
el.style.height=Math.min(el.scrollHeight,90)+'px';
}

/* Star Rating Logic */
function setRating(val) {
const ratingInput = document.getElementById('fb-rating-val');
if (ratingInput) ratingInput.value = val;

const stars = document.querySelectorAll('.fb-star');
stars.forEach((s, i) => {
if (i < val) s.classList.add('active'); else s.classList.remove('active'); }); } // Ensure initial 5-star setup
    setTimeout(()=> setRating(5), 100);

    /* Submit using EmailJS */
    /* Submit using SheetDB */
    /* ═══════════════════════════
    FEEDBACK SYSTEM (SHEETDB INTEGRATION)
    ═══════════════════════════ */
  /* ═══════════════════════════
  FEEDBACK SYSTEM (SHEETDB INTEGRATION)
  ═══════════════════════════ */
 function sendFB(e) {
  if (e) e.preventDefault(); // Stop page reload on form submit
  
  const inp = $('fb-inp');
  if (!inp) return;
  const text = inp.value.trim();
  if (!text) return;
  
  const ratingEl = $('fb-rating-val');
  const rating = ratingEl ? ratingEl.value : 5;
  const btn = document.querySelector('.fb-send');
  
  // Disable button to prevent double-clicks
  if (btn) btn.disabled = true;
  
  // 1. Show user message in chat UI immediately
  addMsg(`[${rating}★] ${text}`, 'user');
  inp.value = '';
  inp.style.height = 'auto';
  
  // Create clean timestamp (YYYY-MM-DD HH:MM:SS)
  const now = new Date();
  const cleanTimestamp =
    now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0') + ' ' +
    String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0') + ':' + 
    String(now.getSeconds()).padStart(2, '0');
  
  // 2. Prepare payload matching your SheetBest/Google Sheet EXACT headers
  // SheetBest takes the row object directly
  const sheetBestPayload = {
    ID: "ut_" + Date.now(),
    SiteName: "Ultra Tools",
    Type: "Feedback",
    Name: "Anonymous",
    Email: "N/A",
    Rating: rating,
    Message: text,
    Timestamp: cleanTimestamp, 
    Status: "Pending"
  };
  
  // ⚠️ YOUR SHEETBEST API URL
  const API_URL = "https://api.sheetbest.com/sheets/7545ab4f-83a2-4105-9cdf-6d94ffe4ef27";

  // 3. Send via SheetBest
  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sheetBestPayload)
  })
  .then((response) => {
    if (!response.ok) throw new Error('SheetBest response not ok');
    return response.json();
  })
  .then((data) => {
    // SheetBest returns the created row data on success
    setTimeout(() => {
      addMsg(`Thanks for the ${rating}★ rating! I'll look into it.`, 'bot');
      if (btn) btn.disabled = false;
      if (typeof successSound === "function") successSound(); 
    }, 600);
  })
  .catch((err) => {
    console.error('SheetBest Error:', err);
    setTimeout(() => {
      addMsg('Oops! Failed to connect to the stealth database. Please try again.', 'bot');
      if (btn) btn.disabled = false;
      if (typeof errSound === "function") errSound(); 
    }, 600);
  });
}
/* ═══════════════════════════════════════════════════════
   POWER TOOL 1 — TEXT → JSON
═══════════════════════════════════════════════════════ */
let _t2jResult = null;

function syntaxHighlightJSON(json){
  return json
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+\.?\d*([eE][+-]?\d+)?)/g,function(m){
      let cls='json-num';
      if(/^"/.test(m)){cls=/:$/.test(m)?'json-key':'json-str'}
      else if(/true|false/.test(m))cls='json-bool';
      else if(/null/.test(m))cls='json-null';
      return`<span class="${cls}">${m}</span>`;
    });
}

function doText2JSON(){
  const raw=val('t2j-in').trim();
  const err=$('t2j-err'),out=$('t2j-out'),stats=$('t2j-stats'),btns=$('t2j-btns');
  err.classList.remove('show');out.innerHTML='';btns.style.display='none';_t2jResult=null;
  if(!raw){err.textContent='Please enter some text first';err.classList.add('show');return}

  const mode=document.querySelector('input[name="t2j-mode"]:checked')?.value||'auto';
  let result={};

  try{
    if(mode==='auto'){
      /* Auto-detect key: value pairs */
      const lines=raw.split('\n').map(l=>l.trim()).filter(l=>l);
      lines.forEach(line=>{
        /* Try key: value, key = value, key - value */
        const m=line.match(/^([^:=\-]+?)[\s]*[:=\-][\s]*(.+)$/);
        if(m){
          const k=m[1].trim().replace(/\s+/g,'_').toLowerCase();
          let v=m[2].trim();
          /* Type coercion */
          if(v==='true'||v==='True')v=true;
          else if(v==='false'||v==='False')v=false;
          else if(v==='null'||v==='NULL'||v==='nil')v=null;
          else if(!isNaN(v)&&v!=='')v=Number(v);
          else if(/^[\[{]/.test(v)){try{v=JSON.parse(v)}catch(_){}}
          /* Handle comma-separated as array */
          else if(v.includes(',')&&!/\s{2,}/.test(v)){
            const parts=v.split(',').map(s=>s.trim()).filter(s=>s);
            if(parts.length>1)v=parts;
          }
          result[k]=v;
        }
      });
      if(!Object.keys(result).length){
        /* Fallback: each line becomes an item */
        result={lines:lines};
      }
    } else if(mode==='lines'){
      const lines=raw.split('\n').map(l=>l.trim()).filter(l=>l);
      result={items:lines,count:lines.length};
    } else if(mode==='words'){
      const words=raw.toLowerCase().match(/\b[a-z]+\b/g)||[];
      words.forEach(w=>{result[w]=(result[w]||0)+1});
    }

    /* Validate by round-tripping */
    const json=JSON.stringify(result,null,2);
    JSON.parse(json); /* throws if invalid */
    _t2jResult=json;

    const keys=Object.keys(result).length;
    out.innerHTML=syntaxHighlightJSON(json);
    stats.innerHTML=`<span style="color:var(--green)">✓ Valid JSON</span> · ${keys} key${keys!==1?'s':''} · ${json.length} chars`;
    btns.style.display='flex';
    notify('Converted to JSON!','success');
  }catch(e){
    err.textContent='Conversion error: '+e.message;err.classList.add('show');
    notify('Conversion failed','error');
  }
}

function validateT2J(){
  if(!_t2jResult){notify('Generate JSON first','warn');return}
  try{JSON.parse(_t2jResult);notify('✓ Valid JSON!','success')}
  catch(e){notify('Invalid JSON: '+e.message,'error')}
}
function copyT2J(){
  if(!_t2jResult){notify('Nothing to copy','warn');return}
  navigator.clipboard.writeText(_t2jResult).then(()=>notify('JSON copied!','success')).catch(()=>notify('Copy failed','error'));
  click();
}
function dlT2J(){
  if(!_t2jResult){notify('Generate JSON first','warn');return}
  dl(new TextEncoder().encode(_t2jResult),'output.json','application/json');
  notify('Downloaded output.json!','success');
}


/* ═══════════════════════════════════════════════════════
   POWER TOOL 2 — HTML → PDF ULTRA
═══════════════════════════════════════════════════════ */
let _h2pSrc=''; /* current HTML source string */

function switchH2PTab(tab){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
  $('h2p-tab-'+tab).classList.add('active');
  $('h2p-pane-'+tab).classList.add('active');
}

function loadH2PFile(){
  const inp=$('h2p-file');if(!inp?.files[0])return;
  const fr=new FileReader();
  fr.onload=e=>{_h2pSrc=e.target.result;notify('File loaded! Click Preview or Export.','info')};
  fr.readAsText(inp.files[0]);
  uploadSound();
}

function getH2PHTML(){
  const activeTab=$('.tab-btn.active')?.id?.replace('h2p-tab-','');
  if(activeTab==='file')return _h2pSrc;
  return val('h2p-code');
}

function previewH2P(){
  const html=getH2PHTML();
  if(!html.trim()){notify('Paste HTML code first','error');return}
  const frame=$('h2p-frame'), wrap=$('h2p-preview-wrap');
  wrap.style.display='block';
  /* Dark mode injection */
  let src=html;
  if($('h2p-dark')?.checked){
    const darkCSS=`<style>html,body{background:#111!important;color:#eee!important}a{color:#7df!important}</style>`;
    src=src.includes('</head>')?src.replace('</head>',darkCSS+'</head>'):darkCSS+src;
  }
  frame.srcdoc=src;
  notify('Preview rendered!','info');
  click();
}

function resetH2P(){
  _h2pSrc='';
  const c=$('h2p-code');if(c)c.value='';
  const fi=$('h2p-file');if(fi)fi.value='';
  const wrap=$('h2p-preview-wrap');if(wrap)wrap.style.display='none';
  const steps=$('h2p-steps');if(steps)steps.style.display='none';
  hideProc('pc-h2p');hideProg('h2p-prog-w');
  notify('Reset','info');click();
}

function h2pStep(n,state){
  for(let i=1;i<=5;i++){
    const row=$('h2p-s'+i);if(!row)continue;
    row.className='step-row'+(i<n?' done':i===n?' '+state:'');
  }
}

/* ═══════════════════════════════════════════════════════
   POWER TOOL 3 — URL → PDF
═══════════════════════════════════════════════════════ */
function u2pStep(n,state){
  for(let i=1;i<=5;i++){
    const row=$('u2p-s'+i);if(!row)continue;
    row.className='step-row'+(i<n?' done':i===n?' '+state:'');
  }
}

async function doURL2PDF(){
  const urlRaw=val('u2p-url').trim();
  const err=$('u2p-err');
  err.classList.remove('show');

  if(!urlRaw){err.textContent='Please enter a URL';err.classList.add('show');return}
  let url=urlRaw;
  if(!/^https?:\/\//i.test(url))url='https://'+url;

  try{new URL(url)}catch(_){err.textContent='Invalid URL format';err.classList.add('show');return}

  $('u2p-steps').style.display='block';
  showProg('u2p-prog-w','u2p-prog');
  showProc('pc-u2p','Fetching page…');
  u2pStep(1,'active');setProg('u2p-prog',10);

  try{
    /* Use allorigins CORS proxy */
    const proxyURL=`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const resp=await fetch(proxyURL,{signal:AbortSignal.timeout(20000)});
    if(!resp.ok)throw new Error(`HTTP ${resp.status} from proxy`);
    const data=await resp.json();
    let html=data.contents||'';
    if(!html)throw new Error('Empty response from proxy — site may block scraping');

    u2pStep(1,'done');u2pStep(2,'active');setProg('u2p-prog',30);
    showProc('pc-u2p','Injecting into renderer…');

    /* Strip scripts and ads if requested */
    if($('u2p-strip')?.checked){
      html=html
        .replace(/<script[\s\S]*?<\/script>/gi,'')
        .replace(/<iframe[\s\S]*?<\/iframe>/gi,'')
        .replace(/<ins[\s\S]*?<\/ins>/gi,'')
        .replace(/display\s*:\s*none/gi,'display:block')
        .replace(/<noscript[\s\S]*?<\/noscript>/gi,'');
    }

    /* Fix relative URLs */
    const base=new URL(url);
    html=html.replace(/(href|src|action)=["'](?!https?:|\/\/|data:|#|mailto:)([^"']+)/gi,(m,attr,path)=>{
      try{return`${attr}="${new URL(path,base).href}"`}catch(_){return m}
    });

    /* Add base tag */
    const baseTag=`<base href="${base.origin}${base.pathname}">`;
    html=html.includes('<head>')?html.replace('<head>','<head>'+baseTag):baseTag+html;
    /* Responsive reset */
    const resetCSS=`<style>*{box-sizing:border-box}body{margin:0;padding:16px}img{max-width:100%}</style>`;
    html=html.includes('</head>')?html.replace('</head>',resetCSS+'</head>'):resetCSS+html;

    u2pStep(2,'done');u2pStep(3,'active');setProg('u2p-prog',50);
    showProc('pc-u2p','Rendering full page…');

    /* Page dimensions */
    const sizes={a4:{w:794,h:1123,pw:210,ph:297},letter:{w:816,h:1056,pw:216,ph:279},legal:{w:816,h:1344,pw:216,ph:356}};
    const sizeKey=val('u2p-size')||'a4';
    const orient=val('u2p-orient')||'portrait';
    let{w,h,pw,ph}=sizes[sizeKey];
    if(orient==='landscape'){[w,h]=[h,w];[pw,ph]=[ph,pw]}

    /* Create hidden iframe */
    const iframe=document.createElement('iframe');
    iframe.style.cssText=`position:fixed;left:-9999px;top:-9999px;width:${w}px;border:none;`;
    iframe.setAttribute('sandbox','allow-same-origin');
    document.body.appendChild(iframe);

    await new Promise(resolve=>{
      iframe.onload=resolve;
      iframe.srcdoc=html;
      setTimeout(resolve,5000);
    });
    await new Promise(r=>setTimeout(r,600));

    const doc=iframe.contentDocument||iframe.contentWindow?.document;
    const body=doc?.body||doc?.documentElement;
    if(!body)throw new Error('Could not access rendered page');

    const fullH=Math.max(body.scrollHeight||0,body.offsetHeight||0,1000);
    iframe.style.height=fullH+'px';
    await new Promise(r=>setTimeout(r,400));

    const canvas=await html2canvas(body,{
      useCORS:true,allowTaint:true,scale:1,
      width:w,height:fullH,scrollX:0,scrollY:0,
      windowWidth:w,windowHeight:fullH,
      backgroundColor:'#fff',logging:false,
    });

    document.body.removeChild(iframe);

    u2pStep(3,'done');u2pStep(4,'active');setProg('u2p-prog',80);
    showProc('pc-u2p','Building PDF…');

    const{jsPDF}=window.jspdf;
    const pdf=new jsPDF({orientation:orient,unit:'mm',format:[pw,ph]});
    const pageHeightPx=h;
    const totalPages=Math.ceil(canvas.height/pageHeightPx);

    for(let pg=0;pg<totalPages;pg++){
      if(pg>0)pdf.addPage();
      const srcY=pg*pageHeightPx;
      const srcH=Math.min(pageHeightPx,canvas.height-srcY);
      const pgCanvas=document.createElement('canvas');
      pgCanvas.width=canvas.width;pgCanvas.height=srcH;
      pgCanvas.getContext('2d').drawImage(canvas,0,srcY,canvas.width,srcH,0,0,canvas.width,srcH);
      const imgData=pgCanvas.toDataURL('image/jpeg',0.88);
      pdf.addImage(imgData,'JPEG',0,0,pw,ph*(srcH/pageHeightPx));
      setProg('u2p-prog',80+Math.round((pg+1)/totalPages*15));
    }

    u2pStep(4,'done');u2pStep(5,'active');setProg('u2p-prog',98);

    const hostname=base.hostname.replace(/\./g,'_');
    pdf.save(`${hostname}_export.pdf`);
    setProg('u2p-prog',100);
    u2pStep(5,'done');

    /* Thumbnail */
    const prev=$('u2p-preview');
    if(prev){
      const thumbUrl=canvas.toDataURL('image/jpeg',0.4);
      const img=document.createElement('img');img.src=thumbUrl;img.alt='Page preview';
      img.style.cssText='max-width:100%;border-radius:8px;border:1px solid var(--border);display:block;margin-top:8px';
      prev.innerHTML=`<div style="font-family:var(--fM);font-size:11px;color:var(--cyan);margin-bottom:6px">✓ ${totalPages} page(s) captured from ${base.hostname}</div>`;
      prev.appendChild(img);
    }
    notify(`PDF exported! ${totalPages} page(s) from ${base.hostname}`,'success');
  }catch(e){
    u2pStep(1,'');
    err.textContent=e.message.includes('fetch')||e.message.includes('NetworkError')
      ?'Network error — CORS block or site unreachable. Try a different URL or use HTML→PDF tool.'
      :'Error: '+e.message;
    err.classList.add('show');
    notify('Export failed: '+e.message,'error');
  }
  hideProc('pc-u2p');
  setTimeout(()=>{hideProg('u2p-prog-w');$('u2p-steps').style.display='none'},2500);
}

/* ═══════════════════════════════════════════════════════════════
   POWER TOOLS — TEXT → JSON
═══════════════════════════════════════════════════════════════ */

/* Syntax-highlight a JSON string into coloured HTML spans */
function syntaxJSON(json){
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,m=>{
    let cls='json-num';
    if(/^"/.test(m)){cls=/:$/.test(m)?'json-key':'json-str'}
    else if(/true|false/.test(m)){cls='json-bool'}
    else if(/null/.test(m)){cls='json-null'}
    return`<span class="${cls}">${m}</span>`;
  });
}

/* Core conversion engine */
function parseTextToJSON(text, mode){
  if(mode==='auto'){
    // Try to detect key:value (colon-separated), key=value, key\tvalue
    const lines=text.split('\n').map(l=>l.trim()).filter(Boolean);
    const obj={};let isKV=true;
    for(const line of lines){
      const colonIdx=line.indexOf(':');
      const eqIdx=line.indexOf('=');
      const tabIdx=line.indexOf('\t');
      const sep=colonIdx>0?colonIdx:eqIdx>0?eqIdx:tabIdx>0?tabIdx:-1;
      if(sep<1){isKV=false;break}
      const key=line.slice(0,sep).trim().replace(/^["']|["']$/g,'');
      let rawVal=line.slice(sep+1).trim().replace(/^["']|["']$/g,'');
      // cast types
      let val;
      if(rawVal==='true')val=true;
      else if(rawVal==='false')val=false;
      else if(rawVal==='null'||rawVal==='')val=null;
      else if(!isNaN(rawVal)&&rawVal!=='')val=Number(rawVal);
      else if(rawVal.includes(',')){val=rawVal.split(',').map(s=>s.trim())}
      else val=rawVal;
      obj[key]=val;
    }
    if(!isKV){
      // fallback: array of lines
      return JSON.stringify(lines,null,2);
    }
    return JSON.stringify(obj,null,2);
  }
  if(mode==='lines'){
    const lines=text.split('\n').map(l=>l.trim()).filter(Boolean);
    return JSON.stringify(lines,null,2);
  }
  if(mode==='words'){
    const words=text.toLowerCase().match(/\b\w+\b/g)||[];
    const map={};
    words.forEach(w=>{map[w]=(map[w]||0)+1});
    const sorted=Object.fromEntries(Object.entries(map).sort((a,b)=>b[1]-a[1]));
    return JSON.stringify(sorted,null,2);
  }
}

let _t2jLast='';
function doText2JSON(){
  const input=val('t2j-in').trim();
  const err=$('t2j-err');const out=$('t2j-out');const stats=$('t2j-stats');
  err.classList.remove('show');out.innerHTML='';stats.textContent='';
  if(!input){err.textContent='Please paste some text first.';err.classList.add('show');return}
  const mode=document.querySelector('input[name="t2j-mode"]:checked')?.value||'auto';
  try{
    const jsonStr=parseTextToJSON(input,mode);
    // Validate round-trip
    JSON.parse(jsonStr);
    _t2jLast=jsonStr;
    out.innerHTML=syntaxJSON(jsonStr);
    const keys=jsonStr.match(/"[^"]+"\s*:/g)||[];
    stats.innerHTML=`<span style="color:var(--green)">✓ Valid JSON</span> · ${keys.length} key(s) · ${jsonStr.length} chars`;
    $('t2j-btns').style.display='flex';
    successSound();notify('Converted to JSON!','success');
  }catch(e){
    err.textContent='Conversion error: '+e.message;err.classList.add('show');
    errSound();notify('Conversion failed','error');
    $('t2j-btns').style.display='none';
  }
}
function validateT2J(){
  if(!_t2jLast){notify('No JSON to validate','warn');return}
  try{JSON.parse(_t2jLast);notify('✓ Valid JSON!','success')}
  catch(e){notify('Invalid: '+e.message,'error')}
}
function copyT2J(){
  if(!_t2jLast){notify('Nothing to copy','warn');return}
  navigator.clipboard.writeText(_t2jLast).then(()=>notify('JSON copied!','success')).catch(()=>notify('Copy failed','error'));
  click();
}
function dlT2J(){
  if(!_t2jLast){notify('Nothing to download','warn');return}
  dl(new TextEncoder().encode(_t2jLast),'output.json','application/json');
  notify('Downloaded output.json!','success');
}

/* ═══════════════════════════════════════════════════════════════
   POWER TOOLS — HTML → PDF ULTRA
   Strategy: inject HTML into a hidden iframe → wait for load →
   use html2canvas on iframe's document body → split canvas rows
   into A4/Letter pages → jsPDF multi-page export
═══════════════════════════════════════════════════════════════ */

function switchH2PTab(tab){
  ['code','file'].forEach(t=>{
    $('h2p-tab-'+t).classList.toggle('active',t===tab);
    $('h2p-pane-'+t).classList.toggle('active',t===tab);
  });
  click();
}
function loadH2PFile(){
  const inp=$('h2p-file');if(!inp?.files[0])return;
  const reader=new FileReader();
  reader.onload=e=>{
    // Switch to code tab and paste
    switchH2PTab('code');
    $('h2p-code').value=e.target.result;
    notify('HTML file loaded!','success');
    uploadSound();
  };
  reader.readAsText(inp.files[0]);
}

function getH2PCode(){
  // Active tab determines source
  const isCode=$('h2p-pane-code')?.classList.contains('active');
  return isCode ? val('h2p-code') : val('h2p-code'); // file always copies to code tab
}

/* Page dimensions in px at 96dpi */
const PAGE_DIMS={
  a4:{w:794,h:1123},
  letter:{w:816,h:1056},
  legal:{w:816,h:1344},
};
const PAGE_DIMS_LAND={
  a4:{w:1123,h:794},
  letter:{w:1056,h:816},
  legal:{w:1344,h:816},
};
/* jsPDF mm dimensions */
const PDF_MM={
  a4:[210,297],letter:[216,279],legal:[216,356]
};

function setH2PStep(n,state){
  // state: 'active' | 'done' | ''
  for(let i=1;i<=5;i++){
    const el=$('h2p-s'+i);if(!el)return;
    el.className='step-row'+(i<n?' done':i===n?' '+state:'');
  }
}

function previewH2P(){
  const code=getH2PCode().trim();
  if(!code){notify('Paste HTML code first','error');return}
  const wrap=$('h2p-preview-wrap');const frame=$('h2p-frame');
  if(!wrap||!frame)return;
  const blob=new Blob([applyDarkMode(code,false)],{type:'text/html'});
  frame.src=URL.createObjectURL(blob);
  wrap.style.display='block';
  frame.onload=()=>{
    // auto-height based on content
    try{const h=frame.contentDocument?.documentElement?.scrollHeight;if(h)frame.style.height=h+'px'}catch(e){}
    notify('Preview ready!','info');
  };
  click();
}
function resetH2P(){
  $('h2p-code').value='';
  $('h2p-preview-wrap').style.display='none';
  $('h2p-steps').style.display='none';
  $('h2p-prog-w').style.display='none';
  hideProc('pc-h2p');
  click();
}

function applyDarkMode(html, dark){
  if(!dark)return html;
  const darkCSS=`<style>
    html,body{background:#111!important;color:#e8e8e8!important}
    *{background-color:transparent!important;color:inherit!important;border-color:#333!important}
    a{color:#00c8ff!important}img{filter:brightness(.85)}
  </style>`;
  return html.replace('</head>',darkCSS+'</head>').replace('<html>','<html data-akdev-dark="1">');
}

async function doHTML2PDF(){
  const code = getH2PCode().trim();
  if(!code){notify('Paste HTML or upload a file first','error');return}
  if(!window.html2canvas){notify('html2canvas not loaded yet — wait a moment','error');return}

  const renderW  = Math.max(400, parseInt(val('h2p-width'))||1080);
  const dpr      = parseFloat(val('h2p-dpr'))||2;
  const darkMode = $('h2p-dark')?.checked;
  const doPreview= $('h2p-preview')?.checked!==false;

  /* Dark mode injection */
  function applyDark(html){
    if(!darkMode)return html;
    const css=`<style>html,body{background:#111!important;color:#e8e8e8!important}*{border-color:#333!important}a{color:#00c8ff!important}</style>`;
    return html.includes('</head>')?html.replace('</head>',css+'</head>'):css+html;
  }

  /* Base reset: keep layout but allow full height */
  const RESET=`<style>
    *{box-sizing:border-box!important}
    html{overflow:visible!important;height:auto!important}
    body{margin:0!important;overflow:visible!important;height:auto!important}
    img{max-width:100%}
  </style>`;

  function inject(html){
    let s=applyDark(html);
    return s.includes('</head>')?s.replace('</head>',RESET+'</head>'):RESET+s;
  }

  /* Show UI */
  const stepsEl=$('h2p-steps');if(stepsEl)stepsEl.style.display='block';
  showProg('h2p-prog-w','h2p-prog');setProg('h2p-prog',5);
  showProc('pc-h2p','Preparing…');

  const {jsPDF}=window.jspdf;
  /* 'pt' unit — we'll set each page size exactly in points to match canvas pixels */
  const pdf=new jsPDF({unit:'pt',format:[595,842]}); /* A4 placeholder, overridden per page */
  let firstPage=true;

  /* ── Core: render one HTML string → canvas(es) → pdf page(s) ── */
  async function renderSectionToPDF(html, label){
    const src=inject(html);

    /* Hidden iframe via blob URL */
    const iframe=document.createElement('iframe');
    iframe.style.cssText=`position:fixed;left:-9999px;top:-9999px;
      width:${renderW}px;border:none;visibility:hidden;z-index:-9;`;
    document.body.appendChild(iframe);

    const blobURL=URL.createObjectURL(new Blob([src],{type:'text/html'}));
    await new Promise((res,rej)=>{
      iframe.onload=res;iframe.onerror=()=>res();
      iframe.src=blobURL;
      setTimeout(res,6000);
    });
    URL.revokeObjectURL(blobURL);
    /* Settle fonts, images, CSS */
    await new Promise(r=>setTimeout(r,900));

    const iDoc=iframe.contentDocument||iframe.contentWindow?.document;
    if(!iDoc){document.body.removeChild(iframe);return;}

    /* ── Detect tab groups ── */
    /* Look for the most common repeating class that hides siblings */
    const candidateClasses=['set','tab-pane','tab-content','panel','slide','section','page'];
    let tabEls=[];
    for(const cls of candidateClasses){
      const found=Array.from(iDoc.querySelectorAll('.'+cls))
        .filter(el=>el.children.length>0);
      if(found.length>tabEls.length)tabEls=found;
    }
    /* Also try id-prefixed groups: set1,set2... tab1,tab2... */
    if(tabEls.length<=1){
      const byId=Array.from(iDoc.querySelectorAll('[id]'))
        .filter(el=>/^(set|tab|panel|page|slide|section)\d+$/i.test(el.id)&&el.children.length>0);
      if(byId.length>tabEls.length)tabEls=byId;
    }

    if(tabEls.length>1){
      console.log(`[HTML→PDF] ${label}: ${tabEls.length} tab sections found`);

      for(let ti=0;ti<tabEls.length;ti++){
        showProc('pc-h2p',`${label}: capturing section ${ti+1}/${tabEls.length}…`);
        setProg('h2p-prog',10+Math.round((ti/tabEls.length)*70));

        /* Show only this tab */
        tabEls.forEach((el,i)=>{
          el.style.cssText += i===ti
            ?';display:block!important;visibility:visible!important;position:relative!important;opacity:1!important;'
            :';display:none!important;';
        });
        /* Fire click on tab button if present */
        const btns=iDoc.querySelectorAll('.tab-btn,[role=tab],[data-tab],.tab-button');
        if(btns[ti])try{btns[ti].click();}catch(_){}

        await new Promise(r=>setTimeout(r,200));

        const el=tabEls[ti];
        /* Measure real content size */
        const elH=Math.max(el.scrollHeight,el.offsetHeight,200);
        iframe.style.height=elH+'px';
        await new Promise(r=>setTimeout(r,150));

        const canvas=await html2canvas(el,{
          scale:dpr,
          useCORS:true,
          allowTaint:true,
          backgroundColor:darkMode?'#111':'#ffffff',
          width:renderW,
          height:elH,
          windowWidth:renderW,
          windowHeight:elH,
          scrollX:0,scrollY:0,
          logging:false,
          onclone:(doc)=>{
            /* Make only this section visible in clone */
            doc.querySelectorAll('.'+([...tabEls[ti].classList][0]||'set')).forEach((e,i)=>{
              e.style.display=i===ti?'block':'none';
            });
          }
        });

        addCanvasToPDF(canvas,pdf,firstPage);
        firstPage=false;
      }
    } else {
      /* No tabs — capture full page height */
      const body=iDoc.body||iDoc.documentElement;
      const fullH=Math.max(body.scrollHeight,body.offsetHeight,500);
      iframe.style.height=fullH+'px';
      await new Promise(r=>setTimeout(r,200));

      showProc('pc-h2p',`${label}: capturing full page (${fullH}px)…`);

      const canvas=await html2canvas(iDoc.documentElement,{
        scale:dpr,
        useCORS:true,
        allowTaint:true,
        backgroundColor:darkMode?'#111':'#ffffff',
        width:renderW,
        height:fullH,
        windowWidth:renderW,
        windowHeight:fullH,
        scrollX:0,scrollY:0,
        logging:false,
        onclone:(doc)=>{
          doc.documentElement.style.overflow='visible';
          doc.body.style.overflow='visible';
          doc.body.style.height='auto';
        }
      });

      addCanvasToPDF(canvas,pdf,firstPage);
      firstPage=false;
    }

    document.body.removeChild(iframe);
  }

  /* ── Add canvas to PDF as exact-size page (no scaling/squeezing) ── */
  function addCanvasToPDF(canvas,pdf,isFirst){
    /* Canvas pixel size → PDF points (72dpi base, then we'll set size to match exactly) */
    const W=canvas.width;   /* pixels at dpr scale */
    const H=canvas.height;

    /* Convert to mm at 96dpi equivalent so PDF renders at actual pixel size */
    /* We set PDF page to exact canvas pixel dimensions in pt (1pt = 1px at 72dpi)
       jsPDF 'pt' unit: addPage([width_pt, height_pt]) */
    const W_pt = W * (72/96);  /* canvas px → pt */
    const H_pt = H * (72/96);

    if(!isFirst){
      pdf.addPage([W_pt, H_pt]);
    } else {
      /* Resize first page to match */
      pdf.internal.pageSize.width  = W_pt;
      pdf.internal.pageSize.height = H_pt;
    }

    /* Draw image filling the entire page — exact pixel match */
    const imgData=canvas.toDataURL('image/jpeg',0.97);
    pdf.addImage(imgData,'JPEG',0,0,W_pt,H_pt,undefined,'FAST');
  }

  try{
    h2pStep(1,'active');setProg('h2p-prog',8);
    await renderSectionToPDF(code,'page');
    h2pStep(1,'done');h2pStep(2,'done');h2pStep(3,'active');
    setProg('h2p-prog',90);
    showProc('pc-h2p','Saving PDF…');
    await new Promise(r=>setTimeout(r,100));

    /* Use correct page sizes in output */
    pdf.save('akdev-pixel-perfect.pdf');
    h2pStep(3,'done');h2pStep(4,'done');h2pStep(5,'done');
    setProg('h2p-prog',100);
    notify('Pixel-perfect PDF exported! ✓','success');

    /* Preview */
    if(doPreview){
      const frame=$('h2p-frame'),wrap=$('h2p-preview-wrap');
      if(frame&&wrap){
        const previewHTML=applyDark(code);
        frame.srcdoc=previewHTML;
        frame.style.height='360px';
        wrap.style.display='block';
      }
    }
  }catch(e){
    notify('Export failed: '+e.message,'error');
    console.error('[HTML→PDF]',e);
    h2pStep(1,'');
  }
  hideProc('pc-h2p');
  setTimeout(()=>{
    if($('h2p-prog-w'))$('h2p-prog-w').style.display='none';
    if($('h2p-steps'))$('h2p-steps').style.display='none';
  },2500);
}

/* ═══════════════════════════════════════════════════════════════
   POWER TOOLS — URL → PDF
   Uses allorigins.win CORS proxy to fetch page HTML,
   then reuses the same HTML→PDF pipeline
═══════════════════════════════════════════════════════════════ */

function setU2PStep(n,state){
  for(let i=1;i<=5;i++){
    const el=$('u2p-s'+i);if(!el)return;
    el.className='step-row'+(i<n?' done':i===n?' '+state:'');
  }
}

async function doURL2PDF(){
  const rawURL=val('u2p-url').trim();
  const errEl=$('u2p-err');
  errEl.classList.remove('show');

  if(!rawURL){errEl.textContent='Please enter a URL';errEl.classList.add('show');notify('Enter a URL first','error');return}
  // Validate URL format
  let parsedURL;
  try{parsedURL=new URL(rawURL)}
  catch(e){errEl.textContent='Invalid URL — include https://';errEl.classList.add('show');notify('Invalid URL','error');return}

  if(!window.html2canvas){notify('html2canvas not loaded — wait a moment and retry','error');return}

  const sizeKey=val('u2p-size')||'a4';
  const orient=val('u2p-orient')||'portrait';
  const stripScripts=$('u2p-strip')?.checked;
  const dims=orient==='landscape'?PAGE_DIMS_LAND[sizeKey]:PAGE_DIMS[sizeKey];
  const pdfMM=PDF_MM[sizeKey];
  const pw=orient==='landscape'?pdfMM[1]:pdfMM[0];
  const ph=orient==='landscape'?pdfMM[0]:pdfMM[1];

  const stepsEl=$('u2p-steps');if(stepsEl)stepsEl.style.display='block';
  showProc('pc-u2p','Fetching page…');
  showProg('u2p-prog-w','u2p-prog');
  setProg('u2p-prog',5);

  try{
    // STEP 1 — Fetch via CORS proxy
    setU2PStep(1,'active');
    const proxyURL=`https://api.allorigins.win/get?url=${encodeURIComponent(rawURL)}`;
    const resp=await fetch(proxyURL);
    if(!resp.ok)throw new Error(`Proxy returned ${resp.status}`);
    const data=await resp.json();
    let html=data.contents||'';
    if(!html)throw new Error('Empty response — site may block scrapers');
    setU2PStep(1,'done');setProg('u2p-prog',22);

    // STEP 2 — Process fetched HTML
    setU2PStep(2,'active');
    showProc('pc-u2p','Processing fetched HTML…');

    // Fix relative URLs to absolute so assets load
    html=html.replace(/(src|href)=(["'])(?!http|data|#|\/\/|mailto)([^"']+)\2/g,(m,attr,q,path)=>{
      try{return`${attr}=${q}${new URL(path,rawURL).href}${q}`}catch(e){return m}
    });
    // Also handle protocol-relative URLs
    html=html.replace(/(src|href)=(["'])(\/\/[^"']+)\2/g,(m,attr,q,path)=>`${attr}=${q}https:${path}${q}`);

    if(stripScripts){
      html=html.replace(/<script[\s\S]*?<\/script>/gi,'');
      html=html.replace(/on\w+="[^"]*"/g,'');
      html=html.replace(/<ins\b[^>]*>[\s\S]*?<\/ins>/gi,''); // remove ads
    }

    // Inject base tag so relative resources resolve correctly
    const baseTag=`<base href="${parsedURL.origin}${parsedURL.pathname}">`;
    html=html.includes('<head>')?html.replace('<head>','<head>'+baseTag):baseTag+html;

    setU2PStep(2,'done');setProg('u2p-prog',38);

    // STEP 3 — Render in hidden iframe + capture
    setU2PStep(3,'active');
    showProc('pc-u2p','Rendering full page…');

    const iframe=document.createElement('iframe');
    iframe.style.cssText=`position:fixed;left:-9999px;top:-9999px;width:${dims.w}px;height:${dims.h}px;border:none;visibility:hidden;z-index:-1;`;
    document.body.appendChild(iframe);

    await new Promise((res,rej)=>{
      const blob=new Blob([html],{type:'text/html'});
      iframe.src=URL.createObjectURL(blob);
      iframe.onload=res;iframe.onerror=rej;
      setTimeout(res,6000);
    });
    await new Promise(r=>setTimeout(r,1200)); // wait for async assets

    const body=iframe.contentDocument?.body||iframe.contentDocument?.documentElement;
    const totalH=Math.max(body?.scrollHeight||0,dims.h);

    const canvas=await html2canvas(iframe.contentDocument.documentElement,{
      scale:1,
      useCORS:true,
      allowTaint:true,
      backgroundColor:'#fff',
      width:dims.w,
      height:totalH,
      windowWidth:dims.w,
      windowHeight:totalH,
      scrollX:0,scrollY:0,
      logging:false,
    });
    document.body.removeChild(iframe);
    setU2PStep(3,'done');setProg('u2p-prog',68);

    // STEP 4 — Build multi-page PDF
    setU2PStep(4,'active');
    showProc('pc-u2p','Building PDF…');

    const {jsPDF}=window.jspdf;
    const pdf=new jsPDF({orientation:orient,unit:'mm',format:[pw,ph]});
    const canvasW=canvas.width,canvasH=canvas.height;
    const pageH=Math.floor(dims.h);
    const totalPages=Math.ceil(canvasH/pageH);

    for(let pg=0;pg<totalPages;pg++){
      if(pg>0)pdf.addPage([pw,ph],orient);
      const srcY=pg*pageH;
      const srcH=Math.min(pageH,canvasH-srcY);
      if(srcH<=0)break;
      const sliceCanvas=document.createElement('canvas');
      sliceCanvas.width=canvasW;sliceCanvas.height=srcH;
      sliceCanvas.getContext('2d').drawImage(canvas,0,srcY,canvasW,srcH,0,0,canvasW,srcH);
      const img=sliceCanvas.toDataURL('image/jpeg',0.88);
      const iH=(srcH/canvasW)*pw;
      pdf.addImage(img,'JPEG',0,0,pw,Math.min(iH,ph));
      setProg('u2p-prog',68+Math.round((pg+1)/totalPages*24));
    }
    setU2PStep(4,'done');setProg('u2p-prog',94);

    // STEP 5 — Save
    setU2PStep(5,'active');
    const filename='akdev-'+parsedURL.hostname.replace(/\./g,'-')+'.pdf';
    pdf.save(filename);
    setU2PStep(5,'done');setProg('u2p-prog',100);

    // Show preview card
    $('u2p-preview').innerHTML=`
      <div style="background:rgba(0,255,136,.06);border:1px solid rgba(0,255,136,.2);border-radius:8px;padding:12px;font-family:var(--fM);font-size:12px;color:var(--green)">
        ✓ PDF saved as <strong>${filename}</strong> · ${totalPages} page${totalPages>1?'s':''} · Source: ${parsedURL.hostname}
      </div>`;
    notify(`URL→PDF done — ${totalPages} page${totalPages>1?'s':''}!`,'success');

  } catch(e){
    notify('Failed: '+e.message,'error');
    errSound();
    $('u2p-preview').innerHTML=`<div style="background:rgba(255,51,102,.08);border:1px solid rgba(255,51,102,.2);border-radius:8px;padding:12px;font-family:var(--fM);font-size:12px;color:var(--red)">✕ Error: ${e.message}<br><br>Try pasting the page HTML into the <strong>HTML→PDF Ultra</strong> tool instead.</div>`;
  }
  hideProc('pc-u2p');
  setTimeout(()=>{
    if($('u2p-prog-w'))$('u2p-prog-w').style.display='none';
  },2500);
}

/* ══════════════════════════════════════════════════════
   11 NEW UTILITY TOOLS — JS
══════════════════════════════════════════════════════ */

/* ── QR CODE GENERATOR (uses Google Charts API — free, no key) ── */
/* ═══════════════════════════════════════════════════════
   QR CODE ENGINE v2 — Pure JS, no CDN, 100% offline
   Uses qrcode-generator algorithm (compact port)
   Supports Version 1-40, ECC level M
═══════════════════════════════════════════════════════ */





/* ─── QR Canvas renderer ─── */
let _qrCanvas = null;

function genQR() {
const txt = val('qr-txt').trim();
const out = $('qr-out'), btns = $('qr-btns'), err = $('qr-err');

err.classList.remove('show');
btns.style.display = 'none';
out.innerHTML = '';
_qrCanvas = null;

if (!txt) return;

const outputSize = parseInt(val('qr-size')) || 300;
const fg = $('qr-fg')?.value || '#000000';
const bg = $('qr-bg')?.value || '#ffffff';

try {
// Create a temporary container for the library to draw in
const tempDiv = document.createElement('div');

new QRCode(tempDiv, {
text: txt,
width: outputSize,
height: outputSize,
colorDark: fg,
colorLight: bg,
correctLevel: QRCode.CorrectLevel.H
});

// Extract the canvas generated by qrcode.js so your download/copy buttons still work
setTimeout(() => {
const cv = tempDiv.querySelector('canvas');
if (cv) {
cv.style.cssText = 'border-radius:8px;border:1px solid var(--border);max-width:100%;image-rendering:pixelated';
_qrCanvas = cv;
out.appendChild(cv);
btns.style.display = 'flex';
notify('QR Code generated! ✓', 'success');
}
}, 50);

} catch (e) {
err.textContent = 'QR error: ' + e.message;
err.classList.add('show');
notify('QR failed: ' + e.message, 'error');
console.error('[QR]', e);
}
}

function dlQR(){
  if(!_qrCanvas){notify('Generate QR first','warn');return}
  /* 4× upscale for crisp download */
  const big=document.createElement('canvas');
  big.width=_qrCanvas.width*4; big.height=_qrCanvas.height*4;
  const ctx=big.getContext('2d');
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(_qrCanvas,0,0,big.width,big.height);
  const a=document.createElement('a');
  a.href=big.toDataURL('image/png');
  a.download='qrcode.png';
  a.click();
  notify('Downloaded (4× crisp)!','success');
}

function copyQR(){
  if(!_qrCanvas){notify('Generate QR first','warn');return}
  _qrCanvas.toBlob(blob=>{
    navigator.clipboard.write([new ClipboardItem({'image/png':blob})])
      .then(()=>notify('Copied to clipboard!','success'))
      .catch(()=>notify('Use Download button instead','warn'));
  });
}


/* ── PASSWORD STRENGTH CHECKER ── */
function checkPWS(){
  const pw=document.getElementById('pws-inp')?.value||'';
  const bar=$('pws-bar'),lbl=$('pws-label');
  const lenEl=$('pws-len'),entEl=$('pws-ent'),crackEl=$('pws-crack'),checks=$('pws-checks');
  if(!pw){bar.style.width='0%';lbl.textContent='—';if(lenEl)lenEl.textContent='0';if(entEl)entEl.textContent='0';if(crackEl)crackEl.textContent='—';if(checks)checks.innerHTML='';return}
  /* Pool size */
  let pool=0;
  const hasL=/[a-z]/.test(pw),hasU=/[A-Z]/.test(pw),hasN=/\d/.test(pw),hasS=/[^a-zA-Z0-9]/.test(pw);
  if(hasL)pool+=26;if(hasU)pool+=26;if(hasN)pool+=10;if(hasS)pool+=32;
  const entropy=Math.log2(Math.pow(pool||1,pw.length));
  /* Crack time (10B guesses/sec) */
  const secs=Math.pow(2,entropy)/1e10;
  function humanTime(s){
    if(s<1)return'instant';if(s<60)return Math.round(s)+'s';
    if(s<3600)return Math.round(s/60)+'m';if(s<86400)return Math.round(s/3600)+'h';
    if(s<2592000)return Math.round(s/86400)+' days';if(s<31536000)return Math.round(s/2592000)+' months';
    return s>3.15e13?'centuries+':Math.round(s/31536000)+' years';
  }
  /* Score 0-4 */
  let score=0;
  if(pw.length>=8)score++;if(pw.length>=12)score++;
  if(hasL&&hasU)score++;if(hasN)score++;if(hasS)score++;
  score=Math.min(4,Math.floor(score*4/5));
  const colors=['var(--red)','var(--orange)','#f0c040','#7ae','var(--green)'];
  const labels=['Very Weak','Weak','Fair','Strong','Very Strong'];
  const pcts=[10,28,52,78,100];
  bar.style.width=pcts[score]+'%';bar.style.background=colors[score];
  lbl.textContent=labels[score];lbl.style.color=colors[score];
  if(lenEl)lenEl.textContent=pw.length;
  if(entEl)entEl.textContent=Math.round(entropy);
  if(crackEl)crackEl.textContent=humanTime(secs);
  /* Criteria */
  const crit=[
    ['≥ 8 characters',pw.length>=8],['≥ 12 characters',pw.length>=12],
    ['Lowercase (a-z)',hasL],['Uppercase (A-Z)',hasU],
    ['Numbers (0-9)',hasN],['Symbols (!@#)',hasS],
    ['No common words',!/password|123456|qwerty|admin|letmein/i.test(pw)],
    ['≥ 16 characters',pw.length>=16],
  ];
  if(checks)checks.innerHTML=crit.map(([t,ok])=>`
    <div style="display:flex;align-items:center;gap:6px;color:${ok?'var(--green)':'var(--dim)'}">
      <span style="font-size:13px">${ok?'✓':'○'}</span><span>${t}</span>
    </div>`).join('');
}
function togglePWSVis(){
  const inp=$('pws-inp'),eye=$('pws-eye');
  if(!inp)return;
  inp.type=inp.type==='password'?'text':'password';
  if(eye)eye.textContent=inp.type==='password'?'👁':'🔒';
}


/* ── HASH GENERATOR (Web Crypto API — built into all modern browsers) ── */
async function doHash(){
  const txt=val('hash-in');if(!txt.trim()){notify('Enter text to hash','error');return}
  const alg=document.querySelector('input[name="hash-alg"]:checked')?.value||'SHA-256';
  showProc('pc-hash','Hashing…');
  try{
    const encoded=new TextEncoder().encode(txt);
    const buf=await crypto.subtle.digest(alg,encoded);
    const hex=Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
    $('hash-out').value=hex;
    $('hash-meta').innerHTML=`<span style="color:var(--cyan)">${alg}</span> · ${hex.length} chars · ${hex.length*4} bits`;
    notify('Hash generated!','success');
  }catch(e){notify('Hash error: '+e.message,'error')}
  hideProc('pc-hash');
}


/* ── JWT DECODER ── */
function decodeJWT(){
  const tok=val('jwt-in').trim();const err=$('jwt-err'),res=$('jwt-res');
  err.classList.remove('show');res.innerHTML='';
  if(!tok){err.textContent='Paste a JWT token';err.classList.add('show');return}
  const parts=tok.split('.');
  if(parts.length<2||parts.length>3){err.textContent='Invalid JWT format (expected 3 parts separated by .)';err.classList.add('show');return}
  function b64d(s){
    try{return JSON.parse(atob(s.replace(/-/g,'+').replace(/_/g,'/').padEnd(s.length+((4-s.length%4)%4),'=')))}
    catch(e){return null}
  }
  const header=b64d(parts[0]),payload=b64d(parts[1]);
  if(!header||!payload){err.textContent='Could not decode — not a valid JWT';err.classList.add('show');return}
  /* Expiry check */
  let expiryHTML='';
  if(payload.exp){
    const exp=new Date(payload.exp*1000);const now=new Date();
    const expired=now>exp;
    expiryHTML=`<div style="font-family:var(--fM);font-size:12px;color:${expired?'var(--red)':'var(--green)'};margin-top:8px">
      ${expired?'⚠ TOKEN EXPIRED':'✓ TOKEN VALID'} — Expires: ${exp.toLocaleString()}</div>`;
  }
  const block=(title,data,color)=>`
    <div style="margin-bottom:12px">
      <div style="font-family:var(--fH);font-size:9px;color:${color};letter-spacing:2px;margin-bottom:6px">${title}</div>
      <div class="json-tree">${syntaxHighlightJSON(JSON.stringify(data,null,2))}</div>
    </div>`;
  res.innerHTML=block('HEADER',header,'var(--purple)')+block('PAYLOAD',payload,'var(--cyan)')+expiryHTML+
    (parts[2]?`<div style="font-family:var(--fM);font-size:11px;color:var(--dim);margin-top:8px">🔏 Signature: ${parts[2].substring(0,32)}…</div>`:'');
  notify('JWT decoded!','success');
}


/* ── MARKDOWN → HTML ── */
function renderMD(){
  const md=val('md-in');
  if(!md){$('md-prev').innerHTML='';$('md-out').value='';return}
  /* Minimal Markdown parser */
  let html=md
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/^######\s+(.+)$/gm,'<h6>$1</h6>')
    .replace(/^#####\s+(.+)$/gm,'<h5>$1</h5>')
    .replace(/^####\s+(.+)$/gm,'<h4>$1</h4>')
    .replace(/^###\s+(.+)$/gm,'<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm,'<h2>$1</h2>')
    .replace(/^#\s+(.+)$/gm,'<h1>$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/~~(.+?)~~/g,'<del>$1</del>')
    .replace(/`([^`]+)`/g,'<code style="background:#1a2a3a;padding:1px 5px;border-radius:3px;font-size:.9em">$1</code>')
    .replace(/^\s*[-*+]\s+(.+)$/gm,'<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g,'<ul>$&</ul>')
    .replace(/^\s*\d+\.\s+(.+)$/gm,'<li>$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" style="color:#7df" target="_blank">$1</a>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<img src="$2" alt="$1" style="max-width:100%">')
    .replace(/^---$/gm,'<hr style="border-color:#333">')
    .replace(/^&gt;\s+(.+)$/gm,'<blockquote style="border-left:3px solid #888;margin:0;padding-left:12px;color:#888">$1</blockquote>')
    .replace(/\n\n/g,'</p><p>')
    .replace(/\n/g,'<br>');
  html=`<p>${html}</p>`;
  $('md-prev').innerHTML=html;
  $('md-out').value=html.replace(/<\/p><p>/g,'\n\n').replace(/<[^>]+>/g,'').length>0?html:'';
  $('md-out').value=html;
}
function dlMD(){
  const html=val('md-out');if(!html){notify('Generate HTML first','warn');return}
  const full=`<!DOCTYPE html>\n<html>\n<head><meta charset="UTF-8"><title>Markdown Export</title><style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:0 20px;line-height:1.7}</style></head>\n<body>\n${html}\n</body>\n</html>`;
  dl(new TextEncoder().encode(full),'export.html','text/html');
  notify('Downloaded export.html!','success');
}


/* ── CSS BOX SHADOW GENERATOR ── */
function updBS(){
  const x=$('bs-x')?.value||0,y=$('bs-y')?.value||0;
  const blur=$('bs-blur')?.value||10,spread=$('bs-spread')?.value||0;
  const color=$('bs-color')?.value||'#00c8ff';
  const inset=$('bs-inset')?.checked?'inset ':'';
  const multi=$('bs-multi')?.checked;
  ['bs-x','bs-y','bs-blur','bs-spread'].forEach(id=>{const el=$(id+'-v');if(el)el.textContent=$(id)?.value});
  let shadow=`${inset}${x}px ${y}px ${blur}px ${spread}px ${color}`;
  if(multi){
    /* Add a complementary layer */
    const x2=Math.round(-x*0.5),y2=Math.round(-y*0.5);
    const c2=color.replace('#','');
    const r=parseInt(c2.substr(0,2),16),g=parseInt(c2.substr(2,2),16),b=parseInt(c2.substr(4,2),16);
    const comp=`#${((255-r).toString(16).padStart(2,'0')+(255-g).toString(16).padStart(2,'0')+(255-b).toString(16).padStart(2,'0'))}`;
    shadow+=`,\n  ${x2}px ${y2}px ${Math.round(blur*0.6)}px ${Math.round(spread*0.4)}px ${comp}40`;
  }
  const box=$('bs-box');if(box)box.style.boxShadow=shadow;
  const out=$('bs-out');if(out)out.value=`box-shadow: ${shadow};`;
}


/* ── COUNTDOWN TIMER ── */
let cdInterval=null;
function startCD(){
  const dtVal=val('cd-dt');const err=$('cd-err');err.classList.remove('show');
  if(!dtVal){err.textContent='Please select a target date and time';err.classList.add('show');return}
  const target=new Date(dtVal).getTime();
  if(isNaN(target)||target<=Date.now()){err.textContent='Target must be a future date';err.classList.add('show');return}
  stopCD();
  const name=val('cd-title')||'My Event';
  const disp=$('cd-disp');if(disp)disp.style.display='block';
  const nameEl=$('cd-name');if(nameEl)nameEl.textContent=name.toUpperCase();
  const doneEl=$('cd-done');if(doneEl)doneEl.style.display='none';
  function tick(){
    const diff=target-Date.now();
    if(diff<=0){
      stopCD();
      ['cd-d','cd-h','cd-m','cd-s'].forEach(id=>{const el=$(id);if(el)el.textContent='00'});
      if(doneEl)doneEl.style.display='block';
      notify(name+' — Time\'s up! 🎉','success');return;
    }
    const days=Math.floor(diff/86400000);
    const hrs=Math.floor((diff%86400000)/3600000);
    const min=Math.floor((diff%3600000)/60000);
    const sec=Math.floor((diff%60000)/1000);
    [['cd-d',days],['cd-h',hrs],['cd-m',min],['cd-s',sec]].forEach(([id,v])=>{
      const el=$(id);if(el)el.textContent=String(v).padStart(2,'0');
    });
  }
  tick();cdInterval=setInterval(tick,1000);notify('Countdown started!','info');
}
function stopCD(){if(cdInterval){clearInterval(cdInterval);cdInterval=null}}


/* ── DIFF CHECKER ── */
function doDiff(){
  const a=val('df-a'),b=val('df-b');
  const out=$('df-out'),stats=$('df-stats');
  if(!a||!b){notify('Enter text in both fields','error');return}
  const linesA=a.split('\n'),linesB=b.split('\n');
  let added=0,removed=0,same=0;
  const result=[];
  /* Simple line-by-line LCS diff */
  const maxLen=Math.max(linesA.length,linesB.length);
  const setA=new Set(linesA),setB=new Set(linesB);
  /* Two-pointer with matching */
  let ia=0,ib=0;
  while(ia<linesA.length||ib<linesB.length){
    const la=linesA[ia],lb=linesB[ib];
    if(ia>=linesA.length){result.push({type:'add',line:lb});added++;ib++}
    else if(ib>=linesB.length){result.push({type:'rem',line:la});removed++;ia++}
    else if(la===lb){result.push({type:'same',line:la});same++;ia++;ib++}
    else{
      /* Check if la exists later in B (deletion) or lb in A (addition) */
      const laInB=linesB.slice(ib+1,ib+5).includes(la);
      const lbInA=linesA.slice(ia+1,ia+5).includes(lb);
      if(laInB&&!lbInA){result.push({type:'add',line:lb});added++;ib++}
      else{result.push({type:'rem',line:la});removed++;ia++;
        if(lbInA){}else{result.push({type:'add',line:lb});added++;ib++}}
    }
  }
  const colors={same:'var(--text)',add:'rgba(0,255,136,.9)',rem:'rgba(255,51,102,.9)'};
  const bgs={same:'transparent',add:'rgba(0,255,136,.06)',rem:'rgba(255,51,102,.06)'};
  const prefix={same:'  ',add:'+ ',rem:'- '};
  out.innerHTML=result.map(r=>`<div style="color:${colors[r.type]};background:${bgs[r.type]};padding:1px 6px;border-radius:3px">${prefix[r.type]}${r.line.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</div>`).join('');
  stats.innerHTML=`<span style="color:var(--green)">+${added} added</span> &nbsp; <span style="color:var(--red)">-${removed} removed</span> &nbsp; <span style="color:var(--dim)">${same} unchanged</span>`;
  notify('Diff complete!','success');
}


/* ── UNIT CONVERTER ── */
const UC_DATA={
  length:{units:['mm','cm','m','km','in','ft','yd','mi'],
    toBase:{mm:0.001,cm:0.01,m:1,km:1000,in:0.0254,ft:0.3048,yd:0.9144,mi:1609.344},label:'meters'},
  weight:{units:['mg','g','kg','ton','oz','lb','st'],
    toBase:{mg:1e-6,g:0.001,kg:1,ton:1000,oz:0.028349,lb:0.453592,st:6.35029},label:'kg'},
  speed:{units:['m/s','km/h','mph','knot','ft/s'],
    toBase:{'m/s':1,'km/h':1/3.6,'mph':0.44704,'knot':0.514444,'ft/s':0.3048},label:'m/s'},
  area:{units:['mm²','cm²','m²','km²','in²','ft²','acre','ha'],
    toBase:{'mm²':1e-6,'cm²':1e-4,'m²':1,'km²':1e6,'in²':6.4516e-4,'ft²':0.0929,'acre':4046.86,'ha':10000},label:'m²'},
  data:{units:['B','KB','MB','GB','TB','PB'],
    toBase:{B:1,KB:1024,MB:1048576,GB:1073741824,TB:1099511627776,PB:1.126e15},label:'bytes'},
};
function initUC(){
  const cat=val('uc-cat');const d=UC_DATA[cat];
  if(cat==='temp'){
    $('uc-from').innerHTML=['°C','°F','K'].map(u=>`<option value="${u}">${u}</option>`).join('');
    $('uc-to').innerHTML=['°F','°C','K'].map(u=>`<option value="${u}">${u}</option>`).join('');
    if($('uc-to'))$('uc-to').value='°F';
  } else {
    $('uc-from').innerHTML=d.units.map(u=>`<option value="${u}">${u}</option>`).join('');
    $('uc-to').innerHTML=d.units.map(u=>`<option value="${u}">${u}</option>`).join('');
    if($('uc-to'))$('uc-to').value=d.units[1]||d.units[0];
  }
  doUC();
}
function doUC(){
  const cat=val('uc-cat');const v=parseFloat(val('uc-val'));
  const from=val('uc-from'),to=val('uc-to');
  const res=$('uc-res'),rv=$('uc-rv'),rs=$('uc-rs'),tbl=$('uc-table');
  if(isNaN(v)){if(res)res.style.display='none';return}
  let result;
  if(cat==='temp'){
    let c;
    if(from==='°C')c=v;else if(from==='°F')c=(v-32)*5/9;else c=v-273.15;
    if(to==='°C')result=c;else if(to==='°F')result=c*9/5+32;else result=c+273.15;
  } else {
    const d=UC_DATA[cat];
    const base=v*(d.toBase[from]||1);
    result=base/(d.toBase[to]||1);
  }
  if(res)res.style.display='block';
  if(rv)rv.textContent=result.toPrecision(6).replace(/\.?0+$/,'');
  if(rs)rs.textContent=`${v} ${from} = ${result.toPrecision(6).replace(/\.?0+$/,'')} ${to}`;
  /* Fill all-units table */
  if(tbl&&cat!=='temp'){
    const d=UC_DATA[cat];
    const base=v*(d.toBase[from]||1);
    tbl.innerHTML=d.units.map(u=>{
      const val2=(base/(d.toBase[u]||1)).toPrecision(5).replace(/\.?0+$/,'');
      return`<div class="schip" style="flex-direction:column;align-items:flex-start">
        <span style="color:var(--text);font-size:13px">${val2}</span>
        <span style="color:var(--dim);font-size:10px">${u}</span>
      </div>`;
    }).join('');
  } else if(tbl){tbl.innerHTML=''}
}


/* ── TYPING SPEED TEST ── */
const TY_TEXTS=[
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How valiantly quixotic the zephyrs blow.',
  'Programming is the art of telling another human what one wants the computer to do. Code is read more often than it is written.',
  'Success is not final, failure is not fatal: it is the courage to continue that counts. Keep going and never give up on your dreams.',
  'The best way to predict the future is to create it. Innovation distinguishes between a leader and a follower. Think different.',
  'In the middle of difficulty lies opportunity. Imagination is more important than knowledge. Science is the poetry of reality.',
];
let tyTimer=null,tyStarted=false,tyStart=0,tyDur=60,tyErrors=0,tyWordsDone=0;

function startTyping(){
  const dur=parseInt(val('ty-dur'))||60;
  tyDur=dur;tyErrors=0;tyWordsDone=0;tyStarted=false;
  const text=TY_TEXTS[Math.floor(Math.random()*TY_TEXTS.length)];
  const passage=$('ty-passage');
  const inp=$('ty-inp');const btn=$('ty-start');
  if(!passage||!inp||!btn)return;
  /* Render passage with spans */
  passage.innerHTML=text.split('').map((c,i)=>`<span id="ty-c${i}" style="color:var(--dim)">${c==' '?'&nbsp;':c.replace(/</g,'&lt;')}</span>`).join('');
  inp.value='';inp.disabled=false;inp.dataset.text=text;inp.dataset.pos='0';
  inp.focus();
  $('ty-result').innerHTML='';
  $('ty-timer').textContent=dur;
  $('ty-wpm').textContent='0';$('ty-acc').textContent='100';$('ty-errs').textContent='0';$('ty-words').textContent='0';
  btn.textContent='⏹ RUNNING…';btn.onclick=()=>resetTyping();
  notify('Start typing!','info');
}

function tyCheck(){
  const inp=$('ty-inp');if(!inp)return;
  const text=inp.dataset.text||'';const typed=inp.value;
  /* Start timer on first keystroke */
  if(!tyStarted&&typed.length>0){
    tyStarted=true;tyStart=Date.now();
    if(tyTimer)clearInterval(tyTimer);
    tyTimer=setInterval(()=>{
      const elapsed=Math.floor((Date.now()-tyStart)/1000);
      const left=tyDur-elapsed;
      const timerEl=$('ty-timer');
      if(timerEl)timerEl.textContent=Math.max(0,left);
      if(left<=0){clearInterval(tyTimer);tyTimer=null;endTyping()}
      /* Live WPM */
      const wpm=Math.round((typed.replace(/\s/g,'').length/5)/(elapsed/60));
      const wEl=$('ty-wpm');if(wEl)wEl.textContent=Math.max(0,wpm);
    },1000);
  }
  /* Colour each character */
  let errs=0;
  for(let i=0;i<text.length;i++){
    const span=$('ty-c'+i);if(!span)continue;
    if(i<typed.length){
      if(typed[i]===text[i])span.style.color='var(--green)';
      else{span.style.color='var(--red)';errs++;}
    } else if(i===typed.length){
      span.style.color='var(--cyan)';span.style.textDecoration='underline';
    } else {span.style.color='var(--dim)';span.style.textDecoration='none'}
  }
  tyErrors=errs;
  const words=typed.trim().split(/\s+/).filter(w=>w).length;
  tyWordsDone=words;
  const acc=Math.max(0,Math.round(((typed.length-errs)/Math.max(typed.length,1))*100));
  const eEl=$('ty-errs');if(eEl)eEl.textContent=errs;
  const accEl=$('ty-acc');if(accEl)accEl.textContent=acc;
  const wEl=$('ty-words');if(wEl)wEl.textContent=words;
  /* Auto-end if completed */
  if(typed.length>=text.length){clearInterval(tyTimer);tyTimer=null;endTyping()}
}

function endTyping(){
  const inp=$('ty-inp');if(!inp)return;
  inp.disabled=true;
  const elapsed=(Date.now()-tyStart)/60000;
  const wpm=Math.round((inp.value.replace(/\s/g,'').length/5)/Math.max(elapsed,0.01));
  const acc=parseInt($('ty-acc')?.textContent)||100;
  const res=$('ty-result');
  if(res)res.innerHTML=`<div class="result-box">
    <div class="rl">TEST COMPLETE</div>
    <div class="rv">${wpm} WPM</div>
    <div class="rs">${acc}% Accuracy · ${tyErrors} mistakes · ${tyWordsDone} words</div>
  </div>`;
  $('ty-start').textContent='▶ START TEST';$('ty-start').onclick=()=>startTyping();
  notify(`Done! ${wpm} WPM · ${acc}% accuracy`,'success');
}

function resetTyping(){
  if(tyTimer)clearInterval(tyTimer);tyTimer=null;tyStarted=false;
  const inp=$('ty-inp'),passage=$('ty-passage'),timer=$('ty-timer'),btn=$('ty-start'),res=$('ty-result');
  if(inp){inp.value='';inp.disabled=true;}
  if(passage)passage.innerHTML='Press START to begin';
  if(timer)timer.textContent='—';
  if(btn){btn.textContent='▶ START TEST';btn.onclick=()=>startTyping()}
  if(res)res.innerHTML='';
  ['ty-wpm','ty-acc','ty-errs','ty-words'].forEach(id=>{const el=$(id);if(el)el.textContent=id==='ty-acc'?'100':'0'});
}


/* ── CONTRAST CHECKER ── */
function hexToRGB(hex){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return[r,g,b];
}
function relativeLum([r,g,b]){
  const lin=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};
  return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
}
function contrastRatio(fg,bg){
  const l1=relativeLum(hexToRGB(fg)),l2=relativeLum(hexToRGB(bg));
  return(Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);
}
function syncCC(which){
  const hex=val('cc-'+which+'-hex');
  if(/^#[0-9a-fA-F]{6}$/.test(hex)){$('cc-'+which).value=hex;checkCC()}
}
function checkCC(){
  const fg=val('cc-fg'),bg=val('cc-bg');
  /* Sync hex inputs */
  const fgH=$('cc-fg-hex');const bgH=$('cc-bg-hex');
  if(fgH)fgH.value=fg;if(bgH)bgH.value=bg;
  /* Update preview */
  const prev=$('cc-preview');
  if(prev){prev.style.background=bg;prev.style.color=fg}
  const large=$('cc-prev-large'),small=$('cc-prev-small');
  if(large){large.style.color=fg}if(small){small.style.color=fg}
  const ratio=contrastRatio(fg,bg);
  const ratioEl=$('cc-ratio');
  if(ratioEl)ratioEl.innerHTML=`<span style="font-family:var(--fH);font-size:20px;color:var(--cyan)">${ratio.toFixed(2)}:1</span> contrast ratio`;
  /* WCAG levels */
  const levels=[
    {label:'AA Small Text',req:4.5,desc:'Normal text ≥ 4.5:1'},
    {label:'AA Large Text',req:3,desc:'Large text ≥ 3:1'},
    {label:'AAA Small Text',req:7,desc:'Enhanced small ≥ 7:1'},
    {label:'AAA Large Text',req:4.5,desc:'Enhanced large ≥ 4.5:1'},
  ];
  const res=$('cc-res');
  if(res)res.innerHTML=levels.map(l=>{
    const pass=ratio>=l.req;
    return`<div style="background:${pass?'rgba(0,255,136,.07)':'rgba(255,51,102,.07)'};border:1px solid ${pass?'rgba(0,255,136,.25)':'rgba(255,51,102,.2)'};border-radius:8px;padding:10px;text-align:center">
      <div style="font-family:var(--fH);font-size:9px;color:${pass?'var(--green)':'var(--red)'};letter-spacing:1px;margin-bottom:4px">${l.label}</div>
      <div style="font-size:18px">${pass?'✅':'❌'}</div>
      <div style="font-family:var(--fM);font-size:10px;color:var(--dim);margin-top:3px">${l.desc}</div>
    </div>`;
  }).join('');
}
function swapCC(){
  const fg=val('cc-fg'),bg=val('cc-bg');
  $('cc-fg').value=bg;$('cc-bg').value=fg;
  $('cc-fg-hex').value=bg;$('cc-bg-hex').value=fg;
  checkCC();click();
}

/* ══════════════════════════════════════════════════════
   INIT HOOK — call extra init for new tools
══════════════════════════════════════════════════════ */

/* ═══════════════════════════
   BOOT
═══════════════════════════ */
buildAll();
/* Keyboard nav for sidebar */
document.querySelectorAll('.sb-item').forEach(it=>{
  it.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();it.click()}});
});
