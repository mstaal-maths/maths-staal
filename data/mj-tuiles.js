/* Le puzzle des tuiles (3e : développer, factoriser, identités remarquables).
   Tuiles : x² (carré de côté x), x (rectangle x sur 1), 1 (carré de côté 1), et aux derniers niveaux −x et −1 (rouges).
   On les assemble en rectangle : ses dimensions donnent la forme factorisée, ses tuiles la forme développée.
   Positions et longueurs sont SYMBOLIQUES : [m, n] veut dire m·x + n. La longueur x n'est pas un nombre entier
   d'unités (affichage : x = 3,6 unités), et un rectangle n'est validé que s'il en est un pour plusieurs valeurs de x :
   on ne peut donc pas « tricher » en remplaçant un x par des 1. */
window.MJ_TUILES = (function(){
"use strict";
const KEY = "staal-mj-tuiles3", NB = 5;
let U = 28, X = 101;                     // à l'écran : 1 → 28 px, x → 101 px (environ 3,6 unités) ; plus petit au niveau 4
const PADX = 128, PADY = 58;              // place laissée en haut et à gauche du plan pour écrire les dimensions
const XV = [3.6, 4.7, 6.3, 8.9];         // valeurs de x utilisées pour vérifier qu'un rectangle en est un « pour tout x »
const LEVELS = [
  {nom:"Développer",            titre:"Remplis le rectangle : ses côtés sont donnés", mode:"dev"},
  {nom:"Factoriser",            titre:"Assemble toutes les tuiles en un rectangle", mode:"fac"},
  {nom:"Les carrés",            titre:"(x + a)² : un rectangle très spécial", mode:"mix"},
  {nom:"Avec 2x² ou 3x²",       titre:"Plusieurs tuiles x²", mode:"fac"},
  {nom:"Négatifs : développer", titre:"Développer avec des tuiles négatives", mode:"dev", neg:true},
  {nom:"Négatifs : factoriser", titre:"(x − a)² et (x − a)(x + a)", mode:"fac", neg:true}
];
const rnd = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const pick = t => t[Math.floor(Math.random()*t.length)];
const M = n => (n < 0 ? "−" : "") + Math.abs(n);
const reduceMotion = () => { try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } };

/* ---------- longueurs symboliques [m, n] = m·x + n ---------- */
const add = (a, b) => [a[0]+b[0], a[1]+b[1]];
const sub = (a, b) => [a[0]-b[0], a[1]-b[1]];
const eqv = (a, b) => a[0] === b[0] && a[1] === b[1];
const kv = a => a[0] + "," + a[1];
const num = (a, r) => a[0]*r + a[1];
const px = a => a[0]*X + a[1]*U;
/* tuiles : k = "x2" | "x" | "1", r = "v" (debout) ou "h" (couchée) pour les tuiles x, neg = tuile négative */
function dims(t){
  if(t.k === "x2") return {w:[1,0], h:[1,0]};
  if(t.k === "1") return {w:[0,1], h:[0,1]};
  return t.r === "h" ? {w:[1,0], h:[0,1]} : {w:[0,1], h:[1,0]};
}
const deg = k => k === "x2" ? 0 : k === "x" ? 1 : 2;      // indice dans un polynôme [x², x, 1]
function polyOf(tiles){ const p = [0,0,0]; tiles.forEach(t => { p[deg(t.k)] += t.neg ? -1 : 1; }); return p; }
function mulLin(a, b){ return [a[0]*b[0], a[0]*b[1] + a[1]*b[0], a[1]*b[1]]; }

/* ---------- écriture ---------- */
const XH = '<i>x</i>';
function term(c, v, first, h){
  if(!c) return "";
  const s = c < 0 ? (first ? "−" : " − ") : (first ? "" : " + "), a = Math.abs(c);
  const xx = h ? XH : "x";
  return s + (v === 2 ? (a === 1 ? "" : a) + xx + "²" : v === 1 ? (a === 1 ? "" : a) + xx : a);
}
function poly(p, h){ let t = ""; [[p[0],2],[p[1],1],[p[2],0]].forEach(([c, v]) => { t += term(c, v, !t, h); }); return t || "0"; }
/* écriture « non réduite » : x² + 3x − 3x − 9 (positifs puis négatifs, pour voir ce qui s'annule) */
function polyRaw(tiles, h){
  const c = {x2p:0,x2n:0,xp:0,xn:0,up:0,un:0};
  tiles.forEach(t => { c[(t.k === "1" ? "u" : t.k) + (t.neg ? "n" : "p")]++; });
  let s = "";
  [[c.x2p,2],[-c.x2n,2],[c.xp,1],[-c.xn,1],[c.up,0],[-c.un,0]].forEach(([n, v]) => { s += term(n, v, !s, h); });
  return s || "0";
}
function lin(a, h){ let t = term(a[0], 1, true, h); t += term(a[1], 0, !t, h); return t || "0"; }
/* produit de deux facteurs : (x + 2)(x + 3), (x + 3)², 2x(x + 3)… le facteur au plus grand coefficient de x d'abord */
function prod(A, B, h){
  if(A[0] < B[0] || (A[0] === B[0] && A[1] > B[1])){ const t = A; A = B; B = t; }
  const par = f => f[0] && f[1] ? "(" + lin(f, h) + ")" : lin(f, h);
  if(eqv(A, B)) return (A[0] && A[1] ? "(" + lin(A, h) + ")" : lin(A, h)) + "²";
  if(!A[1] && B[1]) return lin(A, h) + "(" + lin(B, h) + ")";
  if(!B[1] && A[1]) return lin(B, h) + "(" + lin(A, h) + ")";
  return par(A) + par(B);
}

/* ---------- le rectangle est-il juste ? ---------- */
/* renvoie {ok, why, W, H, cols, rows} ; signed : on tient compte des couleurs (règle des signes) */
function check(tiles, signed){
  if(!tiles.length) return {ok:false, why:"vide"};
  for(const r of XV){
    const R = tiles.map(t => { const d = dims(t), x = num(t.x, r), y = num(t.y, r); return [x, y, x + num(d.w, r), y + num(d.h, r)]; });
    let area = 0, x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for(let i = 0; i < R.length; i++){
      const a = R[i]; area += (a[2]-a[0])*(a[3]-a[1]);
      x0 = Math.min(x0, a[0]); y0 = Math.min(y0, a[1]); x1 = Math.max(x1, a[2]); y1 = Math.max(y1, a[3]);
      for(let j = 0; j < i; j++){ const b = R[j];
        if(Math.min(a[2], b[2]) - Math.max(a[0], b[0]) > 1e-9 && Math.min(a[3], b[3]) - Math.max(a[1], b[1]) > 1e-9) return {ok:false, why:"chevauche"}; }
    }
    if(Math.abs(area - (x1-x0)*(y1-y0)) > 1e-7) return {ok:false, why: r === XV[0] ? "trou" : "faux"};
  }
  /* bords du rectangle (symboliques), les mêmes pour toutes les valeurs de x */
  const ed = tiles.map(t => { const d = dims(t); return {l:t.x, t:t.y, r:add(t.x, d.w), b:add(t.y, d.h)}; });
  const ext = (f, cmp) => { let best = ed[0][f]; ed.forEach(e => { if(cmp(num(e[f], XV[0]), num(best, XV[0]))) best = e[f]; }); return best; };
  const L = ext("l", (a,b) => a < b), T = ext("t", (a,b) => a < b), Rr = ext("r", (a,b) => a > b), B = ext("b", (a,b) => a > b);
  for(const r of XV){ if(ed.some(e => num(e.l, r) < num(L, r) - 1e-9 || num(e.t, r) < num(T, r) - 1e-9 || num(e.r, r) > num(Rr, r) + 1e-9 || num(e.b, r) > num(B, r) + 1e-9)) return {ok:false, why:"faux"}; }
  /* quadrillage : lignes et colonnes ; chaque tuile doit occuper exactement une case */
  const lines = (f1, f2) => { const m = new Map(); ed.forEach(e => { m.set(kv(e[f1]), e[f1]); m.set(kv(e[f2]), e[f2]); }); return [...m.values()].sort((a, b) => num(a, XV[0]) - num(b, XV[0])); };
  const xs = lines("l", "r"), ys = lines("t", "b");
  const ix = new Map(xs.map((v, i) => [kv(v), i])), iy = new Map(ys.map((v, i) => [kv(v), i]));
  let grid = true;
  const cell = ed.map(e => { const c = ix.get(kv(e.l)), r = iy.get(kv(e.t)); if(ix.get(kv(e.r)) !== c+1 || iy.get(kv(e.b)) !== r+1) grid = false; return [r, c]; });
  const cols = xs.slice(1).map((v, i) => ({w:sub(v, xs[i]), s:1})), rows = ys.slice(1).map((v, i) => ({h:sub(v, ys[i]), s:1}));
  const p = polyOf(tiles);
  if(!signed){
    const W = sub(Rr, L), H = sub(B, T), q = mulLin(W, H);
    if(q[0] !== p[0] || q[1] !== p[1] || q[2] !== p[2]) return {ok:false, why:"faux"};
    return {ok:true, W, H, cols:grid ? cols : null, rows:grid ? rows : null, L, T};
  }
  if(!grid) return {ok:false, why:"grille"};
  /* signes des lignes et des colonnes : tuile (ligne i, colonne j) de signe sL[i] × sC[j] */
  const sR = rows.map(() => 0), sC = cols.map(() => 0);
  sR[0] = 1; let changed = true, guard = 0;
  while(changed && guard++ < 100){ changed = false;
    tiles.forEach((t, k) => { const [i, j] = cell[k], s = t.neg ? -1 : 1;
      if(sR[i] && !sC[j]){ sC[j] = s*sR[i]; changed = true; }
      else if(sC[j] && !sR[i]){ sR[i] = s*sC[j]; changed = true; } }); }
  if(sR.some(v => !v) || sC.some(v => !v)) return {ok:false, why:"grille"};
  for(let k = 0; k < tiles.length; k++){ const [i, j] = cell[k]; if(sR[i]*sC[j] !== (tiles[k].neg ? -1 : 1)) return {ok:false, why:"signes"}; }
  let W = [0,0], H = [0,0];
  cols.forEach((c, j) => { c.s = sC[j]; W = add(W, [c.w[0]*sC[j], c.w[1]*sC[j]]); });
  rows.forEach((c, i) => { c.s = sR[i]; H = add(H, [c.h[0]*sR[i], c.h[1]*sR[i]]); });
  if(W[0] < 0 || (W[0] === 0 && W[1] < 0)){ W = [-W[0], -W[1]]; H = [-H[0], -H[1]]; cols.forEach(c => c.s = -c.s); rows.forEach(c => c.s = -c.s); }
  const q = mulLin(W, H);
  if(q[0] !== p[0] || q[1] !== p[1] || q[2] !== p[2]) return {ok:false, why:"faux"};
  return {ok:true, W, H, cols, rows, L, T};
}

/* ---------- énoncés ---------- */
/* dev : on donne les deux côtés A (en haut) et B (à gauche) ; fac : on donne les tuiles (polynôme p) */
function genOne(lvl, k){
  if(lvl === 0){ const a = rnd(1,4), b = rnd(1,4); return {mode:"dev", A:[1,a], B:[1,b]}; }
  if(lvl === 1){ let a, b; do { a = rnd(1,6); b = rnd(1,6); } while(a === b || a*b > 18); return fac([1,a], [1,b]); }
  if(lvl === 2){ if(k % 2 === 0 && k < 4){ const a = rnd(1,4); return {mode:"dev", A:[1,a], B:[1,a]}; } const a = rnd(1,5); return fac([1,a], [1,a]); }
  if(lvl === 3){
    if(Math.random() < .7){ const a = pick([1,3]), b = rnd(1,3); return fac([2,a], [1,b]); }
    const a = rnd(1,2), b = rnd(1,2); return fac([3,a], [1,b]);
  }
  if(lvl === 4){
    const f = rnd(0,2), a = rnd(1,3), b = rnd(1,3);
    if(f === 0) return {mode:"dev", A:[1,-a], B:[1,-a]};
    if(f === 1) return {mode:"dev", A:[1,-a], B:[1,a]};
    return b === a ? {mode:"dev", A:[1,-a], B:[1,a+1]} : {mode:"dev", A:[1,-a], B:[1,b]};
  }
  return Math.random() < .5 ? (a => fac([1,-a], [1,-a]))(rnd(1,4)) : (a => fac([1,-a], [1,a]))(rnd(1,5));
}
function fac(A, B){ const p = mulLin(A, B); return {mode:"fac", p, A, B}; }
function genSet(lvl){
  const out = [], seen = new Set();
  for(let t = 0; out.length < NB && t < 3000; t++){
    const e = genOne(lvl, out.length), s = e.mode + prod(e.A, e.B);
    if(seen.has(s) && t < 2500) continue; seen.add(s); out.push(e);
  }
  return out;
}
/* tuiles à fournir pour un énoncé « factoriser » */
function stock(e){
  const p = e.p;
  return {x2:p[0], x:Math.max(0, p[1]), nx:Math.max(0, -p[1]), u:Math.max(0, p[2]), nu:Math.max(0, -p[2])};
}
/* cases du cadre (développer) : colonnes = segments de A, lignes = segments de B */
function segs(f){ const out = []; for(let i = 0; i < f[0]; i++) out.push({w:[1,0], s:1}); for(let i = 0; i < Math.abs(f[1]); i++) out.push({w:[0,1], s:f[1] < 0 ? -1 : 1}); return out; }
function frameCells(e){
  const cs = segs(e.A), rs = segs(e.B), cells = [];
  let y = [0,0];
  rs.forEach((r, i) => { let x = [0,0];
    cs.forEach((c, j) => { const k = eqv(c.w, [1,0]) && eqv(r.w, [1,0]) ? "x2" : eqv(c.w, [0,1]) && eqv(r.w, [0,1]) ? "1" : "x";
      cells.push({i, j, x, y, w:c.w, h:r.w, k, r:k === "x" ? (eqv(c.w, [1,0]) ? "h" : "v") : "", neg:c.s*r.s < 0, sc:c.s, sr:r.s}); x = add(x, c.w); });
    y = add(y, r.w); });
  return {cells, cs, rs};
}

/* ---------- état ---------- */
let R0 = null, G = null, ST = null, drag = null;
const $ = s => R0.querySelector(s);
function load(){ try{ const o = JSON.parse(localStorage.getItem(KEY) || "{}"); return o && typeof o === "object" ? o : {}; }catch(e){ return {}; } }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(ST)); }catch(e){} }

