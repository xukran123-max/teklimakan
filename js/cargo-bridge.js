/**
 * 📦 تەكلىماكان كەسپىي كارگو كۆۋرۈكى ۋە PTT Kargo / İyi Seçenek قورالى
 * Teklimakan Cargo Bridge & PTT Kargo Integration Module
 * 
 * 🔒 مەخپىيەتلىك كاپالىتى (Invisible Middleman):
 * خېرىدارغا «İyi Seçenek» ھەرگىز كۆرۈنمەيدۇ. پۈتۈن ئۇقتۇرۇش، تاۋار بەلگىسى (Fiş)،
 * ئىز قوغلاش تور بېتى ۋە WhatsApp ئۇچۇرلىرى 100% رەسمىي «تەكلىماكان» ۋە «PTT Kargo» ماركىسىدا بولىدۇ.
 * 
 * 📱 تېلېفون ئالدىنقى ئورۇندا (Mobile-First):
 * بارلىق ئۇچۇرلارنى بىر چەكمە بىلەن تولۇق ياكى ئايرىم كۆچۈرۈش (1-Tap Copy)،
 * ئاپتوماتىك تېلېفون نومۇرى پىششىقلاش (05xxxxxxxxx)،
 * نەق پۇل قاپىدا ئۆدەمە ھېسابلاش، 10x15cm ئۆلچەملىك ئىسسىقلىق پرىنتېر بەلگىسى (Fiş / Etiket).
 */

