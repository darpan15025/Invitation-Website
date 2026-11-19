(function(){
const root=document.documentElement;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer=matchMedia('(pointer:fine)').matches;

/* ---------- Fireworks engine ---------- */
const fw=(function(){
  const c=document.getElementById('fx'),x=c.getContext('2d');
  let W=0,H=0,parts=[],rockets=[],raf=0,idle=0;
  const PALETTE=[['#ffd36b','#fff3c4'],['#ff4d6d','#ffc2cf'],['#ff8c1a','#ffd9a8'],['#7cfc9a','#e0ffe8'],['#c77dff','#f0e0ff'],['#4cc9f0','#dcf7ff'],['#ffffff','#fff3c4']];
  function size(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0)}
  size();addEventListener('resize',size);
  const rnd=(a,b)=>a+Math.random()*(b-a);
  function explode(px,py,type){
    const pal=PALETTE[Math.floor(Math.random()*PALETTE.length)];
    type=type||['peony','peony','ring','willow','heart','crackle'][Math.floor(Math.random()*6)];
    const add=(vx,vy,o)=>parts.push(Object.assign({x:px,y:py,vx,vy,life:1,decay:rnd(.011,.02),col:Math.random()<.25?pal[1]:pal[0],r:rnd(1.2,2.4),drag:.985,g:.045,tw:false},o||{}));
    if(type==='heart'){const n=70;for(let i=0;i<n;i++){const t=i/n*Math.PI*2,hx=16*Math.pow(Math.sin(t),3),hy=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));add(hx*.28,hy*.28,{col:i%3?'#ff4d6d':'#ffc2cf',drag:.965,g:.02,decay:.012})}}
    else if(type==='ring'){const n=64,s=rnd(3.6,4.6);for(let i=0;i<n;i++){const a=i/n*Math.PI*2;add(Math.cos(a)*s,Math.sin(a)*s,{drag:.975})}}
    else if(type==='willow'){const n=80;for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=rnd(1,4.2);add(Math.cos(a)*s,Math.sin(a)*s,{col:Math.random()<.5?'#ffd36b':'#f3a93c',decay:rnd(.006,.01),drag:.975,g:.03,r:rnd(1,1.8)})}}
    else if(type==='crackle'){const n=90;for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=rnd(1,5);add(Math.cos(a)*s,Math.sin(a)*s,{tw:true,col:'#fff3c4'})}}
    else{const n=100;for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=Math.pow(Math.random(),.5)*5.4;add(Math.cos(a)*s,Math.sin(a)*s)}}
    // flash
    parts.push({x:px,y:py,vx:0,vy:0,life:1,decay:.12,col:'#fff7d6',r:26,drag:1,g:0,flash:true});
    start();
  }
  function launch(tx,ty){
    tx=tx==null?rnd(W*.15,W*.85):tx;ty=ty==null?rnd(H*.12,H*.42):ty;
    const sx=tx+rnd(-W*.08,W*.08);
    rockets.push({sx,sy:H+10,tx,ty,t:0,dur:rnd(50,72),x:sx,y:H+10});start();
  }
  function show(n,spread){if(reduce){explode(W/2,H/3,'peony');return}n=n||6;spread=spread||2400;for(let i=0;i<n;i++)setTimeout(()=>launch(),i*spread/n+rnd(0,180))}
  function start(){idle=0;if(!raf)raf=requestAnimationFrame(loop)}
  function loop(){
    x.globalCompositeOperation='destination-out';x.fillStyle='rgba(0,0,0,.2)';x.fillRect(0,0,W,H);
    x.globalCompositeOperation='lighter';
    for(let i=rockets.length-1;i>=0;i--){const r=rockets[i];r.t++;const k=r.t/r.dur,e=1-Math.pow(1-k,3);const nx=r.sx+(r.tx-r.sx)*e,ny=r.sy+(r.ty-r.sy)*e;
      x.strokeStyle='rgba(255,214,140,.9)';x.lineWidth=2;x.beginPath();x.moveTo(r.x,r.y);x.lineTo(nx,ny);x.stroke();
      if(Math.random()<.6)parts.push({x:nx,y:ny,vx:rnd(-.4,.4),vy:rnd(.5,1.5),life:.7,decay:.04,col:'#ffb347',r:1.2,drag:.95,g:.02});
      r.x=nx;r.y=ny;if(k>=1){rockets.splice(i,1);explode(r.x,r.y)}}
    for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.vx*=p.drag;p.vy=p.vy*p.drag+p.g;p.x+=p.vx;p.y+=p.vy;p.life-=p.decay;
      if(p.life<=0){parts.splice(i,1);continue}
      let a=p.life;if(p.tw)a*=Math.random()<.5?1:.15;
      x.globalAlpha=Math.max(0,a);x.fillStyle=p.col;x.beginPath();
      if(p.flash){const g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*2);g.addColorStop(0,'rgba(255,247,214,.8)');g.addColorStop(1,'rgba(255,200,100,0)');x.fillStyle=g;x.arc(p.x,p.y,p.r*2,0,7)}
      else x.arc(p.x,p.y,p.r*(.5+p.life*.6),0,7);
      x.fill()}
    x.globalAlpha=1;
    if(!parts.length&&!rockets.length){if(++idle>40){x.clearRect(0,0,W,H);raf=0;return}}
    raf=requestAnimationFrame(loop);
  }
  return {show,launch,explode};
})();
window.aatishbaazi=fw;

