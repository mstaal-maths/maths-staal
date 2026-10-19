/* 6e — Chapitre 11 : Angles et triangles (cours et fiche d'exercices de M. Staal)
   Activité 1 : angles du triangle ABC mesurés sur la fiche (52°, 73°, 55°). Constructions corrigées par des figures calculées. */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const A = n => `<span class="ang">${n}</span>`;
const co = (p,alt,w) => img("c611co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c611ex/"+p+".png", alt, w);
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const fr = x => String(x).replace(".",",");
const COL = {b:"#1e5aa8", o:"#e08a00", g:"#1d7a46", r:"#d0342c"};

/* ---------- triangles en SVG ----------
   tri(P, o) : P = trois sommets en cm (repère mathématique, y vers le haut)
   o.n = noms, o.arc = [{i, t, c}] (angle au sommet i), o.right = [i], o.side = [{i,j,t}], o.ticks = [[i,j,nb]], o.k = px par cm */
function tri(P, o={}){
  const k=o.k||34, pad=o.pad||42;
  const xs=P.map(p=>p[0]), ys=P.map(p=>p[1]);
  const x0=Math.min(...xs), y1=Math.max(...ys);
  const W=(Math.max(...xs)-x0)*k+2*pad, H=(y1-Math.min(...ys))*k+2*pad;
  const S=P.map(p=>[pad+(p[0]-x0)*k, pad+(y1-p[1])*k]);
  const G=[(S[0][0]+S[1][0]+S[2][0])/3,(S[0][1]+S[1][1]+S[2][1])/3];
  const u=(a,b)=>{ const dx=b[0]-a[0], dy=b[1]-a[1], l=Math.hypot(dx,dy); return [dx/l,dy/l]; };
  const f=v=>v.toFixed(1);
  let s=`<svg class="fig" viewBox="0 0 ${f(W)} ${f(H)}" width="${Math.round(W)}" style="max-width:100%" role="img" aria-label="${o.alt||"Un triangle"}">`;
  (o.arc||[]).forEach(a=>{ const V=S[a.i], p=S[(a.i+1)%3], q=S[(a.i+2)%3], e1=u(V,p), e2=u(V,q), r=a.r||22, c=COL[a.c||"b"];
    const cr=e1[0]*e2[1]-e1[1]*e2[0];
    s+=`<path d="M${f(V[0])} ${f(V[1])} L${f(V[0]+r*e1[0])} ${f(V[1]+r*e1[1])} A${r} ${r} 0 0 ${cr>0?1:0} ${f(V[0]+r*e2[0])} ${f(V[1]+r*e2[1])} Z" style="fill:${c};fill-opacity:.2;stroke:none"/><path d="M${f(V[0]+r*e1[0])} ${f(V[1]+r*e1[1])} A${r} ${r} 0 0 ${cr>0?1:0} ${f(V[0]+r*e2[0])} ${f(V[1]+r*e2[1])}" style="fill:none;stroke:${c};stroke-width:2"/>`;
    if(a.t){ const bx=e1[0]+e2[0], by=e1[1]+e2[1], bl=Math.hypot(bx,by), ag=Math.acos(Math.max(-1,Math.min(1,e1[0]*e2[0]+e1[1]*e2[1])))*180/Math.PI, d=r+15+(ag<50?(50-ag)*0.8:0); s+=`<text x="${f(V[0]+d*bx/bl)}" y="${f(V[1]+d*by/bl+5)}" text-anchor="middle" style="font-size:13px;font-weight:700;fill:${c}">${a.t}</text>`; } });
  (o.right||[]).forEach(i=>{ const V=S[i], e1=u(V,S[(i+1)%3]), e2=u(V,S[(i+2)%3]), m=10;
    s+=`<path d="M${f(V[0]+m*e1[0])} ${f(V[1]+m*e1[1])} L${f(V[0]+m*e1[0]+m*e2[0])} ${f(V[1]+m*e1[1]+m*e2[1])} L${f(V[0]+m*e2[0])} ${f(V[1]+m*e2[1])}" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>`; });
  (o.ticks||[]).forEach(([i,j,nb])=>{ const a=S[i], b=S[j], e=u(a,b), n=[-e[1],e[0]], m=[(a[0]+b[0])/2,(a[1]+b[1])/2];
    for(let t=0;t<(nb||1);t++){ const o2=(t-((nb||1)-1)/2)*5; const c=[m[0]+o2*e[0], m[1]+o2*e[1]]; s+=`<line x1="${f(c[0]-6*n[0])}" y1="${f(c[1]-6*n[1])}" x2="${f(c[0]+6*n[0])}" y2="${f(c[1]+6*n[1])}" style="stroke:var(--ink);stroke-width:1.6"/>`; } });
  s+=`<polygon points="${S.map(p=>f(p[0])+","+f(p[1])).join(" ")}" style="fill:none;stroke:var(--ink);stroke-width:2.2;stroke-linejoin:round"/>`;
  (o.side||[]).forEach(({i,j,t})=>{ const a=S[i], b=S[j], m=[(a[0]+b[0])/2,(a[1]+b[1])/2], e=u(G,m), an=e[0]<-0.6?"end":e[0]>0.6?"start":"middle", dd=an==="middle"?15:8; s+=`<text x="${f(m[0]+dd*e[0])}" y="${f(m[1]+dd*e[1]+5)}" text-anchor="${an}" style="font-size:13px;fill:var(--ink)">${t}</text>`; });
  (o.n||[]).forEach((nm,i)=>{ const e=u(G,S[i]); s+=`<text x="${f(S[i][0]+15*e[0])}" y="${f(S[i][1]+15*e[1]+5)}" text-anchor="middle" style="font-size:15px;font-weight:700;fill:var(--ink)">${nm}</text>`; });
  return s+"</svg>";
}
/* triangle de base AB = c cm et d'angles a (en A) et b (en B) */
const fromASA = (c,a,b) => { const r=Math.PI/180, AC=c*Math.sin(b*r)/Math.sin((a+b)*r); return [[0,0],[c,0],[AC*Math.cos(a*r), AC*Math.sin(a*r)]]; };
/* triangle de côtés AB = c, AC = d et d'angle a en A */
const fromSAS = (c,d,a) => { const r=Math.PI/180; return [[0,0],[c,0],[d*Math.cos(a*r), d*Math.sin(a*r)]]; };
window.FIG11 = {tri, fromASA, fromSAS};

