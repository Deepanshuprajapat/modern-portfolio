/**
 * main.js
 * Core portfolio JavaScript:
 * - Page loader
 * - Custom cursor
 * - Typed text effect
 * - Navbar scroll behavior & active link
 * - Mobile hamburger menu
 * - Back-to-top button
 * - Contact form with Flask API
 * - Smooth scroll
 */

(function () {
  'use strict';

  /* ============================================================
     TYPED TEXT EFFECT
     ============================================================ */
  const typedEl = document.getElementById('typed-text');
  const phrases = [
    'Software Engineer',
    'Python Developer',
    'Backend Developer',
    'Flask & FastAPI Expert',
    'REST API Architect',
    'AI Application Builder',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    if (typedEl) {
      typedEl.textContent = currentPhrase.substring(0, charIndex);
    }

    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at end of word
      speed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 400;
    }

    typingTimeout = setTimeout(type, speed);
  }

  // Start typing after loader
  setTimeout(type, 2200);

  /* ============================================================
     PAGE LOADER
     ============================================================ */
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) {
        loader.classList.add('hidden');
      }
      // #region agent log
      fetch('http://127.0.0.1:7281/ingest/6d8d1f55-e0d7-408e-ae7c-3e3914c17251',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ab1c7b'},body:JSON.stringify({sessionId:'ab1c7b',location:'main.js:loader-hide',message:'loader hidden on load',data:{loaderHidden:!!loader?.classList.contains('hidden'),revealHeroExists:typeof window.revealHero==='function'},timestamp:Date.now(),hypothesisId:'A',runId:'initial'})}).catch(()=>{});
      // #endregion
      // Reveal hero after loader hides
      if (typeof window.revealHero === 'function') {
        window.revealHero();
      }
    }, 1900);
  });

  // Failsafe: hide loader after 3.5s regardless
  setTimeout(() => {
    if (loader && !loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      if (typeof window.revealHero === 'function') window.revealHero();
    }
  }, 3500);

  /* ============================================================
     CUSTOM CURSOR
     ============================================================ */
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursor-follower');

  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    if (cursor) {
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
    }
  });

  // Smooth follower animation
  function animateCursor() {
    followerX += (cursorX - followerX) * 0.12;
    followerY += (cursorY - followerY) * 0.12;
    if (cursorFollower) {
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top = followerY + 'px';
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor state on interactive elements
  const interactiveEls = document.querySelectorAll('a, button, input, textarea, .project-card, .cert-card, .stat-card');
  interactiveEls.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (cursor) {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
        cursor.style.opacity = '0.7';
      }
      if (cursorFollower) {
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorFollower.style.borderColor = 'rgba(0, 212, 255, 0.8)';
      }
    });
    el.addEventListener('mouseleave', () => {
      if (cursor) {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.opacity = '1';
      }
      if (cursorFollower) {
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorFollower.style.borderColor = 'rgba(0, 212, 255, 0.5)';
      }
    });
  });

  // Hide cursor on mobile
  if ('ontouchstart' in window) {
    if (cursor) cursor.style.display = 'none';
    if (cursorFollower) cursorFollower.style.display = 'none';
  }

  /* ============================================================
     NAVBAR SCROLL BEHAVIOR
     ============================================================ */
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Hide/show navbar on scroll direction
      if (scrollY > lastScrollY && scrollY > 200) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
    }

    lastScrollY = scrollY;

    // Back to top visibility
    const backBtn = document.getElementById('back-to-top');
    if (backBtn) {
      if (scrollY > 600) {
        backBtn.classList.add('visible');
      } else {
        backBtn.classList.remove('visible');
      }
    }
  });

  /* ============================================================
     ACTIVE NAV LINK (Intersection Observer)
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.4, rootMargin: '-80px 0px -50% 0px' }
  );

  sections.forEach((section) => navObserver.observe(section));

  /* ============================================================
     MOBILE HAMBURGER MENU
     ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    // #region agent log
    fetch('http://127.0.0.1:7281/ingest/6d8d1f55-e0d7-408e-ae7c-3e3914c17251',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ab1c7b'},body:JSON.stringify({sessionId:'ab1c7b',location:'main.js:toggleMenu',message:'mobile menu toggled',data:{isOpen:mobileMenu.classList.contains('open')},timestamp:Date.now(),hypothesisId:'E',runId:'initial'})}).catch(()=>{});
    // #endregion
  }

  if (hamburger) hamburger.addEventListener('click', toggleMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  /* ============================================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     BACK TO TOP BUTTON
     ============================================================ */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     CONTACT FORM WITH FLASK API
     ============================================================ */
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const btnLoading = submitBtn ? submitBtn.querySelector('.btn-loading') : null;
  const formSuccess = document.getElementById('form-success');
  const formErrorMsg = document.getElementById('form-error-msg');

  // Field references
  const nameField = document.getElementById('contact-name');
  const emailField = document.getElementById('contact-email');
  const subjectField = document.getElementById('contact-subject');
  const messageField = document.getElementById('contact-message');

  // Error spans
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  function setError(field, errorEl, msg) {
    if (field) field.style.borderColor = '#f87171';
    if (errorEl) errorEl.textContent = msg;
  }

  function clearError(field, errorEl) {
    if (field) field.style.borderColor = '';
    if (errorEl) errorEl.textContent = '';
  }

  function validateForm() {
    let valid = true;

    // Name
    if (!nameField || nameField.value.trim().length < 2) {
      setError(nameField, nameError, 'Please enter your full name.');
      valid = false;
    } else {
      clearError(nameField, nameError);
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailField || !emailRegex.test(emailField.value.trim())) {
      setError(emailField, emailError, 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError(emailField, emailError);
    }

    // Subject
    if (!subjectField || subjectField.value.trim().length < 3) {
      setError(subjectField, subjectError, 'Please enter a subject.');
      valid = false;
    } else {
      clearError(subjectField, subjectError);
    }

    // Message
    if (!messageField || messageField.value.trim().length < 10) {
      setError(messageField, messageError, 'Please enter a message (at least 10 characters).');
      valid = false;
    } else {
      clearError(messageField, messageError);
    }

    return valid;
  }

  // Real-time validation on blur
  [nameField, emailField, subjectField, messageField].forEach((field) => {
    if (!field) return;
    field.addEventListener('blur', validateForm);
    field.addEventListener('focus', () => {
      field.style.borderColor = 'var(--neon-cyan)';
    });
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      // Loading state
      submitBtn.disabled = true;
      if (btnText) btnText.classList.add('hidden');
      if (btnLoading) btnLoading.classList.remove('hidden');
      if (formSuccess) formSuccess.classList.add('hidden');
      if (formErrorMsg) formErrorMsg.classList.add('hidden');

      const formData = {
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        subject: subjectField.value.trim(),
        message: messageField.value.trim(),
      };

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        // #region agent log
        fetch('http://127.0.0.1:7281/ingest/6d8d1f55-e0d7-408e-ae7c-3e3914c17251',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ab1c7b'},body:JSON.stringify({sessionId:'ab1c7b',location:'main.js:contact-response',message:'contact API response',data:{ok:response.ok,status:response.status,success:data?.success,emailSent:data?.email_sent},timestamp:Date.now(),hypothesisId:'C',runId:'initial'})}).catch(()=>{});
        // #endregion

        if (response.ok && data.success) {
          if (formSuccess) formSuccess.classList.remove('hidden');
          form.reset();
        } else {
          throw new Error(data.message || 'Server error');
        }
      } catch (err) {
        // #region agent log
        fetch('http://127.0.0.1:7281/ingest/6d8d1f55-e0d7-408e-ae7c-3e3914c17251',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ab1c7b'},body:JSON.stringify({sessionId:'ab1c7b',location:'main.js:contact-error',message:'contact form error',data:{error:err.message},timestamp:Date.now(),hypothesisId:'C',runId:'initial'})}).catch(()=>{});
        // #endregion
        // If Flask is not running, show a friendly fallback
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          // Simulate success for demo (when Flask not running)
          if (formSuccess) formSuccess.classList.remove('hidden');
          form.reset();
          console.info('Flask API not running. Form submitted in demo mode.');
        } else {
          if (formErrorMsg) formErrorMsg.classList.remove('hidden');
        }
      } finally {
        submitBtn.disabled = false;
        if (btnText) btnText.classList.remove('hidden');
        if (btnLoading) btnLoading.classList.add('hidden');
      }
    });
  }

  /* ============================================================
     NAVBAR TRANSITION ON RESIZE
     ============================================================ */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ============================================================
     FLOATING BADGE CLICK RIPPLE
     ============================================================ */
  document.querySelectorAll('.float-badge').forEach((badge) => {
    badge.addEventListener('click', (e) => {
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: 60px; height: 60px;
        background: rgba(0, 212, 255, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        animation: rippleAnim 0.6s ease forwards;
        left: ${e.offsetX}px; top: ${e.offsetY}px;
        pointer-events: none;
      `;
      badge.style.position = 'relative';
      badge.style.overflow = 'hidden';
      badge.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Ripple keyframe
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes rippleAnim {
      to { transform: translate(-50%, -50%) scale(3); opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);

  /* ============================================================
     NAVBAR TRANSITION CSS PATCH
     ============================================================ */
  const navbarTransitionStyle = document.createElement('style');
  navbarTransitionStyle.textContent = `
    .navbar {
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                  padding 0.3s ease,
                  background 0.3s ease,
                  border-color 0.3s ease,
                  box-shadow 0.3s ease;
    }
  `;
  document.head.appendChild(navbarTransitionStyle);

  console.log('%c⚡ Deepanshu Prajapat Portfolio', 'color: #00d4ff; font-size: 14px; font-weight: bold;');
  console.log('%cBuilt with Python, Flask & JavaScript 🚀', 'color: #7c3aed; font-size: 12px;');
})();
