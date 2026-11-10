/* Landing page (S017, Entry 242): the site's own splash (Entries 76, 87–88, 90, 151, 171, 225) played through, then the
   tree glides into the hero, to the right of the heading. CALENDAR, seasonPlan() and recolor() are the same as in
   v2/src/index.template.html — keep the two in step, so the landing tree always wears the splash's season. */
(function(){const $=id=>document.getElementById(id),TREES=[__TREE_PICS__];
// S017 — Hanh's season calendar (replaces Entry 99's two-month blocks): each look from its start date until the next
// look starts. [month, day, look]
const CALENDAR=[[1,10,'pink'],[2,15,'mai'],[4,1,'spring'],[5,15,'summer'],[6,30,'gold'],[8,10,'red'],[9,30,'wine'],[11,10,'purple'],[12,15,'frost']];
const BLEND=7;   // days each side of a change (14 in all): leaves are a random mix, the new look's share grows 0 → 100 %
// which look(s) today: {A, B, share, fall, bud, budKey}; ?season=<look> shows one look, ?date=YYYY-MM-DD any day
// (?fall= and ?bud= 0…1 preview the winter on their own)
// Entry 242 (Hanh): winter — purple blends into white like any other change. From halfway through the white the leaves
// drop to the ground; at 90 % they are all down. From BLEND days before the next look, its leaves bud on the tree: tiny
// while the last white leaves fall, then growing fast once the ground is full, full size on the changeover. No blend out.
function seasonPlan(){
 const LOOKS=CALENDAR.map(c=>c[2]),n=CALENDAR.length,Q=new URLSearchParams(location.search),q=Q.get('season'),DAY=864e5;
 const cl=v=>Math.max(0,Math.min(1,v)),num=k=>Q.has(k)?cl(+Q.get(k)):null;
 if(LOOKS.concat('mix').includes(q))return {A:q,B:null,share:0,fall:num('fall')||0,bud:num('bud')||0,budKey:LOOKS[(LOOKS.indexOf(q)+1)%n]};
 const now=Q.get('date')?new Date(Q.get('date')+'T12:00'):new Date(),y=now.getFullYear(),at=(i,yy)=>new Date(yy,CALENDAR[i][0]-1,CALENDAR[i][1],12);
 // the look whose days hold today, and when it started / when the next starts
 let k=n-1,from=at(n-1,y-1);for(let i=0;i<n;i++)if(now>=at(i,y)){k=i;from=at(i,y)}
 let to=at((k+1)%n,from.getFullYear());if(to<=from)to=at((k+1)%n,from.getFullYear()+1);
 let A=LOOKS[k],B=null,share=0,fall=0,bud=0;
 // within BLEND days of a change the two looks mix — except out of white (the buds do that)
 for(const yy of [y-1,y,y+1])for(let i=0;i<n;i++){const dd=(now-at(i,yy))/DAY,prev=LOOKS[(i+n-1)%n];
  if(Math.abs(dd)<=BLEND&&prev!=='frost'){A=prev;B=LOOKS[i];share=(dd+BLEND)/(2*BLEND)}}
 if(LOOKS[k]==='frost'){const F=(to-from)/DAY,d=(now-from)/DAY;
  fall=cl((d-.5*F)/(.4*F));                                   // 50 % → 90 % of the white: every leaf comes down
  const u=cl((d-(F-BLEND))/BLEND),u1=Math.min(.95,Math.max(.05,(.9*F-(F-BLEND))/BLEND));   // u1: the day the ground is full
  if(u>0)bud=Math.max(.08,u<u1?.08+.22*u/u1:.3+.7*(u-u1)/(1-u1))}   // size: slow to 30 % while leaves fall, then to 100 %
 if(num('fall')!==null)fall=num('fall');if(num('bud')!==null)bud=num('bud');
 return {A,B,share,fall,bud,budKey:LOOKS[(k+1)%n]}}
function recolor(c,w,h,key){if(key==='red')return;
 const LOOK={pink:[335,.45,1.25,.4],spring:[100,.75,1.15,1],summer:[125,.9,.8,1],gold:[38,1,1.1,1],mai:[52,.95,1.25,.5],purple:[272,.55,1.12,.5],wine:[345,.85,.6,.5]},L=LOOK[key];
 const im=c.getImageData(0,0,w,h),d=im.data;
 for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;const r=d[i]/255,g=d[i+1]/255,b=d[i+2]/255,mx=Math.max(r,g,b),df=mx-Math.min(r,g,b);
  if(key==='frost'){const t=Math.min(1,mx*1.35);d[i]=219*t;d[i+1]=237*t;d[i+2]=255*t;continue}
  let hh=df?(mx===r?((g-b)/df)%6:mx===g?(b-r)/df+2:(r-g)/df+4)/6:0;hh=((hh+.5)%1+1)%1-.5;
  const H=((L[0]/360+hh*L[3])%1+1)%1,S=Math.min(1,(mx?df/mx:0)*L[1]),V=Math.min(1,mx*L[2]);
  const k=nn=>{const kk=(nn+H*6)%6;return V-V*S*Math.max(0,Math.min(kk,4-kk,1))};d[i]=k(5)*255;d[i+1]=k(3)*255;d[i+2]=k(1)*255}
 c.putImageData(im,0,0)}

const body=document.body,sp=$('splash'),cv=$('cv'),ctx=cv.getContext('2d'),tt=$('title'),tr=tt.querySelector('.tr'),an=tt.querySelector('.an'),hero=$('heroTree');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const DPR=Math.min(2,devicePixelRatio||1);
const showPage=()=>{body.classList.remove('intro')};
// Entry 151: once per session (tab); Entry 171: Ctrl/Cmd+Shift+R plays it again
let seen=false;try{seen=!!sessionStorage.getItem('hft-splash-seen');sessionStorage.setItem('hft-splash-seen','1');
 if(sessionStorage.getItem('hft-splash-again')){sessionStorage.removeItem('hft-splash-again');seen=false}}catch(e){}
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.shiftKey&&(e.key==='R'||e.key==='r'||e.code==='KeyR')){try{sessionStorage.setItem('hft-splash-again','1')}catch(x){}}},true);
if(/[?&](splash|embed)\b/.test(location.search))seen=false;   // ?splash plays it every time; ?embed = shown by the main link, which already decided
const SP=seasonPlan(),MIXED=!!SP.B||SP.A==='mix'||SP.fall>0||SP.bud>0;   // MIXED: the tree is drawn from its leaves, one by one
const QT=+new URLSearchParams(location.search).get('tree'),pick=TREES[QT>=1&&QT<=TREES.length?QT-1:Math.floor(Math.random()*TREES.length)]/* ?tree=1|2 previews one */,bare=new Image(),lvs=new Image();let nload=0;
bare.onerror=lvs.onerror=()=>{sp.remove();showPage()};
bare.onload=lvs.onload=()=>{if(++nload<2)return;(seen||reduce)?still():play()};
bare.src=pick.b;lvs.src=pick.l;

