import random
random.seed(7)
W, H, G = 1000, 620, 540
o = []
a = o.append
a(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">')
a('''<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#2b4a7a"/><stop offset=".55" stop-color="#f08a5d"/><stop offset="1" stop-color="#ffd59a"/></linearGradient>
<linearGradient id="stone" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="#6f6a64"/><stop offset=".5" stop-color="#8d877e"/><stop offset="1" stop-color="#5d5852"/></linearGradient>
<linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#b3ab9f"/><stop offset="1" stop-color="#8f877b"/></linearGradient>
<radialGradient id="sun" cx=".5" cy=".5" r=".5">
<stop offset="0" stop-color="#fff6c8"/><stop offset="1" stop-color="#fff6c800"/></radialGradient>
<linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#4f8a3a"/><stop offset="1" stop-color="#2d5a24"/></linearGradient>
</defs>''')
a(f'<rect width="{W}" height="{H}" fill="url(#sky)"/>')
a('<circle cx="760" cy="300" r="170" fill="url(#sun)"/><circle cx="760" cy="300" r="42" fill="#fff1b8"/>')
for _ in range(60):
    a(f'<circle cx="{random.randint(0,W)}" cy="{random.randint(0,170)}" r="{random.choice([.8,1.1,1.5])}" fill="#fff" opacity="{random.uniform(.3,.9):.2f}"/>')
# clouds
for x, y in [(120,110),(430,70),(880,130)]:
    a(f'<g fill="#fff" opacity=".35"><ellipse cx="{x}" cy="{y}" rx="70" ry="14"/><ellipse cx="{x+40}" cy="{y-8}" rx="45" ry="12"/></g>')
# mountains
a(f'<path d="M0 {G} L0 400 Q120 330 230 390 T430 380 T640 360 T850 390 T1000 350 L1000 {G}Z" fill="#3c4f6e" opacity=".8"/>')
a(f'<path d="M0 {G} L0 450 Q150 400 300 440 T600 430 T1000 440 L1000 {G}Z" fill="#2f5a48"/>')
cx = W/2
# Ground
a(f'<rect y="{G}" width="{W}" height="{H-G}" fill="url(#grass)"/>')

def stupa(x, y, s=1.0, lattice=True):
    # y = base; bell stupa
    w, h = 26*s, 30*s
    a(f'<rect x="{x-w*.8:.1f}" y="{y-6*s:.1f}" width="{w*1.6:.1f}" height="{6*s:.1f}" fill="#6a645c"/>')
    a(f'<path d="M{x-w:.1f} {y-6*s:.1f} Q{x-w:.1f} {y-h-6*s:.1f} {x:.1f} {y-h-6*s:.1f} Q{x+w:.1f} {y-h-6*s:.1f} {x+w:.1f} {y-6*s:.1f}Z" fill="url(#stone)" stroke="#4a463f" stroke-width="{.8*s:.1f}"/>')
    if lattice:
        for i in (-.5, 0, .5):
            for j in (.25, .55):
                a(f'<rect x="{x+i*w-3*s:.1f}" y="{y-6*s-h*j-4*s:.1f}" width="{6*s:.1f}" height="{8*s:.1f}" fill="#2c2924" opacity=".85" transform="rotate(45 {x+i*w:.1f} {y-6*s-h*j:.1f})"/>')
    a(f'<rect x="{x-3*s:.1f}" y="{y-h-14*s:.1f}" width="{6*s:.1f}" height="{8*s:.1f}" fill="#7b756b"/>')
    a(f'<path d="M{x:.1f} {y-h-26*s:.1f} L{x+4*s:.1f} {y-h-14*s:.1f} L{x-4*s:.1f} {y-h-14*s:.1f}Z" fill="#8d877e"/>')

# Square terraces (bottom to top)
tiers = [(780,30),(700,32),(620,32),(540,32),(460,30)]
y = G
for i,(w,h) in enumerate(tiers):
    ytop = y - h
    # platform top (lighter ledge)
    a(f'<rect x="{cx-w/2-10:.1f}" y="{ytop-6:.1f}" width="{w+20}" height="8" fill="url(#top)"/>')
    a(f'<rect x="{cx-w/2:.1f}" y="{ytop:.1f}" width="{w}" height="{h}" fill="url(#stone)"/>')
    # relief panels
    n = int(w/26)
    for k in range(n):
        px = cx-w/2+6+k*26
        a(f'<rect x="{px:.1f}" y="{ytop+6:.1f}" width="18" height="{h-12}" fill="#4d4943" opacity=".55"/>')
    # cornice
    a(f'<rect x="{cx-w/2-4:.1f}" y="{ytop:.1f}" width="{w+8}" height="4" fill="#a39b8e"/>')
    # small buddha niches on the balustrade
    a(f'<rect x="{cx-w/2-10:.1f}" y="{ytop-14:.1f}" width="{w+20}" height="9" fill="#7d776d"/>')
    for k in range(int((w+20)/14)):
        a(f'<path d="M{cx-w/2-6+k*14:.1f} {ytop-5:.1f} v-5 q3 -5 6 0 v5Z" fill="#3a3630"/>')
    y = ytop - 14

# Central staircase with gates
sw = 90
a(f'<path d="M{cx-sw/2-30} {G} L{cx-sw/2+4} {y} L{cx+sw/2-4} {y} L{cx+sw/2+30} {G}Z" fill="#a69e91" opacity=".92"/>')
for k in range(24):
    yy = G - k*(G-y)/24
    a(f'<line x1="{cx-sw/2-30+k*34/24:.1f}" y1="{yy:.1f}" x2="{cx+sw/2+30-k*34/24:.1f}" y2="{yy:.1f}" stroke="#6b655b" stroke-width="1"/>')
yy = G
for w,h in tiers:
    gy = yy - h
    a(f'<path d="M{cx-22} {gy+h:.1f} v-{h-6} q22 -22 44 0 v{h-6}Z" fill="#2b2824"/>')
    yy = gy - 14

# Circular terraces
circ = [(400,26,16),(330,26,12),(260,26,8)]
for w,h,n in circ:
    ytop = y - h
    a(f'<ellipse cx="{cx}" cy="{ytop+h:.1f}" rx="{w/2+6}" ry="9" fill="#4d4943"/>')
    a(f'<path d="M{cx-w/2} {ytop:.1f} h{w} v{h} a{w/2} 9 0 0 1 -{w} 0Z" fill="url(#stone)"/>')
    a(f'<ellipse cx="{cx}" cy="{ytop:.1f}" rx="{w/2}" ry="9" fill="url(#top)"/>')
    import math
    for k in range(n):
        t = math.pi*(k+.5)/n
        px = cx - math.cos(t)*(w/2-16)
        py = ytop + math.sin(t)*3 + 2
        stupa(px, py+4, .62)
    y = ytop - 2
# Central great stupa
stupa(cx, y+2, 1.9, True)

# trees
def tree(x, s):
    a(f'<rect x="{x-3*s}" y="{G-30*s}" width="{6*s}" height="{30*s}" fill="#4a3320"/>')
    for dx,dy,r in [(0,-42,22),(-14,-30,17),(14,-30,17)]:
        a(f'<circle cx="{x+dx*s}" cy="{G+dy*s}" r="{r*s}" fill="#2f6a2a"/>')
for x in [40,100,170,860,930,975]:
    tree(x, random.uniform(.9,1.4))
a(f'<ellipse cx="{cx}" cy="{G+3}" rx="430" ry="8" fill="#000" opacity=".2"/>')
a(f'<text x="{cx}" y="{H-18}" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#e9f3d8" letter-spacing="6">CANDI BOROBUDUR</text>')
a('</svg>')
open('borobudur.svg','w').write('\n'.join(o))
