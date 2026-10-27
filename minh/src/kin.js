// Kinship titles computed in the page (Minh's tree changes as people are added, so the table v2 reads from
// v2/src/kin.json is built here instead). A straight port of v1's relTitle (archive/v1-2026-10-26, Entries 23–27,
// 37, 39, 43); CENTRAL=true wording ("O"), as stored in kin.json — titleOf() swaps O → Cô when Miền Trung is off.
// Output has kin.json's shape: {cells, titles, M:{viewerCell:[titleIndex per cell]}}.
// Tree node shape (v2 build format): {n:[names], g:'MF', k:[cells], c:[children]}.
function buildKin(T){
  const nodes=[];
  (function walk(d,parent,depth){const n={data:d,parent,depth,children:[]};nodes.push(n);if(parent)parent.children.push(n);
    (d.c||[]).forEach(c=>walk(c,n,depth+1))})(T,null,0);
  const MN=new Map();   // cell → {n:node, i:member index}
  nodes.forEach(n=>n.data.k.forEach((c,i)=>MN.set(c,{n,i})));
  const anc=n=>{const a=[];while(n){a.push(n);n=n.parent}return a};
  const onPath=(lca,n)=>{while(n.parent&&n.parent!==lca)n=n.parent;return n};
  function relTitle(viewCell,cell){
    const V=MN.get(viewCell),X=MN.get(cell);if(!V||!X)return '';
    const nv=V.n,nx=X.n,spouse=X.i>0,g=nx.data.g[X.i],M=g==='M',F=g==='F';
    if(nx===nv)return spouse?(M?'Chồng':F?'Vợ':''):'';
    const A=new Set(anc(nv));let lca=nx;while(lca&&!A.has(lca))lca=lca.parent;if(!lca)return '';
    const up=nv.depth-lca.depth,down=nx.depth-lca.depth;
    const pn=nv.parent,side=pn&&pn.data.g[0]==='M'?'Nội':pn&&pn.data.g[0]==='F'?'Ngoại':'';
    const sib=()=>{const cs=lca.children,a=cs.indexOf(onPath(lca,nx)),b=cs.indexOf(onPath(lca,nv));return a<b?'older':'younger'};
    const bM=nx.data.g[0]==='M';
    if(down===0){
      if(up===1)return M?'Ba':F?'Má':'';
      if(up===2)return (M?'Ông ':F?'Bà ':'')+side;
      if(up===3)return (M?'Ông Cố ':F?'Bà Cố ':'')+side;
      if(up===4)return (M?'Ông Kỵ ':F?'Bà Kỵ ':'')+side;
      return '';
    }
    const gen=down-up;
    if(gen===0){const o=sib()==='older';if(!spouse)return o?(M?'Anh':F?'Chị':''):'Em';return o?(bM?'Chị Dâu':'Anh Rể'):(bM?'Em Dâu':'Em Rể')}
    if(gen>0){const base=(up===0&&gen===1)?'Con':(['','Cháu','Cháu','Chắt','Chút','Chít'][gen]||'');if(!base)return '';return spouse?(base+(M?' Rể':F?' Dâu':'')):base}
    if(gen===-1||gen===-2){const head=(gen===-1?nv.parent:nv.parent.parent).data,paternal=head.g[0]==='M';let w;
      if(!paternal)w=spouse?(bM?'Mợ':'Dượng'):(bM?'Cậu':'Dì');
      else if(sib()==='older')w='Bác';
      else w=spouse?(bM?'Thím':'Dượng'):(bM?'Chú':'O');
      if(gen===-1)return w;return (M?'Ông ':F?'Bà ':'')+w}
    if(gen===-3)return (M?'Ông Cố':F?'Bà Cố':'');
    return '';
  }
  const cells=[...MN.keys()],titles=[''],TI={'':0},M={};
  cells.forEach(v=>{const e=MN.get(v),view=e.i>0?e.n.data.k[0]:v;   // a spouse sees the family through their blood relative (v1)
    M[v]=cells.map(c=>{const t=relTitle(view,c).trim();if(!(t in TI)){TI[t]=titles.length;titles.push(t)}return TI[t]})});
  return {cells,titles,M};
}
if(typeof module!=='undefined')module.exports={buildKin};
