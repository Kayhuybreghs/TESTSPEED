const footerContactForm = document.getElementById('footerContactForm');
const footerFormMessage = document.getElementById('footer-form-message');
const footerMessageTextarea = document.getElementById('footer-message');

const SUPABASE_URL = 'https://ierapvxzfvjftktskabo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllcmFwdnh6ZnZqZnRrdHNrYWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMDQ2ODIsImV4cCI6MjA3ODc4MDY4Mn0.R5CahqVjXEvuLa34hfJdNozN9cogRyRXK1iKLNtnlkM';

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
    console.log('Sending to:', `${SUPABASE_URL}/functions/v1/send-contact-email`);

    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-contact-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message
      })
    });

    console.log('Response status:', response.status);

    const data = await response.json();
    console.log('Response data:', data);

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
