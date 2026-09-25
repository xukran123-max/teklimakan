/**
 * ================================================================
 * 🛍️ تەكلىماكان سودا سۇپىسى — 3 خىل ئۇسۇلنى بىرلەشتۈرگەن ئەقىللىق Push خەۋەرلەندۈرۈش باشقۇرغۇچىسى
 * (Smart 3-Stage Push Funnel: 1. Coupon Gift -> 2. Wishlist/Cart -> 3. Order Cargo Tracking)
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

    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      console.log('ℹ️ بۇ ئۈسكۈنە تور Push ئەسكەرتىشىنى قوللىمايدۇ.');
      return;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

      if (Notification.permission === 'granted') {
        this.syncSubscriptionLanguage();
      } else if (Notification.permission === 'default') {
        // 🎯 1-باسقۇچ: بەتكە كىرگەندە 50 لىرالىق سوۋغات كۇپونى تەكلىپىنى كۆرسىتىش
        this.scheduleGiftCouponPrompt();
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

  // 🧠 2 ياكى 3 قېتىملىق زىيارەت تىلىنى باھالاش
  recordLanguageVisit(lang) {
    if (!['ug', 'tr', 'en'].includes(lang)) return;
    try {
      const STORAGE_KEY = 'teklimakan_visit_lang_sessions';
      let sessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const now = Date.now();

      const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
      if (!lastSession || (now - lastSession.time > 10 * 60 * 1000) || lastSession.lang !== lang) {
        sessions.push({ lang: lang, time: now });
        if (sessions.length > 6) sessions = sessions.slice(-6);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      }

      const detectedLang = this.evaluateDominantLanguage(sessions);
      localStorage.setItem('teklimakan_preferred_push_lang', detectedLang);

      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        this.syncSubscriptionLanguage();
      }
    } catch (e) {}
  }

  evaluateDominantLanguage(sessions) {
    if (!sessions || sessions.length === 0) return this.getCurrentLang();
    const recent = sessions.slice(-3);
    const counts = { ug: 0, tr: 0, en: 0 };
    for (const s of recent) {
      if (counts[s.lang] !== undefined) counts[s.lang]++;
    }
    if (counts.tr >= 2) return 'tr';
    if (counts.en >= 2) return 'en';
    if (counts.ug >= 2) return 'ug';
    return recent[recent.length - 1].lang || this.getCurrentLang();
  }

  getDetectedLanguage() {
    try {
      return localStorage.getItem('teklimakan_preferred_push_lang') || this.getCurrentLang() || 'ug';
    } catch (e) {
      return 'ug';
    }
  }

  // ==================== 🎯 1-باسقۇچ: 50 ₺ سوۋغات كۇپونى تاكتىكىسى ====================
  scheduleGiftCouponPrompt() {
    try {
      const dismissedUntil = localStorage.getItem('teklimakan_push_dismissed_until');
      if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
        return;
      }
    } catch (e) {}

    setTimeout(() => {
      this.renderGiftCouponModal();
    }, 3500);
  }

  renderGiftCouponModal() {
    if (document.getElementById('teklimakanGiftPromptModal')) return;
    if (typeof Notification !== 'undefined' && Notification.permission !== 'default') return;

    const lang = this.getCurrentLang();
    const isRtl = lang === 'ug';

    const texts = {
      ug: {
        badge: '🎁 تۇنجى كىرگۈچىلەرگە ئالاھىدە پائالىيەت',
        title: '50 ₺ نەق سوۋغات كۇپونىغا ئېرىشىڭ!',
        desc: 'تېلېفونىڭىزغا يېڭى پائالىيەت ئەسكەرتىشى ئېچىشنى قوزغىتىپ، بارلىق تاۋارلاردا ئىشلىتىلىدىغان 50 لىرالىق TEKLIMAKAN50 ئېتىبار كودىغا ھازىرلا ئېرىشىڭ.',
        allow: '🎁 50 ₺ كۇپوننى ئېلىش ۋە قوشۇلۇش',
        later: 'ھازىر ئەمەس'
      },
      tr: {
        badge: '🎁 İlk Alışverişe Özel Fırsat',
        title: '50 ₺ Hediye Kuponunuz Hazır!',
        desc: 'Bildirimleri açın, sepetinizde anında kullanabileceğiniz 50 TL indirim kodunu (TEKLIMAKAN50) kazanın ve indirimleri kaçırmayın.',
        allow: '🎁 50 ₺ Kuponu Al ve Aç',
        later: 'Daha Sonra'
      },
      en: {
        badge: '🎁 Exclusive Welcome Offer',
        title: 'Claim Your 50 ₺ Gift Coupon!',
        desc: 'Enable notifications to instantly unlock your 50 TL discount code (TEKLIMAKAN50) and stay tuned for exclusive sales.',
        allow: '🎁 Claim 50 ₺ Coupon & Enable',
        later: 'Not Now'
      }
    }[lang] || texts['ug'];

    const container = document.createElement('div');
    container.id = 'teklimakanGiftPromptModal';
    container.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      left: 20px;
      max-width: 460px;
      margin: 0 auto;
      background: #ffffff;
      border: 2px solid #eab308;
      border-radius: 18px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(234, 179, 8, 0.25);
      padding: 20px;
      z-index: 999999;
      animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;

    container.innerHTML = `
      <style>
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      </style>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="background: #fef08a; color: #854d0e; font-size: 0.78rem; font-weight: 800; padding: 3px 10px; border-radius: 9999px;">
          ${texts.badge}
        </span>
        <button type="button" id="btnGiftModalClose" style="background: none; border: none; font-size: 1.1rem; color: #94a3b8; cursor: pointer; padding: 2px 6px;">✕</button>
      </div>
      <div style="display: flex; align-items: flex-start; gap: 14px;">
        <div style="width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg, #eab308, #ca8a04); display: flex; align-items: center; justify-content: center; font-size: 1.7rem; color: #ffffff; flex-shrink: 0; box-shadow: 0 4px 15px rgba(202,138,4,0.35);">
          🎁
        </div>
        <div style="flex: 1;">
          <h4 style="margin: 0 0 6px 0; font-size: 1.12rem; font-weight: 900; color: #0f172a; line-height: 1.35;">${texts.title}</h4>
          <p style="margin: 0; font-size: 0.88rem; color: #475569; line-height: 1.55;">${texts.desc}</p>
        </div>
      </div>
      <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 6px;">
        <button type="button" id="btnGiftModalLater" style="padding: 10px 16px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 10px; color: #64748b; font-weight: 700; font-size: 0.86rem; cursor: pointer;">
          ${texts.later}
        </button>
        <button type="button" id="btnGiftModalClaim" style="padding: 10px 22px; background: linear-gradient(135deg, #1e3a8a, #2563eb); border: none; border-radius: 10px; color: #ffffff; font-weight: 800; font-size: 0.92rem; cursor: pointer; box-shadow: 0 4px 15px rgba(37,99,235,0.4); display: flex; align-items: center; gap: 6px;">
          ${texts.allow}
        </button>
      </div>
    `;

    document.body.appendChild(container);

    const closeFn = () => {
      container.remove();
      try {
        localStorage.setItem('teklimakan_push_dismissed_until', (Date.now() + 3 * 24 * 60 * 60 * 1000).toString());
      } catch (e) {}
    };

    document.getElementById('btnGiftModalClose').addEventListener('click', closeFn);
    document.getElementById('btnGiftModalLater').addEventListener('click', closeFn);
    document.getElementById('btnGiftModalClaim').addEventListener('click', () => {
      container.remove();
      this.requestAndSubscribe('coupon');
    });
  }

  // ==================== 🛒 2-باسقۇچ: سېۋەت ياكى ياقتۇرغانلار چېكىلگەندە چىقىرىش ====================
  triggerContextualPrompt(type = 'cart') {
    if (typeof Notification === 'undefined' || Notification.permission !== 'default') return;
    if (document.getElementById('teklimakanContextualPill') || document.getElementById('teklimakanGiftPromptModal')) return;

    // ئەگەر يېقىنقى 10 مىنۇتتا تاقىۋەتكەن بولسا ئاۋارە قىلماسلىق
    const pillDismissed = sessionStorage.getItem('teklimakan_contextual_pill_dismissed');
    if (pillDismissed) return;

    const lang = this.getCurrentLang();
    const isRtl = lang === 'ug';

    const msgText = type === 'wishlist'
      ? (lang === 'tr' ? '🔔 Bu ürünün fiyatı düştüğünde bildirim almak ister misiniz?' : (lang === 'en' ? '🔔 Want price drop alerts for this product?' : '🔔 بۇ مەھسۇلات باھاسى چۈشكەندە ئەسكەرتىش كېلەمدۇ؟'))
      : (lang === 'tr' ? '🔔 İndirim ve stok bildirimlerini açmak ister misiniz?' : (lang === 'en' ? '🔔 Enable alerts for restocks and discounts?' : '🔔 زاكاز ۋە ئېتىبار ئەسكەرتىشىنى تېلېفونىڭىزدا كۆرەمسىز؟'));

    const btnText = lang === 'tr' ? 'Aç' : (lang === 'en' ? 'Enable' : 'ئەسكەرتىلسۇن');

    const pill = document.createElement('div');
    pill.id = 'teklimakanContextualPill';
    pill.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    pill.style.cssText = `
      position: fixed;
      bottom: 78px;
      right: 16px;
      left: 16px;
      max-width: 440px;
      margin: 0 auto;
      background: #0f172a;
      color: #ffffff;
      border: 1.5px solid #3b82f6;
      border-radius: 14px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      padding: 12px 16px;
      z-index: 999998;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      animation: modalSlideUp 0.3s ease-out;
    `;

    pill.innerHTML = `
      <div style="font-size: 0.86rem; font-weight: 700; line-height: 1.4; flex: 1;">
        ${msgText}
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <button type="button" id="btnContextualAccept" style="background: #2563eb; color: #fff; border: none; border-radius: 8px; padding: 7px 14px; font-weight: 800; font-size: 0.84rem; cursor: pointer; white-space: nowrap;">
          ${btnText}
        </button>
        <button type="button" id="btnContextualClose" style="background: none; border: none; color: #94a3b8; font-size: 1.1rem; cursor: pointer; padding: 2px;">✕</button>
      </div>
    `;

    document.body.appendChild(pill);

    document.getElementById('btnContextualClose').addEventListener('click', () => {
      pill.remove();
      sessionStorage.setItem('teklimakan_contextual_pill_dismissed', 'true');
    });

    document.getElementById('btnContextualAccept').addEventListener('click', () => {
      pill.remove();
      this.requestAndSubscribe('contextual');
    });
  }

  // ==================== 🚚 3-باسقۇچ: زاكاز جەزملەنگەندە كارگو ئەسكەرتىشى ====================
  triggerOrderTrackingPrompt() {
    if (typeof Notification === 'undefined' || Notification.permission !== 'default') return;
    this.requestAndSubscribe('order');
  }

  showSystemGuideOverlay() {
    this.hideSystemGuideOverlay();
    const lang = this.getCurrentLang();
    const isRtl = lang === 'ug';
    const text = lang === 'tr'
      ? '👆 Lütfen yukarıdaki kutudan [İzin ver] seçeneğine dokunun'
      : (lang === 'en' ? '👆 Please tap [Allow / İzin ver] in the prompt above' : '👆 ئۈستىدىكى تېلېفون كۆزنىكىدىن [İzin ver / رۇخسەت] نى بېسىڭ');

    const overlay = document.createElement('div');
    overlay.id = 'teklimakanGuideOverlay';
    overlay.style.cssText = `
      position: fixed;
      top: 16px;
      left: 14px;
      right: 14px;
      max-width: 440px;
      margin: 0 auto;
      background: linear-gradient(135deg, #1e3a8a, #2563eb);
      color: #ffffff;
      padding: 12px 18px;
      border-radius: 14px;
      box-shadow: 0 12px 35px rgba(0,0,0,0.35);
      border: 2px solid #93c5fd;
      z-index: 10000000;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 0.94rem;
      font-weight: 800;
      direction: ${isRtl ? 'rtl' : 'ltr'};
      animation: pulseGuide 0.8s infinite alternate ease-in-out;
    `;
    overlay.innerHTML = `
      <style>
        @keyframes pulseGuide {
          from { transform: translateY(0); }
          to { transform: translateY(-4px); }
        }
      </style>
      <span style="font-size: 1.4rem;">☝️</span>
      <span>${text}</span>
    `;
    document.body.appendChild(overlay);
  }

  hideSystemGuideOverlay() {
    const el = document.getElementById('teklimakanGuideOverlay');
    if (el) el.remove();
  }

  // 🚀 ئەسكەرتىشكە قوشۇلۇش ۋە كۇپون تارقىتىش
  async requestAndSubscribe(source = 'coupon') {
    this.showSystemGuideOverlay();
    try {
      const permission = await Notification.requestPermission();
      this.hideSystemGuideOverlay();
      if (permission !== 'granted') return false;

      if (!this.swRegistration) {
        this.swRegistration = await navigator.serviceWorker.ready;
      }

      let subscription = await this.swRegistration.pushManager.getSubscription();
      if (!subscription) {
        const applicationServerKey = this.urlB64ToUint8Array(this.vapidPublicKey);
        subscription = await this.swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        });
      }

      await this.saveSubscriptionToCloud(subscription);

      // ئەگەر كۇپون ئارقىلىق ياكى ئومۇمىي تەرىپىدىن قوشۇلغان بولسا، 50 لىرالىق كۇپوننى خېرىدارغا ئاپتوماتىك تەقدىم قىلىش!
      this.activateCouponReward();

      // تېلېفونغا قارشى ئېلىش ئەسكەرتىشىنى رەسىمى ۋە كۇپون بىلەن چىقىرىش
      this.showWelcomeNotification(source);
      return true;
    } catch (err) {
      this.hideSystemGuideOverlay();
      console.warn('Push مۇشتەرى قىلىشتا خاتالىق:', err);
      return false;
    }
  }

  // 🎁 50 ₺ كۇپونىنى ئاپتوماتىك قوزغىتىش ۋە ئېكراندا خۇشخەۋەر كۆرسىتىش
  activateCouponReward() {
    try {
      localStorage.setItem('teklimakan_reward_coupon', 'TEKLIMAKAN50');
      // سېۋەتكە كۇپوننى تەييارلاپ قويۇش
      localStorage.setItem('teklimakan_pending_coupon', 'TEKLIMAKAN50');
    } catch (e) {}

    // كۆركەم قۇتۇپ چىقىرىش
    const lang = this.getCurrentLang();
    const isRtl = lang === 'ug';
    const alertHtml = `
      <div id="teklimakanCouponSuccessModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1000000; display: flex; align-items: center; justify-content: center; padding: 20px;">
        <div style="background: #ffffff; border-radius: 20px; max-width: 420px; width: 100%; padding: 26px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.3); direction: ${isRtl ? 'rtl' : 'ltr'}; font-family: inherit;">
          <div style="font-size: 3rem; margin-bottom: 8px;">🎉</div>
          <h3 style="font-size: 1.3rem; font-weight: 900; color: #15803d; margin: 0 0 8px 0;">
            ${lang === 'tr' ? '50 ₺ Kuponunuz Tanımlandı!' : (lang === 'en' ? '50 ₺ Coupon Unlocked!' : '50 ₺ لىق كۇپونىڭىز قوزغىتىلدى!')}
          </h3>
          <p style="font-size: 0.9rem; color: #64748b; margin: 0 0 16px 0; line-height: 1.5;">
            ${lang === 'tr' ? 'Alışverişinizde 50 TL indirim sağlayan özel kupon kodunuz:' : (lang === 'en' ? 'Your exclusive 50 TL discount code for checkout:' : 'زاكاز بەرگەندە 50 لىرا نەق چۈشۈرۈپ بېرىدىغان ئېتىبار كودىڭىز:')}
          </p>
          <div style="background: #f8fafc; border: 2px dashed #22c55e; border-radius: 12px; padding: 12px; font-size: 1.3rem; font-weight: 900; color: #166534; letter-spacing: 2px; margin-bottom: 18px;" class="number-latin">
            TEKLIMAKAN50
          </div>
          <button type="button" onclick="document.getElementById('teklimakanCouponSuccessModal').remove();" style="width: 100%; padding: 12px; background: #16a34a; color: white; border: none; border-radius: 10px; font-weight: 800; font-size: 1rem; cursor: pointer;">
            ${lang === 'tr' ? 'Harika, Alışverişe Başla' : (lang === 'en' ? 'Great, Start Shopping' : 'رەھمەت، سېتىۋېلىشنى باشلاش')}
          </button>
        </div>
      </div>
    `;

    const wrap = document.createElement('div');
    wrap.innerHTML = alertHtml;
    document.body.appendChild(wrap.firstElementChild);
  }

  showWelcomeNotification(source = 'coupon') {
    const lang = this.getDetectedLanguage();
    const welcomeMessages = {
      ug: {
        title: '🎁 50 ₺ لىق كۇپونىڭىز تەييار: TEKLIMAKAN50',
        body: 'تەكلىماكان ئەسكەرتىشى ئوڭۇشلۇق قوزغىتىلدى! زاكاز بەرگەندە 50 لىرالىق يېڭى پائالىيەت كودىدىن دەرھال بەھرىمەن بولۇڭ.',
        url: '/'
      },
      tr: {
        title: '🎁 50 ₺ İndirim Kuponunuz: TEKLIMAKAN50',
        body: 'Teklimakan bildirimleri aktif edildi! 50 TL indirim kodunuz alışverişinizde geçerlidir.',
        url: '/?lang=tr'
      },
      en: {
        title: '🎁 Your 50 ₺ Coupon Code: TEKLIMAKAN50',
        body: 'Notifications enabled! Enjoy your 50 TL discount on your next checkout.',
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
    } catch (e) {}
  }

  async syncSubscriptionLanguage() {
    if (!this.swRegistration) return;
    try {
      const sub = await this.swRegistration.pushManager.getSubscription();
      if (sub) await this.saveSubscriptionToCloud(sub);
    } catch (e) {}
  }

  urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

window.TeklimakanPush = new PushNotificationManager();
