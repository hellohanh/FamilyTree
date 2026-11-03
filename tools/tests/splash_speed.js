// Entry 225: how soon the splash starts drawing. Database calls are delayed (LAT ms, like a slow connection to Supabase)
// and the tree pictures are throttled (KBPS kbit/s). Reports when the splash canvas first has something drawn on it
// (the branches fading in) and when the first falling leaf shows. Usage: node splash_speed.js OUT [desktop|phone] [LAT] [KBPS]
const {chromium}=require('playwright');const live=require('./livedb.js');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop',LAT=+(process.argv[4]||1500),KBPS=+(process.argv[5]||4000);
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
(async()=>{const L=await live('hft29');const b=await chromium.launch();const R=[];
 for(const run of [1,2,3]){const ctx=await b.newContext(VP);
  await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',async r=>{await new Promise(z=>setTimeout(z,LAT));return L.answer(r)});
  await ctx.route('**/assets/splash*.webp',async r=>{const res=await r.fetch();const body=await res.body();await new Promise(z=>setTimeout(z,body.length*8/(KBPS*1024)*1000));r.fulfill({response:res,body})});
  const p=await ctx.newPage();const t0=Date.now();p.goto('http://localhost:8765/').catch(()=>{});
  let drawn=null;
  for(let i=0;i<400&&drawn==null;i++){await new Promise(z=>setTimeout(z,25));
   const n=await p.evaluate(()=>{const c=document.getElementById('cv');if(!c||c.width<=300)return 0;const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=4*61)if(d[i]>8)n++;return n}).catch(()=>0);
   if(n>0)drawn=Date.now()-t0}
  R.push(drawn);if(run===1){await p.waitForTimeout(1200);await p.screenshot({path:`${OUT}/splash-${TAG}.png`})}await ctx.close()}
 console.log(`${TAG}: splash first draws after ${R.join(' / ')} ms (database answers in ${LAT} ms, pictures at ${KBPS} kbit/s)`);
 await b.close();await L.end()})();
