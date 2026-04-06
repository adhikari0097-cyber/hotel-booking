# Hotel Booking Mobile

This app now uses:

- `Supabase Auth` for staff login
- `Supabase` as the live booking database
- `Google Sheets` as a backup copy of each booking

## Access Model

Roles:

- `owner`
- `admin`
- `user`

Rules:

- First signup becomes `owner` automatically and is approved automatically
- Later signups become `user` and stay `pending` until owner/admin approves them
- Only approved accounts can read or create bookings
- Only `owner` and `admin` can directly edit bookings
- `user` accounts submit change requests instead of editing bookings directly
- Owner can change roles
- Admin can approve/block accounts

## Change Request Workflow

User request reasons:

- `Customer request to cancel`
- `Customer request to hold`
- `Customer request to change date`
- `Wrong data`

Flow:

- `user` opens a booking and submits a change request with a reason and details
- request status starts as `pending`
- `owner` / `admin` sees requests in the `Requests` tab
- `owner` / `admin` can `Approve` or `Reject`
- when approved, the booking row is updated automatically in `Supabase`
- user sees the latest request status from the same `Requests` tab

## Supabase Setup

1. Open the SQL editor.
2. Run `/Users/sahanmadushanka/Documents/Booking/supabase/schema.sql`.
3. In Supabase Auth settings, disable mandatory email confirmation for this internal app.

## Login Model

The app uses `username + password` in the UI.
Behind the scenes it signs in with a generated internal email like:

- `sahan` -> `sahan@hotel.local`

That keeps the staff flow simple.

## Owner Bootstrap

The first account that signs up becomes `owner` automatically.
For your setup:

- username: `sahan`
- password: `qwertysahan@123`

After first login, change the password in Supabase Auth later if needed.

## App Config

`/Users/sahanmadushanka/Documents/Booking/app.js`

Set:

```js
SUPABASE_URL: "https://YOUR_PROJECT.supabase.co",
SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY",
```

## Google Sheets Backup

The Vercel API proxy forwards backup writes to Apps Script:

`/Users/sahanmadushanka/Documents/Booking/api/google-backup.js`

Full Google backup web app template:

`/Users/sahanmadushanka/Documents/Booking/google-backup/BookingBackupWebApp.gs`

If you still use the old simple row-append script, the Google Sheet header row must be:

```text
timestamp	trackCode	guestName	phone	checkIn	checkOut	guests	roomType	roomTypeLabel	roomNumber	roomsNeeded	notes	status
```

Apps Script row order must match that header exactly.

For the new full backup system with the in-app `Backup` page, use:

`/Users/sahanmadushanka/Documents/Booking/google-backup/README.md`

## Deploy

1. Update Supabase SQL
2. Update Apps Script
3. Redeploy Vercel

Note:

- current backup flow is wired for a Vercel API route at `/api/google-backup`
- `Supabase` is the source of truth
- owner/admin can use the new `Backup` page to view saved booking rows and payment slip backups after the Google backup web app is deployed

## Realtime

The app listens to realtime changes from:

- `public.bookings`
- `public.booking_change_requests`

When one staff member saves a booking or submits/approves a request, other approved staff see updates automatically.