const CSS = `
.mj-tui{--c:var(--c3);display:grid;gap:10px;color:var(--ink);position:relative}
.mj-tui *{box-sizing:border-box}
.mj-tui-top{display:flex;gap:10px;align-items:center;flex-wrap:wrap;position:relative}
.mj-tui-lvls{display:flex;gap:6px;flex-wrap:wrap;flex:1 1 auto}
.mj-tui-lv{font:inherit;cursor:pointer;border:2px solid var(--line);background:var(--surface);color:var(--ink);border-radius:12px;padding:5px 11px;text-align:left;line-height:1.25}
.mj-tui-lv b{display:block;font-size:.8rem;color:var(--c);text-transform:uppercase;letter-spacing:.04em}
.mj-tui-lv span{font-size:.92rem;font-weight:600;white-space:nowrap}
.mj-tui-lv small{display:block;font-size:.78rem;color:var(--muted)}
.mj-tui-lv[aria-pressed="true"]{border-color:var(--c);box-shadow:inset 0 0 0 1px var(--c);background:color-mix(in srgb,var(--c) 9%,var(--surface))}
.mj-tui-lv:hover{border-color:var(--c)}
.mj-tui-help{flex:none;margin:0 0 0 auto;border:0;padding:0}
.mj-tui-help summary{border:2px solid var(--line);background:var(--surface);border-radius:999px;padding:6px 14px}
.mj-tui-help summary:hover,.mj-tui-help[open] summary{border-color:var(--c)}
.mj-tui-hbox{position:absolute;right:0;top:calc(100% + 6px);z-index:30;width:min(640px,100%);background:var(--surface);border:2px solid var(--c);border-radius:14px;padding:12px 16px;box-shadow:0 12px 32px rgba(0,0,0,.18);font-size:.97rem}
.mj-tui-hbox ul{margin:0 0 10px;padding-left:1.2em;display:grid;gap:5px}
.mj-tui-hbox .mj-tui-t{position:relative;display:inline-flex;vertical-align:middle;margin:0 2px}
.mj-tui-main{display:grid;grid-template-columns:minmax(0,1fr) 310px;gap:12px;align-items:start}
.mj-tui-play{display:grid;grid-template-columns:auto minmax(0,1fr);gap:0;background:#f7f8fc;border:2px solid var(--line);border-radius:16px;overflow:hidden;color:#14213d}
.mj-tui-tray{background:#eceff7;border-right:2px solid #d7dceb;padding:10px 12px;display:flex;flex-direction:column;gap:10px;width:224px}
.mj-tui-tray h4{margin:0;font-size:.9rem;font-family:var(--f-body);font-weight:700;color:#3d4a63}
.mj-tui-tray .row{display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap}
.mj-tui-pile{position:relative;cursor:grab;touch-action:none;border-radius:6px}
.mj-tui-pile:focus-visible{outline:3px solid var(--c);outline-offset:3px}
.mj-tui-pile.off{opacity:.3;cursor:not-allowed}
.mj-tui-pile .cnt{position:absolute;top:-9px;right:-10px;background:#14213d;color:#fff;font-size:.75rem;font-weight:700;border-radius:999px;padding:0 6px;line-height:1.5;pointer-events:none;letter-spacing:0}
.mj-tui-pairs{display:grid;gap:6px}
.mj-tui-pairs button{font:inherit;font-size:.85rem;font-weight:600;cursor:pointer;border:2px solid #9aa7bd;background:#fff;color:#14213d;border-radius:10px;padding:4px 8px}
.mj-tui-pairs button:hover{border-color:#7c3aed}
.mj-tui-pairs button:disabled{opacity:.45;cursor:default}
.mj-tui-board{position:relative;height:396px;background-color:#fbfcff;background-image:radial-gradient(circle,#cfd6e6 1.1px,transparent 1.3px);overflow:hidden;touch-action:none}
.mj-tui-t{position:absolute;display:flex;align-items:center;justify-content:center;border:2px solid;border-radius:3px;font-family:Georgia,"Times New Roman",serif;font-weight:700;color:#14213d;user-select:none;-webkit-user-select:none;line-height:1;letter-spacing:0;word-spacing:0}
.mj-tui-t.k-x2{background:#a9c8fb;border-color:#2d5fc4;font-size:22px}
.mj-tui-t.k-x{background:#9fe0b4;border-color:#1f8a4c;font-size:17px}
.mj-tui-t.k-1{background:#fde68a;border-color:#b7791f;font-size:13px}
.mj-tui-t.neg{background:#fca5a5;border-color:#c0262d}
.mj-tui-t i{font-style:italic}
.mj-tui-t.r-v .lbl{writing-mode:horizontal-tb}
.mj-tui-board .mj-tui-t{cursor:grab;transition:box-shadow .15s}
.mj-tui-board .mj-tui-t:hover{box-shadow:0 0 0 3px rgba(124,58,237,.35)}
.mj-tui-ghost{position:absolute;z-index:40;pointer-events:none;opacity:.92;box-shadow:0 8px 18px rgba(0,0,0,.25);cursor:grabbing}
.mj-tui-shadow{position:absolute;border:2.5px dashed #7c3aed;background:rgba(124,58,237,.12);border-radius:4px;pointer-events:none;z-index:2}
.mj-tui-shadow.bad{border-color:#c0262d;background:rgba(192,38,45,.1)}
.mj-tui-cell{position:absolute;border:1.5px dashed #9aa7bd;background:rgba(255,255,255,.6);pointer-events:none}
.mj-tui-lab{position:absolute;font-family:Georgia,"Times New Roman",serif;font-weight:700;font-size:15px;color:#14213d;text-align:center;line-height:1;pointer-events:none;white-space:nowrap;letter-spacing:0}
.mj-tui-lab.neg{color:#c0262d}
.mj-tui-lab.tot{font-family:var(--f-display);font-size:19px;font-weight:800;color:#5b21b6;background:#fff;border:2px solid #7c3aed;border-radius:999px;padding:3px 10px}
.mj-tui-lab i{font-style:italic}
.mj-tui-dim{position:absolute;pointer-events:none;border-color:#7c3aed;border-style:solid;border-width:0}
.mj-tui-dim.top{height:10px;border-width:2px 2px 0 2px}
.mj-tui-dim.left{width:10px;border-width:2px 0 2px 2px}
.mj-tui-hint{position:absolute;border:3px dashed #f59e0b;background:rgba(245,158,11,.08);pointer-events:none;border-radius:4px;z-index:1}
.mj-tui-win{animation:mjTuiWin .6s ease-out}
@keyframes mjTuiWin{0%{box-shadow:inset 0 0 0 0 rgba(124,58,237,.5)}40%{box-shadow:inset 0 0 0 14px rgba(124,58,237,.25)}100%{box-shadow:inset 0 0 0 0 rgba(124,58,237,0)}}
.mj-tui-shake{animation:mjTuiShake .35s}
@keyframes mjTuiShake{0%,100%{transform:none}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.mj-tui-side{background:var(--surface);border:2px solid var(--line);border-radius:16px;padding:12px 14px;display:grid;gap:10px;align-content:start}
.mj-tui-head{display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap}
.mj-tui-head h3{font-size:1.15rem}
.mj-tui-stars{color:#e0a100;letter-spacing:.06em;white-space:nowrap}
.mj-tui-stars .off{color:var(--line)}
.mj-tui-task{background:var(--paper);border-radius:12px;padding:10px 12px}
.mj-tui-task .lab{font-size:.85rem;font-weight:700;color:var(--c);text-transform:uppercase;letter-spacing:.05em}
.mj-tui-task .ex{font-family:var(--f-display);font-weight:800;font-size:1.6rem;line-height:1.25}
.mj-tui-live{font-size:.95rem}
.mj-tui-live b{font-size:1.08rem}
.mj-tui .nw{white-space:nowrap}
.mj-tui-msg{border-radius:10px;padding:9px 12px;font-size:.95rem;line-height:1.45;background:var(--paper)}
.mj-tui-msg.ok{background:var(--okbg)} .mj-tui-msg.ok b:first-child{color:var(--ok)}
.mj-tui-msg.warn{background:var(--warnbg)} .mj-tui-msg.warn b:first-child{color:var(--warn)}
.mj-tui-msg.ko{background:var(--kobg)} .mj-tui-msg.ko b:first-child{color:var(--ko)}
.mj-tui-btns{display:flex;gap:6px;flex-wrap:wrap}
.mj-tui-side .btn{padding:7px 14px;border-radius:10px}
.mj-tui-res{background:var(--okbg);border-radius:12px;padding:10px 12px;display:grid;gap:6px}
.mj-tui-res .id{font-family:var(--f-display);font-weight:800;font-size:1.3rem;line-height:1.3}
.mj-tui-big{font-family:var(--f-display);font-size:1.4rem;font-weight:800;color:var(--ok)}
.mj-tui-end table{border-collapse:collapse;font-size:.95rem;width:100%}
.mj-tui-end td{padding:3px 6px;border-bottom:1px solid var(--line)}
@media (max-width:1000px){.mj-tui-main{grid-template-columns:1fr}}
@media (prefers-reduced-motion: reduce){.mj-tui *{animation:none!important;transition:none!important}}
`;

