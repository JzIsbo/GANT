/**
 * MobileMenuModal.js - Ultra-Clean Modern Mobile Navigation Portal
 */
export function renderMobileMenuPortal() {
  const isDark = document.body.classList.contains('dark-mode');
  const themeIcon = isDark ? 'sun' : 'moon';
  const themeText = isDark ? 'Light' : 'Dark';

  return `
    <div id="mobile-menu-portal" class="mobile-menu-portal">
      <div class="mobile-menu-backdrop" onclick="window.closeMobileSidebar()" ontouchmove="event.preventDefault()"></div>
      <div class="mobile-menu-sheet">
        <!-- Drag Handle + Close Button -->
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem 1.25rem 0.25rem;flex-shrink:0;">
          <div class="mobile-menu-handle-bar" style="margin:0 auto 0 0;"></div>
          <button class="mobile-menu-close-btn" onclick="window.closeMobileSidebar()" title="Close Menu" style="width:28px;height:28px;border-radius:50%;background:var(--bg-card-secondary);border:1px solid var(--border-card);color:var(--text-main);display:flex;align-items:center;justify-content:center;cursor:pointer;">
            <i data-lucide="x" style="width:16px;height:16px;"></i>
          </button>
        </div>

        <!-- Scrollable 2-Column App Tiles Grid -->
        <div class="mobile-menu-body" style="padding-top: 0.5rem;">

          <!-- Section 1: Dashboards Utama -->
          <div class="menu-group-section">
            <div class="menu-group-title">
              <i data-lucide="compass" style="color:#2563eb;"></i> Dashboards Utama
            </div>
            <div class="mobile-app-tiles-grid">
              <div class="app-tile tile-blue" onclick="window.navigateTo('dashboard');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-blue-glow"><i data-lucide="layout-dashboard"></i></div>
                  <span class="tile-badge badge-blue">LIVE</span>
                </div>
                <div class="tile-title">Dashboard Proyek</div>
                <div class="tile-desc">Executive KPIs &amp; Progres</div>
              </div>

              <div class="app-tile tile-purple" onclick="window.navigateTo('gantt');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-purple-glow"><i data-lucide="gantt-chart-square"></i></div>
                  <span class="tile-badge badge-purple">5 Phases</span>
                </div>
                <div class="tile-title">GAN Timeline</div>
                <div class="tile-desc">Delivery → CxL5 gates</div>
              </div>
            </div>
          </div>

          <!-- Section 2: Activity Management (Multi-Project) -->
          <div class="menu-group-section">
            <div class="menu-group-title" style="display:flex;justify-content:space-between;align-items:center;">
              <div><i data-lucide="clipboard-list" style="color:#10b981;"></i> Activity Management</div>
              <div style="font-size:0.65rem;color:var(--brand-blue);font-weight:700;text-transform:uppercase;"><i data-lucide="folder-git-2" style="width:11px;height:11px;vertical-align:-1px;"></i> Project 1</div>
            </div>
            <div class="mobile-app-tiles-grid">
              <div class="app-tile tile-emerald" onclick="window.navigateTo('daily-activity');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-emerald-glow"><i data-lucide="calendar"></i></div>
                  <span class="tile-badge badge-emerald">Daily</span>
                </div>
                <div class="tile-title">Daily Activity</div>
                <div class="tile-desc">Input &amp; log harian</div>
              </div>

              <div class="app-tile tile-blue" onclick="window.navigateTo('weekly-activity');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-blue-glow"><i data-lucide="calendar-range"></i></div>
                  <span class="tile-badge badge-blue">Weekly</span>
                </div>
                <div class="tile-title">Weekly Activity</div>
                <div class="tile-desc">Agregasi mingguan</div>
              </div>

              <div class="app-tile tile-sky" onclick="window.navigateTo('activity-progress');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-sky-glow"><i data-lucide="trending-up"></i></div>
                  <span class="tile-badge badge-sky">Progress</span>
                </div>
                <div class="tile-title">Activity Progress</div>
                <div class="tile-desc">Monitoring % target</div>
              </div>

              <div class="app-tile tile-purple" onclick="window.navigateTo('activity-status');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-purple-glow"><i data-lucide="check-circle-2"></i></div>
                  <span class="tile-badge badge-purple">Status</span>
                </div>
                <div class="tile-title">Activity Status</div>
                <div class="tile-desc">Tracking status</div>
              </div>

              <div class="app-tile tile-orange" onclick="window.navigateTo('activity-history');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-orange-glow"><i data-lucide="history"></i></div>
                  <span class="tile-badge badge-orange">History</span>
                </div>
                <div class="tile-title">Activity History</div>
                <div class="tile-desc">Log riwayat revisi</div>
              </div>
            </div>
          </div>

          <!-- Section 3: Project Timeline (Multi-Project) -->
          <div class="menu-group-section">
            <div class="menu-group-title" style="display:flex;justify-content:space-between;align-items:center;">
              <div><i data-lucide="gantt-chart-square" style="color:#2563eb;"></i> Project Timeline</div>
              <div style="font-size:0.65rem;color:var(--brand-blue);font-weight:700;text-transform:uppercase;"><i data-lucide="folder-git-2" style="width:11px;height:11px;vertical-align:-1px;"></i> Project 1</div>
            </div>
            <div class="mobile-app-tiles-grid">
              <div class="app-tile tile-blue" onclick="window.navigateTo('gantt');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-blue-glow"><i data-lucide="gantt-chart-square"></i></div>
                  <span class="tile-badge badge-blue">Gantt</span>
                </div>
                <div class="tile-title">Timeline Overview</div>
                <div class="tile-desc">Grafik Gantt proyek</div>
              </div>

              <div class="app-tile tile-sky" onclick="window.navigateTo('equipment-timeline');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-sky-glow"><i data-lucide="hard-drive"></i></div>
                  <span class="tile-badge badge-sky">Units</span>
                </div>
                <div class="tile-title">Equipment Timeline</div>
                <div class="tile-desc">Timeline per peralatan</div>
              </div>

              <div class="app-tile tile-orange" onclick="window.navigateTo('phase-progress');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-orange-glow"><i data-lucide="workflow"></i></div>
                  <span class="tile-badge badge-orange">CxL Gates</span>
                </div>
                <div class="tile-title">Phase Progress</div>
                <div class="tile-desc">Delivery → CxL5</div>
              </div>

              <div class="app-tile tile-indigo" onclick="window.navigateTo('duration-analysis');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-indigo-glow"><i data-lucide="clock"></i></div>
                  <span class="tile-badge badge-indigo">Analisis</span>
                </div>
                <div class="tile-title">Duration Analysis</div>
                <div class="tile-desc">Analisis durasi &amp; delay</div>
              </div>
            </div>
          </div>

          <!-- Section 4: Document Management (Multi-Project) -->
          <div class="menu-group-section">
            <div class="menu-group-title" style="display:flex;justify-content:space-between;align-items:center;">
              <div><i data-lucide="folder-open" style="color:#8b5cf6;"></i> Document Management</div>
              <div style="font-size:0.65rem;color:var(--brand-blue);font-weight:700;text-transform:uppercase;"><i data-lucide="folder-git-2" style="width:11px;height:11px;vertical-align:-1px;"></i> ${(window.appState?.projects || []).find(p => p.id === window.appState?.selectedProjectId)?.name || 'Project 1'}</div>
            </div>
            <div class="mobile-app-tiles-grid">
              <div class="app-tile tile-purple" onclick="window.navigateTo('documents-report');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-purple-glow"><i data-lucide="file-bar-chart"></i></div>
                  <span class="tile-badge badge-purple">(a) Rep</span>
                </div>
                <div class="tile-title">(a) Report</div>
                <div class="tile-desc">Laporan proyek</div>
              </div>

              <div class="app-tile tile-blue" onclick="window.navigateTo('documents-timesheet');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-blue-glow"><i data-lucide="clock"></i></div>
                  <span class="tile-badge badge-blue">(b) Time</span>
                </div>
                <div class="tile-title">(b) Timesheet</div>
                <div class="tile-desc">Jam kerja teknisi</div>
              </div>

              <div class="app-tile tile-emerald" onclick="window.navigateTo('documents-calibration');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-emerald-glow"><i data-lucide="award"></i></div>
                  <span class="tile-badge badge-emerald">(c) Calib</span>
                </div>
                <div class="tile-title">(c) Calibration</div>
                <div class="tile-desc">Kalibrasi alat ukur</div>
              </div>

              <div class="app-tile tile-orange" onclick="window.navigateTo('import-documents');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-orange-glow"><i data-lucide="file-up"></i></div>
                  <span class="tile-badge badge-orange">(d) Imp</span>
                </div>
                <div class="tile-title">(d) Import Documents</div>
                <div class="tile-desc">Isolasi per project</div>
              </div>

              <div class="app-tile tile-sky" onclick="window.navigateTo('documents');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-sky-glow"><i data-lucide="folder-open"></i></div>
                  <span class="tile-badge badge-sky">Repo</span>
                </div>
                <div class="tile-title">All Documents</div>
                <div class="tile-desc">Repository terpusat</div>
              </div>
            </div>
          </div>

          <!-- Section 5: Master Data & System Access (Multi-Project) -->
          <div class="menu-group-section">
            <div class="menu-group-title" style="display:flex;justify-content:space-between;align-items:center;">
              <div><i data-lucide="database" style="color:#f59e0b;"></i> Master Data (Folder Projects)</div>
              <div style="font-size:0.65rem;color:var(--brand-blue);font-weight:700;text-transform:uppercase;"><i data-lucide="folder-git-2" style="width:11px;height:11px;vertical-align:-1px;"></i> ${(window.appState?.projects || []).find(p => p.id === window.appState?.selectedProjectId)?.name || 'Project 1'}</div>
            </div>
            <div class="mobile-app-tiles-grid">
              <div class="app-tile tile-orange" onclick="window.navigateTo('equipment-list');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-orange-glow"><i data-lucide="cpu"></i></div>
                  <span class="tile-badge badge-orange">(a) Eqp</span>
                </div>
                <div class="tile-title">(a) Equipment List</div>
                <div class="tile-desc">Registri alat per project</div>
              </div>

              <div class="app-tile tile-emerald" onclick="window.navigateTo('room-building');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-emerald-glow"><i data-lucide="building-2"></i></div>
                  <span class="tile-badge badge-emerald">(b) Spasial</span>
                </div>
                <div class="tile-title">(b) Building - Floor - Room</div>
                <div class="tile-desc">Gedung, lantai &amp; ruangan</div>
              </div>

              <div class="app-tile tile-purple" onclick="window.navigateTo('user-management');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-purple-glow"><i data-lucide="users"></i></div>
                  <span class="tile-badge badge-purple">(c) Auth</span>
                </div>
                <div class="tile-title">(c) User Management</div>
                <div class="tile-desc">Otorisasi &amp; Kredensial</div>
              </div>

              <div class="app-tile tile-blue" onclick="window._openAddProjectModal();window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-blue-glow"><i data-lucide="folder-plus"></i></div>
                  <span class="tile-badge badge-blue">+ Project</span>
                </div>
                <div class="tile-title">+ Tambah Project</div>
                <div class="tile-desc">Buat sub-bab project baru</div>
              </div>
            </div>
          </div>

        </div>

        <!-- Glass Footer Bar -->
        <div class="mobile-menu-footer-bar">
          <div class="footer-user-preview" onclick="window._openUserProfileModal();window.closeMobileSidebar();">
            <div class="footer-avatar-circle">A</div>
            <div>
              <div class="footer-user-name">Admin User</div>
              <div class="footer-user-role">Project Manager</div>
            </div>
          </div>
          <div class="footer-actions">
            <button type="button" class="footer-btn" onclick="window.toggleTheme();" title="Ganti Mode Tampilan">
              <i data-lucide="${themeIcon}"></i> <span>${themeText}</span>
            </button>
            <button type="button" class="footer-btn btn-danger-pill" onclick="window.resetDemoData();window.closeMobileSidebar();" title="Reset Demo Data">
              <i data-lucide="rotate-ccw"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}
