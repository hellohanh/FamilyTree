// Entry 196: whole wheel — drag the middle to move it, drag the outer edge to turn it; a tap still snaps; ⟲ re-centres;
// pinch / Ctrl+scroll keep the wheel where it was moved; computer (mouse) and phone (real touch drags).
const {chromium}=require('playwright');const OUT=process.argv[2];
(async()=>{const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
for(const [tag,vp] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}]].filter(([t])=>!process.argv[3]||t===process.argv[3])){
 const ctx=await b.newContext(vp);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',r=>r.abort());
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/');await p.waitForTimeout(6000);await p.evaluate(()=>{const s=document.getElementById('splash');if(s)s.click()});await p.waitForTimeout(3000);
 const cdp=tag==='phone'?await ctx.newCDPSession(p):null;
 const drag=async(x0,y0,x1,y1)=>{if(!cdp){await p.mouse.move(x0,y0);await p.mouse.down();for(let i=1;i<=10;i++)await p.mouse.move(x0+(x1-x0)*i/10,y0+(y1-y0)*i/10);await p.mouse.up();}
  else{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x0,y:y0}]});for(let i=1;i<=10;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x0+(x1-x0)*i/10,y:y0+(y1-y0)*i/10}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})}await p.waitForTimeout(400)};
 // a screen point at a given wheel radius (in wheel units) straight right of the centre
 const pt=r=>p.evaluate(r=>{const R=document.getElementById('sv').getBoundingClientRect(),upp=VW/R.width;return [R.left+(V.x+r*V.k+VW/2)/upp,R.top+(V.y+VH/2)/upp]},r);
 const st=()=>p.evaluate(()=>({x:+V.x.toFixed(1),y:+V.y.toFixed(1),rot:+V.rot.toFixed(2),k:V.k}));
 ok(/drag to move it/.test(await p.evaluate(()=>document.getElementById('hint').textContent)),`${tag}: hint "${await p.evaluate(()=>document.getElementById('hint').textContent)}"`);
 // middle (ring 1–2) → move
 let a=await st(),[x,y]=await pt(140);await drag(x,y,x-60,y+40);let c=await st();
 ok(Math.abs(c.rot-a.rot)<.01&&Math.hypot(c.x-a.x,c.y-a.y)>20,`${tag}: drag the middle → moved (${a.x},${a.y}) → (${c.x},${c.y}), not turned`);
 await p.screenshot({path:`${OUT}/drag-${tag}-moved.png`});
 // edge (outermost ring) → turn — re-centred first: after moving, the outer ring may be cut off and then doesn't turn (Entry 197)
 await p.evaluate(()=>document.getElementById('zReset').click());await p.waitForTimeout(900);
 a=await st();[x,y]=await pt(430);await drag(x,y,x,y+80);c=await st();
 ok(Math.abs(c.rot-a.rot)>3&&Math.hypot(c.x-a.x,c.y-a.y)<.5,`${tag}: drag the edge → turned ${(c.rot-a.rot).toFixed(1)}°, not moved`);
 // beyond the wheel → turn too
 /* Entry 197: outside the wheel now moves it (tested in rotate_rail.js) */
 // ⟲ re-centres
 [x,y]=await pt(140);await drag(x,y,x-60,y+40);ok(!await p.evaluate(()=>document.getElementById('zReset').classList.contains('at')),`${tag}: after moving, ⟲ is active`);
 await p.evaluate(()=>document.getElementById('zReset').click());await p.waitForTimeout(1000);c=await st();
 ok(Math.hypot(c.x,c.y)<1&&await p.evaluate(()=>document.getElementById('zReset').classList.contains('at')),`${tag}: ⟲ → back in the middle (${c.x},${c.y})`);
 // zoomed in: move still works and zooming doesn't pull it back
 for(let i=0;i<5;i++){await p.evaluate(()=>document.getElementById('zIn').click());await p.waitForTimeout(30)}await p.waitForTimeout(500);
 [x,y]=await pt(60);await drag(x,y,x+90,y);a=await st();
 if(tag==='desktop'){await p.mouse.move(700,450);await p.keyboard.down('Control');await p.mouse.wheel(0,40);await p.keyboard.up('Control');await p.waitForTimeout(300)}
 c=await st();ok(Math.hypot(c.x,c.y)>40,`${tag}: zoomed in, moved, ${tag==='desktop'?'Ctrl+scroll':'still'} → stays off-centre (${c.x},${c.y})`);
 await p.screenshot({path:`${OUT}/drag-${tag}-zoomed-moved.png`});
 await p.evaluate(()=>document.getElementById('zReset').click());await p.waitForTimeout(1000);
 // a tap still snaps
 [x,y]=await pt(130);if(cdp)await p.touchscreen.tap(x,y);else await p.mouse.click(x,y);await p.waitForTimeout(1500);
 ok(await p.evaluate(()=>!!SNAP),`${tag}: a tap still opens that part of the wheel`);
 // snapped: drag still scrolls (doesn't move the wheel)
 a=await st();await drag(vp.viewport.width*.6,vp.viewport.height*.5,vp.viewport.width*.6,vp.viewport.height*.35);c=await st();
 ok(await p.evaluate(()=>!!SNAP),`${tag}: snapped drag keeps the snapped view`);
 if(tag==='desktop'){await p.evaluate(()=>document.getElementById('pWhole').click());await p.waitForTimeout(1200);
  [x,y]=await pt(150);await p.mouse.move(x,y);const c1=await p.evaluate(()=>document.getElementById('sv').style.cursor);[x,y]=await pt(440);await p.mouse.move(x,y);const c2=await p.evaluate(()=>document.getElementById('sv').style.cursor);
  ok(c1==='move'&&c2==='grab',`desktop: cursor move in the middle, grab at the edge (${c1}/${c2})`)}
 ok(errs.length===0,`${tag}: no errors ${errs.join(' | ')}`);await ctx.close()}
await b.close();console.log(fail?fail+' FAILED':'ALL PASS')})();
