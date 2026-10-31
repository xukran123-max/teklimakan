const attempts = new Map();
const { relayNotification } = require('../lib/notification-relay');
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 20;

function getClientId(req) {
  return String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
}

function allowRequest(req, res) {
  const id = getClientId(req);
  const now = Date.now();
  const previous = attempts.get(id);
  const state = !previous || now - previous.startedAt > WINDOW_MS
    ? { count: 0, startedAt: now }
    : previous;
  if (state.count >= MAX_ATTEMPTS) {
    res.setHeader('Retry-After', String(Math.ceil((WINDOW_MS - (now - state.startedAt)) / 1000)));
    return false;
  }
  state.count += 1;
  attempts.set(id, state);
  return true;
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[char]));
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  if (!allowRequest(req, res)) return res.status(429).json({ error: 'Too many notification attempts' });

  const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
  const chatId = process.env.TELEGRAM_TARGET_CHAT_ID || '';
  if (!botToken || !chatId) {
    try {
      const { response, data } = await relayNotification('/api/telegram-notify', req.body || {});
      return res.status(response.ok ? 200 : response.status).json({ ...data, relayed: true });
    } catch (error) {
      console.error('Telegram notification relay failed:', error.message);
      return res.status(502).json({ error: 'Notification relay failed' });
    }
  }

  const title = String(req.body?.title || '').trim().slice(0, 200);
  const message = String(req.body?.message || '').trim().slice(0, 3500);
  const urgent = req.body?.isUrgent === true;
  if (!title || !message) return res.status(400).json({ error: 'Title and message are required' });

  const prefix = urgent ? '🚨 <b>[URGENT]</b>\n' : '📢 <b>[TEKLIMAKAN]</b>\n';
  const text = `${prefix}<b>${escapeHtml(title)}</b>\n\n${escapeHtml(message)}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok !== true) return res.status(502).json({ error: 'Telegram delivery failed' });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('telegram-notify failed:', error.message);
    return res.status(502).json({ error: 'Telegram delivery failed' });
  }
};
