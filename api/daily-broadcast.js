// ================================================================
// 🚀 تەكلىماكان سۇپىسى — كۈندىلىك كەچ سائەت 20:00 WhatsApp ئېلان مۇلازىمىتى
// Teklimakan Daily WhatsApp Broadcast Serverless Cron Handler
// ================================================================
// 1. ھەرئىككىلا ئەھۋالدا (ئۇيغۇرچە / تۈركچە) رەسىم چوقۇم بولۇش كېرەك!
// 2. 30 كۈن ئىچىدە تەكرارلانماسلىق كاپالىتى.
// 3. مەھسۇلات تۈگەپ كەتسە سۈكۈت قىلماي ساھىبخانغا ئەسكەرتىش بېرىش.
// 4. بىر كۈن ئۇيغۇرچە (teklimakan.com)، ئەتىسى تۈركچە (teklimakan.online).
// 5. مەجبۇرىي ئورگان ئاخىرقى خەتلىرى.

const SUPABASE_URL = 'https://hvvxnnnpukgpmwexcniq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_PGV3YrYULBIiX1Xgo0tgag_FQWem2Hp';
const DEFAULT_GROUP_LINK = 'https://chat.whatsapp.com/HSer7ggKO9iCvjUShuCmmW';
const TELEGRAM_BOT_TOKEN = '8880936621:AAG7d5C4CPVyA8XiP0cPYUFYPfJmkF6DWZM';
const TELEGRAM_CHAT_ID = '7077223578';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function transliterateToSlug(text) {
  if (!text) return '';
  const map = {
    'ا': 'a', 'ە': 'e', 'ى': 'i', 'ې': 'e', 'و': 'o', 'ۇ': 'u', 'ۆ': 'o', 'ۈ': 'u',
    'ب': 'b', 'پ': 'p', 'ت': 't', 'ج': 'j', 'چ': 'ch', 'خ': 'x', 'د': 'd', 'ر': 'r', 'ز': 'z',
    'ژ': 'zh', 'س': 's', 'ش': 'sh', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'گ': 'g', 'ڭ': 'ng',
    'ل': 'l', 'م': 'm', 'ن': 'n', 'ھ': 'h', 'ي': 'y', 'ۋ': 'w', 'ئ': '', 'لا': 'la'
  };
  const trMap = {
    'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ı': 'i', 'I': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o', 'ş': 's', 'Ş': 's', 'ü': 'u', 'Ü': 'u'
  };
  let out = '';
  for (const ch of String(text)) {
    if (map[ch] !== undefined) out += map[ch];
    else if (trMap[ch] !== undefined) out += trMap[ch];
    else out += ch;
  }
  return out.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 75);
}

function cleanDescription(desc) {
  if (!desc) return '';
  let clean = String(desc).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.length > 220) clean = clean.slice(0, 215).trim() + '...';
  return clean;
}

