const attempts = new Map();
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

function normalizeChatId(phone) {
  let digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('0090')) digits = digits.slice(4);
  else if (digits.startsWith('90') && digits.length >= 12) digits = digits.slice(2);
  else if (digits.startsWith('0')) digits = digits.slice(1);
  return digits.length === 10 && digits.startsWith('5') ? `90${digits}@c.us` : '';
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  if (!allowRequest(req, res)) return res.status(429).json({ error: 'Too many notification attempts' });

  const instanceId = process.env.WHATSAPP_INSTANCE_ID || '';
  const apiToken = process.env.WHATSAPP_API_TOKEN || '';
  if (!instanceId || !apiToken) return res.status(503).json({ error: 'WhatsApp notifications are not configured' });

  const chatId = normalizeChatId(req.body?.phone);
  const message = String(req.body?.message || '').trim().slice(0, 3500);
  if (!chatId || !message) return res.status(400).json({ error: 'Valid Turkish phone and message are required' });

  try {
    const response = await fetch(`https://7107.api.greenapi.com/waInstance${encodeURIComponent(instanceId)}/sendMessage/${encodeURIComponent(apiToken)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.idMessage) return res.status(502).json({ error: 'WhatsApp delivery failed' });
    return res.status(200).json({ success: true, idMessage: data.idMessage });
  } catch (error) {
    console.error('whatsapp-notify failed:', error.message);
    return res.status(502).json({ error: 'WhatsApp delivery failed' });
  }
};
