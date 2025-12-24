## ===============================
## SUPABASE CONFIG
## ===============================
const SUPABASE_URL = 'https://ierapvxzfvjftktskabo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllcmFwdnh6ZnZqZnRrdHNrYWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMDQ2ODIsImV4cCI6MjA3ODc4MDY4Mn0.R5CahqVjXEvuLa34hfJdNozN9cogRyRXK1iKLNtnlkM';

## ===============================
## UTILITY FUNCTIONS
## ===============================
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

function showSpinner(btn) {
  const html = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;animation:spin 1s linear infinite"><circle cx="12" cy="12" r="10" opacity=".25"/><path d="M12 2a10 10 0 0 1 10 10" opacity=".75"/></svg>';
  return html;
}

function restoreButton(btn, html) {
  btn.disabled = false;
  btn.innerHTML = html;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

## ===============================
## HERO EMAIL FORM
## ===============================
const heroForm = $('emailForm');
if (heroForm) {
  heroForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('emailInput').value.trim();

    if (!email || !validateEmail(email)) {
      alert('Voer een geldig e-mailadres in.');
      return;
    }

    const btn = heroForm.querySelector('.email-submit');
    const originalHTML = showSpinner(btn);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          name: 'Hero Form',
          email: email,
          message: 'Gratis meedenken aanvraag via hero sectie'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Er is een fout opgetreden');

      alert('Bedankt! We nemen binnen 24 uur contact met je op.');
      heroForm.reset();
    } catch (error) {
      console.error('Hero form error:', error);
      alert(error.message || 'Er ging iets mis. Probeer het later opnieuw.');
    } finally {
      restoreButton(btn, originalHTML);
    }
  });
}

## ===============================
## RESPONSE TIME TIMER
## ===============================
let rtH = 2, rtM = 14, rtS = 30, rtRot = 0;
const rtCard = $('responseTimeCard');
const rtClock = $('rtClock');

if (rtCard && rtClock) {
  setTimeout(() => rtCard.classList.add('mounted'), 50);

  setInterval(() => {
    rtRot = (rtRot + 6) % 360;
    rtClock.style.transform = `rotate(${rtRot}deg)`;
  }, 500);

  setInterval(() => {
    if (rtS > 0) rtS--;
    else if (rtM > 0) { rtM--; rtS = 59; }
    else if (rtH > 0) { rtH--; rtM = 59; rtS = 59; }

    $('rtHours').textContent = String(rtH).padStart(2, '0');
    $('rtMinutes').textContent = String(rtM).padStart(2, '0');
    $('rtSeconds').textContent = String(rtS).padStart(2, '0');
  }, 1000);
}

## ===============================
## ABOUT CAROUSEL
## ===============================
const aboutTrack = document.querySelector('.about-nest-track');
if (aboutTrack) {
  const slides = $$('.about-nest-slide');
  const dots = $$('.about-nest-dot');
  let current = 0;

  function goTo(n) {
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    dots[current].classList.add('active');
    aboutTrack.style.transform = `translateX(-${current * (slides[0].offsetWidth + 16)}px)`;
  }

  document.querySelector('.about-nest-arrow-next')?.addEventListener('click', () => goTo(current + 1));
  document.querySelector('.about-nest-arrow-prev')?.addEventListener('click', () => goTo(current - 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  setInterval(() => goTo(current + 1), 6000);
}

## ===============================
## INTERSECTION OBSERVER ANIMATIONS
## ===============================
function observe(selector, callback, options = {}) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3, ...options });

  $$(selector).forEach(el => observer.observe(el));
}

## Feature Cards
observe('.feature-card', (el) => {
  const cards = $$('.feature-card');
  const index = Array.from(cards).indexOf(el);
  setTimeout(() => el.classList.add('visible'), index * 250);
}, { threshold: 0.2 });

## Integrations Card
const intCard = document.querySelector('.card-integrations');
if (intCard) observe('.card-integrations', (el) => setTimeout(() => el.classList.add('visible'), 600), { threshold: 0.2 });

