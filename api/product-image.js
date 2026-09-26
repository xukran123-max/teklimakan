const SUPABASE_URL = 'https://hvvxnnnpukgpmwexcniq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_PGV3YrYULBIiX1Xgo0tgag_FQWem2Hp';

module.exports = async function handler(req, res) {
  try {
    const rawId = req.query.id || req.query.product || req.query.prd || '';
    const id = String(rawId).trim();
    if (!id) {
      return res.redirect(302, 'https://www.teklimakan.com/images/og-share-cover.jpg');
    }

    const cleanId = id.replace(/^#/, '');
    const cleanIdWithPrefix = cleanId.startsWith('PRD-') ? cleanId : `PRD-${cleanId}`;

    // 1. Fetch product image from Supabase
    const queryUrl = `${SUPABASE_URL}/rest/v1/products?or=(id.eq.${encodeURIComponent(cleanId)},id.eq.${encodeURIComponent(cleanIdWithPrefix)})&select=id,image&limit=1`;
    const response = await fetch(queryUrl, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      return res.redirect(302, 'https://www.teklimakan.com/images/og-share-cover.jpg');
    }

    const rows = await response.json();
    if (!rows || rows.length === 0 || !rows[0].image) {
      return res.redirect(302, 'https://www.teklimakan.com/images/og-share-cover.jpg');
    }

    const img = rows[0].image.trim();

    // 2. Base64 data URL (extract mime and decode to binary buffer)
    if (img.startsWith('data:image/')) {
      const match = img.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const buffer = Buffer.from(match[2], 'base64');
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
        res.setHeader('Content-Length', buffer.length);
        return res.status(200).send(buffer);
      }
    }

    // 3. Absolute URL
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return res.redirect(302, img);
    }

    // 4. Relative file path (e.g. "images/products/PRD-103.jpg")
    const cleanPath = img.replace(/^\/+/, '');
    return res.redirect(302, `https://www.teklimakan.com/${cleanPath}`);
  } catch (err) {
    console.error('product-image error:', err);
    return res.redirect(302, 'https://www.teklimakan.com/images/og-share-cover.jpg');
  }
};
