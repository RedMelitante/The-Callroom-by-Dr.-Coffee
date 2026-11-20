# Form service: Google Apps Script

`Code.gs` receives the website's orders and coffee cart booking requests and:

| Request | Email | Google Calendar |
| --- | --- | --- |
| **Coffee cart booking** | To thecallroombydc@gmail.com, CC redmelitante@gmail.com | Creates a **yellow** event on the booked date and service times, with all details |
| **Pickup order** | To thecallroombydc@gmail.com, CC redmelitante@gmail.com | Nothing |

Reply-to is set to the customer's email when they gave one, so you can reply straight from the email. The recipients are fixed in the script (`RECIPIENTS`), not taken from the website's request, so nobody can use it to send email elsewhere.

It's free, runs in a Google account, and works within Google's daily email quota (100 emails a day on a free Gmail account).

## Set it up (about 5 minutes)

The script is owned and deployed by **redmelitante@gmail.com**, so do this signed in to that account. The emails are sent from redmelitante@gmail.com and the booking events go on **its** calendar. (To put events on the shop's calendar instead, see *Everyday use*.)

1. Go to [script.google.com](https://script.google.com) and click **New project**. Name it "Callroom website forms".
2. Delete what's in the editor, paste in the whole of `Code.gs`, and click **Save**.
3. Check permissions: in the toolbar, choose the function **`testSetup`** and click **Run**. Google asks you to authorise the script (Gmail and Calendar). Click through, including **Advanced → Go to Callroom website forms (unsafe)**. That warning appears for every personal script. You should then get a test email at both addresses and a yellow "TEST" event tomorrow afternoon. Delete the event.
4. Click **Deploy → New deployment**, choose type **Web app**, and set:
   - **Execute as:** Me (redmelitante@gmail.com)
   - **Who has access:** Anyone

   Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).
5. Give the URL to the website. On Railway, open the service's **Variables**, add `PUBLIC_FORMS_ENDPOINT` = the Web app URL, and redeploy. The variable is read at build time, so a redeploy is needed.
6. Send a real test booking and a test order from the live site, and check both inboxes and the calendar.

## Everyday use

- A yellow event means a **request**. Once you've sent the quote and the customer confirms, change the event colour (or delete it if they cancel).
- To change who gets the emails or which calendar is used, edit `RECIPIENTS` or `CALENDAR_ID` at the top of the script. Then go to **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. The URL stays the same, so the website doesn't need changing.
- To use a separate calendar (e.g. "Coffee cart bookings"), create it in Google Calendar, then copy its **Calendar ID** from *Settings and sharing → Integrate calendar* into `CALENDAR_ID`.
- To put events on the **shop's** calendar: signed in as thecallroombydc@gmail.com, share its calendar with redmelitante@gmail.com with **Make changes to events**, then set `var CALENDAR_ID = 'thecallroombydc@gmail.com';` and deploy a new version. Otherwise, share redmelitante@gmail.com's calendar with the shop so they can see the bookings.

## If something goes wrong

- **The website says "We couldn't send your request"**: open the script, click **Executions** on the left, and look at the latest error.
- **No calendar event, but the email arrived**: the email says why at the bottom. Usually the script wasn't authorised for Calendar; run `testSetup` again.
- The script refuses more than 30 requests in 10 minutes (`MAX_REQUESTS_PER_10_MIN`), as basic protection against spam.
