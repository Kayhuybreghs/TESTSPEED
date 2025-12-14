// Footer Contact Form Handler with Advanced Spam Protection
const footerContactForm = document.getElementById('footerContactForm');
const footerFormMessage = document.getElementById('footer-form-message');
let lastFooterSubmitTime = 0;
const FOOTER_RATE_LIMIT_MS = 30000;

footerContactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Rate limiting
  const now = Date.now();
  if (now - lastFooterSubmitTime < FOOTER_RATE_LIMIT_MS) {
    showFooterMessage('error', 'Even geduld alsjeblieft. Je kunt maar één bericht per 30 seconden versturen.');
    return;
  }

  const formData = new FormData(footerContactForm);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  // Validation
  if (!name || !email || !message) {
    showFooterMessage('error', 'Vul alle verplichte velden in.');
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFooterMessage('error', 'Voer een geldig e-mailadres in.');
    return;
  }

  // Name validation (min 2 characters, no numbers)
  if (name.length < 2 || /\d/.test(name)) {
    showFooterMessage('error', 'Voer een geldige naam in.');
    return;
  }

  // Message validation (min 10 characters)
  if (message.length < 10) {
    showFooterMessage('error', 'Je bericht moet minimaal 10 karakters bevatten.');
    return;
  }

  // Advanced spam filters
  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|prize|bitcoin|crypto)\b/i,
    /(http|https):\/\/.*\.(tk|ml|ga|cf|gq|xyz)/i,
    /\b\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4}\b/,
    /<script|<iframe|javascript:/i,
    /(\w)\1{5,}/i,
  ];

  if (spamPatterns.some(pattern => pattern.test(message) || pattern.test(name))) {
    showFooterMessage('error', 'Je bericht bevat verdachte inhoud. Neem direct contact met ons op.');
    return;
  }

  // Check for excessive links
  const linkCount = (message.match(/https?:\/\//g) || []).length;
  if (linkCount > 2) {
    showFooterMessage('error', 'Je bericht bevat te veel links.');
    return;
  }

  const submitButton = footerContactForm.querySelector('.footer-form-submit');
  const originalHTML = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"></path></svg><span>Verzenden...</span>';

  try {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    const supabaseUrl = 'https://urwtemnqugyuisutxluw.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyd3RlbW5xdWd5dWlzdXR4bHV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwODY0NjksImV4cCI6MjA3NTY2MjQ2OX0.bUhgW4HkHju82NMOHaYgBXGVHi-Wa_HSIfy4mQDHWIU';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase
      .from('contact_submissions')
      .insert([{
        email: email,
        message: `Naam: ${name}\n\n${message}`,
        user_agent: navigator.userAgent
      }]);

    if (error) throw error;

    lastFooterSubmitTime = now;
    showFooterMessage('success', 'Bedankt voor je bericht! We nemen binnen 2 werkdagen contact met je op.');
    footerContactForm.reset();
  } catch (error) {
    console.error('Footer form error:', error);
    showFooterMessage('error', 'Er ging iets mis. Probeer het later opnieuw of neem direct contact op via telefoon of e-mail.');
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
