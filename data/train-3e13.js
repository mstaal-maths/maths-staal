/* 3e · chapitre 13 — fiche d'entraînement : les exercices de M. Staal sur le théorème de Thalès, avec d'autres nombres.
   Figures calculées à partir des longueurs (window.G3k13). */
TRAIN["3e-13"] = function(){
const {ri, pick, shuf} = TR;
const {F, Fr, randThales, randFig} = window.G3k13;
const r3=x=>Math.round(x*1000)/1000;
const red=(T)=>{ const n=T.n; return `<p>Les points ${n.A}, ${n.M}, ${n.B} sont alignés et les points ${n.A}, ${n.N}, ${n.C} sont alignés. De plus, (${n.M}${n.N}) // (${n.B}${n.C}).</p><p>D'après le théorème de Thalès : ${Fr(n.A+n.M,n.A+n.B)} = ${Fr(n.A+n.N,n.A+n.C)} = ${Fr(n.M+n.N,n.B+n.C)}</p>`; };

/* 1. deux configurations : deux longueurs à calculer */
const T1=randThales(1), T2=randThales(2);
/* 2. égalités de quotients */
const T3=randThales(pick([1,2]));
/* 3. problèmes */
const arb=(()=>{ const h=pick([1.5,1.6,1.7,1.8]), d=pick([2,3,4,5]), L=d*pick([2,3,4,5]); return {h,d,L,H:r3(h*L/d)}; })();
const voile=(()=>{ const k=pick([0.5,0.625,0.4,0.75]), KM=pick([8,12,16]), MO=pick([6.4,8,10.4,12]); return {k,KM,KL:r3(k*KM),MO,LN:r3(k*MO)}; })();
const tab=(()=>{ let cg,ag,ab; do{ cg=pick([24,28,30,32]); ag=pick([36,40,42,45,48]); ab=pick([45,48,50,51,54,56,60]); }while((cg*ab*1000)%ag); return {cg,ag,ab,cd:r3(cg*ab/ag)}; })();
const feux=(()=>{ let hp,hm,ha,ab; do{ hp=pick([0.6,0.65,0.7,0.75,0.8]); hm=pick([20,25,30,40,50]); ha=pick([2,2.5,3,4,5]); ab=hp*(hm-ha)/hm; }while(Math.abs(ab*1e4-Math.round(ab*1e4))>1e-6); return {hp,hm,ha,ab:Math.round(ab*1e4)/1e4}; })();
const puits=(()=>{ const ot=pick([1.5,1.6,1.7,1.8]), bt=pick([0.8,1,1.2,1.5]), cb=pick([1,1.2,1.5,2]); return {ot,bt,cb,cf:r3(cb*ot/bt)}; })();
const ok=x=>Math.abs(x*100-Math.round(x*100))<1e-6;

return [
 {t:"Calculer une longueur", e:[
  {n:"Exercice 1", t:"Première configuration", w:"Sur ton cahier", h:`<p>Sur la figure, (${T1.n.M}${T1.n.N}) // (${T1.n.B}${T1.n.C}).</p>${randFig(T1,{AM:F(T1.AM),AB:F(T1.AB),AN:F(T1.AN),BC:F(T1.BC)})}<p>On donne ${T1.n.A}${T1.n.M} = ${F(T1.AM)} cm, ${T1.n.A}${T1.n.B} = ${F(T1.AB)} cm, ${T1.n.A}${T1.n.N} = ${F(T1.AN)} cm et ${T1.n.B}${T1.n.C} = ${F(T1.BC)} cm.</p><p>Calcule ${T1.n.M}${T1.n.N} et ${T1.n.A}${T1.n.C}.</p>`,
   c:`${red(T1)}<p class="calc">${T1.n.M}${T1.n.N} = ${Fr(`${F(T1.AM)} × ${F(T1.BC)}`,F(T1.AB))} = ${F(T1.MN)} cm</p><p class="calc">${T1.n.A}${T1.n.C} = ${Fr(`${F(T1.AB)} × ${F(T1.AN)}`,F(T1.AM))} = ${F(T1.AC)} cm</p>`},
  {n:"Exercice 2", t:"Deuxième configuration", w:"Sur ton cahier", h:`<p>Les droites (${T2.n.M}${T2.n.B}) et (${T2.n.N}${T2.n.C}) se coupent en ${T2.n.A}, et (${T2.n.M}${T2.n.N}) // (${T2.n.B}${T2.n.C}).</p>${randFig(T2,{AM:F(T2.AM),AB:F(T2.AB),AC:F(T2.AC),MN:F(T2.MN)})}<p>On donne ${T2.n.A}${T2.n.M} = ${F(T2.AM)} cm, ${T2.n.A}${T2.n.B} = ${F(T2.AB)} cm, ${T2.n.A}${T2.n.C} = ${F(T2.AC)} cm et ${T2.n.M}${T2.n.N} = ${F(T2.MN)} cm.</p><p>Calcule ${T2.n.A}${T2.n.N} et ${T2.n.B}${T2.n.C}.</p>`,
   c:`${red(T2)}<p class="calc">${T2.n.A}${T2.n.N} = ${Fr(`${F(T2.AM)} × ${F(T2.AC)}`,F(T2.AB))} = ${F(T2.AN)} cm</p><p class="calc">${T2.n.B}${T2.n.C} = ${Fr(`${F(T2.AB)} × ${F(T2.MN)}`,F(T2.AM))} = ${F(T2.BC)} cm</p>`},
  {n:"Exercice 3", t:"Égalités de quotients", w:"Sur ton cahier", h:`<p>Sur la figure, (${T3.n.M}${T3.n.N}) // (${T3.n.B}${T3.n.C}).</p>${randFig(T3,{})}<p>Indique les 3 conditions qui permettent d'utiliser le théorème de Thalès, puis écris les égalités de quotients.</p>`,
   c:red(T3)}
 ]},
 {t:"Problèmes", e:[
  {n:"Exercice 4", t:"La hauteur d'un arbre", w:"Sur ton cahier", h:`<p>Une personne de ${F(arb.h)} m se place dans l'ombre d'un arbre, à ${arb.d} m de l'extrémité de l'ombre. L'ombre de l'arbre mesure ${arb.L} m.</p><p>La personne et l'arbre sont perpendiculaires au sol. Quelle est la hauteur de l'arbre ?</p>`,
   c:`<p>L'extrémité de l'ombre, le sommet de la tête et le haut de l'arbre sont alignés ; l'extrémité de l'ombre, les pieds de la personne et le pied de l'arbre aussi. La personne et l'arbre sont perpendiculaires au sol, donc parallèles.</p><p class="calc">${Fr(arb.d,arb.L)} = ${Fr(F(arb.h),"h")} donc h = ${Fr(`${arb.L} × ${F(arb.h)}`,arb.d)} = ${F(arb.H)} m</p>`},
  {n:"Exercice 5", t:"Voile d'ombrage", w:"Sur ton cahier", h:`<p>K, L, M sont alignés et K, N, O sont alignés ; (LN) // (MO).</p><p>KL = ${F(voile.KL)} m ; KM = ${voile.KM} m ; MO = ${F(voile.MO)} m.</p><p>Calcule la longueur LN de la fermeture éclair.</p>`,
   c:`<p class="calc">${Fr("KL","KM")} = ${Fr("LN","MO")} donc LN = ${Fr(`${F(voile.KL)} × ${F(voile.MO)}`,voile.KM)} = ${F(voile.LN)} m</p>`},
  {n:"Exercice 6", t:"Tabouret pliant", w:"Sur ton cahier", h:`<p>Les pieds [CB] et [AD] d'un tabouret se croisent en G. CG = DG = ${tab.cg} cm, AG = BG = ${tab.ag} cm et AB = ${tab.ab} cm.</p><p>L'assise [CD] est parallèle au sol (AB). Calcule CD.</p>`,
   c:`<p>C, G, B et A, G, D sont alignés ; (CD) // (AB).</p><p class="calc">${Fr("GC","GB")} = ${Fr("CD","AB")} donc CD = ${Fr(`${tab.cg} × ${tab.ab}`,tab.ag)} = ${F(tab.cd)} cm</p>`},
  {n:"Exercice 7", t:"Réglage des feux de croisement", w:"Sur ton cahier", h:`<p>La hauteur des feux est HP = ${F(feux.hp*100)} cm, la portée des feux est HM = ${feux.hm} m et le mur est à HA = ${F(feux.ha)} m de la voiture.</p><p>Calcule la hauteur de réglage AB.</p>`,
   c:`<p>M, B, P sont alignés ; M, A, H sont alignés ; (AB) // (HP). MA = ${feux.hm} − ${F(feux.ha)} = ${F(feux.hm-feux.ha)} m.</p><p class="calc">${Fr("MA","MH")} = ${Fr("AB","HP")} donc AB = ${Fr(`${F(feux.hm-feux.ha)} × ${F(feux.hp)}`,feux.hm)} = ${F(feux.ab,4)} m = ${F(r3(feux.ab*100))} cm</p>`},
  {n:"Exercice 8", t:"La profondeur d'un puits", w:"Sur ton cahier", h:`<p>Un arpenteur aligne son œil O avec le bord B d'un puits et le coin opposé F du fond.</p><p>Ses yeux sont à OT = ${F(puits.ot)} m du sol, il est à BT = ${F(puits.bt)} m du bord et le diamètre du puits est CB = ${F(puits.cb)} m.</p><p>Calcule la profondeur CF du puits${ok(puits.cf)?"":" (arrondie au centimètre)"}.</p>`,
   c:`<p>O, B, F sont alignés ; T, B, C sont alignés ; (OT) // (CF).</p><p class="calc">${Fr("BC","BT")} = ${Fr("CF","TO")} donc CF = ${Fr(`${F(puits.cb)} × ${F(puits.ot)}`,F(puits.bt))} ${ok(puits.cf)?"=":"≈"} ${F(puits.cf,2)} m</p>`}
 ]}
];
};
