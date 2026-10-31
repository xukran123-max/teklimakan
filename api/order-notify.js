const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TARGET_CHAT_ID = process.env.TELEGRAM_TARGET_CHAT_ID || '';
const CALLER_SESSION = process.env.TELEGRAM_CALLER_SESSION || '';
const TELEGRAM_API_ID = Number(process.env.TELEGRAM_API_ID || 0);
const TELEGRAM_API_HASH = process.env.TELEGRAM_API_HASH || '';
const TELEGRAM_TARGET_USERNAME = process.env.TELEGRAM_TARGET_USERNAME || '';
const { sendOrderEmail } = require('../lib/email-notifications');

module.exports = async function handler(req, res) {
  const origin = String(req.headers.origin || '');
  const allowedOrigins = new Set([
    'https://teklimakan.com',
    'https://www.teklimakan.com',
    'https://teklimakan.online',
    'https://www.teklimakan.online'
  ]);
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!BOT_TOKEN || !TARGET_CHAT_ID) {
    return res.status(503).json({ error: 'Telegram notifications are not configured' });
  }

  try {
    const order = req.body || {};
    const customer = order.customer || {};
    const items = order.items || [];

    // Format purchased items
    const itemsText = items.map((it, idx) => {
      const priceStr = it.price ? ` (${it.price} TL)` : '';
      return `${idx + 1}. <b>${it.name}</b> × ${it.quantity}${priceStr}`;
    }).join('\n');

    const message = `🚨 <b>[يېڭى جىددىي زاكاز كېلىپ چۈشتى! — TEKLİMAKAN]</b>\n\n` +
      `🆔 <b>زاكاز نومۇرى:</b> <code>${order.id || 'N/A'}</code>\n` +
      `👤 <b>خېرىدار:</b> ${customer.name || 'نامەلۇم'}\n` +
      `📞 <b>تېلېفون:</b> <code>${customer.phone || 'نومۇرسىز'}</code>\n` +
      `📍 <b>ئادرېس:</b> ${customer.city || ''} ${customer.address || ''}\n` +
      `💳 <b>چىقىم ئۇسۇلى:</b> ${order.paymentMethod || 'نەق پۇل / كارت'}\n` +
      `💰 <b>ئومۇمىي سومما:</b> <b>${order.totalFormatted || (order.totalCny ? order.totalCny + ' TL' : '0 TL')}</b>\n\n` +
      `📦 <b>سېتىۋالغان ماللار:</b>\n${itemsText || 'مەھسۇلات ئۇچۇرى يوق'}\n` +
      (order.notes ? `\n📝 <b>خېرىدار ئەسكەرتىشى:</b> ${order.notes}\n` : '') +
      `\n⏰ <b>ۋاقتى:</b> ${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}`;

    // 1. Send Telegram Bot Message
    let botMsgSuccess = false;
    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TARGET_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
          disable_notification: false
        })
      });
      const tgData = await tgRes.json();
      botMsgSuccess = tgData.ok;

      // Pin message to trigger persistent notification sound on phone
      if (tgData.ok && tgData.result && tgData.result.message_id) {
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/pinChatMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TARGET_CHAT_ID,
            message_id: tgData.result.message_id,
            disable_notification: false
          })
        }).catch(() => {});
      }
    } catch (err) {
      console.warn('Bot alert failed:', err.message);
    }

    // 2. Trigger MTProto Telegram Phone Call (Rings the phone!)
    let callSuccess = false;
    try {
      if (!CALLER_SESSION || !TELEGRAM_API_ID || !TELEGRAM_API_HASH || !TELEGRAM_TARGET_USERNAME) {
        throw new Error('Telegram call integration is not configured');
      }
      const { TelegramClient, Api } = await import('telegram');
      const { StringSession } = await import('telegram/sessions/index.js');
      const crypto = await import('crypto');

      const client = new TelegramClient(new StringSession(CALLER_SESSION), TELEGRAM_API_ID, TELEGRAM_API_HASH, {
        connectionRetries: 2
      });

      await client.connect();
      const targetUser = await client.getEntity(TELEGRAM_TARGET_USERNAME);

      const gAHash = crypto.randomBytes(32);
      const protocol = new Api.PhoneCallProtocol({
        udpP2p: true,
        udpReflector: true,
        minLayer: 65,
        maxLayer: 92,
        libraryVersions: ['3.0.0']
      });

      const callRes = await client.invoke(new Api.phone.RequestCall({
        userId: targetUser,
        randomId: Math.floor(Math.random() * 10000000),
        gAHash: gAHash,
        protocol: protocol
      }));

      if (callRes && callRes.phoneCall) {
        callSuccess = true;
        const callId = callRes.phoneCall.id;
        const accessHash = callRes.phoneCall.accessHash;

        // Ring for 10 seconds so the phone sounds loud
        setTimeout(async () => {
          try {
            await client.invoke(new Api.phone.DiscardCall({
              peer: new Api.InputPhoneCall({ id: callId, accessHash: accessHash }),
              duration: 10,
              reason: new Api.PhoneCallDiscardReasonMissed(),
              connectionId: 0n
            }));
            await client.disconnect();
          } catch (e) {}
        }, 10000);
      }
    } catch (callErr) {
      console.warn('Call trigger error:', callErr.message);
    }

    let emailSuccess = false;
    let emailConfigured = false;
    try {
      const emailResult = await sendOrderEmail(order);
      emailSuccess = emailResult.success === true;
      emailConfigured = emailResult.configured === true;
    } catch (emailErr) {
      console.warn('Order email failed:', emailErr.message);
    }

    return res.status(200).json({
      success: true,
      botNotification: botMsgSuccess,
      callTriggered: callSuccess,
      emailNotification: emailSuccess,
      emailConfigured,
      orderId: order.id
    });
  } catch (globalErr) {
    console.error('Fatal order notify error:', globalErr);
    return res.status(500).json({ error: globalErr.message });
  }
};
