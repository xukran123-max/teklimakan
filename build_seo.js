const fs = require('fs');
const https = require('https');
const path = require('path');

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

// 1. Create robots.txt
const robotsTxt = `# Robots.txt for https://teklimakan.com
# Googlebot & standard search engine crawlers

User-agent: *
Allow: /
Allow: /images/
Allow: /css/
Allow: /js/
Allow: /p/
Disallow: /seidiye
Disallow: /seidiye.html
Disallow: /admin
Disallow: /api/send-email
Disallow: /api/send-sms

# Sitemap Location
Sitemap: https://teklimakan.com/sitemap.xml
`;

fs.writeFileSync(path.join(__dirname, 'robots.txt'), robotsTxt, 'utf8');
console.log('✓ robots.txt generated successfully.');

// 2. Fetch products and create sitemap.xml
function fetchProducts() {
  return new Promise((resolve) => {
    const url = `${SUPABASE_URL}/rest/v1/products?select=id,name,category,created_at&limit=500`;
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
          console.error('JSON parse error:', e.message);
          resolve([]);
        }
      });
    }).on('error', (err) => {
      console.error('Fetch error:', err.message);
      resolve([]);
    });
  });
}

async function generateSitemap() {
  const products = await fetchProducts();
  const today = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- باش بەت (Homepage) -->
  <url>
    <loc>https://teklimakan.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

  // Categories
  const categories = [
    'ئۇيغۇر تىبابىتى',
    'تەييار دورىلار',
    'شىپالىق ئۆسۈملۈك',
    'تەبىئىي مايلار',
    'گۈزەللىك ۋە ساغلاملىق',
    'گۈلقەنتلەر',
    'قۇرۇق يەل-يېمىشلەر',
    'ئۇيغۇرچە كىيىملەر',
    'كىتاپ ۋە مەدەنىيەت'
  ];

  categories.forEach(cat => {
    xml += `  <!-- سەھىپە: ${cat} -->
  <url>
    <loc>https://teklimakan.com/?category=${encodeURIComponent(cat)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  // Products
  if (products && products.length > 0) {
    products.forEach(p => {
      if (!p.name || !p.id) return;
      const baseSlug = transliterateToSlug(p.name);
      const slug = baseSlug ? `${baseSlug}-${p.id.toLowerCase()}` : p.id.toLowerCase();
      const productUrl = `https://teklimakan.com/p/${slug}`;
      const lastmod = p.created_at ? p.created_at.split('T')[0] : today;

      xml += `  <url>
    <loc>${productUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });
  }

  xml += `</urlset>\n`;

  fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), xml, 'utf8');
  console.log(`✓ sitemap.xml generated with ${1 + categories.length + products.length} URLs.`);
}

generateSitemap();
