// Polar Twin login experience with real authentication flow preserved.

export function renderLoginView(authService, onLoginSuccess) {
  const container = document.createElement('div');
  container.className = 'polar-login-viewport';

  container.innerHTML = `
    <video
      class="polar-login-video"
      src="/login-showcase.mp4"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
      aria-hidden="true"
    ></video>

    <div class="polar-login-overlay" aria-hidden="true"></div>

    <div class="polar-login-shell" aria-label="Polar Twin authentication">
      <section class="polar-brand-panel" aria-label="Mission introduction">
        <div class="polar-brand-header">
          <div class="polar-status-badge">
            <span class="polar-status-dot" aria-hidden="true"></span>
            <span>POLAR OPERATIONS PLATFORM</span>
          </div>
        </div>

        <div class="polar-brand-content">
          <div class="polar-brand-mark" aria-label="Polar Twin">POLAR TWIN</div>
          <h1>Antarctic Research Station Intelligence Platform</h1>
          <p class="polar-brand-subtitle">National Centre for Polar and Ocean Research (NCPOR)</p>
          <p class="polar-brand-ministry">Ministry of Earth Sciences, Government of India</p>
          <p class="polar-mission-copy">
            Unified visibility into station infrastructure, energy systems, logistics, and environmental conditions across Antarctica.
          </p>
        </div>
      </section>

      <section class="polar-auth-card" aria-label="Sign in form">
        <header class="polar-auth-header">
          <div class="polar-auth-title-wrap">
            <p class="polar-auth-kicker">Secure access</p>
            <h2>Welcome back</h2>
          </div>
          ${import.meta.env.DEV ? `
            <button type="button" id="polar-dev-skip-login-inline" class="polar-dev-skip-login polar-dev-skip-login-inline" aria-label="Explore the demo">
  <span>Explore Demo</span>
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M5 12h12" />
    <path d="m13 5 7 7-7 7" />
  </svg>
</button>
          ` : ''}
          <p>Sign in to access your Polar Twin workspace.</p>
        </header>

        <div id="polar-alert" class="polar-alert" role="alert" aria-live="assertive" hidden></div>

        <form id="polar-login-form" novalidate autocomplete="on">
          <div class="polar-field-group">
            <label class="polar-label" for="polar-login-identifier">Email address</label>
            <input
              id="polar-login-identifier"
              class="polar-input"
              name="identifier"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              spellcheck="false"
              aria-describedby="polar-login-identifier-help"
              required
            />
          </div>

          <div class="polar-field-group">
            <div class="polar-label-row">
              <label class="polar-label" for="polar-login-password">Password</label>
              <button type="button" id="polar-forgot-password" class="polar-text-link">Forgot password?</button>
            </div>
            <div class="polar-input-wrap">
              <input
                id="polar-login-password"
                class="polar-input"
                name="password"
                type="password"
                placeholder="Enter your password"
                autocomplete="current-password"
                required
              />
              <button
                type="button"
                id="polar-toggle-password"
                class="polar-toggle-password"
                aria-label="Show password"
                aria-pressed="false"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" id="polar-submit-btn" class="polar-submit-btn" aria-live="polite">
            <span class="polar-btn-label">Sign in</span>
            <span class="polar-btn-spinner" aria-hidden="true"></span>
          </button>
        </form>

        <div class="polar-auth-footer">
          <span>Need access?</span>
          <button type="button" id="polar-signup-link" class="polar-signup-link">Request access</button>
        </div>
      </section>
    </div>
  `;

  const form = container.querySelector('#polar-login-form');
  const alertBox = container.querySelector('#polar-alert');
  const submitBtn = container.querySelector('#polar-submit-btn');
  const btnLabel = submitBtn.querySelector('.polar-btn-label');
  const spinner = submitBtn.querySelector('.polar-btn-spinner');
  const identifierInput = container.querySelector('#polar-login-identifier');
  const passwordInput = container.querySelector('#polar-login-password');
  const togglePasswordBtn = container.querySelector('#polar-toggle-password');
  const forgotPasswordBtn = container.querySelector('#polar-forgot-password');
  const signupLink = container.querySelector('#polar-signup-link');
  const skipLoginInlineBtn = container.querySelector('#polar-dev-skip-login-inline');

  function setAlert(message, type = 'error') {
    alertBox.hidden = false;
    alertBox.textContent = message;
    alertBox.className = `polar-alert polar-alert-${type}`;

    if (type === 'success' || type === 'info') {
      window.clearTimeout(setAlert.timeoutId);
      setAlert.timeoutId = window.setTimeout(() => {
        alertBox.hidden = true;
        alertBox.textContent = '';
      }, 5000);
    }
  }

  function setSubmitting(isSubmitting) {
    submitBtn.disabled = isSubmitting;
    submitBtn.setAttribute('aria-busy', String(isSubmitting));
    btnLabel.textContent = isSubmitting ? 'Signing in...' : 'Sign in';
    spinner.style.display = isSubmitting ? 'inline-block' : 'none';
  }

  togglePasswordBtn.addEventListener('click', () => {
    const showPassword = passwordInput.type === 'password';
    passwordInput.type = showPassword ? 'text' : 'password';
    togglePasswordBtn.setAttribute('aria-label', showPassword ? 'Hide password' : 'Show password');
    togglePasswordBtn.setAttribute('aria-pressed', String(showPassword));
    togglePasswordBtn.innerHTML = showPassword ? `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </svg>
    ` : `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    `;
  });

  forgotPasswordBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    const email = identifierInput.value.trim();

    if (!email) {
      setAlert('Enter your email address to request a password reset.', 'info');
      identifierInput.focus();
      return;
    }

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      setAlert(data.message || 'Password reset instructions have been requested.', 'success');
    } catch (error) {
      setAlert('Password reset request could not be sent. Please contact your administrator.', 'error');
    }
  });

  signupLink.addEventListener('click', () => {
    setAlert('Registration is currently by invitation. Please contact your station administrator.', 'info');
  });

  const handleDevSkip = () => {
    if (authService.applyDevDemoSession()) {
      if (onLoginSuccess) {
        onLoginSuccess(authService.getUser());
      }
    }
  };

  if (skipLoginInlineBtn) {
    skipLoginInlineBtn.addEventListener('click', handleDevSkip);
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    alertBox.hidden = true;

    const identifier = identifierInput.value.trim();
    const password = passwordInput.value;

    if (!identifier) {
      setAlert('Please enter your email address or employee ID.', 'error');
      identifierInput.focus();
      return;
    }

    if (!password) {
      setAlert('Please enter your password.', 'error');
      passwordInput.focus();
      return;
    }

    setSubmitting(true);

    try {
      const user = await authService.login(identifier, password);
      setAlert(`Welcome back, ${user.name || 'operator'}.`, 'success');

      window.setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      }, 250);
    } catch (error) {
      setAlert(error.message || 'Authentication failed. Please verify your credentials.', 'error');
      setSubmitting(false);
    }
  });

  return container;
}
