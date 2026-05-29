/* =========================================
   DONO DA OFICINA — Landing Page Scripts
   Interactions, Animations, Counters
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initCounters();
  initFAQ();
  initTourTabs();
  initSmoothScroll();
  initUTMPreservation();
});

/* ---------- Navbar ---------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.navbar__toggle');
  const mobileMenu = document.querySelector('.navbar__mobile');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ---------- Scroll Animations (IntersectionObserver) ---------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');
  
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));
}

/* ---------- Animated Counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.counter, 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    
    el.textContent = prefix + formatNumber(current) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace('.', ',') + 'M';
  }
  return num.toLocaleString('pt-BR');
}

/* ---------- FAQ Accordion ---------- */
function initFAQ() {
  const items = document.querySelectorAll('.faq__item');

  items.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      items.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq__answer').style.maxHeight = '0';
      });

      // Open clicked (if it wasn't active)
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ---------- Tour Tabs ---------- */
function initTourTabs() {
  const tabs = document.querySelectorAll('.tour__tab');
  const slides = document.querySelectorAll('.tour__slide');

  if (!tabs.length || !slides.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      slides.forEach(s => s.classList.remove('active'));

      tab.classList.add('active');
      const targetSlide = document.querySelector(`[data-slide="${target}"]`);
      if (targetSlide) targetSlide.classList.add('active');
    });
  });
}

/* ---------- Smooth Scroll ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80; // navbar height
        const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
          top: position,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ---------- UTM Preservation ---------- */
function initUTMPreservation() {
  const params = new URLSearchParams(window.location.search);
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
  
  const utmString = utmParams
    .filter(p => params.has(p))
    .map(p => `${p}=${params.get(p)}`)
    .join('&');

  if (!utmString) return;

  // Append UTM params to all external CTA links
  document.querySelectorAll('a[href*="donodaoficina.web.app"]').forEach(link => {
    const url = new URL(link.href);
    utmParams.forEach(p => {
      if (params.has(p)) {
        url.searchParams.set(p, params.get(p));
      }
    });
    link.href = url.toString();
  });
}

/* ---------- Google Ads Conversion Tracking ---------- */
function trackConversion(label) {
  // Placeholder: Replace with your actual Google Ads conversion ID and label
  if (typeof gtag === 'function') {
    gtag('event', 'conversion', {
      'send_to': 'AW-XXXXXXXXXX/' + label,
      'event_callback': function() {
        // Callback after conversion is tracked
      }
    });
  }
}

// Track CTA clicks
document.addEventListener('click', (e) => {
  const ctaLink = e.target.closest('a[href*="donodaoficina.web.app"]');
  if (ctaLink) {
    trackConversion('cta_click');
    
    // Also track with GA4 if available
    if (typeof gtag === 'function') {
      gtag('event', 'cta_click', {
        'event_category': 'engagement',
        'event_label': ctaLink.textContent.trim(),
        'transport_type': 'beacon'
      });
    }
  }
});
