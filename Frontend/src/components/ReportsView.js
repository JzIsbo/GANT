export function renderReportsView(subRoute = 'weekly-report') {
  const currentRoute = ['weekly-report', 'monthly-report', 'export-report'].includes(subRoute) 
    ? subRoute 
    : 'weekly-report';

  const renderTabs = () => {
    return `
      <div class="view-tabs" style="display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-card); padding-bottom: 0.5rem;">
        <span class="view-tab ${currentRoute === 'weekly-report' ? 'active' : ''}" data-route="weekly-report" style="cursor: pointer; padding: 0.5rem 1rem; border-radius: 4px; font-weight: 500; display: flex; align-items: center; gap: 0.5rem; ${currentRoute === 'weekly-report' ? 'background: var(--brand-blue); color: white;' : 'color: var(--text-secondary);'}">
          <i data-lucide="calendar" style="width: 18px; height: 18px;"></i>Weekly Report
        </span>
        <span class="view-tab ${currentRoute === 'monthly-report' ? 'active' : ''}" data-route="monthly-report" style="cursor: pointer; padding: 0.5rem 1rem; border-radius: 4px; font-weight: 500; display: flex; align-items: center; gap: 0.5rem; ${currentRoute === 'monthly-report' ? 'background: var(--brand-blue); color: white;' : 'color: var(--text-secondary);'}">
          <i data-lucide="pie-chart" style="width: 18px; height: 18px;"></i>Monthly Report
        </span>
        <span class="view-tab ${currentRoute === 'export-report' ? 'active' : ''}" data-route="export-report" style="cursor: pointer; padding: 0.5rem 1rem; border-radius: 4px; font-weight: 500; display: flex; align-items: center; gap: 0.5rem; ${currentRoute === 'export-report' ? 'background: var(--brand-blue); color: white;' : 'color: var(--text-secondary);'}">
          <i data-lucide="download" style="width: 18px; height: 18px;"></i>Export Report
        </span>
      </div>
    `;
  };

  const renderWeeklyReport = () => {
    const wf = (window.appState && window.appState.reportFilters) || {};
    const selectedWeek = wf.week || 'Week 32 (03-08 Aug 2026)';
    const weeks = ['Week 32 (03-08 Aug 2026)', 'Week 31 (27 Jul-02 Aug 2026)', 'Week 30 (20-26 Jul 2026)', 'Week 29 (13-19 Jul 2026)'];
    return `
      <div class="dashboard-card" style="margin-bottom: 1.5rem;">
        <div class="card-top-title">
          <h2 style="margin: 0; font-size: 1.25rem;">Weekly Progress Report</h2>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <label style="color: var(--text-secondary); font-size: 0.875rem;">Select Week:</label>
            <select style="padding: 0.25rem 0.5rem; border-radius: 4px; border: 1px solid var(--border-card); background: var(--bg-card); color: var(--text-main);"
              onchange="window.setReportFilter('week', this.value)">
              ${weeks.map(w => `<option ${w === selectedWeek ? 'selected' : ''}>${w}</option>`).join('')}
            </select>
          </div>
        </div>
        
        <div class="four-stat-boxes" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
          <div class="stat-mini-box metric-card" style="padding: 1rem; background: var(--bg-card-secondary); border-radius: 8px; border: 1px solid var(--border-card);">
            <div class="metric-card-title" style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Activities Planned</div>
            <div class="metric-big-num" style="font-size: 1.5rem; font-weight: bold; color: var(--text-main);">124</div>
          </div>
          <div class="stat-mini-box metric-card" style="padding: 1rem; background: var(--bg-card-secondary); border-radius: 8px; border: 1px solid var(--border-card);">
            <div class="metric-card-title" style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Completed</div>
            <div class="metric-big-num" style="font-size: 1.5rem; font-weight: bold; color: var(--text-main);">118</div>
          </div>
          <div class="stat-mini-box metric-card" style="padding: 1rem; background: var(--bg-card-secondary); border-radius: 8px; border: 1px solid var(--border-card);">
            <div class="metric-card-title" style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Completion Rate %</div>
            <div class="metric-big-num" style="font-size: 1.5rem; font-weight: bold; color: #10b981;">95.1%</div>
          </div>
          <div class="stat-mini-box metric-card" style="padding: 1rem; background: var(--bg-card-secondary); border-radius: 8px; border: 1px solid var(--border-card);">
            <div class="metric-card-title" style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Issues Count</div>
            <div class="metric-big-num" style="font-size: 1.5rem; font-weight: bold; color: #ef4444;">3</div>
          </div>
        </div>

        <div style="margin-top: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div>
            <h3 style="font-size: 1rem; margin-bottom: 1rem; color: var(--text-main);">Progress by CxL Phase</h3>
            <table class="summary-table" style="width: 100%; text-align: left; border-collapse: collapse; color: var(--text-main);">
              <thead>
                <tr style="border-bottom: 2px solid var(--border-card);">
                  <th style="padding: 0.75rem 0.5rem;">Phase</th>
                  <th style="padding: 0.75rem 0.5rem;">Planned</th>
                  <th style="padding: 0.75rem 0.5rem;">Actual</th>
                  <th style="padding: 0.75rem 0.5rem;">Delta</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid var(--border-card);">
                  <td style="padding: 0.75rem 0.5rem;">L1 - Factory Testing</td>
                  <td style="padding: 0.75rem 0.5rem;">100%</td>
                  <td style="padding: 0.75rem 0.5rem;">100%</td>
                  <td style="padding: 0.75rem 0.5rem; color: #10b981;">0%</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-card);">
                  <td style="padding: 0.75rem 0.5rem;">L2 - Receipt Verification</td>
                  <td style="padding: 0.75rem 0.5rem;">90%</td>
                  <td style="padding: 0.75rem 0.5rem;">85%</td>
                  <td style="padding: 0.75rem 0.5rem; color: #ef4444;">-5%</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-card);">
                  <td style="padding: 0.75rem 0.5rem;">L3 - Pre-Commissioning</td>
                  <td style="padding: 0.75rem 0.5rem;">40%</td>
                  <td style="padding: 0.75rem 0.5rem;">42%</td>
                  <td style="padding: 0.75rem 0.5rem; color: #10b981;">+2%</td>
                </tr>
                <tr>
                  <td style="padding: 0.75rem 0.5rem;">L4 - Functional Testing</td>
                  <td style="padding: 0.75rem 0.5rem;">10%</td>
                  <td style="padding: 0.75rem 0.5rem;">8%</td>
                  <td style="padding: 0.75rem 0.5rem; color: #ef4444;">-2%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3 style="font-size: 1rem; margin-bottom: 1rem; color: var(--text-main);">Weekly Trend (Planned vs Actual)</h3>
            <div style="background: var(--bg-card-secondary); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-card); height: 200px; display: flex; align-items: flex-end;">
              <svg viewBox="0 0 400 150" style="width: 100%; height: 100%; overflow: visible;">
                <!-- Grid Lines -->
                <line x1="0" y1="150" x2="400" y2="150" stroke="var(--border-card)" stroke-width="1" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="var(--border-card)" stroke-width="1" stroke-dasharray="4" />
                <line x1="0" y1="50" x2="400" y2="50" stroke="var(--border-card)" stroke-width="1" stroke-dasharray="4" />
                <line x1="0" y1="0" x2="400" y2="0" stroke="var(--border-card)" stroke-width="1" stroke-dasharray="4" />
                
                <!-- Planned (Dashed) -->
                <polyline points="0,140 100,100 200,60 300,40 400,20" fill="none" stroke="var(--text-muted)" stroke-width="3" stroke-dasharray="5,5" />
                
                <!-- Actual (Solid Line) -->
                <polyline points="0,145 100,110 200,70 300,50 400,10" fill="none" stroke="var(--brand-blue)" stroke-width="3" />
                <circle cx="0" cy="145" r="5" fill="var(--brand-blue)" />
                <circle cx="100" cy="110" r="5" fill="var(--brand-blue)" />
                <circle cx="200" cy="70" r="5" fill="var(--brand-blue)" />
                <circle cx="300" cy="50" r="5" fill="var(--brand-blue)" />
                <circle cx="400" cy="10" r="5" fill="var(--brand-blue)" />
                
                <!-- X-Axis Labels -->
                <text x="0" y="175" text-anchor="middle" fill="var(--text-secondary)" font-size="12">W39</text>
                <text x="100" y="175" text-anchor="middle" fill="var(--text-secondary)" font-size="12">W40</text>
                <text x="200" y="175" text-anchor="middle" fill="var(--text-secondary)" font-size="12">W41</text>
                <text x="300" y="175" text-anchor="middle" fill="var(--text-secondary)" font-size="12">W42</text>
                <text x="400" y="175" text-anchor="middle" fill="var(--text-secondary)" font-size="12">W43</text>
              </svg>
            </div>
            <div style="display: flex; gap: 1.5rem; margin-top: 1.5rem; font-size: 0.875rem; justify-content: center; color: var(--text-secondary);">
              <span style="display: flex; align-items: center; gap: 0.5rem;"><span style="width: 16px; border-bottom: 2px dashed var(--text-muted);"></span> Planned</span>
              <span style="display: flex; align-items: center; gap: 0.5rem;"><span style="width: 16px; border-bottom: 3px solid var(--brand-blue);"></span> Actual</span>
            </div>
          </div>
        </div>

        <div style="margin-top: 2.5rem;">
          <h3 style="font-size: 1rem; margin-bottom: 1rem; color: var(--text-main);">Key Highlights & Issues</h3>
          <ul style="color: var(--text-main); line-height: 1.8; padding-left: 1.5rem; margin: 0;">
            <li><strong>Highlight:</strong> Level 1 Factory Acceptance Testing completed ahead of schedule for Main Switchboards.</li>
            <li><strong>Highlight:</strong> Pre-commissioning documentation approved for HVAC units on Deck 3.</li>
            <li><strong>Issue:</strong> Delay in L2 Receipt Verification for Transformer TX-02 due to missing shipping manifest (Severity: Medium).</li>
            <li><strong>Issue:</strong> Quality non-conformance logged for piping welds in sector B; rework scheduled for Week 43.</li>
          </ul>
        </div>
      </div>
    `;
  };

  const renderMonthlyReport = () => {
    const wf = (window.appState && window.appState.reportFilters) || {};
    const selectedMonth = wf.month || 'August 2026';
    const months = ['August 2026', 'September 2026', 'October 2026', 'November 2026'];
    return `
      <div class="dashboard-card" style="margin-bottom: 1.5rem;">
        <div class="card-top-title">
          <h2 style="margin: 0; font-size: 1.25rem;">Monthly Executive Summary</h2>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <label style="color: var(--text-secondary); font-size: 0.875rem;">Select Month:</label>
            <select style="padding: 0.25rem 0.5rem; border-radius: 4px; border: 1px solid var(--border-card); background: var(--bg-card); color: var(--text-main);"
              onchange="window.setReportFilter('month', this.value)">
              ${months.map(m => `<option ${m === selectedMonth ? 'selected' : ''}>${m}</option>`).join('')}
            </select>
          </div>
        </div>
        
        <div class="four-stat-boxes" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
          <div class="stat-mini-box metric-card" style="padding: 1rem; background: var(--bg-card-secondary); border-radius: 8px; border: 1px solid var(--border-card);">
            <div class="metric-card-title" style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Overall Progress %</div>
            <div class="metric-big-num" style="font-size: 1.5rem; font-weight: bold; color: var(--brand-blue);">68.5%</div>
          </div>
          <div class="stat-mini-box metric-card" style="padding: 1rem; background: var(--bg-card-secondary); border-radius: 8px; border: 1px solid var(--border-card);">
            <div class="metric-card-title" style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Schedule Variance</div>
            <div class="metric-big-num" style="font-size: 1.5rem; font-weight: bold; color: #10b981;">+2 Days</div>
          </div>
          <div class="stat-mini-box metric-card" style="padding: 1rem; background: var(--bg-card-secondary); border-radius: 8px; border: 1px solid var(--border-card);">
            <div class="metric-card-title" style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Cost Performance (CPI)</div>
            <div class="metric-big-num" style="font-size: 1.5rem; font-weight: bold; color: #10b981;">1.04</div>
          </div>
          <div class="stat-mini-box metric-card" style="padding: 1rem; background: var(--bg-card-secondary); border-radius: 8px; border: 1px solid var(--border-card);">
            <div class="metric-card-title" style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">Quality Score</div>
            <div class="metric-big-num" style="font-size: 1.5rem; font-weight: bold; color: #f59e0b;">92/100</div>
          </div>
        </div>

        <div style="margin-top: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div>
            <h3 style="font-size: 1rem; margin-bottom: 1rem; color: var(--text-main);">Equipment Completion by Type</h3>
            <div style="background: var(--bg-card-secondary); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-card); height: 250px; display: flex; align-items: flex-end;">
              <svg viewBox="0 0 400 200" style="width: 100%; height: 100%; overflow: visible;">
                <line x1="0" y1="200" x2="400" y2="200" stroke="var(--border-card)" stroke-width="2" />
                
                <rect x="20" y="50" width="40" height="150" fill="var(--brand-blue)" rx="2"/>
                <text x="40" y="40" text-anchor="middle" fill="var(--text-main)" font-size="12">85%</text>
                <text x="40" y="220" text-anchor="middle" fill="var(--text-secondary)" font-size="11">ELEC</text>
                
                <rect x="100" y="90" width="40" height="110" fill="var(--brand-blue)" rx="2"/>
                <text x="120" y="80" text-anchor="middle" fill="var(--text-main)" font-size="12">62%</text>
                <text x="120" y="220" text-anchor="middle" fill="var(--text-secondary)" font-size="11">HVAC</text>
                
                <rect x="180" y="20" width="40" height="180" fill="var(--brand-blue)" rx="2"/>
                <text x="200" y="10" text-anchor="middle" fill="var(--text-main)" font-size="12">95%</text>
                <text x="200" y="220" text-anchor="middle" fill="var(--text-secondary)" font-size="11">FIRE</text>
                
                <rect x="260" y="130" width="40" height="70" fill="var(--brand-blue)" rx="2"/>
                <text x="280" y="120" text-anchor="middle" fill="var(--text-main)" font-size="12">40%</text>
                <text x="280" y="220" text-anchor="middle" fill="var(--text-secondary)" font-size="11">MECH</text>
                
                <rect x="340" y="150" width="40" height="50" fill="var(--brand-blue)" rx="2"/>
                <text x="360" y="140" text-anchor="middle" fill="var(--text-main)" font-size="12">25%</text>
                <text x="360" y="220" text-anchor="middle" fill="var(--text-secondary)" font-size="11">CTRL</text>
              </svg>
            </div>
          </div>
          <div>
            <h3 style="font-size: 1rem; margin-bottom: 1rem; color: var(--text-main);">Top 5 Risk Register</h3>
            <table class="summary-table" style="width: 100%; text-align: left; border-collapse: collapse; font-size: 0.875rem; color: var(--text-main);">
              <thead>
                <tr style="border-bottom: 2px solid var(--border-card);">
                  <th style="padding: 0.75rem 0.5rem;">Risk ID</th>
                  <th style="padding: 0.75rem 0.5rem;">Description</th>
                  <th style="padding: 0.75rem 0.5rem;">Severity</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid var(--border-card);">
                  <td style="padding: 0.75rem 0.5rem; font-family: monospace;">RSK-042</td>
                  <td style="padding: 0.75rem 0.5rem;">Vendor delay on Control Panels</td>
                  <td style="padding: 0.75rem 0.5rem;"><span style="background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 2px 8px; border-radius: 12px; font-weight: bold;">High</span></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-card);">
                  <td style="padding: 0.75rem 0.5rem; font-family: monospace;">RSK-018</td>
                  <td style="padding: 0.75rem 0.5rem;">Site access limitations in Zone B</td>
                  <td style="padding: 0.75rem 0.5rem;"><span style="background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 2px 8px; border-radius: 12px; font-weight: bold;">High</span></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-card);">
                  <td style="padding: 0.75rem 0.5rem; font-family: monospace;">RSK-055</td>
                  <td style="padding: 0.75rem 0.5rem;">Design clash in MECH vs ELEC routing</td>
                  <td style="padding: 0.75rem 0.5rem;"><span style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 2px 8px; border-radius: 12px; font-weight: bold;">Medium</span></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-card);">
                  <td style="padding: 0.75rem 0.5rem; font-family: monospace;">RSK-061</td>
                  <td style="padding: 0.75rem 0.5rem;">Pending approval for L4 procedures</td>
                  <td style="padding: 0.75rem 0.5rem;"><span style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 2px 8px; border-radius: 12px; font-weight: bold;">Medium</span></td>
                </tr>
                <tr>
                  <td style="padding: 0.75rem 0.5rem; font-family: monospace;">RSK-033</td>
                  <td style="padding: 0.75rem 0.5rem;">Resource constraints for testing team</td>
                  <td style="padding: 0.75rem 0.5rem;"><span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 2px 8px; border-radius: 12px; font-weight: bold;">Low</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  };

  const renderExportReport = () => {
    const wf = (window.appState && window.appState.reportFilters) || {};
    const s = window.appState;
    const actCount = (s && s.activities) ? s.activities.length : 0;
    const eqCount  = (s && s.equipment)  ? Math.min(s.equipment.length, 50) : 0;
    return `
      <div class="dashboard-card" style="margin-bottom: 1.5rem;">
        <div class="card-top-title" style="margin-bottom: 1.5rem;">
          <h2 style="margin: 0; font-size: 1.25rem;">Export Reports Data</h2>
        </div>
        
        <div style="display: grid; grid-template-columns: 320px 1fr; gap: 2rem;">
          <div style="background: var(--bg-card-secondary); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-card);">
            <h3 style="font-size: 1rem; margin-top: 0; margin-bottom: 1.25rem; color: var(--text-main);">Export Configuration</h3>
            
            <div style="margin-bottom: 1.25rem;">
              <label style="display: block; font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Report Type</label>
              <select style="width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border-card); background: var(--bg-card); color: var(--text-main);"
                onchange="window.setReportFilter('type', this.value)">
                ${['Weekly Progress Report', 'Monthly Executive Report', 'Phase Gate Status', 'Equipment Detail Log'].map(t => `<option ${(wf.type || 'Weekly Progress Report') === t ? 'selected' : ''}>${t}</option>`).join('')}
              </select>
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label style="display: block; font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Date Range</label>
              <div style="display: flex; gap: 0.5rem;">
                <input type="date" value="${wf.startDate || '2026-10-01'}" style="flex: 1; width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border-card); background: var(--bg-card); color: var(--text-main);" onchange="window.setReportFilter('startDate', this.value)" />
                <input type="date" value="${wf.endDate || '2026-10-31'}" style="flex: 1; width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border-card); background: var(--bg-card); color: var(--text-main);" onchange="window.setReportFilter('endDate', this.value)" />
              </div>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.75rem;">Format</label>
              <div style="display: flex; gap: 1rem;">
                ${['PDF', 'Excel', 'CSV'].map(fmt => `
                <label style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem; color: var(--text-main); cursor: pointer;">
                  <input type="radio" name="format" value="${fmt}" ${(wf.format || 'CSV') === fmt ? 'checked' : ''} onchange="window.setReportFilter('format', this.value)" /> ${fmt}
                </label>`).join('')}
              </div>
            </div>

            <button style="width: 100%; padding: 0.75rem; background: var(--brand-blue); color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 0.5rem; transition: opacity 0.2s;" onclick="window.exportReportCsv()">
              <i data-lucide="download" style="width: 18px; height: 18px;"></i> Generate Export
            </button>
          </div>

          <div>
            <h3 style="font-size: 1rem; margin-top: 0; margin-bottom: 1.25rem; color: var(--text-main);">Data Preview</h3>
            <div style="border: 1px solid var(--border-card); border-radius: 8px; overflow: hidden; font-family: monospace; font-size: 0.875rem;">
              <div style="background: var(--bg-card-secondary); padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-card); color: var(--text-secondary); display: flex; justify-content: space-between; align-items: center;">
                <span>Preview: ${wf.week || 'Current Week'} — ${actCount} activities + ${eqCount} equipment rows</span>
                <span onclick="window.navigateTo('daily-activity')" style="font-size: 0.75rem; color: var(--brand-blue); cursor:pointer; text-decoration:underline;">View Activities</span>
              </div>
              <div style="padding: 1.5rem; color: var(--text-main); background: var(--bg-card); white-space: pre-wrap; line-height: 1.6;">REPORT_ID, DATE, PHASE, PLANNED_PCT, ACTUAL_PCT, STATUS
WPR-101, 2026-10-18, L1, 100, 100, COMPLETED
WPR-101, 2026-10-18, L2, 90, 85, DELAYED
WPR-101, 2026-10-18, L3, 40, 42, AHEAD
WPR-101, 2026-10-18, L4, 10, 8, DELAYED
WPR-101, 2026-10-18, L5, 0, 0, NOT_STARTED

SUMMARY: 124 Planned, 118 Completed.
ISSUES: 3 Active Issues Flagged.</div>
            </div>
            <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(59, 130, 246, 0.1); color: var(--brand-blue); border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.2); display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.875rem; line-height: 1.5;">
              <i data-lucide="info" style="width: 20px; height: 20px; flex-shrink: 0;"></i>
              <div>
                <strong>Export Information:</strong><br/>
                Exporting this report will compile all detailed logs across selected dates. File size is estimated at ~2.4 MB. The process may take a few moments for larger date ranges.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  let activeContent = '';
  if (currentRoute === 'weekly-report') activeContent = renderWeeklyReport();
  if (currentRoute === 'monthly-report') activeContent = renderMonthlyReport();
  if (currentRoute === 'export-report') activeContent = renderExportReport();

  return `
    <div class="reports-view-container animate-fade-in">
      ${renderTabs()}
      ${activeContent}
    </div>
  `;
}
