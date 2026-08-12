export function renderProjectsView() {
  return `
    <div class="projects-view" style="padding: 1.5rem;">
      <div class="page-header" style="margin-bottom: 1rem;">
        <h1 class="page-title" style="font-size: 1.4rem; font-weight: 700;">Project Overview</h1>
        <p class="page-subtitle" style="font-size: 0.8rem; color: var(--text-secondary);">Substation & Facility Commissioning Projects</p>
      </div>

      <div class="dashboard-card">
        <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem;">Substation Alpha Commissioning</div>
        <div style="font-size: 0.8rem; color: var(--text-secondary);">Client: EnergyGrid Corp | Phase: CxL3 (In Progress) | Day 132 / 247</div>
      </div>
    </div>
  `;
}
