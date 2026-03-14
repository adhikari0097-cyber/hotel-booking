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
- Owner can change roles
- Admin can approve/block accounts

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

The Netlify proxy forwards backup writes to Apps Script:

`/Users/sahanmadushanka/Documents/Booking/netlify/functions/proxy.js`

Google Sheet header row must be:

```text
timestamp	trackCode	guestName	phone	checkIn	checkOut	guests	roomType	roomTypeLabel	roomNumber	roomsNeeded	notes	status
```

Apps Script row order must match that header exactly.

## Deploy

1. Update Supabase SQL
2. Update Apps Script
3. Redeploy Netlify

## Realtime

The app listens to `public.bookings` realtime changes.
When one staff member saves a booking, other logged-in approved staff see updates automatically.
