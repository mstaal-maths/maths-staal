/* 6e — Chapitre 3 : Les fractions (1) */
(function(){
const co = (p,alt,w) => img("c3co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c3ex/"+p+".png", alt, w);
const lab = (l,f) => `<figure>${f}<figcaption>${l}</figcaption></figure>`;
const cg = items => `<div class="cgrid">${items.map(([l,f,t])=>`<figure><figcaption><b>${l}</b> ${t||""}</figcaption>${f}</figure>`).join("")}</div>`;
/* verre : rectangle vertical partagé en n, k parts coloriées en partant du bas */
function verre(n,k){ const W=60,H=150; let s=`<svg class="fig" viewBox="0 0 ${W+4} ${H+4}" width="${W+4}" role="img" aria-label="Verre partagé en ${n} parts">`;
  for(let i=0;i<n;i++){ const h=H/n, y=2+H-(i+1)*h; s+=`<rect x="2" y="${y}" width="${W}" height="${h}" class="${i<k?"on":"off"}"/>`; if(n>1&&i>0) s+=`<line x1="2" y1="${2+H-i*h}" x2="${W+2}" y2="${2+H-i*h}" class="thin"/>`; }
  return s+`<path d="M2 2 L2 ${H+2} L${W+2} ${H+2} L${W+2} 2" class="ln"/></svg>`; }
/* segment [AB] partagé en n, les k premières parts repassées en couleur */
function segment(n,k){ const x0=20,x1=300; let s=`<svg class="fig" viewBox="0 0 320 70" width="320" role="img" aria-label="Segment AB partagé en ${n}">`;
  s+=`<line x1="${x0}" y1="40" x2="${x1}" y2="40" class="ln"/>`;
  if(k) s+=`<line x1="${x0}" y1="40" x2="${x0+(x1-x0)*k/n}" y2="40" stroke="var(--c)" stroke-width="7"/>`;
  for(let i=0;i<=n;i++){ const x=x0+(x1-x0)*i/n; s+=`<line x1="${x}" y1="${i%n?33:28}" x2="${x}" y2="${i%n?47:52}" class="ln"/>`; }
  return s+`<text x="${x0}" y="20" class="lab">A</text><text x="${x1}" y="20" class="lab">B</text></svg>`; }
/* pendule : k quarts d'heure coloriés à partir de midi */
function pendule(k){ const c=60,r=52; let s=`<svg class="fig" viewBox="0 0 120 120" width="120" role="img" aria-label="Pendule">`;
  if(k) s+=`<path class="on" d="M${c} ${c} L${c} ${c-r} A${r} ${r} 0 ${k>2?1:0} 1 ${(c+r*Math.sin(k*Math.PI/2)).toFixed(1)} ${(c-r*Math.cos(k*Math.PI/2)).toFixed(1)} Z"/>`;
  s+=`<circle cx="${c}" cy="${c}" r="${r}" class="ln"/>`;
  [["12",c,c-r+16],["3",c+r-12,c+5],["6",c,c+r-6],["9",c-r+12,c+5]].forEach(([t,x,y])=>s+=`<text x="${x}" y="${y}" class="lab">${t}</text>`);
  for(let i=0;i<12;i++){ const a=i*Math.PI/6; s+=`<line x1="${(c+(r-4)*Math.sin(a)).toFixed(1)}" y1="${(c-(r-4)*Math.cos(a)).toFixed(1)}" x2="${(c+r*Math.sin(a)).toFixed(1)}" y2="${(c-r*Math.cos(a)).toFixed(1)}" class="thin"/>`; }
  return s+`<circle cx="${c}" cy="${c}" r="3" fill="var(--ink)"/></svg>`; }
const rectN = (n,k) => parts(Array(n).fill(Math.round(240/n)), [...Array(k)].map((_,i)=>i));

CH["6e-3"] = {
intro: "Comprendre une fraction comme un partage, produire des fractions égales, placer une fraction sur une demi-droite graduée, la comparer à 1, et reconnaître fractions décimales et pourcentages.",
savoir: [
  "comprendre une fraction comme un partage de l'unité en parts égales ;",
  "reconnaître et produire des fractions égales ;",
  "placer une fraction sur une demi-droite graduée et lire une abscisse ;",
  "comparer une fraction à 1 et la décomposer en un entier et une fraction inférieure à 1 ;",
  "reconnaître une fraction décimale et un pourcentage."
],

/* ===================== COURS ===================== */
cours: [
{k:"I", t:"Fraction et partage", h:`
  <div class="retenir" data-l="Définition"><p>Lorsqu'on partage une unité en parts égales, chaque part est une fraction de l'unité.</p></div>
  <h4>Exemple</h4>
  <div class="figs">${co("p1-00","Pizza coupée en 4 parts égales, 3 parts hachurées",150)}
  <p>J'ai coupé une pizza en 4 parts égales et j'en ai mangé 3 parts : j'ai mangé les <b>trois quarts</b> de la pizza.</p></div>
  <p class="big">{3/4} = {1/4} + {1/4} + {1/4} &nbsp; et &nbsp; {3/4} = 3 × {1/4}</p>
  <h4>Notation</h4>
  <p>Une fraction s'écrit avec deux nombres entiers, séparés par une barre de fraction.</p>
  ${co("p1-03","Le numérateur 3 au-dessus de la barre de fraction, le dénominateur 4 en dessous",300)}`},
{k:"II", t:"Fractions égales", h:`
  <h4>1. Par la multiplication</h4>
  <div class="retenir" data-l="Propriété 1"><p>Une fraction ne change pas si on multiplie son numérateur et son dénominateur par un même nombre.</p></div>
  <p class="big">Exemple : {2/3} = {2 × 4/3 × 4} = {8/12}</p>
  <h4>2. Par la division</h4>
  <div class="retenir" data-l="Propriété 2"><p>Une fraction ne change pas si on divise son numérateur et son dénominateur par un même nombre.</p></div>
  <p class="big">Exemple : {8/12} = {8 ÷ 4/12 ÷ 4} = {2/3}</p>`},
{k:"III", t:"Demi-droite graduée, comparaison à 1 et nombre mixte", h:`
  <h4>1. Placer une fraction sur une demi-droite graduée</h4>
  <p>Les trois quarts, écrits seuls, signifient trois quarts de 1 : c'est un nombre, on peut donc le placer sur une demi-droite graduée.</p>
  ${co("p2-11","Demi-droite graduée en quarts avec 3/4 placé avant 1",420)}
  <div class="retenir" data-l="Définition"><p>L'abscisse d'un point est le nombre qui permet de le repérer sur une demi-droite graduée.</p></div>
  <h4>2. Comparer une fraction à 1</h4>
  <div class="retenir" data-l="Propriété"><p>Une fraction est :</p><ul>
    <li><b>inférieure à 1</b> si son numérateur est plus petit que son dénominateur ;</li>
    <li><b>égale à 1</b> si son numérateur et son dénominateur sont égaux ;</li>
    <li><b>supérieure à 1</b> si son numérateur est plus grand que son dénominateur.</li></ul></div>
  <h4>3. Le nombre mixte</h4>
  <div class="retenir" data-l="Définition"><p>Une fraction supérieure à 1 peut s'écrire comme la somme d'un nombre entier et d'une fraction inférieure à 1. Cette écriture s'appelle un nombre mixte.</p></div>
  <p class="big">{7/3} = 2 + {1/3}</p>
  <p>On lit « deux et un tiers ». On en déduit aussi un encadrement : ce nombre est compris entre 2 et 3.</p>`},
{k:"IV", t:"Fractions décimales et pourcentages", h:`
  <h4>1. Les fractions décimales</h4>
  <div class="retenir" data-l="Définition"><p>Une fraction décimale est une fraction dont le dénominateur est 10, 100, 1 000, …</p></div>
  <p class="big">Exemples : {3/10} · {27/100} · {5/1 000}</p>
  <p>Chaque fraction décimale correspond à un partage de l'unité :</p>
  <div class="figs">
    ${lab("une unité : 1",co("p4-24","Un grand carré entier",110))}
    ${lab("un dixième : {1/10}",co("p4-25","Le grand carré partagé en 10 bandes, une bande coloriée",110))}
    ${lab("un centième : {1/100}",co("p4-26","Le grand carré partagé en 100 carreaux, un carreau colorié",110))}
    ${lab("un millième : {1/1 000}","")}
  </div>
  <p>Une fraction décimale se décompose en dixièmes, centièmes et millièmes :</p>
  <p class="big">{27/100} = {20/100} + {7/100} = {2/10} + {7/100}</p>
  <p>On lit : deux dixièmes et sept centièmes.</p>
  <h4>2. Les pourcentages</h4>
  <div class="retenir" data-l="Définition"><p>Un pourcentage est une fraction dont le dénominateur est 100. Le symbole % se lit « pour cent ».</p></div>
  <p class="big">25 % = {25/100} = {1/4}</p>
  <p>Prendre 25 % d'une quantité, c'est donc en prendre le quart.</p>`}
],

/* ===================== EXERCICES ===================== */
exos: [
{t:"Lire et représenter une fraction", e:[
  {n:"Activité 1", t:"Représenter des partages à l'aide de fractions", w:"Sur ton cahier", h:`<p>Dans chaque situation, hachure, à main levée et au crayon de bois, la fraction demandée.</p>
   <div class="figs" style="align-items:flex-end">${lab("Situation 1 : {1/4} de la pizza.",ex("p1-00","Une pizza",130))}${lab("Situation 2 : {2/3} de la tablette de chocolat.",ex("p1-01","Une tablette de chocolat de 3 colonnes et 6 rangées",80))}</div>`,
   c:`<p><b>Situation 1 :</b> je partage la pizza en 4 parts égales et j'en hachure 1.</p>${discs(4,1)}
   <p><b>Situation 2 :</b> la tablette a 3 colonnes de 6 carrés, soit 18 carrés. Je la partage en 3 parts égales et j'en hachure 2 : par exemple 2 colonnes sur 3, ou 12 carrés sur 18 (4 rangées sur 6).</p>${grids(3,6,12,1,22)}`},
  {n:"Exercice 1", t:"Quelle fraction a été coloriée ?", w:"Sur ton cahier", h:`<p>Dans chaque cas, écris la fraction de la surface de la figure qui a été coloriée ou hachurée.</p>
   <div class="figs">${lab("a",ex("p1-02","Disque en 6 parts",110))}${lab("b",ex("p1-03","Bande en 5 parts",170))}${lab("c",ex("p1-04","Heptagone en 7 parts",110))}${lab("d",ex("p1-05","Rectangle en 8 parts",150))}${lab("e",ex("p1-06","Bande en 2 parts",30))}${lab("f",ex("p1-07","Polygone en 9 parts",120))}</div>`,
   c:`a. {1/6} · b. {3/5} · c. {3/7} · d. {3/8} · e. {1/2} · f. {4/9}`},
  {n:"Exercice 2", t:"Lire et écrire une fraction", w:"Sur ton cahier", h:`<p>a) Dans la fraction {5/8}, quel est le numérateur ? le dénominateur ?</p>
   <p>b) Écris en lettres : {1/2} · {3/4} · {2/3}</p><p>c) Écris en chiffres : un tiers · quatre cinquièmes · neuf sixièmes</p>
   <p>d) Complète comme dans l'exemple {3/4} = {1/4} + {1/4} + {1/4} = 3 × {1/4} : &nbsp; {2/5} · {4/7} · {5/3}</p>`,
   c:`<p>a) Numérateur : 5 ; dénominateur : 8.</p><p>b) un demi · trois quarts · deux tiers</p><p>c) {1/3} · {4/5} · {9/6}</p>
   <p>d) {2/5} = {1/5} + {1/5} = 2 × {1/5} &nbsp;·&nbsp; {4/7} = {1/7} + {1/7} + {1/7} + {1/7} = 4 × {1/7} &nbsp;·&nbsp; {5/3} = {1/3} + {1/3} + {1/3} + {1/3} + {1/3} = 5 × {1/3}</p>`},
  {n:"Exercice 3", t:"QCM", w:"Sur ta feuille", h:`<p>Entoure les cas où on a colorié les {2/3} de la surface du rectangle.</p>
   <div class="figs">${ex("p2-08","Rectangles a et b",260)}${ex("p2-09","Rectangles c et d",250)}</div>`,
   c:`Les cas c et d. Dans le cas a, les parts ne sont pas égales (la partie coloriée est la moitié). Dans le cas b, il y a 5 parts égales, 2 coloriées : c'est {2/5}.`},
  {n:"Exercice 4", t:"Représenter la fraction d'une quantité", w:"Sur ta feuille", h:`
   <div class="retenir" data-l="Comment faire ?"><ol>
     <li>Je regarde le nombre du <b>bas</b> (le dénominateur) : je partage la figure en autant de <b>parts égales</b>.</li>
     <li>Je regarde le nombre du <b>haut</b> (le numérateur) : je hachure autant de parts.</li></ol>
     <div class="figs" style="margin-top:10px;align-items:center">${discs(1,0)}<span style="font-size:1.6rem">→</span>${discs(4,0)}<span style="font-size:1.6rem">→</span>${discs(4,3)}</div>
     <p>Exemple : pour les {3/4} d'une tarte, je partage la tarte en <b>4</b> parts égales, puis je hachure <b>3</b> parts.</p></div>
   <p>À main levée et au crayon de bois, sur ta feuille :</p>
   ${cg([["a)",discs(1,0),"Hachure les {3/4} de la tarte aux pommes."],["b)",verre(1,0),"Le verre est rempli aux {2/5}. Hachure l'eau."],["c)",segment(1,0),"Repasse en couleur le {1/3} du segment [AB]."],["d)",pendule(0),"Hachure un {1/4} d'heure sur la pendule."],["e)",rectN(1,0),"Hachure les {5/6} du rectangle."],["f)",discs(1,0),"Hachure les {4/8} de la quiche."]])}`,
   c:`${cg([["a)",discs(4,3),"4 parts égales, j'en hachure 3."],["b)",verre(5,2),"5 parts égales sur la hauteur, l'eau occupe les 2 du bas."],["c)",segment(3,1),"3 parts égales, je repasse la première."],["d)",pendule(1),"Une heure en 4 parts : un quart d'heure va du 12 au 3."],["e)",rectN(6,5),"6 parts égales, j'en hachure 5."],["f)",discs(8,4),"8 parts égales, j'en hachure 4 : c'est la moitié."]])}`},
  {n:"Exercice 5", t:"Quand le partage ne correspond pas au dénominateur", w:"Sur ta feuille", h:`<p>Colorie la fraction demandée : a) les {2/3} du rectangle · b) les {3/4} du rectangle · c) la {1/2} du disque · d) les {2/5} de la bande.</p>
   <div class="figs">${lab("a",ex("p2-16","Rectangle de 12 carreaux",150))}${lab("b",ex("p2-18","Rectangle de 8 carreaux",170))}${lab("c",ex("p2-20","Disque en 6 parts",110))}${lab("d",ex("p2-22","Bande de 10 cases",220))}</div>`,
   c:`<p>La figure n'a pas le bon nombre de parts : on cherche une fraction égale avec le bon dénominateur.</p>
   ${cg([["a)",grids(4,3,8),"{2/3} = {2 × 4/3 × 4} = {8/12} : 8 carreaux sur 12."],["b)",grids(4,2,6),"{3/4} = {3 × 2/4 × 2} = {6/8} : 6 carreaux sur 8."],["c)",discs(6,3),"{1/2} = {1 × 3/2 × 3} = {3/6} : 3 parts sur 6."],["d)",grids(10,1,4,1,22),"{2/5} = {2 × 2/5 × 2} = {4/10} : 4 cases sur 10."]])}`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>Quelle fraction de chaque figure est coloriée ?</p><div class="figs">${lab("a",discs(4,1))}${lab("b",grids(3,1,2))}</div>`,
  c:`a. {1/4} (1 part sur 4) · b. {2/3} (2 parts sur 3)`},
 defi:{t:"Un rectangle de 12 carreaux", w:"Sur ton cahier", h:`<p>Dessine un rectangle de 4 carreaux sur 3, puis colorie les {3/4} de ce rectangle. Combien de carreaux as-tu coloriés ?</p>`,
  c:`{3/4} = {9/12} : il faut colorier 9 carreaux sur 12.`}
},
{t:"Plus d'une unité", e:[
  {n:"Activité 2", t:"Plus d'une unité ?", w:"Sur ton cahier", h:`<p>À une soirée entre amis, Tom a mangé {5/4} de pizza. Est-ce possible ? Combien de pizzas ont été entamées ?</p><p>Représente la situation par un dessin à main levée, sur lequel tu hachureras la portion de pizza mangée par Tom.</p>`,
   c:`<p>Oui, c'est possible : {5/4} = {4/4} + {1/4} = 1 + {1/4}. Tom a mangé une pizza entière et un quart d'une deuxième pizza.</p><p>Deux pizzas ont été entamées. Je partage chaque pizza en 4 parts égales et je hachure 5 parts.</p>${discs(4,5)}`},
  {n:"Exercice 6", t:"Quelle fraction a été coloriée ?", w:"Sur ton cahier", h:`<p>Dans chaque cas, écris la fraction d'une figure qui a été coloriée ou hachurée.</p>
   <div class="figs">${lab("a",ex("p3-24","Deux hexagones en 6 parts",230))}${lab("b",ex("p3-25","Pentagone en 5 parts",130))}
   ${lab("c",`<div class="figs">${ex("p3-26","Rectangle en 3 parts entièrement colorié",110)}${ex("p3-27","Bande en 3 parts",150)}${ex("p3-28","Rectangle en 3 parts entièrement colorié",110)}</div>`)}
   ${lab("d",ex("p3-29","Rectangle en 8 parts",140))}${lab("e",`<div class="figs">${ex("p3-30","Triangle en 3 parts",90)}${ex("p3-31","Triangle en 3 parts",90)}</div>`)}${lab("f",ex("p3-32","Trois losanges en 4 parts",200))}</div>`,
   c:`a. {8/6} (6 + 2 sixièmes) · b. {2/5} · c. {8/3} (3 + 2 + 3 tiers) · d. {7/8} · e. {4/3} (3 + 1 tiers) · f. {11/4} (4 + 4 + 3 quarts)`},
  {n:"Exercice 7", t:"Représenter une fraction plus grande que 1", w:"Sur ta feuille", h:`
   <div class="retenir" data-l="Exemple"><p>Pour {5/4} d'une pizza : chaque pizza est partagée en <b>4</b>, et il faut hachurer <b>5</b> parts. Une pizza ne suffit pas (elle n'a que 4 parts) : je dessine une deuxième pizza.</p>
   <div class="figs" style="margin-top:8px">${discs(4,5)}</div><p>{5/4} = 1 pizza entière + 1 part de la deuxième.</p></div>
   <p>À main levée, hachure la portion demandée :</p>
   <p>a) On a mangé {11/6} de camembert · b) J'ai mangé {3/4} de la tranche de pain · c) On a mangé {10/4} de tranche de pain · d) Hachure les {8/5} d'un rectangle · e) Hachure les {6/8} du rectangle · f) Hachure les {7/3} d'un disque.</p>`,
   c:`${cg([["a)",discs(6,11),"Un camembert entier (6 parts) et 5 parts du second."],["b)",grids(2,2,3,1,40),"La tranche en 4 parts, j'en hachure 3."],["c)",grids(2,2,10,3,30),"2 tranches entières et 2 quarts de la troisième."],["d)",grids(5,1,8,2,26),"Un rectangle entier (5 cinquièmes) et 3 cinquièmes du second."],["e)",grids(4,2,6),"Un seul rectangle suffit : {6/8} est plus petit que 1."],["f)",discs(3,7),"Deux disques entiers et 1 tiers du troisième."]])}`},
  {n:"Exercice 8", t:"Attention aux pièges !", w:"Sur ta feuille", h:`<p>Entoure la (ou les) situation(s) où l'on a colorié les {5/8} d'un disque.</p>
   <div class="figs">${lab("a",ex("p3-43","Deux disques en 5 parts",200))}${lab("b",ex("p3-45","Un disque en 8 parts",110))}${lab("c",ex("p3-47","Deux disques en 4 parts",200))}</div>`,
   c:`Seulement la situation b : 5 parts sur 8. En a, on a colorié {8/5} (5 + 3 cinquièmes). En c, on a colorié {5/4} (4 + 1 quart).`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>Chaque disque est une unité. Quelle fraction d'unité est coloriée ?</p>${discs(4,5)}`,
  c:`Un disque entier (4 quarts) et 1 quart : {5/4}.`},
 defi:{t:"Des tablettes de chocolat", w:"Sur ton cahier", h:`<p>Une tablette a 6 carreaux. Léo a mangé {17/6} de tablette. Combien de tablettes a-t-il entamées ? Combien de tablettes entières a-t-il mangées ?</p>`,
  c:`{17/6} = 2 + {5/6} : il a mangé 2 tablettes entières et 5 carreaux d'une troisième. Il a donc entamé 3 tablettes.`}
},
{t:"Fractions égales", e:[
  {n:"Activité 3", t:"Commande de pizzas", w:"Sur ton cahier", h:`<p>Mélina et Thomas ont chacun commandé une pizza. Les deux pizzas ont la même taille.</p>
   <p>Mélina dit : « J'ai coupé ma pizza en 4 parts égales et j'en ai mangé une ! »</p><p>Thomas répond : « Ma pizza est découpée en 8 parts égales et j'en ai mangé deux. J'ai mangé une plus grande proportion de ma pizza, j'ai été plus gourmand ! »</p>
   <p>Es-tu d'accord avec Thomas ? Explique à l'aide d'un dessin.</p>`,
   c:`<div class="figs" style="align-items:flex-end">${lab("Mélina : {1/4}",discs(4,1))}${lab("Thomas : {2/8}",discs(8,2))}</div>
   <p>Non, je ne suis pas d'accord avec Thomas. Sur le dessin, les deux parties hachurées ont exactement la même taille : {2/8} = {1/4}. Thomas a des parts deux fois plus petites, mais il en a mangé deux fois plus : ils ont mangé la même quantité de pizza.</p>`},
  {n:"Exercice 9", t:"Compléter des égalités", w:"Sur ton cahier", h:`<p>a) {2/3} = {2 × …/3 × …} = {…/24} · b) {9/7} = {…/…} = {…/21} · c) {2/5} = {…/…} = {…/25}</p>
   <p>d) {7/6} = {…/…} = {…/36} · e) {30/10} = {30 ÷ …/10 ÷ …} = {…/5} · f) {40/32} = {…/…} = {…/4}</p>
   <p>g) {18/81} = {…/…} = {…/9} · h) {15/40} = {…/…} = {…/8} · i) {1/4} = {…/…} = {…/20}</p>`,
   c:`a) {2 × 8/3 × 8} = {16/24} · b) {9 × 3/7 × 3} = {27/21} · c) {2 × 5/5 × 5} = {10/25} · d) {7 × 6/6 × 6} = {42/36} · e) {30 ÷ 2/10 ÷ 2} = {15/5} · f) {40 ÷ 8/32 ÷ 8} = {5/4} · g) {18 ÷ 9/81 ÷ 9} = {2/9} · h) {15 ÷ 5/40 ÷ 5} = {3/8} · i) {1 × 5/4 × 5} = {5/20}`},
  {n:"Exercice 10", t:"Simplifier au maximum", w:"Sur ton cahier", h:`<p>Exemple : {18/24} = {9/12} = {3/4}</p><p>a) {12/18} · b) {20/25} · c) {24/36} · d) {36/48} · e) {45/60} · f) {30/100} · g) {42/56} · h) {60/90}</p>`,
   c:`a) {2/3} · b) {4/5} · c) {2/3} · d) {3/4} · e) {3/4} · f) {3/10} · g) {3/4} · h) {2/3}`},
  {n:"Exercice 11", t:"Ranger des fractions égales", w:"Sur ton cahier", h:`<p>Range ces fractions dans trois groupes : égales à {2/3}, égales à {3/4}, égales à {5/6}.</p><p>{15/18} · {6/9} · {12/18} · {10/12} · {21/28} · {6/8} · {10/15} · {20/24}</p>`,
   c:`Égales à {2/3} : {6/9}, {12/18}, {10/15} · Égales à {3/4} : {21/28}, {6/8} · Égales à {5/6} : {15/18}, {10/12}, {20/24}`},
  {n:"Exercice 12", t:"Qui a raison ?", w:"Sur ton cahier", h:`<p>Léa a mangé les {6/8} d'une tarte. Hugo a mangé les {3/4} d'une tarte identique. Hugo affirme : « J'ai mangé moins que Léa, car 3 est plus petit que 6. » A-t-il raison ? Justifie à l'aide d'une propriété du cours.</p>`,
   c:`Non. {3/4} = {3 × 2/4 × 2} = {6/8} : une fraction ne change pas si on multiplie son numérateur et son dénominateur par un même nombre. Léa et Hugo ont mangé la même quantité de tarte.`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>Complète : {1/2} = {…/4} = {…/6} = {…/10}</p>`, c:`{1/2} = {2/4} = {3/6} = {5/10} : on multiplie le numérateur et le dénominateur par 2, puis par 3, puis par 5.`},
 defi:{t:"Fractions mystères", w:"Sur ton cahier", h:`<p>a) Trouve la fraction égale à {3/5} dont le dénominateur est 35. b) Trouve la fraction égale à {3/5} dont le numérateur et le dénominateur ont pour somme 40.</p>`,
  c:`a) {3 × 7/5 × 7} = {21/35} · b) {15/25} : 15 + 25 = 40 (on a multiplié par 5).`}
},
{t:"Placer une fraction sur une demi-droite graduée", e:[
  {n:"Activité 4", t:"Une fraction, c'est aussi un nombre", w:"Sur ta feuille", h:`<p>Que veut dire {3/4} tout seul ?</p><p>Sur la demi-droite graduée ci-dessous, place les nombres {3/4} ; {4/4} et {7/4}.</p>${ex("p5-49","Demi-droite graduée de 0 à 5",420)}`,
   c:`<p>{3/4} tout seul signifie « trois quarts de 1 » : c'est un <b>nombre</b>, on peut donc le placer sur une demi-droite graduée.</p>
   <p>Je partage chaque unité en 4 parts égales. A({3/4}) est à 3 quarts depuis 0, B({4/4}) est sur la graduation 1 car {4/4} = 1, et C({7/4}) est à 7 quarts depuis 0, c'est-à-dire 3 quarts après 1.</p>${fline(2,4,[["A",3],["B",4],["C",7]])}`},
  {n:"Exercice 13", t:"Placer des fractions", w:"Sur ta feuille", h:`<p>a) Place les nombres {1/3} ; {3/3} ; {5/3}.</p>${ex("p5-50","Demi-droite graduée de 0 à 4",420)}<p>b) Place les nombres {5/6} ; {11/6} ; {22/6}.</p>${ex("p5-51","Demi-droite graduée de 0 à 4",420)}`,
   c:`<p>a) On partage chaque unité en 3 : A({1/3}), B({3/3}) = 1, C({5/3}).</p>${fline(2,3,[["A",1],["B",3],["C",5]])}
   <p>b) On partage chaque unité en 6 : D({5/6}), E({11/6}), F({22/6}).</p>${fline(4,6,[["D",5],["E",11],["F",22]])}`},
  {n:"Exercice 14", t:"Quand la graduation ne correspond pas au dénominateur", w:"Sur ta feuille", h:`<p>Transforme d'abord la fraction si c'est nécessaire.</p>
   <p>a) Graduée en sixièmes : place {1/2} ; {2/3} et {3/2}.</p>${ex("p5-52","Demi-droite graduée en sixièmes",400)}
   <p>b) Graduée en douzièmes : place {1/4} ; {5/6} et {7/4}.</p>${ex("p5-54","Demi-droite graduée en douzièmes",400)}
   <p>c) Graduée en dixièmes : place {1/5} ; {3/2} et {7/5}.</p>${ex("p5-56","Demi-droite graduée en dixièmes",400)}
   <p>d) Écris trois fractions égales à l'abscisse du point A.</p>${ex("p5-58","Demi-droite graduée en sixièmes avec le point A",400)}`,
   c:`<p>a) {1/2} = {3/6}, {2/3} = {4/6}, {3/2} = {9/6} : graduations 3, 4 et 9.</p>${fline(2,6,[["",3],["",4],["",9]])}
   <p>b) {1/4} = {3/12}, {5/6} = {10/12}, {7/4} = {21/12} : graduations 3, 10 et 21.</p>
   <p>c) {1/5} = {2/10}, {3/2} = {15/10}, {7/5} = {14/10} : graduations 2, 15 et 14.</p>
   <p>d) A est à la 4<sup>e</sup> graduation en sixièmes : A({4/6}). Fractions égales : {2/3}, {8/12}, {12/18}…</p>`},
  {n:"Exercice 15", t:"Lire l'abscisse d'un point", w:"Sur ta feuille", h:`${ex("p6-60","Quatre demi-droites graduées avec les points A, B, C, D",560)}
   <p>a) Place chaque nombre sur la demi-droite qui convient : {1/4} ; {7/10} ; {5/6} ; {4/5}.</p><p>b) Écris l'abscisse de chacun des points A, B, C et D sous forme de fraction.</p>`,
   c:`<p>a) n°1 est graduée en cinquièmes : {4/5}. n°2 en quarts : {1/4}. n°3 en dixièmes : {7/10}. n°4 en sixièmes : {5/6}.</p><p>b) A({2/5}) · B({7/4}) · C({14/10}) · D({7/6})</p>`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>Quelle est l'abscisse du point M ?</p>${fline(1,4,[["M",3]])}`, c:`L'unité est partagée en 4 : chaque graduation vaut {1/4}. M est à la 3<sup>e</sup> graduation : M({3/4}).`},
 defi:{t:"Au-delà de 2", w:"Sur ton cahier", h:`<p>Sur une demi-droite graduée en tiers, de 0 à 3, à quelles graduations (comptées à partir de 0) places-tu {5/3}, 2 et {8/3} ?</p>`,
  c:`{5/3} : 5<sup>e</sup> graduation · 2 = {6/3} : 6<sup>e</sup> graduation · {8/3} : 8<sup>e</sup> graduation.`}
},
{t:"Comparer à 1 et nombre mixte", note:`Exemple : {7/4} = 1 + {3/4}, donc 1 &lt; {7/4} &lt; 2.`, e:[
  {n:"Activité 5", t:"Fractions inférieures, égales ou supérieures à 1", w:"Sur ton cahier", h:`<p>Voici des fractions : {10/4} · {3/7} · {9/5} · {3/3} · {13/6} · {2/8}</p>
   <p>a) Encadre les fractions inférieures à 1, souligne celles égales à 1 et entoure celles supérieures à 1.</p>
   <p>b) Écris chaque fraction supérieure à 1 comme la somme d'un entier et d'une fraction inférieure à 1, puis encadre-la entre deux entiers consécutifs.</p>
   <p><i>Exemple :</i> {7/4} = 1 + {3/4} donc 1 &lt; {7/4} &lt; 2.</p>${ex("p6-61","Demi-droite graduée en quarts de 0 à 3, avec le point 7/4",420)}`,
   c:`<p>a) Une fraction est inférieure à 1 quand son numérateur est plus petit que son dénominateur, égale à 1 quand ils sont égaux, supérieure à 1 quand le numérateur est plus grand.</p>
   <p>Inférieures à 1 (encadrées) : {3/7} et {2/8}. Égale à 1 (soulignée) : {3/3}. Supérieures à 1 (entourées) : {10/4}, {9/5} et {13/6}.</p>
   <p>b) {10/4} = {8/4} + {2/4} = 2 + {2/4}, donc 2 &lt; {10/4} &lt; 3.</p><p>{9/5} = {5/5} + {4/5} = 1 + {4/5}, donc 1 &lt; {9/5} &lt; 2.</p><p>{13/6} = {12/6} + {1/6} = 2 + {1/6}, donc 2 &lt; {13/6} &lt; 3.</p>`},
  {n:"Exercice 16", t:"Des fractions supérieures à 1", w:"Sur ton cahier", h:`<p>{11/8} · {12/5} · {4/9} · {15/4} · {7/2} · {47/10} · {32/5} · {125/100}</p><p>a) Entoure les fractions supérieures à 1. b) Écris chacune comme la somme d'un entier et d'une fraction inférieure à 1, puis encadre-la entre deux entiers consécutifs.</p>`,
   c:`<p>a) Toutes sauf {4/9}, car 4 est plus petit que 9.</p>
   <p>b) {11/8} = 1 + {3/8}, donc 1 &lt; {11/8} &lt; 2 · {12/5} = 2 + {2/5}, donc 2 &lt; {12/5} &lt; 3 · {15/4} = 3 + {3/4}, donc 3 &lt; {15/4} &lt; 4 · {7/2} = 3 + {1/2}, donc 3 &lt; {7/2} &lt; 4 · {47/10} = 4 + {7/10}, donc 4 &lt; {47/10} &lt; 5 · {32/5} = 6 + {2/5}, donc 6 &lt; {32/5} &lt; 7 · {125/100} = 1 + {25/100}, donc 1 &lt; {125/100} &lt; 2</p>`},
  {n:"Exercice 17", t:"Encadrer entre deux entiers consécutifs", w:"Sur ton cahier", h:`<p>a) …… &lt; {8/6} &lt; …… · b) …… &lt; {25/4} &lt; …… · c) …… &lt; {37/10} &lt; …… · d) …… &lt; {9/2} &lt; ……</p>`,
   c:`a) 1 &lt; {8/6} &lt; 2 · b) 6 &lt; {25/4} &lt; 7 · c) 3 &lt; {37/10} &lt; 4 · d) 4 &lt; {9/2} &lt; 5`},
  {n:"Exercice 18", t:"Du nombre mixte à la fraction", w:"Sur ton cahier", h:`
   <div class="retenir" data-l="Comment faire ?"><p>Je veux écrire 2 + {1/3} avec une seule fraction.</p><ol>
     <li>Une unité partagée en 3, c'est {3/3}. Donc <b>2 unités, c'est {6/3}</b> (car 2 × 3 = 6).</li>
     <li>J'ajoute les tiers : {6/3} + {1/3} = <b>{7/3}</b> (6 tiers + 1 tiers = 7 tiers).</li></ol>
     <div class="figs" style="margin-top:8px">${discs(3,7)}</div><p>On compte bien 7 tiers coloriés : 2 + {1/3} = {7/3}.</p></div>
   <p>Écris chaque nombre sous la forme d'une seule fraction : a) 1 + {1/2} · b) 1 + {3/4} · c) 3 + {1/5} · d) 2 + {5/6}</p>`,
   c:`${cg([["a)",discs(2,3),"1 = {2/2}, donc 1 + {1/2} = {2/2} + {1/2} = {3/2}"],["b)",discs(4,7),"1 = {4/4}, donc 1 + {3/4} = {4/4} + {3/4} = {7/4}"],["c)",grids(5,1,16,4,16),"3 = {15/5} (3 × 5 = 15), donc 3 + {1/5} = {15/5} + {1/5} = {16/5}"],["d)",discs(6,17),"2 = {12/6} (2 × 6 = 12), donc 2 + {5/6} = {12/6} + {5/6} = {17/6}"]])}`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>Inférieure, égale ou supérieure à 1 ? a) {3/7} · b) {9/9} · c) {11/4}</p>`, c:`a) inférieure (3 &lt; 7) · b) égale (9 = 9) · c) supérieure (11 &gt; 4)`},
 defi:{t:"Entre 2 et 3", w:"Sur ton cahier", h:`<p>Trouve toutes les fractions de dénominateur 4 strictement comprises entre 2 et 3.</p>`, c:`2 = {8/4} et 3 = {12/4}, donc : {9/4}, {10/4} et {11/4}.`}
},
{t:"Fractions décimales", e:[
  {n:"Activité 6", t:"Partager l'unité en 10, puis en 100", w:"Sur ta feuille", h:`<p>Chaque grand carré représente <b>une unité</b>.</p>${ex("p7-62","Figure A : carré partagé en 10 bandes. Figure B : carré partagé en 100 petits carreaux",320)}
   <p>1) Quelle fraction de l'unité représente une bande de la figure A ? Et un petit carreau de la figure B ?</p>
   <p>2) Combien de petits carreaux faut-il pour recouvrir une bande ? Complète : {1/10} = {…/100} et {3/10} = {…/100}.</p>
   <p>3) Colorie les {27/100} de la figure B, puis complète : {27/100} = {…/10} + {…/100}.</p>`,
   c:`<p>1) Une bande représente {1/10} de l'unité (l'unité est partagée en 10 bandes). Un petit carreau représente {1/100} de l'unité (l'unité est partagée en 100 carreaux).</p>
   <p>2) Il faut 10 petits carreaux pour recouvrir une bande : {1/10} = {10/100} et {3/10} = {30/100}.</p>
   <p>3) Je colorie 27 petits carreaux : 2 bandes entières de 10 carreaux et 7 carreaux de plus.</p>${grids(10,10,27,1,16)}<p>{27/100} = {2/10} + {7/100}</p>`},
  {n:"Exercice 19", t:"Reconnaître une fraction décimale", w:"Sur ton cahier", h:`<p>a) Lesquelles sont des fractions décimales ? {3/10} · {7/4} · {45/100} · {10/3} · {8/1 000} · {5/20} · {13/10}</p><p>b) Écris en lettres : {3/10} · {45/100} · {8/1 000}</p><p>c) Écris en fraction : sept dixièmes · douze centièmes · neuf millièmes</p>`,
   c:`a) {3/10}, {45/100}, {8/1 000}, {13/10} · b) trois dixièmes · quarante-cinq centièmes · huit millièmes · c) {7/10} · {12/100} · {9/1 000}`},
  {n:"Exercice 20", t:"Décomposer une fraction décimale", w:"Sur ton cahier", h:`<p>a) {4/10} + {9/100} = {…/100} · b) {36/100} = {…/10} + {…/100} · c) {72/100} = {…/10} + {…/100} · d) {253/1 000} = {…/10} + {…/100} + {…/1 000} · e) {3/10} + {7/1 000} = {…/1 000}</p>`,
   c:`a) {49/100} · b) {3/10} + {6/100} · c) {7/10} + {2/100} · d) {2/10} + {5/100} + {3/1 000} · e) {307/1 000}`},
  {n:"Exercice 21", t:"Fractions décimales supérieures à 1", w:"Sur ton cahier", h:`<p>Exemple : {235/100} = 2 + {3/10} + {5/100}</p><p>a) {34/10} · b) {58/10} · c) {125/100} · d) {347/100} · e) {406/100} · f) {2 431/1 000}</p>`,
   c:`a) 3 + {4/10} · b) 5 + {8/10} · c) 1 + {2/10} + {5/100} · d) 3 + {4/10} + {7/100} · e) 4 + {0/10} + {6/100} · f) 2 + {4/10} + {3/100} + {1/1 000}`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>Écris en fraction : a) cinq dixièmes · b) trois centièmes · c) onze millièmes</p>`, c:`a) {5/10} · b) {3/100} · c) {11/1 000}`},
 defi:{t:"Avec un zéro caché", w:"Sur ton cahier", h:`<p>Décompose {3 058/1 000} en un entier, des dixièmes, des centièmes et des millièmes.</p>`, c:`{3 058/1 000} = 3 + {0/10} + {5/100} + {8/1 000}`}
},
{t:"Pourcentages", e:[
  {n:"Activité 7", t:"Qu'est-ce qu'un pourcentage ?", w:"Sur ton cahier", h:`<p>On a demandé à <b>100 élèves</b> du collège comment ils viennent : 45 viennent à pied, 30 en bus et 25 en voiture.</p>
   <p>1) Quelle fraction des élèves interrogés vient à pied ?</p><p>2) On dit que « 45 % des élèves viennent à pied » (on lit « 45 pour cent »). Que signifie « 30 % » ici ?</p><p>3) Julie affirme : « Un quart des élèves vient en voiture. » A-t-elle raison ? Explique.</p>`,
   c:`<p>1) 45 élèves sur 100 viennent à pied : c'est {45/100} des élèves interrogés.</p>
   <p>2) « 30 % » signifie 30 élèves sur 100, c'est-à-dire {30/100} des élèves : 30 % des élèves viennent en bus.</p>
   <p>3) Oui, Julie a raison : 25 élèves sur 100 viennent en voiture, soit {25/100}. Or {1/4} = {1 × 25/4 × 25} = {25/100}. Un quart des élèves, c'est 25 % des élèves.</p>`},
  {n:"Exercice 22", t:"Pourcentages et quadrillages", w:"Sur ta feuille", h:`<p>Pour les trois premiers quadrillages, écris la part coloriée sous forme de fraction, puis de pourcentage. Dans le dernier, colorie 30 %.</p>
   <div class="figs">${lab("a",ex("p8-64","Quadrillage a",130))}${lab("b",ex("p8-66","Quadrillage b",130))}${lab("c",ex("p8-68","Quadrillage c",130))}${lab("d",ex("p8-70","Quadrillage d",130))}</div>`,
   c:`<p>a) 40 carreaux sur 100 : {40/100} = 40 % · b) 75 carreaux sur 100 : {75/100} = 75 % · c) 7 carreaux sur 100 : {7/100} = 7 %</p>
   <p>d) 30 % = {30/100} : je colorie 30 carreaux sur 100, par exemple 3 lignes de 10.</p>${grids(10,10,30,1,14)}`},
  {n:"Exercice 23", t:"D'une fraction à un pourcentage", w:"Sur ton cahier", h:`<p>Exemple : {1/2} = {50/100} = 50 %</p><p>a) {1/4} · b) {3/4} · c) {1/10} · d) {1/5} · e) {7/10} · f) {2/5}</p>`,
   c:`a) {25/100} = 25 % · b) {75/100} = 75 % · c) {10/100} = 10 % · d) {20/100} = 20 % · e) {70/100} = 70 % · f) {40/100} = 40 %`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>Complète : 50 % = {…/100} = {1/…}</p>`, c:`50 % = {50/100} = {1/2} : prendre 50 %, c'est prendre la moitié.`},
 defi:{t:"Du plus petit au plus grand", w:"Sur ton cahier", h:`<p>Range du plus petit au plus grand : 30 % · {1/4} · {7/10} · {50/100}</p>`, c:`On écrit tout en centièmes : 30 % = {30/100}, {1/4} = {25/100}, {7/10} = {70/100}. Donc {1/4} &lt; 30 % &lt; {50/100} &lt; {7/10}.`}
}
],

/* ===================== QUIZ PROGRESSIF ===================== */
quiz: [
{nom:"Lire une fraction", q:{
 1:[ {q:"Quelle fraction du disque est coloriée ?", fig:discs(4,3), rep:"3/4"},
     {q:"Quelle fraction de la bande est coloriée ?", fig:grids(5,1,2), rep:"2/5"},
     {q:"Quelle fraction du rectangle est coloriée ?", fig:grids(3,2,1), rep:"1/6"} ],
 2:[ {q:"Quelle fraction du rectangle est coloriée ?", fig:grids(4,3,8), rep:["8/12","2/3","4/6"], ex:"8 carreaux sur 12, c'est {8/12}, qui est égale à {2/3}."},
     {q:"Quelle fraction du disque est coloriée ?", fig:discs(8,5), rep:"5/8"},
     {q:"Quelle fraction de la bande est coloriée ?", fig:grids(10,1,7,1,24), rep:"7/10"} ],
 3:[ {q:"Chaque disque est une unité. Quelle fraction d'unité est coloriée ?", fig:discs(4,7), rep:"7/4", ex:"4 quarts dans le premier disque et 3 dans le second : {7/4}."},
     {q:"Chaque disque est une unité. Quelle fraction d'unité est coloriée ?", fig:discs(6,8), rep:["8/6","4/3"], ex:"6 sixièmes + 2 sixièmes = {8/6}."},
     {q:"La partie coloriée représente-t-elle {1/3} du rectangle ?", fig:parts([60,150,90],[0]), c:["Non, les trois parts ne sont pas égales","Oui, c'est une part sur trois"], rep:"Non, les trois parts ne sont pas égales", ex:"Une fraction correspond à un partage en parts égales."} ]
}},
{nom:"Écrire une fraction", q:{
 1:[ {q:"Dans la fraction {5/8}, quel est le dénominateur ?", rep:"8", ex:"Le dénominateur est en dessous de la barre : il donne le nombre de parts égales."},
     {q:"Dans la fraction {3/7}, quel est le numérateur ?", rep:"3", ex:"Le numérateur est au-dessus de la barre : il donne le nombre de parts prises."},
     {q:"Comment lit-on {1/2} ?", c:["un demi","un deuxième","deux demis"], rep:"un demi"} ],
 2:[ {q:"Écris en chiffres : quatre cinquièmes", rep:"4/5"},
     {q:"Comment lit-on {2/3} ?", c:["deux tiers","deux troisièmes","trois demis","trois deuxièmes"], rep:"deux tiers"},
     {q:"Écris en chiffres : neuf sixièmes", rep:"9/6"} ],
 3:[ {q:"Complète.", t:"{4/7} = □ × {1/7}", r:["4"], ex:"{4/7}, c'est 4 fois un septième."},
     {q:"Complète.", t:"{1/5} + {1/5} + {1/5} = {□/5}", r:["3"], ex:"3 cinquièmes : {3/5}."},
     {q:"Quelle égalité est vraie ?", c:["{5/3} = 5 × {1/3}","{5/3} = 3 × {1/5}","{5/3} = {1/3} + {1/3}","{5/3} = 5 + {1/3}"], rep:"{5/3} = 5 × {1/3}"} ]
}},
{nom:"Fractions égales", q:{
 1:[ {q:"Complète.", t:"{2/3} = {□/12}", r:["8"], ex:"On a multiplié le dénominateur par 4, donc le numérateur aussi : 2 × 4 = 8."},
     {q:"Complète.", t:"{10/15} = {2/□}", r:["3"], ex:"On a divisé le numérateur par 5, donc le dénominateur aussi : 15 ÷ 5 = 3."},
     {q:"Quelle fraction est égale à {1/2} ?", c:["{3/6}","{2/3}","{1/4}","{2/1}"], rep:"{3/6}", ex:"{1/2} = {1 × 3/2 × 3} = {3/6}."} ],
 2:[ {q:"Simplifie au maximum {12/18}.", rep:"2/3", ex:"On divise par 6 : {12 ÷ 6/18 ÷ 6} = {2/3}."},
     {q:"Complète.", t:"{5/6} = {□/48}", r:["40"], ex:"6 × 8 = 48, donc 5 × 8 = 40."},
     {q:"Complète.", t:"{24/□} = {4/5}", r:["30"], ex:"24 = 4 × 6, donc le dénominateur est 5 × 6 = 30."} ],
 3:[ {q:"Simplifie au maximum {54/72}.", rep:"3/4", ex:"On divise par 18 : {54 ÷ 18/72 ÷ 18} = {3/4}."},
     {q:"Quelle fraction n'est pas égale à {3/4} ?", c:["{9/16}","{6/8}","{15/20}","{75/100}"], rep:"{9/16}", ex:"Pour {9/16}, on a multiplié le numérateur par 3 mais le dénominateur par 4."},
     {q:"Léa a mangé {6/8} d'une tarte, Hugo {3/4} d'une tarte identique. Qui a mangé le plus ?", c:["Ils ont mangé autant","Léa","Hugo"], rep:"Ils ont mangé autant", ex:"{3/4} = {6/8}."} ]
}},
{nom:"Demi-droite graduée", q:{
 1:[ {q:"Quelle est l'abscisse du point A ?", fig:fline(2,4,[["A",3]]), rep:"3/4"},
     {q:"Quelle est l'abscisse du point B ?", fig:fline(2,3,[["B",2]]), rep:"2/3"},
     {q:"Sur une demi-droite graduée en quarts, en combien de parts égales l'unité est-elle partagée ?", c:["4","3","5"], rep:"4"} ],
 2:[ {q:"Quelle est l'abscisse du point C ?", fig:fline(2,5,[["C",7]]), rep:"7/5", ex:"L'unité est partagée en 5 et C est à la 7e graduation."},
     {q:"Sur une demi-droite graduée en sixièmes, combien de graduations après 0 faut-il compter pour placer {11/6} ?", rep:"11"},
     {q:"Où se place {3/3} ?", c:["Sur la graduation 1","Entre 0 et 1","Entre 1 et 2"], rep:"Sur la graduation 1", ex:"{3/3} = 1."} ],
 3:[ {q:"Sur une demi-droite graduée en sixièmes, à quelle graduation après 0 place-t-on {2/3} ?", rep:"4", ex:"{2/3} = {4/6}."},
     {q:"Quelle est l'abscisse du point D ?", fig:fline(2,10,[["D",14]]), rep:["14/10","7/5"], ex:"Graduée en dixièmes : D est à la 14e graduation."},
     {q:"Sur une demi-droite graduée en douzièmes, à quelle graduation après 0 place-t-on {7/4} ?", rep:"21", ex:"{7/4} = {21/12}."} ]
}},
{nom:"Comparer une fraction à 1", q:{
 1:[ {q:"{7/9} est :", c:["inférieure à 1","égale à 1","supérieure à 1"], rep:"inférieure à 1", ex:"7 est plus petit que 9."},
     {q:"{15/15} est :", c:["égale à 1","inférieure à 1","supérieure à 1"], rep:"égale à 1", ex:"Le numérateur et le dénominateur sont égaux."},
     {q:"{13/6} est :", c:["supérieure à 1","inférieure à 1","égale à 1"], rep:"supérieure à 1", ex:"13 est plus grand que 6."} ],
 2:[ {q:"Laquelle de ces fractions est supérieure à 1 ?", c:["{9/5}","{5/9}","{7/7}","{3/8}"], rep:"{9/5}"},
     {q:"Laquelle de ces fractions est égale à 1 ?", c:["{6/6}","{6/1}","{1/6}","{6/12}"], rep:"{6/6}"},
     {q:"Laquelle de ces fractions est inférieure à 1 ?", c:["{11/12}","{12/11}","{12/12}","{21/12}"], rep:"{11/12}"} ],
 3:[ {q:"Tom dit que {4/9} est plus grand que 1 « car 4 et 9 sont plus grands que 1 ». A-t-il raison ?", c:["Non : 4 est plus petit que 9, donc {4/9} est inférieure à 1","Oui"], rep:"Non : 4 est plus petit que 9, donc {4/9} est inférieure à 1", ex:"On compare le numérateur au dénominateur."},
     {q:"Combien de ces fractions sont supérieures à 1 ? {10/4} · {3/7} · {9/5} · {3/3} · {13/6} · {2/8}", c:["3","2","4","6"], rep:"3", ex:"{10/4}, {9/5} et {13/6}. Attention : {3/3} est égale à 1."},
     {q:"Pour que {□/8} soit supérieure à 1, le numérateur peut être :", c:["9","8","7","1"], rep:"9", ex:"Il faut un numérateur plus grand que 8."} ]
}},
{nom:"Entier + fraction inférieure à 1", q:{
 1:[ {q:"Complète.", t:"{5/4} = 1 + {□/4}", r:["1"], ex:"1 = {4/4}, et il reste {1/4}."},
     {q:"Complète.", t:"{3/2} = 1 + {□/2}", r:["1"], ex:"1 = {2/2}, et il reste {1/2}."},
     {q:"Complète.", t:"{7/5} = 1 + {□/5}", r:["2"], ex:"1 = {5/5}, et il reste {2/5}."} ],
 2:[ {q:"Complète.", t:"{7/3} = □ + {□/3}", r:["2","1"], ex:"{6/3} = 2, et il reste {1/3}."},
     {q:"Complète.", t:"{11/4} = □ + {□/4}", r:["2","3"], ex:"{8/4} = 2, et il reste {3/4}."},
     {q:"Complète.", t:"{17/5} = □ + {□/5}", r:["3","2"], ex:"{15/5} = 3, et il reste {2/5}."} ],
 3:[ {q:"Complète.", t:"{38/7} = □ + {□/7}", r:["5","3"], ex:"5 × 7 = 35, et 38 − 35 = 3."},
     {q:"Complète.", t:"{47/10} = □ + {□/10}", r:["4","7"], ex:"{40/10} = 4, et il reste {7/10}."},
     {q:"Écris sous la forme d'une seule fraction.", t:"2 + {3/5} = {□/5}", r:["13"], ex:"2 = {10/5}, et 10 + 3 = 13."},
     {q:"Écris sous la forme d'une seule fraction.", t:"3 + {1/4} = {□/4}", r:["13"], ex:"3 = {12/4}, et 12 + 1 = 13."},
     {q:"Quelle est la bonne décomposition de {23/6} ?", c:["3 + {5/6}","2 + {11/6}","3 + {6/5}","4 + {1/6}"], rep:"3 + {5/6}", ex:"3 × 6 = 18, et 23 − 18 = 5. La fraction qui reste doit être inférieure à 1."} ]
}},
{nom:"Encadrer entre deux entiers consécutifs", q:{
 1:[ {q:"Que veut dire « deux entiers consécutifs » ?", c:["Deux entiers qui se suivent, comme 3 et 4","Deux entiers pairs, comme 2 et 4","Deux entiers quelconques"], rep:"Deux entiers qui se suivent, comme 3 et 4"},
     {q:"Encadre entre deux entiers consécutifs.", t:"□ &lt; {5/4} &lt; □", r:["1","2"], ex:"{5/4} = 1 + {1/4} : c'est un peu plus que 1."},
     {q:"Encadre entre deux entiers consécutifs.", t:"□ &lt; {3/2} &lt; □", r:["1","2"], ex:"{3/2} = 1 + {1/2}."} ],
 2:[ {q:"Encadre entre deux entiers consécutifs.", t:"□ &lt; {7/3} &lt; □", r:["2","3"], ex:"{7/3} = 2 + {1/3}."},
     {q:"Encadre entre deux entiers consécutifs.", t:"□ &lt; {9/2} &lt; □", r:["4","5"], ex:"{9/2} = 4 + {1/2}."},
     {q:"Encadre entre deux entiers consécutifs.", t:"□ &lt; {11/4} &lt; □", r:["2","3"], ex:"{11/4} = 2 + {3/4}."} ],
 3:[ {q:"Encadre entre deux entiers consécutifs.", t:"□ &lt; {25/4} &lt; □", r:["6","7"], ex:"{24/4} = 6 et {28/4} = 7."},
     {q:"Encadre entre deux entiers consécutifs.", t:"□ &lt; {37/10} &lt; □", r:["3","4"], ex:"{37/10} = 3 + {7/10}."},
     {q:"Encadre entre deux entiers consécutifs.", t:"□ &lt; {50/7} &lt; □", r:["7","8"], ex:"7 × 7 = 49 : {50/7} = 7 + {1/7}."},
     {q:"Quel encadrement entre deux entiers consécutifs est correct ?", c:["4 &lt; {13/3} &lt; 5","3 &lt; {13/3} &lt; 4","4 &lt; {13/3} &lt; 6","13 &lt; {13/3} &lt; 14"], rep:"4 &lt; {13/3} &lt; 5", ex:"{13/3} = 4 + {1/3}. 4 et 6 ne sont pas consécutifs."} ]
}},
{nom:"Fractions décimales", q:{
 1:[ {q:"Laquelle est une fraction décimale ?", c:["{7/100}","{7/4}","{10/3}","{5/20}"], rep:"{7/100}", ex:"Son dénominateur est 100."},
     {q:"Comment lit-on {3/10} ?", c:["trois dixièmes","trois centièmes","trois dizaines"], rep:"trois dixièmes"},
     {q:"Écris en fraction : douze centièmes", rep:"12/100"} ],
 2:[ {q:"Complète.", t:"{4/10} + {9/100} = {□/100}", r:["49"], ex:"{4/10} = {40/100}, et 40 + 9 = 49."},
     {q:"Complète.", t:"{9/10} = {□/100}", r:["90"]},
     {q:"Complète.", t:"{36/100} = {□/10} + {□/100}", r:["3","6"], ex:"36 centièmes, c'est 3 dixièmes et 6 centièmes."} ],
 3:[ {q:"Complète.", t:"{163/100} = □ + {□/10} + {□/100}", r:["1","6","3"]},
     {q:"Complète.", t:"{7/10} = {□/1 000}", r:["700"]},
     {q:"Complète.", t:"{3/10} + {7/1 000} = {□/1 000}", r:["307"], ex:"{3/10} = {300/1 000}, et 300 + 7 = 307."} ]
}},
{nom:"Pourcentages", q:{
 1:[ {q:"Complète.", t:"75 % = {□/100}", r:["75"]},
     {q:"Que signifie 30 % ?", c:["{30/100}","{30/10}","{100/30}","{3/100}"], rep:"{30/100}"} ],
 2:[ {q:"Complète.", t:"{1/4} = □ %", r:["25"], ex:"{1/4} = {25/100} = 25 %."},
     {q:"Complète.", t:"{1/10} = {□/100} = □ %", r:["10","10"]},
     {q:"Complète.", t:"50 % = {1/□}", r:["2"], ex:"50 % = {50/100} = {1/2} : c'est la moitié."} ],
 3:[ {q:"Complète.", t:"{3/5} = □ %", r:["60"], ex:"{3/5} = {60/100} = 60 %."},
     {q:"Complète.", t:"{7/10} = □ %", r:["70"], ex:"{7/10} = {70/100} = 70 %."},
     {q:"Prendre 25 % d'une quantité, c'est en prendre :", c:["le quart","la moitié","le tiers","le dixième"], rep:"le quart"} ]
}}
],

/* ===================== ÉVAL D'ENTRAÎNEMENT ===================== */
eval: {
titre:"Évaluation d'entraînement n° 3", duree:55, info:"Durée : 55 min · Matériel : règle graduée · Calculatrice non autorisée",
comp:[
  ["REPRÉSENTER","Je lis et je représente une fraction : sur une figure et sur une demi-droite graduée.","Ex. 1 et 3 (8 points)"],
  ["CALCULER","Je produis des fractions égales et je décompose une fraction décimale.","Ex. 2 et 5 (6 points)"],
  ["RAISONNER","Je compare une fraction à 1 et je l'écris en nombre mixte.","Ex. 4 (4 points)"],
  ["COMMUNIQUER","J'explique ma réponse.","Ex. 6 (2 points)"]
],
exos:[
{t:"Lire et représenter une fraction", p:4, h:`<p>1) Écris la fraction de chaque figure qui est coloriée.</p><div class="figs">${lab("a",grids(4,3,5))}${lab("b",discs(6,4))}</div>
  <p>2) Reproduis ce rectangle et colorie les {3/4} de ce rectangle.</p>${grids(4,2,0)}
  <p>3) Chaque rectangle représente une unité. Reproduis-les et hachure {5/3} d'unité.</p>${grids(3,1,0,2)}
  <p>4) Complète : {5/3} = … + {…/…} et {5/3} = … × {…/…}</p>`,
 c:`<p>1) a. {5/12} · b. {4/6} (ou {2/3}) <i>(0,5 point chacun)</i></p>
  <p>2) {3/4} = {6/8} : 6 carreaux sur 8 <i>(1 point)</i></p>${grids(4,2,6)}
  <p>3) Un rectangle entier et 2 tiers du second <i>(1 point)</i></p>${grids(3,1,5,2)}
  <p>4) {5/3} = 1 + {2/3} et {5/3} = 5 × {1/3} <i>(0,5 point chacun)</i></p>`},
{t:"Fractions égales", p:3, h:`<p>1) Complète : a) {2/5} = {…/40} · b) {35/42} = {5/…} · c) {3/8} = {…/56} · d) {36/…} = {4/7}</p>
  <p>2) Simplifie au maximum : {30/45}</p>
  <p>3) Quelles fractions sont égales à {2/3} ? {4/6} · {6/12} · {10/15} · {22/33} · {8/9}</p>`,
 c:`<p>1) a) {16/40} · b) {5/6} · c) {21/56} · d) {36/63} <i>(0,25 point chacun)</i></p>
  <p>2) {30/45} = {30 ÷ 15/45 ÷ 15} = {2/3} <i>(1 point)</i></p>
  <p>3) {4/6}, {10/15} et {22/33} <i>(1 point)</i></p>`},
{t:"Demi-droite graduée", p:4, h:`<p>1) Écris l'abscisse des points A et B sous forme de fraction.</p>${fline(2,5,[["A",3],["B",8]])}
  <p>2) Écris l'abscisse de B sous la forme d'un nombre entier plus une fraction inférieure à 1.</p>
  <p>3) Reproduis la demi-droite et place les points C, D et E d'abscisses {1/2} ; {4/5} et {13/10}.</p>${fline(2,10)}
  <p>4) Écris deux fractions égales à l'abscisse du point A.</p>`,
 c:`<p>1) A({3/5}) · B({8/5}) <i>(0,5 point chacun)</i></p>
  <p>2) {8/5} = 1 + {3/5} <i>(1 point)</i></p>
  <p>3) La demi-droite est graduée en dixièmes : {1/2} = {5/10}, {4/5} = {8/10}, {13/10} <i>(0,5 point par point)</i></p>${fline(2,10,[["C",5],["D",8],["E",13]])}
  <p>4) Par exemple {6/10} et {9/15} <i>(0,5 point)</i></p>`},
{t:"Comparer à 1 et nombre mixte", p:4, h:`<p>On donne les fractions : {19/6} · {5/8} · {12/12} · {31/4} · {3/7} · {11/10}</p>
  <p>1) Quelles fractions sont supérieures à 1 ? Laquelle est égale à 1 ?</p>
  <p>2) Écris {19/6} et {31/4} sous la forme d'un nombre entier plus une fraction inférieure à 1.</p>
  <p>3) À l'inverse, écris 4 + {1/3} sous la forme d'une seule fraction.</p>
  <p>4) Encadre {31/4} entre deux entiers consécutifs : …… &lt; {31/4} &lt; ……</p>`,
 c:`<p>1) Supérieures à 1 : {19/6}, {31/4}, {11/10}. Égale à 1 : {12/12} <i>(1 point)</i></p>
  <p>2) {19/6} = 3 + {1/6} · {31/4} = 7 + {3/4} <i>(0,5 point chacun)</i></p>
  <p>3) 4 + {1/3} = {12/3} + {1/3} = {13/3} <i>(1 point)</i></p>
  <p>4) 7 &lt; {31/4} &lt; 8 <i>(1 point)</i></p>`},
{t:"Fractions décimales et pourcentage", p:3, h:`<p>1) Écris ces fractions en lettres : {37/100} · {209/1 000}</p>
  <p>2) Complète : {3/10} = {…/100} = {…/1 000}</p>
  <p>3) Décompose : {258/100} = … + {…/10} + {…/100}</p>
  <p>4) Complète : {2/5} = {…/100}, c'est-à-dire …… % de l'unité.</p>`,
 c:`<p>1) trente-sept centièmes · deux-cent-neuf millièmes <i>(0,5 point chacun)</i></p>
  <p>2) {30/100} = {300/1 000} <i>(0,5 point)</i></p>
  <p>3) 2 + {5/10} + {8/100} <i>(0,5 point)</i></p>
  <p>4) {40/100}, c'est-à-dire 40 % <i>(1 point)</i></p>`},
{t:"Raisonner et expliquer", p:2, h:`<p>1) Nina affirme que la partie coloriée représente {1/4} de cette figure. A-t-elle raison ? Explique.</p>${parts([180,60,60,60],[1])}
  <p>2) Inès affirme que {9/8} est plus petit que 1, « car 9 et 8 sont tous les deux plus petits que 10 ». A-t-elle raison ? Explique.</p>`,
 c:`<p>1) Non : la figure est partagée en 4 parts, mais elles ne sont pas égales. Une fraction correspond à un partage en parts égales. <i>(1 point)</i></p>
  <p>2) Non : on compare le numérateur au dénominateur. 9 est plus grand que 8, donc {9/8} est supérieure à 1. <i>(1 point)</i></p>`}
]}
};
window.FIG3 = {verre, segment, pendule, rectN, cg, lab};
})();
