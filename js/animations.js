/**
 * animations.js
 * Handles scroll-reveal animations, skill bar fills,
 * animated counters, 3D card tilt effects, and timeline animations.
 */

(function () {
  'use strict';

  /* ============================================================
     SCROLL REVEAL (Intersection Observer)
     ============================================================ */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  revealElements.forEach((el, i) => {
    // Stagger siblings within the same parent
    const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
    const idx = siblings.indexOf(el);
    el.style.transitionDelay = `${idx * 0.08}s`;
    revealObserver.observe(el);
  });

  /* ============================================================
     SKILL BAR ANIMATIONS
     ============================================================ */
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const targetWidth = fill.getAttribute('data-width') + '%';
          // Small delay to ensure transition fires
          setTimeout(() => {
            fill.style.width = targetWidth;
          }, 200);
          skillObserver.unobserve(fill);
        }
      });
    },
    { threshold: 0.3, rootMargin: '0px 0px -40px 0px' }
  );

  skillFills.forEach((fill) => skillObserver.observe(fill));

  /* ============================================================
     ANIMATED STAT COUNTERS
     ============================================================ */
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // #region agent log
          fetch('http://127.0.0.1:7281/ingest/6d8d1f55-e0d7-408e-ae7c-3e3914c17251',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ab1c7b'},body:JSON.stringify({sessionId:'ab1c7b',location:'animations.js:counter',message:'stat counter triggered',data:{target:entry.target.getAttribute('data-target'),id:entry.target.closest('.stat-card')?.id||null},timestamp:Date.now(),hypothesisId:'D',runId:'initial'})}).catch(()=>{});
          // #endregion
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => counterObserver.observe(el));

  /* ============================================================
     3D CARD TILT EFFECT
     ============================================================ */
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });

  /* ============================================================
     TIMELINE ANIMATION
     ============================================================ */
  const timelineItems = document.querySelectorAll('.timeline-item');

  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, i * 150);
          timelineObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  timelineItems.forEach((item) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    timelineObserver.observe(item);
  });

  // Override .revealed for timeline items
  document.addEventListener('DOMContentLoaded', () => {});

  // Custom class addition for timeline
  const timelineStyle = document.createElement('style');
  timelineStyle.textContent = `
    .timeline-item.revealed {
      opacity: 1 !important;
      transform: translateX(0) !important;
    }
    .timeline-item-right.revealed {
      transform: translateX(0) !important;
    }
  `;
  document.head.appendChild(timelineStyle);

  /* ============================================================
     SECTION ACTIVE NAV HIGHLIGHT
     (handled in main.js via IntersectionObserver)
     ============================================================ */

  /* ============================================================
     GLASSMORPHISM HOVER GLOW TRAILS
     ============================================================ */
  const glassCards = document.querySelectorAll('.glass-card');

  glassCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // Add glow radial gradient on hover via CSS custom property injection
  const glowStyle = document.createElement('style');
  glowStyle.textContent = `
    .glass-card {
      --mouse-x: 50%;
      --mouse-y: 50%;
    }
    .glass-card::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(
        600px circle at var(--mouse-x) var(--mouse-y),
        rgba(0, 212, 255, 0.04),
        transparent 40%
      );
      border-radius: inherit;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .glass-card:hover::after {
      opacity: 1;
    }
  `;
  document.head.appendChild(glowStyle);

  /* ============================================================
     SMOOTH SECTION TRANSITIONS (fade-in on load)
     ============================================================ */
  const heroContent = document.querySelector('.hero-content');
  const heroVisual = document.querySelector('.hero-visual');

  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    heroContent.style.transition = 'opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1), transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)';
  }

  if (heroVisual) {
    heroVisual.style.opacity = '0';
    heroVisual.style.transform = 'translateY(30px)';
    heroVisual.style.transition = 'opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.2s, transform 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.2s';
  }

  // Triggered by loader hide (in main.js)
  window.revealHero = function () {
    // #region agent log
    fetch('http://127.0.0.1:7281/ingest/6d8d1f55-e0d7-408e-ae7c-3e3914c17251',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'ab1c7b'},body:JSON.stringify({sessionId:'ab1c7b',location:'animations.js:revealHero',message:'revealHero called',data:{hasHeroContent:!!heroContent,hasHeroVisual:!!heroVisual},timestamp:Date.now(),hypothesisId:'A',runId:'initial'})}).catch(()=>{});
    // #endregion
    if (heroContent) {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }
    if (heroVisual) {
      heroVisual.style.opacity = '1';
      heroVisual.style.transform = 'translateY(0)';
    }
  };

  /* ============================================================
     NEON BORDER PULSE ON SECTION ENTER
     ============================================================ */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-active');
        } else {
          entry.target.classList.remove('section-active');
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.section').forEach((section) => {
    sectionObserver.observe(section);
  });

})();
