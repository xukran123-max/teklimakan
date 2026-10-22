const https = require('https');

const SUPABASE_URL = 'https://hvvxnnnpukgpmwexcniq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_PGV3YrYULBIiX1Xgo0tgag_FQWem2Hp';

function transliterateToSlug(text) {
  if (!text) return '';
  const map = {
    'ا': 'a', 'ە': 'e', 'ى': 'i', 'ې': 'e', 'و': 'o', 'ۇ': 'u', 'ۆ': 'o', 'ۈ': 'u',
    'ب': 'b', 'پ': 'p', 'ت': 't', 'ج': 'j', 'چ': 'ch', 'خ': 'x', 'د': 'd', 'ر': 'r', 'ز': 'z',
    'ژ': 'zh', 'س': 's', 'ش': 'sh', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'گ': 'g', 'ڭ': 'ng',
    'ل': 'l', 'م': 'm', 'ن': 'n', 'ھ': 'h', 'ي': 'y', 'ۋ': 'w', 'ئ': '', 'لا': 'la',
    '،': '-', '؛': '-', '؟': '', '–': '-', '—': '-'
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
  return out.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\-_\s]/g, '')
    .trim()
    .replace(/[\s\-_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function fetchProductsFromSupabase() {
  return new Promise((resolve) => {
    const url = `${SUPABASE_URL}/rest/v1/products?select=id,name,category,created_at&limit=1000`;
    const options = {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(Array.isArray(json) ? json : []);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

module.exports = async (req, res) => {
  try {
    const products = await fetchProductsFromSupabase();
    const today = new Date().toISOString().split('T')[0];

    const categories = [
      'ئۇيغۇر تىبابىتى',
      'تەييار دورىلار',
      'شىپالىق ئۆسۈملۈك',
      'تەبىئىي ياغلار',
      'گۈزەللىك ۋە ساغلاملىق',
      'گۈلقەنتلەر',
      'قۇرۇق يەل-يېمىشلەر',
      'ئۇيغۇرچە كىيىملەر',
      'كىتاپ ۋە مەدەنىيەت'
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // باش بەت (Homepage)
    xml += `  <url>\n`;
    xml += `    <loc>https://teklimakan.com/</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;

    // سەھىپىلەر
    for (const cat of categories) {
      xml += `  <url>\n`;
      xml += `    <loc>https://teklimakan.com/?category=${encodeURIComponent(cat)}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    // بارلىق مەھسۇلاتلار (دەل ۋاقتىدا قوشۇلغان ھەرقانداق يېڭى تاۋارلار)
    for (const p of products) {
      if (!p.id || !p.name) continue;
      const baseSlug = transliterateToSlug(p.name);
      const slug = baseSlug ? `${baseSlug}-${p.id.toLowerCase()}` : p.id.toLowerCase();
      const productUrl = `https://teklimakan.com/p/${slug}`;
      const lastmod = p.created_at ? p.created_at.split('T')[0] : today;

      xml += `  <url>\n`;
      xml += `    <loc>${productUrl}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>\n`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400');
    return res.status(200).send(xml);
  } catch (err) {
    return res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
};