// the tree in this season's leaves, at size aw × ah (local coordinates); returns the leaves to animate
function build(aw,ah){
 const o=document.createElement('canvas');o.width=Math.round(aw*DPR);o.height=Math.round(ah*DPR);const oc=o.getContext('2d');oc.drawImage(lvs,0,0,o.width,o.height);
 const px=oc.getImageData(0,0,o.width,o.height).data,red=(x,y)=>{const i=(y*o.width+x)*4;return px[i+3]>120};
 const tint=(key)=>{const c=document.createElement('canvas');c.width=o.width;c.height=o.height;const cc=c.getContext('2d');cc.drawImage(o,0,0);recolor(cc,c.width,c.height,key);return c};
 const one=MIXED?null:tint(SP.A),budSrc=SP.bud>0?tint(SP.budKey):null;
 // the ground: the foot of the roots in the branches picture
 const g=document.createElement('canvas');g.width=64;g.height=64;const gc=g.getContext('2d');gc.drawImage(bare,0,0,64,64);const gp=gc.getImageData(0,0,64,64).data;
 let foot=58;for(let yy=63;yy>0;yy--){let hit=0;for(let xx=0;xx<64;xx++)if(gp[(yy*64+xx)*4+3]>60)hit++;if(hit>2){foot=yy;break}}
 const groundY=(foot+.5)/64*ah;
 const LEAF=new Path2D('M0,-10 L2,-5 L5,-7 L4,-2 L9,-3 L7,1 L10,3 L4,4 L5,8 L1,6 L0,10 L-1,6 L-5,8 L-4,4 L-10,3 L-7,1 L-9,-3 L-4,-2 L-5,-7 L-2,-5 Z');
 const step=Math.max(11,ah/26),sz=step*1.15,leaves=[],buds=[];
 const cut=(src,X,Y,fs)=>{const f=document.createElement('canvas');f.width=f.height=fs;const fc=f.getContext('2d');
  fc.translate(fs/2,fs/2);fc.rotate(Math.random()*Math.PI*2);fc.scale(sz*DPR/10,sz*DPR/10);fc.clip(LEAF);fc.setTransform(1,0,0,1,0,0);fc.drawImage(src,-(X-fs/2),-(Y-fs/2));return f};
 for(let gy=0;gy<ah;gy+=step)for(let gx=0;gx<aw;gx+=step){const x=gx+Math.random()*step,y=gy+Math.random()*step,X=Math.round(x*DPR),Y=Math.round(y*DPR);
  if(X>=o.width||Y>=o.height||!red(X,Y))continue;
  const fs=Math.ceil(sz*2.4*DPR),f=cut(one||o,X,Y,fs);
  if(MIXED&&!one){let key=SP.B&&Math.random()<SP.share?SP.B:SP.A;if(key==='mix')key=Math.random()<.5?'gold':'red';recolor(f.getContext('2d'),fs,fs,key)}
  const L={f,fs:fs/DPR,x,y,delay:500+(1-y/ah)*2000+Math.random()*1500,dur:1500+Math.random()*900,sway:12+Math.random()*24,spin:(Math.random()<.5?-1:1)*(3+Math.random()*6),ph:Math.random()*6.28};
  if(Math.random()<SP.fall){   // on the ground: scattered round the trunk, lying flat
   const r=(Math.random()+Math.random()+Math.random()-1.5)/1.5;L.x=aw*(.5+r*.38);L.y=groundY-ah*.012-Math.random()*Math.random()*ah*.07*(1-Math.abs(r));L.flat=true;L.rot=Math.random()*6.28;L.delay+=600}
  L.sx=L.x+(Math.random()*240-120);leaves.push(L);
  if(budSrc)buds.push({f:cut(budSrc,X,Y,fs),fs:fs/DPR,x:x+(Math.random()-.5)*step*.5,y:y+(Math.random()-.5)*step*.5})}
 // white leaves on the ground sit under everything else
 leaves.sort((p,q)=>(q.flat?1:0)-(p.flat?1:0));
 return {o:one,leaves,buds}}
