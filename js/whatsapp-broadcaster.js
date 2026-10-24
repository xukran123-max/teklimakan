/**
 * ================================================================
 * 🚀 تەكلىماكان سۇپىسى — مەركىزىي WhatsApp گۇرۇپپا ئاپتوماتىك ئۇقتۇرۇش سىستېمىسى
 * Teklimakan Central WhatsApp Group Broadcaster (1-Click & Automated Cloud)
 * ================================================================
 * يېڭى تاۋار ئېلان قىلىنغان ياكى تەستىقلانغاندا، تاۋارنىڭ تولۇق تەپسىلاتى،
 * سۈزۈك رەسىم كارتىسى ۋە بىۋاستە زاكاز ئۇلانمىسىنى WhatsApp توپىغا ئاپتوماتىك يەتكۈزىدۇ.
 */

(function(window) {
  'use strict';

  const SITE_BASE_URL = 'https://teklimakan.com';
  const DEFAULT_WHATSAPP_SUPPORT = '+90 555 160 99 99';

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

    const lines = [
      '🌿 *تەكلىماكان سۇپىسى — يېڭى تەبىئىي مەھسۇلات ئېلان قىلىندى!*',
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
    lines.push(`📞 *زاكاز ۋە ئالاقە تېلېفونى:* ${DEFAULT_WHATSAPP_SUPPORT}`);
    lines.push('🚚 *تۈركىيە بويىچە تېز ھەم ئىشەنچلىك يەتكۈزۈش كاپالىتى بار!*');

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
  function openGroupShare(productOrId) {
    let product = productOrId;
    if (typeof productOrId === 'string' && window.appStore && typeof window.appStore.getProductById === 'function') {
      product = window.appStore.getProductById(productOrId);
    }
    if (!product) {
      alert('تاۋار ئۇچۇرى تېپىلمىدى!');
      return;
    }

    const text = formatProductBroadcastText(product);
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
    const chatId = options.chatId || settings.whatsappGroupId || '';
    const webhookUrl = options.webhookUrl || settings.whatsappWebhookUrl || '';

    const text = options.text || formatProductBroadcastText(product);
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
  function openBroadcastModal(productOrId) {
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
      // Modal بولمىسا بىۋاستە 1-چېكىش ئارقىلىق ئېچىۋېرىدۇ
      openGroupShare(product);
      return;
    }

    const textarea = document.getElementById('whatsappBroadcastText');
    const titleEl = document.getElementById('whatsappBroadcastModalTitle');
    const thumbEl = document.getElementById('whatsappBroadcastModalThumb');
    const sendApiBtn = document.getElementById('btnSendWhatsAppApi');

    const formattedText = formatProductBroadcastText(product);

    if (textarea) textarea.value = formattedText;
    if (titleEl) titleEl.textContent = `WhatsApp توپىغا يوللاش: ${product.name || product.id}`;
    if (thumbEl) {
      thumbEl.src = product.image || 'images/default_product.jpg';
      thumbEl.alt = product.name || '';
    }

    // Modal ئارقا تەرەپكە تاۋارنى ساقلاپ قويۇش
    modal.dataset.currentProductId = product.id;

    // ئارقا سەپ API تەڭشەكلىرى بار-يوقلۇقىنى تەكشۈرۈش
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
   * 📢 يېڭى تاۋار ئېلان قىلىنغاندا ئاپتوماتىك چاقىرىلىدىغان ئۇقتۇرۇش
   */
  async function notifyNewProduct(product, context = {}) {
    if (!product) return;

    let settings = {};
    if (window.appStore && typeof window.appStore.getSettings === 'function') {
      settings = window.appStore.getSettings() || {};
    }

    // ئەگەر ئارقا سەپتە API تەڭشەلگەن بولسا ھەم autoBroadcast ئوچۇق بولسا
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

    // ئەگەر ئارقا سەپ ئاپتوماتىك ئەۋەتمىگەن بولسا ياكى چىرايلىق تەستىق تەلەپ قىلسا، Modal نى ئېچىپ بېرىدۇ
    if (settings.whatsappEnabled !== false) {
      setTimeout(() => {
        openBroadcastModal(product);
      }, 500);
    }
  }

  // ئاشكارا قىلىش (Export to window)
  window.TeklimakanWhatsApp = {
    SITE_BASE_URL,
    transliterateToSlug,
    getProductCanonicalUrl,
    formatProductBroadcastText,
    getWhatsAppShareUrl,
    openGroupShare,
    sendBackgroundGroupNotify,
    openBroadcastModal,
    closeBroadcastModal,
    notifyNewProduct
  };

})(window);
