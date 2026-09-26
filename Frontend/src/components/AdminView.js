import { projectIdentity } from '../mockData.js';

// ── Inline form field error helper ────────────────────────────────
function _showFormError(overlay, msg) {
  let errEl = overlay.querySelector('#form-error-msg');
  if (!errEl) {
    errEl = document.createElement('div');
    errEl.id = 'form-error-msg';
    errEl.style.cssText = 'color:#ef4444;font-size:0.8rem;font-weight:600;padding:0.5rem 0.75rem;background:rgba(239,68,68,0.1);border-radius:4px;border:1px solid rgba(239,68,68,0.3);margin-top:0.75rem;';
    overlay.querySelector('.modal-body')?.appendChild(errEl);
  }
  errEl.textContent = '⚠ ' + msg;
  errEl.style.display = 'block';
}

// ── Status badge helper ───────────────────────────────────────────
function _statusBadge(status) {
  const colors = {
    'Completed':   { bg: 'rgba(34,197,94,0.15)',  border: '#22c55e', text: '#22c55e'  },
    'Active':      { bg: 'rgba(37,99,235,0.15)',  border: '#2563eb', text: '#2563eb'  },
    'Planning':    { bg: 'rgba(245,158,11,0.15)', border: '#f59e0b', text: '#f59e0b'  },
    'In Progress': { bg: 'rgba(14,165,233,0.15)', border: '#0ea5e9', text: '#0ea5e9'  },
    'Ready':       { bg: 'rgba(34,197,94,0.15)',  border: '#22c55e', text: '#22c55e'  },
    'Inactive':    { bg: 'rgba(148,163,184,0.15)', border: '#94a3b8', text: '#94a3b8' },
    'Not Started': { bg: 'rgba(148,163,184,0.15)', border: '#94a3b8', text: '#94a3b8' },
    'Issue':       { bg: 'rgba(239,68,68,0.15)',  border: '#ef4444', text: '#ef4444'  },
    'Blocked':     { bg: 'rgba(239,68,68,0.15)',  border: '#ef4444', text: '#ef4444'  },
    'Pending':     { bg: 'rgba(245,158,11,0.15)', border: '#f59e0b', text: '#f59e0b'  }
  };
  const c = colors[status] || colors['Active'];
  return `<span style="padding:0.22rem 0.6rem;border-radius:12px;font-size:0.76rem;font-weight:700;background:${c.bg};color:${c.text};border:1px solid ${c.border};">${status}</span>`;
}

