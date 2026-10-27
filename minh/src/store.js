// Minh's tree (Entry 126). Step 1: kept in this browser only (localStorage); step 2 moves it to Supabase.
// Shape: {v:1, people:{id:{first,middle,last,alt,g,dead}}, root:{k:[ids], c:[nodes], m?:id}}
// A node is a family box: k[0] is the blood relative, k[1..] their spouses; c = children (oldest first);
// m = the child's other parent when the box above has 2+ spouses (v2's "mother" field, Entry 92).
// It starts with Thương's parents only, both unnamed (Hanh: "Thương's parents" in the centre, "completely blank").
const MINH=(function(){
  const KEY='hft-minh-v1',RK='hft-minh-restore';
  const blank=()=>({v:1,people:{p1:{first:'',middle:'',last:'',alt:'',g:'M',dead:false},p2:{first:'',middle:'',last:'',alt:'',g:'F',dead:false}},root:{k:['p1','p2'],c:[]}});
  let DB;try{DB=JSON.parse(localStorage.getItem(KEY))}catch(e){}
  if(!DB||!DB.root)DB=blank();
  let restore=null;try{restore=JSON.parse(sessionStorage.getItem(RK));sessionStorage.removeItem(RK)}catch(e){}
  const disp=p=>(p.first||'??')+(p.alt?' ('+p.alt+')':'');   // "??" = not named yet (the same mark the family sheet uses)
  const toT=n=>({n:n.k.map(id=>disp(DB.people[id])),g:n.k.map(id=>DB.people[id].g||'?').join(''),k:n.k.slice(),c:(n.c||[]).map(toT),...(n.m?{m:n.m}:{})});
  function find(id,n=DB.root,parent=null){const i=n.k.indexOf(id);if(i>=0)return {node:n,parent,i};for(const c of n.c||[]){const r=find(id,c,n);if(r)return r}return null}
  const newId=()=>'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  function save(state){DB.saved=new Date().toISOString();try{localStorage.setItem(KEY,JSON.stringify(DB));if(state)sessionStorage.setItem(RK,JSON.stringify(state))}catch(e){alert('Could not save in this browser: '+e.message);return false}return true}
  return {DB,restore,tree:()=>toT(DB.root),find,newId,save,disp,reset:()=>{localStorage.removeItem(KEY)}};
})();
