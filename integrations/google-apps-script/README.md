# Bookings and orders backend: Google Apps Script

`Code.gs` matches the live script at the site's web app URL: the **Coffee Cart & Events Booking** backend plus an order action. It's owned and deployed by **redmelitante@gmail.com**.

| Request | POST `action` | Email to `CONFIG.notifyEmail` | Google Calendar |
| --- | --- | --- | --- |
| **Coffee cart booking** | `book` | thecallroombydc@gmail.com and redmelitante@gmail.com | Yellow **PENDING** event on the cart's calendar (`CONFIG.calendarId`) at the requested 30-minute slot |
| **Pickup order** | `order` | thecallroombydc@gmail.com and redmelitante@gmail.com | Nothing |
| **Customer cancels a booking** (My account page) | `cancel` | thecallroombydc@gmail.com and redmelitante@gmail.com | The booking's event is renamed **CANCELLED - …** and turned **red** (kept as a record; delete it whenever you like) |

`CONFIG.notifyEmail` is a comma-separated list; `MailApp.sendEmail` emails every address in it.

How bookings work:
- The website sends `date`, `session` (the 30-minute slot the customer's start time falls in, 7:00 AM to 8:00 PM), `package` and `packageLabel`, `guestCount`, `location`, `name`, `phone`, and a `note`. The note holds the event type, the full service window, the customer's email and the theme.
- Slots and dates are never blocked. Overlapping requests show as overlapping PENDING events, and staff confirm by phone.

How cancelling works (`cancelBookingRequest`):
- When a booking is made, the script stores a random **cancel code** on its calendar event (event tags `cancelToken` and `status`) and replies with `bookingId` (the event ID) and `cancelToken`. The website saves both with the booking in the customer's browser.
- On **My account → Coffee cart bookings**, each upcoming booking has a **Cancel booking** button, with a confirm step. It POSTs `{ action: "cancel", bookingId, cancelToken }`.
- The script cancels only if the code matches that event. A wrong code and an unknown booking get the same `NOT_FOUND` answer, so codes can't be guessed. Bookings whose date has passed return `TOO_LATE`. Cancelling twice is harmless.
- Bookings made before this update, or through the email hand-off, have no code. For those, the page shows "Need to cancel? Call 0932 723 3849 or message us" instead of a button.
- The owner can still rename or recolour events (e.g. to CONFIRMED); a customer cancel still works and turns the event red.

How orders work (`createOrderRequest`):
- The website sends `{ action: "order", order: { no, name, phone, email, fulfillment, when, slot, pay, items: [{ name, opts, qty, total }], total } }`. Top-level fields (and `address`, `price`, `options`) are accepted too.
- Every field is cleaned: control characters and newlines removed, lengths capped, quantities kept between 1 and 99, amounts must be numbers.
- The email lists the customer's name, phone and email, the fulfillment details and address, payment, every item, and the total.
- Missing name, phone or items returns `{ error: "MISSING_FIELDS", message: "Please provide your name, phone number, and order items." }` and sends nothing.

Any `{ error, message }` reply makes the website show the customer an error, so they can try again.

On the website, `FORMS_HANDLES_ORDERS = true` in `src/lib/site.js` sends orders to this script. Set it to `false` to fall back to the email-app hand-off (To thecallroombydc@gmail.com, CC redmelitante@gmail.com).

## Updating the live script

After changing `Code.gs`, paste it into the Apps Script project, save, then go to **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. The URL stays the same.

## Setup checklist

1. In the Apps Script project (signed in as redmelitante@gmail.com), open **Project Settings** (gear icon) and check the **Time zone** is **(GMT+08:00) Manila**. Otherwise every slot is off by hours.
2. Check redmelitante@gmail.com can **make changes to events** on the calendar in `CONFIG.calendarId`.
3. The deployment should be a **Web app**, with **Execute as: Me** and **Who has access: Anyone**.
4. Merge the website pull request. Then in Cloudflare (the Worker → **Settings → Build → Variables and secrets**), set `PUBLIC_FORMS_ENDPOINT` to the `/exec` URL and trigger a new build. The variable is read at build time.

## If something goes wrong

- **The website says "We couldn't send your request"**: open the script and click **Executions** on the left to see the latest error.
- **`CONFIG_ERROR`**: the script can't open the calendar in `CONFIG.calendarId`. Check the ID and the calendar's sharing.
- **Events at the wrong time**: the project time zone isn't Asia/Manila.
