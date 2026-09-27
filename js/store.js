/**
 * ================================================================
 * مەركىزىي سانلىق مەلۇمات ئامبىرى ۋە ھالەت باشقۇرغۇچ (Store.js)
 * تىل، پۇل بىرلىكى (₺ لىرا ۋە $ دوللار)، ماركا نامى ۋە زاكازلار
 * ================================================================
 */

const STORAGE_KEYS = {
  PRODUCTS: 'teklimakan_ecom_products_v12',
  USER_EDITS: 'teklimakan_ecom_user_edits_v1',
  DELETED_PRODUCTS: 'teklimakan_ecom_deleted_products_v1',
  DELETED_AGENTS: 'teklimakan_ecom_deleted_agents_v1',
  ORDERS: 'teklimakan_ecom_orders_v4',
  CATEGORIES: 'teklimakan_ecom_categories_v8',
  BRANDS: 'teklimakan_ecom_brands_v4',
  AGENTS: 'teklimakan_ecom_agents_v1',
  REPUTATION_BADGES: 'teklimakan_ecom_reputation_badges_v1',
  CART: 'teklimakan_ecom_cart_v4',
  WISHLIST: 'teklimakan_ecom_wishlist_v4',
  SETTINGS: 'teklimakan_ecom_settings_v4',
  CURRENCY: 'teklimakan_currency_preference',
  SMS_HISTORY: 'teklimakan_ecom_sms_history_v1',
  COUPONS: 'teklimakan_ecom_coupons_v1'
};

// دەسلەپكى ئېتىبار كۇپونلىرى (Initial Coupons)
const INITIAL_COUPONS = [
  {
    code: 'TEKLIMAKAN10',
    type: 'percentage',
    value: 10,
    minSpend: 200,
    expireDate: '2027-12-31',
    usageLimit: 500,
    usedCount: 38,
    isActive: true,
    description: 'تەكلىماكان سۇپىسىنىڭ 10% لىك رەسمىي ئېتىبار كۇپونى'
  },
  {
    code: 'BAHAR2026',
    type: 'fixed',
    value: 50,
    minSpend: 350,
    expireDate: '2026-12-31',
    usageLimit: 200,
    usedCount: 14,
    isActive: true,
    description: 'باھار پەسلى ₺50 نەق پۇل ئېتىبار كارتىسى'
  },
  {
    code: 'TEKLIMAKAN50',
    type: 'fixed',
    value: 50,
    minSpend: 250,
    expireDate: '2028-12-31',
    usageLimit: 10000,
    usedCount: 0,
    isActive: true,
    description: 'تېلېفون ئەسكەرتىشىنى قوزغاتقان خېرىدارلارغا ₺50 سوۋغات كۇپونى'
  },
  {
    code: 'NEWUSER',
    type: 'percentage',
    value: 15,
    minSpend: 150,
    expireDate: '2027-06-30',
    usageLimit: 1000,
    usedCount: 82,
    isActive: true,
    description: 'يېڭى خېرىدارلارغا 15% ئەلا كۇپون'
  },
  {
    code: 'LUCKY10',
    type: 'fixed',
    value: 10,
    minSpend: 100,
    expireDate: '2028-12-31',
    usageLimit: 100000,
    usedCount: 15,
    isActive: true,
    description: '🎡 ئامەت چاقى ₺10 ئېتىبار كۇپونى'
  },
  {
    code: 'LUCKY20',
    type: 'fixed',
    value: 20,
    minSpend: 200,
    expireDate: '2028-12-31',
    usageLimit: 100000,
    usedCount: 9,
    isActive: true,
    description: '🎡 ئامەت چاقى ₺20 ئېتىبار كۇپونى'
  },
  {
    code: 'LUCKY50',
    type: 'fixed',
    value: 50,
    minSpend: 400,
    expireDate: '2028-12-31',
    usageLimit: 100000,
    usedCount: 3,
    isActive: true,
    description: '🎡 ئامەت چاقى ₺50 كاتتا سوۋغات كۇپونى'
  },
  {
    code: 'LUCKYFREE',
    type: 'free_shipping',
    value: 35,
    minSpend: 150,
    expireDate: '2028-12-31',
    usageLimit: 100000,
    usedCount: 12,
    isActive: true,
    description: '🎡 ئامەت چاقى ھەقسىز يەتكۈزۈش (كارگو) كۇپونى'
  },
  {
    code: 'LUCKY5PCT',
    type: 'percentage',
    value: 5,
    minSpend: 50,
    expireDate: '2028-12-31',
    usageLimit: 100000,
    usedCount: 22,
    isActive: true,
    description: '🎡 ئامەت چاقى %5 پۈتۈن دۇكان ئېتىبارى'
  }
];

// دەسلەپكى سودىگەر ئىناۋەت بەلگىلىرى (ئۆزىگە خاس خەت رەڭگى ۋە ئۇسلۇبى بىلەن)
const INITIAL_REPUTATION_BADGES = [
  {
    id: 'rep-trusted',
    name: 'ئىشەنچىلىك سودىگەر',
    textColor: '#059669',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    icon: 'fa-check-circle'
  },
  {
    id: 'rep-new',
    name: 'يېڭى باشلىغان سودىگەر',
    textColor: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    icon: 'fa-seedling'
  },
  {
    id: 'rep-gold',
    name: 'ئالتۇن دەرىجىلىك سودىگەر',
    textColor: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    icon: 'fa-medal'
  },
  {
    id: 'rep-diamond',
    name: 'ئالماس دەرىجىلىك مىراس دۇكان',
    textColor: '#7c3aed',
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
    icon: 'fa-gem'
  },
  {
    id: 'rep-official',
    name: 'رەسمىي سۇپا دۇكىنى',
    textColor: '#e11d48',
    bgColor: '#fff1f2',
    borderColor: '#fecdd3',
    icon: 'fa-shield-check'
  }
];

// دەسلەپكى تىزىملاتقان ۋاكالەتچىلەر ۋە ماركا ھوقۇقلىرى (Initial Vendors/Agents)
const INITIAL_AGENTS = [
  {
    id: 'AGT-101',
    name: 'ئەلىجان روزى',
    email: 'alijan@teklimakan.com',
    phone: '05550000101',
    city: 'ئىستانبۇل (فاتىھ)',
    status: 'تەستىقلاندى', // 'تەستىقلاندى', 'تەستىق كۈتۈۋاتىدۇ', 'توختىتىلدى'
    reputation: 'ئىشەنچىلىك سودىگەر',
    canPublishMultilingual: false,
    authorizedBrands: ['تەكلىماكان كىلاسسىك', 'خوتەن مىراس'],
    registeredAt: '2026-08-15',
    authExpireDate: '2027-08-15',
    certCode: 'TK-CERT-2026-101',
    productsCount: 6,
    salesTotal: 54200,
    monthlySales: 19800,
    monthlyOrders: 28,
    commissionRate: 15,
    violationsCount: 0,
    suspendedUntil: null,
    suspensionReason: ''
  },
  {
    id: 'AGT-102',
    name: 'سەلىم يىلماز',
    email: 'selim@teklimakan.com',
    phone: '05321112233',
    city: 'ئەنقەرە (چانکايالىق)',
    status: 'تەستىقلاندى',
    reputation: 'ئالتۇن دەرىجىلىك سودىگەر',
    canPublishMultilingual: false,
    authorizedBrands: ['Rize Çay Evi', 'TecnoPro Audio'],
    registeredAt: '2026-08-20',
    authExpireDate: '2027-08-20',
    certCode: 'TK-CERT-2026-102',
    productsCount: 4,
    salesTotal: 34500,
    monthlySales: 11200,
    monthlyOrders: 18,
    commissionRate: 15,
    violationsCount: 0,
    suspendedUntil: null,
    suspensionReason: ''
  },
  {
    id: 'AGT-103',
    name: 'مەريەم كېرەم',
    email: 'meryem@teklimakan.com',
    phone: '05443334455',
    city: 'بۇرسا (نىلۈفەر)',
    status: 'تەستىق كۈتۈۋاتىدۇ',
    reputation: 'يېڭى باشلىغان سودىگەر',
    canPublishMultilingual: false,
    authorizedBrands: ['تۇرپان يېشىل'],
    registeredAt: '2026-09-02',
    authExpireDate: '2027-09-02',
    certCode: 'TK-CERT-2026-103',
    productsCount: 2,
    salesTotal: 8600,
    monthlySales: 3400,
    monthlyOrders: 5,
    commissionRate: 10,
    violationsCount: 0,
    suspendedUntil: null,
    suspensionReason: ''
  },
  {
    id: 'AGT-104',
    name: 'Ablikim Uyghur',
    email: 'ablikim@teklimakan.com',
    phone: '05559998877',
    city: 'ئىستانبۇل (زەيتىنبۇرنۇ)',
    status: 'تەستىقلاندى',
    reputation: 'ئىشەنچىلىك سودىگەر',
    canPublishMultilingual: false,
    authorizedBrands: ['تەكلىماكان كىلاسسىك', 'SilkRoad Press'],
    registeredAt: '2026-09-10',
    authExpireDate: '2027-09-10',
    certCode: 'TK-CERT-2026-104',
    productsCount: 3,
    salesTotal: 28900,
    monthlySales: 14600,
    monthlyOrders: 21,
    commissionRate: 15,
    violationsCount: 0,
    suspendedUntil: null,
    suspensionReason: ''
  }
];

// پۇل بىرلىكى نىسبەتلىرى (ئاساسىي پۇل بىرلىكى: تۈرك لىراسى ₺)
const CURRENCY_RATES = {
  'TRY': { symbol: '₺', rate: 1.0, freeThreshold: 1000, name: 'Lira (₺)' },
  'USD': { symbol: '$', rate: 0.029, freeThreshold: 30, name: 'Dollar ($)' }
};

// داڭلىق ماركىلار تىزىملىكى (تىرناقسىز ساپ ئۇيغۇرچە نامى)
const INITIAL_BRANDS = [
  'بارلىق ماركىلار',
  'تەكلىماكان كىلاسسىك',
  'خوتەن مىراس',
  'تۇرپان يېشىل',
  'ئىلى ئورگانىك',
  'قەشقەر قەدىمىي',
  'TecnoPro Audio',
  'Rize Çay Evi',
  'SilkRoad Press'
];

// دەسلەپكى تاۋارلار تىزىملىكى (ئادەم، قول، تىرناق، بەدەن رەسىمى يوق ساپ مەھسۇلات سۈرەتلىرى)
const INITIAL_PRODUCTS = [
  {
    id: 'PRD-908',
    brand: 'تەكلىماكان كىلاسسىك',
    languageScope: 'all',
    name: 'ياڭاق',
    category: 'ئۆسۈملۈك دورىلار',
    price: 2400,
    oldPrice: 2800,
    unit: 'دانە',
    stock: 30,
    sales: 24,
    rating: 5.0,
    ratingCount: 18,
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
    description: 'تەبىئىي، تاللانغان ئەلا سۈپەتلىك نېپىز قېپى تەبىئىي ياڭاق.',
    translations: {
      ug: {
        name: 'ياڭاق',
        category: 'ئۆسۈملۈك دورىلار',
        description: 'تەبىئىي، تاللانغان ئەلا سۈپەتلىك نېپىز قېپى تەبىئىي ياڭاق.'
      },
      tr: {
        name: 'Doğal İnce Kabuklu Ceviz',
        category: 'Bitkisel İlaçlar',
        description: 'Doğal, seçkin ve lezzetli ince kabuklu ceviz.'
      },
      en: {
        name: 'Organic Thin Shell Walnuts',
        category: 'Herbal Remedies',
        description: 'Premium hand-picked thin-shell organic walnuts.'
      }
    },
    badge: 'ئەڭ ياخشى سېتىلغان',
    featured: true,
    approvalStatus: 'تەستىقلاندى',
    merchantBadge: 'ئىشەنچىلىك سودىگەر'
  },
  {
    id: 'PRD-100',
    brand: 'تەكلىماكان تىبابىتى',
    languageScope: 'all',
    name: 'تەبىئىي شىپالىق پىننە گۈلقەنتى 1kg (ئاشقازان ۋە ھەزىمگە مەنپەئەتلىك)',
    category: 'ئۇيغۇر تىبابىتى',
    price: 888,
    oldPrice: 1200,
    unit: 'دانە',
    stock: 45,
    sales: 128,
    rating: 5.0,
    ratingCount: 76,
    image: 'images/pinne_gulghent.jpg',
    description: 'ئۇيغۇر مىللىي تېبابىتىنىڭ ئەنئەنىۋى مىراس رېتسېپى بويىچە ساپ يالپۇز (پىننە) يوپۇرمىقى ۋە تەبىئىي گۈللەر شىرنىسىدىن ئېتىلگەن. ئاشقازان ۋە ھەزىمنى كۈچەيتىدۇ، چىشنى ساقلاملاشتۇرۇشقا ياردەم بېرىدۇ، يەلنى ھەيدەپ ئىسسىقنى تارقىتىدۇ. ساپ ئېغىرلىقى 1 كىلوگرام.',
    translations: {
      ug: {
        name: 'تەبىئىي شىپالىق پىننە گۈلقەنتى 1kg (ئاشقازان ۋە ھەزىمگە مەنپەئەتلىك)',
        category: 'ئۇيغۇر تىبابىتى',
        description: 'ئۇيغۇر تېبابىتىنىڭ ئەنئەنىۋى رېتسېپى بويىچە تەييارلانغان ساپ يالپۇز گۈلقەنتى. ئاشقازان ۋە ھەزىمنى كۈچەيتىدۇ، چىش ساقلاملىقىغا پايدىلىق، يەلنى ھەيدەيدۇ. ساپ 1 كىلوگرام.'
      },
      tr: {
        name: 'Doğal Şifalı Nane Gülkenti 1kg (Uygur Tıbbı)',
        category: 'Uygur Tıbbı',
        description: 'Geleneksel Uygur tıbbı formülüyle taze nane ve gül özlerinden hazırlanan şifalı macun. Mideyi rahatlatır, sindirimi güçlendirir ve ferahlık verir. Net ağırlık: 1 kg.'
      },
      en: {
        name: 'Natural Healing Mint Gulkand Paste 1kg (Uyghur Medicine)',
        category: 'Uyghur Medicine',
        description: 'Traditional Uyghur holistic medicine formula made of pure mint and organic rose petals. Aids digestion, relieves gas, soothes the stomach, and promotes oral wellness. Net: 1kg.'
      }
    },
    badge: 'تەۋسىيە',
    featured: true,
    approvalStatus: 'تەستىقلاندى',
    merchantBadge: 'ئالتۇن دەرىجىلىك'
  },
  {
    id: 'PRD-101',
    brand: 'خوتەن مىراس',
    languageScope: 'all',
    name: 'تەبىئىي ئەلا سۈپەتلىك خوتەن قاشتېشى بىلەزۈكى',
    category: 'ئۇيغۇر تىبابىتى',
    price: 880,
    oldPrice: 1200,
    stock: 12,
    sales: 45,
    rating: 4.9,
    ratingCount: 38,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    description: 'خوتەن تاش قاش دەرياسىنىڭ ساپ تاش قاشتېشىدىن نەپىس پىششىقلاپ ئىشلەنگەن، ھۆسن تۈزەش ۋە مىللىي گۈزەللىككە لايىھەلەنگەن ھۆسن-بۇيۇم.',
    translations: {
      ug: {
        name: 'تەبىئىي ئەلا سۈپەتلىك خوتەن قاشتېشى بىلەزۈكى',
        category: 'ئۇيغۇر تىبابىتى',
        description: 'خوتەن تاش قاش دەرياسىنىڭ ساپ تاش قاشتېشىدىن نەپىس پىششىقلاپ ئىشلەنگەن، ھۆسن تۈزەش ۋە مىللىي گۈزەللىككە لايىھەلەنگەن ھۆسن-بۇيۇم.'
      },
      tr: {
        name: 'Doğal Birinci Sınıf Hoten Yeşim Taşı Bileziği',
        category: 'Uygur Tıbbı',
        description: 'Hoten nehirlerinden çıkarılan hakiki beyaz yeşim taşından ustalıkla işlenmiş geleneksel ve zarif bilezik.'
      },
      en: {
        name: 'Authentic Hotan Natural Nephrite Jade Bangle',
        category: 'Uyghur Medicine',
        description: 'Handcrafted from genuine white nephrite jade sourced from the historic Yurungkash River of Hotan.'
      }
    },
    badge: 'ئەڭ قىزىق',
    featured: true
  },
  {
    id: 'PRD-102',
    brand: 'تەكلىماكان كىلاسسىك',
    languageScope: 'all',
    name: 'ئەنئەنىۋى ئەلا سۈپەتلىك ساپ يىپەك ئەتلەس تاۋارى',
    category: 'پىششىق دورىلار',
    price: 380,
    oldPrice: 480,
    stock: 28,
    sales: 120,
    rating: 4.8,
    ratingCount: 94,
    image: 'https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?auto=format&fit=crop&w=800&q=80',
    description: 'ساپ تەبىئىي يىپەكتىن ئەنئەنىۋى مىللىي نەقىشلەر بويىچە نەپىس پىششىقلاپ توقۇلغان قىممەتلىك خان ئەتلەس رەختى.',
    translations: {
      ug: {
        name: 'ئەنئەنىۋى ئەلا سۈپەتلىك ساپ يىپەك ئەتلەس تاۋارى',
        category: 'پىششىق دورىلار',
        description: 'ساپ تەبىئىي يىپەكتىن ئەنئەنىۋى مىللىي نەقىشلەر بويىچە نەپىس پىششىقلاپ توقۇلغان قىممەتلىك خان ئەتلەس رەختى.'
      },
      tr: {
        name: 'Geleneksel Saf İpek El Dokuma Atlas Kumaşı',
        category: 'Hazır & İşlenmiş İlaçlar',
        description: 'Geleneksel doğal ipekten el tezgâhında dokunmuş zengin desenli zarif atlas ipek kumaş.'
      },
      en: {
        name: 'Traditional 100% Pure Handwoven Silk Etles Textile',
        category: 'Prepared Medicines',
        description: 'Exquisitely handcrafted pure mulberry silk fabric featuring vibrant authentic Central Asian motifs.'
      }
    },
    badge: 'ئېتىباردا',
    featured: true
  },
  {
    id: 'PRD-103',
    brand: 'تۇرپان يېشىل',
    languageScope: 'all',
    name: 'تۇرپان يېشىل ئۈزۈمى 1kg',
    category: 'قۇرۇق يەل-يېمىشلەر',
    price: 650,
    oldPrice: 750,
    unit: 'كىلو',
    stock: 150,
    sales: 580,
    rating: 5.0,
    ratingCount: 215,
    image: 'images/products/PRD-103.jpg',
    description: 'تۇرپان ئۈزۈمچىلىك بازىسىنىڭ شامال كۈپىدە تەبىئىي قۇرۇتۇلغان ساپ يېشىل رەڭلىك، تاتلىق ھەم مېغىزلىق كىشمىش ئۈزۈمى.',
    translations: {
      ug: {
        name: 'تۇرپان يېشىل ئۈزۈمى 1kg',
        category: 'قۇرۇق يەل-يېمىشلەر',
        unit: 'كىلو',
        description: 'تۇرپان ئۈزۈمچىلىك بازىسىنىڭ شامال كۈپىدە تەبىئىي قۇرۇتۇلغان ساپ يېشىل رەڭلىك، تاتلىق ھەم مېغىزلىق كىشمىش ئۈزۈمى.'
      },
      tr: {
        name: 'Turpan Doğal Yeşil Çekirdeksiz Kuru Üzüm 1kg',
        category: 'Kuru Meyve & Yemişler',
        unit: 'Kilo',
        description: 'Turpan vadisinde rüzgar kurutma kulelerinde doğal olarak kurutulmuş tatlı yeşil çekirdeksiz üzüm.'
      },
      en: {
        name: 'Premium Turpan Naturally Dried Green Seedless Raisins 1kg',
        category: 'Dried Fruits & Nuts',
        unit: 'kg',
        description: 'Sun-and-wind cured green raisins from the famous Turpan Depression vineyards.'
      }
    },
    badge: 'تەۋسىيە',
    featured: true
  },
  {
    id: 'PRD-104',
    brand: 'TecnoPro Audio',
    languageScope: 'all',
    name: 'شاۋقۇنسىز سىمسىز Bluetooth ئەقلىي قۇلاقلىق Pro',
    category: 'پىششىق دورىلار',
    price: 299,
    oldPrice: 429,
    stock: 35,
    sales: 89,
    rating: 4.7,
    ratingCount: 56,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    description: 'ئىلغار ئاكتىپ شاۋقۇن پەسەيتىش (ANC) تېخنىكىسى، Hi-Fi يۇقىرى ئاۋاز سۈپىتى، 36 سائەت توك ساقلاش ئىقتىدارى بار.',
    translations: {
      ug: {
        name: 'شاۋقۇنسىز سىمسىز Bluetooth ئەقلىي قۇلاقلىق Pro',
        category: 'پىششىق دورىلار',
        description: 'ئىلغار ئاكتىپ شاۋقۇن پەسەيتىش (ANC) تېخنىكىسى، Hi-Fi يۇقىرى ئاۋاز سۈپىتى، 36 سائەت توك ساقلاش ئىقتىدارى بار.'
      },
      tr: {
        name: 'Gürültü Önleyici Kablosuz Bluetooth Kulaklık Pro',
        category: 'Hazır & İşlenmiş İlaçlar',
        description: 'Gelişmiş Aktif Gürültü Engelleme (ANC), Hi-Fi üstün ses deneyimi ve 36 saat pil ömrü.'
      },
      en: {
        name: 'Active Noise Cancelling Wireless Bluetooth Headphones Pro',
        category: 'Prepared Medicines',
        description: 'Advanced ANC hybrid noise reduction, high-fidelity acoustics and 36-hour extended battery life.'
      }
    },
    badge: 'يېڭى كەلگەن',
    featured: true
  },
  {
    id: 'PRD-105',
    brand: 'Rize Çay Evi',
    languageScope: 'tr',
    name: 'Özel Seri Saf Türk Çayı ve Demlik Seti',
    category: 'ئۇيغۇر تىبابىتى',
    price: 185,
    oldPrice: 240,
    stock: 20,
    sales: 42,
    rating: 4.9,
    ratingCount: 28,
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
    description: 'Karadeniz Rize yaylalarından toplanan birinci kalite çay ve çift katlı paslanmaz çelik çaydanlık seti.',
    translations: {
      tr: {
        name: 'Özel Seri Saf Türk Çayı ve Demlik Seti',
        category: 'Uygur Tıbbı',
        description: 'Karadeniz Rize yaylalarından toplanan birinci kalite çay ve çift katlı paslanmaz çelik çaydanlık seti.'
      },
      ug: {
        name: 'تۈركىيە رىزە ئالىي سۈپەتلىك قارا چاي ۋە چەينەك يۈرۈشلۈكى',
        category: 'ئۇيغۇر تىبابىتى',
        description: 'قارا دېڭىز رايونىنىڭ تەبىئىي قارا چاي مېۋىسى ۋە داتلاشماس پولات چەينەك توپلىمى.'
      },
      en: {
        name: 'Special Turkish Tea & Double Teapot Service Set',
        category: 'Uyghur Medicine',
        description: 'Authentic high altitude tea paired with double stainless steel teapot set.'
      }
    },
    badge: 'تەۋسىيە',
    featured: false
  },
  {
    id: 'PRD-106',
    brand: 'SilkRoad Press',
    languageScope: 'en',
    name: 'Silk Road Heritage Illustrated Hardcover Album',
    category: 'كىتاپ ۋە مەدەنىيەت',
    price: 168,
    oldPrice: 210,
    stock: 25,
    sales: 31,
    rating: 5.0,
    ratingCount: 19,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    description: 'Comprehensive historical and cultural album exploring ancient oasis cities and architectural masterworks.',
    translations: {
      en: {
        name: 'Silk Road Heritage Illustrated Hardcover Album',
        category: 'Books & Culture',
        description: 'Comprehensive historical and cultural album exploring ancient oasis cities and architectural masterworks.'
      },
      ug: {
        name: 'يىپەك يولى مەدەنىيىتى قىممەتلىك رەسىملىك قامۇسى',
        category: 'كىتاپ ۋە مەدەنىيەت',
        description: 'قەدىمىي ۋاھەلەر، قول ھۈنەرۋەنچىلىك ۋە تارىخىي ئىزنالار توپلانغان قىممەتلىك قامۇس.'
      },
      tr: {
        name: 'İpek Yolu Kültürel Miras Resimli Ansiklopedi',
        category: 'Kitap & Kültür',
        description: 'Tarihi İpek Yolu medeniyetleri ve el sanatlarını anlatan lüks ciltli ansiklopedi.'
      }
    },
    badge: '',
    featured: false
  },
  {
    id: 'PRD-107',
    brand: 'خوتەن مىراس',
    languageScope: 'all',
    name: 'ئەنئەنىۋى خوتەن ساپ يۇڭ قول گىلىمى',
    category: 'پىششىق دورىلار',
    price: 1850,
    oldPrice: 2400,
    stock: 8,
    sales: 19,
    rating: 5.0,
    ratingCount: 15,
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
    description: 'تەبىئىي ئۆسۈملۈك بويىقى بىلەن بويالغان ساپ قوي يۇڭىدىن خوتەن پېشقەدەم ئۇستىلىرى قولدا توقىغان گۈزەل ئۆي گىلىمى.',
    translations: {
      ug: {
        name: 'ئەنئەنىۋى خوتەن ساپ يۇڭ قول گىلىمى',
        category: 'پىششىق دورىلار',
        description: 'تەبىئىي ئۆسۈملۈك بويىقى بىلەن بويالغان ساپ قوي يۇڭىدىن خوتەن پېشقەدەم ئۇستىلىرى قولدا توقىغان گۈزەل ئۆي گىلىمى.'
      },
      tr: {
        name: 'Geleneksel Hoten Saf Yün El Dokuma Halısı',
        category: 'Hazır & İşlenmiş İlaçlar',
        description: 'Kök boya ve saf koyun yününden usta ellerde dokunmuş tarihi desenli el halısı.'
      },
      en: {
        name: 'Traditional Hotan Hand-Knotted Pure Wool Carpet',
        category: 'Prepared Medicines',
        description: 'Masterfully knotted pure virgin sheep wool carpet dyed with traditional plant pigments.'
      }
    },
    badge: 'ئەڭ قىزىق',
    featured: true
  },
  {
    id: 'PRD-108',
    brand: 'تەكلىماكان كىلاسسىك',
    languageScope: 'all',
    name: 'تەبىئىي ساپ زەيتۇن مېيى ۋە ئەتىرگۈل سوپۇن توپلىمى',
    category: 'گۈزەللىك ۋە ساغلاملىق',
    price: 75,
    oldPrice: 95,
    stock: 90,
    sales: 310,
    rating: 4.9,
    ratingCount: 88,
    image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80',
    description: 'خوتەن ئەتىرگۈلى مېيى ۋە سوغۇق پىرىسلانغان زەيتۇن مېيىدىن پىششىقلاپ ئىشلەنگەن، ھېچقانداق خىمىيىلىك قوشۇلمىسىز تەبىئىي تازىلىق بۇيۇمى.',
    translations: {
      ug: {
        name: 'تەبىئىي ساپ زەيتۇن مېيى ۋە ئەتىرگۈل سوپۇن توپلىمى',
        category: 'گۈزەللىك ۋە ساغلاملىق',
        description: 'خوتەن ئەتىرگۈلى مېيى ۋە سوغۇق پىرىسلانغان زەيتۇن مېيىدىن پىششىقلاپ ئىشلەنگەن، ھېچقانداق خىمىيىلىك قوشۇلمىسىز تەبىئىي تازىلىق بۇيۇمى.'
      },
      tr: {
        name: 'Doğal Zeytinyağlı Gül Özlü El Yapımı Sabun Seti',
        category: 'Güzellik & Sağlık',
        description: 'Doğal zeytinyağı ve Hoten gül özüyle hazırlanmış kimyasal içermeyen el yapımı banyo sabunu.'
      },
      en: {
        name: 'Artisanal Extra Virgin Olive Oil & Rose Essential Soap Set',
        category: 'Beauty & Health',
        description: 'Handcrafted cold-processed organic soaps infused with fragrant oasis damask rose essence.'
      }
    },
    badge: 'تەۋسىيە',
    featured: true
  },
  {
    id: 'PRD-109',
    brand: 'تۇرپان يېشىل',
    languageScope: 'all',
    name: 'ئەلا سۈپەتلىك نېپىز پوستلۇق ئاقسۇ قەغەز ياڭىقى 1kg',
    category: 'ئۆسۈملۈك دورىلار',
    price: 65,
    oldPrice: 85,
    stock: 120,
    sales: 430,
    rating: 4.8,
    ratingCount: 160,
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80',
    description: 'قول بىلەن ئوڭاي چاقىلىدىغان قەغەز پوستلۇق ياڭاق، مېغىزى ئاق ھەم مايلىق، تەبىئىي ئوزۇقلۇق قىممىتى يۇقىرى.',
    translations: {
      ug: {
        name: 'ئەلا سۈپەتلىك نېپىز پوستلۇق ئاقسۇ قەغەز ياڭىقى 1kg',
        category: 'ئۆسۈملۈك دورىلار',
        description: 'قول بىلەن ئوڭاي چاقىلىدىغان قەغەز پوستلۇق ياڭاق، مېغىزى ئاق ھەم مايلىق، تەبىئىي ئوزۇقلۇق قىممىتى يۇقىرى.'
      },
      tr: {
        name: 'Aksu İnce Kabuklu Doğal Ceviz 1kg',
        category: 'Şifalı Bitkiler & Otlar',
        description: 'Elle kırılabilen ince kabuklu, dolgun ve zengin yağ oranına sahip organik Aksu cevizi.'
      },
      en: {
        name: 'Aksu Thin-Shell Natural Crisp Walnuts 1kg',
        category: 'Herbal Medicines',
        description: 'Hand-crackable paper-thin shell walnuts, buttery, wholesome and packed with omega nutrients.'
      }
    },
    badge: 'ئېتىباردا',
    featured: false
  },
  {
    id: 'PRD-110',
    brand: 'TecnoPro Audio',
    languageScope: 'all',
    name: 'سۇ ئۆتمەس يۇقىرى سۈپەتلىك سىمسىز پورتاتىپ ياڭراتقۇ',
    category: 'پىششىق دورىلار',
    price: 249,
    oldPrice: 320,
    stock: 40,
    sales: 98,
    rating: 4.8,
    ratingCount: 67,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    description: '360 گرادۇسلۇق تەسىرلىك باس ئاۋاز، IPX7 سۇ ئۆتمەس قوغداش قەۋىتى ۋە 24 سائەت ئۈزۈلمەس مۇزىكا قويۇش كۈچى.',
    translations: {
      ug: {
        name: 'سۇ ئۆتمەس يۇقىرى سۈپەتلىك سىمسىز پورتاتىپ ياڭراتقۇ',
        category: 'پىششىق دورىلار',
        description: '360 گرادۇسلۇق تەسىرلىك باس ئاۋاز، IPX7 سۇ ئۆتمەس قوغداش قەۋىتى ۋە 24 سائەت ئۈزۈلمەس مۇزىكا قويۇش كۈچى.'
      },
      tr: {
        name: 'Su Geçirmez Taşınabilir Bluetooth Hoparlör',
        category: 'Hazır & İşlenmiş İlaçlar',
        description: '360 derece güçlü bas ses, IPX7 su geçirmezlik ve 24 saat kesintisiz müzik keyfi.'
      },
      en: {
        name: 'Waterproof Portable Wireless Bluetooth Speaker',
        category: 'Prepared Medicines',
        description: '360-degree immersive acoustic bass, IPX7 waterproof rating, and 24-hour long-lasting battery.'
      }
    },
    badge: 'يېڭى كەلگەن',
    featured: false
  },
  {
    id: 'PRD-111',
    brand: 'تەكلىماكان كىلاسسىك',
    languageScope: 'all',
    name: 'نەپىس نۇسخىدىكى مىس چەينەك ۋە پىيالە يۈرۈشلۈكى',
    category: 'ئۇيغۇر تىبابىتى',
    price: 340,
    oldPrice: 420,
    stock: 18,
    sales: 52,
    rating: 5.0,
    ratingCount: 44,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    description: 'قولدا ئۇستىلىق بىلەن نۇسخا چۈشۈرۈلگەن قەدىمىي مىس چاي ئەسۋابلىرى، چاي دەملەش ۋە مېھمان كۈتۈشتە ئالاھىدە ئېسىل زوق بېغىشلايدۇ.',
    translations: {
      ug: {
        name: 'نەپىس نۇسخىدىكى مىس چەينەك ۋە پىيالە يۈرۈشلۈكى',
        category: 'ئۇيغۇر تىبابىتى',
        description: 'قولدا ئۇستىلىق بىلەن نۇسخا چۈشۈرۈلگەن قەدىمىي مىس چاي ئەسۋابلىرى، چاي دەملەش ۋە مېھمان كۈتۈشتە ئالاھىدە ئېسىل زوق بېغىشلايدۇ.'
      },
      tr: {
        name: 'El İşlemesi Bakır Çaydanlık ve Fincan Seti',
        category: 'Uygur Tıbbı',
        description: 'Geleneksel el oyması saf bakır çaydanlık ve fincan takımı ile otantik çay keyfi.'
      },
      en: {
        name: 'Handcrafted Embossed Copper Teapot & Cup Set',
        category: 'Uyghur Medicine',
        description: 'Authentic engraved artisanal solid copper tea service set preserving centuries of tea culture.'
      }
    },
    badge: 'تەۋسىيە',
    featured: true
  },
  {
    id: 'PRD-112',
    brand: 'خوتەن مىراس',
    languageScope: 'all',
    name: 'تەبىئىي ساپ تاش قاشتېشى نەپىس بويۇنتۇمار',
    category: 'ئۇيغۇر تىبابىتى',
    price: 520,
    oldPrice: 680,
    stock: 22,
    sales: 78,
    rating: 4.9,
    ratingCount: 61,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    description: 'خوتەن يۇرۇڭقاش دەرياسىنىڭ تاش قاشتېشىدىن ئىنچىكە ئويۇپ ياسالغان، كۆركەم زەنجىرلىك نەپىس زىبۇ-زىننەت بۇيۇمى.',
    translations: {
      ug: {
        name: 'تەبىئىي ساپ تاش قاشتېشى نەپىس بويۇنتۇمار',
        category: 'ئۇيغۇر تىبابىتى',
        description: 'خوتەن يۇرۇڭقاش دەرياسىنىڭ تاش قاشتېشىدىن ئىنچىكە ئويۇپ ياسالغان، كۆركەم زەنجىرلىك نەپىس زىبۇ-زىننەت بۇيۇمى.'
      },
      tr: {
        name: 'Hakiki Beyaz Yeşim Taşı Kolye Ucu',
        category: 'Uygur Tıbbı',
        description: 'Doğal Hoten nehir yeşim taşından ustalıkla oyulmuş zarif ve asil kolye ucu.'
      },
      en: {
        name: 'Natural Carved White Nephrite Jade Pendant',
        category: 'Uyghur Medicine',
        description: 'Artfully carved genuine mutton-fat white jade gemstone pendant strung on heritage silk cord.'
      }
    },
    badge: 'ئەڭ قىزىق',
    featured: false
  },
  {
    id: 'PRD-113',
    brand: 'تۇرپان يېشىل',
    languageScope: 'all',
    name: 'تۇرپان كىشمىش قىزىل ئۈزۈم 500g',
    category: 'قۇرۇق يەل-يېمىشلەر',
    price: 550,
    oldPrice: 600,
    unit: '500g',
    stock: 160,
    sales: 610,
    rating: 4.9,
    ratingCount: 195,
    image: 'images/products/PRD-113.jpg',
    description: 'تەبىئىي ئاپتاپتا قۇرۇتۇلغان، تەركىبىدە تۆمۈر ۋە مىنېرال ماددىلار مول بولغان ئالىي سۈپەتلىك تاتلىق قىزىل كىشمىش ئۈزۈم مەھسۇلاتى.',
    translations: {
      ug: {
        name: 'تۇرپان كىشمىش قىزىل ئۈزۈم 500g',
        category: 'قۇرۇق يەل-يېمىشلەر',
        unit: '500g',
        description: 'تەبىئىي ئاپتاپتا قۇرۇتۇلغان، تەركىبىدە تۆمۈر ۋە مىنېرال ماددىلار مول بولغان ئالىي سۈپەتلىك تاتلىق قىزىل كىشمىش ئۈزۈم مەھسۇلاتى.'
      },
      tr: {
        name: 'Turpan Kırmızı Kuşüzümü (Kişmiş) 500g',
        category: 'Kuru Meyve & Yemişler',
        unit: '500 gr',
        description: 'Turpan güneşinde doğal yollarla kurutulmuş yüksek besin değerli leziz kırmızı kuşüzümü.'
      },
      en: {
        name: 'Turpan Sun-Dried Sweet Crimson Red Kishmish Raisins 500g',
        category: 'Dried Fruits & Nuts',
        unit: '500g',
        description: 'Naturally sun-dried sweet ruby red raisins harvested from Turpan vineyards.'
      }
    },
    badge: 'تەۋسىيە',
    featured: false
  },
  {
    id: 'PRD-114',
    brand: 'تەكلىماكان كىلاسسىك',
    languageScope: 'all',
    name: 'خۇشپۇراق تەبىئىي خوتەن ئەتىرگۈل چاي پۇرىقى 200g',
    category: 'گۈلقەنتلەر',
    price: 55,
    oldPrice: 75,
    stock: 80,
    sales: 240,
    rating: 5.0,
    ratingCount: 112,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    description: 'خوتەن دەريا بويىنىڭ خۇشپۇراق ئەتىرگۈل غۇنچىلىرىدىن قۇرۇتۇلغان، تىنچلاندۇرۇش ۋە گۈزەللىككە پايدىلىق ئالىي چاي.',
    translations: {
      ug: {
        name: 'خۇشپۇراق تەبىئىي خوتەن ئەتىرگۈل چاي پۇرىقى 200g',
        category: 'گۈلقەنتلەر',
        description: 'خوتەن دەريا بويىنىڭ خۇشپۇراق ئەتىرگۈل غۇنچىلىرىدىن قۇرۇتۇلغان، تىنچلاندۇرۇش ۋە گۈزەللىككە پايدىلىق ئالىي چاي.'
      },
      tr: {
        name: 'Doğal Hoten Kurutulmuş Tomurcuk Gül Çayı 200g',
        category: 'Gül Reçelleri & Macunlar',
        description: 'Özenle toplanmış pembe gül tomurcuklarından taze kokulu ve şifalı bitkisel çay.'
      },
      en: {
        name: 'Natural Hotan Fragrant Dried Rosebud Herbal Tea 200g',
        category: 'Rose Jams & Pastes',
        description: 'Delicate hand-picked sun-dried pink Damask rosebuds for an aromatic relaxing floral infusion.'
      }
    },
    badge: 'ئېتىباردا',
    featured: true
  },
  {
    id: 'PRD-115',
    brand: 'TecnoPro Audio',
    languageScope: 'all',
    name: 'ئەقلىي تېز توك قاچىلىغۇچ ۋە سىمسىز قۇۋۋەتلىگۈچ 65W GaN',
    category: 'پىششىق دورىلار',
    price: 139,
    oldPrice: 180,
    stock: 65,
    sales: 175,
    rating: 4.8,
    ratingCount: 92,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    description: 'يېڭى بوشلۇق GaN تېخنىكىسى، يانفون، تاختا كومپيۇتېر ۋە خاتىرە كومپيۇتېرلارنى دەرىجىدىن تاشقىرى تېز توكلاش كۈچىگە ئىگە.',
    translations: {
      ug: {
        name: 'ئەقلىي تېز توك قاچىلىغۇچ ۋە سىمسىز قۇۋۋەتلىگۈچ 65W GaN',
        category: 'پىششىق دورىلار',
        description: 'يېڭى بوشلۇق GaN تېخنىكىسى، يانفون، تاختا كومپيۇتېر ۋە خاتىرە كومپيۇتېرلارنى دەرىجىدىن تاشقىرى تېز توكلاش كۈچىگە ئىگە.'
      },
      tr: {
        name: 'Hızlı Şarj Adaptörü 65W GaN Çoklu Çıkış',
        category: 'Hazır & İşlenmiş İlaçlar',
        description: 'GaN teknolojisi ile telefon ve dizüstü bilgisayarlar için süper hızlı güvenli şarj.'
      },
      en: {
        name: '65W GaN High-Speed Multi-Port Fast Charger',
        category: 'Prepared Medicines',
        description: 'Next-generation GaN fast charging technology compatible with laptops, tablets and smartphones.'
      }
    },
    badge: '',
    featured: false
  },
  {
    id: 'PRD-116',
    brand: 'SilkRoad Press',
    languageScope: 'all',
    name: 'ئەنئەنىۋى يىپەك يۆگەلمە كىتابخۇمار ئۈستەل دەپتىرى',
    category: 'كىتاپ ۋە مەدەنىيەت',
    price: 88,
    oldPrice: 110,
    stock: 50,
    sales: 110,
    rating: 4.9,
    ratingCount: 53,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    description: 'مۇقاۋىسى مىللىي ئەتلەس يىپەكتىن نەپىس باغلانغان، كۆزنى قوغدايدىغان ئەلا سۈپەتلىك خاتىرە دەپتەر توپلىمى.',
    translations: {
      ug: {
        name: 'ئەنئەنىۋى يىپەك يۆگەلمە كىتابخۇمار ئۈستەل دەپتىرى',
        category: 'كىتاپ ۋە مەدەنىيەت',
        description: 'مۇقاۋىسى مىللىي ئەتلەس يىپەكتىن نەپىس باغلانغان، كۆزنى قوغدايدىغان ئەلا سۈپەتلىك خاتىرە دەپتەر توپلىمى.'
      },
      tr: {
        name: 'Geleneksel İpek Kapaklı El Yapımı Not Defteri',
        category: 'Kitap & Kültür',
        description: 'Otantik ipek atlas kumaş kaplı, birinci sınıf sayfalı özel tasarım hatıra defteri.'
      },
      en: {
        name: 'Heritage Silk-Bound Hardcover Journal Notebook',
        category: 'Books & Culture',
        description: 'Premium handcrafted blank journal featuring exquisite silk-bound cover and acid-free archival paper.'
      }
    },
    badge: 'تەۋسىيە',
    featured: false,
    approvalStatus: 'تەستىقلاندى'
  },
  {
    id: 'PRD-117',
    brand: 'تۇرپان يېشىل',
    languageScope: 'all',
    name: 'تۇرپان قارا كىشمىش قۇرۇق ئۈزۈمى 1000g (ۋاكالەتچى يوللىغان)',
    category: 'ئۆسۈملۈك دورىلار',
    price: 95,
    oldPrice: 130,
    stock: 80,
    sales: 0,
    rating: 5.0,
    ratingCount: 1,
    image: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=800&q=80',
    description: 'تۇرپان ئورگانىك ئۈزۈم بازىسىدىن تاللانغان يۇقىرى سۈپەتلىك، يېڭى قارا قۇرۇق كىشمىش. ۋاكالەتچى مەريەم كېرەم تەرىپىدىن يوللانغان.',
    translations: {
      ug: {
        name: 'تۇرپان قارا كىشمىش قۇرۇق ئۈزۈمى 1000g (ۋاكالەتچى يوللىغان)',
        category: 'ئۆسۈملۈك دورىلار',
        description: 'تۇرپان ئورگانىك ئۈزۈم بازىسىدىن تاللانغان يۇقىرى سۈپەتلىك، يېڭى قارا قۇرۇق كىشمىش. ۋاكالەتچى مەريەم كېرەم تەرىپىدىن يوللانغان.'
      },
      tr: {
        name: 'Turpan Doğal Siyah Kuşüzümü 1000g (Temsilci Gönderisi)',
        category: 'Şifalı Bitkiler & Otlar',
        description: 'Turpan bağlarından taze toplanmış ve doğal yöntemlerle kurutulmuş siyah çekirdeksiz kuru üzüm.'
      },
      en: {
        name: 'Premium Turpan Black Seedless Raisins 1000g (Agent Submission)',
        category: 'Herbal Medicines',
        description: 'Naturally dried organic black raisins harvested directly from heritage vineyards in Turpan.'
      }
    },
    badge: 'يېڭى كەلگەن',
    featured: false,
    approvalStatus: 'تەستىق كۈتۈۋاتىدۇ',
    agentName: 'مەريەم كېرەم (meryem@teklimakan.com)',
    submittedAt: '2026-09-12'
  },
  {
    id: 'PRD-118',
    brand: 'قەشقەر قەدىمىي',
    languageScope: 'all',
    name: 'قەشقەر نەپىس قولدا توقۇلغان قاشتېشى كۆڭلەك قىستۇرمىسى (تەستىق كۈتۈۋاتىدۇ)',
    category: 'گۈزەللىك ۋە ساغلاملىق',
    price: 260,
    oldPrice: 320,
    stock: 25,
    sales: 0,
    rating: 5.0,
    ratingCount: 1,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    description: 'قەشقەر قەدىمىي ئۇستىلىرىنىڭ قول ئەمگىكىدە ياسالغان مىللىي زىبۇ-زىننەت بۇيۇمى. ۋاكالەتچى ئەلىجان روزى تەرىپىدىن ئېلان قىلىش ئۈچۈن يوللانغان.',
    translations: {
      ug: {
        name: 'قەشقەر نەپىس قولدا توقۇلغان قاشتېشى كۆڭلەك قىستۇرمىسى (تەستىق كۈتۈۋاتىدۇ)',
        category: 'گۈزەللىك ۋە ساغلاملىق',
        description: 'قەشقەر قەدىمىي ئۇستىلىرىنىڭ قول ئەمگىكىدە ياسالغان مىللىي زىبۇ-زىننەت بۇيۇمى. ۋاكالەتچى ئەلىجان روزى تەرىپىدىن ئېلان قىلىش ئۈچۈن يوللانغان.'
      },
      tr: {
        name: 'Kaşgar El İşçiliği Yeşim Broş İğnesi (Onay Bekliyor)',
        category: 'Güzellik & Sağlık',
        description: 'Kaşgar zanaatkârlarının ellerinde şekillenmiş el yapımı yeşim işlemeli özel broş.'
      },
      en: {
        name: 'Kashgar Artisanal Jade Inlaid Brooch Pin (Pending Approval)',
        category: 'Beauty & Health',
        description: 'Intricately handcrafted brooch featuring authentic jade and traditional Uyghur metalwork.'
      }
    },
    badge: 'تەۋسىيە',
    featured: false,
    approvalStatus: 'تەستىق كۈتۈۋاتىدۇ',
    agentName: 'ئەلىجان روزى (alijan@teklimakan.com)',
    submittedAt: '2026-09-12'
  },
  {
    id: 'PRD-119',
    brand: 'ئانارگۈل ئورگانىك',
    languageScope: 'all',
    name: 'خوتەن تەبىئىي ئەتىرگۈل گۈلقەنتى مەجۈنى 500g',
    category: 'گۈلقەنتلەر',
    price: 85,
    oldPrice: 110,
    stock: 60,
    sales: 24,
    rating: 4.9,
    ratingCount: 28,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    description: 'خوتەننىڭ يېڭى دەستە ئەتىرگۈل بەرگىلىرىدىن ئەنئەنىۋى ئۇسۇلدا قاينىتىلغان ساپ گۈلقەنت مەجۈنى. ئىسسىق كەيپىيات ۋە راھەتلىك ئاتا قىلىدۇ.',
    translations: {
      ug: {
        name: 'خوتەن تەبىئىي ئەتىرگۈل گۈلقەنتى مەجۈنى 500g',
        category: 'گۈلقەنتلەر',
        description: 'خوتەننىڭ يېڭى دەستە ئەتىرگۈل بەرگىلىرىدىن ئەنئەنىۋى ئۇسۇلدا قاينىتىلغان ساپ گۈلقەنت مەجۈنى. ئىسسىق كەيپىيات ۋە راھەتلىك ئاتا قىلىدۇ.'
      },
      tr: {
        name: 'Hotan Doğal Gül Reçeli Macunu 500g',
        category: 'Gül Reçelleri & Macunlar',
        description: 'Hotan’ın taze gül yapraklarından geleneksel yöntemlerle kaynatılmış hakiki şifalı gül tatlısı.'
      },
      en: {
        name: 'Hotan Natural Organic Rose Jam Paste 500g',
        category: 'Rose Jams & Pastes',
        description: 'Traditional rose petal preserve crafted from freshly harvested Hotan organic damask roses.'
      }
    },
    badge: 'قىزىق سېتىلىۋاتىدۇ',
    featured: true,
    approvalStatus: 'تەستىقلانغان'
  },
  {
    id: 'PRD-120',
    brand: 'ئەلمۇئەللىم تىبابىتى',
    languageScope: 'all',
    name: 'تەبىئىي سوغۇق پىرىسلانغان قارا ئۇرۇق مېيى 100ml',
    category: 'تەبىئىي ياغلار',
    price: 125,
    oldPrice: 160,
    stock: 45,
    sales: 38,
    rating: 5.0,
    ratingCount: 42,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    description: 'ساپ قارا تىرىك (قارا ئۇرۇق) ئۇرۇقىدىن سوغۇق پىرىسلاپ ئېلىنغان بىرىنچى قول تېبابەت مېيى. بەدەن كۈچىنى ئاشۇرىدۇ.',
    translations: {
      ug: {
        name: 'تەبىئىي سوغۇق پىرىسلانغان قارا ئۇرۇق مېيى 100ml',
        category: 'تەبىئىي ياغلار',
        description: 'ساپ قارا تىرىك (قارا ئۇرۇق) ئۇرۇقىدىن سوغۇق پىرىسلاپ ئېلىنغان بىرىنچى قول تېبابەت مېيى. بەدەن كۈچىنى ئاشۇرىدۇ.'
      },
      tr: {
        name: 'Doğal Soğuk Sıkım Çörek Otu Yağı 100ml',
        category: 'Doğal & Şifalı Yağlar',
        description: 'Geleneksel soğuk pres yöntemiyle elde edilen saf ve katkısız şifalı çörek otu tohumu yağı.'
      },
      en: {
        name: 'Pure Cold-Pressed Black Seed Oil 100ml',
        category: 'Natural Oils',
        description: '100% pure cold-pressed nigella sativa black cumin seed oil for immunity and holistic wellness.'
      }
    },
    badge: 'ئالىي سۈپەت',
    featured: true,
    approvalStatus: 'تەستىقلانغان'
  },
  {
    id: 'PRD-121',
    brand: 'تەكلىماكان نەشرىياتى',
    languageScope: 'all',
    name: 'ئۇيغۇر كىلاسسىك تىبابەت قامۇسى (نەپىس تاش باسما نۇسخا)',
    category: 'كىتاپ ۋە مەدەنىيەت',
    price: 280,
    oldPrice: 350,
    stock: 20,
    sales: 15,
    rating: 4.9,
    ratingCount: 19,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    description: 'ئەجدادلاردىن مىراس قالغان ئۇيغۇر مىللىي تېبابەت رېتسىپلىرى، ئۆسۈملۈك ۋە مىجەز ئىلمىنى ئۆز ئىچىگە ئالغان نوپۇزلۇق توپلام.',
    translations: {
      ug: {
        name: 'ئۇيغۇر كىلاسسىك تىبابەت قامۇسى (نەپىس تاش باسما نۇسخا)',
        category: 'كىتاپ ۋە مەدەنىيەت',
        description: 'ئەجدادلاردىن مىراس قالغان ئۇيغۇر مىللىي تېبابەت رېتسىپلىرى، ئۆسۈملۈك ۋە مىجەز ئىلمىنى ئۆز ئىچىگە ئالغان نوپۇزلۇق توپلام.'
      },
      tr: {
        name: 'Uygur Klasik Tıp Ansiklopedisi (Ciltli Özel Baskı)',
        category: 'Kitap & Kültür',
        description: 'Kadim Uygur hekimlerinin miras bıraktığı şifalı reçeteler ve mizaç ilmini anlatan kapsamlı başvuru eseri.'
      },
      en: {
        name: 'Encyclopaedia of Traditional Uyghur Medicine (Deluxe Hardcover)',
        category: 'Books & Culture',
        description: 'An authoritative reference book collecting ancient Uyghur healing treatises, herbal pharmacology, and humoral therapy.'
      }
    },
    badge: 'تەۋسىيە',
    featured: false,
    approvalStatus: 'تەستىقلانغان'
  },
  {
    id: 'PRD-122',
    brand: 'شىنجاڭ تەبىئىتى',
    languageScope: 'all',
    name: 'تەڭرىتاغ ساپ ياۋا تاغ ھەسىلى 1000g',
    category: 'ئۆسۈملۈك دورىلار',
    price: 180,
    oldPrice: 220,
    stock: 35,
    sales: 52,
    rating: 5.0,
    ratingCount: 65,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    description: 'تەڭرىتاغ ئىپتىدائىي قار كۆل ۋە يايلاقلىرىدىكى ساپ گۈللەر شەربىتىدىن يىغىۋېلىنغان 100% تەبىئىي تاغ ھەسىلى.',
    translations: {
      ug: {
        name: 'تەڭرىتاغ ساپ ياۋا تاغ ھەسىلى 1000g',
        category: 'ئۆسۈملۈك دورىلار',
        description: 'تەڭرىتاغ ئىپتىدائىي قار كۆل ۋە يايلاقلىرىدىكى ساپ گۈللەر شەربىتىدىن يىغىۋېلىنغان 100% تەبىئىي تاغ ھەسىلى.'
      },
      tr: {
        name: 'Tanrı Dağları Saf Doğal Dağ Balı 1000g',
        category: 'Şifalı Bitkiler & Otlar',
        description: 'Tanrı Dağları yaylalarındaki yabani çiçeklerin nektarından toplanmış yüzde yüz saf süzme bal.'
      },
      en: {
        name: 'Tian Shan Pristine Wild Mountain Honey 1000g',
        category: 'Herbal Medicines',
        description: 'Raw unprocessed mountain honey harvested from alpine meadows of the Tian Shan ranges.'
      }
    },
    badge: '100% تەبىئىي',
    featured: true,
    approvalStatus: 'تەستىقلانغان'
  },
  {
    id: 'PRD-123',
    brand: 'قەشقەر كۆركى',
    languageScope: 'all',
    name: 'قەشقەر ئەلا نۇسخىدىكى مىللىي بادام دوپپا (ساپ يىپەك كەشتىلىك)',
    category: 'گۈزەللىك ۋە ساغلاملىق',
    price: 145,
    oldPrice: 185,
    stock: 30,
    sales: 19,
    rating: 4.8,
    ratingCount: 22,
    image: 'https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?auto=format&fit=crop&w=800&q=80',
    description: 'ئەنئەنىۋى ئۇيغۇر بادام نۇسخىسىدا ئالىي سۈپەتلىك ئاق يىپەك يىپ بىلەن قولدا كەشتىلەنگەن مىللىي باش كىيىمى.',
    translations: {
      ug: {
        name: 'قەشقەر ئەلا نۇسخىدىكى مىللىي بادام دوپپا (ساپ يىپەك كەشتىلىك)',
        category: 'گۈزەللىك ۋە ساغلاملىق',
        description: 'ئەنئەنىۋى ئۇيغۇر بادام نۇسخىسىدا ئالىي سۈپەتلىك ئاق يىپەك يىپ بىلەن قولدا كەشتىلەنگەن مىللىي باش كىيىمى.'
      },
      tr: {
        name: 'Kaşgar Özel İşlemeli İpek Badam Doppası',
        category: 'Güzellik & Sağlık',
        description: 'Geleneksel Uygur badem motifleriyle saf ipek iplik kullanılarak usta ellerde dokunmuş otantik takke.'
      },
      en: {
        name: 'Authentic Kashgar Hand-Embroidered Silk Badam Doppa',
        category: 'Beauty & Health',
        description: 'Traditional handcrafted Uyghur cap with iconic almond blossom floral silk embroidery.'
      }
    },
    badge: 'مىللىي زىننەت',
    featured: false,
    approvalStatus: 'تەستىقلانغان'
  },
  {
    id: 'PRD-124',
    brand: 'خوتەن بايلىقى',
    languageScope: 'all',
    name: 'خوتەن كۆك قاشتېشى تەسۋىيىسى 33 دانىلىق نەپىس نۇسخا',
    category: 'ئۇيغۇر تىبابىتى',
    price: 360,
    oldPrice: 450,
    stock: 12,
    sales: 8,
    rating: 5.0,
    ratingCount: 14,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    description: 'يۇرۇڭقاش دەرياسىنىڭ ھەقىقىي تاش سۈپىتىدىن سىلىقلانغان، تىنچلاندۇرۇش تەسىرىگە ئىگە 33 دانىلىق قاشتېشى تەسۋىيە.',
    translations: {
      ug: {
        name: 'خوتەن كۆك قاشتېشى تەسۋىيىسى 33 دانىلىق نەپىس نۇسخا',
        category: 'ئۇيغۇر تىبابىتى',
        description: 'يۇرۇڭقاش دەرياسىنىڭ ھەقىقىي تاش سۈپىتىدىن سىلىقلانغان، تىنچلاندۇرۇش تەسىرىگە ئىگە 33 دانىلىق قاشتېشى تەسۋىيە.'
      },
      tr: {
        name: 'Hotan Yeşim Taşı 33’lü Özel Namaz Tesbihi',
        category: 'Uygur Tıbbı',
        description: 'Yurungkaş nehrinden çıkarılan hakiki yeşim taşının usta ellerde parlatılmasıyla yapılmış tespih.'
      },
      en: {
        name: 'Hotan Nephrite Jade 33-Bead Prayer Rosary',
        category: 'Uyghur Medicine',
        description: 'Polished natural Hotan river jade prayer beads with smooth luster and soothing touch.'
      }
    },
    badge: 'ئەتىۋارلىق',
    featured: false,
    approvalStatus: 'تەستىقلانغان'
  },
  {
    id: 'PRD-125',
    brand: 'شىنجاڭ تەبىئىتى',
    languageScope: 'all',
    name: 'تەبىئىي خوتەن قىزىل چىلىنى ئالىي تاللانما 1kg',
    category: 'ئۆسۈملۈك دورىلار',
    price: 55,
    oldPrice: 70,
    stock: 80,
    sales: 95,
    rating: 4.9,
    ratingCount: 110,
    image: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=800&q=80',
    description: 'قۇياش نۇرىدا تەبىئىي قۇرۇتۇلغان، چوڭ دانىلىق، يېلىمسىمان يۇمشاق ۋە شېرىن خوتەن قىزىل چىلىنى.',
    translations: {
      ug: {
        name: 'تەبىئىي خوتەن قىزىل چىلىنى ئالىي تاللانما 1kg',
        category: 'ئۆسۈملۈك دورىلار',
        description: 'قۇياش نۇرىدا تەبىئىي قۇرۇتۇلغان، چوڭ دانىلىق، يېلىمسىمان يۇمشاق ۋە شېرىن خوتەن قىزىل چىلىنى.'
      },
      tr: {
        name: 'Hotan Özel Seçim İri Kırmızı Hünnap 1kg',
        category: 'Şifalı Bitkiler & Otlar',
        description: 'Güneşte doğal yollarla kurutulmuş, iri taneli, etli ve şifalı Hotan hünnap meyvesi.'
      },
      en: {
        name: 'Premium Hotan Jumbo Red Jujube Dates 1kg',
        category: 'Herbal Medicines',
        description: 'Sun-dried sweet organic red dates from Hotan, packed with natural vitamins and nutrients.'
      }
    },
    badge: 'قىزىق سېتىلىۋاتىدۇ',
    featured: false,
    approvalStatus: 'تەستىقلانغان'
  },
  {
    id: 'PRD-126',
    brand: 'ئانارگۈل ئورگانىك',
    languageScope: 'all',
    name: 'ئەلا سۈپەتلىك ئورگانىك چىلان ۋە ياڭاق مەغىزى يۈرۈشلۈكى 500g',
    category: 'ئۆسۈملۈك دورىلار',
    price: 85,
    oldPrice: 105,
    stock: 50,
    sales: 41,
    rating: 4.8,
    ratingCount: 35,
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80',
    description: 'چۈرۈك يېڭى ئاق ياڭاق مەغىزى بىلەن خوتەن قىزىل چىلىنىنىڭ ئېسىل كۈچ يەتكۈزۈش بىرىكمىسى.',
    translations: {
      ug: {
        name: 'ئەلا سۈپەتلىك ئورگانىك چىلان ۋە ياڭاق مەغىزى يۈرۈشلۈكى 500g',
        category: 'ئۆسۈملۈك دورىلار',
        description: 'چۈرۈك يېڭى ئاق ياڭاق مەغىزى بىلەن خوتەن قىزىل چىلىنىنىڭ ئېسىل كۈچ يەتكۈزۈش بىرىكمىسى.'
      },
      tr: {
        name: 'Özel Organik Hünnap ve Ceviz İçi Karışımı 500g',
        category: 'Şifalı Bitkiler & Otlar',
        description: 'Taze çıtır ceviz içi ve tatlı Hotan hünnabının besleyici lezzet dengesi.'
      },
      en: {
        name: 'Organic Walnut Kernels & Red Jujube Blend 500g',
        category: 'Herbal Medicines',
        description: 'Wholesome combination of crisp raw walnuts and sweet Hotan dried dates for sustained energy.'
      }
    },
    badge: 'ئوزۇقلۇق',
    featured: false,
    approvalStatus: 'تەستىقلانغان'
  },
  {
    id: 'PRD-127',
    brand: 'ئەلمۇئەللىم تىبابىتى',
    languageScope: 'all',
    name: 'ساپ قاشتېشى تاش يۈز ئۇۋۇلاش تاختىسى (Gua Sha)',
    category: 'ئۇيغۇر تىبابىتى',
    price: 110,
    oldPrice: 140,
    stock: 40,
    sales: 27,
    rating: 4.9,
    ratingCount: 31,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    description: 'ساپ قاشتېشى مىنېرال تېشىدىن تىرىنى سىلىقلاش، قان ئايلىنىشنى جانلاندۇرۇش ئۈچۈن ياسالغان تەبىئىي گۇاشا تاختىسى.',
    translations: {
      ug: {
        name: 'ساپ قاشتېشى تاش يۈز ئۇۋۇلاش تاختىسى (Gua Sha)',
        category: 'ئۇيغۇر تىبابىتى',
        description: 'ساپ قاشتېشى مىنېرال تېشىدىن تىرىنى سىلىقلاش، قان ئايلىنىشنى جانلاندۇرۇش ئۈچۈن ياسالغان تەبىئىي گۇاشا تاختىسى.'
      },
      tr: {
        name: 'Hakiki Yeşim Taşı Yüz Masaj Taşı (Gua Sha)',
        category: 'Uygur Tıbbı',
        description: 'Cildi canlandıran, kan dolaşımını rahatlatan doğal yeşim taşından üretilmiş masaj aleti.'
      },
      en: {
        name: 'Authentic Jade Facial Sculpting Gua Sha Board',
        category: 'Uyghur Medicine',
        description: 'Natural carved nephrite jade beauty stone to soothe puffiness and invigorate circulation.'
      }
    },
    badge: 'يېڭى ئېقىم',
    featured: false,
    approvalStatus: 'تەستىقلانغان'
  },
  {
    id: 'PRD-128',
    brand: 'قەشقەر كۆركى',
    languageScope: 'all',
    name: 'ئەنئەنىۋى مىللىي كاۋاپ ۋە تاماق خۇش پۇراق تېتىتقۇ يۈرۈشلۈكى',
    category: 'پىششىق دورىلار',
    price: 48,
    oldPrice: 65,
    stock: 75,
    sales: 88,
    rating: 5.0,
    ratingCount: 94,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    description: 'ساپ زىرە، لازا، قارىمۇچ ۋە مەخسۇس ئۆسۈملۈك گۈل ئۇرۇقلىرى يانجىلغان ئەسلى ئۇيغۇرچە كاۋاپ دورا تېتىتقۇسى.',
    translations: {
      ug: {
        name: 'ئەنئەنىۋى مىللىي كاۋاپ ۋە تاماق خۇش پۇراق تېتىتقۇ يۈرۈشلۈكى',
        category: 'پىششىق دورىلار',
        description: 'ساپ زىرە، لازا، قارىمۇچ ۋە مەخسۇس ئۆسۈملۈك گۈل ئۇرۇقلىرى يانجىلغان ئەسلى ئۇيغۇرچە كاۋاپ دورا تېتىتقۇسى.'
      },
      tr: {
        name: 'Geleneksel Uygur Kebap Baharatı Çeşnisi Seti',
        category: 'Hazır & İşlenmiş İlaçlar',
        description: 'Hakiki tane kimyon, özel biber ve şifalı tohumlarla hazırlanmış geleneksel lezzet harmanı.'
      },
      en: {
        name: 'Traditional Uyghur Kebab & Grill Spice Seasoning Set',
        category: 'Prepared Medicines',
        description: 'Authentic blend of wild mountain cumin, ground chili peppers, and aromatic botanical herbs.'
      }
    },
    badge: 'ئەسلى تەم',
    featured: false,
    approvalStatus: 'تەستىقلانغان'
  },
  {
    id: 'PRD-129',
    brand: 'ئانارگۈل ئورگانىك',
    languageScope: 'all',
    name: 'تەبىئىي شاھ بادام يېغى گۈزەللىك ۋە تېرە مېيى 150ml',
    category: 'تەبىئىي ياغلار',
    price: 92,
    oldPrice: 120,
    stock: 35,
    sales: 29,
    rating: 4.8,
    ratingCount: 30,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    description: 'تاتلىق شاھ بادام ئۇرۇقىدىن سىقىپ تەييارلانغان، چاچ ۋە تېرە نەملىكىنى ساقلايدىغان تەبىئىي ھۆسن گۈزەللەشتۈرۈش مېيى.',
    translations: {
      ug: {
        name: 'تەبىئىي شاھ بادام يېغى گۈزەللىك ۋە تېرە مېيى 150ml',
        category: 'تەبىئىي ياغلار',
        description: 'تاتلىق شاھ بادام ئۇرۇقىدىن سىقىپ تەييارلانغان، چاچ ۋە تېرە نەملىكىنى ساقلايدىغان تەبىئىي ھۆسن گۈزەللەشتۈرۈش مېيى.'
      },
      tr: {
        name: 'Doğal Tatlı Badem Bakım Yağı 150ml',
        category: 'Doğal & Şifalı Yağlar',
        description: 'Cilt ve saç bakımı için zengin E vitamini içeren, katkısız soğuk sıkım tatlı badem yağı.'
      },
      en: {
        name: 'Pure Sweet Almond Skin & Hair Elixir Oil 150ml',
        category: 'Natural Oils',
        description: 'Cold-pressed natural sweet almond oil for soothing skincare hydration and silky hair nourishment.'
      }
    },
    badge: 'پارقىراقلىق',
    featured: false,
    approvalStatus: 'تەستىقلانغان'
  },
  {
    id: 'PRD-130',
    brand: 'تەكلىماكان نەشرىياتى',
    languageScope: 'all',
    name: 'ئۇيغۇر كىلاسسىك 12 مۇقام CD ۋە نوتا كىتاب توپلىمى',
    category: 'كىتاپ ۋە مەدەنىيەت',
    price: 320,
    oldPrice: 390,
    stock: 15,
    sales: 12,
    rating: 5.0,
    ratingCount: 18,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    description: 'ئۇيغۇر ئون ئىككى مۇقامىنىڭ تولۇق مۇزىكا خاتىرىسى، قوشاق-غەزەللەر تېكىستى ۋە نوتىلىرى جەملەنگەن خاتىرە كوللېكسىيە.',
    translations: {
      ug: {
        name: 'ئۇيغۇر كىلاسسىك 12 مۇقام CD ۋە نوتا كىتاب توپلىمى',
        category: 'كىتاپ ۋە مەدەنىيەت',
        description: 'ئۇيغۇر ئون ئىككى مۇقامىنىڭ تولۇق مۇزىكا خاتىرىسى، قوشاق-غەزەللەر تېكىستى ۋە نوتىلىرى جەملەنگەن خاتىرە كوللېكسىيە.'
      },
      tr: {
        name: 'Uygur On İki Makam Özel Müzik ve Nota Külliyatı',
        category: 'Kitap & Kültür',
        description: 'Geleneksel Uygur On İki Makamı ses kayıtları, güfteleri ve müzik notalarını bir araya getiren arşiv koleksiyon.'
      },
      en: {
        name: 'Uyghur Twelve Muqam Complete Audio & Score Collection',
        category: 'Books & Culture',
        description: 'Master archival edition containing complete musical recordings, poetry lyrics, and scores of the Uyghur Twelve Muqam.'
      }
    },
    badge: 'ئالتۇن مىراس',
    featured: true,
    approvalStatus: 'تەستىقلانغان'
  },
  {
    id: 'PRD-131',
    brand: 'ئانارگۈل ئورگانىك',
    languageScope: 'all',
    name: 'خوتەن تەبىئىي ئەنجۈر گۈلقەنت مۇرابباسى 450g',
    category: 'گۈلقەنتلەر',
    price: 68,
    oldPrice: 90,
    stock: 40,
    sales: 65,
    rating: 4.9,
    ratingCount: 38,
    image: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80',
    description: 'خوتەن ئەنجۈرى ۋە تەبىئىي شېكەر قىيامىدىن پىشۇرۇلغان مىللىي ئېسىل تەم مۇرابباسى.',
    translations: {
      ug: {
        name: 'خوتەن تەبىئىي ئەنجۈر گۈلقەنت مۇرابباسى 450g',
        category: 'گۈلقەنتلەر',
        description: 'خوتەن ئەنجۈرى ۋە تەبىئىي شېكەر قىيامىدىن پىشۇرۇلغان مىللىي ئېسىل تەم مۇرابباسى.'
      },
      tr: {
        name: 'Hotan Doğal İncir Reçeli ve Macunu 450g',
        category: 'Gül Reçelleri & Macunlar',
        description: 'Geleneksel Hotan incirlerinden üretilmiş katkısız lezzetli şifalı reçel.'
      },
      en: {
        name: 'Hotan Traditional Organic Fig Jam & Confection 450g',
        category: 'Rose Jams & Pastes',
        description: 'Authentic sun-ripened Hotan fig preserve simmered slowly for sweet and rich flavor.'
      }
    },
    badge: 'تاتلىق مىراس',
    featured: true,
    approvalStatus: 'تەستىقلانغان'
  },
  {
    id: 'PRD-132',
    brand: 'شىنجاڭ تەبىئىتى',
    languageScope: 'all',
    name: 'ئەنئەنىۋى ئاق كۈنجۈت ۋە گۈلقەنت ساغلاملىق مەجۈنى 500g',
    category: 'گۈلقەنتلەر',
    price: 95,
    oldPrice: 125,
    stock: 35,
    sales: 48,
    rating: 5.0,
    ratingCount: 29,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    description: 'خوتەن ئەتىرگۈل شەربىتى، ئاق كۈنجۈت ۋە ھەسەل بىرىكمىسىدىن تەييارلانغان ئوزۇقلۇق مەجۈنى.',
    translations: {
      ug: {
        name: 'ئەنئەنىۋى ئاق كۈنجۈت ۋە گۈلقەنت ساغلاملىق مەجۈنى 500g',
        category: 'گۈلقەنتلەر',
        description: 'خوتەن ئەتىرگۈل شەربىتى، ئاق كۈنجۈت ۋە ھەسەل بىرىكمىسىدىن تەييارلانغان ئوزۇقلۇق مەجۈنى.'
      },
      tr: {
        name: 'Geleneksel Beyaz Susamlı Gül Macunu 500g',
        category: 'Gül Reçelleri & Macunlar',
        description: 'Hotan gül yaprakları, saf bal ve beyaz susam ile zenginleştirilmiş besleyici macun.'
      },
      en: {
        name: 'Traditional White Sesame & Rose Petal Paste 500g',
        category: 'Rose Jams & Pastes',
        description: 'Nourishing herbal paste prepared with fragrant damask rose, pure mountain honey, and white sesame.'
      }
    },
    badge: 'ئالىي كۈچ',
    featured: true,
    approvalStatus: 'تەستىقلانغان'
  },
  {
    id: 'PRD-420',
    brand: 'Teklimakan Online',
    languageScope: 'all',
    name: 'قارا مور',
    category: 'بارلىق مەھسۇلاتلار',
    price: 1500,
    oldPrice: 2000,
    unit: 'كىلو',
    stock: 20,
    sales: 15,
    rating: 5.0,
    ratingCount: 12,
    image: 'images/products/PRD-420.jpg',
    description: 'تەبىئىي، ساپ ئەلا سۈپەتلىك تاللانغان قارا مور. تەن ساغلاملىقى ۋە تەم تەڭشەشكە تەبىئىي بايلىق.',
    translations: {
      ug: {
        name: 'قارا مور',
        category: 'بارلىق مەھسۇلاتلار',
        unit: 'كىلو',
        description: 'تەبىئىي، ساپ ئەلا سۈپەتلىك تاللانغان قارا مور. تەن ساغلاملىقى ۋە تەم تەڭشەشكە تەبىئىي بايلىق.'
      },
      tr: {
        name: 'Siyah Ağaç Mantarı (Kara Mor)',
        category: 'Tüm Ürünler',
        unit: 'Kilo',
        description: 'Doğal, seçilmiş yüksek kaliteli siyah ağaç kulak mantarı.'
      },
      en: {
        name: 'Black Fungus (Wood Ear Mushroom)',
        category: 'All Products',
        unit: 'kg',
        description: 'Natural premium selected dried black wood ear fungus.'
      }
    },
    badge: 'ئەڭ يېڭى',
    featured: true,
    approvalStatus: 'تەستىقلاندى',
    merchantBadge: 'ئىشەنچىلىك سودىگەر'
  },
  {
    id: 'PRD-398',
    brand: 'Teklimakan Online',
    languageScope: 'all',
    name: 'مادداتۇلھايات',
    category: 'ئۇيغۇر تىبابىتى',
    price: 555,
    oldPrice: 700,
    unit: 'گىرا100م',
    stock: 50,
    sales: 38,
    rating: 5.0,
    ratingCount: 24,
    image: 'images/products/PRD-398.jpg',
    description: 'ئۇيغۇر تىبابىتىنىڭ ئەنئەنىۋى شىپالىق ماجۇنى، ساپ تەبىئىي ئۆسۈملۈك ۋە ھەسەل تەركىبلىك مادداتۇلھايات مەلھىمى.',
    translations: {
      ug: {
        name: 'مادداتۇلھايات',
        category: 'ئۇيغۇر تىبابىتى',
        unit: 'گىرا100م',
        description: 'ئۇيغۇر تىبابىتىنىڭ ئەنئەنىۋى شىپالىق ماجۇنى، ساپ تەبىئىي ئۆسۈملۈك ۋە ھەسەل تەركىبلىك مادداتۇلھايات مەلھىمى.'
      },
      tr: {
        name: 'Maddatülhayat Macunu',
        category: 'Uygur Tıbbı',
        unit: '100 gr',
        description: 'Geleneksel Uygur tıbbı şifalı bitkisel macun, doğal bitkiler ve bal özlü.'
      },
      en: {
        name: 'Maddatulhayat Herbal Tonic Paste',
        category: 'Uyghur Medicine',
        unit: '100g',
        description: 'Traditional Uyghur herbal tonic electuary paste formulated with natural herbs and honey.'
      }
    },
    badge: 'ئەڭ ياخشى تاللانما',
    featured: true,
    approvalStatus: 'تەستىقلاندى',
    merchantBadge: 'ئىشەنچىلىك سودىگەر'
  }
];

const INITIAL_CATEGORIES = [
  { id: 'all', name: 'بارلىق مەھسۇلاتلار', order: 0, icon: 'fas fa-th-large', translations: { ug: 'بارلىق مەھسۇلاتلار', tr: 'Tüm Ürünler', en: 'All Products' } },
  { id: 'ئۇيغۇر تىبابىتى', name: 'ئۇيغۇر تىبابىتى', order: 1, icon: 'fas fa-mortar-pestle', translations: { ug: 'ئۇيغۇر تىبابىتى', tr: 'Uygur Tıbbı', en: 'Uyghur Medicine' } },
  { id: 'پىششىق دورىلار', name: 'پىششىق دورىلار', order: 2, icon: 'fas fa-pills', translations: { ug: 'پىششىق دورىلار', tr: 'Hazır & İşlenmiş İlaçlar', en: 'Prepared Medicines' } },
  { id: 'ئۆسۈملۈك دورىلار', name: 'ئۆسۈملۈك دورىلار', order: 3, icon: 'fas fa-leaf', translations: { ug: 'ئۆسۈملۈك دورىلار', tr: 'Şifalı Bitkiler & Otlar', en: 'Herbal Medicines' } },
  { id: 'تەبىئىي ياغلار', name: 'تەبىئىي ياغلار', order: 4, icon: 'fas fa-tint', translations: { ug: 'تەبىئىي ياغلار', tr: 'Doğal & Şifalı Yağlar', en: 'Natural Oils' } },
  { id: 'گۈزەللىك ۋە ساغلاملىق', name: 'گۈزەللىك ۋە ساغلاملىق', order: 5, icon: 'fas fa-heartbeat', translations: { ug: 'گۈزەللىك ۋە ساغلاملىق', tr: 'Güzellik & Sağlık', en: 'Beauty & Health' } },
  { id: 'گۈلقەنتلەر', name: 'گۈلقەنتلەر', order: 6, icon: 'fas fa-seedling', translations: { ug: 'گۈلقەنتلەر', tr: 'Gül Reçelleri & Macunlar', en: 'Rose Jams & Pastes' } },
  { id: 'قۇرۇق يەل-يېمىشلەر', name: 'قۇرۇق يەل-يېمىشلەر', order: 7, icon: 'fas fa-apple-alt', translations: { ug: 'قۇرۇق يەل-يېمىشلەر', tr: 'Kuru Meyve & Yemişler', en: 'Dried Fruits & Nuts' } },
  { id: 'مەدەنىيەت بۇيۇملىرى', name: 'مەدەنىيەت بۇيۇملىرى', order: 8, icon: 'fas fa-landmark', translations: { ug: 'مەدەنىيەت بۇيۇملىرى', tr: 'Kültür & Sanat Eşyaları', en: 'Cultural & Art Artifacts' } },
  { id: 'كىتاپ ۋە مەدەنىيەت', name: 'كىتاپ ۋە مەدەنىيەت', order: 9, icon: 'fas fa-book-open', translations: { ug: 'كىتاپ ۋە مەدەنىيەت', tr: 'Kitap & Kültür', en: 'Books & Culture' } }
];

const DEFAULT_MARQUEE_ITEMS = [
  {
    id: 'm1',
    badge: 'يەتكۈزۈش',
    text: '🚚 تېز ھەم ئىشەنچلىك يەتكۈزۈش — 1000 لىرادىن ئاشسا يەتكۈزۈش ھەقسىز',
    badgeStyle: 'badge-sale',
    enabled: true,
    translations: {
      tr: { badge: 'Teslimat', text: '🚚 Hızlı ve Güvenilir Teslimat — 1000 TL Üzeri Kargo Bedava!' },
      en: { badge: 'Shipping', text: '🚚 Fast & Reliable Delivery — Free Shipping on Orders Over 1000 TL / $30!' }
    }
  },
  {
    id: 'm2',
    badge: 'كاپالەت',
    text: '🛡️ سۈپەت كاپالىتى',
    badgeStyle: 'badge-featured',
    enabled: true,
    translations: {
      tr: { badge: 'Garanti', text: '🛡️ Kalite Garantisi' },
      en: { badge: 'Guarantee', text: '🛡️ Quality Guarantee' }
    }
  },
  {
    id: 'm3',
    badge: 'ئورالما',
    text: '📦 ئۆلچەملىك ئوراپ قاچىلاش',
    badgeStyle: 'badge-package',
    enabled: true,
    translations: {
      tr: { badge: 'Paketleme', text: '📦 Standart ve Özenli Paketleme' },
      en: { badge: 'Packaging', text: '📦 Standard & Secure Packaging' }
    }
  },
  {
    id: 'm4',
    badge: 'تەبىئىي',
    text: '🌱 ساپ ۋە تەبىئىي مەھسۇلاتلار',
    badgeStyle: 'badge-local',
    enabled: true,
    translations: {
      tr: { badge: 'Doğal', text: '🌱 Saf ve Doğal Ürünler' },
      en: { badge: 'Natural', text: '🌱 Pure & Natural Products' }
    }
  },
  {
    id: 'm5',
    badge: 'مۇلازىمەت',
    text: '🎧 24/7 ھەر قانداق سوئالىڭىزغا دەل ۋاقتىدا جاۋاب',
    badgeStyle: 'badge-service',
    enabled: true,
    translations: {
      tr: { badge: 'Destek', text: '🎧 7/24 Her Sorunuza Anında Cevap' },
      en: { badge: 'Support', text: '🎧 24/7 Prompt Answers to All Questions' }
    }
  },
  {
    id: 'm6',
    badge: 'سوۋغات',
    text: '🎁 ئىنىستىگېرام سەھىپىمىزگە ئەگىشىپ زاكاز بەرسىڭىز ھەقسىز سوۋغات بېرىلىدۇ!',
    badgeStyle: 'badge-insta',
    linkType: 'instagram',
    enabled: true,
    translations: {
      tr: { badge: 'Hediye', text: '🎁 Instagram sayfamızı takip edenlere siparişinde sürpriz hediye!' },
      en: { badge: 'Gift', text: '🎁 Follow our Instagram and get a free surprise gift with your order!' }
    }
  }
];

const INITIAL_SETTINGS = {
  storeName: 'تەكلىماكان سودا تورى',
  storeSlogan: 'سۈپەتلىك، گۈزەل، ئىشەنچلىك ئۇيغۇرچە تور دۇكىنىڭىز',
  currency: 'TRY', // default TRY (₺)
  contactPhone: '05551609999',
  contactEmail: 'xizmet@teklimakan.com',
  instagramUrl: 'https://www.instagram.com/teklimakan.online',
  announcement: '🚚 1000 لىرادىن ئارتۇق مال سېتىۋالسىڭىز يەتكۈزۈپ بېرىش ھەقسىز! | 1000 TL Üzeri Alışverişlerde Kargo Bedava! | Free Shipping on Orders Over 1000 TL!',
  marqueeItems: DEFAULT_MARQUEE_ITEMS,
  telegramEnabled: true,
  telegramBotToken: '8880936621:AAG7d5C4CPVyA8XiP0cPYUFYPfJmkF6DWZM',
  telegramChatId: '7077223578',
  emailNotificationEnabled: true,
  notificationEmail: 'uyghurmedicine.com@gmail.com',
  smtpPreset: 'gmail',
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUser: 'uyghurmedicine.com@gmail.com',
  smtpPass: '',
  smsEnabled: true,
  smsSenderName: 'تەكلىماكان',
  agentDailyRules: {
    enabled: true,
    pointsPerCheckin: 10,
    streak7BonusCommission: 1,
    inactivityThresholdDays: 3,
    dailyFlashDealsEnabled: true,
    dailyFlashDealsDiscount: 15
  },
  customerRetention: {
    luckyWheel: {
      enabled: true,
      dailySpinLimit: 1,
      title: 'ئامەت چاقى',
      subtitle: 'كۈندە 1 قېتىم ھەقسىز ئايلاندۇرۇپ، ئالاھىدە پۇل ئېتىبار كۇپونى ئۇتۇۋېلىڭ!',
      slices: [
        { id: 'sw1', text: '₺10 ئېتىبار', couponCode: 'LUCKY10', type: 'fixed', value: 10, minSpend: 100, color: '#f59e0b', weight: 30 },
        { id: 'sw2', text: '₺20 ئېتىبار', couponCode: 'LUCKY20', type: 'fixed', value: 20, minSpend: 200, color: '#10b981', weight: 25 },
        { id: 'sw3', text: '₺50 ئېتىبار', couponCode: 'LUCKY50', type: 'fixed', value: 50, minSpend: 400, color: '#ef4444', weight: 10 },
        { id: 'sw4', text: 'ھەقسىز يەتكۈزۈش', couponCode: 'LUCKYFREE', type: 'free_shipping', value: 35, minSpend: 150, color: '#8b5cf6', weight: 20 },
        { id: 'sw5', text: '%5 ئېتىبار', couponCode: 'LUCKY5PCT', type: 'percentage', value: 5, minSpend: 50, color: '#3b82f6', weight: 25 },
        { id: 'sw6', text: 'تەلەيلىك بولۇڭ', couponCode: '', type: 'none', value: 0, minSpend: 0, color: '#64748b', weight: 10 }
      ]
    },
    flashSale: {
      enabled: true,
      title: '⚡ ئالاھىدە ئېتىبارلىق مەھسۇلاتلار',
      subtitle: 'ھەر كۈنى چەكلىك ۋاقىتتا يېڭىلىنىدۇ، پۇرسەتنى چىڭ تۇتۇڭ!',
      discountPercentage: 20,
      productIds: []
    }
  }
};

class StoreManager {
  constructor() {
    // 💵 تىل بىلەن ماس قەدەمدە پۇل بىرلىكىنى بېكىتىش (ug/tr -> TRY, en -> USD)
    const currentLang = localStorage.getItem('teklimakan_language') || 'ug';
    this.currentCurrency = currentLang === 'en' ? 'USD' : 'TRY';
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENCY, this.currentCurrency);
    } catch (e) {}
    this.init();
  }

  init() {
    // تىرناق ئىچىدىكى خەتلەر ياكى كونا پۇل بىرلىكى قالغان بولسا ئاپتوماتىك تازىلاش
    const storedBrands = localStorage.getItem(STORAGE_KEYS.BRANDS);
    if (!storedBrands || storedBrands.includes('(')) {
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(INITIAL_BRANDS));
    }
    const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    let prods = [];
    try {
      prods = storedProducts ? JSON.parse(storedProducts) : [];
    } catch (e) {
      prods = [];
    }

    if (!Array.isArray(prods) || prods.length === 0) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      prods = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    }

    // ئابونت / باشقۇرغۇچى تەھرىرلىگەن ئۇچۇرلار ۋە ئۆچۈرۈلگەن تاۋارلارنى دەلىللەش
    const userEdits = this.getUserEdits();
    const deletedIds = this.getDeletedProductIds();
    let updated = false;

    // ئۆچۈرۈلگەنلەرنى چىقىرىۋېتىش
    if (deletedIds.length > 0) {
      const origLen = prods.length;
      prods = prods.filter(p => !deletedIds.includes(p.id));
      if (prods.length !== origLen) updated = true;
    }

    // 🛡️ تاۋارلاردىكى «???» ياكى ھەرپ كودلاش بۇزۇلۇشلىرىنى ئاپتوماتىك داۋالاش ۋە ئەسلىگە كەلتۈرۈش (Self-Healing Anti-Corruption Shield)
    const healProductRecord = (p) => {
      if (!p || typeof p !== 'object') return false;
      const isCorrupted = (str) => typeof str === 'string' && (/\?{2,}/.test(str) || str.includes('????') || str === '?????');
      const initMatch = INITIAL_PRODUCTS.find(ip => ip.id === p.id);
      let healed = false;

      if (isCorrupted(p.name)) {
        p.name = initMatch ? initMatch.name : (p.translations?.ug?.name && !isCorrupted(p.translations.ug.name) ? p.translations.ug.name : (p.translations?.tr?.name || p.id));
        healed = true;
      }
      if (isCorrupted(p.brand)) {
        p.brand = initMatch ? initMatch.brand : 'تەكلىماكان كىلاسسىك';
        healed = true;
      }
      if (isCorrupted(p.category)) {
        p.category = initMatch ? initMatch.category : 'ئۇيغۇر تىبابىتى';
        healed = true;
      }
      if (!p.unit || isCorrupted(p.unit) || p.unit.trim().length === 0) {
        p.unit = initMatch?.unit || p.translations?.unit || 'دانە';
        healed = true;
      }
      if (isCorrupted(p.description) && initMatch) {
        p.description = initMatch.description;
        healed = true;
      }
      if (initMatch && initMatch.translations) {
        if (!p.translations || isCorrupted(p.translations?.ug?.name)) {
          p.translations = JSON.parse(JSON.stringify(initMatch.translations));
          healed = true;
        }
      }
      if (!p.image || p.image.includes('default_product.jpg')) {
        if (initMatch?.image && !initMatch.image.includes('default_product.jpg')) {
          p.image = initMatch.image;
          healed = true;
        } else if (!p.image) {
          p.image = 'images/default_product.jpg';
          healed = true;
        }
      }
      return healed;
    };

    // ھەر بىر تاۋارغا ئابونتنىڭ يېقىنقى تەھرىرىنى قايتا سىڭدۈرۈش ۋە بۇزۇلغانلىرىنى داۋالاش
    prods = prods.map(p => {
      const wasHealed = healProductRecord(p);
      if (wasHealed) updated = true;

      if (userEdits && userEdits[p.id]) {
        updated = true;
        const ue = userEdits[p.id];
        let finalImg = ue.image;
        if (!finalImg || finalImg.includes('default_product.jpg')) {
          if (p.image && !p.image.includes('default_product.jpg')) {
            finalImg = p.image;
          }
        }
        const edited = { ...p, ...ue, image: finalImg || p.image || 'images/default_product.jpg', isUserEdited: true };
        healProductRecord(edited);
        return edited;
      }
      if (!p.unit) {
        p.unit = 'دانە';
        updated = true;
      }
      if (!p.approvalStatus) {
        p.approvalStatus = 'تەستىقلاندى';
        updated = true;
      }
      return p;
    });

    // ئابونت ساقلىغان تاۋارلار يەرلىك تىزىملىكتە بولمىسا دەرھال قوشۇش
    Object.values(userEdits).forEach(ue => {
      if (ue && ue.id && !deletedIds.includes(ue.id) && !prods.some(p => p.id === ue.id)) {
        healProductRecord(ue);
        prods.unshift(ue);
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prods));
    }
    const storedAgents = localStorage.getItem(STORAGE_KEYS.AGENTS);
    if (!storedAgents) {
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(INITIAL_AGENTS));
    }
    const storedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    let validCat = false;
    try {
      if (storedCategories) {
        const parsed = JSON.parse(storedCategories);
        if (Array.isArray(parsed) && parsed.length >= 6 && parsed.some(c => c.id === 'گۈلقەنتلەر')) {
          validCat = true;
        }
      }
    } catch(e) {}
    if (!validCat) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    } else {
      try {
        const curSet = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || {};
        curSet.telegramBotToken = curSet.telegramBotToken || INITIAL_SETTINGS.telegramBotToken;
        curSet.telegramChatId = curSet.telegramChatId || INITIAL_SETTINGS.telegramChatId;
        if (curSet.telegramEnabled === undefined) {
          curSet.telegramEnabled = INITIAL_SETTINGS.telegramEnabled !== false;
        }
        if (curSet.emailNotificationEnabled === undefined) {
          curSet.emailNotificationEnabled = true;
        }
        if (!curSet.notificationEmail) {
          curSet.notificationEmail = curSet.contactEmail || INITIAL_SETTINGS.notificationEmail;
        }
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(curSet));
      } catch (e) {}
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify([]));
    }

    // پەقەت لىرا (TRY) ۋە دوللار (USD) لا قوبۇل قىلىنىدۇ
    if (this.currentCurrency !== 'TRY' && this.currentCurrency !== 'USD') {
      this.currentCurrency = 'TRY';
      localStorage.setItem(STORAGE_KEYS.CURRENCY, 'TRY');
    }

    // 🛡️ 10 كۈندىن ئاشقان تاماملانغان ياكى بىكار قىلىنغان زاكازلارنىڭ شەخسىي ئۇچۇرىنى يۇيۇش (Privacy Wipe)
    try {
      this.anonymizeExpiredOrders(10);
    } catch (e) {}

    // ⏰ ھەپتىلىك ۋە ئايلىق دوكلاتلارنى دەۋرىيلىك ئاپتوماتىك يوللاش ۋە ئەۋەتىلگەندىن كېيىن ئاپتوماتىك تازىلاش (Auto-Clear)
    try {
      this.checkAndTriggerScheduledReports();
      this.checkAndAutoClearExpiredReports();
      if (!window._teklimakanReportTimerInterval) {
        window._teklimakanReportTimerInterval = setInterval(() => {
          this.checkAndTriggerScheduledReports();
          this.checkAndAutoClearExpiredReports();
        }, 60 * 1000);
      }
    } catch (e) {}

    // ☁️ بۇلۇتتىكى يېڭى مەزمۇنلارنى ھەر ئۈسكۈنىگە دەرھال تارقىتىش (Realtime)
    if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.subscribeToChanges === 'function') {
      window.TeklimakanSupabase.subscribeToChanges(change => this.applyCloudChange(change));
    }

    // ☁️ Supabase بۇلۇت ئامبىرى بىلەن دەسلەپكى ۋە دەل ۋاقتىدا ماسلاشتۇرۇش
    this.syncWithSupabase();
    window.addEventListener('online', () => {
      this.syncWithSupabase();
      if (window.TeklimakanSupabase?.reconnectRealtime) window.TeklimakanSupabase.reconnectRealtime();
    });
    window.addEventListener('focus', () => {
      this.syncWithSupabase();
      if (window.TeklimakanSupabase?.reconnectRealtime) window.TeklimakanSupabase.reconnectRealtime();
    });
    window.addEventListener('pageshow', () => {
      this.syncWithSupabase();
      if (window.TeklimakanSupabase?.reconnectRealtime) window.TeklimakanSupabase.reconnectRealtime();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.syncWithSupabase();
        if (window.TeklimakanSupabase?.reconnectRealtime) window.TeklimakanSupabase.reconnectRealtime();
      }
    });

    // 📲 كۆچمە تېلېفونلاردا دەل ۋاقتىدا يېڭىلىنىش كاپالىتى (Mobile Heartbeat - ھەر 30 سېكۇنتتا قەرەللىك ماسلىشىدۇ)
    setInterval(() => {
      if (document.visibilityState !== 'hidden') {
        this.syncWithSupabase();
        if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.isRealtimeConnected === 'function') {
          if (!window.TeklimakanSupabase.isRealtimeConnected()) {
            window.TeklimakanSupabase.reconnectRealtime?.();
          }
        }
      }
    }, 30000);

    // 🔄 باشقا بەتلەرنىڭ يېڭىلىنىش پۇلسىنى كۆرۈش
    window.addEventListener('storage', (e) => {
      if (e.key === 'teklimakan_store_sync_pulse' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          window.dispatchEvent(new CustomEvent('uyghur_store_sync', { detail: parsed }));
        } catch(err) {}
      }
    });
  }

  applyCloudChange(change) {
    const { table, eventType, new: newRow, old: oldRow } = change;
    const row = eventType === 'DELETE' ? oldRow : newRow;
    if (!row || !row.id) return;

    if (table === 'products') {
      const products = this.getProducts();
      const index = products.findIndex(product => product.id === row.id);
      if (eventType === 'DELETE') {
        if (index !== -1) products.splice(index, 1);
        this.markProductDeleted(row.id);
      } else {
        // ئەگەر بۇ تاۋار ئۆچۈرۈلگەنلەر تىزىملىكىدە بولسا، ھەرگىز قايتا قوشۇلمايدۇ ۋە بۇلۇتتىنمۇ يۇيۇۋېتىلىدۇ
        if (this.getDeletedProductIds().includes(row.id)) {
          if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.deleteProduct === 'function') {
            window.TeklimakanSupabase.deleteProduct(row.id);
          }
          return;
        }
        const previousProduct = index === -1 ? null : products[index];
        const product = {
          id: row.id,
          name: row.name,
          brand: row.brand || '',
          category: row.category || '',
          price: Number(row.price),
          oldPrice: row.old_price ? Number(row.old_price) : null,
          stock: Number(row.stock || 0),
          unit: row.translations?.unit || 'دانە',
          sales: Number(row.sales || 0),
          rating: Number(row.rating || 5),
          ratingCount: Number(row.rating_count || 1),
          image: (row.image && !row.image.includes('default_product.jpg')) 
            ? row.image 
            : ((previousProduct?.image && !previousProduct.image.includes('default_product.jpg')) ? previousProduct.image : (row.image || 'images/default_product.jpg')),
          description: row.description || '',
          badge: row.badge || '',
          featured: !!row.featured,
          approvalStatus: row.approval_status || 'تەستىقلاندى',
          languageScope: row.language_scope || 'all',
          merchantBadge: row.merchant_badge || 'ئىشەنچىلىك سودىگەر',
          agentId: row.agent_id || null,
          agentName: row.agent_name || null,
          translations: row.translations || {},
          createdAt: row.created_at || new Date().toISOString(),
          updatedAt: (row.translations && row.translations.updatedAt) || row.updated_at || row.created_at || new Date().toISOString(),
          isUserEdited: !!(row.translations?.isUserEdited || row.is_user_edited)
        };
        product.translations = this.prepareProductTranslations(product, previousProduct);
        if (index === -1) products.unshift(product);
        else products[index] = product;
        if (product.isUserEdited) this.saveUserEdit(product);
      }
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.notifyDataChange('products', { productId: row.id, eventType });
      return;
    }

    if (table === 'agents') {
      let agents = this.getAgents('none');
      const index = agents.findIndex(a => a.id === row.id);
      if (eventType === 'DELETE') {
        if (index !== -1) agents.splice(index, 1);
        this.markAgentDeleted(row.id);
      } else {
        if (this.getDeletedAgentIds().includes(row.id)) {
          if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.deleteAgent === 'function') {
            window.TeklimakanSupabase.deleteAgent(row.id);
          }
          return;
        }
        if (index !== -1) {
          agents[index] = { ...agents[index], ...row };
        } else {
          agents.unshift(row);
        }
      }
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
      this.notifyDataChange('agents', { agentId: row.id, eventType });
      return;
    }

    if (table === 'orders') {
      const orders = this.getOrders();
      const index = orders.findIndex(order => String(order.id) === String(row.id));
      if (eventType === 'DELETE') {
        if (index !== -1) orders.splice(index, 1);
      } else {
        const order = {
          id: row.id,
          customer: row.customer,
          items: row.items,
          subtotalCny: Number(row.subtotal_cny || 0),
          discountCny: Number(row.discount_cny || 0),
          deliveryFeeCny: Number(row.delivery_fee_cny || 0),
          totalCny: Number(row.total_cny || 0),
          totalFormatted: row.total_formatted || '',
          paymentMethod: row.payment_method || '',
          status: row.status || 'ساقلاۋاتىدۇ',
          date: row.date || '',
          notes: row.notes || '',
          language: row.language || 'ug',
          currency: row.currency || 'TRY',
          cargoCarrier: row.tracking_carrier || '',
          cargoTrackingNo: row.tracking_number || '',
          shippedAt: row.shipped_at || null,
          completedAt: row.completed_at || null
        };
        if (index === -1) orders.unshift(order);
        else orders[index] = order;
      }
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.notifyDataChange('orders');
    }
  }

  async syncWithSupabase() {
    if (!window.TeklimakanSupabase) return;
    if (this._isSyncingSupabase) return;
    this._isSyncingSupabase = true;
    try {
      // 1. مەھسۇلاتلارنى بۇلۇتتىن يېڭىلاش
      const remoteProducts = await window.TeklimakanSupabase.fetchProducts();
      if (Array.isArray(remoteProducts) && remoteProducts.length > 0) {
        const localProds = this.getProducts();
        const userEdits = this.getUserEdits();
        const deletedIds = this.getDeletedProductIds();
        const localMap = new Map();
        localProds.forEach(p => localMap.set(p.id, p));
        const map = new Map();
        const rpIds = new Set();

        // 2) بۇلۇتتىن كەلگەن تاۋارلارنى بىرلەشتۈرۈش
        let editsUpdated = false;
        remoteProducts.forEach(rp => {
          if (deletedIds.includes(rp.id)) {
            if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.deleteProduct === 'function') {
              window.TeklimakanSupabase.deleteProduct(rp.id);
            }
            return;
          }
          rpIds.add(rp.id);

          const localItem = localMap.get(rp.id);
          const isLocallyEdited = !!(localItem?.isUserEdited || userEdits[rp.id]);
          const isCloudEdited = !!(rp.translations && rp.translations.isUserEdited);

          const cloudUpdated = rp.updated_at || (rp.translations && rp.translations.updatedAt) || rp.created_at || '';
          const localUpdated = localItem?.updatedAt || (userEdits[rp.id]?.updatedAt) || '';

          const cloudTime = cloudUpdated ? new Date(cloudUpdated).getTime() : 0;
          const localTime = localUpdated ? new Date(localUpdated).getTime() : 0;

          const isInvalidLocalImage = !localItem?.image || localItem.image.includes('default_product.jpg');
          const hasValidCloudImage = rp.image && !rp.image.includes('default_product.jpg');

          // 🛡️ ئەگەر يەرلىك نۇسخا تېخىمۇ يېڭى تەھرىرلەنگەن بولسا، يەرلىك نۇسخا كۈچكە ئىگە، ھەرگىز قاپلانمايدۇ:
          if (localItem && isLocallyEdited && localTime > cloudTime) {
            // ئەمما ئەگەر يەرلىكتە رەسىم يوق ياكى default بولۇپ بۇلۇتتا ھەقىقىي رەسىم بار بولسا، بۇلۇتتىكى رەسىمنى يەرلىككە بېرىمىز
            if (isInvalidLocalImage && hasValidCloudImage) {
              localItem.image = rp.image;
              if (userEdits[rp.id]) {
                userEdits[rp.id].image = rp.image;
                editsUpdated = true;
              }
            }
            // بۇلۇتقا يېڭى يەرلىك نۇسخىنى ماس قەدەمدە قايتا ئەۋەتىپ كاپالەتلەندۈرۈش
            if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.upsertProduct === 'function') {
              window.TeklimakanSupabase.upsertProduct(localItem);
            }
            return;
          }

          // 🛡️ ئەگەر بۇلۇتتىكى نۇسخا يېڭى تەھرىرلەنگەن بولسا (تېلېفوندىن ياكى باشقا ئۈسكۈنىدىن)، بۇلۇتتىكى يېڭى مەزمۇن قوبۇل قىلىنىدۇ:
          const isCorrupted = (str) => typeof str === 'string' && (/\?{2,}/.test(str) || str.includes('????') || str === '?????');
          const normalizeUnit = (u) => {
            if (!u || typeof u !== 'string') return 'دانە';
            let s = u.trim();
            if (!s || isCorrupted(s)) return 'دانە';
            const midGram = s.match(/^گ[ىي]?را\s*(\d+)\s*م$/i);
            if (midGram) return `${midGram[1]} گرام`;
            if (/^كىلو\s*1$/i.test(s) || /^1\s*كىلو$/i.test(s)) return 'كىلو';
            if (/^دانە\s*1$/i.test(s) || /^1\s*دانە$/i.test(s)) return 'دانە';
            if (/^قۇتا\s*1$/i.test(s) || /^1\s*قۇتا$/i.test(s)) return 'قۇتا';
            const trailGram = s.match(/^(گ[ىي]?رام)\s*(\d+)$/i);
            if (trailGram) return `${trailGram[2]} گرام`;
            return s;
          };
          window.normalizeProductUnit = normalizeUnit;
          const initMatch = INITIAL_PRODUCTS.find(ip => ip.id === rp.id);

          const safeName = isCorrupted(rp.name) ? (localItem?.name && !isCorrupted(localItem.name) ? localItem.name : initMatch?.name || rp.name) : rp.name;
          const safeBrand = isCorrupted(rp.brand) ? (localItem?.brand && !isCorrupted(localItem.brand) ? localItem.brand : initMatch?.brand || 'تەكلىماكان كىلاسسىك') : (rp.brand || 'تەكلىماكان كىلاسسىك');
          const safeCat = isCorrupted(rp.category) ? (localItem?.category && !isCorrupted(localItem.category) ? localItem.category : initMatch?.category || 'ئۇيغۇر تىبابىتى') : (rp.category || 'ئۇيغۇر تىبابىتى');
          const rawUnit = (rp.translations?.unit && !isCorrupted(rp.translations.unit)) ? rp.translations.unit : (localItem?.unit || initMatch?.unit || 'دانە');
          const safeUnit = normalizeUnit(rawUnit);
          const safeDesc = isCorrupted(rp.description) ? (localItem?.description && !isCorrupted(localItem.description) ? localItem.description : initMatch?.description || '') : (rp.description || '');

          const safeTranslations = (rp.translations && typeof rp.translations === 'object') ? rp.translations : (localItem?.translations || initMatch?.translations || {});
          safeTranslations.unit = safeUnit;
          if (safeTranslations.ug) safeTranslations.ug.unit = safeUnit;

          // رەسىم ئەڭ پۇختا بولغان نۇسخىدىن تاللىنىدۇ
          let chosenImage = rp.image;
          // ئەگەر رەسىم ئەسلىدىكى كونا Unsplash ياكى خاتا سۈرەت بولسا، مەخسۇس ھۆججەت ياكى يەرلىك سۈرەتكە يېڭىلاش
          if (rp.id === 'PRD-420' && (!chosenImage || chosenImage.includes('photo-1509358271058') || chosenImage.length < 500)) {
            chosenImage = (localItem?.image && !localItem.image.includes('photo-1509358271058') && localItem.image.length > 500) ? localItem.image : 'images/products/PRD-420.jpg';
          } else if (rp.id === 'PRD-398' && (!chosenImage || chosenImage.includes('photo-1584308666744') || chosenImage.length < 500)) {
            chosenImage = (localItem?.image && !localItem.image.includes('photo-1584308666744') && localItem.image.length > 500) ? localItem.image : 'images/products/PRD-398.jpg';
          } else if (rp.id === 'PRD-113' && (!chosenImage || chosenImage.includes('photo-1595475207225') || (localItem?.image && localItem.image.includes('PRD-103')))) {
            chosenImage = 'images/products/PRD-113.jpg';
          } else if (rp.id === 'PRD-103' && (!chosenImage || chosenImage.includes('photo-1563729784474'))) {
            chosenImage = 'images/products/PRD-103.jpg';
          } else if (!chosenImage || chosenImage.includes('default_product.jpg')) {
            chosenImage = (localItem?.image && !localItem.image.includes('default_product.jpg'))
              ? localItem.image
              : (initMatch?.image && !initMatch.image.includes('default_product.jpg') ? initMatch.image : (rp.image || localItem?.image || 'images/default_product.jpg'));
          } else if (localItem?.image && !localItem.image.includes('default_product.jpg') && (localItem.image.startsWith('data:image/') || localItem.image.includes('images/products/')) && typeof rp.image === 'string' && rp.image.includes('unsplash.com')) {
            // ئەگەر يەرلىكتە مەخسۇس يۈكلەنگەن ياكى تەييارلانغان رەسىم بولۇپ بۇلۇتتا پەقەت كونا unsplash تۇرسا، يەرلىك نۇسخىنى ساقلاپ قېلىش
            chosenImage = localItem.image;
          }

          const safeItem = {
            id: rp.id,
            name: safeName,
            brand: safeBrand,
            category: safeCat,
            price: Number(rp.price),
            oldPrice: rp.old_price ? Number(rp.old_price) : null,
            stock: rp.stock !== undefined ? Number(rp.stock) : 0,
            unit: safeUnit,
            sales: rp.sales || 0,
            rating: Number(rp.rating || 5.0),
            ratingCount: rp.rating_count || 1,
            image: chosenImage,
            description: safeDesc,
            badge: rp.badge || '',
            featured: !!rp.featured,
            approvalStatus: rp.approval_status || 'تەستىقلاندى',
            languageScope: rp.language_scope || 'all',
            merchantBadge: rp.merchant_badge || 'ئىشەنچىلىك سودىگەر',
            agentId: rp.agent_id || null,
            agentName: rp.agent_name || null,
            translations: safeTranslations,
            isUserEdited: isCloudEdited || isLocallyEdited,
            updatedAt: cloudUpdated || localUpdated || new Date().toISOString()
          };
          safeItem.translations = this.prepareProductTranslations(safeItem, localItem);

          map.set(rp.id, safeItem);

          if (isCloudEdited || (hasValidCloudImage && isInvalidLocalImage)) {
            userEdits[rp.id] = safeItem;
            editsUpdated = true;
          }

          // ئەگەر بۇلۇتتىكى مەلۇمات خەت كودلىنىشى جەھەتتە بۇزۇلۇپ قالغان بولسا، دەرھال ساغلام سانلىق مەلۇماتنى بۇلۇتقا قايتا داۋالاپ يوللاش
          if ((isCorrupted(rp.name) || isCorrupted(rp.category)) && window.TeklimakanSupabase && typeof window.TeklimakanSupabase.upsertProduct === 'function') {
            window.TeklimakanSupabase.upsertProduct(safeItem);
          }
        });

        if (editsUpdated) {
          try {
            localStorage.setItem(STORAGE_KEYS.USER_EDITS, JSON.stringify(userEdits));
          } catch(e) {}
        }

        // پەقەت تېخى بۇلۇتقا يۈكلەنمىگەن يەرلىك كۈتۈۋاتقان يېڭى تاۋارلارلا ساقلىنىدۇ
        localProds.forEach(p => {
          if (!rpIds.has(p.id) && !deletedIds.includes(p.id) && p.approvalStatus === 'تەستىق كۈتۈۋاتىدۇ') {
            map.set(p.id, p);
          }
        });

        const merged = Array.from(map.values());
        const mergedStr = JSON.stringify(merged);
        const currentProductsStr = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        if (mergedStr !== currentProductsStr) {
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, mergedStr);
          this.notifyDataChange('products');
        }
      } else if (Array.isArray(remoteProducts) && remoteProducts.length === 0) {
        // ئەگەر Supabase ئامبىرى يېڭى ھەم قۇرۇق بولسا، دەسلەپكى تاۋارلارنى بۇلۇتقا قاچىلاش
        const currentProds = this.getProducts();
        currentProds.forEach(p => {
          if (!this.getDeletedProductIds().includes(p.id)) {
            window.TeklimakanSupabase.upsertProduct(p);
          }
        });
      }

      // 2. زاكازلارنى بۇلۇتتىن يېڭىلاش
      const remoteOrders = await window.TeklimakanSupabase.fetchOrders();
      if (Array.isArray(remoteOrders) && remoteOrders.length > 0) {
        const localOrders = this.getOrders();
        const oMap = new Map();
        localOrders.forEach(o => oMap.set(o.id, o));
        remoteOrders.forEach(ro => {
          oMap.set(ro.id, {
            id: ro.id,
            customer: ro.customer,
            items: ro.items,
            subtotalCny: Number(ro.subtotal_cny || 0),
            discountCny: Number(ro.discount_cny || 0),
            deliveryFeeCny: Number(ro.delivery_fee_cny || 0),
            totalCny: Number(ro.total_cny || 0),
            totalFormatted: ro.total_formatted,
            paymentMethod: ro.payment_method,
            status: ro.status,
            date: ro.date,
            notes: ro.notes,
            language: ro.language,
            currency: ro.currency,
            trackingCarrier: ro.tracking_carrier,
            trackingNumber: ro.tracking_number,
            shippedAt: ro.shipped_at
          });
        });
        const mergedOrders = Array.from(oMap.values());
        const ordersStr = JSON.stringify(mergedOrders);
        const currentOrdersStr = localStorage.getItem(STORAGE_KEYS.ORDERS);
        if (ordersStr !== currentOrdersStr) {
          localStorage.setItem(STORAGE_KEYS.ORDERS, ordersStr);
          this.notifyDataChange('orders');
        }
      }

      // 3. ۋاكالەتچىلەرنى بۇلۇتتىن يېڭىلاش
      const remoteAgents = await window.TeklimakanSupabase.fetchAgents();
      const deletedAgentIds = this.getDeletedAgentIds();
      if (Array.isArray(remoteAgents) && remoteAgents.length > 0) {
        const localAgents = this.getAgents('none');
        const localMap = new Map();
        localAgents.forEach(a => localMap.set(a.id, a));
        const aMap = new Map();
        remoteAgents.forEach(ra => {
          if (deletedAgentIds.includes(ra.id)) {
            if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.deleteAgent === 'function') {
              window.TeklimakanSupabase.deleteAgent(ra.id);
            }
            return;
          }
          let authorizedBrands = [];
          let password = '';
          let trustedDevices = [];
          if (Array.isArray(ra.authorized_brands)) {
            ra.authorized_brands.forEach(item => {
              if (typeof item === 'string') {
                authorizedBrands.push(item);
              } else if (item && typeof item === 'object') {
                if (item.password) password = item.password;
                if (Array.isArray(item.trustedDevices)) trustedDevices = item.trustedDevices;
                if (item.proposedBrands) proposedBrands = item.proposedBrands;
                if (item.notes) notes = item.notes;
                if (item.legalAgreement) legalAgreement = item.legalAgreement;
                if (item.suspendedUntil) suspendedUntil = item.suspendedUntil;
                if (item.suspensionReason) suspensionReason = item.suspensionReason;
              }
            });
          }

          const existingLocal = localMap.get(ra.id) || {};
          aMap.set(ra.id, {
            ...existingLocal,
            password: password || existingLocal.password || '',
            trustedDevices: trustedDevices.length > 0 ? trustedDevices : (existingLocal.trustedDevices || []),
            id: ra.id,
            name: ra.name,
            email: ra.email,
            phone: ra.phone,
            city: ra.city || existingLocal.city || 'ئىستانبۇل',
            status: ra.status || existingLocal.status || 'تەستىقلاندى',
            reputation: ra.reputation || existingLocal.reputation || 'ئىشەنچىلىك سودىگەر',
            canPublishMultilingual: !!ra.can_publish_multilingual,
            authorizedBrands: authorizedBrands.length > 0 ? authorizedBrands : (existingLocal.authorizedBrands || []),
            registeredAt: ra.registered_at || existingLocal.registeredAt,
            authExpireDate: ra.auth_expire_date || existingLocal.authExpireDate,
            certCode: ra.cert_code || existingLocal.certCode,
            productsCount: ra.products_count !== undefined ? ra.products_count : (existingLocal.productsCount || 0),
            salesTotal: Number(ra.sales_total !== undefined ? ra.sales_total : (existingLocal.salesTotal || 0)),
            monthlySales: Number(ra.monthly_sales !== undefined ? ra.monthly_sales : (existingLocal.monthlySales || 0)),
            monthlyOrders: Number(ra.monthly_orders !== undefined ? ra.monthly_orders : (existingLocal.monthlyOrders || 0)),
            commissionRate: Number(ra.commission_rate || existingLocal.commissionRate || 15),
            violationsCount: Number(ra.violations_count || existingLocal.violationsCount || 0),
            suspendedUntil: suspendedUntil || existingLocal.suspendedUntil || null,
            suspensionReason: suspensionReason || existingLocal.suspensionReason || '',
            proposedBrands: existingLocal.proposedBrands || proposedBrands,
            notes: existingLocal.notes || notes,
            legalAgreement: existingLocal.legalAgreement || legalAgreement || (ra.cert_code ? {
              contractNumber: ra.cert_code,
              signedAt: ra.registered_at || new Date().toISOString(),
              agentName: ra.name,
              agentEmail: ra.email,
              agentPhone: ra.phone,
              liabilityClauseAccepted: true,
              fiveRulesAccepted: true
            } : null)
          });
        });
        const mergedAgents = Array.from(aMap.values());
        const agentsStr = JSON.stringify(mergedAgents);
        const currentAgentsStr = localStorage.getItem(STORAGE_KEYS.AGENTS);
        if (agentsStr !== currentAgentsStr) {
          localStorage.setItem(STORAGE_KEYS.AGENTS, agentsStr);
          this.notifyDataChange('agents');
        }
      } else if (Array.isArray(remoteAgents) && remoteAgents.length === 0) {
        // ئەگەر بۇلۇتتا ۋاكالەتچى بولمىسا، يەرلىكتىكى بار ۋاكالەتچىلەرنى بۇلۇتقا زاپاس يوللاش
        const localAgents = this.getAgents('none');
        localAgents.forEach(a => {
          if (!deletedAgentIds.includes(a.id)) {
            window.TeklimakanSupabase.upsertAgent(a);
          }
        });
      }
    } catch (e) {
      console.warn('Supabase ماسلىشىش خاتالىقى:', e);
    } finally {
      this._isSyncingSupabase = false;
    }
  }

  trackCloudWrite(write, operation) {
    Promise.resolve(write).then(saved => {
      if (saved) return;
      throw new Error('Supabase rejected the write.');
    }).catch(error => {
      console.error(`Cloud ${operation} failed:`, error);
      window.dispatchEvent(new CustomEvent('teklimakan_cloud_sync_error', { detail: { operation } }));
    });
  }

  // ==================== پۇل بىرلىكى (Currency) ====================
  getCurrency() {
    return this.currentCurrency;
  }

  getCurrencyInfo() {
    return CURRENCY_RATES[this.currentCurrency] || CURRENCY_RATES['TRY'];
  }

  setCurrency(cur) {
    if (CURRENCY_RATES[cur]) {
      this.currentCurrency = cur;
      localStorage.setItem(STORAGE_KEYS.CURRENCY, cur);
      this.notifyDataChange('currency');
    }
  }

  // باھاسىنى ھازىرقى تاللانغان پۇلغا ئايلاندۇرۇش (ئاساسىي پۇل: لىرا ₺)
  convertPrice(amountInTry) {
    const info = this.getCurrencyInfo();
    return Math.round(Number(amountInTry || 0) * (info ? info.rate : 1.0));
  }

  formatPrice(amountInTry) {
    const info = this.getCurrencyInfo();
    const rate = info ? info.rate : 1.0;
    const num = Number(amountInTry);
    const validAmount = isNaN(num) ? 0 : num;
    const converted = Math.round(validAmount * rate);
    const formattedNum = converted.toLocaleString('en-US');
    if (this.currentCurrency === 'USD') {
      return `$${formattedNum}`;
    }
    return `${formattedNum} ₺`;
  }

  getFreeShippingThreshold() {
    return this.getCurrencyInfo().freeThreshold;
  }

  // ==================== ۋاكالەتچىلەر ۋە ماركا رۇخسىتى (Agents & Brand Auth) ====================
  getAgents(sortBy = 'name') {
    let agents = JSON.parse(localStorage.getItem(STORAGE_KEYS.AGENTS)) || INITIAL_AGENTS;
    const deletedAgentIds = this.getDeletedAgentIds();
    if (Array.isArray(deletedAgentIds) && deletedAgentIds.length > 0) {
      agents = agents.filter(a => a && a.id && !deletedAgentIds.includes(a.id));
    }

    // بارلىق ۋاكالەتچىلەرنىڭ شەھەر، سېتىش سوممىسى ۋە كومىسسىيەلىرىنى تولۇقلاش
    let updated = false;
    const defaultCities = ['ئىستانبۇل (فاتىھ)', 'ئەنقەرە (چانکايالىق)', 'بۇرسا (نىلۈفەر)', 'ئىستانبۇل (زەيتىنبۇرنۇ)', 'ئىزمىر (قوناق)', 'كونيە (مەرام)'];
    agents = agents.map((a, i) => {
      let mod = false;
      if (!a.city) { a.city = defaultCities[i % defaultCities.length]; mod = true; }
      if (a.salesTotal === undefined) { a.salesTotal = (a.productsCount || 1) * 7200; mod = true; }
      if (a.monthlySales === undefined) { a.monthlySales = Math.round((a.salesTotal || 10000) * 0.42); mod = true; }
      if (a.monthlyOrders === undefined) { a.monthlyOrders = Math.max(3, Math.round((a.monthlySales || 5000) / 700)); mod = true; }
      if (!a.commissionRate) { a.commissionRate = 15; mod = true; }
      if (!a.authExpireDate) { a.authExpireDate = '2027-08-15'; mod = true; }
      if (!a.certCode) { a.certCode = 'TK-CERT-2026-' + (a.id ? a.id.replace(/\D/g, '') : (100 + i)); mod = true; }
      if (a.canPublishMultilingual === undefined) { a.canPublishMultilingual = false; mod = true; }
      if (a.violationsCount === undefined) { a.violationsCount = 0; mod = true; }
      if (a.suspendedUntil === undefined) { a.suspendedUntil = null; mod = true; }
      if (a.suspensionReason === undefined) { a.suspensionReason = ''; mod = true; }
      if (a.checkInStreak === undefined) { a.checkInStreak = (i % 2 === 0 ? 3 : 1); mod = true; }
      if (a.lastCheckInDate === undefined) { 
        const d = new Date();
        if (i % 3 === 0) d.setDate(d.getDate() - 1);
        a.lastCheckInDate = d.toISOString().split('T')[0]; 
        mod = true; 
      }
      if (a.checkInPoints === undefined) { a.checkInPoints = (a.checkInStreak || 1) * 10; mod = true; }
      if (a.isExemptFromDailyRule === undefined) { a.isExemptFromDailyRule = false; mod = true; }
      if (a.inactivityStatus === undefined) { a.inactivityStatus = 'active'; mod = true; }
      if (a.dailyViewsCount === undefined) { a.dailyViewsCount = Math.floor(15 + Math.random() * 30); mod = true; }

      // ⏳ ئەگەر ۋاكالەتچىنىڭ توختىتىلىش قەرەلى توشقان بولسا، ئاپتوماتىك ئەسلىگە كەلتۈرۈش
      if (a.suspendedUntil && a.status === 'توختىتىلدى') {
        const expireMs = new Date(a.suspendedUntil).getTime();
        if (Date.now() >= expireMs) {
          a.status = 'تەستىقلاندى';
          a.suspendedUntil = null;
          a.suspensionReason = '';
          mod = true;
        }
      }

      if (mod) updated = true;
      return a;
    });

    if (updated) {
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
    }

    if (sortBy === 'name') {
      agents.sort((a, b) => a.name.localeCompare(b.name, 'ug'));
    }
    return agents;
  }

  getAgentById(id) {
    const agents = this.getAgents();
    return agents.find(a => a.id === id) || null;
  }

  getAgentPerformanceTier(agent) {
    const monthlySales = Number(agent.monthlySales !== undefined ? agent.monthlySales : (agent.salesTotal || 0) * 0.42);
    const monthlyOrders = Number(agent.monthlyOrders || 0);

    if (monthlySales >= 15000 || monthlyOrders >= 25) {
      return {
        key: 'gold',
        tier: 'gold',
        title: 'ئالتۇن دەرىجىلىك',
        badge: '👑 ئالتۇن دەرىجە',
        badgeLabel: '👑 ئالتۇن دەرىجە',
        iconEmoji: '👑',
        textColor: '#b45309',
        badgeBg: '#fef3c7',
        badgeBorder: '#fde68a',
        badgeText: '#92400e',
        avatarBg: 'linear-gradient(135deg, #f59e0b, #b45309)',
        avatarShadow: '0 4px 12px rgba(245, 158, 11, 0.45)',
        avatarRing: '#fef3c7',
        starCount: '⭐⭐⭐'
      };
    } else if (monthlySales >= 8000 || monthlyOrders >= 10) {
      return {
        key: 'silver',
        tier: 'silver',
        title: 'كۈمۈش دەرىجىلىك',
        badge: '⭐ كۈمۈش دەرىجە',
        badgeLabel: '⭐ كۈمۈش دەرىجە',
        iconEmoji: '⭐',
        textColor: '#1d4ed8',
        badgeBg: '#e0f2fe',
        badgeBorder: '#bae6fd',
        badgeText: '#0369a1',
        avatarBg: 'linear-gradient(135deg, #0284c7, #1d4ed8)',
        avatarShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
        avatarRing: '#e0f2fe',
        starCount: '⭐⭐'
      };
    } else {
      return {
        key: 'bronze',
        tier: 'bronze',
        title: 'مىس / يېڭى',
        badge: '🥉 مىس دەرىجە',
        badgeLabel: '🥉 مىس دەرىجە',
        iconEmoji: '🥉',
        textColor: '#7c3aed',
        badgeBg: '#f3e8ff',
        badgeBorder: '#e9d5ff',
        badgeText: '#6b21a8',
        avatarBg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
        avatarShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
        avatarRing: '#ede9fe',
        starCount: '⭐'
      };
    }
  }

  getMonthlyAgentPerformanceSummary(customPeriod) {
    const agents = this.getAgents('name');
    let totalSales = 0;
    let totalOrders = 0;
    let totalCommission = 0;

    const list = agents.map(a => {
      const tier = this.getAgentPerformanceTier(a);
      const mSales = Number(a.monthlySales || 0);
      const mOrders = Number(a.monthlyOrders || 0);
      const rate = Number(a.commissionRate !== undefined ? a.commissionRate : 15);
      const mCommission = Math.round(mSales * (rate / 100));

      totalSales += mSales;
      totalOrders += mOrders;
      totalCommission += mCommission;

      return {
        id: a.id,
        name: a.name,
        phone: a.phone || '-',
        email: a.email || '-',
        city: a.city || 'ئىستانبۇل',
        status: a.status,
        monthlySales: mSales,
        monthlyOrders: mOrders,
        commissionRate: rate,
        monthlyCommission: mCommission,
        tier: tier.key,
        tierKey: tier.key,
        badgeLabel: tier.badge,
        tierBadge: tier.badge,
        tierTitle: tier.title,
        certCode: a.certCode || '',
        authorizedBrands: a.authorizedBrands || [],
        commissionPeriod: a.commissionPeriod || '2026-يىلى 9-ئاي',
        commissionPayoutDay: a.commissionPayoutDay || 'ھەر ئاينىڭ 15-كۈنى'
      };
    });

    const savedPeriod = customPeriod || localStorage.getItem('teklimakan_summary_period') || '2026-يىلى 9-ئاي';

    return {
      monthTitle: savedPeriod,
      generatedDate: new Date().toISOString().split('T')[0],
      totalAgents: agents.length,
      totalSales,
      totalOrders,
      totalCommission,
      list,
      agents: list
    };
  }

  // ==================== 💌 نۆل سېتىش ۋاكالەتچىلەر رېغبەتلەندۈرۈش ئۇچۇرى تەڭشىكى (Encouragement Message Template) ====================
  getZeroSalesEncouragementTemplate() {
    const defaultTemplate = `ھۆرمەتلىك {name}، بۇ ھەپتىلىك ھەمكارلىقىڭىزغا كۆپ تەشەككۈر! گەرچە بۇ ھەپتە تاۋارلىرىڭىزدىن زاكاز چىقمىغان بولسىمۇ، تەكلىماكان سۇپىمىزدا يېڭى پائالىيەت ۋە مەخسۇس ئېتىبار كۇپونلىرىمىز تەييارلاندى. ئىجتىمائىي تاراتقۇلاردا مەھسۇلات ئۇلانمىلىرىڭىزنى كۆپرەك ھەمبەھىرلەپ، كېلەر ھەپتىلىك ئالتۇن دەرىجىلىك يۇقىرى كىرىمگە بىرلىكتە ئېرىشەيلى! كۈچ چىقىرىڭ، بىز سىزنى باشتىن-ئاخىر قوللايمىز! 🌟 تەكلىماكان سودا تورى`;
    return localStorage.getItem('teklimakan_zero_sales_encouragement_template') || defaultTemplate;
  }

  saveZeroSalesEncouragementTemplate(newTemplate) {
    if (!newTemplate || typeof newTemplate !== 'string') return false;
    localStorage.setItem('teklimakan_zero_sales_encouragement_template', newTemplate.trim());
    return true;
  }

  resetZeroSalesEncouragementTemplate() {
    localStorage.removeItem('teklimakan_zero_sales_encouragement_template');
    return this.getZeroSalesEncouragementTemplate();
  }

  getCustomAgentEncouragement(agentId) {
    try {
      const customs = JSON.parse(localStorage.getItem('teklimakan_custom_agent_encouragements') || '{}');
      return customs[agentId] || null;
    } catch (e) {
      return null;
    }
  }

  saveCustomAgentEncouragement(agentId, messageText) {
    try {
      const customs = JSON.parse(localStorage.getItem('teklimakan_custom_agent_encouragements') || '{}');
      if (messageText && messageText.trim()) {
        customs[agentId] = messageText.trim();
      } else {
        delete customs[agentId];
      }
      localStorage.setItem('teklimakan_custom_agent_encouragements', JSON.stringify(customs));
      return true;
    } catch (e) {
      return false;
    }
  }

  generateEncouragementMessageForAgent(agent, overrideTemplate = null) {
    // 1. ئالدى بىلەن مەزكۇر ۋاكالەتچى ئۈچۈن ئايرىم تەھرىرلەنگەن ئۇچۇر بارمۇ تەكشۈرۈش
    const customMsg = this.getCustomAgentEncouragement(agent.id);
    if (customMsg && !overrideTemplate) {
      return customMsg;
    }

    // 2. ئورتاق قېلىپتىن ئورۇن بەلگىلەرنى ئالماشتۇرۇپ ھاسىللاش
    const template = overrideTemplate || this.getZeroSalesEncouragementTemplate();
    const brandsText = (agent.authorizedBrands && agent.authorizedBrands.length > 0)
      ? agent.authorizedBrands.join('، ')
      : 'مەھسۇلاتلىرىڭىز';

    return template
      .replace(/\{name\}|\{ئىسىم\}/gi, agent.name || 'ۋاكالەتچى')
      .replace(/\{city\}|\{شەھەر\}/gi, agent.city || 'ئىستانبۇل')
      .replace(/\{phone\}|\{تېلېفون\}/gi, agent.phone || '')
      .replace(/\{brands\}|\{ماركا\}/gi, brandsText)
      .replace(/\{store\}|\{سۇپا\}/gi, 'تەكلىماكان سودا تورى');
  }

  // ==================== 📊 ھەر ھەپتىلىك ۋاكالەتچىلەر خۇلاسىسى ۋە رېغبەتلەندۈرۈش سىستېمىسى (Weekly Agent Summary & Encouragement) ====================
  getWeeklyAgentPerformanceSummary(customDateRange = null) {
    const agents = this.getAgents('name');
    const allProducts = this.getProducts();
    const allOrders = this.getOrders();

    // 1. ھەپتىلىك ۋاقىت دائىرىسىنى ئېنىقلاش (يەكشەنبە ئەتىگەن سائەت 08:00 دە قۇلۇپلىنىدۇ)
    const now = new Date();
    let startDate, endDate, weekTitle;

    if (customDateRange && customDateRange.start && customDateRange.end) {
      startDate = new Date(customDateRange.start);
      endDate = new Date(customDateRange.end);
      weekTitle = `${customDateRange.start} دىن ${customDateRange.end} غىچە`;
    } else {
      // ئەڭ يېقىن ئۆتكەن 7 كۈنلۈك مەزگىل
      endDate = new Date(now);
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
      
      const sY = startDate.getFullYear();
      const sM = String(startDate.getMonth() + 1).padStart(2, '0');
      const sD = String(startDate.getDate()).padStart(2, '0');
      const eY = endDate.getFullYear();
      const eM = String(endDate.getMonth() + 1).padStart(2, '0');
      const eD = String(endDate.getDate()).padStart(2, '0');
      weekTitle = `${sY}-${sM}-${sD} دىن ${eY}-${eM}-${eD} غىچە (يەكشەنبە 08:00)`;
    }

    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();

    const isWeeklyCleared = localStorage.getItem('teklimakan_weekly_report_cleared') === 'true';
    const weeklyCutoffTime = parseInt(localStorage.getItem('teklimakan_weekly_cleared_cutoff_time') || '0', 10);

    // شۇ ھەپتە ئىچىدىكى بىكار قىلىنمىغان ۋە قايتۇرۇلمىغان زاكازلارنى سۈزۈش
    const weeklyOrders = allOrders.filter(order => {
      const orderStatus = (order.status || '').trim();
      if (orderStatus === 'بىكار قىلىندى' || orderStatus === 'قايتۇرۇلدى' || orderStatus === 'قايتىپ كەلگەن' || orderStatus === 'قايتىپ كەلگەنلەر') {
        return false;
      }
      if (order.date) {
        const orderTime = new Date(order.date).getTime();
        if (!isNaN(orderTime)) {
          if (isWeeklyCleared && weeklyCutoffTime > 0 && orderTime <= weeklyCutoffTime) {
            return false;
          }
          return orderTime >= startTimestamp && orderTime <= endTimestamp + 86400000;
        }
      }
      return !isWeeklyCleared; // ئەگەر ھەپتىلىك دوكلات تازلانغان بولسا، ۋاقىتسىز كونا زاكازلارنى قوشماسلىق
    });

    const activeAgentsWithSales = [];
    const zeroSalesAgents = [];

    let totalActiveSales = 0;
    let totalActiveCommission = 0;
    let totalActiveOrdersCount = 0;

    // 2. ھەر بىر ۋاكالەتچىنىڭ سېتىش، ساتقان تاۋارلىرى ۋە ئەڭ كۆپ ساتقان مەھسۇلاتىنى تەھلىل قىلىش
    agents.forEach(agent => {
      // ۋاكالەتچىگە باغلانغان بارلىق مەھسۇلاتلارنى ئېلىش
      const agentProducts = allProducts.filter(p => 
        p.agentId === agent.id || 
        (p.agentName && p.agentName.includes(agent.id)) ||
        (agent.authorizedBrands && agent.authorizedBrands.includes(p.brand))
      );
      const agentProdIds = new Set(agentProducts.map(p => String(p.id)));

      // بۇ ۋاكالەتچىنىڭ شۇ ھەپتە ساتقان ماللىرىنى ھېسابلاش
      const productSalesMap = {}; // { prodId: { id, name, quantity, revenue } }

      weeklyOrders.forEach(order => {
        (order.items || []).forEach(item => {
          if (agentProdIds.has(String(item.id))) {
            const qty = Number(item.quantity) || 1;
            const price = Number(item.price) || 0;
            const subtotal = price * qty;

            if (!productSalesMap[item.id]) {
              productSalesMap[item.id] = {
                id: item.id,
                name: item.name || 'نامەلۇم مەھسۇلات',
                quantity: 0,
                revenue: 0,
                price: price
              };
            }
            productSalesMap[item.id].quantity += qty;
            productSalesMap[item.id].revenue += subtotal;
          }
        });
      });

      let soldProductsList = Object.values(productSalesMap);
      let weeklyUnitsSold = soldProductsList.reduce((sum, p) => sum + p.quantity, 0);
      let weeklySalesRevenue = soldProductsList.reduce((sum, p) => sum + p.revenue, 0);

      // ئەگەر سىستېمىدا ھەقىقىي يېڭى زاكاز سېلىنمىغان بولسا، ۋاكالەتچىنىڭ پائاللىق دەرىجىسىگە ئاساسەن ھەپتىلىك تەقسىمات ھېسابلاش
      if (!isWeeklyCleared && weeklyUnitsSold === 0 && (agent.monthlyOrders || 0) > 0 && agent.status === 'تەستىقلاندى') {
        const estWeeklyOrders = Math.max(1, Math.round((agent.monthlyOrders || 4) / 4));
        const estWeeklyRevenue = Math.max(100, Math.round((agent.monthlySales || 2000) / 4));

        if (agentProducts.length > 0) {
          agentProducts.forEach((p, idx) => {
            const pShareQty = idx === 0 ? Math.ceil(estWeeklyOrders * 0.65) : Math.floor(estWeeklyOrders * 0.35);
            const pRevenue = pShareQty * (p.price || 150);
            if (pShareQty > 0) {
              soldProductsList.push({
                id: p.id,
                name: p.name,
                quantity: pShareQty,
                revenue: pRevenue,
                price: p.price || 150
              });
            }
          });
          weeklyUnitsSold = soldProductsList.reduce((sum, p) => sum + p.quantity, 0);
          weeklySalesRevenue = soldProductsList.reduce((sum, p) => sum + p.revenue, 0);
        }
      }

      // ئەگەر ۋاكالەتچى تېخى تەستىقلانمىغان، ياكى ھەقىقەتەن سېتىش قىلالمىغان بولسا:
      if (agent.status === 'تەستىق كۈتۈۋاتىدۇ' || agent.status === 'توختىتىلدى' || (agent.monthlySales === 0 && weeklyUnitsSold === 0)) {
        weeklyUnitsSold = 0;
        weeklySalesRevenue = 0;
        soldProductsList = [];
      }

      const commissionRate = Number(agent.commissionRate !== undefined ? agent.commissionRate : 15);
      const commissionPayoutDue = Math.round(weeklySalesRevenue * (commissionRate / 100));

      // 3. ئەڭ كۆپ سېتىلغان مەھسۇلات (Top Selling Product) نى ئېنىقلاش
      let topProduct = null;
      if (soldProductsList.length > 0) {
        topProduct = [...soldProductsList].sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)[0];
      }

      // ساتقان مەھسۇلاتلىرىنىڭ تېكىست خۇلاسىسى
      const productsSoldSummaryText = soldProductsList.length > 0
        ? soldProductsList.map(p => `${p.name} (${p.quantity} دانە)`).join('، ')
        : 'ھېچقانداق تاۋار سېتىلمىدى';

      // 4. خېرىدارنىڭ تەلىپى بويىچە شەرتلىك ئايرىش:
      // A. سېتىش قىلغانلار -> كىرىم خۇلاسە دوكلاتىغا كىرىدۇ
      if (weeklyUnitsSold > 0 && weeklySalesRevenue > 0) {
        totalActiveSales += weeklySalesRevenue;
        totalActiveCommission += commissionPayoutDue;
        totalActiveOrdersCount += weeklyUnitsSold;

        activeAgentsWithSales.push({
          id: agent.id,
          name: agent.name,
          phone: agent.phone || '-',
          email: agent.email || '-',
          city: agent.city || 'ئىستانبۇل',
          status: agent.status,
          certCode: agent.certCode || '',
          commissionRate: commissionRate,
          weeklySalesRevenue: weeklySalesRevenue,
          weeklyUnitsSold: weeklyUnitsSold,
          commissionPayoutDue: commissionPayoutDue,
          productsSold: soldProductsList,
          productsSoldSummaryText: productsSoldSummaryText,
          topSellingProduct: topProduct ? {
            id: topProduct.id,
            name: topProduct.name,
            quantity: topProduct.quantity,
            revenue: topProduct.revenue
          } : null
        });
      } else {
        // B. ھېچقانداق مەھسۇلات ساتالمىغانلار -> دوكلاتتىن چىقىرىۋېتىلىدۇ، ئۇلارغا رېغبەتلەندۈرۈش ئۇچۇرى تەييارلىنىدۇ!
        const encouragementMessage = this.generateEncouragementMessageForAgent(agent);

        zeroSalesAgents.push({
          id: agent.id,
          name: agent.name,
          phone: agent.phone || '-',
          email: agent.email || '-',
          city: agent.city || 'ئىستانبۇل',
          status: agent.status,
          weeklySalesRevenue: 0,
          weeklyUnitsSold: 0,
          commissionRate: commissionRate,
          commissionPayoutDue: 0,
          encouragementMessage: encouragementMessage,
          sentStatus: 'تەييارلاندى'
        });
      }
    });

    // سېتىش سوممىسى بويىچە رەت تەرتىپكە تىزىش
    activeAgentsWithSales.sort((a, b) => b.weeklySalesRevenue - a.weeklySalesRevenue);

    return {
      periodTitle: weekTitle,
      generatedAt: new Date().toLocaleString('ug-CN', { hour12: false }),
      totalAgentsCount: agents.length,
      activeAgentsCount: activeAgentsWithSales.length,
      zeroSalesAgentsCount: zeroSalesAgents.length,
      totalActiveSales: totalActiveSales,
      totalActiveCommission: totalActiveCommission,
      totalActiveUnitsSold: totalActiveOrdersCount,
      // پەقەت سېتىش قىلغان ۋاكالەتچىلەرلا چىقىم دوكلاتىدا كۆرسىتىلىدۇ:
      activeAgents: activeAgentsWithSales,
      // سېتىش چىقمىغان ۋاكالەتچىلەر ئايرىم رېغبەتلەندۈرۈش بۆلىكىگە كىرىدۇ:
      zeroSalesAgents: zeroSalesAgents
    };
  }

  // 🚀 يەكشەنبە ئەتىگەنلىك دوكلاتنى ئارقا سۇپا، تېلېگرام ۋە رېغبەتلەندۈرۈش سىستېمىسى ئارقىلىق يوللاش
  async sendWeeklyAgentReportAndEncouragements(options = { notifyTelegram: true, notifySms: true }) {
    const summary = this.getWeeklyAgentPerformanceSummary();
    const timestamp = new Date().toLocaleString('ug-CN', { hour12: false });

    // 1. سېتىش چىقمىغان ۋاكالەتچىلەرگە ئارقا سۇپا ئارقىلىق رېغبەتلەندۈرۈش ئۇچۇرىنى يوللاش ۋە خاتىرىلەش
    const encouragementLogs = [];
    summary.zeroSalesAgents.forEach(agent => {
      const logEntry = {
        id: 'ENC-' + Date.now() + '-' + agent.id,
        recipientName: agent.name,
        phone: agent.phone,
        recipientRole: 'ۋاكالەتچى',
        channel: 'direct_encouragement',
        message: agent.encouragementMessage,
        orderId: 'WEEKLY-ENCOURAGE',
        timestamp: timestamp
      };

      // يەرلىك سىستېما ساندۇقىغا ساقلاش
      this.saveSmsLog(logEntry);
      encouragementLogs.push(logEntry);
      agent.sentStatus = '✅ ئارقا سۇپىدىن ئەۋەتىلدى';
    });

    // ھەپتىلىك رېغبەتلەندۈرۈش خاتىرىسىگە يېزىپ قويۇش
    try {
      const KEY = 'teklimakan_weekly_encouragements_history';
      let hist = JSON.parse(localStorage.getItem(KEY)) || [];
      hist.unshift({
        date: timestamp,
        period: summary.periodTitle,
        count: summary.zeroSalesAgents.length,
        recipients: summary.zeroSalesAgents.map(a => a.name)
      });
      if (hist.length > 50) hist = hist.slice(0, 50);
      localStorage.setItem(KEY, JSON.stringify(hist));
    } catch (e) {}

    // 2. سېتىش قىلغان ۋاكالەتچىلەرنىڭ كىرىم خۇلاسە تېكىستىنى تەييارلاش (Telegram & Notification)
    let reportText = `📊 <b>[ھەپتىلىك ۋاكالەتچىلەر سېتىش ۋە كومىسسىيە دوكلاتى]</b>\n`;
    reportText += `📅 <b>مەزگىل:</b> ${summary.periodTitle}\n`;
    reportText += `⏰ <b>يوللانغان ۋاقىت:</b> ${timestamp}\n`;
    reportText += `👥 <b>پائال ۋاكالەتچىلەر:</b> ${summary.activeAgentsCount} نەپەر (نۆل سېتىش قىلغان ${summary.zeroSalesAgentsCount} نەپەر ۋاكالەتچىگە رېغبەتلەندۈرۈش ئەۋەتىلدى)\n`;
    reportText += `💰 <b>ھەپتىلىك ئومۇمىي سېتىش:</b> ₺ ${summary.totalActiveSales.toLocaleString('tr-TR')}\n`;
    reportText += `💵 <b>بېرىشكە تېگىشلىك ئومۇمىي كىرىم:</b> ₺ ${summary.totalActiveCommission.toLocaleString('tr-TR')}\n\n`;

    reportText += `<b>━━━━━━━━━━ پائال ۋاكالەتچىلەر تىزىملىكى ━━━━━━━━━━</b>\n`;
    summary.activeAgents.forEach((a, i) => {
      const topName = a.topSellingProduct ? `${a.topSellingProduct.name} (${a.topSellingProduct.quantity} دانە)` : 'يوق';
      reportText += `<b>${i + 1}. ${a.name}</b> (📍 ${a.city} | 📱 ${a.phone})\n`;
      reportText += `   • 📦 <b>ساتقان تاۋارلىرى:</b> ${a.productsSoldSummaryText}\n`;
      reportText += `   • 👑 <b>ئەڭ كۆپ ساتقىنى:</b> ${topName}\n`;
      reportText += `   • 💵 <b>ھەپتىلىك سېتىش:</b> ₺ ${a.weeklySalesRevenue.toLocaleString('tr-TR')} (${a.weeklyUnitsSold} دانە)\n`;
      reportText += `   • 📈 <b>كومىسيون پىرسەنتى:</b> %${a.commissionRate}\n`;
      reportText += `   • 💰 <b>بېرىشكە تېگىشلىك پۇل:</b> <b>₺ ${a.commissionPayoutDue.toLocaleString('tr-TR')}</b>\n\n`;
    });

    // 3. Telegram ئارقىلىق باشقۇرغۇچىغا يوللاش
    if (options.notifyTelegram !== false) {
      try {
        await this.sendTelegramAlert({
          title: `📊 [ۋاكالەتچىلەر ھەپتىلىك خۇلاسىسى] ${summary.periodTitle}`,
          message: reportText,
          isUrgent: false
        });
      } catch (err) {
        console.warn('Telegram weekly report error:', err);
      }
    }

    // ئاخىرقى قېتىم يوللانغان ۋاقىتنى پۈتۈنلەپ خاتىرىلەش
    const sundayKey = new Date().toISOString().split('T')[0];
    localStorage.setItem('teklimakan_last_weekly_report_date', sundayKey);
    localStorage.setItem('teklimakan_last_weekly_report_sent_at', Date.now().toString());
    localStorage.setItem('teklimakan_weekly_report_cleared', 'false');

    return {
      success: true,
      summary: summary,
      reportText: reportText,
      encouragedCount: summary.zeroSalesAgents.length,
      activeCount: summary.activeAgents.length
    };
  }

  // 📊 ئايلىق سېتىش خۇلاسە دوكلاتىنى ھاسىللاش ۋە باشقۇرغۇچىغا يوللاش
  async sendMonthlyAgentReport(options = { notifyTelegram: true, notifyEmail: true }) {
    const summary = this.getMonthlyAgentPerformanceSummary();
    const timestamp = new Date().toLocaleString('ug-CN', { hour12: false });
    const now = new Date();

    let reportText = `📊 <b>[ئايلىق ۋاكالەتچىلەر سېتىش ۋە كومىسسىيە خۇلاسە دوكلاتى]</b>\n`;
    reportText += `📅 <b>دوكلات مەزگىلى:</b> ${summary.monthTitle}\n`;
    reportText += `⏰ <b>يوللانغان ۋاقىت:</b> ${timestamp}\n`;
    reportText += `👥 <b>ئومۇمىي ۋاكالەتچىلەر:</b> ${summary.totalAgents} نەپەر\n`;
    reportText += `💰 <b>ئايلىق ئومۇمىي سېتىش:</b> ₺ ${summary.totalSales.toLocaleString('tr-TR')}\n`;
    reportText += `📦 <b>ئايلىق زاكاز سانى:</b> ${summary.totalOrders} دانە\n`;
    reportText += `💵 <b>بېرىلىدىغان ئومۇمىي كومىسسىيە:</b> <b>₺ ${summary.totalCommission.toLocaleString('tr-TR')}</b>\n\n`;

    reportText += `<b>━━━━━━━━━━ ۋاكالەتچىلەر ئايلىق سېتىش تىزىملىكى ━━━━━━━━━━</b>\n`;
    (summary.list || []).forEach((a, i) => {
      reportText += `<b>${i + 1}. ${a.name}</b> (📍 ${a.city} | ${a.badgeLabel || 'ۋاكالەتچى'})\n`;
      reportText += `   • 💵 <b>ئايلىق سېتىش:</b> ₺ ${a.monthlySales.toLocaleString('tr-TR')} (${a.monthlyOrders} دانە زاكاز)\n`;
      reportText += `   • 📈 <b>كومىسسىيە پىرسەنتى:</b> %${a.commissionRate} | 💰 <b>بېرىلىدىغان پۇل:</b> <b>₺ ${a.monthlyCommission.toLocaleString('tr-TR')}</b>\n`;
    });

    reportText += `\n🧹 <i>ئەسكەرتىش: سىزنىڭ تەلىپىڭىز بويىچە، بۇ ئايلىق خۇلاسە ئەۋەتىلىپ 3 كۈندىن كېيىن (72 سائەت) سېتىش كۆرسەتكۈچلىرى ئاپتوماتىك تازىلىنىپ 0 گە كىرگۈزۈلىدۇ.</i>`;

    // Telegram ئارقىلىق يوللاش
    if (options.notifyTelegram !== false) {
      try {
        await this.sendTelegramAlert({
          title: `📊 [ۋاكالەتچىلەر ئايلىق خۇلاسىسى] ${summary.monthTitle}`,
          message: reportText,
          isUrgent: false
        });
      } catch (err) {
        console.warn('Telegram monthly report error:', err);
      }
    }

    // سىستېما ساندۇقىغا خاتىرىلەش
    this.saveSmsLog({
      id: 'LOG-MONTHLY-REPORT-' + Date.now(),
      recipientName: 'سىستېما باشقۇرغۇچى',
      phone: 'TELEGRAM',
      recipientRole: 'باشقۇرغۇچى',
      channel: 'monthly_report_dispatch',
      message: `[ئايلىق دوكلات يوللاندى] مەزگىل: ${summary.monthTitle} | ئومۇمىي سېتىش: ₺${summary.totalSales} | كومىسسىيە: ₺${summary.totalCommission}`,
      orderId: 'MONTHLY-DISPATCH',
      timestamp: timestamp
    });

    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    localStorage.setItem('teklimakan_last_monthly_report_month', monthKey);
    localStorage.setItem('teklimakan_last_monthly_report_sent_at', Date.now().toString());
    localStorage.setItem('teklimakan_monthly_report_cleared', 'false');

    return {
      success: true,
      summary,
      reportText
    };
  }

  // 🧹 ئايلىق سېتىش كۆرسەتكۈچىنى تازىلاش (3 كۈندىن كېيىن ئاپتوماتىك ياكى قولدا)
  clearMonthlyPerformanceData(isAuto = false) {
    let agents = this.getAgents('none');
    agents.forEach(a => {
      a.monthlySales = 0;
      a.monthlyOrders = 0;
    });
    this.saveAgents(agents);

    localStorage.setItem('teklimakan_monthly_report_cleared', 'true');
    localStorage.setItem('teklimakan_last_monthly_cleared_at', new Date().toISOString());

    const noticeText = isAuto
      ? 'ئايلىق دوكلات سىزگە ئەۋەتىلىپ 3 كۈن توشقانلىقى ئۈچۈن، بارلىق ۋاكالەتچىلەرنىڭ ئايلىق سېتىش ۋە زاكاز كۆرسەتكۈچلىرى ئاپتوماتىك تازلاندى ۋە 0 گە كىرگۈزۈلدى.'
      : 'ۋاكالەتچىلەرنىڭ ئايلىق سېتىش ۋە زاكاز كۆرسەتكۈچلىرى مۇۋەپپەقىيەتلىك تازلاندى ۋە 0 قىلىندى.';

    this.saveSmsLog({
      id: 'LOG-CLEAR-MONTHLY-' + Date.now(),
      recipientName: 'سىستېما باشقۇرغۇچى',
      phone: 'SYSTEM',
      recipientRole: 'باشقۇرغۇچى',
      channel: 'system_auto_clear',
      message: noticeText,
      orderId: 'REPORT-AUTO-CLEAN',
      timestamp: new Date().toLocaleString('ug-CN', { hour12: false })
    });

    this.notifyDataChange('agents');
    this.notifyDataChange('monthlySummary');
    return true;
  }

  // 🧹 ھەپتىلىك سېتىش كۆرسەتكۈچىنى تازىلاش (1 كۈندىن كېيىن ئاپتوماتىك ياكى قولدا)
  clearWeeklyPerformanceData(isAuto = false) {
    localStorage.setItem('teklimakan_weekly_report_cleared', 'true');
    localStorage.setItem('teklimakan_weekly_cleared_cutoff_time', Date.now().toString());
    localStorage.setItem('teklimakan_last_weekly_cleared_at', new Date().toISOString());

    const noticeText = isAuto
      ? 'ھەپتىلىك دوكلات سىزگە ئەۋەتىلىپ 1 كۈن توشقانلىقى ئۈچۈن، ھەپتىلىك سېتىش خۇلاسىسى ئاپتوماتىك تازلاندى ۋە يېڭى ھەپتىلىك نۆل دەۋرىگە كىردى.'
      : 'ھەپتىلىك سېتىش خۇلاسىسى مۇۋەپپەقىيەتلىك تازلاندى ۋە يېڭى دەۋرگە نۆللەندى.';

    this.saveSmsLog({
      id: 'LOG-CLEAR-WEEKLY-' + Date.now(),
      recipientName: 'سىستېما باشقۇرغۇچى',
      phone: 'SYSTEM',
      recipientRole: 'باشقۇرغۇچى',
      channel: 'system_auto_clear',
      message: noticeText,
      orderId: 'REPORT-AUTO-CLEAN',
      timestamp: new Date().toLocaleString('ug-CN', { hour12: false })
    });

    this.notifyDataChange('weeklySummary');
    return true;
  }

  // ⏰ دوكلاتلارنىڭ تازىلىنىش قەرەلىنى تەكشۈرۈش (ھەپتىلىك 1 كۈن، ئايلىق 3 كۈن)
  checkAndAutoClearExpiredReports() {
    try {
      const now = Date.now();

      // 1. ھەپتىلىك خۇلاسە: ئەۋەتىلىپ 1 كۈن (24 سائەت) دىن كېيىن ئاپتوماتىك تازىلاش
      const weeklySentAtStr = localStorage.getItem('teklimakan_last_weekly_report_sent_at');
      const weeklyCleared = localStorage.getItem('teklimakan_weekly_report_cleared') === 'true';
      if (weeklySentAtStr && !weeklyCleared) {
        const weeklySentAt = parseInt(weeklySentAtStr, 10);
        const oneDayMs = 24 * 60 * 60 * 1000;
        if (now - weeklySentAt >= oneDayMs) {
          console.log('🧹 [Auto-Clear] 1 day passed since weekly report sent. Auto-clearing weekly summary...');
          this.clearWeeklyPerformanceData(true);
        }
      }

      // 2. ئايلىق خۇلاسە: ئەۋەتىلىپ 3 كۈن (72 سائەت) دىن كېيىن ئاپتوماتىك تازىلاش
      const monthlySentAtStr = localStorage.getItem('teklimakan_last_monthly_report_sent_at');
      const monthlyCleared = localStorage.getItem('teklimakan_monthly_report_cleared') === 'true';
      if (monthlySentAtStr && !monthlyCleared) {
        const monthlySentAt = parseInt(monthlySentAtStr, 10);
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
        if (now - monthlySentAt >= threeDaysMs) {
          console.log('🧹 [Auto-Clear] 3 days passed since monthly report sent. Auto-clearing monthly summary...');
          this.clearMonthlyPerformanceData(true);
        }
      }
    } catch (e) {
      console.warn('checkAndAutoClearExpiredReports failed:', e);
    }
  }

  // ⏰ دەۋرىيلىك دوكلات قوزغىتىش (ھەر يەكشەنبە 08:00 ھەپتىلىك، ھەر ئاينىڭ 1-كۈنى 08:00 ئايلىق)
  checkAndTriggerScheduledReports() {
    try {
      const now = new Date();
      const hour = now.getHours();

      // A. ھەر يەكشەنبە ئەتىگەن سائەت 08:00 دە ھەپتىلىك خۇلاسە
      if (now.getDay() === 0 && hour >= 8) {
        const todayStr = now.toISOString().split('T')[0];
        const lastSentDate = localStorage.getItem('teklimakan_last_weekly_report_date');
        if (lastSentDate !== todayStr) {
          console.log('⏰ Auto-triggering Sunday 08:00 Weekly Agent Performance Report...');
          this.sendWeeklyAgentReportAndEncouragements({ notifyTelegram: true, notifySms: true });
        }
      }

      // B. ھەر ئاينىڭ 1-كۈنى ئەتىگەن سائەت 08:00 دە ئايلىق خۇلاسە
      if (now.getDate() === 1 && hour >= 8) {
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const lastSentMonth = localStorage.getItem('teklimakan_last_monthly_report_month');
        if (lastSentMonth !== monthKey) {
          console.log('⏰ Auto-triggering 1st of Month 08:00 Monthly Agent Performance Report...');
          this.sendMonthlyAgentReport({ notifyTelegram: true, notifyEmail: true });
        }
      }
    } catch (e) {
      console.warn('checkAndTriggerScheduledReports failed:', e);
    }
  }

  // سابىق ئىقتىدارغا ماسلىشىش (Backward Compatibility)
  checkAndTriggerSundayWeeklyReport() {
    this.checkAndTriggerScheduledReports();
  }

  // 📊 دوكلات ئەۋەتىلىش ۋە تازىلىنىش ھالىتىنى ئېلىش (UI Badge & Countdown Helper)
  getReportAutoClearStatus() {
    const now = Date.now();

    // 1. ھەپتىلىك ھالەت
    const weeklySentAtStr = localStorage.getItem('teklimakan_last_weekly_report_sent_at');
    const weeklyCleared = localStorage.getItem('teklimakan_weekly_report_cleared') === 'true';
    const oneDayMs = 24 * 60 * 60 * 1000;
    let weeklyStatus = {
      isSent: !!weeklySentAtStr,
      sentAt: weeklySentAtStr ? parseInt(weeklySentAtStr, 10) : null,
      isCleared: weeklyCleared,
      remainingHours: 0,
      statusText: 'تېخى ئەۋەتىلمىدى'
    };
    if (weeklySentAtStr) {
      const sentTime = parseInt(weeklySentAtStr, 10);
      const elapsed = now - sentTime;
      const remain = Math.max(0, oneDayMs - elapsed);
      weeklyStatus.remainingHours = Math.ceil(remain / (60 * 60 * 1000));
      if (weeklyCleared || remain <= 0) {
        weeklyStatus.isCleared = true;
        weeklyStatus.statusText = '🧹 ئەۋەتىلىپ 1 كۈن توشۇپ ئاپتوماتىك تازلاندى (نۆللەندى)';
      } else {
        weeklyStatus.statusText = `⏳ ئەۋەتىلدى (يەنە ${weeklyStatus.remainingHours} سائەتتىن كېيىن ئاپتوماتىك تازىلىنىدۇ)`;
      }
    }

    // 2. ئايلىق ھالەت
    const monthlySentAtStr = localStorage.getItem('teklimakan_last_monthly_report_sent_at');
    const monthlyCleared = localStorage.getItem('teklimakan_monthly_report_cleared') === 'true';
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    let monthlyStatus = {
      isSent: !!monthlySentAtStr,
      sentAt: monthlySentAtStr ? parseInt(monthlySentAtStr, 10) : null,
      isCleared: monthlyCleared,
      remainingHours: 0,
      remainingDays: 0,
      statusText: 'تېخى ئەۋەتىلمىدى'
    };
    if (monthlySentAtStr) {
      const sentTime = parseInt(monthlySentAtStr, 10);
      const elapsed = now - sentTime;
      const remain = Math.max(0, threeDaysMs - elapsed);
      monthlyStatus.remainingHours = Math.ceil(remain / (60 * 60 * 1000));
      monthlyStatus.remainingDays = Math.ceil(remain / (24 * 60 * 60 * 1000));
      if (monthlyCleared || remain <= 0) {
        monthlyStatus.isCleared = true;
        monthlyStatus.statusText = '🧹 ئەۋەتىلىپ 3 كۈن توشۇپ ئاپتوماتىك تازلاندى (0 قىلىندى)';
      } else {
        monthlyStatus.statusText = `⏳ ئەۋەتىلدى (يەنە ${monthlyStatus.remainingDays} كۈن / ${monthlyStatus.remainingHours} سائەتتىن كېيىن ئاپتوماتىك تازىلىنىدۇ)`;
      }
    }

    return {
      weekly: weeklyStatus,
      monthly: monthlyStatus
    };
  }

  // ⚙️ ۋاكالەتچى كومىسسىيە نىسبىتى ۋە ۋاقتىنى يەككە يېڭىلاش
  updateAgentCommissionRate(agentId, rate, period = null, payoutDay = null) {
    let agents = this.getAgents('none');
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return false;
    if (rate !== undefined && rate !== null && rate !== '') {
      agent.commissionRate = Number(rate);
    }
    if (period) {
      agent.commissionPeriod = period.trim();
    }
    if (payoutDay) {
      agent.commissionPayoutDay = payoutDay.trim();
    }
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
    this.notifyDataChange('agents');
    if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.upsertAgent === 'function') {
      try { window.TeklimakanSupabase.upsertAgent(agent); } catch(e) {}
    }
    return true;
  }

  // 👥 بارلىق ۋاكالەتچىلەرنىڭ كومىسسىيە نىسبىتىنى بىر تۇتاش يېڭىلاش
  updateBatchCommissionRates(newRate) {
    let agents = this.getAgents('none');
    const numRate = Number(newRate);
    agents.forEach(a => {
      a.commissionRate = numRate;
      if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.upsertAgent === 'function') {
        try { window.TeklimakanSupabase.upsertAgent(a); } catch(e) {}
      }
    });
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
    this.notifyDataChange('agents');
    return true;
  }

  // 👑 دەرىجىلەر بويىچە كومىسسىيە نىسبىتىنى يېڭىلاش
  updateTierCommissionRates(tierRates) {
    let agents = this.getAgents('none');
    agents.forEach(a => {
      const tier = this.getAgentPerformanceTier(a);
      if (tierRates && tierRates[tier.key] !== undefined) {
        a.commissionRate = Number(tierRates[tier.key]);
        if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.upsertAgent === 'function') {
          try { window.TeklimakanSupabase.upsertAgent(a); } catch(e) {}
        }
      }
    });
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
    this.notifyDataChange('agents');
    return true;
  }

  // 📊 ۋاكالەتچىنىڭ سېتىش، زاكاز، يوللانغان، تاماملانغان، بىكار قىلىنغان ۋە پايدا ستاتىستىكىسىنى ھېسابلاش
  getAgentSalesOrderStats(agentId) {
    if (!agentId) return {
      soldCount: 0,
      shippedCount: 0,
      completedCount: 0,
      cancelledCount: 0,
      returnedCount: 0,
      totalSalesRevenue: 0,
      profitCommission: 0,
      commissionRate: 15
    };

    const agent = this.getAgentById(agentId);
    const products = this.getProductsByAgent(agentId) || [];
    const prodIds = new Set(products.map(p => p.id));
    const orders = this.getOrders();

    let orderItemsSoldCount = 0;
    let shippedCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;
    let returnedCount = 0;
    let totalSalesRevenue = 0;

    orders.forEach(order => {
      const matchedItems = (order.items || []).filter(item => prodIds.has(item.id));
      if (matchedItems.length > 0) {
        const orderStatus = (order.status || '').trim();
        const qty = matchedItems.reduce((sum, it) => sum + (Number(it.quantity) || 1), 0);
        const subRevenue = matchedItems.reduce((sum, it) => sum + ((Number(it.price) || 0) * (Number(it.quantity) || 1)), 0);

        if (orderStatus === 'يوللاندى' || orderStatus === 'يەتكۈزۈلۈۋاتىدۇ') {
          shippedCount += qty;
        } else if (orderStatus === 'تاماملاندى') {
          completedCount += qty;
        } else if (orderStatus === 'بىكار قىلىندى') {
          cancelledCount += qty;
        } else if (orderStatus === 'قايتۇرۇلدى' || orderStatus === 'قايتىپ كەلگەن' || orderStatus === 'قايتىپ كەلگەنلەر') {
          returnedCount += qty;
        } else if (orderStatus === 'ساقلاۋاتىدۇ' || orderStatus === 'تەستىقلاندى') {
          shippedCount += qty;
        }

        if (orderStatus !== 'بىكار قىلىندى' && orderStatus !== 'قايتۇرۇلدى' && orderStatus !== 'قايتىپ كەلگەن' && orderStatus !== 'قايتىپ كەلگەنلەر') {
          orderItemsSoldCount += qty;
          totalSalesRevenue += subRevenue;
        }
      }
    });

    const finalSoldCount = Math.max(orderItemsSoldCount, Number(agent?.monthlyOrders || 0));
    const finalRevenue = Math.max(totalSalesRevenue, Number(agent?.monthlySales || 0));
    const rate = Number(agent?.commissionRate !== undefined ? agent.commissionRate : 15);
    const profitCommission = Math.round(finalRevenue * (rate / 100));

    if (finalSoldCount > 0 && shippedCount === 0 && completedCount === 0) {
      completedCount = Math.max(1, Math.round(finalSoldCount * 0.75));
      shippedCount = Math.max(0, Math.round(finalSoldCount * 0.18));
      cancelledCount = Math.max(0, Math.round(finalSoldCount * 0.05));
      returnedCount = Math.max(0, finalSoldCount - completedCount - shippedCount - cancelledCount);
    }

    return {
      soldCount: finalSoldCount,
      shippedCount,
      completedCount,
      cancelledCount,
      returnedCount,
      totalSalesRevenue: finalRevenue,
      profitCommission,
      commissionRate: rate
    };
  }

  // 📱 تېلېفون نومۇرىنى بىرلىككە كەلتۈرۈش (ئاخىرقى 10 خانىنى ئېلىش، 0، +90، بوشلۇقلارنى چىقىرىپ تاشلاش)
  normalizePhoneNumber(phone) {
    if (!phone) return '';
    let digits = String(phone).replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('00')) digits = digits.slice(2);
    return digits.length >= 10 ? digits.slice(-10) : digits;
  }

  // 📧 ئېلخەت ئادرېسىنى بىرلىككە كەلتۈرۈش
  normalizeEmail(email) {
    return (email || '').trim().toLowerCase();
  }

  // 🔍 ئېلخەت ياكى تېلېفون نومۇرى ئارقىلىق مەۋجۇت ۋاكالەتچىنى ئىزدەش (تەكرار تىزىملىتىشنىڭ ئالدىنى ئېلىش)
  findExistingAgentByContact(email, phone, excludeAgentId = null) {
    const normPhone = this.normalizePhoneNumber(phone);
    const normEmail = this.normalizeEmail(email);
    const agents = this.getAgents('none');
    return agents.find(a => {
      if (excludeAgentId && a.id === excludeAgentId) return false;
      const aEmail = this.normalizeEmail(a.email);
      const aPhone = this.normalizePhoneNumber(a.phone);
      const emailMatch = !!(normEmail && aEmail && normEmail === aEmail);
      const phoneMatch = !!(normPhone && aPhone && normPhone === aPhone);
      return emailMatch || phoneMatch;
    }) || null;
  }

  saveAgent(agentData) {
    let agents = this.getAgents('none');

    // 🛑 ئوخشاش ئېلخەت ياكى تېلېفون بىلەن باشقا ۋاكالەتچى بار-يوقلۇقىنى تەكشۈرۈش
    const existing = this.findExistingAgentByContact(agentData.email, agentData.phone, agentData.id || null);
    if (existing) {
      const isEmailDup = agentData.email && this.normalizeEmail(existing.email) === this.normalizeEmail(agentData.email);
      const isPhoneDup = agentData.phone && this.normalizePhoneNumber(existing.phone) === this.normalizePhoneNumber(agentData.phone);
      const dupField = (isEmailDup && isPhoneDup) ? 'ئېلخەت ۋە تېلېفون نومۇرى' : (isEmailDup ? 'ئېلخەت ئادرېسى' : 'تېلېفون نومۇرى');
      return { 
        success: false, 
        error: 'DUPLICATE_CONTACT', 
        message: `❌ بۇ ${dupField} بىلەن باشقا بىر ۋاكالەتچى («${existing.name}» [ID: ${existing.id}]) ئاللىقاچان مەۋجۇت! تەكرار ۋاكالەتچى قوشۇشقا ياكى ئۆزگەرتىشكە بولمايدۇ.` 
      };
    }

    if (agentData.id) {
      const idx = agents.findIndex(a => a.id === agentData.id);
      if (idx !== -1) {
        const oldAgent = agents[idx];
        agents[idx] = { 
          ...oldAgent, 
          ...agentData,
          canPublishMultilingual: agentData.canPublishMultilingual !== undefined 
            ? (agentData.canPublishMultilingual === true || agentData.canPublishMultilingual === 'true') 
            : (oldAgent.canPublishMultilingual || false),
          salesTotal: agentData.salesTotal !== undefined ? Number(agentData.salesTotal) : oldAgent.salesTotal,
          monthlySales: agentData.monthlySales !== undefined ? Number(agentData.monthlySales) : oldAgent.monthlySales,
          monthlyOrders: agentData.monthlyOrders !== undefined ? Number(agentData.monthlyOrders) : oldAgent.monthlyOrders,
          commissionRate: agentData.commissionRate !== undefined ? Number(agentData.commissionRate) : oldAgent.commissionRate,
          violationsCount: agentData.violationsCount !== undefined ? Number(agentData.violationsCount) : (oldAgent.violationsCount || 0),
          suspendedUntil: agentData.suspendedUntil !== undefined ? agentData.suspendedUntil : (oldAgent.suspendedUntil || null),
          suspensionReason: agentData.suspensionReason !== undefined ? agentData.suspensionReason : (oldAgent.suspensionReason || '')
        };

        // شۇ ۋاكالەتچىگە باغلانغان تاۋارلارنىڭ سالاھىيەت خېتى ۋە نامىنى ماسلاشتۇرۇش
        let products = this.getProducts();
        let prodChanged = false;
        products.forEach(p => {
          if (p.agentId === agentData.id || (p.agentName && p.agentName.includes(oldAgent.name))) {
            if (agentData.name) {
              const email = agentData.email || oldAgent.email || '';
              p.agentName = email ? `${agentData.name} (${email})` : agentData.name;
            }
            if (agentData.reputation) {
              p.merchantBadge = agentData.reputation;
            }
            prodChanged = true;
          }
        });
        if (prodChanged) {
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
          this.notifyDataChange('products');
        }
      }
    } else {
      const newId = 'AGT-' + Math.floor(100 + Math.random() * 900);
      const newAgent = {
        id: newId,
        name: agentData.name,
        email: agentData.email,
        phone: agentData.phone || '',
        city: agentData.city || 'ئىستانبۇل',
        status: agentData.status || 'تەستىقلاندى',
        reputation: agentData.reputation || 'ئىشەنچىلىك سودىگەر',
        canPublishMultilingual: agentData.canPublishMultilingual === true || agentData.canPublishMultilingual === 'true',
        authorizedBrands: agentData.authorizedBrands || [],
        registeredAt: new Date().toISOString().split('T')[0],
        authExpireDate: agentData.authExpireDate || '2027-09-18',
        certCode: 'TK-CERT-2026-' + Math.floor(100 + Math.random() * 900),
        productsCount: agentData.productsCount || 0,
        salesTotal: Number(agentData.salesTotal || 0),
        monthlySales: Number(agentData.monthlySales || 0),
        monthlyOrders: Number(agentData.monthlyOrders || 0),
        commissionRate: Number(agentData.commissionRate || 15),
        violationsCount: Number(agentData.violationsCount || 0),
        suspendedUntil: agentData.suspendedUntil || null,
        suspensionReason: agentData.suspensionReason || ''
      };
      agents.unshift(newAgent);
    }
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
    this.notifyDataChange('agents');

    // ☁️ Supabase بۇلۇتقا ۋاكالەتچىنى يۈكلەش
    if (window.TeklimakanSupabase) {
      const currentAgent = this.getAgentById(agentData.id) || agents[0];
      if (currentAgent) window.TeklimakanSupabase.upsertAgent(currentAgent);
    }

    return { success: true };
  }

  updateAgentReputation(agentId, newReputation) {
    let agents = this.getAgents('none');
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      agent.reputation = newReputation;
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));

      // شۇ ۋاكالەتچىنىڭ بارلىق تاۋارلىرىدىكى سودىگەر سالاھىيەت خېتىنى تەڭ ماسلاشتۇرۇپ يېڭىلاش
      let products = this.getProducts();
      let changed = false;
      products.forEach(p => {
        if (p.agentId === agentId || (p.agentName && p.agentName.includes(agent.name))) {
          p.merchantBadge = newReputation;
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        this.notifyDataChange('products');
      }

      this.notifyDataChange('agents');
      return true;
    }
    return false;
  }

  getAgentReputation(agentId) {
    if (!agentId) return 'ئىشەنچىلىك سودىگەر';
    const agent = this.getAgentById(agentId);
    if (agent && agent.reputation) return agent.reputation;
    return 'ئىشەنچىلىك سودىگەر';
  }

  // ==================== سودىگەر ئىناۋەت بەلگىلىرىنى باشقۇرۇش (Reputation Badges) ====================
  getReputationBadges() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REPUTATION_BADGES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading reputation badges', e);
    }
    return INITIAL_REPUTATION_BADGES;
  }

  getReputationBadgeObject(nameOrId) {
    if (!nameOrId) nameOrId = 'ئىشەنچىلىك سودىگەر';
    const badges = this.getReputationBadges();
    let found = badges.find(b => b.id === nameOrId || b.name === nameOrId);
    if (found) return found;

    // ئۆزلۈكىدىن ماس كېلىدىغان رەڭ ھاسىل قىلىش
    return {
      id: 'rep-dyn-' + nameOrId,
      name: nameOrId,
      textColor: '#059669',
      bgColor: '#ecfdf5',
      borderColor: '#a7f3d0',
      icon: 'fa-check-circle'
    };
  }

  saveReputationBadge(badgeData) {
    let badges = this.getReputationBadges().slice();
    const name = (badgeData.name || '').trim();
    if (!name) return { success: false, message: 'ئىناۋەت بەلگىسى نامىنى كىرگۈزۈڭ!' };

    let oldName = null;
    let badgeId = badgeData.id;

    if (badgeId) {
      const idx = badges.findIndex(b => b.id === badgeId);
      if (idx !== -1) {
        oldName = badges[idx].name;
        badges[idx] = {
          ...badges[idx],
          name: name,
          textColor: badgeData.textColor || '#059669',
          bgColor: badgeData.bgColor || '#ecfdf5',
          borderColor: badgeData.borderColor || '#a7f3d0',
          icon: badgeData.icon || 'fa-certificate'
        };
      } else {
        badgeId = 'rep-' + Date.now();
        badges.push({
          id: badgeId,
          name: name,
          textColor: badgeData.textColor || '#059669',
          bgColor: badgeData.bgColor || '#ecfdf5',
          borderColor: badgeData.borderColor || '#a7f3d0',
          icon: badgeData.icon || 'fa-certificate'
        });
      }
    } else {
      const existing = badges.find(b => b.name === name);
      if (existing) {
        return { success: false, message: 'بۇ نامدىكى ئىناۋەت بەلگىسى ئاللىقاچان مەۋجۇت!' };
      }
      badgeId = 'rep-' + Date.now();
      badges.push({
        id: badgeId,
        name: name,
        textColor: badgeData.textColor || '#059669',
        bgColor: badgeData.bgColor || '#ecfdf5',
        borderColor: badgeData.borderColor || '#a7f3d0',
        icon: badgeData.icon || 'fa-certificate'
      });
    }

    localStorage.setItem(STORAGE_KEYS.REPUTATION_BADGES, JSON.stringify(badges));

    // ئەگەر بار بولغان بەلگىنىڭ نامى ئۆزگەرگەن بولسا، مەزكۇر بەلگىگە ئىگە ۋاكالەتچىلەرنىڭكىنىمۇ تەڭ يېڭىلاش
    if (oldName && oldName !== name) {
      let agents = this.getAgents('none');
      let agChanged = false;
      agents.forEach(a => {
        if (a.reputation === oldName) {
          a.reputation = name;
          agChanged = true;
        }
      });
      if (agChanged) {
        localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
      }
    }

    this.notifyDataChange('reputation_badges');
    return { success: true, message: 'ئىناۋەت بەلگىسى مۇۋەپپەقىيەتلىك ساقلاندى!', badgeId: badgeId };
  }

  deleteReputationBadge(badgeId) {
    let badges = this.getReputationBadges().slice();
    if (badges.length <= 1) {
      return { success: false, message: 'ئەڭ ئاز دېگەندە بىر دانە ئىناۋەت بەلگىسى ساقلىنىشى كېرەك!' };
    }
    const targetBadge = badges.find(b => b.id === badgeId);
    if (!targetBadge) return { success: false, message: 'بەلگە تېپىلمىدى!' };

    badges = badges.filter(b => b.id !== badgeId);
    localStorage.setItem(STORAGE_KEYS.REPUTATION_BADGES, JSON.stringify(badges));

    // ئەگەر بۇ بەلگىگە ئىگە ۋاكالەتچى بولسا، سۈكۈتتىكى 1-بەلگىگە يۆتكەش
    const defaultRep = badges[0].name;
    let agents = this.getAgents('none');
    let agChanged = false;
    agents.forEach(a => {
      if (a.reputation === targetBadge.name) {
        a.reputation = defaultRep;
        agChanged = true;
      }
    });
    if (agChanged) {
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
    }

    this.notifyDataChange('reputation_badges');
    return { success: true, message: 'ئىناۋەت بەلگىسى تىزىملىكتىن ئۆچۈرۈلدى!' };
  }

  updateAgentBrandAuth(agentId, brandsArray) {
    let agents = this.getAgents('none');
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      agent.authorizedBrands = brandsArray;
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
      this.notifyDataChange('agents');
      return true;
    }
    return false;
  }

  updateAgentStatus(agentId, newStatus) {
    let agents = this.getAgents('none');
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      agent.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
      this.notifyDataChange('agents');
      if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.upsertAgent === 'function') {
        window.TeklimakanSupabase.upsertAgent(agent).catch(e => console.warn('Supabase agent status sync error:', e));
      }
      return true;
    }
    return false;
  }

  async deleteAgent(agentId) {
    if (!agentId) return false;
    let agents = this.getAgents('none');
    agents = agents.filter(a => a.id !== agentId);
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
    this.markAgentDeleted(agentId);
    this.notifyDataChange('agents');
    if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.deleteAgent === 'function') {
      const p = window.TeklimakanSupabase.deleteAgent(agentId);
      this.trackCloudWrite(p, 'agent deletion');
      try {
        await p;
      } catch (e) {
        console.warn('Cloud agent deletion error:', e);
      }
    }
    return true;
  }

  // ==================== 🤝 ۋاكالەتچى ئىلتىماس قىلىش ۋە كىرىش ====================
  async applyAgent(agentData) {
    let agents = this.getAgents('none');
    const email = (agentData.email || '').trim().toLowerCase();
    const phone = (agentData.phone || '').trim();

    if (!agentData.name || !email) {
      return { success: false, message: 'ئىسىم ۋە ئېلخەت ئادرېسى كىرگۈزۈش مەجبۇرىي!' };
    }

    // 🛑 ئوخشاش ئېلخەت ياكى تېلېفون نومۇرى بىلەن ئىككىنچى قېتىم ئىلتىماس سۇنۇش ياكى ۋاكالەتچى قوبۇل قىلىشنى چەكلەش
    const existing = this.findExistingAgentByContact(email, phone);
    if (existing) {
      const isEmailDup = email && this.normalizeEmail(existing.email) === email;
      const isPhoneDup = phone && this.normalizePhoneNumber(existing.phone) === this.normalizePhoneNumber(phone);
      let duplicateField = '';
      if (isEmailDup && isPhoneDup) {
        duplicateField = `ئېلخەت ئادرېسى (${agentData.email}) ۋە تېلېفون نومۇرى (${agentData.phone})`;
      } else if (isEmailDup) {
        duplicateField = `ئېلخەت ئادرېسى (${agentData.email})`;
      } else {
        duplicateField = `تېلېفون نومۇرى (${agentData.phone})`;
      }

      return {
        success: false,
        isDuplicate: true,
        message: `❌ كەچۈرۈڭ، بۇ ${duplicateField} بىلەن «${existing.name}» (ID: ${existing.id}) نامىدا ئاللىقاچان ۋاكالەتچى مەۋجۇت!\n\nسېستىمىمىزدا بىرلا ئېلخەت ياكى تېلېفون نومۇرى بىلەن ئىككىنچى بىر ئىلتىماس سۇنۇشقا ياكى قايتا ۋاكالەتچى قوبۇل قىلىشقا قەتئىي يول قويۇلمايدۇ.\n\nئەگەر ئىلگىرى تىزىملاتقان بولسىڭىز، «2. كىرىش ۋە تاۋار سۇنۇش» بۆلىكى ئارقىلىق بىۋاسىتە كىرىڭ ياكى مەخپىي نومۇرىڭىزنى (پارول) قايتا بېكىتىڭ.`
      };
    }

    const nowIso = new Date().toISOString();
    const contractNumber = 'TK-AGR-' + Math.floor(100000 + Math.random() * 900000);
    const signatureHash = 'DIGI-SIGN-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const legalAgreement = {
      contractNumber,
      signedAt: nowIso,
      agentName: agentData.name.trim(),
      agentEmail: email,
      agentPhone: phone,
      salesMethod: agentData.salesMethod || 'ئۆزۈمنىڭ مەھسۇلاتى',
      liabilityClauseAccepted: true,
      liabilityClauseText: 'تور سۇپىمىزنىڭ ئەمەس بەلكى ئۆزىنىڭ مەھسۇلاتىنى سېتىۋاتقان ۋاكالەتچىلەر ئۆزىنىڭ مەھسۇلاتىدىن كېلىپ چىققان ھەرقانداق ئاقىۋەتكە ئۆزى مەسئۇل، سۇپىمىز ئۆز ئۈستىگە ئالمايدۇ.',
      fiveRulesAccepted: true,
      termsVersion: '2026.1-Official',
      digitalSignatureHash: signatureHash
    };

    const newId = 'AGT-' + Math.floor(100 + Math.random() * 900);
    const targetAgent = {
      id: newId,
      name: agentData.name.trim(),
      email: email,
      phone: phone,
      password: (agentData.password && String(agentData.password).trim()) || '',
      trustedDevices: agentData.deviceToken ? [agentData.deviceToken] : [],
      salesMethod: agentData.salesMethod || 'ئۆزۈمنىڭ مەھسۇلاتى',
      status: 'تەستىق كۈتۈۋاتىدۇ',
      canPublishMultilingual: false,
      authorizedBrands: [],
      proposedBrands: agentData.proposedBrands || agentData.categoryInterest || 'بارلىق تۈرلەر',
      notes: agentData.notes || '',
      registeredAt: nowIso.split('T')[0],
      productsCount: 0,
      legalAgreement: legalAgreement
    };
    agents.unshift(targetAgent);

    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
    this.notifyDataChange('agents');

    // 🌐 Supabase بۇلۇت ئامبىرىغا دەرھال ساقلاش (باشقۇرغۇچىنىڭ تېلېفون ياكى كومپيۇتېرىدا كۆرۈنۈشى ئۈچۈن)
    if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.upsertAgent === 'function') {
      try {
        await window.TeklimakanSupabase.upsertAgent(targetAgent);
      } catch (sbErr) {
        console.warn('Supabase agent upsert error:', sbErr);
      }
    }

    // 📲 WhatsApp تېز ئۇلانمىسى تەييارلاش
    let waPhone = (phone || '').replace(/[^0-9]/g, '');
    if (waPhone.startsWith('0')) waPhone = '9' + waPhone;
    else if (!waPhone.startsWith('90') && waPhone.length === 10) waPhone = '90' + waPhone;
    const waLink = waPhone ? `https://wa.me/${waPhone}` : '';

    let adminUrl = 'https://www.teklimakan.com/seidiye';
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      adminUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/seidiye');
    }

    // 🤖 ئالىي باشقۇرغۇچىغا Telegram ئارقىلىق يېڭى ۋاكالەتچى ئىلتىماسى ۋە ئىمزالانغان كېلىشىم ئۇقتۇرۇشى ئەۋەتىش
    const alertTitle = '👤 [يېڭى ۋاكالەتچى ئىلتىماسى ۋە كېلىشىمى] تور بېكەتتىن يېڭى سودىگەر ئىلتىماس قىلدى!';

    let alertMsg = `🆔 <b>ئىلتىماس كودى:</b> <code>${targetAgent.id}</code>\n` +
      `📜 <b>كېلىشىم نومۇرى:</b> <code>${contractNumber}</code>\n` +
      `👤 <b>ئىسىم-فامىلىسى / دۇكان نامى:</b> <b>${targetAgent.name}</b>\n` +
      `📞 <b>تېلېفون نومۇرى:</b> <code>${targetAgent.phone || '-'}</code>\n` +
      `📧 <b>ئېلخەت ئادرېسى:</b> <code>${targetAgent.email}</code>\n` +
      `📦 <b>سېتىش ئۇسۇلى:</b> <b>${targetAgent.salesMethod || 'ئۆزۈمنىڭ مەھسۇلاتى'}</b>\n` +
      `🏷️ <b>تەلەپ قىلغان ماركا/تۈر:</b> ${targetAgent.proposedBrands}\n`;

    if (targetAgent.notes) {
      alertMsg += `📝 <b>ئىلتىماس بايانى / چۈشەندۈرۈش:</b> ${targetAgent.notes}\n`;
    }

    alertMsg += `⚖️ <b>مەسئۇلىيەت بەلگىلىمىسى:</b> تولۇق قوشۇلدى ۋە رەقەملىك ئىمزالاندى\n` +
      `⏳ <b>ھالىتى:</b> <b>تەستىق كۈتۈۋاتىدۇ</b>\n\n`;

    if (waLink) {
      alertMsg += `💬 <a href="${waLink}">📲 <b>ئىلتىماس قىلغۇچى بىلەن WhatsApp ئارقىلىق بىۋاسىتە ئالاقىلىشىش</b></a>\n\n`;
    }

    alertMsg += `👉 <a href="${adminUrl}">🔗 <b>ئارقا باشقۇرۇش مەركىزىدىن تەستىقلاش (بېسىڭ)</b></a>`;

    try {
      await this.sendTelegramAlert({
        title: alertTitle,
        message: alertMsg,
        isUrgent: true
      });
    } catch (tgErr) {
      console.warn('sendTelegramAlert in applyAgent failed:', tgErr);
    }

    return {
      success: true,
      agent: targetAgent,
      contractNumber: contractNumber,
      message: '✅ ۋاكالەتچىلىك ئىلتىماسىڭىز ۋە كېلىشىمنامىڭىز مۇۋەپپەقىيەتلىك تاپشۇرۇلدى! سۇپا باشقۇرغۇچىسى تەكشۈرۈپ تەستىقلىغاندىن كېيىن سىز بىلەن ئالاقىلىشىدۇ.'
    };
  }

  // 📜 ۋاكالەتچىلىك رەسمىي كېلىشىمنامىسى HTML نۇسخىسىنى ھاسىللاش
  generateAgentContractHtml(agent) {
    if (!agent) return '';
    const agr = agent.legalAgreement || {
      contractNumber: 'TK-AGR-' + (agent.id ? agent.id.replace('AGT-', '') : '1001'),
      signedAt: agent.registeredAt ? (agent.registeredAt + 'T00:00:00.000Z') : new Date().toISOString(),
      digitalSignatureHash: 'DIGI-SIGN-' + (agent.id || 'OFFICIAL')
    };

    const signedDateStr = new Date(agr.signedAt).toLocaleString('ug-CN', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return `<!DOCTYPE html>
<html lang="ug" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ۋاكالەتچىلىك كېلىشىمنامىسى - ${agent.name}</title>
<style>
  body { font-family: "UKIJ Tuz Tom", "Microsoft Uighur", "Segoe UI", Arial, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 20px; direction: rtl; }
  .contract-card { max-width: 800px; margin: 0 auto; background: #ffffff; border: 3px double #d97706; border-radius: 16px; padding: 2.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.08); position: relative; }
  .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 1.25rem; margin-bottom: 1.5rem; }
  .header h1 { margin: 0.3rem 0; font-size: 1.6rem; color: #1e3a8a; font-weight: 900; }
  .header p { margin: 0; color: #64748b; font-size: 0.9rem; }
  .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 1rem 1.25rem; margin-bottom: 1.5rem; font-size: 0.88rem; }
  .rule-section { margin-bottom: 1.25rem; font-size: 0.88rem; line-height: 1.65; }
  .rule-section h3 { font-size: 1rem; color: #b45309; margin: 0 0 0.4rem; border-right: 4px solid #d97706; padding-right: 0.5rem; font-weight: 800; }
  .liability-box { background: #fff1f2; border: 2px solid #e11d48; border-radius: 10px; padding: 1.1rem 1.25rem; margin: 1.5rem 0; color: #881337; font-size: 0.92rem; font-weight: 800; line-height: 1.6; }
  .stamp-area { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 2px dashed #cbd5e1; }
  .seal { width: 140px; height: 140px; border-radius: 50%; border: 3px double #dc2626; color: #dc2626; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; font-size: 0.72rem; font-weight: 900; transform: rotate(-8deg); box-shadow: 0 0 0 4px rgba(220,38,38,0.08); }
  @media print {
    body { background: #ffffff; padding: 0; }
    .contract-card { box-shadow: none; border: 2px solid #000; padding: 1.5rem; }
  }
</style>
</head>
<body>
<div class="contract-card">
  <div class="header">
    <div style="font-size: 1.15rem; color: #d97706; font-weight: 900;">★ تەكلىماكان تور سودا سۇپىسى ★</div>
    <h1>ۋاكالەتچىلىك ۋە تاۋار سېتىش قانۇنىي كېلىشىمنامىسى</h1>
    <p>ئېلېكترونلۇق تىزىملىتىش، سالاھىيەت ۋە مەسئۇلىيەت بەلگىلىمىسى پۈتۈمى</p>
  </div>

  <div class="meta-grid">
    <div><strong>📄 كېلىشىم نومۇرى:</strong> <span style="font-family: monospace; font-weight: bold; color: #1e3a8a;">${agr.contractNumber}</span></div>
    <div><strong>📅 ئىمزالانغان ۋاقتى:</strong> <span>${signedDateStr}</span></div>
    <div><strong>👤 ۋاكالەتچى نامى:</strong> <span>${agent.name}</span></div>
    <div><strong>📞 تېلېفون نومۇرى:</strong> <span>${agent.phone || '-'}</span></div>
    <div><strong>📧 ئېلخەت ئادرېسى:</strong> <span>${agent.email}</span></div>
    <div><strong>📦 سېتىش ئۇسۇلى:</strong> <span style="font-weight: 800; color: #b45309;">${agent.salesMethod || (agr && agr.salesMethod) || 'ئۆزۈمنىڭ مەھسۇلاتى'}</span></div>
    <div><strong>🏷️ ئىلتىماس كودى:</strong> <span>${agent.id}</span></div>
  </div>

  <div class="rule-section">
    <h3>1. ئاساسىي بەلگىلىمە ۋە سۇپا تۈزۈمى</h3>
    <p>ۋاكالەتچى تەكلىماكان سۇپىسىغا كىرگەندىن كېيىن سۇپىنىڭ بارلىق نىزاملىرىغا تولۇق ئەمەل قىلىدۇ. بارلىق تاۋارلار ئالىي باشقۇرغۇچىنىڭ تەستىقىدىن ئۆتكەندىن كېيىنلا دۇكاندا سېتىلىشقا چىقىرىلىدۇ. ئادەتتىكى ۋاكالەتچىلەر مەھسۇلاتلىرىنى پەقەت ئۇيغۇرچە بەتتىلا ئېلان قىلالايدۇ.</p>
  </div>

  <div class="rule-section">
    <h3>2. تاشقى ئالاقە چەكلىمىسى ۋە جازا تۈزۈمى</h3>
    <p>مەھسۇلات نامى، مەزمۇنى ياكى سۈرىتىدە تېلېفون نومۇرى، WhatsApp، Telegram، ئۈندىدار ياكى تاشقى تور ئۇلانمىسى يېزىش پۈتۈنلەي چەكلىنىدۇ. بۇ قائىدىگە خىلاپلىق قىلغان ھەر بىر قېتىمدا سىستېما خىلاپلىق قېتىم سانى ($N$) چە كۈن ۋاكالەتچىنىڭ بارلىق مەشغۇلاتىنى ئاپتوماتىك توختىتىدۇ.</p>
  </div>

  <div class="rule-section">
    <h3>3. مەھسۇلات سۈرىتى 5 دەخلىسىز قائىدىسى</h3>
    <p>سۈرەتتە يات ئېلان بولماسلىق؛ ئادەم، مودېل، تەن، قول، بارماق رەسىمى كىرگۈزمەسلىك (پەقەت تاۋارنىڭ ساپ ئۆزى بولۇش)؛ ئېنىقلىقى كەم دېگەندە 800×800 پىكسېل ۋە 1:1 كۋادرات بولۇش؛ JPG, PNG, WEBP فورماتى ۋە 2MB تىن ئاشماسلىق؛ ھەمدە سۇپىنىڭ «🛡️ Teklimakan.com» رەسمىي قوغداش بەلگىسى بېرىلىشى شەرت قىلىنىدۇ.</p>
  </div>

  <div class="liability-box">
    <div style="font-size: 1.05rem; margin-bottom: 0.35rem;">⚖️ 4. مەھسۇلات مەسئۇلىيىتى ۋە ئاقىۋەت بەلگىلىمىسى (دەخلىسىز ماددا):</div>
    «تور سۇپىمىزنىڭ ئەمەس بەلكى ئۆزىنىڭ مەھسۇلاتىنى سېتىۋاتقان ۋاكالەتچىلەر ئۆزىنىڭ مەھسۇلاتىدىن كېلىپ چىققان ھەرقانداق ئاقىۋەتكە ئۆزى مەسئۇل، سۇپىمىز ئۆز ئۈستىگە ئالمايدۇ.»
  </div>

  <div class="stamp-area">
    <div>
      <div style="font-size: 0.85rem; color: #475569; margin-bottom: 0.25rem;"><strong>ئېلېكترونلۇق تەستىقلىغۇچى:</strong> ${agent.name}</div>
      <div style="font-size: 0.82rem; color: #64748b; font-family: monospace;">رەقەملىك ئىمزا: ${agr.digitalSignatureHash}</div>
      <div style="font-size: 0.78rem; color: #059669; font-weight: 800; margin-top: 0.3rem;">✅ رەسمىي ئوقۇپ، مەسئۇلىيەتنى ئۈستىگە ئېلىپ ئىمزالاندى</div>
    </div>
    <div class="seal">
      <div>★ تەكلىماكان ★</div>
      <div style="font-size: 0.65rem; margin: 2px 0;">قانۇنىي كېلىشىم</div>
      <div style="font-size: 0.6rem;">رەقەملىك دەلىللەندى</div>
      <div style="font-size: 0.55rem; font-family: monospace;">OFFICIAL SEAL</div>
    </div>
  </div>
</div>
</body>
</html>`;
  }

  // 📥 ۋاكالەتچىلىك كېلىشىمنامىسىنى ھۆججەت قىلىپ چۈشۈرۈش
  downloadAgentContract(agent) {
    if (!agent) return;
    const html = this.generateAgentContractHtml(agent);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = (agent.name || 'Vendor').replace(/[\\/:*?"<>|]/g, '_');
    a.download = `تەكلىماكان_ۋاكالەتچىلىك_كېلىشىمى_${safeName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // 🔑 ۋاكالەتچىنىڭ سۈكۈتتىكى مەخپىي شىفىرىنى ئېلىش (Default Password)
  getAgentDefaultPassword(agent) {
    if (agent && agent.password && String(agent.password).trim()) {
      return String(agent.password).trim();
    }
    const cleanPhone = (agent && agent.phone ? agent.phone : '').replace(/\D/g, '');
    if (cleanPhone.length >= 6) {
      return cleanPhone.slice(-6);
    }
    return '123456';
  }

  // 🔐 ۋاكالەتچىنىڭ كىرىشىنى دەلىللەش (ئۈسكۈنە ۋە مەخپىي شىفىرنى تەكشۈرۈش)
  verifyAgentLogin(identifier, password = '', deviceToken = '') {
    if (!identifier) return { success: false, message: 'ئېلخەت ياكى تېلېفون كىرگۈزۈڭ!' };
    const term = identifier.trim().toLowerCase();
    const normPhone = this.normalizePhoneNumber(term);
    const agents = this.getAgents('none');
    const agent = agents.find(a => 
      (a.email && this.normalizeEmail(a.email) === term) || 
      (normPhone && this.normalizePhoneNumber(a.phone) === normPhone) ||
      (a.id && a.id.toLowerCase() === term)
    );

    if (!agent) {
      return { success: false, message: 'بۇ ئۇچۇر بىلەن تىزىملاتقان ۋاكالەتچى بايقالمىدى. ئالدى بىلەن ئىلتىماس سۇنۇڭ.' };
    }

    // ⏳ ئەگەر توختىتىش قەرەلى توشقان بولسا ئاپتوماتىك ئېچىش
    if (agent.status === 'توختىتىلدى' && agent.suspendedUntil) {
      const expireMs = new Date(agent.suspendedUntil).getTime();
      if (Date.now() >= expireMs) {
        agent.status = 'تەستىقلاندى';
        agent.suspendedUntil = null;
        agent.suspensionReason = '';
        let allAgents = this.getAgents('none');
        const agIdx = allAgents.findIndex(a => a.id === agent.id);
        if (agIdx !== -1) {
          allAgents[agIdx] = agent;
          localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(allAgents));
          this.notifyDataChange('agents');
        }
      }
    }

    if (agent.status === 'تەستىق كۈتۈۋاتىدۇ') {
      return { 
        success: false, 
        isPending: true, 
        agent, 
        message: '⏳ ئىلتىماسىڭىز تېخى «تەستىق كۈتۈۋاتىدۇ» ھالىتىدە. سۇپا باشقۇرغۇچىسى پات يېقىندا تەكشۈرۈپ تەستىقلايدۇ.' 
      };
    }

    if (agent.status === 'توختىتىلدى') {
      const untilText = agent.suspendedUntil ? new Date(agent.suspendedUntil).toLocaleString('ug-CN', { dateStyle: 'medium', timeStyle: 'short' }) : 'باشقۇرغۇچى تەستىقلىغۇچە';
      const daysCount = agent.violationsCount || 1;
      return { 
        success: false, 
        isSuspended: true, 
        agent, 
        violationsCount: agent.violationsCount || 0,
        suspendedUntil: agent.suspendedUntil,
        suspensionReason: agent.suspensionReason || 'تېلېفون ياكى تور ئۇلانمىسى چەكلەش قائىدىسىگە خىلاپلىق قىلدى',
        message: `⛔ ۋاكالەتچىلىك ھېساباتىڭىز تېلېفون نومۇرى ياكى تور ئۇلانمىسى قوشۇش قائىدىسىگە خىلاپلىق قىلغانلىقىڭىز ئۈچۈن (${daysCount} كۈن) بارلىق مەشغۇلاتتىن توختىتىلغان! توختاش ئاخىرلىشىش ۋاقتى: ${untilText}. ئەگەر چەكلىمىنى بالدۇرراق ئاچقۇزماقچى بولسىڭىز سۇپا باشقۇرغۇچىسى بىلەن ئالاقىلىشىڭ.` 
      };
    }

    // 📱 1. ئۈسكۈنە ئېتىراپ قىلىنغانمۇ (Trusted Device Check)؟
    const isDeviceTrusted = !!(deviceToken && Array.isArray(agent.trustedDevices) && agent.trustedDevices.includes(deviceToken));

    // ئەگەر ئۈسكۈنە ئېتىراپ قىلىنغان بولۇپ، پارول بوش قويۇلغان بولسا بىۋاسىتە ئۆتكۈزۈش
    if (isDeviceTrusted && !password) {
      return { 
        success: true, 
        agent, 
        isTrustedDevice: true,
        violationsCount: agent.violationsCount || 0,
        message: `خۇش كەپسىز، ھۆرمەتلىك ۋاكالەتچى ${agent.name}!` 
      };
    }

    // 🔐 2. ئەگەر يېڭى ئۈسكۈنە بولسا ياكى پارول كىرگۈزۈلمىگەن بولسا پارول تەلەپ قىلىش
    const correctPassword = this.getAgentDefaultPassword(agent);

    if (!password) {
      return {
        success: false,
        requirePassword: true,
        isTrustedDevice: false,
        agentId: agent.id,
        agentName: agent.name,
        maskedPhone: agent.phone ? agent.phone.replace(/(\d{3})\d{4}(\d+)/, '$1****$2') : '',
        maskedEmail: agent.email ? agent.email.replace(/(.{2})(.*)(@.*)/, '$1****$3') : '',
        message: '🔐 بۇ يېڭى ئۈسكۈنە بولغانلىقى ئۈچۈن، مەخپىي شىفىر (پارول) كىرگۈزۈش تەلەپ قىلىنىدۇ.'
      };
    }

    // پارولنى دەلىللەش
    if (password.trim() !== correctPassword) {
      return {
        success: false,
        requirePassword: true,
        isTrustedDevice: false,
        agentId: agent.id,
        agentName: agent.name,
        message: '❌ مەخپىي شىفىر (پارول) خاتا! كىرگۈزگەن شىفىرنى قايتا تەكشۈرۈڭ ياكى «پارولنى قايتا بېكىتىش» كۇنۇپكىسىنى بېسىڭ.'
      };
    }

    // پارول توغرا!
    return { 
      success: true, 
      agent, 
      isTrustedDevice: isDeviceTrusted,
      violationsCount: agent.violationsCount || 0,
      message: `خۇش كەپسىز، ھۆرمەتلىك ۋاكالەتچى ${agent.name}!` 
    };
  }

  // 🛡️ ئۈسكۈنىنى ئىشەنچلىك ئۈسكۈنە تىزىملىكىگە قوشۇش (Trust Device)
  async trustAgentDevice(agentId, deviceToken) {
    if (!agentId || !deviceToken) return false;
    let agents = this.getAgents('none');
    const idx = agents.findIndex(a => a.id === agentId);
    if (idx === -1) return false;
    let agent = agents[idx];
    if (!Array.isArray(agent.trustedDevices)) agent.trustedDevices = [];
    if (!agent.trustedDevices.includes(deviceToken)) {
      agent.trustedDevices.push(deviceToken);
      if (agent.trustedDevices.length > 10) agent.trustedDevices.shift(); // ئەڭ كۆپ بولغاندا 10 ئۈسكۈنە
      agents[idx] = agent;
      this.saveAgents(agents);
      if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.upsertAgent === 'function') {
        try { await window.TeklimakanSupabase.upsertAgent(agent); } catch(e) {}
      }
    }
    return true;
  }

  // 🔍 ئۈسكۈنىنىڭ ئىشەنچلىك ئىكەنلىكىنى تەكشۈرۈش
  isAgentDeviceTrusted(agentId, deviceToken) {
    if (!agentId || !deviceToken) return false;
    const agents = this.getAgents('none');
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return false;
    return !!(Array.isArray(agent.trustedDevices) && agent.trustedDevices.includes(deviceToken));
  }

  // 🔑 ۋاكالەتچىنىڭ مەخپىي شىفىرىنى يېڭىلاش (Admin & Self)
  async updateAgentPassword(agentId, newPassword, clearTrustedDevices = false) {
    if (!agentId || !newPassword) return { success: false, message: 'پارول بوش بولسا بولمايدۇ!' };
    let agents = this.getAgents('none');
    const idx = agents.findIndex(a => a.id === agentId);
    if (idx === -1) return { success: false, message: 'ۋاكالەتچى تېپىلمىدى!' };

    let agent = agents[idx];
    agent.password = String(newPassword).trim();
    if (clearTrustedDevices) {
      agent.trustedDevices = [];
    }
    agents[idx] = agent;
    this.saveAgents(agents);

    // سىستېما ساندۇقىغا خاتىرىلەش
    this.saveSmsLog({
      id: 'LOG-PWD-' + Date.now(),
      recipientName: agent.name,
      phone: agent.phone || 'SYSTEM',
      recipientRole: 'ۋاكالەتچى',
      channel: 'agent_password_update',
      message: `[مەخپىي شىفىر يېڭىلاندى] ۋاكالەتچى: ${agent.name} (${agent.id}) نىڭ كىرىش پارولى مۇۋەپپەقىيەتلىك يېڭىلاندى.`,
      orderId: 'SEC-PWD',
      timestamp: new Date().toLocaleString('ug-CN', { hour12: false })
    });

    if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.upsertAgent === 'function') {
      try { await window.TeklimakanSupabase.upsertAgent(agent); } catch(e) {}
    }

    this.notifyDataChange('agents');
    return { success: true, message: 'مەخپىي شىفىر مۇۋەپپەقىيەتلىك ساقلاندى!' };
  }

  // 📩 پارول ئەسلىگە كەلتۈرۈش كودى تەلەپ قىلىش (Reset Code Request)
  async requestAgentPasswordReset(identifier) {
    if (!identifier) return { success: false, message: 'ئېلخەت ياكى تېلېفون نومۇرىنى كىرگۈزۈڭ!' };
    const term = identifier.trim().toLowerCase();
    const normPhone = this.normalizePhoneNumber(term);
    const agents = this.getAgents('none');
    const agent = agents.find(a => 
      (a.email && this.normalizeEmail(a.email) === term) || 
      (normPhone && this.normalizePhoneNumber(a.phone) === normPhone) ||
      (a.id && a.id.toLowerCase() === term)
    );

    if (!agent) {
      return { success: false, message: 'بۇ ئۇچۇرغا تەۋە ۋاكالەتچى تېپىلمىدى.' };
    }

    // 6 خانىلىق دەلىللەش كودى ھاسىللاش
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 15 * 60 * 1000; // 15 مىنۇت كۈچكە ئىگە

    agent.passwordResetCode = code;
    agent.passwordResetExpires = expires;

    let allAgents = this.getAgents('none');
    const idx = allAgents.findIndex(a => a.id === agent.id);
    if (idx !== -1) {
      allAgents[idx] = agent;
      this.saveAgents(allAgents);
    }

    // 🔗 پارولنى قايتا بېكىتىش بىۋاسىتە ئۇلانمىسىنى ھاسىللاش
    let resetBaseUrl = 'https://www.teklimakan.com';
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      resetBaseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
    }
    const resetLink = `${resetBaseUrl}?reset_agent=${encodeURIComponent(agent.id)}&code=${encodeURIComponent(code)}`;

    const maskedEmail = agent.email ? agent.email.replace(/(.{2})(.*)(@.*)/, '$1****$3') : 'ئېلخەت';
    const maskedPhone = agent.phone ? agent.phone.replace(/(\d{3})\d{4}(\d+)/, '$1****$2') : '';

    // تېلېگرامغا ۋە خەۋەر ساندۇقىغا ئەۋەتىش
    try {
      this.sendTelegramAlert({
        title: `🔑 [ۋاكالەتچى پارول ئەسلىگە كەلتۈرۈش] ${agent.name}`,
        message: `ۋاكالەتچى: ${agent.name} (${agent.id})\n📞 تېلېفون: ${agent.phone}\n📧 ئېلخەت: ${agent.email}\n🔢 دەلىللەش كودى: <b>${code}</b> (15 مىنۇت كۈچكە ئىگە)\n🔗 ئۇلانما: ${resetLink}`,
        isUrgent: false
      });
    } catch(e) {}

    this.saveSmsLog({
      id: 'LOG-RESET-' + Date.now(),
      recipientName: agent.name,
      phone: agent.phone || agent.email || 'SYSTEM',
      recipientRole: 'ۋاكالەتچى',
      channel: 'agent_password_reset',
      message: `[پارول ئەسلىگە كەلتۈرۈش كودى] كودىڭىز: ${code}، ئۇلانما: ${resetLink}`,
      orderId: 'RESET-CODE',
      timestamp: new Date().toLocaleString('ug-CN', { hour12: false })
    });

    return {
      success: true,
      agent: agent,
      agentId: agent.id,
      agentName: agent.name,
      email: agent.email,
      phone: agent.phone,
      maskedEmail,
      maskedPhone,
      code,
      resetLink,
      message: `دەلىللەش كودى ۋە ئۇلانما سىزنىڭ ئېلخېتىڭىزگە يوللاندى.`
    };
  }

  // ✅ دەلىللەش كودىنى تەكشۈرۈپ يېڭى پارول بېكىتىش
  async verifyAndResetAgentPassword(agentId, resetCode, newPassword, deviceToken = '') {
    if (!agentId || !resetCode || !newPassword) {
      return { success: false, message: 'بارلىق مەزمۇنلارنى تولدۇرۇڭ!' };
    }
    let agents = this.getAgents('none');
    const idx = agents.findIndex(a => a.id === agentId);
    if (idx === -1) return { success: false, message: 'ۋاكالەتچى بايقالمىدى!' };

    let agent = agents[idx];
    if (!agent.passwordResetCode || agent.passwordResetCode !== resetCode.trim()) {
      return { success: false, message: '❌ كىرگۈزگەن دەلىللەش كودى خاتا! قايتا تەكشۈرۈپ كىرگۈزۈڭ.' };
    }
    if (agent.passwordResetExpires && Date.now() > agent.passwordResetExpires) {
      return { success: false, message: '⏰ دەلىللەش كودىنىڭ ۋاقتى توشقان (15 مىنۇت)، قايتىدىن كود تەلەپ قىلىڭ.' };
    }

    if (newPassword.trim().length < 6) {
      return { success: false, message: 'مەخپىي شىفىر كەم دېگەندە 6 خانىلىق بولۇشى شەرت!' };
    }

    agent.password = newPassword.trim();
    agent.passwordResetCode = null;
    agent.passwordResetExpires = null;
    if (deviceToken) {
      if (!Array.isArray(agent.trustedDevices)) agent.trustedDevices = [];
      if (!agent.trustedDevices.includes(deviceToken)) agent.trustedDevices.push(deviceToken);
    }
    agents[idx] = agent;
    this.saveAgents(agents);

    if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.upsertAgent === 'function') {
      try { await window.TeklimakanSupabase.upsertAgent(agent); } catch(e) {}
    }

    this.notifyDataChange('agents');
    return {
      success: true,
      agent,
      message: '✅ مەخپىي شىفىر (پارول) مۇۋەپپەقىيەتلىك يېڭىلاندى!'
    };
  }

  // ==================== 🚨 ۋاكالەتچى قائىدىگە خىلاپلىق قىلىش ۋە ئاپتوماتىك كۈن سانىچە توختىتىش ====================
  recordAgentViolation(agentId, violationInfo = {}) {
    let agents = this.getAgents('none');
    const idx = agents.findIndex(a => a.id === agentId);
    if (idx === -1) return null;

    const agent = agents[idx];
    const prevCount = Number(agent.violationsCount || 0);
    const newCount = prevCount + 1;
    agent.violationsCount = newCount;

    // ⛔ جازا قائىدىسى: قانچە قېتىم خىلاپلىق قىلسا، شۇنچە كۈن بارلىق مەشغۇلاتى ئاپتوماتىك توختىتىلىدۇ!
    // N كۈن = N * 24 سائەت
    const suspendMs = newCount * 24 * 60 * 60 * 1000;
    const suspendedUntil = new Date(Date.now() + suspendMs).toISOString();
    
    agent.status = 'توختىتىلدى';
    agent.suspendedUntil = suspendedUntil;
    agent.suspensionReason = violationInfo.reason || 'تېلېفون نومۇرى ياكى تاشقى تور ئۇلانمىسى قوشۇش قائىدىسىگە خىلاپلىق قىلدى';

    agents[idx] = agent;
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
    this.notifyDataChange('agents');

    // 🤖 ئالىي باشقۇرغۇچىغا دەل ۋاقتىدا جىددىي تېلېگرامما ئۇقتۇرۇشى ئەۋەتىش
    const violTypeLabel = violationInfo.type === 'phone' ? 'تېلېفون نومۇرى' : 'تاشقى تور ئۇلانمىسى';
    const untilFormatted = new Date(suspendedUntil).toLocaleString();
    this.sendTelegramAlert({
      title: `🚨 [ۋاكالەتچى ھېساباتى توختىتىلدى] ${newCount}-قېتىملىق قائىدىگە خىلاپلىق تۈپەيلى ${newCount} كۈن قۇلۇپلاندى!`,
      message: `👤 <b>ۋاكالەتچى:</b> <b>${agent.name}</b> (<code>${agent.id}</code>)\n` +
               `📞 <b>تېلېفون:</b> <code>${agent.phone || '-'}</code>\n` +
               `📧 <b>ئېلخەت:</b> <code>${agent.email || '-'}</code>\n\n` +
               `⚠️ <b>خىلاپلىق قېتىم سانى:</b> <b>${newCount} قېتىم</b> (ئىلگىرى: ${prevCount} قېتىم)\n` +
               `⛔ <b>ئاپتوماتىك جازا مۇددىتى:</b> <b>${newCount} كۈن پۈتۈنلەي توختىتىلدى</b>\n` +
               `⏳ <b>توختاش قەرەلى:</b> ${untilFormatted} غىچە\n` +
               `🔍 <b>بايقالغان مەزمۇن:</b> <code>${violationInfo.match || '-'}</code> (${violTypeLabel})\n` +
               `📍 <b>ئورنى:</b> مەھسۇلاتنىڭ <b>${violationInfo.field || 'تېكىستىدە'}</b>\n\n` +
               `🛡️ <i>ئەسكەرتىش: ئالىي باشقۇرغۇچى ئارقا سۇپىدىن خالىغان ۋاقىتتا «چەكلەشنى ئەمەلدىن قالدۇرۇش» كۇنۇپكىسى ئارقىلىق بالدۇرراق ئەسلىگە كەلتۈرەلەيدۇ.</i>`,
      isUrgent: true
    });

    return {
      agent,
      newCount,
      suspendedDays: newCount,
      suspendedUntil
    };
  }

  // 🔓 ئالىي باشقۇرغۇچى: ۋاكالەتچىنىڭ چەكلىمىسىنى ئەمەلدىن قالدۇرۇش ۋە خىلاپلىق سانىنى تەڭشەش
  liftAgentSuspension(agentId, resetViolationCount = false) {
    let agents = this.getAgents('none');
    const idx = agents.findIndex(a => a.id === agentId);
    if (idx === -1) return { success: false, message: 'ۋاكالەتچى تېپىلمىدى!' };

    const agent = agents[idx];
    agent.status = 'تەستىقلاندى';
    agent.suspendedUntil = null;
    agent.suspensionReason = '';
    if (resetViolationCount) {
      agent.violationsCount = 0;
    }

    agents[idx] = agent;
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
    this.notifyDataChange('agents');

    // Telegram ئۇقتۇرۇشى ئەۋەتىش
    this.sendTelegramAlert({
      title: `🔓 [چەكلەش بىكار قىلىندى] ۋاكالەتچى ھېساباتى قايتا ئېچىلدى`,
      message: `👤 <b>ۋاكالەتچى:</b> <b>${agent.name}</b> (<code>${agent.id}</code>)\n` +
               `👑 <b>مەشغۇلات قىلغۇچى:</b> ئالىي باشقۇرغۇچى\n` +
               `📊 <b>خىلاپلىق قېتىم سانى:</b> ${agent.violationsCount || 0} قېتىم\n` +
               `✅ <b>ھالىتى:</b> تەستىقلاندى (نورمال تاۋار ئېلان قىلالايدۇ)`,
      isUrgent: false
    });

    return { 
      success: true, 
      agent, 
      message: `«${agent.name}» نىڭ مەشغۇلات چەكلىمىسى مۇۋەپپەقىيەتلىك ئەمەلدىن قالدۇرۇلدى ۋە سېتىشقا رۇخسەت بېرىلدى!` 
    };
  }

  getProductsByAgent(agentId) {
    if (!agentId) return [];
    return this.getProducts().filter(p => p.agentId === agentId || (p.agentName && p.agentName.includes(agentId)));
  }

  // ==================== 🔗 تاشقى ئۇلىنىش ۋە تور بېكەت سۈزگۈچى (Link Violation Detection) ====================
  detectLinkViolation(text) {
    if (!text || typeof text !== 'string') return null;

    // 1. ئوچۇق تور كېلىشىملىرى ۋە تور بېكەت ئادرېسلىرى (http, https, ftp, www)
    const urlRegex = /(https?:\/\/|ftp:\/\/|file:\/\/|www\.)[^\s/$.?#].[^\s]*/gi;
    const matchUrl = text.match(urlRegex);
    if (matchUrl) return matchUrl[0];

    // 2. كۆپ ئۇچرايدىغان خەلقئارالىق ۋە يەرلىك تور بېكەت ئاخىرلاشما بەلگىلىرى (.com, .net, .cn, .org, .xyz, etc.)
    const domainRegex = /\b([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+(com|net|org|cn|com\.cn|gov|edu|me|xyz|top|site|online|shop|link|info|biz|cc|io|co|vip|club|tech|app|dev|store|live|work|ru|tr|de|uk)\b(\/[^\s]*)?/gi;
    const matchDomain = text.match(domainRegex);
    if (matchDomain) return matchDomain[0];

    // 3. ئىجتىمائىي ئالاقە ۋە قىسقا ئۇلانمىلار (t.me, wa.me, telegram, whatsapp, douyin, kuaishou, etc.)
    const socialRegex = /\b(t\.me|telegram\.me|wa\.me|api\.whatsapp\.com|whatsapp\.com|instagram\.com|facebook\.com|douyin\.com|kuaishou\.com|tiktok\.com|weibo\.com|bit\.ly|tinyurl\.com|weixin|wechat)\b[^\s]*/gi;
    const matchSocial = text.match(socialRegex);
    if (matchSocial) return matchSocial[0];

    return null;
  }

  detectImageLinkViolation(imageSrc, fileName = '') {
    if (!imageSrc) return null;
    if (fileName) {
      const fnMatch = this.detectLinkViolation(fileName);
      if (fnMatch) return fnMatch;
    }
    if (typeof imageSrc === 'string' && !imageSrc.startsWith('data:')) {
      const socialOrAd = /(t\.me|wa\.me|whatsapp|instagram|facebook|douyin|kuaishou|bit\.ly|tinyurl|goo\.gl)/i;
      if (socialOrAd.test(imageSrc)) {
        return imageSrc;
      }
    }
    return null;
  }

  // ==================== 📞 تېلېفون ۋە شەخسىي ئالاقە نومۇرى سۈزگۈچى (Phone Violation Detection) ====================
  detectPhoneViolation(text) {
    if (!text || typeof text !== 'string') return null;

    // 1. ئەرەبچە ۋە پارسچە رەقەملەرنى ئۆلچەملىك 0-9 رەقەمگە ئايلاندۇرۇش
    const normalized = text
      .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
      .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));

    // 2. ئالاقە ۋە تېلېفون ئاچقۇچلۇق سۆزلىرى + ئەگەشكەن رەقەملەر
    const keywordRegex = /(?:تېلېفون|تېلفۇن|ئالاقە|ئالاقىلىشىڭ|ئالاقىلىشىش|نومۇر|نومۇرى|نومۇرۇم|ۋاتساپ|ئۈندىدار|تېلېگرام|تېل|tel|telefon|cep|ileti[sş]im|phone|mobile|whatsapp|wechat|call|contact)[\s:：\-—_]*([+0-9\s\-().]{5,20})/i;
    const kwMatch = normalized.match(keywordRegex);
    if (kwMatch) {
      const rawDigits = kwMatch[1].replace(/\D/g, '');
      if (rawDigits.length >= 5) {
        return kwMatch[0].trim();
      }
    }

    // 3. تۈركىيە يانفون ئەندىزىسى (05xx xxx xx xx ياكى +90 5xx...)
    const trPhoneRegex = /(?:\+?90|0090)?[\s\-.()]*(?:0?5\d{2})[\s\-.()]*\d{3}[\s\-.()]*\d{2}[\s\-.()]*\d{2}\b/;
    const trMatch = normalized.match(trPhoneRegex);
    if (trMatch) return trMatch[0].trim();

    // 4. ئۇيغۇر/جۇڭگو يانفون ئەندىزىسى (13x, 15x, 17x, 18x, 19x بىلەن باشلانغان 11 خانىلىق)
    const cnPhoneRegex = /(?:\+?86|0086)?[\s\-.()]*(?:1[3-9]\d{9})\b/;
    const cnMatch = normalized.match(cnPhoneRegex);
    if (cnMatch) return cnMatch[0].trim();

    // 5. خەلقئارالىق + ياكى 00 بىلەن باشلانغان كۆپ خانىلىق نومۇرلار
    const intlPhoneRegex = /(?:\+|00)\d{1,4}[\s\-.()]*\d{2,4}[\s\-.()]*\d{3,4}[\s\-.()]*\d{2,4}\b/;
    const intlMatch = normalized.match(intlPhoneRegex);
    if (intlMatch) return intlMatch[0].trim();

    // 6. ئارىلىقىغا بوشلۇق قويۇپ ئالداش سىنىقى: مەسىلەن "0 5 3 2 1 2 3 4 5 6 7"
    const spacedDigitsRegex = /(?:\d[\s\-._]{1,3}){6,14}\d/;
    const spacedMatch = normalized.match(spacedDigitsRegex);
    if (spacedMatch) {
      const pureDigits = spacedMatch[0].replace(/\D/g, '');
      if (pureDigits.length >= 7 && pureDigits.length <= 15) {
        if (!/^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}$/.test(spacedMatch[0].trim())) {
          return spacedMatch[0].trim();
        }
      }
    }

    // 7. ئۇدا كەلگەن 7 ۋە ئۇنىڭدىن كۆپ رەقەملەر زەنجىرى
    const digitChainRegex = /\b\d{7,15}\b/;
    const chainMatch = normalized.match(digitChainRegex);
    if (chainMatch) return chainMatch[0].trim();

    return null;
  }

  // ==================== 🛡️ ئۇنىۋېرسال ئالاقە ۋە تاشقى ئۇلىنىش بىخەتەرلىك سۈزگۈچى ====================
  detectContactViolation(text) {
    if (!text || typeof text !== 'string') return null;
    const linkMatch = this.detectLinkViolation(text);
    if (linkMatch) {
      return {
        type: 'link',
        match: linkMatch,
        reason: 'تاشقى تور ئۇلانمىسى ياكى ئىجتىمائىي تاراتقۇ'
      };
    }
    const phoneMatch = this.detectPhoneViolation(text);
    if (phoneMatch) {
      return {
        type: 'phone',
        match: phoneMatch,
        reason: 'تېلېفون ياكى شەخسىي ئالاقە نومۇرى'
      };
    }
    return null;
  }

  // ==================== 📌 ۋاكالەتچى كۈندىلىك ئاكتىپلىق، ئىمزا قويۇش، ئۇيقۇ ھالىتى ۋە ئىستىسنا مەركىزى ====================
  getAgentDailyRules() {
    const settings = this.getSettings() || {};
    return settings.agentDailyRules || {
      enabled: true,
      pointsPerCheckin: 10,
      streak7BonusCommission: 1,
      inactivityThresholdDays: 3,
      dailyFlashDealsEnabled: true,
      dailyFlashDealsDiscount: 15
    };
  }

  updateAgentDailyRules(rules) {
    const settings = this.getSettings() || {};
    settings.agentDailyRules = {
      ...(settings.agentDailyRules || {}),
      ...rules
    };
    this.updateSettings(settings);
    this.notifyDataChange('settings');
    return true;
  }

  agentDailyCheckIn(agentIdentifier) {
    if (!agentIdentifier) return { success: false, message: 'ۋاكالەتچى مەلۇم ئەمەس!' };
    const agents = this.getAgents('none');
    const term = String(agentIdentifier).trim().toLowerCase();
    const idx = agents.findIndex(a => 
      (a.id && a.id.toLowerCase() === term) ||
      (a.email && a.email.toLowerCase() === term) ||
      (a.phone && a.phone.includes(term))
    );
    if (idx === -1) return { success: false, message: 'ۋاكالەتچى تېپىلمىدى!' };

    const agent = agents[idx];
    const rules = this.getAgentDailyRules();
    const todayStr = new Date().toISOString().split('T')[0];

    // ئەگەر بۈگۈن ئاللىقاچان ئىمزا قويغان بولسا
    if (agent.lastCheckInDate === todayStr) {
      return {
        success: false,
        alreadyCheckedIn: true,
        streak: agent.checkInStreak || 1,
        points: agent.checkInPoints || 0,
        message: 'بۈگۈنكى ئىمزا قويۇپ بولدىڭىز! ئەتە كېلىپ داۋاملىق كۈندىلىك نومۇر ئېلىڭ.'
      };
    }

    // كۈن سانى (Streak) ھېسابلاش
    let streak = 1;
    if (agent.lastCheckInDate) {
      const lastDate = new Date(agent.lastCheckInDate);
      const todayDate = new Date(todayStr);
      const diffDays = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak = (agent.checkInStreak || 0) + 1;
      } else {
        streak = 1;
      }
    }

    const pointsEarned = Number(rules.pointsPerCheckin || 10);
    agent.checkInStreak = streak;
    agent.lastCheckInDate = todayStr;
    agent.checkInPoints = (agent.checkInPoints || 0) + pointsEarned;
    agent.inactivityStatus = 'active'; // دەرھال ئويغىتىش

    agents[idx] = agent;
    this.saveAgents(agents);
    this.notifyDataChange('agents');

    const bonus = streak >= 7 ? Number(rules.streak7BonusCommission || 1) : 0;
    return {
      success: true,
      agent,
      streak,
      points: agent.checkInPoints,
      pointsEarned,
      bonusCommission: bonus,
      message: `🎉 بۈگۈنكى ئىمزايىڭىز قويۇلدى! +${pointsEarned} نومۇر قوشۇلدى!`
    };
  }

  toggleAgentDailyExemption(agentId, isExempt) {
    let agents = this.getAgents('none');
    const idx = agents.findIndex(a => a.id === agentId);
    if (idx === -1) return { success: false, message: 'ۋاكالەتچى تېپىلمىدى!' };

    agents[idx].isExemptFromDailyRule = !!isExempt;
    if (isExempt) {
      agents[idx].inactivityStatus = 'active'; // خالىي قىلىنغانلار ھەرگىز ئۇيقۇغا كىرمەيدۇ
    }
    this.saveAgents(agents);
    this.notifyDataChange('agents');
    return { success: true, agent: agents[idx] };
  }

  updateAgentDailyActivity(agentId, data = {}) {
    let agents = this.getAgents('none');
    const idx = agents.findIndex(a => a.id === agentId);
    if (idx === -1) return { success: false, message: 'ۋاكالەتچى تېپىلمىدى!' };

    const agent = agents[idx];
    if (data.checkInStreak !== undefined) agent.checkInStreak = Math.max(0, parseInt(data.checkInStreak) || 0);
    if (data.checkInPoints !== undefined) agent.checkInPoints = Math.max(0, parseInt(data.checkInPoints) || 0);
    if (data.isExemptFromDailyRule !== undefined) agent.isExemptFromDailyRule = !!data.isExemptFromDailyRule;
    if (data.inactivityStatus !== undefined) agent.inactivityStatus = data.inactivityStatus;
    if (data.lastCheckInDate !== undefined) agent.lastCheckInDate = data.lastCheckInDate;

    agents[idx] = agent;
    this.saveAgents(agents);
    this.notifyDataChange('agents');
    return { success: true, agent };
  }

  checkAndUpdateAllAgentsInactivity() {
    const rules = this.getAgentDailyRules();
    if (!rules || rules.enabled === false) return;

    const threshold = Number(rules.inactivityThresholdDays || 3);
    const todayStr = new Date().toISOString().split('T')[0];
    const todayDate = new Date(todayStr);

    let agents = this.getAgents('none');
    let mod = false;

    agents.forEach(a => {
      // 🛡️ ئەگەر باشقۇرغۇچى تەرىپىدىن خالىي قىلىنغان بولسا (Exempted): ھەرگىز ئۇيقۇغا كىرمەيدۇ!
      if (a.isExemptFromDailyRule) {
        if (a.inactivityStatus !== 'active') {
          a.inactivityStatus = 'active';
          mod = true;
        }
        return;
      }

      const refDateStr = a.lastCheckInDate || (a.registeredAt ? a.registeredAt.split('T')[0] : '');
      if (refDateStr) {
        const refDate = new Date(refDateStr);
        const diffDays = Math.round((todayDate - refDate) / (1000 * 60 * 60 * 24));
        if (diffDays >= threshold) {
          if (a.inactivityStatus !== 'dormant') {
            a.inactivityStatus = 'dormant';
            mod = true;
          }
        } else {
          if (a.inactivityStatus === 'dormant') {
            a.inactivityStatus = 'active';
            mod = true;
          }
        }
      }
    });

    if (mod) {
      this.saveAgents(agents);
      this.notifyDataChange('agents');
    }
  }

  getAgentDailyAnalytics(agentId) {
    const agent = this.getAgents('none').find(a => a.id === agentId);
    if (!agent) {
      return { todayVisitors: 0, todayOrders: 0, todayProfit: 0, streak: 0, points: 0, isExempt: false, isDormant: false };
    }

    const todayVisitors = agent.dailyViewsCount || Math.floor(18 + (parseInt(agent.id.replace(/\D/g, '') || 5) * 3) % 25);
    const orders = this.getOrders();
    const agentOrders = orders.filter(o => o.agentId === agent.id);
    const todayOrders = Math.max(1, agentOrders.length % 4);
    const rate = Number(agent.commissionRate || 15);
    const streakBonus = (agent.checkInStreak >= 7 && !agent.isExemptFromDailyRule) ? 1 : 0;
    const effectiveRate = rate + streakBonus;
    const todayProfit = Math.round(todayOrders * 380 * (effectiveRate / 100));

    return {
      todayVisitors,
      todayOrders,
      todayProfit,
      streak: agent.checkInStreak || 0,
      points: agent.checkInPoints || 0,
      lastCheckInDate: agent.lastCheckInDate || '',
      isExempt: !!agent.isExemptFromDailyRule,
      isDormant: agent.inactivityStatus === 'dormant',
      effectiveRate,
      streakBonus
    };
  }

  getAgentDailyFlashDeals() {
    const prods = this.getProducts().filter(p => p.status === 'approved' && p.stock > 0);
    return prods.slice(0, 6).map((p, idx) => {
      const extraComm = 20 + (idx % 3) * 5; // 20%, 25%, 30%
      return {
        ...p,
        flashCommissionRate: extraComm,
        flashTag: '🔥 كۈندىلىك ئالاھىدە پائالىيەت تاۋىرى',
        exclusivePrice: Math.round(p.price * 0.88)
      };
    });
  }

  // ==================== 🤖 مەركىزىي Telegram دەل ۋاقتىدا ئۇقتۇرۇش ئەۋەتكۈچى ====================
  async sendTelegramAlert({ title, message, isUrgent = false, extraData = null }) {
    try {
      const settings = this.getSettings() || {};
      const botToken = (settings.telegramBotToken && settings.telegramBotToken.trim()) || INITIAL_SETTINGS.telegramBotToken || '8880936621:AAG7d5C4CPVyA8XiP0cPYUFYPfJmkF6DWZM';
      const chatId = (settings.telegramChatId && String(settings.telegramChatId).trim()) || INITIAL_SETTINGS.telegramChatId || '7077223578';
      const enabled = settings.telegramEnabled !== false;

      if ((!enabled && !isUrgent) || !botToken || !chatId) {
        console.warn('Telegram alerts disabled or missing credentials');
        return { success: false, message: 'Telegram disabled or credentials missing' };
      }

      const urgencyPrefix = isUrgent ? '🚨 <b>[جىددىي ئۇقتۇرۇش / URGENT ALERT]</b>\n' : '📢 <b>[تەكلىماكان سۇپىسى ئۇقتۇرۇشى]</b>\n';
      const fullText = `${urgencyPrefix}<b>${title}</b>\n\n${message}\n\n⏰ ۋاقتى: ${new Date().toLocaleString()}`;

      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: fullText,
          parse_mode: 'HTML'
        })
      });
      const data = await res.json();
      return { success: data.ok, data };
    } catch (err) {
      console.warn('sendTelegramAlert failed:', err);
      return { success: false, error: err.message };
    }
  }

  async getTelegramUpdates(offset = null) {
    try {
      const settings = this.getSettings() || {};
      const botToken = settings.telegramBotToken || INITIAL_SETTINGS.telegramBotToken;
      if (!botToken) return [];
      const url = `https://api.telegram.org/bot${botToken}/getUpdates?limit=50${offset ? `&offset=${offset}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      return (data && data.ok && Array.isArray(data.result)) ? data.result : [];
    } catch (e) {
      return [];
    }
  }

  // 📅 ۋاكالەتچىنىڭ كۈندىلىك مەھسۇلات يوللاش چېكىنى تەكشۈرۈش (Daily Upload Limit: 1 Product Per Day, Editing Unrestricted)
  checkAgentDailyProductLimit(agentIdentifier) {
    const loginRes = this.verifyAgentLogin(agentIdentifier);
    if (!loginRes.success) {
      return { allowed: false, countToday: 0, limit: 1, message: loginRes.message };
    }
    const agent = loginRes.agent;

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // سىستېمىدىكى تاۋارلاردىن بۈگۈن بۇ ۋاكالەتچى قوشقان يېڭى تاۋارلارنى ساناش
    const allProducts = this.getProducts();
    const uploadedToday = allProducts.filter(p => {
      if (!p.isAgentSubmitted || String(p.agentId) !== String(agent.id)) return false;
      if (!p.createdAt) return false;
      const d = new Date(p.createdAt);
      if (isNaN(d.getTime())) return false;
      const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return dStr === todayStr;
    });

    const count = uploadedToday.length;
    const limit = 1; // كۈندە پەقەت 1 مەھسۇلات يوللاش چېكى

    if (count >= limit) {
      return {
        allowed: false,
        countToday: count,
        limit: limit,
        todayStr: todayStr,
        message: '⚠️ بۈگۈنكى يېڭى مەھسۇلات يوللاش پۇرسىتىڭىز توشتى!\n\nۋاكالەتچىلەر كۈنىگە پەقەت 1 تال مەھسۇلات يوللىيالايدۇ (بۈگۈن 1 تال مەھسۇلات يوللاپ بولدىڭىز).\nيېڭى تاۋار يوللاشنى ئەتە قايتا سىناڭ.\n\n💡 ئەسكەرتىش: بۇرۇن يوللىغان بارلىق مەھسۇلاتلىرىڭىزنىڭ باھاسى ۋە ئۇچۇرلىرىنى خالىغانچە تەھرىرلىسىڭىز بولىدۇ (تەھرىرلەشكە چەك قويۇلمىغان).'
      };
    }

    return {
      allowed: true,
      countToday: count,
      limit: limit,
      todayStr: todayStr,
      remaining: limit - count,
      message: 'سىز بۈگۈن يەنە 1 يېڭى مەھسۇلات يوللىيالايسىز.'
    };
  }

  submitAgentProduct(agentIdentifier, productData) {
    const loginRes = this.verifyAgentLogin(agentIdentifier);
    if (!loginRes.success) {
      return loginRes;
    }
    const agent = loginRes.agent;

    const isEdit = !!productData.id;

    // 🛑 كۈندىلىك يوللاش چېكىنى تەكشۈرۈش (پەقەت يېڭى تاۋار يوللىغاندا چەكلىنىدۇ، كونا تاۋارلارنى تەھرىرلەشكە چەك قويۇلمىغان)
    if (!isEdit) {
      const dailyCheck = this.checkAgentDailyProductLimit(agent.id);
      if (!dailyCheck.allowed) {
        return {
          success: false,
          dailyLimitReached: true,
          message: dailyCheck.message
        };
      }
    }

    // 1. ۋاكالەتچىگە بېرىلگەن ماركا ھوقۇقىنى تەكشۈرۈش
    const authorized = agent.authorizedBrands || [];
    if (authorized.length > 0 && productData.brand && !authorized.includes(productData.brand)) {
      return {
        success: false,
        message: `🚫 سىزگە پەقەت تەستىقلانغان ماركىلارنى («${authorized.join('، ')}») سېتىش ھوقۇقى بېرىلگەن! باشقا ماركىنى تاللىيالمايسىز.`
      };
    }

    // 2. 🌐 تىل دائىرىسى ھوقۇقىنى تەكشۈرۈش (Language Scope Permission)
    // ئەگەر ئالىي باشقۇرغۇچى كۆپ تىلدا ئېلان قىلىش ھوقۇقى بەرمىگەن بولسا پەقەت ئۇيغۇرچە بەتتىلا ئېلان قىلىشقا بولىدۇ
    let finalLanguageScope = productData.languageScope || 'ug';
    if (!agent.canPublishMultilingual && finalLanguageScope !== 'ug') {
      finalLanguageScope = 'ug';
    }

    // 3. سۈرەت بىخەتەرلىكىنى ۋاكالەتچى سۈپىتىدە تەكشۈرۈش
    // ئەگەر ۋاكالەتچى سۈرەتنى باشقۇرغۇچىنىڭ يۈكلىشىنى تاللىغان بولسا تەكشۈرۈشتىن ئۆتۈشكە يول قويۇلىدۇ
    if (!productData.needsAdminImage) {
      const secCheck = this.validateProductImageSecurity(
        productData.image, 
        (productData.name || '') + ' ' + (productData.description || ''),
        false,
        {
          fileName: productData.fileName || '',
          width: productData.imageWidth,
          height: productData.imageHeight,
          isProcessed: true
        }
      );

      if (!secCheck.valid) {
        return {
          success: false,
          message: secCheck.message
        };
      }
    }

    // 4. 🚫 تېلېفون نومۇرى ۋە تاشقى ئۇلىنىش سۈزگۈچى (Strict Phone & Link Prohibition)
    const nameViol = this.detectContactViolation(productData.name);
    const catViol = this.detectContactViolation(productData.category);
    const descViol = this.detectContactViolation(productData.description);
    const imgViol = this.detectImageLinkViolation(productData.image, productData.fileName || '');

    const detectedViol = nameViol || catViol || descViol || (imgViol ? { type: 'link', match: imgViol, reason: 'سۈرەت ئۇلانمىسى' } : null);
    const hasViolation = !!detectedViol;
    const violField = nameViol ? 'نامىدا' : (catViol ? 'تۈرىدە' : (descViol ? 'چۈشەندۈرۈشىدە' : 'رەسىمىدە'));
    const violType = detectedViol ? detectedViol.type : null;
    const violMatch = detectedViol ? detectedViol.match : null;

    const newProdData = {
      ...productData,
      brand: productData.brand || (authorized.length > 0 ? authorized[0] : 'تەكلىماكان سۈپەت'),
      languageScope: finalLanguageScope,
      isAgentSubmitted: true,
      agentId: agent.id,
      agentName: `${agent.name} (${agent.email})`,
      merchantBadge: productData.merchantBadge || agent.reputation || 'ئىشەنچىلىك سودىگەر',
      approvalStatus: 'تەستىق كۈتۈۋاتىدۇ',
      needsAdminImage: !!productData.needsAdminImage,
      hasLinkViolation: hasViolation,
      hasPhoneViolation: violType === 'phone',
      detectedLink: violMatch,
      violationType: violType,
      linkViolationField: hasViolation ? violField : null,
      isAdmin: false
    };

    const saveRes = this.saveProduct(newProdData);
    if (!saveRes.success) {
      return saveRes;
    }

    if (!isEdit) {
      // ۋاكالەتچىنىڭ تاۋار سانىنى ئاشۇرۇش ۋە ئاخىرقى قېتىملىق يوللاش ۋاقتىنى پۈتۈش
      agent.productsCount = (agent.productsCount || 0) + 1;
      const now = new Date();
      agent.lastProductUploadDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      agent.lastProductUploadTime = now.toISOString();

      let agents = this.getAgents('none');
      const aIdx = agents.findIndex(a => a.id === agent.id);
      if (aIdx !== -1) {
        agents[aIdx] = agent;
        localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
        this.notifyDataChange('agents');
      }
    }

    // ئەگەر تېلېفون ياكى ئۇلانما خىلاپلىقى بايقالسا ۋاكالەتچىنى ئاپتوماتىك قېتىم سانىچە كۈن توختىتىش ۋە دەل ۋاقتىدا ئۇقتۇرۇش
    if (hasViolation) {
      const typeText = violType === 'phone' ? 'تېلېفون نومۇرى' : 'تاشقى ئۇلىنىش / تور ئادرېسى';
      
      // 🚨 قېتىم سانىنى ئاشۇرۇش ۋە خىلاپلىق قىلغان قېتىم سانىچە كۈن ئاپتوماتىك توختىتىش (N قېتىم = N كۈن)
      const violResult = this.recordAgentViolation(agent.id, {
        type: violType,
        match: violMatch,
        field: violField,
        reason: `${typeText} كىرگۈزۈش قائىدىسىگە خىلاپلىق قىلدى`
      });

      const suspendedDays = violResult ? violResult.suspendedDays : 1;
      const untilDateStr = violResult && violResult.suspendedUntil 
        ? new Date(violResult.suspendedUntil).toLocaleString('ug-CN', { dateStyle: 'medium', timeStyle: 'short' }) 
        : '';

      return {
        success: true,
        isEdit,
        hasLinkViolation: true,
        hasPhoneViolation: violType === 'phone',
        violationType: violType,
        detectedLink: violMatch,
        linkViolationField: violField,
        violationsCount: violResult ? violResult.newCount : 1,
        suspendedDays: suspendedDays,
        suspendedUntil: violResult ? violResult.suspendedUntil : null,
        product: saveRes.product || newProdData,
        message: `🚫 مەھسۇلاتنىڭ ${violField} ${typeText} («${violMatch}») بايقالدى! بۇ مەھسۇلات دۇكانغا چىقىرىلماي تۇتۇپ قېلىندى. قائىدىگە ئاساسەن ھېساباتىڭىز ${suspendedDays}-قېتىملىق خىلاپلىق سەۋەبىدىن ${suspendedDays} كۈن بارلىق مەشغۇلاتتىن ئاپتوماتىك توختىتىلدى (قەرەلى: ${untilDateStr}).`
      };
    }

    // ئادەتتىكى نورمال تاۋار تاپشۇرۇلغاندا ئالىي باشقۇرغۇچىغا دەل ۋاقتىدا Telegram ئۇقتۇرۇشى يوللاش
    this.sendTelegramAlert({
      title: isEdit ? '📝 [ۋاكالەتچى تەھرىرلىدى] مەھسۇلات باھاسى / ئۇچۇرى يېڭىلاندى' : '📦 [يېڭى تاۋار سۇنۇلدى] ۋاكالەتچى يېڭى تاۋار تاپشۇردى',
      message: `👤 <b>ۋاكالەتچى:</b> <b>${agent.name}</b> (<code>${agent.id}</code>)\n` +
               `📦 <b>مەھسۇلات نامى:</b> <b>${productData.name}</b>\n` +
               `💰 <b>باھاسى:</b> <b>${this.formatPrice(productData.price)}</b>\n` +
               `🏷️ <b>ماركىسى:</b> ${newProdData.brand}\n` +
               `🌐 <b>تىل دائىرىسى:</b> ${newProdData.languageScope === 'all' ? 'بارلىق تىللار' : 'پەقەت ئۇيغۇرچە'}\n` +
               `📊 <b>ئامبار قالدۇقى:</b> ${newProdData.stock} دانە\n` +
               `⏳ <b>ھالىتى:</b> تەستىق كۈتۈۋاتىدۇ`,
      isUrgent: false
    });

    return {
      success: true,
      isEdit,
      hasLinkViolation: false,
      product: saveRes.product || newProdData,
      message: isEdit
        ? '✅ مەھسۇلات باھاسى ۋە ئۇچۇرى ئۆزگەرتىلدى! يېڭى ئۇچۇر باشقۇرغۇچىنىڭ تەستىقىغا يوللاندى.'
        : '✅ تاۋارىڭىز سۇپىغا تاپشۇرۇلدى! سۈرەت تەكشۈرۈشتىن ئۆتتى، باشقۇرغۇچى تەستىقلىغاندىن كېيىن بىۋاستە دۇكانغا چىقىدۇ.'
    };
  }

  // ==================== ماركىلار (Brands) ====================
  getBrands() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BRANDS)) || INITIAL_BRANDS;
  }

  addBrand(brandName) {
    if (!brandName || typeof brandName !== 'string') {
      return { success: false, message: 'ماركا نامى بوش بولماسلىقى كېرەك!' };
    }
    const name = brandName.trim();
    if (!name) {
      return { success: false, message: 'ماركا نامى بوش بولماسلىقى كېرەك!' };
    }
    const brands = this.getBrands();
    if (!brands.includes(name)) {
      brands.push(name);
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
      this.notifyDataChange('brands');
      return { success: true, brand: name, message: `«${name}» ماركىسى سىستېمىغا مۇۋەپپەقىيەتلىك قوشۇلدى!` };
    }
    return { success: true, brand: name, message: `«${name}» ماركىسى ئاللىقاچان سىستېمىدا بار.` };
  }

  deleteBrand(brandName) {
    if (!brandName || typeof brandName !== 'string') {
      return { success: false, message: 'ماركا نامى توغرا ئەمەس!' };
    }
    const name = brandName.trim();
    if (name === 'بارلىق ماركىلار') {
      return { success: false, message: 'بۇ سىستېما سۈكۈتتىكى ماركىسى بولۇپ ئۆچۈرۈشكە بولمايدۇ!' };
    }
    let brands = this.getBrands();
    if (!brands.includes(name)) {
      return { success: false, message: 'بۇنداق ماركا تېپىلمىدى!' };
    }
    brands = brands.filter(b => b !== name);
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
    this.notifyDataChange('brands');
    return { success: true, message: `«${name}» ناملىق ماركا مۇۋەپپەقىيەتلىك ئۆچۈرۈلدى!` };
  }

  updateBrand(oldBrandName, newBrandName) {
    if (!oldBrandName || typeof oldBrandName !== 'string') {
      return { success: false, message: 'كونا ماركا نامى كۆرسىتىلمىگەن!' };
    }
    if (!newBrandName || typeof newBrandName !== 'string') {
      return { success: false, message: 'يېڭى ماركا نامىنى كىرگۈزۈڭ!' };
    }
    const oldName = oldBrandName.trim();
    const newName = newBrandName.trim();

    if (!newName) {
      return { success: false, message: 'يېڭى ماركا نامى بوش بولماسلىقى كېرەك!' };
    }
    if (oldName === 'بارلىق ماركىلار') {
      return { success: false, message: 'بۇ سۈكۈتتىكى سىستېما تۈرى بولۇپ ئۆزگەرتىشكە بولمايدۇ!' };
    }
    if (oldName === newName) {
      return { success: true, message: 'ماركا نامىدا ئۆزگىرىش بولمىدى.' };
    }

    let brands = this.getBrands();
    if (!brands.includes(oldName)) {
      return { success: false, message: 'تەھرىرلەنمەكچى بولغان ماركا تېپىلمىدى!' };
    }
    if (brands.includes(newName)) {
      return { success: false, message: `«${newName}» ناملىق ماركا ئاللىقاچان مەۋجۇت!` };
    }

    // 1. ماركا تىزىملىكىدە ئۆزگەرتىش
    brands = brands.map(b => (b === oldName ? newName : b));
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));

    // 2. مەزكۇر ماركىغا تەۋە تاۋارلارنىڭ ماركىسىنى يېڭىلاش
    let products = this.getProducts();
    let prodsUpdated = 0;
    products = products.map(p => {
      if (p.brand === oldName) {
        prodsUpdated++;
        return { ...p, brand: newName };
      }
      return p;
    });
    if (prodsUpdated > 0) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.saveProduct === 'function') {
        products.filter(p => p.brand === newName).forEach(p => {
          window.TeklimakanSupabase.saveProduct(p).catch(err => console.warn('Supabase product brand sync error:', err));
        });
      }
    }

    // 3. ۋاكالەتچىلەرنىڭ authorizedBrands تىزىملىكىنى يېڭىلاش
    let agents = this.getAgents();
    let agentsUpdated = 0;
    agents = agents.map(a => {
      if (Array.isArray(a.authorizedBrands) && a.authorizedBrands.includes(oldName)) {
        agentsUpdated++;
        const newAuth = a.authorizedBrands.map(b => (b === oldName ? newName : b));
        const updatedAgent = { ...a, authorizedBrands: newAuth };
        if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.upsertAgent === 'function') {
          window.TeklimakanSupabase.upsertAgent(updatedAgent).catch(err => console.warn('Supabase agent brand sync error:', err));
        }
        return updatedAgent;
      }
      return a;
    });
    if (agentsUpdated > 0) {
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
    }

    this.notifyDataChange('brands');
    if (prodsUpdated > 0) this.notifyDataChange('products');
    if (agentsUpdated > 0) this.notifyDataChange('agents');

    return {
      success: true,
      oldBrand: oldName,
      newBrand: newName,
      message: `«${oldName}» ماركىسى «${newName}» غا مۇۋەپپەقىيەتلىك يېڭىلاندى!`
    };
  }

  // ==================== تاۋارلار ====================
  getProducts() {
    let prods = [];
    try {
      prods = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
    } catch (e) {
      prods = [];
    }
    return prods.map(p => {
      if (!p.unit) p.unit = 'دانە';
      return p;
    });
  }

  getProductsByLang(lang = 'ug') {
    const products = this.getProducts();
    return products
      .filter(p => {
        // پەقەت تېخى تەستىقلانمىغان ياكى رەت قىلىنغان مەھسۇلاتلارلا چىقىرىۋېتىلىدۇ
        const status = p.approvalStatus || 'تەستىقلاندى';
        if (status === 'تەستىق كۈتۈۋاتىدۇ' || status === 'رەت قىلىندى' || status === 'rejected' || status === 'pending') {
          return false;
        }

        const scope = p.languageScope || 'all';
        if (scope === 'all') return true;
        return scope === lang;
      })
      .map(p => this.getLocalizedProduct(p, lang));
  }

  getLocalizedProduct(p, lang = 'ug') {
    if (!p) return null;
    let name = p.name || '';
    let description = p.description || '';
    let category = p.category || '';
    let unit = p.unit || 'دانە';
    let badge = p.badge || '';

    if (p.translations && p.translations[lang]) {
      const trObj = p.translations[lang];
      if (trObj.name) name = trObj.name;
      if (trObj.description) description = trObj.description;
      if (trObj.category) category = trObj.category;
      if (trObj.unit) unit = trObj.unit;
      if (trObj.badge) badge = trObj.badge;
    }

    // تۈركچە ياكى ئىنگلىزچە سەھىپىدە ئەگەر تەرجىمە كەم قالغان بولسا دەل جايىدا ئاپتوماتىك تەرجىمە قىلىش
    if (lang !== 'ug' && window.appI18n) {
      if (typeof window.appI18n.autoTranslateUyghur === 'function') {
        if (/[\u0600-\u06FF]/.test(name) || !name) {
          name = window.appI18n.autoTranslateUyghur(p.name || name, lang);
        }
        if (/[\u0600-\u06FF]/.test(description) || !description) {
          description = window.appI18n.autoTranslateUyghur(p.description || description, lang);
        }
      }
      if (typeof window.appI18n.getCategoryName === 'function') {
        category = window.appI18n.getCategoryName(category, lang);
      }
      if (typeof window.appI18n.getUnitName === 'function') {
        unit = window.appI18n.getUnitName(unit || p.unit || 'دانە', lang);
      }
      if (typeof window.appI18n.getBadgeName === 'function' && badge) {
        badge = window.appI18n.getBadgeName(badge, lang);
      }
    }

    return {
      ...p,
      name,
      description,
      category,
      unit,
      badge,
      brand: p.brand || 'تەكلىماكان سۈپەت',
      originalProduct: p
    };
  }

  getProductById(id, lang = null) {
    if (!id) return null;
    const cleanId = String(id).trim().toLowerCase();
    const products = this.getProducts();
    const p = products.find(prod => String(prod.id).trim().toLowerCase() === cleanId);
    if (!p) return null;
    if (lang) return this.getLocalizedProduct(p, lang);
    return p;
  }

  getProductMerchantBadge(product) {
    let repName = 'ئىشەنچىلىك سودىگەر';
    if (product) {
      // 1. ۋاكالەتچىدىن بىۋاسىتە ئېلىش
      if (product.agentId) {
        const agent = this.getAgentById(product.agentId);
        if (agent && agent.reputation) repName = agent.reputation;
      } else if (product.brand) {
        // ماركىغا بېكىتىلگەن ۋاكالەتچىنى تېپىش
        const agents = this.getAgents('none');
        const found = agents.find(a => a.authorizedBrands && a.authorizedBrands.includes(product.brand));
        if (found && found.reputation) repName = found.reputation;
      } else if (product.merchantBadge && product.merchantBadge !== 'auto') {
        repName = product.merchantBadge;
      }
    }
    const badgeObj = this.getReputationBadgeObject(repName);
    // toString قوشۇش ئارقىلىق تېكىست سۈپىتىدە ئىشلەتسىمۇ خاتالىق چىقمايدىغان قىلىش
    badgeObj.toString = function() { return this.name; };
    return badgeObj;
  }

  // 🔍 ۋاكالەتچىلەر مەھسۇلات ئېلان قىلغاندا ئەقلىي ئىزدەش ۋە ئاپتوماتىك تولدۇرۇش تەكلىپلىرى (Autofill Suggestions)
  findProductSuggestions(query, limit = 8) {
    if (!query || typeof query !== 'string') return [];
    const rawQ = query.trim().toLowerCase();
    if (!rawQ) return [];

    // ھەرپلەرنى جانلىق سېلىشتۇرۇش (ئۇيغۇرچە سوزۇق تاۋۇش ۋە ھەمزە، كۆپ ئۇچرايدىغان تۈركچە/ئىنگلىزچە تەرجىمىلىرى بىلەن)
    const norm = (str) => {
      if (!str) return '';
      return String(str)
        .toLowerCase()
        .replace(/[\u064B-\u065F\u0670]/g, '')
        .replace(/ئ/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const qNorm = norm(rawQ);

    // بارلىق مەۋجۇت تاۋارلار
    const allProds = this.getProducts();
    const candidates = [];
    const seenNames = new Set();

    for (const p of allProds) {
      if (!p || !p.name) continue;
      const cleanName = p.name.trim();
      if (seenNames.has(cleanName)) continue;
      seenNames.add(cleanName);
      candidates.push({
        id: p.id,
        name: cleanName,
        brand: p.brand || 'تەكلىماكان كىلاسسىك',
        category: p.category || 'ئۇيغۇر تىبابىتى',
        price: Number(p.price) || 100,
        oldPrice: p.oldPrice ? Number(p.oldPrice) : Math.round((Number(p.price) || 100) * 1.25),
        unit: p.unit || 'دانە',
        stock: p.stock || 50,
        image: p.image || '',
        description: p.description || '',
        keywords: `${cleanName} ${p.category || ''} ${p.brand || ''} ${p.description || ''} ${p.translations?.tr?.name || ''} ${p.translations?.en?.name || ''}`
      });
    }

    // مەخسۇس ئۇيغۇر خاس مەھسۇلاتلىرىنىڭ يۇقىرى سۈپەتلىك تىپىك قېلىپلىرى (Preset Catalog)
    const PRESET_PRODUCT_TEMPLATES = [
      {
        name: 'ئەلا سۈپەتلىك نېپىز قېپى تەبىئىي ياڭاق',
        brand: 'تەكلىماكان كىلاسسىك',
        category: 'قۇرۇق يەل-يېمىشلەر',
        price: 240,
        oldPrice: 300,
        unit: '1 كىلو',
        stock: 50,
        image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
        description: 'تەبىئىي، تاللانغان ئەلا سۈپەتلىك خوتەن نېپىز قېپى ياڭىقى. مېغىزى توق ۋە تەملىك.',
        keywords: 'ياڭاق ceviz walnut yongaq'
      },
      {
        name: 'قەشقەر قەغەز بادىمى (تاللانغان ئەلا سۈپەتلىك)',
        brand: 'خوتەن مىراس',
        category: 'قۇرۇق يەل-يېمىشلەر',
        price: 380,
        oldPrice: 450,
        unit: '1 كىلو',
        stock: 40,
        image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80',
        description: 'قەشقەرنىڭ ئەنئەنىۋى قەغەز بادىمى. قېپى يۇمشاق، ئاسان چاقىلىدىغان، مېغىزى قۇرغاق ھەم تاتلىق.',
        keywords: 'بادام badem almond badam'
      },
      {
        name: 'تۇرپان قارا كىشمىش قۇرۇق ئۈزۈمى',
        brand: 'تۇرپان يېشىل',
        category: 'قۇرۇق يەل-يېمىشلەر',
        price: 180,
        oldPrice: 220,
        unit: '1 كىلو',
        stock: 60,
        image: 'https://images.unsplash.com/photo-1595231776515-ddffb1f4eb73?auto=format&fit=crop&w=800&q=80',
        description: 'قۇياش نۇرىدا تەبىئىي قۇرۇتۇلغان تۇرپاننىڭ داڭلىق شېكەرسىز، پاكىز قارا كىشمىش ئۈزۈمى.',
        keywords: 'ئۈزۈم كىشمىش quruq uzum kismis kuru uzum raisin'
      },
      {
        name: 'تەبىئىي شىپالىق پىننە گۈلقەنتى (ئاشقازان ۋە ھەزىمگە مەنپەئەتلىك)',
        brand: 'تەكلىماكان تىبابىتى',
        category: 'گۈلقەنتلەر',
        price: 260,
        oldPrice: 320,
        unit: '1 كىلو',
        stock: 35,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        description: 'ئەنئەنىۋى تىبابەت رېتسىپى بويىچە يېڭى پىننە ۋە تەبىئىي گۈل شىرنىسىدىن ياسالغان، ھەزىم ۋە سۈرۈشكە مەنپەئەتلىك گۈلقەنت.',
        keywords: 'گۈلقەنت پىننە gulqent nane gül reçeli gülqent'
      },
      {
        name: 'خوتەن ئەلا سۈپەتلىك قىزىلگۈل گۈلقەنتى',
        brand: 'خوتەن مىراس',
        category: 'گۈلقەنتلەر',
        price: 280,
        oldPrice: 350,
        unit: '1 كىلو',
        stock: 45,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        description: 'خوتەن قىزىلگۈلىدىن تەبىئىي ئېچىتىپ تەييارلانغان پۇراقلىق، يۈرەك ۋە باۋۇرنى قۇۋۋەتلىگۈچى خاس گۈلقەنت.',
        keywords: 'قىزىلگۈل گۈلقەنت gulqent gül reçeli rose jam'
      },
      {
        name: 'ئۇيغۇر مىللىي سەپەرگۈل چېيى (Safflower Tea)',
        brand: 'ئىلى ئورگانىك',
        category: 'ئۆسۈملۈك دورىلار',
        price: 150,
        oldPrice: 190,
        unit: '100 گرام',
        stock: 50,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
        description: 'قان ئايلىنىشنى ياخشىلايدىغان، كۆكرەك ۋە يۈرەك راھەتلىكى ئۈچۈن تەبىئىي ئۆسۈملۈك سەپەرگۈل چېيى.',
        keywords: 'سەپەرگۈل چاي sepergül aspir çayı safflower'
      },
      {
        name: 'ئىلى ساپ ئورگانىك تاغ ھەسىلى (1kg)',
        brand: 'ئىلى ئورگانىك',
        category: 'ئۆسۈملۈك دورىلار',
        price: 450,
        oldPrice: 550,
        unit: '1 كىلو',
        stock: 30,
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
        description: 'ئىلى جىلغىسىنىڭ ياۋا تاغ گۈللىرىدىن ئېلىنغان ساپ، ھېچقانداق قەنت ياكى خۇرۇچ قوشۇلمىغان تەبىئىي تاغ ھەسىلى.',
        keywords: 'ھەسەل hesel bal honey dağ balı'
      },
      {
        name: 'خوتەن چوڭ دانىلىق تاتلىق قىزىل چىلىنى (Jujube)',
        brand: 'خوتەن مىراس',
        category: 'قۇرۇق يەل-يېمىشلەر',
        price: 160,
        oldPrice: 200,
        unit: '1 كىلو',
        stock: 60,
        image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80',
        description: 'خوتەن نۇرلۇق كىلىماتىدا يېتىلگەن ئەلا سۈپەتلىك، گۆشى قېلىن ۋە تاتلىق قىزىل چىلان.',
        keywords: 'چىلان chilan hünnap jujube red date'
      },
      {
        name: 'ئاتۇش ئەلا سۈپەتلىك سېرىق ئەنجۈر قېقى',
        brand: 'قەشقەر قەدىمىي',
        category: 'قۇرۇق يەل-يېمىشلەر',
        price: 220,
        oldPrice: 270,
        unit: '1 كىلو',
        stock: 40,
        image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80',
        description: 'ئاتۇشنىڭ داڭلىق ئاپتاپتا قۇرۇتۇلغان سېرىق ئەنجۈر قېقى. تاتلىق ۋە ئاشقازانغا شىپالىق.',
        keywords: 'ئەنجۈر enjur incir fig dried figs'
      },
      {
        name: 'ئەنئەنىۋى قولدا تىكىلگەن چىمەن دوپپا',
        brand: 'خوتەن مىراس',
        category: 'مەدەنىيەت بۇيۇملىرى',
        price: 350,
        oldPrice: 450,
        unit: 'دانە',
        stock: 25,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
        description: 'ئۇيغۇر مىللىي كەشتىچىلىك سەنئىتى بىلەن قولدا تىكىلگەن يېشىل چىمەن ئەنئەنىۋى دوپپا.',
        keywords: 'دوپپا doppa uygur doppa şapka külah'
      },
      {
        name: 'ئەسلى خوتەن يىپەك ئەتلەس رەختى (مېتىرلىق)',
        brand: 'خوتەن مىراس',
        category: 'مەدەنىيەت بۇيۇملىرى',
        price: 550,
        oldPrice: 700,
        unit: 'مېتىر',
        stock: 30,
        image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
        description: 'ساپ تەبىئىي يىپەكتىن توقۇلغان خوتەن ئەنئەنىۋى گۈللۈك ئەتلەس رەختى.',
        keywords: 'ئاتلاس ئەتلەس atlas ipek kumaş etles'
      },
      {
        name: 'قەشقەر ئەنئەنىۋى قول سەنئىتى مىس چەينىكى',
        brand: 'قەشقەر قەدىمىي',
        category: 'مەدەنىيەت بۇيۇملىرى',
        price: 850,
        oldPrice: 1100,
        unit: 'دانە',
        stock: 15,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
        description: 'قەشقەر ھۈنەرۋەنلىرى تەرىپىدىن مىستىن ئەستايىدىل نەقىشلەنگەن مىللىي ئەنئەنىۋى سۇ چەينىكى.',
        keywords: 'مىس چەينەك چۆگۈن bakır çaydanlık ibrik'
      },
      {
        name: 'ساپ تەبىئىي كالا سۈتى قۇرۇتى (قەنتسىز)',
        brand: 'ئىلى ئورگانىك',
        category: 'قۇرۇق يەل-يېمىشلەر',
        price: 180,
        oldPrice: 220,
        unit: '1 كىلو',
        stock: 50,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        description: 'يايلاق كالىسىنىڭ ساپ سۈتىدىن ئەنئەنىۋى ئۇسۇلدا ئېچىتىلىپ قۇرۇتۇلغان ساغلام ۋە مەززىلىك قۇرۇت.',
        keywords: 'قۇرۇت qurut kurut çökelek dried yogurt'
      },
      {
        name: 'ئۇيغۇر ئەنئەنىۋى گۈل نېنى (قۇيۇق سۈتلۈك)',
        brand: 'تەكلىماكان كىلاسسىك',
        category: 'قۇرۇق يەل-يېمىشلەر',
        price: 35,
        oldPrice: 45,
        unit: 'دانە',
        stock: 100,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        description: 'تونۇردا سۈت ۋە سېرىقماي بىلەن يېقىلغان، يۈزى نەقىشلىك مەززىلىك مىللىي گۈل نان.',
        keywords: 'نان nan ekmek uygur ekmeği flatbread'
      }
    ];

    for (const t of PRESET_PRODUCT_TEMPLATES) {
      if (!seenNames.has(t.name)) {
        seenNames.add(t.name);
        candidates.push({
          id: 'TMPL-' + Math.floor(100 + Math.random() * 900),
          name: t.name,
          brand: t.brand,
          category: t.category,
          price: t.price,
          oldPrice: t.oldPrice,
          unit: t.unit,
          stock: t.stock,
          image: t.image,
          description: t.description,
          keywords: `${t.name} ${t.category} ${t.brand} ${t.description} ${t.keywords}`
        });
      }
    }

    const matches = [];
    for (const c of candidates) {
      const cNameNorm = norm(c.name);
      const cKwNorm = norm(c.keywords);
      let score = 0;

      if (cNameNorm === qNorm) {
        score = 100;
      } else if (cNameNorm.startsWith(qNorm)) {
        score = 85;
      } else if (cNameNorm.includes(qNorm)) {
        score = 65;
      } else if (cKwNorm.includes(qNorm)) {
        score = 45;
      } else {
        const qWords = qNorm.split(' ').filter(w => w.length > 1);
        let wordHits = 0;
        for (const w of qWords) {
          if (cKwNorm.includes(w)) wordHits++;
        }
        if (wordHits > 0) {
          score = 25 * wordHits;
        }
      }

      if (score > 0) {
        matches.push({ product: c, score });
      }
    }

    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, limit).map(m => m.product);
  }

  // ==================== ئادەم رەسىمى ۋە يات خەتلەرنى تەكشۈرۈش / سۈزۈش ====================
  containsHumanImage(textOrUrl) {
    if (!textOrUrl) return false;
    // Base64 رەسىم سانلىق مەلۇماتىنى تېكىست دەپ خاتا تەكشۈرمەسلىك
    if (typeof textOrUrl === 'string' && textOrUrl.startsWith('data:image/')) {
      return false;
    }

    const str = String(textOrUrl).toLowerCase();

    // خاتا ماسلىشىشتىن ساقلىنىش: مەسىلەن necklace (بويۇنتۇمار)، surface، pharmacy، german
    const cleanedStr = str.replace(/necklace|surface|pharmacy|german|command|performance/gi, '');

    // ئىنگلىزچە ئادەم ۋە مودېل سۈرەت خەتكۈچلىرى (سۆز چېگرىسى بىلەن)
    const englishHumanPatterns = [
      /\b(?:person|persons|people|human|humans|portrait|portraits|selfie|model|models)\b/i,
      /\b(?:man|men|woman|women|girl|girls|boy|boys|lady|ladies)\b/i,
      /\b(?:finger|fingers|fingernail|fingernails|nailart|manicure|pedicure)\b/i,
      /\b(?:hand|hands|wrist|wrists|arm|arms|bare\s*skin|bodypart)\b/i,
      /\b(?:face|faces|facemodel|feet|foot|legs|naked|nude)\b/i
    ];

    for (const pattern of englishHumanPatterns) {
      if (pattern.test(cleanedStr)) {
        return true;
      }
    }

    // ئۇيغۇرچە ئادەم سۈرىتى بەلگىلىرى (خوتەن، قولدا، قول ھۈنەر، دەريا، تەرىپىدىن قاتارلىق سۆزلەرنى خاتا تۇتۇۋالماسلىق)
    const uyghurHumanPatterns = [
      /\bئادەم\b|\bئادەملەر\b|\bمودېل\b|\bيۈز\s*رەسىمى\b|\bئايال\s*رەسىمى\b|\bئەر\s*رەسىمى\b/,
      /\bقىز\s*رەسىمى\b|\bبالا\s*رەسىمى\b|\bئىنسان\b|\bھۆسن\s*مودېلى\b/,
      /\bپۈتۈن\s*بەدەن\b|\bيالىڭاچ\b|\bبارماق\s*رەسىمى\b|\bتىرناق\s*سەنئىتى\b|\bتىرناق\s*رەسىمى\b/,
      /(?<!خو|ۋە)تەن(?!لىك|دۇر)/, // 'تەن' گە ماس كېلىدۇ، ئەمما 'خوتەن' ياكى 'ۋەتەن' گە ئەمەس
      /(?<!قولدا|قول\s*ھۈنەر|قول\s*ئەمگى)قول(?!\s*دا|\s*ھۈنەر|\s*ئەمگەك|\s*ئەمگى)/ // ئادەم قولى رەسىمىنىلا تۇتۇپ، 'قولدا'، 'قول ھۈنەر' گە تەگمەسلىك
    ];

    for (const pat of uyghurHumanPatterns) {
      if (pat.test(str)) {
        return true;
      }
    }

    return false;
  }

  // 5-قائىدە: تاۋار رەسىمىنى يۇقىرى سۈپەتتە ئەلالاشتۇرۇش ۋە پىرىسلاش
  applyTeklimakanWatermark(imgElementOrSrc) {
    return new Promise((resolve, reject) => {
      const render = (img) => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          let origW = img.naturalWidth || img.width || 800;
          let origH = img.naturalHeight || img.height || 800;

          // سۈرەتنى ئەلا سۈپەتتە ئەلالاشتۇرۇش (ئەڭ چوڭ كەڭلىك / ئېگىزلىك: 800px)
          let targetW = origW;
          let targetH = origH;
          const maxDim = 800;
          if (targetW > maxDim || targetH > maxDim) {
            const downScale = Math.min(maxDim / targetW, maxDim / targetH);
            targetW = Math.round(targetW * downScale);
            targetH = Math.round(targetH * downScale);
          }

          canvas.width = targetW;
          canvas.height = targetH;

          // سۈرەتنى تولۇق سۈزۈك سىزىش
          ctx.drawImage(img, 0, 0, targetW, targetH);

          // سۈرەتنى كۆچمە تور ۋە بۇلۇتقا يۈكلەشكە ماس يۇقىرى سۈپەتلىك JPEG ھالىتىدە چىقىرىش
          let cleanDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          if (cleanDataUrl.length > 300 * 1024 * 4 / 3) {
            cleanDataUrl = canvas.toDataURL('image/jpeg', 0.75);
          }
          resolve({
            dataUrl: cleanDataUrl,
            width: targetW,
            height: targetH,
            origWidth: origW,
            origHeight: origH
          });
        } catch (err) {
          console.error('Image optimization error:', err);
          resolve({
            dataUrl: typeof imgElementOrSrc === 'string' ? imgElementOrSrc : (img.src || ''),
            width: img.naturalWidth || 800,
            height: img.naturalHeight || 800,
            origWidth: img.naturalWidth || 800,
            origHeight: img.naturalHeight || 800
          });
        }
      };

      if (typeof imgElementOrSrc === 'string') {
        const tempImg = new Image();
        tempImg.crossOrigin = 'anonymous';
        tempImg.onload = () => render(tempImg);
        tempImg.onerror = (e) => reject(e);
        tempImg.src = imgElementOrSrc;
      } else {
        render(imgElementOrSrc);
      }
    });
  }

  // ئەكىرىلگەن رەسىمنىڭ 5 تۈرلۈك دەخلىسىز قائىدە ۋە نىزامنامىگە ئۇيغۇنلۇقىنى تەكشۈرۈش
  // (ۋاكالەتچىلەر ئۈچۈن: قاتتىق سۈزۈش؛ ئالىي باشقۇرغۇچىغا ھېچقانداق چەكلىمە يوق)
  validateProductImageSecurity(imageSrc, ocrOrMetaText = '', isAdmin = false, options = {}) {
    // 👑 ئالىي باشقۇرغۇچى بولسا ھېچقانداق سۈزۈش ۋە چەكلىمە يوق، بىۋاستە تولۇق ھوقۇق
    if (isAdmin) {
      return {
        valid: true,
        rule: 0,
        reason: 'admin_override',
        message: '✅ باشقۇرغۇچى ھوقۇقى: تولۇق ھوقۇق بىلەن قوبۇل قىلىندى.'
      };
    }

    // 4-قائىدە: فورمات تەكشۈرۈش (پەقەت jpg, jpeg, png, webp)
    if (options.fileType || options.fileName) {
      const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
      if (options.fileType && !allowedMimes.includes(options.fileType.toLowerCase())) {
        return {
          valid: false,
          rule: 4,
          reason: 'invalid_format',
          message: '🚫 4-قائىدىگە خىلاپ: پەقەت JPG, JPEG, PNG ياكى WEBP فورماتىدىكى تاۋار سۈرەتلىرى قوبۇل قىلىنىدۇ!'
        };
      }
      if (options.fileName) {
        const lastDot = options.fileName.lastIndexOf('.');
        if (lastDot !== -1) {
          const ext = options.fileName.slice(lastDot).toLowerCase();
          if (!allowedExts.includes(ext)) {
            return {
              valid: false,
              rule: 4,
              reason: 'invalid_extension',
              message: `🚫 4-قائىدىگە خىلاپ: ھۆججەت تۈرى (${ext}) قوبۇل قىلىنمايدۇ! پەقەت JPG, PNG, WEBP سۈرەتلەر قوبۇل قىلىنىدۇ.`
            };
          }
        }
      }
    }

    // 4-قائىدە: ھۆججەت سىغىمى (پىششىقلانمىغان خام ھۆججەت 35MB، پىششىقلانغان سۈرەت 6MB تىن ئاشماسلىقى شەرت)
    const maxAllowedSize = options.isProcessed ? (6 * 1024 * 1024) : (35 * 1024 * 1024);
    if (options.fileSize && options.fileSize > maxAllowedSize) {
      return {
        valid: false,
        rule: 4,
        reason: 'file_too_large',
        message: '🚫 4-قائىدىگە خىلاپ: سۈرەت سىغىمى بەك چوڭ (35MB تىن ئېشىپ كەتتى)! سۈرەتنى كىچىكلىتىپ يوللاڭ.'
      };
    }

    // 3-قائىدە: سۈرەت ئېنىقلىقى (پىششىقلانغان سۈرەت كەم دېگەندە 750×750 پىكسېل بولۇشى شەرت؛ خام سۈرەتلەر ئاپتوماتىك تەڭشىلىدۇ)
    if (options.isProcessed && options.width && options.height) {
      if (options.width < 750 || options.height < 750) {
        return {
          valid: false,
          rule: 3,
          reason: 'low_resolution',
          message: `🚫 3-قائىدىگە خىلاپ: سۈرەت ئېنىقلىقى بەك تۆۋەن (${options.width}×${options.height} پىكسېل)! كەم دېگەندە 800×800 پىكسېل بولۇشى شەرت.`
        };
      }
    }

    // 2-قائىدە: ئەخلاقىي ۋە مەدەنىيەت ئۆلچىمى (ئادەم يۈزى، مودېل، تەن، قول، بارماقنى مۇتلەق چەكلەش)
    if (this.containsHumanImage(imageSrc) || this.containsHumanImage(ocrOrMetaText)) {
      return {
        valid: false,
        rule: 2,
        reason: 'human',
        message: '🚫 2-قائىدىگە خىلاپ: رەسىمدە ئادەم (مودېل، يۈز، قول، بارماق ياكى بەدەن ئەزاسى) بارلىقى بايقالدى! مەھسۇلات پەقەت ئۆزىلا (تەكشى قويۇلغان ياكى مانېكېندا) تارتىلىشى شەرت.'
      };
    }

    // 1-قائىدە: تاشقى ئالاقە ۋە ئېلانلارنى مۇتلەق چەكلەش (تېلېفون، ئۈندىدار، تاشقى تور ئادرېسى، يات سۇپا بەلگىلىرى)
    if (ocrOrMetaText && typeof ocrOrMetaText === 'string') {
      const text = ocrOrMetaText.toLowerCase();

      // رۇخسەت قىلىنغان سۆزلەر (بىزنىڭ تور بېكەت ئالاقە ۋە ماركا ئۇچۇرلىرىمىز)
      const allowedPatterns = [
        /teklimakan/g,
        /تەكلىماكان/g,
        /05551609999/g,
        /5551609999/g,
        /teklimakan\.online/g
      ];

      let cleanedText = text;
      allowedPatterns.forEach(pattern => {
        cleanedText = cleanedText.replace(pattern, '');
      });

      // يات تېلېفون نۇمۇرلىرى بارمۇ؟ (7 ياكى ئۇنىڭدىن كۆپ ئۇلاپ يېزىلغان رەقەملەر)
      const foreignPhoneRegex = /(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}|\b\d{7,14}\b/;
      if (foreignPhoneRegex.test(cleanedText)) {
        return {
          valid: false,
          rule: 1,
          reason: 'unauthorized_contact',
          message: '🚫 1-قائىدىگە خىلاپ: رەسىم ياكى ھۆججەتتە رەسمىي تېلېفوندىن باشقا ئالاقە نومۇرى بايقالدى!'
        };
      }

      // تاشقى سۇپىلارنىڭ ماركا، سۇ بەلگىسى، QR كود ۋە ئېلان سۆزلىرى
      const forbiddenAdsKeywords = [
        'trendyol', 'taobao', 'pinduoduo', '1688', 'tmall', 'jd.com', 'aliexpress', 
        'amazon', 'ebay', 'temu', 'shein', 'shopee', 'lazada', 'hepsiburada', 'n11',
        'wechat', 'weixin', 'whatsapp', 'telegram', 'viber', 'qq:', 'qq',
        'ئۈندىدار', 'ۋېيشىن', 'تېلېگرام', 'ۋاتساپ', 'سېتىۋېلىش ئۈچۈن قوشۇڭ',
        '扫码', '加微信', '联系电话', '代购', '淘宝', '拼多多', '微信号', '二维码', 'qr code', 'qrcode'
      ];
      for (const keyword of forbiddenAdsKeywords) {
        if (cleanedText.includes(keyword)) {
          return {
            valid: false,
            rule: 1,
            reason: 'unauthorized_platform',
            message: `🚫 1-قائىدىگە خىلاپ: تاشقى سۇپا تامغىسى، ئېلان ياكى يات ئالاقە («${keyword}») بايقالدى! تاۋار سۈرىتى پۈتۈنلەي ساپ بولۇشى شەرت.`
          };
        }
      }
    }

    return {
      valid: true,
      rule: 5,
      reason: 'clean',
      message: '✅ 5 تۈرلۈك دەخلىسىز قائىدىگە تولۇق ئۇيغۇن كەلدى!'
    };
  }

  prepareProductTranslations(product, previousProduct = null) {
    const translations = { ...(previousProduct?.translations || {}), ...(product.translations || {}) };
    const translate = (text, lang) => {
      if (!text) return '';
      if (lang === 'ug') return text;
      if (window.appI18n && typeof window.appI18n.autoTranslateUyghur === 'function') {
        return window.appI18n.autoTranslateUyghur(text, lang);
      }
      return text;
    };

    ['ug', 'tr', 'en'].forEach(lang => {
      const incoming = product.translations?.[lang] || {};
      const previous = previousProduct?.translations?.[lang] || {};
      const localized = { ...previous, ...incoming };
      ['name', 'description', 'category'].forEach(field => {
        const sourceValue = product[field] || '';
        const incomingValue = incoming[field] || '';
        const previousValue = previous[field] || '';
        const sourceChanged = !!previousProduct && sourceValue !== (previousProduct[field] || '');
        const hasUyghurChar = /[\u0600-\u06FF]/.test(incomingValue || '');

        if (lang === 'ug') {
          localized[field] = sourceValue;
        } else if (sourceChanged || !incomingValue || hasUyghurChar) {
          localized[field] = translate(sourceValue, lang);
        } else {
          localized[field] = incomingValue || previousValue || translate(sourceValue, lang);
        }
      });

      // Unit ۋە Badge نى تىللار بويىچە ماسلاشتۇرۇش
      if (lang === 'ug') {
        localized.unit = product.unit || 'دانە';
        localized.badge = product.badge || '';
      } else {
        localized.unit = (window.appI18n && typeof window.appI18n.getUnitName === 'function')
          ? window.appI18n.getUnitName(product.unit || 'دانە', lang)
          : (product.unit || 'دانە');
        localized.badge = (window.appI18n && typeof window.appI18n.getBadgeName === 'function' && product.badge)
          ? window.appI18n.getBadgeName(product.badge, lang)
          : (product.badge || '');
      }

      translations[lang] = localized;
    });

    return translations;
  }

  saveProduct(productData) {
    // 🚫 پەقەت ۋاكالەتچى يوللىغان تاۋارلاردىلا ئادەم سۈرىتى بار-يوقلۇقىنى تەكشۈرۈش (باشقۇرغۇچىغا ھېچقانداق چەكلىمە يوق)
    if (productData.isAgentSubmitted && !productData.isAdmin) {
      if (this.containsHumanImage(productData.image)) {
        return { 
          success: false, 
          isHumanViolation: true, 
          message: '⚠️ دىققەت: تور بېكەت تەلىپى بويىچە تاۋار رەسىملىرىدە ئادەم رەسىمى بولۇشقا قەتئىي بولمايدۇ! پەقەت تاۋار ۋە مەھسۇلاتنىڭ ئۆزىنىلا رەسىمگە تارتىپ چىقىرىڭ. بۇ ئېلان تەستىقلانمىدى ۋە ئۆچۈرۈلدى!' 
        };
      }
    }

    const products = this.getProducts();
    if (productData.brand) {
      this.addBrand(productData.brand);
    }

    // ئەگەر تەستىق ھالىتى بېكىتىلمىگەن بولسا: ۋاكالەتچى يوللىغان بولسا 'تەستىق كۈتۈۋاتىدۇ'، باشقۇرغۇچى قوشقان بولسا 'تەستىقلاندى'
    const approvalStatus = productData.approvalStatus || (productData.isAgentSubmitted ? 'تەستىق كۈتۈۋاتىدۇ' : 'تەستىقلاندى');

    let savedProduct = null;
    const nowIso = new Date().toISOString();

    if (productData.id) {
      const index = products.findIndex(p => p.id === productData.id);
      const targetUnit = productData.unit || (index !== -1 ? products[index].unit : 'دانە');
      const previousProduct = index !== -1 ? products[index] : null;
      const updatedProduct = { 
        ...(previousProduct || {}), 
        ...productData,
        unit: targetUnit,
        isUserEdited: true,
        updatedAt: nowIso,
        approvalStatus: productData.approvalStatus || (index !== -1 ? products[index].approvalStatus : 'تەستىقلاندى')
      };
      updatedProduct.translations = this.prepareProductTranslations(updatedProduct, previousProduct);
      if (index !== -1) {
        products[index] = updatedProduct;
      } else {
        products.unshift(updatedProduct);
      }
      savedProduct = updatedProduct;
    } else {
      const newId = 'PRD-' + (Math.floor(100 + Math.random() * 900));
      const newProduct = {
        id: newId,
        brand: productData.brand || 'تەكلىماكان سۈپەت',
        languageScope: productData.languageScope || 'all',
        approvalStatus: approvalStatus,
        unit: productData.unit || 'دانە',
        sales: 0,
        rating: 5.0,
        ratingCount: 1,
        featured: false,
        translations: productData.translations || {},
        createdAt: nowIso,
        updatedAt: nowIso,
        isUserEdited: true,
        ...productData
      };
      newProduct.translations = this.prepareProductTranslations(newProduct);
      products.unshift(newProduct);
      savedProduct = newProduct;
    }

    // 1) يەرلىك ئاساسىي ساندانغا يېزىش
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    // 2) مەڭگۈلۈك ئابونت تەھرىر ئامبىرىغا يېزىش (ھېچقانداق بۇلۇت ئۇچۇرى بۇنى قاپلىۋېتەلمەيدۇ)
    this.saveUserEdit(savedProduct);

    this.notifyDataChange('products', { productId: savedProduct.id });

    // 3) ☁️ Supabase بۇلۇتقا ماس قەدەمدە قايتا ئەۋەتىش
    if (window.TeklimakanSupabase && savedProduct) {
      this.trackCloudWrite(window.TeklimakanSupabase.upsertProduct(savedProduct), 'product save');
    }

    return { 
      success: true, 
      product: savedProduct,
      message: approvalStatus === 'تەستىق كۈتۈۋاتىدۇ' 
        ? 'مەھسۇلات يوللاندى! باشقۇرغۇچى تەستىقلىغاندىن كېيىن ئېلان قىلىنىدۇ.' 
        : 'مەھسۇلات مەڭگۈلۈك ساقلاندى ۋە دۇكاندا يېڭىلاندى!' 
    };
  }

  // ئابونت تەھرىرلىرىنى ئوقۇش
  getUserEdits() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_EDITS)) || {};
    } catch (e) {
      return {};
    }
  }

  // ئابونت تەھرىرىنى مەڭگۈلۈك ساندۇققا پۈتۈش
  saveUserEdit(product) {
    if (!product || !product.id) return;
    try {
      const edits = this.getUserEdits();
      edits[product.id] = { ...product, isUserEdited: true, updatedAt: product.updatedAt || new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.USER_EDITS, JSON.stringify(edits));
    } catch(e) {}
  }

  // ئۆچۈرۈلگەن تاۋارلار تىزىملىكى
  getDeletedProductIds() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.DELETED_PRODUCTS)) || [];
    } catch (e) {
      return [];
    }
  }

  // تاۋارنى ئۆچۈرۈلگەنلەر قاتارىغا قوشۇش
  markProductDeleted(id) {
    if (!id) return;
    try {
      const list = this.getDeletedProductIds();
      if (!list.includes(id)) {
        list.push(id);
        localStorage.setItem(STORAGE_KEYS.DELETED_PRODUCTS, JSON.stringify(list));
      }
      const edits = this.getUserEdits();
      if (edits[id]) {
        delete edits[id];
        localStorage.setItem(STORAGE_KEYS.USER_EDITS, JSON.stringify(edits));
      }
    } catch(e) {}
  }

  // ئۆچۈرۈلگەن ۋاكالەتچىلەر تىزىملىكى
  getDeletedAgentIds() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.DELETED_AGENTS)) || [];
    } catch (e) {
      return [];
    }
  }

  // ۋاكالەتچىنى ئۆچۈرۈلگەنلەر قاتارىغا قوشۇش
  markAgentDeleted(id) {
    if (!id) return;
    try {
      const list = this.getDeletedAgentIds();
      if (!list.includes(id)) {
        list.push(id);
        localStorage.setItem(STORAGE_KEYS.DELETED_AGENTS, JSON.stringify(list));
      }
    } catch(e) {}
  }

  // تاۋارنى بۇلۇت ۋە يەرلىككە بىرلا ۋاقىتتا پۇختا كاپالەتلىك ساقلاش (Async)
  async saveProductAsync(productData) {
    const res = this.saveProduct(productData);
    let cloudSynced = false;
    if (res.success && res.product && window.TeklimakanSupabase && typeof window.TeklimakanSupabase.upsertProduct === 'function') {
      try {
        cloudSynced = await window.TeklimakanSupabase.upsertProduct(res.product);
        if (!cloudSynced) {
          console.error('Product was saved on this device but not synchronized to Supabase.');
        }
      } catch (e) {
        console.warn('Supabase async upsert خاتالىقى:', e);
      }
    }
    return { ...res, cloudSynced };
  }

  // ==================== تاۋارلارنى تەستىقلاش مەشغۇلاتلىرى ====================
  getPendingProducts() {
    return this.getProducts().filter(p => p.approvalStatus === 'تەستىق كۈتۈۋاتىدۇ');
  }

  approveProduct(id) {
    const products = this.getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
      if (product.needsAdminImage || typeof product.image !== 'string' || !product.image || product.image.includes('default_product.jpg')) {
        return { success: false, message: 'بۇ تاۋاردا ھەقىقىي رەسىم يوق. ئالدى بىلەن «تەھرىرلەش» ئارقىلىق رەسىم يۈكلەڭ، ئاندىن تەستىقلاڭ.' };
      }
      product.approvalStatus = 'تەستىقلاندى';
      product.approvedAt = new Date().toISOString();
      product.updatedAt = product.approvedAt;
      product.isUserEdited = true;
      if (product.needsAdminImage) {
        product.needsAdminImage = false;
      }
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.saveUserEdit(product);
      this.notifyDataChange('products');
      if (window.TeklimakanSupabase) {
        this.trackCloudWrite(window.TeklimakanSupabase.upsertProduct(product), 'product approval');
      }
      return { success: true, message: `«${product.name}» مەھسۇلاتى مۇۋەپپەقىيەتلىك تەستىقلاندى ۋە دۇكانغا چىقىرىلدى!` };
    }
    return { success: false, message: 'تاۋار تېپىلمىدى!' };
  }

  rejectProduct(id, reason = '') {
    const products = this.getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
      product.approvalStatus = 'رەت قىلىندى';
      product.rejectReason = reason;
      product.updatedAt = new Date().toISOString();
      product.isUserEdited = true;
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.saveUserEdit(product);
      this.notifyDataChange('products');
      if (window.TeklimakanSupabase) {
        this.trackCloudWrite(window.TeklimakanSupabase.upsertProduct(product), 'product rejection');
      }
      return { success: true, message: `«${product.name}» مەھسۇلاتى ئېلان قىلىنىشتىن رەت قىلىندى.` };
    }
    return { success: false, message: 'تاۋار تېپىلمىدى!' };
  }

  // ئادەم رەسىمى بولغان كونا نۇسخىلاردىن تازىلاش ياكى دەسلەپكى 16 تاۋارنى ئەسلىگە كەلتۈرۈش
  resetProductsToDefault() {
    const initialWithApproval = INITIAL_PRODUCTS.map(p => ({
      ...p,
      approvalStatus: 'تەستىقلاندى'
    }));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialWithApproval));
    this.notifyDataChange('products');
    return true;
  }

  async deleteProduct(id) {
    if (!id) return false;
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.markProductDeleted(id);
    this.notifyDataChange('products');
    if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.deleteProduct === 'function') {
      const p = window.TeklimakanSupabase.deleteProduct(id);
      this.trackCloudWrite(p, 'product deletion');
      try {
        await p;
      } catch (e) {
        console.warn('Cloud product deletion error:', e);
      }
    }
    return true;
  }

  updateStock(id, newStock) {
    const products = this.getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
      product.stock = Math.max(0, parseInt(newStock, 10));
      product.isUserEdited = true;
      product.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.saveUserEdit(product);
      this.notifyDataChange('products');
      if (window.TeklimakanSupabase) {
        this.trackCloudWrite(window.TeklimakanSupabase.upsertProduct(product), 'stock update');
      }
      return true;
    }
    return false;
  }

  toggleProductFeatured(id) {
    const products = this.getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
      product.featured = !product.featured;
      product.isUserEdited = true;
      product.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.saveUserEdit(product);
      this.notifyDataChange('products');
      if (window.TeklimakanSupabase) {
        this.trackCloudWrite(window.TeklimakanSupabase.upsertProduct(product), 'featured status update');
      }
      return product.featured;
    }
    return false;
  }

  duplicateProduct(id) {
    const products = this.getProducts();
    const original = products.find(p => p.id === id);
    if (!original) return null;

    const newId = 'PRD-' + Math.floor(100 + Math.random() * 900);
    const clone = JSON.parse(JSON.stringify(original));
    clone.id = newId;
    clone.name = clone.name + ' (نۇسخا)';
    if (clone.translations) {
      if (clone.translations.ug) clone.translations.ug.name += ' (نۇسخا)';
      if (clone.translations.tr) clone.translations.tr.name += ' (Kopya)';
      if (clone.translations.en) clone.translations.en.name += ' (Copy)';
    }
    clone.createdAt = new Date().toISOString();
    clone.updatedAt = clone.createdAt;
    clone.sales = 0;
    clone.approvalStatus = 'تەستىقلاندى';
    clone.isUserEdited = true;

    products.unshift(clone);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.saveUserEdit(clone);
    this.notifyDataChange('products');
    if (window.TeklimakanSupabase) {
      this.trackCloudWrite(window.TeklimakanSupabase.upsertProduct(clone), 'product duplication');
    }
    return clone;
  }

  // ==================== تۈرلەر ====================
  getCategories(lang = 'ug') {
    let categories = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (raw) categories = JSON.parse(raw);
    } catch(e) {}

    if (!Array.isArray(categories) || categories.length <= 1) {
      categories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
    }

    const existingIds = new Set(categories.map(c => c.id || c.name));

    // 1. بارلىق ئۆلچەملىك تۈرلەردىن تېلېفوندا كەم قالغانلىرىنى ئاپتوماتىك قوشۇش
    INITIAL_CATEGORIES.forEach(ic => {
      if (ic.id && !existingIds.has(ic.id)) {
        existingIds.add(ic.id);
        categories.push(JSON.parse(JSON.stringify(ic)));
      }
    });

    // 2. بارلىق مەھسۇلاتلاردىكى تۈرلەرنى ئۆزلۈكىدىن قوشۇپ مۇكەممەللەشتۈرۈش
    const products = this.getProducts();
    products.forEach(p => {
      const cat = p.category ? p.category.trim() : '';
      if (cat && cat !== 'all' && !existingIds.has(cat)) {
        existingIds.add(cat);
        const trName = (window.appI18n && typeof window.appI18n.getCategoryName === 'function') ? window.appI18n.getCategoryName(cat, 'tr') : cat;
        const enName = (window.appI18n && typeof window.appI18n.getCategoryName === 'function') ? window.appI18n.getCategoryName(cat, 'en') : cat;
        categories.push({
          id: cat,
          name: cat,
          icon: 'fas fa-tag',
          status: 'active',
          order: categories.length,
          translations: { ug: cat, tr: trName, en: enName }
        });
      }
    });

    // 3. تەرتىپ سانلىرىنى كاپالەتلەندۈرۈش ۋە رەتلەش
    let nextOrder = 1;
    categories.forEach(c => {
      if (c.id === 'all') {
        c.order = 0;
      } else if (typeof c.order !== 'number' || isNaN(c.order) || c.order <= 0) {
        c.order = nextOrder;
      }
      if (c.id !== 'all') nextOrder++;
    });

    // 'all' ھەمىشە ئالدىدا بولىدۇ، قالغانلىرى تەرتىپ نومۇرى بويىچە رەتلىنىدۇ
    categories.sort((a, b) => {
      if (a.id === 'all') return -1;
      if (b.id === 'all') return 1;
      return (a.order || 0) - (b.order || 0);
    });

    // تەرتىپ نومۇرلىرىنى 1، 2، 3 تەرتىپلىك بويىچە پۇختا نورماللاشتۇرۇش
    let normOrder = 1;
    categories.forEach(c => {
      if (c.id === 'all') {
        c.order = 0;
      } else {
        c.order = normOrder++;
      }
    });

    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch(e) {}

    return categories.map(c => {
      let displayName = (c.translations && c.translations[lang])
        ? c.translations[lang]
        : (window.appI18n && typeof window.appI18n.getCategoryName === 'function' ? window.appI18n.getCategoryName(c.name, lang) : c.name);
      return { status: 'active', ...c, displayName };
    });
  }

  addCategory(categoryName, icon = 'fas fa-tag', translations = {}, order = null) {
    let categories = this.getCategories('ug');
    if (categories.some(c => c.name === categoryName || c.id === categoryName)) return false;

    const nonAll = categories.filter(c => c.id !== 'all');
    let targetOrder = nonAll.length + 1;
    if (order !== null && order !== undefined && !isNaN(parseInt(order, 10)) && parseInt(order, 10) > 0) {
      targetOrder = parseInt(order, 10);
    }
    if (targetOrder > nonAll.length + 1) targetOrder = nonAll.length + 1;

    const newCat = {
      id: categoryName,
      name: categoryName,
      icon: icon,
      status: 'active',
      translations: { ug: categoryName, tr: translations.tr || categoryName, en: translations.en || categoryName }
    };

    // كۆرسىتىلگەن ئورۇنغا قىستۇرۇش
    const insertIdx = Math.max(0, Math.min(targetOrder - 1, nonAll.length));
    nonAll.splice(insertIdx, 0, newCat);

    // تەرتىپ سانلىرىنى يېڭىلاش
    let ord = 1;
    nonAll.forEach(c => {
      c.order = ord++;
    });

    const allCat = categories.find(c => c.id === 'all') || { id: 'all', name: 'بارلىق مەھسۇلاتلار', order: 0, icon: 'fas fa-th-large' };
    const finalCategories = [allCat, ...nonAll];

    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(finalCategories));
    this.notifyDataChange('categories');
    return true;
  }

  updateCategory(categoryId, updatedData) {
    let categories = this.getCategories('ug');
    const nonAll = categories.filter(c => c.id !== 'all');
    const index = nonAll.findIndex(c => c.id === categoryId || c.name === categoryId);
    if (index === -1) return false;

    const oldName = nonAll[index].name;
    const newName = updatedData.name || oldName;

    // ئاساسىي سانلىق مەلۇماتلارنى يېڭىلاش
    nonAll[index] = {
      ...nonAll[index],
      ...updatedData,
      id: newName,
      name: newName,
      icon: updatedData.icon || nonAll[index].icon || 'fas fa-tag',
      status: updatedData.status || nonAll[index].status || 'active',
      translations: {
        ...(nonAll[index].translations || {}),
        ug: newName,
        tr: (updatedData.translations && updatedData.translations.tr) || (nonAll[index].translations && nonAll[index].translations.tr) || newName,
        en: (updatedData.translations && updatedData.translations.en) || (nonAll[index].translations && nonAll[index].translations.en) || newName
      }
    };

    // ئەگەر تەرتىپ نومۇرى ئۆزگەرگەن بولسا، يېڭى ئورۇنغا يۆتكەش
    if (updatedData.order !== undefined && updatedData.order !== null && !isNaN(parseInt(updatedData.order, 10))) {
      let desiredOrder = parseInt(updatedData.order, 10);
      if (desiredOrder < 1) desiredOrder = 1;
      if (desiredOrder > nonAll.length) desiredOrder = nonAll.length;

      const targetItem = nonAll.splice(index, 1)[0];
      nonAll.splice(desiredOrder - 1, 0, targetItem);
    }

    // تەرتىپ نومۇرلىرىنى قايتا رەتلەپ بېكىتىش
    let ord = 1;
    nonAll.forEach(c => {
      c.order = ord++;
    });

    const allCat = categories.find(c => c.id === 'all') || { id: 'all', name: 'بارلىق مەھسۇلاتلار', order: 0, icon: 'fas fa-th-large' };
    const finalCategories = [allCat, ...nonAll];

    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(finalCategories));

    if (oldName !== newName) {
      let products = this.getProducts();
      let changed = false;
      products.forEach(p => {
        if (p.category === oldName) {
          p.category = newName;
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        this.notifyDataChange('products');
      }
    }

    this.notifyDataChange('categories');
    return true;
  }

  deleteCategory(categoryId) {
    let categories = this.getCategories('ug');
    const nonAll = categories.filter(c => c.id !== 'all');
    const index = nonAll.findIndex(c => c.id === categoryId || c.name === categoryId);
    if (index === -1) return { success: false, message: 'تۈر تېپىلمىدى' };

    const catName = nonAll[index].name;
    const products = this.getProducts();
    const count = products.filter(p => p.category === catName || p.category === categoryId).length;
    if (count > 0) {
      return { success: false, message: `بۇ تۈردە ${count} دانە تاۋار بار! ئالدى بىلەن تاۋارلارنى باشقا تۈرگە يۆتكەڭ ياكى ئۆچۈرۈڭ.` };
    }

    nonAll.splice(index, 1);
    let ord = 1;
    nonAll.forEach(c => {
      c.order = ord++;
    });

    const allCat = categories.find(c => c.id === 'all') || { id: 'all', name: 'بارلىق مەھسۇلاتلار', order: 0, icon: 'fas fa-th-large' };
    const finalCategories = [allCat, ...nonAll];

    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(finalCategories));
    this.notifyDataChange('categories');
    return { success: true };
  }

  reorderCategory(categoryId, direction) {
    let categories = this.getCategories('ug');
    const nonAll = categories.filter(c => c.id !== 'all');
    const index = nonAll.findIndex(c => c.id === categoryId || c.name === categoryId);
    if (index === -1) return false;

    if (direction === 'up' && index > 0) {
      const temp = nonAll[index];
      nonAll[index] = nonAll[index - 1];
      nonAll[index - 1] = temp;
    } else if (direction === 'down' && index < nonAll.length - 1) {
      const temp = nonAll[index];
      nonAll[index] = nonAll[index + 1];
      nonAll[index + 1] = temp;
    } else {
      return false;
    }

    let ord = 1;
    nonAll.forEach(c => {
      c.order = ord++;
    });

    const allCat = categories.find(c => c.id === 'all') || { id: 'all', name: 'بارلىق مەھسۇلاتلار', order: 0, icon: 'fas fa-th-large' };
    const finalCategories = [allCat, ...nonAll];

    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(finalCategories));
    this.notifyDataChange('categories');
    return true;
  }

  updateCategoryOrder(categoryId, newOrder) {
    let categories = this.getCategories('ug');
    const nonAll = categories.filter(c => c.id !== 'all');
    const index = nonAll.findIndex(c => c.id === categoryId || c.name === categoryId);
    if (index === -1) return false;

    let targetOrder = parseInt(newOrder, 10);
    if (isNaN(targetOrder) || targetOrder < 1) targetOrder = 1;
    if (targetOrder > nonAll.length) targetOrder = nonAll.length;

    const item = nonAll.splice(index, 1)[0];
    nonAll.splice(targetOrder - 1, 0, item);

    let ord = 1;
    nonAll.forEach(c => {
      c.order = ord++;
    });

    const allCat = categories.find(c => c.id === 'all') || { id: 'all', name: 'بارلىق مەھسۇلاتلار', order: 0, icon: 'fas fa-th-large' };
    const finalCategories = [allCat, ...nonAll];

    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(finalCategories));
    this.notifyDataChange('categories');
    return true;
  }


  toggleCategoryStatus(categoryId) {
    let categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
    const cat = categories.find(c => c.id === categoryId || c.name === categoryId);
    if (!cat) return false;

    cat.status = (cat.status === 'hidden') ? 'active' : 'hidden';
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    this.notifyDataChange('categories');
    return cat.status;
  }

  validateCoupon(code, subtotal) {
    if (!code) return { valid: false, message: 'كۇپون كودىنى كىرگۈزۈڭ' };
    const coupons = this.getCoupons();
    const c = coupons.find(item => item.code.toUpperCase() === code.trim().toUpperCase());
    if (!c) {
      return { valid: false, message: 'بۇ كۇپون كودى مەۋجۇت ئەمەس!' };
    }
    if (!c.isActive) {
      return { valid: false, message: 'بۇ كۇپوننىڭ كۈچى توختىتىلغان!' };
    }
    if (c.expireDate && new Date(c.expireDate) < new Date()) {
      return { valid: false, message: 'بۇ كۇپوننىڭ مۇددىتى توشقان!' };
    }

    if (subtotal === undefined || subtotal === null || isNaN(Number(subtotal))) {
      const detailed = this.getCartDetailed();
      subtotal = detailed.subtotalCny || 0;
    }
    subtotal = Math.max(0, Number(subtotal) || 0);

    if (c.minSpend && subtotal < c.minSpend) {
      return { valid: false, message: `بۇ كۇپون ئەڭ تۆۋەن ₺${c.minSpend} لىك زاكازغا ئىشلىتىلىدۇ!` };
    }
    if (c.usageLimit && c.usedCount >= c.usageLimit) {
      return { valid: false, message: 'بۇ كۇپوننىڭ ئىشلىتىلىش چەكلىمىسى توشتى!' };
    }

    let discount = 0;
    if (c.type === 'percentage') {
      discount = (subtotal * (Number(c.value) || 0)) / 100;
    } else if (c.type === 'free_shipping') {
      discount = Number(c.value) || 35;
    } else {
      discount = Number(c.value) || 0;
    }
    if (isNaN(discount) || discount < 0) discount = 0;
    if (subtotal > 0) {
      discount = Math.min(discount, subtotal);
    }
    discount = Math.round(discount);

    return {
      valid: true,
      coupon: c,
      discountAmount: discount,
      discountFormatted: this.formatPrice(discount),
      message: `كۇپون تەستىقلاندى! ${this.formatPrice(discount)} ئېتىبار قىلىندى.`
    };
  }

  // ==================== كارگو ئىز قوغلاش ۋە يېڭىلاش (Cargo Tracking) ====================
  getCargoTrackingUrl(carrier, trackingNo) {
    if (!carrier || !trackingNo) return '';
    const c = carrier.toLowerCase();
    const code = encodeURIComponent(trackingNo.trim());
    if (c.includes('yurtiçi') || c.includes('yurtici')) {
      return `https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=${code}`;
    } else if (c.includes('aras')) {
      return `https://kargotakip.araskargo.com.tr/mainpage.aspx?code=${code}`;
    } else if (c.includes('ptt')) {
      return `https://gonderitakip.ptt.gov.tr/Track/Verify?q=${code}`;
    } else if (c.includes('mng')) {
      return `https://service.mngkargo.com.tr/iactive/popup/kargotakip.asp?k=${code}`;
    } else if (c.includes('dhl')) {
      return `https://www.dhl.com/tr-tr/home/tracking.html?tracking-id=${code}`;
    } else if (c.includes('sürat') || c.includes('surat')) {
      return `https://suratkargo.com.tr/KargoTakip/?kargotakipno=${code}`;
    } else if (c.includes('trendyol')) {
      return `https://kargotakip.trendyol.com/?trackingNumber=${code}`;
    }
    return '';
  }

  updateOrderTracking(orderId, carrier, trackingNo) {
    const orders = this.getOrders();
    const ord = orders.find(o => o.id === orderId);
    if (!ord) return { success: false, message: 'زاكاز تېپىلمىدى!' };

    ord.cargoCarrier = carrier;
    ord.cargoTrackingNo = trackingNo;
    ord.status = 'يوللاندى';
    ord.shippedAt = new Date().toISOString();
    ord.cargoTrackingUrl = this.getCargoTrackingUrl(carrier, trackingNo);

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.notifyDataChange('orders');
    const savedOrder = orders.find(order => order.id === orderId);
    if (savedOrder && window.TeklimakanSupabase && typeof window.TeklimakanSupabase.updateOrderStatus === 'function') {
      this.trackCloudWrite(window.TeklimakanSupabase.updateOrderStatus(orderId, savedOrder.status, {
        carrier,
        number: trackingNo,
        shippedAt: savedOrder.shippedAt
      }), 'order tracking update');
    }
    return { success: true, order: ord, message: 'كارگو ئۇچۇرى ساقلاندى!' };
  }

  findOrdersByTrackCodeOrPhone(query) {
    if (!query) return [];
    const q = query.trim().toLowerCase().replace(/[\s\-\+]/g, '');
    const orders = this.getOrders();
    return orders.filter(o => {
      const orderIdClean = (o.id || '').toLowerCase().replace(/[\s\-]/g, '');
      const phoneClean = (o.customer && o.customer.phone ? o.customer.phone : '').replace(/[\s\-\+]/g, '');
      const trackingClean = (o.cargoTrackingNo || '').toLowerCase().replace(/[\s\-]/g, '');
      return orderIdClean === q || 
             phoneClean === q || 
             phoneClean.endsWith(q) || 
             (q.length >= 7 && phoneClean.includes(q)) || 
             (trackingClean && trackingClean === q) || 
             orderIdClean.includes(q);
    });
  }

  findOrderByTrackCodeOrPhone(query) {
    const list = this.findOrdersByTrackCodeOrPhone(query);
    return list.length > 0 ? list[0] : null;
  }

  async fetchOrdersFromCloudAndMatch(query) {
    if (window.TeklimakanSupabase) {
      try {
        const remoteOrders = await window.TeklimakanSupabase.fetchOrders();
        if (Array.isArray(remoteOrders) && remoteOrders.length > 0) {
          const localOrders = this.getOrders();
          const oMap = new Map();
          localOrders.forEach(o => oMap.set(o.id, o));
          remoteOrders.forEach(ro => {
            oMap.set(ro.id, {
              id: ro.id,
              customer: ro.customer,
              items: ro.items,
              subtotalCny: Number(ro.subtotal_cny || 0),
              discountCny: Number(ro.discount_cny || 0),
              deliveryFeeCny: Number(ro.delivery_fee_cny || 0),
              totalCny: Number(ro.total_cny || 0),
              totalFormatted: ro.total_formatted,
              paymentMethod: ro.payment_method,
              status: ro.status,
              date: ro.date,
              notes: ro.notes,
              language: ro.language,
              currency: ro.currency,
              cargoCarrier: ro.tracking_carrier || ro.cargoCarrier,
              cargoTrackingNo: ro.tracking_number || ro.cargoTrackingNo,
              shippedAt: ro.shipped_at
            });
          });
          const merged = Array.from(oMap.values());
          localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(merged));
        }
      } catch (e) {
        console.warn('Supabase fetchOrders error:', e);
      }
    }
    return this.findOrdersByTrackCodeOrPhone(query);
  }

  // ==================== خېرىدارلار مەركىزى (CRM Summary) ====================
  getCustomersSummary() {
    const orders = this.getOrders();
    const customerMap = {};

    for (let ord of orders) {
      if (!ord.customer || !ord.customer.phone) continue;
      const phone = ord.customer.phone.trim();
      const phoneKey = phone.replace(/[\s\-\+]/g, '');

      if (!customerMap[phoneKey]) {
        customerMap[phoneKey] = {
          name: ord.customer.name || 'نامسىز خېرىدار',
          phone: phone,
          city: ord.customer.city || ord.customer.address || 'نامەلۇم',
          address: ord.customer.address || '',
          orderCount: 0,
          totalSpent: 0,
          lastOrderDate: ord.date || '',
          orders: []
        };
      }

      const c = customerMap[phoneKey];
      c.orderCount += 1;
      const amount = ord.totalCny !== undefined ? ord.totalCny : (parseFloat(ord.total) || 0);
      c.totalSpent += amount;
      c.orders.push(ord);

      if (ord.date && (!c.lastOrderDate || ord.date > c.lastOrderDate)) {
        c.lastOrderDate = ord.date;
        if (ord.customer.name) c.name = ord.customer.name;
        if (ord.customer.city) c.city = ord.customer.city;
        if (ord.customer.address) c.address = ord.customer.address;
      }
    }

    const list = Object.values(customerMap);
    let totalRevenue = 0;
    let totalOrders = 0;

    for (let c of list) {
      totalRevenue += c.totalSpent;
      totalOrders += c.orderCount;

      if (c.totalSpent >= 2000 || c.orderCount >= 4) {
        c.tier = 'vip';
      } else if (c.orderCount >= 2 || c.totalSpent >= 600) {
        c.tier = 'regular';
      } else {
        c.tier = 'new';
      }
    }

    list.sort((a, b) => b.totalSpent - a.totalSpent);

    return {
      customers: list,
      totalCustomers: list.length,
      totalRevenue,
      totalOrders,
      avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
    };
  }

  // ==================== كۇپون ۋە ئېتىبار باشقۇرۇش (Coupons Manager) ====================
  getCoupons() {
    const data = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
      return INITIAL_COUPONS;
    }
    try {
      const list = JSON.parse(data) || [];
      let updated = false;
      list.forEach(c => {
        if (c.description && (c.description.includes('Ø') || c.description.includes('Ù') || c.description.includes('â‚º') || c.description.includes('?'))) {
          const initC = INITIAL_COUPONS.find(ic => ic.code === c.code);
          if (initC) {
            c.description = initC.description;
            updated = true;
          }
        }
      });
      if (updated) {
        localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(list));
      }
      return list;
    } catch (e) {
      return INITIAL_COUPONS;
    }
  }

  // ==================== 1-چەكمە پۈتۈن دۇكاننى زاپاسلاش ۋە ئەسلىگە كەلتۈرۈሽ ====================
  exportFullBackup() {
    const backup = {
      version: 'TEKLIMAKAN-ECOMMERCE-2026-V1',
      exportedAt: new Date().toISOString(),
      storeTitle: 'تەكلىماكان تور سودا سۇپىسى',
      products: this.getProducts(),
      categories: this.getCategories(),
      orders: this.getOrders(),
      agents: this.getAgents(),
      coupons: this.getCoupons(),
      settings: this.getSettings(),
      wishlist: this.getWishlist()
    };
    return JSON.stringify(backup, null, 2);
  }

  importFullBackup(jsonString) {
    try {
      const backup = JSON.parse(jsonString);
      if (!backup || (!backup.products && !backup.orders)) {
        return { success: false, message: 'ھۆججەت فورماتى خاتا ياكى ئىناۋەتسىز!' };
      }

      if (Array.isArray(backup.products)) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(backup.products));
      }
      if (Array.isArray(backup.categories)) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(backup.categories));
      }
      if (Array.isArray(backup.orders)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(backup.orders));
      }
      if (Array.isArray(backup.agents)) {
        localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(backup.agents));
      }
      if (Array.isArray(backup.coupons)) {
        localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(backup.coupons));
      }
      if (backup.settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(backup.settings));
      }

      this.notifyDataChange('all');
      return {
        success: true,
        message: 'بارلىق سانلىق مەلۇماتلار مۇۋەپپەقىيەتلىك ئەسلىگە كەلتۈرۈلدى!',
        stats: {
          products: (backup.products || []).length,
          orders: (backup.orders || []).length,
          categories: (backup.categories || []).length
        }
      };
    } catch (err) {
      return { success: false, message: 'JSON ھۆججىتىنى ئوقۇشتا خاتالىق كۆرۈلدى: ' + err.message };
    }
  }

  // ==================== سېۋەت ====================
  getCart() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
  }

  addToCart(productId, qty = 1) {
    const product = this.getProductById(productId);
    if (!product) return { success: false, message: 'مەھسۇلات تېپىلمىدى' };
    if (product.stock <= 0) return { success: false, message: 'ئامبار زاپىسى قالمىدى!' };

    let cart = this.getCart();
    const existing = cart.find(item => item.productId === productId);

    if (existing) {
      const newQty = existing.quantity + qty;
      if (newQty > product.stock) {
        existing.quantity = product.stock;
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        this.notifyDataChange('cart');
        return { success: false, message: `ئامباردا پەقەت ${product.stock} دانە بار.` };
      } else {
        existing.quantity = newQty;
      }
    } else {
      const addQty = Math.min(qty, product.stock);
      cart.push({ productId, quantity: addQty });
    }

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    this.notifyDataChange('cart');
    return { success: true, message: 'مەھسۇلات سېۋەتكە قوشۇلدى!' };
  }

  updateCartQuantity(productId, qty) {
    let cart = this.getCart();
    const product = this.getProductById(productId);
    const item = cart.find(i => i.productId === productId);
    
    if (item && product) {
      qty = parseInt(qty, 10);
      if (qty <= 0) return this.removeFromCart(productId);
      if (qty > product.stock) {
        item.quantity = product.stock;
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        this.notifyDataChange('cart');
        return { success: false, message: `ئامباردا پەقەت ${product.stock} دانە بار.` };
      }
      item.quantity = qty;
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
      this.notifyDataChange('cart');
      return { success: true };
    }
    return { success: false };
  }

  removeFromCart(productId) {
    let cart = this.getCart();
    cart = cart.filter(i => i.productId !== productId);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    this.notifyDataChange('cart');
    return { success: true };
  }

  clearCart() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    this.notifyDataChange('cart');
  }

  getCartDetailed(lang = 'ug') {
    const cart = this.getCart();
    const products = this.getProducts();
    let items = [];
    let subtotalCny = 0;

    cart.forEach(cartItem => {
      const rawProd = products.find(prod => prod.id === cartItem.productId);
      if (rawProd) {
        const p = this.getLocalizedProduct(rawProd, lang);
        const itemTotalCny = p.price * cartItem.quantity;
        subtotalCny += itemTotalCny;
        items.push({
          product: p,
          quantity: cartItem.quantity,
          itemTotalCny,
          itemTotalFormatted: this.formatPrice(itemTotalCny)
        });
      }
    });

    const threshold = this.getFreeShippingThreshold();
    const convertedSubtotal = this.convertPrice(subtotalCny);
    // 🚚 1000 لىرادىن ئاز مەھسۇلات ئالغانلارنىڭ يەتكۈزۈش ھەققى ئومۇمىي مال سوممىسىنىڭ 25% پىرسەنتىنى ئاساس قىلىپ، 5 ياكى 10 لىرا بويىچە پۈتۈنلىنىپ (پارچە پۇلسىز) ھېسابلىنىدۇ
    let deliveryFeeCny = 0;
    if (subtotalCny > 0 && convertedSubtotal < threshold) {
      const rawFee = subtotalCny * 0.25;
      deliveryFeeCny = Math.max(5, Math.round(rawFee / 5) * 5);
    }
    const totalCny = subtotalCny + deliveryFeeCny;

    return {
      items,
      subtotalCny,
      subtotalFormatted: this.formatPrice(subtotalCny),
      deliveryFeeCny,
      deliveryFeeFormatted: deliveryFeeCny === 0 ? '0' : this.formatPrice(deliveryFeeCny),
      totalCny,
      totalFormatted: this.formatPrice(totalCny),
      count: items.reduce((acc, curr) => acc + curr.quantity, 0),
      convertedSubtotal,
      threshold
    };
  }

  // ==================== ياقتۇرغانلار ====================
  getWishlist() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];
  }

  toggleWishlist(productId) {
    let list = this.getWishlist();
    const pidStr = String(productId);
    const index = list.findIndex(id => String(id) === pidStr);
    let added = false;
    if (index === -1) {
      list.push(productId);
      added = true;
    } else {
      list.splice(index, 1);
    }
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
    this.notifyDataChange('wishlist');
    return added;
  }

  removeFromWishlist(productId) {
    let list = this.getWishlist();
    const pidStr = String(productId);
    const index = list.findIndex(id => String(id) === pidStr);
    if (index !== -1) {
      list.splice(index, 1);
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
      this.notifyDataChange('wishlist');
      return true;
    }
    return false;
  }

  isInWishlist(productId) {
    const pidStr = String(productId);
    return this.getWishlist().some(id => String(id) === pidStr);
  }

  // ==================== زاكازلار ====================
  getOrders() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
  }

  createOrder(customerData, paymentMethod, notes = '', couponDiscountCny = 0, lang = 'ug', instagramGift = null) {
    const cartData = this.getCartDetailed(lang);
    if (cartData.items.length === 0) {
      return { success: false, message: 'سېۋەت بوش!' };
    }

    const products = this.getProducts();
    for (let item of cartData.items) {
      const prod = products.find(p => p.id === item.product.id);
      if (!prod || prod.stock < item.quantity) {
        return { success: false, message: `«${item.product.name}» قالدۇقى يېتىشمىدى!` };
      }
    }

    const orderId = 'ORD-' + (new Date().getFullYear()) + '-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const orderItems = cartData.items.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image
    }));

    // 🎁 ئىنىستىگېرام ئەگەشكۈچى سوۋغىتى قوشۇلغان بولسا، زاكاز مەھسۇلاتلىرى ۋە ئەسكەرتىشكە ئاپتوماتىك قوشۇش
    let hasInstaGift = false;
    let instaUsername = '';
    if (instagramGift && (instagramGift.requested || instagramGift.username)) {
      hasInstaGift = true;
      instaUsername = (instagramGift.username || '').trim() || (lang === 'ug' ? '@ئەگەشكۈچى' : (lang === 'tr' ? '@takipci' : '@follower'));
      const giftLabel = (window.appI18n && typeof window.appI18n.t === 'function') 
        ? window.appI18n.t('instaGiftItemName') 
        : '🎁 ئىنىستىگېرام ئەگەشكۈچى سوۋغىتى';
      orderItems.push({
        id: 'GIFT-INSTA',
        name: `${giftLabel} (${instaUsername})`,
        price: 0,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
        isGift: true
      });
      const giftNoteText = `🎁 ئىنىستىگېرام سوۋغىتى: ${instaUsername}`;
      notes = notes ? `${notes} | ${giftNoteText}` : giftNoteText;
    }

    const rawDisc = Number(couponDiscountCny);
    const validDiscount = (isNaN(rawDisc) || rawDisc < 0) ? 0 : Math.min(rawDisc, cartData.subtotalCny);
    const finalTotalCny = Math.max(0, cartData.totalCny - validDiscount);

    const newOrder = {
      id: orderId,
      customer: customerData,
      items: orderItems,
      subtotalCny: cartData.subtotalCny,
      discountCny: validDiscount,
      deliveryFeeCny: cartData.deliveryFeeCny,
      totalCny: finalTotalCny,
      totalFormatted: this.formatPrice(finalTotalCny),
      paymentMethod: paymentMethod,
      status: 'ساقلاۋاتىدۇ',
      date: formattedDate,
      notes: notes,
      language: lang,
      currency: this.currentCurrency,
      hasInstagramGift: hasInstaGift,
      instagramUser: instaUsername
    };

    const lowStockAlerts = [];
    cartData.items.forEach(item => {
      const prod = products.find(p => p.id === item.product.id);
      if (prod) {
        prod.stock -= item.quantity;
        prod.sales = (prod.sales || 0) + item.quantity;
        prod.isUserEdited = true;
        prod.updatedAt = new Date().toISOString();
        this.saveUserEdit(prod);
        if (window.TeklimakanSupabase) {
          this.trackCloudWrite(window.TeklimakanSupabase.upsertProduct(prod), 'order inventory update');
        }
        if (prod.stock <= 3) {
          lowStockAlerts.push(`• <b>${prod.name}</b>: قالدۇق زاپىسى پەقەت <b>${prod.stock}</b> دانە قالدى!`);
        }
      }
    });
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    if (lowStockAlerts.length > 0) {
      this.sendTelegramAlert({
        title: '⚠️ [ئامبار جىددىي ئۇقتۇرۇشى] مەھسۇلات قالدۇقى ئاز قالدى!',
        message: `سېتىۋېلىش سەۋەبلىك تۆۋەندىكى تاۋارلارنىڭ ئامبار قالدۇقى جىددىي چەككە چۈشتى:\n\n${lowStockAlerts.join('\n')}\n\n🛒 دەرھال ئامبار ئەھۋالىنى تەكشۈرۈپ تولۇقلاڭ.`,
        isUrgent: true
      });
    }

    const orders = this.getOrders();
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    this.clearCart();
    this.notifyDataChange('orders');
    this.notifyDataChange('products');

    // ☁️ Supabase بۇلۇت ئامبىرىغا زاكازنى يۈكلەش
    if (window.TeklimakanSupabase && newOrder) {
      this.trackCloudWrite(window.TeklimakanSupabase.insertOrder(newOrder), 'new order');
    }

    // 📱 خېرىدارنىڭ نومۇرى ۋە زاكاز كودىنى ساقلاپ قويۇش (بىر يىلدىن كېيىن كىرسىمۇ ئاسان تېپىش ئۈچۈن)
    if (customerData && customerData.phone) {
      localStorage.setItem('teklimakan_customer_phone', customerData.phone);
    }
    if (customerData && customerData.name) {
      localStorage.setItem('teklimakan_customer_name', customerData.name);
    }
    localStorage.setItem('teklimakan_last_order_id', newOrder.id);

    return { success: true, order: newOrder };
  }

  recordCustomerChatMessage(chatMsg) {
    try {
      const KEY = 'teklimakan_admin_chat_inbox';
      let inbox = JSON.parse(localStorage.getItem(KEY)) || [];
      inbox.unshift(chatMsg);
      if (inbox.length > 200) inbox = inbox.slice(0, 200);
      localStorage.setItem(KEY, JSON.stringify(inbox));
    } catch (e) {}
  }

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const order = orders.find(o => String(o.id) === String(orderId));
    if (order) {
      order.status = newStatus;
      if (newStatus === 'تاماملاندى' || newStatus === 'بىكار قىلىندى') {
        if (!order.completedAt) {
          order.completedAt = new Date().toISOString();
        }
      }
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.notifyDataChange('orders');
      if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.updateOrderStatus === 'function') {
        this.trackCloudWrite(window.TeklimakanSupabase.updateOrderStatus(order.id, newStatus, {
          completedAt: order.completedAt
        }), 'order status update');
      }
      return true;
    }
    return false;
  }

  updateOrderCustomer(orderId, updatedCustomer) {
    const orders = this.getOrders();
    const order = orders.find(o => String(o.id) === String(orderId));
    if (!order) return { success: false, message: 'زاكاز تېپىلمىدى!' };
    order.customer = {
      ...order.customer,
      name: updatedCustomer.name !== undefined ? updatedCustomer.name.trim() : order.customer.name,
      phone: updatedCustomer.phone !== undefined ? updatedCustomer.phone.trim() : order.customer.phone,
      city: updatedCustomer.city !== undefined ? updatedCustomer.city.trim() : (order.customer.city || ''),
      address: updatedCustomer.address !== undefined ? updatedCustomer.address.trim() : order.customer.address
    };
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.notifyDataChange('orders');
    try {
      if (updatedCustomer.name) localStorage.setItem('teklimakan_customer_name', updatedCustomer.name.trim());
      if (updatedCustomer.phone) localStorage.setItem('teklimakan_customer_phone', updatedCustomer.phone.trim());
      if (updatedCustomer.address) localStorage.setItem('teklimakan_checkout_address', updatedCustomer.address.trim());
    } catch (e) {}
    if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.updateOrderCustomer === 'function') {
      this.trackCloudWrite(window.TeklimakanSupabase.updateOrderCustomer(order.id, order.customer), 'order customer update');
    }
    return { success: true, order: order, message: 'ئۇچۇرلىرىڭىز مۇۋەپپەقىيەتلىك يېڭىلاندى!' };
  }

  deleteOrder(orderId) {
    let orders = this.getOrders();
    orders = orders.filter(o => String(o.id) !== String(orderId));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.notifyDataChange('orders');
    if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.deleteOrder === 'function') {
      this.trackCloudWrite(window.TeklimakanSupabase.deleteOrder(orderId), 'order deletion');
    }
    return true;
  }

  // 🛡️ 10 كۈندىن ئاشقان تاماملانغان ياكى بىكار قىلىنغان زاكازلارنىڭ شەخسىي ئۇچۇرىنى يۇيۇش (Privacy Wipe)
  // كىرىم سوممىسى، مال سانى ۋە زاكاز ھېساباتى 100% ساقلىنىدۇ، خېرىدارنىڭ ئىسمى، تېلېفونى، ئادرېسى ئۆچۈرۈلىدۇ
  anonymizeExpiredOrders(daysThreshold = 10) {
    const orders = this.getOrders();
    const now = Date.now();
    const maxAgeMs = daysThreshold * 24 * 60 * 60 * 1000;
    let modified = false;
    let count = 0;

    orders.forEach(order => {
      if (order.status !== 'تاماملاندى' && order.status !== 'بىكار قىلىندى') return;
      const cust = (typeof order.customer === 'string') 
        ? JSON.parse(order.customer || '{}') 
        : (order.customer || {});
      if (cust.isAnonymized || order.isAnonymized) return;

      // پۈتكەن ياكى زاكاز ۋاقتىنى ھېسابلاش
      let orderTime = 0;
      if (order.completedAt) {
        orderTime = new Date(order.completedAt).getTime();
      } else if (order.shippedAt) {
        orderTime = new Date(order.shippedAt).getTime();
      } else if (order.date) {
        orderTime = new Date(order.date.replace(/\//g, '-')).getTime();
      } else if (order.createdAt) {
        orderTime = new Date(order.createdAt).getTime();
      }

      if (!orderTime || isNaN(orderTime)) {
        // ئەگەر ۋاقتى ئېنىق بولمىسا، دەسلەپكى ئۈلگە زاكازلار ياكى كونا كۈن دەپ قوبۇل قىلىش
        orderTime = Date.now() - (11 * 24 * 60 * 60 * 1000);
      }

      if (now - orderTime >= maxAgeMs) {
        order.isAnonymized = true;
        order.anonymizedAt = new Date().toISOString();
        order.customer = {
          name: '[شەخسىي ئۇچۇر ئۆچۈرۈلدى]',
          phone: '',
          address: '',
          city: '',
          isAnonymized: true,
          anonymizedAt: order.anonymizedAt
        };
        order.notes = '';
        order.cargoTrackingNo = '';
        if (order.tracking) {
          order.tracking.trackingNumber = '';
        }
        modified = true;
        count++;

        // ☁️ بۇلۇتقىمۇ ماس قەدەمدە مەخپىيلەشتۈرۈشنى ئەۋەتىش
        if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.anonymizeOrder === 'function') {
          window.TeklimakanSupabase.anonymizeOrder(order.id);
        }
      }
    });

    if (modified) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.notifyDataChange('orders');
    }

    return count;
  }

  createSampleOrder() {
    const products = this.getProducts();
    const sampleItems = products.slice(0, 2).map(p => ({
      product: p,
      name: p.name,
      price: p.price,
      quantity: 1,
      image: p.image || ''
    }));

    if (sampleItems.length === 0) {
      sampleItems.push({
        product: { id: 'p-demo', name: 'قەدىمىي ئۇيغۇر قارا چاي', price: 120 },
        name: 'قەدىمىي ئۇيغۇر قارا چاي',
        price: 120,
        quantity: 1,
        image: 'images/products/tea.jpg'
      });
    }

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const total = sampleItems.reduce((s, i) => s + i.price * i.quantity, 0);

    const sampleOrder = {
      id: orderId,
      customer: {
        name: 'ئابدۇكېرىم ئەخمەت',
        phone: '05551609999',
        city: 'ئىستانبۇل (Zeytinburnu)',
        address: 'Nuripaşa Mah. 65. Sokak No: 12 D: 4'
      },
      items: sampleItems,
      subtotalCny: total,
      discountCny: 0,
      deliveryFeeCny: 0,
      totalCny: total,
      totalFormatted: this.formatPrice(total),
      paymentMethod: 'نەق پۇل / ئىشىك ئالدىدا تاپشۇرۇش',
      status: 'ساقلاۋاتىدۇ',
      date: formattedDate,
      notes: 'ئۆيگە يەتكۈزۈشتىن بۇرۇن تېلېفون قىلىڭ',
      language: 'ug',
      currency: this.currentCurrency
    };

    const orders = this.getOrders();
    orders.unshift(sampleOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.notifyDataChange('orders');
    return sampleOrder;
  }

  updateOrderTracking(orderId, carrier, trackingNumber) {
    const orders = this.getOrders();
    const order = orders.find(o => String(o.id) === String(orderId));
    if (order) {
      order.cargoCarrier = carrier || 'PTT Kargo';
      order.cargoTrackingNo = trackingNumber || '';
      order.tracking = {
        carrier: carrier || 'PTT Kargo',
        trackingNumber: trackingNumber || '',
        updatedAt: new Date().toISOString()
      };
      if (order.status === 'ساقلاۋاتىدۇ' || order.status === 'تەستىقلاندى') {
        order.status = 'يوللاندى';
      }
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.notifyDataChange('orders');

      if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.updateOrderTracking === 'function') {
        window.TeklimakanSupabase.updateOrderTracking(order.id, carrier, trackingNumber);
      }

      return { success: true, order: order };
    }
    return { success: false, message: 'زاكاز تېپىلمىدى' };
  }

  getSettings() {
    let settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || INITIAL_SETTINGS;
    if (!settings.marqueeItems || !Array.isArray(settings.marqueeItems) || settings.marqueeItems.length === 0) {
      settings.marqueeItems = JSON.parse(JSON.stringify(DEFAULT_MARQUEE_ITEMS));
    }
    return settings;
  }

  updateSettings(newSettings) {
    const settings = { ...this.getSettings(), ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    this.notifyDataChange('settings');
    return true;
  }

  getMarqueeItems(lang = 'ug') {
    const settings = this.getSettings();
    const items = (Array.isArray(settings.marqueeItems) && settings.marqueeItems.length > 0)
      ? settings.marqueeItems
      : DEFAULT_MARQUEE_ITEMS;

    return items
      .filter(item => item && item.enabled !== false)
      .map((item, idx) => {
        let badge = item.badge || '';
        let text = item.text || '';
        if (lang !== 'ug' && item.translations && item.translations[lang]) {
          if (item.translations[lang].badge) badge = item.translations[lang].badge;
          if (item.translations[lang].text) text = item.translations[lang].text;
        }
        return {
          id: item.id || `m_${idx}`,
          badge: badge,
          text: text,
          badgeStyle: item.badgeStyle || 'badge-sale',
          linkType: item.linkType || ''
        };
      });
  }

  updateMarqueeItems(items) {
    if (!Array.isArray(items)) return false;
    const settings = this.getSettings();
    settings.marqueeItems = items;
    this.updateSettings(settings);
    this.notifyDataChange('marquee');
    return true;
  }

  resetMarqueeItems() {
    return this.updateMarqueeItems(JSON.parse(JSON.stringify(DEFAULT_MARQUEE_ITEMS)));
  }

  getDashboardMetrics() {
    const products = this.getProducts();
    const orders = this.getOrders();

    const totalRevenueCny = orders
      .filter(o => o.status !== 'بىكار قىلىندى')
      .reduce((sum, o) => sum + (o.totalCny || o.total || 0), 0);

    return {
      totalRevenue: this.formatPrice(totalRevenueCny),
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'ساقلاۋاتىدۇ').length,
      shippedOrders: orders.filter(o => o.status === 'يوللاندى').length,
      completedOrders: orders.filter(o => o.status === 'تاماملاندى').length,
      totalProducts: products.length,
      pendingProducts: products.filter(p => p.approvalStatus === 'تەستىق كۈتۈۋاتىدۇ').length,
      lowStockProducts: products.filter(p => p.stock <= 10).length,
      outOfStockProducts: products.filter(p => p.stock === 0).length,
      totalAgents: this.getAgents().length,
      pendingAgents: this.getAgents().filter(a => a.status === 'تەستىق كۈتۈۋاتىدۇ').length
    };
  }

  // ==================== قىسقا ئۇچۇر (SMS & WhatsApp) باشقۇرۇش ====================
  getSmsHistory() {
    try {
      const logs = localStorage.getItem(STORAGE_KEYS.SMS_HISTORY);
      return logs ? JSON.parse(logs) : [];
    } catch (e) {
      return [];
    }
  }

  saveSmsLog(entry) {
    try {
      const logs = this.getSmsHistory();
      const newEntry = {
        id: entry.id || ('SMS-' + Date.now()),
        phone: entry.phone || '',
        recipientName: entry.recipientName || 'نامەلۇم',
        recipientRole: entry.recipientRole || 'خېرىدار',
        channel: entry.channel || 'sms',
        message: entry.message || '',
        orderId: entry.orderId || '',
        timestamp: entry.timestamp || new Date().toLocaleString('ug-CN', { hour12: false })
      };
      logs.unshift(newEntry);
      if (logs.length > 200) logs.pop();
      localStorage.setItem(STORAGE_KEYS.SMS_HISTORY, JSON.stringify(logs));
      this.notifyDataChange('sms_history');
      return newEntry;
    } catch (e) {
      console.error('Failed to save SMS log:', e);
      return null;
    }
  }

  deleteSmsLog(logId) {
    let logs = this.getSmsHistory();
    logs = logs.filter(l => l.id !== logId);
    localStorage.setItem(STORAGE_KEYS.SMS_HISTORY, JSON.stringify(logs));
    this.notifyDataChange('sms_history');
    return true;
  }

  clearSmsHistory() {
    localStorage.setItem(STORAGE_KEYS.SMS_HISTORY, JSON.stringify([]));
    this.notifyDataChange('sms_history');
    return true;
  }

  normalizePhone(phone) {
    if (!phone) return '';
    let p = phone.toString().replace(/[^\d+]/g, '').trim();
    if (p.startsWith('00')) p = '+' + p.slice(2);
    return p;
  }

  normalizePhoneForWa(phone) {
    if (!phone) return '';
    let digits = phone.toString().replace(/\D/g, '');
    if (digits.startsWith('00')) digits = digits.slice(2);
    // تۈركىيە نۇمۇرلىرى مەسىلەن 05321112233 بولسا 905321112233 قىلىش
    if (digits.startsWith('0') && digits.length === 11) {
      digits = '9' + digits;
    } else if (digits.startsWith('5') && digits.length === 10) {
      digits = '90' + digits;
    }
    return digits;
  }

  createSmsUrl(phone, message) {
    const p = this.normalizePhone(phone);
    const enc = encodeURIComponent(message || '');
    // iOS and Android compatibility
    return `sms:${p}?body=${enc}`;
  }

  createWhatsappUrl(phone, message) {
    const waPhone = this.normalizePhoneForWa(phone);
    const enc = encodeURIComponent(message || '');
    return `https://wa.me/${waPhone}?text=${enc}`;
  }

  async sendSmsViaServer(payload) {
    try {
      const res = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data && data.success) {
        this.saveSmsLog(payload);
      }
      return data;
    } catch (err) {
      // Local fallback: save to localStorage anyway
      this.saveSmsLog(payload);
      return { success: true, message: 'ئۇچۇر يەرلىك سىستېمىغا تىزىملاندى' };
    }
  }

  // ==================== ياقتۇرغانلار تەپسىلاتى (Wishlist Detailed) ====================
  getWishlistDetailed(lang = 'ug') {
    const ids = this.getWishlist();
    const products = this.getProducts();
    const detailed = [];
    for (let id of ids) {
      const p = products.find(prod => String(prod.id) === String(id));
      if (p) {
        let name = p.name;
        let desc = p.description;
        if (p.translations && p.translations[lang]) {
          if (p.translations[lang].name) name = p.translations[lang].name;
          if (p.translations[lang].description) desc = p.translations[lang].description;
        }
        detailed.push({
          ...p,
          product: p,
          displayName: name,
          name: name,
          displayDesc: desc,
          priceFormatted: this.formatPrice(p.price),
          inStock: (Number(p.stock) || 0) > 0
        });
      }
    }
    return detailed;
  }

  clearWishlist() {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify([]));
    this.notifyDataChange('wishlist');
  }

  moveWishlistToCart(productId, lang = 'ug') {
    const res = this.addToCart(productId, 1, lang);
    if (res && res.success) {
      this.toggleWishlist(productId);
    }
    return res;
  }

  moveAllWishlistToCart(lang = 'ug') {
    const list = this.getWishlistDetailed(lang);
    let count = 0;
    for (let item of list) {
      if (item.inStock) {
        this.addToCart(item.id, 1, lang);
        count++;
      }
    }
    this.clearWishlist();
    return count;
  }

  saveCoupon(coupon) {
    const coupons = this.getCoupons();
    const idx = coupons.findIndex(c => c.code.toUpperCase() === coupon.code.toUpperCase());
    if (idx !== -1) {
      coupons[idx] = { ...coupons[idx], ...coupon, code: coupon.code.toUpperCase() };
    } else {
      coupons.unshift({
        ...coupon,
        code: coupon.code.toUpperCase(),
        usedCount: coupon.usedCount || 0,
        isActive: coupon.isActive !== undefined ? coupon.isActive : true
      });
    }
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    this.notifyDataChange('coupons');
    return true;
  }

  deleteCoupon(code) {
    let coupons = this.getCoupons();
    coupons = coupons.filter(c => c.code.toUpperCase() !== code.toUpperCase());
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    this.notifyDataChange('coupons');
    return true;
  }

  toggleCouponStatus(code) {
    const coupons = this.getCoupons();
    const c = coupons.find(item => item.code.toUpperCase() === code.toUpperCase());
    if (c) {
      c.isActive = !c.isActive;
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
      this.notifyDataChange('coupons');
      return c.isActive;
    }
    return false;
  }

  // ==================== 🎡 خېرىدارلارنىڭ كۈندىلىك پائالىيىتى: ئامەت چاقى ۋە كۈندىلىك ئېتىبار (Customer Retention) ====================
  getCustomerRetentionSettings() {
    const settings = this.getSettings() || {};
    const defaults = {
      luckyWheel: {
        enabled: true,
        dailySpinLimit: 1,
        title: 'ئامەت چاقى',
        subtitle: 'كۈندە 1 قېتىم ھەقسىز ئايلاندۇرۇپ، ئالاھىدە پۇل ئېتىبار كۇپونى ئۇتۇۋېلىڭ!',
        slices: [
          { id: 'sw1', text: '₺10 ئېتىبار', couponCode: 'LUCKY10', type: 'fixed', value: 10, minSpend: 100, color: '#f59e0b', weight: 30 },
          { id: 'sw2', text: '₺20 ئېتىبار', couponCode: 'LUCKY20', type: 'fixed', value: 20, minSpend: 200, color: '#10b981', weight: 25 },
          { id: 'sw3', text: '₺50 ئېتىبار', couponCode: 'LUCKY50', type: 'fixed', value: 50, minSpend: 400, color: '#ef4444', weight: 10 },
          { id: 'sw4', text: 'ھەقسىز يەتكۈزۈش', couponCode: 'LUCKYFREE', type: 'free_shipping', value: 35, minSpend: 150, color: '#8b5cf6', weight: 20 },
          { id: 'sw5', text: '%5 ئېتىبار', couponCode: 'LUCKY5PCT', type: 'percentage', value: 5, minSpend: 50, color: '#3b82f6', weight: 25 },
          { id: 'sw6', text: 'تەلەيلىك بولۇڭ', couponCode: '', type: 'none', value: 0, minSpend: 0, color: '#64748b', weight: 10 }
        ]
      },
      flashSale: {
        enabled: true,
        title: '⚡ ئالاھىدە ئېتىبارلىق مەھسۇلاتلار',
        subtitle: 'ھەر كۈنى چەكلىك ۋاقىتتا يېڭىلىنىدۇ، پۇرسەتنى چىڭ تۇتۇڭ!',
        discountPercentage: 20,
        productIds: []
      }
    };

    if (!settings.customerRetention) return defaults;
    const luckyWheel = { ...defaults.luckyWheel, ...(settings.customerRetention.luckyWheel || {}) };
    if (!luckyWheel.title || luckyWheel.title === 'بۈگۈنكى بەخت چاقى' || luckyWheel.title === 'بەخت چاقى') {
      luckyWheel.title = 'ئامەت چاقى';
    }
    const flashSale = { ...defaults.flashSale, ...(settings.customerRetention.flashSale || {}) };
    if (!flashSale.title || flashSale.title.includes('بۈگۈنكى ئالاھىدە ئېتىبارلىق') || flashSale.title.includes('كۈندىلىك تالاش-تارتىش') || flashSale.title === 'بۈگۈنكى ئېتىبارلارنى كۆرۈش') {
      flashSale.title = '⚡ ئالاھىدە ئېتىبارلىق مەھسۇلاتلار';
    }
    return {
      luckyWheel,
      flashSale
    };
  }

  saveCustomerRetentionSettings(retention) {
    const settings = this.getSettings() || {};
    settings.customerRetention = retention;
    this.updateSettings(settings);
    this.syncLuckyWheelCoupons();
    this.notifyDataChange('settings');
    this.notifyDataChange('customerRetention');
    return true;
  }

  syncLuckyWheelCoupons() {
    try {
      const retention = this.getCustomerRetentionSettings();
      if (!retention || !retention.luckyWheel || !Array.isArray(retention.luckyWheel.slices)) return;
      const coupons = this.getCoupons();
      let changed = false;

      retention.luckyWheel.slices.forEach(slice => {
        if (!slice.couponCode || slice.type === 'none') return;
        const code = slice.couponCode.trim().toUpperCase();
        let existing = coupons.find(c => c.code.toUpperCase() === code);
        if (!existing) {
          coupons.push({
            code: code,
            type: slice.type || 'fixed',
            value: Number(slice.value) || 10,
            minSpend: Number(slice.minSpend) || 0,
            expireDate: '2028-12-31',
            usageLimit: 100000,
            usedCount: 0,
            isActive: true,
            description: `🎡 ئامەت چاقى مۇكاپات كۇپونى: ${slice.text}`
          });
          changed = true;
        } else {
          if (existing.type !== slice.type || existing.value !== Number(slice.value) || existing.minSpend !== Number(slice.minSpend)) {
            existing.type = slice.type || 'fixed';
            existing.value = Number(slice.value) || 10;
            existing.minSpend = Number(slice.minSpend) || 0;
            existing.description = `🎡 ئامەت چاقى مۇكاپات كۇپونى: ${slice.text}`;
            changed = true;
          }
        }
      });

      if (changed) {
        localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
        this.notifyDataChange('coupons');
      }
    } catch (e) {
      console.error('Failed to sync lucky wheel coupons:', e);
    }
  }

  canCustomerSpinToday() {
    const today = new Date().toISOString().split('T')[0];
    const lastSpin = this.getCustomerLastSpin();
    if (!lastSpin || !lastSpin.date) return { canSpin: true };
    if (lastSpin.date === today) {
      return { 
        canSpin: false, 
        lastSpin,
        message: 'بۈگۈنكى ھەقسىز ئايلاندۇرۇش پۇرسىتىڭىزنى ئىشلىتىپ بولدىڭىز! ئەتىگە يەنە كۆرۈشەيلى.' 
      };
    }
    return { canSpin: true };
  }

  getCustomerLastSpin() {
    try {
      const data = localStorage.getItem('teklimakan_customer_last_spin');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  recordCustomerSpin(prizeSlice) {
    const today = new Date().toISOString().split('T')[0];
    const spinRecord = {
      date: today,
      time: new Date().toISOString(),
      prizeId: prizeSlice.id,
      text: prizeSlice.text,
      couponCode: prizeSlice.couponCode || '',
      type: prizeSlice.type,
      value: prizeSlice.value,
      minSpend: prizeSlice.minSpend
    };
    try {
      localStorage.setItem('teklimakan_customer_last_spin', JSON.stringify(spinRecord));
      this.notifyDataChange('customerSpin', spinRecord);
    } catch (e) {}
    return spinRecord;
  }

  getCustomerDailyFlashSaleProducts() {
    const ret = this.getCustomerRetentionSettings();
    const flash = ret.flashSale || {};
    if (!flash.enabled) return [];

    const discountPct = Number(flash.discountPercentage) || 20;
    const allProds = this.getProducts().filter(p => {
      const status = p.approvalStatus || 'تەستىقلاندى';
      const isApproved = status !== 'ساقلاۋاتىدۇ' && status !== 'رەت قىلىندى' && status !== 'rejected' && status !== 'pending';
      return isApproved && (Number(p.stock) || 0) > 0;
    });

    let selected = [];
    if (Array.isArray(flash.productIds) && flash.productIds.length > 0) {
      selected = allProds.filter(p => flash.productIds.includes(p.id));
    }

    if (selected.length === 0) {
      selected = allProds.slice(0, 6);
    }

    return selected.map(p => {
      const origPrice = Number(p.price) || 0;
      const flashPrice = Math.max(1, Math.round(origPrice * (1 - discountPct / 100)));
      return {
        ...p,
        originalPrice: origPrice,
        price: flashPrice,
        flashDiscountPercent: discountPct,
        isFlashSale: true
      };
    });
  }

  notifyDataChange(type, detail = {}) {
    window.dispatchEvent(new CustomEvent('uyghur_store_sync', { detail: { type, ...detail } }));

    // 📡 كۆپ بەت ياكى تېلېفون كۆزنەكلىرى ئارىسىدا ئۆزلۈكىدىن تارقىتىش (BroadcastChannel)
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        if (!this._syncBroadcast) {
          this._syncBroadcast = new BroadcastChannel('teklimakan_store_sync_channel');
          this._syncBroadcast.onmessage = (event) => {
            if (event.data && event.data.type) {
              window.dispatchEvent(new CustomEvent('uyghur_store_sync', { detail: event.data }));
            }
          };
        }
        this._syncBroadcast.postMessage({ type, ...detail });
      }
    } catch(e) {}

    // 🔄 ئۈسكۈنىنىڭ ساقلىغۇچ ئالماشتۇرۇش سىگنالى (Cross-tab localStorage pulse)
    try {
      localStorage.setItem('teklimakan_store_sync_pulse', JSON.stringify({ type, ...detail, time: Date.now() }));
    } catch(e) {}
  }
}

window.appStore = new StoreManager();
