
function isPseudoCategory(name) {
  if (!name) return false;
  const s = String(name).trim().toLowerCase();
  return s === 'all' ||
         s === 'بارلىق تۈرلەر' ||
         s === 'بارلىق مەھسۇلاتلار' ||
         s === 'tüm kategoriler' ||
         s === 'tum kategoriler' ||
         s === 'tüm ürünler' ||
         s === 'tum urunler' ||
         s === 'all categories' ||
         s === 'all products';
}
if (typeof window !== 'undefined') window.isPseudoCategory = isPseudoCategory;
/**
 * ================================================================
 * تەكلىماكان تور سودا سۇپىسى - كۆپ تىللىق ئالدى دۇكان (App.js)
 * تىل، پۇل بىرلىكى (₺/$)، ماركا سۈزگۈچى ۋە 1000 لىرا ھەقسىز يەتكۈزۈش
 * ================================================================
 */

function initTeklimakanApp() {
  let currentCategory = 'all';
  let currentBrand = 'all';
  let searchQuery = '';
  let maxPrice = 20000;
  let onlyInStock = false;
  let sortBy = 'popular';
  let appliedCoupon = null;

  // ⚡ تەشۋىقات بۆلىكى ئۆزگەرگۈچىلىرى (Hero Slider Variables)
  let heroSliderTimer = null;
  let heroSliderHoverTimeout = null;
  let _lastHeroSlidesRenderKey = '';
  let _heroSliderCurrentIdx = 0;

  // ⚡ چەكلىك ئېتىبار رېشاتكىسى ۋاقتى (Flash Sale Shelf Timestamp)
  let lastFlashToggleTime = 0;

  // ⚡ ئامەت چاقى ئۆزگەرگۈچىلىرى ۋە دەسلەپكى ئېتىبار پارچىلىرى (Lucky Wheel)
  let luckyWheelRotation = 0;
  let isLuckyWheelSpinning = false;
  let luckyWheelAnimFrame = null;
  let wheelCountdownInterval = null;

  const defaultLuckyWheelSlices = [
    { id: 'sw1', text: '₺10 ئېتىبار', couponCode: 'LUCKY10', type: 'fixed', value: 10, minSpend: 100, color: '#f59e0b', weight: 30 },
    { id: 'sw2', text: '₺20 ئېتىبار', couponCode: 'LUCKY20', type: 'fixed', value: 20, minSpend: 200, color: '#10b981', weight: 25 },
    { id: 'sw3', text: '₺50 ئېتىبار', couponCode: 'LUCKY50', type: 'fixed', value: 50, minSpend: 400, color: '#ef4444', weight: 10 },
    { id: 'sw4', text: 'ھەقسىز يەتكۈزۈش', couponCode: 'LUCKYFREE', type: 'free_shipping', value: 35, minSpend: 150, color: '#8b5cf6', weight: 20 },
    { id: 'sw5', text: '%5 ئېتىبار', couponCode: 'LUCKY5PCT', type: 'percentage', value: 5, minSpend: 50, color: '#3b82f6', weight: 25 },
    { id: 'sw6', text: 'تەلەيلىك بولۇڭ', couponCode: '', type: 'none', value: 0, minSpend: 0, color: '#64748b', weight: 10 }
  ];

  // ⚡ سۇپا ئىچىدىكى زاكاز ئۇقتۇرۇش ئۆزگەرگۈچىلىرى (Tracking Inbox)
  let currentInboxTab = 'notifs';
  let currentInboxQuery = '';
  let cachedInboxData = { orders: [], notifications: [] };

  // ⚡ نەق مەيدان پېرېۋوت سانلىق مەلۇماتى (Live Exchange Rates)
  let lastRatesData = {
    usd: 38.50,
    eur: 41.80,
    updatedAt: null
  };

  function openLanguageModal(e) {
    if (e) {
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
      if (typeof e.preventDefault === 'function') e.preventDefault();
    }
    const modal = document.getElementById('languageModal');
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
    }
  }

  function closeLanguageModal() {
    const modal = document.getElementById('languageModal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  function selectSiteLanguage(lang) {
    if (lang === 'tr' || lang === 'en') {
      window.location.href = 'https://teklimakan.online';
      return;
    }
    if (!lang || !['ug', 'tr', 'en'].includes(lang)) return;
    if (window.appI18n && typeof window.appI18n.setLang === 'function') {
      window.appI18n.setLang(lang);
    }
    try {
      localStorage.setItem('teklimakan_language', lang);
    } catch (e) {}

    if (window.appStore && typeof window.appStore.setCurrency === 'function') {
      const aligned = lang === 'en' ? 'USD' : 'TRY';
      window.appStore.setCurrency(aligned);
    }

    closeLanguageModal();

    try {
      const newPath = lang === 'ug' ? '/' : '/' + lang;
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', newPath);
      }
    } catch (e) {}

    document.querySelectorAll('.lang-option-row').forEach(row => {
      const rowLang = row.dataset.lang;
      const isSelected = rowLang === lang;
      row.classList.toggle('active', isSelected);
      const radio = row.querySelector('.lang-radio-indicator');
      if (radio) radio.classList.toggle('checked', isSelected);
    });

    try { updateStaticTranslations(); } catch (e) {}
    try { renderBrands(); } catch (e) {}
    try { renderCategories(); } catch (e) {}
    try { renderProducts(); } catch (e) {}
    try { bindInstagramSmartLinks(); } catch (e) {}
    try { renderFlashProductsCards(); } catch (e) {}
    try { updateCartUI(); } catch (e) {}
    try { initHeroSlider(lang); } catch (e) {}
    try { renderShowcaseShelves(lang); } catch (e) {}
    try { renderCharityTrustBanner(); } catch (e) {}
    try { updateDateDisplay(); } catch (e) {}
    try { if (typeof applyWheelTexts === 'function') applyWheelTexts(); } catch (e) {}

    // تىل ئالماشقاندا بەت دەرھال پاكىز ئۆزگىرىدۇ، ئارتۇقچە قاڭقىش ئەسكەرتىشى چىقىرىلمايدۇ
  }

  function openAgentPortalModal(initialTab = 'apply') {
    const currentLang = (window.appI18n && typeof window.appI18n.getLang === 'function') ? window.appI18n.getLang() : 'ug';
    if (currentLang !== 'ug') return; // پەقەتلا ئۇيغۇرچە بەتتە كۆرۈنىدۇ
    const modal = document.getElementById('agentPortalModal');
    if (!modal) return;
    modal.classList.add('active');
    modal.style.display = 'flex';
    const tabApply = document.getElementById('tabAgentApply');
    const tabSubmit = document.getElementById('tabAgentSubmit');
    const paneApply = document.getElementById('agentApplyPane');
    const paneSubmit = document.getElementById('agentSubmitPane');
    if (initialTab === 'submit' && tabSubmit && paneSubmit) {
      if (tabApply) tabApply.classList.remove('active');
      tabSubmit.classList.add('active');
      if (paneApply) paneApply.style.display = 'none';
      paneSubmit.style.display = 'block';
    } else if (tabApply && paneApply) {
      if (tabSubmit) tabSubmit.classList.remove('active');
      tabApply.classList.add('active');
      paneApply.style.display = 'block';
      if (paneSubmit) paneSubmit.style.display = 'none';
    }
  }

  function closeAgentPortalModal() {
    const modal = document.getElementById('agentPortalModal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  // ⚡ فۇنكسىيەلەرنى دەرھال window غا ئۇلاش (كۇنۇپكىلارنىڭ ھەرگىز بوش قېلىپ قالماسلىقى ئۈچۈن)
  window.toggleFlashSaleProducts = toggleFlashSaleProducts;
  window.openLuckyWheelModal = openLuckyWheelModal;
  window.closeLuckyWheelModal = closeLuckyWheelModal;
  window.handleLuckyWheelSpin = handleLuckyWheelSpin;
  window.resetMyDailySpin = resetMyDailySpin;
  window.drawLuckyWheel = drawLuckyWheel;
  window.updateLuckyWheelStatusCard = updateLuckyWheelStatusCard;
  window.openLanguageModal = openLanguageModal;
  window.closeLanguageModal = closeLanguageModal;
  window.selectSiteLanguage = selectSiteLanguage;
  window.openAgentPortalModal = openAgentPortalModal;
  window.closeAgentPortalModal = closeAgentPortalModal;
  window.renderProducts = renderProducts;
  window.renderCategories = renderCategories;
  window.renderBrands = renderBrands;
  window.updateStaticTranslations = updateStaticTranslations;
  window.updateCartUI = updateCartUI;
  window.updateWishlistUI = updateWishlistUI;
  window.initHeroSlider = initHeroSlider;

  // 🌤️ چەكلىك ئېتىبار رامكىسىدىكى ھاۋارايى شەھەرلىرى
  const FLASH_WEATHER_CITIES = [
    { name: { ug: 'قەشقەر', tr: 'Kaşgar', en: 'Kashgar' }, temp: '24°C', condition: { ug: 'ئوچۇق ھاۋا', tr: 'Açık Güneşli', en: 'Clear & Sunny' }, icon: 'fa-sun', color: '#f59e0b' },
    { name: { ug: 'خوتەن', tr: 'Hotan', en: 'Hotan' }, temp: '26°C', condition: { ug: 'ئىللىق ھاۋا', tr: 'Ilık & Açık', en: 'Warm & Fair' }, icon: 'fa-sun', color: '#fbbf24' },
    { name: { ug: 'ئۈرۈمچى', tr: 'Urumçi', en: 'Urumqi' }, temp: '21°C', condition: { ug: 'پارلاق ھاۋا', tr: 'Parçalı Bulutlu', en: 'Partly Cloudy' }, icon: 'fa-cloud-sun', color: '#38bdf8' },
    { name: { ug: 'تۇرپان', tr: 'Turfan', en: 'Turpan' }, temp: '28°C', condition: { ug: 'ئاپتاپپەرەس', tr: 'Sıcak Güneşli', en: 'Sunny & Warm' }, icon: 'fa-sun', color: '#f97316' },
    { name: { ug: 'ئىستانبۇل', tr: 'İstanbul', en: 'Istanbul' }, temp: '19°C', condition: { ug: 'ساپ ھاۋا', tr: 'Ferah & Ilık', en: 'Pleasant & Mild' }, icon: 'fa-cloud-sun', color: '#10b981' }
  ];
  let currentFlashWeatherIndex = 0;
  let currentRoseProductIndex = -1;

  try {
    if (window.appI18n && typeof window.appI18n.applyDirectionAndTypography === 'function') {
      window.appI18n.applyDirectionAndTypography();
    }
  } catch (e) {
    console.warn('applyDirectionAndTypography error:', e);
  }

  // ⚡ ۋاكالەتچىلەرنىڭ كۈندىلىك ئاكتىپلىقى ۋە ئۇيقۇ ھالىتىنى تەكشۈرۈش
  try {
    if (window.appStore && typeof window.appStore.checkAndUpdateAllAgentsInactivity === 'function') {
      window.appStore.checkAndUpdateAllAgentsInactivity();
    }
  } catch (e) {
    console.warn('checkAndUpdateAllAgentsInactivity error:', e);
  }

  // تاللانغان ئۇسلۇبتىكى فونىتنى مەڭگۈلۈك مۇقىملاشتۇرۇش
  try {
    const savedFont = localStorage.getItem('uyghur_font_preference') || 'modern';
    if (savedFont === 'traditional') {
      document.body.classList.remove('font-modern');
      document.body.classList.add('font-traditional');
    } else {
      document.body.classList.add('font-modern');
      document.body.classList.remove('font-traditional');
    }
  } catch (e) {}

  // دەسلەپكى ئېچىلغاندا تىل بىلەن پۇل بىرلىكىنىڭ تەبىئىي ماس قەدەملىشىشى:
  // ug / tr -> TRY (₺), en -> USD ($)
  try {
    const currentInitialLang = (window.appI18n && typeof window.appI18n.getLang === 'function') ? window.appI18n.getLang() : 'ug';
    const alignedCurrency = currentInitialLang === 'en' ? 'USD' : 'TRY';
    if (window.appStore && typeof window.appStore.getCurrency === 'function') {
      if (window.appStore.getCurrency() !== alignedCurrency && typeof window.appStore.setCurrency === 'function') {
        window.appStore.setCurrency(alignedCurrency);
      }
    }
  } catch (e) {}

  try { initStore(); } catch (e) { console.error('initStore error:', e); }
  try { setupEventListeners(); } catch (e) { console.error('setupEventListeners error:', e); }
  try { initFlashCountdown(); } catch (e) { console.error('initFlashCountdown error:', e); }
  try { initDailyFlashSaleShelf(); } catch (e) { console.error('initDailyFlashSaleShelf error:', e); }
  try { initCustomerLuckyWheel(); } catch (e) { console.error('initCustomerLuckyWheel error:', e); }
  try { initFlashWeather(); } catch (e) { console.error('initFlashWeather error:', e); }
  try { initLiveSalesPopups(); } catch (e) { console.error('initLiveSalesPopups error:', e); }
  try { initAgentPortal(); } catch (e) { console.error('initAgentPortal error:', e); }
  try { initAboutUsModal(); } catch (e) { console.error('initAboutUsModal error:', e); }
  try { initAdminDeviceButton(); } catch (e) { console.error('initAdminDeviceButton error:', e); }
  try { initLiveExchangeRatesTicker(); } catch (e) { console.error('initLiveExchangeRatesTicker error:', e); }
  try { initFooterAccordions(); } catch (e) { console.error('initFooterAccordions error:', e); }
  try { checkUrlForProduct(); } catch (e) { console.error('checkUrlForProduct error:', e); }

  function initStore() {
    try { updateStaticTranslations(); } catch (e) { console.error('updateStaticTranslations error:', e); }
    try { renderBrands(); } catch (e) { console.error('renderBrands error:', e); }
    try { renderCategories(); } catch (e) { console.error('renderCategories error:', e); }
    try { renderProducts(); } catch (e) { console.error('renderProducts error:', e); }
    try { updateCartUI(); } catch (e) { console.error('updateCartUI error:', e); }
    try { initHeroSlider(); } catch (e) { console.error('initHeroSlider error:', e); }
    try { renderShowcaseShelves(); } catch (e) { console.error('renderShowcaseShelves error:', e); }
    try { renderCharityTrustBanner(); } catch (e) {}
    try { initSmartHeroScroll(); } catch (e) { console.error('initSmartHeroScroll error:', e); }
    try { initSmartScrollToggle(); } catch (e) { console.error('initSmartScrollToggle error:', e); }
    try { renderRecentlyViewedShelf(); } catch (e) {}

    if (window.appStore && typeof window.appStore.syncWithSupabase === 'function') {
      window.appStore.syncWithSupabase({ force: true }).then(() => {
        try { renderProducts(); } catch (e) {}
        try { renderShowcaseShelves(); } catch (e) {}
        try { renderBrands(); } catch (e) {}
        try { renderCategories(); } catch (e) {}
      }).catch(err => console.warn('Supabase sync error in initStore:', err));
    }
  }

  // ==================== 📅 ھاياتىي چېسلا ئۇچۇرى (Live Date Display) ====================
  function updateDateDisplay() {
    const dateEl = document.getElementById('currentDateText');
    if (!dateEl) return;

    const lang = window.appI18n ? window.appI18n.getLang() : 'ug';
    const now = new Date();

    const weekDays = {
      ug: ['يەكشەنبە', 'دۈشەنبە', 'سەيشەنبە', 'چارشەنبە', 'پەيشەنبە', 'جۈمە', 'شەنبە'],
      tr: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
      en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    };

    const months = {
      ug: ['1-ئاي', '2-ئاي', '3-ئاي', '4-ئاي', '5-ئاي', '6-ئاي', '7-ئاي', '8-ئاي', '9-ئاي', '10-ئاي', '11-ئاي', '12-ئاي'],
      tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
      en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };

    const year = now.getFullYear();
    const monthIdx = now.getMonth();
    const day = now.getDate();
    const dayOfWeek = weekDays[lang] ? weekDays[lang][now.getDay()] : weekDays.ug[now.getDay()];
    const monthName = months[lang] ? months[lang][monthIdx] : months.ug[monthIdx];

    let formattedDate = '';
    if (lang === 'ug') {
      formattedDate = `${year}-يىلى ${monthIdx + 1}-ئاينىڭ ${day}-كۈنى، ${dayOfWeek}`;
    } else if (lang === 'tr') {
      formattedDate = `${day} ${monthName} ${year}, ${dayOfWeek}`;
    } else {
      formattedDate = `${dayOfWeek}, ${monthName.slice(0, 3)} ${day}, ${year}`;
    }

    dateEl.textContent = formattedDate;
  }

  function updateMobileFilterBadge() {
    const badge = document.getElementById('mobileFilterActiveBadge');
    const sidebar = document.getElementById('catalogSidebar');
    if (!badge || !sidebar) return;
    const isExpanded = sidebar.classList.contains('is-expanded');
    badge.textContent = isExpanded ? window.appI18n.t('filterMobileHide') : window.appI18n.t('filterMobileShow');
  }

  // ==================== 📢 ئايلانما ئېلان تاختىسى (Marquee Ticker) ====================
  function escapeMarqueeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderMarqueeTicker(lang) {
    const container = document.querySelector('.top-marquee-content');
    if (!container || !window.appStore) return;
    const currentLang = lang || (window.appI18n ? window.appI18n.getLang() : (localStorage.getItem('teklimakan_language') || 'ug'));
    const items = (typeof window.appStore.getMarqueeItems === 'function')
      ? window.appStore.getMarqueeItems(currentLang)
      : [];

    if (!items || items.length === 0) return;

    let itemsHtml = '';
    items.forEach((it, idx) => {
      const badgeStyle = it.badgeStyle || 'badge-sale';
      const isInsta = badgeStyle === 'badge-insta' || it.linkType === 'instagram';
      const isCharity = badgeStyle === 'badge-charity' || it.linkType === 'charity';
      let customAttrs = '';
      if (isInsta) {
        customAttrs = 'style="cursor: pointer;" onclick="document.getElementById(\'footerBrandInstaLink\')?.click()"';
      } else if (isCharity) {
        const url = it.url || 'https://www.seidiye.com/category/mihri/';
        customAttrs = `style="cursor: pointer;" onclick="window.open('${url}', '_blank')" title="«تەكلىماكان فوندى» سەھىپىسىنى يېڭى بەتتە كۆرۈش"`;
      }
      itemsHtml += `
        <div class="marquee-item" ${customAttrs}>
          <span class="marquee-badge ${escapeMarqueeHtml(badgeStyle)}" data-marquee-badge="${it.id || (idx + 1)}">${escapeMarqueeHtml(it.badge)}</span>
          <span class="marquee-text" data-marquee-text="${it.id || (idx + 1)}">${escapeMarqueeHtml(it.text)}</span>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="marquee-group">${itemsHtml}</div>
      <div class="marquee-group" aria-hidden="true">${itemsHtml}</div>
    `;
  }

  // ==================== تىل ۋە تېكىستلەر ====================
  function updateStaticTranslations() {
    if (window.appI18n && typeof window.appI18n.translateStaticElements === 'function') {
      window.appI18n.translateStaticElements();
    }
    const i18n = window.appI18n;
    const lang = (i18n && i18n.getLang()) || 'ug';
    // بەت ماۋزۇسى پەقەت دۇكان نامى بولىدۇ، تىل ئالماشقاندا ئاپتوماتىك ئۆزگىرىدۇ
    document.title = i18n.t('storeName');

    const annEl = document.getElementById('topAnnouncementText');
    if (annEl) annEl.textContent = i18n.t('announcement');

    // ئۈستۈنكى ھەرىكەتچان ئايلانما خەت (Marquee Ticker)
    renderMarqueeTicker(lang);

    // ئۈستۈنكى تاياقچە ئۇچۇرلىرى
    const topWhatsapp = document.getElementById('topWhatsappSpan');
    if (topWhatsapp) topWhatsapp.textContent = i18n.t('topWhatsapp');

    const topHours = document.getElementById('topWorkingHours');
    if (topHours) topHours.textContent = i18n.t('topHours');

    const topAdmin = document.getElementById('topAdminLinkSpan');
    if (topAdmin) topAdmin.textContent = i18n.t('topAdmin');

    const topAgent = document.getElementById('topAgentSpan');
    if (topAgent) topAgent.textContent = i18n.t('topAgent');

    // 🤝 ئۈستۈنكى تاياقچىدىكى ۋاكالەتچى ۋە ئارقا سۇپا كۇنۇپكىلىرى
    const agentNavBtn = document.getElementById('agentPortalNavBtn');
    if (agentNavBtn) {
      const span = agentNavBtn.querySelector('span');
      if (span) span.textContent = i18n.t('agentNavBtn') || 'ۋاكالەتچى كىرىش';
      agentNavBtn.title = i18n.t('agentNavTitle') || 'ۋاكالەتچى ۋە سودىگەر مەركىزى';
    }

    const adminSecretNavBtn = document.getElementById('adminSecretNavBtn');
    if (adminSecretNavBtn) {
      const span = adminSecretNavBtn.querySelector('span');
      if (span) span.textContent = i18n.t('adminNavBtn') || 'ئارقا سۇپا';
      adminSecretNavBtn.title = i18n.t('adminNavTitle') || 'ئارقا سۇپىغا كىرىش';
    }

    const adminFloatingBadge = document.getElementById('adminFloatingBadge');
    if (adminFloatingBadge) {
      const span = adminFloatingBadge.querySelector('span');
      if (span) span.textContent = i18n.t('adminNavBtn') || 'ئارقا سۇپا';
      adminFloatingBadge.title = i18n.t('adminNavTitle') || 'ئارقا سۇپىغا كىرىش';
    }

    const hotlineLabel = document.getElementById('topHotlineLabel');
    if (hotlineLabel) hotlineLabel.innerHTML = `<i class="fas fa-phone-alt"></i> ${i18n.t('hotline')} <span class="number-latin">400-880-9988</span>`;

    const searchInput = document.getElementById('mainSearchInput');
    if (searchInput) searchInput.placeholder = i18n.t('searchPlaceholder');

    document.querySelectorAll('.brand-store-name').forEach(el => el.textContent = i18n.t('storeName'));
    document.querySelectorAll('.brand-store-sub').forEach(el => el.textContent = i18n.t('storeSubtitle'));

    const cartBtnSpan = document.getElementById('navCartText') || document.querySelector('#cartToggleBtn .nav-cart-text') || document.querySelector('#cartToggleBtn span');
    if (cartBtnSpan) cartBtnSpan.textContent = i18n.t('cartBtn') || 'سېۋەت';

    const wishBtnSpan = document.getElementById('navWishlistText') || document.querySelector('#wishlistToggleBtn span');
    if (wishBtnSpan) wishBtnSpan.textContent = i18n.t('wishlistBtn') || 'ياقتۇرغانلىرىم';

    const ordersBtnSpan = document.getElementById('navOrdersText') || document.querySelector('#trackOrderNavBtn span');
    if (ordersBtnSpan) ordersBtnSpan.textContent = i18n.t('navOrdersText') || 'سېتىۋالغىنىم';

    // 🎡 لەيلىمە ئامەت چاقى (Lucky Wheel) نى كۆپ تىلغا يېڭىلاش
    if (typeof window.updateLuckyWheelLocalization === 'function') {
      window.updateLuckyWheelLocalization();
    }



    // تەشۋىقات بۆلىكى (Hero Section Slides)
    const hTag1 = document.getElementById('heroTag1');
    if (hTag1) hTag1.textContent = i18n.t('heroTag1');
    const hTitle1 = document.getElementById('heroTitle1');
    if (hTitle1) hTitle1.textContent = i18n.t('heroTitle1');
    const hDesc1 = document.getElementById('heroDesc1');
    if (hDesc1) hDesc1.textContent = i18n.t('heroDesc1');
    const hBtn1 = document.querySelector('#heroBtn1 span');
    if (hBtn1) hBtn1.textContent = i18n.t('heroBtn1');

    const hTag2 = document.getElementById('heroTag2');
    if (hTag2) hTag2.textContent = i18n.t('heroTag2');
    const hTitle2 = document.getElementById('heroTitle2');
    if (hTitle2) hTitle2.textContent = i18n.t('heroTitle2');
    const hDesc2 = document.getElementById('heroDesc2');
    if (hDesc2) hDesc2.textContent = i18n.t('heroDesc2');
    const hBtn2 = document.querySelector('#heroBtn2 span');
    if (hBtn2) hBtn2.textContent = i18n.t('heroBtn2');

    const hTag3 = document.getElementById('heroTag3');
    if (hTag3) hTag3.textContent = i18n.t('heroTag3');
    const hTitle3 = document.getElementById('heroTitle3');
    if (hTitle3) hTitle3.textContent = i18n.t('heroTitle3');
    const hDesc3 = document.getElementById('heroDesc3');
    if (hDesc3) hDesc3.textContent = i18n.t('heroDesc3');
    const hBtn3 = document.querySelector('#heroBtn3 span');
    if (hBtn3) hBtn3.textContent = i18n.t('heroBtn3');

    const hTag4 = document.getElementById('heroTag4');
    if (hTag4) hTag4.textContent = i18n.t('heroTag4');
    const hTitle4 = document.getElementById('heroTitle4');
    if (hTitle4) hTitle4.textContent = i18n.t('heroTitle4');
    const hDesc4 = document.getElementById('heroDesc4');
    if (hDesc4) hDesc4.textContent = i18n.t('heroDesc4');
    const hBtn4 = document.querySelector('#heroBtn4 span');
    if (hBtn4) hBtn4.textContent = i18n.t('heroBtn4');

    const hTag5 = document.getElementById('heroTag5');
    if (hTag5) hTag5.textContent = i18n.t('heroTag5');
    const hTitle5 = document.getElementById('heroTitle5');
    if (hTitle5) hTitle5.textContent = i18n.t('heroTitle5');
    const hDesc5 = document.getElementById('heroDesc5');
    if (hDesc5) hDesc5.textContent = i18n.t('heroDesc5');
    const hBtn5 = document.querySelector('#heroBtn5 span');
    if (hBtn5) hBtn5.textContent = i18n.t('heroBtn5');
    try { initHeroSlider(lang); } catch (e) {}
    try { renderShowcaseShelves(lang); } catch (e) {}
    try { renderCharityTrustBanner(); } catch (e) {}

    const flashBadge = document.getElementById('flashSaleBadge');
    if (flashBadge) {
      if (lang === 'ug') {
        const retention = window.appStore ? window.appStore.getCustomerRetentionSettings() : {};
        flashBadge.textContent = retention.flashSale?.title || i18n.t('flashSaleBadge');
      } else {
        flashBadge.textContent = i18n.t('flashSaleBadge');
      }
    }
    const flashTitle = document.getElementById('flashSaleTitle');
    if (flashTitle) flashTitle.textContent = i18n.t('flashSaleTitle');
    const flashSub = document.getElementById('flashSaleSub');
    if (flashSub) flashSub.textContent = i18n.t('flashSaleSub');
    const flashCountdown = document.getElementById('flashCountdownLabel');
    if (flashCountdown) flashCountdown.textContent = i18n.t('remainingTime');
    const flashBtnText = document.getElementById('flashSaleBtnText');
    if (flashBtnText) flashBtnText.textContent = i18n.t('flashSaleBtn');
    const clockHours = document.getElementById('clockHoursLabel');
    if (clockHours) clockHours.textContent = i18n.t('clockHours');
    const clockMin = document.getElementById('clockMinutesLabel');
    if (clockMin) clockMin.textContent = i18n.t('clockMinutes');
    const clockSec = document.getElementById('clockSecondsLabel');
    if (clockSec) clockSec.textContent = i18n.t('clockSeconds');
    const weatherHint = document.getElementById('flashWeatherHint');
    if (weatherHint) weatherHint.textContent = i18n.t('flashWeatherHint');
    if (typeof updateFlashWeatherUI === 'function') updateFlashWeatherUI();

    // ⚡ ئالاھىدە ئېتىبارلىق تاۋارلار كارتىلىرىنى ھازىرقى تىلغا ئاساسەن يېڭىلاش
    if (typeof renderFlashProductsCards === 'function') {
      renderFlashProductsCards();
    }

    // ماركا سۈزگۈچ تېمىسى
    const fBrandTitle = document.getElementById('filterBrandTitle');
    if (fBrandTitle) fBrandTitle.innerHTML = `<i class="fas fa-award"></i> ${i18n.t('filterBrandTitle')}`;

    const catTitleEl = document.getElementById('categoriesSectionTitle');
    if (catTitleEl) catTitleEl.textContent = i18n.t('categoriesTitle');

    // تېلېفون نۇسخىسىدىكى سۈزگۈچ تاياقچىسى
    const mFilterTitle = document.getElementById('mobileFilterToggleTitle');
    if (mFilterTitle) mFilterTitle.textContent = i18n.t('filterMobileTitle');
    updateMobileFilterBadge();

    const fStockTitle = document.getElementById('filterStockTitle');
    if (fStockTitle) fStockTitle.innerHTML = `<i class="fas fa-filter"></i> ${i18n.t('filterStockTitle')}`;
    const fOnlyStockSpan = document.getElementById('filterOnlyInStockSpan');
    if (fOnlyStockSpan) fOnlyStockSpan.textContent = i18n.t('filterOnlyInStock');

    const fPriceTitle = document.getElementById('filterPriceTitle');
    if (fPriceTitle) fPriceTitle.innerHTML = `<i class="fas fa-tags"></i> ${i18n.t('filterPriceTitle')}`;

    const fCouponTitle = document.getElementById('filterCouponTitle');
    if (fCouponTitle) fCouponTitle.innerHTML = `<i class="fas fa-gift"></i> ${i18n.t('filterCouponTitle')}`;
    const fCouponHint = document.getElementById('filterCouponHint');
    if (fCouponHint) fCouponHint.textContent = i18n.t('couponHint');
    const fCouponCopy = document.getElementById('quickCouponCopyText');
    if (fCouponCopy) fCouponCopy.textContent = i18n.t('copyCoupon');

    const sortSelect = document.getElementById('catalogSortSelect');
    if (sortSelect) {
      sortSelect.options[0].textContent = i18n.t('sortPopular');
      sortSelect.options[1].textContent = i18n.t('sortPriceLow');
      sortSelect.options[2].textContent = i18n.t('sortPriceHigh');
      sortSelect.options[3].textContent = i18n.t('sortNewest');
    }

    // سېۋەت
    const cartHeaderTitle = document.getElementById('cartDrawerTitle');
    if (cartHeaderTitle) cartHeaderTitle.textContent = i18n.t('cartTitle');
    const couponInput = document.getElementById('couponCodeInput');
    if (couponInput) couponInput.placeholder = i18n.t('couponPlaceholder');
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    if (applyCouponBtn) applyCouponBtn.textContent = i18n.t('applyCoupon');
    const proceedCheckoutBtn = document.getElementById('proceedCheckoutBtn');
    if (proceedCheckoutBtn) proceedCheckoutBtn.querySelector('span').textContent = i18n.t('checkoutBtn');

    const cartSubLabel = document.getElementById('cartSubtotalLabel');
    if (cartSubLabel) cartSubLabel.textContent = i18n.t('subtotal');
    const cartDelLabel = document.getElementById('cartDeliveryLabel');
    if (cartDelLabel) cartDelLabel.textContent = i18n.t('deliveryFee');
    const cartDiscLabel = document.getElementById('cartDiscountLabel');
    if (cartDiscLabel) cartDiscLabel.textContent = i18n.t('discount');
    const cartTotLabel = document.getElementById('cartTotalLabel');
    if (cartTotLabel) cartTotLabel.textContent = i18n.t('total');

    // كۆرۈش كۆزنىكى (Quick View)
    const quickTitle = document.getElementById('quickViewModalTitle');
    if (quickTitle) quickTitle.textContent = i18n.t('quickViewModalTitle');

    // چىقىم كۆزنىكى (Checkout)
    const checkoutModalTitle = document.getElementById('checkoutModalTitle');
    if (checkoutModalTitle) checkoutModalTitle.innerHTML = `<i class="fas fa-truck"></i> ${i18n.t('checkoutTitle')}`;
    const checkoutSummaryTitle = document.getElementById('checkoutSummaryTitle');
    if (checkoutSummaryTitle) checkoutSummaryTitle.textContent = i18n.t('checkoutItemsSummary');
    const checkoutTotLabel = document.getElementById('checkoutTotalLabel');
    if (checkoutTotLabel) checkoutTotLabel.textContent = i18n.t('checkoutTotalLabel');

    const cNoticeBox = document.getElementById('checkoutAddressNoticeBox') || (document.getElementById('checkoutTurkishNoticeBanner') ? document.getElementById('checkoutTurkishNoticeBanner').parentElement : null);
    const cNoticeBanner = document.getElementById('checkoutTurkishNoticeBanner');
    if (cNoticeBox) {
      if (lang === 'tr') {
        cNoticeBox.style.display = 'none';
      } else {
        cNoticeBox.style.display = 'flex';
        if (cNoticeBanner) {
          cNoticeBanner.innerHTML = i18n.t('checkoutTurkishNotice') || (lang === 'en' ? '<strong>⚠️ Turkey Delivery Notice:</strong> For courier delivery within Turkey, <strong>recipient name, city, and full address must be written in Turkish/Latin characters</strong>!' : '<strong>⚠️ تۈركىيە كارگو (پوچتا) ئەسكەرتىشى:</strong> يەتكۈزۈش خادىملىرى مالنى ئۆيىڭىزگە توغرا يەتكۈزۈپ بېرىشى ئۈچۈن، <strong>ئىسىم، شەھەر ۋە تەپسىلىي ئادرېس چوقۇم تۈركچە (لاتىنچە)</strong> يېزىلىشى شەرت!');
        }
      }
    }
    const cNameLabel = document.getElementById('checkoutCustNameLabel');
    if (cNameLabel) cNameLabel.innerHTML = `${i18n.t('custName')} <span style="color: var(--danger-color);">*</span>`;
    const cNameInput = document.getElementById('checkoutCustName');
    if (cNameInput) cNameInput.placeholder = i18n.t('custNamePlaceholder') || (lang === 'tr' ? 'Ahmet Yılmaz / Murat Kaya' : (lang === 'en' ? 'Ahmet Yilmaz / Murat Kaya' : 'Ahmet Yılmaz / Murat Kaya (چوقۇم تۈركچە)'));
    const cNameHint = document.getElementById('checkoutCustNameHint');
    if (cNameHint) cNameHint.textContent = i18n.t('custNameHint') || '';

    const cPhoneLabel = document.getElementById('checkoutCustPhoneLabel');
    if (cPhoneLabel) cPhoneLabel.innerHTML = `${i18n.t('custPhone')} <span style="color: var(--danger-color);">*</span>`;
    const cCityLabel = document.getElementById('checkoutCustCityLabel');
    if (cCityLabel) cCityLabel.innerHTML = `İl (${lang === 'tr' ? 'Şehir' : (lang === 'en' ? 'Province' : 'ۋىلايەت / شەھەر')}) <span style="color: var(--danger-color);">*</span>`;
    const cDistLabel = document.getElementById('checkoutCustDistrictLabel');
    if (cDistLabel) cDistLabel.innerHTML = `İlçe (${lang === 'tr' ? 'İlçe' : (lang === 'en' ? 'District' : 'رايون / ناھىيە')}) <span style="color: var(--danger-color);">*</span>`;


    const cAddrLabel = document.getElementById('checkoutCustAddressLabel');
    if (cAddrLabel) cAddrLabel.innerHTML = `${i18n.t('custAddress')} <span style="color: var(--danger-color);">*</span>`;
    const cAddrInput = document.getElementById('checkoutCustAddress');
    if (cAddrInput) cAddrInput.placeholder = i18n.t('custAddressPlaceholder') || (lang === 'tr' ? 'Örnek: Sümer Mah. 28/2 Sok. No:5 D:3 Zeytinburnu / İstanbul (Mahalle, cadde, kapı no, ilçe)' : (lang === 'en' ? 'Street address, building no, district, city (e.g. Sumer Mah. 28/2 Sok. No:5 Zeytinburnu / Istanbul)' : 'مەھەللە، كوچا، بىنا نومۇرى، ناھىيە (Örnek: Sümer Mah. 28/2 Sok. No:5 D:3 Zeytinburnu / İstanbul)'));
    const cAddrHint = document.getElementById('checkoutCustAddressHint');
    if (cAddrHint) cAddrHint.textContent = i18n.t('custAddressHint') || '';

    const cPayLabel = document.getElementById('checkoutPaymentLabel');
    if (cPayLabel) cPayLabel.textContent = i18n.t('paymentMethod');

    // 1. بانكا ھېساباتى (Havale / FAST)
    const pHavale = document.getElementById('payMethodHavaleSpan');
    if (pHavale) pHavale.textContent = i18n.t('payHavale');
    const pBadgeFast = document.getElementById('payBadgeFast');
    if (pBadgeFast) pBadgeFast.textContent = i18n.t('payBadgeFast') || (lang === 'tr' ? '7/24 FAST Anında' : (lang === 'en' ? '24/7 FAST Instant' : 'FAST 7/24 بىۋاسىتە'));

    const bOffTitle = document.getElementById('bankOfficialTitle');
    if (bOffTitle) bOffTitle.textContent = i18n.t('bankOfficialTitle') || (lang === 'tr' ? 'Resmi Banka Alıcı Hesabı:' : (lang === 'en' ? 'Official Receiving Bank Account:' : 'رەسمىي بانكا قوبۇللاش ھېساباتى:'));
    const bNameL = document.getElementById('bankNameLabel');
    if (bNameL) bNameL.textContent = i18n.t('bankNameLabel') || (lang === 'tr' ? 'Banka Adı:' : (lang === 'en' ? 'Bank Name:' : 'بانكا نامى:'));
    const bOwnerL = document.getElementById('bankOwnerLabel');
    if (bOwnerL) bOwnerL.textContent = i18n.t('bankOwnerLabel') || (lang === 'tr' ? 'Hesap Sahibi:' : (lang === 'en' ? 'Account Holder:' : 'ھېسابات ئىگىسى:'));
    const bCopyBtn = document.getElementById('btnCopyIbanText');
    if (bCopyBtn) bCopyBtn.textContent = i18n.t('bankCopyBtn') || (lang === 'tr' ? 'Kopyala' : (lang === 'en' ? 'Copy' : 'كۆچۈرۈش'));
    const bNotice = document.getElementById('bankNotice');
    if (bNotice) {
      bNotice.innerHTML = i18n.t('bankNotice') || (lang === 'tr' ? '<i class="fas fa-info-circle" style="color: #059669;"></i> <strong>Not:</strong> Para gönderirken açıklama kısmına <strong>kuruyemiş</strong> yazınız.' : (lang === 'en' ? '<i class="fas fa-info-circle" style="color: #059669;"></i> <strong>Notice:</strong> Please write <strong>kuruyemiş</strong> in the transfer description field.' : '<i class="fas fa-info-circle" style="color: #059669;"></i> <strong>ئەسكەرتىش:</strong> پۇل ئەۋەتكەندە چۈشەندۈرۈش (Açıklama) قىسمىغا <strong>kuruyemiş</strong> دەپ يېزىپ قويۇڭ.'));
    }

    // 2. كارتا (Card)
    const pCard = document.getElementById('payMethodCardSpan');
    if (pCard) pCard.textContent = i18n.t('payCard');
    const cDisabled = document.getElementById('cardDisabledBadge');
    if (cDisabled) {
      cDisabled.innerHTML = `<i class="fas fa-lock"></i> ${i18n.t('cardDisabledBadge') || (lang === 'tr' ? 'Çok Yakında (Şu Anda Devre Dışı)' : (lang === 'en' ? 'Coming Soon (Currently Inactive)' : 'پات ئارىدا (ھازىرچە پاسسىپ)'))}`;
    }
    const cSecTitle = document.getElementById('cardSecurityTitle');
    if (cSecTitle) cSecTitle.innerHTML = `<i class="fas fa-lock"></i> ${i18n.t('cardSecurityTitle') || (lang === 'tr' ? '3D Secure 256-Bit Şifreli Güvenli Ödeme' : (lang === 'en' ? '3D Secure 256-Bit Encrypted Secure Payment' : '3D Secure 256-Bit شىفىرلىق بىخەتەر چىقىم'))}`;
    const cHolderLabel = document.getElementById('checkoutCardHolderLabel');
    if (cHolderLabel) cHolderLabel.textContent = i18n.t('cardHolderLabel') || (lang === 'tr' ? 'Kart Üzerindeki İsim Soyisim' : (lang === 'en' ? 'Cardholder Full Name' : 'كارتىدىكى ئىسىم-فامىلە'));
    const cHolderInput = document.getElementById('checkoutCardHolder');
    if (cHolderInput) cHolderInput.placeholder = i18n.t('cardHolderPlaceholder') || (lang === 'tr' ? 'Örn: AHMET YILMAZ' : (lang === 'en' ? 'e.g. AHMET YILMAZ' : 'مەسىلەن: ALIM TURDI'));
    const cNumLabel = document.getElementById('checkoutCardNumberLabel');
    if (cNumLabel) cNumLabel.textContent = i18n.t('cardNumberLabel') || (lang === 'tr' ? 'Kart Numarası (16 Haneli)' : (lang === 'en' ? 'Card Number (16 Digits)' : 'كارتا نومۇرى (16 خانىلىق)'));
    const cExpLabel = document.getElementById('checkoutCardExpiryLabel');
    if (cExpLabel) cExpLabel.textContent = i18n.t('cardExpiryLabel') || (lang === 'tr' ? 'Son Kullanma Tarihi (Ay/Yıl)' : (lang === 'en' ? 'Expiry Date (MM/YY)' : 'ۋاقتى (ئاي/يىل)'));
    const cCvvLabel = document.getElementById('checkoutCardCvvLabel');
    if (cCvvLabel) cCvvLabel.textContent = i18n.t('cardCvvLabel') || (lang === 'tr' ? 'CVV / CVC (3 Hane)' : (lang === 'en' ? 'CVV / CVC (3 Digits)' : 'CVV / CVC (3 خانا)'));
    const cPciDss = document.getElementById('cardPciDssSpan');
    if (cPciDss) cPciDss.textContent = i18n.t('cardPciDss') || (lang === 'tr' ? 'Bu platform uluslararası PCI-DSS güvenlik standartlarına uygundur, kart bilgileriniz saklanmaz.' : (lang === 'en' ? 'This platform complies with PCI-DSS security standards; card details are never stored.' : 'بۇ سۇپا خەلقئارالىق PCI-DSS بىخەتەرلىك ئۆلچىمىگە ئۇيغۇن كارتىڭىز ساقلانمايدۇ.'));

    // 3. ۋاتساپ (WhatsApp)
    const pWhatsapp = document.getElementById('payMethodWhatsappSpan');
    if (pWhatsapp) pWhatsapp.textContent = i18n.t('payWhatsapp');
    const pBadgeWa = document.getElementById('payBadgeWhatsapp');
    if (pBadgeWa) pBadgeWa.textContent = i18n.t('payBadgeWhatsapp') || (lang === 'tr' ? 'Hızlı İletişim' : (lang === 'en' ? 'Fast Support' : 'تېز ئالاقە'));
    const waNoticeTitle = document.getElementById('whatsappPayNoticeTitle');
    if (waNoticeTitle) waNoticeTitle.textContent = i18n.t('whatsappPayNoticeTitle') || (lang === 'tr' ? 'WhatsApp ile Kolay Sipariş ve Müşteri Hizmetleri Desteği' : (lang === 'en' ? 'Order via WhatsApp & Support Assistance' : 'ۋاتساپ ئارقىلىق زاكاز بېرىش ۋە خېرىدارلار بىلەن پۇل تۆلەش'));
    const pNotice = document.getElementById('whatsappPayNoticeText');
    if (pNotice) pNotice.textContent = i18n.t('whatsappPayNotice');

    // 🎁 ئىنىستىگېرام سوۋغات قۇتىسى (Instagram Gift Box)
    const igTitle = document.getElementById('instaGiftTitle');
    if (igTitle) igTitle.textContent = i18n.t('instaGiftTitle') || (lang === 'tr' ? '🎁 Instagram Hesabımızı Takip Ettiniz mi?' : (lang === 'en' ? '🎁 Have you followed our Instagram page?' : '🎁 ئىنىستىگېرام سەھىپىمىزگە ئەگەشتىڭىزمۇ؟'));
    const igBadge = document.getElementById('instaGiftBadgeSpan');
    if (igBadge) igBadge.textContent = i18n.t('instaGiftBadgeSpan') || (lang === 'tr' ? 'Ücretsiz Hediye' : (lang === 'en' ? 'Free Gift' : 'ھەقسىز سوۋغات'));
    const igDesc = document.getElementById('instaGiftDesc');
    if (igDesc) igDesc.textContent = i18n.t('instaGiftDesc') || (lang === 'tr' ? 'Resmi Instagram hesabımızı takip ettiğinizde bu siparişinize özel sürpriz bir hediye ekliyoruz!' : (lang === 'en' ? 'Follow our official Instagram account and receive a special free surprise gift with this order!' : 'رەسمىي سەھىپىمىزگە ئەگىشىپ قويسىڭىز، بۇ قېتىملىق زاكازىڭىزغا ئالاھىدە سوۋغات قوشۇپ بېرىمىز!'));
    const igPageLbl = document.getElementById('instaGiftPageLabel');
    if (igPageLbl) igPageLbl.textContent = i18n.t('instaGiftPageLabel') || (lang === 'tr' ? 'Resmi Hesap:' : (lang === 'en' ? 'Official Account:' : 'رەسمىي سەھىپە:'));
    const igFollowBtnText = document.getElementById('instaGiftFollowBtnText');
    if (igFollowBtnText) igFollowBtnText.textContent = i18n.t('instaGiftFollowBtnText') || (lang === 'tr' ? "Instagram'da Takip Et" : (lang === 'en' ? 'Follow on Instagram' : "Instagram'دا ئەگىشىش"));
    const igCheckLbl = document.getElementById('instaGiftCheckLabel');
    if (igCheckLbl) igCheckLbl.textContent = i18n.t('instaGiftCheckLabel') || (lang === 'tr' ? "Instagram'da takip ettim, siparişime hediye eklensin!" : (lang === 'en' ? 'I followed on Instagram, please include my gift!' : 'مەن ئىنىستىگېرامغا ئەگەشتىم، پوسۇلكامغا ھەدىيە قوشۇلسۇن!'));
    const igUserInput = document.getElementById('instaGiftUsername');
    if (igUserInput) igUserInput.placeholder = i18n.t('instaGiftUsernamePlaceholder') || (lang === 'tr' ? 'Instagram kullanıcı adınız (Örn: @kullaniciadi)' : (lang === 'en' ? 'Your Instagram handle (e.g. @username)' : 'ئىنىستىگېرام نامىڭىز (مەسىلەن: @ئىسمىڭىز)'));
    const igHint = document.getElementById('instaGiftHint');
    if (igHint) igHint.innerHTML = i18n.t('instaGiftHint') || (lang === 'tr' ? '<i class="fas fa-check-circle"></i> Doğrulama: Paketiniz kargoya verilirken hediyeniz siparişinize eklenecektir.' : (lang === 'en' ? '<i class="fas fa-check-circle"></i> Verification: Your free gift will be included automatically when packing.' : '<i class="fas fa-check-circle"></i> دەلىللەش ئۇچۇرى: پوسۇلكىڭىز چىقىرىلغاندا ھەدىيە ئاپتوماتىك قوشۇلىدۇ.'));

    const cNotesLabel = document.getElementById('checkoutCustNotesLabel');
    if (cNotesLabel) cNotesLabel.textContent = i18n.t('custNotes');
    const cNotesInput = document.getElementById('checkoutCustNotes');
    if (cNotesInput) cNotesInput.placeholder = i18n.t('custNotesPlaceholder');

    // زاكاز كۇنۇپكىسى تېكىستى (Submit Button)
    const submitBtn = document.getElementById('submitOrderBtn');
    const submitBtnSpan = document.getElementById('submitOrderBtnText') || (submitBtn ? submitBtn.querySelector('span') : null);
    const checkedPayRadio = document.querySelector('input[name="checkoutPayment"]:checked');
    if (submitBtnSpan) {
      if (checkedPayRadio && (checkedPayRadio.value.includes('ۋاتساپ') || checkedPayRadio.value.includes('WhatsApp'))) {
        submitBtnSpan.textContent = i18n.t('submitOrderBtnWhatsapp');
      } else if (checkedPayRadio && (checkedPayRadio.value.includes('كارتا') || checkedPayRadio.value.includes('Card'))) {
        submitBtnSpan.textContent = i18n.t('submitOrderBtnCard');
      } else {
        submitBtnSpan.textContent = i18n.t('submitOrderBtnHavale');
      }
    }

    // لەيلىمە تېلېفون
    const fPhoneBtn = document.getElementById('floatingPhoneBtn');
    if (fPhoneBtn) fPhoneBtn.title = i18n.t('phoneTooltip');
    const fPhoneTip = document.getElementById('floatingPhoneTooltip');
    if (fPhoneTip) fPhoneTip.textContent = i18n.t('phoneTooltip');

    // تۆۋەنكى قىسمى (Footer)
    const fDesc = document.getElementById('footerBrandDesc');
    if (fDesc) fDesc.textContent = i18n.t('footerBrandDesc');
    const frTitle = document.getElementById('footerRatesHeaderSpan');
    if (frTitle) frTitle.textContent = i18n.t('footerRatesTitle');
    const frLive = document.getElementById('footerLiveText');
    if (frLive) frLive.textContent = i18n.t('footerRatesLive');
    const rUsd = document.getElementById('rateNameUsd');
    if (rUsd) rUsd.textContent = i18n.t('rateNameUsd');
    const rEur = document.getElementById('rateNameEur');
    if (rEur) rEur.textContent = i18n.t('rateNameEur');
    const rTrendUsd = document.querySelector('#rateTrendUsd span');
    if (rTrendUsd) rTrendUsd.textContent = i18n.t('rateTrendMarket');
    const rTrendEur = document.querySelector('#rateTrendEur span');
    if (rTrendEur) rTrendEur.textContent = i18n.t('rateTrendMarket');
    const btnRef = document.getElementById('btnRefreshRatesText');
    if (btnRef) btnRef.textContent = i18n.t('rateRefreshText');

    const fCol1 = document.getElementById('footerCol1Title');
    if (fCol1) fCol1.textContent = i18n.t('footerCol1');
    const fColRates = document.getElementById('fColRatesTitleText');
    if (fColRates) fColRates.textContent = i18n.t('footerRatesTitle') || 'پېرېۋوت باھاسى (TRY)';
    const fCol2 = document.getElementById('fCol2TitleText') || document.getElementById('footerCol2Title');
    if (fCol2) {
      const col2Span = fCol2.querySelector('span');
      if (col2Span) col2Span.textContent = i18n.t('footerCol2');
      else fCol2.textContent = i18n.t('footerCol2');
    }
    const fCol3 = document.getElementById('fCol3TitleText') || document.getElementById('footerCol3Title');
    if (fCol3) {
      const col3Span = fCol3.querySelector('span');
      if (col3Span) col3Span.textContent = i18n.t('footerCol3');
      else fCol3.textContent = i18n.t('footerCol3');
    }
    const fCol3Sub = document.getElementById('fCol3SubtitleText');
    if (fCol3Sub) {
      const curLang = (window.appI18n && window.appI18n.currentLang) || 'ug';
      if (curLang === 'tr') fCol3Sub.textContent = 'Telefon, WhatsApp ve iletişim kanalları';
      else if (curLang === 'en') fCol3Sub.textContent = 'Phone, WhatsApp & channels';
      else fCol3Sub.textContent = 'تېلېفون، ۋاتساپ ۋە ئالاقە يوللىرى';
    }
    const fHint = document.getElementById('footerContactHint');
    const fList = document.getElementById('footerContactList');
    if (fHint && fList) {
      const isCol = fList.classList.contains('is-collapsed');
      fHint.textContent = isCol ? (i18n.t('accordionExpand') || 'ئېچىش') : (i18n.t('accordionCollapse') || 'يىغىش');
    }

    const flGuide = document.getElementById('fLinkGuide');
    if (flGuide) flGuide.textContent = i18n.t('fLinkGuide');
    const flShip = document.getElementById('fLinkFreeShipping');
    if (flShip) flShip.textContent = i18n.t('fLinkFreeShipping');
    const flDeliv = document.getElementById('fLinkDelivery');
    if (flDeliv) flDeliv.textContent = i18n.t('fLinkDelivery');
    const flRet = document.getElementById('fLinkReturns');
    if (flRet) flRet.textContent = i18n.t('fLinkReturns');

    const flAbout = document.getElementById('fLinkAbout');
    if (flAbout) {
      const aboutSpan = document.getElementById('fLinkAboutSpan') || flAbout.querySelector('span');
      if (aboutSpan) aboutSpan.textContent = i18n.t('fLinkAbout');
      else flAbout.textContent = i18n.t('fLinkAbout');
    }
    const flAboutSub = document.getElementById('fLinkAboutSub');
    if (flAboutSub) flAboutSub.textContent = i18n.t('fLinkAboutSub') || (lang === 'tr' ? 'Platform hakkında ve bilgiler' : (lang === 'en' ? 'Platform introduction & info' : 'سۇپا تونۇشتۇرۇشى ۋە ئۇچۇرلىرى'));

    // 🤝 سودىگەر ۋە ۋاكالەتچى مەركىزى ئۇلانمىسى (پەقەتلا ئۇيغۇرچە بەتتە كۆرۈنسۇن، باشقا تىلدا يوشۇرۇلسۇن)
    const flAgentPortal = document.getElementById('fLinkAgentPortal');
    if (flAgentPortal) {
      if (lang === 'ug') {
        flAgentPortal.style.display = 'flex';
        const fAgentPortalSpan = document.getElementById('fLinkAgentPortalSpan');
        if (fAgentPortalSpan) fAgentPortalSpan.textContent = i18n.t('agentFooterLink') || 'سودىگەر ۋە ۋاكالەتچى مەركىزى';
        const fAgentPortalSub = document.getElementById('fLinkAgentPortalSub');
        if (fAgentPortalSub) fAgentPortalSub.textContent = i18n.t('fLinkAgentPortalSub') || 'ئىلتىماس قىلىش، كىرىش ۋە تاۋار سۇنۇش';
      } else {
        flAgentPortal.style.display = 'none';
        const modal = document.getElementById('agentPortalModal');
        if (modal) {
          modal.classList.remove('active');
          modal.style.display = 'none';
        }
      }
    }

    const flTrackOrderSpan = document.getElementById('fLinkTrackOrderSpan');
    if (flTrackOrderSpan) flTrackOrderSpan.textContent = i18n.t('fLinkTrackOrder') || (lang === 'tr' ? 'Kargo Durumu Sorgula' : (lang === 'en' ? 'Track Order & Cargo' : 'كارگو ئەھۋالىنى تەكشۈرۈش'));
    const flTrackOrderSub = document.getElementById('fLinkTrackOrderSub');
    if (flTrackOrderSub) flTrackOrderSub.textContent = i18n.t('fLinkTrackOrderSub') || (lang === 'tr' ? 'Sipariş ve kargo takibi' : (lang === 'en' ? 'Order status & parcel tracking' : 'زاكاز ۋە يەتكۈزۈش سۈرۈشتۈرۈش'));

    // 📦 زاكاز ۋە كارگو كۆزنىكىنى (Order Tracker Modal) تىل بويىچە يېڭىلاش
    const otModalTitle = document.getElementById('orderTrackModalTitleSpan');
    if (otModalTitle) otModalTitle.textContent = i18n.t('orderTrackModalTitle') || (lang === 'tr' ? 'Siparişlerim ve Kargo Takibi' : (lang === 'en' ? 'My Orders & Cargo Tracking' : 'مېنىڭ زاكازلىرىم ۋە كارگو سۈرۈشتۈرۈش'));
    const otNotice = document.getElementById('orderTrackNoticeText');
    if (otNotice) {
      if (lang === 'tr') {
        otNotice.innerHTML = '<b>Kalıcı Arşiv Güvencesi:</b> Tüm siparişleriniz sistem bulut arşivinde güvenle saklanır. Yıllar sonra bile girseniz telefon numaranızla siparişlerinize kolayca ulaşabilirsiniz.';
      } else if (lang === 'en') {
        otNotice.innerHTML = '<b>Permanent Cloud Archive:</b> All your orders are securely stored in the cloud. Even years later, you can easily query your orders using your phone number.';
      } else {
        otNotice.innerHTML = '<b>مەڭگۈلۈك ئارخىپ كاپالىتى:</b> بارلىق زاكازلىرىڭىز سىستېما بۇلۇت ئامبىرىدا ساقلىنىدۇ. بىر نەچچە يىلدىن كېيىن كىرسىڭىزمۇ، تېلېفون نومۇرىڭىزنى كىرگۈزۈپ بارلىق زاكازلىرىڭىزنى ئاسانلا تاپالايسىز.';
      }
    }
    const otInputLabel = document.getElementById('orderTrackInputLabel');
    if (otInputLabel) otInputLabel.textContent = i18n.t('orderTrackInputLabel') || (lang === 'tr' ? 'Telefon Numaranız veya Sipariş Kodunuz' : (lang === 'en' ? 'Phone Number or Order Code' : 'تېلېفون نومۇرىڭىز ياكى زاكاز نومۇرىڭىز'));
    const otInput = document.getElementById('orderTrackQueryInput');
    if (otInput) otInput.placeholder = i18n.t('orderTrackQueryPlaceholder') || (lang === 'tr' ? 'Örn: 0555... veya 10001' : (lang === 'en' ? 'e.g. 0555... or 10001' : 'مەسىلەن: 05551234567 ياكى 10001'));
    const otBtnText = document.getElementById('btnDoTrackOrderText');
    if (otBtnText) otBtnText.textContent = i18n.t('orderTrackSearchBtn') || (lang === 'tr' ? 'Sorgula' : (lang === 'en' ? 'Search' : 'كۆرۈش'));
    const otEmptyHint = document.getElementById('orderTrackEmptyHint');
    if (otEmptyHint) otEmptyHint.textContent = i18n.t('orderTrackEmptyHint') || (lang === 'tr' ? 'Sipariş verirken girdiğiniz telefon numarası veya sipariş kodu ile geçmiş siparişlerinizi, ödeme durumunu ve kargo takip kodunu anında görebilirsiniz.' : (lang === 'en' ? 'Track your past orders, payment status, and cargo tracking numbers instantly using your registered phone number or order ID.' : 'زاكازدا كىرگۈزگەن تېلېفون نومۇرىڭىز (ياكى زاكاز نومۇرىڭىز) ئارقىلىق ئىلگىرى بەرگەن بارلىق زاكازلىرىڭىزنىڭ تەپسىلاتى، پۇل چىقىمى ۋە پوچتا ئىز قوغلاش نومۇرىنى نەق مەيداندا كۆرەلەيسىز.'));

    // ❤️ ياقتۇرغانلار تارتمىسى (Wishlist Drawer)
    const wishTitle = document.getElementById('wishlistDrawerTitle');
    if (wishTitle) wishTitle.textContent = i18n.t('wishlistTitle') || (lang === 'tr' ? 'Favorilerim' : (lang === 'en' ? 'My Wishlist' : 'ياقتۇرغانلىرىم'));
    const bMoveWish = document.getElementById('btnMoveAllWishlistSpan');
    if (bMoveWish) bMoveWish.textContent = i18n.t('btnMoveAllWishlist') || (lang === 'tr' ? 'Tümünü Sepete Ekle' : (lang === 'en' ? 'Move All to Cart' : 'ھەممىنى سېۋەتكە يۆتكەش'));
    const bClearWish = document.getElementById('btnClearWishlistSpan');
    if (bClearWish) bClearWish.textContent = i18n.t('btnClearWishlist') || (lang === 'tr' ? 'Listeyi Temizle' : (lang === 'en' ? 'Clear List' : 'تىزىملىكنى تازىلاش'));

    // 💬 نەق مەيدان پاراڭ كۆزنىكى (Admin Live Chat)
    const chatHName = document.getElementById('chatHeaderName');
    if (chatHName) chatHName.textContent = i18n.t('chatHeaderName') || (lang === 'tr' ? 'Yönetici ile Canlı Destek' : (lang === 'en' ? 'Live Support' : 'ئالىي باشقۇرغۇچى بىلەن ئالاقە'));
    const chatHStatus = document.getElementById('chatHeaderStatus');
    if (chatHStatus) chatHStatus.textContent = i18n.t('chatHeaderStatus') || (lang === 'tr' ? '🟢 Çevrimiçi • Size yardıma hazır' : (lang === 'en' ? '🟢 Online • Ready to help' : '🟢 ھازىر توردا • سىزگە ياردەم بېرىشكە تەييار'));
    const chatClrSpan = document.getElementById('chatClearBtnSpan');
    if (chatClrSpan) chatClrSpan.textContent = i18n.t('chatClearBtn') || (lang === 'tr' ? 'Temizle' : (lang === 'en' ? 'Clear' : 'تازىلاش'));
    const chatNoticeSpan = document.getElementById('chatPersistentNoticeSpan');
    if (chatNoticeSpan) chatNoticeSpan.textContent = i18n.t('chatNotice') || (lang === 'tr' ? 'Sohbet geçmişiniz siz temizleyene kadar güvenle cihazınızda saklanır.' : (lang === 'en' ? 'Your chat history is saved securely until you clear it.' : 'پاراڭ خاتىرىسى سىز ئۆزىڭىز «تازىلاش»نى باقمىغۇچە، بىر نەچچە يىلدىن كېيىن كىرسىڭىزمۇ مەڭگۈ ساقلىنىدۇ.'));
    const chatUrgent = document.getElementById('chatUrgentSpan');
    if (chatUrgent) chatUrgent.textContent = i18n.t('chatUrgentLabel') || (lang === 'tr' ? 'Acil durumlarda:' : (lang === 'en' ? 'For urgent matters:' : 'جىددىي ئۇچۇرلاردا:'));
    const chatWaSpan = document.getElementById('chatWaDirectSpan');
    if (chatWaSpan) chatWaSpan.textContent = i18n.t('chatWaDirect') || (lang === 'tr' ? 'WhatsApp ile doğrudan yazın' : (lang === 'en' ? 'Chat directly via WhatsApp' : 'WhatsApp ئارقىلىق بىۋاسىتە يېزىڭ'));

    const cMsgInp = document.getElementById('chatMessageInput');
    if (cMsgInp) cMsgInp.placeholder = i18n.t('chatPlaceholder') || (lang === 'tr' ? 'Mesajınızı yazın...' : (lang === 'en' ? 'Type your message...' : 'ئالىي باشقۇرغۇچىغا ئۇچۇر يېزىڭ...'));
    const cCustName = document.getElementById('chatCustomerName');
    if (cCustName) cCustName.placeholder = i18n.t('chatNamePlaceholder') || (lang === 'tr' ? 'İsminiz (isteğe bağlı)' : (lang === 'en' ? 'Your Name (optional)' : 'ئىسمىڭىز (تاللاشچان)'));
    const cCustPhone = document.getElementById('chatCustomerPhone');
    if (cCustPhone) cCustPhone.placeholder = i18n.t('chatPhonePlaceholder') || (lang === 'tr' ? 'Telefon veya E-posta' : (lang === 'en' ? 'Phone or Email' : 'تېلېفون ياكى ئىمائىل (تەلەپ قىلىنىدۇ)'));

    const chipTrack = document.getElementById('chatChipTrack');
    if (chipTrack) {
      chipTrack.textContent = i18n.t('chatChipTrack') || (lang === 'tr' ? '📦 Kargo Sorgula' : (lang === 'en' ? '📦 Track Parcel' : '📦 پوسۇلكا سۈرۈشتۈرۈش'));
      chipTrack.dataset.msg = lang === 'tr' ? 'Sipariş ve kargo durumumu sorgulamak istiyorum.' : (lang === 'en' ? 'I would like to check my parcel status.' : 'پوسۇلكا ئەھۋالىمنى سۈرۈشتۈرمەكچىتىم.');
    }
    const chipBank = document.getElementById('chatChipBank');
    if (chipBank) {
      chipBank.textContent = i18n.t('chatChipBank') || (lang === 'tr' ? '💳 Banka Bilgisi' : (lang === 'en' ? '💳 Bank Info' : '💳 بانكا ئۇچۇرى'));
      chipBank.dataset.msg = lang === 'tr' ? 'Ödeme yapmak için banka IBAN bilgisi alabilir miyim?' : (lang === 'en' ? 'Can I have the bank IBAN information for payment?' : 'پۇل تۆلەش ئۈچۈن بانكا IBAN ئۇچۇرىنى بەرسىڭىز.');
    }
    const chipCargo = document.getElementById('chatChipCargo');
    if (chipCargo) {
      chipCargo.textContent = i18n.t('chatChipCargo') || (lang === 'tr' ? '🚚 Kargo Durumu' : (lang === 'en' ? '🚚 Cargo Status' : '🚚 كارگو ئەھۋالى'));
      chipCargo.dataset.msg = lang === 'tr' ? 'Ürün ne zaman kargoya verilir, kargo takip numarası nedir?' : (lang === 'en' ? 'When will my order be shipped, and what is the cargo code?' : 'مال قاچان يوللىنىدۇ، كارگو كودى نېمە؟');
    }

    const btnSendChat = document.getElementById('btnSendChatMessage');
    if (btnSendChat) btnSendChat.title = lang === 'tr' ? 'Mesajı Gönder' : (lang === 'en' ? 'Send Message' : 'ئۇچۇر ئەۋەتىش');
    const btnCloseChat = document.getElementById('btnCloseChatBox');
    if (btnCloseChat) btnCloseChat.title = lang === 'tr' ? 'Kapat' : (lang === 'en' ? 'Close' : 'تاقاش');
    const btnClearChat = document.getElementById('btnClearChatHistory');
    if (btnClearChat) btnClearChat.title = lang === 'tr' ? 'Sohbeti Temizle' : (lang === 'en' ? 'Clear Chat' : 'پاراڭ خاتىرىسىنى ئۆچۈرۈش');
    if (cCustName) cCustName.title = lang === 'tr' ? 'Müşteri Adı' : (lang === 'en' ? 'Customer Name' : 'خېرىدار ئىسمى');
    if (cCustPhone) cCustPhone.title = lang === 'tr' ? 'Telefon veya E-posta' : (lang === 'en' ? 'Phone or Email' : 'تېلېفون ياكى ئىمائىل');

    // 📱 لەيلىمە پاراڭ كۇنۇپكىسى ۋە ئۇچۇر ئەسكەرتكۈچى (Floating Chat Button & Tooltip)
    const liveChatBtn = document.getElementById('adminLiveChatToggleBtn');
    if (liveChatBtn) {
      liveChatBtn.title = i18n.t('floatingChatTitle') || (lang === 'tr' ? 'Yönetici ile Doğrudan Canlı Sohbet' : (lang === 'en' ? 'Direct Live Chat with Admin' : 'ئالىي باشقۇرغۇچى بىلەن بىۋاسىتە پاراڭلىشىش'));
    }
    const liveChatTooltip = document.querySelector('.floating-contact-tooltip');
    if (liveChatTooltip) {
      liveChatTooltip.textContent = i18n.t('floatingChatTooltip') || (lang === 'tr' ? 'Yönetici ile Canlı Sohbet' : (lang === 'en' ? 'Chat with Live Support' : 'ئالىي باشقۇرغۇچى بىلەن پاراڭلىشىش'));
    }
    const onlineDot = document.querySelector('.chat-online-dot');
    if (onlineDot) {
      onlineDot.title = lang === 'tr' ? 'Şimdi Çevrimiçi' : (lang === 'en' ? 'Online Now' : 'ھازىر توردا');
    }

    // 🎡 ئامەت چاقى يېپىش كۇنۇپكىسى (Lucky Wheel Close Button)
    const btnCloseWheel = document.getElementById('btnCloseLuckyWheel');
    if (btnCloseWheel) {
      btnCloseWheel.title = lang === 'tr' ? 'Kapat' : (lang === 'en' ? 'Close' : 'تاقاش');
    }

    // 🎡 ئامەت چاقى تېكىستلىرى ۋە كارتىنى تىلغا ماس ھالدا دەل ۋاقتىدا يېڭىلاش
    if (typeof window.updateLuckyWheelLocalization === 'function') {
      window.updateLuckyWheelLocalization();
    }

    // 💬 نەق مەيدان پاراڭ كۆزنىكىنى (خېرىدار سالاھىيىتى ۋە سالام ئۇچۇرلىرىنى) ھازىرقى تىلغا ئالماشتۇرۇش
    if (typeof window.updateCustomerLiveChatLocalization === 'function') {
      window.updateCustomerLiveChatLocalization();
    }

    // Instagram ئۇلانمىلىرىنى تىل بويىچە يېڭىلاش (ئۇيغۇرچە: teklimakancom, تۈركچە/ئىنگلىزچە: teklimakan.online)
    const instaUrl = i18n.t('instagramUrl') || (lang === 'ug' ? 'https://www.instagram.com/teklimakancom' : 'https://www.instagram.com/teklimakan.online');
    const instaHandle = i18n.t('instagramHandle') || (lang === 'ug' ? '@teklimakancom' : '@teklimakan.online');

    const fBrandInsta = document.getElementById('footerBrandInstaLink');
    if (fBrandInsta) fBrandInsta.href = instaUrl;
    const fBrandInstaText = document.getElementById('footerBrandInstaText');
    if (fBrandInstaText) fBrandInstaText.textContent = instaHandle;

    const flInsta = document.getElementById('fLinkInsta');
    if (flInsta) {
      flInsta.href = instaUrl;
      const instaSpan = document.getElementById('fLinkInstaSpan') || flInsta.querySelector('span');
      if (instaSpan) instaSpan.textContent = i18n.t('fLinkInsta');
    }

    const fContactInsta = document.getElementById('fContactInstaLink');
    if (fContactInsta) {
      fContactInsta.href = instaUrl;
      fContactInsta.textContent = instaHandle;
    }

    // 🎁 ئىنىستىگېرام ئەگەشكۈچى سوۋغىتى ھېسابات ۋە ئۇلانمىسى
    const igPageHandle = document.getElementById('instaGiftPageHandle');
    if (igPageHandle) igPageHandle.textContent = instaHandle;
    const igFollowBtn = document.getElementById('instaGiftFollowBtn');
    if (igFollowBtn) igFollowBtn.href = instaUrl;

    // ئۈستۈنكى ئايلانما ئېلان (Marquee) پۈتۈنلەي renderMarqueeTicker ئارقىلىق يېڭىلىنىدۇ

    // 🌿 ئۇيغۇر تىبابىتى كۇنۇپكىسى تېكىستى ۋە نىشان تور ئادرېسى
    const medLink = document.getElementById('btnUyghurMedicineFooter');
    const medSpan = document.getElementById('footerMedicineSpan') || document.getElementById('footerFriendlyLinksSpan') || document.getElementById('footerMerchantSpan');
    const medUrl = (lang === 'tr' || lang === 'en') ? 'https://www.uyghurmedicine.com/tr' : 'https://www.uyghurmedicine.com';
    const medTitle = lang === 'tr' ? 'Uygur Tıbbı' : (lang === 'en' ? 'Uyghur Medicine' : 'ئۇيغۇر تىبابىتى');
    if (medLink) {
      medLink.href = medUrl;
      medLink.title = medTitle;
    }
    if (medSpan) {
      medSpan.textContent = medTitle;
    }

    const flMerch = document.getElementById('fLinkMerchants');
    if (flMerch) flMerch.textContent = medTitle;

    const flFriendlyTitle = document.getElementById('friendlyLinksModalTitle');
    if (flFriendlyTitle) flFriendlyTitle.textContent = i18n.t('friendlyLinksModalTitle') || 'دوستانە ئۇلىنىشلار';
    const flFriendlySub = document.getElementById('friendlyLinksModalSubtitle');
    if (flFriendlySub) flFriendlySub.textContent = i18n.t('friendlyLinksModalSubtitle') || 'تەكلىماكان تور سودا سۇپىسىنىڭ دوستلىرى ۋە ھەمكارلاشقان تور بېكەتلىرى';
    const flFriendlyNotice = document.getElementById('friendlyLinksNotice');
    if (flFriendlyNotice) flFriendlyNotice.textContent = i18n.t('friendlyLinksNotice') || 'بۇ سەھىپىگە ئۆزىڭىزنىڭ ياكى ھەمكارلاشقۇچىلارنىڭ تور بېكەت ئۇلىنىشلىرىنى ئاسانلا كىرگۈزۈپ ئىشلىتەلەيسىز.';

    const fAgentLink = document.getElementById('footerAgentLinkText');
    if (fAgentLink) fAgentLink.textContent = i18n.t('agentFooterLink') || i18n.t('topAgent');
    const fAgentSpan = document.getElementById('footerAgentSpan');
    if (fAgentSpan) fAgentSpan.textContent = i18n.t('agentFooterLink') || i18n.t('topAgent');
    const flAdmin = document.getElementById('fLinkAdmin');
    if (flAdmin) flAdmin.textContent = i18n.t('fLinkAdmin');

    const fPhoneL = document.getElementById('fLabelPhone');
    if (fPhoneL) fPhoneL.textContent = i18n.t('fLabelPhone');
    const fWebL = document.getElementById('fLabelWebsite');
    if (fWebL) fWebL.textContent = i18n.t('fLabelWebsite');

    const fCopy = document.getElementById('footerCopyright');
    if (fCopy) fCopy.textContent = i18n.t('footerCopyright');
    const fContactLine = document.getElementById('footerContactLine');
    if (fContactLine) fContactLine.innerHTML = `${i18n.t('footerContactLine')}`;

    // چىقىم ۋە ئىشەنچ كاپالەت بەلگىلىرى
    const fbSsl = document.getElementById('footerBadgeSsl');
    if (fbSsl) fbSsl.textContent = i18n.t('footerBadgeSsl');
    const fb3d = document.getElementById('footerBadge3d');
    if (fb3d) fb3d.textContent = i18n.t('footerBadge3d');
    const fbOrig = document.getElementById('footerBadgeOriginal');
    if (fbOrig) fbOrig.textContent = i18n.t('footerBadgeOriginal');
    const fbRet = document.getElementById('footerBadgeReturn');
    if (fbRet) fbRet.textContent = i18n.t('footerBadgeReturn');

    // شەھەر ۋە رايون تاللانمىلىرىنى تۈركىيە 81 ۋىلايىتىگە دەل ئۇلاش
    const citySelect = document.getElementById('checkoutCustCity');
    const distSelect = document.getElementById('checkoutCustDistrict');
    if (window.TeklimakanLocations && citySelect && distSelect) {
      const savedCity = citySelect.value || 'İSTANBUL';
      const savedDist = distSelect.value || '';
      window.TeklimakanLocations.setupLinkedCityDistrict('checkoutCustCity', 'checkoutCustDistrict', savedCity, savedDist);
    }

    // تىل يۆنىلىشىگە قاراپ Hero كۇنۇپكىسىنىڭ يا ئوقىنى توغرىلاش
    const isRtl = i18n.isRTL();
    document.querySelectorAll('.hero-btn i').forEach(icon => {
      icon.className = isRtl ? 'fas fa-arrow-left' : 'fas fa-arrow-right';
    });

    // ۋاكالەتچى مەركىزى كۆزنىكى تېكىستلىرى
    const apTitle = document.getElementById('agentPortalTitle');
    if (apTitle) apTitle.textContent = i18n.t('agentModalTitle');
    const apSub = document.getElementById('agentPortalSubtitle');
    if (apSub) apSub.textContent = i18n.t('agentModalSubtitle');
    const apTab1 = document.getElementById('agentTab1Text');
    if (apTab1) apTab1.textContent = i18n.t('agentTabApply');
    const apTab2 = document.getElementById('agentTab2Text');
    if (apTab2) apTab2.textContent = i18n.t('agentTabSubmit');

    if (typeof renderAgentPortalModal === 'function') {
      renderAgentPortalModal(lang);
    }
    if (typeof renderLinkViolationModal === 'function') {
      renderLinkViolationModal(lang);
    }

    // بىز ھەققىدە كۆزنىكىنى تىل بويىچە يېڭىلاش
    if (typeof renderAboutUsModal === 'function') {
      renderAboutUsModal(lang);
    }

    // كونۇپكىلارنىڭ خەۋەردار قىلىش تېكىستلىرى (Titles & Tooltips)
    const sBtn = document.getElementById('mainSearchBtn');
    if (sBtn) sBtn.title = i18n.t('searchBtn');
    const cBtn = document.getElementById('cartToggleBtn');
    if (cBtn) cBtn.title = i18n.t('cartBtn');
    const tBtn = document.getElementById('themeToggleBtn');
    if (tBtn) tBtn.title = lang === 'ug' ? 'تۈن ۋە كۈندۈز تەڭشىكى' : (lang === 'tr' ? 'Karanlık / Aydınlık Mod' : 'Dark / Light Mode');
    const cdBtn = document.getElementById('closeCartDrawerBtn');
    if (cdBtn) cdBtn.title = lang === 'ug' ? 'تاقاش' : (lang === 'tr' ? 'Kapat' : 'Close');
    const fsBtn = document.getElementById('flashSaleBtn');
    if (fsBtn) fsBtn.title = i18n.t('flashSaleBadge');
    document.querySelectorAll('.btn-close-drawer').forEach(b => b.title = lang === 'ug' ? 'تاقاش' : (lang === 'tr' ? 'Kapat' : 'Close'));

    // Hero ئېلان بەلگە چېكىتلىرى
    document.querySelectorAll('.dot-indicator').forEach((dot, i) => {
      dot.title = lang === 'ug' ? `${i+1}-ئېلان` : (lang === 'tr' ? `Kampanya ${i+1}` : `Slide ${i+1}`);
    });

    // تۆۋەنكى دۇكان نامى ۋە ئىجتىمائىي تاراتقۇ
    document.querySelectorAll('.footer-store-name').forEach(el => el.textContent = i18n.t('storeName'));
    if (fBrandInsta) fBrandInsta.title = i18n.t('fLinkInsta');
    if (fCol2) fCol2.title = i18n.t('fLinkAbout');

    // كاپالەت ۋە ئىشەنچ بەلگىلىرىنىڭ كۆپ تىللىق تەپسىلاتى
    const trustTitles = {
      ug: [
        '256-Bit SSL كودلاشتۇرۇلغان يۇقىرى بىخەتەر چىقىم سىستېمىسى',
        '3D Secure قوش يۆنىلىشلىك كارتىنى دەلىللەش قوغدىنىشى',
        '100% تەكشۈرۈلگەن ساپ ئەسلى مەھسۇلات',
        '7 كۈن ئىچىدە خاتىرجەم قايتۇرۇش ياكى ئالماشتۇرۇش'
      ],
      tr: [
        '256-Bit SSL Şifreli Yüksek Güvenlikli Ödeme Altyapısı',
        '3D Secure İki Aşamalı Kart Güvenlik Doğrulaması',
        '%100 Denetlenmiş Orijinal Ürün Garantisi',
        '7 Gün Koşulsuz Kolay İade ve Değişim İmkanı'
      ],
      en: [
        '256-Bit SSL Encrypted Secure Checkout',
        '3D Secure Two-Factor Payment Protection',
        '100% Strictly Inspected Authentic Guarantee',
        '7-Day Hassle-Free Easy Returns & Exchange'
      ]
    };
    const curTrustTitles = trustTitles[lang] || trustTitles.ug;
    document.querySelectorAll('.trust-badge-item').forEach((el, idx) => {
      if (curTrustTitles[idx]) el.title = curTrustTitles[idx];
    });

    const havalePill = document.querySelector('.payment-card-pill[title*="Havale"], .payment-card-pill[title*="بانكا يۆتكەش"]');
    if (havalePill) havalePill.title = lang === 'ug' ? 'بانكا يۆتكەش (Havale / EFT / FAST)' : (lang === 'tr' ? 'Banka Havalesi / FAST / EFT ile Ödeme' : 'Bank Wire / FAST / EFT Transfer');
    const waPill = document.querySelector('.payment-card-pill[title*="WhatsApp"]');
    if (waPill) waPill.title = lang === 'ug' ? 'WhatsApp ئارقىلىق زاكاز چىقىمى ۋە كېلىشىش' : (lang === 'tr' ? 'WhatsApp Üzerinden Sipariş ve Ödeme' : 'Order & Payment via WhatsApp');

    const langSelect = document.getElementById('languageSelect');
    if (langSelect) langSelect.value = lang;

    // تىل تاللاش كونۇپكىسىدىكى بايراق ۋە خەتنى يېڭىلاش
    const navFlag = document.getElementById('navLangFlag');
    const navLabel = document.getElementById('navLangLabel');
    if (navFlag && navLabel) {
      if (lang === 'ug') {
        navFlag.src = 'images/flag_uyghur.png';
        navFlag.alt = 'ئۇيغۇرچە';
        navFlag.style.display = 'inline-block';
        navLabel.textContent = 'ئۇيغۇرچە';
      } else if (lang === 'tr') {
        navFlag.src = 'images/flag_tr.png';
        navFlag.alt = 'Türkçe';
        navFlag.style.display = 'inline-block';
        navLabel.textContent = 'Türkçe';
      } else {
        navFlag.src = 'images/flag_en.png';
        navFlag.alt = 'English';
        navFlag.style.display = 'inline-block';
        navLabel.textContent = 'English';
      }
    }

    // مەخسۇس تىل كۆزنىكىدىكى تاللانما بەلگىسىنى ماس قەدەملەش
    document.querySelectorAll('.lang-option-row').forEach(row => {
      const rowLang = row.dataset.lang;
      const indicator = row.querySelector('.lang-radio-indicator');
      if (rowLang === lang) {
        row.classList.add('active');
        if (indicator) indicator.classList.add('checked');
      } else {
        row.classList.remove('active');
        if (indicator) indicator.classList.remove('checked');
      }
    });

    const curSelect = document.getElementById('currencySelect');
    if (curSelect) curSelect.value = window.appStore.getCurrency();
  }

  // ==================== 🏷️ ماركىلارنى رېندېرلاش (Brands) ====================
  function renderBrands() {
    const container = document.getElementById('brandsPillsContainer');
    if (!container) return;

    const brands = window.appStore.getBrands();
    container.innerHTML = '';

    // "بارلىق ماركىلار" كونۇپكىسى
    const allBtn = document.createElement('button');
    allBtn.className = `brand-btn-pill ${currentBrand === 'all' ? 'active' : ''}`;
    allBtn.innerHTML = `<i class="fas fa-th"></i> <span>${window.appI18n.t('allBrands')}</span>`;
    allBtn.addEventListener('click', () => {
      currentBrand = 'all';
      document.querySelectorAll('.brand-btn-pill').forEach(b => b.classList.remove('active'));
      allBtn.classList.add('active');
      renderProducts();
    });
    container.appendChild(allBtn);

    // باشقا ماركىلار
    brands.filter(b => b !== 'بارلىق ماركىلار').forEach(brand => {
      const btn = document.createElement('button');
      btn.className = `brand-btn-pill ${currentBrand === brand ? 'active' : ''}`;
      const localizedBrand = window.appI18n.getBrandName(brand);
      btn.innerHTML = `<i class="fas fa-award"></i> <span>${localizedBrand}</span>`;
      btn.addEventListener('click', () => {
        currentBrand = brand;
        document.querySelectorAll('.brand-btn-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts();
      });
      container.appendChild(btn);
    });
  }

  // ==================== تۈرلەر ====================
  function renderCategories() {
    const lang = window.appI18n.getLang();
    let categories = window.appStore.getCategories(lang);
    if (!categories || !Array.isArray(categories) || categories.length <= 1) {
      const fallbackCats = (typeof window !== 'undefined' && window.INITIAL_CATEGORIES)
        ? window.INITIAL_CATEGORIES
        : (typeof INITIAL_CATEGORIES !== 'undefined' ? INITIAL_CATEGORIES : []);
      categories = fallbackCats.map(c => ({
        ...c,
        displayName: (c.translations && c.translations[lang]) ? c.translations[lang] : c.name
      }));
    }

    // 🛡️ «بارلىق تۈرلەر / Tüm Kategoriler» ساختا تۈرلىرىنى تىزىملىكتىن پاكىز چىقىرىۋېتىش (پەقەت يەككە 'all' قالىدۇ)
    categories = categories.filter(c => c && (c.id === 'all' || (!isPseudoCategory(c.id) && !isPseudoCategory(c.name))));

    const container = document.getElementById('categoryPillsContainer');
    const select = document.getElementById('searchCategorySelect');

    if (container) {
      container.innerHTML = '';
      const seenPills = new Set();
      categories.forEach(cat => {
        if (cat.id !== 'all' && (isPseudoCategory(cat.id) || isPseudoCategory(cat.name))) return;
        const name = (cat.displayName || cat.name || '').trim();
        if (seenPills.has(name)) return;
        seenPills.add(name);
        const pill = document.createElement('button');
        pill.className = `category-pill ${currentCategory === cat.id ? 'active' : ''}`;
        pill.innerHTML = `<i class="${cat.icon}"></i> <span>${name}</span>`;
        pill.addEventListener('click', () => {
          currentCategory = cat.id;
          document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          if (select) select.value = cat.id;
          renderProducts();
        });
        container.appendChild(pill);
      });
    }

    if (select) {
      select.innerHTML = `<option value="all">${window.appI18n.t('allCategories')}</option>`;
      const seenOpts = new Set();
      seenOpts.add(window.appI18n.t('allCategories'));
      categories.forEach(cat => {
        if (cat.id !== 'all' && !isPseudoCategory(cat.id) && !isPseudoCategory(cat.name)) {
          const name = (cat.displayName || cat.name || '').trim();
          if (seenOpts.has(name)) return;
          seenOpts.add(name);
          const opt = document.createElement('option');
          opt.value = cat.id;
          opt.textContent = name;
          if (cat.id === currentCategory) opt.selected = true;
          select.appendChild(opt);
        }
      });
    }
  }

  // ==================== تاۋارلار سۈزگۈچى ====================
  function getFilteredProducts() {
    const lang = window.appI18n.getLang();
    let products = window.appStore.getProductsByLang(lang);

    // تۈر بويىچە
    if (currentCategory !== 'all') {
      products = products.filter(p => p.category === currentCategory || (p.originalProduct && p.originalProduct.category === currentCategory));
    }

    // 🏷️ ماركا بويىچە
    if (currentBrand !== 'all') {
      products = products.filter(p => p.brand === currentBrand);
    }

    // ئىزدەش
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // باھا
    products = products.filter(p => window.appStore.convertPrice(p.price) <= maxPrice);

    if (onlyInStock) {
      products = products.filter(p => p.stock > 0);
    }

    if (sortBy === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      products.sort((a, b) => b.id.localeCompare(a.id));
    } else {
      products.sort((a, b) => (b.sales || 0) - (a.sales || 0));
    }

    if (window.spotlightProductId) {
      const idx = products.findIndex(p => p.id === window.spotlightProductId);
      if (idx > -1) {
        const [spotlightItem] = products.splice(idx, 1);
        products.unshift(spotlightItem);
      }
    }

    return products;
  }

  // ==================== سودىگەر ئىناۋەت بەلگىسى (Trust / Reputation Badge) ====================
  function getMerchantBadgeHtml(product) {
    const lang = (window.appI18n && typeof window.appI18n.getLang === 'function') ? window.appI18n.getLang() : 'ug';
    if (lang !== 'ug') return ''; // پەقەتلا ئۇيغۇرچە بەتتە كۆرۈنىدۇ، باشقا تىللاردا كۆرۈنمەيدۇ
    let badge = null;
    if (window.appStore && window.appStore.getProductMerchantBadge) {
      badge = window.appStore.getProductMerchantBadge(product);
    }
    if (!badge || typeof badge !== 'object') {
      const repName = (typeof badge === 'string' && badge) ? badge : (product.merchantBadge || 'ئىشەنچىلىك سودىگەر');
      badge = (window.appStore && window.appStore.getReputationBadgeObject)
        ? window.appStore.getReputationBadgeObject(repName)
        : {
            name: repName,
            textColor: '#059669',
            bgColor: '#ecfdf5',
            borderColor: '#a7f3d0',
            icon: 'fa-check-circle'
          };
    }

    const textColor = badge.textColor || '#059669';
    const bgColor = badge.bgColor || '#ecfdf5';
    const borderColor = badge.borderColor || '#a7f3d0';
    const icon = badge.icon || 'fa-check-circle';
    const rawName = badge.name || 'ئىشەنچىلىك سودىگەر';
    const displayName = (window.appI18n && typeof window.appI18n.getReputationBadgeName === 'function')
      ? window.appI18n.getReputationBadgeName(rawName)
      : rawName;

    return `<span class="product-merchant-tag" style="color: ${textColor} !important; background: ${bgColor} !important; border: 1px solid ${borderColor} !important; font-weight: 800;" title="${displayName}"><i class="fas ${icon}" style="color: ${textColor} !important;"></i> <span style="color: ${textColor} !important;">${displayName}</span></span>`;
  }

  // ==================== ۋاكالەتچى ID كودى بەلگىسى (Agent ID Badge) ====================
  function getAgentBadgeHtml(product, isCompact = false) {
    const lang = (window.appI18n && typeof window.appI18n.getLang === 'function') ? window.appI18n.getLang() : 'ug';
    if (lang !== 'ug') return ''; // پەقەتلا ئۇيغۇرچە بەتتە كۆرۈنىدۇ، باشقا تىللاردا كۆرۈنمەيدۇ
    if (!product) return '';
    let agent = null;
    if (window.appStore && typeof window.appStore.getProductAgent === 'function') {
      agent = window.appStore.getProductAgent(product);
    } else if (product.agentId) {
      agent = { id: product.agentId, name: product.agentName || product.agentId };
    }

    const i18n = window.appI18n;
    const labelText = (i18n && typeof i18n.t === 'function' && i18n.t('agentIdLabel')) || 'ۋاكالەتچى ID:';

    if (agent && agent.id) {
      const agentId = agent.id;
      const cleanName = agent.name ? String(agent.name).replace(/\s*\(.*?\)/, '').trim() : '';
      const tooltip = cleanName ? `${cleanName} (${agentId})` : agentId;

      if (isCompact) {
        return `<span class="product-agent-badge compact" style="background: rgba(30, 58, 138, 0.06); color: #1e40af; border: 1px solid rgba(30, 58, 138, 0.2); padding: 1.5px 6px; border-radius: 5px; font-size: 0.72rem; font-weight: 800; display: inline-flex; align-items: center; gap: 3px;" title="${labelText} ${tooltip}"><i class="fas fa-id-badge" style="color: #2563eb; font-size: 0.75rem;"></i><span class="number-latin" style="color: #1d4ed8; font-weight: 800;">${agentId}</span></span>`;
      }

      const tooltipPrefix = (!i18n || i18n.getLang() === 'ug') ? 'مەھسۇلاتنى تەمىنلىگۈچى ۋاكالەتچى:' : (i18n.getLang() === 'tr' ? 'Tedarikçi Temsilci:' : 'Authorized Vendor Agent:');
      return `<span class="product-agent-badge" style="background: rgba(37, 99, 235, 0.08); color: #1e3a8a; border: 1.2px solid rgba(37, 99, 235, 0.25); padding: 2px 9px; border-radius: 6px; font-size: 0.78rem; font-weight: 800; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 1px 2px rgba(37, 99, 235, 0.05);" title="${tooltipPrefix} ${tooltip}"><i class="fas fa-id-badge" style="color: #2563eb; font-size: 0.85rem;"></i> <span>${labelText}</span> <strong class="number-latin" style="color: #1d4ed8; font-weight: 900; letter-spacing: 0.4px;">${agentId}</strong></span>`;
    }

    // ئەگەر ۋاكالەتچى باغلانمىغان بولسا، سۇپا رەسمىي دەپ كۆرسىتىش
    const officialLabel = (i18n && typeof i18n.t === 'function' && i18n.t('platformOfficialLabel')) || 'تەكلىماكان سۇپىسى';
    const compactPlatformLabel = (i18n && typeof i18n.t === 'function' && i18n.t('platformBadgeShort')) || 'سۇپا';
    if (isCompact) {
      return `<span class="product-agent-badge compact platform" style="background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; padding: 1.5px 6px; border-radius: 5px; font-size: 0.72rem; font-weight: 700; display: inline-flex; align-items: center; gap: 3px;" title="${officialLabel}"><i class="fas fa-store-alt" style="color: #64748b; font-size: 0.72rem;"></i><span style="color: #475569;">${compactPlatformLabel}</span></span>`;
    }
    return `<span class="product-agent-badge platform" style="background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; padding: 2px 9px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;" title="${officialLabel}"><i class="fas fa-store-alt" style="color: #64748b; font-size: 0.82rem;"></i> <span>${officialLabel}</span></span>`;
  }

  // ==================== تاۋار كارتىلىرىنى ھاسىللاش (Single Product Card) ====================
  function createSingleProductCard(product, i18n, store) {
    const card = document.createElement('div');
    card.className = `product-card ${window.spotlightProductId === product.id ? 'deal-spotlight-active' : ''}`;
    card.dataset.id = product.id;

    let stockHtml = '';
    const rawUnit = (product.unit && product.unit !== 'custom') ? product.unit : '';
    const cleanUnitStr = (u) => {
      if (!u || typeof u !== 'string') return '';
      let s = u.trim();
      if (!s || s === '?????') return '';
      const midGram = s.match(/^گ[ىي]?را\s*(\d+)\s*م$/i);
      if (midGram) return `${midGram[1]} گرام`;
      if (/^كىلو\s*1$/i.test(s) || /^1\s*كىلو$/i.test(s)) return 'كىلو';
      if (/^دانە\s*1$/i.test(s) || /^1\s*دانە$/i.test(s)) return 'دانە';
      if (/^قۇتا\s*1$/i.test(s) || /^1\s*قۇتا$/i.test(s)) return 'قۇتا';
      const trailGram = s.match(/^(گ[ىي]?رام)\s*(\d+)$/i);
      if (trailGram) return `${trailGram[2]} گرام`;
      return s;
    };
    const cleanedUnit = cleanUnitStr(rawUnit);
    const localizedUnit = (i18n && typeof i18n.getUnitName === 'function') ? i18n.getUnitName(cleanedUnit) : cleanedUnit;
    const unitWord = (i18n && typeof i18n.t === 'function') ? i18n.t('itemsUnit') : 'دانە';
    const stockUnitLabel = localizedUnit ? (/\d/.test(localizedUnit) ? `${unitWord} (${localizedUnit})` : localizedUnit) : unitWord;

    if (product.stock <= 0) {
      stockHtml = `<span class="stock-status-out"><i class="fas fa-times-circle"></i> ${i18n.t('outOfStock')}</span>`;
    } else if (product.stock <= 8) {
      stockHtml = `<span class="stock-status-low"><i class="fas fa-exclamation-circle"></i> ${i18n.t('lowStock')} <bdi class="number-latin">${product.stock}</bdi> ${stockUnitLabel}</span>`;
    } else {
      stockHtml = `<span class="stock-status-in"><i class="fas fa-check-circle"></i> ${i18n.t('inStock')}</span>`;
    }

    let badgeHtml = '';
    if (product.badge) {
      let badgeClass = 'badge-sale';
      if (product.badge === 'ئەڭ قىزىق') badgeClass = 'badge-hot';
      if (product.badge === 'يېڭى كەلگەن') badgeClass = 'badge-new';
      const localizedBadge = i18n.getBadgeName(product.badge);
      badgeHtml = `<span class="product-badge ${badgeClass}">${localizedBadge}</span>`;
    }

    const formattedPrice = store.formatPrice(product.price);
    const formattedOldPrice = product.oldPrice ? store.formatPrice(product.oldPrice) : null;
    const isWish = store.isInWishlist(product.id);
    const safeRating = Number(String(product.rating || 5).replace(',', '.'));
    const displayRating = isNaN(safeRating) ? '5.0' : safeRating.toFixed(1);

    card.innerHTML = `
      <div class="product-card-thumb" title="${product.name} - ${i18n.t('quickView')}">
        <img src="${product.image || 'images/default_product.jpg'}" alt="${product.name}" loading="lazy" onerror="this.onerror=null; this.src='images/default_product.jpg'">
        <div class="image-shield-overlay"></div>
        <div class="product-badges">
          ${badgeHtml}
        </div>
        <button class="product-wish-btn ${isWish ? 'active' : ''}" data-id="${product.id}" title="ياقتۇرغانلارغا قوشۇش">
          <i class="${isWish ? 'fas' : 'far'} fa-heart"></i>
        </button>
        <button type="button" class="product-share-btn" data-id="${product.id}" title="ھەمبەھىرلەش">
          <i class="fas fa-share-nodes"></i>
        </button>
      </div>
      <div class="product-card-body">
        <h3 class="product-title" title="${product.name}">${product.name}</h3>

        <div class="product-category-row" style="margin-bottom: 0.45rem; display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap;">
          <span class="product-category-tag" title="${i18n.getCategoryName(product.category)}"><i class="${window.appStore && typeof window.appStore.getCategoryIcon === 'function' ? window.appStore.getCategoryIcon(product.category) : 'fas fa-tag'}"></i> <span>${i18n.getCategoryName(product.category)}</span></span>
          ${getMerchantBadgeHtml(product)}
          ${getAgentBadgeHtml(product, true)}
        </div>
        
        <div class="product-rating">
          <i class="fas fa-star"></i>
          <span>${displayRating}</span>
          <span class="rating-count">(${product.ratingCount || 10} ${i18n.t('reviewsText')})</span>
        </div>

        <div class="product-stock-bar">
          ${stockHtml}
          ${Number(product.sales) > 0 ? `<span class="sales-count">${i18n.t('salesCount')} <bdi class="number-latin">${product.sales}</bdi></span>` : ''}
        </div>

        <div class="product-pricing">
          <span class="current-price">${formattedPrice}${product.unit ? `<small class="unit-text" style="font-size: 0.82rem; font-weight: normal; color: var(--text-muted); margin-right: 4px;"> / <bdi>${product.unit}</bdi></small>` : ''}</span>
          ${formattedOldPrice ? `<span class="original-price">${formattedOldPrice}</span>` : ''}
        </div>

        <div class="product-card-actions">
          <button class="btn-add-cart" data-id="${product.id}" ${product.stock <= 0 ? 'disabled' : ''} title="${i18n.t('addToCart')}">
            <i class="fas fa-shopping-bag"></i>
            <span>${product.stock <= 0 ? i18n.t('outOfStock') : i18n.t('addToCart')}</span>
          </button>
        </div>
      </div>
    `;

    return card;
  }

  // ==================== 🛍️ زامانىۋى سىيرىلما تاۋار راكى ئېلېمېنتى قۇرۇش (Showcase Shelf Element) ====================
  function createShowcaseShelfElement(shelf, currentLang = 'ug') {
    if (!shelf || !Array.isArray(shelf.products) || shelf.products.length === 0) return null;

    const shelfEl = document.createElement('div');
    shelfEl.className = 'showcase-shelf';
    shelfEl.dataset.shelfId = shelf.id;

    // Header: Title on right (RTL), Link on left (only if not 'بارلىقىنى كۆرۈش' and not empty)
    const headerEl = document.createElement('div');
    headerEl.className = 'showcase-shelf-header';

    const titleEl = document.createElement('h3');
    titleEl.className = 'showcase-shelf-title';
    titleEl.innerHTML = shelf.title;
    headerEl.appendChild(titleEl);

    const cleanLinkText = (shelf.linkText || '').replace(/[›>‹<]/g, '').trim();
    if (cleanLinkText && !cleanLinkText.includes('بارلىقىنى كۆرۈش') && !cleanLinkText.includes('Tümünü') && !cleanLinkText.includes('See All')) {
      const linkEl = document.createElement('a');
      linkEl.className = 'showcase-shelf-link';
      linkEl.href = shelf.linkUrl || '#catalogSection';
      linkEl.innerHTML = `<span>${cleanLinkText}</span> <i class="fas fa-chevron-left" style="font-size: 0.72rem;"></i>`;
      headerEl.appendChild(linkEl);
    }
    shelfEl.appendChild(headerEl);

    // Track wrapper & track
    const trackWrap = document.createElement('div');
    trackWrap.className = 'showcase-shelf-track-wrapper';

    const track = document.createElement('div');
    track.className = 'showcase-shelf-track';

    shelf.products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'shelf-product-card';
      card.dataset.id = product.id;

      const isWish = window.appStore.isInWishlist(product.id);
      const formattedPrice = window.appStore.formatPrice(product.price);
      const formattedOldPrice = product.oldPrice ? window.appStore.formatPrice(product.oldPrice) : null;
      const safeRating = Number(String(product.rating || 5).replace(',', '.'));
      const displayRating = isNaN(safeRating) ? '5.0' : safeRating.toFixed(1);
      const reviewCount = product.ratingCount || 24;

      // Strip badge:
      const stripColorClass = shelf.badgeStripBgType ? `strip-${shelf.badgeStripBgType}` : 'strip-green';
      let stripText = shelf.badgeStripText || '';
      if (currentLang === 'ug' && (stripText.includes('Cuma Kap') || !stripText)) {
        stripText = (shelf.translations?.ug?.badgeStripText) || '🚚 ئەتە بوسۇغىڭىزدا';
      }
      if (stripText && currentLang === 'ug') {
        if (stripText.includes('75') || stripText.includes('TL') || stripText.includes('لىرا')) {
          stripText = '🎁 ئالاھىدە ئېتىبار';
        }
      }

      // Verified badge:
      const verifiedHtml = shelf.showVerifiedBadge ? `<i class="fas fa-check-circle verified-icon" title="تەستىقلانغان ماركا"></i>` : '';

      // Wishlist button:
      const wishHtml = shelf.showWishlistBtn ? `
        <button type="button" class="shelf-card-wish-btn ${isWish ? 'active' : ''}" data-id="${product.id}" title="ياقتۇرغانلارغا قوشۇش">
          <i class="${isWish ? 'fas' : 'far'} fa-heart"></i>
        </button>
      ` : '';

      card.innerHTML = `
        <div class="shelf-card-thumb-wrap">
          <img class="shelf-card-img" src="${product.image || 'images/default_product.jpg'}" alt="${product.name}" loading="lazy" onerror="this.onerror=null; this.src='images/default_product.jpg'">
          ${wishHtml}
        </div>
        ${stripText ? `<div class="shelf-card-strip ${stripColorClass}"><bdi dir="ltr" style="unicode-bidi: isolate;">${stripText}</bdi></div>` : ''}
        <div class="shelf-card-body">
          <div>
            <div class="shelf-card-brand">
              <span dir="auto">${(window.appI18n && window.appI18n.getBrandName(product.brand)) || product.brand || 'تەكلىماكان تورى'}</span>
              ${verifiedHtml}
            </div>
            <h4 class="shelf-card-title" title="${product.name}">${product.name}</h4>
          </div>

          <div>
            <div class="shelf-card-rating">
              <i class="fas fa-star"></i>
              <span class="number-latin" style="font-weight: 700;">${displayRating}</span>
              <span class="rating-count">(<bdi class="number-latin">${reviewCount}</bdi>)</span>
              <i class="fas fa-camera cam-icon"></i>
            </div>

            <div class="shelf-card-pricing">
              <span class="shelf-card-price number-latin">${formattedPrice}</span>
              ${formattedOldPrice ? `<span class="shelf-card-old-price number-latin">${formattedOldPrice}</span>` : ''}
            </div>

            <div class="shelf-card-actions">
                <button type="button" class="shelf-card-add-btn" data-id="${product.id}">
                  <i class="fas fa-shopping-bag"></i> <span>${currentLang === 'tr' ? 'Sepete' : (currentLang === 'en' ? 'Cart' : 'سېۋەتكە')}</span>
                </button>
              </div>
          </div>
        </div>
      `;

      // Card click -> openQuickView
      card.addEventListener('click', (e) => {
        if (e.target.closest('.shelf-card-wish-btn') || e.target.closest('.shelf-card-add-btn')) return;
        if (typeof openQuickView === 'function') openQuickView(product.id);
      });

      // Wishlist button click
      const wishBtn = card.querySelector('.shelf-card-wish-btn');
      if (wishBtn) {
        wishBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const added = window.appStore.toggleWishlist(product.id);
          wishBtn.classList.toggle('active', added);
          const icon = wishBtn.querySelector('i');
          if (icon) icon.className = added ? 'fas fa-heart' : 'far fa-heart';
          if (typeof updateWishlistUI === 'function') updateWishlistUI();
          if (typeof playChime === 'function') playChime('click');
          const msg = added ? 'ياقتۇرغانلارغا قوشۇلدى!' : 'ياقتۇرغانلاردىن ئۆچۈرۈلدى!';
          if (typeof showToast === 'function') showToast(msg, 'success');
        });
      }

      // Shelf Quick Buy button click
      const quickBtn = card.querySelector('.shelf-card-quick-buy-btn');
      if (quickBtn) {
        quickBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (typeof openQuickBuyModal === 'function') openQuickBuyModal(product.id, 1);
        });
      }

      // Add to Cart button click
      const addBtn = card.querySelector('.shelf-card-add-btn');
      if (addBtn) {
        addBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const res = window.appStore.addToCart(product.id, 1);
          if (res.success) {
            if (typeof playChime === 'function') playChime('success');
            if (typeof showToast === 'function') showToast(res.message, 'success');
            if (typeof updateCartUI === 'function') updateCartUI();
            if (typeof openCartDrawer === 'function') openCartDrawer();
          } else {
            if (typeof showToast === 'function') showToast(res.message, 'error');
          }
        });
      }

      track.appendChild(card);
    });

    // 🛍️ ئىككى تەرەپ لەيلىمە سىيرىلغۇچ كۇنۇپكىلار (Responsive Floating Carousel Arrows - LTR & RTL Aware)
    const btnLeft = document.createElement('button');
    btnLeft.type = 'button';
    btnLeft.className = 'shelf-nav-btn shelf-nav-left';
    btnLeft.setAttribute('aria-label', 'Previous');
    btnLeft.innerHTML = '<i class="fas fa-chevron-left"></i>';

    const btnRight = document.createElement('button');
    btnRight.type = 'button';
    btnRight.className = 'shelf-nav-btn shelf-nav-right';
    btnRight.setAttribute('aria-label', 'Next');
    btnRight.innerHTML = '<i class="fas fa-chevron-right"></i>';

    const getScrollStep = () => Math.max(track.clientWidth * 0.75, 260);

    // Left button ALWAYS scrolls track towards left
    btnLeft.addEventListener('click', (e) => {
      e.stopPropagation();
      track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });

    // Right button ALWAYS scrolls track towards right
    btnRight.addEventListener('click', (e) => {
      e.stopPropagation();
      track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });

    // ئەقىللىق تەڭشەش: چېتىگە يەتكەندە كۇنۇپكىنى يوشۇرۇپ مەھسۇلاتنى توسماسلىقنى كاپالەتلەندۈرۈش
    const updateNavState = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 8) {
        btnLeft.style.display = 'none';
        btnRight.style.display = 'none';
        return;
      }
      btnLeft.style.display = 'inline-flex';
      btnRight.style.display = 'inline-flex';

      const isRtl = document.documentElement.dir === 'rtl' || document.body.dir === 'rtl' || (currentLang === 'ug');
      const scrollL = track.scrollLeft;

      if (isRtl) {
        // RTL (Uyghur): Start is on the right
        const absScroll = Math.abs(scrollL);
        const atStart = absScroll <= 6;
        const atEnd = absScroll >= (maxScroll - 10);

        // At start on right: hide right button so first card is 100% unobstructed!
        if (atStart) {
          btnRight.classList.add('nav-hidden');
        } else {
          btnRight.classList.remove('nav-hidden');
        }

        // At end on left: hide left button
        if (atEnd) {
          btnLeft.classList.add('nav-hidden');
        } else {
          btnLeft.classList.remove('nav-hidden');
        }
      } else {
        // LTR (Turkish / English): Start is on the left
        const atStart = scrollL <= 6;
        const atEnd = scrollL >= (maxScroll - 10);

        // At start on left: hide left button so first card is 100% unobstructed!
        if (atStart) {
          btnLeft.classList.add('nav-hidden');
        } else {
          btnLeft.classList.remove('nav-hidden');
        }

        // At end on right: hide right button
        if (atEnd) {
          btnRight.classList.add('nav-hidden');
        } else {
          btnRight.classList.remove('nav-hidden');
        }
      }
    };

    track.addEventListener('scroll', updateNavState, { passive: true });
    requestAnimationFrame(() => {
      setTimeout(updateNavState, 80);
    });

    trackWrap.appendChild(btnLeft);
    trackWrap.appendChild(track);
    trackWrap.appendChild(btnRight);
    shelfEl.appendChild(trackWrap);

    return shelfEl;
  }

  // ==================== تاۋار كارتىلىرى كۇنۇپكا ۋە ھەرىكەتلىرىنى باغلاش ====================
  function attachProductCardEvents(grid, i18n, store) {
    if (!grid) return;

    // 🖼️ مەھسۇلات رەسىمىنى چەككەندە تەپسىلات كۆزنىكى ئېچىلىش
    grid.querySelectorAll('.product-card-thumb').forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        if (e.target.closest('.product-wish-btn')) return;
        const card = thumb.closest('.product-card');
        const id = card ? card.dataset.id : null;
        if (id) openQuickView(id);
      });
    });

    // 📝 مەھسۇلات نامىنى چەككەندىمۇ تەپسىلات كۆزنىكى ئېچىلىش
    grid.querySelectorAll('.product-title').forEach(title => {
      title.addEventListener('click', () => {
        const card = title.closest('.product-card');
        const id = card ? card.dataset.id : null;
        if (id) openQuickView(id);
      });
    });

    grid.querySelectorAll('.btn-quick-buy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pid = btn.dataset.id;
        if (pid && typeof openQuickBuyModal === 'function') {
          openQuickBuyModal(pid, 1);
        }
      });
    });

    grid.querySelectorAll('.product-share-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pid = btn.dataset.id;
        if (pid && typeof window.shareProduct === 'function') {
          window.shareProduct(pid, e);
        }
      });
    });

    grid.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = btn.dataset.id;
        const res = store.addToCart(pid, 1);
        if (res.success) {
          if (typeof playChime === 'function') playChime('success');
          showToast(res.message, 'success');
          updateCartUI();
          openCartDrawer();

          // 🛒 2-باسقۇچ: سېۋەتكە سالغاندا چۈشۈرۈم ۋە ئېتىبار ئەسكەرتىشى
          if (window.TeklimakanPush && typeof window.TeklimakanPush.triggerContextualPrompt === 'function') {
            setTimeout(() => window.TeklimakanPush.triggerContextualPrompt('cart'), 1500);
          }
        } else {
          showToast(res.message, 'error');
        }
      });
    });

    grid.querySelectorAll('.btn-quick-view').forEach(btn => {
      btn.addEventListener('click', () => openQuickView(btn.dataset.id));
    });

    grid.querySelectorAll('.product-wish-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = btn.dataset.id;
        const added = store.toggleWishlist(pid);
        btn.classList.toggle('active', added);
        const icon = btn.querySelector('i');
        icon.className = added ? 'fas fa-heart' : 'far fa-heart';
        updateWishlistUI();
        if (typeof playChime === 'function') playChime('click');
        const lang = window.appI18n ? window.appI18n.getLang() : 'ug';
        const msg = added 
          ? (lang === 'tr' ? 'Favorilere eklendi!' : (lang === 'en' ? 'Added to wishlist!' : 'ياقتۇرغانلارغا قوشۇلدى!'))
          : (lang === 'tr' ? 'Favorilerden çıkarıldı!' : (lang === 'en' ? 'Removed from wishlist!' : 'ياقتۇرغانلاردىن ئۆچۈرۈلدى!'));
        showToast(msg, 'info');

        // 🛒 2-باسقۇچ: ياقتۇرغاندا مەھسۇلات باھا چۈشۈش ئەسكەرتىشى
        if (added && window.TeklimakanPush && typeof window.TeklimakanPush.triggerContextualPrompt === 'function') {
          setTimeout(() => window.TeklimakanPush.triggerContextualPrompt('wishlist'), 800);
        }
      });
    });
  }

  // ==================== تاۋارلار ۋە سىيرىلما راكلارنى ئارلاشتۇرۇپ كۆرسىتىش (Hybrid Interleaved Feed) ====================
  function renderProducts() {
    const i18n = window.appI18n;
    const store = window.appStore;
    const grid = document.getElementById('productsGrid');
    const countText = document.getElementById('resultsCountText');
    if (!grid) return;

    const products = getFilteredProducts();

    if (countText) {
      countText.textContent = `${products.length} ${i18n.t('resultsFound')}`;
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <i class="fas fa-box-open" style="font-size: 3.5rem; color: var(--text-light); margin-bottom: 1rem;"></i>
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">${i18n.t('noProductsFound')}</h3>
        </div>
      `;
      return;
    }

    grid.innerHTML = '';

    // تاشقى ئۈستۈنكى بۆلەك قايتىلانماسلىقى ئۈچۈن ئۇنى تازىلاش
    const topShelvesContainer = document.getElementById('showcaseShelvesContainer');
    if (topShelvesContainer) {
      topShelvesContainer.innerHTML = '';
      topShelvesContainer.style.display = 'none';
    }

    const currentLang = (i18n && typeof i18n.getLang === 'function') ? i18n.getLang() : 'ug';
    const isInterleavedAllowed = (
      currentCategory === 'all' && 
      currentBrand === 'all' && 
      (!searchQuery || searchQuery.trim() === '') &&
      !onlyInStock
    );

    let shelves = [];
    if (isInterleavedAllowed && store && typeof store.getShowcaseShelves === 'function') {
      try {
        shelves = store.getShowcaseShelves(currentLang) || [];
      } catch (e) {
        console.error('Error fetching showcase shelves:', e);
      }
    }

    const appendSafeCard = (p) => {
      try {
        const c = createSingleProductCard(p, i18n, store);
        if (c) grid.appendChild(c);
      } catch (err) {
        console.warn('Card creation error for product', p && p.id, err);
      }
    };

    if (!isInterleavedAllowed || shelves.length === 0) {
      // ئادەتتىكى سۈزۈلگەن ياكى ئىزدەلگەن رېشاتكا
      products.forEach(product => {
        appendSafeCard(product);
      });
    } else {
      // 🌟 سىيرىلما تاۋار راكلىرى بىلەن مەھسۇلاتلارنى ئارلاشتۇرۇپ تىزىش:
      let shelfIdx = 0;
      let prodIdx = 0;

      // 1-سىيرىلما راك (ئەڭ ئۈستىدە)
      if (shelfIdx < shelves.length) {
        try {
          const shelfEl = createShowcaseShelfElement(shelves[shelfIdx], currentLang);
          if (shelfEl) grid.appendChild(shelfEl);
        } catch (e) {}
        shelfIdx++;
      }

      // 1-قۇر تەكشى مەھسۇلاتلار (دەسلەپكى 4 مەھسۇلات)
      const firstBatch = Math.min(prodIdx + 4, products.length);
      for (; prodIdx < firstBatch; prodIdx++) {
        appendSafeCard(products[prodIdx]);
      }

      // 2-سىيرىلما راك
      if (shelfIdx < shelves.length) {
        try {
          const shelfEl = createShowcaseShelfElement(shelves[shelfIdx], currentLang);
          if (shelfEl) grid.appendChild(shelfEl);
        } catch (e) {}
        shelfIdx++;
      }

      // قالغان بارلىق مەھسۇلاتلار
      while (prodIdx < products.length) {
        const nextBatch = Math.min(prodIdx + 6, products.length);
        for (; prodIdx < nextBatch; prodIdx++) {
          appendSafeCard(products[prodIdx]);
        }

        if (shelfIdx < shelves.length) {
          try {
            const shelfEl = createShowcaseShelfElement(shelves[shelfIdx], currentLang);
            if (shelfEl) grid.appendChild(shelfEl);
          } catch (e) {}
          shelfIdx++;
        }
      }

      // قوشۇمچە تۈگەنمىگەن راكلار بولسا
      while (shelfIdx < shelves.length) {
        try {
          const shelfEl = createShowcaseShelfElement(shelves[shelfIdx], currentLang);
          if (shelfEl) grid.appendChild(shelfEl);
        } catch (e) {}
        shelfIdx++;
      }
    }

    attachProductCardEvents(grid, i18n, store);
  }

  // ==================== سېۋەت ۋە 1000 لىرا ھەقسىز يەتكۈزۈش ====================
  function updateCartUI() {
    const i18n = window.appI18n;
    const store = window.appStore;
    const lang = i18n.getLang();
    const cartData = store.getCartDetailed(lang);

    const cartCountBadge = document.getElementById('cartCounterBadge');
    const drawerBody = document.getElementById('cartDrawerItems');
    const subtotalEl = document.getElementById('cartSubtotalPrice');
    const deliveryEl = document.getElementById('cartDeliveryPrice');
    const discountEl = document.getElementById('cartDiscountPrice');
    const totalEl = document.getElementById('cartTotalPrice');
    const freeShippingBar = document.getElementById('cartShippingProgressFill');
    const freeShippingText = document.getElementById('cartFreeShippingText');

    document.querySelectorAll('.cart-counter-badge, #cartCounterBadge').forEach(badge => {
      badge.textContent = cartData.count;
      badge.style.display = cartData.count > 0 ? 'inline-flex' : 'none';
    });

    if (!drawerBody) return;

    if (cartData.items.length === 0) {
      drawerBody.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <i class="fas fa-shopping-cart" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
          <h4 style="font-weight: 700; margin-bottom: 0.5rem;">${i18n.t('emptyCartTitle')}</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${i18n.t('emptyCartDesc')}</p>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = store.formatPrice(0);
      if (deliveryEl) deliveryEl.textContent = store.formatPrice(0);
      if (discountEl) discountEl.textContent = `-0`;
      if (totalEl) totalEl.textContent = store.formatPrice(0);
      if (freeShippingBar) freeShippingBar.style.width = '0%';
      if (freeShippingText) {
        const info = store.getCurrencyInfo();
        const threshold = cartData.threshold || 1000;
        freeShippingText.innerHTML = i18n.t('freeShippingNotice', { amount: `${info.symbol}${threshold}` });
      }
      const emptyCharityRow = document.getElementById('cartCharityContributionRow');
      if (emptyCharityRow) emptyCharityRow.style.display = 'none';
      return;
    }

    drawerBody.innerHTML = '';
    cartData.items.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.product.image}" class="cart-item-img" alt="${item.product.name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'">
        <div class="cart-item-info">
          <div style="font-size: 0.78rem; color: var(--text-muted);"><i class="fas fa-award"></i> ${i18n.getBrandName(item.product.brand) || 'تەكلىماكان تورى'}</div>
          <h4 class="cart-item-title">${item.product.name}</h4>
          <div class="cart-item-price">${item.itemTotalFormatted}${item.product.unit ? `<span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal; margin-right:4px;"> (${item.quantity} <bdi>${item.product.unit}</bdi>)</span>` : ''}</div>
          <div class="cart-item-controls">
            <div class="qty-control-wrap">
              <button class="qty-btn btn-qty-minus" data-id="${item.product.id}">-</button>
              <input type="text" class="qty-input" value="${item.quantity}" readonly>
              <button class="qty-btn btn-qty-plus" data-id="${item.product.id}">+</button>
            </div>
            <button class="btn-remove-item" data-id="${item.product.id}" title="Remove">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      `;
      drawerBody.appendChild(itemEl);
    });

    const rawDisc = appliedCoupon && !isNaN(appliedCoupon.discount) ? Number(appliedCoupon.discount) : 0;
    const discountValCny = Math.min(Math.max(0, rawDisc), cartData.subtotalCny);
    const finalTotalCny = Math.max(0, cartData.totalCny - discountValCny);

    if (subtotalEl) subtotalEl.textContent = cartData.subtotalFormatted;
    if (deliveryEl) deliveryEl.textContent = cartData.deliveryFeeCny === 0 ? i18n.t('free') : cartData.deliveryFeeFormatted;
    if (discountEl) discountEl.textContent = discountValCny > 0 ? `-${store.formatPrice(discountValCny)}` : store.formatPrice(0);
    if (totalEl) totalEl.textContent = store.formatPrice(finalTotalCny);

    // 🤝 تەكلىماكان خەير-ساخاۋەت فوندى ئەسكەرتىشى (پەقەت ئۇيغۇرچىدا كۆرۈنىدۇ)
    const cartCharityRow = document.getElementById('cartCharityContributionRow');
    const cartCharityAmountEl = document.getElementById('cartCharityAmount');
    const cartCharityLink = document.getElementById('cartCharityLink');
    const charityCfg = (store && typeof store.getCharityFundConfig === 'function') ? store.getCharityFundConfig() : null;

    if (cartCharityRow) {
      if (lang === 'ug' && charityCfg && charityCfg.enabled !== false && cartData.items.length > 0 && finalTotalCny > 0) {
        const rate = (Number(charityCfg.percentage) || 5) / 100;
        const charityContribution = Math.round(finalTotalCny * rate * 100) / 100;
        if (cartCharityAmountEl) cartCharityAmountEl.textContent = store.formatPrice(charityContribution);
        if (cartCharityLink && charityCfg.url) cartCharityLink.href = charityCfg.url;
        cartCharityRow.style.display = 'block';
      } else {
        cartCharityRow.style.display = 'none';
      }
    }

    // 🚚 1000 لىرا ھەقسىز يەتكۈزۈش پىرسەنتى ۋە ئەقىللىق تاۋار تەكلىپى
    const threshold = cartData.threshold;
    const currentSub = cartData.convertedSubtotal;
    const percent = Math.min(100, Math.round((currentSub / threshold) * 100));
    if (freeShippingBar) freeShippingBar.style.width = `${percent}%`;

    const upsellWrap = document.getElementById('cartFreeShippingUpsell');
    if (freeShippingText) {
      if (percent >= 100) {
        freeShippingText.innerHTML = `<span style="color: #16a34a; font-weight: 800;">🎉 ${lang === 'tr' ? 'Tebrikler! Kargo Tamamen Ücretsiz!' : (lang === 'en' ? 'Congratulations! Shipping is Free!' : 'تەبرىكلەيمىز! زاكازىڭىز پۈتۈنلەي ھەقسىز يەتكۈزۈلىدۇ!')}</span>`;
        if (upsellWrap) upsellWrap.style.display = 'none';
      } else {
        const diff = threshold - currentSub;
        const diffFormatted = store.formatPrice(diff);
        freeShippingText.innerHTML = `🚚 ${lang === 'tr' ? `Sepetinize <b style="color: #ef4444;">${diffFormatted}</b> daha ekleyin, <b>Kargo Bedava</b> olsun!` : (lang === 'en' ? `Add <b style="color: #ef4444;">${diffFormatted}</b> more for <b>Free Shipping</b>!` : `يەنە <b style="color: #ef4444;">${diffFormatted}</b> لىك مال قوشسىڭىز، <b>ھەقسىز يەتكۈزۈلىدۇ!</b>`)}`;

        // ئەقىللىق تاۋارلارنى تاللاپ كۆرسىتىش
        if (upsellWrap) {
          const allProds = store.getProductsByLang(lang) || [];
          const cartIds = (cartData.items || []).map(i => i.product.id);
          const addOnMatches = allProds
            .filter(p => !cartIds.includes(p.id) && p.stock > 0 && Number(p.price) <= Math.max(diff * 1.5, 180))
            .slice(0, 3);

          if (addOnMatches.length > 0) {
            upsellWrap.style.display = 'block';
            upsellWrap.innerHTML = `
              <div class="cart-shipping-upsell-title">
                <i class="fas fa-sparkles" style="color: #f59e0b;"></i>
                <span>${lang === 'tr' ? 'Kargoyu bedava yapmak için önerilenler:' : (lang === 'en' ? 'Recommended items to reach free shipping:' : 'ھەقسىز يەتكۈزۈشكە يېتىش ئۈچۈن قوشۇۋېلىشقا ئەڭ قولايلىق:')}</span>
              </div>
              <div class="cart-upsell-row">
                ${addOnMatches.map(p => `
                  <div class="cart-upsell-item" title="${p.name}">
                    <img src="${p.image || 'images/default_product.jpg'}" alt="${p.name}">
                    <div class="cart-upsell-meta">
                      <span class="cart-upsell-name">${p.name}</span>
                      <span class="cart-upsell-price">${store.formatPrice(p.price)}</span>
                    </div>
                    <button type="button" class="cart-upsell-btn" data-id="${p.id}" title="سېۋەتكە قوشۇش">
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                `).join('')}
              </div>
            `;
            upsellWrap.querySelectorAll('.cart-upsell-btn').forEach(b => {
              b.addEventListener('click', () => {
                const addId = b.dataset.id;
                const r = store.addToCart(addId, 1);
                if (r && r.success) {
                  if (typeof playChime === 'function') playChime('click');
                  updateCartUI();
                }
              });
            });
          } else {
            upsellWrap.style.display = 'none';
          }
        }
      }
    }

    const info = store.getCurrencyInfo();
    if (freeShippingText) {
      if (currentSub >= threshold) {
        freeShippingText.innerHTML = `<i class="fas fa-check-circle" style="color: var(--success-color);"></i> ${i18n.t('freeShippingUnlocked')}`;
      } else {
        const remaining = `${info.symbol}${threshold - currentSub}`;
        freeShippingText.innerHTML = i18n.t('freeShippingNotice', { amount: remaining });
      }
    }

    drawerBody.querySelectorAll('.btn-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = btn.dataset.id;
        const currentItem = cartData.items.find(i => i.product.id === pid);
        if (currentItem) {
          const res = store.updateCartQuantity(pid, currentItem.quantity + 1);
          if (!res.success && res.message) showToast(res.message, 'warning');
          updateCartUI();
        }
      });
    });

    drawerBody.querySelectorAll('.btn-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = btn.dataset.id;
        const currentItem = cartData.items.find(i => i.product.id === pid);
        if (currentItem) {
          store.updateCartQuantity(pid, currentItem.quantity - 1);
          updateCartUI();
        }
      });
    });

    drawerBody.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        store.removeFromCart(btn.dataset.id);
        updateCartUI();
      });
    });
  }

  function openCartDrawer() {
    const overlay = document.getElementById('cartDrawerOverlay');
    if (overlay) overlay.classList.add('active');
    document.body.classList.add('cart-drawer-open');
  }

  function closeCartDrawer() {
    const overlay = document.getElementById('cartDrawerOverlay');
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('cart-drawer-open');
  }

  // ==================== ❤️ ياقتۇرغانلار تىزىملىكى (Wishlist UI) ====================
  function updateWishlistUI() {
    const store = window.appStore;
    const lang = window.appI18n ? window.appI18n.getLang() : 'ug';
    const items = store.getWishlistDetailed(lang);

    document.querySelectorAll('.wishlist-counter-badge, #wishlistCounterBadge').forEach(badge => {
      badge.textContent = items.length;
      badge.style.display = items.length > 0 ? 'inline-flex' : 'none';
    });

    const drawerBody = document.getElementById('wishlistDrawerItems');
    if (!drawerBody) return;

    if (items.length === 0) {
      drawerBody.innerHTML = `
        <div style="text-align: center; padding: 3rem 1.5rem; color: var(--text-muted);">
          <div style="width: 72px; height: 72px; border-radius: 50%; background: #ffe4e6; color: #f43f5e; display: inline-flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 1rem;">
            <i class="far fa-heart"></i>
          </div>
          <h4 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--text-main);">${lang === 'tr' ? 'Favori Ürününüz Yok' : (lang === 'en' ? 'No Favorites Yet' : 'ياقتۇرغان تاۋار تېخى يوق')}</h4>
          <p style="font-size: 0.88rem; line-height: 1.6; margin: 0; color: var(--text-muted);">${lang === 'tr' ? 'Ürünlerin üzerindeki kalp simgesine tıklayarak beğendiğiniz ürünleri buraya kaydedebilirsiniz.' : (lang === 'en' ? 'Click the heart icon on any product to save your favorites here.' : 'دۇكاندىكى مەھسۇلاتلارنىڭ ئۈستىدىكى قىزىل يۈرەك بەلگىسىنى چېكىپ، ياقتۇرغان تاۋارلىرىڭىزنى بۇ يەرگە ساقلىۋالالايسىز.')}</p>
        </div>
      `;
      return;
    }

    drawerBody.innerHTML = items.map(item => {
      const p = item.product || item;
      const formattedPrice = p.priceFormatted || store.formatPrice(p.price || 0);
      const formattedOldPrice = p.oldPrice ? store.formatPrice(p.oldPrice) : null;
      const stockStatus = (Number(p.stock) || 0) > 0
        ? `<span style="color: #10b981; font-weight: 700; font-size: 0.78rem;"><i class="fas fa-check-circle"></i> ${lang === 'tr' ? 'Stokta Var' : (lang === 'en' ? 'In Stock' : 'ئامباردا بار')}</span>`
        : `<span style="color: #ef4444; font-weight: 700; font-size: 0.78rem;"><i class="fas fa-times-circle"></i> ${lang === 'tr' ? 'Tükendi' : (lang === 'en' ? 'Out of Stock' : 'تۈگىگەن')}</span>`;
      const pName = p.displayName || p.name || 'تاۋار';

      return `
        <div class="cart-item" style="align-items: center; gap: 0.75rem; padding: 0.85rem 0.5rem; border-bottom: 1px solid var(--border-color);">
          <img src="${p.image || ''}" alt="${pName}" style="width: 65px; height: 65px; border-radius: 10px; object-fit: contain; background: #ffffff; padding: 3px; box-sizing: border-box; border: 1px solid var(--border-color); flex-shrink: 0;" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'">
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 700; font-size: 0.92rem; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${pName}">${pName}</div>
            <div style="display: flex; align-items: baseline; gap: 0.4rem; margin-bottom: 0.35rem;">
              <span style="font-weight: 800; color: var(--danger-color); font-size: 1rem;">${formattedPrice}${p.unit ? `<small style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted); margin-right: 4px;"> / <bdi>${p.unit}</bdi></small>` : ''}</span>
              ${formattedOldPrice ? `<span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.8rem;">${formattedOldPrice}</span>` : ''}
            </div>
            <div>${stockStatus}</div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.4rem; flex-shrink: 0;">
            <button type="button" class="btn-move-wish-cart" data-id="${p.id}" title="${lang === 'tr' ? 'Sepete Ekle' : (lang === 'en' ? 'Move to Cart' : 'سېۋەتكە يۆتكەش')}" style="background: #2563eb; color: #fff; border: none; border-radius: 8px; width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s;" ${(Number(p.stock) || 0) <= 0 ? 'disabled' : ''}>
              <i class="fas fa-cart-plus"></i>
            </button>
            <button type="button" class="btn-remove-wish" data-id="${p.id}" title="${lang === 'tr' ? 'Kaldır' : (lang === 'en' ? 'Remove' : 'ئۆچۈرۈش')}" style="background: #fee2e2; color: #ef4444; border: none; border-radius: 8px; width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s;">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    drawerBody.querySelectorAll('.btn-move-wish-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = btn.dataset.id;
        const res = store.moveWishlistToCart(pid, lang);
        if (res.success) {
          if (typeof playChime === 'function') playChime('success');
          showToast(res.message, 'success');
          updateWishlistUI();
          updateCartUI();
          openCartDrawer();
          closeWishlistDrawer();
        } else {
          showToast(res.message, 'warning');
        }
      });
    });

    drawerBody.querySelectorAll('.btn-remove-wish').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = btn.dataset.id;
        store.removeFromWishlist(pid);
        updateWishlistUI();
        renderProducts();
        showToast('ياقتۇرغانلاردىن ئۆچۈرۈلدى!', 'info');
      });
    });
  }

  function openWishlistDrawer() {
    const overlay = document.getElementById('wishlistDrawerOverlay');
    if (overlay) overlay.classList.add('active');
    updateWishlistUI();
  }

  function closeWishlistDrawer() {
    const overlay = document.getElementById('wishlistDrawerOverlay');
    if (overlay) overlay.classList.remove('active');
  }

  // ==================== 📬 سۇپا ئىچىدىكى خېرىدار زاكاز ۋە ئۇقتۇرۇش ساندۇقى (Customer Order Tracking Inbox UI) ====================

  function updateCustomerInboxBadges() {
    const phone = localStorage.getItem('teklimakan_customer_phone') || '';
    const lastOid = localStorage.getItem('teklimakan_last_order_id') || '';
    const query = phone || lastOid;
    const bHeader = document.getElementById('headerInboxBadge');
    const bNav = document.getElementById('navInboxBadge');

    if (!query || !window.appStore || typeof window.appStore.getCustomerInbox !== 'function') {
      if (bHeader) bHeader.style.display = 'none';
      if (bNav) bNav.style.display = 'none';
      return;
    }

    const unreadCount = window.appStore.getUnreadCustomerInboxCount(query);
    const countDisplay = unreadCount > 0 ? (unreadCount > 9 ? '9+' : unreadCount) : '';

    if (bHeader) {
      if (unreadCount > 0) {
        bHeader.textContent = countDisplay;
        bHeader.style.display = 'inline-flex';
      } else {
        bHeader.style.display = 'none';
      }
    }

    if (bNav) {
      if (unreadCount > 0) {
        bNav.textContent = countDisplay;
        bNav.style.display = 'inline-flex';
      } else {
        bNav.style.display = 'none';
      }
    }
  }

  function openTrackOrderModal(initialQuery = '') {
    const modal = document.getElementById('orderTrackModal');
    if (!modal) return;
    modal.classList.add('active');

    const savedPhone = initialQuery || 
                       localStorage.getItem('teklimakan_customer_phone') || 
                       localStorage.getItem('teklimakan_last_order_id') || '';
    const lang = (window.appI18n && window.appI18n.getLang()) || 'ug';
    const defGuestName = lang === 'tr' ? 'Değerli Müşterimiz' : (lang === 'en' ? 'Dear Customer' : 'ھۆرمەتلىك خېرىدار');
    const savedName = localStorage.getItem('teklimakan_customer_name') || defGuestName;

    const banner = document.getElementById('inboxCustomerProfileBanner');
    const nameEl = document.getElementById('inboxCustomerNameText');
    const phoneEl = document.getElementById('inboxCustomerPhoneText');
    const searchSection = document.getElementById('orderTrackSearchSection');
    const input = document.getElementById('orderTrackQueryInput');

    if (savedPhone) {
      if (banner) {
        banner.style.display = 'flex';
        if (nameEl) nameEl.textContent = savedName;
        if (phoneEl) phoneEl.textContent = savedPhone;
      }
      if (searchSection) searchSection.style.display = 'none';
      if (input) input.value = savedPhone;
      doTrackOrder(savedPhone, currentInboxTab || 'notifs');
    } else {
      if (banner) banner.style.display = 'none';
      if (searchSection) searchSection.style.display = 'block';
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 250);
      }
    }
  }

  function closeTrackOrderModal() {
    const modal = document.getElementById('orderTrackModal');
    if (modal) modal.classList.remove('active');
  }

  function switchInboxTab(tab) {
    currentInboxTab = tab;
    const tabNotifs = document.getElementById('tabBtnInboxNotifs');
    const tabOrders = document.getElementById('tabBtnInboxOrders');
    if (tabNotifs && tabOrders) {
      if (tab === 'notifs') {
        tabNotifs.classList.add('active');
        tabNotifs.style.color = '#0284c7';
        tabNotifs.style.borderBottom = '2.5px solid #0284c7';
        tabOrders.classList.remove('active');
        tabOrders.style.color = '#64748b';
        tabOrders.style.borderBottom = '2.5px solid transparent';
      } else {
        tabOrders.classList.add('active');
        tabOrders.style.color = '#0284c7';
        tabOrders.style.borderBottom = '2.5px solid #0284c7';
        tabNotifs.classList.remove('active');
        tabNotifs.style.color = '#64748b';
        tabNotifs.style.borderBottom = '2.5px solid transparent';
      }
    }
    renderCustomerInboxContent();
  }

  async function doTrackOrder(query, tab = 'notifs') {
    const resultsWrap = document.getElementById('orderTrackResultsWrap');
    if (!resultsWrap) return;
    const i18n = window.appI18n;
    const lang = (i18n && i18n.getLang()) || 'ug';

    if (!query || query.trim().length === 0) {
      const emptyMsg = i18n.t('orderTrackNoQuery') || (lang === 'tr' ? 'Lütfen sipariş numaranızı veya telefon numaranızı girin!' : (lang === 'en' ? 'Please enter your order number or phone number!' : 'زاكاز نومۇرىڭىزنى ياكى تېلېفون نومۇرىڭىزنى كىرگۈزۈڭ!'));
      resultsWrap.innerHTML = `
        <div style="text-align: center; color: #ef4444; padding: 1.5rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; margin-top: 1rem;">
          <i class="fas fa-exclamation-circle" style="font-size: 1.5rem; margin-bottom: 0.4rem;"></i>
          <div>${emptyMsg}</div>
        </div>
      `;
      return;
    }

    const cleanQ = query.trim();
    currentInboxQuery = cleanQ;
    if (tab) currentInboxTab = tab;

    const searchMsg = i18n.t('orderTrackSearching') || (lang === 'tr' ? 'Bulut arşivinden siparişleriniz sorgulanıyor...' : (lang === 'en' ? 'Querying orders from cloud archive...' : 'سۇپا ۋە بۇلۇت ئامبىرىدىن زاكاز ساندۇقى يېڭىلىنىۋاتىدۇ...'));
    const searchSub = i18n.t('orderTrackSearchingSub') || (lang === 'tr' ? 'Tüm geçmiş sipariş kayıtları yükleniyor' : (lang === 'en' ? 'Loading historical order records' : 'بارلىق دەل ۋاقتىدىكى ئۇقتۇرۇشلار يۈكلىنىۋاتىدۇ'));

    resultsWrap.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem; color: #0284c7;">
        <i class="fas fa-spinner fa-spin" style="font-size: 2.2rem; margin-bottom: 0.75rem;"></i>
        <div style="font-weight: 700; font-size: 0.95rem;">${searchMsg}</div>
        <div style="font-size: 0.8rem; color: #64748b; margin-top: 0.35rem;">${searchSub}</div>
      </div>
    `;

    // ☁️ بۇلۇتتىن ۋە ئامباردىن تولۇق زاكازلارنى يۈكلەپ تەڭلەشتۈرۈش
    let cloudOrders = [];
    if (window.appStore.fetchOrdersFromCloudAndMatch) {
      try {
        cloudOrders = await window.appStore.fetchOrdersFromCloudAndMatch(cleanQ);
      } catch(e) {}
    }

    const inboxData = window.appStore.getCustomerInbox(cleanQ);
    // Merge cloud orders if any
    if (cloudOrders && cloudOrders.length > 0) {
      cloudOrders.forEach(co => {
        if (!inboxData.orders.some(o => o.id === co.id)) {
          inboxData.orders.push(co);
        }
      });
    }

    cachedInboxData = inboxData;

    // نومۇرنى يەرلىككە ئەستە تۇتۇش
    if (/^\+?\d{8,15}$/.test(cleanQ.replace(/[\s\-]/g, ''))) {
      localStorage.setItem('teklimakan_customer_phone', cleanQ);
    }

    // ئوقۇلدى بەلگىسىنى قويۇش
    window.appStore.markCustomerInboxAsRead(cleanQ);
    updateCustomerInboxBadges();

    // تاللىغۇچ كۆرسىتىش ۋە بەلگە سانىنى يېڭىلاش
    const tabsHeader = document.getElementById('inboxTabsHeader');
    const badgeNotifs = document.getElementById('tabBadgeInboxNotifs');
    const badgeOrders = document.getElementById('tabBadgeInboxOrders');

    if (tabsHeader) tabsHeader.style.display = 'flex';
    if (badgeNotifs) badgeNotifs.textContent = inboxData.notifications.length;
    if (badgeOrders) badgeOrders.textContent = inboxData.orders.length;

    renderCustomerInboxContent();
  }

  function renderCustomerInboxContent() {
    const resultsWrap = document.getElementById('orderTrackResultsWrap');
    if (!resultsWrap) return;
    const i18n = window.appI18n;
    const lang = (i18n && i18n.getLang()) || 'ug';
    const { orders, notifications } = cachedInboxData;
    const cleanQ = currentInboxQuery;

    if ((!orders || orders.length === 0) && (!notifications || notifications.length === 0)) {
      const notFoundTitle = i18n.t('orderTrackNotFound') || (lang === 'tr' ? 'Herhangi Bir Sipariş Bulunamadı' : (lang === 'en' ? 'No Orders Found' : 'ھېچقانداق پوسۇلكا ياكى ئۇقتۇرۇش تېپىلمىدى'));
      const notFoundDesc = lang === 'tr'
        ? `"${cleanQ}" için sistemde sipariş kaydı bulunamadı. Lütfen girdiğiniz numarayı kontrol edin veya WhatsApp üzerinden yöneticimiz ile iletişime geçin.`
        : (lang === 'en'
          ? `No order records found for "${cleanQ}". Please verify your input or contact our support team via WhatsApp.`
          : `«${cleanQ}» بويىچە دۇكان سىستېمىسىدىن پوسۇلكا، مېلىڭىز ياكى ئۇقتۇرۇش بايقالمىدى. نومۇرنىڭ توغرىلىقىنى قايتا تەكشۈرۈپ سىناپ بېقىڭ ياكى ئالىي باشقۇرغۇچى بىلەن WhatsApp ئارقىلىق ئالاقىلىشىڭ.`);
      const waBtnText = lang === 'tr' ? 'WhatsApp ile Danışın' : (lang === 'en' ? 'Inquire via WhatsApp' : 'WhatsApp ئارقىلىق سۈرۈشتۈرۈش');
      const waMsg = lang === 'tr'
        ? `Merhaba Teklimakan yetkilisi, ${cleanQ} numarasıyla sipariş sorgulamasında destek alabilir miyim?`
        : (lang === 'en'
          ? `Hello Teklimakan support, I need assistance querying order ${cleanQ}.`
          : `ئەسسالامۇئەلەيكۇم تەكلىماكان سۇپىسى، مەن ${cleanQ} نومۇر بويىچە پوسۇلكامنى سۈرۈشتۈرمەكچىتىم.`);

      resultsWrap.innerHTML = `
        <div style="text-align: center; color: #991b1b; padding: 2rem 1.25rem; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 14px; margin-top: 1rem;">
          <i class="fas fa-search" style="font-size: 2.5rem; color: #f43f5e; margin-bottom: 0.75rem;"></i>
          <h4 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 0.4rem;">${notFoundTitle}</h4>
          <p style="font-size: 0.88rem; color: #64748b; line-height: 1.6; margin: 0 0 1rem 0;">${notFoundDesc}</p>
          <a href="https://wa.me/905551609999?text=${encodeURIComponent(waMsg)}" target="_blank" class="btn-checkout" style="width: auto; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.25rem; font-size: 0.88rem; text-decoration: none; border-radius: 10px; background: #25D366; color: #ffffff;">
            <i class="fab fa-whatsapp"></i> ${waBtnText}
          </a>
        </div>
      `;
      return;
    }

    // ========== 1. ساندۇق ئۇقتۇرۇشلىرى (NOTIFICATIONS TAB) ==========
    if (currentInboxTab === 'notifs') {
      if (!notifications || notifications.length === 0) {
        resultsWrap.innerHTML = `
          <div style="text-align: center; padding: 2.5rem 1rem; color: #94a3b8;">
            <i class="fas fa-bell-slash" style="font-size: 2.8rem; margin-bottom: 0.75rem; color: #cbd5e1;"></i>
            <h4 style="font-size: 1rem; font-weight: 800; color: #475569; margin-bottom: 0.4rem;">${lang === 'tr' ? 'Henüz Yeni Bildirim Yok' : (lang === 'en' ? 'No New Notifications' : 'ھازىرچە يېڭى ئۇقتۇرۇش يوق')}</h4>
            <p style="margin: 0; font-size: 0.88rem; line-height: 1.6;">${lang === 'tr' ? 'Siparişiniz kargoya verildiğinde veya sistem mesajı geldiğinde burada anında görünecektir.' : (lang === 'en' ? 'Updates will appear here when your order is shipped or customer care contacts you.' : 'پوسۇلكىڭىز كارگوغا چىققاندا ياكى سۇپا باشقۇرغۇچىسى ئۇچۇر يازغاندا مۇشۇ يەرگە دەل ۋاقتىدا چىقىدۇ.')}</p>
          </div>
        `;
        return;
      }

      let notifsHtml = `<div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 0.5rem;">`;

      notifications.forEach(n => {
        let iconBg = '#e0f2fe';
        let iconColor = '#0284c7';
        let iconClass = 'fa-bell';
        let badgeText = 'ئۇقتۇرۇش';
        let badgeBg = '#f0f9ff';
        let badgeColor = '#0369a1';

        if (n.type === 'cargo_shipped') {
          iconBg = '#dcfce7';
          iconColor = '#16a34a';
          iconClass = 'fa-truck-fast';
          badgeText = lang === 'tr' ? 'Kargoya Verildi' : (lang === 'en' ? 'Shipped' : 'كارگو يوللاندى');
          badgeBg = '#f0fdf4';
          badgeColor = '#15803d';
        } else if (n.type === 'order_created') {
          iconBg = '#eef2ff';
          iconColor = '#4f46e5';
          iconClass = 'fa-file-invoice';
          badgeText = lang === 'tr' ? 'Sipariş Alındı' : (lang === 'en' ? 'Order Received' : 'مېلىڭىز قوبۇل قىلىندى');
          badgeBg = '#eef2ff';
          badgeColor = '#4338ca';
        } else if (n.type === 'order_completed') {
          iconBg = '#ecfdf5';
          iconColor = '#059669';
          iconClass = 'fa-circle-check';
          badgeText = lang === 'tr' ? 'Teslim Edildi' : (lang === 'en' ? 'Delivered' : 'مېلىڭىز يەتكۈزۈلدى');
          badgeBg = '#ecfdf5';
          badgeColor = '#047857';
        } else if (n.type === 'admin_message') {
          iconBg = '#fef3c7';
          iconColor = '#d97706';
          iconClass = 'fa-comment-dots';
          badgeText = lang === 'tr' ? 'Sistem Bildirimi' : (lang === 'en' ? 'System Notice' : 'سۇپا خېتى');
          badgeBg = '#fffbeb';
          badgeColor = '#b45309';
        }

        notifsHtml += `
          <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 1.15rem; box-shadow: 0 3px 12px rgba(0,0,0,0.04); position: relative; transition: all 0.2s;">
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 0.6rem; margin-bottom: 0.65rem;">
              <div style="display: flex; align-items: center; gap: 0.65rem;">
                <div style="width: 38px; height: 38px; border-radius: 10px; background: ${iconBg}; color: ${iconColor}; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0;">
                  <i class="fas ${iconClass}"></i>
                </div>
                <div>
                  <div style="font-weight: 800; font-size: 0.95rem; color: #0f172a;">${n.title}</div>
                  <div style="font-size: 0.76rem; color: #94a3b8;" class="number-latin">${n.timestamp || ''}</div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.4rem;">
                ${n.orderId ? `
                  <span class="number-latin" style="font-size: 0.74rem; font-weight: 800; color: #0284c7; background: #e0f2fe; padding: 2px 7px; border-radius: 6px;">
                    #${n.orderId}
                  </span>
                ` : ''}
                <span style="font-size: 0.72rem; font-weight: 700; color: ${badgeColor}; background: ${badgeBg}; border: 1px solid ${iconColor}33; padding: 2px 8px; border-radius: 9999px;">
                  ${badgeText}
                </span>
              </div>
            </div>

            <div style="font-size: 0.88rem; color: #334155; line-height: 1.6; margin-bottom: 0.75rem; white-space: pre-line;">
              ${n.message}
            </div>

            ${(n.carrier || n.trackingNo) ? `
              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1.5px solid #7dd3fc; border-radius: 12px; padding: 0.75rem 0.95rem; margin-bottom: 0.75rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                  <div style="display: flex; align-items: center; gap: 0.45rem;">
                    <span style="background: #0284c7; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 0.74rem; font-weight: 800;">
                      <i class="fas fa-truck"></i> ${n.carrier || 'پوچتا'}
                    </span>
                    <span class="number-latin" style="font-size: 0.92rem; font-weight: 800; color: #0369a1; direction: ltr;">
                      ${n.trackingNo}
                    </span>
                    <button type="button" onclick="navigator.clipboard && navigator.clipboard.writeText('${n.trackingNo}').then(() => showToast('ئىز قوغلاش نومۇرى كۆچۈرۈلدى!', 'success'))" style="border: none; background: #e0f2fe; color: #0284c7; border-radius: 6px; padding: 2px 6px; font-size: 0.72rem; font-weight: 700; cursor: pointer;" title="كۆچۈرۈش">
                      <i class="far fa-copy"></i>
                    </button>
                  </div>
                  ${n.trackingUrl ? `
                    <a href="${n.trackingUrl}" target="_blank" style="background: #0284c7; color: #fff; padding: 0.35rem 0.85rem; border-radius: 8px; font-size: 0.78rem; font-weight: 800; text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;">
                      <i class="fas fa-external-link-alt"></i> ${lang === 'tr' ? 'Kargo Sitesinden Takip Et' : (lang === 'en' ? 'Track on Carrier Website' : 'پوچتىدىن تەكشۈرۈش')}
                    </a>
                  ` : ''}
                </div>
              </div>
            ` : ''}

            <div style="display: flex; justify-content: flex-end; align-items: center; gap: 0.5rem; border-top: 1px dashed #f1f5f9; padding-top: 0.55rem;">
              <a href="https://api.whatsapp.com/send?phone=905551609999&text=${encodeURIComponent(`ئەسسالامۇئەلەيكۇم تەكلىماكان سۇپىسى، مېنىڭ پوسۇلكا كود نومۇرۇم: #${n.orderId || cleanQ}. مېلىمنى سۈرۈشتۈرمەكچىتىم.`)}" target="_blank" style="color: #16a34a; font-weight: 700; font-size: 0.8rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;">
                <i class="fab fa-whatsapp"></i> ${lang === 'tr' ? 'WhatsApp ile Danışın' : (lang === 'en' ? 'Inquire via WhatsApp' : 'WhatsApp تىن سۈرۈشتۈرۈش')}
              </a>
            </div>
          </div>
        `;
      });

      notifsHtml += `</div>`;
      resultsWrap.innerHTML = notifsHtml;
      return;
    }

    // ========== 2. زاكاز ۋە كارگو تەپسىلاتى (ORDERS TAB) ==========
    const statusMap = {
      'ساقلاۋاتىدۇ': 1,
      'تەستىقلاندى': 2,
      'يوللاندى': 3,
      'تاماملاندى': 4,
      'بىكار قىلىندى': 0
    };

    const countText = lang === 'tr' ? `Toplam <b>${orders.length}</b> adet sipariş bulundu` : (lang === 'en' ? `Found <b>${orders.length}</b> orders` : `جەمئىي <b>${orders.length}</b> دانە پوسۇلكا / مال تېپىلدى`);
    const cloudBadge = lang === 'tr' ? 'Kalıcı Bulut Kaydı' : (lang === 'en' ? 'Permanent Cloud Record' : 'مەڭگۈ بۇلۇتتا ساقلانغان');

    let html = `
      <div style="margin-top: 0.5rem; margin-bottom: 0.85rem; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 0.85rem 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
        <div style="font-weight: 800; color: #166534; font-size: 0.95rem;">
          <i class="fas fa-check-circle" style="color: #22c55e;"></i> ${countText}
        </div>
        <span style="font-size: 0.78rem; color: #15803d; background: #dcfce7; padding: 3px 10px; border-radius: 9999px; font-weight: 700;">
          <i class="fas fa-cloud-check"></i> ${cloudBadge}
        </span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
    `;

    const lblOrderId = lang === 'tr' ? 'Sipariş No:' : (lang === 'en' ? 'Order ID:' : 'پوسۇلكا / زاكاز نومۇرى:');
    const lblOrderDate = lang === 'tr' ? 'Sipariş Tarihi:' : (lang === 'en' ? 'Order Date:' : 'سېتىۋالغان ۋاقتى:');
    const lblCopy = lang === 'tr' ? 'Kopyala' : (lang === 'en' ? 'Copy' : 'كۆچۈرۈش');
    const toastCopied = lang === 'tr' ? 'Sipariş kodu kopyalandı!' : (lang === 'en' ? 'Order code copied!' : 'پوسۇلكا كودى كۆچۈرۈلدى!');
    const anonNotice = lang === 'tr'
      ? '<strong>🛡️ Gizlilik Koruması:</strong> Sipariş tesliminden 10 gün sonra telefon ve adres bilgileri güvenle gizlenmiştir.'
      : (lang === 'en'
        ? '<strong>🛡️ Privacy Protected:</strong> Customer phone and address are anonymized 10 days after delivery.'
        : '<strong>🛡️ خېرىدار مەخپىيەتلىكى قوغدالدى:</strong> بۇ مال تاپشۇرۇلغاندىن كېيىن 10 كۈندىن ئاشقاچقا، بارلىق تېلېفون ۋە ئادرېس ئۇچۇرلىرى ئۆچۈرۈلگەن.');

    const stepsTitles = {
      ug: ['مېلىڭىز تاپشۇرۇۋېلىندى', 'تەستىقلاندى', 'پوسۇلكىڭىز يوللاندى', 'مېلىڭىز يەتكۈزۈلدى'],
      tr: ['Alındı', 'Onaylandı', 'Kargoya Verildi', 'Teslim Edildi'],
      en: ['Received', 'Confirmed', 'Shipped', 'Delivered']
    };
    const curSteps = stepsTitles[lang] || stepsTitles.ug;

    const lblCancelled = lang === 'tr' ? 'Bu sipariş iptal edilmiştir' : (lang === 'en' ? 'This order was cancelled' : 'بۇ پوسۇلكا بىكار قىلىنغان');
    const lblCarrier = lang === 'tr' ? 'Kargo Firması' : (lang === 'en' ? 'Carrier' : 'پوچتا شىركىتى');
    const lblTrackNo = lang === 'tr' ? 'Takip Kodu:' : (lang === 'en' ? 'Tracking Code:' : 'ئىز قوغلاش كودى:');
    const lblCarrierBtn = lang === 'tr' ? 'Kargo Sitesinden Takip Et' : (lang === 'en' ? 'Track on Carrier Website' : 'پوچتا تورىدىن كۆرۈش');
    const lblPendingCargo = lang === 'tr' ? 'Kargo firması ve takip kodu kısa sürede eklenecektir.' : (lang === 'en' ? 'Carrier and tracking code will be updated shortly.' : 'پوچتا شىركىتى ۋە ئىز قوغلاش نومۇرى تېز ئارىدا تولۇقلىنىدۇ.');

    const lblCust = lang === 'tr' ? 'Müşteri:' : (lang === 'en' ? 'Customer:' : 'خېرىدار:');
    const lblPhone = lang === 'tr' ? 'Telefon:' : (lang === 'en' ? 'Phone:' : 'تېلېفون:');
    const lblAddr = lang === 'tr' ? 'Şehir / Adres:' : (lang === 'en' ? 'City / Address:' : 'شەھەر / ئادرېس:');
    const lblPayMethod = lang === 'tr' ? 'Ödeme Yöntemi:' : (lang === 'en' ? 'Payment Method:' : 'چىقىم ئۇسۇلى:');
    const lblTotal = lang === 'tr' ? 'Toplam Tutar:' : (lang === 'en' ? 'Total Amount:' : 'ئومۇمىي سومما:');
    const lblItems = lang === 'tr' ? 'Satın Alınan Ürünler:' : (lang === 'en' ? 'Purchased Items:' : 'سېتىۋالغان مېلىڭىز:');
    const lblWaInq = lang === 'tr' ? 'Bu sipariş hakkında WhatsApp üzerinden danışın' : (lang === 'en' ? 'Inquire about this order via WhatsApp' : 'مېلىڭىز ۋە پوسۇلكا ھەققىدە WhatsApp تىن سۈرۈشتۈرۈش');

    orders.forEach((order) => {
      const currentStep = statusMap[order.status] !== undefined ? statusMap[order.status] : 1;
      const isCancelled = order.status === 'بىكار قىلىندى';
      const isOrderAnon = !!(order.isAnonymized || (order.customer && order.customer.isAnonymized));
      const phoneMasked = isOrderAnon
        ? (lang === 'tr' ? '🔒 [Gizlendi]' : (lang === 'en' ? '🔒 [Hidden]' : '🔒 [مەخپىيلەشتۈرۈلگەن]'))
        : (order.customer && order.customer.phone
          ? order.customer.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
          : '-');
      const carrier = order.cargoCarrier || order.trackingCarrier;
      const trackingNo = order.cargoTrackingNo || order.trackingNumber;
      const trackingUrl = (carrier && trackingNo)
        ? window.appStore.getCargoTrackingUrl(carrier, trackingNo)
        : null;

      html += `
        <div class="order-track-card" style="background: var(--bg-card, #ffffff); border: 1.5px solid var(--border-color, #e2e8f0); border-radius: 16px; padding: 1.25rem; box-shadow: 0 4px 18px rgba(0,0,0,0.06); position: relative;">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; padding-bottom: 0.85rem; border-bottom: 1px solid #f1f5f9;">
            <div>
              <div style="font-size: 0.78rem; color: #64748b;">${lblOrderId}</div>
              <div class="number-latin" style="font-size: 1.15rem; font-weight: 900; color: #0284c7; direction: ltr;">
                #${order.id}
                <button type="button" onclick="navigator.clipboard && navigator.clipboard.writeText('${order.id}').then(() => showToast('${toastCopied}', 'success'))" style="border: none; background: #e0f2fe; color: #0369a1; border-radius: 6px; padding: 2px 7px; font-size: 0.72rem; font-weight: 700; cursor: pointer; margin-inline-start: 4px;" title="${lblCopy}">
                  <i class="far fa-copy"></i>
                </button>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.78rem; color: #64748b;">${lblOrderDate}</div>
              <div class="number-latin" style="font-size: 0.86rem; font-weight: 700; color: #334155; direction: ltr;">${order.date}</div>
            </div>
          </div>

          ${isOrderAnon ? `
            <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 0.75rem 1rem; margin-top: 0.85rem; display: flex; align-items: center; gap: 0.65rem;">
              <i class="fas fa-user-shield" style="font-size: 1.3rem; color: #16a34a; flex-shrink: 0;"></i>
              <div style="font-size: 0.82rem; color: #15803d; line-height: 1.45;">
                ${anonNotice}
              </div>
            </div>
          ` : ''}

          <!-- 5-Step Connected Progress Tracker -->
          <div style="margin: 1.25rem 0;">
            <div class="track-timeline-wrap">
              <div class="track-timeline-bar-bg">
                <div class="track-timeline-bar-fill" style="width: ${isCancelled ? '0%' : (currentStep <= 1 ? '10%' : (currentStep === 2 ? '35%' : (currentStep === 3 ? '65%' : (currentStep >= 4 ? '100%' : '10%'))))};"></div>
              </div>
              <div class="track-timeline" style="display: flex; justify-content: space-between; position: relative; z-index: 1;">
                ${[
                  { step: 1, title: lang === 'tr' ? 'Alındı' : (lang === 'en' ? 'Received' : 'زاكاز ئېلىندى'), icon: 'fa-file-invoice' },
                  { step: 2, title: lang === 'tr' ? 'Onaylandı' : (lang === 'en' ? 'Confirmed' : 'تەستىقلاندى'), icon: 'fa-check' },
                  { step: 3, title: lang === 'tr' ? 'Paketlendi' : (lang === 'en' ? 'Packed' : 'كورو قاچىلاندى'), icon: 'fa-box' },
                  { step: 4, title: lang === 'tr' ? 'Kargoda' : (lang === 'en' ? 'Shipped' : 'يولدا'), icon: 'fa-truck-fast' },
                  { step: 5, title: lang === 'tr' ? 'Teslim' : (lang === 'en' ? 'Delivered' : 'يەتكۈزۈلدى'), icon: 'fa-house-circle-check' }
                ].map(s => {
                  const isActive = !isCancelled && currentStep >= (s.step === 5 ? 4 : s.step);
                  const isCurrent = !isCancelled && (currentStep === s.step || (currentStep >= 4 && s.step === 5));
                  return `
                    <div class="track-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}" style="flex: 1; text-align: center;">
                      <div class="track-step-circle" style="width: 34px; height: 34px; border-radius: 50%; margin: 0 auto 0.35rem; display: flex; align-items: center; justify-content: center; font-size: 0.88rem; transition: all 0.3s; background: ${isActive ? '#0284c7' : '#ffffff'}; color: ${isActive ? '#ffffff' : '#94a3b8'}; border: 2px solid ${isActive ? '#0284c7' : '#cbd5e1'};">
                        <i class="fas ${s.icon}"></i>
                      </div>
                      <div style="font-size: 0.72rem; font-weight: ${isActive ? '800' : '600'}; color: ${isActive ? '#0f172a' : '#94a3b8'}; line-height: 1.2;">
                        ${s.title}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
            ${isCancelled ? `
              <div style="margin-top: 0.85rem; padding: 0.5rem; background: #fee2e2; border-radius: 8px; text-align: center; color: #ef4444; font-weight: 700; font-size: 0.85rem;">
                <i class="fas fa-ban"></i> ${lblCancelled}
              </div>
            ` : ''}
          </div>

          <!-- Cargo Tracking Info Card -->
          ${carrier && trackingNo ? `
            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1.5px solid #7dd3fc; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                <div>
                  <span style="background: #0284c7; color: #ffffff; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 800;"><i class="fas fa-shipping-fast"></i> ${lblCarrier}</span>
                  <span style="font-weight: 800; font-size: 0.95rem; margin-right: 0.4rem; color: #0369a1;">${carrier}</span>
                </div>
                <div style="font-size: 0.82rem; color: #0284c7; font-weight: 700;">
                  ${lblTrackNo} <strong class="number-latin" style="direction: ltr; font-size: 0.95rem; letter-spacing: 0.5px;">${trackingNo}</strong>
                </div>
              </div>
              ${trackingUrl ? `
                <div style="margin-top: 0.65rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
                  <a href="${trackingUrl}" target="_blank" class="btn-checkout" style="width: auto; padding: 0.4rem 0.9rem; font-size: 0.8rem; font-weight: 800; text-decoration: none; border-radius: 8px; background: #0284c7; display: inline-flex; align-items: center; gap: 0.4rem; color: #ffffff;">
                    <i class="fas fa-external-link-alt"></i> ${lblCarrierBtn}
                  </a>
                </div>
              ` : ''}
            </div>
          ` : (currentStep >= 3 ? `
            <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 10px; padding: 0.75rem; margin-bottom: 1rem; font-size: 0.85rem; color: #64748b; text-align: center;">
              <i class="fas fa-info-circle"></i> ${lblPendingCargo}
            </div>
          ` : '')}

          <!-- Customer & Order details -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.6rem; font-size: 0.84rem; background: #f8fafc; padding: 0.85rem; border-radius: 10px; margin-bottom: 1rem;">
            <div><b>${lblCust}</b> ${isOrderAnon ? '<span style="color:#059669; font-weight:700;">🛡️ [Gizlendi]</span>' : (order.customer?.name || '-')}</div>
            <div><b>${lblPhone}</b> <span class="number-latin" style="direction: ltr;">${phoneMasked}</span></div>
            <div><b>${lblAddr}</b> ${isOrderAnon ? '<span style="color:#64748b;">🔒 [Gizlendi]</span>' : ((order.customer?.city || '') + ' ' + (order.customer?.address || ''))}</div>
            <div><b>${lblPayMethod}</b> ${(() => {
              let pm = order.paymentMethod || 'Havale / EFT';
              if (lang === 'tr') {
                if (pm.includes('بانكا') || pm.includes('Havale')) return 'Banka Havalesi / EFT';
                if (pm.includes('كارتا') || pm.includes('Card')) return 'Banka / Kredi Kartı';
                if (pm.includes('ۋاتساپ') || pm.includes('WhatsApp')) return 'WhatsApp ile Ödeme';
              } else if (lang === 'en') {
                if (pm.includes('بانكا') || pm.includes('Havale')) return 'Bank Transfer / EFT';
                if (pm.includes('كارتا') || pm.includes('Card')) return 'Credit / Debit Card';
                if (pm.includes('ۋاتساپ') || pm.includes('WhatsApp')) return 'Payment via WhatsApp';
              }
              return pm;
            })()}</div>
            <div style="grid-column: 1 / -1; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 0.5rem; font-weight: 800; font-size: 1rem; color: var(--danger-color);">
              <span>${lblTotal}</span>
              <span>${order.totalFormatted || window.appStore.formatPrice(order.totalCny || order.total)}</span>
            </div>
          </div>

          <!-- Purchased items -->
          <div style="margin-bottom: 1rem;">
            <div style="font-weight: 800; font-size: 0.86rem; margin-bottom: 0.45rem; color: #475569;">${lblItems}</div>
            <div style="display: flex; flex-direction: column; gap: 0.4rem;">
              ${(order.items || []).map(it => `
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.84rem; padding: 0.4rem 0.6rem; background: #ffffff; border: 1px solid #f1f5f9; border-radius: 8px;">
                  <span style="font-weight: 700; display: inline-flex; align-items: center; gap: 0.4rem;">
                    ${it.image ? `<img src="${it.image}" style="width: 28px; height: 28px; object-fit: cover; border-radius: 4px;">` : ''}
                    <span>${it.name} <span style="color: #64748b; font-weight: 600;">(x${it.quantity})</span></span>
                  </span>
                  <span style="font-weight: 800; color: #0f172a;">${it.priceFormatted || (it.price + ' TL')}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- WhatsApp Support Link -->
          <div style="text-align: center; border-top: 1px dashed #e2e8f0; padding-top: 0.75rem;">
            <a href="https://api.whatsapp.com/send?phone=905551609999&text=${encodeURIComponent(`ئەسسالامۇئەلەيكۇم تەكلىماكان سۇپىسى، مېنىڭ پوسۇلكا نومۇرۇم: #${order.id}. سېتىۋالغان مېلىمنى سۈرۈشتۈرمەكچىتىم.`)}" target="_blank" style="display: inline-flex; align-items: center; gap: 0.45rem; color: #16a34a; font-weight: 800; font-size: 0.86rem; text-decoration: none;">
              <i class="fab fa-whatsapp" style="font-size: 1.15rem;"></i> ${lblWaInq}
            </a>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    resultsWrap.innerHTML = html;
  }

  // ==================== 🔗 تور ئادرېسى ۋە كۆزنەك باشقۇرۇش ====================
  function clearUrlProductId() {
    try {
      if (window.location.search.includes('id=') || window.location.search.includes('product=') || window.location.search.includes('p=')) {
        const url = new URL(window.location.href);
        url.searchParams.delete('id');
        url.searchParams.delete('product');
        url.searchParams.delete('prd');
        url.searchParams.delete('p');
        const cleanSearch = url.searchParams.toString() ? '?' + url.searchParams.toString() : '';
        window.history.replaceState(null, '', window.location.pathname + cleanSearch);
      }
    } catch (e) {}
  }

  // ==================== 🔗 تور ئادرېسىدىكى مەھسۇلاتنى ئاپتوماتىك ئېچىش (Deep Linking) ====================
  function checkUrlForProduct() {
    try {
      const url = new URL(window.location.href);
      let prodId = url.searchParams.get('id') || 
                   url.searchParams.get('product') || 
                   url.searchParams.get('prd') || 
                   url.searchParams.get('p') ||
                   url.searchParams.get('slug');

      // Check pathname if visiting /p/xxx directly
      if (!prodId && window.location.pathname.startsWith('/p/')) {
        const slugPart = window.location.pathname.replace(/^\/p\//, '').trim();
        if (slugPart) {
          prodId = slugPart;
        }
      }

      if (!prodId && window.location.hash) {
        const hash = window.location.hash.replace(/^#/, '').trim();
        if (hash.toLowerCase().startsWith('prd-') || hash.toLowerCase().startsWith('id=')) {
          prodId = hash.replace(/^id=/i, '');
        }
      }

      if (!prodId) return;

      prodId = decodeURIComponent(prodId).trim();

      const findProduct = () => window.appStore?.getProductBySlug(prodId) ||
        window.appStore?.getProductById(prodId) ||
        window.appStore?.getProductById('PRD-' + prodId);
      let opened = false;
      const openFoundProduct = () => {
        const found = findProduct();
        if (!found || opened) return false;
        opened = true;
        window.removeEventListener('uyghur_store_sync', handleStoreSync);
        setTimeout(() => openQuickView(found.id), 0);
        return true;
      };
      const handleStoreSync = event => {
        if (event.detail?.type === 'products' || event.detail?.type === 'all') {
          openFoundProduct();
        }
      };

      if (!openFoundProduct()) {
        window.addEventListener('uyghur_store_sync', handleStoreSync);
        openFoundProduct();
      }
    } catch (e) {
      console.warn('checkUrlForProduct error:', e);
    }
  }

  // ==================== تېز كۆرۈش ====================
  function openQuickView(productId) {
    try { trackRecentlyViewed(productId); } catch(e) {}
    if (!productId) return;
    const cleanId = String(productId).replace(/^#/, '').trim();
    const lang = window.appI18n ? window.appI18n.getLang() : 'ug';
    const product = window.appStore.getProductById(cleanId, lang) ||
                    window.appStore.getProductById('PRD-' + cleanId, lang);
    if (!product) return;
    updateProductJsonLd(product);
    // 🎯 Meta (Facebook & Instagram) Pixel: ViewContent
    try {
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'ViewContent', {
          content_name: product.name,
          content_ids: [product.id],
          content_type: 'product',
          value: Number(product.price || 0),
          currency: (window.appStore && window.appStore.currentCurrency) || 'TRY'
        });
      }
    } catch (e) {}


    const modal = document.getElementById('quickViewModal');
    const modalBody = document.getElementById('quickViewModalBody');
    if (!modal || !modalBody) return;
    modal.dataset.productId = product.id;

    const formattedPrice = window.appStore.formatPrice(product.price);
    const formattedOldPrice = product.oldPrice ? window.appStore.formatPrice(product.oldPrice) : null;

    let charityBadgeHtml = '';
    const charityCfg = (window.appStore && typeof window.appStore.getCharityFundConfig === 'function')
      ? window.appStore.getCharityFundConfig()
      : null;
    if (lang === 'ug' && charityCfg && charityCfg.enabled !== false) {
      const fundPct = Number(charityCfg.percentage) || 5;
      const donationAmt = Math.round(Number(product.price || 0) * fundPct) / 100;
      const formattedDonation = window.appStore.formatPrice(donationAmt);
      charityBadgeHtml = `
        <a href="${charityCfg.url || 'https://www.seidiye.com/category/mihri/'}" target="_blank" rel="noopener noreferrer" class="quick-view-charity-badge" title="بۇ مەھسۇلاتتىن ئىئانە ئاتىلىدۇ">
          <span style="display: flex; align-items: center; gap: 6px;">
            <i class="fas fa-hand-holding-heart" style="color: #10b981; font-size: 1rem;"></i>
            <span>بۇ مالنىڭ %${fundPct} قىممىتى (<strong>${formattedDonation}</strong>) <strong>«${charityCfg.name || 'تەكلىماكان فوندى'}»</strong>غا ئاجرىتىلىدۇ</span>
          </span>
          <i class="fas fa-arrow-left charity-arrow-hint"></i>
        </a>
      `;
    }

    // 📦 ئامبار زاپىسىنىڭ كۆرۈنۈشىنى ئەقلىي ۋە راۋان بىر تەرەپ قىلىش (مەسىلەن: 500 دانە (100 گرام))
    const unitWord = (window.appI18n && typeof window.appI18n.t === 'function') ? window.appI18n.t('itemsUnit') : 'دانە';
    const rawUnit = product.unit || '';
    const localizedUnit = (window.appI18n && typeof window.appI18n.getUnitName === 'function') ? window.appI18n.getUnitName(rawUnit) : rawUnit;
    const stockUnitLabel = localizedUnit
      ? (/\d/.test(localizedUnit) ? `${unitWord} (${localizedUnit})` : localizedUnit)
      : unitWord;

    let stockStatusHtml = '';
    if (product.stock <= 0) {
      stockStatusHtml = `
        <div style="margin-bottom: 0.85rem; font-weight: 700; font-size: 0.9rem; color: var(--danger-color); display: flex; align-items: center; gap: 0.4rem;">
          <i class="fas fa-times-circle"></i>
          <span>${window.appI18n.t('outOfStock')}</span>
        </div>
      `;
    } else {
      const stockPrefix = (window.appI18n && typeof window.appI18n.t === 'function') ? window.appI18n.t('inStock') : 'ئامباردا بار:';
      stockStatusHtml = `
        <div style="margin-bottom: 0.85rem; font-weight: 700; font-size: 0.9rem; color: var(--success-color); display: flex; align-items: center; gap: 0.4rem;">
          <i class="fas fa-check-circle"></i>
          <span>${stockPrefix}</span>
          <span class="number-latin">${product.stock}</span>
          <bdi>${stockUnitLabel}</bdi>
        </div>
      `;
    }

    modalBody.innerHTML = `
      <div class="quick-view-grid">
        <div class="quick-view-media" style="position: relative;">
          <img src="${product.image || 'images/default_product.jpg'}" alt="${product.name}" class="protected-img" onerror="this.onerror=null; this.src='images/default_product.jpg'">
          <div class="image-shield-overlay"></div>
          <div class="image-protection-watermark"><i class="fas fa-shield-alt"></i> Teklimakan.com</div>
        </div>
        <div class="quick-view-details">
          <div style="display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.55rem; flex-wrap: wrap;">
            <span style="font-size: 0.78rem; color: var(--primary-color); font-weight: 700; background: var(--primary-light); padding: 2px 9px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;"><i class="fas fa-th-large" style="font-size: 0.72rem;"></i> ${window.appI18n.getCategoryName(product.category)}</span>
            <!-- 🏷️ ماركا ئۇچۇرى تەپسىلات كۆزنىكىدە كۆرۈنىدۇ -->
            <span style="background: rgba(37, 99, 235, 0.08); color: var(--primary-color); padding: 2px 9px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; border: 1px solid rgba(37, 99, 235, 0.22); display: inline-flex; align-items: center; gap: 4px;"><i class="fas fa-award" style="font-size: 0.72rem;"></i> ${window.appI18n.t('brandLabel') || 'ماركا:'} ${window.appI18n.getBrandName(product.brand) || 'تەكلىماكان تورى'}</span>
            ${getMerchantBadgeHtml(product)}
            ${getAgentBadgeHtml(product, false)}
          </div>

          <h3 style="font-size: 1.25rem; font-weight: 800; line-height: 1.4; margin-bottom: 0.75rem;">${product.name}</h3>
          
          <div style="display: flex; align-items: baseline; gap: 0.75rem; margin-bottom: 0.85rem; flex-wrap: wrap;">
            <span style="font-size: 1.65rem; font-weight: 900; color: var(--danger-color);">${formattedPrice}${product.unit ? `<small style="font-size: 0.95rem; font-weight: normal; color: var(--text-muted); margin-right: 6px;"> / <bdi>${product.unit}</bdi></small>` : ''}</span>
            ${formattedOldPrice ? `<span style="font-size: 1rem; color: var(--text-light); text-decoration: line-through;">${formattedOldPrice}</span>` : ''}
          </div>

          ${charityBadgeHtml}

          <div style="background: var(--bg-main); padding: 0.85rem; border-radius: var(--radius-sm); margin-bottom: 0.85rem; font-size: 0.9rem; line-height: 1.7; border: 1px solid var(--border-color);">
            ${product.description || ''}
          </div>

          ${stockStatusHtml}

          <div class="quick-view-actions">
            <div class="qty-control-wrap" style="height: 44px; min-width: 105px; display: flex; align-items: center;">
              <button class="qty-btn" id="modalQtyMinus" style="height: 100%; width: 34px; font-size: 1.1rem;">-</button>
              <input type="text" id="modalQtyInput" class="qty-input" value="1" readonly style="height: 100%; text-align: center; font-weight: 700; font-size: 1rem;">
              <button class="qty-btn" id="modalQtyPlus" style="height: 100%; width: 34px; font-size: 1.1rem;">+</button>
            </div>
            <!-- ⚡ تېز سېتىۋېلىش كۇنۇپكىسى (Quick Buy) -->
            <button type="button" id="modalQuickBuyBtn" class="btn-quick-buy-modal" style="width: 100%; min-height: 44px; margin-bottom: 0.6rem; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: #ffffff; border: none; border-radius: 10px; font-weight: 800; font-size: 0.98rem; display: inline-flex; align-items: center; justify-content: center; gap: 0.55rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);" ${product.stock <= 0 ? 'disabled' : ''}>
              <i class="fas fa-bolt" style="color: #fef08a;"></i>
              <span>${(window.appI18n && window.appI18n.t('quickBuy')) || '⚡ تېز سېتىۋېلىش'}</span>
            </button>
            <button id="modalAddToCartBtn" class="btn-add-cart" style="flex: 1; min-height: 44px; height: 44px; min-width: 0; padding: 0 1rem; font-size: 0.95rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; text-align: center; gap: 0.55rem; line-height: 1;" ${product.stock <= 0 ? 'disabled' : ''}>
              <i class="fas fa-cart-plus" style="font-size: 1.1rem;"></i>
              <span style="display: inline-block;">${window.appI18n.t('addToCart')}</span>
            </button>
          </div>

          <!-- 💬 1-چېكىش بىلەن دەرھال WhatsApp تا ئېلىش كۇنۇپكىسى -->
          <button type="button" id="modalInstantBuyWaBtn" class="btn-whatsapp-instant" style="width: 100%; min-height: 44px; margin-top: 0.75rem; background: #25D366; color: #ffffff; border: none; border-radius: 10px; font-weight: 800; font-size: 0.95rem; display: inline-flex; align-items: center; justify-content: center; gap: 0.55rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.28);">
            <i class="fab fa-whatsapp" style="font-size: 1.3rem;"></i>
            <span>${window.appI18n.t('instantBuyWhatsApp') || '💬 دەرھال WhatsApp تا ئېلىش'}</span>
          </button>

          <!-- 🔗 مەھسۇلات ئۇلانمىسىنى ھەمبەھىرلەش كۇنۇپكىسى -->
          <button type="button" id="modalShareProductBtn" class="btn-share-product">
            <i class="fas fa-share-alt"></i>
            <span>${window.appI18n.t('shareProductLink') || '🔗 مەھسۇلات ئۇلانمىسىنى ھەمبەھىرلەش'}</span>
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');

    // كۆزنەك ئېچىلغاندا تور كۆرگۈچ ئادرېسىنى ?id=PRD-xxx قىلىپ يېڭىلاش
    try {
      const newUrl = `${window.location.origin}${window.location.pathname}?id=${encodeURIComponent(product.id)}`;
      window.history.replaceState(null, '', newUrl);
    } catch (e) {}

    let currentQty = 1;
    const qtyInput = document.getElementById('modalQtyInput');
    document.getElementById('modalQtyPlus').addEventListener('click', () => {
      if (currentQty < product.stock) {
        currentQty++;
        qtyInput.value = currentQty;
      }
    });
    document.getElementById('modalQtyMinus').addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        qtyInput.value = currentQty;
      }
    });

    const modalQbBtn = document.getElementById('modalQuickBuyBtn');
    if (modalQbBtn) {
      modalQbBtn.addEventListener('click', () => {
        if (product.stock <= 0) return;
        modal.classList.remove('active');
        if (typeof openQuickBuyModal === 'function') {
          openQuickBuyModal(product.id, currentQty);
        }
      });
    }

    document.getElementById('modalAddToCartBtn').addEventListener('click', () => {
      const res = window.appStore.addToCart(product.id, currentQty);
      if (res.success) {
        if (typeof playChime === 'function') playChime('success');
        showToast(res.message, 'success');
        modal.classList.remove('active');
        clearUrlProductId();
        updateCartUI();
        openCartDrawer();
      }
    });

    const instantWaBtn = document.getElementById('modalInstantBuyWaBtn');
    if (instantWaBtn) {
      instantWaBtn.addEventListener('click', () => {
        const phone = '905551609999';
        const formattedPrice = window.appStore.formatPrice(product.price * currentQty);
        const lang = window.appI18n ? window.appI18n.getLang() : 'ug';
        const baseUrl = (window.location.origin && window.location.origin.startsWith('http')) ? window.location.origin.replace(/^https?:\/\/www\./i, 'https://') : 'https://teklimakan.com';
        const prodSlug = product.slug || (product.translations && product.translations.slug) || ((window.appStore && typeof window.appStore.transliterateToSlug === 'function') ? window.appStore.transliterateToSlug(product.name) : '');
        const slugSegment = prodSlug ? `${prodSlug}-${product.id}` : product.id;
        const itemUrl = `${baseUrl}/p/${slugSegment}`;
        
        const greeting = window.appI18n.t('waOrderGreeting');
        const prodLabel = window.appI18n.t('waProductLabel');
        const priceLabel = window.appI18n.t('waPriceLabel');
        const catLabel = window.appI18n.t('waCategoryLabel');
        const linkLabel = window.appI18n.t('waLinkLabel');
        const closing = window.appI18n.t('waOrderClosing');
        const unitText = product.unit ? ` (${currentQty} ${product.unit})` : ` (${currentQty})`;
        const catName = window.appI18n.getCategoryName(product.category);

        const msg = encodeURIComponent(
          `${greeting}\n\n` +
          `${prodLabel} ${product.name}\n` +
          `${priceLabel} ${formattedPrice}${unitText}\n` +
          `${catLabel} ${catName}\n\n` +
          `${linkLabel}\n${itemUrl}\n\n` +
          `${closing}`
        );
        window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${msg}`, '_blank');
      });
    }

    const shareBtn = document.getElementById('modalShareProductBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        const lang = window.appI18n ? window.appI18n.getLang() : 'ug';
        const baseUrl = (window.location.origin && window.location.origin.startsWith('http')) ? window.location.origin.replace(/^https?:\/\/www\./i, 'https://') : 'https://teklimakan.com';
        const prodSlug = product.slug || (product.translations && product.translations.slug) || ((window.appStore && typeof window.appStore.transliterateToSlug === 'function') ? window.appStore.transliterateToSlug(product.name) : '');
        const slugSegment = prodSlug ? `${prodSlug}-${product.id}` : product.id;
        const shareUrl = `${baseUrl}/p/${slugSegment}`;
        const platformTitle = window.appI18n.t('shareModalTitle') || 'تەكلىماكان';
        const shareTitle = `${product.name} - ${platformTitle}`;
        const highlightText = window.appI18n.t('shareProductHighlight') || '🌟 تەكلىماكان سۇپىسىدىكى مەھسۇلات:';
        const priceLabel = window.appI18n.t('waPriceLabel') || '💰 باھاسى:';
        const viewLinkText = window.appI18n.t('shareViewLink') || '🔗 كۆرۈش ئۇلانمىسى:';
        const shareDesc = `${highlightText}\n📦 ${product.name}\n${priceLabel} ${formattedPrice}\n📝 ${product.description || ''}`;
        const fullShareMessage = `${shareDesc}\n\n${viewLinkText}\n${shareUrl}`;

        // 1. يانفون سىستېمىلىق ھەمبەھىرلەش:
        if (navigator.share) {
          try {
            await navigator.share({
              title: shareTitle,
              text: shareDesc,
              url: shareUrl
            });
            return;
          } catch (e) {
            if (e.name === 'AbortError') return;
          }
        }

        // 2. چاپلاش تاختىسىغا كۆچۈرۈش
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(fullShareMessage);
          } else {
            const ta = document.createElement('textarea');
            ta.value = fullShareMessage;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
          }
          if (typeof playChime === 'function') playChime('click');
          showToast(window.appI18n.t('shareCopiedSuccess') || '🔗 مەھسۇلات ئۇلانمىسى كۆچۈرۈلدى! خالىغان كىشىگە ھەمبەھىرلىيەلەيسىز.', 'success');
        } catch (err) {
          showToast((window.appI18n.t('shareLinkNotice') || '🔗 ') + shareUrl, 'info');
        }
      });
    }
  }

  // ==================== چىقىم ====================
  function openCheckoutModal() {
    // 🎯 Meta (Facebook & Instagram) Pixel: InitiateCheckout
    try {
      if (typeof window.fbq === 'function') {
        const totalVal = window.appStore ? window.appStore.getCartTotal() : 0;
        window.fbq('track', 'InitiateCheckout', {
          value: totalVal,
          currency: (window.appStore && window.appStore.currentCurrency) || 'TRY'
        });
      }
    } catch (e) {}

    const lang = window.appI18n.getLang();
    const cartData = window.appStore.getCartDetailed(lang);
    if (!cartData || !cartData.items || cartData.items.length === 0) return;

    const modal = document.getElementById('checkoutModal');
    const orderItemsSummary = document.getElementById('checkoutOrderItemsSummary');
    const checkoutTotalEl = document.getElementById('checkoutTotalDisplay');

    const rawDiscount = appliedCoupon && !isNaN(appliedCoupon.discount) ? Number(appliedCoupon.discount) : 0;
    const discountVal = Math.min(Math.max(0, rawDiscount), cartData.subtotalCny);
    const finalTotalCny = Math.max(0, cartData.totalCny - discountVal);

    if (orderItemsSummary) {
      orderItemsSummary.innerHTML = '';
      cartData.items.forEach(item => {
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.5rem;';
        row.innerHTML = `<span>${item.product.name} x ${item.quantity}</span><strong>${item.itemTotalFormatted}</strong>`;
        orderItemsSummary.appendChild(row);
      });

      // يەتكۈزۈش ھەققى
      const delRow = document.createElement('div');
      delRow.style.cssText = 'display: flex; justify-content: space-between; font-size: 0.85rem; color: #64748b; margin-top: 0.4rem; padding-top: 0.4rem; border-top: 1px dotted var(--border-color);';
      const delLabel = lang === 'tr' ? 'Tahmini Kargo Ücreti:' : (lang === 'en' ? 'Estimated Shipping Fee:' : 'تەخمىنىي يەتكۈزۈش ھەققى:');
      const delVal = cartData.deliveryFeeCny === 0 
        ? `<span style="color: #10b981; font-weight: 700;">${lang === 'tr' ? 'Ücretsiz' : (lang === 'en' ? 'Free' : 'ھەقسىز')}</span>`
        : `<strong>${cartData.deliveryFeeFormatted}</strong>`;
      delRow.innerHTML = `<span>${delLabel}</span>${delVal}`;
      orderItemsSummary.appendChild(delRow);

      // ئېتىبار كۇپونى بار بولسا
      if (discountVal > 0) {
        const coupRow = document.createElement('div');
        coupRow.style.cssText = 'display: flex; justify-content: space-between; font-size: 0.85rem; color: #10b981; margin-top: 0.25rem; font-weight: 700;';
        const coupCode = appliedCoupon?.code ? ` (${appliedCoupon.code})` : '';
        const coupLabel = lang === 'tr' ? `İndirim Kuponu${coupCode}:` : (lang === 'en' ? `Coupon Discount${coupCode}:` : `ئېتىبار كۇپونى${coupCode}:`);
        coupRow.innerHTML = `<span>${coupLabel}</span><span>-${window.appStore.formatPrice(discountVal)}</span>`;
        orderItemsSummary.appendChild(coupRow);
      }
    }

    if (checkoutTotalEl) checkoutTotalEl.textContent = window.appStore.formatPrice(finalTotalCny);

    // 🤝 تەكلىماكان خەير-ساخاۋەت فوندى ئەسكەرتىشى (پەقەت ئۇيغۇرچىدا كۆرۈنىدۇ)
    const checkoutCharityBox = document.getElementById('checkoutCharityNotice');
    const checkoutCharityAmt = document.getElementById('checkoutCharityAmount');
    const checkoutCharityLnk = document.getElementById('checkoutCharityLink');
    const charityCfg = (window.appStore && typeof window.appStore.getCharityFundConfig === 'function')
      ? window.appStore.getCharityFundConfig()
      : null;

    if (checkoutCharityBox) {
      if (lang === 'ug' && charityCfg && charityCfg.enabled !== false && finalTotalCny > 0) {
        const rate = (Number(charityCfg.percentage) || 5) / 100;
        const charityContribution = Math.round(finalTotalCny * rate * 100) / 100;
        if (checkoutCharityAmt) checkoutCharityAmt.textContent = window.appStore.formatPrice(charityContribution);
        if (checkoutCharityLnk && charityCfg.url) checkoutCharityLnk.href = charityCfg.url;
        checkoutCharityBox.style.display = 'block';
      } else {
        checkoutCharityBox.style.display = 'none';
      }
    }

    // چىقىم كۆزنىكى تەرجىمىلىرىنى تولۇق يېڭىلاش
    updateStaticTranslations();

    const checkedPay = document.querySelector('input[name="checkoutPayment"]:checked');
    const notice = document.getElementById('whatsappPayNotice');
    const havaleDetails = document.getElementById('havalePaymentDetails');
    const cardDetails = document.getElementById('cardPaymentDetails');
    const submitBtn = document.getElementById('submitOrderBtn');
    const submitBtnSpan = document.getElementById('submitOrderBtnText') || (submitBtn ? submitBtn.querySelector('span') : null);
    const submitBtnIcon = submitBtn ? submitBtn.querySelector('i') : null;
    const i18n = window.appI18n;

    if (checkedPay && (checkedPay.value.includes('ۋاتساپ') || checkedPay.value.includes('WhatsApp'))) {
      if (notice) notice.style.display = 'block';
      if (havaleDetails) havaleDetails.style.display = 'none';
      if (cardDetails) cardDetails.style.display = 'none';
      if (submitBtnSpan) submitBtnSpan.textContent = i18n ? i18n.t('submitOrderBtnWhatsapp') : 'ۋاتساپ ئارقىلىق زاكاز بېرىش';
      if (submitBtnIcon) submitBtnIcon.className = 'fab fa-whatsapp';
    } else if (checkedPay && (checkedPay.value.includes('كارتا') || checkedPay.value.includes('Card'))) {
      if (notice) notice.style.display = 'none';
      if (havaleDetails) havaleDetails.style.display = 'none';
      if (cardDetails) cardDetails.style.display = 'block';
      if (submitBtnSpan) submitBtnSpan.textContent = i18n ? i18n.t('submitOrderBtnCard') : 'كارتىدىن بىخەتەر چىقىم قىلىش';
      if (submitBtnIcon) submitBtnIcon.className = 'fas fa-lock';
    } else {
      if (notice) notice.style.display = 'none';
      if (havaleDetails) havaleDetails.style.display = 'block';
      if (cardDetails) cardDetails.style.display = 'none';
      if (submitBtnSpan) submitBtnSpan.textContent = i18n ? i18n.t('submitOrderBtnHavale') : 'زاكاز ۋە ھېسابات ئۇچۇرىنى جەزملەش';
      if (submitBtnIcon) submitBtnIcon.className = 'fas fa-university';
    }

    // 🎁 ئىنىستىگېرام سوۋغات ساندۇقى ئۇلانمىسىنى ئاكتىپ تىلغا ئاساسەن دەل ماسلاشتۇرۇش
    const checkoutLang = window.appI18n ? window.appI18n.getLang() : 'ug';
    const checkoutInstaUrl = window.appI18n ? (window.appI18n.t('instagramUrl') || (checkoutLang === 'ug' ? 'https://www.instagram.com/teklimakancom' : 'https://www.instagram.com/teklimakan.online')) : 'https://www.instagram.com/teklimakancom';
    const checkoutInstaHandle = window.appI18n ? (window.appI18n.t('instagramHandle') || (checkoutLang === 'ug' ? '@teklimakancom' : '@teklimakan.online')) : '@teklimakancom';
    const igHandleEl = document.getElementById('instaGiftPageHandle');
    if (igHandleEl) igHandleEl.textContent = checkoutInstaHandle;
    const igBtnEl = document.getElementById('instaGiftFollowBtn');
    if (igBtnEl) igBtnEl.href = checkoutInstaUrl;

    if (window.TeklimakanLocations) {
      const cityEl = document.getElementById('checkoutCustCity');
      const distEl = document.getElementById('checkoutCustDistrict');
      if (cityEl && distEl) {
        const savedCity = cityEl.value || 'İSTANBUL';
        const savedDist = distEl.value || '';
        window.TeklimakanLocations.setupLinkedCityDistrict('checkoutCustCity', 'checkoutCustDistrict', savedCity, savedDist);
      }
    }

    closeCartDrawer();
    modal.classList.add('active');
  }

  // ==================== ⚡ چەكلىك ۋاقىت ئېتىبار سائىتى ====================
  function initFlashCountdown() {
    const hEl = document.getElementById('flashHours');
    const mEl = document.getElementById('flashMinutes');
    const sEl = document.getElementById('flashSeconds');

    function update() {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const diffMs = tomorrow - now;
      if (diffMs <= 0) return;

      const totalSec = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSec / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
      if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  // ==================== 🌤️ چەكلىك ئېتىبار رامكىسىدىكى ھاۋارايى مەلۇماتى ====================
  function updateFlashWeatherUI() {
    const cityEl = document.getElementById('flashWeatherCity');
    const condEl = document.getElementById('flashWeatherCondition');
    const tempEl = document.getElementById('flashWeatherTemp');
    const iconEl = document.getElementById('flashWeatherIcon');
    if (!cityEl || !condEl || !tempEl || !iconEl || !FLASH_WEATHER_CITIES) return;

    const lang = window.appI18n.getLang() || 'ug';
    const cityData = FLASH_WEATHER_CITIES[currentFlashWeatherIndex] || FLASH_WEATHER_CITIES[0];
    if (!cityData) return;

    cityEl.textContent = cityData.name[lang] || cityData.name['ug'];
    condEl.textContent = cityData.condition[lang] || cityData.condition['ug'];
    tempEl.textContent = cityData.temp;
    iconEl.className = `fas ${cityData.icon}`;
    iconEl.style.color = cityData.color;
  }

  function initFlashWeather() {
    updateFlashWeatherUI();
    const widget = document.getElementById('flashWeatherWidget');
    if (widget) {
      widget.addEventListener('click', () => {
        currentFlashWeatherIndex = (currentFlashWeatherIndex + 1) % FLASH_WEATHER_CITIES.length;
        updateFlashWeatherUI();
      });
    }

    // ھەر 15 سېكۇنتتا شەھەر ھاۋارايى ئالمىشىپ تۇرۇش
    setInterval(() => {
      currentFlashWeatherIndex = (currentFlashWeatherIndex + 1) % FLASH_WEATHER_CITIES.length;
      updateFlashWeatherUI();
    }, 15000);
  }


  // ==================== 🛒 جانلىق زاكاز چىقىش ئۇقتۇرۇشى (Professional Live Sales Toast) ====================
  function initLiveSalesPopups() {
    // 🔕 لەيلىمە زاكاز ئۇقتۇرۇش كۆزنىكى پۈتۈنلەي تاقالدى ۋە چىقىرىۋېتىلدى
    const existing = document.querySelector('.live-sales-popup');
    if (existing) existing.remove();
  }

  // ==================== ھادىسىلەر ====================
  function setupEventListeners() {
    // پۇل بىرلىكى (Currency Switcher)
    const curSelect = document.getElementById('currencySelect');
    if (curSelect) {
      curSelect.addEventListener('change', (e) => {
        window.appStore.setCurrency(e.target.value);
        renderProducts();
        updateCartUI();
        showToast(`پۇل بىرلىكى ${e.target.value} غا ئالماشتى!`, 'info');
      });
    }

    // مەخسۇس تىل كۆزنىكى (Custom Language Modal)
    const langPickerBtn = document.getElementById('languagePickerBtn');
    const langModal = document.getElementById('languageModal');
    if (langPickerBtn && langModal) {
      langPickerBtn.addEventListener('click', () => {
        langModal.classList.add('active');
      });

      langModal.addEventListener('click', (e) => {
        if (e.target === langModal) {
          langModal.classList.remove('active');
        }
      });

      document.querySelectorAll('.lang-option-row').forEach(row => {
        row.addEventListener('click', () => {
          const selectedLang = row.dataset.lang;
          if (selectedLang) {
            selectSiteLanguage(selectedLang);
          }
        });
      });
    }

    window.addEventListener('teklimakan_lang_changed', () => {
      updateStaticTranslations();
      renderBrands();
      renderCategories();
      renderProducts();
      renderFlashProductsCards();
      updateCartUI();
      const quickViewModal = document.getElementById('quickViewModal');
      if (quickViewModal?.classList.contains('active') && quickViewModal.dataset.productId) {
        openQuickView(quickViewModal.dataset.productId);
      }
    });

    document.querySelectorAll('.cart-toggle-btn, #cartToggleBtn').forEach(btn => {
      btn.addEventListener('click', openCartDrawer);
    });

    const closeDrawerBtn = document.getElementById('closeCartDrawerBtn');
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeCartDrawer);

    const drawerOverlay = document.getElementById('cartDrawerOverlay');
    if (drawerOverlay) {
      drawerOverlay.addEventListener('click', (e) => {
        if (e.target === drawerOverlay) closeCartDrawer();
      });
    }

    // ❤️ ياقتۇرغانلار تارتما كۆزنىكىنى ئېچىش ۋە تاقاش
    document.querySelectorAll('.wishlist-toggle-btn, #wishlistToggleBtn').forEach(btn => {
      btn.addEventListener('click', openWishlistDrawer);
    });

    const closeWishlistDrawerBtn = document.getElementById('closeWishlistDrawerBtn');
    if (closeWishlistDrawerBtn) closeWishlistDrawerBtn.addEventListener('click', closeWishlistDrawer);

    const wishlistOverlay = document.getElementById('wishlistDrawerOverlay');
    if (wishlistOverlay) {
      wishlistOverlay.addEventListener('click', (e) => {
        if (e.target === wishlistOverlay) closeWishlistDrawer();
      });
    }

    const btnMoveAllWishlistToCart = document.getElementById('btnMoveAllWishlistToCart');
    if (btnMoveAllWishlistToCart) {
      btnMoveAllWishlistToCart.addEventListener('click', () => {
        const lang = window.appI18n ? window.appI18n.getLang() : 'ug';
        const res = window.appStore.moveAllWishlistToCart(lang);
        if (res.success) {
          if (typeof playChime === 'function') playChime('success');
          showToast(res.message, 'success');
          updateWishlistUI();
          updateCartUI();
          openCartDrawer();
          closeWishlistDrawer();
        } else {
          showToast(res.message, 'warning');
        }
      });
    }

    const btnClearWishlist = document.getElementById('btnClearWishlistBtn');
    if (btnClearWishlist) {
      btnClearWishlist.addEventListener('click', () => {
        if (confirm('راستلا بارلىق ياقتۇرغان تاۋارلارنى تازىلىۋېتەمسىز؟')) {
          window.appStore.clearWishlist();
          updateWishlistUI();
          renderProducts();
          showToast('ياقتۇرغانلار تىزىملىكى تازىلاندى!', 'info');
        }
      });
    }

    // 🚚 زاكاز ئىز قوغلاش كۆزنىكىنى ئېچىش ۋە سۈرۈشتۈرۈش
    document.querySelectorAll('.track-order-btn, #trackOrderNavBtn').forEach(btn => {
      btn.addEventListener('click', () => openTrackOrderModal());
    });

    const fLinkTrackOrder = document.getElementById('fLinkTrackOrder');
    if (fLinkTrackOrder) {
      fLinkTrackOrder.addEventListener('click', (e) => {
        e.preventDefault();
        openTrackOrderModal();
      });
    }

    const btnCloseOrderTrackModal = document.getElementById('btnCloseOrderTrackModal');
    if (btnCloseOrderTrackModal) btnCloseOrderTrackModal.addEventListener('click', closeTrackOrderModal);

    const orderTrackModal = document.getElementById('orderTrackModal');
    if (orderTrackModal) {
      orderTrackModal.addEventListener('click', (e) => {
        if (e.target === orderTrackModal) closeTrackOrderModal();
      });
    }

    const btnDoTrackOrder = document.getElementById('btnDoTrackOrder');
    const orderTrackQueryInput = document.getElementById('orderTrackQueryInput');
    if (btnDoTrackOrder && orderTrackQueryInput) {
      btnDoTrackOrder.addEventListener('click', () => {
        doTrackOrder(orderTrackQueryInput.value);
      });
      orderTrackQueryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          doTrackOrder(orderTrackQueryInput.value);
        }
      });
    }

    // 📬 زاكاز ۋە ئۇقتۇرۇش ساندۇقى كۇنۇپكىسى (Header Inbox Button)
    const headerInboxBtn = document.getElementById('headerInboxBtn');
    if (headerInboxBtn) {
      headerInboxBtn.addEventListener('click', () => openTrackOrderModal());
    }

    // 👤 نومۇر ئالماشتۇرۇش كۇنۇپكىسى
    const btnToggleInboxSearch = document.getElementById('btnToggleInboxSearch');
    if (btnToggleInboxSearch) {
      btnToggleInboxSearch.addEventListener('click', () => {
        const searchSec = document.getElementById('orderTrackSearchSection');
        if (searchSec) {
          searchSec.style.display = searchSec.style.display === 'none' ? 'block' : 'block';
          const input = document.getElementById('orderTrackQueryInput');
          if (input) {
            input.value = '';
            input.focus();
          }
        }
      });
    }

    // 📑 ساندۇق ئىچى تاللىغۇچلىرى (Tabs)
    const tabBtnInboxNotifs = document.getElementById('tabBtnInboxNotifs');
    const tabBtnInboxOrders = document.getElementById('tabBtnInboxOrders');
    if (tabBtnInboxNotifs) {
      tabBtnInboxNotifs.addEventListener('click', () => switchInboxTab('notifs'));
    }
    if (tabBtnInboxOrders) {
      tabBtnInboxOrders.addEventListener('click', () => switchInboxTab('orders'));
    }

    // دەسلەپكى ساندۇق يېڭى ئۇچۇر بەلگىسىنى يېڭىلاش
    updateCustomerInboxBadges();
    if (window.appStore && typeof window.appStore.on === 'function') {
      window.appStore.on('customer_inbox', updateCustomerInboxBadges);
      window.appStore.on('customer_inbox_read', updateCustomerInboxBadges);
      window.appStore.on('orders', updateCustomerInboxBadges);
    }

    document.querySelectorAll('.btn-modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const m = e.target.closest('.modal-backdrop');
        if (m) {
          m.classList.remove('active');
          if (m.id === 'quickViewModal') clearUrlProductId();
        }
      });
    });

    const quickViewModalEl = document.getElementById('quickViewModal');
    if (quickViewModalEl) {
      quickViewModalEl.addEventListener('click', (e) => {
        if (e.target === quickViewModalEl) {
          quickViewModalEl.classList.remove('active');
          clearUrlProductId();
        }
      });
    }

    // ==================== 🔔 ئاۋاز ئۈنۈمى (Web Audio API Synthesizer) ====================
    function playChime(kind = 'success') {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        if (kind === 'success') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.36);
        } else if (kind === 'click') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.16);
        }
      } catch (err) {
        // Silent fallback if audio context blocked
      }
    }

    // ==================== ⚡ زامانىۋى ئىزدەش ئاپتوماتىك تولۇقلاش (Autocomplete) ====================
    const searchInput = document.getElementById('mainSearchInput');
    const searchBtn = document.getElementById('mainSearchBtn');
    const autocompleteDrop = document.getElementById('searchAutocompleteDropdown');

    function renderAutocomplete(query) {
      if (!autocompleteDrop) return;
      if (!query || query.trim().length < 1) {
        autocompleteDrop.innerHTML = '';
        autocompleteDrop.classList.remove('active');
        return;
      }

      const lang = window.appI18n.getLang();
      const products = window.appStore.getProductsByLang(lang);
      const q = query.trim().toLowerCase();
      const matches = products.filter(p => 
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      ).slice(0, 6);

      if (matches.length === 0) {
        autocompleteDrop.innerHTML = `
          <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
            ${window.appI18n.t('noProductsFound')}
          </div>
        `;
        autocompleteDrop.classList.add('active');
        return;
      }

      autocompleteDrop.innerHTML = matches.map(p => `
        <div class="search-suggest-item" data-id="${p.id}">
          <img src="${p.image}" class="search-suggest-img" alt="${p.name}">
          <div class="search-suggest-info">
            <div class="search-suggest-title">${p.name}</div>
            <div class="search-suggest-meta">
              <span><i class="fas fa-award"></i> ${window.appI18n.getBrandName(p.brand)}</span>
              <span class="search-suggest-price">${window.appStore.formatPrice(p.price)}</span>
            </div>
          </div>
        </div>
      `).join('');

      autocompleteDrop.querySelectorAll('.search-suggest-item').forEach(item => {
        item.addEventListener('click', () => {
          const pid = item.dataset.id;
          autocompleteDrop.classList.remove('active');
          openQuickView(pid);
        });
      });

      autocompleteDrop.classList.add('active');
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderProducts();
        renderAutocomplete(searchQuery);
      });

      searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length > 0) {
          renderAutocomplete(searchInput.value);
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (autocompleteDrop && !e.target.closest('.search-bar-container')) {
        autocompleteDrop.classList.remove('active');
      }
    });

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        searchQuery = searchInput.value;
        renderProducts();
        if (autocompleteDrop) autocompleteDrop.classList.remove('active');
      });
    }

    // ==================== 🎁 كوپوننى بىر چېكىش بىلەن كۆچۈرۈش ۋە ئىشلىتىش ====================
    const quickCouponCard = document.getElementById('quickCouponCard');
    if (quickCouponCard) {
      quickCouponCard.addEventListener('click', () => {
        playChime('click');
        const code = 'TEKLIMAKAN20';
        const couponInp = document.getElementById('couponCodeInput');
        if (couponInp) couponInp.value = code;
        
        appliedCoupon = { code: 'TEKLIMAKAN20', discount: 20 };
        updateCartUI();
        
        navigator.clipboard?.writeText(code).catch(() => {});
        const copiedMsg = window.appI18n.getLang() === 'tr' ? `🎉 ${code} kuponu kopyalandı ve sepete %20 indirim uygulandı!` :
                          window.appI18n.getLang() === 'en' ? `🎉 Coupon ${code} copied and 20 discount applied!` :
                          `🎉 كوپون كودى (${code}) كۆچۈرۈلدى ۋە ئېتىبار قوشۇلدى!`;
        showToast(copiedMsg, 'success');
        playChime('success');

        const copyTextEl = document.getElementById('quickCouponCopyText');
        if (copyTextEl) {
          copyTextEl.textContent = window.appI18n.t('couponCopied');
          setTimeout(() => {
            copyTextEl.textContent = window.appI18n.t('copyCoupon');
          }, 2000);
        }
      });
    }

    const searchCategorySelect = document.getElementById('searchCategorySelect');
    if (searchCategorySelect) {
      searchCategorySelect.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        document.querySelectorAll('.category-pill').forEach(pill => {
          pill.classList.toggle('active', pill.textContent.trim().includes(currentCategory));
        });
        renderProducts();
      });
    }

    const priceSlider = document.getElementById('priceRangeSlider');
    const priceDisplay = document.getElementById('maxPriceDisplay');
    if (priceSlider && priceDisplay) {
      priceSlider.addEventListener('input', (e) => {
        maxPrice = parseInt(e.target.value, 10);
        priceDisplay.textContent = maxPrice;
        renderProducts();
      });
    }

    // تېلېفون نۇسخىسىدىكى سۈزگۈچ تاختىسىنى ئېچىش/يىغىش (Mobile Filter Toggle)
    const sidebarToggleBar = document.getElementById('mobileSidebarToggleBar');
    const catalogSidebar = document.getElementById('catalogSidebar');
    if (sidebarToggleBar && catalogSidebar) {
      sidebarToggleBar.addEventListener('click', () => {
        catalogSidebar.classList.toggle('is-expanded');
        updateMobileFilterBadge();
      });
    }

    const stockFilterCb = document.getElementById('filterInStockCb');
    if (stockFilterCb) {
      stockFilterCb.addEventListener('change', (e) => {
        onlyInStock = e.target.checked;
        renderProducts();
      });
    }

    const sortSelect = document.getElementById('catalogSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        renderProducts();
      });
    }

    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const couponInput = document.getElementById('couponCodeInput');
    if (applyCouponBtn && couponInput) {
      applyCouponBtn.addEventListener('click', () => {
        const code = couponInput.value.trim().toUpperCase();
        if (!code) {
          showToast('كۇپون كودىنى كىرگۈزۈڭ!', 'error');
          return;
        }
        const cartDetailed = window.appStore ? window.appStore.getCartDetailed() : { totalCny: 0, subtotalCny: 0 };
        const check = window.appStore ? window.appStore.validateCoupon(code, cartDetailed.subtotalCny) : null;
        if (check && check.valid) {
          appliedCoupon = { code: check.coupon.code, discount: check.discountAmount };
          if (typeof playChime === 'function') playChime('success');
          showToast(`🎉 ${check.message}`, 'success');
          updateCartUI();
        } else if (code === 'TEKLIMAKAN20' || code === 'BULAQ20') {
          appliedCoupon = { code: 'TEKLIMAKAN20', discount: 20 };
          if (typeof playChime === 'function') playChime('success');
          showToast('🎉 ئېتىبار كودى تەستىقلاندى! 20 لىرا ئېتىبار بېرىلدى.', 'success');
          updateCartUI();
        } else {
          showToast(check ? check.message : 'ئېتىبار كودى ئىناۋەتسىز!', 'error');
        }
      });
    }

    window.applyCustomerCouponToCart = function(couponCode) {
      if (!couponCode) return;
      const code = couponCode.trim().toUpperCase();
      const cartDetailed = window.appStore ? window.appStore.getCartDetailed() : { totalCny: 0, subtotalCny: 0 };
      const check = window.appStore ? window.appStore.validateCoupon(code, cartDetailed.subtotalCny) : null;
      if (check && check.valid) {
        appliedCoupon = { code: check.coupon.code, discount: check.discountAmount };
        const coupInp = document.getElementById('couponCodeInput');
        if (coupInp) coupInp.value = code;
        updateCartUI();
        if (typeof playChime === 'function') playChime('success');
        showToast(`🎉 ${check.message}`, 'success');
      } else {
        appliedCoupon = { code: code, discount: 20 };
        const coupInp = document.getElementById('couponCodeInput');
        if (coupInp) coupInp.value = code;
        const lang = (window.appI18n && typeof window.appI18n.getLang === 'function') ? window.appI18n.getLang() : 'ug';
        const msg = lang === 'tr' 
          ? `🎉 Kupon (${code}) sepete başarıyla uygulandı!` 
          : (lang === 'en' ? `🎉 Coupon (${code}) applied to cart!` : `🎉 كۇپون (${code}) سېۋەتكە كۈچكە ئىگە قىلىندى!`);
        showToast(msg, 'success');
      }
      // سېۋەت رامكىسىنى ئېچىش
      const cartDrawer = document.getElementById('cartDrawer');
      const drawerBackdrop = document.getElementById('drawerBackdrop');
      if (cartDrawer && drawerBackdrop) {
        cartDrawer.classList.add('is-open');
        drawerBackdrop.classList.add('is-open');
      }
    };

    const proceedCheckoutBtn = document.getElementById('proceedCheckoutBtn');
    if (proceedCheckoutBtn) proceedCheckoutBtn.addEventListener('click', openCheckoutModal);

    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
      // چىقىم قىلىش ئۇسۇللىرىنى ئالماشتۇرۇش ۋە ئېلېمېنتلارنى كۆرسىتىش/يوشۇرۇش
      const cardDetails = document.getElementById('cardPaymentDetails');
      const havaleDetails = document.getElementById('havalePaymentDetails');
      const whatsappNotice = document.getElementById('whatsappPayNotice');
      const labelCard = document.getElementById('labelPayCard');
      const labelHavale = document.getElementById('labelPayHavale');
      const labelWhatsapp = document.getElementById('labelPayWhatsapp');
      const submitBtn = document.getElementById('submitOrderBtn');
      const submitBtnSpan = document.getElementById('submitOrderBtnText') || (submitBtn ? submitBtn.querySelector('span') : null);
      const submitBtnIcon = submitBtn ? submitBtn.querySelector('i') : null;

      function updatePaymentMethodUI(method) {
        if (labelCard) labelCard.style.borderColor = 'var(--border-color)';
        if (labelHavale) labelHavale.style.borderColor = 'var(--border-color)';
        if (labelWhatsapp) labelWhatsapp.style.borderColor = 'var(--border-color)';

        const i18n = window.appI18n;

        if (method.includes('كارتا') || method.includes('Card') || method.includes('Kart')) {
          if (cardDetails) cardDetails.style.display = 'block';
          if (havaleDetails) havaleDetails.style.display = 'none';
          if (whatsappNotice) whatsappNotice.style.display = 'none';
          if (labelCard) labelCard.style.borderColor = '#6366f1';
          if (submitBtnSpan) submitBtnSpan.textContent = i18n ? i18n.t('submitOrderBtnCard') : 'كارتىدىن بىخەتەر چىقىم قىلىش';
          if (submitBtnIcon) submitBtnIcon.className = 'fas fa-lock';
        } else if (method.includes('يۆتكەش') || method.includes('Havale') || method.includes('Transfer')) {
          if (cardDetails) cardDetails.style.display = 'none';
          if (havaleDetails) havaleDetails.style.display = 'block';
          if (whatsappNotice) whatsappNotice.style.display = 'none';
          if (labelHavale) labelHavale.style.borderColor = '#059669';
          if (submitBtnSpan) submitBtnSpan.textContent = i18n ? i18n.t('submitOrderBtnHavale') : 'زاكاز ۋە ھېسابات ئۇچۇرىنى جەزملەش';
          if (submitBtnIcon) submitBtnIcon.className = 'fas fa-university';
        } else if (method.includes('ۋاتساپ') || method.includes('WhatsApp')) {
          if (cardDetails) cardDetails.style.display = 'none';
          if (havaleDetails) havaleDetails.style.display = 'none';
          if (whatsappNotice) whatsappNotice.style.display = 'block';
          if (labelWhatsapp) labelWhatsapp.style.borderColor = '#25D366';
          if (submitBtnSpan) submitBtnSpan.textContent = i18n ? i18n.t('submitOrderBtnWhatsapp') : 'ۋاتساپ ئارقىلىق زاكاز بېرىش';
          if (submitBtnIcon) submitBtnIcon.className = 'fab fa-whatsapp';
        }
      }

      if (labelCard) {
        labelCard.addEventListener('click', (e) => {
          const toastMsg = window.appI18n ? window.appI18n.t('cardDisabledToast') : 'بانكا ياكى خەلقئارالىق كارتا ئارقىلىق پۇل تۆلەش ھازىرچە پاسسىپ ھالەتتە. بانكا ھېساباتىغا يۆتكەش (Havale) ياكى ۋاتساپ ئارقىلىق پۇل تۆلەڭ.';
          showToast(toastMsg, 'info');
        });
      }

      document.querySelectorAll('input[name="checkoutPayment"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
          updatePaymentMethodUI(e.target.value);
        });
      });

      // IBAN كۆچۈرۈش كۇنۇپكىسى
      const btnCopyIban = document.getElementById('btnCopyIban');
      if (btnCopyIban) {
        btnCopyIban.addEventListener('click', () => {
          const ibanText = 'TR650015700000000095154493';
          const copySpan = document.getElementById('btnCopyIbanText');
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(ibanText).then(() => {
              showToast('IBAN كۆچۈرۈلدى: TR65 0015 7000 0000 0095 1544 93 (QNB Enpara)', 'success');
              if (copySpan) copySpan.textContent = 'كۆچۈرۈلدى ✓';
              setTimeout(() => { if (copySpan) copySpan.textContent = 'كۆچۈرۈش'; }, 2500);
            }).catch(() => {
              fallbackCopy(ibanText);
            });
          } else {
            fallbackCopy(ibanText);
          }
        });
      }

      function fallbackCopy(text) {
        const temp = document.createElement('textarea');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast('IBAN نۇمۇرى كۆچۈرۈلدى!', 'success');
      }

      // كارت نومۇرىنى 4 خانىدىن ئارىلىق قويۇش ۋە ماركىسىنى ئېنىقلاش
      const cardNumInput = document.getElementById('checkoutCardNumber');
      const cardBrandIcon = document.getElementById('cardInputBrandIcon');
      const cardTypeBadge = document.getElementById('cardTypeBadge');
      if (cardNumInput) {
        cardNumInput.addEventListener('input', (e) => {
          let val = e.target.value.replace(/\D/g, '').substring(0, 16);
          let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
          e.target.value = formatted;

          if (val.startsWith('4')) {
            if (cardBrandIcon) cardBrandIcon.innerHTML = '<i class="fab fa-cc-visa" style="color: #1a1f71;"></i>';
            if (cardTypeBadge) cardTypeBadge.textContent = 'VISA';
          } else if (/^5[1-5]/.test(val) || /^2[2-7]/.test(val)) {
            if (cardBrandIcon) cardBrandIcon.innerHTML = '<i class="fab fa-cc-mastercard" style="color: #eb001b;"></i>';
            if (cardTypeBadge) cardTypeBadge.textContent = 'MASTERCARD';
          } else if (val.startsWith('9792')) {
            if (cardBrandIcon) cardBrandIcon.innerHTML = '<i class="fas fa-credit-card" style="color: #059669;"></i>';
            if (cardTypeBadge) cardTypeBadge.textContent = 'TROY';
          } else {
            if (cardBrandIcon) cardBrandIcon.innerHTML = '<i class="fas fa-credit-card" style="color: #6366f1;"></i>';
            if (cardTypeBadge) cardTypeBadge.textContent = 'VISA / MASTER';
          }
        });
      }

      // كارت ۋاقتىنى MM/YY شەكلىدە ئاپتوماتىك تەڭشەش
      const cardExpiryInput = document.getElementById('checkoutCardExpiry');
      if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', (e) => {
          let val = e.target.value.replace(/\D/g, '').substring(0, 4);
          if (val.length >= 2) {
            e.target.value = val.substring(0, 2) + '/' + val.substring(2);
          } else {
            e.target.value = val;
          }
        });
      }

      // كارت CVV پەقەت سان قىلىش
      const cardCvvInput = document.getElementById('checkoutCardCvv');
      if (cardCvvInput) {
        cardCvvInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
      }

      // 🎁 ئىنىستىگېرام ئەگەشكۈچى سوۋغىتى تاللىغۇچىسى
      const instaGiftCheckbox = document.getElementById('instaGiftCheckbox');
      const instaGiftUsernameWrap = document.getElementById('instaGiftUsernameWrap');
      const instaGiftUsername = document.getElementById('instaGiftUsername');
      if (instaGiftCheckbox && instaGiftUsernameWrap) {
        instaGiftCheckbox.addEventListener('change', () => {
          if (instaGiftCheckbox.checked) {
            instaGiftUsernameWrap.style.display = 'block';
            if (instaGiftUsername) instaGiftUsername.focus();
          } else {
            instaGiftUsernameWrap.style.display = 'none';
          }
        });
      }

      // زاكاز تاپشۇرۇش جەريانى
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('checkoutCustName').value.trim();
        const phone = document.getElementById('checkoutCustPhone').value.trim();
        const city = (document.getElementById('checkoutCustCity')?.value || '').trim();
        const district = (document.getElementById('checkoutCustDistrict')?.value || '').trim();
        const address = document.getElementById('checkoutCustAddress').value.trim();
        const payment = document.querySelector('input[name="checkoutPayment"]:checked')?.value || 'بانكا ياكى خەلقئارالىق كارتا';
        const notes = document.getElementById('checkoutCustNotes')?.value.trim() || '';
        const lang = window.appI18n.getLang();

        // ⚠️ تۈركىيە كارگو (پوچتا) تۈركچە ھەرپ تەكشۈرۈش (Alıcı ve Adres Türkçe/Latin harfleri olmalıdır)
        const arabicRegex = /[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        const latinRegex = /[a-zA-ZçğıöşüÇĞİÖŞÜ]/;

        if (arabicRegex.test(name)) {
          showToast(window.appI18n ? window.appI18n.t('valNameLatin') : '⚠️ كارگو (پوچتا) توغرا يەتكۈزۈشى ئۈچۈن، تاپشۇرۇۋالغۇچىنىڭ ئىسمى چوقۇم تۈركچە (لاتىنچە) يېزىلىشى كېرەك! مەسىلەن: Ahmet Yılmaz', 'warning');
          document.getElementById('checkoutCustName')?.focus();
          return;
        }

        if (!latinRegex.test(name) || name.length < 2) {
          showToast(window.appI18n ? window.appI18n.t('valNameEmpty') : '⚠️ تاپشۇرۇۋالغۇچىنىڭ ئىسمىنى تۈركچە كىرگۈزۈڭ (مەسىلەن: Ahmet Yılmaz)!', 'warning');
          document.getElementById('checkoutCustName')?.focus();
          return;
        }

        const cleanPhone = phone.replace(/[^\d+]/g, '');
        if (cleanPhone.length < 10) {
          showToast(window.appI18n ? window.appI18n.t('valPhone') : '⚠️ تېلېفون نومۇرىنى تولۇق كىرگۈزۈڭ (مەسىلەن: 05XX XXX XX XX)!', 'warning');
          document.getElementById('checkoutCustPhone')?.focus();
          return;
        }

        if (arabicRegex.test(address)) {
          showToast(window.appI18n ? window.appI18n.t('valAddressLatin') : '⚠️ كارگو شىركىتى ئادرېسنى تېپىشى ئۈچۈن تەپسىلىي ئادرېس چوقۇم تۈركچە (لاتىنچە) يېزىلىشى كېرەك! مەسىلەن: Mahalle, Cadde, Sokak, No...', 'warning');
          document.getElementById('checkoutCustAddress')?.focus();
          return;
        }

        if (!latinRegex.test(address) || address.length < 6) {
          showToast(window.appI18n ? window.appI18n.t('valAddressEmpty') : '⚠️ تەپسىلىي تۈركچە ئادرېسنى تولۇق كىرگۈزۈڭ (مەھەللە، كوچا، بىنا نومۇرى، ناھىيە)!', 'warning');
          document.getElementById('checkoutCustAddress')?.focus();
          return;
        }

        // ئەگەر بانكا كارتىسى تاللانغان بولسا، كارتا ئۇچۇرلىرىنى تەكشۈرۈش
        if (payment.includes('كارتا') || payment.includes('Card')) {
          const cardNum = (document.getElementById('checkoutCardNumber')?.value || '').replace(/\s/g, '');
          const cardExp = document.getElementById('checkoutCardExpiry')?.value || '';
          const cardCvv = document.getElementById('checkoutCardCvv')?.value || '';
          const cardHolder = document.getElementById('checkoutCardHolder')?.value || '';

          if (cardNum.length < 15) {
            showToast('كارتا نومۇرىنى تولۇق كىرگۈزۈڭ (16 خانىلىق)!', 'warning');
            document.getElementById('checkoutCardNumber')?.focus();
            return;
          }
          if (!cardExp.includes('/') || cardExp.length < 5) {
            showToast('كارتىنىڭ يىل-ئاي ۋاقتىنى (MM/YY) توغرا تولدۇرۇڭ!', 'warning');
            document.getElementById('checkoutCardExpiry')?.focus();
            return;
          }
          if (cardCvv.length < 3) {
            showToast('كارتىنىڭ CVV كودىنى تولدۇرۇڭ!', 'warning');
            document.getElementById('checkoutCardCvv')?.focus();
            return;
          }

          // چىقىم بىر تەرەپ قىلىش ھالىتىنى كۆرسىتىش
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>3D Secure بىخەتەر چىقىم قىلىنىۋاتىدۇ...</span>';
          }

          setTimeout(() => {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = '<i class="fas fa-lock"></i> <span>كارتىدىن بىخەتەر چىقىم قىلىش</span>';
            }
            proceedOrderCreation(name, phone, city, district, address, 'بانكا ياكى خەلقئارالىق كارتا (3D Secure مۇۋەپپەقىيەتلىك)', notes, lang);
          }, 800);
          return;
        }

        proceedOrderCreation(name, phone, city, district, address, payment, notes, lang);
      });

      function proceedOrderCreation(name, phone, city, district, address, payment, notes, lang) {
        // خېرىدار ئۇچۇرلىرىنى كەلگۈسىدىكى پاراڭ ۋە زاكازلار ئۈچۈن مەڭگۈلۈك ساقلاش
        try {
          if (name) {
            localStorage.setItem('teklimakan_customer_name', name);
            localStorage.setItem('teklimakan_checkout_name', name);
          }
          if (phone) {
            localStorage.setItem('teklimakan_customer_phone', phone);
            localStorage.setItem('teklimakan_checkout_phone', phone);
          }
          if (address) localStorage.setItem('teklimakan_checkout_address', address);
        } catch (e) {}

        const instaChecked = !!(document.getElementById('instaGiftCheckbox')?.checked);
        let instaUser = '';
        if (instaChecked) {
          instaUser = (document.getElementById('instaGiftUsername')?.value || '').trim();
          if (!instaUser) {
            instaUser = lang === 'ug' ? '@ئەگەشكۈچى' : (lang === 'tr' ? '@takipci' : '@follower');
          }
        }
        const instagramGiftData = instaChecked ? { requested: true, username: instaUser } : null;

        const discountVal = appliedCoupon ? appliedCoupon.discount : 0;
        const res = window.appStore.createOrder({ name, phone, city, district, address }, payment, notes, discountVal, lang, instagramGiftData);

        if (res.success) {
          if (typeof playChime === 'function') playChime('success');
          document.getElementById('checkoutModal').classList.remove('active');
          appliedCoupon = null;
          if (instaGiftCheckbox) instaGiftCheckbox.checked = false;
          if (instaGiftUsernameWrap) instaGiftUsernameWrap.style.display = 'none';
          if (instaGiftUsername) instaGiftUsername.value = '';
          updateCartUI();
          renderProducts();

          // Telegram ۋە Email ئاپتوماتىك زاكاز ئۇقتۇرۇشى ئەۋەتىش
          sendTelegramOrderNotification(res.order);
          // 🚀 Vercel ئارقا سۇپىسىغا يېڭى زاكازنى كىرگۈزۈپ، تېلېفون چېلىش ۋە جىددىي ئۇقتۇرۇش ئەۋەتىش
          try {
            fetch('/api/order-notify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(res.order)
            }).catch(e => console.warn('Order notify background error:', e));
          } catch(e) {}
          sendEmailOrderNotification(res.order);

          const isWhatsapp = payment.includes('ۋاتساپ') || payment.includes('WhatsApp');
          if (isWhatsapp) {
            const waUrl = getWhatsAppOrderUrl(res.order, lang);
            try {
              window.open(waUrl, '_blank');
            } catch (err) {
              console.error('WhatsApp redirect error:', err);
            }
          }

          openOrderSuccessModal(res.order);
        } else {
          showToast(res.message, 'error');
        }
      }
    }



    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeToggleBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('uyghur_theme_mode', isDark ? 'dark' : 'light');
      });
    }

    window.addEventListener('uyghur_store_sync', event => {
      if (event.detail?.type === 'marquee' || event.detail?.type === 'settings' || event.detail?.type === 'all') {
        renderMarqueeTicker();
      }
      renderBrands();
      renderCategories();
      renderProducts();
      updateCartUI();
      const quickViewModal = document.getElementById('quickViewModal');
      const productId = quickViewModal?.dataset.productId;
      if (event.detail?.type === 'products' && productId &&
          (!event.detail.productId || event.detail.productId === productId) &&
          quickViewModal.classList.contains('active')) {
        openQuickView(productId);
      }
    });

    window.addEventListener('storage', (e) => {
      if (e.key === 'teklimakan_ecom_settings_v4') {
        renderMarqueeTicker();
      }
    });

    window.addEventListener('teklimakan_lang_changed', (e) => {
      const lang = (e && e.detail) ? e.detail.lang : window.appI18n.getLang();
      const phoneInp = document.getElementById('checkoutCustPhone');
      const addressInp = document.getElementById('checkoutCustAddress');
      if (phoneInp) phoneInp.placeholder = '05XX XXX XX XX (+90)';
      if (addressInp) {
        if (lang === 'tr') {
          addressInp.placeholder = 'Mahalle, Cadde, Sokak, No, Daire, İlçe...';
        } else if (lang === 'en') {
          addressInp.placeholder = 'District, Street, Building, Flat...';
        } else {
          addressInp.placeholder = 'مەھەللە، كوچا، بىنا-ئۆي، ناھىيە (Mahalle, Cadde, Sokak, No, İlçe...)';
        }
      }
    });
  }

  // ==================== 📱 WhatsApp زاكاز ئۇچۇرى ھاسىللاش ====================
  function getWhatsAppOrderUrl(order, lang = 'ug') {
    const phone = '905551609999';
    let itemsText = '';
    if (order.items && order.items.length > 0) {
      itemsText = order.items.map((item, idx) => {
        const itemPrice = window.appStore ? window.appStore.formatPrice(item.price * item.quantity) : '';
        return `${idx + 1}. ${item.name} × ${item.quantity}${itemPrice ? ' (' + itemPrice + ')' : ''}`;
      }).join('\n');
    }

    let message = '';
    if (lang === 'tr') {
      message = `🛒 *YENİ SİPARİŞ - TEKLİMAKAN E-TİCARET*\n\n📋 *Sipariş No:* ${order.id}\n👤 *Müşteri:* ${order.customer?.name || ''}\n📞 *Telefon:* ${order.customer?.phone || ''}\n📍 *Teslimat Adresi:* ${order.customer?.city || ''}, ${order.customer?.address || ''}\n\n📦 *Satın Alınan Ürünler:*\n${itemsText}\n\n💰 *Ödenecek Toplam Tutar:* ${order.totalFormatted}\n💳 *Ödeme Yöntemi:* WhatsApp ile Ödeme\n${order.notes ? '📝 *Sipariş Notu:* ' + order.notes + '\n' : ''}\nLütfen siparişimi onaylayıp ödeme bilgilerini iletiniz. Teşekkürler!`;
    } else if (lang === 'en') {
      message = `🛒 *NEW ORDER - TEKLIMAKAN STORE*\n\n📋 *Order ID:* ${order.id}\n👤 *Customer:* ${order.customer?.name || ''}\n📞 *Phone:* ${order.customer?.phone || ''}\n📍 *Address:* ${order.customer?.city || ''}, ${order.customer?.address || ''}\n\n📦 *Purchased Items:*\n${itemsText}\n\n💰 *Total Amount Payable:* ${order.totalFormatted}\n💳 *Payment Method:* Pay via WhatsApp\n${order.notes ? '📝 *Order Notes:* ' + order.notes + '\n' : ''}\nPlease confirm my order and send payment details. Thank you!`;
    } else {
      message = `🛒 *تەكلىماكان تور سۇپىسىدىن يېڭى زاكاز*\n\n📋 *زاكاز نۇمۇرى:* ${order.id}\n👤 *خېرىدار:* ${order.customer?.name || ''}\n📞 *تېلېفون:* ${order.customer?.phone || ''}\n📍 *يەتكۈزۈش ئادرېسى:* ${order.customer?.city || ''}، ${order.customer?.address || ''}\n\n📦 *سېتىۋالغان ماللار تىزىملىكى:*\n${itemsText}\n\n💰 *تۆلەيدىغان ئومۇمىي سومما:* ${order.totalFormatted}\n💳 *چىقىم ئۇسۇلى:* ۋاتساپ ئارقىلىق پۇل تۆلەش\n${order.notes ? '📝 *ئالاھىدە تەلەپ:* ' + order.notes + '\n' : ''}\nزاكازنى جەزملەشتۈرۈپ ھېسابات ئۇچۇرىنى ئەۋەتىپ بېرىشىڭىزنى سورايمەن. تەشەككۈر!`;
    }

    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
  }

  // ==================== 🤖 Telegram ئاپتوماتىك زاكاز ئۇقتۇرۇشى ئەۋەتىش ====================
  async function sendTelegramOrderNotification(order) {
    if (window.TeklimakanTelegram && typeof window.TeklimakanTelegram.notifyNewOrder === 'function') {
      return await window.TeklimakanTelegram.notifyNewOrder(order);
    }
    try {
      const settings = window.appStore ? window.appStore.getSettings() : null;
      if (!settings || !settings.telegramBotToken || !settings.telegramChatId || settings.telegramEnabled === false) return;

      let itemsList = '';
      if (order.items && order.items.length > 0) {
        itemsList = order.items.map((it, idx) => {
          return `${idx + 1}. <b>${it.name}</b> × ${it.quantity} (${it.priceFormatted || (it.price + ' TL')})`;
        }).join('\n');
      }

      const msg = `🛒 <b>يېڭى زاكاز كېلىپ چۈشتى! — تەكلىماكان تور سودىسى</b>\n\n` +
        `🆔 <b>زاكاز نومۇرى:</b> <code>${order.id}</code>\n` +
        `👤 <b>خېرىدار:</b> ${order.customer?.name || 'نامەلۇم'}\n` +
        `📞 <b>تېلېفون:</b> <code>${order.customer?.phone || ''}</code>\n` +
        `📍 <b>ئادرېس:</b> ${order.customer?.city || ''} ${order.customer?.address || ''}\n` +
        `💳 <b>چىقىم ئۇسۇلى:</b> ${order.paymentMethod || ''}\n` +
        `💰 <b>ئومۇمىي سومما:</b> <b>${order.totalFormatted}</b>\n\n` +
        `📦 <b>سېتىۋالغان ماللار:</b>\n${itemsList}\n` +
        (order.notes ? `\n📝 <b>ئەسكەرتىش:</b> ${order.notes}\n` : '') +
        `\n⏰ <b>زاكاز ۋاقتى:</b> ${new Date().toLocaleString()}`;

      await fetch(`https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.telegramChatId,
          text: msg,
          parse_mode: 'HTML'
        })
      });
    } catch (err) {
      console.warn('Telegram notification failed:', err);
    }
  }

  // ==================== 📧 Email ئاپتوماتىك زاكاز ئۇقتۇرۇشى ئەۋەتىش ====================
  async function sendEmailOrderNotification(order) {
    try {
      const settings = window.appStore ? window.appStore.getSettings() : null;
      if (!settings || settings.emailNotificationEnabled === false) return;
      const targetEmail = settings.notificationEmail || settings.smtpUser || settings.contactEmail;
      if (!targetEmail || targetEmail.includes('@teklimakan.com')) {
        console.warn('Email notification skipped: No real email configured.');
        return;
      }

      const orderSubject = `🛒 [تەكلىماكان] يېڭى زاكاز: #${order.id} (${order.totalFormatted})`;

      // 1. ئەگەر Google SMTP تەڭشەلگەن بولسا، بىۋاسىتە ۋە 100% كاپالەتلىك سېرۋېر ئارقىلىق ئەۋەتىش
      if (settings.smtpUser && settings.smtpPass) {
        let itemsRows = '';
        if (order.items && order.items.length > 0) {
          itemsRows = order.items.map((it, idx) => {
            const priceStr = it.priceFormatted || (it.price + ' TL');
            return `
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px; font-weight: bold; color: #1e293b;">${idx + 1}. ${it.name}</td>
                <td style="padding: 10px; text-align: center; color: #475569;">${it.quantity} دانە</td>
                <td style="padding: 10px; text-align: left; color: #2563eb; font-weight: bold;" dir="ltr">${priceStr}</td>
              </tr>
            `;
          }).join('');
        }

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; direction: rtl; text-align: right; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #0f172a, #1e3a8a); color: #ffffff; padding: 1.5rem; text-align: center;">
              <h2 style="margin: 0; font-size: 1.4rem;">🛒 تەكلىماكان تور دۇكىنى</h2>
              <p style="margin: 0.5rem 0 0; color: #f59e0b; font-size: 1rem; font-weight: bold;">يېڭى زاكاز تاپشۇرۇۋېلىندى! (#${order.id})</p>
            </div>
            <div style="padding: 1.5rem;">
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem; margin-bottom: 1.25rem;">
                <h3 style="margin: 0 0 0.75rem; font-size: 1.05rem; color: #0f172a;">👤 خېرىدار ئۇچۇرلىرى:</h3>
                <div style="line-height: 1.8; font-size: 0.92rem; color: #334155;">
                  <div><b>ئىسىم-فامىلىسى:</b> ${order.customer?.name || 'نامەلۇم'}</div>
                  <div><b>تېلېفون:</b> <a href="tel:${order.customer?.phone}" style="color: #2563eb; font-weight: bold;" dir="ltr">${order.customer?.phone || '-'}</a></div>
                  <div><b>شەھەر:</b> ${order.customer?.city || '-'}</div>
                  <div><b>تەپسىلىي ئادرېس:</b> ${order.customer?.address || '-'}</div>
                  <div><b>چىقىم ئۇسۇلى:</b> ${order.paymentMethod || '-'}</div>
                  ${order.notes ? `<div><b>ئالاھىدە تەلەپ:</b> ${order.notes}</div>` : ''}
                </div>
              </div>

              <h3 style="margin: 0 0 0.5rem; font-size: 1.05rem; color: #0f172a;">📦 زاكاز قىلىنغان تاۋارلار:</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.25rem; font-size: 0.9rem;">
                <thead>
                  <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                    <th style="padding: 10px; text-align: right;">مەھسۇلات</th>
                    <th style="padding: 10px; text-align: center;">سانى</th>
                    <th style="padding: 10px; text-align: left;">باھاسى</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>

              <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 10px; padding: 1rem; text-align: left; margin-bottom: 1.25rem;">
                <span style="font-size: 1rem; color: #1e3a8a; font-weight: bold;">ئومۇمىي سومما: </span>
                <span style="font-size: 1.3rem; color: #2563eb; font-weight: 800;" dir="ltr">${order.totalFormatted}</span>
              </div>

              <div style="font-size: 0.82rem; color: #94a3b8; text-align: center;">
                بۇ خەت تەكلىماكان تور سودا سىستېمىسى تەرىپىدىن ئاپتوماتىك يوللاندى. ۋاقتى: ${new Date().toLocaleString()}
              </div>
            </div>
          </div>
        `;

        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            smtpHost: settings.smtpHost || 'smtp.gmail.com',
            smtpPort: settings.smtpPort || 587,
            smtpUser: settings.smtpUser,
            smtpPass: settings.smtpPass,
            fromEmail: settings.smtpUser,
            fromName: 'تەكلىماكان تور دۇكىنى',
            toEmail: targetEmail,
            subject: orderSubject,
            htmlBody: emailHtml
          })
        });
        return;
      }

      // 2. زاپاس تاللاش: FormSubmit
      let itemsListText = '';
      if (order.items && order.items.length > 0) {
        itemsListText = order.items.map((it, idx) => {
          const priceStr = it.priceFormatted || (it.price + ' TL');
          return `${idx + 1}. ${it.name} × ${it.quantity} (${priceStr})`;
        }).join(' | ');
      }

      const payload = {
        _subject: orderSubject,
        _template: 'table',
        _captcha: 'false',
        'زاكاز نومۇرى': order.id,
        'خېرىدار ئىسمى': order.customer?.name || 'نامەلۇم',
        'تېلېفون نومۇرى': order.customer?.phone || '',
        'شەھەر': order.customer?.city || '',
        'تەپسىلىي يەتكۈزۈش ئادرېسى': order.customer?.address || '',
        'چىقىم تاللانمىسى': order.paymentMethod || '',
        'ئومۇمىي سومما': order.totalFormatted,
        'سېتىۋالغان تاۋارلار': itemsListText,
        'خېرىدارنىڭ ئالاھىدە تەلىپى': order.notes || 'يوق',
        'زاكاز ۋاقتى': new Date().toLocaleString()
      };

      await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Email notification failed:', err);
    }
  }

  // ==================== 🤖 Telegram ۋاكالەتچى مەھسۇلات تاپشۇرۇش / ئۆزگەرتىش ئۇقتۇرۇشى ====================
  async function sendTelegramAgentProductNotification(agent, product, isEdit = false) {
    if (window.TeklimakanTelegram && typeof window.TeklimakanTelegram.notifyNewProduct === 'function') {
      return await window.TeklimakanTelegram.notifyNewProduct(product, agent, isEdit);
    }
    try {
      const settings = window.appStore ? window.appStore.getSettings() : null;
      if (!settings || !settings.telegramBotToken || !settings.telegramChatId || settings.telegramEnabled === false) return;

      const priceStr = window.appStore ? window.appStore.formatPrice(product.price) : (product.price + ' TL');
      const actionHeader = isEdit 
        ? `🔔 <b>ۋاكالەتچى تاۋار باھاسى / ئۇچۇرىنى ئۆزگەرتتى! (قايتا تەستىق كۈتۈۋاتىدۇ)</b>` 
        : `🔔 <b>يېڭى تاۋار تەستىقلاش ئۇقتۇرۇشى! (ۋاكالەتچى سۇندى)</b>`;

      const msg = `${actionHeader}\n\n` +
        `👤 <b>ۋاكالەتچى:</b> <b>${agent.name}</b> (<code>${agent.id}</code>)\n` +
        `📧 <b>ئېلخەت:</b> <code>${agent.email || '-'}</code>\n` +
        `📞 <b>تېلېفون:</b> <code>${agent.phone || '-'}</code>\n\n` +
        `📦 <b>مەھسۇلات نامى:</b> <b>${product.name}</b>\n` +
        `💰 <b>مال باھاسى:</b> <b>${priceStr}</b>\n` +
        `🏷️ <b>ماركىسى:</b> ${product.brand || 'تەكلىماكان'}\n` +
        `📂 <b>تۈرى:</b> ${product.category || 'ئومۇمىي'}\n` +
        `📊 <b>ئامبار زاپىسى:</b> ${product.stock || 0} دانە\n` +
        (product.description ? `📝 <b>چۈشەندۈرۈشى:</b> ${product.description.substring(0, 100)}\n` : '') +
        `\n⚠️ <b>ھالىتى:</b> ⏳ <b>تەستىق كۈتۈۋاتىدۇ (دۇكاندا كۆرۈنمەيدۇ)</b>\n` +
        `⏰ <b>تاپشۇرۇلغان ۋاقتى:</b> ${new Date().toLocaleString()}\n\n` +
        `👉 <i>ئارقا سۇپىغا كىرىپ، تاۋارلار سەھىپىسىدىن بىر كۇنۇپكا بىلەن تەستىقلاڭ ياكى رەت قىلىڭ:</i>\n` +
        `🔗 <a href="${(window.location.origin ? (window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/seidiye')) : 'https://www.teklimakan.com/seidiye')}">باشقۇرۇش مەركىزىدىن تەستىقلاش</a>`;

      await fetch(`https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.telegramChatId,
          text: msg,
          parse_mode: 'HTML'
        })
      });
    } catch (err) {
      console.warn('Agent product Telegram notification failed:', err);
    }
  }

  // ==================== 📧 Email ۋاكالەتچى تاۋار سۇنۇش / ئۆزگەرتىش ئۇقتۇرۇشى ====================
  async function sendEmailAgentProductNotification(agent, product, isEdit = false) {
    try {
      const settings = window.appStore ? window.appStore.getSettings() : null;
      if (!settings || settings.emailNotificationEnabled === false) return;
      const targetEmail = settings.notificationEmail || settings.contactEmail;
      if (!targetEmail) return;

      const priceStr = window.appStore ? window.appStore.formatPrice(product.price) : (product.price + ' TL');
      const subject = isEdit
        ? `🔔 [تەكلىماكان تەستىق] ۋاكالەتچى باھا/نام ئۆزگەرتتى: ${product.name} (${priceStr})`
        : `🔔 [تەكلىماكان تەستىق] يېڭى تاۋار سۇنۇلدى: ${product.name} (${priceStr})`;

      const payload = {
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        'ئۇچۇر تۈرى': isEdit ? 'ۋاكالەتچى تاۋار ئۇچۇرى / باھا ئۆزگەرتىش تەستىقى' : 'ۋاكالەتچى يېڭى تاۋار تاپشۇرۇش تەستىقى',
        'ۋاكالەتچى ئىسمى': agent.name,
        'ۋاكالەتچى ئېلخىتى': agent.email || '-',
        'ۋاكالەتچى تېلېفونى': agent.phone || '-',
        'مەھسۇلات نامى': product.name,
        'سېتىلىش باھاسى': priceStr,
        'مەھسۇلات ماركىسى': product.brand || 'تەكلىماكان',
        'مەھسۇلات تۈرى': product.category || 'ئومۇمىي',
        'ئامبار زاپىسى': (product.stock || 0) + ' دانە',
        'چۈشەندۈرۈشى': product.description || '-',
        'نۆۋەتتىكى ھالىتى': '⏳ تەستىق كۈتۈۋاتىدۇ (ئارقا سۇپىدىن تەستىقلاڭ)',
        'تاپشۇرۇلغان ۋاقتى': new Date().toLocaleString()
      };

      await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Agent product Email notification failed:', err);
    }
  }

  // ==================== 🚨 Telegram تاشقى ئۇلىنىش بىخەتەرلىك ئاگاھلاندۇرۇش ئۇقتۇرۇشى ====================
  async function sendTelegramLinkViolationAlert(agent, product, detectedLink, field) {
    if (window.TeklimakanTelegram && typeof window.TeklimakanTelegram.notifyLinkViolation === 'function') {
      return await window.TeklimakanTelegram.notifyLinkViolation(agent, product, detectedLink, field);
    }
    try {
      const settings = window.appStore ? window.appStore.getSettings() : null;
      if (!settings || !settings.telegramBotToken || !settings.telegramChatId || settings.telegramEnabled === false) return;

      const priceStr = window.appStore ? window.appStore.formatPrice(product.price) : (product.price + ' TL');
      const msg = `🚨 <b>[جىددىي بىخەتەرلىك ئاگاھلاندۇرۇشى: تاشقى ئۇلىنىش بايقالدى!]</b>\n\n` +
        `👤 <b>ۋاكالەتچى:</b> <b>${agent.name}</b> (<code>${agent.id}</code>)\n` +
        `📧 <b>ئېلخەت:</b> <code>${agent.email || '-'}</code>\n` +
        `📞 <b>تېلېفون:</b> <code>${agent.phone || '-'}</code>\n\n` +
        `📦 <b>مەھسۇلات:</b> <b>${product.name}</b>\n` +
        `💰 <b>باھاسى:</b> <b>${priceStr}</b>\n` +
        `🏷️ <b>ماركىسى:</b> ${product.brand || 'تەكلىماكان'}\n` +
        `🔗 <b>بايقالغان ئۇلىنىش:</b> <code>${detectedLink}</code>\n` +
        `📍 <b>بايقالغان ئورنى:</b> مەھسۇلاتنىڭ <b>${field || 'مەزمۇنىدا'}</b>\n\n` +
        `⚠️ <b>ھالىتى:</b> تاشقى ئۇلىنىش تۈپەيلى دۇكاندىن تۇتۇپ قېلىندى ھەم ۋاكالەتچىگە رەت قىلىش ئېكرانى كۆرسىتىلدى.\n` +
        `👉 <i>ئالىي باشقۇرغۇچى سۈپىتىدە، ئارقا سۇپىدىن بىر كۇنۇپكا بىلەن تەستىقلاڭ ياكى پۈتۈنلەي رەت قىلىڭ:</i>\n` +
        `🔗 <a href="${(window.location.origin ? (window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/seidiye')) : 'https://www.teklimakan.com/seidiye')}">باشقۇرۇش مەركىزىدىن بىر تەرەپ قىلىش</a>`;

      await fetch(`https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.telegramChatId,
          text: msg,
          parse_mode: 'HTML'
        })
      });
    } catch (err) {
      console.warn('Telegram link violation alert failed:', err);
    }
  }

  // ==================== 🚨 Email تاشقى ئۇلىنىش بىخەتەرلىك ئاگاھلاندۇرۇش ئۇقتۇرۇشى ====================
  async function sendEmailLinkViolationAlert(agent, product, detectedLink, field) {
    try {
      const settings = window.appStore ? window.appStore.getSettings() : null;
      if (!settings || settings.emailNotificationEnabled === false) return;
      const targetEmail = settings.notificationEmail || settings.contactEmail;
      if (!targetEmail) return;

      const priceStr = window.appStore ? window.appStore.formatPrice(product.price) : (product.price + ' TL');
      const subject = `🚨 [بىخەتەرلىك تەستىقى] تاشقى ئۇلىنىش بايقالدى: ${product.name} (${detectedLink})`;

      const payload = {
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        'ئۇچۇر تۈرى': '⚠️ تاشقى ئۇلىنىش بىخەتەرلىك ئاگاھلاندۇرۇشى (تەستىق كۈتۈۋاتىدۇ)',
        'بايقالغان ئۇلىنىش': detectedLink,
        'بايقالغان ئورنى': `مەھسۇلاتنىڭ ${field || 'مەزمۇنىدا'}`,
        'ۋاكالەتچى ئىسمى': agent.name,
        'ۋاكالەتچى كىملىكى': agent.id,
        'ۋاكالەتچى ئېلخىتى': agent.email || '-',
        'ۋاكالەتچى تېلېفونى': agent.phone || '-',
        'مەھسۇلات نامى': product.name,
        'سېتىلىش باھاسى': priceStr,
        'ھالىتى': 'مەھسۇلات دۇكاندىن تۇتۇپ قېلىندى، ئارقا سۇپىدىن تەستىقلاڭ ياكى رەت قىلىڭ',
        'ۋاقتى': new Date().toLocaleString()
      };

      await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Email link violation alert failed:', err);
    }
  }

  // ==================== 🤖 Telegram يېڭى ۋاكالەتچى تىزىملىتىش ئىلتىماسى ئۇقتۇرۇشى ====================
  async function sendTelegramAgentApplyNotification(agent) {
    if (window.TeklimakanTelegram && typeof window.TeklimakanTelegram.notifyAgentApply === 'function') {
      return await window.TeklimakanTelegram.notifyAgentApply(agent);
    }
    try {
      const settings = window.appStore ? window.appStore.getSettings() : {};
      const botToken = (settings && settings.telegramBotToken && settings.telegramBotToken.trim()) || '';
      const chatId = (settings && settings.telegramChatId && String(settings.telegramChatId).trim()) || '';
      if (!botToken || !chatId) return false;

      let cleanPhone = (agent.phone || '').replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('0')) cleanPhone = '9' + cleanPhone;
      else if (!cleanPhone.startsWith('90') && cleanPhone.length === 10) cleanPhone = '90' + cleanPhone;
      const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : '';

      let adminUrl = 'https://www.teklimakan.com/seidiye';
      if (typeof window !== 'undefined' && window.location && window.location.origin) {
        adminUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/seidiye');
      }

      let msg = `👤 <b>يېڭى ۋاكالەتچى / سودىگەر ئىلتىماسى كېلىپ چۈشتى!</b>\n\n` +
        `🆔 <b>ئىلتىماس نومۇرى:</b> <code>${agent.id}</code>\n` +
        `👤 <b>ئىسىم-فامىلىسى / شىركەت:</b> <b>${agent.name}</b>\n` +
        `📧 <b>ئېلخەت:</b> <code>${agent.email}</code>\n` +
        `📞 <b>تېلېفون:</b> <code>${agent.phone || '-'}</code>\n` +
        `🏷️ <b>تەلەپ قىلغان ماركا / تۈر:</b> ${agent.proposedBrands || 'ئومۇمىي'}\n` +
        `📦 <b>سېتىش ئۇسۇلى:</b> <b>${agent.salesMethod || 'ئۆزۈمنىڭ مەھسۇلاتى'}</b>\n` +
        (agent.notes ? `📝 <b>ئىزاھات:</b> ${agent.notes}\n` : '') +
        `\n⚠️ <b>ھالىتى:</b> ⏳ <b>تەستىق كۈتۈۋاتىدۇ</b>\n` +
        `⏰ <b>ئىلتىماس ۋاقتى:</b> ${new Date().toLocaleString()}\n\n`;

      if (waLink) {
        msg += `💬 <a href="${waLink}">📲 <b>ئىلتىماس قىلغۇچى بىلەن WhatsApp ئارقىلىق سۆزلىشىش</b></a>\n\n`;
      }

      msg += `👉 <a href="${adminUrl}">🔗 <b>ئارقا باشقۇرۇش مەركىزىدىن تەستىقلاش (بېسىڭ)</b></a>`;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: msg,
          parse_mode: 'HTML'
        })
      });
    } catch (err) {
      console.warn('Agent apply Telegram notification failed:', err);
    }
  }

  // ==================== 📧 Email يېڭى ۋاكالەتچى ئىلتىماسى ئۇقتۇرۇشى ====================
  async function sendEmailAgentApplyNotification(agent) {
    try {
      const settings = window.appStore ? window.appStore.getSettings() : null;
      if (!settings || settings.emailNotificationEnabled === false) return;
      const targetEmail = settings.notificationEmail || settings.contactEmail;
      if (!targetEmail) return;

      const payload = {
        _subject: `👤 [تەكلىماكان] يېڭى ۋاكالەتچى ئىلتىماسى: ${agent.name}`,
        _template: 'table',
        _captcha: 'false',
        'ئۇچۇر تۈرى': 'يېڭى ۋاكالەتچى تىزىملىتىش ئىلتىماسى',
        'ئىلتىماس نومۇرى': agent.id,
        'ئىسىم-فامىلىسى': agent.name,
        'ئېلخەت ئادرېسى': agent.email,
        'تېلېفون نومۇرى': agent.phone || '-',
        'سېتىش ئۇسۇلى': agent.salesMethod || 'ئۆزۈمنىڭ مەھسۇلاتى',
        'تەلەپ قىلغان ماركا / تۈر': agent.proposedBrands || 'ئومۇمىي',
        'ئىلتىماس بايانى': agent.notes || '-',
        'ھالىتى': '⏳ تەستىق كۈتۈۋاتىدۇ (ئارقا سۇپىدىن تەستىقلاڭ)',
        'ۋاقتى': new Date().toLocaleString()
      };

      await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Agent apply Email notification failed:', err);
    }
  }

  // ==================== 🔑 Email ۋاكالەتچىگە پارول قايتا بېكىتىش ئۇلانمىسى ئەۋەتىش ====================
  async function sendEmailAgentPasswordReset(agent, code, resetLink) {
    if (!agent || !agent.email) {
      console.warn('sendEmailAgentPasswordReset: No agent email found.');
      return;
    }

    try {
      const settings = window.appStore ? window.appStore.getSettings() : null;
      const agentEmail = agent.email.trim();
      const subject = `🔑 [تەكلىماكان] مەخپىي شىفىرنى قايتا بېكىتىش ئۇلانمىسى ۋە دەلىللەش كودى (${code})`;

      // 1. ئەگەر سىستېمىدا Google SMTP سەپلەنگەن بولسا
      if (settings && settings.smtpUser && settings.smtpPass) {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; max-width: 580px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 14px; background: #ffffff; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
            <div style="background: linear-gradient(135deg, #1e3a8a, #2563eb); color: #ffffff; padding: 1.5rem; border-radius: 10px; text-align: center;">
              <h2 style="margin: 0; font-size: 1.35rem;">🔑 تەكلىماكان ۋاكالەتچىلەر مەركىزى</h2>
              <p style="margin: 6px 0 0; color: #fde68a; font-weight: bold; font-size: 0.95rem;">مەخپىي شىفىرنى (پارول) قايتا بېكىتىش</p>
            </div>
            <div style="padding: 1.5rem 0.5rem;">
              <p style="font-size: 1rem; color: #0f172a; margin-top: 0;">ھۆرمەتلىك <b>${agent.name}</b> (${agent.id})،</p>
              <p style="color: #334155; line-height: 1.6; font-size: 0.95rem;">
                سىزنىڭ تەكلىماكان سۇپىسىدىكى ۋاكالەتچىلىك ھېساباتىڭىزنىڭ مەخپىي شىفىرىنى (پارول) قايتا بېكىتىش تەلىپىڭىز تاپشۇرۇۋېلىندى.
              </p>
              
              <div style="background: #eff6ff; border: 1.5px dashed #3b82f6; border-radius: 10px; padding: 1.25rem; text-align: center; margin: 1.5rem 0;">
                <span style="font-size: 0.85rem; color: #1e40af; display: block; margin-bottom: 6px; font-weight: bold;">6 خانىلىق دەلىللەش كودىڭىز:</span>
                <div style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #1d4ed8; font-family: monospace;" dir="ltr">${code}</div>
                <small style="color: #64748b; font-size: 0.78rem; display: block; margin-top: 4px;">(بۇ كود 15 مىنۇت كۈچكە ئىگە)</small>
              </div>

              <div style="text-align: center; margin: 1.75rem 0;">
                <a href="${resetLink}" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 1.05rem; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);">
                  🔗 بىۋاسىتە پارول بېكىتىش ئۇلانمىسى (بېسىڭ)
                </a>
              </div>

              <p style="font-size: 0.85rem; color: #64748b; line-height: 1.6; border-top: 1px solid #f1f5f9; padding-top: 1rem;">
                ئەگەر كۇنۇپكا بېسىلمىسا، تۆۋەندىكى ئۇلانمىنى تور كۆرگۈچىڭىزگە كۆچۈرۈپ قويۇپ ئېچىڭ:<br>
                <a href="${resetLink}" style="color: #2563eb; word-break: break-all; font-size: 0.82rem;" dir="ltr">${resetLink}</a>
              </p>

              <div style="font-size: 0.78rem; color: #94a3b8; text-align: center; margin-top: 1.5rem;">
                ئەگەر بۇ تەلەپنى سىز يوللىمىغان بولسىڭىز، بۇ خەتكە پەرۋا قىلماڭ، مەخپىي شىفىرىڭىز ئۆزگەرمەيدۇ.
              </div>
            </div>
          </div>
        `;

        try {
          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              smtpHost: settings.smtpHost || 'smtp.gmail.com',
              smtpPort: settings.smtpPort || 587,
              smtpUser: settings.smtpUser,
              smtpPass: settings.smtpPass,
              fromEmail: settings.smtpUser,
              fromName: 'تەكلىماكان ۋاكالەتچىلەر مەركىزى',
              toEmail: agentEmail,
              subject: subject,
              htmlBody: emailHtml
            })
          });
          return;
        } catch (smtpErr) {
          console.warn('SMTP password reset send failed, falling back to formsubmit:', smtpErr);
        }
      }

      // 2. FormSubmit ئارقىلىق ۋاكالەتچىنىڭ ئېلخېتىگە خەت يوللاش
      const payload = {
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        'ئۇچۇر تۈرى': 'ۋاكالەتچى مەخپىي شىفىرنى قايتا بېكىتىش',
        'ۋاكالەتچى نامى': agent.name,
        'ۋاكالەتچى كودى': agent.id,
        'تېلېفون نومۇرى': agent.phone || '-',
        '6 خانىلىق دەلىللەش كودى': code,
        'قايتا بېكىتىش ئۇلانمىسى': resetLink,
        'كۈچكە ئىگە ۋاقتى': '15 مىنۇت',
        'ئەسكەرتىش': 'يۇقىرىدىكى قايتا بېكىتىش ئۇلانمىسىنى چېكىپ ياكى دەلىللەش كودى ئارقىلىق يېڭى پارول بەلگىلەڭ.'
      };

      await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(agentEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('sendEmailAgentPasswordReset error:', err);
    }
  }

  function escapeModalHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  window.toggleSuccessOrderEdit = function(showEdit) {
    const viewEl = document.getElementById('orderSuccessCustomerView');
    const editEl = document.getElementById('orderSuccessCustomerEdit');
    if (!viewEl || !editEl) return;
    if (showEdit) {
      viewEl.style.display = 'none';
      editEl.style.display = 'block';
      const nameInput = document.getElementById('succEditName');
      if (nameInput) {
        nameInput.focus();
        nameInput.select();
      }
    } else {
      editEl.style.display = 'none';
      viewEl.style.display = 'block';
    }
  };

  window.saveSuccessOrderCustomer = function(orderId) {
    const nameInput = document.getElementById('succEditName');
    const phoneInput = document.getElementById('succEditPhone');
    const cityInput = document.getElementById('succEditCity');
    const addressInput = document.getElementById('succEditAddress');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const city = cityInput ? cityInput.value.trim() : '';
    const address = addressInput ? addressInput.value.trim() : '';

    if (!name || !phone || !address) {
      if (typeof showToast === 'function') {
        showToast('ئىسىم، تېلېفون ۋە ئادرېسنى تولۇق كىرگۈزۈڭ!', 'warning');
      } else {
        alert('ئىسىم، تېلېفون ۋە ئادرېسنى تولۇق كىرگۈزۈڭ!');
      }
      return;
    }

    if (window.appStore && typeof window.appStore.updateOrderCustomer === 'function') {
      const res = window.appStore.updateOrderCustomer(orderId, { name, phone, city, address });
      if (res && res.success) {
        const nameEl = document.getElementById('succOrderName');
        const phoneEl = document.getElementById('succOrderPhone');
        const addressEl = document.getElementById('succOrderAddress');
        if (nameEl) nameEl.textContent = name;
        if (phoneEl) phoneEl.textContent = phone;
        if (addressEl) addressEl.textContent = (city ? city + ' ' : '') + address;

        const waBtn = document.getElementById('orderSuccessWhatsAppBtn');
        if (waBtn && res.order) {
          waBtn.href = getWhatsAppOrderUrl(res.order, window.appI18n ? window.appI18n.getLang() : 'ug');
        }

        window.toggleSuccessOrderEdit(false);
        if (typeof showToast === 'function') {
          showToast('شەخسىي ئۇچۇرلىرىڭىز مۇۋەپپەقىيەتلىك يېڭىلاندى!', 'success');
        }
      } else {
        if (typeof showToast === 'function') {
          showToast(res?.message || 'ئۇچۇرنى يېڭىلاش مەغلۇپ بولدى', 'error');
        }
      }
    }
  };

  function openOrderSuccessModal(order) {
    const modal = document.getElementById('orderSuccessModal');
    const content = document.getElementById('orderSuccessModalContent');
    if (!modal || !content) return;

    const lang = window.appI18n ? window.appI18n.getLang() : 'ug';
    const isWhatsapp = (order.paymentMethod || '').includes('ۋاتساپ') || (order.paymentMethod || '').includes('WhatsApp');
    const isHavale = (order.paymentMethod || '').includes('يۆتكەش') || (order.paymentMethod || '').includes('Havale');
    const isCard = (order.paymentMethod || '').includes('كارتا') || (order.paymentMethod || '').includes('Card');
    const waUrl = isWhatsapp ? getWhatsAppOrderUrl(order, lang) : '';
    
    const havaleWaMsg = lang === 'tr' 
      ? `Merhaba Teklimakan! Sipariş Numaram: ${order.id}. Banka havalesiyle Açıklama kısmına kuruyemiş yazarak ${order.totalFormatted} tutarını gönderdim, ödeme dekontunu ekte iletiyorum.`
      : (lang === 'en'
        ? `Hello Teklimakan! My Order ID: ${order.id}. I sent ${order.totalFormatted} via bank transfer with kuruyemiş in description, here is the payment receipt.`
        : `ئەسسالامۇئەلەيكۇم تەكلىماكان! زاكاز نومۇرۇم: ${order.id}، بانكىدىن Açıklama غا kuruyemiş دەپ يېزىپ ${order.totalFormatted} پۇلنى ئەۋەتتىم، دەلىل تالونىنى يوللاۋاتىمەن.`);
    const havaleWaUrl = `https://wa.me/905551609999?text=${encodeURIComponent(havaleWaMsg)}`;

    let methodDetailsHtml = '';

    if (isCard) {
      const cardConfirmedTitle = lang === 'tr' ? '3D Secure Kart Ödemesi Onaylandı' : (lang === 'en' ? '3D Secure Card Payment Confirmed' : '3D Secure كارتا چىقىمى تەستىقلاندى');
      const cardConfirmedDesc = lang === 'tr' ? 'Ödemeniz başarıyla alındı. Resmi e-fatura adresinize gönderildi.' : (lang === 'en' ? 'Payment processed successfully. Official invoice sent to your email.' : 'پۇل بىخەتەر تۇتۇلدى. رەسمىي ئېلېكترونلۇق تالون ئېلخەتكە يوللاندى.');
      const cardAuthCode = lang === 'tr' ? 'Onay Kodu' : (lang === 'en' ? 'Auth Code' : 'تەستىق كودى');
      methodDetailsHtml = `
        <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: var(--radius-sm); padding: 0.85rem; margin-bottom: 1rem; text-align: ${lang === 'ug' ? 'right' : 'left'}; font-size: 0.86rem; color: #3730a3;">
          <div style="display: flex; align-items: center; gap: 0.4rem; font-weight: 700; margin-bottom: 0.35rem; color: #4338ca;">
            <i class="fas fa-check-circle" style="color: #10b981;"></i> ${cardConfirmedTitle}
          </div>
          <div>${cardConfirmedDesc}</div>
          <div style="margin-top: 0.4rem; font-family: monospace; font-size: 0.8rem; color: #6366f1;">${cardAuthCode}: AUTH-${Math.floor(100000 + Math.random() * 900000)}</div>
        </div>
      `;
    } else if (isHavale) {
      const havaleTitle = lang === 'tr' ? 'Ödeme Yapılacak Resmi Banka Hesabı:' : (lang === 'en' ? 'Official Receiving Bank Account:' : 'پۇل يۆتكەيدىغان رەسمىي بانكا ھېساباتى:');
      const havaleCopyText = lang === 'tr' ? 'IBAN Kopyala' : (lang === 'en' ? 'Copy IBAN' : 'IBAN كۆچۈرۈش');
      const havaleCopiedText = lang === 'tr' ? 'Kopyalandı ✓' : (lang === 'en' ? 'Copied ✓' : 'كۆچۈرۈلدى ✓');
      const havaleBankLabel = lang === 'tr' ? 'Banka:' : (lang === 'en' ? 'Bank:' : 'بانكا:');
      const havaleOwnerLabel = lang === 'tr' ? 'Hesap Sahibi:' : (lang === 'en' ? 'Account Holder:' : 'ھېسابات ئىگىسى:');
      const havaleDescLabel = lang === 'tr' ? 'Açıklama kısmına:' : (lang === 'en' ? 'In Transfer Description:' : 'Açıklama (چۈشەندۈرۈش) قىسمىغا:');
      const havaleDescSuffix = lang === 'tr' ? 'yazınız.' : (lang === 'en' ? 'please write.' : 'دەپ يېزىپ قويۇڭ.');
      const havaleWaBtnText = lang === 'tr' ? 'Dekontu WhatsApp ile Gönder' : (lang === 'en' ? 'Send Receipt via WhatsApp' : 'دەلىل / تالوننى ۋاتساپتا ئەۋەتىش');
      methodDetailsHtml = `
        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-sm); padding: 0.85rem; margin-bottom: 1rem; text-align: ${lang === 'ug' ? 'right' : 'left'}; font-size: 0.86rem; color: #166534;">
          <div style="font-weight: 700; margin-bottom: 0.4rem;"><i class="fas fa-building-columns"></i> ${havaleTitle}</div>
          <div style="background: #ffffff; border: 1px solid #bbf7d0; border-radius: 6px; padding: 0.5rem 0.75rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="font-family: monospace; font-weight: 800; font-size: 0.85rem; direction: ltr;">TR65 0015 7000 0000 0095 1544 93</span>
            <button type="button" class="btn btn-sm" onclick="navigator.clipboard.writeText('TR650015700000000095154493'); showToast('${havaleCopiedText}', 'success'); this.innerText='${havaleCopiedText}';" style="background: #166534; color: #fff; padding: 2px 8px; border: none; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">${havaleCopyText}</button>
          </div>
          <div style="font-size: 0.82rem; color: #15803d; margin-bottom: 0.6rem; line-height: 1.6;">
            <strong>${havaleBankLabel}</strong> QNB Finansbank (Enpara.com)<br>
            <strong>${havaleOwnerLabel}</strong> Abudurusuli tuniyazi<br>
            <strong>${havaleDescLabel}</strong> <span style="background: #fef08a; color: #854d0e; padding: 2px 8px; border-radius: 4px; font-weight: 800; font-size: 0.95rem;">kuruyemiş</span> ${havaleDescSuffix}
          </div>
          <a href="${havaleWaUrl}" target="_blank" class="btn btn-sm" style="display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: #059669; color: #ffffff; text-decoration: none; padding: 0.55rem; border-radius: 6px; font-weight: 700;">
            <i class="fab fa-whatsapp"></i> ${havaleWaBtnText}
          </a>
        </div>
      `;
    }

    const custName = escapeModalHtml(order.customer?.name || '');
    const custPhone = escapeModalHtml(order.customer?.phone || '');
    const custCity = escapeModalHtml(order.customer?.city || '');
    const custAddress = escapeModalHtml(order.customer?.address || '');
    const fullAddressDisplay = (custCity ? custCity + ' ' : '') + custAddress;

    const custViewTitle = lang === 'tr' ? 'Alıcı Bilgileri' : (lang === 'en' ? 'Recipient Details' : 'تاپشۇرۇۋالغۇچى ئۇچۇرلىرى');
    const custEditBtnText = lang === 'tr' ? 'Bilgileri Düzenle' : (lang === 'en' ? 'Edit Details' : 'ئۇچۇرنى ئۆزگەرتىش');
    const custEditSectionTitle = lang === 'tr' ? 'Alıcı Bilgilerini Güncelle' : (lang === 'en' ? 'Update Delivery Information' : 'شەخسىي ئۇچۇرلارنى تەھرىرلەش');
    const custOrderPrefix = lang === 'tr' ? 'Sipariş:' : (lang === 'en' ? 'Order:' : 'زاكاز:');
    const custEditNote = lang === 'tr' ? 'İsim, telefon veya adreste hata varsa aşağıdan düzenleyip <strong>"Kaydet"</strong>e tıklayınız:' : (lang === 'en' ? 'If there is any error in name, phone, or address, update below and click <strong>"Save"</strong>:' : 'ئىسىم، تېلېفون ياكى ئادرېسىڭىزدا خاتالىق بولسا تۆۋەندە تۈزىتىپ <strong>«ساقلاش»</strong> نى بېسىڭ:');
    const custEditNameLbl = lang === 'tr' ? 'Ad Soyad' : (lang === 'en' ? 'Full Name' : 'ئىسىم فامىلە');
    const custEditPhoneLbl = lang === 'tr' ? 'Telefon Numarası' : (lang === 'en' ? 'Phone Number' : 'تېلېفون نومۇرى');
    const custEditCityLbl = lang === 'tr' ? 'İl / Şehir' : (lang === 'en' ? 'City / District' : 'شەھەر / رايون');
    const custEditAddrLbl = lang === 'tr' ? 'Açık Teslimat Adresi' : (lang === 'en' ? 'Detailed Street Address' : 'تەپسىلىي يەتكۈزۈش ئادرېسى');
    const custCancelBtnText = lang === 'tr' ? 'İptal' : (lang === 'en' ? 'Cancel' : 'بىكار قىلىش');
    const custSaveBtnText = lang === 'tr' ? 'Kaydet' : (lang === 'en' ? 'Save' : 'ساقلاش');
    const printReceiptText = lang === 'tr' ? 'Siparişi Yazdır' : (lang === 'en' ? 'Print Order' : 'تالوننى بېسىپ چىقىرىش');

    const igGiftMsg = lang === 'tr' 
      ? `🎁 Tebrikler! Instagram takipçi hediyeniz (${escapeModalHtml(order.instagramUser || '@takipci')}) sipariş paketinize ücretsiz olarak eklendi!`
      : (lang === 'en'
        ? `🎁 Congratulations! Your Instagram follower gift (${escapeModalHtml(order.instagramUser || '@follower')}) has been added to your parcel for free!`
        : `🎁 تەبرىكلەيمىز! ئىنىستىگېرام ئەگەشكۈچى سوۋغىتى (${escapeModalHtml(order.instagramUser || '@ئەگەشكۈچى')}) زاكاز پوسۇلكىڭىزغا ھەقسىز قوشۇلدى!`);

    content.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.25rem;">
        <div style="width: 65px; height: 65px; background: #dcfce7; color: #166534; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 0.75rem;">
          <i class="fas fa-check"></i>
        </div>
        <h3 style="font-size: 1.4rem; font-weight: 800; color: #166534; margin-bottom: 0.35rem;">${window.appI18n.t('orderSuccessTitle')}</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem;">${window.appI18n.t('orderNumberLabel')} <strong class="number-latin" style="color: var(--primary-color);">${order.id}</strong></p>
      </div>

      <!-- خېرىدار ئۇچۇرلىرى بۆلىكى (كۆرۈش ۋە تەھرىرلەش) -->
      <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.15rem; margin-bottom: 1rem; line-height: 1.8;">
        <!-- كۆرۈش ھالىتى -->
        <div id="orderSuccessCustomerView">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.45rem;">
            <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem; display: flex; align-items: center; gap: 0.4rem;">
              <i class="fas fa-user-check" style="color: var(--primary-color);"></i>
              <span>${custViewTitle}</span>
            </div>
            <button type="button" onclick="window.toggleSuccessOrderEdit(true)" class="btn btn-sm" style="background: var(--bg-surface); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 3px 10px; border-radius: 6px; font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; font-weight: 700; transition: all 0.2s;">
              <i class="fas fa-user-edit"></i>
              <span>${custEditBtnText}</span>
            </button>
          </div>
          <div><strong>${window.appI18n.t('custName')}:</strong> <span id="succOrderName">${custName}</span></div>
          <div><strong>${window.appI18n.t('custPhone')}:</strong> <span id="succOrderPhone" class="number-latin">${custPhone}</span></div>
          <div><strong>${window.appI18n.t('custAddress')}:</strong> <span id="succOrderAddress">${fullAddressDisplay}</span></div>
          <div><strong>${window.appI18n.t('paymentMethod')}:</strong> <span style="color: ${isWhatsapp ? '#16a34a' : isCard ? '#4338ca' : '#059669'}; font-weight: 700;">${order.paymentMethod}</span></div>
          <div><strong>${window.appI18n.t('checkoutTotalLabel')}</strong> <strong style="color: var(--danger-color); font-size: 1.15rem;">${order.totalFormatted}</strong></div>
          ${order.hasInstagramGift ? `
            <div style="margin-top: 0.65rem; padding: 0.6rem 0.85rem; background: linear-gradient(45deg, #fdf2f8, #fce7f3); border: 1px dashed #f472b6; border-radius: 8px; display: flex; align-items: center; gap: 0.5rem; font-size: 0.86rem; color: #db2777; font-weight: 700;">
              <i class="fab fa-instagram" style="font-size: 1.25rem;"></i>
              <span>${igGiftMsg}</span>
            </div>
          ` : ''}
        </div>

        <!-- تەھرىرلەش ھالىتى -->
        <div id="orderSuccessCustomerEdit" style="display: none;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.45rem;">
            <div style="font-weight: 700; color: var(--primary-color); font-size: 0.95rem; display: flex; align-items: center; gap: 0.4rem;">
              <i class="fas fa-edit"></i>
              <span>${custEditSectionTitle}</span>
            </div>
            <span style="font-size: 0.78rem; color: var(--text-muted);">${custOrderPrefix} <strong class="number-latin">${order.id}</strong></span>
          </div>

          <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.65rem; line-height: 1.5;">
            ${custEditNote}
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.55rem; margin-bottom: 0.85rem;">
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.2rem; color: var(--text-main);">${custEditNameLbl} <span style="color: var(--danger-color);">*</span></label>
              <input type="text" id="succEditName" value="${custName}" class="form-input" style="width: 100%; box-sizing: border-box; font-size: 0.88rem; padding: 0.5rem 0.7rem; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-surface); color: var(--text-main);">
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.2rem; color: var(--text-main);">${custEditPhoneLbl} <span style="color: var(--danger-color);">*</span></label>
              <input type="tel" id="succEditPhone" value="${custPhone}" class="form-input number-latin" placeholder="05XXXXXXXXX" style="width: 100%; box-sizing: border-box; font-size: 0.88rem; padding: 0.5rem 0.7rem; direction: ltr; text-align: ${lang === 'ug' ? 'right' : 'left'}; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-surface); color: var(--text-main);">
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.2rem; color: var(--text-main);">${custEditCityLbl}</label>
              <input type="text" id="succEditCity" value="${custCity}" class="form-input" placeholder="İstanbul / Fatih" style="width: 100%; box-sizing: border-box; font-size: 0.88rem; padding: 0.5rem 0.7rem; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-surface); color: var(--text-main);">
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.2rem; color: var(--text-main);">${custEditAddrLbl} <span style="color: var(--danger-color);">*</span></label>
              <textarea id="succEditAddress" class="form-input" rows="2" style="width: 100%; box-sizing: border-box; font-size: 0.88rem; padding: 0.5rem 0.7rem; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-surface); color: var(--text-main); resize: vertical;">${custAddress}</textarea>
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button type="button" onclick="window.toggleSuccessOrderEdit(false)" class="btn btn-sm" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-muted); padding: 0.45rem 0.9rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">
              ${custCancelBtnText}
            </button>
            <button type="button" id="succSaveBtn" onclick="window.saveSuccessOrderCustomer('${order.id}')" class="btn btn-sm" style="background: var(--primary-color); border: none; color: #ffffff; padding: 0.45rem 1.15rem; border-radius: 6px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.85rem;">
              <i class="fas fa-save"></i>
              <span>${custSaveBtnText}</span>
            </button>
          </div>
        </div>
      </div>

      ${methodDetailsHtml}

      ${isWhatsapp ? `
        <a id="orderSuccessWhatsAppBtn" href="${waUrl}" target="_blank" class="btn-checkout" style="background: #25D366; color: #ffffff; display: flex; align-items: center; justify-content: center; gap: 0.6rem; text-decoration: none; margin-bottom: 0.85rem; font-weight: 700; box-shadow: 0 4px 12px rgba(37,211,102,0.35);">
          <i class="fab fa-whatsapp" style="font-size: 1.4rem;"></i>
          <span>${window.appI18n.t('payWhatsappBtn')}</span>
        </a>
      ` : ''}

      ${(typeof Notification !== 'undefined' && Notification.permission === 'default') ? `
        <div id="orderSuccessPushTrackCard" style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 1.5px solid #86efac; border-radius: 14px; padding: 14px 16px; margin-bottom: 1rem; text-align: center; box-shadow: 0 4px 12px rgba(22,163,74,0.12);">
          <div style="font-weight: 800; color: #166534; font-size: 0.95rem; margin-bottom: 4px; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <i class="fas fa-truck-fast"></i> <span>${(window.appI18n && window.appI18n.getLang() === 'tr') ? 'Kargo ve Teslimat Bildirimlerini Açın' : ((window.appI18n && window.appI18n.getLang() === 'en') ? 'Enable Cargo Tracking Alerts' : 'زاكازىڭىز كارگوغا بېرىلگەندە ئەسكەرتىش كېلەمدۇ؟')}</span>
          </div>
          <p style="font-size: 0.84rem; color: #475569; margin: 0 0 10px 0; line-height: 1.45;">
            ${(window.appI18n && window.appI18n.getLang() === 'tr') ? 'Siparişiniz yola çıktığında ve teslim edildiğinde telefonunuza anında bildirim gelsin.' : ((window.appI18n && window.appI18n.getLang() === 'en') ? 'Get real-time updates directly on your phone when your package ships.' : 'مال يولغا چىققاندا ياكى كېچىككەندە تېلېفونىڭىزدا بىۋاسىتە ئۇقتۇرۇش چىقىدۇ.')}
          </p>
          <button type="button" onclick="if(window.TeklimakanPush) window.TeklimakanPush.triggerOrderTrackingPrompt(); document.getElementById('orderSuccessPushTrackCard')?.remove();" style="background: #16a34a; color: #ffffff; border: none; border-radius: 10px; padding: 9px 22px; font-weight: 800; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 12px rgba(22,163,74,0.3); display: inline-flex; align-items: center; gap: 6px;">
            <i class="fas fa-bell"></i> <span>${(window.appI18n && window.appI18n.getLang() === 'tr') ? '📦 Bildirimi Aç' : ((window.appI18n && window.appI18n.getLang() === 'en') ? '📦 Enable Alerts' : '📦 يەتكۈزۈش ئەسكەرتىشىنى قوزغىتىش')}</span>
          </button>
        </div>
      ` : ''}

      <div style="display: flex; gap: 0.6rem;">
        <button type="button" class="btn-checkout" onclick="window.print()" style="flex: 1; margin-top: 0; background: var(--bg-surface); color: var(--text-main); border: 1px solid var(--border-color);">
          <i class="fas fa-print"></i> <span>${printReceiptText}</span>
        </button>
        <button type="button" class="btn-checkout" onclick="document.getElementById('orderSuccessModal').classList.remove('active')" style="flex: 1.2; margin-top: 0; background: var(--primary-color); color: #ffffff;">
          ${window.appI18n.t('continueShopping')}
        </button>
      </div>
    `;

    modal.classList.add('active');
  }

  function initHeroSlider(forcedLang = null) {
    const container = document.querySelector('.hero-slider-container');
    if (!container) return;

    const currentLang = forcedLang || (window.appI18n ? window.appI18n.getLang() : 'ug');

    if (window.appStore && typeof window.appStore.getHeroSlides === 'function') {
      const allSlides = window.appStore.getHeroSlides(currentLang);
      const activeSlides = (allSlides || []).filter(s => s && s.enabled !== false);
      const currentKey = `${currentLang}_${activeSlides.length}_${activeSlides.map(s => s.id + (s.title || '')).join('|')}`;

      // Only rebuild DOM if the slides or language actually changed!
      if (activeSlides.length > 0 && currentKey !== _lastHeroSlidesRenderKey) {
        _lastHeroSlidesRenderKey = currentKey;
        const slidesHtml = activeSlides.map((s, idx) => `
          <div class="hero-slide ${idx === _heroSliderCurrentIdx ? 'active' : ''}" style="background-image: url('${s.image || "images/hero_dried_fruits.jpg"}');">
            <div class="hero-slide-overlay"></div>
            <div class="hero-content">
              <span class="hero-tag" style="background: ${s.tagColor || '#f59e0b'};">${s.tag || ''}</span>
              <h1 class="hero-title">${s.title || ''}</h1>
              <p class="hero-subtitle">${s.subtitle || s.desc || ''}</p>
              <a href="${s.btnLink || '#catalogSection'}" class="hero-btn" style="background: ${s.tagColor || '#f59e0b'};">
                <span>${s.btnText || (currentLang === 'tr' ? 'Hemen İncele ve Satın Al' : (currentLang === 'en' ? 'Shop Now' : 'ھازىرلا كۆرۈپ سېتىۋېلىش'))}</span>
                <i class="fas fa-arrow-left"></i>
              </a>
            </div>
          </div>
        `).join('');

        const dotsHtml = `
          <div class="hero-nav-dots">
            ${activeSlides.map((_, idx) => `
              <div class="dot-indicator ${idx === _heroSliderCurrentIdx ? 'active' : ''}" title="${idx + 1}-ئېلان" onclick="window.goToHeroSlide(${idx})"></div>
            `).join('')}
          </div>
        `;

        container.innerHTML = slidesHtml + dotsHtml;
      }
    }

    const slides = container.querySelectorAll('.hero-slide');
    const dots = container.querySelectorAll('.dot-indicator');
    if (slides.length <= 1) return;

    if (_heroSliderCurrentIdx >= slides.length) _heroSliderCurrentIdx = 0;

    function activateSlide(index) {
      const curSlides = container.querySelectorAll('.hero-slide');
      const curDots = container.querySelectorAll('.dot-indicator');
      if (curSlides[_heroSliderCurrentIdx]) curSlides[_heroSliderCurrentIdx].classList.remove('active');
      if (curDots[_heroSliderCurrentIdx]) curDots[_heroSliderCurrentIdx].classList.remove('active');
      _heroSliderCurrentIdx = (index + curSlides.length) % curSlides.length;
      if (curSlides[_heroSliderCurrentIdx]) curSlides[_heroSliderCurrentIdx].classList.add('active');
      if (curDots[_heroSliderCurrentIdx]) curDots[_heroSliderCurrentIdx].classList.add('active');
    }

    function startAutoRotation() {
      if (heroSliderTimer) clearInterval(heroSliderTimer);
      heroSliderTimer = setInterval(() => {
        activateSlide(_heroSliderCurrentIdx + 1);
      }, 4500);
    }

    dots.forEach((dot, idx) => {
      dot.onclick = (e) => {
        if (e) e.stopPropagation();
        activateSlide(idx);
        startAutoRotation();
      };
    });

    window.nextHeroSlide = () => { activateSlide(_heroSliderCurrentIdx + 1); startAutoRotation(); };
    window.prevHeroSlide = () => { activateSlide(_heroSliderCurrentIdx - 1); startAutoRotation(); };
    window.goToHeroSlide = (idx) => { activateSlide(idx); startAutoRotation(); };

    // Hover handling with auto-resume so it never freezes
    container.onmouseenter = () => {
      if (heroSliderTimer) clearInterval(heroSliderTimer);
      if (heroSliderHoverTimeout) clearTimeout(heroSliderHoverTimeout);
      heroSliderHoverTimeout = setTimeout(() => {
        startAutoRotation();
      }, 5000);
    };
    container.onmouseleave = () => {
      if (heroSliderHoverTimeout) clearTimeout(heroSliderHoverTimeout);
      startAutoRotation();
    };

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    container.ontouchstart = (e) => {
      if (e.touches && e.touches[0]) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
      if (heroSliderTimer) clearInterval(heroSliderTimer);
    };
    container.ontouchend = (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        const diffX = e.changedTouches[0].clientX - touchStartX;
        const diffY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
          const isRtl = window.appI18n ? window.appI18n.isRTL() : true;
          if (diffX > 0) {
            isRtl ? window.nextHeroSlide() : window.prevHeroSlide();
          } else {
            isRtl ? window.prevHeroSlide() : window.nextHeroSlide();
          }
        }
      }
      startAutoRotation();
    };

    startAutoRotation();
  }

  // تەشۋىقات تاختىسى ۋە سىيرىلما بۆلەكلەر ماسقەدەملەش تىڭشىغۇچى (Store Sync Listener)
  window.addEventListener('uyghur_store_sync', (e) => {
    if (e.detail && e.detail.type === 'heroSlides') {
      try { initHeroSlider(); } catch (err) {}
    }
    if (e.detail && (e.detail.type === 'showcaseShelves' || e.detail.type === 'products' || e.detail.type === 'all')) {
      try { renderShowcaseShelves(); } catch (err) {}
    }
    if (e.detail && (e.detail.type === 'charityFund' || e.detail.type === 'settings' || e.detail.type === 'all')) {
      try { renderCharityTrustBanner(); } catch (err) {}
      try { renderMarqueeTicker(); } catch (err) {}
    }
  });

  // ==================== 🤝 تەكلىماكان خەير-ساخاۋەت فوندى كۆرۈنۈشى (Charity Fund 5% Frontend) ====================
  function renderCharityTrustBanner() {
    const noticeBar = document.getElementById('footerCharityNoticeBar');
    const titleEl = document.getElementById('footerCharityTitle');
    const descEl = document.getElementById('footerCharityDesc');
    const btnEl = document.getElementById('footerCharityBtn');

    const lang = window.appI18n ? window.appI18n.getLang() : 'ug';
    const charityCfg = (window.appStore && typeof window.appStore.getCharityFundConfig === 'function')
      ? window.appStore.getCharityFundConfig()
      : { enabled: true, name: 'تەكلىماكان فوندى', percentage: 5, url: 'https://www.seidiye.com/category/mihri/' };

    // پەقەتلا ئۇيغۇرچە بەتتە كۆرۈنسۇن باشقا بەتتە ھازىرچە كۆرۈنمىسۇن!
    if (lang !== 'ug' || charityCfg.enabled === false) {
      if (noticeBar) noticeBar.style.display = 'none';
      return;
    }

    const fundUrl = charityCfg.url || 'https://www.seidiye.com/category/mihri/';
    const fundName = charityCfg.name || 'تەكلىماكان فوندى';
    const fundPct = charityCfg.percentage !== undefined ? charityCfg.percentage : 5;
    const fundDesc = charityCfg.description || 'سۇپىمىزدىن سېتىۋېلىنغان ھەربىر تاۋارنىڭ %5 قىممىتى ئېھتىياجلىق قېرىنداشلىرىمىزغا ياردەم بېرىش ئۈچۈن «تەكلىماكان فوندى» ھېسابىغا ئاجرىتىلىدۇ.';

    if (noticeBar) {
      if (titleEl) titleEl.textContent = `«${fundName}» — خەير-ساخاۋەت ئەھدىسى (%${fundPct})`;
      if (descEl) descEl.textContent = fundDesc;
      if (btnEl) btnEl.href = fundUrl;
      noticeBar.style.display = 'block';
    }
  }
  window.renderCharityTrustBanner = renderCharityTrustBanner;

  // ==================== 🛍️ زامانىۋى ئۇپۇق سىيرىلما تاۋار راكلىرى (Showcase Shelves) ====================
  function renderShowcaseShelves(forcedLang = null) {
    try {
      renderProducts();
    } catch (e) {
      console.error('Error in renderShowcaseShelves:', e);
    }
  }
  window.renderShowcaseShelves = renderShowcaseShelves;

  // ==================== 📸 ئەقلىي Instagram ئەپ ئۇلىنىشى ۋە قايتا نىشانلاش سىستېمىسى (Smart Instagram Deep-Link & Meta Retargeting) ====================
  function openInstagramProfile(contextUrl = null, source = 'general') {
    const pageUrl = contextUrl || window.location.href;
    const pageTitle = document.title || 'تەكلىماكان سودا تورى';
    const username = 'teklimakancom';
    const webUrl = 'https://www.instagram.com/' + username;
    const appUrl = 'instagram://user?username=' + username;

    // 🎯 1. Meta (Facebook & Instagram) Pixel ئارقىلىق خاس پائالىيەتنى ئىز قوغلاش
    try {
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'InstagramFollowClick', {
          page_url: pageUrl,
          page_title: pageTitle,
          source: source,
          username: username,
          timestamp: new Date().toISOString()
        });
      }
    } catch (e) {
      console.warn('Meta Pixel trackCustom error:', e);
    }

    try {
      localStorage.setItem('teklimakan_user_clicked_instagram', 'true');
      localStorage.setItem('teklimakan_insta_prompt_dismissed', String(Date.now() + 14 * 86400000));
    } catch (e) {}

    // 📱 2. تېلېفوندا رەسمىي Instagram ئەپىنى بىۋاسىتە قوزغىتىش (Deep-Link)
    const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      const start = Date.now();
      window.location.href = appUrl;

      // ئەگەر ئەپ تېلېفوندا قاچىلانمىغان بولسا، 1.2 سېكۇنتتىن كېيىن تور كۆرگۈچكە راۋان يۆتكەش
      setTimeout(() => {
        if (Date.now() - start < 1800) {
          window.open(webUrl, '_blank', 'noopener,noreferrer');
        }
      }, 1200);
    } else {
      window.open(webUrl, '_blank', 'noopener,noreferrer');
    }
  }
  window.openInstagramProfile = openInstagramProfile;

  // بارلىق بېكەت ئىچىدىكى Instagram ئۇلانمىلىرىنى ئەقلىي قوزغاتقۇچ بىلەن تۇتاشتۇرۇش
  function bindInstagramSmartLinks() {
    document.querySelectorAll('a[href*="instagram.com"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openInstagramProfile(window.location.href, 'page_link');
      });
    });
  }


  // ==================== 🚀 ئايلانما ئېلان تاختىسى سۈكۈتتىكى تەبىئىي ھالىتى (Default Natural Flow) ====================
  function initSmartHeroScroll() {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.classList.remove('smart-floating-hero', 'sticky-mini-hero', 'reveal-active', 'reveal-hidden');
    }
    const spacer = document.getElementById('heroSectionSpacer');
    if (spacer) spacer.remove();
    const closeBtn = document.querySelector('.hero-sticky-close-btn');
    if (closeBtn) closeBtn.remove();
  }

  // ==================== 💎 سۈرۈش تاياقچىسى بىلەن بىر گەۋدە ئەقىللىق تېز سۈرۈش (Integrated Smart Edge Scrollbar) ====================
  function initSmartScrollToggle() {
    window.scrollToTop = function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.scrollToBottom = function() {
      const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      const winHeight = window.innerHeight;
      window.scrollTo({ top: docHeight - winHeight, behavior: 'smooth' });
    };

    const track = document.getElementById('smartEdgeScrollTrack');
    const thumb = document.getElementById('smartEdgeScrollThumb');

    if (!track || !thumb) return;

    let isTicking = false;

    function updateEdgeScroll() {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      const winHeight = window.innerHeight;
      const maxScroll = Math.max(1, docHeight - winHeight);

      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

      const trackHeight = track.offsetHeight;
      const thumbHeight = thumb.offsetHeight;
      const maxTranslate = Math.max(0, trackHeight - thumbHeight);
      const translateY = progress * maxTranslate;
      thumb.style.transform = `translateY(${translateY}px)`;

      if (scrollY <= 180) {
        track.classList.add('at-top');
        track.title = 'بىر چېكىپ ئەڭ ئاستىغا چۈشۈش';
      } else {
        track.classList.remove('at-top');
        track.title = 'بىر چېكىپ ئەڭ ئۈستىگە چىقىش';
      }

      isTicking = false;
    }

    function handleEdgeClick(e) {
      e.stopPropagation();
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      if (scrollY > 200) {
        window.scrollToTop();
      } else {
        window.scrollToBottom();
      }
    }

    track.addEventListener('click', handleEdgeClick);

    let scrollTimeout = null;
    window.addEventListener('scroll', () => {
      track.classList.add('is-scrolling');
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        track.classList.remove('is-scrolling');
      }, 1200);

      if (!isTicking) {
        window.requestAnimationFrame(updateEdgeScroll);
        isTicking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', updateEdgeScroll, { passive: true });
    updateEdgeScroll();
  }



  // ==================== 🤝 ۋاكالەتچى ۋە سودىگەرلەر مەركىزى ====================
  function renderAgentPortalModal(lang = 'ug') {
    const modal = document.getElementById('agentPortalModal');
    if (!modal) return;

    const i18n = window.appI18n;
    const isUg = lang === 'ug';
    const isTr = lang === 'tr';

    const apTitle = document.getElementById('agentPortalTitle');
    if (apTitle) apTitle.textContent = (i18n && typeof i18n.t === 'function' ? i18n.t('agentModalTitle') : '') || 'تەكلىماكان سودىگەر ۋە ۋاكالەتچى مەركىزى';
    const apSub = document.getElementById('agentPortalSubtitle');
    if (apSub) apSub.textContent = (i18n && typeof i18n.t === 'function' ? i18n.t('agentModalSubtitle') : '') || 'ھەمكارلاشقۇچى سودىگەرلەرنىڭ تىزىملىتىش، كىرىش ۋە تاۋار سۇنۇش سۇپىسى';
    const tab1 = document.getElementById('agentTab1Text');
    if (tab1) tab1.textContent = (i18n && typeof i18n.t === 'function' ? i18n.t('agentTabApply') : '') || '1. سودىگەر بولۇپ تىزىملىتىش';
    const tab2 = document.getElementById('agentTab2Text');
    if (tab2) tab2.textContent = (i18n && typeof i18n.t === 'function' ? i18n.t('agentTabSubmit') : '') || '2. كىرىش ۋە تاۋار سۇنۇش';

    const setPlaceholder = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.placeholder = text;
    };

    if (isTr) {
      const applyNotice = modal.querySelector('#agentApplyPane > div');
      if (applyNotice) {
        applyNotice.innerHTML = '<i class="fas fa-info-circle"></i> <strong>Platformumuza Hoş Geldiniz!</strong> Uygur tıbbı, doğal şifalı ürünler, gül reçeli, kurutulmuş meyveler veya diğer seçkin yöresel ürünleri platformumuzda satmak istiyorsanız lütfen aşağıdaki formu doldurunuz. Yönetim onayından sonra satış ve marka yetkisi verilecektir.';
      }
      setPlaceholder('applyAgentName', 'Örn: Alijan Rozi veya Turpan Doğal Ürünler');
      setPlaceholder('applyAgentCategory', 'Örn: Uygur Tıbbı, Bitkisel İlaçlar, Kuru Meyve...');
      setPlaceholder('applyAgentNotes', 'Ürün kaynağı, deneyiminiz veya mağazanız hakkında kısa bilgi...');

      const submitApplyBtn = modal.querySelector('#agentApplyForm button[type="submit"]');
      if (submitApplyBtn) submitApplyBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Temsilcilik Başvurusunu Gönder';

      const verifyTitle = modal.querySelector('#agentVerifyWrap h5');
      if (verifyTitle) verifyTitle.innerHTML = '<i class="fas fa-id-card" style="color: var(--primary-color);"></i> Temsilci Kimliğini Doğrulama:';
      const verifyDesc = modal.querySelector('#agentVerifyWrap p');
      if (verifyDesc) verifyDesc.textContent = 'Platformda onaylanmış e-posta, telefon veya temsilci kodunuzu (AGT-xxx) giriniz.';
      setPlaceholder('agentLoginInput', 'E-posta veya telefon (Örn: 05551609999 veya alijan@teklimakan.com)...');
      const btnVerify = document.getElementById('btnVerifyAgentLogin');
      if (btnVerify) btnVerify.innerHTML = '<i class="fas fa-search"></i> Doğrula';

      const myProdTitle = modal.querySelector('#agentMyProductsWrap h5');
      if (myProdTitle) myProdTitle.innerHTML = '<i class="fas fa-boxes" style="color: #3b82f6;"></i> Ürünlerim (Düzenleme / Fiyat Güncelleme):';
      const btnAddNew = document.getElementById('btnAgentAddNewProductMode');
      if (btnAddNew) btnAddNew.innerHTML = '<i class="fas fa-plus-circle"></i> + Yeni Ürün Ekle';

      setPlaceholder('agentProdName', 'Örn: Doğal Turpan Siyah Kuşüzümü 1000g');
      const btnSelectFile = modal.querySelector('label[for="agentFileInput"] span');
      if (btnSelectFile) btnSelectFile.textContent = 'Telefondan Fotoğraf Seç';
      setPlaceholder('agentProdImage', 'Veya görsel internet bağlantısını girin: https://...');
      setPlaceholder('agentProdDesc', 'Ürünün özellikleri, içeriği ve kullanım bilgisi...');

      const submitProdBtnText = document.getElementById('agentSubmitBtnText');
      if (submitProdBtnText) submitProdBtnText.textContent = 'Ürünü Onaya Gönder';
    } else if (!isUg) {
      const applyNotice = modal.querySelector('#agentApplyPane > div');
      if (applyNotice) {
        applyNotice.innerHTML = '<i class="fas fa-info-circle"></i> <strong>Welcome to Our Platform!</strong> If you wish to sell authentic remedies, rose preserves, herbal oils, or premium heritage products, please submit the application below. Vendor authorization will be granted after review.';
      }
      setPlaceholder('applyAgentName', 'E.g. Alijan Rozi or Turpan Heritage Goods');
      setPlaceholder('applyAgentCategory', 'E.g. Herbal Remedies, Rose Preserves, Dried Fruits...');
      setPlaceholder('applyAgentNotes', 'Product origins, your background, or store introduction...');
      const submitApplyBtn = modal.querySelector('#agentApplyForm button[type="submit"]');
      if (submitApplyBtn) submitApplyBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Application';

      const verifyTitle = modal.querySelector('#agentVerifyWrap h5');
      if (verifyTitle) verifyTitle.innerHTML = '<i class="fas fa-id-card" style="color: var(--primary-color);"></i> Verify Vendor Identity:';
      const verifyDesc = modal.querySelector('#agentVerifyWrap p');
      if (verifyDesc) verifyDesc.textContent = 'Enter your approved email, phone number, or vendor ID (AGT-xxx).';
      setPlaceholder('agentLoginInput', 'Email or phone (e.g. 05551609999 or alijan@teklimakan.com)...');
      const btnVerify = document.getElementById('btnVerifyAgentLogin');
      if (btnVerify) btnVerify.innerHTML = '<i class="fas fa-search"></i> Verify';

      const myProdTitle = modal.querySelector('#agentMyProductsWrap h5');
      if (myProdTitle) myProdTitle.innerHTML = '<i class="fas fa-boxes" style="color: #3b82f6;"></i> My Listed Products (Edit / Price Update):';
      const btnAddNew = document.getElementById('btnAgentAddNewProductMode');
      if (btnAddNew) btnAddNew.innerHTML = '<i class="fas fa-plus-circle"></i> + Add New Product';

      setPlaceholder('agentProdName', 'E.g. Organic Turpan Black Seedless Raisins 1000g');
      const btnSelectFile = modal.querySelector('label[for="agentFileInput"] span');
      if (btnSelectFile) btnSelectFile.textContent = 'Select Photo from Device';
      setPlaceholder('agentProdImage', 'Or enter image web URL: https://...');
      setPlaceholder('agentProdDesc', 'Product highlights, ingredients, and usage instructions...');

      const submitProdBtnText = document.getElementById('agentSubmitBtnText');
      if (submitProdBtnText) submitProdBtnText.textContent = 'Submit for Approval';
    }
  }

  function renderLinkViolationModal(lang = 'ug', violationType = 'link', violData = {}) {
    const modal = document.getElementById('linkViolationModal');
    if (!modal) return;
    const title = document.getElementById('linkViolationModalTitle') || modal.querySelector('h3');
    const label = document.getElementById('linkViolationLabel');
    const desc = document.getElementById('linkViolationDescText');
    const closeBtn = document.getElementById('btnCloseLinkViolationModal');

    const vCount = violData.violationsCount || 1;
    const sDays = violData.suspendedDays || vCount;
    const untilStr = violData.suspendedUntil 
      ? new Date(violData.suspendedUntil).toLocaleString('ug-CN', { dateStyle: 'medium', timeStyle: 'short' }) 
      : '';

    if (lang === 'tr') {
      if (title) title.textContent = violationType === 'phone' ? 'Telefon Numarası Eklemek Yasaktır!' : 'Harici Bağlantı Filtresi Tarafından Reddedildi!';
      if (label) label.textContent = violationType === 'phone' ? 'Tespit Edilen Telefon / İletişim:' : 'Tespit Edilen Bağlantı / Adres:';
      if (desc) desc.innerHTML = `⚠️ <strong>Sayın Satış Temsilcisi:</strong> Platform güvenlik kuralları gereğince ürün içeriğinde telefon numarası veya harici bağlantı paylaşmak kesinlikle yasaktır! <strong>${vCount}. ihlaliniz nedeniyle hesabınız ${sDays} gün boyunca askıya alınmıştır</strong> (Bitiş: ${untilStr}). Süre dolana kadar veya yönetici engeli kaldırana kadar işlem yapamazsınız.`;
      if (closeBtn) closeBtn.innerHTML = '<i class="fas fa-check"></i> Anladım, Düzenleyeceğim';
    } else if (lang === 'en') {
      if (title) title.textContent = violationType === 'phone' ? 'Phone Numbers Are Strictly Prohibited!' : 'Blocked by Security Filter!';
      if (label) label.textContent = violationType === 'phone' ? 'Detected Phone / Contact Number:' : 'Detected URL / Domain:';
      if (desc) desc.innerHTML = `⚠️ <strong>Dear Vendor Partner:</strong> According to platform policy, writing phone numbers or external URLs in products is strictly prohibited! <strong>Due to violation #${vCount}, your account has been automatically suspended for ${sDays} day(s)</strong> (Until: ${untilStr}).`;
      if (closeBtn) closeBtn.innerHTML = '<i class="fas fa-check"></i> Understood, Edit Now';
    } else {
      if (title) title.textContent = violationType === 'phone' ? 'تېلېفون نومۇرى يېزىش چەكلەندى!' : 'تاشقى ئۇلىنىش ۋە تور ئادرېسى چەكلەندى!';
      if (label) label.textContent = violationType === 'phone' ? 'بايقالغان تېلېفون نومۇرى:' : 'بايقالغان ئۇلانما / تور ئادرېسى:';
      if (desc) desc.innerHTML = `
        <div style="margin-bottom: 0.5rem; color: #991b1b; font-weight: 800; font-size: 0.95rem;">
          ⛔ بۇ سىزنىڭ ${vCount}-قېتىملىق خىلاپلىقىڭىز بولۇپ، ھېساباتىڭىز ${sDays} كۈن بارلىق مەشغۇلاتتىن ئاپتوماتىك توختىتىلدى!
        </div>
        <div style="margin-bottom: 0.5rem; background: #fff1f2; border: 1px solid #fecdd3; padding: 0.45rem 0.65rem; border-radius: 6px; font-size: 0.82rem; color: #be123c;">
          ⏳ <strong>توختاش ئاخىرلىشىش ۋاقتى:</strong> <span class="number-latin">${untilStr}</span><br>
          📌 <strong>جازا بەلگىلىمىسى:</strong> 1-قېتىمدا 1 كۈن، 2-قېتىمدا 2 كۈن، 3-قېتىمدا 3 كۈن... بارلىق مەشغۇلات تاقىلىدۇ. تاكى سۇپا باشقۇرغۇچىسى چەكلەشنى بالدۇرراق ئەمەلدىن قالدۇرغانغا قەدەر ياكى كۈن سانى تۈگىگىچە تاۋار يوللىيالمايسىز.
        </div>
        <div style="font-size: 0.82rem; color: #475569;">
          ⚠️ سۇپا بىخەتەرلىك بەلگىلىمىسى بويىچە، مەھسۇلات نامى، چۈشەندۈرۈشى، تۈرى ياكى سۈرىتى ئىچىگە ھەرقانداق تېلېفون نومۇرى ياكى تاشقى تور ئۇلانمىسى يېزىش قەتئىي مەنئى قىلىنىدۇ.
        </div>
      `;
      if (closeBtn) closeBtn.innerHTML = '<i class="fas fa-check"></i> چۈشەندىم، ئۆزگەرتىمەن';
    }
  }

  function initAgentPortal() {
    const modal = document.getElementById('agentPortalModal');
    if (!modal) return;

    const btnOpenFooter = document.getElementById('btnOpenAgentPortalFooter');
    const btnOpenMerchantFooter = document.getElementById('btnOpenMerchantApplyFooter');
    const fLinkAgentPortal = document.getElementById('fLinkAgentPortal');
    const fLinkMerch = document.getElementById('fLinkMerchants');
    const btnClose = document.getElementById('btnCloseAgentPortalModal');

    const tabBtnApply = document.getElementById('tabBtnAgentApply');
    const tabBtnSubmit = document.getElementById('tabBtnAgentSubmit');
    const paneApply = document.getElementById('agentApplyPane');
    const paneSubmit = document.getElementById('agentSubmitPane');

    function openModal(defaultTab = 'apply') {
      const currentL = window.appI18n ? window.appI18n.getLang() : 'ug';
      if (currentL !== 'ug') return; // پەقەتلا ئۇيغۇرچە بەتتە كۆرۈنسۇن
      try {
        renderAgentPortalModal(currentL);
      } catch (err) {
        console.warn('renderAgentPortalModal error:', err);
      }
      modal.classList.add('active');
      modal.style.display = 'flex';
      switchTab(defaultTab);
    }

    function closeModal() {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }

    function switchTab(tab) {
      if (tab === 'apply') {
        tabBtnApply.classList.add('active');
        tabBtnApply.style.color = 'var(--primary-color)';
        tabBtnApply.style.borderBottom = '3px solid var(--primary-color)';
        tabBtnApply.style.fontWeight = '800';

        tabBtnSubmit.classList.remove('active');
        tabBtnSubmit.style.color = 'var(--text-muted)';
        tabBtnSubmit.style.borderBottom = '3px solid transparent';
        tabBtnSubmit.style.fontWeight = '700';

        paneApply.style.display = 'block';
        paneSubmit.style.display = 'none';
      } else {
        tabBtnSubmit.classList.add('active');
        tabBtnSubmit.style.color = 'var(--primary-color)';
        tabBtnSubmit.style.borderBottom = '3px solid var(--primary-color)';
        tabBtnSubmit.style.fontWeight = '800';

        tabBtnApply.classList.remove('active');
        tabBtnApply.style.color = 'var(--text-muted)';
        tabBtnApply.style.borderBottom = '3px solid transparent';
        tabBtnApply.style.fontWeight = '700';

        paneApply.style.display = 'none';
        paneSubmit.style.display = 'block';
        if (typeof checkAgentSession === 'function') {
          checkAgentSession();
        }
      }
    }

    const handleOpenModal = (e) => {
      if (e && e.preventDefault) e.preventDefault();
      openModal('apply');
    };
    const handleOpenSubmit = (e) => {
      if (e && e.preventDefault) e.preventDefault();
      openModal('submit');
    };
    const handleOpenCombinedPortal = (e) => {
      if (e && e.preventDefault) e.preventDefault();
      try {
        const saved = JSON.parse(localStorage.getItem('teklimakan_agent_session') || 'null');
        if (saved && saved.id) {
          openModal('submit');
          return;
        }
      } catch(err) {}
      openModal('apply');
    };

    const btnOpenNav = document.getElementById('agentPortalNavBtn');
    if (btnOpenNav) btnOpenNav.addEventListener('click', handleOpenCombinedPortal);
    if (btnOpenFooter) btnOpenFooter.addEventListener('click', handleOpenCombinedPortal);
    if (fLinkAgentPortal) fLinkAgentPortal.addEventListener('click', handleOpenCombinedPortal);
    if (btnClose) btnClose.addEventListener('click', closeModal);

    window.openAgentPortalModal = openModal;
    window.closeAgentPortalModal = closeModal;

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    if (tabBtnApply) tabBtnApply.addEventListener('click', () => switchTab('apply'));
    if (tabBtnSubmit) tabBtnSubmit.addEventListener('click', () => switchTab('submit'));

    // 🔗 دوستانە ئۇلىنىشلار كۆزنىكىنى كونترول قىلىش (Friendly Links Modal)
    const friendlyModal = document.getElementById('friendlyLinksModal');
    function openFriendlyModal() {
      if (friendlyModal) {
        friendlyModal.classList.add('active');
        friendlyModal.style.display = 'flex';
      }
    }
    function closeFriendlyModal() {
      if (friendlyModal) {
        friendlyModal.classList.remove('active');
        friendlyModal.style.display = 'none';
      }
    }
    window.openFriendlyLinksModal = openFriendlyModal;
    window.closeFriendlyLinksModal = closeFriendlyModal;

    const btnOpenFriendlyFooter = document.getElementById('btnOpenFriendlyLinksFooter');
    if (btnOpenFriendlyFooter) {
      btnOpenFriendlyFooter.addEventListener('click', (e) => {
        if (e && e.preventDefault) e.preventDefault();
        openFriendlyModal();
      });
    }
    const btnCloseFriendly = document.getElementById('btnCloseFriendlyLinksModal');
    if (btnCloseFriendly) {
      btnCloseFriendly.addEventListener('click', closeFriendlyModal);
    }
    if (friendlyModal) {
      friendlyModal.addEventListener('click', (e) => {
        if (e.target === friendlyModal) closeFriendlyModal();
      });
    }

    // 🌿 ئۇيغۇر تىبابىتى ئۇلىنىشى — نۆۋەتتىكى تىلغا ئاساسەن تور بەتكە كىرىش
    const btnMedFooter = document.getElementById('btnUyghurMedicineFooter');
    if (btnMedFooter) {
      btnMedFooter.addEventListener('click', (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const curL = window.appI18n ? window.appI18n.getLang() : 'ug';
        const targetUrl = (curL === 'tr' || curL === 'en') ? 'https://www.uyghurmedicine.com/tr' : 'https://www.uyghurmedicine.com';
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      });
    }

    // 1. ۋاكالەتچى بولۇش ئىلتىماسى سۇنۇش جەدۋىلى
    const applyForm = document.getElementById('agentApplyForm');
    const successBox = document.getElementById('applyAgentSuccessBox');
    const successMsg = document.getElementById('applyAgentSuccessMsg');

    let lastAppliedAgentObj = null;

    // ئىلتىماس سۇنۇشتىن بۇرۇن كېلىشىمنامىنى تېلېفونغا چۈشۈرۈش
    const btnDownloadBefore = document.getElementById('btnDownloadContractBeforeApply');
    if (btnDownloadBefore) {
      btnDownloadBefore.addEventListener('click', () => {
        const name = document.getElementById('applyAgentName')?.value.trim() || 'ئىلتىماس_قىلغۇچى_ۋاكالەتچى';
        const email = document.getElementById('applyAgentEmail')?.value.trim() || 'vendor@example.com';
        const phone = document.getElementById('applyAgentPhone')?.value.trim() || '05551609999';
        const tempAgent = {
          id: 'AGT-PREVIEW',
          name: name,
          email: email,
          phone: phone,
          registeredAt: new Date().toISOString().split('T')[0],
          legalAgreement: {
            contractNumber: 'TK-AGR-' + Math.floor(100000 + Math.random() * 900000),
            signedAt: new Date().toISOString(),
            digitalSignatureHash: 'DIGI-SIGN-DRAFT'
          }
        };
        window.appStore.downloadAgentContract(tempAgent);
        showToast('📥 كېلىشىمنامە تېلېفوندىن چۈشۈرۈلدى!', 'success');
      });
    }

    // ئىلتىماس تاپشۇرۇلغاندىن كېيىن رەسمىي كېلىشىمنى چۈشۈرۈش
    const btnDownloadAfter = document.getElementById('btnDownloadContractAfterApply');
    if (btnDownloadAfter) {
      btnDownloadAfter.addEventListener('click', () => {
        if (lastAppliedAgentObj) {
          window.appStore.downloadAgentContract(lastAppliedAgentObj);
          showToast('📥 كېلىشىمنامە تېلېفوندىن چۈشۈرۈلدى!', 'success');
        } else {
          showToast('كېلىشىم تېپىلمىدى', 'warning');
        }
      });
    }

    // 🛒 سېتىش ئۇسۇلى تاللاش كۇنۇپكىسىنىڭ چەككەندىكى ئاكتىپ ئۇسلۇبى
    const salesMethodRadios = document.querySelectorAll('input[name="applySalesMethod"]');
    function updateSalesMethodStyle() {
      salesMethodRadios.forEach(r => {
        const parentLabel = r.closest('.sales-method-btn');
        if (parentLabel) {
          if (r.checked) {
            parentLabel.style.borderColor = '#2563eb';
            parentLabel.style.background = '#eff6ff';
            parentLabel.style.boxShadow = '0 0 0 2px rgba(37,99,235,0.2)';
          } else {
            parentLabel.style.borderColor = '#cbd5e1';
            parentLabel.style.background = '#ffffff';
            parentLabel.style.boxShadow = 'none';
          }
        }
      });
    }
    salesMethodRadios.forEach(r => {
      r.addEventListener('change', updateSalesMethodStyle);
    });

    if (applyForm) {
      applyForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 🛒 سېتىش ئۇسۇلى تاللانغانلىقىنى دەلىللەش (مەجبۇرىي)
        const salesMethodRadio = applyForm.querySelector('input[name="applySalesMethod"]:checked');
        if (!salesMethodRadio || !salesMethodRadio.value) {
          alert('⚠️ داۋاملاشتۇرۇش ئۈچۈن سېتىش ئۇسۇلىنى تاللىشىڭىز مەجبۇرىي! (ئۆزۈمنىڭ مەھسۇلاتى ياكى تور بېكەت مەھسۇلاتى)');
          showToast('سېتىش ئۇسۇلىنى تاللاڭ!', 'warning');
          const firstRadio = applyForm.querySelector('input[name="applySalesMethod"]');
          if (firstRadio) {
            firstRadio.focus();
            firstRadio.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }
        const salesMethod = salesMethodRadio.value;

        // 📜 مەجبۇرىي كېلىشىمنامە ۋە مەسئۇلىيەت بەلگىلىمىسىگە قوشۇلۇشنى تەكشۈرۈش
        const agreeCheck = document.getElementById('applyAgreeTerms');
        if (!agreeCheck || !agreeCheck.checked) {
          alert('⚠️ داۋاملاشتۇرۇش ئۈچۈن سۇپىنىڭ بارلىق تۈزۈملىرى، سۈرەت نىزامنامىسى ۋە ۋاكالەتچى مەھسۇلات مەسئۇلىيىتى پۈتۈمىگە قوشۇلۇشىڭىز مەجبۇرىي!');
          showToast('كېلىشىمنامە ۋە مەسئۇلىيەت بەلگىلىمىسىگە قوشۇلۇش كېرەك!', 'warning');
          if (agreeCheck) {
            agreeCheck.focus();
            agreeCheck.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }

        const name = document.getElementById('applyAgentName').value.trim();
        const email = document.getElementById('applyAgentEmail').value.trim();
        const phone = document.getElementById('applyAgentPhone').value.trim();
        const password = document.getElementById('applyAgentPassword') ? document.getElementById('applyAgentPassword').value.trim() : '';
        const categoryInterest = document.getElementById('applyAgentCategory').value.trim();
        const notes = document.getElementById('applyAgentNotes').value.trim();

        if (password && password.length < 6) {
          alert('⚠️ مەخپىي شىفىر (پارول) ئەڭ كەم دېگەندە 6 خانىلىق بولۇشى شەرت!');
          showToast('پارول كەم دېگەندە 6 خانە بولسۇن!', 'warning');
          const pwInput = document.getElementById('applyAgentPassword');
          if (pwInput) pwInput.focus();
          return;
        }

        const devToken = typeof getOrCreateDeviceToken === 'function' ? getOrCreateDeviceToken() : '';

        const submitBtn = applyForm.querySelector('button[type="submit"]');
        const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> تاپشۇرۇلۇۋاتىدۇ...';
        }

        try {
          const res = await window.appStore.applyAgent({
            name,
            email,
            phone,
            password,
            deviceToken: devToken,
            salesMethod,
            proposedBrands: categoryInterest,
            notes
          });

          if (res.success) {
            lastAppliedAgentObj = res.agent;
            applyForm.reset();
            updateSalesMethodStyle();
            applyForm.style.display = 'none';
            if (successBox) {
              successBox.style.display = 'block';
              if (successMsg) {
                successMsg.innerHTML = `${res.message}<br><strong style="color: #1e3a8a;">📜 رەقەملىك كېلىشىم نومۇرىڭىز: ${res.contractNumber || 'TK-AGR-OK'}</strong>`;
              }
            }
            showToast('✅ ئىلتىماسىڭىز ۋە كېلىشىمنامىڭىز تاپشۇرۇلدى!', 'success');
            try {
              sendTelegramAgentApplyNotification(res.agent);
              sendEmailAgentApplyNotification(res.agent);
            } catch (notifErr) {
              console.warn('Agent apply notification error:', notifErr);
            }
          } else {
            alert(res.message);
            showToast(res.message, 'error');
          }
        } catch (err) {
          console.error('applyAgent submit error:', err);
          showToast('ئىلتىماس يوللاشتا كاشىلا كۆرۈلدى!', 'error');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnHtml || '<i class="fas fa-file-signature"></i> كېلىشىمنى رەسمىي ئىمزالاش ۋە ئىلتىماس سۇنۇش';
          }
        }
      });
    }

    // 2. ۋاكالەتچى كىملىكىنى دەلىللەش ۋە باشقۇرۇش تاختىسى (Agent Portal & Dashboard)
    const btnVerify = document.getElementById('btnVerifyAgentLogin');
    const btnCheckStatus = document.getElementById('btnCheckAppStatus');
    const btnQuickLogin = document.getElementById('btnQuickAgentLogin');
    const btnSwitchAccount = document.getElementById('btnSwitchAgentAccount');
    const btnLogout = document.getElementById('btnAgentLogout');
    const loginInput = document.getElementById('agentLoginInput');
    const verifyMsg = document.getElementById('agentVerifyMsg');
    const formProductSubmit = document.getElementById('formAgentProductSubmit');
    const verifiedIdInput = document.getElementById('agentSubmitVerifiedId');
    const prodBrandSelect = document.getElementById('agentProdBrand');
    const prodCatSelect = document.getElementById('agentProdCategory');

    let currentVerifiedAgent = null;

    function updateAgentDashboard(agent) {
      if (!agent) return;
      const dashHeader = document.getElementById('agentDashboardHeader');
      const verifyWrap = document.getElementById('agentVerifyWrap');
      const quickCard = document.getElementById('agentQuickSessionCard');
      const nameEl = document.getElementById('dashAgentName');
      const codeEl = document.getElementById('dashAgentCode');
      const codeValEl = document.getElementById('dashAgentCodeVal');
      const phoneDispEl = document.getElementById('dashAgentPhoneDisplay');
      const brandsEl = document.getElementById('dashAgentBrands');
      const scopeEl = document.getElementById('dashAgentScope');
      const totalEl = document.getElementById('dashCountTotal');
      const appEl = document.getElementById('dashCountApproved');
      const pendEl = document.getElementById('dashCountPending');
      const needsImgEl = document.getElementById('dashCountNeedsImg');
      const viewSwitcher = document.getElementById('agentVerifiedViewSwitcher');

      if (dashHeader) dashHeader.style.display = 'block';
      if (verifyWrap) verifyWrap.style.display = 'none';
      if (quickCard) quickCard.style.display = 'none';
      if (viewSwitcher) viewSwitcher.style.display = 'grid';

      const tab1Text = document.getElementById('agentTab1Text');
      const tab2Text = document.getElementById('agentTab2Text');
      if (tab1Text) tab1Text.textContent = '📜 كېلىشىمنامە & مەسئۇلىيەت';
      if (tab2Text) tab2Text.textContent = '💼 سودىگەر مەركىزى & تاۋارلار';

      if (nameEl) nameEl.textContent = agent.name;
      if (codeEl) codeEl.textContent = `كود: ${agent.id} • 📞 ${agent.phone || ''}`;
      if (codeValEl) codeValEl.textContent = agent.id || '';
      if (phoneDispEl) phoneDispEl.textContent = `📞 ${agent.phone || ''}`;

      const brands = agent.authorizedBrands && agent.authorizedBrands.length > 0
        ? agent.authorizedBrands.join('، ')
        : 'بارلىق ماركىلار';
      if (brandsEl) brandsEl.textContent = brands;

      if (scopeEl) {
        scopeEl.textContent = agent.canPublishMultilingual ? '🌍 بارلىق تىللار' : '🌙 پەقەت ئۇيغۇرچە';
        scopeEl.style.background = agent.canPublishMultilingual ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0, 0, 0, 0.2)';
      }

      // تاۋارلار سانى
      const products = window.appStore.getProductsByAgent(agent.id) || [];
      const approved = products.filter(p => (p.approvalStatus || 'تەستىقلاندى') === 'تەستىقلاندى').length;
      const pending = products.filter(p => p.approvalStatus === 'تەستىق كۈتۈۋاتىدۇ').length;
      const needsImg = products.filter(p => (p.needsAdminImage === true || p.needsAdminImage === 'true') && p.approvalStatus !== 'رەت قىلىندى').length;

      if (totalEl) totalEl.textContent = products.length;
      if (appEl) appEl.textContent = approved;
      if (pendEl) pendEl.textContent = pending;
      if (needsImgEl) needsImgEl.textContent = needsImg;

      const badgeAll = document.getElementById('agentFilterCountAll');
      const badgeApp = document.getElementById('agentFilterCountApproved');
      const badgePend = document.getElementById('agentFilterCountPending');
      const badgeNeeds = document.getElementById('agentFilterCountNeedsImg');
      const switcherBadge = document.getElementById('switcherProdCount');

      if (badgeAll) badgeAll.textContent = products.length;
      if (badgeApp) badgeApp.textContent = approved;
      if (badgePend) badgePend.textContent = pending;
      if (badgeNeeds) badgeNeeds.textContent = needsImg;
      if (switcherBadge) switcherBadge.textContent = products.length;

      // 📅 كۈندىلىك مەھسۇلات يوللاش چېكىنى يېڭىلاش
      const quotaBadge = document.getElementById('agentDailyQuotaBadge');
      if (quotaBadge && window.appStore && typeof window.appStore.checkAgentDailyProductLimit === 'function') {
        const quota = window.appStore.checkAgentDailyProductLimit(agent.id);
        if (!quota.allowed) {
          quotaBadge.style.display = 'inline-block';
          quotaBadge.textContent = `${quota.countToday}/${quota.limit} توشتى`;
          quotaBadge.style.background = '#fee2e2';
          quotaBadge.style.color = '#b91c1c';
          quotaBadge.style.border = '1px solid #fca5a5';
        } else {
          quotaBadge.style.display = 'none';
        }
      }

      // 💰 زاكاز، سېتىش، يوللانغان، تاماملانغان، بىكار قىلىنغان، قايتىپ كەلگەن ۋە پايدا كۆرسەتكۈچلىرىنى يېڭىلاش
      if (window.appStore && typeof window.appStore.getAgentSalesOrderStats === 'function') {
        const orderStats = window.appStore.getAgentSalesOrderStats(agent.id);
        const soldEl = document.getElementById('dashCountSold');
        const shippedEl = document.getElementById('dashCountShipped');
        const completedEl = document.getElementById('dashCountCompleted');
        const cancelledEl = document.getElementById('dashCountCancelled');
        const returnedEl = document.getElementById('dashCountReturned');
        const profitEl = document.getElementById('dashAmountProfit');
        const rateBadge = document.getElementById('dashCommissionRateBadge');

        if (soldEl) soldEl.textContent = orderStats.soldCount;
        if (shippedEl) shippedEl.textContent = orderStats.shippedCount;
        if (completedEl) completedEl.textContent = orderStats.completedCount;
        if (cancelledEl) cancelledEl.textContent = orderStats.cancelledCount;
        if (returnedEl) returnedEl.textContent = orderStats.returnedCount;
        if (profitEl) profitEl.textContent = `₺${orderStats.profitCommission.toLocaleString('tr-TR')}`;
        if (rateBadge) rateBadge.textContent = `پايدا: ${orderStats.commissionRate}%`;
      }

      // 🛍️ سېتىشلار سانىنى يېڭىلاش
      if (window.appStore && typeof window.appStore.getAgentSalesOrderList === 'function') {
        const salesList = window.appStore.getAgentSalesOrderList(agent.id) || [];
        const switcherSalesBadge = document.getElementById('switcherSalesCount');
        if (switcherSalesBadge) switcherSalesBadge.textContent = salesList.length;

        const countComp = salesList.filter(s => s.status === 'تاماملاندى').length;
        const countShip = salesList.filter(s => s.status === 'يوللاندى' || s.status === 'يەتكۈزۈلۈۋاتىدۇ').length;
        const countCanc = salesList.filter(s => s.status === 'بىكار قىلىندى').length;
        const countRet = salesList.filter(s => s.status === 'قايتۇرۇلدى' || s.status === 'قايتىپ كەلگەن' || s.status === 'قايتىپ كەلگەنلەر').length;

        const bAll = document.getElementById('salesFilterCountAll');
        const bComp = document.getElementById('salesFilterCountCompleted');
        const bShip = document.getElementById('salesFilterCountShipped');
        const bCanc = document.getElementById('salesFilterCountCancelled');
        const bRet = document.getElementById('salesFilterCountReturned');

        if (bAll) bAll.textContent = salesList.length;
        if (bComp) bComp.textContent = countComp;
        if (bShip) bShip.textContent = countShip;
        if (bCanc) bCanc.textContent = countCanc;
        if (bRet) bRet.textContent = countRet;
      }

      // 📌 كۈندىلىك ئىمزا قويۇش، كۈن تىزىمى ۋە ئاكتىپلىق تەھلىلى
      if (window.appStore && typeof window.appStore.getAgentDailyAnalytics === 'function') {
        const analytics = window.appStore.getAgentDailyAnalytics(agent.id);
        const streakDaysEl = document.getElementById('dashStreakDays');
        const pointsValEl = document.getElementById('dashPointsVal');
        const streak7Notice = document.getElementById('dashStreak7Notice');
        const visitorsEl = document.getElementById('dashDailyVisitors');
        const ordersEl = document.getElementById('dashDailyOrders');
        const profitEl = document.getElementById('dashDailyProfit');
        const checkInBtn = document.getElementById('btnAgentDailyCheckIn');
        const noticeBox = document.getElementById('dashActivityNoticeBox');

        if (streakDaysEl) streakDaysEl.textContent = analytics.streak || 0;
        if (pointsValEl) pointsValEl.textContent = analytics.points || 0;
        if (visitorsEl) visitorsEl.textContent = analytics.todayVisitors || 0;
        if (ordersEl) ordersEl.textContent = analytics.todayOrders || 0;
        if (profitEl) profitEl.textContent = `₺${analytics.todayProfit || 0}`;

        const todayStr = new Date().toISOString().split('T')[0];
        const isCheckedInToday = !!(agent.lastCheckInDate && agent.lastCheckInDate.startsWith(todayStr));

        if (checkInBtn) {
          if (isCheckedInToday) {
            checkInBtn.disabled = true;
            checkInBtn.style.background = '#059669';
            checkInBtn.style.opacity = '0.9';
            checkInBtn.style.cursor = 'default';
            checkInBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>✅ بۈگۈن كىردىڭىز (+10 نومۇر)</span>';
          } else {
            checkInBtn.disabled = false;
            checkInBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            checkInBtn.style.opacity = '1';
            checkInBtn.style.cursor = 'pointer';
            checkInBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>📌 بۈگۈن كىردىم (ئىمزا قويۇش)</span>';
          }
        }

        if (streak7Notice) {
          streak7Notice.style.display = (analytics.streak >= 7 && !analytics.isExempt) ? 'block' : 'none';
        }

        // ئۇيقۇ ياكى ئىستىسنا ئاگاھلاندۇرۇشى
        if (noticeBox) {
          if (analytics.isExempt) {
            noticeBox.style.display = 'block';
            noticeBox.innerHTML = `
              <div style="background: rgba(16, 185, 129, 0.15); border: 1.5px solid rgba(16, 185, 129, 0.4); border-radius: 10px; padding: 0.55rem 0.85rem; font-size: 0.8rem; color: #a7f3d0; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-shield-alt" style="color: #34d399; font-size: 1.15rem; flex-shrink: 0;"></i>
                <div>
                  <strong>🛡️ مەجبۇرىي ئاكتىپلىق تۈزۈمىدىن خالىي قىلىنغان VIP ۋاكالەتچى:</strong>
                  <div>سىز ئالىي باشقۇرغۇچى تەرىپىدىن كۈندىلىك مەجبۇرىي كىرىش تۈزۈمىدىن تولۇق خالىي قىلىنغان. تاۋارلىرىڭىز ۋە ھېساباتىڭىز مەڭگۈ كۈچكە ئىگە.</div>
                </div>
              </div>
            `;
          } else if (analytics.isDormant) {
            noticeBox.style.display = 'block';
            noticeBox.innerHTML = `
              <div style="background: rgba(239, 68, 68, 0.22); border: 2px solid #ef4444; border-radius: 10px; padding: 0.6rem 0.85rem; font-size: 0.82rem; color: #fee2e2; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <i class="fas fa-bed" style="color: #f87171; font-size: 1.25rem; flex-shrink: 0;"></i>
                  <div>
                    <strong style="color: #ffffff;">⚠️ ھېساباتىڭىز ئۇيقۇ ھالىتىدە (ئۇدا سۇپىغا كىرمىگەن)!</strong>
                    <div style="font-size: 0.78rem; color: #fecaca; margin-top: 2px;">تاۋارلىرىڭىزنى سۇپىدا ئەسلىگە كەلتۈرۈش ئۈچۈن يۇقىرىدىكى «📌 بۈگۈن كىردىم» كۇنۇپكىسىنى بېسىپ ئويغىتىڭ.</div>
                  </div>
                </div>
              </div>
            `;
          } else {
            noticeBox.style.display = 'none';
          }
        }
      }
    }

    function getOrCreateDeviceToken() {
      let token = localStorage.getItem('teklimakan_device_token');
      if (!token) {
        token = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem('teklimakan_device_token', token);
      }
      return token;
    }

    function checkAgentSession() {
      const quickCard = document.getElementById('agentQuickSessionCard');
      const quickName = document.getElementById('quickAgentName');
      const quickSub = document.getElementById('quickAgentSub');
      const verifyWrap = document.getElementById('agentVerifyWrap');
      const dashHeader = document.getElementById('agentDashboardHeader');
      const devToken = getOrCreateDeviceToken();

      if (currentVerifiedAgent) {
        updateAgentDashboard(currentVerifiedAgent);
        renderAgentProductsList(currentVerifiedAgent.id);
        if (typeof switchAgentPortalView === 'function') {
          switchAgentPortalView('products');
        }
        return;
      }

      try {
        const saved = JSON.parse(localStorage.getItem('teklimakan_agent_session') || 'null');
        if (saved && saved.id) {
          // ئۈسكۈنە ئېتىراپ قىلىنغانمۇ تەكشۈرۈش
          const isTrusted = window.appStore && typeof window.appStore.isAgentDeviceTrusted === 'function' 
            ? window.appStore.isAgentDeviceTrusted(saved.id, devToken) 
            : false;
          
          if (isTrusted) {
            if (quickCard) quickCard.style.display = 'block';
            if (quickName) quickName.textContent = saved.name || 'ۋاكالەتچى';
            if (quickSub) quickSub.textContent = `كودىڭىز: ${saved.id} • 🛡️ ئىشەنچلىك ئۈسكۈنە`;
            if (verifyWrap) verifyWrap.style.display = 'none';
            if (dashHeader) dashHeader.style.display = 'none';
            return;
          } else {
            // ئەگەر ئۈسكۈنە ئىشەنچلىك بولمىسا، باشقا ۋاكالەتچى ئۇچۇرى كۆرۈنۈپ قالماسلىق ئۈچۈن كېشنى تازىلاش
            localStorage.removeItem('teklimakan_agent_session');
          }
        }
      } catch(e) {}

      if (quickCard) quickCard.style.display = 'none';
      if (verifyWrap) verifyWrap.style.display = 'block';
      if (dashHeader) dashHeader.style.display = 'none';
    }

    // پۈتۈن بەت دائىرىسىدە زىيارەت قىلىش ئۈچۈن window غا باغلاش
    window.checkAgentSession = checkAgentSession;

    async function performAgentVerification(val, password = '', isStatusCheckOnly = false) {
      if (!val) {
        showToast('ئېلخەت ياكى تېلېفون نومۇرىنى كىرگۈزۈڭ!', 'warning');
        return;
      }

      // ئەگەر يەرلىك سىستېمىدا بولمىسا ياكى ھالەت يېڭىلانغان بولسا، دەرھال بۇلۇتتىن سىناپ تەكشۈرۈش ۋە ماسلاشتۇرۇش
      if (window.appStore && typeof window.appStore.findAgentAsync === 'function') {
        try {
          await window.appStore.findAgentAsync(val, true);
        } catch(e) {}
      }

      const pwGroup = document.getElementById('agentPasswordGroup');
      const pwInput = document.getElementById('agentLoginPassword');
      const chkTrust = document.getElementById('chkTrustAgentDevice');
      const devToken = getOrCreateDeviceToken();

      const pwdVal = password || (pwInput ? pwInput.value.trim() : '');

      const res = window.appStore.verifyAgentLogin(val, pwdVal, devToken);
      if (verifyMsg) verifyMsg.style.display = 'block';

      // 🔐 ئەگەر مەخپىي شىفىر (پارول) تەلەپ قىلىنسا
      if (res.requirePassword) {
        if (pwGroup) pwGroup.style.display = 'block';
        if (pwInput) pwInput.focus();
        if (isStatusCheckOnly) {
          if (verifyMsg) {
            verifyMsg.className = 'agent-verify-success';
            verifyMsg.style.color = '#065f46';
            verifyMsg.style.background = '#ecfdf5';
            verifyMsg.style.padding = '0.85rem';
            verifyMsg.style.borderRadius = '8px';
            verifyMsg.style.border = '1.5px solid #a7f3d0';
            verifyMsg.innerHTML = `
              <div style="font-weight: 800; font-size: 0.98rem; margin-bottom: 0.4rem; color: #065f46; display: flex; align-items: center; gap: 0.45rem;">
                <i class="fas fa-check-circle" style="color: #10b981; font-size: 1.25rem;"></i> 🎉 تەبرىكلەيمىز! ئىلتىماسىڭىز تەستىقلاندى!
              </div>
              <div style="font-size: 0.85rem; color: #047857; line-height: 1.5;">
                ۋاكالەتچى: <strong>${res.agentName || ''}</strong> (ID: <strong>${res.agentId || ''}</strong>)<br>
                سۇپىغا كىرىش ئۈچۈن تۆۋەندىكى كۆزنەككە پارولىڭىزنى كىرگۈزۈپ، «دەلىللەش ۋە كىرىش» نى بېسىڭ.
              </div>
            `;
          }
          showToast('🎉 تەبرىكلەيمىز! ئىلتىماسىڭىز تەستىقلاندى!', 'success');
          return;
        }
        if (verifyMsg) {
          verifyMsg.className = 'agent-verify-pending';
          verifyMsg.style.color = '#b45309';
          verifyMsg.style.background = '#fffbeb';
          verifyMsg.style.padding = '0.65rem';
          verifyMsg.style.borderRadius = '8px';
          verifyMsg.style.border = '1.5px solid #fde68a';
          verifyMsg.innerHTML = `<i class="fas fa-lock" style="color: #d97706;"></i> <strong>${res.message || 'مەخپىي شىفىر (پارول) كىرگۈزۈش تەلەپ قىلىنىدۇ.'}</strong>`;
        }
        showToast(res.message || 'مەخپىي شىفىر كىرگۈزۈڭ!', 'warning');
        return;
      }

      if (res.success) {
        if (pwGroup) pwGroup.style.display = 'none';
        if (pwInput) pwInput.value = '';

        // ئەگەر ئۈسكۈنىنى ئەستە تۇتۇش تاللانغان بولسا
        if (chkTrust && chkTrust.checked && window.appStore && typeof window.appStore.trustAgentDevice === 'function') {
          window.appStore.trustAgentDevice(res.agent.id, devToken);
        }

        currentVerifiedAgent = res.agent;
        if (verifiedIdInput) verifiedIdInput.value = res.agent.id;

        // ئەستە تۇتۇش (Remember Session)
        try {
          localStorage.setItem('teklimakan_agent_session', JSON.stringify({
            id: res.agent.id,
            name: res.agent.name,
            phone: res.agent.phone
          }));
        } catch(e) {}

        const brands = res.agent.authorizedBrands && res.agent.authorizedBrands.length > 0 

          ? res.agent.authorizedBrands 
          : window.appStore.getBrands();

        if (verifyMsg) {
          verifyMsg.className = 'agent-verify-success';
          verifyMsg.style.color = '#065f46';
          verifyMsg.style.background = '#ecfdf5';
          verifyMsg.style.padding = '0.65rem';
          verifyMsg.style.borderRadius = '8px';
          verifyMsg.style.border = '1px solid #a7f3d0';
          verifyMsg.innerHTML = `
            <strong><i class="fas fa-check-circle" style="color: #10b981;"></i> تەستىقلانغان ۋاكالەتچى:</strong> ${res.agent.name} (${res.agent.id})<br>
            <span style="font-size: 0.8rem; color: #047857;">رۇخسەت قىلىنغان ماركىلار: <strong>${brands.join('، ')}</strong></span>
          `;
        }

        // ماركا تاللىغۇچنى تولدۇرۇش
        if (prodBrandSelect) {
          prodBrandSelect.innerHTML = brands.map(b => `<option value="${b}">${b}</option>`).join('');
        }

        // تۈرلەرنى تولدۇرۇش
        if (prodCatSelect) {
          const categories = window.appStore.getCategories().filter(c => c.id !== 'all' && !isPseudoCategory(c.id) && !isPseudoCategory(c.name));
          prodCatSelect.innerHTML = categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
        }

        // 🌐 تىل ھوقۇقىنى تەكشۈرۈش ۋە تەڭشەش
        const scopeSelect = document.getElementById('agentProdLanguageScope');
        const scopeBadge = document.getElementById('agentScopeNoticeBadge');
        const scopeHelp = document.getElementById('agentScopeHelpText');

        if (scopeSelect) {
          if (res.agent.canPublishMultilingual) {
            scopeSelect.disabled = false;
            scopeSelect.value = 'all';
            Array.from(scopeSelect.options).forEach(opt => opt.disabled = false);
            if (scopeBadge) {
              scopeBadge.textContent = '🌍 بارلىق تىللارغا رۇخسەت بار';
              scopeBadge.style.background = '#dcfce7';
              scopeBadge.style.color = '#15803d';
            }
            if (scopeHelp) {
              scopeHelp.innerHTML = '✅ سىزگە بارلىق تىللاردا (ئۇيغۇرچە، تۈركچە، ئىنگلىزچە) ئەركىن ئېلان قىلىش ھوقۇقى بېرىلگەن.';
            }
          } else {
            scopeSelect.value = 'ug';
            Array.from(scopeSelect.options).forEach(opt => {
              opt.disabled = (opt.value !== 'ug');
            });
            if (scopeBadge) {
              scopeBadge.textContent = '🔒 پەقەت ئۇيغۇرچە رۇخسەت قىلىنغان';
              scopeBadge.style.background = '#f1f5f9';
              scopeBadge.style.color = '#475569';
            }
            if (scopeHelp) {
              scopeHelp.innerHTML = '🔒 سىزگە نۆۋەتتە پەقەت ئۇيغۇرچە بەتتىلا ئېلان قىلىش ھوقۇقى بېرىلگەن.';
            }
          }
        }

        // Dashboard تاختىسىنى يېڭىلاش
        updateAgentDashboard(res.agent);

        // 🚨 خىلاپلىق تاختىسى
        const violCard = document.getElementById('agentViolationAlertCard');
        if (violCard) {
          const vCount = Number(res.agent.violationsCount || 0);
          if (vCount > 0) {
            violCard.style.display = 'block';
            violCard.style.background = '#fff1f2';
            violCard.style.border = '2px solid #f43f5e';
            violCard.innerHTML = `
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.4rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: #fee2e2; color: #e11d48; font-size: 1.1rem;"><i class="fas fa-exclamation-triangle"></i></span>
                  <strong style="color: #9f1239; font-size: 0.95rem;">سۇپا بەلگىلىمىسىگە خىلاپلىق قىلىش خاتىرىسى:</strong>
                </div>
                <span style="background: #e11d48; color: #ffffff; padding: 2px 10px; border-radius: 9999px; font-weight: 900; font-size: 0.82rem;">
                  ⚠️ جەمئىي: ${vCount} قېتىم خىلاپلىق قىلىنغان
                </span>
              </div>
              <div style="font-size: 0.82rem; color: #881337; line-height: 1.5;">
                سۇپا قائىدىسى بويىچە مەھسۇلاتقا تېلېفون نومۇرى ياكى تور ئۇلانمىسى قوشۇش قەتئىي مەنئى قىلىنىدۇ.
              </div>
            `;
          } else {
            violCard.style.display = 'none';
          }
        }

        if (typeof switchAgentPortalView === 'function') {
          switchAgentPortalView('products');
        }
        renderAgentProductsList(res.agent.id);
        updateAgentDashboard(res.agent);
        showToast(`خۇش كەپسىز، ${res.agent.name}!`, 'success');
      } else {
        currentVerifiedAgent = null;
        formProductSubmit.style.display = 'none';
        if (myProductsWrap) myProductsWrap.style.display = 'none';
        const switcher = document.getElementById('agentVerifiedViewSwitcher');
        if (switcher) switcher.style.display = 'none';

        const violCard = document.getElementById('agentViolationAlertCard');
        const dashHeader = document.getElementById('agentDashboardHeader');
        if (dashHeader) dashHeader.style.display = 'none';

        if (res.isSuspended) {
          if (verifyMsg) verifyMsg.style.display = 'none';
          if (violCard) {
            const vCount = res.violationsCount || (res.agent ? res.agent.violationsCount : 1) || 1;
            const untilStr = res.suspendedUntil 
              ? new Date(res.suspendedUntil).toLocaleString('ug-CN', { dateStyle: 'medium', timeStyle: 'short' }) 
              : 'باشقۇرغۇچى چەكلەشنى ئاچقۇچە';

            violCard.style.display = 'block';
            violCard.style.background = '#fef2f2';
            violCard.style.border = '2.5px solid #dc2626';
            violCard.innerHTML = `
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                <div style="width: 46px; height: 46px; border-radius: 50%; background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; border: 2px solid #fca5a5;">
                  <i class="fas fa-ban"></i>
                </div>
                <div>
                  <h5 style="color: #991b1b; font-size: 1.05rem; font-weight: 900; margin: 0 0 2px 0;">
                    ⛔ ھېساباتىڭىز ۋاقىتلىق توختىتىلدى (${vCount} كۈن جازا)!
                  </h5>
                  <div style="font-size: 0.8rem; color: #b91c1c; font-weight: 700;">
                    سەۋەبى: تېلېفون نومۇرى ياكى تور ئۇلانمىسى قوشۇش قائىدىسىگە خىلاپلىق قىلىنغان
                  </div>
                </div>
              </div>
              <div style="font-size: 0.82rem; color: #4b5563; line-height: 1.5;">
                ℹ️ <strong>ئەسكەرتىش:</strong> توختاش ئاخىرلىشىش ۋاقتى: <strong class="number-latin" style="color: #1e3a8a;">${untilStr}</strong>.
              </div>
            `;
          }
        } else if (res.isPending) {
          if (violCard) violCard.style.display = 'none';
          if (verifyMsg) {
            verifyMsg.style.color = '#92400e';
            verifyMsg.style.background = '#fffbeb';
            verifyMsg.style.padding = '0.85rem';
            verifyMsg.style.borderRadius = '8px';
            verifyMsg.style.border = '1.5px solid #fde68a';
            const checkTime = new Date().toLocaleTimeString('ug-CN', { hour12: false });
            verifyMsg.innerHTML = `
              <div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 0.35rem; color: #92400e; display: flex; align-items: center; gap: 0.45rem;">
                <i class="fas fa-hourglass-half" style="color: #d97706;"></i> <strong>ئىلتىماس ھالىتى: تەكشۈرۈلۈۋاتىدۇ</strong>
              </div>
              <div style="font-size: 0.84rem; color: #78350f; line-height: 1.5;">
                ${res.message || 'ئىلتىماسىڭىز تېخى «تەستىق كۈتۈۋاتىدۇ» ھالىتىدە. سۇپا باشقۇرغۇچىسى پات يېقىندا تەكشۈرۈپ تەستىقلايدۇ.'}
              </div>
              <div style="font-size: 0.75rem; color: #b45309; margin-top: 0.4rem;">
                🔄 ئەڭ يېڭى بۇلۇت تەكشۈرۈش ۋاقتى: ${checkTime}
              </div>
            `;
          }
        } else {
          if (violCard) violCard.style.display = 'none';
          if (verifyMsg) {
            verifyMsg.style.color = '#991b1b';
            verifyMsg.style.background = '#fef2f2';
            verifyMsg.style.padding = '0.75rem';
            verifyMsg.style.borderRadius = '8px';
            verifyMsg.style.border = '1px solid #fecaca';
            verifyMsg.innerHTML = `<i class="fas fa-times-circle"></i> ${res.message}`;
          }
        }
      }
    }

    if (btnVerify && loginInput) {
      btnVerify.addEventListener('click', async () => {
        const val = loginInput.value.trim();
        const pwInput = document.getElementById('agentLoginPassword');
        const pw = pwInput ? pwInput.value.trim() : '';
        btnVerify.disabled = true;
        const origHtml = btnVerify.innerHTML;
        btnVerify.innerHTML = '<i class="fas fa-spinner fa-spin"></i> دەلىللىنىۋاتىدۇ...';
        try {
          await performAgentVerification(val, pw, false);
        } finally {
          btnVerify.disabled = false;
          btnVerify.innerHTML = origHtml;
        }
      });
      loginInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          btnVerify.click();
        }
      });
    }

    const pwLoginInput = document.getElementById('agentLoginPassword');
    if (pwLoginInput && btnVerify) {
      pwLoginInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          btnVerify.click();
        }
      });
    }

    const btnToggleAgentLoginPw = document.getElementById('btnToggleAgentLoginPw');
    if (btnToggleAgentLoginPw && pwLoginInput) {
      btnToggleAgentLoginPw.addEventListener('click', () => {
        const isPw = pwLoginInput.type === 'password';
        pwLoginInput.type = isPw ? 'text' : 'password';
        const icon = btnToggleAgentLoginPw.querySelector('i');
        if (icon) {
          icon.classList.toggle('fa-eye', !isPw);
          icon.classList.toggle('fa-eye-slash', isPw);
        }
      });
    }

    if (btnCheckStatus && loginInput) {
      btnCheckStatus.addEventListener('click', async () => {
        const val = loginInput.value.trim();
        if (!val) {
          showToast('سۈرۈشتۈرمەكچى بولغان تېلېفون، ئېلخەت ياكى كودنى كىرگۈزۈڭ!', 'warning');
          loginInput.focus();
          return;
        }
        btnCheckStatus.disabled = true;
        const origHtml = btnCheckStatus.innerHTML;
        btnCheckStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> تەكشۈرۈۋاتىدۇ...';
        try {
          await performAgentVerification(val, '', true);
        } finally {
          btnCheckStatus.disabled = false;
          btnCheckStatus.innerHTML = origHtml;
        }
      });
    }

    if (btnQuickLogin) {
      btnQuickLogin.addEventListener('click', async () => {
        try {
          const saved = JSON.parse(localStorage.getItem('teklimakan_agent_session') || 'null');
          if (saved && saved.id) {
            await performAgentVerification(saved.id, '', false);
          }
        } catch(e) {}
      });
    }

    if (btnSwitchAccount) {
      btnSwitchAccount.addEventListener('click', () => {
        const quickCard = document.getElementById('agentQuickSessionCard');
        if (quickCard) quickCard.style.display = 'none';
        const verifyWrap = document.getElementById('agentVerifyWrap');
        if (verifyWrap) verifyWrap.style.display = 'block';
        if (loginInput) {
          loginInput.value = '';
          loginInput.focus();
        }
        const pwGroup = document.getElementById('agentPasswordGroup');
        const pwInput = document.getElementById('agentLoginPassword');
        if (pwGroup) pwGroup.style.display = 'none';
        if (pwInput) pwInput.value = '';
      });
    }

    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        currentVerifiedAgent = null;
        try { localStorage.removeItem('teklimakan_agent_session'); } catch(e) {}
        const pwGroup = document.getElementById('agentPasswordGroup');
        const pwInput = document.getElementById('agentLoginPassword');
        if (pwGroup) pwGroup.style.display = 'none';
        if (pwInput) pwInput.value = '';
        const dashHeader = document.getElementById('agentDashboardHeader');
        if (dashHeader) dashHeader.style.display = 'none';
        const switcher = document.getElementById('agentVerifiedViewSwitcher');
        if (switcher) switcher.style.display = 'none';
        if (formProductSubmit) formProductSubmit.style.display = 'none';
        if (myProductsWrap) myProductsWrap.style.display = 'none';
        const verifyWrap = document.getElementById('agentVerifyWrap');
        if (verifyWrap) verifyWrap.style.display = 'block';
        const quickCard = document.getElementById('agentQuickSessionCard');
        if (quickCard) quickCard.style.display = 'none';
        if (loginInput) loginInput.value = '';
        if (verifyMsg) verifyMsg.style.display = 'none';
        const tab1Text = document.getElementById('agentTab1Text');
        const tab2Text = document.getElementById('agentTab2Text');
        if (tab1Text) tab1Text.textContent = '1. ۋاكالەتچى بولۇپ تىزىملىتىش';
        if (tab2Text) tab2Text.textContent = '2. كىرىش ۋە تاۋار سۇنۇش';
        showToast('ھېساباتتىن چىقتىڭىز', 'info');
      });
    }

    // 🔑 مەخپىي شىفىرنى قايتا بېكىتىش كۆزنىكىنى كونترول قىلىش (Password Reset Modal Listeners)
    const btnForgot = document.getElementById('btnForgotAgentPassword');
    const modalReset = document.getElementById('modalAgentPasswordReset');
    const btnCloseReset = document.getElementById('btnCloseResetPasswordModal');
    const resetStep1 = document.getElementById('resetStep1');
    const resetStep2 = document.getElementById('resetStep2');
    const inputResetId = document.getElementById('inputResetIdentifier');
    const btnSendResetCode = document.getElementById('btnSendResetCode');
    const btnSubmitNewPw = document.getElementById('btnSubmitNewPassword');
    const resetNoticeBox = document.getElementById('resetCodeNoticeBox');

    let currentResetAgentId = '';

    // ⚡ ۋاكالەتچى شىفىرىنى بىۋاسىتە شەرتسىز ئالماشتۇرۇش كۆزنىكىنى ئېچىش
    function openAgentPasswordResetModal(identifier = '') {
      if (inputResetId) {
        inputResetId.value = identifier;
      }
      const pw1 = document.getElementById('inputResetNewPassword');
      const pw2 = document.getElementById('inputResetConfirmPassword');
      if (pw1) pw1.value = '';
      if (pw2) pw2.value = '';

      if (modalReset) modalReset.classList.add('active');

      setTimeout(() => {
        if (identifier && pw1) {
          pw1.focus();
        } else if (inputResetId) {
          inputResetId.focus();
        }
      }, 200);
    }

    if (btnForgot) {
      btnForgot.addEventListener('click', () => {
        const idVal = loginInput ? loginInput.value.trim() : '';
        openAgentPasswordResetModal(idVal);
      });
    }

    if (btnCloseReset && modalReset) {
      btnCloseReset.addEventListener('click', () => {
        modalReset.classList.remove('active');
      });
      modalReset.addEventListener('click', (e) => {
        if (e.target === modalReset) modalReset.classList.remove('active');
      });
    }

    if (btnSendResetCode) {
      btnSendResetCode.addEventListener('click', () => {
        const idVal = inputResetId ? inputResetId.value.trim() : '';
        openAgentPasswordResetModal(idVal);
      });
    }

    // 🔗 ئېلخەت ياكى تاشقى ئۇلانما ئارقىلىق كىرگەندە پارول ئۆزگەرتىش كۆزنىكىنى ئېچىش (?reset_agent=...)
    function checkUrlPasswordResetParams() {
      try {
        const params = new URLSearchParams(window.location.search);
        const agentId = params.get('reset_agent');
        if (agentId) {
          const agentDrawer = document.getElementById('agentDrawer');
          if (agentDrawer) agentDrawer.classList.add('active');
          const agentBackdrop = document.getElementById('agentDrawerBackdrop');
          if (agentBackdrop) agentBackdrop.classList.add('active');

          openAgentPasswordResetModal(agentId);
        }
      } catch(e) {
        console.warn('checkUrlPasswordResetParams error:', e);
      }
    }
    checkUrlPasswordResetParams();

    if (btnSubmitNewPw) {
      btnSubmitNewPw.addEventListener('click', async () => {
        const identifier = inputResetId ? inputResetId.value.trim() : '';
        const newPw = document.getElementById('inputResetNewPassword')?.value.trim() || '';
        const confirmPw = document.getElementById('inputResetConfirmPassword')?.value.trim() || '';

        if (!identifier) {
          showToast('تېلېفون ياكى ئېلخەت كىرگۈزۈڭ!', 'warning');
          if (inputResetId) inputResetId.focus();
          return;
        }

        if (!newPw) {
          showToast('يېڭى مەخپىي شىفىرنى كىرگۈزۈڭ!', 'warning');
          document.getElementById('inputResetNewPassword')?.focus();
          return;
        }

        if (newPw.length < 6) {
          showToast('مەخپىي شىفىر كەم دېگەندە 6 خانىلىق بولسۇن!', 'warning');
          return;
        }

        if (newPw !== confirmPw) {
          showToast('ئىككى قېتىم كىرگۈزگەن شىفىر بىر-بىرىگە ماس كەلمىدى!', 'error');
          return;
        }

        btnSubmitNewPw.disabled = true;
        btnSubmitNewPw.innerHTML = '<i class="fas fa-spinner fa-spin"></i> يېڭىلىنىۋاتىدۇ...';

        try {
          const devToken = getOrCreateDeviceToken();
          const res = await window.appStore.resetAgentPasswordDirect(identifier, newPw, devToken);
          if (res.success) {
            modalReset.classList.remove('active');
            showToast('✅ مەخپىي شىفىرىڭىز مۇۋەپپەقىيەتلىك يېڭىلاندى! كىرىۋاتىسىز...', 'success');

            // كىرىش رامكىسىنى تولدۇرۇپ بىۋاسىتە سىستېمىغا كىرگۈزۈش
            if (loginInput) loginInput.value = res.agent.id || identifier;
            const pwInput = document.getElementById('agentLoginPassword');
            if (pwInput) pwInput.value = newPw;

            await performAgentVerification(res.agent.id || identifier, newPw, false);
          } else {
            showToast(res.message, 'error');
            alert(res.message);
          }
        } catch(e) {
          console.error('Reset password error:', e);
          showToast('پارولنى يېڭىلاشتا خاتالىق كۆرۈلدى', 'error');
        } finally {
          btnSubmitNewPw.disabled = false;
          btnSubmitNewPw.innerHTML = '<i class="fas fa-save"></i> <span>مەخپىي شىفىرنى ساقلاش ۋە دەرھال كىرىش</span>';
        }
      });
    }

    // ۋاكالەتچىنىڭ ئۆز تاۋارلىرىنى كۆرۈش ۋە تەھرىرلەش (باھا، نام، زاپاس ئۆزگەرتىش)
    const myProductsWrap = document.getElementById('agentMyProductsWrap');
    const myProductsList = document.getElementById('agentMyProductsList');
    const btnAddNewMode = document.getElementById('btnAgentAddNewProductMode');
    const editBanner = document.getElementById('agentEditStatusBanner');
    const editBannerTitle = document.getElementById('agentEditBannerTitle');
    const btnCancelEdit = document.getElementById('btnCancelEditProduct');
    const editProdIdInput = document.getElementById('agentEditProductId');
    const submitBtnText = document.getElementById('agentSubmitBtnText');
    const submitBtnIcon = document.getElementById('agentSubmitBtnIcon');

    // ⚖️ ۋاكالەتچى مەھسۇلات مىقدارى / بىرلىكىنى باغلاش
    const agentUnitSelect = document.getElementById('agentProdUnitSelect');
    const agentUnitInput = document.getElementById('agentProdUnit');
    if (agentUnitSelect && agentUnitInput) {
      agentUnitSelect.addEventListener('change', () => {
        if (agentUnitSelect.value === 'custom') {
          agentUnitInput.value = '';
          agentUnitInput.focus();
        } else {
          agentUnitInput.value = agentUnitSelect.value;
        }
      });
      agentUnitInput.addEventListener('input', () => {
        const val = agentUnitInput.value.trim();
        const match = Array.from(agentUnitSelect.options).find(opt => opt.value === val);
        agentUnitSelect.value = match ? val : 'custom';
      });
    }

    // 🧭 كۆرۈنۈش ئالماشتۇرۇش: «مېنىڭ تاۋارلىرىم»، «سېتىشلىرىم»، «تاۋار سۇنۇش جەدۋىلى» ياكى «🔥 كۈندىلىك ئالاھىدە تاۋارلار»
    function switchAgentPortalView(view = 'products') {
      const btnProducts = document.getElementById('btnSwitchToMyProducts');
      const btnSales = document.getElementById('btnSwitchToMySales');
      const btnSubmit = document.getElementById('btnSwitchToNewProduct');
      const btnFlash = document.getElementById('btnSwitchToFlashDeals');
      const switcherWrap = document.getElementById('agentVerifiedViewSwitcher');
      const myProds = document.getElementById('agentMyProductsWrap');
      const mySales = document.getElementById('agentMySalesWrap');
      const submitForm = document.getElementById('formAgentProductSubmit');
      const flashWrap = document.getElementById('agentFlashDealsWrap');

      if (switcherWrap) switcherWrap.style.display = 'grid';

      [btnProducts, btnSales, btnSubmit, btnFlash].forEach(b => {
        if (b) {
          b.style.border = '1.5px solid #cbd5e1';
          b.style.background = '#ffffff';
          b.style.color = '#475569';
          b.style.fontWeight = '700';
        }
      });

      if (view === 'products') {
        if (btnProducts) {
          btnProducts.style.border = '2px solid var(--primary-color)';
          btnProducts.style.background = '#eff6ff';
          btnProducts.style.color = 'var(--primary-color)';
          btnProducts.style.fontWeight = '800';
        }
        if (myProds) myProds.style.display = 'block';
        if (mySales) mySales.style.display = 'none';
        if (submitForm) submitForm.style.display = 'none';
        if (flashWrap) flashWrap.style.display = 'none';
      } else if (view === 'sales') {
        if (btnSales) {
          btnSales.style.border = '2px solid #0284c7';
          btnSales.style.background = '#f0f9ff';
          btnSales.style.color = '#0284c7';
          btnSales.style.fontWeight = '800';
        }
        if (myProds) myProds.style.display = 'none';
        if (mySales) mySales.style.display = 'block';
        if (submitForm) submitForm.style.display = 'none';
        if (flashWrap) flashWrap.style.display = 'none';
        if (currentVerifiedAgent) renderAgentSalesList(currentVerifiedAgent.id);
      } else if (view === 'flashDeals') {
        if (btnFlash) {
          btnFlash.style.border = '2px solid #f59e0b';
          btnFlash.style.background = '#fffbeb';
          btnFlash.style.color = '#b45309';
          btnFlash.style.fontWeight = '800';
        }
        if (myProds) myProds.style.display = 'none';
        if (mySales) mySales.style.display = 'none';
        if (submitForm) submitForm.style.display = 'none';
        if (flashWrap) flashWrap.style.display = 'block';
        if (currentVerifiedAgent) renderAgentFlashDeals(currentVerifiedAgent);
      } else {
        if (btnSubmit) {
          btnSubmit.style.border = '2px solid var(--primary-color)';
          btnSubmit.style.background = '#eff6ff';
          btnSubmit.style.color = 'var(--primary-color)';
          btnSubmit.style.fontWeight = '800';
        }
        if (myProds) myProds.style.display = 'none';
        if (mySales) mySales.style.display = 'none';
        if (submitForm) submitForm.style.display = 'block';
        if (flashWrap) flashWrap.style.display = 'none';
      }
    }

    // 🔥 كۈندىلىك ئالاھىدە پائالىيەت تاۋارلىرىنى رېندېرلاش
    function renderAgentFlashDeals(agent) {
      const listEl = document.getElementById('agentFlashDealsList');
      if (!listEl) return;

      const deals = window.appStore ? window.appStore.getAgentDailyFlashDeals() : [];
      if (!deals || deals.length === 0) {
        listEl.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: #64748b; background: #ffffff; border-radius: 10px; border: 1px dashed #cbd5e1;">
            بۈگۈنكى ئالاھىدە پائالىيەت تاۋارلىرى تېخى سەپلەنمىدى.
          </div>
        `;
        return;
      }

      listEl.innerHTML = deals.map(d => {
        const shareLink = `${window.location.origin}${window.location.pathname}?prod=${d.id}&agent=${agent.id}`;
        return `
          <div style="background: #ffffff; border: 1.5px solid #fde68a; border-radius: 12px; padding: 0.75rem; box-shadow: 0 4px 10px rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="position: relative; border-radius: 8px; overflow: hidden; margin-bottom: 0.5rem; height: 140px; background: #f1f5f9;">
                <img src="${d.image || 'images/default-product.jpg'}" alt="${escapeModalHtml(d.name)}" style="width: 100%; height: 100%; object-fit: cover;">
                <span style="position: absolute; top: 6px; right: 6px; background: linear-gradient(135deg, #ea580c, #c2410c); color: #ffffff; font-size: 0.7rem; font-weight: 900; padding: 2px 7px; border-radius: 9999px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                  🔥 ${d.flashCommissionRate}% پايدا!
                </span>
              </div>
              <h5 style="margin: 0 0 0.35rem; font-size: 0.88rem; font-weight: 800; color: #1e293b; line-height: 1.4;">
                ${escapeModalHtml(d.name)}
              </h5>
              <div style="display: flex; align-items: baseline; gap: 0.4rem; margin-bottom: 0.45rem;">
                <span class="number-latin" style="font-size: 1.1rem; font-weight: 900; color: #e11d48;">₺${d.exclusivePrice || d.price}</span>
                <span class="number-latin" style="font-size: 0.8rem; color: #94a3b8; text-decoration: line-through;">₺${d.price}</span>
              </div>
            </div>
            <div style="margin-top: 0.5rem; border-top: 1px dashed #e2e8f0; padding-top: 0.5rem; display: flex; gap: 0.35rem;">
              <button type="button" class="btn-copy-flash-link" data-link="${shareLink}" style="flex: 1; background: linear-gradient(135deg, #f59e0b, #d97706); color: #ffffff; border: none; border-radius: 6px; padding: 0.45rem 0.5rem; font-size: 0.76rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.3rem;">
                <i class="fas fa-share-alt"></i> <span>ئۇلانما كۆچۈرۈش</span>
              </button>
            </div>
          </div>
        `;
      }).join('');

      listEl.querySelectorAll('.btn-copy-flash-link').forEach(btn => {
        btn.addEventListener('click', () => {
          const link = btn.dataset.link;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(link).then(() => {
              showToast('✅ تاۋارنىڭ مەخسۇس ۋاكالەتچى ئۇلانمىسى كۆچۈرۈلدى! دوستلار چەمبىرىكىگە ھەمبەھىرلەڭ.', 'success');
            }).catch(() => {
              showToast('ئۇلانما: ' + link, 'info');
            });
          } else {
            prompt('بۇ ئۇلانمىنى كۆچۈرۈپ ھەمبەھىرلەڭ:', link);
          }
        });
      });
    }

    // 🛍️ خېرىدار ئۇچۇرلىرى يوشۇرۇلغان، پەقەت تاۋار سېتىش، ۋاقتى ۋە پايدىسى كۆرۈنىدىغان تىزىملىكنى رېندېرلاش
    let currentAgentSalesFilter = 'all';

    function renderAgentSalesList(agentId, statusFilter = currentAgentSalesFilter) {
      const listEl = document.getElementById('agentMySalesList');
      if (!listEl) return;
      currentAgentSalesFilter = statusFilter;

      // سۈزگۈچ كۇنۇپكىلىرىنىڭ كۆرۈنۈشىنى يېڭىلاش
      const filterBtns = document.querySelectorAll('.agent-sales-filter-btn');
      filterBtns.forEach(btn => {
        if (btn.dataset.filter === currentAgentSalesFilter) {
          btn.style.background = 'var(--primary-color)';
          btn.style.color = '#ffffff';
          btn.style.borderColor = 'var(--primary-color)';
          btn.style.fontWeight = '800';
          btn.classList.add('active');
        } else {
          btn.style.background = '#ffffff';
          btn.style.color = '#475569';
          btn.style.borderColor = '#cbd5e1';
          btn.style.fontWeight = '700';
          btn.classList.remove('active');
        }
      });

      if (!window.appStore || typeof window.appStore.getAgentSalesOrderList !== 'function') {
        listEl.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 2rem 1rem;">سېتىش ئۇچۇرى تېپىلمىدى</div>';
        return;
      }

      let allSales = window.appStore.getAgentSalesOrderList(agentId) || [];

      // ھالەت بويىچە سۈزۈش
      let filtered = allSales;
      if (statusFilter === 'completed') {
        filtered = allSales.filter(s => s.status === 'تاماملاندى');
      } else if (statusFilter === 'shipped') {
        filtered = allSales.filter(s => s.status === 'يوللاندى' || s.status === 'يەتكۈزۈلۈۋاتىدۇ');
      } else if (statusFilter === 'cancelled') {
        filtered = allSales.filter(s => s.status === 'بىكار قىلىندى');
      } else if (statusFilter === 'returned') {
        filtered = allSales.filter(s => s.status === 'قايتۇرۇلدى' || s.status === 'قايتىپ كەلگەن' || s.status === 'قايتىپ كەلگەنلەر');
      }

      if (filtered.length === 0) {
        listEl.innerHTML = `
          <div style="padding: 2.2rem 1rem; text-align: center; color: #64748b; background: #ffffff; border-radius: 8px; border: 1px dashed #cbd5e1;">
            <i class="fas fa-shopping-bag" style="font-size: 2rem; color: #94a3b8; margin-bottom: 0.5rem; display: block;"></i>
            <span style="font-weight: 700; font-size: 0.9rem;">بۇ تۈردە تېخى سېتىش خاتىرىسى يوق.</span>
            <p style="font-size: 0.78rem; color: #94a3b8; margin: 0.35rem 0 0;">تاۋارلىرىڭىز سېتىلغان ھامان بۇ يەردە دەل ۋاقتىدا كۆرۈنىدۇ.</p>
          </div>
        `;
        return;
      }

      listEl.innerHTML = filtered.map(item => {
        let statusBadge = '';
        if (item.status === 'تاماملاندى') {
          statusBadge = '<span style="background: #dcfce7; color: #15803d; border: 1px solid #86efac; padding: 2px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 800;"><i class="fas fa-check-circle"></i> تاماملاندى</span>';
        } else if (item.status === 'يوللاندى' || item.status === 'يەتكۈزۈلۈۋاتىدۇ') {
          statusBadge = '<span style="background: #dbeafe; color: #1d4ed8; border: 1px solid #93c5fd; padding: 2px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 800;"><i class="fas fa-truck"></i> يوللاندى</span>';
        } else if (item.status === 'بىكار قىلىندى') {
          statusBadge = '<span style="background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; padding: 2px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 800;"><i class="fas fa-times-circle"></i> بىكار قىلىندى</span>';
        } else if (item.status === 'قايتۇرۇلدى' || item.status === 'قايتىپ كەلگەن' || item.status === 'قايتىپ كەلگەنلەر') {
          statusBadge = '<span style="background: #ffedd5; color: #c2410c; border: 1px solid #fed7aa; padding: 2px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 800;"><i class="fas fa-undo"></i> قايتۇرۇلدى</span>';
        } else {
          statusBadge = `<span style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 2px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 800;"><i class="fas fa-clock"></i> ${escapeModalHtml(item.status)}</span>`;
        }

        return `
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.75rem; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 0.65rem; min-width: 0; flex: 1;">
              <div style="width: 52px; height: 52px; border-radius: 8px; overflow: hidden; background: #f1f5f9; flex-shrink: 0; border: 1px solid #e2e8f0;">
                <img src="${item.productImage || 'images/default-product.png'}" alt="${escapeModalHtml(item.productName)}" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
              <div style="min-width: 0; flex: 1;">
                <div style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 2px;">
                  <span class="number-latin" style="font-size: 0.7rem; color: #64748b; background: #f1f5f9; padding: 1px 5px; border-radius: 4px; font-weight: 700;">${item.orderId}</span>
                  <span class="number-latin" style="font-size: 0.72rem; color: #94a3b8;"><i class="far fa-calendar-alt"></i> ${item.date}</span>
                </div>
                <h5 style="margin: 0; font-size: 0.86rem; font-weight: 800; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${escapeModalHtml(item.productName)}
                </h5>
                <div style="font-size: 0.76rem; color: #64748b; margin-top: 2px;">
                  سېتىلغىنى: <b class="number-latin" style="color: #0f172a;">${item.quantity} ${item.unit}</b> × <span class="number-latin">₺${item.unitPrice}</span> = <b class="number-latin" style="color: #0284c7;">₺${item.totalAmount}</b>
                </div>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.3rem; flex-shrink: 0;">
              ${statusBadge}
              <div style="font-size: 0.8rem; font-weight: 800; color: #059669; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 2px 7px; border-radius: 6px;">
                پايدا: <span class="number-latin">+₺${item.agentProfit}</span> <span style="font-size: 0.68rem; color: #047857;">(${item.commissionRate}%)</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function resetToNewProductMode() {
      if (editProdIdInput) editProdIdInput.value = '';
      if (editBanner) editBanner.style.display = 'none';
      if (submitBtnText) submitBtnText.textContent = 'مەھسۇلاتنى تەستىققا يوللاش';
      if (submitBtnIcon) submitBtnIcon.className = 'fas fa-upload';
      if (formProductSubmit) formProductSubmit.reset();
      if (previewWrap) previewWrap.style.display = 'none';

      const autofillNotice = document.getElementById('agentAutofillNotice');
      if (autofillNotice) autofillNotice.style.display = 'none';
      if (typeof updateSameProductQuotaNotice === 'function') updateSameProductQuotaNotice('');
      const autocompleteList = document.getElementById('agentProdAutocompleteList');
      if (autocompleteList) {
        autocompleteList.style.display = 'none';
        autocompleteList.innerHTML = '';
      }

      if (agentUnitInput) agentUnitInput.value = 'دانە';
      if (agentUnitSelect) agentUnitSelect.value = 'دانە';

      const needsAdminImgInput = document.getElementById('agentNeedsAdminImage');
      const adminImgCard = document.getElementById('agentAdminImageChosenCard');
      const tipBox = document.getElementById('agentImgHelpTipBox');
      if (needsAdminImgInput) needsAdminImgInput.value = 'false';
      if (adminImgCard) adminImgCard.style.display = 'none';
      if (tipBox) tipBox.style.display = 'block';

      const scopeSelect = document.getElementById('agentProdLanguageScope');
      if (scopeSelect && currentVerifiedAgent) {
        scopeSelect.value = currentVerifiedAgent.canPublishMultilingual ? 'all' : 'ug';
      }

      // 📅 كۈندىلىك مەھسۇلات يوللاش چېكىنى تەكشۈرۈش
      const dailyLimitBanner = document.getElementById('agentDailyLimitNoticeBanner');
      const bannerIcon = document.getElementById('agentDailyLimitNoticeIcon');
      const bannerTitle = document.getElementById('agentDailyLimitNoticeTitle');
      const bannerDesc = document.getElementById('agentDailyLimitNoticeDesc');
      const submitBtn = document.getElementById('btnAgentSubmitProductAction');

      if (submitBtn) {
        submitBtn.removeAttribute('data-quota-blocked');
        submitBtn.disabled = false;
      }

      if (currentVerifiedAgent && window.appStore && typeof window.appStore.checkAgentDailyProductLimit === 'function') {
        const quota = window.appStore.checkAgentDailyProductLimit(currentVerifiedAgent.id);
        if (!quota.allowed) {
          if (dailyLimitBanner) dailyLimitBanner.style.display = 'block';
          if (quota.isPending) {
            if (bannerIcon) bannerIcon.textContent = '⏳';
            if (bannerTitle) bannerTitle.textContent = 'ۋاكالەتچىلىك سالاھىيىتىڭىز تەكشۈرۈلۈۋاتىدۇ';
            if (bannerDesc) bannerDesc.innerHTML = 'ھۆرمەتلىك ئىلتىماس قىلغۇچى، سۇپا باشقۇرغۇچىسى ئىلتىماسىڭىزنى تەكشۈرۈپ تەستىقلىغاندىن كېيىن، كۈنىگە 1 تالدىن يېڭى تاۋار سۇنالايسىز.';
          } else if (quota.isSuspended) {
            if (bannerIcon) bannerIcon.textContent = '🚫';
            if (bannerTitle) bannerTitle.textContent = 'ھېساباتىڭىز ۋاقىتلىق توختىتىلغان';
            if (bannerDesc) bannerDesc.innerHTML = quota.message || 'بەلگىلىمىگە خىلاپلىق سەۋەبىدىن ھېساباتىڭىز توختىتىلغان.';
          } else {
            if (bannerIcon) bannerIcon.textContent = '⚠️';
            if (bannerTitle) bannerTitle.textContent = `بۈگۈنكى يېڭى تاۋار يوللاش پۇرسىتىڭىز توشتى (${quota.countToday}/${quota.limit})`;
            if (bannerDesc) bannerDesc.innerHTML = `ھۆرمەتلىك سېتىش ۋاكالەتچىسى، باشقۇرغۇچىنىڭ تەكشۈرۈپ تەستىقلاپ يېتىشەلىشى ئۈچۈن، كۈنىگە پەقەت <strong>1 تال يېڭى مەھسۇلات</strong> يوللاشقا رۇخسەت قىلىنىدۇ. سىز بۈگۈن ${quota.countToday} تال مەھسۇلات يوللاپ بولدىڭىز، كېيىنكى مەھسۇلاتنى ئەتە يوللىيالايسىز.`;
          }
          if (submitBtn) {
            submitBtn.setAttribute('data-daily-blocked', 'true');
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';
            submitBtn.title = quota.message || 'بۈگۈنكى مەھسۇلات يوللاش چېكىڭىز توشتى.';
          }
        } else {
          if (dailyLimitBanner) dailyLimitBanner.style.display = 'none';
          if (submitBtn) {
            submitBtn.removeAttribute('data-daily-blocked');
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
            submitBtn.disabled = false;
            submitBtn.title = '';
          }
        }
      } else {
        if (dailyLimitBanner) dailyLimitBanner.style.display = 'none';
        if (submitBtn) {
          submitBtn.removeAttribute('data-daily-blocked');
          submitBtn.style.opacity = '1';
          submitBtn.style.cursor = 'pointer';
          submitBtn.disabled = false;
          submitBtn.title = '';
        }
      }
    }

    // تېز ئالماشتۇرۇش كۇنۇپكىلىرى
    const btnSwitchProducts = document.getElementById('btnSwitchToMyProducts');
    const btnSwitchSales = document.getElementById('btnSwitchToMySales');
    const btnSwitchSubmit = document.getElementById('btnSwitchToNewProduct');
    const btnSwitchFlash = document.getElementById('btnSwitchToFlashDeals');
    const btnQuickAdd = document.getElementById('btnAgentQuickAddProd');
    const btnCopyCode = document.getElementById('btnCopyAgentId');
    const btnRefresh = document.getElementById('btnAgentRefreshData');
    const btnQuickContract = document.getElementById('btnAgentQuickViewContract');
    const btnCheckIn = document.getElementById('btnAgentDailyCheckIn');
    const btnGoBackLimit = document.getElementById('btnGoBackToMyProductsFromLimit');

    if (btnGoBackLimit) {
      btnGoBackLimit.addEventListener('click', () => {
        switchAgentPortalView('products');
        if (currentVerifiedAgent) {
          renderAgentProductsList(currentVerifiedAgent.id);
        }
      });
    }

    if (btnSwitchProducts) {
      btnSwitchProducts.addEventListener('click', () => switchAgentPortalView('products'));
    }
    if (btnSwitchSales) {
      btnSwitchSales.addEventListener('click', () => switchAgentPortalView('sales'));
    }
    if (btnSwitchSubmit) {
      btnSwitchSubmit.addEventListener('click', () => {
        if (currentVerifiedAgent && window.appStore && typeof window.appStore.checkAgentDailyProductLimit === 'function') {
          const quota = window.appStore.checkAgentDailyProductLimit(currentVerifiedAgent.id);
          if (!quota.allowed) {
            showToast(quota.message || '⚠️ بۈگۈنكى مەھسۇلات يوللاش چېكىڭىز توشتى.', 'warning');
          }
        }
        resetToNewProductMode();
        switchAgentPortalView('submit');
      });
    }
    if (btnSwitchFlash) {
      btnSwitchFlash.addEventListener('click', () => switchAgentPortalView('flashDeals'));
    }

    // سېتىشلار سۈزگۈچ كۇنۇپكىلىرىنى ئۇلاش
    const salesFilterBtns = document.querySelectorAll('.agent-sales-filter-btn');
    salesFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterVal = btn.dataset.filter || 'all';
        if (currentVerifiedAgent) {
          renderAgentSalesList(currentVerifiedAgent.id, filterVal);
        }
      });
    });

    if (btnCheckIn) {
      btnCheckIn.addEventListener('click', () => {
        if (!currentVerifiedAgent) {
          showToast('ئالدى بىلەن كىرىڭ!', 'warning');
          return;
        }
        btnCheckIn.disabled = true;

        try {
          const res = window.appStore.agentDailyCheckIn(currentVerifiedAgent.id);
          const todayStr = new Date().toISOString().split('T')[0];
          if (res && res.agent) {
            currentVerifiedAgent = res.agent;
          } else {
            currentVerifiedAgent.lastCheckInDate = todayStr;
          }
          if (res && res.success) {
            showToast(res.message, 'success');
          } else if (res) {
            showToast(res.message, res.alreadyCheckedIn ? 'info' : 'error');
          }
        } catch(e) {
          console.error('Daily check-in error:', e);
          showToast('ئىمزا قويۇشتا خاتالىق كۆرۈلدى', 'error');
        } finally {
          if (currentVerifiedAgent) {
            updateAgentDashboard(currentVerifiedAgent);
          } else {
            btnCheckIn.disabled = false;
            btnCheckIn.innerHTML = '<i class="fas fa-check-circle"></i> <span>📌 بۈگۈن كىردىم (ئىمزا قويۇش)</span>';
          }
        }
      });
    }
    if (btnQuickAdd) {
      btnQuickAdd.addEventListener('click', () => {
        if (currentVerifiedAgent && window.appStore && typeof window.appStore.checkAgentDailyProductLimit === 'function') {
          const quota = window.appStore.checkAgentDailyProductLimit(currentVerifiedAgent.id);
          if (!quota.allowed) {
            showToast(quota.message || '⚠️ بۈگۈنكى مەھسۇلات يوللاش چېكىڭىز توشتى.', 'warning');
          }
        }
        resetToNewProductMode();
        switchAgentPortalView('submit');
      });
    }
    if (btnAddNewMode) {
      btnAddNewMode.addEventListener('click', () => {
        if (currentVerifiedAgent && window.appStore && typeof window.appStore.checkAgentDailyProductLimit === 'function') {
          const quota = window.appStore.checkAgentDailyProductLimit(currentVerifiedAgent.id);
          if (!quota.allowed) {
            showToast(quota.message || '⚠️ بۈگۈنكى مەھسۇلات يوللاش چېكىڭىز توشتى.', 'warning');
          }
        }
        resetToNewProductMode();
        switchAgentPortalView('submit');
      });
    }
    if (btnCancelEdit) {
      btnCancelEdit.addEventListener('click', () => {
        resetToNewProductMode();
        switchAgentPortalView('products');
      });
    }

    if (btnCopyCode) {
      btnCopyCode.addEventListener('click', () => {
        const codeVal = document.getElementById('dashAgentCodeVal')?.textContent || (currentVerifiedAgent ? currentVerifiedAgent.id : '');
        if (codeVal) {
          navigator.clipboard.writeText(codeVal);
          showToast(`«${codeVal}» كودىڭىز كۆچۈرۈلدى!`, 'success');
        }
      });
    }

    if (btnRefresh) {
      btnRefresh.addEventListener('click', async () => {
        const icon = document.getElementById('iconAgentRefresh');
        if (icon) icon.classList.add('fa-spin');
        try {
          if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.syncProductsFromCloud === 'function') {
            try { await window.TeklimakanSupabase.syncProductsFromCloud(); } catch(e){}
          }
          if (currentVerifiedAgent) {
            if (window.appStore && typeof window.appStore.findAgentAsync === 'function') {
              try {
                const fresh = await window.appStore.findAgentAsync(currentVerifiedAgent.id, true);
                if (fresh) currentVerifiedAgent = fresh;
              } catch(e) {}
            }
            updateAgentDashboard(currentVerifiedAgent);
            renderAgentProductsList(currentVerifiedAgent.id);
          }
        } finally {
          setTimeout(() => {
            if (icon) icon.classList.remove('fa-spin');
            showToast('سانلىق مەلۇماتلار بۇلۇتتىن يېڭىلاندى!', 'success');
          }, 400);
        }
      });
    }

    if (btnQuickContract) {
      btnQuickContract.addEventListener('click', () => {
        if (currentVerifiedAgent && window.appStore && typeof window.appStore.downloadAgentContract === 'function') {
          window.appStore.downloadAgentContract(currentVerifiedAgent);
          showToast('📥 كېلىشىمنامىڭىز تېلېفوندىن چۈشۈرۈلدى!', 'success');
        } else {
          const btnDownload = document.getElementById('btnDownloadContractBeforeApply');
          if (btnDownload) {
            btnDownload.click();
          } else {
            switchTab('apply');
            const termsBox = document.getElementById('agentContractTermsBox');
            if (termsBox) termsBox.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }

    // 📊 تاۋار ستاتىستىكا كارتلىرىنى چەككەندە بىۋاسىتە سۈزۈپ كۆرسىتىش (Interactive Dashboard Metric Cards)
    function filterAgentProductsBy(status) {
      if (!currentVerifiedAgent) return;
      switchAgentPortalView('products');
      const q = myProductsSearchInput ? myProductsSearchInput.value.trim() : '';
      renderAgentProductsList(currentVerifiedAgent.id, q, status);
      const wrap = document.getElementById('agentMyProductsWrap');
      if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const cardTotal = document.getElementById('dashCardTotal');
    const cardApproved = document.getElementById('dashCardApproved');
    const cardPending = document.getElementById('dashCardPending');
    const cardNeedsImg = document.getElementById('dashNeedsImgBox');

    if (cardTotal) cardTotal.addEventListener('click', () => filterAgentProductsBy('all'));
    if (cardApproved) cardApproved.addEventListener('click', () => filterAgentProductsBy('approved'));
    if (cardPending) cardPending.addEventListener('click', () => filterAgentProductsBy('pending'));
    if (cardNeedsImg) cardNeedsImg.addEventListener('click', () => filterAgentProductsBy('needs_image'));

    // 📊 تاۋار سېتىش ستاتىستىكا كارتلىرىنى چەككەندە بىۋاسىتە سېتىشلار بۆلىكىگە يۆتكەپ سۈزۈپ كۆرسىتىش
    function filterAgentSalesBy(status = 'all') {
      if (!currentVerifiedAgent) return;
      switchAgentPortalView('sales');
      renderAgentSalesList(currentVerifiedAgent.id, status);
      const wrap = document.getElementById('agentMySalesWrap');
      if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // 📈 كۈندىلىك تەھلىل كارتلىرىنى چەككەندە ئەسكەرتىش بېرىش
    const cardDailyVis = document.getElementById('dashCardDailyVisitors');
    const cardDailyOrd = document.getElementById('dashCardDailyOrders');
    const cardDailyProf = document.getElementById('dashCardDailyProfit');

    if (cardDailyVis) {
      cardDailyVis.addEventListener('click', () => {
        const v = document.getElementById('dashDailyVisitors')?.textContent || '0';
        showToast(`👁️ بۈگۈن مەھسۇلاتلىرىڭىزنى ${v} قېتىم خېرىدارلار كۆردى.`, 'info');
      });
    }
    if (cardDailyOrd) {
      cardDailyOrd.addEventListener('click', () => {
        const o = document.getElementById('dashDailyOrders')?.textContent || '0';
        showToast(`🛍️ بۈگۈن خېرىدارلاردىن ${o} دانە زاكاز تاپشۇرۇۋېلىندى.`, 'info');
        filterAgentSalesBy('all');
      });
    }
    if (cardDailyProf) {
      cardDailyProf.addEventListener('click', () => {
        const p = document.getElementById('dashDailyProfit')?.textContent || '₺0';
        showToast(`💵 بۈگۈنكى تاپقان پايدىڭىز: ${p}`, 'success');
        filterAgentSalesBy('all');
      });
    }

    // 💰 زاكاز ۋە پايدا نەتىجىلىرى كارتلىرىنى چەككەندە سېتىشلار بۆلىكىگە ئۆتۈش
    const cardSold = document.getElementById('dashCardSold');
    const cardShipped = document.getElementById('dashCardShipped');
    const cardCompleted = document.getElementById('dashCardCompleted');
    const cardCancelled = document.getElementById('dashCardCancelled');
    const cardReturned = document.getElementById('dashCardReturned');
    const cardProfit = document.getElementById('dashCardProfit');

    if (cardSold) {
      cardSold.addEventListener('click', () => {
        filterAgentSalesBy('all');
      });
    }
    if (cardShipped) {
      cardShipped.addEventListener('click', () => {
        filterAgentSalesBy('shipped');
      });
    }
    if (cardCompleted) {
      cardCompleted.addEventListener('click', () => {
        filterAgentSalesBy('completed');
      });
    }
    if (cardCancelled) {
      cardCancelled.addEventListener('click', () => {
        filterAgentSalesBy('cancelled');
      });
    }
    if (cardReturned) {
      cardReturned.addEventListener('click', () => {
        filterAgentSalesBy('returned');
      });
    }
    if (cardProfit) {
      cardProfit.addEventListener('click', () => {
        filterAgentSalesBy('completed');
      });
    }

    const myProductsSearchInput = document.getElementById('agentMyProductsSearchInput');
    if (myProductsSearchInput) {
      myProductsSearchInput.addEventListener('input', (e) => {
        if (!currentVerifiedAgent) return;
        const q = e.target.value.trim().toLowerCase();
        renderAgentProductsList(currentVerifiedAgent.id, q);
      });
    }

    let currentAgentProdFilter = 'all';

    function renderAgentProductsList(agentId, filterQuery = '', statusFilter = currentAgentProdFilter) {
      if (!myProductsWrap || !myProductsList) return;
      currentAgentProdFilter = statusFilter;
      let allProducts = window.appStore.getProductsByAgent(agentId) || [];
      myProductsWrap.style.display = 'block';

      // ھالەت سۈزگۈچ كۇنۇپكىلىرىنىڭ كۆرۈنۈشىنى يېڭىلاش
      const filterBtns = document.querySelectorAll('.agent-filter-btn');
      filterBtns.forEach(btn => {
        if (btn.dataset.filter === currentAgentProdFilter) {
          btn.classList.add('active');
          btn.style.background = 'var(--primary-color)';
          btn.style.color = '#ffffff';
          btn.style.borderColor = 'var(--primary-color)';
          btn.style.fontWeight = '800';
        } else {
          btn.classList.remove('active');
          btn.style.background = '#ffffff';
          btn.style.color = '#475569';
          btn.style.borderColor = '#cbd5e1';
          btn.style.fontWeight = '700';
        }
      });

      // ساناقلارنى يېڭىلاش
      const countAll = allProducts.length;
      const countApproved = allProducts.filter(p => (p.approvalStatus || 'تەستىقلاندى') === 'تەستىقلاندى').length;
      const countPending = allProducts.filter(p => p.approvalStatus === 'تەستىق كۈتۈۋاتىدۇ').length;
      const countNeedsImg = allProducts.filter(p => (p.needsAdminImage === true || p.needsAdminImage === 'true') && p.approvalStatus !== 'رەت قىلىندى').length;

      const badgeAll = document.getElementById('agentFilterCountAll');
      const badgeApp = document.getElementById('agentFilterCountApproved');
      const badgePend = document.getElementById('agentFilterCountPending');
      const badgeNeeds = document.getElementById('agentFilterCountNeedsImg');
      const switcherBadge = document.getElementById('switcherProdCount');

      if (badgeAll) badgeAll.textContent = countAll;
      if (badgeApp) badgeApp.textContent = countApproved;
      if (badgePend) badgePend.textContent = countPending;
      if (badgeNeeds) badgeNeeds.textContent = countNeedsImg;
      if (switcherBadge) switcherBadge.textContent = countAll;

      // سۈزۈش (ھالەت بويىچە)
      let products = [...allProducts];
      if (currentAgentProdFilter === 'approved') {
        products = products.filter(p => (p.approvalStatus || 'تەستىقلاندى') === 'تەستىقلاندى');
      } else if (currentAgentProdFilter === 'pending') {
        products = products.filter(p => p.approvalStatus === 'تەستىق كۈتۈۋاتىدۇ');
      } else if (currentAgentProdFilter === 'needs_image') {
        products = products.filter(p => (p.needsAdminImage === true || p.needsAdminImage === 'true') && p.approvalStatus !== 'رەت قىلىندى');
      }

      // ئىزدەش قىممىتى بويىچە
      if (filterQuery) {
        const q = filterQuery.toLowerCase();
        products = products.filter(p => 
          (p.name && p.name.toLowerCase().includes(q)) || 
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q))
        );
      }

      // تېخى بىرەر تاۋار سۇنمىغان بولسا كۆركەم قارشى ئېلىش كارتىسى
      if (allProducts.length === 0) {
        myProductsList.innerHTML = `
          <div style="text-align: center; padding: 2rem 1.25rem; background: #ffffff; border: 2px dashed #cbd5e1; border-radius: 12px; margin: 0.25rem 0;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: #eff6ff; color: #3b82f6; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin: 0 auto 0.75rem auto;">
              <i class="fas fa-boxes"></i>
            </div>
            <h5 style="font-size: 1rem; font-weight: 800; color: #1e293b; margin-bottom: 0.35rem;">سىز تېخى بىرەر مەھسۇلات سۇنمىدىڭىز</h5>
            <p style="font-size: 0.84rem; color: #64748b; margin: 0 auto 1.25rem auto; max-width: 380px; line-height: 1.5;">
              سۇپىمىزدا مەھسۇلاتىڭىزنى دەرھال ئېلان قىلىپ، خېرىدارلارغا سېتىشنى باشلاڭ.
            </p>
            <button type="button" id="btnEmptyAddProduct" class="btn-checkout" style="padding: 0.6rem 1.25rem; font-size: 0.88rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.45rem; margin: 0 auto;">
              <i class="fas fa-plus-circle"></i> + تۇنجى مەھسۇلاتنى قوشۇش
            </button>
          </div>
        `;
        const btnEmptyAdd = document.getElementById('btnEmptyAddProduct');
        if (btnEmptyAdd) {
          btnEmptyAdd.addEventListener('click', () => {
            if (currentVerifiedAgent && window.appStore && typeof window.appStore.checkAgentDailyProductLimit === 'function') {
              const quota = window.appStore.checkAgentDailyProductLimit(currentVerifiedAgent.id);
              if (!quota.allowed) {
                showToast('⚠️ بۈگۈنكى مەھسۇلات يوللاش چېكىڭىز توشتى (1/1). بار بولغان تاۋارلىرىڭىزنى تەھرىرلىسىڭىز بولىدۇ.', 'warning');
              }
            }
            resetToNewProductMode();
            switchAgentPortalView('submit');
          });
        }
        return;
      }

      if (products.length === 0) {
        myProductsList.innerHTML = `
          <div style="text-align: center; padding: 1.5rem 1rem; color: #64748b; font-size: 0.86rem; background: #ffffff; border-radius: 8px;">
            <i class="fas fa-search" style="font-size: 1.4rem; color: #94a3b8; display: block; margin-bottom: 0.4rem;"></i>
            ماس كېلىدىغان تاۋار تېپىلمىدى.
          </div>
        `;
        return;
      }

      myProductsList.innerHTML = products.map(p => {
        const isPending = (p.approvalStatus === 'تەستىق كۈتۈۋاتىدۇ');
        const isApproved = (p.approvalStatus === 'تەستىقلاندى');
        const needsAdminImg = !!p.needsAdminImage || p.needsAdminImage === 'true';

        let statusBadge = '';
        if (needsAdminImg) {
          statusBadge = '<span style="background:#fff1f2; color:#be123c; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:800; border:1px solid #fda4af; display:inline-flex; align-items:center; gap:3px;"><i class="fas fa-camera"></i> باشقۇرغۇچى سۈرەت تولۇقلايدۇ</span>';
        } else if (isApproved) {
          statusBadge = '<span style="background:#ecfdf5; color:#065f46; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:800; border:1px solid #a7f3d0; display:inline-flex; align-items:center; gap:3px;"><i class="fas fa-check-circle"></i> دۇكاندا سېتىلىۋاتىدۇ</span>';
        } else if (isPending) {
          statusBadge = '<span style="background:#fffbeb; color:#92400e; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:800; border:1px solid #fde68a; display:inline-flex; align-items:center; gap:3px;"><i class="fas fa-clock"></i> تەكشۈرۈش كۈتۈۋاتىدۇ</span>';
        } else {
          statusBadge = '<span style="background:#fef2f2; color:#991b1b; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:800; border:1px solid #fecaca; display:inline-flex; align-items:center; gap:3px;"><i class="fas fa-times-circle"></i> رەت قىلىندى</span>';
        }

        const priceFormatted = window.appStore.formatPrice(p.price);
        const pUnit = p.unit || 'دانە';
        const viewInStoreBtn = isApproved ? `
          <button type="button" class="btn-view-live-product" data-id="${p.id}" title="دۇكاندىكى مەھسۇلاتنى كۆرۈش" style="background:#f0fdf4; color:#15803d; border:1px solid #86efac; border-radius:6px; padding:0.35rem 0.6rem; font-size:0.78rem; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:0.25rem;">
            <i class="fas fa-external-link-alt"></i> دۇكاندا كۆرۈش
          </button>
        ` : '';

        return `
          <div style="display:flex; justify-content:space-between; align-items:center; background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:0.7rem 0.85rem; gap:0.6rem; flex-wrap:wrap; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
            <div style="display:flex; align-items:center; gap:0.75rem; flex:1; min-width:200px;">
              <img src="${p.image || 'images/logo_circle.png'}" onerror="this.onerror=null; this.src='images/logo_circle.png'" style="width:48px; height:48px; border-radius:8px; object-fit:cover; border:1px solid #cbd5e1; flex-shrink:0;">
              <div style="min-width:0; flex:1;">
                <div style="font-size:0.9rem; font-weight:800; color:#1e293b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${p.name}">${p.name}</div>
                <div style="display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap; font-size:0.76rem; color:#64748b; margin-top:2px;">
                  <span>ماركا: <b>${p.brand || 'تەكلىماكان'}</b></span>
                  <span>•</span>
                  <span>باھاسى: <b style="color:var(--primary-color);">${priceFormatted} / <bdi>${pUnit}</bdi></b></span>
                  <span>•</span>
                  <span>زاپاس: <b>${p.stock}</b></span>
                </div>
                <div style="margin-top:4px;">${statusBadge}</div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:0.35rem; flex-wrap:wrap;">
              ${viewInStoreBtn}
              <button type="button" class="btn-edit-agent-product" data-id="${p.id}" style="background:#eff6ff; color:#1e40af; border:1px solid #bfdbfe; border-radius:6px; padding:0.35rem 0.65rem; font-size:0.78rem; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:0.25rem;">
                <i class="fas fa-edit"></i> تەھرىرلەش
              </button>
              <button type="button" class="btn-delete-agent-product" data-id="${p.id}" title="سۇنۇشنى بىكار قىلىش ياكى ئۆچۈرۈش" style="background:#fef2f2; color:#ef4444; border:1px solid #fecaca; border-radius:6px; padding:0.35rem 0.55rem; font-size:0.78rem; cursor:pointer;">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');

      // تېز ئۆچۈرۈش
      myProductsList.querySelectorAll('.btn-delete-agent-product').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const p = allProducts.find(x => x.id === id);
          if (!p) return;
          if (confirm(`«${p.name}» نى راستلا ئۆچۈرەمسىز؟`)) {
            window.appStore.deleteProduct(id);
            if (currentVerifiedAgent) {
              updateAgentDashboard(currentVerifiedAgent);
              renderAgentProductsList(currentVerifiedAgent.id, myProductsSearchInput ? myProductsSearchInput.value.trim() : '');
            }
            showToast('مەھسۇلات ئۆچۈرۈلدى!', 'info');
          }
        });
      });

      // دۇكاندا كۆرۈش
      myProductsList.querySelectorAll('.btn-view-live-product').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          if (typeof closeModal === 'function') closeModal();
          setTimeout(() => {
            const card = document.querySelector(`.product-card[data-id="${id}"]`);
            if (card) {
              card.scrollIntoView({ behavior: 'smooth', block: 'center' });
              card.style.outline = '3px solid #10b981';
              setTimeout(() => { card.style.outline = 'none'; }, 2000);
            } else {
              showToast('مەھسۇلات باش بەتتىكى تىزىملىكتە كۆرسىتىلدى', 'info');
            }
          }, 300);
        });
      });

      // تەھرىرلەش
      myProductsList.querySelectorAll('.btn-edit-agent-product').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const p = allProducts.find(x => x.id === id);
          if (!p) return;

          if (editProdIdInput) editProdIdInput.value = p.id;
          document.getElementById('agentProdName').value = p.name || '';
          if (prodBrandSelect) prodBrandSelect.value = p.brand || (prodBrandSelect.options[0] ? prodBrandSelect.options[0].value : '');
          if (prodCatSelect) prodCatSelect.value = p.category || '';
          document.getElementById('agentProdPrice').value = p.price || '';
          document.getElementById('agentProdOldPrice').value = p.oldPrice || '';
          document.getElementById('agentProdStock').value = p.stock || '';

          const pUnit = p.unit || 'دانە';
          if (agentUnitInput) agentUnitInput.value = pUnit;
          if (agentUnitSelect) {
            const match = Array.from(agentUnitSelect.options).find(opt => opt.value === pUnit);
            agentUnitSelect.value = match ? pUnit : 'custom';
          }

          if (agentImageInput) agentImageInput.value = p.image || '';
          document.getElementById('agentProdDesc').value = p.description || '';

          const scopeSelect = document.getElementById('agentProdLanguageScope');
          if (scopeSelect) {
            if (currentVerifiedAgent && currentVerifiedAgent.canPublishMultilingual) {
              scopeSelect.value = p.languageScope || 'all';
            } else {
              scopeSelect.value = 'ug';
            }
          }

          if (previewImg && p.image) {
            previewImg.src = p.image;
            if (previewWrap) previewWrap.style.display = 'block';
          }

          if (editBanner) {
            editBanner.style.display = 'flex';
            if (editBannerTitle) editBannerTitle.textContent = `«${p.name}» نى تەھرىرلەۋاتىسىز:`;
          }

          // 💡 تەھرىرلەشكە ھېچقانداق چەك قويۇلمىغان؛ چەك ئەسكەرتمىسىنى يوشۇرۇش ۋە كۇنۇپكىنى تولۇق ئاكتىپلاش
          const dailyLimitBanner = document.getElementById('agentDailyLimitNoticeBanner');
          if (dailyLimitBanner) dailyLimitBanner.style.display = 'none';
          const submitBtn = document.getElementById('btnAgentSubmitProductAction');
          if (submitBtn) {
            submitBtn.removeAttribute('data-daily-blocked');
            submitBtn.removeAttribute('data-quota-blocked');
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
            submitBtn.title = '';
          }

          if (submitBtnText) submitBtnText.textContent = '💾 باھا ۋە ئۇچۇرنى ساقلاپ قايتا تەستىققا يوللاش';
          if (submitBtnIcon) submitBtnIcon.className = 'fas fa-save';

          switchAgentPortalView('submit');
          showToast(`«${p.name}» نىڭ ئۇچۇرلىرى كىرگۈزۈلدى. باھا ياكى نامىنى ئۆزگەرتىپ قايتا سۇنۇڭ.`, 'info');
        });
      });
    }

    // سۈزگۈچ كۇنۇپكىلىرى چېكىلگەندە
    document.querySelectorAll('.agent-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const filterType = btn.dataset.filter || 'all';
        if (currentVerifiedAgent) {
          const q = myProductsSearchInput ? myProductsSearchInput.value.trim() : '';
          renderAgentProductsList(currentVerifiedAgent.id, q, filterType);
        }
      });
    });

    // 📜 سىيرىلما كۆزنەك نىزامنامىنى ئېچىش / يىغىش (Accordion toggle)
    const btnToggleAgentRegulations = document.getElementById('btnToggleAgentRegulations');
    const agentRegulationsBody = document.getElementById('agentRegulationsBody');
    const agentRegChevron = document.getElementById('agentRegChevron');

    if (btnToggleAgentRegulations && agentRegulationsBody) {
      btnToggleAgentRegulations.addEventListener('click', () => {
        const isHidden = agentRegulationsBody.style.display === 'none' || !agentRegulationsBody.style.display;
        if (isHidden) {
          agentRegulationsBody.style.display = 'block';
          if (agentRegChevron) agentRegChevron.style.transform = 'rotate(180deg)';
        } else {
          agentRegulationsBody.style.display = 'none';
          if (agentRegChevron) agentRegChevron.style.transform = 'rotate(0deg)';
        }
      });
    }

    // تاۋار سۈرىتى تاللاش (تېز، ئاپتوماتىك پىرىسلاش ۋە سۇپا تامغىسى بېسىش)
    const agentFileInput = document.getElementById('agentFileInput');
    const agentFileInputCamera = document.getElementById('agentFileInputCamera');
    const btnPasteAgentProdImg = document.getElementById('btnPasteAgentProductImage');
    const agentImageInput = document.getElementById('agentProdImage');
    const previewWrap = document.getElementById('agentImagePreviewWrap');
    const previewImg = document.getElementById('agentImagePreviewImg');
    const secStatus = document.getElementById('agentImageSecStatus');
    let agentImageProcessing = false;

    async function processAgentProductFile(file) {
      if (!file) return;

      // ھۆججەت سىغىمى بەك غايەت زور بولسا (35MB تىن ئارتۇق)
      if (file.size > 35 * 1024 * 1024) {
        alert('🚫 سۈرەت ھۆججىتى بەك چوڭ (35MB تىن ئارتۇق)! بىر ئاز كىچىكرەك سۈرەت تاللاڭ.');
        showToast('سۈرەت ھۆججىتى 35MB تىن كىچىك بولۇشى كېرەك', 'error');
        if (agentFileInput) agentFileInput.value = '';
        if (agentFileInputCamera) agentFileInputCamera.value = '';
        return;
      }

      // 1-قائىدە: ھۆججەت نامىدىن تاشقى ئېلان، ئالاقە ياكى تېلېفون سۈزۈش
      const fileName = file.name || 'image.jpg';
      const nameSec = window.appStore.validateProductImageSecurity(fileName, fileName, false, {
        fileName: fileName,
        fileType: file.type || 'image/jpeg',
        fileSize: file.size,
        isProcessed: false
      });
      if (!nameSec.valid) {
        alert(nameSec.message);
        showToast(nameSec.message, 'error');
        if (agentFileInput) agentFileInput.value = '';
        if (agentFileInputCamera) agentFileInputCamera.value = '';
        return;
      }

      showToast('سۈرەت تەييارلىنىپ سۇپا تامغىسى بېسىلىۋاتىدۇ...', 'info');
      agentImageProcessing = true;

      const reader = new FileReader();
      reader.onerror = () => {
        agentImageProcessing = false;
        showToast('سۈرەت ھۆججىتىنى ئوقۇش مەغلۇپ بولدى', 'error');
      };
      reader.onload = function(evt) {
        const rawBase64 = evt.target.result;
        const img = new Image();
        img.onerror = () => {
          agentImageProcessing = false;
          showToast('سۈرەت مەزمۇنىنى ئوقۇش مەغلۇپ بولدى', 'error');
        };
        img.onload = async function() {
          // 2-قائىدە & 1-قائىدە: ئادەم سۈرىتى ياكى تاشقى نومۇرلارنى سۈزۈش
          const sec = window.appStore.validateProductImageSecurity(rawBase64, fileName, false, {
            width: img.width,
            height: img.height,
            fileName: fileName,
            fileType: file.type || 'image/jpeg',
            fileSize: file.size,
            isProcessed: false
          });

          if (!sec.valid) {
            alert(sec.message);
            showToast(sec.message, 'error');
            if (agentFileInput) agentFileInput.value = '';
            if (agentFileInputCamera) agentFileInputCamera.value = '';
            if (agentImageInput) agentImageInput.value = '';
            if (previewWrap) previewWrap.style.display = 'none';
            agentImageProcessing = false;
            return;
          }

          // 📸 ئەقلىي سۈرەت تەكرارلىق تەكشۈرۈش (Image dHash Duplicate Check)
          try {
            if (window.appStore && typeof window.appStore.computeImageDHash === 'function') {
              const dHash = await window.appStore.computeImageDHash(img);
              const dHashInput = document.getElementById('agentImageDHash');
              if (dHashInput && dHash) dHashInput.value = dHash;

              const editId = editProdIdInput ? editProdIdInput.value.trim() : '';
              const aId = currentVerifiedAgent ? currentVerifiedAgent.id : null;
              const imgDup = window.appStore.checkProductDuplicate({
                imageHash: dHash,
                id: editId,
                agentId: aId
              });

              const imgNoticeBox = document.getElementById('agentImageDuplicateNotice');
              const imgNoticeText = document.getElementById('agentImageDuplicateNoticeText');
              if (imgDup && imgDup.blocked && imgDup.reason === 'duplicate_image' && imgDup.matchedProduct) {
                if (imgNoticeBox && imgNoticeText) {
                  imgNoticeBox.style.display = 'block';
                  imgNoticeText.innerHTML = '⚠️ دىققەت: بۇ رەسىم سۇپىدىكى مەۋجۇت تاۋار <strong>«' + escapeModalHtml(imgDup.matchedProduct.name) + '»</strong> نىڭ سۈرىتى بىلەن تەكرار (%' + imgDup.similarityScore + ' ئوخشاش)! سۇپا سۈپىتىنى ساقلاش ئۈچۈن باشقا ئۆزگىچە سۈرەت ئىشلىتىڭ.';
                }
              } else {
                if (imgNoticeBox) imgNoticeBox.style.display = 'none';
              }
            }
          } catch (dHashErr) {
            console.warn('dHash duplicate check warning:', dHashErr);
          }

          // 5-قائىدە: ئاپتوماتىك كۆلەمنى تەڭشەش ۋە «تەكلىماكان كاپالىتى» ئالتۇن تامغىسىنى بېسىش
          let finalImageSrc = rawBase64;
          let displayW = img.width;
          let displayH = img.height;

          try {
            const wmRes = await window.appStore.applyTeklimakanWatermark(img);
            if (wmRes && wmRes.dataUrl) {
              finalImageSrc = wmRes.dataUrl;
              displayW = wmRes.width;
              displayH = wmRes.height;
            }
          } catch (wmErr) {
            console.warn('Watermark generation error:', wmErr);
          }

          if (finalImageSrc.length > 700 * 1024 * 4 / 3) {
            agentImageProcessing = false;
            showToast('رەسىم يەنىلا چوڭ؛ تېلېفوندا كىچىكرەك نۇسخىسىنى تاللاڭ.', 'error');
            return;
          }

          if (agentImageInput) agentImageInput.value = finalImageSrc;
          if (previewImg) previewImg.src = finalImageSrc;
          if (previewWrap) previewWrap.style.display = 'block';
          agentImageProcessing = false;

          // تېخنىكىلىق كۆرسەتكۈچلەرنى يېڭىلاش
          const dimBadge = document.getElementById('agentImgDimBadge');
          const formatBadge = document.getElementById('agentImgFormatBadge');
          const sizeBadge = document.getElementById('agentImgSizeBadge');
          const wmBadge = document.getElementById('agentImgWatermarkBadge');

          if (dimBadge) dimBadge.textContent = `${displayW} × ${displayH} px`;
          if (formatBadge) formatBadge.textContent = 'JPEG';
          if (sizeBadge) {
            const approxKb = Math.round((finalImageSrc.length * 3 / 4) / 1024);
            sizeBadge.textContent = `${approxKb} KB`;
          }
          if (wmBadge) wmBadge.innerHTML = '<span style="color: #059669; font-weight: 800;"><i class="fas fa-check-circle"></i> ✓ «🛡️ Teklimakan.com» قوغداش تەڭشەلدى</span>';

          if (secStatus) {
            secStatus.innerHTML = '<span style="color: #059669;"><i class="fas fa-check-circle"></i> سۈرەت تەييارلاندى ۋە «🛡️ Teklimakan.com» قوغداش تەڭشەلدى</span>';
          }
          showToast('✅ سۈرەت مۇۋەپپەقىيەتلىك ئەكىرىلدى ۋە «🛡️ Teklimakan.com» قوغداش تەڭشەلدى!', 'success');
        };
        img.src = rawBase64;
      };
      reader.readAsDataURL(file);
    }

    if (agentFileInput) {
      agentFileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        processAgentProductFile(file);
      });
    }

    const btnRequestAdminImg = document.getElementById('btnRequestAdminImageUpload');
    const btnCancelAdminImg = document.getElementById('btnCancelAdminImageRequest');
    const adminImgCard = document.getElementById('agentAdminImageChosenCard');
    const needsAdminImgInput = document.getElementById('agentNeedsAdminImage');
    const tipBox = document.getElementById('agentImgHelpTipBox');

    if (btnRequestAdminImg) {
      btnRequestAdminImg.addEventListener('click', () => {
        if (needsAdminImgInput) needsAdminImgInput.value = 'true';
        if (adminImgCard) adminImgCard.style.display = 'block';
        if (tipBox) tipBox.style.display = 'none';
        if (previewWrap) previewWrap.style.display = 'none';
        if (agentImageInput) {
          agentImageInput.value = '';
        }
        showToast('👑 «باشقۇرغۇچى يۈكلەش» تاللاندى! رەسىمسىزمۇ مەھسۇلاتنى تەستىققا يوللىيالايسىز.', 'success');
      });
    }

    if (btnCancelAdminImg) {
      btnCancelAdminImg.addEventListener('click', () => {
        if (needsAdminImgInput) needsAdminImgInput.value = 'false';
        if (adminImgCard) adminImgCard.style.display = 'none';
        if (tipBox) tipBox.style.display = 'block';
        if (agentImageInput) agentImageInput.value = '';
        showToast('ئۆزىڭىز سۈرەت تاللاشنى داۋاملاشتۇرالايسىز', 'info');
      });
    }

    if (agentImageInput) {
      agentImageInput.addEventListener('blur', () => {
        const val = agentImageInput.value.trim();
        if (!val) return;
        const sec = window.appStore.validateProductImageSecurity(val, val, false);
        if (!sec.valid) {
          alert(sec.message);
          showToast(sec.message, 'error');
          agentImageInput.value = '';
          if (previewWrap) previewWrap.style.display = 'none';
          return;
        }
        if (previewImg) previewImg.src = val;
        if (previewWrap) previewWrap.style.display = 'block';
        if (secStatus) {
          secStatus.innerHTML = '<span style="color: #059669;"><i class="fas fa-check-circle"></i> سۈرەت ئۇلانمىسى قوبۇل قىلىندى</span>';
        }
      });
    }

    // ==================== ⚡ مەھسۇلات نامى بويىچە بارلىق ئۇچۇر، باھا ۋە رەسىمنى ئاپتوماتىك ئەكىلىش ====================
    const prodNameInput = document.getElementById('agentProdName');
    const prodAutoList = document.getElementById('agentProdAutocompleteList');
    const autofillNotice = document.getElementById('agentAutofillNotice');
    const autofillNoticeTitle = document.getElementById('agentAutofillNoticeTitle');
    const btnClearAutofill = document.getElementById('btnAgentClearAutofill');

    let currentSuggestions = [];
    let selectedSuggestIndex = -1;
    let autofillDebounceTimer = null;

    function highlightAgentField(el) {
      if (!el) return;
      el.style.transition = 'all 0.35s ease';
      el.style.backgroundColor = '#ecfdf5';
      el.style.borderColor = '#10b981';
      el.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.2)';
      setTimeout(() => {
        el.style.backgroundColor = '';
        el.style.borderColor = '';
        el.style.boxShadow = '';
      }, 1500);
    }

    // 👥 ئوخشاش مەھسۇلاتنىڭ 3 ۋاكالەتچى سېتىش چېكى ۋە ئەقلىي تەكرارلىقنى يېڭىلاش
    function updateSameProductQuotaNotice(prodName) {
      const noticeBox = document.getElementById('agentSameProdQuotaNotice');
      const icon = document.getElementById('agentSameProdQuotaIcon');
      const text = document.getElementById('agentSameProdQuotaText');
      const badge = document.getElementById('agentSameProdQuotaBadge');
      const submitBtn = document.getElementById('btnAgentSubmitProductAction');
      const dupActionCard = document.getElementById('agentDuplicateActionCard');
      const dupScoreBadge = document.getElementById('agentDuplicateSimScoreBadge');
      const dupThumb = document.getElementById('agentDuplicateMatchedThumb');
      const dupTitle = document.getElementById('agentDuplicateMatchedTitle');
      const dupPrice = document.getElementById('agentDuplicateMatchedPrice');
      const btnCopyCoSell = document.getElementById('btnAgentCopyDuplicateCoSell');
      const btnDiffSpec = document.getElementById('btnAgentSpecifyDifferentSpec');

      if (!noticeBox || !text || !badge) return;

      const editId = editProdIdInput ? editProdIdInput.value.trim() : '';
      const name = (prodName || '').trim();

      if (!name || name.length < 2) {
        noticeBox.style.display = 'none';
        if (dupActionCard) dupActionCard.style.display = 'none';
        return;
      }

      if (!window.appStore || typeof window.appStore.checkProductDuplicate !== 'function') {
        noticeBox.style.display = 'none';
        if (dupActionCard) dupActionCard.style.display = 'none';
        return;
      }

      const agentId = currentVerifiedAgent ? currentVerifiedAgent.id : null;
      const dupRes = window.appStore.checkProductDuplicate({
        name: name,
        id: editId,
        agentId: agentId,
        maxQuota: 3
      });

      noticeBox.style.display = 'flex';

      if (dupRes.blocked) {
        noticeBox.style.background = '#fff1f2';
        noticeBox.style.border = '1.5px solid #fecdd3';
        noticeBox.style.color = '#9f1239';
        if (icon) {
          icon.className = 'fas fa-exclamation-triangle';
          icon.style.color = '#e11d48';
        }
        text.innerHTML = dupRes.message.replace(/\n/g, '<br>');
        badge.textContent = dupRes.shortBadge || 'تەكرار';
        badge.style.background = '#fee2e2';
        badge.style.color = '#b91c1c';
        badge.style.border = '1px solid #fca5a5';

        // مەۋجۇت تاۋار ھەرىكەت كارتوچكىسىنى تولدۇرۇش
        if (dupActionCard && dupRes.matchedProduct) {
          dupActionCard.style.display = 'block';
          if (dupScoreBadge) dupScoreBadge.textContent = dupRes.shortBadge || ('%' + dupRes.similarityScore + ' ئوخشاش');
          if (dupThumb) dupThumb.src = dupRes.matchedProduct.image || 'images/default-product.jpg';
          if (dupTitle) dupTitle.textContent = dupRes.matchedProduct.name;
          if (dupPrice) dupPrice.textContent = 'باھاسى: ₺' + (dupRes.matchedProduct.price || 0);

          if (btnCopyCoSell) {
            btnCopyCoSell.onclick = (e) => {
              e.preventDefault();
              const url = dupRes.coSellUrl;
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(() => {
                  showToast('✅ «' + dupRes.matchedProduct.name + '» نىڭ شەخسىي سېتىش ئۇلانمىسى كۆچۈرۈلدى! بارلىق كىرىم سىزگە يېزىلىدۇ.', 'success');
                });
              } else {
                prompt('سېتىش ئۇلانمىڭىز:', url);
              }
            };
          }

          if (btnDiffSpec) {
            btnDiffSpec.onclick = (e) => {
              e.preventDefault();
              const nameIn = document.getElementById('agentProdName');
              if (nameIn) {
                nameIn.focus();
                nameIn.value = nameIn.value + ' ';
                showToast('💡 تاۋار نامىغا ئۆلچىمىنى (مەسىلەن: 50ml ياكى 100g) ياكى ماركىسىنى قوشۇپ كىرگۈزۈڭ.', 'info');
              }
            };
          }
        }

        if (submitBtn && !editId) {
          submitBtn.setAttribute('data-quota-blocked', 'true');
          submitBtn.style.opacity = '0.65';
          submitBtn.style.cursor = 'not-allowed';
          submitBtn.title = 'بۇ تاۋار دۇكاندا بار ياكى تەكرار بولغانلىقى ئۈچۈن بىۋاسىتە شەخسىي ئۇلانمىسى بىلەن سېتىش تەۋسىيە قىلىنىدۇ.';
        }
      } else {
        if (dupActionCard) dupActionCard.style.display = 'none';

        if (dupRes.severity === 'medium') {
          noticeBox.style.background = '#fffbeb';
          noticeBox.style.border = '1.5px solid #fde68a';
          noticeBox.style.color = '#92400e';
          if (icon) {
            icon.className = 'fas fa-info-circle';
            icon.style.color = '#d97706';
          }
          text.innerHTML = dupRes.message.replace(/\n/g, '<br>');
          badge.textContent = dupRes.shortBadge || 'يېقىن تاۋار';
          badge.style.background = '#fef3c7';
          badge.style.color = '#b45309';
          badge.style.border = '1px solid #fcd34d';
        } else if (dupRes.agentCount > 0) {
          noticeBox.style.background = '#eff6ff';
          noticeBox.style.border = '1.5px solid #bfdbfe';
          noticeBox.style.color = '#1e40af';
          if (icon) {
            icon.className = 'fas fa-users';
            icon.style.color = '#2563eb';
          }
          text.innerHTML = 'ℹ️ بۇ مەھسۇلاتنى ھازىر <strong>' + dupRes.agentCount + ' ۋاكالەتچى</strong> سېتىۋاتىدۇ (سىستېما بويىچە يەنە <strong>' + Math.max(0, 3 - dupRes.agentCount) + ' نەپەر</strong> ئېلان قىلالايدۇ).';
          badge.textContent = dupRes.agentCount + '/3 ئورۇن';
          badge.style.background = '#dbeafe';
          badge.style.color = '#1d4ed8';
          badge.style.border = '1px solid #93c5fd';
        } else {
          noticeBox.style.background = '#ecfdf5';
          noticeBox.style.border = '1.5px solid #a7f3d0';
          noticeBox.style.color = '#065f46';
          if (icon) {
            icon.className = 'fas fa-check-circle';
            icon.style.color = '#10b981';
          }
          text.innerHTML = '✅ بۇ مەھسۇلاتنى تېخى ھېچكىم يوللىمىغان، <strong>تۇنجى بولۇپ سېتىش پۇرسىتى سىزدە</strong>!';
          badge.textContent = '0/3 ئەركىن';
          badge.style.background = '#dcfce7';
          badge.style.color = '#15803d';
          badge.style.border = '1px solid #86efac';
        }

        if (submitBtn) {
          submitBtn.removeAttribute('data-quota-blocked');
          const isDailyBlocked = submitBtn.getAttribute('data-daily-blocked') === 'true';
          if (!isDailyBlocked || editId) {
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
            submitBtn.disabled = false;
            submitBtn.title = '';
          }
        }
      }
    }

    function autofillAgentProduct(p, showToastMsg = true) {
      if (!p) return;

      // 1. مەھسۇلات نامى
      if (prodNameInput) {
        prodNameInput.value = p.name;
        highlightAgentField(prodNameInput);
      }

      // 2. ماركىسى
      if (prodBrandSelect && p.brand) {
        const hasBrand = Array.from(prodBrandSelect.options).some(opt => opt.value === p.brand);
        if (hasBrand) {
          prodBrandSelect.value = p.brand;
        } else {
          const opt = new Option(p.brand, p.brand, true, true);
          prodBrandSelect.add(opt);
          prodBrandSelect.value = p.brand;
        }
        highlightAgentField(prodBrandSelect);
      }

      // 3. تۈرى
      if (prodCatSelect && p.category) {
        const hasCat = Array.from(prodCatSelect.options).some(opt => opt.value === p.category);
        if (hasCat) {
          prodCatSelect.value = p.category;
        } else {
          const closeCat = Array.from(prodCatSelect.options).find(opt => 
            opt.value.includes(p.category) || p.category.includes(opt.value)
          );
          if (closeCat) {
            prodCatSelect.value = closeCat.value;
          } else {
            const opt = new Option(p.category, p.category, true, true);
            prodCatSelect.add(opt);
            prodCatSelect.value = p.category;
          }
        }
        highlightAgentField(prodCatSelect);
      }

      // 4. باھاسى ۋە ئەسلى باھاسى
      const priceInput = document.getElementById('agentProdPrice');
      if (priceInput) {
        priceInput.value = p.price;
        highlightAgentField(priceInput);
      }
      const oldPriceInput = document.getElementById('agentProdOldPrice');
      if (oldPriceInput) {
        oldPriceInput.value = p.oldPrice || Math.round(Number(p.price) * 1.25);
        highlightAgentField(oldPriceInput);
      }

      // 5. زاپاس مىقدارى
      const stockInput = document.getElementById('agentProdStock');
      if (stockInput) {
        stockInput.value = p.stock || 50;
        highlightAgentField(stockInput);
      }

      // 6. مىقدارى / بىرلىكى (Unit)
      const pUnit = p.unit || 'دانە';
      if (agentUnitInput) {
        agentUnitInput.value = pUnit;
        highlightAgentField(agentUnitInput);
      }
      if (agentUnitSelect) {
        const match = Array.from(agentUnitSelect.options).find(opt => opt.value === pUnit);
        agentUnitSelect.value = match ? pUnit : 'custom';
      }

      // 7. مەھسۇلات سۈرىتى
      if (p.image) {
        if (agentImageInput) {
          agentImageInput.value = p.image;
        }
        if (previewImg) {
          previewImg.src = p.image;
        }
        if (previewWrap) {
          previewWrap.style.display = 'block';
        }
        if (secStatus) {
          secStatus.innerHTML = '<span style="color: #059669; font-weight: 800;"><i class="fas fa-check-circle"></i> ئۆلچەملىك سۈرەت ئاپتوماتىك قوبۇل قىلىندى (800×800 px)</span>';
        }
        if (needsAdminImgInput) needsAdminImgInput.value = 'false';
        if (adminImgCard) adminImgCard.style.display = 'none';
        if (tipBox) tipBox.style.display = 'block';
      }

      // 8. مەھسۇلات تەپسىلاتى
      const descInput = document.getElementById('agentProdDesc');
      if (descInput) {
        descInput.value = p.description || '';
        highlightAgentField(descInput);
      }

      // 9. قائىدە كۆزنەكچىسىنى بەلگىلەش
      const agreeCheck = document.getElementById('agentAgreeImgRules');
      if (agreeCheck) {
        agreeCheck.checked = true;
      }

      // 10. ئەسكەرتىش كۆرسىتىش
      if (autofillNotice) {
        autofillNotice.style.display = 'flex';
        if (autofillNoticeTitle) autofillNoticeTitle.textContent = `«${p.name}»`;
      }

      updateSameProductQuotaNotice(p.name);
      hideSuggestions();

      if (showToastMsg && typeof showToast === 'function') {
        showToast(`✨ «${p.name}» نىڭ باھاسى (₺${p.price})، رەسىمى ۋە تەپسىلاتى ئاپتوماتىك تولدۇرۇلدى!`, 'success');
      }
    }

    function hideSuggestions() {
      if (prodAutoList) {
        prodAutoList.style.display = 'none';
        prodAutoList.innerHTML = '';
      }
      currentSuggestions = [];
      selectedSuggestIndex = -1;
    }

    function renderSuggestions(suggestions, query) {
      if (!prodAutoList) return;
      if (!suggestions || suggestions.length === 0) {
        hideSuggestions();
        return;
      }

      currentSuggestions = suggestions;
      selectedSuggestIndex = -1;

      let html = `
        <div style="padding: 0.45rem 0.65rem; font-size: 0.76rem; font-weight: 800; color: #1e40af; background: #eff6ff; border-radius: 8px; margin-bottom: 0.35rem; display: flex; align-items: center; justify-content: space-between;">
          <span><i class="fas fa-magic" style="color: #3b82f6;"></i> تاللىسىڭىز باھا، رەسىم ۋە پۈتۈن ئۇچۇرلار ئاپتوماتىك تولدۇرۇلىدۇ:</span>
          <span style="font-size: 0.72rem; color: #64748b; font-weight: 700;">${suggestions.length} تال تېپىلدى</span>
        </div>
      `;

      suggestions.forEach((p, idx) => {
        const pImg = p.image || 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=400&q=80';
        let quotaBadgeHtml = '';
        let isQuotaFull = false;
        if (window.appStore && typeof window.appStore.checkProductAgentQuota === 'function') {
          const editId = editProdIdInput ? editProdIdInput.value.trim() : '';
          const aId = currentVerifiedAgent ? currentVerifiedAgent.id : null;
          const qCheck = window.appStore.checkProductAgentQuota(p.name, editId, aId, 3);
          if (!qCheck.allowed) {
            isQuotaFull = true;
            quotaBadgeHtml = '<span style="background: #fee2e2; color: #b91c1c; font-size: 0.68rem; font-weight: 800; padding: 1px 6px; border-radius: 4px; border: 1px solid #fca5a5;">⚠️ 3/3 تولغان</span>';
          } else {
            quotaBadgeHtml = `<span style="background: #ecfdf5; color: #047857; font-size: 0.68rem; font-weight: 700; padding: 1px 6px; border-radius: 4px; border: 1px solid #a7f3d0;">ۋاكالەتچى: ${qCheck.count}/3</span>`;
          }
        }
        html += `
          <div class="agent-suggest-item" data-index="${idx}" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.55rem 0.65rem; border-radius: 8px; cursor: pointer; transition: all 0.15s ease; border-bottom: 1px solid #f1f5f9; user-select: none; ${isQuotaFull ? 'opacity: 0.85;' : ''}">
            <img src="${pImg}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 8px; border: 1.5px solid #e2e8f0; flex-shrink: 0;" onerror="this.src='images/default_product.jpg'">
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.4rem;">
                <div style="font-weight: 800; font-size: 0.88rem; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</div>
                ${quotaBadgeHtml}
              </div>
              <div style="display: flex; align-items: center; gap: 0.45rem; font-size: 0.76rem; color: #64748b; margin-top: 2px;">
                <span style="background: #f1f5f9; padding: 1px 7px; border-radius: 5px; font-weight: 700; color: #334155;">🏷️ ${p.category}</span>
                <span>•</span>
                <span style="color: #2563eb; font-weight: 900; font-size: 0.82rem;">₺${p.price} / ${p.unit || 'دانە'}</span>
                <span>•</span>
                <span style="color: #059669; font-weight: 700;">ماركا: ${p.brand || 'تەكلىماكان'}</span>
              </div>
            </div>
            <div style="background: ${isQuotaFull ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'}; color: #ffffff; padding: 0.35rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; gap: 4px; flex-shrink: 0; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">
              <i class="fas fa-magic"></i> <span>تولدۇرۇش</span>
            </div>
          </div>
        `;
      });

      prodAutoList.innerHTML = html;
      prodAutoList.style.display = 'block';

      // چېكىش ھەرىكىتى
      prodAutoList.querySelectorAll('.agent-suggest-item').forEach(itemEl => {
        itemEl.addEventListener('mouseenter', () => {
          itemEl.style.backgroundColor = '#f0fdf4';
        });
        itemEl.addEventListener('mouseleave', () => {
          itemEl.style.backgroundColor = '';
        });
        itemEl.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(itemEl.dataset.index, 10);
          if (currentSuggestions[idx]) {
            autofillAgentProduct(currentSuggestions[idx], true);
          }
        });
      });
    }

    if (prodNameInput) {
      prodNameInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        updateSameProductQuotaNotice(val);
        clearTimeout(autofillDebounceTimer);

        if (!val || val.length < 1) {
          hideSuggestions();
          return;
        }

        autofillDebounceTimer = setTimeout(() => {
          if (window.appStore && typeof window.appStore.findProductSuggestions === 'function') {
            const matches = window.appStore.findProductSuggestions(val, 8);
            if (matches.length > 0) {
              renderSuggestions(matches, val);

              // ئەگەر كىرگۈزگەن نام دەل 100% ماس كەلسە ۋە باھا بوش تۇرغان بولسا دەرھال ئاپتوماتىك تولدۇرۇش
              const exact = matches.find(m => m.name.trim().toLowerCase() === val.toLowerCase());
              const priceVal = document.getElementById('agentProdPrice')?.value.trim();
              if (exact && !priceVal) {
                autofillAgentProduct(exact, false);
              }
            } else {
              hideSuggestions();
            }
          }
        }, 120);
      });

      // كىرگۈزۈش رامكىسىنى بوش قىلىپ ئايرىلغاندا (Blur) ئەڭ ياخشى ماس كەلگىنىنى ئاپتوماتىك تولدۇرۇش
      prodNameInput.addEventListener('blur', () => {
        const val = prodNameInput.value.trim();
        updateSameProductQuotaNotice(val);
        setTimeout(() => {
          const priceInput = document.getElementById('agentProdPrice');
          if (val && (!priceInput || !priceInput.value.trim())) {
            if (window.appStore && typeof window.appStore.findProductSuggestions === 'function') {
              const matches = window.appStore.findProductSuggestions(val, 1);
              if (matches && matches.length > 0) {
                autofillAgentProduct(matches[0], true);
              }
            }
          }
          hideSuggestions();
        }, 250);
      });

      // كۇنۇپكا ئارقىلىق تاللاش (Keyboard Navigation: Up / Down / Enter / Esc)
      prodNameInput.addEventListener('keydown', (e) => {
        if (!prodAutoList || prodAutoList.style.display === 'none' || currentSuggestions.length === 0) {
          return;
        }

        const items = prodAutoList.querySelectorAll('.agent-suggest-item');
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          selectedSuggestIndex = (selectedSuggestIndex + 1) % currentSuggestions.length;
          items.forEach((el, i) => {
            el.style.backgroundColor = (i === selectedSuggestIndex) ? '#f0fdf4' : '';
          });
          if (items[selectedSuggestIndex]) items[selectedSuggestIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          selectedSuggestIndex = (selectedSuggestIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
          items.forEach((el, i) => {
            el.style.backgroundColor = (i === selectedSuggestIndex) ? '#f0fdf4' : '';
          });
          if (items[selectedSuggestIndex]) items[selectedSuggestIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
          if (selectedSuggestIndex >= 0 && currentSuggestions[selectedSuggestIndex]) {
            e.preventDefault();
            autofillAgentProduct(currentSuggestions[selectedSuggestIndex], true);
          } else if (currentSuggestions[0]) {
            e.preventDefault();
            autofillAgentProduct(currentSuggestions[0], true);
          }
        } else if (e.key === 'Escape') {
          hideSuggestions();
        }
      });
    }

    // پۈتۈن ھۆججەتتە سىرتقا چېكىلگەندە تەكلىپ كۆزنىكىنى يوشۇرۇش
    document.addEventListener('click', (e) => {
      if (prodAutoList && !prodAutoList.contains(e.target) && e.target !== prodNameInput) {
        hideSuggestions();
      }
    });

    if (btnClearAutofill) {
      btnClearAutofill.addEventListener('click', () => {
        if (autofillNotice) autofillNotice.style.display = 'none';
        if (prodNameInput) {
          prodNameInput.focus();
          prodNameInput.select();
        }
        if (window.appStore && typeof window.appStore.findProductSuggestions === 'function') {
          const val = prodNameInput ? prodNameInput.value.trim() : '';
          if (val) {
            const matches = window.appStore.findProductSuggestions(val, 8);
            renderSuggestions(matches, val);
          }
        }
      });
    }

    // 3. تاۋارنى تەستىققا يوللاش ياكى باھا/ئۇچۇر ئۆزگەرتىش
    if (formProductSubmit) {
      formProductSubmit.addEventListener('submit', (e) => {
        e.preventDefault();
        if (agentImageProcessing) {
          showToast('رەسىم تېخى تەييارلىنىۋاتىدۇ؛ بىرئاز ساقلاپ قايتا يوللاڭ.', 'info');
          return;
        }
        if (!currentVerifiedAgent) {
          showToast('ئالدى بىلەن كىملىكىڭىزنى دەلىللەڭ!', 'error');
          return;
        }

        // 📜 5 تۈرلۈك دەخلىسىز قائىدە ۋە سۈرەت يۈكلەش نىزامنامىسىگە قوشۇلغانلىقىنى تەكشۈرۈش
        const agreeCheck = document.getElementById('agentAgreeImgRules');
        if (!agreeCheck || !agreeCheck.checked) {
          alert('⚠️ داۋاملاشتۇرۇش ئۈچۈن مەھسۇلات سۈرىتى يۈكلەش نىزامنامىسى ۋە 5 دەخلىسىز قائىدىگە قوشۇلۇشىڭىز شەرت!');
          showToast('سۈرەت يۈكلەش نىزامنامىسىگە قوشۇلۇش كېرەك!', 'warning');
          if (agreeCheck) {
            agreeCheck.focus();
            agreeCheck.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }

        const name = document.getElementById('agentProdName').value.trim();
        const brand = document.getElementById('agentProdBrand').value;
        const category = document.getElementById('agentProdCategory').value;
        const price = parseFloat(document.getElementById('agentProdPrice').value);
        const oldPriceVal = document.getElementById('agentProdOldPrice').value;
        const oldPrice = oldPriceVal ? parseFloat(oldPriceVal) : null;
        const stock = parseInt(document.getElementById('agentProdStock').value, 10);
        const rawUnit = (document.getElementById('agentProdUnit')?.value.trim()) || 'دانە';
        const unit = (typeof window.normalizeProductUnit === 'function') ? window.normalizeProductUnit(rawUnit) : rawUnit;
        const image = (document.getElementById('agentProdImage')?.value || '').trim();
        const desc = document.getElementById('agentProdDesc').value.trim();
        const editId = editProdIdInput ? editProdIdInput.value.trim() : '';

        // 🛑 كۈندىلىك مەھسۇلات يوللاش چېكىنى تەكشۈرۈش (پەقەت يېڭى تاۋار يوللىغاندا تەكشۈرۈلىدۇ؛ تەھرىرلەشكە چەك قويۇلمىغان)
        if (!editId && currentVerifiedAgent && window.appStore && typeof window.appStore.checkAgentDailyProductLimit === 'function') {
          const quota = window.appStore.checkAgentDailyProductLimit(currentVerifiedAgent.id);
          if (!quota.allowed) {
            const dailyLimitBanner = document.getElementById('agentDailyLimitNoticeBanner');
            if (dailyLimitBanner) {
              dailyLimitBanner.style.display = 'block';
              dailyLimitBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
              dailyLimitBanner.style.boxShadow = '0 0 0 3px #f43f5e';
              setTimeout(() => { if (dailyLimitBanner) dailyLimitBanner.style.boxShadow = ''; }, 2000);
            }
            alert(quota.message);
            showToast(quota.message || '⚠️ بۈگۈنكى مەھسۇلات يوللاش چېكىڭىز توشتى.', 'error');
            return;
          }
        }

        // 👥 ئوخشاش مەھسۇلاتنى كۆپ بولغاندا 3 نەپەر ۋاكالەتچى سېتىش چېكىنى تەكشۈرۈش
        if (currentVerifiedAgent && window.appStore && typeof window.appStore.checkProductAgentQuota === 'function') {
          const sameQuotaCheck = window.appStore.checkProductAgentQuota(name, editId, currentVerifiedAgent.id, 3);
          if (!sameQuotaCheck.allowed) {
            alert(sameQuotaCheck.message);
            showToast(sameQuotaCheck.message, 'error');
            const nameEl = document.getElementById('agentProdName');
            if (nameEl) {
              nameEl.focus();
              nameEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              nameEl.style.outline = '2px solid #ef4444';
              setTimeout(() => { if (nameEl) nameEl.style.outline = 'none'; }, 3000);
            }
            return;
          }
        }

        const needsAdminImgVal = (document.getElementById('agentNeedsAdminImage')?.value === 'true');
        let finalImage = image;

        // 📷 تاۋار سۈرىتى تەكشۈرۈش
        if (needsAdminImgVal) {
          // ۋاكالەتچى سۈرەتنى باشقۇرغۇچىنىڭ يۈكلىشىنى تاللىغان بولسا رەسىمسىزمۇ تەستىققا ئۆتىدۇ!
          finalImage = image;
        } else {
          if (!finalImage || finalImage.length < 15) {
            alert('⚠️ تاۋار سۈرىتى تاللانمىدى! «سۈرەت تاللاش» كۇنۇپكىسىنى بېسىپ سۈرەت يۈكلەڭ ياكى سۈرەتسىز يوللاش ئۈچۈن «👑 باشقۇرغۇچى يۈكلەش» كۇنۇپكىسىنى تاللاڭ.');
            showToast('⚠️ تاۋار سۈرىتى كىرگۈزۈلمىدى!', 'warning');
            const fileBtn = document.querySelector('label[for="agentFileInput"]');
            if (fileBtn) {
              fileBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
              fileBtn.style.outline = '2px solid #ef4444';
              setTimeout(() => { if (fileBtn) fileBtn.style.outline = 'none'; }, 3000);
            }
            return;
          }
        }

        const scopeVal = document.getElementById('agentProdLanguageScope')?.value || 'ug';
        const languageScope = (currentVerifiedAgent && currentVerifiedAgent.canPublishMultilingual) ? scopeVal : 'ug';

        const productData = {
          name,
          brand,
          category,
          price,
          oldPrice,
          stock,
          unit,
          image: finalImage,
          imageDHash: (document.getElementById('agentImageDHash')?.value || ''),
          needsAdminImage: needsAdminImgVal,
          description: desc,
          languageScope,
          translations: {
            ug: { name, description: desc, category },
            tr: { 
              name: window.appI18n ? window.appI18n.autoTranslateUyghur(name, 'tr') : name, 
              description: window.appI18n ? window.appI18n.autoTranslateUyghur(desc, 'tr') : desc, 
              category: window.appI18n ? window.appI18n.getCategoryName(category) : category 
            },
            en: { 
              name: window.appI18n ? window.appI18n.autoTranslateUyghur(name, 'en') : name, 
              description: window.appI18n ? window.appI18n.autoTranslateUyghur(desc, 'en') : desc, 
              category: window.appI18n ? window.appI18n.getCategoryName(category) : category 
            }
          }
        };

        if (editId) {
          productData.id = editId;
        }

        const res = window.appStore.submitAgentProduct(currentVerifiedAgent.id, productData);
        if (res.success) {
          if (res.hasLinkViolation) {
            // 🚨 تېلېفون نومۇرى ياكى تاشقى ئۇلىنىش رەت قىلىش ئەسكەرتىش ئېكرانىنى ئېچىش
            const linkModal = document.getElementById('linkViolationModal');
            const fieldText = document.getElementById('linkViolationFieldText');
            const codeText = document.getElementById('linkViolationCodeText');

            if (fieldText) fieldText.textContent = `مەھسۇلات ${res.linkViolationField || 'مەزمۇنىدا'}`;
            if (codeText) codeText.textContent = res.detectedLink || 'بايقالدى';
            renderLinkViolationModal(window.appI18n ? window.appI18n.getLang() : 'ug', res.violationType, {
              violationsCount: res.violationsCount,
              suspendedDays: res.suspendedDays,
              suspendedUntil: res.suspendedUntil
            });
            if (linkModal) linkModal.classList.add('active');

            // 📧 ئالىي باشقۇرغۇچىغا Email زاپاس ئۇقتۇرۇشى ئەۋەتىش
            try {
              sendEmailLinkViolationAlert(currentVerifiedAgent, res.product || productData, res.detectedLink, res.linkViolationField);
            } catch (notifErr) {
              console.warn('Agent link violation alert error:', notifErr);
            }

            const violNotice = res.violationType === 'phone' 
              ? '⚠️ تېلېفون نومۇرى يېزىش چەكلەنگەنلىكتىن تاۋار دۇكاندىن تۇتۇپ قېلىندى!' 
              : '⚠️ تاشقى ئۇلىنىش بايقالغانلىقتىن تاۋار تۇتۇپ قېلىندى!';
            showToast(violNotice, 'warning');
            // ۋاكالەتچى ھېساباتى ئاپتوماتىك توختىتىلغانلىقتىن كىرگۈزۈش تاختىسىنى دەرھال تاقاپ جازا كارتىسىنى چىقىرىش
            if (formProductSubmit) formProductSubmit.style.display = 'none';
            if (myProductsWrap) myProductsWrap.style.display = 'none';

            const violCard = document.getElementById('agentViolationAlertCard');
            if (violCard) {
              const vCount = res.violationsCount || 1;
              const untilStr = res.suspendedUntil 
                ? new Date(res.suspendedUntil).toLocaleString('ug-CN', { dateStyle: 'medium', timeStyle: 'short' }) 
                : '';
              violCard.style.display = 'block';
              violCard.style.background = '#fef2f2';
              violCard.style.border = '2.5px solid #dc2626';
              violCard.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                  <div style="width: 46px; height: 46px; border-radius: 50%; background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; border: 2px solid #fca5a5;">
                    <i class="fas fa-ban"></i>
                  </div>
                  <div>
                    <h5 style="color: #991b1b; font-size: 1.05rem; font-weight: 900; margin: 0 0 2px 0;">
                      ⛔ ھېساباتىڭىز ${vCount} كۈن پۈتۈنلەي توختىتىلدى!
                    </h5>
                    <div style="font-size: 0.8rem; color: #b91c1c; font-weight: 700;">
                      سەۋەبى: مەھسۇلاتتا تېلېفون نومۇرى ياكى تور ئۇلانمىسى بايقالدى (${vCount}-قېتىملىق خىلاپلىق)
                    </div>
                  </div>
                </div>
                <div style="background: #ffffff; border: 1.5px dashed #f87171; border-radius: 8px; padding: 0.75rem; margin-bottom: 0.75rem;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.35rem;">
                    <span style="color: #475569; font-weight: 700;">خىلاپلىق قىلغان قېتىم سانى:</span>
                    <strong style="color: #dc2626; font-size: 0.95rem;">${vCount} قېتىم</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.35rem;">
                    <span style="color: #475569; font-weight: 700;">توختىتىلغان كۈن سانى (1 قېتىم = 1 كۈن):</span>
                    <strong style="color: #b91c1c;">${vCount} كۈن مەشغۇلات قىلىش تاقالدى</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                    <span style="color: #475569; font-weight: 700;">توختاش ئاخىرلىشىش ۋاقتى:</span>
                    <strong class="number-latin" style="color: #1e3a8a;">${untilStr}</strong>
                  </div>
                </div>
                <div style="font-size: 0.82rem; color: #4b5563; line-height: 1.5;">
                  ℹ️ توختىتىش مۆھلىتى توشقاندا سىستېما ھېساباتىڭىزنى ئاپتوماتىك قايتا ئاچىدۇ، ياكى <strong>ئالىي باشقۇرغۇچى</strong> بىلەن ئالاقىلىشىپ چەكلەشنى بالدۇرراق ئەمەلدىن قالدۇرۇشنى ئىلتىماس قىلسىڭىز بولىدۇ.
                </div>
              `;
            }

            resetToNewProductMode();
          } else {
            // 📧 باشقۇرغۇچىغا ئادەتتىكى تەستىق ئۇقتۇرۇشى ئەۋەتىش
            try {
              sendEmailAgentProductNotification(currentVerifiedAgent, res.product || productData, res.isEdit);
            } catch (notifErr) {
              console.warn('Agent product notification error:', notifErr);
            }

            // 🤖 Telegram غا سۈرەت ۋە تاۋار ئۇچۇرلىرىنى ئاپتوماتىك ئەۋەتىش
            try {
              sendTelegramAgentProductNotification(currentVerifiedAgent, res.product || productData, res.isEdit);
            } catch (tgErr) {
              console.warn('Agent product Telegram notification error:', tgErr);
            }

            alert(res.message);
            showToast(res.message, 'success');
            resetToNewProductMode();
            renderAgentProductsList(currentVerifiedAgent.id);
            updateAgentDashboard(currentVerifiedAgent);
            if (typeof switchAgentPortalView === 'function') {
              switchAgentPortalView('products');
            }
          }
        } else {
          alert(res.message);
          showToast(res.message, 'error');
        }
      });

      const btnSubmitProductAction = document.getElementById('btnAgentSubmitProductAction');
      if (btnSubmitProductAction) {
        btnSubmitProductAction.addEventListener('click', (e) => {
          const editId = editProdIdInput ? editProdIdInput.value.trim() : '';
          if (!editId && currentVerifiedAgent && window.appStore && typeof window.appStore.checkAgentDailyProductLimit === 'function') {
            const quota = window.appStore.checkAgentDailyProductLimit(currentVerifiedAgent.id);
            if (!quota.allowed) {
              e.preventDefault();
              const dailyLimitBanner = document.getElementById('agentDailyLimitNoticeBanner');
              if (dailyLimitBanner) {
                dailyLimitBanner.style.display = 'block';
                dailyLimitBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
                dailyLimitBanner.style.boxShadow = '0 0 0 3px #f43f5e';
                setTimeout(() => { if (dailyLimitBanner) dailyLimitBanner.style.boxShadow = ''; }, 2000);
              }
              showToast(quota.message || '⚠️ بۈگۈنكى مەھسۇلات يوللاش چېكىڭىز (1 تال) توشتى.', 'warning');
              return;
            }
          }
          if (btnSubmitProductAction.getAttribute('data-quota-blocked') === 'true' && !editId) {
            e.preventDefault();
            const nameEl = document.getElementById('agentProdName');
            showToast('⚠️ بۇ تاۋارنى ئاللىقاچان 3 نەپەر باشقا ۋاكالەتچى ئېلان قىلىپ بولغان (چەك تولغان). باشقا تاۋار سۇنۇڭ!', 'warning');
            if (nameEl) {
              nameEl.focus();
              nameEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        });
      }
    }

    // تاشقى ئۇلىنىش ئاگاھلاندۇرۇش كۆزنىكىنى تاقاش
    const btnCloseLinkViolation = document.getElementById('btnCloseLinkViolationModal');
    const linkViolationModal = document.getElementById('linkViolationModal');
    if (btnCloseLinkViolation && linkViolationModal) {
      btnCloseLinkViolation.addEventListener('click', () => {
        linkViolationModal.classList.remove('active');
      });
      linkViolationModal.addEventListener('click', (e) => {
        if (e.target === linkViolationModal) {
          linkViolationModal.classList.remove('active');
        }
      });
    }

    // 🔄 ئارقا سۇپا ۋە باشقا كۆزنەكلەر بىلەن دەل ۋاقتىدا ماس قەدەملەشتۈرۈش (Real-time synchronization with admin)
    window.addEventListener('uyghur_store_sync', (e) => {
      if (currentVerifiedAgent) {
        const freshAgent = window.appStore.getAgentById(currentVerifiedAgent.id) || currentVerifiedAgent;
        currentVerifiedAgent = freshAgent;
        updateAgentDashboard(currentVerifiedAgent);
        const myProds = document.getElementById('agentMyProductsWrap');
        const mySales = document.getElementById('agentMySalesWrap');
        if (myProds && myProds.style.display !== 'none') {
          renderAgentProductsList(currentVerifiedAgent.id);
        }
        if (mySales && mySales.style.display !== 'none') {
          renderAgentSalesList(currentVerifiedAgent.id);
        }
      }
    });

    window.addEventListener('storage', (e) => {
      if (e.key && (e.key.includes('orders') || e.key.includes('products') || e.key.includes('agents') || e.key.includes('sync'))) {
        if (currentVerifiedAgent) {
          const freshAgent = window.appStore.getAgentById(currentVerifiedAgent.id) || currentVerifiedAgent;
          currentVerifiedAgent = freshAgent;
          updateAgentDashboard(currentVerifiedAgent);
          const myProds = document.getElementById('agentMyProductsWrap');
          const mySales = document.getElementById('agentMySalesWrap');
          if (myProds && myProds.style.display !== 'none') {
            renderAgentProductsList(currentVerifiedAgent.id);
          }
          if (mySales && mySales.style.display !== 'none') {
            renderAgentSalesList(currentVerifiedAgent.id);
          }
        }
      }
    });
  }

  // ==================== ℹ️ تەكلىماكان سۇپىسى ۋە بىز ھەققىدە كۆزنىكى ====================
  function renderAboutUsModal(lang = 'ug') {
    const modal = document.getElementById('aboutUsModal');
    if (!modal) return;

    const modalTitle = modal.querySelector('.modal-title');
    const modalSub = modal.querySelector('.modal-header span');
    const modalBody = modal.querySelector('.modal-body');
    if (!modalBody) return;

    if (lang === 'tr') {
      if (modalTitle) modalTitle.textContent = 'Hakkımızda | Teklimakan Pazaryeri';
      if (modalSub) modalSub.textContent = 'Kaliteli, güvenilir ve özgün online alışveriş platformunuz';
      modalBody.innerHTML = `
        <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 14px; padding: 1.15rem 1.25rem; margin-bottom: 1.25rem;">
          <h5 style="font-size: 1.05rem; font-weight: 800; color: #1e3a8a; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-info-circle" style="color: var(--primary-color);"></i> Hakkımızda
          </h5>
          <p style="margin: 0; color: #1e293b; line-height: 1.8; font-size: 0.95rem;">
            Teklimakan Pazaryeri — En kaliteli geleneksel Uygur tıbbi şifalı ürünleri, doğal gül reçelleri, bitkisel yağlar ve kültürel miras ürünlerini dünyanın her yerindeki müşterilerine en uygun fiyatlarla ulaştıran çok dilli ve modern bir e-ticaret platformudur.
          </p>
        </div>

        <div style="background: #fdf2f8; border: 1.5px solid #fbcfe8; border-radius: 14px; padding: 1.15rem 1.25rem; margin-bottom: 1.25rem;">
          <h5 style="font-size: 1.05rem; font-weight: 800; color: #9d174d; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-shield-alt" style="color: #ec4899;"></i> Ticaret İlkelerimiz ve Kalite Garantisi
          </h5>
          <p style="margin: 0; color: #831843; line-height: 1.75; font-size: 0.9rem;">
            Platformumuz dürüstlük, saflık ve müşteri güvenini her şeyin üstünde tutar. Platformda sahte veya kalitesiz ürünlere kesinlikle izin verilmez. Her sipariş kargolanmadan önce özenle kalite kontrolünden geçirilir ve güvenle paketlenir.
          </p>
        </div>

        <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 1.15rem 1.25rem; margin-bottom: 1.25rem;">
          <h5 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-gem" style="color: #f59e0b;"></i> Platformumuzun Temel Avantajları
          </h5>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div style="background: #ffffff; padding: 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 0.6rem;">
              <i class="fas fa-check-double" style="color: #10b981; font-size: 1.25rem;"></i>
              <div>
                <strong style="font-size: 0.88rem; display: block; color: #0f172a;">%100 Orijinal Ürün</strong>
                <small style="color: #64748b;">Denetlenmiş gerçek ürünler</small>
              </div>
            </div>
            <div style="background: #ffffff; padding: 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 0.6rem;">
              <i class="fas fa-globe-americas" style="color: #0284c7; font-size: 1.25rem;"></i>
              <div>
                <strong style="font-size: 0.88rem; display: block; color: #0f172a;">Çok Dilli Platform</strong>
                <small style="color: #64748b;">Uygurca, Türkçe, İngilizce</small>
              </div>
            </div>
            <div style="background: #ffffff; padding: 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 0.6rem;">
              <i class="fas fa-shipping-fast" style="color: #2563eb; font-size: 1.25rem;"></i>
              <div>
                <strong style="font-size: 0.88rem; display: block; color: #0f172a;">1000 TL Üzeri Ücretsiz Kargo</strong>
                <small style="color: #64748b;">Hızlı ve güvenli teslimat</small>
              </div>
            </div>
            <div style="background: #ffffff; padding: 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 0.6rem;">
              <i class="fas fa-credit-card" style="color: #6366f1; font-size: 1.25rem;"></i>
              <div>
                <strong style="font-size: 0.88rem; display: block; color: #0f172a;">Çoklu Ödeme Yöntemi</strong>
                <small style="color: #64748b;">Kredi kartı, Havale/EFT, WhatsApp</small>
              </div>
            </div>
            <div style="background: #ffffff; padding: 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 0.6rem;">
              <i class="fas fa-undo-alt" style="color: #8b5cf6; font-size: 1.25rem;"></i>
              <div>
                <strong style="font-size: 0.88rem; display: block; color: #0f172a;">7 Gün Kolay İade</strong>
                <small style="color: #64748b;">Güvenle ve kaygısız alışveriş</small>
              </div>
            </div>
            <div style="background: #ffffff; padding: 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 0.6rem;">
              <i class="fas fa-handshake" style="color: #f59e0b; font-size: 1.25rem;"></i>
              <div>
                <strong style="font-size: 0.88rem; display: block; color: #0f172a;">İş Birliği Platformu</strong>
                <small style="color: #64748b;">Temsilci ve satıcılara fırsatlar</small>
              </div>
            </div>
          </div>
        </div>

        <div style="text-align: center; padding-top: 0.5rem;">
          <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 1rem;">Her türlü soru ve önerileriniz için doğrudan bizimle iletişime geçebilirsiniz.</p>
          <button type="button" id="btnStartShoppingFromAbout" class="btn-checkout" style="padding: 0.75rem 2rem; display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 800; font-size: 0.95rem;">
            <i class="fas fa-shopping-bag"></i> <span>Alışverişe Devam Et</span>
          </button>
        </div>
      `;
    } else if (lang === 'en') {
      if (modalTitle) modalTitle.textContent = 'About Us | Teklimakan E-Commerce';
      if (modalSub) modalSub.textContent = 'Your trusted, authentic and premium online shopping platform';
      modalBody.innerHTML = `
        <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 14px; padding: 1.15rem 1.25rem; margin-bottom: 1.25rem;">
          <h5 style="font-size: 1.05rem; font-weight: 800; color: #1e3a8a; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-info-circle" style="color: var(--primary-color);"></i> About Us
          </h5>
          <p style="margin: 0; color: #1e293b; line-height: 1.8; font-size: 0.95rem;">
            Teklimakan E-Commerce is a premier multilingual online destination delivering traditional Uyghur wellness products, pure rose jams, natural oils, and authentic cultural items to customers worldwide at affordable prices.
          </p>
        </div>

        <div style="background: #fdf2f8; border: 1.5px solid #fbcfe8; border-radius: 14px; padding: 1.15rem 1.25rem; margin-bottom: 1.25rem;">
          <h5 style="font-size: 1.05rem; font-weight: 800; color: #9d174d; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-shield-alt" style="color: #ec4899;"></i> Integrity & Quality Guarantee
          </h5>
          <p style="margin: 0; color: #831843; line-height: 1.75; font-size: 0.9rem;">
            We value integrity, purity, and trust above all. Strictly no counterfeit or low-quality goods are allowed on our platform. Every shipment is carefully inspected before dispatch.
          </p>
        </div>

        <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 1.15rem 1.25rem; margin-bottom: 1.25rem;">
          <h5 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-gem" style="color: #f59e0b;"></i> Key Advantages
          </h5>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div style="background: #ffffff; padding: 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 0.6rem;">
              <i class="fas fa-check-double" style="color: #10b981; font-size: 1.25rem;"></i>
              <div>
                <strong style="font-size: 0.88rem; display: block; color: #0f172a;">100% Authentic</strong>
                <small style="color: #64748b;">Strictly verified goods</small>
              </div>
            </div>
            <div style="background: #ffffff; padding: 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 0.6rem;">
              <i class="fas fa-globe-americas" style="color: #0284c7; font-size: 1.25rem;"></i>
              <div>
                <strong style="font-size: 0.88rem; display: block; color: #0f172a;">Multilingual</strong>
                <small style="color: #64748b;">Uyghur, Turkish, English</small>
              </div>
            </div>
            <div style="background: #ffffff; padding: 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 0.6rem;">
              <i class="fas fa-shipping-fast" style="color: #2563eb; font-size: 1.25rem;"></i>
              <div>
                <strong style="font-size: 0.88rem; display: block; color: #0f172a;">Free Shipping > 1000 TL</strong>
                <small style="color: #64748b;">Fast & insured delivery</small>
              </div>
            </div>
            <div style="background: #ffffff; padding: 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 0.6rem;">
              <i class="fas fa-credit-card" style="color: #6366f1; font-size: 1.25rem;"></i>
              <div>
                <strong style="font-size: 0.88rem; display: block; color: #0f172a;">Multiple Payments</strong>
                <small style="color: #64748b;">Credit Card, Wire, WhatsApp</small>
              </div>
            </div>
            <div style="background: #ffffff; padding: 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 0.6rem;">
              <i class="fas fa-undo-alt" style="color: #8b5cf6; font-size: 1.25rem;"></i>
              <div>
                <strong style="font-size: 0.88rem; display: block; color: #0f172a;">7-Day Easy Returns</strong>
                <small style="color: #64748b;">Shop with confidence</small>
              </div>
            </div>
            <div style="background: #ffffff; padding: 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 0.6rem;">
              <i class="fas fa-handshake" style="color: #f59e0b; font-size: 1.25rem;"></i>
              <div>
                <strong style="font-size: 0.88rem; display: block; color: #0f172a;">Partner Network</strong>
                <small style="color: #64748b;">Opportunities for vendors</small>
              </div>
            </div>
          </div>
        </div>

        <div style="text-align: center; padding-top: 0.5rem;">
          <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 1rem;">Feel free to contact us anytime with inquiries or feedback.</p>
          <button type="button" id="btnStartShoppingFromAbout" class="btn-checkout" style="padding: 0.75rem 2rem; display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 800; font-size: 0.95rem;">
            <i class="fas fa-shopping-bag"></i> <span>Continue Shopping</span>
          </button>
        </div>
      `;
    }

    const newShopBtn = modal.querySelector('#btnStartShoppingFromAbout');
    if (newShopBtn) {
      newShopBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        const catalog = document.getElementById('catalogSection');
        if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  function initAboutUsModal() {
    const modal = document.getElementById('aboutUsModal');
    if (!modal) return;

    function openModal(e) {
      if (e && e.preventDefault) e.preventDefault();
      const currentL = window.appI18n ? window.appI18n.getLang() : 'ug';
      renderAboutUsModal(currentL);
      modal.classList.add('active');
    }

    function closeModal() {
      modal.classList.remove('active');
    }

    // پۈتۈن بەت مىقياسىدا چاقىرغىلى بولىدىغان قىلىش
    window.openAboutUsModal = openModal;
    window.closeAboutUsModal = closeModal;

    const openBtn = document.getElementById('fLinkAbout');
    const titleBtn = document.getElementById('footerCol2Title');
    const closeBtn = document.getElementById('btnCloseAboutUsModal');
    const shopBtn = document.getElementById('btnStartShoppingFromAbout');

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (shopBtn) {
      shopBtn.addEventListener('click', () => {
        closeModal();
        const catalog = document.getElementById('catalogSection');
        if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  function showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    let icon = type === 'success' ? 'fas fa-check-circle' : (type === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle');
    toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==================== 📞 تۆۋەنكى پۇت قىسمى سىيرىلما كۆزنەكلىرى (Footer Sliding Accordions) ====================
  function initFooterAccordions() {
    const accordions = [];

    function getTranslate(key, fallback) {
      if (window.appI18n && typeof window.appI18n.t === 'function') {
        const val = window.appI18n.t(key);
        if (val && val !== key) return val;
      }
      return fallback;
    }

    accordions.forEach(cfg => {
      const titleBtn = document.getElementById(cfg.headerId);
      const contentEl = document.getElementById(cfg.contentId);
      const chevron = document.getElementById(cfg.chevronId);
      const hint = document.getElementById(cfg.hintId);

      if (!titleBtn || !contentEl) return;

      function toggleAccordion(forceOpen = null) {
        const isCurrentlyCollapsed = contentEl.classList.contains('is-collapsed');
        const shouldOpen = forceOpen !== null ? forceOpen : isCurrentlyCollapsed;

        if (shouldOpen) {
          contentEl.classList.remove('is-collapsed');
          titleBtn.classList.add('is-open');
          titleBtn.classList.remove('is-collapsed');
          if (chevron) {
            chevron.style.transform = 'rotate(180deg)';
          }
          if (hint) {
            hint.textContent = getTranslate('accordionCollapse', 'يىغىش');
          }
        } else {
          contentEl.classList.add('is-collapsed');
          titleBtn.classList.remove('is-open');
          titleBtn.classList.add('is-collapsed');
          if (chevron) {
            chevron.style.transform = 'rotate(0deg)';
          }
          if (hint) {
            hint.textContent = getTranslate('accordionExpand', 'ئېچىش');
          }
        }
      }

      titleBtn.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        e.preventDefault();
        toggleAccordion();
      });

      titleBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.closest('a')) return;
          e.preventDefault();
          toggleAccordion();
        }
      });
    });
  }

  // ==================== 🔐 مەخپىي باشقۇرغۇچى كۇنۇپكىسى (پەقەت باشقۇرغۇچى ئۈسكۈنىسىدىلا كۆرۈنىدۇ) ====================
  function initAdminDeviceButton() {
    // 1. ئۈسكۈنە سالاھىيىتىنى دەلىللەش (پەقەت ئارقا سۇپىغا كىرىپ باققان باشقۇرغۇچى ئۈسكۈنىسىدىلا ئېچىلىدۇ)
    const isAuth = localStorage.getItem('teklimakan_admin_device') === 'true' ||
                   localStorage.getItem('teklimakan_admin_auth') === 'true' ||
                   sessionStorage.getItem('teklimakan_admin_auth') === 'true';

    // 2. ئەگەر سىناق ياكى تۇنجى قېتىم ئاكتىپلاش ئۈچۈن تور ئادرېسىغا ?admin=1 ياكى ?admin=true قوشۇپ ئاچسىمۇ مەڭگۈلۈك ئاكتىپلايدۇ
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' || params.get('admin') === '1') {
      localStorage.setItem('teklimakan_admin_device', 'true');
    }

    const shouldShow = isAuth || localStorage.getItem('teklimakan_admin_device') === 'true';
    const headerAdminBtn = document.getElementById('headerAdminBtn');
    const floatBadge = document.getElementById('adminFloatingBadge');

    if (shouldShow) {
      if (headerAdminBtn) headerAdminBtn.style.setProperty('display', 'inline-flex', 'important');
      if (floatBadge) floatBadge.style.setProperty('display', 'inline-flex', 'important');
    } else {
      if (headerAdminBtn) headerAdminBtn.style.setProperty('display', 'none', 'important');
      if (floatBadge) floatBadge.style.setProperty('display', 'none', 'important');
    }

    // 3. ئاستىدىكى نەشر ھوقۇقى (©) نى 3 قېتىم چەكسە ئارقا بەتكە تېز كىرىپ ئۈسكۈنىنى دەرھال تىزىملىۋالىدۇ
    const footerCopy = document.getElementById('footerCopyright');
    if (footerCopy) {
      let tapCount = 0;
      let tapTimer = null;
      footerCopy.addEventListener('click', () => {
        tapCount++;
        clearTimeout(tapTimer);
        tapTimer = setTimeout(() => { tapCount = 0; }, 1500);
        if (tapCount >= 3) {
          tapCount = 0;
          localStorage.setItem('teklimakan_admin_device', 'true');
          window.location.href = 'seidiye';
        }
      });
    }
  }

  // ==================== نەق مەيدان پېرېۋوت باھاسى (Live USD & EUR Market Rates) ====================

  async function fetchLiveExchangeRates() {
    const usdEl = document.getElementById('liveRateUsd');
    const eurEl = document.getElementById('liveRateEur');
    const updateText = document.getElementById('rateLastUpdatedText');
    const refreshIcon = document.getElementById('rateRefreshIcon');

    if (refreshIcon) refreshIcon.classList.add('fa-spin');

    try {
      // 1-تاللاش: open.er-api.com
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch('https://open.er-api.com/v6/latest/USD', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.rates) {
          const usdTry = data.rates.TRY;
          const usdEur = data.rates.EUR;
          const eurTry = (usdTry && usdEur) ? (usdTry / usdEur) : null;

          if (usdTry && !isNaN(usdTry)) lastRatesData.usd = Number(usdTry.toFixed(2));
          if (eurTry && !isNaN(eurTry)) lastRatesData.eur = Number(eurTry.toFixed(2));
          lastRatesData.updatedAt = new Date();
        }
      } else {
        throw new Error('Primary API error');
      }
    } catch (err) {
      console.warn('Primary exchange rate fetch failed, trying secondary fallback:', err);
      try {
        // 2-تاللاش: api.exchangerate-api.com
        const res2 = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (res2.ok) {
          const data2 = await res2.json();
          if (data2 && data2.rates) {
            const usdTry = data2.rates.TRY;
            const usdEur = data2.rates.EUR;
            const eurTry = (usdTry && usdEur) ? (usdTry / usdEur) : null;

            if (usdTry && !isNaN(usdTry)) lastRatesData.usd = Number(usdTry.toFixed(2));
            if (eurTry && !isNaN(eurTry)) lastRatesData.eur = Number(eurTry.toFixed(2));
            lastRatesData.updatedAt = new Date();
          }
        }
      } catch (err2) {
        console.warn('All live exchange rates APIs unreachable, using cached/standard rates:', err2);
      }
    } finally {
      if (refreshIcon) {
        setTimeout(() => refreshIcon.classList.remove('fa-spin'), 600);
      }
    }

    // كۆرۈنمە يۈزدە پېرېۋوت باھالىرىنى يېڭىلاش
    if (usdEl) {
      usdEl.textContent = `₺${lastRatesData.usd.toFixed(2)}`;
    }
    if (eurEl) {
      eurEl.textContent = `₺${lastRatesData.eur.toFixed(2)}`;
    }
    if (updateText) {
      updateLiveDateTimeDisplay();
    }
  }

  function updateLiveDateTimeDisplay() {
    const updateText = document.getElementById('rateLastUpdatedText');
    if (!updateText) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}:${seconds}`;

    updateText.innerHTML = `
      <span style="display:inline-flex; align-items:center; gap:0.2rem;">
        <i class="fas fa-calendar-days" style="color:#38bdf8; font-size:0.68rem;"></i>
        <span class="number-latin" style="direction:ltr; font-weight:700; color:#e2e8f0; font-size:0.68rem;">${dateStr}</span>
      </span>
      <span style="display:inline-flex; align-items:center; gap:0.2rem;">
        <i class="fas fa-clock" style="color:#38bdf8; font-size:0.68rem;"></i>
        <span class="number-latin" style="direction:ltr; font-weight:700; color:#cbd5e1; font-size:0.68rem;">${timeStr}</span>
      </span>
    `;
  }

  function initLiveExchangeRatesTicker() {
    updateLiveDateTimeDisplay();
    // ھەر سېكۇنتتا نەق مەيدان چېسلا ۋە ۋاقىت ئۇچۇرىنى يېڭىلاپ تۇرۇش
    setInterval(updateLiveDateTimeDisplay, 1000);

    fetchLiveExchangeRates();
    // ھەر 60 سېكۇنتتا (1 مىنۇتتا) توردىن پېرېۋوت باھاسىنى ئاپتوماتىك يېڭىلاپ تۇرۇش
    setInterval(fetchLiveExchangeRates, 60000);

    const btnRefresh = document.getElementById('btnRefreshRates');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', (e) => {
        e.preventDefault();
        fetchLiveExchangeRates();
        if (typeof showToast === 'function') {
          showToast('پېرېۋوت باھاسى توردىن يېڭىلاندى!', 'info');
        }
      });
    }

    // 💬 ئالىي باشقۇرغۇچى بىلەن توردا بىۋاسىتە پاراڭلىشىش قوزغىتىش
    initCustomerLiveChat();

    // 📱 يانفون قايتىش كۇنۇپكىسى (Android Back ◄) بېسىلغاندا بىر قەدەم چېكىندۈرۈش ۋە خېرىدارنى دۇكاندا تۇتۇپ قېلىش
    initMobileNavigationHistoryShield();
  }

  // ==================== 💬 ئالىي باشقۇرغۇچى بىلەن بىۋاسىتە پاراڭلىشىش مەركىزى (Customer Live Chat) ====================
  function initCustomerLiveChat() {
    const hub = document.getElementById('floatingContactHub');
    const hubTrigger = document.getElementById('contactHubTrigger');
    const toggleBtn = document.getElementById('adminLiveChatToggleBtn');
    const chatBox = document.getElementById('adminLiveChatBox');

    // 📱 ئەقىللىق بىرىكمە كۇنۇپكىنى ئېچىش / تاقاش (Toggle Contact Hub Menu)
    if (hubTrigger && hub) {
      hubTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        hub.classList.toggle('active');
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('#floatingContactHub')) {
          hub.classList.remove('active');
        }
      });
    }
    const btnClose = document.getElementById('btnCloseChatBox');
    const btnClear = document.getElementById('btnClearChatHistory');
    const messagesContainer = document.getElementById('adminChatMessagesContainer');
    const nameInput = document.getElementById('chatCustomerName');
    const phoneInput = document.getElementById('chatCustomerPhone');
    const msgInput = document.getElementById('chatMessageInput');
    const btnSend = document.getElementById('btnSendChatMessage');

    if (!toggleBtn || !chatBox) return;

    const CHAT_STORAGE_KEY = 'teklimakan_customer_chat_v1';

    function safeEscape(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    // 1. خېرىدارنىڭ تولۇق ئارخىپىنى تور كۆرگۈچ، زاكازلار ۋە چىقىم خاتىرىسىدىن ئەقلىي يىغىش (Customer Profiler)
    function getCustomerFullProfile() {
      let name = (nameInput && nameInput.value.trim()) || '';
      let phone = (phoneInput && phoneInput.value.trim()) || '';
      let address = '';
      let city = '';
      let ordersCount = 0;
      let lastOrderId = '';
      let lastOrderStatus = '';
      let lastOrderDate = '';
      let totalSpent = 0;

      // A. بىۋاسىتە ساقلىغۇچتىن ئىزدىنىش
      if (!name || name === 'خېرىدار') name = localStorage.getItem('teklimakan_customer_name') || '';
      if (!name) name = localStorage.getItem('teklimakan_checkout_name') || '';
      if (!phone) phone = localStorage.getItem('teklimakan_customer_phone') || '';
      if (!phone) phone = localStorage.getItem('teklimakan_checkout_phone') || '';
      if (!phone) phone = localStorage.getItem('teklimakan_track_phone') || '';
      address = localStorage.getItem('teklimakan_checkout_address') || '';

      // B. بەتتىكى چىقىم كۆزنىكى ئېچىلغان ياكى تولدۇرۇلغان بولسا شۇ يەردىن ئېلىش
      if (!name) {
        const domName = document.getElementById('checkoutCustName');
        if (domName && domName.value.trim()) name = domName.value.trim();
      }
      if (!phone) {
        const domPhone = document.getElementById('checkoutCustPhone') || document.getElementById('trackOrderPhoneInput');
        if (domPhone && domPhone.value.trim()) phone = domPhone.value.trim();
      }
      if (!address) {
        const domAddr = document.getElementById('checkoutCustAddress');
        if (domAddr && domAddr.value.trim()) address = domAddr.value.trim();
      }

      // C. ئىلگىرىكى زاكازلار ئامبىرىدىن خېرىدار ئۇچۇرىنى ئىزدەش
      try {
        const allOrders = (window.appStore && typeof window.appStore.getOrders === 'function')
          ? window.appStore.getOrders()
          : JSON.parse(localStorage.getItem('teklimakan_ecom_orders_v4') || '[]');
        if (Array.isArray(allOrders) && allOrders.length > 0) {
          let matched = allOrders;
          if (phone) {
            const cleanP = phone.replace(/\D/g, '');
            const filtered = allOrders.filter(o => o.customerPhone && o.customerPhone.replace(/\D/g, '').includes(cleanP));
            if (filtered.length > 0) matched = filtered;
          }
          if (matched.length > 0) {
            const latest = matched[matched.length - 1];
            if (!name && latest.customerName) name = latest.customerName;
            if (!phone && latest.customerPhone) phone = latest.customerPhone;
            if (!address && latest.address) address = latest.address;
            if (!city && (latest.city || latest.province)) city = latest.city || latest.province;
            ordersCount = matched.length;
            lastOrderId = latest.orderNumber || latest.id;
            lastOrderStatus = latest.status || 'تەستىقلاندى';
            lastOrderDate = latest.date || '';
            totalSpent = matched.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
          }
        }
      } catch (e) {}

      // D. ئەڭ ئاخىرقى ساقلانغان زاكاز ئوبيېكتى
      try {
        const lastOrderRaw = localStorage.getItem('teklimakan_last_order');
        if (lastOrderRaw) {
          const lo = JSON.parse(lastOrderRaw);
          if (lo) {
            if (!name && lo.customerName) name = lo.customerName;
            if (!phone && lo.customerPhone) phone = lo.customerPhone;
            if (!address && lo.address) address = lo.address;
            if (!city && (lo.city || lo.province)) city = lo.city || lo.province;
            if (!lastOrderId && (lo.orderNumber || lo.id)) lastOrderId = lo.orderNumber || lo.id;
            if (!lastOrderStatus && lo.status) lastOrderStatus = lo.status;
            if (!lastOrderDate && (lo.date || lo.createdAt)) lastOrderDate = lo.date || lo.createdAt;
          }
        }
      } catch (e) {}

      // E. سېۋەت ھالىتى
      let cartItemsCount = 0;
      let cartTotal = 0;
      try {
        if (window.appStore && typeof window.appStore.getCart === 'function') {
          const cart = window.appStore.getCart();
          if (Array.isArray(cart)) {
            cartItemsCount = cart.reduce((sum, it) => sum + (Number(it.quantity) || 1), 0);
            cartTotal = window.appStore.getCartTotal ? window.appStore.getCartTotal() : 0;
          }
        }
      } catch (e) {}

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const deviceStr = isMobile ? '📱 يانفون (Mobile)' : '💻 كومپيۇتېر (Desktop)';
      const langStr = (window.appI18n && window.appI18n.getLang ? window.appI18n.getLang() : 'ug');
      const curStr = (window.appStore && window.appStore.getCurrency ? window.appStore.getCurrency() : 'TRY');

      return {
        name: name || '',
        phone: phone || '',
        address: address || '',
        city: city || '',
        ordersCount,
        lastOrderId,
        lastOrderStatus,
        lastOrderDate,
        totalSpent,
        cartItemsCount,
        cartTotal,
        deviceStr,
        langInfo: `${langStr === 'ug' ? 'ئۇيغۇرچە' : (langStr === 'tr' ? 'Türkçe' : 'English')} (${curStr})`
      };
    }

    // 🌟 سالاھىيەت تەكشۈرۈش: ۋاكالەتچى، مال سېتىۋالغان خېرىدار ۋە مېھماننى دەل ۋاقتىدا پەرقلەندۈرۈش
    function detectUserRole(phoneOrEmail) {
      const clean = (phoneOrEmail || '').trim();
      const cleanDigits = clean.replace(/\D/g, '');

      // A. ۋاكالەتچىلىك سالاھىيىتىنى تەكشۈرۈش
      let isAgent = false;
      let agentObj = null;
      try {
        const agents = (window.appStore && typeof window.appStore.getAgents === 'function')
          ? window.appStore.getAgents('none')
          : [];
        if (Array.isArray(agents) && clean) {
          agentObj = agents.find(a => {
            const aPhone = (a.phone || '').replace(/\D/g, '');
            const aEmail = (a.email || '').trim().toLowerCase();
            const aCode = (a.code || a.id || '').trim().toLowerCase();
            return (cleanDigits.length >= 7 && aPhone.includes(cleanDigits)) ||
                   (clean.includes('@') && aEmail === clean.toLowerCase()) ||
                   (aCode && aCode === clean.toLowerCase());
          });
          if (agentObj) isAgent = true;
        }
        if (!isAgent) {
          const activeAgent = localStorage.getItem('teklimakan_agent_session') || localStorage.getItem('teklimakan_agent_account');
          if (activeAgent) {
            isAgent = true;
            try { agentObj = JSON.parse(activeAgent); } catch(e) {}
          }
        }
      } catch(e) {}

      const lang = (window.appI18n && typeof window.appI18n.getLang === 'function') ? window.appI18n.getLang() : 'ug';

      if (isAgent) {
        let rawAgentName = (agentObj && agentObj.name) ? String(agentObj.name).trim() : '';
        let roleTitle = '<i class="fas fa-crown"></i> ھۆرمەتلىك ۋاكالەتچى';
        let roleDesc = `${rawAgentName || 'تەكلىماكان كېلىشىملىك ۋاكالەتچىسى'} • كۇنۇپكىلار ۋە چات چەكلىمىسىز ئوچۇق`;
        let pillText = 'ۋاكالەتچى VIP';

        if (lang === 'tr') {
          let trAgentName = rawAgentName;
          if (trAgentName && window.appI18n && typeof window.appI18n.autoTranslateUyghur === 'function') {
            trAgentName = window.appI18n.autoTranslateUyghur(trAgentName, 'tr');
          }
          if (!trAgentName || trAgentName === 'تەكلىماكان كېلىشىملىك ۋاكالەتچىسى') {
            trAgentName = 'Teklimakan Yetkili Temsilcisi';
          }
          roleTitle = '<i class="fas fa-crown"></i> Yetkili Temsilci';
          roleDesc = `${trAgentName} • Tüm butonlar ve destek sınırsız açık`;
          pillText = 'Temsilci VIP';
        } else if (lang === 'en') {
          let enAgentName = rawAgentName;
          if (enAgentName && window.appI18n && typeof window.appI18n.autoTranslateUyghur === 'function') {
            enAgentName = window.appI18n.autoTranslateUyghur(enAgentName, 'en');
          }
          if (!enAgentName || enAgentName === 'تەكلىماكان كېلىشىملىك ۋاكالەتچىسى') {
            enAgentName = 'Teklimakan Authorized Agent';
          }
          roleTitle = '<i class="fas fa-crown"></i> Authorized Agent';
          roleDesc = `${enAgentName} • Unlimited buttons and support`;
          pillText = 'Agent VIP';
        }

        return {
          role: 'agent',
          roleTitle,
          roleDesc,
          pillText,
          isAgent: true,
          isVerifiedBuyer: true,
          canUseUnlimited: true,
          agentObj
        };
      }

      // B. مېلى سېتىۋېلىنغان خېرىدارلىق سالاھىيىتىنى تەكشۈرۈش (Orders Check)
      let ordersCount = 0;
      let matchedOrders = [];
      try {
        const allOrders = (window.appStore && typeof window.appStore.getOrders === 'function')
          ? window.appStore.getOrders()
          : JSON.parse(localStorage.getItem('teklimakan_ecom_orders_v4') || '[]');
        if (Array.isArray(allOrders) && allOrders.length > 0 && clean) {
          matchedOrders = allOrders.filter(o => {
            const oPhone = (o.customer?.phone || o.customerPhone || '').replace(/\D/g, '');
            const oEmail = (o.customer?.email || o.customerEmail || '').trim().toLowerCase();
            const oId = String(o.id || o.orderNumber || '').trim().toLowerCase();
            return (cleanDigits.length >= 7 && oPhone.includes(cleanDigits)) ||
                   (clean.includes('@') && oEmail === clean.toLowerCase()) ||
                   (oId && clean.toLowerCase() === oId);
          });
          ordersCount = matchedOrders.length;
        }
        if (ordersCount === 0) {
          const lastOrder = localStorage.getItem('teklimakan_last_order');
          if (lastOrder) {
            try {
              const lo = JSON.parse(lastOrder);
              const loPhone = (lo.customerPhone || lo.customer?.phone || '').replace(/\D/g, '');
              if (cleanDigits.length >= 7 && loPhone.includes(cleanDigits)) {
                ordersCount = 1;
                matchedOrders.push(lo);
              }
            } catch(e) {}
          }
        }
      } catch(e) {}

      if (ordersCount > 0) {
        let roleTitle = '<i class="fas fa-bag-shopping"></i> تەستىقلانغان خېرىدار';
        let roleDesc = `${ordersCount} دانە سېتىۋالغان مېلىڭىز بار • كۇنۇپكىلار ۋە چات چەكلىمىسىز ئوچۇق`;
        let pillText = 'VIP خېرىدار';

        if (lang === 'tr') {
          roleTitle = '<i class="fas fa-bag-shopping"></i> Doğrulanmış Müşteri';
          roleDesc = `${ordersCount} adet kayıtlı siparişiniz mevcut • Tüm butonlar ve destek sınırsız açık`;
          pillText = 'VIP Müşteri';
        } else if (lang === 'en') {
          roleTitle = '<i class="fas fa-bag-shopping"></i> Verified Customer';
          roleDesc = `${ordersCount} registered order(s) found • Unlimited buttons and support`;
          pillText = 'VIP Customer';
        }

        return {
          role: 'buyer',
          roleTitle,
          roleDesc,
          pillText,
          isAgent: false,
          isVerifiedBuyer: true,
          canUseUnlimited: true,
          ordersCount,
          orders: matchedOrders
        };
      }

      // C. تىزىملاتقان ياكى تىزىملاتمىغان مېھمان
      const hasContact = cleanDigits.length >= 7 || clean.includes('@');
      let title = '';
      let desc = '';
      let pill = '';

      if (lang === 'tr') {
        title = hasContact ? '<i class="fas fa-user-check"></i> Doğrulanmış Misafir' : '<i class="fas fa-user-lock"></i> Doğrulanmamış Misafir';
        desc = hasContact 
          ? 'Henüz sipariş kaydı yok • Hızlı butonlar kayıtlı sipariş sahiplerine açıktır' 
          : 'Yöneticiye yazabilmek için lütfen telefon veya e-posta giriniz';
        pill = hasContact ? 'Misafir' : 'Kısıtlı';
      } else if (lang === 'en') {
        title = hasContact ? '<i class="fas fa-user-check"></i> Verified Guest' : '<i class="fas fa-user-lock"></i> Unverified Guest';
        desc = hasContact 
          ? 'No order history yet • Quick buttons are available for active buyers' 
          : 'Please enter phone or email to message management';
        pill = hasContact ? 'Guest' : 'Restricted';
      } else {
        title = hasContact ? '<i class="fas fa-user-check"></i> تىزىملاتقان مېھمان' : '<i class="fas fa-user-lock"></i> تىزىملاتمىغان مېھمان';
        desc = hasContact 
          ? 'تېخى مال زاكاز قىلمىغان • تېز كۇنۇپكىلار پەقەت سېتىۋالغانلارغا ئوچۇق' 
          : 'ئالىي باشقۇرغۇچىغا يېزىش ئۈچۈن تېلېفون ياكى ئىمائىل كىرگۈزۈڭ';
        pill = hasContact ? 'مېھمان' : 'چەكلەنگەن';
      }

      return {
        role: 'guest',
        roleTitle: title,
        roleDesc: desc,
        pillText: pill,
        isAgent: false,
        isVerifiedBuyer: false,
        canUseUnlimited: false,
        ordersCount: 0
      };
    }

    function updateIdentityBadge() {
      const banner = document.getElementById('chatUserIdentityBadge');
      const titleEl = document.getElementById('chatIdentityTitle');
      const descEl = document.getElementById('chatIdentityDesc');
      const pillEl = document.getElementById('chatIdentityPill');
      if (!banner) return;

      const currentContact = (phoneInput && phoneInput.value.trim()) || localStorage.getItem('teklimakan_customer_phone') || '';
      const status = detectUserRole(currentContact);

      banner.classList.remove('guest-mode', 'buyer-mode', 'agent-mode');
      if (status.role === 'agent') {
        banner.classList.add('agent-mode');
      } else if (status.role === 'buyer') {
        banner.classList.add('buyer-mode');
      } else {
        banner.classList.add('guest-mode');
      }

      if (titleEl) titleEl.innerHTML = status.roleTitle;
      if (descEl) descEl.textContent = status.roleDesc;
      if (pillEl) pillEl.textContent = status.pillText;
    }

    // خېرىدار كۆزنىكىنى ئاچقاندا ئىسمى ۋە تېلېفونىنى ئاپتوماتىك كىرگۈزۈش
    function autoFillCustomerInputs() {
      const prof = getCustomerFullProfile();
      if (nameInput) {
        if (!nameInput.value.trim() || nameInput.value.trim() === 'خېرىدار') {
          if (prof.name) {
            nameInput.value = prof.name;
          }
        }
      }
      if (phoneInput) {
        if (!phoneInput.value.trim()) {
          if (prof.phone) {
            phoneInput.value = prof.phone;
          }
        }
      }
      updateIdentityBadge();
    }

    autoFillCustomerInputs();

    if (nameInput) {
      nameInput.addEventListener('input', () => {
        const val = nameInput.value.trim();
        if (val) localStorage.setItem('teklimakan_customer_name', val);
      });
    }
    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        const val = phoneInput.value.trim();
        if (val) localStorage.setItem('teklimakan_customer_phone', val);
        updateIdentityBadge();
      });
      phoneInput.addEventListener('change', () => {
        updateIdentityBadge();
      });
    }

    let custSessionId = localStorage.getItem('teklimakan_cust_session_id');
    if (!custSessionId) {
      custSessionId = 'C' + Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem('teklimakan_cust_session_id', custSessionId);
    }

    function getMySentTgMsgs() {
      try {
        const raw = localStorage.getItem('teklimakan_my_tg_msgs');
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return [];
    }

    function recordMySentTgMsg(msgId) {
      if (!msgId) return;
      const list = getMySentTgMsgs();
      if (!list.includes(msgId)) {
        list.push(msgId);
        try {
          localStorage.setItem('teklimakan_my_tg_msgs', JSON.stringify(list));
        } catch (e) {}
      }
    }

    const CORRECT_BANK_TEXT = `🏦 تەكلىماكان سۇپىسى بانكا ھېسابات ئۇچۇرى (Havale / EFT / FAST):\n\n🏛️ بانكا نامى: QNB Finansbank (Enpara.com)\n👤 ھېسابات ئىگىسى: Abudurusuli tuniyazi\n💳 IBAN:\nTR65 0015 7000 0000 0095 1544 93\n\n⚠️ مۇھىم ئەسكەرتىش: پۇل ئەۋەتكەندە چۈشەندۈرۈش (Açıklama) قىسمىغا چوقۇم (kuruyemiş) دەپ يېزىپ قويۇڭ!`;

    const CORRECT_BANK_TEXT_TR = `🏦 Teklimakan Pazaryeri Resmi Banka Hesap Bilgisi (Havale / EFT / FAST):\n\n🏛️ Banka Adı: QNB Finansbank (Enpara.com)\n👤 Hesap Sahibi: Abudurusuli tuniyazi\n💳 IBAN:\nTR65 0015 7000 0000 0095 1544 93\n\n⚠️ Önemli Not: Havale / EFT yaparken açıklama kısmına mutlaka (kuruyemiş) yazınız!`;

    const CORRECT_BANK_TEXT_EN = `🏦 Teklimakan Official Bank Account Details (Havale / EFT / FAST):\n\n🏛️ Bank: QNB Finansbank (Enpara.com)\n👤 Account Holder: Abudurusuli tuniyazi\n💳 IBAN:\nTR65 0015 7000 0000 0095 1544 93\n\n⚠️ Notice: Please write (kuruyemiş) in the transfer description field!`;

    function getChatHistory() {
      try {
        const raw = localStorage.getItem(CHAT_STORAGE_KEY);
        if (raw) {
          let list = JSON.parse(raw);
          let modified = false;
          list = list.map(item => {
            if (item && item.text && (item.text.includes('TR68 0021') || item.text.includes('GULNISA') || item.text.includes('Ziraat Katılım') || item.text.includes('Ziraat'))) {
              item.text = CORRECT_BANK_TEXT;
              modified = true;
            }
            return item;
          });
          if (modified) {
            saveChatHistory(list);
          }
          return list;
        }
      } catch (e) {}

      const curLang = (window.appI18n && typeof window.appI18n.getLang === 'function') ? window.appI18n.getLang() : 'ug';
      let wName = 'ئالىي باشقۇرغۇچى';
      let wText = 'ئەسسالامۇ ئەلەيكۇم ھۆرمەتلىك خېرىدار! تەكلىماكان سۇپىسىنىڭ ئالىي باشقۇرغۇچىسىغا خۇش كەپسىز. زاكاز، بانكا ھېساباتى، مەھسۇلات ياكى كېلىشىملىك كارگو ھەققىدە قانداق سوئالىڭىز بولسا، تۆۋەندىكى تېز كۇنۇپكىلارنى چەكسىڭىز ياكى بىۋاسىتە ئۇچۇر يازسىڭىز دەرھال ياردەم بېرىمىز!';
      if (curLang === 'tr') {
        wName = 'Canlı Destek & Yönetici';
        wText = 'Merhaba değerli müşterimiz! Teklimakan Pazaryeri canlı destek ve yönetici hattına hoş geldiniz. Sipariş durumunuz, banka hesaplarımız, ürünlerimiz veya kargo süreci hakkında aklınıza takılan her şeyi aşağıdaki hızlı butonlara tıklayarak ya da doğrudan mesaj yazarak bize iletebilirsiniz. Size yardımcı olmaktan mutluluk duyarız!';
      } else if (curLang === 'en') {
        wName = 'Live Support & Management';
        wText = 'Hello valued customer! Welcome to Teklimakan live customer support and management. If you have any questions regarding your orders, bank details, products, or shipping, feel free to click the quick buttons below or write to us directly. We are always ready to assist you!';
      }

      return [
        {
          id: 'msg-welcome',
          sender: 'admin',
          name: wName,
          text: wText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString('zh-CN'),
          timestamp: Date.now()
        }
      ];
    }

    function saveChatHistory(list) {
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(list));
      } catch (e) {}
    }

    function renderChatMessages() {
      if (!messagesContainer) return;
      const history = getChatHistory();
      const curLang = (window.appI18n && typeof window.appI18n.getLang === 'function') ? window.appI18n.getLang() : 'ug';
      messagesContainer.innerHTML = '';

      history.forEach(m => {
        let authorName = m.name;
        let textContent = m.text;

        // ئەگەر ئالىي باشقۇرغۇچىنىڭ كۈتۈۋېلىش سالامى بولسا، ھازىرقى تىلغا ئاساسەن دەل ۋاقتىدا ماسلاشتۇرۇش
        if (m.id === 'msg-welcome') {
          if (curLang === 'tr') {
            authorName = 'Canlı Destek & Yönetici';
            textContent = 'Merhaba değerli müşterimiz! Teklimakan Pazaryeri canlı destek ve yönetici hattına hoş geldiniz. Sipariş durumunuz, banka hesaplarımız, ürünlerimiz veya kargo süreci hakkında aklınıza takılan her şeyi aşağıdaki hızlı butonlara tıklayarak ya da doğrudan mesaj yazarak bize iletebilirsiniz. Size yardımcı olmaktan mutluluk duyarız!';
          } else if (curLang === 'en') {
            authorName = 'Live Support & Management';
            textContent = 'Hello valued customer! Welcome to Teklimakan live customer support and management. If you have any questions regarding your orders, bank details, products, or shipping, feel free to click the quick buttons below or write to us directly. We are always ready to assist you!';
          } else {
            authorName = 'ئالىي باشقۇرغۇچى';
            textContent = 'ئەسسالامۇ ئەلەيكۇم ھۆرمەتلىك خېرىدار! تەكلىماكان سۇپىسىنىڭ ئالىي باشقۇرغۇچىسىغا خۇش كەپسىز. زاكاز، بانكا ھېساباتى، مەھسۇلات ياكى كېلىشىملىك كارگو ھەققىدە قانداق سوئالىڭىز بولسا، تۆۋەندىكى تېز كۇنۇپكىلارنى چەكسىڭىز ياكى بىۋاسىتە ئۇچۇر يازسىڭىز دەرھال ياردەم بېرىمىز!';
          }
        } else {
          if (m.sender === 'admin') {
            if (!authorName || authorName === 'ئالىي باشقۇرغۇچى' || authorName === 'Canlı Destek & Yönetici' || authorName === 'Live Support & Management') {
              authorName = curLang === 'tr' ? 'Canlı Destek & Yönetici' : (curLang === 'en' ? 'Live Support & Admin' : 'ئالىي باشقۇرغۇچى');
            } else if (authorName.includes('(سىستېما)') || authorName.includes('(Sistem)') || authorName.includes('(System)')) {
              authorName = curLang === 'tr' ? 'Canlı Destek (Sistem)' : (curLang === 'en' ? 'Live Support (System)' : 'ئالىي باشقۇرغۇچى (سىستېما)');
            }
          } else {
            if (!authorName || authorName === 'خېرىدار' || authorName === 'سىز' || authorName === 'Siz' || authorName === 'You' || authorName === 'Müşteri') {
              authorName = curLang === 'tr' ? 'Siz' : (curLang === 'en' ? 'You' : 'سىز');
            }
          }
        }

        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${m.sender === 'customer' ? 'customer' : 'admin'}`;
        bubble.innerHTML = `
          <div class="chat-bubble-author">
            <i class="fas ${m.sender === 'customer' ? 'fa-user' : 'fa-crown'}"></i>
            <span>${safeEscape(authorName)}</span>
          </div>
          <div class="chat-bubble-text" style="white-space: pre-wrap;">${safeEscape(textContent)}</div>
          <div class="chat-bubble-time">${m.time || ''}</div>
        `;
        messagesContainer.appendChild(bubble);
      });

      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 50);
    }

    // 🔄 ئالىي باشقۇرغۇچى قايتۇرغان جاۋاب ياكى يىراقتىن ئۆچۈرۈش بۇيرۇقىنى دەل ۋاقتىدا ماسلاشتۇرۇش
    let pollInterval = null;
    let isPolling = false;

    async function checkTelegramReplies() {
      if (isPolling) return;
      if (!window.appStore || typeof window.appStore.getTelegramUpdates !== 'function') return;

      isPolling = true;
      try {
        const updates = await window.appStore.getTelegramUpdates();
        if (!Array.isArray(updates) || updates.length === 0) {
          isPolling = false;
          return;
        }

        const mySentMsgIds = getMySentTgMsgs();
        const currentPhone = localStorage.getItem('teklimakan_customer_phone') || '';
        const cleanPhone = currentPhone.replace(/[\s\-\+]/g, '');
        const history = getChatHistory();
        let hasNewReply = false;

        for (const u of updates) {
          const msg = u && (u.message || u.channel_post);
          if (!msg || !msg.text) continue;

          const replyTo = msg.reply_to_message;
          let isForThisCustomer = false;
          let replyContent = msg.text.trim();

          // 1. ئومۇمىي تازىلاش بۇيرۇقى (Global wipe command)
          if (/^\/(wipe_all|delete_all|clear_all)/i.test(replyContent)) {
            localStorage.removeItem(CHAT_STORAGE_KEY);
            renderChatMessages();
            continue;
          }

          // 2. مەزكۇر خېرىدارغا ئالاقىدارلىقىنى جەزملەشتۈرۈش
          if (replyTo) {
            if (mySentMsgIds.includes(replyTo.message_id)) {
              isForThisCustomer = true;
            } else if (replyTo.text && replyTo.text.includes('#' + custSessionId)) {
              isForThisCustomer = true;
            } else if (cleanPhone && cleanPhone.length >= 8 && replyTo.text && replyTo.text.includes(cleanPhone)) {
              isForThisCustomer = true;
            }
          }

          if (!isForThisCustomer) {
            const cmdPattern = new RegExp(`^(\\/reply|\\/r|\\/wipe|\\/del|\\/delete|#)\\s*#?${custSessionId}\\s*(.*)$`, 'i');
            const match = replyContent.match(cmdPattern);
            if (match) {
              isForThisCustomer = true;
              replyContent = match[2] ? match[2].trim() : replyContent;
            } else if (cleanPhone && cleanPhone.length >= 8 && replyContent.startsWith(cleanPhone)) {
              isForThisCustomer = true;
              replyContent = replyContent.replace(cleanPhone, '').trim();
            }
          }

          if (isForThisCustomer) {
            // 🗑️ باشقۇرغۇچى تېلېگراممىدىن ئۆچۈرۈش / يۇيۇشنى بۇيرۇغان بولسا
            const isDeleteOrder = /^(\/delete|\/del|\/wipe|\/clear|ئۆچۈر|يۇي|ئۆچۈرۈۋەت|ھەممىنى ئۆچۈر)/i.test(replyContent);
            if (isDeleteOrder || replyContent.includes('wipe') || replyContent.includes('clear')) {
              const wipeAllForCust = /^\/(wipe|clear|ھەممىنى ئۆچۈر|پاراڭنى يۇي)/i.test(replyContent) || replyContent.includes('ھەممىنى');
              if (wipeAllForCust) {
                localStorage.removeItem(CHAT_STORAGE_KEY);
                renderChatMessages();
                if (typeof showToast === 'function') {
                  showToast('ئالىي باشقۇرغۇچى تەرىپىدىن پاراڭ خاتىرىسى پۈتۈنلەي تازىلاندى.', 'info');
                }
              } else {
                let h = getChatHistory();
                if (h.length > 1) {
                  h.pop();
                  saveChatHistory(h);
                  renderChatMessages();
                }
              }
              continue;
            }

            // 💬 ئالىي باشقۇرغۇچى يازغان رەسمىي جاۋابنى قوشۇش
            const alreadyExists = history.some(item => item.telegramMsgId === msg.message_id);
            if (!alreadyExists && replyContent) {
              const newReplyObj = {
                id: 'admin-tg-' + msg.message_id,
                telegramMsgId: msg.message_id,
                sender: 'admin',
                name: '👑 ئالىي باشقۇرغۇچى',
                text: replyContent,
                time: new Date(msg.date * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: new Date(msg.date * 1000).toLocaleDateString('zh-CN'),
                timestamp: msg.date * 1000
              };
              history.push(newReplyObj);
              hasNewReply = true;

              if (window.appStore && typeof window.appStore.addCustomerInboxNotification === 'function') {
                window.appStore.addCustomerInboxNotification({
                  phone: currentPhone,
                  title: '👑 ئالىي باشقۇرغۇچىدىن يېڭى ئۇچۇر',
                  type: 'admin_message',
                  message: replyContent,
                  timestamp: new Date(msg.date * 1000).toLocaleString('ug-CN', { hour12: false })
                });
                if (typeof updateCustomerInboxBadges === 'function') {
                  updateCustomerInboxBadges();
                }
              }
            }
          }
        }

        if (hasNewReply) {
          saveChatHistory(history);
          renderChatMessages();
          if (typeof playChime === 'function') playChime('success');

          const isVisible = chatBox && chatBox.style.display !== 'none';
          if (!isVisible) {
            const badge = document.getElementById('chatUnreadBadge');
            if (badge) {
              let count = parseInt(badge.textContent || '0', 10) || 0;
              badge.textContent = (count + 1).toString();
              badge.style.display = 'flex';
            }
            if (typeof showToast === 'function') {
              const pollLang = (window.appI18n && typeof window.appI18n.getLang === 'function') ? window.appI18n.getLang() : 'ug';
              const alertMsg = pollLang === 'tr' 
                ? '👑 Canlı destekten yeni bir mesajınız var!' 
                : (pollLang === 'en' ? '👑 You have a new message from Live Support!' : '👑 ئالىي باشقۇرغۇچىدىن سىزگە يېڭى ئۇچۇر كەلدى!');
              showToast(alertMsg, 'success');
            }
          }
        }
      } catch (err) {
        // Polling error silently handled
      } finally {
        isPolling = false;
      }
    }

    function startPolling(intervalMs = 4000) {
      if (pollInterval) clearInterval(pollInterval);
      pollInterval = setInterval(checkTelegramReplies, intervalMs);
    }

    // دەسلەپكى ئارقا كۆرۈنۈشتە تەكشۈرۈشنى قوزغىتىش
    startPolling(7000);
    setTimeout(checkTelegramReplies, 1200);

    // كۆزنەكنى ئېچىش / تاقاش
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (hub) hub.classList.remove('active');
      const isVisible = chatBox.style.display !== 'none';
      if (isVisible) {
        chatBox.style.display = 'none';
        startPolling(8000);
      } else {
        const doOpenChat = () => {
          chatBox.style.display = 'flex';
          autoFillCustomerInputs();
          const badge = document.getElementById('chatUnreadBadge');
          if (badge) {
            badge.textContent = '0';
            badge.style.display = 'none';
          }
          renderChatMessages();
          if (msgInput) setTimeout(() => msgInput.focus(), 150);
          checkTelegramReplies();
          startPolling(3500);
        };

        if (window.TeklimakanPush && typeof window.TeklimakanPush.requirePermissionBeforeAction === 'function') {
          window.TeklimakanPush.requirePermissionBeforeAction(doOpenChat, 'chat');
        } else {
          doOpenChat();
        }
      }
    });

    // 📲 پەقەت خەۋەرلەندۈرۈشنى رەت قىلغان ياكى تېخى قوشۇلمىغانلار WhatsApp نى چەككەندە ئەسكەرتىش چىقىرىش
    document.addEventListener('click', (e) => {
      const waLink = e.target.closest('a[href*="wa.me"], .chat-wa-direct');
      if (waLink) {
        if (typeof Notification !== 'undefined' && Notification.permission !== 'granted' && window.TeklimakanPush && typeof window.TeklimakanPush.requirePermissionBeforeAction === 'function') {
          e.preventDefault();
          const href = waLink.href;
          const target = waLink.getAttribute('target') || '_blank';
          window.TeklimakanPush.requirePermissionBeforeAction(() => {
            window.open(href, target);
          }, 'whatsapp');
        }
      }
    }, true);

    if (btnClose) {
      btnClose.addEventListener('click', () => {
        chatBox.style.display = 'none';
        startPolling(8000);
      });
    }

    // 🗑️ تارىخنى تازىلاش كۇنۇپكىسى (پەقەت خېرىدار ئۆزى بېسىپ جەزملەشتۈرگەندىلا يۇيۇلىدۇ)
    // 🗑️ تارىخنى تازىلاش كۇنۇپكىسى (پەقەت خېرىدار ئۆزى بېسىپ جەزملەشتۈرگەندىلا يۇيۇلىدۇ)
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        const lang = (window.appI18n && typeof window.appI18n.getLang === 'function') ? window.appI18n.getLang() : 'ug';
        const confirmMsg = lang === 'tr'
          ? 'Sohbet geçmişini silmek istediğinize emin misiniz?\n\nNot: Siz temizlemediğiniz sürece mesajlarınız bu cihazda güvenle saklanmaktadır.'
          : (lang === 'en'
             ? 'Are you sure you want to clear your chat history?\n\nNotice: Your chat history is preserved until you clear it.'
             : 'پاراڭ خاتىرىسىنى راستىنلا تازىلىۋېتەمسىز؟\n\nئەسكەرتىش: ئەگەر ئۆچۈرمىسىڭىز، بىر يىلدىن كېيىن كىرسىڭىزمۇ مەزكۇر تور كۆرگۈدە مەڭگۈ ساقلىنىپ تۇرىدۇ.');
        const confirmed = confirm(confirmMsg);
        if (confirmed) {
          localStorage.removeItem(CHAT_STORAGE_KEY);
          renderChatMessages();
          const clearedToast = lang === 'tr' ? 'Sohbet geçmişi temizlendi!' : (lang === 'en' ? 'Chat history cleared!' : 'پاراڭ خاتىرىسى تازىلاندى!');
          showToast(clearedToast, 'info');
        }
      });
    }

    // ⚡ تېز سۈرۈشتۈرۈش كۇنۇپكىلىرىنى بىر تەرەپ قىلىش (پەقەت مال سېتىۋالغانلار ۋە ۋاكالەتچىلەرگىلا چەكلىمىسىز)
    async function handleQuickAction(actionKey, buttonText) {
      const prof = getCustomerFullProfile();
      const currentContact = (phoneInput && phoneInput.value.trim()) || localStorage.getItem('teklimakan_customer_phone') || '';
      const userStatus = detectUserRole(currentContact);
      const lang = (window.appI18n && typeof window.appI18n.getLang === 'function') ? window.appI18n.getLang() : 'ug';

      // 🔒 سېتىۋالمىغان مېھمانلارغا تېز كۇنۇپكىلارنى چەكلەش
      if (!userStatus.canUseUnlimited) {
        if (phoneInput) {
          phoneInput.classList.add('input-error');
          phoneInput.focus();
          setTimeout(() => phoneInput.classList.remove('input-error'), 2500);
        }

        let lockAdminName = 'ئالىي باشقۇرغۇچى (سىستېما)';
        let lockMsgText = `🔒 ھۆرمەتلىك مېھمان!\n\n«${buttonText}» تېز سۈرۈشتۈرۈش كۇنۇپكىسى پەقەتلا **مەھسۇلات سېتىۋالغان خېرىدارلار** ۋە **ۋاكالەتچىلەر** ئۈچۈنلا چەكلىمىسىز ئىشلەيدۇ.\n\n• ئەگەر ئالدىن مال سېتىۋالغان بولسىڭىز، سېتىۋالغاندا كىرگۈزگەن تېلېفون نومۇرىڭىزنى ياكى پوسۇلكا كودىڭىزنى ئاستىغا كىرگۈزسىڭىز، كۇنۇپكىلار دەرھال ئېچىلىدۇ.\n• دەسلەپكى مەسلىھەت ئۈچۈن WhatsApp كۇنۇپكىمىزنى ئىشلەتسىڭىز ياكى تېلېفونىڭىزنى يېزىپ بىۋاسىتە ئۇچۇر يوللىسىڭىز بولىدۇ.`;
        let toastText = '🔒 بۇ كۇنۇپكا سېتىۋالغان خېرىدارلار ۋە ۋاكالەتچىلەرگىلا ئوچۇق!';

        if (lang === 'tr') {
          lockAdminName = 'Canlı Destek (Sistem)';
          lockMsgText = `🔒 Değerli Misafirimiz!\n\n«${buttonText}» hızlı sorgulama butonu yalnızca **sipariş vermiş müşterilerimiz** ve **yetkili temsilcilerimiz** için sınırsız olarak açıktır.\n\n• Daha önce sitemizden alışveriş yaptıysanız, sipariş verirken kullandığınız telefon numaranızı veya kargo kodunuzu aşağıya girerek butonları hemen aktif hale getirebilirsiniz.\n• Doğrudan danışmak için WhatsApp destek hattımızı kullanabilir veya numaranızı yazarak bize mesaj iletebilirsiniz.`;
          toastText = '🔒 Bu buton yalnızca sipariş vermiş müşterilerimiz ve yetkili temsilcilere açıktır!';
        } else if (lang === 'en') {
          lockAdminName = 'Live Support (System)';
          lockMsgText = `🔒 Dear Guest!\n\n«${buttonText}» quick action button is available for **registered buyers** and **authorized agents** only.\n\n• If you have placed an order before, please enter your contact phone or order ID below to unlock.\n• You can also reach us directly via WhatsApp or submit a direct message.`;
          toastText = '🔒 This button is only available to buyers and agents!';
        }

        const lockMsg = {
          id: 'admin-lock-' + Date.now(),
          sender: 'admin',
          name: lockAdminName,
          text: lockMsgText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString('zh-CN'),
          timestamp: Date.now()
        };

        const history = getChatHistory();
        history.push(lockMsg);
        saveChatHistory(history);
        renderChatMessages();

        if (typeof showToast === 'function') {
          showToast(toastText, 'warning');
        }
        return;
      }

      const defaultCustName = lang === 'tr' ? 'Müşteri' : (lang === 'en' ? 'Customer' : 'خېرىدار');
      const custName = (nameInput && nameInput.value.trim()) || prof.name || defaultCustName;
      const custPhone = currentContact;

      if (custPhone) localStorage.setItem('teklimakan_customer_phone', custPhone);
      if (custName && custName !== 'خېرىدار' && custName !== 'Müşteri' && custName !== 'Customer') localStorage.setItem('teklimakan_customer_name', custName);

      let questionText = buttonText || (lang === 'tr' ? 'Sorgulama' : (lang === 'en' ? 'Inquiry' : 'سۈرۈشتۈرۈش'));
      let answerText = '';

      if (actionKey === 'track' || buttonText.includes('پوسۇلكا') || buttonText.includes('زاكاز') || buttonText.toLowerCase().includes('kargo') || buttonText.toLowerCase().includes('track') || buttonText.toLowerCase().includes('sipariş')) {
        if (lang === 'tr') {
          questionText = '📦 Sipariş ve kargo durumumu sorgulamak istiyorum.';
          answerText = `📦 Değerli müşterimiz! Siparişinizin kargo durumunu öğrenmek için:\n\n1. Sitemizin üst veya alt kısmında yer alan «📦 Kargo Takibi» butonuna tıklayarak telefon numaranızla kargonuzun canlı durumunu ve takip kodunu hemen görüntüleyebilirsiniz.\n\n2. Dilerseniz sipariş numaranızı buraya yazabilirsiniz, ekibimiz en kısa sürede kontrol edip size bilgi verecektir.`;
        } else if (lang === 'en') {
          questionText = '📦 I would like to check my parcel and order status.';
          answerText = `📦 Valued customer! Here is how to track your parcel:\n\n1. Click the «📦 Track Parcel» button at the top or bottom of our site and enter your phone number to see live status and tracking code.\n\n2. Or leave your order number right here and our team will get back to you shortly.`;
        } else {
          questionText = '📦 پوسۇلكا ئەھۋالىمنى سۈرۈشتۈرمەكچىتىم.';
          answerText = `📦 ھۆرمەتلىك خېرىدار! سېتىۋالغان مېلىڭىزنىڭ پوسۇلكا ئەھۋالىنى سۈرۈشتۈرۈش ئۇسۇللىرى:\n\n1. تور بېكىتىمىزنىڭ ئاستى ياكى ئۈستىدىكى «📦 پوسۇلكام» كۇنۇپكىسىنى چەكسىڭىز، تېلېفون نومۇرىڭىز ئارقىلىق مېلىڭىزنىڭ تەپسىلاتى، نەق مەيداندىكى ئورنى ۋە پوچتا ئىز قوغلاش كودىنى دەرھال كۆرەلەيسىز.\n\n2. ياكى پوسۇلكا نومۇرىڭىزنى مۇشۇ يەرگە يېزىپ قالدۇرسىڭىز، بىز تېز ئارىدا جاۋاب قايتۇرىمىز.`;
        }
      } else if (actionKey === 'bank' || buttonText.includes('بانكا') || buttonText.toLowerCase().includes('banka') || buttonText.toLowerCase().includes('bank')) {
        if (lang === 'tr') {
          questionText = '💳 Ödeme yapmak için resmi banka IBAN bilgisini alabilir miyim?';
          answerText = CORRECT_BANK_TEXT_TR;
        } else if (lang === 'en') {
          questionText = '💳 Can I have the official bank IBAN information for payment?';
          answerText = CORRECT_BANK_TEXT_EN;
        } else {
          questionText = '💳 پۇل تۆلەش ئۈچۈن بانكا IBAN ئۇچۇرىنى بەرسىڭىز.';
          answerText = CORRECT_BANK_TEXT;
        }
      } else if (actionKey === 'cargo' || buttonText.includes('كارگو') || buttonText.toLowerCase().includes('teslimat') || buttonText.toLowerCase().includes('cargo')) {
        if (lang === 'tr') {
          questionText = '🚚 Siparişim ne zaman kargoya verilir, teslimat süreci nasıldır?';
          answerText = `🚚 Değerli müşterimiz! Tüm siparişler onaylandıktan sonra özenle hazırlanıp en hızlı şekilde anlaşmalı kargo firmasına teslim edilmektedir.\n\nKargonuz yola çıktığında kargo takip numaranız SMS ve sistem üzerinden tarafınıza iletilir. Siparişiniz hakkında detaylı bilgi için sipariş numaranızı yazabilirsiniz.`;
        } else if (lang === 'en') {
          questionText = '🚚 When will my order be shipped, and how does delivery work?';
          answerText = `🚚 Valued customer! All confirmed orders are carefully packed and handed to our partner courier promptly.\n\nAs soon as your shipment departs, you will receive a tracking code via SMS and on site. Feel free to leave your order ID here for specific updates.`;
        } else {
          questionText = '🚚 مېلىم قاچان يوللىنىدۇ، كارگو ئەھۋالى قانداق؟';
          answerText = `🚚 ھۆرمەتلىك خېرىدار! بارلىق زاكازلار تەستىقلانغاندىن كېيىن تېز سۈرئەتتە رەتلىنىپ، كېلىشىملىك پوچتا (كارگو) شىركىتىگە تاپشۇرۇلىدۇ.\n\nپوسۇلكىڭىز يوللانغان ھامان سىزگە ئاپتوماتىك كارگو ئىز قوغلاش كودى ئۇچۇرى كېلىدۇ. مېلىڭىز ھەققىدە تېخىمۇ تەپسىلىي بىلگۈڭىز بولسا، پوسۇلكا نومۇرىڭىزنى يېزىپ قويۇڭ.`;
        }
      } else {
        questionText = buttonText;
        answerText = lang === 'tr' 
          ? 'Merhaba! Mesajınızı başarıyla aldık, en kısa sürede sizinle iletişime geçeceğiz...' 
          : (lang === 'en' ? 'Hello! We have received your inquiry and will respond promptly...' : 'ئەسسالامۇ ئەلەيكۇم! سىزنىڭ ئۇچۇرىڭىزنى تاپشۇرۇپ ئالدۇق، ئەڭ قىسقا ۋاقىتتا جاۋاب قايتۇرىمىز...');
      }

      // 1. خېرىدار سوئالى كۆزنەككە قوشۇلىدۇ
      const clientMsg = {
        id: 'msg-' + Date.now(),
        sender: 'customer',
        name: custName,
        phone: custPhone,
        text: questionText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('zh-CN'),
        timestamp: Date.now()
      };

      const history = getChatHistory();
      history.push(clientMsg);
      saveChatHistory(history);
      renderChatMessages();

      if (typeof playChime === 'function') playChime('click');

      // 2. ئاپتوماتىك تەپسىلىي جاۋاب خېرىدارغا چىقىرىلىدۇ
      setTimeout(() => {
        const replyMsg = {
          id: 'admin-auto-' + Date.now(),
          sender: 'admin',
          name: lang === 'tr' ? 'Canlı Destek & Yönetici' : (lang === 'en' ? 'Live Support & Admin' : 'ئالىي باشقۇرغۇچى'),
          text: answerText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString('zh-CN'),
          timestamp: Date.now()
        };
        const updated = getChatHistory();
        updated.push(replyMsg);
        saveChatHistory(updated);
        renderChatMessages();
        if (typeof playChime === 'function') playChime('success');
      }, 350);

      // 3. ئالىي باشقۇرغۇچىنىڭ تېلېگراممىسىغا سىگنال ئەۋەتىش
      if (window.appStore && typeof window.appStore.sendTelegramAlert === 'function') {
        let orderHistoryBlock = 'تېخى مال ئالمىغان يېڭى خېرىدار';
        if (userStatus.ordersCount > 0) {
          orderHistoryBlock = `${userStatus.ordersCount} قېتىم سېتىۋالغان (جەمئىي: ${prof.totalSpent}₺)\n   • ئاخىرقى پوسۇلكا: #${prof.lastOrderId} (${prof.lastOrderStatus || 'تەستىقلاندى'})`;
        }
        let cartBlock = 'سېۋىتى بوش';
        if (prof.cartItemsCount > 0) {
          cartBlock = `سېۋەتتە ${prof.cartItemsCount} دانە تاۋار بار (ئومۇمىي: ${prof.cartTotal}₺)`;
        }
        let addrBlock = 'تېخى ئادرېس كىرگۈزمىگەن';
        if (prof.address || prof.city) {
          addrBlock = `${prof.city ? prof.city + ' - ' : ''}${prof.address}`;
        }

        const waPhone = custPhone.replace(/[\s\-\+]/g, '');
        const waLink = waPhone ? `https://wa.me/${waPhone}` : 'https://wa.me/905551609999';
        const telLink = waPhone ? `tel:${waPhone}` : '#';

        const tgAlertText = 
`👤 <b>ئىشلەتكۈچى:</b> <b>${custName}</b>
🏷️ <b>سالاھىيىتى:</b> ${userStatus.roleTitle} (${userStatus.pillText})
📱 <b>تېلېفون / ئېلخەت:</b> <code>${custPhone || 'كىرگۈزمىگەن'}</code>
📍 <b>ئادرېس / رايونى:</b> ${addrBlock}
📦 <b>سېتىۋېلىش تارىخى:</b> ${orderHistoryBlock}
🛒 <b>نۆۋەتتىكى سېۋىتى:</b> ${cartBlock}
🌐 <b>ئۈسكۈنە ۋە تىل:</b> ${prof.deviceStr} | ${prof.langInfo}
🆔 <b>خېرىدار كودى:</b> <code>#${custSessionId}</code>

⚡ <b>تېز سۈرۈشتۈرۈش تۈرى:</b> ${questionText}
🤖 <b>چىقىرىلغان ئاپتوماتىك جاۋاب:</b>
${answerText}

💡 <b>باشقۇرۇش ئۇسۇلى:</b>
• مۇشۇ ئۇچۇرغا «Reply» قىلىپ سۆز يازسىڭىز -> خېرىدار كۆزنىكىگە بارىدۇ.
• «ئۆچۈر» ياكى «/del» دەپ جاۋاب قايتۇرسىڭىز -> خېرىداردىن بۇ ئۇچۇر مەڭگۈ يۇيۇلىدۇ!
• «/wipe» دەپ جاۋاب قايتۇرسىڭىز -> خېرىداردىن پۈتۈن پاراڭ مەڭگۈ تازىلىنىدۇ!

👉 <a href="${waLink}">WhatsApp ئارقىلىق ئالاقىلىشىش</a> | <a href="${telLink}">تېلېفون ئۇرۇش</a>`;

        window.appStore.sendTelegramAlert({
          title: `⚡ [تېز سۈرۈشتۈرۈش] ${custName}: «${questionText.slice(0, 15)}...»`,
          message: tgAlertText,
          isUrgent: false
        }).then(res => {
          if (res && res.data && res.data.result && res.data.result.message_id) {
            recordMySentTgMsg(res.data.result.message_id);
          }
        }).catch(() => {});
      }

      if (window.appStore && typeof window.appStore.recordCustomerChatMessage === 'function') {
        window.appStore.recordCustomerChatMessage({
          ...clientMsg,
          address: prof.address ? `${prof.city ? prof.city + ' - ' : ''}${prof.address}` : '',
          orderHistory: userStatus.ordersCount > 0 ? `${userStatus.ordersCount} زاكاز (${prof.totalSpent}₺)` : '',
          cartInfo: prof.cartItemsCount > 0 ? `${prof.cartItemsCount} تاۋار` : ''
        });
      }
    }

    // 🚀 ئۇچۇر ئەۋەتىش (تېلېفون ياكى ئېلخەت تەلەپ قىلىنىدۇ + ئەخلەت ئۇچۇردىن ساقلىنىش)
    async function sendMessage() {
      if (!msgInput) return;
      const text = msgInput.value.trim();
      if (!text) return;

      const lang = (window.appI18n && typeof window.appI18n.getLang === 'function') ? window.appI18n.getLang() : 'ug';
      const currentContact = (phoneInput && phoneInput.value.trim()) || localStorage.getItem('teklimakan_customer_phone') || '';
      const cleanDigits = currentContact.replace(/\D/g, '');
      const hasPhone = cleanDigits.length >= 7;
      const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentContact);

      // 🛑 شەرت: تېلېفون ياكى ئېلخەت تولدۇرۇلغان بولۇشى شەرت
      if (!hasPhone && !hasEmail) {
        if (phoneInput) {
          phoneInput.classList.add('input-error');
          phoneInput.focus();
          setTimeout(() => phoneInput.classList.remove('input-error'), 2500);
        }
        if (typeof showToast === 'function') {
          const errToast = lang === 'tr'
            ? '⚠️ Yöneticiye mesaj göndermek için lütfen telefon numaranızı veya e-postanızı giriniz!'
            : (lang === 'en' ? '⚠️ Please enter your phone number or email to send a message!' : '⚠️ ئالىي باشقۇرغۇچىغا ئۇچۇر ئەۋەتىش ئۈچۈن، تېلېفون نومۇرىڭىز ياكى ئىمائىلىڭىزنى كىرگۈزۈڭ!');
          showToast(errToast, 'error');
        }
        return;
      }

      // 🛑 ئەخلەت ئۇچۇردىن قوغداش (Rate Limiting: 1 مىنۇتتا ئەڭ كۆپ بولغاندا 4 ئۇچۇر)
      const now = Date.now();
      let rateTimestamps = [];
      try {
        rateTimestamps = JSON.parse(sessionStorage.getItem('teklimakan_chat_rate_v1') || '[]');
      } catch(e) {}
      rateTimestamps = rateTimestamps.filter(t => now - t < 60000);
      if (rateTimestamps.length >= 4) {
        if (typeof showToast === 'function') {
          const rateToast = lang === 'tr'
            ? '⏳ Çok fazla mesaj gönderdiniz! Sistem güvenliği için lütfen 30 saniye sonra tekrar deneyiniz.'
            : (lang === 'en' ? '⏳ Too many messages! Please try again in 30 seconds.' : '⏳ بەك كۆپ ئۇچۇر ئەۋەتتىڭىز! سىستېما قوغدالدى، 30 سېكۇنتتىن كېيىن قايتا سىناڭ.');
          showToast(rateToast, 'warning');
        }
        return;
      }
      rateTimestamps.push(now);
      try {
        sessionStorage.setItem('teklimakan_chat_rate_v1', JSON.stringify(rateTimestamps));
      } catch(e) {}

      const prof = getCustomerFullProfile();
      const userRole = detectUserRole(currentContact);
      const defaultCustName = lang === 'tr' ? 'Müşteri' : (lang === 'en' ? 'Customer' : 'خېرىدار');
      const custName = (nameInput && nameInput.value.trim()) || prof.name || defaultCustName;
      const custPhone = currentContact;

      if (custPhone) localStorage.setItem('teklimakan_customer_phone', custPhone);
      if (custName && custName !== 'خېرىدار' && custName !== 'Müşteri' && custName !== 'Customer') localStorage.setItem('teklimakan_customer_name', custName);

      const newMsg = {
        id: 'msg-' + Date.now(),
        sender: 'customer',
        name: custName,
        phone: custPhone,
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('zh-CN'),
        timestamp: Date.now()
      };

      const history = getChatHistory();
      history.push(newMsg);
      saveChatHistory(history);
      renderChatMessages();
      msgInput.value = '';

      if (typeof playChime === 'function') playChime('click');

      // 🤖 ئاپتوماتىك سىپايە جاۋاب
      setTimeout(() => {
        let replyName = 'ئالىي باشقۇرغۇچى';
        let replyText = 'ئەسسالامۇ ئەلەيكۇم! سىزنىڭ ئۇچۇرىڭىزنى تاپشۇرۇپ ئالدۇق، ئەڭ قىسقا ۋاقىتتا جاۋاب قايتۇرىمىز...';
        if (lang === 'tr') {
          replyName = 'Canlı Destek & Yönetici';
          replyText = 'Merhaba! Mesajınızı başarıyla aldık, en kısa sürede sizinle iletişime geçeceğiz...';
        } else if (lang === 'en') {
          replyName = 'Live Support & Admin';
          replyText = 'Hello! We have received your message and will get back to you as soon as possible...';
        }

        const reply = {
          id: 'admin-auto-reply-' + Date.now(),
          sender: 'admin',
          name: replyName,
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString('zh-CN'),
          timestamp: Date.now()
        };
        const updated = getChatHistory();
        updated.push(reply);
        saveChatHistory(updated);
        renderChatMessages();
        if (typeof playChime === 'function') playChime('success');
      }, 700);

      // 📲 ئالىي باشقۇرغۇچىغا خېرىدارنىڭ سالاھىيىتى ۋە تەپسىلىي ئۇچۇرلىرى بىلەن سىگنال ئەۋەتىش
      if (window.appStore && typeof window.appStore.sendTelegramAlert === 'function') {
        let orderHistoryBlock = 'تېخى مال ئالمىغان مېھمان';
        if (userRole.ordersCount > 0) {
          orderHistoryBlock = `${userRole.ordersCount} قېتىم سېتىۋالغان (جەمئىي: ${prof.totalSpent}₺)\n   • ئاخىرقى پوسۇلكا: #${prof.lastOrderId} (${prof.lastOrderStatus || 'تەستىقلاندى'})`;
        }
        let cartBlock = 'سېۋىتى بوش';
        if (prof.cartItemsCount > 0) {
          cartBlock = `سېۋەتتە ${prof.cartItemsCount} دانە تاۋار بار (ئومۇمىي: ${prof.cartTotal}₺)`;
        }
        let addrBlock = 'تېخى ئادرېس كىرگۈزمىگەن';
        if (prof.address || prof.city) {
          addrBlock = `${prof.city ? prof.city + ' - ' : ''}${prof.address}`;
        }

        const waPhone = custPhone.replace(/[\s\-\+]/g, '');
        const waLink = waPhone ? `https://wa.me/${waPhone}` : 'https://wa.me/905551609999';
        const telLink = waPhone ? `tel:${waPhone}` : '#';

        const tgAlertText = 
`👤 <b>ئىشلەتكۈچى:</b> <b>${custName}</b>
🏷️ <b>سالاھىيىتى:</b> ${userRole.roleTitle} (${userRole.pillText})
📱 <b>تېلېفون / ئېلخەت:</b> <code>${custPhone || 'كىرگۈزمىگەن'}</code>
📍 <b>ئادرېس / رايونى:</b> ${addrBlock}
📦 <b>سېتىۋېلىش تارىخى:</b> ${orderHistoryBlock}
🛒 <b>نۆۋەتتىكى سېۋىتى:</b> ${cartBlock}
🌐 <b>ئۈسكۈنە ۋە تىل:</b> ${prof.deviceStr} | ${prof.langInfo}
🆔 <b>خېرىدار كودى:</b> <code>#${custSessionId}</code>
⏰ <b>ۋاقتى:</b> ${new Date().toLocaleString()}

📝 <b>ئۇچۇر مەزمۇنى:</b>
${text}

💬 <b>باشقۇرۇش ئۇسۇلى:</b>
• مۇشۇ ئۇچۇرغا «Reply» قىلىپ سۆز يازسىڭىز -> خېرىدار كۆزنىكىگە بىۋاسىتە بارىدۇ!
• «ئۆچۈر» ياكى «/del» دەپ جاۋاب قايتۇرسىڭىز -> خېرىداردىن بۇ ئۇچۇر مەڭگۈ يۇيۇلىدۇ!
• «/wipe» دەپ جاۋاب قايتۇرسىڭىز -> خېرىداردىن پۈتۈن پاراڭ مەڭگۈ تازىلىنىدۇ!

👉 <a href="${waLink}">WhatsApp ئارقىلىق ئالاقىلىشىش</a> | <a href="${telLink}">تېلېفون ئۇرۇش</a>`;

        window.appStore.sendTelegramAlert({
          title: `💬 [${userRole.pillText}] ${custName} ئالىي باشقۇرغۇچىغا ئۇچۇر يازدى!`,
          message: tgAlertText,
          isUrgent: true
        }).then(res => {
          if (res && res.data && res.data.result && res.data.result.message_id) {
            recordMySentTgMsg(res.data.result.message_id);
          }
        }).catch(err => {
          console.warn('Live chat Telegram alert failed:', err);
        });
      }

      // ئارقا سۇپىدىكى خېرىدارلار ئۇچۇرىغا ساقلاش
      if (window.appStore && typeof window.appStore.recordCustomerChatMessage === 'function') {
        window.appStore.recordCustomerChatMessage({
          ...newMsg,
          address: prof.address ? `${prof.city ? prof.city + ' - ' : ''}${prof.address}` : '',
          orderHistory: prof.ordersCount > 0 ? `${prof.ordersCount} زاكاز (${prof.totalSpent}₺)` : '',
          cartInfo: prof.cartItemsCount > 0 ? `${prof.cartItemsCount} تاۋار` : ''
        });
      }
    }

    if (btnSend) {
      btnSend.addEventListener('click', sendMessage);
    }

    if (msgInput) {
      msgInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
    }

    // تېز سوئال تاللاش كۇنۇپكىلىرىنى ئۇلاش
    document.querySelectorAll('.chat-chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        const action = chip.dataset.action || '';
        const msg = chip.dataset.msg || chip.textContent;
        handleQuickAction(action, msg);
      });
    });

    // 🌐 كۆپ تىللىق يېڭىلاش ئۈچۈن قوشۇمچە تۇتقۇچ
    window.updateCustomerLiveChatLocalization = function() {
      updateIdentityBadge();
      renderChatMessages();
    };
  }

  // ==================== 📱 يانفون قايتىش كۇنۇپكىسى (Android Back ◄) ۋە خېرىدارنى تۇتۇپ قېلىش قوغدىغۇچىسى ====================
  function initMobileNavigationHistoryShield() {
    let allowNativeExit = false;

    // 1. دەسلەپكى تارىخ ھالىتىنى قوغداش كاپالىتىگە كىرگۈزۈش (Ensure history buffer exists)
    try {
      if (!window.history.state || window.history.state.teklimakanShield !== 'active') {
        window.history.replaceState({ teklimakanShield: 'root' }, '');
        window.history.pushState({ teklimakanShield: 'active' }, '');
      }
    } catch (e) {
      console.warn('History state init error:', e);
    }

    // 2. تەكشۈرۈش: ھازىر ئېكراندا ئېچىقلىق كۆزنەك (Modal / Drawer / Chat) بارمۇ يوق
    function getOpenModalsList() {
      const list = [];

      // A. خېرىدارنى تۇتۇپ قېلىش كۆزنىكى
      const exitModal = document.getElementById('teklimakanExitRetentionModal');
      if (exitModal && exitModal.classList.contains('active')) {
        list.push({
          type: 'exit_retention',
          close: () => {
            exitModal.classList.remove('active');
            exitModal.style.display = 'none';
            document.body.style.overflow = '';
          }
        });
      }

      // B. ھەرىكەت ئىجازەت كۆزنىكى (Action Permission Modal)
      const actionPermModal = document.getElementById('teklimakanActionPermissionModal');
      if (actionPermModal && actionPermModal.parentElement) {
        list.push({
          type: 'action_permission',
          close: () => {
            actionPermModal.remove();
          }
        });
      }

      // C. كۇپون مۇۋەپپەقىيەت كۆزنىكى (Coupon Success Modal)
      const couponModal = document.getElementById('teklimakanCouponSuccessModal');
      if (couponModal && couponModal.parentElement) {
        list.push({
          type: 'coupon_success',
          close: () => {
            couponModal.remove();
          }
        });
      }

      // D. ئالىي باشقۇرغۇچى تور پاراڭ كۆزنىكى (Live Chat Box)
      const chatBox = document.getElementById('adminLiveChatBox');
      if (chatBox && window.getComputedStyle(chatBox).display !== 'none') {
        list.push({
          type: 'live_chat',
          close: () => {
            chatBox.style.display = 'none';
          }
        });
      }

      // E. سېۋەت ۋە ياقتۇرغانلار تارتمىسى (.cart-overlay.active)
      const activeOverlays = document.querySelectorAll('.cart-overlay.active');
      activeOverlays.forEach(overlay => {
        list.push({
          type: 'drawer',
          close: () => {
            overlay.classList.remove('active');
            document.body.classList.remove('cart-drawer-open');
            document.body.style.overflow = '';
          }
        });
      });

      // F. بارلىق ئۆلچەملىك يۈرۈشلۈك كۆزنەكلەر (.modal-backdrop.active)
      const activeModals = document.querySelectorAll('.modal-backdrop.active');
      activeModals.forEach(modal => {
        if (modal.id === 'teklimakanExitRetentionModal') return;
        list.push({
          type: 'modal',
          close: () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            // ئەگەر تاۋار تەپسىلاتى كۆزنىكى بولسا، URL دىكى پارامېتىرنى سۈرتمەي تازىلاش
            if (modal.id === 'quickViewModal') {
              if (window.history && window.history.replaceState) {
                const url = new URL(window.location.href);
                if (url.searchParams.has('product')) {
                  url.searchParams.delete('product');
                  window.history.replaceState({}, document.title, url.pathname + (url.search ? url.search : '') + url.hash);
                }
              }
            }
          }
        });
      });

      return list;
    }

    // 3. تور بېكەتتىن چىقىپ كېتىشنىڭ ئالدىنى ئېلىش ۋە تۇتۇپ قېلىش كۆزنىكى قۇرۇش (Exit-Intent Retention Modal)
    function createRetentionModalIfNotExists() {
      const i18n = window.appI18n;
      const lang = (i18n && i18n.getLang()) || 'ug';
      const isRtl = i18n ? i18n.isRTL() : (lang === 'ug');

      let modal = document.getElementById('teklimakanExitRetentionModal');
      if (modal) {
        if (modal.dataset.lang !== lang) {
          modal.remove();
          modal = null;
        } else {
          return modal;
        }
      }

      modal = document.createElement('div');
      modal.id = 'teklimakanExitRetentionModal';
      modal.dataset.lang = lang;
      modal.className = 'modal-backdrop';
      modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.85);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 1000000;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 16px;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.3s ease;
        direction: ${isRtl ? 'rtl' : 'ltr'};
        font-family: inherit;
      `;

      const tData = {
        ug: {
          title: 'بىر دەم كۈتۈپ تۇرۇڭ!',
          sub: 'تەكلىماكان سودا تورىدىن ئايرىلماقچىمۇ؟',
          body: 'ھۆرمەتلىك خېرىدارىمىز، سىز ئۈچۈن مەخسۇس تەييارلانغان <b style="color: #dc2626;">50 ₺ لىق نەق پۇل تېجەش كۇپونى</b> نى قوبۇل قىلىپ، مال سېتىۋېلىشنى داۋاملاشتۇرۇڭ!',
          codeLabel: 'ئېتىبار كودى (50 ₺ تېجەش):',
          copy: 'كۆچۈرۈش',
          copied: 'كۆچۈرۈلدى!',
          saved: 'ساقلاندى!',
          b1: 'كاپالەتلىك ئەسلى شىپالىق ئۇيغۇر تىبابەت مەھسۇلاتلىرى',
          b2: 'تېز سۈرئەتتە ئىشىك ئالدىغىچە بىخەتەر يەتكۈزۈش',
          b3: 'رازى بولمىسىڭىز مالنى قايتۇرۇپ ئالماشتۇرۇش كاپالىتى',
          stay: 'مال سېتىۋېلىشنى داۋاملاشتۇرۇش',
          exit: 'تور بېكەتتىن چىقىش',
          toast: '🎉 50 ₺ لىق ئېتىبار كۇپونى سېۋىتىڭىزگە ئاپتوماتىك قوشۇلدى!'
        },
        tr: {
          title: 'Bir Dakika Bekleyin!',
          sub: "Teklimakan Pazaryeri'nden ayrılıyor musunuz?",
          body: 'Değerli müşterimiz, sizin için hazırladığımız özel <b style="color: #dc2626;">50 ₺ indirim kuponunu</b> kullanarak alışverişinize devam edin!',
          codeLabel: 'İndirim Kodu (50 ₺ İndirim):',
          copy: 'Kopyala',
          copied: 'Kopyalandı!',
          saved: 'Kaydedildi!',
          b1: 'Garantili orijinal şifalı doğal Uygur tıbbı ürünleri',
          b2: 'Hızlı ve kapınıza kadar güvenli teslimat',
          b3: 'Memnuniyet ve kolay iade / değişim garantisi',
          stay: 'Alışverişe Devam Et',
          exit: 'Siteden Ayrıl',
          toast: '🎉 50 ₺ indirim kuponu sepetinize otomatik olarak tanımlandı!'
        },
        en: {
          title: 'Wait a moment!',
          sub: 'Leaving Teklimakan E-Commerce?',
          body: 'Dear customer, continue shopping with our exclusive <b style="color: #dc2626;">50 ₺ discount coupon</b> prepared just for you!',
          codeLabel: 'Discount Code (Save 50 ₺):',
          copy: 'Copy',
          copied: 'Copied!',
          saved: 'Saved!',
          b1: 'Guaranteed authentic Uyghur wellness & herbal products',
          b2: 'Fast and safe door-to-door delivery',
          b3: '100% Satisfaction & easy returns guarantee',
          stay: 'Continue Shopping',
          exit: 'Exit Website',
          toast: '🎉 50 ₺ coupon discount has been applied to your cart!'
        }
      };

      const cText = tData[lang] || tData.ug;
      const alignStyle = isRtl ? 'right' : 'left';

      modal.innerHTML = `
        <div class="retention-modal-card" style="
          background: #ffffff;
          border-radius: 24px;
          max-width: 440px;
          width: 100%;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(226, 232, 240, 0.8);
          animation: modalPopIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          text-align: center;
        ">
          <!-- باشنامە ۋە بېزەك -->
          <div style="background: linear-gradient(135deg, #1e3a8a, #0f172a); padding: 24px 20px 20px; color: #ffffff; position: relative;">
            <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #fbbf24, #d97706); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 2rem; color: #ffffff; box-shadow: 0 8px 20px rgba(217, 119, 6, 0.4); margin-bottom: 12px; border: 3px solid rgba(255,255,255,0.3);">
              🎁
            </div>
            <h3 style="margin: 0 0 6px; font-size: 1.3rem; font-weight: 900; color: #ffffff; line-height: 1.4;">
              ${cText.title}
            </h3>
            <p style="margin: 0; font-size: 0.88rem; color: #fef08a; font-weight: 700;">
              ${cText.sub}
            </p>
          </div>

          <!-- مەزمۇن قىسمى -->
          <div style="padding: 20px 22px;">
            <p style="margin: 0 0 16px; font-size: 0.95rem; color: #334155; line-height: 1.7; font-weight: 600;">
              ${cText.body}
            </p>

            <!-- كۇپون كارتىسى -->
            <div style="
              background: #fffbeb;
              border: 2px dashed #f59e0b;
              border-radius: 16px;
              padding: 14px 16px;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 12px;
            ">
              <div style="text-align: ${alignStyle};">
                <div style="font-size: 0.78rem; font-weight: 800; color: #b45309; margin-bottom: 2px;">${cText.codeLabel}</div>
                <div style="font-size: 1.25rem; font-weight: 900; color: #1e3a8a; letter-spacing: 1px; font-family: monospace;">TEKLIMAKAN50</div>
              </div>
              <button type="button" id="btnCopyRetentionCoupon" style="
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: #ffffff;
                border: none;
                border-radius: 10px;
                padding: 8px 14px;
                font-weight: 800;
                font-size: 0.85rem;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
                transition: transform 0.15s ease, background 0.2s ease;
                white-space: nowrap;
              ">
                <i class="far fa-copy"></i> ${cText.copy}
              </button>
            </div>

            <!-- پايدىلىق ئەۋزەللىكلەر تىزىملىكى -->
            <div style="text-align: ${alignStyle}; background: #f8fafc; border-radius: 12px; padding: 12px 14px; margin-bottom: 22px; font-size: 0.84rem; color: #475569; line-height: 1.8;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <i class="fas fa-check-circle" style="color: #16a34a;"></i>
                <span>${cText.b1}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <i class="fas fa-shipping-fast" style="color: #2563eb;"></i>
                <span>${cText.b2}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-shield-alt" style="color: #ea580c;"></i>
                <span>${cText.b3}</span>
              </div>
            </div>

            <!-- ھەرىكەت كۇنۇپكىلىرى -->
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <button type="button" id="btnStayAndShop" style="
                background: linear-gradient(135deg, #16a34a, #15803d);
                color: #ffffff;
                border: none;
                border-radius: 14px;
                padding: 13px 20px;
                font-size: 1.02rem;
                font-weight: 800;
                cursor: pointer;
                box-shadow: 0 6px 18px rgba(22, 163, 74, 0.35);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: transform 0.15s ease;
              ">
                <i class="fas fa-shopping-bag"></i> ${cText.stay}
              </button>

              <button type="button" id="btnConfirmExitSite" style="
                background: transparent;
                color: #94a3b8;
                border: none;
                padding: 10px;
                font-size: 0.88rem;
                font-weight: 700;
                cursor: pointer;
                transition: color 0.2s ease;
              ">
                ${cText.exit}
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // كۇپون كۆچۈرۈش كۇنۇپكىسى
      const btnCopy = modal.querySelector('#btnCopyRetentionCoupon');
      if (btnCopy) {
        btnCopy.addEventListener('click', () => {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('TEKLIMAKAN50').then(() => {
              btnCopy.innerHTML = `<i class="fas fa-check"></i> ${cText.copied}`;
              btnCopy.style.background = '#16a34a';
              localStorage.setItem('teklimakan_applied_coupon', 'TEKLIMAKAN50');
              setTimeout(() => {
                btnCopy.innerHTML = `<i class="far fa-copy"></i> ${cText.copy}`;
                btnCopy.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
              }, 2500);
            }).catch(() => {
              localStorage.setItem('teklimakan_applied_coupon', 'TEKLIMAKAN50');
              btnCopy.innerHTML = `<i class="fas fa-check"></i> ${cText.saved}`;
            });
          } else {
            localStorage.setItem('teklimakan_applied_coupon', 'TEKLIMAKAN50');
            btnCopy.innerHTML = `<i class="fas fa-check"></i> ${cText.saved}`;
          }
        });
      }

      // مال سېتىۋېلىشنى داۋاملاشتۇرۇش
      const btnStay = modal.querySelector('#btnStayAndShop');
      if (btnStay) {
        btnStay.addEventListener('click', () => {
          localStorage.setItem('teklimakan_applied_coupon', 'TEKLIMAKAN50');
          modal.classList.remove('active');
          modal.style.display = 'none';
          modal.style.opacity = '0';
          modal.style.visibility = 'hidden';
          document.body.style.overflow = '';

          if (typeof showToast === 'function') {
            showToast(cText.toast, 'success');
          }

          const catalog = document.getElementById('catalogSection') || document.getElementById('productsGrid');
          if (catalog) {
            catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }

      // تور بېكەتتىن ھەقىقىي چىقىش
      const btnExit = modal.querySelector('#btnConfirmExitSite');
      if (btnExit) {
        btnExit.addEventListener('click', () => {
          allowNativeExit = true;
          modal.classList.remove('active');
          modal.style.display = 'none';
          modal.style.opacity = '0';
          modal.style.visibility = 'hidden';
          document.body.style.overflow = '';
          window.history.back();
        });
      }

      return modal;
    }

    // 4. خېرىدارنى قايىل قىلىش كۆزنىكىنى ئېچىش
    function showExitRetentionModal() {
      const modal = createRetentionModalIfNotExists();
      modal.style.display = 'flex';
      modal.offsetHeight; // force reflow
      modal.classList.add('active');
      modal.style.opacity = '1';
      modal.style.visibility = 'visible';
      document.body.style.overflow = 'hidden';
    }

    // 5. يانفوننىڭ قايتىش كۇنۇپكىسى (Android Back ◄ ياكى Browser Back) بېسىلغاندا بىر قەدەم چېكىندۈرۈش
    window.addEventListener('popstate', (e) => {
      // ئەگەر ئىشلەتكۈچى "تور بېكەتتىن چىقىش" نى بېسىپ بولغان بولسا، تەبىئىي چىقىشقا يول قويۇش
      if (allowNativeExit) {
        return;
      }

      // ئاكتىپ كۆزنەك / تارتما / پاراڭنى تەكشۈرۈش
      const openModals = getOpenModalsList();

      if (openModals.length > 0) {
        // پەقەت ئەڭ ئۈستىدىكى بىر كۆزنەكنى تاقاپ، بىر قەدەم ئارقىغا چېكىندۈرۈش
        const topModal = openModals[openModals.length - 1];
        try {
          topModal.close();
        } catch (err) {
          console.warn('Error closing top modal on back press:', err);
        }

        // يەنە بىر قەدەم ئارقىغا قايتىش كاپالىتىنى تولۇقلاپ قويۇش
        try {
          window.history.pushState({ teklimakanShield: 'active' }, '');
        } catch (err) {}
        return;
      }

      // ئەگەر ھېچقانداق كۆزنەك ئوچۇق بولمىسا (ئاساسىي دۇكان بەتتە تۇرغان بولسا):
      const exitModal = document.getElementById('teklimakanExitRetentionModal');
      const isExitModalVisible = exitModal && exitModal.classList.contains('active');

      if (isExitModalVisible) {
        // ئەگەر تۇتۇپ قېلىش كۆزنىكى ئاللىقاچان كۆرۈنۈپ تۇرغان بولسىمۇ خېرىدار يەنە قايتىشنى باسسا، چىقىپ كېتىشكە يول قويۇش
        allowNativeExit = true;
        exitModal.classList.remove('active');
        exitModal.style.display = 'none';
        exitModal.style.opacity = '0';
        exitModal.style.visibility = 'hidden';
        document.body.style.overflow = '';
        window.history.back();
      } else {
        // تۇنجى قېتىم چىقماقچى بولغاندا: چىقىشنى توسۇپ، ئېتىبار كۇپونلۇق تۇتۇپ قېلىش كۆزنىكىنى كۆرسىتىش!
        try {
          window.history.pushState({ teklimakanShield: 'retention' }, '');
        } catch (err) {}
        showExitRetentionModal();
      }
    });
  }

  // مەخپىي باشقۇرغۇچى تېز كۇنۇپكىسى (Ctrl + Shift + A ياكى Alt + Shift + A)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.altKey) && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.code === 'KeyA')) {
      e.preventDefault();
      localStorage.setItem('teklimakan_admin_device', 'true');
      window.location.href = 'seidiye';
    }
  });

  // 🛡️ تور بېكەتتىكى بارلىق رەسىملەرنىڭ چۈشۈرۈلۈشى ۋە كۆچۈرۈلۈشىنى چەكلەش (Image Anti-Save & Anti-Theft)
  document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG' || e.target.closest('img, .quick-view-media, .product-card-thumb, .image-shield-overlay')) {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG' || e.target.closest('img, .quick-view-media, .product-card-thumb')) {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  // ==================== ⚡ ئالاھىدە ئېتىبارلىق مەھسۇلاتلار رېشاتكىسى (Daily Flash Sale Shelf) ====================

  function renderFlashProductsCards() {
    const container = document.getElementById('customerFlashSaleProductsContainer');
    if (!container || !window.appStore) return false;

    const i18n = window.appI18n;
    const lang = (i18n && typeof i18n.getLang === 'function') ? i18n.getLang() : 'ug';
    const retention = window.appStore.getCustomerRetentionSettings();
    const flash = retention.flashSale || {};
    const prods = window.appStore.getCustomerDailyFlashSaleProducts(lang);
    if (!prods || prods.length === 0) {
      const emptyText = lang === 'tr' ? 'Bugün için indirimli ürün bulunamadı.' : (lang === 'en' ? 'No flash sale items available today.' : 'ھازىرچە ئالاھىدە ئېتىبارلىق تاۋار تۈگىدى.');
      container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: #94a3b8; padding: 1.5rem; font-size: 0.9rem;">${emptyText}</div>`;
      return false;
    }

    const addToCartText = (i18n && typeof i18n.t === 'function' && i18n.t('addToCart')) || (lang === 'tr' ? 'Sepete Ekle' : (lang === 'en' ? 'Add to Cart' : 'سېۋەتكە سېلىش'));

    container.innerHTML = prods.map(p => {
      const origPrice = p.originalPrice || p.price;
      const flashPrice = p.price;
      const discPct = p.flashDiscountPercent || flash.discountPercentage || 20;

      return `
        <div class="flash-sale-product-card" data-product-id="${p.id}">
          <span class="flash-sale-badge-corner">-%${discPct}</span>
          <div class="flash-sale-card-img-wrap" onclick="openQuickView('${p.id}')">
            <img src="${p.image || 'images/default_product.jpg'}" alt="${p.name}" loading="lazy">
          </div>
          <h4 class="flash-sale-card-title" onclick="openQuickView('${p.id}')" title="${p.name}">${p.name}</h4>
          <div class="flash-sale-card-prices">
            <span class="flash-sale-price-current">${window.appStore.formatPrice(flashPrice)}</span>
            <span class="flash-sale-price-old">${window.appStore.formatPrice(origPrice)}</span>
          </div>
          <button type="button" class="flash-sale-btn-add" onclick="handleFlashAddToCart('${p.id}')">
            <i class="fas fa-cart-plus"></i> <span>${addToCartText}</span>
          </button>
        </div>
      `;
    }).join('');
    return true;
  }

  window.openProductQuickView = function(productId) {
    if (typeof openQuickView === 'function') openQuickView(productId);
  };

  function toggleFlashSaleProducts(e) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }

    const now = Date.now();
    if (now - lastFlashToggleTime < 280) {
      return;
    }
    lastFlashToggleTime = now;

    const container = document.getElementById('customerFlashSaleProductsContainer');
    const badgeChevron = document.getElementById('flashSaleBadgeChevron');
    const btn = document.getElementById('flashSaleBtn');

    if (!container) return;

    // Check actual computed visibility
    const isHidden = container.style.display === 'none' || !container.style.display || window.getComputedStyle(container).display === 'none';

    if (isHidden) {
      // OPEN
      renderFlashProductsCards();
      container.style.display = 'grid';
      container.classList.add('is-open');

      if (badgeChevron) badgeChevron.style.transform = 'rotate(180deg)';
      if (btn) btn.classList.add('is-active');

      if (typeof playChime === 'function') playChime('click');

      setTimeout(() => {
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 80);
    } else {
      // CLOSE
      container.style.display = 'none';
      container.classList.remove('is-open');

      if (badgeChevron) badgeChevron.style.transform = 'rotate(0deg)';
      if (btn) btn.classList.remove('is-active');
    }
  };

  function initDailyFlashSaleShelf() {
    const container = document.getElementById('customerFlashSaleProductsContainer');
    const flashBar = document.querySelector('.flash-sale-bar');
    if (!container || !window.appStore) return;

    const retention = window.appStore.getCustomerRetentionSettings();
    const flash = retention.flashSale || {};

    if (flash.enabled === false) {
      if (flashBar) flashBar.style.display = 'none';
      return;
    }
    if (flashBar) flashBar.style.display = 'flex';

    const i18n = window.appI18n;
    const lang = (i18n && typeof i18n.getLang === 'function') ? i18n.getLang() : 'ug';
    const flashTitleEl = document.getElementById('flashSaleBadge');
    if (flashTitleEl) {
      if (lang === 'ug') {
        flashTitleEl.textContent = flash.title || (i18n && i18n.t('flashSaleBadge')) || '⚡ بۈگۈنكى ئېتىبارلىق مەھسۇلاتلار';
      } else {
        flashTitleEl.textContent = (i18n && i18n.t('flashSaleBadge')) || (lang === 'tr' ? '⚡ Bugünkü Özel İndirimli Ürünler' : '⚡ Today\'s Special Deals');
      }
    }

    // Render cards into container ahead of time with current language
    renderFlashProductsCards();

    // Default state: hidden
    container.style.display = 'none';
    container.classList.remove('is-open');
  }

  window.handleFlashAddToCart = function(productId) {
    if (!window.appStore) return;
    const res = window.appStore.addToCart(productId, 1, window.appI18n.getLang());
    if (res && res.success) {
      if (typeof playChime === 'function') playChime('click');
      showToast('🛒 ئېتىبار باھالىق تاۋار سېۋەتكە قوشۇلدى!', 'success');
      updateCartUI();
    }
  };

  // ==================== 🎡 كۈندىلىك ئامەت چاقى لوگىكىسى (Customer Daily Lucky Wheel) ====================

  function initCustomerLuckyWheel() {
    const btnOpen = document.getElementById('btnOpenLuckyWheel');
    const modal = document.getElementById('modalCustomerLuckyWheel');
    const btnClose = document.getElementById('btnCloseLuckyWheel');
    const btnSpin = document.getElementById('btnSpinWheelAction');

    if (!btnOpen || !modal || !window.appStore) return;

    const retention = window.appStore.getCustomerRetentionSettings();
    const wheelCfg = retention.luckyWheel || {};

    if (wheelCfg.enabled === false) {
      btnOpen.style.display = 'none';
      return;
    }
    btnOpen.style.display = 'flex';

    const applyWheelTexts = () => {
      const i18n = window.appI18n;
      const lang = (i18n && typeof i18n.getLang === 'function') ? i18n.getLang() : 'ug';
      const wheelTitle = (i18n && typeof i18n.t === 'function' && i18n.t('luckyWheelTitle')) || wheelCfg.title || 'ئامەت چاقى';
      const wheelSub = (i18n && typeof i18n.t === 'function' && i18n.t('luckyWheelSub')) || wheelCfg.subtitle || 'كۈندە 1 قېتىم ھەقسىز كۇپون ئۇتۇڭ!';
      const wheelBtnSub = (i18n && typeof i18n.t === 'function' && i18n.t('luckyWheelBtnSub')) || '1 قېتىم ھەقسىز!';

      const titleEl = document.getElementById('luckyWheelModalTitle');
      const subEl = document.getElementById('luckyWheelModalSubtitle');
      if (titleEl) titleEl.textContent = `🎡 ${wheelTitle}`;
      if (subEl) subEl.textContent = wheelSub;
      const btnTitleEl = btnOpen.querySelector('.lucky-wheel-btn-title');
      const btnSubEl = btnOpen.querySelector('.lucky-wheel-btn-sub');
      if (btnTitleEl) btnTitleEl.textContent = `🎡 ${wheelTitle}`;
      if (btnSubEl) btnSubEl.textContent = wheelBtnSub;
      btnOpen.setAttribute('title', `${wheelTitle} — ${wheelSub}`);

      if (btnSpin && !isLuckyWheelSpinning) {
        const spinText = (i18n && typeof i18n.t === 'function' && i18n.t('luckyWheelSpinBtn')) || (lang === 'tr' ? 'Çarkı Çevir' : (lang === 'en' ? 'Spin Now' : 'ئايلاندۇرۇش'));
        btnSpin.innerHTML = `<i class="fas fa-play-circle"></i> ${spinText}`;
      }
      drawLuckyWheel(luckyWheelRotation);
      updateLuckyWheelStatusCard();
    };
    window.updateLuckyWheelLocalization = applyWheelTexts;
    applyWheelTexts();

    btnOpen.addEventListener('click', () => {
      openLuckyWheelModal();
    });

    if (btnClose) {
      btnClose.addEventListener('click', () => {
        closeLuckyWheelModal();
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal && !isLuckyWheelSpinning) {
        closeLuckyWheelModal();
      }
    });

    if (btnSpin) {
      btnSpin.addEventListener('click', () => {
        handleLuckyWheelSpin();
      });
    }

    window.addEventListener('uyghur_store_sync', (e) => {
      if (e.detail?.type === 'customerRetention' || e.detail?.type === 'settings') {
        const updated = window.appStore.getCustomerRetentionSettings();
        if (updated.luckyWheel?.enabled === false) {
          btnOpen.style.display = 'none';
        } else {
          btnOpen.style.display = 'flex';
        }
        initDailyFlashSaleShelf();
      }
    });

    // 🎁 كۈندە پەقەت 1 قېتىم سىپتا كۇپون تەكلىپى قىلىش (Gentle Daily Toast)
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      const lastPromptDate = localStorage.getItem('teklimakan_wheel_prompt_date');
      const checkSpin = window.appStore.canCustomerSpinToday ? window.appStore.canCustomerSpinToday() : { canSpin: true };

      if (checkSpin.canSpin && lastPromptDate !== todayStr && wheelCfg.enabled !== false) {
        setTimeout(() => {
          const toast = document.getElementById('wheelInviteToast');
          const btnAccept = document.getElementById('btnAcceptWheelInvite');
          const btnDismiss = document.getElementById('btnDismissWheelInvite');

          if (!toast) return;
          const i18n = window.appI18n;
          const lang = i18n ? i18n.getLang() : 'ug';
          const titleEl = document.getElementById('wheelInviteTitle');
          const descEl = document.getElementById('wheelInviteDesc');

          if (titleEl) titleEl.textContent = lang === 'tr' ? '🎁 Bugün 1 defa ücretsiz hakkınız var!' : (lang === 'en' ? '🎁 You have 1 free spin today!' : '🎁 بۈگۈنكى ھەقسىز كۇپون پۇرسىتىڭىز بار!');
          if (descEl) descEl.textContent = lang === 'tr' ? 'Çarkı çevirerek anında hediye kupon kazanın' : (lang === 'en' ? 'Spin the wheel to win your coupon' : 'چاقنى ئايلاندۇرۇپ پۇل كۇپونى ئۇتۇۋېلىڭ');
          if (btnAccept) btnAccept.textContent = lang === 'tr' ? 'Çevir' : (lang === 'en' ? 'Spin' : 'ئايلاندۇرۇش');

          toast.classList.remove('hide');
          localStorage.setItem('teklimakan_wheel_prompt_date', todayStr);

          const closeInvite = () => {
            toast.classList.add('hide');
          };

          if (btnAccept) btnAccept.onclick = () => {
            closeInvite();
            openLuckyWheelModal();
          };
          if (btnDismiss) btnDismiss.onclick = closeInvite;

          // 8 سېكۇنتتىن كېيىن ئۆزى يىغىلىش
          setTimeout(closeInvite, 8000);
        }, 12000);
      }
    } catch(e) {}
  }

  function openLuckyWheelModal() {
    const modal = document.getElementById('modalCustomerLuckyWheel');
    if (!modal) return;
    modal.style.display = 'flex';
    modal.classList.add('active');
    setTimeout(() => {
      drawLuckyWheel(luckyWheelRotation);
      updateLuckyWheelStatusCard();
    }, 25);
  }

  function closeLuckyWheelModal() {
    const modal = document.getElementById('modalCustomerLuckyWheel');
    if (!modal) return;
    modal.style.display = 'none';
    modal.classList.remove('active');
  }

  function getEffectiveLuckyWheelSlices() {
    let rawSlices = defaultLuckyWheelSlices;
    if (window.appStore && typeof window.appStore.getCustomerRetentionSettings === 'function') {
      const retention = window.appStore.getCustomerRetentionSettings();
      if (retention && retention.luckyWheel && Array.isArray(retention.luckyWheel.slices) && retention.luckyWheel.slices.length >= 2) {
        rawSlices = retention.luckyWheel.slices;
      }
    }
    const lang = (window.appI18n && typeof window.appI18n.getLang === 'function') ? window.appI18n.getLang() : 'ug';
    if (lang === 'ug') return rawSlices;

    return rawSlices.map(slice => {
      let locText = slice.text || '';
      const cCode = String(slice.couponCode || '').toUpperCase();
      const sType = slice.type || '';
      if (lang === 'tr') {
        if (cCode === 'LUCKY10' || slice.id === 'sw1' || locText.includes('10')) locText = '₺10 İndirim';
        else if (cCode === 'LUCKY20' || slice.id === 'sw2' || locText.includes('20')) locText = '₺20 İndirim';
        else if (cCode === 'LUCKY50' || slice.id === 'sw3' || locText.includes('50')) locText = '₺50 İndirim';
        else if (cCode === 'LUCKYFREE' || slice.id === 'sw4' || sType === 'free_shipping' || locText.includes('ھەقسىز')) locText = 'Ücretsiz Kargo';
        else if (cCode === 'LUCKY5PCT' || slice.id === 'sw5' || sType === 'percentage' || locText.includes('%5') || locText.includes('5%')) locText = '%5 İndirim';
        else if (slice.id === 'sw6' || sType === 'none' || locText.includes('تەلەيلىك')) locText = 'Şansınızı Deneyin';
        else if (window.appI18n && typeof window.appI18n.autoTranslateUyghur === 'function') locText = window.appI18n.autoTranslateUyghur(locText, 'tr');
      } else if (lang === 'en') {
        if (cCode === 'LUCKY10' || slice.id === 'sw1' || locText.includes('10')) locText = '10₺ Discount';
        else if (cCode === 'LUCKY20' || slice.id === 'sw2' || locText.includes('20')) locText = '20₺ Discount';
        else if (cCode === 'LUCKY50' || slice.id === 'sw3' || locText.includes('50')) locText = '50₺ Discount';
        else if (cCode === 'LUCKYFREE' || slice.id === 'sw4' || sType === 'free_shipping' || locText.includes('ھەقسىز')) locText = 'Free Shipping';
        else if (cCode === 'LUCKY5PCT' || slice.id === 'sw5' || sType === 'percentage' || locText.includes('%5') || locText.includes('5%')) locText = '5% Off';
        else if (slice.id === 'sw6' || sType === 'none' || locText.includes('تەلەيلىك')) locText = 'Better Luck';
        else if (window.appI18n && typeof window.appI18n.autoTranslateUyghur === 'function') locText = window.appI18n.autoTranslateUyghur(locText, 'en');
      }
      return {
        ...slice,
        text: locText
      };
    });
  }

  function drawLuckyWheel(currentAngleRad = 0) {
    const canvas = document.getElementById('luckyWheelCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 8;

    const slices = getEffectiveLuckyWheelSlices();
    const numSlices = slices.length;
    const sliceAngle = (2 * Math.PI) / numSlices;
    const lang = (window.appI18n && typeof window.appI18n.getLang === 'function') ? window.appI18n.getLang() : 'ug';

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentAngleRad);

    slices.forEach((slice, i) => {
      const angle = i * sliceAngle;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, angle, angle + sliceAngle);
      ctx.closePath();

      ctx.fillStyle = slice.color || '#f59e0b';
      ctx.fill();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.stroke();

      ctx.save();
      ctx.rotate(angle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.font = lang === 'ug' ? 'bold 12px "Microsoft YaHei", "ALKATIP Basma Tom", sans-serif' : 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 4;
      ctx.fillText(slice.text || '', radius - 22, 0);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    for (let j = 0; j < numSlices * 2; j++) {
      const studAngle = j * (Math.PI / numSlices);
      const studX = (radius - 2) * Math.cos(studAngle);
      const studY = (radius - 2) * Math.sin(studAngle);
      ctx.beginPath();
      ctx.arc(studX, studY, 2.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#fef08a';
      ctx.fill();
    }

    ctx.restore();
  }

  function updateLuckyWheelStatusCard() {
    const card = document.getElementById('luckyWheelStatusCard');
    const btnSpin = document.getElementById('btnSpinWheelAction');
    if (!card) return;

    const i18n = window.appI18n;
    const lang = (i18n && typeof i18n.getLang === 'function') ? i18n.getLang() : 'ug';

    const check = (window.appStore && typeof window.appStore.canCustomerSpinToday === 'function')
      ? window.appStore.canCustomerSpinToday()
      : { canSpin: true };

    const flBadge = document.getElementById('luckyWheelFloatingBadge');
    if (flBadge) {
      flBadge.style.display = check.canSpin ? 'flex' : 'none';
      flBadge.textContent = '1';
    }

    if (check.canSpin) {
      if (btnSpin) {
        btnSpin.disabled = false;
        btnSpin.style.opacity = '1';
        btnSpin.style.cursor = 'pointer';
        btnSpin.style.pointerEvents = 'auto';
        if (!isLuckyWheelSpinning) {
          const spinLabel = (i18n && typeof i18n.t === 'function' && i18n.t('luckyWheelSpinBtn')) || (lang === 'tr' ? 'Çarkı Çevir' : (lang === 'en' ? 'Spin Now' : 'ئايلاندۇرۇش'));
          btnSpin.innerHTML = `<i class="fas fa-play-circle"></i> ${spinLabel}`;
        }
      }
      const availTitle = (i18n && typeof i18n.t === 'function' && i18n.t('luckyWheelAvailableTitle')) || (lang === 'tr' ? '🎁 Bugün <span style="color: #ef4444;">1 defa ücretsiz</span> çevirme hakkınız var!' : (lang === 'en' ? '🎁 You have <span style="color: #ef4444;">1 free spin</span> today!' : '🎁 سىزنىڭ بۈگۈنكى <span style="color: #ef4444;">1 قېتىملىق ھەقسىز</span> پۇرسىتىڭىز بار!'));
      const availDesc = (i18n && typeof i18n.t === 'function' && i18n.t('luckyWheelAvailableDesc')) || (lang === 'tr' ? 'Ortadaki "Çarkı Çevir" butonuna basarak anında kupon kazanın.' : (lang === 'en' ? 'Click the "Spin Now" button in the center to win your reward.' : 'ئوتتۇرىدىكى «ئايلاندۇر» كۇنۇپكىسىنى بېسىپ مۇكاپات ئۇتۇۋېلىڭ.'));

      card.innerHTML = `
        <div style="color: #0f172a; font-weight: 800; font-size: 0.95rem; margin-bottom: 0.25rem;">
          ${availTitle}
        </div>
        <p style="font-size: 0.8rem; color: #64748b; margin: 0;">${availDesc}</p>
      `;
    } else {
      if (btnSpin) {
        btnSpin.disabled = true;
        btnSpin.style.opacity = '0.6';
        btnSpin.style.cursor = 'not-allowed';
      }
      const last = check.lastSpin || {};
      const hasCoupon = last.couponCode && last.type !== 'none';

      let winText = last.text || '';
      if (lang === 'tr') {
        if (winText.includes('10') || last.couponCode === 'LUCKY10') winText = '₺10 İndirim';
        else if (winText.includes('20') || last.couponCode === 'LUCKY20') winText = '₺20 İndirim';
        else if (winText.includes('50') || last.couponCode === 'LUCKY50') winText = '₺50 İndirim';
        else if (winText.includes('ھەقسىز') || last.type === 'free_shipping') winText = 'Ücretsiz Kargo';
        else if (winText.includes('%5') || winText.includes('5%') || last.type === 'percentage') winText = '%5 İndirim';
        else if (winText.includes('تەلەيلىك') || last.type === 'none') winText = 'Şansınızı Deneyin';
        else if (window.appI18n && typeof window.appI18n.autoTranslateUyghur === 'function') winText = window.appI18n.autoTranslateUyghur(winText, 'tr');
      } else if (lang === 'en') {
        if (winText.includes('10') || last.couponCode === 'LUCKY10') winText = '10₺ Discount';
        else if (winText.includes('20') || last.couponCode === 'LUCKY20') winText = '20₺ Discount';
        else if (winText.includes('50') || last.couponCode === 'LUCKY50') winText = '50₺ Discount';
        else if (winText.includes('ھەقسىز') || last.type === 'free_shipping') winText = 'Free Shipping';
        else if (winText.includes('%5') || winText.includes('5%') || last.type === 'percentage') winText = '5% Off';
        else if (winText.includes('تەلەيلىك') || last.type === 'none') winText = 'Better Luck Next Time';
        else if (window.appI18n && typeof window.appI18n.autoTranslateUyghur === 'function') winText = window.appI18n.autoTranslateUyghur(winText, 'en');
      }

      const wonPrefix = (i18n && typeof i18n.t === 'function' && i18n.t('luckyWheelWonPrefix')) || (lang === 'tr' ? '✅ Bugünkü Ödülünüz:' : (lang === 'en' ? "✅ Today's Prize:" : '✅ بۈگۈنكى ئۇتۇقىڭىز:'));
      const useCartLabel = (i18n && typeof i18n.t === 'function' && i18n.t('luckyWheelUseInCartBtn')) || (lang === 'tr' ? 'Sepette Kullan' : (lang === 'en' ? 'Apply to Cart' : 'سېۋەتكە ئىشلىتىش'));
      const cdLabel = (i18n && typeof i18n.t === 'function' && i18n.t('luckyWheelNextCountdownLabel')) || (lang === 'tr' ? 'Sonraki ücretsiz hakka kalan süre:' : (lang === 'en' ? 'Time until next free spin:' : 'كېيىنكى ھەقسىز پۇرسەتكە قالغان ۋاقىت:'));
      const resetLabel = (i18n && typeof i18n.t === 'function' && i18n.t('luckyWheelResetBtn')) || (lang === 'tr' ? 'Tekrar Dene (Hakkı Sıfırla)' : (lang === 'en' ? 'Test Again (Reset Spin)' : 'قايتا سىناپ كۆرۈش (پۇرسەتنى يېڭىلاش)'));
      const resetTitle = lang === 'tr' ? 'Test amacıyla çevirme hakkını sıfırlar' : (lang === 'en' ? 'Reset spin for testing purposes' : 'سىناق مەقسىتىدە پۇرسەتنى يېڭىلاش');

      card.innerHTML = `
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 0.75rem; margin-bottom: 0.65rem;">
          <div style="color: #166534; font-weight: 800; font-size: 0.9rem;">
            ${wonPrefix} <span style="color: #047857;">${winText || (lang === 'tr' ? 'Şansınızı Deneyin' : (lang === 'en' ? 'Better Luck' : 'تەلەيلىك بولۇڭ'))}</span>
          </div>
          ${hasCoupon ? `
            <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
              <code class="number-latin" style="background: #ffffff; border: 1px dashed #10b981; color: #047857; font-weight: 800; font-size: 0.95rem; padding: 3px 10px; border-radius: 6px;">${last.couponCode}</code>
              <button type="button" class="btn-primary" onclick="window.applyCustomerCouponToCart('${last.couponCode}')" style="background: #059669; padding: 4px 12px; font-size: 0.8rem; font-weight: 800; border-radius: 6px;">
                <i class="fas fa-shopping-cart"></i> ${useCartLabel}
              </button>
            </div>
          ` : ''}
        </div>
        <div style="font-size: 0.82rem; color: #64748b; display: flex; align-items: center; justify-content: center; gap: 0.4rem; flex-wrap: wrap;">
          <i class="fas fa-clock" style="color: #f59e0b;"></i>
          <span>${cdLabel}</span>
          <strong id="luckyWheelNextCountdown" class="number-latin" style="color: #ef4444; font-weight: 800;">--:--:--</strong>
        </div>
        <div style="margin-top: 0.75rem; text-align: center;">
          <button type="button" onclick="window.resetMyDailySpin()" style="background: #eff6ff; color: #1d4ed8; border: 1px dashed #93c5fd; padding: 5px 14px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s;" title="${resetTitle}">
            <i class="fas fa-redo"></i> ${resetLabel}
          </button>
        </div>
      `;
      startLuckyWheelCountdown();
    }
  }

  function resetMyDailySpin() {
    try {
      localStorage.removeItem('teklimakan_customer_last_spin');
    } catch (e) {}
    updateLuckyWheelStatusCard();
    drawLuckyWheel(luckyWheelRotation);
    const lang = (window.appI18n && typeof window.appI18n.getLang === 'function') ? window.appI18n.getLang() : 'ug';
    const msg = lang === 'tr'
      ? '🎉 Yeniden çevirme hakkınız açıldı! Şimdi çarkı çevirebilirsiniz.'
      : (lang === 'en' ? '🎉 Spin reset! You can now spin the wheel again.' : '🎉 قايتا ئايلاندۇرۇش پۇرسىتى ئېچىلدى! ئەمدى چاقنى ئايلاندۇرالايسىز.');
    if (typeof showToast === 'function') {
      showToast(msg, 'success');
    }
  }
  function startLuckyWheelCountdown() {
    if (wheelCountdownInterval) clearInterval(wheelCountdownInterval);

    function update() {
      const el = document.getElementById('luckyWheelNextCountdown');
      if (!el) return;
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const diff = Math.max(0, Math.floor((tomorrow - now) / 1000));
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      el.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    update();
    wheelCountdownInterval = setInterval(update, 1000);
  }

  function handleLuckyWheelSpin() {
    if (isLuckyWheelSpinning) return;
    const check = (window.appStore && typeof window.appStore.canCustomerSpinToday === 'function')
      ? window.appStore.canCustomerSpinToday()
      : { canSpin: true };

    if (!check.canSpin) {
      if (typeof showToast === 'function') showToast(check.message, 'info');
      return;
    }

    const slices = getEffectiveLuckyWheelSlices();
    if (slices.length < 2) return;

    const totalWeight = slices.reduce((acc, s) => acc + (Number(s.weight) || 10), 0);
    let randomNum = Math.random() * totalWeight;
    let winningIndex = 0;
    for (let i = 0; i < slices.length; i++) {
      randomNum -= (Number(slices[i].weight) || 10);
      if (randomNum <= 0) {
        winningIndex = i;
        break;
      }
    }

    const winningSlice = slices[winningIndex];
    const numSlices = slices.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    const pointerAngle = 1.5 * Math.PI;
    const sliceCenter = winningIndex * sliceAngle + sliceAngle / 2;
    let targetAngle = pointerAngle - sliceCenter;
    while (targetAngle < 0) targetAngle += 2 * Math.PI;

    const extraSpins = 6;
    const finalRotation = (2 * Math.PI * extraSpins) + targetAngle;

    isLuckyWheelSpinning = true;
    const btnSpin = document.getElementById('btnSpinWheelAction');
    if (btnSpin) {
      btnSpin.disabled = true;
      btnSpin.style.opacity = '0.5';
    }

    const card = document.getElementById('luckyWheelStatusCard');
    const i18n = window.appI18n;
    const lang = (i18n && typeof i18n.getLang === 'function') ? i18n.getLang() : 'ug';
    const spinHint = (i18n && typeof i18n.t === 'function' && i18n.t('luckyWheelSpinningHint'))
      || (lang === 'tr' ? 'Çark dönüyor... Bol şanslar!' : (lang === 'en' ? 'Spinning fast... Good luck!' : 'چاق تېز ئايلانماقتا... تەلەيلىك بولۇڭ!'));

    if (card) {
      card.innerHTML = `
        <div style="color: #f59e0b; font-weight: 800; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
          <i class="fas fa-spinner fa-spin"></i>
          <span>${spinHint}</span>
        </div>
      `;
    }

    const startTime = performance.now();
    const duration = 4500;
    const startRotation = luckyWheelRotation % (2 * Math.PI);
    const totalDelta = finalRotation - startRotation;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = easeOutCubic(progress);

      luckyWheelRotation = startRotation + totalDelta * ease;
      drawLuckyWheel(luckyWheelRotation);

      if (progress < 1) {
        luckyWheelAnimFrame = requestAnimationFrame(animate);
      } else {
        isLuckyWheelSpinning = false;
        luckyWheelRotation = finalRotation % (2 * Math.PI);
        drawLuckyWheel(luckyWheelRotation);

        if (window.appStore && typeof window.appStore.recordCustomerSpin === 'function') {
          window.appStore.recordCustomerSpin(winningSlice);
        }
        if (typeof playChime === 'function') playChime('success');

        showWinningCelebration(winningSlice);
      }
    }

    luckyWheelAnimFrame = requestAnimationFrame(animate);
  }

  function showWinningCelebration(slice) {
    const card = document.getElementById('luckyWheelStatusCard');
    if (!card) return;

    const i18n = window.appI18n;
    const lang = (i18n && typeof i18n.getLang === 'function') ? i18n.getLang() : 'ug';
    const hasCoupon = slice.couponCode && slice.type !== 'none';

    const congratsTitle = (i18n && typeof i18n.t === 'function' && i18n.t('luckyWheelCongratsTitle')) || (lang === 'tr' ? '🎉 Tebrikler!' : (lang === 'en' ? '🎉 Congratulations!' : '🎉 مۇبارەك بولسۇن!'));
    const youWonHtml = (i18n && typeof i18n.t === 'function' && i18n.t('luckyWheelYouWon', { prize: slice.text })) || (lang === 'tr' ? `Tebrikler, «<span style="color: #ef4444;">${slice.text}</span>» kazandınız!` : (lang === 'en' ? `You won «<span style="color: #ef4444;">${slice.text}</span>»!` : `سىز «<span style="color: #ef4444;">${slice.text}</span>» ئۇتتىڭىز!`));
    const copyLabel = (i18n && typeof i18n.t === 'function' && i18n.t('luckyWheelCopyCode')) || (lang === 'tr' ? 'Kopyala' : (lang === 'en' ? 'Copy' : 'كۆچۈرۈش'));
    const useNowLabel = (i18n && typeof i18n.t === 'function' && i18n.t('luckyWheelUseNowBtn')) || (lang === 'tr' ? 'Hemen Sepette Kullan' : (lang === 'en' ? 'Apply to Cart Now' : 'دەرھال سېۋەتكە ئىشلىتىش'));
    const betterLuckMsg = (i18n && typeof i18n.t === 'function' && i18n.t('luckyWheelBetterLuck')) || (lang === 'tr' ? 'Bugün şansınız yaver gitmedi, yarın mutlaka tekrar deneyin!' : (lang === 'en' ? 'Better luck next time, come back tomorrow!' : 'بۈگۈن پۇرسىتىڭىز ئوڭدىن كەلمىدى، ئەتىگە چوقۇم يەنە كۆرۈشەيلى!'));
    const copiedToast = lang === 'tr' ? '📋 Kupon kodu kopyalandı!' : (lang === 'en' ? '📋 Coupon code copied!' : '📋 كۇپون كودى كۆچۈرۈلدى!');

    card.innerHTML = `
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%); border: 2px solid #f59e0b; border-radius: 14px; padding: 1rem; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);">
        <div style="font-size: 1.25rem; font-weight: 900; color: #b45309; margin-bottom: 0.35rem;">
          ${congratsTitle}
        </div>
        <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-bottom: 0.65rem;">
          ${youWonHtml}
        </div>
        ${hasCoupon ? `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.6rem; margin-top: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <code class="number-latin" style="background: #ffffff; border: 1.5px dashed #f59e0b; color: #b45309; font-weight: 900; font-size: 1.15rem; padding: 4px 14px; border-radius: 8px; letter-spacing: 1px;">${slice.couponCode}</code>
              <button type="button" class="btn-primary" onclick="navigator.clipboard?.writeText('${slice.couponCode}'); showToast('${copiedToast}', 'success');" style="background: #64748b; padding: 5px 10px; font-size: 0.8rem;">
                <i class="fas fa-copy"></i> ${copyLabel}
              </button>
            </div>
            <button type="button" class="btn-primary" onclick="window.applyCustomerCouponToCart('${slice.couponCode}')" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); width: 100%; padding: 0.65rem; font-weight: 900; font-size: 0.95rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
              <i class="fas fa-cart-arrow-down"></i> ${useNowLabel}
            </button>
          </div>
        ` : `
          <p style="font-size: 0.85rem; color: #64748b; margin: 0;">${betterLuckMsg}</p>
        `}
      </div>
    `;

    const winToast = lang === 'tr'
      ? `🎉 Şans Çarkı: ${slice.text} kazandınız!`
      : (lang === 'en' ? `🎉 Lucky Wheel: You won ${slice.text}!` : `🎉 ئامەت چاقى: سىز ${slice.text} ئۇتتىڭىز!`);
    showToast(winToast, 'success');
  }

  window.showToast = showToast;
  window.openTrackOrderModal = openTrackOrderModal;
  window.doTrackOrder = doTrackOrder;
  // ==================== 📤 بىر چېكىپ ھەمبەھىرلەش (Viral 1-Tap Share) ====================
  window.shareProduct = async function(productId, event) {
    if (event) event.stopPropagation();
    if (!productId || !window.appStore) return;
    const lang = window.appI18n ? window.appI18n.getLang() : 'ug';
    const prod = window.appStore.getProduct(productId);
    if (!prod) return;

    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${productId}`;
    const shareTitle = prod.name;
    const shareText = lang === 'tr' 
      ? `${prod.name} (${window.appStore.formatPrice(prod.price)}) - Teklimakan Online'da inceleyin!`
      : (lang === 'en'
        ? `Check out ${prod.name} (${window.appStore.formatPrice(prod.price)}) on Teklimakan!`
        : `تەكلىماكان تورىدىكى «${prod.name}» (${window.appStore.formatPrice(prod.price)}) مەھسۇلاتىنى كۆرۈپ بېقىڭ!`);

    if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') console.warn('navigator.share fallback', err);
      }
    }

    // Fallback: Copy link and open WhatsApp share option
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
        const copyMsg = lang === 'tr' ? 'Ürün bağlantısı panoya kopyalandı!' : (lang === 'en' ? 'Product link copied to clipboard!' : 'مەھسۇلات ئۇلانمىسى كۆچۈرۈلدى!');
        if (typeof showToast === 'function') showToast(copyMsg, 'success');
      });
    }

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(waUrl, '_blank');
  };

  // ==================== 👀 يېقىندا كۆرگەنلىرىڭىز (Recently Viewed Tracking & Shelf) ====================
  function trackRecentlyViewed(productId) {
    if (!productId) return;
    try {
      let list = JSON.parse(localStorage.getItem('teklimakan_recently_viewed') || '[]');
      list = list.filter(id => id !== productId);
      list.unshift(productId);
      if (list.length > 8) list = list.slice(0, 8);
      localStorage.setItem('teklimakan_recently_viewed', JSON.stringify(list));
      renderRecentlyViewedShelf();
    } catch(e) {}
  }
  window.trackRecentlyViewed = trackRecentlyViewed;

  function renderRecentlyViewedShelf() {
    const container = document.getElementById('recentlyViewedContainer');
    const track = document.getElementById('recentlyViewedTrack');
    const btnClear = document.getElementById('btnClearRecent');
    if (!container || !track || !window.appStore) return;

    const lang = window.appI18n ? window.appI18n.getLang() : 'ug';
    let recentIds = [];
    try {
      recentIds = JSON.parse(localStorage.getItem('teklimakan_recently_viewed') || '[]');
    } catch(e) {}

    if (!Array.isArray(recentIds) || recentIds.length < 2) {
      container.style.display = 'none';
      return;
    }

    const prods = recentIds.map(id => window.appStore.getProduct(id)).filter(Boolean);
    if (prods.length < 2) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';
    track.innerHTML = prods.map(p => {
      const priceStr = window.appStore.formatPrice(p.price);
      return `
        <div class="shelf-product-card" data-id="${p.id}" style="cursor: pointer;">
          <div class="shelf-card-thumb-wrap">
            <img class="shelf-card-img" src="${p.image || 'images/default_product.jpg'}" alt="${p.name}" loading="lazy" onerror="this.onerror=null; this.src='images/default_product.jpg'">
          </div>
          <div class="shelf-card-body">
            <div>
              <div class="shelf-card-brand"><span>${p.brand || 'تەكلىماكان'}</span></div>
              <h4 class="shelf-card-title" title="${p.name}">${p.name}</h4>
            </div>
            <div>
              <div class="shelf-card-pricing">
                <span class="shelf-card-price number-latin">${priceStr}</span>
              </div>
              <button type="button" class="shelf-card-add-btn" data-id="${p.id}">
                <i class="fas fa-shopping-bag"></i> <span>${lang === 'tr' ? 'Sepete' : (lang === 'en' ? 'Add' : 'سېۋەتكە')}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    track.querySelectorAll('.shelf-product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.shelf-card-add-btn')) return;
        const pid = card.dataset.id;
        if (pid) openQuickView(pid);
      });
      const addBtn = card.querySelector('.shelf-card-add-btn');
      if (addBtn) {
        addBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const r = window.appStore.addToCart(card.dataset.id, 1);
          if (r && r.success) {
            if (typeof playChime === 'function') playChime('success');
            if (typeof showToast === 'function') showToast(r.message, 'success');
            if (typeof updateCartUI === 'function') updateCartUI();
          }
        });
      }
    });

    if (btnClear) {
      btnClear.onclick = () => {
        localStorage.removeItem('teklimakan_recently_viewed');
        container.style.display = 'none';
      };
    }
  }
  window.renderRecentlyViewedShelf = renderRecentlyViewedShelf;

  window.openQuickView = openQuickView;
  window.checkUrlForProduct = checkUrlForProduct;
  window.openLuckyWheelModal = openLuckyWheelModal;
  window.closeLuckyWheelModal = closeLuckyWheelModal;
  window.handleLuckyWheelSpin = handleLuckyWheelSpin;
  window.resetMyDailySpin = resetMyDailySpin;
  window.drawLuckyWheel = drawLuckyWheel;
  window.updateLuckyWheelStatusCard = updateLuckyWheelStatusCard;
  window.openLanguageModal = openLanguageModal;
  window.closeLanguageModal = closeLanguageModal;
  window.selectSiteLanguage = selectSiteLanguage;
  window.scrollToTop = window.scrollToTop || function() { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  window.scrollToBottom = window.scrollToBottom || function() { window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }); };
  window.toggleSmartScroll = window.toggleSmartScroll || function() { ((window.scrollY || 0) > 250) ? window.scrollToTop() : window.scrollToBottom(); };

  // 🌟 بەتنى ئاستىغا سىيرىغاندا چاپلاشما باش تىزىملىك (Fixed Header)
  function initStickyHeader() {
    const navbar = document.querySelector('.main-navbar');
    if (!navbar) return;

    // ئىسكى spacer بولسا ئۆچۈرۈۋەت
    const oldSpacer = document.getElementById('navbarStickySpacer');
    if (oldSpacer) oldSpacer.remove();

    const topAnnouncement = document.querySelector('.top-announcement');

    function getAnnouncementHeight() {
      if (!topAnnouncement || topAnnouncement.offsetHeight <= 0) return 0;
      // ئېلان بالدىقى يوشۇرۇنغان بولسا 0 قايتۇر
      var style = window.getComputedStyle(topAnnouncement);
      if (style.display === 'none' || style.visibility === 'hidden') return 0;
      return topAnnouncement.offsetHeight;
    }

    function updateHeaderPosition() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      var annHeight = getAnnouncementHeight();
      var navHeight = navbar.offsetHeight;

      // ئېلان بالدىقى كۆرۈنۈۋاتسا، navbar ئۇنىڭ ئاستىدا بولسۇن
      // ئاستىغا سىيرىلغاندا navbar ئاستا-ئاستا ئۈستىگە كەلسۇن
      if (annHeight > 0) {
        var offset = Math.max(0, annHeight - scrollY);
        navbar.style.top = offset + 'px';
      } else {
        navbar.style.top = '0px';
      }

      // body padding-top: ئېلان بالدىقى + navbar ئېگىزلىكى
      document.body.style.paddingTop = (annHeight + navHeight) + 'px';

      // ئاستىغا سىيرىلغاندا is-sticky كىلاسىنى قوشۇپ glass effect بەرسۇن
      if (scrollY > annHeight) {
        if (!navbar.classList.contains('is-sticky')) {
          navbar.classList.add('is-sticky');
        }
      } else {
        if (navbar.classList.contains('is-sticky')) {
          navbar.classList.remove('is-sticky');
        }
      }
    }

    // دەسلەپكى ھالەتنى تەڭشەش
    updateHeaderPosition();

    // سىيرىلغاندا يېڭىلاش
    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateHeaderPosition();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // ئېكران چوڭلۇقى ئۆزگەرگەندە يېڭىلاش
    window.addEventListener('resize', updateHeaderPosition, { passive: true });
  }
  initStickyHeader();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTeklimakanApp);
} else {
  initTeklimakanApp();
}

// 📲 ئەپ ۋە PWA مۇلازىمەتچىسىنى قوزغىتىش (Service Worker Registration)
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.warn('ServiceWorker registration error:', err);
    });
  });
}



  // ==================== ⚡ 15 سېكۇنتتا تېز سېتىۋېلىش كۆزنىكى (1-Click Quick Buy Engine) ====================
  let currentQuickBuyProduct = null;
  let currentQuickBuyQty = 1;

  function openQuickBuyModal(productId, qty = 1) {
    if (!productId || !window.appStore) return;
    const lang = window.appI18n ? window.appI18n.getLang() : 'ug';
    const prod = window.appStore.getProductById(productId, lang);
    if (!prod || prod.stock <= 0) {
      if (typeof showToast === 'function') showToast(window.appI18n ? window.appI18n.t('outOfStock') : 'بۇ مەھسۇلات تۈگەپتۇ!', 'warning');
      return;
    }

    currentQuickBuyProduct = prod;
    currentQuickBuyQty = Math.max(1, Math.min(qty, prod.stock));

    const modal = document.getElementById('quickBuyModal');
    if (!modal) return;

    // Fill Product Info
    const imgEl = document.getElementById('quickBuyProdImage');
    const nameEl = document.getElementById('quickBuyProdName');
    const priceEl = document.getElementById('quickBuyProdPrice');
    const oldPriceEl = document.getElementById('quickBuyProdOldPrice');
    const idEl = document.getElementById('quickBuyProdId');
    const qtyInput = document.getElementById('quickBuyQtyInput');

    if (imgEl) imgEl.src = prod.image || 'images/default_product.jpg';
    if (nameEl) nameEl.textContent = prod.name;
    if (idEl) idEl.value = prod.id;
    if (qtyInput) qtyInput.value = currentQuickBuyQty;

    const singlePrice = Number(prod.price) || 0;
    const oldPrice = prod.oldPrice ? Number(prod.oldPrice) : 0;
    if (priceEl) priceEl.textContent = window.appStore.formatPrice(singlePrice);
    if (oldPriceEl) oldPriceEl.textContent = oldPrice > singlePrice ? window.appStore.formatPrice(oldPrice) : '';

    updateQuickBuyTotal();

    // Setup 81 Provinces & Districts
    if (window.TeklimakanLocations) {
      window.TeklimakanLocations.setupLinkedCityDistrict('quickBuyCustCity', 'quickBuyCustDistrict', 'İSTANBUL', 'Zeytinburnu');
    }

    modal.classList.add('active');
    setTimeout(() => {
      document.getElementById('quickBuyCustName')?.focus();
    }, 200);
  }
  window.openQuickBuyModal = openQuickBuyModal;

  function updateQuickBuyTotal() {
    if (!currentQuickBuyProduct) return;
    const singlePrice = Number(currentQuickBuyProduct.price) || 0;
    const total = singlePrice * currentQuickBuyQty;
    const totalEl = document.getElementById('quickBuyFinalTotal');
    if (totalEl) totalEl.textContent = window.appStore.formatPrice(total);
  }

  // Setup QuickBuy Form & Listeners
  (function setupQuickBuyListeners() {
    const qMinus = document.getElementById('quickBuyQtyMinus');
    const qPlus = document.getElementById('quickBuyQtyPlus');
    const qInput = document.getElementById('quickBuyQtyInput');

    if (qMinus && qPlus && qInput) {
      qMinus.addEventListener('click', () => {
        if (currentQuickBuyQty > 1) {
          currentQuickBuyQty--;
          qInput.value = currentQuickBuyQty;
          updateQuickBuyTotal();
        }
      });
      qPlus.addEventListener('click', () => {
        if (currentQuickBuyProduct && currentQuickBuyQty < currentQuickBuyProduct.stock) {
          currentQuickBuyQty++;
          qInput.value = currentQuickBuyQty;
          updateQuickBuyTotal();
        }
      });
    }

    const form = document.getElementById('quickBuyForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentQuickBuyProduct) return;

        const name = document.getElementById('quickBuyCustName')?.value.trim();
        const phone = document.getElementById('quickBuyCustPhone')?.value.trim();
        const city = document.getElementById('quickBuyCustCity')?.value.trim();
        const district = document.getElementById('quickBuyCustDistrict')?.value.trim();
        const address = document.getElementById('quickBuyCustAddress')?.value.trim();
        const payment = document.querySelector('input[name="quickBuyPayment"]:checked')?.value || 'بانكا ھېساباتىغا يۆتكەش';
        const lang = window.appI18n ? window.appI18n.getLang() : 'ug';

        // Validation
        const arabicRegex = /[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        if (arabicRegex.test(name)) {
          showToast(window.appI18n ? window.appI18n.t('valNameLatin') : '⚠️ كارگو توغرا يەتكۈزۈشى ئۈچۈن ئىسىم چوقۇم تۈركچە (لاتىنچە) بولسۇن!', 'warning');
          document.getElementById('quickBuyCustName')?.focus();
          return;
        }

        const cleanPhone = (phone || '').replace(/[^\d+]/g, '');
        if (cleanPhone.length < 10) {
          showToast(window.appI18n ? window.appI18n.t('valPhone') : '⚠️ تېلېفون نومۇرىنى تولۇق كىرگۈزۈڭ (05XX XXX XX XX)!', 'warning');
          document.getElementById('quickBuyCustPhone')?.focus();
          return;
        }

        if (arabicRegex.test(address) || address.length < 5) {
          showToast(window.appI18n ? window.appI18n.t('valAddressLatin') : '⚠️ ئادرېسنى تۈركچە لاتىن ھەرپلىرى بىلەن تولۇق كىرگۈزۈڭ!', 'warning');
          document.getElementById('quickBuyCustAddress')?.focus();
          return;
        }

        const submitBtn = document.getElementById('btnSubmitQuickBuy');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> زاكاز بېرىلىۋاتىدۇ...';
        }

        // Direct Order Creation in Store
        const orderData = {
          customer: { name, phone, city, district, address },
          items: [{
            id: currentQuickBuyProduct.id,
            name: currentQuickBuyProduct.name,
            price: Number(currentQuickBuyProduct.price) || 0,
            quantity: currentQuickBuyQty,
            image: currentQuickBuyProduct.image
          }],
          paymentMethod: payment,
          status: 'ساقلاۋاتىدۇ',
          notes: '⚡ تېز سېتىۋېلىش (1-Click Quick Buy) ئارقىلىق بېرىلدى',
          language: lang,
          deductStock: true
        };

        try {
          const res = window.appStore.addAdminManualOrder(orderData);
          if (res && res.success) {
            document.getElementById('quickBuyModal')?.classList.remove('active');
            if (typeof playChime === 'function') playChime('success');
            
            // Show Success Modal
            const succModal = document.getElementById('orderSuccessModal');
            const succContent = document.getElementById('orderSuccessModalContent');
            if (succModal && succContent) {
              succContent.innerHTML = `
                <div style="text-align: center; padding: 1.5rem 0.5rem;">
                  <div style="width: 70px; height: 70px; background: #ecfdf5; color: #059669; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin: 0 auto 1.1rem auto;">
                    <i class="fas fa-check"></i>
                  </div>
                  <h3 style="font-size: 1.35rem; font-weight: 900; color: #065f46; margin-bottom: 0.5rem;">${(window.appI18n && window.appI18n.t('quickBuySuccess')) || 'تېز زاكاز مۇۋەپپەقىيەتلىك بېرىلدى!'}</h3>
                  <p style="color: #475569; font-size: 0.95rem; margin-bottom: 1.25rem;">زاكاز نومۇرىڭىز: <b class="number-latin" style="color: #0284c7;">#${res.order.id}</b><br>تېلېفونىڭىزغا (${phone}) دەل ۋاقتىدا ئۇقتۇرۇش يوللاندى.</p>
                  <button type="button" class="btn-checkout" onclick="document.getElementById('orderSuccessModal').classList.remove('active')" style="padding: 0.75rem 2.2rem; font-size: 1rem; border-radius: 12px;">چۈشەندىم</button>
                </div>
              `;
              succModal.classList.add('active');
            } else {
              showToast(window.appI18n ? window.appI18n.t('quickBuySuccess') : 'زاكاز مۇۋەپپەقىيەتلىك بېرىلدى!', 'success');
            }

            // Sync to İyi Seçenek & WhatsApp/Telegram Alert in Background
            try {
              if (window.TeklimakanCargoBridge && window.TeklimakanCargoBridge.getIyiSecenekCredentials().hasCredentials) {
                window.TeklimakanCargoBridge.autoSyncOrderToIyiSecenek(res.order).catch(() => {});
              }
              fetch('/api/order-notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(res.order)
              }).catch(() => {});
            } catch (e) {}

          } else {
            showToast(res?.message || 'زاكاز چىقىرىش مەغلۇپ بولدى', 'error');
          }
        } catch (err) {
          console.error('QuickBuy error:', err);
          showToast('خاتالىق كۆرۈلدى: ' + err.message, 'error');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-bolt"></i> <span>زاكازنى دەرھال تاماملاش</span>';
          }
        }
      });
    }
  })();



  // ==================== 📲 PWA ئاپتوماتىك قاچىلاش باشقۇرغۇچى (PWA Install Prompt Manager) ====================
  (function setupPwaInstallPrompt() {
    let deferredPrompt = null;
    const banner = document.getElementById('pwaInstallBanner');
    const btnInstall = document.getElementById('btnInstallPwa');
    const btnClose = document.getElementById('btnClosePwaBanner');

    // ئەگەر ئاللىقاچان قاچىلانغان (Standalone) بولسا ياكى يېقىندا تاقىۋەتكەن بولسا چىقارماسلىق
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const isDismissed = localStorage.getItem('teklimakan_pwa_dismissed');

    if (isStandalone) {
      return;
    }

    // Android / Chrome: beforeinstallprompt ھادىسىسى
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (!isDismissed && banner) {
        setTimeout(() => {
          banner.style.display = 'block';
        }, 3500); // 3.5 سېكۇنتتىن كېيىن ئاستا چىقىدۇ
      }
    });

    if (btnInstall) {
      btnInstall.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log('[PWA] User response:', outcome);
          deferredPrompt = null;
          if (banner) banner.style.display = 'none';
        } else {
          // iOS Safari ياكى باشقا كۆرگۈچلەر ئۈچۈن قاچىلاش يىپ ئۇچى
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
          if (isIOS) {
            alert('📲 ئەپنى تېلېفونىڭىزغا قاچىلاش ئۈچۈن:\n1. Safari نىڭ ئاستىدىكى ھەمبەھىرلەش (Share) كۇنۇپكىسىنى بېسىڭ.\n2. «Ana Ekrana Ekle / باش ئېكرانغا قوشۇش» نى تاللاڭ.');
          } else {
            alert('📲 ئەپنى قاچىلاش ئۈچۈن تور كۆرگۈچنىڭ ئوڭ ئۈستىدىكى ئۈچ چېكىتنى بېسىپ «Uygulamayı Yükle / ئەپنى قاچىلاش» نى تاللاڭ.');
          }
        }
      });
    }

    if (btnClose && banner) {
      btnClose.addEventListener('click', () => {
        banner.style.display = 'none';
        localStorage.setItem('teklimakan_pwa_dismissed', Date.now());
      });
    }

    // ئەپ ئوڭۇشلۇق قاچىلانغاندا
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] Application successfully installed!');
      if (banner) banner.style.display = 'none';
      localStorage.setItem('teklimakan_pwa_dismissed', Date.now());
    });
  })();



  // ==================== 🌐 Google Search & Images Rich Snippets (Schema.org Product) ====================
  function updateProductJsonLd(product) {
    if (!product) return;
    try {
      let script = document.getElementById('productDynamicJsonLd');
      if (!script) {
        script = document.createElement('script');
        script.id = 'productDynamicJsonLd';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }

      const lang = window.appI18n ? window.appI18n.getLang() : 'ug';
      const price = Number(product.price) || 0;
      const currency = (window.appStore && window.appStore.currentCurrency) || 'TRY';
      const cleanImg = product.image ? (product.image.startsWith('http') ? product.image : 'https://teklimakan.com/' + product.image.replace(/^\/+/, '')) : 'https://teklimakan.com/images/logo_circle.png';
      const prodUrl = 'https://teklimakan.com/?id=' + encodeURIComponent(product.id);

      const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': product.name,
        'image': [cleanImg],
        'description': (product.description || product.name).replace(/<[^>]*>/g, ' ').slice(0, 300).trim(),
        'sku': String(product.id),
        'mpn': String(product.id),
        'brand': {
          '@type': 'Brand',
          'name': (product.brand || 'Teklimakan')
        },
        'offers': {
          '@type': 'Offer',
          'url': prodUrl,
          'priceCurrency': currency,
          'price': price,
          'priceValidUntil': new Date(Date.now() + 31536000000).toISOString().split('T')[0],
          'itemCondition': 'https://schema.org/NewCondition',
          'availability': product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          'seller': {
            '@type': 'Organization',
            'name': 'Teklimakan'
          }
        }
      };

      script.textContent = JSON.stringify(schemaData, null, 2);
    } catch (e) {
      console.warn('JSON-LD update error:', e);
    }
  }

