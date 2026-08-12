import {
  topMetricCards,
  masterEquipmentList,
  projectIdentity,
  activitiesThisWeek,
  commissioningPhases
} from '../mockData.js';

export function renderCxLView(subRoute = 'cxl') {
  const isOverview      = subRoute === 'cxl' || !subRoute;
  const isPhaseProgress = subRoute === 'phase-progress';
  const m = topMetricCards;
  const p = projectIdentity;
  const act = activitiesThisWeek;

  const navHtml = `
    <div class="view-tabs">
      <span class="view-tab ${isOverview ? 'active' : ''}" data-route="cxl">
        <i data-lucide="layout-dashboard" style="width:16px;height:16px;"></i> CxL Overview
      </span>
      <span class="view-tab ${isPhaseProgress ? 'active' : ''}" data-route="phase-progress">
        <i data-lucide="list-checks" style="width:16px;height:16px;"></i> Phase Gate Detail
      </span>
    </div>`;

  const contextHeaderHtml = `
    <div class="dashboard-card" style="padding:1rem 1.25rem;margin-bottom:1.5rem;border-radius:12px;background:var(--bg-card);border:1px solid var(--border-card);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
      <div>
        <div style="font-size:0.72rem;font-weight:700;color:var(--brand-blue);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.2rem;">${p.name} • Commissioning Phase Gate Management</div>
        <h1 style="font-size:1.25rem;font-weight:800;color:var(--text-main);margin:0;font-family:var(--font-heading);">${p.fullName}</h1>
        <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.2rem;">
          Client: <strong>${p.client}</strong> &nbsp;•&nbsp; Active Phase: <strong style="color:#f97316;">${m.currentPhase.phase} Startup</strong> &nbsp;•&nbsp; Actual Progress: <strong>${m.overallProgress.percentage}%</strong>
        </div>
      </div>
      <div style="display:flex;gap:0.75rem;align-items:center;">
        <span class="status-badge badge-blue" style="padding:0.4rem 0.8rem;font-size:0.75rem;font-weight:700;">
          <i data-lucide="activity" style="width:14px;height:14px;display:inline;vertical-align:middle;"></i> ${m.currentPhase.status}
        </span>
        <button class="btn btn-primary" onclick="window.navigateTo('gantt')" style="padding:0.45rem 0.9rem;font-size:0.8rem;font-weight:600;display:flex;align-items:center;gap:0.4rem;">
          <i data-lucide="gantt-chart-square" style="width:14px;height:14px;"></i> View Timeline
        </button>
      </div>
    </div>`;

  let contentHtml = isOverview ? renderOverview(m, act) : renderPhaseProgress(m);

  return `
    <div class="cxl-view" style="animation:fadeIn 0.3s ease;color:var(--text-main);">
      ${contextHeaderHtml}
      ${navHtml}
      ${contentHtml}
    </div>`;
}

