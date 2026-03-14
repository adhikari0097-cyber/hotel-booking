function getAppData(token) {
  const user = requireSession_(token);
  const users = sortByDateDesc_(getRecords_(APP_CONFIG.sheets.users).map(sanitizeUser_), 'createdAt');
  const attendanceRecords = sortByDateDesc_(
    getAttendanceRecordsForUser_(user).map(attendanceDto_),
    'clockIn'
  );
  const leaveRequests = sortByDateDesc_(
    getLeaveRecordsForUser_(user).map(leaveDto_),
    'createdAt'
  );
  const notices = sortByDateDesc_(getNoticeRecordsForUser_(user), 'createdAt');
  const tasks = sortByDateDesc_(
    getTaskRecordsForUser_(user).map(taskDto_),
    'updatedAt'
  );
  const qcRecords = sortByDateDesc_(getQcRecordsForUser_(user).map(qcDto_), 'reviewedAt');
  const attendanceState = getTodayAttendanceState_(user);

  return {
    currentUser: sanitizeUser_(user),
    permissions: {
      canManage: isManager_(user)
    },
    stats: buildDashboardStats_(user),
    attendanceState: attendanceState,
    users: isManager_(user) ? users : [],
    approvedUsers: isManager_(user) ? users.filter(function(item) { return item.status === APP_CONFIG.statuses.approved; }) : [],
    attendance: attendanceRecords,
    leaveRequests: leaveRequests,
    notices: notices,
    tasks: tasks,
    qcRecords: qcRecords,
    meta: {
      spreadsheetUrl: getSpreadsheet_().getUrl(),
      maxLeaveDays: APP_CONFIG.maxLeaveDays
    }
  };
}

function reviewUser(token, payload) {
  return withLock_(function() {
    const manager = requireRoles_(token, ['Admin', 'Coordinator']);
    const action = normalizeText_(payload.action).toLowerCase();
    if (['approve', 'reject'].indexOf(action) === -1) {
      throw new Error('Invalid approval action.');
    }
    const user = getUserById_(payload.userId);
    if (!user) {
      throw new Error('User not found.');
    }

    const now = nowIso_();
    const approvedRole = normalizeRole_(payload.role || user['Role']);
    const nextStatus = action === 'approve' ? APP_CONFIG.statuses.approved : APP_CONFIG.statuses.rejected;

    updateRecord_(APP_CONFIG.sheets.users, user._rowNumber, {
      'Role': approvedRole,
      'Status': nextStatus,
      'Approved By': manager['Full Name'],
      'Approved At': now,
      'Updated At': now
    });

    if (nextStatus !== APP_CONFIG.statuses.approved) {
      const userSessionsPrefix = '"userId":"' + user['User ID'] + '"';
      const props = PropertiesService.getScriptProperties();
      props.getKeys().forEach(function(key) {
        if (key.indexOf('SESSION_') === 0 && String(props.getProperty(key)).indexOf(userSessionsPrefix) > -1) {
          props.deleteProperty(key);
        }
      });
    }

    return { ok: true };
  });
}

function clockIn(token, payload) {
  return withLock_(function() {
    const user = requireSession_(token);
    const today = dateKey_();
    const attendanceSheet = APP_CONFIG.sheets.attendance;
    const existing = getRecords_(attendanceSheet).find(function(record) {
      return record['User ID'] === user['User ID'] && record['Date'] === today;
    });

    if (existing) {
      throw new Error('You have already clocked in today.');
    }

    const now = nowIso_();
    appendRecord_(attendanceSheet, {
      'Attendance ID': buildId_('ATT'),
      'User ID': user['User ID'],
      'Full Name': user['Full Name'],
      'Date': today,
      'Work Mode': normalizeText_(payload.workMode) || 'Remote',
      'Clock In': now,
      'Clock Out': '',
      'Duration Minutes': '',
      'Notes': normalizeText_(payload.notes),
      'Created At': now,
      'Updated At': now
    });

    return { ok: true };
  });
}

