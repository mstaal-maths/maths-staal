/* 6e — Chapitre 13 : La symétrie axiale (cours et fiche d'exercices de M. Staal)
   Les corrections des figures sont obtenues en réfléchissant exactement ses figures par rapport à l'axe (sym13.py). */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const A = n => `<span class="ang">${n}</span>`;
const co = (p,alt,w) => img("c613co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c613ex/"+p+".png", alt, w);
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;

/* ---------- figure sur quadrillage ----------
   gsym({n, axe:{t:"v"|"h"|"d", k}, pts:[[x,y]…], sym:true}) — x vers la droite, y vers le bas, en carreaux.
   axe "v" : x = k ; "h" : y = k ; "d" : la diagonale y = x. */
const reflP = (p, ax) => ax.t==="v" ? [2*ax.k-p[0], p[1]] : ax.t==="h" ? [p[0], 2*ax.k-p[1]] : [p[1], p[0]];
function gsym(o){
  const n=o.n||10, c=o.c||24, pad=6, W=n*c+2*pad, ax=o.axe;
  let s=`<svg class="fig" viewBox="0 0 ${W} ${W}" width="${Math.min(W,o.w||W)}" style="max-width:100%" role="img" aria-label="${o.alt||"Figure sur quadrillage"}">`;
  for(let i=0;i<=n;i++){ s+=`<line x1="${pad+i*c}" y1="${pad}" x2="${pad+i*c}" y2="${pad+n*c}" style="stroke:#c9c9c9;stroke-width:1"/><line x1="${pad}" y1="${pad+i*c}" x2="${pad+n*c}" y2="${pad+i*c}" style="stroke:#c9c9c9;stroke-width:1"/>`; }
  const P = p => `${pad+p[0]*c},${pad+p[1]*c}`;
  const poly = (pts,col,fill) => `<polyline points="${pts.map(P).join(" ")}" style="fill:${fill||"none"};stroke:${col};stroke-width:3;stroke-linejoin:round;stroke-linecap:round"/>`;
  s += poly(o.pts, "#1f6db0", o.closed!==false?"rgba(31,109,176,.18)":"none");
  if(o.sym) s += poly(o.pts.map(p=>reflP(p,ax)), "#e07a00", o.closed!==false?"rgba(224,122,0,.18)":"none");
  if(o.dots) o.dots.forEach(([p,nm,col])=>{ const [x,y]=P(p).split(",").map(Number); s+=`<circle cx="${x}" cy="${y}" r="4.5" style="fill:${col||"var(--ink)"}"/><text x="${x+7}" y="${y-7}" style="font-size:15px;font-weight:700;fill:${col||"var(--ink)"}">${nm}</text>`; });
  const L = ax.t==="v" ? [[ax.k,-0.4],[ax.k,n+0.4]] : ax.t==="h" ? [[-0.4,ax.k],[n+0.4,ax.k]] : [[-0.3,-0.3],[n+0.3,n+0.3]];
  s += `<line x1="${pad+L[0][0]*c}" y1="${pad+L[0][1]*c}" x2="${pad+L[1][0]*c}" y2="${pad+L[1][1]*c}" style="stroke:#c00000;stroke-width:3"/>`;
  return s + "</svg>";
}
/* une figure fermée (bibliothèque de formes simples), placée d'un côté de l'axe ; u = distance à l'axe, v = position le long de l'axe */
const FORMES = [
  [[1,0],[2,0],[2,3],[4,3],[4,4],[1,4]],
  [[1,3],[3,1],[5,3],[5,6],[1,6]],
  [[1,2],[3,2],[3,0],[5,3],[3,6],[3,4],[1,4]],
  [[0,0],[1,0],[1,1],[2,1],[2,2],[3,2],[3,3],[0,3]],
  [[1,0],[4,0],[4,1],[3,1],[3,4],[2,4],[2,1],[1,1]],
  [[2,0],[4,2],[2,4],[3,5],[1,5],[0,2]],
  [[1,1],[4,0],[3,2],[4,5],[1,4]],
  [[0,1],[2,1],[2,0],[4,2],[2,4],[2,3],[0,3]] ];
