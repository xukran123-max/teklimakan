/**
 * ================================================================
 * 🚀 تەكلىماكان سۇپىسى — مەركىزىي Telegram ئاپتوماتىك ئۇقتۇرۇش سىستېمىسى
 * Teklimakan Central Telegram Notifier (Photo + Caption + Realtime)
 * ================================================================
 * توربېكەت ۋە ئەپكە يوللانغان ھەرقانداق يېڭى تاۋار، مەزمۇن ۋە زاكازلارنى
 * رەسىمى ۋە تولۇق تەپسىلاتى بىلەن بىللە Telegram غا يەتكۈزۈپ بېرىدۇ.
 */

(function(window) {
  'use strict';

  const DEFAULT_BOT_TOKEN = '8880936621:AAG7d5C4CPVyA8XiP0cPYUFYPfJmkF6DWZM';
  const DEFAULT_CHAT_ID = '7077223578';
  const BASE_SITE_URL = 'https://teklimakan.com';

  function getCredentials() {
    let botToken = DEFAULT_BOT_TOKEN;
    let chatId = DEFAULT_CHAT_ID;
    let enabled = true;

    try {
      if (window.appStore && typeof window.appStore.getSettings === 'function') {
        const s = window.appStore.getSettings() || {};
        if (s.telegramEnabled === false) enabled = false;
        if (s.telegramBotToken && s.telegramBotToken.trim().length > 15) {
          botToken = s.telegramBotToken.trim();
        }
        if (s.telegramChatId && String(s.telegramChatId).trim().length > 3) {
          chatId = String(s.telegramChatId).trim();
        }
      }
    } catch (e) {
      console.warn('[TelegramNotifier] Could not read settings:', e);
    }

    return { botToken, chatId, enabled };
  }

  function resolveFullImageUrl(url) {
    if (!url) return '';
    const clean = String(url).trim();
    if (!clean || clean === 'images/default_product.jpg' || clean === 'images/default-product.png') {
      return `${BASE_SITE_URL}/images/products/tuxum-yeghi.webp`;
    }
    if (clean.startsWith('data:image')) {
      return clean; // Base64 data URL
    }
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      return clean;
    }
    const cleanPath = clean.replace(/^\/+/, '');
    return `${BASE_SITE_URL}/${cleanPath}`;
  }

  function dataURItoBlob(dataURI) {
    try {
      const parts = dataURI.split(',');
      const mime = parts[0].match(/:(.*?);/)[1];
      const binary = atob(parts[1]);
      const array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], { type: mime });
    } catch (e) {
      console.warn('[TelegramNotifier] dataURItoBlob failed:', e);
      return null;
    }
  }

  async function sendTelegramMessage(text) {
    const { botToken, chatId, enabled } = getCredentials();
    if (!enabled) return false;

    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
          disable_web_page_preview: false
        })
      });
      const data = await res.json();
      return data && data.ok;
    } catch (err) {
      console.warn('[TelegramNotifier] sendMessage error:', err);
      return false;
    }
  }

  async function sendTelegramPhoto(photoUrlOrData, caption) {
    const { botToken, chatId, enabled } = getCredentials();
    if (!enabled) return false;

    const fullPhoto = resolveFullImageUrl(photoUrlOrData);

    // 1. ئەگەر سۈرەت بولمىسا بىۋاسىتە ئۇچۇر قىلىپ يوللاش
    if (!fullPhoto) {
      return await sendTelegramMessage(caption);
    }

    // 2. ئەگەر Base64 بولسا FormData ئارقىلىق بىنارىي ھۆججەت قىلىپ يوللاش
    if (fullPhoto.startsWith('data:image')) {
      try {
        const blob = dataURItoBlob(fullPhoto);
        if (blob) {
          const fd = new FormData();
          fd.append('chat_id', chatId);
          fd.append('photo', blob, 'product.jpg');
          fd.append('caption', caption);
          fd.append('parse_mode', 'HTML');

          const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
            method: 'POST',
            body: fd
          });
          const data = await res.json();
          if (data && data.ok) return true;
        }
      } catch (e) {
        console.warn('[TelegramNotifier] sendPhoto FormData error:', e);
      }
      // Base64 يوللانمىسا يەنىلا تېكىستلىك ئەۋەتىلىدۇ
      return await sendTelegramMessage(caption);
    }

    // 3. تور ئادرېسى بولسا بىۋاسىتە JSON ئارقىلىق يوللاش
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: fullPhoto,
          caption: caption,
          parse_mode: 'HTML'
        })
      });
      const data = await res.json();
      if (data && data.ok) {
        return true;
      } else {
        console.warn('[TelegramNotifier] sendPhoto remote failed, trying sendMessage fallback:', data);
        const fallbackText = `${caption}\n\n🖼️ <b>مەھسۇلات رەسىمى:</b> <a href="${fullPhoto}">رەسىمنى ئېچىپ كۆرۈش</a>`;
        return await sendTelegramMessage(fallbackText);
      }
    } catch (err) {
      console.warn('[TelegramNotifier] sendPhoto network error:', err);
      const fallbackText = `${caption}\n\n🖼️ <b>مەھسۇلات رەسىمى:</b> <a href="${fullPhoto}">رەسىمنى ئېچىپ كۆرۈش</a>`;
      return await sendTelegramMessage(fallbackText);
    }
  }

  // ================================================================
  // 📦 1. يېڭى تاۋار ئېلان قىلىنغاندا ياكى سۇنۇلغاندا
  // ================================================================
  async function notifyNewProduct(product, submitter = null, isEdit = false) {
    if (!product) return;

    const price = product.price ? `${product.price} TL` : 'كۆرسىتىلمىگەن';
    const oldPrice = product.oldPrice ? `${product.oldPrice} TL` : (product.old_price ? `${product.old_price} TL` : null);
    const priceText = oldPrice ? `<b>${price}</b> (ئەسلى باھاسى: <s>${oldPrice}</s>)` : `<b>${price}</b>`;

    const subName = submitter && submitter.name ? submitter.name : 'ئالىي باشقۇرغۇچى';
    const subPhone = submitter && submitter.phone ? ` • 📞 <code>${submitter.phone}</code>` : '';
    const subId = submitter && submitter.id ? ` (<code>${submitter.id}</code>)` : '';

    const isPending = (product.approvalStatus === 'تەستىق كۈتۈۋاتىدۇ');
    const statusText = isPending ? '⏳ <b>تەستىق كۈتۈۋاتىدۇ (دۇكاندا كۆرۈنمەيدۇ)</b>' : '✅ <b>تەستىقلاندى (دۇكاندا بىۋاسىتە ئېلان قىلىندى)</b>';

    const actionTitle = isEdit 
      ? '📝 <b>[تاۋار ئۇچۇرى / باھاسى ئۆزگەرتىلدى] — تەكلىماكان سۇپىسى</b>' 
      : '📦 <b>[يېڭى تاۋار يوللاندى] — تەكلىماكان سۇپىسى</b>';

    const desc = (product.description || '').trim();
    const shortDesc = desc.length > 280 ? desc.substring(0, 275) + '...' : desc;

    const adminUrl = 'https://teklimakan.com/seidiye';
    const storeUrl = product.id ? `https://teklimakan.com/p/${product.id.toLowerCase()}` : 'https://teklimakan.com';

    const caption = `${actionTitle}\n\n` +
      `🏷️ <b>نامى:</b> <b>${product.name}</b>\n` +
      `💰 <b>سېتىلىش باھاسى:</b> ${priceText}\n` +
      `📂 <b>تۈرى:</b> ${product.category || 'ئومۇمىي'}\n` +
      `🏷️ <b>ماركىسى:</b> ${product.brand || 'تەكلىماكان تورى'}\n` +
      `⚖️ <b>بىرلىكى:</b> ${product.unit || 'دانە'} | 📊 <b>زاپاس:</b> ${product.stock || 0} دانە\n` +
      `👤 <b>يوللىغۇچى:</b> <b>${subName}</b>${subId}${subPhone}\n` +
      `🚦 <b>ھالىتى:</b> ${statusText}\n` +
      (shortDesc ? `📝 <b>چۈشەندۈرۈشى:</b>\n<i>${shortDesc}</i>\n` : '') +
      `\n⏰ <b>ۋاقتى:</b> ${new Date().toLocaleString()}\n\n` +
      `🔗 <a href="${adminUrl}">👉 باشقۇرۇش سۇپىسىدىن كۆرۈش / تەستىقلاش</a> | <a href="${storeUrl}">🌐 دۇكان كۆرۈنۈشى</a>`;

    return await sendTelegramPhoto(product.image, caption);
  }

  // ================================================================
  // 🛒 2. خېرىدار يېڭى زاكاز بەرگەندە
  // ================================================================
  async function notifyNewOrder(order) {
    if (!order) return;

    let itemsList = '';
    let firstProductImage = '';

    if (order.items && Array.isArray(order.items)) {
      itemsList = order.items.map((it, idx) => {
        if (!firstProductImage && it.image) {
          firstProductImage = it.image;
        }
        const unitStr = it.unit ? ` (${it.unit})` : '';
        const priceStr = it.priceFormatted || (it.price + ' TL');
        return `${idx + 1}. <b>${it.name}</b> × <b>${it.quantity}</b>${unitStr} — <code>${priceStr}</code>`;
      }).join('\n');
    }

    const custName = order.customer?.name || 'نامەلۇم خېرىدار';
    const custPhone = order.customer?.phone || '';
    const custCity = order.customer?.city || '';
    const custAddr = order.customer?.address || '';
    const payMethod = order.paymentMethod || 'بانكا / كارتا';
    const total = order.totalFormatted || (order.total + ' TL');

    const adminUrl = 'https://teklimakan.com/seidiye';

    const caption = `🛒 <b>[يېڭى خېرىدار زاكاز چۈشۈردى!] — تەكلىماكان</b>\n\n` +
      `🆔 <b>زاكاز نومۇرى:</b> <code>#${order.id}</code>\n` +
      `👤 <b>خېرىدار:</b> <b>${custName}</b>\n` +
      `📞 <b>تېلېفونى:</b> <code>${custPhone}</code>\n` +
      `📍 <b>ئادرېسى:</b> ${custCity} ${custAddr}\n` +
      `💳 <b>چىقىم ئۇسۇلى:</b> ${payMethod}\n` +
      `💰 <b>ئومۇمىي سومما:</b> <b>${total}</b>\n\n` +
      `📦 <b>سېتىۋالغان ماللار تىزىملىكى:</b>\n${itemsList}\n` +
      (order.notes ? `\n📝 <b>خېرىدار ئىزاھاتى:</b> <i>${order.notes}</i>\n` : '') +
      `\n⏰ <b>زاكاز ۋاقتى:</b> ${new Date().toLocaleString()}\n\n` +
      `🔗 <a href="${adminUrl}">👉 زاكازنى بىر تەرەپ قىلىش (باشقۇرۇش مەركىزى)</a>`;

    return await sendTelegramPhoto(firstProductImage, caption);
  }

  // ================================================================
  // 👤 3. يېڭى سېتىش ۋاكالەتچىسى ئىلتىماس سۇنغاندا
  // ================================================================
  async function notifyAgentApply(agent) {
    if (!agent) return;

    const waLink = agent.phone ? `https://wa.me/${String(agent.phone).replace(/\D/g, '')}` : '';
    const adminUrl = 'https://teklimakan.com/seidiye';

    let caption = `👤 <b>[يېڭى سېتىش ۋاكالەتچىسى ئىلتىماسى] — تەكلىماكان</b>\n\n` +
      `👤 <b>ئىسىم-فامىلىسى:</b> <b>${agent.name}</b>\n` +
      `📞 <b>تېلېفون:</b> <code>${agent.phone || '-'}</code>\n` +
      `📧 <b>ئېلخەت:</b> <code>${agent.email || '-'}</code>\n` +
      `🏷️ <b>تەلەپ قىلغان ماركا / تۈر:</b> ${agent.proposedBrands || 'ئومۇمىي'}\n` +
      `📦 <b>سېتىش ئۇسۇلى:</b> ${agent.salesMethod || 'ئۆزۈمنىڭ مەھسۇلاتى'}\n` +
      (agent.notes ? `📝 <b>ئىزاھات:</b> <i>${agent.notes}</i>\n` : '') +
      `\n⚠️ <b>ھالىتى:</b> ⏳ <b>تەستىق كۈتۈۋاتىدۇ</b>\n` +
      `⏰ <b>ۋاقتى:</b> ${new Date().toLocaleString()}\n\n`;

    if (waLink) {
      caption += `💬 <a href="${waLink}">📲 ئىلتىماس قىلغۇچى بىلەن WhatsApp ئارقىلىق سۆزلىشىش</a>\n`;
    }
    caption += `🔗 <a href="${adminUrl}">👉 ئارقا سۇپىدىن كۆرۈش ۋە تەستىقلاش</a>`;

    return await sendTelegramMessage(caption);
  }

  // ================================================================
  // 🚨 4. تاشقى ئۇلىنىش ياكى تېلېفون خىلاپلىقى بايقالغاندا
  // ================================================================
  async function notifyLinkViolation(agent, product, detectedLink, field) {
    const subName = agent ? agent.name : 'نامەلۇم';
    const subPhone = agent && agent.phone ? agent.phone : '';
    const subId = agent && agent.id ? agent.id : '';

    const caption = `🚨 <b>[بىخەتەرلىك ئاگاھلاندۇرۇشى: تاشقى نومۇر / ئۇلىنىش بايقالدى!]</b>\n\n` +
      `👤 <b>ۋاكالەتچى:</b> <b>${subName}</b> (<code>${subId}</code> • 📞 <code>${subPhone}</code>)\n` +
      `📦 <b>مەھسۇلات:</b> <b>${product.name || 'نامەلۇم'}</b>\n` +
      `💰 <b>باھاسى:</b> ${product.price || '-'} TL\n` +
      `🚫 <b>بايقالغان ئۇلىنىش / نومۇر:</b> <code>${detectedLink}</code>\n` +
      `📍 <b>بايقالغان ئورنى:</b> تاۋارنىڭ <b>${field || 'مەزمۇنىدا'}</b>\n\n` +
      `⚠️ <b>نەتىجىسى:</b> تاۋار دۇكاندىن تۇتۇپ قېلىندى ۋە سۇنغۇچى ھېساباتىغا جازا بېرىلدى.\n` +
      `⏰ <b>ۋاقتى:</b> ${new Date().toLocaleString()}`;

    return await sendTelegramPhoto(product ? product.image : '', caption);
  }

  // ================================================================
  // 💬 5. خېرىدار پىكىر-تەكلىپى ياكى ئالاقە ئۇچۇرى كەلگەندە
  // ================================================================
  async function notifyFeedback(feedback) {
    if (!feedback) return;

    const caption = `💬 <b>[خېرىداردىن يېڭى ئۇچۇر / تەكلىپ-پىكىر]</b>\n\n` +
      `👤 <b>ئىسىم:</b> <b>${feedback.name || 'نامەلۇم'}</b>\n` +
      `📞 <b>تېلېفون:</b> <code>${feedback.phone || '-'}</code>\n` +
      `📧 <b>ئېلخەت:</b> <code>${feedback.email || '-'}</code>\n` +
      `📝 <b>مەزمۇنى:</b>\n<i>${feedback.message || '-'}</i>\n\n` +
      `⏰ <b>ۋاقتى:</b> ${new Date().toLocaleString()}`;

    return await sendTelegramMessage(caption);
  }

  // سىستېمىغا ئاشكارىلاش (Global Exposure)
  const TeklimakanTelegram = {
    sendPhoto: sendTelegramPhoto,
    sendMessage: sendTelegramMessage,
    notifyNewProduct: notifyNewProduct,
    notifyNewOrder: notifyNewOrder,
    notifyAgentApply: notifyAgentApply,
    notifyLinkViolation: notifyLinkViolation,
    notifyFeedback: notifyFeedback,
    getCredentials: getCredentials
  };

  window.TeklimakanTelegram = TeklimakanTelegram;

})(typeof window !== 'undefined' ? window : this);