function clockOut(token) {
  return withLock_(function() {
    const user = requireSession_(token);
    const today = dateKey_();
    const attendance = getRecords_(APP_CONFIG.sheets.attendance).find(function(record) {
      return record['User ID'] === user['User ID'] && record['Date'] === today;
    });

    if (!attendance) {
      throw new Error('Clock in first.');
    }

    if (attendance['Clock Out']) {
      throw new Error('You have already clocked out today.');
    }

    const now = nowIso_();
    updateRecord_(APP_CONFIG.sheets.attendance, attendance._rowNumber, {
      'Clock Out': now,
      'Duration Minutes': minutesBetween_(attendance['Clock In'], now),
      'Updated At': now
    });

    return { ok: true };
  });
}

function saveAttendanceRecord(token, payload) {
  return withLock_(function() {
    requireRoles_(token, ['Admin', 'Coordinator']);
    const record = findRecord_(APP_CONFIG.sheets.attendance, 'Attendance ID', payload.attendanceId);
    if (!record) {
      throw new Error('Attendance record not found.');
    }

    const clockIn = normalizeText_(payload.clockIn);
    const clockOut = normalizeText_(payload.clockOut);
    updateRecord_(APP_CONFIG.sheets.attendance, record._rowNumber, {
      'Date': normalizeText_(payload.date) || record['Date'],
      'Work Mode': normalizeText_(payload.workMode) || record['Work Mode'],
      'Clock In': clockIn || record['Clock In'],
      'Clock Out': clockOut,
      'Duration Minutes': clockOut ? minutesBetween_(clockIn || record['Clock In'], clockOut) : '',
      'Notes': normalizeText_(payload.notes),
      'Updated At': nowIso_()
    });

    return { ok: true };
  });
}

function applyLeave(token, payload) {
  return withLock_(function() {
    const user = requireSession_(token);
    const fromDate = normalizeText_(payload.fromDate);
    const toDate = normalizeText_(payload.toDate);
    const leaveType = normalizeText_(payload.leaveType);
    const reason = normalizeText_(payload.reason);

    if (!fromDate || !toDate || !leaveType) {
      throw new Error('From date, to date, and leave type are required.');
    }

    const days = inclusiveDays_(fromDate, toDate);
    if (days < 1) {
      throw new Error('Invalid leave range.');
    }
    if (days > APP_CONFIG.maxLeaveDays) {
      throw new Error('A leave request cannot exceed ' + APP_CONFIG.maxLeaveDays + ' days.');
    }

    const now = nowIso_();
    appendRecord_(APP_CONFIG.sheets.leaveRequests, {
      'Leave ID': buildId_('LEV'),
      'User ID': user['User ID'],
      'Full Name': user['Full Name'],
      'From Date': fromDate,
      'To Date': toDate,
      'Days': days,
      'Leave Type': leaveType,
      'Reason': reason,
      'Status': APP_CONFIG.statuses.pending,
      'Reviewed By': '',
      'Reviewed At': '',
      'Created At': now,
      'Updated At': now
    });

    return { ok: true };
  });
}

function reviewLeave(token, payload) {
  return withLock_(function() {
    const manager = requireRoles_(token, ['Admin', 'Coordinator']);
    const leave = findRecord_(APP_CONFIG.sheets.leaveRequests, 'Leave ID', payload.leaveId);
    if (!leave) {
      throw new Error('Leave request not found.');
    }

    const action = normalizeText_(payload.action).toLowerCase();
    if (['approve', 'reject'].indexOf(action) === -1) {
      throw new Error('Invalid leave action.');
    }
    const status = action === 'approve' ? APP_CONFIG.statuses.approved : APP_CONFIG.statuses.rejected;
    const now = nowIso_();

    updateRecord_(APP_CONFIG.sheets.leaveRequests, leave._rowNumber, {
      'Status': status,
      'Reviewed By': manager['Full Name'],
      'Reviewed At': now,
      'Updated At': now
    });

    return { ok: true };
  });
}

function createNotice(token, payload) {
  return withLock_(function() {
    const manager = requireRoles_(token, ['Admin', 'Coordinator']);
    const title = normalizeText_(payload.title);
    const message = normalizeText_(payload.message);
    if (!title || !message) {
      throw new Error('Title and message are required.');
    }

    const now = nowIso_();
    appendRecord_(APP_CONFIG.sheets.notices, {
      'Notice ID': buildId_('NTC'),
      'Title': title,
      'Message': message,
      'Created By': manager['Full Name'],
      'Response Required': payload.responseRequired ? 'TRUE' : 'FALSE',
      'Status': APP_CONFIG.statuses.active,
      'Created At': now,
      'Updated At': now
    });

    return { ok: true };
  });
}

