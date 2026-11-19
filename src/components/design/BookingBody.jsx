// Generated from the Claude Design component BookingBody.dc.html; markup and styles kept verbatim.
import { Fragment } from 'preact';
import { DCLogic } from '../../lib/dc.js';
import { sendRequest, remember } from '../../lib/submit.js';
import { CONTACT } from '../../lib/site.js';

const FIELD = 'min-height: 50px; padding: 0 16px; border-radius: 12px; background: #FFFFFF; font-family: inherit; font-size: 16px; color: #2B1A12';
const fs = (bad, h = 50) => `${FIELD.replace('50px', h + 'px')}; border: ${bad ? '2px solid #B5432A' : '1.5px solid #D6C3A5'}`;
const fmtDate = (iso, year = true) => {
if (!iso) return '';
const d = new Date(iso + 'T00:00:00');
return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', ...(year ? { year: 'numeric' } : {}) }).replace(/^(\w+) /, '$1, ');
};
const tomorrow = () => { const d = new Date(Date.now() + 86400000 + 8 * 3600000); return d.toISOString().slice(0, 10); };

class Logic extends DCLogic {
constructor(p) {
super(p);
this.state = { step: 1, session: 'PM', checked: false, pkg: 'full', date: '', type: 'Birthday or debut', guests: '', venue: '', start: '15:00', end: '18:00', theme: '', name: '', phone: '', email: '', errors: {}, sending: false, failed: '' };
}
componentDidMount() {
const want = new URLSearchParams(location.search).get('package');
if (['light', 'full', 'emergency'].includes(want)) this.setState({ pkg: want });
this.setState({ minDate: tomorrow() });
}
validate(step) {
const s = this.state;
const e = {};
if (step === 1 && (!s.date || s.date < tomorrow())) e.date = 'Choose an event date from tomorrow onwards.';
if (step === 3) {
if (!(Number(s.guests) > 0)) e.guests = 'Enter your expected guest count.';
if (!s.venue.trim()) e.venue = 'Tell us the venue and area.';
}
if (step === 4) {
if (!s.name.trim()) e.name = 'Enter your full name.';
if (s.phone.replace(/\D/g, '').length !== 11) e.phone = 'Enter an 11-digit mobile number.';
if (s.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.email)) e.email = 'Enter a valid email.';
}
this.setState({ errors: e });
return !Object.keys(e).length;
}
async submit(pkgName) {
const s = this.state;
const sess = s.session === 'AM' ? 'Morning (AM)' : 'Afternoon / Evening (PM)';
const lines = ['New coffee cart booking request', '', `Date: ${fmtDate(s.date)} · ${sess}`, `Package: ${pkgName}`, `Event type: ${s.type}`, `Guests: ${s.guests}`, `Venue: ${s.venue}`,
`Service: ${s.start} – ${s.end}`, `Theme / notes: ${s.theme || '—'}`, '', `Name: ${s.name}`, `Mobile: ${s.phone}`, `Email: ${s.email || '—'}`];
this.setState({ sending: true, failed: '' });
try {
const via = await sendRequest('booking', `Coffee cart booking · ${fmtDate(s.date)} · ${s.session}`, lines, { booking: { date: s.date, session: s.session, pkg: s.pkg, pkgName, type: s.type, guests: s.guests, venue: s.venue, start: s.start, end: s.end, theme: s.theme, name: s.name, phone: s.phone, email: s.email } });
remember('bookings', { date: s.date, session: s.session, pkg: pkgName, guests: s.guests, venue: s.venue, type: s.type, sentAt: new Date().toISOString() });
this.setState({ sending: false, step: 5, via });
} catch {
this.setState({ sending: false, failed: `We couldn't send your request. Please try again, or call us at ${CONTACT.phone}.` });
}
}
renderVals() {
const s = this.state;
const labels = ['Date', 'Package', 'Event', 'Contact'];
const pill = (sel) => ({ sel: sel ? 'true' : 'false', bg: sel ? '#2B1A12' : '#FFFFFF', fg: sel ? '#F7F0E4' : '#2B1A12', bd: sel ? '#2B1A12' : '#D6C3A5' });
const pk = [
{ id: 'light', name: 'The Light Dose', note: '50 cups · intimate gatherings', price: '₱8,000' },
{ id: 'full', name: 'The Full Prescription', note: '80 cups · mid-sized events', price: '₱12,000' },
{ id: 'emergency', name: 'The Emergency Brew Kit', note: '120 cups · large parties', price: '₱18,000' },
{ id: 'unsure', name: 'Not sure yet', note: 'Send me a recommendation with my quote', price: '' }
];
let nextLabel = 'Continue';
if (s.step === 1 && !s.checked) nextLabel = 'Check Availability';
if (s.step === 4) nextLabel = s.sending ? 'Sending…' : 'Send booking request';
const sess = { AM: 'Morning (AM)', PM: 'Afternoon / Evening (PM)' };
const e = s.errors;
const pkgName = pk.find((p) => p.id === s.pkg).name;
const set = (k, extra = {}) => (ev) => this.setState({ [k]: ev.currentTarget.value, errors: { ...s.errors, [k]: undefined }, ...extra });
return {
stepLabel: s.step > 4 ? 'Sent' : 'Step ' + s.step + ' of 4',
steps: labels.map((l, i) => ({ label: l, bar: i + 1 <= s.step ? '#2F6F6A' : '#E3D5BF', fg: i + 1 === s.step ? '#2B1A12' : '#5A3A28' })),
s1: s.step === 1, s2: s.step === 2, s3: s.step === 3, s4: s.step === 4, done: s.step === 5, showNav: s.step < 5,
sessions: [{ id: 'AM', label: 'Morning (AM)', note: 'AM' }, { id: 'PM', label: 'Afternoon / Evening (PM)', note: 'PM' }].map((o) => ({ ...pill(o.id === s.session), ...o, pick: () => this.setState({ session: o.id, checked: false }) })),
checked: s.checked, sessionLabel: sess[s.session], sessionShort: s.session,
pkgs: pk.map((p) => { const sel = p.id === s.pkg; return { ...p, sel: sel ? 'true' : 'false', bg: sel ? '#F1E3CC' : '#FFFFFF', bd: sel ? '#2B1A12' : '#D6C3A5', pick: () => this.setState({ pkg: p.id }) }; }),
pkgName,
v: s, e, minDate: s.minDate,
onDate: set('date', { checked: false }), onType: set('type'), onGuests: set('guests'), onVenue: set('venue'), onStart: set('start'), onEnd: set('end'), onTheme: set('theme'), onName: set('name'), onPhone: set('phone'), onEmail: set('email'),
st: { date: fs(e.date, 52), guests: fs(e.guests), venue: fs(e.venue), name: fs(e.name), phone: fs(e.phone), email: fs(e.email), plain: fs(false) },
dateLong: fmtDate(s.date), dateShort: fmtDate(s.date, false), via: s.via, failed: s.failed,
canBack: s.step > 1, noBack: s.step === 1,
nextLabel, nextBg: s.step === 4 ? '#E0A458' : '#2B1A12', nextFg: s.step === 4 ? '#2B1A12' : '#F7F0E4',
next: () => {
if (s.sending || !this.validate(s.step)) return;
if (s.step === 1 && !s.checked) this.setState({ checked: true });
else if (s.step === 4) this.submit(pkgName);
else this.setState({ step: s.step + 1 });
},
back: () => this.setState({ step: Math.max(1, s.step - 1), errors: {} })
};
}
}

