/**
 * GANT FRONTEND MOCK DATA
 * Centralized Single Source of Truth for GANT Demo
 */

export const projectIdentity = {
  name: "GANT",
  fullName: "GANT — Project Progress, Activity & Commissioning System",
  client: "PT. Global Adimitra Nusaabadi",
  startDate: "01 Aug 2026",
  endDate: "31 Mar 2027"
};

export const dashboardHeaderInfo = {
  title: "Dashboard",
  dateRange: "Reporting Week: 03–08 Aug 2026",
  currentWeek: "Reporting Week: 03–08 Aug 2026",
  user: {
    name: "Admin",
    role: "Project Manager"
  }
};

export const topMetricCards = {
  overallProgress: {
    percentage: 58,
    plannedPct: 65,
    variancePct: -7
  },
  currentPhase: {
    phase: "CxL3",
    status: "In Progress"
  },
  projectDuration: {
    currentDay: 132,
    totalDays: 247,
    startDate: "01 Aug 2026",
    endDate: "31 Mar 2027"
  },
  equipmentSummary: {
    total: 333,
    breakdown: [
      { label: "Delivered", count: 280, color: "#2563eb" },
      { label: "CxL2", count: 250, color: "#10b981" },
      { label: "CxL3", count: 180, color: "#f59e0b" },
      { label: "CxL4", count: 120, color: "#8b5cf6" },
      { label: "CxL5", count: 65, color: "#ef4444" }
    ]
  },
  documentsNeedAction: {
    total: 16,
    breakdown: [
      { label: "Rejected", count: 8, color: "#ef4444" },
      { label: "Revise & Resubmit", count: 4, color: "#f59e0b" },
      { label: "Under Review", count: 4, color: "#2563eb" }
    ]
  },
  nasStorage: {
    serverName: "NAS-Project01",
    ip: "192.168.1.100",
    status: "Connected",
    usedTB: "8.12 TB",
    totalTB: "16 TB",
    percentage: 51,
    raidStatus: "RAID 5 • Healthy"
  }
};

export const activitiesThisWeek = {
  summary: {
    total: 36,
    completed: { count: 20, pct: 56 },
    inProgress: { count: 10, pct: 28 },
    notStarted: { count: 6, pct: 16 }
  },
  upcomingActivities: [
    { date: "10 Aug", name: "GC Transfer Pump", phase: "CxL3", phaseColor: "#f59e0b" },
    { date: "10 Aug", name: "Water Leak Detection", phase: "CxL3", phaseColor: "#f59e0b" },
    { date: "11 Aug", name: "Flushing Chilled Water Pipe", phase: "CxL4", phaseColor: "#8b5cf6" },
    { date: "11 Aug", name: "Pressurization Skid", phase: "CxL3", phaseColor: "#f59e0b" },
    { date: "11 Aug", name: "Liquid Penetrant Test", phase: "CxL2", phaseColor: "#10b981" }
  ],
  issuesAndRisks: [
    { count: 8, label: "Documents Rejected", color: "#ef4444" },
    { count: 4, label: "Room Readiness Not Updated", color: "#f59e0b" },
    { count: 3, label: "Pending Certificates & Test", color: "#eab308" },
    { count: 2, label: "Material Delivery Delay", color: "#2563eb" }
  ]
};

export const weeklyProgressTrend = {
  weeks: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10"],
  planned: [15, 28, 42, 55, 65, 75, 84, 90, 95, 100],
  actual: [12, 22, 35, 48, 58, 68, 76, 82, 88, 92],
  callout: {
    week: "Week 5",
    planned: "65%",
    actual: "58%",
    variance: "-7%"
  }
};

export const weeklyActivitySummary = {
  topSummary: {
    planned: 20,
    completed: { count: 12, pct: 60 },
    inProgress: { count: 5, pct: 25 },
    notStarted: { count: 3, pct: 15 },
    weeklyProgressPct: 60
  },
  tableRows: [
    { phase: "CxL2", planned: 8, completed: 5, inProgress: 2, notStarted: 1, progressPct: 62 },
    { phase: "CxL3", planned: 6, completed: 4, inProgress: 1, notStarted: 1, progressPct: 67 },
    { phase: "CxL4", planned: 4, completed: 2, inProgress: 1, notStarted: 1, progressPct: 50 },
    { phase: "CxL5", planned: 2, completed: 1, inProgress: 1, notStarted: 0, progressPct: 50 },
    { phase: "Total", planned: 20, completed: 12, inProgress: 5, notStarted: 3, progressPct: 60, isTotal: true }
  ]
};

export const projectTimelineOverview = {
  months: [
    { name: "Aug 2026", ticks: ["1", "11", "21"] },
    { name: "Sep 2026", ticks: ["1", "11", "21"] },
    { name: "Oct 2026", ticks: ["1", "11", "21"] },
    { name: "Nov 2026", ticks: ["1", "11", "21"] },
    { name: "Dec 2026", ticks: ["1", "11", "21"] },
    { name: "Jan 2027", ticks: ["1", "11", "21"] },
    { name: "Mar 2027", ticks: ["1", "11", "21"] }
  ],
  equipments: [
    {
      id: "AHU-001",
      name: "AHU-001",
      type: "AHU - Type A",
      phases: [
        { type: "Delivery", startCol: 0.1, durationCols: 0.2 },
        { type: "CxL2", startCol: 0.3, durationCols: 1.2 },
        { type: "CxL3", startCol: 1.2, durationCols: 1.5 },
        { type: "CxL4", startCol: 2.2, durationCols: 1.8 },
        { type: "CxL5", startCol: 3.8, durationCols: 1.5 }
      ]
    },
    {
      id: "CHP-001",
      name: "CHP-001",
      type: "Chiller Pump",
      phases: [
        { type: "Delivery", startCol: 0.1, durationCols: 0.2 },
        { type: "CxL2", startCol: 0.3, durationCols: 1.5 },
        { type: "CxL3", startCol: 1.5, durationCols: 1.6 },
        { type: "CxL4", startCol: 2.6, durationCols: 1.7 },
        { type: "CxL5", startCol: 4.1, durationCols: 1.4 }
      ]
    },
    {
      id: "FCU-001",
      name: "FCU-001",
      type: "FCU - Type B",
      phases: [
        { type: "Delivery", startCol: 0.1, durationCols: 0.2 },
        { type: "CxL2", startCol: 0.3, durationCols: 1.4 },
        { type: "CxL3", startCol: 1.4, durationCols: 1.6 },
        { type: "CxL4", startCol: 2.5, durationCols: 1.8 },
        { type: "CxL5", startCol: 4.0, durationCols: 1.5 }
      ]
    }
  ]
};

