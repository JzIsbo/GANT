/**
 * Sidebar Component - Collapsible Menu Sections
 */

const menuSections = [
  {
    id: 'activity-management',
    title: 'Activity Management',
    icon: 'clipboard-list',
    items: [
      { id: 'daily-activity', label: 'Daily Activity', icon: 'calendar' },
      { id: 'weekly-activity', label: 'Weekly Activity', icon: 'calendar-range' },
      { id: 'activity-progress', label: 'Activity Progress', icon: 'trending-up' },
      { id: 'activity-status', label: 'Activity Status', icon: 'check-circle-2' },
      { id: 'activity-history', label: 'Activity History', icon: 'history' }
    ]
  },
  {
    id: 'project-timeline',
    title: 'Project Timeline',
    icon: 'gantt-chart-square',
    items: [
      { id: 'gantt', label: 'Timeline Overview', icon: 'gantt-chart-square' },
      { id: 'equipment-timeline', label: 'Equipment Timeline', icon: 'hard-drive' },
      { id: 'phase-progress', label: 'Phase Progress', icon: 'workflow' },
      { id: 'duration-analysis', label: 'Duration Analysis', icon: 'clock' }
    ]
  },
  {
    id: 'master-data',
    title: 'Master Data',
    icon: 'database',
    items: [
      { id: 'equipment-list', label: 'Equipment List', icon: 'cpu' },
      { id: 'room-building', label: 'Room / Building', icon: 'building-2' },
      { id: 'user-management', label: 'User Management', icon: 'users' }
    ]
  },
  {
    id: 'document-management',
    title: 'Document Management',
    icon: 'folder-open',
    items: [
      { id: 'documents-report', label: 'Report', icon: 'file-bar-chart' },
      { id: 'documents-timesheet', label: 'Timesheet', icon: 'clock' },
      { id: 'documents-calibration', label: 'Equipment Tools Calibration', icon: 'award' },
      { id: 'nas-files', label: 'NAS File Manager', icon: 'server' },
      { id: 'shared-files', label: 'Shared Files', icon: 'share-2' },
      { id: 'import-documents', label: 'Import Documents', icon: 'file-up' }
    ]
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: 'bar-chart-3',
    items: [
      { id: 'weekly-report', label: 'Weekly Report', icon: 'file-bar-chart' },
      { id: 'monthly-report', label: 'Monthly Report', icon: 'bar-chart-3' },
      { id: 'export-report', label: 'Export Report', icon: 'download' }
    ]
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'settings',
    items: [
      { id: 'project-settings', label: 'Project Settings', icon: 'settings' },
      { id: 'account-settings', label: 'Account Settings', icon: 'user-cog' }
    ]
  }
];

// Track which sections are manually expanded by user
let expandedSections = new Set();

export function toggleSection(sectionId) {
  if (expandedSections.has(sectionId)) {
    expandedSections.delete(sectionId);
  } else {
    expandedSections.add(sectionId);
  }
}

export function getExpandedSections() {
  return expandedSections;
}

