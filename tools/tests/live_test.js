const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1400,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://127.0.0.1:8765/');await p.waitForTimeout(1000);await p.screenshot({path:S+'/mock/live-1.png'});
await p.waitForFunction(()=>window.__ready&&!document.getElementById('intro'),null,{timeout:15000});await p.screenshot({path:S+'/mock/live-2.png'});
// click the Ông Hai slice by its label text
const ok=await p.evaluate(()=>{const t=[...document.querySelectorAll('text')].find(x=>/Hai & Lịch/.test(x.textContent));if(!t)return 'no label';const path=[...document.querySelectorAll('path.node')].find(pp=>{const r=pp.getBoundingClientRect(),q=t.getBoundingClientRect();return q.x>r.x&&q.x<r.right&&q.y>r.y&&q.y<r.bottom&&r.width<600});if(!path)return 'no path';path.dispatchEvent(new MouseEvent('click',{bubbles:true}));return 'clicked'});
await p.waitForTimeout(2600);await p.screenshot({path:S+'/mock/live-3.png'});
const f=await b.newPage();await f.goto('file:///home/claude/hanh-family-tree/index.html');await f.waitForTimeout(800);const msg=await f.evaluate(()=>document.getElementById('stage').innerText);
console.log(ok,'| file:// →',msg.replace(/\n/g,' '),'| errors',errs);await b.close();})();
