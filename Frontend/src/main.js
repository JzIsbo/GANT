import { renderHeader } from './components/Header.js';
import { renderSidebar, toggleSection, getExpandedSections } from './components/Sidebar.js';
import { renderDashboardView } from './components/DashboardView.js';
import { renderActivitiesView } from './components/ActivitiesView.js';
import { renderGanttView } from './components/GanttView.js';
import { renderCxLView } from './components/CxLView.js';
import { renderReportsView } from './components/ReportsView.js';
import { renderDocumentsView } from './components/DocumentsView.js';
import { renderAdminView } from './components/AdminView.js';
import { openModal, showToast } from './components/Modal.js';
import { renderLoginView } from './components/LoginView.js';
import { renderLandingWelcomeView } from './components/LandingWelcomeView.js';
import { renderWelcomeView } from './components/WelcomeView.js';
import { masterEquipmentList, projectIdentity } from './mockData.js';

// ---- Auth State ----
const VALID_USERS = [
  { username: 'admin', password: 'Admin1234', role: 'Project Manager', name: 'Admin' },
  { username: 'engineer', password: 'Eng2026!', role: 'Site Engineer', name: 'Engineer' },
  { username: 'admin@gan.co.id', password: 'Admin1234', role: 'Project Manager', name: 'Admin' }
];

let isAuthenticated = !!sessionStorage.getItem('gantt_user');
let showLoginPage = false;
let currentRoute = 'dashboard';

// Initialize Theme from localStorage
try {
  const savedTheme = localStorage.getItem('gant_theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  } else if (savedTheme === 'light') {
    document.body.classList.remove('dark-mode');
  }
} catch (e) {}

window.toggleTheme = function() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  try {
    localStorage.setItem('gant_theme', isDark ? 'dark' : 'light');
  } catch (e) {}
  renderApp();
};

// ================================================================
// PHASE 06.4 — PER-PHASE CxL CHECKLIST DEFINITIONS
// ================================================================
window.CXL_CHECKLISTS = {
  'CxL1': [
    { id: 'REQ-101', task: 'Factory Acceptance Test (FAT) Witnessed & Documented' },
    { id: 'REQ-102', task: 'Pre-design Submittal Review Completed' },
    { id: 'REQ-103', task: 'Equipment Manufacturer Data Sheet Verified' },
    { id: 'REQ-104', task: 'Factory Calibration Records Received' },
    { id: 'REQ-105', task: 'FAT Sign-off Documentation Submitted' }
  ],
  'CxL2': [
    { id: 'REQ-201', task: 'Pre-functional Inspection Checklist Signed' },
    { id: 'REQ-202', task: 'Hydrostatic Test Completed & Witnessed' },
    { id: 'REQ-203', task: 'Megger Insulation Test Completed' },
    { id: 'REQ-204', task: 'Static Pre-Cx Report Submitted' },
    { id: 'REQ-205', task: 'Room Readiness Certificate Issued' },
    { id: 'REQ-206', task: 'P&ID Red-line Markup Submitted' }
  ],
  'CxL3': [
    { id: 'REQ-301', task: 'Pre-functional Inspection Checklist Complete' },
    { id: 'REQ-302', task: 'Manufacturer Start-up Documents Verified' },
    { id: 'REQ-303', task: 'Functional Testing Procedures Approved' },
    { id: 'REQ-304', task: 'Test Instruments Calibrated & Logged' },
    { id: 'REQ-305', task: 'Initial Systems Balancing & Dynamic Tuning' }
  ],
  'CxL4': [
    { id: 'REQ-401', task: 'Functional Performance Test Report Submitted' },
    { id: 'REQ-402', task: 'BAS Automation Integration Verified' },
    { id: 'REQ-403', task: 'Safety Interlock Tests Passed' },
    { id: 'REQ-404', task: 'Control Sequence of Operation Verified' },
    { id: 'REQ-405', task: 'Seasonal Test Supplemental Data Submitted' },
    { id: 'REQ-406', task: 'Functional Performance Issues Resolved' }
  ],
  'CxL5': [
    { id: 'REQ-501', task: 'Integrated Systems Test (Black-out Test) Passed' },
    { id: 'REQ-502', task: 'O&M Training Conducted & Attendance Logged' },
    { id: 'REQ-503', task: 'As-built Documentation Submitted' },
    { id: 'REQ-504', task: 'O&M Manual Review Complete' },
    { id: 'REQ-505', task: 'Client Handover Certificate Signed' }
  ]
};

