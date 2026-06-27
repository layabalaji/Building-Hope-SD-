// Building Hope San Diego — contact form submission
//
// Posts directly to the backend's /contact endpoint, which saves the
// message to the database and triggers the "new unread message" email.
//
// CONFIG: point this at your deployed backend later, same idea as
// BHSD_CHAT_ENDPOINT in js/chatbot.js.
const BHSD_CONTACT_ENDPOINT = 'https://buildinghope-backend.onrender.com/contact';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bhsd-contact-form');
  if (!form) return;

  const statusEl = document.getElementById('bhsd-contact-status');
  const submitBtn = document.getElementById('bhsd-contact-submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById('c-name').value.trim(),
      email: document.getElementById('c-email').value.trim(),
      subject: document.getElementById('c-subject').value.trim(),
      message: document.getElementById('c-message').value.trim(),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    statusEl.textContent = '';

    try {
      const res = await fetch(BHSD_CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Backend returned ${res.status}`);

      statusEl.textContent = "Thanks — your message has been sent. We'll get back to you soon.";
      statusEl.style.color = 'var(--forest)';
      form.reset();
    } catch (err) {
      statusEl.textContent = 'Something went wrong sending your message — please try again in a moment.';
      statusEl.style.color = '#B3261E';
      console.error('Contact form error:', err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  });
});