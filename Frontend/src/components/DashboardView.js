import {
  topMetricCards,
  activitiesThisWeek,
  weeklyProgressTrend,
  weeklyActivitySummary,
  projectTimelineOverview,
  timelineDetailAhu001,
  projectIdentity
} from '../mockData.js';

/**
 * Dashboard View Component - GANT Executive Overview
 */
export function renderDashboardView() {
  const m = topMetricCards;
  const act = activitiesThisWeek;
  const trend = weeklyProgressTrend;
  const sum = weeklyActivitySummary;
  const gantt = projectTimelineOverview;
  const ahu = timelineDetailAhu001;
  const p = projectIdentity;

  // Live activity summary derived from appState (overrides static mock counts)
  const _acts = (window.appState && window.appState.activities) ? window.appState.activities : [];
  const _actTotal = _acts.length;
  const _actCompleted = _acts.filter(a => a.status === 'Completed').length;
  const _actInProgress = _acts.filter(a => a.status === 'In Progress').length;
  const _actNotStarted = _acts.filter(a => a.status === 'Not Started' || a.status === 'Blocked').length;
  const _actCompletedPct = _actTotal > 0 ? Math.round((_actCompleted / _actTotal) * 100) : 0;
  const _actInProgressPct = _actTotal > 0 ? Math.round((_actInProgress / _actTotal) * 100) : 0;
  const _actNotStartedPct = _actTotal > 0 ? Math.round((_actNotStarted / _actTotal) * 100) : 0;

  // Live selected equipment for timeline detail column
  const _selEqId = (window.appState && window.appState.selectedEquipment) ? window.appState.selectedEquipment : 'AHU-001';
  const _selEqObj = (window.appState && window.appState.equipment) ? window.appState.equipment.find(e => e.id === _selEqId) : null;
  const _selEqName = _selEqObj ? (_selEqObj.name || _selEqId) : ahu.header.name;
  const _selEqLocation = _selEqObj ? `${_selEqObj.buildingName || ''} — ${_selEqObj.room || 'Room unknown'}` : ahu.header.location;
  const _selEqPhase = _selEqObj ? (_selEqObj.phase || ahu.header.activePhase) : ahu.header.activePhase;

  return `
      <!-- LEVEL 1: PROJECT CONTEXT HEADER -->
      <div class="dashboard-card" style="padding: 1rem 1.25rem; margin-bottom: 1.25rem; border-radius: 12px; background: var(--bg-card); border: 1px solid var(--border-card); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <div style="font-size: 0.72rem; font-weight: 700; color: var(--brand-blue); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.2rem;">
            ${p.name} • Executive Overview
          </div>
          <h1 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 0; font-family: var(--font-heading);">
            ${p.fullName}
          </h1>
          <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.2rem;">
            Client: <strong>${p.client}</strong> &nbsp;•&nbsp; Schedule: <strong>${p.startDate} – ${p.endDate}</strong>
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <span class="status-badge badge-green" style="padding: 0.4rem 0.8rem; font-size: 0.75rem; font-weight: 700;">
            <i data-lucide="check-circle-2" style="width: 14px; height: 14px; display: inline; vertical-align: middle;"></i> ON TRACK
          </span>
          <button class="btn btn-primary" onclick="window.navigateTo('gantt')" style="padding: 0.45rem 0.9rem; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 0.4rem;">
            <i data-lucide="gantt-chart-square" style="width: 14px; height: 14px;"></i> View Timeline
          </button>
        </div>
      </div>

      <!-- ====================================================================
           ROW 1: 6 TOP METRIC CARDS
           ==================================================================== -->
      <div class="top-cards-row">
        
        <!-- Card 1: Overall Project Progress -->
        <div class="metric-card overall-progress-card">
          <div class="metric-card-title">Overall Project Progress</div>
          <div class="metric-big-num">${m.overallProgress.percentage}%</div>
          <div>
            <div class="overall-mini-footer">
              <span>Planned ${m.overallProgress.plannedPct}%</span>
              <span class="variance-negative">Variance ${m.overallProgress.variancePct}%</span>
            </div>
            <div class="overall-progress-bar">
              <div class="overall-progress-fill" style="width: ${m.overallProgress.percentage}%;"></div>
            </div>
          </div>
        </div>

        <!-- Card 2: Current Phase -->
        <div class="metric-card" style="text-align: center;">
          <div class="metric-card-title">Current Phase</div>
          <div class="phase-green-badge" onclick="window.navigateTo('cxl')" style="cursor: pointer;" title="View CxL Phase Gate Detail">${m.currentPhase.phase}</div>
          <div>
            <span class="in-progress-pill">${m.currentPhase.status}</span>
          </div>
        </div>

        <!-- Card 3: Project Duration -->
        <div class="metric-card" style="text-align: center;">
          <div class="metric-card-title">Project Duration</div>
          <div class="metric-big-num" style="font-size: 1.5rem;">
            Day <span style="font-size: 1.8rem;">${m.projectDuration.currentDay}</span> / ${m.projectDuration.totalDays}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.65rem; color: var(--text-muted); margin-top: 0.5rem;">
            <div>Start: <strong>${m.projectDuration.startDate}</strong></div>
            <div>End: <strong>${m.projectDuration.endDate}</strong></div>
          </div>
        </div>

        <!-- Card 4: Equipment Summary -->
        <div class="metric-card">
          <div class="metric-card-title">Equipment Summary</div>
          <div class="equipment-summary-content">
            <div>
              <div class="metric-big-num">${m.equipmentSummary.total}</div>
              <div style="font-size: 0.65rem; color: var(--text-muted); font-weight: 600;">Total Equipment</div>
            </div>
            <div class="equipment-legend-list">
              ${m.equipmentSummary.breakdown.map(item => `
                <div class="equipment-legend-item">
                  <span class="dot-indicator" style="background-color: ${item.color};"></span>
                  <span style="color: var(--text-secondary);">${item.label}</span>
                  <span style="font-weight: 700;">${item.count}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Card 5: Documents Need Action -->
        <div class="metric-card" onclick="window.navigateTo('documents')" style="cursor: pointer;" title="View Documents Hub">
          <div class="metric-card-title">Documents Need Action</div>
          <div class="docs-action-content">
            <div class="docs-icon-box">
              <i data-lucide="file-text" style="width: 22px; height: 22px;"></i>
            </div>
            <div>
              <div class="metric-big-num" style="font-size: 1.7rem; color: #f97316;">${m.documentsNeedAction.total}</div>
            </div>
            <div class="docs-breakdown">
              ${m.documentsNeedAction.breakdown.map(b => `
                <div><span style="color: ${b.color}; font-weight: 700;">${b.count}</span> <span style="color: var(--text-secondary); font-size: 0.62rem;">${b.label}</span></div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Card 6: NAS / Storage Status (Demo) -->
        <div class="metric-card" onclick="window.navigateTo('nas-files')" style="cursor: pointer;" title="View NAS File Manager">
          <div class="metric-card-title">NAS Storage — Demo</div>
          <div class="nas-card-top-content">
            <div class="nas-server-icon-box">
              <i data-lucide="server" style="width: 20px; height: 20px;"></i>
            </div>
            <div style="font-size: 0.7rem;">
              <div style="font-weight: 700;">${m.nasStorage.serverName}</div>
              <div style="color: var(--text-muted); font-size: 0.62rem;">${m.nasStorage.ip}</div>
              <div style="color: #10b981; font-weight: 600; font-size: 0.62rem;">${m.nasStorage.status} (Demo)</div>
            </div>
          </div>
          <div style="margin-top: 0.4rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.65rem; font-weight: 600;">
              <span>Used ${m.nasStorage.usedTB} / ${m.nasStorage.totalTB}</span>
              <span>${m.nasStorage.percentage}%</span>
            </div>
            <div class="nas-storage-bar" style="margin: 0.2rem 0;">
              <div class="nas-storage-fill"></div>
            </div>
            <div style="font-size: 0.62rem; color: #10b981; font-weight: 600;">
              • ${m.nasStorage.raidStatus} (Simulated)
            </div>
          </div>
        </div>

      </div>


      <!-- ====================================================================
           ROW 2: OPERATIONAL ACTIVITY OVERVIEW (2 CARDS)
           ==================================================================== -->
      <div class="middle-cards-row">
        
        <!-- Card 1: Activities This Week -->
        <div class="dashboard-card">
          <div class="card-top-title">
            <span>Activities This Week</span>
          </div>

          <!-- 4 Mini Stat Boxes -->
          <div class="four-stat-boxes">
            <div class="stat-mini-box">
              <div style="color: #2563eb; font-size: 0.75rem; margin-bottom: 0.1rem;"><i data-lucide="calendar" style="width:14px; height:14px;"></i></div>
              <div class="num">${_actTotal}</div>
              <div class="sub">Total (Session)</div>
            </div>

            <div class="stat-mini-box">
              <div style="color: #10b981; font-size: 0.75rem; margin-bottom: 0.1rem;"><i data-lucide="check-circle-2" style="width:14px; height:14px;"></i></div>
              <div class="num" style="color: #10b981;">${_actCompleted}</div>
              <div class="sub">Completed (${_actCompletedPct}%)</div>
            </div>

            <div class="stat-mini-box">
              <div style="color: #f59e0b; font-size: 0.75rem; margin-bottom: 0.1rem;"><i data-lucide="rotate-cw" style="width:14px; height:14px;"></i></div>
              <div class="num" style="color: #f59e0b;">${_actInProgress}</div>
              <div class="sub">In Progress (${_actInProgressPct}%)</div>
            </div>

            <div class="stat-mini-box">
              <div style="color: #64748b; font-size: 0.75rem; margin-bottom: 0.1rem;"><i data-lucide="clock" style="width:14px; height:14px;"></i></div>
              <div class="num" style="color: #64748b;">${_actNotStarted}</div>
              <div class="sub">Not Started (${_actNotStartedPct}%)</div>
            </div>
          </div>

          <!-- Split Bottom: Upcoming Activities vs Issues & Risks -->
          <div class="activities-split-bottom">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 700; margin-bottom: 0.35rem;">
                <span><i data-lucide="calendar" style="width: 12px; height: 12px; display: inline;"></i> Upcoming Activities</span>
                <a href="#" class="view-all-link">View All</a>
              </div>
              <div class="upcoming-act-list">
                ${act.upcomingActivities.map(item => `
                  <div class="act-row-item">
                    <span style="color: var(--text-muted); font-size: 0.65rem; width: 42px;">${item.date}</span>
                    <span style="font-weight: 600; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</span>
                    <span style="font-size: 0.62rem; font-weight: 700; color: ${item.phaseColor}; margin-left: 0.25rem;">${item.phase}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 700; margin-bottom: 0.35rem; color: #ef4444;">
                <span><i data-lucide="alert-triangle" style="width: 12px; height: 12px; display: inline;"></i> Issues & Risks</span>
                <a href="#" class="view-all-link">View All</a>
              </div>
              <div class="issues-risks-list">
                ${act.issuesAndRisks.map(risk => `
                  <div class="act-row-item">
                    <span class="risk-num-badge" style="color: ${risk.color};">${risk.count}</span>
                    <span style="flex: 1; color: var(--text-secondary); font-size: 0.68rem; margin-left: 0.35rem;">${risk.label}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Weekly Activity Summary -->
        <div class="dashboard-card">
          <div class="card-top-title">
            <span>Weekly Activity Summary</span>
            <div style="font-size: 0.68rem; font-weight: 600; color: var(--text-muted); display: flex; align-items: center; gap: 0.25rem;">
              <span>Reporting Week: 03–08 Aug 2026</span>
              <i data-lucide="calendar" style="width: 12px; height: 12px;"></i>
            </div>
          </div>

          <!-- Top Summary Counters -->
          <div class="weekly-summary-top">
            <div>
              <span style="color: var(--text-muted);">Planned</span>
              <div style="font-weight: 800; font-size: 1rem;">${sum.topSummary.planned}</div>
            </div>
            <div>
              <span style="color: #10b981;"><i data-lucide="check-circle-2" style="width:12px; display:inline;"></i> Completed</span>
              <div style="font-weight: 800; font-size: 0.9rem; color: #10b981;">${sum.topSummary.completed.count} <span style="font-weight: 500; font-size: 0.7rem;">(${sum.topSummary.completed.pct}%)</span></div>
            </div>
            <div>
              <span style="color: #f59e0b;"><i data-lucide="rotate-cw" style="width:12px; display:inline;"></i> In Progress</span>
              <div style="font-weight: 800; font-size: 0.9rem; color: #f59e0b;">${sum.topSummary.inProgress.count} <span style="font-weight: 500; font-size: 0.7rem;">(${sum.topSummary.inProgress.pct}%)</span></div>
            </div>
            <div>
              <span style="color: #64748b;"><i data-lucide="clock" style="width:12px; display:inline;"></i> Not Started</span>
              <div style="font-weight: 800; font-size: 0.9rem; color: #64748b;">${sum.topSummary.notStarted.count} <span style="font-weight: 500; font-size: 0.7rem;">(${sum.topSummary.notStarted.pct}%)</span></div>
            </div>
            <div style="text-align: right;">
              <span style="color: var(--brand-blue); font-weight: 600;">Weekly Progress</span>
              <div style="font-weight: 800; font-size: 1.1rem; color: var(--brand-blue);">${sum.topSummary.weeklyProgressPct}%</div>
            </div>
          </div>

          <!-- Cx Level Table -->
          <table class="summary-table">
            <thead>
              <tr>
                <th>Cx Level</th>
                <th>Planned</th>
                <th>Completed</th>
                <th>In Progress</th>
                <th>Not Started</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              ${sum.tableRows.map(r => `
                <tr class="${r.isTotal ? 'total-row' : ''}">
                  <td><strong>${r.phase}</strong></td>
                  <td>${r.planned}</td>
                  <td>${r.completed}</td>
                  <td>${r.inProgress}</td>
                  <td>${r.notStarted}</td>
                  <td>
                    <span>${r.progressPct}%</span>
                    <div class="mini-bar-progress">
                      <div class="mini-bar-progress-fill" style="width: ${r.progressPct}%;"></div>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

      </div>


      <!-- ====================================================================
           ROW 3: TIMELINE & EQUIPMENT DETAIL (2-COLUMN GRID)
           Column 1: Gantt Overview (Top) + Weekly Progress Trend (Bottom)
           Column 2: Timeline Detail - AHU-001
           ==================================================================== -->
      <div class="bottom-cards-row" style="display: grid; grid-template-columns: 1.25fr 1fr; gap: 1rem; align-items: stretch;">
        
        <!-- COLUMN 1: Gantt Overview + Weekly Progress Trend Stacked -->
        <div style="display: flex; flex-direction: column; gap: 1rem; min-width: 0;">
          
          <!-- Card 1A: Project Timeline Overview (Gantt View) -->
          <div class="dashboard-card" style="flex: initial;">
            <div class="card-top-title" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem;">
              <span>Project Timeline Overview (GANT View)</span>
              <button class="btn btn-primary" onclick="window.navigateTo('gantt')" style="font-size: 0.72rem; padding: 0.25rem 0.5rem;">
                Full GANT View
              </button>
            </div>

            <div class="gantt-view-split">
              <!-- Timeline Filters Column -->
              <div class="timeline-filters-col">
                <div style="font-weight: 700; color: var(--text-main); font-size: 0.72rem; margin-bottom: 0.4rem;">Timeline Filter</div>
                
                <div class="filter-group" style="margin-bottom: 0.4rem;">
                  <label style="font-size: 0.68rem; margin-bottom: 2px;">Building</label>
                  <select style="padding: 3px 6px; font-size: 0.7rem;"><option>All Buildings</option></select>
                </div>

                <div class="filter-group" style="margin-bottom: 0.4rem;">
                  <label style="font-size: 0.68rem; margin-bottom: 2px;">Room</label>
                  <select style="padding: 3px 6px; font-size: 0.7rem;"><option>All Rooms</option></select>
                </div>

                <div class="filter-group" style="margin-bottom: 0.4rem;">
                  <label style="font-size: 0.68rem; margin-bottom: 2px;">Equipment Type</label>
                  <select style="padding: 3px 6px; font-size: 0.7rem;"><option>All Types</option></select>
                </div>

                <div class="filter-group" style="margin-bottom: 0.2rem;">
                  <label style="font-size: 0.68rem; margin-bottom: 2px;">Cx Status</label>
                  <select style="padding: 3px 6px; font-size: 0.7rem;"><option>All Phases</option></select>
                </div>
              </div>

              <!-- Gantt Chart Area -->
              <div class="gantt-chart-area" style="flex: 1; min-width: 0; border: 1px solid var(--border-card); border-radius: 8px; background: var(--bg-card); position: relative;">
                <div style="width: 100%; min-width: 0; position: relative;">
                  
                  <!-- 2-TIER CALENDAR DATE AXIS HEADER -->
                  <div style="display: grid; grid-template-columns: 95px repeat(8, 1fr); border-bottom: 1px solid var(--border-card); background: var(--bg-card-secondary); padding: 5px 0; text-align: center; font-size: 10px; color: var(--text-main); font-weight: bold;">
                    <div style="text-align: left; padding-left: 6px;">Eq ID</div>
                    <div>Aug 2026</div><div>Sep 2026</div><div>Oct 2026</div><div>Nov 2026</div><div>Dec 2026</div><div>Jan 2027</div><div>Feb 2027</div><div>Mar 2027</div>
                  </div>
                  <div style="display: grid; grid-template-columns: 95px repeat(8, 1fr); border-bottom: 2px solid var(--border-card); background: var(--bg-card-secondary); padding: 2px 0; text-align: center; font-size: 8.5px; color: var(--text-muted);">
                    <div style="text-align: left; padding-left: 6px; font-weight: 600;">Phase Gates</div>
                    <div>W1–W4</div><div>W5–W8</div><div>W9–W12</div><div>W13–W16</div><div>W17–W20</div><div>W21–W24</div><div>W25–W28</div><div>W29–W32</div>
                  </div>
                  
                  <!-- Today Indicator Line -->
                  <div style="position: absolute; left: 16%; top: 0; bottom: 0; width: 2px; background: rgba(239, 68, 68, 0.4); z-index: 10; border-right: 1px dashed #ef4444;"></div>
                  <div style="position: absolute; left: 14%; top: 3px; font-size: 8px; font-weight: bold; color: #ef4444; z-index: 11; background: var(--bg-card); padding: 1px 3px; border-radius: 3px; border: 1px solid #ef4444;">Today</div>

                  <!-- Equipment Timeline Rows -->
                  ${gantt.equipments.map((eq, i) => `
                    <div style="display: grid; grid-template-columns: 95px 1fr; border-bottom: 1px solid var(--border-card); padding: 4px 0; position: relative; height: 36px; align-items: center;">
                      <div style="padding-left: 6px; font-size: 10.5px; font-weight: 600; color: var(--brand-blue); cursor: pointer;" onclick="window.selectEquipment('${eq.id}'); window.navigateTo('equipment-timeline');">
                        ${eq.name}
                        <div style="font-size: 8px; color: var(--text-muted); font-weight: normal;">${eq.type}</div>
                      </div>
                      <div style="position: relative; height: 100%; width: 100%;">
                        <!-- Background Grid Lines -->
                        <div style="position: absolute; left: 0%; top: 0; bottom: 0; width: 12.5%; border-right: 1px stroke var(--border-card); opacity: 0.3;"></div>
                        <div style="position: absolute; left: 12.5%; top: 0; bottom: 0; width: 12.5%; border-right: 1px stroke var(--border-card); opacity: 0.3;"></div>
                        <div style="position: absolute; left: 25%; top: 0; bottom: 0; width: 12.5%; border-right: 1px stroke var(--border-card); opacity: 0.3;"></div>
                        <div style="position: absolute; left: 37.5%; top: 0; bottom: 0; width: 12.5%; border-right: 1px stroke var(--border-card); opacity: 0.3;"></div>
                        <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 12.5%; border-right: 1px stroke var(--border-card); opacity: 0.3;"></div>
                        <div style="position: absolute; left: 62.5%; top: 0; bottom: 0; width: 12.5%; border-right: 1px stroke var(--border-card); opacity: 0.3;"></div>
                        <div style="position: absolute; left: 75%; top: 0; bottom: 0; width: 12.5%; border-right: 1px stroke var(--border-card); opacity: 0.3;"></div>

                        <!-- Phase Bars -->
                        <div style="position: absolute; left: ${2 + i * 1.2}%; width: 14%; height: 12px; top: 4px; background: #2563eb; border-radius: 3px; cursor: pointer; opacity: 0.9;" title="${eq.name} — Delivery Phase (click to view timeline)" onclick="window.selectEquipment('${eq.id}'); window.navigateTo('equipment-timeline');"></div>
                        <div style="position: absolute; left: ${12 + i * 1.2}%; width: 18%; height: 12px; top: 4px; background: #10b981; border-radius: 3px; cursor: pointer; opacity: 0.85;" title="${eq.name} — CxL2 Pre-Cx (click to view timeline)" onclick="window.selectEquipment('${eq.id}'); window.navigateTo('equipment-timeline');"></div>
                        <div style="position: absolute; left: ${25 + i * 1.2}%; width: 25%; height: 12px; top: 4px; background: #f97316; border-radius: 3px; cursor: pointer; opacity: 0.9; border: 1px solid #ea580c;" title="${eq.name} — CxL3 Startup Active (click to view timeline)" onclick="window.selectEquipment('${eq.id}'); window.navigateTo('equipment-timeline');"></div>
                        <div style="position: absolute; left: ${45 + i * 1.2}%; width: 22%; height: 12px; top: 4px; background: #8b5cf6; border-radius: 3px; cursor: pointer; opacity: 0.85;" title="${eq.name} — CxL4 Functional (click to view timeline)" onclick="window.selectEquipment('${eq.id}'); window.navigateTo('equipment-timeline');"></div>
                        <div style="position: absolute; left: ${62 + i * 1.2}%; width: 24%; height: 12px; top: 4px; background: #ef4444; border-radius: 3px; cursor: pointer; opacity: 0.85;" title="${eq.name} — CxL5 Integrated (click to view timeline)" onclick="window.selectEquipment('${eq.id}'); window.navigateTo('equipment-timeline');"></div>
                      </div>
                    </div>
                  `).join('')}

                </div>

                <!-- Color Legend -->
                <div class="gantt-color-legend" style="display: flex; gap: 10px; padding: 5px 8px; font-size: 9.5px; color: var(--text-secondary); border-top: 1px solid var(--border-card); background: var(--bg-card-secondary); justify-content: center; flex-wrap: wrap;">
                  <div style="display: flex; align-items: center; gap: 4px;"><div style="width: 8px; height: 8px; background: #2563eb; border-radius: 2px;"></div> Delivery</div>
                  <div style="display: flex; align-items: center; gap: 4px;"><div style="width: 8px; height: 8px; background: #10b981; border-radius: 2px;"></div> CxL2 (Pre-Cx)</div>
                  <div style="display: flex; align-items: center; gap: 4px;"><div style="width: 8px; height: 8px; background: #f97316; border-radius: 2px; border: 1px solid #ea580c;"></div> CxL3 (Startup)</div>
                  <div style="display: flex; align-items: center; gap: 4px;"><div style="width: 8px; height: 8px; background: #8b5cf6; border-radius: 2px;"></div> CxL4 (Functional)</div>
                  <div style="display: flex; align-items: center; gap: 4px;"><div style="width: 8px; height: 8px; background: #ef4444; border-radius: 2px;"></div> CxL5 (Integrated)</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 1B: Weekly Progress Trend (Stacked directly under Card 1A) -->
          <div class="dashboard-card" style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div class="card-top-title" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <span>Weekly Progress Trend</span>
                <span style="font-size: 0.68rem; color: var(--text-muted); font-weight: normal;">(${trend.callout.week})</span>
              </div>
              <div style="display: flex; gap: 0.75rem; font-size: 0.68rem; color: var(--text-secondary); align-items: center;">
                <div style="display: flex; align-items: center; gap: 0.3rem;">
                  <span style="width: 7px; height: 7px; background: #2563eb; transform: rotate(45deg);"></span>
                  <span>Planned: <strong style="color: #2563eb;">${trend.callout.planned}</strong></span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.3rem;">
                  <span style="width: 7px; height: 7px; background: #10b981; transform: rotate(45deg);"></span>
                  <span>Actual: <strong style="color: #10b981;">${trend.callout.actual}</strong></span>
                </div>
                <div style="color: #ef4444; font-weight: 700;">
                  Var: ${trend.callout.variance}
                </div>
              </div>
            </div>

            <div class="trend-chart-container" style="position: relative; padding: 4px 6px; background: var(--bg-card-secondary); border: 1px solid var(--border-card); border-radius: 6px; flex: 1; display: flex; align-items: center;">
              <!-- SVG Line Chart -->
              <svg width="100%" height="95" viewBox="0 0 500 95" preserveAspectRatio="none" style="overflow: visible;">
                <!-- Grid lines -->
                <line x1="30" y1="12" x2="485" y2="12" stroke="#e2e8f0" stroke-dasharray="3,3" stroke-width="1"/>
                <line x1="30" y1="36" x2="485" y2="36" stroke="#e2e8f0" stroke-dasharray="3,3" stroke-width="1"/>
                <line x1="30" y1="60" x2="485" y2="60" stroke="#e2e8f0" stroke-dasharray="3,3" stroke-width="1"/>

                <!-- Y Axis Labels -->
                <text x="2" y="15" font-size="7.5" fill="#94a3b8" font-weight="600">100%</text>
                <text x="2" y="39" font-size="7.5" fill="#94a3b8" font-weight="600">65%</text>
                <text x="2" y="63" font-size="7.5" fill="#94a3b8" font-weight="600">30%</text>
                <text x="10" y="84" font-size="7.5" fill="#94a3b8" font-weight="600">0%</text>

                <!-- Planned Line (Blue) -->
                <polyline fill="none" stroke="#2563eb" stroke-width="2" points="
                  35,84  80,73  125,60  170,48  215,36  260,26  305,18  350,13  395,10  440,6
                "/>

                <!-- Actual Line (Green) -->
                <polyline fill="none" stroke="#10b981" stroke-width="2" points="
                  35,86  80,76  125,65  170,54  215,42  260,33  305,25  350,19  395,15  440,10
                "/>

                <!-- Data Dots -->
                <circle cx="215" cy="36" r="3.5" fill="#2563eb" stroke="#ffffff" stroke-width="1.5"/>
                <circle cx="215" cy="42" r="3.5" fill="#10b981" stroke="#ffffff" stroke-width="1.5"/>

                <!-- X Axis Labels -->
                ${trend.weeks.map((w, idx) => `
                  <text x="${35 + idx * 45}" y="92" font-size="7.5" fill="#64748b" font-weight="600" text-anchor="middle">${w}</text>
                `).join('')}
              </svg>
            </div>
          </div>

        </div>

        <!-- COLUMN 2: Card 2 - Timeline Detail - AHU-001 -->
        <div class="dashboard-card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div class="card-top-title" style="display:flex;justify-content:space-between;align-items:center;">
              <span>Timeline Detail — <span style="color:var(--brand-blue);">${_selEqId}</span> (${_selEqName})</span>
              <button class="btn" onclick="window.navigateTo('equipment-timeline')" style="font-size:0.7rem;padding:0.2rem 0.5rem;">Full View</button>
            </div>

            <!-- Equipment Info 4-Card Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(125px, 1fr)); gap: 8px; margin-bottom: 10px; padding: 8px 10px; background: var(--bg-card-secondary); border-radius: 8px; border: 1px solid var(--border-card);">
              <div>
                <div style="font-size: 9px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">Equipment</div>
                <div style="font-size: 11.5px; font-weight: 700; color: var(--brand-blue); margin-top: 1px;">${_selEqId}</div>
                <div style="font-size: 9px; color: var(--text-secondary);">${_selEqName}</div>
              </div>
              <div>
                <div style="font-size: 9px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">Location</div>
                <div style="font-size: 10.5px; font-weight: 600; color: var(--text-main); margin-top: 1px;">${_selEqLocation}</div>
              </div>
              <div>
                <div style="font-size: 9px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">Active Phase</div>
                <span class="status-badge" style="background: rgba(249,115,22,0.15); color: #f97316; font-size: 9.5px; font-weight: 700; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 2px;">
                  ${_selEqPhase}
                </span>
              </div>
              <div>
                <div style="font-size: 9px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">Schedule Window</div>
                <div style="font-size: 10.5px; font-weight: 600; color: var(--text-main); margin-top: 1px; white-space: nowrap;">${ahu.header.startDate} – ${ahu.header.endDate}</div>
              </div>
            </div>

            <!-- Phase Table -->
            <table class="detail-phase-table" style="margin-bottom: 0.75rem;">
              <thead>
                <tr>
                  <th>Phase Gate</th>
                  <th>Schedule Window</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                ${ahu.rows.map(r => `
                  <tr>
                    <td><strong>${r.phase}</strong></td>
                    <td style="white-space: nowrap;">${r.dates}</td>
                    <td>${r.duration}</td>
                    <td><span class="status-badge" style="font-size: 0.68rem; padding: 2px 5px; background: ${r.barColor}20; color: ${r.barColor}; font-weight: 700;">${r.status}</span></td>
                    <td>
                      <div style="display: flex; align-items: center; gap: 5px;">
                        <div class="mini-bar-progress" style="flex: 1;">
                          <div class="mini-bar-progress-fill" style="width: ${r.progressPct}%; background-color: ${r.barColor};"></div>
                        </div>
                        <span style="font-size: 0.68rem; font-weight: 600;">${r.progressPct}%</span>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div>
            <!-- Duration Summary Cards -->
            <div style="font-weight: 700; font-size: 0.7rem; margin-bottom: 0.25rem;">Duration Summary</div>
            <div class="duration-summary-row" style="margin-bottom: 0.4rem;">
              ${ahu.durationSummaries.map(d => `
                <div class="duration-box" style="padding: 6px 8px;">
                  <div style="font-size: 9px;">${d.label}</div>
                  <div class="days-num" style="color: ${d.color}; font-size: 0.95rem;">${d.value}</div>
                </div>
              `).join('')}
            </div>

            <!-- Footer Overlap Notes -->
            <div class="timeline-notes-footer" style="padding-top: 4px; margin-top: 0;">
              <div><i data-lucide="info" style="width: 11px; height: 11px; display: inline; color: #2563eb;"></i> <strong>Note:</strong> CxL2 &amp; CxL3 overlap is allowed (Demo Visualization)</div>
              <div>CxL3 &amp; CxL4 overlap is allowed (Demo Visualization)</div>
            </div>
          </div>
        </div>

      </div>
  `;
}