## Visitor Counter
const analyticsCard = document.querySelector('.card-analytics');
if (analyticsCard) {
  observe('.card-analytics', () => {
    const counter = $('visitorCount');
    let count = 0;
    const target = 234;

    setTimeout(() => {
      const timer = setInterval(() => {
        count += target / 125;
        if (count >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(count);
        }
      }, 16);
    }, 3000);
  });
}

## Works Cards Animation
observe('.works-card[data-animate]', (el) => el.classList.add('animate'));

## Pricing Cards
const pricingGrid = $('pricingGrid');
if (pricingGrid) {
  observe('#pricingGrid', () => {
    setTimeout(() => $$('.pricing-card').forEach(c => c.classList.add('pricing-card-animate')), 100);
  }, { rootMargin: '0px 0px -150px 0px' });
}

## CTA Banners
observe('.cta-banner', (el) => el.classList.add('visible'), { threshold: 0.25, rootMargin: '0px 0px -80px 0px' });

## ===============================
## BENTO GRID SHOWCASE
## ===============================
const bentoGrid = $('bentoGrid');
if (bentoGrid) {
  const tiles = [...bentoGrid.querySelectorAll('.bento-tile')];
  const states = ['bento-state-1', 'bento-state-2', 'bento-state-3', 'bento-state-4'];
  let timers = [], tourActive = false;

  function runIntro() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      bentoGrid.classList.remove('bento-intro');
      return;
    }
    requestAnimationFrame(() => bentoGrid.classList.add('bento-ready'));
    setTimeout(() => {
      bentoGrid.classList.remove('bento-intro');
      startTour();
    }, 1140);
  }

  function startTour() {
    if (tourActive) return;
    tourActive = true;
    let t = 0;
    const STEP = 1080, GAP = 170;

    for (let i = 0; i < states.length; i++) {
      timers.push(setTimeout(() => {
        bentoGrid.classList.remove(...states);
        bentoGrid.classList.add(states[i]);
        tiles.forEach(el => el.classList.remove('bento-focus'));
        tiles[i].classList.add('bento-focus');
      }, t));

      timers.push(setTimeout(() => {
        bentoGrid.classList.remove(...states);
        tiles.forEach(el => el.classList.remove('bento-focus'));
      }, t + STEP));

      t += STEP + GAP;
    }

    timers.push(setTimeout(() => {
      bentoGrid.classList.remove(...states);
      tourActive = false;
    }, t));
  }

  const enter = (i) => {
    if (tourActive || bentoGrid.classList.contains('bento-intro')) return;
    bentoGrid.classList.remove(...states);
    bentoGrid.classList.add(states[i]);
    tiles.forEach(t => t.classList.remove('bento-focus'));
    tiles[i].classList.add('bento-focus');
  };

  const leave = () => {
    if (tourActive || bentoGrid.classList.contains('bento-intro')) return;
    bentoGrid.classList.remove(...states);
    tiles.forEach(t => t.classList.remove('bento-focus'));
  };

  tiles.forEach((t, i) => {
    t.addEventListener('mouseenter', () => enter(i));
    t.addEventListener('mouseleave', leave);
    t.addEventListener('click', (e) => {
      if (e.target.closest('.bento-cta')) return;
      if (tourActive || bentoGrid.classList.contains('bento-intro')) return;
      enter(i);
    });
  });

  observe('#bentoGrid', runIntro);
}

## ===============================
## STICKY NAVBAR
## ===============================
const navbar = $('stickyNavbar');
const menuToggle = $('menuToggle');
const navbarLinks = $('navbarLinks');
const navLinks = $$('.navbar-link');

if (navbar && menuToggle) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.pageYOffset > 50);
  });

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navbarLinks.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navbarLinks.classList.remove('active');
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navbarLinks.contains(e.target)) {
      menuToggle.classList.remove('active');
      navbarLinks.classList.remove('active');
    }
  });
}

## ===============================
## FOOTER CONTACT FORM
## ===============================
const footerForm = $('footerContactForm');
const footerMsg = $('footer-form-message');
const footerTextarea = $('footer-message');

