# Booking backend: Google Apps Script

`Code.gs` is the **Coffee Cart & Events Booking** backend, exactly as deployed at the site's web app URL. It's owned and deployed by **redmelitante@gmail.com**.

| Request | Handled by | Email | Google Calendar |
| --- | --- | --- | --- |
| **Coffee cart booking** | This script (POST `action: "book"`) | To `CONFIG.notifyEmail`: **redmelitante@gmail.com** | Yellow **PENDING** event on the cart's calendar (`CONFIG.calendarId`) at the requested 30-minute slot |
| **Pickup order** | **The website, not this script.** It has no order action. | The customer's email app opens addressed To thecallroombydc@gmail.com, CC redmelitante@gmail.com, and they press send | Nothing |

How bookings work:
- The website sends `date`, `session` (the 30-minute slot the customer's start time falls in, 7:00 AM to 8:00 PM), `package` and `packageLabel`, `guestCount`, `location`, `name`, `phone`, and a `note`. The note holds the event type, the full service window, the customer's email and the theme.
- Slots and dates are never blocked. Overlapping requests show as overlapping PENDING events, and staff confirm by phone.
- Errors come back as `{ error, message }`. The website then shows the customer an error so they can try again.

## Send booking emails to the shop too

`MailApp.sendEmail` accepts several addresses separated by commas, so this one-line change in `CONFIG` sends every booking email to both:

```js
notifyEmail: 'thecallroombydc@gmail.com,redmelitante@gmail.com',
```

Then **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. The URL stays the same.

## Send orders through this script later

If the script gains an `action: "order"` handler, set `FORMS_HANDLES_ORDERS = true` in `src/lib/site.js`. Orders will then POST `{ action: "order", order: {…} }` to it, instead of opening the customer's email app.

## Setup checklist

1. In the Apps Script project (signed in as redmelitante@gmail.com), open **Project Settings** (gear icon) and check the **Time zone** is **(GMT+08:00) Manila**. Otherwise every slot is off by hours.
2. Check redmelitante@gmail.com can **make changes to events** on the calendar in `CONFIG.calendarId`.
3. The deployment should be a **Web app**, with **Execute as: Me** and **Who has access: Anyone**.
4. Merge the website pull request. Then in Cloudflare (the Worker → **Settings → Build → Variables and secrets**), set `PUBLIC_FORMS_ENDPOINT` to the `/exec` URL and trigger a new build. The variable is read at build time.

## If something goes wrong

- **The website says "We couldn't send your request"**: open the script and click **Executions** on the left to see the latest error.
- **`CONFIG_ERROR`**: the script can't open the calendar in `CONFIG.calendarId`. Check the ID and the calendar's sharing.
- **Events at the wrong time**: the project time zone isn't Asia/Manila.
