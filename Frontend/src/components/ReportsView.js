export function renderReportsView(subRoute = 'weekly-report') {
  const currentRoute = ['weekly-report', 'monthly-report', 'export-report'].includes(subRoute) 
    ? subRoute 
    : 'weekly-report';

  const renderTabs = () => {
    return `
      <div class="view-tabs">
        <span class="view-tab ${currentRoute === 'weekly-report' ? 'active' : ''}" data-route="weekly-report">
          <i data-lucide="calendar" style="width: 16px; height: 16px;"></i> Weekly Report
        </span>
        <span class="view-tab ${currentRoute === 'monthly-report' ? 'active' : ''}" data-route="monthly-report">
          <i data-lucide="pie-chart" style="width: 16px; height: 16px;"></i> Monthly Report
        </span>
        <span class="view-tab ${currentRoute === 'export-report' ? 'active' : ''}" data-route="export-report">
          <i data-lucide="download" style="width: 16px; height: 16px;"></i> Export Report
        </span>
      </div>
    `;
  };

  const renderWeeklyReport = () => {
    const wf = (window.appState && window.appState.reportFilters) || {};
    const selectedWeek = wf.week || 'Week 32 (03-08 Aug 2026)';
    const weeks = ['Week 32 (03-08 Aug 2026)', 'Week 31 (27 Jul-02 Aug 2026)', 'Week 30 (20-26 Jul 2026)', 'Week 29 (13-19 Jul 2026)'];
    return `
      <div class="dashboard-card" style="margin-bottom: 1rem; padding: 0.75rem;">
        <div class="card-top-title" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.35rem;">
          <h2 style="margin: 0; font-size: 1rem;">Weekly Progress Report</h2>
          <div style="display: flex; gap: 0.35rem; align-items: center;">
            <label style="color: var(--text-secondary); font-size: 0.72rem;">Select Week:</label>
            <select style="padding: 0.15rem 0.35rem; border-radius: 4px; border: 1px solid var(--border-card); background: var(--bg-card); color: var(--text-main); font-size: 0.72rem;"
              onchange="window.setReportFilter('week', this.value)">
              ${weeks.map(w => `<option ${w === selectedWeek ? 'selected' : ''}>${w}</option>`).join('')}
            </select>
          </div>
        </div>
        
        <div class="four-stat-boxes" style="margin-top: 0.6rem;">
          <div class="stat-mini-box metric-card" style="padding: 0.4rem 0.5rem; background: var(--bg-card-secondary); border-radius: 6px; border: 1px solid var(--border-card);">
            <div class="metric-card-title" style="color: var(--text-secondary); font-size: 0.68rem; margin-bottom: 0.1rem;">Activities Planned</div>
            <div class="metric-big-num" style="font-size: 1.1rem; font-weight: bold; color: var(--text-main);">124</div>
          </div>
          <div class="stat-mini-box metric-card" style="padding: 0.4rem 0.5rem; background: var(--bg-card-secondary); border-radius: 6px; border: 1px solid var(--border-card);">
            <div class="metric-card-title" style="color: var(--text-secondary); font-size: 0.68rem; margin-bottom: 0.1rem;">Completed</div>
            <div class="metric-big-num" style="font-size: 1.1rem; font-weight: bold; color: var(--text-main);">118</div>
          </div>
          <div class="stat-mini-box metric-card" style="padding: 0.4rem 0.5rem; background: var(--bg-card-secondary); border-radius: 6px; border: 1px solid var(--border-card);">
            <div class="metric-card-title" style="color: var(--text-secondary); font-size: 0.68rem; margin-bottom: 0.1rem;">Completion Rate %</div>
            <div class="metric-big-num" style="font-size: 1.1rem; font-weight: bold; color: #10b981;">95.1%</div>
          </div>
          <div class="stat-mini-box metric-card" style="padding: 0.4rem 0.5rem; background: var(--bg-card-secondary); border-radius: 6px; border: 1px solid var(--border-card);">
            <div class="metric-card-title" style="color: var(--text-secondary); font-size: 0.68rem; margin-bottom: 0.1rem;">Issues Count</div>
            <div class="metric-big-num" style="font-size: 1.1rem; font-weight: bold; color: #ef4444;">3</div>
          </div>
        </div>

        <div class="reports-two-col-grid" style="margin-top: 0.75rem; gap: 0.75rem;">
          <div>
            <h3 style="font-size: 0.8rem; margin-bottom: 0.35rem; color: var(--text-main);">Progress by CxL Phase</h3>
            <div class="table-responsive-wrapper" style="overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%;">
              <table class="summary-table" style="width: 100%; min-width: 340px; text-align: left; border-collapse: collapse; color: var(--text-main); font-size: 0.75rem; line-height: 1.2;">
              <thead>
                <tr style="border-bottom: 1.5px solid var(--border-card);">
                  <th style="padding: 0.35rem 0.4rem; white-space: nowrap;">Phase</th>
                  <th style="padding: 0.35rem 0.4rem; text-align: center; white-space: nowrap;">Planned</th>
                  <th style="padding: 0.35rem 0.4rem; text-align: center; white-space: nowrap;">Actual</th>
                  <th style="padding: 0.35rem 0.4rem; text-align: center; white-space: nowrap;">Delta</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid var(--border-card);">
                  <td style="padding: 0.35rem 0.4rem; font-weight: 500; white-space: nowrap;">L1 - Factory Acceptance Testing</td>
                  <td style="padding: 0.35rem 0.4rem; text-align: center;">100%</td>
                  <td style="padding: 0.35rem 0.4rem; text-align: center;">100%</td>
                  <td style="padding: 0.35rem 0.4rem; text-align: center; color: #10b981;">0%</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-card);">
                  <td style="padding: 0.35rem 0.4rem; font-weight: 500; white-space: nowrap;">L2 - Site Receipt & Installation</td>
                  <td style="padding: 0.35rem 0.4rem; text-align: center;">90%</td>
                  <td style="padding: 0.35rem 0.4rem; text-align: center;">85%</td>
                  <td style="padding: 0.35rem 0.4rem; text-align: center; color: #ef4444;">-5%</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-card);">
                  <td style="padding: 0.35rem 0.4rem; font-weight: 500; white-space: nowrap;">L3 - Pre-Commissioning Check</td>
                  <td style="padding: 0.35rem 0.4rem; text-align: center;">40%</td>
                  <td style="padding: 0.35rem 0.4rem; text-align: center;">42%</td>
                  <td style="padding: 0.35rem 0.4rem; text-align: center; color: #10b981;">+2%</td>
                </tr>
                <tr>
                  <td style="padding: 0.35rem 0.4rem; font-weight: 500; white-space: nowrap;">L4 - Functional System Testing</td>
                  <td style="padding: 0.35rem 0.4rem; text-align: center;">10%</td>
                  <td style="padding: 0.35rem 0.4rem; text-align: center;">8%</td>
                  <td style="padding: 0.35rem 0.4rem; text-align: center; color: #ef4444;">-2%</td>
                </tr>
              </tbody>
            </table>
          </div>
          </div>
          <div>
            <h3 style="font-size: 0.8rem; margin-bottom: 0.35rem; color: var(--text-main);">Weekly Trend (Planned vs Actual)</h3>
            <div class="chart-responsive-wrapper" style="background: var(--bg-card-secondary); padding: 0.5rem; border-radius: 6px; border: 1px solid var(--border-card); overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%;">
              <svg viewBox="0 0 360 110" style="min-width: 320px; width: 100%; height: 100px; display: block;">
                <!-- Grid Lines -->
                <line x1="15" y1="80" x2="345" y2="80" stroke="var(--border-card)" stroke-width="1" />
                <line x1="15" y1="55" x2="345" y2="55" stroke="var(--border-card)" stroke-width="1" stroke-dasharray="4" />
                <line x1="15" y1="30" x2="345" y2="30" stroke="var(--border-card)" stroke-width="1" stroke-dasharray="4" />
                <line x1="15" y1="5" x2="345" y2="5" stroke="var(--border-card)" stroke-width="1" stroke-dasharray="4" />
                
                <!-- Planned (Dashed) -->
                <polyline points="30,75 105,52 180,32 255,20 330,8" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-dasharray="3,3" />
                
                <!-- Actual (Solid Line) -->
                <polyline points="30,78 105,58 180,36 255,24 330,5" fill="none" stroke="var(--brand-blue)" stroke-width="2" />
                <circle cx="30" cy="78" r="2.5" fill="var(--brand-blue)" />
                <circle cx="105" cy="58" r="2.5" fill="var(--brand-blue)" />
                <circle cx="180" cy="36" r="2.5" fill="var(--brand-blue)" />
                <circle cx="255" cy="24" r="2.5" fill="var(--brand-blue)" />
                <circle cx="330" cy="5" r="2.5" fill="var(--brand-blue)" />
                
                <!-- X-Axis Labels -->
                <text x="30" y="98" text-anchor="middle" fill="var(--text-secondary)" font-size="9.5" font-weight="600">W39</text>
                <text x="105" y="98" text-anchor="middle" fill="var(--text-secondary)" font-size="9.5" font-weight="600">W40</text>
                <text x="180" y="98" text-anchor="middle" fill="var(--text-secondary)" font-size="9.5" font-weight="600">W41</text>
                <text x="255" y="98" text-anchor="middle" fill="var(--text-secondary)" font-size="9.5" font-weight="600">W42</text>
                <text x="330" y="98" text-anchor="middle" fill="var(--text-secondary)" font-size="9.5" font-weight="600">W43</text>
              </svg>
            </div>
            <div style="display: flex; gap: 0.75rem; margin-top: 0.35rem; font-size: 0.7rem; justify-content: center; color: var(--text-secondary);">
              <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 12px; border-bottom: 2px dashed var(--text-muted);"></span> Planned</span>
              <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 12px; border-bottom: 2.5px solid var(--brand-blue);"></span> Actual</span>
            </div>
          </div>
        </div>

        <div style="margin-top: 0.75rem;">
          <h3 style="font-size: 0.8rem; margin-bottom: 0.35rem; color: var(--text-main);">Key Highlights & Issues</h3>
          <ul style="color: var(--text-main); line-height: 1.35; padding-left: 1rem; margin: 0; font-size: 0.72rem;">
            <li><strong>Highlight:</strong> L1 FAT completed ahead of schedule for Main Switchboards.</li>
            <li><strong>Highlight:</strong> Pre-commissioning docs approved for HVAC units on Deck 3.</li>
            <li><strong>Issue:</strong> Delay in L2 Receipt Verification for Transformer TX-02 (Severity: Medium).</li>
            <li><strong>Issue:</strong> Quality non-conformance logged for piping welds in sector B; rework scheduled W43.</li>
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
      <div class="dashboard-card" style="margin-bottom: 1rem; padding: 0.75rem;">
        <div class="card-top-title" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.35rem;">
          <h2 style="margin: 0; font-size: 1rem;">Monthly Executive Summary</h2>
          <div style="display: flex; gap: 0.35rem; align-items: center;">
            <label style="color: var(--text-secondary); font-size: 0.72rem;">Select Month:</label>
            <select style="padding: 0.15rem 0.35rem; border-radius: 4px; border: 1px solid var(--border-card); background: var(--bg-card); color: var(--text-main); font-size: 0.72rem;"
              onchange="window.setReportFilter('month', this.value)">
              ${months.map(m => `<option ${m === selectedMonth ? 'selected' : ''}>${m}</option>`).join('')}
            </select>
          </div>
        </div>
        
        <div class="four-stat-boxes" style="margin-top: 0.6rem;">
          <div class="stat-mini-box metric-card" style="padding: 0.4rem 0.5rem; background: var(--bg-card-secondary); border-radius: 6px; border: 1px solid var(--border-card);">
            <div class="metric-card-title" style="color: var(--text-secondary); font-size: 0.68rem; margin-bottom: 0.1rem;">Overall Progress %</div>
            <div class="metric-big-num" style="font-size: 1.1rem; font-weight: bold; color: var(--brand-blue);">68.5%</div>
          </div>
          <div class="stat-mini-box metric-card" style="padding: 0.4rem 0.5rem; background: var(--bg-card-secondary); border-radius: 6px; border: 1px solid var(--border-card);">
            <div class="metric-card-title" style="color: var(--text-secondary); font-size: 0.68rem; margin-bottom: 0.1rem;">Schedule Variance</div>
            <div class="metric-big-num" style="font-size: 1.1rem; font-weight: bold; color: #10b981;">+2 Days</div>
          </div>
          <div class="stat-mini-box metric-card" style="padding: 0.4rem 0.5rem; background: var(--bg-card-secondary); border-radius: 6px; border: 1px solid var(--border-card);">
            <div class="metric-card-title" style="color: var(--text-secondary); font-size: 0.68rem; margin-bottom: 0.1rem;">Cost Performance (CPI)</div>
            <div class="metric-big-num" style="font-size: 1.1rem; font-weight: bold; color: #10b981;">1.04</div>
          </div>
          <div class="stat-mini-box metric-card" style="padding: 0.4rem 0.5rem; background: var(--bg-card-secondary); border-radius: 6px; border: 1px solid var(--border-card);">
            <div class="metric-card-title" style="color: var(--text-secondary); font-size: 0.68rem; margin-bottom: 0.1rem;">Quality Score</div>
            <div class="metric-big-num" style="font-size: 1.1rem; font-weight: bold; color: #f59e0b;">92/100</div>
          </div>
        </div>

        <div class="reports-two-col-grid" style="margin-top: 0.75rem; gap: 0.75rem;">
          <div>
            <h3 style="font-size: 0.8rem; margin-bottom: 0.35rem; color: var(--text-main);">Equipment Completion by Type</h3>
            <div class="chart-responsive-wrapper" style="background: var(--bg-card-secondary); padding: 0.5rem; border-radius: 6px; border: 1px solid var(--border-card); overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%;">
              <svg viewBox="0 0 360 115" style="min-width: 320px; width: 100%; height: 105px; display: block;">
                <line x1="10" y1="95" x2="350" y2="95" stroke="var(--border-card)" stroke-width="1.5" />
                
                <rect x="20" y="27" width="38" height="68" fill="var(--brand-blue)" rx="3"/>
                <text x="39" y="20" text-anchor="middle" fill="var(--text-main)" font-size="9.5" font-weight="bold">85%</text>
                <text x="39" y="108" text-anchor="middle" fill="var(--text-secondary)" font-size="9.5" font-weight="600">ELEC</text>
                
                <rect x="85" y="45" width="38" height="50" fill="var(--brand-blue)" rx="3"/>
                <text x="104" y="38" text-anchor="middle" fill="var(--text-main)" font-size="9.5" font-weight="bold">62%</text>
                <text x="104" y="108" text-anchor="middle" fill="var(--text-secondary)" font-size="9.5" font-weight="600">HVAC</text>
                
                <rect x="150" y="19" width="38" height="76" fill="var(--brand-blue)" rx="3"/>
                <text x="169" y="12" text-anchor="middle" fill="var(--text-main)" font-size="9.5" font-weight="bold">95%</text>
                <text x="169" y="108" text-anchor="middle" fill="var(--text-secondary)" font-size="9.5" font-weight="600">FIRE</text>
                
                <rect x="215" y="63" width="38" height="32" fill="var(--brand-blue)" rx="3"/>
                <text x="234" y="56" text-anchor="middle" fill="var(--text-main)" font-size="9.5" font-weight="bold">40%</text>
                <text x="234" y="108" text-anchor="middle" fill="var(--text-secondary)" font-size="9.5" font-weight="600">MECH</text>
                
                <rect x="280" y="75" width="38" height="20" fill="var(--brand-blue)" rx="3"/>
                <text x="299" y="68" text-anchor="middle" fill="var(--text-main)" font-size="9.5" font-weight="bold">25%</text>
                <text x="299" y="108" text-anchor="middle" fill="var(--text-secondary)" font-size="9.5" font-weight="600">CTRL</text>
              </svg>
            </div>
          </div>
          <div>
            <h3 style="font-size: 0.8rem; margin-bottom: 0.35rem; color: var(--text-main);">Top 5 Risk Register</h3>
            <div class="table-responsive-wrapper" style="overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%;">
              <table class="summary-table" style="width: 100%; min-width: 340px; text-align: left; border-collapse: collapse; color: var(--text-main); font-size: 0.75rem; line-height: 1.2;">
              <thead>
                <tr style="border-bottom: 1.5px solid var(--border-card);">
                  <th style="padding: 0.35rem 0.4rem; white-space: nowrap;">Risk ID</th>
                  <th style="padding: 0.35rem 0.4rem; white-space: nowrap;">Description</th>
                  <th style="padding: 0.35rem 0.4rem; text-align: center; white-space: nowrap;">Severity</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid var(--border-card);">
                  <td style="padding: 0.35rem 0.4rem; font-family: monospace; font-size: 0.72rem; white-space: nowrap;">RSK-042</td>
                  <td style="padding: 0.35rem 0.4rem; white-space: nowrap;">Vendor delay on Control Panels</td>
                  <td style="padding: 0.35rem 0.4rem; text-align: center; white-space: nowrap;"><span style="background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 2px 6px; border-radius: 10px; font-weight: bold; font-size: 0.68rem;">High</span></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-card);">
                  <td style="padding: 0.35rem 0.4rem; font-family: monospace; font-size: 0.72rem; white-space: nowrap;">RSK-018</td>
                  <td style="padding: 0.35rem 0.4rem; white-space: nowrap;">Site access limits in Zone B</td>
                  <td style="padding: 0.35rem 0.4rem; text-align: center; white-space: nowrap;"><span style="background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 2px 6px; border-radius: 10px; font-weight: bold; font-size: 0.68rem;">High</span></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-card);">
                  <td style="padding: 0.35rem 0.4rem; font-family: monospace; font-size: 0.72rem; white-space: nowrap;">RSK-055</td>
                  <td style="padding: 0.35rem 0.4rem; white-space: nowrap;">Design clash in MECH/ELEC routing</td>
                  <td style="padding: 0.35rem 0.4rem; text-align: center; white-space: nowrap;"><span style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 2px 6px; border-radius: 10px; font-weight: bold; font-size: 0.68rem;">Medium</span></td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-card);">
                  <td style="padding: 0.35rem 0.4rem; font-family: monospace; font-size: 0.72rem; white-space: nowrap;">RSK-061</td>
                  <td style="padding: 0.35rem 0.4rem; white-space: nowrap;">Pending L4 procedure sign-off</td>
                  <td style="padding: 0.35rem 0.4rem; text-align: center; white-space: nowrap;"><span style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 2px 6px; border-radius: 10px; font-weight: bold; font-size: 0.68rem;">Medium</span></td>
                </tr>
                <tr>
                  <td style="padding: 0.35rem 0.4rem; font-family: monospace; font-size: 0.72rem; white-space: nowrap;">RSK-033</td>
                  <td style="padding: 0.35rem 0.4rem; white-space: nowrap;">Resource constraints testing team</td>
                  <td style="padding: 0.35rem 0.4rem; text-align: center; white-space: nowrap;"><span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 2px 6px; border-radius: 10px; font-weight: bold; font-size: 0.68rem;">Low</span></td>
                </tr>
              </tbody>
            </table>
          </div>
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
        
        <div class="nas-tab-grid">
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
              <div style="padding: 1rem; color: var(--text-main); background: var(--bg-card); white-space: pre; font-family: monospace; font-size: 0.75rem; line-height: 1.6; overflow-x: auto; -webkit-overflow-scrolling: touch;">REPORT_ID, DATE, PHASE, PLANNED_PCT, ACTUAL_PCT, STATUS
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
