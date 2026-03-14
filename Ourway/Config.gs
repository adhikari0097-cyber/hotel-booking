const APP_CONFIG = Object.freeze({
  appName: 'Internal Employee Management System',
  spreadsheetName: 'Internal Employee Management System',
  defaultTimezone: 'Asia/Colombo',
  sessionTtlHours: 12,
  maxLeaveDays: 7,
  defaultAdmin: {
    fullName: 'System Administrator',
    shortName: 'ADMIN',
    email: 'admin@example.com',
    phone: '',
    role: 'Admin',
    password: 'Admin@123'
  },
  roles: ['Admin', 'Coordinator', 'Employee'],
  statuses: {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    active: 'Active',
    assigned: 'Assigned',
    inProgress: 'In Progress',
    completed: 'Completed',
    pendingQc: 'Pending QC'
  },
  sheets: Object.freeze({
    users: 'Users',
    attendance: 'Attendance',
    leaveRequests: 'Leave Requests',
    notices: 'Notices',
    noticeResponses: 'Notice Responses',
    tasks: 'Tasks',
    qcRecords: 'QC Records'
  })
});

const SHEET_HEADERS = Object.freeze({
  Users: [
    'User ID',
    'Full Name',
    'Short Name',
    'Email',
    'Phone',
    'Role',
    'Password Hash',
    'Password Salt',
    'Status',
    'Approved By',
    'Approved At',
    'Created At',
    'Updated At'
  ],
  Attendance: [
    'Attendance ID',
    'User ID',
    'Full Name',
    'Date',
    'Work Mode',
    'Clock In',
    'Clock Out',
    'Duration Minutes',
    'Notes',
    'Created At',
    'Updated At'
  ],
  'Leave Requests': [
    'Leave ID',
    'User ID',
    'Full Name',
    'From Date',
    'To Date',
    'Days',
    'Leave Type',
    'Reason',
    'Status',
    'Reviewed By',
    'Reviewed At',
    'Created At',
    'Updated At'
  ],
  Notices: [
    'Notice ID',
    'Title',
    'Message',
    'Created By',
    'Response Required',
    'Status',
    'Created At',
    'Updated At'
  ],
  'Notice Responses': [
    'Response ID',
    'Notice ID',
    'User ID',
    'Full Name',
    'Response',
    'Responded At'
  ],
  Tasks: [
    'Task ID',
    'Track Code',
    'Title',
    'Description',
    'Assigned User ID',
    'Assigned User Name',
    'Client Name',
    'Deadline',
    'Status',
    'Start Time',
    'Completion Time',
    'Time Spent Minutes',
    'Submitted For QC At',
    'Last QC Status',
    'Rejection Reason',
    'Chat Feedback Link',
    'Created By',
    'Created At',
    'Updated At'
  ],
  'QC Records': [
    'QC ID',
    'Task ID',
    'Track Code',
    'Review Status',
    'Reviewed By',
    'Reviewed At',
    'Rejection Reason',
    'Chat Feedback Link',
    'Comments'
  ]
});
