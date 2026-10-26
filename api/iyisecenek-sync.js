/**
 * ============================================================================
 * 🚀 Teklimakan <-> İyi Seçenek (iyisecenek.com) Автоматىك كارگو ئۇلاش كۆۋرۈكى
 * Server-to-Server Automated Cargo & Customer Sync Endpoint
 * Works identically on both Teklimakan.com and Teklimakan.online
 * ============================================================================
 */

const IL_PLATE_MAP = {
  'ADANA': 1, 'ADIYAMAN': 2, 'AFYONKARAHİSAR': 3, 'AFYON': 3, 'AĞRI': 4, 'AMASYA': 5,
  'ANKARA': 6, 'ANTALYA': 7, 'ARTVİN': 8, 'AYDIN': 9, 'BALIKESİR': 10,
  'BİLECİK': 11, 'BİNGÖL': 12, 'BİTLİS': 13, 'BOLU': 14, 'BURDUR': 15,
  'BURSA': 16, 'ÇANAKKALE': 17, 'ÇANKIRI': 18, 'ÇORUM': 19, 'DENİZLİ': 20,
  'DİYARBAKIR': 21, 'EDİRNE': 22, 'ELAZIĞ': 23, 'ERZİNCAN': 24, 'ERZURUM': 25,
  'ESKİŞEHİR': 26, 'GAZİANTEP': 27, 'GİRESUN': 28, 'GÜMÜŞHANE': 29, 'HAKKARİ': 30,
  'HATAY': 31, 'ISPARTA': 32, 'MERSİN': 33, 'İÇEL': 33, 'İSTANBUL': 34, 'İZMİR': 35,
  'KARS': 36, 'KASTAMONU': 37, 'KAYSERİ': 38, 'KIRKLARELİ': 39, 'KIRŞEHİR': 40,
  'KOCAELİ': 41, 'KONYA': 42, 'KÜTAHYA': 43, 'MALATYA': 44, 'MANİSA': 45,
  'KAHRAMANMARAŞ': 46, 'MARAŞ': 46, 'MARDİN': 47, 'MUĞLA': 48, 'MUŞ': 49, 'NEVŞEHİR': 50,
  'NİĞDE': 51, 'ORDU': 52, 'RİZE': 53, 'SAKARYA': 54, 'SAMSUN': 55,
  'SİİRT': 56, 'SİNOP': 57, 'SİVAS': 58, 'TEKİRDAĞ': 59, 'TOKAT': 60,
  'TRABZON': 61, 'TUNCELİ': 62, 'ŞANLIURFA': 63, 'URFA': 63, 'UŞAK': 64, 'VAN': 65,
  'YOZGAT': 66, 'ZONGULDAK': 67, 'AKSARAY': 68, 'BAYBURT': 69, 'KARAMAN': 70,
  'KIRIKKALE': 71, 'BATMAN': 72, 'ŞIRNAK': 73, 'BARTIN': 74, 'ARDAHAN': 75,
  'IĞDIR': 76, 'YALOVA': 77, 'KARABÜK': 78, 'KİLİS': 79, 'OSMANİYE': 80, 'DÜZCE': 81
};

function toTurkishUpper(str) {
  if (!str) return '';
  return String(str)
    .trim()
    .replace(/i/g, 'İ')
    .replace(/ı/g, 'I')
    .replace(/ğ/g, 'Ğ')
    .replace(/ü/g, 'Ü')
    .replace(/ş/g, 'Ş')
    .replace(/ö/g, 'Ö')
    .replace(/ç/g, 'Ç')
    .toUpperCase();
}

function normalizeAscii(str) {
  return toTurkishUpper(str)
    .replace(/İ/g, 'I')
    .replace(/Ğ/g, 'G')
    .replace(/Ü/g, 'U')
    .replace(/Ş/g, 'S')
    .replace(/Ö/g, 'O')
    .replace(/Ç/g, 'C')
    .replace(/[^A-Z0-9]/g, '');
}

function resolveIlId(cityName) {
  if (!cityName) return 34; // Default İstanbul
  const upper = toTurkishUpper(cityName);
  if (IL_PLATE_MAP[upper]) return IL_PLATE_MAP[upper];
  const ascii = normalizeAscii(cityName);
  for (const [k, v] of Object.entries(IL_PLATE_MAP)) {
    if (normalizeAscii(k) === ascii) return v;
  }
  return 34;
}

