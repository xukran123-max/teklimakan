/**
 * ================================================================
 * 🚀 تەكلىماكان سۇپىسى — مەركىزىي WhatsApp گۇرۇپپا ئاپتوماتىك ئۇقتۇرۇش سىستېمىسى
 * Teklimakan Central WhatsApp Group Broadcaster (1-Click & Automated Cloud)
 * ================================================================
 * يېڭى تاۋار ئېلان قىلىنغاندا ياكى ھەركۈنى كەچ سائەت 8:30 (20:30) دا،
 * تاۋارنىڭ تولۇق تەپسىلاتى ۋە مەجبۇرىي ئورگان ئۇچۇرلىرى بىلەن گۇرۇپپىغا يوللايدۇ.
 */

(function(window) {
  'use strict';

  const SITE_BASE_URL = 'https://teklimakan.com';
  const DEFAULT_WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/HSer7ggKO9iCvjUShuCmmW';
  const DEFAULT_INSTAGRAM_URL = 'https://www.instagram.com/teklimakancom';
  const DEFAULT_PHONE_1 = '05551609999';
  const DEFAULT_PHONE_2 = '05550716031';

  // 🔤 ئۇيغۇرچە / تۈركچە ھەرپلەرنى ئىنگلىزچە پاكىز slug غا ئايلاندۇرۇش
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

  function getProductCanonicalUrl(product) {
    if (!product || !product.id) return SITE_BASE_URL;
    const name = product.name || (product.translations && product.translations.ug && product.translations.ug.name) || '';
    const slug = transliterateToSlug(name);
    const pid = String(product.id).toLowerCase();
    if (slug) {
      return `${SITE_BASE_URL}/p/${slug}-${pid}`;
    }
    return `${SITE_BASE_URL}/p/${pid}`;
  }

  function cleanDescription(desc) {
    if (!desc) return '';
    let clean = String(desc)
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (clean.length > 200) {
      clean = clean.slice(0, 195).trim() + '...';
    }
    return clean;
  }

  /**
   * 📝 مەجبۇرىي ئورگان ئاخىرقى خەتلىرى (Mandatory Official Footer)
   * ئىشلەتكۈچى تەلەپ قىلغان ئۆلچەم بويىچە 100% تولۇق، كېسىلمەيدىغان، كەسپىي تېكىست:
   */
  function getMandatoryFooter() {
    return [
      '🎁 *مۇكاپاتلىق پائالىيەتلەر سەھىپىمىزدە:*',
      'instagram.com/teklimakancom',
      '',
      '🌐 *تور بېكەت ئادىرسىمىز:*',
      'www.teklimakan.com',
      '',
      '📞 *ئالاقىلىشىش ۋاتساپ ۋە تېلېفون:*',
      DEFAULT_PHONE_1,
      DEFAULT_PHONE_2,
      '',
      '#تەكلىماكان_سودا_تورى'
    ].join('\n');
  }

  /**
   * 📝 WhatsApp توپى ئۈچۈن قايىل قىلارلىق، سېتىشنى تېزلىتىدىغان ئۇيغۇرچە تەييار تېكىست قۇرۇش
   */
  function formatProductBroadcastText(product, customOptions = {}) {
    if (!product) return '';

    const name = product.name || (product.translations && product.translations.ug && product.translations.ug.name) || 'يېڭى مەھسۇلات';
    const brand = product.brand || 'تەكلىماكان كىلاسسىك';
    const category = product.category || 'ئۇيغۇر تىبابىتى';
    const price = product.price ? Number(product.price).toLocaleString('en-US') : '0';
    const oldPrice = product.oldPrice || product.old_price;
    const unit = product.unit || '1 دانە';
    const desc = cleanDescription(product.description || (product.translations && product.translations.ug && product.translations.ug.description));
    const url = getProductCanonicalUrl(product);

    let priceText = `₺${price}`;
    if (oldPrice && Number(oldPrice) > Number(product.price)) {
      priceText = `₺${price}  ~(ئەسلى باھاسى: ₺${Number(oldPrice).toLocaleString('en-US')})~`;
    }

    const isDaily = customOptions.isDaily === true;
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
    lines.push(getMandatoryFooter());

    return lines.join('\n');
  }

  /**
   * 📲 WhatsApp Share URL ھاسىللاش
   */
  function getWhatsAppShareUrl(text) {
    const encoded = encodeURIComponent(text);
    return `https://api.whatsapp.com/send?text=${encoded}`;
  }

  /**
   * 🚀 1-چېكىش بىلەن WhatsApp گۇرۇپپىسىغا يوللاش بەتنى ئېچىش
   */
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
    const url = getWhatsAppShareUrl(text);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * 🌐 ئارقا سەپتە مۇلازىمېتىر ئارقىلىق توپقا ئەۋەتىش (Green-API / UltraMsg / Webhook)
   */
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

    const text = options.text || formatProductBroadcastText(product, options);
    const imageUrl = product.image ? (product.image.startsWith('http') ? product.image : `${SITE_BASE_URL}/${product.image.replace(/^\/+/, '')}`) : '';

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
      return resData;
    } catch (err) {
      console.error('[WhatsAppBroadcaster] Server API error:', err);
      return { success: false, error: err.message || 'تور ئۇلىنىش خاتالىقى كۆرۈلدى' };
    }
  }

  /**
   * 🪟 WhatsApp كۆرۈنمە سۆزلەشكۈنى ئېچىش (Modal Preview & Send)
   */
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

    const formattedText = formatProductBroadcastText(product, options);

    if (textarea) textarea.value = formattedText;
    if (titleEl) {
      titleEl.textContent = options.isDaily
        ? `⏰ كۈندىلىك كەچ سائەت 8:30 ئېلانى: ${product.name || product.id}`
        : `WhatsApp گۇرۇپپىسىغا يوللاش: ${product.name || product.id}`;
    }
    if (thumbEl) {
      thumbEl.src = product.image || 'images/default_product.jpg';
      thumbEl.alt = product.name || '';
    }

    modal.dataset.currentProductId = product.id;

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
   * 🌟 كۈندىلىك تەۋسىيەلىك تاۋارنى ئاپتوماتىك تاللاش (Featured / Daily Rotating Product)
   */
  function getTodayFeaturedProduct() {
    if (!window.appStore || typeof window.appStore.getProducts !== 'function') return null;
    const prods = window.appStore.getProducts().filter(p => (p.approvalStatus || 'تەستىقلاندى') === 'تەستىقلاندى' && p.stock > 0);
    if (!prods || prods.length === 0) return null;

    // ئالدى بىلەن كۆز ئاسراش مەجۇنى (PRD-226) ياكى يېڭى تاۋارلارغا ئالدىنقى ئورۇن بېرىلىدۇ
    const eyeProduct = prods.find(p => p.id === 'PRD-226');
    if (eyeProduct) return eyeProduct;

    // كۈن بويىچە نۆۋەتلىشىپ تاۋار ئايلاندۇرۇش (Deterministic daily rotation)
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const idx = dayOfYear % prods.length;
    return prods[idx];
  }

  /**
   * ⏰ ھەركۈنى كەچ سائەت 20:30 (8:30 PM) دا ئاپتوماتىك ئېلان چىقىرىشنى قوزغىتىش
   */
  function triggerDailyBroadcast(force = false) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const lastBroadcast = localStorage.getItem('teklimakan_last_daily_broadcast');

    if (!force && lastBroadcast === todayStr) {
      console.log('[WhatsAppBroadcaster] Today\'s 20:30 broadcast already executed:', todayStr);
      return;
    }

    const prod = getTodayFeaturedProduct();
    if (!prod) return;

    localStorage.setItem('teklimakan_last_daily_broadcast', todayStr);

    let settings = {};
    if (window.appStore && typeof window.appStore.getSettings === 'function') {
      settings = window.appStore.getSettings() || {};
    }

    // ئارقا سەپتە API تەڭشەلگەن بولسا، بىۋاستە ئەۋەتىدۇ
    if (settings.whatsappEnabled !== false && settings.whatsappAutoBroadcast && (settings.whatsappToken || settings.whatsappWebhookUrl)) {
      sendBackgroundGroupNotify(prod, { isDaily: true }).then(res => {
        if (res && res.success) {
          if (typeof window.showAdminToast === 'function') {
            window.showAdminToast('⏰ كۈندىلىك كەچ سائەت 8:30 ئېلانى WhatsApp توپىغا ئاپتوماتىك يوللاندى! 🌟', 'success');
          }
        } else {
          openBroadcastModal(prod, { isDaily: true });
        }
      }).catch(() => {
        openBroadcastModal(prod, { isDaily: true });
      });
    } else {
      // 1-چېكىش مودالىنى چىقىرىپ بېرىدۇ
      openBroadcastModal(prod, { isDaily: true });
      if (typeof window.showAdminToast === 'function') {
        window.showAdminToast('⏰ كۈندىلىك كەچ سائەت 8:30 ئېلان ۋاقتى كەلدى! تاۋار توپقا تەييارلاندى.', 'info');
      }
    }
  }

  /**
   * ⏱️ كۈندىلىك 20:30 ۋاقىت تەكشۈرگۈچىسىنى باشلاش (Timer)
   */
  function initDailyBroadcastScheduler() {
    function checkTime() {
      try {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        // سائەت 20:30 بولغاندا (20:30 تىن 20:59 ئارىلىقىدا تۇنجى قېتىم)
        if (hours === 20 && minutes >= 30) {
          triggerDailyBroadcast(false);
        }
      } catch (err) {
        console.warn('[WhatsAppBroadcaster] Scheduler check error:', err);
      }
    }

    // ھەر 60 سېكۇنتتا بىر قېتىم تەكشۈرۈپ تۇرىدۇ
    setInterval(checkTime, 60000);
    // بەت ئېچىلغاندا بىر قېتىم تەكشۈرىدۇ
    setTimeout(checkTime, 3000);
  }

  /**
   * 📢 يېڭى تاۋار ئېلان قىلىنغاندا ئاپتوماتىك چاقىرىلىدىغان ئۇقتۇرۇش
   */
  async function notifyNewProduct(product, context = {}) {
    if (!product) return;

    let settings = {};
    if (window.appStore && typeof window.appStore.getSettings === 'function') {
      settings = window.appStore.getSettings() || {};
    }

    if (settings.whatsappEnabled !== false && settings.whatsappAutoBroadcast && (settings.whatsappToken || settings.whatsappWebhookUrl)) {
      try {
        const res = await sendBackgroundGroupNotify(product);
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
        openBroadcastModal(product);
      }, 500);
    }
  }

  // ئاپتوماتىك ۋاقىت كۆزەتكۈچىنى باشلاش
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initDailyBroadcastScheduler);
    } else {
      initDailyBroadcastScheduler();
    }
  }

  // ئاشكارا قىلىش (Export to window)
  window.TeklimakanWhatsApp = {
    SITE_BASE_URL,
    DEFAULT_WHATSAPP_GROUP_LINK,
    DEFAULT_INSTAGRAM_URL,
    DEFAULT_PHONE_1,
    DEFAULT_PHONE_2,
    transliterateToSlug,
    getProductCanonicalUrl,
    getMandatoryFooter,
    formatProductBroadcastText,
    getWhatsAppShareUrl,
    openGroupShare,
    sendBackgroundGroupNotify,
    openBroadcastModal,
    closeBroadcastModal,
    getTodayFeaturedProduct,
    triggerDailyBroadcast,
    notifyNewProduct
  };

})(typeof window !== 'undefined' ? window : this);
