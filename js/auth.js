/* ══════════════════════════════════════════
auth.js — Ero Tarts authentication
Password: hillock7
══════════════════════════════════════════ */

const AUTH_KEY = ‘et_auth’;

async function sha256(message) {
const buf  = new TextEncoder().encode(message);
const hash = await crypto.subtle.digest(‘SHA-256’, buf);
return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,‘0’)).join(’’);
}

async function handleLogin(e) {
e.preventDefault();
const input = document.getElementById(‘passInput’).value.trim();
const errEl = document.getElementById(‘loginError’);

const inputHash  = await sha256(input);
const correctHash = await sha256(‘hillock7’);

if (inputHash === correctHash) {
sessionStorage.setItem(AUTH_KEY, ‘true’);
window.location.href = ‘player.html’;
} else {
errEl.textContent   = ‘Incorrect password. Please try again.’;
errEl.style.opacity = ‘1’;
document.getElementById(‘passInput’).value = ‘’;
document.getElementById(‘passInput’).focus();
const form = document.getElementById(‘loginForm’);
form.classList.add(‘shake’);
setTimeout(() => form.classList.remove(‘shake’), 500);
}
}

function requireAuth() {
if (sessionStorage.getItem(AUTH_KEY) !== ‘true’) {
window.location.href = ‘index.html’;
}
}

function logout() {
sessionStorage.removeItem(AUTH_KEY);
window.location.href = ‘index.html’;
}