function drawLeaf(c,L,x,y,rot,s){c.save();c.translate(x,y);if(L.flat){c.rotate(L.rot);c.scale(s,s*.55)}else{c.rotate(rot||0);c.scale(s,s)}c.drawImage(L.f,-L.fs/2,-L.fs/2,L.fs,L.fs);c.restore()}
function drawBuds(c,T,alpha){if(!T.buds.length)return;c.save();c.globalAlpha=alpha;for(const b of T.buds){const s=SP.bud;c.drawImage(b.f,b.x-b.fs*s/2,b.y-b.fs*s/2,b.fs*s,b.fs*s)}c.restore()}
// the finished tree (branches + every leaf landed + buds), local coordinates 0..aw × 0..ah
function drawFinished(c,T,aw,ah){c.drawImage(bare,0,0,aw,ah);if(!MIXED)c.drawImage(T.o,0,0,aw,ah);else for(const L of T.leaves)drawLeaf(c,L,L.x,L.y,0,L.flat?.82:1);drawBuds(c,T,1)}
// hero canvas: same shape as the picture (never stretched), at the slot's width
function paintHero(T,aw,ah){const w=hero.parentNode.getBoundingClientRect().width||aw,h=w*ah/aw;
 hero.width=Math.round(w*DPR);hero.height=Math.round(h*DPR);const c=hero.getContext('2d');c.setTransform(DPR*w/aw,0,0,DPR*w/aw,0,0);drawFinished(c,T,aw,ah)}

function still(){sp.remove();const aw=lvs.width,ah=lvs.height,T=build(Math.min(aw,600),Math.min(aw,600)*ah/aw);paintHero(T,Math.min(aw,600),Math.min(aw,600)*ah/aw);showPage()}

