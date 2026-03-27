const BOOKING_BACKUP_CONFIG = Object.freeze({
  spreadsheetName: 'Muthugala Resort Booking Backups',
  bookingSheet: 'Booking Backups',
  slipSheet: 'Payment Slip Backups',
  bookingHeaders: [
    'Backup Key',
    'Track Code',
    'Guest Name',
    'Phone',
    'Created By Name',
    'Check In',
    'Check Out',
    'Guests',
    'Room Type',
    'Room Type Label',
    'Room Number',
    'Rooms Needed',
    'Notes',
    'Status',
    'Lifecycle Status',
    'Advance Paid',
    'Advance Amount',
    'Room Total',
    'Custom Payments Json',
    'Close Details Json',
    'Booking Json',
    'Group Json',
    'Backup Created At',
    'Updated At'
  ],
  slipHeaders: [
    'Slip Key',
    'Track Code',
    'Guest Name',
    'Phone',
    'Document Label',
    'Lifecycle Status',
    'Advance Amount',
    'Total Price',
    'Balance Amount',
    'File Source',
    'File Mime Type',
    'File Name',
    'Drive File Id',
    'Drive File Url',
    'Booking Json',
    'Group Json',
    'Saved At',
    'Updated At'
  ]
});

function doGet(e) {
  return handleBookingBackupRequest_(e, 'GET');
}

function doPost(e) {
  return handleBookingBackupRequest_(e, 'POST');
}

