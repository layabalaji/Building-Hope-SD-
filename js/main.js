// Building Hope San Diego — shared site behavior

document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const yearEl = document.getElementById('bhsd-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle (simple show/hide — replace with a real menu as the site grows)
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.style.display === 'flex';
      links.style.display = isOpen ? 'none' : 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '64px';
      links.style.right = '24px';
      links.style.background = '#fff';
      links.style.border = '1px solid var(--border)';
      links.style.borderRadius = 'var(--radius)';
      links.style.padding = '16px';
      links.style.gap = '14px';
    });
  }

  // The volunteer form on Get Involved isn't wired to a backend route yet —
  // still a placeholder. The contact form has its own real handler now,
  // in js/contact.js, so it's intentionally not in this list anymore.
  ['bhsd-volunteer-form'].forEach((id) => {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('This form is not wired up to a backend yet — see backend/README.md for next steps.');
    });
  });
});