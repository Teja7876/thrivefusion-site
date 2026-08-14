/**
 * ThriveFusion Alliance Foundation — Production Auth Handler
 * Handles Login, Signup, Logout, Profile updates, session checks, and redirects.
 * WCAG 2.2 AA compliant with ARIA live region status announcements.
 */
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    initLogin();
    initRegister();
    initProfile();
    initNavigationAuth();
  });

  // 1. Fetch current session status
  async function getCurrentUser() {
    try {
      const res = await fetch('/api/auth/me.php', { credentials: 'include' });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  }

  // 2. Login Form Handler
  async function initLogin() {
    const emailInput = document.getElementById('login-email') || document.querySelector('input[type="email"]');
    const passInput = document.getElementById('login-password') || document.querySelector('input[type="password"]');
    const form = document.querySelector('form[aria-label="Login form"]') || (emailInput && emailInput.closest('form'));

    if (!form || !emailInput || !passInput) return;

    // Redirect if already authenticated
    const user = await getCurrentUser();
    if (user) {
      window.location.href = user.role === 'admin' ? '/admin' : '/profile';
      return;
    }

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const email = emailInput.value.trim();
      const password = passInput.value;
      const submitBtn = form.querySelector('button[type="submit"]');

      if (!email || !password) {
        showError(form, 'Please enter both email address and password.');
        return;
      }

      setLoading(submitBtn, true, 'Logging in...');
      clearError(form);

      try {
        const res = await fetch('/api/auth/login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Invalid email or password.');
        }

        const role = data.user ? data.user.role : 'user';
        window.location.href = role === 'admin' ? '/admin' : '/profile';
      } catch (err) {
        showError(form, err.message);
      } finally {
        setLoading(submitBtn, false, 'Log In');
      }
    });
  }

  // 3. Register Form Handler
  async function initRegister() {
    const nameInput = document.getElementById('register-name') || document.querySelector('input[name="name"]');
    const emailInput = document.getElementById('register-email') || document.querySelector('input[type="email"]');
    const passInput = document.getElementById('register-password') || document.querySelector('input[type="password"]');
    const form = document.querySelector('form[aria-label="Register form"]') || (emailInput && emailInput.closest('form'));

    if (!form || !emailInput || !passInput) return;

    const user = await getCurrentUser();
    if (user) {
      window.location.href = '/profile';
      return;
    }

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const name = nameInput ? nameInput.value.trim() : emailInput.value.split('@')[0];
      const email = emailInput.value.trim();
      const password = passInput.value;
      const submitBtn = form.querySelector('button[type="submit"]');

      if (!email || !password) {
        showError(form, 'Please provide email and password.');
        return;
      }
      if (password.length < 6) {
        showError(form, 'Password must be at least 6 characters long.');
        return;
      }

      setLoading(submitBtn, true, 'Creating Account...');
      clearError(form);

      try {
        const res = await fetch('/api/auth/register.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Registration failed. Please try again.');
        }

        window.location.href = '/profile';
      } catch (err) {
        showError(form, err.message);
      } finally {
        setLoading(submitBtn, false, 'Create Account');
      }
    });
  }

  // 4. Profile View & Protected Page Protection
  async function initProfile() {
    const isProfilePage = window.location.pathname.endsWith('/profile') || window.location.pathname.endsWith('/profile.html');
    const isAdminPage = window.location.pathname.startsWith('/admin');

    if (!isProfilePage && !isAdminPage) return;

    const user = await getCurrentUser();
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (isAdminPage && user.role !== 'admin') {
      window.location.href = '/profile';
      return;
    }

    // Bind Profile elements
    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    const roleEl = document.getElementById('profile-role');
    const logoutBtn = document.getElementById('logout-btn') || document.querySelector('.logout-btn');

    if (nameEl) nameEl.textContent = user.displayName || 'User';
    if (emailEl) emailEl.textContent = user.email || '';
    if (roleEl) roleEl.textContent = user.role || 'User';

    if (logoutBtn) {
      logoutBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        try {
          await fetch('/api/auth/logout.php', { method: 'POST', credentials: 'include' });
        } catch (err) {
          console.error('Logout error:', err);
        } finally {
          window.location.href = '/login';
        }
      });
    }
  }

  // 5. Header Navigation Auth State Update
  async function initNavigationAuth() {
    const user = await getCurrentUser();
    const navs = document.querySelectorAll('header nav');

    navs.forEach(nav => {
      let authLink = nav.querySelector('a[href="/login"], a[href="/profile"]');
      if (user) {
        if (!authLink) {
          authLink = document.createElement('a');
          authLink.className = 'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent text-foreground/70';
          nav.appendChild(authLink);
        }
        authLink.href = '/profile';
        authLink.textContent = user.displayName ? `Account (${user.displayName.split(' ')[0]})` : 'Account';
      }
    });
  }

  function showError(form, msg) {
    let alert = form.querySelector('.auth-alert');
    if (!alert) {
      alert = document.createElement('div');
      alert.className = 'auth-alert my-3 p-3 rounded-2xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20';
      alert.setAttribute('role', 'alert');
      form.prepend(alert);
    }
    alert.textContent = msg;
  }

  function clearError(form) {
    const alert = form.querySelector('.auth-alert');
    if (alert) alert.remove();
  }

  function setLoading(btn, loading, text) {
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = text;
  }
})();
