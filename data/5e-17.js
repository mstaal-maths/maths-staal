/* 5e — Chapitre 17 : Algorithmique et programmation avec Scratch (cours, fiche d'exercices et corrigé de M. Staal)
   Les scripts sont redessinés en SVG avec les couleurs des blocs Scratch (plus nets que les captures du Word).
   Chaque tracé est obtenu en EXÉCUTANT le script (simulateur ci-dessous) : le dessin est exactement le résultat du programme. */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const r6 = x => Math.round(x*1e6)/1e6;
/* nombre à la française, signe moins « − » */
const F = x => { const r=Math.round(x*100)/100; const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const P = (x,y) => `(${F(x)} ; ${F(y)})`;

/* ------------------------------------------------------------------
   Blocs : {k:"hat"} {k:"pen"} {k:"av",n} {k:"td",n} (↻) {k:"tg",n} (↺) {k:"go",x,y} {k:"or",n} {k:"rep",n,b:[…]}
------------------------------------------------------------------ */
const HAT={k:"hat"}, PEN={k:"pen"};
const av=n=>({k:"av",n}), td=n=>({k:"td",n}), tg=n=>({k:"tg",n}), go=(x,y)=>({k:"go",x,y}), or=n=>({k:"or",n}), rep=(n,b)=>({k:"rep",n,b});
const TXT = b => ({hat:"quand le drapeau vert est cliqué", pen:"stylo en position d'écriture", av:`avancer de ${F(b.n)} pas`, td:`tourner ↻ de ${F(b.n)} degrés`, tg:`tourner ↺ de ${F(b.n)} degrés`,
  go:`aller à x : ${F(b.x)} y : ${F(b.y)}`, or:`s'orienter à ${F(b.n)} degrés`, rep:`répéter ${b.n} fois`})[b.k];
const COLB = {hat:["#FFBF00","#CC9900","#1b1b1b"], pen:["#0FBD8C","#0B9A72","#fff"], rep:["#FFAB19","#CF8B17","#fff"], mv:["#4C97FF","#3373CC","#fff"]};
const colOf = b => COLB[b.k] || COLB.mv;

/* script Scratch dessiné en SVG */
function script(blocks, o={}){
  const H=40, IND=24, BOT=18, flat=[];
  (function walk(L,d){ L.forEach(b=>{ flat.push([b,d]); if(b.k==="rep"){ walk(b.b,d+1); flat.push([{k:"end"},d]); } }); })(blocks,0);
  const textW = Math.max(...flat.filter(([b])=>b.k!=="end").map(([b,d])=>TXT(b).length*9.4+d*IND+32));
  const W = Math.ceil(Math.max(textW, 250)), list=[]; let y=4;
  flat.forEach(([b,d])=>{ const h=b.k==="end"?BOT:H; list.push([b,d,y,h]); y+=h; });
  let s=`<svg class="fig" viewBox="0 0 ${W+8} ${y+6}" width="${Math.round((W+8)*(o.k||0.9))}" role="img" aria-label="${o.alt||"Script Scratch : "+flat.filter(([b])=>b.k!=="end").map(([b])=>TXT(b)).join(", ")}">`;
  /* bras gauches des boucles (dessinés d'abord) */
  list.forEach(([b,d,y0],i)=>{ if(b.k!=="rep") return; let j=i+1, depth=1; while(depth){ if(list[j][0].k==="rep") depth++; if(list[j][0].k==="end" && list[j][1]===d) depth--; if(depth) j++; }
    const yEnd=list[j][2]; const [c,st]=COLB.rep; s+=`<rect x="${4+d*IND}" y="${y0+H-4}" width="${IND+2}" height="${yEnd-y0-H+8}" style="fill:${c};stroke:${st};stroke-width:1.5"/>`; });
  list.forEach(([b,d,y0,h])=>{ const x=4+d*IND, w=W-d*IND;
    if(b.k==="end"){ const [c,st]=COLB.rep; s+=`<rect x="${x}" y="${y0}" width="${w}" height="${h-2}" rx="5" style="fill:${c};stroke:${st};stroke-width:1.5"/>`; return; }
    const [c,st,tx]=colOf(b);
    s+=`<rect x="${x}" y="${y0}" width="${w}" height="${h-2}" rx="6" style="fill:${c};stroke:${st};stroke-width:1.5"/>`;
    s+=`<text x="${x+14}" y="${y0+H/2+4}" style="fill:${tx};font-weight:700;font-size:17px">${TXT(b)}</text>`; });
  return s+"</svg>";
}

/* exécution : renvoie les états successifs et les segments tracés (stylo baissé) */
const norm = d => { d=((d%360)+360)%360; if(d>180) d-=360; return r6(d); };
function run(blocks, st={x:0,y:0,dir:90}){
  const S={x:st.x, y:st.y, dir:st.dir, pen:!!st.pen}, segs=[], steps=[];
  (function exec(L){ L.forEach(b=>{
    if(b.k==="rep"){ for(let i=0;i<b.n;i++) exec(b.b); return; }
    if(b.k==="pen") S.pen=true;
    if(b.k==="av"){ const a=S.dir*Math.PI/180, x2=r6(S.x+b.n*Math.sin(a)), y2=r6(S.y+b.n*Math.cos(a)); if(S.pen) segs.push([S.x,S.y,x2,y2]); S.x=x2; S.y=y2; }
    if(b.k==="td") S.dir=norm(S.dir+b.n);
    if(b.k==="tg") S.dir=norm(S.dir-b.n);
    if(b.k==="go"){ if(S.pen) segs.push([S.x,S.y,b.x,b.y]); S.x=b.x; S.y=b.y; }
    if(b.k==="or") S.dir=norm(b.n);
    if(b.k!=="hat") steps.push({b, x:S.x, y:S.y, dir:S.dir});
  }); })(blocks);
  return {x:S.x, y:S.y, dir:S.dir, segs, steps};
}

/* tracé obtenu (repère : y vers le haut), quadrillage facultatif : o.g = nombre de pas par carreau */
function trace(blocks, o={}){
  const st=o.start||{x:0,y:0,dir:90}, R=run(blocks,st), segs=R.segs;
  const xs=[st.x,...segs.flatMap(s=>[s[0],s[2]])], ys=[st.y,...segs.flatMap(s=>[s[1],s[3]])];
  let x0=Math.min(...xs), x1=Math.max(...xs), y0=Math.min(...ys), y1=Math.max(...ys);
  const g=o.g||0; if(g){ x0=Math.floor(x0/g)*g-g; x1=Math.ceil(x1/g)*g+g; y0=Math.floor(y0/g)*g-g; y1=Math.ceil(y1/g)*g+g; }
  const span=Math.max(x1-x0,y1-y0,1), k=o.k||Math.min(2.4,(o.size||230)/span), mL=g?62:74, mT=g?14:24, mR=g?14:24, mB=g?14:24;
  const W=(x1-x0)*k+mL+mR, Hh=(y1-y0)*k+mT+mB, X=x=>(mL+(x-x0)*k).toFixed(1), Y=y=>(mT+(y1-y)*k).toFixed(1);
  let s=`<svg class="fig" viewBox="0 0 ${W.toFixed(0)} ${Hh.toFixed(0)}" width="${Math.round(W)}" role="img" aria-label="${o.alt||"Tracé laissé par le lutin"}">`;
  if(g){ s+=`<rect x="${X(x0)}" y="${Y(y1)}" width="${((x1-x0)*k).toFixed(1)}" height="${((y1-y0)*k).toFixed(1)}" style="fill:#fff"/>`;
    for(let x=x0;x<=x1+1e-9;x+=g) s+=`<line x1="${X(x)}" y1="${Y(y0)}" x2="${X(x)}" y2="${Y(y1)}" style="stroke:#b9cbe0;stroke-width:1"/>`;
    for(let y=y0;y<=y1+1e-9;y+=g) s+=`<line x1="${X(x0)}" y1="${Y(y)}" x2="${X(x1)}" y2="${Y(y)}" style="stroke:#b9cbe0;stroke-width:1"/>`; }
  segs.forEach(([a,b,c,d])=>{ s+=`<line x1="${X(a)}" y1="${Y(b)}" x2="${X(c)}" y2="${Y(d)}" style="stroke:#c00000;stroke-width:3.5;stroke-linecap:round"/>`; });
  s+=`<circle cx="${X(st.x)}" cy="${Y(st.y)}" r="6" style="fill:#1f4e79"/>`;
  if(o.dep!==false) s+=`<text x="${(+X(st.x)-9).toFixed(1)}" y="${(+Y(st.y)+(g?-9:6)).toFixed(1)}" style="text-anchor:end;font-size:15px;fill:#1f4e79${g?";paint-order:stroke;stroke:#fff;stroke-width:4":""}">départ</text>`;
  return s+"</svg>";
}
/* un bloc seul, en HTML (pour le tableau du cours) */
const blk = b => { const [c,st,tx]=colOf(b); return `<span style="display:inline-block;background:${c};border:1.5px solid ${st};color:${tx};border-radius:6px;padding:5px 12px;white-space:nowrap"><b>${TXT(b)}</b></span>`; };
/* les 4 directions */
function rose(w=200){
  const c=100, a=(x2,y2)=>{ const dx=x2-c, dy=y2-c, d=Math.hypot(dx,dy), ux=dx/d, uy=dy/d; return `<line x1="${c}" y1="${c}" x2="${x2}" y2="${y2}" style="stroke:#1f4e79;stroke-width:3.5"/><path d="M${x2+ux*2} ${y2+uy*2} L${x2-ux*12-uy*7} ${y2-uy*12+ux*7} L${x2-ux*12+uy*7} ${y2-uy*12-ux*7} Z" style="fill:#1f4e79"/>`; };
  return `<svg class="fig" viewBox="0 0 200 200" width="${w}" role="img" aria-label="Les directions : 0 vers le haut, 90 vers la droite, 180 vers le bas, −90 vers la gauche">${a(100,45)}${a(155,100)}${a(100,155)}${a(45,100)}<circle cx="100" cy="100" r="6" style="fill:#c00000"/>
   <text x="100" y="30" class="lab">0°</text><text x="160" y="105" style="font-size:15px">90°</text><text x="100" y="182" class="lab">180°</text><text x="40" y="105" style="font-size:15px;text-anchor:end">−90°</text></svg>`;
}
window.SCR = {HAT, PEN, av, td, tg, go, or, rep, TXT, script, run, trace, rose, F, P, norm};

/* ---------- scripts de la fiche (identiques aux captures du Word) ---------- */
const S_CARRE50 = [HAT, PEN, rep(4,[av(50),td(90)])];
const S_ACT1 = [HAT, PEN, av(100), td(90), av(50), td(90), av(100), td(90), av(50)];
const S_EX1 = [HAT, go(0,0), or(90), av(50), tg(90), av(30), td(180), av(80)];
const S_EX2a = [HAT, PEN, rep(3,[av(60),td(120)])];
const S_EX2b = [HAT, PEN, rep(4,[av(40),td(90)])];
const S_EX6 = [HAT, PEN, rep(4,[av(50),td(80)])];
const S_EX7A = [HAT, PEN, av(50), td(90), av(50)];
const S_EX7B = [HAT, PEN, td(90), av(50), av(50)];
const S_EX8 = [HAT, PEN, rep(5,[av(100),td(144)])];
const S_EX9 = [HAT, PEN, rep(2,[av(80),td(90),av(40),td(90)])];
const S_EX10 = [HAT, PEN, rep(4,[av(60),td(90)]), av(60), td(30), rep(3,[av(60),td(120)])];
const UP={x:0,y:0,dir:0}, RIGHT={x:0,y:0,dir:90};

/* tableau de l'exercice 1, calculé en exécutant le script */
const ex1Steps = run(S_EX1).steps.slice(2);
const ex1Head = `<thead><tr><th>Après le bloc…</th>${ex1Steps.map(s=>`<th>${TXT(s.b).replace(/ pas$| degrés$/,"")}</th>`).join("")}</tr></thead>`;

/* ---------- schémas (rappels en image) ---------- */
const S_DIR = sch("Position et direction du lutin", `<div class="figs">${rose(170)}</div><p class="schN">Position : coordonnées (<i>x</i> ; <i>y</i>). Le centre de la scène est (0 ; 0).</p><p class="schN">Direction : 90 vers la droite, 0 vers le haut, 180 vers le bas, −90 vers la gauche.</p>`);
const S_BLOCS = sch("Les blocs s'exécutent de haut en bas", `<p class="schN">« tourner ↻ » : sens des aiguilles d'une montre. « tourner ↺ » : sens inverse.</p><p class="schN">L'ordre des blocs compte : « avancer puis tourner » ne donne pas le même résultat que « tourner puis avancer ».</p>`);
const S_POLY = sch("Tracer un polygone régulier", `<div class="figs">${script(S_CARRE50,{k:0.75})}${trace(S_CARRE50,{start:RIGHT,size:110})}</div><p class="calc">répéter <i>n</i> fois : avancer de <i>c</i> pas, tourner de {360/n} degrés</p><p class="schN">Au total, le lutin fait un tour complet : 360°.</p>`);

/* ---------- outils du QCM ---------- */
const NOM = {3:"un triangle équilatéral",4:"un carré",5:"un pentagone régulier",6:"un hexagone régulier",8:"un octogone régulier"};
const DIRS = [[0,"vers le haut"],[90,"vers la droite"],[180,"vers le bas"],[-90,"vers la gauche"]];
const mkPath = () => { const L=[]; const k=ri(2,3); for(let i=0;i<k;i++){ L.push(av(10*ri(2,10))); if(i<k-1) L.push(pick([td,tg])(pick([90,90,180]))); } return L; };

CH["5e-17"] = {
intro:"Le lutin et la scène de Scratch (position, direction), les blocs de mouvement et le stylo, la boucle « répéter » pour tracer des polygones réguliers, et l'importance de l'ordre des blocs.",
savoir:[
  "lire, écrire et modifier un script simple fait de blocs de mouvement et de la boucle « répéter » ;",
  "prévoir la position et la direction d'un lutin ou le dessin obtenu par un script ;",
  "identifier les paramètres d'un script et les modifier pour obtenir un autre résultat ;",
  "tracer un polygone régulier avec Scratch."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Le lutin et la scène", h:`
  <div class="retenir" data-l="Vocabulaire"><p>Dans Scratch, un <b>lutin</b> se déplace sur la <b>scène</b>.</p><p>Sa <b>position</b> est repérée par ses coordonnées (<i>x</i> ; <i>y</i>). Le centre de la scène est le point (0 ; 0).</p><p>Sa <b>direction</b> est un nombre de degrés : 90 vers la droite, 0 vers le haut, 180 vers le bas, −90 vers la gauche.</p></div>
  <div class="figs">${rose()}</div>
  <div class="retenir" data-l="Définition"><p>Un <b>script</b> est une suite d'instructions (des <b>blocs</b> emboîtés).</p><p>Le lutin les exécute <b>de haut en bas</b>, dans l'ordre.</p><p>Les nombres que l'on écrit dans les blocs (nombre de pas, angle, nombre de répétitions…) sont les <b>paramètres</b> du script.</p><p>Le dessin ou le déplacement obtenu est son <b>résultat</b>.</p></div>`},
{k:"II", t:"Quelques blocs", h:`
  <div class="retenir" data-l="À retenir"><div class="scroll"><table class="std"><thead><tr><th>Bloc</th><th>Effet</th></tr></thead><tbody>
   <tr><td>${blk(av(50))}</td><td>le lutin avance de 50 pas dans sa direction</td></tr>
   <tr><td>${blk(td(90))}</td><td>il tourne de 90° dans le sens des aiguilles d'une montre (↺ : sens inverse)</td></tr>
   <tr><td>${blk(go(0,0))}</td><td>il se place au point de coordonnées (0 ; 0)</td></tr>
   <tr><td>${blk(or(90))}</td><td>il s'oriente vers la droite</td></tr>
   <tr><td>${blk(PEN)}</td><td>il laisse une trace en se déplaçant (« relever le stylo » : plus de trace)</td></tr>
   <tr><td>${blk(rep(4,[]))}</td><td>il répète 4 fois les blocs placés à l'intérieur</td></tr>
  </tbody></table></div></div>
  <p class="attention"><b>ATTENTION :</b> l'ordre des blocs compte. « Avancer puis tourner » ne donne pas le même résultat que « tourner puis avancer ».</p>`},
{k:"III", t:"Répéter pour tracer un polygone", h:`
  <div class="figs">${script(S_CARRE50)}${trace(S_CARRE50,{start:RIGHT,size:170,alt:"Carré de côté 50 pas"})}</div>
  <p>Ce script trace un <b>carré</b> de côté 50 pas : on avance de 50 pas puis on tourne de 90°, quatre fois.</p>
  <div class="retenir" data-l="Méthode"><p><b>1)</b> Pour tracer un <b>polygone régulier</b> à <i>n</i> côtés de longueur <i>c</i> : répéter <i>n</i> fois « avancer de <i>c</i> pas » puis « tourner de {360/n} degrés ».</p><p><b>2)</b> Le lutin fait au total un tour complet de 360°.</p></div>
  <p><b>Exemple :</b> triangle équilatéral : <i>n</i> = 3.</p><p>On tourne de 360 ÷ 3 = 120° (et non de 60°, qui est l'angle du triangle).</p>
  <p><b>À toi de jouer :</b> quels paramètres faut-il pour tracer un hexagone régulier de côté 40 pas ?</p>
  <details><summary>Voir la correction</summary><div class="corr"><p>Un hexagone a 6 côtés : répéter <b>6</b> fois « avancer de <b>40</b> pas » puis « tourner de 360 ÷ 6 = <b>60</b> degrés ».</p>${script([HAT,PEN,rep(6,[av(40),td(60)])],{k:0.75})}</div></details>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Lire et prévoir", e:[
  {n:"Activité 1", t:"Lire un script", w:"Sur ton cahier", h:`<p>Le lutin part de la position (0 ; 0), orienté vers le haut (direction 0).</p><p>Réponds sur ton cahier à petits carreaux (1 carreau pour 25 pas, soit 4 carreaux pour 100 pas).</p>${script(S_ACT1)}
   <p><b>1)</b> Dessine la trace laissée par le lutin.</p><p><b>2)</b> Quelle est la nature de la figure tracée ? Quels sont les paramètres de ce script ?</p>`,
   c:`${trace(S_ACT1,{start:UP,g:25,k:1.6,alt:"Rectangle de 100 pas sur 50 pas, 1 carreau pour 25 pas"})}<p><b>1)</b> Le lutin avance de 100 pas vers le haut, tourne vers la droite, avance de 50 pas.</p><p>Il tourne encore, avance de 100 pas vers le bas, tourne, et avance de 50 pas vers la gauche.</p><p><b>2)</b> C'est un <b>rectangle</b> de 100 pas sur 50 pas (le dernier virage n'est pas nécessaire pour tracer le dernier côté).</p><p>Les <b>paramètres</b> sont les longueurs (100 et 50) et l'angle (90°).</p>`},
  {n:"Exercice 1", t:"Position et direction", w:"Sur ta feuille", h:`<p>Le lutin exécute le script ci-dessous. Complète le tableau.</p><p>(La direction est un nombre de degrés : 90 vers la droite, 0 vers le haut, 180 vers le bas, −90 vers la gauche.)</p>${script(S_EX1)}
   <div class="scroll"><table class="std">${ex1Head}<tbody><tr><th>Position (<i>x</i> ; <i>y</i>)</th>${ex1Steps.map(()=>"<td></td>").join("")}</tr><tr><th>Direction</th>${ex1Steps.map(()=>"<td></td>").join("")}</tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std">${ex1Head}<tbody><tr><th>Position (<i>x</i> ; <i>y</i>)</th>${ex1Steps.map(s=>`<td><b>${P(s.x,s.y)}</b></td>`).join("")}</tr><tr><th>Direction</th>${ex1Steps.map(s=>`<td><b>${F(s.dir)}</b></td>`).join("")}</tr></tbody></table></div>
   <p>Le lutin part vers la droite, puis tourne vers le haut (↺ de 90°).</p><p>Puis il fait demi-tour (0 + 180 = 180) et descend de 80 pas : 30 − 80 = −50.</p>`},
  {n:"Exercice 2", t:"Quel dessin ?", w:"Sur ton cahier", h:`<p>Voici deux scripts. Le lutin part de (0 ; 0) orienté vers la droite (direction 90).</p><p>Pour chacun, dessine la trace obtenue (1 carreau pour 20 pas) et donne le nom de la figure.</p><div class="figs"><figure><figcaption>Script 1</figcaption>${script(S_EX2a)}</figure><figure><figcaption>Script 2</figcaption>${script(S_EX2b)}</figure></div>`,
   c:`<div class="figs"><figure><figcaption>Script 1</figcaption>${trace(S_EX2a,{start:RIGHT,g:20,k:2,alt:"Triangle équilatéral de côté 60 pas"})}</figure><figure><figcaption>Script 2</figcaption>${trace(S_EX2b,{start:RIGHT,g:20,k:2,alt:"Carré de côté 40 pas"})}</figure></div><p><b>Script 1 :</b> un <b>triangle équilatéral</b> de côté 60 pas (3 côtés égaux, rotation de 120°).</p><p><b>Script 2 :</b> un <b>carré</b> de côté 40 pas.</p>`},
  {n:"Exercice 3", t:"Compléter un script", w:"Sur ta feuille", h:`<p>Pour chaque figure, complète les paramètres du script.</p><p><b>a)</b> Un carré de côté 80 pas : répéter …… fois ; avancer de …… pas ; tourner de …… degrés.</p><p><b>b)</b> Un hexagone régulier de côté 40 pas : répéter …… fois ; avancer de …… pas ; tourner de …… degrés.</p><p><b>c)</b> Un triangle équilatéral de côté 100 pas : répéter …… fois ; avancer de …… pas ; tourner de …… degrés.</p>`,
   c:`<p><b>a)</b> répéter <b>4</b> fois ; avancer de <b>80</b> pas ; tourner de {360/4} = <b>90</b> degrés.</p><p><b>b)</b> répéter <b>6</b> fois ; avancer de <b>40</b> pas ; tourner de {360/6} = <b>60</b> degrés.</p><p><b>c)</b> répéter <b>3</b> fois ; avancer de <b>100</b> pas ; tourner de {360/3} = <b>120</b> degrés.</p>`}
 ]},
{t:"Modifier et analyser", e:[
  {n:"Exercice 4", t:"Les angles des polygones réguliers", w:"Sur ta feuille", h:`<p>Pour tracer un polygone régulier à <i>n</i> côtés, le lutin tourne de {360/n} degrés à chaque sommet. Complète le tableau.</p>
   <div class="scroll"><table class="std"><tbody><tr><th>Nombre de côtés <i>n</i></th>${[3,4,5,6,8,9,10,12].map(n=>`<td>${n}</td>`).join("")}</tr><tr><th>Angle de rotation (°)</th>${[3,4,5,6,8,9,10,12].map(()=>"<td></td>").join("")}</tr></tbody></table></div>
   <p>Que vaut la somme des angles de rotation du lutin pour un polygone régulier ? Réponds sur ton cahier.</p>`,
   c:`<div class="scroll"><table class="std"><tbody><tr><th>Nombre de côtés <i>n</i></th>${[3,4,5,6,8,9,10,12].map(n=>`<td>${n}</td>`).join("")}</tr><tr><th>Angle de rotation (°)</th>${[3,4,5,6,8,9,10,12].map(n=>`<td><b>${360/n}</b></td>`).join("")}</tr></tbody></table></div>
   <p>La somme est toujours <i>n</i> × {360/n} = <b>360°</b> : le lutin fait un tour complet.</p>`},
  {n:"Exercice 5", t:"Modifier les paramètres", w:"Sur ton cahier", h:`<p>Voici un script qui trace un carré de côté 50 pas.</p>${script(S_CARRE50)}<p>Indique les paramètres à modifier (et leurs nouvelles valeurs) pour obtenir :</p><p><b>a)</b> un carré de côté 100 pas ;</p><p><b>b)</b> un octogone régulier de côté 30 pas ;</p><p><b>c)</b> un triangle équilatéral de côté 70 pas ;</p><p><b>d)</b> un pentagone régulier de côté 60 pas.</p>`,
   c:`<p><b>a)</b> On remplace 50 par 100 : « avancer de <b>100</b> pas » (le reste ne change pas).</p><p><b>b)</b> « répéter <b>8</b> fois », « avancer de <b>30</b> pas », « tourner de {360/8} = <b>45</b> degrés ».</p><p><b>c)</b> « répéter <b>3</b> fois », « avancer de <b>70</b> pas », « tourner de <b>120</b> degrés ».</p><p><b>d)</b> « répéter <b>5</b> fois », « avancer de <b>60</b> pas », « tourner de {360/5} = <b>72</b> degrés ».</p>`},
  {n:"Exercice 6", t:"Trouver l'erreur", w:"Sur ton cahier", h:`<p>Camille veut tracer un carré de côté 50 pas. Voici son script.</p>${script(S_EX6)}<p><b>a)</b> Dessine la figure que trace réellement ce script (1 carreau pour 25 pas).</p><p><b>b)</b> Quelle erreur Camille a-t-elle commise ? Corrige son script.</p>`,
   c:`${trace(S_EX6,{start:RIGHT,g:25,size:240,alt:"Ligne brisée de 4 côtés de 50 pas, non fermée"})}<p><b>a)</b> La figure <b>n'est pas fermée</b> : le lutin tourne de 80° au lieu de 90°.</p><p>Après 4 côtés, il a tourné de 4 × 80 = 320° seulement : il n'est pas revenu à son point de départ.</p><p><b>b)</b> Il faut « tourner ↻ de <b>90</b> degrés » (car {360/4} = 90).</p>`},
  {n:"Exercice 7", t:"L'ordre des blocs", w:"Sur ton cahier", h:`<p>Le lutin part toujours de (0 ; 0), orienté vers la droite (direction 90).</p><p>Voici deux scripts : le script A et le script B.</p><div class="figs"><figure><figcaption>Script A</figcaption>${script(S_EX7A)}</figure><figure><figcaption>Script B</figcaption>${script(S_EX7B)}</figure></div><p><b>a)</b> Pour chaque script, donne la position finale du lutin.</p><p><b>b)</b> Les deux scripts contiennent les mêmes blocs. Que peut-on en conclure ?</p>`,
   c:`<p><b>a)</b> Script A : le lutin avance jusqu'en (50 ; 0), tourne vers le bas et avance de 50 pas.</p><p>Il termine en <b>${P(run(S_EX7A).x,run(S_EX7A).y)}</b>.</p><p>Script B : le lutin tourne d'abord vers le bas, puis avance de 100 pas.</p><p>Il termine en <b>${P(run(S_EX7B).x,run(S_EX7B).y)}</b>.</p><p><b>b)</b> <b>L'ordre des blocs compte</b> : avec les mêmes blocs dans un ordre différent, on n'obtient pas le même résultat.</p>`}
 ]},
{t:"Tracer des figures", e:[
  {n:"Exercice 8", t:"Une étoile", w:"Sur ton cahier", h:`<p>Le lutin part de (0 ; 0) orienté vers la droite. Voici un script :</p>${script(S_EX8)}<p><b>a)</b> Calcule l'angle total dont le lutin a tourné pendant le script. Combien cela fait-il de tours complets ?</p><p><b>b)</b> Prévois la figure obtenue, puis vérifie sur ordinateur avec Scratch.</p>`,
   c:`<p><b>a)</b> 5 × 144 = <b>720 degrés</b>, soit 720 ÷ 360 = <b>2 tours complets</b>.</p><p><b>b)</b> Le lutin trace une <b>étoile à cinq branches</b> (un pentagramme).</p><p>Il revient à son point de départ après deux tours.</p>${trace(S_EX8,{start:RIGHT,size:220,alt:"Étoile à cinq branches"})}`},
  {n:"Exercice 9", t:"Tracer un rectangle", w:"Sur ton cahier", h:`<p>Écris un script (avec la boucle « répéter ») qui trace un rectangle de 80 pas de longueur et de 40 pas de largeur.</p><p>Le lutin part orienté vers la droite. Vérifie ensuite ton script sur ordinateur.</p>`,
   c:`<div class="figs">${script(S_EX9)}${trace(S_EX9,{start:RIGHT,size:220,alt:"Rectangle de 80 pas sur 40 pas"})}</div><p>Il faut répéter <b>2 fois</b> les 4 blocs « avancer de 80 », « tourner de 90 », « avancer de 40 », « tourner de 90 ».</p><p>La longueur et la largeur ne sont pas égales, donc un seul « avancer » ne suffit pas.</p>`},
  {n:"Exercice 10", t:"Pour aller plus loin : la maison", w:"Sur ton cahier", h:`<p>On veut dessiner une maison : un carré de côté 60 pas surmonté d'un triangle équilatéral de même côté.</p><p>Le lutin part de (0 ; 0) orienté vers le haut (direction 0).</p><p><b>a)</b> Écris un script qui trace le carré. Dans quelle direction et à quel endroit le lutin se retrouve-t-il à la fin ?</p><p><b>b)</b> Complète le script pour tracer le triangle sur le dessus du carré, puis programme-le sur ordinateur.</p><p>(Indice : le côté du toit fait un angle de 60° avec le haut du carré.)</p>`,
   c:`<p><b>a)</b> « répéter 4 fois : avancer de 60 pas, tourner ↻ de 90 degrés ».</p><p>Le lutin revient en <b>${P(run(S_EX10.slice(0,3),UP).x,run(S_EX10.slice(0,3),UP).y)}</b> et regarde de nouveau <b>vers le haut</b> (direction ${F(run(S_EX10.slice(0,3),UP).dir)}) : il a fait un tour complet.</p>
   <p><b>b)</b> Après le carré : avancer de 60 pas (le lutin monte au coin du toit).</p><p>Tourner ↻ de 30° : il est alors orienté à 60° au-dessus de l'horizontale.</p><p>Puis répéter 3 fois « avancer de 60 pas, tourner ↻ de 120 degrés » : les deux côtés du toit, puis le dernier côté qui repasse sur le haut du carré.</p>
   <div class="figs">${script(S_EX10)}${trace(S_EX10,{start:UP,size:230,alt:"Maison : carré de côté 60 surmonté d'un triangle équilatéral"})}</div>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Le lutin et la scène", schema:S_DIR, q:{
 1:[ {g:()=>{ const d=pick(DIRS); return {q:`Le lutin est orienté ${d[1]}. Quelle est sa direction ?`, c:shuf(DIRS.map(x=>F(x[0]))), rep:F(d[0]), ex:"90 vers la droite, 0 vers le haut, 180 vers le bas, −90 vers la gauche.", sx:S_DIR}; }},
     {q:"Quelles sont les coordonnées du centre de la scène ?", c:["(0 ; 0)","(1 ; 1)","(90 ; 0)"], rep:"(0 ; 0)", ex:"Le centre de la scène est le point (0 ; 0).", sx:S_DIR} ],
 2:[ {g:()=>{ const x=10*ri(-10,10), y=10*ri(-10,10), d=pick(DIRS), n=10*ri(2,9); const B=[HAT,go(x,y),or(d[0]),av(n)], R=run(B);
       return {q:"Où se trouve le lutin à la fin du script ?", fig:script(B,{k:0.8}), t:"(□ ; □)", r:[F(R.x),F(R.y)], txt:true, ex:`Il part de ${P(x,y)}, orienté ${d[1]}, et avance de ${n} pas : il arrive en ${P(R.x,R.y)}.`, sx:S_DIR}; }} ],
 3:[ {g:()=>{ const d0=pick(DIRS), t=pick([td,tg]), a=pick([90,90,180]); const R=run([t(a)],{x:0,y:0,dir:d0[0]});
       return {q:`Le lutin est orienté ${d0[1]} (direction ${F(d0[0])}). Il exécute « ${TXT(t(a))} ». Quelle est sa nouvelle direction ?`, c:shuf(DIRS.map(x=>F(x[0]))), rep:F(R.dir), ex:`${t===td?"↻ : sens des aiguilles d'une montre":"↺ : sens inverse des aiguilles d'une montre"}. Il est maintenant orienté ${DIRS.find(x=>x[0]===R.dir)[1]}.`, sx:S_DIR}; }} ]
}},
{nom:"Quelques blocs", schema:S_BLOCS, q:{
 1:[ {q:"Quel bloc permet au lutin de laisser une trace en se déplaçant ?", c:["stylo en position d'écriture","s'orienter à 90 degrés","aller à x : 0 y : 0"], rep:"stylo en position d'écriture", ex:"Avec le stylo en position d'écriture, le lutin laisse une trace.", sx:S_BLOCS},
     {g:()=>{ const s=pick([["↻","dans le sens des aiguilles d'une montre"],["↺","dans le sens inverse des aiguilles d'une montre"]]); return {q:`Le bloc « tourner ${s[0]} de 90 degrés » fait tourner le lutin…`, c:["dans le sens des aiguilles d'une montre","dans le sens inverse des aiguilles d'une montre"], rep:s[1], ex:"↻ : sens des aiguilles d'une montre ; ↺ : sens inverse.", sx:S_BLOCS}; }} ],
 2:[ {g:()=>{ const B=[HAT,go(0,0),or(90),...mkPath()], R=run(B); return {q:"Où se trouve le lutin à la fin du script ?", fig:script(B,{k:0.8}), t:"(□ ; □)", r:[F(R.x),F(R.y)], txt:true, ex:`Les blocs s'exécutent de haut en bas : le lutin arrive en ${P(R.x,R.y)}.`, sx:S_BLOCS}; }} ],
 3:[ {g:()=>{ const n=10*ri(2,8), m=10*ri(2,8), t=pick([td,tg]); const A=[HAT,go(0,0),or(90),av(n),t(90),av(m)], B=[HAT,go(0,0),or(90),t(90),av(n),av(m)]; const which=pick(["A","B"]), S=which==="A"?A:B, R=run(S);
       const RA=run(A), RB=run(B), other=which==="A"?RB:RA;
       return {q:`Le lutin exécute ce script (script ${which}). Où arrive-t-il ?`, fig:script(S,{k:0.8}), c:shuf(uniq(P(R.x,R.y),[P(other.x,other.y),P(n+m,0),P(R.y,R.x)]).slice(0,3)), rep:P(R.x,R.y), ex:`L'ordre des blocs compte : ${which==="A"?`il avance d'abord de ${n} pas vers la droite, puis tourne`:`il tourne d'abord, puis avance de ${n} + ${m} = ${n+m} pas`}.`, sx:S_BLOCS}; }} ]
}},
{nom:"Polygones réguliers", schema:S_POLY, q:{
 1:[ {g:()=>{ const n=pick([3,4,5,6,8,9,10,12]); return {q:`Pour tracer un polygone régulier à ${n} côtés, de combien de degrés le lutin tourne-t-il à chaque sommet ?`, rep:String(360/n), ex:`360 ÷ ${n} = ${360/n}.`, sx:S_POLY}; }},
     {q:"Pour tracer un carré, de combien de degrés le lutin tourne-t-il à chaque sommet ?", c:["90","45","360"], rep:"90", ex:"360 ÷ 4 = 90.", sx:S_POLY} ],
 2:[ {g:()=>{ const n=pick([3,4,5,6,8]), c=10*ri(3,10); const B=[HAT,PEN,rep(n,[av(c),td(360/n)])]; return {q:"Quelle figure trace ce script ?", fig:script(B,{k:0.8}), c:shuf(uniq(NOM[n],shuf(Object.values(NOM))).slice(0,3)), rep:NOM[n], ex:`${n} côtés de ${c} pas, rotation de 360 ÷ ${n} = ${360/n}°.`, sx:trace(B,{start:RIGHT,size:140})}; }},
     {q:"Pour tracer un triangle équilatéral, de combien de degrés le lutin tourne-t-il à chaque sommet ?", c:["120","60","90"], rep:"120", ex:"360 ÷ 3 = 120° (et non 60°, qui est l'angle du triangle).", sx:S_POLY} ],
 3:[ {g:()=>{ const [n,a]=pick([[5,144],[8,135],[9,160],[10,108],[12,150]]); return {q:`Un script répète ${n} fois « avancer de 100 pas, tourner ↻ de ${a} degrés ». Combien de tours complets le lutin fait-il au total ?`, rep:String(n*a/360), ex:`${n} × ${a} = ${n*a} degrés, et ${n*a} ÷ 360 = ${n*a/360}.`, sx:trace([PEN,rep(n,[av(100),td(a)])],{start:RIGHT,size:140})}; }},
     {g:()=>{ const a=pick([70,80,100,110]); return {q:`Camille répète 4 fois « avancer de 50 pas, tourner ↻ de ${a} degrés ». Vrai ou faux : elle obtient un carré.`, c:VF, rep:"Faux", ex:`Elle tourne de 4 × ${a} = ${4*a}° au lieu de 360° : la figure n'est pas un carré.`, sx:trace([PEN,rep(4,[av(50),td(a)])],{start:RIGHT,size:140})}; }} ]
}}
]
};

/* clavier texte pour les réponses tapées (signe −) */
CH["5e-17"].quiz.forEach(N=>Object.values(N.q).forEach(list=>list.forEach((it,i)=>{
  if(it.g){ const g=it.g; list[i]={g:()=>Object.assign(g(),{kb:"text"})}; } else it.kb="text";
})));
})();
