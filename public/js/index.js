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