// ── Master Data Sub-bab & Project Folder Directory ────────────────
function renderMasterDataProjectFolders(subRoute) {
  const s = window.appState;
  const projects = s.projects || [];
  const selectedPrjId = s.selectedProjectId || 'PRJ-01';

  return `
    <div class="dashboard-card master-data-folders-overview" style="margin-bottom:1.5rem;border-top:3px solid var(--brand-blue);background:var(--bg-card);">
      
      <!-- Top Bar: Title & Add Project Action -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.15rem;flex-wrap:wrap;gap:0.75rem;">
        <div>
          <h2 style="margin:0;font-size:1.1rem;font-weight:800;color:var(--text-main);display:flex;align-items:center;gap:0.5rem;">
            <i data-lucide="folder-tree" style="width:20px;height:20px;color:var(--brand-blue);"></i>
            Master Data Projects &amp; Sub-bab Folders
          </h2>
          <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:0.25rem;">
            Kelola data terpusat per folder project. Tambah/hapus/edit nama project, lalu pilih sub-bab <strong>(a) Equipment List</strong>, <strong>(b) Building - Floor - Room</strong>, atau <strong>(c) User Management</strong>.
          </div>
        </div>
        <button class="btn btn-primary" onclick="window._openAddProjectModal()" style="display:flex;align-items:center;gap:0.4rem;font-weight:700;">
          <i data-lucide="folder-plus" style="width:15px;height:15px;"></i> + Tambah Project Baru
        </button>
      </div>

      <!-- Folders Grid -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:1rem;">
        ${projects.map(p => {
          const isSelected = p.id === selectedPrjId;
          const prjEq = (s.equipment || []).filter(eq => eq.projectId === p.id || (!eq.projectId && p.id === 'PRJ-01'));
          const prjRooms = s.rooms || [];
          const prjBldgs = s.buildings || [];
          
          const statusColors = {
            'Completed': { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', border: '#22c55e' },
            'Active':    { bg: 'rgba(37,99,235,0.15)', text: '#2563eb', border: '#2563eb' },
            'Planning':  { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: '#f59e0b' }
          };
          const bColor = statusColors[p.status] || statusColors['Active'];

          return `
            <div class="project-folder-card" style="border-radius:8px;border:${isSelected ? '2px solid var(--brand-blue)' : '1px solid var(--border-card)'};background:${isSelected ? 'rgba(37,99,235,0.03)' : 'var(--bg-card-secondary)'};padding:1rem;display:flex;flex-direction:column;justify-content:space-between;box-shadow:${isSelected ? '0 4px 12px rgba(37,99,235,0.12)' : 'none'};">
              
              <div>
                <!-- Card Header -->
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.6rem;gap:0.5rem;">
                  <div style="display:flex;align-items:center;gap:0.5rem;overflow:hidden;">
                    <div style="width:34px;height:34px;border-radius:6px;background:${isSelected ? 'var(--brand-blue)' : 'rgba(37,99,235,0.12)'};color:${isSelected ? '#fff' : 'var(--brand-blue)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                      <i data-lucide="folder" style="width:18px;height:18px;"></i>
                    </div>
                    <div style="overflow:hidden;">
                      <div style="font-weight:800;font-size:0.92rem;color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${window.escapeHtml(p.name)}">
                        ${window.escapeHtml(p.name)}
                      </div>
                      <div style="font-size:0.72rem;color:var(--text-secondary);display:flex;align-items:center;gap:0.35rem;">
                        <span style="font-weight:700;color:var(--brand-blue);">${p.code}</span> • <span>${window.escapeHtml(p.client)}</span>
                      </div>
                    </div>
                  </div>
                  <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.25rem;">
                    <span style="padding:0.18rem 0.5rem;border-radius:12px;font-size:0.7rem;font-weight:700;background:${bColor.bg};color:${bColor.text};border:1px solid ${bColor.border};">
                      ${p.status || 'Active'}
                    </span>
                    ${isSelected ? `<span style="font-size:0.65rem;font-weight:800;color:var(--brand-blue);text-transform:uppercase;">● Active Context</span>` : ''}
                  </div>
                </div>

                <!-- Action Bar for Project: Edit & Delete -->
                <div style="display:flex;gap:0.4rem;margin-bottom:0.75rem;padding-bottom:0.6rem;border-bottom:1px solid var(--border-card);">
                  <button class="btn" onclick="window._openEditProjectModal('${p.id}')" style="flex:1;padding:0.25rem 0.5rem;font-size:0.72rem;background:var(--bg-card);display:flex;align-items:center;justify-content:center;gap:0.3rem;" title="Edit Project">
                    <i data-lucide="edit-2" style="width:11px;height:11px;"></i> Ubah Project
                  </button>
                  ${projects.length > 1 ? `
                    <button class="btn" onclick="window._confirmDeleteProject('${p.id}')" style="padding:0.25rem 0.5rem;font-size:0.72rem;background:rgba(239,68,68,0.08);color:#ef4444;border-color:rgba(239,68,68,0.25);display:flex;align-items:center;justify-content:center;gap:0.3rem;" title="Hapus Project">
                      <i data-lucide="trash-2" style="width:11px;height:11px;"></i> Hapus
                    </button>
                  ` : ''}
                </div>
              </div>

              <!-- Sub-bab / Submenus (a, b, c) -->
              <div>
                <div style="font-size:0.68rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:0.45rem;">
                  Sub-bab Master Data:
                </div>
                <div style="display:flex;flex-direction:column;gap:0.35rem;">
                  
                  <!-- (a) Equipment List -->
                  <div onclick="window.switchProjectFolder('${p.id}', 'equipment-list')" class="subbab-btn-row ${isSelected && subRoute === 'equipment-list' ? 'active' : ''}" style="cursor:pointer;padding:0.38rem 0.65rem;border-radius:6px;display:flex;align-items:center;justify-content:space-between;border:1px solid ${isSelected && subRoute === 'equipment-list' ? 'var(--brand-blue)' : 'var(--border-card)'};background:${isSelected && subRoute === 'equipment-list' ? 'var(--brand-blue)' : 'var(--bg-card)'};color:${isSelected && subRoute === 'equipment-list' ? '#fff' : 'var(--text-main)'};">
                    <div style="display:flex;align-items:center;gap:0.4rem;font-size:0.78rem;font-weight:600;">
                      <i data-lucide="cpu" style="width:13px;height:13px;color:${isSelected && subRoute === 'equipment-list' ? '#fff' : 'var(--brand-blue)'};"></i>
                      <span>(a) Equipment List</span>
                    </div>
                    <span style="font-size:0.7rem;font-weight:700;padding:0.1rem 0.4rem;border-radius:10px;background:${isSelected && subRoute === 'equipment-list' ? 'rgba(255,255,255,0.2)' : 'var(--bg-card-secondary)'};color:${isSelected && subRoute === 'equipment-list' ? '#fff' : 'var(--text-secondary)'};">
                      ${prjEq.length} items
                    </span>
                  </div>

                  <!-- (b) Building - Floor - Room -->
                  <div onclick="window.switchProjectFolder('${p.id}', 'room-building')" class="subbab-btn-row ${isSelected && subRoute === 'room-building' ? 'active' : ''}" style="cursor:pointer;padding:0.38rem 0.65rem;border-radius:6px;display:flex;align-items:center;justify-content:space-between;border:1px solid ${isSelected && subRoute === 'room-building' ? 'var(--brand-blue)' : 'var(--border-card)'};background:${isSelected && subRoute === 'room-building' ? 'var(--brand-blue)' : 'var(--bg-card)'};color:${isSelected && subRoute === 'room-building' ? '#fff' : 'var(--text-main)'};">
                    <div style="display:flex;align-items:center;gap:0.4rem;font-size:0.78rem;font-weight:600;">
                      <i data-lucide="building-2" style="width:13px;height:13px;color:${isSelected && subRoute === 'room-building' ? '#fff' : '#10b981'};"></i>
                      <span>(b) Building - Floor - Room</span>
                    </div>
                    <span style="font-size:0.7rem;font-weight:700;padding:0.1rem 0.4rem;border-radius:10px;background:${isSelected && subRoute === 'room-building' ? 'rgba(255,255,255,0.2)' : 'var(--bg-card-secondary)'};color:${isSelected && subRoute === 'room-building' ? '#fff' : 'var(--text-secondary)'};">
                      ${prjBldgs.length} Bldgs • ${prjRooms.length} Rms
                    </span>
                  </div>

                  <!-- (c) User Management -->
                  <div onclick="window.switchProjectFolder('${p.id}', 'user-management')" class="subbab-btn-row ${isSelected && subRoute === 'user-management' ? 'active' : ''}" style="cursor:pointer;padding:0.38rem 0.65rem;border-radius:6px;display:flex;align-items:center;justify-content:space-between;border:1px solid ${isSelected && subRoute === 'user-management' ? 'var(--brand-blue)' : 'var(--border-card)'};background:${isSelected && subRoute === 'user-management' ? 'var(--brand-blue)' : 'var(--bg-card)'};color:${isSelected && subRoute === 'user-management' ? '#fff' : 'var(--text-main)'};">
                    <div style="display:flex;align-items:center;gap:0.4rem;font-size:0.78rem;font-weight:600;">
                      <i data-lucide="users" style="width:13px;height:13px;color:${isSelected && subRoute === 'user-management' ? '#fff' : '#8b5cf6'};"></i>
                      <span>(c) User Management</span>
                    </div>
                    <span style="font-size:0.7rem;font-weight:700;padding:0.1rem 0.4rem;border-radius:10px;background:${isSelected && subRoute === 'user-management' ? 'rgba(255,255,255,0.2)' : 'var(--bg-card-secondary)'};color:${isSelected && subRoute === 'user-management' ? '#fff' : 'var(--text-secondary)'};">
                      ${(s.users || []).length} users
                    </span>
                  </div>

                </div>
              </div>

            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function renderAdminView(subRoute = 'equipment-list') {
  const isSettings = ['project-settings', 'account-settings'].includes(subRoute);

  const masterDataTabs = [
    { id: 'equipment-list', label: 'Equipment List (a)', icon: 'cpu' },
    { id: 'room-building',  label: 'Building - Floor - Room (b)', icon: 'building-2' },
    { id: 'user-management', label: 'User Management (c)', icon: 'users' }
  ];
  const settingsTabs = [
    { id: 'project-settings', label: 'Project Settings', icon: 'settings' },
    { id: 'account-settings', label: 'Account Settings', icon: 'user' }
  ];
  const activeTabs = isSettings ? settingsTabs : masterDataTabs;

  const tabsHtml = `
    <div class="admin-tabs view-tabs">
      ${activeTabs.map(tab => `
        <span class="admin-tab view-tab ${subRoute === tab.id ? 'active' : ''}" data-route="${tab.id}">
          <i data-lucide="${tab.icon}" style="width:16px;height:16px;"></i> ${tab.label}
        </span>`).join('')}
    </div>`;

  let content = '';
  switch (subRoute) {
    case 'equipment-list': content = renderEquipmentList(); break;
    case 'room-building':  content = renderRoomBuilding();  break;
    case 'user-management': content = renderUserManagement(); break;
    case 'project-settings': content = renderProjectSettings(); break;
    case 'account-settings': content = renderAccountSettings(); break;
    default: content = renderEquipmentList();
  }

  const projectFoldersHtml = !isSettings ? renderMasterDataProjectFolders(subRoute) : '';

  return `<div class="admin-view">${projectFoldersHtml}${tabsHtml}<div class="admin-content">${content}</div></div>`;
}

// ================================================================
// EQUIPMENT LIST — reads from appState.equipment
// ================================================================
function renderEquipmentList() {
  const s = window.appState;
  const ef = s.equipmentFilters || { building: 'all', type: 'all', search: '' };

  // Dynamic building options from appState
  const buildings = s.buildings || [];
  const buildingOptions = buildings.map(b =>
    `<option value="${b.name}" ${ef.building === b.name ? 'selected' : ''}>${window.escapeHtml(b.name)}</option>`
  ).join('');

  // Get unique types from equipment
  const allTypes = [...new Set(s.equipment.map(e => e.type).filter(Boolean))].sort();
  const typeOptions = allTypes.map(t =>
    `<option value="${t}" ${ef.type === t ? 'selected' : ''}>${t}</option>`
  ).join('');

  const selectedPrjId = s.selectedProjectId || 'PRJ-01';
  const projectEquipment = s.equipment.filter(eq => eq.projectId === selectedPrjId || (!eq.projectId && selectedPrjId === 'PRJ-01'));

  // Apply filters
  const filteredList = projectEquipment.filter(eq => {
    const bldgOk   = ef.building === 'all' || eq.buildingName === ef.building || eq.building === ef.building;
    const typeOk   = ef.type === 'all' || (eq.type || '').toLowerCase().includes(ef.type.toLowerCase());
    const searchOk = !ef.search || eq.id.toLowerCase().includes(ef.search.toLowerCase()) || (eq.name || '').toLowerCase().includes(ef.search.toLowerCase()) || (eq.type || '').toLowerCase().includes(ef.search.toLowerCase());
    return bldgOk && typeOk && searchOk;
  });

  const currentPage = window.appPageState['equipment-list'] || 1;
  const pageSize = 8;
  const paginatedData = filteredList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const buildingModalOptions = buildings.map(b => `<option value="${b.id}">${window.escapeHtml(b.name)}</option>`).join('');
  const phaseOptions = ['CxL1','CxL2 Pre-Cx','CxL3 Startup','CxL4 Functional','CxL5 Complete'].map(p => `<option>${p}</option>`).join('');

  return `
    <div class="dashboard-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;flex-wrap:wrap;gap:1rem;">
        <h2 class="card-top-title" style="margin:0;">Equipment Master List — <span style="font-size:0.85rem;font-weight:600;color:var(--text-muted);">${filteredList.length} of ${s.equipment.length} shown</span></h2>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
          <select class="filter-select" onchange="window.setEquipmentFilter('building', this.value === 'All Buildings' ? 'all' : this.value)">
            <option value="all" ${ef.building === 'all' ? 'selected' : ''}>All Buildings</option>
            ${buildingOptions}
          </select>
          <select class="filter-select" onchange="window.setEquipmentFilter('type', this.value === 'All Types' ? 'all' : this.value)">
            <option value="all" ${ef.type === 'all' ? 'selected' : ''}>All Types</option>
            ${typeOptions}
          </select>
          <div style="position:relative;">
            <i data-lucide="search" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);width:14px;height:14px;color:var(--text-muted);pointer-events:none;"></i>
            <input id="eq-search-input" type="text" placeholder="Search equipment..." value="${ef.search || ''}"
              style="padding:0.45rem 0.5rem 0.45rem 2rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);width:200px;"
              oninput="window.setEquipmentFilter('search', this.value)">
          </div>
          <button class="btn btn-primary" onclick="window._openAddEquipmentModal()" style="display:flex;align-items:center;gap:0.4rem;">
            <i data-lucide="plus" style="width:14px;height:14px;"></i> Add Equipment
          </button>
        </div>
      </div>
      <div class="table-responsive-wrapper">
        <table class="summary-table" style="width:100%;text-align:left;border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid var(--border-card);background:var(--bg-card-secondary);">
              <th style="padding:0.75rem;font-weight:bold;color:var(--text-secondary);">ID</th>
              <th style="padding:0.75rem;font-weight:bold;color:var(--text-secondary);">Name</th>
              <th style="padding:0.75rem;font-weight:bold;color:var(--text-secondary);">Type</th>
              <th style="padding:0.75rem;font-weight:bold;color:var(--text-secondary);">Building</th>
              <th style="padding:0.75rem;font-weight:bold;color:var(--text-secondary);">Room</th>
              <th style="padding:0.75rem;font-weight:bold;color:var(--text-secondary);">Phase</th>
              <th style="padding:0.75rem;font-weight:bold;color:var(--text-secondary);">Status</th>
              <th style="padding:0.75rem;font-weight:bold;color:var(--text-secondary);">Updated</th>
              <th style="padding:0.75rem;font-weight:bold;color:var(--text-secondary);">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${paginatedData.length === 0
              ? `<tr><td colspan="9" style="text-align:center;padding:2rem;color:var(--text-muted);">No equipment matches the selected filters.</td></tr>`
              : paginatedData.map(eq => `
                <tr style="border-bottom:1px solid var(--border-card);">
                  <td style="padding:0.65rem;color:var(--brand-blue);font-weight:700;font-size:0.82rem;">${eq.id}</td>
                  <td style="padding:0.65rem;font-weight:600;color:var(--text-main);font-size:0.85rem;">${eq.name || '—'}</td>
                  <td style="padding:0.65rem;color:var(--text-secondary);font-size:0.82rem;">${eq.type || '—'}</td>
                  <td style="padding:0.65rem;color:var(--text-main);font-size:0.82rem;">${eq.buildingName || eq.building || '—'}</td>
                  <td style="padding:0.65rem;color:var(--text-main);font-size:0.82rem;">${eq.room || '—'}</td>
                  <td style="padding:0.65rem;font-size:0.78rem;"><span class="status-badge badge-blue" style="font-size:0.72rem;">${eq.phase || '—'}</span></td>
                  <td style="padding:0.65rem;">${_statusBadge(eq.status || 'Active')}</td>
                  <td style="padding:0.65rem;color:var(--text-muted);font-size:0.78rem;">${eq.updated || eq.updatedAt || '—'}</td>
                  <td style="padding:0.65rem;">
                    <div style="display:flex;gap:0.4rem;">
                      <button class="btn" style="padding:0.2rem 0.5rem;font-size:0.72rem;background:var(--bg-card-secondary);" title="Edit ${eq.id}" onclick="window._openEditEquipmentModal('${eq.id}')">
                        <i data-lucide="edit-2" style="width:12px;height:12px;"></i>
                      </button>
                      <button class="btn" style="padding:0.2rem 0.5rem;font-size:0.72rem;background:rgba(239,68,68,0.1);color:#ef4444;border-color:rgba(239,68,68,0.3);" title="Delete ${eq.id}" onclick="window._confirmDeleteEquipment('${eq.id}')">
                        <i data-lucide="trash-2" style="width:12px;height:12px;"></i>
                      </button>
                    </div>
                  </td>
                </tr>`).join('')}
          </tbody>
        </table>
      </div>
      ${window.renderPagination(filteredList.length, currentPage, pageSize, 'equipment-list')}
    </div>`;
}

// Equipment modal helpers
window._openAddEquipmentModal = function() {
  const buildings = window.appState.buildings;
  const bldgOpts = buildings.map(b => `<option value="${b.id}">${window.escapeHtml(b.name)}</option>`).join('');
  openModal({
    title: 'Add New Equipment',
    bodyHtml: `
      <div class="form-row"><label>Equipment ID <span style="color:#ef4444;">*</span></label><input id="neq-id" type="text" placeholder="e.g. AHU-003" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Equipment Name <span style="color:#ef4444;">*</span></label><input id="neq-name" type="text" placeholder="e.g. Air Handling Unit 3" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Type</label><select id="neq-type" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
        <option>Air Handling Unit</option><option>Chiller Pump</option><option>Fan Coil Unit</option><option>Water Pump</option><option>VRF System</option><option>Heat Exchanger</option><option>Motor Control Centre</option><option>Valve</option><option>Tank</option><option>General</option>
      </select></div>
      <div class="form-row"><label>Building <span style="color:#ef4444;">*</span></label><select id="neq-bldg" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">${bldgOpts}</select></div>
      <div class="form-row"><label>Room</label><input id="neq-room" type="text" placeholder="e.g. RF-301" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Phase Gate</label><select id="neq-phase" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
        <option>CxL1</option><option>CxL2 Pre-Cx</option><option selected>CxL3 Startup</option><option>CxL4 Functional</option><option>CxL5 Complete</option>
      </select></div>`,
    confirmText: 'Add Equipment',
    onConfirm: (overlay) => {
      const id     = overlay.querySelector('#neq-id')?.value?.trim().toUpperCase();
      const name   = overlay.querySelector('#neq-name')?.value?.trim();
      const type   = overlay.querySelector('#neq-type')?.value;
      const bldgId = overlay.querySelector('#neq-bldg')?.value;
      const room   = overlay.querySelector('#neq-room')?.value?.trim();
      const phase  = overlay.querySelector('#neq-phase')?.value;
      const result = window.createEquipment({ id, name, type, buildingId: bldgId, room, phase });
      if (!result.ok) { _showFormError(overlay, result.error); return false; }
      const prjId = window.appState.selectedProjectId || 'PRJ-01';
      const count = window.appState.equipment.filter(e => e.projectId === prjId || (!e.projectId && prjId === 'PRJ-01')).length;
      window.appPageState['equipment-list'] = Math.ceil(count / 8);
      showToast(`Equipment "${id}" added successfully.`, 'success');
      window.renderApp();
    }
  });
};

window._openEditEquipmentModal = function(eqId) {
  const eq = window.appState.equipment.find(e => e.id === eqId);
  if (!eq) return showToast('Equipment not found.', 'danger');
  const buildings = window.appState.buildings;
  const bldgOpts = buildings.map(b => `<option value="${b.id}" ${b.id === eq.buildingId ? 'selected' : ''}>${window.escapeHtml(b.name)}</option>`).join('');
  const phaseOpts = ['CxL1','CxL2 Pre-Cx','CxL3 Startup','CxL4 Functional','CxL5 Complete'].map(p => `<option ${p === eq.phase ? 'selected' : ''}>${p}</option>`).join('');
  const statusOpts = ['Active','Inactive','Issue'].map(s => `<option ${s === eq.status ? 'selected' : ''}>${s}</option>`).join('');
  openModal({
    title: `Edit Equipment: ${eqId}`,
    bodyHtml: `
      <div class="form-row"><label>Equipment ID</label><input type="text" value="${eqId}" readonly style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-muted);cursor:not-allowed;"></div>
      <div class="form-row"><label>Equipment Name <span style="color:#ef4444;">*</span></label><input id="eeq-name" type="text" value="${eq.name || ''}" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Type</label><select id="eeq-type" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
        ${['Air Handling Unit','Chiller Pump','Fan Coil Unit','Water Pump','VRF System','Heat Exchanger','Motor Control Centre','Valve','Tank','General'].map(t => `<option ${t === eq.type ? 'selected' : ''}>${t}</option>`).join('')}
      </select></div>
      <div class="form-row"><label>Building</label><select id="eeq-bldg" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">${bldgOpts}</select></div>
      <div class="form-row"><label>Room</label><input id="eeq-room" type="text" value="${eq.room || ''}" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Phase Gate</label><select id="eeq-phase" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">${phaseOpts}</select></div>
      <div class="form-row"><label>Status</label><select id="eeq-status" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">${statusOpts}</select></div>`,
    confirmText: 'Save Changes',
    onConfirm: (overlay) => {
      const name   = overlay.querySelector('#eeq-name')?.value?.trim();
      const type   = overlay.querySelector('#eeq-type')?.value;
      const bldgId = overlay.querySelector('#eeq-bldg')?.value;
      const room   = overlay.querySelector('#eeq-room')?.value?.trim();
      const phase  = overlay.querySelector('#eeq-phase')?.value;
      const status = overlay.querySelector('#eeq-status')?.value;
      const result = window.updateEquipment(eqId, { name, type, buildingId: bldgId, room, phase, status });
      if (!result.ok) { _showFormError(overlay, result.error); return false; }
      showToast(`Equipment "${eqId}" updated successfully.`, 'success');
      window.renderApp();
    }
  });
};

window._confirmDeleteEquipment = function(eqId) {
  const eq = window.appState.equipment.find(e => e.id === eqId);
  const actCount = window.appState.activities.filter(a => a.equipmentId === eqId || a.eq === eqId).length;
  openModal({
    title: `Delete Equipment: ${eqId}`,
    bodyHtml: `
      <div style="padding:1rem;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:6px;margin-bottom:0.75rem;">
        <p style="margin:0;font-size:0.9rem;color:var(--text-main);">Are you sure you want to delete <strong>${eqId} — ${eq?.name || ''}</strong>?</p>
        ${actCount > 0 ? `<p style="margin:0.5rem 0 0;font-size:0.82rem;color:#ef4444;">⚠ This equipment has ${actCount} associated activity/activities. They must be removed first.</p>` : '<p style="margin:0.5rem 0 0;font-size:0.82rem;color:var(--text-muted);">This action cannot be undone.</p>'}
      </div>`,
    confirmText: 'Delete Equipment',
    confirmClass: 'btn-danger',
    onConfirm: () => {
      const result = window.deleteEquipment(eqId);
      if (!result.ok) { showToast(result.error, 'danger'); return false; }
      showToast(`Equipment "${eqId}" deleted.`, 'success');
      window.renderApp();
    }
  });
};

// ================================================================
// ROOM / BUILDING — reads from appState.buildings and appState.rooms
// ================================================================
function renderRoomBuilding() {
  const s = window.appState;
  const bf = s.buildingFilters || { search: '' };
  const rf = s.roomFilters || { building: 'all', search: '' };

  const filteredBuildings = s.buildings.filter(b =>
    !bf.search || b.name.toLowerCase().includes(bf.search.toLowerCase()) || b.code.toLowerCase().includes(bf.search.toLowerCase())
  );

  const filteredRooms = s.rooms.filter(r => {
    const bldg = s.buildings.find(b => b.id === r.buildingId);
    const bldgName = bldg ? bldg.name : '';
    const bldgOk   = rf.building === 'all' || r.buildingId === rf.building;
    const searchOk = !rf.search || r.roomNo.toLowerCase().includes(rf.search.toLowerCase()) || bldgName.toLowerCase().includes(rf.search.toLowerCase());
    return bldgOk && searchOk;
  });

  const bldgFilterOpts = s.buildings.map(b => `<option value="${b.id}" ${rf.building === b.id ? 'selected' : ''}>${window.escapeHtml(b.name)}</option>`).join('');

  return `
    <div>
      <!-- BUILDING SECTION -->
      <div class="dashboard-card" style="margin-bottom:1.5rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;flex-wrap:wrap;gap:1rem;">
          <h2 class="card-top-title" style="margin:0;">Building Management — ${filteredBuildings.length} building(s)</h2>
          <div style="display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap;">
            <div style="position:relative;">
              <i data-lucide="search" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:13px;height:13px;color:var(--text-muted);pointer-events:none;"></i>
              <input id="bldg-search-input" type="text" placeholder="Search buildings..." value="${bf.search || ''}"
                style="padding:0.4rem 0.5rem 0.4rem 1.8rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);width:180px;"
                oninput="window.setBuildingFilter('search', this.value)">
            </div>
            <button class="btn btn-primary" style="display:flex;align-items:center;gap:0.4rem;" onclick="window._openAddBuildingModal()">
              <i data-lucide="plus" style="width:14px;height:14px;"></i> New Building
            </button>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem;">
          ${filteredBuildings.map(b => {
            const roomCount = s.rooms.filter(r => r.buildingId === b.id).length;
            const eqCount   = s.equipment.filter(e => e.buildingId === b.id).length;
            return `
            <div class="dashboard-card" style="padding:1.1rem;border-top:3px solid var(--brand-blue);background:var(--bg-card-secondary);">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem;">
                <div>
                  <div style="font-weight:800;font-size:1rem;color:var(--text-main);">${window.escapeHtml(b.name)}</div>
                  <div style="font-size:0.72rem;color:var(--brand-blue);font-weight:700;">${window.escapeHtml(b.code)}</div>
                </div>
                ${_statusBadge(b.status)}
              </div>
              <div style="font-size:0.78rem;color:var(--text-secondary);margin-bottom:0.75rem;">${window.escapeHtml(b.location) || '—'}</div>
              <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.75rem;">${window.escapeHtml(b.description) || ''}</div>
              <div style="display:flex;gap:1rem;font-size:0.75rem;color:var(--text-secondary);border-top:1px solid var(--border-card);padding-top:0.5rem;margin-top:0.25rem;">
                <span>Rooms: <strong style="color:var(--text-main);">${roomCount}</strong></span>
                <span>Equipment: <strong style="color:var(--text-main);">${eqCount}</strong></span>
              </div>
              <div style="display:flex;gap:0.5rem;margin-top:0.75rem;">
                <button class="btn" style="flex:1;padding:0.3rem 0.5rem;font-size:0.75rem;background:var(--bg-card);" onclick="window._openEditBuildingModal('${b.id}')">
                  <i data-lucide="edit-2" style="width:12px;height:12px;"></i> Edit
                </button>
                <button class="btn" style="padding:0.3rem 0.5rem;font-size:0.75rem;background:rgba(239,68,68,0.1);color:#ef4444;border-color:rgba(239,68,68,0.3);" onclick="window._confirmDeleteBuilding('${b.id}')">
                  <i data-lucide="trash-2" style="width:12px;height:12px;"></i>
                </button>
              </div>
            </div>`;
          }).join('')}
          ${filteredBuildings.length === 0 ? '<div style="padding:2rem;text-align:center;color:var(--text-muted);">No buildings match your search.</div>' : ''}
        </div>
      </div>

      <!-- ROOM SECTION -->
      <div class="dashboard-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;flex-wrap:wrap;gap:1rem;">
          <h2 class="card-top-title" style="margin:0;">Room Directory — ${filteredRooms.length} room(s)</h2>
          <div style="display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap;">
            <select class="filter-select" onchange="window.setRoomFilter('building', this.value)">
              <option value="all" ${rf.building === 'all' ? 'selected' : ''}>All Buildings</option>
              ${bldgFilterOpts}
            </select>
            <div style="position:relative;">
              <i data-lucide="search" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:13px;height:13px;color:var(--text-muted);pointer-events:none;"></i>
              <input id="room-search-input" type="text" placeholder="Search rooms..." value="${rf.search || ''}"
                style="padding:0.4rem 0.5rem 0.4rem 1.8rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);width:160px;"
                oninput="window.setRoomFilter('search', this.value)">
            </div>
            <button class="btn btn-primary" style="display:flex;align-items:center;gap:0.4rem;" onclick="window._openAddRoomModal()">
              <i data-lucide="plus" style="width:14px;height:14px;"></i> Add Room
            </button>
            <button class="btn" style="display:flex;align-items:center;gap:0.4rem;background:rgba(16,185,129,0.12);color:#10b981;border:1px solid rgba(16,185,129,0.3);font-weight:700;" onclick="window._openAddBuildingFloorRoomModal()" title="Tambah Building, Floor & Room sekaligus">
              <i data-lucide="layers" style="width:14px;height:14px;"></i> Add Building - Floor - Room
            </button>
          </div>
        </div>
        <div class="table-responsive-wrapper">
          <table class="summary-table" style="width:100%;text-align:left;border-collapse:collapse;">
            <thead>
              <tr style="border-bottom:1px solid var(--border-card);background:var(--bg-card-secondary);">
                <th style="padding:0.65rem;font-weight:bold;color:var(--text-secondary);">Room Name / No</th>
                <th style="padding:0.65rem;font-weight:bold;color:var(--text-secondary);">Building Name</th>
                <th style="padding:0.65rem;font-weight:bold;color:var(--text-secondary);">Floor Name / Level</th>
                <th style="padding:0.65rem;font-weight:bold;color:var(--text-secondary);">Area (m²)</th>
                <th style="padding:0.65rem;font-weight:bold;color:var(--text-secondary);">Equipment</th>
                <th style="padding:0.65rem;font-weight:bold;color:var(--text-secondary);">Status</th>
                <th style="padding:0.65rem;font-weight:bold;color:var(--text-secondary);">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRooms.length === 0
                ? `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-muted);">No rooms found.</td></tr>`
                : filteredRooms.map(r => {
                  const bldg = s.buildings.find(b => b.id === r.buildingId);
                  const eqCount = s.equipment.filter(e => e.room === r.roomNo && e.buildingId === r.buildingId).length;
                  return `
                  <tr style="border-bottom:1px solid var(--border-card);">
                    <td style="padding:0.65rem;font-weight:700;color:var(--text-main);">Rm ${r.roomNo}</td>
                    <td style="padding:0.65rem;color:var(--text-secondary);font-size:0.85rem;">${bldg ? window.escapeHtml(bldg.name) : '—'}</td>
                    <td style="padding:0.65rem;color:var(--text-main);font-size:0.85rem;">Fl ${r.floor}</td>
                    <td style="padding:0.65rem;color:var(--text-secondary);font-size:0.85rem;">${r.area}</td>
                    <td style="padding:0.65rem;"><span style="background:var(--bg-card-secondary);padding:0.2rem 0.5rem;border-radius:4px;font-size:0.8rem;">${eqCount} items</span></td>
                    <td style="padding:0.65rem;">${_statusBadge(r.status)}</td>
                    <td style="padding:0.65rem;">
                      <div style="display:flex;gap:0.4rem;">
                        <button class="btn" style="padding:0.2rem 0.4rem;font-size:0.72rem;background:var(--bg-card-secondary);" onclick="window._openEditRoomModal('${r.id}')"><i data-lucide="edit-2" style="width:11px;height:11px;"></i></button>
                        <button class="btn" style="padding:0.2rem 0.4rem;font-size:0.72rem;background:rgba(239,68,68,0.1);color:#ef4444;border-color:rgba(239,68,68,0.3);" onclick="window._confirmDeleteRoom('${r.id}')"><i data-lucide="trash-2" style="width:11px;height:11px;"></i></button>
                      </div>
                    </td>
                  </tr>`;
                }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
}

// Building modal helpers
window._openAddBuildingModal = function() {
  openModal({
    title: 'Add New Building',
    bodyHtml: `
      <div class="form-row"><label>Building Code <span style="color:#ef4444;">*</span></label><input id="nb-code" type="text" placeholder="e.g. BLD-D" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Building Name <span style="color:#ef4444;">*</span></label><input id="nb-name" type="text" placeholder="e.g. Building D" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Location</label><input id="nb-loc" type="text" placeholder="e.g. Zone D - East Wing" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Type</label><select id="nb-type" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
        <option>Main Facility</option><option>Annex</option><option>Support</option><option>General</option>
      </select></div>
      <div class="form-row"><label>Description</label><textarea id="nb-desc" rows="2" placeholder="Brief description..." style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);resize:vertical;"></textarea></div>`,
    confirmText: 'Create Building',
    onConfirm: (overlay) => {
      const code = overlay.querySelector('#nb-code')?.value?.trim().toUpperCase();
      const name = overlay.querySelector('#nb-name')?.value?.trim();
      const loc  = overlay.querySelector('#nb-loc')?.value?.trim();
      const type = overlay.querySelector('#nb-type')?.value;
      const desc = overlay.querySelector('#nb-desc')?.value?.trim();
      const result = window.createBuilding({ code, name, location: loc, type, description: desc });
      if (!result.ok) { _showFormError(overlay, result.error); return false; }
      showToast(`Building "${name}" created successfully.`, 'success');
      window.renderApp();
    }
  });
};

window._openEditBuildingModal = function(bldgId) {
  const b = window.appState.buildings.find(b => b.id === bldgId);
  if (!b) return showToast('Building not found.', 'danger');
  openModal({
    title: `Edit Building: ${window.escapeHtml(b.name)}`,
    bodyHtml: `
      <div class="form-row"><label>Building Code</label><input type="text" value="${window.escapeHtml(b.code)}" readonly style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-muted);cursor:not-allowed;"></div>
      <div class="form-row"><label>Building Name <span style="color:#ef4444;">*</span></label><input id="eb-name" type="text" value="${window.escapeHtml(b.name)}" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Location</label><input id="eb-loc" type="text" value="${window.escapeHtml(b.location || '')}" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Type</label><select id="eb-type" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
        ${['Main Facility','Annex','Support','General'].map(t => `<option ${t === b.type ? 'selected' : ''}>${t}</option>`).join('')}
      </select></div>
      <div class="form-row"><label>Description</label><textarea id="eb-desc" rows="2" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);resize:vertical;">${window.escapeHtml(b.description || '')}</textarea></div>`,
    confirmText: 'Save Changes',
    onConfirm: (overlay) => {
      const name = overlay.querySelector('#eb-name')?.value?.trim();
      const loc  = overlay.querySelector('#eb-loc')?.value?.trim();
      const type = overlay.querySelector('#eb-type')?.value;
      const desc = overlay.querySelector('#eb-desc')?.value?.trim();
      const result = window.updateBuilding(bldgId, { name, location: loc, type, description: desc });
      if (!result.ok) { _showFormError(overlay, result.error); return false; }
      showToast(`Building updated successfully.`, 'success');
      window.renderApp();
    }
  });
};

window._confirmDeleteBuilding = function(bldgId) {
  const b = window.appState.buildings.find(b => b.id === bldgId);
  if (!b) return showToast('Building not found.', 'danger');
  const roomCount = window.appState.rooms.filter(r => r.buildingId === bldgId).length;
  const eqCount   = window.appState.equipment.filter(e => e.buildingId === bldgId).length;
  const hasDepends = roomCount > 0 || eqCount > 0;
  const bodyHtml = hasDepends
    ? `<div style="padding:1rem;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:6px;"><p style="margin:0;font-size:0.9rem;color:var(--text-main);font-weight:600;">⚠ Cannot delete <strong>${window.escapeHtml(b.name)}</strong></p><p style="margin:0.5rem 0 0;font-size:0.85rem;color:#ef4444;">This building contains <strong>${roomCount}</strong> room(s) and <strong>${eqCount}</strong> equipment item(s). Reassign or remove all dependencies first.</p></div>`
    : `<div style="padding:1rem;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:6px;"><p style="margin:0;font-size:0.9rem;color:var(--text-main);">Are you sure you want to delete building <strong>${window.escapeHtml(b.name)}</strong> (${window.escapeHtml(b.code)})?</p><p style="margin:0.5rem 0 0;font-size:0.82rem;color:var(--text-muted);">This action cannot be undone.</p></div>`;
  openModal({
    title: hasDepends ? `Cannot Delete: ${window.escapeHtml(b.name)}` : `Delete Building: ${window.escapeHtml(b.name)}`,
    bodyHtml,
    confirmText: hasDepends ? 'OK' : 'Delete Building',
    confirmClass: hasDepends ? 'btn-primary' : 'btn-danger',
    onConfirm: () => {
      if (hasDepends) return;
      const r = window.deleteBuilding(bldgId);
      if (!r.ok) { showToast(r.error, 'danger'); return false; }
      showToast(`Building "${b.name}" deleted.`, 'success');
      window.renderApp();
    }
  });
};

// Room modal helpers
window._openAddRoomModal = function() {
  const buildings = window.appState.buildings;
  const bldgOpts = buildings.map(b => `<option value="${b.id}">${window.escapeHtml(b.name)}</option>`).join('');
  openModal({
    title: 'Add New Room',
    bodyHtml: `
      <div class="form-row"><label>Room Name / Number <span style="color:#ef4444;">*</span></label><input id="nr-no" type="text" placeholder="e.g. 203 or Server Room" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Building Name <span style="color:#ef4444;">*</span></label><select id="nr-bldg" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">${bldgOpts}</select></div>
      <div class="form-row"><label>Floor Name / Level</label><input id="nr-floor" type="text" placeholder="e.g. Floor 1, Lantai 2, R (Roof)" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Area (m²)</label><input id="nr-area" type="number" placeholder="e.g. 120" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Status</label><select id="nr-status" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
        <option>Not Started</option><option>In Progress</option><option>Ready</option>
      </select></div>`,
    confirmText: 'Add Room',
    onConfirm: (overlay) => {
      const roomNo   = overlay.querySelector('#nr-no')?.value?.trim();
      const buildingId = overlay.querySelector('#nr-bldg')?.value;
      const floor    = overlay.querySelector('#nr-floor')?.value?.trim() || '1';
      const area     = overlay.querySelector('#nr-area')?.value?.trim() || '0';
      const status   = overlay.querySelector('#nr-status')?.value;
      const result = window.createRoom({ roomNo, buildingId, floor, area, status });
      if (!result.ok) { _showFormError(overlay, result.error); return false; }
      showToast(`Room "${roomNo}" added successfully.`, 'success');
      window.renderApp();
    }
  });
};

window._openAddBuildingFloorRoomModal = function() {
  const buildings = window.appState.buildings || [];

  openModal({
    title: 'Add Building - Floor - Room (Setup Lengkap)',
    bodyHtml: `
      <div style="padding:0.75rem;background:rgba(37,99,235,0.06);border:1px solid rgba(37,99,235,0.2);border-radius:6px;margin-bottom:1rem;font-size:0.8rem;color:var(--text-secondary);">
        Kelola dan tambahkan <strong>Building Name</strong>, <strong>Floor Name</strong>, dan <strong>Room Name</strong> untuk project master data.
      </div>
      <div class="form-row">
        <label>Building Name <span style="color:#ef4444;">*</span></label>
        <input id="nbfr-bldg-name" list="existing-bldgs-list" type="text" placeholder="e.g. Building A or Data Center Hub" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
        <datalist id="existing-bldgs-list">
          ${buildings.map(b => `<option value="${b.name}">`).join('')}
        </datalist>
      </div>
      <div class="form-row">
        <label>Floor Name / Level <span style="color:#ef4444;">*</span></label>
        <input id="nbfr-floor-name" type="text" placeholder="e.g. Floor 1, Lantai 2, Ground Floor, Roof" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
      </div>
      <div class="form-row">
        <label>Room Name / Number <span style="color:#ef4444;">*</span></label>
        <input id="nbfr-room-name" type="text" placeholder="e.g. Rm 101, AHU Mechanical Room, Server Room" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
      </div>
      <div class="form-row">
        <label>Area (m²)</label>
        <input id="nbfr-area" type="number" value="120" placeholder="e.g. 120" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
      </div>
      <div class="form-row">
        <label>Status</label>
        <select id="nbfr-status" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
          <option value="Ready" selected>Ready</option>
          <option value="In Progress">In Progress</option>
          <option value="Not Started">Not Started</option>
        </select>
      </div>`,
    confirmText: 'Tambah Building, Floor & Room',
    onConfirm: (overlay) => {
      const bldgName = overlay.querySelector('#nbfr-bldg-name')?.value?.trim();
      const floorName = overlay.querySelector('#nbfr-floor-name')?.value?.trim();
      const roomName = overlay.querySelector('#nbfr-room-name')?.value?.trim();
      const area = overlay.querySelector('#nbfr-area')?.value?.trim() || '100';
      const status = overlay.querySelector('#nbfr-status')?.value || 'Ready';

      if (!bldgName) { _showFormError(overlay, 'Building Name is required.'); return false; }
      if (!floorName) { _showFormError(overlay, 'Floor Name / Level is required.'); return false; }
      if (!roomName) { _showFormError(overlay, 'Room Name / Number is required.'); return false; }

      // Check if building exists or create new
      let bldg = window.appState.buildings.find(b => b.name.toLowerCase() === bldgName.toLowerCase());
      if (!bldg) {
        const nextCode = 'BLD-' + String.fromCharCode(65 + (window.appState.buildings.length % 26));
        const bRes = window.createBuilding({ code: nextCode, name: bldgName, location: `Zone ${bldgName}`, type: 'Main Facility' });
        if (!bRes.ok) { _showFormError(overlay, bRes.error); return false; }
        bldg = bRes.building;
      }

      // Create room
      const rRes = window.createRoom({ roomNo: roomName, buildingId: bldg.id, floor: floorName, area, status });
      if (!rRes.ok) { _showFormError(overlay, rRes.error); return false; }

      showToast(`Building "${bldgName}", Floor "${floorName}", Room "${roomName}" berhasil ditambahkan!`, 'success', 4000);
      window.renderApp();
    }
  });
};

window._openEditRoomModal = function(roomId) {
  const r = window.appState.rooms.find(r => r.id === roomId);
  if (!r) return showToast('Room not found.', 'danger');
  openModal({
    title: `Edit Room ${r.roomNo}`,
    bodyHtml: `
      <div class="form-row"><label>Room Name / Number</label><input id="er-no" type="text" value="${r.roomNo}" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Floor Name / Level</label><input id="er-floor" type="text" value="${r.floor}" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Area (m²)</label><input id="er-area" type="number" value="${r.area}" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Status</label><select id="er-status" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
        ${['Not Started','In Progress','Ready'].map(s => `<option ${s === r.status ? 'selected' : ''}>${s}</option>`).join('')}
      </select></div>`,
    confirmText: 'Save Changes',
    onConfirm: (overlay) => {
      const roomNo = overlay.querySelector('#er-no')?.value?.trim();
      const floor  = overlay.querySelector('#er-floor')?.value?.trim();
      const area   = overlay.querySelector('#er-area')?.value?.trim();
      const status = overlay.querySelector('#er-status')?.value;
      const result = window.updateRoom(roomId, { roomNo, floor, area, status });
      if (!result.ok) { _showFormError(overlay, result.error); return false; }
      showToast('Room updated successfully.', 'success');
      window.renderApp();
    }
  });
};

window._confirmDeleteRoom = function(roomId) {
  const r = window.appState.rooms.find(r => r.id === roomId);
  openModal({
    title: `Delete Room ${r?.roomNo}`,
    bodyHtml: `<div style="padding:1rem;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:6px;"><p style="margin:0;font-size:0.9rem;color:var(--text-main);">Are you sure you want to delete Room <strong>${r?.roomNo}</strong>? This cannot be undone.</p></div>`,
    confirmText: 'Delete Room',
    confirmClass: 'btn-danger',
    onConfirm: () => {
      const result = window.deleteRoom(roomId);
      if (!result.ok) { showToast(result.error, 'danger'); return false; }
      showToast(`Room "${r?.roomNo}" deleted.`, 'success');
      window.renderApp();
    }
  });
};

// ================================================================
// USER MANAGEMENT — reads from appState.users
// ================================================================
function renderUserManagement() {
  const s = window.appState;
  const uf = s.userFilters || { role: 'all', status: 'all', search: '' };

  const allRoles = [...new Set(s.users.map(u => u.role))].sort();
  const roleOpts = allRoles.map(r => `<option value="${r}" ${uf.role === r ? 'selected' : ''}>${r}</option>`).join('');

  const filteredUsers = s.users.filter(u => {
    const roleOk   = uf.role === 'all' || u.role === uf.role;
    const statusOk = uf.status === 'all' || u.status === uf.status;
    const searchOk = !uf.search || u.name.toLowerCase().includes(uf.search.toLowerCase()) || u.email.toLowerCase().includes(uf.search.toLowerCase());
    return roleOk && statusOk && searchOk;
  });

  const currentPage = window.appPageState['user-management'] || 1;
  const pageSize = 8;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return `
    <div class="dashboard-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;flex-wrap:wrap;gap:1rem;">
        <h2 class="card-top-title" style="margin:0;">System Users — ${filteredUsers.length} of ${s.users.length} shown</h2>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
          <select class="filter-select" onchange="window.setUserFilter('role', this.value === 'All Roles' ? 'all' : this.value)">
            <option value="all" ${uf.role === 'all' ? 'selected' : ''}>All Roles</option>
            ${roleOpts}
          </select>
          <select class="filter-select" onchange="window.setUserFilter('status', this.value === 'All Statuses' ? 'all' : this.value)">
            <option value="all" ${uf.status === 'all' ? 'selected' : ''}>All Statuses</option>
            <option value="Active" ${uf.status === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Inactive" ${uf.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
          </select>
          <div style="position:relative;">
            <i data-lucide="search" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:13px;height:13px;color:var(--text-muted);pointer-events:none;"></i>
            <input id="user-search-input" type="text" placeholder="Search users..." value="${uf.search || ''}"
              style="padding:0.4rem 0.5rem 0.4rem 1.8rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);width:180px;"
              oninput="window.setUserFilter('search', this.value)">
          </div>
          <button class="btn btn-primary" style="display:flex;align-items:center;gap:0.4rem;" onclick="window._openAddUserModal()">
            <i data-lucide="user-plus" style="width:14px;height:14px;"></i> Add User
          </button>
        </div>
      </div>
      <div class="table-responsive-wrapper">
        <table class="summary-table" style="width:100%;text-align:left;border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid var(--border-card);background:var(--bg-card-secondary);">
              <th style="padding:0.65rem;font-weight:bold;color:var(--text-secondary);">Name</th>
              <th style="padding:0.65rem;font-weight:bold;color:var(--text-secondary);">Email</th>
              <th style="padding:0.65rem;font-weight:bold;color:var(--text-secondary);">Role</th>
              <th style="padding:0.65rem;font-weight:bold;color:var(--text-secondary);">Department</th>
              <th style="padding:0.65rem;font-weight:bold;color:var(--text-secondary);">Status</th>
              <th style="padding:0.65rem;font-weight:bold;color:var(--text-secondary);">Last Login</th>
              <th style="padding:0.65rem;font-weight:bold;color:var(--text-secondary);">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${paginatedUsers.length === 0
              ? `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-muted);">No users match the selected filters.</td></tr>`
              : paginatedUsers.map(u => `
                <tr style="border-bottom:1px solid var(--border-card);">
                  <td style="padding:0.65rem;font-weight:600;color:var(--text-main);">
                    <div style="display:flex;align-items:center;gap:0.6rem;">
                      <div style="width:30px;height:30px;border-radius:50%;background:var(--brand-blue);color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:700;flex-shrink:0;">${u.name.split(' ').map(n => n[0]).join('').slice(0,2)}</div>
                      ${u.name}
                    </div>
                  </td>
                  <td style="padding:0.65rem;color:var(--text-secondary);font-size:0.82rem;">${u.email}</td>
                  <td style="padding:0.65rem;"><span style="background:var(--bg-card-secondary);color:var(--text-main);padding:0.2rem 0.5rem;border-radius:4px;font-size:0.78rem;border:1px solid var(--border-card);">${u.role}</span></td>
                  <td style="padding:0.65rem;color:var(--text-secondary);font-size:0.82rem;">${u.dept}</td>
                  <td style="padding:0.65rem;">${_statusBadge(u.status)}</td>
                  <td style="padding:0.65rem;color:var(--text-muted);font-size:0.78rem;">${u.lastLogin}</td>
                  <td style="padding:0.65rem;">
                    <div style="display:flex;gap:0.4rem;">
                      <button class="btn" style="padding:0.2rem 0.4rem;font-size:0.72rem;background:var(--bg-card-secondary);" title="Edit user" onclick="window._openEditUserModal('${u.id}')"><i data-lucide="edit-2" style="width:11px;height:11px;"></i></button>
                      <button class="btn" style="padding:0.2rem 0.4rem;font-size:0.72rem;background:${u.status === 'Active' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)'};color:${u.status === 'Active' ? '#f59e0b' : '#22c55e'};border-color:${u.status === 'Active' ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.3)'};" title="${u.status === 'Active' ? 'Deactivate' : 'Activate'} user" onclick="window.toggleUserStatus('${u.id}')"><i data-lucide="${u.status === 'Active' ? 'user-x' : 'user-check'}" style="width:11px;height:11px;"></i></button>
                      <button class="btn" style="padding:0.2rem 0.4rem;font-size:0.72rem;background:rgba(239,68,68,0.1);color:#ef4444;border-color:rgba(239,68,68,0.3);" title="Delete user" onclick="window._confirmDeleteUser('${u.id}')"><i data-lucide="trash-2" style="width:11px;height:11px;"></i></button>
                    </div>
                  </td>
                </tr>`).join('')}
          </tbody>
        </table>
      </div>
      ${window.renderPagination(filteredUsers.length, currentPage, pageSize, 'user-management')}
    </div>`;
}

// User modal helpers
window._openAddUserModal = function() {
  openModal({
    title: 'Create System User & Login Authorization',
    bodyHtml: `
      <div class="form-row"><label>Full Name <span style="color:#ef4444;">*</span></label><input id="nu-name" type="text" placeholder="e.g. Budi Santoso" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Email Address <span style="color:#ef4444;">*</span></label><input id="nu-email" type="email" placeholder="budi@gan.co.id" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Username / Login ID</label><input id="nu-username" type="text" placeholder="e.g. budi.s" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Initial Password</label><input id="nu-password" type="password" placeholder="••••••••" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Role <span style="color:#ef4444;">*</span></label><select id="nu-role" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
        <option>Engineer</option><option>Project Manager</option><option>Inspector</option><option>Viewer</option><option>Admin</option>
      </select></div>
      <div class="form-row"><label>Department</label><input id="nu-dept" type="text" placeholder="Mechanical / Electrical" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div style="margin-top:0.75rem;padding:0.6rem;background:rgba(37,99,235,0.08);border:1px solid rgba(37,99,235,0.2);border-radius:6px;font-size:0.78rem;color:var(--text-secondary);">
        <i data-lucide="shield-check" style="width:13px;height:13px;display:inline;vertical-align:-2px;color:var(--brand-blue);"></i>
        Users created with role <strong>Engineer</strong> or <strong>Project Manager</strong> are automatically granted active login credentials.
      </div>`,
    confirmText: 'Create User & Issue Credentials',
    onConfirm: (overlay) => {
      const name  = overlay.querySelector('#nu-name')?.value?.trim();
      const email = overlay.querySelector('#nu-email')?.value?.trim();
      const role  = overlay.querySelector('#nu-role')?.value;
      const dept  = overlay.querySelector('#nu-dept')?.value?.trim();
      const result = window.createUser({ name, email, role, dept });
      if (!result.ok) { _showFormError(overlay, result.error); return false; }
      showToast(`User "${name}" (${role}) created & credentials authorized.`, 'success');
      window.renderApp();
    }
  });
};

window._openEditUserModal = function(userId) {
  const u = window.appState.users.find(u => u.id === userId);
  if (!u) return showToast('User not found.', 'danger');
  openModal({
    title: `Edit User: ${u.name}`,
    bodyHtml: `
      <div class="form-row"><label>Full Name</label><input id="eu-name" type="text" value="${u.name}" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Email</label><input type="text" value="${u.email}" readonly style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-muted);cursor:not-allowed;"></div>
      <div class="form-row"><label>Role</label><select id="eu-role" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
        ${['Viewer','Engineer','Inspector','Project Manager','Admin'].map(r => `<option ${r === u.role ? 'selected' : ''}>${r}</option>`).join('')}
      </select></div>
      <div class="form-row"><label>Department</label><input id="eu-dept" type="text" value="${u.dept}" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>`,
    confirmText: 'Save Changes',
    onConfirm: (overlay) => {
      const name = overlay.querySelector('#eu-name')?.value?.trim();
      const role = overlay.querySelector('#eu-role')?.value;
      const dept = overlay.querySelector('#eu-dept')?.value?.trim();
      const result = window.updateUser(userId, { name, role, dept });
      if (!result.ok) { _showFormError(overlay, result.error); return false; }
      showToast('User updated successfully.', 'success');
      window.renderApp();
    }
  });
};

window._confirmDeleteUser = function(userId) {
  const u = window.appState.users.find(u => u.id === userId);
  openModal({
    title: `Delete User: ${u?.name}`,
    bodyHtml: `<div style="padding:1rem;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:6px;"><p style="margin:0;font-size:0.9rem;color:var(--text-main);">Are you sure you want to delete user <strong>${u?.name}</strong> (${u?.email})?</p><p style="margin:0.5rem 0 0;font-size:0.8rem;color:var(--text-muted);">This action cannot be undone.</p></div>`,
    confirmText: 'Delete User',
    confirmClass: 'btn-danger',
    onConfirm: () => {
      const result = window.deleteUser(userId);
      if (!result.ok) { showToast(result.error, 'danger'); return false; }
      showToast(`User "${u?.name}" deleted.`, 'success');
      window.renderApp();
    }
  });
};

// Project Modal Helpers
window._openAddProjectModal = function() {
  openModal({
    title: 'Add New Project',
    bodyHtml: `
      <div class="form-row"><label>Project Code <span style="color:#ef4444;">*</span></label><input id="np-code" type="text" placeholder="e.g. PRJ-03" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Project Name <span style="color:#ef4444;">*</span></label><input id="np-name" type="text" placeholder="e.g. Project 3 — Substation Expansion" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Client Name</label><input id="np-client" type="text" value="PT. Global Adimitra Nusaabadi" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Status</label><select id="np-status" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
        <option>Active</option><option>Planning</option><option>Completed</option>
      </select></div>`,
    confirmText: 'Add Project',
    onConfirm: (overlay) => {
      const code   = overlay.querySelector('#np-code')?.value?.trim();
      const name   = overlay.querySelector('#np-name')?.value?.trim();
      const client = overlay.querySelector('#np-client')?.value?.trim();
      const status = overlay.querySelector('#np-status')?.value;
      const result = window.createProject({ code, name, client, status });
      if (!result.ok) { _showFormError(overlay, result.error); return false; }
      showToast(`Project "${name}" created successfully.`, 'success');
      window.renderApp();
    }
  });
};

window._openEditProjectModal = function(projectId) {
  const prj = window.appState.projects.find(p => p.id === projectId);
  if (!prj) return showToast('Project not found.', 'danger');
  openModal({
    title: `Edit Project: ${prj.name}`,
    bodyHtml: `
      <div class="form-row"><label>Project Code</label><input type="text" value="${prj.code}" readonly style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-muted);cursor:not-allowed;"></div>
      <div class="form-row"><label>Project Name <span style="color:#ef4444;">*</span></label><input id="ep-name" type="text" value="${prj.name}" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Client Name</label><input id="ep-client" type="text" value="${prj.client}" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Status</label><select id="ep-status" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
        ${['Active','Planning','Completed'].map(s => `<option ${s === prj.status ? 'selected' : ''}>${s}</option>`).join('')}
      </select></div>`,
    confirmText: 'Save Changes',
    onConfirm: (overlay) => {
      const name   = overlay.querySelector('#ep-name')?.value?.trim();
      const client = overlay.querySelector('#ep-client')?.value?.trim();
      const status = overlay.querySelector('#ep-status')?.value;
      const result = window.updateProject(projectId, { name, client, status });
      if (!result.ok) { _showFormError(overlay, result.error); return false; }
      showToast('Project updated successfully.', 'success');
      window.renderApp();
    }
  });
};

window._confirmDeleteProject = function(projectId) {
  const prj = window.appState.projects.find(p => p.id === projectId);
  if (!prj) return showToast('Project not found.', 'danger');
  openModal({
    title: `Delete Project: ${prj.name}`,
    bodyHtml: `<div style="padding:1rem;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:6px;"><p style="margin:0;font-size:0.9rem;color:var(--text-main);">Are you sure you want to delete project <strong>${prj.name}</strong> (${prj.code})?</p><p style="margin:0.5rem 0 0;font-size:0.8rem;color:var(--text-muted);">This action cannot be undone.</p></div>`,
    confirmText: 'Delete Project',
    confirmClass: 'btn-danger',
    onConfirm: () => {
      const result = window.deleteProject(projectId);
      if (!result.ok) { showToast(result.error, 'danger'); return false; }
      showToast(`Project "${prj.name}" deleted.`, 'success');
      window.renderApp();
    }
  });
};

// ================================================================
// PROJECT SETTINGS (read-only display of locked KPI + CxL definitions)
// ================================================================
function renderProjectSettings() {
  const p = projectIdentity;
  const kpi = window.appState.kpi;
  return `
    <div style="display:grid;grid-template-columns:1fr;gap:1.5rem;">
      <div class="dashboard-card">
        <h2 class="card-top-title" style="margin-bottom:1.5rem;border-bottom:1px solid var(--border-card);padding-bottom:0.5rem;">Project Information</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem;">
          ${[['Project Name',p.name],['Full Name',p.fullName],['Client',p.client],['Location','Jakarta, Indonesia'],['Start Date',kpi.startDate],['End Date',kpi.endDate],['Reporting Week',kpi.reportingWeek],['Current Phase',kpi.currentPhase + ' Startup']].map(([label,val]) => `
            <div style="display:flex;flex-direction:column;gap:0.4rem;">
              <label style="color:var(--text-secondary);font-size:0.85rem;font-weight:600;">${label}</label>
              <input type="text" value="${val}" readonly style="padding:0.6rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-muted);cursor:not-allowed;font-size:0.88rem;">
            </div>`).join('')}
        </div>
        <div style="margin-top:1.25rem;padding:0.75rem;background:rgba(37,99,235,0.08);border:1px solid rgba(37,99,235,0.2);border-radius:6px;font-size:0.8rem;color:var(--text-secondary);">
          <i data-lucide="lock" style="width:13px;height:13px;display:inline;vertical-align:middle;color:var(--brand-blue);"></i>
          Project KPI values are locked per business baseline. Contact the Project Manager to update these values.
        </div>
        <div style="margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid var(--border-card);">
          <h3 style="margin:0 0 0.5rem;font-size:0.95rem;color:#ef4444;display:flex;align-items:center;gap:0.5rem;">
            <i data-lucide="rotate-ccw" style="width:16px;height:16px;"></i> Reset Demo Data
          </h3>
          <p style="margin:0 0 0.75rem;font-size:0.82rem;color:var(--text-secondary);">Restore the application to its original demo baseline. All CRUD changes made during this session will be permanently removed from local storage.</p>
          <button class="btn" style="background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.3);display:flex;align-items:center;gap:0.5rem;font-weight:600;" onclick="window.resetDemoData()">
            <i data-lucide="rotate-ccw" style="width:14px;height:14px;"></i> \u26a0 Reset Demo Data (Local Storage)
          </button>
        </div>
      </div>
      <!-- Project CRUD & Multi-Project Directory Card -->
      <div class="dashboard-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;border-bottom:1px solid var(--border-card);padding-bottom:0.5rem;flex-wrap:wrap;gap:0.5rem;">
          <h2 class="card-top-title" style="margin:0;">Project Directory &amp; Management (CRUD)</h2>
          <button class="btn btn-primary" style="display:flex;align-items:center;gap:0.4rem;" onclick="window._openAddProjectModal()">
            <i data-lucide="plus" style="width:14px;height:14px;"></i> Add Project
          </button>
        </div>
        <div class="table-responsive-wrapper">
          <table class="summary-table" style="width:100%;text-align:left;border-collapse:collapse;">
            <thead>
              <tr style="border-bottom:1px solid var(--border-card);background:var(--bg-card-secondary);">
                <th style="padding:0.65rem;color:var(--text-secondary);">Code</th>
                <th style="padding:0.65rem;color:var(--text-secondary);">Project Name</th>
                <th style="padding:0.65rem;color:var(--text-secondary);">Client</th>
                <th style="padding:0.65rem;color:var(--text-secondary);">Status</th>
                <th style="padding:0.65rem;color:var(--text-secondary);">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${(window.appState.projects || []).map(prj => `
                <tr style="border-bottom:1px solid var(--border-card);">
                  <td style="padding:0.65rem;font-weight:700;color:var(--brand-blue);font-size:0.82rem;">${prj.code}</td>
                  <td style="padding:0.65rem;font-weight:600;color:var(--text-main);font-size:0.85rem;">
                    ${prj.name}
                    ${window.appState.selectedProjectId === prj.id ? '<span class="status-badge badge-blue" style="margin-left:0.4rem;font-size:0.68rem;">Active Context</span>' : ''}
                  </td>
                  <td style="padding:0.65rem;color:var(--text-secondary);font-size:0.82rem;">${prj.client}</td>
                  <td style="padding:0.65rem;">${_statusBadge(prj.status || 'Active')}</td>
                  <td style="padding:0.65rem;">
                    <div style="display:flex;gap:0.4rem;">
                      <button class="btn" style="padding:0.2rem 0.4rem;font-size:0.72rem;background:var(--bg-card-secondary);" title="Edit project" onclick="window._openEditProjectModal('${prj.id}')"><i data-lucide="edit-2" style="width:11px;height:11px;"></i></button>
                      <button class="btn" style="padding:0.2rem 0.4rem;font-size:0.72rem;background:rgba(239,68,68,0.1);color:#ef4444;border-color:rgba(239,68,68,0.3);" title="Delete project" onclick="window._confirmDeleteProject('${prj.id}')"><i data-lucide="trash-2" style="width:11px;height:11px;"></i></button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div class="dashboard-card">
        <h2 class="card-top-title" style="margin-bottom:1rem;border-bottom:1px solid var(--border-card);padding-bottom:0.5rem;">CxL Phase Definitions</h2>
        <div class="table-responsive-wrapper">
          <table class="summary-table" style="width:100%;text-align:left;border-collapse:collapse;">
            <thead><tr style="border-bottom:1px solid var(--border-card);background:var(--bg-card-secondary);">
              <th style="padding:0.65rem;color:var(--text-secondary);">Phase</th>
              <th style="padding:0.65rem;color:var(--text-secondary);">Full Name</th>
              <th style="padding:0.65rem;color:var(--text-secondary);">Checklist Items</th>
              <th style="padding:0.65rem;color:var(--text-secondary);">Approval Status</th>
            </tr></thead>
            <tbody>
              ${['CxL1','CxL2','CxL3','CxL4','CxL5'].map(phase => {
                const approval = window.appState.phaseApprovalState[phase];
                const checklist = window.CXL_CHECKLISTS?.[phase] || [];
                return `<tr style="border-bottom:1px solid var(--border-card);">
                  <td style="padding:0.65rem;font-weight:700;color:var(--brand-blue);">${phase}</td>
                  <td style="padding:0.65rem;color:var(--text-main);font-size:0.85rem;">${{CxL1:'Factory Acceptance',CxL2:'Pre-Commissioning',CxL3:'Startup',CxL4:'Functional Testing',CxL5:'Integrated & Handover'}[phase]}</td>
                  <td style="padding:0.65rem;color:var(--text-secondary);font-size:0.85rem;">${checklist.length} requirements</td>
                  <td style="padding:0.65rem;">${_statusBadge(approval?.status || 'Not Started')}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
}

// ================================================================
// ACCOUNT SETTINGS — Profile Photo Upload & Security
// ================================================================
function renderAccountSettings() {
  const user = JSON.parse(sessionStorage.getItem('gantt_user') || '{"name":"Admin User","role":"Project Manager","email":"admin@gan.co.id"}');
  const nameParts = (user.name || 'Admin User').trim().split(' ');
  const initials = nameParts.length > 1 
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : (nameParts[0][0] || 'A').toUpperCase();

  const avatarDisplay = user.avatarUrl
    ? `<img src="${user.avatarUrl}" alt="Avatar" style="width:96px;height:96px;border-radius:50%;object-fit:cover;box-shadow:0 4px 14px rgba(37,99,235,0.3);border:2px solid var(--brand-blue);" />`
    : `<div style="width:96px;height:96px;border-radius:50%;background:linear-gradient(135deg, #2563eb, #8b5cf6);color:#fff;display:flex;align-items:center;justify-content:center;font-size:2.2rem;font-weight:700;box-shadow:0 4px 14px rgba(37,99,235,0.3);border:2px solid rgba(255,255,255,0.2);">${initials}</div>`;

  return `
    <div class="dashboard-card" style="max-width:850px;margin:0 auto;">
      <h2 class="card-top-title" style="margin-bottom:1.5rem;border-bottom:1px solid var(--border-card);padding-bottom:0.5rem;">Account Settings</h2>
      
      <div style="display:flex;gap:2rem;flex-wrap:wrap;">
        <!-- Left: Profile Photo & Card Info -->
        <div style="flex:1;min-width:250px;display:flex;flex-direction:column;align-items:center;padding:1.75rem 1.25rem;background:var(--bg-card-secondary);border-radius:12px;border:1px solid var(--border-card);text-align:center;">
          
          <div style="position:relative;margin-bottom:1.25rem;">
            ${avatarDisplay}
            <button onclick="document.getElementById('avatar-file-input').click()" 
              style="position:absolute;bottom:0;right:0;width:32px;height:32px;border-radius:50%;background:var(--brand-blue);color:#fff;border:2px solid var(--bg-card);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.2);"
              title="Upload Foto Profil Baru">
              <i data-lucide="camera" style="width:16px;height:16px;"></i>
            </button>
          </div>

          <input type="file" id="avatar-file-input" accept="image/*" style="display:none;" onchange="window._handleProfilePhotoUpload(event)">

          <h3 style="margin:0 0 0.25rem;color:var(--text-main);font-weight:700;">${window.escapeHtml(user.name || 'Admin User')}</h3>
          <p style="margin:0 0 0.75rem;color:var(--text-secondary);font-size:0.85rem;">${window.escapeHtml(user.email || 'admin@gan.co.id')}</p>
          <span style="background:rgba(34,197,94,0.1);color:#22c55e;border:1px solid #22c55e;padding:0.25rem 0.75rem;border-radius:12px;font-size:0.8rem;font-weight:700;margin-bottom:1.25rem;">${window.escapeHtml(user.role || 'Project Manager')}</span>

          <div style="display:flex;flex-direction:column;gap:0.5rem;width:100%;">
            <button class="btn btn-primary" onclick="document.getElementById('avatar-file-input').click()" style="display:flex;align-items:center;justify-content:center;gap:0.4rem;font-size:0.8rem;width:100%;">
              <i data-lucide="upload" style="width:14px;height:14px;"></i> Upload Foto Profil
            </button>
            
            ${user.avatarUrl ? `
              <button class="btn" onclick="window.removeProfilePhoto()" style="background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.3);font-size:0.8rem;width:100%;display:flex;align-items:center;justify-content:center;gap:0.4rem;">
                <i data-lucide="trash-2" style="width:14px;height:14px;"></i> Hapus Foto
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Right: Profile Info, Password & Theme -->
        <div style="flex:2;min-width:280px;display:flex;flex-direction:column;gap:1.5rem;">
          <!-- Section 1: User Name & Info Edit -->
          <div style="background:var(--bg-card-secondary);padding:1.25rem;border-radius:10px;border:1px solid var(--border-card);">
            <h4 style="margin:0 0 1rem;color:var(--text-main);font-size:1rem;display:flex;align-items:center;gap:0.5rem;">
              <i data-lucide="user" style="width:16px;height:16px;color:var(--brand-blue);"></i> Profile Information
            </h4>
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
              <div>
                <label style="color:var(--text-secondary);font-size:0.85rem;font-weight:600;">Nama Lengkap / Username <span style="color:#ef4444;">*</span></label>
                <input id="user-display-name" type="text" value="${window.escapeHtml(user.name || '')}" placeholder="Masukkan Nama Lengkap" style="width:100%;padding:0.55rem;border:1px solid var(--border-card);border-radius:6px;background:var(--bg-card);color:var(--text-main);margin-top:0.25rem;box-sizing:border-box;font-size:0.9rem;font-weight:600;">
              </div>
              <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
                <div style="flex:1;min-width:140px;">
                  <label style="color:var(--text-secondary);font-size:0.85rem;font-weight:600;">Email</label>
                  <input type="text" value="${window.escapeHtml(user.email || 'admin@gan.co.id')}" disabled style="width:100%;padding:0.55rem;border:1px solid var(--border-card);border-radius:6px;background:var(--bg-card);color:var(--text-muted);margin-top:0.25rem;box-sizing:border-box;opacity:0.75;cursor:not-allowed;">
                </div>
                <div style="flex:1;min-width:140px;">
                  <label style="color:var(--text-secondary);font-size:0.85rem;font-weight:600;">Role System</label>
                  <input type="text" value="${window.escapeHtml(user.role || 'Project Manager')}" disabled style="width:100%;padding:0.55rem;border:1px solid var(--border-card);border-radius:6px;background:var(--bg-card);color:var(--text-muted);margin-top:0.25rem;box-sizing:border-box;opacity:0.75;cursor:not-allowed;">
                </div>
              </div>
              <div id="name-update-error" style="display:none;color:#ef4444;font-size:0.8rem;"></div>
              <button class="btn btn-primary" style="align-self:flex-start;display:flex;align-items:center;gap:0.4rem;margin-top:0.25rem;" onclick="window._handleUserNameUpdate()">
                <i data-lucide="check" style="width:14px;height:14px;"></i> Simpan Nama User
              </button>
            </div>
          </div>

          <!-- Section 2: Password & Security -->
          <div>
            <h4 style="margin:0 0 1rem;color:var(--text-main);font-size:1rem;display:flex;align-items:center;gap:0.5rem;">
              <i data-lucide="lock" style="width:16px;height:16px;color:var(--text-muted);"></i> Password &amp; Security
            </h4>
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
              <div><label style="color:var(--text-secondary);font-size:0.85rem;">Current Password</label>
                <input id="pwd-current" type="password" placeholder="Enter current password" style="width:100%;padding:0.55rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card);color:var(--text-main);margin-top:0.25rem;box-sizing:border-box;"></div>
              <div style="display:flex;gap:0.75rem;">
                <div style="flex:1;"><label style="color:var(--text-secondary);font-size:0.85rem;">New Password</label>
                  <input id="pwd-new" type="password" placeholder="New password" style="width:100%;padding:0.55rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card);color:var(--text-main);margin-top:0.25rem;box-sizing:border-box;"></div>
                <div style="flex:1;"><label style="color:var(--text-secondary);font-size:0.85rem;">Confirm Password</label>
                  <input id="pwd-confirm" type="password" placeholder="Confirm password" style="width:100%;padding:0.55rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card);color:var(--text-main);margin-top:0.25rem;box-sizing:border-box;"></div>
              </div>
              <div id="pwd-error" style="display:none;color:#ef4444;font-size:0.8rem;"></div>
              <button class="btn btn-primary" style="align-self:flex-start;" onclick="window._handlePasswordUpdate()">Update Password</button>
            </div>
          </div>

          <!-- Section 3: Theme Preference -->
          <div style="border-top:1px solid var(--border-card);padding-top:1.25rem;">
            <h4 style="margin:0 0 0.75rem;color:var(--text-main);font-size:1rem;display:flex;align-items:center;gap:0.5rem;">
              <i data-lucide="moon" style="width:16px;height:16px;color:var(--text-muted);"></i> Theme Preference
            </h4>
            <p style="font-size:0.85rem;color:var(--text-secondary);margin:0 0 0.75rem;">Uses the global theme toggle in the top-right header.</p>
            <div style="display:flex;gap:0.75rem;">
              <div onclick="document.body.classList.add('dark-mode');window.renderApp();" style="padding:0.75rem;border:2px solid var(--brand-blue);border-radius:6px;background:var(--bg-card);display:flex;flex-direction:column;align-items:center;gap:0.4rem;cursor:pointer;flex:1;">
                <div style="width:36px;height:24px;background:#1e1e2d;border-radius:4px;border:1px solid #333;"></div>
                <span style="color:var(--text-main);font-weight:600;font-size:0.8rem;">Dark Mode</span>
              </div>
              <div onclick="document.body.classList.remove('dark-mode');window.renderApp();" style="padding:0.75rem;border:1px solid var(--border-card);border-radius:6px;background:var(--bg-card);display:flex;flex-direction:column;align-items:center;gap:0.4rem;cursor:pointer;flex:1;opacity:0.75;">
                <div style="width:36px;height:24px;background:#f3f4f6;border-radius:4px;border:1px solid #ccc;"></div>
                <span style="color:var(--text-secondary);font-size:0.8rem;">Light Mode</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

window._handleUserNameUpdate = function() {
  const nameInput = document.getElementById('user-display-name');
  const errEl = document.getElementById('name-update-error');
  const newName = nameInput ? nameInput.value.trim() : '';

  if (!newName) {
    if (errEl) { errEl.textContent = 'Nama user tidak boleh kosong.'; errEl.style.display = 'block'; }
    return;
  }

  try {
    const user = JSON.parse(sessionStorage.getItem('gantt_user') || '{"name":"Admin User","role":"Project Manager","email":"admin@gan.co.id"}');
    const oldName = user.name;
    user.name = newName;
    sessionStorage.setItem('gantt_user', JSON.stringify(user));

    if (window.appState && Array.isArray(window.appState.users)) {
      const match = window.appState.users.find(u => u.email === user.email);
      if (match) {
        match.name = newName;
      }
    }

    if (window.addAuditLog) {
      window.addAuditLog(newName, 'UPDATE', 'User', user.email || 'user', `Nama user diubah dari "${oldName}" menjadi "${newName}"`);
    }

    if (window.persistState) window.persistState();
    if (errEl) errEl.style.display = 'none';
    showToast(`Nama user berhasil diperbarui menjadi "${newName}"!`, 'success');
    window.renderApp();
  } catch (err) {
    console.error('Failed to update user name:', err);
    if (errEl) { errEl.textContent = 'Gagal memperbarui nama user.'; errEl.style.display = 'block'; }
  }
};

window._handleProfilePhotoUpload = function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Silakan pilih file gambar yang valid (JPG, PNG, WebP).', 'danger');
    return;
  }
  if (file.size > 3 * 1024 * 1024) {
    showToast('Ukuran foto terlalu besar. Maksimal 3MB.', 'warning');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    window._saveUserProfilePhoto(dataUrl);
  };
  reader.readAsDataURL(file);
};

