/* 6e — Chapitre 2 : Premiers éléments de géométrie (pas d'évaluation) */
(function(){
const VF = ["Vrai","Faux"];
const co = (p,alt,w) => img("c2co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c2ex/"+p+".png", alt, w);
const P = (x,y,L,dx=8,dy=-8) => cross(x,y,"ln")+`<text x="${x+dx}" y="${y+dy}" font-size="17">${L}</text>`;
/* A, B, C alignés sur une droite, D en dehors */
const figAlign = `<svg class="fig" viewBox="0 0 360 175" width="360" role="img" aria-label="Points A, B, C sur une droite, point D en dehors"><line x1="10" y1="130" x2="350" y2="40" class="ln"/>${P(70,114.1,"A",-4,-12)}${P(170,87.6,"B",-4,-12)}${P(270,61.2,"C",-4,-12)}${P(190,152,"D")}</svg>`;
/* deux droites sécantes quelconques */
const figSec = `<svg class="fig" viewBox="0 0 360 180" width="360" role="img" aria-label="Deux droites qui se coupent"><line x1="20" y1="30" x2="340" y2="150" class="ln"/><line x1="20" y1="150" x2="340" y2="40" class="ln"/><text x="300" y="168" font-size="16">(d)</text><text x="300" y="36" font-size="16">(d')</text></svg>`;
/* deux droites perpendiculaires, angle droit codé */
const figPerp = `<svg class="fig" viewBox="0 0 360 170" width="360" role="img" aria-label="Deux droites perpendiculaires"><line x1="20" y1="100" x2="340" y2="60" class="ln"/><line x1="170.7" y1="5.6" x2="189.3" y2="164.4" class="ln"/><path d="M189.9 78.8 L191.2 88.7 L181.2 89.9" class="thin"/><text x="300" y="56" font-size="16">(d)</text><text x="196" y="160" font-size="16">(d')</text></svg>`;
/* deux droites qui ne se coupent pas sur la figure mais sont sécantes */
const figLoin = `<svg class="fig" viewBox="0 0 360 170" width="360" role="img" aria-label="Deux droites qui se rapprochent sans se couper sur la figure"><line x1="20" y1="40" x2="250" y2="70" class="ln"/><line x1="20" y1="140" x2="250" y2="105" class="ln"/><text x="24" y="30" font-size="16">(d)</text><text x="24" y="164" font-size="16">(d')</text></svg>`;

CH["6e-2"] = {
intro: "Points, droites, demi-droites et segments ; appartenance et alignement ; droites sécantes, perpendiculaires et parallèles ; constructions à la règle et à l'équerre.",
savoir: [
  "nommer correctement un point, une droite, une demi-droite, un segment ;",
  "utiliser les symboles ∈, ∉, ⊥ et // ;",
  "reconnaître des points alignés et un point d'intersection ;",
  "reconnaître deux droites sécantes, perpendiculaires ou parallèles ;",
  "tracer une perpendiculaire et une parallèle à la règle et à l'équerre."
],

/* ===================== COURS ===================== */
cours: [
{k:"I", t:"Notations et vocabulaire", h:`
  <p>Quatre objets à connaître, avec leurs notations :</p>
  <div class="scroll"><table class="std"><thead><tr><th>Objet</th><th>Figure</th><th>Notation</th></tr></thead><tbody>
    <tr><td><b>Le point</b><br>Marqué par une croix, nommé par une lettre majuscule.</td><td>${co("p1-00","Un point A",56)}</td><td>le point A</td></tr>
    <tr><td><b>La droite</b><br>Illimitée des deux côtés : on ne peut jamais la mesurer.</td><td>${co("p1-02","La droite (d) passant par A et B",260)}</td><td>(AB) ou (BA), ou une lettre minuscule entre parenthèses : (d)</td></tr>
    <tr><td><b>La demi-droite</b><br>Limitée d'un seul côté par son origine, illimitée de l'autre.</td><td>${co("p1-04","La demi-droite d'origine A passant par B",260)}</td><td>[AB) : origine A, passant par B</td></tr>
    <tr><td><b>Le segment</b><br>Limité par deux points appelés extrémités. On peut le mesurer.</td><td>${co("p1-06","Le segment [AB]",160)}</td><td>[AB] ou [BA] ; sa longueur se note AB, sans crochets</td></tr>
  </tbody></table></div>
  <div class="retenir" data-l="Attention"><p>[AB) et [BA) ne désignent pas la même demi-droite : elles n'ont pas la même origine.</p></div>`},
{k:"II", t:"Alignement et appartenance", h:`
  <h4>1. Appartenir à une droite</h4>
  <div class="retenir" data-l="Définition"><p>Un point appartient à une droite lorsqu'il est situé sur cette droite.</p></div>
  <p>Notation : on écrit A ∈ (d), qui se lit « A appartient à (d) ». Si le point B n'est pas sur la droite, on écrit B ∉ (d), qui se lit « B n'appartient pas à (d) ».</p>
  <h4>2. Points alignés</h4>
  <div class="retenir" data-l="Définition"><p>Des points alignés sont des points qui appartiennent à une même droite.</p></div>
  <p>Remarque : deux points sont toujours alignés, on peut toujours tracer une droite qui passe par les deux. La question ne devient intéressante qu'à partir de trois points.</p>
  <h4>3. Point d'intersection</h4>
  <div class="retenir" data-l="Définition"><p>Si deux droites se coupent en un point, ce point est appelé point d'intersection des deux droites.</p></div>`},
{k:"III", t:"Position relative de deux droites", h:`
  <h4>1. Droites sécantes</h4>
  <div class="retenir" data-l="Définition"><p>Deux droites sont sécantes lorsqu'elles se coupent en un point.</p></div>
  ${co("p4-11","Deux droites sécantes (AB) et (CD)",330)}
  <p><b>Remarque importante :</b> deux droites peuvent sembler ne pas se couper sur la figure et être tout de même sécantes. Il suffit parfois de les prolonger pour s'en apercevoir.</p>
  ${co("p4-12","Deux droites (d) et (d') qui ne se coupent pas sur la figure",190)}
  <h4>2. Droites perpendiculaires</h4>
  <div class="retenir" data-l="Définition"><p>Deux droites sont perpendiculaires lorsqu'elles se coupent en formant un angle droit. On code cet angle droit par un petit carré.</p></div>
  ${co("p4-13","Deux droites perpendiculaires (f) et (g)",200)}
  <p>Notation : on écrit (f) ⊥ (g), qui se lit « (f) est perpendiculaire à (g) ». Remarque : deux droites perpendiculaires sont toujours sécantes.</p>
  <h4>3. Droites parallèles</h4>
  <div class="retenir" data-l="Définition"><p>Deux droites sont parallèles lorsqu'elles ne se coupent jamais, même si on les prolonge aussi loin que l'on veut.</p></div>
  ${co("p5-14","Deux droites parallèles (f) et (h)",170)}
  <p>Notation : on écrit (f) // (h), qui se lit « (f) est parallèle à (h) ».</p>
  <h4>4. Deux propriétés à connaître</h4>
  <div class="retenir" data-l="Propriété 1"><p>Si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles.</p></div>
  ${co("p5-15","(d1) et (d2) perpendiculaires à (d)",330)}
  <p>Ici : (d₁) ⊥ (d) et (d₂) ⊥ (d), donc (d₁) // (d₂).</p>
  <div class="retenir" data-l="Propriété 2"><p>Si deux droites sont parallèles et si une troisième droite est perpendiculaire à l'une, alors elle est perpendiculaire à l'autre.</p></div>
  ${co("p5-17","(d1) // (d2) et (d3) perpendiculaire à (d1)",330)}
  <p>Ici : (d₁) // (d₂) et (d₃) ⊥ (d₁), donc (d₃) ⊥ (d₂).</p>`},
{k:"IV", t:"Constructions", h:`
  <h4>1. Tracer une perpendiculaire</h4>
  <p>Exemple : trace la perpendiculaire à (d) passant par le point M. Nomme-la (d').</p>
  ${co("p6-19","Méthode en trois étapes pour tracer une perpendiculaire à l'équerre",760)}
  <h4>2. Tracer une parallèle</h4>
  <p>Exemple : trace la parallèle à (d) passant par le point M. Nomme-la (d'). Méthode : on utilise deux fois la perpendiculaire.</p>
  <div class="figs">
    <figure>${co("p7-23","Étape 1",220)}<figcaption>Étape 1 : on repère la droite (d) et le point M.</figcaption></figure>
    <figure>${co("p7-25","Étape 2",220)}<figcaption>Étape 2 : on trace la perpendiculaire (k) à (d) passant par M.</figcaption></figure>
    <figure>${co("p7-27","Étape 3",220)}<figcaption>Étape 3 : on trace la perpendiculaire à (k) passant par M. C'est la droite (d') cherchée.</figcaption></figure>
  </div>
  <div class="retenir" data-l="Pourquoi ça marche"><p>(d) et (d') sont toutes les deux perpendiculaires à (k), donc elles sont parallèles (propriété 1).</p></div>
  <p><b>Autre méthode :</b> on peut aussi poser un côté de l'équerre sur (d), placer la règle contre l'autre côté, puis faire glisser l'équerre le long de la règle jusqu'au point M.</p>`}
],

/* ===================== EXERCICES ===================== */
exos: [
{t:"Appartenance et alignement", e:[
  {n:"Exercice 1", t:"∈ ou ∉ ?", w:"Sur ton cahier", h:`${ex("p1-00","Figure de l'exercice 1",260)}<p>Recopie chaque ligne et complète avec le symbole ∈ ou ∉.</p>
   <p>1. B …… [AC] · 2. A …… [BC] · 3. A …… (BC) · 4. C …… (AB) · 5. D …… (AC) · 6. M …… (AD) · 7. M …… [AD] · 8. N …… [BD] · 9. N …… (AC) · 10. E …… (AD)</p>`,
   c:`1. B ∈ [AC] · 2. A ∉ [BC] · 3. A ∈ (BC) · 4. C ∈ (AB) · 5. D ∉ (AC) · 6. M ∈ (AD) · 7. M ∉ [AD] · 8. N ∈ [BD] · 9. N ∉ (AC) · 10. E ∉ (AD)`},
  {n:"Exercice 2", t:"Trois façons de dire la même chose", w:"Sur ta feuille", h:`<p>Complète le tableau : écris chaque phrase mathématique en français, puis fais un dessin.</p>
   <div class="scroll"><table class="std"><thead><tr><th>Phrase mathématique</th><th>Phrase en français</th><th>Dessin</th></tr></thead><tbody><tr><td>A ∈ [CD]</td><td></td><td></td></tr><tr><td>B ∉ (EF)</td><td></td><td></td></tr><tr><td>H ∈ (PL) mais H ∉ [PL]</td><td></td><td></td></tr></tbody></table></div>`,
   c:`<ul><li>A ∈ [CD] : le point A appartient au segment [CD]. Dessin : A placé entre C et D, sur le segment.</li>
   <li>B ∉ (EF) : le point B n'appartient pas à la droite (EF). Dessin : B placé en dehors de la droite (EF).</li>
   <li>H ∈ (PL) mais H ∉ [PL] : le point H appartient à la droite (PL) mais pas au segment [PL]. Dessin : H sur la droite, à l'extérieur du segment (avant P ou après L).</li></ul>`},
  {n:"Exercice 3", t:"Placer des points", w:"Sur ta feuille", h:`${ex("p2-02","Points A, B, C, D, E de l'exercice 3",260)}<p>En t'aidant des points déjà placés, place les points G, H, I, L et M tels que :</p>
   <p>a) G ∈ (BE) et G ∈ [BE] · b) H ∈ (AE) et H ∉ [AE] · c) les points I, A et E sont alignés, et les points I, B et D le sont également · d) L ∈ (AB) et L ∈ (CD) · e) M ∈ (CD)</p>`,
   c:`<ul><li>a) G est un point du segment [BE], entre B et E.</li><li>b) H est sur la droite (AE), mais à l'extérieur du segment [AE].</li><li>c) I est le point d'intersection des droites (AE) et (BD) : trace les deux droites, I est là où elles se coupent.</li><li>d) L est le point d'intersection des droites (AB) et (CD).</li><li>e) M est n'importe quel point de la droite (CD) : il y a une infinité de réponses possibles.</li></ul>`},
  {n:"Exercice 4", t:"Une seule position ?", w:"Sur ton cahier", h:`<p>On sait que : A ∈ (BC) ; D ∉ (BC) et A ∉ [BC].</p><p>1 — Place les points A, B, C et D. 2 — Y a-t-il une seule position possible ? Dessine dans ton cahier toutes les autres possibilités que tu trouves.</p>`,
   c:`A est sur la droite (BC) mais pas sur le segment [BC] : il est soit du côté de B (avant B), soit du côté de C (après C). D est n'importe où en dehors de la droite (BC). Il n'y a donc pas une seule position possible : il y en a une infinité.`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`${figAlign}<p>Complète avec ∈ ou ∉ : a. B …… (AC) · b. D …… (AC) · c. C …… [AB] · d. B …… [AC]</p>`,
  c:`a. B ∈ (AC) · b. D ∉ (AC) · c. C ∉ [AB] (C est après B) · d. B ∈ [AC] (B est entre A et C)`},
 defi:{t:"Où est D ?", w:"Sur ton cahier", h:`<p>Place trois points A, B, C alignés, avec B ∈ [AC]. Place ensuite un point D tel que D ∈ (AB) et D ∉ [AC]. De quel(s) côté(s) peut-on placer D ?</p>`,
  c:`D est sur la droite (AC), mais pas entre A et C. On peut le placer du côté de A (avant A) ou du côté de C (après C) : deux côtés possibles, et une infinité de positions.`}
},
{t:"Perpendiculaires, parallèles et justifications", note:`<b>Comment rédiger une justification :</b> Je sais que : (d₁) ⊥ (d) et (d₂) ⊥ (d). Or : si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles. Donc : (d₁) // (d₂).`, e:[
  {n:"Exercice 5", t:"Quelle propriété ?", w:"Sur ton cahier", h:`<p>Pour chaque figure, réponds à la question puis cite la propriété que tu as utilisée.</p>
   <div class="figs"><figure>${ex("p3-03","Figure a de l'exercice 5",210)}<figcaption>a) Que peut-on dire des droites (AB) et (FE) ?</figcaption></figure>
   <figure>${ex("p3-04","Figure b de l'exercice 5",200)}<figcaption>b) Que peut-on dire des droites (AS) et (AB) ?</figcaption></figure></div>`,
   c:`<p>a) Je sais que (AB) ⊥ (DC) et (FE) ⊥ (DC). Or si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles. Donc (AB) // (FE).</p>
   <p>b) Je sais que (AB) // (SR) et (AS) ⊥ (SR) (angle droit codé en S). Or si deux droites sont parallèles et si une troisième droite est perpendiculaire à l'une, alors elle est perpendiculaire à l'autre. Donc (AS) ⊥ (AB).</p>`},
  {n:"Exercice 6", t:"Repérer les droites utiles", w:"Sur ton cahier", h:`<div class="figs"><figure>${ex("p4-05","Figure a de l'exercice 6",300)}<figcaption>a) Que peut-on dire des droites (d₂) et (d₃) ?</figcaption></figure>
   <figure>${ex("p4-06","Figure b de l'exercice 6",260)}<figcaption>b) Que peut-on dire des droites (FY) et (GH) ?</figcaption></figure>
   <figure>${ex("p4-07","Figure c de l'exercice 6",200)}<figcaption>c) On sait que (NK) // (IC). Que peut-on dire des droites (NK) et (NI) ?</figcaption></figure></div>`,
   c:`<p>a) (d₂) ⊥ (d₄) et (d₃) ⊥ (d₄) (angles droits codés). Or si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles. Donc (d₂) // (d₃).</p>
   <p>b) (FY) ⊥ (FG) et (GH) ⊥ (FG) (angles droits en F et en G). Même propriété : (FY) // (GH).</p>
   <p>c) (NK) // (IC) et (NI) ⊥ (IC) (angle droit en I, et N est sur [AI]). Or si deux droites sont parallèles et si une troisième droite est perpendiculaire à l'une, alors elle est perpendiculaire à l'autre. Donc (NK) ⊥ (NI).</p>`},
  {n:"Exercice 7", t:"Toute la partie B", w:"Sur ton cahier", h:`${ex("p5-08","Figure de l'exercice 7 avec sept droites",420)}<p>On donne : (d₁) // (d₂) et (d₄) // (d₆).</p>
   <p>a) Trouve tous les couples de droites perpendiculaires que tu peux justifier. b) Trouve des couples de droites parallèles, et justifie chacun par une propriété du cours. c) Quelles droites sont sécantes sans être perpendiculaires ?</p>`,
   c:`<p><b>Codés sur la figure :</b> (d₁) ⊥ (d₅), (d₃) ⊥ (d₅), (d₁) ⊥ (d₆).</p>
   <p>a) Avec la propriété 2 : (d₁) // (d₂) et (d₁) ⊥ (d₅), donc (d₂) ⊥ (d₅). De même (d₂) ⊥ (d₆). (d₄) // (d₆) et (d₁) ⊥ (d₆), donc (d₁) ⊥ (d₄), et de même (d₂) ⊥ (d₄). En continuant, chacune des droites (d₁), (d₂), (d₃) est perpendiculaire à chacune des droites (d₄), (d₅), (d₆).</p>
   <p>b) (d₁) // (d₃) : elles sont perpendiculaires à (d₅) (propriété 1). (d₅) // (d₆) : elles sont perpendiculaires à (d₁) (propriété 1). (d₄) // (d₅) : elles sont perpendiculaires à (d₁) (propriété 1). (d₂) // (d₃) : elles sont perpendiculaires à (d₅) (propriété 1).</p>
   <p>c) (d₇) coupe chacune des six autres droites (parfois en les prolongeant), sans former d'angle droit.</p>`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>On sait que (u) ⊥ (w) et (v) ⊥ (w). Recopie et complète : Je sais que …… Or …… Donc ……</p>`,
  c:`Je sais que (u) ⊥ (w) et (v) ⊥ (w). Or si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles. Donc (u) // (v).`},
 defi:{t:"Une chaîne de droites", w:"Sur ton cahier", h:`<p>On sait que (d₁) ⊥ (d₂), (d₂) ⊥ (d₃) et (d₃) ⊥ (d₄). Que peut-on dire des droites (d₁) et (d₄) ? Justifie en deux étapes.</p>`,
  c:`<p>Étape 1 : (d₁) ⊥ (d₂) et (d₃) ⊥ (d₂), donc (d₁) // (d₃) (propriété 1).</p><p>Étape 2 : (d₁) // (d₃) et (d₄) ⊥ (d₃), donc (d₄) ⊥ (d₁) (propriété 2).</p>`}
},
{t:"Constructions", e:[
  {n:"Exercice 8", t:"Tracer des perpendiculaires", w:"Sur ta feuille", h:`<p>Dans chaque cas, trace la perpendiculaire à (d) passant par M. Nomme-la (d'). N'oublie pas de coder l'angle droit.</p>
   <div class="figs">${ex("p6-09","Cas a",240)}${ex("p6-11","Cas b",240)}${ex("p6-13","Cas c",200)}</div>`,
   c:`Pour vérifier : pose ton équerre sur (d) et (d'), l'angle droit doit coller parfaitement, et (d') doit passer exactement par M. N'oublie pas le petit carré pour coder l'angle droit et le nom (d').`},
  {n:"Exercice 9", t:"Tracer des parallèles", w:"Sur ta feuille", h:`<p>Dans chaque cas, trace la parallèle à (d) passant par M. Nomme-la (d').</p>
   <div class="figs">${ex("p7-15","Cas a",240)}${ex("p7-17","Cas b",240)}${ex("p7-19","Cas c",240)}</div>`,
   c:`Méthode : trace d'abord la perpendiculaire (k) à (d) passant par M, puis la perpendiculaire à (k) passant par M : c'est (d'). Pour vérifier, l'écart entre (d) et (d') doit être le même partout.`},
  {n:"Exercice 10", t:"Construire puis justifier", w:"Sur ta feuille", h:`${ex("p7-21","Figure de l'exercice 10",280)}<p>1 — Trace la droite (d₁) parallèle à (d) passant par A. 2 — Trace la droite (d₂) perpendiculaire à (d) passant par B. 3 — Que peut-on dire des droites (d₁) et (d₂) ? Justifie à l'aide d'une propriété du cours.</p>`,
   c:`3 — Je sais que (d₁) // (d) et (d₂) ⊥ (d). Or si deux droites sont parallèles et si une troisième droite est perpendiculaire à l'une, alors elle est perpendiculaire à l'autre. Donc (d₂) ⊥ (d₁).`},
  {n:"Exercice 11", t:"Programmes de construction", w:"Sur ton cahier", h:`<p>1 — Exécute ce programme de construction : trace une droite (d), puis place un point M qui n'appartient pas à (d). Trace la droite (d₁) parallèle à (d) passant par M. Place un point N sur (d₁), puis trace la droite (d₂) perpendiculaire à (d₁) passant par N. Que peut-on dire des droites (d₂) et (d) ? Justifie.</p>
   <p>2 — Écris à ton tour le programme de construction de la figure ci-dessous.</p>${ex("p8-23","Figure de l'exercice 11",240)}`,
   c:`<p>1 — Je sais que (d₁) // (d) et (d₂) ⊥ (d₁). Or si deux droites sont parallèles et si une troisième droite est perpendiculaire à l'une, alors elle est perpendiculaire à l'autre. Donc (d₂) ⊥ (d).</p>
   <p>2 — Un programme possible : trace une droite (d) et place un point A sur (d). Trace la droite (d₁) perpendiculaire à (d) passant par A. Place un point B sur (d₁). Trace la droite (d₂) parallèle à (d) passant par B.</p>`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>Remets dans l'ordre les étapes pour tracer la perpendiculaire à (d) passant par M :</p><p>(1) On nomme la droite (d') et on code l'angle droit. (2) On pose un côté de l'angle droit de l'équerre sur (d), l'autre côté sur le point M. (3) On trace la droite le long du côté de l'équerre, puis on la prolonge à la règle.</p>`,
  c:`Ordre : (2), puis (3), puis (1).`},
 defi:{t:"Deux perpendiculaires", w:"Sur ton cahier", h:`<p>Trace une droite (d) et un point A qui n'appartient pas à (d). Trace (d₁) perpendiculaire à (d) passant par A, puis (d₂) perpendiculaire à (d₁) passant par A. Que peut-on dire de (d₂) et de (d) ? Justifie.</p>`,
  c:`(d) ⊥ (d₁) et (d₂) ⊥ (d₁). Or si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles. Donc (d₂) // (d). C'est exactement la méthode du cours pour tracer une parallèle !`}
}
],

/* ===================== QUIZ PROGRESSIF ===================== */
quiz: [
{nom:"Notations", q:{
 1:[ {q:"Comment note-t-on le segment d'extrémités A et B ?", c:["[AB]","(AB)","[AB)","AB"], rep:"[AB]", ex:"Un segment se note avec deux crochets."},
     {q:"Comment note-t-on la droite qui passe par E et F ?", c:["(EF)","[EF]","[EF)","EF"], rep:"(EF)", ex:"Une droite se note avec deux parenthèses."},
     {q:"Quelle notation désigne la longueur du segment [AB] ?", c:["AB","[AB]","(AB)","[AB)"], rep:"AB", ex:"La longueur se note sans crochets : AB."} ],
 2:[ {q:"Que désigne [AB) ?", c:["La demi-droite d'origine A passant par B","La demi-droite d'origine B passant par A","Le segment d'extrémités A et B","La droite passant par A et B"], rep:"La demi-droite d'origine A passant par B", ex:"Le crochet est du côté de l'origine : A."},
     {q:"Vrai ou faux : [AB) et [BA) désignent la même demi-droite.", c:VF, rep:"Faux", ex:"Elles n'ont pas la même origine."},
     {q:"Vrai ou faux : [AB] et [BA] désignent le même segment.", c:VF, rep:"Vrai", ex:"Un segment a deux extrémités, l'ordre ne compte pas."} ],
 3:[ {q:"Les points A, B et C sont dans cet ordre sur une droite. Le point C appartient-il à la demi-droite [BA) ?", fig:figAlign, c:["C ∉ [BA)","C ∈ [BA)"], rep:"C ∉ [BA)", ex:"[BA) part de B et va vers A : C est de l'autre côté."},
     {q:"Que peut-on mesurer ?", c:["Un segment","Une droite","Une demi-droite"], rep:"Un segment", ex:"La droite et la demi-droite sont illimitées."},
     {q:"A, B et C sont alignés. Combien de droites différentes passent par deux de ces points ?", c:["Une seule","Deux","Trois"], rep:"Une seule", ex:"(AB), (BC) et (AC) sont trois noms de la même droite."} ]
}},
{nom:"Appartenance et alignement", q:{
 1:[ {q:"Que signifie le symbole ∈ ?", c:["appartient à","n'appartient pas à","est parallèle à","est perpendiculaire à"], rep:"appartient à"},
     {q:"Quelle phrase est juste ?", fig:figAlign, c:["D ∉ (AB)","D ∈ (AB)"], rep:"D ∉ (AB)", ex:"D n'est pas sur la droite (AB)."},
     {q:"Quels points sont alignés ?", fig:figAlign, c:["A, B et C","A, B et D","B, C et D"], rep:"A, B et C"} ],
 2:[ {q:"Complète : B …… [AC]", fig:figAlign, c:["∈","∉"], rep:"∈", ex:"B est entre A et C : il est sur le segment."},
     {q:"Complète : A …… [BC]", fig:figAlign, c:["∈","∉"], rep:"∉", ex:"A n'est pas entre B et C."},
     {q:"Vrai ou faux : deux points sont toujours alignés.", c:VF, rep:"Vrai", ex:"On peut toujours tracer une droite qui passe par deux points."} ],
 3:[ {q:"Complète : C …… (AB) et C …… [AB]", fig:figAlign, c:["∈ et ∉","∈ et ∈","∉ et ∈","∉ et ∉"], rep:"∈ et ∉", ex:"C est sur la droite (AB), mais pas entre A et B."},
     {q:"Les droites (AD) et (CD) se coupent en un point. Lequel ?", fig:figAlign, c:["D","A","B","C"], rep:"D", ex:"D appartient aux deux droites : c'est leur point d'intersection."},
     {q:"Un point H vérifie H ∈ (PL) et H ∉ [PL]. Où est-il ?", c:["Sur la droite (PL), en dehors du segment","Entre P et L","En dehors de la droite (PL)"], rep:"Sur la droite (PL), en dehors du segment"} ]
}},
{nom:"Sécantes, perpendiculaires, parallèles", q:{
 1:[ {q:"Que signifie (d) // (d') ?", c:["(d) est parallèle à (d')","(d) est perpendiculaire à (d')","(d) coupe (d')"], rep:"(d) est parallèle à (d')"},
     {q:"Quel symbole signifie « est perpendiculaire à » ?", c:["⊥","//","∈","∉"], rep:"⊥"},
     {q:"Deux droites qui se coupent en formant un angle droit sont :", c:["perpendiculaires","parallèles","confondues"], rep:"perpendiculaires"} ],
 2:[ {q:"Ces deux droites sont :", fig:figSec, c:["sécantes, sans être perpendiculaires","parallèles","perpendiculaires"], rep:"sécantes, sans être perpendiculaires", ex:"Elles se coupent, mais l'angle n'est pas droit."},
     {q:"Ces deux droites sont :", fig:figPerp, c:["perpendiculaires","parallèles","ni sécantes ni parallèles"], rep:"perpendiculaires", ex:"L'angle droit est codé par le petit carré."},
     {q:"Vrai ou faux : deux droites perpendiculaires sont toujours sécantes.", c:VF, rep:"Vrai", ex:"Elles se coupent, en formant un angle droit."} ],
 3:[ {q:"Vrai ou faux : deux droites qui ne se coupent pas sur ma feuille sont forcément parallèles.", c:VF, rep:"Faux", ex:"En les prolongeant, elles peuvent se couper."},
     {q:"Ces deux droites sont :", fig:figLoin, c:["sécantes","parallèles"], rep:"sécantes", ex:"Elles se rapprochent : si on les prolonge vers la droite, elles se coupent."},
     {q:"Deux droites parallèles :", c:["ne se coupent jamais","se coupent en un seul point","forment un angle droit"], rep:"ne se coupent jamais"} ]
}},
{nom:"Les deux propriétés", q:{
 1:[ {q:"On sait que (a) ⊥ (c) et (b) ⊥ (c). Alors :", c:["(a) // (b)","(a) ⊥ (b)","On ne peut rien dire"], rep:"(a) // (b)", ex:"Deux droites perpendiculaires à une même droite sont parallèles."},
     {q:"On sait que (a) // (b) et (c) ⊥ (a). Alors :", c:["(c) ⊥ (b)","(c) // (b)","On ne peut rien dire"], rep:"(c) ⊥ (b)", ex:"Une droite perpendiculaire à l'une de deux parallèles est perpendiculaire à l'autre."} ],
 2:[ {q:"(d₁) ⊥ (d) et (d₂) ⊥ (d), donc (d₁) // (d₂). Quelle propriété a-t-on utilisée ?", c:["Si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles.","Si deux droites sont parallèles et si une troisième droite est perpendiculaire à l'une, alors elle est perpendiculaire à l'autre."], rep:"Si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles."},
     {q:"Dans un quadrilatère EFGH, (EH) ⊥ (EF) et (FG) ⊥ (EF). Que peut-on dire de (EH) et (FG) ?", c:["(EH) // (FG)","(EH) ⊥ (FG)","On ne peut rien dire"], rep:"(EH) // (FG)", ex:"Elles sont perpendiculaires à la même droite (EF)."},
     {q:"Dans une justification, que met-on après « Or » ?", c:["La propriété du cours","Ce que je sais d'après l'énoncé","La conclusion"], rep:"La propriété du cours", ex:"Je sais que (l'énoncé), Or (la propriété), Donc (la conclusion)."} ],
 3:[ {q:"On sait que (x) // (y) et (z) ⊥ (y). Que peut-on dire de (z) et (x), et avec quelle propriété ?", c:["(z) ⊥ (x), propriété 2","(z) ⊥ (x), propriété 1","(z) // (x), propriété 1","(z) // (x), propriété 2"], rep:"(z) ⊥ (x), propriété 2"},
     {q:"On sait que (d₁) ⊥ (d₃), (d₂) ⊥ (d₃) et (d₄) ⊥ (d₁). Que peut-on dire de (d₄) et (d₂) ?", c:["(d₄) ⊥ (d₂)","(d₄) // (d₂)","On ne peut rien dire"], rep:"(d₄) ⊥ (d₂)", ex:"D'abord (d₁) // (d₂) (propriété 1), puis (d₄) ⊥ (d₂) (propriété 2)."},
     {q:"On sait que (a) ⊥ (b) et (c) ⊥ (a). Que peut-on dire de (b) et (c) ?", c:["(b) // (c)","(b) ⊥ (c)","On ne peut rien dire"], rep:"(b) // (c)", ex:"(b) et (c) sont toutes les deux perpendiculaires à (a) : propriété 1."} ]
}},
{nom:"Constructions", q:{
 1:[ {q:"Pour tracer une perpendiculaire, de quels instruments as-tu besoin ?", c:["La règle et l'équerre","Le compas seul","La règle seule"], rep:"La règle et l'équerre"},
     {q:"Après avoir tracé une perpendiculaire, il ne faut pas oublier :", c:["de coder l'angle droit et de nommer la droite","d'effacer la droite de départ","de mesurer la droite"], rep:"de coder l'angle droit et de nommer la droite"} ],
 2:[ {q:"Avec la méthode du cours, pour tracer la parallèle à (d) passant par M, on trace d'abord :", c:["la perpendiculaire (k) à (d) passant par M","un cercle de centre M","la droite (dM)"], rep:"la perpendiculaire (k) à (d) passant par M"},
     {q:"Pour tracer la perpendiculaire à (d) passant par M, où pose-t-on l'équerre ?", c:["Un côté de l'angle droit sur (d), l'autre côté passant par M","L'angle droit sur le point M, sans toucher (d)","Le grand côté de l'équerre sur (d), n'importe où"], rep:"Un côté de l'angle droit sur (d), l'autre côté passant par M"} ],
 3:[ {q:"Pourquoi la méthode de la parallèle (deux perpendiculaires) fonctionne-t-elle ?", c:["(d) et (d') sont perpendiculaires à (k), donc parallèles (propriété 1)","(d) et (d') ont la même longueur","(k) est parallèle à (d)"], rep:"(d) et (d') sont perpendiculaires à (k), donc parallèles (propriété 1)"},
     {q:"Tu traces (d₁) // (d) passant par A, puis (d₂) ⊥ (d) passant par B. Que peux-tu dire de (d₁) et (d₂) ?", c:["(d₂) ⊥ (d₁)","(d₂) // (d₁)","On ne peut rien dire"], rep:"(d₂) ⊥ (d₁)", ex:"Propriété 2 : (d₂) est perpendiculaire à (d), donc aussi à sa parallèle (d₁)."} ]
}}
]
};
})();
