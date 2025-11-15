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
