const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage();
await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);
console.log(await p.evaluate(()=>{const out=[];
 for(let g=1;g<root.height;g++){
  const full=nodes.filter(d=>d.depth===g||d.depth===g+1).map(d=>(d.x1-d.x0)/d.data.members.length);
  const h=d3.hierarchy(root.data,d=>d.children&&d.children.length?d.children:null);
  h.each(d=>{if(d.depth===g+1) d.children=null});
  h.eachAfter(n=>{n.value=n.children?d3.sum(n.children,c=>c.value):n.data.members.length}); d3.partition().size([2*Math.PI,1])(h);
  const tr=h.descendants().filter(d=>d.depth===g||d.depth===g+1).map(d=>(d.x1-d.x0)/d.data.members.length);
  // screen font that fits the thinnest panel at snap zoom, at its inner radius
  const k=Math.min(1.6,(stage.clientWidth-24)/(TH/.7));
  const fit=a=>{let mn=1e9;nodes.forEach(()=>0);return mn};
  out.push(`gen ${g}+${g+1}: thinnest panel angle full=${Math.min(...full).toFixed(4)} two-band=${Math.min(...tr).toFixed(4)}  (×${(Math.min(...tr)/Math.min(...full)).toFixed(1)}), median ×${(d3.median(tr)/d3.median(full)).toFixed(1)}`)}
 return out.join('\n')}));await b.close();})();
