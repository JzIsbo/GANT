export function renderDocumentsView(subRoute = 'documents') {
  const activeTab = subRoute || 'documents';
  const s = window.appState;

  const tabs = [
    { id: 'documents',         label: 'Documents',       icon: 'file-text' },
    { id: 'nas-files',         label: 'NAS File Manager', icon: 'hard-drive' },
    { id: 'shared-files',      label: 'Shared Files',    icon: 'share-2' },
    { id: 'import-documents',  label: 'Import Documents', icon: 'file-up' }
  ];

  const tabsHtml = `
    <div class="view-tabs">
      ${tabs.map(tab => `
        <span class="view-tab ${activeTab === tab.id ? 'active' : ''}" data-route="${tab.id}">
          <i data-lucide="${tab.icon}" style="width:16px;height:16px;"></i> ${tab.label}
        </span>`).join('')}
    </div>`;

  const statusBadge = (status) => {
    const map = {
      'Approved':        { bg:'rgba(16,185,129,0.1)',  color:'#10b981' },
      'Pending Review':  { bg:'rgba(59,130,246,0.1)',  color:'#3b82f6' },
      'Rejected':        { bg:'rgba(239,68,68,0.1)',   color:'#ef4444' },
      'Revise & Resubmit':{ bg:'rgba(245,158,11,0.1)',color:'#f59e0b' },
      'Pending':         { bg:'rgba(245,158,11,0.1)', color:'#f59e0b' },
      'Under Review':    { bg:'rgba(59,130,246,0.1)',  color:'#3b82f6' },
      'Imported':        { bg:'rgba(139,92,246,0.1)',  color:'#8b5cf6' }
    };
    const m = map[status] || { bg:'var(--bg-card-secondary)', color:'var(--text-secondary)' };
    return `<span style="padding:4px 8px;border-radius:999px;font-size:12px;font-weight:500;background:${m.bg};color:${m.color};">${status}</span>`;
  };

  let content = '';
  if (activeTab === 'documents')        content = renderDocumentsTab(s, statusBadge);
  else if (activeTab === 'nas-files')   content = renderNasFilesTab();
  else if (activeTab === 'shared-files') content = renderSharedFilesTab(s);
  else if (activeTab === 'import-documents') content = renderImportTab(s);
  else content = renderDocumentsTab(s, statusBadge);

  return `
    <div class="documents-view-container" style="animation:fadeIn 0.3s ease-in-out;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;flex-wrap:wrap;gap:0.75rem;">
        <h1 style="font-size:1.4rem;font-weight:700;margin:0;color:var(--text-main);">Documents &amp; Files</h1>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
          <button class="btn" style="display:flex;align-items:center;gap:0.4rem;" onclick="document.getElementById('global-search-input')?.focus()">
            <i data-lucide="search" style="width:14px;height:14px;"></i> Global Search
          </button>
          <button class="btn btn-primary" style="display:flex;align-items:center;gap:0.4rem;" onclick="window._openUploadDocModal()">
            <i data-lucide="plus" style="width:14px;height:14px;"></i> New Document
          </button>
        </div>
      </div>
      ${tabsHtml}
      <div class="tab-content">${content}</div>
    </div>`;
}

