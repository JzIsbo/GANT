/**
 * Header Component
 */
window._openUserProfileModal = function() {
  const user = JSON.parse(sessionStorage.getItem('gantt_user') || '{"name":"Admin User","role":"Project Manager","email":"admin@gan.co.id"}');
  const nameParts = (user.name || 'Admin User').trim().split(' ');
  const initials = nameParts.length > 1 
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : (nameParts[0][0] || 'A').toUpperCase();

  const modalAvatarDisplay = user.avatarUrl
    ? `<img src="${user.avatarUrl}" alt="${window.escapeHtml(user.name)}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;" />`
    : `<div class="user-avatar-img" style="width:48px;height:48px;font-size:1.2rem;">${initials}</div>`;

  openModal({
    title: 'User Profile & Session',
    bodyHtml: `
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
        ${modalAvatarDisplay}
        <div>
          <div style="font-weight:700;font-size:1rem;color:var(--text-main);">${window.escapeHtml(user.name || 'Admin User')}</div>
          <div style="color:var(--text-muted);font-size:0.8rem;">${window.escapeHtml(user.role || 'Project Manager')}</div>
        </div>
      </div>
      <div class="form-row" style="margin-bottom:0.5rem;"><label style="font-weight:600;color:var(--text-secondary);width:80px;display:inline-block;">Email:</label> <span style="color:var(--text-main);">${window.escapeHtml(user.email || 'admin@gan.co.id')}</span></div>
      <div class="form-row"><label style="font-weight:600;color:var(--text-secondary);width:80px;display:inline-block;">Role:</label> <span class="status-badge badge-blue">${window.escapeHtml(user.role || 'Project Manager')}</span></div>
    `,
    confirmText: 'Edit Profile in Account Settings',
    onConfirm: () => window.navigateTo('account-settings')
  });
};

export function renderHeader(pageTitle = 'Dashboard') {
  const isDark = document.body.classList.contains('dark-mode');
  const themeIcon = isDark ? 'sun' : 'moon';
  const themeTooltip = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  const user = JSON.parse(sessionStorage.getItem('gantt_user') || '{"name":"Admin User","role":"Project Manager","email":"admin@gan.co.id"}');
  const nameParts = (user.name || 'Admin User').trim().split(' ');
  const initials = nameParts.length > 1 
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : (nameParts[0][0] || 'A').toUpperCase();

  const avatarDisplay = user.avatarUrl
    ? `<img src="${user.avatarUrl}" alt="${window.escapeHtml(user.name)}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:1px solid var(--border-card);" />`
    : `<div class="user-avatar-img">${initials}</div>`;

  return `
    <header class="app-header">
      <div class="header-title-area">
        <div class="header-title">${pageTitle}</div>
        <div class="header-date-sub">Reporting Week: 03–08 Aug 2026</div>
      </div>

      <div class="header-right">
        <div class="header-search">
          <i data-lucide="search" class="search-icon"></i>
          <input type="text" id="global-search-input" placeholder="Search equipment, activities, docs..." oninput="handleGlobalSearch(this.value)" autocomplete="off" />
          <div id="search-results-dropdown" class="search-results-dropdown"></div>
        </div>

        <!-- Theme Toggle -->
        <button class="icon-btn" id="theme-toggle" title="${themeTooltip}">
          <i data-lucide="${themeIcon}"></i>
        </button>

        <div class="header-notifications" title="View Recent Notifications" onclick="window._showNotificationModal()" style="cursor:pointer;">
          <i data-lucide="bell" style="width: 18px; height: 18px; color: var(--text-secondary);"></i>
          <span class="notification-badge">${(() => { const log = (window.appState && window.appState.auditLog) || []; return Math.min(log.length, 9); })()}</span>
        </div>

        <div class="header-user" style="cursor: pointer;" onclick="window._openUserProfileModal()">
          ${avatarDisplay}
          <div class="user-text-info">
            <span class="user-name-text">${window.escapeHtml(user.name || 'Admin')}</span>
            <span class="user-role-text">${window.escapeHtml(user.role || 'Project Manager')}</span>
          </div>
        </div>

        <!-- Logout Button -->
        <button class="icon-btn header-logout-btn" id="logout-btn" title="Sign Out" onclick="handleLogout()">
          <i data-lucide="log-out"></i>
        </button>
      </div>
    </header>
  `;
}
