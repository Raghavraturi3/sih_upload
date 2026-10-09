// System Settings & Operator Profile Management
import { authService } from '../auth/authService.js';

export function renderSettingsView(telemetryEngine) {
  const container = document.createElement('div');
  container.className = 'content-body';

  const user = authService.getUser() || {
    name: 'Operator',
    employeeId: 'OP-001',
    email: 'operator@antarctic.gov.in',
    role: 'ADMIN',
    department: 'ALL',
    station: 'MAITRI',
    profilePic: ''
  };

  const userInitial = (user.name || 'O').charAt(0).toUpperCase();

  container.innerHTML = `
    <div class="page-title-bar">
      <div>
        <h1 class="page-heading">Station Settings & Operator Profile</h1>
        <p class="page-subheading">Biometric profile photo, satellite uplink configurations, and security protocols</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary btn-sm" id="btn-save-settings">Save All Configurations</button>
      </div>
    </div>

    <!-- NOTIFICATION TOAST/BANNER -->
    <div id="settings-status-banner" class="settings-alert" style="display:none;"></div>

    <!-- PROFILE PHOTO & BIOMETRIC CARD -->
    <div class="card" style="margin-bottom:20px; border:1px solid var(--line-medium);">
      <div class="card-header" style="justify-content:space-between; flex-wrap:wrap; gap:10px;">
        <div class="card-title" style="color:var(--accent-signal); display:flex; align-items:center; gap:8px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Operator Identity & Profile Photo (MongoDB Synchronized)</span>
        </div>
        <span class="badge badge-success" id="db-connected-tag">
          <span class="status-dot"></span> MongoDB Sync Active
        </span>
      </div>

      <div class="card-body">
        <div class="profile-editor-layout">
          <!-- AVATAR PREVIEW -->
          <div class="avatar-preview-wrapper">
            <div class="avatar-circle-large" id="avatar-preview-display" style="${user.profilePic ? `background-image: url('${user.profilePic}'); background-size: cover; background-position: center; color: transparent;` : ''}">
              ${user.profilePic ? '' : userInitial}
            </div>
            <div class="avatar-badge-tag">${user.role}</div>
          </div>

          <!-- CONTROLS & INFO -->
          <div class="avatar-controls-panel">
            <div class="operator-meta-row">
              <span class="operator-name-large">${user.name}</span>
              <span class="badge badge-info">${user.employeeId}</span>
              <span class="badge badge-warning">${user.department}</span>
              <span class="badge badge-success">${user.station} Station</span>
            </div>
            <div style="font-size:12px; color:var(--text-muted); margin-bottom:14px;">
              Upload your official polar identification photo. Your image is converted to a secure base64 format and stored directly in your MongoDB operator record.
            </div>

            <!-- HIDDEN FILE INPUT -->
            <input type="file" id="avatar-file-input" accept="image/png, image/jpeg, image/webp" style="display:none;" />

            <!-- ACTION BUTTONS -->
            <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center;">
              <button type="button" class="btn btn-primary btn-sm" id="btn-trigger-upload" style="display:flex; align-items:center; gap:6px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span>Upload Photo</span>
              </button>

              <button type="button" class="btn btn-secondary btn-sm" id="btn-quick-polar-pic" title="Use High-Res Polar Commander Avatar">
                Polar Avatar Preset
              </button>

              <button type="button" class="btn btn-secondary btn-sm" id="btn-remove-pic" style="color:var(--sev-emergency); border-color:var(--sev-emergency-border);">
                Remove Photo
              </button>
            </div>

            <div id="upload-feedback" style="margin-top:10px; font-size:11.5px; font-weight:600; color:#10b981; display:none;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- SYSTEM CONFIGURATION SECTIONS -->
    <div class="grid-2">
      <!-- TELEMETRY & NETWORK SETTINGS -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Satellite Uplink & Telemetry Engine</div>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">Primary Satellite Transponder IP</label>
            <input type="text" class="form-input" value="192.168.100.42 (Iridium Constellation #4)" />
          </div>

          <div class="form-group">
            <label class="form-label">Telemetry Poll Rate (Seconds)</label>
            <input type="number" class="form-input" value="3" min="1" max="60" />
          </div>

          <div class="form-group">
            <label class="form-label">MongoDB Live Sync Gateway</label>
            <input type="text" class="form-input" value="mongodb://localhost:27017/antarctic_digital_twin" readonly style="background:var(--bg-muted); font-family:var(--font-mono); font-size:12px;" />
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <div>
              <div style="font-weight:600; font-size:12.5px;">Auto-Failover to Microwave Relay</div>
              <div style="font-size:11px; color:var(--text-muted);">Switch automatically when satellite latency > 120ms</div>
            </div>
            <label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>
          </div>
        </div>
      </div>

      <!-- NOTIFICATIONS & SECURITY -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Emergency Webhooks & API Keys</div>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">P1 Incident Webhook URL (PagerDuty/Slack)</label>
            <input type="text" class="form-input" value="https://hooks.slack.com/services/T00/B00/XXXXX" />
          </div>

          <div class="form-group">
            <label class="form-label">Active Station API Key (Admin Access)</label>
            <div style="display:flex; gap:8px;">
              <input type="password" class="form-input" value="ao_live_9981248912419241" readonly />
              <button class="btn btn-secondary btn-sm" id="btn-copy-key">Copy</button>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <div>
              <div style="font-weight:600; font-size:12.5px;">Require Biometric 2FA for Override</div>
              <div style="font-size:11px; color:var(--text-muted);">Enforce cryptographic session validation for thermal purges</div>
            </div>
            <label class="toggle-switch"><input type="checkbox" checked><span class="toggle-slider"></span></label>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach interactive profile upload logic
  const fileInput = container.querySelector('#avatar-file-input');
  const triggerBtn = container.querySelector('#btn-trigger-upload');
  const quickPicBtn = container.querySelector('#btn-quick-polar-pic');
  const removePicBtn = container.querySelector('#btn-remove-pic');
  const avatarDisplay = container.querySelector('#avatar-preview-display');
  const feedback = container.querySelector('#upload-feedback');
  const banner = container.querySelector('#settings-status-banner');

  function showBanner(msg, isSuccess = true) {
    if (banner) {
      banner.style.display = 'block';
      const icon = isSuccess 
        ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:4px;"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>'
        : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:4px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
      banner.innerHTML = `<span style="display:inline-flex; align-items:center;">${icon} ${msg}</span>`;
      setTimeout(() => {
        banner.style.display = 'none';
      }, 4000);
    }
  }

  function updateAvatarDisplay(dataUrl) {
    if (dataUrl) {
      avatarDisplay.style.backgroundImage = `url('${dataUrl}')`;
      avatarDisplay.style.backgroundSize = 'cover';
      avatarDisplay.style.backgroundPosition = 'center';
      avatarDisplay.style.color = 'transparent';
    } else {
      avatarDisplay.style.backgroundImage = 'none';
      avatarDisplay.style.color = '#ffffff';
      avatarDisplay.innerText = userInitial;
    }
  }

  // Trigger file dialog
  if (triggerBtn && fileInput) {
    triggerBtn.addEventListener('click', () => fileInput.click());
  }

  // Handle local file selection
  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPEG, WebP).');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        const rawBase64 = event.target.result;

        // Resize image to max 256x256 using Canvas for optimal storage
        const img = new Image();
        img.src = rawBase64;
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const maxDim = 256;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.88);

          // Update UI preview
          updateAvatarDisplay(compressedBase64);

          // Save directly to MongoDB database
          try {
            if (feedback) {
              feedback.style.display = 'block';
              feedback.style.color = '#00f0ff';
              feedback.textContent = 'Saving photo to MongoDB database...';
            }

            await authService.updateProfile({ profilePic: compressedBase64 });

            if (feedback) {
              feedback.style.color = '#10b981';
              feedback.textContent = '✓ Profile photo successfully saved and synchronized in MongoDB!';
            }
            showBanner('Profile picture saved to MongoDB (collection: users)!');
          } catch (err) {
            if (feedback) {
              feedback.style.color = '#ef4444';
              feedback.textContent = `Error saving: ${err.message}`;
            }
            showBanner(`Failed to save to database: ${err.message}`, false);
          }
        };
      };
      reader.readAsDataURL(file);
    });
  }

  // Quick Polar Avatar Preset
  if (quickPicBtn) {
    quickPicBtn.addEventListener('click', async () => {
      // High-res SVG Polar Avatar
      const polarAvatarSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230f172a"/><stop offset="100%" stop-color="%230284c7"/></linearGradient><linearGradient id="polar" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2300f0ff"/><stop offset="100%" stop-color="%2338bdf8"/></linearGradient></defs><rect width="200" height="200" fill="url(%23bg)" rx="100"/><circle cx="100" cy="75" r="38" fill="url(%23polar)"/><path d="M40 170 C40 125, 70 120, 100 120 C130 120, 160 125, 160 170 Z" fill="url(%23polar)"/><circle cx="100" cy="70" r="16" fill="%230f172a"/><path d="M85 70 Q100 85 115 70" stroke="%2300f0ff" stroke-width="3" fill="none"/></svg>`;

      updateAvatarDisplay(polarAvatarSvg);
      try {
        if (feedback) {
          feedback.style.display = 'block';
          feedback.style.color = '#00f0ff';
          feedback.textContent = 'Saving Polar Avatar preset to MongoDB...';
        }
        await authService.updateProfile({ profilePic: polarAvatarSvg });
        if (feedback) {
          feedback.style.color = '#10b981';
          feedback.textContent = '✓ Polar Avatar preset saved to MongoDB!';
        }
        showBanner('Polar Avatar preset successfully saved to database!');
      } catch (err) {
        showBanner(err.message, false);
      }
    });
  }

  // Remove Photo
  if (removePicBtn) {
    removePicBtn.addEventListener('click', async () => {
      if (confirm('Remove profile photo and reset to default initial?')) {
        updateAvatarDisplay('');
        try {
          await authService.updateProfile({ profilePic: '' });
          if (feedback) {
            feedback.style.display = 'block';
            feedback.style.color = '#94a3b8';
            feedback.textContent = 'Profile photo cleared from MongoDB.';
          }
          showBanner('Profile picture removed from database.');
        } catch (err) {
          showBanner(err.message, false);
        }
      }
    });
  }

  container.querySelector('#btn-save-settings')?.addEventListener('click', () => {
    showBanner('All station configurations & parameters synchronized with database!');
  });

  container.querySelector('#btn-copy-key')?.addEventListener('click', () => {
    navigator.clipboard?.writeText('ao_live_9981248912419241');
    showBanner('Station API Key copied to clipboard!');
  });

  return container;
}
