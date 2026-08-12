import { projectTimelineOverview, timelineDetailAhu001, masterEquipmentList, projectIdentity, topMetricCards } from '../mockData.js';
import { openModal, showToast } from './Modal.js';

window._openAddMilestoneModal = function() {
  openModal({
    title: 'Add Schedule Baseline Milestone',
    bodyHtml: `
      <div class="form-row"><label>Milestone Title <span style="color:#ef4444;">*</span></label><input id="ms-title" type="text" placeholder="e.g. Substation Energization" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Target Date <span style="color:#ef4444;">*</span></label><input id="ms-date" type="date" value="2026-10-15" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);"></div>
      <div class="form-row"><label>Phase Gate</label><select id="ms-phase" style="width:100%;padding:0.5rem;border:1px solid var(--border-card);border-radius:4px;background:var(--bg-card-secondary);color:var(--text-main);">
        <option>Delivery</option><option>CxL2</option><option selected>CxL3</option><option>CxL4</option><option>CxL5</option>
      </select></div>`,
    confirmText: 'Create Milestone',
    onConfirm: (overlay) => {
      const name  = overlay.querySelector('#ms-title')?.value?.trim();
      const date  = overlay.querySelector('#ms-date')?.value?.trim();
      const phase = overlay.querySelector('#ms-phase')?.value;
      const res = window.createMilestone({ name, date, phase });
      if (!res.ok) { showToast(res.error, 'danger'); return false; }
      showToast(`Milestone "${name}" created for ${date}.`, 'success');
      window.renderApp();
    }
  });
};

