/* STACKLY — Shared Dashboard Helpers */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardMobileMenu();
  initDashboardNavigation();
  updateDashboardUserDisplay();
});

function initDashboardMobileMenu() {
  const toggleBtn = document.querySelector('.dashboard-mobile-toggle');
  const sidebar = document.querySelector('.dashboard-sidebar');
  const closeBtn = document.querySelector('.sidebar-close-btn');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');

  function openSidebar() {
    if (sidebar) {
      sidebar.classList.add('active');
      document.body.classList.add('no-scroll');
    }
  }

  function closeSidebar() {
    if (sidebar) {
      sidebar.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  }

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (sidebar.classList.contains('active')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSidebar);
  }

  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        closeSidebar();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
      closeSidebar();
    }
  });
}

function initDashboardNavigation() {
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-view]');
  const views = document.querySelectorAll('.dashboard-view-panel');

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.dataset.view;

      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      views.forEach(v => {
        v.style.display = 'none';
        if (v.id === `view-${targetView}`) {
          v.style.display = 'block';
          if (typeof gsap !== 'undefined') {
            gsap.from(v, { opacity: 0, y: 15, duration: 0.4 });
          }
        }
      });
    });
  });
}

function updateDashboardUserDisplay() {
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
}
