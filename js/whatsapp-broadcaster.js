/**
 * ================================================================
 * 🚀 تەكلىماكان سۇپىسى — مەركىزىي WhatsApp گۇرۇپپا ئاپتوماتىك ئۇقتۇرۇش سىستېمىسى
 * Teklimakan Central WhatsApp Group Broadcaster (1-Click & Automated Cloud)
 * ================================================================
 * 1. 30 كۈن ئىچىدە تەكرارلانماسلىق كاپالىتى (30-Day Anti-Duplicate Engine).
 * 2. ئەگەر 30 كۈن ئىچىدە ئېلان قىلىپ بولۇنغان بولسا ئەسكەرتىش بېرىش (Exhaustion Alert).
 * 3. بىر كۈن ئۇيغۇرچە (teklimakan.com)، ئەتىسى تۈركچە (teklimakan.online) نۆۋەتلىشىش.
 * 4. مەجبۇرىي ئورگان ئاخىرقى خەتلىرى (Mandatory Official Footers).
 * 5. ھەركۈنى كەچ سائەت 20:30 دا قەرەللىك ئېلان چىقىرىش.
 */

(function(window) {
  'use strict';

  const SITE_UG_URL = 'https://teklimakan.com';
  const SITE_TR_URL = 'https://www.teklimakan.online';
  const DEFAULT_WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/HSer7ggKO9iCvjUShuCmmW';
  const STORAGE_KEY_HISTORY = 'teklimakan_whatsapp_broadcast_history';
  const STORAGE_KEY_LAST_DAILY = 'teklimakan_last_daily_broadcast';
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

  // 🔤 ھەرپلەرنى پاكىز slug غا ئايلاندۇرۇش
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
    return out
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 75);
  }

  function getProductCanonicalUrl(product, lang = 'ug') {
    if (!product || !product.id) return lang === 'tr' ? SITE_TR_URL : SITE_UG_URL;
    const base = lang === 'tr' ? SITE_TR_URL : SITE_UG_URL;
    let name = '';
    if (lang === 'tr') {
      name = (product.translations && product.translations.tr && product.translations.tr.name) || product.name || '';
    } else {
      name = product.name || (product.translations && product.translations.ug && product.translations.ug.name) || '';
    }
    const slug = transliterateToSlug(name);
    const pid = String(product.id).toLowerCase();
    if (slug) {
      return `${base}/p/${slug}-${pid}`;
    }
    return `${base}/p/${pid}`;
  }

  // 🖼️ ھەرئىككىلا ئەھۋالدا رەسىم چوقۇم بولۇش كاپالىتى
  function hasValidProductImage(prod) {
    if (!prod || !prod.image || typeof prod.image !== 'string') return false;
    const clean = prod.image.trim().toLowerCase();
    if (!clean || clean === '' || clean.includes('default_product.jpg')) return false;
    return true;
  }

  function getFullImageUrl(prod) {
    if (!prod || !prod.image) return '';
    if (prod.image.startsWith('http')) return prod.image;
    return `${SITE_UG_URL}/${prod.image.replace(/^\/+/, '')}`;
  }

  async function copyProductImageToClipboard(imgUrl) {
    if (!imgUrl) return false;
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imgUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (navigator.clipboard && navigator.clipboard.write && window.ClipboardItem) {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        return true;
      }
    } catch (e) {
      console.warn('[WhatsAppBroadcaster] Canvas copy failed:', e);
    }
    return false;
  }

  function downloadProductImage(imgUrl, fileName = 'product.jpg') {
    if (!imgUrl) return;
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = fileName;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function cleanDescription(desc) {
    if (!desc) return '';
    let clean = String(desc)
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (clean.length > 220) {
      clean = clean.slice(0, 215).trim() + '...';
    }
    return clean;
  }

  /**
   * 📜 مەجبۇرىي ئۇيغۇرچە ئاخىرقى خەتلەر (Mandatory Uyghur Footer)
   */
  function getMandatoryUyghurFooter() {
    return [
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

  /**
   * 📜 مەجبۇرىي تۈركچە ئاخىرقى خەتلەر (Mandatory Turkish Footer)
   */
  function getMandatoryTurkishFooter() {
    return [
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
  }

  // ==================== 🛡️ 30 كۈنلۈك تارىخ ۋە تەكرارلىقنى توسۇش مۇلازىمىتى ====================

  function getBroadcastHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (!raw) return [];
      const list = JSON.parse(raw);
      return Array.isArray(list) ? list : [];
    } catch (e) {
      console.warn('[WhatsAppBroadcaster] History read error:', e);
      return [];
    }
  }

  function saveBroadcastHistory(history) {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(-150)));
    } catch (e) {
      console.warn('[WhatsAppBroadcaster] History save error:', e);
    }
  }

  function recordBroadcast(product, lang = 'ug') {
    if (!product || !product.id) return;
    const history = getBroadcastHistory();
    const entry = {
      product_id: product.id,
      product_name: product.name || product.id,
      lang: lang,
      date: new Date().toISOString().slice(0, 10),
      timestamp: Date.now()
    };
    history.push(entry);
    saveBroadcastHistory(history);
  }

  /**
   * 🔍 تاۋارنىڭ يېقىنقى 30 كۈن ئىچىدە يوللانغان ياكى يوللانمىغانلىقىنى تەكشۈرۈش
   */
  function isProductBroadcastedRecently(productId, daysLimit = 30) {
    if (!productId) return false;
    const history = getBroadcastHistory();
    const limitMs = daysLimit * 24 * 60 * 60 * 1000;
    const now = Date.now();

    for (let i = history.length - 1; i >= 0; i--) {
      const h = history[i];
      if (h.product_id === productId) {
        if (now - (h.timestamp || 0) < limitMs) {
          return true; // 30 كۈن ئىچىدە يوللانغان، تەكرارلاش مەنئى قىلىنىدۇ!
        }
      }
    }
    return false;
  }

  /**
   * 🔄 كېيىنكى قېتىملىق تىلنى ئاپتوماتىك نۆۋەتلەشتۈرۈش (بىر كۈن ئۇيغۇرچە، ئەتىسى تۈركچە)
   */
  function getNextBroadcastLanguage() {
    const history = getBroadcastHistory();
    // ئاخىرقى كۈندىلىك ئېلاننىڭ تىلىنى تېپىش
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].lang) {
        return history[i].lang === 'ug' ? 'tr' : 'ug';
      }
    }
    // تارىخ بوش بولسا كۈن بويىچە نۆۋەتلەشتۈرۈش
    const day = new Date().getDate();
    return (day % 2 === 1) ? 'ug' : 'tr';
  }

  /**
   * 📦 30 كۈن ئىچىدە تېخى ئېلان قىلىنمىغان لاياقەتلىك تاۋارلار تىزىملىكىنى ئېلىش
   */
  function getEligibleProducts(targetLang = null) {
    if (!window.appStore || typeof window.appStore.getProducts !== 'function') {
      return { eligible: [], total: 0, broadcastedCount: 0, exhausted: true };
    }

    const allProducts = window.appStore.getProducts().filter(p => {
      const isApproved = (p.approvalStatus || 'تەستىقلاندى') === 'تەستىقلاندى';
      const hasStock = Number(p.stock) > 0;
      return isApproved && hasStock;
    });

    const eligible = [];
    let broadcastedCount = 0;

    allProducts.forEach(prod => {
      // 📷 ھەرئىككىلا ئەھۋالدا رەسىم چوقۇم بولۇشى كېرەك! سۈرەتسىز تاۋارلار سۈزۈپ تاشلىنىدۇ
      if (!hasValidProductImage(prod)) {
        return;
      }
      if (isProductBroadcastedRecently(prod.id, 30)) {
        broadcastedCount++;
      } else {
        eligible.push(prod);
      }
    });

    return {
      eligible,
      total: allProducts.length,
      broadcastedCount,
      exhausted: eligible.length === 0
    };
  }

  /**
   * 📝 تىل بويىچە سېتىشنى تېزلىتىدىغان، مەجبۇرىي ئاخىرقى خەتلەر تولۇق بولغان WhatsApp ئېلان تېكىستى
   */
  function formatProductBroadcastText(product, customOptions = {}) {
    if (!product) return '';

    const lang = customOptions.lang || (customOptions.isTurkish ? 'tr' : 'ug');
    const isDaily = customOptions.isDaily !== false;
    const price = product.price ? Number(product.price).toLocaleString('en-US') : '0';
    const oldPrice = product.oldPrice || product.old_price;

    if (lang === 'tr') {
      // 🇹🇷 TÜRKÇE MESAJ METNİ
      const trData = (product.translations && product.translations.tr) || {};
      const name = trData.name || product.name || 'Özel Doğal Ürün';
      const brand = product.brand || 'Teklimakan Online';
      const category = trData.category || product.category || 'Doğal Şifa Ürünleri';
      const unit = trData.unit || product.unit || '1 Adet';
      const desc = cleanDescription(trData.description || product.description);
      const url = getProductCanonicalUrl(product, 'tr');

      let priceText = `₺${price}`;
      if (oldPrice && Number(oldPrice) > Number(product.price)) {
        priceText = `₺${price}  ~(Eski Fiyat: ₺${Number(oldPrice).toLocaleString('en-US')})~`;
      }

      const headline = isDaily
        ? '🌟 *Teklimakan Günlük Akşam Önerisi (Saat 20:30)* 🌿'
        : '🌿 *Teklimakan Online — Yeni Doğal Ürün Yayında!*';

      const lines = [
        headline,
        '',
        `📦 *Ürün:* ${name}`,
        `🏷️ *Marka:* ${brand}`,
        `💰 *Fiyat:* ${priceText}`,
        `⚖️ *Birim:* ${unit}`,
        `📂 *Kategori:* ${category}`,
        ''
      ];

      if (desc) {
        lines.push('✨ *Özellikleri ve Faydaları:*');
        lines.push(desc);
        lines.push('');
      }

      lines.push('🛒 *Detaylar ve Doğrudan Sipariş:*');
      lines.push(url);
      lines.push('');
      lines.push('🚚 *Türkiye geneli hızlı ve güvenli kargo garantisi!*');
      lines.push('----------------------------------------');
      lines.push(getMandatoryTurkishFooter());

      return lines.join('\n');
    } else {
      // 🌿 ئۇيغۇرچە ئۇچۇر تېكىستى
      const ugData = (product.translations && product.translations.ug) || {};
      const name = ugData.name || product.name || 'يېڭى مەھسۇلات';
      const brand = product.brand || 'تەكلىماكان كىلاسسىك';
      const category = ugData.category || product.category || 'ئۇيغۇر تىبابىتى';
      const unit = ugData.unit || product.unit || '1 دانە';
      const desc = cleanDescription(ugData.description || product.description);
      const url = getProductCanonicalUrl(product, 'ug');

      let priceText = `₺${price}`;
      if (oldPrice && Number(oldPrice) > Number(product.price)) {
        priceText = `₺${price}  ~(ئەسلى باھاسى: ₺${Number(oldPrice).toLocaleString('en-US')})~`;
      }

      const headline = isDaily
        ? '🌟 *تەكلىماكان كۈندىلىك كەچلىك تەۋسىيەسى (سائەت 20:30)* 🌿'
        : '🌿 *تەكلىماكان سۇپىسى — يېڭى تەبىئىي مەھسۇلات ئېلان قىلىندى!*';

      const lines = [
        headline,
        '',
        `📦 *مەھسۇلات:* ${name}`,
        `🏷️ *ماركىسى:* ${brand}`,
        `💰 *باھاسى:* ${priceText}`,
        `⚖️ *ئۆلچىمى:* ${unit}`,
        `📂 *تۈرى:* ${category}`,
        ''
      ];

      if (desc) {
        lines.push('✨ *ئالاھىدىلىكى ۋە ئۈنۈمى:*');
        lines.push(desc);
        lines.push('');
      }

      lines.push('🛒 *تەپسىلاتىنى كۆرۈش ۋە بىۋاستە زاكاز قىلىش:*');
      lines.push(url);
      lines.push('');
      lines.push('🚚 *تۈركىيە بويىچە تېز ھەم ئىشەنچلىك يەتكۈزۈش كاپالىتى بار!*');
      lines.push('----------------------------------------');
      lines.push(getMandatoryUyghurFooter());

      return lines.join('\n');
    }
  }

  function getWhatsAppShareUrl(text) {
    const encoded = encodeURIComponent(text);
    return `https://api.whatsapp.com/send?text=${encoded}`;
  }

  function openGroupShare(productOrId, options = {}) {
    let product = productOrId;
    if (typeof productOrId === 'string' && window.appStore && typeof window.appStore.getProductById === 'function') {
      product = window.appStore.getProductById(productOrId);
    }
    if (!product) {
      alert('تاۋار ئۇچۇرى تېپىلمىدى!');
      return;
    }

    const text = formatProductBroadcastText(product, options);
    recordBroadcast(product, options.lang || 'ug');
    const url = getWhatsAppShareUrl(text);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async function sendBackgroundGroupNotify(product, options = {}) {
    let settings = {};
    if (window.appStore && typeof window.appStore.getSettings === 'function') {
      settings = window.appStore.getSettings() || {};
    }

    const provider = options.provider || settings.whatsappProvider || 'green-api';
    const token = options.token || settings.whatsappToken || '';
    const instanceId = options.instanceId || settings.whatsappInstanceId || '';
    const chatId = options.chatId || settings.whatsappGroupId || DEFAULT_WHATSAPP_GROUP_LINK;
    const webhookUrl = options.webhookUrl || settings.whatsappWebhookUrl || '';

    const lang = options.lang || 'ug';
    const text = options.text || formatProductBroadcastText(product, options);
    const imageUrl = product.image ? (product.image.startsWith('http') ? product.image : `${SITE_UG_URL}/${product.image.replace(/^\/+/, '')}`) : '';

    try {
      const resp = await fetch('/api/whatsapp-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          token,
          instanceId,
          chatId,
          webhookUrl,
          text,
          imageUrl,
          action: options.action || 'broadcast'
        })
      });

      const resData = await resp.json().catch(() => ({}));
      if (resData.success) {
        recordBroadcast(product, lang);
      }
      return resData;
    } catch (err) {
      console.error('[WhatsAppBroadcaster] Server API error:', err);
      return { success: false, error: err.message || 'تور ئۇلىنىش خاتالىقى كۆرۈلدى' };
    }
  }

  /**
   * ⚠️ تاۋارلار تۈگەپ كەتكەندە بېرىلىدىغان ئاگاھلاندۇرۇش (Inventory Exhaustion Alert)
   */
  function handleExhaustedAlert(lang = 'ug') {
    const alertMsg = '⚠️ دىققەت: بارلىق مەھسۇلاتلار يېقىنقى 30 كۈن ئىچىدە WhatsApp توپىغا ئېلان قىلىنىپ بولدى! تەكرارلىقنىڭ ئالدىنى ئېلىش سەۋەبىدىن بۈگۈنكى ئېلان توختىتىلدى. يېڭى تاۋار ئېلان قىلىڭ ياكى تارىخنى تەڭشەڭ.';

    if (typeof window.showAdminToast === 'function') {
      window.showAdminToast(alertMsg, 'error', 8000);
    }

    // Telegram ئارقىلىق ساھىبخانغا ئەسكەرتىش ئەۋەتىش
    try {
      if (window.TeklimakanTelegram && typeof window.TeklimakanTelegram.sendDirectMessage === 'function') {
        const tgMsg = `⚠️ <b>تەكلىماكان سۇپىسى: WhatsApp كۈندىلىك ئېلان ئەسكەرتىشى</b>\n\nبارلىق تاۋارلىرىڭىز يېقىنقى 30 كۈن ئىچىدە WhatsApp توپىغا ئېلان قىلىنىپ بولغانلىقى ئۈچۈن، تەكرار ئېلان بېرىشنىڭ ئالدىنى ئېلىش مەقسىتىدە بۈگۈنكى (${lang.toUpperCase()}) ئېلان قىلىش توختىتىلدى.\nيېڭى تاۋار قوشسىڭىز ئاپتوماتىك داۋاملىشىدۇ!`;
        window.TeklimakanTelegram.sendDirectMessage(tgMsg);
      }
    } catch (tgErr) {
      console.warn('Telegram exhaustion alert failed:', tgErr);
    }
  }

  function openBroadcastModal(productOrId, options = {}) {
    let product = productOrId;
    if (typeof productOrId === 'string' && window.appStore && typeof window.appStore.getProductById === 'function') {
      product = window.appStore.getProductById(productOrId);
    }
    if (!product) {
      if (typeof window.showAdminToast === 'function') {
        window.showAdminToast('مەھسۇلات ئۇچۇرى تېپىلمىدى', 'error');
      } else {
        alert('تاۋار ئۇچۇرى تېپىلمىدى!');
      }
      return;
    }

    const modal = document.getElementById('modalWhatsAppBroadcast');
    if (!modal) {
      openGroupShare(product, options);
      return;
    }

    const textarea = document.getElementById('whatsappBroadcastText');
    const titleEl = document.getElementById('whatsappBroadcastModalTitle');
    const thumbEl = document.getElementById('whatsappBroadcastModalThumb');
    const sendApiBtn = document.getElementById('btnSendWhatsAppApi');

    const lang = options.lang || 'ug';
    const formattedText = formatProductBroadcastText(product, options);

    if (textarea) textarea.value = formattedText;
    if (titleEl) {
      const langBadge = lang === 'tr' ? '🇹🇷 Türkçe (teklimakan.online)' : '🌿 ئۇيغۇرچە (teklimakan.com)';
      titleEl.innerHTML = `<i class="fab fa-whatsapp" style="color:#25D366;"></i> WhatsApp توپىغا يوللاش [${langBadge}]`;
    }
    if (thumbEl) {
      thumbEl.src = product.image || 'images/default_product.jpg';
      thumbEl.alt = product.name || '';
    }

    modal.dataset.currentProductId = product.id;
    modal.dataset.currentLang = lang;

    let settings = {};
    if (window.appStore && typeof window.appStore.getSettings === 'function') {
      settings = window.appStore.getSettings() || {};
    }
    const hasApiConfig = !!(settings.whatsappToken && settings.whatsappGroupId) || !!settings.whatsappWebhookUrl;
    if (sendApiBtn) {
      sendApiBtn.style.display = hasApiConfig ? 'inline-flex' : 'none';
    }

    modal.classList.add('active');
  }

  function closeBroadcastModal() {
    const modal = document.getElementById('modalWhatsAppBroadcast');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  /**
   * ⏰ ھەركۈنى كەچ سائەت 20:30 (8:30 PM) قەرەللىك ئېلان ئىجراچىسى
   */
  function triggerDailyBroadcast(force = false) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const lastBroadcast = localStorage.getItem(STORAGE_KEY_LAST_DAILY);

    if (!force && lastBroadcast === todayStr) {
      console.log('[WhatsAppBroadcaster] Today\'s 20:30 broadcast already executed:', todayStr);
      return;
    }

    // 1. كېيىنكى قېتىملىق تىلنى ئېنىقلاش (بىر كۈن ئۇيغۇرچە، ئەتىسى تۈركچە)
    const targetLang = getNextBroadcastLanguage();

    // 2. 30 كۈن ئىچىدە ئېلان قىلىنمىغان تاۋارلارنى تاللاش
    const res = getEligibleProducts(targetLang);
    if (res.exhausted || res.eligible.length === 0) {
      handleExhaustedAlert(targetLang);
      return;
    }

    // لاياقەتلىك تاۋارلار ئىچىدىن ئالدىنقى ئورۇندىكىنى تاللاش
    const prod = res.eligible[0];

    localStorage.setItem(STORAGE_KEY_LAST_DAILY, todayStr);

    let settings = {};
    if (window.appStore && typeof window.appStore.getSettings === 'function') {
      settings = window.appStore.getSettings() || {};
    }

    // بۇلۇت دەرۋازىسى ئارقىلىق يوللاش
    if (settings.whatsappEnabled !== false && settings.whatsappAutoBroadcast && (settings.whatsappToken || settings.whatsappWebhookUrl)) {
      sendBackgroundGroupNotify(prod, { lang: targetLang, isDaily: true }).then(apiRes => {
        if (apiRes && apiRes.success) {
          if (typeof window.showAdminToast === 'function') {
            const langName = targetLang === 'tr' ? 'Türkçe' : 'ئۇيغۇرچە';
            window.showAdminToast(`⏰ كۈندىلىك كەچ سائەت 8:30 [${langName}] ئېلانى WhatsApp توپىغا ئاپتوماتىك يوللاندى! 🌟`, 'success');
          }
        } else {
          openBroadcastModal(prod, { lang: targetLang, isDaily: true });
        }
      }).catch(() => {
        openBroadcastModal(prod, { lang: targetLang, isDaily: true });
      });
    } else {
      openBroadcastModal(prod, { lang: targetLang, isDaily: true });
      if (typeof window.showAdminToast === 'function') {
        const langName = targetLang === 'tr' ? 'Türkçe (teklimakan.online)' : 'ئۇيغۇرچە (teklimakan.com)';
        window.showAdminToast(`⏰ كۈندىلىك كەچ سائەت 8:30 [${langName}] ئېلان ۋاقتى كەلدى!`, 'info');
      }
    }
  }

  function initDailyBroadcastScheduler() {
    function checkTime() {
      try {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        // تۈركىيە ۋاقتى كەچ سائەت 20:30 بولغاندا
        if (hours === 20 && minutes >= 30) {
          triggerDailyBroadcast(false);
        }
      } catch (err) {
        console.warn('[WhatsAppBroadcaster] Scheduler check error:', err);
      }
    }

    setInterval(checkTime, 60000);
    setTimeout(checkTime, 3000);
  }

  async function notifyNewProduct(product, context = {}) {
    if (!product) return;

    let settings = {};
    if (window.appStore && typeof window.appStore.getSettings === 'function') {
      settings = window.appStore.getSettings() || {};
    }

    if (settings.whatsappEnabled !== false && settings.whatsappAutoBroadcast && (settings.whatsappToken || settings.whatsappWebhookUrl)) {
      try {
        const res = await sendBackgroundGroupNotify(product, { lang: 'ug' });
        if (res && res.success) {
          if (typeof window.showAdminToast === 'function') {
            window.showAdminToast('WhatsApp توپىغا يېڭى تاۋار ئۇچۇرى ئاپتوماتىك ئەۋەتىلدى! 🚀', 'success');
          }
          return;
        }
      } catch (e) {
        console.warn('[WhatsAppBroadcaster] Background send skipped or failed:', e);
      }
    }

    if (settings.whatsappEnabled !== false) {
      setTimeout(() => {
        openBroadcastModal(product, { lang: 'ug' });
      }, 500);
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initDailyBroadcastScheduler);
    } else {
      initDailyBroadcastScheduler();
    }
  }

  // ئاشكارا قىلىش (Export to window)
  window.TeklimakanWhatsApp = {
    SITE_UG_URL,
    SITE_TR_URL,
    DEFAULT_WHATSAPP_GROUP_LINK,
    transliterateToSlug,
    getProductCanonicalUrl,
    getMandatoryUyghurFooter,
    getMandatoryTurkishFooter,
    getBroadcastHistory,
    recordBroadcast,
    isProductBroadcastedRecently,
    getNextBroadcastLanguage,
    getEligibleProducts,
    hasValidProductImage,
    getFullImageUrl,
    copyProductImageToClipboard,
    downloadProductImage,
    formatProductBroadcastText,
    getWhatsAppShareUrl,
    openGroupShare,
    sendBackgroundGroupNotify,
    handleExhaustedAlert,
    openBroadcastModal,
    closeBroadcastModal,
    triggerDailyBroadcast,
    notifyNewProduct
  };

})(typeof window !== 'undefined' ? window : this);