function respondToNotice(token, payload) {
  return withLock_(function() {
    const user = requireSession_(token);
    const notice = findRecord_(APP_CONFIG.sheets.notices, 'Notice ID', payload.noticeId);
    if (!notice) {
      throw new Error('Notice not found.');
    }

    const response = normalizeText_(payload.response);
    if (['Yes', 'No'].indexOf(response) === -1) {
      throw new Error('Response must be Yes or No.');
    }

    const existing = getRecords_(APP_CONFIG.sheets.noticeResponses).find(function(record) {
      return record['Notice ID'] === notice['Notice ID'] && record['User ID'] === user['User ID'];
    });
    const now = nowIso_();

    if (existing) {
      updateRecord_(APP_CONFIG.sheets.noticeResponses, existing._rowNumber, {
        'Response': response,
        'Responded At': now
      });
    } else {
      appendRecord_(APP_CONFIG.sheets.noticeResponses, {
        'Response ID': buildId_('NTR'),
        'Notice ID': notice['Notice ID'],
        'User ID': user['User ID'],
        'Full Name': user['Full Name'],
        'Response': response,
        'Responded At': now
      });
    }

    return { ok: true };
  });
}

function saveTask(token, payload) {
  return withLock_(function() {
    const manager = requireRoles_(token, ['Admin', 'Coordinator']);
    const title = normalizeText_(payload.title);
    const assignedUserId = normalizeText_(payload.assignedUserId);
    const description = normalizeText_(payload.description);
    const clientName = normalizeText_(payload.clientName);
    const deadline = normalizeText_(payload.deadline);
    const assignedUser = getUserById_(assignedUserId);

    if (!title || !assignedUser || assignedUser['Status'] !== APP_CONFIG.statuses.approved) {
      throw new Error('Valid task title and assigned user are required.');
    }

    const now = nowIso_();
    if (payload.taskId) {
      const task = findRecord_(APP_CONFIG.sheets.tasks, 'Task ID', payload.taskId);
      if (!task) {
        throw new Error('Task not found.');
      }

      updateRecord_(APP_CONFIG.sheets.tasks, task._rowNumber, {
        'Title': title,
        'Description': description,
        'Assigned User ID': assignedUser['User ID'],
        'Assigned User Name': assignedUser['Full Name'],
        'Client Name': clientName,
        'Deadline': deadline,
        'Updated At': now
      });
    } else {
      appendRecord_(APP_CONFIG.sheets.tasks, {
        'Task ID': buildId_('TSK'),
        'Track Code': buildTrackCode_(),
        'Title': title,
        'Description': description,
        'Assigned User ID': assignedUser['User ID'],
        'Assigned User Name': assignedUser['Full Name'],
        'Client Name': clientName,
        'Deadline': deadline,
        'Status': APP_CONFIG.statuses.assigned,
        'Start Time': '',
        'Completion Time': '',
        'Time Spent Minutes': '',
        'Submitted For QC At': '',
        'Last QC Status': '',
        'Rejection Reason': '',
        'Chat Feedback Link': '',
        'Created By': manager['Full Name'],
        'Created At': now,
        'Updated At': now
      });
    }

    return { ok: true };
  });
}

function startTask(token, payload) {
  return withLock_(function() {
    const user = requireSession_(token);
    const task = findRecord_(APP_CONFIG.sheets.tasks, 'Task ID', payload.taskId);
    if (!task) {
      throw new Error('Task not found.');
    }
    if (task['Assigned User ID'] !== user['User ID']) {
      throw new Error('This task is not assigned to you.');
    }
    if ([APP_CONFIG.statuses.assigned, APP_CONFIG.statuses.rejected].indexOf(task['Status']) === -1) {
      throw new Error('This task cannot be started right now.');
    }

    const now = nowIso_();
    updateRecord_(APP_CONFIG.sheets.tasks, task._rowNumber, {
      'Status': APP_CONFIG.statuses.inProgress,
      'Start Time': now,
      'Completion Time': '',
      'Time Spent Minutes': '',
      'Submitted For QC At': '',
      'Rejection Reason': '',
      'Chat Feedback Link': '',
      'Updated At': now
    });

    return { ok: true };
  });
}