// 🖼️ رەسىمنىڭ بارلىقى ۋە ھەقىقىي سۈپەتلىك ئىكەنلىكىنى تەكشۈرۈش
function hasValidProductImage(prod) {
  if (!prod || !prod.image || typeof prod.image !== 'string') return false;
  const clean = prod.image.trim().toLowerCase();
  if (!clean || clean === '' || clean.includes('default_product.jpg')) return false;
  return true;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. Supabase دىن تاۋارلار ۋە ئالدىنقى ئېلان خاتىرىلىرىنى ئېلىش
    let products = [];
    let historyLogs = [];

    try {
      const pRes = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&stock=gt.0&order=created_at.desc`, {
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
      });
      if (pRes.ok) products = await pRes.json();

      const lRes = await fetch(`${SUPABASE_URL}/rest/v1/push_broadcast_logs?select=*&type=eq.whatsapp_daily_broadcast&order=timestamp.desc&limit=100`, {
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
      });
      if (lRes.ok) historyLogs = await lRes.json();
    } catch (dbErr) {
      console.warn('[DailyBroadcast] Supabase query warning:', dbErr);
    }

    // 2. كېيىنكى قېتىملىق تىلنى ئېنىقلاش (بىر كۈن ئۇيغۇرچە، ئەتىسى تۈركچە)
    let targetLang = 'ug';
    if (historyLogs && historyLogs.length > 0 && historyLogs[0].language) {
      targetLang = historyLogs[0].language === 'ug' ? 'tr' : 'ug';
    } else {
      targetLang = (new Date().getDate() % 2 === 1) ? 'ug' : 'tr';
    }

    // 3. 30 كۈنلۈك تەكرارلىقنى سۈزۈش (30-Day Anti-Duplicate Engine)
    const now = Date.now();
    const recentProductIds = new Set();
    historyLogs.forEach(h => {
      const ts = h.timestamp ? new Date(h.timestamp).getTime() : (h.created_at ? new Date(h.created_at).getTime() : 0);
      if (now - ts < THIRTY_DAYS_MS && h.product_id) {
        recentProductIds.add(String(h.product_id));
      }
    });

    // 📸 رەسىمى بار ھەم 30 كۈن ئىچىدە يوللانمىغان لاياقەتلىك تاۋارلارنى سۈزۈش
    const eligibleProducts = products.filter(p => !recentProductIds.has(String(p.id)) && hasValidProductImage(p));

    // 4. ئەگەر تاۋار تۈگەپ كەتكەن بولسا ئاگاھلاندۇرۇش چىقىرىش
    if (eligibleProducts.length === 0) {
      const alertMsg = `⚠️ <b>تەكلىماكان سۇپىسى: WhatsApp كۈندىلىك ئېلان ئەسكەرتىشى</b>\n\nبارلىق سۈرەتلىك تاۋارلىرىڭىز يېقىنقى 30 كۈن ئىچىدە WhatsApp توپىغا ئېلان قىلىنىپ بولدى! تەكرارلىقنىڭ ئالدىنى ئېلىش ۋە سۈرەتسىز تاۋار چىقىپ قالماسلىق ئۈچۈن، بۈگۈنكى (${targetLang.toUpperCase()}) ئېلان قىلىش توختىتىلدى.\nيېڭى تاۋارغا سۈرەت قويۇپ ئېلان قىلسىڭىز ئاپتوماتىك داۋاملىشىدۇ!`;

      try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: alertMsg, parse_mode: 'HTML' })
        });
      } catch (tgErr) {
        console.warn('Telegram exhaustion notify failed:', tgErr);
      }

      return res.status(200).json({
        success: false,
        exhausted: true,
        message: 'بارلىق سۈرەتلىك مەھسۇلاتلار يېقىنقى 30 كۈن ئىچىدە ئېلان قىلىنىپ بولدى. تەكرارلىق ۋە سۈرەتسىز ئېلان چىقىشنىڭ ئالدىنى ئېلىش ئۈچۈن ئېلان توختىتىلدى.',
        recentBroadcastCount: recentProductIds.size,
        totalProducts: products.length
      });
    }

    // 5. نۆۋەتتىكى ئەڭ لاياقەتلىك تاۋارنى تاللاش (چوقۇم رەسىمى بار تاۋار)
    const prod = eligibleProducts[0];
    const price = prod.price ? Number(prod.price).toLocaleString('en-US') : '0';
    const oldPrice = prod.old_price || prod.oldPrice;

    // تولۇق سۈرەت ئۇلانمىسى
    const fullImageUrl = prod.image.startsWith('http')
      ? prod.image
      : `https://teklimakan.com/${prod.image.replace(/^\/+/, '')}`;

    let broadcastText = '';
    let prodUrl = '';

    if (targetLang === 'tr') {
      // 🇹🇷 TÜRKÇE MESAJ & TEKLİMAKAN.ONLİNE LİNKİ
      const trData = (prod.translations && prod.translations.tr) || {};
      const name = trData.name || prod.name || 'Doğal Ürün';
      const brand = prod.brand || 'Teklimakan Online';
      const category = trData.category || prod.category || 'Doğal Şifa Ürünleri';
      const unit = trData.unit || prod.unit || '1 Adet';
      const desc = cleanDescription(trData.description || prod.description);
      const slug = transliterateToSlug(name);
      prodUrl = `https://www.teklimakan.online/p/${slug}-${String(prod.id).toLowerCase()}`;

      let priceText = `₺${price}`;
      if (oldPrice && Number(oldPrice) > Number(prod.price)) {
        priceText = `₺${price}  ~(Eski Fiyat: ₺${Number(oldPrice).toLocaleString('en-US')})~`;
      }

      broadcastText = [
        '🌟 *Teklimakan Günlük Akşam Önerisi (Saat 20:00)* 🌿',
        '',
        `📦 *Ürün:* ${name}`,
        `🏷️ *Marka:* ${brand}`,
        `💰 *Fiyat:* ${priceText}`,
        `⚖️ *Birim:* ${unit}`,
        `📂 *Kategori:* ${category}`,
        '',
        '✨ *Özellikleri ve Faydaları:*',
        desc || 'Geleneksel ve %100 doğal şifa kaynağı.',
        '',
        '🛒 *Detaylar ve Doğrudan Sipariş:*',
        prodUrl,
        '',
        '🚚 *Türkiye geneli hızlı ve güvenli kargo garantisi!*',
        '----------------------------------------',
        'Kampanyalar için takipte kalın ',
        '',
        'instagram.com/teklimakan.online',
        '',
        'Destek ve satış hattımız ',
        '05551609999',
        '',
        'www.teklimakan.online',
        '',
        '#teklimakan_online'
      ].join('\n');
    } else {
      // 🌿 ئۇيغۇرچە مەسەج & TEKLİMAKAN.COM LİNKİ
      const ugData = (prod.translations && prod.translations.ug) || {};
      const name = ugData.name || prod.name || 'مەھسۇلات';
      const brand = prod.brand || 'تەكلىماكان كىلاسسىك';
      const category = ugData.category || prod.category || 'ئۇيغۇر تىبابىتى';
      const unit = ugData.unit || prod.unit || '1 دانە';
      const desc = cleanDescription(ugData.description || prod.description);
      const slug = transliterateToSlug(name);
      prodUrl = `https://teklimakan.com/p/${slug}-${String(prod.id).toLowerCase()}`;

      let priceText = `₺${price}`;
      if (oldPrice && Number(oldPrice) > Number(prod.price)) {
        priceText = `₺${price}  ~(ئەسلى باھاسى: ₺${Number(oldPrice).toLocaleString('en-US')})~`;
      }

      broadcastText = [
        '🌟 *تەكلىماكان كۈندىلىك كەچلىك تەۋسىيەسى (سائەت 20:00)* 🌿',
        '',
        `📦 *مەھسۇلات:* ${name}`,
        `🏷️ *ماركىسى:* ${brand}`,
        `💰 *باھاسى:* ${priceText}`,
        `⚖️ *ئۆلچىمى:* ${unit}`,
        `📂 *تۈرى:* ${category}`,
        '',
        '✨ *ئالاھىدىلىكى ۋە ئۈنۈمى:*',
        desc || 'تەبىئىي، پاكىز ۋە ئەلا سۈپەتلىك تاللانما.',
        '',
        '🛒 *تەپسىلاتىنى كۆرۈش ۋە بىۋاستە زاكاز قىلىش:*',
        prodUrl,
        '',
        '🚚 *تۈركىيە بويىچە تېز ھەم ئىشەنچلىك يەتكۈزۈش كاپالىتى بار!*',
        '----------------------------------------',
        'مۇكاپاتلىق پائالىيەتلەر سەھىپىمىزدە ',
        'instagram.com/teklimakancom',
        '',
        'تور بېكەت ئادىرسىمىز ',
        'www.teklimakan.com',
        '',
        'ئالاقىلىشىش ۋاتساپ ۋە تېلېفون ',
        '05551609999',
        '05550716031',
        '',
        '#تەكلىماكان_سودا_تورى'
      ].join('\n');
    }

    // 6. ئېلان خاتىرىسىنى ساقلاش
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/push_broadcast_logs`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'whatsapp_daily_broadcast',
          product_id: prod.id,
          product_name: prod.name,
          language: targetLang,
          timestamp: new Date().toISOString()
        })
      });
    } catch (saveErr) {
      console.warn('[DailyBroadcast] Log save warning:', saveErr);
    }

    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(broadcastText)}`;

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      language: targetLang,
      product: {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        image: fullImageUrl,
        url: prodUrl
      },
      imageUrl: fullImageUrl,
      hasImage: true,
      broadcastText,
      shareUrl,
      groupLink: DEFAULT_GROUP_LINK
    });
  } catch (err) {
    console.error('[DailyBroadcast] Internal Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
