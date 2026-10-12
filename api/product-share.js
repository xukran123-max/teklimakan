const SUPABASE_URL = 'https://hvvxnnnpukgpmwexcniq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_PGV3YrYULBIiX1Xgo0tgag_FQWem2Hp';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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

module.exports = async function handler(req, res) {
  try {
    const rawSlug = req.query.slug || '';
    const rawId = req.query.id || req.query.product || req.query.prd || req.query.p || '';
    const lang = (req.query.lang || 'ug').toLowerCase();

    // 🛡️ Always use canonical non-www domain to avoid 307 redirects breaking WhatsApp crawler
    const host = (req.headers['x-forwarded-host'] || req.headers.host || 'teklimakan.com').replace(/^www\./i, '');
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const baseUrl = `${protocol}://${host}`;

    let identifier = (rawSlug || rawId || '').trim().replace(/\.(jpg|jpeg|png|webp)$/i, '');
    if (!identifier) {
      return res.redirect(302, `${baseUrl}/`);
    }

    // Try extracting PRD-xxx from slug or identifier
    let cleanId = '';
    const prdMatch = identifier.match(/prd-\d+/i);
    if (prdMatch) {
      cleanId = prdMatch[0].toUpperCase();
    } else if (/^\d+$/.test(identifier)) {
      cleanId = `PRD-${identifier}`;
    }

    // Fetch product details from Supabase
    let product = null;
    try {
      if (cleanId) {
        const queryUrl = `${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(cleanId)}&select=*&limit=1`;
        const response = await fetch(queryUrl, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        if (response.ok) {
          const rows = await response.json();
          if (rows && rows.length > 0) product = rows[0];
        }
      }

      // If not found by cleanId, attempt lookup by translations->>slug
      if (!product && identifier) {
        const queryUrl = `${SUPABASE_URL}/rest/v1/products?translations->>slug=eq.${encodeURIComponent(identifier)}&select=*&limit=1`;
        const response = await fetch(queryUrl, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        if (response.ok) {
          const rows = await response.json();
          if (rows && rows.length > 0) {
            product = rows[0];
            cleanId = product.id;
          }
        }
      }

      // Fallback: search products and match transliterated title or slug
      if (!product && identifier) {
        const queryUrl = `${SUPABASE_URL}/rest/v1/products?select=*&limit=100`;
        const response = await fetch(queryUrl, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        if (response.ok) {
          const rows = await response.json();
          if (Array.isArray(rows)) {
            const found = rows.find(r => {
              if (r.id && r.id.toLowerCase() === identifier.toLowerCase()) return true;
              if (r.translations && r.translations.slug && r.translations.slug.toLowerCase() === identifier.toLowerCase()) return true;
              const slugGen = transliterateToSlug(r.name);
              return slugGen && slugGen.toLowerCase() === identifier.toLowerCase();
            });
            if (found) {
              product = found;
              cleanId = product.id;
            }
          }
        }
      }
    } catch (e) {
      console.warn('Supabase fetch error:', e);
    }

    const finalId = product ? product.id : (cleanId || identifier);
    const prodSlug = (product && product.translations && product.translations.slug) ||
                     (product && product.slug) ||
                     transliterateToSlug(product ? product.name : '');
    const canonicalSlug = prodSlug ? `${prodSlug}-${finalId}` : finalId;
    const canonicalUrl = `${baseUrl}/p/${canonicalSlug}`;
    const targetUrl = `${baseUrl}/?id=${encodeURIComponent(finalId)}&lang=${encodeURIComponent(lang)}`;

    // Default metadata if product not found
    let title = 'تەكلىماكان سودا تورى — تەبىئىي، ساپ ۋە ئەلا سۈپەتلىك يەرلىك مەھسۇلاتلار';
    let desc = 'تەكلىماكان تور سۇپىسى: تەبىئىي پىننە گۈلقەنتى، مېۋە-چىۋە، قۇرۇق يەل-يېمىش ۋە ئىشەنچلىك مال سېتىۋېلىش مەركىزى.';
    let imageUrl = `${baseUrl}/images/share-cover-v2.jpg`;
    let imageMime = 'image/jpeg';

    if (product) {
      let name = product.name || '';
      let unit = '';
      let pDesc = product.description || '';

      if (product.translations && product.translations[lang]) {
        const tr = product.translations[lang];
        if (tr.name) name = tr.name;
        if (tr.unit) unit = tr.unit;
        if (tr.description) pDesc = tr.description;
      }
      if (!unit && product.translations && product.translations.unit) {
        unit = product.translations.unit;
      }

      const priceStr = product.price ? `${product.price} ₺` : '';
      const unitStr = unit ? ` / ${unit}` : '';
      const fullPriceStr = priceStr ? ` (${priceStr}${unitStr})` : '';

      title = `${name}${fullPriceStr} — تەكلىماكان سودا تورى`;
      desc = pDesc ? pDesc.slice(0, 250) : `تەكلىماكان تور سۇپىسىدا ${name} مەھسۇلاتى سېتىلماقتا. باھاسى: ${priceStr}.`;

      // 🖼️ Format direct image URL without any redirects
      const rawImg = product.image ? String(product.image).trim() : '';
      if (rawImg.startsWith('data:image/png')) {
        imageMime = 'image/png';
        imageUrl = `${baseUrl}/product-preview/${encodeURIComponent(product.id)}.png`;
      } else if (rawImg.startsWith('data:image/')) {
        imageMime = 'image/jpeg';
        imageUrl = `${baseUrl}/product-preview/${encodeURIComponent(product.id)}.jpg`;
      } else if (rawImg.startsWith('http://') || rawImg.startsWith('https://')) {
        imageUrl = rawImg;
        if (rawImg.endsWith('.png')) imageMime = 'image/png';
      } else if (rawImg) {
        const cleanPath = rawImg.replace(/^\/+/, '');
        imageUrl = `${baseUrl}/${cleanPath}`;
        if (cleanPath.endsWith('.png')) imageMime = 'image/png';
      } else {
        imageUrl = `${baseUrl}/images/share-cover-v2.jpg`;
      }
    }

    const safeTitle = escapeHtml(title);
    const safeDesc = escapeHtml(desc);
    const safeImageUrl = escapeHtml(imageUrl);
    const safeTargetUrl = escapeHtml(targetUrl);
    const safeCanonicalUrl = escapeHtml(canonicalUrl);
    const jsTargetUrl = targetUrl.replace(/'/g, "\\'");

    const html = `<!DOCTYPE html>
<html lang="${lang}" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>

  <!-- Open Graph / WhatsApp / Facebook / Telegram / Viber -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="تەكلىماكان سودا تورى">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:url" content="${safeCanonicalUrl}">
  <meta property="og:image" content="${safeImageUrl}">
  <meta property="og:image:secure_url" content="${safeImageUrl}">
  <meta property="og:image:type" content="${imageMime}">
  <meta property="og:image:width" content="600">
  <meta property="og:image:height" content="600">
  <meta property="og:image:alt" content="${safeTitle}">

  <!-- WhatsApp & Social Link Preview Helpers -->
  <link rel="image_src" href="${safeImageUrl}">
  <meta itemprop="image" content="${safeImageUrl}">
  <meta itemprop="name" content="${safeTitle}">
  <meta itemprop="description" content="${safeDesc}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDesc}">
  <meta name="twitter:image" content="${safeImageUrl}">

  <!-- Canonical link -->
  <link rel="canonical" href="${safeCanonicalUrl}">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="${baseUrl}/images/favicon.svg">

  <!-- Instant Browser Redirect for Real Users (No meta-refresh so bots parse OG tags) -->
  <script>
    window.location.replace('${jsTargetUrl}');
  </script>

  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #f8fafc;
      color: #1e293b;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 16px;
      box-sizing: border-box;
      direction: rtl;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      max-width: 420px;
      width: 100%;
      padding: 24px;
      text-align: center;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
    }
    .img-wrap {
      width: 180px;
      height: 180px;
      margin: 0 auto 16px;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      background: #f1f5f9;
    }
    .img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    h1 {
      font-size: 1.15rem;
      margin: 0 0 8px;
      color: #0f172a;
    }
    p {
      font-size: 0.9rem;
      color: #64748b;
      margin: 0 0 20px;
      line-height: 1.5;
    }
    .btn {
      display: inline-block;
      background: #2563eb;
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.95rem;
      transition: background 0.2s;
    }
    .btn:hover {
      background: #1d4ed8;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="img-wrap">
      <img src="${safeImageUrl}" alt="${safeTitle}">
    </div>
    <h1>${safeTitle}</h1>
    <p>${safeDesc}</p>
    <a href="${safeTargetUrl}" class="btn">🛒 تەكلىماكان سۇپىسىدا كۆرۈش</a>
  </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).send(html);
  } catch (err) {
    console.error('product-share error:', err);
    return res.redirect(302, 'https://teklimakan.com/');
  }
};
