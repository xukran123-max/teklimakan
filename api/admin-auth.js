const crypto = require('crypto');

const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function safeEqual(left, right) {
  const a = Buffer.from(String(left || ''), 'utf8');
  const b = Buffer.from(String(right || ''), 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function getClientId(req) {
  return String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const expectedUser = String(process.env.ADMIN_USERNAME || '').trim().toLowerCase();
  const expectedPassword = String(process.env.ADMIN_PASSWORD || '');
  if (!expectedUser || expectedPassword.length < 12) {
    return res.status(503).json({ error: 'Admin authentication is not configured' });
  }

  const clientId = getClientId(req);
  const now = Date.now();
  const current = attempts.get(clientId);
  const state = !current || now - current.startedAt > WINDOW_MS
    ? { count: 0, startedAt: now }
    : current;

  if (state.count >= MAX_ATTEMPTS) {
    res.setHeader('Retry-After', String(Math.ceil((WINDOW_MS - (now - state.startedAt)) / 1000)));
    return res.status(429).json({ error: 'Too many login attempts' });
  }

  const username = String(req.body?.username || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const authenticated = safeEqual(username, expectedUser) && safeEqual(password, expectedPassword);

  if (!authenticated) {
    state.count += 1;
    attempts.set(clientId, state);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  attempts.delete(clientId);
  return res.status(200).json({ authenticated: true });
};
