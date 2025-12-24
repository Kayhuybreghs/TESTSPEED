// Hero Email Form Handler
const heroEmailForm = document.getElementById('emailForm');
const heroEmailInput = document.getElementById('emailInput');

if (heroEmailForm) {
  heroEmailForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = heroEmailInput.value.trim();

    if (!email) {
      alert('Vul een e-mailadres in.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Voer een geldig e-mailadres in.');
      return;
    }

    const submitBtn = heroEmailForm.querySelector('.email-submit');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"></path></svg>';

    const SUPABASE_URL = 'https://ierapvxzfvjftktskabo.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllcmFwdnh6ZnZqZnRrdHNrYWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMDQ2ODIsImV4cCI6MjA3ODc4MDY4Mn0.R5CahqVjXEvuLa34hfJdNozN9cogRyRXK1iKLNtnlkM';

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/send-contact-email`, {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Er is een fout opgetreden');
      }

      alert('Bedankt! We nemen binnen 24 uur contact met je op.');
      heroEmailForm.reset();
    } catch (error) {
      console.error('Hero form error:', error);
      alert(error.message || 'Er ging iets mis. Probeer het later opnieuw.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
    }
  });
}

// Response Time Card Animation
let rtH = 2, rtM = 14, rtS = 30, rtRot = 0;

setTimeout(() => {
  document.getElementById('responseTimeCard').classList.add('mounted');
}, 50);

setInterval(() => {
  rtRot = (rtRot + 6) % 360;
  document.getElementById('rtClock').style.transform = 'rotate(' + rtRot + 'deg)';
}, 500);

setInterval(() => {
  if (rtS > 0) rtS--;
  else if (rtM > 0) { rtM--; rtS = 59; }
  else if (rtH > 0) { rtH--; rtM = 59; rtS = 59; }
  else rtS = 0;

  document.getElementById('rtHours').textContent = String(rtH).padStart(2, '0');
  document.getElementById('rtMinutes').textContent = String(rtM).padStart(2, '0');
  document.getElementById('rtSeconds').textContent = String(rtS).padStart(2, '0');
}, 1000);

// About Nest Carousel
const aboutTrack = document.querySelector('.about-nest-track');
const aboutSlides = document.querySelectorAll('.about-nest-slide');
const aboutDots = document.querySelectorAll('.about-nest-dot');
const aboutPrevBtn = document.querySelector('.about-nest-arrow-prev');
const aboutNextBtn = document.querySelector('.about-nest-arrow-next');
let currentAboutSlide = 0;

function goToAboutSlide(n) {
  aboutDots[currentAboutSlide].classList.remove('active');
  currentAboutSlide = (n + aboutSlides.length) % aboutSlides.length;
  aboutDots[currentAboutSlide].classList.add('active');

  const slideWidth = aboutSlides[0].offsetWidth + 16;
  aboutTrack.style.transform = `translateX(-${currentAboutSlide * slideWidth}px)`;
}

function nextAboutSlide() {
  goToAboutSlide(currentAboutSlide + 1);
}

function prevAboutSlide() {
  goToAboutSlide(currentAboutSlide - 1);
}

aboutNextBtn.addEventListener('click', nextAboutSlide);
aboutPrevBtn.addEventListener('click', prevAboutSlide);

aboutDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    goToAboutSlide(index);
  });
});

// Auto-play about carousel
setInterval(nextAboutSlide, 6000);

// Website Works Cards Scroll Animation
const observerOptions = {
  threshold: 0.3,
  rootMargin: '0px 0px -100px 0px'
};

const worksCardsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      worksCardsObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.works-card[data-animate]').forEach(card => {
  worksCardsObserver.observe(card);
});

// Feature cards and integrations animation with Intersection Observer
const featureCards = document.querySelectorAll('.feature-card');
const integrationsCard = document.querySelector('.card-integrations');

const featureObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 250);
      featureObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

featureCards.forEach((card) => {
  featureObserver.observe(card);
});

if (integrationsCard) {
  const integrationsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 600);
        integrationsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  integrationsObserver.observe(integrationsCard);
}

// Visitor count animation
const analyticsCard = document.querySelector('.card-analytics');
if (analyticsCard) {
  const analyticsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const visitorCount = document.getElementById('visitorCount');
        let count = 0;
        const target = 234;
        const duration = 2000;
        const increment = target / (duration / 16);

        setTimeout(() => {
          const counter = setInterval(() => {
            count += increment;
            if (count >= target) {
              visitorCount.textContent = target;
              clearInterval(counter);
            } else {
              visitorCount.textContent = Math.floor(count);
            }
          }, 16);
        }, 3000);

        analyticsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  analyticsObserver.observe(analyticsCard);
}

// Bento Grid Showcase Animation
const bentoGrid = document.getElementById('bentoGrid');
if (bentoGrid) {
  const bentoTiles = [...bentoGrid.querySelectorAll('.bento-tile')];
  const bentoStates = ['bento-state-1','bento-state-2','bento-state-3','bento-state-4'];
  let bentoTourTimers = [];
  let bentoTourActive = false;

  function runBentoIntro(){
    if (matchMedia('(prefers-reduced-motion: reduce)').matches){
      bentoGrid.classList.remove('bento-intro');
      return;
    }
    requestAnimationFrame(()=> bentoGrid.classList.add('bento-ready'));
    const total = 360 + 700;
    setTimeout(()=>{
      bentoGrid.classList.remove('bento-intro');
      startBentoFocusTour();
    }, total + 80);
  }

  const BENTO_STEP_MS = 1080;
  const BENTO_GAP_MS = 170;

  function startBentoFocusTour(){
    if (bentoTourActive) return;
    bentoTourActive = true;
    let t = 0;

    for (let i = 0; i < bentoStates.length; i++){
      bentoTourTimers.push(setTimeout(()=>{
        bentoGrid.classList.remove(...bentoStates);
        bentoGrid.classList.add(bentoStates[i]);
        bentoTiles.forEach(el=>el.classList.remove('bento-focus'));
        bentoTiles[i].classList.add('bento-focus');
      }, t));

      bentoTourTimers.push(setTimeout(()=>{
        bentoGrid.classList.remove(...bentoStates);
        bentoTiles.forEach(el=>el.classList.remove('bento-focus'));
      }, t + BENTO_STEP_MS));

      t += BENTO_STEP_MS + BENTO_GAP_MS;
    }

    bentoTourTimers.push(setTimeout(()=>{
      bentoGrid.classList.remove(...bentoStates);
      bentoTourActive = false;
    }, t));
  }

  const bentoEnter = (idx)=>{
    if (bentoTourActive || bentoGrid.classList.contains('bento-intro')) return;
    bentoGrid.classList.remove(...bentoStates);
    bentoGrid.classList.add(bentoStates[idx]);
    bentoTiles.forEach(t=>t.classList.remove('bento-focus'));
    bentoTiles[idx].classList.add('bento-focus');
  };

  const bentoLeave = ()=>{
    if (bentoTourActive || bentoGrid.classList.contains('bento-intro')) return;
    bentoGrid.classList.remove(...bentoStates);
    bentoTiles.forEach(t=>t.classList.remove('bento-focus'));
  };

  bentoTiles.forEach((t,i)=>{
    t.addEventListener('mouseenter',()=> bentoEnter(i));
    t.addEventListener('mouseleave',()=> bentoLeave());
    t.addEventListener('click',(e)=>{
      if (e.target.closest('.bento-cta')) return;
      if (bentoTourActive || bentoGrid.classList.contains('bento-intro')) return;
      bentoEnter(i);
    });
  });

  const bentoDemoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runBentoIntro();
        bentoDemoObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bentoDemoObserver.observe(bentoGrid);
}

// Website Plan Pricing Cards Animation
const pricingGrid = document.getElementById('pricingGrid');
if (pricingGrid) {
  const pricingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          document.querySelectorAll('.pricing-card').forEach(card => {
            card.classList.add('pricing-card-animate');
          });
        }, 100);
        pricingObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -150px 0px'
  });

  pricingObserver.observe(pricingGrid);

// CTA Banner Animation
const ctaBannerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.25,
  rootMargin: '0px 0px -80px 0px'
});

const ctaBanners = document.querySelectorAll('.cta-banner');
ctaBanners.forEach(banner => {
  ctaBannerObserver.observe(banner);
});
}
// Sticky Navbar Functionality
const stickyNavbar = document.getElementById('stickyNavbar');
const menuToggle = document.getElementById('menuToggle');
const navbarLinks = document.getElementById('navbarLinks');
const navLinks = document.querySelectorAll('.navbar-link');

// Add scrolled class on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    stickyNavbar.classList.add('scrolled');
  } else {
    stickyNavbar.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navbarLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navbarLinks.classList.remove('active');

    // Update active state
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!menuToggle.contains(e.target) && !navbarLinks.contains(e.target)) {
    menuToggle.classList.remove('active');
    navbarLinks.classList.remove('active');
  }
});
const footerContactForm = document.getElementById('footerContactForm');
const footerFormMessage = document.getElementById('footer-form-message');
const footerMessageTextarea = document.getElementById('footer-message');

let wordCountDisplay = null;

function createWordCounter() {
  if (!wordCountDisplay) {
    wordCountDisplay = document.createElement('div');
    wordCountDisplay.className = 'word-counter';
    wordCountDisplay.style.cssText = 'margin-top: 8px; font-size: 12px; color: #64748b;';
    footerMessageTextarea.parentElement.appendChild(wordCountDisplay);
  }
}

function updateWordCount() {
  const text = footerMessageTextarea.value.trim();
  const words = text.length > 0 ? text.split(/\s+/).filter(w => w.length > 0) : [];
  const count = words.length;

  createWordCounter();
  wordCountDisplay.textContent = `${count}/5 woorden (minimaal)`;
  wordCountDisplay.style.color = count < 5 ? '#ef4444' : '#22c55e';

  if (count < 5) {
    wordCountDisplay.textContent = `${count}/5 woorden (nog ${5 - count} nodig)`;
  }
}

footerMessageTextarea.addEventListener('input', updateWordCount);
updateWordCount();

footerContactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(footerContactForm);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  if (!name || !email || !message) {
    showFooterMessage('error', 'Vul alle verplichte velden in.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFooterMessage('error', 'Voer een geldig e-mailadres in.');
    return;
  }

  const words = message.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  if (wordCount === 0) {
    showFooterMessage('error', 'Vul een bericht in.');
    return;
  }

  if (wordCount < 5) {
    showFooterMessage('error', 'Je bericht moet minimaal 5 woorden bevatten.');
    return;
  }

  if (name.length < 2) {
    showFooterMessage('error', 'Voer een geldige naam in.');
    return;
  }

  const submitButton = footerContactForm.querySelector('.footer-form-submit');
  const originalHTML = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"></path></svg><span>Bezig met verzenden...</span>';

  showFooterMessage('info', '⏳ We zijn uw aanvraag aan het behandelen. Bedankt voor uw geduld...');

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Er is een fout opgetreden');
    }

    showFooterMessage('success', '✅ Bedankt voor uw bericht! Uw aanvraag is succesvol ontvangen en wordt behandeld. We nemen binnen 24 uur contact met u op.');
    footerContactForm.reset();
    updateWordCount();
  } catch (error) {
    console.error('Footer form error:', error);
    showFooterMessage('error', '❌ ' + (error.message || 'Er ging iets mis. Probeer het later opnieuw of neem telefonisch contact met ons op.'));
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalHTML;
  }
});

function showFooterMessage(type, text) {
  footerFormMessage.className = `footer-form-message ${type}`;
  footerFormMessage.textContent = text;
  footerFormMessage.style.display = 'block';

  if (type === 'success') {
    setTimeout(() => {
      footerFormMessage.style.display = 'none';
    }, 10000);
  } else if (type === 'error') {
    setTimeout(() => {
      footerFormMessage.style.display = 'none';
    }, 8000);
  }
}
let expandedQuestionIndex = null;

function toggleQuestion(index) {
  const allButtons = document.querySelectorAll('.faq-question');
  const allAnswers = document.querySelectorAll('.faq-answer');

  if (expandedQuestionIndex === index) {
    allButtons[index].classList.remove('active');
    allAnswers[index].classList.remove('active');
    expandedQuestionIndex = null;
  } else {
    if (expandedQuestionIndex !== null) {
      allButtons[expandedQuestionIndex].classList.remove('active');
      allAnswers[expandedQuestionIndex].classList.remove('active');
    }

    allButtons[index].classList.add('active');
    allAnswers[index].classList.add('active');
    expandedQuestionIndex = index;
  }
}

function animateFAQItems() {
  const leftSection = document.querySelector('.faq-left-section');
  const faqItems = document.querySelectorAll('.faq-item');

  if (!leftSection || faqItems.length === 0) return;

  const leftSectionAnimation = leftSection.getAnimations()[0];

  if (leftSectionAnimation) {
    leftSectionAnimation.finished.then(() => {
      faqItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('fade-in');
        }, index * 150);
      });
    });
  } else {
    faqItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('fade-in');
      }, 800 + index * 150);
    });
  }
}

function initFAQ() {
  const allButtons = document.querySelectorAll('.faq-question');

  allButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      toggleQuestion(index);
    });
  });

  animateFAQItems();
}

function loadFAQSection() {
  const faqSection = document.querySelector('.faq-section');
  if (!faqSection) return;

  const faqObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initFAQ();
        faqObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '100px 0px 0px 0px'
  });

  faqObserver.observe(faqSection);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadFAQSection);
} else {
  loadFAQSection();
}
// Professional Works Story Section - Dynamic Loading

class WorksStoryAnimator {
  constructor() {
    this.hasAnimated = false;
    this.observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    this.init();
  }

  init() {
    this.observeSection();
    this.observeElements();
    this.observeCounters();
    this.addSequentialAnimations();
  }

  // Observe main section for initial trigger
  observeSection() {
    const section = document.querySelector('.how-it-works-section');
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          entry.target.classList.add('section-visible');
        }
      });
    }, { threshold: 0.1 });

    observer.observe(section);
  }

  // Observe individual elements for staggered animations
  observeElements() {
    const elements = document.querySelectorAll('.step-card, .visual-wrapper, .kpi-card');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('element-visible');
          }, 100);
          observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    elements.forEach(el => observer.observe(el));
  }

  // Smooth counter animation with easing
  animateCounter(element, target) {
    const duration = 1800;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const updateCounter = () => {
      frame++;
      const progress = easeOutQuart(frame / totalFrames);
      const current = Math.round(progress * target);

      element.textContent = current;

      if (frame < totalFrames) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    updateCounter();
  }

  // Observe and animate counters
  observeCounters() {
    const counters = document.querySelectorAll('.counter');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.target);
          counter.textContent = '0';

          setTimeout(() => {
            this.animateCounter(counter, target);
          }, 400);

          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(counter => observer.observe(counter));
  }

  // Add sequential animations for steps
  addSequentialAnimations() {
    const steps = document.querySelectorAll('.step-card');
    steps.forEach((step, index) => {
      step.style.setProperty('--animation-delay', `${index * 0.15}s`);
    });

    const kpis = document.querySelectorAll('.kpi-card');
    kpis.forEach((kpi, index) => {
      kpi.style.setProperty('--animation-delay', `${index * 0.1}s`);
    });
  }

  // Add parallax effect on scroll (subtle)
  addParallaxEffect() {
    const laptop = document.querySelector('.laptop-mockup');
    if (!laptop) return;

    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const rect = laptop.getBoundingClientRect();

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (scrolled - rect.top) * 0.05;
        laptop.style.transform = `translateY(${offset}px)`;
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new WorksStoryAnimator();
  });
} else {
  new WorksStoryAnimator();
}