// ── Upload Document Modal ─────────────────────────────────────────
window._openUploadDocModal = function() {
  const eqOpts = (window.appState.equipment || []).slice(0, 30).map(e => `<option value="${e.id}">${e.id}</option>`).join('');
  openModal({
    title: 'Upload Commissioning Document',
    bodyHtml: `
      <div class="form-row"><label>Document Title <span style="color:#ef4444;">*</span></label>
        <input id="ud-title" type="text" placeholder="e.g. CxL3 Functional Test Report" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
      </div>
      <div class="form-row"><label>Equipment ID <span style="color:#ef4444;">*</span></label>
        <select id="ud-eq" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
          <option value="">— Select Equipment —</option>
          ${eqOpts}
          <option value="Multiple">Multiple / General</option>
        </select>
      </div>
      <div class="form-row"><label>Document Type</label>
        <select id="ud-type" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
          <option>Test Procedure</option><option>FAT Report</option><option>Checklist</option>
          <option>Manual</option><option>Protocol</option><option>Report</option><option>Archive</option>
        </select>
      </div>
      <div class="form-row"><label>Notes</label>
        <input id="ud-notes" type="text" placeholder="Optional notes" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
      </div>
      <div class="form-row"><label>Select File <span style="font-size:0.75rem;color:var(--text-muted);">(session-only — no server storage)</span></label>
        <input id="ud-file" type="file" style="width:100%;font-size:0.85rem;">
      </div>`,
    confirmText: 'Upload Document',
    onConfirm: (overlay) => {
      const title  = overlay.querySelector('#ud-title')?.value?.trim();
      const eq     = overlay.querySelector('#ud-eq')?.value;
      const type   = overlay.querySelector('#ud-type')?.value;
      const notes  = overlay.querySelector('#ud-notes')?.value?.trim();
      const fileEl = overlay.querySelector('#ud-file');
      const file   = fileEl?.files?.[0];
      if (!title) {
        let err = overlay.querySelector('#ud-err');
        if (!err) { err = document.createElement('div'); err.id = 'ud-err'; err.style.cssText = 'color:#ef4444;font-size:0.8rem;margin-top:0.5rem;'; overlay.querySelector('.modal-body')?.appendChild(err); }
        err.textContent = '⚠ Document Title is required.';
        return false;
      }
      if (!eq) {
        let err = overlay.querySelector('#ud-err');
        if (!err) { err = document.createElement('div'); err.id = 'ud-err'; err.style.cssText = 'color:#ef4444;font-size:0.8rem;margin-top:0.5rem;'; overlay.querySelector('.modal-body')?.appendChild(err); }
        err.textContent = '⚠ Equipment ID is required.';
        return false;
      }
      const result = window.createDocument({
        name: title,
        type,
        equipment: eq,
        size: file ? (file.size > 1048576 ? (file.size / 1048576).toFixed(1) + ' MB' : Math.round(file.size / 1024) + ' KB') : '—',
        notes
      });
      if (!result.ok) { showToast(result.error, 'danger'); return false; }
      showToast(`Document "${title}" uploaded successfully.`, 'success');
      window.renderApp();
    }
  });
};

