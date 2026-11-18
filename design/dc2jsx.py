"""Convert Claude Design .dc.html components into Preact JSX class components.

Keeps markup, inline styles, copy and data verbatim; only rewrites template syntax:
  {{expr}}                -> {expr}
  <sc-for list as>        -> {list.map((as, i) => <Fragment>..</Fragment>)}
  <sc-if value>           -> {value ? <Fragment>..</Fragment> : null}
  onClick="{{fn}}"        -> onClick={fn}
plus design-canvas links -> site routes and ../assets/images -> /images.
"""
import html
import json
import re
import sys
from pathlib import Path

SRC, OUT, IMAGE_MAP = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])

ROUTES = {
    'Home': '/', 'OurMenu': '/menu', 'Menu': '/order', 'Product': '/products/caramel-milk-therapy',
    'Cart': '/cart', 'Checkout': '/checkout', 'Confirmation': '/order/confirmed',
    'Events': '/coffee-cart-events', 'Booking': '/coffee-cart-events-booking-now',
    'About': '/about-us', 'Visit': '/visit-us', 'Faq': '/faq', 'Blog': '/blogs',
    'Article': '/blogs/article', 'Account': '/account', 'NotFound': '/404',
}
blob_map = {k.split('/')[-1]: '/' + v.replace('assets/', '') for k, v in json.loads(IMAGE_MAP.read_text()).items()}
blob_map['8c74563e19f1394dad1839d4eb315ad7'] = '/images/celebration-menu.webp'

VOID = {'img', 'input', 'br', 'hr', 'meta', 'link', 'source', 'col', 'area', 'wbr'}
EXPR = re.compile(r'\{\{\s*(.*?)\s*\}\}')
TOKEN = re.compile(r'<!--.*?-->|</([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:\s+[^\s=/>]+(?:\s*=\s*(?:"[^"]*"|\'[^\']*\'|[^\s>]+))?)*)\s*(/?)>', re.S)
ATTR = re.compile(r'([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|([^\s>]+)))?')
JS_WORDS = {'true', 'false', 'null', 'undefined'}


def map_href(v):
    m = re.fullmatch(r'([A-Za-z]+?)(?:-Mobile)?\.dc\.html(#.*)?', v)
    if m:
        return ROUTES[m.group(1)] + (m.group(2) or '')
    return v


def fix_paths(s):
    s = s.replace('../assets/images/', '/images/')
    return s


def attr_value(name, raw):
    raw = fix_paths(raw)
    if name == 'href':
        raw = map_href(raw)
    exprs = EXPR.findall(raw)
    if not exprs:
        return '"' + raw.replace('"', '&quot;') + '"'
    if EXPR.fullmatch(raw.strip()):
        return '{' + exprs[0] + '}'
    parts = EXPR.split(html.unescape(raw))
    out = ''
    for i, p in enumerate(parts):
        out += ('${' + p + '}') if i % 2 else p.replace('`', '\\`').replace('${', '\\${')
    return '{`' + out + '`}'


def convert_attrs(tag, raw):
    out = []
    for m in ATTR.finditer(raw):
        name = m.group(1)
        val = next((g for g in m.group(2, 3, 4) if g is not None), None)
        if name.startswith('hint-'):
            continue
        if tag in ('input',) and name == 'value':
            name = 'defaultValue'
        if tag == 'input' and name == 'checked':
            name = 'defaultChecked'
        if val is None:
            out.append(f'{name}={{true}}')
        else:
            out.append(f'{name}={attr_value(name, val)}')
    return (' ' + ' '.join(out)) if out else ''


def text_jsx(t):
    t = fix_paths(t)
    parts = EXPR.split(t)
    out = ''
    for i, p in enumerate(parts):
        if i % 2:
            out += '{' + p + '}'
        elif re.search(r'[{}<>]', p):
            out += '{' + json.dumps(html.unescape(p), ensure_ascii=False) + '}'
        else:
            out += p
    return out


def roots(expr):
    names = set()
    for m in re.finditer(r'(?<![\w.$\'"])([A-Za-z_$][\w$]*)', expr):
        if m.group(1) not in JS_WORDS:
            names.add(m.group(1))
    return names