export function renderSidebar(activeRoute = 'dashboard') {
  // Auto-expand the section that contains the active route
  menuSections.forEach(section => {
    const hasActiveChild = section.items.some(item => item.id === activeRoute || (activeRoute.startsWith('documents') && item.id.startsWith('documents')));
    if (hasActiveChild) {
      expandedSections.add(section.id);
    }
  });

  return `
    <aside class="app-sidebar">
      <div class="sidebar-brand">
        <img src="/logo.png" alt="Logo" style="width: 32px; height: 32px; object-fit: contain; flex-shrink: 0;" />
        <div style="display:flex;flex-direction:column;justify-content:center;overflow:hidden;">
          <span class="brand-gant-text">GAN</span>
          <div class="brand-sub" style="white-space: nowrap; font-size: 0.6rem;">Project &amp; Commissioning Tracker</div>
        </div>
      </div>
      
      <div class="sidebar-menu">
        <!-- Dashboard Button -->
        <a class="menu-item ${activeRoute === 'dashboard' ? 'active-btn' : ''}" data-route="dashboard">
          <i data-lucide="layout-dashboard" class="menu-icon"></i>
          <span>Dashboard</span>
        </a>

        <!-- Multi-Project Switcher Header -->
        <div class="sidebar-project-selector" style="padding: 0.5rem 0.75rem; margin: 0.35rem 0.75rem 0.5rem; background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 8px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display:flex;align-items:center;gap:0.45rem;overflow:hidden;width:100%;">
            <i data-lucide="briefcase" style="width:14px;height:14px;color:var(--brand-blue);flex-shrink:0;"></i>
            <select class="project-select-input" onchange="window.switchProject(this.value)" style="background:transparent;border:none;color:var(--text-main);font-size:0.74rem;font-weight:700;outline:none;cursor:pointer;width:100%;text-overflow:ellipsis;" title="Select Active Project">
              ${(window.appState?.projects || [
                { id: 'PRJ-01', name: 'Project 1 — HVAC & Plant' },
                { id: 'PRJ-02', name: 'Project 2 — Data Center' }
              ]).map(p => `
                <option value="${p.id}" ${window.appState?.selectedProjectId === p.id ? 'selected' : ''}>${window.escapeHtml(p.name)}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- Collapsible Menu Sections -->
        ${menuSections.map(section => {
          const isExpanded = expandedSections.has(section.id);
          const isMultiProjectSection = ['activity-management', 'project-timeline', 'master-data', 'document-management'].includes(section.id);
          const activePrj = (window.appState?.projects || []).find(p => p.id === window.appState?.selectedProjectId);
          const currentProjectName = activePrj ? activePrj.name : 'Project 1 — HVAC & Plant Baseline';

          return `
            <div class="menu-section ${isExpanded ? 'expanded' : 'collapsed'}">
              <div class="menu-category" data-section="${section.id}">
                <div class="menu-category-left">
                  <i data-lucide="${section.icon}" class="menu-category-icon"></i>
                  <span>${section.title}</span>
                </div>
                <i data-lucide="chevron-down" class="menu-chevron"></i>
              </div>
              <div class="menu-section-items" ${!isExpanded ? 'style="display: none;"' : ''}>
                ${isMultiProjectSection ? `
                  <div class="menu-project-subbab" style="padding: 0.35rem 0.85rem 0.25rem 2rem; font-size: 0.68rem; font-weight: 700; color: var(--brand-blue); text-transform: uppercase; letter-spacing: 0.04em; display: flex; align-items: center; gap: 0.35rem; opacity: 0.9;">
                    <i data-lucide="folder-git-2" style="width: 12px; height: 12px; flex-shrink: 0;"></i>
                    <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${currentProjectName}</span>
                  </div>
                ` : ''}
                ${section.items.map(item => `
                  <a class="menu-item ${isMultiProjectSection ? 'sub-menu-item' : ''} ${activeRoute === item.id ? 'active' : ''}" data-route="${item.id}">
                    <i data-lucide="${item.icon}" class="menu-icon"></i>
                    <span>${item.label}</span>
                  </a>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Footer -->
      <div class="sidebar-footer">
        <div class="nas-connected-card">
          <div class="nas-status-badge">
            <i data-lucide="check-circle-2" style="width: 12px; height: 12px;"></i>
            <span>NAS Storage — Demo</span>
          </div>
          <div class="nas-server-name">NAS-Project01 (Demo)</div>
          <div class="nas-ip">192.168.1.100</div>
          
          <div class="nas-usage-row">
            <span>Used</span>
            <span>8.12 TB / 16 TB (51%)</span>
          </div>
          <div class="nas-storage-bar">
            <div class="nas-storage-fill"></div>
          </div>

          <div class="nas-raid-status">
            <span class="nas-raid-dot"></span>
            <span>RAID 5 • Healthy (Simulated)</span>
          </div>
        </div>

        <div class="company-logo-footer">
          <img src="/logo.png" alt="Logo" style="width: 22px; height: 22px; object-fit: contain; flex-shrink: 0;" />
          <div style="display:flex;flex-direction:column;justify-content:center;overflow:hidden;">
            <img src="/gan_logo.png" alt="GAN" class="gan-logo-img" style="height: 14px; object-fit: contain; display: block; margin-bottom: 2px; align-self: flex-start;" />
            <div class="company-sub" style="white-space: nowrap; font-size: 0.58rem;">PT. Global Adimitra Nusaabadi</div>
          </div>
        </div>
      </div>
    </aside>
  `;
}
