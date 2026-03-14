# Internal Employee Management System

Google Apps Script web app backed by Google Sheets for:

- user registration and approval
- attendance tracking
- leave requests
- notice board with yes/no responses
- task assignment and execution
- QC review with rejection feedback links

## Project Files

- `/Users/sahanmadushanka/Documents/Booking/Ourway/appsscript.json`
- `/Users/sahanmadushanka/Documents/Booking/Ourway/Config.gs`
- `/Users/sahanmadushanka/Documents/Booking/Ourway/Setup.gs`
- `/Users/sahanmadushanka/Documents/Booking/Ourway/Utils.gs`
- `/Users/sahanmadushanka/Documents/Booking/Ourway/Auth.gs`
- `/Users/sahanmadushanka/Documents/Booking/Ourway/App.gs`
- `/Users/sahanmadushanka/Documents/Booking/Ourway/Index.html`
- `/Users/sahanmadushanka/Documents/Booking/Ourway/Styles.html`
- `/Users/sahanmadushanka/Documents/Booking/Ourway/Scripts.html`

## Sheet Structure

`setupSystem()` creates a Google Spreadsheet automatically and adds these sheets:

- `Users`
- `Attendance`
- `Leave Requests`
- `Notices`
- `Notice Responses`
- `Tasks`
- `QC Records`

### `Users`

`User ID, Full Name, Short Name, Email, Phone, Role, Password Hash, Password Salt, Status, Approved By, Approved At, Created At, Updated At`

### `Attendance`

`Attendance ID, User ID, Full Name, Date, Work Mode, Clock In, Clock Out, Duration Minutes, Notes, Created At, Updated At`

### `Leave Requests`

`Leave ID, User ID, Full Name, From Date, To Date, Days, Leave Type, Reason, Status, Reviewed By, Reviewed At, Created At, Updated At`

### `Notices`

`Notice ID, Title, Message, Created By, Response Required, Status, Created At, Updated At`

### `Notice Responses`

`Response ID, Notice ID, User ID, Full Name, Response, Responded At`

### `Tasks`

`Task ID, Track Code, Title, Description, Assigned User ID, Assigned User Name, Client Name, Deadline, Status, Start Time, Completion Time, Time Spent Minutes, Submitted For QC At, Last QC Status, Rejection Reason, Chat Feedback Link, Created By, Created At, Updated At`

### `QC Records`

`QC ID, Task ID, Track Code, Review Status, Reviewed By, Reviewed At, Rejection Reason, Chat Feedback Link, Comments`

## Deployment Instructions

1. Create a new standalone Google Apps Script project.
2. Copy all files from this folder into the Apps Script editor, or use `clasp` to push them.
3. Run `setupSystem()` once from the Apps Script editor and authorize the project.
4. Open the spreadsheet URL returned by `setupSystem()` if you want to inspect the backend data.
5. Deploy the project as a web app:
   - `Deploy` -> `New deployment`
   - Type: `Web app`
   - Execute as: `Me`
   - Who has access: your internal users as needed
6. Open the web app URL and log in with the default admin account:
   - Email: `admin@example.com`
   - Password: `Admin@123`
7. Approve new registrations from the `Admin Controls` view.

## Initial Admin

Update the default admin credentials in `/Users/sahanmadushanka/Documents/Booking/Ourway/Config.gs` before production deployment:

```javascript
defaultAdmin: {
  fullName: 'System Administrator',
  shortName: 'ADMIN',
  email: 'admin@example.com',
  phone: '',
  role: 'Admin',
  password: 'Admin@123'
}
```

## Notes

- Passwords are stored as SHA-256 hashes with per-user salts.
- Session tokens are stored in Script Properties and expire after 12 hours.
- Attendance allows one clock-in per user per day.
- Leave requests are limited to 7 days per request.
- Rejected QC tasks keep the rejection reason and optional Google Chat feedback link on the task record.