window._saveUserProfilePhoto = function(avatarUrl) {
  try {
    const user = JSON.parse(sessionStorage.getItem('gantt_user') || '{"name":"Admin User","role":"Project Manager","email":"admin@gan.co.id"}');
    user.avatarUrl = avatarUrl;
    sessionStorage.setItem('gantt_user', JSON.stringify(user));

    if (window.appState && Array.isArray(window.appState.users)) {
      const match = window.appState.users.find(u => u.email === user.email);
      if (match) {
        match.avatarUrl = avatarUrl;
      }
    }

    if (window.persistState) window.persistState();
    showToast('Foto profil berhasil diperbarui!', 'success');
    window.renderApp();
  } catch (err) {
    console.error('Failed to save profile photo:', err);
    showToast('Gagal memperbarui foto profil.', 'danger');
  }
};

window.removeProfilePhoto = function() {
  window._saveUserProfilePhoto('');
};

window._handlePasswordUpdate = function() {
  const current = document.getElementById('pwd-current')?.value;
  const newPwd  = document.getElementById('pwd-new')?.value;
  const confirm = document.getElementById('pwd-confirm')?.value;
  const errEl   = document.getElementById('pwd-error');
  if (!current || !newPwd || !confirm) { errEl.textContent = 'All password fields are required.'; errEl.style.display='block'; return; }
  if (newPwd.length < 6) { errEl.textContent = 'New password must be at least 6 characters.'; errEl.style.display='block'; return; }
  if (newPwd !== confirm) { errEl.textContent = 'New passwords do not match.'; errEl.style.display='block'; return; }
  errEl.style.display='none';
  showToast('Password updated for this session. (Note: This is a frontend prototype — no server authentication.)', 'success', 4000);
  document.getElementById('pwd-current').value='';
  document.getElementById('pwd-new').value='';
  document.getElementById('pwd-confirm').value='';
};
