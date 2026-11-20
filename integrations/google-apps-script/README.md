# Form service: Google Apps Script

`Code.gs` is the backend for the website's coffee cart bookings and pickup orders. It's owned and deployed by **redmelitante@gmail.com**, and it builds on the "Coffee Cart & Events Booking" backend that was already deployed for this site.

| Request (POST `action`) | Email | Google Calendar |
| --- | --- | --- |
| **Coffee cart booking** (`book`) | To thecallroombydc@gmail.com, CC redmelitante@gmail.com | Yellow **PENDING** event on the cart's calendar (`CONFIG.calendarId`) at the requested 30-minute slot |
| **Pickup order** (`order`) | To thecallroombydc@gmail.com, CC redmelitante@gmail.com | Nothing |

- **Time slots** run every 30 minutes, 7:00 AM to 8:30 PM (`CONFIG.bookingHours`). The website sends the slot that the customer's start time falls in. The full service window, event type and theme go in the note.
- **Slots and dates are never blocked.** Overlapping requests show up as overlapping events, and staff sort them out by phone (as in the original backend).
- **Recipients** come from `CONFIG.notifyEmails` only, never from the request.
- **Replies:** reply-to is set to the customer's email when they gave one.
- **Errors:** missing or invalid fields come back as `{ error, message }`, and the website shows the customer an error so they can try again.

## Update the deployed script (keeps the same URL)

The URL `https://script.google.com/macros/s/AKfycbyPNGQz9-…/exec` is already deployed with the original booking-only backend. To switch it to this version:

1. Go to [script.google.com](https://script.google.com), signed in as **redmelitante@gmail.com**, and open the project for that URL.
2. Replace everything in `Code.gs` with this file's contents and click **Save**.
3. **Project Settings** (gear icon): check the **Time zone** is **(GMT+08:00) Manila**.
4. Click **Deploy → Manage deployments**, select the web app, click **Edit** (pencil), set **Version: New version**, and click **Deploy**. The URL stays the same.
5. If Google asks for permissions again (Gmail and Calendar), allow them. On "Google hasn't verified this app", click **Advanced → Go to … (unsafe)**; that warning appears for every personal script.

## Connect it to the website

1. Merge the website pull request that adds this backend. The live site needs the new code first.
2. On Railway, open the website service → **Variables** → set `PUBLIC_FORMS_ENDPOINT` to the `/exec` URL.
3. Redeploy the site. The variable is read at build time.

## Everyday use

- A yellow **PENDING** event is a request. Call the customer, then rename, recolour or resize the event as usual.
- **Change who gets emails:** edit `CONFIG.notifyEmails` (first = To, rest = CC).
- **Change the calendar:** edit `CONFIG.calendarId`. Get the ID from Google Calendar → the calendar's *Settings and sharing* → *Integrate calendar*. redmelitante@gmail.com needs **Make changes to events** access to that calendar.
- **Change booking hours or slot length:** edit `CONFIG.bookingHours`. The website currently accepts start times from 7:00 AM to 8:00 PM; update `src/components/design/BookingBody.jsx` if the hours change.
- After any edit: **Deploy → Manage deployments → Edit → New version → Deploy**.

## If something goes wrong

- **The website says "We couldn't send your request"**: open the script and click **Executions** on the left to see the latest error.
- **`CONFIG_ERROR`**: the script can't open the calendar in `CONFIG.calendarId`. Check the ID, and check that redmelitante@gmail.com can edit that calendar.
- **Events at the wrong time**: the project time zone isn't Asia/Manila (step 3 above).
