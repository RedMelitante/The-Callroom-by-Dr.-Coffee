// Site-wide details and routes.
export const ROUTES = {
  Home: '/',
  OurMenu: '/menu',
  Menu: '/order',
  Cart: '/cart',
  Checkout: '/checkout',
  Confirmation: '/order/confirmed',
  Events: '/coffee-cart-events',
  Booking: '/coffee-cart-events-booking-now',
  About: '/about-us',
  Visit: '/visit-us',
  Faq: '/faq',
  Blog: '/blogs',
  Account: '/account',
};

export const CONTACT = {
  phone: '0932 723 3849',
  tel: 'tel:09327233849',
  email: 'thecallroombydc@gmail.com',
  instagram: 'https://www.instagram.com/thecallroombydrcoffee',
  facebook: 'https://www.facebook.com/share/19KisJPYkX/',
};

// What is next to the kiosk, for the Visit Us directions. Leave empty until confirmed.
export const KIOSK_LANDMARK = '';

// Extra addresses that get a copy (CC) of every order and coffee cart booking request.
// Requests always go to CONTACT.email; the public contact email on the site doesn't change.
export const REQUESTS_CC = ['redmelitante@digitalservicesmaster.com'];

// Optional form endpoint (e.g. Formspree, Make, Google Apps Script) that receives orders and
// booking requests as JSON. Without it, requests are handed off to email so nothing is lost.
export const FORMS_ENDPOINT = import.meta.env.PUBLIC_FORMS_ENDPOINT || '';

// Online payment (GCash, Maya, card) needs a payment provider connected through the backend.
// Until then, customers choose how they will pay and pay at the kiosk; card details are never collected.
export const ONLINE_PAYMENTS = false;

// Customer accounts need the backend's auth. Until then, My account shows orders, bookings and
// details saved in this browser, and the sign-in / register forms stay hidden.
export const ACCOUNTS_ENABLED = false;

// About page, "Drink Coffee and Do Good": the cause or community work the cups support.
// Leave empty to show the heading and lettering without a description.
export const DO_GOOD_TEXT = '';