/* ---------- schémas ---------- */
const S_SOM = sch("La somme des angles", co("decoup","Les trois angles mis côte à côte forment un angle plat : 50° + 70° + 60° = 180°",400)+`<p class="schN">Dans un triangle, la somme des trois angles est égale à <b>180°</b>.</p>`);
const S_RED = sch("Rédiger le calcul", `<p class="calc">Dans le triangle EFG, la somme des angles est égale à 180°.<br>${A("FEG")} = 180° − (47° + 68°)<br>${A("FEG")} = 180° − 115°<br>${A("FEG")} = 65°</p>`);
const S_PART = sch("Les triangles particuliers", co("part","Triangles équilatéral, isocèle, rectangle et rectangle isocèle",440)+`<p class="schN">Équilatéral : 3 angles de 60°. Isocèle : les 2 angles à la base sont égaux. Rectangle : les 2 angles aigus font 90° à eux deux.</p>`);
const S_CONS = sch("Quels instruments ?", `<p class="schN">Trois longueurs : règle et compas. Un côté et les deux angles à ses extrémités, ou deux côtés et l'angle compris entre eux : règle et rapporteur.</p>`);

const red = (t, v, a, b, x) => `<p class="calc">Dans le triangle ${t}, la somme des angles est égale à 180°.<br>${A(x)} = 180° − (${fr(a)}° + ${fr(b)}°)<br>${A(x)} = 180° − ${fr(Math.round((a+b)*10)/10)}°<br>${A(x)} = <b>${fr(v)}°</b></p>`;
const E1 = [[50,60,70],[90,45,45],[100,50,40],[120,30,20],[60,60,60],[89,1,90]];