export default class BookingBody extends Logic {
  render() {
    const { back, canBack, checked, dateLong, dateShort, done, e, failed, minDate, next, nextBg, nextFg, nextLabel, noBack, onDate, onEmail, onEnd, onGuests, onName, onPhone, onStart, onTheme, onType, onVenue, pkgName, pkgs, s1, s2, s3, s4, sessionLabel, sessionShort, sessions, showNav, st, stepLabel, steps, v, via } = this.renderVals();
    return (
      <Fragment>
<div style="width: 100%; font-family: 'DM Sans', system-ui, sans-serif; color: #2B1A12; background: #F7F0E4; padding: clamp(28px, 5vw, 72px) clamp(20px, 4vw, 40px) clamp(56px, 7vw, 96px); box-sizing: border-box">
<div style="max-width: 1240px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: clamp(28px, 4vw, 56px); align-items: flex-start">

<div style="flex: 1 1 360px; min-width: 0; display: flex; flex-direction: column; gap: 18px">
<nav aria-label="Breadcrumb" style="font-size: 14px; display: flex; gap: 8px"><a href="/coffee-cart-events" style="color: #8A4F17">Coffee Cart &amp; Events</a><span aria-hidden="true">/</span><span style="color: #5A3A28">Book</span></nav>
<span style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #2F6F6A; font-weight: 600">Coffee cart booking</span>
<h1 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(40px, 5.4vw, 68px); letter-spacing: -0.035em; line-height: 1">Let's Brew Something Special Together!</h1>
<p style="margin: 0; font-size: 17px; line-height: 1.65; color: #5A3A28">Great celebrations deserve great coffee! Bring the Dr. Coffee experience to your next event with freshly brewed Arabica coffee, professional baristas, and a coffee cart your guests will love.</p>
<p style="margin: 0; font-size: 17px; line-height: 1.65; color: #5A3A28">Whether it's a wedding, birthday, corporate event, or private gathering, we're ready to serve your daily dose of happiness.</p>
<p style="margin: 0; font-size: 17px; line-height: 1.65; color: #2B1A12; font-style: italic">Your perfect coffee experience starts here. Fill out the form to book!</p>
<div style="border-radius: 22px; overflow: hidden; aspect-ratio: 4 / 3; background: #E2D1B6; margin-top: 6px"><img src="/images/team-at-cart.webp" alt="The Dr. Coffee cart team at an outdoor event" style="width: 100%; height: 100%; object-fit: cover; object-position: center 35%; display: block" /></div>
<div style="display: flex; flex-direction: column; gap: 10px; padding: 18px 20px; border-radius: 18px; border: 1.5px dashed #B79C7A; background: #FFFBF4">
<span style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #2F6F6A; font-weight: 600">What happens next</span>
<span style="font-size: 15px; line-height: 1.5"><strong>We send a quote</strong> with recommended packages and a draft menu.</span>
<span style="font-size: 15px; line-height: 1.5"><strong>We finalise your menu</strong> and design your menu board and cup labels.</span>
<span style="font-size: 15px; line-height: 1.5"><strong>We arrive early</strong>, set up, and serve. You don't lift a thing.</span>
</div>
<p style="margin: 0; font-size: 14px; color: #5A3A28">Prefer to talk? Call <a href="tel:09327233849" style="color: #8A4F17; font-weight: 700">0932 723 3849</a> or <a href="https://www.facebook.com/share/19KisJPYkX/" style="color: #8A4F17; font-weight: 700">message us on Messenger</a>.</p>
</div>

<div style="flex: 1.2 1 480px; min-width: 0; background: #FFFBF4; border: 1px solid #E3D5BF; border-radius: 28px; overflow: hidden">
<div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 24px; background: #2B1A12; color: #F7F0E4; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase"><span>Book our coffee cart</span><span>{stepLabel}</span></div>
<ol aria-label="Booking steps" style="list-style: none; margin: 0; padding: 18px 24px 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px">
{(steps).map((s, _i0) => (<Fragment key={_i0}>
<li style="display: flex; flex-direction: column; gap: 6px"><span style={`height: 6px; border-radius: 999px; background: ${s.bar}`}></span><span style={`font-size: 13px; font-weight: 700; color: ${s.fg}`}>{s.label}</span></li>
</Fragment>))}
</ol>

<div style="padding: clamp(20px, 3vw, 32px) 24px; display: flex; flex-direction: column; gap: 22px">

{(s1) ? (<Fragment>
<div style="display: flex; flex-direction: column; gap: 20px">
<div style="display: flex; flex-direction: column; gap: 8px"><label for="bk-date" style="font-weight: 700; font-size: 15px">Event date</label><input id="bk-date" type="date" required min={minDate} value={v.date} onInput={onDate} aria-invalid={e.date ? 'true' : undefined} aria-describedby={e.date ? 'bk-date-err' : undefined} style={st.date} />{e.date ? <span id="bk-date-err" style="font-size: 13px; color: #9A3520; font-weight: 600">{e.date}</span> : null}</div>
<fieldset style="border: none; margin: 0; padding: 0"><legend style="font-weight: 700; font-size: 15px; margin-bottom: 10px">Morning or afternoon/evening?</legend>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px">
{(sessions).map((o, _i0) => (<Fragment key={_i0}>
<button type="button" aria-pressed={o.sel} onClick={o.pick} style={`min-height: 64px; border-radius: 16px; border: 2px solid ${o.bd}; background: ${o.bg}; color: ${o.fg}; font-family: inherit; font-weight: 700; font-size: 16px; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px`}><span>{o.label}</span><span style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 500; opacity: 0.8">{o.note}</span></button>
</Fragment>))}
</div>
</fieldset>
{(checked) ? (<Fragment>
<div role="status" style="display: flex; gap: 12px; align-items: center; padding: 14px 16px; border-radius: 14px; background: #DCEBE8; color: #1F4F4B; font-size: 15px"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: none"><path d="M5 12.5l4.5 4.5L19 7" /></svg><span><strong>Date noted.</strong> {dateLong} · {sessionLabel}. We confirm the cart is free with your quote. Continue to send your request.</span></div>
</Fragment>) : null}
</div>
</Fragment>) : null}

{(s2) ? (<Fragment>
<fieldset style="border: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px">
<legend style="font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 24px; margin-bottom: 4px">Choose a package</legend>
{(pkgs).map((p, _i0) => (<Fragment key={_i0}>
<button type="button" aria-pressed={p.sel} onClick={p.pick} style={`width: 100%; min-height: 76px; padding: 14px 18px; border-radius: 16px; border: 2px solid ${p.bd}; background: ${p.bg}; color: #2B1A12; font-family: inherit; text-align: left; display: flex; justify-content: space-between; align-items: center; gap: 12px; cursor: pointer`}>
<span style="display: flex; flex-direction: column; gap: 3px"><span style="font-weight: 800; font-size: 17px">{p.name}</span><span style="font-size: 13px; color: #5A3A28">{p.note}</span></span>
<span style="font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 17px; white-space: nowrap">{p.price}</span>
</button>
</Fragment>))}
<a href="/coffee-cart-events#packages" style="align-self: flex-start; font-weight: 700; font-size: 14px; color: #8A4F17; min-height: 40px; display: inline-flex; align-items: center">Compare what's in each package</a>
</fieldset>
</Fragment>) : null}

{(s3) ? (<Fragment>
<div style="display: flex; flex-direction: column; gap: 16px">
<h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 24px">About your event</h2>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px">
<div style="display: flex; flex-direction: column; gap: 8px"><label for="bk-type" style="font-weight: 700; font-size: 14px">Event type</label><select id="bk-type" value={v.type} onChange={onType} style="min-height: 50px; padding: 0 14px; border-radius: 12px; border: 1.5px solid #D6C3A5; background: #FFFFFF; font-family: inherit; font-size: 16px; color: #2B1A12"><option>Birthday or debut</option><option>Wedding</option><option>Hospital or clinic event</option><option>Corporate or office</option><option>Christening or reunion</option><option>Other</option></select></div>
<div style="display: flex; flex-direction: column; gap: 8px"><label for="bk-guests" style="font-weight: 700; font-size: 14px">Guest count</label><input id="bk-guests" type="number" min="1" inputmode="numeric" required placeholder="80" value={v.guests} onInput={onGuests} aria-invalid={e.guests ? 'true' : undefined} aria-describedby={e.guests ? 'bk-guests-err' : undefined} style={st.guests} />{e.guests ? <span id="bk-guests-err" style="font-size: 13px; color: #9A3520; font-weight: 600">{e.guests}</span> : null}</div>
<div style="display: flex; flex-direction: column; gap: 8px; grid-column: 1 / -1"><label for="bk-venue" style="font-weight: 700; font-size: 14px">Venue</label><input id="bk-venue" type="text" required placeholder="Venue name and area in CDO" value={v.venue} onInput={onVenue} aria-invalid={e.venue ? 'true' : undefined} aria-describedby={e.venue ? 'bk-venue-err' : undefined} style={st.venue} />{e.venue ? <span id="bk-venue-err" style="font-size: 13px; color: #9A3520; font-weight: 600">{e.venue}</span> : null}</div>
<div style="display: flex; flex-direction: column; gap: 8px"><label for="bk-start" style="font-weight: 700; font-size: 14px">Service starts</label><input id="bk-start" type="time" value={v.start} onInput={onStart} style={st.plain} /></div>
<div style="display: flex; flex-direction: column; gap: 8px"><label for="bk-end" style="font-weight: 700; font-size: 14px">Service ends</label><input id="bk-end" type="time" value={v.end} onInput={onEnd} style={st.plain} /></div>
<div style="display: flex; flex-direction: column; gap: 8px; grid-column: 1 / -1"><label for="bk-theme" style="font-weight: 700; font-size: 14px">Theme or notes <span style="font-weight: 500; color: #5A3A28">(for your menu board and cup labels)</span></label><textarea id="bk-theme" rows="3" placeholder="Names, colours, hashtag, drinks you'd like" style="padding: 14px 16px; border-radius: 12px; border: 1.5px solid #D6C3A5; background: #FFFFFF; font-family: inherit; font-size: 16px; resize: vertical" value={v.theme} onInput={onTheme} /></div>
</div>
</div>
</Fragment>) : null}

{(s4) ? (<Fragment>
<div style="display: flex; flex-direction: column; gap: 16px">
<h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 24px">Your contact details</h2>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px">
<div style="display: flex; flex-direction: column; gap: 8px; grid-column: 1 / -1"><label for="bk-name" style="font-weight: 700; font-size: 14px">Full name</label><input id="bk-name" type="text" autocomplete="name" required value={v.name} onInput={onName} aria-invalid={e.name ? 'true' : undefined} aria-describedby={e.name ? 'bk-name-err' : undefined} style={st.name} />{e.name ? <span id="bk-name-err" style="font-size: 13px; color: #9A3520; font-weight: 600">{e.name}</span> : null}</div>
<div style="display: flex; flex-direction: column; gap: 8px"><label for="bk-phone" style="font-weight: 700; font-size: 14px">Mobile number</label><input id="bk-phone" type="tel" autocomplete="tel" inputmode="tel" required value={v.phone} onInput={onPhone} aria-invalid={e.phone ? 'true' : undefined} aria-describedby={e.phone ? 'bk-phone-err' : undefined} style={st.phone} />{e.phone ? <span id="bk-phone-err" style="font-size: 13px; color: #9A3520; font-weight: 600">{e.phone}</span> : null}</div>
<div style="display: flex; flex-direction: column; gap: 8px"><label for="bk-email" style="font-weight: 700; font-size: 14px">Email</label><input id="bk-email" type="email" autocomplete="email" value={v.email} onInput={onEmail} aria-invalid={e.email ? 'true' : undefined} aria-describedby={e.email ? 'bk-email-err' : undefined} style={st.email} />{e.email ? <span id="bk-email-err" style="font-size: 13px; color: #9A3520; font-weight: 600">{e.email}</span> : null}</div>
</div>
<div style="padding: 16px 18px; border-radius: 16px; background: #F7F0E4; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; font-size: 14px">
<div style="display: flex; flex-direction: column; gap: 2px"><span style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #5A3A28">Date</span><strong>{dateShort} · {sessionShort}</strong></div>
<div style="display: flex; flex-direction: column; gap: 2px"><span style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #5A3A28">Package</span><strong>{pkgName}</strong></div>
<div style="display: flex; flex-direction: column; gap: 2px"><span style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #5A3A28">Guests</span><strong>{v.guests}</strong></div>
</div>
</div>
</Fragment>) : null}

{(done) ? (<Fragment>
<div style="display: flex; flex-direction: column; align-items: flex-start; gap: 14px; padding: 8px 0">
<span style="width: 56px; height: 56px; border-radius: 999px; background: #2F6F6A; color: #FFFFFF; display: flex; align-items: center; justify-content: center"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" /></svg></span>
<h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 30px; letter-spacing: -0.02em">Booking request sent</h2>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #5A3A28">{via === 'email' ? 'Your email app has opened with your request: press send so it reaches us. ' : 'Thank you! '}We'll send your quote with recommended packages and a draft menu. Your requested date: <strong style="color: #2B1A12">{dateLong} · {sessionShort}</strong>.</p>
<div style="display: flex; flex-wrap: wrap; gap: 10px"><a href="/coffee-cart-events" style="display: inline-flex; align-items: center; min-height: 48px; padding: 0 20px; border-radius: 999px; background: #2B1A12; color: #F7F0E4; font-weight: 700; text-decoration: none">Back to Coffee Cart</a><a href="/account" style="display: inline-flex; align-items: center; min-height: 48px; padding: 0 20px; border-radius: 999px; border: 1.5px solid #2B1A12; color: #2B1A12; font-weight: 700; text-decoration: none">View in my account</a></div>
</div>
</Fragment>) : null}

{failed ? (<p role="alert" style="margin: 0; padding: 12px 16px; border-radius: 14px; background: #F3DCD3; color: #7A2E1C; font-size: 15px; font-weight: 600">{failed}</p>) : null}
{(showNav) ? (<Fragment>
<div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; align-items: center; padding-top: 18px; border-top: 1px solid #E3D5BF">
{(canBack) ? (<Fragment><button type="button" onClick={back} style="min-height: 52px; padding: 0 22px; border-radius: 999px; border: 1.5px solid #2B1A12; background: transparent; color: #2B1A12; font-family: inherit; font-weight: 700; font-size: 16px; cursor: pointer">Back</button></Fragment>) : null}
{(noBack) ? (<Fragment><span></span></Fragment>) : null}
<button type="button" onClick={next} style={`min-height: 54px; padding: 0 28px; border-radius: 999px; border: none; background: ${nextBg}; color: ${nextFg}; font-family: inherit; font-weight: 800; font-size: 16px; cursor: pointer`}>{nextLabel}</button>
</div>
</Fragment>) : null}

</div>
</div>

</div>
</div>
      </Fragment>
    );
  }
}