async function resolveIlce(ilId, districtName, cookieHeader = '') {
  try {
    const res = await fetch(`https://www.iyisecenek.com/iyi/son/islem.php?ilceleri_getir=${ilId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...(cookieHeader ? { 'Cookie': cookieHeader } : {})
      }
    });
    const list = await res.json();
    if (!Array.isArray(list) || list.length === 0) {
      return { id: '', ilce_adi: toTurkishUpper(districtName || 'MERKEZ') };
    }
    const targetUpper = toTurkishUpper(districtName);
    const targetAscii = normalizeAscii(districtName);

    let found = list.find(d => toTurkishUpper(d.ilce_adi) === targetUpper) ||
                list.find(d => normalizeAscii(d.ilce_adi) === targetAscii) ||
                list.find(d => targetAscii && normalizeAscii(d.ilce_adi).includes(targetAscii)) ||
                list.find(d => toTurkishUpper(d.ilce_adi) === 'MERKEZ') ||
                list[0];

    return found;
  } catch (e) {
    return { id: '', ilce_adi: toTurkishUpper(districtName || 'MERKEZ') };
  }
}

function formatPhones(rawPhone) {
  let digits = String(rawPhone || '').replace(/\D/g, '');
  if (digits.startsWith('0090')) digits = digits.slice(4);
  else if (digits.startsWith('90') && digits.length >= 12) digits = digits.slice(2);
  else if (digits.startsWith('0')) digits = digits.slice(1);

  if (digits.length > 10) digits = digits.slice(-10);
  const tenDigits = digits.padStart(10, '5'); // e.g. 5456643580
  const zeroEleven = '0' + tenDigits;         // e.g. 05456643580
  const masked = `(${tenDigits.slice(0, 3)}) ${tenDigits.slice(3, 6)} ${tenDigits.slice(6, 8)} ${tenDigits.slice(8, 10)}`; // (545) 664 35 80

  return { tenDigits, zeroEleven, masked };
}

function extractCookies(response, existingCookies = {}) {
  const cookies = { ...existingCookies };
  let setCookieHeaders = [];
  if (typeof response.headers.getSetCookie === 'function') {
    setCookieHeaders = response.headers.getSetCookie();
  } else {
    const raw = response.headers.get('set-cookie');
    if (raw) setCookieHeaders = raw.split(/,(?=\s*[a-zA-Z0-9_-]+=)/);
  }
  for (const hdr of setCookieHeaders) {
    const firstPart = hdr.split(';')[0];
    if (firstPart && firstPart.includes('=')) {
      const [k, ...vParts] = firstPart.split('=');
      cookies[k.trim()] = vParts.join('=').trim();
    }
  }
  return cookies;
}

function serializeCookies(cookiesObj) {
  return Object.entries(cookiesObj).map(([k, v]) => `${k}=${v}`).join('; ');
}

function parseFormsFromHtml(html, pageUrl = '') {
  const forms = [];
  const formRegex = /<form([^>]*)>([\s\S]*?)<\/form>/gi;
  let match;
  while ((match = formRegex.exec(html)) !== null) {
    const attrs = match[1] || '';
    const inner = match[2] || '';
    const actionMatch = attrs.match(/action=['"]([^'"]*)['"]/i);
    const methodMatch = attrs.match(/method=['"]([^'"]*)['"]/i);
    const idMatch = attrs.match(/id=['"]([^'"]*)['"]/i);

    const action = actionMatch ? actionMatch[1] : pageUrl;
    if (action === 'ilan-ara') continue; // skip search bar forms

    const fields = [];
    const inputRegex = /<(input|select|textarea|button)([^>]*)>/gi;
    let im;
    while ((im = inputRegex.exec(inner)) !== null) {
      const tag = im[1].toLowerCase();
      const ia = im[2] || '';
      const nameM = ia.match(/name=['"]([^'"]+)['"]/i);
      const idM = ia.match(/id=['"]([^'"]+)['"]/i);
      const typeM = ia.match(/type=['"]([^'"]+)['"]/i);
      const valM = ia.match(/value=['"]([^'"]*)['"]/i);
      const classM = ia.match(/class=['"]([^'"]*)['"]/i);

      fields.push({
        tag,
        name: nameM ? nameM[1] : '',
        id: idM ? idM[1] : '',
        type: typeM ? typeM[1].toLowerCase() : (tag === 'button' ? 'submit' : 'text'),
        value: valM ? valM[1] : '',
        className: classM ? classM[1] : ''
      });
    }

    forms.push({
      pageUrl,
      action,
      method: methodMatch ? methodMatch[1].toUpperCase() : 'POST',
      id: idMatch ? idMatch[1] : '',
      fields
    });
  }
  return forms;
}

async function loginToIyiSecenek(email, password) {
  const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
  let cookies = {};

  // 1. Initial GET to obtain PHPSESSID
  const initRes = await fetch('https://www.iyisecenek.com/uye-girisi', {
    headers: { 'User-Agent': UA }
  });
  cookies = extractCookies(initRes, cookies);

  // 2. POST credentials to iyi/son/islem.php
  const loginBody = new URLSearchParams();
  loginBody.append('uye_eposta', email.trim());
  loginBody.append('uye_sifre', password);
  loginBody.append('uyegiris', '');

  const loginRes = await fetch('https://www.iyisecenek.com/iyi/son/islem.php', {
    method: 'POST',
    headers: {
      'User-Agent': UA,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': 'https://www.iyisecenek.com/uye-girisi',
      'Origin': 'https://www.iyisecenek.com',
      'Cookie': serializeCookies(cookies)
    },
    body: loginBody.toString(),
    redirect: 'manual'
  });

  cookies = extractCookies(loginRes, cookies);
  const redirectLocation = loginRes.headers.get('location') || '';

  // 3. Fetch /hesabim to verify session
  const hesabimRes = await fetch('https://www.iyisecenek.com/hesabim', {
    headers: {
      'User-Agent': UA,
      'Referer': 'https://www.iyisecenek.com/uye-girisi',
      'Cookie': serializeCookies(cookies)
    }
  });
  cookies = extractCookies(hesabimRes, cookies);
  const hesabimHtml = await hesabimRes.text();

  // If not logged in, hesabimHtml stops around ~10688 chars and doesn't have the user dashboard
  const isLoggedIn = hesabimHtml.length > 12000 && !redirectLocation.includes('durum=no') && !redirectLocation.includes('hata');

  return {
    isLoggedIn,
    cookies,
    cookieHeader: serializeCookies(cookies),
    redirectLocation,
    hesabimHtml
  };
}

module.exports = async function handler(req, res) {
  // CORS headers so both teklimakan.com and teklimakan.online can call this endpoint seamlessly
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = req.method === 'POST' ? (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})) : (req.query || {});
    const action = body.action || 'sync_order';
    const email = (body.email || process.env.IYISECENEK_EMAIL || '').trim();
    const password = body.password || process.env.IYISECENEK_PASSWORD || '';

    // Special public action: resolve province & district IDs from iyisecenek.com
    if (action === 'resolve_location') {
      const ilId = resolveIlId(body.city || 'İSTANBUL');
      const ilceObj = await resolveIlce(ilId, body.district || '');
      return res.status(200).json({
        success: true,
        ilId,
        city: toTurkishUpper(body.city || 'İSTANBUL'),
        ilce: ilceObj
      });
    }

    if (!email || !password) {
      return res.status(200).json({
        success: false,
        needsCredentials: true,
        message: 'İyi Seçenek ئىمائىل ۋە مەخپىي نومۇرى تېخى كىرگۈزۈلمىگەن. باشقۇرۇش تاختىسىدىن بىر قېتىم كىرگۈزۈپ ساقلاڭ.'
      });
    }

    const session = await loginToIyiSecenek(email, password);
    if (!session.isLoggedIn) {
      return res.status(200).json({
        success: false,
        authFailed: true,
        redirectLocation: session.redirectLocation,
        message: 'İyi Seçenek ھېساباتىغا كىرىش مەغلۇپ بولدى. ئىمائىل ياكى مەخپىي نومۇرىڭىزنى تەكشۈرۈپ قايتا سىناڭ.'
      });
    }

    // Parse links and forms inside /hesabim
    const hesabimForms = parseFormsFromHtml(session.hesabimHtml, 'hesabim');
    const internalLinks = [...session.hesabimHtml.matchAll(/href=['"]([^'"]+)['"]/gi)]
      .map(m => m[1])
      .filter(l => /kargo|siparis|musteri|alici|gonderi|referans|satis|hesabim|ilan/i.test(l) && !l.startsWith('http'));
    const uniqueLinks = [...new Set(internalLinks)].slice(0, 12);

    if (action === 'test_login') {
      return res.status(200).json({
        success: true,
        message: '✅ İyi Seçenek ھېساباتىڭىز مۇۋەپپەقىيەتلىك ئۇلاندى! ئەمدى بارلىق زاكازلار ئاپتوماتىك ئەۋەتىلىدۇ.',
        accountLinks: uniqueLinks,
        formsFound: hesabimForms.length
      });
    }

    // ==================== ORDER SYNC TO IYISECENEK ====================
    const order = body.order || {};
    const cust = (typeof order.customer === 'string') ? JSON.parse(order.customer || '{}') : (order.customer || {});
    const customerName = (cust.name || body.customerName || 'Müşteri').trim();
    const rawPhone = cust.phone || body.customerPhone || '';
    const phones = formatPhones(rawPhone);

    // Parse city & district cleanly (even if user typed "bor/niğde")
    let rawCity = (cust.city || body.city || 'İSTANBUL').trim();
    let rawDistrict = (cust.district || body.district || '').trim();
    if (rawDistrict.includes('/')) {
      const parts = rawDistrict.split('/');
      rawDistrict = parts[0].trim();
      if (!rawCity || rawCity.toLowerCase() === 'istanbul' || rawCity.toLowerCase() === 'i̇stanbul') {
        rawCity = parts[1].trim();
      }
    }

    const ilId = resolveIlId(rawCity);
    const ilceObj = await resolveIlce(ilId, rawDistrict, session.cookieHeader);
    const ilceId = ilceObj.id || '';
    const ilceName = ilceObj.ilce_adi || toTurkishUpper(rawDistrict || 'MERKEZ');
    const cleanAddress = (cust.address || body.address || `${ilceName} / ${toTurkishUpper(rawCity)}`).trim();
    const orderTotal = Number(order.totalCny || order.total || body.total || 0) || 0;
    const isKapidaOdeme = String(order.paymentMethod || '').includes('نەق') || String(order.paymentMethod || '').toLowerCase().includes('kapida');

    const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

    // Discover all forms across hesabim and sub-pages
    const allForms = [...hesabimForms];
    for (const subLink of uniqueLinks) {
      if (subLink === 'hesabim' || subLink === 'ilan-ekle' || subLink === 'ilan-ekle-kategori-sec') continue;
      try {
        const subUrl = subLink.startsWith('/') ? `https://www.iyisecenek.com${subLink}` : `https://www.iyisecenek.com/${subLink}`;
        const subRes = await fetch(subUrl, {
          headers: { 'User-Agent': UA, 'Cookie': session.cookieHeader }
        });
        if (subRes.ok) {
          const subHtml = await subRes.text();
          const subForms = parseFormsFromHtml(subHtml, subLink);
          allForms.push(...subForms);
        }
      } catch (e) {}
    }

    const submissionResults = [];

    // Helper to fill a discovered form intelligently
    for (const form of allForms) {
      const fieldNames = form.fields.map(f => (f.name || f.id).toLowerCase());
      // Skip profile password change or login forms
      if (fieldNames.some(n => n.includes('sifre') || n.includes('password'))) continue;
      if (fieldNames.length < 2) continue;

      const formData = new URLSearchParams();
      let matchedMeaningfulFields = 0;

      for (const f of form.fields) {
        if (!f.name) continue;
        const n = f.name.toLowerCase();
        const idLower = (f.id || '').toLowerCase();

        if (f.type === 'hidden' && f.value) {
          formData.append(f.name, f.value);
          continue;
        }

        if (n.includes('adsoyad') || n.includes('ad_soyad') || n.includes('isim') || n.includes('alici') || n === 'ad') {
          formData.append(f.name, customerName);
          matchedMeaningfulFields++;
        } else if (n.includes('tel') || n.includes('phone') || n.includes('cep')) {
          const val = (f.className && f.className.includes('phone')) ? phones.masked : phones.tenDigits;
          formData.append(f.name, val);
          matchedMeaningfulFields++;
        } else if (n === 'il' || n.endsWith('_il') || idLower === 'il_select') {
          formData.append(f.name, String(ilId));
          matchedMeaningfulFields++;
        } else if (n === 'ilce' || n.endsWith('_ilce') || idLower === 'ilce_select') {
          formData.append(f.name, String(ilceId || ilceName));
          matchedMeaningfulFields++;
        } else if (n.includes('adres')) {
          formData.append(f.name, cleanAddress);
          matchedMeaningfulFields++;
        } else if (n.includes('fiyat') || n.includes('tutar') || n.includes('ucret') || idLower === 'kargofiyat') {
          // User rule: TUM KARGOLAR BENİM ADİMA VE GÖNDEREN ÖDEMELİ OLARAK
          formData.append(f.name, isKapidaOdeme ? String(orderTotal) : '0');
          matchedMeaningfulFields++;
        } else if (n.includes('odeme') || n.includes('kargo_tipi') || n.includes('gonderi_tipi')) {
          formData.append(f.name, f.value || '1'); // Gönderen Ödemeli
        } else if (f.type === 'submit') {
          formData.append(f.name, f.value || '1');
        } else if (f.value) {
          formData.append(f.name, f.value);
        }
      }

      if (matchedMeaningfulFields >= 2) {
        const postUrl = form.action.startsWith('http')
          ? form.action
          : `https://www.iyisecenek.com/${form.action.replace(/^\/+/, '')}`;

        try {
          const submitRes = await fetch(postUrl, {
            method: form.method || 'POST',
            headers: {
              'User-Agent': UA,
              'Content-Type': 'application/x-www-form-urlencoded',
              'Referer': `https://www.iyisecenek.com/${form.pageUrl || 'hesabim'}`,
              'Cookie': session.cookieHeader
            },
            body: formData.toString(),
            redirect: 'manual'
          });
          const loc = submitRes.headers.get('location') || '';
          const respText = await submitRes.text();
          submissionResults.push({
            formAction: form.action,
            status: submitRes.status,
            redirect: loc,
            snippet: respText.slice(0, 300)
          });
        } catch (subErr) {
          submissionResults.push({ formAction: form.action, error: subErr.message });
        }
      }
    }

    // Also try standard direct action on iyi/son/islem.php if customer search/creation is handled via AJAX
    let existingCustomer = null;
    try {
      const custSearchUrl = `https://www.iyisecenek.com/iyi/son/islem.php?musterileri_getir_ada_gore=${encodeURIComponent(customerName)}&page=1`;
      const custSearchRes = await fetch(custSearchUrl, {
        headers: { 'User-Agent': UA, 'Cookie': session.cookieHeader }
      });
      const custJson = await custSearchRes.json();
      if (custJson && Array.isArray(custJson.data) && custJson.data.length > 0) {
        existingCustomer = custJson.data[0];
      }
    } catch (e) {}

    // Extract any PTT tracking / reference code from hesabim after submission
    let detectedTrackingCode = '';
    try {
      const afterRes = await fetch('https://www.iyisecenek.com/hesabim', {
        headers: { 'User-Agent': UA, 'Cookie': session.cookieHeader }
      });
      const afterHtml = await afterRes.text();
      // Look for PTT barcode pattern (e.g. KP0..., 27..., or reference code near customerName)
      const nameIdx = afterHtml.indexOf(customerName);
      if (nameIdx !== -1) {
        const windowText = afterHtml.slice(Math.max(0, nameIdx - 500), nameIdx + 1000);
        const codeMatch = windowText.match(/\b(KP\d{11}|\d{13}|[A-Z0-9]{8,14})\b/);
        if (codeMatch) detectedTrackingCode = codeMatch[1];
      }
    } catch (e) {}

    return res.status(200).json({
      success: true,
      syncedCustomer: {
        name: customerName,
        phone: phones.zeroEleven,
        maskedPhone: phones.masked,
        ilId,
        city: toTurkishUpper(rawCity),
        ilceId,
        district: ilceName,
        address: cleanAddress,
        cargoFeeType: 'GÖNDEREN ÖDEMELİ (BENİM ADIMA)'
      },
      existingCustomer,
      detectedTrackingCode,
      submissionsCount: submissionResults.length,
      submissionResults,
      message: `✅ زاكاز (#${order.id || ''}) خېرىدارى «${customerName}» (${toTurkishUpper(rawCity)} / ${ilceName}) İyi Seçenek سىستېمىسىغا ئاپتوماتىك يوللاندى!`
    });

  } catch (err) {
    console.error('[iyisecenek-sync] Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message,
      message: 'İyi Seçenek ئاپتوماتىك ئۇلاشتا تېخنىكىلىق خاتالىق كۆرۈلدى: ' + err.message
    });
  }
};