export const timelineDetailAhu001 = {
  header: {
    eqId: "AHU-001",
    name: "Air Handling Unit 001",
    location: "Building A - Mechanical Room 101",
    overallProgress: 65,
    activePhase: "CxL3 Startup",
    durationDays: 120,
    startDate: "15 Aug 2026",
    endDate: "15 Dec 2026"
  },
  rows: [
    { phase: "Delivery", dates: "15 Aug - 01 Sep", duration: "17 Days", status: "Completed", progressPct: 100, barColor: "#2563eb" },
    { phase: "CxL2 Pre-Cx", dates: "05 Sep - 20 Sep", duration: "15 Days", status: "Completed", progressPct: 100, barColor: "#10b981" },
    { phase: "CxL3 Startup", dates: "01 Oct - 25 Oct", duration: "24 Days", status: "In Progress", progressPct: 65, barColor: "#f97316" },
    { phase: "CxL4 Functional", dates: "01 Nov - 15 Nov", duration: "14 Days", status: "Planned", progressPct: 0, barColor: "#8b5cf6" },
    { phase: "CxL5 Integrated", dates: "01 Dec - 20 Dec", duration: "19 Days", status: "Planned", progressPct: 0, barColor: "#ef4444" }
  ],
  durationSummaries: [
    { label: "Planned Duration", value: "120 Days", color: "var(--text-main)" },
    { label: "Active Phase", value: "CxL3 Startup", color: "#f97316" },
    { label: "Overall Progress", value: "58%", color: "#10b981" },
    { label: "Schedule Variance", value: "-7%", color: "#ef4444" }
  ]
};

export const masterEquipmentList = [
  { id: 'AHU-001', name: 'AHU-001', type: 'Air Handling Unit', building: 'Building A', room: 'Mech 102', phase: 'CxL3 Startup', status: 'Active', updated: '2026-08-10' },
  { id: 'CHP-001', name: 'CHP-001', type: 'Chiller Pump', building: 'Building A', room: 'Plant 101', phase: 'CxL3 Startup', status: 'Active', updated: '2026-08-11' },
  { id: 'FCU-001', name: 'FCU-001', type: 'Fan Coil Unit', building: 'Building B', room: 'Room 201', phase: 'CxL2 Pre-Cx', status: 'Active', updated: '2026-08-09' },
  { id: 'PAU-001', name: 'PAU-001', type: 'Primary Air Unit', building: 'Building B', room: 'Mech 202', phase: 'CxL3 Startup', status: 'Active', updated: '2026-08-10' },
  { id: 'VRF-001', name: 'VRF-001', type: 'VRF System', building: 'Building C', room: 'Roof 301', phase: 'CxL4 Functional', status: 'Pending', updated: '2026-08-11' },
  { id: 'PMP-101', name: 'PMP-101', type: 'Water Pump', building: 'Building C', room: 'Pump Room 1', phase: 'Delivery', status: 'Active', updated: '2026-08-08' }
];

export const commissioningPhases = [
  {
    id: "cxl1",
    name: "CxL1",
    fullName: "CxL1 — Pre-Design & Factory Acceptance",
    status: "Completed",
    statusColor: "#10b981",
    description: "Factory acceptance testing, pre-design submittals, and factory verification.",
    equipmentCount: 333,
    requirementsCount: { completed: 8, total: 8 },
    blockers: 0
  },
  {
    id: "cxl2",
    name: "CxL2",
    fullName: "CxL2 — Pre-Commissioning",
    status: "Completed",
    statusColor: "#10b981",
    description: "Pre-commissioning static checks, hydrostatic tests, and megger insulation tests.",
    equipmentCount: 250,
    requirementsCount: { completed: 6, total: 6 },
    blockers: 0
  },
  {
    id: "cxl3",
    name: "CxL3",
    fullName: "CxL3 — Startup (Active)",
    status: "In Progress",
    statusColor: "#f97316",
    description: "Vendor startup, initial energization, rotation verification, and dynamic testing.",
    equipmentCount: 180,
    requirementsCount: { completed: 3, total: 5 },
    blockers: 4
  },
  {
    id: "cxl4",
    name: "CxL4",
    fullName: "CxL4 — Functional Testing",
    status: "Not Started",
    statusColor: "#8b5cf6",
    description: "Full functional performance testing, safety interlocks, and BAS automation integration.",
    equipmentCount: 120,
    requirementsCount: { completed: 0, total: 6 },
    blockers: 0
  },
  {
    id: "cxl5",
    name: "CxL5",
    fullName: "CxL5 — Integrated Testing & Handover",
    status: "Not Started",
    statusColor: "#ef4444",
    description: "Integrated systems testing, black-out test, O&M training, and client handover.",
    equipmentCount: 65,
    requirementsCount: { completed: 0, total: 5 },
    blockers: 0
  }
];