/* ---------- dessin d'une tuile ---------- */
function tileHTML(t, extra){
  const d = dims(t), w = px(d.w), h = px(d.h);
  const lab = (t.neg ? "−" : "") + (t.k === "x2" ? XH + "²" : t.k === "x" ? XH : "1");
  return `<div class="mj-tui-t k-${t.k}${t.neg ? " neg" : ""}${t.k === "x" ? " r-" + t.r : ""}${extra ? " " + extra : ""}" style="width:${w}px;height:${h}px"><span class="lbl">${lab}</span></div>`;
}

/* ---------- interface ---------- */
function init(root){
  if(!document.getElementById("mj-tuiles-css")){ const st = document.createElement("style"); st.id = "mj-tuiles-css"; st.textContent = CSS; document.head.appendChild(st); }
  R0 = root; ST = load(); drag = null;
  const lvl = Math.min(LEVELS.length-1, Math.max(0, +ST.lvl || 0));
  const mini = (k, r, neg) => tileHTML({k, r, neg}).replace('class="mj-tui-t', 'style="transform:scale(.5);transform-origin:left center" class="mj-tui-t');
  root.innerHTML = `<div class="mj-tui">
    <div class="mj-tui-top">
      <div class="mj-tui-lvls" role="group" aria-label="Niveaux"></div>
      <details class="mj-tui-help"${ST.helpSeen ? "" : " open"}><summary>Comment jouer ?</summary><div class="mj-tui-hbox">
        <ul>
          <li>Trois sortes de tuiles : le grand carré <b><i>x</i>²</b> (côté <i>x</i>), le rectangle <b><i>x</i></b> (<i>x</i> sur 1) et le petit carré <b>1</b>. La longueur <i>x</i> n'est pas un nombre entier de petits carrés.</li>
          <li><b>Fais glisser</b> les tuiles de la réserve sur le plan : elles s'aimantent. Pour enlever une tuile, fais-la glisser hors du plan. Clique sur une tuile <i>x</i> posée pour la tourner.</li>
          <li><b>Développer</b> : remplis le rectangle dont les côtés sont donnés, puis compte les tuiles.</li>
          <li><b>Factoriser</b> : assemble <b>toutes</b> les tuiles en un seul rectangle, sans trou. Ses côtés donnent la forme factorisée.</li>
          <li>Aux niveaux 5 et 6, les tuiles <b>rouges</b> sont négatives : −<i>x</i> et −1. Une tuile <i>x</i> et une tuile −<i>x</i> ensemble valent 0.</li>
        </ul><button class="btn primary" type="button" data-a="gotit">J'ai compris, on joue !</button></div></details>
    </div>
    <div class="mj-tui-main">
      <div class="mj-tui-play"><div class="mj-tui-tray"></div><div class="mj-tui-board" aria-label="Le plan de travail"></div></div>
      <aside class="mj-tui-side"></aside>
    </div></div>`;
  const hp = $(".mj-tui-help");
  hp.addEventListener("toggle", () => { if(!hp.open && !ST.helpSeen){ ST.helpSeen = 1; save(); } });
  hp.querySelector('[data-a="gotit"]').onclick = () => { hp.open = false; };
  $(".mj-tui-board").addEventListener("pointerdown", e => { const el = e.target.closest(".mj-tui-board .mj-tui-t"); if(el && G && !G.won) startDrag(e, {from:"board", id:+el.dataset.id}); });
  startLevel(lvl);
}
function lvlBar(){
  const lv = ST.lv || {};
  $(".mj-tui-lvls").innerHTML = LEVELS.map((L, i) => { const s = lv[i] ? lv[i].stars : 0;
    return `<button class="mj-tui-lv" type="button" data-l="${i}" aria-pressed="${G && G.lvl === i}" title="${L.titre}"><b>Niveau ${i+1}</b><span>${L.nom}</span><small>${s ? "★ "+s+"/15" : "—"}</small></button>`; }).join("");
  R0.querySelectorAll(".mj-tui-lv").forEach(b => b.onclick = () => startLevel(+b.dataset.l));
}
function startLevel(l){ ST.lvl = l; save();
  /* niveau 4 : rectangles plus grands (3x + 2), on réduit un peu les tuiles pour qu'ils tiennent dans les deux sens */
  if(l === 3){ U = 24; X = 87; } else { U = 28; X = 101; } G = {lvl:l, set:genSet(l), idx:0, res:[]}; lvlBar(); startPuzzle(); }
