/* 5e — Chapitre 12 : Les puissances : carré et cube (cours, fiche d'exercices et corrigé de M. Staal)
   Les carrés quadrillés et les cubes sont dessinés en SVG ; tous les résultats sont calculés. */
(function(){
const VF=["Vrai","Faux"], LT="&lt;", GT="&gt;";
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const F = (a,b) => `{${a}/${b}}`;
/* écriture française : 0,25 · 1 000 · 3,375 */
const D = x => { const r=Math.round(x*1e6)/1e6; const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const P = (b,e) => `${typeof b==="number"?D(b):b}<sup>${e}</sup>`;
const pw = (b,e) => Math.round(Math.pow(b,e)*1e6)/1e6;
const prod = (b,e) => Array(e).fill(typeof b==="number"?D(b):b).join(" × ");

/* ---------- dessins ---------- */
const FILL="#e8eef8", TOPF="#f2f6fc", SIDEF="#cfdcf0", STK="#1f4e79";
/* carré de n carreaux de côté, côtés écrits */
function sq(n, o={}){ const s=o.s||(n<=4?28:n<=6?22:16), m=26, W=n*s+m+8, H=n*s+m+6;
  let g=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Carré de ${n} carreaux de côté">`;
  g+=`<rect x="${m}" y="${m}" width="${n*s}" height="${n*s}" style="fill:${FILL};stroke:${STK};stroke-width:2"/>`;
  for(let i=1;i<n;i++) g+=`<line x1="${m+i*s}" y1="${m}" x2="${m+i*s}" y2="${m+n*s}" style="stroke:${STK};stroke-width:1.3"/><line x1="${m}" y1="${m+i*s}" x2="${m+n*s}" y2="${m+i*s}" style="stroke:${STK};stroke-width:1.3"/>`;
  if(o.lab!==false) g+=`<text x="${m+n*s/2}" y="${m-8}" text-anchor="middle">${n}</text><text x="${m-8}" y="${m+n*s/2+6}" text-anchor="end">${n}</text>`;
  return g+"</svg>"; }
/* cube formé de n × n × n petits cubes (perspective cavalière) */
function cube(n, o={}){ const s=o.s||(n<=2?40:n<=3?30:22), d=s*0.5, x0=8, y0=8+n*d, L=n*s, W=L+n*d+18, H=L+n*d+18;
  const pt=(x,y)=>`${x.toFixed(1)},${y.toFixed(1)}`, ln=(a,b,c,e)=>`<line x1="${a.toFixed(1)}" y1="${b.toFixed(1)}" x2="${c.toFixed(1)}" y2="${e.toFixed(1)}" style="stroke:${STK};stroke-width:1.3"/>`;
  let g=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Cube formé de ${n} × ${n} × ${n} petits cubes">`;
  g+=`<polygon points="${pt(x0,y0)} ${pt(x0+L,y0)} ${pt(x0+L+n*d,y0-n*d)} ${pt(x0+n*d,y0-n*d)}" style="fill:${TOPF};stroke:${STK};stroke-width:2"/>`;
  g+=`<polygon points="${pt(x0+L,y0)} ${pt(x0+L+n*d,y0-n*d)} ${pt(x0+L+n*d,y0+L-n*d)} ${pt(x0+L,y0+L)}" style="fill:${SIDEF};stroke:${STK};stroke-width:2"/>`;
  g+=`<rect x="${x0}" y="${y0}" width="${L}" height="${L}" style="fill:${FILL};stroke:${STK};stroke-width:2"/>`;
  for(let i=1;i<n;i++){ g+=ln(x0+i*s,y0,x0+i*s,y0+L)+ln(x0,y0+i*s,x0+L,y0+i*s);           /* face avant */
    g+=ln(x0+i*s,y0,x0+i*s+n*d,y0-n*d)+ln(x0+i*d,y0-i*d,x0+L+i*d,y0-i*d);                  /* dessus */
    g+=ln(x0+L+i*d,y0-i*d,x0+L+i*d,y0+L-i*d)+ln(x0+L,y0+i*s,x0+L+n*d,y0+i*s-n*d); }        /* côté */
  return g+"</svg>"; }
window.PW12 = {D, P, pw, prod, sq, cube, F};

/* ---------- schémas ---------- */
const S_CAR = sch("Le carré d'un nombre", `<div class="figs">${sq(3)}</div><p class="calc">${P(3,2)} = 3 × 3 = 9 &nbsp;&nbsp; (et non 3 × 2 = 6)</p><p class="schN">a<sup>2</sup> = a × a. Un carré de côté c a pour aire c<sup>2</sup>.</p>`);
const S_TAB = sch("Les carrés à connaître", `<div class="scroll"><table class="std"><tbody><tr><th><i>n</i></th>${[...Array(13)].map((_,i)=>`<td>${i}</td>`).join("")}</tr><tr><th><i>n</i><sup>2</sup></th>${[...Array(13)].map((_,i)=>`<td>${i*i}</td>`).join("")}</tr></tbody></table></div>`);
const S_CUB = sch("Le cube d'un nombre", `<div class="figs">${cube(2,{s:30})}</div><p class="calc">${P(2,3)} = 2 × 2 × 2 = 8 &nbsp;&nbsp; (et non 2 × 3 = 6)</p><p class="schN">a<sup>3</sup> = a × a × a. Un cube de côté c a pour volume c<sup>3</sup>.</p>`);
const S_PRIO = sch("L'ordre des calculs", `<p class="schN">1) parenthèses · 2) carrés et cubes · 3) × et ÷ · 4) + et −</p><p class="calc">3 + ${P(2,2)} × 5 = 3 + 4 × 5 = 3 + 20 = 23</p><p class="calc">${P("(3+2)",2)} = ${P(5,2)} = 25</p>`);
const S_LIT = sch("Remplacer la lettre", `<p class="schN">Pour <i>x</i> = 4 :</p><p class="calc"><i>x</i><sup>2</sup> + 3 = ${P(4,2)} + 3 = 16 + 3 = 19 &nbsp;·&nbsp; 2<i>x</i><sup>2</sup> = 2 × ${P(4,2)} = 2 × 16 = 32</p><p class="schN">2<i>x</i><sup>2</sup> veut dire 2 × <i>x</i><sup>2</sup> : on calcule le carré d'abord.</p>`);

CH["5e-12"] = {
intro:"Le carré et le cube d'un nombre, les carrés à connaître par cœur, l'aire d'un carré et le volume d'un cube, et les calculs avec des carrés et des cubes.",
savoir:[
  "connaître et utiliser les notations a<sup>2</sup> (carré) et a<sup>3</sup> (cube) ;",
  "connaître par cœur les carrés des nombres de 0 à 12 et le cube de 10 ;",
  "calculer l'aire d'un carré et le volume d'un cube ;",
  "calculer la valeur d'une expression numérique ou littérale contenant des carrés et des cubes."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Le carré d'un nombre", h:`
  <div class="retenir" data-l="Définition"><p>Pour un nombre <i>a</i>, le <b>carré</b> de <i>a</i> se note <i>a</i><sup>2</sup>.</p><p>On lit « <i>a</i> au carré ».</p><p class="calc"><i>a</i><sup>2</sup> = <i>a</i> × <i>a</i></p></div>
  <div class="figs"><figure>${sq(3)}<figcaption>${P(3,2)} = 3 × 3 = 9</figcaption></figure><figure>${sq(4)}<figcaption>${P(4,2)} = 4 × 4 = 16</figcaption></figure></div>
  <p>Un carré de côté <i>c</i> a pour aire <i>A</i> = <i>c</i><sup>2</sup>. C'est pourquoi <i>a</i><sup>2</sup> se lit « <i>a</i> au carré ».</p>
  <p><b>Exemples :</b></p><p class="calc">${P("0,5",2)} = 0,5 × 0,5 = 0,25 &nbsp;&nbsp;&nbsp; ${P(`(${F(2,3)})`,2)} = ${F(2,3)} × ${F(2,3)} = ${F(4,9)}</p>
  <div class="attention"><b>ATTENTION :</b> ${P(3,2)} ne signifie pas 3 × 2.<br>${P(3,2)} = 3 × 3 = 9, alors que 3 × 2 = 6.</div>
  <div class="retenir" data-l="À connaître par cœur"><p>Les carrés des nombres de 0 à 12 :</p><div class="scroll"><table class="std"><thead><tr><th><i>n</i></th>${[...Array(13)].map((_,i)=>`<th>${i}</th>`).join("")}</tr></thead><tbody><tr><th><i>n</i><sup>2</sup></th>${[...Array(13)].map((_,i)=>`<td>${i*i}</td>`).join("")}</tr></tbody></table></div></div>`},
{k:"II", t:"Le cube d'un nombre", h:`
  <div class="retenir" data-l="Définition"><p>Pour un nombre <i>a</i>, le <b>cube</b> de <i>a</i> se note <i>a</i><sup>3</sup>.</p><p>On lit « <i>a</i> au cube ».</p><p class="calc"><i>a</i><sup>3</sup> = <i>a</i> × <i>a</i> × <i>a</i></p></div>
  <div class="figs"><figure>${cube(2)}<figcaption>${P(2,3)} = 2 × 2 × 2 = 8</figcaption></figure></div>
  <p>Un cube de côté <i>c</i> a pour volume <i>V</i> = <i>c</i><sup>3</sup>.</p>
  <p><b>Exemples :</b></p><p class="calc">${P(5,3)} = 5 × 5 × 5 = 125 &nbsp;&nbsp;&nbsp; ${P(10,3)} = 10 × 10 × 10 = 1 000 &nbsp;&nbsp;&nbsp; ${P(10,2)} = 100</p>
  <div class="retenir" data-l="À connaître"><p class="calc">${P(1,3)} = 1 &nbsp;·&nbsp; ${P(2,3)} = 8 &nbsp;·&nbsp; ${P(3,3)} = 27 &nbsp;·&nbsp; ${P(4,3)} = 64 &nbsp;·&nbsp; ${P(5,3)} = 125 &nbsp;·&nbsp; ${P(10,3)} = 1 000</p></div>`},
{k:"III", t:"Calculer avec des carrés et des cubes", h:`
  <div class="retenir" data-l="Ordre des calculs"><ol><li>Je calcule d'abord ce qui est entre <b>parenthèses</b>.</li><li>Je calcule ensuite les <b>carrés et les cubes</b>.</li><li>Puis les multiplications et les divisions, enfin les additions et les soustractions.</li></ol></div>
  <p><b>Exemples :</b></p><p class="calc"><i>A</i> = 3 + ${P(2,2)} × 5 = 3 + 4 × 5 = 3 + 20 = 23</p><p class="calc"><i>B</i> = ${P("(3+2)",2)} = ${P(5,2)} = 25</p>
  <p>Dans une expression littérale, on remplace la lettre par sa valeur.</p>
  <p><b>Exemple :</b> pour <i>x</i> = 4 :</p><p class="calc"><i>x</i><sup>2</sup> + 3 = ${P(4,2)} + 3 = 16 + 3 = 19</p><p class="calc">2<i>x</i><sup>2</sup> = 2 × ${P(4,2)} = 2 × 16 = 32</p>
  <p><b>À toi de jouer :</b> calcule ${P(6,2)}, ${P(2,3)} et 5 + 3 × ${P(2,2)}.</p>
  <details><summary>Voir la correction</summary><div class="corr"><p class="calc">${P(6,2)} = 6 × 6 = 36</p><p class="calc">${P(2,3)} = 2 × 2 × 2 = 8</p><p class="calc">5 + 3 × ${P(2,2)} = 5 + 3 × 4 = 5 + 12 = 17</p></div></details>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Le carré d'un nombre", e:[
  {n:"Activité 1", t:"Compter des carreaux", w:"Sur ta feuille", h:`<p>On utilise des carreaux de 1 cm de côté.</p><div class="figs">${sq(3)}</div><p>1) Combien de petits carrés contient ce grand carré de côté 3 carreaux ?</p><p>2) Complète : ${P(3,2)} = ……</p><p>Combien de petits carrés aurait un carré de côté 5 ? de côté 10 ?</p>`,
   c:`<p>1) Ce carré contient 3 × 3 = <b>9</b> petits carrés.</p><p>2) ${P(3,2)} = <b>9</b>.</p><p>Un carré de côté 5 contient ${P(5,2)} = <b>25</b> petits carrés.</p><p>Un carré de côté 10 en contient ${P(10,2)} = <b>100</b>.</p>`},
  {n:"Exercice 1", t:"Écrire un produit et calculer", w:"Sur ton cahier", h:`<p>Écris sous forme d'un produit, puis calcule.</p><p>a) ${P(3,2)} · b) ${P(7,2)} · c) ${P(2,3)} · d) ${P(5,3)} · e) ${P(10,2)} · f) ${P(10,3)}</p>`,
   c:`<p>${[[3,2],[7,2],[2,3],[5,3],[10,2],[10,3]].map(([b,e],i)=>`${"abcdef"[i]}) ${P(b,e)} = ${prod(b,e)} = <b>${D(pw(b,e))}</b>`).join(" · ")}</p>`},
  {n:"Exercice 2", t:"Le tableau des carrés", w:"Sur ta feuille", h:`<p>Complète le tableau (les carrés de 0 à 12 sont à connaître par cœur).</p><div class="scroll"><table class="std"><thead><tr><th><i>n</i></th>${[...Array(13)].map((_,i)=>`<th>${i}</th>`).join("")}</tr></thead><tbody><tr><th><i>n</i><sup>2</sup></th>${[...Array(13)].map(()=>`<td></td>`).join("")}</tr></tbody></table></div><p>Complète : ${P(9,2)} = …… ; ${P(11,2)} = …… ; ${P(12,2)} = …… ; ${P(6,2)} = ……</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th><i>n</i></th>${[...Array(13)].map((_,i)=>`<th>${i}</th>`).join("")}</tr></thead><tbody><tr><th><i>n</i><sup>2</sup></th>${[...Array(13)].map((_,i)=>`<td>${i*i}</td>`).join("")}</tr></tbody></table></div><p>${P(9,2)} = <b>81</b> ; ${P(11,2)} = <b>121</b> ; ${P(12,2)} = <b>144</b> ; ${P(6,2)} = <b>36</b></p>`},
  {n:"Exercice 3", t:"Carrés de décimaux et de fractions", w:"Sur ta feuille", h:`<p>Calcule mentalement et écris seulement les résultats.</p><p>a) ${P(8,2)} = …… · b) ${P("0,1",2)} = …… · c) ${P("0,3",2)} = …… · d) ${P(`(${F(1,2)})`,2)} = …… · e) ${P(`(${F(3,4)})`,2)} = …… · f) ${P("1,5",2)} = ……</p>`,
   c:`<p>a) ${P(8,2)} = <b>64</b> · b) ${P("0,1",2)} = <b>0,01</b> · c) ${P("0,3",2)} = <b>0,09</b> · d) ${P(`(${F(1,2)})`,2)} = <b>${F(1,4)}</b> · e) ${P(`(${F(3,4)})`,2)} = <b>${F(9,16)}</b> · f) ${P("1,5",2)} = <b>2,25</b></p>`},
  {n:"Exercice 4", t:"Corriger les erreurs", w:"Sur ton cahier", h:`<p>Vrai ou faux ? Justifie.</p><p>a) Marc affirme : « ${P(4,2)} = 8 ». Que vaut vraiment ${P(4,2)} ? Quelle erreur a-t-il commise ?</p><p>b) Inès affirme : « ${P(2,3)} = 6 ». A-t-elle raison ?</p><p>c) Tom affirme : « le carré de 5 est plus petit que le cube de 5 ». A-t-il raison ?</p>`,
   c:`<p>a) ${P(4,2)} = 4 × 4 = <b>16</b> : Marc a calculé 4 × 2 au lieu de 4 × 4.</p><p>b) <b>Non</b> : ${P(2,3)} = 2 × 2 × 2 = 8 ; Inès a calculé 2 × 3.</p><p>c) <b>Oui</b> : ${P(5,2)} = 25 et ${P(5,3)} = 125, et 25 &lt; 125.</p>`}
 ]},
{t:"Le cube d'un nombre", e:[
  {n:"Activité 2", t:"Compter des cubes", w:"Sur ta feuille", h:`<p>Un cube de côté 2 cm est formé de petits cubes de 1 cm de côté.</p><div class="figs">${cube(2)}</div><p>1) Combien de petits cubes contient ce cube ? Complète : ${P(2,3)} = ……</p><p>2) Même question pour un cube de côté 3 cm. Complète : ${P(3,3)} = ……</p>`,
   c:`<p>1) Il contient 2 × 2 × 2 = <b>8</b> petits cubes : ${P(2,3)} = 8.</p><p>2) Un cube de côté 3 cm contient 3 × 3 × 3 = <b>27</b> petits cubes : ${P(3,3)} = 27.</p><div class="figs">${cube(3)}</div>`},
  {n:"Exercice 5", t:"Calculer des cubes", w:"Sur ton cahier", h:`<p>Calcule (calculatrice autorisée pour d), e) et f)).</p><p>a) ${P(1,3)} · b) ${P(4,3)} · c) ${P(10,3)} · d) ${P("0,1",3)} · e) ${P(6,3)} · f) ${P(20,3)}</p>`,
   c:`<p>${[1,4,10,0.1,6,20].map((b,i)=>`${"abcdef"[i]}) ${P(b,3)} = <b>${D(pw(b,3))}</b>`).join(" · ")}</p>`},
  {n:"Exercice 6", t:"Aires de carrés et volumes de cubes", w:"Sur ton cahier", h:`<p>1) Quelle est l'aire d'un carré de côté 9 cm ? de côté 12 cm ? de côté 2,5 cm ?</p><p>2) Quel est le volume d'un cube de côté 4 cm ? de côté 10 cm ? de côté 1,5 cm ?</p><p>3) Un carré a pour aire 49 cm². Quel est son côté ?</p><p>Un cube a pour volume 27 cm³. Quel est son côté ?</p>`,
   c:`<p>1) ${P(9,2)} = <b>81 cm²</b> ; ${P(12,2)} = <b>144 cm²</b> ; ${P("2,5",2)} = 2,5 × 2,5 = <b>6,25 cm²</b>.</p><p>2) ${P(4,3)} = <b>64 cm³</b> ; ${P(10,3)} = <b>1 000 cm³</b> ; ${P("1,5",3)} = 1,5 × 1,5 × 1,5 = <b>3,375 cm³</b>.</p><p>3) 7 × 7 = 49 : le côté du carré mesure <b>7 cm</b>.</p><p>3 × 3 × 3 = 27 : le côté du cube mesure <b>3 cm</b>.</p>`}
 ]},
{t:"Calculer avec des carrés et des cubes", e:[
  {n:"Exercice 7", t:"Priorités avec des puissances", w:"Sur ton cahier", h:`<p>Calcule en respectant les priorités.</p><p>a) 3 + ${P(2,2)} · b) 2 × ${P(5,2)} · c) ${P("(3+2)",2)} · d) 10 − ${P(2,3)} · e) ${P(4,2)} − ${P(3,2)} · f) ${P(2,3)} + ${P(3,2)}</p>`,
   c:`<p>a) 3 + ${P(2,2)} = 3 + 4 = <b>7</b> · b) 2 × ${P(5,2)} = 2 × 25 = <b>50</b> · c) ${P("(3+2)",2)} = ${P(5,2)} = <b>25</b> · d) 10 − ${P(2,3)} = 10 − 8 = <b>2</b> · e) ${P(4,2)} − ${P(3,2)} = 16 − 9 = <b>7</b> · f) ${P(2,3)} + ${P(3,2)} = 8 + 9 = <b>17</b></p>`},
  {n:"Exercice 8", t:"Expressions plus longues", w:"Sur ton cahier", h:`<p>Calcule en détaillant les étapes.</p><p>a) 4 + 3 × ${P(2,2)} · b) (4+3) × ${P(2,2)} · c) ${P(5,2)} − 2 × ${P(3,2)} · d) ${P("(5−2)",3)} · e) 100 − ${P(10,2)} × 0,5 · f) 2 × ${P(3,3)} + 1</p>`,
   c:`<p>a) 4 + 3 × ${P(2,2)} = 4 + 3 × 4 = 4 + 12 = <b>16</b> · b) (4+3) × ${P(2,2)} = 7 × 4 = <b>28</b> · c) ${P(5,2)} − 2 × ${P(3,2)} = 25 − 2 × 9 = 25 − 18 = <b>7</b> · d) ${P("(5−2)",3)} = ${P(3,3)} = <b>27</b> · e) 100 − ${P(10,2)} × 0,5 = 100 − 100 × 0,5 = 100 − 50 = <b>50</b> · f) 2 × ${P(3,3)} + 1 = 2 × 27 + 1 = 54 + 1 = <b>55</b></p>`},
  {n:"Exercice 9", t:"Expressions littérales avec des puissances", w:"Sur ton cahier", h:`<p>Calcule la valeur de chaque expression pour la valeur de <i>x</i> indiquée.</p><p>a) <i>x</i><sup>2</sup> + 1 pour <i>x</i> = 5 · b) 3<i>x</i><sup>2</sup> pour <i>x</i> = 2 · c) <i>x</i><sup>3</sup> − <i>x</i> pour <i>x</i> = 3 · d) (<i>x</i>+1)<sup>2</sup> pour <i>x</i> = 4 · e) <i>x</i><sup>2</sup> + <i>x</i> pour <i>x</i> = 10 · f) 2<i>x</i><sup>3</sup> pour <i>x</i> = 0,5</p>`,
   c:`<p>a) ${P(5,2)} + 1 = 25 + 1 = <b>26</b> · b) 3 × ${P(2,2)} = 3 × 4 = <b>12</b> · c) ${P(3,3)} − 3 = 27 − 3 = <b>24</b> · d) ${P("(4+1)",2)} = ${P(5,2)} = <b>25</b> · e) ${P(10,2)} + 10 = 100 + 10 = <b>110</b> · f) 2 × ${P("0,5",3)} = 2 × 0,125 = <b>0,25</b></p>`},
  {n:"Exercice 10", t:"Aire et périmètre d'un carré", w:"Sur ton cahier", h:`<p>Une figure est composée d'un carré de côté <i>c</i> cm.</p><p>1) Exprime en fonction de <i>c</i> l'aire du carré, puis son périmètre.</p><p>2) Calcule l'aire et le périmètre pour <i>c</i> = 6, puis pour <i>c</i> = 12.</p><p>3) Quand on double le côté, l'aire est-elle doublée ? Explique avec les valeurs calculées.</p>`,
   c:`<p>1) Aire : <b><i>c</i><sup>2</sup></b> ; périmètre : <b>4<i>c</i></b>.</p><p>2) Pour <i>c</i> = 6 : aire ${P(6,2)} = <b>36 cm²</b>, périmètre 4 × 6 = <b>24 cm</b>.</p><p>Pour <i>c</i> = 12 : aire ${P(12,2)} = <b>144 cm²</b>, périmètre 4 × 12 = <b>48 cm</b>.</p><p>3) <b>Non</b> : le périmètre est doublé (de 24 cm à 48 cm), mais l'aire est multipliée par 4 (de 36 cm² à 144 cm²).</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Le carré d'un nombre", schema:S_CAR, q:{
 1:[ {g:()=>{ const n=ri(0,12); return {q:`Calcule ${P(n,2)}.`, rep:String(n*n), ex:`${P(n,2)} = ${n} × ${n} = ${n*n}.`, sx:S_TAB}; }},
     {g:()=>{ const n=ri(3,9); return {q:`${P(n,2)} est égal à :`, c:[`${n} × ${n}`,`${n} × 2`,`${n} + ${n}`], rep:`${n} × ${n}`, ex:`Le carré de ${n}, c'est ${n} × ${n} (et non ${n} × 2).`, sx:S_CAR}; }} ],
 2:[ {g:()=>{ const d=pick([1,2,3,4,5,6,7,8,9,11,12,15]), b=d/10; return {q:`Calcule ${P(b,2)}.`, rep:D(pw(b,2)), ex:`${P(b,2)} = ${D(b)} × ${D(b)} = ${D(pw(b,2))}.`, sx:S_CAR}; }},
     {g:()=>{ let p,q; do{ p=ri(1,5); q=ri(2,7); }while(p>=q || (p>1 && q%p===0) || (p===4 && q===6)); return {q:`Calcule ${P(`(${F(p,q)})`,2)}. Écris une fraction.`, rep:`${p*p}/${q*q}`, ex:`${P(`(${F(p,q)})`,2)} = ${F(p,q)} × ${F(p,q)} = ${F(p*p,q*q)}.`, sx:S_CAR}; }},
     {g:()=>{ const n=ri(3,9); return {q:`Vrai ou faux : ${P(n,2)} = ${2*n}.`, c:VF, rep:"Faux", ex:`${P(n,2)} = ${n} × ${n} = ${n*n}, et non ${n} × 2 = ${2*n}.`, sx:S_CAR}; }} ],
 3:[ {g:()=>{ const c=pick([ri(2,12), ri(11,49)/10*1]); const cc=Math.round(c*10)/10; return {q:`Quelle est l'aire (en cm²) d'un carré de côté ${D(cc)} cm ?`, rep:[D(pw(cc,2)), D(pw(cc,2))+" cm²"], ex:`A = ${P(cc,2)} = ${D(cc)} × ${D(cc)} = ${D(pw(cc,2))} cm².`, sx:S_CAR}; }},
     {g:()=>{ const c=ri(2,12); return {q:`Un carré a pour aire ${c*c} cm². Quelle est la longueur de son côté (en cm) ?`, rep:[String(c), c+" cm"], ex:`${c} × ${c} = ${c*c} : le côté mesure ${c} cm.`, sx:S_TAB}; }} ]
}},
{nom:"Le cube d'un nombre", schema:S_CUB, q:{
 1:[ {g:()=>{ const n=pick([1,2,3,4,5,10]); return {q:`Calcule ${P(n,3)}.`, rep:D(pw(n,3)), ex:`${P(n,3)} = ${prod(n,3)} = ${D(pw(n,3))}.`, sx:S_CUB}; }},
     {g:()=>{ const n=pick([2,4,5,6]); return {q:`${P(n,3)} est égal à :`, c:uniq(`${n} × ${n} × ${n}`,[`${n} × 3`,`${n} × ${n}`]), rep:`${n} × ${n} × ${n}`, ex:`Le cube de ${n}, c'est ${n} × ${n} × ${n}.`, sx:S_CUB}; }} ],
 2:[ {g:()=>{ const n=pick([6,7,8,9,20,30,0.1,0.2,0.5]); return {q:`Calcule ${P(n,3)}.`, rep:D(pw(n,3)), ex:`${P(n,3)} = ${prod(n,3)} = ${D(pw(n,3))}.`, sx:S_CUB}; }},
     {g:()=>{ const c=pick([2,3,4,5,10,1.5,0.5]); return {q:`Quel est le volume (en cm³) d'un cube de côté ${D(c)} cm ?`, rep:[D(pw(c,3)), D(pw(c,3))+" cm³"], ex:`V = ${P(c,3)} = ${prod(c,3)} = ${D(pw(c,3))} cm³.`, sx:S_CUB}; }} ],
 3:[ {g:()=>{ const c=pick([1,2,3,4,5,10]); return {q:`Un cube a pour volume ${D(c*c*c)} cm³. Quelle est la longueur de son côté (en cm) ?`, rep:[String(c), c+" cm"], ex:`${prod(c,3)} = ${D(c*c*c)} : le côté mesure ${c} cm.`, sx:S_CUB}; }},
     {g:()=>{ const n=ri(2,9); return {q:`Vrai ou faux : le carré de ${n} est plus petit que le cube de ${n}.`, c:VF, rep:"Vrai", ex:`${P(n,2)} = ${n*n} et ${P(n,3)} = ${n*n*n}, et ${n*n} &lt; ${n*n*n}.`, sx:S_CUB}; }},
     {g:()=>{ const n=pick([2,4,5,6]); return {q:`Vrai ou faux : ${P(n,3)} = ${3*n}.`, c:VF, rep:"Faux", ex:`${P(n,3)} = ${prod(n,3)} = ${n*n*n}, et non ${n} × 3.`, sx:S_CUB}; }} ]
}},
{nom:"Priorités avec des carrés et des cubes", schema:S_PRIO, q:{
 1:[ {g:()=>{ const a=ri(1,20), b=ri(2,9); return {q:`Calcule ${a} + ${P(b,2)}.`, rep:String(a+b*b), ex:`${a} + ${P(b,2)} = ${a} + ${b*b} = ${a+b*b} (le carré d'abord).`, sx:S_PRIO}; }},
     {g:()=>{ const a=ri(2,5), b=ri(2,9); return {q:`Calcule ${a} × ${P(b,2)}.`, rep:String(a*b*b), ex:`${a} × ${P(b,2)} = ${a} × ${b*b} = ${a*b*b}.`, sx:S_PRIO}; }} ],
 2:[ {g:()=>{ const a=ri(1,6), b=ri(1,6); return {q:`Calcule ${P(`(${a}+${b})`,2)}.`, c:uniq(String((a+b)**2),[String(a*a+b*b),String(2*(a+b)),String(a+b*b)]).slice(0,3), rep:String((a+b)**2), ex:`Les parenthèses d'abord : ${P(`(${a}+${b})`,2)} = ${P(a+b,2)} = ${(a+b)**2}.`, sx:S_PRIO}; }},
     {g:()=>{ const b=ri(3,7), a=ri(b+1,12); return {q:`Calcule ${P(a,2)} − ${P(b,2)}.`, rep:String(a*a-b*b), ex:`${P(a,2)} − ${P(b,2)} = ${a*a} − ${b*b} = ${a*a-b*b}.`, sx:S_PRIO}; }},
     {g:()=>{ const b=ri(1,4), a=b**3+ri(1,30); return {q:`Calcule ${a} − ${P(b,3)}.`, rep:String(a-b**3), ex:`${a} − ${P(b,3)} = ${a} − ${b**3} = ${a-b**3}.`, sx:S_PRIO}; }} ],
 3:[ {g:()=>{ const a=ri(1,9), b=ri(2,5), c=ri(2,5); return {q:`Calcule ${a} + ${b} × ${P(c,2)}.`, c:uniq(String(a+b*c*c),[String((a+b)*c*c),String(a+(b*c)**2),String(a+b*c*2)]).slice(0,3), rep:String(a+b*c*c), ex:`${a} + ${b} × ${P(c,2)} = ${a} + ${b} × ${c*c} = ${a} + ${b*c*c} = ${a+b*c*c}.`, sx:S_PRIO}; }},
     {g:()=>{ const a=ri(1,6), b=ri(1,6), c=ri(2,4); return {q:`Calcule (${a}+${b}) × ${P(c,2)}.`, rep:String((a+b)*c*c), ex:`(${a}+${b}) × ${P(c,2)} = ${a+b} × ${c*c} = ${(a+b)*c*c}.`, sx:S_PRIO}; }},
     {g:()=>{ let a,b,c; do{ a=ri(4,10); b=ri(2,4); c=ri(2,4); }while(a*a-b*c*c<0); return {q:`Calcule ${P(a,2)} − ${b} × ${P(c,2)}.`, rep:String(a*a-b*c*c), ex:`${P(a,2)} − ${b} × ${P(c,2)} = ${a*a} − ${b} × ${c*c} = ${a*a} − ${b*c*c} = ${a*a-b*c*c}.`, sx:S_PRIO}; }} ]
}},
{nom:"Expressions littérales", schema:S_LIT, q:{
 1:[ {g:()=>{ const x=ri(2,10), k=ri(1,9); return {q:`Calcule <i>x</i><sup>2</sup> + ${k} pour <i>x</i> = ${x}.`, rep:String(x*x+k), ex:`${P(x,2)} + ${k} = ${x*x} + ${k} = ${x*x+k}.`, sx:S_LIT}; }},
     {g:()=>{ const x=ri(2,10); return {q:`Calcule <i>x</i><sup>2</sup> + <i>x</i> pour <i>x</i> = ${x}.`, rep:String(x*x+x), ex:`${P(x,2)} + ${x} = ${x*x} + ${x} = ${x*x+x}.`, sx:S_LIT}; }} ],
 2:[ {g:()=>{ const x=ri(2,6), k=ri(2,5); return {q:`Calcule ${k}<i>x</i><sup>2</sup> pour <i>x</i> = ${x}.`, c:uniq(String(k*x*x),[String((k*x)**2),String(k*x*2),String(k+x*x)]).slice(0,3), rep:String(k*x*x), ex:`${k}<i>x</i><sup>2</sup> = ${k} × ${P(x,2)} = ${k} × ${x*x} = ${k*x*x}.`, sx:S_LIT}; }},
     {g:()=>{ const x=ri(1,7), k=ri(1,5); return {q:`Calcule (<i>x</i>+${k})<sup>2</sup> pour <i>x</i> = ${x}.`, rep:String((x+k)**2), ex:`${P(`(${x}+${k})`,2)} = ${P(x+k,2)} = ${(x+k)**2}.`, sx:S_LIT}; }},
     {g:()=>{ const x=ri(2,5); return {q:`Calcule <i>x</i><sup>3</sup> − <i>x</i> pour <i>x</i> = ${x}.`, rep:String(x**3-x), ex:`${P(x,3)} − ${x} = ${x**3} − ${x} = ${x**3-x}.`, sx:S_LIT}; }} ],
 3:[ {g:()=>{ const x=pick([0.1,0.2,0.5,1.5]), k=pick([2,4,10]); return {q:`Calcule ${k}<i>x</i><sup>3</sup> pour <i>x</i> = ${D(x)}.`, rep:D(pw(x,3)*k), ex:`${k} × ${P(x,3)} = ${k} × ${D(pw(x,3))} = ${D(pw(x,3)*k)}.`, sx:S_LIT}; }},
     {q:"Quand on double le côté d'un carré, son aire est…", c:["multipliée par 4","multipliée par 2","inchangée"], rep:"multipliée par 4", ex:"Pour c = 6 : aire 36 cm². Pour c = 12 : aire 144 cm² = 4 × 36 cm². Le périmètre, lui, est doublé.", sx:S_CAR},
     {g:()=>{ const c=ri(2,15); return {q:`Un carré a pour côté ${c} cm. Quel est son périmètre (en cm) ?`, c:uniq(String(4*c),[String(c*c),String(2*c),String(c+4)]).slice(0,3), rep:String(4*c), ex:`Périmètre = 4<i>c</i> = 4 × ${c} = ${4*c} cm (l'aire, elle, vaut ${P(c,2)} = ${c*c} cm²).`, sx:S_CAR}; }} ]
}}
]
};
})();
