// Generated from the Claude Design component ArticleBody.dc.html; markup and styles kept verbatim.
import { Fragment } from 'preact';
import { DCLogic } from '../../lib/dc.js';

class Logic extends DCLogic {
renderVals() { return this.props; }
}

export default class ArticleBody extends Logic {
  render() {
    const { category, children, dateLabel, image, imageAlt, readTime, summary, title } = this.renderVals();
    return (
      <Fragment>
<article style="width: 100%; font-family: 'DM Sans', system-ui, sans-serif; color: #2B1A12; background: #F7F0E4; padding: clamp(28px, 5vw, 64px) clamp(20px, 4vw, 40px) clamp(56px, 7vw, 96px); box-sizing: border-box">
<div style="max-width: 1240px; margin: 0 auto; display: flex; flex-direction: column; gap: 36px">

<header style="max-width: 760px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 16px">
<nav aria-label="Breadcrumb" style="font-size: 14px; display: flex; gap: 8px"><a href="/blogs" style="color: #8A4F17">Coffee Blog CDO</a><span aria-hidden="true">/</span><span style="color: #5A3A28">{category}</span></nav>
<h1 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(38px, 5.4vw, 64px); letter-spacing: -0.03em; line-height: 1.02">{title}</h1>
<p style="margin: 0; font-size: 20px; line-height: 1.55; color: #5A3A28">{summary}</p>
<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px; font-size: 14px; color: #5A3A28; padding-top: 8px; border-top: 1px solid #E3D5BF">
<img src="/images/logo.webp" alt="" style="width: 40px; height: 40px; border-radius: 999px; display: block; flex: none" />
<span><strong style="color: #2B1A12">The Callroom team</strong> · {dateLabel} · {readTime} min read</span>
</div>
</header>

{image ? <div style="width: 100%; aspect-ratio: 21 / 9; min-height: 200px; border-radius: 28px; background: #E9DCC6; overflow: hidden"><img src={image} alt={imageAlt || ''} style="width: 100%; height: 100%; object-fit: cover; display: block" /></div> : null}

<div style="max-width: 760px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 22px; font-size: 18px; line-height: 1.75; color: #3A261B">
<div class="article-body">{children}</div>
<div style="display: flex; flex-wrap: wrap; gap: 12px; padding-top: 12px">
<a href="/order" style="display: inline-flex; align-items: center; min-height: 52px; padding: 0 24px; border-radius: 999px; background: #2B1A12; color: #F7F0E4; font-weight: 700; font-size: 16px; text-decoration: none">Order Ahead</a>
<a href="/blogs" style="display: inline-flex; align-items: center; min-height: 52px; padding: 0 20px; border-radius: 999px; border: 1.5px solid #D6C3A5; color: #2B1A12; font-weight: 700; font-size: 16px; text-decoration: none">Back to blog</a>
</div>
</div>

</div>
</article>
      </Fragment>
    );
  }
}
