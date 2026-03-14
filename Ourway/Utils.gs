function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getTimezone_() {
  return Session.getScriptTimeZone() || APP_CONFIG.defaultTimezone;
}

function nowIso_() {
  return Utilities.formatDate(new Date(), getTimezone_(), "yyyy-MM-dd'T'HH:mm:ssXXX");
}

function isoFromDate_(date) {
  return Utilities.formatDate(new Date(date), getTimezone_(), "yyyy-MM-dd'T'HH:mm:ssXXX");
}

function dateKey_(date) {
  return Utilities.formatDate(new Date(date || new Date()), getTimezone_(), 'yyyy-MM-dd');
}

function normalizeEmail_(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeText_(value) {
  return String(value || '').trim();
}

function normalizeRole_(role) {
  const candidate = normalizeText_(role);
  return APP_CONFIG.roles.indexOf(candidate) > -1 ? candidate : 'Employee';
}

function asBoolean_(value) {
  return value === true || String(value).toLowerCase() === 'true' || String(value).toLowerCase() === 'yes';
}

function parseDateTime_(value) {
  return value ? new Date(value) : null;
}

function minutesBetween_(startText, endText) {
  const start = parseDateTime_(startText);
  const end = parseDateTime_(endText);
  if (!start || !end) return '';
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
}

function inclusiveDays_(fromDate, toDate) {
  const from = new Date(fromDate + 'T00:00:00');
  const to = new Date(toDate + 'T00:00:00');
  const diff = to.getTime() - from.getTime();
  return Math.floor(diff / 86400000) + 1;
}

function buildId_(prefix) {
  return prefix + '-' + Utilities.getUuid().split('-')[0].toUpperCase();
}

function buildTrackCode_() {
  return 'TRK-' + Utilities.formatDate(new Date(), getTimezone_(), 'yyyyMMdd-HHmmss') + '-' + Utilities.getUuid().split('-')[0].toUpperCase();
}

function hashPassword_(password, salt) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(password) + String(salt),
    Utilities.Charset.UTF_8
  );
  return digest.map(function(byte) {
    const value = byte < 0 ? byte + 256 : byte;
    return ('0' + value.toString(16)).slice(-2);
  }).join('');
}

function createPasswordRecord_(password) {
  const salt = Utilities.getUuid();
  return {
    salt: salt,
    hash: hashPassword_(password, salt)
  };
}

function getSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  let spreadsheetId = props.getProperty('SPREADSHEET_ID');
  let spreadsheet;

  if (spreadsheetId) {
    spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  } else {
    spreadsheet = SpreadsheetApp.create(APP_CONFIG.spreadsheetName);
    props.setProperty('SPREADSHEET_ID', spreadsheet.getId());
  }

  return spreadsheet;
}

function getSheet_(sheetName) {
  const spreadsheet = getSpreadsheet_();
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Missing sheet: ' + sheetName + '. Run setupSystem() first.');
  }
  return sheet;
}

function ensureSheet_(sheetName, headers) {
  const spreadsheet = getSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  const range = sheet.getRange(1, 1, 1, headers.length);
  range.setValues([headers]);
  range.setFontWeight('bold');
  sheet.setFrozenRows(1);

  if (sheet.getMaxColumns() < headers.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
  }

  sheet.autoResizeColumns(1, headers.length);
  return sheet;
}

function getRecords_(sheetName) {
  const sheet = getSheet_(sheetName);
  const values = sheet.getDataRange().getDisplayValues();
  if (!values.length) {
    return [];
  }

  const headers = values[0];
  return values.slice(1).map(function(row, index) {
    const hasValue = row.some(function(cell) { return cell !== ''; });
    if (!hasValue) return null;
    const record = {};
    headers.forEach(function(header, columnIndex) {
      record[header] = row[columnIndex];
    });
    record._rowNumber = index + 2;
    return record;
  }).filter(function(record) { return record !== null; });
}

function appendRecord_(sheetName, record) {
  const sheet = getSheet_(sheetName);
  const headers = SHEET_HEADERS[sheetName];
  const row = headers.map(function(header) {
    return Object.prototype.hasOwnProperty.call(record, header) ? record[header] : '';
  });
  sheet.appendRow(row);
}

function updateRecord_(sheetName, rowNumber, updates) {
  const sheet = getSheet_(sheetName);
  const headers = SHEET_HEADERS[sheetName];
  const existing = sheet.getRange(rowNumber, 1, 1, headers.length).getDisplayValues()[0];
  const current = {};
  headers.forEach(function(header, index) {
    current[header] = existing[index];
  });

  Object.keys(updates).forEach(function(key) {
    current[key] = updates[key];
  });

  const row = headers.map(function(header) {
    return Object.prototype.hasOwnProperty.call(current, header) ? current[header] : '';
  });
  sheet.getRange(rowNumber, 1, 1, headers.length).setValues([row]);
}

function findRecord_(sheetName, field, value) {
  const records = getRecords_(sheetName);
  return records.find(function(record) {
    return record[field] === value;
  }) || null;
}

function withLock_(callback) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    return callback();
  } finally {
    lock.releaseLock();
  }
}

function sanitizeUser_(record) {
  if (!record) return null;
  return {
    userId: record['User ID'],
    fullName: record['Full Name'],
    shortName: record['Short Name'],
    email: record['Email'],
    phone: record['Phone'],
    role: record['Role'],
    status: record['Status'],
    approvedBy: record['Approved By'],
    approvedAt: record['Approved At'],
    createdAt: record['Created At'],
    updatedAt: record['Updated At']
  };
}

