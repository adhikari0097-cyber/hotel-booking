const CONFIG = {
  SUPABASE_URL: "https://rxeeeejdyxtbqnvxfxde.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_IvUExYz6ZOxtslILNlB6fw_kEu_Sv78",
  SUPABASE_TABLE: "bookings",
  SUPABASE_PROFILES_TABLE: "profiles",
  SUPABASE_REQUESTS_TABLE: "booking_change_requests",
  SUPABASE_PRICING_TABLE: "room_pricing",
  SUPABASE_ROOMS_TABLE: "room_inventory",
  SUPABASE_SERVICES_TABLE: "service_catalog",
  SUPABASE_RUNTIME_SETTINGS_TABLE: "booking_runtime_settings",
  SUPABASE_NOTIFICATIONS_TABLE: "booking_notifications",
  SUPABASE_NOTIFICATION_READS_TABLE: "booking_notification_reads",
  SUPABASE_SYSTEM_UPDATES_TABLE: "system_update_history",
  SUPABASE_DEDUCTIONS_TABLE: "monthly_deductions",
  GOOGLE_SHEETS_BACKUP_URL: "/.netlify/functions/proxy",
};

const RESERVATION_WHATSAPP_NUMBER = "+94719707597";

const DEFAULT_SERVICE_DEFS = [
  { name: "Breakfast", defaultPrice: 0, isActive: true, sortOrder: 1 },
  { name: "Lunch", defaultPrice: 0, isActive: true, sortOrder: 2 },
  { name: "Dinner", defaultPrice: 0, isActive: true, sortOrder: 3 },
  { name: "Liquor", defaultPrice: 0, isActive: true, sortOrder: 4 },
  { name: "Kitchen", defaultPrice: 0, isActive: true, sortOrder: 5 },
  { name: "Car", defaultPrice: 0, isActive: true, sortOrder: 6 },
  { name: "Van", defaultPrice: 0, isActive: true, sortOrder: 7 },
];

const EXPORT_FIELD_DEFS = [
  { key: "trackCode", label: "Track Code", note: "Show reservation track code." },
  { key: "customer", label: "Customer", note: "Show customer / guest name." },
  { key: "phone", label: "Phone", note: "Show customer phone number." },
  { key: "bookedBy", label: "Booked By", note: "Show staff member who created the booking." },
  { key: "stay", label: "Stay Dates", note: "Show check-in and check-out date range." },
  { key: "notes", label: "Notes", note: "Show booking notes / special requests." },
  { key: "totalPax", label: "Total Pax", note: "Show total guest count." },
  { key: "rooms", label: "Rooms", note: "Show number of rooms in the reservation." },
  { key: "totalPrice", label: "Total Price", note: "Show booking total price." },
  { key: "customPrice", label: "Custom Price", note: "Show total custom price amount." },
  { key: "lifecycle", label: "Lifecycle", note: "Show booked / checked-in / checked-out / hold status." },
  { key: "advance", label: "Advance Status", note: "Show whether advance payment was received." },
  { key: "advanceAmount", label: "Advance Amount", note: "Show advance payment amount." },
  { key: "balance", label: "Balance", note: "Show remaining balance amount." },
  { key: "checkInAt", label: "Checked In At", note: "Show actual check-in timestamp." },
  { key: "checkOutAt", label: "Checked Out At", note: "Show actual check-out timestamp." },
  { key: "exportedAt", label: "Exported At", note: "Show export generated timestamp." },
  { key: "services", label: "Services", note: "Show selected services as chips/list." },
  { key: "servicePrices", label: "Service Prices", note: "Show prices attached to services." },
  { key: "customPriceEntries", label: "Custom Price Entries", note: "Show itemized custom prices." },
  { key: "roomDetails", label: "Room Details", note: "Show room-by-room reservation breakdown." },
];

const BOOKING_VIEW_FIELD_DEFS = [
  { key: "stay", label: "Stay", note: "Show stay date range in the booking header." },
  { key: "rooms", label: "Rooms", note: "Show room count." },
  { key: "totalPax", label: "Total Pax", note: "Show total pax count." },
  { key: "lifecycle", label: "Lifecycle", note: "Show booking lifecycle status." },
  { key: "balance", label: "Balance", note: "Show balance amount." },
  { key: "trackCode", label: "Track Code", note: "Show reservation track code." },
  { key: "customer", label: "Customer", note: "Show customer name." },
  { key: "bookedBy", label: "Booked By", note: "Show staff member who created the booking." },
  { key: "phone", label: "Phone", note: "Show customer phone number." },
  { key: "checkIn", label: "Check In", note: "Show check-in date." },
  { key: "checkOut", label: "Check Out", note: "Show check-out date." },
  { key: "status", label: "Status", note: "Show booking source / status." },
  { key: "statusNote", label: "Status Note", note: "Show waiting-for-confirmation note when relevant." },
  { key: "checkInAt", label: "Check In At", note: "Show actual check-in time." },
  { key: "checkOutAt", label: "Check Out At", note: "Show actual check-out time." },
  { key: "totalPrice", label: "Total Price", note: "Show booking total price." },
  { key: "advance", label: "Advance", note: "Show advance payment status." },
  { key: "customPrice", label: "Custom Price", note: "Show total custom price amount." },
  { key: "advanceAmount", label: "Advance Amount", note: "Show advance payment amount." },
];

const ROOM_FIX_SECTION_DEFS = [
  { key: "pdf", label: "PDF Export" },
  { key: "whatsapp", label: "WhatsApp Message" },
  { key: "shareMessages", label: "Customer Share Messages" },
  { key: "bookingView", label: "View By Date Booking Group" },
  { key: "notifications", label: "Notifications" },
  { key: "systemUpdates", label: "System Updates" },
];

const SHARE_COPY_DEFAULTS = {
  rebookingNote: "For another booking, please inform us at least 3 days in advance.",
  contactNote: "For more information, call or WhatsApp +94719707597.",
  pdfKeepNote: "Please keep this PDF safe for your booking record.",
};

const NOTIFICATION_ROLE_DEFS = [
  { key: "owner", label: "Owner", note: "Owner can open the Notifications page and see all booking activity." },
  { key: "admin", label: "Admin", note: "Admin can open the Notifications page and see all booking activity." },
  { key: "user", label: "User", note: "Normal users can open the Notifications page and see only their own relevant updates." },
];

const ROOM_DEFS = [
  { type: "kitchen", label: "Kitchen Room", count: 2, maxPax: 6 },
  { type: "normal", label: "Normal Room", count: 4, maxPax: 4 },
  { type: "driver", label: "Driver Room", count: 1, maxPax: 4 },
];

const ROOM_CLIMATE_OPTIONS = [
  { key: "ac", label: "A/C Room", acEnabled: true },
  { key: "non_ac", label: "Non A/C Room", acEnabled: false },
];

const ROOM_PRICING_DEFS = [
  { roomType: "kitchen", pax: 0, acEnabled: true, label: "Kitchen Room · A/C", note: "Kitchen room uses one fixed price with A/C. Pax does not change the rate." },
  { roomType: "kitchen", pax: 0, acEnabled: false, label: "Kitchen Room · Non A/C", note: "Kitchen room uses one fixed price without A/C. Pax does not change the rate." },
  { roomType: "driver", pax: 0, acEnabled: true, label: "Driver Room", note: "Driver room uses one fixed price." },
  { roomType: "normal", pax: 1, acEnabled: true, label: "Normal Room · 1 Pax · A/C", note: "Fixed room price for 1 guest with A/C." },
  { roomType: "normal", pax: 1, acEnabled: false, label: "Normal Room · 1 Pax · Non A/C", note: "Fixed room price for 1 guest without A/C." },
  { roomType: "normal", pax: 2, acEnabled: true, label: "Normal Room · 2 Pax · A/C", note: "Fixed room price for 2 guests with A/C." },
  { roomType: "normal", pax: 2, acEnabled: false, label: "Normal Room · 2 Pax · Non A/C", note: "Fixed room price for 2 guests without A/C." },
  { roomType: "normal", pax: 3, acEnabled: true, label: "Normal Room · 3 Pax · A/C", note: "Fixed room price for 3 guests with A/C." },
  { roomType: "normal", pax: 3, acEnabled: false, label: "Normal Room · 3 Pax · Non A/C", note: "Fixed room price for 3 guests without A/C." },
  { roomType: "normal", pax: 4, acEnabled: true, label: "Normal Room · 4 Pax · A/C", note: "Fixed room price for 4 guests with A/C." },
  { roomType: "normal", pax: 4, acEnabled: false, label: "Normal Room · 4 Pax · Non A/C", note: "Fixed room price for 4 guests without A/C." },
];

const EXTRA_PERMISSION_DEFS = [
  {
    key: "manage_bookings",
    label: "Booking Control",
    note: "Directly update bookings, room prices, advance, and reservation changes.",
  },
  {
    key: "manage_requests",
    label: "Request Approval",
    note: "View all requests and approve or reject them.",
  },
  {
    key: "manage_pricing",
    label: "Settings Access",
    note: "Open Settings and save room prices, notification access, room setup, and share settings.",
  },
  {
    key: "manage_accounts",
    label: "Accounts Access",
    note: "Open Accounts and approve or block staff accounts.",
  },
];

const ADMIN_ACCESS_PERMISSION_KEYS = ["manage_bookings", "manage_requests", "manage_pricing", "manage_accounts"];

const state = {
  supabase: null,
  realtimeChannel: null,
  currentMonthDate: new Date(),
  currentProfile: null,
  currentSession: null,
  roomPlans: new Map(),
  bookingServices: new Set(),
  bookingMap: new Map(),
  bookingGroups: new Map(),
  plannerBookingGroups: new Map(),
  requestMap: new Map(),
  profileMap: new Map(),
  activeBooking: null,
  activeBookingGroup: [],
  modalExtraRooms: new Map(),
  modalRemoveRooms: new Map(),
  modalBookingRoomEdits: new Map(),
  modalRequestedServices: new Set(),
  modalCustomPayments: [],
  modalMode: "request",
  requestScope: "single",
  bookingListFilter: "active",
  currentPlannerBookings: [],
  currentPlannerStartDate: "",
  currentPlannerRangeDays: 14,
  plannerAccentColor: "#93c0ec",
  plannerTrackColors: {},
  selectedPlannerGroupKey: "",
  requestsFilterMode: "recent",
  requestsFilterStatus: "pending",
  bookingViewMode: "mobile",
  mobileNavDock: "bottom",
  roomPricing: new Map(),
  pricingSchemaReady: null,
  bookingCustomPayments: [],
  roomInventory: [],
  serviceCatalog: [],
  roomInventorySchemaReady: null,
  runtimeSettings: {
    checkInTime: "14:00",
    checkOutTime: "11:00",
    pdfFields: EXPORT_FIELD_DEFS.map((item) => item.key),
    whatsappFields: EXPORT_FIELD_DEFS.map((item) => item.key),
    bookingViewFields: BOOKING_VIEW_FIELD_DEFS.map((item) => item.key),
    notificationRoles: ["owner", "admin"],
    systemUpdateRoles: ["owner", "admin"],
    shareRebookingNote: SHARE_COPY_DEFAULTS.rebookingNote,
    shareContactNote: SHARE_COPY_DEFAULTS.contactNote,
    sharePdfKeepNote: SHARE_COPY_DEFAULTS.pdfKeepNote,
  },
  notifications: [],
  recentNotifications: [],
  notificationPreset: "this-week",
  notificationUnreadCount: 0,
  systemUpdates: [],
  systemUpdatePreset: "this-week",
  deductions: [],
  currentAnalyticsSnapshot: null,
  bookingRangePicker: null,
  plannerDragBookingId: null,
  uiPreviewRole: "",
  guideBookSections: [],
  guideBookFaq: [],
};

const qs = (selector) => document.querySelector(selector);

function setHTML(node, html) {
  if (node) node.innerHTML = html;
}

function setValue(node, value) {
  if (node) node.value = value;
}

function setText(node, text) {
  if (node) node.textContent = text;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toggleHidden(node, hidden) {
  if (node) node.classList.toggle("hidden", hidden);
}

function splitGuestTitleAndName(value = "") {
  const raw = String(value || "").trim();
  const match = raw.match(/^(Mr|Ms|Rev)\.?\s+(.*)$/i);
  if (!match) {
    return { title: "", name: raw };
  }
  const normalizedTitle = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
  return {
    title: normalizedTitle,
    name: String(match[2] || "").trim(),
  };
}

function combineGuestTitleAndName(title = "", name = "") {
  const cleanName = String(name || "").trim();
  const cleanTitle = String(title || "").trim();
  return cleanTitle && cleanName ? `${cleanTitle} ${cleanName}` : cleanName;
}

function normalizePermissionList(value) {
  if (Array.isArray(value)) {
    return Array.from(new Set(value.map((item) => String(item || "").trim()).filter(Boolean)));
  }
  if (!value) return [];
  if (typeof value === "string") {
    try {
      return normalizePermissionList(JSON.parse(value));
    } catch (error) {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
}

function normalizeProfileRow(profile) {
  if (!profile) return null;
  return {
    ...profile,
    extra_permissions: normalizePermissionList(profile.extra_permissions),
  };
}

function getPreviewPermissionList(role = "") {
  if (role === "owner" || role === "admin") return [...ADMIN_ACCESS_PERMISSION_KEYS];
  return [];
}

function getVisiblePageLabelsForRole(role = "user") {
  const labels = [
    "New Booking",
    "View By Date",
    "Booking Planner",
    "Analytics",
    "Guide Book",
    "Hold Bookings",
    "Requests",
  ];
  if (normalizeNotificationRoleList(state.runtimeSettings?.notificationRoles).includes(role)) {
    labels.push("Notifications");
  }
  if (normalizeSystemUpdateRoleList(state.runtimeSettings?.systemUpdateRoles).includes(role)) {
    labels.push("System Updates");
  }
  if (["owner", "admin"].includes(role)) {
    labels.push("Deductions", "Accounts", "Settings");
  }
  return labels;
}

function getEffectiveProfile(profile = state.currentProfile) {
  if (!profile) return null;
  if (!state.uiPreviewRole || profile.role !== "owner") return profile;
  return {
    ...profile,
    role: state.uiPreviewRole,
    extra_permissions: getPreviewPermissionList(state.uiPreviewRole),
  };
}

function profileHasPermission(profile, permissionKey) {
  const effectiveProfile = getEffectiveProfile(profile);
  if (!effectiveProfile?.approved) return false;
  if (["owner", "admin"].includes(effectiveProfile.role)) return true;
  return normalizePermissionList(effectiveProfile.extra_permissions).includes(permissionKey);
}

function permissionListHasAll(permissionList, requiredKeys) {
  const normalized = normalizePermissionList(permissionList);
  return requiredKeys.every((key) => normalized.includes(key));
}

function getStoredBookingViewMode() {
  try {
    return window.localStorage.getItem("app-view-mode") || window.localStorage.getItem("booking-view-mode");
  } catch (error) {
    return null;
  }
}

function getStoredMobileNavDock() {
  try {
    const stored = String(window.localStorage.getItem("mobile-nav-dock") || "").trim().toLowerCase();
    return ["bottom", "left", "right"].includes(stored) ? stored : "bottom";
  } catch (error) {
    return "bottom";
  }
}

function getEffectiveMobileNavDock(position = state.mobileNavDock) {
  const normalized = ["bottom", "left", "right"].includes(position) ? position : "bottom";
  if (state.bookingViewMode === "desktop" || window.innerWidth >= 980) return "bottom";
  return normalized;
}

function applyMobileNavDock(position = state.mobileNavDock, { persist = false } = {}) {
  const normalized = ["bottom", "left", "right"].includes(position) ? position : "bottom";
  state.mobileNavDock = normalized;
  if (persist) {
    try {
      window.localStorage.setItem("mobile-nav-dock", normalized);
    } catch (error) {
      // Ignore storage failures.
    }
  }
  const effectiveDock = getEffectiveMobileNavDock(normalized);
  bottomNav?.classList.toggle("nav-dock-left", effectiveDock === "left");
  bottomNav?.classList.toggle("nav-dock-right", effectiveDock === "right");
  bottomNav?.classList.toggle("nav-dock-bottom", effectiveDock === "bottom");
  appShell?.classList.toggle("mobile-nav-side-left", effectiveDock === "left");
  appShell?.classList.toggle("mobile-nav-side-right", effectiveDock === "right");
  bottomNavDragHandle?.setAttribute(
    "title",
    effectiveDock === "bottom"
      ? "Drag to left or right side"
      : effectiveDock === "left"
        ? "Drag to bottom or right side"
        : "Drag to bottom or left side",
  );
  syncBottomNavLayout(Array.from(Object.values(navButtons)).filter((button) => button && !button.classList.contains("hidden")).length);
}

function getNextMobileNavDock(position = state.mobileNavDock) {
  if (position === "bottom") return "right";
  if (position === "right") return "left";
  return "bottom";
}

function resolveMobileNavDockFromPoint(clientX, clientY) {
  const sideThreshold = Math.min(132, window.innerWidth * 0.26);
  const bottomThreshold = Math.min(180, window.innerHeight * 0.28);
  if (clientY >= window.innerHeight - bottomThreshold) return "bottom";
  if (clientX <= sideThreshold) return "left";
  if (clientX >= window.innerWidth - sideThreshold) return "right";
  return state.mobileNavDock || "bottom";
}

function syncBottomNavLayout(visibleTabs = 4) {
  if (!bottomNav) return;
  const isDesktopNav = state.bookingViewMode === "desktop" && window.innerWidth >= 980;
  const dock = getEffectiveMobileNavDock();
  if (isDesktopNav) {
    bottomNav.style.gridTemplateColumns = `repeat(${visibleTabs}, 1fr)`;
    return;
  }
  bottomNav.style.gridTemplateColumns = dock === "bottom" ? "repeat(4, minmax(0, 1fr))" : "1fr";
}

function getStoredPlannerAccentColor() {
  try {
    const stored = window.localStorage.getItem("planner-accent-color");
    return /^#[0-9a-f]{6}$/i.test(String(stored || "").trim()) ? String(stored).trim() : "#93c0ec";
  } catch (error) {
    return "#93c0ec";
  }
}

function normalizePlannerTrackColors(trackColors = {}) {
  if (!trackColors || typeof trackColors !== "object" || Array.isArray(trackColors)) return {};
  return Object.entries(trackColors).reduce((acc, [key, value]) => {
    const normalizedKey = String(key || "").trim();
    const normalizedColor = /^#[0-9a-f]{6}$/i.test(String(value || "").trim()) ? String(value).trim() : "";
    if (!normalizedKey || !normalizedColor) return acc;
    acc[normalizedKey] = normalizedColor;
    return acc;
  }, {});
}

function getStoredPlannerTrackColors() {
  try {
    const raw = JSON.parse(window.localStorage.getItem("planner-track-colors") || "{}");
    return normalizePlannerTrackColors(raw);
  } catch (error) {
    return {};
  }
}

function getPresetRangeDates(presetKey) {
  const today = parseDate(new Date());
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  switch (presetKey) {
    case "this-week": {
      const day = today.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      const from = addDays(today, diff);
      return { from, to: addDays(from, 6) };
    }
    case "two-weeks":
      return { from: today, to: addDays(today, 13) };
    case "this-month":
      return { from: startOfMonth(today), to: endOfMonth(today) };
    case "next-month": {
      const base = new Date(currentYear, currentMonth + 1, 1, 12, 0, 0);
      return { from: startOfMonth(base), to: endOfMonth(base) };
    }
    case "last-month": {
      const base = new Date(currentYear, currentMonth - 1, 1, 12, 0, 0);
      return { from: startOfMonth(base), to: endOfMonth(base) };
    }
    case "this-year":
      return { from: new Date(currentYear, 0, 1, 12, 0, 0), to: new Date(currentYear, 11, 31, 12, 0, 0) };
    case "last-year":
      return { from: new Date(currentYear - 1, 0, 1, 12, 0, 0), to: new Date(currentYear - 1, 11, 31, 12, 0, 0) };
    default:
      return { from: today, to: today };
  }
}

function ensureSelectOptionValue(select, value, label) {
  if (!select) return;
  if (!Array.from(select.options).some((option) => Number(option.value) === Number(value))) {
    const option = document.createElement("option");
    option.value = String(value);
    option.textContent = label;
    select.appendChild(option);
  }
  select.value = String(value);
}

function applyPlannerPreset(presetKey) {
  if (!plannerStartDateInput || !plannerRangeDaysInput) return;
  const { from, to } = getPresetRangeDates(presetKey);
  const days = Math.max(7, getNightCount(formatDateKey(from), formatDateKey(addDays(to, 1))));
  plannerStartDateInput.value = toDateInputValue(from);
  ensureSelectOptionValue(plannerRangeDaysInput, days, `${days} Days`);
  loadReservationPlanner();
}

function setStoredPlannerAccentColor(color) {
  const normalized = /^#[0-9a-f]{6}$/i.test(String(color || "").trim()) ? String(color).trim() : "#93c0ec";
  state.plannerAccentColor = normalized;
  try {
    window.localStorage.setItem("planner-accent-color", normalized);
  } catch (error) {
    // Ignore local storage failures and keep the in-memory color.
  }
}

function setStoredPlannerTrackColors(trackColors = {}) {
  state.plannerTrackColors = normalizePlannerTrackColors(trackColors);
  try {
    window.localStorage.setItem("planner-track-colors", JSON.stringify(state.plannerTrackColors));
  } catch (error) {
    // Ignore local storage failures and keep the in-memory map.
  }
}

function canEditPlannerColors() {
  return isOwnerOrAdminRole();
}

function applyAnalyticsPreset(presetKey) {
  if (!analyticsDateFromInput || !analyticsDateToInput) return;
  const { from, to } = getPresetRangeDates(presetKey);
  analyticsDateFromInput.value = toDateInputValue(from);
  analyticsDateToInput.value = toDateInputValue(to);
  loadAnalytics();
}

function openNativeDatePicker(input) {
  if (!input) return;
  try {
    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }
  } catch (error) {
    // Some browsers only allow showPicker during trusted click events.
  }
  input.focus({ preventScroll: true });
  input.click();
}

async function setViewDateSelection(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime()) || !viewDateInput) return;
  const nextValue = toDateInputValue(date);
  viewDateInput.value = nextValue;
  state.currentMonthDate = startOfMonth(date);
  await loadMonthCalendar();
  await loadBookingsForDate(nextValue);
}

function applyAnalyticsQuickRange(fromDate, toDate) {
  if (!(fromDate instanceof Date) || !(toDate instanceof Date) || !analyticsDateFromInput || !analyticsDateToInput) return;
  analyticsDateFromInput.value = toDateInputValue(fromDate);
  analyticsDateToInput.value = toDateInputValue(toDate);
  loadAnalytics();
}

function formatAnalyticsDateLabel(dateString) {
  const date = parseDate(dateString);
  if (!date) return "Not selected";
  return date.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function getAnalyticsFilterDisplayValue(select, allLabel) {
  if (!select) return allLabel;
  if (!select.value || select.value === "all") return allLabel;
  return select.selectedOptions?.[0]?.textContent?.trim() || select.value;
}

function getSelectedAnalyticsChipValues(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll("[data-analytics-chip-value].filter-chip-active"))
    .map((button) => String(button.dataset.analyticsChipValue || "").trim())
    .filter(Boolean);
}

function getAnalyticsChipFilterDisplayValue(container, allLabel) {
  const selectedValues = getSelectedAnalyticsChipValues(container);
  return selectedValues.length ? selectedValues.join(", ") : allLabel;
}

const ANALYTICS_RESERVATION_STATES = [
  "Pending Booking",
  "Booked",
  "Checked In",
  "Checked Out",
];

function populateAnalyticsChipFilter(container, values = []) {
  if (!container) return;
  const selectedValues = new Set(getSelectedAnalyticsChipValues(container));
  const orderedValues = values.filter(Boolean);
  container.innerHTML = orderedValues.map((value) => `
    <button
      class="filter-chip${selectedValues.has(value) ? " filter-chip-active" : ""}"
      type="button"
      data-analytics-chip-value="${escapeHtml(value)}"
    >${escapeHtml(value)}</button>
  `).join("");
}

function getAnalyticsGroupStateLabel(group) {
  if (isAnalyticsPendingGroup(group)) return "Pending Booking";
  return getLifecycleStatusLabel(getGroupLifecycleStatus(group));
}

function isAnalyticsPendingGroup(group) {
  if (!group?.bookings?.length) return false;
  const hasPendingStatus = group.bookings.some((booking) => String(booking.status || "").toLowerCase() === "pending");
  if (hasPendingStatus) return true;

  const pendingCollections = getLatestPendingRequestCollections();
  const groupKey = group.trackCode || group.key || getBookingGroupKey(group.bookings[0]);
  const hasPendingRequest = pendingCollections.byTrack.get(groupKey)?.status === "pending"
    || group.bookings.some((booking) => pendingCollections.byBooking.get(booking.id)?.status === "pending");
  if (hasPendingRequest) return true;

  return !getAdvancePaymentInfo(group.bookings).allPaid;
}

function getSelectedAnalyticsStates() {
  return getSelectedAnalyticsChipValues(analyticsFilterStateChips);
}

function getAnalyticsStateFilterDisplayValue() {
  return getAnalyticsChipFilterDisplayValue(analyticsFilterStateChips, "All States");
}

function populateAnalyticsStateChips(values = []) {
  const actualValues = Array.from(new Set((values || []).filter(Boolean)));
  const orderedValues = [];
  ANALYTICS_RESERVATION_STATES.forEach((value) => {
    if (actualValues.includes(value)) {
      orderedValues.push(value);
      return;
    }
    if (value === "Pending Booking") {
      orderedValues.push(value);
    }
  });
  actualValues.forEach((value) => {
    if (!orderedValues.includes(value)) orderedValues.push(value);
  });
  populateAnalyticsChipFilter(analyticsFilterStateChips, orderedValues);
}

function renderAnalyticsResultsContext({ count } = {}) {
  if (!analyticsResultsContext) return;
  const dateValue = analyticsDateFromInput?.value && analyticsDateToInput?.value
    ? `${formatAnalyticsDateLabel(analyticsDateFromInput.value)} -> ${formatAnalyticsDateLabel(analyticsDateToInput.value)}`
    : "Select From and To dates";
  const metricValue = analyticsFilterMetric?.selectedOptions?.[0]?.textContent?.trim() || "Revenue";
  const deductionsValue = canAccessDeductions()
    ? (analyticsIncludeDeductions?.checked ? "Included" : "Hidden")
    : "Restricted";
  const items = [
    { label: "Date Range", value: dateValue },
    { label: "Reservation State", value: getAnalyticsStateFilterDisplayValue() },
    { label: "Source", value: getAnalyticsChipFilterDisplayValue(analyticsFilterSourceChips, "All Sources") },
    { label: "Booked By", value: getAnalyticsChipFilterDisplayValue(analyticsFilterStaffChips, "All Staff") },
    { label: "Hold Payments", value: analyticsIncludeHoldPayments?.checked ? "Shown" : "Hidden" },
    { label: "Deductions", value: deductionsValue },
    { label: "Trend View", value: metricValue },
    { label: "Results", value: typeof count === "number" ? `${count} reservations` : "Load analytics to refresh" },
  ];
  setHTML(analyticsResultsContext, `
    <div class="analytics-results-head">
      <strong>Results Based On</strong>
      <span>These analytics cards and charts follow the filters shown below.</span>
    </div>
    <div class="analytics-results-chip-list">
      ${items.map((item) => `
        <div class="analytics-results-chip">
          <strong>${escapeHtml(item.label)}</strong>
          <span>${escapeHtml(item.value)}</span>
        </div>
      `).join("")}
    </div>
  `);
}

function jumpToSettingsSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getDefaultBookingViewMode() {
  const stored = getStoredBookingViewMode();
  if (stored === "mobile" || stored === "desktop") return stored;
  return window.innerWidth >= 1200 ? "desktop" : "mobile";
}

function applyBookingViewMode() {
  const effectiveMode = state.bookingViewMode === "desktop" && window.innerWidth >= 980 ? "desktop" : "mobile";
  appShell?.classList.toggle("view-desktop", effectiveMode === "desktop");
  appShell?.classList.toggle("view-mobile", effectiveMode !== "desktop");
  bookingListCard.classList.toggle("booking-view-desktop", effectiveMode === "desktop");
  bookingListCard.classList.toggle("booking-view-mobile", effectiveMode !== "desktop");
  bookingViewMobileBtn?.classList.toggle("view-mode-btn-active", state.bookingViewMode === "mobile");
  bookingViewDesktopBtn?.classList.toggle("view-mode-btn-active", state.bookingViewMode === "desktop");
  applyMobileNavDock(state.mobileNavDock);
}

function slugifyText(value = "") {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getGuideSectionIcon(title = "") {
  const text = String(title || "").toLowerCase();
  if (text.includes("new booking") || text.includes("add booking")) return "📝";
  if (text.includes("before saving")) return "✅";
  if (text.includes("wrong booking") || text.includes("fix")) return "🛠";
  if (text.includes("hold")) return "⏸";
  if (text.includes("delete")) return "🗑";
  if (text.includes("reactivate")) return "🔄";
  if (text.includes("check-in") || text.includes("check out")) return "🛎";
  if (text.includes("share")) return "💬";
  if (text.includes("daily")) return "📌";
  if (text.includes("ask owner")) return "👤";
  return "📘";
}

function parseGuideBookMarkdown(markdownText) {
  const lines = String(markdownText || "").split(/\r?\n/);
  const model = {
    title: "Guide Book",
    sections: [],
    faq: [],
  };
  let currentSection = null;
  let currentFaq = null;
  let inFaq = false;
  let pendingList = null;

  const ensureList = (style = "bullet") => {
    if (!currentSection) return null;
    if (!pendingList || pendingList.style !== style) {
      pendingList = { type: "list", style, items: [] };
      currentSection.blocks.push(pendingList);
    }
    return pendingList;
  };

  const closeList = () => {
    pendingList = null;
  };

  const pushParagraph = (text) => {
    if (inFaq && currentFaq) {
      currentFaq.answer.push(text);
      return;
    }
    if (!currentSection) return;
    closeList();
    currentSection.blocks.push({ type: "paragraph", text });
  };

  lines.forEach((rawLine) => {
    const text = rawLine.trim();
    if (!text) {
      closeList();
      return;
    }
    if (text.startsWith("# ")) {
      model.title = text.slice(2).trim();
      return;
    }
    if (text.startsWith("## ")) {
      closeList();
      const title = text.slice(3).trim();
      inFaq = title.toLowerCase() === "faq";
      currentFaq = null;
      if (inFaq) return;
      currentSection = {
        id: slugifyText(title),
        title,
        icon: getGuideSectionIcon(title),
        blocks: [],
      };
      model.sections.push(currentSection);
      return;
    }
    if (text.startsWith("### ")) {
      closeList();
      const title = text.slice(4).trim();
      if (inFaq) {
        currentFaq = { question: title, answer: [] };
        model.faq.push(currentFaq);
        return;
      }
      if (!currentSection) return;
      currentSection.blocks.push({ type: "subheading", text: title });
      return;
    }
    if (/^\d+\.\s+/.test(text)) {
      const list = ensureList("ordered");
      list?.items.push(text.replace(/^\d+\.\s+/, "").trim());
      return;
    }
    if (text.startsWith("- ")) {
      const list = ensureList("bullet");
      list?.items.push(text.slice(2).trim());
      return;
    }
    pushParagraph(text);
  });

  return model;
}

function getGuideSectionSearchText(section = {}) {
  return [
    section.title,
    ...(section.blocks || []).flatMap((block) => {
      if (block.type === "list") return block.items || [];
      return block.text || "";
    }),
  ].join(" ").toLowerCase();
}

function renderGuideSectionBlock(block = {}) {
  if (block.type === "subheading") {
    return `<h3>${escapeHtml(block.text || "")}</h3>`;
  }
  if (block.type === "paragraph") {
    return `<p>${escapeHtml(block.text || "")}</p>`;
  }
  if (block.type === "list") {
    const listClass = block.style === "ordered" ? "guide-check-list guide-step-list" : "guide-check-list";
    return `
      <div class="${listClass}">
        ${(block.items || []).map((item, index) => `
          <div class="guide-check-item">
            <span class="guide-check-index">${block.style === "ordered" ? index + 1 : "•"}</span>
            <span>${escapeHtml(item)}</span>
          </div>
        `).join("")}
      </div>
    `;
  }
  return "";
}

function renderGuideBookPage() {
  if (!guideBookContent || !guideNav || !guideStats || !guideFaqList) return;
  const searchTerm = String(guideSearchInput?.value || "").trim().toLowerCase();
  const filteredSections = state.guideBookSections.filter((section) => {
    if (!searchTerm) return true;
    return getGuideSectionSearchText(section).includes(searchTerm);
  });
  const filteredFaq = state.guideBookFaq.filter((item) => {
    if (!searchTerm) return true;
    return `${item.question} ${item.answer.join(" ")}`.toLowerCase().includes(searchTerm);
  });

  guideStats.innerHTML = `
    <div class="analytics-stat-card">
      <span>Sections</span>
      <strong>${filteredSections.length}</strong>
    </div>
    <div class="analytics-stat-card">
      <span>FAQ</span>
      <strong>${filteredFaq.length}</strong>
    </div>
    <div class="analytics-stat-card">
      <span>Search</span>
      <strong>${searchTerm ? `"${escapeHtml(searchTerm)}"` : "All"}</strong>
    </div>
  `;

  guideNav.innerHTML = filteredSections.map((section, index) => `
    <button class="secondary-btn small-btn" type="button" data-guide-jump="${escapeHtml(section.id)}">
      ${escapeHtml(`${index + 1}. ${section.title}`)}
    </button>
  `).join("");

  guideBookContent.innerHTML = filteredSections.length
    ? filteredSections.map((section, index) => `
        <section id="${escapeHtml(section.id)}" class="guide-section-card">
          <div class="guide-section-head">
            <div class="guide-section-badge">${escapeHtml(section.icon || "📘")}</div>
            <div>
              <span class="guide-section-kicker">Section ${index + 1}</span>
              <h2>${escapeHtml(section.title)}</h2>
            </div>
          </div>
          <div class="guide-section-body">
            ${(section.blocks || []).map((block) => renderGuideSectionBlock(block)).join("")}
          </div>
        </section>
      `).join("")
    : '<p class="inline-note">No guide results found for this search.</p>';

  guideFaqList.innerHTML = filteredFaq.length
    ? filteredFaq.map((item, index) => `
        <details class="guide-faq-item"${searchTerm && index === 0 ? " open" : ""}>
          <summary>${escapeHtml(item.question)}</summary>
          <div class="guide-faq-answer">
            ${(item.answer || []).map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
          </div>
        </details>
      `).join("")
    : '<p class="inline-note">No FAQ results found.</p>';

  guideNav.querySelectorAll("[data-guide-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      document.getElementById(button.dataset.guideJump)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

async function loadGuideBook() {
  if (!guideBookContent) return;
  try {
    guideBookContent.innerHTML = '<p class="inline-note">Loading guide book...</p>';
    const guideCandidates = ["GUIDE_BOOK.md", "./GUIDE_BOOK.md", "/GUIDE_BOOK.md"];
    let markdown = "";
    let lastError = null;
    for (const guidePath of guideCandidates) {
      try {
        const response = await fetch(guidePath, { cache: "no-store" });
        if (!response.ok) {
          lastError = new Error("Guide book could not be loaded.");
          continue;
        }
        markdown = await response.text();
        if (markdown.trim()) break;
      } catch (error) {
        lastError = error;
      }
    }
    if (!markdown.trim()) throw lastError || new Error("Guide book could not be loaded.");
    const guideModel = parseGuideBookMarkdown(markdown);
    state.guideBookSections = guideModel.sections;
    state.guideBookFaq = guideModel.faq;
    renderGuideBookPage();
  } catch (error) {
    state.guideBookSections = [];
    state.guideBookFaq = [];
    guideNav.innerHTML = "";
    guideStats.innerHTML = "";
    guideFaqList.innerHTML = "";
    guideBookContent.innerHTML = `<p class="inline-note">${escapeHtml(error.message || "Guide book could not be loaded.")}</p>`;
  }
}

function setBookingViewMode(mode) {
  state.bookingViewMode = mode === "desktop" ? "desktop" : "mobile";
  try {
    window.localStorage.setItem("app-view-mode", state.bookingViewMode);
    window.localStorage.setItem("booking-view-mode", state.bookingViewMode);
  } catch (error) {
    // Ignore storage failures.
  }
  applyBookingViewMode();
  if (screens.planner?.classList.contains("screen-active") && plannerStartDateInput?.value) {
    loadReservationPlanner();
  }
}

function bindMobileNavDockControls() {
  if (!bottomNavDragHandle) return;
  let dragging = false;
  let moved = false;

  const stopDragging = (event) => {
    if (!dragging) return;
    dragging = false;
    bottomNav?.classList.remove("nav-dragging");
    const nextDock = resolveMobileNavDockFromPoint(event.clientX, event.clientY);
    applyMobileNavDock(nextDock, { persist: true });
    if (moved) {
      window.setTimeout(() => {
        bottomNavDragHandle.dataset.dragMoved = "0";
      }, 0);
    }
  };

  bottomNavDragHandle.addEventListener("pointerdown", (event) => {
    if (state.bookingViewMode === "desktop" || window.innerWidth >= 980) return;
    dragging = true;
    moved = false;
    bottomNavDragHandle.dataset.dragMoved = "0";
    bottomNav?.classList.add("nav-dragging");
    bottomNavDragHandle.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });

  bottomNavDragHandle.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const previewDock = resolveMobileNavDockFromPoint(event.clientX, event.clientY);
    moved = true;
    bottomNavDragHandle.dataset.dragMoved = "1";
    applyMobileNavDock(previewDock);
  });

  bottomNavDragHandle.addEventListener("pointerup", stopDragging);
  bottomNavDragHandle.addEventListener("pointercancel", stopDragging);

  bottomNavDragHandle.addEventListener("click", (event) => {
    if (bottomNavDragHandle.dataset.dragMoved === "1") {
      bottomNavDragHandle.dataset.dragMoved = "0";
      event.preventDefault();
      return;
    }
    applyMobileNavDock(getNextMobileNavDock(state.mobileNavDock), { persist: true });
  });
}

function refreshRequestModalNodeRefs() {
  requestExtraRoomsSection = qs("#request-extra-rooms-section");
  requestExtraRooms = qs("#request-extra-rooms");
  requestServicesSection = qs("#request-services-section");
  requestServices = qs("#request-services");
  requestRemoveRoomsSection = qs("#request-remove-rooms-section");
  requestRemoveRooms = qs("#request-remove-rooms");
  requestBookingRoomsSection = qs("#request-booking-rooms-section");
  requestBookingRooms = qs("#request-booking-rooms");
}

function ensureRequestModalSections() {
  if (!requestForm) return;
  const statusField = requestStatusInput?.closest(".field");
  const insertBefore = statusField || requestForm.querySelector("#request-notes")?.closest(".field");
  const sectionDefs = [
    {
      sectionId: "request-extra-rooms-section",
      containerId: "request-extra-rooms",
      label: "Additional Rooms",
      note: "Select extra rooms only when the reason is requesting additional rooms.",
      className: "extra-room-grid",
    },
    {
      sectionId: "request-services-section",
      containerId: "request-services",
      label: "Additional Services",
      note: "Select the extra services requested for this booking.",
      className: "service-grid",
    },
    {
      sectionId: "request-remove-rooms-section",
      containerId: "request-remove-rooms",
      label: "Remove Rooms",
      note: "Select the rooms that should be removed from this booking.",
      className: "extra-room-grid",
    },
    {
      sectionId: "request-booking-rooms-section",
      containerId: "request-booking-rooms",
      label: "Booking Rooms",
      note: "Update room, pax, and services for each room in this booking.",
      className: "extra-room-grid",
    },
  ];

  sectionDefs.forEach(({ sectionId, containerId, label, note, className }) => {
    if (document.getElementById(sectionId) && document.getElementById(containerId)) return;
    const section = document.createElement("div");
    section.id = sectionId;
    section.className = "field hidden";
    section.innerHTML = `
      <label>${label}</label>
      <p class="inline-note">${note}</p>
      <div id="${containerId}" class="${className}"></div>
    `;
    if (insertBefore?.parentNode) insertBefore.parentNode.insertBefore(section, insertBefore);
    else requestForm.appendChild(section);
  });

  refreshRequestModalNodeRefs();
}

const authShell = qs("#auth-shell");
const pendingShell = qs("#pending-shell");
const appShell = qs("#app-shell");
const authMessage = qs("#auth-message");
const loginForm = qs("#login-form");
const signupForm = qs("#signup-form");
const authTabLogin = qs("#auth-tab-login");
const authTabSignup = qs("#auth-tab-signup");
const pendingCopy = qs("#pending-copy");
const pendingLogoutBtn = qs("#pending-logout");
const logoutBtn = qs("#logout-btn");
const userChip = qs("#user-chip");

const bookingForm = qs("#booking-form");
const bookingGuestTitleInput = qs("#guestTitle");
const bookingPhoneInput = qs("#phone");
const signupPhoneInput = qs("#signup-phone");
const bookingDateRangeInput = qs("#bookingDateRange");
const bookingCheckInInput = qs("#checkIn");
const bookingCheckOutInput = qs("#checkOut");
const toast = qs("#toast");
const syncStatus = qs("#sync-status");
const bottomNav = qs("#bottom-nav");
const bottomNavDragHandle = qs("#bottom-nav-drag-handle");
const guestsInput = qs("#guests");
const bookingCards = qs("#booking-cards");
const bookingEmpty = qs("#booking-empty");
const bookingListCard = qs("#booking-list");
const bookingViewMobileBtn = qs("#app-view-mobile");
const bookingViewDesktopBtn = qs("#app-view-desktop");
  const bookingFilterButtons = {
  active: qs("#booking-filter-active"),
  cancelled: qs("#booking-filter-cancelled"),
  all: qs("#booking-filter-all"),
  pending: qs("#booking-filter-pending"),
};
const plannerStartDateInput = qs("#plannerStartDate");
const plannerRangeDaysInput = qs("#plannerRangeDays");
const plannerLoadBtn = qs("#loadPlanner");
const plannerPresetButtons = Array.from(document.querySelectorAll("[data-planner-preset]"));
const plannerSearchInput = qs("#planner-search");
const plannerColorInput = qs("#planner-color");
const plannerColorTarget = qs("#planner-color-target");
const plannerSummaryRange = qs("#plannerSummaryRange");
const plannerSummaryReservations = qs("#plannerSummaryReservations");
const plannerSummaryNights = qs("#plannerSummaryNights");
const plannerSummaryRooms = qs("#plannerSummaryRooms");
const reservationPlannerBoard = qs("#reservation-planner-board");
const reservationPlannerEmpty = qs("#reservation-planner-empty");
const holdBookingCards = qs("#hold-booking-cards");
const holdBookingEmpty = qs("#hold-booking-empty");
const roomStatusList = qs("#room-status-list");
const statTotal = qs("#stat-total");
const statOccupied = qs("#stat-occupied");
const statAvailable = qs("#stat-available");
const monthLabel = qs("#month-label");
const monthGrid = qs("#month-grid");
const monthPrevBtn = qs("#month-prev");
const monthNextBtn = qs("#month-next");
const viewDateInput = qs("#viewDate");
const viewDateTodayBtn = qs("#view-date-today");
const viewDateTomorrowBtn = qs("#view-date-tomorrow");
const viewDateOpenBtn = qs("#view-date-open");
const loadBookingsBtn = qs("#loadBookings");
const checkAvailabilityBtn = qs("#checkAvailability");
const availNormal = qs("#avail-normal");
const availKitchen = qs("#avail-kitchen");
const availDriver = qs("#avail-driver");
const bookedNormal = qs("#booked-normal");
const bookedKitchen = qs("#booked-kitchen");
const bookedDriver = qs("#booked-driver");
const availabilityHint = qs("#availability-hint");
const kitchenPlanner = qs("#planner-kitchen");
const normalPlanner = qs("#planner-normal");
const driverPlanner = qs("#planner-driver");
const driversTotalInput = qs("#driversTotal");
const extraGuestsTotalInput = qs("#extraGuestsTotal");
const roomServiceAssignments = qs("#room-service-assignments");
const pricingSummaryList = qs("#pricing-summary-list");
const pricingSummaryEmpty = qs("#pricing-summary-empty");
const pricingSummaryTotal = qs("#pricing-summary-total");
const bookingOfferOptions = Array.from(document.querySelectorAll('input[name="booking-offer"]'));
const bookingOfferCustomField = qs("#booking-offer-custom-field");
const bookingOfferCustomInput = qs("#booking-offer-custom");
const bookingOfferPreview = qs("#booking-offer-preview");
const bookingAdvancePaidInput = qs("#advancePaid");
const bookingAdvanceAmountField = qs("#advanceAmountField");
const bookingAdvanceAmountInput = qs("#advanceAmount");
const bookingAdvanceBalancePreview = qs("#advanceBalancePreview");
const bookingCustomPaymentsField = qs("#customPaymentsField");
const bookingCustomPaymentList = qs("#customPaymentList");
const bookingAddCustomPaymentBtn = qs("#addCustomPayment");
const bookingCustomPaymentsTotal = qs("#customPaymentsTotal");
const notificationBellBtn = qs("#notification-bell");
const notificationBellBadge = qs("#notification-bell-badge");
const previewBanner = qs("#preview-banner");
const previewBannerText = qs("#preview-banner-text");
const previewBannerResetBtn = qs("#preview-banner-reset");
const accountsList = qs("#accounts-list");
const accountsEmpty = qs("#accounts-empty");
const refreshAccountsBtn = qs("#refresh-accounts");
const roomInventoryList = qs("#room-inventory-list");
const pricingList = qs("#pricing-list");
const serviceCatalogList = qs("#service-catalog-list");
const exportSettingsList = qs("#export-settings-list");
const refreshPricingBtn = qs("#refresh-pricing");
const savePricingBtn = qs("#save-pricing");
const runtimeCheckInTimeInput = qs("#runtime-checkin-time");
const runtimeCheckOutTimeInput = qs("#runtime-checkout-time");
const requestsList = qs("#requests-list");
const requestsEmpty = qs("#requests-empty");
const refreshRequestsBtn = qs("#refresh-requests");
const requestsHelper = qs("#requests-helper");
const requestsTrackFilter = qs("#requests-track-filter");
const requestsRequestedByFilter = qs("#requests-requested-by-filter");
const requestsDateFromFilter = qs("#requests-date-from");
const requestsDateToFilter = qs("#requests-date-to");
const requestFilterButtons = Array.from(document.querySelectorAll("[data-filter-mode], [data-filter-status]"));
const notificationsList = qs("#notifications-list");
const notificationsEmpty = qs("#notifications-empty");
const refreshNotificationsBtn = qs("#refresh-notifications");
const notificationPresetButtons = Array.from(document.querySelectorAll("[data-notification-preset]"));
const notificationRangeLabel = qs("#notification-range-label");
const notificationTotalCount = qs("#notification-total-count");
const notificationUnreadCount = qs("#notification-unread-count");
const settingsJumpButtons = Array.from(document.querySelectorAll("[data-settings-jump]"));
const requestModal = qs("#request-modal");
const closeModalBtn = qs("#close-modal");
const requestForm = qs("#request-form");
const modalBookingId = qs("#modal-booking-id");
const modalTitle = qs("#modal-title");
const requestReasonField = qs("#request-reason-field");
const requestReasonInput = qs("#request-reason");
const requestGuestTitleInput = qs("#request-guest-title");
const requestGuestNameInput = qs("#request-guest-name");
const requestPhoneInput = qs("#request-phone");
const requestCurrentDates = qs("#request-current-dates");
const requestCurrentRoom = qs("#request-current-room");
const requestCheckInLabel = qs("#request-checkin-label");
const requestCheckOutLabel = qs("#request-checkout-label");
const requestCheckInInput = qs("#request-check-in");
const requestCheckOutInput = qs("#request-check-out");
const requestDateHelp = qs("#request-date-help");
const requestRoomTypeInput = qs("#request-room-type");
const requestRoomNumberInput = qs("#request-room-number");
const requestGuestsField = qs("#request-guests-field");
const requestGuestsInput = qs("#request-guests");
let requestExtraRoomsSection = qs("#request-extra-rooms-section");
let requestExtraRooms = qs("#request-extra-rooms");
let requestServicesSection = qs("#request-services-section");
let requestServices = qs("#request-services");
let requestRemoveRoomsSection = qs("#request-remove-rooms-section");
let requestRemoveRooms = qs("#request-remove-rooms");
let requestBookingRoomsSection = qs("#request-booking-rooms-section");
let requestBookingRooms = qs("#request-booking-rooms");
const requestPriceSection = qs("#request-price-section");
const requestCurrentPrice = qs("#request-current-price");
const requestWeekendRateInput = qs("#request-weekend-rate");
const requestWeekdayRateInput = qs("#request-weekday-rate");
const requestOfferOptions = Array.from(document.querySelectorAll('input[name="request-offer"]'));
const requestOfferCustomField = qs("#request-offer-custom-field");
const requestOfferCustomInput = qs("#request-offer-custom");
const requestOfferPreview = qs("#request-offer-preview");
const requestCustomPriceField = qs("#request-custom-price-field");
const requestCustomPriceList = qs("#request-custom-price-list");
const requestAddCustomPriceBtn = qs("#request-add-custom-price");
const requestCustomPriceTotal = qs("#request-custom-price-total");
const requestAdvanceField = qs("#request-advance-field");
const requestAdvancePaidInput = qs("#request-advance-paid");
const requestAdvanceAmountField = qs("#request-advance-amount-field");
const requestAdvanceAmountInput = qs("#request-advance-amount");
const requestStatusInput = qs("#request-status");
const requestNotesInput = qs("#request-notes");
const requestMessageInput = qs("#request-message");
const requestSubmitBtn = qs("#request-submit");
const bookingDetailsModal = qs("#booking-details-modal");
const bookingDetailsTitle = qs("#booking-details-title");
const bookingDetailsBody = qs("#booking-details-body");
const closeBookingDetailsBtn = qs("#close-booking-details");
const analyticsDateFromInput = qs("#analytics-date-from");
const analyticsDateToInput = qs("#analytics-date-to");
const loadAnalyticsBtn = qs("#load-analytics");
const analyticsQuickTodayBtn = qs("#analytics-quick-today");
const analyticsQuickWeekBtn = qs("#analytics-quick-week");
const analyticsPickFromBtn = qs("#analytics-pick-from");
const analyticsPickToBtn = qs("#analytics-pick-to");
const analyticsPresetButtons = Array.from(document.querySelectorAll("[data-analytics-preset]"));
const analyticsResultsContext = qs("#analytics-results-context");
const analyticsTotalEarn = qs("#analytics-total-earn");
const analyticsTotalBookings = qs("#analytics-total-bookings");
const analyticsAverageBooking = qs("#analytics-average-booking");
const analyticsPendingBalance = qs("#analytics-pending-balance");
const analyticsRoomNights = qs("#analytics-room-nights");
const analyticsAverageStay = qs("#analytics-average-stay");
const analyticsTopRooms = qs("#analytics-top-rooms");
const analyticsRoomTypes = qs("#analytics-room-types");
const analyticsServices = qs("#analytics-services");
const analyticsCustomers = qs("#analytics-customers");
const analyticsStatuses = qs("#analytics-statuses");
const analyticsSources = qs("#analytics-sources");
const analyticsTitles = qs("#analytics-titles");
const analyticsStaff = qs("#analytics-staff");
const analyticsTrendChart = qs("#analytics-trend-chart");
const analyticsInsights = qs("#analytics-insights");
const analyticsFilterStateChips = qs("#analytics-filter-state-chips");
const analyticsFilterSourceChips = qs("#analytics-filter-source-chips");
const analyticsFilterStaffChips = qs("#analytics-filter-staff-chips");
const analyticsIncludeHoldPayments = qs("#analytics-include-hold-payments");
const analyticsIncludeDeductions = qs("#analytics-include-deductions");
const analyticsDeductionsToggleRow = qs("#analytics-deductions-toggle-row");
const analyticsFilterMetric = qs("#analytics-filter-metric");
const analyticsEmpty = qs("#analytics-empty");
const analyticsHoldPayments = qs("#analytics-hold-payments");
const analyticsTotalDeductions = qs("#analytics-total-deductions");
const analyticsNetProfit = qs("#analytics-net-profit");
const analyticsDeductionsList = qs("#analytics-deductions-list");
const exportAnalyticsBtn = qs("#export-analytics");
const deductionMonthLabel = qs("#deduction-month-label");
const deductionMonthTotal = qs("#deduction-month-total");
const deductionMonthCount = qs("#deduction-month-count");
const deductionMonthFilterInput = qs("#deduction-month-filter");
const deductionForm = qs("#deduction-form");
const deductionEntryList = qs("#deduction-entry-list");
const addDeductionRowBtn = qs("#add-deduction-row");
const saveDeductionBtn = qs("#save-deduction");
const deductionList = qs("#deduction-list");
const deductionEmpty = qs("#deduction-empty");
const guideBookContent = qs("#guide-book-content");
const guideSearchInput = qs("#guide-search");
const guideNav = qs("#guide-nav");
const guideStats = qs("#guide-stats");
const guideFaqList = qs("#guide-faq-list");
const refreshGuideBtn = qs("#refresh-guide");
const settingsPreviewPanel = qs("#settings-preview-panel");

const navButtons = {
  booking: qs("#tab-booking"),
  view: qs("#tab-view"),
  planner: qs("#tab-planner"),
  analytics: qs("#tab-analytics"),
  deductions: qs("#tab-deductions"),
  guide: qs("#tab-guide"),
  hold: qs("#tab-hold"),
  requests: qs("#tab-requests"),
  notifications: qs("#tab-notifications"),
  accounts: qs("#tab-accounts"),
  pricing: qs("#tab-pricing"),
};

let pdfPrintFrame = null;

const screens = {
  booking: qs("#screen-booking"),
  view: qs("#screen-view"),
  planner: qs("#screen-planner"),
  analytics: qs("#screen-analytics"),
  deductions: qs("#screen-deductions"),
  guide: qs("#screen-guide"),
  hold: qs("#screen-hold"),
  requests: qs("#screen-requests"),
  notifications: qs("#screen-notifications"),
  accounts: qs("#screen-accounts"),
  pricing: qs("#screen-pricing"),
};

function isSupabaseConfigured() {
  return (
    CONFIG.SUPABASE_URL &&
    CONFIG.SUPABASE_ANON_KEY &&
    !CONFIG.SUPABASE_URL.includes("YOUR_SUPABASE") &&
    !CONFIG.SUPABASE_ANON_KEY.includes("YOUR_SUPABASE")
  );
}

function isSheetsBackupConfigured() {
  if (
    CONFIG.GOOGLE_SHEETS_BACKUP_URL &&
    !CONFIG.GOOGLE_SHEETS_BACKUP_URL.includes("YOUR_GOOGLE")
  ) {
    if (
      CONFIG.GOOGLE_SHEETS_BACKUP_URL.startsWith("/.netlify/") &&
      !window.location.hostname.includes("netlify.app")
    ) {
      return false;
    }
    return true;
  }
  return false;
}

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.style.background = isError ? "#b5473d" : "#0b3d2e";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

function setSyncState(stateName) {
  const states = {
    setup: { text: "Setup", bg: "#efe5d1", color: "#7a5a21" },
    connecting: { text: "Connecting", bg: "#e9eef7", color: "#20497c" },
    live: { text: "Live", bg: "#e6f0eb", color: "#0b3d2e" },
    offline: { text: "Offline", bg: "#f9e4e1", color: "#b5473d" },
    error: { text: "Error", bg: "#f9e4e1", color: "#b5473d" },
  };
  const next = states[stateName] || states.error;
  syncStatus.textContent = next.text;
  syncStatus.style.background = next.bg;
  syncStatus.style.color = next.color;
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(dateString) {
  if (!dateString) return null;
  if (dateString instanceof Date) {
    return new Date(dateString.getFullYear(), dateString.getMonth(), dateString.getDate(), 12, 0, 0);
  }
  const [year, month, day] = String(dateString).slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 12, 0, 0);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDateKey(date) {
  return toDateInputValue(date);
}

function formatMonthLabel(date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function toMonthInputValue(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function normalizeMonthInputValue(value = "") {
  const normalized = String(value || "").trim();
  return /^\d{4}-\d{2}$/.test(normalized) ? normalized : "";
}

function monthValueToDateKey(value = "") {
  const normalized = normalizeMonthInputValue(value);
  return normalized ? `${normalized}-01` : "";
}

function formatMonthValueLabel(value = "") {
  const date = parseDate(monthValueToDateKey(value));
  return date ? formatMonthLabel(date) : "Not selected";
}

function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1, 12, 0, 0);
}

function getNightCount(checkIn, checkOut) {
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);
  if (!start || !end) return 1;
  const diff = Math.round((end - start) / 86400000);
  return diff > 0 ? diff : 1;
}

function getRoomKey(type, number) {
  return `${type}-${number}`;
}

function getSelectedBookingServices() {
  return state.bookingServices;
}

function formatCheckoutFromNights(checkIn, nights) {
  return formatDateKey(addDays(parseDate(checkIn), nights));
}

function sanitizePhoneValue(value) {
  return String(value || "").replace(/\D+/g, "").slice(0, 15);
}

function applyPhoneSanitizer(input) {
  if (!input) return;
  input.addEventListener("input", () => {
    const sanitized = sanitizePhoneValue(input.value);
    if (input.value !== sanitized) input.value = sanitized;
  });
}

function setBookingDateRange(checkIn, checkOut, { syncPicker = true } = {}) {
  bookingCheckInInput.value = checkIn || "";
  bookingCheckOutInput.value = checkOut || "";
  if (!state.bookingRangePicker && bookingDateRangeInput) {
    bookingDateRangeInput.value = checkIn && checkOut ? `${checkIn} to ${checkOut}` : checkIn || "";
  }

  if (state.bookingRangePicker && syncPicker) {
    if (checkIn && checkOut) {
      state.bookingRangePicker.setDate([checkIn, checkOut], false);
    } else if (checkIn) {
      state.bookingRangePicker.setDate([checkIn], false);
    } else {
      state.bookingRangePicker.clear(false);
    }
  }
}

function initBookingDateRangePicker(today, tomorrow) {
  if (!bookingDateRangeInput) return;

  if (window.flatpickr) {
    state.bookingRangePicker = window.flatpickr(bookingDateRangeInput, {
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: toDateInputValue(today),
      defaultDate: [toDateInputValue(today), toDateInputValue(tomorrow)],
      disableMobile: true,
      onReady: (_, __, instance) => {
        instance.input.setAttribute("readonly", "readonly");
      },
      onChange: (selectedDates) => {
        const [start, end] = selectedDates;
        setBookingDateRange(
          start ? toDateInputValue(start) : "",
          end ? toDateInputValue(end) : "",
          { syncPicker: false }
        );
        refreshAvailability();
      },
    });
  }

  setBookingDateRange(toDateInputValue(today), toDateInputValue(tomorrow));
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function roundCurrency(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function createEmptyCustomPayment() {
  return { amount: "", note: "", linkedService: "" };
}

function createUuid() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeServiceCatalogRow(row = {}) {
  return {
    id: row.id || null,
    name: String(row.name || row.service_name || "").trim(),
    defaultPrice: roundCurrency(Math.max(0, Number(row.defaultPrice ?? row.default_price ?? 0))),
    isActive: row.isActive == null ? row.is_active !== false : Boolean(row.isActive),
    sortOrder: Number(row.sortOrder ?? row.sort_order ?? 0) || 0,
  };
}

function normalizeExportFieldList(value, fallbackToAll = true) {
  const validKeys = new Set(EXPORT_FIELD_DEFS.map((item) => item.key));
  const source = Array.isArray(value)
    ? value
    : (value == null
        ? null
        : typeof value === "string"
          ? (() => {
              try {
                return JSON.parse(value);
              } catch (error) {
                return value.split(",").map((item) => item.trim());
              }
            })()
          : []);
  if (source == null) {
    return fallbackToAll ? EXPORT_FIELD_DEFS.map((item) => item.key) : [];
  }
  return Array.from(new Set(source.map((item) => String(item || "").trim()).filter((item) => validKeys.has(item))));
}

function normalizeBookingViewFieldList(value, fallbackToAll = true) {
  const validKeys = new Set(BOOKING_VIEW_FIELD_DEFS.map((item) => item.key));
  const source = Array.isArray(value)
    ? value
    : (value == null
        ? null
        : typeof value === "string"
          ? (() => {
              try {
                return JSON.parse(value);
              } catch (error) {
                return value.split(",").map((item) => item.trim());
              }
            })()
          : []);
  if (source == null) {
    return fallbackToAll ? BOOKING_VIEW_FIELD_DEFS.map((item) => item.key) : [];
  }
  return Array.from(new Set(source.map((item) => String(item || "").trim()).filter((item) => validKeys.has(item))));
}

function normalizeRoomFixSectionOrder(value, fallbackToAll = true) {
  const validKeys = new Set(ROOM_FIX_SECTION_DEFS.map((item) => item.key));
  const source = Array.isArray(value)
    ? value
    : (value == null
        ? null
        : typeof value === "string"
          ? (() => {
              try {
                return JSON.parse(value);
              } catch (error) {
                return value.split(",").map((item) => item.trim());
              }
            })()
          : []);
  if (source == null) {
    return fallbackToAll ? ROOM_FIX_SECTION_DEFS.map((item) => item.key) : [];
  }
  const ordered = Array.from(new Set(source.map((item) => String(item || "").trim()).filter((item) => validKeys.has(item))));
  const missing = ROOM_FIX_SECTION_DEFS.map((item) => item.key).filter((key) => !ordered.includes(key));
  return [...ordered, ...missing];
}

function normalizeNotificationRoleList(value, fallbackToDefaults = true) {
  const validKeys = new Set(NOTIFICATION_ROLE_DEFS.map((item) => item.key));
  const source = Array.isArray(value)
    ? value
    : (value == null
        ? null
        : typeof value === "string"
          ? (() => {
              try {
                return JSON.parse(value);
              } catch (error) {
                return value.split(",").map((item) => item.trim());
              }
            })()
          : []);
  if (source == null) {
    return fallbackToDefaults ? ["owner", "admin"] : [];
  }
  const normalized = Array.from(new Set(source.map((item) => String(item || "").trim()).filter((item) => validKeys.has(item))));
  return normalized.length ? normalized : (fallbackToDefaults ? ["owner", "admin"] : []);
}

function getRuntimeShareMessages() {
  return {
    rebookingNote: String(state.runtimeSettings?.shareRebookingNote || SHARE_COPY_DEFAULTS.rebookingNote).trim() || SHARE_COPY_DEFAULTS.rebookingNote,
    contactNote: String(state.runtimeSettings?.shareContactNote || SHARE_COPY_DEFAULTS.contactNote).trim() || SHARE_COPY_DEFAULTS.contactNote,
    pdfKeepNote: String(state.runtimeSettings?.sharePdfKeepNote || SHARE_COPY_DEFAULTS.pdfKeepNote).trim() || SHARE_COPY_DEFAULTS.pdfKeepNote,
  };
}

function normalizeSystemUpdateRoleList(value, fallbackToDefaults = true) {
  const validKeys = new Set(NOTIFICATION_ROLE_DEFS.map((item) => item.key));
  const source = Array.isArray(value)
    ? value
    : (value == null
        ? null
        : typeof value === "string"
          ? (() => {
              try {
                return JSON.parse(value);
              } catch (error) {
                return value.split(",").map((item) => item.trim());
              }
            })()
          : []);
  if (source == null) {
    return fallbackToDefaults ? ["owner", "admin"] : [];
  }
  const normalized = Array.from(new Set(source.map((item) => String(item || "").trim()).filter((item) => validKeys.has(item))));
  return normalized.length ? normalized : (fallbackToDefaults ? ["owner", "admin"] : []);
}

function getEditableServiceCatalogRows() {
  const source = (state.serviceCatalog?.length ? state.serviceCatalog : DEFAULT_SERVICE_DEFS);
  return source.map((item) => normalizeServiceCatalogRow(item));
}

function isExportFieldEnabled(channel, fieldKey) {
  const list = normalizeExportFieldList(channel === "pdf" ? state.runtimeSettings?.pdfFields : state.runtimeSettings?.whatsappFields);
  return list.includes(fieldKey);
}

function toggleRuntimeExportField(channel, fieldKey, enabled) {
  const fieldName = channel === "pdf" ? "pdfFields" : "whatsappFields";
  const current = normalizeExportFieldList(state.runtimeSettings?.[fieldName]);
  const next = enabled
    ? Array.from(new Set([...current, fieldKey]))
    : current.filter((item) => item !== fieldKey);
  state.runtimeSettings = {
    ...state.runtimeSettings,
    [fieldName]: next,
  };
}

function toggleRuntimeBookingViewField(fieldKey, enabled) {
  const current = normalizeBookingViewFieldList(state.runtimeSettings?.bookingViewFields);
  const next = enabled
    ? Array.from(new Set([...current, fieldKey]))
    : current.filter((item) => item !== fieldKey);
  state.runtimeSettings = {
    ...state.runtimeSettings,
    bookingViewFields: next,
  };
}

function toggleRuntimeNotificationRole(roleKey, enabled) {
  const current = normalizeNotificationRoleList(state.runtimeSettings?.notificationRoles);
  const next = enabled
    ? Array.from(new Set([...current, roleKey]))
    : current.filter((item) => item !== roleKey);
  state.runtimeSettings = {
    ...state.runtimeSettings,
    notificationRoles: next.length ? next : ["owner", "admin"],
  };
}

function toggleRuntimeSystemUpdateRole(roleKey, enabled) {
  const current = normalizeSystemUpdateRoleList(state.runtimeSettings?.systemUpdateRoles);
  const next = enabled
    ? Array.from(new Set([...current, roleKey]))
    : current.filter((item) => item !== roleKey);
  state.runtimeSettings = {
    ...state.runtimeSettings,
    systemUpdateRoles: next.length ? next : ["owner", "admin"],
  };
}

function setDefaultServiceCatalogState() {
  state.serviceCatalog = DEFAULT_SERVICE_DEFS
    .map((item, index) => normalizeServiceCatalogRow({ ...item, sortOrder: item.sortOrder || index + 1 }))
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
}

function getServiceCatalogRows({ includeInactive = false } = {}) {
  const source = (state.serviceCatalog?.length ? state.serviceCatalog : DEFAULT_SERVICE_DEFS)
    .map((item) => normalizeServiceCatalogRow(item))
    .filter((item) => item.name);
  return includeInactive ? source : source.filter((item) => item.isActive);
}

function getServiceOptionNames(extraServices = []) {
  const normalizedExtras = Array.isArray(extraServices)
    ? extraServices
    : extraServices instanceof Set
      ? Array.from(extraServices)
      : typeof extraServices === "string"
        ? extraServices.split(",")
        : [];
  const extras = Array.from(new Set(normalizedExtras.map((item) => String(item || "").trim()).filter(Boolean)));
  const catalog = getServiceCatalogRows({ includeInactive: true });
  const activeCatalogNames = catalog.filter((item) => item.isActive || extras.includes(item.name)).map((item) => item.name);
  return Array.from(new Set([...activeCatalogNames, ...extras]));
}

function getServiceConfig(serviceName) {
  const key = String(serviceName || "").trim().toLowerCase();
  return getServiceCatalogRows({ includeInactive: true }).find((item) => item.name.toLowerCase() === key) || null;
}

function normalizeCustomPayments(value) {
  const source = typeof value === "string"
    ? (() => {
        try {
          return JSON.parse(value);
        } catch (error) {
          return [];
        }
      })()
    : value;

  if (!Array.isArray(source)) return [];

  return source
    .map((item) => ({
      amount: roundCurrency(Math.max(0, Number(item?.amount || 0))),
      note: String(item?.note || "").trim(),
    }))
    .filter((item) => item.amount > 0);
}

function getCustomPaymentsTotal(payments = []) {
  return roundCurrency(normalizeCustomPayments(payments).reduce((sum, item) => sum + Number(item.amount || 0), 0));
}

function getBookingCustomPriceEntries(booking) {
  return normalizeCustomPayments(booking?.customPayments);
}

function getCustomPriceListMarkup(payments = []) {
  const items = normalizeCustomPayments(payments);
  if (!items.length) {
    return '<p class="inline-note">No custom price entries added.</p>';
  }
  return `
    <div class="payment-history-list">
      ${items.map((payment, index) => `
        <div class="payment-history-item">
          <strong>${index + 1}. ${formatMoney(payment.amount || 0)}</strong>
          <span>${escapeHtml(payment.note || "No note")}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function getGroupServices(bookings = []) {
  return Array.from(new Set((bookings || []).flatMap((booking) => parseBookingNotes(booking.notes).services)));
}

function getServicePricingRows(bookings = []) {
  const services = getGroupServices(bookings);
  const entries = getGroupCustomPriceEntries(bookings);
  return services.map((service) => {
    const match = entries.find((item) => String(item.note || "").trim().toLowerCase() === service.toLowerCase());
    return {
      service,
      amount: match ? roundCurrency(Number(match.amount || 0)) : 0,
    };
  });
}

function getServicePricingMarkup(bookings = [], { editable = false, groupKey = "" } = {}) {
  const rows = getServicePricingRows(bookings);
  if (!rows.length) {
    return '<p class="inline-note">No services added.</p>';
  }
  return `
    <div class="payment-history-list">
      ${rows.map((row) => `
        <div class="payment-history-item${editable ? " payment-history-item-editable" : ""}" ${editable ? `role="button" tabindex="0" data-booking-service-price-edit="${escapeHtml(groupKey)}" data-service-name="${escapeHtml(row.service)}"` : ""}>
          <strong>${escapeHtml(row.service)}</strong>
          <span>${row.amount > 0 ? escapeHtml(formatMoney(row.amount)) : editable ? "Tap to add price" : "-"}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function getGroupOtherNotes(bookings = []) {
  const notes = (bookings || [])
    .flatMap((booking) => parseBookingNotes(booking.notes).otherNotes)
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  return Array.from(new Set(notes)).join(" | ");
}

function normalizeAcEnabled(roomType, value = true) {
  const normalizedType = normalizeRoomGroup(roomType);
  if (!["normal", "kitchen"].includes(normalizedType)) return true;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "false" || normalized === "0" || normalized === "off" || normalized === "non_ac") return false;
    if (normalized === "true" || normalized === "1" || normalized === "on" || normalized === "ac") return true;
  }
  return value !== false;
}

function getRoomClimateLabel(roomType, acEnabled = true) {
  if (!["normal", "kitchen"].includes(normalizeRoomGroup(roomType))) return "";
  return normalizeAcEnabled(roomType, acEnabled) ? "A/C Room" : "Non A/C Room";
}

function getRoomPricingKey(roomType, pax = 0, acEnabled = true) {
  const normalizedType = normalizeRoomGroup(roomType);
  const normalizedAc = normalizeAcEnabled(normalizedType, acEnabled);
  return `${normalizedType}-${Number(pax || 0)}-${normalizedAc ? "ac" : "non-ac"}`;
}

function getDefaultRoomPricingEntries() {
  return ROOM_PRICING_DEFS.map((item) => ({
    roomType: item.roomType,
    pax: item.pax,
    acEnabled: normalizeAcEnabled(item.roomType, item.acEnabled),
    weekendPrice: 0,
    weekdayPercentage: 100,
  }));
}

function getRoomPricingLabel(roomType, pax = 0, acEnabled = true) {
  return ROOM_PRICING_DEFS.find(
    (item) => item.roomType === normalizeRoomGroup(roomType)
      && Number(item.pax) === Number(pax)
      && normalizeAcEnabled(item.roomType, item.acEnabled) === normalizeAcEnabled(roomType, acEnabled),
  )?.label || roomType;
}

function getDefaultRoomInventoryEntries() {
  return ROOM_DEFS.flatMap((item) => Array.from({ length: item.count }, (_, index) => ({
    roomType: item.type,
    roomNumber: index + 1,
    maxPax: item.maxPax,
    isActive: true,
  })));
}

function getRoomTypeSortIndex(roomType) {
  const index = ROOM_DEFS.findIndex((item) => item.type === roomType);
  return index === -1 ? ROOM_DEFS.length : index;
}

function sortRoomInventoryRows(a, b) {
  const typeDiff = getRoomTypeSortIndex(a.roomType) - getRoomTypeSortIndex(b.roomType);
  if (typeDiff !== 0) return typeDiff;
  return Number(a.roomNumber || 0) - Number(b.roomNumber || 0);
}

function normalizeRoomInventoryRow(row) {
  const roomType = normalizeRoomGroup(row?.room_type ?? row?.roomType);
  const roomNumber = Number(row?.room_number ?? row?.roomNumber);
  const roomDef = getRoomDef(roomType);
  if (!roomType || !roomNumber || !roomDef) return null;
  return {
    id: row?.id || null,
    roomType,
    roomNumber,
    maxPax: Number(row?.max_pax ?? row?.maxPax ?? roomDef.maxPax ?? 1),
    isActive: row?.is_active ?? row?.isActive ?? true,
  };
}

function setDefaultRoomInventoryState() {
  state.roomInventory = getDefaultRoomInventoryEntries()
    .map(normalizeRoomInventoryRow)
    .filter(Boolean)
    .sort(sortRoomInventoryRows);
}

function hydrateRoomInventory(rows = []) {
  const normalized = rows
    .map(normalizeRoomInventoryRow)
    .filter(Boolean)
    .sort(sortRoomInventoryRows);
  return normalized.length ? normalized : getDefaultRoomInventoryEntries().map(normalizeRoomInventoryRow).filter(Boolean).sort(sortRoomInventoryRows);
}

function getRoomInventoryRows({ includeInactive = false } = {}) {
  const source = state.roomInventory.length
    ? state.roomInventory
    : getDefaultRoomInventoryEntries().map(normalizeRoomInventoryRow).filter(Boolean);
  return source
    .filter((room) => includeInactive || room.isActive)
    .sort(sortRoomInventoryRows);
}

function getRoomNumbersForType(roomType, { includeInactive = false, selectedNumber = null } = {}) {
  const normalizedType = normalizeRoomGroup(roomType);
  const selected = Number(selectedNumber || 0);
  const numbers = getRoomInventoryRows({ includeInactive: true })
    .filter((room) => room.roomType === normalizedType && (includeInactive || room.isActive || room.roomNumber === selected))
    .map((room) => room.roomNumber)
    .sort((a, b) => a - b);

  if (!numbers.length && selected > 0) return [selected];
  return Array.from(new Set(numbers));
}

function getNextRoomNumberForType(roomType) {
  const normalizedType = normalizeRoomGroup(roomType);
  const numbers = getRoomInventoryRows({ includeInactive: true })
    .filter((room) => room.roomType === normalizedType)
    .map((room) => room.roomNumber);
  return numbers.length ? Math.max(...numbers) + 1 : 1;
}

function setDefaultRoomPricingState() {
  state.roomPricing = new Map(
    getDefaultRoomPricingEntries().map((item) => [getRoomPricingKey(item.roomType, item.pax, item.acEnabled), item])
  );
}

function hydrateRoomPricing(rows = []) {
  const merged = new Map(
    getDefaultRoomPricingEntries().map((item) => [getRoomPricingKey(item.roomType, item.pax, item.acEnabled), item])
  );
  rows.forEach((row) => {
    merged.set(getRoomPricingKey(row.room_type, row.pax, row.ac_enabled), {
      roomType: normalizeRoomGroup(row.room_type),
      pax: Number(row.pax || 0),
      acEnabled: normalizeAcEnabled(row.room_type, row.ac_enabled),
      weekendPrice: Number(row.weekend_price || 0),
      weekdayPercentage: Number(row.weekday_percentage || 100),
    });
  });
  return merged;
}

function getPricingConfig(roomType, pax = 0, acEnabled = true) {
  return state.roomPricing.get(getRoomPricingKey(roomType, pax, acEnabled)) || {
    roomType,
    pax: Number(pax || 0),
    acEnabled: normalizeAcEnabled(roomType, acEnabled),
    weekendPrice: 0,
    weekdayPercentage: 100,
  };
}

function getPricingPaxTier(roomType, guests) {
  if (roomType !== "normal") return 0;
  return Math.max(1, Math.min(4, Number(guests || 1)));
}

function countStayNightsByType(checkIn, checkOut) {
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);
  let weekendNights = 0;
  let weekdayNights = 0;

  if (!start || !end || end <= start) {
    return { weekendNights, weekdayNights };
  }

  for (let cursor = new Date(start); cursor < end; cursor = addDays(cursor, 1)) {
    const day = cursor.getDay();
    if (day === 0 || day === 6) weekendNights += 1;
    else weekdayNights += 1;
  }

  return { weekendNights, weekdayNights };
}

function applyOfferPercentage(amount, offerPercentage = 0) {
  const safeAmount = roundCurrency(Number(amount || 0));
  const safeOffer = Math.max(0, Number(offerPercentage || 0));
  return roundCurrency(safeAmount - ((safeAmount * safeOffer) / 100));
}

function getSelectedOfferPercentage(options, customInput) {
  const selected = options.find((input) => input.checked)?.value || "0";
  if (selected === "custom") {
    return Math.max(0, Number(customInput?.value || 0));
  }
  return Math.max(0, Number(selected || 0));
}

function syncOfferInputState(options, customField, customInput) {
  const isCustom = options.find((input) => input.checked)?.value === "custom";
  options.forEach((input) => {
    input.closest(".offer-option")?.classList.toggle("offer-option-active", Boolean(input.checked));
  });
  toggleHidden(customField, !isCustom);
  if (!isCustom && customInput) customInput.value = "";
}

function setOfferSelection(options, customField, customInput, percentage = 0) {
  const normalized = Number(percentage || 0);
  let matched = false;
  options.forEach((input) => {
    const isMatch = Number(input.value) === normalized;
    input.checked = isMatch;
    if (isMatch) matched = true;
  });
  const customOption = options.find((input) => input.value === "custom");
  if (!matched && customOption) {
    customOption.checked = true;
    if (customInput) customInput.value = String(normalized);
  } else if (customInput) {
    customInput.value = "";
  }
  syncOfferInputState(options, customField, customInput);
}

function computeBookingPrice({
  checkIn,
  checkOut,
  roomType,
  guests,
  acEnabled = true,
  weekendRateOverride = null,
  weekdayRateOverride = null,
}) {
  const pricingPax = getPricingPaxTier(roomType, guests);
  const pricingRule = getPricingConfig(roomType, pricingPax, acEnabled);
  const defaultWeekendRate = roundCurrency(pricingRule.weekendPrice);
  const weekdayPercentage = Number(pricingRule.weekdayPercentage || 100);
  const defaultWeekdayRate = roundCurrency((defaultWeekendRate * weekdayPercentage) / 100);
  const weekendRate = weekendRateOverride == null ? defaultWeekendRate : roundCurrency(Number(weekendRateOverride || 0));
  const weekdayRate = weekdayRateOverride == null ? defaultWeekdayRate : roundCurrency(Number(weekdayRateOverride || 0));
  const { weekendNights, weekdayNights } = countStayNightsByType(checkIn, checkOut);
  const roomTotal = roundCurrency((weekendNights * weekendRate) + (weekdayNights * weekdayRate));

  return {
    pricingPax,
    weekendRate,
    weekdayRate,
    weekendNights,
    weekdayNights,
    weekdayPercentage,
    roomTotal,
  };
}

function getBookingPricingSnapshot(values = {}) {
  const weekendRate = Number(values.weekendRate || 0);
  const weekdayRate = Number(values.weekdayRate || 0);
  const weekendNights = "weekendNights" in values ? Number(values.weekendNights || 0) : countStayNightsByType(values.checkIn, values.checkOut).weekendNights;
  const weekdayNights = "weekdayNights" in values ? Number(values.weekdayNights || 0) : countStayNightsByType(values.checkIn, values.checkOut).weekdayNights;
  const baseRoomTotal = "baseRoomTotal" in values
    ? Number(values.baseRoomTotal || 0)
    : roundCurrency((weekendNights * weekendRate) + (weekdayNights * weekdayRate));
  const offerPercentage = Number(values.offerPercentage || 0);
  const roomTotal = "roomTotal" in values
    ? Number(values.roomTotal || 0)
    : applyOfferPercentage(baseRoomTotal, offerPercentage);

  return {
    weekendRate,
    weekdayRate,
    weekendNights,
    weekdayNights,
    baseRoomTotal,
    offerPercentage,
    roomTotal,
  };
}

function formatBookingPriceBreakdown(values = {}) {
  const snapshot = getBookingPricingSnapshot(values);
  if (snapshot.offerPercentage > 0) {
    return `Room Price ${formatMoney(snapshot.baseRoomTotal)} · Offer ${snapshot.offerPercentage}% · Final ${formatMoney(snapshot.roomTotal)}`;
  }
  return `Room Price ${formatMoney(snapshot.roomTotal)}`;
}

function getRequestPriceSnapshot(request, booking) {
  return getBookingPricingSnapshot({
    checkIn: request?.requestedCheckIn || booking?.checkIn || "",
    checkOut: request?.requestedCheckOut || booking?.checkOut || "",
    weekendRate: request?.requestedWeekendRate ?? booking?.weekendRate ?? 0,
    weekdayRate: request?.requestedWeekdayRate ?? request?.requestedWeekendRate ?? booking?.weekdayRate ?? booking?.weekendRate ?? 0,
    offerPercentage: request?.requestedOfferPercentage ?? booking?.offerPercentage ?? 0,
  });
}

async function loadRoomInventory() {
  ensureSupabase();
  try {
    const { data, error } = await state.supabase
      .from(CONFIG.SUPABASE_ROOMS_TABLE)
      .select("*")
      .order("room_type", { ascending: true })
      .order("room_number", { ascending: true });

    if (error) throw error;
    state.roomInventory = hydrateRoomInventory(data || []);
    state.roomInventorySchemaReady = true;
  } catch (error) {
    setDefaultRoomInventoryState();
    state.roomInventorySchemaReady = false;
    if (canManagePricing()) {
      showToast("Room inventory table is not ready. Run the updated Supabase schema.sql.", true);
    }
  }

  renderPricingScreen();
}

async function loadServiceCatalog() {
  ensureSupabase();
  try {
    const { data, error } = await state.supabase
      .from(CONFIG.SUPABASE_SERVICES_TABLE)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("service_name", { ascending: true });

    if (error) throw error;
    state.serviceCatalog = (data || []).map(normalizeServiceCatalogRow);
    if (!state.serviceCatalog.length) {
      setDefaultServiceCatalogState();
    }
  } catch (error) {
    setDefaultServiceCatalogState();
    if (canManagePricing()) {
      showToast("Service catalog table is not ready. Run the updated Supabase schema.sql.", true);
    }
  }

  renderPricingScreen();
  renderRoomServiceAssignments();
}

async function loadRoomPricing() {
  ensureSupabase();
  try {
    const { data, error } = await state.supabase
      .from(CONFIG.SUPABASE_PRICING_TABLE)
      .select("*")
      .order("room_type", { ascending: true })
      .order("pax", { ascending: true });

    if (error) throw error;
    state.roomPricing = hydrateRoomPricing(data || []);
    state.pricingSchemaReady = true;
  } catch (error) {
    setDefaultRoomPricingState();
    state.pricingSchemaReady = false;
    if (canManagePricing()) {
      showToast("Room pricing table is not ready. Run the updated Supabase schema.sql.", true);
    }
  }

  renderPricingScreen();
  renderPricingSummary();
}

async function saveServiceCatalog() {
  if (!canManagePricing()) return;
  const rows = getEditableServiceCatalogRows().map((row, index) => ({
    ...row,
    sortOrder: index + 1,
  }));
  const names = rows.map((row) => String(row.name || "").trim()).filter(Boolean);
  if (names.length !== rows.length) {
    throw new Error("Every service needs a name before saving.");
  }
  if (new Set(names.map((name) => name.toLowerCase())).size !== names.length) {
    throw new Error("Service names must be unique.");
  }
  const existingIds = new Set(rows.map((row) => row.id).filter(Boolean));
  const { data: existingRows, error: fetchError } = await state.supabase
    .from(CONFIG.SUPABASE_SERVICES_TABLE)
    .select("id, service_name, default_price, is_active, sort_order");
  if (fetchError) {
    throw new Error(fetchError.message || "Could not read current service catalog.");
  }
  const savedRows = (existingRows || []).map((row) => normalizeServiceCatalogRow(row));

  const existingById = new Map((existingRows || []).map((row) => [row.id, row]));
  const updateRows = rows.filter((row) => row.id && existingById.has(row.id));
  const insertRows = rows.filter((row) => !row.id || !existingById.has(row.id));

  for (const row of updateRows) {
    const { error: updateError } = await state.supabase
      .from(CONFIG.SUPABASE_SERVICES_TABLE)
      .update({
        service_name: row.name,
        default_price: roundCurrency(row.defaultPrice),
        is_active: row.isActive,
        sort_order: row.sortOrder,
      })
      .eq("id", row.id);
    if (updateError) {
      throw new Error(updateError.message || `Could not update service ${row.name}.`);
    }
  }

  if (insertRows.length) {
    const { error: insertError } = await state.supabase
      .from(CONFIG.SUPABASE_SERVICES_TABLE)
      .insert(insertRows.map((row) => ({
        id: row.id || createUuid(),
        service_name: row.name,
        default_price: roundCurrency(row.defaultPrice),
        is_active: row.isActive,
        sort_order: row.sortOrder,
      })));
    if (insertError) {
      throw new Error(insertError.message || "Could not add new services.");
    }
  }

  const removedIds = (existingRows || []).map((row) => row.id).filter((id) => id && !existingIds.has(id));
  if (removedIds.length) {
    const { error: deleteError } = await state.supabase
      .from(CONFIG.SUPABASE_SERVICES_TABLE)
      .delete()
      .in("id", removedIds);
    if (deleteError) {
      throw new Error(deleteError.message || "Could not delete removed services.");
    }
  }

  const changeSummary = getServiceCatalogChangeSummary(savedRows, rows);
  if (changeSummary.added.length || changeSummary.removed.length || changeSummary.changed.length) {
    await insertSystemUpdate({
      updateType: "service_catalog_updated",
      title: "Services Updated",
      message: [
        changeSummary.added.length ? `${changeSummary.added.length} added` : "",
        changeSummary.removed.length ? `${changeSummary.removed.length} removed` : "",
        changeSummary.changed.length ? `${changeSummary.changed.length} changed` : "",
      ].filter(Boolean).join(" · ") || "Booking services were updated.",
      metadata: changeSummary,
    });
  }

  await loadServiceCatalog();
}

function moveServiceCatalogItem(fromIndex, toIndex) {
  const rows = getEditableServiceCatalogRows();
  if (
    !Number.isInteger(fromIndex)
    || !Number.isInteger(toIndex)
    || fromIndex < 0
    || toIndex < 0
    || fromIndex >= rows.length
    || toIndex >= rows.length
    || fromIndex === toIndex
  ) {
    return;
  }
  const next = [...rows];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  state.serviceCatalog = next.map((row, index) => normalizeServiceCatalogRow({
    ...row,
    sortOrder: index + 1,
  }));
}

async function loadRuntimeSettings() {
  ensureSupabase();
  try {
    const { data, error } = await state.supabase
      .from(CONFIG.SUPABASE_RUNTIME_SETTINGS_TABLE)
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    const plannerAccentColor = /^#[0-9a-f]{6}$/i.test(String(data?.planner_accent_color || "").trim())
      ? String(data.planner_accent_color).trim()
      : getStoredPlannerAccentColor();
    const plannerTrackColors = normalizePlannerTrackColors(data?.planner_track_colors || getStoredPlannerTrackColors());
    state.runtimeSettings = {
      checkInTime: data?.check_in_time || "14:00",
      checkOutTime: data?.check_out_time || "11:00",
      pdfFields: normalizeExportFieldList(data?.pdf_fields),
      whatsappFields: normalizeExportFieldList(data?.whatsapp_fields),
      bookingViewFields: normalizeBookingViewFieldList(data?.booking_view_fields),
      roomFixSectionOrder: normalizeRoomFixSectionOrder(data?.room_fix_section_order),
      notificationRoles: normalizeNotificationRoleList(data?.notification_roles),
      systemUpdateRoles: normalizeSystemUpdateRoleList(data?.system_update_roles),
      shareRebookingNote: data?.share_rebooking_note || SHARE_COPY_DEFAULTS.rebookingNote,
      shareContactNote: data?.share_contact_note || SHARE_COPY_DEFAULTS.contactNote,
      sharePdfKeepNote: data?.share_pdf_keep_note || SHARE_COPY_DEFAULTS.pdfKeepNote,
      plannerAccentColor,
      plannerTrackColors,
    };
    setStoredPlannerAccentColor(plannerAccentColor);
    setStoredPlannerTrackColors(plannerTrackColors);
  } catch (error) {
    state.runtimeSettings = {
      checkInTime: "14:00",
      checkOutTime: "11:00",
      pdfFields: normalizeExportFieldList(null),
      whatsappFields: normalizeExportFieldList(null),
      bookingViewFields: normalizeBookingViewFieldList(null),
      roomFixSectionOrder: normalizeRoomFixSectionOrder(null),
      notificationRoles: normalizeNotificationRoleList(null),
      systemUpdateRoles: normalizeSystemUpdateRoleList(null),
      shareRebookingNote: SHARE_COPY_DEFAULTS.rebookingNote,
      shareContactNote: SHARE_COPY_DEFAULTS.contactNote,
      sharePdfKeepNote: SHARE_COPY_DEFAULTS.pdfKeepNote,
      plannerAccentColor: getStoredPlannerAccentColor(),
      plannerTrackColors: getStoredPlannerTrackColors(),
    };
    if (canManagePricing()) {
      showToast("Booking runtime settings table is not ready. Run the updated Supabase schema.sql.", true);
    }
  }
  if (runtimeCheckInTimeInput) runtimeCheckInTimeInput.value = getRuntimeCheckInTime();
  if (runtimeCheckOutTimeInput) runtimeCheckOutTimeInput.value = getRuntimeCheckOutTime();
  syncPlannerColorPicker();
  if (state.currentPlannerStartDate) renderCurrentPlannerView();
  updateNavVisibility();
  updateNotificationBadge();
}

async function saveRuntimeSettings() {
  if (!canManagePricing()) return;
  const previousSettings = {
    checkInTime: state.runtimeSettings?.checkInTime || "14:00",
    checkOutTime: state.runtimeSettings?.checkOutTime || "11:00",
    notificationRoles: normalizeNotificationRoleList(state.runtimeSettings?.notificationRoles),
    systemUpdateRoles: normalizeSystemUpdateRoleList(state.runtimeSettings?.systemUpdateRoles),
    bookingViewFields: normalizeBookingViewFieldList(state.runtimeSettings?.bookingViewFields),
    shareRebookingNote: String(state.runtimeSettings?.shareRebookingNote || SHARE_COPY_DEFAULTS.rebookingNote),
    shareContactNote: String(state.runtimeSettings?.shareContactNote || SHARE_COPY_DEFAULTS.contactNote),
    sharePdfKeepNote: String(state.runtimeSettings?.sharePdfKeepNote || SHARE_COPY_DEFAULTS.pdfKeepNote),
    plannerAccentColor: state.runtimeSettings?.plannerAccentColor || state.plannerAccentColor || "#93c0ec",
    plannerTrackColors: normalizePlannerTrackColors(state.runtimeSettings?.plannerTrackColors || state.plannerTrackColors),
  };
  const row = {
    id: true,
    check_in_time: runtimeCheckInTimeInput?.value || "14:00",
    check_out_time: runtimeCheckOutTimeInput?.value || "11:00",
    pdf_fields: normalizeExportFieldList(state.runtimeSettings?.pdfFields),
    whatsapp_fields: normalizeExportFieldList(state.runtimeSettings?.whatsappFields),
    booking_view_fields: normalizeBookingViewFieldList(state.runtimeSettings?.bookingViewFields),
    room_fix_section_order: normalizeRoomFixSectionOrder(state.runtimeSettings?.roomFixSectionOrder),
    notification_roles: normalizeNotificationRoleList(state.runtimeSettings?.notificationRoles),
    system_update_roles: normalizeSystemUpdateRoleList(state.runtimeSettings?.systemUpdateRoles),
    share_rebooking_note: String(state.runtimeSettings?.shareRebookingNote || SHARE_COPY_DEFAULTS.rebookingNote).trim() || SHARE_COPY_DEFAULTS.rebookingNote,
    share_contact_note: String(state.runtimeSettings?.shareContactNote || SHARE_COPY_DEFAULTS.contactNote).trim() || SHARE_COPY_DEFAULTS.contactNote,
    share_pdf_keep_note: String(state.runtimeSettings?.sharePdfKeepNote || SHARE_COPY_DEFAULTS.pdfKeepNote).trim() || SHARE_COPY_DEFAULTS.pdfKeepNote,
    planner_accent_color: state.runtimeSettings?.plannerAccentColor || state.plannerAccentColor || "#93c0ec",
    planner_track_colors: normalizePlannerTrackColors(state.runtimeSettings?.plannerTrackColors || state.plannerTrackColors),
  };
  const { error } = await state.supabase
    .from(CONFIG.SUPABASE_RUNTIME_SETTINGS_TABLE)
    .upsert(row, { onConflict: "id" });
  if (error) {
    throw new Error(error.message || "Could not save booking runtime settings.");
  }
  state.runtimeSettings = {
    checkInTime: row.check_in_time,
    checkOutTime: row.check_out_time,
    pdfFields: normalizeExportFieldList(row.pdf_fields),
    whatsappFields: normalizeExportFieldList(row.whatsapp_fields),
    bookingViewFields: normalizeBookingViewFieldList(row.booking_view_fields),
    roomFixSectionOrder: normalizeRoomFixSectionOrder(row.room_fix_section_order),
    notificationRoles: normalizeNotificationRoleList(row.notification_roles),
    systemUpdateRoles: normalizeSystemUpdateRoleList(row.system_update_roles),
    shareRebookingNote: row.share_rebooking_note,
    shareContactNote: row.share_contact_note,
    sharePdfKeepNote: row.share_pdf_keep_note,
    plannerAccentColor: row.planner_accent_color,
    plannerTrackColors: normalizePlannerTrackColors(row.planner_track_colors),
  };
  setStoredPlannerAccentColor(state.runtimeSettings.plannerAccentColor);
  setStoredPlannerTrackColors(state.runtimeSettings.plannerTrackColors);
  const changedBits = [];
  if (previousSettings.checkInTime !== state.runtimeSettings.checkInTime) changedBits.push(`Check-In ${previousSettings.checkInTime} -> ${state.runtimeSettings.checkInTime}`);
  if (previousSettings.checkOutTime !== state.runtimeSettings.checkOutTime) changedBits.push(`Check-Out ${previousSettings.checkOutTime} -> ${state.runtimeSettings.checkOutTime}`);
  if (previousSettings.notificationRoles.join("|") !== normalizeNotificationRoleList(state.runtimeSettings.notificationRoles).join("|")) changedBits.push("Notification Access");
  if (previousSettings.systemUpdateRoles.join("|") !== normalizeSystemUpdateRoleList(state.runtimeSettings.systemUpdateRoles).join("|")) changedBits.push("System Updates Access");
  if (previousSettings.bookingViewFields.join("|") !== normalizeBookingViewFieldList(state.runtimeSettings.bookingViewFields).join("|")) changedBits.push("Booking View Fields");
  if (previousSettings.shareRebookingNote !== state.runtimeSettings.shareRebookingNote) changedBits.push("Share Rebooking Note");
  if (previousSettings.shareContactNote !== state.runtimeSettings.shareContactNote) changedBits.push("Share Contact Note");
  if (previousSettings.sharePdfKeepNote !== state.runtimeSettings.sharePdfKeepNote) changedBits.push("PDF Keep Note");
  if (previousSettings.plannerAccentColor !== state.runtimeSettings.plannerAccentColor) changedBits.push("Planner Default Color");
  if (JSON.stringify(previousSettings.plannerTrackColors) !== JSON.stringify(normalizePlannerTrackColors(state.runtimeSettings.plannerTrackColors))) changedBits.push("Planner Track Colors");
  if (changedBits.length) {
    await insertSystemUpdate({
      updateType: "runtime_settings_updated",
      title: "Settings Updated",
      message: changedBits.join(" · "),
      metadata: { changedBits },
    });
  }
  updateNavVisibility();
  updateNotificationBadge();
}

async function savePlannerColorSettings() {
  if (!canEditPlannerColors()) throw new Error("Only owner or admin can change planner colors.");
  ensureSupabase();
  const plannerAccentColor = state.plannerAccentColor || "#93c0ec";
  const plannerTrackColors = normalizePlannerTrackColors(state.plannerTrackColors);
  const { error } = await state.supabase
    .from(CONFIG.SUPABASE_RUNTIME_SETTINGS_TABLE)
    .upsert({
      id: true,
      planner_accent_color: plannerAccentColor,
      planner_track_colors: plannerTrackColors,
    }, { onConflict: "id" });
  if (error) {
    throw new Error(error.message || "Could not save planner colors.");
  }
  state.runtimeSettings = {
    ...state.runtimeSettings,
    plannerAccentColor,
    plannerTrackColors,
  };
  setStoredPlannerAccentColor(plannerAccentColor);
  setStoredPlannerTrackColors(plannerTrackColors);
}

function moveRoomFixSection(fromKey, toKey) {
  const order = normalizeRoomFixSectionOrder(state.runtimeSettings?.roomFixSectionOrder);
  const fromIndex = order.indexOf(fromKey);
  const toIndex = order.indexOf(toKey);
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;
  const next = [...order];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  state.runtimeSettings = {
    ...state.runtimeSettings,
    roomFixSectionOrder: next,
  };
}

async function getSavedRoomPricingSnapshot() {
  const { data, error } = await state.supabase
    .from(CONFIG.SUPABASE_PRICING_TABLE)
    .select("room_type, pax, ac_enabled, weekend_price")
    .order("room_type", { ascending: true })
    .order("pax", { ascending: true })
    .order("ac_enabled", { ascending: false });

  if (error) {
    throw new Error(error.message || "Could not load current room prices.");
  }

  return new Map((data || []).map((row) => [
    getRoomPricingKey(normalizeRoomGroup(row.room_type), Number(row.pax || 0), row.ac_enabled),
    roundCurrency(Number(row.weekend_price || 0)),
  ]));
}

async function roomHasSavedBookings(roomType, roomNumber) {
  const { data, error } = await state.supabase
    .from(CONFIG.SUPABASE_TABLE)
    .select("id")
    .eq("room_type", normalizeRoomGroup(roomType))
    .eq("room_number", Number(roomNumber))
    .limit(1);

  if (error) throw new Error(error.message || "Could not validate room usage.");
  return Boolean(data?.length);
}

async function saveRoomInventory() {
  if (!canManagePricing()) return;
  if (state.roomInventorySchemaReady === false) {
    throw new Error("Run the updated Supabase schema.sql before saving room setup.");
  }

  const rows = getRoomInventoryRows({ includeInactive: true });
  const uniqueKeys = new Set(rows.map((room) => getRoomKey(room.roomType, room.roomNumber)));
  if (uniqueKeys.size !== rows.length) {
    throw new Error("Room setup contains duplicate room numbers.");
  }

  const { data: existingRows, error: existingError } = await state.supabase
    .from(CONFIG.SUPABASE_ROOMS_TABLE)
    .select("id, room_type, room_number, max_pax, is_active");

  if (existingError) {
    throw new Error(existingError.message || "Could not load saved room setup.");
  }

  const removedRows = (existingRows || []).filter((row) => !uniqueKeys.has(getRoomKey(normalizeRoomGroup(row.room_type), Number(row.room_number))));
  for (const row of removedRows) {
    const inUse = await roomHasSavedBookings(row.room_type, row.room_number);
    if (inUse) {
      throw new Error(`${getRoomLabel(normalizeRoomGroup(row.room_type), row.room_number)} has existing bookings, so it cannot be deleted.`);
    }
  }

  if (removedRows.length) {
    const { error: deleteError } = await state.supabase
      .from(CONFIG.SUPABASE_ROOMS_TABLE)
      .delete()
      .in("id", removedRows.map((row) => row.id));

    if (deleteError) {
      throw new Error(deleteError.message || "Could not delete removed rooms.");
    }
  }

  const upsertRows = rows.map((room) => ({
    room_type: room.roomType,
    room_number: room.roomNumber,
    max_pax: room.maxPax,
    is_active: room.isActive,
  }));

  if (upsertRows.length) {
    const { error: upsertError } = await state.supabase
      .from(CONFIG.SUPABASE_ROOMS_TABLE)
      .upsert(upsertRows, { onConflict: "room_type,room_number" });

    if (upsertError) {
      throw new Error(upsertError.message || "Could not save room setup.");
    }
  }

  state.roomInventorySchemaReady = true;
  const addedRooms = rows.filter((room) => !(existingRows || []).some((saved) => normalizeRoomGroup(saved.room_type) === room.roomType && Number(saved.room_number) === Number(room.roomNumber)));
  const changedRooms = rows.filter((room) => {
    const saved = (existingRows || []).find((item) => normalizeRoomGroup(item.room_type) === room.roomType && Number(item.room_number) === Number(room.roomNumber));
    if (!saved) return false;
    return Number(saved.max_pax || 0) !== Number(room.maxPax || 0) || Boolean(saved.is_active) !== Boolean(room.isActive);
  });
  const addedCount = addedRooms.length;
  const removedCount = removedRows.length;
  const changedCount = changedRooms.length;
  if (addedCount || removedCount || changedCount) {
    await insertSystemUpdate({
      updateType: "room_setup_updated",
      title: "Room Setup Updated",
      message: [
        addedCount ? `${addedCount} added` : "",
        removedCount ? `${removedCount} removed` : "",
        changedCount ? `${changedCount} changed` : "",
      ].filter(Boolean).join(" · ") || "Room setup was updated.",
      metadata: {
        addedCount,
        removedCount,
        changedCount,
        added: addedRooms.map((room) => getRoomLabel(room.roomType, room.roomNumber)),
        removed: removedRows.map((room) => getRoomLabel(normalizeRoomGroup(room.room_type), Number(room.room_number))),
        changed: changedRooms.map((room) => getRoomLabel(room.roomType, room.roomNumber)),
      },
    });
  }
  await loadRoomInventory();
}

function canManagePricing() {
  return profileHasPermission(state.currentProfile, "manage_pricing");
}

function canManageBookings() {
  return profileHasPermission(state.currentProfile, "manage_bookings");
}

function getBookingOfferPercentage() {
  return getSelectedOfferPercentage(bookingOfferOptions, bookingOfferCustomInput);
}

function getRequestOfferPercentage() {
  return getSelectedOfferPercentage(requestOfferOptions, requestOfferCustomInput);
}

function getRequestCustomPaymentsPayload() {
  return normalizeCustomPayments(state.modalCustomPayments);
}

function updateRequestCustomPriceSummary() {
  if (requestCustomPriceTotal) {
    requestCustomPriceTotal.textContent = `Total custom price: ${formatMoney(getCustomPaymentsTotal(state.modalCustomPayments))}`;
  }
}

function renderRequestCustomPrices() {
  if (!requestCustomPriceList) return;
  if (!state.modalCustomPayments.length) {
    requestCustomPriceList.innerHTML = '<p class="inline-note">No custom price entries added.</p>';
  } else {
    requestCustomPriceList.innerHTML = state.modalCustomPayments.map((payment, index) => `
      <div class="payment-entry-row" data-request-payment-index="${index}">
        <div class="field payment-entry-field">
          <label for="request-custom-price-amount-${index}">Amount</label>
          <input id="request-custom-price-amount-${index}" type="number" min="0" step="0.01" inputmode="decimal" data-request-payment-amount placeholder="LKR 0.00" value="${payment.amount}" />
        </div>
        <div class="field payment-entry-field payment-entry-field-note">
          <label for="request-custom-price-note-${index}">Note</label>
          <input id="request-custom-price-note-${index}" type="text" data-request-payment-note placeholder="Special charge / discount note" value="${escapeHtml(payment.note)}" />
        </div>
        <button class="subtle-btn payment-entry-remove" type="button" data-remove-request-payment="${index}">Remove</button>
      </div>
    `).join("");
  }
  updateRequestCustomPriceSummary();
}

function syncRequestAdvanceAmountField() {
  const isChecked = Boolean(requestAdvancePaidInput?.checked);
  toggleHidden(requestAdvanceAmountField, !isChecked);
  if (!isChecked && requestAdvanceAmountInput) {
    requestAdvanceAmountInput.value = "";
  }
}

function getRequestGroupRoomTotal() {
  const bookings = state.activeBookingGroup.length ? state.activeBookingGroup : (state.activeBooking ? [state.activeBooking] : []);
  if (!bookings.length) return 0;

  const roomEdits = state.modalBookingRoomEdits.size
    ? serializeBookingRoomEdits()
    : bookings.map((booking) => buildBookingRoomEditOptions(booking));
  const checkIn = requestCheckInInput?.value || state.activeBooking?.checkIn || "";
  const checkOut = requestCheckOutInput?.value || state.activeBooking?.checkOut || "";
  const offerPercentage = getRequestOfferPercentage();

  return roundCurrency(roomEdits.reduce((sum, roomEdit) => {
    const pricing = computeBookingPrice({
      checkIn,
      checkOut,
      roomType: normalizeRoomGroup(roomEdit.roomType),
      guests: Number(roomEdit.guests || 1),
      acEnabled: normalizeAcEnabled(roomEdit.roomType, roomEdit.acEnabled),
    });
    return sum + applyOfferPercentage(pricing.roomTotal, offerPercentage);
  }, 0));
}

function renderRequestOfferPreview() {
  if (!requestOfferPreview) return;
  const isFullBookingEdit = requestReasonInput?.value === "edit_booking_data" && state.requestScope === "group";
  if (isFullBookingEdit) {
    const roomTotal = getRequestGroupRoomTotal();
    const customPriceTotal = getCustomPaymentsTotal(state.modalCustomPayments);
    const totalPrice = roundCurrency(roomTotal + customPriceTotal);
    const advanceAmount = requestAdvancePaidInput?.checked ? roundCurrency(Number(requestAdvanceAmountInput?.value || 0)) : 0;
    const balanceAmount = roundCurrency(Math.max(0, totalPrice - advanceAmount));
    requestOfferPreview.textContent = advanceAmount > 0
      ? `Total price: ${formatMoney(totalPrice)} · Balance after advance: ${formatMoney(balanceAmount)}`
      : `Total price: ${formatMoney(totalPrice)}`;
    updateRequestCustomPriceSummary();
    return;
  }

  const roomPrice = Number(requestWeekendRateInput?.value || state.activeBooking?.weekendRate || state.activeBooking?.weekdayRate || 0);
  const snapshot = getBookingPricingSnapshot({
    checkIn: requestCheckInInput?.value || state.activeBooking?.checkIn || "",
    checkOut: requestCheckOutInput?.value || state.activeBooking?.checkOut || "",
    weekendRate: roomPrice,
    weekdayRate: roomPrice,
    offerPercentage: getRequestOfferPercentage(),
  });
  requestOfferPreview.textContent = snapshot.offerPercentage > 0
    ? `Final price after ${snapshot.offerPercentage}% offer: ${formatMoney(snapshot.roomTotal)}`
    : `Final price: ${formatMoney(snapshot.roomTotal)}`;
  updateRequestCustomPriceSummary();
}

function renderPricingScreen() {
  if (!pricingList || !roomInventoryList || !serviceCatalogList || !exportSettingsList || !settingsPreviewPanel) return;
  if (!state.serviceCatalog?.length) setDefaultServiceCatalogState();
  if (runtimeCheckInTimeInput) runtimeCheckInTimeInput.value = getRuntimeCheckInTime();
  if (runtimeCheckOutTimeInput) runtimeCheckOutTimeInput.value = getRuntimeCheckOutTime();
  if (!canManagePricing()) {
    setHTML(roomInventoryList, "");
    setHTML(serviceCatalogList, "");
    setHTML(exportSettingsList, "");
    setHTML(settingsPreviewPanel, "");
    setHTML(pricingList, `<p class="inline-note">You do not have room pricing access yet.</p>`);
    return;
  }

  roomInventoryList.innerHTML = "";
  serviceCatalogList.innerHTML = "";
  exportSettingsList.innerHTML = "";
  settingsPreviewPanel.innerHTML = "";
  pricingList.innerHTML = "";

  ROOM_DEFS.forEach((roomDef) => {
    const rooms = getRoomInventoryRows({ includeInactive: true }).filter((room) => room.roomType === roomDef.type);
    const activeCount = rooms.filter((room) => room.isActive).length;
    const inventoryCard = document.createElement("article");
    inventoryCard.className = "room-inventory-card";
    inventoryCard.innerHTML = `
      <div class="room-inventory-head">
        <div>
          <h4>${roomDef.label}</h4>
          <p>${rooms.length} room(s) configured · ${activeCount} active</p>
        </div>
        <button class="secondary-btn small-btn" type="button" data-add-room-type="${roomDef.type}">Add Room</button>
      </div>
      <div class="room-config-list">
        ${
          rooms.length
            ? rooms.map((room) => `
                <div class="room-config-row${room.isActive ? "" : " room-config-row-off"}">
                  <div class="room-config-main">
                    <strong>${getRoomLabel(room.roomType, room.roomNumber)}</strong>
                    <span>Max ${room.maxPax} Pax · ${room.isActive ? "On" : "Off"}</span>
                  </div>
                  <div class="room-config-actions">
                    <label class="room-config-toggle">
                      <input type="checkbox" ${room.isActive ? "checked" : ""} data-room-toggle="${room.roomType}-${room.roomNumber}" />
                      <span>${room.isActive ? "On" : "Off"}</span>
                    </label>
                    <button class="ghost-btn small-btn" type="button" data-delete-room="${room.roomType}-${room.roomNumber}">Delete</button>
                  </div>
                </div>
              `).join("")
            : `<p class="inline-note">No rooms configured yet for ${roomDef.label}.</p>`
        }
      </div>
    `;

    inventoryCard.querySelector(`[data-add-room-type="${roomDef.type}"]`)?.addEventListener("click", () => {
      state.roomInventory = [
        ...getRoomInventoryRows({ includeInactive: true }),
        normalizeRoomInventoryRow({
          roomType: roomDef.type,
          roomNumber: getNextRoomNumberForType(roomDef.type),
          maxPax: roomDef.maxPax,
          isActive: true,
        }),
      ].filter(Boolean).sort(sortRoomInventoryRows);
      renderPricingScreen();
    });

    inventoryCard.querySelectorAll("[data-room-toggle]").forEach((input) => {
      input.addEventListener("change", () => {
        const [roomType, roomNumber] = String(input.dataset.roomToggle || "").split("-");
        state.roomInventory = getRoomInventoryRows({ includeInactive: true }).map((room) => (
          room.roomType === roomType && Number(room.roomNumber) === Number(roomNumber)
            ? { ...room, isActive: input.checked }
            : room
        ));
        renderPricingScreen();
      });
    });

    inventoryCard.querySelectorAll("[data-delete-room]").forEach((button) => {
      button.addEventListener("click", () => {
        const [roomType, roomNumber] = String(button.dataset.deleteRoom || "").split("-");
        state.roomInventory = getRoomInventoryRows({ includeInactive: true }).filter((room) => !(
          room.roomType === roomType && Number(room.roomNumber) === Number(roomNumber)
        ));
        renderPricingScreen();
      });
    });

    roomInventoryList.appendChild(inventoryCard);
  });

  ROOM_PRICING_DEFS.forEach((config) => {
    const pricing = getPricingConfig(config.roomType, config.pax, config.acEnabled);
    const card = document.createElement("article");
    card.className = "pricing-card";
    card.innerHTML = `
      <div class="pricing-card-head">
        <div>
          <h4>${config.label}</h4>
          <p>${config.note}</p>
        </div>
      </div>
      <div class="pricing-grid">
        <label class="field compact-field">
          <span>Room Price</span>
          <input type="number" min="0" step="0.01" value="${Number(pricing.weekendPrice || 0)}" data-pricing-weekend />
        </label>
      </div>
    `;

    const weekendInput = card.querySelector("[data-pricing-weekend]");

    function syncCardValues() {
      const weekendPrice = roundCurrency(weekendInput.value);
      state.roomPricing.set(getRoomPricingKey(config.roomType, config.pax, config.acEnabled), {
        roomType: config.roomType,
        pax: config.pax,
        acEnabled: normalizeAcEnabled(config.roomType, config.acEnabled),
        weekendPrice,
        weekdayPercentage: 100,
      });
      renderPricingSummary();
    }

    weekendInput.addEventListener("input", syncCardValues);
    pricingList.appendChild(card);
  });

  const pdfCard = document.createElement("article");
  pdfCard.className = "pricing-card room-fix-panel-card";
  pdfCard.setAttribute("data-room-fix-panel", "pdf");
  pdfCard.setAttribute("draggable", "true");
  pdfCard.innerHTML = `
    <div class="pricing-card-head">
      <button class="room-fix-drag-handle" type="button" aria-label="Drag panel to reorder" title="Drag panel to reorder">⋮⋮</button>
      <div>
        <h4>PDF Export</h4>
        <p>Modern PDF with highlighted customer name, small track code, and automatic invoice / advance / hold heading.</p>
      </div>
    </div>
    <div class="export-share-note">
      <strong>Current PDF style</strong>
      <span>Top focus is the customer name. Track code stays small. The header changes automatically for invoice, advance payment, checkout, and hold bookings.</span>
    </div>
    <div class="export-field-list">
      ${EXPORT_FIELD_DEFS.map((field) => `
        <label class="export-field-row">
          <input type="checkbox" ${isExportFieldEnabled("pdf", field.key) ? "checked" : ""} data-export-channel="pdf" data-export-field="${field.key}" />
          <span>
            <strong>${field.label}</strong>
            <small>${field.note}</small>
          </span>
        </label>
      `).join("")}
    </div>
  `;

  pdfCard.querySelectorAll("[data-export-field]").forEach((input) => {
    input.addEventListener("change", () => {
      toggleRuntimeExportField(input.dataset.exportChannel, input.dataset.exportField, input.checked);
    });
  });

  const whatsappCard = document.createElement("article");
  whatsappCard.className = "pricing-card room-fix-panel-card";
  whatsappCard.setAttribute("data-room-fix-panel", "whatsapp");
  whatsappCard.setAttribute("draggable", "true");
  whatsappCard.innerHTML = `
    <div class="pricing-card-head">
      <button class="room-fix-drag-handle" type="button" aria-label="Drag panel to reorder" title="Drag panel to reorder">⋮⋮</button>
      <div>
        <h4>WhatsApp Message</h4>
        <p>Modern WhatsApp text with clear customer-first summary, payment block, and automatic invoice / advance / hold heading.</p>
      </div>
    </div>
    <div class="export-share-note">
      <strong>Current WhatsApp style</strong>
      <span>Message starts with the customer, status, and thank-you note. Payment summary and room details are shown in a short easy-to-read order.</span>
    </div>
    <div class="export-field-list">
      ${EXPORT_FIELD_DEFS.map((field) => `
        <label class="export-field-row">
          <input type="checkbox" ${isExportFieldEnabled("whatsapp", field.key) ? "checked" : ""} data-export-channel="whatsapp" data-export-field="${field.key}" />
          <span>
            <strong>${field.label}</strong>
            <small>${field.note}</small>
          </span>
        </label>
      `).join("")}
    </div>
  `;

  whatsappCard.querySelectorAll("[data-export-field]").forEach((input) => {
    input.addEventListener("change", () => {
      toggleRuntimeExportField(input.dataset.exportChannel, input.dataset.exportField, input.checked);
    });
  });

  const shareMessagesCard = document.createElement("article");
  shareMessagesCard.className = "pricing-card room-fix-panel-card";
  shareMessagesCard.setAttribute("data-room-fix-panel", "shareMessages");
  shareMessagesCard.setAttribute("draggable", "true");
  shareMessagesCard.innerHTML = `
    <div class="pricing-card-head">
      <button class="room-fix-drag-handle" type="button" aria-label="Drag panel to reorder" title="Drag panel to reorder">⋮⋮</button>
      <div>
        <h4>Customer Share Messages</h4>
        <p>These notes appear in advance-payment WhatsApp and PDF sharing so the customer gets clear next steps.</p>
      </div>
    </div>
    <div class="export-message-stack">
      <label class="field compact-field">
        <span>Rebooking Reminder</span>
        <textarea data-share-message="shareRebookingNote" rows="3">${escapeHtml(state.runtimeSettings?.shareRebookingNote || SHARE_COPY_DEFAULTS.rebookingNote)}</textarea>
      </label>
      <label class="field compact-field">
        <span>Contact Line</span>
        <textarea data-share-message="shareContactNote" rows="3">${escapeHtml(state.runtimeSettings?.shareContactNote || SHARE_COPY_DEFAULTS.contactNote)}</textarea>
      </label>
      <label class="field compact-field">
        <span>PDF Keep Note</span>
        <textarea data-share-message="sharePdfKeepNote" rows="3">${escapeHtml(state.runtimeSettings?.sharePdfKeepNote || SHARE_COPY_DEFAULTS.pdfKeepNote)}</textarea>
      </label>
    </div>
  `;

  shareMessagesCard.querySelectorAll("[data-share-message]").forEach((input) => {
    input.addEventListener("input", () => {
      state.runtimeSettings = {
        ...state.runtimeSettings,
        [input.dataset.shareMessage]: input.value,
      };
    });
  });

  const bookingViewCard = document.createElement("article");
  bookingViewCard.className = "pricing-card room-fix-panel-card";
  bookingViewCard.setAttribute("data-room-fix-panel", "bookingView");
  bookingViewCard.setAttribute("draggable", "true");
  bookingViewCard.innerHTML = `
    <div class="pricing-card-head">
      <button class="room-fix-drag-handle" type="button" aria-label="Drag panel to reorder" title="Drag panel to reorder">⋮⋮</button>
      <div>
        <h4>View By Date Booking Group</h4>
        <p>Choose which booking group details should be visible on the View By Date page.</p>
      </div>
    </div>
    <div class="export-settings-grid">
      ${BOOKING_VIEW_FIELD_DEFS.map((field) => `
        <label class="export-field-option">
          <input
            type="checkbox"
            data-booking-view-field="${field.key}"
            ${normalizeBookingViewFieldList(state.runtimeSettings?.bookingViewFields).includes(field.key) ? "checked" : ""}
          />
          <div>
            <strong>${field.label}</strong>
            <span>${field.note}</span>
          </div>
        </label>
      `).join("")}
    </div>
  `;

  bookingViewCard.querySelectorAll("[data-booking-view-field]").forEach((input) => {
    input.addEventListener("change", () => {
      toggleRuntimeBookingViewField(input.dataset.bookingViewField, input.checked);
      if (viewDateInput?.value) {
        loadBookingsForDate(viewDateInput.value);
      }
    });
  });

  const notificationAccessCard = document.createElement("article");
  notificationAccessCard.className = "pricing-card room-fix-panel-card";
  notificationAccessCard.setAttribute("data-room-fix-panel", "notifications");
  notificationAccessCard.setAttribute("draggable", "true");
  notificationAccessCard.innerHTML = `
    <div class="pricing-card-head">
      <button class="room-fix-drag-handle" type="button" aria-label="Drag panel to reorder" title="Drag panel to reorder">⋮⋮</button>
      <div>
        <h4>Notification Access</h4>
        <p>Choose which roles can open the Notifications page. Normal users only see their own related updates.</p>
      </div>
    </div>
    <div class="export-settings-grid">
      ${NOTIFICATION_ROLE_DEFS.map((role) => `
        <label class="export-field-option">
          <input
            type="checkbox"
            data-notification-role="${role.key}"
            ${normalizeNotificationRoleList(state.runtimeSettings?.notificationRoles).includes(role.key) ? "checked" : ""}
          />
          <div>
            <strong>${role.label}</strong>
            <span>${role.note}</span>
          </div>
        </label>
      `).join("")}
    </div>
  `;

  notificationAccessCard.querySelectorAll("[data-notification-role]").forEach((input) => {
    input.addEventListener("change", () => {
      toggleRuntimeNotificationRole(input.dataset.notificationRole, input.checked);
      updateNavVisibility();
      updateNotificationBadge();
    });
  });

  const systemUpdateAccessCard = document.createElement("article");
  systemUpdateAccessCard.className = "pricing-card room-fix-panel-card";
  systemUpdateAccessCard.setAttribute("data-room-fix-panel", "systemUpdates");
  systemUpdateAccessCard.setAttribute("draggable", "true");
  systemUpdateAccessCard.innerHTML = `
    <div class="pricing-card-head">
      <button class="room-fix-drag-handle" type="button" aria-label="Drag panel to reorder" title="Drag panel to reorder">⋮⋮</button>
      <div>
        <h4>System Updates Access</h4>
        <p>Choose which roles can open the System Updates page and review audit history.</p>
      </div>
    </div>
    <div class="export-settings-grid">
      ${NOTIFICATION_ROLE_DEFS.map((role) => `
        <label class="export-field-option">
          <input
            type="checkbox"
            data-system-update-role="${role.key}"
            ${normalizeSystemUpdateRoleList(state.runtimeSettings?.systemUpdateRoles).includes(role.key) ? "checked" : ""}
          />
          <div>
            <strong>${role.label}</strong>
            <span>${role.note}</span>
          </div>
        </label>
      `).join("")}
    </div>
  `;

  systemUpdateAccessCard.querySelectorAll("[data-system-update-role]").forEach((input) => {
    input.addEventListener("change", () => {
      toggleRuntimeSystemUpdateRole(input.dataset.systemUpdateRole, input.checked);
      updateNavVisibility();
    });
  });

  const roomFixPanels = new Map([
    ["pdf", pdfCard],
    ["whatsapp", whatsappCard],
    ["shareMessages", shareMessagesCard],
    ["bookingView", bookingViewCard],
    ["notifications", notificationAccessCard],
    ["systemUpdates", systemUpdateAccessCard],
  ]);

  normalizeRoomFixSectionOrder(state.runtimeSettings?.roomFixSectionOrder).forEach((key) => {
    const panel = roomFixPanels.get(key);
    if (panel) exportSettingsList.appendChild(panel);
  });

  exportSettingsList.querySelectorAll("[data-room-fix-panel]").forEach((panel) => {
    panel.addEventListener("dragstart", (event) => {
      panel.classList.add("room-fix-panel-dragging");
      event.dataTransfer?.setData("text/plain", String(panel.dataset.roomFixPanel || ""));
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    });
    panel.addEventListener("dragend", () => {
      panel.classList.remove("room-fix-panel-dragging");
      exportSettingsList.querySelectorAll(".room-fix-panel-drop-target").forEach((item) => {
        item.classList.remove("room-fix-panel-drop-target");
      });
    });
    panel.addEventListener("dragover", (event) => {
      event.preventDefault();
      panel.classList.add("room-fix-panel-drop-target");
      if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    });
    panel.addEventListener("dragleave", () => {
      panel.classList.remove("room-fix-panel-drop-target");
    });
    panel.addEventListener("drop", (event) => {
      event.preventDefault();
      panel.classList.remove("room-fix-panel-drop-target");
      const fromKey = String(event.dataTransfer?.getData("text/plain") || "");
      const toKey = String(panel.dataset.roomFixPanel || "");
      moveRoomFixSection(fromKey, toKey);
      renderPricingScreen();
    });
  });

  if (state.currentProfile?.role === "owner") {
    const previewRole = state.uiPreviewRole || "owner";
    const previewPages = getVisiblePageLabelsForRole(previewRole);
    const previewCard = document.createElement("article");
    previewCard.className = "pricing-card";
    previewCard.innerHTML = `
      <div class="pricing-card-head">
        <div>
          <h4>Temporary Role Preview</h4>
          <p>See how navigation and page access look for each role before you save new settings.</p>
        </div>
      </div>
      <div class="planner-climate-toggle">
        ${["owner", "admin", "user"].map((role) => `
          <button class="planner-climate-btn${(state.uiPreviewRole || "owner") === role ? " active" : ""}" type="button" data-preview-role="${role}">
            ${role === "owner" ? "Owner View" : role === "admin" ? "Admin View" : "User View"}
          </button>
        `).join("")}
      </div>
      <div class="system-update-detail-list">
        ${previewPages.map((label) => `<span class="system-update-detail-pill">${escapeHtml(label)}</span>`).join("")}
      </div>
      <p class="inline-note">${state.uiPreviewRole
        ? `Preview is active. You are seeing the app as ${state.uiPreviewRole}. Use the banner or Owner View to go back.`
        : "Preview is off. You are seeing the real owner view."}</p>
    `;
    previewCard.querySelectorAll("[data-preview-role]").forEach((button) => {
      button.addEventListener("click", () => {
        state.uiPreviewRole = button.dataset.previewRole === "owner" ? "" : String(button.dataset.previewRole || "");
        updateHeaderProfile();
        updateNavVisibility();
        renderPricingScreen();
      });
    });
    settingsPreviewPanel.appendChild(previewCard);
  }

  const serviceRows = getEditableServiceCatalogRows();
  const serviceCard = document.createElement("article");
  serviceCard.className = "pricing-card";
  serviceCard.innerHTML = `
    <div class="pricing-card-head">
      <div>
        <h4>Booking Services</h4>
        <p>Add services you want to use in bookings. Default price is optional.</p>
      </div>
      <button class="secondary-btn small-btn" type="button" data-add-service>Add Service</button>
    </div>
    <div class="service-config-list">
      ${
        serviceRows.length
          ? serviceRows.map((service, index) => `
              <div class="service-config-row${service.isActive ? "" : " room-config-row-off"}" data-service-index="${index}" draggable="true">
                <button class="service-drag-handle" type="button" aria-label="Drag service to reorder" title="Drag service to reorder">⋮⋮</button>
                <div class="service-config-main">
                  <label class="field compact-field">
                    <span>Service Name</span>
                    <input type="text" value="${escapeHtml(service.name)}" data-service-name />
                  </label>
                  <label class="field compact-field">
                    <span>Default Price</span>
                    <input type="number" min="0" step="0.01" value="${Number(service.defaultPrice || 0)}" data-service-price />
                  </label>
                </div>
                <div class="room-config-actions">
                  <label class="room-config-toggle">
                    <input type="checkbox" ${service.isActive ? "checked" : ""} data-service-toggle />
                    <span>${service.isActive ? "On" : "Off"}</span>
                  </label>
                  <button class="ghost-btn small-btn" type="button" data-delete-service>Delete</button>
                </div>
              </div>
            `).join("")
          : `<p class="inline-note">No services added yet.</p>`
      }
    </div>
  `;

  serviceCard.querySelector("[data-add-service]")?.addEventListener("click", () => {
    state.serviceCatalog = [
      ...getEditableServiceCatalogRows(),
      normalizeServiceCatalogRow({ name: "", defaultPrice: 0, isActive: true }),
    ];
    renderPricingScreen();
  });

  serviceCard.querySelectorAll("[data-service-index]").forEach((row) => {
    const index = Number(row.dataset.serviceIndex);
    const nameInput = row.querySelector("[data-service-name]");
    const priceInput = row.querySelector("[data-service-price]");
    const toggleInput = row.querySelector("[data-service-toggle]");
    const deleteBtn = row.querySelector("[data-delete-service]");

    nameInput?.addEventListener("input", () => {
      state.serviceCatalog[index] = normalizeServiceCatalogRow({
        ...state.serviceCatalog[index],
        name: nameInput.value,
      });
    });

    priceInput?.addEventListener("input", () => {
      state.serviceCatalog[index] = normalizeServiceCatalogRow({
        ...state.serviceCatalog[index],
        defaultPrice: priceInput.value,
      });
    });

    toggleInput?.addEventListener("change", () => {
      state.serviceCatalog[index] = normalizeServiceCatalogRow({
        ...state.serviceCatalog[index],
        isActive: toggleInput.checked,
      });
      renderPricingScreen();
    });

    deleteBtn?.addEventListener("click", () => {
      state.serviceCatalog = getEditableServiceCatalogRows().filter((_, itemIndex) => itemIndex !== index);
      renderPricingScreen();
    });

    row.addEventListener("dragstart", (event) => {
      row.classList.add("service-config-row-dragging");
      event.dataTransfer?.setData("text/plain", String(index));
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    });

    row.addEventListener("dragend", () => {
      row.classList.remove("service-config-row-dragging");
      serviceCard.querySelectorAll(".service-config-row-drop-target").forEach((item) => {
        item.classList.remove("service-config-row-drop-target");
      });
    });

    row.addEventListener("dragover", (event) => {
      event.preventDefault();
      row.classList.add("service-config-row-drop-target");
      if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    });

    row.addEventListener("dragleave", () => {
      row.classList.remove("service-config-row-drop-target");
    });

    row.addEventListener("drop", (event) => {
      event.preventDefault();
      row.classList.remove("service-config-row-drop-target");
      const fromIndex = Number(event.dataTransfer?.getData("text/plain"));
      moveServiceCatalogItem(fromIndex, index);
      renderPricingScreen();
    });
  });

  serviceCatalogList.appendChild(serviceCard);
}

async function saveRoomPricing() {
  if (!canManagePricing()) return;
  const savedPricing = await getSavedRoomPricingSnapshot();
  const rows = ROOM_PRICING_DEFS.map((config) => {
    const pricing = getPricingConfig(config.roomType, config.pax, config.acEnabled);
    return {
      room_type: config.roomType,
      pax: config.pax,
      ac_enabled: normalizeAcEnabled(config.roomType, config.acEnabled),
      weekend_price: roundCurrency(pricing.weekendPrice),
      weekday_percentage: 100,
    };
  });

  const changedRows = rows
    .map((row) => {
      const key = getRoomPricingKey(row.room_type, row.pax, row.ac_enabled);
      const previousPrice = roundCurrency(Number(savedPricing.get(key) || 0));
      const nextPrice = roundCurrency(Number(row.weekend_price || 0));
      if (previousPrice === nextPrice) return null;
      const config = ROOM_PRICING_DEFS.find(
        (item) => item.roomType === row.room_type
          && Number(item.pax) === Number(row.pax)
          && normalizeAcEnabled(item.roomType, item.acEnabled) === normalizeAcEnabled(row.room_type, row.ac_enabled),
      );
      return {
        key,
        label: config?.label || `${row.room_type} · ${row.pax} Pax`,
        previousPrice,
        nextPrice,
      };
    })
    .filter(Boolean);

  const { error } = await state.supabase.from(CONFIG.SUPABASE_PRICING_TABLE).upsert(rows, {
    onConflict: "room_type,pax,ac_enabled",
  });

  if (error) {
    throw new Error(error.message || "Could not save room pricing.");
  }

  state.pricingSchemaReady = true;
  if (changedRows.length) {
    const firstChange = changedRows[0];
    await insertNotification({
      eventType: "room_price_updated",
      title: changedRows.length === 1 ? "Room Price Updated" : "Room Prices Updated",
      message: changedRows.length === 1
        ? `${firstChange.label} changed from ${formatMoney(firstChange.previousPrice)} to ${formatMoney(firstChange.nextPrice)}.`
        : `${changedRows.length} room prices were changed in Settings.`,
      audience: "owner_admin",
      metadata: {
        guestName: "Settings",
        changes: changedRows,
      },
    });
    await insertSystemUpdate({
      updateType: "room_pricing_updated",
      title: changedRows.length === 1 ? "Room Price Updated" : "Room Prices Updated",
      message: changedRows.length === 1
        ? `${firstChange.label} changed from ${formatMoney(firstChange.previousPrice)} to ${formatMoney(firstChange.nextPrice)}.`
        : `${changedRows.length} room prices were changed in Settings.`,
      metadata: { changes: changedRows },
    });
  }
  await loadRoomPricing();
  return changedRows;
}

function renderPricingSummary() {
  if (!pricingSummaryList || !pricingSummaryTotal) return;
  const bookingCheckIn = bookingCheckInInput?.value;
  const selectedPlans = buildRoomList()
    .map((room) => {
      const plan = state.roomPlans.get(getRoomKey(room.type, room.number));
      if (!plan) return null;
      const totalGuests = Number(plan.pax || 0) + Number(plan.extraPax || 0);
      if (totalGuests <= 0) return null;
      return { room, plan, totalGuests };
    })
    .filter(Boolean);

  if (!bookingCheckIn || !selectedPlans.length) {
    setHTML(pricingSummaryList, `<p id="pricing-summary-empty" class="inline-note">Select rooms and nights to see the total price.</p>`);
    pricingSummaryTotal.textContent = formatMoney(0);
    if (bookingOfferPreview) bookingOfferPreview.textContent = `Total price: ${formatMoney(0)}`;
    if (bookingAdvanceBalancePreview) bookingAdvanceBalancePreview.textContent = `Total after advance: ${formatMoney(0)}`;
    updateCustomPriceSummary();
    return;
  }

  const offerPercentage = getBookingOfferPercentage();
  let roomTotal = 0;
  const lines = selectedPlans.map(({ room, plan, totalGuests }) => {
    const roomCheckOut = formatCheckoutFromNights(bookingCheckIn, Number(plan.nights || 1));
    const pricing = computeBookingPrice({
      checkIn: bookingCheckIn,
      checkOut: roomCheckOut,
      roomType: room.type,
      guests: totalGuests,
      acEnabled: normalizeAcEnabled(room.type, plan.acEnabled),
    });
    const finalPrice = applyOfferPercentage(pricing.roomTotal, offerPercentage);
    roomTotal += finalPrice;
    const pricingLabel = room.type === "normal"
      ? `${getRoomPricingLabel(room.type, pricing.pricingPax, plan.acEnabled)}`
      : getRoomPricingLabel(room.type, 0, plan.acEnabled);
    return `
      <div class="pricing-summary-row">
        <div>
          <strong>${getRoomLabel(room.type, room.number)}</strong>
          <div class="muted">${pricingLabel}${offerPercentage > 0 ? ` · Base ${formatMoney(pricing.roomTotal)} · Offer ${offerPercentage}%` : ` · Room Price ${formatMoney(pricing.roomTotal)}`}</div>
        </div>
        <strong>${formatMoney(finalPrice)}</strong>
      </div>
    `;
  }).join("");

  const customPriceTotal = getCustomPaymentsTotal(state.bookingCustomPayments);
  const totalPrice = roundCurrency(roomTotal + customPriceTotal);
  const advanceAmount = bookingAdvancePaidInput?.checked ? roundCurrency(Number(bookingAdvanceAmountInput?.value || 0)) : 0;
  const balanceAmount = roundCurrency(Math.max(0, totalPrice - advanceAmount));
  const customPriceRow = customPriceTotal > 0 ? `
    <div class="pricing-summary-row pricing-summary-row-highlight">
      <div>
        <strong>Custom Price</strong>
        <div class="muted">${state.bookingCustomPayments.length} custom item(s)</div>
      </div>
      <strong>${formatMoney(customPriceTotal)}</strong>
    </div>
  ` : "";

  pricingSummaryList.innerHTML = `${lines}${customPriceRow}`;
  pricingSummaryTotal.textContent = formatMoney(totalPrice);
  if (bookingOfferPreview) {
    bookingOfferPreview.textContent = offerPercentage > 0
      ? `Total price after ${offerPercentage}% offer and custom price: ${formatMoney(totalPrice)}`
      : `Total price: ${formatMoney(totalPrice)}`;
  }
  if (bookingAdvanceBalancePreview) {
    bookingAdvanceBalancePreview.textContent = `Total after advance: ${formatMoney(balanceAmount)}`;
  }
  updateCustomPriceSummary();
}

function datesOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function buildRoomList({ includeInactive = false } = {}) {
  return getRoomInventoryRows({ includeInactive }).map((room) => {
    const roomDef = getRoomDef(room.roomType);
    return {
      type: room.roomType,
      number: room.roomNumber,
      label: roomDef?.label || "Room",
      fullLabel: `${roomDef?.label || "Room"} ${room.roomNumber}`,
      maxPax: Number(room.maxPax || roomDef?.maxPax || 1),
      isActive: room.isActive,
    };
  });
}

function getRoomDef(type) {
  return ROOM_DEFS.find((room) => room.type === type);
}

function getRoomLabel(type, number) {
  const def = getRoomDef(type);
  if (!def) return "Room";
  return `${def.label} ${number}`;
}

function getRoomTypeLabelForGuests(roomType, guests, acEnabled = true) {
  const def = getRoomDef(normalizeRoomGroup(roomType));
  if (!def) return getRoomTypeDisplay(roomType);
  const climateLabel = getRoomClimateLabel(roomType, acEnabled);
  return climateLabel
    ? `${def.label} - ${guests} Pax - ${climateLabel}`
    : `${def.label} - ${guests} Pax`;
}

function splitNoteParts(notes) {
  return String(notes || "")
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
}

function extractServicesFromNotes(notes) {
  const part = splitNoteParts(notes).find((item) => item.toLowerCase().startsWith("services:"));
  if (!part) return [];
  return part
    .slice(part.indexOf(":") + 1)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseBookingNotes(notes) {
  const result = {
    services: [],
    drivers: "",
    extraGuests: "",
    otherNotes: [],
  };

  splitNoteParts(notes).forEach((part) => {
    const lower = part.toLowerCase();
    if (lower.startsWith("services:")) {
      result.services = part
        .slice(part.indexOf(":") + 1)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      return;
    }

    if (lower.startsWith("drivers:")) {
      result.drivers = part.slice(part.indexOf(":") + 1).trim();
      return;
    }

    if (lower.startsWith("extra pax / kids:")) {
      result.extraGuests = part.slice(part.indexOf(":") + 1).trim();
      return;
    }

    result.otherNotes.push(part);
  });

  return result;
}

function serviceIconLabel(service) {
  const map = {
    Breakfast: "BR",
    Lunch: "LU",
    Dinner: "DI",
    Liquor: "LQ",
    Kitchen: "KT",
    Car: "CR",
    Van: "VN",
  };
  return map[service] || service.slice(0, 2).toUpperCase();
}

function renderServiceChips(services) {
  if (!services?.length) return "";
  return `
    <div class="service-chip-list">
      ${services
        .map(
          (service) => `
            <span class="service-chip" title="${service}">
              <span class="service-chip-icon">${serviceIconLabel(service)}</span>
              <span>${service}</span>
            </span>
          `,
        )
        .join("")}
    </div>
  `;
}

function mergeNotesAndServices(notes, services) {
  const parts = splitNoteParts(notes).filter((part) => !part.toLowerCase().startsWith("services:"));
  if (services.length) parts.push(`Services: ${services.join(", ")}`);
  return parts.join(" | ");
}

function renderGroupServiceToggleButtons(group) {
  const active = new Set(parseBookingNotes(group.bookings[0]?.notes || "").services);
  return `
    <div class="service-chip-list service-chip-list-editable">
      ${getServiceOptionNames(active).map((service) => `
        <button
          class="service-chip service-chip-toggle ${active.has(service) ? "service-chip-active" : "service-chip-inactive"}"
          type="button"
          data-group-service-toggle="${group.trackCode || group.key}"
          data-service-name="${service}"
          aria-pressed="${active.has(service) ? "true" : "false"}"
        >
          <span class="service-chip-icon">${serviceIconLabel(service)}</span>
          <span>${service}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function syncGroupCustomPaymentsWithServices(bookings = [], nextServices = []) {
  const selectedServices = new Set((nextServices || []).map((service) => String(service || "").trim().toLowerCase()));
  const existingEntries = getGroupCustomPriceEntries(bookings);
  const knownServiceNames = new Set(
    getServiceOptionNames(getGroupServices(bookings))
      .map((service) => String(service || "").trim().toLowerCase())
      .filter(Boolean),
  );
  const preserved = existingEntries.filter((item) => {
    const noteKey = String(item.note || "").trim().toLowerCase();
    if (!noteKey) return false;
    return !knownServiceNames.has(noteKey);
  });
  const linked = nextServices.map((service) => {
    const existing = existingEntries.find((item) => String(item.note || "").trim().toLowerCase() === String(service || "").trim().toLowerCase());
    return existing || { amount: roundCurrency(getServiceConfig(service)?.defaultPrice || 0), note: service };
  });
  return [...linked, ...preserved];
}

function promptForServiceAmount(serviceName, currentAmount = 0) {
  const amountInput = window.prompt(
    `Enter price for ${serviceName}. Leave empty or 0 if not charged.`,
    currentAmount ? String(currentAmount) : "",
  );
  if (amountInput === null) return null;
  return roundCurrency(Math.max(0, Number(amountInput || 0)));
}

async function applyGroupServicesAndPayments(group, nextServices = [], nextCustomPayments = []) {
  for (const booking of group.bookings) {
    const bookingParsed = parseBookingNotes(booking.notes);
    await updateBooking(booking.id, {
      guestName: booking.guestName,
      phone: booking.phone,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      roomType: booking.roomType,
      roomTypeLabel: booking.roomTypeLabel,
      roomNumber: booking.roomNumber,
      notes: mergeNotesAndServices(bookingParsed.otherNotes.join(" | "), nextServices),
      status: booking.status,
      customPayments: nextCustomPayments,
    });
  }
}

async function toggleGroupServiceDirect(groupKey, serviceName) {
  const group = getBookingGroupByKey(groupKey);
  if (!group?.bookings?.length) throw new Error("Booking group not found.");
  const parsed = parseBookingNotes(group.bookings[0].notes);
  const next = new Set(parsed.services);
  const hadService = next.has(serviceName);
  if (getGroupLifecycleStatus(group) === "checked_in" && !canManageBookings()) {
    if (hadService) {
      showToast("Checked-in bookings can add new services, but existing services cannot be removed.", true);
      return;
    }
    next.add(serviceName);
  } else if (hadService) {
    next.delete(serviceName);
  } else {
    next.add(serviceName);
  }
  const nextServices = Array.from(next);
  let nextCustomPayments = syncGroupCustomPaymentsWithServices(group.bookings, nextServices);
  if (hadService && !next.has(serviceName)) {
    const removedKey = String(serviceName || "").trim().toLowerCase();
    nextCustomPayments = nextCustomPayments.filter((item) => String(item.note || "").trim().toLowerCase() !== removedKey);
  }
  const linkedEntry = nextCustomPayments.find((item) => String(item.note || "").trim().toLowerCase() === String(serviceName || "").trim().toLowerCase());
  if (linkedEntry && next.has(serviceName)) {
    const amount = promptForServiceAmount(serviceName, linkedEntry.amount || 0);
    if (amount === null) return;
    linkedEntry.amount = amount;
  }
  await applyGroupServicesAndPayments(group, nextServices, nextCustomPayments);
}

async function updateGroupServicePrice(groupKey, serviceName) {
  const group = getBookingGroupByKey(groupKey);
  if (!group?.bookings?.length) throw new Error("Booking group not found.");
  const nextServices = getGroupServices(group.bookings);
  if (!nextServices.includes(serviceName)) {
    nextServices.push(serviceName);
  }
  const nextCustomPayments = syncGroupCustomPaymentsWithServices(group.bookings, nextServices);
  const linkedEntry = nextCustomPayments.find((item) => String(item.note || "").trim().toLowerCase() === String(serviceName || "").trim().toLowerCase());
  const amount = promptForServiceAmount(serviceName, linkedEntry?.amount || 0);
  if (amount === null) return false;
  if (linkedEntry) {
    linkedEntry.amount = amount;
  } else {
    nextCustomPayments.push({ amount, note: serviceName });
  }
  await applyGroupServicesAndPayments(group, nextServices, nextCustomPayments);
  return true;
}

async function promptGroupCustomServiceAdd(groupKey) {
  const group = getBookingGroupByKey(groupKey);
  if (!group?.bookings?.length) throw new Error("Booking group not found.");

  const serviceInput = window.prompt("Custom service name. Example: BBQ / Boat Ride / Special Dinner.", "");
  if (serviceInput == null) return false;
  const serviceName = String(serviceInput || "").trim();
  if (!serviceName) {
    throw new Error("Enter a custom service name.");
  }

  const amount = promptForServiceAmount(serviceName, 0);
  if (amount === null) return false;

  const nextServices = getGroupServices(group.bookings);
  if (!nextServices.some((item) => item.toLowerCase() === serviceName.toLowerCase())) {
    nextServices.push(serviceName);
  }
  const nextCustomPayments = syncGroupCustomPaymentsWithServices(group.bookings, nextServices);
  const existing = nextCustomPayments.find((item) => String(item.note || "").trim().toLowerCase() === serviceName.toLowerCase());
  if (existing) {
    existing.amount = amount;
  } else {
    nextCustomPayments.push({ amount, note: serviceName });
  }

  await applyGroupServicesAndPayments(group, nextServices, nextCustomPayments);
  return true;
}

function getAdvancePaymentInfo(bookings = []) {
  const items = Array.isArray(bookings) ? bookings : [];
  const total = items.length;
  const amount = roundCurrency(Number(items.find((booking) => Number(booking.advanceAmount || 0) > 0)?.advanceAmount || items[0]?.advanceAmount || 0));
  const paidCount = items.filter((booking) => Boolean(booking.advancePaid) || Number(booking.advanceAmount || 0) > 0).length;
  if (!total || paidCount === 0) {
    return { label: "Pending", allPaid: false, partiallyPaid: false, amount };
  }
  if (paidCount === total) {
    return { label: "Received", allPaid: true, partiallyPaid: false, amount };
  }
  return { label: "Partial", allPaid: false, partiallyPaid: true, amount };
}

function isGroupAdvancePending(groupKey) {
  const group = getBookingGroupByKey(groupKey);
  if (!group?.bookings?.length) return false;
  const advanceInfo = getAdvancePaymentInfo(group.bookings);
  return !advanceInfo.allPaid;
}

function isPlannerPendingBooking(booking, pendingCollections) {
  const groupKey = getBookingGroupKey(booking);
  const hasPendingRequest = pendingCollections.byTrack.get(groupKey)?.status === "pending";
  const isPendingStatus = String(booking.status || "").toLowerCase() === "pending";
  return isPendingStatus || hasPendingRequest || isGroupAdvancePending(groupKey);
}

function getGroupCustomPriceEntries(bookings = []) {
  const items = Array.isArray(bookings) ? bookings : [];
  const source = items.find((booking) => getBookingCustomPriceEntries(booking).length);
  return source ? getBookingCustomPriceEntries(source) : [];
}

function getGroupCustomPriceTotal(bookings = []) {
  return getCustomPaymentsTotal(getGroupCustomPriceEntries(bookings));
}

function getBookingBalanceAmount(group) {
  const total = roundCurrency(Number(group?.totalPrice || 0));
  const advanceAmount = roundCurrency(Number(getAdvancePaymentInfo(group?.bookings || []).amount || 0));
  return roundCurrency(Math.max(0, total - advanceAmount));
}

function getRuntimeCheckInTime() {
  return String(state.runtimeSettings?.checkInTime || "14:00");
}

function getRuntimeCheckOutTime() {
  return String(state.runtimeSettings?.checkOutTime || "11:00");
}

function getDateTimeFromBooking(dateKey, timeValue) {
  if (!dateKey) return null;
  const [hours, minutes] = String(timeValue || "00:00").split(":").map((value) => Number(value || 0));
  const date = parseDate(dateKey);
  if (!date) return null;
  date.setHours(hours || 0, minutes || 0, 0, 0);
  return date;
}

function normalizeTimestampValue(value) {
  if (!value) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function getBookingLifecycleStatus(booking) {
  return String(booking?.lifecycleStatus || "booked").toLowerCase();
}

function isBookingCheckedIn(booking) {
  return getBookingLifecycleStatus(booking) === "checked_in";
}

function isBookingCheckedOut(booking) {
  return getBookingLifecycleStatus(booking) === "checked_out";
}

function isBookingHold(booking) {
  return getBookingLifecycleStatus(booking) === "hold";
}

function getLifecycleStatusLabel(value) {
  switch (String(value || "").toLowerCase()) {
    case "checked_in":
      return "Checked In";
    case "checked_out":
      return "Checked Out";
    case "hold":
      return "Hold";
    default:
      return "Booked";
  }
}

function getGroupLifecycleStatus(group) {
  const statuses = Array.from(new Set((group?.bookings || []).map((booking) => getBookingLifecycleStatus(booking))));
  if (!statuses.length) return "booked";
  if (statuses.length === 1) return statuses[0];
  if (statuses.includes("checked_out")) return "checked_out";
  if (statuses.includes("checked_in")) return "checked_in";
  if (statuses.includes("hold")) return "hold";
  return statuses[0];
}

function hasCheckInWindowStarted(bookingOrGroup) {
  const booking = bookingOrGroup?.bookings?.[0] || bookingOrGroup;
  if (!booking?.checkIn) return false;
  const checkInMoment = getDateTimeFromBooking(booking.checkIn, getRuntimeCheckInTime());
  if (!checkInMoment) return false;
  return new Date() >= checkInMoment;
}

function hasCheckOutWindowStarted(bookingOrGroup) {
  const booking = bookingOrGroup?.bookings?.[0] || bookingOrGroup;
  if (!booking?.checkOut) return false;
  const checkOutMoment = getDateTimeFromBooking(booking.checkOut, getRuntimeCheckOutTime());
  if (!checkOutMoment) return false;
  return new Date() >= checkOutMoment;
}

function canEditBookingGroupDirect(group) {
  if (canManageBookings()) return true;
  const lifecycle = getGroupLifecycleStatus(group);
  if (lifecycle === "checked_in" || lifecycle === "checked_out" || lifecycle === "hold") return false;
  if (hasCheckInWindowStarted(group)) return false;
  return true;
}

function canUpdateBookingAdvance(group) {
  if (canManageBookings()) return true;
  const lifecycle = getGroupLifecycleStatus(group);
  return lifecycle !== "checked_out" && lifecycle !== "hold";
}

function getBookingStayedHours(group) {
  const sample = group?.bookings?.find((booking) => booking.checkedInAt && booking.checkedOutAt) || group?.bookings?.[0];
  if (!sample?.checkedInAt || !sample?.checkedOutAt) return "-";
  const start = new Date(sample.checkedInAt);
  const end = new Date(sample.checkedOutAt);
  const diffHours = Math.max(0, (end - start) / 3600000);
  return `${diffHours.toFixed(1)} h`;
}

async function updateGroupAdvancePayment(groupKey, advanceAmount) {
  const group = getBookingGroupByKey(groupKey);
  if (!group?.bookings?.length) throw new Error("Booking group not found.");
  const normalizedAmount = roundCurrency(Math.max(0, Number(advanceAmount || 0)));
  const advancePaid = normalizedAmount > 0;

  for (const booking of group.bookings) {
    await updateBooking(booking.id, {
      guestName: booking.guestName,
      phone: booking.phone,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      roomType: booking.roomType,
      roomTypeLabel: booking.roomTypeLabel,
      roomNumber: booking.roomNumber,
      notes: booking.notes,
      status: booking.status,
      guests: booking.guests,
      roomsNeeded: booking.roomsNeeded,
      advancePaid,
      advanceAmount: normalizedAmount,
    });
  }
}

async function promptGroupCustomPriceAdd(groupKey) {
  const group = getBookingGroupByKey(groupKey);
  if (!group?.bookings?.length) throw new Error("Booking group not found.");

  const noteInput = window.prompt("Custom price note. Example: Late checkout / transport / extra charge.", "");
  if (noteInput == null) return false;
  const note = String(noteInput || "").trim();
  if (!note) {
    throw new Error("Enter a custom price note.");
  }

  const amountInput = window.prompt(`Enter amount for ${note}.`, "");
  if (amountInput == null) return false;
  const amount = roundCurrency(Number(amountInput || 0));
  if (Number.isNaN(amount) || amount <= 0) {
    throw new Error("Enter a valid amount greater than 0.");
  }

  const nextCustomPayments = getGroupCustomPriceEntries(group.bookings);
  const existing = nextCustomPayments.find(
    (item) => String(item.note || "").trim().toLowerCase() === note.toLowerCase(),
  );
  if (existing) {
    existing.amount = roundCurrency(Number(existing.amount || 0) + amount);
  } else {
    nextCustomPayments.push({ amount, note });
  }

  const mergedNotes = mergeNotesAndServices(
    getGroupOtherNotes(group.bookings),
    getGroupServices(group.bookings),
  );

  for (const booking of group.bookings) {
    await updateBooking(booking.id, {
      guestName: booking.guestName,
      phone: booking.phone,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      roomType: booking.roomType,
      roomTypeLabel: booking.roomTypeLabel,
      roomNumber: booking.roomNumber,
      notes: mergedNotes,
      status: booking.status,
      guests: booking.guests,
      roomsNeeded: booking.roomsNeeded,
      customPayments: nextCustomPayments,
    });
  }

  return true;
}

function renderBookingCustomPayments() {
  if (!bookingCustomPaymentList) return;
  if (!state.bookingCustomPayments.length) {
    bookingCustomPaymentList.innerHTML = '<p class="inline-note">No custom price entries added.</p>';
  } else {
    bookingCustomPaymentList.innerHTML = state.bookingCustomPayments.map((payment, index) => `
      <div class="payment-entry-row" data-payment-index="${index}">
        <div class="field payment-entry-field">
          <label for="custom-payment-amount-${index}">Amount</label>
          <input id="custom-payment-amount-${index}" type="number" min="0" step="0.01" inputmode="decimal" data-payment-amount placeholder="LKR 0.00" value="${payment.amount}" />
        </div>
        <div class="field payment-entry-field payment-entry-field-note">
          <label for="custom-payment-note-${index}">Note</label>
          <input id="custom-payment-note-${index}" type="text" data-payment-note ${payment.linkedService ? "readonly" : ""} placeholder="Lunch / transport / special charge" value="${escapeHtml(payment.note)}" />
        </div>
        ${payment.linkedService
          ? `<button class="subtle-btn payment-entry-remove" type="button" disabled>Service</button>`
          : `<button class="subtle-btn payment-entry-remove" type="button" data-remove-payment="${index}">Remove</button>`}
      </div>
    `).join("");
  }
  updateCustomPriceSummary();
}

function syncAdvanceAmountField() {
  const isChecked = Boolean(bookingAdvancePaidInput?.checked);
  toggleHidden(bookingAdvanceAmountField, !isChecked);
  if (!isChecked && bookingAdvanceAmountInput) {
    bookingAdvanceAmountInput.value = "";
  }
  if (bookingAdvanceBalancePreview) {
    const previewTotal = roundCurrency(Number(pricingSummaryTotal?.textContent?.replace(/[^\d.-]/g, "") || 0));
    const advanceAmount = isChecked ? roundCurrency(Number(bookingAdvanceAmountInput?.value || 0)) : 0;
    bookingAdvanceBalancePreview.textContent = `Total after advance: ${formatMoney(Math.max(0, previewTotal - advanceAmount))}`;
  }
}

function handleBookingCustomPaymentInput(index, field, value) {
  if (!state.bookingCustomPayments[index]) return;
  if (field === "amount") {
    state.bookingCustomPayments[index].amount = value;
  } else {
    state.bookingCustomPayments[index].note = value;
  }
  updateCustomPriceSummary();
  renderPricingSummary();
}

function handleRequestCustomPaymentInput(index, field, value) {
  if (!state.modalCustomPayments[index]) return;
  if (field === "amount") {
    state.modalCustomPayments[index].amount = value;
  } else {
    state.modalCustomPayments[index].note = value;
  }
  updateRequestCustomPriceSummary();
  renderRequestOfferPreview();
}

function getBookingCustomPaymentsPayload() {
  return normalizeCustomPayments(state.bookingCustomPayments);
}

function updateCustomPriceSummary() {
  if (bookingCustomPaymentsTotal) {
    bookingCustomPaymentsTotal.textContent = `Total custom price: ${formatMoney(getCustomPaymentsTotal(state.bookingCustomPayments))}`;
  }
}

function syncCustomPriceRowsFromServices() {
  const selectedServices = Array.from(getSelectedBookingServices().values());
  const preserved = state.bookingCustomPayments.filter((item) => !item.linkedService);
  const linked = selectedServices.map((service) => {
    const current = state.bookingCustomPayments.find((item) => item.linkedService === service);
    const defaultPrice = getServiceConfig(service)?.defaultPrice || 0;
    return current || { amount: defaultPrice ? String(defaultPrice) : "", note: service, linkedService: service };
  });
  state.bookingCustomPayments = [...linked, ...preserved];
  renderBookingCustomPayments();
  renderPricingSummary();
}

async function promptGroupPaymentUpdate(groupKey) {
  const group = getBookingGroupByKey(groupKey);
  if (!group?.bookings?.length) throw new Error("Booking group not found.");
  const advanceInfo = getAdvancePaymentInfo(group.bookings);
  const input = window.prompt("Enter advance amount received. Use 0 to mark pending.", String(advanceInfo.amount || 0));
  if (input == null) return false;
  const nextAmount = roundCurrency(Number(input));
  if (Number.isNaN(nextAmount) || nextAmount < 0) {
    throw new Error("Enter a valid advance amount.");
  }
  await updateGroupAdvancePayment(groupKey, nextAmount);
  return true;
}

async function removeBookingRoomDirect(bookingId) {
  const booking = state.bookingMap.get(bookingId);
  if (!booking) throw new Error("Booking not found.");
  await updateBooking(booking.id, {
    guestName: booking.guestName,
    phone: booking.phone,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    roomType: booking.roomType,
    roomTypeLabel: booking.roomTypeLabel,
    roomNumber: booking.roomNumber,
    notes: booking.notes,
    status: "Cancelled",
  });
  await insertChangeRequest({
    bookingId: booking.id,
    reason: "remove_rooms",
    requestScope: "single",
    guestName: booking.guestName,
    phone: booking.phone,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    roomType: booking.roomType,
    roomTypeLabel: booking.roomTypeLabel,
    roomNumber: booking.roomNumber,
    notes: booking.notes,
    status: "Cancelled",
    requestedRemoveRooms: [{ bookingId: booking.id, roomType: normalizeRoomGroup(booking.roomType), roomNumber: booking.roomNumber }],
    requestStatusOverride: "approved",
    adminNote: "Removed from booking card.",
    reviewedBy: state.currentSession.user.id,
    reviewedAt: new Date().toISOString(),
  });
}

async function createFullRemovalRequest(booking) {
  await insertChangeRequest({
    bookingId: booking.id,
    reason: "delete_booking",
    requestScope: "group",
    guestName: booking.guestName,
    phone: booking.phone,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    roomType: booking.roomType,
    roomTypeLabel: booking.roomTypeLabel,
    roomNumber: booking.roomNumber,
    notes: booking.notes,
    status: "Cancelled",
  });
}

function renderRoomServiceAssignments() {
  if (!roomServiceAssignments) return;
  const selectedPlans = buildRoomList()
    .map((room) => {
      const plan = state.roomPlans.get(getRoomKey(room.type, room.number));
      const totalGuests = Number(plan?.pax || 0) + Number(plan?.extraPax || 0);
      return plan && totalGuests > 0 ? { room, plan } : null;
    })
    .filter(Boolean);

  roomServiceAssignments.innerHTML = "";

  if (!selectedPlans.length) {
    roomServiceAssignments.innerHTML = '<p class="inline-note">Select rooms first to assign services.</p>';
    syncCustomPriceRowsFromServices();
    return;
  }

  const selectedServices = getSelectedBookingServices();
  const roomSummary = selectedPlans
    .map(({ room, plan }) => `${getRoomLabel(room.type, room.number)}${room.type === "driver" && plan.pax ? ` · Drivers: ${plan.pax}` : ""}`)
    .join(" · ");

  const card = document.createElement("div");
  card.className = "room-service-card";
  card.innerHTML = `
    <div class="room-service-head">
      <div>
        <div class="room-service-title">Booking Services</div>
        <div class="room-service-meta">Applies to all selected rooms: ${roomSummary}</div>
      </div>
    </div>
    <div class="room-service-grid">
      ${getServiceOptionNames(Array.from(selectedServices)).map((service) => {
        const id = `booking-service-${service.toLowerCase().replace(/\s+/g, "-")}`;
        return `
          <label class="service-option">
            <input id="${id}" type="checkbox" value="${service}" ${selectedServices.has(service) ? "checked" : ""} />
            <span>${service}</span>
          </label>
        `;
      }).join("")}
    </div>
  `;

  card.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) selectedServices.add(input.value);
      else selectedServices.delete(input.value);
      syncCustomPriceRowsFromServices();
    });
  });

  roomServiceAssignments.appendChild(card);
}

function populateRequestRoomNumbers(roomType, selectedNumber) {
  if (!requestRoomNumberInput) return;
  const numbers = getRoomNumbersForType(roomType, { selectedNumber });
  setHTML(requestRoomNumberInput, numbers.map((value) => {
    return `<option value="${value}"${Number(selectedNumber) === value ? " selected" : ""}>Room ${value}</option>`;
  }).join(""));
}

function populateRequestGuestsOptions(roomType, selectedGuests) {
  if (!requestGuestsInput) return;
  const def = getRoomDef(normalizeRoomGroup(roomType));
  const maxPax = def?.maxPax || 1;
  const chosenGuests = Math.min(Math.max(Number(selectedGuests) || 1, 1), maxPax);
  setHTML(requestGuestsInput, Array.from({ length: maxPax }, (_, index) => {
    const pax = index + 1;
    return `<option value="${pax}"${pax === chosenGuests ? " selected" : ""}>${pax} Pax</option>`;
  }).join(""));
}

async function renderAdditionalRoomOptions(booking) {
  state.modalExtraRooms = new Map();
  if (!requestExtraRooms) return;
  setHTML(requestExtraRooms, "");
  const bookings = await fetchBookingsForPeriod(booking.checkIn, booking.checkOut);
  const occupied = new Map();

  bookings.forEach((item) => {
    if (!isBlockingBooking(item)) return;
    if (item.id === booking.id) return;
    occupied.set(`${normalizeRoomGroup(item.roomType)}-${item.roomNumber}`, item);
  });

  const selectableRooms = buildRoomList().filter((room) => {
    const key = `${room.type}-${room.number}`;
    return `${normalizeRoomGroup(booking.roomType)}-${booking.roomNumber}` !== key;
  });

  if (!selectableRooms.length) {
    setHTML(requestExtraRooms, `<p class="inline-note">No rooms configured.</p>`);
    return;
  }

  selectableRooms.forEach((room) => {
    const key = `${room.type}-${room.number}`;
    const existingBooking = occupied.get(key);
    const isBooked = Boolean(existingBooking);
    const paxOptions = Array.from({ length: room.maxPax }, (_, index) => {
      const pax = index + 1;
      return `<option value="${pax}">${pax} Pax</option>`;
    }).join("");

    const item = document.createElement("label");
    item.className = `extra-room-option${isBooked ? " booked" : ""}`;
    item.innerHTML = `
      <div class="extra-room-option-head">
        <input type="checkbox" value="${key}" ${isBooked ? "disabled" : ""} />
        <div>
          <strong>${getRoomLabel(room.type, room.number)}</strong>
          <span>${room.label} · max ${room.maxPax} Pax</span>
          ${
            isBooked
              ? `<span class="booked-label">Booked: ${existingBooking.guestName || "-"} · ${existingBooking.trackCode || "-"}</span>`
              : `<span>Available for selected dates</span>`
          }
        </div>
      </div>
      <select data-extra-room-pax disabled>
        ${paxOptions}
      </select>
    `;
    const checkbox = item.querySelector("input");
    const paxSelect = item.querySelector("[data-extra-room-pax]");

    if (!checkbox || !paxSelect) {
      requestExtraRooms.appendChild(item);
      return;
    }

    checkbox.addEventListener("change", (event) => {
      paxSelect.disabled = !event.target.checked;
      if (event.target.checked) {
        state.modalExtraRooms.set(key, {
          roomType: room.type,
          roomNumber: room.number,
          pax: Number(paxSelect.value),
        });
      } else {
        state.modalExtraRooms.delete(key);
      }
    });

    paxSelect.addEventListener("change", () => {
      if (!checkbox.checked) return;
      state.modalExtraRooms.set(key, {
        roomType: room.type,
        roomNumber: room.number,
        pax: Number(paxSelect.value),
      });
    });
    requestExtraRooms.appendChild(item);
  });
}

function renderServiceRequestOptions(booking) {
  state.modalRequestedServices = new Set(extractServicesFromNotes(booking.notes));
  if (!requestServices) return;
  setHTML(requestServices, "");
  getServiceOptionNames(Array.from(state.modalRequestedServices)).forEach((service) => {
    const id = `request-service-${service.toLowerCase().replace(/\s+/g, "-")}`;
    const item = document.createElement("label");
    item.className = "service-option";
    item.innerHTML = `<input id="${id}" type="checkbox" value="${service}" ${state.modalRequestedServices.has(service) ? "checked" : ""} /> <span>${service}</span>`;
    const checkbox = item.querySelector("input");
    if (!checkbox) {
      requestServices.appendChild(item);
      return;
    }
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) state.modalRequestedServices.add(service);
      else state.modalRequestedServices.delete(service);
    });
    requestServices.appendChild(item);
  });
}

function renderRemoveRoomOptions(booking) {
  state.modalRemoveRooms = new Map();
  if (!requestRemoveRooms) return;
  setHTML(requestRemoveRooms, "");
  const group = state.requestScope === "group"
    ? (state.activeBookingGroup.length ? state.activeBookingGroup : [booking])
    : [booking];
  if (!group.length) {
    setHTML(requestRemoveRooms, `<p class="inline-note">No rooms found for this booking.</p>`);
    return;
  }

  group.forEach((item) => {
    const key = String(item.id);
    const roomGroup = normalizeRoomGroup(item.roomType);
    const option = document.createElement("label");
    option.className = "extra-room-option";
    option.innerHTML = `
      <div class="extra-room-option-head">
        <input
          type="checkbox"
          value="${key}"
          data-remove-booking-id="${item.id}"
          data-room-type="${roomGroup}"
          data-room-number="${item.roomNumber}"
        />
        <div>
          <strong>${getRoomLabel(roomGroup, item.roomNumber)}</strong>
          <span>${item.roomTypeLabel || getRoomTypeDisplay(item.roomType)} · ${item.guests} guests</span>
          <span>${item.checkIn} -> ${item.checkOut}</span>
        </div>
      </div>
    `;
    const checkbox = option.querySelector("input");
    if (!checkbox) {
      requestRemoveRooms.appendChild(option);
      return;
    }
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        state.modalRemoveRooms.set(key, {
          bookingId: item.id,
          roomType: roomGroup,
          roomNumber: item.roomNumber,
        });
      } else {
        state.modalRemoveRooms.delete(key);
      }
    });
    requestRemoveRooms.appendChild(option);
  });
}

function buildBookingRoomEditOptions(booking) {
  const parsed = parseBookingNotes(booking.notes);
  return {
    key: String(booking.id),
    bookingId: booking.id,
    roomType: normalizeRoomGroup(booking.roomType),
    roomNumber: Number(booking.roomNumber),
    guests: Number(booking.guests || 1),
    acEnabled: normalizeAcEnabled(booking.roomType, booking.acEnabled),
    services: [...parsed.services],
    isNew: false,
  };
}

function serializeBookingRoomEdits() {
  return Array.from(state.modalBookingRoomEdits.values()).map((item) => ({
    key: item.key || String(item.bookingId || ""),
    bookingId: item.bookingId,
    roomType: normalizeRoomGroup(item.roomType),
    roomNumber: Number(item.roomNumber),
    guests: Number(item.guests || 1),
    acEnabled: normalizeAcEnabled(item.roomType, item.acEnabled),
    services: Array.isArray(item.services) ? [...item.services] : [],
    isNew: Boolean(item.isNew || !item.bookingId),
  }));
}

function createNewBookingRoomEditEntry(seed = Date.now()) {
  const usedRoomKeys = new Set(
    Array.from(state.modalBookingRoomEdits.values()).map((item) => `${normalizeRoomGroup(item.roomType)}-${Number(item.roomNumber)}`)
  );
  const preferredRoomNumber = getRoomNumbersForType("normal", { selectedNumber: 1 }).find((number) => !usedRoomKeys.has(`normal-${number}`)) || 1;
  return {
    key: `new-room-${seed}`,
    bookingId: null,
    roomType: "normal",
    roomNumber: preferredRoomNumber,
    guests: 1,
    acEnabled: true,
    services: [],
    isNew: true,
  };
}

function renderBookingRoomEditors(booking) {
  state.modalBookingRoomEdits = new Map();
  if (!requestBookingRooms) return;
  setHTML(requestBookingRooms, "");
  const group = state.activeBookingGroup.length ? state.activeBookingGroup : [booking];

  if (!group.length) {
    setHTML(requestBookingRooms, `<p class="inline-note">No rooms found for this booking.</p>`);
    return;
  }

  const renderEditors = () => {
    const rows = Array.from(state.modalBookingRoomEdits.values());
    requestBookingRooms.innerHTML = `
      <div class="request-room-editor-head">
        <p class="inline-note">Update room, pax, room mode, and services. Add extra rooms directly here if the same customer needs more rooms.</p>
        <button class="secondary-btn small-btn" type="button" data-add-booking-room>Edit + Add Room</button>
      </div>
      <div class="extra-room-grid" data-booking-room-editor-list></div>
    `;

    const list = requestBookingRooms.querySelector("[data-booking-room-editor-list]");
    if (!list) return;

    rows.forEach((roomEdit) => {
      const item = group.find((row) => String(row.id) === String(roomEdit.bookingId)) || null;
      const roomDef = getRoomDef(roomEdit.roomType) || getRoomDef(normalizeRoomGroup(item?.roomType));
      const paxOptions = Array.from({ length: roomDef?.maxPax || 6 }, (_, index) => {
        const pax = index + 1;
        return `<option value="${pax}" ${pax === roomEdit.guests ? "selected" : ""}>${pax} Pax</option>`;
      }).join("");

      const option = document.createElement("div");
      option.className = "extra-room-option booking-room-edit-option";
      option.innerHTML = `
        <div class="extra-room-option-head booking-room-edit-head">
          <div>
            <strong>${roomEdit.isNew ? "New Room" : getRoomLabel(roomEdit.roomType, roomEdit.roomNumber)}</strong>
            <span>${roomEdit.isNew
              ? "This room will be added to the same booking when you save."
              : `${item?.roomTypeLabel || getRoomTypeDisplay(item?.roomType)} · Current: ${item?.guests || roomEdit.guests} guests`}</span>
          </div>
          ${roomEdit.isNew ? `<button class="ghost-btn small-btn" type="button" data-remove-booking-room="${escapeHtml(roomEdit.key)}">Remove</button>` : ""}
        </div>
        <div class="field grid-2 compact-grid">
          <div>
            <label>Room Group</label>
            <select data-booking-room-type>
              ${ROOM_DEFS.map((def) => `<option value="${def.type}" ${def.type === roomEdit.roomType ? "selected" : ""}>${def.label}</option>`).join("")}
            </select>
          </div>
          <div>
            <label>Room Number</label>
            <select data-booking-room-number></select>
          </div>
        </div>
        <div class="field compact-field">
          <label>Pax Count</label>
          <select data-booking-room-guests>${paxOptions}</select>
        </div>
      <div class="field compact-field${["normal", "kitchen"].includes(roomEdit.roomType) ? "" : " hidden"}" data-booking-room-climate-field>
          <label>Room Mode</label>
          <div class="planner-climate-toggle booking-room-climate-toggle">
            ${ROOM_CLIMATE_OPTIONS.map((optionDef) => `
              <button
                class="planner-climate-btn${normalizeAcEnabled(roomEdit.roomType, roomEdit.acEnabled) === optionDef.acEnabled ? " active" : ""}"
                type="button"
                data-booking-room-ac
                data-ac-enabled="${optionDef.acEnabled ? "true" : "false"}"
              >${optionDef.label}</button>
            `).join("")}
          </div>
        </div>
        <div class="booking-room-service-editor">
          <span class="booking-room-row-label">Services</span>
          <div class="service-chip-list service-chip-list-editable">
            ${getServiceOptionNames(roomEdit.services).map((service) => `
              <button
                class="service-chip service-chip-toggle ${roomEdit.services.includes(service) ? "service-chip-active" : "service-chip-inactive"}"
                type="button"
                data-booking-room-service
                data-service-name="${service}"
                aria-pressed="${roomEdit.services.includes(service) ? "true" : "false"}"
              >
                <span class="service-chip-icon">${serviceIconLabel(service)}</span>
                <span>${service}</span>
              </button>
            `).join("")}
          </div>
        </div>
      `;

      const roomTypeSelect = option.querySelector("[data-booking-room-type]");
      const roomNumberSelect = option.querySelector("[data-booking-room-number]");
      const paxSelect = option.querySelector("[data-booking-room-guests]");
      const climateField = option.querySelector("[data-booking-room-climate-field]");
      const acButtons = option.querySelectorAll("[data-booking-room-ac]");
      const titleNode = option.querySelector("strong");
      const subtitleNode = option.querySelector(".extra-room-option-head span");

      const syncRoomNumbers = () => {
        if (!roomTypeSelect || !roomNumberSelect || !paxSelect) return;
        const selectedType = roomTypeSelect.value;
        const currentEdit = state.modalBookingRoomEdits.get(roomEdit.key) || roomEdit;
        const def = getRoomDef(selectedType);
        const selectedRoomNumber = Number(currentEdit?.roomNumber || 1);
        setHTML(roomNumberSelect, getRoomNumbersForType(selectedType, { selectedNumber: selectedRoomNumber }).map((number) => {
          const selected = number === selectedRoomNumber ? "selected" : "";
          return `<option value="${number}" ${selected}>Room ${number}</option>`;
        }).join(""));
        setHTML(paxSelect, Array.from({ length: def?.maxPax || 6 }, (_, index) => {
          const pax = index + 1;
          const selected = pax === Number(currentEdit?.guests || 1) ? "selected" : "";
          return `<option value="${pax}" ${selected}>${pax} Pax</option>`;
        }).join(""));
        toggleHidden(climateField, !["normal", "kitchen"].includes(selectedType));
        const currentAcEnabled = normalizeAcEnabled(selectedType, currentEdit?.acEnabled);
        acButtons.forEach((button) => {
          button.classList.toggle("active", normalizeAcEnabled(selectedType, button.dataset.acEnabled) === currentAcEnabled);
        });
        if (titleNode) {
          titleNode.textContent = currentEdit?.isNew ? `New Room · ${getRoomLabel(selectedType, selectedRoomNumber)}` : getRoomLabel(selectedType, selectedRoomNumber);
        }
        if (subtitleNode) {
          subtitleNode.textContent = currentEdit?.isNew
            ? "This room will be added to the same booking when you save."
            : `${getRoomTypeLabelForGuests(selectedType, currentEdit?.guests || 1, currentAcEnabled)} · Current: ${item?.guests || currentEdit?.guests || 1} guests`;
        }
      };

      syncRoomNumbers();

      roomTypeSelect?.addEventListener("change", () => {
        const current = state.modalBookingRoomEdits.get(roomEdit.key);
        const def = getRoomDef(roomTypeSelect.value);
        const nextRoomNumbers = getRoomNumbersForType(roomTypeSelect.value, { selectedNumber: 1 });
        state.modalBookingRoomEdits.set(roomEdit.key, {
          ...current,
          roomType: roomTypeSelect.value,
          roomNumber: nextRoomNumbers[0] || 1,
          guests: Math.min(Number(current?.guests || 1), def?.maxPax || 1),
          acEnabled: normalizeAcEnabled(roomTypeSelect.value, current?.acEnabled),
        });
        syncRoomNumbers();
        renderRequestOfferPreview();
      });

      roomNumberSelect?.addEventListener("change", () => {
        const current = state.modalBookingRoomEdits.get(roomEdit.key);
        state.modalBookingRoomEdits.set(roomEdit.key, {
          ...current,
          roomNumber: Number(roomNumberSelect.value),
        });
        syncRoomNumbers();
      });

      paxSelect?.addEventListener("change", () => {
        const current = state.modalBookingRoomEdits.get(roomEdit.key);
        state.modalBookingRoomEdits.set(roomEdit.key, {
          ...current,
          guests: Number(paxSelect.value),
        });
        syncRoomNumbers();
        renderRequestOfferPreview();
      });

      acButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const current = state.modalBookingRoomEdits.get(roomEdit.key);
          const nextAcEnabled = normalizeAcEnabled(current?.roomType, button.dataset.acEnabled);
          state.modalBookingRoomEdits.set(roomEdit.key, {
            ...current,
            acEnabled: nextAcEnabled,
          });
          acButtons.forEach((itemButton) => {
            itemButton.classList.toggle("active", itemButton === button);
          });
          syncRoomNumbers();
          renderRequestOfferPreview();
        });
      });

      option.querySelectorAll("[data-booking-room-service]").forEach((button) => {
        button.addEventListener("click", () => {
          const current = state.modalBookingRoomEdits.get(roomEdit.key);
          const nextServices = new Set(current?.services || []);
          const serviceName = button.dataset.serviceName;
          if (nextServices.has(serviceName)) nextServices.delete(serviceName);
          else nextServices.add(serviceName);
          state.modalBookingRoomEdits.set(roomEdit.key, {
            ...current,
            services: Array.from(nextServices),
          });
          button.classList.toggle("service-chip-active", nextServices.has(serviceName));
          button.classList.toggle("service-chip-inactive", !nextServices.has(serviceName));
          button.setAttribute("aria-pressed", nextServices.has(serviceName) ? "true" : "false");
        });
      });

      option.querySelector("[data-remove-booking-room]")?.addEventListener("click", () => {
        state.modalBookingRoomEdits.delete(roomEdit.key);
        renderEditors();
        renderRequestOfferPreview();
      });

      list.appendChild(option);
    });

    requestBookingRooms.querySelector("[data-add-booking-room]")?.addEventListener("click", () => {
      const nextRoom = createNewBookingRoomEditEntry(Date.now() + state.modalBookingRoomEdits.size);
      state.modalBookingRoomEdits.set(nextRoom.key, nextRoom);
      renderEditors();
      renderRequestOfferPreview();
    });
  };

  group.forEach((item) => {
    const roomEdit = buildBookingRoomEditOptions(item);
    state.modalBookingRoomEdits.set(roomEdit.key, roomEdit);
  });

  renderEditors();
}

async function ensureBookingAvailabilityForUpdate(bookingId, values, excludedBookingIds = []) {
  if (String(values.status || "").toLowerCase() === "cancelled") return;
  const roomGroup = normalizeRoomGroup(values.roomType);
  const roomBookings = await fetchRangeBookings(roomGroup, values.checkIn, values.checkOut);
  const excluded = new Set([bookingId, ...excludedBookingIds].filter(Boolean).map(String));
  const hasConflict = roomBookings.some((booking) => {
    if (!isBlockingBooking(booking)) return false;
    if (excluded.has(String(booking.id))) return false;
    return Number(booking.roomNumber) === Number(values.roomNumber);
  });
  if (hasConflict) {
    throw new Error(`${getRoomLabel(roomGroup, Number(values.roomNumber))} is already booked for the selected dates.`);
  }
}

async function ensureRequestedBookingRoomsAvailability(roomEdits, excludedBookingIds, checkIn, checkOut, status) {
  if (String(status || "").toLowerCase() === "cancelled") return;
  const seen = new Set();

  for (const roomEdit of roomEdits) {
    const roomType = normalizeRoomGroup(roomEdit.roomType);
    const roomNumber = Number(roomEdit.roomNumber);
    const roomKey = `${roomType}-${roomNumber}`;
    if (seen.has(roomKey)) {
      throw new Error(`${getRoomLabel(roomType, roomNumber)} is selected more than once.`);
    }
    seen.add(roomKey);
    await ensureBookingAvailabilityForUpdate(
      roomEdit.bookingId || "",
      {
        checkIn,
        checkOut,
        roomType,
        roomNumber,
        status,
      },
      excludedBookingIds,
    );
  }
}

async function applyGroupedBookingEdits(targetBookings, roomEdits, commonValues) {
  const editsByBookingId = new Map(
    roomEdits
      .filter((item) => item.bookingId)
      .map((item) => [String(item.bookingId), item])
  );
  const newRoomEdits = roomEdits.filter((item) => !item.bookingId || !targetBookings.some((booking) => String(booking.id) === String(item.bookingId)));
  const excludedBookingIds = targetBookings.map((booking) => booking.id);
  const sharedTrackCode = await resolveBookingTrackCode(
    targetBookings,
    commonValues.status,
    targetBookings[0]?.trackCode || "",
  );
  const totalRoomsNeeded = targetBookings.length + newRoomEdits.length;

  await ensureRequestedBookingRoomsAvailability(
    roomEdits,
    excludedBookingIds,
    commonValues.checkIn,
    commonValues.checkOut,
    commonValues.status,
  );

  for (const bookingRow of targetBookings) {
    const roomEdit = editsByBookingId.get(String(bookingRow.id)) || buildBookingRoomEditOptions(bookingRow);
    await updateBooking(bookingRow.id, {
      guestName: commonValues.guestName,
      phone: commonValues.phone,
      checkIn: commonValues.checkIn,
      checkOut: commonValues.checkOut,
      roomType: roomEdit.roomType,
      roomTypeLabel: getRoomTypeLabelForGuests(roomEdit.roomType, roomEdit.guests, roomEdit.acEnabled),
      roomNumber: roomEdit.roomNumber,
      guests: roomEdit.guests,
      acEnabled: normalizeAcEnabled(roomEdit.roomType, roomEdit.acEnabled),
      notes: mergeNotesAndServices(commonValues.notes, roomEdit.services || []),
      status: commonValues.status,
      trackCode: sharedTrackCode,
      roomsNeeded: totalRoomsNeeded,
      offerPercentage: commonValues.offerPercentage,
      advancePaid: commonValues.advancePaid,
      advanceAmount: commonValues.advanceAmount,
      customPayments: commonValues.customPayments,
    });
  }

  for (const roomEdit of newRoomEdits) {
    await insertBooking({
      trackCode: sharedTrackCode,
      guestName: commonValues.guestName,
      phone: commonValues.phone,
      createdByName: targetBookings[0]?.createdByName || state.currentProfile?.full_name || state.currentProfile?.username || "",
      checkIn: commonValues.checkIn,
      checkOut: commonValues.checkOut,
      guests: String(roomEdit.guests),
      roomType: roomEdit.roomType,
      roomTypeLabel: getRoomTypeLabelForGuests(roomEdit.roomType, roomEdit.guests, roomEdit.acEnabled),
      roomNumber: roomEdit.roomNumber,
      acEnabled: normalizeAcEnabled(roomEdit.roomType, roomEdit.acEnabled),
      roomsNeeded: totalRoomsNeeded,
      notes: mergeNotesAndServices(commonValues.notes, roomEdit.services || []),
      status: commonValues.status,
      offerPercentage: commonValues.offerPercentage,
      advancePaid: commonValues.advancePaid,
      advanceAmount: commonValues.advanceAmount,
      customPayments: commonValues.customPayments,
    });
  }
}

async function ensureGroupAvailabilityForUpdate(bookings, checkIn, checkOut, status) {
  if (String(status || "").toLowerCase() === "cancelled") return;
  const bookingIds = new Set(bookings.map((booking) => booking.id));
  for (const booking of bookings) {
    const roomGroup = normalizeRoomGroup(booking.roomType);
    const roomBookings = await fetchRangeBookings(roomGroup, checkIn, checkOut);
    const hasConflict = roomBookings.some((item) => {
      if (!isBlockingBooking(item)) return false;
      if (bookingIds.has(item.id)) return false;
      return Number(item.roomNumber) === Number(booking.roomNumber);
    });
    if (hasConflict) {
      throw new Error(`${getRoomLabel(roomGroup, Number(booking.roomNumber))} is already booked for the selected dates.`);
    }
  }
}

function getRoomPlan(type, number, defaultNights) {
  const key = getRoomKey(type, number);
  if (!state.roomPlans.has(key)) {
    state.roomPlans.set(key, {
      type,
      number,
      pax: 0,
      nights: defaultNights,
      extraPax: 0,
      acEnabled: normalizeAcEnabled(type, true),
    });
  }
  const plan = state.roomPlans.get(key);
  plan.type = type;
  plan.number = number;
  if (plan.nights < 1) plan.nights = defaultNights;
  if (typeof plan.extraPax !== "number") plan.extraPax = 0;
  if (typeof plan.acEnabled === "undefined") plan.acEnabled = normalizeAcEnabled(type, true);
  plan.acEnabled = normalizeAcEnabled(type, plan.acEnabled);
  return plan;
}

function getAssignedRoomLabel(room, pax, extraPax = 0, acEnabled = true) {
  const totalPax = Number(pax || 0) + Number(extraPax || 0);
  const climateLabel = getRoomClimateLabel(room.type, acEnabled);
  return climateLabel
    ? `${room.label} - ${totalPax} Pax - ${climateLabel}`
    : `${room.label} - ${totalPax} Pax`;
}

function normalizeRoomGroup(type) {
  if (!type) return "";
  const value = String(type);
  if (value.startsWith("normal")) return "normal";
  if (value.startsWith("kitchen")) return "kitchen";
  if (value === "4-pax") return "normal";
  if (value === "6-pax") return "kitchen";
  return value;
}

function getRoomTypeDisplay(type) {
  switch (type) {
    case "normal-1":
      return "Normal Room - 1 Pax";
    case "normal-2":
      return "Normal Room - 2 Pax";
    case "normal-3":
      return "Normal Room - 3 Pax";
    case "normal-4":
      return "Normal Room - 4 Pax";
    case "kitchen-6":
      return "Kitchen Room - 6 Pax";
    case "driver-1":
      return "Driver Room - 1 Pax";
    case "driver-2":
      return "Driver Room - 2 Pax";
    case "driver-3":
      return "Driver Room - 3 Pax";
    case "driver-4":
      return "Driver Room - 4 Pax";
    case "normal":
      return "Normal Room";
    case "kitchen":
      return "Kitchen Room";
    case "driver":
      return "Driver Room";
    case "4-pax":
      return "Normal Room - 4 Pax";
    case "6-pax":
      return "Kitchen Room - 6 Pax";
    default:
      return String(type || "");
  }
}

function isBlockingBooking(booking) {
  const status = String(booking.status || "").toLowerCase();
  const lifecycle = getBookingLifecycleStatus(booking);
  return status !== "cancelled" && lifecycle !== "hold" && lifecycle !== "checked_out";
}

function isVisibleBooking(booking) {
  const status = String(booking?.status || "").toLowerCase();
  const lifecycle = getBookingLifecycleStatus(booking);
  return status !== "cancelled" && lifecycle !== "hold";
}

function mapBooking(row) {
  return {
    id: row.id,
    trackCode: row.track_code || "",
    guestName: row.guest_name,
    phone: row.phone,
    createdByName: row.created_by_name || '',
    checkIn: row.check_in,
    checkOut: row.check_out,
    guests: Number(row.guests || 0),
    roomType: row.room_type,
    roomTypeLabel: row.room_type_label,
    roomNumber: Number(row.room_number),
    acEnabled: normalizeAcEnabled(row.room_type, row.ac_enabled),
    roomsNeeded: Number(row.rooms_needed || 1),
    notes: row.notes || "",
    status: row.booking_status || "",
    pricingPax: Number(row.pricing_pax || 0),
    weekendRate: Number(row.weekend_rate || 0),
    weekdayRate: Number(row.weekday_rate || 0),
    weekendNights: Number(row.weekend_nights || 0),
    weekdayNights: Number(row.weekday_nights || 0),
    baseRoomTotal: Number(row.base_room_total || row.room_total || 0),
    offerPercentage: Number(row.offer_percentage || 0),
    advancePaid: Boolean(row.advance_paid),
    advanceAmount: Number(row.advance_amount || 0),
    customPayments: normalizeCustomPayments(row.custom_payments),
    roomTotal: Number(row.room_total || 0),
    lifecycleStatus: row.lifecycle_status || "booked",
    checkedInAt: normalizeTimestampValue(row.checked_in_at),
    checkedOutAt: normalizeTimestampValue(row.checked_out_at),
    closeDetails: row.close_details || {},
    createdAt: row.created_at,
  };
}

function shouldRetryWithoutPricingColumns(message) {
  const text = String(message || "").toLowerCase();
  return text.includes("pricing_pax")
    || text.includes("weekend_rate")
    || text.includes("weekday_rate")
    || text.includes("weekend_nights")
    || text.includes("weekday_nights")
    || text.includes("room_total")
    || text.includes("base_room_total")
    || text.includes("offer_percentage")
    || text.includes("advance_paid")
    || text.includes("advance_amount")
    || text.includes("custom_payments")
    || text.includes("ac_enabled")
    || text.includes("lifecycle_status")
    || text.includes("checked_in_at")
    || text.includes("checked_out_at")
    || text.includes("close_details");
}

function shouldRetryWithoutRequestPricingColumns(message) {
  const text = String(message || "").toLowerCase();
  return text.includes("requested_weekend_rate")
    || text.includes("requested_weekday_rate")
    || text.includes("requested_offer_percentage");
}

function applyPricingToBookingRow(row, values) {
  const pricing = computeBookingPrice({
    checkIn: values.checkIn,
    checkOut: values.checkOut,
    roomType: normalizeRoomGroup(values.roomType),
    guests: Number(values.guests || 0),
    acEnabled: normalizeAcEnabled(values.roomType, values.acEnabled),
    weekendRateOverride: "weekendRate" in values ? values.weekendRate : null,
    weekdayRateOverride: "weekdayRate" in values ? values.weekdayRate : null,
  });

  row.ac_enabled = normalizeAcEnabled(values.roomType, values.acEnabled);
  row.pricing_pax = pricing.pricingPax;
  row.weekend_rate = pricing.weekendRate;
  row.weekday_rate = pricing.weekdayRate;
  row.weekend_nights = pricing.weekendNights;
  row.weekday_nights = pricing.weekdayNights;
  row.base_room_total = pricing.roomTotal;
  row.offer_percentage = Number(values.offerPercentage || 0);
  const customPayments = normalizeCustomPayments(values.customPayments);
  row.advance_paid = Boolean(values.advancePaid);
  row.advance_amount = roundCurrency(Number(values.advanceAmount || 0));
  row.custom_payments = customPayments;
  row.room_total = applyOfferPercentage(pricing.roomTotal, row.offer_percentage);
  row.lifecycle_status = values.lifecycleStatus || row.lifecycle_status || "booked";
  row.checked_in_at = normalizeTimestampValue(values.checkedInAt ?? row.checked_in_at ?? null);
  row.checked_out_at = normalizeTimestampValue(values.checkedOutAt ?? row.checked_out_at ?? null);
  row.close_details = values.closeDetails ?? row.close_details ?? {};
}

function stripPricingColumns(row) {
  delete row.ac_enabled;
  delete row.pricing_pax;
  delete row.weekend_rate;
  delete row.weekday_rate;
  delete row.weekend_nights;
  delete row.weekday_nights;
  delete row.base_room_total;
  delete row.offer_percentage;
  delete row.advance_paid;
  delete row.advance_amount;
  delete row.custom_payments;
  delete row.room_total;
  delete row.lifecycle_status;
  delete row.checked_in_at;
  delete row.checked_out_at;
  delete row.close_details;
}

function ensureSupabase() {
  if (!state.supabase) {
    throw new Error("Set Supabase URL and anon key in app.js first.");
  }
}

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, "");
}

function usernameToEmail(username) {
  const normalized = normalizeUsername(username);
  if (!normalized) return "";
  return normalized.includes("@") ? normalized : `${normalized}@hotel.local`;
}

function showAuthMessage(message, isError = false) {
  authMessage.textContent = message;
  authMessage.classList.toggle("error", isError);
}

function setAuthTab(mode) {
  const loginActive = mode === "login";
  authTabLogin.classList.toggle("auth-tab-active", loginActive);
  authTabSignup.classList.toggle("auth-tab-active", !loginActive);
  loginForm.classList.toggle("auth-form-active", loginActive);
  signupForm.classList.toggle("auth-form-active", !loginActive);
  showAuthMessage("");
}

function renderShell(mode) {
  authShell.classList.toggle("hidden", mode !== "auth");
  pendingShell.classList.toggle("hidden", mode !== "pending");
  appShell.classList.toggle("hidden", mode !== "app");
}

function canManageAccounts() {
  return profileHasPermission(state.currentProfile, "manage_accounts");
}

function canManageRequests() {
  return profileHasPermission(state.currentProfile, "manage_requests");
}

function isOwnerOrAdminRole(profile = state.currentProfile) {
  const effectiveProfile = getEffectiveProfile(profile);
  return effectiveProfile?.approved && ["owner", "admin"].includes(effectiveProfile.role);
}

function canAccessNotifications() {
  const effectiveProfile = getEffectiveProfile();
  if (!effectiveProfile?.approved) return false;
  return normalizeNotificationRoleList(state.runtimeSettings?.notificationRoles).includes(effectiveProfile.role);
}

function canAccessSystemUpdates() {
  return false;
}

function canAccessDeductions() {
  return isOwnerOrAdminRole();
}

function updateNotificationBadge() {
  if (!notificationBellBtn || !notificationBellBadge) return;
  const canOpenNotifications = canAccessNotifications();
  notificationBellBtn.classList.toggle("hidden", !canOpenNotifications);
  if (!canOpenNotifications) {
    notificationBellBadge.classList.add("hidden");
    notificationBellBadge.textContent = "0";
    return;
  }
  const unreadCount = Number(state.notificationUnreadCount || 0);
  notificationBellBadge.textContent = unreadCount > 99 ? "99+" : String(unreadCount);
  notificationBellBadge.classList.toggle("hidden", unreadCount <= 0);
}

function updateHeaderProfile() {
  if (!state.currentProfile) {
    userChip.textContent = "";
    toggleHidden(previewBanner, true);
    updateNotificationBadge();
    return;
  }
  const effectiveProfile = getEffectiveProfile();
  userChip.textContent = `${state.currentProfile.full_name || state.currentProfile.username} · ${effectiveProfile.role}`;
  const previewActive = Boolean(state.uiPreviewRole && state.currentProfile.role === "owner");
  toggleHidden(previewBanner, !previewActive);
  if (previewActive) {
    previewBannerText.textContent = `Preview: ${state.uiPreviewRole}`;
  }
  updateNotificationBadge();
}

function updateNavVisibility() {
  const previewOwnerOverride = state.currentProfile?.role === "owner" && Boolean(state.uiPreviewRole);
  const showPlanner = Boolean(state.currentProfile?.approved);
  const showAnalytics = Boolean(state.currentProfile?.approved);
  const showDeductions = canAccessDeductions() || previewOwnerOverride;
  const showGuide = Boolean(state.currentProfile?.approved);
  const showHold = Boolean(state.currentProfile?.approved);
  const showAccounts = canManageAccounts();
  const showRequests = Boolean(state.currentProfile?.approved);
  const showNotifications = canAccessNotifications();
  const showSystemUpdates = canAccessSystemUpdates();
  const showPricing = canManagePricing() || previewOwnerOverride;
  navButtons.planner?.classList.toggle("hidden", !showPlanner);
  navButtons.analytics?.classList.toggle("hidden", !showAnalytics);
  navButtons.deductions?.classList.toggle("hidden", !showDeductions);
  navButtons.guide?.classList.toggle("hidden", !showGuide);
  navButtons.hold?.classList.toggle("hidden", !showHold);
  navButtons.requests?.classList.toggle("hidden", !showRequests);
  navButtons.notifications?.classList.toggle("hidden", !showNotifications);
  navButtons.systemUpdates?.classList.toggle("hidden", !showSystemUpdates);
  navButtons.accounts?.classList.toggle("hidden", !showAccounts);
  navButtons.pricing?.classList.toggle("hidden", !showPricing);
  analyticsDeductionsToggleRow?.classList.toggle("hidden", !showDeductions);
  const visibleTabs = 2 + Number(showPlanner) + Number(showAnalytics) + Number(showDeductions) + Number(showGuide) + Number(showHold) + Number(showRequests) + Number(showNotifications) + Number(showSystemUpdates) + Number(showAccounts) + Number(showPricing);
  syncBottomNavLayout(visibleTabs);
  if (!showPlanner && screens.planner?.classList.contains("screen-active")) {
    setScreen("booking");
  }
  if (!showAnalytics && screens.analytics?.classList.contains("screen-active")) {
    setScreen("booking");
  }
  if (!showDeductions && screens.deductions?.classList.contains("screen-active")) {
    setScreen("booking");
  }
  if (!showGuide && screens.guide?.classList.contains("screen-active")) {
    setScreen("booking");
  }
  if (!showHold && screens.hold?.classList.contains("screen-active")) {
    setScreen("booking");
  }
  if (!showRequests && screens.requests?.classList.contains("screen-active")) {
    setScreen("booking");
  }
  if (!showNotifications && screens.notifications?.classList.contains("screen-active")) {
    setScreen("booking");
  }
  if (!showSystemUpdates && screens.systemUpdates?.classList.contains("screen-active")) {
    setScreen("booking");
  }
  if (!showAccounts && screens.accounts?.classList.contains("screen-active")) {
    setScreen("booking");
  }
  if (!showPricing && screens.pricing?.classList.contains("screen-active")) {
    setScreen("booking");
  }
}

function setScreen(target) {
  Object.values(screens).forEach((screen) => screen?.classList.remove("screen-active"));
  Object.values(navButtons).forEach((btn) => btn?.classList.remove("nav-active"));

  if (!screens[target] || !navButtons[target]) return;
  screens[target]?.classList.add("screen-active");
  navButtons[target]?.classList.add("nav-active");
  if (target === "planner") {
    loadReservationPlanner();
  }
  if (target === "analytics") {
    loadAnalytics();
  }
  if (target === "deductions") {
    loadDeductions();
  }
  if (target === "guide") {
    loadGuideBook();
  }
  if (target === "hold") {
    loadHoldBookings();
  }
  if (target === "notifications") {
    loadNotifications({ markVisibleRead: true });
  }
  if (target === "systemUpdates") {
    loadSystemUpdates();
  }
}

function getServiceCatalogChangeSummary(beforeRows = [], afterRows = []) {
  const beforeNames = beforeRows.map((row) => String(row.name || "").trim()).filter(Boolean);
  const afterNames = afterRows.map((row) => String(row.name || "").trim()).filter(Boolean);
  const added = afterNames.filter((name) => !beforeNames.includes(name));
  const removed = beforeNames.filter((name) => !afterNames.includes(name));
  const changed = [];
  afterRows.forEach((row) => {
    const before = beforeRows.find((item) => item.id && row.id && item.id === row.id);
    if (!before) return;
    if (
      String(before.name || "") !== String(row.name || "")
      || Number(before.defaultPrice || 0) !== Number(row.defaultPrice || 0)
      || Boolean(before.isActive) !== Boolean(row.isActive)
    ) {
      changed.push(row.name || before.name || "Service");
    }
  });
  return { added, removed, changed };
}

function getAnalyticsReservationGroups(bookings = []) {
  return groupBookingsForDisplay((bookings || []).filter((booking) => isVisibleBooking(booking)));
}

function getAnalyticsAllReservationGroups(bookings = []) {
  return groupBookingsForDisplay(
    (bookings || []).filter((booking) => String(booking?.status || "").toLowerCase() !== "cancelled"),
  );
}

function getAnalyticsRoomNights(group) {
  return (group?.bookings || []).reduce((sum, booking) => {
    const nights = Math.max(1, getNightCount(booking.checkIn, booking.checkOut));
    return sum + nights;
  }, 0);
}

function renderAnalyticsBarList(node, items = [], formatter = (value) => String(value)) {
  if (!node) return;
  if (!items.length) {
    node.innerHTML = '<p class="inline-note">No data for this range.</p>';
    return;
  }
  const maxValue = Math.max(...items.map((item) => Number(item.value || 0)), 1);
  node.innerHTML = items.map((item) => `
    <div class="analytics-bar-item">
      <div class="analytics-bar-head">
        <strong>${escapeHtml(item.label)}</strong>
        <span>${escapeHtml(formatter(item.value))}</span>
      </div>
      <div class="analytics-bar-track">
        <div class="analytics-bar-fill" style="width:${Math.max(8, Math.round((Number(item.value || 0) / maxValue) * 100))}%"></div>
      </div>
      ${item.meta ? `<small>${escapeHtml(item.meta)}</small>` : ""}
    </div>
  `).join("");
}

function renderAnalyticsTableList(node, items = [], valueFormatter = (value) => String(value), emptyText = "No data for this range.") {
  if (!node) return;
  if (!items.length) {
    node.innerHTML = `<p class="inline-note">${emptyText}</p>`;
    return;
  }
  node.innerHTML = items.map((item) => `
    <div class="analytics-table-item">
      <div>
        <strong>${escapeHtml(item.label)}</strong>
        ${item.meta ? `<small>${escapeHtml(item.meta)}</small>` : ""}
      </div>
      <span>${escapeHtml(valueFormatter(item.value))}</span>
    </div>
  `).join("");
}

function populateAnalyticsFilterSelect(select, values = [], allLabel = "All") {
  if (!select) return;
  const selected = select.value || "all";
  const options = ["all", ...values.filter(Boolean)];
  select.innerHTML = options.map((value) => `
    <option value="${escapeHtml(value)}">${escapeHtml(value === "all" ? allLabel : value)}</option>
  `).join("");
  select.value = options.includes(selected) ? selected : "all";
}

function renderAnalyticsTrendChart(node, points = [], formatter = (value) => String(value)) {
  if (!node) return;
  if (!points.length) {
    node.innerHTML = '<p class="inline-note">No trend data for this filter.</p>';
    return;
  }
  const maxValue = Math.max(...points.map((item) => Number(item.value || 0)), 1);
  node.innerHTML = `
    <div class="analytics-trend-bars">
      ${points.map((item) => `
        <div class="analytics-trend-bar-card">
          <span class="analytics-trend-value">${escapeHtml(formatter(item.value))}</span>
          <div class="analytics-trend-bar-track">
            <div class="analytics-trend-bar-fill" style="height:${Math.max(10, Math.round((Number(item.value || 0) / maxValue) * 100))}%"></div>
          </div>
          <strong>${escapeHtml(item.label)}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderAnalyticsInsights(node, items = []) {
  if (!node) return;
  if (!items.length) {
    node.innerHTML = '<p class="inline-note">No insights available for this filter.</p>';
    return;
  }
  node.innerHTML = items.map((item) => `
    <div class="analytics-insight-card">
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
      ${item.meta ? `<small>${escapeHtml(item.meta)}</small>` : ""}
    </div>
  `).join("");
}

function buildAnalyticsTrendPoints(groups = [], from, to, metric = "revenue") {
  const start = parseDate(from);
  const end = parseDate(to);
  if (!start || !end || end < start) return [];
  const dayCount = Math.max(1, getNightCount(from, formatDateKey(addDays(end, 1))));
  const useMonthly = dayCount > 90;
  const useWeekly = !useMonthly && dayCount > 21;
  const buckets = new Map();

  groups.forEach((group) => {
    const keyDate = parseDate(group.checkIn || from);
    if (!keyDate) return;
    let bucketKey = "";
    let bucketLabel = "";
    if (useMonthly) {
      bucketKey = `${keyDate.getFullYear()}-${keyDate.getMonth() + 1}`;
      bucketLabel = keyDate.toLocaleString("en-GB", { month: "short", year: "2-digit" });
    } else if (useWeekly) {
      const weekStart = addDays(keyDate, -(keyDate.getDay() || 7) + 1);
      bucketKey = formatDateKey(weekStart);
      bucketLabel = weekStart.toLocaleString("en-GB", { day: "2-digit", month: "short" });
    } else {
      bucketKey = formatDateKey(keyDate);
      bucketLabel = keyDate.toLocaleString("en-GB", { day: "2-digit", month: "short" });
    }
    const current = buckets.get(bucketKey) || { label: bucketLabel, value: 0 };
    if (metric === "bookings") current.value += 1;
    else if (metric === "room_nights") current.value += getAnalyticsRoomNights(group);
    else current.value = roundCurrency(current.value + Number(group.totalPrice || 0));
    buckets.set(bucketKey, current);
  });

  return Array.from(buckets.entries())
    .sort((a, b) => String(a[0]).localeCompare(String(b[0])))
    .map(([, value]) => value)
    .slice(-10);
}

function normalizeDeductionRow(row = {}) {
  const monthValue = normalizeMonthInputValue(
    row.monthValue
    || (String(row.deduction_month || "").trim().slice(0, 7))
    || "",
  );
  return {
    id: row.id || "",
    monthValue,
    monthLabel: formatMonthValueLabel(monthValue),
    category: String(row.category || "Other").trim() || "Other",
    title: String(row.title || "Deduction").trim() || "Deduction",
    details: String(row.details || "").trim(),
    amount: roundCurrency(Number(row.amount || 0)),
    createdByName: String(row.created_by_name || row.createdByName || "").trim(),
    createdAt: row.created_at || row.createdAt || "",
  };
}

const DEDUCTION_CATEGORY_OPTIONS = [
  "Salary",
  "Campaign Payment",
  "Utilities",
  "Supplies",
  "Transport",
  "Other",
];

function getDeductionCategoryOptionsMarkup(selectedValue = "Other") {
  return DEDUCTION_CATEGORY_OPTIONS.map((option) => `
    <option value="${escapeHtml(option)}" ${option === selectedValue ? "selected" : ""}>${escapeHtml(option)}</option>
  `).join("");
}

function createDeductionDraftRow(monthValue = "") {
  return {
    monthValue: normalizeMonthInputValue(monthValue) || toMonthInputValue(new Date()),
    category: "Salary",
    title: "",
    amount: "",
    details: "",
  };
}

function collectDeductionDraftRows() {
  if (!deductionEntryList) return [];
  return Array.from(deductionEntryList.querySelectorAll("[data-deduction-entry]")).map((row) => ({
    monthValue: normalizeMonthInputValue(row.querySelector("[data-deduction-month]")?.value || ""),
    category: String(row.querySelector("[data-deduction-category]")?.value || "Other").trim() || "Other",
    title: String(row.querySelector("[data-deduction-title]")?.value || "").trim(),
    amount: String(row.querySelector("[data-deduction-amount]")?.value || "").trim(),
    details: String(row.querySelector("[data-deduction-details]")?.value || "").trim(),
  }));
}

function renderDeductionEntryRows(rows = [createDeductionDraftRow(deductionMonthFilterInput?.value || "")]) {
  if (!deductionEntryList) return;
  const safeRows = rows.length ? rows : [createDeductionDraftRow(deductionMonthFilterInput?.value || "")];
  deductionEntryList.innerHTML = safeRows.map((row, index) => `
    <section class="deduction-entry-card" data-deduction-entry="${index}">
      <div class="deduction-entry-head">
        <span class="deduction-entry-index">Deduction ${index + 1}</span>
        ${safeRows.length > 1 ? `<button class="ghost-btn small-btn" type="button" data-remove-deduction-row="${index}">Remove</button>` : ""}
      </div>
      <div class="request-form-grid">
        <label class="field compact-field">
          <span>Deduction Month</span>
          <input type="month" value="${escapeHtml(normalizeMonthInputValue(row.monthValue) || toMonthInputValue(new Date()))}" data-deduction-month required />
        </label>
        <label class="field compact-field">
          <span>Category</span>
          <select data-deduction-category required>
            ${getDeductionCategoryOptionsMarkup(row.category)}
          </select>
        </label>
      </div>
      <div class="request-form-grid">
        <label class="field">
          <span>Title</span>
          <input type="text" value="${escapeHtml(row.title || "")}" placeholder="Example: Staff salary / April campaign payment" data-deduction-title required />
        </label>
        <label class="field compact-field">
          <span>Amount</span>
          <input type="number" min="0" step="0.01" value="${escapeHtml(row.amount || "")}" placeholder="0.00" data-deduction-amount required />
        </label>
      </div>
      <label class="field">
        <span>Details</span>
        <textarea rows="3" placeholder="Add more details for this deduction." data-deduction-details>${escapeHtml(row.details || "")}</textarea>
      </label>
    </section>
  `).join("");
}

async function fetchDeductionsForRange(from, to) {
  if (!canAccessDeductions()) return [];
  const fromDate = parseDate(from);
  const toDate = parseDate(to);
  if (!fromDate || !toDate) return [];
  ensureSupabase();
  const startMonth = formatDateKey(startOfMonth(fromDate));
  const endMonthExclusive = formatDateKey(addMonths(startOfMonth(toDate), 1));
  const { data, error } = await state.supabase
    .from(CONFIG.SUPABASE_DEDUCTIONS_TABLE)
    .select("*")
    .gte("deduction_month", startMonth)
    .lt("deduction_month", endMonthExclusive)
    .order("deduction_month", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message || "Could not load deductions.");
  return (data || []).map(normalizeDeductionRow);
}

async function insertDeduction(payload = {}) {
  if (!canAccessDeductions()) throw new Error("Only owner or admin can save deductions.");
  const monthValue = normalizeMonthInputValue(payload.monthValue);
  if (!monthValue) throw new Error("Select the deduction month.");
  const title = String(payload.title || "").trim();
  if (!title) throw new Error("Enter the deduction title.");
  const amount = roundCurrency(Number(payload.amount || 0));
  if (!(amount > 0)) throw new Error("Enter a deduction amount.");
  ensureSupabase();
  const row = {
    deduction_month: monthValueToDateKey(monthValue),
    category: String(payload.category || "Other").trim() || "Other",
    title,
    details: String(payload.details || "").trim(),
    amount,
    created_by_name: state.currentProfile?.full_name || state.currentProfile?.username || "",
    actor_user_id: state.currentSession?.user?.id || null,
  };
  const { error } = await state.supabase.from(CONFIG.SUPABASE_DEDUCTIONS_TABLE).insert(row);
  if (error) throw new Error(error.message || "Could not save deduction.");
}

async function deleteDeduction(deductionId = "") {
  if (!canAccessDeductions()) throw new Error("Only owner or admin can remove deductions.");
  const normalizedId = String(deductionId || "").trim();
  if (!normalizedId) return false;
  ensureSupabase();
  const confirmed = window.confirm("Remove this deduction item?");
  if (!confirmed) return false;
  const { error } = await state.supabase
    .from(CONFIG.SUPABASE_DEDUCTIONS_TABLE)
    .delete()
    .eq("id", normalizedId);
  if (error) throw new Error(error.message || "Could not remove deduction.");
  return true;
}

function renderDeductions(items = []) {
  if (!deductionList || !deductionEmpty) return;
  if (!canAccessDeductions()) {
    deductionList.innerHTML = "";
    deductionEmpty.style.display = "block";
    deductionEmpty.textContent = "Only owner or admin can view deductions.";
    setText(deductionMonthTotal, "Restricted");
    setText(deductionMonthCount, "0");
    setText(deductionMonthLabel, "-");
    return;
  }
  deductionList.innerHTML = "";
  const firstDraftMonth = collectDeductionDraftRows()[0]?.monthValue || "";
  const monthValue = normalizeMonthInputValue(deductionMonthFilterInput?.value || firstDraftMonth || "");
  setText(deductionMonthLabel, formatMonthValueLabel(monthValue));
  setText(deductionMonthTotal, formatMoney(items.reduce((sum, item) => sum + Number(item.amount || 0), 0)));
  setText(deductionMonthCount, String(items.length));
  if (!items.length) {
    deductionEmpty.style.display = "block";
    deductionEmpty.textContent = "No deductions saved for this month.";
    return;
  }
  deductionEmpty.style.display = "none";
  deductionList.innerHTML = items.map((item) => `
    <article class="request-card deduction-card">
      <div class="request-card-head">
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <div class="muted">${escapeHtml(item.category)} · ${escapeHtml(item.monthLabel)}</div>
        </div>
        <strong>${escapeHtml(formatMoney(item.amount))}</strong>
      </div>
      ${item.details ? `<p class="muted">${escapeHtml(item.details)}</p>` : ""}
      <div class="request-card-head">
        <span class="muted">${escapeHtml(item.createdByName || "-")}</span>
        <button class="ghost-btn small-btn" type="button" data-delete-deduction="${escapeHtml(item.id)}">Remove</button>
      </div>
    </article>
  `).join("");
  deductionList.querySelectorAll("[data-delete-deduction]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        const changed = await deleteDeduction(button.dataset.deleteDeduction);
        if (!changed) return;
        await insertSystemUpdate({
          updateType: "deduction_removed",
          title: "Deduction Removed",
          message: `Removed a deduction from ${formatMonthValueLabel(monthValue)}.`,
          metadata: { deductionId: button.dataset.deleteDeduction, monthValue },
        });
        showToast("Deduction removed.");
        await loadDeductions(monthValue);
        if (screens.analytics?.classList.contains("screen-active")) await loadAnalytics();
      } catch (error) {
        showToast(error.message, true);
      }
    });
  });
}

async function loadDeductions(monthValue = deductionMonthFilterInput?.value || toMonthInputValue(new Date())) {
  const normalizedMonth = normalizeMonthInputValue(monthValue) || toMonthInputValue(new Date());
  if (deductionMonthFilterInput) deductionMonthFilterInput.value = normalizedMonth;
  if (!canAccessDeductions()) {
    renderDeductions([]);
    return;
  }
  try {
    const items = await fetchDeductionsForRange(monthValueToDateKey(normalizedMonth), formatDateKey(endOfMonth(parseDate(monthValueToDateKey(normalizedMonth)))));
    state.deductions = items;
    renderDeductions(items);
  } catch (error) {
    state.deductions = [];
    renderDeductions([]);
    if (deductionEmpty) {
      deductionEmpty.style.display = "block";
      deductionEmpty.textContent = error.message;
    }
  }
}

async function loadAnalytics() {
  if (!state.currentProfile?.approved || !analyticsDateFromInput || !analyticsDateToInput) return;
  const from = analyticsDateFromInput.value;
  const to = analyticsDateToInput.value;
  const includeHoldPayments = Boolean(analyticsIncludeHoldPayments?.checked);
  const includeDeductions = Boolean(analyticsIncludeDeductions?.checked) && canAccessDeductions();

  if (!from || !to) {
    renderAnalyticsResultsContext();
    setText(analyticsHoldPayments, includeHoldPayments ? formatMoney(0) : "Off");
    setText(analyticsTotalDeductions, canAccessDeductions() ? (includeDeductions ? formatMoney(0) : "Off") : "Restricted");
    setText(analyticsNetProfit, canAccessDeductions() ? formatMoney(0) : "Restricted");
    renderAnalyticsTableList(analyticsDeductionsList, [], formatMoney, canAccessDeductions() ? "Turn on Include Deductions to calculate net profit." : "Only owner or admin can view deductions.");
    state.currentAnalyticsSnapshot = null;
    if (analyticsEmpty) {
      analyticsEmpty.textContent = "Select a date range to load analytics.";
      analyticsEmpty.style.display = "block";
    }
    return;
  }

  if (from > to) {
    renderAnalyticsResultsContext();
    setText(analyticsHoldPayments, includeHoldPayments ? formatMoney(0) : "Off");
    setText(analyticsTotalDeductions, canAccessDeductions() ? (includeDeductions ? formatMoney(0) : "Off") : "Restricted");
    setText(analyticsNetProfit, canAccessDeductions() ? formatMoney(0) : "Restricted");
    state.currentAnalyticsSnapshot = null;
    showToast("Analytics end date must be after the start date.", true);
    return;
  }

  try {
    const bookings = await fetchBookingsForPeriod(from, formatDateKey(addDays(parseDate(to), 1)));
    const deductionRows = includeDeductions ? await fetchDeductionsForRange(from, to) : [];
    const groups = getAnalyticsReservationGroups(bookings);
    const allGroups = getAnalyticsAllReservationGroups(bookings);
    const lifecycleOptions = Array.from(new Set(groups.map((group) => getAnalyticsGroupStateLabel(group)))).sort();
    const sourceOptions = Array.from(new Set(groups.map((group) => (
      group.statuses.size === 1 ? getBookingStatusLabel(Array.from(group.statuses)[0]) : "Mixed Booking"
    )))).sort();
    const staffOptions = Array.from(new Set(groups.map((group) => group.bookings[0]?.createdByName || "Unknown"))).sort();
    populateAnalyticsStateChips(lifecycleOptions);
    populateAnalyticsChipFilter(analyticsFilterSourceChips, sourceOptions);
    populateAnalyticsChipFilter(analyticsFilterStaffChips, staffOptions);
    const selectedStates = getSelectedAnalyticsStates();
    const selectedSources = getSelectedAnalyticsChipValues(analyticsFilterSourceChips);
    const selectedStaff = getSelectedAnalyticsChipValues(analyticsFilterStaffChips);
    const matchesSharedAnalyticsFilters = (group) => {
      const sourceLabel = group.statuses.size === 1 ? getBookingStatusLabel(Array.from(group.statuses)[0]) : "Mixed Booking";
      const staffLabel = group.bookings[0]?.createdByName || "Unknown";
      if (selectedSources.length && !selectedSources.includes(sourceLabel)) return false;
      if (selectedStaff.length && !selectedStaff.includes(staffLabel)) return false;
      return true;
    };

    const filteredGroups = groups.filter((group) => {
      const lifecycleLabel = getAnalyticsGroupStateLabel(group);
      if (selectedStates.length && !selectedStates.includes(lifecycleLabel)) return false;
      return matchesSharedAnalyticsFilters(group);
    });
    renderAnalyticsResultsContext({ count: filteredGroups.length });
    const totalRevenue = roundCurrency(filteredGroups.reduce((sum, group) => sum + Number(group.totalPrice || 0), 0));
    const totalBookings = filteredGroups.length;
    const totalPendingBalance = roundCurrency(filteredGroups.reduce((sum, group) => sum + getBookingBalanceAmount(group), 0));
    const totalRoomNights = filteredGroups.reduce((sum, group) => sum + getAnalyticsRoomNights(group), 0);
    const averageBookingValue = totalBookings ? roundCurrency(totalRevenue / totalBookings) : 0;
    const averageStayNights = totalBookings ? roundCurrency(totalRoomNights / totalBookings) : 0;
    const totalHoldPayments = includeHoldPayments
      ? roundCurrency(allGroups.reduce((sum, group) => {
        if (getGroupLifecycleStatus(group) !== "hold") return sum;
        if (!matchesSharedAnalyticsFilters(group)) return sum;
        const advanceAmount = Number(getAdvancePaymentInfo(group.bookings).amount || 0);
        const customAmount = Number(getGroupCustomPriceTotal(group.bookings) || 0);
        return sum + advanceAmount + customAmount;
      }, 0))
      : 0;
    const totalDeductions = includeDeductions
      ? roundCurrency(deductionRows.reduce((sum, item) => sum + Number(item.amount || 0), 0))
      : 0;
    const netProfit = includeDeductions ? roundCurrency(totalRevenue - totalDeductions) : totalRevenue;

    const roomTotals = new Map();
    const roomTypeRevenue = new Map();
    const customerTotals = new Map();
    const staffTotals = new Map();
    const serviceTotals = new Map();
    const statusTotals = new Map();
    const sourceTotals = new Map();
    const titleTotals = new Map();

    filteredGroups.forEach((group) => {
      const lifecycleStatus = getGroupLifecycleStatus(group);
      statusTotals.set(getLifecycleStatusLabel(lifecycleStatus), (statusTotals.get(getLifecycleStatusLabel(lifecycleStatus)) || 0) + 1);
      const sourceLabel = group.statuses.size === 1 ? getBookingStatusLabel(Array.from(group.statuses)[0]) : "Mixed";
      sourceTotals.set(sourceLabel, (sourceTotals.get(sourceLabel) || 0) + 1);
      const title = splitGuestTitleAndName(group.guestName || "").title || "No Title";
      titleTotals.set(title, (titleTotals.get(title) || 0) + 1);

      group.bookings.forEach((booking) => {
        const roomLabel = getRoomLabel(normalizeRoomGroup(booking.roomType), booking.roomNumber);
        roomTotals.set(roomLabel, (roomTotals.get(roomLabel) || 0) + Math.max(1, getNightCount(booking.checkIn, booking.checkOut)));

        const roomTypeLabel = normalizeRoomGroup(booking.roomType) === "kitchen"
          ? "Kitchen Room"
          : normalizeRoomGroup(booking.roomType) === "driver"
            ? "Driver Room"
            : "Normal Room";
        roomTypeRevenue.set(roomTypeLabel, roundCurrency((roomTypeRevenue.get(roomTypeLabel) || 0) + Number(booking.roomTotal || 0)));
      });

      customerTotals.set(group.guestName || "Guest", roundCurrency((customerTotals.get(group.guestName || "Guest") || 0) + Number(group.totalPrice || 0)));
      const bookedBy = group.bookings[0]?.createdByName || "Unknown";
      staffTotals.set(bookedBy, roundCurrency((staffTotals.get(bookedBy) || 0) + Number(group.totalPrice || 0)));

      getServicePricingRows(group.bookings).forEach((row) => {
        serviceTotals.set(row.service, roundCurrency((serviceTotals.get(row.service) || 0) + Number(row.amount || 0)));
      });
    });

    setText(analyticsTotalEarn, formatMoney(totalRevenue));
    setText(analyticsTotalBookings, String(totalBookings));
    setText(analyticsAverageBooking, formatMoney(averageBookingValue));
    setText(analyticsPendingBalance, formatMoney(totalPendingBalance));
    setText(analyticsRoomNights, String(totalRoomNights));
    setText(analyticsAverageStay, `${averageStayNights.toFixed(1)} nights`);
    setText(analyticsHoldPayments, includeHoldPayments ? formatMoney(totalHoldPayments) : "Off");
    setText(analyticsTotalDeductions, canAccessDeductions() ? (includeDeductions ? formatMoney(totalDeductions) : "Off") : "Restricted");
    setText(analyticsNetProfit, canAccessDeductions() ? formatMoney(netProfit) : "Restricted");

    renderAnalyticsBarList(
      analyticsTopRooms,
      Array.from(roomTotals.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 6),
      (value) => `${value} nights`,
    );
    renderAnalyticsBarList(
      analyticsRoomTypes,
      Array.from(roomTypeRevenue.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
      (value) => formatMoney(value),
    );
    renderAnalyticsBarList(
      analyticsServices,
      Array.from(serviceTotals.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
      (value) => formatMoney(value),
    );
    renderAnalyticsTableList(
      analyticsCustomers,
      Array.from(customerTotals.entries()).map(([label, value]) => ({ label, value, meta: "Reservation value" })).sort((a, b) => b.value - a.value).slice(0, 6),
      (value) => formatMoney(value),
    );
    renderAnalyticsTableList(
      analyticsStatuses,
      Array.from(statusTotals.entries()).map(([label, value]) => ({ label, value, meta: "Reservations" })).sort((a, b) => b.value - a.value),
      (value) => String(value),
    );
    renderAnalyticsTableList(
      analyticsSources,
      Array.from(sourceTotals.entries()).map(([label, value]) => ({ label, value, meta: "Booking source" })).sort((a, b) => b.value - a.value),
      (value) => String(value),
    );
    renderAnalyticsTableList(
      analyticsTitles,
      Array.from(titleTotals.entries()).map(([label, value]) => ({ label, value, meta: "Guest title count" })).sort((a, b) => b.value - a.value),
      (value) => String(value),
    );
    renderAnalyticsTableList(
      analyticsStaff,
      Array.from(staffTotals.entries()).map(([label, value]) => ({ label, value, meta: "Booked by staff" })).sort((a, b) => b.value - a.value).slice(0, 6),
      (value) => formatMoney(value),
    );
    const deductionMonthTotals = new Map();
    deductionRows.forEach((item) => {
      deductionMonthTotals.set(item.monthLabel, roundCurrency((deductionMonthTotals.get(item.monthLabel) || 0) + Number(item.amount || 0)));
    });
    renderAnalyticsTableList(
      analyticsDeductionsList,
      includeDeductions
        ? Array.from(deductionMonthTotals.entries()).map(([label, value]) => ({ label, value, meta: "Monthly deductions" })).sort((a, b) => b.value - a.value)
        : [],
      (value) => formatMoney(value),
      canAccessDeductions()
        ? (includeDeductions ? "No deductions saved for this range." : "Turn on Include Deductions to calculate net profit.")
        : "Only owner or admin can view deductions.",
    );

    const trendMetric = analyticsFilterMetric?.value || "revenue";
    const trendPoints = buildAnalyticsTrendPoints(filteredGroups, from, to, trendMetric);
    renderAnalyticsTrendChart(
      analyticsTrendChart,
      trendPoints,
      (value) => trendMetric === "revenue" ? formatMoney(value) : String(value),
    );

    const topSource = Array.from(sourceTotals.entries()).sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0))[0];
    const topCustomer = Array.from(customerTotals.entries()).sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0))[0];
    const topStaff = Array.from(staffTotals.entries()).sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0))[0];
    renderAnalyticsInsights(analyticsInsights, [
      { label: "Filtered Reservations", value: String(totalBookings), meta: `${from} -> ${to}` },
      { label: "Highest Source", value: topSource ? topSource[0] : "-", meta: topSource ? `${topSource[1]} bookings` : "No data" },
      { label: "Top Customer", value: topCustomer ? topCustomer[0] : "-", meta: topCustomer ? formatMoney(topCustomer[1]) : "No revenue yet" },
      { label: "Top Staff", value: topStaff ? topStaff[0] : "-", meta: topStaff ? formatMoney(topStaff[1]) : "No staff data" },
    ]);
    state.currentAnalyticsSnapshot = {
      generatedAt: new Date().toISOString(),
      from,
      to,
      totalRevenue,
      totalBookings,
      totalPendingBalance,
      totalRoomNights,
      averageBookingValue,
      averageStayNights,
      totalHoldPayments,
      totalDeductions,
      netProfit,
      includeHoldPayments,
      includeDeductions,
      deductions: deductionRows,
      topSource: topSource ? { label: topSource[0], value: Number(topSource[1] || 0) } : null,
      topCustomer: topCustomer ? { label: topCustomer[0], value: Number(topCustomer[1] || 0) } : null,
      topStaff: topStaff ? { label: topStaff[0], value: Number(topStaff[1] || 0) } : null,
    };

    if (analyticsEmpty) {
      analyticsEmpty.style.display = filteredGroups.length ? "none" : "block";
      analyticsEmpty.textContent = filteredGroups.length ? "" : "No analytics data for this filter.";
    }
  } catch (error) {
    renderAnalyticsResultsContext();
    setText(analyticsHoldPayments, includeHoldPayments ? formatMoney(0) : "Off");
    setText(analyticsTotalDeductions, canAccessDeductions() ? (includeDeductions ? formatMoney(0) : "Off") : "Restricted");
    setText(analyticsNetProfit, canAccessDeductions() ? formatMoney(0) : "Restricted");
    renderAnalyticsTableList(analyticsDeductionsList, [], formatMoney, canAccessDeductions() ? "Unable to load deductions for this report." : "Only owner or admin can view deductions.");
    state.currentAnalyticsSnapshot = null;
    if (analyticsEmpty) {
      analyticsEmpty.textContent = error.message;
      analyticsEmpty.style.display = "block";
    }
  }
}

function updateOnlineStatus() {
  if (!navigator.onLine) {
    setSyncState("offline");
    return;
  }
  if (!isSupabaseConfigured()) {
    setSyncState("setup");
    return;
  }
  if (!state.supabase) {
    setSyncState("connecting");
    return;
  }
  if (!state.realtimeChannel && state.currentProfile?.approved) {
    setSyncState("connecting");
    return;
  }
  setSyncState(state.currentProfile?.approved ? "live" : "setup");
}

async function fetchProfile(userId, attempts = 5) {
  ensureSupabase();
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const { data, error } = await state.supabase
      .from(CONFIG.SUPABASE_PROFILES_TABLE)
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) {
      const normalized = normalizeProfileRow(data);
      state.profileMap.set(normalized.user_id, normalized);
      return normalized;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  return null;
}

async function runSessionBootStep(label, task, failures) {
  try {
    await task();
    return true;
  } catch (error) {
    const message = error?.message || `${label} failed.`;
    failures.push(`${label}: ${message}`);
    console.error(`Session boot failed at ${label}`, error);
    return false;
  }
}

async function applySession(session) {
  state.currentSession = session;

  if (!session) {
    state.currentProfile = null;
    state.uiPreviewRole = "";
    state.notifications = [];
    state.recentNotifications = [];
    state.notificationUnreadCount = 0;
    if (state.realtimeChannel) {
      await state.supabase.removeChannel(state.realtimeChannel);
      state.realtimeChannel = null;
    }
    renderShell("auth");
    updateOnlineStatus();
    return;
  }

  const profile = await fetchProfile(session.user.id);
  if (!profile) {
    renderShell("auth");
    showAuthMessage("Profile not ready yet. Please try again.", true);
    await state.supabase.auth.signOut();
    return;
  }

  state.currentProfile = profile;
  if (profile.role !== "owner") {
    state.uiPreviewRole = "";
  }
  updateHeaderProfile();
  updateNavVisibility();

  if (!profile.approved) {
    pendingCopy.textContent = `${profile.full_name || profile.username}, your account is waiting for owner/admin approval.`;
    renderShell("pending");
    updateOnlineStatus();
    return;
  }

  renderShell("app");
  updateOnlineStatus();
  const bootFailures = [];
  await runSessionBootStep("Room inventory", () => loadRoomInventory(), bootFailures);
  await runSessionBootStep("Service catalog", () => loadServiceCatalog(), bootFailures);
  await runSessionBootStep("Room pricing", () => loadRoomPricing(), bootFailures);
  await runSessionBootStep("Runtime settings", () => loadRuntimeSettings(), bootFailures);
  updateHeaderProfile();
  updateNavVisibility();
  await runSessionBootStep("Realtime", () => setupRealtime(), bootFailures);
  await runSessionBootStep("Live views", () => refreshLiveViews(), bootFailures);
  await runSessionBootStep("Requests", () => loadRequests(), bootFailures);
  await runSessionBootStep("Notifications", () => loadNotificationUnreadCount(), bootFailures);
  if (canAccessSystemUpdates() && screens.systemUpdates?.classList.contains("screen-active")) {
    await runSessionBootStep("System updates", () => loadSystemUpdates(), bootFailures);
  }
  if (canManageAccounts()) {
    await runSessionBootStep("Accounts", () => loadAccounts(), bootFailures);
  }
  if (bootFailures.length) {
    setSyncState("error");
    showToast(`Loaded with ${bootFailures.length} issue(s). ${bootFailures[0]}`, true);
  } else {
    updateOnlineStatus();
  }
}

async function handleLogin(event) {
  event.preventDefault();
  showAuthMessage("");
  const formData = new FormData(loginForm);
  const username = formData.get("username");
  const password = formData.get("password");
  const email = usernameToEmail(username);

  if (!email || !password) {
    showAuthMessage("Username and password are required.", true);
    return;
  }

  const submitButton = loginForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Logging in...";

  try {
    const { error } = await state.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  } catch (error) {
    showAuthMessage(error.message || "Login failed.", true);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Login";
  }
}

async function handleSignup(event) {
  event.preventDefault();
  showAuthMessage("");
  const formData = new FormData(signupForm);
  const username = normalizeUsername(formData.get("username"));
  const email = usernameToEmail(username);
  const fullName = String(formData.get("fullName") || "").trim();
  const phone = sanitizePhoneValue(formData.get("phone"));
  const password = String(formData.get("password") || "");

  if (!username || !fullName || !phone || !password) {
    showAuthMessage("Fill all account fields.", true);
    return;
  }

  const submitButton = signupForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  try {
    const { data, error } = await state.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
          phone,
        },
      },
    });

    if (error) throw error;

    if (!data.session) {
      showAuthMessage("Account created. Ask owner to approve your access.");
      setAuthTab("login");
      signupForm.reset();
      return;
    }

    const profile = await fetchProfile(data.user.id);
    if (profile?.role === "owner" && profile.approved) {
      showToast("Owner account created.");
    } else {
      showToast("Account request submitted. Wait for approval.");
    }
    signupForm.reset();
  } catch (error) {
    showAuthMessage(error.message || "Could not submit account request.", true);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Account Request";
  }
}

async function handleLogout() {
  if (!state.supabase) return;
  await state.supabase.auth.signOut();
}

function getRoomTypeVariants(group) {
  if (group === "normal") {
    return ["normal", "normal-1", "normal-2", "normal-3", "normal-4", "4-pax"];
  }
  if (group === "kitchen") {
    return ["kitchen", "kitchen-6", "6-pax"];
  }
  return [group];
}

async function fetchRangeBookings(roomGroup, start, end) {
  ensureSupabase();
  const { data, error } = await state.supabase
    .from(CONFIG.SUPABASE_TABLE)
    .select("*")
    .in("room_type", getRoomTypeVariants(roomGroup))
    .lt("check_in", end)
    .gt("check_out", start)
    .order("room_number", { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(mapBooking);
}

async function fetchBookingsByDate(date) {
  ensureSupabase();
  const { data, error } = await state.supabase
    .from(CONFIG.SUPABASE_TABLE)
    .select("*")
    .lte("check_in", date)
    .gt("check_out", date)
    .order("room_number", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(mapBooking);
}

async function fetchBookingsForPeriod(start, end) {
  ensureSupabase();
  const { data, error } = await state.supabase
    .from(CONFIG.SUPABASE_TABLE)
    .select("*")
    .lt("check_in", end)
    .gt("check_out", start)
    .order("check_in", { ascending: true })
    .order("room_number", { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(mapBooking);
}

async function fetchBookingsByIds(ids = []) {
  ensureSupabase();
  const normalizedIds = Array.from(new Set((ids || []).filter(Boolean).map(String)));
  if (!normalizedIds.length) return [];
  const { data, error } = await state.supabase
    .from(CONFIG.SUPABASE_TABLE)
    .select("*")
    .in("id", normalizedIds);

  if (error) throw new Error(error.message);
  return (data || []).map(mapBooking);
}

async function fetchBookingsByTrackCode(trackCode) {
  ensureSupabase();
  if (!trackCode) return [];
  const { data, error } = await state.supabase
    .from(CONFIG.SUPABASE_TABLE)
    .select("*")
    .eq("track_code", trackCode)
    .order("room_number", { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(mapBooking);
}

function getStatusTrackPrefix(status) {
  switch (String(status || "").trim().toUpperCase()) {
    case "BKC":
      return "BKC";
    case "VISIT":
      return "VIS";
    case "CAMPAIGN":
      return "CAM";
    case "CALL":
      return "CAL";
    case "PENDING":
      return "PND";
    default:
      return "BK";
  }
}

function getBookingStatusLabel(status) {
  switch (String(status || "").trim().toLowerCase()) {
    case "campaign":
      return "Campaign Booking";
    case "visit":
      return "Visit Booking";
    case "bkc":
      return "BKC Booking";
    case "call":
      return "Call Booking";
    case "pending":
      return "Pending Booking";
    case "cancelled":
      return "Cancelled";
    case "removed booking":
      return "Removed Booking";
    default:
      return String(status || "Booking");
  }
}

function getBookingStatusNote(status) {
  return String(status || "").trim().toLowerCase() === "pending"
    ? "Waiting for confirmation"
    : "";
}

function isPendingBookingStatus(status) {
  return String(status || "").trim().toLowerCase() === "pending";
}

function getVisibleTrackCode(trackCode, status) {
  const value = String(trackCode || "").trim();
  if (!value || isPendingBookingStatus(status)) return "";
  return value;
}

function getGroupDisplayTrackCode(group) {
  if (!group) return "";
  const status = group.statuses?.size === 1
    ? Array.from(group.statuses)[0]
    : (group.bookings?.[0]?.status || "");
  return getVisibleTrackCode(group.trackCode, status);
}

function getTrackCodePrefix(trackCode = "") {
  const match = String(trackCode || "").trim().toUpperCase().match(/^([A-Z]+)-\d+$/);
  return match ? match[1] : "";
}

async function resolveBookingTrackCode(bookings, nextStatus, currentTrackCode = "") {
  const normalizedTrackCode = String(currentTrackCode || "").trim();
  if (isPendingBookingStatus(nextStatus)) {
    return normalizedTrackCode || getNextTrackCode(nextStatus);
  }
  const items = Array.isArray(bookings) ? bookings.filter(Boolean) : [];
  const transitioningFromPending = items.length
    ? items.every((booking) => isPendingBookingStatus(booking.status))
    : false;
  const nextPrefix = getStatusTrackPrefix(nextStatus);
  const currentPrefix = getTrackCodePrefix(normalizedTrackCode);
  if (!normalizedTrackCode || transitioningFromPending || /^PND-\d+$/i.test(normalizedTrackCode)) {
    return getNextTrackCode(nextStatus);
  }
  if (nextPrefix !== "BK" && currentPrefix && currentPrefix !== nextPrefix) {
    return getNextTrackCode(nextStatus);
  }
  return normalizedTrackCode;
}

async function getNextTrackCode(status) {
  ensureSupabase();
  const prefix = getStatusTrackPrefix(status);
  const { data, error } = await state.supabase
    .from(CONFIG.SUPABASE_TABLE)
    .select("track_code")
    .ilike("track_code", `${prefix}-%`)
    .order("track_code", { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);

  let nextNumber = 1;
  const current = data?.[0]?.track_code ? String(data[0].track_code) : "";
  const match = current.match(/^(.*?)-(\d+)$/);
  if (match) nextNumber = Number(match[2]) + 1;
  return `${prefix}-${String(nextNumber).padStart(4, "0")}`;
}

async function insertBooking(payload) {
  ensureSupabase();
  const hasFixedTrackCode = Boolean(payload.trackCode);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const row = {
      track_code: payload.trackCode || (await getNextTrackCode(payload.status)),
      guest_name: payload.guestName,
      phone: payload.phone,
      created_by_name: payload.createdByName || state.currentProfile?.full_name || state.currentProfile?.username || '',
      check_in: payload.checkIn,
      check_out: payload.checkOut,
      guests: Number(payload.guests),
      room_type: payload.roomType,
      room_type_label: payload.roomTypeLabel,
      room_number: Number(payload.roomNumber),
      ac_enabled: normalizeAcEnabled(payload.roomType, payload.acEnabled),
      rooms_needed: Number(payload.roomsNeeded || 1),
      notes: payload.notes || "",
      booking_status: payload.status,
      advance_paid: Boolean(payload.advancePaid),
      advance_amount: roundCurrency(Number(payload.advanceAmount || 0)),
      lifecycle_status: payload.lifecycleStatus || "booked",
      checked_in_at: payload.checkedInAt || null,
      checked_out_at: payload.checkedOutAt || null,
      close_details: payload.closeDetails || {},
    };
    applyPricingToBookingRow(row, payload);

    let { error } = await state.supabase.from(CONFIG.SUPABASE_TABLE).insert(row);
    if (error && shouldRetryWithoutPricingColumns(error.message)) {
      state.pricingSchemaReady = false;
      stripPricingColumns(row);
      ({ error } = await state.supabase.from(CONFIG.SUPABASE_TABLE).insert(row));
    }
    if (!error) {
      payload.trackCode = row.track_code;
      return row.track_code;
    }

    const message = String(error.message || "");
    const isTrackCodeConflict = message.toLowerCase().includes("track_code") || message.toLowerCase().includes("duplicate");
    if (!isTrackCodeConflict) {
      throw new Error(message);
    }

    if (hasFixedTrackCode) {
      throw new Error("This booking group could not reuse the same track code. Supabase still has a unique track code constraint. Run the track_code index fix SQL first.");
    }

    payload.trackCode = "";
  }

  throw new Error("Could not generate unique track code.");
}

async function backupBookingToSheets(payload) {
  if (!isSheetsBackupConfigured()) {
    return { skipped: true };
  }

  const baseUrl = CONFIG.GOOGLE_SHEETS_BACKUP_URL.startsWith("http")
    ? CONFIG.GOOGLE_SHEETS_BACKUP_URL
    : `${window.location.origin}${CONFIG.GOOGLE_SHEETS_BACKUP_URL}`;

  const body = new URLSearchParams({
    trackCode: payload.trackCode,
    guestName: payload.guestName,
    phone: payload.phone,
    checkIn: payload.checkIn,
    checkOut: payload.checkOut,
    guests: String(payload.guests),
    roomType: payload.roomType,
    roomTypeLabel: payload.roomTypeLabel,
    roomNumber: String(payload.roomNumber),
    roomsNeeded: String(payload.roomsNeeded || 1),
    notes: payload.notes || "",
    status: payload.status,
    timestamp: new Date().toISOString(),
  }).toString();

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const text = await response.text();
  if (!response.ok) throw new Error(text || "Google Sheets backup failed.");

  try {
    const parsed = JSON.parse(text);
    if (parsed.success === false) throw new Error(parsed.message || "Google Sheets backup failed.");
    return parsed;
  } catch (error) {
    throw new Error(text || "Google Sheets backup failed.");
  }
}

async function getAvailability(checkIn, checkOut) {
  if (!checkIn || !checkOut) return null;
  const startDate = parseDate(checkIn);
  const endDate = parseDate(checkOut);
  if (!startDate || !endDate || endDate <= startDate) return null;

  const roomsByType = ROOM_DEFS.map((roomDef) => ({
    room: roomDef,
    rows: getRoomInventoryRows().filter((item) => item.roomType === roomDef.type),
  }));

  const results = await Promise.all(
    roomsByType.map(async ({ room, rows }) => ({
      room,
      rows,
      bookings: await fetchRangeBookings(room.type, checkIn, checkOut),
    }))
  );

  const availability = {};

  results.forEach(({ room, rows, bookings }) => {
    const booked = new Set();
    const occupied = new Map();
    const activeRoomNumbers = new Set(rows.map((item) => Number(item.roomNumber)));

    bookings.forEach((booking) => {
      if (!isBlockingBooking(booking)) return;
      const bookingStart = parseDate(booking.checkIn);
      const bookingEnd = parseDate(booking.checkOut);
      if (!bookingStart || !bookingEnd) return;
      if (!datesOverlap(startDate, endDate, bookingStart, bookingEnd)) return;
      if (normalizeRoomGroup(booking.roomType) !== room.type) return;
      const roomNumber = Number(booking.roomNumber);
      if (!activeRoomNumbers.has(roomNumber)) return;
      booked.add(roomNumber);
      if (!occupied.has(roomNumber)) occupied.set(roomNumber, booking);
    });

    const available = rows.map((item) => Number(item.roomNumber)).filter((number) => !booked.has(number));

    availability[room.type] = {
      total: rows.length,
      booked: booked.size,
      available,
      occupied,
    };
  });

  return availability;
}

function buildPaxOptions(maxPax, selectedValue, suffix = "Pax", includeZero = true) {
  const start = includeZero ? 0 : 1;
  return Array.from({ length: maxPax - start + 1 }, (_, index) => {
    const value = index + start;
    return `<option value="${value}"${value === selectedValue ? " selected" : ""}>${value} ${suffix}</option>`;
  }).join("");
}

function buildNightOptions(selectedNights) {
  return Array.from({ length: 30 }, (_, index) => {
    const value = index + 1;
    return `<option value="${value}"${value === selectedNights ? " selected" : ""}>${value} Night${value > 1 ? "s" : ""}</option>`;
  }).join("");
}

function updateTotalGuests() {
  let totalGuests = 0;
  let totalDrivers = 0;
  let totalExtraGuests = 0;

  state.roomPlans.forEach((plan) => {
    const pax = Number(plan.pax || 0);
    const extraPax = Number(plan.extraPax || 0);
    if (plan.type === "driver") totalDrivers += pax;
    totalGuests += pax + extraPax;
    totalExtraGuests += extraPax;
  });

  guestsInput.value = totalGuests ? String(totalGuests) : "";
  driversTotalInput.value = totalDrivers ? String(totalDrivers) : "";
  extraGuestsTotalInput.value = totalExtraGuests ? String(totalExtraGuests) : "";
  renderRoomServiceAssignments();
  renderPricingSummary();
}

function renderPlannerCard(room, isAvailable, booking, plan, defaultNights) {
  if (!isAvailable) {
    plan.pax = 0;
    plan.extraPax = 0;
    plan.nights = defaultNights;
  } else if (plan.pax === 0) {
    plan.nights = defaultNights;
  }
  plan.acEnabled = normalizeAcEnabled(room.type, plan.acEnabled);

  const card = document.createElement("article");
  card.className = `planner-room ${isAvailable ? "available" : "booked"}${plan.pax > 0 && isAvailable ? " selected" : ""}`;
  card.innerHTML = `
    <div class="planner-room-head">
      <div class="planner-room-name">${getRoomLabel(room.type, room.number)}</div>
      <div class="planner-room-status ${isAvailable ? "available" : "booked"}">${isAvailable ? "Empty" : "Booked"}</div>
    </div>
    <div class="planner-room-caption">
      ${
        isAvailable
          ? "Available for selected dates"
          : `${booking?.guestName || "Occupied"}<br>${booking?.trackCode || "-"} · ${booking?.checkIn || ""} -> ${booking?.checkOut || ""}`
      }
    </div>
    <div class="planner-controls">
      <div class="planner-control">
        <label>Nights</label>
        <select data-role="nights" ${isAvailable ? "" : "disabled"}>${buildNightOptions(plan.nights)}</select>
      </div>
      <div class="planner-control">
        <label>Pax</label>
        <select data-role="pax" ${isAvailable ? "" : "disabled"}>${buildPaxOptions(room.maxPax, plan.pax)}</select>
      </div>
      <div class="planner-control">
        <label>Extra pax / Kids</label>
        <select data-role="extra-pax" ${isAvailable ? "" : "disabled"}>${buildPaxOptions(4, Number(plan.extraPax || 0))}</select>
      </div>
      ${["normal", "kitchen"].includes(room.type) ? `
        <div class="planner-control planner-control-climate">
          <label>Room Mode</label>
          <div class="planner-climate-toggle">
            ${ROOM_CLIMATE_OPTIONS.map((option) => `
              <button
                class="planner-climate-btn${normalizeAcEnabled(room.type, plan.acEnabled) === option.acEnabled ? " active" : ""}"
                type="button"
                data-role="ac-mode"
                data-ac-enabled="${option.acEnabled ? "true" : "false"}"
                ${isAvailable ? "" : "disabled"}
              >${option.label}</button>
            `).join("")}
          </div>
        </div>
      ` : ""}
    </div>
  `;

  if (isAvailable) {
    const nightsSelect = card.querySelector('[data-role="nights"]');
    const paxSelect = card.querySelector('[data-role="pax"]');
    const extraPaxSelect = card.querySelector('[data-role="extra-pax"]');
    const acButtons = card.querySelectorAll('[data-role="ac-mode"]');

    nightsSelect.addEventListener("change", () => {
      plan.nights = Number(nightsSelect.value);
      renderPricingSummary();
    });

    paxSelect.addEventListener("change", () => {
      plan.pax = Number(paxSelect.value);
      card.classList.toggle("selected", plan.pax > 0 || Number(plan.extraPax || 0) > 0);
      updateTotalGuests();
    });

    extraPaxSelect.addEventListener("change", () => {
      plan.extraPax = Number(extraPaxSelect.value);
      card.classList.toggle("selected", plan.pax > 0 || Number(plan.extraPax || 0) > 0);
      updateTotalGuests();
    });

    acButtons.forEach((button) => {
      button.addEventListener("click", () => {
        plan.acEnabled = normalizeAcEnabled(room.type, button.dataset.acEnabled);
        acButtons.forEach((item) => {
          item.classList.toggle("active", item === button);
        });
        renderPricingSummary();
      });
    });
  }

  return card;
}

function renderDriverRoom(room, isAvailable, booking, plan, defaultNights) {
  if (!isAvailable) {
    plan.pax = 0;
    plan.extraPax = 0;
    plan.nights = defaultNights;
  } else if (plan.nights < 1) {
    plan.nights = defaultNights;
  }

  const container = document.createElement("div");
  container.className = `driver-room-panel ${isAvailable ? "available" : "booked"}`;
  container.innerHTML = `
    <div class="driver-room-top">
      <div>
        <div class="planner-room-name">${room.label}</div>
        <div class="planner-room-caption">
          ${
            isAvailable
              ? "Choose driver count for selected dates"
              : `${booking?.guestName || "Occupied"}<br>${booking?.trackCode || "-"} · ${booking?.checkIn || ""} -> ${booking?.checkOut || ""}`
          }
        </div>
      </div>
      <div class="planner-room-status ${isAvailable ? "available" : "booked"}">${isAvailable ? "Empty" : "Booked"}</div>
    </div>
    <div class="driver-room-count">
      ${Array.from({ length: room.maxPax }, (_, index) => {
        const value = index + 1;
        return `<button class="driver-slot-btn${plan.pax === value ? " active" : ""}" type="button" data-driver-count="${value}" ${isAvailable ? "" : "disabled"}>${value}</button>`;
      }).join("")}
    </div>
    <div class="inline-note">Tap the same number again to clear driver selection.</div>
  `;

  if (isAvailable) {
    container.querySelectorAll("[data-driver-count]").forEach((button) => {
      button.addEventListener("click", () => {
        const count = Number(button.dataset.driverCount);
        plan.pax = plan.pax === count ? 0 : count;
        container.querySelectorAll("[data-driver-count]").forEach((item) => {
          item.classList.toggle("active", Number(item.dataset.driverCount) === plan.pax);
        });
        updateTotalGuests();
      });
    });
  }

  return container;
}

function updateAvailabilityUI(availability) {
  const defaultNights = getNightCount(qs("#checkIn").value, qs("#checkOut").value);
  kitchenPlanner.innerHTML = "";
  normalPlanner.innerHTML = "";
  driverPlanner.innerHTML = "";

  if (!availability) {
    availNormal.textContent = "-";
    availKitchen.textContent = "-";
    availDriver.textContent = "-";
    bookedNormal.textContent = "-";
    bookedKitchen.textContent = "-";
    bookedDriver.textContent = "-";
    availabilityHint.textContent = "Select dates to load room planner.";
    state.roomPlans.clear();
    state.bookingServices.clear();
    syncCustomPriceRowsFromServices();
    renderRoomServiceAssignments();
    renderPricingSummary();
    guestsInput.value = "";
    driversTotalInput.value = "";
    extraGuestsTotalInput.value = "";
    return;
  }

  const normal = availability.normal;
  const kitchen = availability.kitchen;
  const driver = availability.driver;
  availNormal.textContent = `${normal.available.length} / ${normal.total}`;
  bookedNormal.textContent = `${normal.booked} booked`;
  availKitchen.textContent = `${kitchen.available.length} / ${kitchen.total}`;
  bookedKitchen.textContent = `${kitchen.booked} booked`;
  availDriver.textContent = `${driver.available.length} / ${driver.total}`;
  bookedDriver.textContent = `${driver.booked} booked`;
  availabilityHint.textContent = `Nights default from selected dates: ${defaultNights}. Per-room pax, extra pax / kids, driver count, and room mode can be adjusted.`;

  buildRoomList().forEach((room) => {
    const groupAvailability = availability[room.type];
    const isAvailable = groupAvailability.available.includes(room.number);
    const plan = getRoomPlan(room.type, room.number, defaultNights);
    const booking = groupAvailability.occupied.get(room.number);

    if (room.type === "driver") {
      driverPlanner.appendChild(renderDriverRoom(room, isAvailable, booking, plan, defaultNights));
      return;
    }

    const card = renderPlannerCard(room, isAvailable, booking, plan, defaultNights);
    if (room.type === "kitchen") kitchenPlanner.appendChild(card);
    else normalPlanner.appendChild(card);
  });

  updateTotalGuests();
  renderPricingSummary();
}

async function refreshAvailability() {
  if (!state.currentProfile?.approved) return;
  try {
    const checkIn = qs("#checkIn").value;
    const checkOut = qs("#checkOut").value;
    const availability = await getAvailability(checkIn, checkOut);
    updateAvailabilityUI(availability);
  } catch (error) {
    showToast(error.message, true);
  }
}

function getTrackCodeTint(trackCode) {
  const palette = [
    { bg: "#fde9b8", border: "#efcf79" },
    { bg: "#dff6b3", border: "#a9d45f" },
    { bg: "#f7cec6", border: "#e69a8c" },
    { bg: "#dff0ff", border: "#93c0ec" },
    { bg: "#dff5ec", border: "#8fceb7" },
    { bg: "#ffe2bf", border: "#efb76f" }
  ];
  let hash = 0;
  String(trackCode || "")
    .split("")
    .forEach((char) => {
      hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    });
  return palette[hash % palette.length];
}

function renderRoomStatus(bookingsForDate) {
  const bookedMap = new Map();

  bookingsForDate.forEach((booking) => {
    if (!isBlockingBooking(booking)) return;
    const roomGroup = normalizeRoomGroup(booking.roomType);
    bookedMap.set(`${roomGroup}-${booking.roomNumber}`, booking);
  });

  roomStatusList.innerHTML = "";
  buildRoomList({ includeInactive: true }).forEach((room) => {
    const booking = bookedMap.get(`${room.type}-${room.number}`);
    const item = document.createElement("div");
    item.className = "room-item";
    if (booking?.trackCode) {
      const tint = getTrackCodeTint(booking.trackCode);
      item.classList.add("room-item-booked-tinted");
      item.style.setProperty("--room-track-bg", tint.bg);
      item.style.setProperty("--room-track-border", tint.border);
    }
    const bookingSummary = booking
      ? [
          booking.trackCode || "-",
          `${Number(booking.guests || 0)} Pax`,
          booking.status || "Active",
          `${booking.checkIn || "-"} -> ${booking.checkOut || "-"}`
        ].join(" | ")
      : "";
    item.innerHTML = `
      <div class="room-item-main">
        <span>${room.fullLabel}</span>
        ${booking ? `<div class="muted">${booking.guestName || "-"}</div><div class="muted"><strong>Booked by:</strong> ${booking.createdByName || "-"}</div><div class="muted">${bookingSummary}</div>` : ""}
      </div>
      <div class="status ${booking ? "status-booked" : room.isActive ? "status-available" : "status-cancelled"}">
        ${booking ? "BOOKED" : room.isActive ? "AVAILABLE" : "OFF"}
      </div>
    `;
    roomStatusList.appendChild(item);
  });
}

function getBookingGroupKey(booking) {
  return booking.trackCode || `booking-${booking.id}`;
}

function getBookingGroupByKey(groupKey) {
  return state.bookingGroups.get(groupKey) || state.plannerBookingGroups.get(groupKey) || null;
}

function normalizeBookingSearchText(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeBookingSearchDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function matchesBookingGroupSearch(group, searchTerm = "") {
  const normalizedSearch = normalizeBookingSearchText(searchTerm);
  if (!normalizedSearch) return true;

  const normalizedAlphaNumericSearch = normalizedSearch.replace(/[^a-z0-9]/g, "");
  const normalizedDigitSearch = normalizeBookingSearchDigits(normalizedSearch);
  const trackCode = String(group?.trackCode || group?.key || "");
  const normalizedTrackCode = normalizeBookingSearchText(trackCode);
  const normalizedTrackAlphaNumeric = normalizedTrackCode.replace(/[^a-z0-9]/g, "");
  const normalizedTrackDigits = normalizeBookingSearchDigits(trackCode);
  const guestName = normalizeBookingSearchText(group?.guestName || "");
  const phoneText = normalizeBookingSearchText(group?.phone || "");
  const phoneDigits = normalizeBookingSearchDigits(group?.phone || "");

  return normalizedTrackCode.includes(normalizedSearch)
    || guestName.includes(normalizedSearch)
    || phoneText.includes(normalizedSearch)
    || (normalizedAlphaNumericSearch && normalizedTrackAlphaNumeric.includes(normalizedAlphaNumericSearch))
    || (normalizedDigitSearch && (phoneDigits.includes(normalizedDigitSearch) || normalizedTrackDigits.includes(normalizedDigitSearch)));
}

function hexToRgb(color) {
  const match = String(color || "").trim().match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return null;
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
  };
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b].map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0")).join("")}`;
}

function mixRgb(base, target, ratio) {
  return {
    r: base.r + (target.r - base.r) * ratio,
    g: base.g + (target.g - base.g) * ratio,
    b: base.b + (target.b - base.b) * ratio,
  };
}

function getPlannerAccentPalette(color) {
  const rgb = hexToRgb(color) || hexToRgb("#93c0ec");
  const bg = rgbToHex(mixRgb(rgb, { r: 255, g: 255, b: 255 }, 0.55));
  const border = rgbToHex(mixRgb(rgb, { r: 22, g: 34, b: 51 }, 0.18));
  const text = rgbToHex(mixRgb(rgb, { r: 18, g: 24, b: 38 }, 0.72));
  return { bg, border, text };
}

function getPlannerTrackColor(groupKey) {
  return state.plannerTrackColors?.[String(groupKey || "").trim()] || "";
}

function setPlannerTrackColor(groupKey, color) {
  const normalizedKey = String(groupKey || "").trim();
  const normalizedColor = /^#[0-9a-f]{6}$/i.test(String(color || "").trim()) ? String(color).trim() : "";
  if (!normalizedKey || !normalizedColor) return;
  setStoredPlannerTrackColors({
    ...(state.plannerTrackColors || {}),
    [normalizedKey]: normalizedColor,
  });
}

function getPlannerBaseColorForGroup(groupKey) {
  return getPlannerTrackColor(groupKey) || state.plannerAccentColor || getStoredPlannerAccentColor();
}

function getPlannerSelectedGroup(groupKey = state.selectedPlannerGroupKey) {
  if (!groupKey) return null;
  return getBookingGroupByKey(groupKey);
}

function getPlannerSelectedGroupLabel(group) {
  if (!group) return "";
  const groupStatus = group.statuses?.size === 1 ? Array.from(group.statuses)[0] : "Pending";
  return getVisibleTrackCode(group.trackCode, groupStatus) || group.trackCode || group.key || "Booking";
}

function syncPlannerColorPicker() {
  if (!plannerColorInput || !plannerColorTarget) return;
  const canEditColors = canEditPlannerColors();
  const selectedGroup = getPlannerSelectedGroup();
  const selectedKey = String(selectedGroup?.key || state.selectedPlannerGroupKey || "").trim();
  const pendingCollections = getLatestPendingRequestCollections();
  const representativeBooking = selectedGroup?.bookings?.[0] || null;
  if (!canEditColors) {
    plannerColorInput.disabled = true;
    plannerColorInput.value = getPlannerBaseColorForGroup(selectedKey);
    plannerColorTarget.textContent = "Only owner or admin can change planner colors.";
    return;
  }
  if (!selectedGroup || !selectedKey) {
    plannerColorInput.disabled = false;
    plannerColorInput.value = state.plannerAccentColor || getStoredPlannerAccentColor();
    plannerColorTarget.textContent = "Changing the default planner color for everyone. Click a booking node to change only that track code.";
    return;
  }
  if (representativeBooking && isPlannerPendingBooking(representativeBooking, pendingCollections)) {
    plannerColorInput.disabled = true;
    plannerColorInput.value = "#9b68dd";
    plannerColorTarget.textContent = `${getPlannerSelectedGroupLabel(selectedGroup)} is pending, so it keeps the pending color until fixed.`;
    return;
  }
  plannerColorInput.disabled = false;
  plannerColorInput.value = getPlannerBaseColorForGroup(selectedKey);
  plannerColorTarget.textContent = `Changing color for ${getPlannerSelectedGroupLabel(selectedGroup)} for everyone.`;
}

function getFilteredPlannerBookings(bookings = []) {
  const items = Array.isArray(bookings) ? bookings : [];
  const searchTerm = plannerSearchInput?.value || "";
  if (!searchTerm) return items;
  const matchedKeys = new Set(
    groupBookingsForDisplay(items)
      .filter((group) => matchesBookingGroupSearch(group, searchTerm))
      .map((group) => group.key),
  );
  return items.filter((booking) => matchedKeys.has(getBookingGroupKey(booking)));
}

function renderCurrentPlannerView() {
  if (!state.currentPlannerStartDate) return;
  renderReservationPlanner(
    state.currentPlannerBookings || [],
    state.currentPlannerStartDate,
    state.currentPlannerRangeDays || 14,
  );
  syncPlannerColorPicker();
}

function mergeBookingsIntoStateMap(bookings = []) {
  const merged = new Map(state.bookingMap);
  bookings.forEach((booking) => {
    merged.set(booking.id, booking);
  });
  state.bookingMap = merged;
}

function groupBookingsForDisplay(bookings) {
  const groups = new Map();

  bookings.forEach((booking) => {
    const key = getBookingGroupKey(booking);
    const customPriceTotal = getCustomPaymentsTotal(booking.customPayments);
    const current = groups.get(key);
    if (current) {
      current.bookings.push(booking);
      current.totalGuests += Number(booking.guests || 0);
      current.totalPrice += Number(booking.roomTotal || 0);
      current.checkIn = current.checkIn < booking.checkIn ? current.checkIn : booking.checkIn;
      current.checkOut = current.checkOut > booking.checkOut ? current.checkOut : booking.checkOut;
      current.statuses.add(booking.status || "Booking");
      return;
    }

    groups.set(key, {
      key,
      trackCode: booking.trackCode || "-",
      guestName: booking.guestName || "Guest",
      phone: booking.phone || "",
      bookings: [booking],
      totalGuests: Number(booking.guests || 0),
      totalPrice: Number(booking.roomTotal || 0) + customPriceTotal,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      statuses: new Set([booking.status || "Booking"]),
    });
  });

  return Array.from(groups.values()).map((group) => ({
    ...group,
    bookings: group.bookings.sort((a, b) => {
      const roomDiff = normalizeRoomGroup(a.roomType).localeCompare(normalizeRoomGroup(b.roomType));
      if (roomDiff !== 0) return roomDiff;
      return Number(a.roomNumber || 0) - Number(b.roomNumber || 0);
    }),
  }));
}

function closeBookingDetailsModal() {
  bookingDetailsModal.classList.add("hidden");
  bookingDetailsBody.innerHTML = "";
}

function getLatestRequestCollections() {
  const requests = Array.from(state.requestMap.values());
  const byTrack = new Map();
  const byBooking = new Map();

  requests.forEach((request) => {
    const trackKey = request.booking?.trackCode || request.bookingId || request.id;
    const bookingKey = request.bookingId || request.id;
    const createdAt = String(request.createdAt || "");

    const currentTrack = byTrack.get(trackKey);
    if (!currentTrack || createdAt > String(currentTrack.createdAt || "")) {
      byTrack.set(trackKey, request);
    }

    const currentBooking = byBooking.get(bookingKey);
    if (!currentBooking || createdAt > String(currentBooking.createdAt || "")) {
      byBooking.set(bookingKey, request);
    }
  });

  return { byTrack, byBooking };
}

function getLatestPendingRequestCollections() {
  const pendingRequests = Array.from(state.requestMap.values()).filter(
    (request) => String(request.status || "").toLowerCase() === "pending",
  );
  const byTrack = new Map();
  const byBooking = new Map();

  pendingRequests.forEach((request) => {
    const trackKey = request.booking?.trackCode || request.bookingId || request.id;
    const bookingKey = request.bookingId || request.id;
    const createdAt = String(request.createdAt || "");

    const currentTrack = byTrack.get(trackKey);
    if (!currentTrack || createdAt > String(currentTrack.createdAt || "")) {
      byTrack.set(trackKey, request);
    }

    const currentBooking = byBooking.get(bookingKey);
    if (!currentBooking || createdAt > String(currentBooking.createdAt || "")) {
      byBooking.set(bookingKey, request);
    }
  });

  return { byTrack, byBooking };
}

function getRequestsForTrack(trackCode) {
  return Array.from(state.requestMap.values())
    .filter((request) => (request.booking?.trackCode || request.bookingId || request.id) === trackCode)
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

function getRequestStatusClass(status) {
  if (status === "approved") return "tag-success";
  if (status === "pending") return "tag-pending";
  if (status === "rejected") return "tag-rejected";
  return "";
}

function getRequestStatusMarkup(request, label = "") {
  if (!request) return "";
  const prefix = label ? `${label}: ` : "";
  return `<button class="booking-tag request-state-chip ${getRequestStatusClass(request.status)}" type="button" data-request-focus="${request.id}">${prefix}${request.status}</button>`;
}

function getActiveStatusMarkup(label = "Active") {
  return `<span class="booking-tag tag-success">${label}</span>`;
}

function getLifecycleBadgeMarkup(group, fallbackLabel = "Active") {
  const lifecycleStatus = getGroupLifecycleStatus(group);
  if (lifecycleStatus === "hold") {
    const hasRemovedStatus = (group?.bookings || []).some((booking) => String(booking.status || "").toLowerCase() === "removed booking");
    return `<span class="booking-tag tag-rejected">${hasRemovedStatus ? "Removed Booking" : "Hold Booking"}</span>`;
  }
  if (lifecycleStatus === "checked_out") {
    return `<span class="booking-tag tag-rejected">Checked Out</span>`;
  }
  if (lifecycleStatus === "checked_in") {
    return `<span class="booking-tag tag-success">Checked In</span>`;
  }
  return getActiveStatusMarkup(fallbackLabel);
}

function renderBookingGroupOverview(group, groupStatus) {
  const advanceInfo = getAdvancePaymentInfo(group.bookings);
  const customPriceTotal = getGroupCustomPriceTotal(group.bookings);
  const balanceAmount = getBookingBalanceAmount(group);
  const lifecycleLabel = getLifecycleStatusLabel(getGroupLifecycleStatus(group));
  const statusLabel = getBookingStatusLabel(groupStatus);
  const statusNote = getBookingStatusNote(groupStatus);
  const checkedInAt = group.bookings[0]?.checkedInAt ? new Date(group.bookings[0].checkedInAt).toLocaleString("en-GB") : "-";
  const checkedOutAt = group.bookings[0]?.checkedOutAt ? new Date(group.bookings[0].checkedOutAt).toLocaleString("en-GB") : "-";
  const enabledFields = normalizeBookingViewFieldList(state.runtimeSettings?.bookingViewFields);
  const hasField = (fieldKey) => enabledFields.includes(fieldKey);
  return `
    <div class="booking-group-overview">
      <section class="booking-overview-panel booking-overview-panel-reservation">
        <div class="booking-overview-panel-title">Reservation</div>
        <div class="booking-overview-rows">
          ${hasField("trackCode") ? `<div class="booking-overview-row"><span>Track Code</span><strong>${group.trackCode || "-"}</strong></div>` : ""}
          ${hasField("customer") ? `<div class="booking-overview-row"><span>Customer</span><strong>${group.guestName || "Guest"}</strong></div>` : ""}
          ${hasField("bookedBy") ? `<div class="booking-overview-row"><span>Booked By</span><strong>${group.bookings[0]?.createdByName || "-"}</strong></div>` : ""}
          ${hasField("phone") ? `<div class="booking-overview-row"><span>Phone</span><strong>${group.phone || "-"}</strong></div>` : ""}
        </div>
      </section>
      <section class="booking-overview-panel booking-overview-panel-stay">
        <div class="booking-overview-panel-title">Stay</div>
        <div class="booking-overview-rows">
          ${hasField("checkIn") ? `<div class="booking-overview-row"><span>Check In</span><strong>${group.checkIn || "-"}</strong></div>` : ""}
          ${hasField("checkOut") ? `<div class="booking-overview-row"><span>Check Out</span><strong>${group.checkOut || "-"}</strong></div>` : ""}
          ${hasField("status") ? `<div class="booking-overview-row"><span>Status</span><strong>${statusLabel}</strong></div>` : ""}
          ${(hasField("statusNote") && statusNote) ? `<div class="booking-overview-row booking-overview-row-note"><span>Status Note</span><strong>${statusNote}</strong></div>` : ""}
          ${hasField("lifecycle") ? `<div class="booking-overview-row"><span>Lifecycle</span><strong>${lifecycleLabel}</strong></div>` : ""}
          ${(hasField("rooms") || hasField("totalPax")) ? `<div class="booking-overview-row"><span>Rooms / Pax</span><strong>${hasField("rooms") ? `${group.bookings.length} room(s)` : ""}${hasField("rooms") && hasField("totalPax") ? " · " : ""}${hasField("totalPax") ? `${group.totalGuests} pax` : ""}</strong></div>` : ""}
          ${hasField("checkInAt") ? `<div class="booking-overview-row"><span>Check In At</span><strong>${checkedInAt}</strong></div>` : ""}
          ${hasField("checkOutAt") ? `<div class="booking-overview-row"><span>Check Out At</span><strong>${checkedOutAt}</strong></div>` : ""}
        </div>
      </section>
      <section class="booking-overview-panel booking-overview-panel-billing">
        <div class="booking-overview-panel-title">Billing</div>
        <div class="booking-overview-rows">
          ${hasField("totalPrice") ? `<div class="booking-overview-row booking-overview-row-strong"><span>Total Price</span><strong>${formatMoney(group.totalPrice || 0)}</strong></div>` : ""}
          ${hasField("advance") ? `<div class="booking-overview-row"><span>Advance</span><strong>${advanceInfo.label}</strong></div>` : ""}
          ${hasField("customPrice") ? `<div class="booking-overview-row"><span>Custom Price</span><strong>${formatMoney(customPriceTotal)}</strong></div>` : ""}
          ${hasField("advanceAmount") ? `<div class="booking-overview-row"><span>Advance Amount</span><strong>${formatMoney(advanceInfo.amount || 0)}</strong></div>` : ""}
          ${hasField("balance") ? `<div class="booking-overview-row booking-overview-row-strong"><span>Balance</span><strong>${formatMoney(balanceAmount)}</strong></div>` : ""}
        </div>
      </section>
    </div>
  `;
}

function renderBookingHeaderSummary(group) {
  const enabledFields = normalizeBookingViewFieldList(state.runtimeSettings?.bookingViewFields);
  const hasField = (fieldKey) => enabledFields.includes(fieldKey);
  const stayNights = Math.max(1, getNightCount(group.checkIn, group.checkOut));
  const roomBreakdown = (group.bookings || []).map((booking) => {
    const roomNights = Math.max(1, getNightCount(booking.checkIn, booking.checkOut));
    return `
      <div class="booking-room-plan-item">
        <strong>${getRoomLabel(normalizeRoomGroup(booking.roomType), booking.roomNumber)} · ${Number(booking.guests || 0)} Pax</strong>
        <span>${roomNights} Night${roomNights === 1 ? "" : "s"} · ${booking.roomTypeLabel || getRoomTypeDisplay(booking.roomType)}</span>
      </div>
    `;
  }).join("");
  return `
    <div class="booking-group-summary-grid">
      ${hasField("stay") ? `<div class="booking-summary-chip booking-summary-chip-wide"><span>Stay</span><strong>${group.checkIn || "-"} -> ${group.checkOut || "-"} · ${stayNights} Night${stayNights === 1 ? "" : "s"}</strong></div>` : ""}
      ${hasField("rooms") ? `<div class="booking-summary-chip"><span>Rooms</span><strong>${group.bookings.length}</strong></div>` : ""}
      ${hasField("totalPax") ? `<div class="booking-summary-chip"><span>Total Pax</span><strong>${group.totalGuests}</strong></div>` : ""}
      ${hasField("lifecycle") ? `<div class="booking-summary-chip"><span>Lifecycle</span><strong>${getLifecycleStatusLabel(getGroupLifecycleStatus(group))}</strong></div>` : ""}
      ${hasField("balance") ? `<div class="booking-summary-chip booking-summary-chip-strong"><span>Balance</span><strong>${formatMoney(getBookingBalanceAmount(group))}</strong></div>` : ""}
      ${roomBreakdown ? `<div class="booking-summary-chip booking-summary-chip-wide booking-summary-chip-room-plan"><span>Room Plan</span><div class="booking-room-plan-list">${roomBreakdown}</div></div>` : ""}
    </div>
  `;
}

function renderBookingRoomFacts(booking) {
  const pricing = getBookingPricingSnapshot(booking);
  const stayNights = Math.max(1, getNightCount(booking.checkIn, booking.checkOut));
  return `
    <div class="booking-room-facts">
      <div class="booking-room-fact">
        <span>Room Type</span>
        <strong>${booking.roomTypeLabel || getRoomTypeDisplay(booking.roomType)}</strong>
      </div>
      <div class="booking-room-fact">
        <span>Pax Count</span>
        <strong>${booking.guests} Pax</strong>
      </div>
      <div class="booking-room-fact">
        <span>Stay</span>
        <strong>${stayNights} Night${stayNights === 1 ? "" : "s"}</strong>
      </div>
      <div class="booking-room-fact booking-room-fact-total">
        <span>Room Price</span>
        <strong>${formatMoney(pricing.roomTotal)}</strong>
      </div>
    </div>
  `;
}

function getReservationShareMeta(group) {
  const advanceInfo = getAdvancePaymentInfo(group.bookings);
  const balanceAmount = getBookingBalanceAmount(group);
  const lifecycleStatus = getGroupLifecycleStatus(group);
  const lifecycleLabel = getLifecycleStatusLabel(lifecycleStatus);
  const stayNights = Math.max(1, getNightCount(group.checkIn, group.checkOut));
  const bookingSourceLabel = group.statuses.size === 1
    ? getBookingStatusLabel(Array.from(group.statuses)[0])
    : "Mixed Booking";

  let documentLabel = "Reservation Invoice";
  let badgeLabel = lifecycleLabel;
  let tone = "invoice";
  let heroNote = "Current reservation summary for this guest.";
  let thankYouMessage = "Thank you for choosing Muthugala Resort.";

  if (lifecycleStatus === "hold") {
    documentLabel = "Hold Notice";
    badgeLabel = "Hold";
    tone = "hold";
    heroNote = "This reservation is currently on hold for the guest.";
    thankYouMessage = "Thank you. This room is being kept on hold until the next update.";
  } else if (lifecycleStatus === "checked_out") {
    documentLabel = "Final Invoice";
    badgeLabel = "Checked Out";
    tone = "final";
    heroNote = "Final stay summary prepared after checkout.";
    thankYouMessage = "Thank you for staying with Muthugala Resort.";
  } else if (advanceInfo.amount > 0 || advanceInfo.allPaid || advanceInfo.partiallyPaid) {
    documentLabel = "Advance Payment Receipt";
    badgeLabel = advanceInfo.partiallyPaid ? "Advance Partial" : "Advance Received";
    tone = "advance";
    heroNote = advanceInfo.partiallyPaid
      ? "Part of the advance payment has been received for this reservation."
      : "Advance payment has been received for this reservation.";
    thankYouMessage = "Thank you for your payment. We look forward to welcoming you.";
  }

  return {
    advanceInfo,
    balanceAmount,
    lifecycleStatus,
    lifecycleLabel,
    stayNights,
    bookingSourceLabel,
    documentLabel,
    badgeLabel,
    tone,
    heroNote,
    thankYouMessage,
  };
}

function buildBookingPdfMarkup(group) {
  const shareMeta = getReservationShareMeta(group);
  const shareMessages = getRuntimeShareMessages();
  const muthugalaLogoUrl = new URL("Logo.png", window.location.href).href;
  const advanceInfo = shareMeta.advanceInfo;
  const customPriceItems = getGroupCustomPriceEntries(group.bookings);
  const customPriceTotal = getGroupCustomPriceTotal(group.bookings);
  const balanceAmount = shareMeta.balanceAmount;
  const allServices = getGroupServices(group.bookings);
  const servicePricingRows = getServicePricingRows(group.bookings);
  const lifecycleLabel = shareMeta.lifecycleLabel;
  const lifecycleStatus = shareMeta.lifecycleStatus;
  const groupNotes = getGroupOtherNotes(group.bookings);
  const enabledFields = normalizeExportFieldList(state.runtimeSettings?.pdfFields);
  const hasField = (fieldKey) => enabledFields.includes(fieldKey);
  const customerName = group.guestName || "Guest";
  const totalCardLabel = shareMeta.documentLabel === "Advance Payment Receipt"
    ? "Reservation Total"
    : shareMeta.documentLabel === "Hold Notice"
      ? "Held Amount"
      : "Invoice Total";
  const topFacts = [
    hasField("stay") ? { label: "Stay", value: `${group.checkIn || "-"} -> ${group.checkOut || "-"} · ${shareMeta.stayNights} Night${shareMeta.stayNights === 1 ? "" : "s"}` } : null,
    hasField("phone") ? { label: "Phone", value: group.phone || "-" } : null,
    hasField("rooms") ? { label: "Rooms", value: `${group.bookings.length || 0} Room${Number(group.bookings.length || 0) === 1 ? "" : "s"}` } : null,
    hasField("totalPax") ? { label: "Total Pax", value: `${group.totalGuests || 0} Pax` } : null,
  ].filter(Boolean);
  const amountFacts = [
    hasField("totalPrice") ? { label: totalCardLabel, value: formatMoney(group.totalPrice || 0), tone: "primary" } : null,
    hasField("advanceAmount") ? { label: shareMeta.documentLabel === "Advance Payment Receipt" ? "Advance Paid" : "Advance Amount", value: formatMoney(advanceInfo.amount || 0), tone: "soft" } : null,
    hasField("balance") ? { label: lifecycleStatus === "hold" ? "Balance To Confirm" : "Balance", value: formatMoney(balanceAmount), tone: balanceAmount > 0 ? "soft" : "success" } : null,
    hasField("customPrice") ? { label: "Custom Price", value: formatMoney(customPriceTotal), tone: "soft" } : null,
  ].filter(Boolean);
  const detailFacts = [
    hasField("bookedBy") ? { label: "Booked By", value: group.bookings[0]?.createdByName || "-" } : null,
    hasField("trackCode") ? { label: "Track Code", value: group.trackCode || "-" } : null,
    hasField("advance") ? { label: "Advance Status", value: advanceInfo.label } : null,
    hasField("lifecycle") ? { label: "Lifecycle", value: lifecycleLabel } : null,
    hasField("checkInAt") ? { label: "Checked In At", value: group.bookings[0]?.checkedInAt ? new Date(group.bookings[0].checkedInAt).toLocaleString("en-GB") : "-" } : null,
    hasField("checkOutAt") ? { label: "Checked Out At", value: group.bookings[0]?.checkedOutAt ? new Date(group.bookings[0].checkedOutAt).toLocaleString("en-GB") : "-" } : null,
    hasField("exportedAt") ? { label: "Exported At", value: new Date().toLocaleString("en-GB") } : null,
    { label: "Booking Type", value: shareMeta.bookingSourceLabel },
  ].filter(Boolean);
  const roomCards = group.bookings.map((booking) => {
    const noteMeta = parseBookingNotes(booking.notes);
    const roomNights = Math.max(1, getNightCount(booking.checkIn, booking.checkOut));
    const roomLifecycleLabel = getLifecycleStatusLabel(getBookingLifecycleStatus(booking));

    return `
      <section class="pdf-room-card">
        <div class="pdf-room-head">
          <div>
            <h3>${escapeHtml(getRoomLabel(normalizeRoomGroup(booking.roomType), booking.roomNumber))}</h3>
            <p>${escapeHtml(roomLifecycleLabel)}</p>
          </div>
          <span>${escapeHtml(booking.status || "Active")}</span>
        </div>
        <div class="pdf-room-grid">
          <div><strong>Room Type</strong><span>${escapeHtml(booking.roomTypeLabel || getRoomTypeDisplay(booking.roomType))}</span></div>
          <div><strong>Pax Count</strong><span>${escapeHtml(`${Number(booking.guests || 0)} Pax`)}</span></div>
          <div><strong>Nights</strong><span>${escapeHtml(`${roomNights} Night${roomNights === 1 ? "" : "s"}`)}</span></div>
          <div><strong>Room Price</strong><span>${escapeHtml(formatMoney(booking.roomTotal || 0))}</span></div>
          <div><strong>Stay</strong><span>${escapeHtml(`${booking.checkIn || "-"} -> ${booking.checkOut || "-"}`)}</span></div>
        </div>
        ${noteMeta.extraGuests || noteMeta.drivers ? `<div class="pdf-room-meta">${escapeHtml([
          noteMeta.extraGuests ? `Extra pax / kids: ${noteMeta.extraGuests}` : "",
          noteMeta.drivers ? `Drivers: ${noteMeta.drivers}` : "",
        ].filter(Boolean).join(" | "))}</div>` : ""}
        ${noteMeta.otherNotes.length ? `<div class="pdf-notes"><strong>Notes:</strong> ${escapeHtml(noteMeta.otherNotes.join(" | "))}</div>` : ""}
      </section>
    `;
  }).join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(group.trackCode || "Reservation")} PDF</title>
        <style>
          body { font-family: "Sora", Arial, sans-serif; margin: 0; background: linear-gradient(180deg, #f6efe3 0%, #efe8dc 100%); color: #173d35; font-size: 13px; }
          .pdf-shell { max-width: 980px; margin: 0 auto; padding: 18px; }
          .pdf-card { background: #fffdf9; border: 1px solid #eadfcd; border-radius: 22px; padding: 20px; box-shadow: 0 18px 42px rgba(57, 44, 24, 0.08); }
          .pdf-card.pdf-tone-invoice { border-top: 6px solid #0b3d2e; }
          .pdf-card.pdf-tone-advance { border-top: 6px solid #b88925; }
          .pdf-card.pdf-tone-final { border-top: 6px solid #215f9a; }
          .pdf-card.pdf-tone-hold { border-top: 6px solid #8c6a2d; }
          .pdf-topline { display: flex; justify-content: space-between; gap: 10px; font-size: 9px; letter-spacing: 0.09em; text-transform: uppercase; color: #85755f; margin-bottom: 12px; }
          .pdf-hero { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(220px, 0.9fr); gap: 14px; margin-bottom: 14px; }
          .pdf-hero-panel { border-radius: 20px; padding: 18px; background: linear-gradient(135deg, #0f4a38 0%, #114e3b 55%, #194f67 100%); color: #f8f5ef; }
          .pdf-tone-advance .pdf-hero-panel { background: linear-gradient(135deg, #765514 0%, #b88925 52%, #d9b96d 100%); color: #fffaf1; }
          .pdf-tone-final .pdf-hero-panel { background: linear-gradient(135deg, #204868 0%, #2d6d97 55%, #5ea5cf 100%); }
          .pdf-tone-hold .pdf-hero-panel { background: linear-gradient(135deg, #6f5322 0%, #8c6a2d 50%, #b08d4e 100%); }
          .pdf-branding { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
          .pdf-brand-logo { width: 72px; height: 72px; object-fit: contain; border-radius: 16px; background: rgba(255, 255, 255, 0.14); padding: 8px; }
          .pdf-brand-copy { display: grid; gap: 3px; }
          .pdf-brand-copy strong { font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; }
          .pdf-brand-copy span { font-size: 10px; opacity: 0.9; }
          .pdf-track { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.78; margin-bottom: 8px; }
          .pdf-hero-panel h1 { margin: 0; font-size: 28px; line-height: 1.04; letter-spacing: -0.04em; }
          .pdf-hero-copy { margin: 8px 0 0; font-size: 12px; line-height: 1.45; max-width: 42ch; opacity: 0.92; }
          .pdf-thankyou { margin-top: 12px; display: inline-flex; align-items: center; padding: 8px 12px; border-radius: 999px; background: rgba(255, 255, 255, 0.14); font-size: 10px; font-weight: 700; }
          .pdf-status-panel { border: 1px solid #eadfcd; border-radius: 20px; padding: 14px; background: linear-gradient(180deg, #fff 0%, #fcf8f1 100%); display: grid; gap: 10px; align-content: start; }
          .pdf-badge { display: inline-flex; width: fit-content; padding: 7px 10px; border-radius: 999px; background: #e9f3ee; color: #15533d; font-size: 10px; font-weight: 800; letter-spacing: 0.03em; }
          .pdf-tone-advance .pdf-badge { background: #fff4db; color: #8c6308; }
          .pdf-tone-final .pdf-badge { background: #e9f3fb; color: #1e5c86; }
          .pdf-tone-hold .pdf-badge { background: #f8edda; color: #7c5a18; }
          .pdf-status-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #7a6c57; }
          .pdf-status-title { font-size: 18px; font-weight: 800; color: #173d35; line-height: 1.15; }
          .pdf-detail-list { display: grid; gap: 8px; }
          .pdf-detail-row { display: flex; justify-content: space-between; gap: 10px; border-top: 1px solid #efe4d4; padding-top: 8px; }
          .pdf-detail-row:first-child { border-top: 0; padding-top: 0; }
          .pdf-detail-row strong { font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #8c7b62; }
          .pdf-detail-row span { font-size: 11px; font-weight: 700; color: #173d35; text-align: right; }
          .pdf-quick-grid, .pdf-amount-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 14px; }
          .pdf-fact-card { border: 1px solid #eadfcd; border-radius: 16px; padding: 11px 12px; background: #fff; }
          .pdf-fact-card strong { display: block; font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #8b7d66; margin-bottom: 4px; }
          .pdf-fact-card span { display: block; font-size: 15px; font-weight: 800; color: #173d35; line-height: 1.25; }
          .pdf-fact-card-primary { background: linear-gradient(180deg, #f4faf6, #fff); border-color: #d9eadf; }
          .pdf-fact-card-success { background: linear-gradient(180deg, #f0f9f3, #fff); border-color: #d2e7d8; }
          .pdf-section { margin-bottom: 14px; padding: 14px; border: 1px solid #eadfcd; border-radius: 18px; background: #fff; }
          .pdf-section-head { display: flex; justify-content: space-between; gap: 10px; align-items: baseline; margin-bottom: 10px; }
          .pdf-section-head h3 { margin: 0; font-size: 15px; color: #173d35; }
          .pdf-section-head span { font-size: 10px; color: #7e6f5a; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
          .pdf-chip-list { display: flex; flex-wrap: wrap; gap: 8px; }
          .pdf-chip { border: 1px solid #e3d5b8; border-radius: 999px; padding: 6px 10px; background: #fff8eb; font-size: 10px; font-weight: 700; color: #7d5e19; }
          .pdf-note-list { display: grid; gap: 8px; }
          .pdf-note-item, .pdf-notes { font-size: 11px; line-height: 1.45; color: #4d5f5a; }
          .pdf-room-list { display: grid; gap: 10px; }
          .pdf-room-card { border: 1px solid #eadfcd; border-radius: 16px; padding: 12px; background: linear-gradient(180deg, #fff 0%, #fcfaf5 100%); break-inside: avoid; }
          .pdf-room-head { display: flex; justify-content: space-between; gap: 10px; align-items: flex-start; margin-bottom: 8px; }
          .pdf-room-head h3 { margin: 0; font-size: 15px; color: #173d35; }
          .pdf-room-head p { margin: 2px 0 0; color: #6d7a72; font-size: 10px; font-weight: 600; }
          .pdf-room-head span { padding: 5px 8px; border-radius: 999px; background: #e7f0ea; color: #1f6c4d; font-size: 10px; font-weight: 700; }
          .pdf-room-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
          .pdf-room-grid div { border: 1px solid #efe6d8; border-radius: 12px; padding: 8px 10px; background: #fff; }
          .pdf-room-grid strong { display: block; font-size: 8px; letter-spacing: 0.08em; text-transform: uppercase; color: #7f725d; margin-bottom: 3px; }
          .pdf-room-grid span { font-size: 11px; font-weight: 700; color: #173d35; }
          .pdf-room-meta { margin-top: 8px; font-size: 10px; color: #5f7068; line-height: 1.45; }
          @media (max-width: 720px) {
            .pdf-shell { padding: 12px; }
            .pdf-card { padding: 16px; border-radius: 18px; }
            .pdf-hero, .pdf-quick-grid, .pdf-amount-grid, .pdf-room-grid { grid-template-columns: 1fr; }
            .pdf-hero-panel h1 { font-size: 28px; }
          }
          @media print {
            @page { size: A4; margin: 10mm; }
            body { background: #fff; }
            .pdf-shell { padding: 0; }
            .pdf-card { border: 0; border-radius: 0; padding: 0; box-shadow: none; }
            .pdf-section,
            .pdf-room-card,
            .pdf-status-panel,
            .pdf-fact-card { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="pdf-shell">
          <div class="pdf-card pdf-tone-${escapeHtml(shareMeta.tone)}">
            <div class="pdf-topline">
              <span>${escapeHtml(new Date().toLocaleString("en-GB"))}</span>
              <span>${escapeHtml(shareMeta.documentLabel)}</span>
            </div>
            <section class="pdf-hero">
              <div class="pdf-hero-panel">
                <div class="pdf-branding">
                  <img class="pdf-brand-logo" src="${escapeHtml(muthugalaLogoUrl)}" alt="Muthugala Resort logo" />
                  <div class="pdf-brand-copy">
                    <strong>Muthugala Resort</strong>
                    <span>Reservation Summary</span>
                  </div>
                </div>
                ${hasField("trackCode") ? `<div class="pdf-track">${escapeHtml(group.trackCode || "-")}</div>` : ""}
                <h1>${escapeHtml(hasField("customer") ? customerName : shareMeta.documentLabel)}</h1>
                <p class="pdf-hero-copy">${escapeHtml(shareMeta.heroNote)}</p>
                <div class="pdf-thankyou">${escapeHtml(shareMeta.thankYouMessage)}</div>
              </div>
              <aside class="pdf-status-panel">
                <div class="pdf-badge">${escapeHtml(shareMeta.badgeLabel)}</div>
                <div>
                  <div class="pdf-status-label">Document Type</div>
                  <div class="pdf-status-title">${escapeHtml(shareMeta.documentLabel)}</div>
                </div>
                <div class="pdf-detail-list">
                  ${detailFacts.map((item) => `
                    <div class="pdf-detail-row">
                      <strong>${escapeHtml(item.label)}</strong>
                      <span>${escapeHtml(item.value)}</span>
                    </div>
                  `).join("")}
                </div>
              </aside>
            </section>
            ${topFacts.length ? `
              <div class="pdf-quick-grid">
                ${topFacts.map((item) => `
                  <div class="pdf-fact-card">
                    <strong>${escapeHtml(item.label)}</strong>
                    <span>${escapeHtml(item.value)}</span>
                  </div>
                `).join("")}
              </div>
            ` : ""}
            ${amountFacts.length ? `
              <div class="pdf-amount-grid">
                ${amountFacts.map((item) => `
                  <div class="pdf-fact-card${item.tone === "primary" ? " pdf-fact-card-primary" : item.tone === "success" ? " pdf-fact-card-success" : ""}">
                    <strong>${escapeHtml(item.label)}</strong>
                    <span>${escapeHtml(item.value)}</span>
                  </div>
                `).join("")}
              </div>
            ` : ""}
            ${hasField("customPriceEntries") && customPriceItems.length ? `
              <section class="pdf-section">
                <div class="pdf-section-head">
                  <h3>Custom Price Entries</h3>
                  <span>${escapeHtml(`${customPriceItems.length} Item${customPriceItems.length === 1 ? "" : "s"}`)}</span>
                </div>
                <div class="pdf-note-list">
                ${customPriceItems.map((payment, index) => `
                  <div class="pdf-note-item">${index + 1}. ${escapeHtml(formatMoney(payment.amount || 0))}${payment.note ? ` · ${escapeHtml(payment.note)}` : ""}</div>
                `).join("")}
                </div>
              </section>
            ` : ""}
            ${hasField("services") && allServices.length ? `
              <section class="pdf-section">
                <div class="pdf-section-head">
                  <h3>Services</h3>
                  <span>${escapeHtml(`${allServices.length} Selected`)}</span>
                </div>
                <div class="pdf-chip-list">${allServices.map((service) => `<span class="pdf-chip">${escapeHtml(service)}</span>`).join("")}</div>
              </section>
            ` : ""}
            ${hasField("notes") ? `
              <section class="pdf-section">
                <div class="pdf-section-head">
                  <h3>Notes</h3>
                  <span>Reservation Notes</span>
                </div>
                <div class="pdf-notes">${escapeHtml(groupNotes || "-")}</div>
              </section>
            ` : ""}
            <section class="pdf-section">
              <div class="pdf-section-head">
                <h3>More Information</h3>
                <span>Customer Notice</span>
              </div>
              <div class="pdf-note-list">
                <div class="pdf-note-item">${escapeHtml(shareMessages.rebookingNote)}</div>
                <div class="pdf-note-item">${escapeHtml(shareMessages.contactNote)}</div>
                <div class="pdf-note-item">${escapeHtml(shareMessages.pdfKeepNote)}</div>
              </div>
            </section>
            ${hasField("servicePrices") ? `
              <section class="pdf-section">
                <div class="pdf-section-head">
                  <h3>Service Prices</h3>
                  <span>${escapeHtml(servicePricingRows.length ? "Added Prices" : "No Added Prices")}</span>
                </div>
                <div class="pdf-note-list">
                ${
                  servicePricingRows.length
                    ? servicePricingRows.map((row) => `<div class="pdf-note-item">${escapeHtml(row.service)}: ${escapeHtml(row.amount > 0 ? formatMoney(row.amount) : "-")}</div>`).join("")
                    : `<div class="pdf-note-item">No services added.</div>`
                }
                </div>
              </section>
            ` : ""}
            ${hasField("roomDetails") ? `
              <section class="pdf-section">
                <div class="pdf-section-head">
                  <h3>Room Breakdown</h3>
                  <span>${escapeHtml(`${group.bookings.length || 0} Room${Number(group.bookings.length || 0) === 1 ? "" : "s"}`)}</span>
                </div>
                <div class="pdf-room-list">${roomCards}</div>
              </section>
            ` : ""}
          </div>
        </div>
      </body>
    </html>
  `;
}

function printMarkup(markup) {
  if (pdfPrintFrame) {
    pdfPrintFrame.remove();
    pdfPrintFrame = null;
  }

  pdfPrintFrame = document.createElement("iframe");
  pdfPrintFrame.style.position = "fixed";
  pdfPrintFrame.style.width = "0";
  pdfPrintFrame.style.height = "0";
  pdfPrintFrame.style.opacity = "0";
  pdfPrintFrame.style.pointerEvents = "none";
  pdfPrintFrame.style.border = "0";
  pdfPrintFrame.setAttribute("aria-hidden", "true");
  document.body.appendChild(pdfPrintFrame);
  const frameWindow = pdfPrintFrame.contentWindow;
  if (!frameWindow) {
    showToast("Could not prepare PDF export.", true);
    pdfPrintFrame.remove();
    pdfPrintFrame = null;
    return;
  }

  let hasPrinted = false;
  const runPrint = () => {
    if (hasPrinted) return;
    hasPrinted = true;
    frameWindow.focus();
    frameWindow.print();
  };

  frameWindow.document.open();
  frameWindow.document.write(markup);
  frameWindow.document.close();
  frameWindow.addEventListener("load", () => {
    window.setTimeout(() => {
      runPrint();
    }, 300);
  }, { once: true });

  window.setTimeout(() => {
    try {
      runPrint();
    } catch (error) {
      showToast("PDF export failed. Try again.", true);
    }
  }, 700);
}

function buildAnalyticsExportMarkup(snapshot = state.currentAnalyticsSnapshot) {
  if (!snapshot) return "";
  const generatedAt = snapshot.generatedAt ? new Date(snapshot.generatedAt).toLocaleString("en-GB") : new Date().toLocaleString("en-GB");
  const deductionRows = (snapshot.deductions || []).map((item) => `
    <tr>
      <td>${escapeHtml(item.monthLabel || "-")}</td>
      <td>${escapeHtml(item.category || "-")}</td>
      <td>${escapeHtml(item.title || "-")}</td>
      <td>${escapeHtml(item.details || "-")}</td>
      <td style="text-align:right;">${escapeHtml(formatMoney(item.amount || 0))}</td>
    </tr>
  `).join("");
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Analytics Report</title>
        <style>
          body { font-family: "Sora", Arial, sans-serif; margin: 0; padding: 28px; background: #f7f4ee; color: #18352d; }
          .hero { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 20px; align-items: flex-start; }
          .hero h1 { margin: 0; font-size: 28px; }
          .muted { color: #64736c; font-size: 13px; }
          .stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-bottom: 20px; }
          .card { background: #fffdf9; border: 1px solid #e7dfd2; border-radius: 16px; padding: 14px 16px; }
          .card span { display: block; font-size: 12px; color: #6a746f; margin-bottom: 6px; }
          .card strong { font-size: 20px; color: #0b3d2e; }
          .section { background: #fffdf9; border: 1px solid #e7dfd2; border-radius: 16px; padding: 16px; margin-bottom: 16px; }
          .section h2 { margin: 0 0 10px; font-size: 18px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px 8px; border-bottom: 1px solid #ece5da; font-size: 13px; text-align: left; vertical-align: top; }
          th { font-size: 12px; color: #68756e; text-transform: uppercase; letter-spacing: 0.04em; }
        </style>
      </head>
      <body>
        <div class="hero">
          <div>
            <div class="muted">Muthugala Resort</div>
            <h1>Analytics Report</h1>
            <div class="muted">${escapeHtml(formatAnalyticsDateLabel(snapshot.from))} -> ${escapeHtml(formatAnalyticsDateLabel(snapshot.to))}</div>
          </div>
          <div class="muted">Generated: ${escapeHtml(generatedAt)}</div>
        </div>
        <div class="stats">
          <div class="card"><span>Total Earn</span><strong>${escapeHtml(formatMoney(snapshot.totalRevenue || 0))}</strong></div>
          <div class="card"><span>Total Deductions</span><strong>${escapeHtml(snapshot.includeDeductions ? formatMoney(snapshot.totalDeductions || 0) : "Off")}</strong></div>
          <div class="card"><span>Net Profit</span><strong>${escapeHtml(snapshot.includeDeductions ? formatMoney(snapshot.netProfit || 0) : formatMoney(snapshot.totalRevenue || 0))}</strong></div>
          <div class="card"><span>Total Bookings</span><strong>${escapeHtml(String(snapshot.totalBookings || 0))}</strong></div>
          <div class="card"><span>Room Nights</span><strong>${escapeHtml(String(snapshot.totalRoomNights || 0))}</strong></div>
          <div class="card"><span>Pending Balance</span><strong>${escapeHtml(formatMoney(snapshot.totalPendingBalance || 0))}</strong></div>
        </div>
        <div class="section">
          <h2>Summary</h2>
          <table>
            <tbody>
              <tr><th>Hold Payments</th><td>${escapeHtml(snapshot.includeHoldPayments ? formatMoney(snapshot.totalHoldPayments || 0) : "Off")}</td></tr>
              <tr><th>Top Source</th><td>${escapeHtml(snapshot.topSource?.label || "-")}${snapshot.topSource ? ` · ${escapeHtml(String(snapshot.topSource.value || 0))} bookings` : ""}</td></tr>
              <tr><th>Top Customer</th><td>${escapeHtml(snapshot.topCustomer?.label || "-")}${snapshot.topCustomer ? ` · ${escapeHtml(formatMoney(snapshot.topCustomer.value || 0))}` : ""}</td></tr>
              <tr><th>Top Staff</th><td>${escapeHtml(snapshot.topStaff?.label || "-")}${snapshot.topStaff ? ` · ${escapeHtml(formatMoney(snapshot.topStaff.value || 0))}` : ""}</td></tr>
            </tbody>
          </table>
        </div>
        <div class="section">
          <h2>Deductions</h2>
          ${snapshot.includeDeductions
            ? (snapshot.deductions?.length
              ? `<table>
                  <thead>
                    <tr><th>Month</th><th>Category</th><th>Title</th><th>Details</th><th style="text-align:right;">Amount</th></tr>
                  </thead>
                  <tbody>${deductionRows}</tbody>
                </table>`
              : `<div class="muted">No deductions saved for this range.</div>`)
            : `<div class="muted">Include Deductions was turned off for this report.</div>`}
        </div>
      </body>
    </html>
  `;
}

function exportBookingGroupPdf(groupKey) {
  const group = getBookingGroupByKey(groupKey);
  if (!group) {
    showToast("Booking details not found.", true);
    return;
  }
  printMarkup(buildBookingPdfMarkup(group));
}

function exportAnalyticsReport() {
  if (!state.currentAnalyticsSnapshot) {
    showToast("Load analytics first to export the report.", true);
    return;
  }
  printMarkup(buildAnalyticsExportMarkup(state.currentAnalyticsSnapshot));
}

function normalizeWhatsappPhone(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

function buildReservationWhatsappMessage(group) {
  const shareMeta = getReservationShareMeta(group);
  const shareMessages = getRuntimeShareMessages();
  const customerName = group.guestName || group.bookings?.[0]?.guestName || "Guest";
  const groupNotes = getGroupOtherNotes(group.bookings);
  const advanceInfo = shareMeta.advanceInfo;
  const customPriceItems = getGroupCustomPriceEntries(group.bookings);
  const customPriceTotal = getGroupCustomPriceTotal(group.bookings);
  const balanceAmount = shareMeta.balanceAmount;
  const servicePricingRows = getServicePricingRows(group.bookings);
  const enabledFields = normalizeExportFieldList(state.runtimeSettings?.whatsappFields);
  const hasField = (fieldKey) => enabledFields.includes(fieldKey);
  const bullet = (label, value) => `• ${label}: *${value}*`;
  const plainBullet = (value) => `• ${value}`;
  const paymentLines = [
    hasField("totalPrice") ? bullet("Total Amount", formatMoney(group.totalPrice || 0)) : "",
    hasField("advanceAmount") ? bullet("Advance Paid", formatMoney(advanceInfo.amount || 0)) : "",
    hasField("balance") ? bullet("Balance", formatMoney(balanceAmount)) : "",
    hasField("customPrice") ? bullet("Custom Price", formatMoney(customPriceTotal)) : "",
  ].filter(Boolean);
  const roomLines = group.bookings.map((booking) => {
    const noteMeta = parseBookingNotes(booking.notes);
    const extraBits = [];
    if (noteMeta.extraGuests) extraBits.push(`Extra pax/kids ${noteMeta.extraGuests}`);
    if (noteMeta.drivers) extraBits.push(`Drivers ${noteMeta.drivers}`);
    return [
      `${getRoomLabel(normalizeRoomGroup(booking.roomType), booking.roomNumber)}`,
      booking.roomTypeLabel || getRoomTypeDisplay(booking.roomType),
      `${Number(booking.guests || 0)} pax`,
      `${Math.max(1, getNightCount(booking.checkIn, booking.checkOut))} night${Math.max(1, getNightCount(booking.checkIn, booking.checkOut)) === 1 ? "" : "s"}`,
      formatMoney(booking.roomTotal || 0),
      extraBits.join(" | "),
    ].filter(Boolean).join(" | ");
  });

  const bookingInfoLines = [
    bullet("Customer Name", customerName),
    ...(hasField("trackCode") ? [bullet("Track Code", group.trackCode || "-")] : []),
    bullet("Reservation Status", shareMeta.badgeLabel),
    ...(hasField("phone") ? [bullet("Phone Number", group.phone || "-")] : []),
    ...(hasField("bookedBy") ? [bullet("Booked By", group.bookings[0]?.createdByName || "-")] : []),
    ...(hasField("stay") ? [bullet("Stay", `${group.checkIn || "-"} -> ${group.checkOut || "-"} · ${shareMeta.stayNights} night${shareMeta.stayNights === 1 ? "" : "s"}`)] : []),
    ...(hasField("rooms") ? [bullet("Rooms", String(group.bookings.length || 0))] : []),
    ...(hasField("totalPax") ? [bullet("Total Pax", String(group.totalGuests || 0))] : []),
    ...(hasField("lifecycle") ? [bullet("Lifecycle", shareMeta.lifecycleLabel)] : []),
    ...(hasField("advance") ? [bullet("Advance Status", advanceInfo.label)] : []),
    ...(hasField("checkInAt") ? [bullet("Checked In At", group.bookings[0]?.checkedInAt ? new Date(group.bookings[0].checkedInAt).toLocaleString("en-GB") : "-")] : []),
    ...(hasField("checkOutAt") ? [bullet("Checked Out At", group.bookings[0]?.checkedOutAt ? new Date(group.bookings[0].checkedOutAt).toLocaleString("en-GB") : "-")] : []),
  ];

  const serviceLines = hasField("servicePrices") && servicePricingRows.length
    ? servicePricingRows.map((row) => bullet(row.service, row.amount > 0 ? formatMoney(row.amount) : "-"))
    : [];
  const customEntryLines = hasField("customPriceEntries") && customPriceItems.length
    ? customPriceItems.map((payment, index) => plainBullet(`${index + 1}. ${formatMoney(payment.amount || 0)}${payment.note ? ` | ${payment.note}` : ""}`))
    : [];
  const selectedServicesLines = hasField("services") && getGroupServices(group.bookings).length
    ? getGroupServices(group.bookings).map((service) => plainBullet(service))
    : [];
  const roomDetailLines = hasField("roomDetails")
    ? roomLines.map((line, index) => plainBullet(`${index + 1}. ${line}`))
    : [];
  const moreInfoLines = [
    plainBullet(shareMessages.rebookingNote),
    plainBullet(shareMessages.contactNote),
    plainBullet(shareMessages.pdfKeepNote),
  ];

  return [
    `*MUTHUGALA RESORT*`,
    `*${shareMeta.documentLabel}*`,
    ...(hasField("trackCode") ? [`_${group.trackCode || "-"}_`] : []),
    ``,
    `Dear *${customerName}*,`,
    `${shareMeta.heroNote}`,
    `${shareMeta.thankYouMessage}`,
    ``,
    `*BOOKING INFORMATION*`,
    ...bookingInfoLines,
    ...(paymentLines.length ? [``, `*PAYMENT SUMMARY*`, ...paymentLines] : []),
    ...(roomDetailLines.length ? [``, `*ROOM BREAKDOWN*`, ...roomDetailLines] : []),
    ...(serviceLines.length ? [``, `*SERVICE PRICES*`, ...serviceLines] : []),
    ...(customEntryLines.length ? [``, `*CUSTOM PRICE ENTRIES*`, ...customEntryLines] : []),
    ...(selectedServicesLines.length ? [``, `*SELECTED SERVICES*`, ...selectedServicesLines] : []),
    ...(hasField("notes") ? [``, `*NOTES*`, plainBullet(groupNotes || "-")] : []),
    ``,
    `*MORE INFORMATION*`,
    ...moreInfoLines,
  ].join("\n");
}

function openReservationWhatsapp(groupKey) {
  const group = getBookingGroupByKey(groupKey);
  if (!group) {
    showToast("Booking details not found.", true);
    return;
  }

  const phone = normalizeWhatsappPhone(RESERVATION_WHATSAPP_NUMBER);
  const message = encodeURIComponent(buildReservationWhatsappMessage(group));
  const url = `https://wa.me/${phone}?text=${message}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function openReservationEmail(groupKey) {
  const group = getBookingGroupByKey(groupKey);
  if (!group) {
    showToast("Booking details not found.", true);
    return;
  }
  const email = window.prompt("Enter customer email address.", "");
  if (!email) return;
  const subject = encodeURIComponent(`${group.trackCode || "Booking"} payment slip`);
  const body = encodeURIComponent(buildReservationWhatsappMessage(group));
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

function buildCloseDetailsPayload(group, serviceRows = []) {
  return {
    servicePrices: serviceRows.map((row) => ({
      service: row.service,
      amount: roundCurrency(Number(row.amount || 0)),
    })),
    closedAt: new Date().toISOString(),
    stayedHours: getBookingStayedHours(group),
  };
}

function mergeServicePricesIntoCustomPayments(bookings, serviceRows = []) {
  const serviceNames = new Set(serviceRows.map((row) => row.service.toLowerCase()));
  const preserved = getGroupCustomPriceEntries(bookings)
    .filter((item) => !serviceNames.has(String(item.note || "").trim().toLowerCase()));
  const pricedServices = serviceRows
    .filter((row) => Number(row.amount || 0) > 0)
    .map((row) => ({
      amount: roundCurrency(Number(row.amount || 0)),
      note: row.service,
    }));
  return [...pricedServices, ...preserved];
}

async function updateGroupLifecycle(groupKey, values = {}) {
  const group = getBookingGroupByKey(groupKey);
  if (!group?.bookings?.length) throw new Error("Booking group not found.");
  for (const booking of group.bookings) {
    await updateBooking(booking.id, {
      guestName: booking.guestName,
      phone: booking.phone,
      checkIn: values.checkIn ?? booking.checkIn,
      checkOut: values.checkOut ?? booking.checkOut,
      guests: booking.guests,
      roomType: booking.roomType,
      roomTypeLabel: booking.roomTypeLabel,
      roomNumber: booking.roomNumber,
      notes: "notes" in values ? values.notes : booking.notes,
      status: values.status ?? booking.status,
      roomsNeeded: booking.roomsNeeded,
      offerPercentage: booking.offerPercentage,
      advancePaid: booking.advancePaid,
      advanceAmount: booking.advanceAmount,
      customPayments: "customPayments" in values ? values.customPayments : booking.customPayments,
      lifecycleStatus: values.lifecycleStatus ?? booking.lifecycleStatus ?? "booked",
      checkedInAt: "checkedInAt" in values ? values.checkedInAt : booking.checkedInAt,
      checkedOutAt: "checkedOutAt" in values ? values.checkedOutAt : booking.checkedOutAt,
      closeDetails: "closeDetails" in values ? values.closeDetails : booking.closeDetails,
    });
  }
}

async function insertBookingSystemUpdate(updateType, title, group, message, metadata = {}) {
  await insertSystemUpdate({
    updateType,
    title,
    message,
    metadata: {
      trackCode: group?.trackCode || group?.key || "",
      guestName: group?.guestName || "Guest",
      ...metadata,
    },
  });
}

async function performGroupCheckIn(groupKey) {
  const group = getBookingGroupByKey(groupKey);
  if (!group) throw new Error("Booking group not found.");
  const confirmed = window.confirm(`Mark ${group.trackCode || "this booking"} as checked in?`);
  if (!confirmed) return false;
  await updateGroupLifecycle(groupKey, {
    lifecycleStatus: "checked_in",
    checkedInAt: new Date().toISOString(),
    checkedOutAt: null,
  });
  await insertNotification({
    bookingId: group.bookings[0]?.id || null,
    trackCode: group.trackCode || group.key,
    eventType: "checked_in",
    title: "Checked In",
    message: `${group.guestName || "Guest"} was marked as checked in.`,
    audience: "owner_admin",
    metadata: { guestName: group.guestName || "Guest" },
  });
  await insertBookingSystemUpdate(
    "booking_checked_in",
    "Checked In",
    group,
    `${group.trackCode || "Booking"} · ${group.guestName || "Guest"} checked in.`,
  );
  return true;
}

async function performGroupHold(groupKey, note = "", bookingStatus = "Hold") {
  const group = getBookingGroupByKey(groupKey);
  if (!group) throw new Error("Booking group not found.");
  const holdNote = note || "Customer did not arrive. Booking moved to hold.";
  const mergedNotes = mergeNotesAndServices(holdNote, getGroupServices(group.bookings));
  await updateGroupLifecycle(groupKey, {
    lifecycleStatus: "hold",
    status: bookingStatus,
    notes: mergedNotes,
  });
  await insertNotification({
    bookingId: group.bookings[0]?.id || null,
    trackCode: group.trackCode || group.key,
    eventType: "hold",
    title: "Hold Booking",
    message: `${group.guestName || "Guest"} was moved to hold.`,
    audience: "owner_admin",
    metadata: { guestName: group.guestName || "Guest" },
  });
  await insertBookingSystemUpdate(
    "booking_hold",
    "Hold Booking",
    group,
    `${group.trackCode || "Booking"} · ${group.guestName || "Guest"} moved to hold.`,
    { note: holdNote },
  );
}

async function performGroupReactivate(groupKey) {
  const group = getBookingGroupByKey(groupKey);
  if (!group) throw new Error("Booking group not found.");
  const confirmed = window.confirm(`Reactivate ${group.trackCode || "this booking"} and open the edit panel?`);
  if (!confirmed) return false;
  const nextCheckIn = group.checkIn || formatDateKey(new Date());
  const nextCheckOut = group.checkOut || formatDateKey(addDays(parseDate(nextCheckIn), Math.max(1, getNightCount(group.checkIn, group.checkOut))));
  const reactivationMode = "edit_panel";
  await updateGroupLifecycle(groupKey, {
    lifecycleStatus: "booked",
    status: "Campaign",
    checkIn: nextCheckIn,
    checkOut: nextCheckOut,
    checkedInAt: null,
    checkedOutAt: null,
    closeDetails: null,
  });
  await insertNotification({
    bookingId: group.bookings[0]?.id || null,
    trackCode: group.trackCode || group.key,
    eventType: "reactivated",
    title: "Booking Reactivated",
    message: `${group.guestName || "Guest"} was moved back to active booking state for ${nextCheckIn} -> ${nextCheckOut}.`,
    audience: "owner_admin",
    metadata: { guestName: group.guestName || "Guest", checkIn: nextCheckIn, checkOut: nextCheckOut, reactivationMode },
  });
  await insertBookingSystemUpdate(
    "booking_reactivated",
    "Booking Reactivated",
    group,
    `${group.trackCode || "Booking"} reactivated · ${nextCheckIn} -> ${nextCheckOut}.`,
    { checkIn: nextCheckIn, checkOut: nextCheckOut, reactivationMode },
  );
  return {
    trackCode: group.trackCode || group.key,
    bookingId: group.bookings[0]?.id || null,
  };
}

async function performGroupFreshBooking(groupKey) {
  const group = getBookingGroupByKey(groupKey);
  if (!group) throw new Error("Booking group not found.");
  const confirmed = window.confirm(`Reset ${group.trackCode || "this booking"} back to fresh booking state?`);
  if (!confirmed) return false;
  await updateGroupLifecycle(groupKey, {
    lifecycleStatus: "booked",
    checkedInAt: null,
    checkedOutAt: null,
    closeDetails: {},
  });
  await insertNotification({
    bookingId: group.bookings[0]?.id || null,
    trackCode: group.trackCode || group.key,
    eventType: "fresh_booking",
    title: "Fresh Booking",
    message: `${group.guestName || "Guest"} was reset back to fresh booking state.`,
    audience: "owner_admin",
    metadata: { guestName: group.guestName || "Guest" },
  });
  await insertBookingSystemUpdate(
    "booking_fresh_booking",
    "Fresh Booking",
    group,
    `${group.trackCode || "Booking"} reset back to fresh booking state.`,
  );
  return true;
}

async function performGroupDeleteFlow(groupKey) {
  const group = getBookingGroupByKey(groupKey);
  if (!group) throw new Error("Booking group not found.");
  const lifecycleStatus = getGroupLifecycleStatus(group);
  const hasPayment = Number(getAdvancePaymentInfo(group.bookings).amount || 0) > 0 || Number(getGroupCustomPriceTotal(group.bookings) || 0) > 0;
  const allowUserDirectBookedDelete = !canManageBookings() && lifecycleStatus === "booked";
  if (canEditBookingGroupDirect(group) || canManageBookings() || allowUserDirectBookedDelete) {
    if (!hasPayment) {
      return performGroupPermanentRemove(groupKey, "Delete this booking?");
    }
    if (!canManageBookings()) {
      if (!window.confirm("Advance payment found. This booking cannot be deleted and will move to Hold Room. Continue?")) return false;
      await performGroupHold(groupKey, "Advance payment received. Booking moved to hold instead of deleting.", "Hold");
      return true;
    }
    const refundPayment = window.confirm("Payments found. Press OK to refund and delete. Press Cancel to move this booking to hold without refund.");
    if (refundPayment) {
      return performGroupPermanentRemove(groupKey, "Delete this booking and refund the payment?");
    }
    await performGroupHold(groupKey, "Customer requested cancellation, but payment is not being refunded.", "Removed Booking");
    return true;
  }

  if (!hasPayment) {
    await insertChangeRequest({
      bookingId: group.bookings[0].id,
      reason: "delete_booking",
      requestScope: "group",
      requestNote: "Customer requested booking deletion.",
    });
    return true;
  }

  const refundPayment = window.confirm("Payments found. Press OK to request refund and delete. Press Cancel to request deletion without refund.");
  await insertChangeRequest({
    bookingId: group.bookings[0].id,
    reason: "delete_booking",
    requestScope: "group",
    requestNote: refundPayment
      ? "Customer requested cancellation and refund."
      : "Customer requested cancellation without refund.",
  });
  return true;
}

async function performGroupPermanentRemove(groupKey, confirmMessage = "Delete this booking?") {
  const group = getBookingGroupByKey(groupKey);
  if (!group) throw new Error("Booking group not found.");
  if (!window.confirm(confirmMessage)) return false;
  await updateGroupLifecycle(groupKey, { lifecycleStatus: "booked" });
  for (const booking of group.bookings) {
    await updateBooking(booking.id, { status: "Cancelled" });
  }
  return true;
}

async function performGroupCheckOut(groupKey) {
  const group = getBookingGroupByKey(groupKey);
  if (!group) throw new Error("Booking group not found.");
  const services = getGroupServices(group.bookings);
  const serviceRows = services.map((service) => {
    const existing = getServicePricingRows(group.bookings).find((row) => row.service === service);
    const input = window.prompt(`Enter price for ${service}. Leave empty or 0 if not charged.`, existing?.amount ? String(existing.amount) : "");
    return {
      service,
      amount: roundCurrency(Number(input || 0)),
    };
  });
  const additionalServicesInput = window.prompt("Additional services to add before check out? Use comma-separated names or leave empty.", "");
  const additionalServices = String(additionalServicesInput || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  for (const service of additionalServices) {
    const amountInput = window.prompt(`Enter price for ${service}. Leave empty or 0 if not charged.`, "");
    serviceRows.push({
      service,
      amount: roundCurrency(Number(amountInput || 0)),
    });
  }
  const uniqueServices = Array.from(new Set([...services, ...additionalServices]));
  const mergedCustomPayments = mergeServicePricesIntoCustomPayments(group.bookings, serviceRows);
  const notesValue = mergeNotesAndServices(
    parseBookingNotes(group.bookings[0]?.notes || "").otherNotes.join(" | "),
    uniqueServices,
  );
  await updateGroupLifecycle(groupKey, {
    lifecycleStatus: "checked_out",
    checkedOutAt: new Date().toISOString(),
    customPayments: mergedCustomPayments,
    notes: notesValue,
    closeDetails: buildCloseDetailsPayload(group, serviceRows),
  });
  await insertNotification({
    bookingId: group.bookings[0]?.id || null,
    trackCode: group.trackCode || group.key,
    eventType: "checked_out",
    title: "Checked Out",
    message: `${group.guestName || "Guest"} was marked as checked out.`,
    audience: "owner_admin",
    metadata: { guestName: group.guestName || "Guest" },
  });
  await insertBookingSystemUpdate(
    "booking_checked_out",
    "Checked Out",
    group,
    `${group.trackCode || "Booking"} · ${group.guestName || "Guest"} checked out.`,
    { serviceCount: uniqueServices.length },
  );
  return true;
}

function isPendingRoomRemovalRequest(request, bookingId) {
  if (!request || request.status !== "pending" || request.reason !== "remove_rooms") return false;
  return Array.isArray(request.requestedRemoveRooms)
    && request.requestedRemoveRooms.some((room) => String(room.bookingId) === String(bookingId));
}

function isPendingGroupRemovalRequest(request) {
  if (!request || request.status !== "pending") return false;
  return request.reason === "delete_booking" || (request.reason === "remove_rooms" && request.requestedScope === "group");
}

function preselectRemoveRoomIds(bookingIds) {
  if (!requestRemoveRooms) return;
  const bookingIdSet = new Set((bookingIds || []).map(String));
  requestRemoveRooms.querySelectorAll("[data-remove-booking-id]").forEach((checkbox) => {
    const key = String(checkbox.dataset.removeBookingId);
    const shouldCheck = bookingIdSet.has(key);
    checkbox.checked = shouldCheck;
    if (shouldCheck) {
      state.modalRemoveRooms.set(key, {
        bookingId: checkbox.dataset.removeBookingId,
        roomType: checkbox.dataset.roomType,
        roomNumber: Number(checkbox.dataset.roomNumber),
      });
    } else {
      state.modalRemoveRooms.delete(key);
    }
  });
}

async function launchBookingAction(bookingId, { scope = "single", reason = "change_date", removeBookingIds = [], mode } = {}) {
  await openRequestModal(bookingId, mode || (canManageBookings() ? "edit" : "request"), scope);
  requestReasonInput.value = reason;
  syncModalReasonDefaults();
  if (reason === "remove_rooms") {
    preselectRemoveRoomIds(removeBookingIds.length ? removeBookingIds : [bookingId]);
  }
}

function openBookingDetailsModal(groupKey) {
  const group = getBookingGroupByKey(groupKey);
  if (!group) {
    showToast("Booking details not found.", true);
    return;
  }
  const requestCollections = getLatestRequestCollections();
  const pendingCollections = getLatestPendingRequestCollections();
  const requestHistory = getRequestsForTrack(group.trackCode || group.key);
  const groupRequest = pendingCollections.byTrack.get(group.trackCode || group.key);
  const lifecycleStatus = getGroupLifecycleStatus(group);
  const lifecycleLabel = getLifecycleStatusLabel(lifecycleStatus);
  const directEditAllowed = canEditBookingGroupDirect(group);
  const displayTrackCode = getGroupDisplayTrackCode(group);
  bookingDetailsTitle.textContent = `${displayTrackCode ? `${displayTrackCode} · ` : ""}${group.guestName || "Guest"}`;
  const advanceInfo = getAdvancePaymentInfo(group.bookings);
  const customPriceItems = getGroupCustomPriceEntries(group.bookings);
  const customPriceTotal = getGroupCustomPriceTotal(group.bookings);
  const balanceAmount = getBookingBalanceAmount(group);
  const groupServices = getGroupServices(group.bookings);
  const servicePricingMarkup = getServicePricingMarkup(group.bookings, {
    editable: lifecycleStatus === "checked_in",
    groupKey: group.key,
  });
  const roomRows = group.bookings
    .map((booking) => {
      const bookingRequest = pendingCollections.byBooking.get(booking.id);
      const roomGroup = normalizeRoomGroup(booking.roomType);
      const noteMeta = parseBookingNotes(booking.notes);
      const metaBits = [
        booking.roomTypeLabel || getRoomTypeDisplay(booking.roomType),
        `${booking.guests} guests`,
        `${booking.checkIn} -> ${booking.checkOut}`,
        formatMoney(booking.roomTotal || 0),
      ];
      if (noteMeta.extraGuests) metaBits.push(`Extra pax / kids: ${noteMeta.extraGuests}`);
      if (noteMeta.drivers) metaBits.push(`Drivers: ${noteMeta.drivers}`);
      const removeControl = isPendingRoomRemovalRequest(bookingRequest, booking.id)
        ? `<span class="booking-tag tag-pending">Pending Remove</span>`
        : (directEditAllowed || canManageBookings())
          ? `<button class="action-btn subtle-btn" type="button" data-booking-remove="${booking.id}">Remove</button>`
          : "";
      return `
        <div class="booking-room-row booking-details-room-row">
          <div class="booking-room-row-main">
            <div class="booking-room-row-title">${getRoomLabel(roomGroup, booking.roomNumber)} (#${booking.roomNumber})</div>
            <div class="booking-room-row-meta">${metaBits.join(" · ")}</div>
            ${bookingRequest ? `<div class="booking-room-row-request">${getRequestStatusMarkup(bookingRequest, "Request")}</div>` : `<div class="booking-room-row-request">${getActiveStatusMarkup("Active")}</div>`}
            ${noteMeta.otherNotes.length ? `<div class="booking-room-row-notes"><span class="booking-room-row-label">Notes</span><div>${noteMeta.otherNotes.join(" | ")}</div></div>` : ""}
          </div>
          <div class="booking-room-row-actions">
            ${removeControl}
            ${(directEditAllowed || canManageBookings()) ? `
              <button class="action-btn action-btn-icon action-btn-icon-edit" type="button" data-booking-detail-action="edit" data-booking-id="${booking.id}">
                Update
              </button>
            ` : ""}
          </div>
        </div>
      `;
    })
    .join("");

  const requestHistoryMarkup = requestHistory.length
    ? `
      <div class="booking-details-history-panel">
        <div class="booking-details-panel-title">Request History</div>
        <div class="booking-history-list">
          ${requestHistory.map((request) => `
            <div class="booking-history-item">
              <div class="booking-history-head">
                ${getRequestStatusMarkup(request)}
                <span class="booking-history-date">${getRequestRequestedDate(request) || "-"}</span>
              </div>
              <div class="booking-history-meta">${formatRequestReason(request.reason)}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `
    : "";

  const statusLabel = getBookingStatusLabel(group.statuses.size === 1 ? Array.from(group.statuses)[0] : "Mixed");
  const statusNote = group.statuses.size === 1 ? getBookingStatusNote(Array.from(group.statuses)[0]) : "";

  bookingDetailsBody.innerHTML = `
    <div class="booking-meta booking-meta-compact booking-details-summary">
      <div><strong>Track Code:</strong> ${displayTrackCode || "-"}</div>
      <div><strong>Phone:</strong> <a href="tel:${group.phone || ""}">${group.phone || "-"}</a></div>
      <div><strong>Booked by:</strong> ${group.bookings[0]?.createdByName || "-"}</div>
      <div><strong>Rooms:</strong> ${group.bookings.length}</div>
      <div><strong>Guests:</strong> ${group.totalGuests}</div>
      <div><strong>Dates:</strong> ${group.checkIn} -> ${group.checkOut}</div>
      <div><strong>Status:</strong> ${statusLabel}</div>
      ${statusNote ? `<div><strong>Status Note:</strong> ${statusNote}</div>` : ""}
      <div><strong>Lifecycle:</strong> ${lifecycleLabel}</div>
      <div><strong>Checked In At:</strong> ${group.bookings[0]?.checkedInAt ? new Date(group.bookings[0].checkedInAt).toLocaleString("en-GB") : "-"}</div>
      <div><strong>Checked Out At:</strong> ${group.bookings[0]?.checkedOutAt ? new Date(group.bookings[0].checkedOutAt).toLocaleString("en-GB") : "-"}</div>
      <div><strong>Stayed Hours:</strong> ${getBookingStayedHours(group)}</div>
      <div><strong>Custom Price:</strong> ${formatMoney(customPriceTotal)}</div>
      <div><strong>Advance:</strong> ${advanceInfo.label}</div>
      <div><strong>Advance Amount:</strong> ${formatMoney(advanceInfo.amount || 0)}</div>
      <div><strong>Balance:</strong> ${formatMoney(balanceAmount)}</div>
      <div><strong>Total Price:</strong> ${formatMoney(group.totalPrice || 0)}</div>
    </div>
    ${groupRequest ? `<div class="booking-details-request-banner">${getRequestStatusMarkup(groupRequest, "Latest request")}<span class="booking-history-meta">${formatRequestReason(groupRequest.reason)} · ${getRequestRequestedDate(groupRequest) || "-"}</span></div>` : `<div class="booking-details-request-banner">${getLifecycleBadgeMarkup(group)}<span class="booking-history-meta">No pending request.</span></div>`}
    ${customPriceItems.length ? `<div class="booking-details-services-panel"><div class="booking-details-panel-title">Custom Price</div>${getCustomPriceListMarkup(customPriceItems)}</div>` : ""}
    ${groupServices.length ? `<div class="booking-details-services-panel"><div class="booking-details-panel-title">Services</div>${renderServiceChips(groupServices)}</div>` : ""}
    <div class="booking-details-services-panel"><div class="booking-details-panel-title">Service Prices</div>${servicePricingMarkup}</div>
    ${lifecycleStatus === "checked_in" ? `
      <div class="booking-details-services-panel booking-details-service-manage-panel" data-booking-service-manage-panel>
        <div class="booking-details-panel-title">Add Services</div>
        <p class="inline-note">Tap a service to add it and enter the price immediately. You can also add custom services and custom charges here.</p>
        ${renderGroupServiceToggleButtons(group)}
        <div class="booking-details-service-manage-actions">
          <button class="action-btn" type="button" data-booking-group-action="custom-service">Custom Service</button>
          <button class="action-btn" type="button" data-booking-group-action="custom-price">Add Custom Price</button>
        </div>
      </div>
    ` : ""}
    ${requestHistoryMarkup}
    <div class="booking-details-actions">
      ${canUpdateBookingAdvance(group) ? `<button class="action-btn action-btn-icon action-btn-icon-advance" type="button" data-booking-group-action="advance">Update Advance</button>` : ""}
      <button class="action-btn action-btn-icon action-btn-icon-whatsapp" type="button" data-booking-group-action="whatsapp">WhatsApp</button>
      <button class="action-btn" type="button" data-booking-group-action="email">Email Slip</button>
      <button class="action-btn action-btn-icon action-btn-icon-pdf" type="button" data-booking-group-action="pdf">Export PDF</button>
      ${(directEditAllowed || canManageBookings()) ? `<button class="primary-btn" type="button" data-booking-group-action="manage">Edit Booking</button>` : ""}
      ${(directEditAllowed || canManageBookings()) ? `<button class="action-btn" type="button" data-booking-group-action="add-room">Add Room</button>` : ""}
      ${lifecycleStatus === "checked_in" ? `<button class="action-btn" type="button" data-booking-group-action="services">Add Services</button>` : ""}
      ${lifecycleStatus === "booked" ? `<button class="primary-btn" type="button" data-booking-group-action="checkin">Check In</button>` : ""}
      ${lifecycleStatus === "checked_in" ? `<button class="primary-btn" type="button" data-booking-group-action="checkout">Check Out</button>` : ""}
      ${(isOwnerOrAdminRole() && ["checked_in", "checked_out"].includes(lifecycleStatus)) ? `<button class="action-btn" type="button" data-booking-group-action="fresh-booking">Fresh Booking</button>` : ""}
      ${lifecycleStatus === "hold" ? `${getLifecycleBadgeMarkup(group)}` : ""}
      ${lifecycleStatus === "checked_out" ? `<span class="booking-tag tag-rejected">Checked Out</span>` : ""}
      ${lifecycleStatus === "hold" && getEffectiveProfile()?.role === "owner" ? `<button class="action-btn action-btn-icon action-btn-icon-reactivate" type="button" data-booking-group-action="reactivate">Reactivate</button>` : ""}
      ${lifecycleStatus === "booked" ? `<button class="action-btn" type="button" data-booking-group-action="hold">Hold Room</button>` : ""}
      ${(!canManageBookings() && lifecycleStatus === "checked_in") ? `<button class="action-btn" type="button" data-booking-group-action="request-hold">Request Hold</button>` : ""}
      ${(canManageBookings() || (["booked", "checked_in"].includes(lifecycleStatus))) && isPendingGroupRemovalRequest(groupRequest)
        ? `<span class="booking-tag tag-pending">Pending Remove</span>`
        : canManageBookings()
          ? `<button class="action-btn subtle-btn" type="button" data-booking-group-action="remove">Remove Full Booking</button>`
          : lifecycleStatus === "booked"
            ? `<button class="action-btn subtle-btn" type="button" data-booking-group-action="remove">Delete Booking</button>`
          : lifecycleStatus === "checked_in"
            ? `<button class="action-btn subtle-btn" type="button" data-booking-group-action="remove">Request Delete Booking</button>`
          : ""}
    </div>
    <div class="booking-room-list booking-details-room-list">${roomRows}</div>
  `;

  const manageBtn = bookingDetailsBody.querySelector('[data-booking-group-action="manage"]');
  if (manageBtn) {
    manageBtn.addEventListener('click', async () => {
      try {
        closeBookingDetailsModal();
        await openRequestModal(group.bookings[0].id, (directEditAllowed || canManageBookings()) ? "edit" : "request", "group");
      } catch (error) {
        showToast(error.message || "Unable to open full booking editor.", true);
      }
    });
  }
  const addRoomBtn = bookingDetailsBody.querySelector('[data-booking-group-action="add-room"]');
  if (addRoomBtn) {
    addRoomBtn.addEventListener("click", async () => {
      try {
        closeBookingDetailsModal();
        await openRequestModal(group.bookings[0].id, (directEditAllowed || canManageBookings()) ? "edit" : "request", "group");
        requestReasonInput.value = "additional_rooms";
        syncModalReasonDefaults();
      } catch (error) {
        showToast(error.message || "Unable to open additional room editor.", true);
      }
    });
  }
  const removeGroupBtn = bookingDetailsBody.querySelector('[data-booking-group-action="remove"]');
  if (removeGroupBtn) {
    removeGroupBtn.addEventListener("click", async () => {
      try {
        const changed = await performGroupDeleteFlow(group.key);
        if (!changed) return;
        closeBookingDetailsModal();
        showToast("Booking action completed.");
        await refreshLiveViews();
        await loadRequests();
      } catch (error) {
        showToast(error.message, true);
      }
    });
  }
  const pdfBtn = bookingDetailsBody.querySelector('[data-booking-group-action="pdf"]');
  if (pdfBtn) {
    pdfBtn.addEventListener("click", () => {
      exportBookingGroupPdf(group.key);
    });
  }
  const whatsappBtn = bookingDetailsBody.querySelector('[data-booking-group-action="whatsapp"]');
  if (whatsappBtn) {
    whatsappBtn.addEventListener("click", () => {
      openReservationWhatsapp(group.key);
    });
  }
  const emailBtn = bookingDetailsBody.querySelector('[data-booking-group-action="email"]');
  if (emailBtn) {
    emailBtn.addEventListener("click", () => {
      openReservationEmail(group.key);
    });
  }
  const advanceBtn = bookingDetailsBody.querySelector('[data-booking-group-action="advance"]');
  if (advanceBtn) {
    advanceBtn.addEventListener("click", async () => {
      try {
        const changed = await promptGroupPaymentUpdate(group.key);
        if (!changed) return;
        showToast("Advance payment updated.");
        await refreshLiveViews();
        openBookingDetailsModal(group.key);
      } catch (error) {
        showToast(error.message || "Unable to update advance payment.", true);
      }
    });
  }
  const servicesBtn = bookingDetailsBody.querySelector('[data-booking-group-action="services"]');
  if (servicesBtn) {
    servicesBtn.addEventListener("click", () => {
      const servicePanel = bookingDetailsBody.querySelector("[data-booking-service-manage-panel]");
      if (!servicePanel) return;
      servicePanel.scrollIntoView({ behavior: "smooth", block: "center" });
      servicePanel.classList.add("booking-details-service-manage-panel-focus");
      window.setTimeout(() => {
        servicePanel.classList.remove("booking-details-service-manage-panel-focus");
      }, 1200);
    });
  }
  const customPriceBtn = bookingDetailsBody.querySelector('[data-booking-group-action="custom-price"]');
  if (customPriceBtn) {
    customPriceBtn.addEventListener("click", async () => {
      try {
        const changed = await promptGroupCustomPriceAdd(group.key);
        if (!changed) return;
        showToast("Custom price added.");
        await refreshLiveViews();
        openBookingDetailsModal(group.key);
      } catch (error) {
        showToast(error.message || "Unable to add custom price.", true);
      }
    });
  }
  const customServiceBtn = bookingDetailsBody.querySelector('[data-booking-group-action="custom-service"]');
  if (customServiceBtn) {
    customServiceBtn.addEventListener("click", async () => {
      try {
        const changed = await promptGroupCustomServiceAdd(group.key);
        if (!changed) return;
        showToast("Custom service added.");
        await refreshLiveViews();
        openBookingDetailsModal(group.key);
      } catch (error) {
        showToast(error.message || "Unable to add custom service.", true);
      }
    });
  }
  const checkInBtn = bookingDetailsBody.querySelector('[data-booking-group-action="checkin"]');
  if (checkInBtn) {
    checkInBtn.addEventListener("click", async () => {
      try {
        const changed = await performGroupCheckIn(group.key);
        if (!changed) return;
        showToast("Booking checked in.");
        await refreshLiveViews();
        openBookingDetailsModal(group.key);
      } catch (error) {
        showToast(error.message, true);
      }
    });
  }
  const checkOutBtn = bookingDetailsBody.querySelector('[data-booking-group-action="checkout"]');
  if (checkOutBtn) {
    checkOutBtn.addEventListener("click", async () => {
      try {
        const changed = await performGroupCheckOut(group.key);
        if (!changed) return;
        showToast("Booking checked out.");
        await refreshLiveViews();
        openBookingDetailsModal(group.key);
      } catch (error) {
        showToast(error.message, true);
      }
    });
  }
  const freshBookingBtn = bookingDetailsBody.querySelector('[data-booking-group-action="fresh-booking"]');
  if (freshBookingBtn) {
    freshBookingBtn.addEventListener("click", async () => {
      try {
        const changed = await performGroupFreshBooking(group.key);
        if (!changed) return;
        showToast("Booking reset to fresh state.");
        await refreshLiveViews();
        openBookingDetailsModal(group.key);
      } catch (error) {
        showToast(error.message, true);
      }
    });
  }
  bookingDetailsBody.querySelectorAll("[data-group-service-toggle]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await toggleGroupServiceDirect(button.dataset.groupServiceToggle, button.dataset.serviceName);
        await refreshLiveViews();
        openBookingDetailsModal(group.key);
      } catch (error) {
        showToast(error.message, true);
      }
    });
  });
  bookingDetailsBody.querySelectorAll("[data-booking-service-price-edit]").forEach((item) => {
    const runEdit = async () => {
      try {
        const changed = await updateGroupServicePrice(item.dataset.bookingServicePriceEdit, item.dataset.serviceName);
        if (!changed) return;
        showToast("Service price updated.");
        await refreshLiveViews();
        openBookingDetailsModal(group.key);
      } catch (error) {
        showToast(error.message, true);
      }
    };
    item.addEventListener("click", runEdit);
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        runEdit();
      }
    });
  });
  const holdBtn = bookingDetailsBody.querySelector('[data-booking-group-action="hold"]');
  if (holdBtn) {
    holdBtn.addEventListener("click", async () => {
      try {
        await performGroupHold(group.key);
        showToast("Booking moved to hold.");
        await refreshLiveViews();
        openBookingDetailsModal(group.key);
      } catch (error) {
        showToast(error.message, true);
      }
    });
  }
  const requestHoldBtn = bookingDetailsBody.querySelector('[data-booking-group-action="request-hold"]');
  if (requestHoldBtn) {
    requestHoldBtn.addEventListener("click", async () => {
      try {
        closeBookingDetailsModal();
        await launchBookingAction(group.bookings[0].id, {
          scope: "group",
          reason: "hold",
          mode: "request",
        });
      } catch (error) {
        showToast(error.message || "Unable to request hold.", true);
      }
    });
  }
  const reactivateBtn = bookingDetailsBody.querySelector('[data-booking-group-action="reactivate"]');
  if (reactivateBtn) {
    reactivateBtn.addEventListener("click", async () => {
      try {
        const result = await performGroupReactivate(group.key);
        if (!result) return;
        closeBookingDetailsModal();
        showToast("Booking reactivated.");
        await refreshLiveViews();
        if (result.bookingId) {
          await openRequestModal(result.bookingId, "edit", "group");
        }
      } catch (error) {
        showToast(error.message, true);
      }
    });
  }

  bookingDetailsBody.querySelectorAll("[data-booking-detail-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        closeBookingDetailsModal();
        await openRequestModal(button.dataset.bookingId, (directEditAllowed || canManageBookings()) ? "edit" : "request");
      } catch (error) {
        showToast(error.message || "Unable to open booking update.", true);
      }
    });
  });
  bookingDetailsBody.querySelectorAll("[data-booking-remove]").forEach((button) => {
    button.addEventListener("click", async () => {
      closeBookingDetailsModal();
      await launchBookingAction(button.dataset.bookingRemove, {
        scope: "single",
        reason: "remove_rooms",
        removeBookingIds: [button.dataset.bookingRemove],
      });
    });
  });
  bookingDetailsBody.querySelectorAll("[data-request-focus]").forEach((button) => {
    button.addEventListener("click", () => {
      closeBookingDetailsModal();
      setScreen("requests");
      state.requestsFilterStatus = "all";
      const request = state.requestMap.get(button.dataset.requestFocus);
      requestsTrackFilter.value = request?.booking?.trackCode || "";
      loadRequests();
    });
  });

  bookingDetailsModal.classList.remove("hidden");
}

function renderBookings(bookings) {
  bookingCards.innerHTML = "";
  state.bookingMap = new Map(bookings.map((booking) => [booking.id, booking]));
  const filteredBookings = bookings.filter((booking) => {
    if (state.bookingListFilter === "cancelled") return booking.status === "Cancelled";
    if (state.bookingListFilter === "active") return booking.status !== "Cancelled" && getBookingLifecycleStatus(booking) !== "hold";
    return true;
  });

  Object.entries(bookingFilterButtons).forEach(([key, button]) => {
    button.classList.toggle("filter-chip-active", state.bookingListFilter === key);
  });

  const requestCollections = getLatestRequestCollections();
  const pendingCollections = getLatestPendingRequestCollections();
  let groupedBookings = groupBookingsForDisplay(filteredBookings);
  if (state.bookingListFilter === "pending") {
    groupedBookings = groupedBookings.filter((group) => {
      const latestRequest = pendingCollections.byTrack.get(group.trackCode || group.key);
      return latestRequest?.status === "pending";
    });
  }

  if (!groupedBookings.length) {
    bookingEmpty.textContent =
      state.bookingListFilter === "cancelled"
        ? "No cancelled bookings for this date."
        : state.bookingListFilter === "pending"
          ? "No pending-request bookings for this date."
          : state.bookingListFilter === "active"
            ? "No active bookings for this date."
            : "No bookings for this date.";
    bookingEmpty.style.display = "block";
    state.bookingGroups = new Map();
    return;
  }

  bookingEmpty.style.display = "none";
  state.bookingGroups = new Map(groupedBookings.map((group) => [group.key, group]));

  groupedBookings.forEach((group) => {
    const card = document.createElement("div");
    card.className = "booking-card booking-group-card";
    const groupStatus = group.statuses.size === 1 ? Array.from(group.statuses)[0] : "Mixed";
    const groupStatusLabel = getBookingStatusLabel(groupStatus);
    const groupStatusNote = getBookingStatusNote(groupStatus);
    const lifecycleStatus = getGroupLifecycleStatus(group);
    const lifecycleLabel = getLifecycleStatusLabel(lifecycleStatus);
    const directEditAllowed = canEditBookingGroupDirect(group);
    const checkInWindowStarted = hasCheckInWindowStarted(group);
    const advanceInfo = getAdvancePaymentInfo(group.bookings);
    const groupRequest = pendingCollections.byTrack.get(group.trackCode || group.key);
    const groupServices = getGroupServices(group.bookings);
    const roomRows = group.bookings
      .map((booking) => {
        const bookingRequest = pendingCollections.byBooking.get(booking.id);
        const roomGroup = normalizeRoomGroup(booking.roomType);
        const pricing = getBookingPricingSnapshot(booking);
        const stayNights = Math.max(1, getNightCount(booking.checkIn, booking.checkOut));
        const noteMeta = parseBookingNotes(booking.notes);
        const roomNotes = [];
        if (noteMeta.extraGuests) roomNotes.push(`Extra pax / kids: ${noteMeta.extraGuests}`);
        if (noteMeta.drivers) roomNotes.push(`Drivers: ${noteMeta.drivers}`);
        if (noteMeta.otherNotes.length) roomNotes.push(...noteMeta.otherNotes);
        const removeControl = isPendingRoomRemovalRequest(bookingRequest, booking.id)
          ? `<span class="booking-tag tag-pending">Pending Remove</span>`
          : (directEditAllowed || canManageBookings())
            ? `<button class="action-btn subtle-btn action-btn-icon action-btn-icon-remove compact-control" type="button" data-booking-remove="${booking.id}" aria-label="Remove Room" title="Remove Room"><span class="compact-label">Remove Room</span></button>`
            : "";
        return `
          <div class="booking-room-row">
            <div class="booking-room-row-main">
              <div class="booking-room-row-head">
                <div>
                  <div class="booking-room-row-title">${getRoomLabel(roomGroup, booking.roomNumber)} (#${booking.roomNumber})</div>
                  <div class="booking-room-row-subtitle">${booking.roomTypeLabel || getRoomTypeDisplay(booking.roomType)} · ${booking.guests} Pax · ${stayNights} Night${stayNights === 1 ? "" : "s"} · ${formatMoney(pricing.roomTotal)}</div>
                </div>
              </div>
              ${renderBookingRoomFacts(booking)}
              ${bookingRequest ? `<div class="booking-room-row-request">${getRequestStatusMarkup(bookingRequest, "Request")}</div>` : `<div class="booking-room-row-request">${getActiveStatusMarkup("Active")}</div>`}
              ${roomNotes.length ? `<div class="booking-room-row-notes"><span class="booking-room-row-label">Notes</span><div>${roomNotes.join(" | ")}</div></div>` : ""}
            </div>
            <div class="booking-room-row-actions booking-room-quick-actions">
              ${removeControl}
              <button class="action-btn action-btn-icon action-btn-icon-view compact-control" type="button" data-booking-updates="${group.key}" aria-label="View Updates" title="View Updates">
                <span class="compact-label">View Updates</span>
              </button>
              ${(directEditAllowed || canManageBookings()) ? `
                <button class="action-btn action-btn-icon action-btn-icon-price compact-control" type="button" data-booking-price-action="${booking.id}" aria-label="Change Price" title="Change Price">
                  <span class="compact-label">Change Price</span>
                </button>
              ` : ""}
              ${(directEditAllowed || canManageBookings()) ? `
                <button class="action-btn action-btn-icon action-btn-icon-edit compact-control" type="button" data-booking-action="edit" data-booking-id="${booking.id}" aria-label="Update" title="Update">
                  <span class="compact-label">Update</span>
                </button>
              ` : ""}
            </div>
          </div>
        `;
      })
      .join("");

    const requestButton = groupRequest
      ? getRequestStatusMarkup(groupRequest)
      : getActiveStatusMarkup("Active");
    const requestActions = canManageRequests() && groupRequest?.status === "pending"
      ? `
        <div class="booking-inline-request-actions">
          <button class="action-btn" type="button" data-booking-request-action="approve" data-request-id="${groupRequest.id}">Approve</button>
          <button class="action-btn danger" type="button" data-booking-request-action="reject" data-request-id="${groupRequest.id}">Reject</button>
        </div>
      `
      : "";
    const requestBrief = groupRequest
      ? `<button class="booking-request-brief" type="button" data-request-focus="${groupRequest.id}">${formatRequestReason(groupRequest.reason)} · ${getRequestRequestedDate(groupRequest) || "-"}</button>`
      : `<span class="booking-request-brief muted">No pending request.</span>`;

    const displayTrackCode = getGroupDisplayTrackCode(group);
    card.innerHTML = `
      <div class="booking-group-head booking-group-head-dense">
        <div>
          <h4>${displayTrackCode ? `${displayTrackCode} · ` : ""}${group.guestName || "Guest"}</h4>
          ${groupStatusNote ? `<div class="booking-status-note">${groupStatusNote}</div>` : ""}
          <div class="booking-group-summary">${renderBookingHeaderSummary(group)}</div>
        </div>
        <div class="booking-group-statuses booking-group-controls booking-group-controls-stack">
          ${requestButton}
          ${requestActions}
          <span class="booking-tag ${String(groupStatus || "").toLowerCase() === "pending" ? "tag-pending" : "tag-success"}">${groupStatusLabel}</span>
          <span class="booking-tag ${lifecycleStatus === "checked_out" ? "tag-rejected" : lifecycleStatus === "checked_in" ? "tag-success" : lifecycleStatus === "hold" ? "tag-pending" : "tag-success"}">${lifecycleLabel}</span>
          <div class="booking-quick-actions">
            ${canUpdateBookingAdvance(group) ? `
              <button class="secondary-btn action-btn-icon action-btn-icon-advance compact-control" type="button" data-booking-group-advance="${group.key}" aria-label="Update Advance" title="Update Advance">
                <span class="compact-label">Update Advance</span>
              </button>
            ` : ""}
            <button class="secondary-btn action-btn-icon action-btn-icon-whatsapp compact-control" type="button" data-booking-group-whatsapp="${group.key}" aria-label="WhatsApp" title="WhatsApp">
              <span class="compact-label">WhatsApp</span>
            </button>
            <button class="secondary-btn compact-control" type="button" data-booking-group-email="${group.key}" aria-label="Email Slip" title="Email Slip">
              <span class="compact-label">Email Slip</span>
            </button>
            <button class="secondary-btn action-btn-icon action-btn-icon-pdf compact-control" type="button" data-booking-group-pdf="${group.key}" aria-label="Export PDF" title="Export PDF">
              <span class="compact-label">Export PDF</span>
            </button>
            ${(directEditAllowed || canManageBookings()) ? `
              <button class="secondary-btn booking-type-trigger action-btn-icon action-btn-icon-edit compact-control" type="button" data-booking-group-manage="${group.bookings[0].id}" aria-label="Edit Booking" title="Edit Booking">
                <span class="compact-label">Edit Booking</span>
              </button>
            ` : ""}
            ${lifecycleStatus === "booked" ? `
              <button class="secondary-btn compact-control" type="button" data-booking-group-checkin="${group.key}" aria-label="Check In" title="Check In">
                <span class="compact-label">Check In</span>
              </button>
            ` : ""}
            ${lifecycleStatus === "checked_in" ? `
              <button class="secondary-btn compact-control" type="button" data-booking-group-checkout="${group.key}" aria-label="Check Out" title="Check Out">
                <span class="compact-label">Check Out</span>
              </button>
            ` : ""}
            ${(!canManageBookings() && lifecycleStatus === "checked_in") ? `
              <button class="secondary-btn compact-control" type="button" data-booking-group-request-hold="${group.bookings[0].id}" aria-label="Request Hold" title="Request Hold">
                <span class="compact-label">Req Hold</span>
              </button>
            ` : ""}
            ${lifecycleStatus === "booked" ? `
              <button class="secondary-btn compact-control" type="button" data-booking-group-hold="${group.key}" aria-label="Hold Room" title="Hold Room">
                <span class="compact-label">Hold Room</span>
              </button>
            ` : ""}
            ${canManageBookings() ? `
              <button class="secondary-btn remove-reservation-trigger action-btn-icon action-btn-icon-remove compact-control" type="button" data-booking-group-remove="${group.bookings[0].id}" aria-label="Remove Reservation" title="Remove Reservation">
                <span class="compact-label">Remove Reservation</span>
              </button>
            ` : lifecycleStatus === "booked" ? `
              <button class="secondary-btn remove-reservation-trigger action-btn-icon action-btn-icon-remove compact-control" type="button" data-booking-group-remove="${group.bookings[0].id}" aria-label="Delete Booking" title="Delete Booking">
                <span class="compact-label">Delete Booking</span>
              </button>
            ` : lifecycleStatus === "checked_in" ? `
              <button class="secondary-btn remove-reservation-trigger action-btn-icon action-btn-icon-remove compact-control" type="button" data-booking-group-remove="${group.bookings[0].id}" aria-label="Request Delete Booking" title="Request Delete Booking">
                <span class="compact-label">Request Delete</span>
              </button>
            ` : ""}
          </div>
        </div>
      </div>
      ${renderBookingGroupOverview(group, groupStatus)}
      <div class="booking-group-meta-row booking-group-meta-row-tight">
        <div class="booking-group-call">
          <a class="call-link" href="tel:${group.phone || ""}">Call ${group.guestName || "Guest"}</a>
        </div>
      </div>
      ${requestBrief}
      ${group.bookings.length ? `
        <div class="booking-room-row-services booking-group-services">
          <span class="booking-room-row-label">Services</span>
          ${lifecycleStatus === "checked_out" || lifecycleStatus === "hold" ? renderServiceChips(groupServices) : renderGroupServiceToggleButtons(group)}
        </div>
      ` : ""}
      <div class="booking-room-list">${roomRows}</div>
      ${(directEditAllowed || canManageBookings()) ? `
        <div class="booking-group-footer-actions">
          <button class="booking-add-room-btn" type="button" data-booking-group-add="${group.bookings[0].id}">+</button>
        </div>
      ` : ""}
    `;

    card.querySelectorAll("[data-booking-action]").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          await openRequestModal(button.dataset.bookingId, (directEditAllowed || canManageBookings()) ? "edit" : "request");
        } catch (error) {
          showToast(error.message || "Unable to open booking update.", true);
        }
      });
    });
    card.querySelectorAll("[data-booking-remove]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (!window.confirm((directEditAllowed || canManageBookings()) ? "Remove this room from the booking?" : "Send a request to remove this room?")) return;
        try {
          await launchBookingAction(button.dataset.bookingRemove, {
            scope: "single",
            reason: "remove_rooms",
            removeBookingIds: [button.dataset.bookingRemove],
            mode: (directEditAllowed || canManageBookings()) ? "edit" : "request",
          });
          showToast((directEditAllowed || canManageBookings()) ? "Room removal updated." : "Removal request submitted.");
          await refreshLiveViews();
          await loadRequests();
        } catch (error) {
          showToast(error.message, true);
        }
      });
    });
    card.querySelectorAll("[data-booking-price-action]").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          await launchBookingAction(button.dataset.bookingPriceAction, {
            scope: "single",
            reason: "change_room_price",
            mode: (directEditAllowed || canManageBookings()) ? "edit" : "request",
          });
        } catch (error) {
          showToast(error.message || "Unable to open room price change.", true);
        }
      });
    });
    card.querySelectorAll("[data-booking-updates]").forEach((button) => {
      button.addEventListener("click", () => {
        openBookingDetailsModal(button.dataset.bookingUpdates);
      });
    });
    card.querySelectorAll("[data-booking-group-checkin]").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          const changed = await performGroupCheckIn(button.dataset.bookingGroupCheckin);
          if (!changed) return;
          showToast("Booking checked in.");
          await refreshLiveViews();
        } catch (error) {
          showToast(error.message, true);
        }
      });
    });
    card.querySelectorAll("[data-booking-group-checkout]").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          const changed = await performGroupCheckOut(button.dataset.bookingGroupCheckout);
          if (!changed) return;
          showToast("Booking checked out.");
          await refreshLiveViews();
        } catch (error) {
          showToast(error.message, true);
        }
      });
    });
    card.querySelectorAll("[data-booking-group-hold]").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          await performGroupHold(button.dataset.bookingGroupHold);
          showToast("Booking moved to hold.");
          await refreshLiveViews();
        } catch (error) {
          showToast(error.message, true);
        }
      });
    });
    card.querySelectorAll("[data-booking-group-request-hold]").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          await launchBookingAction(button.dataset.bookingGroupRequestHold, {
            scope: "group",
            reason: "hold",
            mode: "request",
          });
        } catch (error) {
          showToast(error.message || "Unable to request hold.", true);
        }
      });
    });
    card.querySelectorAll("[data-group-service-toggle]").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          await toggleGroupServiceDirect(button.dataset.groupServiceToggle, button.dataset.serviceName);
          await refreshLiveViews();
        } catch (error) {
          showToast(error.message, true);
        }
      });
    });
    card.querySelectorAll("[data-booking-request-action]").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          button.disabled = true;
          if (button.dataset.bookingRequestAction === "approve") {
            await approveRequest(button.dataset.requestId);
            showToast("Request approved.");
          } else {
            await rejectRequest(button.dataset.requestId);
            showToast("Request rejected.");
          }
          await loadRequests();
          await refreshLiveViews();
        } catch (error) {
          showToast(error.message, true);
        } finally {
          button.disabled = false;
        }
      });
    });
    const bookingTypeBtn = card.querySelector("[data-booking-group-manage]");
    if (bookingTypeBtn) {
      bookingTypeBtn.addEventListener("click", async () => {
        try {
          await openRequestModal(bookingTypeBtn.dataset.bookingGroupManage, (directEditAllowed || canManageBookings()) ? "edit" : "request", "group");
        } catch (error) {
          showToast(error.message || "Unable to open booking editor.", true);
        }
      });
    }
    const exportPdfBtn = card.querySelector("[data-booking-group-pdf]");
    if (exportPdfBtn) {
      exportPdfBtn.addEventListener("click", () => {
        exportBookingGroupPdf(exportPdfBtn.dataset.bookingGroupPdf);
      });
    }
    const whatsappGroupBtn = card.querySelector("[data-booking-group-whatsapp]");
    if (whatsappGroupBtn) {
      whatsappGroupBtn.addEventListener("click", () => {
        openReservationWhatsapp(whatsappGroupBtn.dataset.bookingGroupWhatsapp);
      });
    }
    const emailGroupBtn = card.querySelector("[data-booking-group-email]");
    if (emailGroupBtn) {
      emailGroupBtn.addEventListener("click", () => {
        openReservationEmail(emailGroupBtn.dataset.bookingGroupEmail);
      });
    }
    const advanceGroupBtn = card.querySelector("[data-booking-group-advance]");
    if (advanceGroupBtn) {
      advanceGroupBtn.addEventListener("click", async () => {
        try {
          const changed = await promptGroupPaymentUpdate(advanceGroupBtn.dataset.bookingGroupAdvance);
          if (!changed) return;
          showToast("Advance payment updated.");
          await refreshLiveViews();
        } catch (error) {
          showToast(error.message || "Unable to update advance payment.", true);
        }
      });
    }
    const removeReservationBtn = card.querySelector("[data-booking-group-remove]");
    if (removeReservationBtn) {
      removeReservationBtn.addEventListener("click", async () => {
        try {
          const changed = await performGroupDeleteFlow(group.key);
          if (!changed) return;
          showToast("Booking action completed.");
          await loadRequests();
          await refreshLiveViews();
        } catch (error) {
          showToast(error.message, true);
        }
      });
    }
    const addRoomBtn = card.querySelector("[data-booking-group-add]");
    if (addRoomBtn) {
      addRoomBtn.addEventListener("click", async () => {
        await openRequestModal(addRoomBtn.dataset.bookingGroupAdd, (directEditAllowed || canManageBookings()) ? "edit" : "request", "group");
        requestReasonInput.value = "additional_rooms";
        syncModalReasonDefaults();
      });
    }
    card.querySelectorAll("[data-request-focus]").forEach((button) => {
      button.addEventListener("click", () => {
        setScreen("requests");
        state.requestsFilterStatus = "all";
        const request = state.requestMap.get(button.dataset.requestFocus);
        requestsTrackFilter.value = request?.booking?.trackCode || "";
        loadRequests();
      });
    });
    bookingCards.appendChild(card);
  });
}

async function fetchHoldBookings() {
  ensureSupabase();
  const { data, error } = await state.supabase
    .from(CONFIG.SUPABASE_TABLE)
    .select("*")
    .eq("lifecycle_status", "hold")
    .order("check_in", { ascending: true })
    .order("room_number", { ascending: true });
  if (error) throw new Error(error.message);
  return (data || []).map(mapBooking);
}

function renderHoldBookings(bookings) {
  if (!holdBookingCards || !holdBookingEmpty) return;
  holdBookingCards.innerHTML = "";
  const groupedBookings = groupBookingsForDisplay(bookings);
  if (!groupedBookings.length) {
    holdBookingEmpty.style.display = "block";
    return;
  }
  holdBookingEmpty.style.display = "none";
  groupedBookings.forEach((group) => {
    const card = document.createElement("div");
    card.className = "booking-card booking-group-card";
    const note = group.bookings.map((booking) => parseBookingNotes(booking.notes).otherNotes.join(" | ")).filter(Boolean).join(" | ");
    const statusBadge = getLifecycleBadgeMarkup(group);
    const hasPayment = Number(getAdvancePaymentInfo(group.bookings).amount || 0) > 0 || Number(getGroupCustomPriceTotal(group.bookings) || 0) > 0;
    card.innerHTML = `
      <div class="booking-group-head booking-group-head-dense">
        <div>
          <h4>${group.trackCode || "-"} · ${group.guestName || "Guest"}</h4>
          <div class="booking-group-summary">${renderBookingHeaderSummary(group)}</div>
        </div>
        <div class="booking-group-statuses booking-group-controls booking-group-controls-stack">
          ${statusBadge}
          <div class="booking-quick-actions">
            <button class="secondary-btn action-btn-icon action-btn-icon-view compact-control" type="button" data-hold-open="${group.key}" aria-label="Open Booking" title="Open Booking">
              <span class="compact-label">Open Booking</span>
            </button>
            ${!hasPayment ? `
              <button class="secondary-btn remove-reservation-trigger action-btn-icon action-btn-icon-remove compact-control" type="button" data-hold-remove="${group.key}" aria-label="Remove Booking" title="Remove Booking">
                <span class="compact-label">Remove</span>
              </button>
            ` : `<span class="booking-tag tag-pending">Advance Locked</span>`}
            ${getEffectiveProfile()?.role === "owner" ? `
              <button class="secondary-btn action-btn-icon action-btn-icon-reactivate compact-control" type="button" data-hold-reactivate="${group.key}" aria-label="Reactivate" title="Reactivate">
                <span class="compact-label">Reactivate</span>
              </button>
            ` : ""}
          </div>
        </div>
      </div>
      ${renderBookingGroupOverview(group, "Hold")}
      ${note ? `<div class="booking-request-brief">${escapeHtml(note)}</div>` : ""}
    `;
    card.querySelector('[data-hold-open]')?.addEventListener("click", () => {
      openBookingDetailsModal(group.key);
    });
    card.querySelector('[data-hold-remove]')?.addEventListener("click", async () => {
      try {
        const changed = await performGroupPermanentRemove(group.key, "Remove this hold booking completely?");
        if (!changed) return;
        showToast("Hold booking removed.");
        await refreshLiveViews();
      } catch (error) {
        showToast(error.message, true);
      }
    });
    card.querySelector('[data-hold-reactivate]')?.addEventListener("click", async () => {
      try {
        const result = await performGroupReactivate(group.key);
        if (!result) return;
        showToast("Booking reactivated.");
        await refreshLiveViews();
        if (result.bookingId) {
          await openRequestModal(result.bookingId, "edit", "group");
        }
      } catch (error) {
        showToast(error.message, true);
      }
    });
    holdBookingCards.appendChild(card);
  });
}

async function loadHoldBookings() {
  if (!state.currentProfile?.approved) return;
  try {
    const bookings = await fetchHoldBookings();
    mergeBookingsIntoStateMap(bookings);
    const grouped = groupBookingsForDisplay(bookings);
    grouped.forEach((group) => state.bookingGroups.set(group.key, group));
    renderHoldBookings(bookings);
  } catch (error) {
    if (holdBookingEmpty) {
      holdBookingEmpty.textContent = error.message;
      holdBookingEmpty.style.display = "block";
    }
  }
}

function getDefaultRequestStatus(reason, currentStatus) {
  if (reason === "cancel") return "Cancelled";
  if (reason === "hold") return "Pending";
  if (reason === "delete_booking") return "Cancelled";
  return currentStatus || "Campaign";
}

function closeRequestModal() {
  if (requestModal) requestModal.classList.add("hidden");
  if (requestForm) requestForm.reset();
  state.activeBooking = null;
  state.activeBookingGroup = [];
  state.modalExtraRooms = new Map();
  state.modalRemoveRooms = new Map();
  state.modalBookingRoomEdits = new Map();
  state.modalRequestedServices = new Set();
  state.modalCustomPayments = [];
  setHTML(requestExtraRooms, "");
  setHTML(requestServices, "");
  setHTML(requestRemoveRooms, "");
  setHTML(requestBookingRooms, "");
  setHTML(requestCustomPriceList, '<p class="inline-note">No custom price entries added.</p>');
  setText(requestCustomPriceTotal, `Total custom price: ${formatMoney(0)}`);
  setText(requestCurrentPrice, "Current price: -");
  setText(requestOfferPreview, `Final price: ${formatMoney(0)}`);
  setOfferSelection(requestOfferOptions, requestOfferCustomField, requestOfferCustomInput, 0);
  syncRequestAdvanceAmountField();
  state.modalMode = "request";
}

async function openRequestModal(bookingId, mode, scope = "single") {
  ensureRequestModalSections();
  const deleteBookingOption = requestReasonInput?.querySelector('option[value="delete_booking"]');
  if (deleteBookingOption) {
    deleteBookingOption.hidden = !canManageBookings();
    deleteBookingOption.disabled = !canManageBookings();
  }
  let booking = state.bookingMap.get(bookingId);
  if (!booking) {
    const fetched = await fetchBookingsByIds([bookingId]);
    if (fetched.length) {
      mergeBookingsIntoStateMap(fetched);
      [booking] = fetched;
    }
  }
  if (!booking) {
    showToast("Booking not found.", true);
    return;
  }

  let groupView = getBookingGroupByKey(getBookingGroupKey(booking));
  let groupBookings = groupView?.bookings || [];
  if (scope === "group" && booking.trackCode && groupBookings.length < 2) {
    const fetchedGroup = await fetchBookingsByTrackCode(booking.trackCode);
    if (fetchedGroup.length) {
      mergeBookingsIntoStateMap(fetchedGroup);
      groupBookings = fetchedGroup;
      booking = fetchedGroup.find((item) => String(item.id) === String(bookingId)) || booking;
    }
  }
  const editableGroup = groupView || { bookings: groupBookings.length ? groupBookings : [booking] };
  if (!canManageBookings() && mode === "edit") {
    if (!canEditBookingGroupDirect(editableGroup)) {
      showToast("This booking is locked after check-in time. Use Check In / Check Out or ask owner/admin access.", true);
      return;
    }
  }

  state.activeBooking = booking;
  state.activeBookingGroup = groupBookings.length ? groupBookings : [booking];
  groupBookings = state.activeBookingGroup.length ? state.activeBookingGroup : [booking];
  const advanceInfo = getAdvancePaymentInfo(groupBookings);
  const customPriceEntries = (scope === "group" ? getGroupCustomPriceEntries(groupBookings) : getBookingCustomPriceEntries(booking))
    .map((item) => ({ amount: item.amount, note: item.note }));
  const groupTotalPrice = groupView?.totalPrice || roundCurrency(
    groupBookings.reduce((sum, item) => sum + Number(item.roomTotal || 0), 0) + getCustomPaymentsTotal(customPriceEntries),
  );
  state.requestScope = scope;
  state.modalMode = mode;
  state.modalCustomPayments = customPriceEntries;
  const guestIdentity = splitGuestTitleAndName(booking.guestName || "");
  setValue(modalBookingId, booking.id);
  setValue(requestGuestTitleInput, guestIdentity.title || "");
  setValue(requestGuestNameInput, guestIdentity.name || booking.guestName || "");
  setValue(requestPhoneInput, booking.phone || "");
  setText(requestCurrentDates, `${booking.checkIn || "-"} -> ${booking.checkOut || "-"}`);
  setText(
    requestCurrentRoom,
    scope === "group"
      ? `${groupBookings.length} room(s) in reservation`
      : `${getRoomLabel(normalizeRoomGroup(booking.roomType), booking.roomNumber)} · ${booking.roomTypeLabel || getRoomTypeDisplay(booking.roomType)}`
  );
  setValue(requestCheckInInput, booking.checkIn || "");
  setValue(requestCheckOutInput, booking.checkOut || "");
  const selectedRoomType = normalizeRoomGroup(booking.roomType) || "normal";
  setValue(requestRoomTypeInput, selectedRoomType);
  populateRequestRoomNumbers(selectedRoomType, booking.roomNumber);
  populateRequestGuestsOptions(selectedRoomType, booking.guests || 1);
  setValue(requestStatusInput, booking.status || "Campaign");
  setText(requestCurrentPrice, scope === "group"
    ? `Current total: ${formatMoney(groupTotalPrice)}`
    : `Current pricing: ${formatBookingPriceBreakdown(booking)}`);
  setValue(requestWeekendRateInput, Number(booking.weekendRate || booking.weekdayRate || 0));
  setOfferSelection(requestOfferOptions, requestOfferCustomField, requestOfferCustomInput, Number(booking.offerPercentage || 0));
  if (requestAdvancePaidInput) requestAdvancePaidInput.checked = Boolean(advanceInfo.amount > 0 || advanceInfo.allPaid || advanceInfo.partiallyPaid);
  if (requestAdvanceAmountInput) requestAdvanceAmountInput.value = advanceInfo.amount ? String(roundCurrency(advanceInfo.amount)) : "";
  syncRequestAdvanceAmountField();
  renderRequestCustomPrices();
  setValue(requestNotesInput, booking.notes || "");
  setValue(requestMessageInput, "");
  setValue(requestReasonInput, scope === "group" ? "edit_booking_data" : "change_date");
  setText(modalTitle, scope === "group"
    ? (mode === "edit" ? "Edit Booking" : "Request Full Booking Change")
    : (mode === "edit" ? "Edit Booking" : "Request Booking Change"));
  setText(requestSubmitBtn, mode === "edit" ? "Save Booking" : "Submit Change Request");
  syncModalReasonDefaults();
  await renderAdditionalRoomOptions(booking);
  renderServiceRequestOptions(booking);
  renderRemoveRoomOptions(booking);
  renderBookingRoomEditors(booking);
  renderRequestOfferPreview();
  if (requestModal) requestModal.classList.remove("hidden");
}

function mapRequest(row) {
  return {
    id: row.id,
    bookingId: row.booking_id,
    requestedBy: row.requested_by,
    reason: row.reason,
    requestNote: row.request_note || "",
    requestedGuestName: row.requested_guest_name || "",
    requestedPhone: row.requested_phone || "",
    requestedCheckIn: row.requested_check_in || "",
    requestedCheckOut: row.requested_check_out || "",
    requestedRoomType: row.requested_room_type || "",
    requestedRoomTypeLabel: row.requested_room_type_label || "",
    requestedRoomNumber: Number(row.requested_room_number || 0),
    requestedGuests: Number(row.requested_guests || 0),
    requestedScope: row.requested_scope || "single",
    requestedExtraRooms: Array.isArray(row.requested_extra_rooms) ? row.requested_extra_rooms : [],
    requestedServices: Array.isArray(row.requested_services) ? row.requested_services : [],
    requestedRemoveRooms: Array.isArray(row.requested_remove_rooms) ? row.requested_remove_rooms : [],
    requestedBookingRooms: Array.isArray(row.requested_booking_rooms) ? row.requested_booking_rooms : [],
    requestedWeekendRate: row.requested_weekend_rate == null ? null : Number(row.requested_weekend_rate),
    requestedWeekdayRate: row.requested_weekday_rate == null ? null : Number(row.requested_weekday_rate),
    requestedOfferPercentage: row.requested_offer_percentage == null ? null : Number(row.requested_offer_percentage),
    requestedNotes: row.requested_notes || "",
    requestedBookingStatus: row.requested_booking_status || "",
    status: row.status,
    adminNote: row.admin_note || "",
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    createdAt: row.created_at,
    booking: row.bookings ? mapBooking(row.bookings) : null,
  };
}

function formatRequestReason(reason) {
  switch (reason) {
    case "cancel":
      return "Customer request to cancel";
    case "hold":
      return "Customer request to hold";
    case "change_date":
      return "Customer request to change date";
    case "edit_booking_data":
      return "Edit Booking";
    case "change_room_price":
      return "Request room price change";
    case "additional_rooms":
      return "Requesting additional rooms";
    case "additional_services":
      return "Requesting additional services";
    case "remove_rooms":
      return "Requesting room removal";
    case "delete_booking":
      return "Delete Booking";
    case "wrong_data":
      return "Wrong data";
    default:
      return reason || "-";
  }
}

function formatRequestScope(scope) {
  return scope === "group" ? "Full Booking" : "Single Room";
}

function formatRequestCreatedAt(createdAt) {
  if (!createdAt) return "-";
  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) return String(createdAt);
  return parsed.toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRequestStay(checkIn, checkOut) {
  if (checkIn && checkOut) return `${checkIn} -> ${checkOut}`;
  return checkIn || checkOut || "-";
}

function formatRequestRoomSummary(roomType, roomTypeLabel, roomNumber, guests) {
  const normalizedType = normalizeRoomGroup(roomType || "");
  const label = roomTypeLabel || getRoomTypeDisplay(normalizedType || roomType || "");
  const room = roomNumber ? getRoomLabel(normalizedType, Number(roomNumber)) : "";
  const pax = Number(guests || 0);
  return [label, room, pax ? `${pax} guest(s)` : ""].filter(Boolean).join(" · ") || "-";
}

function formatRequestList(items, emptyText = "None") {
  return items?.length
    ? items.map((item) => `<span class="request-list-pill">${item}</span>`).join("")
    : `<span class="muted">${emptyText}</span>`;
}

function getRequestRequesterName(request) {
  return state.profileMap.get(request.requestedBy)?.full_name
    || state.profileMap.get(request.requestedBy)?.username
    || (request.requestedBy === state.currentSession?.user?.id
      ? state.currentProfile?.full_name || state.currentProfile?.username || "-"
      : "Staff");
}

function getRequestChangeItems(request, booking) {
  const currentServices = parseBookingNotes(booking?.notes || "").services;
  const requestedServices = request.requestedServices?.length ? request.requestedServices : currentServices;
  const currentPricing = getBookingPricingSnapshot(booking || {});
  const requestedPricing = getRequestPriceSnapshot(request, booking);
  const items = [];

  if ((request.requestedCheckIn || booking?.checkIn || "") !== (booking?.checkIn || "")
    || (request.requestedCheckOut || booking?.checkOut || "") !== (booking?.checkOut || "")) {
    items.push("Dates");
  }
  if ((request.requestedBookingStatus || booking?.status || "") !== (booking?.status || "")) {
    items.push("Status");
  }
  if ((request.requestedPhone || booking?.phone || "") !== (booking?.phone || "")) {
    items.push("Phone");
  }
  if ((request.requestedGuestName || booking?.guestName || "") !== (booking?.guestName || "")) {
    items.push("Guest");
  }
  if ((request.requestedNotes || booking?.notes || "") !== (booking?.notes || "")) {
    items.push("Notes");
  }
  if (requestedServices.join("|") !== currentServices.join("|")) {
    items.push("Services");
  }
  if (
    currentPricing.baseRoomTotal !== requestedPricing.baseRoomTotal
    || currentPricing.offerPercentage !== requestedPricing.offerPercentage
    || currentPricing.roomTotal !== requestedPricing.roomTotal
  ) {
    items.push("Price");
  }
  if (
    (request.requestedRoomType || booking?.roomType || "") !== (booking?.roomType || "")
    || Number(request.requestedRoomNumber || booking?.roomNumber || 0) !== Number(booking?.roomNumber || 0)
    || Number(request.requestedGuests || booking?.guests || 0) !== Number(booking?.guests || 0)
  ) {
    items.push("Room");
  }
  if (request.requestedExtraRooms?.length) items.push("Additional rooms");
  if (request.requestedRemoveRooms?.length) items.push("Remove rooms");
  if (request.requestedBookingRooms?.length) items.push("Room plan");
  if (request.reason === "delete_booking") items.push("Delete booking");
  if (request.reason === "hold") items.push("Hold");
  if (request.reason === "cancel") items.push("Cancel");
  return Array.from(new Set(items));
}

function renderRequestStateRows(rows, variant) {
  return rows
    .map(
      (row) => `
        <div class="request-state-row ${row.changed ? `request-state-row-${variant}` : ""}">
          <span class="request-state-label">${row.label}</span>
          <span class="request-state-value">${row.value || "-"}</span>
        </div>
      `,
    )
    .join("");
}

function renderRequestedRoomPlan(request) {
  if (!request.requestedBookingRooms?.length) return "";
  return `
    <div class="request-extra-card">
      <div class="request-extra-title">Requested room plan</div>
      <div class="request-list-grid">
        ${request.requestedBookingRooms
          .map((room) => `
            <div class="request-list-item">
              <strong>${getRoomLabel(normalizeRoomGroup(room.roomType), Number(room.roomNumber))}</strong>
              <span>${getRoomTypeDisplay(room.roomType)} · ${Number(room.guests || 0) || 1} guest(s)</span>
              ${Array.isArray(room.services) && room.services.length ? renderServiceChips(room.services) : `<span class="muted">No service changes</span>`}
            </div>
          `)
          .join("")}
      </div>
    </div>
  `;
}

function renderExtraRoomList(request) {
  if (!request.requestedExtraRooms?.length) return "";
  return `
    <div class="request-extra-card">
      <div class="request-extra-title">Additional rooms</div>
      <div class="request-list-grid">
        ${request.requestedExtraRooms
          .map((room) => `
            <div class="request-list-item">
              <strong>${getRoomLabel(normalizeRoomGroup(room.roomType), Number(room.roomNumber))}</strong>
              <span>${getRoomTypeDisplay(room.roomType)}${Number(room.pax || 0) ? ` · ${Number(room.pax)} guest(s)` : ""}</span>
            </div>
          `)
          .join("")}
      </div>
    </div>
  `;
}

function renderRemovedRoomList(request) {
  if (!request.requestedRemoveRooms?.length) return "";
  return `
    <div class="request-extra-card">
      <div class="request-extra-title">Rooms to remove</div>
      <div class="request-list-inline">
        ${formatRequestList(
          request.requestedRemoveRooms.map((room) => getRoomLabel(normalizeRoomGroup(room.roomType), Number(room.roomNumber))),
        )}
      </div>
    </div>
  `;
}

async function fetchRequests() {
  ensureSupabase();
  let query = state.supabase
    .from(CONFIG.SUPABASE_REQUESTS_TABLE)
    .select(`*, bookings:${CONFIG.SUPABASE_TABLE}(*)`)
    .order("created_at", { ascending: false });

  if (!canManageRequests()) {
    query = query.eq("requested_by", state.currentSession.user.id);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data || []).map(mapRequest);
}

async function updateBooking(bookingId, values) {
  ensureSupabase();
  const currentBooking = state.bookingMap.get(bookingId) || {};
  const nextStatus = "status" in values ? values.status : currentBooking.status;
  const nextTrackCode = "trackCode" in values
    ? values.trackCode
    : await resolveBookingTrackCode([currentBooking], nextStatus, currentBooking.trackCode || "");
  const merged = {
    trackCode: nextTrackCode,
    guestName: "guestName" in values ? values.guestName : currentBooking.guestName,
    phone: "phone" in values ? values.phone : currentBooking.phone,
    checkIn: "checkIn" in values ? values.checkIn : currentBooking.checkIn,
    checkOut: "checkOut" in values ? values.checkOut : currentBooking.checkOut,
    guests: "guests" in values ? Number(values.guests) : Number(currentBooking.guests || 0),
    roomType: "roomType" in values ? values.roomType : currentBooking.roomType,
    roomTypeLabel: "roomTypeLabel" in values ? values.roomTypeLabel : currentBooking.roomTypeLabel,
    roomNumber: "roomNumber" in values ? Number(values.roomNumber) : Number(currentBooking.roomNumber || 0),
    acEnabled: "acEnabled" in values
      ? normalizeAcEnabled(values.roomType ?? currentBooking.roomType, values.acEnabled)
      : normalizeAcEnabled("roomType" in values ? values.roomType : currentBooking.roomType, currentBooking.acEnabled),
    notes: "notes" in values ? values.notes || "" : currentBooking.notes || "",
    status: "status" in values ? values.status : currentBooking.status,
    roomsNeeded: "roomsNeeded" in values ? Number(values.roomsNeeded) : Number(currentBooking.roomsNeeded || 1),
    weekendRate: "weekendRate" in values ? Number(values.weekendRate) : Number(currentBooking.weekendRate || 0),
    weekdayRate: "weekdayRate" in values
      ? Number(values.weekdayRate)
      : ("weekendRate" in values ? Number(values.weekendRate) : Number(currentBooking.weekdayRate || 0)),
    offerPercentage: "offerPercentage" in values ? Number(values.offerPercentage) : Number(currentBooking.offerPercentage || 0),
    advancePaid: "advancePaid" in values ? Boolean(values.advancePaid) : Boolean(currentBooking.advancePaid),
    advanceAmount: "advanceAmount" in values ? roundCurrency(Number(values.advanceAmount || 0)) : Number(currentBooking.advanceAmount || 0),
    customPayments: "customPayments" in values ? normalizeCustomPayments(values.customPayments) : normalizeCustomPayments(currentBooking.customPayments),
    lifecycleStatus: "lifecycleStatus" in values ? values.lifecycleStatus : (currentBooking.lifecycleStatus || "booked"),
    checkedInAt: "checkedInAt" in values ? values.checkedInAt : (currentBooking.checkedInAt || null),
    checkedOutAt: "checkedOutAt" in values ? values.checkedOutAt : (currentBooking.checkedOutAt || null),
    closeDetails: "closeDetails" in values ? (values.closeDetails || {}) : (currentBooking.closeDetails || {}),
  };

  const row = {
    track_code: merged.trackCode || null,
    guest_name: merged.guestName,
    phone: merged.phone,
    check_in: merged.checkIn,
    check_out: merged.checkOut,
    guests: merged.guests,
    room_type: merged.roomType,
    room_type_label: merged.roomTypeLabel,
    room_number: merged.roomNumber,
    ac_enabled: merged.acEnabled,
    rooms_needed: merged.roomsNeeded,
    notes: merged.notes,
    booking_status: merged.status,
    advance_paid: merged.advancePaid,
    advance_amount: merged.advanceAmount,
    custom_payments: merged.customPayments,
    lifecycle_status: merged.lifecycleStatus,
    checked_in_at: merged.checkedInAt,
    checked_out_at: merged.checkedOutAt,
    close_details: merged.closeDetails,
  };
  applyPricingToBookingRow(row, merged);

  let { error } = await state.supabase.from(CONFIG.SUPABASE_TABLE).update(row).eq("id", bookingId);
  if (error && shouldRetryWithoutPricingColumns(error.message)) {
    state.pricingSchemaReady = false;
    stripPricingColumns(row);
    ({ error } = await state.supabase.from(CONFIG.SUPABASE_TABLE).update(row).eq("id", bookingId));
  }
  if (error) throw new Error(error.message);
}

async function insertChangeRequest(payload) {
  ensureSupabase();
  const row = {
    booking_id: payload.bookingId,
    requested_by: state.currentSession.user.id,
    reason: payload.reason,
    request_note: payload.requestNote || "",
    requested_scope: payload.requestScope || "single",
    requested_guest_name: payload.guestName || null,
    requested_phone: payload.phone || null,
    requested_check_in: payload.checkIn || null,
    requested_check_out: payload.checkOut || null,
    requested_room_type: payload.roomType || null,
    requested_room_type_label: payload.roomTypeLabel || null,
    requested_room_number: payload.roomNumber ? Number(payload.roomNumber) : null,
    requested_guests: payload.guests ? Number(payload.guests) : null,
    requested_extra_rooms: payload.requestedExtraRooms || [],
    requested_services: payload.requestedServices || [],
    requested_remove_rooms: payload.requestedRemoveRooms || [],
    requested_booking_rooms: payload.requestedBookingRooms || [],
    requested_notes: payload.notes || null,
    requested_booking_status: payload.status || null,
    status: payload.requestStatusOverride || "pending",
    admin_note: payload.adminNote || "",
    reviewed_by: payload.reviewedBy || null,
    reviewed_at: payload.reviewedAt || null,
  };
  if (payload.reason === "change_room_price") {
    row.requested_weekend_rate = payload.requestedWeekendRate ?? payload.weekendRate ?? null;
    row.requested_weekday_rate = payload.requestedWeekdayRate ?? payload.weekdayRate ?? payload.requestedWeekendRate ?? payload.weekendRate ?? null;
    row.requested_offer_percentage = payload.requestedOfferPercentage ?? payload.offerPercentage ?? null;
  }
  let { error } = await state.supabase.from(CONFIG.SUPABASE_REQUESTS_TABLE).insert(row);
  if (error && shouldRetryWithoutRequestPricingColumns(error.message)) {
    if (payload.reason === "change_room_price") {
      throw new Error("Run the latest Supabase schema update before using room price changes.");
    }
    delete row.requested_weekend_rate;
    delete row.requested_weekday_rate;
    delete row.requested_offer_percentage;
    ({ error } = await state.supabase.from(CONFIG.SUPABASE_REQUESTS_TABLE).insert(row));
  }
  if (error) throw new Error(error.message);
}

async function updateRequestStatus(requestId, values) {
  ensureSupabase();
  const row = {};
  if ("status" in values) row.status = values.status;
  if ("adminNote" in values) row.admin_note = values.adminNote || "";
  row.reviewed_by = state.currentSession?.user?.id || null;
  row.reviewed_at = new Date().toISOString();

  const { error } = await state.supabase.from(CONFIG.SUPABASE_REQUESTS_TABLE).update(row).eq("id", requestId);
  if (error) throw new Error(error.message);
}

function getPendingRequestsForTargets({ trackCode = "", bookingIds = [] } = {}) {
  const normalizedTrackCode = String(trackCode || "").trim();
  const bookingIdSet = new Set(
    (Array.isArray(bookingIds) ? bookingIds : [])
      .map((id) => String(id || "").trim())
      .filter(Boolean),
  );

  return Array.from(state.requestMap.values()).filter((request) => {
    if (String(request.status || "").toLowerCase() !== "pending") return false;

    const requestTrackCode = String(request.booking?.trackCode || "").trim();
    if (normalizedTrackCode && requestTrackCode && requestTrackCode === normalizedTrackCode) {
      return true;
    }

    const requestBookingId = String(request.bookingId || "").trim();
    if (requestBookingId && bookingIdSet.has(requestBookingId)) {
      return true;
    }

    return request.reason === "remove_rooms"
      && Array.isArray(request.requestedRemoveRooms)
      && request.requestedRemoveRooms.some((room) => bookingIdSet.has(String(room.bookingId || "").trim()));
  });
}

async function resolvePendingRequestsForTargets({ trackCode = "", bookingIds = [], adminNote = "" } = {}) {
  const matchingRequests = getPendingRequestsForTargets({ trackCode, bookingIds });
  if (!matchingRequests.length) return 0;

  const reviewedAt = new Date().toISOString();
  const reviewedBy = state.currentSession?.user?.id || null;

  for (const request of matchingRequests) {
    await updateRequestStatus(request.id, { status: "approved", adminNote });
    state.requestMap.set(request.id, {
      ...request,
      status: "approved",
      adminNote,
      reviewedAt,
      reviewedBy,
    });
  }

  return matchingRequests.length;
}

async function finalizeRequestStatus(request, status, adminNote = "") {
  await updateRequestStatus(request.id, { status, adminNote });
  await insertNotification({
    bookingId: request.bookingId,
    trackCode: request.booking?.trackCode || "",
    requestId: request.id,
    eventType: status === "approved" ? "request_approved" : "request_rejected",
    title: status === "approved" ? "Request Approved" : "Request Rejected",
    message: `${request.requestedGuestName || request.booking?.guestName || "Guest"} request was ${status}.`,
    audience: "owner_admin",
    targetUserId: request.requestedBy || null,
    metadata: {
      guestName: request.requestedGuestName || request.booking?.guestName || "Guest",
      reason: request.reason,
      adminNote,
    },
  });
}

async function approveRequest(requestId) {
  const request = state.requestMap.get(requestId);
  if (!request) throw new Error("Request not found.");

  if (request.reason === "additional_rooms") {
    const extraRooms = Array.isArray(request.requestedExtraRooms) ? request.requestedExtraRooms : [];
    if (!extraRooms.length) {
      throw new Error("No additional rooms were selected.");
    }

    for (const roomConfig of extraRooms) {
      const roomType = roomConfig.roomType;
      const roomNumber = Number(roomConfig.roomNumber);
      const pax = Number(roomConfig.pax || getRoomDef(roomType)?.maxPax || request.booking?.guests || 1);
      await ensureBookingAvailabilityForUpdate("", {
        checkIn: request.requestedCheckIn || request.booking?.checkIn || "",
        checkOut: request.requestedCheckOut || request.booking?.checkOut || "",
        roomType,
        roomNumber,
        status: request.requestedBookingStatus || request.booking?.status || "Campaign",
      });

      await insertBooking({
        trackCode: request.booking?.trackCode || "",
        guestName: request.requestedGuestName || request.booking?.guestName || "",
        phone: request.requestedPhone || request.booking?.phone || "",
        checkIn: request.requestedCheckIn || request.booking?.checkIn || "",
        checkOut: request.requestedCheckOut || request.booking?.checkOut || "",
        guests: String(pax),
        roomType,
        roomTypeLabel: getRoomTypeLabelForGuests(roomType, pax, true),
        roomNumber,
        acEnabled: true,
        roomsNeeded: 1,
        notes: request.requestedNotes ?? request.booking?.notes ?? "",
        status: request.requestedBookingStatus || request.booking?.status || "Campaign",
        offerPercentage: request.requestedOfferPercentage ?? request.booking?.offerPercentage ?? 0,
        advancePaid: Boolean(request.booking?.advancePaid),
        advanceAmount: Number(request.booking?.advanceAmount || 0),
        customPayments: request.booking?.customPayments || [],
      });
    }

    await finalizeRequestStatus(request, "approved");
    return;
  }

  if (request.reason === "additional_services") {
    const groupTrackCode = request.booking?.trackCode || "";
    const groupBookings = groupTrackCode
      ? await fetchBookingsByTrackCode(groupTrackCode)
      : [];
    const targetBookings = request.requestedScope === "group"
      ? (groupBookings.length ? groupBookings : (request.booking ? [request.booking] : []))
      : (request.booking ? [request.booking] : []);
    const serviceNotes = mergeNotesAndServices(request.requestedNotes ?? request.booking?.notes ?? "", request.requestedServices || []);

    for (const bookingRow of targetBookings) {
      await updateBooking(bookingRow.id, {
        guestName: bookingRow.guestName,
        phone: bookingRow.phone,
        checkIn: bookingRow.checkIn,
        checkOut: bookingRow.checkOut,
        roomType: bookingRow.roomType,
        roomTypeLabel: bookingRow.roomTypeLabel,
        roomNumber: bookingRow.roomNumber,
        notes: serviceNotes,
        status: bookingRow.status,
      });
    }

    await finalizeRequestStatus(request, "approved");
    return;
  }

  if (request.reason === "remove_rooms") {
    const removeRooms = Array.isArray(request.requestedRemoveRooms) ? request.requestedRemoveRooms : [];
    if (!removeRooms.length) {
      throw new Error("No rooms were selected for removal.");
    }

    const fetchedBookings = await fetchBookingsByIds(removeRooms.map((room) => room.bookingId));
    const fetchedById = new Map(fetchedBookings.map((booking) => [String(booking.id), booking]));

    for (const roomConfig of removeRooms) {
      const bookingRow = fetchedById.get(String(roomConfig.bookingId))
        || state.bookingMap.get(roomConfig.bookingId)
        || (String(request.booking?.id || "") === String(roomConfig.bookingId) ? request.booking : null);
      if (!bookingRow) continue;
      await updateBooking(bookingRow.id, {
        guestName: bookingRow.guestName,
        phone: bookingRow.phone,
        checkIn: bookingRow.checkIn,
        checkOut: bookingRow.checkOut,
        roomType: bookingRow.roomType,
        roomTypeLabel: bookingRow.roomTypeLabel,
        roomNumber: bookingRow.roomNumber,
        notes: bookingRow.notes,
        status: "Cancelled",
      });
    }

    await finalizeRequestStatus(request, "approved");
    return;
  }

  if (request.reason === "change_room_price") {
    await updateBooking(request.bookingId, {
      guestName: request.booking?.guestName || "",
      phone: request.booking?.phone || "",
      checkIn: request.requestedCheckIn || request.booking?.checkIn || "",
      checkOut: request.requestedCheckOut || request.booking?.checkOut || "",
      guests: Number(request.requestedGuests || request.booking?.guests || 1),
      roomType: request.requestedRoomType || request.booking?.roomType || "",
      roomTypeLabel: request.requestedRoomTypeLabel || request.booking?.roomTypeLabel || "",
      roomNumber: request.requestedRoomNumber || request.booking?.roomNumber || 0,
      notes: request.requestedNotes ?? request.booking?.notes ?? "",
      status: request.requestedBookingStatus || request.booking?.status || "Campaign",
      weekendRate: request.requestedWeekendRate ?? request.booking?.weekendRate ?? 0,
      weekdayRate: request.requestedWeekdayRate ?? request.requestedWeekendRate ?? request.booking?.weekdayRate ?? request.booking?.weekendRate ?? 0,
      offerPercentage: request.requestedOfferPercentage ?? request.booking?.offerPercentage ?? 0,
    });

    await finalizeRequestStatus(request, "approved");
    return;
  }

  if (request.reason === "hold") {
    const targetTrackCode = request.booking?.trackCode || "";
    const grouped = targetTrackCode
      ? await fetchBookingsByTrackCode(targetTrackCode)
      : [];
    const targetBookings = request.requestedScope === "group"
      ? (grouped.length ? grouped : (request.booking ? [request.booking] : []))
      : (request.booking ? [request.booking] : []);
    const holdNote = request.requestNote
      || request.requestedNotes
      || request.booking?.notes
      || "Customer requested to move this booking to hold.";

    for (const bookingRow of targetBookings) {
      const mergedNotes = mergeNotesAndServices(holdNote, getBookingServices(bookingRow));
      await updateBooking(bookingRow.id, {
        guestName: bookingRow.guestName || "",
        phone: bookingRow.phone || "",
        checkIn: bookingRow.checkIn || "",
        checkOut: bookingRow.checkOut || "",
        guests: Number(bookingRow.guests || 1),
        roomType: bookingRow.roomType || "",
        roomTypeLabel: bookingRow.roomTypeLabel || "",
        roomNumber: bookingRow.roomNumber || 0,
        notes: mergedNotes,
        status: "Hold",
        trackCode: bookingRow.trackCode || "",
        lifecycleStatus: "hold",
        checkedInAt: bookingRow.checkedInAt ?? null,
        checkedOutAt: null,
        advancePaid: Boolean(bookingRow.advancePaid),
        advanceAmount: Number(bookingRow.advanceAmount || 0),
        customPayments: bookingRow.customPayments || [],
      });
    }

    await finalizeRequestStatus(request, "approved");
    return;
  }

  const targetStatus = request.reason === "cancel"
    ? "Cancelled"
    : request.reason === "delete_booking"
        ? "Cancelled"
      : (request.requestedBookingStatus || request.booking?.status || "Campaign");

  const targetTrackCode = request.booking?.trackCode || "";
  const grouped = targetTrackCode
    ? await fetchBookingsByTrackCode(targetTrackCode)
    : [];
  const targetBookings = request.requestedScope === "group"
    ? (grouped.length ? grouped : (request.booking ? [request.booking] : []))
    : (request.booking ? [request.booking] : []);

  if (request.reason === "edit_booking_data" && request.requestedScope === "group") {
    const requestedRoomEdits = Array.isArray(request.requestedBookingRooms) ? request.requestedBookingRooms : [];
    const normalizedRoomEdits = requestedRoomEdits.length
      ? requestedRoomEdits.map((item) => ({
          bookingId: item.bookingId,
          roomType: normalizeRoomGroup(item.roomType),
          roomNumber: Number(item.roomNumber),
          guests: Number(item.guests || 1),
          acEnabled: normalizeAcEnabled(item.roomType, item.acEnabled),
          services: Array.isArray(item.services) ? item.services : [],
        }))
      : targetBookings.map((bookingRow) => buildBookingRoomEditOptions(bookingRow));

    await applyGroupedBookingEdits(targetBookings, normalizedRoomEdits, {
      guestName: request.requestedGuestName || request.booking?.guestName || "",
      phone: request.requestedPhone || request.booking?.phone || "",
      checkIn: request.requestedCheckIn || request.booking?.checkIn || "",
      checkOut: request.requestedCheckOut || request.booking?.checkOut || "",
      notes: request.requestedNotes ?? "",
      status: targetStatus,
    });

    await finalizeRequestStatus(request, "approved");
    return;
  }

  if (request.requestedScope === "group") {
    const sharedTrackCode = await resolveBookingTrackCode(
      targetBookings,
      targetStatus,
      targetBookings[0]?.trackCode || targetTrackCode,
    );
    await ensureGroupAvailabilityForUpdate(
      targetBookings,
      request.requestedCheckIn || request.booking?.checkIn || "",
      request.requestedCheckOut || request.booking?.checkOut || "",
      targetStatus,
    );

    for (const bookingRow of targetBookings) {
      await updateBooking(bookingRow.id, {
        guestName: request.requestedGuestName || bookingRow.guestName || "",
        phone: request.requestedPhone || bookingRow.phone || "",
        checkIn: request.requestedCheckIn || bookingRow.checkIn || "",
        checkOut: request.requestedCheckOut || bookingRow.checkOut || "",
        roomType: bookingRow.roomType,
        roomTypeLabel: bookingRow.roomTypeLabel,
        roomNumber: bookingRow.roomNumber,
        notes: request.requestedNotes ?? bookingRow.notes ?? "",
        status: targetStatus,
        trackCode: sharedTrackCode,
      });
    }
  } else {
    await ensureBookingAvailabilityForUpdate(request.bookingId, {
      checkIn: request.requestedCheckIn || request.booking?.checkIn || "",
      checkOut: request.requestedCheckOut || request.booking?.checkOut || "",
      roomType: request.requestedRoomType || request.booking?.roomType || "",
      roomNumber: request.requestedRoomNumber || request.booking?.roomNumber || 0,
      status: targetStatus,
    });

    await updateBooking(request.bookingId, {
      guestName: request.requestedGuestName || request.booking?.guestName || "",
      phone: request.requestedPhone || request.booking?.phone || "",
      checkIn: request.requestedCheckIn || request.booking?.checkIn || "",
      checkOut: request.requestedCheckOut || request.booking?.checkOut || "",
      roomType: request.requestedRoomType || request.booking?.roomType || "",
      roomTypeLabel: getRoomTypeLabelForGuests(
        request.requestedRoomType || request.booking?.roomType || "",
        Number(request.requestedGuests || request.booking?.guests || 1),
        request.booking?.acEnabled,
      ),
      roomNumber: request.requestedRoomNumber || request.booking?.roomNumber || 0,
      guests: Number(request.requestedGuests || request.booking?.guests || 1),
      acEnabled: normalizeAcEnabled(request.requestedRoomType || request.booking?.roomType || "", request.booking?.acEnabled),
      notes: request.requestedNotes ?? request.booking?.notes ?? "",
      status: targetStatus,
      trackCode: await resolveBookingTrackCode([request.booking], targetStatus, request.booking?.trackCode || ""),
    });
  }
  await finalizeRequestStatus(request, "approved");
}

async function rejectRequest(requestId) {
  const adminNote = window.prompt("Reject reason (optional):", "") || "";
  const request = state.requestMap.get(requestId);
  if (!request) throw new Error("Request not found.");
  await finalizeRequestStatus(request, "rejected", adminNote);
}

function getRequestRequestedDate(request) {
  return request.requestedCheckIn || request.booking?.checkIn || "";
}

function getLatestRequests(requests) {
  const latestByBooking = new Map();

  requests.forEach((request) => {
    const key = request.booking?.trackCode || request.bookingId || request.id;
    const existing = latestByBooking.get(key);
    if (!existing || String(request.createdAt || "") > String(existing.createdAt || "")) {
      latestByBooking.set(key, request);
    }
  });

  return Array.from(latestByBooking.values());
}

function getFilteredRequests(requests) {
  let next = getLatestRequests(requests);
  const trackFilter = (requestsTrackFilter.value || "").trim().toLowerCase();
  const requestedByFilter = (requestsRequestedByFilter.value || "").trim().toLowerCase();
  const dateFrom = requestsDateFromFilter.value || "";
  const dateTo = requestsDateToFilter.value || "";

  if (state.requestsFilterStatus !== "all") {
    next = next.filter((request) => request.status === state.requestsFilterStatus);
  }

  if (trackFilter) {
    next = next.filter((request) =>
      String(request.booking?.trackCode || request.trackCode || "").toLowerCase().includes(trackFilter)
    );
  }

  if (requestedByFilter) {
    next = next.filter((request) => {
      const profile = state.profileMap.get(request.requestedBy);
      const haystack = [
        profile?.full_name || "",
        profile?.username || "",
        request.requestedByName || "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(requestedByFilter);
    });
  }

  if (state.requestsFilterMode === "date" && (dateFrom || dateTo)) {
    next = next.filter((request) => {
      const requestedDate = getRequestRequestedDate(request);
      if (!requestedDate) return false;
      if (dateFrom && requestedDate < dateFrom) return false;
      if (dateTo && requestedDate > dateTo) return false;
      return true;
    });
    next.sort((a, b) => getRequestRequestedDate(a).localeCompare(getRequestRequestedDate(b)));
  } else {
    next.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  }

  return next;
}

function updateRequestFilterButtons() {
  requestFilterButtons.forEach((button) => {
    const isActive =
      (button.dataset.filterMode && button.dataset.filterMode === state.requestsFilterMode) ||
      (button.dataset.filterStatus && button.dataset.filterStatus === state.requestsFilterStatus);
    button.classList.toggle("filter-chip-active", Boolean(isActive));
  });
}

function renderRequests(requests) {
  requestsList.innerHTML = "";
  state.requestMap = new Map(requests.map((request) => [request.id, request]));
  const filteredRequests = getFilteredRequests(requests);
  requestsEmpty.style.display = filteredRequests.length ? "none" : "block";
  requestsHelper.textContent = canManageRequests()
    ? "Owner/Admin can approve or reject requests here."
    : "Your submitted requests show pending, approved, or rejected status here.";
  updateRequestFilterButtons();

  filteredRequests.forEach((request) => {
    const booking = request.booking;
    const card = document.createElement("article");
    card.className = "request-card";
    const statusClass =
      request.status === "approved"
        ? "tag-success"
        : request.status === "pending"
        ? "tag-pending"
          : "";
    const currentServices = parseBookingNotes(booking?.notes || "").services;
    const requestedServices = request.requestedServices?.length ? request.requestedServices : currentServices;
    const currentPricing = getBookingPricingSnapshot(booking || {});
    const requestedPricing = getRequestPriceSnapshot(request, booking);
    const changeItems = getRequestChangeItems(request, booking);
    const currentRows = [
      {
        label: "Stay",
        value: formatRequestStay(booking?.checkIn, booking?.checkOut),
        changed: formatRequestStay(booking?.checkIn, booking?.checkOut) !== formatRequestStay(request.requestedCheckIn || booking?.checkIn, request.requestedCheckOut || booking?.checkOut),
      },
      {
        label: "Status",
        value: booking?.status || "-",
        changed: (booking?.status || "-") !== (request.requestedBookingStatus || booking?.status || "-"),
      },
      {
        label: "Room",
        value: formatRequestRoomSummary(booking?.roomType, booking?.roomTypeLabel, booking?.roomNumber, booking?.guests),
        changed:
          formatRequestRoomSummary(booking?.roomType, booking?.roomTypeLabel, booking?.roomNumber, booking?.guests)
          !== formatRequestRoomSummary(
            request.requestedRoomType || booking?.roomType,
            request.requestedRoomTypeLabel || booking?.roomTypeLabel,
            request.requestedRoomNumber || booking?.roomNumber,
            request.requestedGuests || booking?.guests,
          ) || Boolean(request.requestedBookingRooms?.length),
      },
      {
        label: "Phone",
        value: booking?.phone || "-",
        changed: (booking?.phone || "-") !== (request.requestedPhone || booking?.phone || "-"),
      },
      {
        label: "Guest",
        value: booking?.guestName || "-",
        changed: (booking?.guestName || "-") !== (request.requestedGuestName || booking?.guestName || "-"),
      },
      {
        label: "Price",
        value: formatBookingPriceBreakdown(currentPricing),
        changed:
          currentPricing.baseRoomTotal !== requestedPricing.baseRoomTotal
          || currentPricing.offerPercentage !== requestedPricing.offerPercentage
          || currentPricing.roomTotal !== requestedPricing.roomTotal,
      },
      {
        label: "Services",
        value: currentServices.length ? currentServices.join(", ") : "None",
        changed: currentServices.join("|") !== requestedServices.join("|"),
      },
      {
        label: "Notes",
        value: booking?.notes || "-",
        changed: (booking?.notes || "-") !== (request.requestedNotes || booking?.notes || "-"),
      },
    ];
    const requestedRows = [
      {
        label: "Stay",
        value: formatRequestStay(request.requestedCheckIn || booking?.checkIn, request.requestedCheckOut || booking?.checkOut),
        changed: currentRows[0].changed,
      },
      {
        label: "Status",
        value: request.requestedBookingStatus || booking?.status || "-",
        changed: currentRows[1].changed,
      },
      {
        label: "Room",
        value: request.requestedBookingRooms?.length
          ? `${request.requestedBookingRooms.length} room update(s)`
          : formatRequestRoomSummary(
              request.requestedRoomType || booking?.roomType,
              request.requestedRoomTypeLabel || booking?.roomTypeLabel,
              request.requestedRoomNumber || booking?.roomNumber,
              request.requestedGuests || booking?.guests,
            ),
        changed: currentRows[2].changed,
      },
      {
        label: "Phone",
        value: request.requestedPhone || booking?.phone || "-",
        changed: currentRows[3].changed,
      },
      {
        label: "Guest",
        value: request.requestedGuestName || booking?.guestName || "-",
        changed: currentRows[4].changed,
      },
      {
        label: "Price",
        value: formatBookingPriceBreakdown(requestedPricing),
        changed: currentRows[5].changed,
      },
      {
        label: "Services",
        value: requestedServices.length ? requestedServices.join(", ") : "None",
        changed: currentRows[6].changed,
      },
      {
        label: "Notes",
        value: request.requestedNotes || booking?.notes || "-",
        changed: currentRows[7].changed,
      },
    ];
    card.innerHTML = `
      <div class="request-card-head">
        <div class="request-card-head-main">
          <div class="request-card-kicker">Booking Request</div>
          <h4>${booking?.trackCode || "-"} · ${booking?.guestName || request.requestedGuestName || "Booking"}</h4>
          <p>${formatRequestReason(request.reason)}</p>
        </div>
        <span class="booking-tag ${statusClass}">${request.status}</span>
      </div>
      <div class="request-summary-grid">
        <div class="request-summary-box">
          <span class="request-summary-label">Requested by</span>
          <strong>${getRequestRequesterName(request)}</strong>
        </div>
        <div class="request-summary-box">
          <span class="request-summary-label">Submitted</span>
          <strong>${formatRequestCreatedAt(request.createdAt)}</strong>
        </div>
        <div class="request-summary-box">
          <span class="request-summary-label">Stay date</span>
          <strong>${getRequestRequestedDate(request) || "-"}</strong>
        </div>
        <div class="request-summary-box">
          <span class="request-summary-label">Scope</span>
          <strong>${formatRequestScope(request.requestedScope)}</strong>
        </div>
      </div>
      <div class="request-change-strip">
        <span class="request-change-title">Changed</span>
        <div class="request-change-pills">
          ${changeItems.length ? formatRequestList(changeItems, "No changes") : `<span class="muted">No changes</span>`}
        </div>
      </div>
      <div class="request-compare-grid">
        <section class="request-state-panel">
          <div class="request-panel-title request-panel-title-current">Current booking</div>
          ${renderRequestStateRows(currentRows, "current")}
        </section>
        <section class="request-state-panel request-state-panel-requested">
          <div class="request-panel-title request-panel-title-requested">Requested change</div>
          ${renderRequestStateRows(requestedRows, "requested")}
        </section>
      </div>
      <div class="request-detail">
        <div class="request-extra-grid">
          ${renderExtraRoomList(request)}
          ${renderRemovedRoomList(request)}
          ${renderRequestedRoomPlan(request)}
          <div class="request-extra-card">
            <div class="request-extra-title">Requested services</div>
            ${request.requestedServices?.length ? renderServiceChips(request.requestedServices) : `<span class="muted">No service changes</span>`}
          </div>
          <div class="request-extra-card">
            <div class="request-extra-title">Reason details</div>
            <div class="request-note-box">${request.requestNote || "-"}</div>
          </div>
          ${
            request.adminNote
              ? `
                <div class="request-extra-card">
                  <div class="request-extra-title">Admin note</div>
                  <div class="request-note-box">${request.adminNote}</div>
                </div>
              `
              : ""
          }
        </div>
      </div>
      <div class="request-actions">
        <button class="action-btn" type="button" data-request-toggle>More details</button>
        ${
          canManageRequests() && request.status === "pending"
            ? `<button class="action-btn" type="button" data-request-action="approve" data-request-id="${request.id}">Approve</button>
               <button class="action-btn danger" type="button" data-request-action="reject" data-request-id="${request.id}">Reject</button>`
            : ""
        }
      </div>
    `;

    const toggleBtn = card.querySelector("[data-request-toggle]");
    const detail = card.querySelector(".request-detail");
    toggleBtn.addEventListener("click", () => {
      const open = detail.classList.toggle("request-detail-open");
      toggleBtn.textContent = open ? "Hide details" : "More details";
    });

    card.querySelectorAll("[data-request-action]").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          button.disabled = true;
          if (button.dataset.requestAction === "approve") {
            await approveRequest(button.dataset.requestId);
            showToast("Request approved.");
          } else {
            await rejectRequest(button.dataset.requestId);
            showToast("Request rejected.");
          }
          await loadRequests();
          await refreshLiveViews();
        } catch (error) {
          showToast(error.message, true);
        } finally {
          button.disabled = false;
        }
      });
    });

    requestsList.appendChild(card);
  });
}

function updateStats(bookings) {
  const bookedRooms = new Set();
  bookings.forEach((booking) => {
    if (!isBlockingBooking(booking)) return;
    bookedRooms.add(`${normalizeRoomGroup(booking.roomType)}-${booking.roomNumber}`);
  });
  const totalActiveRooms = getRoomInventoryRows().length;
  statTotal.textContent = bookings.length;
  statOccupied.textContent = bookedRooms.size;
  statAvailable.textContent = Math.max(totalActiveRooms - bookedRooms.size, 0);
}

function getPlannerRooms(bookings = []) {
  const bookedRoomKeys = new Set(
    bookings.map((booking) => `${normalizeRoomGroup(booking.roomType)}-${Number(booking.roomNumber)}`),
  );
  return buildRoomList({ includeInactive: true }).filter((room) => room.isActive || bookedRoomKeys.has(`${room.type}-${room.number}`));
}

function getPlannerBookingColors(booking, pendingCollections) {
  if (isPlannerPendingBooking(booking, pendingCollections)) {
    return { bg: "#d9c3f7", border: "#9b68dd", text: "#44206b" };
  }
  return getPlannerAccentPalette(getPlannerBaseColorForGroup(getBookingGroupKey(booking)));
}

function getPlannerPendingLabel(booking, pendingCollections) {
  const pendingRequest = pendingCollections.byTrack.get(getBookingGroupKey(booking));
  if (pendingRequest?.status === "pending") {
    switch (pendingRequest.reason) {
      case "change_date":
        return "Pending: Date";
      case "remove_rooms":
        return "Pending: Remove";
      case "delete_booking":
        return "Pending: Delete";
      case "change_room_price":
        return "Pending: Price";
      case "additional_rooms":
        return "Pending: Rooms";
      case "additional_services":
        return "Pending: Services";
      case "hold":
        return "Pending: Hold";
      case "cancel":
        return "Pending: Cancel";
      case "edit_booking_data":
        return "Pending: Edit";
      default:
        return "Pending: Request";
    }
  }
  if (String(booking.status || "").toLowerCase() === "pending") {
    return "Waiting for confirmation";
  }
  if (isGroupAdvancePending(getBookingGroupKey(booking))) {
    return "Pending: Advance";
  }
  return "";
}

function getPlannerLifecycleMeta(booking) {
  const lifecycle = getBookingLifecycleStatus(booking);
  if (lifecycle === "checked_out") return "Checked Out";
  if (lifecycle === "checked_in") return "Checked In";
  if (lifecycle === "hold") return "Hold";
  return "";
}

function useDesktopPlannerLayout() {
  return state.bookingViewMode === "desktop" && window.innerWidth >= 980;
}

function getPlannerMobileRoomLabel(room) {
  const roomType = normalizeRoomGroup(room.type);
  if (roomType === "kitchen") return `Kitchen ${room.number}`;
  if (roomType === "driver") return `Driver ${room.number}`;
  return `Normal ${room.number}`;
}

function getPlannerMobileBookingShortLabel(booking) {
  const visibleCode = getVisibleTrackCode(booking.trackCode, booking.status) || "";
  if (visibleCode) {
    return visibleCode.replace(/[^A-Za-z0-9]/g, "").slice(-4).toUpperCase();
  }
  const guest = String(booking.guestName || "").trim();
  if (!guest) return "BK";
  const initials = guest
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return initials || "BK";
}

function bindPlannerBookingButtons() {
  reservationPlannerBoard.querySelectorAll("[data-planner-group]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextGroupKey = button.dataset.plannerGroup || "";
      if (!nextGroupKey) return;
      if (state.selectedPlannerGroupKey === nextGroupKey) {
        openBookingDetailsModal(nextGroupKey);
        return;
      }
      state.selectedPlannerGroupKey = nextGroupKey;
      renderCurrentPlannerView();
    });
  });
  reservationPlannerBoard.querySelectorAll("[data-planner-booking-id]").forEach((button) => {
    button.addEventListener("dragstart", (event) => {
      state.plannerDragBookingId = button.dataset.plannerBookingId;
      button.classList.add("reservation-planner-booking-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", button.dataset.plannerBookingId || "");
    });
    button.addEventListener("dragend", () => {
      state.plannerDragBookingId = null;
      button.classList.remove("reservation-planner-booking-dragging");
      reservationPlannerBoard.querySelectorAll(".reservation-planner-cell-drop-target").forEach((cell) => {
        cell.classList.remove("reservation-planner-cell-drop-target");
      });
    });
  });
  reservationPlannerBoard.querySelectorAll("[data-planner-empty-room]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await openBookingFromPlannerCell(
          button.dataset.plannerEmptyRoom,
          button.dataset.plannerEmptyNumber,
          button.dataset.plannerEmptyDate,
        );
      } catch (error) {
        showToast(error.message || "Could not start a booking from the planner.", true);
      }
    });
  });
  reservationPlannerBoard.querySelectorAll("[data-planner-drop-room]").forEach((cell) => {
    cell.addEventListener("dragover", (event) => {
      if (!state.plannerDragBookingId) return;
      event.preventDefault();
      cell.classList.add("reservation-planner-cell-drop-target");
    });
    cell.addEventListener("dragleave", () => {
      cell.classList.remove("reservation-planner-cell-drop-target");
    });
    cell.addEventListener("drop", async (event) => {
      event.preventDefault();
      cell.classList.remove("reservation-planner-cell-drop-target");
      const bookingId = event.dataTransfer.getData("text/plain") || state.plannerDragBookingId;
      if (!bookingId) return;
      try {
        const changed = await movePlannerBookingToRoom(
          bookingId,
          cell.dataset.plannerDropRoom,
          cell.dataset.plannerDropNumber,
        );
        if (!changed) return;
        showToast("Booking room updated from planner.");
        await refreshLiveViews();
      } catch (error) {
        showToast(error.message || "Could not move booking.", true);
      } finally {
        state.plannerDragBookingId = null;
      }
    });
  });
}

async function openBookingFromPlannerCell(roomType, roomNumber, dateKey) {
  if (!dateKey) return;
  const normalizedRoomType = normalizeRoomGroup(roomType);
  const numericRoomNumber = Number(roomNumber);
  const checkInDate = parseDate(dateKey);
  if (!checkInDate || !normalizedRoomType || !numericRoomNumber) return;

  const checkOutDate = addDays(checkInDate, 1);
  setScreen("booking");
  setBookingDateRange(formatDateKey(checkInDate), formatDateKey(checkOutDate));
  state.roomPlans.clear();
  state.bookingServices.clear();
  state.bookingCustomPayments = [];
  if (bookingAdvancePaidInput) bookingAdvancePaidInput.checked = false;
  if (bookingAdvanceAmountInput) bookingAdvanceAmountInput.value = "";
  syncAdvanceAmountField();
  const defaultNights = getNightCount(formatDateKey(checkInDate), formatDateKey(checkOutDate));
  const plan = getRoomPlan(normalizedRoomType, numericRoomNumber, defaultNights);
  plan.nights = defaultNights;
  plan.extraPax = 0;
  plan.pax = 1;
  await refreshAvailability();
  showToast(`${getRoomLabel(normalizedRoomType, numericRoomNumber)} selected for ${formatDateKey(checkInDate)}.`);
}

async function movePlannerBookingToRoom(bookingId, targetRoomType, targetRoomNumber) {
  const booking = state.bookingMap.get(bookingId);
  if (!booking) throw new Error("Booking not found.");
  const normalizedRoomType = normalizeRoomGroup(targetRoomType);
  const numericRoomNumber = Number(targetRoomNumber);
  if (!normalizedRoomType || !numericRoomNumber) throw new Error("Select a valid room.");
  if (normalizeRoomGroup(booking.roomType) === normalizedRoomType && Number(booking.roomNumber) === numericRoomNumber) {
    return false;
  }

  const targetRoom = getRoomInventoryRows({ includeInactive: true }).find((room) => (
    room.roomType === normalizedRoomType && Number(room.roomNumber) === numericRoomNumber
  ));
  if (!targetRoom || !targetRoom.isActive) {
    throw new Error("Target room is not available.");
  }
  if (Number(targetRoom.maxPax || 0) < Number(booking.guests || 0)) {
    throw new Error("Target room does not have enough pax capacity.");
  }

  const overlapBookings = await fetchBookingsForPeriod(booking.checkIn, booking.checkOut);
  const hasConflict = overlapBookings.some((item) => {
    if (String(item.id) === String(booking.id)) return false;
    if (!isBlockingBooking(item)) return false;
    if (normalizeRoomGroup(item.roomType) !== normalizedRoomType) return false;
    if (Number(item.roomNumber) !== numericRoomNumber) return false;
    return datesOverlap(parseDate(booking.checkIn), parseDate(booking.checkOut), parseDate(item.checkIn), parseDate(item.checkOut));
  });
  if (hasConflict) {
    throw new Error("That room is already booked for this stay.");
  }

  await updateBooking(booking.id, {
    roomType: normalizedRoomType,
    roomTypeLabel: getRoomTypeLabelForGuests(normalizedRoomType, booking.guests, booking.acEnabled),
    roomNumber: numericRoomNumber,
  });
  return true;
}

function renderReservationPlannerMobile(bookings, plannerRooms, startDate, days, pendingCollections) {
  const rangeStart = parseDate(startDate);
  const safeDays = Math.max(7, Math.min(366, Number(days || 14)));
  const dateList = Array.from({ length: safeDays }, (_, index) => addDays(rangeStart, index));
  const roomIndexMap = new Map(plannerRooms.map((room, index) => [`${room.type}-${room.number}`, index]));
  const roomHeaders = plannerRooms.map((room, index) => `
    <div class="reservation-planner-mobile-room-head" style="grid-column:${index + 2}; grid-row:1;">
      <strong>${escapeHtml(getPlannerMobileRoomLabel(room))}</strong>
    </div>
  `).join("");
  const dateLabels = dateList.map((date, index) => `
    <div class="reservation-planner-mobile-date" style="grid-column:1; grid-row:${index + 2};">
      <strong>${date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</strong>
      <span>${date.toLocaleDateString("en-GB", { weekday: "short" })}</span>
    </div>
  `).join("");
  const bookingCells = new Map();

  bookings.forEach((booking) => {
    const roomKey = `${normalizeRoomGroup(booking.roomType)}-${Number(booking.roomNumber)}`;
    const roomIndex = roomIndexMap.get(roomKey);
    if (roomIndex == null) return;
    const bookingStart = parseDate(booking.checkIn);
    const bookingEnd = parseDate(booking.checkOut);
    if (!bookingStart || !bookingEnd) return;

    const colors = getPlannerBookingColors(booking, pendingCollections);
    const pendingLabel = getPlannerPendingLabel(booking, pendingCollections);
    const displayTrackCode = getVisibleTrackCode(booking.trackCode, booking.status);
    const stayNights = Math.max(1, getNightCount(booking.checkIn, booking.checkOut));
    const lifecycleStatus = getBookingLifecycleStatus(booking);
    const shortLabel = getPlannerMobileBookingShortLabel(booking);
    const noteText = pendingLabel
      ? "Req"
      : lifecycleStatus === "checked_in"
        ? "In"
        : lifecycleStatus === "checked_out"
          ? "Out"
          : "";
    const labelParts = [
      displayTrackCode || pendingLabel || "Pending Booking",
      getRoomLabel(normalizeRoomGroup(booking.roomType), booking.roomNumber),
      `${Number(booking.guests || 0)} Pax`,
      `${stayNights} Night${stayNights === 1 ? "" : "s"}`,
      pendingLabel || booking.guestName || "Booking",
    ].filter(Boolean);

    dateList.forEach((date, rowIndex) => {
      if (!(bookingStart <= date && bookingEnd > date)) return;
      bookingCells.set(`${rowIndex}:${roomIndex}`, {
        groupKey: getBookingGroupKey(booking),
        label: labelParts.join(" | "),
        colors,
        pending: Boolean(pendingLabel),
        shortLabel,
        paxText: `${Number(booking.guests || 0)}P`,
        stayText: `${stayNights}N`,
        noteText,
      });
    });
  });

  const mobileGroupCards = groupBookingsForDisplay(bookings).map((group) => `
    <button
      class="reservation-planner-mobile-summary-card${state.selectedPlannerGroupKey === group.key ? " reservation-planner-mobile-summary-card-selected" : ""}"
      type="button"
      data-planner-group="${escapeHtml(group.key)}"
    >
      <div class="reservation-planner-mobile-summary-head">
        <strong>${escapeHtml(getVisibleTrackCode(group.trackCode, group.statuses.size === 1 ? Array.from(group.statuses)[0] : "Pending") || group.trackCode || "Booking")}</strong>
        <span>${escapeHtml(`${group.bookings.length} Room${group.bookings.length === 1 ? "" : "s"} · ${group.totalGuests} Pax`)}</span>
      </div>
      <div class="reservation-planner-mobile-summary-name">${escapeHtml(group.guestName || "Guest")}</div>
      <div class="reservation-planner-mobile-summary-meta">${escapeHtml(`${group.checkIn || "-"} -> ${group.checkOut || "-"} · ${Math.max(1, getNightCount(group.checkIn, group.checkOut))} Night${Math.max(1, getNightCount(group.checkIn, group.checkOut)) === 1 ? "" : "s"}`)}</div>
    </button>
  `).join("");

  const cells = dateList.map((_, rowIndex) => plannerRooms.map((_, columnIndex) => {
    const marker = bookingCells.get(`${rowIndex}:${columnIndex}`);
    const room = plannerRooms[columnIndex];
    const date = dateList[rowIndex];
    return `
      <div class="reservation-planner-mobile-cell" style="grid-column:${columnIndex + 2}; grid-row:${rowIndex + 2};">
        ${
          marker
            ? `
              <button
                class="reservation-planner-mobile-marker${marker.pending ? " reservation-planner-mobile-marker-pending" : ""}${state.selectedPlannerGroupKey === marker.groupKey ? " reservation-planner-mobile-marker-selected" : ""}"
                type="button"
                data-planner-group="${escapeHtml(marker.groupKey)}"
                aria-label="${escapeHtml(marker.label)}"
                title="${escapeHtml(marker.label)}"
                style="--planner-bg:${marker.colors.bg}; --planner-border:${marker.colors.border}; --planner-text:${marker.colors.text};"
              >
                <span class="reservation-planner-mobile-marker-code">${escapeHtml(marker.shortLabel)}</span>
                <span class="reservation-planner-mobile-marker-pax">${escapeHtml(marker.paxText)}</span>
                <span class="reservation-planner-mobile-marker-stay">${escapeHtml(marker.stayText)}</span>
                ${marker.noteText ? `<span class="reservation-planner-mobile-marker-note">${escapeHtml(marker.noteText)}</span>` : ""}
              </button>
            `
            : `
              <button
                class="reservation-planner-mobile-empty-trigger"
                type="button"
                data-planner-empty-room="${escapeHtml(room.type)}"
                data-planner-empty-number="${escapeHtml(String(room.number))}"
                data-planner-empty-date="${escapeHtml(formatDateKey(date))}"
                aria-label="Add booking on ${escapeHtml(getPlannerMobileRoomLabel(room))} for ${escapeHtml(formatDateKey(date))}"
                title="Add booking"
              ></button>
            `
        }
      </div>
    `;
  }).join("")).join("");

  reservationPlannerBoard.innerHTML = `
    <div class="reservation-planner-mobile">
      <div
        class="reservation-planner-mobile-grid"
        style="grid-template-columns: 64px repeat(${plannerRooms.length}, 58px); grid-template-rows: 40px repeat(${safeDays}, 52px);"
      >
        <div class="reservation-planner-mobile-corner" style="grid-column:1; grid-row:1;">Dates</div>
        ${roomHeaders}
        ${dateLabels}
        ${cells}
      </div>
      ${mobileGroupCards ? `<div class="reservation-planner-mobile-summary-list">${mobileGroupCards}</div>` : ""}
    </div>
  `;

  reservationPlannerEmpty.textContent = bookings.length ? "" : "No bookings found in this range.";
  reservationPlannerEmpty.style.display = bookings.length ? "none" : "block";
  bindPlannerBookingButtons();
}

function renderReservationPlanner(bookings, startDate, days) {
  if (!reservationPlannerBoard || !reservationPlannerEmpty) return;

  mergeBookingsIntoStateMap(bookings);
  const visibleBookings = getFilteredPlannerBookings(bookings);
  const groupedBookings = groupBookingsForDisplay(visibleBookings);
  state.plannerBookingGroups = new Map(groupedBookings.map((group) => [group.key, group]));
  if (state.selectedPlannerGroupKey && !state.plannerBookingGroups.has(state.selectedPlannerGroupKey)) {
    state.selectedPlannerGroupKey = "";
  }

  const plannerRooms = getPlannerRooms(visibleBookings);
  const rangeStart = parseDate(startDate);
  const safeDays = Math.max(7, Math.min(366, Number(days || 14)));
  const pendingCollections = getLatestPendingRequestCollections();
  const dateList = Array.from({ length: safeDays }, (_, index) => addDays(rangeStart, index));
  const rangeEnd = addDays(rangeStart, safeDays);
  const occupiedNights = visibleBookings.reduce((sum, booking) => {
    const checkIn = parseDate(booking.checkIn);
    const checkOut = parseDate(booking.checkOut);
    if (!checkIn || !checkOut) return sum;
    const startOffset = Math.max(0, Math.round((checkIn - rangeStart) / 86400000));
    const endOffset = Math.min(safeDays, Math.round((checkOut - rangeStart) / 86400000));
    return sum + Math.max(0, endOffset - startOffset);
  }, 0);

  setText(plannerSummaryRange, `${formatDateKey(rangeStart)} -> ${formatDateKey(addDays(rangeStart, safeDays - 1))}`);
  setText(plannerSummaryReservations, String(groupedBookings.length));
  setText(plannerSummaryNights, String(occupiedNights));
  setText(plannerSummaryRooms, String(plannerRooms.length));

  if (!plannerRooms.length) {
    setHTML(reservationPlannerBoard, "");
    reservationPlannerEmpty.textContent = "No rooms available to show in the planner.";
    reservationPlannerEmpty.style.display = "block";
    return;
  }

  if (!useDesktopPlannerLayout()) {
    renderReservationPlannerMobile(visibleBookings, plannerRooms, startDate, safeDays, pendingCollections);
    return;
  }

  const roomIndexMap = new Map(plannerRooms.map((room, index) => [`${room.type}-${room.number}`, index]));
  const roomHeaders = plannerRooms.map((room, index) => `
    <div class="reservation-planner-room-head" style="grid-column:${index + 2}; grid-row:1;">
      <strong>${escapeHtml(room.fullLabel)}</strong>
      <span>${escapeHtml(getRoomTypeDisplay(room.type))}</span>
    </div>
  `).join("");

  const dateLabels = dateList.map((date, index) => `
    <div class="reservation-planner-date" style="grid-column:1; grid-row:${index + 2};">
      <strong>${date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</strong>
      <span>${date.toLocaleDateString("en-GB", { weekday: "short" })}</span>
    </div>
  `).join("");

  const cells = dateList.map((date, rowIndex) => plannerRooms.map((room, columnIndex) => `
    <div
      class="reservation-planner-cell"
      style="grid-column:${columnIndex + 2}; grid-row:${rowIndex + 2};"
      data-planner-drop-room="${escapeHtml(room.type)}"
      data-planner-drop-number="${escapeHtml(String(room.number))}"
      data-planner-drop-date="${escapeHtml(formatDateKey(date))}"
    >
      <button
        class="reservation-planner-empty-trigger"
        type="button"
        data-planner-empty-room="${escapeHtml(room.type)}"
        data-planner-empty-number="${escapeHtml(String(room.number))}"
        data-planner-empty-date="${escapeHtml(formatDateKey(date))}"
        aria-label="Add booking on ${escapeHtml(room.fullLabel)} for ${escapeHtml(formatDateKey(date))}"
        title="Add booking"
      ></button>
    </div>
  `).join("")).join("");

  const bars = visibleBookings.map((booking) => {
    const roomKey = `${normalizeRoomGroup(booking.roomType)}-${Number(booking.roomNumber)}`;
    const roomIndex = roomIndexMap.get(roomKey);
    if (roomIndex == null) return "";

    const bookingStart = parseDate(booking.checkIn);
    const bookingEnd = parseDate(booking.checkOut);
    if (!bookingStart || !bookingEnd || bookingEnd <= rangeStart || bookingStart >= rangeEnd) return "";

    const startOffset = Math.max(0, Math.round((bookingStart - rangeStart) / 86400000));
    const endOffset = Math.min(safeDays, Math.round((bookingEnd - rangeStart) / 86400000));
    const span = Math.max(1, endOffset - startOffset);
    const colors = getPlannerBookingColors(booking, pendingCollections);
    const pendingLabel = getPlannerPendingLabel(booking, pendingCollections);
    const displayTrackCode = getVisibleTrackCode(booking.trackCode, booking.status);
    const lifecycleMeta = getPlannerLifecycleMeta(booking);
    const phoneMeta = booking.phone ? `Phone: ${booking.phone}` : "";
    const checkInMeta = booking.checkedInAt ? `Check In: ${new Date(booking.checkedInAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}` : "";
    const checkOutMeta = booking.checkedOutAt ? `Check Out: ${new Date(booking.checkedOutAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}` : "";
    const stayMeta = `${Math.max(1, getNightCount(booking.checkIn, booking.checkOut))} Night${Math.max(1, getNightCount(booking.checkIn, booking.checkOut)) === 1 ? "" : "s"}`;
    const detailBits = [
      displayTrackCode || pendingLabel || "Pending Booking",
      `${Number(booking.guests || 0)} Pax`,
      `${booking.guestName || "Guest"}`,
      phoneMeta,
    ];

    return `
      <button
        class="reservation-planner-booking${isPlannerPendingBooking(booking, pendingCollections) ? " reservation-planner-booking-pending" : ""}${state.selectedPlannerGroupKey === getBookingGroupKey(booking) ? " reservation-planner-booking-selected" : ""}"
        type="button"
        draggable="true"
        data-planner-group="${escapeHtml(getBookingGroupKey(booking))}"
        data-planner-booking-id="${escapeHtml(String(booking.id))}"
        style="grid-column:${roomIndex + 2}; grid-row:${startOffset + 2} / span ${span}; --planner-bg:${colors.bg}; --planner-border:${colors.border}; --planner-text:${colors.text};"
        title="${escapeHtml(detailBits.join(" | "))}"
      >
        ${displayTrackCode ? `<span class="reservation-planner-booking-track">${escapeHtml(displayTrackCode)}</span>` : ""}
        ${pendingLabel ? `<span class="reservation-planner-booking-pending-label">${escapeHtml(pendingLabel)}</span>` : ""}
        <span class="reservation-planner-booking-meta">${escapeHtml(`${Number(booking.guests || 0)} Pax · ${stayMeta}`)}</span>
        <span class="reservation-planner-booking-name">${escapeHtml(booking.guestName || "Guest")}</span>
        ${phoneMeta ? `<span class="reservation-planner-booking-submeta">${escapeHtml(phoneMeta)}</span>` : ""}
        ${lifecycleMeta ? `<span class="reservation-planner-booking-submeta">${escapeHtml(lifecycleMeta)}</span>` : ""}
        ${checkInMeta ? `<span class="reservation-planner-booking-submeta">${escapeHtml(checkInMeta)}</span>` : ""}
        ${checkOutMeta ? `<span class="reservation-planner-booking-submeta">${escapeHtml(checkOutMeta)}</span>` : ""}
      </button>
    `;
  }).join("");

  reservationPlannerBoard.innerHTML = `
    <div
      class="reservation-planner-grid"
      style="grid-template-columns: 170px repeat(${plannerRooms.length}, minmax(150px, 1fr)); grid-template-rows: 68px repeat(${safeDays}, 72px);"
    >
      <div class="reservation-planner-corner" style="grid-column:1; grid-row:1;">Dates</div>
      ${roomHeaders}
      ${dateLabels}
      ${cells}
      ${bars}
    </div>
  `;

  const plannerSearchTerm = String(plannerSearchInput?.value || "").trim();
  reservationPlannerEmpty.textContent = visibleBookings.length
    ? ""
    : plannerSearchTerm
      ? "No planner bookings matched that search."
      : "No bookings found in this range. Rooms are still shown for planning.";
  reservationPlannerEmpty.style.display = visibleBookings.length ? "none" : "block";
  bindPlannerBookingButtons();
}

async function loadReservationPlanner() {
  if (!state.currentProfile?.approved || !plannerStartDateInput || !plannerRangeDaysInput) return;
  const startDate = plannerStartDateInput.value;
  const rangeDays = Math.max(7, Math.min(366, Number(plannerRangeDaysInput.value || 14)));

  if (!startDate) {
    reservationPlannerEmpty.textContent = "Select a start date to load the booking planner.";
    reservationPlannerEmpty.style.display = "block";
    return;
  }

  try {
    const parsedStart = parseDate(startDate);
    if (!parsedStart) {
      showToast("Select a valid planner start date.", true);
      return;
    }
    const endDate = formatDateKey(addDays(parsedStart, rangeDays));
    const bookings = (await fetchBookingsForPeriod(startDate, endDate))
      .filter((booking) => isVisibleBooking(booking));
    state.currentPlannerBookings = bookings;
    state.currentPlannerStartDate = startDate;
    state.currentPlannerRangeDays = rangeDays;
    renderCurrentPlannerView();
  } catch (error) {
    showToast(error.message, true);
  }
}

async function loadBookingsForDate(date) {
  if (!date || !state.currentProfile?.approved) {
    bookingEmpty.textContent = "Select a date to see bookings.";
    bookingEmpty.style.display = "block";
    return;
  }

  try {
    const bookings = await fetchBookingsByDate(date);
    updateStats(bookings);
    renderRoomStatus(bookings);
    renderBookings(bookings);
  } catch (error) {
    showToast(error.message, true);
  }
}

function renderMonthCalendar(bookings, requests = Array.from(state.requestMap.values())) {
  const monthStart = startOfMonth(state.currentMonthDate);
  const monthEnd = endOfMonth(state.currentMonthDate);
  const gridStart = addDays(monthStart, -monthStart.getDay());
  const gridEnd = addDays(monthEnd, 6 - monthEnd.getDay());
  const selectedDateKey = viewDateInput.value;
  const todayKey = formatDateKey(new Date());
  const dayMap = new Map();
  const pendingCollections = getLatestPendingRequestCollections();

  bookings.forEach((booking) => {
    if (!isVisibleBooking(booking)) return;
    const start = parseDate(booking.checkIn);
    const end = parseDate(booking.checkOut);
    if (!start || !end) return;

    let cursor = new Date(start);
    while (cursor < end) {
      const key = formatDateKey(cursor);
      const next = dayMap.get(key) || {
        bookings: 0,
        rooms: new Set(),
        normalRooms: new Set(),
        kitchenRooms: new Set(),
        driverRooms: new Set(),
        pending: 0,
        hasPendingBooking: false,
      };
      next.bookings += 1;
      const roomKey = `${normalizeRoomGroup(booking.roomType)}-${booking.roomNumber}`;
      next.rooms.add(roomKey);
      const roomGroup = normalizeRoomGroup(booking.roomType);
      if (roomGroup === "normal") next.normalRooms.add(roomKey);
      if (roomGroup === "kitchen") next.kitchenRooms.add(roomKey);
      if (roomGroup === "driver") next.driverRooms.add(roomKey);
      if (isPlannerPendingBooking(booking, pendingCollections)) {
        next.pending += 1;
        next.hasPendingBooking = true;
      }
      dayMap.set(key, next);
      cursor = addDays(cursor, 1);
    }
  });

  requests
    .filter((request) => String(request.status || "").toLowerCase() === "pending")
    .forEach((request) => {
      const key = getRequestRequestedDate(request);
      if (!key) return;
      const next = dayMap.get(key) || {
        bookings: 0,
        rooms: new Set(),
        normalRooms: new Set(),
        kitchenRooms: new Set(),
        driverRooms: new Set(),
        pending: 0,
        hasPendingBooking: false,
      };
      next.pending += 1;
      dayMap.set(key, next);
    });

  monthLabel.textContent = formatMonthLabel(state.currentMonthDate);
  monthGrid.innerHTML = "";

  for (let cursor = new Date(gridStart); cursor <= gridEnd; cursor = addDays(cursor, 1)) {
    const key = formatDateKey(cursor);
    const meta = dayMap.get(key);
    const isCurrentMonth = cursor.getMonth() === state.currentMonthDate.getMonth();
    const button = document.createElement("button");
    button.type = "button";
    button.className = "calendar-day";

    if (!isCurrentMonth) button.classList.add("empty");
    if (key === selectedDateKey) button.classList.add("selected");
    if (key === todayKey) button.classList.add("today");
    if (meta && meta.rooms.size > 0) button.classList.add("booked");
    if (meta?.hasPendingBooking || meta?.pending) button.classList.add("pending");

    const lines = [];
    if (meta?.pending) lines.push(`<span class="calendar-stat calendar-stat-pending">${meta.pending} Pending</span>`);
    if (meta?.hasPendingBooking) lines.push(`<span class="calendar-stat calendar-stat-pending">Waiting for confirmation</span>`);
    if (meta?.normalRooms?.size) lines.push(`<span class="calendar-stat calendar-stat-normal">${meta.normalRooms.size} Normal</span>`);
    if (meta?.kitchenRooms?.size) lines.push(`<span class="calendar-stat calendar-stat-kitchen">${meta.kitchenRooms.size} Kitchen</span>`);
    if (meta?.driverRooms?.size) lines.push(`<span class="calendar-stat calendar-stat-driver">${meta.driverRooms.size} Driver</span>`);

    button.innerHTML = `
      <span class="calendar-day-number">${cursor.getDate()}</span>
      <span class="calendar-day-meta">
        ${lines.length ? lines.join("") : `<span class="calendar-empty-text">Free</span>`}
      </span>
    `;

    button.addEventListener("click", async () => {
      viewDateInput.value = key;
      if (cursor.getMonth() !== state.currentMonthDate.getMonth()) {
        state.currentMonthDate = startOfMonth(cursor);
        await loadMonthCalendar();
      } else {
        renderMonthCalendar(bookings, requests);
      }
      await loadBookingsForDate(key);
    });

    monthGrid.appendChild(button);
  }
}

async function loadMonthCalendar() {
  if (!state.currentProfile?.approved) return;
  try {
    const monthStart = formatDateKey(startOfMonth(state.currentMonthDate));
    const monthAfterEnd = formatDateKey(addDays(endOfMonth(state.currentMonthDate), 1));
    const bookings = await fetchBookingsForPeriod(monthStart, monthAfterEnd);
    const requests = await fetchRequests();
    renderMonthCalendar(bookings, requests);
  } catch (error) {
    showToast(error.message, true);
  }
}

async function refreshLiveViews() {
  if (!state.currentProfile?.approved) return;
  await loadMonthCalendar();
  await refreshAvailability();
  if (viewDateInput.value) {
    await loadBookingsForDate(viewDateInput.value);
  }
  if (plannerStartDateInput?.value) {
    await loadReservationPlanner();
  }
  await loadHoldBookings();
  if (screens.analytics?.classList.contains("screen-active")) {
    await loadAnalytics();
  }
  if (canAccessDeductions() && screens.deductions?.classList.contains("screen-active")) {
    await loadDeductions();
  }
  if (canAccessNotifications() && screens.notifications?.classList.contains("screen-active")) {
    await loadNotifications({ markVisibleRead: true });
  } else if (canAccessNotifications()) {
    await loadNotificationUnreadCount();
  }
  if (canAccessSystemUpdates() && screens.systemUpdates?.classList.contains("screen-active")) {
    await loadSystemUpdates();
  }
}

async function setupRealtime() {
  if (!state.supabase || !state.currentProfile?.approved) return;

  if (state.realtimeChannel) {
    await state.supabase.removeChannel(state.realtimeChannel);
    state.realtimeChannel = null;
  }

  state.realtimeChannel = state.supabase
    .channel("bookings-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: CONFIG.SUPABASE_TABLE },
      async () => {
        setSyncState("live");
        await refreshLiveViews();
        await loadRequests();
      }
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: CONFIG.SUPABASE_REQUESTS_TABLE },
      async () => {
        setSyncState("live");
        await loadRequests();
        await refreshLiveViews();
      }
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: CONFIG.SUPABASE_ROOMS_TABLE },
      async () => {
        setSyncState("live");
        await loadRoomInventory();
        await refreshLiveViews();
      }
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: CONFIG.SUPABASE_SERVICES_TABLE },
      async () => {
        setSyncState("live");
        await loadServiceCatalog();
        await refreshLiveViews();
      }
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: CONFIG.SUPABASE_PRICING_TABLE },
      async () => {
        setSyncState("live");
        await loadRoomPricing();
        await refreshLiveViews();
      }
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: CONFIG.SUPABASE_NOTIFICATIONS_TABLE },
      async () => {
        setSyncState("live");
        if (canAccessNotifications() && screens.notifications?.classList.contains("screen-active")) {
          await loadNotifications({ markVisibleRead: true });
        } else if (canAccessNotifications()) {
          await loadNotificationUnreadCount();
        }
      }
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: CONFIG.SUPABASE_NOTIFICATION_READS_TABLE },
      async () => {
        if (canAccessNotifications() && screens.notifications?.classList.contains("screen-active")) {
          await loadNotifications();
        } else if (canAccessNotifications()) {
          await loadNotificationUnreadCount();
        }
      }
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: CONFIG.SUPABASE_SYSTEM_UPDATES_TABLE },
      async () => {
        if (canAccessSystemUpdates() && screens.systemUpdates?.classList.contains("screen-active")) {
          await loadSystemUpdates();
        }
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") setSyncState("live");
      else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") setSyncState("error");
      else setSyncState("connecting");
    });
}

async function fetchAccounts() {
  ensureSupabase();
  const { data, error } = await state.supabase
    .from(CONFIG.SUPABASE_PROFILES_TABLE)
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(normalizeProfileRow);
}

async function updateAccount(userId, values) {
  ensureSupabase();
  const { error } = await state.supabase
    .from(CONFIG.SUPABASE_PROFILES_TABLE)
    .update(values)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}

function renderAccounts(profiles) {
  accountsList.innerHTML = "";
  accountsEmpty.style.display = profiles.length ? "none" : "block";

  profiles.forEach((profile) => {
    const isSelf = profile.user_id === state.currentSession?.user?.id;
    const ownerCanEditPermissions = getEffectiveProfile()?.role === "owner" && !isSelf;
    const accountManagerCanApprove = canManageAccounts() && !isSelf;
    const extraPermissions = normalizePermissionList(profile.extra_permissions);
    const hasAdminAccess = permissionListHasAll(extraPermissions, ADMIN_ACCESS_PERMISSION_KEYS);
    const permissionChips = extraPermissions.length
      ? extraPermissions
        .map((permissionKey) => EXTRA_PERMISSION_DEFS.find((item) => item.key === permissionKey)?.label || permissionKey)
        .map((label) => `<span class="permission-chip">${label}</span>`)
        .join("")
      : `<span class="inline-note">No extra access granted.</span>`;
    const card = document.createElement("div");
    card.className = "account-card";

    const roleOptions = ["user", "admin", "owner"]
      .map((role) => {
        const disabled = getEffectiveProfile()?.role !== "owner" && role === "owner";
        return `<option value="${role}"${role === profile.role ? " selected" : ""}${disabled ? " disabled" : ""}>${role}</option>`;
      })
      .join("");

    card.innerHTML = `
      <div class="account-head">
        <div>
          <h4>${profile.full_name || profile.username}</h4>
          <p>@${profile.username}</p>
        </div>
        <span class="booking-tag ${profile.approved ? "tag-success" : "tag-pending"}">${profile.approved ? "Approved" : "Pending"}</span>
      </div>
      <div class="account-meta">
        <div><strong>Phone:</strong> ${profile.phone || "-"}</div>
        <div><strong>Role:</strong> ${profile.role}</div>
      </div>
      <div class="account-permissions">
        <span class="account-section-label">Extra Access</span>
        <div class="permission-chip-list">${permissionChips}</div>
      </div>
      <div class="account-actions">
        <label>
          Role
          <select data-role-select ${ownerCanEditPermissions ? "" : "disabled"}>${roleOptions}</select>
        </label>
        <label>
          Access
          <select data-approved-select ${accountManagerCanApprove ? "" : "disabled"}>
            <option value="true"${profile.approved ? " selected" : ""}>Approved</option>
            <option value="false"${!profile.approved ? " selected" : ""}>Blocked</option>
          </select>
        </label>
        <label class="permission-option permission-option-master">
          <input
            type="checkbox"
            data-admin-access-toggle
            ${hasAdminAccess ? "checked" : ""}
            ${ownerCanEditPermissions ? "" : "disabled"}
          />
          <span>
            <strong>Admin Access</strong>
            <small>Grant or remove the main admin work access with one tick.</small>
          </span>
        </label>
        <div class="account-permission-grid">
          ${EXTRA_PERMISSION_DEFS.map((permission) => `
            <label class="permission-option">
              <input
                type="checkbox"
                data-permission-key="${permission.key}"
                ${extraPermissions.includes(permission.key) ? "checked" : ""}
                ${ownerCanEditPermissions ? "" : "disabled"}
              />
              <span>
                <strong>${permission.label}</strong>
                <small>${permission.note}</small>
              </span>
            </label>
          `).join("")}
        </div>
        <button type="button" class="secondary-btn small-btn" data-save-account ${ownerCanEditPermissions || accountManagerCanApprove ? "" : "disabled"}>Save</button>
      </div>
    `;

    const saveBtn = card.querySelector("[data-save-account]");
    const roleSelect = card.querySelector("[data-role-select]");
    const approvedSelect = card.querySelector("[data-approved-select]");
    const adminAccessToggle = card.querySelector("[data-admin-access-toggle]");
    const permissionInputs = Array.from(card.querySelectorAll("[data-permission-key]"));

    const syncAdminAccessToggle = () => {
      if (!adminAccessToggle) return;
      const selectedPermissions = permissionInputs
        .filter((input) => input.checked)
        .map((input) => input.dataset.permissionKey);
      adminAccessToggle.checked = permissionListHasAll(selectedPermissions, ADMIN_ACCESS_PERMISSION_KEYS);
    };

    adminAccessToggle?.addEventListener("change", () => {
      const shouldEnableAdminAccess = adminAccessToggle.checked;
      permissionInputs.forEach((input) => {
        if (ADMIN_ACCESS_PERMISSION_KEYS.includes(input.dataset.permissionKey)) {
          input.checked = shouldEnableAdminAccess;
        }
      });
    });

    permissionInputs.forEach((input) => {
      input.addEventListener("change", syncAdminAccessToggle);
    });

    saveBtn.addEventListener("click", async () => {
      try {
        saveBtn.disabled = true;
        saveBtn.textContent = "Saving...";
        const nextRole = roleSelect.value;
        const nextApproved = approvedSelect.value === "true";
        const nextPermissions = permissionInputs
          .filter((input) => input.checked)
          .map((input) => input.dataset.permissionKey);
        const values = getEffectiveProfile()?.role === "owner"
          ? { role: nextRole, approved: nextApproved, extra_permissions: nextPermissions }
          : { approved: nextApproved };
        await updateAccount(profile.user_id, values);
        showToast("Account updated.");
        await loadAccounts();
      } catch (error) {
        showToast(error.message, true);
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = "Save";
      }
    });

    accountsList.appendChild(card);
  });
}

async function loadAccounts() {
  if (!canManageAccounts()) return;
  try {
    const profiles = await fetchAccounts();
    state.profileMap = new Map(profiles.map((profile) => [profile.user_id, profile]));
    renderAccounts(profiles);
  } catch (error) {
    showToast(error.message, true);
  }
}

async function loadRequests() {
  if (!state.currentProfile?.approved) return;
  try {
    if (canManageRequests() && state.profileMap.size <= 1) {
      const profiles = await fetchAccounts();
      state.profileMap = new Map(profiles.map((profile) => [profile.user_id, profile]));
    }
    const requests = await fetchRequests();
    renderRequests(requests);
  } catch (error) {
    showToast(error.message, true);
  }
}

function normalizeNotificationRow(row = {}) {
  return {
    id: row.id || "",
    bookingId: row.booking_id || "",
    trackCode: row.track_code || "",
    requestId: row.request_id || "",
    eventType: row.event_type || "",
    title: row.title || "Booking Update",
    message: row.message || "",
    actorUserId: row.actor_user_id || "",
    actorName: row.actor_name || "",
    targetUserId: row.target_user_id || "",
    audience: row.audience || "owner_admin",
    metadata: row.metadata && typeof row.metadata === "object" ? row.metadata : {},
    createdAt: row.created_at || "",
    isRead: Boolean(row.isRead),
  };
}

function getNotificationActorName() {
  return state.currentProfile?.full_name || state.currentProfile?.username || "System";
}

function formatNotificationTimestamp(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isNotificationSchemaMissing(message = "") {
  const text = String(message || "").toLowerCase();
  return text.includes("booking_notifications")
    || text.includes("booking_notification_reads")
    || text.includes("notification_roles");
}

function isSystemUpdateSchemaMissing(message = "") {
  const text = String(message || "").toLowerCase();
  return text.includes("system_update_history")
    || text.includes("system_update_roles");
}

function getNotificationRangeLabel(presetKey, from, to) {
  switch (presetKey) {
    case "this-week":
      return `${formatDateKey(from)} -> ${formatDateKey(to)}`;
    case "this-month":
      return "This Month";
    case "this-year":
      return "This Year";
    case "last-month":
      return "Last Month";
    default:
      return `${formatDateKey(from)} -> ${formatDateKey(to)}`;
  }
}

function formatSystemUpdateTime(value) {
  return formatNotificationTimestamp(value);
}

async function insertSystemUpdate(payload = {}) {
  ensureSupabase();
  if (!state.currentSession?.user?.id) return;
  const row = {
    update_type: payload.updateType || "settings_saved",
    title: payload.title || "System Update",
    message: payload.message || "",
    actor_user_id: state.currentSession.user.id,
    actor_name: payload.actorName || getNotificationActorName(),
    metadata: payload.metadata || {},
  };
  const { error } = await state.supabase.from(CONFIG.SUPABASE_SYSTEM_UPDATES_TABLE).insert(row);
  if (error) {
    if (isSystemUpdateSchemaMissing(error.message)) return;
    throw new Error(error.message || "Could not save system update.");
  }
}

function normalizeSystemUpdateRow(row = {}) {
  return {
    id: row.id || "",
    updateType: row.update_type || "",
    title: row.title || "System Update",
    message: row.message || "",
    actorUserId: row.actor_user_id || "",
    actorName: row.actor_name || "",
    metadata: row.metadata && typeof row.metadata === "object" ? row.metadata : {},
    createdAt: row.created_at || "",
  };
}

function getReactivateModeLabel(mode) {
  switch (String(mode || "")) {
    case "edit_panel":
      return "Reactivated and opened edit panel";
    case "current_date":
      return "Moved to today";
    case "custom_date":
      return "Moved to custom date";
    case "keep_old_date":
      return "Kept previous stay dates";
    default:
      return "";
  }
}

function getSystemUpdateDetailLines(item = {}) {
  const metadata = item.metadata && typeof item.metadata === "object" ? item.metadata : {};
  const lines = [];

  if (metadata.trackCode) lines.push(`Track Code: ${metadata.trackCode}`);
  if (metadata.guestName) lines.push(`Customer: ${metadata.guestName}`);
  if (metadata.checkIn || metadata.checkOut) lines.push(`Stay: ${metadata.checkIn || "-"} -> ${metadata.checkOut || "-"}`);

  const reactivateLabel = getReactivateModeLabel(metadata.reactivationMode);
  if (reactivateLabel) lines.push(`Reactivate Date: ${reactivateLabel}`);
  if (metadata.note) lines.push(`Note: ${metadata.note}`);
  if (typeof metadata.serviceCount === "number") lines.push(`Services at checkout: ${metadata.serviceCount}`);

  if (Array.isArray(metadata.changedBits)) {
    metadata.changedBits.forEach((itemText) => {
      if (itemText) lines.push(`Changed: ${itemText}`);
    });
  }

  if (Array.isArray(metadata.changes)) {
    metadata.changes.forEach((change) => {
      if (!change?.label) return;
      lines.push(`${change.label}: ${formatMoney(change.previousPrice || 0)} -> ${formatMoney(change.nextPrice || 0)}`);
    });
  }

  if (Array.isArray(metadata.added)) {
    metadata.added.forEach((name) => {
      if (name) lines.push(`Added: ${name}`);
    });
  }

  if (Array.isArray(metadata.removed)) {
    metadata.removed.forEach((name) => {
      if (name) lines.push(`Removed: ${name}`);
    });
  }

  if (Array.isArray(metadata.changed)) {
    metadata.changed.forEach((name) => {
      if (name) lines.push(`Updated: ${name}`);
    });
  }

  if (typeof metadata.addedCount === "number" || typeof metadata.removedCount === "number" || typeof metadata.changedCount === "number") {
    lines.push(
      [
        typeof metadata.addedCount === "number" ? `Added ${metadata.addedCount}` : "",
        typeof metadata.removedCount === "number" ? `Removed ${metadata.removedCount}` : "",
        typeof metadata.changedCount === "number" ? `Changed ${metadata.changedCount}` : "",
      ].filter(Boolean).join(" · "),
    );
  }

  return Array.from(new Set(lines.filter(Boolean)));
}

async function fetchSystemUpdates({ from = null, to = null, limit = 300 } = {}) {
  ensureSupabase();
  let query = state.supabase
    .from(CONFIG.SUPABASE_SYSTEM_UPDATES_TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (from) {
    const start = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 0, 0, 0);
    query = query.gte("created_at", start.toISOString());
  }
  if (to) {
    const endExclusive = new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1, 0, 0, 0);
    query = query.lt("created_at", endExclusive.toISOString());
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message || "Could not load system updates.");
  return (data || []).map(normalizeSystemUpdateRow);
}

function renderSystemUpdates() {
  if (!systemUpdatesList || !systemUpdatesEmpty) return;

  systemUpdatePresetButtons.forEach((button) => {
    button.classList.toggle("filter-chip-active", button.dataset.systemUpdatePreset === state.systemUpdatePreset);
  });

  if (!canAccessSystemUpdates()) {
    systemUpdatesList.innerHTML = "";
    systemUpdatesEmpty.style.display = "block";
    systemUpdatesEmpty.textContent = "System Updates page is not enabled for this role.";
    if (systemUpdateRangeLabel) systemUpdateRangeLabel.textContent = "-";
    if (systemUpdateTotalCount) systemUpdateTotalCount.textContent = "0";
    if (systemUpdateLatestTime) systemUpdateLatestTime.textContent = "-";
    return;
  }

  if (deleteSystemUpdatesRangeBtn) deleteSystemUpdatesRangeBtn.classList.toggle("hidden", !canManagePricing());
  if (deleteSystemUpdatesAllBtn) deleteSystemUpdatesAllBtn.classList.toggle("hidden", !canManagePricing());
  if (systemUpdateDeleteFromInput) systemUpdateDeleteFromInput.disabled = !canManagePricing();
  if (systemUpdateDeleteToInput) systemUpdateDeleteToInput.disabled = !canManagePricing();

  const { from, to } = getPresetRangeDates(state.systemUpdatePreset);
  if (systemUpdateRangeLabel) systemUpdateRangeLabel.textContent = getNotificationRangeLabel(state.systemUpdatePreset, from, to);
  if (systemUpdateTotalCount) systemUpdateTotalCount.textContent = String(state.systemUpdates.length);
  if (systemUpdateLatestTime) systemUpdateLatestTime.textContent = state.systemUpdates[0]?.createdAt ? formatSystemUpdateTime(state.systemUpdates[0].createdAt) : "-";

  if (!state.systemUpdates.length) {
    systemUpdatesList.innerHTML = "";
    systemUpdatesEmpty.style.display = "block";
    systemUpdatesEmpty.textContent = "No system updates in this range.";
    return;
  }

  systemUpdatesEmpty.style.display = "none";
  systemUpdatesList.innerHTML = state.systemUpdates.map((item) => {
    const metaBits = [
      item.actorName || "System",
      formatSystemUpdateTime(item.createdAt),
    ];
    const detailLines = getSystemUpdateDetailLines(item);
    return `
      <article class="notification-card">
        <div class="notification-card-head">
          <span class="booking-tag tag-success">${escapeHtml(item.title)}</span>
          <span class="notification-card-time">${escapeHtml(formatSystemUpdateTime(item.createdAt))}</span>
        </div>
        <strong class="notification-card-message">${escapeHtml(item.message)}</strong>
        <span class="notification-card-meta">${escapeHtml(metaBits.join(" | "))}</span>
        ${detailLines.length ? `
          <div class="system-update-detail-list">
            ${detailLines.map((line) => `<span class="system-update-detail-pill">${escapeHtml(line)}</span>`).join("")}
          </div>
        ` : ""}
      </article>
    `;
  }).join("");
}

async function loadSystemUpdates({ presetKey = state.systemUpdatePreset } = {}) {
  if (!canAccessSystemUpdates()) {
    state.systemUpdates = [];
    renderSystemUpdates();
    return;
  }

  try {
    state.systemUpdatePreset = presetKey;
    const { from, to } = getPresetRangeDates(presetKey);
    state.systemUpdates = await fetchSystemUpdates({ from, to, limit: 300 });
    renderSystemUpdates();
  } catch (error) {
    if (isSystemUpdateSchemaMissing(error.message)) {
      state.systemUpdates = [];
      renderSystemUpdates();
      return;
    }
    showToast(error.message, true);
  }
}

async function deleteSystemUpdatesRange() {
  ensureSupabase();
  const from = systemUpdateDeleteFromInput?.value || "";
  const to = systemUpdateDeleteToInput?.value || "";
  if (!from || !to) {
    throw new Error("Select both from and to dates.");
  }
  if (from > to) {
    throw new Error("Delete range end date must be after start date.");
  }
  const confirmed = window.confirm(`Delete system update history from ${from} to ${to}?`);
  if (!confirmed) return false;

  const start = new Date(parseDate(from));
  start.setHours(0, 0, 0, 0);
  const endExclusive = new Date(parseDate(to));
  endExclusive.setDate(endExclusive.getDate() + 1);
  endExclusive.setHours(0, 0, 0, 0);

  const { error } = await state.supabase
    .from(CONFIG.SUPABASE_SYSTEM_UPDATES_TABLE)
    .delete()
    .gte("created_at", start.toISOString())
    .lt("created_at", endExclusive.toISOString());
  if (error) throw new Error(error.message || "Could not delete system update range.");
  return true;
}

async function deleteAllSystemUpdates() {
  ensureSupabase();
  const confirmed = window.confirm("Delete all system update history?");
  if (!confirmed) return false;
  const { error } = await state.supabase
    .from(CONFIG.SUPABASE_SYSTEM_UPDATES_TABLE)
    .delete()
    .not("id", "is", null);
  if (error) throw new Error(error.message || "Could not delete all system update history.");
  return true;
}

async function insertNotification(payload = {}) {
  ensureSupabase();
  if (!state.currentSession?.user?.id) return;
  const row = {
    booking_id: payload.bookingId || null,
    track_code: payload.trackCode || null,
    request_id: payload.requestId || null,
    event_type: payload.eventType || "booking_updated",
    title: payload.title || "Booking Update",
    message: payload.message || "",
    actor_user_id: state.currentSession.user.id,
    actor_name: payload.actorName || getNotificationActorName(),
    target_user_id: payload.targetUserId || null,
    audience: payload.audience || "owner_admin",
    metadata: payload.metadata || {},
  };
  const { error } = await state.supabase.from(CONFIG.SUPABASE_NOTIFICATIONS_TABLE).insert(row);
  if (error) {
    if (isNotificationSchemaMissing(error.message)) return;
    throw new Error(error.message || "Could not save notification.");
  }
}

async function fetchNotifications({ from = null, to = null, limit = 300 } = {}) {
  ensureSupabase();
  let query = state.supabase
    .from(CONFIG.SUPABASE_NOTIFICATIONS_TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (from) {
    const start = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 0, 0, 0);
    query = query.gte("created_at", start.toISOString());
  }
  if (to) {
    const endExclusive = new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1, 0, 0, 0);
    query = query.lt("created_at", endExclusive.toISOString());
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message || "Could not load notifications.");
  return (data || []).map(normalizeNotificationRow);
}

async function fetchNotificationReadIds(notificationIds = []) {
  ensureSupabase();
  if (!notificationIds.length || !state.currentSession?.user?.id) return new Set();
  const { data, error } = await state.supabase
    .from(CONFIG.SUPABASE_NOTIFICATION_READS_TABLE)
    .select("notification_id")
    .eq("user_id", state.currentSession.user.id)
    .in("notification_id", notificationIds);
  if (error) throw new Error(error.message || "Could not load notification reads.");
  return new Set((data || []).map((row) => row.notification_id));
}

function syncNotificationReadState(readIds = new Set()) {
  state.notifications = state.notifications.map((notification) => ({
    ...notification,
    isRead: readIds.has(notification.id) || notification.isRead,
  }));
  state.recentNotifications = state.recentNotifications.map((notification) => ({
    ...notification,
    isRead: readIds.has(notification.id) || notification.isRead,
  }));
  state.notificationUnreadCount = state.recentNotifications.filter((notification) => !notification.isRead).length;
  updateNotificationBadge();
}

async function markNotificationsRead(notificationIds = []) {
  ensureSupabase();
  const unreadIds = Array.from(new Set((notificationIds || []).filter(Boolean))).filter((id) => {
    const current = state.notifications.find((item) => item.id === id) || state.recentNotifications.find((item) => item.id === id);
    return !current?.isRead;
  });
  if (!unreadIds.length || !state.currentSession?.user?.id) return;
  const rows = unreadIds.map((notificationId) => ({
    notification_id: notificationId,
    user_id: state.currentSession.user.id,
    read_at: new Date().toISOString(),
  }));
  const { error } = await state.supabase
    .from(CONFIG.SUPABASE_NOTIFICATION_READS_TABLE)
    .upsert(rows, { onConflict: "notification_id,user_id" });
  if (error) throw new Error(error.message || "Could not mark notifications as read.");
  syncNotificationReadState(new Set(unreadIds));
}

async function loadNotificationUnreadCount() {
  if (!canAccessNotifications()) {
    state.recentNotifications = [];
    state.notificationUnreadCount = 0;
    updateNotificationBadge();
    return;
  }
  try {
    const notifications = await fetchNotifications({ limit: 120 });
    const readIds = await fetchNotificationReadIds(notifications.map((item) => item.id));
    state.recentNotifications = notifications.map((notification) => ({
      ...notification,
      isRead: readIds.has(notification.id),
    }));
    state.notificationUnreadCount = state.recentNotifications.filter((notification) => !notification.isRead).length;
    updateNotificationBadge();
  } catch (error) {
    state.recentNotifications = [];
    state.notificationUnreadCount = 0;
    updateNotificationBadge();
    if (!isNotificationSchemaMissing(error.message)) {
      throw error;
    }
  }
}

async function openNotificationTarget(notificationId) {
  const notification = state.notifications.find((item) => item.id === notificationId)
    || state.recentNotifications.find((item) => item.id === notificationId);
  if (!notification) return;

  await markNotificationsRead([notification.id]);

  if (notification.eventType === "room_price_updated") {
    setScreen("pricing");
    jumpToSettingsSection("settings-prices");
    return;
  }

  if (notification.eventType === "new_user_joined") {
    if (canManageAccounts()) {
      setScreen("accounts");
      await loadAccounts();
      return;
    }
    showToast("User join update opened.", false);
    return;
  }

  if (notification.requestId) {
    setScreen("requests");
    state.requestsFilterStatus = "all";
    requestsTrackFilter.value = notification.trackCode || "";
    await loadRequests();
    return;
  }

  if (notification.trackCode) {
    const bookings = await fetchBookingsByTrackCode(notification.trackCode);
    if (bookings.length) {
      mergeBookingsIntoStateMap(bookings);
      const grouped = groupBookingsForDisplay(bookings);
      const group = grouped[0];
      if (group) {
        state.bookingGroups = new Map([...state.bookingGroups, [group.key, group]]);
        setScreen("view");
        openBookingDetailsModal(group.key);
        return;
      }
    }
  }

  showToast("Related booking could not be opened.", true);
}

function renderNotifications() {
  if (!notificationsList || !notificationsEmpty) return;

  notificationPresetButtons.forEach((button) => {
    button.classList.toggle("filter-chip-active", button.dataset.notificationPreset === state.notificationPreset);
  });

  if (!canAccessNotifications()) {
    notificationsList.innerHTML = "";
    notificationsEmpty.style.display = "block";
    notificationsEmpty.textContent = "Notifications are not enabled for this role.";
    if (notificationRangeLabel) notificationRangeLabel.textContent = "-";
    if (notificationTotalCount) notificationTotalCount.textContent = "0";
    if (notificationUnreadCount) notificationUnreadCount.textContent = "0";
    return;
  }

  const { from, to } = getPresetRangeDates(state.notificationPreset);
  const unreadInRange = state.notifications.filter((notification) => !notification.isRead).length;
  if (notificationRangeLabel) notificationRangeLabel.textContent = getNotificationRangeLabel(state.notificationPreset, from, to);
  if (notificationTotalCount) notificationTotalCount.textContent = String(state.notifications.length);
  if (notificationUnreadCount) notificationUnreadCount.textContent = String(unreadInRange);

  if (!state.notifications.length) {
    notificationsList.innerHTML = "";
    notificationsEmpty.style.display = "block";
    notificationsEmpty.textContent = "No notifications in this range.";
    return;
  }

  notificationsEmpty.style.display = "none";
  notificationsList.innerHTML = state.notifications.map((notification) => {
    const guestName = notification.metadata?.guestName || "Guest";
    const metaBits = [
      notification.trackCode || "-",
      guestName,
      notification.actorName || "System",
      formatNotificationTimestamp(notification.createdAt),
    ];
    return `
      <button class="notification-card${notification.isRead ? "" : " notification-card-unread"}" type="button" data-notification-open="${notification.id}">
        <div class="notification-card-head">
          <span class="booking-tag ${notification.isRead ? "tag-success" : "tag-pending"}">${escapeHtml(notification.title)}</span>
          <span class="notification-card-time">${escapeHtml(formatNotificationTimestamp(notification.createdAt))}</span>
        </div>
        <strong class="notification-card-message">${escapeHtml(notification.message)}</strong>
        <span class="notification-card-meta">${escapeHtml(metaBits.join(" | "))}</span>
      </button>
    `;
  }).join("");

  notificationsList.querySelectorAll("[data-notification-open]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await openNotificationTarget(button.dataset.notificationOpen);
      } catch (error) {
        showToast(error.message || "Could not open the notification target.", true);
      }
    });
  });
}

async function loadNotifications({ presetKey = state.notificationPreset, markVisibleRead = false } = {}) {
  if (!canAccessNotifications()) {
    state.notifications = [];
    renderNotifications();
    return;
  }

  try {
    state.notificationPreset = presetKey;
    const { from, to } = getPresetRangeDates(presetKey);
    const notifications = await fetchNotifications({ from, to, limit: 300 });
    const readIds = await fetchNotificationReadIds(notifications.map((item) => item.id));
    state.notifications = notifications.map((notification) => ({
      ...notification,
      isRead: readIds.has(notification.id),
    }));
    renderNotifications();

    if (markVisibleRead) {
      const unreadIds = state.notifications.filter((notification) => !notification.isRead).map((notification) => notification.id);
      if (unreadIds.length) {
        await markNotificationsRead(unreadIds);
        renderNotifications();
      }
    }

    await loadNotificationUnreadCount();
  } catch (error) {
    if (isNotificationSchemaMissing(error.message)) {
      state.notifications = [];
      renderNotifications();
      return;
    }
    showToast(error.message, true);
  }
}

function initSupabase() {
  if (!isSupabaseConfigured()) {
    setSyncState("setup");
    return;
  }

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    setSyncState("error");
    showToast("Supabase client failed to load.", true);
    return;
  }

  state.supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

  state.supabase.auth.onAuthStateChange((_event, session) => {
    window.setTimeout(() => {
      applySession(session).catch((error) => {
        showToast(error.message || "Session update failed.", true);
      });
    }, 0);
  });
}

async function bootstrapSession() {
  if (!state.supabase) return;
  const {
    data: { session },
  } = await state.supabase.auth.getSession();
  await applySession(session);
}

function syncModalReasonDefaults() {
  refreshRequestModalNodeRefs();
  if (!requestReasonInput) return;
  const reason = requestReasonInput.value;
  const isDateChange = reason === "change_date";
  const isEditCustomerData = reason === "edit_booking_data";
  const isPriceChange = reason === "change_room_price";
  const isAdditionalRooms = reason === "additional_rooms";
  const isAdditionalServices = reason === "additional_services";
  const isRemoveRooms = reason === "remove_rooms";
  const isGroupLike = state.requestScope === "group";
  const isFullBookingEdit = isEditCustomerData && isGroupLike;
  const roomPickerField = requestRoomTypeInput ? requestRoomTypeInput.closest(".field.grid-2") : null;
  const priceGrid = requestWeekendRateInput ? requestWeekendRateInput.closest(".request-price-grid") : null;
  const guestField = requestGuestNameInput ? requestGuestNameInput.closest(".field") : null;
  const phoneField = requestPhoneInput ? requestPhoneInput.closest(".field") : null;
  const dateField = requestCheckInInput ? requestCheckInInput.closest(".field.grid-2") : null;
  const statusField = requestStatusInput ? requestStatusInput.closest(".field") : null;
  const notesField = requestNotesInput ? requestNotesInput.closest(".field") : null;
  const guestSection = guestField ? guestField.closest(".request-section-card") : null;
  const dateSection = dateField ? dateField.closest(".request-section-card") : null;
  const roomSection = roomPickerField ? roomPickerField.closest(".request-section-card") : null;
  const showSingleRoomFields = !(isGroupLike || isAdditionalRooms || isRemoveRooms || isAdditionalServices || isPriceChange);

  setText(requestCheckInLabel, isDateChange ? "New Check-in" : "Check-in");
  setText(requestCheckOutLabel, isDateChange ? "New Check-out" : "Check-out");
  toggleHidden(requestDateHelp, !isDateChange);
  toggleHidden(requestExtraRoomsSection, !isAdditionalRooms);
  toggleHidden(requestServicesSection, !isAdditionalServices);
  toggleHidden(requestRemoveRoomsSection, !isRemoveRooms);
  toggleHidden(requestBookingRoomsSection, !isEditCustomerData || state.requestScope !== "group");
  toggleHidden(requestPriceSection, !(isPriceChange || isFullBookingEdit));
  toggleHidden(priceGrid, isFullBookingEdit);
  toggleHidden(requestCustomPriceField, !isFullBookingEdit);
  toggleHidden(requestAdvanceField, !isFullBookingEdit);
  toggleHidden(roomPickerField, !showSingleRoomFields);
  toggleHidden(requestGuestsField, !showSingleRoomFields);
  toggleHidden(guestField, isPriceChange);
  toggleHidden(phoneField, isPriceChange);
  toggleHidden(dateField, isPriceChange);
  toggleHidden(statusField, isPriceChange);
  toggleHidden(notesField, isPriceChange);
  toggleHidden(guestSection, isPriceChange);
  toggleHidden(dateSection, isPriceChange);
  toggleHidden(roomSection, !showSingleRoomFields);
  setValue(requestStatusInput, getDefaultRequestStatus(requestReasonInput.value, state.activeBooking?.status || "Campaign"));
  renderRequestOfferPreview();
}

async function handleRequestSubmit(event) {
  event.preventDefault();
  if (!state.activeBooking) {
    showToast("Booking not selected.", true);
    return;
  }

  const reason = requestReasonInput.value;
  if (reason === "delete_booking" && !canManageBookings()) {
    showToast("Only owner/admin can delete full bookings.", true);
    return;
  }
  const effectiveScope = state.requestScope === "group" || reason === "edit_booking_data"
    ? "group"
    : state.requestScope;
  const isFullBookingEdit = reason === "edit_booking_data" && effectiveScope === "group";
  const selectedServices = Array.from(state.modalRequestedServices.values());
  const guestName = combineGuestTitleAndName(requestGuestTitleInput?.value, requestGuestNameInput.value);
  const payload = {
    guestName,
    phone: sanitizePhoneValue(requestPhoneInput.value),
    checkIn: requestCheckInInput.value,
    checkOut: requestCheckOutInput.value,
    roomType: requestRoomTypeInput.value,
    roomNumber: Number(requestRoomNumberInput.value),
    guests: Number(requestGuestsInput?.value || state.activeBooking.guests || 1),
    status: requestStatusInput.value,
    notes: mergeNotesAndServices(requestNotesInput.value.trim(), selectedServices),
    requestNote: requestMessageInput.value.trim(),
    requestedServices: selectedServices,
    requestedRemoveRooms: Array.from(state.modalRemoveRooms.values()),
    weekendRate: Number(requestWeekendRateInput?.value || state.activeBooking.weekendRate || state.activeBooking.weekdayRate || 0),
    weekdayRate: Number(requestWeekendRateInput?.value || state.activeBooking.weekendRate || state.activeBooking.weekdayRate || 0),
    offerPercentage: (reason === "change_room_price" || isFullBookingEdit)
      ? getRequestOfferPercentage()
      : Number(state.activeBooking.offerPercentage || 0),
    customPayments: isFullBookingEdit
      ? getRequestCustomPaymentsPayload()
      : normalizeCustomPayments(state.activeBooking.customPayments),
    advancePaid: isFullBookingEdit
      ? Boolean(requestAdvancePaidInput?.checked)
      : Boolean(state.activeBooking.advancePaid),
    advanceAmount: isFullBookingEdit
      ? (requestAdvancePaidInput?.checked ? roundCurrency(Number(requestAdvanceAmountInput?.value || 0)) : 0)
      : roundCurrency(Number(state.activeBooking.advanceAmount || 0)),
  };

  payload.roomTypeLabel = getRoomTypeLabelForGuests(payload.roomType, payload.guests, state.activeBooking?.acEnabled);
  payload.requestedExtraRooms = Array.from(state.modalExtraRooms.values());
  payload.requestedBookingRooms = reason === "edit_booking_data" && effectiveScope === "group"
    ? serializeBookingRoomEdits()
    : [];

  if (reason === "additional_rooms" && !payload.requestedExtraRooms.length) {
    showToast("Select at least one additional room.", true);
    return;
  }

  if (reason === "additional_services" && !payload.requestedServices.length) {
    showToast("Select at least one service.", true);
    return;
  }

  if (reason === "remove_rooms" && !payload.requestedRemoveRooms.length) {
    showToast("Select at least one room to remove.", true);
    return;
  }

  if (reason === "change_room_price" && payload.weekendRate < 0) {
    showToast("Price cannot be negative.", true);
    return;
  }

  if (isFullBookingEdit && payload.advancePaid && payload.advanceAmount <= 0) {
    showToast("Enter the advance payment amount.", true);
    return;
  }

  if (!payload.guestName || !payload.phone || !payload.checkIn || !payload.checkOut) {
    showToast("Fill all required booking fields.", true);
    return;
  }

  const start = parseDate(payload.checkIn);
  const end = parseDate(payload.checkOut);
  if (!start || !end || end <= start) {
    showToast("Check-out must be after check-in.", true);
    return;
  }

  requestSubmitBtn.disabled = true;
  requestSubmitBtn.textContent = state.modalMode === "edit" ? "Saving..." : "Submitting...";

  try {
    if (state.modalMode === "edit") {
      const pendingRequestTrackCode = String(
        (effectiveScope === "group"
          ? (state.activeBookingGroup[0]?.trackCode || state.activeBooking.trackCode || "")
          : (state.activeBooking.trackCode || ""))
        || "",
      ).trim();
      const pendingRequestBookingIds = new Set(
        (effectiveScope === "group"
          ? (state.activeBookingGroup.length ? state.activeBookingGroup : [state.activeBooking]).map((booking) => booking?.id)
          : [state.activeBooking.id])
          .map((id) => String(id || "").trim())
          .filter(Boolean),
      );
      if (reason === "remove_rooms") {
        payload.requestedRemoveRooms.forEach((room) => {
          const bookingId = String(room?.bookingId || "").trim();
          if (bookingId) pendingRequestBookingIds.add(bookingId);
        });
      }

      if (reason === "additional_rooms") {
        for (const roomConfig of payload.requestedExtraRooms) {
          const roomType = roomConfig.roomType;
          const roomNumber = Number(roomConfig.roomNumber);
          const pax = Number(roomConfig.pax || getRoomDef(roomType)?.maxPax || state.activeBooking.guests || 1);
          await ensureBookingAvailabilityForUpdate("", {
            checkIn: payload.checkIn,
            checkOut: payload.checkOut,
            roomType,
            roomNumber,
            status: payload.status,
          });
          await insertBooking({
            trackCode: state.activeBooking.trackCode || "",
            guestName: payload.guestName,
            phone: payload.phone,
      created_by_name: payload.createdByName || state.currentProfile?.full_name || state.currentProfile?.username || '',
            checkIn: payload.checkIn,
            checkOut: payload.checkOut,
            guests: String(pax),
            roomType,
            roomTypeLabel: getRoomTypeLabelForGuests(roomType, pax, true),
            roomNumber,
            acEnabled: true,
            roomsNeeded: payload.requestedExtraRooms.length,
            notes: payload.notes,
            status: payload.status,
            offerPercentage: payload.offerPercentage || state.activeBooking.offerPercentage || 0,
            advancePaid: Boolean(state.activeBooking.advancePaid),
            advanceAmount: Number(state.activeBooking.advanceAmount || 0),
            customPayments: state.activeBooking.customPayments || [],
          });
        }
      } else if (reason === "additional_services") {
        const targetBookings = effectiveScope === "group"
          ? (state.activeBookingGroup.length ? state.activeBookingGroup : [state.activeBooking])
          : [state.activeBooking];
        for (const bookingRow of targetBookings) {
          await updateBooking(bookingRow.id, {
            guestName: bookingRow.guestName,
            phone: bookingRow.phone,
            checkIn: bookingRow.checkIn,
            checkOut: bookingRow.checkOut,
            roomType: bookingRow.roomType,
            roomTypeLabel: bookingRow.roomTypeLabel,
            roomNumber: bookingRow.roomNumber,
            notes: payload.notes,
            status: bookingRow.status,
          });
        }
      } else if (reason === "remove_rooms") {
        for (const roomConfig of payload.requestedRemoveRooms) {
          const bookingRow = state.bookingMap.get(roomConfig.bookingId);
          if (!bookingRow) continue;
          await updateBooking(bookingRow.id, {
            guestName: bookingRow.guestName,
            phone: bookingRow.phone,
            checkIn: bookingRow.checkIn,
            checkOut: bookingRow.checkOut,
            roomType: bookingRow.roomType,
            roomTypeLabel: bookingRow.roomTypeLabel,
            roomNumber: bookingRow.roomNumber,
            notes: bookingRow.notes,
            status: "Cancelled",
          });
        }
      } else if (reason === "change_room_price") {
        await updateBooking(state.activeBooking.id, {
          guestName: state.activeBooking.guestName,
          phone: state.activeBooking.phone,
          checkIn: state.activeBooking.checkIn,
          checkOut: state.activeBooking.checkOut,
          guests: state.activeBooking.guests,
          roomType: state.activeBooking.roomType,
          roomTypeLabel: state.activeBooking.roomTypeLabel,
          roomNumber: state.activeBooking.roomNumber,
          notes: state.activeBooking.notes,
          status: state.activeBooking.status,
          weekendRate: payload.weekendRate,
          weekdayRate: payload.weekdayRate,
          offerPercentage: payload.offerPercentage,
        });
      } else if (reason === "hold") {
        await performGroupHold(
          getBookingGroupKey(state.activeBooking),
          payload.requestNote || payload.notes || "Customer requested to move this booking to hold.",
          "Hold",
        );
      } else if (reason === "edit_booking_data" && effectiveScope === "group") {
        const groupBookings = state.activeBookingGroup.length ? state.activeBookingGroup : [state.activeBooking];
        await applyGroupedBookingEdits(groupBookings, payload.requestedBookingRooms, payload);
      } else if (effectiveScope === "group") {
        const groupBookings = state.activeBookingGroup.length ? state.activeBookingGroup : [state.activeBooking];
        const sharedTrackCode = await resolveBookingTrackCode(
          groupBookings,
          payload.status,
          groupBookings[0]?.trackCode || "",
        );
        await ensureGroupAvailabilityForUpdate(groupBookings, payload.checkIn, payload.checkOut, payload.status);
        for (const bookingRow of groupBookings) {
          await updateBooking(bookingRow.id, {
            guestName: payload.guestName,
            phone: payload.phone,
      created_by_name: payload.createdByName || state.currentProfile?.full_name || state.currentProfile?.username || '',
            checkIn: payload.checkIn,
            checkOut: payload.checkOut,
            roomType: bookingRow.roomType,
            roomTypeLabel: bookingRow.roomTypeLabel,
            roomNumber: bookingRow.roomNumber,
            notes: payload.notes,
            status: payload.status,
            trackCode: sharedTrackCode,
          });
        }
      } else {
        await ensureBookingAvailabilityForUpdate(state.activeBooking.id, payload);
        await updateBooking(state.activeBooking.id, payload);
      }

      await insertChangeRequest({
        bookingId: state.activeBooking.id,
        reason,
        requestScope: effectiveScope,
        ...payload,
        requestStatusOverride: "approved",
        adminNote: payload.requestNote,
        reviewedBy: state.currentSession.user.id,
        reviewedAt: new Date().toISOString(),
      });
      await resolvePendingRequestsForTargets({
        trackCode: pendingRequestTrackCode,
        bookingIds: Array.from(pendingRequestBookingIds),
        adminNote: payload.requestNote || "Resolved while owner/admin updated the booking.",
      });
      await insertNotification({
        bookingId: state.activeBooking.id,
        trackCode: state.activeBooking.trackCode || "",
        eventType: "booking_updated",
        title: reason === "additional_rooms"
          ? "Rooms Added"
          : reason === "additional_services"
            ? "Services Updated"
            : reason === "remove_rooms"
              ? "Rooms Removed"
              : reason === "change_room_price"
                ? "Room Price Updated"
                : "Booking Updated",
        message: `${payload.guestName || state.activeBooking.guestName || "Guest"} booking details were updated.`,
        audience: "owner_admin",
        metadata: {
          guestName: payload.guestName || state.activeBooking.guestName || "Guest",
          reason,
        },
      });
      showToast(
        reason === "additional_rooms"
          ? "Additional rooms added."
          : reason === "additional_services"
            ? "Services updated."
            : reason === "remove_rooms"
              ? "Selected rooms removed."
              : reason === "change_room_price"
                ? "Room price updated."
              : "Booking updated."
      );
    } else {
      await insertChangeRequest({
        bookingId: state.activeBooking.id,
        reason,
        requestScope: effectiveScope,
        ...payload,
      });
      await insertNotification({
        bookingId: state.activeBooking.id,
        trackCode: state.activeBooking.trackCode || "",
        eventType: "request_created",
        title: "Request Submitted",
        message: `${payload.guestName || state.activeBooking.guestName || "Guest"} requested ${formatRequestReason(reason).toLowerCase()}.`,
        audience: "owner_admin",
        metadata: {
          guestName: payload.guestName || state.activeBooking.guestName || "Guest",
          reason,
        },
      });
      showToast("Request submitted.");
    }
    closeRequestModal();
    await loadRequests();
    await refreshLiveViews();
  } catch (error) {
    showToast(error.message, true);
  } finally {
    requestSubmitBtn.disabled = false;
    requestSubmitBtn.textContent = state.modalMode === "edit" ? "Save Booking" : "Submit Change Request";
  }
}

bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.currentProfile?.approved) {
    showToast("Login with an approved account first.", true);
    return;
  }

  const formData = new FormData(bookingForm);
  const payload = Object.fromEntries(formData.entries());
  payload.phone = sanitizePhoneValue(payload.phone);
  payload.guestName = combineGuestTitleAndName(bookingGuestTitleInput?.value, payload.guestName);
  payload.offerPercentage = getBookingOfferPercentage();
  payload.customPayments = getBookingCustomPaymentsPayload();
  payload.advancePaid = Boolean(bookingAdvancePaidInput?.checked);
  payload.advanceAmount = payload.advancePaid ? roundCurrency(Number(bookingAdvanceAmountInput?.value || 0)) : 0;
  bookingPhoneInput.value = payload.phone;

  if (!payload.guestName || !payload.phone) {
    showToast("Guest name and phone are required.", true);
    return;
  }

  if (payload.advancePaid && payload.advanceAmount <= 0) {
    showToast("Enter the advance payment amount.", true);
    return;
  }

  if (!payload.checkIn || !payload.checkOut) {
    showToast("Check-in and check-out dates are required.", true);
    return;
  }

  const checkInDate = parseDate(payload.checkIn);
  const checkOutDate = parseDate(payload.checkOut);
  if (!checkInDate || !checkOutDate || checkOutDate <= checkInDate) {
    showToast("Check-out must be after check-in.", true);
    return;
  }

  const submitButton = bookingForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Saving...";

  try {
    const selectedPlans = buildRoomList()
      .map((room) => {
        const plan = state.roomPlans.get(getRoomKey(room.type, room.number));
        const totalPlanGuests = Number(plan?.pax || 0) + Number(plan?.extraPax || 0);
        return plan && totalPlanGuests > 0
          ? {
              room,
              pax: Number(plan.pax || 0),
              extraPax: Number(plan.extraPax || 0),
              acEnabled: normalizeAcEnabled(room.type, plan.acEnabled),
              totalGuests: totalPlanGuests,
              nights: Number(plan.nights || getNightCount(payload.checkIn, payload.checkOut)),
            }
          : null;
      })
      .filter(Boolean);

    if (!selectedPlans.length) {
      throw new Error("Select at least one room with pax, extra pax / kids, or driver count.");
    }

    const totalGuests = selectedPlans.reduce((sum, plan) => sum + plan.totalGuests, 0);
    const totalDrivers = selectedPlans
      .filter((plan) => plan.room.type === "driver")
      .reduce((sum, plan) => sum + plan.pax, 0);
    const totalExtraGuests = selectedPlans.reduce((sum, plan) => sum + Number(plan.extraPax || 0), 0);
    guestsInput.value = String(totalGuests);
    driversTotalInput.value = totalDrivers ? String(totalDrivers) : "";
    extraGuestsTotalInput.value = totalExtraGuests ? String(totalExtraGuests) : "";
    const backupFailures = [];
    const savedTrackCodes = [];
    const sharedTrackCode = await getNextTrackCode(payload.status);

    for (const plan of selectedPlans) {
      const roomCheckOut = formatCheckoutFromNights(payload.checkIn, plan.nights);
      const roomBookings = await fetchRangeBookings(plan.room.type, payload.checkIn, roomCheckOut);
      const hasConflict = roomBookings.some((booking) => {
        if (!isBlockingBooking(booking)) return false;
        return Number(booking.roomNumber) === plan.room.number;
      });

      if (hasConflict) {
        throw new Error(`${getRoomLabel(plan.room.type, plan.room.number)} is already booked.`);
      }

      const notesParts = [payload.notes?.trim() || ""];
      const roomServices = Array.from(getSelectedBookingServices().values());
      if (plan.extraPax > 0) notesParts.push(`Extra pax / kids: ${plan.extraPax}`);
      if (plan.room.type === "driver" && plan.pax > 0) notesParts.push(`Drivers: ${plan.pax}`);
      if (roomServices.length) notesParts.push(`Services: ${roomServices.join(", ")}`);

      const bookingPayload = {
        ...payload,
        notes: notesParts.filter(Boolean).join(" | "),
        trackCode: sharedTrackCode,
        guests: String(plan.totalGuests),
        checkOut: roomCheckOut,
        roomType: plan.room.type,
        roomTypeLabel: getAssignedRoomLabel(plan.room, plan.pax, plan.extraPax, plan.acEnabled),
        roomNumber: plan.room.number,
        acEnabled: normalizeAcEnabled(plan.room.type, plan.acEnabled),
        roomsNeeded: selectedPlans.length,
      };

      const trackCode = await insertBooking(bookingPayload);
      savedTrackCodes.push(trackCode);

      try {
        await backupBookingToSheets(bookingPayload);
      } catch (error) {
        backupFailures.push(`${getRoomLabel(plan.room.type, plan.room.number)}: ${error.message}`);
      }
    }

    await insertNotification({
      trackCode: sharedTrackCode,
      eventType: "new_booking",
      title: "New Booking",
      message: `${payload.guestName || "Guest"} placed a new booking.`,
      audience: "owner_admin",
      metadata: {
        guestName: payload.guestName || "Guest",
        roomCount: selectedPlans.length,
      },
    });

    bookingForm.reset();
    const today = new Date();
    const tomorrow = addDays(today, 1);
    setBookingDateRange(toDateInputValue(today), toDateInputValue(tomorrow));
    setOfferSelection(bookingOfferOptions, bookingOfferCustomField, bookingOfferCustomInput, 0);
    if (bookingAdvancePaidInput) bookingAdvancePaidInput.checked = false;
    if (bookingAdvanceAmountInput) bookingAdvanceAmountInput.value = "";
    state.bookingCustomPayments = [];
    syncAdvanceAmountField();
    state.roomPlans.clear();
    state.bookingServices.clear();
    renderRoomServiceAssignments();
    guestsInput.value = "";
    renderPricingSummary();
    if (backupFailures.length) {
      showToast(`Saved live. Backup failed for ${backupFailures.length} room(s). First code: ${savedTrackCodes[0] || "-"}`, true);
    } else {
      showToast(`Saved. First track code: ${savedTrackCodes[0] || "-"}`);
    }
    await refreshAvailability();
    await refreshLiveViews();
  } catch (error) {
    showToast(error.message, true);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Save Booking";
  }
});

ensureRequestModalSections();
state.bookingViewMode = getDefaultBookingViewMode();
state.mobileNavDock = getStoredMobileNavDock();
applyBookingViewMode();
bindMobileNavDockControls();
if (plannerStartDateInput && !plannerStartDateInput.value) {
  plannerStartDateInput.value = toDateInputValue(new Date());
}
if (plannerRangeDaysInput && !plannerRangeDaysInput.value) {
  plannerRangeDaysInput.value = "14";
}

loginForm.addEventListener("submit", handleLogin);
signupForm.addEventListener("submit", handleSignup);
requestForm.addEventListener("submit", handleRequestSubmit);
bookingViewMobileBtn?.addEventListener("click", () => setBookingViewMode("mobile"));
bookingViewDesktopBtn?.addEventListener("click", () => setBookingViewMode("desktop"));
window.addEventListener("resize", () => {
  applyBookingViewMode();
  syncBottomNavLayout(Array.from(Object.values(navButtons)).filter((button) => button && !button.classList.contains("hidden")).length);
  if (screens.planner?.classList.contains("screen-active") && plannerStartDateInput?.value) {
    loadReservationPlanner();
  }
});
authTabLogin.addEventListener("click", () => setAuthTab("login"));
authTabSignup.addEventListener("click", () => setAuthTab("signup"));
pendingLogoutBtn.addEventListener("click", handleLogout);
logoutBtn.addEventListener("click", handleLogout);
loadBookingsBtn.addEventListener("click", () => loadBookingsForDate(viewDateInput.value));
viewDateTodayBtn?.addEventListener("click", async () => {
  await setViewDateSelection(new Date());
});
viewDateTomorrowBtn?.addEventListener("click", async () => {
  await setViewDateSelection(addDays(new Date(), 1));
});
viewDateOpenBtn?.addEventListener("click", () => {
  openNativeDatePicker(viewDateInput);
});
plannerPresetButtons.forEach((button) => {
  button.addEventListener("click", () => applyPlannerPreset(button.dataset.plannerPreset));
});
refreshAccountsBtn.addEventListener("click", () => loadAccounts());
refreshRequestsBtn.addEventListener("click", () => loadRequests());
refreshNotificationsBtn?.addEventListener("click", () => loadNotifications({ markVisibleRead: true }));
loadAnalyticsBtn?.addEventListener("click", () => loadAnalytics());
exportAnalyticsBtn?.addEventListener("click", () => exportAnalyticsReport());
analyticsQuickTodayBtn?.addEventListener("click", () => {
  const today = new Date();
  applyAnalyticsQuickRange(today, today);
});
analyticsQuickWeekBtn?.addEventListener("click", () => {
  const today = new Date();
  applyAnalyticsQuickRange(addDays(today, -6), today);
});
analyticsPickFromBtn?.addEventListener("click", () => {
  openNativeDatePicker(analyticsDateFromInput);
});
analyticsPickToBtn?.addEventListener("click", () => {
  openNativeDatePicker(analyticsDateToInput);
});
analyticsPresetButtons.forEach((button) => {
  button.addEventListener("click", () => applyAnalyticsPreset(button.dataset.analyticsPreset));
});
analyticsDateFromInput?.addEventListener("change", () => renderAnalyticsResultsContext());
analyticsDateToInput?.addEventListener("change", () => renderAnalyticsResultsContext());
analyticsFilterStateChips?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-analytics-chip-value]");
  if (!button) return;
  button.classList.toggle("filter-chip-active");
  loadAnalytics();
});
analyticsFilterSourceChips?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-analytics-chip-value]");
  if (!button) return;
  button.classList.toggle("filter-chip-active");
  loadAnalytics();
});
analyticsFilterStaffChips?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-analytics-chip-value]");
  if (!button) return;
  button.classList.toggle("filter-chip-active");
  loadAnalytics();
});
analyticsIncludeHoldPayments?.addEventListener("change", () => loadAnalytics());
analyticsIncludeDeductions?.addEventListener("change", () => loadAnalytics());
analyticsFilterMetric?.addEventListener("change", () => loadAnalytics());
deductionMonthFilterInput?.addEventListener("change", () => {
  loadDeductions(deductionMonthFilterInput.value);
});
addDeductionRowBtn?.addEventListener("click", () => {
  const currentRows = collectDeductionDraftRows();
  currentRows.push(createDeductionDraftRow(deductionMonthFilterInput?.value || currentRows[0]?.monthValue || ""));
  renderDeductionEntryRows(currentRows);
});
deductionEntryList?.addEventListener("click", (event) => {
  const removeBtn = event.target.closest("[data-remove-deduction-row]");
  if (!removeBtn) return;
  const currentRows = collectDeductionDraftRows();
  const index = Number(removeBtn.dataset.removeDeductionRow);
  currentRows.splice(index, 1);
  renderDeductionEntryRows(currentRows);
});
deductionForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    if (!canAccessDeductions()) throw new Error("Only owner or admin can save deductions.");
    const rows = collectDeductionDraftRows();
    if (!rows.length) throw new Error("Add at least one deduction.");
    saveDeductionBtn.disabled = true;
    if (addDeductionRowBtn) addDeductionRowBtn.disabled = true;
    saveDeductionBtn.textContent = rows.length > 1 ? "Saving Deductions..." : "Saving...";
    for (const row of rows) {
      await insertDeduction(row);
    }
    const totalAmount = roundCurrency(rows.reduce((sum, row) => sum + Number(row.amount || 0), 0));
    await insertSystemUpdate({
      updateType: "deduction_saved",
      title: rows.length > 1 ? "Deductions Saved" : "Deduction Saved",
      message: rows.length > 1
        ? `${rows.length} deductions saved.`
        : `${rows[0]?.title || "Deduction"} saved for ${formatMonthValueLabel(rows[0]?.monthValue || "")}.`,
      metadata: {
        entryCount: rows.length,
        monthValues: Array.from(new Set(rows.map((row) => row.monthValue).filter(Boolean))),
        totalAmount,
      },
    });
    renderDeductionEntryRows([createDeductionDraftRow(deductionMonthFilterInput?.value || toMonthInputValue(new Date()))]);
    showToast(rows.length > 1 ? `${rows.length} deductions saved.` : "Deduction saved.");
    await loadDeductions(deductionMonthFilterInput?.value || rows[0]?.monthValue || toMonthInputValue(new Date()));
    if (screens.analytics?.classList.contains("screen-active")) await loadAnalytics();
  } catch (error) {
    showToast(error.message, true);
  } finally {
    saveDeductionBtn.disabled = false;
    if (addDeductionRowBtn) addDeductionRowBtn.disabled = false;
    saveDeductionBtn.textContent = "Save Deductions";
  }
});
notificationPresetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    loadNotifications({ presetKey: button.dataset.notificationPreset, markVisibleRead: true });
  });
});
settingsJumpButtons.forEach((button) => {
  button.addEventListener("click", () => {
    jumpToSettingsSection(button.dataset.settingsJump);
  });
});
refreshPricingBtn?.addEventListener("click", async () => {
  await loadRoomInventory();
  await loadServiceCatalog();
  await loadRoomPricing();
  await loadRuntimeSettings();
});
savePricingBtn?.addEventListener("click", async () => {
  try {
    savePricingBtn.disabled = true;
    savePricingBtn.textContent = "Saving...";
    await saveRoomInventory();
    await saveServiceCatalog();
    await saveRoomPricing();
    await saveRuntimeSettings();
    await refreshLiveViews();
    showToast("Settings saved.");
  } catch (error) {
    showToast(error.message, true);
  } finally {
    savePricingBtn.disabled = false;
    savePricingBtn.textContent = "Save Settings";
  }
});
closeModalBtn.addEventListener("click", closeRequestModal);
closeBookingDetailsBtn.addEventListener("click", closeBookingDetailsModal);
requestReasonInput.addEventListener("change", syncModalReasonDefaults);
requestFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.filterMode) {
      state.requestsFilterMode = button.dataset.filterMode;
    }
    if (button.dataset.filterStatus) {
      state.requestsFilterStatus = button.dataset.filterStatus;
    }
    loadRequests();
  });
});
function handleRequestDateRangeChange() {
  state.requestsFilterMode = "date";
  loadRequests();
}

function handleBookingOfferChange() {
  syncOfferInputState(bookingOfferOptions, bookingOfferCustomField, bookingOfferCustomInput);
  renderPricingSummary();
}

function handleRequestOfferChange() {
  syncOfferInputState(requestOfferOptions, requestOfferCustomField, requestOfferCustomInput);
  renderRequestOfferPreview();
}

function handleAdvancePaymentToggle() {
  syncAdvanceAmountField();
  renderPricingSummary();
}

requestsDateFromFilter.addEventListener("change", handleRequestDateRangeChange);
requestsDateToFilter.addEventListener("change", handleRequestDateRangeChange);
requestsTrackFilter.addEventListener("input", () => loadRequests());
requestsRequestedByFilter.addEventListener("input", () => loadRequests());
bookingOfferOptions.forEach((input) => input.addEventListener("change", handleBookingOfferChange));
bookingOfferCustomInput?.addEventListener("input", handleBookingOfferChange);
requestOfferOptions.forEach((input) => input.addEventListener("change", handleRequestOfferChange));
requestOfferCustomInput?.addEventListener("input", handleRequestOfferChange);
requestWeekendRateInput?.addEventListener("input", renderRequestOfferPreview);
requestCheckInInput?.addEventListener("change", renderRequestOfferPreview);
requestCheckOutInput?.addEventListener("change", renderRequestOfferPreview);
requestAdvancePaidInput?.addEventListener("change", () => {
  syncRequestAdvanceAmountField();
  renderRequestOfferPreview();
});
requestAdvanceAmountInput?.addEventListener("input", renderRequestOfferPreview);
requestAddCustomPriceBtn?.addEventListener("click", () => {
  state.modalCustomPayments.push(createEmptyCustomPayment());
  renderRequestCustomPrices();
  renderRequestOfferPreview();
});
requestCustomPriceList?.addEventListener("input", (event) => {
  const row = event.target.closest("[data-request-payment-index]");
  if (!row) return;
  const index = Number(row.dataset.requestPaymentIndex);
  if (event.target.matches("[data-request-payment-amount]")) {
    handleRequestCustomPaymentInput(index, "amount", event.target.value);
  }
  if (event.target.matches("[data-request-payment-note]")) {
    handleRequestCustomPaymentInput(index, "note", event.target.value);
  }
});
requestCustomPriceList?.addEventListener("click", (event) => {
  const removeBtn = event.target.closest("[data-remove-request-payment]");
  if (!removeBtn) return;
  const index = Number(removeBtn.dataset.removeRequestPayment);
  state.modalCustomPayments.splice(index, 1);
  renderRequestCustomPrices();
  renderRequestOfferPreview();
});
bookingAdvancePaidInput?.addEventListener("change", handleAdvancePaymentToggle);
bookingAdvanceAmountInput?.addEventListener("input", renderPricingSummary);
bookingAddCustomPaymentBtn?.addEventListener("click", () => {
  state.bookingCustomPayments.push(createEmptyCustomPayment());
  renderBookingCustomPayments();
  renderPricingSummary();
});
bookingCustomPaymentList?.addEventListener("input", (event) => {
  const row = event.target.closest("[data-payment-index]");
  if (!row) return;
  const index = Number(row.dataset.paymentIndex);
  if (event.target.matches("[data-payment-amount]")) {
    handleBookingCustomPaymentInput(index, "amount", event.target.value);
  }
  if (event.target.matches("[data-payment-note]")) {
    handleBookingCustomPaymentInput(index, "note", event.target.value);
  }
});
bookingCustomPaymentList?.addEventListener("click", (event) => {
  const removeBtn = event.target.closest("[data-remove-payment]");
  if (!removeBtn) return;
  const index = Number(removeBtn.dataset.removePayment);
  state.bookingCustomPayments.splice(index, 1);
  renderBookingCustomPayments();
  renderPricingSummary();
});
handleBookingOfferChange();
handleRequestOfferChange();
syncAdvanceAmountField();
syncRequestAdvanceAmountField();
setStoredPlannerAccentColor(getStoredPlannerAccentColor());
state.plannerTrackColors = getStoredPlannerTrackColors();
syncPlannerColorPicker();
requestRoomTypeInput.addEventListener("change", () => {
  populateRequestRoomNumbers(requestRoomTypeInput.value, 1);
  populateRequestGuestsOptions(requestRoomTypeInput.value, requestGuestsInput?.value || 1);
});
requestGuestsInput?.addEventListener("change", () => {
  populateRequestGuestsOptions(requestRoomTypeInput.value, requestGuestsInput.value);
});
requestModal.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeRequestModal);
});
bookingDetailsModal.querySelectorAll("[data-close-booking-details]").forEach((element) => {
  element.addEventListener("click", closeBookingDetailsModal);
});

viewDateInput.addEventListener("change", async (event) => {
  const pickedDate = parseDate(event.target.value);
  if (pickedDate) {
    state.currentMonthDate = startOfMonth(pickedDate);
    await loadMonthCalendar();
  }
  await loadBookingsForDate(event.target.value);
});

Object.entries(bookingFilterButtons).forEach(([key, button]) => {
  button.addEventListener("click", async () => {
    state.bookingListFilter = key;
    await loadBookingsForDate(viewDateInput.value);
  });
});

plannerSearchInput?.addEventListener("input", () => {
  renderCurrentPlannerView();
});

plannerColorInput?.addEventListener("input", (event) => {
  if (!canEditPlannerColors()) {
    syncPlannerColorPicker();
    return;
  }
  if (state.selectedPlannerGroupKey) {
    setPlannerTrackColor(state.selectedPlannerGroupKey, event.target.value);
  } else {
    setStoredPlannerAccentColor(event.target.value);
  }
  renderCurrentPlannerView();
});

plannerColorInput?.addEventListener("change", async (event) => {
  if (!canEditPlannerColors()) {
    syncPlannerColorPicker();
    return;
  }
  const previousAccentColor = state.runtimeSettings?.plannerAccentColor || state.plannerAccentColor || "#93c0ec";
  const previousTrackColors = normalizePlannerTrackColors(state.runtimeSettings?.plannerTrackColors || state.plannerTrackColors);
  try {
    if (state.selectedPlannerGroupKey) {
      setPlannerTrackColor(state.selectedPlannerGroupKey, event.target.value);
    } else {
      setStoredPlannerAccentColor(event.target.value);
    }
    await savePlannerColorSettings();
    showToast("Planner colors updated.");
  } catch (error) {
    setStoredPlannerAccentColor(previousAccentColor);
    setStoredPlannerTrackColors(previousTrackColors);
    renderCurrentPlannerView();
    syncPlannerColorPicker();
    showToast(error.message, true);
  }
});

monthPrevBtn.addEventListener("click", async () => {
  state.currentMonthDate = new Date(state.currentMonthDate.getFullYear(), state.currentMonthDate.getMonth() - 1, 1, 12, 0, 0);
  await loadMonthCalendar();
});

monthNextBtn.addEventListener("click", async () => {
  state.currentMonthDate = new Date(state.currentMonthDate.getFullYear(), state.currentMonthDate.getMonth() + 1, 1, 12, 0, 0);
  await loadMonthCalendar();
});

checkAvailabilityBtn.addEventListener("click", refreshAvailability);

navButtons.booking.addEventListener("click", () => setScreen("booking"));
navButtons.view.addEventListener("click", () => setScreen("view"));
navButtons.planner.addEventListener("click", () => setScreen("planner"));
navButtons.analytics.addEventListener("click", () => setScreen("analytics"));
navButtons.deductions?.addEventListener("click", () => setScreen("deductions"));
navButtons.guide?.addEventListener("click", () => setScreen("guide"));
navButtons.hold?.addEventListener("click", () => setScreen("hold"));
navButtons.requests?.addEventListener("click", () => setScreen("requests"));
navButtons.notifications?.addEventListener("click", () => setScreen("notifications"));
navButtons.accounts?.addEventListener("click", () => setScreen("accounts"));
navButtons.pricing?.addEventListener("click", () => setScreen("pricing"));
notificationBellBtn?.addEventListener("click", () => setScreen("notifications"));
refreshGuideBtn?.addEventListener("click", () => loadGuideBook());
guideSearchInput?.addEventListener("input", () => renderGuideBookPage());
previewBannerResetBtn?.addEventListener("click", () => {
  state.uiPreviewRole = "";
  updateHeaderProfile();
  updateNavVisibility();
  renderPricingScreen();
});
plannerLoadBtn?.addEventListener("click", () => loadReservationPlanner());

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

(function init() {
  updateOnlineStatus();
  initSupabase();
  setAuthTab("login");
  setDefaultRoomInventoryState();
  setDefaultRoomPricingState();
  renderPricingScreen();
  applyPhoneSanitizer(signupPhoneInput);
  applyPhoneSanitizer(bookingPhoneInput);
  applyPhoneSanitizer(requestPhoneInput);

  const today = new Date();
  const tomorrow = addDays(today, 1);
  const monthStart = startOfMonth(today);
  const currentMonthValue = toMonthInputValue(today);
  state.currentMonthDate = startOfMonth(today);
  initBookingDateRangePicker(today, tomorrow);
  viewDateInput.value = toDateInputValue(today);
  if (analyticsDateFromInput) analyticsDateFromInput.value = toDateInputValue(monthStart);
  if (analyticsDateToInput) analyticsDateToInput.value = toDateInputValue(today);
  if (deductionMonthFilterInput) deductionMonthFilterInput.value = currentMonthValue;
  renderDeductionEntryRows([createDeductionDraftRow(currentMonthValue)]);
  renderAnalyticsResultsContext();
  renderDeductions([]);
  renderRoomStatus([]);
  updateStats([]);
  bootstrapSession();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  }
})();
