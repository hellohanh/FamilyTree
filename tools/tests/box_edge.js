// Entry 185: every card's outer edge (box + half its border) matches the focal's, in Simple, Side and Top
const {chromium}=require('playwright');const OUT=process.argv[2];
(async()=>{const b=await chromium.launch();
for(const [tag,vp] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
 const ctx=await b.newContext(vp);const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(5000);await p.mouse.click(200,300);await p.waitForTimeout(800);
 for(const v of ['simple','side','top']){const id=v==='simple'?'pSimple':v==='side'?'pSide':'pTop',sv=v==='simple'?'#ssv':'#fsv';
  await p.evaluate(()=>{document.getElementById('pWhole').click()});await p.waitForTimeout(900);
  await p.evaluate(()=>{FOCAL=CP['W236'];paintFocal();paneSync()});
  await p.evaluate(i=>document.getElementById(i).click(),id);await p.waitForTimeout(6000);
  const r=await p.evaluate(s=>{const out={};document.querySelectorAll(s+' g.card, '+s+' g.fc').forEach(G=>{
    const R=G.querySelector('rect'),H=G.querySelector('rect.hit'),sw=+R.getAttribute('stroke-width');
    const ow=+R.getAttribute('width')+sw,oh=+R.getAttribute('height')+sw,bw=+H.getAttribute('width'),bh=+H.getAttribute('height');
    // extra the border adds outside the box, per side (should be the focal's 1.5 × the card scale for every card)
    const k=(sw+'|'+((ow-bw)/2).toFixed(3)+'|'+((oh-bh)/2).toFixed(3));out[k]=(out[k]||0)+1});return out},sv);
  await p.screenshot({path:`${OUT}/edge-${tag}-${v}.png`});console.log(tag,v,JSON.stringify(r))}
 console.log('errors',errs);await ctx.close()}
await b.close()})();
