/* STACKLY — Core Main JS & GSAP Animations */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initMobileMenu();
  initCartDrawer();
  initStickyHeader();
  initGSAPAnimations();
  initRunningNumbers();
});

// Preloader Animation
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progress = document.querySelector('.preloader-progress');

  if (!preloader) return;

  if (progress && typeof gsap !== 'undefined') {
    gsap.to(progress, {
      width: '100%',
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.to(preloader, {
          opacity: 0,
          duration: 0.6,
          onComplete: () => {
            preloader.style.display = 'none';
            triggerPageEntrance();
          }
        });
      }
    });
  } else {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => preloader.style.display = 'none', 500);
    }, 800);
  }
}

// Page Entrance Animation
function triggerPageEntrance() {
  if (typeof gsap === 'undefined') return;

  gsap.from('.site-header', {
    y: -50,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  });

  if (document.querySelector('.hero-content')) {
    gsap.from('.hero-content > *', {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }
}

// Sticky Header
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.padding = '0.8rem 2rem';
      header.style.backgroundColor = 'rgba(17, 17, 17, 0.98)';
    } else {
      header.style.padding = '1.2rem 2rem';
      header.style.backgroundColor = 'rgba(17, 17, 17, 0.95)';
    }
  });
}

// Mobile Menu Off-Canvas with GSAP
function initMobileMenu() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');
  const closeBtn = document.querySelector('.mobile-menu-close');
  const navLinks = document.querySelectorAll('.mobile-nav-links a');

  if (!hamburgerBtn || !mobileMenu) return;

  function openMenu() {
    mobileOverlay.classList.add('active');
    mobileMenu.classList.add('active');
    document.body.classList.add('no-scroll');

    if (typeof gsap !== 'undefined') {
      gsap.from('.mobile-nav-links li', {
        x: 40,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out'
      });
    }
  }

  function closeMenu() {
    mobileOverlay.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  hamburgerBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

// Cart Slide-Over Drawer Toggles
function initCartDrawer() {
  const cartBtn = document.querySelector('.cart-icon-btn');
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartOverlay = document.querySelector('.cart-drawer-overlay');
  const closeBtn = document.querySelector('.cart-close-btn');

  if (!cartBtn || !cartDrawer) return;

  function openCart() {
    cartOverlay.classList.add('active');
    cartDrawer.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function closeCart() {
    cartOverlay.classList.remove('active');
    cartDrawer.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer.classList.contains('active')) {
      closeCart();
    }
  });
}

// Global GSAP ScrollTrigger Animations
function initGSAPAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Reveal section titles
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 95%'
      },
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    });
  });

  // Stagger grid cards safely
  gsap.utils.toArray('.grid-4-col, .grid-3-col, .products-grid, .social-gallery-grid').forEach(grid => {
    const cards = Array.from(grid.children);
    if (cards.length > 0) {
      gsap.fromTo(cards, 
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 98%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  });
}

// Running Counter / Statistics Number Animation
function initRunningNumbers() {
  const statEls = document.querySelectorAll('.stat-number');
  if (!statEls.length) return;

  const animateCounters = () => {
    statEls.forEach(el => {
      if (el.dataset.animated) return;
      el.dataset.animated = 'true';

      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 2000; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Cubic ease-out
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easedProgress * target);

        el.textContent = currentVal + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = target + suffix;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const statsContainer = document.querySelector('.stat-number')?.closest('section');
    if (statsContainer) {
      observer.observe(statsContainer);
    } else {
      animateCounters();
    }
  } else {
    animateCounters();
  }
}

// Clear input fields when returning to previous page or page show / reload
if (typeof clearAllPageInputs !== 'function') {
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
}
