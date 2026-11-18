// Generated from the Claude Design component FaqBody.dc.html; markup and styles kept verbatim.
import { Fragment } from 'preact';
import { DCLogic } from '../../lib/dc.js';

class Logic extends DCLogic {
renderVals() {
const old = [
{ no: '01', title: 'Visiting', items: [
{ q: 'Where exactly are you located?', a: 'We’re on the 2nd floor of Madonna Hospital along JV Serina Street in Cagayan de Oro (CDO). Head up from the main lobby — you’ll smell us before you see us.' },
{ q: 'Are you open now? What are your hours?', a: 'We’re open Monday to Saturday, 6:00 AM to 6:00 PM, and closed on Sundays. That makes us one of the earliest coffee shops open in CDO.' },
{ q: 'Do I need to be a patient or hospital staff to buy coffee?', a: 'Not at all. We’re open to everyone — walk in whether you’re visiting, working nearby, or just passing through.' },
{ q: 'Do you have seating?', a: 'Yes, there’s seating at the shop. It’s a small space, so during shift changes it fills quickly.' }
] },
{ no: '02', title: 'Drinks & ordering', items: [
{ q: 'What kind of coffee do you use?', a: '100% Arabica, brewed fresh for every order. Nothing pre-brewed and nothing powdered.' },
{ q: 'What types of drinks do you offer?', a: 'We serve a wide variety of handcrafted beverages, including: Espresso & Basic Coffee: Freshly brewed Arabica coffee, Spanish Stimu-Latte, White Coat Mocha, Salted Caramel Drip, and classic brews. Milk Series: Caramel, Strawberry, and Chocolate Milk options. Fruit Soda & Yakult Series: Green Apple & Lychee Yakult, Blue Soda, and Strawberry Soda. Tea Series: Refreshing brewed teas.' },
{ q: 'Do you have drinks for people who don’t drink coffee?', a: 'Plenty. Our Milk Series, Soda Series and Yakult Series are all coffee-free, and the Chocolate Therapy is a favourite with kids.' },
{ q: 'Can I order ahead for pickup?', a: 'Yes, message us on Facebook or call 0932 723 3849 and we’ll have it ready. Calling is faster for same-day orders.' },
{ q: 'Do you take bulk or office orders?', a: 'We do. Tell us how many cups, what time and where in the building, and we’ll sort it out. For larger volumes, give us a day’s notice.' }
] },
{ no: '03', title: 'Coffee Cart', items: [
{ q: 'How do I book the mobile coffee cart?', a: 'Message us with your date, venue, guest count and service hours, and we’ll send a quote with a draft menu. See our Coffee Cart & Events page.' },
{ q: 'What locations do you cater to?', a: 'Our mobile coffee cart travels anywhere across Cagayan de Oro City and surrounding local areas for private parties, weddings, corporate functions, and hospital events.' },
{ q: 'How far will the coffee cart travel?', a: 'We serve events across Cagayan de Oro. For venues outside the city, message us — travel arrangements are handled case by case.' },
{ q: 'What event packages do you offer?', a: 'We offer three flexible catering packages: The Light Dose (₱8,000): Great for intimate gatherings and smaller events. The Full Prescription (₱12,000): Ideal for mid-sized celebrations and corporate events. The Emergency Brew Kit (₱18,000): Full-service coffee response for large parties and long event windows.' },
{ q: 'What is included in every coffee cart hire?', a: 'A fully set-up mobile coffee cart with our branded façade. Trained baristas on duty for your full service window. A customized menu board tailored to your event theme. All serving supplies (cups, lids, straws, and napkins). Complete setup and teardown handled entirely by our team.' }
] }
];
const faqs = [
{ q: 'Where is The Callroom located?', a: 'We are located on the 2nd Floor of Madonna Hospital along JV Serina Street, Cagayan de Oro City, Misamis Oriental.' },
{ q: 'What are your operating hours?', a: '', list: [{ k: 'Monday – Saturday:', v: '6:00 AM – 6:00 PM (18:00)' }, { k: 'Sunday:', v: 'Closed' }] },
{ q: 'What types of drinks do you offer?', a: 'We serve a wide variety of handcrafted beverages, including:', list: [
{ k: 'Espresso & Basic Coffee:', v: 'Freshly brewed Arabica coffee, Spanish Stimu-Latte, White Coat Mocha, Salted Caramel Drip, and classic brews.' },
{ k: 'Milk Series:', v: 'Caramel, Strawberry, and Chocolate Milk options.' },
{ k: 'Fruit Soda & Yakult Series:', v: 'Green Apple & Lychee Yakult, Blue Soda, and Strawberry Soda.' },
{ k: 'Tea Series:', v: 'Refreshing brewed teas.' }] },
{ q: 'What locations do you cater to?', a: 'Our mobile coffee cart travels anywhere across Cagayan de Oro City and surrounding local areas for private parties, weddings, corporate functions, and hospital events.' },
{ q: 'What event packages do you offer?', a: 'We offer three flexible catering packages:', list: [
{ k: 'The Light Dose (₱8,000):', v: 'Great for intimate gatherings and smaller events.' },
{ k: 'The Full Prescription (₱12,000):', v: 'Ideal for mid-sized celebrations and corporate events.' },
{ k: 'The Emergency Brew Kit (₱18,000):', v: 'Full-service coffee response for large parties and long event windows.' }] },
{ q: 'What is included in every coffee cart hire?', a: '', list: [
{ k: '', v: 'A fully set-up mobile coffee cart with our branded façade.' },
{ k: '', v: 'Trained baristas on duty for your full service window.' },
{ k: '', v: 'A customized menu board tailored to your event theme.' },
{ k: '', v: 'All serving supplies (cups, lids, straws, and napkins).' },
{ k: '', v: 'Complete setup and teardown handled entirely by our team.' }] }
];
return { faqs: faqs.map((f, i) => ({ ...f, list: f.list || [], hasList: !!f.list, open: i === 0 })) };
}
}

