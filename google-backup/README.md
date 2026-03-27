# Google Backup Web App

Use this Google Apps Script web app with:

- `/Users/sahanmadushanka/Documents/Booking/google-backup/BookingBackupWebApp.gs`
- `/Users/sahanmadushanka/Documents/Booking/api/google-backup.js`

## What It Handles

- save booking backup rows to Google Sheets
- save customer-uploaded bank-slip image/PDF files to Google Drive
- list booking backups for the app backup page
- list payment slip backups for the app backup page

## Setup

1. Create a new standalone Google Apps Script project.
2. Paste `BookingBackupWebApp.gs` into the project.
3. Deploy it as a web app:
   - Execute as: `Me`
   - Who has access: `Anyone` or your allowed internal access path
4. Copy the deployed web app URL.
5. Update `/Users/sahanmadushanka/Documents/Booking/api/google-backup.js` and replace `GAS_URL` with that deployed URL.
6. If you want slip files saved inside a specific Drive folder, set a Script Property:
   - key: `BOOKING_BACKUP_DRIVE_FOLDER_ID`
   - value: your Google Drive folder id
7. Open the deployed app and use the `Backup` page from an owner/admin account.

## Notes

- booking backups are saved to a spreadsheet created automatically by the script
- customer bank-slip uploads are stored in Google Drive using the original image/PDF content
- the app can open backup details later even if live booking data has been deleted
