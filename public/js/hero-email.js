const heroEmailForm = document.getElementById('emailForm');
const heroEmailMessage = document.getElementById('hero-email-message');

const SUPABASE_URL = 'https://ierapvxzfvjftktskabo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllcmFwdnh6ZnZqZnRrdHNrYWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMDQ2ODIsImV4cCI6MjA3ODc4MDY4Mn0.R5CahqVjXEvuLa34hfJdNozN9cogRyRXK1iKLNtnlkM';

heroEmailForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(heroEmailForm);
  const email = formData.get('email');

  if (!email) {
    showHeroMessage('error', 'Vul een e-mailadres in.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showHeroMessage('error', 'Voer een geldig e-mailadres in.');
    return;
  }

  const submitButton = heroEmailForm.querySelector('.email-submit');
  const originalHTML = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"></path></svg>';

  showHeroMessage('info', '⏳ Bezig met verzenden...');

  try {
    console.log('Sending hero email to:', `${SUPABASE_URL}/functions/v1/send-contact-email`);

    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-contact-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        email: email,
        message: 'Gratis meedenken aanvraag - Hero form',
        name: 'Hero interesse formulier'
      })
    });

    console.log('Hero email response status:', response.status);

    const data = await response.json();
    console.log('Hero email response data:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Er is een fout opgetreden');
    }

    showHeroMessage('success', '✅ Bedankt! We nemen binnen 24 uur contact met je op.');
    heroEmailForm.reset();
  } catch (error) {
    console.error('Hero email form error:', error);
    showHeroMessage('error', '❌ ' + (error.message || 'Er ging iets mis. Probeer het later opnieuw.'));
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalHTML;
  }
});

function showHeroMessage(type, text) {
  heroEmailMessage.className = `hero-email-message ${type}`;
  heroEmailMessage.textContent = text;
  heroEmailMessage.style.display = 'block';

  if (type === 'success') {
    setTimeout(() => {
      heroEmailMessage.style.display = 'none';
    }, 10000);
  } else if (type === 'error') {
    setTimeout(() => {
      heroEmailMessage.style.display = 'none';
    }, 8000);
  } else if (type === 'info') {
    setTimeout(() => {
      heroEmailMessage.style.display = 'none';
    }, 30000);
  }
}