export default class FaqBody extends Logic {
  render() {
    const { faqs } = this.renderVals();
    return (
      <Fragment>
<div style="width: 100%; font-family: 'DM Sans', system-ui, sans-serif; color: #2B1A12; background: #F7F0E4; padding: clamp(28px, 5vw, 64px) clamp(20px, 4vw, 40px) clamp(56px, 7vw, 96px); box-sizing: border-box">
<div style="max-width: 1240px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: clamp(28px, 5vw, 64px); align-items: flex-start">

<div style="flex: 1 1 300px; min-width: 0; display: flex; flex-direction: column; gap: 16px">
<span style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #2F6F6A; font-weight: 600">Frequently Asked Questions</span>
<h1 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(40px, 5.5vw, 68px); letter-spacing: -0.03em; line-height: 1">Coffee Shop FAQ in CDO</h1>
<p style="margin: 0; font-size: 17px; color: #5A3A28; line-height: 1.6">We opened inside Madonna Hospital for a simple reason: the people here rarely get a real break. A good cup, made quickly and made right, is the least we can do.</p>
<a href="https://www.facebook.com/share/19KisJPYkX/" style="align-self: flex-start; display: inline-flex; align-items: center; gap: 10px; min-height: 52px; padding: 0 22px; border-radius: 999px; background: #2F6F6A; color: #FFFFFF; font-weight: 700; text-decoration: none; margin-top: 8px">Message us</a>
</div>

<div style="flex: 999 1 560px; min-width: 0; display: flex; flex-direction: column; gap: 32px">
<section style="display: flex; flex-direction: column; gap: 12px">
<h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 28px; letter-spacing: -0.02em">Frequently Asked Question</h2>
{(faqs).map((f, _i0) => (<Fragment key={_i0}>
<details open={f.open} style="background: #FFFBF4; border: 1px solid #E3D5BF; border-radius: 16px; padding: 0 20px">
<summary style="min-height: 60px; display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer; font-weight: 700; font-size: 17px; list-style: none">{f.q}<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: none"><path d="M6 9l6 6 6-6" /></svg></summary>
<div style="padding: 0 0 18px; display: flex; flex-direction: column; gap: 10px; font-size: 15px; line-height: 1.6; color: #5A3A28">
{(f.a) ? (<Fragment><p style="margin: 0">{f.a}</p></Fragment>) : null}
{(f.hasList) ? (<Fragment><ul style="margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px">{(f.list).map((li, _i1) => (<Fragment key={_i1}><li>{(li.k) ? (<Fragment><strong style="color: #2B1A12">{li.k}</strong> </Fragment>) : null}{li.v}</li></Fragment>))}</ul></Fragment>) : null}
</div>
</details>
</Fragment>))}
</section>
<section style="background: #2F6F6A; color: #FFFFFF; border-radius: 24px; padding: clamp(24px, 4vw, 40px); display: flex; flex-wrap: wrap; gap: 20px; align-items: center; justify-content: space-between">
<div style="flex: 1 1 340px; min-width: 0; display: flex; flex-direction: column; gap: 10px">
<h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(26px, 3vw, 36px); letter-spacing: -0.02em; line-height: 1.1">We Travel Across Cagayan de Oro, Too</h2>
<p style="margin: 0; font-size: 16px; line-height: 1.6; color: #E6F2EF">Our mobile coffee cart takes the same beans and the same baristas out to birthdays, weddings, debuts, hospital events and corporate launches across CDO — cart, team, custom menu and branded cups included.</p>
</div>
<a href="/coffee-cart-events-booking-now" style="display: inline-flex; align-items: center; min-height: 52px; padding: 0 24px; border-radius: 999px; background: #F7F0E4; color: #2B1A12; font-weight: 700; text-decoration: none">Book Our Coffee Cart</a>
</section>
</div>

</div>
</div>
      </Fragment>
    );
  }
}
