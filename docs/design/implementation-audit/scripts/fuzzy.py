import re,glob,os,sys,difflib,html
ROOT=sys.argv[1]
def norm(s):
    s=html.unescape(s).replace('’',"'").replace('“','"').replace('”','"')
    return re.sub(r'\s+',' ',s).strip()
strs=[]
for f in glob.glob(ROOT+'/data/*.ts')+glob.glob(ROOT+'/content/posts/*.md'):
    t=open(f).read()
    for i,line in enumerate(t.split('\n'),1):
        for m in re.finditer(r'"((?:[^"\\]|\\.){15,})"',line):
            strs.append((os.path.relpath(f,ROOT)+':'+str(i),norm(m.group(1))))
        if f.endswith('.md') and len(line)>30: strs.append((os.path.relpath(f,ROOT)+':'+str(i),norm(line)))
for q in sys.stdin.read().split('\n'):
    q=q.strip()
    if not q: continue
    best=sorted(strs,key=lambda s:-difflib.SequenceMatcher(None,q.lower(),s[1].lower()).ratio())[:1]
    for loc,s in best:
        r=difflib.SequenceMatcher(None,q.lower(),s.lower()).ratio()
        print(f'Q: {q[:200]}\n  -> {r:.2f} {loc}: {s[:300]}\n')
