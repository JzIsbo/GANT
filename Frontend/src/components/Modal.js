/**
 * Interactive Modal & Toast Manager
 * Provides global modal dialogs and toast notifications for all button interactions.
 */

export function showToast(message, type = 'success', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const iconMap = {
    success: 'check-circle',
    info: 'info',
    warning: 'alert-triangle',
    danger: 'x-circle'
  };

  const iconName = iconMap[type] || 'info';

  const safeMsg = window.escapeHtml ? window.escapeHtml(message) : message;
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="toast-icon"></i>
    <span class="toast-message">${safeMsg}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  if (window.lucide) {
    window.lucide.createIcons();
  }

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

export function openModal({ title, bodyHtml, confirmText = 'Save Changes', confirmClass = 'btn-primary', onConfirm }) {
  let overlay = document.getElementById('modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
  }

  const safeTitle = window.escapeHtml ? window.escapeHtml(title) : title;
  const safeConfirm = window.escapeHtml ? window.escapeHtml(confirmText) : confirmText;

  overlay.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="modal-title">${safeTitle}</h3>
        <button class="modal-close-btn" id="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        ${bodyHtml}
      </div>
      <div class="modal-footer">
        <button class="btn" id="modal-cancel-btn">Cancel</button>
        <button class="btn ${confirmClass}" id="modal-confirm-btn">${safeConfirm}</button>
      </div>
    </div>
  `;

  overlay.classList.add('active');

  const close = () => {
    overlay.classList.remove('active');
  };

  document.getElementById('modal-close')?.addEventListener('click', close);
  document.getElementById('modal-cancel-btn')?.addEventListener('click', close);
  
  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.getElementById('modal-confirm-btn')?.addEventListener('click', () => {
    if (onConfirm) {
      const res = onConfirm(overlay);
      if (res !== false) {
        close();
      }
    } else {
      close();
    }
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Global window bindings for inline HTML onclick convenience
window.showToast = showToast;
window.openModal = openModal;
