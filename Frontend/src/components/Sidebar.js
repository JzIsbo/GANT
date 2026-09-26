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
      { id: 'documents', label: 'All Documents', icon: 'folder-open' },
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
let expandedProjectFolders = new Set(['PRJ-01', 'PRJ-02']);
let expandedDocProjectFolders = new Set(['PRJ-01', 'PRJ-02']);
window.expandedProjectFolders = expandedProjectFolders;
window.expandedDocProjectFolders = expandedDocProjectFolders;

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

export function toggleProjectFolder(projectId) {
  if (!expandedProjectFolders) {
    expandedProjectFolders = new Set([window.appState?.selectedProjectId || 'PRJ-01']);
    window.expandedProjectFolders = expandedProjectFolders;
  }
  if (expandedProjectFolders.has(projectId)) {
    expandedProjectFolders.delete(projectId);
  } else {
    expandedProjectFolders.add(projectId);
  }
  if (typeof window.renderApp === 'function') {
    window.renderApp();
  }
}
window.toggleProjectFolder = toggleProjectFolder;

export function toggleDocProjectFolder(projectId) {
  if (!expandedDocProjectFolders) {
    expandedDocProjectFolders = new Set([window.appState?.selectedProjectId || 'PRJ-01']);
    window.expandedDocProjectFolders = expandedDocProjectFolders;
  }
  if (expandedDocProjectFolders.has(projectId)) {
    expandedDocProjectFolders.delete(projectId);
  } else {
    expandedDocProjectFolders.add(projectId);
  }
  if (typeof window.renderApp === 'function') {
    window.renderApp();
  }
}
window.toggleDocProjectFolder = toggleDocProjectFolder;

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
        <div class="sidebar-project-selector" style="padding: 0.45rem 0.65rem; margin: 0.35rem 0.75rem 0.5rem; background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 8px; display: flex; align-items: center; justify-content: space-between; gap: 0.3rem;">
          <div style="display:flex;align-items:center;gap:0.4rem;overflow:hidden;flex:1;">
            <i data-lucide="briefcase" style="width:14px;height:14px;color:var(--brand-blue);flex-shrink:0;"></i>
            <select class="project-select-input" onchange="window.switchProject(this.value)" style="background:transparent;border:none;color:var(--text-main);font-size:0.74rem;font-weight:700;outline:none;cursor:pointer;width:100%;text-overflow:ellipsis;" title="Pilih Project Aktif">
              ${(window.appState?.projects || [
                { id: 'PRJ-01', name: 'Project 1 — HVAC & Plant' },
                { id: 'PRJ-02', name: 'Project 2 — Data Center' }
              ]).map(p => `
                <option value="${p.id}" ${window.appState?.selectedProjectId === p.id ? 'selected' : ''}>${window.escapeHtml(p.name)}</option>
              `).join('')}
            </select>
          </div>
          <button type="button" class="btn-edit-project-icon" onclick="window._openEditProjectModal(window.appState.selectedProjectId)" title="Edit Project Aktif" style="background:var(--bg-card-secondary);color:var(--text-main);border:1px solid var(--border-card);border-radius:6px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
            <i data-lucide="edit-2" style="width:12px;height:12px;"></i>
          </button>
          <button type="button" class="btn-add-project-icon" onclick="window._openAddProjectModal()" title="Tambah Project Baru" style="background:rgba(37,99,235,0.12);color:var(--brand-blue);border:1px solid rgba(37,99,235,0.25);border-radius:6px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
            <i data-lucide="plus" style="width:13px;height:13px;"></i>
          </button>
        </div>

        <!-- Collapsible Menu Sections -->
        ${menuSections.map(section => {
          const isExpanded = expandedSections.has(section.id);
          const isMasterData = section.id === 'master-data';
          const isDocManagement = section.id === 'document-management';
          const isMultiProjectSection = ['activity-management', 'project-timeline'].includes(section.id);
          const activePrj = (window.appState?.projects || []).find(p => p.id === window.appState?.selectedProjectId);
          const currentProjectName = activePrj ? activePrj.name : 'Project 1 — HVAC & Plant Baseline';

          if (isMasterData) {
            const projects = window.appState?.projects || [
              { id: 'PRJ-01', code: 'PRJ-01', name: 'Project 1 — HVAC & Plant Baseline', status: 'Active' },
              { id: 'PRJ-02', code: 'PRJ-02', name: 'Project 2 — Data Center Substation', status: 'Active' }
            ];
            const selectedPrjId = window.appState?.selectedProjectId || 'PRJ-01';
            
            // Auto expand current project folder
            if (!expandedProjectFolders || expandedProjectFolders.size === 0) {
              expandedProjectFolders.add(selectedPrjId);
            }
            if (['equipment-list', 'room-building', 'user-management'].includes(activeRoute)) {
              expandedProjectFolders.add(selectedPrjId);
            }

            return `
              <div class="menu-section ${isExpanded ? 'expanded' : 'collapsed'}" id="menu-section-master-data">
                <div class="menu-category" data-section="${section.id}">
                  <div class="menu-category-left">
                    <i data-lucide="${section.icon}" class="menu-category-icon"></i>
                    <span>${section.title}</span>
                  </div>
                  <i data-lucide="chevron-down" class="menu-chevron"></i>
                </div>
                <div class="menu-section-items master-data-sidebar-tree" ${!isExpanded ? 'style="display: none;"' : ''}>
                  
                  <!-- Top bar: Project Sub-bab Label & Quick Add Project -->
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:0.4rem 0.85rem 0.35rem 1.6rem;border-bottom:1px solid var(--border-card);margin-bottom:0.35rem;">
                    <span style="font-size:0.65rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;">Daftar Project</span>
                    <button type="button" onclick="event.stopPropagation(); window._openAddProjectModal();" title="Tambah Project Baru" style="background:rgba(37,99,235,0.12);color:var(--brand-blue);border:1px solid rgba(37,99,235,0.25);border-radius:4px;padding:0.15rem 0.45rem;font-size:0.68rem;font-weight:700;display:flex;align-items:center;gap:0.25rem;cursor:pointer;">
                      <i data-lucide="plus" style="width:11px;height:11px;"></i> Project
                    </button>
                  </div>

                  <!-- Project Folders List -->
                  ${projects.map(p => {
                    const isFolderOpen = expandedProjectFolders.has(p.id);
                    const isPrjActive = selectedPrjId === p.id;
                    
                    const statusColors = {
                      'Completed': { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', border: '#22c55e' },
                      'Active':    { bg: 'rgba(37,99,235,0.15)', text: '#2563eb', border: '#2563eb' },
                      'Planning':  { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: '#f59e0b' }
                    };
                    const badgeStyle = statusColors[p.status] || statusColors['Active'];

                    return `
                      <div class="sidebar-project-folder ${isFolderOpen ? 'open' : 'closed'} ${isPrjActive ? 'active-project' : ''}" style="margin-bottom:0.35rem;">
                        
                        <!-- Folder Header (Click to expand/collapse project) -->
                        <div class="project-folder-row" onclick="window.toggleProjectFolder('${p.id}')" title="Klik untuk membuka sub-bab ${window.escapeHtml(p.name)}" style="display:flex;align-items:center;justify-content:space-between;padding:0.35rem 0.65rem 0.35rem 1.4rem;cursor:pointer;border-radius:6px;transition:background 0.15s ease;${isPrjActive ? 'background:rgba(37,99,235,0.08);border-left:3px solid var(--brand-blue);' : ''}">
                          <div style="display:flex;align-items:center;gap:0.35rem;overflow:hidden;flex:1;">
                            <i data-lucide="${isFolderOpen ? 'chevron-down' : 'chevron-right'}" style="width:12px;height:12px;color:var(--text-muted);flex-shrink:0;"></i>
                            <i data-lucide="folder" style="width:13px;height:13px;color:${isPrjActive ? 'var(--brand-blue)' : 'var(--text-secondary)'};flex-shrink:0;"></i>
                            <span style="font-size:0.73rem;font-weight:${isPrjActive ? '800' : '600'};color:${isPrjActive ? 'var(--brand-blue)' : 'var(--text-main)'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                              ${window.escapeHtml(p.name)}
                            </span>
                          </div>
                          
                          <div style="display:flex;align-items:center;gap:0.25rem;flex-shrink:0;">
                            <span style="font-size:0.62rem;font-weight:700;padding:0.1rem 0.35rem;border-radius:10px;background:${badgeStyle.bg};color:${badgeStyle.text};border:1px solid ${badgeStyle.border};">
                              ${p.status || 'Active'}
                            </span>
                            <button type="button" onclick="event.stopPropagation(); window._openEditProjectModal('${p.id}')" title="Edit Project" style="background:transparent;border:none;color:var(--text-muted);cursor:pointer;padding:2px;display:flex;align-items:center;">
                              <i data-lucide="edit-2" style="width:11px;height:11px;"></i>
                            </button>
                            ${projects.length > 1 ? `
                              <button type="button" onclick="event.stopPropagation(); window._confirmDeleteProject('${p.id}')" title="Hapus Project" style="background:transparent;border:none;color:var(--text-muted);cursor:pointer;padding:2px;display:flex;align-items:center;">
                                <i data-lucide="trash-2" style="width:11px;height:11px;"></i>
                              </button>
                            ` : ''}
                          </div>
                        </div>

                        <!-- Sub-bab / Submenus (a, b, c) -->
                        <div class="project-folder-submenus" ${!isFolderOpen ? 'style="display: none;"' : ''} style="padding-left:0.5rem;">
                          
                          <!-- (a) Equipment List -->
                          <a class="menu-item sub-menu-item ${activeRoute === 'equipment-list' && isPrjActive ? 'active' : ''}" data-route="equipment-list" data-project-id="${p.id}" onclick="window.switchProjectFolder('${p.id}', 'equipment-list')" style="padding-left:2.2rem;font-size:0.73rem;">
                            <i data-lucide="cpu" class="menu-icon" style="width:13px;height:13px;"></i>
                            <span>(a) Equipment List</span>
                          </a>

                          <!-- (b) Building - Floor - Room -->
                          <a class="menu-item sub-menu-item ${activeRoute === 'room-building' && isPrjActive ? 'active' : ''}" data-route="room-building" data-project-id="${p.id}" onclick="window.switchProjectFolder('${p.id}', 'room-building')" style="padding-left:2.2rem;font-size:0.73rem;">
                            <i data-lucide="building-2" class="menu-icon" style="width:13px;height:13px;"></i>
                            <span>(b) Building - Floor - Room</span>
                          </a>

                          <!-- (c) User Management -->
                          <a class="menu-item sub-menu-item ${activeRoute === 'user-management' && isPrjActive ? 'active' : ''}" data-route="user-management" data-project-id="${p.id}" onclick="window.switchProjectFolder('${p.id}', 'user-management')" style="padding-left:2.2rem;font-size:0.73rem;">
                            <i data-lucide="users" class="menu-icon" style="width:13px;height:13px;"></i>
                            <span>(c) User Management</span>
                          </a>

                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }

          if (isDocManagement) {
            const projects = window.appState?.projects || [
              { id: 'PRJ-01', code: 'PRJ-01', name: 'Project 1 — HVAC & Plant Baseline', status: 'Active' },
              { id: 'PRJ-02', code: 'PRJ-02', name: 'Project 2 — Data Center Substation', status: 'Active' }
            ];
            const selectedPrjId = window.appState?.selectedProjectId || 'PRJ-01';
            
            // Auto expand current project folder
            if (!expandedDocProjectFolders || expandedDocProjectFolders.size === 0) {
              expandedDocProjectFolders.add(selectedPrjId);
            }
            if (['documents', 'documents-report', 'documents-timesheet', 'documents-calibration', 'import-documents'].includes(activeRoute)) {
              expandedDocProjectFolders.add(selectedPrjId);
            }

            return `
              <div class="menu-section ${isExpanded ? 'expanded' : 'collapsed'}" id="menu-section-document-management">
                <div class="menu-category" data-section="${section.id}">
                  <div class="menu-category-left">
                    <i data-lucide="${section.icon}" class="menu-category-icon"></i>
                    <span>${section.title}</span>
                  </div>
                  <i data-lucide="chevron-down" class="menu-chevron"></i>
                </div>
                <div class="menu-section-items document-management-sidebar-tree" ${!isExpanded ? 'style="display: none;"' : ''}>
                  
                  <!-- Top bar: Sub-bab Folder Header & Quick Upload Action -->
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:0.4rem 0.85rem 0.35rem 1.6rem;border-bottom:1px solid var(--border-card);margin-bottom:0.35rem;">
                    <span style="font-size:0.65rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;">Daftar Project Docs</span>
                    <button type="button" onclick="event.stopPropagation(); window._openUploadDocModal();" title="Upload Dokumen Baru" style="background:rgba(37,99,235,0.12);color:var(--brand-blue);border:1px solid rgba(37,99,235,0.25);border-radius:4px;padding:0.15rem 0.45rem;font-size:0.68rem;font-weight:700;display:flex;align-items:center;gap:0.25rem;cursor:pointer;">
                      <i data-lucide="plus" style="width:11px;height:11px;"></i> Upload
                    </button>
                  </div>

                  <!-- Project Folders List -->
                  ${projects.map(p => {
                    const isFolderOpen = expandedDocProjectFolders.has(p.id);
                    const isPrjActive = selectedPrjId === p.id;
                    
                    const statusColors = {
                      'Completed': { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', border: '#22c55e' },
                      'Active':    { bg: 'rgba(37,99,235,0.15)', text: '#2563eb', border: '#2563eb' },
                      'Planning':  { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: '#f59e0b' }
                    };
                    const badgeStyle = statusColors[p.status] || statusColors['Active'];

                    return `
                      <div class="sidebar-project-folder ${isFolderOpen ? 'open' : 'closed'} ${isPrjActive ? 'active-project' : ''}" style="margin-bottom:0.35rem;">
                        
                        <!-- Folder Header (Click to expand/collapse project documents folder) -->
                        <div class="project-folder-row" onclick="window.toggleDocProjectFolder('${p.id}')" title="Klik untuk membuka sub-bab dokumen ${window.escapeHtml(p.name)}" style="display:flex;align-items:center;justify-content:space-between;padding:0.35rem 0.65rem 0.35rem 1.4rem;cursor:pointer;border-radius:6px;transition:background 0.15s ease;${isPrjActive ? 'background:rgba(37,99,235,0.08);border-left:3px solid var(--brand-blue);' : ''}">
                          <div style="display:flex;align-items:center;gap:0.35rem;overflow:hidden;flex:1;">
                            <i data-lucide="${isFolderOpen ? 'chevron-down' : 'chevron-right'}" style="width:12px;height:12px;color:var(--text-muted);flex-shrink:0;"></i>
                            <i data-lucide="folder" style="width:13px;height:13px;color:${isPrjActive ? 'var(--brand-blue)' : 'var(--text-secondary)'};flex-shrink:0;"></i>
                            <span style="font-size:0.73rem;font-weight:${isPrjActive ? '800' : '600'};color:${isPrjActive ? 'var(--brand-blue)' : 'var(--text-main)'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                              ${window.escapeHtml(p.name)}
                            </span>
                          </div>
                          
                          <div style="display:flex;align-items:center;gap:0.25rem;flex-shrink:0;">
                            <span style="font-size:0.62rem;font-weight:700;padding:0.1rem 0.35rem;border-radius:10px;background:${badgeStyle.bg};color:${badgeStyle.text};border:1px solid ${badgeStyle.border};">
                              ${p.status || 'Active'}
                            </span>
                            <button type="button" onclick="event.stopPropagation(); window._exportProjectDocuments('${p.id}')" title="Export Dokumen Project CSV" style="background:transparent;border:none;color:var(--text-muted);cursor:pointer;padding:2px;display:flex;align-items:center;">
                              <i data-lucide="download" style="width:11px;height:11px;"></i>
                            </button>
                          </div>
                        </div>

                        <!-- Sub-bab / Submenus (a, b, c, d) -->
                        <div class="project-folder-submenus" ${!isFolderOpen ? 'style="display: none;"' : ''} style="padding-left:0.5rem;">
                          
                          <!-- (a) Report -->
                          <a class="menu-item sub-menu-item ${activeRoute === 'documents-report' && isPrjActive ? 'active' : ''}" data-route="documents-report" data-project-id="${p.id}" onclick="window.switchProjectFolder('${p.id}', 'documents-report')" style="padding-left:2.2rem;font-size:0.73rem;">
                            <i data-lucide="file-bar-chart" class="menu-icon" style="width:13px;height:13px;"></i>
                            <span>(a) Report</span>
                          </a>

                          <!-- (b) Timesheet -->
                          <a class="menu-item sub-menu-item ${activeRoute === 'documents-timesheet' && isPrjActive ? 'active' : ''}" data-route="documents-timesheet" data-project-id="${p.id}" onclick="window.switchProjectFolder('${p.id}', 'documents-timesheet')" style="padding-left:2.2rem;font-size:0.73rem;">
                            <i data-lucide="clock" class="menu-icon" style="width:13px;height:13px;"></i>
                            <span>(b) Timesheet</span>
                          </a>

                          <!-- (c) Equipment Tools Calibration -->
                          <a class="menu-item sub-menu-item ${activeRoute === 'documents-calibration' && isPrjActive ? 'active' : ''}" data-route="documents-calibration" data-project-id="${p.id}" onclick="window.switchProjectFolder('${p.id}', 'documents-calibration')" style="padding-left:2.2rem;font-size:0.73rem;">
                            <i data-lucide="award" class="menu-icon" style="width:13px;height:13px;"></i>
                            <span>(c) Equipment Tools Calibration</span>
                          </a>

                          <!-- (d) Import Documents -->
                          <a class="menu-item sub-menu-item ${activeRoute === 'import-documents' && isPrjActive ? 'active' : ''}" data-route="import-documents" data-project-id="${p.id}" onclick="window.switchProjectFolder('${p.id}', 'import-documents')" style="padding-left:2.2rem;font-size:0.73rem;">
                            <i data-lucide="file-up" class="menu-icon" style="width:13px;height:13px;"></i>
                            <span>(d) Import Documents</span>
                          </a>

                        </div>
                      </div>
                    `;
                  }).join('')}

                  <!-- Common / Global Storage Links -->
                  <div style="border-top:1px solid var(--border-card);margin-top:0.35rem;padding-top:0.35rem;">
                    <a class="menu-item sub-menu-item ${activeRoute === 'documents' ? 'active' : ''}" data-route="documents" style="padding-left:1.6rem;font-size:0.73rem;">
                      <i data-lucide="folder-open" class="menu-icon" style="width:13px;height:13px;"></i>
                      <span>All Documents Repository</span>
                    </a>
                    <a class="menu-item sub-menu-item ${activeRoute === 'nas-files' ? 'active' : ''}" data-route="nas-files" style="padding-left:1.6rem;font-size:0.73rem;">
                      <i data-lucide="server" class="menu-icon" style="width:13px;height:13px;"></i>
                      <span>NAS File Manager</span>
                    </a>
                    <a class="menu-item sub-menu-item ${activeRoute === 'shared-files' ? 'active' : ''}" data-route="shared-files" style="padding-left:1.6rem;font-size:0.73rem;">
                      <i data-lucide="share-2" class="menu-icon" style="width:13px;height:13px;"></i>
                      <span>Shared Files</span>
                    </a>
                  </div>

                </div>
              </div>
            `;
          }

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
