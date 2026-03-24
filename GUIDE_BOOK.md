# Hotel Booking System Guide Book

## 1. Purpose
This guide explains how to use the full hotel booking system from basic work to advanced management.

Use this guide for:
- daily reception work
- booking creation
- booking editing
- check-in and check-out flow
- hold and removed bookings
- room and service setup
- analytics and reporting
- owner/admin access setup

## 2. Main Pages

### New Booking
Use this page to create a new reservation.

Main actions:
- add guest title and name
- add phone number
- select stay dates
- check availability
- choose rooms and pax
- add services
- add custom prices
- set offer
- set advance payment
- save booking

### View By Date
Use this page to manage bookings for one date.

Main actions:
- view all bookings on the selected date
- open full booking details
- edit booking
- update advance
- change room price
- add/remove services
- check in
- check out
- hold booking
- remove reservation
- export PDF
- send WhatsApp details
- email slip

### Booking Planner
Use this page to see bookings in a room-vs-date timeline.

Main actions:
- select a date range
- view room-by-room booking spread
- see pending bookings in purple
- tap/click a booking to open full details

Pending booking note:
- `Pending Booking`
- `Waiting for confirmation`

### Analytics
Use this page to see business performance.

Main sections:
- total earnings
- total bookings
- average booking value
- pending balance
- room nights
- average stay
- top rooms
- room type revenue
- service revenue
- top customers
- status breakdown
- booking sources
- guest titles
- booked by staff

Quick date buttons:
- This Month
- Last Month
- This Year
- Last Year

### Hold Bookings
Use this page to review bookings moved to hold.

Main actions:
- see hold bookings
- see removed bookings kept on hold
- owner can reactivate
- later change date and use again

### Requests
Use this page to track booking change requests.

For normal users:
- view submitted requests
- track pending / approved / rejected state

For users with request approval access:
- approve requests
- reject requests

### Accounts
Use this page to manage user access.

Main actions:
- approve accounts
- block accounts
- change role
- grant extra permissions
- remove extra permissions

### Room Fix
Use this page to manage system setup.

Main sections:
- manual check-in and check-out times
- room setup
- room pricing
- booking services
- export details setup

Main actions:
- add rooms
- switch rooms on/off
- delete unused rooms
- set room prices
- add services
- rename services
- disable services
- set default service price
- choose which details appear in PDF export
- choose which details appear in WhatsApp export

## 3. Booking Statuses

### Booking Source Status
These show how the booking came in:
- Campaign Booking
- Visit Booking
- BKC Booking
- Call Booking
- Pending Booking

### Lifecycle Status
These show the booking progress:
- Booked
- Checked In
- Checked Out
- Hold

### Special Notes
- `Pending Booking` means `Waiting for confirmation`
- pending bookings appear in purple in planner and calendar
- `Checked Out` bookings stay visible in planner and calendar
- cancelled bookings are removed from active views

## 4. Basic Workflow

### Step 1: Create Booking
1. Open `New Booking`
2. Add guest title and name
3. Add phone number
4. Select stay dates
5. Click `Check Availability`
6. Choose rooms
7. Review auto guest totals
8. Add services if needed
9. Add custom price if needed
10. Add offer if needed
11. Add advance payment if needed
12. Select booking status
13. Click `Save Booking`

### Step 2: View Booking
1. Open `View By Date`
2. Select a date
3. Click `View Bookings`
4. Open booking details or use quick action buttons

### Step 3: Edit Before Check-In
Before check-in:
- user can edit full booking
- user can delete booking
- owner approval is not needed

### Step 4: Check In
When the guest arrives:
1. Open booking in `View By Date`
2. Click `Check In`

After check-in:
- full booking edit is locked for normal users
- `Edit Booking` button is hidden for normal users
- new services can still be added
- existing services cannot be removed by normal users
- price can be added for services that did not have a price
- `Check Out` button becomes visible

### Step 5: Check Out
When the guest leaves:
1. Open booking in `View By Date`
2. Click `Check Out`
3. review services
4. add additional services if needed
5. set missing service prices
6. finish closing the booking

Owner can later review:
- checked-in time
- checked-out time
- stayed hours

