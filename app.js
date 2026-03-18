const CONFIG = {
  SUPABASE_URL: "https://rxeeeejdyxtbqnvxfxde.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_IvUExYz6ZOxtslILNlB6fw_kEu_Sv78",
  SUPABASE_TABLE: "bookings",
  SUPABASE_PROFILES_TABLE: "profiles",
  SUPABASE_REQUESTS_TABLE: "booking_change_requests",
  GOOGLE_SHEETS_BACKUP_URL: "/.netlify/functions/proxy",
};

const ROOM_SERVICE_OPTIONS = ["Breakfast", "Lunch", "Dinner", "Liquor", "Kitchen", "Car", "Van"];

const ROOM_DEFS = [
  { type: "kitchen", label: "Kitchen Room", count: 2, maxPax: 6 },
  { type: "normal", label: "Normal Room", count: 4, maxPax: 4 },
  { type: "driver", label: "Driver Room", count: 1, maxPax: 4 },
];

const TOTAL_ROOMS = ROOM_DEFS.reduce((sum, room) => sum + room.count, 0);
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
  requestMap: new Map(),
  profileMap: new Map(),
  activeBooking: null,
  activeBookingGroup: [],
  modalExtraRooms: new Map(),
  modalRemoveRooms: new Map(),
  modalBookingRoomEdits: new Map(),
  modalRequestedServices: new Set(),
  modalMode: "request",
  requestScope: "single",
  bookingListFilter: "active",
  requestsFilterMode: "recent",
  requestsFilterStatus: "pending",
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

