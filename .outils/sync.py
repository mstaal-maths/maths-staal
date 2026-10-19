"""Copie le site (version claude.ai) dans le dépôt GitHub et ajoute ce qu'il faut pour un vrai site public :
   en-tête HTML complet (téléphones, langue), description pour Google, plan du site."""
import shutil, os, re, sys
SRC=sys.argv[1]; DST=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL='https://mstaal-maths.github.io/maths-staal/'
shutil.rmtree(os.path.join(DST,'pdf'), ignore_errors=True)   # les PDF sont maintenant tous dans pb/
for d in ['data','lib','pb']:
    shutil.rmtree(os.path.join(DST,d), ignore_errors=True); shutil.copytree(os.path.join(SRC,d), os.path.join(DST,d))
html=open(os.path.join(SRC,'index.html'),encoding='utf-8').read()
html=html.replace('<meta charset="utf-8">\n','',1).replace('<title>Les maths avec M. Staal</title>\n','',1)
head=f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Les maths avec M. Staal – Révisions de maths de la 6e à la 3e</title>
<meta name="description" content="Le site de révision de M. Staal, professeur de mathématiques : cours, exercices corrigés, QCM et évaluations d'entraînement pour les élèves de la 6e à la 3e.">
<link rel="canonical" href="{URL}">
<meta property="og:title" content="Les maths avec M. Staal">
<meta property="og:description" content="Cours, exercices corrigés et entraînement pour les élèves de la 6e à la 3e.">
<meta property="og:url" content="{URL}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#f6f8fc">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon-192.png" type="image/png">
<link rel="apple-touch-icon" href="icon-192.png">
<meta name="apple-mobile-web-app-title" content="Maths M. Staal">
<meta name="google-site-verification" content="FbK-a01abS9KfgRM0RR3wsXvcssGQ3GlBl0Y_OxGacg">
'''
open(os.path.join(DST,'index.html'),'w',encoding='utf-8').write(head+html)
open(os.path.join(DST,'sitemap.xml'),'w').write(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>{URL}</loc></url>\n</urlset>\n')

# ---------- fonctionnement sans connexion : manifeste, icônes, service worker, liste des images par classe ----------
import json, time, glob, hashlib
from PIL import Image, ImageDraw, ImageFont
def icon(n):
    im=Image.new('RGB',(n,n),'#1b2a44'); d=ImageDraw.Draw(im)
    f=None
    for c in ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf','/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf']:
        if os.path.exists(c): f=ImageFont.truetype(c,int(n*0.42)); break
    d.text((n/2,n/2),'MS',fill='white',font=f,anchor='mm'); im.save(os.path.join(DST,f'icon-{n}.png'))
icon(192); icon(512)
json.dump({"name":"Les maths avec M. Staal","short_name":"Maths M. Staal","lang":"fr","start_url":"./","scope":"./","display":"standalone",
  "background_color":"#f6f8fc","theme_color":"#1b2a44","icons":[{"src":"icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icon-512.png","sizes":"512x512","type":"image/png","purpose":"any maskable"}]},
  open(os.path.join(DST,'manifest.webmanifest'),'w'),ensure_ascii=False,indent=1)
# images utilisées par chaque classe (pour le bouton « télécharger les images de ma classe »)
IB={}
CLS=lambda n: '3e' if n.startswith('3k') else '4e' if n.startswith('4k') else '5e' if n[:2] in ('5k','5c') else '6e' if n.startswith('c') else None
for d in sorted(os.listdir(os.path.join(DST,'img'))):
    c=CLS(d)
    if c: IB.setdefault(c,set()).update('img/'+d+'/'+f for f in os.listdir(os.path.join(DST,'img',d)))
for k in list(IB): IB[k]=sorted(IB[k])
open(os.path.join(DST,'data','iblist.js'),'w').write('window.IBLIST='+json.dumps(IB)+';\n')
core=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png']+sorted(os.path.relpath(x,DST) for d in ['data','lib'] for x in glob.glob(os.path.join(DST,d,'**','*'),recursive=True) if os.path.isfile(x))
H=hashlib.sha1()
for x in core[1:]: H.update(open(os.path.join(DST,x),'rb').read())
ver=H.hexdigest()[:10]
open(os.path.join(DST,'sw.js'),'w').write(f'''/* Les maths avec M. Staal : fonctionnement sans connexion */
const V="staal-{ver}", CORE={json.dumps(core)};
self.addEventListener("install", e=>{{ self.skipWaiting(); e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).catch(()=>{{}})); }});
self.addEventListener("activate", e=>{{ e.waitUntil(caches.keys().then(K=>Promise.all(K.filter(k=>k.startsWith("staal-")&&k!==V&&k!=="staal-media").map(k=>caches.delete(k)))).then(()=>self.clients.claim())); }});
self.addEventListener("fetch", e=>{{
  const r=e.request, u=new URL(r.url); if(r.method!=="GET" || u.origin!==location.origin) return;
  const media=/[/](img|pb)[/]/.test(u.pathname), store=media?"staal-media":V;
  if(r.mode==="navigate"){{ e.respondWith(fetch(r).then(x=>{{ const y=x.clone(); caches.open(V).then(c=>c.put("index.html",y)); return x; }}).catch(()=>caches.match("index.html"))); return; }}
  e.respondWith(caches.open(store).then(c=>c.match(r,{{ignoreSearch:true}}).then(hit=>{{
    const net=fetch(r).then(x=>{{ if(x.ok) c.put(r,x.clone()); return x; }}).catch(()=>hit);
    if(hit){{ e.waitUntil(net.catch(()=>{{}})); return hit; }} return net; }})));
}});
''')
print('ok')