CH["6e-11"] = {
intro:"La somme des angles d'un triangle, calculer un angle en rédigeant, les angles des triangles particuliers et la construction d'un triangle avec la règle et le rapporteur.",
savoir:[
  "connaître la somme des mesures des angles d'un triangle ;",
  "calculer la mesure d'un angle d'un triangle, en rédigeant ;",
  "connaître les angles des triangles particuliers (équilatéral, isocèle, rectangle) ;",
  "construire un triangle connaissant un côté et deux angles, ou deux côtés et l'angle compris entre eux."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Les angles d'un triangle", h:`
  <div class="cpt"><div><p>Un triangle ABC a trois angles : ${A("BAC")} (de sommet A), ${A("ABC")} (de sommet B) et ${A("ACB")} (de sommet C).</p><p>L'angle ${A("BAC")} est <b>compris</b> entre les côtés [AB] et [AC] : ses deux côtés portent ces deux côtés du triangle.</p><p>Les angles ${A("BAC")} et ${A("ABC")} sont les deux angles situés <b>aux extrémités</b> du côté [AB].</p><p><b>Rappel :</b> pour nommer et mesurer un angle, revois le chapitre 9.</p></div>${co("tri","Le triangle ABC et ses trois angles",230)}</div>`},
{k:"II", t:"La somme des angles d'un triangle", h:`
  <h4>1. Découverte</h4>
  <p>On découpe les trois angles d'un triangle et on les place côte à côte, les sommets réunis : ils forment toujours un <b>angle plat</b>, qui mesure 180°.</p>
  ${co("decoup","Les trois angles mis côte à côte forment un angle plat : 50° + 70° + 60° = 180°",470)}
  <h4>2. Propriété</h4>
  <div class="retenir" data-l="Propriété"><p>Dans un triangle, la somme des mesures des trois angles est égale à <b>180°</b>.</p><p>Dans le triangle ABC : ${A("BAC")} + ${A("ABC")} + ${A("ACB")} = 180°.</p></div>
  <h4>3. Calculer la mesure d'un angle</h4>
  <p><b>Exemple :</b> EFG est un triangle tel que ${A("EFG")} = 47° et ${A("FGE")} = 68°. Calculer ${A("FEG")}.</p>
  <div class="cpt"><div class="retenir" data-l="Rédaction"><p>Dans le triangle EFG, la somme des angles est égale à 180°.</p><p class="calc">${A("FEG")} = 180° − (47° + 68°)<br>${A("FEG")} = 180° − 115°<br>${A("FEG")} = 65°</p></div>${co("calc","Le triangle EFG à main levée",200)}</div>
  <p class="attention"><b>ATTENTION :</b> sur une figure à main levée, on ne mesure pas : on calcule avec la propriété.</p>
  <p><b>Remarque :</b> un triangle ne peut pas avoir deux angles obtus, ni deux angles droits : la somme dépasserait 180°.</p>`},
{k:"III", t:"Les angles des triangles particuliers", h:`
  <div class="retenir" data-l="Propriété"><p>Si un triangle est <b>équilatéral</b>, alors ses trois angles mesurent 60° (car 180° ÷ 3 = 60°).</p></div>
  <div class="retenir" data-l="Propriété"><p>Si un triangle est <b>isocèle</b>, alors ses deux angles à la base ont la même mesure.</p><p>Dans le triangle ABC isocèle en A, A est le sommet principal, [BC] est la base, et ${A("ABC")} = ${A("ACB")}.</p></div>
  <div class="retenir" data-l="Propriété"><p>Si un triangle est <b>rectangle</b>, alors ses deux angles aigus ont pour somme 90° (car 180° − 90° = 90°). Un triangle rectangle isocèle a donc deux angles de 45°.</p></div>
  ${co("part","Triangles équilatéral, isocèle en A, rectangle en A et rectangle isocèle en A",480)}
  <p><b>Remarque :</b> inversement, un triangle qui a deux angles de même mesure est isocèle, et un triangle qui a trois angles de 60° est équilatéral.</p>
  <p><b>Exemple :</b> ABC est isocèle en A et ${A("ABC")} = 70°. Les angles à la base ont la même mesure, donc ${A("ACB")} = 70°. Puis ${A("BAC")} = 180° − (70° + 70°) = 180° − 140° = 40°.</p>`},
{k:"IV", t:"Construire un triangle", h:`
  <h4>1. Connaissant un côté et les deux angles à ses extrémités</h4>
  <p><b>Exemple :</b> construire le triangle ABC tel que AB = 5 cm, ${A("BAC")} = 40° et ${A("ABC")} = 60°.</p>
  <div class="cpt"><div class="retenir" data-l="Méthode"><ol><li>Je fais un dessin à main levée codé.</li><li>Je trace le côté connu : [AB] = 5 cm.</li><li>Avec le rapporteur, je trace en A une demi-droite qui forme un angle de 40° avec [AB].</li><li>En B, je trace une demi-droite qui forme un angle de 60° avec [BA], du même côté.</li><li>Les deux demi-droites se coupent en C.</li></ol></div>${co("c1","Le triangle ABC construit",220)}</div>
  <div class="anim" data-anim="6e11-triangle-cote-2-angles"></div>
  <p><b>Remarque :</b> si l'un des deux angles connus n'est pas au bout du côté connu, je calcule d'abord le troisième angle avec la somme des angles.</p>
  <h4>2. Connaissant deux côtés et l'angle compris entre eux</h4>
  <p><b>Exemple :</b> construire le triangle DEF tel que DE = 4,5 cm, DF = 3,5 cm et ${A("EDF")} = 110°.</p>
  <div class="cpt"><div class="retenir" data-l="Méthode"><ol><li>Je fais un dessin à main levée codé.</li><li>Je trace un des côtés connus : [DE] = 4,5 cm.</li><li>Avec le rapporteur, je trace en D une demi-droite qui forme un angle de 110° avec [DE].</li><li>Sur cette demi-droite, je place F tel que DF = 3,5 cm.</li><li>Je trace le côté [EF].</li></ol></div>${co("c2","Le triangle DEF construit",220)}</div>
  <div class="anim" data-anim="6e11-triangle-2-cotes-angle"></div>
  <h4>3. Bilan : quels instruments utiliser ?</h4>
  <div class="retenir" data-l="À retenir"><div class="scroll"><table class="std"><thead><tr><th>Je connais…</th><th>J'utilise…</th><th>Exemple</th></tr></thead><tbody><tr><td>les trois longueurs</td><td>la règle et le compas (chapitre 6)</td><td>AB = 5 cm, BC = 4 cm, AC = 3 cm</td></tr><tr><td>un côté et les deux angles à ses extrémités</td><td>la règle et le rapporteur</td><td>AB = 5 cm, ${A("BAC")} = 40°, ${A("ABC")} = 60°</td></tr><tr><td>deux côtés et l'angle compris entre eux</td><td>la règle et le rapporteur</td><td>DE = 4,5 cm, DF = 3,5 cm, ${A("EDF")} = 110°</td></tr></tbody></table></div></div>
  <p><b>Remarque :</b> avant toute construction, je fais un dessin à main levée sur lequel je place toutes les informations.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"La somme des angles d'un triangle", e:[
  {n:"Activité 1", t:"Une découverte", w:"Sur ta feuille", h:`<div class="cpt"><div><p>1) Mesure les trois angles du triangle ABC et complète : ${A("BAC")} = … ° · ${A("ABC")} = … ° · ${A("ACB")} = … ° · Somme : … + … + … = … °</p><p>2) Compare ta somme avec celles de tes voisins. Que remarques-tu ?</p><p>3) Trace un triangle sur une feuille, colorie ses trois angles et découpe-le. Déchire les trois coins et place-les côte à côte, les sommets réunis. Que forment-ils ?</p></div>${ex("act1","Le triangle ABC",230)}</div>`,
   c:`<p>1) Sur la fiche imprimée : ${A("BAC")} = <b>52°</b> ; ${A("ABC")} = <b>73°</b> ; ${A("ACB")} = <b>55°</b>. Somme : 52 + 73 + 55 = <b>180°</b>. <i>(À 1° près selon ta mesure.)</i></p><p>2) Tout le monde trouve environ <b>180°</b>, même avec des triangles différents.</p><p>3) Les trois coins forment un <b>angle plat</b> (180°).</p>${co("decoup","Les trois angles mis côte à côte forment un angle plat",380)}`},
  {n:"Exercice 1", t:"Possible ou impossible ?", w:"Sur ta feuille", h:`<p>Les trois nombres donnés peuvent-ils être les mesures des angles d'un triangle ? Complète le tableau.</p><div class="scroll"><table class="std"><thead><tr><th>Mesures des angles</th><th>Somme</th><th>Possible ?</th></tr></thead><tbody>${E1.map(m=>`<tr><td>${m.join("° ; ")}°</td><td></td><td></td></tr>`).join("")}</tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Mesures des angles</th><th>Somme</th><th>Possible ?</th></tr></thead><tbody>${E1.map(m=>{ const s=m[0]+m[1]+m[2]; return `<tr><td>${m.join("° ; ")}°</td><td>${s}°</td><td><b>${s===180?"oui":"non"}</b></td></tr>`; }).join("")}</tbody></table></div><p><i>Le dernier est possible : c'est un triangle rectangle (un angle de 90°), très « aplati ».</i></p>`},
  {n:"Exercice 2", t:"Calculer un angle", w:"Sur ta feuille", h:`<p>Calcule la mesure demandée. Rédige comme dans le cours.</p><p>a) ABC est un triangle tel que ${A("ABC")} = 35° et ${A("BCA")} = 85°. Calcule ${A("CAB")}.</p><p>b) MNP est un triangle tel que ${A("MNP")} = 112° et ${A("NPM")} = 27°. Calcule ${A("PMN")}.</p><p>c) RST est un triangle tel que ${A("RST")} = 90° et ${A("STR")} = 38°. Calcule ${A("TRS")}.</p><p>d) IJK est un triangle tel que ${A("IJK")} = 64,5° et ${A("JKI")} = 71,5°. Calcule ${A("KIJ")}.</p>`,
   c:`<p>a)</p>${red("ABC",60,35,85,"CAB")}<p>b)</p>${red("MNP",41,112,27,"PMN")}<p>c)</p>${red("RST",52,90,38,"TRS")}<p>d)</p>${red("IJK",44,64.5,71.5,"KIJ")}`},
  {n:"Exercice 3", t:"Des figures à main levée", w:"Sur ta feuille", h:`<p>Les figures sont faites à main levée : on ne mesure pas, on calcule. Trouve la mesure de chaque angle marqué « ? ».</p>${ex("e3","a) triangle ABC avec 72° et 48° ; b) triangle MNP rectangle en M avec 34° ; c) triangle RST avec deux angles de 25°",490)}`,
   c:`<p>a)</p>${red("ABC",60,72,48,"ACB")}<p>b) Le triangle est rectangle en M : ${A("NMP")} = 90°.</p>${red("MNP",56,90,34,"MPN")}<p>c)</p>${red("RST",130,25,25,"RTS")}`},
  {n:"Exercice 4", t:"Une erreur ?", w:"Sur ta feuille", h:`<p>Lina a mesuré les trois angles d'un triangle. Elle trouve 48°, 67° et 75°. A-t-elle fait une erreur ? Explique.</p>`,
   c:`<p>48 + 67 + 75 = 190. La somme des angles d'un triangle doit être égale à 180° : <b>Lina a fait une erreur</b> (d'au moins un angle, de 10° en tout).</p>`}
 ]},
{t:"Les angles des triangles particuliers", e:[
  {n:"Exercice 5", t:"Triangles particuliers", w:"Sur ta feuille", h:`<p>Les figures sont codées et faites à main levée. Calcule les mesures des angles demandés.</p>${ex("e5","a) ABC isocèle en A avec 50° en B ; b) KLM isocèle en L avec 100° en L ; c) RST équilatéral ; d) UVW rectangle isocèle en U",490)}<p>a) ${A("ACB")} et ${A("BAC")} · b) ${A("LKM")} et ${A("LMK")} · c) ${A("RST")}, ${A("STR")} et ${A("TRS")} · d) ${A("UVW")} et ${A("VWU")}</p>`,
   c:`<p>a) ABC est isocèle en A : ses angles à la base sont égaux, ${A("ACB")} = ${A("ABC")} = <b>50°</b>. Puis ${A("BAC")} = 180° − (50° + 50°) = <b>80°</b>.</p><p>b) KLM est isocèle en L : ${A("LKM")} = ${A("LMK")}. Ensemble, ils mesurent 180° − 100° = 80°, donc ${A("LKM")} = ${A("LMK")} = 80° ÷ 2 = <b>40°</b>.</p><p>c) RST est équilatéral : ${A("RST")} = ${A("STR")} = ${A("TRS")} = <b>60°</b>.</p><p>d) UVW est rectangle isocèle en U : ${A("UVW")} = ${A("VWU")} = (180° − 90°) ÷ 2 = <b>45°</b>.</p>`},
  {n:"Exercice 6", t:"Des problèmes", w:"Sur ta feuille", h:`<p>1) Un triangle isocèle a un angle de 120°. Quelles sont les mesures de ses deux autres angles ? Explique.</p><p>2) Un triangle isocèle a un angle de 70°. Il y a deux possibilités pour ses deux autres angles : trouve-les.</p><p>3) Dans un triangle rectangle, un des angles aigus mesure 27°. Combien mesure l'autre angle aigu ?</p>`,
   c:`<p>1) L'angle de 120° ne peut pas être un angle à la base : il y en aurait deux, et 120 + 120 = 240 &gt; 180. C'est donc l'angle au sommet principal. Les deux angles à la base mesurent (180° − 120°) ÷ 2 = <b>30° chacun</b>.</p><p>2) <b>Si 70° est l'angle au sommet principal :</b> les angles à la base mesurent (180° − 70°) ÷ 2 = <b>55° et 55°</b>.<br><b>Si 70° est un angle à la base :</b> l'autre angle à la base mesure aussi 70°, et le troisième 180° − 140° = <b>40°</b>. Les autres angles sont alors <b>70° et 40°</b>.</p><p>3) Les angles aigus d'un triangle rectangle ont pour somme 90° : 90° − 27° = <b>63°</b>.</p>`},
  {n:"Exercice 7", t:"Vrai ou faux ?", w:"Sur ta feuille", h:`<p>Réponds par vrai ou faux, puis justifie.</p><p>a) Un triangle rectangle peut avoir un angle obtus.</p><p>b) Un triangle qui a deux angles de 45° est rectangle isocèle.</p><p>c) Un triangle qui a trois angles de même mesure est équilatéral.</p><p>d) Un triangle peut avoir deux angles droits.</p>`,
   c:`<p>a) <b>Faux.</b> L'angle droit fait déjà 90° : les deux autres angles ont pour somme 90°, donc ils sont aigus.</p><p>b) <b>Vrai.</b> Le troisième angle mesure 180° − 90° = 90° : le triangle est rectangle ; et il a deux angles égaux : il est isocèle.</p><p>c) <b>Vrai.</b> Chaque angle mesure 180° ÷ 3 = 60° : un triangle qui a trois angles de 60° est équilatéral.</p><p>d) <b>Faux.</b> 90° + 90° = 180° : il ne resterait rien pour le troisième angle.</p>`},
  {n:"Exercice 8", t:"Défi", w:"Sur ta feuille", h:`<div class="cpt"><div><p>Sur cette figure à main levée, ABC est un triangle équilatéral et ACD est un triangle rectangle isocèle en C.</p><p>1) Quelle est la mesure de l'angle ${A("BAC")} ?</p><p>2) Quelle est la mesure de l'angle ${A("CAD")} ?</p><p>3) Déduis-en la mesure de l'angle ${A("BAD")}.</p><p>4) Calcule la mesure de l'angle ${A("BCD")}.</p><p>5) Explique pourquoi le triangle BCD est isocèle en C, puis calcule la mesure de l'angle ${A("CBD")}.</p></div>${ex("e8","ABC équilatéral, ACD rectangle isocèle en C",200)}</div>`,
   c:`<p>1) ABC est équilatéral : ${A("BAC")} = <b>60°</b>.</p><p>2) ACD est rectangle isocèle en C : ses angles aigus mesurent 45°, donc ${A("CAD")} = <b>45°</b>.</p><p>3) ${A("BAD")} = ${A("BAC")} + ${A("CAD")} = 60° + 45° = <b>105°</b>.</p><p>4) ${A("BCD")} = ${A("BCA")} + ${A("ACD")} = 60° + 90° = <b>150°</b>.</p><p>5) CB = CA (ABC est équilatéral) et CA = CD (ACD est isocèle en C), donc <b>CB = CD</b> : le triangle BCD est isocèle en C.</p><p>Ses angles à la base sont égaux : ${A("CBD")} = ${A("CDB")} = (180° − 150°) ÷ 2 = <b>15°</b>.</p>`}
 ]},
{t:"Construire un triangle", note:"Pour chaque construction, fais d'abord un dessin à main levée codé, puis construis le triangle en vraie grandeur sur ton cahier. <i>Les figures des corrections sont réduites.</i>", e:[
  {n:"Exercice 9", t:"Un côté et deux angles", w:"Sur ton cahier", h:`<p>a) Construis le triangle ABC tel que AB = 6 cm, ${A("BAC")} = 50° et ${A("ABC")} = 70°.</p><p>b) Construis le triangle RST tel que ST = 5 cm, ${A("RST")} = 35° et ${A("STR")} = 120°.</p><p>c) Construis un triangle équilatéral de côté 4 cm en utilisant seulement la règle et le rapporteur. Explique ta méthode.</p><p>d) Pour chaque triangle, mesure le troisième angle, puis vérifie ta mesure par un calcul.</p>`,
   c:`<div class="cgrid"><figure><figcaption>a) ${A("ACB")} = 180° − (50° + 70°) = <b>60°</b></figcaption>${tri(fromASA(6,50,70),{k:30,n:["A","B","C"],arc:[{i:0,t:"50°"},{i:1,t:"70°",c:"o"},{i:2,t:"60°",c:"g"}],side:[{i:0,j:1,t:"6 cm"}]})}</figure>
   <figure><figcaption>b) ${A("SRT")} = 180° − (35° + 120°) = <b>25°</b></figcaption>${tri(fromASA(5,35,120),{k:26,n:["S","T","R"],arc:[{i:0,t:"35°"},{i:1,t:"120°",c:"o"},{i:2,t:"25°",c:"g",r:30}],side:[{i:0,j:1,t:"5 cm"}]})}</figure>
   <figure><figcaption>c) Je trace [AB] de 4 cm, puis deux angles de <b>60°</b> en A et en B. Les demi-droites se coupent en C. Calcul : 180° − (60° + 60°) = 60°.</figcaption>${tri(fromASA(4,60,60),{k:34,n:["A","B","C"],arc:[{i:0,t:"60°"},{i:1,t:"60°",c:"o"},{i:2,t:"60°",c:"g"}],ticks:[[0,1,1],[1,2,1],[2,0,1]]})}</figure></div>`},
  {n:"Exercice 10", t:"Deux côtés et l'angle compris", w:"Sur ton cahier", h:`<p>a) Construis le triangle EFG tel que EF = 5 cm, EG = 4 cm et ${A("FEG")} = 75°.</p><p>b) Construis le triangle KLM tel que KL = 6 cm, KM = 6 cm et ${A("LKM")} = 40°. Quelle est la nature de ce triangle ? Calcule ses deux autres angles, puis vérifie en mesurant.</p><p>c) Construis le triangle PQR rectangle en P tel que PQ = 4 cm et PR = 3 cm. Mesure le côté [QR].</p>`,
   c:`<div class="cgrid"><figure><figcaption>a) [EF] de 5 cm, angle de 75° en E, puis G à 4 cm de E.</figcaption>${tri(fromSAS(5,4,75),{k:30,n:["E","F","G"],arc:[{i:0,t:"75°"}],side:[{i:0,j:1,t:"5 cm"},{i:2,j:0,t:"4 cm"}]})}</figure>
   <figure><figcaption>b) KL = KM : KLM est <b>isocèle en K</b>. ${A("KLM")} = ${A("KML")} = (180° − 40°) ÷ 2 = <b>70°</b>.</figcaption>${tri(fromSAS(6,6,40),{k:26,n:["K","L","M"],arc:[{i:0,t:"40°",r:30},{i:1,t:"70°",c:"o"},{i:2,t:"70°",c:"o"}],ticks:[[0,1,1],[0,2,1]]})}</figure>
   <figure><figcaption>c) On mesure <b>QR = 5 cm</b>.</figcaption>${tri(fromSAS(4,3,90),{k:34,n:["P","Q","R"],right:[0],side:[{i:0,j:1,t:"4 cm"},{i:2,j:0,t:"3 cm"},{i:1,j:2,t:"5 cm"}]})}</figure></div>`},
  {n:"Exercice 11", t:"Calculer avant de construire", w:"Sur ton cahier", h:`<p>On veut construire le triangle GHI tel que GH = 7 cm, ${A("GHI")} = 40° et ${A("HIG")} = 65°.</p><p>1) Pourquoi ne peut-on pas commencer directement la construction avec ces deux angles ?</p><p>2) Calcule la mesure de l'angle ${A("IGH")}, puis construis le triangle GHI.</p>`,
   c:`<p>1) L'angle ${A("HIG")} a pour sommet I, qui n'est pas une extrémité du côté connu [GH] : on ne sait pas où le tracer.</p><p>2) ${A("IGH")} = 180° − (40° + 65°) = 180° − 105° = <b>75°</b>. Je trace [GH] de 7 cm, un angle de 75° en G et un angle de 40° en H : les demi-droites se coupent en I.</p>${tri(fromASA(7,75,40),{k:26,n:["G","H","I"],arc:[{i:0,t:"75°"},{i:1,t:"40°",c:"o"},{i:2,t:"65°",c:"g"}],side:[{i:0,j:1,t:"7 cm"}]})}`},
  {n:"Exercice 12", t:"Une construction impossible ?", w:"Sur ton cahier", h:`<p>Tom essaie de construire le triangle ABC tel que AB = 5 cm, ${A("BAC")} = 100° et ${A("ABC")} = 85°. Il n'y arrive pas.</p><p>1) Essaie à ton tour. Que se passe-t-il ?</p><p>2) Explique, sans construire, pourquoi ce triangle n'existe pas.</p>`,
   c:`<p>1) Les deux demi-droites tracées en A et en B s'écartent l'une de l'autre : <b>elles ne se coupent pas</b>, on ne peut pas placer C.</p>
   <svg class="fig" viewBox="0 0 300 170" width="300" role="img" aria-label="Les demi-droites issues de A et de B s'écartent"><line x1="90" y1="140" x2="230" y2="140" class="ln"/><line x1="90" y1="140" x2="66" y2="4" style="stroke:#1e5aa8;stroke-width:2;stroke-dasharray:6 4"/><line x1="230" y1="140" x2="218" y2="4" style="stroke:#e08a00;stroke-width:2;stroke-dasharray:6 4"/><path d="M110 140 A20 20 0 0 0 86.5 120.3" style="fill:none;stroke:#1e5aa8;stroke-width:2"/><path d="M210 140 A20 20 0 0 1 228.3 120.1" style="fill:none;stroke:#e08a00;stroke-width:2"/><text x="80" y="160" style="font-size:15px;font-weight:700;fill:var(--ink)">A</text><text x="232" y="160" style="font-size:15px;font-weight:700;fill:var(--ink)">B</text><text x="96" y="118" style="font-size:13px;font-weight:700;fill:#1e5aa8">100°</text><text x="190" y="118" style="font-size:13px;font-weight:700;fill:#e08a00">85°</text><text x="160" y="160" text-anchor="middle" style="font-size:13px;fill:var(--ink)">5 cm</text></svg>
   <p>2) 100° + 85° = 185°. C'est déjà plus que 180°, alors que la somme des <b>trois</b> angles d'un triangle doit être égale à 180° : ce triangle n'existe pas.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"La somme des angles", schema:S_SOM, q:{
 1:[ {q:"Dans un triangle, la somme des trois angles est égale à…", c:["180°","90°","360°"], rep:"180°", sx:S_SOM},
     {g:()=>{ const a=ri(20,80), b=ri(20,80); return {q:`Un triangle a deux angles de ${a}° et ${b}°. Combien mesure le troisième (en °) ?`, rep:String(180-a-b), ex:`180 − (${a} + ${b}) = ${180-a-b}.`, sx:S_RED}; }} ],
 2:[ {g:()=>{ const a=ri(95,130), b=ri(10,180-a-10); return {q:`Dans le triangle ABC, ${A("ABC")} = ${a}° et ${A("BCA")} = ${b}°. Combien mesure ${A("CAB")} (en °) ?`, rep:String(180-a-b), ex:`180° − (${a}° + ${b}°) = 180° − ${a+b}° = ${180-a-b}°.`, sx:S_RED}; }},
     {g:()=>{ const m=shuf([ri(30,80),ri(30,80)]); const ok=pick([true,false]); const t=ok?180-m[0]-m[1]:180-m[0]-m[1]+pick([-10,10,20]); return {q:`Peut-on avoir un triangle dont les angles mesurent ${m[0]}°, ${m[1]}° et ${t}° ?`, c:["Oui","Non"], rep:ok?"Oui":"Non", ex:`${m[0]} + ${m[1]} + ${t} = ${m[0]+m[1]+t}.`, sx:S_SOM}; }} ],
 3:[ {q:"Un triangle peut-il avoir deux angles obtus ?", c:["Non","Oui"], rep:"Non", ex:"Deux angles obtus font déjà plus de 180°.", sx:S_SOM},
     {g:()=>{ const a=ri(40,80)+0.5, b=ri(30,60); return {q:`Un triangle a deux angles de ${fr(a)}° et ${b}°. Combien mesure le troisième (en °) ?`, rep:fr(180-a-b), ex:`180 − (${fr(a)} + ${b}) = ${fr(180-a-b)}.`, sx:S_RED}; }} ]
}},
{nom:"Triangles particuliers", schema:S_PART, q:{
 1:[ {q:"Combien mesure chaque angle d'un triangle équilatéral ?", c:["60°","90°","45°"], rep:"60°", sx:S_PART},
     {q:"Dans un triangle isocèle en A, quels angles sont égaux ?", c:[`${A("ABC")} et ${A("ACB")}`,`${A("BAC")} et ${A("ABC")}`,`${A("BAC")} et ${A("ACB")}`], rep:`${A("ABC")} et ${A("ACB")}`, ex:"Ce sont les angles à la base [BC].", sx:S_PART} ],
 2:[ {g:()=>{ const b=ri(30,80); return {q:`ABC est isocèle en A et ${A("ABC")} = ${b}°. Combien mesure ${A("BAC")} (en °) ?`, rep:String(180-2*b), ex:`${A("ACB")} = ${b}°, puis 180 − (${b} + ${b}) = ${180-2*b}.`, sx:S_PART}; }},
     {g:()=>{ const a=ri(15,75); return {q:`Un triangle rectangle a un angle aigu de ${a}°. Combien mesure l'autre angle aigu (en °) ?`, rep:String(90-a), ex:`90 − ${a} = ${90-a}.`, sx:S_PART}; }} ],
 3:[ {g:()=>{ const t=2*ri(10,70); return {q:`Un triangle isocèle a un angle au sommet principal de ${t}°. Combien mesure chaque angle à la base (en °) ?`, rep:String((180-t)/2), ex:`(180 − ${t}) ÷ 2 = ${(180-t)/2}.`, sx:S_PART}; }},
     {q:"Un triangle rectangle isocèle a deux angles de…", c:["45°","60°","30°"], rep:"45°", sx:S_PART},
     {q:"Un triangle a deux angles de 35°. Il est…", c:["isocèle","équilatéral","rectangle"], rep:"isocèle", ex:"Deux angles de même mesure : il est isocèle (le troisième mesure 110°).", sx:S_PART} ]
}},
{nom:"Construire un triangle", schema:S_CONS, q:{
 1:[ {q:"Je connais AB, BC et AC. Quels instruments j'utilise ?", c:["la règle et le compas","la règle et le rapporteur","l'équerre seule"], rep:"la règle et le compas", sx:S_CONS},
     {q:"Je connais AB et les angles en A et en B. Quels instruments j'utilise ?", c:["la règle et le rapporteur","la règle et le compas","le compas seul"], rep:"la règle et le rapporteur", sx:S_CONS} ],
 2:[ {q:"Que fait-on avant toute construction ?", c:["un dessin à main levée codé","une mesure des angles","un calcul d'aire"], rep:"un dessin à main levée codé", sx:S_CONS},
     {g:()=>{ const a=ri(30,70), b=ri(30,70); return {q:`On connaît GH, ${A("GHI")} = ${a}° et ${A("HIG")} = ${b}°. Quel angle faut-il calculer avant de construire (en °) ?`, c:shuf(uniq(`${A("IGH")} = ${180-a-b}°`,[`${A("IGH")} = ${a+b}°`,`${A("IGH")} = ${180-a}°`])), rep:`${A("IGH")} = ${180-a-b}°`, ex:"L'angle en I n'est pas au bout de [GH] : on calcule l'angle en G."}; }} ],
 3:[ {g:()=>{ const a=ri(95,120), b=ri(185-a,100); return {q:`Peut-on construire ABC avec AB = 5 cm, ${A("BAC")} = ${a}° et ${A("ABC")} = ${b}° ?`, c:["Non","Oui"], rep:"Non", ex:`${a} + ${b} = ${a+b}, plus que 180°.`}; }},
     {q:"Le triangle PQR est rectangle en P avec PQ = 4 cm et PR = 3 cm. Combien mesure QR ?", c:["5 cm","7 cm","6 cm"], rep:"5 cm", ex:"On le construit, puis on mesure."} ]
}}
]
};
})();