function randFig(n, ax){
  for(let essai=0; essai<300; essai++){
    let f = pick(FORMES).map(p=>[...p]); if(Math.random()<.5){ const mv=Math.max(...f.map(p=>p[1])); f=f.map(([u,v])=>[u,mv-v]); }
    const mu=Math.max(...f.map(p=>p[0])), mv=Math.max(...f.map(p=>p[1]));
    let pts;
    if(ax.t==="v"){ const o=ri(0,Math.max(0,ax.k-mu)-0)*0, ov=ri(0,n-mv); const g=ri(0,1); pts=f.map(([u,v])=>[ax.k-u-g, v+ov]); }
    else if(ax.t==="h"){ const ov=ri(0,n-mv), g=ri(0,1); pts=f.map(([u,v])=>[v+ov, ax.k-u-g]); }
    else { const ox=ri(0,n), oy=ri(0,n); pts=f.map(([u,v])=>[v+ox-mv, u+oy]); }
    const r=pts.map(p=>reflP(p,ax)), inG=q=>q.every(p=>p[0]>=0&&p[0]<=n&&p[1]>=0&&p[1]<=n);
    if(!inG(pts)||!inG(r)) continue;
    if(ax.t==="d" && !pts.every(p=>p[1]>=p[0])) continue;
    return [...pts, pts[0]];
  }
  return ax.t==="h"?[[1,3],[3,3],[3,1],[1,3]]:ax.t==="v"?[[3,1],[3,3],[1,3],[3,1]]:[[0,2],[1,4],[0,4],[0,2]];
}
window.FIG13 = {gsym, randFig, reflP};

/* ---------- schémas ---------- */
const S_FIG = sch("Figures symétriques", co("fig","Deux figures symétriques par rapport à la droite (d) sur un quadrillage",300)+`<p class="schN">Elles se superposent par pliage le long de l'axe. Chaque point et son symétrique sont à la même distance de l'axe.</p>`);
const S_DEF = sch("Le symétrique d'un point", co("def","A et A' symétriques par rapport à (d)",240)+`<p class="schN">(d) est la <b>médiatrice</b> de [AA'] : (AA') ⊥ (d), et (d) coupe [AA'] en son milieu.</p>`);
const S_PROP = sch("Ce que conserve la symétrie", co("prop","Segment, cercle et angle et leurs symétriques",420)+`<p class="schN">Les longueurs, les angles, l'alignement, les périmètres et les aires sont conservés.</p>`);
const S_AXES = sch("Axes de symétrie des figures usuelles", co("usu","Axes de symétrie des figures usuelles",440));

const fig = (ax,pts,sym,o={}) => gsym(Object.assign({n:8,c:22,axe:ax,pts,sym},o));