/* ---------- Falling petals ---------- */
function petals(){
  if(reduce)return;const box=document.getElementById('petals');const n=innerWidth<700?12:20;
  const cols=['radial-gradient(circle at 30% 30%,#ffd36b,#f08a1c 60%,#c4560c)','radial-gradient(circle at 30% 30%,#ffb3c1,#e63e6d 60%,#9b1b30)','radial-gradient(circle at 30% 30%,#fff1c1,#f3c14a 60%,#d48a0c)'];
  for(let i=0;i<n;i++){const s=document.createElement('span');s.className='petal';const r=(a,b)=>a+Math.random()*(b-a);
    s.style.cssText=`left:${r(0,100)}%;--s:${r(10,20)}px;--c:${cols[i%3]};--d:${r(11,20)}s;--dl:${r(-20,0)}s;--x1:${r(-40,40)}px;--x2:${r(-80,80)}px;--x3:${r(-60,60)}px`;
    box.appendChild(s)}
}

/* ---------- Gate ---------- */
const gate=document.getElementById('gate');
function openGate(instant){
  if(root.classList.contains('opened'))return;
  root.classList.remove('locked');root.classList.add('opened');
  try{sessionStorage.setItem('nimantran-khula','1')}catch(e){}
  const fab=document.querySelector('.fab');setTimeout(()=>fab.classList.add('on'),instant?600:2600);
  if(instant){gate.classList.add('gone');petals();return}
  gate.classList.add('open');
  setTimeout(()=>{fw.show(7,2600);setTimeout(()=>fw.explode(innerWidth/2,innerHeight*.35,'heart'),900)},500);
  setTimeout(()=>gate.classList.add('gone'),2300);
  petals();
}
document.getElementById('openGate').addEventListener('click',()=>openGate(false));
let seen=false;try{seen=sessionStorage.getItem('nimantran-khula')==='1'}catch(e){}
if(seen)openGate(true);else document.getElementById('openGate').focus({preventScroll:true});

/* ---------- Fireworks triggers ---------- */
document.querySelectorAll('[data-fireworks]').forEach(b=>b.addEventListener('click',()=>fw.show(6,2000)));
document.getElementById('home').addEventListener('click',e=>{if(e.target.closest('a,button'))return;fw.explode(e.clientX,e.clientY)});

/* ---------- Scratch card ---------- */
const card=document.getElementById('scratchCard'),sc=document.getElementById('scratch'),sx=sc.getContext('2d');
let revealed=false,drawing=false,last=null,strokes=0,scratched=false;
function paintFoil(){
  if(revealed)return;const d=Math.min(devicePixelRatio||1,2),w=sc.offsetWidth,h=sc.offsetHeight;
  if(!w)return;sc.width=w*d;sc.height=h*d;sx.setTransform(d,0,0,d,0,0);sx.globalCompositeOperation='source-over';
  const g=sx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#a8741f');g.addColorStop(.25,'#f3d58a');g.addColorStop(.5,'#c9932f');g.addColorStop(.75,'#fbe6a6');g.addColorStop(1,'#a8741f');
  sx.fillStyle=g;sx.fillRect(0,0,w,h);
  sx.strokeStyle='rgba(110,20,35,.16)';sx.lineWidth=1;
  for(let yy=0;yy<h+20;yy+=18)for(let xx=(yy/18%2)*9;xx<w+20;xx+=18){sx.beginPath();sx.moveTo(xx,yy-5);sx.lineTo(xx+5,yy);sx.lineTo(xx,yy+5);sx.lineTo(xx-5,yy);sx.closePath();sx.stroke()}
  sx.fillStyle='rgba(255,255,255,.18)';for(let i=0;i<120;i++){sx.fillRect(Math.random()*w,Math.random()*h,1.5,1.5)}
  sx.textAlign='center';sx.fillStyle='#6e1423';
  sx.font='48px "Great Vibes", cursive';sx.fillText('Shubh Tithi',w/2,h*.46);
  sx.font='600 13px Cinzel, serif';sx.fillText('✦  YAHAAN SCRATCH KAREIN  ✦',w/2,h*.46+34);
  sx.font='500 11px Cinzel, serif';sx.fillStyle='rgba(110,20,35,.7)';sx.fillText('ungli ya mouse ghumaiye',w/2,h*.46+56);
}
paintFoil();if(document.fonts)document.fonts.ready.then(()=>{if(!scratched)paintFoil()});
addEventListener('resize',()=>{if(!scratched)paintFoil()});
function pos(e){const r=sc.getBoundingClientRect(),k=sc.offsetWidth/r.width;return{x:(e.clientX-r.left)*k,y:(e.clientY-r.top)*k}}
function scratchTo(p){sx.globalCompositeOperation='destination-out';sx.lineCap='round';sx.lineJoin='round';sx.lineWidth=46;sx.beginPath();sx.moveTo((last||p).x,(last||p).y);sx.lineTo(p.x+.01,p.y+.01);sx.stroke();last=p;
  if(Math.random()<.35){const r=sc.getBoundingClientRect(),k=r.width/sc.offsetWidth;goldDust(r.left+p.x*k,r.top+p.y*k)}}
