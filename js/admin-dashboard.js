// Building Hope San Diego — admin dashboard (gmail-style inbox)

const BHSD_API_BASE = 'https://buildinghope-backend.onrender.com';
const BHSD_TOKEN_KEY = 'bhsd_admin_token';

const token = localStorage.getItem(BHSD_TOKEN_KEY);
if (!token) {
  window.location.href = '/admin/';
}

const authHeaders = { Authorization: `Bearer ${token}` };

const listEl = document.getElementById('bhsd-admin-list');
const detailEl = document.getElementById('bhsd-admin-detail');
const logoutBtn = document.getElementById('bhsd-admin-logout');

let messages = [];
let selectedId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadMessages();
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem(BHSD_TOKEN_KEY);
    window.location.href = '/admin/';
  });
});

async function handleAuthFailure(res) {
  if (res.status === 401) {
    localStorage.removeItem(BHSD_TOKEN_KEY);
    window.location.href = '/admin/';
    return true;
  }
  return false;
}

async function loadMessages() {
  try {
    const res = await fetch(`${BHSD_API_BASE}/messages`, { headers: authHeaders });
    if (await handleAuthFailure(res)) return;
    if (!res.ok) throw new Error(`Backend returned ${res.status}`);
    messages = await res.json();
    renderList();
  } catch (err) {
    listEl.innerHTML = `<p style="padding:16px; color:#B3261E; font-size:14px;">Couldn't load messages — is the backend running?</p>`;
    console.error('Load messages error:', err);
  }
}

function renderList() {
  if (messages.length === 0) {
    listEl.innerHTML = `<p style="padding:16px; color:var(--text-muted); font-size:14px;">No messages yet.</p>`;
    return;
  }

  listEl.innerHTML = messages.map((m) => `
    <div class="message-row ${m.is_read ? 'read' : 'unread'} ${m.id === selectedId ? 'selected' : ''}" data-id="${m.id}">
      <span class="message-row-dot"></span>
      <div class="message-row-text">
        <div class="message-row-name">${escapeHtml(m.name)}</div>
        <div class="message-row-subject">${escapeHtml(m.subject)}</div>
      </div>
      <div class="message-row-date">${formatDate(m.created_at)}</div>
    </div>
  `).join('');

  listEl.querySelectorAll('.message-row').forEach((row) => {
    row.addEventListener('click', () => openMessage(Number(row.dataset.id)));
  });
}

async function openMessage(id) {
  selectedId = id;
  renderList();

  try {
    const res = await fetch(`${BHSD_API_BASE}/messages/${id}`, { headers: authHeaders });
    if (await handleAuthFailure(res)) return;
    if (!res.ok) throw new Error(`Backend returned ${res.status}`);
    const msg = await res.json();

    const local = messages.find((m) => m.id === id);
    if (local) local.is_read = true;
    renderList();

    renderDetail(msg);
  } catch (err) {
    detailEl.innerHTML = `<div class="admin-empty-state"><p style="color:#B3261E;">Couldn't load that message.</p></div>`;
    console.error('Open message error:', err);
  }
}

function renderDetail(msg) {
  detailEl.innerHTML = `
    <div class="admin-detail-header">
      <h2 style="margin-bottom:4px;">${escapeHtml(msg.subject)}</h2>
      <p style="color:var(--text-muted); margin:0;">${escapeHtml(msg.name)} &lt;${escapeHtml(msg.email)}&gt;</p>
      <p style="color:var(--text-muted); font-size:13px; margin-top:4px;">${formatDate(msg.created_at)}</p>
    </div>
    <div class="admin-detail-body">${escapeHtml(msg.message).replace(/\n/g, '<br>')}</div>
    <div class="admin-detail-actions">
      <button class="btn btn-outline" id="bhsd-mark-unread">Mark as unread</button>
      <button class="btn btn-outline" id="bhsd-delete-message" style="border-color:#B3261E; color:#B3261E;">Delete</button>
    </div>
  `;

  document.getElementById('bhsd-mark-unread').addEventListener('click', () => setReadStatus(msg.id, false));
  document.getElementById('bhsd-delete-message').addEventListener('click', () => deleteMessage(msg.id));
}

async function setReadStatus(id, isRead) {
  try {
    const res = await fetch(`${BHSD_API_BASE}/messages/${id}?is_read=${isRead}`, {
      method: 'PATCH',
      headers: authHeaders,
    });
    if (await handleAuthFailure(res)) return;
    if (!res.ok) throw new Error(`Backend returned ${res.status}`);

    const local = messages.find((m) => m.id === id);
    if (local) local.is_read = isRead;

    if (!isRead) {
      selectedId = null;
      detailEl.innerHTML = `<div class="admin-empty-state"><p>Select a message to read it.</p></div>`;
    }
    renderList();
  } catch (err) {
    console.error('Set read status error:', err);
  }
}

async function deleteMessage(id) {
  if (!confirm("Delete this message? This can't be undone.")) return;

  try {
    const res = await fetch(`${BHSD_API_BASE}/messages/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
    if (await handleAuthFailure(res)) return;
    if (!res.ok && res.status !== 204) throw new Error(`Backend returned ${res.status}`);

    messages = messages.filter((m) => m.id !== id);
    selectedId = null;
    renderList();
    detailEl.innerHTML = `<div class="admin-empty-state"><p>Select a message to read it.</p></div>`;
  } catch (err) {
    console.error('Delete message error:', err);
  }
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' · ' +
         d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}