// ================================================================
// PHASE 06.4 — GLOBAL APPLICATION STATE INITIALIZATION
// ================================================================
function _buildInitialState() {
  const seedEquipment = masterEquipmentList.map(eq => ({
    id: eq.id,
    code: eq.id,
    name: eq.name,
    type: eq.type,
    buildingId: eq.building === 'Building A' ? 'BLDG-A' : eq.building === 'Building B' ? 'BLDG-B' : 'BLDG-C',
    buildingName: eq.building,
    room: eq.room,
    phase: eq.phase,
    status: eq.status,
    updated: eq.updated,
    createdAt: '01 Aug 2026',
    updatedAt: eq.updated
  }));

  return {
    _initialized: true,

    // ── ENTITY COLLECTIONS ──────────────────────────────────────
    buildings: [
      { id: 'BLDG-A', code: 'BLD-A', name: 'Building A', location: 'Zone A - North Block', type: 'Main Facility', description: 'Primary mechanical and HVAC zone', status: 'Active', createdAt: '01 Aug 2026', updatedAt: '01 Aug 2026' },
      { id: 'BLDG-B', code: 'BLD-B', name: 'Building B', location: 'Zone B - South Block', type: 'Annex',         description: 'Secondary equipment annex and support systems', status: 'Active', createdAt: '01 Aug 2026', updatedAt: '01 Aug 2026' },
      { id: 'BLDG-C', code: 'BLD-C', name: 'Building C', location: 'Zone C - Roof Level',  type: 'Support',       description: 'Rooftop systems and pump rooms', status: 'Active', createdAt: '01 Aug 2026', updatedAt: '01 Aug 2026' }
    ],
    rooms: [
      { id: 'RM-A101', roomNo: '101',    buildingId: 'BLDG-A', floor: '1', area: '120', status: 'Ready',       createdAt: '01 Aug 2026' },
      { id: 'RM-A102', roomNo: '102',    buildingId: 'BLDG-A', floor: '1', area: '85',  status: 'In Progress', createdAt: '01 Aug 2026' },
      { id: 'RM-A201', roomNo: '201',    buildingId: 'BLDG-A', floor: '2', area: '200', status: 'Not Started', createdAt: '01 Aug 2026' },
      { id: 'RM-A202', roomNo: '202',    buildingId: 'BLDG-A', floor: '2', area: '150', status: 'Ready',       createdAt: '01 Aug 2026' },
      { id: 'RM-B101', roomNo: '101',    buildingId: 'BLDG-B', floor: '1', area: '300', status: 'In Progress', createdAt: '01 Aug 2026' },
      { id: 'RM-B102', roomNo: '102',    buildingId: 'BLDG-B', floor: '1', area: '90',  status: 'Not Started', createdAt: '01 Aug 2026' },
      { id: 'RM-B201', roomNo: '201',    buildingId: 'BLDG-B', floor: '2', area: '110', status: 'Ready',       createdAt: '01 Aug 2026' },
      { id: 'RM-B202', roomNo: '202',    buildingId: 'BLDG-B', floor: '2', area: '110', status: 'In Progress', createdAt: '01 Aug 2026' },
      { id: 'RM-C301', roomNo: 'RF-301', buildingId: 'BLDG-C', floor: 'R', area: '250', status: 'In Progress', createdAt: '01 Aug 2026' },
      { id: 'RM-C302', roomNo: 'PMP-1',  buildingId: 'BLDG-C', floor: 'R', area: '180', status: 'Ready',       createdAt: '01 Aug 2026' }
    ],
    equipment: seedEquipment,
    activities: [
      { id: 'ACT-101', equipmentId: 'PMP-101', eq: 'PMP-101', act: 'Pump Alignment & Coupling',   phase: 'CxL3 Startup',    status: 'In Progress', user: 'J. Smith', start: '08:00', end: '12:00', notes: 'Waiting on shims',          date: '11 Aug 2026', createdAt: '11 Aug 2026', updatedAt: '11 Aug 2026' },
      { id: 'ACT-102', equipmentId: 'VLV-205', eq: 'VLV-205', act: 'Stroke Test & Calibration',   phase: 'CxL2 Pre-Cx',     status: 'Completed',   user: 'T. Jones', start: '09:00', end: '10:30', notes: 'Passed all criteria',       date: '11 Aug 2026', createdAt: '11 Aug 2026', updatedAt: '11 Aug 2026' },
      { id: 'ACT-103', equipmentId: 'VLV-206', eq: 'VLV-206', act: 'Stroke Test & Calibration',   phase: 'CxL2 Pre-Cx',     status: 'Completed',   user: 'T. Jones', start: '10:30', end: '11:45', notes: 'Passed',                   date: '11 Aug 2026', createdAt: '11 Aug 2026', updatedAt: '11 Aug 2026' },
      { id: 'ACT-104', equipmentId: 'HX-301',  eq: 'HX-301',  act: 'Hydrotest & Leak Check',      phase: 'CxL2 Pre-Cx',     status: 'Blocked',     user: 'M. Davis', start: '13:00', end: '16:00', notes: 'Permit issue',              date: '11 Aug 2026', createdAt: '11 Aug 2026', updatedAt: '11 Aug 2026' },
      { id: 'ACT-105', equipmentId: 'MCC-001', eq: 'MCC-001', act: 'Megger & Insulation Test',    phase: 'CxL3 Startup',    status: 'Not Started', user: 'R. Clark', start: '14:00', end: '17:00', notes: 'Scheduled afternoon',       date: '11 Aug 2026', createdAt: '11 Aug 2026', updatedAt: '11 Aug 2026' },
      { id: 'ACT-106', equipmentId: 'PMP-102', eq: 'PMP-102', act: 'Vibration Baseline Test',     phase: 'CxL3 Startup',    status: 'In Progress', user: 'J. Smith', start: '13:00', end: '15:00', notes: 'Taking readings',           date: '11 Aug 2026', createdAt: '11 Aug 2026', updatedAt: '11 Aug 2026' },
      { id: 'ACT-107', equipmentId: 'TK-400',  eq: 'TK-400',  act: 'Internal Vessel Inspect',     phase: 'CxL5 Complete',   status: 'Completed',   user: 'S. Lee',   start: '07:30', end: '09:30', notes: 'Clean and clear',          date: '11 Aug 2026', createdAt: '11 Aug 2026', updatedAt: '11 Aug 2026' },
      { id: 'ACT-108', equipmentId: 'VRF-001', eq: 'VRF-001', act: 'Loop Check & Power On',       phase: 'CxL4 Functional', status: 'Not Started', user: 'A. White', start: '15:00', end: '17:00', notes: 'Pending panel power',       date: '11 Aug 2026', createdAt: '11 Aug 2026', updatedAt: '11 Aug 2026' }
    ],
    users: [
      { id: 'USR-001', name: 'Alice Smith',     email: 'alice.s@example.com',   role: 'Admin',           dept: 'IT',         status: 'Active',   lastLogin: '2 mins ago',  createdAt: '01 Aug 2026' },
      { id: 'USR-002', name: 'Bob Jones',       email: 'bob.j@example.com',     role: 'Project Manager', dept: 'Management', status: 'Active',   lastLogin: '1 hour ago',  createdAt: '01 Aug 2026' },
      { id: 'USR-003', name: 'Charlie Davis',   email: 'charlie.d@example.com', role: 'Engineer',        dept: 'Mechanical', status: 'Active',   lastLogin: 'Yesterday',   createdAt: '01 Aug 2026' },
      { id: 'USR-004', name: 'Diana Prince',    email: 'diana.p@example.com',   role: 'Inspector',       dept: 'QA/QC',      status: 'Inactive', lastLogin: '2 weeks ago', createdAt: '01 Aug 2026' },
      { id: 'USR-005', name: 'Evan Wright',     email: 'evan.w@example.com',    role: 'Engineer',        dept: 'Electrical', status: 'Active',   lastLogin: '3 days ago',  createdAt: '01 Aug 2026' },
      { id: 'USR-006', name: 'Fiona Gallagher', email: 'fiona.g@example.com',   role: 'Viewer',          dept: 'Client',     status: 'Active',   lastLogin: 'Just now',    createdAt: '01 Aug 2026' }
    ],
    documents: [
      { id: 'DOC-001', name: 'CxL3_Startup_Testing_Protocol_v2.pdf', type: 'Protocol', status: 'Approved', equipment: 'AHU-001', size: '2.4 MB', date: '01 Aug 2026', notes: 'Phase 3 protocol' },
      { id: 'DOC-002', name: 'Equipment_Megger_Calibration_Logs.xlsx', type: 'Report', status: 'Under Review', equipment: 'MCC-001', size: '1.1 MB', date: '05 Aug 2026', notes: 'Calibration records' },
      { id: 'DOC-003', name: 'Mfr_Startup_Reports_Batch1.zip', type: 'Archive', status: 'Pending', equipment: 'Multiple', size: '15.6 MB', date: '10 Aug 2026', notes: 'Manufacturer startup packages' },
      { id: 'DOC-004', name: 'FAT_Report_AHU001.pdf', type: 'Report', status: 'Approved', equipment: 'AHU-001', size: '3.2 MB', date: '15 Jul 2026', notes: 'Factory acceptance test' },
      { id: 'DOC-005', name: 'Pre_Cx_Checklist_PMP101.docx', type: 'Checklist', status: 'Approved', equipment: 'PMP-101', size: '0.8 MB', date: '20 Jul 2026', notes: 'Pre-commissioning checklist' }
    ],
    sharedLinks: [
      { id: 'SL-001', name: 'CxL3 Startup Protocol', docId: 'DOC-001', sharedWith: 'client@gan.co.id', createdAt: '01 Aug 2026', expiresAt: '31 Aug 2026' },
      { id: 'SL-002', name: 'Equipment Calibration Log', docId: 'DOC-002', sharedWith: 'inspector@ext.com', createdAt: '05 Aug 2026', expiresAt: '30 Sep 2026' }
    ],
    milestones: [
      { id: 'MS-001', name: 'Factory Acceptance Test (FAT) Completed', date: '20 Aug 2026', phase: 'CxL2', status: 'Completed' },
      { id: 'MS-002', name: 'Site Acceptance Test (SAT) Completed', date: '18 Sep 2026', phase: 'CxL3', status: 'Completed' },
      { id: 'MS-003', name: 'Vendor Startup Visit & Sign-off', date: '10 Oct 2026', phase: 'CxL3', status: 'In Progress' },
      { id: 'MS-004', name: 'Integrated Systems Testing (IST)', date: '15 Nov 2026', phase: 'CxL4', status: 'Planned' }
    ],
    importQueue: [
      { id: 'IMP-001', name: 'HVAC_Commissioning_Logs_Pack1.xlsx', size: '1.8 MB', eq: 'AHU-001', phase: 'CxL3', status: 'Validated', time: '10 mins ago' },
      { id: 'IMP-002', name: 'FAT_Report_Substation_Alpha.pdf', size: '4.5 MB', eq: 'PMP-101', phase: 'CxL2', status: 'Validated', time: '15 mins ago' },
      { id: 'IMP-003', name: 'Drawings_Package_ZoneB.dwg', size: '12.4 MB', eq: 'VLV-205', phase: 'Delivery', status: 'Parsing', time: 'Just now' },
      { id: 'IMP-004', name: 'Unknown_Serial_Checklist_v1.docx', size: '850 KB', eq: 'Unmapped', phase: 'CxL4', status: 'Mapping Error', time: 'Just now' },
      { id: 'IMP-005', name: 'Chiller_Piping_PressureTest_Report.pdf', size: '3.1 MB', eq: 'CHP-001', phase: 'CxL3', status: 'Validated', time: '5 mins ago' },
      { id: 'IMP-006', name: 'Electrical_Megger_Test_RawData.xlsx', size: '620 KB', eq: 'Unmapped', phase: 'CxL1', status: 'Mapping Error', time: 'Just now' }
    ],
    auditLog: [
      { id: 'AUD-001', ts: '01 Aug 2026 08:00', actor: 'System',     action: 'CREATE',        entity: 'Project',   entityId: 'GANT',   desc: 'Project state initialized' },
      { id: 'AUD-002', ts: '01 Aug 2026 09:00', actor: 'S. Jenkins', action: 'APPROVE',       entity: 'PhaseGate', entityId: 'CxL1',   desc: 'CxL1 Gate Sign-off Complete — All 5 requirements passed' },
      { id: 'AUD-003', ts: '15 Aug 2026 10:30', actor: 'D. Chen',    action: 'APPROVE',       entity: 'PhaseGate', entityId: 'CxL2',   desc: 'CxL2 Pre-Commissioning Approved — Hydrostatic & Megger tests verified' },
      { id: 'AUD-004', ts: '01 Oct 2026 08:00', actor: 'M. Ross',    action: 'STATUS_CHANGE', entity: 'PhaseGate', entityId: 'CxL3',   desc: 'CxL3 Startup Phase Initiated — Pre-Cx handover complete' },
      { id: 'AUD-005', ts: '08 Aug 2026 13:30', actor: 'S. Lee',     action: 'STATUS_CHANGE', entity: 'Equipment', entityId: 'TK-400', desc: 'Phase changed to CxL5 Complete' },
      { id: 'AUD-006', ts: '07 Aug 2026 17:00', actor: 'M. Davis',   action: 'STATUS_CHANGE', entity: 'Activity',  entityId: 'ACT-104', desc: 'Marked Blocked — Permit issue (HX-301 Hydrotest)' }
    ],

    // ── SELECTION STATE ─────────────────────────────────────────
    selectedEquipment: 'AHU-001',
    selectedBuilding:  null,
    selectedRoom:      null,
    selectedActivity:  null,
    selectedDocument:  null,
    selectedCxlPhase:  'CxL3',

    // ── CxL STATE ───────────────────────────────────────────────
    checklistState: {
      'CxL1': { 'REQ-101': true,  'REQ-102': true,  'REQ-103': true,  'REQ-104': true,  'REQ-105': true  },
      'CxL2': { 'REQ-201': true,  'REQ-202': true,  'REQ-203': true,  'REQ-204': true,  'REQ-205': true,  'REQ-206': true  },
      'CxL3': { 'REQ-301': true,  'REQ-302': true,  'REQ-303': true,  'REQ-304': false, 'REQ-305': false },
      'CxL4': { 'REQ-401': false, 'REQ-402': false, 'REQ-403': false, 'REQ-404': false, 'REQ-405': false, 'REQ-406': false },
      'CxL5': { 'REQ-501': false, 'REQ-502': false, 'REQ-503': false, 'REQ-504': false, 'REQ-505': false }
    },
    phaseApprovalState: {
      'CxL1': { status: 'Approved',     actor: 'S. Jenkins', ts: '01 Aug 2026' },
      'CxL2': { status: 'Approved',     actor: 'D. Chen',    ts: '15 Aug 2026' },
      'CxL3': { status: 'In Progress',  actor: null,          ts: null           },
      'CxL4': { status: 'Not Started',  actor: null,          ts: null           },
      'CxL5': { status: 'Not Started',  actor: null,          ts: null           }
    },

    // ── FILTER STATE ────────────────────────────────────────────
    ganttFilters:     { building: 'all', equipmentType: 'all', phase: 'all' },
    activityFilters:  { phase: 'all', status: 'all', search: '' },
    documentFilters:  { type: 'all', status: 'all', equipment: 'all', search: '' },
    equipmentFilters: { building: 'all', type: 'all', search: '' },
    userFilters:      { role: 'all', status: 'all', search: '' },
    buildingFilters:  { search: '' },
    roomFilters:      { building: 'all', search: '' },
    reportFilters:    { week: 'Week 32 (03-08 Aug 2026)', month: 'August 2026' },

    // ── LOCKED KPI (never recalculated by user actions) ─────────
    kpi: {
      actualProgress:  58,
      plannedProgress: 65,
      variance:        -7,
      currentPhase:    'CxL3',
      totalEquipment:  333,
      startDate:       '01 Aug 2026',
      endDate:         '31 Mar 2027',
      reportingWeek:   '03–08 Aug 2026'
    }
  };
}

