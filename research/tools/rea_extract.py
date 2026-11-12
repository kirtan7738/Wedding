"""Usage: python -I rea_extract.py <rea_capture.json> <out_prefix>
Extracts screenshots (PNG) from an REA capture_browser_scenario result and lists
network URLs grouped by kind (audio/video, js, css/fonts, images, other)."""
import json, sys, re, base64, os

src, prefix = sys.argv[1], sys.argv[2]
d = json.load(open(src, encoding='utf-8'))
n = d['normalized_result']
os.makedirs(os.path.dirname(prefix) or '.', exist_ok=True)
saved = [0]


def walk(o):
    if isinstance(o, dict):
        if o.get('media_type') == 'image/png':
            for v in o.values():
                if isinstance(v, str) and len(v) > 200:
                    try:
                        raw = base64.b64decode(v)
                    except Exception:
                        continue
                    fn = f"{prefix}_{saved[0]}.png"
                    open(fn, 'wb').write(raw)
                    print('screenshot', fn)
                    saved[0] += 1
                    break
        for v in o.values():
            walk(v)
    elif isinstance(o, list):
        for v in o:
            walk(v)


walk(n)
s = json.dumps(n['events'])
BS = chr(92)
urls = sorted(set(u.rstrip(BS) for u in re.findall(r'https?://[^"\s' + BS + BS + r']+', s)))
groups = {
    'audio/video': r'\.(mp3|m4a|ogg|wav|aac|mp4|webm|opus)(\?|$)',
    'js': r'\.(m?js)(\?|$)',
    'css/fonts': r'(\.css|\.woff2?|\.ttf|fonts\.)',
    'images': r'\.(png|jpe?g|webp|avif|gif|svg)(\?|$)|unsplash|cloudinary|imagekit',
}
used = set()
for g, pat in groups.items():
    hits = [u for u in urls if re.search(pat, u, re.I) and u not in used]
    used |= set(hits)
    print(f'== {g} ({len(hits)})')
    for u in hits:
        print('  ', u[:200])
rest = [u for u in urls if u not in used]
print(f'== other ({len(rest)})')
for u in rest[:60]:
    print('  ', u[:200])
for st in n['steps']:
    if st.get('error'):
        print('STEP ERROR', st['step_id'], st['error'])
