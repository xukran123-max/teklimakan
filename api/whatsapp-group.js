// ================================================================
// 🚀 تەكلىماكان سۇپىسى — WhatsApp گۇرۇپپا ئاپتوماتىك ئۇقتۇرۇش مۇلازىمىتى
// Teklimakan Automated WhatsApp Group Broadcaster Serverless Endpoint
// ================================================================

module.exports = async function handler(req, res) {
  // CORS تەڭشىكى
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { provider = 'green-api', token, instanceId, chatId, text, imageUrl, webhookUrl, action } = body;

    if (!text && action !== 'test') {
      return res.status(400).json({ success: false, error: 'ئۇچۇر تېكىستى (text) بوش بولسا بولمايدۇ.' });
    }

    // 1. خاس Webhook ئارقىلىق يوللاش
    if (provider === 'webhook' || (webhookUrl && webhookUrl.startsWith('http'))) {
      const targetUrl = webhookUrl;
      const resp = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'teklimakan-ecommerce',
          type: 'whatsapp_group_broadcast',
          text,
          imageUrl,
          chatId,
          timestamp: new Date().toISOString()
        })
      });

      const respText = await resp.text();
      return res.status(200).json({
        success: resp.ok,
        provider: 'webhook',
        status: resp.status,
        response: respText.slice(0, 500)
      });
    }

    // 2. Green-API ئارقىلىق توپقا ئەۋەتىش (https://green-api.com)
    if (provider === 'green-api') {
      if (!instanceId || !token || !chatId) {
        return res.status(400).json({
          success: false,
          error: 'Green-API تەڭشەكلىرى تولۇق ئەمەس: Instance ID, Token ۋە Chat ID تەلەپ قىلىنىدۇ.'
        });
      }

      // Group ID format normalizer: e.g. "12036302xxxxxx@g.us" or append "@g.us" if needed
      let formattedChatId = String(chatId).trim();
      if (!formattedChatId.includes('@')) {
        formattedChatId = `${formattedChatId}@g.us`;
      }

      const greenApiUrl = `https://api.green-api.com/waInstance${instanceId}/sendMessage/${token}`;
      const payload = {
        chatId: formattedChatId,
        message: text
      };

      const resp = await fetch(greenApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await resp.json().catch(() => ({}));
      if (resp.ok && data.idMessage) {
        return res.status(200).json({
          success: true,
          provider: 'green-api',
          messageId: data.idMessage,
          message: 'WhatsApp توپىغا ئۇچۇر مۇۋەپپەقىيەتلىك يەتكۈزۈلدى!'
        });
      } else {
        return res.status(resp.status || 500).json({
          success: false,
          provider: 'green-api',
          error: data.message || 'Green-API دىن خاتالىق قايتتى',
          details: data
        });
      }
    }

    // 3. UltraMsg ئارقىلىق توپقا ئەۋەتىش (https://ultramsg.com)
    if (provider === 'ultramsg') {
      if (!instanceId || !token || !chatId) {
        return res.status(400).json({
          success: false,
          error: 'UltraMsg تەڭشەكلىرى تولۇق ئەمەس: Instance ID, Token ۋە Chat ID تەلەپ قىلىنىدۇ.'
        });
      }

      let formattedChatId = String(chatId).trim();
      if (!formattedChatId.includes('@')) {
        formattedChatId = `${formattedChatId}@g.us`;
      }

      const ultraUrl = `https://api.ultramsg.com/${instanceId}/messages/chat`;
      const params = new URLSearchParams({
        token,
        to: formattedChatId,
        body: text
      });

      const resp = await fetch(ultraUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      const data = await resp.json().catch(() => ({}));
      if (resp.ok && (data.sent === 'true' || data.sent === true || data.id)) {
        return res.status(200).json({
          success: true,
          provider: 'ultramsg',
          messageId: data.id,
          message: 'WhatsApp توپىغا ئۇچۇر مۇۋەپپەقىيەتلىك يەتكۈزۈلدى!'
        });
      } else {
        return res.status(resp.status || 500).json({
          success: false,
          provider: 'ultramsg',
          error: data.message || 'UltraMsg دىن خاتالىق قايتتى',
          details: data
        });
      }
    }

    // Provider نامەلۇم بولسا
    return res.status(400).json({
      success: false,
      error: `قوللىمايدىغان provider: ${provider}. پەقەت 'green-api', 'ultramsg', ياكى 'webhook' قوللىنىلىدۇ.`
    });
  } catch (err) {
    console.error('[WhatsAppGroup] API Serverless Error:', err);
    return res.status(500).json({
      success: false,
      error: 'مۇلازىمېتىر ئىچكى خاتالىقى: ' + (err.message || String(err))
    });
  }
};