function play(){
 const W=innerWidth,H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;
 const ah=Math.min(H*.62,W*.85),aw=lvs.width*ah/lvs.height,ax=(W-aw)/2,ay=H*.08;
 const fsz=Math.min(64,W/7);tt.style.fontSize=fsz+'px';tt.style.top=(ay+ah+fsz*.55)+'px';
 const T=build(aw,ah),leaves=T.leaves,TRC=['#d1452b','#D9A521','#e8b84a','#a81c1c','#e0662f'];
 const acc=document.createElement('canvas');acc.width=cv.width;acc.height=cv.height;const a=acc.getContext('2d');a.setTransform(DPR,0,0,DPR,0,0);
 const last=Math.max(...leaves.map(L=>L.delay+L.dur));let T0=performance.now(),cyc=-1,raf,gliding=false;
 const t0=last+900,GO=t0+1300;   // the splash runs through: leaves land, the tree fills in, "ancestry", then the "Tr" glows once
 sp.addEventListener('click',()=>{if(!gliding)T0-=Math.max(0,GO-(performance.now()-T0))});   // a tap skips to the end of the animations
 function frame(t){const e=t-T0;ctx.setTransform(DPR,0,0,DPR,0,0);ctx.clearRect(0,0,W,H);
  ctx.globalAlpha=Math.min(1,e/800);ctx.drawImage(bare,ax,ay,aw,ah);ctx.globalAlpha=1;
  for(const L of leaves){if(L.landed)continue;const u=(e-L.delay)/L.dur;if(u<=0)continue;
   if(u>=1){L.landed=true;drawLeaf(a,L,ax+L.x,ay+L.y,0,L.flat?.82:1);continue}
   const k=1-Math.pow(1-u,2.2),y=-30+(ay+L.y+30)*k,x=ax+L.sx+(L.x-L.sx)*k+Math.sin(u*9+L.ph)*L.sway*(1-k),s=1+.35*(1-k);
   if(L.flat&&u>.85){drawLeaf(ctx,L,x,y,0,.82);continue}   // settling flat on the ground
   ctx.save();ctx.translate(x,y);ctx.rotate(L.spin*(1-k));ctx.scale(s,s);ctx.drawImage(L.f,-L.fs/2,-L.fs/2,L.fs,L.fs);ctx.restore()}
  ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(acc,0,0);ctx.setTransform(DPR,0,0,DPR,0,0);
  const fin=Math.max(0,Math.min(1,(e-last+200)/700));if(fin>0&&!MIXED){ctx.globalAlpha=fin;ctx.drawImage(T.o,ax,ay,aw,ah);ctx.globalAlpha=1}
  if(fin>0){ctx.save();ctx.translate(ax,ay);drawBuds(ctx,T,fin);ctx.restore()}   // the next look's buds open as the tree finishes
  an.style.opacity=Math.max(0,Math.min(1,(e-last+100)/900));
  if(e>=t0){const c=Math.floor((e-t0)/2600);if(c!==cyc){cyc=c;let col;do{col=TRC[Math.floor(Math.random()*TRC.length)]}while(col===tr.style.color&&TRC.length>1);tr.style.color=col}}
  tr.style.opacity=e<t0?0:(.5-.5*Math.cos((e-t0)/2600*2*Math.PI)).toFixed(3);
  if(e>=GO&&!gliding){glide();return}
  raf=requestAnimationFrame(frame)}
 raf=requestAnimationFrame(frame);
 function glide(){gliding=true;
  // final, clean frame of the finished tree
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.clearRect(0,0,W,H);ctx.save();ctx.translate(ax,ay);drawFinished(ctx,T,aw,ah);ctx.restore();
  scrollTo(0,0);const r=hero.parentNode.getBoundingClientRect(),s=r.width/aw;   // the slot right of the heading
  sp.classList.add('glide');
  cv.style.transform=`translate(${r.left-ax*s}px,${r.top-ay*s}px) scale(${s})`;
  setTimeout(showPage,500);   // the heading and the rest rise in while the tree settles
  let doneG=false;const end=()=>{if(doneG)return;doneG=true;paintHero(T,aw,ah);sp.remove()};
  cv.addEventListener('transitionend',end,{once:true});setTimeout(end,1700)}
}
addEventListener('resize',()=>{});   // the hero canvas keeps its shape by CSS (width 100 %, height auto)
})();