function cleared(){const {width:w,height:h}=sc;const data=sx.getImageData(0,0,w,h).data;let clear=0,total=0;for(let i=3;i<data.length;i+=4*24){total++;if(data[i]<40)clear++}return clear/total}
sc.addEventListener('pointerdown',e=>{if(revealed)return;drawing=true;scratched=true;card.classList.add('touched');sc.setPointerCapture(e.pointerId);last=null;scratchTo(pos(e))});
sc.addEventListener('pointermove',e=>{if(!drawing)return;scratchTo(pos(e));if(++strokes%14===0&&cleared()>.5)reveal()});
const end=()=>{if(!drawing)return;drawing=false;last=null;if(cleared()>.45)reveal()};
sc.addEventListener('pointerup',end);sc.addEventListener('pointercancel',end);
document.getElementById('revealBtn').addEventListener('click',reveal);
function reveal(){
  if(revealed)return;revealed=true;drawing=false;sc.classList.add('done');card.classList.add('revealed');
  document.getElementById('scratchTools').style.visibility='hidden';
  document.getElementById('afterReveal').classList.add('show');
  const r=card.getBoundingClientRect();
  fw.explode(r.left+r.width/2,r.top+r.height/2,'heart');
  setTimeout(()=>fw.show(8,2600),350);
  startCountdown();
}

/* ---------- Countdown ---------- */
let cdStarted=false;
function startCountdown(){
  if(cdStarted)return;cdStarted=true;
  const target=new Date('2026-12-14T19:00:00+05:30').getTime();const prev={};
  function tick(){let d=target-Date.now();if(d<0)d=0;
    const v={days:Math.floor(d/864e5),hours:Math.floor(d%864e5/36e5),minutes:Math.floor(d%36e5/6e4),seconds:Math.floor(d%6e4/1e3)};
    for(const k in v){const el=document.getElementById(k),s=String(v[k]).padStart(2,'0');if(prev[k]!==s){el.textContent=s;el.classList.remove('tick');void el.offsetWidth;el.classList.add('tick');prev[k]=s}}}
  tick();setInterval(tick,1000);
}

/* ---------- Scroll reveals ---------- */
const els=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});els.forEach(el=>io.observe(el));
  let footerFired=false;const fo=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!footerFired&&root.classList.contains('opened')){footerFired=true;fw.show(5,2200)}}),{threshold:.6});fo.observe(document.getElementById('footer'));
}else els.forEach(el=>el.classList.add('in'));

/* ---------- 3D tilt on miniatures ---------- */
if(finePointer&&!reduce)document.querySelectorAll('.tilt').forEach(el=>{
  el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateY(${px*10}deg) rotateX(${-py*8}deg) scale(1.02)`});
  el.addEventListener('pointerleave',()=>{el.style.transform=''});
});

/* ---------- Gold dust trail ---------- */
let lastDust=0;
function goldDust(cx,cy){if(reduce)return;const s=document.createElement('span');s.className='spark';s.style.left=cx+'px';s.style.top=cy+'px';document.body.appendChild(s);setTimeout(()=>s.remove(),800)}
if(finePointer)addEventListener('pointermove',e=>{const t=performance.now();if(t-lastDust<45||!root.classList.contains('opened'))return;lastDust=t;goldDust(e.clientX,e.clientY)},{passive:true});
})();
