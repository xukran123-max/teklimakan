// ================================================================
// 🚀 تەكلىماكان سۇپىسى — كۈندىلىك كەچ سائەت 20:30 WhatsApp ئېلان مۇلازىمىتى
// Teklimakan Daily WhatsApp Broadcast Serverless Cron Handler
// ================================================================

const SUPABASE_URL = 'https://hvvxnnnpukgpmwexcniq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_PGV3YrYULBIiX1Xgo0tgag_FQWem2Hp';
const DEFAULT_GROUP_LINK = 'https://chat.whatsapp.com/HSer7ggKO9iCvjUShuCmmW';

function transliterateToSlug(text) {
  if (!text) return '';
  const map = {
    'ا': 'a', 'ە': 'e', 'ى': 'i', 'ې': 'e', 'و': 'o', 'ۇ': 'u', 'ۆ': 'o', 'ۈ': 'u',
    'ب': 'b', 'پ': 'p', 'ت': 't', 'ج': 'j', 'چ': 'ch', 'خ': 'x', 'د': 'd', 'ر': 'r', 'ز': 'z',
    'ژ': 'zh', 'س': 's', 'ش': 'sh', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'گ': 'g', 'ڭ': 'ng',
    'ل': 'l', 'م': 'm', 'ن': 'n', 'ھ': 'h', 'ي': 'y', 'ۋ': 'w', 'ئ': '', 'لا': 'la'
  };
  let out = '';
  for (const ch of String(text)) {
    if (map[ch] !== undefined) out += map[ch];
    else out += ch;
  }
  return out.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 75);
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. Supabase دىن ئەڭ يېڭى تەستىقلانغان تاۋارلارنى ئېلىش
    let products = [];
    try {
      const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&stock=gt.0&order=created_at.desc&limit=20`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (dbRes.ok) {
        products = await dbRes.json();
      }
    } catch (dbErr) {
      console.warn('[DailyBroadcast] Supabase fetch error:', dbErr);
    }

    // تاۋار تېپىلمىسا كۆز ئاسراش مەجۇنى ياكى تۇخۇم يېغى ئالدىنقى ئورۇندا
    let prod = products.find(p => p.id === 'PRD-226') || products[0] || {
      id: 'PRD-226',
      name: 'كۆز ئاسراش مەجۇنى (كۆز نۇرى مەلھىمى)',
      brand: 'تەكلىماكان تىبابىتى',
      price: 280,
      old_price: 350,
      unit: '1 قۇتا (250g ساپ مەلھەم)',
      category: 'ئۇيغۇر تىبابىتى',
      description: 'كۆز قۇرغاقلىشىش، چارچاش، تېلېفون نۇرىدىن كۆز سېزىمى تۆۋەنلەشنى تۈگىتىدۇ؛ كۆرۈش قۇۋۋىتىنى ئاشۇرىدۇ. %100 تەبىئىي.'
    };

    const name = prod.name || 'تەكلىماكان مەھسۇلاتى';
    const brand = prod.brand || 'تەكلىماكان كىلاسسىك';
    const price = prod.price ? Number(prod.price).toLocaleString('en-US') : '0';
    const oldPrice = prod.old_price || prod.oldPrice;
    const unit = prod.unit || '1 دانە';
    const slug = transliterateToSlug(name);
    const prodUrl = `https://teklimakan.com/p/${slug}-${String(prod.id).toLowerCase()}`;

    let priceText = `₺${price}`;
    if (oldPrice && Number(oldPrice) > Number(prod.price)) {
      priceText = `₺${price}  ~(ئەسلى باھاسى: ₺${Number(oldPrice).toLocaleString('en-US')})~`;
    }

    const broadcastText = [
      '🌟 *تەكلىماكان كۈندىلىك كەچلىك تەۋسىيەسى (سائەت 20:30)* 🌿',
      '',
      `📦 *مەھسۇلات:* ${name}`,
      `🏷️ *ماركىسى:* ${brand}`,
      `💰 *باھاسى:* ${priceText}`,
      `⚖️ *ئۆلچىمى:* ${unit}`,
      `📂 *تۈرى:* ${prod.category || 'ئۇيغۇر تىبابىتى'}`,
      '',
      '✨ *ئالاھىدىلىكى ۋە ئۈنۈمى:*',
      prod.description || 'تەبىئىي، ساغلام ۋە ئەلا سۈپەتلىك تاللانما.',
      '',
      '🛒 *تەپسىلاتىنى كۆرۈش ۋە بىۋاستە زاكاز قىلىش:*',
      prodUrl,
      '',
      '🚚 *تۈركىيە بويىچە تېز ھەم ئىشەنچلىك يەتكۈزۈش كاپالىتى بار!*',
      '----------------------------------------',
      '🎁 *مۇكاپاتلىق پائالىيەتلەر سەھىپىمىزدە:*',
      'instagram.com/teklimakancom',
      '',
      '🌐 *تور بېكەت ئادىرسىمىز:*',
      'www.teklimakan.com',
      '',
      '📞 *ئالاقىلىشىش ۋاتساپ ۋە تېلېفون:*',
      '05551609999',
      '05550716031',
      '',
      '#تەكلىماكان_سودا_تورى'
    ].join('\n');

    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(broadcastText)}`;

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      schedule: '20:30 (Europe/Istanbul)',
      product: {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        url: prodUrl
      },
      broadcastText,
      shareUrl,
      groupLink: DEFAULT_GROUP_LINK
    });
  } catch (err) {
    console.error('[DailyBroadcast] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