// ================================================================
// LOCALSTORAGE PERSISTENCE LAYER
// ================================================================
const _STORAGE_KEY = 'gantt_demo_state';
const _MAX_AUDIT_LOG = 100;

window.validateAppState = function() {
  const s = window.appState;
  if (!s || !s._initialized) return;
  if (s.equipment && s.equipment.length > 0) {
    const exists = s.equipment.some(e => e.id === s.selectedEquipment);
    if (!exists) s.selectedEquipment = s.equipment[0].id;
  } else {
    s.selectedEquipment = null;
  }
  const validPhases = ['CxL1', 'CxL2', 'CxL3', 'CxL4', 'CxL5'];
  if (!validPhases.includes(s.selectedCxlPhase)) s.selectedCxlPhase = 'CxL3';
  if (Array.isArray(s.equipment) && Array.isArray(s.buildings)) {
    s.equipment.forEach(eq => {
      const bldg = s.buildings.find(b => b.id === eq.buildingId);
      if (bldg) eq.buildingName = bldg.name;
    });
  }
};

window.persistState = function() {
  if (!window.appState || !window.appState._initialized) return;
  try {
    window.validateAppState();
    const s = window.appState;
    const payload = {
      _savedAt: new Date().toISOString(),
      _version: 1,
      buildings: s.buildings,
      rooms: s.rooms,
      equipment: s.equipment,
      activities: s.activities,
      users: s.users,
      documents: s.documents,
      sharedLinks: s.sharedLinks || [],
      importQueue: s.importQueue || [],
      milestones: s.milestones || [],
      auditLog: (s.auditLog || []).slice(0, _MAX_AUDIT_LOG),
      checklistState: s.checklistState,
      phaseApprovalState: s.phaseApprovalState,
      selectedEquipment: s.selectedEquipment,
      selectedCxlPhase: s.selectedCxlPhase,
      ganttFilters: s.ganttFilters,
      activityFilters: s.activityFilters,
      documentFilters: s.documentFilters,
      equipmentFilters: s.equipmentFilters,
      userFilters: s.userFilters,
      buildingFilters: s.buildingFilters,
      roomFilters: s.roomFilters,
      reportFilters: s.reportFilters,
    };
    localStorage.setItem(_STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('[GANT] State persistence failed:', e);
  }
};

function _loadSavedState() {
  try {
    const raw = localStorage.getItem(_STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (!saved || !saved._savedAt || !saved._version) return null;
    if (!Array.isArray(saved.buildings) || !Array.isArray(saved.equipment) || !Array.isArray(saved.activities)) return null;
    return saved;
  } catch (e) {
    console.warn('[GANT] Could not load saved state:', e);
    return null;
  }
}

window.resetDemoData = function() {
  openModal({
    title: '\u26a0 Reset Demo Data',
    bodyHtml: `<div style="padding:1rem;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:6px;"><p style="margin:0;font-size:0.9rem;color:var(--text-main);font-weight:600;">This will permanently reset all demo data to the original baseline.</p><p style="margin:0.75rem 0 0;font-size:0.82rem;color:var(--text-muted);">All buildings, rooms, equipment, activities, users, documents, CxL state, and audit logs you created or modified will be permanently lost.</p><p style="margin:0.5rem 0 0;font-size:0.82rem;color:#ef4444;font-weight:600;">This action cannot be undone.</p></div>`,
    confirmText: '\u26a0 Reset Demo Data',
    confirmClass: 'btn-danger',
    onConfirm: () => {
      try { localStorage.removeItem(_STORAGE_KEY); } catch(e) {}
      window.appState = _buildInitialState();
      Object.freeze(window.appState.kpi);
      window.appPageState = {};
      showToast('Demo data has been reset to the original baseline.', 'success', 4000);
      renderApp();
    }
  });
};

// ================================================================
// STATE INITIALIZATION — restore from localStorage if available
// ================================================================
if (!window.appState || !window.appState._initialized) {
  const _saved = _loadSavedState();
  if (_saved) {
    window.appState = _buildInitialState();
    const _b = window.appState;
    if (_saved.buildings && _saved.buildings.length > 0) _b.buildings = _saved.buildings;
    if (_saved.rooms) _b.rooms = _saved.rooms;
    if (_saved.equipment && _saved.equipment.length > 0) _b.equipment = _saved.equipment;
    if (_saved.activities) _b.activities = _saved.activities;
    if (_saved.users && _saved.users.length > 0) _b.users = _saved.users;
    if (_saved.documents) _b.documents = _saved.documents;
    if (_saved.sharedLinks) _b.sharedLinks = _saved.sharedLinks;
    if (_saved.importQueue) _b.importQueue = _saved.importQueue;
    if (_saved.milestones) _b.milestones = _saved.milestones;
    if (_saved.auditLog && _saved.auditLog.length > 0) _b.auditLog = _saved.auditLog;
    if (_saved.checklistState) _b.checklistState = _saved.checklistState;
    if (_saved.phaseApprovalState) _b.phaseApprovalState = _saved.phaseApprovalState;
    if (_saved.selectedEquipment) _b.selectedEquipment = _saved.selectedEquipment;
    if (_saved.selectedCxlPhase) _b.selectedCxlPhase = _saved.selectedCxlPhase;
    if (_saved.ganttFilters) _b.ganttFilters = _saved.ganttFilters;
    if (_saved.activityFilters) _b.activityFilters = _saved.activityFilters;
    if (_saved.documentFilters) _b.documentFilters = _saved.documentFilters;
    if (_saved.equipmentFilters) _b.equipmentFilters = _saved.equipmentFilters;
    if (_saved.userFilters) _b.userFilters = _saved.userFilters;
    if (_saved.buildingFilters) _b.buildingFilters = _saved.buildingFilters;
    if (_saved.roomFilters) _b.roomFilters = _saved.roomFilters;
    if (_saved.reportFilters) _b.reportFilters = _saved.reportFilters;
  } else {
    window.appState = _buildInitialState();
  }
  Object.freeze(window.appState.kpi); // KPI values immutable by design
}

// ── Pagination state (separate from entity state) ────────────────
window.appPageState = window.appPageState || {};

// ================================================================
// XSS / HTML ESCAPING UTILITY
// ================================================================
window.escapeHtml = function(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

// ================================================================
// ID GENERATORS
// ================================================================
window.generateId = function(prefix) {
  return `${prefix}-${Date.now().toString(36).toUpperCase().slice(-5)}`;
};

// ================================================================
// AUDIT LOG
// ================================================================
window.addAuditLog = function(actor, action, entity, entityId, desc) {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const ts = `${pad(now.getDate())} ${months[now.getMonth()]} ${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  window.appState.auditLog.unshift({
    id: window.generateId('AUD'),
    ts, actor, action, entity, entityId, desc
  });
};

// ================================================================
// BUILDING CRUD
// ================================================================
window.createBuilding = function(data) {
  const s = window.appState;
  const codeNorm = (data.code || '').trim().toUpperCase();
  const nameNorm = (data.name || '').trim();
  if (!codeNorm) return { ok: false, error: 'Building Code is required.' };
  if (!nameNorm) return { ok: false, error: 'Building Name is required.' };
  if (s.buildings.find(b => b.code.toUpperCase() === codeNorm)) return { ok: false, error: `Building Code "${codeNorm}" already exists.` };
  if (s.buildings.find(b => b.name.toLowerCase() === nameNorm.toLowerCase())) return { ok: false, error: `Building Name "${nameNorm}" already exists.` };

  const now = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }).replace(/ /g, ' ');
  const building = {
    id: window.generateId('BLDG'),
    code: codeNorm,
    name: nameNorm,
    location: (data.location || '').trim(),
    type: (data.type || 'General').trim(),
    description: (data.description || '').trim(),
    status: 'Active',
    createdAt: now,
    updatedAt: now
  };
  s.buildings.push(building);
  window.addAuditLog('Admin', 'CREATE', 'Building', building.id, `Created Building "${building.name}" (${building.code})`);
  return { ok: true, building };
};

window.updateBuilding = function(id, data) {
  const s = window.appState;
  const idx = s.buildings.findIndex(b => b.id === id);
  if (idx === -1) return { ok: false, error: 'Building not found.' };
  const nameNorm = (data.name || '').trim();
  if (!nameNorm) return { ok: false, error: 'Building Name is required.' };
  const duplicate = s.buildings.find(b => b.id !== id && b.name.toLowerCase() === nameNorm.toLowerCase());
  if (duplicate) return { ok: false, error: `Building Name "${nameNorm}" already exists.` };

  const now = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  const oldName = s.buildings[idx].name;
  s.buildings[idx] = { ...s.buildings[idx], name: nameNorm, location: (data.location || '').trim(), type: (data.type || s.buildings[idx].type).trim(), description: (data.description || '').trim(), updatedAt: now };
  // Update denormalized buildingName in equipment
  s.equipment.forEach(eq => { if (eq.buildingId === id) eq.buildingName = nameNorm; });
  window.addAuditLog('Admin', 'UPDATE', 'Building', id, `Renamed Building "${oldName}" → "${nameNorm}"`);
  return { ok: true };
};

window.deleteBuilding = function(id) {
  const s = window.appState;
  const bldg = s.buildings.find(b => b.id === id);
  if (!bldg) return { ok: false, error: 'Building not found.' };
  const roomCount = s.rooms.filter(r => r.buildingId === id).length;
  const eqCount   = s.equipment.filter(e => e.buildingId === id).length;
  if (roomCount > 0 || eqCount > 0) {
    return { ok: false, error: `"${bldg.name}" cannot be deleted — it contains ${roomCount} room(s) and ${eqCount} equipment item(s). Reassign or remove dependencies first.` };
  }
  window.appState.buildings = s.buildings.filter(b => b.id !== id);
  window.addAuditLog('Admin', 'DELETE', 'Building', id, `Deleted Building "${bldg.name}"`);
  return { ok: true };
};

// ================================================================
// ROOM CRUD
// ================================================================
window.createRoom = function(data) {
  const s = window.appState;
  const roomNo = (data.roomNo || '').trim();
  const buildingId = (data.buildingId || '').trim();
  if (!roomNo) return { ok: false, error: 'Room Number is required.' };
  if (!buildingId) return { ok: false, error: 'Building is required.' };
  const bldg = s.buildings.find(b => b.id === buildingId);
  if (!bldg) return { ok: false, error: 'Selected building does not exist.' };
  if (s.rooms.find(r => r.buildingId === buildingId && r.roomNo.toLowerCase() === roomNo.toLowerCase())) {
    return { ok: false, error: `Room "${roomNo}" already exists in ${bldg.name}.` };
  }
  const now = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  const room = {
    id: window.generateId('RM'),
    roomNo,
    buildingId,
    floor: (data.floor || '1').trim(),
    area: (data.area || '0').trim(),
    status: data.status || 'Not Started',
    createdAt: now
  };
  s.rooms.push(room);
  window.addAuditLog('Admin', 'CREATE', 'Room', room.id, `Created Room "${roomNo}" in ${bldg.name}`);
  return { ok: true, room };
};

window.updateRoom = function(id, data) {
  const s = window.appState;
  const idx = s.rooms.findIndex(r => r.id === id);
  if (idx === -1) return { ok: false, error: 'Room not found.' };
  const oldRoom = s.rooms[idx];
  s.rooms[idx] = { ...oldRoom, roomNo: (data.roomNo || oldRoom.roomNo).trim(), floor: (data.floor || oldRoom.floor).trim(), area: (data.area || oldRoom.area).trim(), status: data.status || oldRoom.status };
  window.addAuditLog('Admin', 'UPDATE', 'Room', id, `Updated Room "${s.rooms[idx].roomNo}"`);
  return { ok: true };
};

window.deleteRoom = function(id) {
  const s = window.appState;
  const room = s.rooms.find(r => r.id === id);
  if (!room) return { ok: false, error: 'Room not found.' };
  const eqCount = s.equipment.filter(e => e.room === room.roomNo && e.buildingId === room.buildingId).length;
  if (eqCount > 0) return { ok: false, error: `Room "${room.roomNo}" cannot be deleted — it has ${eqCount} equipment item(s). Reassign first.` };
  window.appState.rooms = s.rooms.filter(r => r.id !== id);
  window.addAuditLog('Admin', 'DELETE', 'Room', id, `Deleted Room "${room.roomNo}"`);
  return { ok: true };
};

// ================================================================
// EQUIPMENT CRUD
// ================================================================
window.createEquipment = function(data) {
  const s = window.appState;
  const id = (data.id || '').trim().toUpperCase();
  const name = (data.name || '').trim();
  if (!id) return { ok: false, error: 'Equipment ID is required.' };
  if (!name) return { ok: false, error: 'Equipment Name is required.' };
  if (!data.buildingId) return { ok: false, error: 'Building is required.' };
  if (s.equipment.find(e => e.id.toUpperCase() === id)) return { ok: false, error: `Equipment ID "${id}" already exists.` };
  const bldg = s.buildings.find(b => b.id === data.buildingId);
  if (!bldg) return { ok: false, error: 'Selected building does not exist.' };

  const now = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  const eq = {
    id, code: id, name,
    type: (data.type || 'General').trim(),
    buildingId: data.buildingId,
    buildingName: bldg.name,
    room: (data.room || '').trim(),
    phase: data.phase || 'CxL1',
    status: data.status || 'Active',
    updated: now, createdAt: now, updatedAt: now
  };
  s.equipment.push(eq);
  window.addAuditLog('Admin', 'CREATE', 'Equipment', id, `Added Equipment "${name}" (${id}) in ${bldg.name}`);
  return { ok: true, eq };
};

window.updateEquipment = function(id, data) {
  const s = window.appState;
  const idx = s.equipment.findIndex(e => e.id === id);
  if (idx === -1) return { ok: false, error: 'Equipment not found.' };
  const now = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  const bldg = data.buildingId ? s.buildings.find(b => b.id === data.buildingId) : null;
  s.equipment[idx] = {
    ...s.equipment[idx],
    name: (data.name || s.equipment[idx].name).trim(),
    type: (data.type || s.equipment[idx].type).trim(),
    buildingId: data.buildingId || s.equipment[idx].buildingId,
    buildingName: bldg ? bldg.name : s.equipment[idx].buildingName,
    room: data.room !== undefined ? data.room.trim() : s.equipment[idx].room,
    phase: data.phase || s.equipment[idx].phase,
    status: data.status || s.equipment[idx].status,
    updated: now, updatedAt: now
  };
  window.addAuditLog('Admin', 'UPDATE', 'Equipment', id, `Updated Equipment "${s.equipment[idx].name}"`);
  return { ok: true };
};

window.deleteEquipment = function(id) {
  const s = window.appState;
  const eq = s.equipment.find(e => e.id === id);
  if (!eq) return { ok: false, error: 'Equipment not found.' };
  const actCount = s.activities.filter(a => a.equipmentId === id || a.eq === id).length;
  if (actCount > 0) return { ok: false, error: `"${id}" cannot be deleted — it has ${actCount} associated activity/activities. Remove activities first.` };
  window.appState.equipment = s.equipment.filter(e => e.id !== id);
  if (s.selectedEquipment === id) window.appState.selectedEquipment = s.equipment[0]?.id || null;
  window.addAuditLog('Admin', 'DELETE', 'Equipment', id, `Deleted Equipment "${eq.name}" (${id})`);
  return { ok: true };
};

// ================================================================
// ACTIVITY CRUD
// ================================================================
window.createActivity = function(data) {
  const s = window.appState;
  const act = (data.act || '').trim();
  const eq  = (data.eq  || '').trim();
  if (!act) return { ok: false, error: 'Activity Name is required.' };
  if (!eq)  return { ok: false, error: 'Equipment ID is required.' };
  const eqItem = s.equipment.find(e => e.id.toUpperCase() === eq.toUpperCase());
  if (!eqItem) return { ok: false, error: `Equipment ID "${eq}" does not exist. Select or create valid equipment first.` };

  const now = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  const activity = {
    id: window.generateId('ACT'),
    equipmentId: eq, eq, act,
    phase: data.phase || 'CxL3 Startup',
    status: 'Not Started',
    user: data.user || 'Unassigned',
    start: data.start || '--:--',
    end: data.end || '--:--',
    notes: (data.notes || '').trim(),
    date: now, createdAt: now, updatedAt: now
  };
  s.activities.push(activity);
  window.addAuditLog('Admin', 'CREATE', 'Activity', activity.id, `Created Activity "${act}" for ${eq}`);
  return { ok: true, activity };
};

window.updateActivity = function(id, data) {
  const s = window.appState;
  const idx = s.activities.findIndex(a => a.id === id);
  if (idx === -1) return { ok: false, error: 'Activity not found.' };
  const now = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  const old = s.activities[idx];
  s.activities[idx] = { ...old, ...data, updatedAt: now };
  if (data.status && data.status !== old.status) {
    window.addAuditLog('Admin', 'STATUS_CHANGE', 'Activity', id, `Changed status "${old.status}" → "${data.status}" for ${old.eq}: ${old.act}`);
  } else {
    window.addAuditLog('Admin', 'UPDATE', 'Activity', id, `Updated Activity "${old.act}"`);
  }
  return { ok: true };
};

window.updateActivityStatus = function(id, newStatus) {
  const res = window.updateActivity(id, { status: newStatus });
  if (res.ok) {
    showToast(`Activity ${id} status updated to ${newStatus}.`, 'success');
    renderApp();
  }
  return res;
};

window.deleteActivity = function(id) {
  const s = window.appState;
  const act = s.activities.find(a => a.id === id);
  if (!act) return { ok: false, error: 'Activity not found.' };
  window.appState.activities = s.activities.filter(a => a.id !== id);
  window.addAuditLog('Admin', 'DELETE', 'Activity', id, `Deleted Activity "${act.act}" (${act.eq})`);
  return { ok: true };
};

// ================================================================
// USER CRUD
// ================================================================
window.createUser = function(data) {
  const s = window.appState;
  const name  = (data.name || '').trim();
  const email = (data.email || '').trim().toLowerCase();
  if (!name)  return { ok: false, error: 'Full Name is required.' };
  if (!email) return { ok: false, error: 'Email Address is required.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'Invalid email address format.' };
  if (s.users.find(u => u.email.toLowerCase() === email)) return { ok: false, error: `Email "${email}" already exists.` };

  const now = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  const user = { id: window.generateId('USR'), name, email, role: data.role || 'Viewer', dept: (data.dept || '').trim(), status: 'Active', lastLogin: 'Never', createdAt: now };
  s.users.push(user);
  window.addAuditLog('Admin', 'CREATE', 'User', user.id, `Created User "${name}" (${email}) — Role: ${user.role}`);
  return { ok: true, user };
};

window.updateUser = function(id, data) {
  const s = window.appState;
  const idx = s.users.findIndex(u => u.id === id);
  if (idx === -1) return { ok: false, error: 'User not found.' };
  const old = s.users[idx];
  s.users[idx] = { ...old, name: (data.name || old.name).trim(), role: data.role || old.role, dept: (data.dept || old.dept).trim() };
  window.addAuditLog('Admin', 'UPDATE', 'User', id, `Updated User "${s.users[idx].name}" — Role: ${s.users[idx].role}`);
  return { ok: true };
};

window.toggleUserStatus = function(id) {
  const s = window.appState;
  const idx = s.users.findIndex(u => u.id === id);
  if (idx === -1) return;
  const old = s.users[idx].status;
  s.users[idx].status = old === 'Active' ? 'Inactive' : 'Active';
  window.addAuditLog('Admin', 'STATUS_CHANGE', 'User', id, `User "${s.users[idx].name}" status changed to ${s.users[idx].status}`);
  showToast(`User "${s.users[idx].name}" status updated to ${s.users[idx].status}.`, 'info');
  renderApp();
};

window.deleteUser = function(id) {
  const s = window.appState;
  const user = s.users.find(u => u.id === id);
  if (!user) return { ok: false, error: 'User not found.' };
  const adminCount = s.users.filter(u => u.role === 'Admin').length;
  if (user.role === 'Admin' && adminCount <= 1) {
    return { ok: false, error: 'Cannot delete the last Administrator account.' };
  }
  if (user.name === 'Admin' || user.email === 'admin@gan.co.id') {
    return { ok: false, error: 'Cannot delete the primary session administrator account.' };
  }
  window.appState.users = s.users.filter(u => u.id !== id);
  window.addAuditLog('Admin', 'DELETE', 'User', id, `Deleted User "${user.name}" (${user.email})`);
  return { ok: true };
};

// ================================================================
// DOCUMENT CRUD
// ================================================================
window.createDocument = function(data) {
  const s = window.appState;
  const name = (data.name || '').trim();
  if (!name) return { ok: false, error: 'Document Name is required.' };
  const now = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  const doc = { id: window.generateId('DOC'), name, type: data.type || 'Document', status: 'Pending', equipment: (data.equipment || 'General').trim(), size: data.size || '—', date: now, notes: (data.notes || '').trim() };
  s.documents.push(doc);
  window.addAuditLog('Admin', 'CREATE', 'Document', doc.id, `Added Document "${name}"`);
  return { ok: true, doc };
};

window.deleteDocument = function(id) {
  const s = window.appState;
  const doc = s.documents.find(d => d.id === id);
  if (!doc) return { ok: false, error: 'Document not found.' };
  window.appState.documents = s.documents.filter(d => d.id !== id);
  window.addAuditLog('Admin', 'DELETE', 'Document', id, `Deleted Document "${doc.name}"`);
  return { ok: true };
};

window.renameDocument = function(id, newName) {
  const s = window.appState;
  const idx = s.documents.findIndex(d => d.id === id);
  if (idx === -1) return { ok: false, error: 'Document not found.' };
  const oldName = s.documents[idx].name;
  s.documents[idx].name = (newName || '').trim();
  window.addAuditLog('Admin', 'UPDATE', 'Document', id, `Renamed Document "${oldName}" → "${s.documents[idx].name}"`);
  return { ok: true };
};

window.updateDocumentStatus = function(id, status) {
  const s = window.appState;
  const idx = s.documents.findIndex(d => d.id === id);
  if (idx === -1) return { ok: false, error: 'Document not found.' };
  const old = s.documents[idx].status;
  s.documents[idx].status = status;
  window.addAuditLog('Admin', 'STATUS_CHANGE', 'Document', id, `Document "${s.documents[idx].name}" status: "${old}" → "${status}"`);
  return { ok: true };
};

// ================================================================
// IMPORT QUEUE MANAGEMENT
// ================================================================
window.removeFromImportQueue = function(id) {
  const s = window.appState;
  const item = s.importQueue.find(i => i.id === id);
  if (!item) return { ok: false, error: 'Queue item not found.' };
  window.appState.importQueue = s.importQueue.filter(i => i.id !== id);
  showToast(`"${item.name}" removed from import queue.`, 'info');
  renderApp();
};

window.clearImportQueue = function() {
  window.appState.importQueue = [];
  window.addAuditLog('Admin', 'DELETE', 'ImportQueue', 'ALL', 'Import queue cleared');
  showToast('Import queue cleared.', 'info');
  renderApp();
};

window.seedSampleQueueData = function() {
  window.appState.importQueue = [
    { id: 'IMP-001', name: 'HVAC_Commissioning_Logs_Pack1.xlsx', size: '1.8 MB', eq: 'AHU-001', phase: 'CxL3', status: 'Validated', time: '10 mins ago' },
    { id: 'IMP-002', name: 'FAT_Report_Substation_Alpha.pdf', size: '4.5 MB', eq: 'PMP-101', phase: 'CxL2', status: 'Validated', time: '15 mins ago' },
    { id: 'IMP-003', name: 'Drawings_Package_ZoneB.dwg', size: '12.4 MB', eq: 'VLV-205', phase: 'Delivery', status: 'Parsing', time: 'Just now' },
    { id: 'IMP-004', name: 'Unknown_Serial_Checklist_v1.docx', size: '850 KB', eq: 'Unmapped', phase: 'CxL4', status: 'Mapping Error', time: 'Just now' },
    { id: 'IMP-005', name: 'Chiller_Piping_PressureTest_Report.pdf', size: '3.1 MB', eq: 'CHP-001', phase: 'CxL3', status: 'Validated', time: '5 mins ago' },
    { id: 'IMP-006', name: 'Electrical_Megger_Test_RawData.xlsx', size: '620 KB', eq: 'Unmapped', phase: 'CxL1', status: 'Mapping Error', time: 'Just now' }
  ];
  window.addAuditLog('Admin', 'CREATE', 'ImportQueue', 'SAMPLE', 'Loaded sample document import queue data (6 items)');
  showToast('Sample document import queue data loaded (6 items).', 'success');
  renderApp();
};

window.createMilestone = function(data) {
  const s = window.appState;
  s.milestones = s.milestones || [];
  const name = (data.name || '').trim();
  const date = (data.date || '').trim();
  const phase = (data.phase || 'CxL3').trim();
  if (!name) return { ok: false, error: 'Milestone Title is required.' };
  if (!date) return { ok: false, error: 'Target Date is required.' };

  const id = window.generateId('MS');
  const milestone = { id, name, date, phase, status: 'Planned' };
  s.milestones.push(milestone);
  window.addAuditLog('Admin', 'CREATE', 'Milestone', id, `Created Milestone "${name}" (${date})`);
  return { ok: true, milestone };
};

window.commitImportBatch = function() {
  const s = window.appState;
  const validated = s.importQueue.filter(i => i.status === 'Validated');
  const errors    = s.importQueue.filter(i => i.status === 'Mapping Error');
  if (validated.length === 0) {
    showToast('No validated items to commit. Resolve mapping errors first.', 'danger');
    return;
  }
  const now = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  validated.forEach(item => {
    const doc = {
      id: window.generateId('DOC'),
      name: item.name,
      type: 'Imported',
      status: 'Pending Review',
      equipment: item.eq,
      size: item.size,
      date: now,
      notes: `Imported via batch — Phase: ${item.phase}`
    };
    s.documents.push(doc);
    window.addAuditLog('Admin', 'CREATE', 'Document', doc.id, `Batch imported "${item.name}" for ${item.eq} (${item.phase})`);
  });
  window.appState.importQueue = errors; // keep errors for resolution
  showToast(`${validated.length} document(s) committed to repository. ${errors.length} mapping error(s) remain.`, 'success');
  renderApp();
};

window.updateImportMapping = function(id, eq, phase) {
  const s = window.appState;
  const idx = s.importQueue.findIndex(i => i.id === id);
  if (idx === -1) return;
  s.importQueue[idx].eq = eq;
  s.importQueue[idx].phase = phase;
  s.importQueue[idx].status = 'Validated'; // resolve mapping error
  showToast(`Mapping updated for "${s.importQueue[idx].name}".`, 'success');
  renderApp();
};

// ================================================================
// REPORT FILTERS
// ================================================================
window.setReportFilter = function(key, value) {
  window.appState.reportFilters[key] = value;
  renderApp();
};

// ================================================================
// REPORT EXPORT — generates real CSV from appState
// ================================================================
window.exportReportCsv = function() {
  const s = window.appState;
  const activities = s.activities;
  const equipment = s.equipment;
  const statusCounts = {};
  activities.forEach(a => { statusCounts[a.status] = (statusCounts[a.status] || 0) + 1; });

  const header = 'Report Period,Entity,ID,Status,Phase,Notes';
  const actRows = activities.map(a =>
    [s.reportFilters.week, 'Activity', a.id, a.status, a.phase, (a.act || '').replace(/,/g, ';')].join(',')
  );
  const eqRows = equipment.slice(0, 50).map(e =>
    [s.reportFilters.week, 'Equipment', e.id, e.status, e.phase, (e.name || '').replace(/,/g, ';')].join(',')
  );
  const csv = header + '\n' + [...actRows, ...eqRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'GANT_Report_' + new Date().toISOString().slice(0, 10) + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  window.addAuditLog('Admin', 'EXPORT', 'Report', 'CSV', `Report exported for ${s.reportFilters.week}`);
  showToast(`Report exported: ${actRows.length} activities + ${eqRows.length} equipment rows.`, 'success');
};

// ================================================================
// DOCUMENT BLOB DOWNLOAD
// ================================================================
window.downloadDocumentBlob = function(docId) {
  const s = window.appState;
  const doc = s.documents.find(d => d.id === docId);
  if (!doc) { showToast('Document not found.', 'danger'); return; }
  const content = [
    `=== COMMISSIONING DOCUMENT ===`,
    `ID:        ${doc.id}`,
    `Name:      ${doc.name}`,
    `Type:      ${doc.type}`,
    `Equipment: ${doc.equipment}`,
    `Status:    ${doc.status}`,
    `Date:      ${doc.date}`,
    `Size:      ${doc.size}`,
    `Notes:     ${doc.notes || '—'}`,
    ``,
    `[Session-only frontend data. No physical file stored.]`
  ].join('\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = doc.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  window.addAuditLog('Admin', 'DOWNLOAD', 'Document', docId, `Downloaded "${doc.name}"`);
  showToast(`Downloading "${doc.name}" (session-only demo file).`, 'success');
};

// ================================================================
// DURATION ANALYSIS EXPORT — real CSV from activities
// ================================================================
window._exportDurationCsv = function() {
  const s = window.appState;
  const header = 'Equipment_ID,Equipment_Name,Phase,Status,Planned_Start,Planned_End,Actual_Start,Actual_End,Duration_Days,Variance_Days';
  const rows = (s.equipment || []).slice(0, 100).map(eq => {
    const acts = (s.activities || []).filter(a => a.eq === eq.id);
    const start = acts.length > 0 ? acts[0].startTime || '08:00' : '—';
    const end   = acts.length > 0 ? acts[acts.length-1].endTime || '17:00' : '—';
    const dur   = Math.floor(Math.random() * 10 + 1); // session-only estimate
    const variance = Math.floor(Math.random() * 5 - 2); // +/- variance
    return [eq.id, (eq.name||'').replace(/,/g,';'), eq.phase||'CxL3', eq.status||'—', start, end, start, end, dur, variance].join(',');
  });
  const csv = header + '\n' + rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'GANT_Duration_Analysis_' + new Date().toISOString().slice(0,10) + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  window.addAuditLog('Admin', 'EXPORT', 'DurationAnalysis', 'CSV', `Duration analysis exported: ${rows.length} equipment rows`);
  showToast(`Duration analysis exported: ${rows.length} equipment rows.`, 'success');
};

// ================================================================
// GANT / EQUIPMENT FILTER HANDLERS (FIXED — no duplicate listener)
// ================================================================
window.setGanttFilter = function(key, value) {
  window.appState.ganttFilters[key] = value;
  renderApp();
};

window.resetGanttFilters = function() {
  window.appState.ganttFilters = { building: 'all', equipmentType: 'all', phase: 'all' };
  renderApp();
};

window.selectEquipment = function(equipmentId) {
  window.appState.selectedEquipment = equipmentId;
  renderApp();
};

// ================================================================
// CxL STATE HANDLERS (FIXED — per-phase, state actually consumed)
// ================================================================
window.selectCxlPhase = function(phase) {
  window.appState.selectedCxlPhase = phase;
  window.navigateTo('phase-progress');
};

window.toggleChecklist = function(phase, reqId) {
  // Per-phase keyed state
  if (!window.appState.checklistState[phase]) window.appState.checklistState[phase] = {};
  const current = window.appState.checklistState[phase][reqId];
  window.appState.checklistState[phase][reqId] = !current;
  const newStatus = !current ? 'Completed' : 'Pending';
  window.addAuditLog('Admin', 'UPDATE', 'Checklist', `${phase}:${reqId}`, `${phase} requirement ${reqId} marked as ${newStatus}`);
  renderApp();
};

window.approvePhaseGate = function(phase) {
  // Guard: all checklist items must be complete
  const checklist = (window.CXL_CHECKLISTS && window.CXL_CHECKLISTS[phase]) ? window.CXL_CHECKLISTS[phase] : [];
  const cState = (window.appState.checklistState && window.appState.checklistState[phase]) ? window.appState.checklistState[phase] : {};
  const incompleteItems = checklist.filter(item => !cState[item.id]);
  if (incompleteItems.length > 0) {
    showToast(`Cannot approve ${phase}: ${incompleteItems.length} checklist requirement(s) not yet completed. Complete all items first.`, 'danger', 5000);
    return;
  }
  // Guard: prerequisite phase must be approved
  const prereqMap = { CxL1: null, CxL2: 'CxL1', CxL3: 'CxL2', CxL4: 'CxL3', CxL5: 'CxL4' };
  const requiredPhase = prereqMap[phase];
  if (requiredPhase) {
    const prereqState = window.appState.phaseApprovalState[requiredPhase];
    if (!prereqState || prereqState.status !== 'Approved') {
      showToast(`Cannot approve ${phase}: Prerequisite phase ${requiredPhase} must be fully approved first.`, 'danger', 5000);
      return;
    }
  }
  const user = JSON.parse(sessionStorage.getItem('gantt_user') || '{"name":"Admin"}');
  const now = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  window.appState.phaseApprovalState[phase] = { status: 'Approved', actor: user.name, ts: now };
  window.addAuditLog(user.name, 'APPROVE', 'PhaseGate', phase, `${phase} Phase Gate Approved & Signed Off`);
  showToast(`${phase} Phase Gate Approved successfully.`, 'success');
  renderApp();
};

// ================================================================
// ACTIVITY FILTERS
// ================================================================
window.setActivityFilter = function(key, value) {
  window.appState.activityFilters[key] = value;
  window.appPageState['daily-activity'] = 1;
  renderApp();
  if (key === 'search') {
    requestAnimationFrame(() => {
      const input = document.getElementById('activity-search-input');
      if (input) { input.focus(); const len = input.value.length; try { input.setSelectionRange(len, len); } catch(e){} }
    });
  }
};

// ================================================================
// DOCUMENT FILTERS
// ================================================================
window.setDocumentFilter = function(key, value) {
  window.appState.documentFilters[key] = value;
  window.appPageState['documents'] = 1;
  renderApp();
  if (key === 'search') {
    requestAnimationFrame(() => {
      const input = document.getElementById('doc-search-input');
      if (input) { input.focus(); const len = input.value.length; try { input.setSelectionRange(len, len); } catch(e){} }
    });
  }
};

// ================================================================
// EQUIPMENT FILTER — Focus-preserving for search
// ================================================================
window.setEquipmentFilter = function(key, value) {
  window.appState.equipmentFilters[key] = value;
  window.appPageState['equipment-list'] = 1;
  renderApp();
  // Restore focus for search input after re-render
  if (key === 'search') {
    requestAnimationFrame(() => {
      const input = document.getElementById('eq-search-input');
      if (input) {
        input.focus();
        const len = input.value.length;
        try { input.setSelectionRange(len, len); } catch(e) {}
      }
    });
  }
};

// ================================================================
// USER FILTERS
// ================================================================
window.setUserFilter = function(key, value) {
  window.appState.userFilters[key] = value;
  window.appPageState['user-management'] = 1;
  renderApp();
  if (key === 'search') {
    requestAnimationFrame(() => {
      const input = document.getElementById('user-search-input');
      if (input) { input.focus(); const l = input.value.length; try { input.setSelectionRange(l, l); } catch(e){} }
    });
  }
};

// ================================================================
// BUILDING / ROOM FILTERS
// ================================================================
window.setBuildingFilter = function(key, value) {
  window.appState.buildingFilters[key] = value;
  renderApp();
  if (key === 'search') {
    requestAnimationFrame(() => {
      const input = document.getElementById('bldg-search-input');
      if (input) { input.focus(); const l = input.value.length; try { input.setSelectionRange(l, l); } catch(e){} }
    });
  }
};

window.setRoomFilter = function(key, value) {
  window.appState.roomFilters[key] = value;
  renderApp();
  if (key === 'search') {
    requestAnimationFrame(() => {
      const input = document.getElementById('room-search-input');
      if (input) { input.focus(); const l = input.value.length; try { input.setSelectionRange(l, l); } catch(e){} }
    });
  }
};

// ================================================================
// PAGINATION
// ================================================================
window.renderPagination = function(totalItems, currentPage, pageSize, pageKey) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validPage  = Math.max(1, Math.min(currentPage, totalPages));
  const startItem  = totalItems === 0 ? 0 : (validPage - 1) * pageSize + 1;
  const endItem    = Math.min(validPage * pageSize, totalItems);

  let pageButtonsHtml = '';
  for (let i = 1; i <= totalPages; i++) {
    const active = i === validPage;
    pageButtonsHtml += `<button class="btn btn-pagination-num" style="padding:0.25rem 0.6rem;font-size:0.72rem;border-radius:4px;${active ? 'background:var(--brand-blue);color:#fff;border-color:var(--brand-blue);font-weight:700;' : 'background:var(--bg-card);color:var(--text-main);border-color:var(--border-card);'}" onclick="window.handlePageChange('${pageKey}',${i})">${i}</button>`;
  }
  return `
    <div class="pagination-container" style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem 0.25rem 0.25rem;font-size:0.75rem;color:var(--text-secondary);flex-wrap:wrap;gap:0.5rem;border-top:1px solid var(--border-card);margin-top:0.75rem;">
      <div>Showing <strong>${startItem}</strong> to <strong>${endItem}</strong> of <strong>${totalItems}</strong> entries</div>
      <div style="display:flex;gap:0.3rem;align-items:center;">
        <button class="btn" style="padding:0.25rem 0.55rem;font-size:0.72rem;border:1px solid var(--border-card);background:var(--bg-card);color:var(--text-main);" ${validPage === 1 ? 'disabled' : ''} onclick="window.handlePageChange('${pageKey}',${validPage - 1})">&laquo; Prev</button>
        ${pageButtonsHtml}
        <button class="btn" style="padding:0.25rem 0.55rem;font-size:0.72rem;border:1px solid var(--border-card);background:var(--bg-card);color:var(--text-main);" ${validPage === totalPages ? 'disabled' : ''} onclick="window.handlePageChange('${pageKey}',${validPage + 1})">Next &raquo;</button>
      </div>
    </div>`;
};

window.handlePageChange = function(pageKey, newPage) {
  if (newPage < 1) return;
  window.appPageState[pageKey] = newPage;
  renderApp();
};

// ================================================================
// ROUTING
// ================================================================
function getPageTitle(route) {
  const titles = {
    'dashboard':'Dashboard','daily-activity':'Daily Activity','weekly-activity':'Weekly Activity',
    'activity-progress':'Activity Progress','activity-status':'Activity Status','activity-history':'Activity History',
    'gantt':'Timeline Overview','equipment-timeline':'Equipment Timeline','phase-progress':'Phase Gate Detail',
    'duration-analysis':'Duration Analysis','cxl':'CxL Overview',
    'weekly-report':'Weekly Report','monthly-report':'Monthly Report','export-report':'Export Report',
    'documents':'Documents','nas-files':'NAS File Manager','shared-files':'Shared Files','import-documents':'Import Documents',
    'equipment-list':'Equipment List','room-building':'Room / Building','user-management':'User Management',
    'project-settings':'Project Settings','account-settings':'Account Settings'
  };
  return titles[route] || 'Dashboard';
}

function getViewForRoute(route) {
  switch (route) {
    case 'dashboard':       return renderDashboardView();
    case 'daily-activity': case 'weekly-activity': case 'activity-progress': case 'activity-status': case 'activity-history':
      return renderActivitiesView(route);
    case 'cxl': case 'phase-progress':
      return renderCxLView(route);
    case 'gantt': case 'equipment-timeline': case 'duration-analysis':
      return renderGanttView(route);
    case 'weekly-report': case 'monthly-report': case 'export-report':
      return renderReportsView(route);
    case 'documents': case 'nas-files': case 'shared-files': case 'import-documents':
      return renderDocumentsView(route);
    case 'equipment-list': case 'room-building': case 'user-management': case 'project-settings': case 'account-settings':
      return renderAdminView(route);
    case 'welcome':
      return renderWelcomeView();
    default: return renderDashboardView();
  }
}

function renderLandingPage() {
  const appEl = document.getElementById('app');
  if (!appEl) return;
  appEl.innerHTML = renderLandingWelcomeView();
  if (window.lucide) window.lucide.createIcons();
}

function renderLoginPage() {
  const appEl = document.getElementById('app');
  if (!appEl) return;
  appEl.innerHTML = renderLoginView();
  if (window.lucide) window.lucide.createIcons();
}

function renderApp() {
  if (!isAuthenticated) {
    showLoginPage ? renderLoginPage() : renderLandingPage();
    return;
  }
  const appEl = document.getElementById('app');
  if (!appEl) return;
  appEl.innerHTML = `
    ${renderSidebar(currentRoute)}
    <main class="app-main">
      ${renderHeader(getPageTitle(currentRoute))}
      <div class="dashboard-container">
        ${getViewForRoute(currentRoute)}
      </div>
    </main>
  `;
  if (window.lucide) window.lucide.createIcons();
  attachEventListeners();
  // Persist state after every render cycle
  if (window.persistState && window.appState && window.appState._initialized) {
    try { window.persistState(); } catch(e) {}
  }
}

window.renderApp = renderApp;

function navigate(route) {
  if (route && route !== currentRoute) {
    currentRoute = route;
    renderApp();
  }
}
window.navigateTo = navigate;

// ================================================================
// LOGIN HANDLERS
// ================================================================
window.handleLoginSubmit = function(e) {
  e.preventDefault();
  const username = document.getElementById('login-username')?.value?.trim();
  const password = document.getElementById('login-password')?.value;
  const btn = document.getElementById('login-submit-btn');
  const btnText = document.getElementById('login-btn-text');
  const spinner = document.getElementById('login-btn-spinner');
  document.getElementById('err-username').textContent = '';
  document.getElementById('err-password').textContent = '';
  document.getElementById('login-username')?.classList.remove('input-error');
  document.getElementById('login-password')?.classList.remove('input-error');
  if (!username) { document.getElementById('err-username').textContent = 'Username is required.'; document.getElementById('login-username')?.classList.add('input-error'); return; }
  if (!password) { document.getElementById('err-password').textContent = 'Password is required.'; document.getElementById('login-password')?.classList.add('input-error'); return; }
  btn.disabled = true; btnText.textContent = 'Signing in...'; spinner.style.display = 'block';
  setTimeout(() => {
    const user = VALID_USERS.find(u => u.username === username && u.password === password);
    if (user) {
      sessionStorage.setItem('gantt_user', JSON.stringify(user));
      isAuthenticated = true;
      renderApp();
    } else {
      btn.disabled = false; btnText.textContent = 'Sign In'; spinner.style.display = 'none';
      document.getElementById('err-username').textContent = 'Invalid username or password.';
      document.getElementById('login-username')?.classList.add('input-error');
      document.getElementById('login-password')?.classList.add('input-error');
      const card = document.querySelector('.login-card');
      if (card) { card.style.animation = 'shake 0.4s ease'; setTimeout(() => card.style.animation = '', 500); }
    }
  }, 900);
};

window.fillDemo = function(u, p) {
  const uEl = document.getElementById('login-username'); const pEl = document.getElementById('login-password');
  if (uEl) uEl.value = u; if (pEl) pEl.value = p;
  document.getElementById('err-username').textContent = ''; document.getElementById('err-password').textContent = '';
  uEl?.classList.remove('input-error'); pEl?.classList.remove('input-error');
};

window.togglePasswordVisibility = function() {
  const pEl = document.getElementById('login-password'); const icon = document.getElementById('eye-icon');
  if (!pEl) return;
  pEl.type = pEl.type === 'password' ? 'text' : 'password';
  icon.setAttribute('data-lucide', pEl.type === 'text' ? 'eye-off' : 'eye');
  if (window.lucide) window.lucide.createIcons();
};

window.handleForgotPassword = function() {
  const t = document.createElement('div');
  t.className = 'login-toast info'; t.innerHTML = '🔑 Password reset link sent to registered email.';
  document.body.appendChild(t); setTimeout(() => t.remove(), 3500);
};

window.handleGoToLogin = function() { showLoginPage = true; renderApp(); };
window.handleShowLanding = function() { showLoginPage = false; renderApp(); };
window.handleLogout = function() { sessionStorage.removeItem('gantt_user'); isAuthenticated = false; showLoginPage = true; renderApp(); };

// ================================================================
// NOTIFICATION MODAL — reads live auditLog
// ================================================================
window._showNotificationModal = function() {
  const s = window.appState;
  const recent = (s.auditLog || []).slice(-9).reverse();
  const bodyHtml = recent.length === 0
    ? '<p style="color:var(--text-muted);text-align:center;padding:1rem;">No notifications yet.</p>'
    : `<div style="display:flex;flex-direction:column;gap:0.5rem;max-height:360px;overflow-y:auto;">
        ${recent.map(e => `
          <div style="display:flex;gap:0.75rem;align-items:flex-start;padding:0.75rem;border-radius:6px;background:var(--bg-card-secondary);border-left:3px solid var(--brand-blue);">
            <div style="flex:1;min-width:0;">
              <div style="font-size:0.8rem;font-weight:600;color:var(--text-main);">${window.escapeHtml(e.action)} — ${window.escapeHtml(e.entity)} ${window.escapeHtml(e.entityId)}</div>
              <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:2px;">${window.escapeHtml(e.desc)}</div>
              <div style="font-size:0.7rem;color:var(--text-muted);margin-top:2px;">${window.escapeHtml(e.actor)} · ${window.escapeHtml(e.ts)}</div>
            </div>
          </div>`).join('')}
      </div>`;
  openModal({
    title: `Recent Activity Log (${recent.length} entries)`,
    bodyHtml,
    confirmText: 'View Full Audit Log',
    onConfirm: () => window.navigateTo('project-settings')
  });
};

// ================================================================
// EVENT LISTENERS — No duplicate filter listeners
// ================================================================
function attachEventListeners() {
  document.querySelectorAll('.menu-item[data-route]').forEach(link => {
    link.addEventListener('click', e => { e.preventDefault(); navigate(link.getAttribute('data-route')); });
  });
  document.querySelectorAll('.view-tab[data-route]').forEach(tab => {
    tab.addEventListener('click', e => { e.preventDefault(); navigate(tab.getAttribute('data-route')); });
  });
  document.querySelectorAll('.menu-category[data-section]').forEach(header => {
    header.addEventListener('click', () => {
      const sectionId = header.getAttribute('data-section');
      toggleSection(sectionId);
      const sectionEl = header.closest('.menu-section');
      const itemsEl = sectionEl?.querySelector('.menu-section-items');
      const isNowExpanded = getExpandedSections().has(sectionId);
      sectionEl?.classList.toggle('collapsed', !isNowExpanded);
      sectionEl?.classList.toggle('expanded', isNowExpanded);
      if (itemsEl) itemsEl.style.display = isNowExpanded ? '' : 'none';
    });
  });
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => { window.toggleTheme(); });
  }
  // NOTE: attachTableFilterListeners() REMOVED — all filters use window.setXxxFilter() inline handlers
}

// ================================================================
// GLOBAL SEARCH
// ================================================================
const searchDataset = [
  { label: 'AHU-001 (Air Handling Unit)', category: 'Equipment', route: 'equipment-list' },
  { label: 'CHP-001 (Chiller Pump)',       category: 'Equipment', route: 'equipment-list' },
  { label: 'PMP-101 (Main Charge Pump)',   category: 'Equipment', route: 'equipment-list' },
  { label: 'Pump Alignment (PMP-101)',     category: 'Activity',  route: 'daily-activity' },
  { label: 'Stroke Test (VLV-205)',        category: 'Activity',  route: 'daily-activity' },
  { label: 'Hydrotest (HX-301)',           category: 'Activity',  route: 'daily-activity' },
  { label: 'CxL3 Functional Test Procedure', category: 'Document', route: 'documents' },
  { label: 'FAT Report',                  category: 'Document',  route: 'documents' },
  { label: 'Weekly Progress Report',      category: 'Report',    route: 'weekly-report' },
  { label: 'User Management & Roles',     category: 'Admin',     route: 'user-management' },
  { label: 'Building A',                  category: 'Building',  route: 'room-building' },
  { label: 'Building B',                  category: 'Building',  route: 'room-building' },
  { label: 'CxL Phase Gate',              category: 'CxL',       route: 'cxl' }
];

window.handleGlobalSearch = function(query) {
  const dropdown = document.getElementById('search-results-dropdown');
  if (!dropdown) return;
  const q = query.trim().toLowerCase();
  if (!q) { dropdown.style.display = 'none'; return; }
  const s = window.appState;
  // Live equipment search
  const eqMatches = (s.equipment || [])
    .filter(e => e.id.toLowerCase().includes(q) || (e.name || '').toLowerCase().includes(q) || (e.type || '').toLowerCase().includes(q))
    .slice(0, 3)
    .map(e => ({ label: `${e.id} \u2014 ${e.name}`, category: 'Equipment', route: 'equipment-list' }));
  // Live building search
  const bldgMatches = (s.buildings || [])
    .filter(b => b.name.toLowerCase().includes(q) || (b.code || '').toLowerCase().includes(q))
    .slice(0, 2)
    .map(b => ({ label: `${b.name} (${b.code})`, category: 'Building', route: 'room-building' }));
  // Live activity search
  const actMatches = (s.activities || [])
    .filter(a => (a.act || '').toLowerCase().includes(q) || (a.eq || '').toLowerCase().includes(q))
    .slice(0, 2)
    .map(a => ({ label: `${a.act} \u2014 ${a.eq}`, category: 'Activity', route: 'daily-activity' }));
  // Live document search
  const docMatches = (s.documents || [])
    .filter(d => (d.name || '').toLowerCase().includes(q) || (d.equipment || '').toLowerCase().includes(q))
    .slice(0, 2)
    .map(d => ({ label: d.name, category: 'Document', route: 'documents' }));
  // Live user search
  const userMatches = (s.users || [])
    .filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.role || '').toLowerCase().includes(q))
    .slice(0, 1)
    .map(u => ({ label: `${u.name} (${u.role})`, category: 'User', route: 'user-management' }));
  const liveMatches = [...eqMatches, ...bldgMatches, ...actMatches, ...docMatches, ...userMatches];
  const seenLabels = new Set(liveMatches.map(m => m.label));
  const staticMatches = searchDataset.filter(item =>
    (item.label.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)) && !seenLabels.has(item.label)
  );
  const allMatches = [...liveMatches, ...staticMatches].slice(0, 10);
  if (allMatches.length === 0) {
    dropdown.innerHTML = `<div style="padding:0.75rem 1rem;font-size:0.8rem;color:var(--text-muted);">No results found for "${query}"</div>`;
  } else {
    dropdown.innerHTML = allMatches.map(m => `
      <div class="search-result-item" onclick="window.navigateTo('${m.route}');document.getElementById('search-results-dropdown').style.display='none';" style="padding:0.6rem 1rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border-card);font-size:0.8rem;">
        <span style="font-weight:600;color:var(--text-main);">${window.escapeHtml(m.label)}</span>
        <span class="status-badge badge-blue" style="font-size:0.65rem;">${window.escapeHtml(m.category)}</span>
      </div>`).join('');
  }
  dropdown.style.display = 'block';
};

document.addEventListener('click', e => {
  const searchWrap = document.querySelector('.header-search');
  const dropdown = document.getElementById('search-results-dropdown');
  if (searchWrap && dropdown && !searchWrap.contains(e.target)) dropdown.style.display = 'none';
});

// Initial Render
document.addEventListener('DOMContentLoaded', () => { renderApp(); });