(function(window) {
  'use strict';

  // ==================== 1. ئۆلچەملىك Code 128 بالداق كود (Barcode) ھاسىللىغۇچ ====================
  const CODE128_PATTERNS = [
    '212222','222122','222221','121223','121322','131222','122213','122312','132212','221213',
    '221312','231212','112232','122132','122231','113222','123122','123221','223211','221132',
    '221231','213212','223112','312131','311222','321122','321221','312212','322112','322211',
    '212123','212321','232121','111323','131123','131321','112313','132113','132311','211313',
    '231113','231311','112133','112331','132131','113123','113321','133121','313121','211331',
    '231131','213113','213311','213131','311123','311321','331121','312113','312311','332111',
    '314111','221411','431111','111224','111422','121124','121421','141122','141221','112214',
    '112412','122114','122411','142112','142211','241211','221114','413111','241112','134111',
    '111242','121142','121241','114212','124112','124211','411212','421112','421211','212141',
    '214121','412121','111143','111341','131141','114113','114311','411113','411311','113141',
    '114131','311141','411131','211412','211214','211232','2331112'
  ];

  function generateCode128Svg(text, height = 65) {
    if (!text) text = '0000000000';
    const cleanText = String(text).trim();
    const indices = [104]; // Start Code B
    let checkSum = 104;

    for (let i = 0; i < cleanText.length; i++) {
      let code = cleanText.charCodeAt(i) - 32;
      if (code < 0 || code > 95) code = 0;
      indices.push(code);
      checkSum += code * (i + 1);
    }
    indices.push(checkSum % 103);
    indices.push(106); // Stop Code

    const patternStr = indices.map(idx => CODE128_PATTERNS[idx] || '212222').join('');
    const bars = [];
    let currentX = 10;
    let isBar = true;

    for (let i = 0; i < patternStr.length; i++) {
      const w = parseInt(patternStr[i], 10) || 1;
      if (isBar) {
        bars.push('<rect x="' + currentX + '" y="0" width="' + (w * 2) + '" height="' + height + '" fill="#000000" />');
      }
      currentX += w * 2;
      isBar = !isBar;
    }

    const totalWidth = currentX + 10;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + totalWidth + ' ' + (height + 22) + '" style="width:100%; max-width:' + totalWidth + 'px; height:auto; display:block; margin:0 auto;">' +
      '<rect width="100%" height="100%" fill="#ffffff" />' +
      '<g>' + bars.join('') + '</g>' +
      '<text x="' + (totalWidth / 2) + '" y="' + (height + 16) + '" text-anchor="middle" font-family="monospace, Courier" font-size="13" font-weight="bold" fill="#000000" letter-spacing="2">*' + cleanText + '*</text>' +
    '</svg>';
  }

  // ==================== 2. تېلېفونغا چىداملىق 1-Tap كۆچۈرۈش ئىقتىدارى ====================
  async function copyToClipboard(text, successMessage) {
    if (!text) return false;
    let ok = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch (e) {
      ok = false;
    }

    if (!ok) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        ok = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (err) {
        ok = false;
      }
    }

    if (ok) {
      if (typeof window.showAdminToast === 'function') {
        window.showAdminToast(successMessage || 'كۆچۈرۈلدى! ✅', 'success', 2500);
      } else {
        alert(successMessage || 'كۆچۈرۈلدى! ✅');
      }
    } else {
      if (typeof window.showAdminToast === 'function') {
        window.showAdminToast('كۆچۈرۈش مەغلۇپ بولدى، قولدا كۆچۈرۈڭ', 'error');
      }
    }
    return ok;
  }

  // ==================== 3. تۈركىيە تېلېفون نومۇرى پىششىقلاش (Standard Turkish Phone Normalization) ====================
  function normalizeTurkishPhone(phoneStr) {
    if (!phoneStr) return '';
    let digits = String(phoneStr).replace(/[^0-9]/g, '');
    if (digits.startsWith('0090')) digits = digits.slice(4);
    else if (digits.startsWith('90') && digits.length === 12) digits = digits.slice(2);
    if (digits.length === 10 && digits.startsWith('5')) {
      digits = '0' + digits;
    }
    return digits;
  }

  // ==================== 4. زاكاز سانلىق مەلۇماتىنى ئايرىش ۋە يىغىش ====================
  function parseOrderCargoDetails(order) {
    if (!order) return null;
    const cust = (typeof order.customer === 'string') 
      ? JSON.parse(order.customer || '{}') 
      : (order.customer || {});

    const name = (cust.name || 'خېرىدار').trim();
    const rawPhone = cust.phone || '';
    const phone = normalizeTurkishPhone(rawPhone);

    let city = (cust.city || '').trim();
    let district = (cust.district || '').trim();
    let address = (cust.address || '').trim();

    // ئەگەر شەھەر ئىچىگە رايون قوشۇلۇپ قالغان بولسا (مەسىلەن: İstanbul (Zeytinburnu))
    if (city.includes('(') && city.includes(')')) {
      const match = city.match(/(.*?)\((.*?)\)/);
      if (match) {
        if (!district) district = match[2].trim();
        city = match[1].trim();
      }
    } else if (city.includes('/')) {
      const parts = city.split('/');
      if (parts.length >= 2 && !district) {
        city = parts[0].trim();
        district = parts[1].trim();
      }
    }

    // ئومۇمىي سومما ۋە نەق پۇل چىقىم ھالىتى
    const totalTL = Number(order.totalCny || order.total || 0);
    const payMethod = String(order.paymentMethod || '').toLowerCase();
    const isCOD = payMethod.includes('نەق') || 
                  payMethod.includes('ئىشىك') || 
                  payMethod.includes('kapı') || 
                  payMethod.includes('nakit') || 
                  payMethod.includes('cod');

    const codAmount = isCOD ? totalTL : 0;
    const payMethodTitle = isCOD ? `Kapıda Nakit Ödeme (₺${totalTL})` : `Peşin Ödendi (Havale / Kart)`;

    // تاۋارلار تىزىملىكى
    const itemsList = Array.isArray(order.items) 
      ? order.items 
      : (typeof order.items === 'string' ? JSON.parse(order.items || '[]') : []);

    const itemsSummary = itemsList.map(i => `${i.name || i.productName || 'مەھسۇلات'} (x${i.quantity || 1})`).join(', ') || 'تەبىئىي تاۋارلار';

    return {
      orderId: order.id,
      date: order.date || new Date().toISOString().split('T')[0],
      name,
      rawPhone,
      phone,
      city: city || 'İstanbul',
      district: district || 'Zeytinburnu',
      address: address || '-',
      fullAddress: `${address} ${district ? district + ' / ' : ''}${city}`,
      isCOD,
      codAmount,
      totalTL,
      payMethodTitle,
      itemsSummary,
      carrier: order.cargoCarrier || 'PTT Kargo',
      trackingNo: order.cargoTrackingNo || ''
    };
  }

  // ==================== 5. İyi Seçenek كە تولۇق چاپلايدىغان پۈتۈن بولاق مەزمۇنى ====================
  function getFullCargoClipboardText(details) {
    if (!details) return '';
    return [
      `Alıcı: ${details.name}`,
      `Telefon: ${details.phone || details.rawPhone}`,
      `İl: ${details.city}`,
      `İlçe: ${details.district}`,
      `Açık Adres: ${details.address}`,
      `Kargo Ücreti: GÖNDEREN ÖDEMELİ (Gönderici Tarafından Peşin Ödenir)`,
      `Ödeme Tipi: ${details.isCOD ? 'Kapıda Nakit Tahsilat (Ürün Bedeli)' : 'Peşin / Önceden Ödendi'}`,
      `Tahsil Edilecek Tutar: ${details.isCOD ? details.codAmount + ' TL' : '0 TL (Müşteriden Ücret Alınmayacak)'}`,
      `Sipariş No: #${details.orderId} (Teklimakan Online)`,
      `Paket İçeriği: ${details.itemsSummary}`
    ].join('\n');
  }

  // ==================== 6. خېرىدارغا ئەۋەتىلىدىغان رەسمىي PTT WhatsApp تېكىستى ====================
  function getCustomerWhatsAppText(details, trackingNo, lang = 'ug') {
    const code = trackingNo || details.trackingNo || '';
    const pttOfficialUrl = `https://gonderitakip.ptt.gov.tr/Track/Verify?q=${encodeURIComponent(code)}`;
    const teklimakanTrackUrl = `https://teklimakan.online/track.html?code=${encodeURIComponent(code)}`;

    if (lang === 'tr') {
      return (
        `Merhaba Sayın *${details.name}*,\n\n` +
        `Teklimakan Online üzerinden verdiğiniz *#${details.orderId}* numaralı siparişiniz *PTT Kargo*ya teslim edilmiştir! 📦🚚\n\n` +
        `📦 *Kargo Firması:* PTT Kargo\n` +
        `🔢 *Takip Kodu:* \`${code}\`\n\n` +
        `🌐 *Doğrudan PTT Kargo Takibi:*\n${pttOfficialUrl}\n\n` +
        `📍 *Sipariş Durumu (Teklimakan):*\n${teklimakanTrackUrl}\n\n` +
        `Bizi tercih ettiğiniz için teşekkür ederiz, sağlıklı günlerde kullanmanız dileğiyle!\n` +
        `🌿 *Teklimakan Online* - www.teklimakan.online`
      );
    }

    return (
      `ئەسسالامۇئەلەيكۇم ھۆرمەتلىك *${details.name}*،\n\n` +
      `سىزنىڭ تەكلىماكان سۇپىسىدىن بەرگەن *#${details.orderId}* نومۇرلۇق زاكازىڭىز *PTT Kargo* غا تاپشۇرۇلدى! 📦🚚\n\n` +
      `📦 *پوچتا شىركىتى:* PTT Kargo (پوستخانا)\n` +
      `🔢 *ئىز قوغلاش نومۇرى:* \`${code}\`\n\n` +
      `🌐 *PTT دىن بىۋاسىتە ئىز قوغلاش:*\n${pttOfficialUrl}\n\n` +
      `📍 *تەكلىماكاندىن كۆرۈش:*\n${teklimakanTrackUrl}\n\n` +
      `تەكلىماكاننى تاللىغىنىڭىزغا كۆپ رەھمەت، شىپالىق ۋە بەرىكەت تىلەيمىز!\n` +
      `🌿 *تەكلىماكان سۇپىسى* - www.teklimakan.online`
    );
  }

  // ==================== 7. 10x15cm كارگو بەلگىسى (Thermal Label / Fiş) كۆزنىكىنى ئېچىش ====================
  function openShippingLabelModal(orderOrId) {
    const orders = window.appStore ? window.appStore.getOrders() : [];
    const order = (typeof orderOrId === 'object' && orderOrId !== null) 
      ? orderOrId 
      : orders.find(o => String(o.id) === String(orderOrId));

    if (!order) {
      alert('زاكاز ئۇچۇرى تېپىلمىدى: ' + orderOrId);
      return;
    }

    const details = parseOrderCargoDetails(order);
    const trackingCode = order.cargoTrackingNo || 'PTT-TEKLIMAKAN';
    const barcodeSvg = generateCode128Svg(trackingCode, 60);

    const modal = document.getElementById('shippingLabelModal');
    const body = document.getElementById('shippingLabelModalBody');
    if (!modal || !body) return;

    body.innerHTML = `
      <div id="printableThermalLabel" class="thermal-label-container" style="
        width: 100%;
        max-width: 380px;
        margin: 0 auto;
        padding: 16px;
        background: #ffffff;
        color: #000000;
        border: 2px solid #000000;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        box-shadow: 0 4px 14px rgba(0,0,0,0.08);
      ">
        <!-- 1. Header (Logo & Carrier) -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 6px;">
          <div>
            <div style="font-size: 1.15rem; font-weight: 900; letter-spacing: 0.5px;">TEKLİMAKAN ONLINE</div>
            <div style="font-size: 0.72rem; color: #333;">www.teklimakan.online · Tel: 0555 160 9999</div>
          </div>
          <div style="text-align: right;">
            <span style="display: inline-block; background: #000; color: #fff; font-weight: 900; font-size: 0.85rem; padding: 3px 8px; border-radius: 4px;">PTT KARGO</span>
          </div>
        </div>

        <!-- 🚚 KARGO ÜCRETİ: GÖNDEREN ÖDEMELİ (PEŞİN) -->
        <div style="background: #0f172a; color: #ffffff; text-align: center; padding: 4px; font-weight: 900; font-size: 0.82rem; letter-spacing: 0.5px; border-radius: 4px; margin-bottom: 8px;">
          KARGO ÜCRETİ: GÖNDEREN ÖDEMELİ (PEŞİN)
        </div>

        <!-- 2. Gönderici (Sender) -->
        <div style="border-bottom: 1px dashed #000; padding-bottom: 6px; margin-bottom: 6px; font-size: 0.74rem; line-height: 1.35;">
          <div style="font-weight: 800; font-size: 0.75rem;">GÖNDERİCİ:</div>
          <div><strong>Teklimakan Doğal Ürünler</strong></div>
          <div>Nuripaşa Mah. 65. Sokak Zeytinburnu / İSTANBUL</div>
        </div>

        <!-- 3. Alıcı (Recipient - Big & Clear) -->
        <div style="border: 2px solid #000; border-radius: 6px; padding: 10px; margin-bottom: 10px; background: #fafafa;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
            <span style="font-weight: 900; font-size: 0.82rem; color: #000;">ALICI:</span>
            <span style="font-family: monospace; font-size: 0.88rem; font-weight: 800; color: #000;">${details.phone || details.rawPhone}</span>
          </div>
          <div style="font-size: 1.1rem; font-weight: 900; margin-bottom: 4px; color: #000;">
            ${details.name}
          </div>
          <div style="font-size: 0.82rem; line-height: 1.4; color: #111; margin-bottom: 6px;">
            ${details.address}
          </div>
          <div style="font-size: 1rem; font-weight: 900; text-transform: uppercase; border-top: 1px solid #000; padding-top: 4px; color: #000;">
            ${details.district} / ${details.city}
          </div>
        </div>

        <!-- 4. Barcode Area -->
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 8px;">
          <div style="font-size: 0.72rem; font-weight: 800; margin-bottom: 2px;">PTT GÖNDERİ BARKODU:</div>
          <div style="margin: 4px 0;">${barcodeSvg}</div>
        </div>

        <!-- 5. Ödeme & Paket Detayı -->
        <div style="font-size: 0.78rem; line-height: 1.45;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; padding: 4px; background: ${details.isCOD ? '#fee2e2' : '#f0fdf4'}; border: 1px solid ${details.isCOD ? '#ef4444' : '#22c55e'}; border-radius: 4px;">
            <span style="font-weight: 800;">ÖDEME ŞEKLİ:</span>
            <span style="font-weight: 900; font-size: 0.88rem; color: ${details.isCOD ? '#b91c1c' : '#15803d'};">
              ${details.payMethodTitle}
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: #333; margin-top: 4px;">
            <span>Sipariş No: <strong>#${details.orderId}</strong></span>
            <span>Tarih: <strong>${details.date}</strong></span>
          </div>
          <div style="font-size: 0.7rem; color: #555; margin-top: 4px; border-top: 1px dotted #ccc; padding-top: 3px;">
            İçerik: ${details.itemsSummary}
          </div>
        </div>
      </div>
    `;

    window.showModal('shippingLabelModal');

    // Print Handler
    const printBtn = document.getElementById('btnPrintThermalLabel');
    if (printBtn) {
      printBtn.onclick = function() {
        window.printShippingLabel();
      };
    }
  }

  // ==================== 8. پەقەت كارگو چاپلىقىنى بېسىپ چىقىرىش (Print CSS Isolation) ====================
  function printShippingLabel() {
    const printable = document.getElementById('printableThermalLabel');
    if (!printable) {
      alert('كارگو چاپلىقى تېپىلمىدى!');
      return;
    }

    const printWin = window.open('', '_blank', 'width=450,height=600');
    if (!printWin) {
      window.print();
      return;
    }

    printWin.document.open();
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Teklimakan PTT Kargo Fişi</title>
          <style>
            @page {
              size: 100mm 150mm;
              margin: 4mm;
            }
            body {
              margin: 0;
              padding: 0;
              background: #fff;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .thermal-label-container {
              width: 100% !important;
              max-width: 100% !important;
              box-shadow: none !important;
              border: 2px solid #000 !important;
              border-radius: 0 !important;
              page-break-inside: avoid;
            }
          </style>
        </head>
        <body onload="window.print(); setTimeout(() => window.close(), 1000);">
          ${printable.outerHTML}
        </body>
      </html>
    `);
    printWin.document.close();
  }

  // ==================== 9. İyi Seçenek ئاپتوماتىك مۇلازىمېتىر ئۇلاش كۆۋرۈكى (Auto-Sync Engine) ====================
  const IYISECENEK_STORAGE_KEY = 'teklimakan_iyisecenek_credentials_v1';

  function getIyiSecenekCredentials() {
    let email = '';
    let password = '';
    let autoSync = true;

    try {
      const raw = localStorage.getItem(IYISECENEK_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.email) email = parsed.email.trim();
        if (parsed.password) password = parsed.password;
        if (parsed.autoSync !== undefined) autoSync = parsed.autoSync !== false;
      }
    } catch (e) {}

    try {
      if (window.appStore && typeof window.appStore.getSettings === 'function') {
        const s = window.appStore.getSettings() || {};
        if (!email && s.iyisecenekEmail) email = s.iyisecenekEmail.trim();
        if (!password && s.iyisecenekPassword) password = s.iyisecenekPassword;
        if (s.iyisecenekAutoSync !== undefined) autoSync = s.iyisecenekAutoSync !== false;
      }
    } catch (e) {}

    return { email, password, autoSync, hasCredentials: !!(email && password) };
  }

  function saveIyiSecenekCredentials(email, password, autoSync = true) {
    const cleanEmail = (email || '').trim();
    const cleanPass = password || '';
    const payload = { email: cleanEmail, password: cleanPass, autoSync: autoSync !== false, updatedAt: new Date().toISOString() };

    try {
      localStorage.setItem(IYISECENEK_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {}

    try {
      if (window.appStore && typeof window.appStore.getSettings === 'function') {
        const s = window.appStore.getSettings() || {};
        s.iyisecenekEmail = cleanEmail;
        s.iyisecenekPassword = cleanPass;
        s.iyisecenekAutoSync = autoSync !== false;
        if (typeof window.appStore.saveSettings === 'function') {
          window.appStore.saveSettings(s);
        } else {
          localStorage.setItem('teklimakan_settings_v4', JSON.stringify(s));
        }
      }
    } catch (e) {}

    return payload;
  }

  async function testIyiSecenekConnection(email, password) {
    const creds = (email && password) ? { email, password } : getIyiSecenekCredentials();
    if (!creds.email || !creds.password) {
      return { success: false, needsCredentials: true, message: 'İyi Seçenek ئىمائىل ۋە مەخپىي نومۇرنى كىرگۈزۈڭ!' };
    }

    try {
      const resp = await fetch('/api/iyisecenek-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_login',
          email: creds.email,
          password: creds.password
        })
      });
      return await resp.json();
    } catch (err) {
      return { success: false, error: err.message, message: 'تور ئۇلىنىشىدا خاتالىق: ' + err.message };
    }
  }

  async function autoSyncOrderToIyiSecenek(order, options = {}) {
    if (!order) return { success: false, message: 'زاكاز تېپىلمىدى' };
    const creds = getIyiSecenekCredentials();

    if (!creds.hasCredentials) {
      return {
        success: false,
        needsCredentials: true,
        message: 'İyi Seçenek ھېساباتى تېخى باغلانمىغان. ئىمائىل ۋە مەخپىي نومۇرىڭىزنى بىر قېتىم كىرگۈزۈپ ساقلاڭ.'
      };
    }

    try {
      const resp = await fetch('/api/iyisecenek-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_order',
          email: creds.email,
          password: creds.password,
          order: order
        })
      });
      const result = await resp.json();

      // ئەگەر ئاپتوماتىك PTT كودى قايتىپ كەلگەن بولسا، زاكازغا بىۋاسىتە ساقلاش
      if (result && result.success && result.detectedTrackingCode && window.appStore && order.id) {
        try {
          window.appStore.updateOrderTracking(order.id, 'PTT Kargo', result.detectedTrackingCode);
        } catch (e) {}
      }

      return result;
    } catch (err) {
      return {
        success: false,
        error: err.message,
        message: 'İyi Seçenek سىستېمىسىغا يوللاشتا خاتالىق: ' + err.message
      };
    }
  }

  // ==================== 10. Export to Global Scope ====================
  window.TeklimakanCargoBridge = {
    generateCode128Svg,
    copyToClipboard,
    normalizeTurkishPhone,
    parseOrderCargoDetails,
    getFullCargoClipboardText,
    getCustomerWhatsAppText,
    openShippingLabelModal,
    printShippingLabel,
    getIyiSecenekCredentials,
    saveIyiSecenekCredentials,
    testIyiSecenekConnection,
    autoSyncOrderToIyiSecenek
  };

})(window);
