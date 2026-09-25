/**
 * ================================================================
 * 🛍️ تەكلىماكان سودا سۇپىسى — تور خەۋەرلەندۈرۈشى ۋە كۆپ تىل باشقۇرغۇچى
 * Web Push Notifications & Language Visit History Manager
 * ================================================================
 */

const TEKLIMAKAN_VAPID_PUBLIC_KEY = 'BAXOIUtWkKnGqG16ZAFssSTkOQmWxxik80IgvJgdlSl2lCDzyOhXpxV3i6heUBA-EERML2iPSNo3aG9PCnIq9xI';

class PushNotificationManager {
  constructor() {
    this.vapidPublicKey = TEKLIMAKAN_VAPID_PUBLIC_KEY;
    this.swRegistration = null;
    this.init();
  }

  async init() {
    // 1. زىيارەت تىلىنى خاتىرىلەش ۋە 2-3 قېتىملىق تىل تارىخىنى ئانالىز قىلىش
    const currentLang = this.getCurrentLang();
    this.recordLanguageVisit(currentLang);

    // 2. تېلېفون/تور كۆرگۈچ Push نى قوللامدۇ تەكشۈرۈش
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      console.log('ℹ️ بۇ ئۈسكۈنە تور Push ئەسكەرتىشىنى قوللىمايدۇ.');
      return;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      console.log('✅ ServiceWorker مۇۋەپپەقىيەتلىك رويخەتكە ئېلىندى.');

      // ئاللىقاچان رۇخسەت بېرىلگەن بولسا، ئەڭ يېڭى تىل تەڭشىكى بىلەن بۇلۇتقا يېڭىلاپ قويۇش
      if (Notification.permission === 'granted') {
        this.syncSubscriptionLanguage();
      } else if (Notification.permission === 'default') {
        // ئەگەر رۇخسەت بەلگىلەنمىگەن بولسا، سىپتا چىرايلىق كۆزنەك چىقىرىپ سۈرۈشتۈرۈش
        this.scheduleGentlePrompt();
      }
    } catch (err) {
      console.warn('ServiceWorker تىزىملاشتا خاتالىق:', err);
    }
  }

  getCurrentLang() {
    try {
      if (window.appI18n && typeof window.appI18n.getLang === 'function') {
        return window.appI18n.getLang() || 'ug';
      }
      return localStorage.getItem('teklimakan_language') || 'ug';
    } catch (e) {
      return 'ug';
    }
  }

  // 🧠 2 ياكى 3 قېتىملىق زىيارەت تىلىنى خاتىرىلەش ۋە باھالاش مېخانىزمى
  recordLanguageVisit(lang) {
    if (!['ug', 'tr', 'en'].includes(lang)) return;
    try {
      const STORAGE_KEY = 'teklimakan_visit_lang_sessions';
      let sessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const now = Date.now();

      // ئەگەر ئاخىرقى زىيارەتتىن 10 مىنۇت ئۆتكەن بولسا ياكى تىل ئالماشتۇرۇلغان بولسا، يېڭى سېسسىيە دەپ خاتىرىلەش
      const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
      if (!lastSession || (now - lastSession.time > 10 * 60 * 1000) || lastSession.lang !== lang) {
        sessions.push({ lang: lang, time: now });
        if (sessions.length > 6) {
          sessions = sessions.slice(-6); // ئاخىرقى 6 قېتىملىقنىلا ساقلاش
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      }

      // ئاخىرقى 2-3 قېتىملىق زىيارەت خاتىرىسىدىن ئاساسلىق تىلنى تېپىش
      const detectedLang = this.evaluateDominantLanguage(sessions);
      localStorage.setItem('teklimakan_preferred_push_lang', detectedLang);

      // ئەگەر ئاللىقاچان رۇخسەت بېرىلگەن بولسا، بۇلۇتتىكى تىل بەلگىسىنىمۇ يېڭىلاش
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        this.syncSubscriptionLanguage();
      }
    } catch (e) {
      console.warn('تىل زىيارەت تارىخىنى خاتىرىلەشتە خاتالىق:', e);
    }
  }

  // ئاخىرقى 2-3 قېتىملىق زىيارەت تارىخىدىن ئاساسىي تىلنى بەلگىلەش
  evaluateDominantLanguage(sessions) {
    if (!sessions || sessions.length === 0) return this.getCurrentLang();
    
    // ئاخىرقى 3 سېسسىيەنى تاللاش
    const recent = sessions.slice(-3);
    const counts = { ug: 0, tr: 0, en: 0 };
    for (const s of recent) {
      if (counts[s.lang] !== undefined) counts[s.lang]++;
    }

    // ئەگەر بىر تىل 2 ياكى 3 قېتىم كۆرۈلگەن بولسا، شۇ تىل بايرىقى چىقىدۇ
    if (counts.tr >= 2) return 'tr';
    if (counts.en >= 2) return 'en';
    if (counts.ug >= 2) return 'ug';

    // ئەگەر ئوخشاش بولماي قالسا، ئەڭ ئاخىرقى تاللانغان تىل ئاساس قىلىنىدۇ
    return recent[recent.length - 1].lang || this.getCurrentLang();
  }

  getDetectedLanguage() {
    try {
      return localStorage.getItem('teklimakan_preferred_push_lang') || this.getCurrentLang() || 'ug';
    } catch (e) {
      return 'ug';
    }
  }

  // 🔔 زىيارەتچىگە سىپتا، كۆركەم، مەجبۇرلىمايدىغان كۆزنەك چىقىرىپ بېرىش
  scheduleGentlePrompt() {
    try {
      const dismissedUntil = localStorage.getItem('teklimakan_push_dismissed_until');
      if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
        return; // خېرىدار «ھازىر ئەمەس» نى باسقان بولسا 5 كۈنگىچە ئاۋارە قىلماسلىق
      }
    } catch (e) {}

    // بەت ئېچىلىپ 4 سېكۇنت ئۆتكەندە كۆزنەكنى چىرايلىق سىيرىپ چىقىرىش
    setTimeout(() => {
      this.renderPromptUI();
    }, 4000);
  }

  renderPromptUI() {
    if (document.getElementById('teklimakanPushPromptModal')) return;
    if (Notification.permission !== 'default') return;

    const lang = this.getCurrentLang();
    const isRtl = lang === 'ug';

    const texts = {
      ug: {
        title: '🔔 يېڭى چۈشۈرۈم ۋە مەھسۇلاتلاردىن خەۋەردار بولامسىز؟',
        desc: 'ئەزا بولۇش كەتمەيدۇ! يېڭى ئېتىبار پائالىيىتى ياكى ئەڭ ياخشى مەھسۇلاتلار چىققاندا تېلېفونىڭىزغا قولايلىق ئەسكەرتىش چىقىدۇ.',
        allow: 'قوشۇلىمەن',
        later: 'ھازىر ئەمەس'
      },
      tr: {
        title: '🔔 Yeni İndirim ve Ürünlerden Anında Haberdar Olun!',
        desc: 'Üye olmanıza gerek yok! Yeni ürünler ve özel kampanyalar çıktığında telefonunuza anında bildirim gelsin.',
        allow: 'İzin Ver',
        later: 'Şimdi Değil'
      },
      en: {
        title: '🔔 Stay updated on new deals and products!',
        desc: 'No sign-up required! Get instant notifications on your phone for new arrivals and exclusive promotions.',
        allow: 'Allow',
        later: 'Not Now'
      }
    }[lang] || texts['ug'];

    const container = document.createElement('div');
    container.id = 'teklimakanPushPromptModal';
    container.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      left: 24px;
      max-width: 440px;
      margin: 0 auto;
      background: #ffffff;
      border: 1.5px solid #3b82f6;
      border-radius: 16px;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(59, 130, 246, 0.2);
      padding: 18px 20px;
      z-index: 999999;
      font-family: inherit;
      animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;

    container.innerHTML = `
      <style>
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
      <div style="display: flex; align-items: flex-start; gap: 14px;">
        <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #1e3a8a, #2563eb); display: flex; align-items: center; justify-content: center; font-size: 1.35rem; color: #ffffff; flex-shrink: 0; box-shadow: 0 4px 12px rgba(37,99,235,0.3);">
          🔔
        </div>
        <div style="flex: 1;">
          <h4 style="margin: 0 0 6px 0; font-size: 1.02rem; font-weight: 800; color: #1e293b; line-height: 1.4;">${texts.title}</h4>
          <p style="margin: 0; font-size: 0.86rem; color: #64748b; line-height: 1.55;">${texts.desc}</p>
        </div>
      </div>
      <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 4px;">
        <button type="button" id="btnPushDismiss" style="padding: 9px 16px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 10px; color: #64748b; font-weight: 700; font-size: 0.86rem; cursor: pointer; transition: all 0.2s;">
          ${texts.later}
        </button>
        <button type="button" id="btnPushAccept" style="padding: 9px 20px; background: linear-gradient(135deg, #1e3a8a, #2563eb); border: none; border-radius: 10px; color: #ffffff; font-weight: 800; font-size: 0.88rem; cursor: pointer; box-shadow: 0 4px 12px rgba(37,99,235,0.35); transition: all 0.2s;">
          ${texts.allow}
        </button>
      </div>
    `;

    document.body.appendChild(container);

    document.getElementById('btnPushDismiss').addEventListener('click', () => {
      this.dismissPrompt(5); // 5 كۈن كۆرسەتمەسلىك
    });

    document.getElementById('btnPushAccept').addEventListener('click', () => {
      this.requestAndSubscribe();
    });
  }

  dismissPrompt(days = 5) {
    const el = document.getElementById('teklimakanPushPromptModal');
    if (el) el.remove();
    try {
      const until = Date.now() + days * 24 * 60 * 60 * 1000;
      localStorage.setItem('teklimakan_push_dismissed_until', until.toString());
    } catch (e) {}
  }

  // 🚀 رۇخسەت سوراش ۋە يانفوننى مۇشتەرى قىلىش
  async requestAndSubscribe() {
    const el = document.getElementById('teklimakanPushPromptModal');
    if (el) el.remove();

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('⚠️ ئىشلەتكۈچى خەۋەرلەندۈرۈشكە رۇخسەت قىلمىدى.');
        return false;
      }

      if (!this.swRegistration) {
        this.swRegistration = await navigator.serviceWorker.ready;
      }

      // VAPID بىلەن PushManager غا مۇشتەرى بولۇش
      let subscription = await this.swRegistration.pushManager.getSubscription();
      if (!subscription) {
        const applicationServerKey = this.urlB64ToUint8Array(this.vapidPublicKey);
        subscription = await this.swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        });
      }

      // مۇشتەرى ئۇچۇرىنى تىل بايرىقى بىلەن بۇلۇتقا ساقلاش
      await this.saveSubscriptionToCloud(subscription);

      // تۇنجى قېتىم خېرىدارنىڭ ئېكرانىدا سىناق قارشى ئېلىش خەۋىرى چىقىرىپ بېرىش!
      this.showWelcomeNotification();
      return true;
    } catch (err) {
      console.warn('Push مۇشتەرى قىلىشتا خاتالىق كۆرۈلدى:', err);
      return false;
    }
  }

  // تۇنجى تېلېفون ئەسكەرتىشىنى سىناق چىقىرىش
  showWelcomeNotification() {
    const lang = this.getDetectedLanguage();
    const welcomeMessages = {
      ug: {
        title: '🎉 تەكلىماكان سۇپىسىغا كەلگىنىڭىزنى قارشى ئالىمىز!',
        body: 'ئەسكەرتىش مۇۋەپپەقىيەتلىك قوزغىتىلدى. يېڭى چۈشۈرۈم ۋە مەھسۇلاتلار تېلېفونىڭىزغا قەرەللىك كېلىپ تۇرىدۇ.',
        url: '/'
      },
      tr: {
        title: '🎉 Teklimakan Bildirimleri Aktif Edildi!',
        body: 'Yeni indirim ve özel kampanyalar doğrudan telefonunuza gelecek. İyi alışverişler dileriz!',
        url: '/?lang=tr'
      },
      en: {
        title: '🎉 Teklimakan Notifications Enabled!',
        body: 'You will now receive instant alerts for exclusive deals and new arrivals. Enjoy shopping!',
        url: '/?lang=en'
      }
    };

    const msg = welcomeMessages[lang] || welcomeMessages['ug'];
    if (this.swRegistration && this.swRegistration.showNotification) {
      this.swRegistration.showNotification(msg.title, {
        body: msg.body,
        icon: '/images/logo_circle.png',
        badge: '/images/favicon-32x32.png',
        dir: lang === 'ug' ? 'rtl' : 'ltr',
        lang: lang,
        data: { url: msg.url }
      });
    }
  }

  // بۇلۇت بازىسىغا ساقلاش
  async saveSubscriptionToCloud(subscription) {
    if (!subscription) return;
    try {
      const subJson = subscription.toJSON();
      const detectedLang = this.getDetectedLanguage();
      const sessions = JSON.parse(localStorage.getItem('teklimakan_visit_lang_sessions') || '[]');

      const payload = {
        endpoint: subscription.endpoint,
        p256dh: subJson.keys ? subJson.keys.p256dh : '',
        auth: subJson.keys ? subJson.keys.auth : '',
        preferred_lang: detectedLang,
        lang_history: sessions.map(s => s.lang).join(','),
        user_agent: navigator.userAgent,
        updated_at: new Date().toISOString()
      };

      if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.savePushSubscription === 'function') {
        await window.TeklimakanSupabase.savePushSubscription(payload);
      }
    } catch (e) {
      console.warn('saveSubscriptionToCloud خاتالىقى:', e);
    }
  }

  // تىل ئۆزگەرگەندە ياكى قايتا كىرگەندە تىل بەلگىسىنى بۇلۇتتا ماسلاشتۇرۇپ قويۇش
  async syncSubscriptionLanguage() {
    if (!this.swRegistration) return;
    try {
      const sub = await this.swRegistration.pushManager.getSubscription();
      if (sub) {
        await this.saveSubscriptionToCloud(sub);
      }
    } catch (e) {}
  }

  urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

// يەر شارى خاراكتېرلىك ئوبيېكت
window.TeklimakanPush = new PushNotificationManager();
