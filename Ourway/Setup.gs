function doGet() {
  setupSystem();
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle(APP_CONFIG.appName)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function setupSystem() {
  const spreadsheet = getSpreadsheet_();
  Object.keys(SHEET_HEADERS).forEach(function(sheetName) {
    ensureSheet_(sheetName, SHEET_HEADERS[sheetName]);
  });
  bootstrapAdmin_();

  return {
    ok: true,
    spreadsheetId: spreadsheet.getId(),
    spreadsheetUrl: spreadsheet.getUrl()
  };
}

function bootstrapAdmin_() {
  const existingAdmins = getRecords_(APP_CONFIG.sheets.users).filter(function(record) {
    return record['Role'] === 'Admin' && record['Status'] === APP_CONFIG.statuses.approved;
  });

  if (existingAdmins.length) {
    return;
  }

  const now = nowIso_();
  const passwordRecord = createPasswordRecord_(APP_CONFIG.defaultAdmin.password);
  const existingByEmail = getUserByEmail_(APP_CONFIG.defaultAdmin.email);

  if (existingByEmail) {
    updateRecord_(APP_CONFIG.sheets.users, existingByEmail._rowNumber, {
      'Full Name': APP_CONFIG.defaultAdmin.fullName,
      'Short Name': APP_CONFIG.defaultAdmin.shortName,
      'Phone': APP_CONFIG.defaultAdmin.phone,
      'Role': 'Admin',
      'Password Hash': passwordRecord.hash,
      'Password Salt': passwordRecord.salt,
      'Status': APP_CONFIG.statuses.approved,
      'Approved By': 'System',
      'Approved At': now,
      'Updated At': now
    });
    return;
  }

  appendRecord_(APP_CONFIG.sheets.users, {
    'User ID': buildId_('USR'),
    'Full Name': APP_CONFIG.defaultAdmin.fullName,
    'Short Name': APP_CONFIG.defaultAdmin.shortName,
    'Email': APP_CONFIG.defaultAdmin.email,
    'Phone': APP_CONFIG.defaultAdmin.phone,
    'Role': 'Admin',
    'Password Hash': passwordRecord.hash,
    'Password Salt': passwordRecord.salt,
    'Status': APP_CONFIG.statuses.approved,
    'Approved By': 'System',
    'Approved At': now,
    'Created At': now,
    'Updated At': now
  });
}
