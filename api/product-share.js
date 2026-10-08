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

module.exports = async function handler(req, res) {
  try {
    const rawId = req.query.id || req.query.product || req.query.prd || req.query.p || '';
    const id = String(rawId).trim().replace(/\.(jpg|jpeg|png|webp)$/i, '');
    const lang = (req.query.lang || 'ug').toLowerCase();

    // 🛡️ Always use canonical non-www domain to avoid 307 redirects breaking WhatsApp crawler
    const host = (req.headers['x-forwarded-host'] || req.headers.host || 'teklimakan.com').replace(/^www\./i, '');
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const baseUrl = `${protocol}://${host}`;

    const targetUrl = id 
      ? `${baseUrl}/?id=${encodeURIComponent(id)}&lang=${encodeURIComponent(lang)}`
      : `${baseUrl}/`;

    if (!id) {
      return res.redirect(302, targetUrl);
    }

    const cleanId = id.replace(/^#/, '').trim();
    const cleanIdWithPrefix = cleanId.startsWith('PRD-') ? cleanId : `PRD-${cleanId}`;

    // Fetch product details from Supabase
    let product = null;
    try {
      const queryUrl = `${SUPABASE_URL}/rest/v1/products?or=(id.eq.${encodeURIComponent(cleanId)},id.eq.${encodeURIComponent(cleanIdWithPrefix)})&select=*&limit=1`;
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
        }
      }
    } catch (e) {
      console.warn('Supabase fetch error:', e);
    }

    // Default metadata if product not found
    let title = 'تەكلىماكان سودا تورى — تەبىئىي، ساپ ۋە ئەلا سۈپەتلىك يەرلىك مەھسۇلاتلار';
    let desc = 'تەكلىماكان تور سۇپىسى: تەبىئىي پىننە گۈلقەنتى، مېۋە-چىۋە، قۇرۇق يەل-يېمىش ۋە ئىشەنچلىك مال سېتىۋېلىش مەركىزى.';
    let imageUrl = `${baseUrl}/images/og-share-cover.jpg`;
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
        imageUrl = `${baseUrl}/images/og-share-cover.jpg`;
      }
    }

    const safeTitle = escapeHtml(title);
    const safeDesc = escapeHtml(desc);
    const safeImageUrl = escapeHtml(imageUrl);
    const safeTargetUrl = escapeHtml(targetUrl);

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
  <meta property="og:url" content="${safeTargetUrl}">
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

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="${baseUrl}/images/favicon.svg">

  <!-- Instant Browser Redirect for Real Users (No meta-refresh so bots parse OG tags) -->
  <script>
    window.location.replace('${safeTargetUrl}');
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
