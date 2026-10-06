/* STACKLY — Contact Form JS Validation & Inline Handler */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (form) {
    initInlineValidation(form);
    form.addEventListener('submit', handleContactSubmit);
  }
});

function validateName(inputEl) {
  if (!inputEl) return true;
  const val = inputEl.value.trim();
  if (!val) {
    showInputError(inputEl, 'Full Name is required');
    return false;
  }
  clearInputError(inputEl);
  return true;
}

function validateEmail(inputEl) {
  if (!inputEl) return true;
  const val = inputEl.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!val) {
    showInputError(inputEl, 'Email address is required');
    return false;
  } else if (!emailRegex.test(val)) {
    showInputError(inputEl, 'Please enter a valid email address');
    return false;
  }
  clearInputError(inputEl);
  return true;
}

function validatePhone(inputEl) {
  if (!inputEl) return true;
  const val = inputEl.value.trim();
  const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
  if (val && !phoneRegex.test(val)) {
    showInputError(inputEl, 'Please enter a valid phone number');
    return false;
  }
  clearInputError(inputEl);
  return true;
}

function validateMessage(inputEl) {
  if (!inputEl) return true;
  const val = inputEl.value.trim();
  if (!val) {
    showInputError(inputEl, 'Message cannot be empty');
    return false;
  } else if (val.length < 10) {
    showInputError(inputEl, 'Message must be at least 10 characters long');
    return false;
  }
  clearInputError(inputEl);
  return true;
}

function initInlineValidation(form) {
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const messageInput = document.getElementById('contact-message');

  if (nameInput) {
    nameInput.addEventListener('input', () => validateName(nameInput));
    nameInput.addEventListener('blur', () => validateName(nameInput));
  }
  if (emailInput) {
    emailInput.addEventListener('input', () => validateEmail(emailInput));
    emailInput.addEventListener('blur', () => validateEmail(emailInput));
  }
  if (phoneInput) {
    phoneInput.addEventListener('input', () => validatePhone(phoneInput));
    phoneInput.addEventListener('blur', () => validatePhone(phoneInput));
  }
  if (messageInput) {
    messageInput.addEventListener('input', () => validateMessage(messageInput));
    messageInput.addEventListener('blur', () => validateMessage(messageInput));
  }
}

function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const messageInput = document.getElementById('contact-message');
  
  const isNameValid = validateName(nameInput);
  const isEmailValid = validateEmail(emailInput);
  const isPhoneValid = validatePhone(phoneInput);
  const isMessageValid = validateMessage(messageInput);
  
  const isValid = isNameValid && isEmailValid && isPhoneValid && isMessageValid;
  
  if (isValid) {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'SENDING MESSAGE...';
    }
    
    setTimeout(() => {
      form.reset();
      clearAllInputErrors();
      window.location.href = '404.html';
    }, 500);
  }
}

function showInputError(inputEl, message) {
  const parent = inputEl.closest('.form-group');
  if (parent) {
    parent.classList.add('error');
    const errEl = parent.querySelector('.error-message');
    if (errEl) {
      errEl.textContent = message;
    }
  }
}

function clearInputError(inputEl) {
  const parent = inputEl.closest('.form-group');
  if (parent) {
    parent.classList.remove('error');
    const errEl = parent.querySelector('.error-message');
    if (errEl) {
      errEl.textContent = '';
    }
  }
}

function clearAllInputErrors() {
  document.querySelectorAll('.form-group').forEach(fg => {
    fg.classList.remove('error');
    const errEl = fg.querySelector('.error-message');
    if (errEl) {
      errEl.textContent = '';
    }
  });
}

/* 4 New Sections Interactivity */
document.addEventListener('DOMContentLoaded', () => {
  initDatePicker();
  initCityPills();
  initTimeSlotBtns();
  initFAQAccordion();
  initContactGSAPAnimations();
});

function initDatePicker() {
  const dateInput = document.getElementById('appointment-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    if (!dateInput.value) {
      dateInput.value = today;
    }
  }
}

function initCityPills() {
  const pills = document.querySelectorAll('.city-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

function initTimeSlotBtns() {
  const btns = document.querySelectorAll('.time-slot-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function handleAppointmentBooking(event) {
  event.preventDefault();
}

function initFAQAccordion() {
  const items = document.querySelectorAll('.faq-accordion-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        items.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

function initContactGSAPAnimations() {
  const cards = document.querySelectorAll('.atelier-card');
  if (cards.length === 0) return;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(cards, 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.ateliers-section',
          start: 'top 95%',
          toggleActions: 'play none none none'
        }
      }
    );
  } else {
    cards.forEach(card => {
      card.style.opacity = '1';
    });
  }
}
