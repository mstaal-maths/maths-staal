/* 5e — Chapitre 8 : Angles et parallélisme (cours et fiche d'exercices de M. Staal)
   Les figures dessinées en SVG sont calculées à partir des mesures : les angles dessinés sont exacts. */
(function(){
const VF=["Vrai","Faux"], ON=["Oui","Non"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const an = t => `<span class="ang">${t}</span>`;                 /* nom d'angle avec le grand chapeau */
const fr = x => String(Math.round(x*100)/100).replace(".",",");
const dg = x => fr(x)+"°";
const R = v => [String(v).replace(".",","), fr(v)+"°", fr(v)+" °"];   /* réponses acceptées pour une mesure */
const co = (p,alt,w) => img("5k8co/"+p+".png", alt, w);
const exi = (p,alt,w) => img("5k8ex/"+p+".png", alt, w);
const cr = (p,alt,w) => img("5k8cr/"+p+".png", alt, w);
const fig = (lab, body) => `<figure><figcaption>${lab}</figcaption>${body}</figure>`;

/* ------------------------------------------------------------------
   Dessin d'une figure d'angles (pixels, y vers le bas)
   o.pts {N:[x,y]} · o.segs [[P,Q]] segments tracés · o.arcs [[V,P,Q,couleur,texte]] angle VPQ colorié
   o.lab {N:[dx,dy]} position du nom du point · o.hide [noms] non écrits · o.txt [[x,y,texte]]
------------------------------------------------------------------ */
const OR="#f4c27a", BL="#bfd7ee", GR="#c9e5bc";
const rad = d => d*Math.PI/180;
const rot = (v,d) => { const c=Math.cos(rad(d)), s=Math.sin(rad(d)); return [v[0]*c-v[1]*s, v[0]*s+v[1]*c]; };
const add=(a,b)=>[a[0]+b[0],a[1]+b[1]], sub=(a,b)=>[a[0]-b[0],a[1]-b[1]], mul=(a,k)=>[a[0]*k,a[1]*k], nrm=a=>mul(a,1/Math.hypot(...a));
const angDeg = (V,P,Q) => { const u=sub(P,V), v=sub(Q,V); return Math.acos(Math.max(-1,Math.min(1,(u[0]*v[0]+u[1]*v[1])/(Math.hypot(...u)*Math.hypot(...v)))))*180/Math.PI; };
function af(o){
  const P=o.pts, r0=o.r||30, hide=new Set(o.hide||[]);
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9; const grow=(x,y)=>{ x0=Math.min(x0,x); y0=Math.min(y0,y); x1=Math.max(x1,x); y1=Math.max(y1,y); };
  Object.values(P).forEach(p=>grow(...p)); (o.txt||[]).forEach(t=>grow(t[0],t[1]));
  const m=o.m||30; x0-=m; y0-=m; x1+=m; y1+=m; const W=x1-x0, H=y1-y0;
  let s=`<svg class="fig" viewBox="${x0.toFixed(1)} ${y0.toFixed(1)} ${W.toFixed(1)} ${H.toFixed(1)}" width="${Math.min(o.w||W, W).toFixed(0)}" role="img" aria-label="${o.alt||"Figure"}">`;
  (o.arcs||[]).forEach(([v,p,q,col,t,rr])=>{ const V=P[v], u=nrm(sub(P[p],V)), w=nrm(sub(P[q],V)), r=rr||r0, cr=u[0]*w[1]-u[1]*w[0];
    const a=add(V,mul(u,r)), b=add(V,mul(w,r));
    s+=`<path d="M${V[0].toFixed(1)} ${V[1].toFixed(1)} L${a[0].toFixed(1)} ${a[1].toFixed(1)} A${r} ${r} 0 0 ${cr>0?1:0} ${b[0].toFixed(1)} ${b[1].toFixed(1)} Z" style="fill:${col};stroke:#222;stroke-width:1.4"/>`;
    if(t){ const bi=nrm(add(u,w)), d=r+17, c=add(V,mul(bi,d)); s+=`<text x="${c[0].toFixed(1)}" y="${(c[1]+5).toFixed(1)}" class="glab" text-anchor="middle" style="font-size:15px">${t}</text>`; } });
  (o.segs||[]).forEach(([p,q])=>{ s+=`<line x1="${P[p][0].toFixed(1)}" y1="${P[p][1].toFixed(1)}" x2="${P[q][0].toFixed(1)}" y2="${P[q][1].toFixed(1)}" class="ln"/>`; });
  Object.entries(P).forEach(([n,p])=>{ if(hide.has(n)) return; const d=(o.lab||{})[n]||[0,-14]; s+=`<text x="${(p[0]+d[0]).toFixed(1)}" y="${(p[1]+d[1]+6).toFixed(1)}" class="glab" text-anchor="middle" style="font-size:18px">${n}</text>`; });
  (o.txt||[]).forEach(([x,y,t])=>{ s+=`<text x="${x}" y="${y}" class="glab" text-anchor="middle" style="font-size:17px">${t}</text>`; });
  return s+"</svg>";
}

/* deux droites (AC) et (BD) sécantes en O : a = mesure de AOB */
function secF(a, arcs=[], o={}){ const O=[0,0], A=[-150,0], C=[150,0], B=mul(rot([-1,0],a),135), D=mul(B,-1);
  return af({pts:{A,B,C,D,O}, segs:[["A","C"],["B","D"]], arcs, lab:{A:[-14,0],C:[14,0],B:[-8,-12],D:[8,14],O:[0,20]}, w:o.w||320, alt:o.alt||"Droites (AC) et (BD) sécantes en O"}); }
/* A, O, C alignés ; AOB = a ; BOD = b */
function al3F(a, b, lb=[`${a}°`,`${b}°`,"?"], o={}){ const O=[0,0], A=[-170,0], C=[170,0], B=mul(rot([-1,0],a),150), D=mul(rot([-1,0],a+b),150);
  return af({pts:{A,B,C,D,O}, segs:[["A","C"],["O","B"],["O","D"]], arcs:[["O","A","B",OR,lb[0],46],["O","B","D",BL,lb[1],56],["O","D","C",GR,lb[2],66]], lab:{A:[-14,14],C:[14,14],O:[0,22],B:[-10,-10],D:[8,-12]}, w:o.w||360, alt:"Points A, O et C alignés et demi-droites [OB) et [OD)"}); }
/* deux droites (d) = (CD) et (d') = (EF) coupées par la sécante (ST) en A et B.
   t = mesure de DAB ; b = mesure de ABE (b = t : droites parallèles) */
const ANG = {SAD:["A","S","D"], DAB:["A","D","B"], BAC:["A","B","C"], SAC:["A","S","C"], ABF:["B","A","F"], FBT:["B","F","T"], EBT:["B","E","T"], ABE:["B","A","E"]};
function parF(t, arcs=[], o={}){ const b=o.b??t, H=o.H||150, u=[Math.cos(rad(t)), Math.sin(rad(t))];
  const A=[180,0], B=add(A,mul(u,H/Math.sin(rad(t)))), S=sub(A,mul(u,60)), T=add(B,mul(u,60));
  const c1=rot(mul(u,-1),b), c2=rot(mul(u,-1),-b), we=(c1[0]<c2[0]?c1:c2);           /* direction de [BE) */
  const C=[A[0]-170,0], D=[Math.max(A[0],B[0])+220,0], E=add(B,mul(we,Math.max(150,B[0]-A[0]+150))), F=sub(B,mul(we,220));
  const pts={A,B,C,D,E,F,S,T}; const arcL=arcs.map(([n,col,tx])=>[...ANG[n],col,tx]);
  const xr=Math.max(D[0],F[0])+34;
  return af({pts, segs:[["C","D"],["E","F"],["S","T"]], arcs:arcL, r:o.r||32, lab:{A:[24,-24],B:[-24,26],C:[0,-16],D:[0,-16],E:[0,20],F:[0,20],S:[-12,-6],T:[12,8]}, txt:[[xr,6,"(d)"],[xr,F[1]+6,"(d')"]], w:o.w||460, alt:o.alt||"Droites (d) et (d') coupées par une sécante"}); }
/* triangle ABC d'angles b en B et c en C ; o.xy : droite (xy) parallèle à (BC) passant par A */
function triF(b, c, arcs=[], o={}){ const L=o.L||300, tb=Math.tan(rad(b)), tc=Math.tan(rad(c)), x=L*tc/(tb+tc), y=-x*tb;
  const N=o.N||"ABC", pts={[N[1]]:[0,0],[N[2]]:[L,0],[N[0]]:[x,y]};
  const lab={[N[1]]:[-14,10],[N[2]]:[14,10],[N[0]]:[0,-16]}; const segs=[[N[1],N[2]],[N[2],N[0]],[N[0],N[1]]];
  if(o.xy){ pts.x=[x-170,y]; pts.y=[x+170,y]; segs.push(["x","y"]); lab.x=[-14,0]; lab.y=[14,0]; lab[N[0]]=[0,-18]; }
  return af({pts, segs, arcs, r:o.r||30, lab, w:o.w||360, alt:o.alt||"Triangle "+N}); }
window.ANG8 = {af, secF, al3F, parF, triF, angDeg, OR, BL, GR, ANG};

/* ===================== schémas (rappels en image) ===================== */
const S_VOC = sch("Adjacents, supplémentaires, opposés par le sommet", secF(55,[["O","A","B",OR,"55°"],["O","B","C",BL,"125°"],["O","C","D",OR,"55°"]],{w:260})+`<p class="schN">${an("AOB")} et ${an("BOC")} sont adjacents et supplémentaires : 55° + 125° = 180°.</p><p class="schN">${an("AOB")} et ${an("COD")} sont opposés par le sommet : ils ont la même mesure.</p>`);
const S_BIS = sch("La bissectrice", af({pts:{O:[0,0],A:[160,0],B:mul(rot([1,0],-35),150),C:mul(rot([1,0],-70),150)}, segs:[["O","A"],["O","B"],["O","C"]], arcs:[["O","A","B",OR,"35°",40],["O","B","C",BL,"35°",48]], lab:{O:[-12,8],A:[12,10],B:[12,-4],C:[6,-12]}, w:220})+`<p class="schN">[OB) partage ${an("AOC")} en deux angles de même mesure : ${an("AOB")} = ${an("BOC")} = ${an("AOC")} ÷ 2.</p>`);
const S_POS = sch("Alternes-internes et correspondants", parF(60,[["DAB",OR],["ABE",OR],["SAD",BL],["ABF",BL]],{w:330})+`<p class="schN">Orange : ${an("DAB")} et ${an("ABE")} sont alternes-internes (entre les droites, de part et d'autre de la sécante).</p><p class="schN">Bleu : ${an("SAD")} et ${an("ABF")} sont correspondants (même position).</p>`);
const S_PAR = sch("Parallélisme et égalité d'angles", `<p class="schN"><b>Si</b> (d) // (d'), <b>alors</b> les angles alternes-internes sont égaux et les angles correspondants sont égaux.</p><p class="schN"><b>Réciproque :</b> <b>si</b> les angles alternes-internes (ou correspondants) sont égaux, <b>alors</b> (d) // (d').</p>`);
const S_TRI = sch("Somme des angles d'un triangle", triF(53,72,[["A","B","C",OR,"55°"],["B","C","A",BL,"53°"],["C","A","B",GR,"72°"]],{w:260})+`<p class="calc">${an("BAC")} = 180° − 53° − 72° = 55°</p><p class="schN">La somme des trois angles d'un triangle est égale à 180°.</p>`);

/* figure de l'exercice 9 (énoncé redessiné à l'échelle : 48° et 65°) */
const F_EX9 = triF(48,65,[["A","x","B",BL,"48°"],["A","B","C",OR,""],["A","C","y",GR,"65°"],["B","C","A",BL,""],["C","A","B",GR,""]],{xy:true, w:380, alt:"Triangle ABC et droite (xy) parallèle à (BC) passant par A"});

/* questions du QCM sur les positions d'angles */
const PAIRS = [["DAB","ABE","alternes-internes"],["BAC","ABF","alternes-internes"],["SAD","ABF","correspondants"],["DAB","FBT","correspondants"],["BAC","EBT","correspondants"],["SAC","ABE","correspondants"],["SAD","BAC","opposés par le sommet"],["DAB","SAC","opposés par le sommet"],["ABF","EBT","opposés par le sommet"],["ABE","FBT","opposés par le sommet"]];
const posQ = (types) => { const p=pick(PAIRS.filter(x=>types.includes(x[2]))), t=ri(50,70);
  return {q:`Sur la figure, les angles ${an(p[0])} et ${an(p[1])} (en orange) sont :`, fig:parF(t,[[p[0],OR],[p[1],OR]],{w:380}), c:["alternes-internes","correspondants","opposés par le sommet"], rep:p[2],
    ex:p[2]==="alternes-internes"?"Ils sont entre les deux droites, de part et d'autre de la sécante.":p[2]==="correspondants"?"Ils sont du même côté de la sécante, dans la même position par rapport à chaque droite.":"Ils ont le même sommet et leurs côtés sont dans le prolongement l'un de l'autre.", sx:S_POS}; };

CH["5e-8"] = {
intro:"Les angles adjacents, supplémentaires et opposés par le sommet, la bissectrice, les angles alternes-internes et correspondants avec des droites parallèles, et la somme des angles d'un triangle.",
savoir:[
  "reconnaître et nommer des angles adjacents, supplémentaires, opposés par le sommet ;",
  "reconnaître des angles alternes-internes et des angles correspondants ;",
  "utiliser le parallélisme pour calculer un angle ou le démontrer ;",
  "connaître et démontrer la somme des angles d'un triangle ;",
  "calculer un angle d'un triangle et rédiger la justification."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Vocabulaire des angles", h:`
  <h4>1. Angles adjacents et angles supplémentaires</h4>
  <div class="retenir" data-l="Définition"><p>Deux angles sont <b>adjacents</b> s'ils ont le même sommet, un côté commun, et s'ils sont situés de part et d'autre de ce côté commun.</p><p>Deux angles sont <b>supplémentaires</b> quand la somme de leurs mesures est égale à 180°.</p></div>
  ${co("adj","Angles AOB et BOC adjacents",340)}
  <p>Les angles ${an("AOB")} et ${an("BOC")} sont adjacents : ils ont le même sommet O et le côté commun [OB).</p><p>Leur somme forme l'angle plat ${an("AOC")} : ils sont <b>supplémentaires</b>.</p>
  <h4>2. Angles opposés par le sommet</h4>
  <div class="retenir" data-l="Définition et propriété"><p>Deux angles sont <b>opposés par le sommet</b> quand ils ont le même sommet et que leurs côtés sont dans le prolongement l'un de l'autre.</p><p>Deux angles opposés par le sommet ont la <b>même mesure</b>.</p></div>
  ${co("opp","Angles AOB et COD opposés par le sommet",340)}
  <p>Les droites (AC) et (BD) se coupent en O.</p><p>Les angles ${an("AOB")} et ${an("COD")} sont opposés par le sommet : ${an("AOB")} = ${an("COD")}.</p>
  <h4>3. Bissectrice d'un angle</h4>
  <div class="retenir" data-l="Définition"><p>La <b>bissectrice</b> d'un angle est la demi-droite qui partage cet angle en deux angles de même mesure.</p></div>
  <p><b>Exemple :</b> si [OB) est la bissectrice de l'angle ${an("AOC")} de mesure 70°, alors ${an("AOB")} = ${an("BOC")} = 35°.</p>`},
{k:"II", t:"Angles et droites parallèles", h:`
  <h4>1. Angles alternes-internes et angles correspondants</h4>
  <p>Deux droites (d) et (d') sont coupées par une troisième droite, appelée <b>sécante</b>.</p>
  <div class="retenir" data-l="Définitions"><p>Deux angles sont <b>alternes-internes</b> quand ils sont situés de part et d'autre de la sécante, entre les deux droites.</p><p>Deux angles sont <b>correspondants</b> quand ils sont situés du même côté de la sécante, l'un entre les deux droites et l'autre à l'extérieur, dans la même position par rapport à chaque droite.</p></div>
  <div class="figs">${fig(`${an("DAB")} et ${an("ABE")} sont <b>alternes-internes</b>.`, co("alt","Angles alternes-internes DAB et ABE",380))}${fig(`${an("SAD")} et ${an("ABF")} sont <b>correspondants</b>.`, co("corr","Angles correspondants SAD et ABF",380))}</div>
  <h4>2. Parallélisme et égalité d'angles</h4>
  <div class="retenir" data-l="Propriétés"><p><b>Si</b> deux droites parallèles sont coupées par une sécante, <b>alors</b> les angles alternes-internes sont égaux et les angles correspondants sont égaux.</p><p><b>Réciproquement, si</b> deux droites coupées par une sécante forment des angles alternes-internes égaux (ou des angles correspondants égaux), <b>alors</b> ces deux droites sont parallèles.</p></div>
  <p><b>Exemple :</b> sur la figure, (d) // (d') et ${an("DAB")} = 60°.</p>
  <p>Les angles ${an("DAB")} et ${an("ABE")} sont alternes-internes, donc ${an("ABE")} = 60°.</p>
  <p>Les angles ${an("SAD")} et ${an("ABF")} sont correspondants, donc ${an("SAD")} = ${an("ABF")} = 120° (car ${an("DAB")} et ${an("SAD")} sont supplémentaires).</p>
  <div class="retenir" data-l="Méthode"><p>Pour justifier un calcul d'angle ou un parallélisme :</p><ol><li>j'identifie la sécante et les deux angles ;</li><li>je nomme la position des angles (alternes-internes ou correspondants) ;</li><li>je cite la propriété utilisée (<b>si</b> les droites sont parallèles, <b>alors</b> …, ou la réciproque) ;</li><li>je conclus.</li></ol></div>
  <div class="attention"><p><b>ATTENTION :</b> on ne peut utiliser « angles égaux » que si les droites sont <b>parallèles</b> (propriété).</p><p>Pour prouver qu'elles le sont, il faut d'abord connaître l'égalité des angles (réciproque).</p><p>On ne se fie jamais à l'aspect de la figure.</p></div>`},
{k:"III", t:"Somme des angles d'un triangle", h:`
  <h4>1. Propriété et démonstration</h4>
  <div class="retenir" data-l="Propriété"><p>Dans un triangle, la <b>somme des mesures des trois angles est égale à 180°</b>.</p></div>
  ${co("demo","Triangle ABC et droite (xy) parallèle à (BC) passant par A",330)}
  <p><b>Démonstration.</b> On trace la droite (xy) parallèle à (BC) passant par A.</p>
  <ul><li>${an("xAB")} = ${an("ABC")} (alternes-internes) ;</li><li>${an("yAC")} = ${an("ACB")} (alternes-internes) ;</li><li>${an("xAB")} + ${an("BAC")} + ${an("yAC")} = 180° (angle plat).</li></ul>
  <p>Donc ${an("ABC")} + ${an("BAC")} + ${an("ACB")} = 180°.</p>
  <h4>2. Calculer un angle d'un triangle</h4>
  <p><b>Exemple :</b> dans le triangle ABC, ${an("ABC")} = 53° et ${an("ACB")} = 72°. Calculer ${an("BAC")}.</p>
  <p>La somme des angles d'un triangle est égale à 180°, donc :</p><p class="calc">${an("BAC")} = 180° − 53° − 72° = 55°</p>
  <div class="retenir" data-l="Cas particuliers"><ul><li>Dans un triangle rectangle, les deux angles aigus ont une somme de 90°.</li><li>Dans un triangle équilatéral, les trois angles sont égaux et mesurent chacun 180° ÷ 3 = 60°.</li></ul></div>
  <p><b>À toi de jouer :</b> dans un triangle EFG, ${an("FEG")} = 48° et ${an("EFG")} = 95°.</p><p>Calcule ${an("EGF")} en justifiant.</p>
  <details><summary>Voir la correction</summary><div class="corr"><p>La somme des angles d'un triangle est égale à 180°, donc :</p><p class="calc">${an("EGF")} = 180° − 48° − 95° = 37°</p></div></details>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Vocabulaire des angles", e:[
  {n:"Exercice 1", t:"Reconnaître des angles", w:"Sur ta feuille", h:`<p>Les droites (AC) et (BD) se coupent en O.</p>${exi("e1","Droites (AC) et (BD) sécantes en O, angle AOB colorié",300)}
   <p><b>1)</b> Nomme un angle opposé par le sommet à ${an("AOB")} : …………</p><p>Nomme deux angles adjacents à ${an("AOB")} : ………… et …………</p>
   <p><b>2)</b> Complète : ${an("AOB")} et ${an("BOC")} sont ……………… car leur somme est égale à ………°.</p>
   <p><b>3)</b> Quelle est la nature de l'angle ${an("AOB")} ? ……………</p><p>Et celle de l'angle ${an("AOC")} ? ……………</p>`,
   c:`<p><b>1)</b> L'angle opposé par le sommet à ${an("AOB")} est <b>${an("COD")}</b>.</p><p>Les angles adjacents à ${an("AOB")} sont <b>${an("BOC")}</b> et <b>${an("DOA")}</b>.</p>
   <p><b>2)</b> ${an("AOB")} et ${an("BOC")} sont <b>supplémentaires</b> car leur somme est égale à <b>180°</b> (ils forment l'angle plat ${an("AOC")}).</p>
   <p><b>3)</b> L'angle ${an("AOB")} est un angle <b>aigu</b> (il mesure 50°).</p><p>L'angle ${an("AOC")} est un angle <b>plat</b>.</p>`},
  {n:"Exercice 2", t:"Calculer avec des angles supplémentaires", w:"Sur ton cahier", h:`<p>Calcule la mesure de chaque angle demandé et justifie.</p>
   <p><b>1)</b> Les droites (AC) et (BD) se coupent en O.</p><p>Calcule ${an("BOC")}, ${an("COD")} et ${an("DOA")}.</p>${exi("e2a","Droites (AC) et (BD) sécantes en O avec l'angle AOB de 65°",300)}
   <p><b>2)</b> Les points A, O et C sont alignés. Calcule ${an("DOC")}.</p>${al3F(38,59)}`,
   c:`<p><b>1)</b> ${an("AOB")} et ${an("BOC")} sont supplémentaires :</p><p class="calc">${an("BOC")} = 180° − 65° = 115°</p>
   <p>${an("COD")} et ${an("AOB")} sont opposés par le sommet : ${an("COD")} = ${an("AOB")} = <b>65°</b>.</p>
   <p>${an("DOA")} et ${an("BOC")} sont opposés par le sommet : ${an("DOA")} = ${an("BOC")} = <b>115°</b>.</p>
   <p><b>2)</b> Les trois angles forment l'angle plat ${an("AOC")} :</p><p class="calc">${an("DOC")} = 180° − 38° − 59° = 83°</p>`},
  {n:"Exercice 3", t:"La bissectrice", w:"Sur ta feuille", h:`<p>Dans chaque cas, [OB) est la bissectrice de l'angle ${an("AOC")}. Complète.</p>
   <p><b>a)</b> ${an("AOB")} = 34° donc ${an("AOC")} = ………°</p><p><b>b)</b> ${an("AOC")} = 112° donc ${an("BOC")} = ………°</p><p><b>c)</b> ${an("BOC")} = 27,5° donc ${an("AOC")} = ………°</p>`,
   c:`<p><b>a)</b> ${an("AOC")} = 2 × 34° = <b>68°</b></p><p><b>b)</b> ${an("BOC")} = 112° ÷ 2 = <b>56°</b></p><p><b>c)</b> ${an("AOC")} = 2 × 27,5° = <b>55°</b></p>`}
 ]},
{t:"Angles et droites parallèles", e:[
  {n:"Activité 1", t:"Mesurer des angles", w:"Sur ta feuille", h:`<p>Les droites (d) et (d') sont parallèles.</p><p>Utilise ton rapporteur sur la figure.</p>${exi("act1","Droites parallèles (d) et (d') coupées par la sécante (ST)",420)}
   <p><b>1)</b> Mesure ${an("DAB")} et ${an("ABE")}. Que remarques-tu ?</p><p><b>2)</b> Mesure ${an("SAD")} et ${an("ABF")}. Que remarques-tu ?</p>`,
   c:`<p><b>1)</b> ${an("DAB")} = 60° et ${an("ABE")} = 60° : ces angles alternes-internes sont <b>égaux</b>.</p>
   <p><b>2)</b> ${an("SAD")} = 120° et ${an("ABF")} = 120° : ces angles correspondants sont <b>égaux</b>.</p>`},
  {n:"Exercice 4", t:"Alternes-internes ou correspondants ?", w:"Sur ta feuille", h:`<p>Sur la figure, (d) // (d') et ${an("DAB")} = 60°. Complète le tableau.</p>${exi("e4","Droites parallèles (d) et (d'), angle DAB de 60°",420)}
   <div class="scroll"><table class="std"><thead><tr><th>Angle</th><th>Alterne-interne ou correspondant à ${an("DAB")} ?</th><th>Mesure</th></tr></thead><tbody><tr><td>${an("ABE")}</td><td></td><td></td></tr><tr><td>${an("FBT")}</td><td></td><td></td></tr><tr><td>${an("SAC")}</td><td></td><td></td></tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Angle</th><th>Position par rapport à ${an("DAB")}</th><th>Mesure</th></tr></thead><tbody><tr><td>${an("ABE")}</td><td>alterne-interne</td><td>60°</td></tr><tr><td>${an("FBT")}</td><td>correspondant</td><td>60°</td></tr><tr><td>${an("SAC")}</td><td>opposé par le sommet à ${an("DAB")}</td><td>60°</td></tr></tbody></table></div>`},
  {n:"Exercice 5", t:"Calculer des angles", w:"Sur ton cahier", h:`<p>Sur la figure, (d) // (d') et ${an("ABE")} = 70°.</p><p>Calcule ${an("DAB")}, ${an("SAD")} et ${an("ABF")} en justifiant chaque réponse.</p>${exi("e5","Droites parallèles (d) et (d'), angle ABE de 70°",420)}`,
   c:`<p>${an("DAB")} et ${an("ABE")} sont alternes-internes et (d) // (d'), donc ${an("DAB")} = ${an("ABE")} = <b>70°</b>.</p>
   <p>${an("DAB")} et ${an("SAD")} sont supplémentaires :</p><p class="calc">${an("SAD")} = 180° − 70° = 110°</p>
   <p>${an("SAD")} et ${an("ABF")} sont correspondants et (d) // (d'), donc ${an("ABF")} = ${an("SAD")} = <b>110°</b>.</p>`},
  {n:"Exercice 6", t:"Démontrer un parallélisme", w:"Sur ton cahier", h:`<p>Les droites (d) et (d') sont-elles parallèles ?</p><p>Justifie en nommant les angles utilisés.</p>
   <div class="figs">${fig("a)",exi("e6a","Figure a : angles de 75° et 75°",360))}${fig("b)",exi("e6b","Figure b : angles de 70° et 80°",360))}</div>`,
   c:`<p><b>a)</b> ${an("DAB")} et ${an("ABE")} sont alternes-internes et ${an("DAB")} = ${an("ABE")} = 75°.</p><p><b>Si</b> deux droites coupées par une sécante forment des angles alternes-internes égaux, <b>alors</b> elles sont parallèles.</p><p>Donc <b>(d) // (d')</b>.</p>
   <p><b>b)</b> ${an("DAB")} = 70° et ${an("ABE")} = 80° : ces angles alternes-internes ne sont pas égaux.</p><p>Si (d) et (d') étaient parallèles, ils seraient égaux : (d) et (d') ne sont <b>pas parallèles</b>.</p>`}
 ]},
{t:"Somme des angles d'un triangle", e:[
  {n:"Activité 2", t:"Mesurer les angles d'un triangle", w:"Sur ta feuille", h:`<p>Voici un triangle ABC.</p>${exi("act2","Triangle ABC",330)}
   <p><b>1)</b> Avec ton rapporteur, mesure ${an("BAC")}, ${an("ABC")} et ${an("ACB")}.</p><p><b>2)</b> Calcule la somme des trois angles. Que remarques-tu ?</p>`,
   c:`<p><b>1)</b> ${an("BAC")} = 61°, ${an("ABC")} = 52°, ${an("ACB")} = 67°.</p>
   <p><b>2)</b> 61° + 52° + 67° = 180° : la somme des angles du triangle vaut <b>180°</b> (aux erreurs de mesure près).</p>`},
  {n:"Exercice 7", t:"Calculer le troisième angle", w:"Sur ton cahier", h:`<p>Calcule le troisième angle de chaque triangle et rédige.</p>
   <p><b>a)</b> Dans le triangle ABC, ${an("ABC")} = 50° et ${an("ACB")} = 60°. Calcule ${an("BAC")}.</p>
   <p><b>b)</b> Dans le triangle DEG, ${an("DEG")} = 35° et ${an("DGE")} = 90°. Calcule ${an("EDG")}.</p>
   <p><b>c)</b> Dans le triangle GHI, ${an("HGI")} = 72° et ${an("GIH")} = 41°. Calcule ${an("GHI")}.</p>
   <p><b>d)</b> Dans le triangle JKL, ${an("JKL")} = 108° et ${an("JLK")} = 25°. Calcule ${an("KJL")}.</p>
   <p><b>e)</b> Dans le triangle MNO, ${an("NMO")} = 60° et ${an("MON")} = 60°. Calcule ${an("MNO")}.</p>
   <p><b>f)</b> Dans le triangle PQR, ${an("PQR")} = 123° et ${an("PRQ")} = 28°. Calcule ${an("QPR")}.</p>`,
   c:`<p>La somme des angles d'un triangle est égale à 180°, donc :</p>
   <p><b>a)</b> ${an("BAC")} = 180° − 50° − 60° = <b>70°</b></p><p><b>b)</b> ${an("EDG")} = 180° − 35° − 90° = <b>55°</b></p><p><b>c)</b> ${an("GHI")} = 180° − 72° − 41° = <b>67°</b></p>
   <p><b>d)</b> ${an("KJL")} = 180° − 108° − 25° = <b>47°</b></p><p><b>e)</b> ${an("MNO")} = 180° − 60° − 60° = <b>60°</b></p><p><b>f)</b> ${an("QPR")} = 180° − 123° − 28° = <b>29°</b></p>`},
  {n:"Exercice 8", t:"Triangles particuliers", w:"Sur ton cahier", h:`<p>Réponds en justifiant.</p>
   <p><b>1)</b> Le triangle RST est rectangle en R et ${an("RST")} = 37°. Calcule ${an("RTS")}.</p>
   <p><b>2)</b> Le triangle équilatéral UVW a trois angles égaux. Quelle est la mesure de chacun ?</p>
   <p><b>3)</b> Un triangle peut-il avoir deux angles obtus ? Justifie.</p>`,
   c:`<p><b>1)</b> La somme des angles du triangle vaut 180° :</p><p class="calc">${an("RTS")} = 180° − 90° − 37° = 53°</p>
   <p><b>2)</b> 180° ÷ 3 = 60° : chaque angle mesure <b>60°</b>.</p>
   <p><b>3)</b> <b>Non</b> : deux angles obtus mesurent chacun plus de 90°, donc leur somme dépasse 180°.</p><p>C'est impossible, puisque les trois angles ont pour somme 180°.</p>`},
  {n:"Exercice 9", t:"La configuration-clé", w:"Sur ton cahier", h:`<p>Dans le triangle ABC, la droite (xy) est parallèle à (BC).</p><p>On donne ${an("xAB")} = 48° et ${an("yAC")} = 65°. Réponds en justifiant.</p>${F_EX9}
   <p><b>1)</b> Calcule ${an("ABC")} et ${an("ACB")}.</p><p><b>2)</b> Calcule ${an("BAC")} de deux façons.</p>`,
   c:`${cr("e9c","Les angles de 48°, 65° et 67°",340)}
   <p><b>1)</b> (xy) // (BC) et ${an("xAB")}, ${an("ABC")} sont alternes-internes : ${an("ABC")} = ${an("xAB")} = <b>48°</b>.</p><p>De même, ${an("ACB")} = ${an("yAC")} = <b>65°</b>.</p>
   <p><b>2)</b> Avec l'angle plat ${an("xAy")} : ${an("BAC")} = 180° − ${an("xAB")} − ${an("yAC")} = 180° − 48° − 65° = <b>67°</b>.</p>
   <p>Avec le triangle : ${an("BAC")} = 180° − ${an("ABC")} − ${an("ACB")} = 180° − 48° − 65° = <b>67°</b>.</p>`},
  {n:"Exercice 10", t:"Pour aller plus loin : le triangle isocèle", w:"Sur ton cahier", h:`<p>On admet que dans un triangle isocèle, les deux angles situés à la base sont égaux.</p><p>Réponds en justifiant.</p>
   <p><b>1)</b> Le triangle ABC est isocèle en A et ${an("BAC")} = 40°. Calcule ${an("ABC")} et ${an("ACB")}.</p>
   <p><b>2)</b> Le triangle DEG est isocèle en D et ${an("DEG")} = 50°. Calcule ${an("DGE")} et ${an("EDG")}.</p>`,
   c:`<p><b>1)</b> ${an("ABC")} = ${an("ACB")} et ${an("ABC")} + ${an("ACB")} = 180° − 40° = 140°.</p><p>Donc ${an("ABC")} = ${an("ACB")} = 140° ÷ 2 = <b>70°</b>.</p>
   <p><b>2)</b> ${an("DGE")} = ${an("DEG")} = <b>50°</b>.</p><p class="calc">${an("EDG")} = 180° − 50° − 50° = 80°</p>`}
 ]}
],

