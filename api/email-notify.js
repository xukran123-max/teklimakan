const { getConfig, isConfigured, sendTestEmail } = require('../lib/email-notifications');

const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function allowRequest(req, res) {
  const id = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const current = attempts.get(id);
  const state = !current || now - current.startedAt > WINDOW_MS ? { count: 0, startedAt: now } : current;
  if (state.count >= MAX_ATTEMPTS) {
    res.setHeader('Retry-After', String(Math.ceil((WINDOW_MS - (now - state.startedAt)) / 1000)));
    return false;
  }
  state.count += 1;
  attempts.set(id, state);
  return true;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'GET') {
    const config = getConfig();
    return res.status(200).json({ configured: isConfigured(config) });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  if (!allowRequest(req, res)) return res.status(429).json({ error: 'Too many email test attempts' });

  try {
    const result = await sendTestEmail();
    if (!result.configured) return res.status(503).json({ success: false, configured: false, error: 'Email notifications are not configured' });
    return res.status(200).json({ success: true, configured: true });
  } catch (error) {
    console.error('email-notify failed:', error.message);
    return res.status(502).json({ success: false, configured: true, error: 'Email delivery failed' });
  }
};
