/* 5e — Chapitre 10 : Calcul littéral et équations (cours, fiche d'exercices et corrigé de M. Staal)
   Les lettres sont en italique (<i>x</i>) et on écrit 3<i>x</i> sans signe ×, comme dans le cours. */
(function(){
const VF=["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const ch3=(good,bads)=>shuf(uniq(good,bads).slice(0,3));
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const ex = (p,alt,w) => img("5k10ex/"+p+".png", alt, w);
const r3 = x => Math.round(x*1000)/1000;
/* écriture française d'un nombre : 2,5 · 1 200 · −3 */
const F = x => { const r=r3(x); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
/* expressions littérales */
const X = v => `<i>${v}</i>`;
const mono = (a,v="x") => a===1 ? X(v) : F(a)+X(v);                                   /* 3x, x, 2,5x */
const lin = (a,b,v="x") => a===0 ? F(b) : mono(a,v)+(b>0?` + ${F(b)}`:b<0?` − ${F(-b)}`:"");   /* ax + b */
const par = (k,b,v="x") => `${k===1?"":F(k)}(${X(v)}${b<0?"−"+F(-b):"+"+F(b)})`;     /* k(x+b) */
window.ALG = {F, X, mono, lin, par, r3};

/* ===================== schémas ===================== */
const S_EXPR = sch("Écrire et calculer une expression", `<p class="calc">2 × ${X("n")} = 2${X("n")} &nbsp;&nbsp; 5 × (${X("x")}+2) = 5(${X("x")}+2) &nbsp;&nbsp; 1${X("x")} = ${X("x")}</p><p class="calc">Pour ${X("x")} = 4 : 3${X("x")} + 2 = 3 × 4 + 2 = 12 + 2 = 14</p><p class="schN">Je remplace la lettre par sa valeur, en remettant le signe ×. Puis je respecte les priorités.</p>`);
const S_TEST = sch("Tester une égalité", `<p class="calc">Pour ${X("x")} = 4 : 2${X("x")} + 3 = 11 et ${X("x")} + 7 = 11 → vraie</p><p class="calc">Pour ${X("x")} = 2 : 2${X("x")} + 3 = 7 et ${X("x")} + 7 = 9 → fausse</p><p class="schN">On calcule séparément les deux membres, puis on compare.</p>`);
const S_DEV = sch("Développer et factoriser", `<p class="calc">${X("k")}(${X("a")}+${X("b")}) = ${X("k")}${X("a")} + ${X("k")}${X("b")} &nbsp;&nbsp; ${X("k")}(${X("a")}−${X("b")}) = ${X("k")}${X("a")} − ${X("k")}${X("b")}</p><p class="calc">Développer : 3(${X("x")}+5) = 3${X("x")} + 15<br>Factoriser : 5${X("x")} + 10 = 5(${X("x")}+2)</p><p class="schN">Développer : produit → somme. Factoriser : somme → produit.</p>`);
const S_RED = sch("Réduire une expression", `<p class="calc">7${X("x")} − 2${X("x")} + 4 = (7−2)${X("x")} + 4 = 5${X("x")} + 4</p><p class="schN">Je regroupe les termes en ${X("x")} entre eux, et les nombres entre eux.</p>`);
const S_DEM = sch("Démontrer et réfuter", `<p class="calc">${X("n")} + (${X("n")}+1) = 2${X("n")} + 1 : toujours impair</p><p class="schN">Des exemples ne suffisent pas pour démontrer : on utilise une lettre. Pour montrer qu'une affirmation est fausse, <b>un seul</b> contre-exemple suffit.</p>`);
const S_EQ = sch("Résoudre une équation", `<p class="calc">${X("x")} + 7 = 15 donc ${X("x")} = 15 − 7 = 8<br>3${X("x")} = 21 donc ${X("x")} = 21 ÷ 3 = 7</p><p class="schN">J'utilise l'opération inverse, puis je vérifie : 8 + 7 = 15.</p>`);

/* ===================== tableaux de la fiche ===================== */
const tab = (head, rows) => `<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const XS2 = [0,2,1.5,5];
const E2 = [[lin(3,4), x=>3*x+4],[par(5,2), x=>5*(x+2)],[`10 − 2${X("x")}`, x=>10-2*x],[`${X("x")} × ${X("x")} + 1`, x=>x*x+1]];
const T4 = [4,2,0,6];

CH["5e-10"] = {
intro:"Écrire une formule avec une lettre, calculer sa valeur, tester une égalité, développer, factoriser et réduire, démontrer ou réfuter avec le calcul littéral, et résoudre des équations simples.",
savoir:[
  "produire une formule et calculer sa valeur pour une valeur donnée de la lettre ;",
  "tester si une égalité est vraie ou fausse ;",
  `développer et factoriser avec ${X("k")}(${X("a")}+${X("b")}) = ${X("k")}${X("a")} + ${X("k")}${X("b")} et ${X("k")}(${X("a")}−${X("b")}) = ${X("k")}${X("a")} − ${X("k")}${X("b")} ;`,
  `réduire une expression de la forme ${X("a")}${X("x")} + ${X("b")} ;`,
  "démontrer une propriété par le calcul littéral, ou la réfuter par un contre-exemple ;",
  `résoudre une équation du type ${X("x")} + ${X("b")} = ${X("c")} ou ${X("a")}${X("x")} = ${X("c")}.`
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Expressions littérales", h:`
  <h4>1. Produire une formule</h4>
  <div class="retenir" data-l="Définition"><p>Une <b>expression littérale</b> est une expression qui contient une ou plusieurs lettres, chacune représentant un nombre.</p><p>Elle permet d'écrire une formule valable pour tous les nombres.</p></div>
  <p><b>Exemples :</b></p>
  <ul><li>Le double de ${X("n")} s'écrit 2 × ${X("n")}.</li><li>Son successeur s'écrit ${X("n")} + 1.</li><li>Son prédécesseur s'écrit ${X("n")} − 1.</li>
  <li>Le périmètre d'un rectangle de longueur ${X("L")} et de largeur ${X("l")} est ${X("P")} = 2 × (${X("L")}+${X("l")}).</li><li>Son aire est ${X("A")} = ${X("L")} × ${X("l")}.</li></ul>
  <div class="attention"><b>ATTENTION :</b> en calcul littéral, on <b>supprime le signe ×</b> devant une lettre ou une parenthèse :<p class="calc">2 × ${X("n")} = 2${X("n")} &nbsp;&nbsp; ${X("a")} × ${X("b")} = ${X("a")}${X("b")} &nbsp;&nbsp; 5 × (${X("x")}+2) = 5(${X("x")}+2)</p>On n'écrit jamais 1${X("x")}, mais simplement ${X("x")}.</div>
  <h4>2. Calculer une valeur</h4>
  <div class="retenir" data-l="Méthode"><p>Pour calculer la valeur d'une expression pour une valeur donnée de la lettre :</p><p><b>1)</b> je remplace chaque lettre par sa valeur (en remettant le signe ×) ;</p><p><b>2)</b> je calcule en respectant les priorités opératoires.</p></div>
  <p><b>Exemples :</b></p>
  <p class="calc">Pour ${X("x")} = 4 : 3${X("x")} + 2 = 3 × 4 + 2 = 12 + 2 = 14</p>
  <p class="calc">Pour ${X("x")} = 1,5 : 5(${X("x")}+2) = 5 × (1,5+2) = 5 × 3,5 = 17,5</p>
  <h4>3. Tester une égalité</h4>
  <div class="retenir" data-l="À retenir"><p>Une égalité contenant une lettre peut être <b>vraie</b> pour certaines valeurs de la lettre, et <b>fausse</b> pour d'autres.</p><p>Pour la tester, on calcule séparément les deux membres.</p></div>
  <p><b>Exemple :</b> on teste l'égalité 2${X("x")} + 3 = ${X("x")} + 7.</p>
  <p class="calc">Pour ${X("x")} = 4 : 2${X("x")} + 3 = 2 × 4 + 3 = 11 et ${X("x")} + 7 = 4 + 7 = 11</p><p>Les deux membres sont égaux : l'égalité est <b>vraie</b>.</p>
  <p class="calc">Pour ${X("x")} = 2 : 2${X("x")} + 3 = 7 et ${X("x")} + 7 = 9</p><p>Les deux membres sont différents : l'égalité est <b>fausse</b>.</p>`},
{k:"II", t:"Développer, factoriser, réduire", h:`
  <h4>1. Distributivité</h4>
  <div class="retenir" data-l="Propriétés"><p>Pour tous nombres ${X("k")}, ${X("a")} et ${X("b")} :</p><p class="calc">${X("k")}(${X("a")}+${X("b")}) = ${X("k")}${X("a")} + ${X("k")}${X("b")}<br>${X("k")}(${X("a")}−${X("b")}) = ${X("k")}${X("a")} − ${X("k")}${X("b")}</p><p><b>Développer</b>, c'est transformer un produit en une somme (de gauche à droite).</p><p><b>Factoriser</b>, c'est transformer une somme en un produit (de droite à gauche).</p></div>
  <p><b>Exemples :</b></p>
  <p class="calc">Développer : 3(${X("x")}+5) = 3${X("x")} + 3 × 5 = 3${X("x")} + 15 &nbsp;&nbsp; 4(${X("x")}−2) = 4${X("x")} − 8</p>
  <p class="calc">Factoriser : 5${X("x")} + 10 = 5 × ${X("x")} + 5 × 2 = 5(${X("x")}+2) &nbsp;&nbsp; 6${X("x")} − 6 = 6(${X("x")}−1)</p>
  <h4>2. Réduire une expression</h4>
  <div class="retenir" data-l="Définition"><p><b>Réduire</b> une expression, c'est l'écrire avec le moins de termes possible.</p><p>On regroupe les termes de même nature : les termes en ${X("x")} entre eux, les nombres entre eux.</p></div>
  <p><b>Exemples :</b></p>
  <p class="calc">7${X("x")} − 2${X("x")} + 4 = (7−2)${X("x")} + 4 = 5${X("x")} + 4</p>
  <p class="calc">2${X("x")} + 3 + 5${X("x")} − 1 = 7${X("x")} + 2</p>
  <p><b>À toi de jouer :</b> développe 6(${X("y")}+4), puis factorise 9${X("x")} + 27.</p>
  <details><summary>Voir la correction</summary><div class="corr"><p class="calc">6(${X("y")}+4) = 6${X("y")} + 6 × 4 = 6${X("y")} + 24</p><p class="calc">9${X("x")} + 27 = 9 × ${X("x")} + 9 × 3 = 9(${X("x")}+3)</p></div></details>`},
{k:"III", t:"Démontrer et réfuter", h:`
  <h4>1. Démontrer une propriété générale</h4>
  <div class="retenir" data-l="À retenir"><p>Des exemples ne suffisent pas à prouver qu'une propriété est toujours vraie.</p><p>Pour la démontrer, on <b>utilise une lettre</b> qui représente n'importe quel nombre, et on calcule.</p></div>
  <p><b>Exemple :</b> <b>Propriété :</b> la somme de deux entiers consécutifs est un nombre impair.</p>
  <p><b>Preuve :</b> si ${X("n")} est le premier entier, le suivant est ${X("n")} + 1. Leur somme est :</p>
  <p class="calc">${X("n")} + (${X("n")}+1) = 2${X("n")} + 1</p>
  <p>C'est un nombre impair, puisque 2${X("n")} est pair.</p>
  <h4>2. Réfuter avec un contre-exemple</h4>
  <div class="retenir" data-l="Définition"><p>Pour montrer qu'une affirmation est <b>fausse</b>, il suffit de trouver <b>un seul</b> cas où elle ne marche pas : c'est un <b>contre-exemple</b>.</p></div>
  <p><b>Exemple :</b> « Le double d'un nombre est toujours plus grand que ce nombre » est faux.</p><p>Pour 0 : le double de 0 est 0, qui n'est pas plus grand que 0.</p>`},
{k:"IV", t:"Équations", h:`
  <div class="retenir" data-l="Définition"><p>Une <b>équation</b> est une égalité qui contient une lettre appelée <b>inconnue</b>.</p><p>Une <b>solution</b> est une valeur de l'inconnue pour laquelle l'égalité est vraie.</p><p><b>Résoudre</b> une équation, c'est trouver toutes ses solutions.</p></div>
  <h4>Résoudre ${X("x")} + ${X("b")} = ${X("c")} et ${X("a")}${X("x")} = ${X("c")}</h4>
  <div class="retenir" data-l="Méthode"><p><b>1)</b> Pour ${X("x")} + ${X("b")} = ${X("c")}, j'utilise l'opération inverse : ${X("x")} = ${X("c")} − ${X("b")} ;</p><p><b>2)</b> pour ${X("a")}${X("x")} = ${X("c")}, j'utilise l'opération inverse : ${X("x")} = ${X("c")} ÷ ${X("a")} ;</p><p><b>3)</b> je vérifie en remplaçant ${X("x")} par la solution dans l'équation.</p></div>
  <p><b>Exemples :</b></p>
  <p class="calc">${X("x")} + 7 = 15 donc ${X("x")} = 15 − 7 = 8. &nbsp; Vérification : 8 + 7 = 15.</p>
  <p class="calc">3${X("x")} = 21 donc ${X("x")} = 21 ÷ 3 = 7</p>
  <p class="calc">4${X("x")} = 30 donc ${X("x")} = 30 ÷ 4 = 7,5</p>
  <p><b>À toi de jouer :</b> résous ${X("x")} + 2,5 = 6, puis 5${X("x")} = 2.</p>
  <details><summary>Voir la correction</summary><div class="corr"><p class="calc">${X("x")} + 2,5 = 6 donc ${X("x")} = 6 − 2,5 = 3,5. &nbsp; Vérification : 3,5 + 2,5 = 6.</p><p class="calc">5${X("x")} = 2 donc ${X("x")} = 2 ÷ 5 = 0,4. &nbsp; Vérification : 5 × 0,4 = 2.</p></div></details>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Expressions littérales", e:[
  {n:"Activité 1", t:"Des carrés d'allumettes", w:"Sur ta feuille", h:`<p>Voici des lignes de carrés construites avec des allumettes.</p>${ex("act1","Une ligne de 1 carré, une ligne de 2 carrés et une ligne de 3 carrés faites avec des allumettes",560)}
   <p><b>1)</b> Complète le tableau directement sur cette feuille.</p>${tab(["Nombre de carrés","1","2","3","4","10"],[["Nombre d'allumettes","4","","","",""]])}
   <p><b>2)</b> Explique comment on passe d'une ligne à la suivante. Écris une formule qui donne le nombre d'allumettes pour ${X("n")} carrés.</p>
   <p><b>3)</b> Peut-on construire une ligne avec exactement 100 allumettes ? Si oui, combien de carrés ? Réponds sur ton cahier.</p>`,
   c:`<p><b>1)</b></p>${tab(["Nombre de carrés","1","2","3","4","10"],[["Nombre d'allumettes","4","7","10","13","31"]])}
   <p><b>2)</b> À chaque nouveau carré, on ajoute 3 allumettes ; le premier carré en demande 4.</p><p>Pour ${X("n")} carrés : <b>3${X("n")} + 1</b> allumettes (par exemple 3 × 10 + 1 = 31).</p>
   <p><b>3)</b> On cherche ${X("n")} tel que 3${X("n")} + 1 = 100 : 3${X("n")} = 99, donc ${X("n")} = 33.</p><p><b>Oui</b> : avec 33 carrés, car 3 × 33 + 1 = 100.</p>`},
  {n:"Exercice 1", t:"Traduire par une expression", w:"Sur ta feuille", h:`<p>Écris chaque expression en utilisant la lettre ${X("n")} (ou la lettre indiquée).</p>
   <p>a) le double de ${X("n")} : ……………… b) le successeur de ${X("n")} : ……………… c) le triple de ${X("n")} augmenté de 5 : ……………… d) la moitié de ${X("n")} : ……………… e) le périmètre d'un carré de côté ${X("c")} : ……………… f) l'aire d'un rectangle de côtés ${X("a")} et ${X("b")} : ………………</p>`,
   c:`<p>a) 2${X("n")} · b) ${X("n")} + 1 · c) 3${X("n")} + 5 · d) ${X("n")} ÷ 2 · e) 4${X("c")} · f) ${X("a")}${X("b")}</p>`},
  {n:"Exercice 2", t:"Calculer la valeur d'une expression", w:"Sur ta feuille", h:`<p>Complète le tableau (tu peux utiliser ta calculatrice).</p>${tab(["Valeur de "+X("x"),...XS2.map(F)], E2.map(([e])=>[e,"","","",""]))}`,
   c:`${tab(["Valeur de "+X("x"),...XS2.map(F)], E2.map(([e,f])=>[e,...XS2.map(x=>F(f(x)))]))}<p>Par exemple, pour ${X("x")} = 1,5 : 3 × 1,5 + 4 = 4,5 + 4 = 8,5 · 5 × (1,5+2) = 5 × 3,5 = 17,5 · 10 − 2 × 1,5 = 10 − 3 = 7 · 1,5 × 1,5 + 1 = 2,25 + 1 = 3,25</p>`},
  {n:"Exercice 3", t:"Programme de calcul", w:"Sur ton cahier", h:`<p>Voici un programme de calcul :</p><p>« Choisis un nombre ; ajoute 3 ; multiplie le résultat par 2 ; soustrais 4. »</p>
   <p><b>1)</b> Applique ce programme au nombre 5, puis au nombre 1,5.</p><p><b>2)</b> Écris une expression qui donne le résultat du programme pour un nombre ${X("x")}.</p><p><b>3)</b> Réduis cette expression, puis vérifie avec 5.</p>`,
   c:`<p><b>1)</b> Avec 5 : 5 + 3 = 8 ; 8 × 2 = 16 ; 16 − 4 = <b>12</b>.</p><p>Avec 1,5 : 1,5 + 3 = 4,5 ; 4,5 × 2 = 9 ; 9 − 4 = <b>5</b>.</p>
   <p><b>2)</b> 2(${X("x")}+3) − 4</p><p><b>3)</b> 2(${X("x")}+3) − 4 = 2${X("x")} + 6 − 4 = <b>2${X("x")} + 2</b>.</p><p>Avec ${X("x")} = 5 : 2 × 5 + 2 = 12 ✓</p>`},
  {n:"Exercice 4", t:"Tester une égalité", w:"Sur ta feuille", h:`<p>Teste l'égalité 2${X("x")} + 3 = ${X("x")} + 7 pour chaque valeur de ${X("x")}.</p>${tab(["Valeur de "+X("x"),"Valeur de 2"+X("x")+" + 3","Valeur de "+X("x")+" + 7","Égalité vraie ou fausse ?"], T4.map(x=>[String(x),"","",""]))}`,
   c:tab(["Valeur de "+X("x"),"Valeur de 2"+X("x")+" + 3","Valeur de "+X("x")+" + 7","Égalité vraie ou fausse ?"], T4.map(x=>[String(x),String(2*x+3),String(x+7),2*x+3===x+7?"<b>vraie</b>":"fausse"]))}
 ]},
{t:"Développer, factoriser, réduire", e:[
  {n:"Exercice 5", t:"Développer", w:"Sur ton cahier", h:`<p>Développe chaque expression.</p><p>a) 3(${X("x")}+5) b) 4(${X("y")}+2) c) 7(${X("x")}−2) d) 2,5(${X("x")}+4) e) 6(${X("a")}−1) f) 10(${X("z")}+0,5)</p>`,
   c:`<p>a) 3(${X("x")}+5) = 3${X("x")} + 15 · b) 4(${X("y")}+2) = 4${X("y")} + 8 · c) 7(${X("x")}−2) = 7${X("x")} − 14 · d) 2,5(${X("x")}+4) = 2,5${X("x")} + 10 · e) 6(${X("a")}−1) = 6${X("a")} − 6 · f) 10(${X("z")}+0,5) = 10${X("z")} + 5</p>`},
  {n:"Exercice 6", t:"Calcul mental", w:"Sur ton cahier", h:`<p>Calcule mentalement en utilisant la distributivité, comme dans l'exemple :</p><p class="calc">7 × 102 = 7 × (100+2) = 700 + 14 = 714</p><p>Écris les étapes.</p><p>a) 7 × 102 b) 9 × 98 c) 15 × 21 d) 12 × 99 e) 6 × 205</p>`,
   c:`<p>a) 7 × 102 = 7 × (100+2) = 700 + 14 = <b>714</b> · b) 9 × 98 = 9 × (100−2) = 900 − 18 = <b>882</b> · c) 15 × 21 = 15 × (20+1) = 300 + 15 = <b>315</b> · d) 12 × 99 = 12 × (100−1) = 1 200 − 12 = <b>1 188</b> · e) 6 × 205 = 6 × (200+5) = 1 200 + 30 = <b>1 230</b></p>`},
  {n:"Exercice 7", t:"Factoriser", w:"Sur ton cahier", h:`<p>Factorise chaque expression.</p><p>a) 5${X("x")} + 10 b) 4${X("x")} − 12 c) 3${X("a")} + 3${X("b")} d) 6${X("y")} − 6 e) 2,5${X("x")} + 5 f) 9${X("x")} + 27</p>`,
   c:`<p>a) 5${X("x")} + 10 = 5(${X("x")}+2) · b) 4${X("x")} − 12 = 4(${X("x")}−3) · c) 3${X("a")} + 3${X("b")} = 3(${X("a")}+${X("b")}) · d) 6${X("y")} − 6 = 6(${X("y")}−1) · e) 2,5${X("x")} + 5 = 2,5(${X("x")}+2) · f) 9${X("x")} + 27 = 9(${X("x")}+3)</p>`},
  {n:"Exercice 8", t:"Réduire une expression", w:"Sur ton cahier", h:`<p>Réduis chaque expression (développe d'abord si nécessaire).</p><p>a) 3${X("x")} + 5${X("x")} b) 7${X("x")} − 2${X("x")} + 4 c) 4 + 2${X("x")} + ${X("x")} + 1 d) 9${X("a")} − 4${X("a")} − ${X("a")} e) 2${X("x")} + 3 + 5${X("x")} − 1 f) 2(${X("x")}+3) + 4${X("x")} g) 5(${X("x")}+1) − 2${X("x")} h) 7 + 3(${X("x")}−1)</p>`,
   c:`<p>a) 3${X("x")} + 5${X("x")} = (3+5)${X("x")} = 8${X("x")} · b) 7${X("x")} − 2${X("x")} + 4 = 5${X("x")} + 4 · c) 4 + 2${X("x")} + ${X("x")} + 1 = 3${X("x")} + 5 · d) 9${X("a")} − 4${X("a")} − ${X("a")} = 4${X("a")} · e) 2${X("x")} + 3 + 5${X("x")} − 1 = 7${X("x")} + 2 · f) 2(${X("x")}+3) + 4${X("x")} = 2${X("x")} + 6 + 4${X("x")} = 6${X("x")} + 6 · g) 5(${X("x")}+1) − 2${X("x")} = 5${X("x")} + 5 − 2${X("x")} = 3${X("x")} + 5 · h) 7 + 3(${X("x")}−1) = 7 + 3${X("x")} − 3 = 3${X("x")} + 4</p>`}
 ]},
{t:"Démontrer et réfuter", e:[
  {n:"Exercice 9", t:"Un programme qui cache un secret", w:"Sur ton cahier", h:`<p>Voici un programme de calcul :</p><p>« Choisis un nombre ; ajoute 5 ; multiplie par 3 ; soustrais 15. »</p><p><b>1)</b> Applique le programme aux nombres 4, 7 et 2,5. Que remarques-tu ?</p><p><b>2)</b> Démontre ta conjecture en appelant ${X("x")} le nombre choisi.</p>`,
   c:`<p><b>1)</b> Avec 4 : 4 + 5 = 9 ; 9 × 3 = 27 ; 27 − 15 = <b>12</b>.</p><p>Avec 7 : 7 + 5 = 12 ; 12 × 3 = 36 ; 36 − 15 = <b>21</b>.</p><p>Avec 2,5 : 2,5 + 5 = 7,5 ; 7,5 × 3 = 22,5 ; 22,5 − 15 = <b>7,5</b>.</p><p>Le résultat est toujours <b>le triple</b> du nombre choisi.</p>
   <p><b>2)</b> 3(${X("x")}+5) − 15 = 3${X("x")} + 15 − 15 = 3${X("x")}</p><p>Le résultat est bien le triple de ${X("x")}, quel que soit le nombre choisi.</p>`},
  {n:"Exercice 10", t:"Contre-exemples", w:"Sur ton cahier", h:`<p>Dis si chaque affirmation est vraie ou fausse. Si elle est fausse, donne un contre-exemple.</p><p>a) La somme de deux entiers consécutifs est un multiple de 2.</p><p>b) Un nombre multiplié par lui-même est toujours plus grand que lui.</p><p>c) Le produit de deux nombres entiers est toujours plus grand que chacun d'eux.</p>`,
   c:`<p>a) <b>Faux.</b> Contre-exemple : 3 + 4 = 7 n'est pas un multiple de 2 (une somme de deux entiers consécutifs est toujours impaire).</p><p>b) <b>Faux.</b> Contre-exemple : 0,5 × 0,5 = 0,25, qui est plus petit que 0,5.</p><p>c) <b>Faux.</b> Contre-exemple : 5 × 0 = 0, qui est plus petit que 5.</p>`},
  {n:"Exercice 11", t:"Trois entiers consécutifs", w:"Sur ton cahier", h:`<p><b>1)</b> Teste avec trois exemples : la somme de trois entiers consécutifs est-elle toujours un multiple de 3 ?</p><p><b>2)</b> Démontre-le avec une lettre : si ${X("n")} est le plus petit des trois entiers, écris la somme et factorise-la.</p>`,
   c:`<p><b>1)</b> 1 + 2 + 3 = 6 ; 4 + 5 + 6 = 15 ; 10 + 11 + 12 = 33 : ce sont des multiples de 3.</p><p><b>2)</b> ${X("n")} + (${X("n")}+1) + (${X("n")}+2) = 3${X("n")} + 3 = 3(${X("n")}+1)</p><p>C'est un multiple de 3 (3 fois le nombre ${X("n")} + 1).</p>`}
 ]},
{t:"Équations", e:[
  {n:"Exercice 12", t:`Équations ${X("x")} + ${X("b")} = ${X("c")}`, w:"Sur ton cahier", h:`<p>Résous chaque équation et vérifie ta solution.</p><p>a) ${X("x")} + 7 = 15 b) 12 + ${X("x")} = 30 c) ${X("x")} + 2,5 = 6 d) ${X("x")} + 0,8 = 1,3</p>`,
   c:`<p>a) ${X("x")} + 7 = 15 donc ${X("x")} = 15 − 7 = <b>8</b> · b) 12 + ${X("x")} = 30 donc ${X("x")} = 30 − 12 = <b>18</b> · c) ${X("x")} + 2,5 = 6 donc ${X("x")} = 6 − 2,5 = <b>3,5</b> · d) ${X("x")} + 0,8 = 1,3 donc ${X("x")} = 1,3 − 0,8 = <b>0,5</b></p>`},
  {n:"Exercice 13", t:`Équations ${X("a")}${X("x")} = ${X("c")}`, w:"Sur ton cahier", h:`<p>Résous chaque équation et vérifie ta solution.</p><p>a) 3${X("x")} = 21 b) 5${X("x")} = 2 c) 4${X("x")} = 30 d) 0,5${X("x")} = 3 e) 1,5${X("x")} = 6</p>`,
   c:`<p>a) 3${X("x")} = 21 donc ${X("x")} = 21 ÷ 3 = <b>7</b> · b) 5${X("x")} = 2 donc ${X("x")} = 2 ÷ 5 = <b>0,4</b> · c) 4${X("x")} = 30 donc ${X("x")} = 30 ÷ 4 = <b>7,5</b> · d) 0,5${X("x")} = 3 donc ${X("x")} = 3 ÷ 0,5 = <b>6</b> · e) 1,5${X("x")} = 6 donc ${X("x")} = 6 ÷ 1,5 = <b>4</b></p>`},
  {n:"Exercice 14", t:"Mettre en équation", w:"Sur ton cahier", h:`<p>Pour chaque problème, écris une équation, résous-la, puis réponds par une phrase.</p><p>a) Ali a 12 € de plus que sa sœur. Il a 30 €. Combien a sa sœur ?</p><p>b) Trois paquets identiques de billes pèsent 450 g en tout. Combien pèse un paquet ?</p><p>c) Le périmètre d'un carré est de 26 cm. Quelle est la longueur de son côté ?</p>`,
   c:`<p>a) ${X("x")} + 12 = 30 donc ${X("x")} = 30 − 12 = 18 : sa sœur a <b>18 €</b>.</p><p>b) 3${X("x")} = 450 donc ${X("x")} = 450 ÷ 3 = 150 : un paquet pèse <b>150 g</b>.</p><p>c) 4${X("x")} = 26 donc ${X("x")} = 26 ÷ 4 = 6,5 : le côté du carré mesure <b>6,5 cm</b>.</p>`},
  {n:"Exercice 15", t:"Pour aller plus loin : le tableur", w:"En salle informatique", h:`<p>Séance en salle informatique (tableur). Réponds directement sur ta feuille.</p><p><b>1)</b> Dans la cellule A2, écris 1, puis dans A3 la formule <b>=A2+1</b>. Recopie vers le bas jusqu'à A12.</p><p><b>2)</b> Dans la cellule B2, écris la formule <b>=3*A2+1</b> et recopie-la vers le bas. À quoi correspondent les nombres de la colonne B ?</p><p><b>3)</b> En faisant défiler le tableau, trouve la valeur de ${X("n")} pour laquelle 3${X("n")} + 1 = 61 : ………</p>`,
   c:`<p><b>1)</b> La colonne A affiche les nombres entiers 1, 2, 3… (A12 contient 11).</p><p><b>2)</b> La colonne B donne le nombre d'allumettes nécessaires pour construire une ligne de ${X("n")} carrés (${X("n")} est le nombre de la colonne A) : 3${X("n")} + 1.</p><p><b>3)</b> 3${X("n")} + 1 = 61 donc 3${X("n")} = 60 et <b>${X("n")} = 20</b>.</p><p>Il faut recopier les formules plus bas : en A21 on lit 20, et en B21 on lit 61.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Écrire et calculer une expression", schema:S_EXPR, q:{
 1:[ {g:()=>{ const P=[["le double de "+X("n"),"2"+X("n")],["le triple de "+X("n"),"3"+X("n")],["le successeur de "+X("n"),X("n")+" + 1"],["le prédécesseur de "+X("n"),X("n")+" − 1"],["la moitié de "+X("n"),X("n")+" ÷ 2"],["le double de "+X("n")+" augmenté de 1", "2"+X("n")+" + 1"]];
       const p=pick(P); return {q:`Comment écrit-on ${p[0]} ?`, c:ch3(p[1], shuf(P.map(x=>x[1]))), rep:p[1], ex:`${p[0][0].toUpperCase()+p[0].slice(1)} s'écrit ${p[1]}.`, sx:S_EXPR}; }},
     {g:()=>{ const a=ri(2,9), b=ri(1,9); return {q:`Comment écrit-on ${a} × (${X("x")}+${b}) en supprimant le signe × ?`, c:shuf([par(a,b), lin(a,b), `${X("x")}${a}+${b}`]), rep:par(a,b), ex:`On supprime le signe × devant la parenthèse, mais on garde la parenthèse : ${par(a,b)}.`, sx:S_EXPR}; }},
     {q:`Comment écrit-on 1 × ${X("x")} en calcul littéral ?`, c:[X("x"),"1"+X("x"),"1"], rep:X("x"), ex:`On n'écrit jamais 1${X("x")}, mais simplement ${X("x")}.`, sx:S_EXPR} ],
 2:[ {g:()=>{ const a=ri(2,9), b=ri(1,12), x=ri(2,10); return {q:`Calcule ${lin(a,b)} pour ${X("x")} = ${x}.`, rep:F(a*x+b), ex:`${a} × ${x} + ${b} = ${a*x} + ${b} = ${F(a*x+b)}.`, sx:S_EXPR}; }},
     {g:()=>{ const c=pick([10,12,15,20]), d=ri(2,4), x=ri(1,Math.floor(c/d)); return {q:`Calcule ${c} − ${d}${X("x")} pour ${X("x")} = ${x}.`, rep:F(c-d*x), ex:`${c} − ${d} × ${x} = ${c} − ${d*x} = ${F(c-d*x)}. La multiplication est prioritaire.`, sx:S_EXPR}; }} ],
 3:[ {g:()=>{ const k=ri(2,6), b=ri(1,6), x=ri(1,9)+0.5; return {q:`Calcule ${par(k,b)} pour ${X("x")} = ${F(x)}.`, rep:F(k*(x+b)), ex:`${k} × (${F(x)}+${b}) = ${k} × ${F(x+b)} = ${F(k*(x+b))}.`, sx:S_EXPR}; }},
     {g:()=>{ const x=pick([1.5,2.5,0.5,3,4,6]), c=ri(1,9); return {q:`Calcule ${X("x")} × ${X("x")} + ${c} pour ${X("x")} = ${F(x)}.`, rep:F(x*x+c), ex:`${F(x)} × ${F(x)} + ${c} = ${F(x*x)} + ${c} = ${F(x*x+c)}.`, sx:S_EXPR}; }},
     {g:()=>{ const L=ri(5,15), l=ri(2,L-1); return {q:`Le périmètre d'un rectangle est ${X("P")} = 2 × (${X("L")}+${X("l")}). Calcule ${X("P")} pour ${X("L")} = ${L} cm et ${X("l")} = ${l} cm (en cm).`, rep:F(2*(L+l)), ex:`2 × (${L}+${l}) = 2 × ${L+l} = ${2*(L+l)}.`, sx:S_EXPR}; }} ]
}},
{nom:"Tester une égalité", schema:S_TEST, q:{
 1:[ {g:()=>{ const s=ri(1,9), b=ri(1,9), d=s+b, t=Math.random()<0.5?s:pick([0,1,2,3,4,5,6,7,8,9,10].filter(v=>v!==s)); const ok=t===s;
       return {q:`L'égalité 2${X("x")} + ${b} = ${X("x")} + ${d} est-elle vraie pour ${X("x")} = ${t} ?`, c:["vraie","fausse"], rep:ok?"vraie":"fausse", ex:`2 × ${t} + ${b} = ${2*t+b} et ${t} + ${d} = ${t+d} : ${ok?"les deux membres sont égaux":"les deux membres sont différents"}.`, sx:S_TEST}; }} ],
 2:[ {g:()=>{ const a=ri(3,5), s=ri(1,8), b=ri(1,9), d=(a-1)*s+b, t=Math.random()<0.5?s:pick([0,1,2,3,4,5,6,7,8,9,10].filter(v=>v!==s)); const ok=t===s;
       return {q:`L'égalité ${lin(a,b)} = ${lin(1,d)} est-elle vraie pour ${X("x")} = ${t} ?`, c:["vraie","fausse"], rep:ok?"vraie":"fausse", ex:`${a} × ${t} + ${b} = ${a*t+b} et ${t} + ${d} = ${t+d}.`, sx:S_TEST}; }} ],
 3:[ {q:"Pour tester une égalité qui contient une lettre, on…", c:["calcule séparément les deux membres","calcule seulement le membre de gauche","regarde si la lettre est la même des deux côtés"], rep:"calcule séparément les deux membres", sx:S_TEST},
     {q:`L'égalité 2${X("x")} + 3 = ${X("x")} + 7 est vraie pour ${X("x")} = 4. Est-elle vraie pour toutes les valeurs de ${X("x")} ?`, c:["Non","Oui"], rep:"Non", ex:`Pour ${X("x")} = 2 : 2${X("x")} + 3 = 7 et ${X("x")} + 7 = 9. Elle est fausse.`, sx:S_TEST},
     {g:()=>{ const t=ri(1,7)+0.5, a=pick([2,4]), b=ri(1,9), dt=r3((a-1)*t+b), ok=Math.random()<0.5, d=ok?dt:r3(dt+pick([1,2,0.5])); const L=r3(a*t+b), R=r3(t+d);
       return {q:`Pour ${X("x")} = ${F(t)}, l'égalité ${lin(a,b)} = ${lin(1,d)} est-elle vraie ?`, c:["vraie","fausse"], rep:L===R?"vraie":"fausse", ex:`${a} × ${F(t)} + ${b} = ${F(L)} et ${F(t)} + ${F(d)} = ${F(R)}.`, sx:S_TEST}; }} ]
}},
{nom:"Développer et factoriser", schema:S_DEV, q:{
 1:[ {g:()=>{ const k=ri(2,9), b=ri(2,9); return {q:`Développe ${par(k,b)}.`, c:ch3(lin(k,k*b),[lin(k,b), lin(1,k*b), mono(k+b)]), rep:lin(k,k*b), ex:`${par(k,b)} = ${k}${X("x")} + ${k} × ${b} = ${lin(k,k*b)}.`, sx:S_DEV}; }},
     {q:"Développer, c'est transformer…", c:["un produit en une somme","une somme en un produit"], rep:"un produit en une somme", sx:S_DEV} ],
 2:[ {g:()=>{ const k=ri(2,9), b=ri(2,9); return {q:`Développe ${par(k,-b)}.`, c:ch3(lin(k,-k*b),[lin(k,-b), lin(k,k*b), lin(1,-k*b)]), rep:lin(k,-k*b), ex:`${par(k,-b)} = ${k}${X("x")} − ${k} × ${b} = ${lin(k,-k*b)}.`, sx:S_DEV}; }},
     {g:()=>{ const a=ri(3,15), [h,d]=pick([[100,ri(1,5)],[100,-ri(1,3)],[20,1],[200,ri(1,5)]]); const n=h+d, v=a*n;
       return {q:`Calcule mentalement ${a} × ${n}.`, rep:F(v), ex:`${a} × (${h}${d<0?"−"+(-d):"+"+d}) = ${F(a*h)} ${d<0?"−":"+"} ${F(a*Math.abs(d))} = ${F(v)}.`, sx:S_DEV}; }} ],
 3:[ {g:()=>{ const k=ri(2,9), b=ri(2,9); return {q:`Factorise ${lin(k,k*b)}.`, c:ch3(par(k,b),[par(k,k*b), par(b,k), par(k,b+k)]), rep:par(k,b), ex:`${lin(k,k*b)} = ${k} × ${X("x")} + ${k} × ${b} = ${par(k,b)}.`, sx:S_DEV}; }},
     {g:()=>{ const k=ri(2,9), b=ri(1,9); return {q:`Factorise ${lin(k,-k*b)}.`, c:ch3(par(k,-b),[par(k,b), par(k,-k*b), par(b,-k)]), rep:par(k,-b), ex:`${lin(k,-k*b)} = ${k} × ${X("x")} − ${k} × ${b} = ${par(k,-b)}.`, sx:S_DEV}; }},
     {g:()=>{ const b=ri(2,8); return {q:`Développe 2,5(${X("x")}+${b}).`, c:ch3(lin(2.5,2.5*b),[lin(2.5,b), lin(2,2.5*b), lin(2.5,2*b)]), rep:lin(2.5,2.5*b), ex:`2,5 × ${b} = ${F(2.5*b)}.`, sx:S_DEV}; }} ]
}},
{nom:"Réduire une expression", schema:S_RED, q:{
 1:[ {g:()=>{ const a=ri(2,9), b=ri(2,9); return {q:`Réduis ${mono(a)} + ${mono(b)}.`, c:ch3(mono(a+b),[mono(a*b), F(a+b), lin(a,b)]), rep:mono(a+b), ex:`${mono(a)} + ${mono(b)} = (${a}+${b})${X("x")} = ${mono(a+b)}.`, sx:S_RED}; }} ],
 2:[ {g:()=>{ const a=ri(5,12), b=ri(1,a-2), c=ri(1,9); return {q:`Réduis ${mono(a)} − ${mono(b)} + ${c}.`, c:ch3(lin(a-b,c),[mono(a-b+c), lin(a+b,c), F(a-b+c)]), rep:lin(a-b,c), ex:`(${a}−${b})${X("x")} + ${c} = ${lin(a-b,c)}.`, sx:S_RED}; }},
     {g:()=>{ const a=ri(2,6), b=ri(2,9), c=ri(2,6), d=ri(1,b-1); return {q:`Réduis ${mono(a)} + ${b} + ${mono(c)} − ${d}.`, c:ch3(lin(a+c,b-d),[lin(a+c,b+d), mono(a+c+b-d), lin(a+c+b,-d)]), rep:lin(a+c,b-d), ex:`Termes en ${X("x")} : ${a} + ${c} = ${a+c}. Nombres : ${b} − ${d} = ${b-d}.`, sx:S_RED}; }} ],
 3:[ {g:()=>{ const k=ri(2,6), b=ri(1,6), c=ri(1,6); return {q:`Réduis ${par(k,b)} + ${mono(c)}.`, c:ch3(lin(k+c,k*b),[lin(k+c,b), lin(k,k*b+c), mono(k+c+k*b)]), rep:lin(k+c,k*b), ex:`On développe d'abord : ${lin(k,k*b)} + ${mono(c)} = ${lin(k+c,k*b)}.`, sx:S_RED}; }},
     {g:()=>{ const c=ri(5,12), k=ri(2,6), b=ri(1,4); return {q:`Réduis ${c} + ${par(k,-b)}.`, c:ch3(lin(k,c-k*b),[lin(k,c-b), lin(k,c+k*b), mono(k+c-b)]), rep:lin(k,c-k*b), ex:`${c} + ${mono(k)} − ${k*b} = ${lin(k,c-k*b)}.`, sx:S_RED}; }} ]
}},
{nom:"Démontrer et réfuter", schema:S_DEM, q:{
 1:[ {q:"Pour montrer qu'une affirmation est fausse, il suffit de trouver…", c:["un seul contre-exemple","beaucoup d'exemples","une lettre"], rep:"un seul contre-exemple", sx:S_DEM},
     {q:"Trois exemples qui marchent suffisent-ils pour démontrer qu'une propriété est toujours vraie ?", c:["Non","Oui"], rep:"Non", ex:"Des exemples ne suffisent pas : on utilise une lettre qui représente n'importe quel nombre.", sx:S_DEM} ],
 2:[ {q:`Si ${X("n")} est un entier, ${X("n")} + (${X("n")}+1) est égal à…`, c:[lin(2,1,"n"), mono(2,"n"), lin(1,1,"n")], rep:lin(2,1,"n"), ex:`${X("n")} + ${X("n")} + 1 = 2${X("n")} + 1 : un nombre impair.`, sx:S_DEM},
     {g:()=>{ const b=ri(2,9), k=ri(2,5); return {q:`Programme : « Choisis un nombre ${X("x")} ; ajoute ${b} ; multiplie par ${k} ; soustrais ${k*b}. » Le résultat est toujours égal à…`, c:ch3(mono(k),[lin(1,b), F(k*b), lin(k,b)]), rep:mono(k), ex:`${par(k,b)} − ${k*b} = ${lin(k,k*b)} − ${k*b} = ${mono(k)}.`, sx:S_DEM}; }} ],
 3:[ {g:()=>{ const d=ri(1,9)/10, A=ri(2,9), B=ri(10,20); return {q:"Quel nombre est un contre-exemple à : « Un nombre multiplié par lui-même est toujours plus grand que lui » ?", c:shuf([F(d),String(A),String(B)]), rep:F(d), ex:`${F(d)} × ${F(d)} = ${F(d*d)}, qui est plus petit que ${F(d)}.`, sx:S_DEM}; }},
     {g:()=>{ const a=ri(2,9); return {q:"Quel calcul est un contre-exemple à : « Le produit de deux nombres entiers est toujours plus grand que chacun d'eux » ?", c:shuf([`${a} × 0 = 0`,`${a} × 3 = ${3*a}`,`${a} × 10 = ${10*a}`]), rep:`${a} × 0 = 0`, ex:`0 n'est pas plus grand que ${a}.`, sx:S_DEM}; }},
     {q:`Si ${X("n")} est un entier, ${X("n")} + (${X("n")}+1) + (${X("n")}+2) est égal à…`, c:[par(3,1,"n"), lin(3,2,"n"), par(3,3,"n")], rep:par(3,1,"n"), ex:`${X("n")} + ${X("n")} + 1 + ${X("n")} + 2 = 3${X("n")} + 3 = 3(${X("n")}+1) : un multiple de 3.`, sx:S_DEM} ]
}},
{nom:"Équations", schema:S_EQ, q:{
 1:[ {g:()=>{ const s=ri(2,30), b=ri(2,20); return {q:`Résous : ${X("x")} + ${b} = ${s+b}.`, rep:String(s), ex:`${X("x")} = ${s+b} − ${b} = ${s}. Vérification : ${s} + ${b} = ${s+b}.`, sx:S_EQ}; }},
     {g:()=>{ const s=ri(2,10), a=ri(2,9); return {q:`Résous : ${a}${X("x")} = ${a*s}.`, rep:String(s), ex:`${X("x")} = ${a*s} ÷ ${a} = ${s}.`, sx:S_EQ}; }} ],
 2:[ {g:()=>{ const s=ri(1,40)/10, b=ri(1,40)/10; return {q:`Résous : ${X("x")} + ${F(b)} = ${F(s+b)}.`, rep:F(s), ex:`${X("x")} = ${F(s+b)} − ${F(b)} = ${F(s)}.`, sx:S_EQ}; }},
     {g:()=>{ const a=pick([2,4,5]); let c; do{ c=ri(1,39); }while(c%a===0); return {q:`Résous : ${a}${X("x")} = ${c}.`, rep:F(c/a), ex:`${X("x")} = ${c} ÷ ${a} = ${F(c/a)}. Vérification : ${a} × ${F(c/a)} = ${c}.`, sx:S_EQ}; }} ],
 3:[ {g:()=>{ const s=ri(2,12), a=pick([0.5,1.5,2.5]); return {q:`Résous : ${F(a)}${X("x")} = ${F(a*s)}.`, rep:String(s), ex:`${X("x")} = ${F(a*s)} ÷ ${F(a)} = ${s}. Vérification : ${F(a)} × ${s} = ${F(a*s)}.`, sx:S_EQ}; }},
     {g:()=>{ const P=ri(9,30)*2; return {q:`Le périmètre d'un carré est de ${P} cm. Quelle est la longueur de son côté (en cm) ?`, rep:F(P/4), ex:`4${X("x")} = ${P} donc ${X("x")} = ${P} ÷ 4 = ${F(P/4)}.`, sx:S_EQ}; }},
     {g:()=>{ const k=pick([3,4,5]), m=ri(20,90)*5; return {q:`${["","","","Trois","Quatre","Cinq"][k]} paquets identiques pèsent ${F(k*m)} g en tout. Combien pèse un paquet (en g) ?`, rep:F(m), ex:`${k}${X("x")} = ${F(k*m)} donc ${X("x")} = ${F(k*m)} ÷ ${k} = ${F(m)}.`, sx:S_EQ}; }} ]
}}
]
};
})();
