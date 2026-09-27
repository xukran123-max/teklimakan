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

  window.appI18n.applyDirectionAndTypography();

  // ⚡ ۋاكالەتچىلەرنىڭ كۈندىلىك ئاكتىپلىقى ۋە ئۇيقۇ ھالىتىنى تەكشۈرۈش
  if (window.appStore && typeof window.appStore.checkAndUpdateAllAgentsInactivity === 'function') {
    window.appStore.checkAndUpdateAllAgentsInactivity();
  }

  // تاللانغان ئۇسلۇبتىكى فونىتنى مەڭگۈلۈك مۇقىملاشتۇرۇش
  const savedFont = localStorage.getItem('uyghur_font_preference') || 'modern';
  if (savedFont === 'traditional') {
    document.body.classList.remove('font-modern');
    document.body.classList.add('font-traditional');
  } else {
    document.body.classList.add('font-modern');
    document.body.classList.remove('font-traditional');
  }

  // دەسلەپكى ئېچىلغاندا تىل بىلەن پۇل بىرلىكىنىڭ تەبىئىي ماس قەدەملىشىشى:
  // ug / tr -> TRY (₺), en -> USD ($)
  const currentInitialLang = window.appI18n.getLang();
  const alignedCurrency = currentInitialLang === 'en' ? 'USD' : 'TRY';
  if (window.appStore.getCurrency() !== alignedCurrency) {
    window.appStore.setCurrency(alignedCurrency);
  }

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
    try { updateWishlistUI(); } catch (e) { console.error('updateWishlistUI error:', e); }
    try { initHeroSlider(); } catch (e) { console.error('initHeroSlider error:', e); }

    if (window.appStore && typeof window.appStore.syncWithSupabase === 'function') {
      window.appStore.syncWithSupabase().then(() => {
        try { renderProducts(); } catch (e) {}
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
      const customAttrs = isInsta ? 'style="cursor: pointer;" onclick="document.getElementById(\'footerBrandInstaLink\')?.click()"' : '';
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

    const flashBadge = document.getElementById('flashSaleBadge');
    if (flashBadge) flashBadge.textContent = i18n.t('flashSaleBadge');
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

    const cNoticeBanner = document.getElementById('checkoutTurkishNoticeBanner');
    if (cNoticeBanner) {
      cNoticeBanner.innerHTML = `<strong>${lang === 'tr' ? '⚠️ Kargo Bilgilendirmesi:' : (lang === 'en' ? '⚠️ Delivery Notice:' : '⚠️ تۈركىيە كارگو (پوچتا) ئەسكەرتىشى:')}</strong> ${i18n.t('checkoutTurkishNotice') || ''}`;
    }
    const cNameLabel = document.getElementById('checkoutCustNameLabel');
    if (cNameLabel) cNameLabel.innerHTML = `${i18n.t('custName')} <span style="color: var(--danger-color);">*</span>`;
    const cNameHint = document.getElementById('checkoutCustNameHint');
    if (cNameHint) cNameHint.textContent = i18n.t('custNameHint') || '';

    const cPhoneLabel = document.getElementById('checkoutCustPhoneLabel');
    if (cPhoneLabel) cPhoneLabel.innerHTML = `${i18n.t('custPhone')} <span style="color: var(--danger-color);">*</span>`;
    const cCityLabel = document.getElementById('checkoutCustCityLabel');
    if (cCityLabel) cCityLabel.innerHTML = `${i18n.t('custCity')} <span style="color: var(--danger-color);">*</span>`;
    const cAddrLabel = document.getElementById('checkoutCustAddressLabel');
    if (cAddrLabel) cAddrLabel.innerHTML = `${i18n.t('custAddress')} <span style="color: var(--danger-color);">*</span>`;
    const cAddrHint = document.getElementById('checkoutCustAddressHint');
    if (cAddrHint) cAddrHint.textContent = i18n.t('custAddressHint') || '';

    const cPayLabel = document.getElementById('checkoutPaymentLabel');
    if (cPayLabel) cPayLabel.textContent = i18n.t('paymentMethod');

    const pCard = document.getElementById('payMethodCardSpan');
    if (pCard) pCard.textContent = i18n.t('payCard');
    const cDisabled = document.getElementById('cardDisabledBadge');
    if (cDisabled) {
      cDisabled.innerHTML = `<i class="fas fa-lock"></i> ${i18n.t('cardDisabledBadge') || (lang === 'tr' ? 'Çok Yakında (Geçici Olarak Kapalı)' : (lang === 'en' ? 'Coming Soon (Inactive)' : 'پات ئارىدا (ھازىرچە پاسسىپ)'))}`;
    }

    const pHavale = document.getElementById('payMethodHavaleSpan');
    if (pHavale) pHavale.textContent = i18n.t('payHavale');

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
      if (lang === 'tr') {
        bNotice.innerHTML = '<i class="fas fa-info-circle" style="color: #059669;"></i> <strong>Not:</strong> Para gönderirken açıklama (açıklama) kısmına <strong>kuruyemiş</strong> yazınız.';
      } else if (lang === 'en') {
        bNotice.innerHTML = '<i class="fas fa-info-circle" style="color: #059669;"></i> <strong>Notice:</strong> Please write <strong>kuruyemiş</strong> in the transfer description field.';
      } else {
        bNotice.innerHTML = '<i class="fas fa-info-circle" style="color: #059669;"></i> <strong>ئەسكەرتىش:</strong> پۇل ئەۋەتكەندە چۈشەندۈرۈش (Açıklama) قىسمىغا <strong>kuruyemiş</strong> دەپ يېزىپ قويۇڭ.';
      }
    }

    const pWhatsapp = document.getElementById('payMethodWhatsappSpan');
    if (pWhatsapp) pWhatsapp.textContent = i18n.t('payWhatsapp');
    const pNotice = document.getElementById('whatsappPayNoticeText');
    if (pNotice) pNotice.textContent = i18n.t('whatsappPayNotice');

    const cNotesLabel = document.getElementById('checkoutCustNotesLabel');
    if (cNotesLabel) cNotesLabel.textContent = i18n.t('custNotes');
    const cNotesInput = document.getElementById('checkoutCustNotes');
    if (cNotesInput) cNotesInput.placeholder = i18n.t('custNotesPlaceholder');

    const submitOrderBtn = document.getElementById('submitOrderBtn');
    if (submitOrderBtn) submitOrderBtn.querySelector('span').textContent = i18n.t('submitOrderBtn');

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

    const fAgentPortalSpan = document.getElementById('fLinkAgentPortalSpan');
    if (fAgentPortalSpan) fAgentPortalSpan.textContent = i18n.t('agentFooterLink') || i18n.t('topAgent');
    const fAgentPortalSub = document.getElementById('fLinkAgentPortalSub');
    if (fAgentPortalSub) fAgentPortalSub.textContent = i18n.t('fLinkAgentPortalSub') || (lang === 'tr' ? 'İş birliği ve temsilcilik' : (lang === 'en' ? 'Partnership & Agent portal' : 'ھەمكارلىق ۋە ۋاكالەتچىلىك'));

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
    if (cMsgInp) cMsgInp.placeholder = i18n.t('chatPlaceholder') || (lang === 'tr' ? 'Mesajınızı yazın...' : (lang === 'en' ? 'Type your message...' : 'سۇئالىڭىزنى ياكى ئېھتىياجىڭىزنى يېزىڭ...'));
    const cCustName = document.getElementById('chatCustomerName');
    if (cCustName) cCustName.placeholder = i18n.t('chatNamePlaceholder') || (lang === 'tr' ? 'İsminiz (isteğe bağlı)' : (lang === 'en' ? 'Your Name (optional)' : 'ئىسمىڭىز (تاللاشچان)'));
    const cCustPhone = document.getElementById('chatCustomerPhone');
    if (cCustPhone) cCustPhone.placeholder = i18n.t('chatPhonePlaceholder') || (lang === 'tr' ? 'Telefon Numaranız' : (lang === 'en' ? 'Your Phone Number' : 'تېلېفون نومۇرىڭىز'));

    const chipTrack = document.getElementById('chatChipTrack');
    if (chipTrack) {
      chipTrack.textContent = i18n.t('chatChipTrack') || (lang === 'tr' ? '📦 Kargo Sorgula' : (lang === 'en' ? '📦 Track Order' : '📦 زاكاز سۈرۈشتۈرۈش'));
      chipTrack.dataset.msg = lang === 'tr' ? 'Sipariş durumumu sorgulamak istiyorum.' : (lang === 'en' ? 'I would like to check my order status.' : 'زاكاز ئەھۋالىمنى سۈرۈشتۈرمەكچىتىم.');
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

    // 🎁 ئىنىستىگېرام ئەگەشكۈچى سوۋغىتى كۆزنىكىنى نۆۋەتتىكى تىلغا ئاساسەن يېڭىلاش
    const igTitle = document.getElementById('instaGiftTitle');
    if (igTitle) igTitle.textContent = i18n.t('instaGiftBoxTitle') || '🎁 ئىنىستىگېرام سەھىپىمىزگە ئەگەشتىڭىزمۇ؟';
    const igBadge = document.getElementById('instaGiftBadgeSpan');
    if (igBadge) igBadge.textContent = i18n.t('instaGiftBadge') || 'ھەقسىز سوۋغات';
    const igDesc = document.getElementById('instaGiftDesc');
    if (igDesc) igDesc.textContent = i18n.t('instaGiftDesc') || 'رەسمىي سەھىپىمىزگە ئەگىشىپ قويسىڭىز، بۇ قېتىملىق زاكازىڭىزغا ئالاھىدە سوۋغات قوشۇپ بېرىمىز!';
    const igPageLabel = document.getElementById('instaGiftPageLabel');
    if (igPageLabel) igPageLabel.textContent = i18n.t('instaGiftPageLabel') || 'رەسمىي سەھىپە:';
    const igPageHandle = document.getElementById('instaGiftPageHandle');
    if (igPageHandle) igPageHandle.textContent = instaHandle;
    const igFollowBtn = document.getElementById('instaGiftFollowBtn');
    if (igFollowBtn) igFollowBtn.href = instaUrl;
    const igFollowBtnText = document.getElementById('instaGiftFollowBtnText');
    if (igFollowBtnText) igFollowBtnText.textContent = i18n.t('instaGiftFollowBtn') || 'Instagram\'دا ئەگىشىش';
    const igCheckLabel = document.getElementById('instaGiftCheckLabel');
    if (igCheckLabel) igCheckLabel.textContent = i18n.t('instaGiftCheckbox') || 'مەن ئىنىستىگېرامغا ئەگەشتىم، پوسۇلكامغا ھەدىيە قوشۇلسۇن!';
    const igUsername = document.getElementById('instaGiftUsername');
    if (igUsername) igUsername.placeholder = i18n.t('instaGiftPlaceholder') || 'ئىنىستىگېرام نامىڭىز (مەسىلەن: @ئىسمىڭىز)';
    const igHint = document.getElementById('instaGiftHint');
    if (igHint) igHint.innerHTML = `<i class="fas fa-check-circle"></i> ${i18n.t('instaGiftHint') || 'دەلىللەش ئۇچۇرى: پوسۇلكىڭىز چىقىرىلغاندا ھەدىيە ئاپتوماتىك قوشۇلىدۇ.'}`;

    // ئۈستۈنكى ئايلانما ئېلان (Marquee) پۈتۈنلەي renderMarqueeTicker ئارقىلىق يېڭىلىنىدۇ

    const flMerch = document.getElementById('fLinkMerchants');
    if (flMerch) flMerch.textContent = i18n.t('fLinkMerchants');
    const fFooterMerchantSpan = document.getElementById('footerMerchantSpan');
    if (fFooterMerchantSpan) fFooterMerchantSpan.textContent = i18n.t('fLinkMerchants');
    const fAgentLink = document.getElementById('footerAgentLinkText');
    if (fAgentLink) fAgentLink.textContent = i18n.t('topAgent');
    const fAgentSpan = document.getElementById('footerAgentSpan');
    if (fAgentSpan) fAgentSpan.textContent = i18n.t('topAgent');
    const btnMerchFooter = document.getElementById('btnOpenMerchantApplyFooter');
    if (btnMerchFooter) btnMerchFooter.title = i18n.t('fLinkMerchants');
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

    // شەھەر تاللانمىلىرىنى تىل بويىچە يېڭىلاش (تۈركىيە شەھەرلىرى)
    const citySelect = document.getElementById('checkoutCustCity');
    if (citySelect) {
      const turkeyCities = [
        { val: 'İstanbul', ug: 'İstanbul (ئىستانبۇل)', tr: 'İstanbul', en: 'Istanbul' },
        { val: 'Ankara', ug: 'Ankara (ئەنقەرە)', tr: 'Ankara', en: 'Ankara' },
        { val: 'İzmir', ug: 'İzmir (ئىزمىر)', tr: 'İzmir', en: 'Izmir' },
        { val: 'Bursa', ug: 'Bursa (بۇرسا)', tr: 'Bursa', en: 'Bursa' },
        { val: 'Antalya', ug: 'Antalya (ئانتاليا)', tr: 'Antalya', en: 'Antalya' },
        { val: 'Konya', ug: 'Konya (كونيا)', tr: 'Konya', en: 'Konya' },
        { val: 'Kayseri', ug: 'Kayseri (قەيسەرى)', tr: 'Kayseri', en: 'Kayseri' },
        { val: 'Kocaeli', ug: 'Kocaeli (كوجائېلى)', tr: 'Kocaeli', en: 'Kocaeli' },
        { val: 'Gaziantep', ug: 'Gaziantep (گازىئانتەپ)', tr: 'Gaziantep', en: 'Gaziantep' },
        { val: 'Adana', ug: 'Adana (ئادانا)', tr: 'Adana', en: 'Adana' },
        { val: 'Mersin', ug: 'Mersin (مەرسىن)', tr: 'Mersin', en: 'Mersin' },
        { val: 'Samsun', ug: 'Samsun (سامسۇن)', tr: 'Samsun', en: 'Samsun' },
        { val: 'Trabzon', ug: 'Trabzon (ترابزون)', tr: 'Trabzon', en: 'Trabzon' },
        { val: 'Eskişehir', ug: 'Eskişehir (ئەسكىشەھەر)', tr: 'Eskişehir', en: 'Eskisehir' },
        { val: 'Diyarbakır', ug: 'Diyarbakır (دىياربەكىر)', tr: 'Diyarbakır', en: 'Diyarbakir' },
        { val: 'Şanlıurfa', ug: 'Şanlıurfa (شانلىئۇرفا)', tr: 'Şanlıurfa', en: 'Sanliurfa' },
        { val: 'Malatya', ug: 'Malatya (مالاتيا)', tr: 'Malatya', en: 'Malatya' },
        { val: 'Kahramanmaraş', ug: 'Kahramanmaraş (ماراش)', tr: 'Kahramanmaraş', en: 'Kahramanmaras' },
        { val: 'Denizli', ug: 'Denizli (دېڭىزلى)', tr: 'Denizli', en: 'Denizli' },
        { val: 'Sakarya', ug: 'Sakarya (ساكاريا)', tr: 'Sakarya', en: 'Sakarya' },
        { val: 'Balıkesir', ug: 'Balıkesir (بالىكەسىر)', tr: 'Balıkesir', en: 'Balikesir' },
        { val: 'Manisa', ug: 'Manisa (مانىسا)', tr: 'Manisa', en: 'Manisa' },
        { val: 'Aydın', ug: 'Aydın (ئايدىن)', tr: 'Aydın', en: 'Aydin' },
        { val: 'Tekirdağ', ug: 'Tekirdağ (تەكىرداغ)', tr: 'Tekirdağ', en: 'Tekirdag' },
        { val: 'Muğla', ug: 'Muğla (مۇغلا)', tr: 'Muğla', en: 'Mugla' },
        { val: 'Hatay', ug: 'Hatay (خاتاي)', tr: 'Hatay', en: 'Hatay' },
        { val: 'Sivas', ug: 'Sivas (سىۋاس)', tr: 'Sivas', en: 'Sivas' },
        { val: 'Erzurum', ug: 'Erzurum (ئەرزۇرۇم)', tr: 'Erzurum', en: 'Erzurum' },
        { val: 'Van', ug: 'Van (ۋان)', tr: 'Van', en: 'Van' },
        { val: 'Batman', ug: 'Batman (باتمان)', tr: 'Batman', en: 'Batman' },
        { val: 'Elazığ', ug: 'Elazığ (ئەلازىغ)', tr: 'Elazığ', en: 'Elazig' },
        { val: 'Diğer Şehirler', ug: 'Diğer İller (باشقا شەھەرلەر)', tr: 'Diğer Şehirler', en: 'Other Cities' }
      ];
      const savedVal = citySelect.value || 'İstanbul';
      citySelect.innerHTML = '';
      turkeyCities.forEach(city => {
        const opt = document.createElement('option');
        opt.value = city.val;
        opt.textContent = city[lang] || city.tr;
        if (city.val === savedVal) opt.selected = true;
        citySelect.appendChild(opt);
      });
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
      categories = INITIAL_CATEGORIES.map(c => ({
        ...c,
        displayName: (c.translations && c.translations[lang]) ? c.translations[lang] : c.name
      }));
    }

    const container = document.getElementById('categoryPillsContainer');
    const select = document.getElementById('searchCategorySelect');

    if (container) {
      container.innerHTML = '';
      categories.forEach(cat => {
        const pill = document.createElement('button');
        pill.className = `category-pill ${currentCategory === cat.id ? 'active' : ''}`;
        pill.innerHTML = `<i class="${cat.icon}"></i> <span>${cat.displayName}</span>`;
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
      categories.forEach(cat => {
        if (cat.id !== 'all') {
          const opt = document.createElement('option');
          opt.value = cat.id;
          opt.textContent = cat.displayName;
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

  // ==================== تاۋار كارتىلىرى ====================
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
    products.forEach(product => {
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
      const stockUnitLabel = cleanedUnit ? (/\d/.test(cleanedUnit) ? `دانە (${cleanedUnit})` : cleanedUnit) : i18n.t('itemsUnit');

      if (product.stock <= 0) {
        stockHtml = `<span class="stock-status-out"><i class="fas fa-times-circle"></i> ${i18n.t('outOfStock')}</span>`;
      } else if (product.stock <= 8) {
        stockHtml = `<span class="stock-status-low"><i class="fas fa-exclamation-circle"></i> ${i18n.t('lowStock')} <bdi class="number-latin">${product.stock}</bdi> ${stockUnitLabel}</span>`;
      } else {
        stockHtml = `<span class="stock-status-in"><i class="fas fa-check-circle"></i> ${i18n.t('inStock')} <bdi class="number-latin">${product.stock}</bdi> ${stockUnitLabel}</span>`;
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
          <button class="product-wish-btn ${isWish ? 'active' : ''}" data-id="${product.id}" title="Wishlist">
            <i class="${isWish ? 'fas' : 'far'} fa-heart"></i>
          </button>
        </div>
        <div class="product-card-body">
          <!-- 1. مەھسۇلات نامى ئۈستىدە -->
          <h3 class="product-title" title="${product.name}">${product.name}</h3>

          <!-- 2. تۈرى ئاستىدا ۋە سودىگەر ئىناۋەت بەلگىسى -->
          <div class="product-category-row" style="margin-bottom: 0.45rem; display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap;">
            <span class="product-category-tag">${i18n.getCategoryName(product.category)}</span>
            ${getMerchantBadgeHtml(product)}
          </div>
          
          <div class="product-rating">
            <i class="fas fa-star"></i>
            <span>${displayRating}</span>
            <span class="rating-count">(${product.ratingCount || 10} ${i18n.t('reviewsText')})</span>
          </div>

          <div class="product-stock-bar">
            ${stockHtml}
            <span class="sales-count">${i18n.t('salesCount')} <bdi class="number-latin">${product.sales || 0}</bdi></span>
          </div>

          <div class="product-pricing">
            <span class="current-price">${formattedPrice}${product.unit ? `<small class="unit-text" style="font-size: 0.82rem; font-weight: normal; color: var(--text-muted); margin-right: 4px;"> / <bdi>${product.unit}</bdi></small>` : ''}</span>
            ${formattedOldPrice ? `<span class="original-price">${formattedOldPrice}</span>` : ''}
          </div>

          <div class="product-card-actions">
            <button class="btn-add-cart" data-id="${product.id}" ${product.stock <= 0 ? 'disabled' : ''}>
              <i class="fas fa-shopping-bag"></i>
              <span>${product.stock <= 0 ? i18n.t('outOfStock') : i18n.t('addToCart')}</span>
            </button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

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
      return;
    }

    drawerBody.innerHTML = '';
    cartData.items.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.product.image}" class="cart-item-img" alt="${item.product.name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'">
        <div class="cart-item-info">
          <div style="font-size: 0.78rem; color: var(--text-muted);"><i class="fas fa-award"></i> ${i18n.getBrandName(item.product.brand) || 'تەكلىماكان'}</div>
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

    // 🚚 1000 لىرا ھەقسىز يەتكۈزۈش پىرسەنتى
    const threshold = cartData.threshold;
    const currentSub = cartData.convertedSubtotal;
    const percent = Math.min(100, Math.round((currentSub / threshold) * 100));
    if (freeShippingBar) freeShippingBar.style.width = `${percent}%`;

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
          <h4 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--text-main);">ياقتۇرغان تاۋار تېخى يوق</h4>
          <p style="font-size: 0.88rem; line-height: 1.6; margin: 0; color: var(--text-muted);">دۇكاندىكى مەھسۇلاتلارنىڭ ئۈستىدىكى قىزىل يۈرەك بەلگىسىنى چېكىپ، ياقتۇرغان تاۋارلىرىڭىزنى بۇ يەرگە ساقلىۋالالايسىز.</p>
        </div>
      `;
      return;
    }

    drawerBody.innerHTML = items.map(item => {
      const p = item.product || item;
      const formattedPrice = p.priceFormatted || store.formatPrice(p.price || 0);
      const formattedOldPrice = p.oldPrice ? store.formatPrice(p.oldPrice) : null;
      const stockStatus = (Number(p.stock) || 0) > 0
        ? `<span style="color: #10b981; font-weight: 700; font-size: 0.78rem;"><i class="fas fa-check-circle"></i> ئامباردا بار</span>`
        : `<span style="color: #ef4444; font-weight: 700; font-size: 0.78rem;"><i class="fas fa-times-circle"></i> تۈگىگەن</span>`;
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
            <button type="button" class="btn-move-wish-cart" data-id="${p.id}" title="سېۋەتكە يۆتكەش" style="background: #2563eb; color: #fff; border: none; border-radius: 8px; width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s;" ${(Number(p.stock) || 0) <= 0 ? 'disabled' : ''}>
              <i class="fas fa-cart-plus"></i>
            </button>
            <button type="button" class="btn-remove-wish" data-id="${p.id}" title="ئۆچۈرۈش" style="background: #fee2e2; color: #ef4444; border: none; border-radius: 8px; width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s;">
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
  let currentInboxTab = 'notifs';
  let currentInboxQuery = '';
  let cachedInboxData = { orders: [], notifications: [] };

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
    const savedName = localStorage.getItem('teklimakan_customer_name') || 'ھۆرمەتلىك خېرىدار';

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
            <h4 style="font-size: 1rem; font-weight: 800; color: #475569; margin-bottom: 0.4rem;">ھازىرچە يېڭى ئۇقتۇرۇش يوق</h4>
            <p style="margin: 0; font-size: 0.88rem; line-height: 1.6;">پوسۇلكىڭىز كارگوغا چىققاندا ياكى سۇپا باشقۇرغۇچىسى ئۇچۇر يازغاندا مۇشۇ يەرگە دەل ۋاقتىدا چىقىدۇ.</p>
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
          badgeText = 'كارگو يوللاندى';
          badgeBg = '#f0fdf4';
          badgeColor = '#15803d';
        } else if (n.type === 'order_created') {
          iconBg = '#eef2ff';
          iconColor = '#4f46e5';
          iconClass = 'fa-file-invoice';
          badgeText = 'مېلىڭىز قوبۇل قىلىندى';
          badgeBg = '#eef2ff';
          badgeColor = '#4338ca';
        } else if (n.type === 'order_completed') {
          iconBg = '#ecfdf5';
          iconColor = '#059669';
          iconClass = 'fa-circle-check';
          badgeText = 'مېلىڭىز يەتكۈزۈلدى';
          badgeBg = '#ecfdf5';
          badgeColor = '#047857';
        } else if (n.type === 'admin_message') {
          iconBg = '#fef3c7';
          iconColor = '#d97706';
          iconClass = 'fa-comment-dots';
          badgeText = 'سۇپا خېتى';
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
                      <i class="fas fa-external-link-alt"></i> پوچتىدىن تەكشۈرۈش
                    </a>
                  ` : ''}
                </div>
              </div>
            ` : ''}

            <div style="display: flex; justify-content: flex-end; align-items: center; gap: 0.5rem; border-top: 1px dashed #f1f5f9; padding-top: 0.55rem;">
              <a href="https://api.whatsapp.com/send?phone=905551609999&text=${encodeURIComponent(`ئەسسالامۇئەلەيكۇم تەكلىماكان سۇپىسى، مېنىڭ پوسۇلكا كود نومۇرۇم: #${n.orderId || cleanQ}. مېلىمنى سۈرۈشتۈرمەكچىتىم.`)}" target="_blank" style="color: #16a34a; font-weight: 700; font-size: 0.8rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;">
                <i class="fab fa-whatsapp"></i> WhatsApp تىن سۈرۈشتۈرۈش
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

          <!-- 4-Step Progress Tracker -->
          <div style="margin: 1.25rem 0;">
            <div class="track-timeline" style="display: flex; justify-content: space-between; position: relative; gap: 0.5rem;">
              ${[
                { step: 1, title: curSteps[0], icon: 'fa-clipboard-check' },
                { step: 2, title: curSteps[1], icon: 'fa-box-open' },
                { step: 3, title: curSteps[2], icon: 'fa-truck-fast' },
                { step: 4, title: curSteps[3], icon: 'fa-house-circle-check' }
              ].map(s => {
                const isActive = !isCancelled && currentStep >= s.step;
                const isCurrent = !isCancelled && currentStep === s.step;
                return `
                  <div class="track-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}" style="flex: 1; text-align: center; position: relative; z-index: 1;">
                    <div class="track-step-circle" style="width: 36px; height: 36px; border-radius: 50%; margin: 0 auto 0.4rem; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; transition: all 0.3s; background: ${isActive ? '#0284c7' : '#f1f5f9'}; color: ${isActive ? '#ffffff' : '#94a3b8'}; border: 2px solid ${isActive ? '#0284c7' : '#e2e8f0'};">
                      <i class="fas ${s.icon}"></i>
                    </div>
                    <div style="font-size: 0.76rem; font-weight: ${isActive ? '800' : '600'}; color: ${isActive ? '#0f172a' : '#94a3b8'}; line-height: 1.3;">
                      ${s.title}
                    </div>
                  </div>
                `;
              }).join('')}
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
            <div><b>${lblPayMethod}</b> ${order.paymentMethod || 'Havale / EFT'}</div>
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
                   url.searchParams.get('p');

      if (!prodId && window.location.hash) {
        const hash = window.location.hash.replace(/^#/, '').trim();
        if (hash.toLowerCase().startsWith('prd-') || hash.toLowerCase().startsWith('id=')) {
          prodId = hash.replace(/^id=/i, '');
        }
      }

      if (!prodId) return;

      prodId = decodeURIComponent(prodId).trim();

      const findProduct = () => window.appStore?.getProductById(prodId) ||
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
    if (!productId) return;
    const cleanId = String(productId).replace(/^#/, '').trim();
    const lang = window.appI18n ? window.appI18n.getLang() : 'ug';
    const product = window.appStore.getProductById(cleanId, lang) ||
                    window.appStore.getProductById('PRD-' + cleanId, lang);
    if (!product) return;

    const modal = document.getElementById('quickViewModal');
    const modalBody = document.getElementById('quickViewModalBody');
    if (!modal || !modalBody) return;
    modal.dataset.productId = product.id;

    const formattedPrice = window.appStore.formatPrice(product.price);
    const formattedOldPrice = product.oldPrice ? window.appStore.formatPrice(product.oldPrice) : null;

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
            <span style="background: rgba(37, 99, 235, 0.08); color: var(--primary-color); padding: 2px 9px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; border: 1px solid rgba(37, 99, 235, 0.22); display: inline-flex; align-items: center; gap: 4px;"><i class="fas fa-award" style="font-size: 0.72rem;"></i> ${window.appI18n.t('brandLabel') || 'ماركا:'} ${window.appI18n.getBrandName(product.brand) || 'تەكلىماكان'}</span>
            ${getMerchantBadgeHtml(product)}
          </div>

          <h3 style="font-size: 1.25rem; font-weight: 800; line-height: 1.4; margin-bottom: 0.75rem;">${product.name}</h3>
          
          <div style="display: flex; align-items: baseline; gap: 0.75rem; margin-bottom: 0.85rem; flex-wrap: wrap;">
            <span style="font-size: 1.65rem; font-weight: 900; color: var(--danger-color);">${formattedPrice}${product.unit ? `<small style="font-size: 0.95rem; font-weight: normal; color: var(--text-muted); margin-right: 6px;"> / <bdi>${product.unit}</bdi></small>` : ''}</span>
            ${formattedOldPrice ? `<span style="font-size: 1rem; color: var(--text-light); text-decoration: line-through;">${formattedOldPrice}</span>` : ''}
          </div>

          <div style="background: var(--bg-main); padding: 0.85rem; border-radius: var(--radius-sm); margin-bottom: 0.85rem; font-size: 0.9rem; line-height: 1.7; border: 1px solid var(--border-color);">
            ${product.description || ''}
          </div>

          <div style="margin-bottom: 0.85rem; font-weight: 700; font-size: 0.9rem; color: ${product.stock > 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
            ${window.appI18n.t('filterStockTitle')}: <span class="number-latin">${product.stock}</span> <bdi>${product.unit || window.appI18n.t('itemsUnit')}</bdi>
          </div>

          <div class="quick-view-actions">
            <div class="qty-control-wrap" style="height: 44px; min-width: 105px; display: flex; align-items: center;">
              <button class="qty-btn" id="modalQtyMinus" style="height: 100%; width: 34px; font-size: 1.1rem;">-</button>
              <input type="text" id="modalQtyInput" class="qty-input" value="1" readonly style="height: 100%; text-align: center; font-weight: 700; font-size: 1rem;">
              <button class="qty-btn" id="modalQtyPlus" style="height: 100%; width: 34px; font-size: 1.1rem;">+</button>
            </div>
            <button id="modalAddToCartBtn" class="btn-add-cart" style="flex: 1; min-height: 44px; height: 44px; min-width: 0; padding: 0 1rem; font-size: 0.95rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; text-align: center; gap: 0.55rem; line-height: 1;" ${product.stock <= 0 ? 'disabled' : ''}>
              <i class="fas fa-cart-plus" style="font-size: 1.1rem;"></i>
              <span style="display: inline-block;">${window.appI18n.t('addToCart')}</span>
            </button>
          </div>

          <!-- 💬 1-چېكىش بىلەن دەرھال WhatsApp تا ئېلىش كۇنۇپكىسى -->
          <button type="button" id="modalInstantBuyWaBtn" class="btn-whatsapp-instant" style="width: 100%; min-height: 44px; margin-top: 0.75rem; background: #25D366; color: #ffffff; border: none; border-radius: 10px; font-weight: 800; font-size: 0.95rem; display: inline-flex; align-items: center; justify-content: center; gap: 0.55rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.28);">
            <i class="fab fa-whatsapp" style="font-size: 1.3rem;"></i>
            <span>💬 دەرھال WhatsApp تا ئېلىش</span>
          </button>

          <!-- 🔗 مەھسۇلات ئۇلانمىسىنى ھەمبەھىرلەش كۇنۇپكىسى -->
          <button type="button" id="modalShareProductBtn" class="btn-share-product">
            <i class="fas fa-share-alt"></i>
            <span>🔗 مەھسۇلات ئۇلانمىسىنى ھەمبەھىرلەش</span>
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
        const baseUrl = (window.location.origin && window.location.origin.startsWith('http')) ? window.location.origin : 'https://www.teklimakan.com';
        const itemUrl = `${baseUrl}/api/product-share?id=${encodeURIComponent(product.id)}&lang=${encodeURIComponent(lang)}`;
        const msg = encodeURIComponent(
          `ئەسسالامۇئەلەيكۇم تەكلىماكان سۇپىسى، مەن بۇ مەھسۇلاتنى بىۋاسىتە سېتىۋالماقچىتىم:\n\n` +
          `📦 مەھسۇلات: ${product.name}\n` +
          `💰 باھاسى: ${formattedPrice} (${currentQty} دانە)\n` +
          `🏷️ تۈرى: ${product.category}\n\n` +
          `🔗 مەھسۇلات ئۇلانمىسى:\n${itemUrl}\n\n` +
          `زاكازنى تەستىقلاپ، ھېسابات ئۇچۇرىنى بەرسىڭىز، رەھمەت!`
        );
        window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${msg}`, '_blank');
      });
    }

    const shareBtn = document.getElementById('modalShareProductBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        const lang = window.appI18n ? window.appI18n.getLang() : 'ug';
        const baseUrl = (window.location.origin && window.location.origin.startsWith('http')) ? window.location.origin : 'https://www.teklimakan.com';
        const shareUrl = `${baseUrl}/api/product-share?id=${encodeURIComponent(product.id)}&lang=${encodeURIComponent(lang)}`;
        const shareTitle = `${product.name} - تەكلىماكان سودا سۇپىسى`;
        const shareDesc = `🌟 تەكلىماكان سۇپىسىدىكى مەھسۇلات:\n📦 ${product.name}\n💰 باھاسى: ${formattedPrice}\n📝 ${product.description || ''}`;
        const fullShareMessage = `${shareDesc}\n\n🔗 كۆرۈش ئۇلانمىسى:\n${shareUrl}`;

        // 1. يانفون سىستېمىلىق ھەمبەھىرلەش:
        // ئارتۇق رەسىم ھۆججىتى كۆپەيتىلمەيدۇ؛ ئۇلانما شۇ مەھسۇلاتنىڭ مەخسۇس ئالدىن كۆرۈنۈش بېتىگە ئۇلىنىدۇ.
        // WhatsApp ۋە باشقا ئەپلەر مەزكۇر بەتتىكى og:image ئارقىلىق دەل شۇ مەھسۇلاتنىڭ ئۆز رەسىمىنى قۇتىدا كۆرسىتىدۇ.
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
          showToast('🔗 مەھسۇلات ئۇلانمىسى كۆچۈرۈلدى! خالىغان كىشىگە ھەمبەھىرلىيەلەيسىز.', 'success');
        } catch (err) {
          showToast('🔗 ئۇلانما: ' + shareUrl, 'info');
        }
      });
    }
  }

  // ==================== چىقىم ====================
  function openCheckoutModal() {
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

    const checkedPay = document.querySelector('input[name="checkoutPayment"]:checked');
    const notice = document.getElementById('whatsappPayNotice');
    const havaleDetails = document.getElementById('havalePaymentDetails');
    const cardDetails = document.getElementById('cardPaymentDetails');
    const submitBtn = document.getElementById('submitOrderBtn');
    const submitBtnSpan = submitBtn ? submitBtn.querySelector('span') : null;
    const submitBtnIcon = submitBtn ? submitBtn.querySelector('i') : null;

    if (checkedPay && (checkedPay.value.includes('ۋاتساپ') || checkedPay.value.includes('WhatsApp'))) {
      if (notice) notice.style.display = 'block';
      if (havaleDetails) havaleDetails.style.display = 'none';
      if (cardDetails) cardDetails.style.display = 'none';
      if (submitBtnSpan) submitBtnSpan.textContent = 'ۋاتساپ ئارقىلىق زاكاز بېرىش';
      if (submitBtnIcon) submitBtnIcon.className = 'fab fa-whatsapp';
    } else {
      if (notice) notice.style.display = 'none';
      if (havaleDetails) havaleDetails.style.display = 'block';
      if (cardDetails) cardDetails.style.display = 'none';
      if (submitBtnSpan) submitBtnSpan.textContent = 'زاكاز ۋە ھېسابات ئۇچۇرىنى جەزملەش';
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
          window.appI18n.setLang(selectedLang);
          langModal.classList.remove('active');
          updateStaticTranslations();
          renderBrands();
          renderCategories();
          renderProducts();
          updateCartUI();
          if (selectedLang === 'ug') {
            showToast('تىل ئۇيغۇرچىغا، پۇل بىرلىكى لىرا (₺ TRY) غا ئالماشتۇرۇلدى!', 'success');
          } else if (selectedLang === 'tr') {
            showToast('Dil Türkçe, para birimi Türk Lirası (₺ TRY) olarak ayarlandı!', 'success');
          } else {
            showToast('Language switched to English, currency set to US Dollar ($ USD)!', 'success');
          }
        });
      });
    }

    window.addEventListener('teklimakan_lang_changed', () => {
      updateStaticTranslations();
      renderBrands();
      renderCategories();
      renderProducts();
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
        updateCartUI();
        showToast(`🎉 كۇپون (${code}) سېۋەتكە كۈچكە ئىگە قىلىندى!`, 'success');
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
      const submitBtnSpan = submitBtn ? submitBtn.querySelector('span') : null;
      const submitBtnIcon = submitBtn ? submitBtn.querySelector('i') : null;

      function updatePaymentMethodUI(method) {
        if (labelCard) labelCard.style.borderColor = 'var(--border-color)';
        if (labelHavale) labelHavale.style.borderColor = 'var(--border-color)';
        if (labelWhatsapp) labelWhatsapp.style.borderColor = 'var(--border-color)';

        if (method.includes('كارتا') || method.includes('Card')) {
          if (cardDetails) cardDetails.style.display = 'block';
          if (havaleDetails) havaleDetails.style.display = 'none';
          if (whatsappNotice) whatsappNotice.style.display = 'none';
          if (labelCard) labelCard.style.borderColor = '#6366f1';
          if (submitBtnSpan) submitBtnSpan.textContent = 'كارتىدىن بىخەتەر چىقىم قىلىش';
          if (submitBtnIcon) submitBtnIcon.className = 'fas fa-lock';
        } else if (method.includes('يۆتكەش') || method.includes('Havale')) {
          if (cardDetails) cardDetails.style.display = 'none';
          if (havaleDetails) havaleDetails.style.display = 'block';
          if (whatsappNotice) whatsappNotice.style.display = 'none';
          if (labelHavale) labelHavale.style.borderColor = '#059669';
          if (submitBtnSpan) submitBtnSpan.textContent = 'زاكاز ۋە ھېسابات ئۇچۇرىنى جەزملەش';
          if (submitBtnIcon) submitBtnIcon.className = 'fas fa-university';
        } else if (method.includes('ۋاتساپ') || method.includes('WhatsApp')) {
          if (cardDetails) cardDetails.style.display = 'none';
          if (havaleDetails) havaleDetails.style.display = 'none';
          if (whatsappNotice) whatsappNotice.style.display = 'block';
          if (labelWhatsapp) labelWhatsapp.style.borderColor = '#25D366';
          if (submitBtnSpan) submitBtnSpan.textContent = 'ۋاتساپ ئارقىلىق زاكاز بېرىش';
          if (submitBtnIcon) submitBtnIcon.className = 'fab fa-whatsapp';
        }
      }

      if (labelCard) {
        labelCard.addEventListener('click', (e) => {
          showToast('بانكا ياكى خەلقئارالىق كارتا ئارقىلىق پۇل تۆلەش ھازىرچە پاسسىپ ھالەتتە. بانكا ھېساباتىغا يۆتكەش (Havale) ياكى ۋاتساپ ئارقىلىق پۇل تۆلەڭ.', 'info');
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
        const city = document.getElementById('checkoutCustCity').value.trim();
        const address = document.getElementById('checkoutCustAddress').value.trim();
        const payment = document.querySelector('input[name="checkoutPayment"]:checked')?.value || 'بانكا ياكى خەلقئارالىق كارتا';
        const notes = document.getElementById('checkoutCustNotes')?.value.trim() || '';
        const lang = window.appI18n.getLang();

        // ⚠️ تۈركىيە كارگو (پوچتا) تۈركچە ھەرپ تەكشۈرۈش (Alıcı ve Adres Türkçe/Latin harfleri olmalıdır)
        const arabicRegex = /[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        const latinRegex = /[a-zA-ZçğıöşüÇĞİÖŞÜ]/;

        if (arabicRegex.test(name)) {
          showToast('⚠️ كارگو (پوچتا) توغرا يەتكۈزۈشى ئۈچۈن، تاپشۇرۇۋالغۇچىنىڭ ئىسمى چوقۇم تۈركچە (لاتىنچە) يېزىلىشى كېرەك! مەسىلەن: Ahmet Yılmaz', 'warning');
          document.getElementById('checkoutCustName')?.focus();
          return;
        }

        if (!latinRegex.test(name) || name.length < 2) {
          showToast('⚠️ تاپشۇرۇۋالغۇچىنىڭ ئىسمىنى تۈركچە كىرگۈزۈڭ (مەسىلەن: Ahmet Yılmaz)!', 'warning');
          document.getElementById('checkoutCustName')?.focus();
          return;
        }

        const cleanPhone = phone.replace(/[^\d+]/g, '');
        if (cleanPhone.length < 10) {
          showToast('⚠️ تېلېفون نومۇرىنى تولۇق كىرگۈزۈڭ (مەسىلەن: 05XX XXX XX XX)!', 'warning');
          document.getElementById('checkoutCustPhone')?.focus();
          return;
        }

        if (arabicRegex.test(address)) {
          showToast('⚠️ كارگو شىركىتى ئادرېسنى تېپىشى ئۈچۈن تەپسىلىي ئادرېس چوقۇم تۈركچە (لاتىنچە) يېزىلىشى كېرەك! مەسىلەن: Mahalle, Cadde, Sokak, No...', 'warning');
          document.getElementById('checkoutCustAddress')?.focus();
          return;
        }

        if (!latinRegex.test(address) || address.length < 6) {
          showToast('⚠️ تەپسىلىي تۈركچە ئادرېسنى تولۇق كىرگۈزۈڭ (مەھەللە، كوچا، بىنا نومۇرى، ناھىيە)!', 'warning');
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
            proceedOrderCreation(name, phone, city, address, 'بانكا ياكى خەلقئارالىق كارتا (3D Secure مۇۋەپپەقىيەتلىك)', notes, lang);
          }, 800);
          return;
        }

        proceedOrderCreation(name, phone, city, address, payment, notes, lang);
      });

      function proceedOrderCreation(name, phone, city, address, payment, notes, lang) {
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
        const res = window.appStore.createOrder({ name, phone, city, address }, payment, notes, discountVal, lang, instagramGiftData);

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
    try {
      const settings = window.appStore ? window.appStore.getSettings() : {};
      const botToken = (settings && settings.telegramBotToken && settings.telegramBotToken.trim()) || '8880936621:AAG7d5C4CPVyA8XiP0cPYUFYPfJmkF6DWZM';
      const chatId = (settings && settings.telegramChatId && String(settings.telegramChatId).trim()) || '7077223578';

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

    const isWhatsapp = (order.paymentMethod || '').includes('ۋاتساپ') || (order.paymentMethod || '').includes('WhatsApp');
    const isHavale = (order.paymentMethod || '').includes('يۆتكەش') || (order.paymentMethod || '').includes('Havale');
    const isCard = (order.paymentMethod || '').includes('كارتا') || (order.paymentMethod || '').includes('Card');
    const waUrl = isWhatsapp ? getWhatsAppOrderUrl(order, window.appI18n.getLang()) : '';
    const havaleWaUrl = `https://wa.me/905551609999?text=${encodeURIComponent(`ئەسسالامۇئەلەيكۇم تەكلىماكان! زاكاز نومۇرۇم: ${order.id}، بانكىدىن Açıklama غا kuruyemiş دەپ يېزىپ ${order.totalFormatted} پۇلنى ئەۋەتتىم، دەلىل تالونىنى يوللاۋاتىمەن.`)}`;

    let methodDetailsHtml = '';

    if (isCard) {
      methodDetailsHtml = `
        <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: var(--radius-sm); padding: 0.85rem; margin-bottom: 1rem; text-align: right; font-size: 0.86rem; color: #3730a3;">
          <div style="display: flex; align-items: center; gap: 0.4rem; font-weight: 700; margin-bottom: 0.35rem; color: #4338ca;">
            <i class="fas fa-check-circle" style="color: #10b981;"></i> 3D Secure كارتا چىقىمى تەستىقلاندى
          </div>
          <div>پۇل بىخەتەر تۇتۇلدى. رەسمىي ئېلېكترونلۇق تالون ئېلخەتكە يوللاندى.</div>
          <div style="margin-top: 0.4rem; font-family: monospace; font-size: 0.8rem; color: #6366f1;">تەستىق كودى: AUTH-${Math.floor(100000 + Math.random() * 900000)}</div>
        </div>
      `;
    } else if (isHavale) {
      methodDetailsHtml = `
        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: var(--radius-sm); padding: 0.85rem; margin-bottom: 1rem; text-align: right; font-size: 0.86rem; color: #166534;">
          <div style="font-weight: 700; margin-bottom: 0.4rem;"><i class="fas fa-building-columns"></i> پۇل يۆتكەيدىغان رەسمىي بانكا ھېساباتى:</div>
          <div style="background: #ffffff; border: 1px solid #bbf7d0; border-radius: 6px; padding: 0.5rem 0.75rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="font-family: monospace; font-weight: 800; font-size: 0.85rem; direction: ltr;">TR65 0015 7000 0000 0095 1544 93</span>
            <button type="button" class="btn btn-sm" onclick="navigator.clipboard.writeText('TR650015700000000095154493'); showToast('IBAN كۆچۈرۈلدى!', 'success'); this.innerText='كۆچۈرۈلدى ✓';" style="background: #166534; color: #fff; padding: 2px 8px; border: none; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">IBAN كۆچۈرۈش</button>
          </div>
          <div style="font-size: 0.82rem; color: #15803d; margin-bottom: 0.6rem; line-height: 1.6;">
            <strong>بانكا:</strong> QNB Finansbank (Enpara.com)<br>
            <strong>ھېسابات ئىگىسى:</strong> Abudurusuli tuniyazi<br>
            <strong>Açıklama (چۈشەندۈرۈش) قىسمىغا:</strong> <span style="background: #fef08a; color: #854d0e; padding: 2px 8px; border-radius: 4px; font-weight: 800; font-size: 0.95rem;">kuruyemiş</span> دەپ يېزىڭ.
          </div>
          <a href="${havaleWaUrl}" target="_blank" class="btn btn-sm" style="display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: #059669; color: #ffffff; text-decoration: none; padding: 0.55rem; border-radius: 6px; font-weight: 700;">
            <i class="fab fa-whatsapp"></i> دەلىل / تالوننى ۋاتساپتا ئەۋەتىش
          </a>
        </div>
      `;
    }

    const custName = escapeModalHtml(order.customer?.name || '');
    const custPhone = escapeModalHtml(order.customer?.phone || '');
    const custCity = escapeModalHtml(order.customer?.city || '');
    const custAddress = escapeModalHtml(order.customer?.address || '');
    const fullAddressDisplay = (custCity ? custCity + ' ' : '') + custAddress;

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
              <span>تاپشۇرۇۋالغۇچى ئۇچۇرلىرى</span>
            </div>
            <button type="button" onclick="window.toggleSuccessOrderEdit(true)" class="btn btn-sm" style="background: var(--bg-surface); border: 1px solid var(--primary-color); color: var(--primary-color); padding: 3px 10px; border-radius: 6px; font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; font-weight: 700; transition: all 0.2s;">
              <i class="fas fa-user-edit"></i>
              <span>ئۇچۇرنى ئۆزگەرتىش</span>
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
              <span>🎁 تەبرىكلەيمىز! ئىنىستىگېرام ئەگەشكۈچى سوۋغىتى (${escapeModalHtml(order.instagramUser || '@ئەگەشكۈچى')}) زاكاز پوسۇلكىڭىزغا ھەقسىز قوشۇلدى!</span>
            </div>
          ` : ''}
        </div>

        <!-- تەھرىرلەش ھالىتى -->
        <div id="orderSuccessCustomerEdit" style="display: none;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.45rem;">
            <div style="font-weight: 700; color: var(--primary-color); font-size: 0.95rem; display: flex; align-items: center; gap: 0.4rem;">
              <i class="fas fa-edit"></i>
              <span>شەخسىي ئۇچۇرلارنى تەھرىرلەش</span>
            </div>
            <span style="font-size: 0.78rem; color: var(--text-muted);">زاكاز: <strong class="number-latin">${order.id}</strong></span>
          </div>

          <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.65rem; line-height: 1.5;">
            ئىسىم، تېلېفون ياكى ئادرېسىڭىزدا خاتالىق بولسا تۆۋەندە تۈزىتىپ <strong>«ساقلاش»</strong> نى بېسىڭ:
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.55rem; margin-bottom: 0.85rem;">
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.2rem; color: var(--text-main);">ئىسىم فامىلە <span style="color: var(--danger-color);">*</span></label>
              <input type="text" id="succEditName" value="${custName}" class="form-input" placeholder="ئىسمىڭىزنى تولۇق كىرگۈزۈڭ" style="width: 100%; box-sizing: border-box; font-size: 0.88rem; padding: 0.5rem 0.7rem; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-surface); color: var(--text-main);">
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.2rem; color: var(--text-main);">تېلېفون نومۇرى <span style="color: var(--danger-color);">*</span></label>
              <input type="tel" id="succEditPhone" value="${custPhone}" class="form-input number-latin" placeholder="05XXXXXXXXX" style="width: 100%; box-sizing: border-box; font-size: 0.88rem; padding: 0.5rem 0.7rem; direction: ltr; text-align: right; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-surface); color: var(--text-main);">
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.2rem; color: var(--text-main);">شەھەر / رايون</label>
              <input type="text" id="succEditCity" value="${custCity}" class="form-input" placeholder="مەسىلەن: İstanbul / Fatih" style="width: 100%; box-sizing: border-box; font-size: 0.88rem; padding: 0.5rem 0.7rem; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-surface); color: var(--text-main);">
            </div>

            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.2rem; color: var(--text-main);">تەپسىلىي يەتكۈزۈش ئادرېسى <span style="color: var(--danger-color);">*</span></label>
              <textarea id="succEditAddress" class="form-input" rows="2" placeholder="مەھەللە، كوچا، بىنا ۋە ئۆي نومۇرى" style="width: 100%; box-sizing: border-box; font-size: 0.88rem; padding: 0.5rem 0.7rem; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-surface); color: var(--text-main); resize: vertical;">${custAddress}</textarea>
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button type="button" onclick="window.toggleSuccessOrderEdit(false)" class="btn btn-sm" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-muted); padding: 0.45rem 0.9rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">
              بىكار قىلىش
            </button>
            <button type="button" id="succSaveBtn" onclick="window.saveSuccessOrderCustomer('${order.id}')" class="btn btn-sm" style="background: var(--primary-color); border: none; color: #ffffff; padding: 0.45rem 1.15rem; border-radius: 6px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.85rem;">
              <i class="fas fa-save"></i>
              <span>ساقلاش</span>
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
          <i class="fas fa-print"></i> <span>تالوننى بېسىپ چىقىرىش</span>
        </button>
        <button type="button" class="btn-checkout" onclick="document.getElementById('orderSuccessModal').classList.remove('active')" style="flex: 1.2; margin-top: 0; background: var(--primary-color); color: #ffffff;">
          ${window.appI18n.t('continueShopping')}
        </button>
      </div>
    `;

    modal.classList.add('active');
  }

  function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot-indicator');
    if (slides.length <= 1) return;

    let currentSlide = 0;
    let autoTimer = null;

    function activateSlide(index) {
      slides[currentSlide].classList.remove('active');
      if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function startAutoRotation() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        activateSlide(currentSlide + 1);
      }, 5000);
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        activateSlide(idx);
        startAutoRotation();
      });
    });

    startAutoRotation();
  }

  // ==================== 🤝 ۋاكالەتچى ۋە سودىگەرلەر مەركىزى ====================
  function renderAgentPortalModal(lang = 'ug') {
    const modal = document.getElementById('agentPortalModal');
    if (!modal) return;

    const isUg = lang === 'ug';
    const isTr = lang === 'tr';

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
      renderAgentPortalModal(currentL);
      modal.classList.add('active');
      switchTab(defaultTab);
    }

    function closeModal() {
      modal.classList.remove('active');
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

    const btnOpenNav = document.getElementById('agentPortalNavBtn');
    if (btnOpenNav) btnOpenNav.addEventListener('click', handleOpenSubmit);
    if (btnOpenFooter) btnOpenFooter.addEventListener('click', handleOpenModal);
    if (btnOpenMerchantFooter) btnOpenMerchantFooter.addEventListener('click', handleOpenModal);
    if (fLinkAgentPortal) fLinkAgentPortal.addEventListener('click', handleOpenSubmit);
    if (fLinkMerch) fLinkMerch.addEventListener('click', handleOpenModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);

    window.openAgentPortalModal = openModal;
    window.closeAgentPortalModal = closeModal;

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    if (tabBtnApply) tabBtnApply.addEventListener('click', () => switchTab('apply'));
    if (tabBtnSubmit) tabBtnSubmit.addEventListener('click', () => switchTab('submit'));

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

      // 📅 كۈندىلىك مەھسۇلات يوللاش چېكىنى (1 مەھسۇلات/كۈن) يېڭىلاش
      const quotaBadge = document.getElementById('agentDailyQuotaBadge');
      if (quotaBadge && window.appStore && typeof window.appStore.checkAgentDailyProductLimit === 'function') {
        const quota = window.appStore.checkAgentDailyProductLimit(agent.id);
        quotaBadge.style.display = 'inline-block';
        if (!quota.allowed) {
          quotaBadge.textContent = '1/1 توشتى';
          quotaBadge.style.background = '#fee2e2';
          quotaBadge.style.color = '#b91c1c';
          quotaBadge.style.border = '1px solid #fca5a5';
        } else {
          quotaBadge.textContent = '0/1 بۈگۈن';
          quotaBadge.style.background = '#ecfdf5';
          quotaBadge.style.color = '#047857';
          quotaBadge.style.border = '1px solid #a7f3d0';
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
        const isCheckedInToday = agent.lastCheckInDate === todayStr;

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

    function performAgentVerification(val, password = '', isStatusCheckOnly = false) {
      if (!val) {
        showToast('ئېلخەت ياكى تېلېفون نومۇرىنى كىرگۈزۈڭ!', 'warning');
        return;
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
          const categories = window.appStore.getCategories();
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
            verifyMsg.style.padding = '0.75rem';
            verifyMsg.style.borderRadius = '8px';
            verifyMsg.style.border = '1.5px solid #fde68a';
            verifyMsg.innerHTML = `<i class="fas fa-hourglass-half" style="color: #d97706;"></i> <strong>ئىلتىماس ھالىتى:</strong> ${res.message}`;
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
      btnVerify.addEventListener('click', () => {
        const val = loginInput.value.trim();
        const pwInput = document.getElementById('agentLoginPassword');
        const pw = pwInput ? pwInput.value.trim() : '';
        performAgentVerification(val, pw, false);
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
      btnCheckStatus.addEventListener('click', () => {
        const val = loginInput.value.trim();
        if (!val) {
          showToast('سۈرۈشتۈرمەكچى بولغان تېلېفون، ئېلخەت ياكى كودنى كىرگۈزۈڭ!', 'warning');
          loginInput.focus();
          return;
        }
        performAgentVerification(val, '', true);
      });
    }

    if (btnQuickLogin) {
      btnQuickLogin.addEventListener('click', () => {
        try {
          const saved = JSON.parse(localStorage.getItem('teklimakan_agent_session') || 'null');
          if (saved && saved.id) {
            performAgentVerification(saved.id, '', false);
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

    async function triggerAgentPasswordResetFlow(identifier) {
      if (!identifier) {
        if (resetStep1) resetStep1.style.display = 'block';
        if (resetStep2) resetStep2.style.display = 'none';
        if (modalReset) modalReset.classList.add('active');
        if (inputResetId) {
          inputResetId.value = '';
          inputResetId.focus();
        }
        return;
      }

      if (btnSendResetCode) {
        btnSendResetCode.disabled = true;
        btnSendResetCode.innerHTML = '<i class="fas fa-spinner fa-spin"></i> يوللىنىۋاتىدۇ...';
      }
      showToast('ئېلخەتكە پارول ئۇلانمىسى ئەۋەتىلىۋاتىدۇ...', 'info');

      try {
        const res = await window.appStore.requestAgentPasswordReset(identifier);
        if (res.success) {
          currentResetAgentId = res.agentId;

          // 📧 ۋاكالەتچىنىڭ ئېلخېتىگە بىۋاسىتە ئۇلانما ۋە دەلىللەش كودى يوللاش!
          sendEmailAgentPasswordReset(res.agent, res.code, res.resetLink);

          if (resetStep1) resetStep1.style.display = 'none';
          if (resetStep2) resetStep2.style.display = 'block';
          if (modalReset) modalReset.classList.add('active');

          if (resetNoticeBox) {
            resetNoticeBox.innerHTML = `
              <div style="font-weight: 800; margin-bottom: 0.35rem; color: #1e3a8a;">
                <i class="fas fa-check-circle" style="color: #10b981;"></i> پارول ئەسلىگە كەلتۈرۈش ئۇلانمىسى ئەۋەتىلدى!
              </div>
              <div style="font-size: 0.84rem; line-height: 1.6; margin-bottom: 0.4rem;">
                <div><b>ۋاكالەتچى:</b> ${escapeModalHtml(res.agentName || '')} (${escapeModalHtml(res.agentId || '')})</div>
                <div><b>ئېلخەت ئادرېسى:</b> <span class="number-latin" style="font-weight: bold; color: #1d4ed8;">${escapeModalHtml(res.email || res.maskedEmail || '')}</span></div>
              </div>
              <div style="background: #ffffff; border-radius: 8px; border: 1.5px dashed #93c5fd; padding: 0.5rem; text-align: center; margin-top: 0.45rem;">
                <div style="font-size: 0.78rem; color: #475569;">ئېلخېتىڭىزدىكى ئۇلانمىنى باسىڭ ياكى بۇ كودنى ئىشلىتىڭ:</div>
                <div class="number-latin" style="font-weight: 900; font-size: 1.35rem; color: #2563eb; letter-spacing: 5px; margin: 2px 0;">${escapeModalHtml(res.code || '')}</div>
                <small style="color: #64748b; font-size: 0.72rem;">(ئېلخەت كېچىكسە ئېكراندىكى كود بىلەن پارولنى يېڭىلىسىڭىزمۇ بولىدۇ)</small>
              </div>
            `;
          }
          const inputCode = document.getElementById('inputResetCode');
          if (inputCode) {
            inputCode.value = res.code;
          }
          const inputNewPw = document.getElementById('inputResetNewPassword');
          if (inputNewPw) setTimeout(() => inputNewPw.focus(), 250);

          showToast('✅ ئېلخېتىڭىزگە قايتا بېكىتىش ئۇلانمىسى ئەۋەتىلدى!', 'success');
        } else {
          alert(res.message);
          showToast(res.message, 'error');
          if (resetStep1) resetStep1.style.display = 'block';
          if (resetStep2) resetStep2.style.display = 'none';
          if (modalReset) modalReset.classList.add('active');
          if (inputResetId) {
            inputResetId.value = identifier;
            inputResetId.focus();
          }
        }
      } catch(e) {
        console.error('Reset request error:', e);
        showToast('دەلىللەش كودى ئەۋەتىشتە خاتالىق كۆرۈلدى', 'error');
      } finally {
        if (btnSendResetCode) {
          btnSendResetCode.disabled = false;
          btnSendResetCode.innerHTML = '<i class="fas fa-paper-plane"></i> <span>دەلىللەش كودى ئەۋەتىش</span>';
        }
      }
    }

    if (btnForgot && modalReset) {
      btnForgot.addEventListener('click', () => {
        const idVal = loginInput ? loginInput.value.trim() : '';
        if (idVal) {
          triggerAgentPasswordResetFlow(idVal);
        } else {
          if (resetStep1) resetStep1.style.display = 'block';
          if (resetStep2) resetStep2.style.display = 'none';
          modalReset.classList.add('active');
          if (inputResetId) {
            inputResetId.value = '';
            inputResetId.focus();
          }
        }
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
      btnSendResetCode.addEventListener('click', async () => {
        const idVal = inputResetId ? inputResetId.value.trim() : '';
        if (!idVal) {
          showToast('تېلېفون ياكى ئېلخەت كىرگۈزۈڭ!', 'warning');
          if (inputResetId) inputResetId.focus();
          return;
        }
        await triggerAgentPasswordResetFlow(idVal);
      });
    }

    // 🔗 ئېلخەتتىكى ئۇلانما ئارقىلىق بىۋاسىتە كىرگەندە پارول ئۆزگەرتىش كۆزنىكىنى ئېچىش (?reset_agent=...&code=...)
    function checkUrlPasswordResetParams() {
      try {
        const params = new URLSearchParams(window.location.search);
        const agentId = params.get('reset_agent');
        const code = params.get('code');
        if (agentId && code) {
          const agentDrawer = document.getElementById('agentDrawer');
          if (agentDrawer) agentDrawer.classList.add('active');
          const agentBackdrop = document.getElementById('agentDrawerBackdrop');
          if (agentBackdrop) agentBackdrop.classList.add('active');

          currentResetAgentId = agentId;
          const inputCode = document.getElementById('inputResetCode');
          if (inputCode) inputCode.value = code;
          if (resetStep1) resetStep1.style.display = 'none';
          if (resetStep2) resetStep2.style.display = 'block';
          if (resetNoticeBox) {
            resetNoticeBox.innerHTML = `
              <div style="font-weight: 800; margin-bottom: 0.35rem; color: #1e3a8a;">
                <i class="fas fa-check-circle" style="color: #10b981;"></i> ئېلخەت ئۇلانمىسى دەلىللەندى!
              </div>
              <div><b>ۋاكالەتچى كودى:</b> <span class="number-latin">${escapeModalHtml(agentId)}</span></div>
              <div style="margin-top: 0.45rem; padding: 0.45rem; background: #ffffff; border-radius: 6px; border: 1px dashed #93c5fd; text-align: center;">
                <span style="font-size: 0.82rem; color: #2563eb; font-weight: bold;">تۆۋەنگە يېڭى مەخپىي شىفىرىڭىزنى كىرگۈزۈپ جەزملەڭ</span>
              </div>
            `;
          }
          if (modalReset) modalReset.classList.add('active');
          const inputNewPw = document.getElementById('inputResetNewPassword');
          if (inputNewPw) setTimeout(() => inputNewPw.focus(), 300);
        }
      } catch(e) {
        console.warn('checkUrlPasswordResetParams error:', e);
      }
    }
    checkUrlPasswordResetParams();

    if (btnSubmitNewPw) {
      btnSubmitNewPw.addEventListener('click', async () => {
        const code = document.getElementById('inputResetCode')?.value.trim() || '';
        const newPw = document.getElementById('inputResetNewPassword')?.value.trim() || '';
        const confirmPw = document.getElementById('inputResetConfirmPassword')?.value.trim() || '';

        if (!code || !newPw) {
          showToast('بارلىق كىرگۈزۈش رامكىلىرىنى تولدۇرۇڭ!', 'warning');
          return;
        }

        if (newPw.length < 6) {
          showToast('مەخپىي شىفىر كەم دېگەندە 6 خانىلىق بولسۇن!', 'warning');
          return;
        }

        if (newPw !== confirmPw) {
          showToast('ئىككى قېتىم كىرگۈزگەن شىفىر ئوخشاش ئەمەس!', 'error');
          return;
        }

        btnSubmitNewPw.disabled = true;
        btnSubmitNewPw.innerHTML = '<i class="fas fa-spinner fa-spin"></i> يېڭىلىنىۋاتىدۇ...';

        try {
          const devToken = getOrCreateDeviceToken();
          const res = await window.appStore.verifyAndResetAgentPassword(currentResetAgentId, code, newPw, devToken);
          if (res.success) {
            modalReset.classList.remove('active');
            showToast('✅ مەخپىي شىفىر يېڭىلاندى! كىرىۋاتىسىز...', 'success');
            // بىۋاسىتە شۇ ۋاكالەتچى قىلىپ كىرگۈزۈش
            performAgentVerification(currentResetAgentId, newPw, false);
          } else {
            alert(res.message);
            showToast(res.message, 'error');
          }
        } catch(e) {
          console.error('Reset password error:', e);
          showToast('پارولنى يېڭىلاشتا خاتالىق كۆرۈلدى', 'error');
        } finally {
          btnSubmitNewPw.disabled = false;
          btnSubmitNewPw.innerHTML = '<i class="fas fa-check-circle"></i> <span>جەزملەش ۋە كىرىش</span>';
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

    // 🧭 كۆرۈنۈش ئالماشتۇرۇش: «مېنىڭ تاۋارلىرىم»، «تاۋار سۇنۇش جەدۋىلى» ياكى «🔥 كۈندىلىك ئالاھىدە تاۋارلار»
    function switchAgentPortalView(view = 'products') {
      const btnProducts = document.getElementById('btnSwitchToMyProducts');
      const btnSubmit = document.getElementById('btnSwitchToNewProduct');
      const btnFlash = document.getElementById('btnSwitchToFlashDeals');
      const switcherWrap = document.getElementById('agentVerifiedViewSwitcher');
      const myProds = document.getElementById('agentMyProductsWrap');
      const submitForm = document.getElementById('formAgentProductSubmit');
      const flashWrap = document.getElementById('agentFlashDealsWrap');

      if (switcherWrap) switcherWrap.style.display = 'grid';

      [btnProducts, btnSubmit, btnFlash].forEach(b => {
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
        if (submitForm) submitForm.style.display = 'none';
        if (flashWrap) flashWrap.style.display = 'none';
      } else if (view === 'flashDeals') {
        if (btnFlash) {
          btnFlash.style.border = '2px solid #f59e0b';
          btnFlash.style.background = '#fffbeb';
          btnFlash.style.color = '#b45309';
          btnFlash.style.fontWeight = '800';
        }
        if (myProds) myProds.style.display = 'none';
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

    function resetToNewProductMode() {
      if (editProdIdInput) editProdIdInput.value = '';
      if (editBanner) editBanner.style.display = 'none';
      if (submitBtnText) submitBtnText.textContent = 'مەھسۇلاتنى تەستىققا يوللاش';
      if (submitBtnIcon) submitBtnIcon.className = 'fas fa-upload';
      if (formProductSubmit) formProductSubmit.reset();
      if (previewWrap) previewWrap.style.display = 'none';

      const autofillNotice = document.getElementById('agentAutofillNotice');
      if (autofillNotice) autofillNotice.style.display = 'none';
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

      // 📅 كۈندىلىك مەھسۇلات يوللاش چېكىنى تەكشۈرۈش (بۈگۈن 1 تال يېڭى تاۋار يوللىغان بولسا ئەسكەرتىش كۆرسىتىش)
      const dailyLimitBanner = document.getElementById('agentDailyLimitNoticeBanner');
      const submitBtn = document.getElementById('btnAgentSubmitProductAction');
      if (currentVerifiedAgent && window.appStore && typeof window.appStore.checkAgentDailyProductLimit === 'function') {
        const quota = window.appStore.checkAgentDailyProductLimit(currentVerifiedAgent.id);
        if (!quota.allowed) {
          if (dailyLimitBanner) dailyLimitBanner.style.display = 'block';
          if (submitBtn) {
            submitBtn.style.opacity = '0.65';
            submitBtn.title = 'بۈگۈنكى مەھسۇلات يوللاش چېكىڭىز توشتى (1/1). ئەتە يوللىيالايسىز.';
          }
        } else {
          if (dailyLimitBanner) dailyLimitBanner.style.display = 'none';
          if (submitBtn) {
            submitBtn.style.opacity = '1';
            submitBtn.title = '';
          }
        }
      } else {
        if (dailyLimitBanner) dailyLimitBanner.style.display = 'none';
        if (submitBtn) {
          submitBtn.style.opacity = '1';
          submitBtn.title = '';
        }
      }
    }

    // تېز ئالماشتۇرۇش كۇنۇپكىلىرى
    const btnSwitchProducts = document.getElementById('btnSwitchToMyProducts');
    const btnSwitchSubmit = document.getElementById('btnSwitchToNewProduct');
    const btnSwitchFlash = document.getElementById('btnSwitchToFlashDeals');
    const btnQuickAdd = document.getElementById('btnAgentQuickAddProd');
    const btnCopyCode = document.getElementById('btnCopyAgentId');
    const btnRefresh = document.getElementById('btnAgentRefreshData');
    const btnQuickContract = document.getElementById('btnAgentQuickViewContract');
    const btnCheckIn = document.getElementById('btnAgentDailyCheckIn');
    const btnGoBackLimit = document.getElementById('btnGoBackToMyProductsFromLimit');

    if (btnGoBackLimit) {
      btnGoBackLimit.addEventListener('click', () => switchAgentPortalView('products'));
    }

    if (btnSwitchProducts) {
      btnSwitchProducts.addEventListener('click', () => switchAgentPortalView('products'));
    }
    if (btnSwitchSubmit) {
      btnSwitchSubmit.addEventListener('click', () => {
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
    if (btnSwitchFlash) {
      btnSwitchFlash.addEventListener('click', () => switchAgentPortalView('flashDeals'));
    }
    if (btnCheckIn) {
      btnCheckIn.addEventListener('click', () => {
        if (!currentVerifiedAgent) {
          showToast('ئالدى بىلەن كىرىڭ!', 'warning');
          return;
        }
        btnCheckIn.disabled = true;
        btnCheckIn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> تەستىقلىنىۋاتىدۇ...';

        try {
          const res = window.appStore.agentDailyCheckIn(currentVerifiedAgent.id);
          if (res.success) {
            currentVerifiedAgent = res.agent;
            updateAgentDashboard(res.agent);
            showToast(res.message, 'success');
          } else {
            showToast(res.message, res.alreadyCheckedIn ? 'info' : 'error');
            if (currentVerifiedAgent) updateAgentDashboard(currentVerifiedAgent);
          }
        } catch(e) {
          console.error('Daily check-in error:', e);
          showToast('ئىمزا قويۇشتا خاتالىق كۆرۈلدى', 'error');
        }
      });
    }
    if (btnQuickAdd) {
      btnQuickAdd.addEventListener('click', () => {
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
    if (btnAddNewMode) {
      btnAddNewMode.addEventListener('click', () => {
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
        if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.syncProductsFromCloud === 'function') {
          try { await window.TeklimakanSupabase.syncProductsFromCloud(); } catch(e){}
        }
        if (currentVerifiedAgent) {
          updateAgentDashboard(currentVerifiedAgent);
          renderAgentProductsList(currentVerifiedAgent.id);
        }
        setTimeout(() => {
          if (icon) icon.classList.remove('fa-spin');
          showToast('سانلىق مەلۇماتلار بۇلۇتتىن يېڭىلاندى!', 'success');
        }, 500);
      });
    }

    if (btnQuickContract) {
      btnQuickContract.addEventListener('click', () => {
        const btnDownload = document.getElementById('btnDownloadContractBeforeApply');
        if (btnDownload) {
          btnDownload.click();
        } else {
          switchTab('apply');
          const termsBox = document.getElementById('agentContractTermsBox');
          if (termsBox) termsBox.scrollIntoView({ behavior: 'smooth' });
        }
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
            submitBtn.style.opacity = '1';
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
        html += `
          <div class="agent-suggest-item" data-index="${idx}" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.55rem 0.65rem; border-radius: 8px; cursor: pointer; transition: all 0.15s ease; border-bottom: 1px solid #f1f5f9; user-select: none;">
            <img src="${pImg}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 8px; border: 1.5px solid #e2e8f0; flex-shrink: 0;" onerror="this.src='images/default_product.jpg'">
            <div style="flex: 1; min-width: 0;">
              <div style="font-weight: 800; font-size: 0.88rem; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</div>
              <div style="display: flex; align-items: center; gap: 0.45rem; font-size: 0.76rem; color: #64748b; margin-top: 2px;">
                <span style="background: #f1f5f9; padding: 1px 7px; border-radius: 5px; font-weight: 700; color: #334155;">🏷️ ${p.category}</span>
                <span>•</span>
                <span style="color: #2563eb; font-weight: 900; font-size: 0.82rem;">₺${p.price} / ${p.unit || 'دانە'}</span>
                <span>•</span>
                <span style="color: #059669; font-weight: 700;">ماركا: ${p.brand || 'تەكلىماكان'}</span>
              </div>
            </div>
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; padding: 0.35rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; gap: 4px; flex-shrink: 0; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">
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
        setTimeout(() => {
          const val = prodNameInput.value.trim();
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
            alert(quota.message);
            showToast('⚠️ بۈگۈنكى مەھسۇلات يوللاش چېكىڭىز توشتى (1/1). كونا مەھسۇلاتلىرىڭىزنى چەكلىمىسىز تەھرىرلىسىڭىز بولىدۇ.', 'error');
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
    // 1. ئۈسكۈنە سالاھىيىتىنى دەلىللەش
    const isAuth = localStorage.getItem('teklimakan_admin_device') === 'true' ||
                   sessionStorage.getItem('teklimakan_admin_auth') === 'true';

    // 2. ئەگەر سىناق ياكى تۇنجى قېتىم ئاكتىپلاش ئۈچۈن تور ئادرېسىغا ?admin=1 ياكى ?admin=true قوشۇپ ئاچسىمۇ مەڭگۈلۈك ئاكتىپلايدۇ
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' || params.get('admin') === '1') {
      localStorage.setItem('teklimakan_admin_device', 'true');
    }

    const shouldShow = isAuth || localStorage.getItem('teklimakan_admin_device') === 'true';
    const navBtn = document.getElementById('adminSecretNavBtn');
    const floatBadge = document.getElementById('adminFloatingBadge');

    if (shouldShow) {
      if (navBtn) navBtn.style.display = 'none';
      if (floatBadge) floatBadge.style.display = 'inline-flex';
    } else {
      if (navBtn) navBtn.style.display = 'none';
      if (floatBadge) floatBadge.style.display = 'none';
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
  let lastRatesData = {
    usd: 38.50,
    eur: 41.80,
    updatedAt: null
  };

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
    const toggleBtn = document.getElementById('adminLiveChatToggleBtn');
    const chatBox = document.getElementById('adminLiveChatBox');
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
      return [
        {
          id: 'msg-welcome',
          sender: 'admin',
          name: 'ئالىي باشقۇرغۇچى',
          text: 'ئەسسالامۇ ئەلەيكۇم ھۆرمەتلىك خېرىدار! تەكلىماكان سۇپىسىنىڭ ئالىي باشقۇرغۇچىسىغا خۇش كەپسىز. زاكاز، بانكا ھېساباتى، مەھسۇلات ياكى كېلىشىملىك كارگو ھەققىدە قانداق سوئالىڭىز بولسا، تۆۋەندىكى تېز كۇنۇپكىلارنى چەكسىڭىز ياكى بىۋاسىتە ئۇچۇر يازسىڭىز دەرھال ياردەم بېرىمىز!',
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
      messagesContainer.innerHTML = '';

      history.forEach(m => {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${m.sender === 'customer' ? 'customer' : 'admin'}`;
        bubble.innerHTML = `
          <div class="chat-bubble-author">
            <i class="fas ${m.sender === 'customer' ? 'fa-user' : 'fa-crown'}"></i>
            <span>${m.name || (m.sender === 'customer' ? 'سىز' : 'ئالىي باشقۇرغۇچى')}</span>
          </div>
          <div class="chat-bubble-text" style="white-space: pre-wrap;">${safeEscape(m.text)}</div>
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
              showToast('👑 ئالىي باشقۇرغۇچىدىن سىزگە يېڭى ئۇچۇر كەلدى!', 'success');
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
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        const confirmed = confirm('پاراڭ خاتىرىسىنى راستىنلا تازىلىۋېتەمسىز؟\n\nئەسكەرتىش: ئەگەر ئۆچۈرمىسىڭىز، بىر يىلدىن كېيىن كىرسىڭىزمۇ مەزكۇر تور كۆرگۈدە مەڭگۈ ساقلىنىپ تۇرىدۇ.');
        if (confirmed) {
          localStorage.removeItem(CHAT_STORAGE_KEY);
          renderChatMessages();
          showToast('پاراڭ خاتىرىسى تازىلاندى!', 'info');
        }
      });
    }

    // ⚡ تېز سۈرۈشتۈرۈش كۇنۇپكىلىرىنى بىر تەرەپ قىلىش (ئاپتوماتىك سوئال ۋە جاۋاب)
    async function handleQuickAction(actionKey, buttonText) {
      const prof = getCustomerFullProfile();
      const custName = (nameInput && nameInput.value.trim()) || prof.name || 'خېرىدار';
      const custPhone = (phoneInput && phoneInput.value.trim()) || prof.phone || '';

      if (custPhone) localStorage.setItem('teklimakan_customer_phone', custPhone);
      if (custName && custName !== 'خېرىدار') localStorage.setItem('teklimakan_customer_name', custName);

      let questionText = buttonText || 'سۈرۈشتۈرۈش';
      let answerText = '';

      if (actionKey === 'track' || buttonText.includes('زاكاز')) {
        questionText = '📦 زاكاز ئەھۋالىمنى سۈرۈشتۈرمەكچىتىم.';
        answerText = `📦 ھۆرمەتلىك خېرىدار! زاكاز ئەھۋالىڭىزنى سۈرۈشتۈرۈش ئۇسۇللىرى:\n\n1. تور بېكىتىمىزنىڭ ئەڭ ئۈستىدىكى «📦 زاكازلىرىم» كۇنۇپكىسىنى چەكسىڭىز، تېلېفون نومۇرىڭىزنى كىرگۈزۈش ئارقىلىق بىر نەچچە يىل ئىلگىرىكى زاكازلىرىڭىزنىمۇ دەرھال كۆرەلەيسىز.\n\n2. ياكى زاكاز نومۇرىڭىزنى مۇشۇ يەرگە يېزىپ قالدۇرسىڭىز، بىز ئەھۋالىنى دەرھال تەكشۈرۈپ جاۋاب قايتۇرىمىز.`;
      } else if (actionKey === 'bank' || buttonText.includes('بانكا')) {
        questionText = '💳 پۇل تۆلەش ئۈچۈن بانكا IBAN ئۇچۇرىنى بەرسىڭىز.';
        answerText = CORRECT_BANK_TEXT;
      } else if (actionKey === 'cargo' || buttonText.includes('كارگو')) {
        questionText = '🚚 مال قاچان يوللىنىدۇ، كارگو ئەھۋالى قانداق؟';
        answerText = `🚚 ھۆرمەتلىك خېرىدار! بارلىق زاكازلار تەستىقلانغاندىن كېيىن 24 سائەت ئىچىدە كېلىشىملىك تېز يەتكۈزۈش (كارگو) شىركىتىگە تاپشۇرۇلىدۇ.\n\nمال يوللانغان ھامان سىزگە ئاپتوماتىك كارگو ئىز قوغلاش كودى ئۇچۇر قىلىپ يوللىنىدۇ. زاكاز نومۇرىڭىزنى يازسىڭىز، كارگونىڭ ھازىر قەيەرگە كەلگەنلىكىنى تەكشۈرۈپ بېرىمىز.`;
      } else {
        questionText = buttonText;
        answerText = 'ئەسسالامۇ ئەلەيكۇم! سىزنىڭ  ئۇچۇرىڭىزنى تاپشۇرۇپ ئالدۇق ئەڭ قىسقا ۋاقىتتا جاۋاب قايتۇرىمىز...';
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
          name: 'ئالىي باشقۇرغۇچى',
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

      // 3. ئالىي باشقۇرغۇچىنىڭ تېلېگراممىسىغا خېرىدارنىڭ بارلىق تەپسىلىي ئۇچۇرلىرى بىلەن سىگنال ئەۋەتىلىدۇ
      if (window.appStore && typeof window.appStore.sendTelegramAlert === 'function') {
        let orderHistoryBlock = 'تېخى زاكاز بەرمىگەن يېڭى خېرىدار';
        if (prof.ordersCount > 0) {
          orderHistoryBlock = `${prof.ordersCount} قېتىم زاكاز بەرگەن (جەمئىي: ${prof.totalSpent}₺)\n   • ئاخىرقى زاكاز: #${prof.lastOrderId} (${prof.lastOrderStatus || 'تەستىقلاندى'})`;
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
`👤 <b>خېرىدار ئىسمى:</b> <b>${custName}</b>
📱 <b>تېلېفون:</b> <code>${custPhone || 'كىرگۈزمىگەن'}</code>
📍 <b>ئادرېس / رايونى:</b> ${addrBlock}
📦 <b>زاكاز تارىخى:</b> ${orderHistoryBlock}
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

      // ئارقا سۇپىدىكى خېرىدارلار ئۇچۇرىغا ساقلاش
      if (window.appStore && typeof window.appStore.recordCustomerChatMessage === 'function') {
        window.appStore.recordCustomerChatMessage({
          ...clientMsg,
          address: prof.address ? `${prof.city ? prof.city + ' - ' : ''}${prof.address}` : '',
          orderHistory: prof.ordersCount > 0 ? `${prof.ordersCount} زاكاز (${prof.totalSpent}₺)` : '',
          cartInfo: prof.cartItemsCount > 0 ? `${prof.cartItemsCount} تاۋار` : ''
        });
      }
    }

    // 🚀 ئۇچۇر ئەۋەتىش
    async function sendMessage() {
      if (!msgInput) return;
      const text = msgInput.value.trim();
      if (!text) return;

      const prof = getCustomerFullProfile();
      const custName = (nameInput && nameInput.value.trim()) || prof.name || 'خېرىدار';
      const custPhone = (phoneInput && phoneInput.value.trim()) || prof.phone || '';

      if (custPhone) localStorage.setItem('teklimakan_customer_phone', custPhone);
      if (custName && custName !== 'خېرىدار') localStorage.setItem('teklimakan_customer_name', custName);

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

      // 📲 ئالىي باشقۇرغۇچىغا خېرىدارنىڭ بارلىق تەپسىلىي ئۇچۇرلىرى بىلەن سىگنال ئەۋەتىش
      if (window.appStore && typeof window.appStore.sendTelegramAlert === 'function') {
        let orderHistoryBlock = 'تېخى زاكاز بەرمىگەن يېڭى خېرىدار';
        if (prof.ordersCount > 0) {
          orderHistoryBlock = `${prof.ordersCount} قېتىم زاكاز بەرگەن (جەمئىي: ${prof.totalSpent}₺)\n   • ئاخىرقى زاكاز: #${prof.lastOrderId} (${prof.lastOrderStatus || 'تەستىقلاندى'})`;
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
`👤 <b>خېرىدار ئىسمى:</b> <b>${custName}</b>
📱 <b>تېلېفون:</b> <code>${custPhone || 'كىرگۈزمىگەن'}</code>
📍 <b>ئادرېس / رايونى:</b> ${addrBlock}
📦 <b>زاكاز تارىخى:</b> ${orderHistoryBlock}
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
          title: `💬 [جانلىق پاراڭ] ${custName} ئالىي باشقۇرغۇچىغا ئۇچۇر يازدى!`,
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

      // 🤖 ئاپتوماتىك سىپايە جاۋاب
      setTimeout(() => {
        const reply = {
          id: 'admin-auto-reply-' + Date.now(),
          sender: 'admin',
          name: 'ئالىي باشقۇرغۇچى',
          text: 'ئەسسالامۇ ئەلەيكۇم! سىزنىڭ  ئۇچۇرىڭىزنى تاپشۇرۇپ ئالدۇق ئەڭ قىسقا ۋاقىتتا جاۋاب قايتۇرىمىز...',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString('zh-CN'),
          timestamp: Date.now()
        };
        const updated = getChatHistory();
        updated.push(reply);
        saveChatHistory(updated);
        renderChatMessages();
        if (typeof playChime === 'function') playChime('success');
      }, 900);
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
  let lastFlashToggleTime = 0;

  function renderFlashProductsCards() {
    const container = document.getElementById('customerFlashSaleProductsContainer');
    if (!container || !window.appStore) return false;

    const retention = window.appStore.getCustomerRetentionSettings();
    const flash = retention.flashSale || {};
    const prods = window.appStore.getCustomerDailyFlashSaleProducts();
    if (!prods || prods.length === 0) {
      container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #94a3b8; padding: 1.5rem; font-size: 0.9rem;">ھازىرچە ئالاھىدە ئېتىبارلىق تاۋار تۈگىدى.</div>';
      return false;
    }

    container.innerHTML = prods.map(p => {
      const origPrice = p.originalPrice || p.price;
      const flashPrice = p.price;
      const discPct = p.flashDiscountPercent || flash.discountPercentage || 20;

      return `
        <div class="flash-sale-product-card" data-product-id="${p.id}">
          <span class="flash-sale-badge-corner">-%${discPct}</span>
          <div class="flash-sale-card-img-wrap" onclick="openProductQuickView('${p.id}')">
            <img src="${p.image || 'images/default_product.jpg'}" alt="${p.name}" loading="lazy">
          </div>
          <h4 class="flash-sale-card-title" onclick="openProductQuickView('${p.id}')" title="${p.name}">${p.name}</h4>
          <div class="flash-sale-card-prices">
            <span class="flash-sale-price-current">${window.appStore.formatPrice(flashPrice)}</span>
            <span class="flash-sale-price-old">${window.appStore.formatPrice(origPrice)}</span>
          </div>
          <button type="button" class="flash-sale-btn-add" onclick="handleFlashAddToCart('${p.id}')">
            <i class="fas fa-cart-plus"></i> <span>سېۋەتكە سېلىش</span>
          </button>
        </div>
      `;
    }).join('');
    return true;
  }

  window.toggleFlashSaleProducts = function(e) {
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

    const flashTitleEl = document.getElementById('flashSaleBadge');
    if (flashTitleEl && flash.title) flashTitleEl.textContent = flash.title;

    // Render cards into container ahead of time
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
  let luckyWheelRotation = 0;
  let isLuckyWheelSpinning = false;
  let luckyWheelAnimFrame = null;

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

    const titleEl = document.getElementById('luckyWheelModalTitle');
    const subEl = document.getElementById('luckyWheelModalSubtitle');
    if (titleEl && wheelCfg.title) titleEl.textContent = `🎡 ${wheelCfg.title}`;
    if (subEl && wheelCfg.subtitle) subEl.textContent = wheelCfg.subtitle;
    const btnTitleEl = btnOpen.querySelector('.lucky-wheel-btn-title');
    if (btnTitleEl && wheelCfg.title) btnTitleEl.textContent = `🎡 ${wheelCfg.title}`;

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
  }

  function openLuckyWheelModal() {
    const modal = document.getElementById('modalCustomerLuckyWheel');
    if (!modal) return;
    modal.style.display = 'flex';
    modal.classList.add('active');
    drawLuckyWheel(luckyWheelRotation);
    updateLuckyWheelStatusCard();
  }

  function closeLuckyWheelModal() {
    const modal = document.getElementById('modalCustomerLuckyWheel');
    if (!modal) return;
    modal.style.display = 'none';
    modal.classList.remove('active');
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

    const retention = window.appStore.getCustomerRetentionSettings();
    const slices = retention.luckyWheel?.slices || [];
    if (slices.length === 0) return;

    const numSlices = slices.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

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
      ctx.font = 'bold 12px "Microsoft YaHei", sans-serif';
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
    if (!card || !window.appStore) return;

    const check = window.appStore.canCustomerSpinToday();

    if (check.canSpin) {
      if (btnSpin) {
        btnSpin.disabled = false;
        btnSpin.style.opacity = '1';
        btnSpin.style.cursor = 'pointer';
      }
      card.innerHTML = `
        <div style="color: #0f172a; font-weight: 800; font-size: 0.95rem; margin-bottom: 0.25rem;">
          🎁 سىزنىڭ بۈگۈنكى <span style="color: #ef4444;">1 قېتىملىق ھەقسىز</span> پۇرسىتىڭىز بار!
        </div>
        <p style="font-size: 0.8rem; color: #64748b; margin: 0;">ئوتتۇرىدىكى «ئايلاندۇر» كۇنۇپكىسىنى بېسىپ مۇكاپات ئۇتۇۋېلىڭ.</p>
      `;
    } else {
      if (btnSpin) {
        btnSpin.disabled = true;
        btnSpin.style.opacity = '0.6';
        btnSpin.style.cursor = 'not-allowed';
      }
      const last = check.lastSpin || {};
      const hasCoupon = last.couponCode && last.type !== 'none';

      card.innerHTML = `
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 0.75rem; margin-bottom: 0.65rem;">
          <div style="color: #166534; font-weight: 800; font-size: 0.9rem;">
            ✅ بۈگۈنكى ئۇتۇقىڭىز: <span style="color: #047857;">${last.text || 'تەلەيلىك بولۇڭ'}</span>
          </div>
          ${hasCoupon ? `
            <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
              <code class="number-latin" style="background: #ffffff; border: 1px dashed #10b981; color: #047857; font-weight: 800; font-size: 0.95rem; padding: 3px 10px; border-radius: 6px;">${last.couponCode}</code>
              <button type="button" class="btn-primary" onclick="window.applyCustomerCouponToCart('${last.couponCode}')" style="background: #059669; padding: 4px 12px; font-size: 0.8rem; font-weight: 800; border-radius: 6px;">
                <i class="fas fa-shopping-cart"></i> سېۋەتكە ئىشلىتىش
              </button>
            </div>
          ` : ''}
        </div>
        <div style="font-size: 0.82rem; color: #64748b; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
          <i class="fas fa-clock" style="color: #f59e0b;"></i>
          <span>كېيىنكى ھەقسىز پۇرسەتكە قالغان ۋاقىت:</span>
          <strong id="luckyWheelNextCountdown" class="number-latin" style="color: #ef4444; font-weight: 800;">--:--:--</strong>
        </div>
      `;
      startLuckyWheelCountdown();
    }
  }

  let wheelCountdownInterval = null;
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
    const check = window.appStore.canCustomerSpinToday();
    if (!check.canSpin) {
      showToast(check.message, 'info');
      return;
    }

    const retention = window.appStore.getCustomerRetentionSettings();
    const slices = retention.luckyWheel?.slices || [];
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
    if (card) {
      card.innerHTML = `
        <div style="color: #f59e0b; font-weight: 800; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
          <i class="fas fa-spinner fa-spin"></i>
          <span>چاق تېز ئايلانماقتا... تەلەيلىك بولۇڭ!</span>
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

        window.appStore.recordCustomerSpin(winningSlice);
        if (typeof playChime === 'function') playChime('success');

        showWinningCelebration(winningSlice);
      }
    }

    luckyWheelAnimFrame = requestAnimationFrame(animate);
  }

  function showWinningCelebration(slice) {
    const card = document.getElementById('luckyWheelStatusCard');
    if (!card) return;

    const hasCoupon = slice.couponCode && slice.type !== 'none';

    card.innerHTML = `
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%); border: 2px solid #f59e0b; border-radius: 14px; padding: 1rem; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);">
        <div style="font-size: 1.25rem; font-weight: 900; color: #b45309; margin-bottom: 0.35rem;">
          🎉 مۇبارەك بولسۇن!
        </div>
        <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-bottom: 0.65rem;">
          سىز «<span style="color: #ef4444;">${slice.text}</span>» ئۇتتىڭىز!
        </div>
        ${hasCoupon ? `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.6rem; margin-top: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <code class="number-latin" style="background: #ffffff; border: 1.5px dashed #f59e0b; color: #b45309; font-weight: 900; font-size: 1.15rem; padding: 4px 14px; border-radius: 8px; letter-spacing: 1px;">${slice.couponCode}</code>
              <button type="button" class="btn-primary" onclick="navigator.clipboard?.writeText('${slice.couponCode}'); showToast('📋 كۇپون كودى كۆچۈرۈلدى!', 'success');" style="background: #64748b; padding: 5px 10px; font-size: 0.8rem;">
                <i class="fas fa-copy"></i> كۆچۈرۈش
              </button>
            </div>
            <button type="button" class="btn-primary" onclick="window.applyCustomerCouponToCart('${slice.couponCode}')" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); width: 100%; padding: 0.65rem; font-weight: 900; font-size: 0.95rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
              <i class="fas fa-cart-arrow-down"></i> دەرھال سېۋەتكە ئىشلىتىش (Use in Cart)
            </button>
          </div>
        ` : `
          <p style="font-size: 0.85rem; color: #64748b; margin: 0;">بۈگۈن پۇرسىتىڭىز ئوڭدىن كەلمىدى، ئەتىگە چوقۇم يەنە كۆرۈشەيلى!</p>
        `}
      </div>
    `;

    showToast(`🎉 ئامەت چاقى: سىز ${slice.text} ئۇتتىڭىز!`, 'success');
  }

  window.showToast = showToast;
  window.openTrackOrderModal = openTrackOrderModal;
  window.doTrackOrder = doTrackOrder;
  window.openQuickView = openQuickView;
  window.checkUrlForProduct = checkUrlForProduct;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTeklimakanApp);
} else {
  initTeklimakanApp();
}
