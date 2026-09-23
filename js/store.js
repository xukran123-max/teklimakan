/**
 * ================================================================
 * مەركىزىي سانلىق مەلۇمات ئامبىرى ۋە ھالەت باشقۇرغۇچ (Store.js)
 * تىل، پۇل بىرلىكى (₺ لىرا ۋە $ دوللار)، ماركا نامى ۋە زاكازلار
 * ================================================================
 */

const STORAGE_KEYS = {
  PRODUCTS: 'teklimakan_ecom_products_v12',
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
    code: 'NEWUSER',
    type: 'percentage',
    value: 15,
    minSpend: 150,
    expireDate: '2027-06-30',
    usageLimit: 1000,
    usedCount: 82,
    isActive: true,
    description: 'يېڭى خېرىدارلارغا 15% ئەلا كۇپون'
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
    phone: '05551609999',
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

// پۇل بىرلىكى نىسبەتلىرى (پەقەت لىرا ۋە دوللار)
const CURRENCY_RATES = {
  'TRY': { symbol: '₺', rate: 4.8, freeThreshold: 1000, name: 'Lira (₺)' },
  'USD': { symbol: '$', rate: 0.14, freeThreshold: 30, name: 'Dollar ($)' }
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
    id: 'PRD-100',
    brand: 'تەكلىماكان تىبابىتى',
    languageScope: 'all',
    name: 'تەبىئىي شىپالىق پىننە گۈلقەنتى 1kg (ئاشقازان ۋە ھەزىمگە مەنپەئەتلىك)',
    category: 'ئۇيغۇر تىبابىتى',
    price: 185,
    oldPrice: 240,
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
    name: 'تۇرپان يېڭى مەھسۇلات ئەلا كۆك ئۈزۈم مېغىزى 500g',
    category: 'ئۆسۈملۈك دورىلار',
    price: 45,
    oldPrice: 65,
    stock: 150,
    sales: 580,
    rating: 5.0,
    ratingCount: 215,
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
    description: 'تۇرپان ئۈزۈمچىلىك بازىسىنىڭ شامال كۈپىدە تەبىئىي قۇرۇتۇلغان ساپ يېشىل رەڭلىك، تاتلىق ھەم مېغىزلىق مەھسۇلاتى.',
    translations: {
      ug: {
        name: 'تۇرپان يېڭى مەھسۇلات ئەلا كۆك ئۈزۈم مېغىزى 500g',
        category: 'ئۆسۈملۈك دورىلار',
        description: 'تۇرپان ئۈزۈمچىلىك بازىسىنىڭ شامال كۈپىدە تەبىئىي قۇرۇتۇلغان ساپ يېشىل رەڭلىك، تاتلىق ھەم مېغىزلىق مەھسۇلاتى.'
      },
      tr: {
        name: 'Turpan Yeni Mahsul Yeşil Çekirdeksiz Kuru Üzüm 500g',
        category: 'Şifalı Bitkiler & Otlar',
        description: 'Turpan vadisinde rüzgar kurutma kulelerinde doğal olarak kurutulmuş tatlı yeşil çekirdeksiz üzüm.'
      },
      en: {
        name: 'Premium Turpan Naturally Dried Green Seedless Raisins 500g',
        category: 'Herbal Medicines',
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
    name: 'تۇرپان كىلاسسىك تەبىئىي قىزىل ئۈزۈم مېغىزى 500g',
    category: 'ئۆسۈملۈك دورىلار',
    price: 42,
    oldPrice: 58,
    stock: 160,
    sales: 610,
    rating: 4.9,
    ratingCount: 195,
    image: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&w=800&q=80',
    description: 'تەبىئىي ئاپتاپتا قۇرۇتۇلغان، تەركىبىدە تۆمۈر ۋە مىنېرال ماددىلار مول بولغان ئالىي سۈپەتلىك تاتلىق قىزىل مەھسۇلات.',
    translations: {
      ug: {
        name: 'تۇرپان كىلاسسىك تەبىئىي قىزىل ئۈزۈم مېغىزى 500g',
        category: 'ئۆسۈملۈك دورىلار',
        description: 'تەبىئىي ئاپتاپتا قۇرۇتۇلغان، تەركىبىدە تۆمۈر ۋە مىنېرال ماددىلار مول بولغان ئالىي سۈپەتلىك تاتلىق قىزىل مەھسۇلات.'
      },
      tr: {
        name: 'Turpan Güneşte Kurutulmuş Kırmızı Kuru Üzüm 500g',
        category: 'Şifalı Bitkiler & Otlar',
        description: 'Turpan güneşinde doğal yollarla kurutulmuş yüksek besin değerli leziz kırmızı üzüm.'
      },
      en: {
        name: 'Turpan Sun-Dried Sweet Crimson Red Raisins 500g',
        category: 'Herbal Medicines',
        description: 'Sun-ripened and naturally cured sweet crimson raisins from the fertile oasis soils.'
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
  }
];

const INITIAL_CATEGORIES = [
  { id: 'all', name: 'بارلىق مەھسۇلاتلار', icon: 'fas fa-th-large', translations: { ug: 'بارلىق مەھسۇلاتلار', tr: 'Tüm Ürünler', en: 'All Products' } },
  { id: 'ئۇيغۇر تىبابىتى', name: 'ئۇيغۇر تىبابىتى', icon: 'fas fa-mortar-pestle', translations: { ug: 'ئۇيغۇر تىبابىتى', tr: 'Uygur Tıbbı', en: 'Uyghur Medicine' } },
  { id: 'پىششىق دورىلار', name: 'پىششىق دورىلار', icon: 'fas fa-pills', translations: { ug: 'پىششىق دورىلار', tr: 'Hazır & İşlenmiş İlaçlar', en: 'Prepared Medicines' } },
  { id: 'ئۆسۈملۈك دورىلار', name: 'ئۆسۈملۈك دورىلار', icon: 'fas fa-leaf', translations: { ug: 'ئۆسۈملۈك دورىلار', tr: 'Şifalı Bitkiler & Otlar', en: 'Herbal Medicines' } },
  { id: 'تەبىئىي ياغلار', name: 'تەبىئىي ياغلار', icon: 'fas fa-tint', translations: { ug: 'تەبىئىي ياغلار', tr: 'Doğal & Şifalı Yağlar', en: 'Natural Oils' } },
  { id: 'گۈزەللىك ۋە ساغلاملىق', name: 'گۈزەللىك ۋە ساغلاملىق', icon: 'fas fa-heartbeat', translations: { ug: 'گۈزەللىك ۋە ساغلاملىق', tr: 'Güzellik & Sağlık', en: 'Beauty & Health' } },
  { id: 'گۈلقەنتلەر', name: 'گۈلقەنتلەر', icon: 'fas fa-seedling', translations: { ug: 'گۈلقەنتلەر', tr: 'Gül Reçelleri & Macunlar', en: 'Rose Jams & Pastes' } },
  { id: 'كىتاپ ۋە مەدەنىيەت', name: 'كىتاپ ۋە مەدەنىيەت', icon: 'fas fa-book-open', translations: { ug: 'كىتاپ ۋە مەدەنىيەت', tr: 'Kitap & Kültür', en: 'Books & Culture' } }
];

const INITIAL_SETTINGS = {
  storeName: 'تەكلىماكان سودا تورى',
  storeSlogan: 'سۈپەتلىك، گۈزەل، ئىشەنچلىك ئۇيغۇرچە تور دۇكىنىڭىز',
  currency: 'TRY', // default TRY (₺)
  contactPhone: '05551609999',
  contactEmail: 'xizmet@teklimakan.com',
  instagramUrl: 'https://www.instagram.com/teklimakan.online',
  announcement: '🚚 1000 لىرادىن ئارتۇق مال سېتىۋالسىڭىز يەتكۈزۈپ بېرىش ھەقسىز! | 1000 TL Üzeri Alışverişlerde Kargo Bedava! | Free Shipping on Orders Over 1000 TL!',
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
  smsSenderName: 'تەكلىماكان'
};

class StoreManager {
  constructor() {
    this.currentCurrency = localStorage.getItem(STORAGE_KEYS.CURRENCY) || 'TRY';
    this.init();
  }

  init() {
    // تىرناق ئىچىدىكى خەتلەر ياكى كونا پۇل بىرلىكى قالغان بولسا ئاپتوماتىك تازىلاش
    const storedBrands = localStorage.getItem(STORAGE_KEYS.BRANDS);
    if (!storedBrands || storedBrands.includes('(')) {
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(INITIAL_BRANDS));
    }
    const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!storedProducts || !storedProducts.includes('PRD-100') || storedProducts.includes('Hotan Heritage') || storedProducts.includes('photo-1611591475836') || storedProducts.includes('photo-1607006314546') || storedProducts.includes('photo-1595231712325')) {
      // دەسلەپكى تاۋارلارغا تەستىقلانغان دەپ ھالەت بېرىش ھەمدە كونا/بۇزۇق رەسىملەرنى ئەسلىگە كەلتۈرۈش
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    } else {
      // كونا تاۋارلارغا ئەگەر تەستىق ھالىتى بولمىسا تەستىقلاندى قىلىپ بېكىتىش ھەمدە تەستىق كۈتۈۋاتقان تاۋارلارنى تولۇقلاش
      try {
        let prods = JSON.parse(storedProducts);
        let updated = false;

        // ھەر بىر تاۋارنىڭ approvalStatus ۋە كۆپ تىللىق تەرجىمىسىنىڭ تولۇقلىقىغا كاپالەتلىك قىلىش
        prods = prods.map(p => {
          if (!p.approvalStatus) {
            p.approvalStatus = 'تەستىقلاندى';
            updated = true;
          }
          // كونا تۈرلەرنى يېڭى 4 تۈرگە ئايلاندۇرۇش (ئۇيغۇر تىبابىتى، پىششىق دورىلار، ئۆسۈملۈك دورىلار، تەبىئىي ياغلار)
          const catMap = {
            'مىللىي زىبۇ-زىننەت': 'ئۇيغۇر تىبابىتى',
            'كىتاب-مەدەنىيەت': 'ئۇيغۇر تىبابىتى',
            'تۇرمۇش لازىمەتلىكلىرى': 'ئۇيغۇر تىبابىتى',
            'كىيىم-كېچەك': 'پىششىق دورىلار',
            'ئېلېكترون': 'پىششىق دورىلار',
            'مىللىي تەبىئىي مەھسۇلاتلار': 'ئۆسۈملۈك دورىلار',
            'گۈزەللىك ۋە ساقلىق': 'تەبىئىي ياغلار'
          };
          if (catMap[p.category]) {
            p.category = catMap[p.category];
            updated = true;
          }
          // ئادەم رەسىمى، قول، باش، بەدەن ئەزالىرى بار كونا رەسىملەرنى ساپ تەبىئىي رەسىملەر بىلەن ئالماشتۇرۇش
          if (p.image && (
            p.image.includes('photo-1596704017254') ||
            p.image.includes('photo-1607604276583') ||
            p.image.includes('photo-1600003014755') || 
            p.image.includes('photo-1576092768241') || 
            p.image.includes('photo-1576871337622') || 
            p.image.includes('photo-1616683693504') ||
            p.image.includes('photo-1608248597359') ||
            p.image.includes('photo-1615655406736') ||
            p.image.includes('photo-1607006314546') || 
            p.image.includes('photo-1595231712325')
          )) {
            const initMatch = INITIAL_PRODUCTS.find(ip => ip.id === p.id);
            if (initMatch) {
              p.image = initMatch.image;
              updated = true;
            }
          }
          // دەسلەپكى تاۋارلارنىڭ كەم قالغان تەرجىمىلىرىنى INITIAL_PRODUCTS دىن تولۇقلاش
          const initMatch = INITIAL_PRODUCTS.find(ip => ip.id === p.id);
          if (initMatch && initMatch.translations) {
            if (!p.translations || !p.translations.tr || !p.translations.tr.name) {
              p.translations = initMatch.translations;
              updated = true;
            }
          }
          return p;
        });

        // ئەگەر تەستىق كۈتۈۋاتقان تاۋارلار (PRD-117, PRD-118) قوشۇلمىغان بولسا، سىناش ۋە كۆرۈش ئۈچۈن قوشۇپ قويۇش
        const hasPending = prods.some(p => p.approvalStatus === 'تەستىق كۈتۈۋاتىدۇ');
        if (!hasPending) {
          const samplePending = INITIAL_PRODUCTS.filter(p => p.approvalStatus === 'تەستىق كۈتۈۋاتىدۇ');
          samplePending.forEach(sp => {
            if (!prods.some(p => p.id === sp.id)) {
              prods.unshift(sp);
              updated = true;
            }
          });
        }

        if (updated) {
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prods));
        }
      } catch (e) {}
    }
    const storedAgents = localStorage.getItem(STORAGE_KEYS.AGENTS);
    if (!storedAgents || storedAgents.includes('(')) {
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
        curSet.telegramBotToken = INITIAL_SETTINGS.telegramBotToken;
        curSet.telegramChatId = INITIAL_SETTINGS.telegramChatId;
        curSet.telegramEnabled = curSet.telegramEnabled !== false;
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

    // ☁️ Supabase بۇلۇت ئامبىرى بىلەن ئارقا تەرەپتە ئاپتوماتىك قوش يۆنىلىشلىك ماسلىشىش
    this.syncWithSupabase();
  }

  async syncWithSupabase() {
    if (!window.TeklimakanSupabase) return;
    try {
      // 1. مەھسۇلاتلارنى بۇلۇتتىن يېڭىلاش
      const remoteProducts = await window.TeklimakanSupabase.fetchProducts();
      if (Array.isArray(remoteProducts) && remoteProducts.length > 0) {
        const localProds = this.getProducts();
        // بۇلۇتتىكى سۈپەتلىك پىششىقلانغان تاۋارلار بىلەن يەرلىكنى بىرىكتۈرۈش
        const map = new Map();
        localProds.forEach(p => map.set(p.id, p));
        remoteProducts.forEach(rp => {
          map.set(rp.id, {
            id: rp.id,
            name: rp.name,
            brand: rp.brand,
            category: rp.category,
            price: Number(rp.price),
            oldPrice: rp.old_price ? Number(rp.old_price) : null,
            stock: rp.stock,
            sales: rp.sales,
            rating: Number(rp.rating),
            ratingCount: rp.rating_count,
            image: rp.image,
            description: rp.description,
            badge: rp.badge,
            featured: rp.featured,
            approvalStatus: rp.approval_status || 'تەستىقلاندى',
            languageScope: rp.language_scope || 'all',
            merchantBadge: rp.merchant_badge,
            agentId: rp.agent_id,
            agentName: rp.agent_name,
            translations: rp.translations || {}
          });
        });
        const merged = Array.from(map.values());
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(merged));
        this.notifyDataChange('products');
      } else if (Array.isArray(remoteProducts) && remoteProducts.length === 0) {
        // ئەگەر Supabase ئامبىرى يېڭى ھەم قۇرۇق بولسا، دەسلەپكى تاۋارلارنى بۇلۇتقا دەسلەپكى قەدەمدە قاچىلاش
        const currentProds = this.getProducts();
        currentProds.forEach(p => {
          window.TeklimakanSupabase.upsertProduct(p);
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
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(Array.from(oMap.values())));
        this.notifyDataChange('orders');
      }

      // 3. ۋاكالەتچىلەرنى بۇلۇتتىن يېڭىلاش
      const remoteAgents = await window.TeklimakanSupabase.fetchAgents();
      if (Array.isArray(remoteAgents) && remoteAgents.length > 0) {
        const localAgents = this.getAgents('none');
        const aMap = new Map();
        localAgents.forEach(a => aMap.set(a.id, a));
        remoteAgents.forEach(ra => {
          aMap.set(ra.id, {
            id: ra.id,
            name: ra.name,
            email: ra.email,
            phone: ra.phone,
            city: ra.city,
            status: ra.status,
            reputation: ra.reputation,
            canPublishMultilingual: ra.can_publish_multilingual,
            authorizedBrands: ra.authorized_brands || [],
            registeredAt: ra.registered_at,
            authExpireDate: ra.auth_expire_date,
            certCode: ra.cert_code,
            productsCount: ra.products_count,
            salesTotal: Number(ra.sales_total || 0),
            monthlySales: Number(ra.monthly_sales || 0),
            monthlyOrders: Number(ra.monthly_orders || 0),
            commissionRate: Number(ra.commission_rate || 15),
            violationsCount: Number(ra.violations_count || 0),
            suspendedUntil: ra.suspended_until,
            suspensionReason: ra.suspension_reason || ''
          });
        });
        localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(Array.from(aMap.values())));
        this.notifyDataChange('agents');
      }
    } catch (e) {
      console.warn('Supabase ماسلىشىش خاتالىقى:', e);
    }
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

  // CNY باھاسىنى ھازىرقى تاللانغان پۇلغا ئايلاندۇرۇش
  convertPrice(amountInCny) {
    const info = this.getCurrencyInfo();
    return Math.round(amountInCny * info.rate);
  }

  formatPrice(amountInCny) {
    const info = this.getCurrencyInfo();
    const converted = Math.round(amountInCny * info.rate);
    return `${info.symbol}${converted}`;
  }

  getFreeShippingThreshold() {
    return this.getCurrencyInfo().freeThreshold;
  }

  // ==================== ۋاكالەتچىلەر ۋە ماركا رۇخسىتى (Agents & Brand Auth) ====================
  getAgents(sortBy = 'name') {
    let agents = JSON.parse(localStorage.getItem(STORAGE_KEYS.AGENTS)) || INITIAL_AGENTS;

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

  getMonthlyAgentPerformanceSummary() {
    const agents = this.getAgents('name');
    let totalSales = 0;
    let totalOrders = 0;
    let totalCommission = 0;

    const list = agents.map(a => {
      const tier = this.getAgentPerformanceTier(a);
      const mSales = Number(a.monthlySales || 0);
      const mOrders = Number(a.monthlyOrders || 0);
      const rate = Number(a.commissionRate || 15);
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
        authorizedBrands: a.authorizedBrands || []
      };
    });

    return {
      monthTitle: '2026-يىلى 9-ئاي (ھازىرقى ئاي)',
      generatedDate: new Date().toISOString().split('T')[0],
      totalAgents: agents.length,
      totalSales,
      totalOrders,
      totalCommission,
      list,
      agents: list
    };
  }

  saveAgent(agentData) {
    let agents = this.getAgents('none');
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

    return true;
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
      return true;
    }
    return false;
  }

  deleteAgent(agentId) {
    let agents = this.getAgents('none');
    agents = agents.filter(a => a.id !== agentId);
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
    this.notifyDataChange('agents');
    return true;
  }

  // ==================== 🤝 ۋاكالەتچى ئىلتىماس قىلىش ۋە كىرىش ====================
  applyAgent(agentData) {
    let agents = this.getAgents('none');
    const email = (agentData.email || '').trim().toLowerCase();
    const phone = (agentData.phone || '').trim();

    if (!agentData.name || !email) {
      return { success: false, message: 'ئىسىم ۋە ئېلخەت ئادرېسى كىرگۈزۈش مەجبۇرىي!' };
    }

    const existing = agents.find(a => (a.email && a.email.toLowerCase() === email) || (phone && a.phone && a.phone === phone));
    if (existing) {
      return { 
        success: false, 
        message: 'بۇ ئېلخەت ياكى تېلېفون نومۇرى بىلەن بۇرۇن ئىلتىماس سۇنۇلغان ياكى تىزىملاتقان!' 
      };
    }

    const newId = 'AGT-' + Math.floor(100 + Math.random() * 900);
    const contractNumber = 'TK-AGR-' + Math.floor(100000 + Math.random() * 900000);
    const nowIso = new Date().toISOString();
    const signatureHash = 'DIGI-SIGN-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const legalAgreement = {
      contractNumber,
      signedAt: nowIso,
      agentName: agentData.name.trim(),
      agentEmail: email,
      agentPhone: phone,
      liabilityClauseAccepted: true,
      liabilityClauseText: 'تور سۇپىمىزنىڭ ئەمەس بەلكى ئۆزىنىڭ مەھسۇلاتىنى سېتىۋاتقان ۋاكالەتچىلەر ئۆزىنىڭ مەھسۇلاتىدىن كېلىپ چىققان ھەرقانداق ئاقىۋەتكە ئۆزى مەسئۇل، سۇپىمىز ئۆز ئۈستىگە ئالمايدۇ.',
      fiveRulesAccepted: true,
      termsVersion: '2026.1-Official',
      digitalSignatureHash: signatureHash
    };

    const newAgent = {
      id: newId,
      name: agentData.name.trim(),
      email: email,
      phone: phone,
      status: 'تەستىق كۈتۈۋاتىدۇ',
      canPublishMultilingual: false,
      authorizedBrands: [],
      proposedBrands: agentData.proposedBrands || agentData.categoryInterest || 'بارلىق تۈرلەر',
      notes: agentData.notes || '',
      registeredAt: nowIso.split('T')[0],
      productsCount: 0,
      legalAgreement: legalAgreement
    };

    agents.unshift(newAgent);
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
    this.notifyDataChange('agents');

    // 🤖 ئالىي باشقۇرغۇچىغا Telegram ئارقىلىق يېڭى ۋاكالەتچى ئىلتىماسى ۋە ئىمزالانغان كېلىشىم ئۇقتۇرۇشى ئەۋەتىش
    this.sendTelegramAlert({
      title: '👤 [يېڭى ۋاكالەتچى ئىلتىماسى ۋە كېلىشىمى] تور بېكەتتىن يېڭى ئىلتىماس چۈشتى!',
      message: `🆔 <b>ئىلتىماس كودى:</b> <code>${newAgent.id}</code>\n` +
               `📜 <b>كېلىشىم نومۇرى:</b> <code>${contractNumber}</code>\n` +
               `👤 <b>ئىسىم-فامىلىسى:</b> <b>${newAgent.name}</b>\n` +
               `📞 <b>تېلېفون نومۇرى:</b> <code>${newAgent.phone || '-'}</code>\n` +
               `📧 <b>ئېلخەت ئادرېسى:</b> <code>${newAgent.email}</code>\n` +
               `🏷️ <b>تەلەپ قىلغان ماركا/تۈر:</b> ${newAgent.proposedBrands}\n` +
               `⚖️ <b>مەسئۇلىيەت بەلگىلىمىسى:</b> تولۇق قوشۇلدى ۋە رەقەملىك ئىمزالاندى\n` +
               `⏳ <b>ھالىتى:</b> تەستىق كۈتۈۋاتىدۇ\n\n` +
               `👉 <i>ئارقا سۇپىنىڭ «ۋاكالەتچىلەر» بۆلىكىدىن ئىمزالانغان كېلىشىمنامىنى تەكشۈرۈپ تەستىقلاڭ.</i>`,
      isUrgent: false
    });

    return {
      success: true,
      agent: newAgent,
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
    <p>سۈرەتتە يات ئېلان بولماسلىق؛ ئادەم، مودېل، تەن، قول، بارماق رەسىمى كىرگۈزمەسلىك (پەقەت تاۋارنىڭ ساپ ئۆزى بولۇش)؛ ئېنىقلىقى كەم دېگەندە 800×800 پىكسېل ۋە 1:1 كۋادرات بولۇش؛ JPG, PNG, WEBP فورماتى ۋە 2MB تىن ئاشماسلىق؛ ھەمدە سۇپىنىڭ «تەكلىماكان كاپالىتى» ئالتۇن تامغىسى بېسىلىشى شەرت قىلىنىدۇ.</p>
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

  verifyAgentLogin(identifier) {
    if (!identifier) return { success: false, message: 'ئېلخەت ياكى تېلېفون كىرگۈزۈڭ!' };
    const term = identifier.trim().toLowerCase();
    const agents = this.getAgents('none');
    const agent = agents.find(a => 
      (a.email && a.email.toLowerCase() === term) || 
      (a.phone && a.phone.replace(/[^0-9]/g, '') === term.replace(/[^0-9]/g, '')) ||
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

    return { 
      success: true, 
      agent, 
      violationsCount: agent.violationsCount || 0,
      message: `خۇش كەپسىز، ھۆرمەتلىك ۋاكالەتچى ${agent.name}!` 
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

  // ==================== 🤖 مەركىزىي Telegram دەل ۋاقتىدا ئۇقتۇرۇش ئەۋەتكۈچى ====================
  async sendTelegramAlert({ title, message, isUrgent = false, extraData = null }) {
    try {
      const settings = this.getSettings() || {};
      const botToken = settings.telegramBotToken || INITIAL_SETTINGS.telegramBotToken;
      const chatId = settings.telegramChatId || INITIAL_SETTINGS.telegramChatId;
      const enabled = settings.telegramEnabled !== false;

      if (!enabled || !botToken || !chatId) {
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

  submitAgentProduct(agentIdentifier, productData) {
    const loginRes = this.verifyAgentLogin(agentIdentifier);
    if (!loginRes.success) {
      return loginRes;
    }
    const agent = loginRes.agent;

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

    // 3. سۈرەت بىخەتەرلىكىنى ۋاكالەتچى سۈپىتىدە تەكشۈرۈش (isAdmin: false -> 5 دەخلىسىز قائىدە قاتتىق سۈزۈش!)
    const secCheck = this.validateProductImageSecurity(
      productData.image, 
      (productData.name || '') + ' ' + (productData.description || ''),
      false,
      {
        fileName: productData.fileName || '',
        width: productData.imageWidth,
        height: productData.imageHeight
      }
    );

    if (!secCheck.valid) {
      return {
        success: false,
        message: secCheck.message
      };
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

    const isEdit = !!productData.id;
    const newProdData = {
      ...productData,
      brand: productData.brand || (authorized.length > 0 ? authorized[0] : 'تەكلىماكان سۈپەت'),
      languageScope: finalLanguageScope,
      isAgentSubmitted: true,
      agentId: agent.id,
      agentName: `${agent.name} (${agent.email})`,
      merchantBadge: productData.merchantBadge || agent.reputation || 'ئىشەنچىلىك سودىگەر',
      approvalStatus: 'تەستىق كۈتۈۋاتىدۇ',
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
      // ۋاكالەتچىنىڭ تاۋار سانىنى ئاشۇرۇش
      agent.productsCount = (agent.productsCount || 0) + 1;
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

  // ==================== تاۋارلار ====================
  getProducts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
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
    let name = p.name;
    let description = p.description;
    let category = p.category;

    if (p.translations && p.translations[lang]) {
      if (p.translations[lang].name) name = p.translations[lang].name;
      if (p.translations[lang].description) description = p.translations[lang].description;
      if (p.translations[lang].category) category = p.translations[lang].category;
    }

    // تۈركچە ياكى ئىنگلىزچە سەھىپىدە ئەگەر تەرجىمە كەم قالغان بولسا دەل جايىدا ئاپتوماتىك تەرجىمە قىلىش
    if (lang !== 'ug' && window.appI18n && typeof window.appI18n.autoTranslateUyghur === 'function') {
      name = window.appI18n.autoTranslateUyghur(name, lang);
      category = window.appI18n.getCategoryName(category);
      if (description) description = window.appI18n.autoTranslateUyghur(description, lang);
    }

    return {
      ...p,
      name,
      description,
      category,
      brand: p.brand || 'تەكلىماكان سۈپەت',
      originalProduct: p
    };
  }

  getProductById(id, lang = null) {
    const products = this.getProducts();
    const p = products.find(prod => prod.id === id);
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

  // 5-قائىدە: تاۋار رەسىمىگە رەسمىي «تەكلىماكان كاپالىتى ★ Teklimakan Quality» ئالتۇن تامغىسىنى بېسىش ۋە ئەلالاشتۇرۇش
  applyTeklimakanWatermark(imgElementOrSrc) {
    return new Promise((resolve, reject) => {
      const render = (img) => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          let origW = img.naturalWidth || img.width || 800;
          let origH = img.naturalHeight || img.height || 800;

          // سۈپەتنى كاپالەتلەندۈرۈش ئۈچۈن كەم دېگەندە 800px، ئەڭ كۆپ بولغاندا 1400px غا تەڭشەش
          let targetW = origW;
          let targetH = origH;
          if (targetW < 800 || targetH < 800) {
            const upScale = Math.max(800 / targetW, 800 / targetH);
            targetW = Math.round(targetW * upScale);
            targetH = Math.round(targetH * upScale);
          } else if (targetW > 1400 || targetH > 1400) {
            const downScale = Math.min(1400 / targetW, 1400 / targetH);
            targetW = Math.round(targetW * downScale);
            targetH = Math.round(targetH * downScale);
          }

          canvas.width = targetW;
          canvas.height = targetH;

          // سۈرەتنى تولۇق كەتكۈزۈپ سىزىش
          ctx.drawImage(img, 0, 0, targetW, targetH);

          // 🌟 رەسمىي ئالتۇن سۇ بەلگىسى (Official Teklimakan Guarantee Gold Seal Badge)
          const badgeW = Math.max(220, Math.round(targetW * 0.28));
          const badgeH = Math.max(50, Math.round(badgeW * 0.24));
          const pad = Math.max(16, Math.round(targetW * 0.025));
          const x = targetW - badgeW - pad;
          const y = targetH - badgeH - pad;
          const radius = 10;

          ctx.save();
          // يۇمشاق كۆلەڭگە
          ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
          ctx.shadowBlur = 14;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 4;

          // ئارقا تەگلىك: ھەشەمەتلىك قارا-ئالتۇن گۈزەل تەدرىجىي رەڭ
          const bgGrad = ctx.createLinearGradient(x, y, x + badgeW, y + badgeH);
          bgGrad.addColorStop(0, 'rgba(15, 23, 42, 0.88)');
          bgGrad.addColorStop(1, 'rgba(30, 41, 59, 0.94)');
          ctx.fillStyle = bgGrad;

          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + badgeW - radius, y);
          ctx.quadraticCurveTo(x + badgeW, y, x + badgeW, y + radius);
          ctx.lineTo(x + badgeW, y + badgeH - radius);
          ctx.quadraticCurveTo(x + badgeW, y + badgeH, x + badgeW - radius, y + badgeH);
          ctx.lineTo(x + radius, y + badgeH);
          ctx.quadraticCurveTo(x, y + badgeH, x, y + badgeH - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.fill();

          // گىردى ئالتۇن چەمبىرەك
          ctx.shadowColor = 'transparent';
          ctx.lineWidth = Math.max(1.5, Math.round(targetW * 0.002));
          ctx.strokeStyle = '#f59e0b';
          ctx.stroke();

          // ئالتۇن يۇلتۇز / بەلگە
          const iconX = x + pad * 0.9;
          const iconY = y + badgeH / 2;
          ctx.fillStyle = '#fbbf24';
          ctx.font = `bold ${Math.round(badgeH * 0.44)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('★', iconX, iconY);

          // ئۇيغۇرچە بەلگە: «تەكلىماكان كاپالىتى»
          const textX = x + pad * 1.8;
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.round(badgeH * 0.32)}px "UKIJ Tuz Tom", "Microsoft Uighur", sans-serif`;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText('تەكلىماكان كاپالىتى', textX, y + badgeH * 0.16);

          // ئىنگلىزچە يېزىق: «Teklimakan Guarantee»
          ctx.fillStyle = '#fbbf24';
          ctx.font = `700 ${Math.round(badgeH * 0.22)}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
          ctx.fillText('Teklimakan Quality', textX, y + badgeH * 0.58);

          ctx.restore();

          // سۈرەتنى ئەلالاشتۇرۇلغان JPEG ھالىتىدە چىقىرىش (سۈپىتى 0.92)
          const watermarkedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
          resolve({
            dataUrl: watermarkedDataUrl,
            width: targetW,
            height: targetH,
            origWidth: origW,
            origHeight: origH
          });
        } catch (err) {
          console.error('Watermark error:', err);
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

    // 4-قائىدە: ھۆججەت سىغىمى (ئەڭ يۇقىرى 2MB)
    if (options.fileSize && options.fileSize > 2 * 1024 * 1024) {
      return {
        valid: false,
        rule: 4,
        reason: 'file_too_large',
        message: '🚫 4-قائىدىگە خىلاپ: سۈرەت سىغىمى بەك چوڭ (2MB تىن ئېشىپ كەتتى)! سۈرەتنى كىچىكلىتىپ يوللاڭ.'
      };
    }

    // 3-قائىدە: سۈرەت ئېنىقلىقى (Width x Height >= 800 x 800)
    if (options.width && options.height) {
      if (options.width < 800 || options.height < 800) {
        return {
          valid: false,
          rule: 3,
          reason: 'low_resolution',
          message: `🚫 3-قائىدىگە خىلاپ: سۈرەت ئېنىقلىقى بەك تۆۋەن (${options.width}×${options.height} پىكسېل)! 3-قائىدە بويىچە كەم دېگەندە 800×800 پىكسېل بولۇشى شەرت.`
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
    if (productData.id) {
      const index = products.findIndex(p => p.id === productData.id);
      if (index !== -1) {
        products[index] = { 
          ...products[index], 
          ...productData,
          approvalStatus: productData.approvalStatus || products[index].approvalStatus || 'تەستىقلاندى'
        };
        savedProduct = products[index];
      }
    } else {
      const newId = 'PRD-' + (Math.floor(100 + Math.random() * 900));
      const newProduct = {
        id: newId,
        brand: productData.brand || 'تەكلىماكان سۈپەت',
        languageScope: productData.languageScope || 'all',
        approvalStatus: approvalStatus,
        sales: 0,
        rating: 5.0,
        ratingCount: 1,
        featured: false,
        translations: productData.translations || {},
        createdAt: new Date().toISOString(),
        ...productData
      };
      products.unshift(newProduct);
      savedProduct = newProduct;
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.notifyDataChange('products');

    // ☁️ Supabase بۇلۇتقا ماس قەدەمدە يوللاش
    if (window.TeklimakanSupabase && savedProduct) {
      window.TeklimakanSupabase.upsertProduct(savedProduct);
    }

    return { 
      success: true, 
      product: savedProduct,
      message: approvalStatus === 'تەستىق كۈتۈۋاتىدۇ' 
        ? 'مەھسۇلات يوللاندى! باشقۇرغۇچى تەستىقلىغاندىن كېيىن ئېلان قىلىنىدۇ.' 
        : 'مەھسۇلات ساقلاندى ۋە ئېلان قىلىندى!' 
    };
  }

  // ==================== تاۋارلارنى تەستىقلاش مەشغۇلاتلىرى ====================
  getPendingProducts() {
    return this.getProducts().filter(p => p.approvalStatus === 'تەستىق كۈتۈۋاتىدۇ');
  }

  approveProduct(id) {
    const products = this.getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
      product.approvalStatus = 'تەستىقلاندى';
      product.approvedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.notifyDataChange('products');
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
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.notifyDataChange('products');
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

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.notifyDataChange('products');
    return true;
  }

  updateStock(id, newStock) {
    const products = this.getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
      product.stock = Math.max(0, parseInt(newStock, 10));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.notifyDataChange('products');
      return true;
    }
    return false;
  }

  toggleProductFeatured(id) {
    const products = this.getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
      product.featured = !product.featured;
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.notifyDataChange('products');
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
    clone.sales = 0;
    clone.approvalStatus = 'تەستىقلاندى';

    products.unshift(clone);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.notifyDataChange('products');
    return clone;
  }

  // ==================== تۈرلەر ====================
  getCategories(lang = 'ug') {
    let categories = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (raw) categories = JSON.parse(raw);
    } catch(e) {}

    if (!Array.isArray(categories) || categories.length <= 1 || !categories.some(c => c.id === 'گۈلقەنتلەر')) {
      categories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
      try {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      } catch(e) {}
    }

    return categories.map(c => {
      let displayName = (c.translations && c.translations[lang])
        ? c.translations[lang]
        : (window.appI18n && typeof window.appI18n.getCategoryName === 'function' ? window.appI18n.getCategoryName(c.name) : c.name);
      return { status: 'active', ...c, displayName };
    });
  }

  addCategory(categoryName, icon = 'fas fa-tag', translations = {}) {
    const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
    if (categories.some(c => c.name === categoryName)) return false;
    const newCat = {
      id: categoryName,
      name: categoryName,
      icon: icon,
      status: 'active',
      translations: { ug: categoryName, tr: translations.tr || categoryName, en: translations.en || categoryName }
    };
    categories.push(newCat);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    this.notifyDataChange('categories');
    return true;
  }

  updateCategory(categoryId, updatedData) {
    let categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
    const index = categories.findIndex(c => c.id === categoryId || c.name === categoryId);
    if (index === -1) return false;

    const oldName = categories[index].name;
    const newName = updatedData.name || oldName;

    categories[index] = {
      ...categories[index],
      ...updatedData,
      id: newName,
      name: newName,
      icon: updatedData.icon || categories[index].icon || 'fas fa-tag',
      status: updatedData.status || categories[index].status || 'active',
      translations: {
        ...(categories[index].translations || {}),
        ug: newName,
        tr: (updatedData.translations && updatedData.translations.tr) || (categories[index].translations && categories[index].translations.tr) || newName,
        en: (updatedData.translations && updatedData.translations.en) || (categories[index].translations && categories[index].translations.en) || newName
      }
    };

    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));

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
    let categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
    const index = categories.findIndex(c => c.id === categoryId || c.name === categoryId);
    if (index === -1) return { success: false, message: 'تۈر تېپىلمىدى' };

    const catName = categories[index].name;
    const products = this.getProducts();
    const count = products.filter(p => p.category === catName || p.category === categoryId).length;
    if (count > 0) {
      return { success: false, message: `بۇ تۈردە ${count} دانە تاۋار بار! ئالدى بىلەن تاۋارلارنى باشقا تۈرگە يۆتكەڭ ياكى ئۆچۈرۈڭ.` };
    }

    categories.splice(index, 1);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    this.notifyDataChange('categories');
    return { success: true };
  }

  reorderCategory(categoryId, direction) {
    let categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
    const index = categories.findIndex(c => c.id === categoryId || c.name === categoryId);
    if (index === -1) return false;

    if (direction === 'up' && index > 1) { // 0 is 'all'
      const temp = categories[index];
      categories[index] = categories[index - 1];
      categories[index - 1] = temp;
    } else if (direction === 'down' && index < categories.length - 1 && index > 0) {
      const temp = categories[index];
      categories[index] = categories[index + 1];
      categories[index + 1] = temp;
    } else {
      return false;
    }

    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
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
    if (c.minSpend && subtotal < c.minSpend) {
      return { valid: false, message: `بۇ كۇپون ئەڭ تۆۋەن ₺${c.minSpend} لىك زاكازغا ئىشلىتىلىدۇ!` };
    }
    if (c.usageLimit && c.usedCount >= c.usageLimit) {
      return { valid: false, message: 'بۇ كۇپوننىڭ ئىشلىتىلىش چەكلىمىسى توشتى!' };
    }

    let discount = 0;
    if (c.type === 'percentage') {
      discount = (subtotal * c.value) / 100;
    } else {
      discount = c.value;
    }
    discount = Math.min(discount, subtotal);

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
    const deliveryFeeCny = convertedSubtotal >= threshold || subtotalCny === 0 ? 0 : 15;
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
    const index = list.indexOf(productId);
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

  isInWishlist(productId) {
    return this.getWishlist().includes(productId);
  }

  // ==================== زاكازلار ====================
  getOrders() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
  }

  createOrder(customerData, paymentMethod, notes = '', couponDiscountCny = 0, lang = 'ug') {
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

    const finalTotalCny = Math.max(0, cartData.totalCny - couponDiscountCny);

    const newOrder = {
      id: orderId,
      customer: customerData,
      items: orderItems,
      subtotalCny: cartData.subtotalCny,
      discountCny: couponDiscountCny,
      deliveryFeeCny: cartData.deliveryFeeCny,
      totalCny: finalTotalCny,
      totalFormatted: this.formatPrice(finalTotalCny),
      paymentMethod: paymentMethod,
      status: 'ساقلاۋاتىدۇ',
      date: formattedDate,
      notes: notes,
      language: lang,
      currency: this.currentCurrency
    };

    const lowStockAlerts = [];
    cartData.items.forEach(item => {
      const prod = products.find(p => p.id === item.product.id);
      if (prod) {
        prod.stock -= item.quantity;
        prod.sales = (prod.sales || 0) + item.quantity;
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
      window.TeklimakanSupabase.insertOrder(newOrder);
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
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.notifyDataChange('orders');
      return true;
    }
    return false;
  }

  deleteOrder(orderId) {
    let orders = this.getOrders();
    orders = orders.filter(o => o.id !== orderId);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.notifyDataChange('orders');
    return true;
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
    const order = orders.find(o => o.id === orderId);
    if (order) {
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
      return true;
    }
    return false;
  }

  getSettings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || INITIAL_SETTINGS;
  }

  updateSettings(newSettings) {
    const settings = { ...this.getSettings(), ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    this.notifyDataChange('settings');
    return true;
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

  // ==================== ÙŠØ§Ù‚ØªÛ‡Ø±ØºØ§Ù†Ù„Ø§Ø± ØªÛ•Ù¾Ø³Ù‰Ù„Ø§ØªÙ‰ (Wishlist Detailed) ====================
  getWishlistDetailed(lang = 'ug') {
    const ids = this.getWishlist();
    const products = this.getProducts();
    const detailed = [];
    for (let id of ids) {
      const p = products.find(prod => prod.id === id);
      if (p) {
        let name = p.name;
        let desc = p.description;
        if (p.translations && p.translations[lang]) {
          if (p.translations[lang].name) name = p.translations[lang].name;
          if (p.translations[lang].description) desc = p.translations[lang].description;
        }
        detailed.push({
          ...p,
          displayName: name,
          displayDesc: desc,
          priceFormatted: this.formatPrice(p.price),
          inStock: p.stock > 0
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

  notifyDataChange(type) {
    window.dispatchEvent(new CustomEvent('uyghur_store_sync', { detail: { type } }));
  }
}

window.appStore = new StoreManager();
