/**
 * LoginView - Full-screen authentication page for GANT system
 */
export function renderLoginView() {
  const isDark = document.body.classList.contains('dark-mode');
  const themeIcon = isDark ? 'sun' : 'moon';
  const themeText = isDark ? 'Light Mode' : 'Dark Mode';
  const themeTitle = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  return `
    <div class="login-root" id="login-root">
      <!-- Animated background -->
      <div class="login-bg">
        <div class="login-bg-orb orb-1"></div>
        <div class="login-bg-orb orb-2"></div>
        <div class="login-bg-orb orb-3"></div>
        <div class="login-bg-grid"></div>
      </div>

      <!-- Left Panel: Branding -->
      <div class="login-left">
        <div class="login-brand-block">
          <div class="login-brand-logo-row" style="display:flex;align-items:center;gap:0.75rem;">
            <img src="/logo.png" alt="Logo" class="login-brand-icon" style="width: 44px; height: 44px; object-fit: contain; flex-shrink: 0;" />
            <div style="display:flex;flex-direction:column;justify-content:center;overflow:hidden;">
              <span class="login-gant-text">GANT</span>
              <span class="login-brand-sub" style="font-size: 0.72rem; white-space: nowrap;">Project &amp; Commissioning Tracker</span>
            </div>
          </div>
          <div class="login-brand-tagline">Project Progress, Activity<br>&amp; Commissioning Tracker</div>

          <div class="login-feature-list">
            <div class="login-feature-item">
              <div class="login-feature-icon"><i data-lucide="gantt-chart-square"></i></div>
              <div>
                <div class="login-feature-title">Visual GANT Timeline</div>
                <div class="login-feature-sub">Track all phases from Delivery → CxL5 in real-time</div>
              </div>
            </div>
            <div class="login-feature-item">
              <div class="login-feature-icon"><i data-lucide="check-circle-2"></i></div>
              <div>
                <div class="login-feature-title">Phase Gate Approvals</div>
                <div class="login-feature-sub">Digital sign-off workflow for commissioning phases</div>
              </div>
            </div>
            <div class="login-feature-item">
              <div class="login-feature-icon"><i data-lucide="file-up"></i></div>
              <div>
                <div class="login-feature-title">NAS Document Hub</div>
                <div class="login-feature-sub">Batch import, manage &amp; share commissioning documents</div>
              </div>
            </div>
            <div class="login-feature-item">
              <div class="login-feature-icon"><i data-lucide="bar-chart-3"></i></div>
              <div>
                <div class="login-feature-title">Executive Reports</div>
                <div class="login-feature-sub">Weekly, monthly &amp; variance analytics at a glance</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer info -->
        <div class="login-left-footer">
          <img src="/logo.png" alt="GAN" class="login-footer-icon" />
          <div>
            <div class="login-footer-company">PT. Global Adimitra Nusaabadi</div>
            <div class="login-footer-copy">© 2026 GAN. All rights reserved.</div>
          </div>
        </div>
      </div>

      <!-- Right Panel: Login Form -->
      <div class="login-right">
        <div class="login-card">
          <!-- Header -->
          <div class="login-card-header">
            <div style="display:flex;justify-content:flex-end;margin-bottom:0.75rem;">
              <button type="button" class="login-theme-pill-btn" id="login-theme-pill-btn" onclick="window.toggleTheme()" title="${themeTitle}">
                <i data-lucide="${themeIcon}"></i>
                <span>${themeText}</span>
              </button>
            </div>
            <div class="login-card-icon">
              <i data-lucide="lock-keyhole"></i>
            </div>
            <h1 class="login-card-title">Sign In</h1>
            <p class="login-card-subtitle">Access your GANT workspace</p>
          </div>

          <!-- Form -->
          <form class="login-form" id="login-form" onsubmit="handleLoginSubmit(event)">
            <div class="login-field" id="field-username">
              <label class="login-label">Username / Email</label>
              <div class="login-input-wrap">
                <i data-lucide="user" class="login-input-icon"></i>
                <input
                  type="text"
                  id="login-username"
                  class="login-input"
                  placeholder="e.g. admin@gan.co.id"
                  autocomplete="username"
                  required
                />
              </div>
              <span class="login-field-error" id="err-username"></span>
            </div>

            <div class="login-field" id="field-password">
              <label class="login-label">Password</label>
              <div class="login-input-wrap">
                <i data-lucide="lock" class="login-input-icon"></i>
                <input
                  type="password"
                  id="login-password"
                  class="login-input"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  required
                />
                <button type="button" class="login-eye-btn" onclick="togglePasswordVisibility()" id="eye-btn" title="Show/Hide Password">
                  <i data-lucide="eye" id="eye-icon"></i>
                </button>
              </div>
              <span class="login-field-error" id="err-password"></span>
            </div>

            <div class="login-row-between">
              <label class="login-remember">
                <input type="checkbox" id="remember-me" />
                <span>Remember me</span>
              </label>
              <button type="button" class="login-forgot" onclick="handleForgotPassword()">Forgot password?</button>
            </div>

            <button type="submit" class="login-submit-btn" id="login-submit-btn">
              <span id="login-btn-text">Sign In</span>
              <span id="login-btn-spinner" class="login-spinner" style="display:none;"></span>
            </button>

            <!-- Demo Credentials -->
            <div class="login-demo-box">
              <div class="login-demo-title"><i data-lucide="info" style="width:14px;height:14px;"></i> Demo Credentials</div>
              <div class="login-demo-grid">
                <div class="login-demo-item" onclick="fillDemo('admin','Admin1234')">
                  <div class="login-demo-role">Project Manager</div>
                  <div class="login-demo-creds">admin / Admin1234</div>
                </div>
                <div class="login-demo-item" onclick="fillDemo('engineer','Eng2026!')">
                  <div class="login-demo-role">Site Engineer</div>
                  <div class="login-demo-creds">engineer / Eng2026!</div>
                </div>
              </div>
            </div>

            <div class="login-divider"><span>Secure Access</span></div>
            <div class="login-security-badges">
              <span class="login-badge"><i data-lucide="shield-check" style="width:12px;height:12px;"></i> TLS 1.3</span>
              <span class="login-badge"><i data-lucide="key-round" style="width:12px;height:12px;"></i> Role-Based Access</span>
              <span class="login-badge"><i data-lucide="server" style="width:12px;height:12px;"></i> NAS Integrated</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}
