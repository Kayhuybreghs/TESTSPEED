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
  wordCountDisplay.textContent = `${count}/5 woorden`;
  wordCountDisplay.style.color = count > 5 ? '#ef4444' : '#64748b';

  if (count > 5) {
    wordCountDisplay.textContent += ' (maximum bereikt)';
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

  if (wordCount > 5) {
    showFooterMessage('error', 'Je bericht mag maximaal 5 woorden bevatten.');
    return;
  }

  if (name.length < 2) {
    showFooterMessage('error', 'Voer een geldige naam in.');
    return;
  }

  const submitButton = footerContactForm.querySelector('.footer-form-submit');
  const originalHTML = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 20px; height: 20px; animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"></path></svg><span>Verzenden...</span>';

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const response = await fetch(`${supabaseUrl}/functions/v1/send-contact-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
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

    showFooterMessage('success', 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.');
    footerContactForm.reset();
    updateWordCount();
  } catch (error) {
    console.error('Footer form error:', error);
    showFooterMessage('error', error.message || 'Er ging iets mis. Probeer het later opnieuw.');
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalHTML;
  }
});

function showFooterMessage(type, text) {
  footerFormMessage.className = `footer-form-message ${type}`;
  footerFormMessage.textContent = text;
  footerFormMessage.style.display = 'block';

  setTimeout(() => {
    footerFormMessage.style.display = 'none';
  }, 6000);
}
