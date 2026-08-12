import { topMetricCards, activitiesThisWeek, projectIdentity } from '../mockData.js';

// ── Status badge helper ──────────────────────────────────────────
function statusBadge(status) {
  const map = {
    'Completed':   { cls: 'badge-green', icon: 'check-circle-2', color: '#10b981' },
    'In Progress': { cls: 'badge-blue',  icon: 'rotate-cw',      color: '#3b82f6' },
    'Blocked':     { cls: 'badge-red',   icon: 'x-circle',       color: '#ef4444' },
    'Delayed':     { cls: 'badge-red',   icon: 'alert-triangle',  color: '#f59e0b' },
    'Not Started': { cls: 'badge-gray',  icon: 'clock',           color: '#94a3b8' }
  };
  const s = map[status] || { cls: 'badge-gray', icon: 'clock', color: '#94a3b8' };
  return `<span class="status-badge ${s.cls}" style="display:inline-flex;align-items:center;gap:0.3rem;"><i data-lucide="${s.icon}" style="width:12px;height:12px;"></i>${status}</span>`;
}

// ── Inline form error helper ─────────────────────────────────────
function _showFormError(overlay, msg) {
  let el = overlay.querySelector('#act-form-error');
  if (!el) {
    el = document.createElement('div');
    el.id = 'act-form-error';
    el.style.cssText = 'color:#ef4444;font-size:0.8rem;font-weight:600;padding:0.5rem;background:rgba(239,68,68,0.1);border-radius:4px;border:1px solid rgba(239,68,68,0.3);margin-top:0.5rem;';
    overlay.querySelector('.modal-body')?.appendChild(el);
  }
  el.textContent = '⚠ ' + msg;
  el.style.display = 'block';
}

export function renderActivitiesView(subRoute = 'daily-activity') {
  const m = topMetricCards;
  const act = activitiesThisWeek;
  const p = projectIdentity;

  const tabs = [
    { id: 'daily-activity',    label: 'Daily Activity',    icon: 'calendar-days' },
    { id: 'weekly-activity',   label: 'Weekly Activity',   icon: 'calendar-range' },
    { id: 'activity-progress', label: 'Activity Progress', icon: 'bar-chart-2' },
    { id: 'activity-status',   label: 'Activity Status',   icon: 'trello' },
    { id: 'activity-history',  label: 'Activity History',  icon: 'history' }
  ];

  const tabsHtml = `
    <div class="view-tabs">
      ${tabs.map(tab => `
        <span class="view-tab ${subRoute === tab.id ? 'active' : ''}" data-route="${tab.id}">${tab.label}</span>
      `).join('')}
    </div>`;

  let content = '';
  switch (subRoute) {
    case 'daily-activity':    content = renderDailyActivity(p); break;
    case 'weekly-activity':   content = renderWeeklyActivity(m, act); break;
    case 'activity-progress': content = renderActivityProgress(m, act); break;
    case 'activity-status':   content = renderActivityStatus(act); break;
    case 'activity-history':  content = renderActivityHistory(); break;
    default:                  content = renderDailyActivity(p); break;
  }

  return `<div class="activities-view">${tabsHtml}${content}</div>`;
}