function completeTask(token, payload) {
  return withLock_(function() {
    const user = requireSession_(token);
    const task = findRecord_(APP_CONFIG.sheets.tasks, 'Task ID', payload.taskId);
    if (!task) {
      throw new Error('Task not found.');
    }
    if (task['Assigned User ID'] !== user['User ID']) {
      throw new Error('This task is not assigned to you.');
    }
    if (task['Status'] !== APP_CONFIG.statuses.inProgress) {
      throw new Error('Start the task before completing it.');
    }

    const now = nowIso_();
    updateRecord_(APP_CONFIG.sheets.tasks, task._rowNumber, {
      'Status': APP_CONFIG.statuses.completed,
      'Completion Time': now,
      'Time Spent Minutes': minutesBetween_(task['Start Time'], now),
      'Updated At': now
    });

    return { ok: true };
  });
}

function submitTaskForQc(token, payload) {
  return withLock_(function() {
    const user = requireSession_(token);
    const task = findRecord_(APP_CONFIG.sheets.tasks, 'Task ID', payload.taskId);
    if (!task) {
      throw new Error('Task not found.');
    }
    if (task['Assigned User ID'] !== user['User ID']) {
      throw new Error('This task is not assigned to you.');
    }
    if (task['Status'] !== APP_CONFIG.statuses.completed) {
      throw new Error('Only completed tasks can be submitted for QC.');
    }

    const now = nowIso_();
    updateRecord_(APP_CONFIG.sheets.tasks, task._rowNumber, {
      'Status': APP_CONFIG.statuses.pendingQc,
      'Submitted For QC At': now,
      'Last QC Status': APP_CONFIG.statuses.pendingQc,
      'Updated At': now
    });

    return { ok: true };
  });
}

function reviewTaskQc(token, payload) {
  return withLock_(function() {
    const manager = requireRoles_(token, ['Admin', 'Coordinator']);
    const task = findRecord_(APP_CONFIG.sheets.tasks, 'Task ID', payload.taskId);
    if (!task) {
      throw new Error('Task not found.');
    }
    if (task['Status'] !== APP_CONFIG.statuses.pendingQc) {
      throw new Error('This task is not waiting for QC.');
    }

    const action = normalizeText_(payload.action).toLowerCase();
    if (['approve', 'reject'].indexOf(action) === -1) {
      throw new Error('Invalid QC action.');
    }
    const status = action === 'approve' ? APP_CONFIG.statuses.approved : APP_CONFIG.statuses.rejected;
    const reason = normalizeText_(payload.rejectionReason);
    const chatFeedbackLink = normalizeText_(payload.chatFeedbackLink);
    const comments = normalizeText_(payload.comments);
    const now = nowIso_();

    if (status === APP_CONFIG.statuses.rejected && !reason) {
      throw new Error('A rejection reason is required.');
    }

    updateRecord_(APP_CONFIG.sheets.tasks, task._rowNumber, {
      'Status': status,
      'Last QC Status': status,
      'Rejection Reason': status === APP_CONFIG.statuses.rejected ? reason : '',
      'Chat Feedback Link': status === APP_CONFIG.statuses.rejected ? chatFeedbackLink : '',
      'Updated At': now
    });

    appendRecord_(APP_CONFIG.sheets.qcRecords, {
      'QC ID': buildId_('QC'),
      'Task ID': task['Task ID'],
      'Track Code': task['Track Code'],
      'Review Status': status,
      'Reviewed By': manager['Full Name'],
      'Reviewed At': now,
      'Rejection Reason': status === APP_CONFIG.statuses.rejected ? reason : '',
      'Chat Feedback Link': status === APP_CONFIG.statuses.rejected ? chatFeedbackLink : '',
      'Comments': comments
    });

    return { ok: true };
  });
}

function getAttendanceRecordsForUser_(user) {
  const records = getRecords_(APP_CONFIG.sheets.attendance);
  return isManager_(user) ? records : records.filter(function(record) {
    return record['User ID'] === user['User ID'];
  });
}

function getLeaveRecordsForUser_(user) {
  const records = getRecords_(APP_CONFIG.sheets.leaveRequests);
  return isManager_(user) ? records : records.filter(function(record) {
    return record['User ID'] === user['User ID'];
  });
}