/* ===================== QUIZ ===================== */
quiz:[
{nom:"Adjacents, supplémentaires, opposés par le sommet", schema:S_VOC, q:{
 1:[ {g:()=>{ const a=ri(30,80); return {q:`Les droites (AC) et (BD) se coupent en O et ${an("AOB")} = ${a}°. Combien mesure ${an("COD")} ?`, fig:secF(a,[["O","A","B",OR,a+"°"]],{w:300}), rep:R(a), ex:`${an("AOB")} et ${an("COD")} sont opposés par le sommet : ils ont la même mesure.`, sx:S_VOC}; }},
     {q:"Deux angles sont supplémentaires quand la somme de leurs mesures est égale à…", c:["180°","90°","360°"], rep:"180°", sx:S_VOC} ],
 2:[ {g:()=>{ const a=ri(25,85); return {q:`Les droites (AC) et (BD) se coupent en O et ${an("AOB")} = ${a}°. Combien mesure ${an("BOC")} ?`, fig:secF(a,[["O","A","B",OR,a+"°"]],{w:300}), rep:R(180-a), ex:`${an("AOB")} et ${an("BOC")} sont supplémentaires : 180° − ${a}° = ${180-a}°.`, sx:S_VOC}; }},
     {g:()=>{ const a=ri(20,160); return {q:`Deux angles sont supplémentaires. L'un mesure ${a}°. Combien mesure l'autre ?`, rep:R(180-a), ex:`180° − ${a}° = ${180-a}°.`, sx:S_VOC}; }},
     {q:`Les droites (AC) et (BD) se coupent en O. Les angles ${an("AOB")} et ${an("BOC")} sont :`, fig:secF(55,[["O","A","B",OR],["O","B","C",BL]],{w:300}), c:["adjacents","opposés par le sommet"], rep:"adjacents", ex:"Ils ont le même sommet O, le côté commun [OB), et sont de part et d'autre de ce côté.", sx:S_VOC} ],
 3:[ {g:()=>{ const a=ri(25,60), b=ri(30,70); return {q:`Les points A, O et C sont alignés. ${an("AOB")} = ${a}° et ${an("BOD")} = ${b}°. Combien mesure ${an("DOC")} ?`, fig:al3F(a,b), rep:R(180-a-b), ex:`Les trois angles forment l'angle plat ${an("AOC")} : 180° − ${a}° − ${b}° = ${180-a-b}°.`, sx:S_VOC}; }},
     {g:()=>{ const a=ri(25,85); return {q:`Les droites (AC) et (BD) se coupent en O et ${an("AOB")} = ${a}°. Combien mesure ${an("DOA")} ?`, fig:secF(a,[["O","A","B",OR,a+"°"]],{w:300}), rep:R(180-a), ex:`${an("DOA")} est opposé par le sommet à ${an("BOC")}, qui est supplémentaire de ${an("AOB")} : ${an("DOA")} = 180° − ${a}° = ${180-a}°.`, sx:S_VOC}; }} ]
}},
{nom:"La bissectrice", schema:S_BIS, q:{
 1:[ {g:()=>{ const a=ri(15,60); return {q:`[OB) est la bissectrice de ${an("AOC")} et ${an("AOB")} = ${a}°. Combien mesure ${an("AOC")} ?`, rep:R(2*a), ex:`${an("AOC")} = 2 × ${a}° = ${2*a}°.`, sx:S_BIS}; }} ],
 2:[ {g:()=>{ const a=2*ri(20,80); return {q:`[OB) est la bissectrice de ${an("AOC")} et ${an("AOC")} = ${a}°. Combien mesure ${an("BOC")} ?`, rep:R(a/2), ex:`${an("BOC")} = ${a}° ÷ 2 = ${a/2}°.`, sx:S_BIS}; }},
     {q:"La bissectrice d'un angle est la demi-droite qui…", c:["partage cet angle en deux angles de même mesure","est perpendiculaire à un côté de l'angle","prolonge un côté de l'angle"], rep:"partage cet angle en deux angles de même mesure", sx:S_BIS} ],
 3:[ {g:()=>{ const a=ri(10,60)+0.5; return {q:`[OB) est la bissectrice de ${an("AOC")} et ${an("BOC")} = ${fr(a)}°. Combien mesure ${an("AOC")} ?`, rep:R(2*a), ex:`${an("AOC")} = 2 × ${fr(a)}° = ${2*a}°.`, sx:S_BIS}; }},
     {g:()=>{ const a=2*ri(20,80)+1; return {q:`[OB) est la bissectrice de ${an("AOC")} et ${an("AOC")} = ${a}°. Combien mesure ${an("AOB")} ?`, rep:R(a/2), ex:`${an("AOB")} = ${a}° ÷ 2 = ${fr(a/2)}°.`, sx:S_BIS}; }} ]
}},
{nom:"Alternes-internes et correspondants", schema:S_POS, q:{
 1:[ {g:()=>posQ(["alternes-internes","correspondants"])},
     {q:"Deux angles situés de part et d'autre de la sécante, entre les deux droites, sont :", c:["alternes-internes","correspondants","opposés par le sommet"], rep:"alternes-internes", sx:S_POS} ],
 2:[ {g:()=>posQ(["alternes-internes","correspondants","opposés par le sommet"])},
     {q:"Deux angles situés du même côté de la sécante, dans la même position par rapport à chaque droite, sont :", c:["correspondants","alternes-internes","adjacents"], rep:"correspondants", sx:S_POS} ],
 3:[ {g:()=>{ const p=pick(PAIRS); return {q:`Sur la figure, les angles ${an(p[0])} et ${an(p[1])} sont :`, fig:parF(ri(50,70),[],{w:380}), c:["alternes-internes","correspondants","opposés par le sommet"], rep:p[2], ex:`Repère les deux angles sur la figure : ils sont ${p[2]}.`, sx:parF(60,[[p[0],OR],[p[1],OR]],{w:330})}; }} ]
}},
{nom:"Parallélisme et égalité d'angles", schema:S_PAR, q:{
 1:[ {g:()=>{ const t=ri(45,75); return {q:`(d) // (d') et ${an("DAB")} = ${t}°. Combien mesure ${an("ABE")} ?`, fig:parF(t,[["DAB",OR,t+"°"],["ABE",BL,"?"]],{w:380}), rep:R(t), ex:`${an("DAB")} et ${an("ABE")} sont alternes-internes et (d) // (d') : ils sont égaux.`, sx:S_PAR}; }},
     {g:()=>{ const t=ri(45,75); return {q:`(d) // (d') et ${an("DAB")} = ${t}°. Combien mesure ${an("FBT")} ?`, fig:parF(t,[["DAB",OR,t+"°"],["FBT",BL,"?"]],{w:380}), rep:R(t), ex:`${an("DAB")} et ${an("FBT")} sont correspondants et (d) // (d') : ils sont égaux.`, sx:S_PAR}; }} ],
 2:[ {g:()=>{ const t=ri(45,75); return {q:`(d) // (d') et ${an("DAB")} = ${t}°. Combien mesure ${an("ABF")} ?`, fig:parF(t,[["DAB",OR,t+"°"],["ABF",BL,"?"]],{w:380}), rep:R(180-t), ex:`${an("SAD")} = 180° − ${t}° = ${180-t}° (supplémentaires), et ${an("ABF")} = ${an("SAD")} (correspondants, (d) // (d')).`, sx:S_PAR}; }},
     {g:()=>{ const t=ri(45,75); return {q:`(d) // (d') et ${an("ABE")} = ${t}°. Combien mesure ${an("SAD")} ?`, fig:parF(t,[["ABE",OR,t+"°"],["SAD",BL,"?"]],{w:380}), rep:R(180-t), ex:`${an("DAB")} = ${an("ABE")} = ${t}° (alternes-internes), donc ${an("SAD")} = 180° − ${t}° = ${180-t}°.`, sx:S_PAR}; }} ],
 3:[ {g:()=>{ const t=ri(55,75), par=Math.random()<0.5, b=par?t:t+pick([-1,1])*ri(6,12); return {q:`Sur la figure, ${an("DAB")} = ${t}° et ${an("ABE")} = ${b}°. Les droites (d) et (d') sont-elles parallèles ?`, fig:parF(t,[["DAB",OR,t+"°"],["ABE",OR,b+"°"]],{b, w:380}), c:ON, rep:par?"Oui":"Non",
       ex:par?"Les angles alternes-internes sont égaux : d'après la réciproque, (d) // (d').":"Les angles alternes-internes ne sont pas égaux : si les droites étaient parallèles, ils seraient égaux.", sx:S_PAR}; }},
     {q:"Vrai ou faux : pour dire que deux angles alternes-internes sont égaux, il suffit que les droites « aient l'air » parallèles sur la figure.", c:VF, rep:"Faux", ex:"On ne se fie jamais à l'aspect de la figure : il faut savoir que les droites sont parallèles.", sx:S_PAR} ]
}},
{nom:"Somme des angles d'un triangle", schema:S_TRI, q:{
 1:[ {g:()=>{ const a=ri(30,80), b=ri(30,80); return {q:`Dans un triangle ABC, ${an("ABC")} = ${a}° et ${an("ACB")} = ${b}°. Combien mesure ${an("BAC")} ?`, rep:R(180-a-b), ex:`180° − ${a}° − ${b}° = ${180-a-b}°.`, sx:S_TRI}; }},
     {q:"Dans un triangle, la somme des mesures des trois angles est égale à…", c:["180°","90°","360°"], rep:"180°", sx:S_TRI} ],
 2:[ {g:()=>{ const a=ri(20,70); return {q:`Le triangle RST est rectangle en R et ${an("RST")} = ${a}°. Combien mesure ${an("RTS")} ?`, rep:R(90-a), ex:`180° − 90° − ${a}° = ${90-a}°.`, sx:S_TRI}; }},
     {g:()=>{ const a=ri(95,130), b=ri(15,180-a-15); return {q:`Dans un triangle PQR, ${an("PQR")} = ${a}° et ${an("PRQ")} = ${b}°. Combien mesure ${an("QPR")} ?`, rep:R(180-a-b), ex:`180° − ${a}° − ${b}° = ${180-a-b}°.`, sx:S_TRI}; }},
     {q:"Chaque angle d'un triangle équilatéral mesure :", c:["60°","90°","45°"], rep:"60°", ex:"180° ÷ 3 = 60°.", sx:S_TRI} ],
 3:[ {q:"Un triangle peut-il avoir deux angles obtus ?", c:ON, rep:"Non", ex:"Deux angles obtus mesurent chacun plus de 90° : leur somme dépasserait 180°.", sx:S_TRI},
     {g:()=>{ const a=2*ri(10,70); return {q:`Le triangle ABC est isocèle en A et ${an("BAC")} = ${a}°. Combien mesure ${an("ABC")} ?`, rep:R((180-a)/2), ex:`Les angles à la base sont égaux : (180° − ${a}°) ÷ 2 = ${(180-a)/2}°.`, sx:S_TRI}; }},
     {g:()=>{ const a=ri(25,80); return {q:`Le triangle DEG est isocèle en D et ${an("DEG")} = ${a}°. Combien mesure ${an("EDG")} ?`, rep:R(180-2*a), ex:`${an("DGE")} = ${an("DEG")} = ${a}°, donc ${an("EDG")} = 180° − ${a}° − ${a}° = ${180-2*a}°.`, sx:S_TRI}; }} ]
}}
]
};
})();