// ================================================================
// DOCUMENTS TAB — reads from appState.documents
// ================================================================
function renderDocumentsTab(s, statusBadge) {
  const df = s.documentFilters || { type: 'all', status: 'all', equipment: 'all', search: '' };
  const docs = s.documents;

  // Derive unique types and equipment from live state
  const allTypes = [...new Set(docs.map(d => d.type).filter(Boolean))].sort();
  const allEquip = [...new Set(docs.map(d => d.equipment).filter(Boolean))].sort();

  const filtered = docs.filter(d => {
    const typeOk  = df.type === 'all' || d.type === df.type;
    const statOk  = df.status === 'all' || d.status === df.status;
    const eqOk    = df.equipment === 'all' || d.equipment === df.equipment;
    const searchOk = !df.search || d.name.toLowerCase().includes(df.search.toLowerCase()) || (d.equipment || '').toLowerCase().includes(df.search.toLowerCase()) || d.id.toLowerCase().includes(df.search.toLowerCase());
    return typeOk && statOk && eqOk && searchOk;
  });

  const currentPage = window.appPageState['documents'] || 1;
  const pageSize = 8;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Derive stat counts from appState
  const statApproved = docs.filter(d => d.status === 'Approved').length;
  const statPending  = docs.filter(d => d.status === 'Pending Review' || d.status === 'Pending').length;
  const statRejected = docs.filter(d => d.status === 'Rejected').length;
  const statRevise   = docs.filter(d => d.status === 'Revise & Resubmit').length;

  return `
    <div class="five-stat-boxes" style="margin-bottom:1.5rem;">
      ${[
        { label:'Total Documents', value: docs.length, color:'var(--text-main)' },
        { label:'Approved', value: statApproved, color:'#10b981' },
        { label:'Pending Review', value: statPending, color:'#3b82f6' },
        { label:'Rejected', value: statRejected, color:'#ef4444' },
        { label:'Revise & Resubmit', value: statRevise, color:'#f59e0b' }
      ].map(stat => `
        <div class="dashboard-card" style="padding:16px;border-radius:8px;">
          <div style="color:var(--text-secondary);font-size:13px;margin-bottom:8px;">${stat.label}</div>
          <div style="font-size:24px;font-weight:700;color:${stat.color};">${stat.value}</div>
        </div>`).join('')}
    </div>

    <div class="dashboard-card" style="padding:20px;border-radius:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:0.75rem;">
        <h3 class="card-top-title" style="margin:0;">Document Repository — ${filtered.length} of ${docs.length}</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
          <div style="position:relative;">
            <i data-lucide="search" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:13px;height:13px;color:var(--text-muted);pointer-events:none;"></i>
            <input id="doc-search-input" type="text" placeholder="Search docs..." value="${df.search || ''}"
              style="padding:0.4rem 0.5rem 0.4rem 1.8rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);width:160px;"
              oninput="window.setDocumentFilter('search', this.value)">
          </div>
          <select class="filter-select" onchange="window.setDocumentFilter('type', this.value === 'All Types' ? 'all' : this.value)">
            <option value="all" ${df.type === 'all' ? 'selected' : ''}>All Types</option>
            ${allTypes.map(t => `<option value="${t}" ${df.type === t ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
          <select class="filter-select" onchange="window.setDocumentFilter('status', this.value === 'All Statuses' ? 'all' : this.value)">
            <option value="all" ${df.status === 'all' ? 'selected' : ''}>All Statuses</option>
            <option value="Approved" ${df.status === 'Approved' ? 'selected' : ''}>Approved</option>
            <option value="Pending Review" ${df.status === 'Pending Review' ? 'selected' : ''}>Pending Review</option>
            <option value="Rejected" ${df.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
            <option value="Revise & Resubmit" ${df.status === 'Revise & Resubmit' ? 'selected' : ''}>Revise & Resubmit</option>
          </select>
          <select class="filter-select" onchange="window.setDocumentFilter('equipment', this.value === 'All Equipment' ? 'all' : this.value)">
            <option value="all" ${df.equipment === 'all' ? 'selected' : ''}>All Equipment</option>
            ${allEquip.map(e => `<option value="${e}" ${df.equipment === e ? 'selected' : ''}>${e}</option>`).join('')}
          </select>
          <button class="btn btn-primary" style="display:flex;align-items:center;gap:0.4rem;" onclick="window._openUploadDocModal()">
            <i data-lucide="upload" style="width:14px;height:14px;"></i> Upload Document
          </button>
        </div>
      </div>

      <div class="table-responsive-wrapper">
        <table class="summary-table" style="width:100%;border-collapse:collapse;text-align:left;font-size:14px;">
          <thead>
            <tr style="border-bottom:2px solid var(--border-card);color:var(--text-muted);">
              <th style="padding:12px 8px;">Doc ID</th>
              <th style="padding:12px 8px;">Name</th>
              <th style="padding:12px 8px;">Equipment</th>
              <th style="padding:12px 8px;">Type</th>
              <th style="padding:12px 8px;">Status</th>
              <th style="padding:12px 8px;">Date</th>
              <th style="padding:12px 8px;text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${paginated.length === 0
              ? `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-muted);">
                  No documents match the current filters.
                  <button class="btn" style="margin-left:0.5rem;font-size:0.72rem;" onclick="window.setDocumentFilter('type','all');window.setDocumentFilter('status','all');window.setDocumentFilter('equipment','all');window.setDocumentFilter('search','')">Clear Filters</button>
                </td></tr>`
              : paginated.map(doc => `
                <tr style="border-bottom:1px solid var(--border-card);">
                  <td style="padding:12px 8px;font-family:monospace;color:var(--brand-blue);font-size:0.8rem;">${doc.id}</td>
                  <td style="padding:12px 8px;font-weight:500;color:var(--text-main);max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${doc.name}">${doc.name}</td>
                  <td style="padding:12px 8px;color:var(--text-main);">${doc.equipment || '—'}</td>
                  <td style="padding:12px 8px;color:var(--text-secondary);font-size:0.85rem;">${doc.type}</td>
                  <td style="padding:12px 8px;">${statusBadge(doc.status)}</td>
                  <td style="padding:12px 8px;color:var(--text-secondary);font-size:0.85rem;">${doc.date}</td>
                  <td style="padding:12px 8px;">
                    <div style="display:flex;gap:8px;justify-content:flex-end;align-items:center;">
                      <button class="btn" style="padding:3px 8px;font-size:11px;background:var(--bg-card-secondary);" title="View Details"
                        onclick="openModal({ title: '${doc.name.replace(/'/g,'')}', bodyHtml: '<div class=\\'form-row\\'><label>Doc ID</label><span style=\\'font-family:monospace;\\'>${doc.id}</span></div><div class=\\'form-row\\'><label>Equipment</label><span>${doc.equipment || '—'}</span></div><div class=\\'form-row\\'><label>Type</label><span>${doc.type}</span></div><div class=\\'form-row\\'><label>Status</label><span>${doc.status}</span></div><div class=\\'form-row\\'><label>Size</label><span>${doc.size}</span></div><div class=\\'form-row\\'><label>Date</label><span>${doc.date}</span></div><div class=\\'form-row\\'><label>Notes</label><span>${doc.notes || '—'}</span></div><p style=\\'font-size:0.75rem;color:var(--text-muted);margin-top:1rem;\\'>Session-only frontend state. No physical file stored.</p>', confirmText: 'Download', onConfirm: () => window.downloadDocumentBlob('${doc.id}') })">
                        <i data-lucide="eye" style="width:12px;height:12px;"></i>
                      </button>
                      <button class="btn" style="padding:3px 8px;font-size:11px;background:var(--bg-card-secondary);" title="Download" onclick="window.downloadDocumentBlob('${doc.id}')">
                        <i data-lucide="download" style="width:12px;height:12px;"></i>
                      </button>
                      <button class="btn" style="padding:3px 8px;font-size:11px;background:rgba(239,68,68,0.1);color:#ef4444;border-color:rgba(239,68,68,0.3);" title="Delete Document"
                        onclick="openModal({ title: 'Delete Document', bodyHtml: '<p style=\\'font-size:0.9rem;\\'>Delete <strong>${doc.name.replace(/'/g,'')}</strong>?<br><span style=\\'font-size:0.8rem;color:var(--text-muted);\\'>This cannot be undone.</span></p>', confirmText: 'Delete', confirmClass: 'btn-danger', onConfirm: () => { const r = window.deleteDocument('${doc.id}'); if (r.ok) { showToast('Document deleted.','success'); window.renderApp(); } else showToast(r.error,'danger'); } })">
                        <i data-lucide="trash-2" style="width:12px;height:12px;"></i>
                      </button>
                    </div>
                  </td>
                </tr>`).join('')}
          </tbody>
        </table>
      </div>
      ${window.renderPagination(filtered.length, currentPage, pageSize, 'documents')}
    </div>`;
}

// ================================================================
// NAS FILES TAB — informational (no backend)
// ================================================================
function renderNasFilesTab() {
  const nasFiles = [
    { name: '01-Requirements.pdf', type: 'file-text', size: '2.4 MB', date: '2026-08-01', by: 'System' },
    { name: 'Architecture_Diagram.vsdx', type: 'image', size: '1.1 MB', date: '2026-08-05', by: 'J. Smith' },
    { name: 'Commissioning_Plan_v2.docx', type: 'file-text', size: '5.2 MB', date: '2026-08-10', by: 'A. Johnson' },
    { name: 'Site_Photos_Aug', type: 'folder', size: '--', date: '2026-08-11', by: 'M. Davis' },
    { name: 'Test_Data_Export.csv', type: 'table', size: '15.6 MB', date: '2026-08-09', by: 'K. Lee' }
  ];

  return `
    <div class="nas-tab-grid">
      <div class="dashboard-card" style="padding:20px;">
        <div style="margin-bottom:24px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px;">
            <span style="color:var(--text-secondary);">Storage Used</span>
            <span style="font-weight:500;color:var(--text-main);">1.2 TB / 5.0 TB</span>
          </div>
          <div style="width:100%;height:6px;background:var(--bg-card-secondary);border-radius:3px;overflow:hidden;border:1px solid var(--border-card);">
            <div style="width:24%;height:100%;background:var(--brand-blue);border-radius:3px;"></div>
          </div>
          <div style="margin-top:0.5rem;font-size:0.7rem;color:var(--text-muted);font-style:italic;">NAS connectivity unavailable in frontend-only mode.</div>
        </div>
        <h3 style="margin:0 0 16px 0;font-size:12px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">Directory Tree</h3>
        <div style="display:flex;flex-direction:column;gap:10px;font-size:14px;">
          <div style="display:flex;align-items:center;gap:8px;color:var(--text-main);font-weight:500;cursor:pointer;" onclick="showToast('NAS directory navigation is not available in frontend-only mode.','info')">
            <i data-lucide="folder-open" style="width:18px;height:18px;color:var(--brand-blue);"></i> Projects
          </div>
        </div>
      </div>
      <div class="dashboard-card" style="padding:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border-card);flex-wrap:wrap;gap:0.75rem;">
          <div style="font-size:16px;font-weight:500;color:var(--text-main);">
            <span style="color:var(--text-secondary);">Projects / NAS / </span> CxL2-Documents
          </div>
          <div style="display:flex;gap:12px;">
            <button class="btn" onclick="showToast('New Folder: NAS backend not connected. This is a session-only frontend.','info')" style="display:flex;align-items:center;gap:8px;">
              <i data-lucide="folder-plus" style="width:16px;height:16px;"></i> New Folder
              <span style="font-size:0.65rem;opacity:0.7;">[No NAS]</span>
            </button>
            <button class="btn btn-primary" onclick="showToast('File Upload: NAS backend not connected. Use Documents tab for session-only uploads.','info')" style="display:flex;align-items:center;gap:8px;">
              <i data-lucide="upload-cloud" style="width:16px;height:16px;"></i> Upload Files
              <span style="font-size:0.65rem;opacity:0.7;">[No NAS]</span>
            </button>
          </div>
        </div>
        <div style="padding:0.75rem;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.3);border-radius:6px;font-size:0.8rem;color:#f59e0b;margin-bottom:1rem;">
          <i data-lucide="alert-triangle" style="width:14px;height:14px;display:inline;vertical-align:middle;"></i>
          <strong>Session-only frontend mode.</strong> NAS/backend connectivity is not implemented. File listings below are reference data only.
        </div>
        <div class="table-responsive-wrapper">
          <table class="summary-table" style="width:100%;border-collapse:collapse;text-align:left;font-size:14px;">
            <thead>
              <tr style="border-bottom:2px solid var(--border-card);color:var(--text-muted);">
                <th style="padding:12px 8px;">Name</th>
                <th style="padding:12px 8px;">Size</th>
                <th style="padding:12px 8px;">Modified</th>
                <th style="padding:12px 8px;">By</th>
                <th style="padding:12px 8px;text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${nasFiles.map(file => `
                <tr style="border-bottom:1px solid var(--border-card);">
                  <td style="padding:14px 8px;display:flex;align-items:center;gap:12px;font-weight:500;color:var(--text-main);">
                    <i data-lucide="${file.type}" style="width:20px;height:20px;color:${file.type === 'folder' ? 'var(--brand-blue)' : 'var(--text-secondary)'};"></i>
                    ${file.name}
                  </td>
                  <td style="padding:14px 8px;color:var(--text-secondary);">${file.size}</td>
                  <td style="padding:14px 8px;color:var(--text-secondary);">${file.date}</td>
                  <td style="padding:14px 8px;color:var(--text-main);">${file.by}</td>
                  <td style="padding:14px 8px;text-align:right;">
                    <button class="btn" style="padding:2px 8px;font-size:11px;" onclick="showToast('NAS download unavailable \u2014 no backend connected.','info')">
                      <i data-lucide="download" style="width:12px;height:12px;"></i>
                    </button>
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
}

// ================================================================
// SHARED FILES TAB
// ================================================================
function renderSharedFilesTab(s) {
  // Shared links are initialized from state or fallback
  if (!s.sharedLinks) {
    window.appState.sharedLinks = [
      { id: 'SHL-001', name: 'CxL3_Final_Signoff.pdf',       sharedBy: 'J. Smith',   sharedWith: 'Ext. Contractor, +2 others', date: '2026-08-11', expiry: '2026-08-18' },
      { id: 'SHL-002', name: 'Substation_Drawings_Rev4.zip', sharedBy: 'A. Johnson', sharedWith: 'Design Team',                date: '2026-08-10', expiry: 'Never' },
      { id: 'SHL-003', name: 'Weekly_Progress_Report.xlsx',  sharedBy: 'M. Davis',   sharedWith: 'Client Rep',                date: '2026-08-08', expiry: '2026-08-15' }
    ];
  }
  const links = window.appState.sharedLinks || [];

  return `
    <div class="dashboard-card" style="padding:20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
        <h3 class="card-top-title" style="margin:0;">Active Shared Links — ${links.length} active</h3>
        <span style="font-size:0.75rem;color:var(--text-muted);">Copy Link copies a placeholder URL. Revoke removes the share record from session state.</span>
      </div>
      ${links.length === 0
        ? `<div style="text-align:center;color:var(--text-muted);padding:2rem;">No active shared links.</div>`
        : `<div class="table-responsive-wrapper">
            <table class="summary-table" style="width:100%;border-collapse:collapse;text-align:left;font-size:14px;">
              <thead><tr style="border-bottom:2px solid var(--border-card);color:var(--text-muted);">
                <th style="padding:12px 8px;">File Name</th>
                <th style="padding:12px 8px;">Shared By</th>
                <th style="padding:12px 8px;">Shared With</th>
                <th style="padding:12px 8px;">Date</th>
                <th style="padding:12px 8px;">Expiry</th>
                <th style="padding:12px 8px;text-align:right;">Actions</th>
              </tr></thead>
              <tbody>
                ${links.map(file => `
                  <tr style="border-bottom:1px solid var(--border-card);">
                    <td style="padding:16px 8px;font-weight:500;color:var(--text-main);display:flex;align-items:center;gap:12px;">
                      <div style="background:rgba(59,130,246,0.1);padding:8px;border-radius:6px;"><i data-lucide="file" style="width:18px;height:18px;color:var(--brand-blue);"></i></div>
                      ${file.name}
                    </td>
                    <td style="padding:16px 8px;color:var(--text-main);">${file.sharedBy}</td>
                    <td style="padding:16px 8px;color:var(--text-secondary);">
                      <span style="background:var(--bg-card-secondary);padding:4px 10px;border-radius:12px;font-size:12px;">${file.sharedWith}</span>
                    </td>
                    <td style="padding:16px 8px;color:var(--text-secondary);">${file.date}</td>
                    <td style="padding:16px 8px;color:var(--text-main);">${file.expiry}</td>
                    <td style="padding:16px 8px;text-align:right;">
                      <div style="display:flex;gap:12px;justify-content:flex-end;align-items:center;">
                        <button class="btn" style="padding:3px 8px;font-size:11px;" title="Copy Link"
                          onclick="(function(){try{navigator.clipboard.writeText('https://gantt.app/share/${file.id}');showToast('Share link copied to clipboard.','success');}catch(e){showToast('Copy failed (browser restriction).','danger');}})()">
                          <i data-lucide="copy" style="width:14px;height:14px;"></i>
                        </button>
                        <button class="btn" style="padding:3px 8px;font-size:11px;background:rgba(239,68,68,0.1);color:#ef4444;border-color:rgba(239,68,68,0.3);" title="Revoke Access"
                          onclick="openModal({ title: 'Revoke Access: ${file.name}', bodyHtml: '<p>Are you sure you want to revoke access for <strong>${file.sharedWith}</strong>?</p>', confirmText: 'Revoke', confirmClass: 'btn-danger', onConfirm: () => { window.appState.sharedLinks = (window.appState.sharedLinks||[]).filter(l=>l.id!=='${file.id}'); window.addAuditLog('Admin','DELETE','SharedLink','${file.id}','Revoked share: ${file.name}'); showToast('Access revoked.','success'); window.navigateTo('shared-files'); } })">
                          <i data-lucide="x-circle" style="width:14px;height:14px;"></i>
                        </button>
                      </div>
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>`}
    </div>`;
}

// ================================================================
// IMPORT DOCUMENTS TAB — reads from appState.importQueue
// ================================================================
function renderImportTab(s) {
  const queue = s.importQueue || [];
  const validated   = queue.filter(i => i.status === 'Validated').length;
  const errors      = queue.filter(i => i.status === 'Mapping Error').length;
  const parsing     = queue.filter(i => i.status === 'Parsing').length;

  const eqOpts = (s.equipment || []).slice(0, 30).map(e => `<option value="${e.id}">${e.id}</option>`).join('');

  return `
    <div class="four-stat-boxes" style="margin-bottom:1.5rem;">
      ${[
        { label:'In Queue', value: queue.length, color:'var(--brand-blue)' },
        { label:'Validated', value: validated, color:'#10b981' },
        { label:'Mapping Errors', value: errors, color:'#ef4444' },
        { label:'Committed (Session)', value: s.documents.filter(d=>d.type==='Imported').length, color:'var(--text-main)' }
      ].map(stat => `
        <div class="dashboard-card" style="padding:16px;">
          <div style="color:var(--text-secondary);font-size:13px;margin-bottom:8px;">${stat.label}</div>
          <div style="font-size:24px;font-weight:700;color:${stat.color};">${stat.value}</div>
        </div>`).join('')}
    </div>

    <!-- Upload Dropzone -->
    <div class="dashboard-card" style="padding:24px;margin-bottom:24px;">
      <div style="border:2px dashed var(--border-card);border-radius:8px;padding:36px 20px;text-align:center;background:var(--bg-card-secondary);">
        <i data-lucide="file-up" style="width:48px;height:48px;color:var(--brand-blue);margin-bottom:12px;"></i>
        <h3 style="margin:0 0 6px 0;font-size:16px;font-weight:600;color:var(--text-main);">Drag &amp; Drop Batch Documents Here</h3>
        <p style="margin:0 0 16px 0;font-size:13px;color:var(--text-secondary);">Supports PDF, XLSX, ZIP, DWG, DOCX • Session-only — no NAS backend</p>
        <div style="display:flex;gap:0.5rem;justify-content:center;align-items:center;flex-wrap:wrap;">
          <button class="btn btn-primary" style="display:flex;align-items:center;gap:0.4rem;" onclick="window._openBatchImportModal()">
            <i data-lucide="folder-plus" style="width:14px;height:14px;"></i> Browse Files
          </button>
          <button class="btn" style="display:flex;align-items:center;gap:0.4rem;" onclick="window._downloadImportTemplate()">
            <i data-lucide="download" style="width:14px;height:14px;"></i> Download Template
          </button>
        </div>
      </div>
    </div>

    <!-- Import Queue Table -->
    <div class="dashboard-card" style="padding:1.25rem;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.25rem;flex-wrap:wrap;gap:0.75rem;">
        <div>
          <h3 class="card-top-title" style="margin:0;">Import Queue &amp; Mapping</h3>
          <p style="margin:4px 0 0 0;font-size:0.75rem;color:var(--text-secondary);">Resolve mapping errors before committing batch import</p>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
          <button class="btn" style="display:flex;align-items:center;gap:0.4rem;font-size:0.75rem;" onclick="window.seedSampleQueueData()">
            <i data-lucide="database" style="width:13px;height:13px;"></i> Load Sample Queue
          </button>
          <button class="btn" style="display:flex;align-items:center;gap:0.4rem;font-size:0.75rem;" onclick="window.clearImportQueue()">
            <i data-lucide="trash-2" style="width:13px;height:13px;"></i> Clear Queue
          </button>
          <button class="btn btn-primary" style="display:flex;align-items:center;gap:0.4rem;font-size:0.75rem;" onclick="window.commitImportBatch()">
            <i data-lucide="check-circle-2" style="width:13px;height:13px;"></i> Commit Batch (${validated})
          </button>
        </div>
      </div>
      ${queue.length === 0
        ? `<div style="text-align:center;color:var(--text-muted);padding:3rem 1rem;">
            <i data-lucide="inbox" style="width:44px;height:44px;color:var(--text-muted);margin-bottom:12px;display:block;margin-left:auto;margin-right:auto;"></i>
            <h4 style="margin:0 0 6px 0;font-size:15px;color:var(--text-main);">Import Queue is Currently Empty</h4>
            <p style="margin:0 0 16px 0;font-size:13px;color:var(--text-secondary);">Upload files using the dropzone above or click below to populate sample queue items.</p>
            <button class="btn btn-primary" style="display:inline-flex;align-items:center;gap:8px;" onclick="window.seedSampleQueueData()">
              <i data-lucide="database" style="width:16px;height:16px;"></i> Load Sample Queue Data
            </button>
           </div>`
        : `<div class="table-responsive-wrapper">
            <table class="summary-table" style="width:100%;border-collapse:collapse;font-size:14px;">
              <thead><tr style="border-bottom:2px solid var(--border-card);color:var(--text-muted);">
                <th style="padding:12px 8px;">ID</th>
                <th style="padding:12px 8px;">File Name</th>
                <th style="padding:12px 8px;">Size</th>
                <th style="padding:12px 8px;">Target Eq.</th>
                <th style="padding:12px 8px;">Phase</th>
                <th style="padding:12px 8px;">Status</th>
                <th style="padding:12px 8px;text-align:right;">Actions</th>
              </tr></thead>
              <tbody>
                ${queue.map(item => `
                  <tr style="border-bottom:1px solid var(--border-card);">
                    <td style="padding:12px 8px;font-family:monospace;color:var(--brand-blue);font-size:0.78rem;">${item.id}</td>
                    <td style="padding:12px 8px;font-weight:500;color:var(--text-main);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${item.name}</td>
                    <td style="padding:12px 8px;color:var(--text-secondary);">${item.size}</td>
                    <td style="padding:12px 8px;"><span style="font-weight:600;padding:2px 6px;border-radius:4px;background:${item.eq === 'Unmapped' ? 'rgba(239,68,68,0.1)' : 'var(--bg-card-secondary)'};color:${item.eq === 'Unmapped' ? '#ef4444' : 'var(--text-main)'};">${item.eq}</span></td>
                    <td style="padding:12px 8px;color:var(--text-secondary);">${item.phase}</td>
                    <td style="padding:12px 8px;">
                      <span style="padding:4px 8px;border-radius:999px;font-size:12px;font-weight:500;background:${item.status === 'Validated' ? 'rgba(16,185,129,0.1)' : item.status === 'Parsing' ? 'rgba(59,130,246,0.1)' : 'rgba(239,68,68,0.1)'};color:${item.status === 'Validated' ? '#10b981' : item.status === 'Parsing' ? '#3b82f6' : '#ef4444'};">
                        ${item.status}
                      </span>
                    </td>
                    <td style="padding:12px 8px;text-align:right;">
                      <div style="display:flex;gap:6px;justify-content:flex-end;">
                        <button class="btn" style="padding:2px 8px;font-size:11px;background:var(--bg-card-secondary);"
                          onclick="window._openMapDocModal('${item.id}','${item.eq}','${item.phase}')">Map</button>
                        <button class="btn" style="padding:2px 8px;font-size:11px;background:rgba(239,68,68,0.1);color:#ef4444;border-color:rgba(239,68,68,0.3);"
                          onclick="window.removeFromImportQueue('${item.id}')">
                          <i data-lucide="trash-2" style="width:11px;height:11px;"></i>
                        </button>
                      </div>
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>`}
    </div>`;
}

// ── Batch Import Helpers ──────────────────────────────────────────
window._openBatchImportModal = function() {
  const eqOpts = (window.appState.equipment || []).slice(0,30).map(e => `<option value="${e.id}">${e.id}</option>`).join('');
  openModal({
    title: 'Batch Document Import',
    bodyHtml: `
      <div class="form-row"><label>Target Equipment</label>
        <select id="bi-eq" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
          <option value="Auto">Auto-Detect from Filename</option>
          ${eqOpts}
        </select>
      </div>
      <div class="form-row"><label>Target Phase</label>
        <select id="bi-phase" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
          <option>Auto-Detect</option><option>Delivery</option><option>CxL2</option><option>CxL3</option><option>CxL4</option><option>CxL5</option>
        </select>
      </div>
      <div class="form-row"><label>Choose Files <span style="font-size:0.75rem;color:var(--text-muted);">(session-only)</span></label>
        <input id="bi-files" type="file" multiple style="font-size:0.85rem;width:100%;">
      </div>`,
    confirmText: 'Add to Queue',
    onConfirm: (overlay) => {
      const eq = overlay.querySelector('#bi-eq')?.value || 'Auto';
      const phase = overlay.querySelector('#bi-phase')?.value || 'Auto-Detect';
      const files = overlay.querySelector('#bi-files')?.files;
      if (!files || files.length === 0) {
        showToast('Please select at least one file.', 'danger');
        return false;
      }
      Array.from(files).forEach(file => {
        const id = window.generateId('IMP');
        const sizeKb = file.size > 1048576 ? (file.size/1048576).toFixed(1)+' MB' : Math.round(file.size/1024)+' KB';
        window.appState.importQueue.push({ id, name: file.name, size: sizeKb, eq: eq === 'Auto' ? 'Auto-Detect' : eq, phase: phase, status: 'Validated', time: 'Just now' });
      });
      window.addAuditLog('Admin', 'CREATE', 'ImportQueue', 'BATCH', `${files.length} file(s) added to import queue`);
      showToast(`${files.length} file(s) added to import queue.`, 'success');
      window.navigateTo('import-documents');
    }
  });
};

window._openMapDocModal = function(id, currentEq, currentPhase) {
  const eqOpts = (window.appState.equipment || []).slice(0,30).map(e => `<option value="${e.id}" ${e.id === currentEq ? 'selected' : ''}>${e.id}</option>`).join('');
  openModal({
    title: 'Map Document: ' + id,
    bodyHtml: `
      <div class="form-row"><label>Equipment</label>
        <select id="map-eq" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
          ${eqOpts}
          <option value="Multiple" ${currentEq === 'Multiple' ? 'selected' : ''}>Multiple</option>
        </select>
      </div>
      <div class="form-row"><label>Phase</label>
        <select id="map-phase" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
          ${['Delivery','CxL2','CxL3','CxL4','CxL5'].map(p => `<option ${p===currentPhase?'selected':''}>${p}</option>`).join('')}
        </select>
      </div>`,
    confirmText: 'Save Mapping',
    onConfirm: (overlay) => {
      const eq = overlay.querySelector('#map-eq')?.value;
      const phase = overlay.querySelector('#map-phase')?.value;
      window.updateImportMapping(id, eq, phase);
    }
  });
};

window._downloadImportTemplate = function() {
  const csv = 'Filename,Equipment_ID,Phase,Document_Type,Notes\nExample_FAT_Report.pdf,AHU-001,CxL2,FAT Report,Factory acceptance test\nExample_Checklist.xlsx,PMP-101,CxL3,Checklist,Pre-commissioning checklist\n';
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'GANT_Import_Template.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Import template downloaded (session-only demo file).', 'success');
};
