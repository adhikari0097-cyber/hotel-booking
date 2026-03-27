# Google Backup Web App

Use this Google Apps Script web app with:

- `/Users/sahanmadushanka/Documents/Booking/google-backup/BookingBackupWebApp.gs`
- `/Users/sahanmadushanka/Documents/Booking/netlify/functions/proxy.js`

## What It Handles

- save booking backup rows to Google Sheets
- save advance-payment slip HTML files to Google Drive
- list booking backups for the app backup page
- list payment slip backups for the app backup page

## Setup

1. Create a new standalone Google Apps Script project.
2. Paste `BookingBackupWebApp.gs` into the project.
3. Deploy it as a web app:
   - Execute as: `Me`
   - Who has access: `Anyone` or your allowed internal access path
4. Copy the deployed web app URL.
5. Update `/Users/sahanmadushanka/Documents/Booking/netlify/functions/proxy.js` and replace `GAS_URL` with that deployed URL.
6. If you want slip files saved inside a specific Drive folder, set a Script Property:
   - key: `BOOKING_BACKUP_DRIVE_FOLDER_ID`
   - value: your Google Drive folder id
7. Open the deployed app and use the `Backup` page from an owner/admin account.

## Notes

- booking backups are saved to a spreadsheet created automatically by the script
- payment slips are stored as `.html` files in Google Drive
- the app can open backup details later even if live booking data has been deleted