function handleBookingBackupRequest_(e, method) {
  try {
    ensureBookingBackupSheets_();
    const params = getRequestParams_(e);
    const action = String(params.action || '').trim();

    if (action === 'list_booking_backups') {
      return jsonResponse_({
        success: true,
        rows: listSheetRows_(BOOKING_BACKUP_CONFIG.bookingSheet, BOOKING_BACKUP_CONFIG.bookingHeaders, Number(params.limit || 300)),
        spreadsheetUrl: getBookingBackupSpreadsheet_().getUrl()
      });
    }

    if (action === 'list_payment_slips') {
      return jsonResponse_({
        success: true,
        rows: listSheetRows_(BOOKING_BACKUP_CONFIG.slipSheet, BOOKING_BACKUP_CONFIG.slipHeaders, Number(params.limit || 200)),
        spreadsheetUrl: getBookingBackupSpreadsheet_().getUrl()
      });
    }

    if (action === 'get_booking_backup') {
      return jsonResponse_({
        success: true,
        row: findSheetRecord_(BOOKING_BACKUP_CONFIG.bookingSheet, BOOKING_BACKUP_CONFIG.bookingHeaders, 'Backup Key', params.backupKey || '')
      });
    }

    if (action === 'get_payment_slip') {
      return jsonResponse_({
        success: true,
        row: findSheetRecord_(BOOKING_BACKUP_CONFIG.slipSheet, BOOKING_BACKUP_CONFIG.slipHeaders, 'Slip Key', params.slipKey || '')
      });
    }

    if (method !== 'POST') {
      return jsonResponse_({ success: false, message: 'Unsupported action.' });
    }

    if (action === 'backup_booking') {
      const nowIso = new Date().toISOString();
      const record = {
        'Backup Key': params.backupKey || '',
        'Track Code': params.trackCode || '',
        'Guest Name': params.guestName || '',
        'Phone': params.phone || '',
        'Created By Name': params.createdByName || '',
        'Check In': params.checkIn || '',
        'Check Out': params.checkOut || '',
        'Guests': params.guests || '0',
        'Room Type': params.roomType || '',
        'Room Type Label': params.roomTypeLabel || '',
        'Room Number': params.roomNumber || '',
        'Rooms Needed': params.roomsNeeded || '1',
        'Notes': params.notes || '',
        'Status': params.status || '',
        'Lifecycle Status': params.lifecycleStatus || 'booked',
        'Advance Paid': params.advancePaid || 'false',
        'Advance Amount': params.advanceAmount || '0',
        'Room Total': params.roomTotal || '0',
        'Custom Payments Json': params.customPaymentsJson || '[]',
        'Close Details Json': params.closeDetailsJson || '{}',
        'Booking Json': params.bookingJson || '{}',
        'Group Json': params.groupJson || '',
        'Backup Created At': params.backupCreatedAt || nowIso,
        'Updated At': nowIso
      };
      upsertSheetRecord_(BOOKING_BACKUP_CONFIG.bookingSheet, BOOKING_BACKUP_CONFIG.bookingHeaders, 'Backup Key', record);
      return jsonResponse_({ success: true, backupKey: record['Backup Key'] });
    }

    if (action === 'save_payment_slip') {
      const nowIso = new Date().toISOString();
      const fileSource = params.fileSource || (params.fileContentBase64 ? 'customer_upload' : 'generated_receipt');
      const fileMimeType = params.fileMimeType || (fileSource === 'customer_upload' ? 'application/octet-stream' : 'text/html');
      const fileName = params.fileName || ('booking-slip-' + nowIso.replace(/[^\d]/g, '').slice(0, 14) + (fileSource === 'customer_upload' ? '' : '.html'));
      const file = params.fileContentBase64
        ? createDriveBinaryFile_(fileName, params.fileContentBase64 || '', fileMimeType)
        : createDriveHtmlFile_(fileName, params.htmlMarkup || '');
      const record = {
        'Slip Key': params.slipKey || '',
        'Track Code': params.trackCode || '',
        'Guest Name': params.guestName || '',
        'Phone': params.phone || '',
        'Document Label': params.documentLabel || '',
        'Lifecycle Status': params.lifecycleStatus || 'booked',
        'Advance Amount': params.advanceAmount || '0',
        'Total Price': params.totalPrice || '0',
        'Balance Amount': params.balanceAmount || '0',
        'File Source': fileSource,
        'File Mime Type': fileMimeType,
        'File Name': file.getName(),
        'Drive File Id': file.getId(),
        'Drive File Url': file.getUrl(),
        'Booking Json': params.bookingJson || '[]',
        'Group Json': params.groupJson || '',
        'Saved At': params.savedAt || nowIso,
        'Updated At': nowIso
      };
      upsertSheetRecord_(BOOKING_BACKUP_CONFIG.slipSheet, BOOKING_BACKUP_CONFIG.slipHeaders, 'Slip Key', record);
      return jsonResponse_({
        success: true,
        slipKey: record['Slip Key'],
        driveFileId: file.getId(),
        driveFileUrl: file.getUrl()
      });
    }

    return jsonResponse_({ success: false, message: 'Unsupported action.' });
  } catch (error) {
    return jsonResponse_({ success: false, message: error.message || String(error) });
  }
}

function getRequestParams_(e) {
  const params = {};
  const source = (e && e.parameter) || {};
  Object.keys(source).forEach(function(key) {
    params[key] = source[key];
  });
  if (e && e.postData && e.postData.contents) {
    const parsed = parseQueryString_(e.postData.contents);
    Object.keys(parsed).forEach(function(key) {
      params[key] = parsed[key];
    });
  }
  return params;
}

function parseQueryString_(raw) {
  const text = String(raw || '');
  if (!text) return {};
  return text.split('&').reduce(function(result, part) {
    const pieces = part.split('=');
    const key = decodeURIComponent((pieces.shift() || '').replace(/\+/g, ' '));
    if (!key) return result;
    result[key] = decodeURIComponent((pieces.join('=') || '').replace(/\+/g, ' '));
    return result;
  }, {});
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function getBookingBackupSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  let spreadsheetId = props.getProperty('BOOKING_BACKUP_SPREADSHEET_ID');
  let spreadsheet;
  if (spreadsheetId) {
    spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  } else {
    spreadsheet = SpreadsheetApp.create(BOOKING_BACKUP_CONFIG.spreadsheetName);
    props.setProperty('BOOKING_BACKUP_SPREADSHEET_ID', spreadsheet.getId());
  }
  return spreadsheet;
}

