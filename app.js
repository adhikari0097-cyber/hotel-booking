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
  GOOGLE_SHEETS_BACKUP_URL: "/.netlify/functions/proxy",
};

const RESERVATION_WHATSAPP_NUMBER = "+94719707597";

const DEFAULT_SERVICE_DEFS = [
  { name: "Breakfast", defaultPrice: 0, isActive: true },
  { name: "Lunch", defaultPrice: 0, isActive: true },
  { name: "Dinner", defaultPrice: 0, isActive: true },
  { name: "Liquor", defaultPrice: 0, isActive: true },
  { name: "Kitchen", defaultPrice: 0, isActive: true },
  { name: "Car", defaultPrice: 0, isActive: true },
  { name: "Van", defaultPrice: 0, isActive: true },
];

const ROOM_DEFS = [
  { type: "kitchen", label: "Kitchen Room", count: 2, maxPax: 6 },
  { type: "normal", label: "Normal Room", count: 4, maxPax: 4 },
  { type: "driver", label: "Driver Room", count: 1, maxPax: 4 },
];

const ROOM_PRICING_DEFS = [
  { roomType: "kitchen", pax: 0, label: "Kitchen Room", note: "Kitchen room uses one fixed price. Pax does not change the rate." },
  { roomType: "driver", pax: 0, label: "Driver Room", note: "Driver room uses one fixed price." },
  { roomType: "normal", pax: 1, label: "Normal Room · 1 Pax", note: "Fixed room price for 1 guest." },
  { roomType: "normal", pax: 2, label: "Normal Room · 2 Pax", note: "Fixed room price for 2 guests." },
  { roomType: "normal", pax: 3, label: "Normal Room · 3 Pax", note: "Fixed room price for 3 guests." },
  { roomType: "normal", pax: 4, label: "Normal Room · 4 Pax", note: "Fixed room price for 4 guests." },
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
    label: "Room Pricing",
    note: "Open Room Fix and save room prices.",
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
  requestsFilterMode: "recent",
  requestsFilterStatus: "pending",
  bookingViewMode: "mobile",
  roomPricing: new Map(),
  pricingSchemaReady: null,
  bookingCustomPayments: [],
  roomInventory: [],
  serviceCatalog: [],
  roomInventorySchemaReady: null,
  runtimeSettings: {
    checkInTime: "14:00",
    checkOutTime: "11:00",
  },
  bookingRangePicker: null,
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

function profileHasPermission(profile, permissionKey) {
  if (!profile?.approved) return false;
  if (["owner", "admin"].includes(profile.role)) return true;
  return normalizePermissionList(profile.extra_permissions).includes(permissionKey);
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

function getPresetRangeDates(presetKey) {
  const today = parseDate(new Date());
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  switch (presetKey) {
    case "this-month":
      return { from: startOfMonth(today), to: today };
    case "last-month": {
      const base = new Date(currentYear, currentMonth - 1, 1, 12, 0, 0);
      return { from: startOfMonth(base), to: endOfMonth(base) };
    }
    case "this-year":
      return { from: new Date(currentYear, 0, 1, 12, 0, 0), to: today };
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
  const days = Math.max(7, Math.min(60, getNightCount(formatDateKey(from), formatDateKey(addDays(to, 1)))));
  plannerStartDateInput.value = toDateInputValue(from);
  ensureSelectOptionValue(plannerRangeDaysInput, days, `${days} Days`);
  loadReservationPlanner();
}

function applyAnalyticsPreset(presetKey) {
  if (!analyticsDateFromInput || !analyticsDateToInput) return;
  const { from, to } = getPresetRangeDates(presetKey);
  analyticsDateFromInput.value = toDateInputValue(from);
  analyticsDateToInput.value = toDateInputValue(to);
  loadAnalytics();
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
const accountsList = qs("#accounts-list");
const accountsEmpty = qs("#accounts-empty");
const refreshAccountsBtn = qs("#refresh-accounts");
const roomInventoryList = qs("#room-inventory-list");
const pricingList = qs("#pricing-list");
const serviceCatalogList = qs("#service-catalog-list");
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
const analyticsPresetButtons = Array.from(document.querySelectorAll("[data-analytics-preset]"));
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
const analyticsEmpty = qs("#analytics-empty");

const navButtons = {
  booking: qs("#tab-booking"),
  view: qs("#tab-view"),
  planner: qs("#tab-planner"),
  analytics: qs("#tab-analytics"),
  hold: qs("#tab-hold"),
  requests: qs("#tab-requests"),
  accounts: qs("#tab-accounts"),
  pricing: qs("#tab-pricing"),
};

let pdfPrintFrame = null;

const screens = {
  booking: qs("#screen-booking"),
  view: qs("#screen-view"),
  planner: qs("#screen-planner"),
  analytics: qs("#screen-analytics"),
  hold: qs("#screen-hold"),
  requests: qs("#screen-requests"),
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

function normalizeServiceCatalogRow(row = {}) {
  return {
    id: row.id || null,
    name: String(row.name || row.service_name || "").trim(),
    defaultPrice: roundCurrency(Math.max(0, Number(row.defaultPrice ?? row.default_price ?? 0))),
    isActive: row.isActive == null ? row.is_active !== false : Boolean(row.isActive),
  };
}

function setDefaultServiceCatalogState() {
  state.serviceCatalog = DEFAULT_SERVICE_DEFS.map((item) => normalizeServiceCatalogRow(item));
}

function getServiceCatalogRows({ includeInactive = false } = {}) {
  const source = (state.serviceCatalog?.length ? state.serviceCatalog : DEFAULT_SERVICE_DEFS)
    .map((item) => normalizeServiceCatalogRow(item))
    .filter((item) => item.name);
  return includeInactive ? source : source.filter((item) => item.isActive);
}

function getServiceOptionNames(extraServices = []) {
  const extras = Array.from(new Set((extraServices || []).map((item) => String(item || "").trim()).filter(Boolean)));
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

function getServicePricingMarkup(bookings = []) {
  const rows = getServicePricingRows(bookings);
  if (!rows.length) {
    return '<p class="inline-note">No services added.</p>';
  }
  return `
    <div class="payment-history-list">
      ${rows.map((row) => `
        <div class="payment-history-item">
          <strong>${escapeHtml(row.service)}</strong>
          <span>${row.amount > 0 ? escapeHtml(formatMoney(row.amount)) : "-"}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function getRoomPricingKey(roomType, pax = 0) {
  return `${roomType}-${Number(pax || 0)}`;
}

function getDefaultRoomPricingEntries() {
  return ROOM_PRICING_DEFS.map((item) => ({
    roomType: item.roomType,
    pax: item.pax,
    weekendPrice: 0,
    weekdayPercentage: 100,
  }));
}

function getRoomPricingLabel(roomType, pax = 0) {
  return ROOM_PRICING_DEFS.find((item) => item.roomType === roomType && Number(item.pax) === Number(pax))?.label || roomType;
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
    getDefaultRoomPricingEntries().map((item) => [getRoomPricingKey(item.roomType, item.pax), item])
  );
}

function hydrateRoomPricing(rows = []) {
  const merged = new Map(
    getDefaultRoomPricingEntries().map((item) => [getRoomPricingKey(item.roomType, item.pax), item])
  );
  rows.forEach((row) => {
    merged.set(getRoomPricingKey(row.room_type, row.pax), {
      roomType: row.room_type,
      pax: Number(row.pax || 0),
      weekendPrice: Number(row.weekend_price || 0),
      weekdayPercentage: Number(row.weekday_percentage || 100),
    });
  });
  return merged;
}

function getPricingConfig(roomType, pax = 0) {
  return state.roomPricing.get(getRoomPricingKey(roomType, pax)) || {
    roomType,
    pax: Number(pax || 0),
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

function computeBookingPrice({ checkIn, checkOut, roomType, guests, weekendRateOverride = null, weekdayRateOverride = null }) {
  const pricingPax = getPricingPaxTier(roomType, guests);
  const pricingRule = getPricingConfig(roomType, pricingPax);
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
  const rows = getServiceCatalogRows({ includeInactive: true });
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
    .select("id");
  if (fetchError) {
    throw new Error(fetchError.message || "Could not read current service catalog.");
  }

  const upsertRows = rows.map((row) => ({
    id: row.id || undefined,
    service_name: row.name,
    default_price: roundCurrency(row.defaultPrice),
    is_active: row.isActive,
  }));

  if (upsertRows.length) {
    const { error: upsertError } = await state.supabase
      .from(CONFIG.SUPABASE_SERVICES_TABLE)
      .upsert(upsertRows, { onConflict: "service_name" });
    if (upsertError) {
      throw new Error(upsertError.message || "Could not save service catalog.");
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

  await loadServiceCatalog();
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
    state.runtimeSettings = {
      checkInTime: data?.check_in_time || "14:00",
      checkOutTime: data?.check_out_time || "11:00",
    };
  } catch (error) {
    state.runtimeSettings = {
      checkInTime: "14:00",
      checkOutTime: "11:00",
    };
    if (canManagePricing()) {
      showToast("Booking runtime settings table is not ready. Run the updated Supabase schema.sql.", true);
    }
  }
  if (runtimeCheckInTimeInput) runtimeCheckInTimeInput.value = getRuntimeCheckInTime();
  if (runtimeCheckOutTimeInput) runtimeCheckOutTimeInput.value = getRuntimeCheckOutTime();
}

async function saveRuntimeSettings() {
  if (!canManagePricing()) return;
  const row = {
    id: true,
    check_in_time: runtimeCheckInTimeInput?.value || "14:00",
    check_out_time: runtimeCheckOutTimeInput?.value || "11:00",
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
  };
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
    .select("id, room_type, room_number");

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
  if (!pricingList || !roomInventoryList || !serviceCatalogList) return;
  if (!state.serviceCatalog?.length) setDefaultServiceCatalogState();
  if (runtimeCheckInTimeInput) runtimeCheckInTimeInput.value = getRuntimeCheckInTime();
  if (runtimeCheckOutTimeInput) runtimeCheckOutTimeInput.value = getRuntimeCheckOutTime();
  if (!canManagePricing()) {
    setHTML(roomInventoryList, "");
    setHTML(serviceCatalogList, "");
    setHTML(pricingList, `<p class="inline-note">You do not have room pricing access yet.</p>`);
    return;
  }

  roomInventoryList.innerHTML = "";
  serviceCatalogList.innerHTML = "";
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
    const pricing = getPricingConfig(config.roomType, config.pax);
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
      state.roomPricing.set(getRoomPricingKey(config.roomType, config.pax), {
        roomType: config.roomType,
        pax: config.pax,
        weekendPrice,
        weekdayPercentage: 100,
      });
      renderPricingSummary();
    }

    weekendInput.addEventListener("input", syncCardValues);
    pricingList.appendChild(card);
  });

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
        getServiceCatalogRows({ includeInactive: true }).length
          ? getServiceCatalogRows({ includeInactive: true }).map((service, index) => `
              <div class="service-config-row${service.isActive ? "" : " room-config-row-off"}" data-service-index="${index}">
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
      ...getServiceCatalogRows({ includeInactive: true }),
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
      state.serviceCatalog = getServiceCatalogRows({ includeInactive: true }).filter((_, itemIndex) => itemIndex !== index);
      renderPricingScreen();
    });
  });

  serviceCatalogList.appendChild(serviceCard);
}

async function saveRoomPricing() {
  if (!canManagePricing()) return;
  const rows = ROOM_PRICING_DEFS.map((config) => {
    const pricing = getPricingConfig(config.roomType, config.pax);
    return {
      room_type: config.roomType,
      pax: config.pax,
      weekend_price: roundCurrency(pricing.weekendPrice),
      weekday_percentage: 100,
    };
  });

  const { error } = await state.supabase.from(CONFIG.SUPABASE_PRICING_TABLE).upsert(rows, {
    onConflict: "room_type,pax",
  });

  if (error) {
    throw new Error(error.message || "Could not save room pricing.");
  }

  state.pricingSchemaReady = true;
  showToast("Room pricing updated.");
  await loadRoomPricing();
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
    });
    const finalPrice = applyOfferPercentage(pricing.roomTotal, offerPercentage);
    roomTotal += finalPrice;
    const pricingLabel = room.type === "normal" ? `${getRoomPricingLabel(room.type, pricing.pricingPax)}` : getRoomPricingLabel(room.type, 0);
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

function getRoomTypeLabelForGuests(roomType, guests) {
  const def = getRoomDef(normalizeRoomGroup(roomType));
  if (!def) return getRoomTypeDisplay(roomType);
  return `${def.label} - ${guests} Pax`;
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
  const preserved = existingEntries.filter((item) => {
    const noteKey = String(item.note || "").trim().toLowerCase();
    return noteKey && !selectedServices.has(noteKey);
  });
  const linked = nextServices.map((service) => {
    const existing = existingEntries.find((item) => String(item.note || "").trim().toLowerCase() === String(service || "").trim().toLowerCase());
    return existing || { amount: roundCurrency(getServiceConfig(service)?.defaultPrice || 0), note: service };
  });
  return [...linked, ...preserved];
}

async function toggleGroupServiceDirect(groupKey, serviceName) {
  const group = getBookingGroupByKey(groupKey);
  if (!group?.bookings?.length) throw new Error("Booking group not found.");
  const parsed = parseBookingNotes(group.bookings[0].notes);
  const next = new Set(parsed.services);
  if (getGroupLifecycleStatus(group) === "checked_in" && !canManageBookings()) {
    if (next.has(serviceName)) {
      showToast("Checked-in bookings can add new services, but existing services cannot be removed.", true);
      return;
    }
    next.add(serviceName);
  } else if (next.has(serviceName)) {
    next.delete(serviceName);
  } else {
    next.add(serviceName);
  }
  const nextServices = Array.from(next);
  const nextCustomPayments = syncGroupCustomPaymentsWithServices(group.bookings, nextServices);
  const linkedEntry = nextCustomPayments.find((item) => String(item.note || "").trim().toLowerCase() === String(serviceName || "").trim().toLowerCase());
  if (linkedEntry && next.has(serviceName)) {
    const amountInput = window.prompt(`Enter price for ${serviceName}. Leave empty or 0 if not charged.`, linkedEntry.amount ? String(linkedEntry.amount) : "");
    if (amountInput === null) return;
    linkedEntry.amount = roundCurrency(Math.max(0, Number(amountInput || 0)));
  }

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
    bookingId: booking.id,
    roomType: normalizeRoomGroup(booking.roomType),
    roomNumber: Number(booking.roomNumber),
    guests: Number(booking.guests || 1),
    services: [...parsed.services],
  };
}

function serializeBookingRoomEdits() {
  return Array.from(state.modalBookingRoomEdits.values()).map((item) => ({
    bookingId: item.bookingId,
    roomType: normalizeRoomGroup(item.roomType),
    roomNumber: Number(item.roomNumber),
    guests: Number(item.guests || 1),
    services: Array.isArray(item.services) ? [...item.services] : [],
  }));
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

  group.forEach((item) => {
    const roomEdit = buildBookingRoomEditOptions(item);
    state.modalBookingRoomEdits.set(String(item.id), roomEdit);
    const roomDef = getRoomDef(roomEdit.roomType) || getRoomDef(normalizeRoomGroup(item.roomType));
    const paxOptions = Array.from({ length: roomDef?.maxPax || 6 }, (_, index) => {
      const pax = index + 1;
      return `<option value="${pax}" ${pax === roomEdit.guests ? "selected" : ""}>${pax} Pax</option>`;
    }).join("");

    const option = document.createElement("div");
    option.className = "extra-room-option booking-room-edit-option";
    option.innerHTML = `
      <div class="extra-room-option-head">
        <div>
          <strong>${getRoomLabel(roomEdit.roomType, roomEdit.roomNumber)}</strong>
          <span>${item.roomTypeLabel || getRoomTypeDisplay(item.roomType)} · Current: ${item.guests} guests</span>
        </div>
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

    const syncRoomNumbers = () => {
      if (!roomTypeSelect || !roomNumberSelect || !paxSelect) return;
      const selectedType = roomTypeSelect.value;
      const def = getRoomDef(selectedType);
      const selectedRoomNumber = Number(state.modalBookingRoomEdits.get(String(item.id))?.roomNumber || 1);
      setHTML(roomNumberSelect, getRoomNumbersForType(selectedType, { selectedNumber: selectedRoomNumber }).map((number) => {
        const selected = number === selectedRoomNumber ? "selected" : "";
        return `<option value="${number}" ${selected}>Room ${number}</option>`;
      }).join(""));
      setHTML(paxSelect, Array.from({ length: def?.maxPax || 6 }, (_, index) => {
        const pax = index + 1;
        const selected = pax === Number(state.modalBookingRoomEdits.get(String(item.id))?.guests || 1) ? "selected" : "";
        return `<option value="${pax}" ${selected}>${pax} Pax</option>`;
      }).join(""));
    };

    syncRoomNumbers();

    roomTypeSelect?.addEventListener("change", () => {
      const current = state.modalBookingRoomEdits.get(String(item.id));
      const def = getRoomDef(roomTypeSelect.value);
      const nextRoomNumbers = getRoomNumbersForType(roomTypeSelect.value, { selectedNumber: 1 });
      state.modalBookingRoomEdits.set(String(item.id), {
        ...current,
        roomType: roomTypeSelect.value,
        roomNumber: nextRoomNumbers[0] || 1,
        guests: Math.min(Number(current?.guests || 1), def?.maxPax || 1),
      });
      syncRoomNumbers();
      renderRequestOfferPreview();
    });

    roomNumberSelect?.addEventListener("change", () => {
      const current = state.modalBookingRoomEdits.get(String(item.id));
      state.modalBookingRoomEdits.set(String(item.id), {
        ...current,
        roomNumber: Number(roomNumberSelect.value),
      });
    });

    paxSelect?.addEventListener("change", () => {
      const current = state.modalBookingRoomEdits.get(String(item.id));
      state.modalBookingRoomEdits.set(String(item.id), {
        ...current,
        guests: Number(paxSelect.value),
      });
      renderRequestOfferPreview();
    });

    option.querySelectorAll(`[data-booking-room-service]`).forEach((button) => {
      button.addEventListener("click", () => {
        const current = state.modalBookingRoomEdits.get(String(item.id));
        const nextServices = new Set(current?.services || []);
        const serviceName = button.dataset.serviceName;
        if (nextServices.has(serviceName)) nextServices.delete(serviceName);
        else nextServices.add(serviceName);
        state.modalBookingRoomEdits.set(String(item.id), {
          ...current,
          services: Array.from(nextServices),
        });
        button.classList.toggle("service-chip-active", nextServices.has(serviceName));
        button.classList.toggle("service-chip-inactive", !nextServices.has(serviceName));
        button.setAttribute("aria-pressed", nextServices.has(serviceName) ? "true" : "false");
      });
    });

    requestBookingRooms.appendChild(option);
  });
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
  const editsByBookingId = new Map(roomEdits.map((item) => [String(item.bookingId), item]));
  const excludedBookingIds = targetBookings.map((booking) => booking.id);

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
      roomTypeLabel: getRoomTypeLabelForGuests(roomEdit.roomType, roomEdit.guests),
      roomNumber: roomEdit.roomNumber,
      guests: roomEdit.guests,
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
    state.roomPlans.set(key, { type, number, pax: 0, nights: defaultNights, extraPax: 0 });
  }
  const plan = state.roomPlans.get(key);
  plan.type = type;
  plan.number = number;
  if (plan.nights < 1) plan.nights = defaultNights;
  if (typeof plan.extraPax !== "number") plan.extraPax = 0;
  return plan;
}

function getAssignedRoomLabel(room, pax, extraPax = 0) {
  const totalPax = Number(pax || 0) + Number(extraPax || 0);
  return `${room.label} - ${totalPax} Pax`;
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
    weekendRateOverride: "weekendRate" in values ? values.weekendRate : null,
    weekdayRateOverride: "weekdayRate" in values ? values.weekdayRate : null,
  });

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

function updateHeaderProfile() {
  if (!state.currentProfile) {
    userChip.textContent = "";
    return;
  }
  userChip.textContent = `${state.currentProfile.full_name || state.currentProfile.username} · ${state.currentProfile.role}`;
}

function updateNavVisibility() {
  const showPlanner = Boolean(state.currentProfile?.approved);
  const showAnalytics = Boolean(state.currentProfile?.approved);
  const showHold = Boolean(state.currentProfile?.approved);
  const showAccounts = canManageAccounts();
  const showRequests = Boolean(state.currentProfile?.approved);
  const showPricing = canManagePricing();
  navButtons.planner.classList.toggle("hidden", !showPlanner);
  navButtons.analytics.classList.toggle("hidden", !showAnalytics);
  navButtons.hold.classList.toggle("hidden", !showHold);
  navButtons.requests.classList.toggle("hidden", !showRequests);
  navButtons.accounts.classList.toggle("hidden", !showAccounts);
  navButtons.pricing.classList.toggle("hidden", !showPricing);
  const visibleTabs = 2 + Number(showPlanner) + Number(showAnalytics) + Number(showHold) + Number(showRequests) + Number(showAccounts) + Number(showPricing);
  const columns = `repeat(${visibleTabs}, 1fr)`;
  qs(".bottom-nav").style.gridTemplateColumns = columns;
  if (!showPlanner && screens.planner.classList.contains("screen-active")) {
    setScreen("booking");
  }
  if (!showAnalytics && screens.analytics.classList.contains("screen-active")) {
    setScreen("booking");
  }
  if (!showHold && screens.hold.classList.contains("screen-active")) {
    setScreen("booking");
  }
  if (!showRequests && screens.requests.classList.contains("screen-active")) {
    setScreen("booking");
  }
  if (!showAccounts && screens.accounts.classList.contains("screen-active")) {
    setScreen("booking");
  }
  if (!showPricing && screens.pricing.classList.contains("screen-active")) {
    setScreen("booking");
  }
}

function setScreen(target) {
  Object.values(screens).forEach((screen) => screen.classList.remove("screen-active"));
  Object.values(navButtons).forEach((btn) => btn.classList.remove("nav-active"));

  screens[target].classList.add("screen-active");
  navButtons[target].classList.add("nav-active");
  if (target === "planner") {
    loadReservationPlanner();
  }
  if (target === "analytics") {
    loadAnalytics();
  }
  if (target === "hold") {
    loadHoldBookings();
  }
}

function getAnalyticsReservationGroups(bookings = []) {
  return groupBookingsForDisplay((bookings || []).filter((booking) => isVisibleBooking(booking)));
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

async function loadAnalytics() {
  if (!state.currentProfile?.approved || !analyticsDateFromInput || !analyticsDateToInput) return;
  const from = analyticsDateFromInput.value;
  const to = analyticsDateToInput.value;

  if (!from || !to) {
    if (analyticsEmpty) {
      analyticsEmpty.textContent = "Select a date range to load analytics.";
      analyticsEmpty.style.display = "block";
    }
    return;
  }

  if (from > to) {
    showToast("Analytics end date must be after the start date.", true);
    return;
  }

  try {
    const bookings = await fetchBookingsForPeriod(from, formatDateKey(addDays(parseDate(to), 1)));
    const groups = getAnalyticsReservationGroups(bookings);
    const totalRevenue = roundCurrency(groups.reduce((sum, group) => sum + Number(group.totalPrice || 0), 0));
    const totalBookings = groups.length;
    const totalPendingBalance = roundCurrency(groups.reduce((sum, group) => sum + getBookingBalanceAmount(group), 0));
    const totalRoomNights = groups.reduce((sum, group) => sum + getAnalyticsRoomNights(group), 0);
    const averageBookingValue = totalBookings ? roundCurrency(totalRevenue / totalBookings) : 0;
    const averageStayNights = totalBookings ? roundCurrency(totalRoomNights / totalBookings) : 0;

    const roomTotals = new Map();
    const roomTypeRevenue = new Map();
    const customerTotals = new Map();
    const staffTotals = new Map();
    const serviceTotals = new Map();
    const statusTotals = new Map();
    const sourceTotals = new Map();
    const titleTotals = new Map();

    groups.forEach((group) => {
      const lifecycleStatus = getGroupLifecycleStatus(group);
      statusTotals.set(getLifecycleStatusLabel(lifecycleStatus), (statusTotals.get(getLifecycleStatusLabel(lifecycleStatus)) || 0) + 1);
      const sourceLabel = group.statuses.size === 1 ? Array.from(group.statuses)[0] : "Mixed";
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

    if (analyticsEmpty) {
      analyticsEmpty.style.display = groups.length ? "none" : "block";
      analyticsEmpty.textContent = groups.length ? "" : "No analytics data for this range.";
    }
  } catch (error) {
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

async function applySession(session) {
  state.currentSession = session;

  if (!session) {
    state.currentProfile = null;
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
  await loadRoomInventory();
  await loadServiceCatalog();
  await loadRoomPricing();
  await loadRuntimeSettings();
  await setupRealtime();
  await refreshLiveViews();
  await loadRequests();
  if (canManageAccounts()) {
    await loadAccounts();
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
    default:
      return "BK";
  }
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
    </div>
  `;

  if (isAvailable) {
    const nightsSelect = card.querySelector('[data-role="nights"]');
    const paxSelect = card.querySelector('[data-role="pax"]');
    const extraPaxSelect = card.querySelector('[data-role="extra-pax"]');

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
  availabilityHint.textContent = `Nights default from selected dates: ${defaultNights}. Per-room pax, extra pax / kids, and driver count can be adjusted.`;

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
    { bg: "#eadcfb", border: "#bca1eb" },
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
  const checkedInAt = group.bookings[0]?.checkedInAt ? new Date(group.bookings[0].checkedInAt).toLocaleString("en-GB") : "-";
  const checkedOutAt = group.bookings[0]?.checkedOutAt ? new Date(group.bookings[0].checkedOutAt).toLocaleString("en-GB") : "-";
  return `
    <div class="booking-group-overview">
      <section class="booking-overview-panel booking-overview-panel-reservation">
        <div class="booking-overview-panel-title">Reservation</div>
        <div class="booking-overview-rows">
          <div class="booking-overview-row">
            <span>Track Code</span>
            <strong>${group.trackCode || "-"}</strong>
          </div>
          <div class="booking-overview-row">
            <span>Customer</span>
            <strong>${group.guestName || "Guest"}</strong>
          </div>
          <div class="booking-overview-row">
            <span>Booked By</span>
            <strong>${group.bookings[0]?.createdByName || "-"}</strong>
          </div>
          <div class="booking-overview-row">
            <span>Phone</span>
            <strong>${group.phone || "-"}</strong>
          </div>
        </div>
      </section>
      <section class="booking-overview-panel booking-overview-panel-stay">
        <div class="booking-overview-panel-title">Stay</div>
        <div class="booking-overview-rows">
          <div class="booking-overview-row">
            <span>Check In</span>
            <strong>${group.checkIn || "-"}</strong>
          </div>
          <div class="booking-overview-row">
            <span>Check Out</span>
            <strong>${group.checkOut || "-"}</strong>
          </div>
          <div class="booking-overview-row">
            <span>Status</span>
            <strong>${groupStatus}</strong>
          </div>
          <div class="booking-overview-row">
            <span>Lifecycle</span>
            <strong>${lifecycleLabel}</strong>
          </div>
          <div class="booking-overview-row">
            <span>Rooms / Pax</span>
            <strong>${group.bookings.length} room(s) · ${group.totalGuests} pax</strong>
          </div>
          <div class="booking-overview-row">
            <span>Check In At</span>
            <strong>${checkedInAt}</strong>
          </div>
          <div class="booking-overview-row">
            <span>Check Out At</span>
            <strong>${checkedOutAt}</strong>
          </div>
        </div>
      </section>
      <section class="booking-overview-panel booking-overview-panel-billing">
        <div class="booking-overview-panel-title">Billing</div>
        <div class="booking-overview-rows">
          <div class="booking-overview-row booking-overview-row-strong">
            <span>Total Price</span>
            <strong>${formatMoney(group.totalPrice || 0)}</strong>
          </div>
          <div class="booking-overview-row">
            <span>Advance</span>
            <strong>${advanceInfo.label}</strong>
          </div>
          <div class="booking-overview-row">
            <span>Custom Price</span>
            <strong>${formatMoney(customPriceTotal)}</strong>
          </div>
          <div class="booking-overview-row">
            <span>Advance Amount</span>
            <strong>${formatMoney(advanceInfo.amount || 0)}</strong>
          </div>
          <div class="booking-overview-row booking-overview-row-strong">
            <span>Balance</span>
            <strong>${formatMoney(balanceAmount)}</strong>
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderBookingHeaderSummary(group) {
  return `
    <div class="booking-group-summary-grid">
      <div class="booking-summary-chip booking-summary-chip-wide">
        <span>Stay</span>
        <strong>${group.checkIn || "-"} -> ${group.checkOut || "-"}</strong>
      </div>
      <div class="booking-summary-chip">
        <span>Rooms</span>
        <strong>${group.bookings.length}</strong>
      </div>
      <div class="booking-summary-chip">
        <span>Total Pax</span>
        <strong>${group.totalGuests}</strong>
      </div>
      <div class="booking-summary-chip">
        <span>Lifecycle</span>
        <strong>${getLifecycleStatusLabel(getGroupLifecycleStatus(group))}</strong>
      </div>
      <div class="booking-summary-chip booking-summary-chip-strong">
        <span>Balance</span>
        <strong>${formatMoney(getBookingBalanceAmount(group))}</strong>
      </div>
    </div>
  `;
}

function renderBookingRoomFacts(booking) {
  const pricing = getBookingPricingSnapshot(booking);
  return `
    <div class="booking-room-facts">
      <div class="booking-room-fact">
        <span>Room Type</span>
        <strong>${booking.roomTypeLabel || getRoomTypeDisplay(booking.roomType)}</strong>
      </div>
      <div class="booking-room-fact">
        <span>Pax Count</span>
        <strong>${booking.guests} guest(s)</strong>
      </div>
      <div class="booking-room-fact booking-room-fact-total">
        <span>Room Price</span>
        <strong>${formatMoney(pricing.roomTotal)}</strong>
      </div>
    </div>
  `;
}

function buildBookingPdfMarkup(group) {
  const advanceInfo = getAdvancePaymentInfo(group.bookings);
  const customPriceItems = getGroupCustomPriceEntries(group.bookings);
  const customPriceTotal = getGroupCustomPriceTotal(group.bookings);
  const balanceAmount = getBookingBalanceAmount(group);
  const allServices = getGroupServices(group.bookings);
  const servicePricingRows = getServicePricingRows(group.bookings);
  const lifecycleLabel = getLifecycleStatusLabel(getGroupLifecycleStatus(group));
  const roomCards = group.bookings.map((booking) => {
    const noteMeta = parseBookingNotes(booking.notes);
    const details = [
      booking.roomTypeLabel || getRoomTypeDisplay(booking.roomType),
      `${Number(booking.guests || 0)} guest(s)`,
      `${booking.checkIn || "-"} -> ${booking.checkOut || "-"}`,
      formatMoney(booking.roomTotal || 0),
    ];
    if (noteMeta.extraGuests) details.push(`Extra pax / kids: ${noteMeta.extraGuests}`);
    if (noteMeta.drivers) details.push(`Drivers: ${noteMeta.drivers}`);

    return `
      <section class="pdf-room-card">
        <div class="pdf-room-head">
          <h3>${escapeHtml(getRoomLabel(normalizeRoomGroup(booking.roomType), booking.roomNumber))}</h3>
          <span>${escapeHtml(booking.status || "Active")}</span>
        </div>
        <div class="pdf-room-grid">
          <div><strong>Room Type</strong><span>${escapeHtml(booking.roomTypeLabel || getRoomTypeDisplay(booking.roomType))}</span></div>
          <div><strong>Pax Count</strong><span>${escapeHtml(`${Number(booking.guests || 0)} guest(s)`)}</span></div>
          <div><strong>Room Price</strong><span>${escapeHtml(formatMoney(booking.roomTotal || 0))}</span></div>
          <div><strong>Stay</strong><span>${escapeHtml(`${booking.checkIn || "-"} -> ${booking.checkOut || "-"}`)}</span></div>
        </div>
        <div class="pdf-room-meta">${escapeHtml(details.join(" | "))}</div>
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
          body { font-family: Arial, sans-serif; margin: 0; background: #f6f1e7; color: #173d35; }
          .pdf-shell { max-width: 900px; margin: 0 auto; padding: 28px; }
          .pdf-card { background: #fff; border: 1px solid #e8ddc9; border-radius: 18px; padding: 22px; }
          .pdf-kicker { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #7f725d; margin: 0 0 6px; }
          .pdf-title-row { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; margin-bottom: 18px; }
          .pdf-title-row h1 { margin: 0 0 6px; font-size: 28px; }
          .pdf-title-row p { margin: 0; color: #5f6f6b; }
          .pdf-badge { border: 1px solid #d7cab2; border-radius: 999px; padding: 8px 14px; font-size: 13px; font-weight: 700; background: #f9f3e4; }
          .pdf-summary { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-bottom: 18px; }
          .pdf-summary div { border: 1px solid #e8ddc9; border-radius: 14px; padding: 12px 14px; background: #fcfaf6; }
          .pdf-summary strong { display: block; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #7f725d; margin-bottom: 6px; }
          .pdf-summary span { font-size: 17px; font-weight: 700; color: #173d35; word-break: break-word; }
          .pdf-services { margin-bottom: 18px; }
          .pdf-services strong { display: block; margin-bottom: 8px; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #7f725d; }
          .pdf-chip-list { display: flex; flex-wrap: wrap; gap: 8px; }
          .pdf-chip { border: 1px solid #e0d1b0; border-radius: 999px; padding: 8px 12px; background: #fff9ed; font-size: 12px; font-weight: 700; color: #8b6d2a; }
          .pdf-room-list { display: grid; gap: 14px; }
          .pdf-room-card { border: 1px solid #e8ddc9; border-radius: 16px; padding: 16px; background: #fff; }
          .pdf-room-head { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-bottom: 12px; }
          .pdf-room-head h3 { margin: 0; font-size: 18px; }
          .pdf-room-head span { padding: 6px 10px; border-radius: 999px; background: #e7f0ea; color: #1f6c4d; font-size: 12px; font-weight: 700; }
          .pdf-room-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          .pdf-room-grid div { border: 1px solid #eee5d6; border-radius: 12px; padding: 10px 12px; background: #fcfaf6; }
          .pdf-room-grid strong { display: block; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #7f725d; margin-bottom: 4px; }
          .pdf-room-grid span { font-size: 14px; font-weight: 700; color: #173d35; }
          .pdf-room-meta, .pdf-notes { margin-top: 10px; font-size: 13px; color: #4d5f5a; line-height: 1.5; }
          @media print {
            body { background: #fff; }
            .pdf-shell { padding: 0; }
            .pdf-card { border: 0; border-radius: 0; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="pdf-shell">
          <div class="pdf-card">
            <p class="pdf-kicker">Reservation Export</p>
            <div class="pdf-title-row">
              <div>
                <h1>${escapeHtml(group.trackCode || "-")}</h1>
                <p>${escapeHtml(group.guestName || "Guest")} · ${escapeHtml(group.phone || "-")}</p>
              </div>
              <div class="pdf-badge">${escapeHtml(group.statuses.size === 1 ? Array.from(group.statuses)[0] : "Mixed")}</div>
            </div>
            <div class="pdf-summary">
              <div><strong>Customer</strong><span>${escapeHtml(group.guestName || "Guest")}</span></div>
              <div><strong>Booked By</strong><span>${escapeHtml(group.bookings[0]?.createdByName || "-")}</span></div>
              <div><strong>Phone</strong><span>${escapeHtml(group.phone || "-")}</span></div>
              <div><strong>Stay</strong><span>${escapeHtml(`${group.checkIn || "-"} -> ${group.checkOut || "-"}`)}</span></div>
              <div><strong>Total Pax</strong><span>${escapeHtml(String(group.totalGuests || 0))}</span></div>
              <div><strong>Rooms</strong><span>${escapeHtml(String(group.bookings.length || 0))}</span></div>
              <div><strong>Total Price</strong><span>${escapeHtml(formatMoney(group.totalPrice || 0))}</span></div>
              <div><strong>Custom Price</strong><span>${escapeHtml(formatMoney(customPriceTotal))}</span></div>
              <div><strong>Lifecycle</strong><span>${escapeHtml(lifecycleLabel)}</span></div>
              <div><strong>Advance</strong><span>${escapeHtml(advanceInfo.label)}</span></div>
              <div><strong>Advance Amount</strong><span>${escapeHtml(formatMoney(advanceInfo.amount || 0))}</span></div>
              <div><strong>Balance</strong><span>${escapeHtml(formatMoney(balanceAmount))}</span></div>
              <div><strong>Check In At</strong><span>${escapeHtml(group.bookings[0]?.checkedInAt ? new Date(group.bookings[0].checkedInAt).toLocaleString("en-GB") : "-")}</span></div>
              <div><strong>Check Out At</strong><span>${escapeHtml(group.bookings[0]?.checkedOutAt ? new Date(group.bookings[0].checkedOutAt).toLocaleString("en-GB") : "-")}</span></div>
              <div><strong>Exported At</strong><span>${escapeHtml(new Date().toLocaleString("en-GB"))}</span></div>
            </div>
            ${customPriceItems.length ? `
              <div class="pdf-services">
                <strong>Custom Price Entries</strong>
                ${customPriceItems.map((payment, index) => `
                  <div class="pdf-notes">${index + 1}. ${escapeHtml(formatMoney(payment.amount || 0))}${payment.note ? ` · ${escapeHtml(payment.note)}` : ""}</div>
                `).join("")}
              </div>
            ` : ""}
            ${allServices.length ? `
              <div class="pdf-services">
                <strong>Services</strong>
                <div class="pdf-chip-list">${allServices.map((service) => `<span class="pdf-chip">${escapeHtml(service)}</span>`).join("")}</div>
              </div>
            ` : ""}
            <div class="pdf-services">
              <strong>Service Prices</strong>
              ${
                servicePricingRows.length
                  ? servicePricingRows.map((row) => `<div class="pdf-notes">${escapeHtml(row.service)}: ${escapeHtml(row.amount > 0 ? formatMoney(row.amount) : "-")}</div>`).join("")
                  : `<div class="pdf-notes">No services added.</div>`
              }
            </div>
            <div class="pdf-room-list">${roomCards}</div>
          </div>
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

  const markup = buildBookingPdfMarkup(group);
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

function normalizeWhatsappPhone(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

function buildReservationWhatsappMessage(group) {
  const advanceInfo = getAdvancePaymentInfo(group.bookings);
  const customPriceItems = getGroupCustomPriceEntries(group.bookings);
  const customPriceTotal = getGroupCustomPriceTotal(group.bookings);
  const balanceAmount = getBookingBalanceAmount(group);
  const servicePricingRows = getServicePricingRows(group.bookings);
  const roomLines = group.bookings.map((booking) => {
    const noteMeta = parseBookingNotes(booking.notes);
    const extraBits = [];
    if (noteMeta.extraGuests) extraBits.push(`Extra pax/kids ${noteMeta.extraGuests}`);
    if (noteMeta.drivers) extraBits.push(`Drivers ${noteMeta.drivers}`);
    return [
      `${getRoomLabel(normalizeRoomGroup(booking.roomType), booking.roomNumber)}`,
      booking.roomTypeLabel || getRoomTypeDisplay(booking.roomType),
      `${Number(booking.guests || 0)} pax`,
      formatMoney(booking.roomTotal || 0),
      extraBits.join(" | "),
    ].filter(Boolean).join(" | ");
  });

  return [
    `Reservation Details`,
    ``,
    `Track Code: ${group.trackCode || "-"}`,
    `Customer: ${group.guestName || "Guest"}`,
    `Phone: ${group.phone || "-"}`,
    `Booked By: ${group.bookings[0]?.createdByName || "-"}`,
    `Stay: ${group.checkIn || "-"} -> ${group.checkOut || "-"}`,
    `Total Pax: ${group.totalGuests || 0}`,
    `Rooms: ${group.bookings.length || 0}`,
    `Total Price: ${formatMoney(group.totalPrice || 0)}`,
    `Lifecycle: ${getLifecycleStatusLabel(getGroupLifecycleStatus(group))}`,
    `Custom Price: ${formatMoney(customPriceTotal)}`,
    `Advance Payment: ${advanceInfo.label}`,
    `Advance Amount: ${formatMoney(advanceInfo.amount || 0)}`,
    `Balance: ${formatMoney(balanceAmount)}`,
    `Check In At: ${group.bookings[0]?.checkedInAt ? new Date(group.bookings[0].checkedInAt).toLocaleString("en-GB") : "-"}`,
    `Check Out At: ${group.bookings[0]?.checkedOutAt ? new Date(group.bookings[0].checkedOutAt).toLocaleString("en-GB") : "-"}`,
    ...(servicePricingRows.length
      ? ["", "Service Prices:", ...servicePricingRows.map((row) => `${row.service}: ${row.amount > 0 ? formatMoney(row.amount) : "-"}`)]
      : []),
    ...(customPriceItems.length
      ? ["", "Custom Price Entries:", ...customPriceItems.map((payment, index) => `${index + 1}. ${formatMoney(payment.amount || 0)}${payment.note ? ` | ${payment.note}` : ""}`)]
      : []),
    ``,
    `Room Details:`,
    ...roomLines.map((line, index) => `${index + 1}. ${line}`),
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
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
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
}

async function performGroupReactivate(groupKey) {
  const group = getBookingGroupByKey(groupKey);
  if (!group) throw new Error("Booking group not found.");
  const confirmed = window.confirm(`Reactivate ${group.trackCode || "this booking"} and move it back to booked status?`);
  if (!confirmed) return false;
  await updateGroupLifecycle(groupKey, {
    lifecycleStatus: "booked",
    status: "Campaign",
    checkedInAt: null,
    checkedOutAt: null,
    closeDetails: null,
  });
  return true;
}

async function performGroupDeleteFlow(groupKey) {
  const group = getBookingGroupByKey(groupKey);
  if (!group) throw new Error("Booking group not found.");
  const hasPayment = Number(getAdvancePaymentInfo(group.bookings).amount || 0) > 0 || Number(getGroupCustomPriceTotal(group.bookings) || 0) > 0;
  if (canEditBookingGroupDirect(group) || canManageBookings()) {
    if (!hasPayment) {
      if (!window.confirm("Delete this booking?")) return false;
      await updateGroupLifecycle(groupKey, { lifecycleStatus: "booked" });
      for (const booking of group.bookings) {
        await updateBooking(booking.id, { status: "Cancelled" });
      }
      return true;
    }
    const refundPayment = window.confirm("Payments found. Press OK to refund and delete. Press Cancel to move this booking to hold without refund.");
    if (refundPayment) {
      await updateGroupLifecycle(groupKey, { lifecycleStatus: "booked" });
      for (const booking of group.bookings) {
        await updateBooking(booking.id, { status: "Cancelled" });
      }
      return true;
    }
    await performGroupHold(groupKey, "Customer requested cancellation, but payment is not being refunded.", "Removed Booking");
    return true;
  }

  if (!hasPayment) {
    await insertChangeRequest({
      bookingId: group.bookings[0].id,
      reason: "delete_booking",
      requestScope: "group",
      requestNote: "Customer requested booking deletion after check-in lock window.",
    });
    return true;
  }

  const refundPayment = window.confirm("Payments found. Press OK to request refund and delete. Press Cancel to move booking to hold without refund.");
  if (refundPayment) {
    await insertChangeRequest({
      bookingId: group.bookings[0].id,
      reason: "delete_booking",
      requestScope: "group",
      requestNote: "Customer requested cancellation and refund.",
    });
    return true;
  }

  await performGroupHold(groupKey, "Customer requested cancellation, but payment is not being refunded.", "Removed Booking");
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
    bookingDetailsTitle.textContent = `${group.trackCode || "-"} · ${group.guestName || "Guest"}`;
  const advanceInfo = getAdvancePaymentInfo(group.bookings);
  const customPriceItems = getGroupCustomPriceEntries(group.bookings);
  const customPriceTotal = getGroupCustomPriceTotal(group.bookings);
  const balanceAmount = getBookingBalanceAmount(group);
  const groupServices = getGroupServices(group.bookings);
  const servicePricingMarkup = getServicePricingMarkup(group.bookings);
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

  bookingDetailsBody.innerHTML = `
    <div class="booking-meta booking-meta-compact booking-details-summary">
      <div><strong>Track Code:</strong> ${group.trackCode || "-"}</div>
      <div><strong>Phone:</strong> <a href="tel:${group.phone || ""}">${group.phone || "-"}</a></div>
      <div><strong>Booked by:</strong> ${group.bookings[0]?.createdByName || "-"}</div>
      <div><strong>Rooms:</strong> ${group.bookings.length}</div>
      <div><strong>Guests:</strong> ${group.totalGuests}</div>
      <div><strong>Dates:</strong> ${group.checkIn} -> ${group.checkOut}</div>
      <div><strong>Status:</strong> ${group.statuses.size === 1 ? Array.from(group.statuses)[0] : "Mixed"}</div>
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
    ${requestHistoryMarkup}
    <div class="booking-details-actions">
      ${canManageBookings() ? `<button class="action-btn action-btn-icon action-btn-icon-advance" type="button" data-booking-group-action="advance">Update Advance</button>` : ""}
      <button class="action-btn action-btn-icon action-btn-icon-whatsapp" type="button" data-booking-group-action="whatsapp">WhatsApp</button>
      <button class="action-btn" type="button" data-booking-group-action="email">Email Slip</button>
      <button class="action-btn action-btn-icon action-btn-icon-pdf" type="button" data-booking-group-action="pdf">Export PDF</button>
      ${(directEditAllowed || canManageBookings()) ? `<button class="primary-btn" type="button" data-booking-group-action="manage">Edit Booking</button>` : ""}
      ${lifecycleStatus === "booked" ? `<button class="primary-btn" type="button" data-booking-group-action="checkin">Check In</button>` : ""}
      ${lifecycleStatus === "checked_in" ? `<button class="primary-btn" type="button" data-booking-group-action="checkout">Check Out</button>` : ""}
      ${lifecycleStatus === "hold" ? `${getLifecycleBadgeMarkup(group)}` : ""}
      ${lifecycleStatus === "checked_out" ? `<span class="booking-tag tag-rejected">Checked Out</span>` : ""}
      ${lifecycleStatus === "hold" && state.currentProfile?.role === "owner" ? `<button class="action-btn" type="button" data-booking-group-action="reactivate">Reactivate</button>` : ""}
      ${(hasCheckInWindowStarted(group) && lifecycleStatus === "booked") ? `<button class="action-btn" type="button" data-booking-group-action="hold">Hold Room</button>` : ""}
      ${isPendingGroupRemovalRequest(groupRequest)
        ? `<span class="booking-tag tag-pending">Pending Remove</span>`
        : ((directEditAllowed || canManageBookings()) || (hasCheckInWindowStarted(group) && lifecycleStatus === "booked"))
          ? `<button class="action-btn subtle-btn" type="button" data-booking-group-action="remove">${hasCheckInWindowStarted(group) && !directEditAllowed && !canManageBookings() ? "Delete Booking" : "Remove Full Booking"}</button>`
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
  const reactivateBtn = bookingDetailsBody.querySelector('[data-booking-group-action="reactivate"]');
  if (reactivateBtn) {
    reactivateBtn.addEventListener("click", async () => {
      try {
        const changed = await performGroupReactivate(group.key);
        if (!changed) return;
        closeBookingDetailsModal();
        showToast("Booking reactivated.");
        await refreshLiveViews();
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
                  <div class="booking-room-row-subtitle">${booking.roomTypeLabel || getRoomTypeDisplay(booking.roomType)} · ${booking.guests} guest(s) · ${formatMoney(pricing.roomTotal)}</div>
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

    card.innerHTML = `
      <div class="booking-group-head booking-group-head-dense">
        <div>
          <h4>${group.trackCode || "-"} · ${group.guestName || "Guest"}</h4>
          <div class="booking-group-summary">${renderBookingHeaderSummary(group)}</div>
        </div>
        <div class="booking-group-statuses booking-group-controls booking-group-controls-stack">
          ${requestButton}
          ${requestActions}
          <span class="booking-tag ${lifecycleStatus === "checked_out" ? "tag-rejected" : lifecycleStatus === "checked_in" ? "tag-success" : lifecycleStatus === "hold" ? "tag-pending" : "tag-success"}">${lifecycleLabel}</span>
          <div class="booking-quick-actions">
            ${canManageBookings() ? `
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
            ${checkInWindowStarted && lifecycleStatus === "booked" ? `
              <button class="secondary-btn compact-control" type="button" data-booking-group-hold="${group.key}" aria-label="Hold Room" title="Hold Room">
                <span class="compact-label">Hold Room</span>
              </button>
            ` : ""}
            ${((directEditAllowed || canManageBookings()) || (checkInWindowStarted && lifecycleStatus === "booked")) ? `
              <button class="secondary-btn remove-reservation-trigger action-btn-icon action-btn-icon-remove compact-control" type="button" data-booking-group-remove="${group.bookings[0].id}" aria-label="${checkInWindowStarted && !directEditAllowed && !canManageBookings() ? "Delete Booking" : "Remove Reservation"}" title="${checkInWindowStarted && !directEditAllowed && !canManageBookings() ? "Delete Booking" : "Remove Reservation"}">
                <span class="compact-label">${checkInWindowStarted && !directEditAllowed && !canManageBookings() ? "Delete Booking" : "Remove Reservation"}</span>
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
            ${state.currentProfile?.role === "owner" ? `
              <button class="secondary-btn compact-control" type="button" data-hold-reactivate="${group.key}" aria-label="Reactivate" title="Reactivate">
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
    card.querySelector('[data-hold-reactivate]')?.addEventListener("click", async () => {
      try {
        const changed = await performGroupReactivate(group.key);
        if (!changed) return;
        showToast("Booking reactivated.");
        await refreshLiveViews();
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
  const booking = state.bookingMap.get(bookingId);
  if (!booking) {
    showToast("Booking not found.", true);
    return;
  }

  const groupView = getBookingGroupByKey(getBookingGroupKey(booking));
  if (!canManageBookings() && mode === "edit") {
    if (groupView && !canEditBookingGroupDirect(groupView)) {
      showToast("This booking is locked after check-in time. Use Check In / Check Out or ask owner/admin access.", true);
      return;
    }
  }

  state.activeBooking = booking;
  state.activeBookingGroup = groupView?.bookings || [booking];
  const groupBookings = state.activeBookingGroup.length ? state.activeBookingGroup : [booking];
  const advanceInfo = getAdvancePaymentInfo(groupBookings);
  const customPriceEntries = (scope === "group" ? getGroupCustomPriceEntries(groupBookings) : getBookingCustomPriceEntries(booking))
    .map((item) => ({ amount: item.amount, note: item.note }));
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
    ? `Current total: ${formatMoney(groupView?.totalPrice || (Number(booking.roomTotal || 0) + getCustomPaymentsTotal(customPriceEntries)))}`
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
  const merged = {
    guestName: "guestName" in values ? values.guestName : currentBooking.guestName,
    phone: "phone" in values ? values.phone : currentBooking.phone,
    checkIn: "checkIn" in values ? values.checkIn : currentBooking.checkIn,
    checkOut: "checkOut" in values ? values.checkOut : currentBooking.checkOut,
    guests: "guests" in values ? Number(values.guests) : Number(currentBooking.guests || 0),
    roomType: "roomType" in values ? values.roomType : currentBooking.roomType,
    roomTypeLabel: "roomTypeLabel" in values ? values.roomTypeLabel : currentBooking.roomTypeLabel,
    roomNumber: "roomNumber" in values ? Number(values.roomNumber) : Number(currentBooking.roomNumber || 0),
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
    guest_name: merged.guestName,
    phone: merged.phone,
    check_in: merged.checkIn,
    check_out: merged.checkOut,
    guests: merged.guests,
    room_type: merged.roomType,
    room_type_label: merged.roomTypeLabel,
    room_number: merged.roomNumber,
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
        roomTypeLabel: getRoomTypeLabelForGuests(roomType, pax),
        roomNumber,
        roomsNeeded: 1,
        notes: request.requestedNotes ?? request.booking?.notes ?? "",
        status: request.requestedBookingStatus || request.booking?.status || "Campaign",
        offerPercentage: request.requestedOfferPercentage ?? request.booking?.offerPercentage ?? 0,
        advancePaid: Boolean(request.booking?.advancePaid),
        advanceAmount: Number(request.booking?.advanceAmount || 0),
        customPayments: request.booking?.customPayments || [],
      });
    }

    await updateRequestStatus(requestId, { status: "approved" });
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

    await updateRequestStatus(requestId, { status: "approved" });
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

    await updateRequestStatus(requestId, { status: "approved" });
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

    await updateRequestStatus(requestId, { status: "approved" });
    return;
  }

  const targetStatus = request.reason === "cancel"
    ? "Cancelled"
    : request.reason === "hold"
      ? "Pending"
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

    await updateRequestStatus(requestId, { status: "approved" });
    return;
  }

  if (request.requestedScope === "group") {
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
      ),
      roomNumber: request.requestedRoomNumber || request.booking?.roomNumber || 0,
      guests: Number(request.requestedGuests || request.booking?.guests || 1),
      notes: request.requestedNotes ?? request.booking?.notes ?? "",
      status: targetStatus,
    });
  }
  await updateRequestStatus(requestId, { status: "approved" });
}

async function rejectRequest(requestId) {
  const adminNote = window.prompt("Reject reason (optional):", "") || "";
  await updateRequestStatus(requestId, { status: "rejected", adminNote });
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
  const hasPendingRequest = pendingCollections.byTrack.get(getBookingGroupKey(booking))?.status === "pending";
  if (String(booking.status || "").toLowerCase() === "pending" || hasPendingRequest) {
    return { bg: "#d9c3f7", border: "#9b68dd", text: "#44206b" };
  }
  const tint = getTrackCodeTint(getBookingGroupKey(booking));
  return { bg: tint.bg, border: tint.border, text: "#241d17" };
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
    return "Pending: Booking";
  }
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

function bindPlannerBookingButtons() {
  reservationPlannerBoard.querySelectorAll("[data-planner-group]").forEach((button) => {
    button.addEventListener("click", () => {
      openBookingDetailsModal(button.dataset.plannerGroup);
    });
  });
}

function renderReservationPlannerMobile(bookings, plannerRooms, startDate, days, pendingCollections) {
  const rangeStart = parseDate(startDate);
  const safeDays = Math.max(7, Math.min(60, Number(days || 14)));
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
    const labelParts = [
      booking.trackCode || `BOOK-${booking.id}`,
      getRoomLabel(normalizeRoomGroup(booking.roomType), booking.roomNumber),
      `${Number(booking.guests || 0)} Pax`,
      pendingLabel || booking.guestName || "Booking",
    ].filter(Boolean);

    dateList.forEach((date, rowIndex) => {
      if (!(bookingStart <= date && bookingEnd > date)) return;
      bookingCells.set(`${rowIndex}:${roomIndex}`, {
        groupKey: getBookingGroupKey(booking),
        label: labelParts.join(" | "),
        colors,
        pending: Boolean(pendingLabel),
      });
    });
  });

  const cells = dateList.map((_, rowIndex) => plannerRooms.map((_, columnIndex) => {
    const marker = bookingCells.get(`${rowIndex}:${columnIndex}`);
    return `
      <div class="reservation-planner-mobile-cell" style="grid-column:${columnIndex + 2}; grid-row:${rowIndex + 2};">
        ${
          marker
            ? `
              <button
                class="reservation-planner-mobile-marker${marker.pending ? " reservation-planner-mobile-marker-pending" : ""}"
                type="button"
                data-planner-group="${escapeHtml(marker.groupKey)}"
                aria-label="${escapeHtml(marker.label)}"
                title="${escapeHtml(marker.label)}"
                style="--planner-bg:${marker.colors.bg}; --planner-border:${marker.colors.border}; --planner-text:${marker.colors.text};"
              ></button>
            `
            : ""
        }
      </div>
    `;
  }).join("")).join("");

  reservationPlannerBoard.innerHTML = `
    <div
      class="reservation-planner-mobile-grid"
      style="grid-template-columns: 54px repeat(${plannerRooms.length}, 34px); grid-template-rows: 38px repeat(${safeDays}, 34px);"
    >
      <div class="reservation-planner-mobile-corner" style="grid-column:1; grid-row:1;">Dates</div>
      ${roomHeaders}
      ${dateLabels}
      ${cells}
    </div>
  `;

  reservationPlannerEmpty.textContent = bookings.length ? "" : "No bookings found in this range.";
  reservationPlannerEmpty.style.display = bookings.length ? "none" : "block";
  bindPlannerBookingButtons();
}

function renderReservationPlanner(bookings, startDate, days) {
  if (!reservationPlannerBoard || !reservationPlannerEmpty) return;

  mergeBookingsIntoStateMap(bookings);
  const groupedBookings = groupBookingsForDisplay(bookings);
  state.plannerBookingGroups = new Map(groupedBookings.map((group) => [group.key, group]));

  const plannerRooms = getPlannerRooms(bookings);
  const rangeStart = parseDate(startDate);
  const safeDays = Math.max(7, Math.min(60, Number(days || 14)));
  const pendingCollections = getLatestPendingRequestCollections();
  const dateList = Array.from({ length: safeDays }, (_, index) => addDays(rangeStart, index));
  const rangeEnd = addDays(rangeStart, safeDays);
  const occupiedNights = bookings.reduce((sum, booking) => {
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
    renderReservationPlannerMobile(bookings, plannerRooms, startDate, safeDays, pendingCollections);
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

  const cells = dateList.map((_, rowIndex) => plannerRooms.map((_, columnIndex) => `
    <div class="reservation-planner-cell" style="grid-column:${columnIndex + 2}; grid-row:${rowIndex + 2};"></div>
  `).join("")).join("");

  const bars = bookings.map((booking) => {
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
    const detailBits = [
      booking.trackCode || `Booking ${booking.id}`,
      `${Number(booking.guests || 0)} Pax`,
      `${booking.guestName || "Guest"}`,
    ];

    return `
      <button
        class="reservation-planner-booking${String(booking.status || "").toLowerCase() === "pending" ? " reservation-planner-booking-pending" : ""}"
        type="button"
        data-planner-group="${escapeHtml(getBookingGroupKey(booking))}"
        style="grid-column:${roomIndex + 2}; grid-row:${startOffset + 2} / span ${span}; --planner-bg:${colors.bg}; --planner-border:${colors.border}; --planner-text:${colors.text};"
        title="${escapeHtml(detailBits.join(" | "))}"
      >
        <span class="reservation-planner-booking-track">${escapeHtml(booking.trackCode || `BOOK-${booking.id}`)}</span>
        ${pendingLabel ? `<span class="reservation-planner-booking-pending-label">${escapeHtml(pendingLabel)}</span>` : ""}
        <span class="reservation-planner-booking-meta">${escapeHtml(`${Number(booking.guests || 0)} Pax`)}</span>
        <span class="reservation-planner-booking-name">${escapeHtml(booking.guestName || "Guest")}</span>
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

  reservationPlannerEmpty.textContent = bookings.length
    ? ""
    : "No bookings found in this range. Rooms are still shown for planning.";
  reservationPlannerEmpty.style.display = bookings.length ? "none" : "block";
  bindPlannerBookingButtons();
}

async function loadReservationPlanner() {
  if (!state.currentProfile?.approved || !plannerStartDateInput || !plannerRangeDaysInput) return;
  const startDate = plannerStartDateInput.value;
  const rangeDays = Math.max(7, Math.min(60, Number(plannerRangeDaysInput.value || 14)));

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
    renderReservationPlanner(bookings, startDate, rangeDays);
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
      };
      next.bookings += 1;
      const roomKey = `${normalizeRoomGroup(booking.roomType)}-${booking.roomNumber}`;
      next.rooms.add(roomKey);
      const roomGroup = normalizeRoomGroup(booking.roomType);
      if (roomGroup === "normal") next.normalRooms.add(roomKey);
      if (roomGroup === "kitchen") next.kitchenRooms.add(roomKey);
      if (roomGroup === "driver") next.driverRooms.add(roomKey);
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

    const lines = [];
    if (meta?.pending) lines.push(`<span class="calendar-stat calendar-stat-pending">${meta.pending} Pending</span>`);
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
    const ownerCanEditPermissions = state.currentProfile.role === "owner" && !isSelf;
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
        const disabled = state.currentProfile.role !== "owner" && role === "owner";
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
        const values = state.currentProfile.role === "owner"
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

  payload.roomTypeLabel = getRoomTypeLabelForGuests(payload.roomType, payload.guests);
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
            roomTypeLabel: getRoomTypeLabelForGuests(roomType, pax),
            roomNumber,
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
      } else if (reason === "edit_booking_data" && effectiveScope === "group") {
        const groupBookings = state.activeBookingGroup.length ? state.activeBookingGroup : [state.activeBooking];
        await applyGroupedBookingEdits(groupBookings, payload.requestedBookingRooms, payload);
      } else if (effectiveScope === "group") {
        const groupBookings = state.activeBookingGroup.length ? state.activeBookingGroup : [state.activeBooking];
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
        roomTypeLabel: getAssignedRoomLabel(plan.room, plan.pax, plan.extraPax),
        roomNumber: plan.room.number,
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
applyBookingViewMode();
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
  if (screens.planner?.classList.contains("screen-active") && plannerStartDateInput?.value) {
    loadReservationPlanner();
  }
});
authTabLogin.addEventListener("click", () => setAuthTab("login"));
authTabSignup.addEventListener("click", () => setAuthTab("signup"));
pendingLogoutBtn.addEventListener("click", handleLogout);
logoutBtn.addEventListener("click", handleLogout);
loadBookingsBtn.addEventListener("click", () => loadBookingsForDate(viewDateInput.value));
plannerPresetButtons.forEach((button) => {
  button.addEventListener("click", () => applyPlannerPreset(button.dataset.plannerPreset));
});
refreshAccountsBtn.addEventListener("click", () => loadAccounts());
refreshRequestsBtn.addEventListener("click", () => loadRequests());
loadAnalyticsBtn?.addEventListener("click", () => loadAnalytics());
analyticsPresetButtons.forEach((button) => {
  button.addEventListener("click", () => applyAnalyticsPreset(button.dataset.analyticsPreset));
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
  } catch (error) {
    showToast(error.message, true);
  } finally {
    savePricingBtn.disabled = false;
    savePricingBtn.textContent = "Save Room Fix";
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
navButtons.hold.addEventListener("click", () => setScreen("hold"));
navButtons.requests.addEventListener("click", () => setScreen("requests"));
navButtons.accounts.addEventListener("click", () => setScreen("accounts"));
navButtons.pricing.addEventListener("click", () => setScreen("pricing"));
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
  state.currentMonthDate = startOfMonth(today);
  initBookingDateRangePicker(today, tomorrow);
  viewDateInput.value = toDateInputValue(today);
  if (analyticsDateFromInput) analyticsDateFromInput.value = toDateInputValue(monthStart);
  if (analyticsDateToInput) analyticsDateToInput.value = toDateInputValue(today);
  renderRoomStatus([]);
  updateStats([]);
  bootstrapSession();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  }
})();