## 5. Hold and Remove Flow

### Hold Room
Use when the customer said they would come but did not arrive.

Flow:
1. open booking
2. click `Hold Room`
3. booking moves to `Hold Bookings`

After hold:
- it should not show as active
- owner can reactivate
- booking can be reused by changing dates

### Remove Booking
Before check-in:
- normal user can delete directly

After lock/check-in window:
- delete needs owner/admin style access

If payment exists:
- system asks whether to refund

Decision:
- `Yes` = remove/delete flow
- `No` = move to hold and keep comment that payment is not refunded

Removed booking display:
- appears in `Hold Bookings`
- status should show `Removed Booking`

## 6. Services and Custom Price

### Services
Services are managed from `Room Fix`.

Each service can have:
- name
- default price
- on/off state

### Service Pricing Rules
- when a service is selected, custom price can be linked to it
- if a service is unselected, linked custom price should reduce
- if selected again, user can enter the price again

### Custom Price
Use custom price for:
- special charges
- transport
- extra service charge
- manual adjustments

Total rules:
- room price + custom price = total price
- total price - advance amount = balance

## 7. Export and Sharing

### PDF Export
From `Room Fix`, owner/admin can choose which fields appear in PDF.

Possible fields:
- track code
- customer
- phone
- booked by
- stay dates
- total pax
- rooms
- total price
- custom price
- lifecycle
- advance
- advance amount
- balance
- checked-in time
- checked-out time
- exported time
- services
- service prices
- custom price entries
- room details

### WhatsApp Export
From `Room Fix`, owner/admin can choose which fields appear in WhatsApp share text.

### Email Slip
Available from booking details.

## 8. Analytics Guide

Use `Analytics` to answer:
- total revenue earned
- which room sells the most
- which room type brings the most revenue
- which services earn the most
- who are the top customers
- which booking source is highest
- which title appears more often
- which staff member entered the most booking value

## 9. Access Matrix

## Owner
Owner has full control.

Pages:
- New Booking
- View By Date
- Booking Planner
- Analytics
- Hold Bookings
- Requests
- Accounts
- Room Fix

Can do:
- create booking
- edit booking
- delete booking
- check in
- check out
- hold booking
- reactivate hold booking
- remove booking
- update advance
- change room price
- manage services
- manage rooms
- manage export settings
- approve/reject requests
- approve/block accounts
- assign roles
- grant or remove extra permissions

## Admin
Admin can do most management work.

Pages:
- New Booking
- View By Date
- Booking Planner
- Analytics
- Hold Bookings
- Requests
- Accounts
- Room Fix

Can do:
- manage bookings
- approve/reject requests
- manage room fix and pricing
- approve/block accounts

## Approved User
Standard approved user can access:
- New Booking
- View By Date
- Booking Planner
- Analytics
- Hold Bookings
- Requests

Before check-in:
- full edit allowed
- delete allowed

After check-in:
- full edit not allowed
- can continue service handling based on current rules
- can check out when allowed

Requests page:
- can see own request progress

## Extra Permission Users
Owner can grant extra access without changing role.

Extra permissions:
- `Booking Control`
- `Request Approval`
- `Room Pricing`
- `Accounts Access`
- `Admin Access` = all main admin permissions together

## 10. Owner Setup Checklist
Use this when you are configuring the system.

1. Open `Room Fix`
2. set manual check-in time
3. set manual check-out time
4. confirm room list
5. set room prices
6. add/rename services
7. set default service prices
8. choose PDF export fields
9. choose WhatsApp export fields
10. open `Accounts`
11. approve staff
12. give permissions as needed

## 11. Safe Change Checklist
Use before making system changes.

1. review the current page first
2. note current room/service/pricing settings
3. change one section at a time
4. click save
5. refresh and verify
6. test on `New Booking`
7. test on `View By Date`
8. test export if export settings changed
9. test analytics if status/source setup changed

## 12. Search Index

Search keywords:
- booking
- pending booking
- waiting for confirmation
- check in
- check out
- hold booking
- removed booking
- room fix
- export pdf
- whatsapp export
- analytics
- room pricing
- services
- custom price
- advance payment
- accounts access
- admin access
- owner permissions
