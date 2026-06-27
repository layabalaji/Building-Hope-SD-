// Building Hope San Diego — chatbot widget
//
// This file only handles the UI + talking to your backend. All the actual
// intelligence (the trained intent classifier, retrieval, and the AI API
// call) lives server-side in backend/, never in this file — an API key
// should never be shipped to the browser.
//
// CONFIG: point this at your backend once it's deployed. While developing
// locally, run the backend (see backend/README.md) and leave this as-is.
const BHSD_CHAT_ENDPOINT = 'http://localhost:8000/chat';

// Pages the bot can route users to. Keep this in sync with your actual
// page folders — the backend classifier returns a short "page" key
// (e.g. "events") and this map turns it into a real link.
const BHSD_PAGE_MAP = {
  home: '/',
  about: '/about/',
  issue: '/the-issue/',
  events: '/events/',
  involved: '/get-involved/',
  contact: '/contact/',
};

document.addEventListener('DOMContentLoaded', () => {
  const launcher = document.getElementById('bhsd-chat-launcher');
  const panel = document.getElementById('bhsd-chat-panel');
  const messages = document.getElementById('bhsd-chat-messages');
  const input = document.getElementById('bhsd-chat-input');
  const sendBtn = document.getElementById('bhsd-chat-send');

  if (!launcher || !panel) return;

  let greeted = false;

  launcher.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open') && !greeted) {
      addMessage('bot', "Hi! I can help you find your way around the site, or answer questions about Building Hope San Diego. What would you like to know?");
      greeted = true;
    }
  });

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    addMessage('user', text);
    input.value = '';
    sendToBackend(text);
  }

  function addMessage(role, text) {
    const div = document.createElement('div');
    div.className = `bhsd-msg ${role}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendToBackend(message) {
    addMessage('bot', '…');
    const thinkingEl = messages.lastChild;

    try {
      const res = await fetch(BHSD_CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error(`Backend returned ${res.status}`);
      const data = await res.json();

      thinkingEl.remove();

      // Expected backend response shape (see backend/app/routers/chat.py):
      // { intent: "navigation" | "informational" | "crisis" | "off_topic",
      //   reply: "...",
      //   page: "events" | null }
      addMessage('bot', data.reply || "Sorry, I didn't catch that.");

      if (data.intent === 'navigation' && data.page && BHSD_PAGE_MAP[data.page]) {
        const link = document.createElement('a');
        link.href = BHSD_PAGE_MAP[data.page];
        link.textContent = `Go to ${data.page} page →`;
        link.style.display = 'block';
        link.style.marginTop = '4px';
        link.style.fontSize = '13px';
        messages.appendChild(link);
      }
    } catch (err) {
      thinkingEl.remove();
      addMessage('bot', "I can't reach the backend right now. If you're developing locally, make sure it's running (see backend/README.md).");
      console.error('Chatbot error:', err);
    }
  }
});