function ensureBookingBackupSheets_() {
  ensureBookingBackupSheet_(BOOKING_BACKUP_CONFIG.bookingSheet, BOOKING_BACKUP_CONFIG.bookingHeaders);
  ensureBookingBackupSheet_(BOOKING_BACKUP_CONFIG.slipSheet, BOOKING_BACKUP_CONFIG.slipHeaders);
}

function ensureBookingBackupSheet_(sheetName, headers) {
  const spreadsheet = getBookingBackupSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  if (sheet.getMaxColumns() < headers.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
  }
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setFontWeight('bold');
  sheet.setFrozenRows(1);
  return sheet;
}

function getSheetRecords_(sheetName, headers) {
  const sheet = getBookingBackupSpreadsheet_().getSheetByName(sheetName);
  if (!sheet) return [];
  const values = sheet.getDataRange().getDisplayValues();
  if (values.length <= 1) return [];
  return values.slice(1).map(function(row, index) {
    const record = { _rowNumber: index + 2 };
    headers.forEach(function(header, columnIndex) {
      record[header] = row[columnIndex] || '';
    });
    return record;
  });
}

function findSheetRecord_(sheetName, headers, keyHeader, keyValue) {
  return getSheetRecords_(sheetName, headers).find(function(record) {
    return String(record[keyHeader] || '') === String(keyValue || '');
  }) || null;
}

function upsertSheetRecord_(sheetName, headers, keyHeader, record) {
  const sheet = getBookingBackupSpreadsheet_().getSheetByName(sheetName);
  const existing = findSheetRecord_(sheetName, headers, keyHeader, record[keyHeader]);
  const row = headers.map(function(header) {
    return record[header] == null ? '' : record[header];
  });
  if (existing && existing._rowNumber) {
    sheet.getRange(existing._rowNumber, 1, 1, headers.length).setValues([row]);
    return existing._rowNumber;
  }
  sheet.appendRow(row);
  return sheet.getLastRow();
}

function listSheetRows_(sheetName, headers, limit) {
  return getSheetRecords_(sheetName, headers)
    .sort(function(a, b) {
      const left = String(b['Updated At'] || b['Saved At'] || b['Backup Created At'] || '');
      const right = String(a['Updated At'] || a['Saved At'] || a['Backup Created At'] || '');
      return left.localeCompare(right);
    })
    .slice(0, Math.max(1, limit || 100))
    .map(function(record) {
      const row = {};
      headers.forEach(function(header) {
        row[toCamelKey_(header)] = record[header] || '';
      });
      return row;
    });
}

function toCamelKey_(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+([a-z0-9])/g, function(_, char) {
      return String(char || '').toUpperCase();
    })
    .replace(/[^a-z0-9]/g, '');
}

function createDriveHtmlFile_(fileName, htmlMarkup) {
  const props = PropertiesService.getScriptProperties();
  const folderId = props.getProperty('BOOKING_BACKUP_DRIVE_FOLDER_ID');
  const blob = Utilities.newBlob(String(htmlMarkup || ''), 'text/html', fileName);
  if (folderId) {
    return DriveApp.getFolderById(folderId).createFile(blob);
  }
  return DriveApp.createFile(blob);
}

function createDriveBinaryFile_(fileName, base64Content, mimeType) {
  const props = PropertiesService.getScriptProperties();
  const folderId = props.getProperty('BOOKING_BACKUP_DRIVE_FOLDER_ID');
  const bytes = Utilities.base64Decode(String(base64Content || ''));
  const blob = Utilities.newBlob(bytes, mimeType || 'application/octet-stream', fileName);
  if (folderId) {
    return DriveApp.getFolderById(folderId).createFile(blob);
  }
  return DriveApp.createFile(blob);
}