function attendanceDto_(record) {
  return {
    attendanceId: record['Attendance ID'],
    userId: record['User ID'],
    fullName: record['Full Name'],
    date: record['Date'],
    workMode: record['Work Mode'],
    clockIn: record['Clock In'],
    clockOut: record['Clock Out'],
    durationMinutes: Number(record['Duration Minutes'] || 0),
    notes: record['Notes'],
    createdAt: record['Created At'],
    updatedAt: record['Updated At']
  };
}

function leaveDto_(record) {
  return {
    leaveId: record['Leave ID'],
    userId: record['User ID'],
    fullName: record['Full Name'],
    fromDate: record['From Date'],
    toDate: record['To Date'],
    days: Number(record['Days'] || 0),
    leaveType: record['Leave Type'],
    reason: record['Reason'],
    status: record['Status'],
    reviewedBy: record['Reviewed By'],
    reviewedAt: record['Reviewed At'],
    createdAt: record['Created At'],
    updatedAt: record['Updated At']
  };
}

function noticeDto_(record, responseSummary, userResponse) {
  return {
    noticeId: record['Notice ID'],
    title: record['Title'],
    message: record['Message'],
    createdBy: record['Created By'],
    responseRequired: asBoolean_(record['Response Required']),
    status: record['Status'],
    createdAt: record['Created At'],
    updatedAt: record['Updated At'],
    responseSummary: responseSummary || { yes: 0, no: 0 },
    userResponse: userResponse || ''
  };
}

function taskDto_(record) {
  return {
    taskId: record['Task ID'],
    trackCode: record['Track Code'],
    title: record['Title'],
    description: record['Description'],
    assignedUserId: record['Assigned User ID'],
    assignedUserName: record['Assigned User Name'],
    clientName: record['Client Name'],
    deadline: record['Deadline'],
    status: record['Status'],
    startTime: record['Start Time'],
    completionTime: record['Completion Time'],
    timeSpentMinutes: Number(record['Time Spent Minutes'] || 0),
    submittedForQcAt: record['Submitted For QC At'],
    lastQcStatus: record['Last QC Status'],
    rejectionReason: record['Rejection Reason'],
    chatFeedbackLink: record['Chat Feedback Link'],
    createdBy: record['Created By'],
    createdAt: record['Created At'],
    updatedAt: record['Updated At']
  };
}

function qcDto_(record) {
  return {
    qcId: record['QC ID'],
    taskId: record['Task ID'],
    trackCode: record['Track Code'],
    reviewStatus: record['Review Status'],
    reviewedBy: record['Reviewed By'],
    reviewedAt: record['Reviewed At'],
    rejectionReason: record['Rejection Reason'],
    chatFeedbackLink: record['Chat Feedback Link'],
    comments: record['Comments']
  };
}

function getUserById_(userId) {
  return findRecord_(APP_CONFIG.sheets.users, 'User ID', userId);
}

function getUserByEmail_(email) {
  const normalized = normalizeEmail_(email);
  return getRecords_(APP_CONFIG.sheets.users).find(function(record) {
    return normalizeEmail_(record['Email']) === normalized;
  }) || null;
}

function getUserByShortName_(shortName) {
  const normalized = normalizeText_(shortName).toLowerCase();
  return getRecords_(APP_CONFIG.sheets.users).find(function(record) {
    return normalizeText_(record['Short Name']).toLowerCase() === normalized;
  }) || null;
}

function requireSession_(token) {
  const sessionToken = normalizeText_(token);
  if (!sessionToken) {
    throw new Error('Please log in again.');
  }

  const props = PropertiesService.getScriptProperties();
  const raw = props.getProperty('SESSION_' + sessionToken);
  if (!raw) {
    throw new Error('Session expired. Please log in again.');
  }

  const session = JSON.parse(raw);
  if (Number(session.expiresAt) < Date.now()) {
    props.deleteProperty('SESSION_' + sessionToken);
    throw new Error('Session expired. Please log in again.');
  }

  const user = getUserById_(session.userId);
  if (!user || user['Status'] !== APP_CONFIG.statuses.approved) {
    props.deleteProperty('SESSION_' + sessionToken);
    throw new Error('Your account is not approved.');
  }

  return user;
}

function requireRoles_(token, allowedRoles) {
  const user = requireSession_(token);
  if (allowedRoles.indexOf(user['Role']) === -1) {
    throw new Error('You do not have permission to perform this action.');
  }
  return user;
}

function createSession_(user) {
  const token = Utilities.getUuid().replace(/-/g, '');
  const expiresAt = Date.now() + APP_CONFIG.sessionTtlHours * 60 * 60 * 1000;
  PropertiesService.getScriptProperties().setProperty('SESSION_' + token, JSON.stringify({
    userId: user['User ID'],
    expiresAt: expiresAt
  }));
  return token;
}

function revokeSession_(token) {
  if (!token) return;
  PropertiesService.getScriptProperties().deleteProperty('SESSION_' + token);
}

function isManager_(user) {
  return ['Admin', 'Coordinator'].indexOf(user['Role']) > -1;
}

function sortByDateDesc_(items, key) {
  return items.sort(function(a, b) {
    return String(b[key] || '').localeCompare(String(a[key] || ''));
  });
}
