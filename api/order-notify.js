const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8880936621:AAG7d5C4CPVyA8XiP0cPYUFYPfJmkF6DWZM';
const TARGET_CHAT_ID = process.env.TELEGRAM_TARGET_CHAT_ID || '7077223578';
const CALLER_SESSION = process.env.TELEGRAM_CALLER_SESSION || '1BAAOMTQ5LjE1NC4xNjcuOTEAUC+LwFo5pvbmgyIIkt3Lkev/jE0Sf785BcFNT9AgIuVTzLLTX+ij/eU/PcrDDgnljfaXYuvviym92bkmhljv61CrNrz2nSj+5V6L7TiiMzFLvXMnO2fDOvYVk0F7M78ZrB+aP6Dc99T2r0+juzTKKROU8y1y9aQZT5Uv+J8YAGskEngnFRxGl2RWu/0u8sx09LJmEG59lyTzHwtkx6Jte/1O7ixoCoGhCzHqY5oojmVRYmDmTEw245uMe0KAzOTiq84pP0RLHU5N6X62d9DWFPnF6pxifwBzzUG27cy3CJ2QLjhpivFDJcaBtuxte1+ITmtPRLsblyFh2gNClS/XeOA=';

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
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
      const { TelegramClient, Api } = await import('telegram');
      const { StringSession } = await import('telegram/sessions/index.js');
      const crypto = await import('crypto');

      const client = new TelegramClient(new StringSession(CALLER_SESSION), 6, 'eb06d4abfb49dc3eeb1aeb98ae0f581e', {
        connectionRetries: 2
      });

      await client.connect();
      const targetUser = await client.getEntity('@uygur_tibbi');

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

    return res.status(200).json({
      success: true,
      botNotification: botMsgSuccess,
      callTriggered: callSuccess,
      orderId: order.id
    });
  } catch (globalErr) {
    console.error('Fatal order notify error:', globalErr);
    return res.status(500).json({ error: globalErr.message });
  }
};
