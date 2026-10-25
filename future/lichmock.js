const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const mk=(n,g,ch=[],extra={})=>({members:[{name:n,gender:g,deceased:false,cell:'X'+Math.random()}].concat(extra.sp?[{name:extra.sp,gender:g==='M'?'F':'M',deceased:false,cell:'Y'+Math.random()}]:[]),children:ch,notes:[]});
const kids=(p,n)=>Array.from({length:n},(_,i)=>mk(p+' '+(i+1),i%2?'F':'M'));
const lich={members:[{name:'(Cha Bà Lịch)',gender:'M',deceased:true,cell:'L1'},{name:'(Mẹ Bà Lịch)',gender:'F',deceased:true,cell:'L2'}],notes:[],children:[
  mk('Anh A','M',[mk('Con A1','M',kids('Cháu A1',2),{sp:'Vợ A1'}),mk('Con A2','F',kids('Cháu A2',3),{sp:'Chồng A2'}),mk('Con A3','M')],{sp:'Vợ A'}),
  mk('Lịch ↗ Ông Hai','F',[]),
  mk('Em B','F',[mk('Con B1','F',kids('Cháu B1',2),{sp:'Chồng B1'}),mk('Con B2','M',[],{sp:'Vợ B2'})],{sp:'Chồng B'}),
  mk('Em C','M',[mk('Con C1','M',kids('Cháu C1',1))],{sp:'Vợ C'})]};
const shots=[];
for(const [w,h,tag,mob] of [[1200,1000,'desk',0],[402,874,'phone',1]]){
 const ctx=await b.newContext({viewport:{width:w,height:h},hasTouch:!!mob,isMobile:!!mob,deviceScaleFactor:2});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);
 await p.evaluate(L=>{const sh=DATA['H.HN.T Paternal Tree'];sh.roots=[sh.roots[0],L];build();snapUI()},lich);await p.waitForTimeout(700);
 await p.screenshot({path:S+`/mock/lich-${tag}.png`});
 if(!mob){ await p.evaluate(()=>{const n=nodes.find(d=>/Cha Bà Lịch/.test(d.data.members[0].name));ROT=Math.PI/2-(n.x0+n.x1)/2;spinSun();const t=d3.zoomTransform(svg.node());svg.call(zoom.transform,d3.zoomIdentity.translate(300,500).scale(t.k*2.3))});await p.waitForTimeout(600);await p.screenshot({path:S+'/mock/lich-desk-zoom.png'}) }
 console.log(tag,errs);await ctx.close()}
await b.close();})();