CH["6e-13"] = {
intro:"Reconnaître des figures symétriques, construire le symétrique d'un point (équerre et compas, ou compas seul) et d'une figure, utiliser les propriétés de la symétrie et trouver les axes de symétrie d'une figure.",
savoir:[
  "reconnaître deux figures symétriques par rapport à une droite ;",
  "construire le symétrique d'un point, à la règle et à l'équerre, ou au compas ;",
  "construire le symétrique d'une figure en utilisant les propriétés de la symétrie ;",
  "trouver les axes de symétrie d'une figure."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Figures symétriques par rapport à une droite", h:`
  <div class="cpt"><div><p>Les deux figures ci-contre se superposent quand on plie la feuille le long de la droite (d).</p><div class="retenir" data-l="Définition"><p>On dit qu'elles sont <b>symétriques par rapport à la droite (d)</b>. La droite (d) s'appelle l'<b>axe de symétrie</b>.</p></div><p><b>Rappel :</b> sur un quadrillage, on compte les carreaux de part et d'autre de l'axe : chaque point et son symétrique sont à la même distance de l'axe.</p></div>${co("fig","Deux figures symétriques par rapport à la droite (d)",280)}</div>
  <div class="anim" data-anim="6e13-sym-quadrillage"></div>`},
{k:"II", t:"Le symétrique d'un point", h:`
  <h4>1. Définition</h4>
  <div class="cpt"><div><div class="retenir" data-l="Définition"><p>Le symétrique d'un point A par rapport à une droite (d) est le point A' tel que la droite (d) est la <b>médiatrice</b> du segment [AA'] (voir le chapitre 6).</p></div><p>Cela veut dire que :</p><ul><li>les droites (AA') et (d) sont perpendiculaires ;</li><li>la droite (d) coupe le segment [AA'] en son milieu.</li></ul><p><b>Remarque :</b> si un point est sur la droite (d), son symétrique est le point lui-même.</p></div>${co("def","A et A' symétriques par rapport à (d)",210)}</div>
  <h4>2. Construire le symétrique d'un point avec l'équerre et le compas</h4>
  <div class="retenir" data-l="Méthode"><ol><li>Avec l'équerre, je trace la perpendiculaire à (d) passant par A. Elle coupe (d) en H.</li><li>Avec le compas, je reporte la longueur AH de l'autre côté de (d), sur la perpendiculaire.</li><li>J'obtiens le point A', symétrique de A : HA' = HA. Je code la figure.</li></ol></div>
  <div class="anim" data-anim="6e13-sym-equerre"></div>
  ${co("equ","Les trois étapes de la construction à l'équerre et au compas",480)}
  <h4>3. Construire le symétrique d'un point avec le compas seulement</h4>
  <div class="retenir" data-l="Méthode"><ol><li>Je place un point M sur (d). Je trace un arc de cercle de centre M passant par A, et je le prolonge de l'autre côté de (d).</li><li>Je place un deuxième point N sur (d). Je trace un arc de cercle de centre N passant par A, de l'autre côté de (d).</li><li>Les deux arcs se coupent en A', le symétrique de A.</li></ol></div>
  <div class="anim" data-anim="symetrique-axial-compas"></div>
  ${co("comp","Les trois étapes de la construction au compas seul",480)}
  <p><b>Remarque :</b> cette méthode fonctionne car MA = MA' et NA = NA' : les points M et N sont sur la médiatrice de [AA'].</p>`},
{k:"III", t:"Les propriétés de la symétrie axiale", h:`
  <div class="retenir" data-l="Propriété"><p>La symétrie axiale conserve les <b>longueurs</b>, les <b>angles</b>, l'<b>alignement</b>, les <b>périmètres</b> et les <b>aires</b>.</p></div>
  <ul><li>Le symétrique d'un segment est un segment de même longueur.</li><li>Le symétrique d'une droite est une droite.</li><li>Le symétrique d'un cercle est un cercle de même rayon ; son centre est le symétrique du centre.</li><li>Le symétrique d'un angle est un angle de même mesure.</li></ul>
  ${co("prop","Un segment, un cercle, un angle et leurs symétriques",480)}
  <h4>Construire le symétrique d'un polygone</h4>
  <div class="cpt"><div><div class="retenir" data-l="Méthode"><ol><li>Je construis le symétrique de chaque sommet.</li><li>Je relie les points obtenus dans le même ordre.</li></ol></div><p><b>Exemple :</b> le symétrique du triangle IJK par rapport à (d) est le triangle I'J'K'. Il a les mêmes longueurs et les mêmes angles : I'J' = IJ, J'K' = JK, I'K' = IK.</p><p><b>Remarque :</b> si un sommet est sur l'axe, il est son propre symétrique : je n'ai rien à construire pour lui.</p></div>${co("poly","Le triangle IJK et son symétrique I'J'K'",230)}</div>
  <div class="anim" data-anim="6e13-sym-triangle"></div>`},
{k:"IV", t:"Les axes de symétrie d'une figure", h:`
  <div class="retenir" data-l="Définition"><p>Une droite (d) est un <b>axe de symétrie</b> d'une figure si le symétrique de la figure par rapport à (d) est la figure elle-même : la figure se superpose à elle-même par pliage le long de (d).</p></div>
  ${co("axes","Une figure avec 1 axe, une avec 2 axes, une sans axe de symétrie",470)}
  <p>De gauche à droite : 1 axe de symétrie, 2 axes de symétrie, aucun axe de symétrie.</p>
  <h4>Les axes de symétrie des figures usuelles</h4>
  ${co("usu","Segment : 2 axes ; cercle : une infinité ; triangle isocèle : 1 axe ; triangle équilatéral : 3 axes ; rectangle : 2 axes ; losange : 2 axes ; carré : 4 axes",500)}
  <p><b>Remarque :</b> la médiatrice d'un segment est un axe de symétrie de ce segment.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Figures symétriques par rapport à une droite", e:[
  {n:"Activité 1", t:"Symétriques ou pas ?", w:"Sur ta feuille", h:`<p>Entoure les lettres des cas où les deux figures sont symétriques par rapport à la droite rouge. Pour les autres, explique pourquoi sur ton cahier.</p>${ex("act1","Six paires de figures en L avec une droite rouge",490)}`,
   c:`<p>Les figures sont symétriques dans les cas <b>a)</b>, <b>c)</b> et <b>d)</b> : elles se superposent par pliage le long de la droite rouge.</p><p><b>b)</b> Non : la figure orange a seulement glissé, elle n'est pas « retournée » (la barre verticale devrait être à droite).</p><p><b>e)</b> Non : la figure orange a tourné (elle est à l'envers), et elle n'est pas à la même hauteur que la figure bleue.</p><p><b>f)</b> Non : la forme est bien retournée, mais la figure orange est trop loin de l'axe (1 carreau de trop) : les points ne sont pas à la même distance de l'axe.</p>`},
  {n:"Exercice 1", t:"Compléter une figure", w:"Sur ta feuille", h:`<p>Trace le symétrique de chaque figure par rapport à la droite rouge, en comptant les carreaux.</p>${ex("e1","Trois figures sur quadrillage avec un axe vertical, horizontal et oblique",490)}`,
   c:`${ex("e1c","Les trois figures complétées par leur symétrique en orange",490)}<p><i>Pour l'axe oblique (c), on compte les carreaux en diagonale : chaque sommet et son symétrique sont sur une même diagonale du quadrillage, perpendiculaire à l'axe.</i></p>`}
 ]},
{t:"Le symétrique d'un point", e:[
  {n:"Exercice 2", t:"Construire le symétrique d'un point", w:"Sur ta feuille", h:`<p>Construis le point A', symétrique de A par rapport à (d) : avec l'équerre et le compas pour a), b) et c), avec le compas seulement pour d), e) et f). Laisse tes traits de construction visibles.</p>${ex("e2","Six cadres avec un point A et une droite (d)",490)}`,
   c:`${ex("e2c","Les six points A' construits",490)}<p>a), b), c) : perpendiculaire à (d) passant par A, puis report de la longueur AH de l'autre côté (codage : angle droit et longueurs égales).</p><p>d), e), f) : deux points M et N sur (d), puis deux arcs de centres M et N passant par A ; ils se coupent en A'.</p>`},
  {n:"Exercice 3", t:"Vrai ou faux ?", w:"Sur ta feuille", h:`<p>Dans chaque cas, le point B est-il le symétrique du point A par rapport à la droite rouge ? Vérifie avec ton équerre et ta règle graduée.</p>${ex("e3","Quatre cas : deux points A et B et une droite rouge",490)}`,
   c:`<p>a) <b>Vrai</b> : (AB) est perpendiculaire à la droite et A et B sont à la même distance (1,3 cm) de la droite.</p><p>b) <b>Faux</b> : (AB) n'est pas perpendiculaire à la droite rouge.</p><p>c) <b>Faux</b> : (AB) est bien perpendiculaire à la droite, mais A est à 1,6 cm de la droite et B à seulement 1 cm.</p><p>d) <b>Vrai</b> : (AB) est perpendiculaire à la droite et la droite coupe [AB] en son milieu.</p>`}
 ]},
{t:"Le symétrique d'une figure", e:[
  {n:"Exercice 4", t:"Construire le symétrique d'une figure", w:"Sur ta feuille", h:`<p>Construis le symétrique de chaque figure par rapport à la droite (d). Nomme les points obtenus A', B', C'… (le symétrique du centre B s'appelle B').</p>${ex("e4","Un triangle, un quadrilatère, un cercle et un losange avec une droite (d)",490)}`,
   c:`${ex("e4c","Les quatre figures et leurs symétriques",490)}<p>On construit le symétrique de chaque sommet, puis on relie dans le même ordre. Pour le cercle, on construit B', puis le cercle de centre B' de même rayon.</p><p>d) Le losange coupe l'axe : sa figure symétrique le chevauche. C'est normal !</p>`},
  {n:"Exercice 5", t:"Utiliser les propriétés", w:"Sur ta feuille", h:`<div class="cpt"><div><p>Les quadrilatères ABCD et A'B'C'D' sont symétriques par rapport à la droite (d). La figure est faite à main levée. Sans mesurer, complète et justifie.</p><p>1) A'B' = …… &nbsp; B'C' = ……</p><p>2) ${A("A'B'C'")} = ……</p><p>3) Le périmètre de ABCD est 15,5 cm. Quel est le périmètre de A'B'C'D' ?</p><p>4) Justification.</p></div>${ex("e5","ABCD avec AB = 5 cm, BC = 3 cm, angle ABC = 95°, et son symétrique A'B'C'D'",260)}</div>`,
   c:`<p>1) A'B' = AB = <b>5 cm</b> ; B'C' = BC = <b>3 cm</b>.</p><p>2) ${A("A'B'C'")} = ${A("ABC")} = <b>95°</b>.</p><p>3) Le périmètre de A'B'C'D' est <b>15,5 cm</b>.</p><p>4) La symétrie axiale conserve les longueurs, les angles et les périmètres.</p>`},
  {n:"Exercice 6", t:"Construire à partir d'un texte", w:"Sur une feuille blanche", h:`<p>1) Trace une droite (d) et place un point A à 4 cm de la droite (d).</p><p>2) Construis le point A', symétrique de A par rapport à (d).</p><p>3) Place un point B sur la droite (d), puis trace le triangle ABA'.</p><p>4) Quelle est la nature du triangle ABA' ? Justifie à l'aide d'une propriété de la médiatrice.</p>`,
   c:`<svg class="fig" viewBox="0 0 300 230" width="300" role="img" aria-label="Le triangle ABA' isocèle en B"><line x1="10" y1="115" x2="290" y2="115" style="stroke:#c00000;stroke-width:2.5"/><text x="262" y="106" style="font-size:14px;fill:#c00000">(d)</text><line x1="90" y1="20" x2="90" y2="210" style="stroke:#888;stroke-width:1.5;stroke-dasharray:5 4"/><path d="M90 103 h12 v12" style="fill:none;stroke:#555;stroke-width:1.5"/><polygon points="90,25 220,115 90,205" style="fill:rgba(31,109,176,.12);stroke:#1f6db0;stroke-width:2.5"/><circle cx="90" cy="25" r="4" style="fill:var(--ink)"/><circle cx="90" cy="205" r="4" style="fill:#e07a00"/><circle cx="220" cy="115" r="4" style="fill:var(--ink)"/><text x="70" y="24" style="font-size:15px;font-weight:700;fill:var(--ink)">A</text><text x="66" y="214" style="font-size:15px;font-weight:700;fill:#e07a00">A'</text><text x="226" y="135" style="font-size:15px;font-weight:700;fill:var(--ink)">B</text><text x="38" y="74" style="font-size:13px;fill:var(--ink)">4 cm</text><text x="38" y="164" style="font-size:13px;fill:var(--ink)">4 cm</text></svg>
   <p>4) (d) est la médiatrice de [AA'] et B est sur (d). Or, si un point est sur la médiatrice d'un segment, il est à la même distance des extrémités de ce segment : <b>BA = BA'</b>. Le triangle ABA' est donc <b>isocèle en B</b>.</p>`}
 ]},
{t:"Les axes de symétrie d'une figure", e:[
  {n:"Exercice 7", t:"Combien d'axes ?", w:"Sur ta feuille", h:`<p>Trace, s'il y en a, le ou les axes de symétrie de chaque figure. Puis indique leur nombre.</p>${ex("e7","Un cœur, une étoile à quatre pointes, une flèche courbe, un cercle, une étoile à cinq branches, un parallélogramme",490)}`,
   c:`<p>a) le cœur : <b>1 axe</b> (vertical) · b) <b>2 axes</b> (un vertical et un horizontal) · c) la flèche : <b>aucun axe</b> · d) le cercle : <b>une infinité</b> d'axes (toutes les droites qui passent par le centre) · e) l'étoile : <b>5 axes</b> (chaque pointe et le creux opposé) · f) le parallélogramme : <b>aucun axe</b>.</p>`},
  {n:"Exercice 8", t:"Les lettres", w:"Sur ta feuille", h:`<p>Trace les axes de symétrie de chaque lettre, puis écris en dessous leur nombre.</p><p class="calc" style="font-size:1.6rem;letter-spacing:.5em;font-family:Arial,sans-serif">A B C H N S X Z</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Lettre</th><th>A</th><th>B</th><th>C</th><th>H</th><th>N</th><th>S</th><th>X</th><th>Z</th></tr></thead><tbody><tr><th>Nombre d'axes</th><td>1</td><td>1</td><td>1</td><td>2</td><td>0</td><td>0</td><td>2</td><td>0</td></tr></tbody></table></div><p>A : axe vertical · B et C : axe horizontal · H et X : un axe vertical et un axe horizontal · N, S et Z n'ont pas d'axe de symétrie (ils ont un centre de symétrie, qu'on verra en 5e).</p>`},
  {n:"Exercice 9", t:"Les figures usuelles", w:"Sur ta feuille", h:`<p>Trace en couleur tous les axes de symétrie de chaque figure.</p>${ex("e9","Un segment, un cercle, un triangle isocèle, un triangle équilatéral, un rectangle, un losange, un carré",470)}`,
   c:`${ex("e9c","Les axes de symétrie des figures usuelles tracés en rouge",470)}<p>Segment : <b>2 axes</b> (la droite (AB) et la médiatrice) · cercle : <b>une infinité</b> (on en a tracé quelques-uns) · triangle isocèle : <b>1 axe</b> · triangle équilatéral : <b>3 axes</b> · rectangle : <b>2 axes</b> · losange : <b>2 axes</b> (ses diagonales) · carré : <b>4 axes</b>.</p>`},
  {n:"Exercice 10", t:"Retrouver l'axe", w:"Sur ta feuille", h:`<p>Dans chaque cas, on a tracé le symétrique du bateau bleu par rapport à une droite, puis on a effacé la droite. Retrace-la précisément.</p><p><b>Aide :</b> l'axe est la médiatrice du segment qui relie un point à son symétrique.</p>${ex("e10","Trois bateaux bleus et leurs symétriques orange",490)}`,
   c:`${ex("e10c","Les trois axes retrouvés",490)}<p>Je relie par exemple le haut du mât bleu au haut du mât orange, puis je trace la médiatrice de ce segment : c'est l'axe. Je vérifie avec un deuxième point.</p>`},
  {n:"En ++", t:"Deux axes de symétrie", w:"Sur ta feuille", h:`<div class="cpt"><div><p>Complète la figure pour que les deux droites rouges soient des axes de symétrie de la figure terminée.</p><p><b>Conseil :</b> construis d'abord le symétrique par rapport à la droite verticale, puis le symétrique de l'ensemble par rapport à la droite horizontale.</p></div>${ex("epp","Une ligne brisée et deux axes rouges",240)}</div>`,
   c:`${ex("eppc","La figure terminée, avec deux axes de symétrie",300)}`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Figures symétriques", schema:S_FIG, q:{
 1:[ {g:()=>{ const k=ri(1,4); return {q:`Sur un quadrillage, un point est à ${k} carreau${k>1?"x":""} à gauche d'un axe vertical. Où est son symétrique ?`, c:shuf([`à ${k} carreau${k>1?"x":""} à droite de l'axe`,`à ${k+1} carreaux à droite de l'axe`,`à ${k} carreau${k>1?"x":""} à gauche de l'axe`]), rep:`à ${k} carreau${k>1?"x":""} à droite de l'axe`, sx:S_FIG}; }} ],
 2:[ {g:()=>{ const ax={t:pick(["v","h"]),k:4}; const pts=randFig(8,ax); const ok=pick([true,false]); let other=pts.map(p=>reflP(p,ax)); if(!ok) other=other.map(p=>ax.t==="v"?[p[0]+1,p[1]]:[p[0],p[1]+1]);
     const segs = q => new Set(q.slice(1).map((p,i)=>[q[i].join(","),p.join(",")].sort().join("|"))); const S1=segs(other), S2=segs(pts.map(p=>reflP(p,ax))); const same = S1.size===S2.size && [...S1].every(x=>S2.has(x));
     const fg = gsym({n:9,c:22,axe:ax,pts}).replace("</svg>", `<polyline points="${other.map(p=>`${6+p[0]*22},${6+p[1]*22}`).join(" ")}" style="fill:rgba(224,122,0,.18);stroke:#e07a00;stroke-width:3;stroke-linejoin:round"/></svg>`);
     return {q:"Les deux figures sont-elles symétriques par rapport à la droite rouge ?", fig:fg, c:["Oui","Non"], rep:same?"Oui":"Non", ex:same?"Chaque sommet et son symétrique sont à la même distance de l'axe.":"La figure orange est décalée d'un carreau.", sx:S_FIG}; }} ],
 3:[ {q:"Deux figures symétriques par rapport à une droite…", c:["se superposent par pliage le long de la droite","sont toujours côte à côte, à la même hauteur","ont toujours la même orientation"], rep:"se superposent par pliage le long de la droite", sx:S_FIG} ]
}},
{nom:"Le symétrique d'un point", schema:S_DEF, q:{
 1:[ {q:"Si A' est le symétrique de A par rapport à (d), alors (d) est…", c:["la médiatrice de [AA']","parallèle à (AA')","le milieu de [AA']"], rep:"la médiatrice de [AA']", sx:S_DEF},
     {q:"Un point M est sur l'axe (d). Quel est son symétrique ?", c:["le point M lui-même","un point de l'autre côté","il n'en a pas"], rep:"le point M lui-même", sx:S_DEF} ],
 2:[ {g:()=>{ const d=ri(2,9)+pick([0,0.5]); const s=String(d).replace(".",","); return {q:`A est à ${s} cm de la droite (d). À quelle distance de (d) est son symétrique A' (en cm) ?`, rep:s, sx:S_DEF}; }},
     {q:"Les droites (AA') et (d) sont…", c:["perpendiculaires","parallèles","confondues"], rep:"perpendiculaires", sx:S_DEF} ],
 3:[ {q:"Pour construire A' au compas seul, on trace deux arcs passant par A et de centres…", c:["deux points M et N de (d)","A et un point de (d)","deux points quelconques"], rep:"deux points M et N de (d)", ex:"MA = MA' et NA = NA' : M et N sont sur la médiatrice de [AA'].", sx:S_DEF},
     {g:()=>{ const d=ri(3,8); return {q:`A est à ${d} cm de (d) et B est un point de (d). Le triangle ABA' est…`, c:["isocèle en B","équilatéral","rectangle en B"], rep:"isocèle en B", ex:"B est sur la médiatrice de [AA'] : BA = BA'.", sx:S_DEF}; }} ]
}},
{nom:"Les propriétés", schema:S_PROP, q:{
 1:[ {g:()=>{ const l=ri(2,12); return {q:`[MN] mesure ${l} cm. Combien mesure son symétrique [M'N'] (en cm) ?`, rep:String(l), sx:S_PROP}; }} ],
 2:[ {g:()=>{ const a=ri(20,160); return {q:`Un angle mesure ${a}°. Combien mesure son symétrique (en °) ?`, rep:String(a), sx:S_PROP}; }},
     {g:()=>{ const r=ri(2,6); return {q:`Le symétrique d'un cercle de rayon ${r} cm est…`, c:[`un cercle de rayon ${r} cm`,`un cercle de rayon ${2*r} cm`,"un segment"], rep:`un cercle de rayon ${r} cm`, sx:S_PROP}; }} ],
 3:[ {q:"La symétrie axiale conserve…", c:["les longueurs, les angles et les aires","seulement les longueurs","seulement les angles"], rep:"les longueurs, les angles et les aires", sx:S_PROP},
     {g:()=>{ const p=ri(100,250); const s=(p/10).toString().replace(".",","); return {q:`Le périmètre d'un polygone est ${s} cm. Quel est le périmètre de son symétrique (en cm) ?`, rep:s, sx:S_PROP}; }} ]
}},
{nom:"Axes de symétrie", schema:S_AXES, q:{
 1:[ {g:()=>{ const f=pick([["un carré","4"],["un rectangle","2"],["un triangle équilatéral","3"],["un losange","2"],["un triangle isocèle","1"],["un segment","2"]]); return {q:`Combien ${f[0]} a-t-il d'axes de symétrie ?`, rep:f[1], sx:S_AXES}; }} ],
 2:[ {g:()=>{ const f=pick([["A","1"],["H","2"],["N","0"],["E","1"],["O","2"],["Z","0"],["T","1"],["M","1"]]); return {q:`Combien la lettre ${f[0]} (écrite en majuscule d'imprimerie) a-t-elle d'axes de symétrie ?`, rep:f[1], sx:S_AXES}; }},
     {q:"Combien un cercle a-t-il d'axes de symétrie ?", c:["une infinité","1","4"], rep:"une infinité", ex:"Toutes les droites qui passent par son centre.", sx:S_AXES} ],
 3:[ {q:"Les axes de symétrie d'un losange sont…", c:["ses diagonales","les médiatrices de ses côtés","ses côtés"], rep:"ses diagonales", sx:S_AXES},
     {q:"Un parallélogramme (qui n'est ni un rectangle ni un losange) a…", c:["aucun axe de symétrie","2 axes","1 axe"], rep:"aucun axe de symétrie", sx:S_AXES} ]
}}
]
};
})();
