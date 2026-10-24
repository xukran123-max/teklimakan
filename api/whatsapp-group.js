// ================================================================
// 🚀 تەكلىماكان سۇپىسى — WhatsApp گۇرۇپپا ئاپتوماتىك ئۇقتۇرۇش مۇلازىمىتى
// Teklimakan Automated WhatsApp Group Broadcaster Serverless Endpoint
// ================================================================
// ھەم ئۇيغۇرچە ھەم تۈركچە ئەھۋالدا، تاۋارنىڭ سۈزۈك سۈرىتى چوقۇم ئۇچۇر بىلەن
// بىرگە (Media + Caption) ھالىتىدە گۇرۇپپىغا بىۋاستە يەتكۈزۈلىدۇ.

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

    // 1. خاس Webhook ئارقىلىق يوللاش (سۈرەت بىلەن بىللە)
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
    // سۈرەت بار بولسا sendFileByUrl بىلەن Caption قىلىپ يوللايدۇ
    if (provider === 'green-api') {
      if (!instanceId || !token || !chatId) {
        return res.status(400).json({
          success: false,
          error: 'Green-API تەڭشەكلىرى تولۇق ئەمەس: Instance ID, Token ۋە Chat ID تەلەپ قىلىنىدۇ.'
        });
      }

      let formattedChatId = String(chatId).trim();
      if (!formattedChatId.includes('@')) {
        formattedChatId = `${formattedChatId}@g.us`;
      }

      let sentSuccess = false;
      let resultData = null;

      // ئەگەر سۈرەت بولسا ئالدى بىلەن سۈرەتنى تېكىستى بىلەن بىللە ئەۋەتىدۇ (sendFileByUrl)
      if (imageUrl && imageUrl.startsWith('http')) {
        try {
          const fileUrl = `https://api.green-api.com/waInstance${instanceId}/sendFileByUrl/${token}`;
          const fileResp = await fetch(fileUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chatId: formattedChatId,
              urlFile: imageUrl,
              fileName: 'product.jpg',
              caption: text
            })
          });
          const fileData = await fileResp.json().catch(() => ({}));
          if (fileResp.ok && fileData.idMessage) {
            sentSuccess = true;
            resultData = fileData;
          }
        } catch (fileErr) {
          console.warn('[GreenAPI] sendFileByUrl failed, falling back to sendMessage:', fileErr);
        }
      }

      // سۈرەتلىك يوللانمىغان بولسا ياكى سۈرەت بولمىسا تېكىستىنى يوللايدۇ
      if (!sentSuccess) {
        const textUrl = `https://api.green-api.com/waInstance${instanceId}/sendMessage/${token}`;
        const textResp = await fetch(textUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId: formattedChatId,
            message: text
          })
        });
        resultData = await textResp.json().catch(() => ({}));
        sentSuccess = textResp.ok && !!resultData.idMessage;
      }

      if (sentSuccess) {
        return res.status(200).json({
          success: true,
          provider: 'green-api',
          messageId: resultData.idMessage,
          hasImage: !!imageUrl,
          message: 'WhatsApp توپىغا سۈرەتلىك تاۋار ئېلانى مۇۋەپپەقىيەتلىك يەتكۈزۈلدى!'
        });
      } else {
        return res.status(500).json({
          success: false,
          provider: 'green-api',
          error: resultData?.message || 'Green-API دىن خاتالىق قايتتى',
          details: resultData
        });
      }
    }

    // 3. UltraMsg ئارقىلىق توپقا ئەۋەتىش (https://ultramsg.com)
    // سۈرەت بار بولسا messages/image ئارقىلىق caption بىلەن ئەۋەتىدۇ
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

      let sentSuccess = false;
      let resultData = null;

      if (imageUrl && imageUrl.startsWith('http')) {
        try {
          const ultraImgUrl = `https://api.ultramsg.com/${instanceId}/messages/image`;
          const params = new URLSearchParams({
            token,
            to: formattedChatId,
            image: imageUrl,
            caption: text
          });
          const imgResp = await fetch(ultraImgUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
          });
          resultData = await imgResp.json().catch(() => ({}));
          sentSuccess = imgResp.ok && (resultData.sent === 'true' || resultData.sent === true || resultData.id);
        } catch (imgErr) {
          console.warn('[UltraMsg] image send failed, falling back to chat:', imgErr);
        }
      }

      if (!sentSuccess) {
        const ultraTextUrl = `https://api.ultramsg.com/${instanceId}/messages/chat`;
        const params = new URLSearchParams({
          token,
          to: formattedChatId,
          body: text
        });
        const textResp = await fetch(ultraTextUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString()
        });
        resultData = await textResp.json().catch(() => ({}));
        sentSuccess = textResp.ok && (resultData.sent === 'true' || resultData.sent === true || resultData.id);
      }

      if (sentSuccess) {
        return res.status(200).json({
          success: true,
          provider: 'ultramsg',
          messageId: resultData.id,
          hasImage: !!imageUrl,
          message: 'WhatsApp توپىغا سۈرەتلىك تاۋار ئېلانى مۇۋەپپەقىيەتلىك يەتكۈزۈلدى!'
        });
      } else {
        return res.status(500).json({
          success: false,
          provider: 'ultramsg',
          error: resultData?.message || 'UltraMsg دىن خاتالىق قايتتى',
          details: resultData
        });
      }
    }

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
