// Building Hope San Diego — admin login
//
// Submits to /auth/login as form-encoded data, not JSON — that's the
// shape FastAPI's OAuth2PasswordRequestForm expects. On success, stores
// the JWT and redirects to the dashboard.

const BHSD_AUTH_ENDPOINT = 'http://localhost:8000/auth/login';
const BHSD_TOKEN_KEY = 'bhsd_admin_token';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bhsd-admin-login-form');
  const errorEl = document.getElementById('bhsd-admin-login-error');
  const submitBtn = document.getElementById('bhsd-admin-login-submit');

  if (localStorage.getItem(BHSD_TOKEN_KEY)) {
    window.location.href = '/admin/dashboard/';
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    const username = document.getElementById('a-username').value.trim();
    const password = document.getElementById('a-password').value;

    const body = new URLSearchParams();
    body.append('username', username);
    body.append('password', password);

    try {
      const res = await fetch(BHSD_AUTH_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });

      if (!res.ok) {
        errorEl.textContent = 'Incorrect username or password.';
        return;
      }

      const data = await res.json();
      localStorage.setItem(BHSD_TOKEN_KEY, data.access_token);
      window.location.href = '/admin/dashboard/';
    } catch (err) {
      errorEl.textContent = "Can't reach the backend — make sure it's running.";
      console.error('Login error:', err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Log in';
    }
  });
});