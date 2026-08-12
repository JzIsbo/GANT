import { topMetricCards, projectIdentity } from '../mockData.js';

/**
 * LandingWelcomeView.js - Public Welcome / Landing Page before Login
 */
export function renderLandingWelcomeView() {
  const m = topMetricCards;
  const p = projectIdentity;
  const isDark = document.body.classList.contains('dark-mode');
  const themeIcon = isDark ? 'sun' : 'moon';
  const themeText = isDark ? 'Light Mode' : 'Dark Mode';
  const themeTitle = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  return `
    <div class="landing-root">
      <!-- Animated Background Orbs -->
      <div class="login-bg">
        <div class="login-bg-orb orb-1"></div>
        <div class="login-bg-orb orb-2"></div>
        <div class="login-bg-orb orb-3"></div>
        <div class="login-bg-grid"></div>
      </div>

      <!-- Landing Navigation Bar -->
      <header class="landing-header">
        <div class="landing-nav-brand" onclick="window.handleShowLanding()">
          <img src="/logo.png" alt="Logo" class="landing-logo-img" style="width: 34px; height: 34px; object-fit: contain; flex-shrink: 0;" />
          <div style="display:flex;flex-direction:column;justify-content:center;overflow:hidden;">
            <span class="landing-gant-text">${p.name}</span>
            <span style="font-size: 0.65rem; color: rgba(255,255,255,0.6); white-space: nowrap;">Project &amp; Commissioning Tracker</span>
          </div>
        </div>

        <nav class="landing-nav-links">
          <a href="#features" onclick="event.preventDefault();document.getElementById('landing-features').scrollIntoView({behavior:'smooth'});">Features</a>
          <a href="#architecture" onclick="event.preventDefault();document.getElementById('landing-arch').scrollIntoView({behavior:'smooth'});">NAS Infrastructure</a>
          <a href="#about" onclick="event.preventDefault();document.getElementById('landing-about').scrollIntoView({behavior:'smooth'});">About ${p.name}</a>
        </nav>

        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <button type="button" class="landing-theme-toggle-btn" onclick="window.toggleTheme()" title="${themeTitle}">
            <i data-lucide="${themeIcon}"></i>
            <span>${themeText}</span>
          </button>
          <button class="btn-landing-login" onclick="window.handleGoToLogin()">
            <i data-lucide="log-in" style="width: 16px; height: 16px;"></i> Sign In to Workspace
          </button>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="landing-hero">
        <div class="landing-hero-content">
          <div class="landing-badge">
            <i data-lucide="sparkles" style="width: 14px; height: 14px; color: #60a5fa;"></i> Enterprise Commissioning &amp; Project System
          </div>
          <h1 class="landing-title">
            Streamline Equipment Commissioning &amp; Track Project Progress in Real-Time
          </h1>
          <p class="landing-subtitle">
            Built specifically for <strong>${p.client}</strong> to manage Delivery, CxL2, CxL3, CxL4 &amp; CxL5 phase gates with NAS storage integration.
          </p>

          <div class="landing-cta-row">
            <button class="btn-landing-primary" onclick="window.handleGoToLogin()">
              <i data-lucide="shield-check" style="width: 18px; height: 18px;"></i> Sign In to Workspace
            </button>
            <button class="btn-landing-secondary" onclick="document.getElementById('landing-features').scrollIntoView({behavior:'smooth'});">
              <i data-lucide="layout-grid" style="width: 18px; height: 18px;"></i> Explore System Features
            </button>
          </div>

          <!-- Quick Metrics Ribbon -->
          <div class="landing-metrics-ribbon">
            <div class="landing-metric-item">
              <div class="metric-val">${m.overallProgress.percentage}%</div>
              <div class="metric-lbl">Overall Project Progress</div>
            </div>
            <div class="landing-metric-divider"></div>
            <div class="landing-metric-item">
              <div class="metric-val">${m.equipmentSummary.total}</div>
              <div class="metric-lbl">Active Commissioning Units</div>
            </div>
            <div class="landing-metric-divider"></div>
            <div class="landing-metric-item">
              <div class="metric-val">5 Phase Gates</div>
              <div class="metric-lbl">Delivery → CxL5 Verification</div>
            </div>
            <div class="landing-metric-divider"></div>
            <div class="landing-metric-item">
              <div class="metric-val" style="color: #10b981;">RAID 5</div>
              <div class="metric-lbl">NAS Storage Connected</div>
            </div>
          </div>
        </div>
      </section>

      <!-- System Features Grid Section -->
      <section class="landing-section" id="landing-features">
        <div class="landing-section-header">
          <h2 class="landing-section-title">Core System Capabilities</h2>
          <p class="landing-section-sub">Integrated tools for engineering teams, project managers &amp; commissioning authorities.</p>
        </div>

        <div class="landing-cards-grid">
          <!-- Card 1 -->
          <div class="landing-card" onclick="window.handleGoToLogin()">
            <div class="landing-card-icon-wrap icon-blue">
              <i data-lucide="gantt-chart-square"></i>
            </div>
            <h3>Interactive GANT Timelines</h3>
            <p>Multi-phase timeline charts tracking AHUs, Chillers &amp; Pumps from Factory Delivery through CxL5 Integrated Testing with delay impact analysis.</p>
          </div>

          <!-- Card 2 -->
          <div class="landing-card" onclick="window.handleGoToLogin()">
            <div class="landing-card-icon-wrap icon-green">
              <i data-lucide="clipboard-check"></i>
            </div>
            <h3>Daily &amp; Weekly Activity Logs</h3>
            <p>Record site inspections, equipment test procedures, weekly progress targets &amp; maintain complete audit trail logs.</p>
          </div>

          <!-- Card 3 -->
          <div class="landing-card" onclick="window.handleGoToLogin()">
            <div class="landing-card-icon-wrap icon-purple">
              <i data-lucide="file-up"></i>
            </div>
            <h3>NAS Hub &amp; Batch Document Import</h3>
            <p>Drag &amp; drop batch PDF/XLSX/DWG files with auto-equipment mapping, pre-validation checks &amp; direct commit to RAID 5 NAS storage.</p>
          </div>

          <!-- Card 4 -->
          <div class="landing-card" onclick="window.handleGoToLogin()">
            <div class="landing-card-icon-wrap icon-orange">
              <i data-lucide="check-circle-2"></i>
            </div>
            <h3>Digital Phase Gate Sign-off</h3>
            <p>Commissioning Authority (CxA) digital approvals, verification checklists &amp; milestone lockouts for quality compliance.</p>
          </div>

          <!-- Card 5 -->
          <div class="landing-card" onclick="window.handleGoToLogin()">
            <div class="landing-card-icon-wrap icon-sky">
              <i data-lucide="bar-chart-3"></i>
            </div>
            <h3>Executive Analytics &amp; Reports</h3>
            <p>Generate automated weekly status reports, monthly executive dashboards, and export data in PDF, Excel (.xlsx), or MS Project (.mpp).</p>
          </div>

          <!-- Card 6 -->
          <div class="landing-card" onclick="window.handleGoToLogin()">
            <div class="landing-card-icon-wrap icon-emerald">
              <i data-lucide="database"></i>
            </div>
            <h3>Master Data &amp; Access Control</h3>
            <p>Manage equipment registries, building-room spatial hierarchies, and role-based permissions for administrators &amp; field engineers.</p>
          </div>
        </div>
      </section>

      <!-- Infrastructure Banner -->
      <section class="landing-section" id="landing-arch" style="padding-top: 1rem;">
        <div class="landing-nas-banner">
          <div class="nas-banner-left">
            <div class="nas-status-pill">
              <span class="nas-raid-dot"></span> NAS CONNECTED • RAID 5 Healthy
            </div>
            <h2>Enterprise NAS &amp; Cloud Hybrid Storage</h2>
            <p>Local 16 TB RAID 5 storage repository (192.168.1.100) integrated with high-speed document indexing and role-restricted security.</p>
          </div>
          <button class="btn-landing-primary" onclick="window.handleGoToLogin()" style="flex-shrink: 0;">
            <i data-lucide="lock" style="width: 16px; height: 16px;"></i> Sign In to Access NAS
          </button>
        </div>
      </section>

      <!-- Dedicated About GANT Section -->
      <section class="landing-section" id="landing-about" style="padding-top: 2rem; padding-bottom: 3rem;">
        <div class="landing-section-header">
          <div class="landing-badge">
            <i data-lucide="info" style="width: 14px; height: 14px; color: #2563eb;"></i> Tentang Aplikasi GANT
          </div>
          <h2 class="landing-section-title">GANT — Global Adimitra Nusaabadi Tracker</h2>
          <p class="landing-section-sub">
            Sistem Informasi Terintegrasi untuk Monitoring Progres Proyek, Aktivitas Harian, &amp; Manajemen Komisioning Peralatan Industri.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.5rem; max-width: 1200px; margin: 0 auto;">
          <!-- Card 1: Fungsi Utama (Core Functionality) -->
          <div class="landing-card" style="padding: 2rem; border-radius: 16px; text-align: left;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: rgba(37,99,235,0.12); border-radius: 12px; color: #2563eb; margin-bottom: 1.25rem;">
              <i data-lucide="target" style="width: 24px; height: 24px;"></i>
            </div>
            <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.75rem;">Fungsi Utama Aplikasi</h3>
            <p style="font-size: 0.88rem; line-height: 1.6; margin-bottom: 1rem;">
              GANT berfungsi sebagai pusat kendali (*control tower*) proyek yang mengintegrasikan seluruh tahapan komisioning peralatan industri.
            </p>
            <ul style="padding-left: 1.2rem; line-height: 1.8; font-size: 0.85rem; margin: 0;">
              <li><strong>Monitoring Aktivitas Harian &amp; Mingguan</strong>: Pelacakan progres pekerjaan proyek di lapangan secara real-time.</li>
              <li><strong>Visual GANT Timeline</strong>: Grafik GANT Chart interaktif dari tahap Delivery hingga CxL5 Integrated System.</li>
              <li><strong>Verifikasi Digital CxL Phase Gate</strong>: Sign-off persetujuan komisioning peralatan berbasis checklist terenkripsi.</li>
              <li><strong>Hub Dokumen NAS RAID 5 Repository</strong>: Manajemen dokumen komisioning terintegrasi dengan jaringan NAS lokal.</li>
            </ul>
          </div>

          <!-- Card 2: Tujuan Pembuatan (Core Objectives) -->
          <div class="landing-card" style="padding: 2rem; border-radius: 16px; text-align: left;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: rgba(16,185,129,0.12); border-radius: 12px; color: #10b981; margin-bottom: 1.25rem;">
              <i data-lucide="compass" style="width: 24px; height: 24px;"></i>
            </div>
            <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.75rem;">Tujuan Pembuatan GANT</h3>
            <p style="font-size: 0.88rem; line-height: 1.6; margin-bottom: 1rem;">
              Dikembangkan khusus untuk <strong>PT. Global Adimitra Nusaabadi</strong> dalam menjamin keberhasilan proyek secara tepat waktu dan memenuhi standar kualitas.
            </p>
            <ul style="padding-left: 1.2rem; line-height: 1.8; font-size: 0.85rem; margin: 0;">
              <li><strong>Transparansi Progres Proyek</strong>: Memberikan akurasi status komisioning kepada seluruh pemangku kepentingan (*stakeholders*).</li>
              <li><strong>Standardisasi Komisioning</strong>: Menjamin setiap peralatan lulus pengujian CxL1 hingga CxL5 tanpa potensi keterlambatan.</li>
              <li><strong>Digitalisasi &amp; Kepatuhan Audit</strong>: Menyediakan jejak audit (*audit trail*) otomatis untuk setiap keputusan dan persetujuan.</li>
              <li><strong>Efisiensi Kolaborasi Tim</strong>: Mempercepat alur kerja antara tim insinyur lapangan, Commissioning Authority (CxA), dan manajemen.</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Landing Footer -->
      <footer class="landing-footer">
        <div class="landing-footer-inner">
          <div class="landing-footer-left">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
              <img src="/logo.png" alt="GAN Logo" style="width: 28px; height: 28px; object-fit: contain;" />
              <span style="font-weight: 700; color: #fff; font-size: 1rem;">PT. Global Adimitra Nusaabadi</span>
            </div>
            <p style="font-size: 0.8rem; color: rgba(255,255,255,0.4); max-width: 400px; line-height: 1.5;">
              GANT (Global Adimitra Nusaabadi Tracker) — Integrated Project Activity, Timeline &amp; Commissioning Management System.
            </p>
          </div>
          <div style="text-align: right;">
            <button class="btn-landing-login" onclick="window.handleGoToLogin()">
              Sign In to Workspace
            </button>
            <div style="font-size: 0.75rem; color: rgba(255,255,255,0.3); margin-top: 0.5rem;">
              © 2026 GAN. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  `;
}
