const {chromium}=require('playwright');const OUT=process.argv[2],TAG=process.argv[3]||'desktop';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext(VP);const p=await ctx.newPage();const errs=[];
 p.on('pageerror',e=>errs.push('ERR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console '+m.text())});
 const shot=async n=>{await p.screenshot({path:`${OUT}/minh-${TAG}-${n}.png`});console.log('shot',n)};
 const tap=async sel=>{if(TAG==='phone')await p.tap(sel);else await p.click(sel)};
 await p.goto('http://localhost:8765/minh/index.html');await p.waitForTimeout(6000);
 await p.mouse.click(200,200);await p.waitForTimeout(900);await shot('1-wheel');
 // tap the empty wheel → Simple view
 const sv=await p.$('#sv');const bb=await sv.boundingBox();await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);await p.waitForTimeout(2600);
 await p.waitForTimeout(1500);await shot('2-simple');
 const pen=async (who,root='#ssv')=>p.evaluateHandle(([w,r])=>[...document.querySelectorAll(r+' .pencil')].find(g=>g.querySelector('title').textContent==='Edit '+w),[who,root]);
 // edit the father
 console.log('pencils in simple',await p.$$eval('#ssv .pencil',e=>e.length));
 await (await pen('??')).asElement().click();await p.waitForTimeout(300);await shot('3-editor-father');
 await p.fill('#eF','');await p.type('#eF','Test Cha',{delay:10});
 await tap('#edSave');await p.waitForLoadState('load');await p.waitForTimeout(2500);await shot('4-after-save');
 // mother: name + add a daughter Thương
 await (await pen('??')).asElement().click();await p.waitForTimeout(300);
 await p.type('#eF','Test Mẹ',{delay:10});
 await p.click('#edRels [data-r="daughter"]');await p.type('#nF','thuong',{delay:30});await p.waitForTimeout(200);await shot('5-editor-daughter-suggest');
 const sg=await p.$('#nFs .sg');if(sg)await sg.click();await p.waitForTimeout(150);await shot('6-editor-daughter-picked');
 await tap('#edSave');await p.waitForLoadState('load');await p.waitForTimeout(2500);await shot('7-simple-thuong');
 // father: add a son after Thương
 await (await pen('Test Cha')).asElement().click();await p.waitForTimeout(300);await p.click('#edRels [data-r="son"]');await p.type('#nF','Test Con',{delay:10});await shot('8-editor-son');
 await tap('#edSave');await p.waitForLoadState('load');await p.waitForTimeout(2500);await shot('9-simple-two-kids');
 // side + top
 if(TAG==='phone'){await p.tap('#rHandle');await p.waitForTimeout(500)}
 await p.click('#pSide');await p.waitForTimeout(3500);await shot('10-side');
 if(TAG==='phone'){await p.tap('#rHandle');await p.waitForTimeout(500)}
 await p.click('#pTop');await p.waitForTimeout(3500);await shot('11-top');
 // pencil in top view → editor
 const fp=await p.$$('#fsv .pencil');console.log('pencils in top',fp.length);if(fp.length){await (await pen('Thương','#fsv')).asElement().click();await p.waitForTimeout(300);await shot('12-top-editor')}
 await p.keyboard.press('Escape');await p.waitForTimeout(200);
 if(TAG==='phone'){await p.tap('#rHandle');await p.waitForTimeout(500)}
 await p.click('#pWhole');await p.waitForTimeout(1500);await shot('13-wheel');
 console.log('stored',await p.evaluate(()=>JSON.stringify(MINH.DB.root)));
 console.log(errs.length?errs:'no errors');await b.close()})();
