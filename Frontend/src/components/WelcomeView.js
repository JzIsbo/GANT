import { topMetricCards, projectIdentity } from '../mockData.js';

/**
 * WelcomeView.js - Premium Onboarding & Landing Page for GANT System
 */
export function renderWelcomeView() {
  const m = topMetricCards;
  const p = projectIdentity;
  const isDark = document.body.classList.contains('dark-mode');
  const themeIcon = isDark ? 'sun' : 'moon';
  const themeText = isDark ? 'Light Mode' : 'Dark Mode';
  const themeTitle = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  return `
    <div class="welcome-container" style="animation: fadeIn 0.35s ease-in-out;">
      <!-- Hero Welcome Card -->
      <div class="dashboard-card welcome-hero-card" style="padding: 2.5rem; border-radius: 16px; background: linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(139,92,246,0.05) 50%, var(--bg-card) 100%); border: 1px solid var(--border-card); margin-bottom: 2rem; position: relative; overflow: hidden;">
        <div style="position: absolute; right: -40px; top: -40px; width: 220px; height: 220px; background: radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%); border-radius: 50%; pointer-events: none;"></div>
        
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1.5rem; position: relative; z-index: 1;">
          <div style="max-width: 620px;">
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.3rem 0.75rem; background: rgba(37,99,235,0.1); border: 1px solid rgba(37,99,235,0.2); border-radius: 20px; color: var(--brand-blue); font-size: 0.8rem; font-weight: 600; margin-bottom: 1rem;">
              <i data-lucide="sparkles" style="width: 14px; height: 14px;"></i> ${p.name} Enterprise System
            </div>
            <h1 style="font-size: 2rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem; font-family: var(--font-heading); line-height: 1.2;">
              Welcome back, Admin! 👋
            </h1>
            <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
              Manage commissioning phases, track daily site activities, analyze ${p.name} timelines, and commit NAS document packages for <strong>${p.client}</strong>.
            </p>
            
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
              <button class="btn btn-primary" onclick="window.navigateTo('dashboard')" style="padding: 0.75rem 1.5rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
                <i data-lucide="layout-dashboard" style="width: 18px; height: 18px;"></i> Open Project Dashboard
              </button>
              <button class="btn" style="background: var(--bg-card); border: 1px solid var(--border-card); color: var(--text-main); padding: 0.75rem 1.25rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;" onclick="window.navigateTo('gantt')">
                <i data-lucide="gantt-chart-square" style="width: 18px; height: 18px; color: var(--brand-blue);"></i> View ${p.name} Timeline
              </button>
              <button class="btn" style="background: var(--bg-card); border: 1px solid var(--border-card); color: var(--text-main); padding: 0.75rem 1.25rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;" onclick="window.toggleTheme()" title="${themeTitle}">
                <i data-lucide="${themeIcon}" style="width: 18px; height: 18px; color: ${isDark ? '#f59e0b' : '#2563eb'};"></i> ${themeText}
              </button>
              <button class="btn" style="background: var(--bg-card); border: 1px solid var(--border-card); color: var(--text-main); padding: 0.75rem 1.25rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;" onclick="openModal({
                title: '${p.name} System Interactive Tour',
                bodyHtml: '<div class=\\'info-banner\\'><i data-lucide=\\'info\\'></i> Quick Guide to ${p.name} System Modules:</div><ol style=\\'padding-left:1.2rem;line-height:1.8;font-size:0.9rem;\\'><li><strong>Dashboard</strong>: Real-time progress, completion chart &amp; equipment status.</li><li><strong>Activity Management</strong>: Daily logs, weekly schedules &amp; status updates.</li><li><strong>Project Timeline</strong>: Interactive GANT chart (Delivery to CxL5) &amp; duration analysis.</li><li><strong>Document Management</strong>: NAS File Manager &amp; Batch Document Import.</li><li><strong>Master Data</strong>: Master Equipment, Room/Building hierarchy &amp; User Access.</li></ol>',
                confirmText: 'Got It!',
                onConfirm: () => showToast('Welcome tour complete!', 'success')
              })">
                <i data-lucide="help-circle" style="width: 18px; height: 18px; color: #10b981;"></i> System Tour
              </button>
            </div>
          </div>

          <!-- Project Quick Health Card -->
          <div class="dashboard-card" style="padding: 1.25rem; border-radius: 12px; min-width: 260px; background: var(--bg-card); border: 1px solid var(--border-card); box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
              <span>Project Health</span>
              <span class="status-badge badge-green" style="font-size: 0.65rem;">ON TRACK</span>
            </div>
            
            <div style="margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem;">
                <span style="color: var(--text-secondary);">Overall Progress</span>
                <span style="color: var(--brand-blue);">${m.overallProgress.percentage}%</span>
              </div>
              <div style="width: 100%; height: 8px; background: var(--bg-card-secondary); border-radius: 4px; overflow: hidden; border: 1px solid var(--border-card);">
                <div style="width: ${m.overallProgress.percentage}%; height: 100%; background: linear-gradient(90deg, #2563eb, #10b981);"></div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.8rem;">
              <div style="padding: 0.5rem; background: var(--bg-card-secondary); border-radius: 6px;">
                <div style="color: var(--text-muted); font-size: 0.7rem;">Active Stage</div>
                <div style="font-weight: 700; color: #f97316;">${m.currentPhase.phase} Startup</div>
              </div>
              <div style="padding: 0.5rem; background: var(--bg-card-secondary); border-radius: 6px;">
                <div style="color: var(--text-muted); font-size: 0.7rem;">Equipment</div>
                <div style="font-weight: 700; color: var(--text-main);">${m.equipmentSummary.total} Units</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Module Quick Access Grid -->
      <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 1.25rem; font-family: var(--font-heading); display: flex; align-items: center; gap: 0.5rem;">
        <i data-lucide="grid" style="width: 20px; height: 20px; color: var(--brand-blue);"></i> System Modules &amp; Feature Portals
      </h2>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-bottom: 2.5rem;">
        <!-- Card 1: Dashboard -->
        <div class="dashboard-card welcome-module-card" onclick="window.navigateTo('dashboard')" style="padding: 1.5rem; border-radius: 12px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;">
          <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(37,99,235,0.1); color: var(--brand-blue); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
            <i data-lucide="layout-dashboard" style="width: 22px; height: 22px;"></i>
          </div>
          <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.4rem;">Executive Dashboard</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem;">
            Key KPI progress gauges, commissioning phase distribution &amp; top risk register.
          </p>
          <div style="display: flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 600; color: var(--brand-blue);">
            Launch Dashboard <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
          </div>
        </div>

        <!-- Card 2: Activity Management -->
        <div class="dashboard-card welcome-module-card" onclick="window.navigateTo('daily-activity')" style="padding: 1.5rem; border-radius: 12px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;">
          <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(16,185,129,0.1); color: #10b981; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
            <i data-lucide="clipboard-list" style="width: 22px; height: 22px;"></i>
          </div>
          <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.4rem;">Activity Management</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem;">
            Log daily site works, weekly activity schedules, status updates &amp; audit history.
          </p>
          <div style="display: flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 600; color: #10b981;">
            Open Activity Log <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
          </div>
        </div>

        <!-- Card 3: Project Timeline -->
        <div class="dashboard-card welcome-module-card" onclick="window.navigateTo('gantt')" style="padding: 1.5rem; border-radius: 12px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;">
          <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(249,115,22,0.1); color: #f97316; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
            <i data-lucide="gantt-chart-square" style="width: 22px; height: 22px;"></i>
          </div>
          <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.4rem;">Project Timeline &amp; GANT</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem;">
            Visual GANT schedule, equipment execution timelines &amp; duration delay analysis.
          </p>
          <div style="display: flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 600; color: #f97316;">
            View Timeline <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
          </div>
        </div>

        <!-- Card 4: Document Management -->
        <div class="dashboard-card welcome-module-card" onclick="window.navigateTo('documents')" style="padding: 1.5rem; border-radius: 12px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;">
          <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(139,92,246,0.1); color: #8b5cf6; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
            <i data-lucide="folder-open" style="width: 22px; height: 22px;"></i>
          </div>
          <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.4rem;">Documents &amp; NAS Hub</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem;">
            Central repository, NAS File Manager, shared folders &amp; batch document import.
          </p>
          <div style="display: flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 600; color: #8b5cf6;">
            Access Documents <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
          </div>
        </div>

        <!-- Card 5: Master Data -->
        <div class="dashboard-card welcome-module-card" onclick="window.navigateTo('equipment-list')" style="padding: 1.5rem; border-radius: 12px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;">
          <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(14,165,233,0.1); color: #0ea5e9; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
            <i data-lucide="database" style="width: 22px; height: 22px;"></i>
          </div>
          <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.4rem;">Master Data</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem;">
            Master equipment database, building &amp; room hierarchy, user access management.
          </p>
          <div style="display: flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 600; color: #0ea5e9;">
            Manage Equipment <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
          </div>
        </div>

        <!-- Card 6: Reports -->
        <div class="dashboard-card welcome-module-card" onclick="window.navigateTo('weekly-report')" style="padding: 1.5rem; border-radius: 12px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;">
          <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(236,72,153,0.1); color: #ec4899; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
            <i data-lucide="bar-chart-3" style="width: 22px; height: 22px;"></i>
          </div>
          <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.4rem;">Reports &amp; Analytics</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem;">
            Weekly progress reports, monthly executive summaries &amp; multi-format exports.
          </p>
          <div style="display: flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 600; color: #ec4899;">
            Generate Reports <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
          </div>
        </div>
      <!-- Dedicated About GANT System Card -->
      <div class="dashboard-card" style="padding: 1.75rem; border-radius: 14px; margin-bottom: 2rem; background: var(--bg-card); border: 1px solid var(--border-card);">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(37,99,235,0.1); color: var(--brand-blue); display: flex; align-items: center; justify-content: center;">
            <i data-lucide="info" style="width: 20px; height: 20px;"></i>
          </div>
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin: 0;">Tentang GANT (Global Adimitra Nusaabadi Tracker)</h3>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 2px 0 0;">Fungsi dan Tujuan Sistem Manajemen Komisioning Terintegrasi</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem;">
          <div style="padding: 1.25rem; background: var(--bg-body); border: 1px solid var(--border-card); border-radius: 10px;">
            <div style="display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: var(--brand-blue); font-size: 0.95rem; margin-bottom: 0.5rem;">
              <i data-lucide="target" style="width: 16px; height: 16px;"></i> Fungsi Utama
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">
              Aplikasi web GANT berfungsi sebagai pusat monitoring progres pekerjaan proyek harian/mingguan, grafik GANT timeline komisioning (Delivery → CxL5), sign-off verifikasi digital phase gate, serta repository dokumen komisioning terintegrasi jaringan NAS RAID 5.
            </p>
          </div>

          <div style="padding: 1.25rem; background: var(--bg-body); border: 1px solid var(--border-card); border-radius: 10px;">
            <div style="display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: #10b981; font-size: 0.95rem; margin-bottom: 0.5rem;">
              <i data-lucide="compass" style="width: 16px; height: 16px;"></i> Tujuan Pembuatan
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">
              Sistem ini dibangun khusus untuk <strong>PT. Global Adimitra Nusaabadi</strong> guna menjamin transparansi status peralatan, mengeliminasi risiko keterlambatan komisioning, menegakkan kepatuhan audit standar komisioning, dan mempercepat kolaborasi lintas insinyur.
            </p>
          </div>
        </div>
      </div>

      <!-- Recent Project Updates Timeline Feed -->
      <div class="dashboard-card" style="padding: 1.5rem; border-radius: 12px;">
        <h3 class="card-top-title" style="margin-top: 0; margin-bottom: 1.25rem; font-size: 1.1rem;">
          <i data-lucide="activity" style="width: 18px; height: 18px; color: var(--brand-blue);"></i> Recent Project Activity Feed
        </h3>
        
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-card);">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(16,185,129,0.1); color: #10b981; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <i data-lucide="check-circle-2" style="width: 18px; height: 18px;"></i>
            </div>
            <div style="flex: 1;">
              <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-main);">CxL2 Pre-Commissioning Approved for AHU-001</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Verified by Sarah Jenkins (CxA) • Building A</div>
            </div>
            <span style="font-size: 0.75rem; color: var(--text-muted);">10 mins ago</span>
          </div>

          <div style="display: flex; align-items: center; gap: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-card);">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(37,99,235,0.1); color: var(--brand-blue); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <i data-lucide="file-up" style="width: 18px; height: 18px;"></i>
            </div>
            <div style="flex: 1;">
              <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-main);">Batch Import: 4 Documents Committed to NAS Storage</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">FAT Reports &amp; Wiring Diagrams Package</div>
            </div>
            <span style="font-size: 0.75rem; color: var(--text-muted);">1 hour ago</span>
          </div>

          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(249,115,22,0.1); color: #f97316; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <i data-lucide="clock" style="width: 18px; height: 18px;"></i>
            </div>
            <div style="flex: 1;">
              <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-main);">Schedule Variance Alert: CHP-001 delayed by 4 days</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Log root cause in Duration Analysis module</div>
            </div>
            <span style="font-size: 0.75rem; color: var(--text-muted);">3 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
