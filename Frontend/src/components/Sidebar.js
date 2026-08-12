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
      { id: 'documents', label: 'Documents', icon: 'file-text' },
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
    const hasActiveChild = section.items.some(item => item.id === activeRoute);
    if (hasActiveChild) {
      expandedSections.add(section.id);
    }
  });

  return `
    <aside class="app-sidebar">
      <div class="sidebar-brand">
        <img src="/logo.png" alt="Logo" style="width: 32px; height: 32px; object-fit: contain; flex-shrink: 0;" />
        <div style="display:flex;flex-direction:column;justify-content:center;overflow:hidden;">
          <span class="brand-gant-text">GANT</span>
          <div class="brand-sub" style="white-space: nowrap; font-size: 0.6rem;">Project &amp; Commissioning Tracker</div>
        </div>
      </div>
      
      <div class="sidebar-menu">
        <!-- Dashboard Button -->
        <a class="menu-item ${activeRoute === 'dashboard' ? 'active-btn' : ''}" data-route="dashboard">
          <i data-lucide="layout-dashboard" class="menu-icon"></i>
          <span>Dashboard</span>
        </a>

        <!-- Collapsible Menu Sections -->
        ${menuSections.map(section => {
    const isExpanded = expandedSections.has(section.id);
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
                ${section.items.map(item => `
                  <a class="menu-item ${activeRoute === item.id ? 'active' : ''}" data-route="${item.id}">
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
