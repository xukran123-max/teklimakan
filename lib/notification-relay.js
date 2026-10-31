const DEFAULT_RELAY_URL = 'https://www.teklimakan.online';

function getRelayUrl() {
  const raw = process.env.NOTIFICATION_RELAY_URL || DEFAULT_RELAY_URL;
  const url = new URL(raw);
  if (url.protocol !== 'https:' || url.hostname !== 'www.teklimakan.online') {
    throw new Error('Notification relay URL is not allowed');
  }
  return url.origin;
}

async function relayNotification(path, body, method = 'POST') {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${getRelayUrl()}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: method === 'GET' ? undefined : JSON.stringify(body || {}),
      signal: controller.signal
    });
    const data = await response.json().catch(() => ({}));
    return { response, data };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { relayNotification };
