/* STACKLY — Authentication Manager */
const AUTH_STORAGE_KEY = 'stackly_user_session';

function getCurrentUser() {
  const data = localStorage.getItem(AUTH_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

function loginUser(email, password, role) {
  // Extract user name from email before @ or default
  const namePart = email.split('@')[0];
  const userName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

  const sessionData = {
    userName: userName,
    email: email,
    role: role,
    loggedIn: true,
    loginTime: new Date().toISOString()
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
  return sessionData;
}

function signupUser(fullName, email, password, role) {
  const sessionData = {
    userName: fullName,
    email: email,
    role: role,
    loggedIn: true,
    loginTime: new Date().toISOString()
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
  return sessionData;
}

function logoutUser() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.location.href = 'Login.html';
}

function requireAuth(expectedRole = null) {
  const user = getCurrentUser();
  if (!user || !user.loggedIn) {
    window.location.href = 'Login.html';
    return false;
  }
  if (expectedRole && user.role !== expectedRole) {
    if (user.role === 'Admin') {
      window.location.href = 'AdminDashboard.html';
    } else {
      window.location.href = 'ClientDashboard.html';
    }
    return false;
  }
  return true;
}

// Update Topbar / Nav with user details
document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  if (user) {
    document.querySelectorAll('.current-user-name').forEach(el => el.textContent = user.userName || user.email);
    document.querySelectorAll('.current-user-email').forEach(el => el.textContent = user.email);
    document.querySelectorAll('.current-user-role').forEach(el => el.textContent = user.role);
    document.querySelectorAll('.current-user-avatar').forEach(el => {
      const char = (user.email || user.userName || 'U').charAt(0).toUpperCase();
      el.textContent = char;
    });
  }
});

// Clear input fields when returning to previous page or page show / reload
function clearAllPageInputs() {
  document.querySelectorAll('form').forEach(form => {
    try { form.reset(); } catch (e) {}
  });
  document.querySelectorAll('input:not([type="submit"]):not([type="button"]):not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), textarea').forEach(input => {
    input.value = '';
    input.setAttribute('autocomplete', 'off');
  });
}

window.addEventListener('pageshow', clearAllPageInputs);
window.addEventListener('pagehide', clearAllPageInputs);
window.addEventListener('beforeunload', clearAllPageInputs);
document.addEventListener('DOMContentLoaded', clearAllPageInputs);
