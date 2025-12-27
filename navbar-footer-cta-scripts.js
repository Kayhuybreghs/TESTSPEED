/* ===================================
   NAVBAR JAVASCRIPT
   =================================== */

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

/* ===================================
   FOOTER CTA JAVASCRIPT
   =================================== */

// Footer Contact Form Handler
const footerContactForm = document.getElementById('footerContactForm');
const footerFormMessage = document.getElementById('footer-form-message');
const footerMessageTextarea = document.getElementById('footer-message');

let wordCountDisplay = null;

// Create word counter
function createWordCounter() {
  if (!wordCountDisplay) {
    wordCountDisplay = document.createElement('div');
    wordCountDisplay.className = 'word-counter';
    wordCountDisplay.style.cssText = 'margin-top: 8px; font-size: 12px; color: #64748b;';
    footerMessageTextarea.parentElement.appendChild(wordCountDisplay);
  }
}

// Update word count
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

// Initialize word counter
footerMessageTextarea.addEventListener('input', updateWordCount);
updateWordCount();

// Footer Form Submit Handler
footerContactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(footerContactForm);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  // Validation
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

  // Show loading state
  const submitButton = footerContactForm.querySelector('.footer-form-submit');
  const originalHTML = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"></path></svg><span>Bezig met verzenden...</span>';

  showFooterMessage('info', '⏳ We zijn uw aanvraag aan het behandelen. Bedankt voor uw geduld...');

  try {
    // Send form data to API
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

    // Success
    showFooterMessage('success', '✅ Bedankt voor uw bericht! Uw aanvraag is succesvol ontvangen en wordt behandeld. We nemen binnen 24 uur contact met u op.');
    footerContactForm.reset();
    updateWordCount();
  } catch (error) {
    console.error('Footer form error:', error);
    showFooterMessage('error', '❌ ' + (error.message || 'Er ging iets mis. Probeer het later opnieuw of neem telefonisch contact met ons op.'));
  } finally {
    // Restore button state
    submitButton.disabled = false;
    submitButton.innerHTML = originalHTML;
  }
});

// Show footer form message
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

// CTA Banner Animation (Intersection Observer)
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

// Observe all CTA banners
const ctaBanners = document.querySelectorAll('.cta-banner');
ctaBanners.forEach(banner => {
  ctaBannerObserver.observe(banner);
});