// ================================================================
// CxL OVERVIEW
// ================================================================
function renderOverview(m, act) {
  const phases = commissioningPhases;

  // Pipeline stepper — clicking navigates to Phase Gate Detail for that phase
  const pipelineHtml = `
    <div class="dashboard-card" style="margin-bottom:1.5rem;padding:1.5rem;">
      <div class="card-top-title" style="margin-bottom:1.25rem;"><i data-lucide="git-commit"></i> Commissioning Phase Gate Pipeline</div>
      <div style="display:flex;align-items:center;justify-content:space-between;position:relative;overflow-x:auto;padding:0.5rem 0;">
        <div style="position:absolute;top:38%;left:5%;right:5%;height:3px;background:var(--border-card);z-index:0;"></div>
        ${phases.map(ph => `
          <div style="position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;background:var(--bg-card);padding:0 8px;min-width:100px;">
            <div style="width:36px;height:36px;border-radius:50%;background:${ph.status === 'Completed' ? '#10b981' : ph.status === 'In Progress' ? '#f97316' : 'var(--bg-card-secondary)'};border:3px solid ${ph.status === 'In Progress' ? '#ea580c' : 'var(--border-card)'};display:flex;align-items:center;justify-content:center;color:${ph.status === 'Not Started' ? 'var(--text-muted)' : '#fff'};font-size:0.85rem;font-weight:bold;cursor:pointer;"
              onclick="window.selectCxlPhase('${ph.name}')">
              ${ph.status === 'Completed' ? '<i data-lucide="check" style="width:18px;height:18px;"></i>' : ph.name}
            </div>
            <div style="margin-top:0.5rem;font-weight:700;font-size:0.85rem;color:${ph.status === 'In Progress' ? '#f97316' : 'var(--text-main)'};">${ph.name}</div>
            <div style="font-size:0.7rem;color:var(--text-muted);">${ph.status}</div>
          </div>
        `).join('')}
      </div>
    </div>`;

  // Phase Gate cards — clicking navigates to that phase's detail
  const cardsHtml = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin-bottom:1.5rem;">
      ${phases.map(ph => `
        <div class="dashboard-card" style="padding:1.25rem;border-top:4px solid ${ph.statusColor};cursor:pointer;" onclick="window.selectCxlPhase('${ph.name}')">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
            <span style="font-weight:800;font-size:1.1rem;color:var(--text-main);">${ph.name}</span>
            <span class="status-badge" style="background:${ph.statusColor}20;color:${ph.statusColor};font-size:0.72rem;font-weight:700;">${ph.status}</span>
          </div>
          <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:0.75rem;height:36px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${ph.description}</div>
          <div style="font-size:0.72rem;color:var(--text-muted);display:flex;justify-content:space-between;border-top:1px solid var(--border-card);padding-top:0.5rem;">
            <span>Eq: <strong style="color:var(--text-main);">${ph.equipmentCount}</strong></span>
            <span>Reqs: <strong style="color:var(--text-main);">${ph.requirementsCount.completed}/${ph.requirementsCount.total}</strong></span>
          </div>
        </div>`).join('')}
    </div>`;

  // Equipment table — read from appState.equipment
  const equipmentSource = (window.appState && window.appState.equipment && window.appState.equipment.length > 0) ? window.appState.equipment : masterEquipmentList;
  const equipmentTableHtml = `
    <div class="dashboard-card" style="padding:1.5rem;margin-bottom:1.5rem;">
      <div class="card-top-title" style="margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
        <div><i data-lucide="server"></i> Equipment Commissioning Phase Positioning</div>
        <button class="btn btn-primary" style="font-size:0.78rem;padding:0.35rem 0.75rem;" onclick="window.navigateTo('equipment-list')">View Master Equipment List</button>
      </div>
      <div class="table-responsive-wrapper">
        <table class="summary-table" style="width:100%;text-align:left;border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:2px solid var(--border-card);color:var(--text-muted);font-size:0.78rem;">
              <th style="padding:0.75rem 0.5rem;">Equipment ID</th>
              <th style="padding:0.75rem 0.5rem;">Type</th>
              <th style="padding:0.75rem 0.5rem;">Current Phase Gate</th>
              <th style="padding:0.75rem 0.5rem;">Building / Room</th>
              <th style="padding:0.75rem 0.5rem;">Gate Status</th>
              <th style="padding:0.75rem 0.5rem;text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${equipmentSource.slice(0, 12).map(eq => `
              <tr style="border-bottom:1px solid var(--border-card);">
                <td style="padding:0.75rem 0.5rem;font-weight:700;color:var(--brand-blue);">${eq.id}</td>
                <td style="padding:0.75rem 0.5rem;color:var(--text-secondary);font-size:0.8rem;">${eq.type}</td>
                <td style="padding:0.75rem 0.5rem;"><span class="status-badge badge-blue" style="font-size:0.72rem;">${eq.phase}</span></td>
                <td style="padding:0.75rem 0.5rem;color:var(--text-secondary);font-size:0.8rem;">${eq.buildingName || eq.building} / ${eq.room}</td>
                <td style="padding:0.75rem 0.5rem;">
                  <span style="font-size:0.75rem;font-weight:600;color:${eq.status === 'Active' ? '#10b981' : eq.status === 'Issue' ? '#ef4444' : '#9ca3af'};display:inline-flex;align-items:center;gap:0.3rem;">
                    <i data-lucide="${eq.status === 'Active' ? 'check-circle-2' : eq.status === 'Issue' ? 'alert-triangle' : 'clock'}" style="width:12px;height:12px;"></i> ${eq.status}
                  </span>
                </td>
                <td style="padding:0.75rem 0.5rem;text-align:right;">
                  <button class="btn" style="padding:0.25rem 0.5rem;font-size:0.7rem;background:var(--bg-card-secondary);" onclick="window.selectEquipment('${eq.id}');window.navigateTo('equipment-timeline');">Timeline</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;

  const bottomGridHtml = `
    <div class="cxl-bottom-grid">
      <div class="dashboard-card" style="padding:1.5rem;">
        <div class="card-top-title" style="margin-bottom:1rem;color:#ef4444;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
          <span><i data-lucide="alert-triangle"></i> Commissioning Attention Items</span>
          <button class="btn" style="font-size:0.72rem;padding:0.25rem 0.5rem;" onclick="window.navigateTo('daily-activity')">View Activity Log</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          ${act.issuesAndRisks.map(risk => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:0.6rem 0.75rem;background:var(--bg-card-secondary);border-radius:6px;border-left:3px solid ${risk.color};gap:0.5rem;">
              <span style="font-size:0.8rem;font-weight:600;color:var(--text-main);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${risk.label}</span>
              <span style="font-weight:800;font-size:0.85rem;color:${risk.color};border:1px solid ${risk.color};padding:0.15rem 0.5rem;border-radius:10px;flex-shrink:0;">${risk.count}</span>
            </div>`).join('')}
        </div>
      </div>
      <div class="dashboard-card" style="padding:1.5rem;">
        <div class="card-top-title" style="margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
          <span><i data-lucide="file-text"></i> Commissioning Evidence &amp; Submittals</span>
          <button class="btn btn-primary" style="font-size:0.72rem;padding:0.25rem 0.5rem;" onclick="window.navigateTo('documents')">Open Documents Hub</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          ${(window.appState && window.appState.documents ? window.appState.documents.slice(0,3) : []).map(doc => `
            <div style="padding:0.6rem 0.75rem;background:var(--bg-card-secondary);border-radius:6px;display:flex;justify-content:space-between;align-items:center;gap:0.75rem;width:100%;box-sizing:border-box;">
              <div style="flex:1;min-width:0;overflow:hidden;">
                <div style="font-weight:600;font-size:0.82rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${doc.name}">${doc.name}</div>
                <div style="font-size:0.7rem;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">Uploaded ${doc.date} • ${doc.size}</div>
              </div>
              <button class="btn" style="font-size:0.7rem;padding:0.25rem 0.6rem;flex-shrink:0;" onclick="window.navigateTo('documents')">View</button>
            </div>`).join('')}
        </div>
      </div>
    </div>`;

  return pipelineHtml + cardsHtml + equipmentTableHtml + bottomGridHtml;
}

// ================================================================
// PHASE GATE DETAIL — READS SELECTED PHASE FROM appState
// ================================================================
function renderPhaseProgress(m) {
  // FIX DEF-01: read from appState, NOT hardcoded 'CxL3'
  const activePhase = (window.appState && window.appState.selectedCxlPhase) ? window.appState.selectedCxlPhase : 'CxL3';

  // FIX: per-phase checklist definitions from window.CXL_CHECKLISTS
  const checklistDefs = (window.CXL_CHECKLISTS && window.CXL_CHECKLISTS[activePhase]) || [];

  // FIX: per-phase checklist state from appState.checklistState[phase]
  const phaseChecklistState = (window.appState && window.appState.checklistState && window.appState.checklistState[activePhase]) || {};

  const checklist = checklistDefs.map(item => ({
    ...item,
    done: phaseChecklistState.hasOwnProperty(item.id) ? phaseChecklistState[item.id] : false
  }));
  const completedCount = checklist.filter(i => i.done).length;

  // FIX DEF-02: read actual approval state
  const approvalState = (window.appState && window.appState.phaseApprovalState && window.appState.phaseApprovalState[activePhase]) || { status: 'Not Started', actor: null, ts: null };
  const isApproved = approvalState.status === 'Approved';

  // Phase selector tabs
  const phaseSelectorHtml = `
    <div class="phase-selector-tabs view-tabs">
      ${['CxL1','CxL2','CxL3','CxL4','CxL5'].map(ph => {
        const phApproval = (window.appState && window.appState.phaseApprovalState && window.appState.phaseApprovalState[ph]) || { status: 'Not Started' };
        const isActive = ph === activePhase;
        const dotColor = phApproval.status === 'Approved' ? '#10b981' : phApproval.status === 'In Progress' ? '#f97316' : 'var(--text-muted)';
        return `<button class="btn" style="font-size:0.8rem;padding:0.4rem 0.85rem;font-weight:${isActive ? '700' : '500'};background:${isActive ? 'var(--brand-blue)' : 'var(--bg-card-secondary)'};color:${isActive ? '#fff' : 'var(--text-main)'};border-color:${isActive ? 'var(--brand-blue)' : 'var(--border-card)'};display:flex;align-items:center;gap:0.4rem;"
          onclick="window.selectCxlPhase('${ph}')">
          <span style="width:8px;height:8px;border-radius:50%;background:${isActive ? '#fff' : dotColor};display:inline-block;flex-shrink:0;"></span>
          ${ph}
        </button>`;
      }).join('')}
    </div>`;

  // Documents from appState
  const phaseDocs = (window.appState && window.appState.documents ? window.appState.documents.slice(0,3) : []);

  // CxL phase team
  const team = [
    { name: 'Sarah Jenkins', role: 'Commissioning Authority (CxA)', initials: 'SJ', color: '#3b82f6' },
    { name: 'Mike Ross',     role: 'Test Engineer',                 initials: 'MR', color: '#10b981' },
    { name: 'David Chen',    role: 'QA/QC Lead',                   initials: 'DC', color: '#f59e0b' }
  ];

  // History from appState.auditLog filtered by entity='PhaseGate'
  const history = (window.appState && window.appState.auditLog)
    ? window.appState.auditLog.filter(log => log.entity === 'PhaseGate' || log.entity === 'Checklist').slice(0, 6)
    : [];

  return `
    <div>
      ${phaseSelectorHtml}
      <div class="cxl-detail-grid">
        <!-- Left Column -->
        <div style="display:flex;flex-direction:column;gap:1.5rem;min-width:0;">
          <!-- Phase Requirements Checklist -->
          <div class="dashboard-card" style="padding:1.5rem;">
            <div class="card-top-title" style="margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
              <span><i data-lucide="check-square"></i> ${activePhase} Phase Gate Requirements — ${completedCount}/${checklist.length} Complete</span>
              <div style="display:flex;align-items:center;gap:0.75rem;">
                ${isApproved
                  ? `<span class="status-badge" style="background:rgba(16,185,129,0.1);color:#10b981;border:1px solid #10b981;padding:0.3rem 0.75rem;font-size:0.78rem;">
                      <i data-lucide="check-circle-2" style="width:13px;height:13px;display:inline;vertical-align:middle;"></i>
                      Approved by ${approvalState.actor} on ${approvalState.ts}
                    </span>`
                  : `<button class="btn btn-primary" onclick="openModal({
                      title: 'Approve Phase Gate: ${activePhase}',
                      bodyHtml: '<div class=\\'info-banner\\' style=\\'padding:0.75rem;background:rgba(37,99,235,0.08);border:1px solid rgba(37,99,235,0.2);border-radius:6px;margin-bottom:1rem;font-size:0.85rem;color:var(--text-secondary);\\'>Approving this gate will sign off all completed requirements and advance the phase status to Approved.</div><div class=\\'form-row\\'><label>Phase Gate</label><span style=\\'font-weight:700;\\'>${activePhase}</span></div><div class=\\'form-row\\'><label>Completed Requirements</label><span>${completedCount} of ${checklist.length}</span></div><div class=\\'form-row\\'><label>Sign-off Notes</label><input id=\\'approve-notes\\' type=\\'text\\' placeholder=\\'All functional tests verified successfully\\' style=\\'width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);\\'/></div>',
                      confirmText: 'Sign-off & Approve ${activePhase}',
                      onConfirm: () => window.approvePhaseGate('${activePhase}')
                    })">
                    <i data-lucide="check-circle-2" style="width:14px;height:14px;"></i> Approve Phase Gate
                  </button>`}
              </div>
            </div>

            <!-- Checklist items -->
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
              ${checklist.length === 0
                ? `<div style="padding:1.5rem;text-align:center;color:var(--text-muted);font-size:0.85rem;">No checklist requirements defined for ${activePhase}.</div>`
                : checklist.map(item => `
                  <div style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;background:var(--bg-card-secondary);border-radius:6px;border-left:4px solid ${item.done ? '#10b981' : '#cbd5e1'};cursor:${isApproved ? 'default' : 'pointer'};transition:opacity 0.15s;flex-wrap:wrap;"
                    ${!isApproved ? `onclick="window.toggleChecklist('${activePhase}', '${item.id}')"` : ''}
                    title="${isApproved ? 'Phase is already approved' : 'Click to toggle: ' + item.id}">
                    <i data-lucide="${item.done ? 'check-circle-2' : 'circle'}" style="color:${item.done ? '#10b981' : 'var(--text-muted)'};width:18px;height:18px;flex-shrink:0;"></i>
                    <div style="flex:1;min-width:160px;word-break:break-word;">
                      <span style="font-size:0.85rem;font-weight:600;text-decoration:${item.done ? 'line-through' : 'none'};opacity:${item.done ? 0.7 : 1};display:inline-block;">${item.task}</span>
                      <span style="font-size:0.7rem;color:var(--text-muted);margin-left:0.4rem;display:inline-block;">${item.id}</span>
                    </div>
                    <span style="font-size:0.68rem;font-weight:700;padding:0.15rem 0.45rem;border-radius:4px;white-space:nowrap;background:${item.done ? 'rgba(16,185,129,0.12)' : 'var(--bg-card)'};color:${item.done ? '#10b981' : 'var(--text-muted)'};border:1px solid ${item.done ? 'rgba(16,185,129,0.3)' : 'var(--border-card)'};">${item.done ? '✓ Completed' : 'Pending'}</span>
                  </div>`).join('')}
            </div>

            <div style="margin-top:1rem;font-size:0.75rem;color:var(--text-muted);text-align:right;">
              ${isApproved ? '🔒 Phase is approved — checklist is locked.' : `Status: <strong>${completedCount} Completed / ${checklist.length - completedCount} Outstanding</strong> (Click any requirement to toggle)`}
            </div>
          </div>

          <!-- Evidence Documentation -->
          <div class="dashboard-card" style="padding:1.5rem;">
            <div class="card-top-title" style="margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
              <span><i data-lucide="file-text"></i> Required Phase Gate Documentation</span>
              <button class="btn" style="font-size:0.75rem;" onclick="window.navigateTo('documents')">Documents Hub</button>
            </div>
            <div class="table-responsive-wrapper">
              <table class="summary-table" style="width:100%;text-align:left;border-collapse:collapse;">
                <tbody>
                  ${phaseDocs.length === 0
                    ? `<tr><td style="padding:1rem;color:var(--text-muted);text-align:center;">No documents linked.</td></tr>`
                    : phaseDocs.map(doc => `
                      <tr style="border-bottom:1px solid var(--border-card);">
                        <td style="padding:0.75rem 0;display:flex;align-items:center;gap:0.75rem;min-width:180px;">
                          <i data-lucide="file-text" style="color:var(--brand-blue);width:16px;height:16px;flex-shrink:0;"></i>
                          <span style="font-weight:500;font-size:0.85rem;word-break:break-all;">${doc.name}</span>
                        </td>
                        <td style="padding:0.75rem 0.5rem;color:var(--text-secondary);text-align:right;font-size:0.8rem;white-space:nowrap;">${doc.size}</td>
                        <td style="padding:0.75rem 0.5rem;color:var(--text-muted);text-align:right;font-size:0.8rem;white-space:nowrap;">${doc.date}</td>
                        <td style="padding:0.75rem 0.5rem;text-align:right;">
                          <button class="btn" style="padding:2px 8px;font-size:11px;background:var(--bg-card-secondary);" onclick="window.navigateTo('documents')">View</button>
                        </td>
                      </tr>`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div style="display:flex;flex-direction:column;gap:1.5rem;">
          <!-- Progress Summary -->
          <div class="dashboard-card" style="padding:1.5rem;display:flex;flex-direction:column;align-items:center;text-align:center;">
            <div class="card-top-title" style="width:100%;text-align:left;margin-bottom:1rem;"><i data-lucide="pie-chart"></i> Project Progress</div>
            <div style="position:relative;width:120px;height:120px;margin-bottom:1rem;">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--bg-card-secondary)" stroke-width="12"/>
                <circle cx="60" cy="60" r="54" fill="none" stroke="#2563eb" stroke-width="12" stroke-dasharray="339.29" stroke-dashoffset="${339.29 - (339.29 * m.overallProgress.percentage / 100)}" stroke-linecap="round" transform="rotate(-90 60 60)"/>
              </svg>
              <div style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;flex-direction:column;">
                <span style="font-size:1.5rem;font-weight:bold;color:var(--text-main);">${m.overallProgress.percentage}%</span>
              </div>
            </div>
            <div style="color:var(--text-secondary);font-size:0.85rem;">Actual Progress</div>
            <div style="margin-top:1rem;width:100%;font-size:0.78rem;color:var(--text-secondary);text-align:left;">
              <div style="display:flex;justify-content:space-between;margin-bottom:0.4rem;"><span>Selected Phase</span><strong style="color:var(--brand-blue);">${activePhase}</strong></div>
              <div style="display:flex;justify-content:space-between;margin-bottom:0.4rem;"><span>Approval</span><strong style="color:${isApproved ? '#10b981' : '#f59e0b'};">${approvalState.status}</strong></div>
              ${isApproved ? `<div style="display:flex;justify-content:space-between;"><span>Approved by</span><strong style="color:var(--text-main);">${approvalState.actor}</strong></div>` : ''}
            </div>
          </div>

          <!-- Phase Gate History — from auditLog -->
          <div class="dashboard-card" style="padding:1.5rem;">
            <div class="card-top-title" style="margin-bottom:1rem;"><i data-lucide="history"></i> Phase Gate History</div>
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
              ${history.length === 0
                ? `<div style="color:var(--text-muted);font-size:0.82rem;text-align:center;">No history entries yet.</div>`
                : history.map(h => `
                  <div style="padding:0.6rem 0.75rem;background:var(--bg-card-secondary);border-radius:6px;border-left:3px solid ${h.action === 'APPROVE' ? '#10b981' : 'var(--brand-blue)'};">
                    <div style="font-weight:600;font-size:0.8rem;color:var(--text-main);">${h.desc}</div>
                    <div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.2rem;">${h.ts} • By ${h.actor}</div>
                  </div>`).join('')}
            </div>
          </div>

          <!-- Commissioning Team -->
          <div class="dashboard-card" style="padding:1.5rem;">
            <div class="card-top-title" style="margin-bottom:1rem;"><i data-lucide="users"></i> Commissioning Team</div>
            <div style="display:flex;flex-direction:column;gap:1rem;">
              ${team.map(t => `
                <div style="display:flex;align-items:center;gap:0.75rem;">
                  <div style="width:36px;height:36px;border-radius:50%;background:${t.color}20;color:${t.color};display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.8rem;border:1px solid ${t.color}50;">${t.initials}</div>
                  <div>
                    <div style="font-weight:600;font-size:0.85rem;color:var(--text-main);">${t.name}</div>
                    <div style="font-size:0.75rem;color:var(--text-secondary);">${t.role}</div>
                  </div>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>`;
}