export function renderGanttView(subRoute = 'gantt') {
    const activeTab = subRoute || 'gantt';
    const m = topMetricCards;
    const p = projectIdentity;

    const tabsHtml = `
        <div class="view-tabs">
            <span class="view-tab ${activeTab === 'gantt' ? 'active' : ''}" data-route="gantt"><i data-lucide="gantt-chart-square" style="width:16px;height:16px;"></i> Timeline Overview</span>
            <span class="view-tab ${activeTab === 'equipment-timeline' ? 'active' : ''}" data-route="equipment-timeline"><i data-lucide="hard-drive" style="width:16px;height:16px;"></i> Equipment Timeline</span>
            <span class="view-tab ${activeTab === 'phase-progress' ? 'active' : ''}" data-route="phase-progress"><i data-lucide="workflow" style="width:16px;height:16px;"></i> Phase Progress</span>
            <span class="view-tab ${activeTab === 'duration-analysis' ? 'active' : ''}" data-route="duration-analysis"><i data-lucide="clock" style="width:16px;height:16px;"></i> Duration Analysis</span>
        </div>
    `;

    let contentHtml = '';

    // ==========================================
    // TAB 1: TIMELINE OVERVIEW (GANTT CHART)
    // ==========================================
    if (activeTab === 'gantt') {

        // Read active filters from global state
        const gf = (window.appState && window.appState.ganttFilters) || { building: 'all', equipmentType: 'all', phase: 'all' };

        // Map equipment type filter values to the masterEquipmentList 'type' field
        const typeMap = {
            'ahu - air handling unit': 'Air Handling Unit',
            'chp - chiller pump': 'Chiller Pump',
            'fcu - fan coil unit': 'Fan Coil Unit',
            'pau - primary air unit': 'Primary Air Unit',
            'vrf - vrf system': 'VRF System',
            'pmp - water pump': 'Water Pump'
        };

        // Phase filter maps option text → phase field fragment
        const phaseMap = {
            'delivery phase': 'Delivery',
            'cxl2 pre-commissioning': 'CxL2',
            'cxl3 startup (active)': 'CxL3',
            'cxl4 functional testing': 'CxL4',
            'cxl5 integrated testing': 'CxL5'
        };

        // Filter appState.equipment (or fallback to masterEquipmentList) based on active filter state
        const equipmentSource = (window.appState && window.appState.equipment && window.appState.equipment.length > 0) ? window.appState.equipment : masterEquipmentList;
        let filteredEquipment = equipmentSource.filter(item => {
            const buildingName = item.buildingName || item.building || '';
            const buildingOk = gf.building === 'all' || buildingName.toLowerCase() === gf.building.toLowerCase();
            const typeOk = gf.equipmentType === 'all' || item.type === (typeMap[gf.equipmentType.toLowerCase()] || gf.equipmentType);
            const phaseVal = phaseMap[gf.phase.toLowerCase()] || gf.phase;
            const phaseOk = gf.phase === 'all' || (item.phase || '').toLowerCase().includes(phaseVal.toLowerCase());
            return buildingOk && typeOk && phaseOk;
        });

        const rows = filteredEquipment.map((item, i) => {
            const eq = item.id;
            const type = item.type;
            const phase = item.phase;
            const buildingDisplay = item.buildingName || item.building || '';
            const roomDisplay = item.room || '';
            return `
            <div style="display: grid; grid-template-columns: 120px 1fr; border-bottom: 1px solid var(--border-card); padding: 10px 0; position: relative; height: 50px; align-items: center;">
                <div style="padding-left: 10px; font-size: 13px; font-weight: 600; color: var(--brand-blue); cursor: pointer;" onclick="openModal({
                    title: 'Equipment Milestone Detail: ${eq}',
                    bodyHtml: '<div class=\\'form-row\\'><label>Equipment ID</label><span>${eq}</span></div><div class=\\'form-row\\'><label>Equipment Type</label><span>${type}</span></div><div class=\\'form-row\\'><label>Current Phase Gate</label><span class=\\'status-badge badge-blue\\'>${phase}</span></div><div class=\\'form-row\\'><label>Building / Room</label><span>${buildingDisplay} / ${roomDisplay}</span></div>',
                    confirmText: 'View Timeline',
                    onConfirm: () => { window.selectEquipment('${eq}'); window.navigateTo('equipment-timeline'); }
                })">
                    ${eq}
                    <div style="font-size: 10px; color: var(--text-muted); font-weight: normal;">${type}</div>
                </div>
                <div style="position: relative; height: 100%; width: 100%;">
                    <div style="position: absolute; left: ${2 + i * 1.5}%; width: 14%; height: 18px; top: 4px; background: #2563eb; border-radius: 4px; cursor: pointer; opacity: 0.9;" title="${eq} - Delivery" onclick="window.selectEquipment('${eq}'); window.navigateTo('equipment-timeline');"></div>
                    <div style="position: absolute; left: ${12 + i * 1.5}%; width: 18%; height: 18px; top: 4px; background: #10b981; border-radius: 4px; cursor: pointer; opacity: 0.85;" title="${eq} - CxL2 Pre-Cx" onclick="window.selectEquipment('${eq}'); window.navigateTo('equipment-timeline');"></div>
                    <div style="position: absolute; left: ${25 + i * 1.5}%; width: 25%; height: 18px; top: 4px; background: #f97316; border-radius: 4px; cursor: pointer; opacity: 0.9; border: 1.5px solid #ea580c;" title="${eq} - CxL3 Startup (Current Active)" onclick="window.selectEquipment('${eq}'); window.navigateTo('equipment-timeline');"></div>
                    <div style="position: absolute; left: ${45 + i * 1.5}%; width: 22%; height: 18px; top: 4px; background: #8b5cf6; border-radius: 4px; cursor: pointer; opacity: 0.85;" title="${eq} - CxL4 Functional" onclick="window.selectEquipment('${eq}'); window.navigateTo('equipment-timeline');"></div>
                    <div style="position: absolute; left: ${62 + i * 1.5}%; width: 24%; height: 18px; top: 4px; background: #ef4444; border-radius: 4px; cursor: pointer; opacity: 0.85;" title="${eq} - CxL5 Integrated" onclick="window.selectEquipment('${eq}'); window.navigateTo('equipment-timeline');"></div>
                    <div style="position: absolute; left: 25%; top: 25px; font-size: 9px; font-weight: 700; color: #f59e0b; background: rgba(245,158,11,0.15); padding: 1px 4px; border-radius: 3px;">CxL2/3 Overlap</div>
                    <div style="position: absolute; left: 45%; top: 25px; font-size: 9px; font-weight: 700; color: #8b5cf6; background: rgba(139,92,246,0.15); padding: 1px 4px; border-radius: 3px;">CxL3/4 Overlap</div>
                </div>
            </div>
        `; }).join('');

        const emptyRowHtml = filteredEquipment.length === 0
            ? `<div style="padding: 2.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;"><i data-lucide="search-x" style="width:32px;height:32px;margin-bottom:0.5rem;display:block;margin-left:auto;margin-right:auto;"></i>No equipment matches the selected filters.<br><button class="btn" style="margin-top:0.75rem;font-size:0.75rem;" onclick="window.resetGanttFilters()">Reset Filters</button></div>`
            : '';

        contentHtml = `
            <div class="dashboard-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <h2 class="card-top-title" style="margin: 0;">Project Timeline &amp; Commissioning GANT</h2>
                        <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                            Project: <strong>${p.name}</strong> &nbsp;•&nbsp; Schedule: <strong>${p.startDate} – ${p.endDate}</strong> &nbsp;•&nbsp; Active Phase: <strong style="color: #f97316;">${m.currentPhase.phase}</strong> &nbsp;•&nbsp; <span style="color: var(--text-muted); font-size: 11px;">Showing ${filteredEquipment.length} of ${equipmentSource.length} equipment</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn" style="background: var(--bg-card-secondary); border: 1px solid var(--border-card); color: var(--text-main);" onclick="window._openAddMilestoneModal()"><i data-lucide="plus" style="width: 14px; height: 14px;"></i> Add Milestone</button>
                        <button class="btn btn-primary" onclick="window._ganttExportCsv()" style="display:flex;align-items:center;gap:0.4rem;"><i data-lucide="download" style="width: 14px; height: 14px;"></i> Export Timeline</button>
                    </div>
                </div>

                <div class="gantt-view-split" style="display: flex; gap: 20px; flex-wrap: wrap;">
                    <!-- Filters Panel (wired to appState) -->
                    <div style="width: 240px; background: var(--bg-card-secondary); padding: 15px; border-radius: 8px; border: 1px solid var(--border-card); flex-shrink: 0;">
                        <h3 style="margin-top: 0; font-size: 14px; color: var(--text-main); margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
                            <span>Timeline Filters</span>
                            <i data-lucide="filter" style="width: 14px; height: 14px; color: var(--text-muted);"></i>
                        </h3>
                        <div class="filter-group" style="margin-bottom: 12px;">
                            <label style="display: block; font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">Building</label>
                            <select class="filter-select" style="width: 100%;" onchange="window.setGanttFilter('building', this.value === 'All Buildings' ? 'all' : this.value)">
                                <option ${gf.building === 'all' ? 'selected' : ''}>All Buildings</option>
                                ${((window.appState && window.appState.buildings) ? window.appState.buildings : [{name:'Building A'},{name:'Building B'},{name:'Building C'}]).map(b => `<option ${gf.building === b.name ? 'selected' : ''}>${window.escapeHtml(b.name)}</option>`).join('')}
                            </select>
                        </div>
                        <div class="filter-group" style="margin-bottom: 12px;">
                            <label style="display: block; font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">Equipment Type</label>
                            <select class="filter-select" style="width: 100%;" onchange="window.setGanttFilter('equipmentType', this.value === 'All Types' ? 'all' : this.value)">
                                <option ${gf.equipmentType === 'all' ? 'selected' : ''}>All Types</option>
                                <option ${gf.equipmentType === 'AHU - Air Handling Unit' ? 'selected' : ''}>AHU - Air Handling Unit</option>
                                <option ${gf.equipmentType === 'CHP - Chiller Pump' ? 'selected' : ''}>CHP - Chiller Pump</option>
                                <option ${gf.equipmentType === 'FCU - Fan Coil Unit' ? 'selected' : ''}>FCU - Fan Coil Unit</option>
                                <option ${gf.equipmentType === 'PAU - Primary Air Unit' ? 'selected' : ''}>PAU - Primary Air Unit</option>
                                <option ${gf.equipmentType === 'VRF - VRF System' ? 'selected' : ''}>VRF - VRF System</option>
                                <option ${gf.equipmentType === 'PMP - Water Pump' ? 'selected' : ''}>PMP - Water Pump</option>
                            </select>
                        </div>
                        <div class="filter-group" style="margin-bottom: 15px;">
                            <label style="display: block; font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">Phase Gate</label>
                            <select class="filter-select" style="width: 100%;" onchange="window.setGanttFilter('phase', this.value === 'All Phase Gates' ? 'all' : this.value)">
                                <option ${gf.phase === 'all' ? 'selected' : ''}>All Phase Gates</option>
                                <option ${gf.phase === 'Delivery Phase' ? 'selected' : ''}>Delivery Phase</option>
                                <option ${gf.phase === 'CxL2 Pre-Commissioning' ? 'selected' : ''}>CxL2 Pre-Commissioning</option>
                                <option ${gf.phase === 'CxL3 Startup (Active)' ? 'selected' : ''}>CxL3 Startup (Active)</option>
                                <option ${gf.phase === 'CxL4 Functional Testing' ? 'selected' : ''}>CxL4 Functional Testing</option>
                                <option ${gf.phase === 'CxL5 Integrated Testing' ? 'selected' : ''}>CxL5 Integrated Testing</option>
                            </select>
                        </div>
                        <button class="btn" style="width: 100%; background: var(--bg-card); border: 1px solid var(--border-card); font-size: 0.78rem;" onclick="window.resetGanttFilters()">Reset Filters</button>
                    </div>
                    
                    <!-- Gantt Chart Main Area -->
                    <div class="gantt-chart-area" style="flex: 1; min-width: 0; border: 1px solid var(--border-card); border-radius: 8px; background: var(--bg-card); overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%;">
                        <div style="width: 100%; min-width: 660px; position: relative;">
                            <!-- 2-TIER CALENDAR DATE AXIS -->
                            <div style="display: grid; grid-template-columns: 120px repeat(8, 1fr); border-bottom: 1px solid var(--border-card); background: var(--bg-card-secondary); padding: 8px 0; text-align: center; font-size: 12px; color: var(--text-main); font-weight: bold;">
                                <div style="text-align: left; padding-left: 10px;">Equipment ID</div>
                                <div>Aug 2026</div><div>Sep 2026</div><div>Oct 2026</div><div>Nov 2026</div><div>Dec 2026</div><div>Jan 2027</div><div>Feb 2027</div><div>Mar 2027</div>
                            </div>
                            <div style="display: grid; grid-template-columns: 120px repeat(8, 1fr); border-bottom: 2px solid var(--border-card); background: var(--bg-card-secondary); padding: 4px 0; text-align: center; font-size: 10px; color: var(--text-muted);">
                                <div style="text-align: left; padding-left: 10px; font-weight: 600;">Phase Gates</div>
                                <div>W1–W4</div><div>W5–W8</div><div>W9–W12</div><div>W13–W16</div><div>W17–W20</div><div>W21–W24</div><div>W25–W28</div><div>W29–W32</div>
                            </div>
                            <!-- Today Indicator -->
                            <div style="position: absolute; left: 16%; top: 0; bottom: 0; width: 2px; background: rgba(239, 68, 68, 0.4); z-index: 10; border-right: 1px dashed #ef4444;"></div>
                            <div style="position: absolute; left: 14%; top: 6px; font-size: 10px; font-weight: bold; color: #ef4444; z-index: 11; background: var(--bg-card); padding: 2px 4px; border-radius: 4px; border: 1px solid #ef4444;">Today (11 Aug)</div>
                            <!-- Equipment Rows (filtered) -->
                            ${rows}
                            ${emptyRowHtml}
                        </div>
                        <!-- Legend -->
                        <div style="display: flex; gap: 20px; padding: 12px 15px; font-size: 12px; font-weight: 500; color: var(--text-secondary); border-top: 1px solid var(--border-card); background: var(--bg-card-secondary); justify-content: center; flex-wrap: wrap; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 6px;"><div style="width: 14px; height: 14px; background: #2563eb; border-radius: 3px;"></div> Delivery</div>
                            <div style="display: flex; align-items: center; gap: 6px;"><div style="width: 14px; height: 14px; background: #10b981; border-radius: 3px;"></div> CxL2 (Pre-Cx)</div>
                            <div style="display: flex; align-items: center; gap: 6px;"><div style="width: 14px; height: 14px; background: #f97316; border-radius: 3px; border: 1.5px solid #ea580c;"></div> CxL3 (Startup - Active)</div>
                            <div style="display: flex; align-items: center; gap: 6px;"><div style="width: 14px; height: 14px; background: #8b5cf6; border-radius: 3px;"></div> CxL4 (Functional)</div>
                            <div style="display: flex; align-items: center; gap: 6px;"><div style="width: 14px; height: 14px; background: #ef4444; border-radius: 3px;"></div> CxL5 (Integrated)</div>
                            <div style="display: flex; align-items: center; gap: 4px; margin-left: 15px; font-size: 11px; color: var(--text-muted);"><span style="background: rgba(245,158,11,0.2); color: #f59e0b; padding: 2px 6px; border-radius: 3px; font-weight: bold;">CxL2/3 &amp; CxL3/4 Overlap</span> Representative Phase Overlap Windows (Demo Visualization)</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    // ==========================================
    // TAB 2: EQUIPMENT TIMELINE
    // ==========================================
    } else if (activeTab === 'equipment-timeline') {
        const selectedEq = (window.appState && window.appState.selectedEquipment) || 'AHU-001';
        const equipmentSource = (window.appState && window.appState.equipment && window.appState.equipment.length > 0) ? window.appState.equipment : masterEquipmentList;
        const eqItem = equipmentSource.find(e => e.id === selectedEq) || equipmentSource[0];

        // Per-equipment timeline data
        const eqTimelineData = {
            'AHU-001': { duration: 120, progress: 65, variance: -7, activePhase: 'CxL3 Startup', phases: [
                { name: 'Delivery', start: 'Aug 15, 2026', end: 'Sep 01, 2026', dur: '17 Days', pct: 100, color: '#2563eb', status: 'Completed' },
                { name: 'CxL2 - Pre-Commissioning', start: 'Sep 05, 2026', end: 'Sep 20, 2026', dur: '15 Days', pct: 100, color: '#10b981', status: 'Completed' },
                { name: 'CxL3 - Startup', start: 'Oct 01, 2026', end: 'Oct 25, 2026', dur: '24 Days', pct: 65, color: '#f97316', status: 'In Progress' },
                { name: 'CxL4 - Functional Testing', start: 'Nov 01, 2026', end: 'Nov 15, 2026', dur: '14 Days', pct: 0, color: '#8b5cf6', status: 'Planned' },
                { name: 'CxL5 - Integrated Testing', start: 'Dec 01, 2026', end: 'Dec 20, 2026', dur: '19 Days', pct: 0, color: '#ef4444', status: 'Planned' }
            ]},
            'CHP-001': { duration: 115, progress: 70, variance: -5, activePhase: 'CxL3 Startup', phases: [
                { name: 'Delivery', start: 'Aug 10, 2026', end: 'Aug 28, 2026', dur: '18 Days', pct: 100, color: '#2563eb', status: 'Completed' },
                { name: 'CxL2 - Pre-Commissioning', start: 'Sep 01, 2026', end: 'Sep 22, 2026', dur: '21 Days', pct: 100, color: '#10b981', status: 'Completed' },
                { name: 'CxL3 - Startup', start: 'Oct 05, 2026', end: 'Nov 01, 2026', dur: '27 Days', pct: 70, color: '#f97316', status: 'In Progress' },
                { name: 'CxL4 - Functional Testing', start: 'Nov 10, 2026', end: 'Nov 28, 2026', dur: '18 Days', pct: 0, color: '#8b5cf6', status: 'Planned' },
                { name: 'CxL5 - Integrated Testing', start: 'Dec 05, 2026', end: 'Dec 25, 2026', dur: '20 Days', pct: 0, color: '#ef4444', status: 'Planned' }
            ]},
            'FCU-001': { duration: 90, progress: 100, variance: 0, activePhase: 'CxL2 Pre-Cx', phases: [
                { name: 'Delivery', start: 'Aug 05, 2026', end: 'Aug 18, 2026', dur: '13 Days', pct: 100, color: '#2563eb', status: 'Completed' },
                { name: 'CxL2 - Pre-Commissioning', start: 'Aug 20, 2026', end: 'Sep 10, 2026', dur: '21 Days', pct: 100, color: '#10b981', status: 'Completed' },
                { name: 'CxL3 - Startup', start: 'Sep 15, 2026', end: 'Oct 05, 2026', dur: '20 Days', pct: 0, color: '#f97316', status: 'Planned' },
                { name: 'CxL4 - Functional Testing', start: 'Oct 15, 2026', end: 'Oct 30, 2026', dur: '15 Days', pct: 0, color: '#8b5cf6', status: 'Planned' },
                { name: 'CxL5 - Integrated Testing', start: 'Nov 10, 2026', end: 'Nov 25, 2026', dur: '15 Days', pct: 0, color: '#ef4444', status: 'Planned' }
            ]},
            'PAU-001': { duration: 125, progress: 45, variance: -12, activePhase: 'CxL3 Startup', phases: [
                { name: 'Delivery', start: 'Aug 20, 2026', end: 'Sep 05, 2026', dur: '16 Days', pct: 100, color: '#2563eb', status: 'Completed' },
                { name: 'CxL2 - Pre-Commissioning', start: 'Sep 10, 2026', end: 'Sep 30, 2026', dur: '20 Days', pct: 100, color: '#10b981', status: 'Completed' },
                { name: 'CxL3 - Startup', start: 'Oct 05, 2026', end: 'Oct 30, 2026', dur: '25 Days', pct: 45, color: '#f97316', status: 'In Progress' },
                { name: 'CxL4 - Functional Testing', start: 'Nov 10, 2026', end: 'Nov 28, 2026', dur: '18 Days', pct: 0, color: '#8b5cf6', status: 'Planned' },
                { name: 'CxL5 - Integrated Testing', start: 'Dec 08, 2026', end: 'Dec 28, 2026', dur: '20 Days', pct: 0, color: '#ef4444', status: 'Planned' }
            ]},
            'VRF-001': { duration: 130, progress: 30, variance: -15, activePhase: 'CxL4 Functional', phases: [
                { name: 'Delivery', start: 'Aug 25, 2026', end: 'Sep 08, 2026', dur: '14 Days', pct: 100, color: '#2563eb', status: 'Completed' },
                { name: 'CxL2 - Pre-Commissioning', start: 'Sep 12, 2026', end: 'Oct 02, 2026', dur: '20 Days', pct: 100, color: '#10b981', status: 'Completed' },
                { name: 'CxL3 - Startup', start: 'Oct 08, 2026', end: 'Nov 01, 2026', dur: '24 Days', pct: 100, color: '#f97316', status: 'Completed' },
                { name: 'CxL4 - Functional Testing', start: 'Nov 05, 2026', end: 'Nov 22, 2026', dur: '17 Days', pct: 30, color: '#8b5cf6', status: 'In Progress' },
                { name: 'CxL5 - Integrated Testing', start: 'Dec 01, 2026', end: 'Dec 22, 2026', dur: '21 Days', pct: 0, color: '#ef4444', status: 'Planned' }
            ]},
            'PMP-101': { duration: 60, progress: 100, variance: 0, activePhase: 'Delivery', phases: [
                { name: 'Delivery', start: 'Aug 01, 2026', end: 'Aug 15, 2026', dur: '14 Days', pct: 100, color: '#2563eb', status: 'Completed' },
                { name: 'CxL2 - Pre-Commissioning', start: 'Aug 18, 2026', end: 'Sep 05, 2026', dur: '18 Days', pct: 0, color: '#10b981', status: 'Planned' },
                { name: 'CxL3 - Startup', start: 'Sep 10, 2026', end: 'Sep 28, 2026', dur: '18 Days', pct: 0, color: '#f97316', status: 'Planned' },
                { name: 'CxL4 - Functional Testing', start: 'Oct 05, 2026', end: 'Oct 20, 2026', dur: '15 Days', pct: 0, color: '#8b5cf6', status: 'Planned' },
                { name: 'CxL5 - Integrated Testing', start: 'Nov 01, 2026', end: 'Nov 15, 2026', dur: '14 Days', pct: 0, color: '#ef4444', status: 'Planned' }
            ]}
        };

        const td = eqTimelineData[selectedEq] || eqTimelineData['AHU-001'];

        contentHtml = `
            <div class="dashboard-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
                    <h2 class="card-top-title" style="margin: 0;">Equipment Timeline Details</h2>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <label style="font-size: 0.85rem; color: var(--text-secondary);">Select Equipment:</label>
                        <select id="eq-timeline-select" class="filter-select" style="font-weight: bold;" onchange="window.selectEquipment(this.value)">
                            ${((window.appState && window.appState.equipment && window.appState.equipment.length > 0) ? window.appState.equipment : masterEquipmentList).map(e => `<option value="${e.id}" ${e.id === selectedEq ? 'selected' : ''}>${e.id} — ${e.type}</option>`).join('')}
                        </select>
                    </div>
                </div>

                <div style="background: var(--bg-card-secondary); border: 1px solid var(--border-card); border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                    <div style="font-size: 0.85rem;"><strong style="color: var(--brand-blue);">${selectedEq}</strong> — ${eqItem.type}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">Building: <strong>${eqItem.buildingName || eqItem.building || 'Building A'}</strong> / Room: <strong>${eqItem.room || 'Room 101'}</strong></div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">Gate Status: <strong style="color: ${eqItem.status === 'Active' ? '#10b981' : '#9ca3af'};">${eqItem.status || 'Active'}</strong></div>
                </div>

                <div class="duration-summary-row" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
                    <div class="duration-box stat-mini-box" style="padding: 12px; background: var(--bg-card-secondary); border: 1px solid var(--border-card); border-radius: 8px; text-align: center;">
                        <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">Planned Duration</div>
                        <div style="font-size: 20px; font-weight: bold; color: var(--text-main);">${td.duration} Days</div>
                    </div>
                    <div class="duration-box stat-mini-box" style="padding: 12px; background: var(--bg-card-secondary); border: 1px solid var(--border-card); border-radius: 8px; text-align: center;">
                        <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">Active Phase</div>
                        <div style="font-size: 16px; font-weight: bold; color: #f97316;">${td.activePhase}</div>
                    </div>
                    <div class="duration-box stat-mini-box" style="padding: 12px; background: var(--bg-card-secondary); border: 1px solid var(--border-card); border-radius: 8px; text-align: center;">
                        <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">Progress</div>
                        <div style="font-size: 20px; font-weight: bold; color: #10b981;">${td.progress}%</div>
                    </div>
                    <div class="duration-box stat-mini-box" style="padding: 12px; background: var(--bg-card-secondary); border: 1px solid var(--border-card); border-radius: 8px; text-align: center;">
                        <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">Schedule Variance</div>
                        <div style="font-size: 20px; font-weight: bold; color: ${td.variance < 0 ? '#ef4444' : '#10b981'};">${td.variance > 0 ? '+' : ''}${td.variance}%</div>
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 12px;">
                    <h3 style="font-size: 15px; margin: 0; color: var(--text-main);">Phase Execution Timeline — ${selectedEq}</h3>
                    <button class="btn btn-primary" style="font-size: 0.78rem; padding: 0.35rem 0.75rem;" onclick="openModal({
                        title: 'Edit Equipment Schedule: ${selectedEq}',
                        bodyHtml: '<div class=\\'form-row\\'><label>Delivery Date</label><input id=\\'es-del\\' type=\\'date\\' value=\\'2026-08-15\\'/></div><div class=\\'form-row\\'><label>CxL3 Target End</label><input id=\\'es-end\\' type=\\'date\\' value=\\'2026-10-25\\'/></div><div class=\\'form-row\\'><label>Schedule Adjustment Reason</label><input id=\\'es-reason\\' type=\\'text\\' placeholder=\\'Vendor panel delay\\'/></div>',
                        confirmText: 'Save Schedule',
                        onConfirm: (overlay) => {
                            const reason = overlay.querySelector('#es-reason')?.value?.trim();
                            window.addAuditLog('Admin', 'UPDATE', 'EquipmentSchedule', '${selectedEq}', 'Schedule updated for ${selectedEq}' + (reason ? ': ' + reason : ''));
                            showToast('${selectedEq} schedule updated successfully.', 'success');
                            window.renderApp();
                        }
                    })"><i data-lucide="edit" style="width: 13px; height: 13px;"></i> Edit Schedule</button>
                </div>

                <div class="table-responsive-wrapper" style="margin-bottom: 20px; border: 1px solid var(--border-card); border-radius: 8px; overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%;">
                    <table class="detail-phase-table summary-table" style="width: 100%; min-width: 580px; text-align: left; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 1px solid var(--border-card); background: var(--bg-card-secondary); color: var(--text-secondary);">
                                <th style="padding: 10px 12px; font-weight: 600; font-size: 12px; white-space: nowrap;">Phase</th>
                                <th style="padding: 10px 12px; font-weight: 600; font-size: 12px; white-space: nowrap;">Start Date</th>
                                <th style="padding: 10px 12px; font-weight: 600; font-size: 12px; white-space: nowrap;">End Date</th>
                                <th style="padding: 10px 12px; font-weight: 600; font-size: 12px; white-space: nowrap;">Duration</th>
                                <th style="padding: 10px 12px; font-weight: 600; font-size: 12px; white-space: nowrap;">Status</th>
                                <th style="padding: 10px 12px; font-weight: 600; font-size: 12px; white-space: nowrap; width: 25%;">Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${td.phases.map(ph => `
                            <tr style="border-bottom: 1px solid var(--border-card);">
                                <td style="padding: 10px 12px; font-weight: 600; color: ${ph.color}; font-size: 13px; white-space: nowrap;">${ph.name}</td>
                                <td style="padding: 10px 12px; font-size: 12px; white-space: nowrap;">${ph.start}</td>
                                <td style="padding: 10px 12px; font-size: 12px; white-space: nowrap;">${ph.end}</td>
                                <td style="padding: 10px 12px; font-size: 12px; white-space: nowrap;">${ph.dur}</td>
                                <td style="padding: 10px 12px; white-space: nowrap;">
                                    <span style="font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 10px; background: ${ph.status === 'Completed' ? 'rgba(16,185,129,0.15)' : ph.status === 'In Progress' ? 'rgba(249,115,22,0.15)' : 'rgba(148,163,184,0.15)'}; color: ${ph.status === 'Completed' ? '#10b981' : ph.status === 'In Progress' ? '#f97316' : '#94a3b8'};">${ph.status}</span>
                                </td>
                                <td style="padding: 10px 12px; white-space: nowrap;">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div style="flex: 1; min-width: 60px; height: 8px; background: var(--bg-card-secondary); border-radius: 4px; overflow: hidden; border: 1px solid var(--border-card);">
                                            <div style="width: ${ph.pct}%; height: 100%; background: ${ph.color}; transition: width 0.3s;"></div>
                                        </div>
                                        <span style="font-size: 11px; font-weight: 700; color: ${ph.color}; width: 32px; text-align: right;">${ph.pct}%</span>
                                    </div>
                                </td>
                            </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="font-size: 16px; margin: 0; color: var(--text-main);">Milestones &amp; Verification</h3>
                    <button class="btn" style="background: var(--bg-card-secondary); border: 1px solid var(--border-card); font-size: 0.8rem;" onclick="window._openAddMilestoneModal()"><i data-lucide="plus" style="width: 14px; height: 14px;"></i> Add Milestone</button>
                </div>

                <div style="border: 1px solid var(--border-card); border-radius: 8px; padding: 0 15px;">
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        ${((window.appState && window.appState.milestones && window.appState.milestones.length > 0) ? window.appState.milestones : [
                          { id: 'MS-001', name: 'Factory Acceptance Test (FAT) Completed', date: '20 Aug 2026', status: 'Completed' },
                          { id: 'MS-002', name: 'Site Acceptance Test (SAT) Completed', date: '18 Sep 2026', status: 'Completed' },
                          { id: 'MS-003', name: 'Vendor Startup Visit & Sign-off', date: '10 Oct 2026', status: 'In Progress' }
                        ]).map((ms, idx, arr) => `
                          <li style="display: flex; align-items: center; gap: 12px; padding: 12px 0; ${idx < arr.length - 1 ? 'border-bottom: 1px solid var(--border-card);' : ''}">
                              <i data-lucide="${ms.status === 'Completed' ? 'check-circle-2' : ms.status === 'In Progress' ? 'clock' : 'calendar'}" style="color: ${ms.status === 'Completed' ? '#10b981' : ms.status === 'In Progress' ? '#f97316' : '#2563eb'}; width: 18px; height: 18px;"></i>
                              <span style="color: var(--text-main); font-weight: 500; font-size: 14px;">${window.escapeHtml ? window.escapeHtml(ms.name) : ms.name}</span>
                              <span style="color: var(--text-muted); font-size: 13px; margin-left: auto;">${window.escapeHtml ? window.escapeHtml(ms.date) : ms.date} (${ms.status || 'Planned'})</span>
                          </li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

    // ==========================================
    // TAB 3: PHASE PROGRESS (CXL GATEWAY)
    // ==========================================
    } else if (activeTab === 'phase-progress') {
        const phases = ['Delivery', 'CxL2', 'CxL3', 'CxL4', 'CxL5'];
        // Read selected phase from appState; default to CxL3
        const activePhase = (window.appState && window.appState.selectedCxlPhase) || 'CxL3';
        const progressPercent = 65;

        // Use CXL_CHECKLISTS from main.js if available, else fallback
        const cxlChecklist = (window.CXL_CHECKLISTS && window.CXL_CHECKLISTS[activePhase]) || [
            { id: 'REQ-301', text: 'Pre-functional Inspection Complete' },
            { id: 'REQ-302', text: 'Manufacturer Start-up Documents Verified' },
            { id: 'REQ-303', text: 'Functional Testing Procedures Approved' },
            { id: 'REQ-304', text: 'Test Instruments Calibrated & Logged' },
            { id: 'REQ-305', text: 'Initial System Balancing & Tuning' }
        ];
        const checklistState = (window.appState && window.appState.checklistState && window.appState.checklistState[activePhase]) || {};
        const checklist = cxlChecklist.map(item => ({ id: item.id, task: item.text, done: !!checklistState[item.id] }));

        // Match doc IDs to appState.documents for real downloads
        const docIdMap = { 'CxL3': ['DOC-001','DOC-002','DOC-003'], 'CxL2': ['DOC-004'], 'CxL4': ['DOC-005'] };
        const phaseDocIds = docIdMap[activePhase] || ['DOC-001','DOC-002','DOC-003'];
        const stateDocs = (window.appState && window.appState.documents) || [];
        const docs = phaseDocIds.map(id => stateDocs.find(d => d.id === id)).filter(Boolean);
        const fallbackDocs = docs.length > 0 ? docs : [
            { id: 'DOC-001', name: `${activePhase}_Testing_Protocol.pdf`, date: '2026-08-01', size: '2.4 MB' }
        ];

        const approvalState = (window.appState && window.appState.phaseApprovalState && window.appState.phaseApprovalState[activePhase]) || { status: 'In Progress' };
        const isApproved = approvalState.status === 'Approved';

        const team = [
            { name: 'Sarah Jenkins', role: 'Cx Authority (CxA)', initials: 'SJ', color: '#3b82f6' },
            { name: 'Mike Ross', role: 'Test Engineer', initials: 'MR', color: '#10b981' },
            { name: 'David Chen', role: 'QA/QC Lead', initials: 'DC', color: '#f59e0b' }
        ];
        contentHtml = `
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; overflow-x: auto; padding-bottom: 0.5rem;">
                ${phases.map(p => `
                    <button class="dashboard-card" style="padding: 0.5rem 1.5rem; border: 1px solid ${p === activePhase ? 'var(--brand-blue)' : 'var(--border-card)'}; background: ${p === activePhase ? 'var(--brand-blue)' : 'var(--bg-card)'}; color: ${p === activePhase ? '#fff' : 'var(--text-main)'}; border-radius: 20px; font-weight: 600; cursor: pointer; transition: all 0.2s;"
                        onclick="window.selectCxlPhase('${p}')">
                        ${p}
                    </button>
                `).join('')}
            </div>

            <div class="cxl-detail-grid">
                <!-- Left Column -->
                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <div class="dashboard-card" style="padding: 1.5rem;">
                        <div class="card-top-title" style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                            <span><i data-lucide="check-square"></i> Phase Requirements (${activePhase})</span>
                            <button class="btn ${isApproved ? '' : 'btn-primary'}" ${isApproved ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}
                                onclick="${isApproved ? '' : `openModal({ title: 'Approve Phase Gate: ${activePhase}', bodyHtml: '<div class=\\'info-banner\\'><i data-lucide=\\'info\\'></i> Approving phase gate locks the checklist and signs off ${activePhase}.</div><div class=\\'form-row\\'><label>Approver Role</label><span>Commissioning Authority (CxA)</span></div><div class=\\'form-row\\'><label>Sign-off Notes</label><input type=\\'text\\' id=\\'gate-notes\\' placeholder=\\'All functional tests verified\\'></div>', confirmText: 'Sign-off & Approve', onConfirm: (overlay) => { const notes = overlay.querySelector('#gate-notes')?.value || ''; window.approvePhaseGate('${activePhase}'); } })`}">
                                <i data-lucide="check-circle-2" style="width:14px;height:14px;"></i>
                                ${isApproved ? 'Gate Approved ✓' : 'Approve Phase Gate'}
                            </button>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            ${checklist.map(item => `
                                <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: var(--bg-card-secondary); border-radius: 6px; border-left: 4px solid ${item.done ? '#10b981' : '#cbd5e1'};">
                                    <i data-lucide="${item.done ? 'check-circle-2' : 'circle'}" style="color: ${item.done ? '#10b981' : 'var(--text-muted)'}; width: 18px; height: 18px; cursor: ${isApproved ? 'not-allowed' : 'pointer'};" ${isApproved ? '' : `onclick="window.toggleChecklist('${activePhase}','${item.id}')"` }></i>
                                    <span style="font-size: 0.9rem; font-weight: 500; text-decoration: ${item.done ? 'line-through' : 'none'}; opacity: ${item.done ? 0.7 : 1};">${item.task}</span>
                                    <span style="margin-left: auto; font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 4px; background: ${item.done ? 'rgba(16,185,129,0.1)' : 'var(--bg-card)'}; color: ${item.done ? '#10b981' : 'var(--text-muted)'};"> ${item.done ? 'Completed' : 'Pending'}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="dashboard-card" style="padding: 1.5rem;">
                        <div class="card-top-title" style="margin-bottom: 1rem;"><i data-lucide="file-text"></i> Required Phase Documentation</div>
                        <div class="table-responsive-wrapper">
                            <table class="summary-table" style="width: 100%; text-align: left; border-collapse: collapse;">
                            <tbody>
                                ${fallbackDocs.map(doc => `
                                    <tr style="border-bottom: 1px solid var(--border-card);">
                                        <td style="padding: 0.75rem 0; display: flex; align-items: center; gap: 0.75rem;">
                                            <i data-lucide="file-text" style="color: var(--brand-blue); width: 16px; height: 16px;"></i>
                                            <span style="font-weight: 500;">${doc.name}</span>
                                        </td>
                                        <td style="padding: 0.75rem 0; color: var(--text-secondary); text-align: right;">${doc.size || '—'}</td>
                                        <td style="padding: 0.75rem 0; color: var(--text-muted); text-align: right;">${doc.date || '—'}</td>
                                        <td style="padding: 0.75rem 0; text-align: right;">
                                            <button class="btn" style="padding: 2px 8px; font-size: 11px; background: var(--bg-card-secondary);"
                                                onclick="window.downloadDocumentBlob('${doc.id}')">Download</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Right Column -->
                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <div class="dashboard-card" style="padding: 1.5rem; display: flex; flex-direction: column; align-items: center; text-align: center;">
                        <div class="card-top-title" style="width: 100%; text-align: left; margin-bottom: 1.5rem;"><i data-lucide="pie-chart"></i> Progress Summary</div>
                        <div style="position: relative; width: 120px; height: 120px; margin-bottom: 1rem;">
                            <svg width="120" height="120" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--bg-card-secondary)" stroke-width="12" />
                                <circle cx="60" cy="60" r="54" fill="none" stroke="#f59e0b" stroke-width="12" stroke-dasharray="339.29" stroke-dashoffset="${339.29 - (339.29 * progressPercent / 100)}" stroke-linecap="round" transform="rotate(-90 60 60)" />
                            </svg>
                            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                                <span style="font-size: 1.5rem; font-weight: bold; color: var(--text-main);">${progressPercent}%</span>
                            </div>
                        </div>
                        <div style="color: var(--text-secondary); font-size: 0.9rem;">Overall completion for ${activePhase}</div>
                    </div>

                    <div class="dashboard-card" style="padding: 1.5rem;">
                        <div class="card-top-title" style="margin-bottom: 1rem;"><i data-lucide="users"></i> Assigned Engineering Team</div>
                        <div style="display: flex; flex-direction: column; gap: 1rem;">
                            ${team.map(t => `
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <div style="width: 40px; height: 40px; border-radius: 50%; background: ${t.color}20; color: ${t.color}; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 1px solid ${t.color}50;">
                                        ${t.initials}
                                    </div>
                                    <div>
                                        <div style="font-weight: 600; color: var(--text-main);">${t.name}</div>
                                        <div style="font-size: 0.8rem; color: var(--text-secondary);">${t.role}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

    // ==========================================
    // TAB 4: DURATION ANALYSIS
    // ==========================================
    } else if (activeTab === 'duration-analysis') {
        contentHtml = `
            <div class="dashboard-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; flex-wrap: wrap; gap: 10px;">
                    <h2 class="card-top-title" style="margin: 0;">Duration Analysis (Planned vs Actual)</h2>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn" style="background: var(--bg-card-secondary); border: 1px solid var(--border-card); font-size: 0.8rem;" title="Critical Path Analysis — not implemented in frontend-only mode" onclick="showToast('[NOT IMPLEMENTED] Critical Path Analysis requires schedule engine backend. This is a frontend-only session.', 'info')">
                            <i data-lucide="cpu" style="width: 14px; height: 14px;"></i> Run Critical Path <span style="font-size:0.65rem;opacity:0.6;">[N/A]</span>
                        </button>
                        <button class="btn btn-primary" onclick="window._exportDurationCsv()">
                            <i data-lucide="download" style="width: 14px; height: 14px;"></i> Export Duration Report
                        </button>
                    </div>
                </div>
                
                <div class="four-stat-boxes" style="margin-bottom: 20px;">
                    <div class="metric-card" style="padding: 20px; background: var(--bg-card-secondary); border: 1px solid var(--border-card); border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <div class="metric-card-title" style="font-size: 13px; font-weight: 500; color: var(--text-secondary); margin-bottom: 8px;">Average Delay</div>
                        <div class="metric-big-num" style="font-size: 28px; font-weight: bold; color: #ef4444;">+4.2 Days</div>
                    </div>
                    <div class="metric-card" style="padding: 20px; background: var(--bg-card-secondary); border: 1px solid var(--border-card); border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <div class="metric-card-title" style="font-size: 13px; font-weight: 500; color: var(--text-secondary); margin-bottom: 8px;">Total Float Consumed</div>
                        <div class="metric-big-num" style="font-size: 28px; font-weight: bold; color: #f97316;">18 Days</div>
                    </div>
                    <div class="metric-card" style="padding: 20px; background: var(--bg-card-secondary); border: 1px solid var(--border-card); border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <div class="metric-card-title" style="font-size: 13px; font-weight: 500; color: var(--text-secondary); margin-bottom: 8px;">On-Time Completion</div>
                        <div class="metric-big-num" style="font-size: 28px; font-weight: bold; color: #10b981;">68%</div>
                    </div>
                    <div class="metric-card" style="padding: 20px; background: var(--bg-card-secondary); border: 1px solid var(--border-card); border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <div class="metric-card-title" style="font-size: 13px; font-weight: 500; color: var(--text-secondary); margin-bottom: 8px;">Critical Path Variance</div>
                        <div class="metric-big-num" style="font-size: 28px; font-weight: bold; color: #ef4444;">+2 Days</div>
                    </div>
                </div>
                
                <div class="chart-responsive-wrapper" style="border: 1px solid var(--border-card); border-radius: 8px; padding: 15px; margin-bottom: 20px; background: var(--bg-card); overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%;">
                    <h3 style="font-size: 15px; font-weight: 600; color: var(--text-main); margin-top: 0; margin-bottom: 15px;">Phase Duration Comparison (Planned vs Actual Days)</h3>
                    <!-- Bar Chart SVG -->
                    <svg width="100%" height="240" viewBox="0 0 760 240" style="min-width: 520px; background: var(--bg-card); display: block;">
                        <line x1="80" y1="40" x2="750" y2="40" stroke="var(--border-card)" stroke-dasharray="4" />
                        <line x1="80" y1="90" x2="750" y2="90" stroke="var(--border-card)" stroke-dasharray="4" />
                        <line x1="80" y1="140" x2="750" y2="140" stroke="var(--border-card)" stroke-dasharray="4" />
                        <line x1="80" y1="190" x2="750" y2="190" stroke="var(--border-card)" stroke-dasharray="4" />
                        <line x1="80" y1="240" x2="750" y2="240" stroke="var(--text-muted)" />
                        
                        <text x="60" y="45" font-size="12" fill="var(--text-secondary)" text-anchor="end">40</text>
                        <text x="60" y="95" font-size="12" fill="var(--text-secondary)" text-anchor="end">30</text>
                        <text x="60" y="145" font-size="12" fill="var(--text-secondary)" text-anchor="end">20</text>
                        <text x="60" y="195" font-size="12" fill="var(--text-secondary)" text-anchor="end">10</text>
                        <text x="60" y="245" font-size="12" fill="var(--text-secondary)" text-anchor="end">0</text>
                        
                        <!-- Bars -->
                        <text x="150" y="265" font-size="12" font-weight="500" fill="var(--text-main)" text-anchor="middle">Delivery</text>
                        <rect x="130" y="140" width="16" height="100" fill="#2563eb" opacity="0.4" rx="2" />
                        <rect x="152" y="130" width="16" height="110" fill="#2563eb" rx="2" />
                        
                        <text x="270" y="265" font-size="12" font-weight="500" fill="var(--text-main)" text-anchor="middle">CxL2</text>
                        <rect x="250" y="165" width="16" height="75" fill="#10b981" opacity="0.4" rx="2" />
                        <rect x="272" y="165" width="16" height="75" fill="#10b981" rx="2" />
                        
                        <text x="390" y="265" font-size="12" font-weight="500" fill="var(--text-main)" text-anchor="middle">CxL3</text>
                        <rect x="370" y="120" width="16" height="120" fill="#f97316" opacity="0.4" rx="2" />
                        <rect x="392" y="100" width="16" height="140" fill="#f97316" rx="2" />
                        
                        <text x="510" y="265" font-size="12" font-weight="500" fill="var(--text-main)" text-anchor="middle">CxL4</text>
                        <rect x="490" y="170" width="16" height="70" fill="#8b5cf6" opacity="0.4" rx="2" />
                        <rect x="512" y="180" width="16" height="60" fill="#8b5cf6" rx="2" />
                        
                        <text x="630" y="265" font-size="12" font-weight="500" fill="var(--text-main)" text-anchor="middle">CxL5</text>
                        <rect x="610" y="145" width="16" height="95" fill="#ef4444" opacity="0.4" rx="2" />
                        <rect x="632" y="135" width="16" height="105" fill="#ef4444" rx="2" />
                        
                        <rect x="640" y="20" width="12" height="12" fill="var(--text-secondary)" opacity="0.4" rx="2" />
                        <text x="660" y="30" font-size="12" fill="var(--text-main)">Planned</text>
                        <rect x="640" y="45" width="12" height="12" fill="var(--text-secondary)" rx="2" />
                        <text x="660" y="55" font-size="12" fill="var(--text-main)">Actual</text>
                    </svg>
                </div>
                
                <h3 style="font-size: 15px; margin-bottom: 15px; color: var(--text-main);">Equipment Delay &amp; Variance Details</h3>
                <div class="table-responsive-wrapper" style="border: 1px solid var(--border-card); border-radius: 8px; overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%;">
                    <table class="summary-table" style="width: 100%; min-width: 520px; text-align: left; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 1px solid var(--border-card); background: var(--bg-card-secondary); color: var(--text-secondary);">
                                <th style="padding: 12px 16px; font-weight: 600; font-size: 13px;">Equipment</th>
                                <th style="padding: 12px 16px; font-weight: 600; font-size: 13px;">Phase</th>
                                <th style="padding: 12px 16px; font-weight: 600; font-size: 13px;">Planned (Days)</th>
                                <th style="padding: 12px 16px; font-weight: 600; font-size: 13px;">Actual (Days)</th>
                                <th style="padding: 12px 16px; font-weight: 600; font-size: 13px;">Variance</th>
                                <th style="padding: 12px 16px; font-weight: 600; font-size: 13px;">Impact</th>
                                <th style="padding: 12px 16px; font-weight: 600; font-size: 13px; text-align: right;">Action</th>
                            </tr>
                        </thead>
                        <tbody style="background: var(--bg-card);">
                            <tr style="border-bottom: 1px solid var(--border-card);">
                                <td style="padding: 12px 16px; font-weight: 600; color: var(--text-main); font-size: 13px;">AHU-001</td>
                                <td style="padding: 12px 16px; color: var(--text-secondary); font-size: 13px;">Delivery</td>
                                <td style="padding: 12px 16px; font-size: 13px;">20</td>
                                <td style="padding: 12px 16px; font-size: 13px;">22</td>
                                <td style="padding: 12px 16px; color: #ef4444; font-weight: 600; font-size: 13px;">+2 Days</td>
                                <td style="padding: 12px 16px;"><span style="background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase;">Medium</span></td>
                                <td style="padding: 12px 16px; text-align: right;">
                                    <button class="btn" style="padding: 2px 8px; font-size: 11px; background: var(--bg-card-secondary);" onclick="openModal({
                                        title: 'Log Delay Root Cause: AHU-001',
                                        bodyHtml: '<div class=\\'form-row\\'><label>Root Cause</label><select id=\\'rc-sel\\'><option>Vendor Shipment Delay</option><option>Site Access Limitation</option><option>Design Modification</option></select></div><div class=\\'form-row\\'><label>Impact Notes</label><input id=\\'rc-notes\\' type=\\'text\\' placeholder=\\'Customs clearance took 2 extra days\\'/></div>',
                                        confirmText: 'Save Root Cause',
                                        onConfirm: (overlay) => {
                                            const cause = overlay.querySelector('#rc-sel')?.value;
                                            const notes = overlay.querySelector('#rc-notes')?.value?.trim();
                                            window.addAuditLog('Admin', 'UPDATE', 'DurationAnalysis', 'AHU-001', 'Delay cause logged: ' + cause + (notes ? ' - ' + notes : ''));
                                            showToast('Delay root cause logged for AHU-001.', 'success');
                                            window.renderApp();
                                        }
                                    })">Log Cause</button>
                                </td>
                            </tr>
                            <tr style="border-bottom: 1px solid var(--border-card);">
                                <td style="padding: 12px 16px; font-weight: 600; color: var(--text-main); font-size: 13px;">CHP-001</td>
                                <td style="padding: 12px 16px; color: var(--text-secondary); font-size: 13px;">CxL3</td>
                                <td style="padding: 12px 16px; font-size: 13px;">24</td>
                                <td style="padding: 12px 16px; font-size: 13px;">28</td>
                                <td style="padding: 12px 16px; color: #ef4444; font-weight: 600; font-size: 13px;">+4 Days</td>
                                <td style="padding: 12px 16px;"><span style="background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase;">High</span></td>
                                <td style="padding: 12px 16px; text-align: right;">
                                    <button class="btn" style="padding: 2px 8px; font-size: 11px; background: var(--bg-card-secondary);" onclick="openModal({
                                        title: 'Log Delay Root Cause: CHP-001',
                                        bodyHtml: '<div class=\\'form-row\\'><label>Root Cause</label><select id=\\'rc-sel-chp\\'><option>Control Panel Power Delay</option><option>Vendor Rep Unavailable</option></select></div><div class=\\'form-row\\'><label>Impact Notes</label><input id=\\'rc-notes-chp\\' type=\\'text\\' placeholder=\\'Panel power pending test\\'/></div>',
                                        confirmText: 'Save Root Cause',
                                        onConfirm: (overlay) => {
                                            const cause = overlay.querySelector('#rc-sel-chp')?.value;
                                            const notes = overlay.querySelector('#rc-notes-chp')?.value?.trim();
                                            window.addAuditLog('Admin', 'UPDATE', 'DurationAnalysis', 'CHP-001', 'Delay cause logged: ' + cause + (notes ? ' - ' + notes : ''));
                                            showToast('Delay root cause logged for CHP-001.', 'success');
                                            window.renderApp();
                                        }
                                    })">Log Cause</button>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 16px; font-weight: 600; color: var(--text-main); font-size: 13px;">FCU-001</td>
                                <td style="padding: 12px 16px; color: var(--text-secondary); font-size: 13px;">CxL2</td>
                                <td style="padding: 12px 16px; font-size: 13px;">15</td>
                                <td style="padding: 12px 16px; font-size: 13px;">15</td>
                                <td style="padding: 12px 16px; color: #10b981; font-weight: 600; font-size: 13px;">0 Days</td>
                                <td style="padding: 12px 16px;"><span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase;">None</span></td>
                                <td style="padding: 12px 16px; text-align: right;">
                                    <button class="btn" style="padding: 2px 8px; font-size: 11px; background: var(--bg-card-secondary);" onclick="openModal({
                                        title: 'Equipment Details: FCU-001',
                                        bodyHtml: '<div class=\\'form-row\\'><label>Equipment ID</label><span style=\\'font-weight:bold;color:var(--brand-blue);\\'>FCU-001</span></div><div class=\\'form-row\\'><label>Phase</label><span>CxL2 Pre-Cx</span></div><div class=\\'form-row\\'><label>Planned / Actual</label><span>15 Days / 15 Days</span></div><div class=\\'form-row\\'><label>Variance</label><span style=\\'color:#10b981;font-weight:bold;\\'>0 Days (On Schedule)</span></div>',
                                        confirmText: 'Close',
                                        onConfirm: () => {}
                                    })">Details</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    return `
        <div class="gantt-view-container gantt-view" style="padding: 0;">
            ${tabsHtml}
            ${contentHtml}
        </div>
    `;
}

// CSV Export helper — called from export button to avoid backtick-in-template-literal issue
window._ganttExportCsv = function() {
  const s = window.appState;
  const equipment = (s && s.equipment && s.equipment.length > 0) ? s.equipment : masterEquipmentList;
  const gf = (s && s.ganttFilters) || { building: 'all', equipmentType: 'all', phase: 'all' };
  // Apply current filters to export only visible rows
  const filtered = equipment.filter(e => {
    const bOk = gf.building === 'all' || (e.buildingName || e.building || '') === gf.building;
    const tOk = gf.equipmentType === 'all' || (e.type || '').toLowerCase().includes(gf.equipmentType.toLowerCase());
    const pOk = gf.phase === 'all' || (e.phase || '').toLowerCase().includes(gf.phase.toLowerCase());
    return bOk && tOk && pOk;
  });
  const header = 'Equipment ID,Name,Type,Building,Room,Phase,Status';
  const rows = filtered.map(e => [
    e.id, e.name || '', e.type || '', e.buildingName || e.building || '', e.room || '', e.phase || '', e.status || ''
  ].join(',')).join('\n');
  const csv = header + '\n' + rows;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'GANT_Export_' + new Date().toISOString().slice(0,10) + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('GANT Schedule exported as CSV (' + filtered.length + ' equipment rows).', 'success');
};