function toggleHidden(node, hidden) {
  if (node) node.classList.toggle("hidden", hidden);
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
const bookingFilterButtons = {
  active: qs("#booking-filter-active"),
  cancelled: qs("#booking-filter-cancelled"),
  all: qs("#booking-filter-all"),
  pending: qs("#booking-filter-pending"),
};
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
const accountsList = qs("#accounts-list");
const accountsEmpty = qs("#accounts-empty");
const refreshAccountsBtn = qs("#refresh-accounts");
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
const requestExtraRoomsSection = qs("#request-extra-rooms-section");
const requestExtraRooms = qs("#request-extra-rooms");
const requestServicesSection = qs("#request-services-section");
const requestServices = qs("#request-services");
const requestRemoveRoomsSection = qs("#request-remove-rooms-section");
const requestRemoveRooms = qs("#request-remove-rooms");
const requestBookingRoomsSection = qs("#request-booking-rooms-section");
const requestBookingRooms = qs("#request-booking-rooms");
const requestStatusInput = qs("#request-status");
const requestNotesInput = qs("#request-notes");
const requestMessageInput = qs("#request-message");
const requestSubmitBtn = qs("#request-submit");
const bookingDetailsModal = qs("#booking-details-modal");
const bookingDetailsTitle = qs("#booking-details-title");
const bookingDetailsBody = qs("#booking-details-body");
const closeBookingDetailsBtn = qs("#close-booking-details");

const navButtons = {
  booking: qs("#tab-booking"),
  view: qs("#tab-view"),
  requests: qs("#tab-requests"),
  accounts: qs("#tab-accounts"),
};

const screens = {
  booking: qs("#screen-booking"),
  view: qs("#screen-view"),
  requests: qs("#screen-requests"),
  accounts: qs("#screen-accounts"),
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

function datesOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function buildRoomList() {
  return ROOM_DEFS.flatMap((room) => {
    const rooms = [];
    for (let i = 1; i <= room.count; i += 1) {
      rooms.push({
        type: room.type,
        number: i,
        label: room.label,
        fullLabel: `${room.label} ${i}`,
        maxPax: room.maxPax,
      });
    }
    return rooms;
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
      ${ROOM_SERVICE_OPTIONS.map((service) => `
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

async function toggleGroupServiceDirect(groupKey, serviceName) {
  const group = state.bookingGroups.get(groupKey);
  if (!group?.bookings?.length) throw new Error("Booking group not found.");
  const parsed = parseBookingNotes(group.bookings[0].notes);
  const next = new Set(parsed.services);
  if (next.has(serviceName)) next.delete(serviceName);
  else next.add(serviceName);
  const nextServices = Array.from(next);

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
    });
  }
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
      ${ROOM_SERVICE_OPTIONS.map((service) => {
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
    });
  });

  roomServiceAssignments.appendChild(card);
}

function populateRequestRoomNumbers(roomType, selectedNumber) {
  if (!requestRoomNumberInput) return;
  const def = getRoomDef(normalizeRoomGroup(roomType));
  const count = def?.count || 0;
  setHTML(requestRoomNumberInput, Array.from({ length: count }, (_, index) => {
    const value = index + 1;
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
  ROOM_SERVICE_OPTIONS.forEach((service) => {
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
          ${ROOM_SERVICE_OPTIONS.map((service) => `
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
      setHTML(roomNumberSelect, Array.from({ length: def?.count || 0 }, (_, index) => {
        const number = index + 1;
        const selected = number === Number(state.modalBookingRoomEdits.get(String(item.id))?.roomNumber || 1) ? "selected" : "";
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
      state.modalBookingRoomEdits.set(String(item.id), {
        ...current,
        roomType: roomTypeSelect.value,
        roomNumber: 1,
        guests: Math.min(Number(current?.guests || 1), def?.maxPax || 1),
      });
      syncRoomNumbers();
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
  return String(booking.status || "").toLowerCase() !== "cancelled";
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
    createdAt: row.created_at,
  };
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
  return state.currentProfile && ["owner", "admin"].includes(state.currentProfile.role);
}

function canManageRequests() {
  return canManageAccounts();
}

function updateHeaderProfile() {
  if (!state.currentProfile) {
    userChip.textContent = "";
    return;
  }
  userChip.textContent = `${state.currentProfile.full_name || state.currentProfile.username} · ${state.currentProfile.role}`;
}

function updateNavVisibility() {
  const showAccounts = canManageAccounts();
  const showRequests = Boolean(state.currentProfile?.approved);
  navButtons.requests.classList.toggle("hidden", !showRequests);
  navButtons.accounts.classList.toggle("hidden", !showAccounts);
  const columns = showAccounts ? "repeat(4, 1fr)" : "repeat(3, 1fr)";
  qs(".bottom-nav").style.gridTemplateColumns = columns;
  if (!showRequests && screens.requests.classList.contains("screen-active")) {
    setScreen("booking");
  }
  if (!showAccounts && screens.accounts.classList.contains("screen-active")) {
    setScreen("booking");
  }
}

function setScreen(target) {
  Object.values(screens).forEach((screen) => screen.classList.remove("screen-active"));
  Object.values(navButtons).forEach((btn) => btn.classList.remove("nav-active"));

  screens[target].classList.add("screen-active");
  navButtons[target].classList.add("nav-active");
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
      state.profileMap.set(data.user_id, data);
      return data;
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
    };

    const { error } = await state.supabase.from(CONFIG.SUPABASE_TABLE).insert(row);
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

  const results = await Promise.all(
    ROOM_DEFS.map(async (room) => ({
      room,
      bookings: await fetchRangeBookings(room.type, checkIn, checkOut),
    }))
  );

  const availability = {};

  results.forEach(({ room, bookings }) => {
    const booked = new Set();
    const occupied = new Map();

    bookings.forEach((booking) => {
      if (!isBlockingBooking(booking)) return;
      const bookingStart = parseDate(booking.checkIn);
      const bookingEnd = parseDate(booking.checkOut);
      if (!bookingStart || !bookingEnd) return;
      if (!datesOverlap(startDate, endDate, bookingStart, bookingEnd)) return;
      if (normalizeRoomGroup(booking.roomType) !== room.type) return;
      const roomNumber = Number(booking.roomNumber);
      booked.add(roomNumber);
      if (!occupied.has(roomNumber)) occupied.set(roomNumber, booking);
    });

    const available = [];
    for (let i = 1; i <= room.count; i += 1) {
      if (!booked.has(i)) available.push(i);
    }

    availability[room.type] = {
      total: room.count,
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
    renderRoomServiceAssignments();
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
  buildRoomList().forEach((room) => {
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
      <div class="status ${booking ? "status-booked" : "status-available"}">
        ${booking ? "BOOKED" : "AVAILABLE"}
      </div>
    `;
    roomStatusList.appendChild(item);
  });
}

function getBookingGroupKey(booking) {
  return booking.trackCode || `booking-${booking.id}`;
}

function groupBookingsForDisplay(bookings) {
  const groups = new Map();

  bookings.forEach((booking) => {
    const key = getBookingGroupKey(booking);
    const current = groups.get(key);
    if (current) {
      current.bookings.push(booking);
      current.totalGuests += Number(booking.guests || 0);
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
  await openRequestModal(bookingId, mode || (canManageRequests() ? "edit" : "request"), scope);
  requestReasonInput.value = reason;
  syncModalReasonDefaults();
  if (reason === "remove_rooms") {
    preselectRemoveRoomIds(removeBookingIds.length ? removeBookingIds : [bookingId]);
  }
}

function openBookingDetailsModal(groupKey) {
  const group = state.bookingGroups.get(groupKey);
  if (!group) {
    showToast("Booking details not found.", true);
    return;
  }
  const requestCollections = getLatestRequestCollections();
  const pendingCollections = getLatestPendingRequestCollections();
  const requestHistory = getRequestsForTrack(group.trackCode || group.key);
  const groupRequest = pendingCollections.byTrack.get(group.trackCode || group.key);

  bookingDetailsTitle.textContent = `${group.trackCode || "-"} · ${group.guestName || "Guest"}`;
  const groupServices = Array.from(new Set(group.bookings.flatMap((booking) => parseBookingNotes(booking.notes).services)));
  const roomRows = group.bookings
    .map((booking) => {
      const bookingRequest = pendingCollections.byBooking.get(booking.id);
      const roomGroup = normalizeRoomGroup(booking.roomType);
      const noteMeta = parseBookingNotes(booking.notes);
      const metaBits = [
        booking.roomTypeLabel || getRoomTypeDisplay(booking.roomType),
        `${booking.guests} guests`,
        `${booking.checkIn} -> ${booking.checkOut}`,
      ];
      if (noteMeta.extraGuests) metaBits.push(`Extra pax / kids: ${noteMeta.extraGuests}`);
      if (noteMeta.drivers) metaBits.push(`Drivers: ${noteMeta.drivers}`);
      const removeControl = isPendingRoomRemovalRequest(bookingRequest, booking.id)
        ? `<span class="booking-tag tag-pending">Pending Remove</span>`
        : `<button class="action-btn subtle-btn" type="button" data-booking-remove="${booking.id}">Remove</button>`;
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
            <button class="action-btn" type="button" data-booking-detail-action="${canManageRequests() ? "edit" : "request"}" data-booking-id="${booking.id}">
              Update
            </button>
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
    </div>
    ${groupRequest ? `<div class="booking-details-request-banner">${getRequestStatusMarkup(groupRequest, "Latest request")}<span class="booking-history-meta">${formatRequestReason(groupRequest.reason)} · ${getRequestRequestedDate(groupRequest) || "-"}</span></div>` : `<div class="booking-details-request-banner">${getActiveStatusMarkup("Active")}<span class="booking-history-meta">No pending request.</span></div>`}
    ${groupServices.length ? `<div class="booking-details-services-panel"><div class="booking-details-panel-title">Services</div>${renderServiceChips(groupServices)}</div>` : ""}
    ${requestHistoryMarkup}
    <div class="booking-details-actions">
      <button class="primary-btn" type="button" data-booking-group-action="manage">Manage Full Booking</button>
      ${isPendingGroupRemovalRequest(groupRequest)
        ? `<span class="booking-tag tag-pending">Pending Remove</span>`
        : `<button class="action-btn subtle-btn" type="button" data-booking-group-action="remove">Remove Full Booking</button>`}
    </div>
    <div class="booking-room-list booking-details-room-list">${roomRows}</div>
  `;

  const manageBtn = bookingDetailsBody.querySelector('[data-booking-group-action="manage"]');
  if (manageBtn) {
    manageBtn.addEventListener('click', async () => {
      try {
        closeBookingDetailsModal();
        await openRequestModal(group.bookings[0].id, canManageRequests() ? "edit" : "request", "group");
      } catch (error) {
        showToast(error.message || "Unable to open full booking editor.", true);
      }
    });
  }
  const removeGroupBtn = bookingDetailsBody.querySelector('[data-booking-group-action="remove"]');
  if (removeGroupBtn) {
    removeGroupBtn.addEventListener("click", async () => {
      closeBookingDetailsModal();
      await launchBookingAction(group.bookings[0].id, {
        scope: "group",
        reason: "delete_booking",
        mode: "request",
      });
    });
  }

  bookingDetailsBody.querySelectorAll("[data-booking-detail-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        closeBookingDetailsModal();
        await openRequestModal(button.dataset.bookingId, canManageRequests() ? "edit" : "request");
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
      activateScreen("requests");
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
    if (state.bookingListFilter === "active") return booking.status !== "Cancelled";
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
    const requestHistory = getRequestsForTrack(group.trackCode || group.key);
    const groupRequest = pendingCollections.byTrack.get(group.trackCode || group.key);
    const roomRows = group.bookings
      .map((booking) => {
        const bookingRequest = pendingCollections.byBooking.get(booking.id);
        const roomGroup = normalizeRoomGroup(booking.roomType);
        const noteMeta = parseBookingNotes(booking.notes);
        const metaBits = [
          booking.roomTypeLabel || getRoomTypeDisplay(booking.roomType),
          `${booking.guests} guests`,
          `${booking.checkIn} -> ${booking.checkOut}`,
        ];
        if (noteMeta.extraGuests) metaBits.push(`Extra pax / kids: ${noteMeta.extraGuests}`);
        if (noteMeta.drivers) metaBits.push(`Drivers: ${noteMeta.drivers}`);
        const removeControl = isPendingRoomRemovalRequest(bookingRequest, booking.id)
          ? `<span class="booking-tag tag-pending">Pending Remove</span>`
          : `<button class="action-btn subtle-btn" type="button" data-booking-remove="${booking.id}">Remove Room</button>`;
        return `
          <div class="booking-room-row">
            <div class="booking-room-row-main">
              <div class="booking-room-row-title">${getRoomLabel(roomGroup, booking.roomNumber)} (#${booking.roomNumber})</div>
              <div class="booking-room-row-meta">${metaBits.join(" · ")}</div>
              ${bookingRequest ? `<div class="booking-room-row-request">${getRequestStatusMarkup(bookingRequest, "Request")}</div>` : `<div class="booking-room-row-request">${getActiveStatusMarkup("Active")}</div>`}
              ${noteMeta.otherNotes.length ? `<div class="booking-room-row-notes"><span class="booking-room-row-label">Notes</span><div>${noteMeta.otherNotes.join(" | ")}</div></div>` : ""}
            </div>
            <div class="booking-room-row-actions">
              ${removeControl}
              <button class="action-btn" type="button" data-booking-action="${canManageRequests() ? "edit" : "request"}" data-booking-id="${booking.id}">
                Update
              </button>
            </div>
          </div>
        `;
      })
      .join("");

    const requestButton = groupRequest
      ? getRequestStatusMarkup(groupRequest)
      : getActiveStatusMarkup("Active");
    const requestBrief = groupRequest
      ? `<button class="booking-request-brief" type="button" data-request-focus="${groupRequest.id}">${formatRequestReason(groupRequest.reason)} · ${getRequestRequestedDate(groupRequest) || "-"}</button>`
      : `<span class="booking-request-brief muted">No pending request.</span>`;

    card.innerHTML = `
      <div class="booking-group-head booking-group-head-dense">
        <div>
          <h4>${group.trackCode || "-"} · ${group.guestName || "Guest"}</h4>
          <div class="booking-group-summary">${group.bookings.length} room(s) · ${group.totalGuests} guest(s)</div>
        </div>
        <div class="booking-group-statuses booking-group-controls booking-group-controls-stack">
          ${requestButton}
          <button class="secondary-btn booking-type-trigger" type="button" data-booking-group-manage="${group.bookings[0].id}">Booking Type</button>
          <button class="secondary-btn remove-reservation-trigger" type="button" data-booking-group-remove="${group.bookings[0].id}">Remove reservation</button>
        </div>
      </div>
      <div class="booking-date-strip booking-date-strip-wide">
        <div class="booking-date-pill"><span>check in</span><strong>${group.checkIn}</strong></div>
        <div class="booking-date-pill"><span>check out</span><strong>${group.checkOut}</strong></div>
      </div>
      <div class="booking-group-meta-row booking-group-meta-row-tight">
        <div class="booking-group-call">
          <a class="call-link" href="tel:${group.phone || ""}">Call ${group.guestName || "Guest"}</a>
        </div>
        <div class="booking-group-phone"><strong>Phone:</strong> <a href="tel:${group.phone}">${group.phone || "-"}</a></div>
      </div>
      <div class="booking-group-created-by muted"><strong>Booked by:</strong> ${group.bookings[0]?.createdByName || "-"}</div>
      ${requestBrief}
      ${group.bookings.length ? `<div class="booking-room-row-services booking-group-services"><span class="booking-room-row-label">Services</span>${renderGroupServiceToggleButtons(group)}</div>` : ""}
      <div class="booking-room-list">${roomRows}</div>
      <div class="booking-group-footer-actions">
        <button class="booking-add-room-btn" type="button" data-booking-group-add="${group.bookings[0].id}">+</button>
      </div>
    `;

    card.querySelectorAll("[data-booking-action]").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          await openRequestModal(button.dataset.bookingId, canManageRequests() ? "edit" : "request");
        } catch (error) {
          showToast(error.message || "Unable to open booking update.", true);
        }
      });
    });
    card.querySelectorAll("[data-booking-remove]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (!window.confirm("Remove this room from the booking?")) return;
        try {
          await launchBookingAction(button.dataset.bookingRemove, {
            scope: "single",
            reason: "remove_rooms",
            removeBookingIds: [button.dataset.bookingRemove],
            mode: "request",
          });
          showToast("Removal request submitted.");
          await refreshLiveViews();
          await loadRequests();
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
    const bookingTypeBtn = card.querySelector("[data-booking-group-manage]");
    if (bookingTypeBtn) {
      bookingTypeBtn.addEventListener("click", async () => {
        try {
          await openRequestModal(bookingTypeBtn.dataset.bookingGroupManage, canManageRequests() ? "edit" : "request", "group");
        } catch (error) {
          showToast(error.message || "Unable to open booking type editor.", true);
        }
      });
    }
    const removeReservationBtn = card.querySelector("[data-booking-group-remove]");
    if (removeReservationBtn) {
      removeReservationBtn.addEventListener("click", async () => {
        if (!window.confirm("Send a request to remove this full reservation?")) return;
        try {
          await launchBookingAction(group.bookings[0].id, {
            scope: "group",
            reason: "delete_booking",
            mode: "request",
          });
          showToast("Removal request submitted.");
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
        await openRequestModal(addRoomBtn.dataset.bookingGroupAdd, "edit", "group");
        requestReasonInput.value = "additional_rooms";
        syncModalReasonDefaults();
      });
    }
    card.querySelectorAll("[data-request-focus]").forEach((button) => {
      button.addEventListener("click", () => {
        activateScreen("requests");
        state.requestsFilterStatus = "all";
        const request = state.requestMap.get(button.dataset.requestFocus);
        requestsTrackFilter.value = request?.booking?.trackCode || "";
        loadRequests();
      });
    });
    bookingCards.appendChild(card);
  });
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
  setHTML(requestExtraRooms, "");
  setHTML(requestServices, "");
  setHTML(requestRemoveRooms, "");
  setHTML(requestBookingRooms, "");
  state.modalMode = "request";
}

async function openRequestModal(bookingId, mode, scope = "single") {
  const booking = state.bookingMap.get(bookingId);
  if (!booking) {
    showToast("Booking not found.", true);
    return;
  }

  state.activeBooking = booking;
  state.activeBookingGroup = state.bookingGroups.get(getBookingGroupKey(booking))?.bookings || [booking];
  state.requestScope = scope;
  state.modalMode = mode;
  setValue(modalBookingId, booking.id);
  setValue(requestGuestNameInput, booking.guestName || "");
  setValue(requestPhoneInput, booking.phone || "");
  setText(requestCurrentDates, `Current booking dates: ${booking.checkIn || "-"} -> ${booking.checkOut || "-"}`);
  setText(
    requestCurrentRoom,
    `Current room: ${getRoomLabel(normalizeRoomGroup(booking.roomType), booking.roomNumber)} · ${booking.roomTypeLabel || getRoomTypeDisplay(booking.roomType)}`
  );
  setValue(requestCheckInInput, booking.checkIn || "");
  setValue(requestCheckOutInput, booking.checkOut || "");
  const selectedRoomType = normalizeRoomGroup(booking.roomType) || "normal";
  setValue(requestRoomTypeInput, selectedRoomType);
  populateRequestRoomNumbers(selectedRoomType, booking.roomNumber);
  populateRequestGuestsOptions(selectedRoomType, booking.guests || 1);
  setValue(requestStatusInput, booking.status || "Campaign");
  setValue(requestNotesInput, booking.notes || "");
  setValue(requestMessageInput, "");
  setValue(requestReasonInput, scope === "group" ? "edit_booking_data" : "change_date");
  setText(modalTitle, scope === "group"
    ? (mode === "edit" ? "Update Full Booking" : "Request Full Booking Change")
    : (mode === "edit" ? "Update Booking" : "Request Booking Change"));
  setText(requestSubmitBtn, mode === "edit" ? "Save Booking Update" : "Submit Change Request");
  syncModalReasonDefaults();
  await renderAdditionalRoomOptions(booking);
  renderServiceRequestOptions(booking);
  renderRemoveRoomOptions(booking);
  renderBookingRoomEditors(booking);
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
      return "Edit Customer booking data";
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
  const row = {};
  if ("guestName" in values) row.guest_name = values.guestName;
  if ("phone" in values) row.phone = values.phone;
  if ("checkIn" in values) row.check_in = values.checkIn;
  if ("checkOut" in values) row.check_out = values.checkOut;
  if ("guests" in values) row.guests = Number(values.guests);
  if ("roomType" in values) row.room_type = values.roomType;
  if ("roomTypeLabel" in values) row.room_type_label = values.roomTypeLabel;
  if ("roomNumber" in values) row.room_number = Number(values.roomNumber);
  if ("notes" in values) row.notes = values.notes || "";
  if ("status" in values) row.booking_status = values.status;

  const { error } = await state.supabase.from(CONFIG.SUPABASE_TABLE).update(row).eq("id", bookingId);
  if (error) throw new Error(error.message);
}

async function insertChangeRequest(payload) {
  ensureSupabase();
  const { error } = await state.supabase.from(CONFIG.SUPABASE_REQUESTS_TABLE).insert({
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
  });
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
      });
    }

    await updateRequestStatus(requestId, { status: "approved" });
    return;
  }

  if (request.reason === "additional_services") {
    const groupTrackCode = request.booking?.trackCode || "";
    const groupBookings = Array.from(state.bookingMap.values()).filter((booking) => booking.trackCode === groupTrackCode);
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

    for (const roomConfig of removeRooms) {
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
  const grouped = Array.from(state.bookingMap.values()).filter((booking) => booking.trackCode === targetTrackCode);
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
    card.innerHTML = `
      <div class="account-head">
        <div>
          <h4>${booking?.trackCode || "-"} · ${booking?.guestName || request.requestedGuestName || "Booking"}</h4>
          <p>${formatRequestReason(request.reason)}</p>
        </div>
        <span class="booking-tag ${statusClass}">${request.status}</span>
      </div>
      <div class="request-summary">
        <div class="request-summary-line">
          <span><strong>By:</strong> ${
          state.profileMap.get(request.requestedBy)?.full_name ||
          state.profileMap.get(request.requestedBy)?.username ||
          (request.requestedBy === state.currentSession?.user?.id ? state.currentProfile?.full_name || state.currentProfile?.username || "-" : "Staff")
        }</span>
          <span><strong>Date:</strong> ${getRequestRequestedDate(request) || "-"}</span>
        </div>
        <div class="request-summary-line">
          <span><strong>Current:</strong> ${booking?.status || "-"}</span>
          <span><strong>Requested:</strong> ${request.requestedBookingStatus || booking?.status || "-"}</span>
        </div>
      </div>
      <div class="request-meta request-detail">
        <div><strong>Scope:</strong> ${request.requestedScope === "group" ? "Full Booking" : "Single Room"}</div>
        <div><strong>Current:</strong> ${booking?.checkIn || "-"} -> ${booking?.checkOut || "-"} · ${booking?.status || "-"}</div>
        <div><strong>Requested:</strong> ${request.requestedCheckIn || booking?.checkIn || "-"} -> ${request.requestedCheckOut || booking?.checkOut || "-"} · ${request.requestedBookingStatus || booking?.status || "-"}</div>
        <div><strong>Current Room:</strong> ${booking?.roomTypeLabel || "-"} · ${getRoomLabel(normalizeRoomGroup(booking?.roomType || ""), booking?.roomNumber || 0)}</div>
        <div><strong>Requested Room:</strong> ${request.requestedRoomTypeLabel || booking?.roomTypeLabel || "-"} · ${getRoomLabel(normalizeRoomGroup(request.requestedRoomType || booking?.roomType || ""), request.requestedRoomNumber || booking?.roomNumber || 0)}</div>
        ${
          request.requestedExtraRooms?.length
            ? `<div><strong>Additional Rooms:</strong> ${request.requestedExtraRooms
                .map((room) => {
                  const pax = Number(room.pax || 0);
                  return `${getRoomLabel(room.roomType, Number(room.roomNumber))}${pax ? ` (${pax} Pax)` : ""}`;
                })
                .join(", ")}</div>`
            : ""
        }
        ${
          request.requestedRemoveRooms?.length
            ? `<div><strong>Remove Rooms:</strong> ${request.requestedRemoveRooms
                .map((room) => getRoomLabel(room.roomType, Number(room.roomNumber)))
                .join(", ")}</div>`
            : ""
        }
        ${request.requestedServices?.length ? `<div><strong>Services:</strong> ${request.requestedServices.join(", ")}</div>` : ""}
        <div><strong>Phone:</strong> ${request.requestedPhone || booking?.phone || "-"}</div>
        <div><strong>Notes:</strong> ${request.requestedNotes || booking?.notes || "-"}</div>
        <div><strong>Reason Details:</strong> ${request.requestNote || "-"}</div>
        ${
          request.adminNote
            ? `<div><strong>Admin Note:</strong> ${request.adminNote}</div>`
            : ""
        }
      </div>
      <div class="request-actions">
        <button class="action-btn" type="button" data-request-toggle>More</button>
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
      toggleBtn.textContent = open ? "Less" : "More";
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
  statTotal.textContent = bookings.length;
  statOccupied.textContent = bookedRooms.size;
  statAvailable.textContent = TOTAL_ROOMS - bookedRooms.size;
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
    if (!isBlockingBooking(booking)) return;
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
    if (meta?.normalRooms?.size) lines.push(`<span class="calendar-stat calendar-stat-normal">${meta.normalRooms.size} Normal Room</span>`);
    if (meta?.kitchenRooms?.size) lines.push(`<span class="calendar-stat calendar-stat-kitchen">${meta.kitchenRooms.size} Kitchen Room</span>`);
    if (meta?.driverRooms?.size) lines.push(`<span class="calendar-stat calendar-stat-driver">${meta.driverRooms.size} Driver Room</span>`);

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
  return data || [];
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
      <div class="account-actions">
        <label>
          Role
          <select data-role-select ${state.currentProfile.role !== "owner" || isSelf ? "disabled" : ""}>${roleOptions}</select>
        </label>
        <label>
          Access
          <select data-approved-select ${isSelf ? "disabled" : ""}>
            <option value="true"${profile.approved ? " selected" : ""}>Approved</option>
            <option value="false"${!profile.approved ? " selected" : ""}>Blocked</option>
          </select>
        </label>
        <button type="button" class="secondary-btn small-btn" data-save-account ${isSelf ? "disabled" : ""}>Save</button>
      </div>
    `;

    const saveBtn = card.querySelector("[data-save-account]");
    const roleSelect = card.querySelector("[data-role-select]");
    const approvedSelect = card.querySelector("[data-approved-select]");

    saveBtn.addEventListener("click", async () => {
      try {
        saveBtn.disabled = true;
        saveBtn.textContent = "Saving...";
        const nextRole = roleSelect.value;
        const nextApproved = approvedSelect.value === "true";
        const values = state.currentProfile.role === "owner" ? { role: nextRole, approved: nextApproved } : { approved: nextApproved };
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
  if (!requestReasonInput) return;
  const reason = requestReasonInput.value;
  const isDateChange = reason === "change_date";
  const isEditCustomerData = reason === "edit_booking_data";
  const isAdditionalRooms = reason === "additional_rooms";
  const isAdditionalServices = reason === "additional_services";
  const isRemoveRooms = reason === "remove_rooms";
  const isGroupLike = state.requestScope === "group";
  const roomPickerField = requestRoomTypeInput ? requestRoomTypeInput.closest(".field.grid-2") : null;
  const showSingleRoomFields = !(isGroupLike || isAdditionalRooms || isRemoveRooms || isAdditionalServices);

  setText(requestCheckInLabel, isDateChange ? "New Check-in" : "Check-in");
  setText(requestCheckOutLabel, isDateChange ? "New Check-out" : "Check-out");
  toggleHidden(requestDateHelp, !isDateChange);
  toggleHidden(requestExtraRoomsSection, !isAdditionalRooms);
  toggleHidden(requestServicesSection, !isAdditionalServices);
  toggleHidden(requestRemoveRoomsSection, !isRemoveRooms);
  toggleHidden(requestBookingRoomsSection, !isEditCustomerData || state.requestScope !== "group");
  toggleHidden(roomPickerField, !showSingleRoomFields);
  toggleHidden(requestGuestsField, !showSingleRoomFields);
  setValue(requestStatusInput, getDefaultRequestStatus(requestReasonInput.value, state.activeBooking?.status || "Campaign"));
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
  const selectedServices = Array.from(state.modalRequestedServices.values());
  const payload = {
    guestName: requestGuestNameInput.value.trim(),
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
    requestSubmitBtn.textContent = state.modalMode === "edit" ? "Save Booking Update" : "Submit Change Request";
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
  bookingPhoneInput.value = payload.phone;

  if (!payload.guestName || !payload.phone) {
    showToast("Guest name and phone are required.", true);
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
    state.roomPlans.clear();
    state.bookingServices.clear();
    renderRoomServiceAssignments();
    guestsInput.value = "";
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

loginForm.addEventListener("submit", handleLogin);
signupForm.addEventListener("submit", handleSignup);
requestForm.addEventListener("submit", handleRequestSubmit);
authTabLogin.addEventListener("click", () => setAuthTab("login"));
authTabSignup.addEventListener("click", () => setAuthTab("signup"));
pendingLogoutBtn.addEventListener("click", handleLogout);
logoutBtn.addEventListener("click", handleLogout);
loadBookingsBtn.addEventListener("click", () => loadBookingsForDate(viewDateInput.value));
refreshAccountsBtn.addEventListener("click", () => loadAccounts());
refreshRequestsBtn.addEventListener("click", () => loadRequests());
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

requestsDateFromFilter.addEventListener("change", handleRequestDateRangeChange);
requestsDateToFilter.addEventListener("change", handleRequestDateRangeChange);
requestsTrackFilter.addEventListener("input", () => loadRequests());
requestsRequestedByFilter.addEventListener("input", () => loadRequests());
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
navButtons.requests.addEventListener("click", () => setScreen("requests"));
navButtons.accounts.addEventListener("click", () => setScreen("accounts"));

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

(function init() {
  updateOnlineStatus();
  initSupabase();
  setAuthTab("login");
  applyPhoneSanitizer(signupPhoneInput);
  applyPhoneSanitizer(bookingPhoneInput);
  applyPhoneSanitizer(requestPhoneInput);

  const today = new Date();
  const tomorrow = addDays(today, 1);
  state.currentMonthDate = startOfMonth(today);
  initBookingDateRangePicker(today, tomorrow);
  viewDateInput.value = toDateInputValue(today);
  renderRoomStatus([]);
  updateStats([]);
  bootstrapSession();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  }
})();