function startPuzzle(){
  const e = G.set[G.idx];
  Object.assign(G, {e, tiles:[], nextId:1, errors:0, hints:0, won:false, done:false, stock:e.mode === "fac" ? stock(e) : null, pairs:0, frame:e.mode === "dev" ? frameCells(e) : null});
  drawTray(); drawBoard(); side();
  const L = LEVELS[G.lvl];
  say(e.mode === "dev"
    ? (G.lvl === 4 ? `<b>Les côtés sont donnés.</b> Les −1 sont en rouge : pense à la règle des signes pour choisir la couleur de chaque tuile.` : `<b>Les côtés sont donnés.</b> Remplis le rectangle avec les tuiles qui ont la bonne taille.`)
    : (G.lvl === 5 && !e.p[1] ? `<b>Assemble toutes les tuiles en un rectangle.</b> Il n'y a pas de tuile <i>x</i>… les paires nulles peuvent t'aider.` : `<b>Assemble toutes les tuiles en un seul rectangle</b>, sans trou ni chevauchement.`));
}
/* ---------- réserve ---------- */
function piles(){
  const L = LEVELS[G.lvl], out = [["x2","",false],["x","v",false],["x","h",false],["1","",false]];
  if(L.neg) out.push(["x","v",true],["x","h",true],["1","",true]);
  return out;
}
function left(k, neg){ if(!G.stock) return Infinity; return G.stock[(neg ? "n" : "") + (k === "x2" ? "x2" : k === "x" ? "x" : "u")] - G.tiles.filter(t => t.k === k && !!t.neg === !!neg).length; }
function drawTray(){
  const tr = $(".mj-tui-tray"), L = LEVELS[G.lvl], P = piles();
  const pile = ([k, r, neg]) => { const n = left(k, neg), lab = (neg ? "moins " : "") + (k === "x2" ? "x au carré" : k === "x" ? "x" + (r === "h" ? " couchée" : " debout") : "1");
    return `<div class="mj-tui-pile${n <= 0 ? " off" : ""}" data-k="${k}" data-r="${r}" data-n="${neg ? 1 : 0}" tabindex="${n > 0 ? 0 : -1}" role="button" aria-label="Tuile ${lab}${n !== Infinity ? ", reste " + n : ""}" title="Fais glisser cette tuile sur le plan">${tileHTML({k, r, neg}).replace("position:absolute", "")}${n !== Infinity ? `<span class="cnt">×${Math.max(0, n)}</span>` : ""}</div>`; };
  const pos = P.filter(p => !p[2]), neg = P.filter(p => p[2]);
  tr.innerHTML = `<h4>Réserve</h4>
    <div class="row">${pile(pos[0])}${pile(pos[1])}${neg.length ? pile(neg[0]) : ""}</div>
    <div class="row">${pile(pos[2])}${pile(pos[3])}</div>
    ${neg.length ? `<div class="row">${pile(neg[1])}${pile(neg[2])}</div>` : ""}
    ${L.neg && G.e.mode === "fac" ? `<div class="mj-tui-pairs"><button type="button" data-a="pair">+ une paire nulle<br>(<i>x</i> et −<i>x</i>)</button><button type="button" data-a="unpair"${G.pairs && left("x", false) > 0 && left("x", true) > 0 ? "" : " disabled"}>− retirer une paire</button></div>` : ""}`;
  tr.querySelectorAll(".mj-tui-pile .mj-tui-t").forEach(t => { t.style.position = "relative"; });
  tr.querySelectorAll(".mj-tui-pile").forEach(p => {
    p.addEventListener("pointerdown", e => { if(G.won || p.classList.contains("off")) return; startDrag(e, {from:"tray", k:p.dataset.k, r:p.dataset.r || "v", neg:p.dataset.n === "1", el:p}); });
    p.addEventListener("keydown", e => { if((e.key === "Enter" || e.key === " ") && !p.classList.contains("off") && !G.won){ e.preventDefault(); autoPlace(p.dataset.k, p.dataset.r || "v", p.dataset.n === "1"); } });
  });
  const pb = tr.querySelector('[data-a="pair"]'); if(pb) pb.onclick = () => { if(G.won) return; G.stock.x++; G.stock.nx++; G.pairs++; drawTray(); live(); say(`<b>Paire nulle ajoutée :</b> une tuile <i>x</i> et une tuile −<i>x</i>. Ensemble, elles valent <i>x</i> − <i>x</i> = 0 : l'expression ne change pas.`); };
  const ub = tr.querySelector('[data-a="unpair"]'); if(ub) ub.onclick = () => { if(G.won || !G.pairs) return; G.stock.x--; G.stock.nx--; G.pairs--; drawTray(); live(); evaluate(); };
}
/* ---------- plan ---------- */
function boardSize(){ const b = $(".mj-tui-board"); return {w:b.clientWidth, h:b.clientHeight}; }
function drawBoard(opt){
  opt = opt || {};
  const b = $(".mj-tui-board");
  b.style.backgroundSize = U + "px " + U + "px"; b.style.backgroundPosition = (PADX % U - U/2) + "px " + (PADY % U - U/2) + "px";
  let h = "";
  if(G.frame){
    const {cells, cs, rs} = G.frame;
    cells.forEach(c => { h += `<div class="mj-tui-cell" style="left:${PADX+px(c.x)}px;top:${PADY+px(c.y)}px;width:${px(c.w)}px;height:${px(c.h)}px"></div>`; });
    h += sideLabels(cs.map(c => ({w:c.w, s:c.s})), rs.map(r => ({h:r.w, s:r.s})), [0,0], [0,0], G.e.A, G.e.B);
  }
  if(opt.hint){ const A = G.e.A, B = G.e.B; h += `<div class="mj-tui-hint" style="left:${PADX}px;top:${PADY}px;width:${px([Math.abs(A[0]),Math.abs(A[1])])}px;height:${px([Math.abs(B[0]),Math.abs(B[1])])}px"></div>`; }
  G.tiles.forEach(t => { h += tileHTML(t).replace('style="', `data-id="${t.id}" style="left:${PADX+px(t.x)}px;top:${PADY+px(t.y)}px;`); });
  if(G.won && G.win) h += sideLabels(G.win.cols, G.win.rows, G.win.L, G.win.T, G.win.W, G.win.H);
  b.innerHTML = h;
}
/* dimensions écrites le long du haut et de la gauche : segments (x, 1, −1…) puis le total */
function sideLabels(cols, rows, L, T, W, H){
  let h = "";
  const x0 = PADX + px(L), y0 = PADY + px(T);
  const wTot = cols ? cols.reduce((s, c) => s + px(c.w), 0) : px(sub(W, [0,0])), hTot = rows ? rows.reduce((s, r) => s + px(r.h), 0) : px(H);
  if(cols){ let x = x0; cols.forEach(c => { const w = px(c.w); h += `<div class="mj-tui-lab${c.s < 0 ? " neg" : ""}" style="left:${x}px;top:${y0-22}px;width:${w}px">${c.s < 0 ? "−" : ""}${eqv(c.w,[1,0]) ? XH : "1"}</div>`; x += w; }); }
  if(rows){ let y = y0; rows.forEach(r => { const hh = px(r.h); h += `<div class="mj-tui-lab${r.s < 0 ? " neg" : ""}" style="left:${x0-34}px;top:${y + hh/2 - 8}px;width:28px;text-align:right">${r.s < 0 ? "−" : ""}${eqv(r.h,[1,0]) ? XH : "1"}</div>`; y += hh; }); }
  /* le total : en haut, au-dessus des segments ; à gauche, en face du milieu */
  h += `<div class="mj-tui-dim top" style="left:${x0}px;top:${y0-36}px;width:${wTot}px"></div>`;
  h += `<div class="mj-tui-lab tot" style="left:${x0 + wTot/2}px;top:${y0-52}px;transform:translateX(-50%)">${lin(W, true)}</div>`;
  h += `<div class="mj-tui-dim left" style="left:${x0-44}px;top:${y0}px;height:${hTot}px"></div>`;
  h += `<div class="mj-tui-lab tot" style="left:${x0-48}px;top:${y0 + hTot/2}px;transform:translate(-100%,-50%)">${lin(H, true)}</div>`;
  return h;
}
/* ---------- glisser-déposer ---------- */
function local(el, cx, cy){ const r = el.getBoundingClientRect(), s = r.width / (el.offsetWidth || 1) || 1; return {x:(cx - r.left)/s, y:(cy - r.top)/s, s}; }
function startDrag(e, src){
  if(e.button !== undefined && e.button !== 0) return;
  e.preventDefault();
  let t;
  if(src.from === "board"){ t = G.tiles.find(o => o.id === src.id); if(!t) return; }
  else t = {k:src.k, r:src.k === "x" ? src.r : "", neg:src.neg};
  const elSrc = src.from === "board" ? R0.querySelector(`.mj-tui-board [data-id="${src.id}"]`) : src.el.querySelector(".mj-tui-t");
  const p = local(elSrc, e.clientX, e.clientY);
  const root = $(".mj-tui"), g = document.createElement("div");
  g.innerHTML = tileHTML(t, "mj-tui-ghost"); const gh = g.firstChild; root.appendChild(gh);
  drag = {src, t:{...t}, grab:{x:p.x, y:p.y}, gh, sx:e.clientX, sy:e.clientY, moved:false};
  if(src.from === "board"){ elSrc.style.opacity = ".25"; }
  moveGhost(e.clientX, e.clientY);
  const mv = ev => { if(!drag) return; if(Math.abs(ev.clientX - drag.sx) + Math.abs(ev.clientY - drag.sy) > 4) drag.moved = true; moveGhost(ev.clientX, ev.clientY); };
  const up = ev => { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); endDrag(ev); };
  window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
}
function moveGhost(cx, cy){
  if(!R0.isConnected){ drag = null; return; }
  const p = local($(".mj-tui"), cx, cy);
  drag.gh.style.left = (p.x - drag.grab.x) + "px"; drag.gh.style.top = (p.y - drag.grab.y) + "px";
  const tgt = target(cx, cy, drag);
  let sh = $(".mj-tui-shadow");
  if(tgt && tgt.pos){ if(!sh){ sh = document.createElement("div"); sh.className = "mj-tui-shadow"; $(".mj-tui-board").appendChild(sh); }
    const d = dims(tgt.t); sh.classList.toggle("bad", !!tgt.bad);
    Object.assign(sh.style, {left:PADX + px(tgt.pos[0]) + "px", top:PADY + px(tgt.pos[1]) + "px", width:px(d.w) + "px", height:px(d.h) + "px"}); }
  else if(sh) sh.remove();
}
/* où la tuile tombe-t-elle ? {pos:[x,y] symboliques, t (éventuellement tournée), bad, cell} ou null (hors du plan) */
function target(cx, cy, D){
  const drag = D;
  const b = $(".mj-tui-board"), p = local(b, cx, cy), {w:BWd, h:BHd} = boardSize();
  if(p.x < 0 || p.y < 0 || p.x > BWd || p.y > BHd) return null;
  const t = {...drag.t};
  if(G.frame){
    /* la case sous la souris */
    const fx = p.x - PADX, fy = p.y - PADY;
    const c = G.frame.cells.find(c => fx >= px(c.x) && fx < px(c.x) + px(c.w) && fy >= px(c.y) && fy < px(c.y) + px(c.h));
    if(!c) return {pos:null};
    if(t.k === "x" && c.k === "x") t.r = c.r;          // la tuile x se tourne toute seule pour entrer dans la case
    const fits = t.k === c.k;
    return {pos:[c.x, c.y], t, cell:c, bad:!fits || G.tiles.some(o => o.id !== drag.src.id && eqv(o.x, c.x) && eqv(o.y, c.y))};
  }
  const d = dims(t), want = {x:p.x - drag.grab.x - PADX, y:p.y - drag.grab.y - PADY};
  const others = G.tiles.filter(o => !(drag.src.from === "board" && o.id === drag.src.id));
  const maxX = BWd - PADX - px(d.w) - 2, maxY = BHd - PADY - px(d.h) - 2;
  const cand = (axis, size, maxv) => {
    const set = new Map(), addc = v => { const q = px(v); if(q >= -0.01 && q <= maxv + .01) set.set(kv(v), v); };
    others.forEach(o => { const od = dims(o), a = axis === "x" ? o.x : o.y, s = axis === "x" ? od.w : od.h;
      addc(a); addc(add(a, s)); addc(sub(a, size)); addc(sub(add(a, s), size)); });
    const edges = [...set.values()];
    const grid = []; for(let m = 0; m <= 5; m++) for(let n = 0; n <= 30; n++){ const v = [m, n]; if(px(v) <= maxv + .01) grid.push(v); }
    const w = axis === "x" ? want.x : want.y;
    const byD = a => a.map(v => ({v, d:Math.abs(px(v) - w)})).sort((a, b) => a.d - b.d);
    const E = byD(edges).filter(o => o.d <= 16), Gr = byD(grid).slice(0, 4);
    return (E.length ? E.concat(Gr.map(o => ({v:o.v, d:o.d + 16}))) : Gr).slice(0, 6);
  };
  const cX = cand("x", d.w, maxX), cY = cand("y", d.h, maxY);
  const combos = [];
  cX.forEach(a => cY.forEach(b => combos.push({x:a.v, y:b.v, d:a.d + b.d})));
  combos.sort((a, b) => a.d - b.d);
  for(const c of combos){
    if(c.d > 60) break;
    const tt = {...t, x:c.x, y:c.y};
    if(!others.some(o => overlap(o, tt))) return {pos:[c.x, c.y], t};
  }
  return {pos:null};
}
function overlap(a, b){
  const da = dims(a), db = dims(b), r = XV[0];
  const ax0 = num(a.x, r), ay0 = num(a.y, r), ax1 = ax0 + num(da.w, r), ay1 = ay0 + num(da.h, r);
  const bx0 = num(b.x, r), by0 = num(b.y, r), bx1 = bx0 + num(db.w, r), by1 = by0 + num(db.h, r);
  return Math.min(ax1, bx1) - Math.max(ax0, bx0) > 1e-6 && Math.min(ay1, by1) - Math.max(ay0, by0) > 1e-6;
}
function endDrag(ev){
  if(!drag) return;
  const D = drag; drag = null; D.gh.remove(); const sh = $(".mj-tui-shadow"); if(sh) sh.remove();
  if(!R0.isConnected) return;
  /* un simple clic sur une tuile x posée : on la tourne */
  if(!D.moved){
    if(D.src.from === "board"){ const t = G.tiles.find(o => o.id === D.src.id); if(t && t.k === "x" && !G.frame) rotate(t); else drawBoard(); }
    else say(`<b>Fais glisser</b> la tuile jusqu'au plan (garde le bouton de la souris enfoncé).`);
    return;
  }
  D.t = {...D.t};
  const tg = target(ev.clientX, ev.clientY, D);
  if(!tg){ /* lâchée hors du plan : elle retourne dans la réserve */
    if(D.src.from === "board"){ G.tiles = G.tiles.filter(o => o.id !== D.src.id); after(); } return; }
  if(!tg.pos){ if(G.frame) say(`Pose la tuile <b>dans une case</b> du rectangle.`); else say(`Pas de place ici : les tuiles ne doivent pas se chevaucher.`, "warn"); drawBoard(); return; }
  if(G.frame && tg.bad){ frameError(tg, D); drawBoard(); return; }
  if(D.src.from === "board"){ const t = G.tiles.find(o => o.id === D.src.id); Object.assign(t, {x:tg.pos[0], y:tg.pos[1], r:tg.t.r}); }
  else G.tiles.push({id:G.nextId++, k:tg.t.k, r:tg.t.r, neg:tg.t.neg, x:tg.pos[0], y:tg.pos[1]});
  if(G.frame) checkSign(tg);
  after();
}
/* clavier : Entrée sur une tuile de la réserve la pose à la première place libre qui convient */
function autoPlace(k, r, neg){
  const t = {k, r:k === "x" ? r : "", neg};
  if(G.frame){
    const c = G.frame.cells.find(c => c.k === k && !G.tiles.some(o => eqv(o.x, c.x) && eqv(o.y, c.y)));
    if(!c){ say(`Il n'y a plus de case libre pour cette tuile.`, "warn"); return; }
    t.r = c.r; G.tiles.push({id:G.nextId++, ...t, x:c.x, y:c.y}); checkSign({cell:c, t}); after(); return;
  }
  const {w, h} = boardSize(), d = dims(t);
  for(let n = 0; n < 40; n++) for(let m = 0; m < 30; m++){
    const x = [0, m], y = [0, n]; if(px(x) + px(d.w) > w - PADX - 2 || px(y) + px(d.h) > h - PADY - 2) continue;
    const tt = {...t, x, y}; if(!G.tiles.some(o => overlap(o, tt))){ G.tiles.push({id:G.nextId++, ...tt}); after(); return; } }
  say(`Plus de place sur le plan : range un peu les tuiles.`, "warn");
}
function rotate(t){
  const nt = {...t, r:t.r === "v" ? "h" : "v"}, d = dims(nt), {w, h} = boardSize();
  const ok = px(nt.x) + px(d.w) <= w - PADX && px(nt.y) + px(d.h) <= h - PADY && !G.tiles.some(o => o.id !== t.id && overlap(o, nt));
  if(!ok){ drawBoard(); const el = R0.querySelector(`.mj-tui-board [data-id="${t.id}"]`); if(el){ el.classList.add("mj-tui-shake"); } say(`Pas la place de tourner cette tuile ici.`, "warn"); return; }
  t.r = nt.r; after();
}
const kName = (k, neg) => (neg ? "−" : "") + (k === "x2" ? XH + "²" : k === "x" ? XH : "1");
const segName = (w, s) => (s < 0 ? "−" : "") + (eqv(w, [1,0]) ? XH : "1");
/* développer : mauvaise tuile dans une case */
function frameError(tg, D){
  const c = tg.cell, t = tg.t;
  if(G.tiles.some(o => !(D.src.from === "board" && o.id === D.src.id) && eqv(o.x, c.x) && eqv(o.y, c.y))){ say(`Cette case est déjà remplie.`, "warn"); return; }
  G.errors++;
  const mes = (eqv(c.w,[1,0]) ? XH : "1") + " sur " + (eqv(c.h,[1,0]) ? XH : "1");
  say(`<b>Ça ne rentre pas :</b> cette case mesure ${mes}, son aire est ${kName(c.k, false)}. Il faut une tuile ${kName(c.k, false)}${G.lvl === 4 ? " (de la bonne couleur)" : ""}, pas ${kName(t.k, t.neg)}.`, "ko");
  side(true);
}
/* développer avec des négatifs : la couleur doit suivre la règle des signes */
function checkSign(tg){
  const c = tg.cell, t = G.tiles[G.tiles.length - 1] && eqv(G.tiles[G.tiles.length-1].x, c.x) && eqv(G.tiles[G.tiles.length-1].y, c.y) ? G.tiles[G.tiles.length-1] : G.tiles.find(o => eqv(o.x, c.x) && eqv(o.y, c.y));
  if(!t || !!t.neg === c.neg){ G.lastOk = true; return; }
  G.errors++; G.tiles = G.tiles.filter(o => o !== t);
  const a = segName(c.w, c.sc), b = segName(c.h, c.sr);
  const prodTxt = `(${b}) × (${a})`.replace(/\((<i>x<\/i>|1)\)/g, "$1");
  say(`<b>Attention au signe :</b> cette case est sur la ligne ${b} et dans la colonne ${a}. ${prodTxt} = ${kName(c.k, c.neg)} : il faut une tuile <b>${c.neg ? "rouge" : "de couleur"}</b> (${c.neg ? "négative" : "positive"}).`, "ko");
  G.signErr = true;
}
function after(){
  drawTray(); drawBoard(); live();
  if(G.signErr){ G.signErr = false; side(true); return; }
  evaluate();
}
/* ---------- le rectangle est-il fini ? ---------- */
function evaluate(){
  if(G.won) return;
  const e = G.e;
  if(G.frame){
    const full = G.frame.cells.every(c => G.tiles.some(o => eqv(o.x, c.x) && eqv(o.y, c.y)));
    if(full) return win({W:e.A, H:e.B, cols:G.frame.cs, rows:G.frame.rs.map(r => ({h:r.w, s:r.s})), L:[0,0], T:[0,0]});
    const n = G.frame.cells.length - G.tiles.length;
    if(G.tiles.length) say(`Bien. Encore <b>${n}</b> case${n>1?"s":""} à remplir.`);
    return;
  }
  const rest = G.stock.x2 + G.stock.x + G.stock.nx + G.stock.u + G.stock.nu - G.tiles.length;
  if(rest > 0){ if(G.tiles.length) say(`Il reste <b>${rest}</b> tuile${rest>1?"s":""} dans la réserve : il faut toutes les utiliser.`); return; }
  const signed = !!LEVELS[G.lvl].neg, r = check(G.tiles, signed);
  if(r.ok) return win(r);
  const why = {
    chevauche:"des tuiles se chevauchent.",
    trou:"ce n'est pas un rectangle : il y a un trou ou un bord qui dépasse. Déplace des tuiles pour obtenir un rectangle bien plein.",
    faux:"on dirait un rectangle, mais un côté mélange des <i>x</i> et des 1 qui ne s'alignent pas vraiment : <i>x</i> n'est pas un nombre entier de petits carrés.",
    grille:"range les tuiles en lignes et en colonnes : chaque tuile doit avoir la largeur de sa colonne et la hauteur de sa ligne.",
    signes:"c'est bien un rectangle, mais les couleurs ne vont pas. Dans une colonne −1, sur la ligne <i>x</i>, il faut −<i>x</i> ; et (−1) × (−1) = +1 dans le coin."
  }[r.why] || "ce n'est pas encore un rectangle.";
  say(`<b>Pas encore :</b> ${why}`, "warn");
}
function win(r){
  G.won = true; G.win = r;
  const e = G.e, st = e.mode === "dev" ? (G.errors === 0 ? 3 : G.errors <= 2 ? 2 : 1) : Math.max(1, 3 - G.hints);
  const raw = polyRaw(G.tiles, true), red = poly(polyOf(G.tiles), true);
  G.res.push({mode:e.mode, f:prod(r.W, r.H, true), p:red, stars:st, pts:[0,40,70,100][st]});
  drawBoard(); const b = $(".mj-tui-board"); b.classList.remove("mj-tui-win"); void b.offsetWidth; b.classList.add("mj-tui-win");
  side();
}
/* ---------- panneau de droite ---------- */
function stars(n, max){ return max > 3 ? `<span class="mj-tui-stars" aria-label="${n} étoiles sur ${max}">★ ${n} / ${max}</span>` : `<span class="mj-tui-stars" aria-label="${n} étoile${n>1?"s":""} sur ${max}">${"★".repeat(n)}<span class="off">${"★".repeat(max-n)}</span></span>`; }
function say(h, kind){ const m = $(".mj-tui-msg"); if(m){ m.className = "mj-tui-msg" + (kind ? " " + kind : ""); m.innerHTML = h; } }
function live(){
  const el = $(".mj-tui-live"); if(!el) return;
  const p = polyOf(G.tiles), raw = polyRaw(G.tiles, true), red = poly(p, true);
  el.innerHTML = G.tiles.length ? `Tuiles posées : <b class="nw">${raw}</b>${raw !== red ? ` <b class="nw">= ${red}</b>` : ""}` : `Tuiles posées : <b>aucune</b>`;
}
function side(keepMsg){
  const a = $(".mj-tui-side"), e = G.e;
  const oldMsg = keepMsg && $(".mj-tui-msg") ? $(".mj-tui-msg").outerHTML : null;
  const got = G.res.reduce((s, r) => s + r.stars, 0);
  if(G.done) return endScreen();
  let body;
  if(G.won){
    const r = G.res[G.res.length-1], W = G.win.W, H = G.win.H, raw = polyRaw(G.tiles, true), red = poly(polyOf(G.tiles), true);
    const f = prod(W, H, true);
    const [big, small] = (W[0] > H[0] || (W[0] === H[0] && W[1] <= H[1])) ? [W, H] : [H, W];
    const square = eqv(W, H), diff = !red.includes(XH + " ") && polyOf(G.tiles)[1] === 0 && polyOf(G.tiles)[2] < 0;
    const id = e.mode === "dev" ? `${f} = ${raw !== red ? raw + " = " : ""}${red}` : `${red} = ${f}`;
    const note = square ? `C'est un <b>carré</b> : ses deux côtés mesurent ${lin(W, true)}.` : diff ? `Les tuiles <i>x</i> et −<i>x</i> s'annulent : c'est l'identité <b class="nw">(<i>a</i> − <i>b</i>)(<i>a</i> + <i>b</i>) = <i>a</i>² − <i>b</i>²</b>.` : `Aire du rectangle = longueur × largeur.`;
    const rem = square && W[1] > 0 ? ` C'est l'identité <b class="nw">(<i>a</i> + <i>b</i>)² = <i>a</i>² + 2<i>ab</i> + <i>b</i>²</b>.` : square && W[1] < 0 ? ` C'est l'identité <b class="nw">(<i>a</i> − <i>b</i>)² = <i>a</i>² − 2<i>ab</i> + <i>b</i>²</b>.` : "";
    body = `<div class="mj-tui-res"><div><span class="mj-tui-big">Bravo !</span> ${stars(r.stars, 3)}</div>
      <div class="id">${id.split(" = ").map(t => `<span class="nw">${t}</span>`).join(" = ")}</div>
      <div>${e.mode === "dev" ? "On compte les tuiles du rectangle." : `Les côtés du rectangle mesurent <span class="nw">${lin(big, true)}</span> et <span class="nw">${lin(small, true)}</span>.`} ${note}${rem}</div></div>
      <div class="mj-tui-btns"><button class="btn primary" type="button" data-a="next">${G.idx + 1 < NB ? "Puzzle suivant →" : "Voir mon score →"}</button></div>`;
  } else {
    const task = e.mode === "dev" ? `<div class="lab">Développe</div><div class="ex">${prod(e.A, e.B, true)}</div>` : `<div class="lab">Factorise</div><div class="ex">${poly(e.p, true)}</div>`;
    body = `<div class="mj-tui-task">${task}</div>
      <div class="mj-tui-live"></div>
      <div class="mj-tui-msg" role="status"></div>
      <div class="mj-tui-btns">${e.mode === "fac" ? `<button class="btn" type="button" data-a="hint">Coup de pouce</button>` : ""}<button class="btn" type="button" data-a="clear">Tout enlever</button></div>
      <div class="mj-tui-score" style="font-size:.9rem;color:var(--muted)">${e.mode === "dev" ? `Erreurs : <b style="color:var(--ink)">${G.errors}</b> · 0 erreur = 3 étoiles` : `Coups de pouce : <b style="color:var(--ink)">${G.hints}</b> · sans aide = 3 étoiles`}</div>`;
  }
  a.innerHTML = `<div class="mj-tui-head"><h3>Puzzle ${G.idx+1} / ${NB}</h3>${stars(got, NB*3)}</div>${body}`;
  if(oldMsg && $(".mj-tui-msg")) $(".mj-tui-msg").outerHTML = oldMsg;
  live();
  const nx = a.querySelector('[data-a="next"]');
  if(nx){ nx.onclick = () => { G.idx++; if(G.idx >= NB){ G.done = true; finish(); } else startPuzzle(); }; setTimeout(() => nx.isConnected && nx.focus({preventScroll:true}), 30); }
  const cb = a.querySelector('[data-a="clear"]'); if(cb) cb.onclick = () => { G.tiles = []; drawTray(); drawBoard(); live(); say("Le plan est vide : toutes les tuiles sont revenues dans la réserve."); };
  const hb = a.querySelector('[data-a="hint"]'); if(hb) hb.onclick = hint;
}
function hint(){
  if(G.won) return;
  G.hints++; const e = G.e, p = e.p;
  side();
  if(G.hints === 1){
    let t;
    if(LEVELS[G.lvl].neg && !p[1]) t = `Il n'y a pas de tuile <i>x</i> : ajoute <b>${Math.sqrt(-p[2])} paires nulles</b> (<i>x</i> et −<i>x</i>). Pose <i>x</i>², les tuiles −<i>x</i> d'un côté, les tuiles <i>x</i> de l'autre, et les −1 dans le coin.`;
    else if(LEVELS[G.lvl].neg) t = `Pose <i>x</i>², puis les tuiles −<i>x</i> moitié à droite (debout), moitié en dessous (couchées). Dans le coin, (−1) × (−1) = +1 : les tuiles jaunes.`;
    else if(p[0] > 1) t = `Pose les ${p[0]} tuiles <i>x</i>² côte à côte, puis les tuiles <i>x</i> autour, et les petits carrés dans le coin qui reste.`;
    else t = `Pose <i>x</i>² dans un coin. Mets des tuiles <i>x</i> debout à sa droite et couchées en dessous, puis bouche le coin avec les petits carrés. Il faut trouver combien en mettre de chaque côté.`;
    say(`<b>Coup de pouce :</b> ${t}`);
  } else {
    drawBoard({hint:true});
    say(`<b>Coup de pouce :</b> le rectangle à construire a la taille du cadre orange (en haut à gauche du plan).`);
  }
}
function finish(){
  const tot = G.res.reduce((s, r) => s + r.pts, 0), st = G.res.reduce((s, r) => s + r.stars, 0);
  ST.lv = ST.lv || {}; const o = ST.lv[G.lvl] || {stars:0, best:0};
  G.rec = tot > o.best; ST.lv[G.lvl] = {stars:Math.max(o.stars, st), best:Math.max(o.best, tot)}; save();
  G.tot = tot; G.st = st; lvlBar(); endScreen();
}
function endScreen(){
  const a = $(".mj-tui-side"), next = G.lvl + 1 < LEVELS.length;
  a.innerHTML = `<div class="mj-tui-end" style="display:grid;gap:8px">
    <div class="mj-tui-head"><h3>Niveau ${G.lvl+1} terminé !</h3>${stars(G.st, NB*3)}</div>
    <div><span class="mj-tui-big">${G.tot} points</span> sur ${NB*100}${G.rec ? " · <b>nouveau record !</b>" : ` · record : ${ST.lv[G.lvl].best}`}</div>
    <table>${G.res.map(r => `<tr><td>${r.mode === "dev" ? r.f + " = " + r.p : r.p + " = " + r.f}</td><td>${stars(r.stars, 3)}</td></tr>`).join("")}</table>
    <div class="mj-tui-btns"><button class="btn${next ? "" : " primary"}" type="button" data-a="again">Rejouer ce niveau</button>${next ? `<button class="btn primary" type="button" data-a="nextl">Niveau ${G.lvl+2} →</button>` : ""}</div>
  </div>`;
  a.querySelector('[data-a="again"]').onclick = () => startLevel(G.lvl);
  const n = a.querySelector('[data-a="nextl"]'); if(n){ n.onclick = () => startLevel(G.lvl + 1); setTimeout(() => n.isConnected && n.focus({preventScroll:true}), 30); }
}

return {init, _state:() => G, _dim:() => [U, X], _t:{check, genSet, genOne, stock, frameCells, poly, polyRaw, polyOf, prod, lin, mulLin, dims, LEVELS, XV}};
})();
