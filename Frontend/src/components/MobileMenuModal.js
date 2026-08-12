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
                <div class="tile-title">GANT Timeline</div>
                <div class="tile-desc">Delivery → CxL5 gates</div>
              </div>
            </div>
          </div>

          <!-- Section 2: Operasi Lapangan & CxL -->
          <div class="menu-group-section">
            <div class="menu-group-title">
              <i data-lucide="calendar" style="color:#10b981;"></i> Operasi Lapangan &amp; CxL
            </div>
            <div class="mobile-app-tiles-grid">
              <div class="app-tile tile-emerald" onclick="window.navigateTo('daily-activity');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-emerald-glow"><i data-lucide="clock"></i></div>
                  <span class="tile-badge badge-emerald">Daily</span>
                </div>
                <div class="tile-title">Aktivitas Harian</div>
                <div class="tile-desc">Log proyek &amp; target</div>
              </div>

              <div class="app-tile tile-orange" onclick="window.navigateTo('phase-progress');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-orange-glow"><i data-lucide="shield-check"></i></div>
                  <span class="tile-badge badge-orange">Checklists</span>
                </div>
                <div class="tile-title">CxL Phase Gate</div>
                <div class="tile-desc">Persetujuan Digital</div>
              </div>

              <div class="app-tile tile-sky" onclick="window.navigateTo('equipment-timeline');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-sky-glow"><i data-lucide="layers"></i></div>
                  <span class="tile-badge badge-sky">AHUs &amp; Pumps</span>
                </div>
                <div class="tile-title">Equipment Grid</div>
                <div class="tile-desc">Jadwal Sub-unit</div>
              </div>

              <div class="app-tile tile-indigo" onclick="window.navigateTo('duration-analysis');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-indigo-glow"><i data-lucide="timer"></i></div>
                  <span class="tile-badge badge-indigo">Analisis</span>
                </div>
                <div class="tile-title">Durasi &amp; Keterlambatan</div>
                <div class="tile-desc">Variansi fase komisioning</div>
              </div>
            </div>
          </div>

          <!-- Section 3: Dokumen & Storage NAS -->
          <div class="menu-group-section">
            <div class="menu-group-title">
              <i data-lucide="hard-drive" style="color:#8b5cf6;"></i> Manajemen Dokumen &amp; NAS
            </div>
            <div class="mobile-app-tiles-grid">
              <div class="app-tile tile-purple" onclick="window.navigateTo('documents');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-purple-glow"><i data-lucide="file-text"></i></div>
                  <span class="tile-badge badge-purple">Docs</span>
                </div>
                <div class="tile-title">Repositori Dokumen</div>
                <div class="tile-desc">PDF, XLSX &amp; Berkas</div>
              </div>

              <div class="app-tile tile-blue" onclick="window.navigateTo('nas-files');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-blue-glow"><i data-lucide="server"></i></div>
                  <span class="tile-badge badge-blue">RAID 5</span>
                </div>
                <div class="tile-title">NAS Storage Manager</div>
                <div class="tile-desc">16 TB RAID 5 Terhubung</div>
              </div>

              <div class="app-tile tile-emerald" onclick="window.navigateTo('import-documents');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-emerald-glow"><i data-lucide="upload-cloud"></i></div>
                  <span class="tile-badge badge-emerald">Batch</span>
                </div>
                <div class="tile-title">Import Dokumen</div>
                <div class="tile-desc">Batch Upload Paket</div>
              </div>

              <div class="app-tile tile-sky" onclick="window.navigateTo('shared-files');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-sky-glow"><i data-lucide="share-2"></i></div>
                  <span class="tile-badge badge-sky">Share</span>
                </div>
                <div class="tile-title">Tautan Berbagi</div>
                <div class="tile-desc">Akses Klien &amp; Inspektur</div>
              </div>
            </div>
          </div>

          <!-- Section 4: Master Data & Laporan -->
          <div class="menu-group-section">
            <div class="menu-group-title">
              <i data-lucide="database" style="color:#f59e0b;"></i> Master Data &amp; Laporan
            </div>
            <div class="mobile-app-tiles-grid">
              <div class="app-tile tile-orange" onclick="window.navigateTo('equipment-list');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-orange-glow"><i data-lucide="box"></i></div>
                  <span class="tile-badge badge-orange">333 Units</span>
                </div>
                <div class="tile-title">Registri Peralatan</div>
                <div class="tile-desc">Master Equipment</div>
              </div>

              <div class="app-tile tile-emerald" onclick="window.navigateTo('room-building');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-emerald-glow"><i data-lucide="building-2"></i></div>
                  <span class="tile-badge badge-emerald">Spasial</span>
                </div>
                <div class="tile-title">Gedung &amp; Ruangan</div>
                <div class="tile-desc">Hierarki Lokasi</div>
              </div>

              <div class="app-tile tile-blue" onclick="window.navigateTo('weekly-report');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-blue-glow"><i data-lucide="bar-chart-3"></i></div>
                  <span class="tile-badge badge-blue">Laporan</span>
                </div>
                <div class="tile-title">Pusat Laporan</div>
                <div class="tile-desc">Ekspor Mingguan &amp; Bulanan</div>
              </div>

              <div class="app-tile tile-purple" onclick="window.navigateTo('user-management');window.closeMobileSidebar();">
                <div class="tile-header">
                  <div class="tile-icon-glow icon-purple-glow"><i data-lucide="users"></i></div>
                  <span class="tile-badge badge-purple">Akses</span>
                </div>
                <div class="tile-title">Pengguna &amp; Peran</div>
                <div class="tile-desc">Manajemen Izin Akses</div>
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