// ================================================================
// DAILY ACTIVITY — reads from appState.activities
// ================================================================
function renderDailyActivity(p) {
  const s = window.appState;
  const allActivities = s.activities; // LIVE STATE — not local array

  const af = s.activityFilters || { phase: 'all', status: 'all', search: '' };

  // Get unique phases and statuses from live data
  const allPhases  = [...new Set(allActivities.map(a => a.phase).filter(Boolean))].sort();

  const filtered = allActivities.filter(a => {
    const phaseOk  = af.phase === 'all' || (a.phase || '').toLowerCase().includes(af.phase.toLowerCase());
    const statusOk = af.status === 'all' || a.status === af.status;
    const searchOk = !af.search || (a.eq || '').toLowerCase().includes(af.search.toLowerCase()) || (a.act || '').toLowerCase().includes(af.search.toLowerCase()) || (a.id || '').toLowerCase().includes(af.search.toLowerCase());
    return phaseOk && statusOk && searchOk;
  });

  const currentPage = window.appPageState['daily-activity'] || 1;
  const pageSize = 8;
  const paginatedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const phaseOptions = allPhases.map(ph => `<option value="${ph}" ${af.phase === ph ? 'selected' : ''}>${ph}</option>`).join('');

  return `
    <div class="dashboard-card">
      <div class="card-top-title" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem;flex-wrap:wrap;gap:0.75rem;">
        <div>
          <span>Daily Site Activity Log</span>
          <div style="font-size:0.72rem;color:var(--text-muted);font-weight:normal;margin-top:0.1rem;">
            Showing ${filtered.length} of ${allActivities.length} activities for project <strong>${p.name}</strong>
          </div>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
          <select class="filter-select" onchange="window.setActivityFilter('phase', this.value === 'All Phases' ? 'all' : this.value)">
            <option value="all" ${af.phase === 'all' ? 'selected' : ''}>All Phases</option>
            ${phaseOptions}
          </select>
          <select class="filter-select" onchange="window.setActivityFilter('status', this.value === 'All Statuses' ? 'all' : this.value)">
            <option value="all" ${af.status === 'all' ? 'selected' : ''}>All Statuses</option>
            <option value="In Progress" ${af.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Completed" ${af.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Blocked" ${af.status === 'Blocked' ? 'selected' : ''}>Blocked</option>
            <option value="Not Started" ${af.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
          </select>
          <div style="position:relative;">
            <i data-lucide="search" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:13px;height:13px;color:var(--text-muted);pointer-events:none;"></i>
            <input id="act-search-input" type="text" placeholder="Search..." value="${af.search || ''}"
              style="padding:0.4rem 0.5rem 0.4rem 1.8rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);width:150px;"
              oninput="window.setActivityFilter('search', this.value)">
          </div>
          <button class="btn btn-primary" style="display:flex;align-items:center;gap:0.4rem;" onclick="window._openAddActivityModal()">
            <i data-lucide="plus" style="width:14px;height:14px;"></i> Add Activity
          </button>
        </div>
      </div>
      <div style="overflow-x:auto;">
        <table class="summary-table" style="width:100%;">
          <thead><tr>
            <th style="padding:0.65rem;color:var(--text-secondary);">ID</th>
            <th style="padding:0.65rem;color:var(--text-secondary);">Equipment</th>
            <th style="padding:0.65rem;color:var(--text-secondary);">Activity Name</th>
            <th style="padding:0.65rem;color:var(--text-secondary);">Phase Gate</th>
            <th style="padding:0.65rem;color:var(--text-secondary);">Status</th>
            <th style="padding:0.65rem;color:var(--text-secondary);">Engineer</th>
            <th style="padding:0.65rem;color:var(--text-secondary);">Time</th>
            <th style="padding:0.65rem;color:var(--text-secondary);">Notes</th>
            <th style="padding:0.65rem;color:var(--text-secondary);">Actions</th>
          </tr></thead>
          <tbody>
            ${paginatedData.length === 0
              ? `<tr><td colspan="9" style="text-align:center;padding:2rem;color:var(--text-muted);">
                  No activities match the selected filters.
                  <button class="btn" style="margin-left:0.5rem;font-size:0.72rem;" onclick="window.setActivityFilter('phase','all');window.setActivityFilter('status','all');window.setActivityFilter('search','')">Clear Filters</button>
                </td></tr>`
              : paginatedData.map(r => `
                <tr style="border-bottom:1px solid var(--border-card);">
                  <td style="padding:0.6rem;color:var(--text-muted);font-size:0.75rem;font-weight:600;">${r.id}</td>
                  <td style="padding:0.6rem;font-weight:700;color:var(--brand-blue);font-size:0.82rem;">${r.eq}</td>
                  <td style="padding:0.6rem;color:var(--text-main);font-size:0.82rem;">${r.act}</td>
                  <td style="padding:0.6rem;font-size:0.78rem;"><span class="status-badge badge-blue" style="font-size:0.7rem;">${r.phase}</span></td>
                  <td style="padding:0.6rem;">
                    <select class="filter-select" style="padding:0.25rem 0.4rem;font-size:0.75rem;border-radius:4px;font-weight:600;background:var(--bg-card-secondary);color:var(--text-main);" onchange="window.updateActivityStatus('${r.id}', this.value)">
                      <option value="Not Started"  ${r.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                      <option value="In Progress"  ${r.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                      <option value="Completed"    ${r.status === 'Completed' ? 'selected' : ''}>Completed</option>
                      <option value="Blocked"      ${r.status === 'Blocked' ? 'selected' : ''}>Blocked</option>
                      <option value="Delayed"      ${r.status === 'Delayed' ? 'selected' : ''}>Delayed</option>
                    </select>
                  </td>
                  <td style="padding:0.6rem;color:var(--text-secondary);font-size:0.82rem;">${r.user}</td>
                  <td style="padding:0.6rem;color:var(--text-muted);font-size:0.75rem;white-space:nowrap;">${r.start}–${r.end}</td>
                  <td style="padding:0.6rem;color:var(--text-secondary);font-size:0.78rem;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${r.notes || ''}">${r.notes || '—'}</td>
                  <td style="padding:0.6rem;">
                    <div style="display:flex;gap:0.3rem;">
                      <button class="btn" style="padding:0.2rem 0.4rem;font-size:0.7rem;background:var(--bg-card-secondary);" title="Edit Activity" onclick="window._openEditActivityModal('${r.id}')">
                        <i data-lucide="edit-2" style="width:11px;height:11px;"></i>
                      </button>
                      <button class="btn" style="padding:0.2rem 0.4rem;font-size:0.7rem;background:rgba(239,68,68,0.1);color:#ef4444;border-color:rgba(239,68,68,0.3);" title="Delete Activity" onclick="window._confirmDeleteActivity('${r.id}')">
                        <i data-lucide="trash-2" style="width:11px;height:11px;"></i>
                      </button>
                    </div>
                  </td>
                </tr>`).join('')}
          </tbody>
        </table>
      </div>
      ${window.renderPagination(filtered.length, currentPage, pageSize, 'daily-activity')}
    </div>`;
}

// ── Activity modal handlers ────────────────────────────────────────
window._openAddActivityModal = function() {
  const equips = window.appState.equipment;
  const eqOpts = equips.slice(0, 30).map(e => `<option value="${e.id}">${e.id} — ${e.name || e.type}</option>`).join('');
  const phaseOpts = ['CxL1','CxL2 Pre-Cx','CxL3 Startup','CxL4 Functional','CxL5 Complete'].map(p => `<option>${p}</option>`).join('');
  openModal({
    title: 'Create New Daily Activity',
    bodyHtml: `
      <div class="form-row"><label>Equipment ID <span style="color:#ef4444;">*</span></label>
        <select id="na-eq" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
          <option value="">— Select Equipment —</option>
          ${eqOpts}
        </select>
      </div>
      <div class="form-row"><label>Activity Name <span style="color:#ef4444;">*</span></label>
        <input id="na-act" type="text" placeholder="e.g. Vibration Baseline Test" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
      </div>
      <div class="form-row"><label>Phase Gate</label>
        <select id="na-phase" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">${phaseOpts}</select>
      </div>
      <div class="form-row"><label>Assigned Engineer</label>
        <input id="na-user" type="text" placeholder="Engineer Name" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
      </div>
      <div style="display:flex;gap:0.75rem;">
        <div class="form-row" style="flex:1;"><label>Start Time</label>
          <input id="na-start" type="time" value="08:00" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
        </div>
        <div class="form-row" style="flex:1;"><label>End Time</label>
          <input id="na-end" type="time" value="17:00" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
        </div>
      </div>
      <div class="form-row"><label>Notes</label>
        <input id="na-notes" type="text" placeholder="Optional notes" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
      </div>`,
    confirmText: 'Create Activity',
    onConfirm: (overlay) => {
      const eq    = overlay.querySelector('#na-eq')?.value?.trim();
      const act   = overlay.querySelector('#na-act')?.value?.trim();
      const phase = overlay.querySelector('#na-phase')?.value;
      const user  = overlay.querySelector('#na-user')?.value?.trim();
      const start = overlay.querySelector('#na-start')?.value;
      const end   = overlay.querySelector('#na-end')?.value;
      const notes = overlay.querySelector('#na-notes')?.value?.trim();
      const result = window.createActivity({ eq, act, phase, user, start, end, notes });
      if (!result.ok) { _showFormError(overlay, result.error); return false; }
      showToast(`Activity "${act}" for ${eq} created successfully.`, 'success');
      window.renderApp();
    }
  });
};

window._openEditActivityModal = function(actId) {
  const a = window.appState.activities.find(a => a.id === actId);
  if (!a) return showToast('Activity not found.', 'danger');
  const phaseOpts = ['CxL1','CxL2 Pre-Cx','CxL3 Startup','CxL4 Functional','CxL5 Complete'].map(p => `<option ${p === a.phase ? 'selected' : ''}>${p}</option>`).join('');
  const statusOpts = ['Not Started','In Progress','Completed','Blocked','Delayed'].map(s => `<option ${s === a.status ? 'selected' : ''}>${s}</option>`).join('');
  openModal({
    title: `Edit Activity: ${actId}`,
    bodyHtml: `
      <div class="form-row"><label>Activity Name</label>
        <input id="ea-act" type="text" value="${a.act || ''}" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
      </div>
      <div class="form-row"><label>Phase Gate</label>
        <select id="ea-phase" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">${phaseOpts}</select>
      </div>
      <div class="form-row"><label>Assigned Engineer</label>
        <input id="ea-user" type="text" value="${a.user || ''}" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
      </div>
      <div class="form-row"><label>Status</label>
        <select id="ea-status" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">${statusOpts}</select>
      </div>
      <div style="display:flex;gap:0.75rem;">
        <div class="form-row" style="flex:1;"><label>Start Time</label>
          <input id="ea-start" type="time" value="${a.start || '08:00'}" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
        </div>
        <div class="form-row" style="flex:1;"><label>End Time</label>
          <input id="ea-end" type="time" value="${a.end || '17:00'}" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
        </div>
      </div>
      <div class="form-row"><label>Notes</label>
        <input id="ea-notes" type="text" value="${a.notes || ''}" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
      </div>`,
    confirmText: 'Save Changes',
    onConfirm: (overlay) => {
      const act    = overlay.querySelector('#ea-act')?.value?.trim();
      const phase  = overlay.querySelector('#ea-phase')?.value;
      const user   = overlay.querySelector('#ea-user')?.value?.trim();
      const status = overlay.querySelector('#ea-status')?.value;
      const start  = overlay.querySelector('#ea-start')?.value;
      const end    = overlay.querySelector('#ea-end')?.value;
      const notes  = overlay.querySelector('#ea-notes')?.value?.trim();
      const result = window.updateActivity(actId, { act, phase, user, status, start, end, notes });
      if (!result.ok) { _showFormError(overlay, result.error); return false; }
      showToast('Activity updated successfully.', 'success');
      window.renderApp();
    }
  });
};

window._confirmDeleteActivity = function(actId) {
  const a = window.appState.activities.find(a => a.id === actId);
  openModal({
    title: `Delete Activity: ${actId}`,
    bodyHtml: `<div style="padding:1rem;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:6px;">
      <p style="margin:0;font-size:0.9rem;color:var(--text-main);">Are you sure you want to delete activity <strong>${a?.act || actId}</strong>?</p>
      <p style="margin:0.5rem 0 0;font-size:0.8rem;color:var(--text-muted);">This action cannot be undone.</p>
    </div>`,
    confirmText: 'Delete Activity',
    confirmClass: 'btn-danger',
    onConfirm: () => {
      const result = window.deleteActivity(actId);
      if (!result.ok) { showToast(result.error, 'danger'); return false; }
      showToast(`Activity "${actId}" deleted.`, 'success');
      window.renderApp();
    }
  });
};

// ================================================================
// WEEKLY ACTIVITY — summary view
// ================================================================
function renderWeeklyActivity(m, act) {
  const s = window.appState;
  const activities = s.activities;

  const statusCounts = { 'Completed': 0, 'In Progress': 0, 'Blocked': 0, 'Not Started': 0, 'Delayed': 0 };
  activities.forEach(a => { if (statusCounts.hasOwnProperty(a.status)) statusCounts[a.status]++; });

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const randCount = (seed) => [4, 7, 5, 8, 6, 2, 1][seed % 7];

  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;">
      <div class="dashboard-card" style="padding:1.5rem;">
        <div class="card-top-title" style="margin-bottom:1rem;"><i data-lucide="calendar-range"></i> Weekly Activity Summary — Aug 2026</div>
        <div style="display:flex;gap:0.5rem;align-items:flex-end;height:120px;padding-bottom:0.5rem;border-bottom:1px solid var(--border-card);">
          ${days.map((day, i) => `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:0.3rem;">
              <div style="width:100%;background:${i === 0 ? 'var(--brand-blue)' : 'var(--bg-card-secondary)'};height:${randCount(i) * 14}px;border-radius:3px 3px 0 0;cursor:pointer;" title="${day}: ${randCount(i)} activities" onclick="showToast('${day}: ${randCount(i)} activities completed this day','info')"></div>
              <span style="font-size:0.7rem;color:var(--text-muted);">${day}</span>
            </div>`).join('')}
        </div>
        <div style="margin-top:0.75rem;font-size:0.75rem;color:var(--text-muted);">Reporting Period: 03–08 Aug 2026</div>
      </div>
      <div class="dashboard-card" style="padding:1.5rem;">
        <div class="card-top-title" style="margin-bottom:1rem;"><i data-lucide="pie-chart"></i> Status Distribution</div>
        ${Object.entries(statusCounts).map(([status, count]) => {
          const total = activities.length || 1;
          const pct = Math.round(count / total * 100);
          const color = {Completed:'#10b981','In Progress':'#3b82f6',Blocked:'#ef4444','Not Started':'#94a3b8',Delayed:'#f59e0b'}[status] || '#94a3b8';
          return `
            <div style="margin-bottom:0.75rem;">
              <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:var(--text-main);margin-bottom:0.2rem;"><span style="color:${color};font-weight:600;">${status}</span><span>${count} (${pct}%)</span></div>
              <div style="height:6px;border-radius:3px;background:var(--bg-card-secondary);"><div style="height:100%;width:${pct}%;background:${color};border-radius:3px;transition:width 0.5s ease;"></div></div>
            </div>`;
        }).join('')}
      </div>
    </div>
    <div class="dashboard-card" style="padding:1.5rem;">
      <div class="card-top-title" style="margin-bottom:1rem;"><i data-lucide="trending-up"></i> Weekly Productivity Metrics</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;">
        ${[
          { label:'Total Activities', value: activities.length, color:'var(--brand-blue)', icon:'list' },
          { label:'Completed', value: statusCounts.Completed, color:'#10b981', icon:'check-circle-2' },
          { label:'Blocked', value: statusCounts.Blocked, color:'#ef4444', icon:'x-circle' },
          { label:'Completion Rate', value: Math.round(statusCounts.Completed / (activities.length || 1) * 100) + '%', color:'#3b82f6', icon:'percent' }
        ].map(metric => `
          <div class="dashboard-card" style="padding:1rem;background:var(--bg-card-secondary);text-align:center;">
            <i data-lucide="${metric.icon}" style="width:24px;height:24px;color:${metric.color};margin-bottom:0.5rem;"></i>
            <div style="font-size:1.5rem;font-weight:800;color:${metric.color};">${metric.value}</div>
            <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:0.2rem;">${metric.label}</div>
          </div>`).join('')}
      </div>
    </div>`;
}

// ================================================================
// ACTIVITY PROGRESS
// ================================================================
function renderActivityProgress(m, act) {
  const s = window.appState;
  const activities = s.activities;

  const phaseBreakdown = {};
  activities.forEach(a => {
    if (!phaseBreakdown[a.phase]) phaseBreakdown[a.phase] = { total: 0, done: 0 };
    phaseBreakdown[a.phase].total++;
    if (a.status === 'Completed') phaseBreakdown[a.phase].done++;
  });

  return `
    <div style="display:flex;flex-direction:column;gap:1.5rem;">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;">
        ${[
          { label:'Actual Progress',  value:'58%', sub:'vs 65% Planned', color:'#ef4444', icon:'trending-down' },
          { label:'Total Equipment',  value:'333', sub:'in commissioning scope', color:'var(--brand-blue)', icon:'server' },
          { label:'Activities Logged', value: activities.length, sub:'in runtime state', color:'#10b981', icon:'list-checks' },
          { label:'Active Phase',     value:'CxL3', sub:'Startup Phase Gate', color:'#f97316', icon:'activity' }
        ].map(card => `
          <div class="dashboard-card" style="padding:1.25rem;text-align:center;">
            <i data-lucide="${card.icon}" style="color:${card.color};width:28px;height:28px;margin-bottom:0.5rem;"></i>
            <div style="font-size:1.75rem;font-weight:800;color:${card.color};">${card.value}</div>
            <div style="font-weight:600;font-size:0.88rem;color:var(--text-main);">${card.label}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.2rem;">${card.sub}</div>
          </div>`).join('')}
      </div>

      <div class="dashboard-card" style="padding:1.5rem;">
        <div class="card-top-title" style="margin-bottom:1rem;"><i data-lucide="bar-chart-2"></i> Activity Completion by Phase Gate</div>
        ${Object.keys(phaseBreakdown).length === 0
          ? `<div style="text-align:center;color:var(--text-muted);padding:1rem;">No activity data available.</div>`
          : Object.entries(phaseBreakdown).map(([phase, data]) => {
            const pct = Math.round(data.done / data.total * 100);
            const color = { CxL1: '#3b82f6', CxL2: '#10b981', 'CxL2 Pre-Cx': '#10b981', CxL3: '#f97316', 'CxL3 Startup': '#f97316', CxL4: '#8b5cf6', 'CxL4 Functional': '#8b5cf6', CxL5: '#ef4444', 'CxL5 Complete': '#ef4444' }[phase] || '#6b7280';
            return `
              <div style="margin-bottom:1rem;">
                <div style="display:flex;justify-content:space-between;font-size:0.82rem;color:var(--text-main);margin-bottom:0.3rem;font-weight:600;">
                  <span><i data-lucide="layers" style="width:13px;height:13px;vertical-align:middle;color:${color};"></i> ${phase}</span>
                  <span style="color:${color};">${data.done}/${data.total} (${pct}%)</span>
                </div>
                <div style="height:10px;border-radius:5px;background:var(--bg-card-secondary);">
                  <div style="height:100%;width:${pct}%;background:${color};border-radius:5px;transition:width 0.5s ease;"></div>
                </div>
              </div>`;
          }).join('')}
      </div>

      <div class="dashboard-card" style="padding:1.5rem;">
        <div class="card-top-title" style="margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;">
          <span><i data-lucide="alert-triangle"></i> Issues &amp; Risks</span>
          <button class="btn" style="font-size:0.75rem;" onclick="window.navigateTo('cxl')">View CxL Phase Detail</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.75rem;">
          ${act.issuesAndRisks.map(risk => `
            <div style="padding:1rem;background:var(--bg-card-secondary);border-radius:6px;border-left:4px solid ${risk.color};display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:0.8rem;font-weight:600;color:var(--text-main);">${risk.label}</span>
              <span style="font-size:1.2rem;font-weight:800;color:${risk.color};">${risk.count}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

// ================================================================
// ACTIVITY STATUS — Kanban-style board
// ================================================================
function renderActivityStatus(act) {
  const s = window.appState;
  const activities = s.activities;

  const grouped = {
    'Not Started': activities.filter(a => a.status === 'Not Started'),
    'In Progress': activities.filter(a => a.status === 'In Progress'),
    'Blocked':     activities.filter(a => a.status === 'Blocked'),
    'Completed':   activities.filter(a => a.status === 'Completed')
  };
  const colors = { 'Not Started': '#94a3b8', 'In Progress': '#3b82f6', 'Blocked': '#ef4444', 'Completed': '#10b981' };

  return `
    <div class="dashboard-card" style="padding:1.5rem;">
      <div class="card-top-title" style="margin-bottom:1.25rem;">
        <i data-lucide="trello"></i> Activity Status Board
        <span style="font-size:0.75rem;font-weight:normal;color:var(--text-muted);margin-left:0.5rem;">${activities.length} total activities — click status dropdown in Daily Activity to update</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;">
        ${Object.entries(grouped).map(([status, items]) => `
          <div>
            <div style="font-weight:700;font-size:0.85rem;color:${colors[status]};margin-bottom:0.75rem;padding:0.4rem 0.6rem;background:${colors[status]}15;border-radius:4px;display:flex;justify-content:space-between;align-items:center;">
              <span>${status}</span>
              <span style="background:${colors[status]};color:#fff;padding:0.1rem 0.4rem;border-radius:12px;font-size:0.72rem;">${items.length}</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              ${items.slice(0, 8).map(a => `
                <div style="padding:0.65rem;background:var(--bg-card-secondary);border-radius:6px;border-left:3px solid ${colors[status]};">
                  <div style="font-weight:700;font-size:0.8rem;color:var(--brand-blue);">${a.eq}</div>
                  <div style="font-size:0.75rem;color:var(--text-main);margin-top:0.2rem;">${a.act}</div>
                  <div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.25rem;">${a.user} • ${a.phase}</div>
                </div>`).join('')}
              ${items.length > 8 ? `<div style="text-align:center;color:var(--text-muted);font-size:0.75rem;padding:0.4rem;">+${items.length - 8} more</div>` : ''}
            </div>
          </div>`).join('')}
      </div>
    </div>`;
}

// ================================================================
// ACTIVITY HISTORY — reads from appState.auditLog
// ================================================================
function renderActivityHistory() {
  const s = window.appState;
  const logs = (s.auditLog || [])
    .filter(log => log.entity === 'Activity')
    .slice(0, 40);

  return `
    <div class="dashboard-card" style="padding:1.5rem;">
      <div class="card-top-title" style="margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;">
        <span><i data-lucide="history"></i> Activity Audit Log — ${logs.length} entries</span>
      </div>
      ${logs.length === 0
        ? `<div style="text-align:center;color:var(--text-muted);padding:2rem;">
            <i data-lucide="inbox" style="width:32px;height:32px;margin-bottom:0.5rem;display:block;margin-left:auto;margin-right:auto;"></i>
            No activity history recorded yet. Create, edit or update activities to see the audit trail here.
          </div>`
        : `<div style="overflow-x:auto;">
            <table class="summary-table" style="width:100%;">
              <thead><tr>
                <th style="padding:0.65rem;color:var(--text-secondary);">Timestamp</th>
                <th style="padding:0.65rem;color:var(--text-secondary);">Action</th>
                <th style="padding:0.65rem;color:var(--text-secondary);">Activity</th>
                <th style="padding:0.65rem;color:var(--text-secondary);">By</th>
                <th style="padding:0.65rem;color:var(--text-secondary);">Details</th>
              </tr></thead>
              <tbody>
                ${logs.map(log => `
                  <tr style="border-bottom:1px solid var(--border-card);">
                    <td style="padding:0.6rem;color:var(--text-muted);font-size:0.75rem;white-space:nowrap;">${log.ts}</td>
                    <td style="padding:0.6rem;">
                      <span class="status-badge ${log.action === 'CREATE' ? 'badge-green' : log.action === 'DELETE' ? 'badge-red' : 'badge-blue'}" style="font-size:0.7rem;">${log.action}</span>
                    </td>
                    <td style="padding:0.6rem;font-weight:600;color:var(--text-main);font-size:0.82rem;">${log.entityId}</td>
                    <td style="padding:0.6rem;color:var(--text-secondary);font-size:0.82rem;">${log.actor}</td>
                    <td style="padding:0.6rem;color:var(--text-muted);font-size:0.78rem;">${log.desc}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>`}
    </div>`;
}
