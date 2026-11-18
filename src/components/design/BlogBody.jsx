// Generated from the Claude Design component BlogBody.dc.html; markup and styles kept verbatim.
import { Fragment } from 'preact';
import { DCLogic } from '../../lib/dc.js';

class Logic extends DCLogic {
renderVals() { return { posts: this.props.posts || [] }; }
}

export default class BlogBody extends Logic {
  render() {
    const { posts } = this.renderVals();
    return (
      <Fragment>
<div style="width: 100%; font-family: 'DM Sans', system-ui, sans-serif; color: #2B1A12; background: #F7F0E4; padding: clamp(32px, 6vw, 88px) clamp(20px, 4vw, 40px) clamp(56px, 7vw, 104px); box-sizing: border-box">
<div style="max-width: 1240px; margin: 0 auto; display: flex; flex-direction: column; gap: clamp(32px, 5vw, 56px)">

<header style="display: flex; flex-direction: column; gap: 14px; max-width: 760px">
<span style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #2F6F6A; font-weight: 600">Blogs</span>
<h1 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(42px, 6vw, 76px); letter-spacing: -0.035em; line-height: 1">Coffee Blog CDO</h1>
<p style="margin: 0; font-size: 18px; line-height: 1.6; color: #5A3A28">Catch up on coffee tips, event highlights, and behind-the-scenes stories from CDO’s favorite specialty coffee team.</p>
</header>

{posts.length ? (
<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: clamp(16px, 2vw, 24px)">
{posts.map((p) => (
<article key={p.href} style="background: #FFFBF4; border: 1px solid #E3D5BF; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column">
<a href={p.href} aria-label={p.title} style="aspect-ratio: 16 / 10; background: #E9DCC6; display: block; overflow: hidden">{p.image ? <img src={p.image} alt="" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; display: block" /> : null}</a>
<div style="padding: 18px; display: flex; flex-direction: column; gap: 8px; flex: 1 1 auto">
<div style="display: flex; justify-content: space-between; gap: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #2F6F6A; font-weight: 600"><span>{p.category}</span><span style="color: #5A3A28; font-weight: 500">{p.dateLabel}</span></div>
<h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 22px; line-height: 1.15"><a href={p.href} style="color: #2B1A12; text-decoration: none">{p.title}</a></h2>
<p style="margin: 0; font-size: 15px; color: #5A3A28; line-height: 1.55; flex: 1 1 auto">{p.summary}</p>
<a href={p.href} style="align-self: flex-start; display: inline-flex; align-items: center; min-height: 44px; font-weight: 700; color: #8A4F17">Read more</a>
</div>
</article>
))}
</div>
) : (
<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between; padding: 22px 24px; border-radius: 20px; border: 1.5px dashed #B79C7A; background: #FFFBF4">
<p style="margin: 0; font-size: 16px; color: #5A3A28; max-width: 620px"><strong style="color: #2B1A12">New stories are brewing.</strong> Follow us on Instagram for event highlights and behind-the-scenes moments in the meantime.</p>
<a href="https://www.instagram.com/thecallroombydrcoffee" style="display: inline-flex; align-items: center; min-height: 48px; padding: 0 20px; border-radius: 999px; background: #2B1A12; color: #F7F0E4; font-weight: 700; text-decoration: none">@thecallroombydrcoffee</a>
</div>
)}

</div>
</div>
      </Fragment>
    );
  }
}
