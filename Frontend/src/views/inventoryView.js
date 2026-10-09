// Inventory View Module

export function renderInventoryView(telemetryEngine) {
  const container = document.createElement('div');
  container.className = 'content-body';

  const state = telemetryEngine.getState();

  container.innerHTML = `
    <div class="page-title-bar">
      <div>
        <h1 class="page-heading">Station Inventory & Supply Reserves</h1>
        <p class="page-subheading">Polar survival gear, fuel reserves, emergency rations, and critical engineering spares</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary btn-sm">+ Create Purchase Order</button>
      </div>
    </div>

    <!-- INVENTORY TABLE -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Reserves Stock Level Ledger</div>
        <button class="btn btn-secondary btn-sm">Auto-reorder Thresholds</button>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>SKU ID</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Stock Level</th>
              <th>Capacity Limit</th>
              <th>Reserve Bar</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.inventory.map(item => `
              <tr>
                <td style="font-family: var(--font-mono); font-weight: 600;">${item.id}</td>
                <td style="font-weight: 600;">${item.name}</td>
                <td><span class="badge badge-neutral">${item.category}</span></td>
                <td><strong>${item.qty}</strong></td>
                <td style="color:var(--text-muted);">${item.capacity}</td>
                <td>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div class="progress-bar-bg" style="width: 100px;">
                      <div class="progress-bar-fill ${item.percentage < 40 ? 'danger' : item.percentage < 70 ? 'warning' : 'success'}" style="width: ${item.percentage}%;"></div>
                    </div>
                    <span style="font-size:11px;">${item.percentage}%</span>
                  </div>
                </td>
                <td>
                  <span class="badge ${item.status === 'NORMAL' ? 'badge-success' : 'badge-warning'}">
                    ${item.status}
                  </span>
                </td>
                <td>
                  <button class="btn btn-secondary btn-sm">Request Restock</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  return container;
}
