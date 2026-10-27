import re, glob, html, sys, os
from html.parser import HTMLParser
ROOT = sys.argv[1]
def norm(s):
    s = html.unescape(s)
    s = s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('\\u2019',"'").replace("\\'", "'").replace('\\"','"')
    s = s.replace('&amp;','&')
    s = re.sub(r'\s+',' ',s).strip().lower()
    return s
def load(globs):
    out=[]
    for g in globs:
        for f in glob.glob(os.path.join(ROOT,g), recursive=True):
            if "__tests__" in f or "node_modules" in f or os.path.isdir(f): continue
            t=open(f,encoding='utf-8').read()
            # join TS string concatenations "a" + "b"
            t=re.sub(r'"\s*\+\s*\n?\s*"','',t)
            out.append(norm(t))
    return ' \n '.join(out)
DATA = load(['data/*.ts','content/posts/*.md'])
CODE = load(['app/**/*.tsx','app/**/*.ts','components/**/*.tsx','features/**/*.tsx','features/**/*.ts','app/**/*.txt'])
class P(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True); s.skip=0; s.segs=[]; s.line=1; s.script=False
    def handle_starttag(s,tag,attrs):
        if tag in ('style','svg'): s.skip+=1
        if tag=='script': s.script=True
        for k,v in attrs:
            if k in ('alt','aria-label','placeholder','title','data-n','content') and v and not v.startswith('@@'):
                s.segs.append((s.getpos()[0], f'[{k}] '+v))
    def handle_endtag(s,tag):
        if tag in ('style','svg'): s.skip=max(0,s.skip-1)
        if tag=='script': s.script=False
    def handle_data(s,d):
        if s.skip: return
        if s.script:
            line0=s.getpos()[0]
            for m in re.finditer(r'(["`])((?:(?!\1)[^\\\n]|\\.){12,}?)\1', d):
                v=m.group(2)
                if len(v.split())>=3 and not re.search(r'[{};=<>]|\$\{|^\s*[.#\[]|rgba|px|var\(', v):
                    s.segs.append((line0+d[:m.start()].count('\n'), '[js] '+v))
            return
        t=d.strip()
        if t and re.search(r'[A-Za-z]',t) and not t.startswith('@@'):
            s.segs.append((s.getpos()[0], t))
for f in sys.argv[2:]:
    p=P(); p.feed(open(f,encoding='utf-8').read())
    print(f'===== {os.path.relpath(f,ROOT)}')
    seen=set()
    for line,seg in p.segs:
        txt=re.sub(r'^\[(\w|-)+\] ','',seg)
        n=norm(txt)
        if len(n)<4 or n in seen: continue
        seen.add(n)
        if n in DATA: continue
        # try sentence-level
        sents=[x for x in re.split(r'(?<=[.!?:])\s+',n) if len(x)>3]
        miss=[x for x in sents if x.rstrip('.') not in DATA]
        if not miss: continue
        where='CODE' if n in CODE else 'NONE'
        print(f'{line}\t{where}\t{seg[:220]}')
