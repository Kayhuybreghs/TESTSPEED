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
