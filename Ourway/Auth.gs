function registerUser(payload) {
  return withLock_(function() {
    setupSystem();
    const fullName = normalizeText_(payload.fullName);
    const shortName = normalizeText_(payload.shortName);
    const email = normalizeEmail_(payload.email);
    const phone = normalizeText_(payload.phone);
    const role = normalizeRole_(payload.role || 'Employee');
    const password = String(payload.password || '');

    if (!fullName || !shortName || !email || !password) {
      throw new Error('Full name, short name, email, and password are required.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    if (getUserByEmail_(email)) {
      throw new Error('Email already exists.');
    }

    if (getUserByShortName_(shortName)) {
      throw new Error('Short name must be unique.');
    }

    const now = nowIso_();
    const passwordRecord = createPasswordRecord_(password);

    appendRecord_(APP_CONFIG.sheets.users, {
      'User ID': buildId_('USR'),
      'Full Name': fullName,
      'Short Name': shortName,
      'Email': email,
      'Phone': phone,
      'Role': role,
      'Password Hash': passwordRecord.hash,
      'Password Salt': passwordRecord.salt,
      'Status': APP_CONFIG.statuses.pending,
      'Approved By': '',
      'Approved At': '',
      'Created At': now,
      'Updated At': now
    });

    return {
      ok: true,
      message: 'Registration submitted. Wait for approval before logging in.'
    };
  });
}

function loginUser(payload) {
  setupSystem();
  const email = normalizeEmail_(payload.email);
  const password = String(payload.password || '');
  const user = getUserByEmail_(email);

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const hash = hashPassword_(password, user['Password Salt']);
  if (hash !== user['Password Hash']) {
    throw new Error('Invalid email or password.');
  }

  if (user['Status'] !== APP_CONFIG.statuses.approved) {
    throw new Error('Your account is ' + user['Status'] + '.');
  }

  const token = createSession_(user);
  return {
    ok: true,
    token: token,
    user: sanitizeUser_(user)
  };
}

function logoutUser(token) {
  revokeSession_(token);
  return { ok: true };
}