def convert_template(src):
    out, pos, stack, used, depth = [], 0, [], set(), 0
    loop_vars = []

    def note(expr):
        for n in roots(expr):
            if not any(n in lv for lv in loop_vars):
                used.add(n)

    for m in TOKEN.finditer(src):
        out.append(text_jsx(src[pos:m.start()]))
        for e in EXPR.findall(src[pos:m.start()]):
            note(e)
        pos = m.end()
        tok = m.group(0)
        if tok.startswith('<!--'):
            continue
        close, tag, attrs, selfclose = m.group(1), m.group(2), m.group(3) or '', m.group(4)
        if close:
            top = stack.pop()
            assert top[0] == close, (top, close)
            if close == 'sc-for':
                loop_vars.pop()
                out.append('</Fragment>))}')
            elif close == 'sc-if':
                out.append('</Fragment>) : null}')
            elif close == 'textarea':
                pass
            else:
                out.append(f'</{close}>')
            continue
        for e in EXPR.findall(attrs):
            note(e)
        if tag == 'sc-for':
            a = dict((x.group(1), next(g for g in x.group(2, 3, 4) if g is not None)) for x in ATTR.finditer(attrs) if x.group(2) or x.group(3) or x.group(4))
            lst = EXPR.fullmatch(a['list']).group(1)
            var, idx = a['as'], f'_i{len(loop_vars)}'
            note(lst)
            loop_vars.append({var, idx})
            stack.append((tag,))
            out.append(f'{{({lst}).map(({var}, {idx}) => (<Fragment key={{{idx}}}>')
        elif tag == 'sc-if':
            a = dict((x.group(1), next(g for g in x.group(2, 3, 4) if g is not None)) for x in ATTR.finditer(attrs) if x.group(2) or x.group(3) or x.group(4))
            cond = EXPR.fullmatch(a['value']).group(1)
            note(cond)
            stack.append((tag,))
            out.append(f'{{({cond}) ? (<Fragment>')
        elif tag == 'textarea':
            end = src.index('</textarea>', pos)
            content = src[pos:end]
            pos = end
            out.append(f'<textarea{convert_attrs(tag, attrs)} defaultValue={json.dumps(html.unescape(content), ensure_ascii=False)} />')
            stack.append((tag,))
        elif tag in VOID or selfclose:
            out.append(f'<{tag}{convert_attrs(tag, attrs)} />')
        else:
            stack.append((tag,))
            out.append(f'<{tag}{convert_attrs(tag, attrs)}>')
    out.append(text_jsx(src[pos:]))
    assert not stack, stack
    return ''.join(out), used


def convert_file(path):
    s = path.read_text()
    body = s[s.index('<x-dc>') + 6:s.index('</x-dc>')]
    body = re.sub(r'<helmet>.*?</helmet>', '', body, flags=re.S).strip()
    script = re.search(r'<script type="text/x-dc"[^>]*>(.*?)</script>', s, re.S).group(1).strip()
    script = script.replace('class Component extends DCLogic', 'class Logic extends DCLogic', 1)
    script = fix_paths(script)
    script = re.sub(r"\s*const B = '/_blob/';", '', script)
    script = re.sub(r"B \+ '([0-9a-f]{32})'", lambda m: repr(blob_map[m.group(1)]), script)
    script = re.sub(r"'([A-Za-z]+?)(?:-Mobile)?\.dc\.html'", lambda m: repr(ROUTES[m.group(1)]), script)
    script = re.sub(r"p \+ '-Mobile\.dc\.html'", 'ROUTE_KEYS[p]', script)
    jsx, used = convert_template(body)
    name = path.name.replace('.dc.html', '').replace('-', '')
    destructure = f'    const {{ {", ".join(sorted(used))} }} = this.renderVals();\n' if used else ''
    return f"""// Generated from the Claude Design component {path.name}; markup and styles kept verbatim.
import {{ Fragment }} from 'preact';
import {{ DCLogic }} from '../../lib/dc.js';

{script}

export default class {name} extends Logic {{
  render() {{
{destructure}    return (
      <Fragment>
{jsx}
      </Fragment>
    );
  }}
}}
"""


OUT.mkdir(parents=True, exist_ok=True)
for f in sorted(SRC.glob('*.dc.html')):
    if f.name.startswith('Main') or re.search(r'^(?!.*Body)(?!Site|Mobile|Bottom|Cart)', f.name) and 'Body' not in f.name and f.name not in ('SiteHeader.dc.html', 'SiteFooter.dc.html', 'MobileHeader.dc.html', 'BottomNav.dc.html', 'CartDrawer.dc.html'):
        continue
    target = OUT / (f.name.replace('.dc.html', '').replace('-', '') + '.jsx')
    target.write_text(convert_file(f))
    print('wrote', target.name)
