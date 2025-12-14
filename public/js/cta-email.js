const ctaEmailForm = document.getElementById('ctaEmailForm');
const ctaEmailMessage = document.getElementById('cta-email-message');

const SUPABASE_URL = 'https://ierapvxzfvjftktskabo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllcmFwdnh6ZnZqZnRrdHNrYWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMDQ2ODIsImV4cCI6MjA3ODc4MDY4Mn0.R5CahqVjXEvuLa34hfJdNozN9cogRyRXK1iKLNtnlkM';

ctaEmailForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(ctaEmailForm);
  const email = formData.get('email');

  if (!email) {
    showCtaMessage('error', 'Vul een e-mailadres in.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showCtaMessage('error', 'Voer een geldig e-mailadres in.');
    return;
  }

  const submitButton = ctaEmailForm.querySelector('.cta-email-submit');
  const originalHTML = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"></path></svg><span>Bezig...</span>';

  showCtaMessage('info', '⏳ We zijn uw aanvraag aan het behandelen...');

  try {
    console.log('Sending CTA email to:', `${SUPABASE_URL}/functions/v1/send-contact-email`);

    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-contact-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        email: email,
        message: 'Gratis meedenken aanvraag',
        name: 'Website interesse'
      })
    });

    console.log('CTA Response status:', response.status);

    const data = await response.json();
    console.log('CTA Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Er is een fout opgetreden');
    }

    showCtaMessage('success', '✅ Bedankt! We nemen binnen 24 uur contact met je op.');
    ctaEmailForm.reset();
  } catch (error) {
    console.error('CTA form error:', error);
    showCtaMessage('error', '❌ ' + (error.message || 'Er ging iets mis. Probeer het later opnieuw.'));
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalHTML;
  }
});

function showCtaMessage(type, text) {
  ctaEmailMessage.className = `cta-email-message ${type}`;
  ctaEmailMessage.textContent = text;
  ctaEmailMessage.style.display = 'block';

  if (type === 'success') {
    setTimeout(() => {
      ctaEmailMessage.style.display = 'none';
    }, 10000);
  } else if (type === 'error') {
    setTimeout(() => {
      ctaEmailMessage.style.display = 'none';
    }, 8000);
  }
}
