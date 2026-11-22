#!/usr/bin/env python3
"""새 홈(src/routes/home-renew.tsx) 제목 서체 S-Core Dream 을 쓰는 글자만 남겨 woff2 로 만든다.
홈에 나오는 문구가 들어 있는 소스 파일의 글자를 모두 모으므로, 문구를 고친 뒤에는 다시 실행한다.
  python3 scripts/subset-home-fonts.py <S-CoreDream-6Bold.woff> <S-CoreDream-8Heavy.woff>
원본: https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-{6Bold,8Heavy}.woff (SIL OFL)
"""
import sys, pathlib
from fontTools import subset
ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ['src/routes/home-renew.tsx', 'src/routes/home.tsx', 'src/data/story.ts', 'src/data/clinic.ts', 'src/data/doctors.ts', 'src/data/treatments.ts', 'src/data/myeongji-cards.ts', 'src/components/Layout.tsx']
chars = set(' 0123456789.,·—–-:;!?()[]/%+~"\'“”‘’…&')
for f in SRC:
    chars |= set((ROOT / f).read_text(encoding='utf-8'))
text = ''.join(sorted(c for c in chars if c.isprintable()))
for src, out in zip(sys.argv[1:3], ['scd-600.woff2', 'scd-800.woff2']):
    opt = subset.Options(); opt.flavor = 'woff2'; opt.layout_features = ['*']; opt.ignore_missing_glyphs = True
    font = subset.load_font(src, opt)
    s = subset.Subsetter(opt); s.populate(text=text); s.subset(font)
    dst = ROOT / 'public/static/fonts' / out
    subset.save_font(font, str(dst), opt)
    print(out, dst.stat().st_size, 'bytes', len(text), 'chars')