if (footerForm && footerTextarea) {
  let wordCounter = null;

  function updateWordCount() {
    const words = footerTextarea.value.trim().split(/\s+/).filter(w => w.length > 0);
    const count = words.length;

    if (!wordCounter) {
      wordCounter = document.createElement('div');
      wordCounter.className = 'word-counter';
      wordCounter.style.cssText = 'margin-top:8px;font-size:12px;color:#64748b;';
      footerTextarea.parentElement.appendChild(wordCounter);
    }

    wordCounter.textContent = count < 5 ? `${count}/5 woorden (nog ${5 - count} nodig)` : `${count}/5 woorden (minimaal)`;
    wordCounter.style.color = count < 5 ? '#ef4444' : '#22c55e';
  }

  function showMsg(type, text) {
    footerMsg.className = `footer-form-message ${type}`;
    footerMsg.textContent = text;
    footerMsg.style.display = 'block';

    const timeout = type === 'success' ? 10000 : (type === 'error' ? 8000 : 0);
    if (timeout) setTimeout(() => footerMsg.style.display = 'none', timeout);
  }

  footerTextarea.addEventListener('input', updateWordCount);
  updateWordCount();

  footerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(footerForm);
    const name = fd.get('name');
    const email = fd.get('email');
    const message = fd.get('message');

    if (!name || !email || !message) {
      showMsg('error', 'Vul alle verplichte velden in.');
      return;
    }

    if (!validateEmail(email)) {
      showMsg('error', 'Voer een geldig e-mailadres in.');
      return;
    }

    const wordCount = message.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount < 5) {
      showMsg('error', 'Je bericht moet minimaal 5 woorden bevatten.');
      return;
    }

    if (name.length < 2) {
      showMsg('error', 'Voer een geldige naam in.');
      return;
    }

    const btn = footerForm.querySelector('.footer-form-submit');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;animation:spin 1s linear infinite"><circle cx="12" cy="12" r="10" opacity=".25"/><path d="M12 2a10 10 0 0 1 10 10" opacity=".75"/></svg><span>Bezig met verzenden...</span>';

    showMsg('info', '⏳ We zijn uw aanvraag aan het behandelen. Bedankt voor uw geduld...');

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Er is een fout opgetreden');

      showMsg('success', '✅ Bedankt voor uw bericht! Uw aanvraag is succesvol ontvangen en wordt behandeld. We nemen binnen 24 uur contact met u op.');
      footerForm.reset();
      updateWordCount();
    } catch (error) {
      console.error('Footer form error:', error);
      showMsg('error', '❌ ' + (error.message || 'Er ging iets mis. Probeer het later opnieuw of neem telefonisch contact met ons op.'));
    } finally {
      restoreButton(btn, originalHTML);
    }
  });
}

## ===============================
## FAQ SECTION
## ===============================
let expandedQ = null;

function toggleQ(idx) {
  const btns = $$('.faq-question');
  const answers = $$('.faq-answer');

  if (expandedQ === idx) {
    btns[idx].classList.remove('active');
    answers[idx].classList.remove('active');
    expandedQ = null;
  } else {
    if (expandedQ !== null) {
      btns[expandedQ].classList.remove('active');
      answers[expandedQ].classList.remove('active');
    }
    btns[idx].classList.add('active');
    answers[idx].classList.add('active');
    expandedQ = idx;
  }
}

function initFAQ() {
  const btns = $$('.faq-question');
  btns.forEach((btn, i) => btn.addEventListener('click', () => toggleQ(i)));

  const leftSection = document.querySelector('.faq-left-section');
  const items = $$('.faq-item');

  if (!leftSection || !items.length) return;

  const anim = leftSection.getAnimations()[0];
  const start = anim ? () => anim.finished.then(animateItems) : () => setTimeout(animateItems, 800);

  function animateItems() {
    items.forEach((item, i) => setTimeout(() => item.classList.add('fade-in'), i * 150));
  }

  start();
}

const faqSection = document.querySelector('.faq-section');
if (faqSection) {
  observe('.faq-section', initFAQ, { threshold: 0.1, rootMargin: '100px 0px 0px 0px' });
}