function getNoticeRecordsForUser_(user) {
  const notices = getRecords_(APP_CONFIG.sheets.notices);
  const responses = getRecords_(APP_CONFIG.sheets.noticeResponses);
  return notices.map(function(record) {
    const matching = responses.filter(function(response) {
      return response['Notice ID'] === record['Notice ID'];
    });
    const responseSummary = matching.reduce(function(summary, response) {
      if (response['Response'] === 'Yes') summary.yes += 1;
      if (response['Response'] === 'No') summary.no += 1;
      return summary;
    }, { yes: 0, no: 0 });
    const userResponse = matching.find(function(response) {
      return response['User ID'] === user['User ID'];
    });
    return noticeDto_(record, responseSummary, userResponse ? userResponse['Response'] : '');
  });
}

function getTaskRecordsForUser_(user) {
  const records = getRecords_(APP_CONFIG.sheets.tasks);
  return isManager_(user) ? records : records.filter(function(record) {
    return record['Assigned User ID'] === user['User ID'];
  });
}

function getQcRecordsForUser_(user) {
  const qcRecords = getRecords_(APP_CONFIG.sheets.qcRecords);
  if (isManager_(user)) return qcRecords;

  const tasks = getTaskRecordsForUser_(user);
  const allowedTaskIds = tasks.map(function(task) { return task['Task ID']; });
  return qcRecords.filter(function(record) {
    return allowedTaskIds.indexOf(record['Task ID']) > -1;
  });
}

function getTodayAttendanceState_(user) {
  const today = dateKey_();
  const record = getRecords_(APP_CONFIG.sheets.attendance).find(function(item) {
    return item['User ID'] === user['User ID'] && item['Date'] === today;
  });

  return {
    today: today,
    record: record ? attendanceDto_(record) : null,
    canClockIn: !record,
    canClockOut: !!(record && !record['Clock Out'])
  };
}

function buildDashboardStats_(user) {
  const users = getRecords_(APP_CONFIG.sheets.users);
  const attendance = getRecords_(APP_CONFIG.sheets.attendance);
  const leaveRequests = getRecords_(APP_CONFIG.sheets.leaveRequests);
  const notices = getNoticeRecordsForUser_(user);
  const tasks = getTaskRecordsForUser_(user);

  const base = {
    pendingUsers: 0,
    pendingLeaves: 0,
    pendingQc: 0,
    openTasks: 0,
    noticesAwaitingResponse: 0,
    clockedInToday: 0
  };

  if (isManager_(user)) {
    base.pendingUsers = users.filter(function(item) {
      return item['Status'] === APP_CONFIG.statuses.pending;
    }).length;
    base.pendingLeaves = leaveRequests.filter(function(item) {
      return item['Status'] === APP_CONFIG.statuses.pending;
    }).length;
    base.pendingQc = tasks.filter(function(item) {
      return item['Status'] === APP_CONFIG.statuses.pendingQc;
    }).length;
    base.openTasks = tasks.filter(function(item) {
      return [APP_CONFIG.statuses.assigned, APP_CONFIG.statuses.inProgress, APP_CONFIG.statuses.completed, APP_CONFIG.statuses.pendingQc, APP_CONFIG.statuses.rejected].indexOf(item['Status']) > -1;
    }).length;
    base.clockedInToday = attendance.filter(function(item) {
      return item['Date'] === dateKey_();
    }).length;
    base.totalApprovedUsers = users.filter(function(item) {
      return item['Status'] === APP_CONFIG.statuses.approved;
    }).length;
  } else {
    base.pendingLeaves = leaveRequests.filter(function(item) {
      return item['User ID'] === user['User ID'] && item['Status'] === APP_CONFIG.statuses.pending;
    }).length;
    base.pendingQc = tasks.filter(function(item) {
      return item['Assigned User ID'] === user['User ID'] && item['Status'] === APP_CONFIG.statuses.pendingQc;
    }).length;
    base.openTasks = tasks.filter(function(item) {
      return item['Assigned User ID'] === user['User ID'] && item['Status'] !== APP_CONFIG.statuses.approved;
    }).length;
  }

  base.noticesAwaitingResponse = notices.filter(function(item) {
    return item.responseRequired && !item.userResponse;
  }).length;

  return base;
}
