/* 5e — Chapitre 6 : « Des Bermudes aux étoiles, ils sont partout : les triangles »
   Les figures du cours et de la fiche sont celles des documents Word de M. Staal (img/5k6co, 5k6ex, 5k6cr).
   Les figures du QCM et de la fiche d'entraînement sont dessinées en SVG à partir des valeurs (outils window.TRI). */
(function(){
const VF=["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const co=(p,alt,w)=>img("5k6co/"+p+".png",alt,w), ex=(p,alt,w)=>img("5k6ex/"+p+".png",alt,w), cr=(p,alt,w)=>img("5k6cr/"+p+".png",alt,w);
const fig=(cap,body)=>{ const m=/^<img[^>]*width:(\d+)px/.exec(body); return `<figure${m?` style="max-width:${Math.max(+m[1],150)}px"`:""}>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`; };
const ang=s=>`<span class="ang">${s}</span>`;
const r3=x=>Math.round(x*1000)/1000;
const F=x=>{ const r=r3(x); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const RED="#d0342c", BLUE="#1e5aa8", GRN="#1e8a4c", ORA="#d9730d";

/* ------------------------------------------------------------------
   Petite géométrie (coordonnées en cm, y vers le haut)
------------------------------------------------------------------ */
const V={
  add:(a,b)=>[a[0]+b[0],a[1]+b[1]], sub:(a,b)=>[a[0]-b[0],a[1]-b[1]], mul:(a,k)=>[a[0]*k,a[1]*k],
  d:(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]), mid:(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2], dot:(a,b)=>a[0]*b[0]+a[1]*b[1],
  perp:u=>[-u[1],u[0]], unit:u=>{ const n=Math.hypot(u[0],u[1]); return [u[0]/n,u[1]/n]; },
  tpar:(p,a,b)=>{ const u=V.sub(b,a); return V.dot(V.sub(p,a),u)/V.dot(u,u); },
  foot:(p,a,b)=>{ const u=V.sub(b,a); return V.add(a,V.mul(u,V.tpar(p,a,b))); },
  inter:(p1,d1,p2,d2)=>{ const det=-d1[0]*d2[1]+d1[1]*d2[0], r=V.sub(p2,p1), t=(-r[0]*d2[1]+r[1]*d2[0])/det; return V.add(p1,V.mul(d1,t)); },
  cc:(A,B,C)=>V.inter(V.mid(A,B),V.perp(V.sub(B,A)),V.mid(A,C),V.perp(V.sub(C,A))),
  ortho:(A,B,C)=>V.inter(A,V.perp(V.sub(C,B)),B,V.perp(V.sub(C,A))),
  /* triangle de côtés BC = a, CA = b, AB = c : B(0 ; 0), C(a ; 0), A au-dessus */
  tri:(a,b,c)=>{ const x=(c*c-b*b+a*a)/(2*a); return {A:[x,Math.sqrt(Math.max(0,c*c-x*x))],B:[0,0],C:[a,0]}; },
  rot:(P,deg)=>{ const t=deg*Math.PI/180, c=Math.cos(t), s=Math.sin(t), o={}; Object.entries(P).forEach(([k,[x,y]])=>o[k]=[x*c-y*s,x*s+y*c]); return o; },
  /* angle (en degrés) au sommet v */
  ang:(v,a,b)=>{ const u=V.sub(a,v), w=V.sub(b,v); return Math.acos(Math.max(-1,Math.min(1,V.dot(u,w)/Math.hypot(...u)/Math.hypot(...w))))*180/Math.PI; }
};

/* ------------------------------------------------------------------
   Figure SVG
   P {nom:[x,y]} · poly [[noms]] · seg [[a,b,style]] · lines [[a,b,style,prolongement1,prolongement2]]
   ticks [[a,b,n,t]] codage de longueur · right [[sommet,a,b]] angle droit · circ [[centre,r,style]]
   arcs [[centre,r,angle,ouverture]] arcs de compas · dots [noms] · lab [noms écrits] (par défaut tous)
   off {nom:[dx,dy]} · len [[a,b,texte]] longueurs écrites à l'extérieur · txt [[texte,point,dx,dy,couleur]]
   Styles : ln (trait noir) · d (pointillés gris : prolongement) · h / hd (hauteur) · m (médiatrice) · md (médiane) · c (cercle) · b (bleu pointillé)
------------------------------------------------------------------ */
const ST={ln:"stroke:var(--ink);stroke-width:2.2", d:"stroke:#888;stroke-width:1.8;stroke-dasharray:6 5", h:`stroke:${GRN};stroke-width:2.6`, hd:`stroke:${GRN};stroke-width:2.2;stroke-dasharray:7 5`,
  m:`stroke:${RED};stroke-width:2;stroke-dasharray:8 5`, M:`stroke:${RED};stroke-width:2.6`, md:`stroke:${ORA};stroke-width:2.6`, c:`stroke:${BLUE};stroke-width:2.4`, b:`stroke:${BLUE};stroke-width:1.8;stroke-dasharray:6 4`, k:`stroke:var(--ink);stroke-width:3.4`};
function geo(o){
  const k=o.k||36, pad=o.pad??(o.len?60:34), P=o.P, g=a=>typeof a==="string"?P[a]:a;
  const all=[...Object.values(P), ...(o.box||[])];
  (o.circ||[]).forEach(([c,r])=>{ const C=g(c); all.push([C[0]-r,C[1]-r],[C[0]+r,C[1]+r]); });
  const lineEnds=[]; (o.lines||[]).forEach(([a,b,t,e1=1,e2=1])=>{ const A=g(a), B=g(b), u=V.unit(V.sub(B,A)); lineEnds.push([V.sub(A,V.mul(u,e1)),V.add(B,V.mul(u,e2)),t]); all.push(lineEnds[lineEnds.length-1][0],lineEnds[lineEnds.length-1][1]); });
  const mx=Math.min(...all.map(p=>p[0])), Mx=Math.max(...all.map(p=>p[0])), my=Math.min(...all.map(p=>p[1])), My=Math.max(...all.map(p=>p[1]));
  const X=x=>pad+(x-mx)*k, Y=y=>pad+(My-y)*k, f=v=>v.toFixed(1);
  const W=Math.round((Mx-mx)*k+2*pad), H=Math.round((My-my)*k+2*pad);
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${o.w?Math.min(o.w,W):W}" role="img" aria-label="${o.alt||"Figure de géométrie"}">`;
  const L=(a,b,t)=>`<line x1="${f(X(a[0]))}" y1="${f(Y(a[1]))}" x2="${f(X(b[0]))}" y2="${f(Y(b[1]))}" style="${ST[t||"ln"]};fill:none;stroke-linecap:round"/>`;
  (o.circ||[]).forEach(([c,r,t])=>{ const C=g(c); s+=`<circle cx="${f(X(C[0]))}" cy="${f(Y(C[1]))}" r="${f(r*k)}" style="fill:none;${ST[t||"c"]}"/>`; });
  (o.arcs||[]).forEach(([c,r,a,sp=36])=>{ const C=g(c), t0=(a-sp/2)*Math.PI/180, t1=(a+sp/2)*Math.PI/180;
    s+=`<path d="M${f(X(C[0]+r*Math.cos(t0)))} ${f(Y(C[1]+r*Math.sin(t0)))} A${f(r*k)} ${f(r*k)} 0 0 0 ${f(X(C[0]+r*Math.cos(t1)))} ${f(Y(C[1]+r*Math.sin(t1)))}" style="fill:none;stroke:${BLUE};stroke-width:1.8"/>`; });
  (o.poly||[]).forEach(N=>{ s+=`<polygon points="${N.map(n=>f(X(g(n)[0]))+","+f(Y(g(n)[1]))).join(" ")}" style="fill:none;${ST.ln};stroke-linejoin:round"/>`; });
  lineEnds.forEach(([a,b,t])=>{ s+=L(a,b,t); });
  (o.seg||[]).forEach(([a,b,t])=>{ s+=L(g(a),g(b),t); });
  (o.ticks||[]).forEach(([a,b,n=1,t=.5])=>{ const A=g(a), B=g(b), px=[X(A[0]+(B[0]-A[0])*t), Y(A[1]+(B[1]-A[1])*t)];
    const dx=X(B[0])-X(A[0]), dy=Y(B[1])-Y(A[1]), n0=Math.hypot(dx,dy), ux=dx/n0, uy=dy/n0;
    for(let i=0;i<n;i++){ const off=(i-(n-1)/2)*5, cx=px[0]+ux*off, cy=px[1]+uy*off; s+=`<line x1="${f(cx+uy*7)}" y1="${f(cy-ux*7)}" x2="${f(cx-uy*7)}" y2="${f(cy+ux*7)}" style="stroke:var(--ink);stroke-width:2"/>`; } });
  (o.right||[]).forEach(([v,a,b,col])=>{ const Vv=g(v), A=g(a), B=g(b), p=[X(Vv[0]),Y(Vv[1])];
    const da=V.unit([X(A[0])-p[0],Y(A[1])-p[1]]), db=V.unit([X(B[0])-p[0],Y(B[1])-p[1]]), z=11;
    s+=`<path d="M${f(p[0]+da[0]*z)} ${f(p[1]+da[1]*z)} L${f(p[0]+da[0]*z+db[0]*z)} ${f(p[1]+da[1]*z+db[1]*z)} L${f(p[0]+db[0]*z)} ${f(p[1]+db[1]*z)}" style="fill:none;stroke:${col||"var(--ink)"};stroke-width:1.7"/>`; });
  (o.dots||[]).forEach(n=>{ const p=g(n); s+=`<circle cx="${f(X(p[0]))}" cy="${f(Y(p[1]))}" r="3.6" style="fill:var(--ink)"/>`; });
  const names=o.lab||Object.keys(P), cen=o.cen?g(o.cen):(()=>{ const T=o.poly&&o.poly[0]?o.poly[0].map(g):Object.values(P); return [T.reduce((a,p)=>a+p[0],0)/T.length, T.reduce((a,p)=>a+p[1],0)/T.length]; })();
  names.forEach(n=>{ const p=P[n]; let d=o.off&&o.off[n]; if(!d){ let u=[X(p[0])-X(cen[0]),Y(p[1])-Y(cen[1])]; if(Math.hypot(...u)<1) u=[0,-1]; u=V.unit(u); d=[u[0]*17,u[1]*17]; }
    s+=`<text x="${f(X(p[0])+d[0])}" y="${f(Y(p[1])+d[1]+6)}" text-anchor="middle" style="font-weight:700;font-size:17px;fill:var(--ink)">${n}</text>`; });
  (o.len||[]).forEach(([a,b,t,side])=>{ const A=g(a), B=g(b), m=[(X(A[0])+X(B[0]))/2,(Y(A[1])+Y(B[1]))/2]; let nrm=V.unit(V.perp([X(B[0])-X(A[0]),Y(B[1])-Y(A[1])]));
    const c=[X(cen[0]),Y(cen[1])]; if(V.dot(nrm,V.sub(m,c))<0) nrm=V.mul(nrm,-1); if(side) nrm=V.mul(nrm,-1);
    const tw=String(t).length*8.2, dd=13+Math.abs(nrm[0])*tw/2+Math.abs(nrm[1])*4, q=[m[0]+nrm[0]*dd, m[1]+nrm[1]*dd+5];
    s+=`<text x="${f(q[0])}" y="${f(q[1])}" text-anchor="middle" style="font-size:15px;font-weight:600;fill:var(--ink)">${t}</text>`; });
  (o.txt||[]).forEach(([t,p,dx=0,dy=0,col])=>{ const q=g(p); s+=`<text x="${f(X(q[0])+dx)}" y="${f(Y(q[1])+dy+5)}" text-anchor="middle" style="font-size:15px;font-weight:700;fill:${col||"var(--ink)"}">${t}</text>`; });
  return s+"</svg>";
}

/* ---------- triangles « types » pour reconnaître une nature ---------- */
const NOMS=["ABC","DEF","MNP","RST","IJK","UVW","EFG","XYZ","GHI","KLM"];
function natureFig(type, nom, rot){
  const [a,b,c]=nom.split(""); let P, o={};
  if(type==="iso"){ const base=ri(30,42)/10, h=ri(30,45)/10; P={[a]:[base/2,h],[b]:[0,0],[c]:[base,0]}; o.ticks=[[a,b],[a,c]]; }
  else if(type==="equi"){ const s=ri(32,40)/10; P={[a]:[s/2,s*Math.sqrt(3)/2],[b]:[0,0],[c]:[s,0]}; o.ticks=[[a,b],[a,c],[b,c]]; }
  else if(type==="rect"){ P={[a]:[0,ri(25,35)/10],[b]:[0,0],[c]:[ri(35,45)/10,0]}; o.right=[[b,a,c]]; }
  else { P={[a]:[ri(8,14)/10,ri(26,34)/10],[b]:[0,0],[c]:[ri(36,44)/10,ri(-6,6)/10]}; }
  P=V.rot(P, rot??ri(-20,20));
  return {P, svg:geo(Object.assign({P, poly:[[a,b,c]], k:34, w:200, alt:"Un triangle "+nom}, o)), apex:a, right:b};
}
const NAT={iso:"isocèle", equi:"équilatéral", rect:"rectangle", quel:"quelconque"};
const natEx=(t,nom,f)=>t==="iso"?`Deux côtés codés de même longueur : ${f.apex}${nom.replace(f.apex,"")[0]} = ${f.apex}${nom.replace(f.apex,"")[1]}. Le triangle est isocèle en ${f.apex}.`
  : t==="equi"?"Les trois côtés sont codés de la même longueur." : t==="rect"?`Il y a un angle droit codé en ${f.right}.` : "Il n'y a aucun codage : le triangle est quelconque.";

/* ---------- trait de couleur : hauteur, médiane, médiatrice ou aucune ---------- */
function traitFig(type, rot){
  const b=ri(50,62)/10, h=ri(30,40)/10; let ax; const m=b/2;
  do{ ax=ri(8,Math.round(b*10)-8)/10; }while(Math.abs(ax-m)<0.9);
  const P={A:[ax,h],B:[0,0],C:[b,0]}, o={P, poly:[["A","B","C"]], k:38, w:280, cen:[b/2,h/3]};
  if(type==="hauteur"){ P.H=[ax,0]; o.seg=[["A","H","k"]]; o.right=[["H","C","A"]]; o.dots=["H"]; o.off={H:[0,20]}; }
  else if(type==="médiane"){ P.I=[m,0]; o.seg=[["A","I","k"]]; o.ticks=[["B","I"],["I","C"]]; o.dots=["I"]; o.off={I:[0,20]}; }
  else if(type==="médiatrice"){ P.I=[m,0]; P.T=[m,h+0.3]; P.U=[m,-0.9]; o.seg=[["T","U","k"]]; o.ticks=[["B","I"],["I","C"]]; o.right=[["I","C","T"]]; o.lab=["A","B","C","I"]; o.off={I:[14,22]}; }
  else { let kx; do{ kx=ri(5,Math.round(b*10)-3)/10; }while(Math.abs(kx-m)<0.8||Math.abs(kx-ax)<0.6); P.K=[kx,0]; o.seg=[["A","K","k"]]; o.dots=["K"]; o.off={K:[0,20]}; }
  o.P=V.rot(P, rot??ri(-12,12)); return geo(o);
}
const TRAIT_EX={hauteur:"Le trait passe par le sommet A et il est perpendiculaire à (BC) : angle droit codé en H. C'est la hauteur issue de A.",
  "médiane":"Le trait passe par le sommet A et par le milieu I de [BC] (codage BI = IC). C'est la médiane issue de A.",
  "médiatrice":"Le trait est perpendiculaire à [BC] et passe par son milieu I, mais il ne passe pas par A. C'est la médiatrice de [BC].",
  aucune:"K n'est pas le milieu de [BC] et (AK) n'est pas perpendiculaire à (BC) : ce n'est aucune des trois."};

/* ---------- triangles pour l'aire (base horizontale) ---------- */
function aireFig(type, b, h, extra){
  const k=Math.min(34, 250/Math.max(b+ (type==="obtus"?extra:0), h*1.2)), o={k, w:300, poly:[["A","B","C"]]};
  if(type==="aigu"){ const x=b*(ri(30,65)/100); o.P={A:[x,h],B:[0,0],C:[b,0],H:[x,0]}; o.seg=[["A","H","hd"]]; o.right=[["H","C","A",GRN]]; o.len=[["B","C",F(b)+" cm"]]; o.txt=[[F(h)+" cm",[x,h*0.4],30,0]]; o.lab=["A","B","C"]; }
  else if(type==="rect"){ o.P={A:[0,h],B:[0,0],C:[b,0]}; o.right=[["B","C","A"]]; o.len=[["B","C",F(b)+" cm"],["A","B",F(h)+" cm"]]; }
  else if(type==="obtus"){ o.P={A:[-extra,h],B:[0,0],C:[b,0],H:[-extra,0]}; o.seg=[["H","B","d"],["A","H","hd"]]; o.right=[["H","B","A",GRN]]; o.len=[["B","C",F(b)+" cm"]]; o.txt=[[F(h)+" cm",[-extra,h/2],-34,0]]; o.lab=["A","B","C"]; o.off={B:[4,22]}; }
  else { /* isocèle : la longueur d'un côté ne sert pas */ o.P={A:[b/2,h],B:[0,0],C:[b,0],H:[b/2,0]}; o.seg=[["A","H","hd"]]; o.right=[["H","C","A",GRN]]; o.ticks=[["A","B"],["A","C"]]; o.len=[["B","C",F(b)+" cm"],["A","B",F(extra)+" cm"],["A","C",F(extra)+" cm"]]; o.txt=[[F(h)+" cm",[b/2,h*0.3],28,0]]; o.lab=["A","B","C"]; }
  o.alt="Triangle ABC avec ses longueurs"; return geo(o);
}
/* triplets « rectangle » : isocèle avec côté inutile [base, hauteur, côté] */
const ISO3=[[8,3,5],[6,4,5],[12,8,10],[16,6,10],[9,6,7.5],[12,4.5,7.5]];
window.TRI={V, geo, F, ang, natureFig, NAT, natEx, traitFig, TRAIT_EX, aireFig, ISO3, NOMS, RED, BLUE, GRN, ORA};

/* ===================== schémas ===================== */
const S_NAT=sch("Les triangles particuliers", `<div class="figs">${fig("isocèle en C : CA = CB",co("iso","Triangle isocèle",130))}${fig("équilatéral",co("equi","Triangle équilatéral",130))}${fig("rectangle en N ; hypoténuse [MP]",co("rect","Triangle rectangle",130))}</div><p class="schN">L'hypoténuse est le côté opposé à l'angle droit.</p>`);
const S_MED=sch("La médiatrice d'un segment", `${co("med","Médiatrice (m) du segment [AB] et point P sur (m)",280)}<p class="schN">(m) est perpendiculaire à [AB] et passe par son milieu. Un point de (m) est à égale distance de A et de B : PA = PB. Et un point à égale distance de A et de B est sur (m).</p>`);
const S_CC=sch("Le cercle circonscrit", `<div class="figs">${fig("trois angles aigus : O à l'intérieur",co("cc1","Centre à l'intérieur",130))}${fig("rectangle : O milieu de l'hypoténuse",co("cc2","Centre au milieu de l'hypoténuse",130))}${fig("angle obtus : O à l'extérieur",co("cc3","Centre à l'extérieur",130))}</div><p class="schN">Son centre O est le point de concours des médiatrices : OA = OB = OC. Triangle rectangle : rayon = hypoténuse ÷ 2.</p>`);
const S_HAUT=sch("Les hauteurs d'un triangle", `<div class="figs">${fig("hauteur issue de A",co("h1","Hauteur issue de A",170))}${fig("pied à l'extérieur : on prolonge",co("h2","Hauteur issue de C à l'extérieur",170))}</div><p class="schN">Une hauteur passe par un sommet et est perpendiculaire au côté opposé. Les trois hauteurs se coupent en H, l'orthocentre.</p>`);
const S_MEDI=sch("Les médianes d'un triangle", `${co("mediane","Médiane (AI) issue de A",230)}<p class="schN">Une médiane passe par un sommet et par le milieu du côté opposé. Les trois médianes se coupent au centre de gravité. Une médiane partage le triangle en deux triangles de même aire.</p>`);
const S_AIRE=sch("L'aire d'un triangle", `<div class="figs">${fig("6 × 4 ÷ 2 = 12 cm²",co("a1","Aire 12 cm²",140))}${fig("5 × 3 ÷ 2 = 7,5 cm²",co("a2","Aire 7,5 cm²",140))}${fig("4 × 3,5 ÷ 2 = 7 cm²",co("a3","Aire 7 cm²",140))}</div><p class="calc">Aire = base × hauteur ÷ 2</p><p class="schN">La hauteur est perpendiculaire à la base choisie.</p>`);

CH["5e-6"] = {
intro:"« Des Bermudes aux étoiles, ils sont partout » : la médiatrice d'un segment, le cercle circonscrit à un triangle, les hauteurs et les médianes d'un triangle, et l'aire d'un triangle.",
savoir:[
  "construire et utiliser la médiatrice d'un segment ;",
  "construire le cercle circonscrit à un triangle et connaître le cas du triangle rectangle ;",
  "construire les hauteurs et les médianes d'un triangle ;",
  "calculer l'aire d'un triangle ;",
  "rédiger de courtes démonstrations en citant la propriété utilisée."
],

/* ===================== COURS ===================== */
cours:[
{k:"0", t:"Rappels de 6e : les triangles particuliers", h:`
  <div class="figs">${fig("ABC est isocèle en C",co("iso","Triangle ABC isocèle en C",170))}${fig("DEF est équilatéral",co("equi","Triangle DEF équilatéral",170))}${fig("MNP est rectangle en N",co("rect","Triangle MNP rectangle en N",170))}</div>
  <div class="retenir" data-l="Vocabulaire"><ul><li>Un triangle <b>isocèle</b> a deux côtés de même longueur. Ici, ABC est isocèle en C : CA = CB.</li><li>Un triangle <b>équilatéral</b> a trois côtés de même longueur. Ici, DEF est équilatéral.</li><li>Un triangle <b>rectangle</b> a un angle droit. Ici, MNP est rectangle en N : l'angle ${ang("MNP")} est droit. [MP] est l'<b>hypoténuse</b>.</li></ul></div>`},
{k:"1", t:"La médiatrice d'un segment", h:`
  <div class="retenir" data-l="Définition"><p>La <b>médiatrice</b> d'un segment est la droite perpendiculaire à ce segment et qui passe par son milieu.</p></div>
  ${co("med","La droite (m) est la médiatrice de [AB] ; P est un point de (m)",340)}
  <div class="retenir" data-l="Propriétés"><p><b>(1)</b> Si un point appartient à la médiatrice d'un segment, alors il est à égale distance des extrémités de ce segment.</p><p><b>(2)</b> Si un point est à égale distance des extrémités d'un segment, alors il appartient à la médiatrice de ce segment.</p></div>
  <p><b>Exemple :</b> ici, (m) est la médiatrice de [AB] et P est sur (m). Donc PA = PB.</p>
  <div class="retenir" data-l="Méthode"><p><b>Construction à l'équerre</b> (on utilise la définition) :</p><ul><li>je place le milieu I de [LT] ;</li><li>je trace la perpendiculaire à [LT] passant par I.</li></ul>
  <p><b>Construction au compas</b> (on utilise la propriété 2) :</p><ul><li>je prends une ouverture plus grande que la moitié de LT ;</li><li>avec cette même ouverture, je trace deux arcs centrés en L, puis deux arcs centrés en T ;</li><li>je relie les deux points d'intersection des arcs.</li></ul></div>
  <h4>Exemple de démonstration</h4>
  <div class="figs">${co("demo","Triangle ABC isocèle en A, I milieu de [BC]",220)}</div>
  <p>ABC est isocèle en A et I est le milieu de [BC]. Montrons que (AI) est la médiatrice de [BC].</p>
  <ul><li>AB = AC, donc A est à égale distance de B et de C : A est sur la médiatrice de [BC] (propriété 2).</li><li>I est le milieu de [BC], donc I est aussi sur cette médiatrice.</li><li>La médiatrice passe par A et par I : c'est la droite (AI).</li></ul>`},
{k:"2", t:"Le cercle circonscrit à un triangle", h:`
  <div class="retenir" data-l="Définition"><p>Le <b>cercle circonscrit</b> à un triangle est le cercle qui passe par les trois sommets du triangle.</p></div>
  <div class="retenir" data-l="Propriété"><p>Son centre est le point de concours des trois médiatrices des côtés du triangle. Deux médiatrices suffisent pour le placer.</p></div>
  ${co("cc","Cercle circonscrit au triangle ABC, de centre O",300)}
  <p>Ici, O est le point où se coupent les médiatrices des côtés de ABC. Donc OA = OB = OC.</p><p>Le cercle de centre O qui passe par A passe aussi par B et par C.</p>
  <div class="figs">${fig("Trois angles aigus : O est <b>à l'intérieur</b> du triangle.",co("cc1","Centre à l'intérieur du triangle",170))}${fig("Triangle rectangle : O est le <b>milieu de l'hypoténuse</b>.",co("cc2","Centre au milieu de l'hypoténuse",170))}${fig("Un angle obtus : O est <b>à l'extérieur</b> du triangle.",co("cc3","Centre à l'extérieur du triangle",170))}</div>
  <div class="retenir" data-l="Propriétés"><p>Si un triangle est rectangle, alors son cercle circonscrit a pour diamètre l'hypoténuse.</p><p>Si un côté d'un triangle est un diamètre de son cercle circonscrit, alors ce triangle est rectangle.</p></div>
  ${co("demi","C est sur le demi-cercle de diamètre [AB] et de centre O",280)}
  <p><b>Exemple :</b> C est un point du demi-cercle de diamètre [AB] et de centre O. ABC est inscrit dans le demi-cercle et [AB] est un diamètre. Donc ABC est rectangle en C.</p>
  <p><b>Exemple :</b> DEF est rectangle en D avec EF = 9 cm. Le centre de son cercle circonscrit est le milieu M de [EF], et DM = 9 ÷ 2 = 4,5 cm.</p>
  <p><b>À toi de jouer :</b> ABC est rectangle en A et BC = 7 cm. Quel est le rayon de son cercle circonscrit ? Justifie.</p>
  <details><summary>Voir la correction</summary><div class="corr"><p>ABC est rectangle en A, donc son cercle circonscrit a pour diamètre l'hypoténuse [BC].</p><p>Son rayon est donc 7 ÷ 2 = 3,5 cm.</p></div></details>`},
{k:"3", t:"Les hauteurs d'un triangle", h:`
  <div class="retenir" data-l="Définition"><p>Une <b>hauteur</b> d'un triangle est la droite qui passe par un sommet et qui est perpendiculaire au côté opposé à ce sommet.</p></div>
  <div class="figs">${fig("(h) est la hauteur issue de A. Son pied est H : AH est la distance du point A à la droite (BC).",co("h1","Hauteur (h) issue de A",250))}${fig("(h') est la hauteur issue de C : son pied H est à l'extérieur de [AB], on prolonge le côté en pointillés.",co("h2","Hauteur (h') issue de C",250))}</div>
  ${co("ortho","Les trois hauteurs du triangle ABC se coupent en H",280)}
  <div class="retenir" data-l="Propriété"><p>Les trois hauteurs d'un triangle se coupent en un même point H, appelé <b>orthocentre</b> du triangle. Deux hauteurs suffisent pour le trouver.</p><ul><li>Si le triangle est rectangle, l'orthocentre est le sommet de l'angle droit.</li><li>Si un angle est obtus, l'orthocentre est à l'extérieur du triangle.</li></ul></div>
  <div class="retenir" data-l="Méthode"><p><b>Construire la hauteur issue d'un sommet :</b></p><p><b>1)</b> je place un côté de l'angle droit de l'équerre sur le côté opposé au sommet (je le prolonge si besoin) ;</p><p><b>2)</b> je fais glisser l'équerre jusqu'à ce que l'autre côté de l'angle droit passe par le sommet ;</p><p><b>3)</b> je trace la droite et je code l'angle droit au pied H.</p></div>`},
{k:"4", t:"Les médianes d'un triangle", h:`
  <div class="retenir" data-l="Définition"><p>Une <b>médiane</b> d'un triangle est la droite qui passe par un sommet et par le milieu du côté opposé à ce sommet.</p></div>
  ${co("mediane","Médiane (AI) issue de A dans le triangle ABC",280)}
  <p>Ici, I est le milieu de [BC] : (AI) est la médiane issue de A.</p>
  <div class="retenir" data-l="Propriété"><p>Un triangle a trois médianes. Elles se coupent en un même point : le <b>centre de gravité</b> du triangle.</p></div>
  <div class="retenir" data-l="Propriété"><p>Une médiane partage un triangle en deux triangles de même aire.</p></div>
  <p>En effet, BI = IC et les deux triangles ABI et AIC ont la même hauteur issue de A.</p>`},
{k:"5", t:"L'aire d'un triangle", h:`
  <div class="retenir" data-l="Propriété"><p>L'aire d'un triangle est égale au produit d'un côté (la <b>base</b>) par la <b>hauteur</b> correspondante, divisé par 2 :</p><p class="calc">Aire = base × hauteur ÷ 2</p></div>
  <p>Un triangle est la moitié d'un parallélogramme : la diagonale [AC] coupe le parallélogramme ABCD en deux triangles de même aire.</p>
  <div class="attention"><b>ATTENTION :</b> la hauteur doit être perpendiculaire à la base choisie. Elle peut être à l'extérieur du triangle.</div>
  <div class="figs">${fig("Aire = 6 × 4 ÷ 2 = 12 cm²",co("a1","Triangle de base 6 cm et de hauteur 4 cm",230))}${fig("Les côtés de l'angle droit sont base et hauteur : Aire = 5 × 3 ÷ 2 = 7,5 cm²",co("a2","Triangle rectangle de côtés 5 cm et 3 cm",230))}${fig("La hauteur issue de A est à l'extérieur : Aire = 4 × 3,5 ÷ 2 = 7 cm²",co("a3","Triangle avec la hauteur à l'extérieur",230))}</div>
  <p><b>À toi de jouer :</b> un triangle a pour base 7 cm et pour hauteur correspondante 4 cm. Calcule son aire.</p>
  <details><summary>Voir la correction</summary><div class="corr"><p class="calc">Aire = 7 × 4 ÷ 2 = 28 ÷ 2 = 14 cm²</p></div></details>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Rappels de 6e : les triangles particuliers", e:[
  {n:"Exercice 1", t:"Nature d'un triangle", w:"Sur ta feuille", h:`<p>Donne la nature de chaque triangle d'après le codage de la figure.</p>
   <div class="figs">${fig("① ……………",ex("e1a","Triangle UVW",150))}${fig("② ……………",ex("e1b","Triangle GHI",150))}${fig("③ ……………",ex("e1c","Triangle JKL",150))}${fig("④ ……………",ex("e1d","Triangle XYZ",150))}</div>`,
   c:`<p>① UVW est <b>isocèle en W</b> (WU = WV).</p><p>② GHI est <b>rectangle en H</b>.</p><p>③ JKL est <b>équilatéral</b> (trois côtés de même longueur).</p><p>④ XYZ est <b>quelconque</b> (aucun codage).</p>`},
  {n:"Exercice 2", t:"Constructions de triangles", w:"Sur ta feuille", h:`<p>Construis chaque triangle (règle graduée, équerre et compas).</p>
   <p><b>a)</b> ABC est un triangle isocèle en A tel que AB = AC = 5 cm et BC = 6 cm.</p><p><b>b)</b> DEF est un triangle équilatéral de côté 4,5 cm.</p><p><b>c)</b> MNP est un triangle rectangle en N tel que NM = 3 cm et NP = 4 cm.</p><p><b>d)</b> Mesure l'hypoténuse : MP = ……… cm.</p>`,
   c:`<div class="figs">${fig("a)",cr("e2a","Triangle ABC isocèle en A",190))}${fig("b)",cr("e2b","Triangle DEF équilatéral",160))}${fig("c)",cr("e2c","Triangle MNP rectangle en N",170))}</div>
   <p><b>a)</b> On trace [BC] = 6 cm, puis deux arcs de rayon 5 cm centrés en B et en C : ils se coupent en A.</p><p><b>b)</b> Trois côtés de 4,5 cm : on trace [DE], puis des arcs de rayon 4,5 cm depuis D et depuis E.</p><p><b>c)</b> L'angle droit ${ang("MNP")} se trace à l'équerre.</p><p><b>d)</b> MP = <b>5 cm</b>.</p>`}
 ]},
{t:"La médiatrice d'un segment", e:[
  {n:"Exercice 3", t:"Construire une médiatrice", w:"Sur ta feuille", h:`<p>Construis les médiatrices demandées en laissant apparents tes traits de construction.</p>
   <p><b>a)</b> À l'équerre et à la règle graduée, trace la médiatrice (m) du segment [EF].</p><p><b>b)</b> Au compas et à la règle (sans équerre), trace la médiatrice (n) du segment [MN].</p><div class="figs">${fig("a)",ex("e3a","Segment [EF]",250))}${fig("b)",ex("e3b","Segment [MN]",250))}</div>`,
   c:`<div class="figs">${fig("a)",cr("e3a","Médiatrice de [EF] à l'équerre",250))}${fig("b)",cr("e3b","Médiatrice de [MN] au compas",250))}</div>
   <p><b>a)</b> On place le milieu I de [EF], puis on trace la perpendiculaire à [EF] passant par I (équerre).</p><p><b>b)</b> Avec une ouverture plus grande que la moitié de MN, on trace deux arcs centrés en M et deux arcs de même rayon centrés en N. Puis on relie leurs points d'intersection.</p>`},
  {n:"Exercice 4", t:"Utiliser les propriétés de la médiatrice", w:"Sur ta feuille", h:`<p>La droite (d) est la médiatrice du segment [EF]. Réponds en justifiant avec une propriété du cours.</p>
   <p><b>a)</b> M est un point de la droite (d) et ME = 5,4 cm. Que vaut MF ?</p><p><b>b)</b> N est un point tel que NE = NF. Où se trouve le point N ?</p><p><b>c)</b> P est un point tel que PE = 3 cm et PF = 4 cm. Le point P appartient-il à la droite (d) ?</p>`,
   c:`<p><b>a)</b> M appartient à la médiatrice (d) de [EF], donc il est à égale distance de E et de F (propriété 1). <b>MF = ME = 5,4 cm.</b></p>
   <p><b>b)</b> NE = NF : N est à égale distance des extrémités de [EF], donc il appartient à la médiatrice de [EF] (propriété 2). <b>N est sur (d).</b></p>
   <p><b>c)</b> Si P appartenait à (d), on aurait PE = PF (propriété 1). Or PE = 3 cm et PF = 4 cm. Donc <b>P n'appartient pas à (d)</b>.</p>`},
  {n:"Exercice 5", t:"Un point à égale distance de deux points", w:"Sur ta feuille", h:`<p>Place sur la droite (d) le point M qui est à égale distance des points A et B. Laisse apparents tes traits de construction.</p>
   ${ex("e5","Points A et B et droite (d)",320)}<p>Explique ta méthode.</p><p>Mesure MA et MB : MA = ……… cm et MB = ……… cm.</p>`,
   c:`${cr("e5","Le point M, intersection de (d) et de la médiatrice de [AB]",320)}
   <p>M est sur (d) et doit vérifier MA = MB.</p><p>D'après la propriété 2, M est aussi sur la médiatrice de [AB].</p><p>M est donc le point d'intersection de (d) et de la médiatrice de [AB].</p><p>On mesure <b>MA = MB ≈ 3,3 cm</b> (sur la fiche imprimée).</p>`},
  {n:"Exercice 6", t:"Une démonstration avec le losange", w:"Sur ta feuille", h:`<p>ABCD est un losange. Démontre que la droite (BD) est la médiatrice du segment [AC].</p>${ex("e6","Losange ABCD",260)}<p>Rédige ta démonstration.</p>`,
   c:`<p>ABCD est un losange, donc ses quatre côtés ont la même longueur.</p>
   <ul><li>BA = BC : B est à égale distance de A et de C, donc B appartient à la médiatrice de [AC] (propriété 2).</li><li>DA = DC : D est à égale distance de A et de C, donc D appartient à la médiatrice de [AC] (propriété 2).</li><li>B et D sont deux points distincts de la médiatrice de [AC] : <b>la droite (BD) est la médiatrice de [AC]</b>.</li></ul>`}
 ]},
{t:"Le cercle circonscrit à un triangle", e:[
  {n:"Exercice 7", t:"Construire un cercle circonscrit", w:"Sur ta feuille", h:`<p>Trace le cercle circonscrit à chaque triangle. Laisse apparents tes traits de construction, puis réponds.</p>
   <p><b>Cas n°2 :</b> DEF est rectangle en E (ED = 3 cm et EF = 4 cm).</p><div class="figs">${fig("Cas n°1 : le triangle ABC",ex("e7a","Cas n°1 : triangle ABC",220))}${fig("Cas n°2 : le triangle DEF",ex("e7b","Cas n°2 : triangle DEF rectangle en E",220))}${fig("Cas n°3 : le triangle ABC",ex("e7c","Cas n°3 : triangle ABC",220))}</div>
   <p>Où se trouve le centre O ? Complète avec « à l'intérieur », « à l'extérieur » ou « sur un côté » du triangle.</p><p>Cas n°1 : ……………… &nbsp; Cas n°2 : ……………… &nbsp; Cas n°3 : ………………</p><p>Dans le cas n°2, le rayon du cercle mesure ……… cm.</p>`,
   c:`<div class="figs">${fig("Cas n°1",cr("e7a","Cas n°1 corrigé",220))}${fig("Cas n°2",cr("e7b","Cas n°2 corrigé",220))}${fig("Cas n°3",cr("e7c","Cas n°3 corrigé",220))}</div>
   <p><b>Cas n°1 :</b> O est <b>à l'intérieur</b> du triangle (les trois angles sont aigus).</p>
   <p><b>Cas n°2 :</b> O est <b>sur un côté</b> : c'est le milieu de l'hypoténuse [DF]. DF = 5 cm, donc le rayon est <b>2,5 cm</b>.</p>
   <p><b>Cas n°3 :</b> O est <b>à l'extérieur</b> du triangle (l'angle ${ang("ACB")} est obtus).</p>`},
  {n:"Exercice 8", t:"Vrai ou faux ?", w:"Sur ta feuille", h:`<p>Entoure VRAI ou FAUX. Si l'affirmation est fausse, corrige-la.</p>
   <p><b>a)</b> Le centre du cercle circonscrit à un triangle est à égale distance des trois sommets du triangle.</p><p><b>b)</b> Le centre du cercle circonscrit à un triangle est toujours à l'intérieur du triangle.</p><p><b>c)</b> Pour trouver le centre du cercle circonscrit, il faut obligatoirement tracer les trois médiatrices.</p><p><b>d)</b> Le centre du cercle circonscrit à un triangle rectangle est le milieu de l'hypoténuse.</p><p><b>e)</b> Si un côté d'un triangle est un diamètre de son cercle circonscrit, alors ce triangle est rectangle.</p><p><b>f)</b> Si O est le point d'intersection des médiatrices de [AB] et de [AC], alors OB = OC.</p>`,
   c:`<p><b>a) VRAI.</b> Le centre est le point de concours des médiatrices : OA = OB = OC.</p>
   <p><b>b) FAUX.</b> Il est à l'intérieur si les trois angles sont aigus, sur l'hypoténuse pour un triangle rectangle et à l'extérieur pour un triangle qui a un angle obtus.</p>
   <p><b>c) FAUX.</b> Deux médiatrices suffisent : la troisième passe par leur point d'intersection.</p>
   <p><b>d) VRAI.</b> Propriété du cours : le cercle circonscrit a pour diamètre l'hypoténuse.</p>
   <p><b>e) VRAI.</b> Propriété du cours (réciproque).</p>
   <p><b>f) VRAI.</b> OA = OB (O est sur la médiatrice de [AB]) et OA = OC (O est sur la médiatrice de [AC]), donc OB = OC.</p>`},
  {n:"Exercice 9", t:"Triangle rectangle et cercle circonscrit", w:"Sur ta feuille", h:`<p>Pour chaque question, justifie avec une propriété du cours.</p>
   <p><b>a)</b> ABC est un triangle rectangle en A et BC = 10 cm. Quel est le rayon de son cercle circonscrit ?</p><p><b>b)</b> MNP est un triangle rectangle en M. Son cercle circonscrit a pour rayon 3,5 cm. Calcule NP.</p><p><b>c)</b> RST est un triangle rectangle en S et I est le milieu de [RT]. On sait que IS = 4,2 cm. Calcule RT.</p>`,
   c:`<p><b>a)</b> ABC est rectangle en A, donc son cercle circonscrit a pour diamètre l'hypoténuse [BC]. Son rayon est 10 ÷ 2 = <b>5 cm</b>.</p>
   <p><b>b)</b> MNP est rectangle en M : l'hypoténuse [NP] est un diamètre du cercle circonscrit. NP = 2 × 3,5 = <b>7 cm</b>.</p>
   <p><b>c)</b> RST est rectangle en S : le milieu I de l'hypoténuse [RT] est le centre de son cercle circonscrit. IS est un rayon, donc IR = IT = IS = 4,2 cm et RT = 2 × 4,2 = <b>8,4 cm</b>.</p>`},
  {n:"Exercice 10", t:"Démonstrations", w:"Sur ta feuille", h:`<div class="figs">${ex("e10a","Cercle de centre O, diamètre [RS] et point T",200)}</div><p><b>a)</b> [RS] est un diamètre du cercle de centre O et T est un point de ce cercle. Quelle est la nature du triangle RST ? Justifie.</p>
   <div class="figs">${ex("e10b","Triangle ABC rectangle en A, I milieu de [BC]",220)}</div><p><b>b)</b> ABC est un triangle rectangle en A et I est le milieu de [BC]. Démontre que IA = IB = IC.</p><p><b>c)</b> Calcule IA lorsque BC = 8 cm.</p>`,
   c:`<p><b>a)</b> Le triangle RST est inscrit dans le cercle de centre O (ses sommets sont sur le cercle) et son côté [RS] est un diamètre de ce cercle. Donc <b>RST est rectangle en T</b> (l'hypoténuse est [RS]).</p>
   <p><b>b)</b> ABC est rectangle en A, donc son cercle circonscrit a pour diamètre l'hypoténuse [BC] : son centre est le milieu I de [BC]. A, B et C sont sur ce cercle de centre I, donc <b>IA = IB = IC</b> (ce sont des rayons).</p>
   <p><b>c)</b> BC = 8 cm, donc IA = IB = IC = 8 ÷ 2 = <b>4 cm</b>.</p>`},
  {n:"Exercice 11", t:"Le triangle des Bermudes", w:"Sur ta feuille", h:`<p>Le « triangle des Bermudes » est une zone de l'océan Atlantique délimitée par Miami, les Bermudes et Porto Rico.</p><p>Une station de secours doit être installée à égale distance de ces trois lieux.</p><p>Sur le plan simplifié ci-dessous, 1 cm représente 200 km.</p>
   ${ex("e11","Plan : Miami, Bermudes et Porto Rico",360)}
   <p><b>1)</b> Construis sur le plan le point S où installer la station.</p><p><b>2)</b> Quelle propriété as-tu utilisée ?</p><p><b>3)</b> Le point S est-il à l'intérieur ou à l'extérieur du triangle ?</p><p><b>4)</b> Mesure SM sur le plan (M = Miami) : SM = ……… cm. Calcule la distance réelle entre la station et Miami.</p>`,
   c:`${cr("e11","Le point S, centre du cercle circonscrit",360)}
   <p><b>1)</b> S est le point de concours des médiatrices des côtés du triangle Miami – Bermudes – Porto Rico (deux médiatrices suffisent).</p>
   <p><b>2)</b> Le centre du cercle circonscrit à un triangle est le point de concours des médiatrices de ses côtés : il est à égale distance des trois sommets.</p>
   <p><b>3)</b> Les trois angles du triangle sont aigus, donc S est <b>à l'intérieur</b> du triangle.</p>
   <p><b>4)</b> Sur le plan de la fiche imprimée, SM = 4 cm. Distance réelle : 4 × 200 = <b>800 km</b> (la même pour les trois lieux).</p>`}
 ]},
{t:"Les hauteurs d'un triangle", e:[
  {n:"Exercice 12", t:"Hauteur, médiane ou médiatrice ?", w:"Sur ta feuille", h:`<p>Dans chaque figure, le trait épais est-il une hauteur, une médiane, une médiatrice ou aucune des trois ? Justifie (tu peux utiliser tes instruments).</p>
   <div class="figs">${fig("Figure ①",ex("e12a","Figure 1",210))}${fig("Figure ②",ex("e12b","Figure 2",210))}${fig("Figure ③",ex("e12c","Figure 3",210))}${fig("Figure ④",ex("e12d","Figure 4",210))}</div>`,
   c:`<p><b>①</b> <b>Hauteur issue de A</b> : (AH) passe par A et est perpendiculaire à (BC) (angle droit codé en H).</p>
   <p><b>②</b> <b>Médiane issue de A</b> : I est le milieu de [BC] (codage BI = IC) et (AI) passe par le sommet A.</p>
   <p><b>③</b> <b>Médiatrice de [BC]</b> : la droite est perpendiculaire à [BC] et passe par son milieu I (codages), mais elle ne passe pas par A.</p>
   <p><b>④</b> <b>Aucune des trois</b> : K n'est pas le milieu de [BC] (K est très près de C) et (AK) n'est pas perpendiculaire à (BC).</p>`},
  {n:"Exercice 13", t:"Construire des hauteurs", w:"Sur ta feuille", h:`<p>Dans chaque triangle, trace les trois hauteurs (pense à prolonger les côtés si besoin) et nomme H leur point commun.</p>
   <div class="figs">${fig("Cas n°1",ex("e13a","Cas n°1 : triangle ABC",230))}${fig("Cas n°2",ex("e13b","Cas n°2 : triangle ABC",230))}</div><p><b>Cas n°1 :</b> H est à l'………… du triangle.</p><p><b>Cas n°2 :</b> H est à l'………… du triangle.</p>`,
   c:`<div class="figs">${fig("Cas n°1",cr("e13a","Cas n°1 : les trois hauteurs",230))}${fig("Cas n°2",cr("e13b","Cas n°2 : les trois hauteurs",230))}</div>
   <p><b>Cas n°1 :</b> les trois angles sont aigus : H est <b>à l'intérieur</b> du triangle.</p>
   <p><b>Cas n°2 :</b> l'angle ${ang("BAC")} est obtus : H est <b>à l'extérieur</b> du triangle (il faut prolonger les côtés [AB] et [AC]).</p>`},
  {n:"Exercice 14", t:"Vrai ou faux ?", w:"Sur ta feuille", h:`<p>Entoure VRAI ou FAUX. Si l'affirmation est fausse, corrige-la.</p>
   <p><b>a)</b> Une hauteur d'un triangle est toujours à l'intérieur du triangle.</p><p><b>b)</b> Les trois hauteurs d'un triangle se coupent en un même point appelé l'orthocentre.</p><p><b>c)</b> L'orthocentre d'un triangle rectangle est le sommet de l'angle droit.</p><p><b>d)</b> La hauteur issue du sommet A d'un triangle ABC est la droite qui passe par A et par le milieu de [BC].</p><p><b>e)</b> Si le triangle ABC est rectangle en A, alors la droite (AB) est la hauteur issue de B.</p><p><b>f)</b> Si H est le pied de la hauteur issue de A dans le triangle ABC, alors AH est la distance du point A à la droite (BC).</p>`,
   c:`<p><b>a) FAUX.</b> Dans un triangle qui a un angle obtus, deux hauteurs sont à l'extérieur du triangle.</p>
   <p><b>b) VRAI.</b> Propriété du cours.</p>
   <p><b>c) VRAI.</b> Les deux côtés de l'angle droit sont deux hauteurs : elles se coupent au sommet de l'angle droit.</p>
   <p><b>d) FAUX.</b> C'est la médiane issue de A. La hauteur est perpendiculaire à (BC).</p>
   <p><b>e) VRAI.</b> (AB) passe par B et est perpendiculaire à (AC), puisque l'angle ${ang("BAC")} est droit.</p>
   <p><b>f) VRAI.</b> AH est la longueur de la hauteur issue de A.</p>`}
 ]},
{t:"Les médianes d'un triangle", e:[
  {n:"Exercice 15", t:"Construire des médianes", w:"Sur ta feuille", h:`<p>Dans le triangle ABC, place les milieux des trois côtés (avec ta règle graduée), puis trace les trois médianes.</p>
   ${ex("e15","Triangle ABC",260)}<p>Que constates-tu ?</p><p>Le point commun s'appelle le <b>centre de gravité</b>. Nomme-le G sur la figure.</p>`,
   c:`${cr("e15","Les trois médianes du triangle ABC et le point G",260)}<p>Les trois médianes se coupent en un même point G : <b>le centre de gravité</b> du triangle.</p>`},
  {n:"Exercice 16", t:"Médiane et aire", w:"Sur ton cahier", h:`<p>ABC est un triangle tel que BC = 10 cm. La hauteur issue de A mesure 6 cm. Le point I est le milieu de [BC].</p>
   <p><b>a)</b> Calcule l'aire du triangle ABC.</p><p><b>b)</b> Calcule la longueur BI, puis l'aire du triangle ABI.</p><p><b>c)</b> Calcule l'aire du triangle AIC. Que constates-tu ? Quelle propriété du cours retrouves-tu ?</p><p><b>d)</b> Le triangle MNP a pour aire 18,4 cm². Q est le milieu de [NP]. Quelle est l'aire du triangle MNQ ? Justifie.</p>`,
   c:`<p><b>a)</b> Aire(ABC) = 10 × 6 ÷ 2 = <b>30 cm²</b>.</p>
   <p><b>b)</b> I est le milieu de [BC] : BI = 10 ÷ 2 = <b>5 cm</b>. La hauteur issue de A est aussi celle de ABI : Aire(ABI) = 5 × 6 ÷ 2 = <b>15 cm²</b>.</p>
   <p><b>c)</b> Aire(AIC) = IC × 6 ÷ 2 = 5 × 6 ÷ 2 = <b>15 cm²</b>. Les triangles ABI et AIC ont la même aire (15 + 15 = 30 cm²) : une médiane partage un triangle en deux triangles de même aire.</p>
   <p><b>d)</b> (MQ) est une médiane de MNP, donc Aire(MNQ) = 18,4 ÷ 2 = <b>9,2 cm²</b>.</p>`}
 ]},
{t:"L'aire d'un triangle", e:[
  {n:"Exercice 17", t:"Calculer des aires", w:"Sur ta feuille", h:`<p>Calcule l'aire de chaque triangle (figures non à l'échelle). Écris le calcul.</p><p><b>Attention :</b> une donnée peut être inutile !</p>
   <div class="figs">${fig("Triangle ① : Aire = ……………",ex("e17a","Triangle 1",270))}${fig("Triangle ② : Aire = ……………",ex("e17b","Triangle 2",270))}${fig("Triangle ③ : Aire = ……………",ex("e17c","Triangle 3",270))}${fig("Triangle ④ : Aire = ……………",ex("e17d","Triangle 4",270))}</div>`,
   c:`<p><b>①</b> 8 × 5 ÷ 2 = <b>20 cm²</b></p><p><b>②</b> Les côtés de l'angle droit sont base et hauteur : 9 × 6 ÷ 2 = <b>27 cm²</b></p><p><b>③</b> La hauteur est à l'extérieur : 7 × 4 ÷ 2 = <b>14 cm²</b></p><p><b>④</b> 8 × 3 ÷ 2 = <b>12 cm²</b> (la longueur 5 cm ne sert pas).</p>`},
  {n:"Exercice 18", t:"Retrouver une longueur", w:"Sur ta feuille", h:`<p><b>Rappel :</b> Aire = base × hauteur ÷ 2, donc base × hauteur = Aire × 2.</p><p>Calcule la longueur demandée.</p>
   <p><b>a)</b> Un triangle a pour aire 24 cm² et pour base 8 cm. Calcule la hauteur correspondante.</p><p><b>b)</b> Un triangle a pour aire 18 cm² et pour hauteur 4 cm. Calcule la base correspondante.</p><p><b>c)</b> Un triangle a pour aire 7,5 cm² et pour base 5 cm. Calcule la hauteur correspondante.</p>`,
   c:`<p><b>a)</b> hauteur = 24 × 2 ÷ 8 = 48 ÷ 8 = <b>6 cm</b></p><p><b>b)</b> base = 18 × 2 ÷ 4 = 36 ÷ 4 = <b>9 cm</b></p><p><b>c)</b> hauteur = 7,5 × 2 ÷ 5 = 15 ÷ 5 = <b>3 cm</b></p>`},
  {n:"Exercice 19", t:"Parallélogramme et triangle", w:"Sur ta feuille", h:`<p>ABCD est un parallélogramme : AB // DC et AD // BC.</p><p>On donne AB = 9 cm et la hauteur issue de D mesure 4 cm.</p>${ex("e19","Parallélogramme ABCD",300)}
   <p><b>a)</b> Calcule l'aire du parallélogramme ABCD.</p><p><b>b)</b> Trace la diagonale [AC]. Quelle est l'aire du triangle ABC ? Explique.</p>`,
   c:`<p><b>a)</b> Aire(ABCD) = base × hauteur = 9 × 4 = <b>36 cm²</b>.</p><p><b>b)</b> La diagonale [AC] partage le parallélogramme en deux triangles de même aire : Aire(ABC) = 36 ÷ 2 = <b>18 cm²</b>.</p><p>Vérification : 9 × 4 ÷ 2 = 18.</p>`}
 ]},
{t:"Problème de synthèse", e:[
  {n:"Exercice 20", t:"Un triangle qui sait tout faire", w:"Sur ta feuille et sur ton cahier", h:`<p>Construis le triangle EFG tel que EF = 6 cm, FG = 8 cm et EG = 10 cm (règle et compas).</p><p>Puis réponds aux questions 1 à 4 sur ta figure et sur ton cahier.</p>
   <p><b>1)</b> Quel côté est l'hypoténuse si le triangle EFG est rectangle ? Vérifie avec ton équerre que EFG est rectangle en F.</p>
   <p><b>2)</b> Trace le cercle circonscrit à EFG sans tracer de médiatrice. Explique comment tu fais et donne son rayon.</p>
   <p><b>3)</b> Trace la hauteur issue de F et nomme H son pied. Calcule l'aire de EFG avec EF et FG, puis déduis-en la longueur FH. Vérifie en mesurant.</p>
   <p><b>4)</b> Trace la médiane issue de F. Que remarques-tu ? Quelle est l'aire du triangle EFI, I étant le milieu de [EG] ?</p>`,
   c:`${cr("e20","Triangle EFG, son cercle circonscrit, la hauteur [FH] et la médiane [FI]",300)}
   <p><b>1)</b> L'hypoténuse est le côté opposé à l'angle droit : <b>[EG]</b> (le plus long côté). À l'équerre, on vérifie que l'angle ${ang("EFG")} est droit : EFG est rectangle en F.</p>
   <p><b>2)</b> EFG est rectangle en F, donc son cercle circonscrit a pour diamètre l'hypoténuse [EG] : son centre est le milieu I de [EG]. Rayon : 10 ÷ 2 = <b>5 cm</b>.</p>
   <p><b>3)</b> Aire(EFG) = EF × FG ÷ 2 = 6 × 8 ÷ 2 = <b>24 cm²</b>. Avec la base [EG] : 10 × FH ÷ 2 = 24, donc FH = 24 × 2 ÷ 10 = <b>4,8 cm</b>.</p>
   <p><b>4)</b> I est le centre du cercle et F est sur le cercle : FI = 5 cm, c'est le rayon (la médiane issue de F mesure la moitié de l'hypoténuse). Aire(EFI) = 24 ÷ 2 = <b>12 cm²</b> (une médiane partage le triangle en deux triangles de même aire).</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Les triangles particuliers", schema:S_NAT, q:{
 1:[ {g:()=>{ const t=pick(["iso","equi","rect","quel"]), nom=pick(NOMS), f=natureFig(t,nom); return {q:"Quelle est la nature de ce triangle ?", fig:f.svg, c:["isocèle","équilatéral","rectangle","quelconque"], rep:NAT[t], ex:natEx(t,nom,f), sx:S_NAT}; }} ],
 2:[ {g:()=>{ const [a,b,c]=pick(NOMS).split(""); return {q:`Le triangle ${a}${b}${c} est rectangle en ${b}. Quelle est son hypoténuse ?`, c:[`[${a}${c}]`,`[${a}${b}]`,`[${b}${c}]`], rep:`[${a}${c}]`, ex:`L'hypoténuse est le côté opposé à l'angle droit ${ang(a+b+c)}.`, sx:S_NAT}; }},
     {g:()=>{ const [a,b,c]=pick(NOMS).split(""); return {q:`Le triangle ${a}${b}${c} est isocèle en ${a}. Quels côtés ont la même longueur ?`, c:[`${a}${b} et ${a}${c}`,`${a}${b} et ${b}${c}`,`${a}${c} et ${b}${c}`], rep:`${a}${b} et ${a}${c}`, ex:`Isocèle en ${a} : les deux côtés qui partent de ${a} ont la même longueur.`, sx:S_NAT}; }} ],
 3:[ {g:()=>{ const a=ri(8,14)/2, b=ri(Math.ceil(a),Math.floor(a*1.6))+pick([0,0.5]); const bb=b===a?b+1:b; return {q:`On construit ABC isocèle en A avec BC = ${F(bb)} cm et AB = AC = ${F(a)} cm. On trace d'abord [BC]. Quel rayon pour les arcs centrés en B et en C ?`, c:uniq(`${F(a)} cm`,[`${F(bb)} cm`,`${F(bb/2)} cm`]), rep:`${F(a)} cm`, ex:`A est à ${F(a)} cm de B et à ${F(a)} cm de C : on trace deux arcs de rayon ${F(a)} cm, ils se coupent en A.`, sx:S_NAT}; }},
     {g:()=>{ const [x,y,z]=pick([[3,4,5],[6,8,10],[4.5,6,7.5]]); return {q:`MNP est rectangle en N, NM = ${F(x)} cm et NP = ${F(y)} cm. On le construit, puis on mesure l'hypoténuse. On trouve MP = …`, c:uniq(`${F(z)} cm`,[`${F(x+y)} cm`,`${F(y)} cm`]), rep:`${F(z)} cm`, ex:`L'hypoténuse est le plus long côté : elle est plus longue que ${F(y)} cm mais plus courte que ${F(x)} + ${F(y)} = ${F(x+y)} cm. On mesure MP = ${F(z)} cm.`, sx:S_NAT}; }} ]
}},
{nom:"La médiatrice d'un segment", schema:S_MED, q:{
 1:[ {q:"La médiatrice d'un segment est la droite…", c:["perpendiculaire à ce segment et qui passe par son milieu","qui passe par un sommet et par le milieu du côté opposé","parallèle à ce segment"], rep:"perpendiculaire à ce segment et qui passe par son milieu", sx:S_MED},
     {g:()=>{ const v=ri(21,79)/10; return {q:`(d) est la médiatrice de [EF]. M est un point de (d) et ME = ${F(v)} cm. Combien vaut MF (en cm) ?`, rep:[F(v),F(v)+" cm"], ex:`M est sur la médiatrice de [EF], donc il est à égale distance de E et de F (propriété 1) : MF = ME = ${F(v)} cm.`, sx:S_MED}; }} ],
 2:[ {g:()=>{ const a=ri(20,60)/10, eq=Math.random()<0.5, b=eq?a:r3(a+pick([-1,1])*ri(3,15)/10); return {q:`P est un point tel que PE = ${F(a)} cm et PF = ${F(b)} cm. P appartient-il à la médiatrice de [EF] ?`, c:["Oui","Non"], rep:eq?"Oui":"Non", ex:eq?"PE = PF : P est à égale distance de E et de F, donc il est sur la médiatrice de [EF] (propriété 2).":"Si P était sur la médiatrice, on aurait PE = PF (propriété 1). Or PE ≠ PF.", sx:S_MED}; }} ],
 3:[ {q:"Pour construire la médiatrice d'un segment au compas, l'ouverture du compas doit être…", c:["plus grande que la moitié du segment","plus petite que la moitié du segment","égale au quart du segment"], rep:"plus grande que la moitié du segment", ex:"Sinon, les arcs ne se coupent pas.", sx:S_MED},
     {g:()=>{ const n=pick(["ABCD","EFGH","MNPQ","RSTU","IJKL"]), [a,b,c,d]=n.split(""); return {q:`${n} est un losange. La droite (${b}${d}) est la médiatrice de…`, c:[`[${a}${c}]`,`[${b}${d}]`,`[${a}${b}]`], rep:`[${a}${c}]`, ex:`${b}${a} = ${b}${c} et ${d}${a} = ${d}${c} : ${b} et ${d} sont à égale distance de ${a} et de ${c}, donc ils sont sur la médiatrice de [${a}${c}] (propriété 2).`, sx:S_MED}; }} ]
}},
{nom:"Le cercle circonscrit", schema:S_CC, q:{
 1:[ {q:"Le centre du cercle circonscrit à un triangle est le point de concours des…", c:["médiatrices","hauteurs","médianes"], rep:"médiatrices", ex:"Il est à égale distance des trois sommets : il est sur les trois médiatrices des côtés.", sx:S_CC},
     {g:()=>{ const H=ri(4,15)*pick([1,2]); return {q:`ABC est rectangle en A et BC = ${H} cm. Quel est le rayon de son cercle circonscrit (en cm) ?`, rep:[F(H/2),F(H/2)+" cm"], ex:`Le cercle circonscrit a pour diamètre l'hypoténuse [BC] : rayon = ${H} ÷ 2 = ${F(H/2)} cm.`, sx:S_CC}; }} ],
 2:[ {g:()=>{ const r=ri(15,60)/10; return {q:`MNP est rectangle en M. Son cercle circonscrit a pour rayon ${F(r)} cm. Calcule NP (en cm).`, rep:[F(2*r),F(2*r)+" cm"], ex:`L'hypoténuse [NP] est un diamètre : NP = 2 × ${F(r)} = ${F(2*r)} cm.`, sx:S_CC}; }},
     {g:()=>{ const t=pick([["trois angles aigus","à l'intérieur du triangle"],["un angle droit","au milieu de l'hypoténuse"],["un angle obtus","à l'extérieur du triangle"]]); return {q:`Un triangle a ${t[0]}. Où se trouve le centre de son cercle circonscrit ?`, c:["à l'intérieur du triangle","au milieu de l'hypoténuse","à l'extérieur du triangle"], rep:t[1], sx:S_CC}; }} ],
 3:[ {g:()=>{ const v=ri(21,59)/10; return {q:`RST est rectangle en S et I est le milieu de [RT]. On sait que IS = ${F(v)} cm. Calcule RT (en cm).`, rep:[F(2*v),F(2*v)+" cm"], ex:`I est le centre du cercle circonscrit et IS est un rayon : IR = IT = ${F(v)} cm, donc RT = 2 × ${F(v)} = ${F(2*v)} cm.`, sx:S_CC}; }},
     {q:"[RS] est un diamètre d'un cercle et T est un autre point de ce cercle. Le triangle RST est…", c:["rectangle en T","rectangle en R","équilatéral"], rep:"rectangle en T", ex:"Un côté du triangle est un diamètre de son cercle circonscrit : le triangle est rectangle, et l'angle droit est en face de ce diamètre, en T.", sx:S_CC} ]
}},
{nom:"Les hauteurs d'un triangle", schema:S_HAUT, q:{
 1:[ {g:()=>{ const t=pick(["hauteur","médiane","médiatrice","aucune"]); const R={hauteur:"une hauteur","médiane":"une médiane","médiatrice":"une médiatrice",aucune:"aucune des trois"}; return {q:"Le trait épais est…", fig:traitFig(t), c:["une hauteur","une médiane","une médiatrice","aucune des trois"], rep:R[t], ex:TRAIT_EX[t], sx:S_HAUT}; }},
     {q:"Une hauteur d'un triangle passe par un sommet et elle est … au côté opposé.", c:["perpendiculaire","parallèle","égale"], rep:"perpendiculaire", sx:S_HAUT} ],
 2:[ {g:()=>{ const s=pick([["Une hauteur d'un triangle est toujours à l'intérieur du triangle.","Faux","Dans un triangle qui a un angle obtus, deux hauteurs sont à l'extérieur."],["Les trois hauteurs d'un triangle se coupent en un même point appelé l'orthocentre.","Vrai","C'est la propriété du cours."],["La hauteur issue de A dans le triangle ABC passe par A et par le milieu de [BC].","Faux","Ça, c'est la médiane issue de A. La hauteur est perpendiculaire à (BC)."],[`ABC est rectangle en A. La droite (AB) est la hauteur issue de B.`,"Vrai",`(AB) passe par B et est perpendiculaire à (AC), car l'angle ${ang("BAC")} est droit.`],["H est le pied de la hauteur issue de A dans ABC. AH est la distance du point A à la droite (BC).","Vrai","AH est la longueur de la hauteur issue de A."]]); return {q:"Vrai ou faux : "+s[0], c:VF, rep:s[1], ex:s[2], sx:S_HAUT}; }} ],
 3:[ {g:()=>{ const [a,b,c]=pick(NOMS).split(""); return {q:`Le triangle ${a}${b}${c} est rectangle en ${b}. Où se trouve son orthocentre ?`, c:[`au point ${b}`,`au milieu de [${a}${c}]`,"à l'extérieur du triangle"], rep:`au point ${b}`, ex:`Les côtés [${b}${a}] et [${b}${c}] de l'angle droit sont deux hauteurs : elles se coupent en ${b}.`, sx:S_HAUT}; }},
     {q:`Dans le triangle ABC, l'angle ${ang("BAC")} est obtus. Son orthocentre est…`, c:["à l'extérieur du triangle","à l'intérieur du triangle","au point A"], rep:"à l'extérieur du triangle", ex:"Si un angle est obtus, l'orthocentre est à l'extérieur du triangle.", sx:S_HAUT} ]
}},
{nom:"Les médianes d'un triangle", schema:S_MEDI, q:{
 1:[ {q:"Une médiane d'un triangle passe par un sommet et par … du côté opposé.", c:["le milieu","une extrémité","le pied de la perpendiculaire"], rep:"le milieu", sx:S_MEDI},
     {g:()=>{ const [a,b,c]=pick(NOMS).split(""), m=["I","J","K","L","Q"].filter(x=>!(a+b+c).includes(x))[0]; return {q:`${m} est le milieu de [${b}${c}]. Dans le triangle ${a}${b}${c}, la droite (${a}${m}) est…`, c:[`la médiane issue de ${a}`,`la hauteur issue de ${a}`,`la médiatrice de [${b}${c}]`], rep:`la médiane issue de ${a}`, ex:`Elle passe par le sommet ${a} et par le milieu du côté opposé.`, sx:S_MEDI}; }} ],
 2:[ {g:()=>{ const A=ri(10,80)*pick([1,0.2,0.5]); return {q:`Le triangle ABC a pour aire ${F(A)} cm². I est le milieu de [BC]. Quelle est l'aire du triangle ABI (en cm²) ?`, rep:[F(A/2),F(A/2)+" cm²"], ex:`(AI) est une médiane : elle partage ABC en deux triangles de même aire. ${F(A)} ÷ 2 = ${F(A/2)} cm².`, sx:S_MEDI}; }} ],
 3:[ {g:()=>{ const b=ri(3,9)*2, h=ri(3,12); return {q:`ABC est un triangle tel que BC = ${b} cm ; la hauteur issue de A mesure ${h} cm. I est le milieu de [BC]. Quelle est l'aire du triangle ABI (en cm²) ?`, rep:[F(b/2*h/2),F(b/2*h/2)+" cm²"], ex:`BI = ${b} ÷ 2 = ${b/2} cm et Aire(ABI) = ${b/2} × ${h} ÷ 2 = ${F(b/2*h/2)} cm².`, sx:S_MEDI}; }},
     {q:"Le point de concours des trois médianes d'un triangle s'appelle…", c:["le centre de gravité","l'orthocentre","le centre du cercle circonscrit"], rep:"le centre de gravité", ex:"Hauteurs → orthocentre ; médiatrices → centre du cercle circonscrit ; médianes → centre de gravité.", sx:S_MEDI} ]
}},
{nom:"L'aire d'un triangle", schema:S_AIRE, q:{
 1:[ {g:()=>{ const b=ri(4,12), h=ri(2,9); return {q:"Quelle est l'aire de ce triangle (en cm²) ?", fig:aireFig("aigu",b,h), rep:[F(b*h/2),F(b*h/2)+" cm²"], ex:`Aire = ${b} × ${h} ÷ 2 = ${F(b*h/2)} cm².`, sx:S_AIRE}; }} ],
 2:[ {g:()=>{ const b=ri(3,10), h=ri(2,8); return {q:"Le triangle est rectangle en B. Quelle est son aire (en cm²) ?", fig:aireFig("rect",b,h), rep:[F(b*h/2),F(b*h/2)+" cm²"], ex:`Les côtés de l'angle droit sont base et hauteur : ${b} × ${h} ÷ 2 = ${F(b*h/2)} cm².`, sx:S_AIRE}; }},
     {g:()=>{ const b=ri(3,9), h=ri(2,7)+pick([0,0.5]); return {q:"La hauteur issue de A est à l'extérieur. Quelle est l'aire du triangle ABC (en cm²) ?", fig:aireFig("obtus",b,h,ri(12,22)/10), rep:[F(b*h/2),F(b*h/2)+" cm²"], ex:`Base BC = ${b} cm, hauteur ${F(h)} cm : ${b} × ${F(h)} ÷ 2 = ${F(b*h/2)} cm².`, sx:S_AIRE}; }} ],
 3:[ {g:()=>{ const b=ri(3,12), h=ri(2,10), A=b*h/2; return {q:`Un triangle a pour aire ${F(A)} cm² et pour base ${b} cm. Quelle est la hauteur correspondante (en cm) ?`, rep:[F(h),F(h)+" cm"], ex:`hauteur = ${F(A)} × 2 ÷ ${b} = ${F(2*A)} ÷ ${b} = ${F(h)} cm.`, sx:S_AIRE}; }},
     {g:()=>{ const [b,h,s]=pick(ISO3); return {q:"Quelle est l'aire de ce triangle (en cm²) ? Attention : une donnée est inutile.", fig:aireFig("iso",b,h,s), rep:[F(b*h/2),F(b*h/2)+" cm²"], ex:`${F(b)} × ${F(h)} ÷ 2 = ${F(b*h/2)} cm². La longueur ${F(s)} cm ne sert pas.`, sx:S_AIRE}; }} ]
}}
]
};
})();
