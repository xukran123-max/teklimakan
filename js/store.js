
// 🛡️ ساختا تۈر ناملىرىنى (بارلىق تۈرلەر، Tüm Kategoriler قاتارلىقلارنى) سۈزۈپ چىقىرىش ياردەمچىسى
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

// 🔤 ئۇيغۇرچە / تۈركچە / ئىنگلىزچە يېزىقلارنى چىرايلىق SEO Slug (قىسقا ئادرېس) قىلىپ ئايلاندۇرۇش ياردەمچىسى
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
  return out.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\-_\s]/g, '')
    .trim()
    .replace(/[\s\-_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
if (typeof window !== 'undefined') window.transliterateToSlug = transliterateToSlug;
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
  CATEGORIES: 'teklimakan_ecom_categories_v9',
  BRANDS: 'teklimakan_ecom_brands_v4',
  AGENTS: 'teklimakan_ecom_agents_v1',
  REPUTATION_BADGES: 'teklimakan_ecom_reputation_badges_v1',
  CART: 'teklimakan_ecom_cart_v4',
  WISHLIST: 'teklimakan_ecom_wishlist_v4',
  SETTINGS: 'teklimakan_ecom_settings_v4',
  CURRENCY: 'teklimakan_currency_preference',
  SMS_HISTORY: 'teklimakan_ecom_sms_history_v1',
  CUSTOMER_INBOX: 'teklimakan_customer_inbox_v1',
  COUPONS: 'teklimakan_ecom_coupons_v1',
  HERO_SLIDES: 'teklimakan_ecom_hero_slides_v1',
  SHOWCASE_SHELVES: 'teklimakan_ecom_showcase_shelves_v2',
  CHARITY_PAYOUTS: 'teklimakan_charity_payouts_v1'
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

// سۈكۈتتىكى ۋاكالەتچىلەر تىزىملىكى (بارلىق ۋاكالەتچىلەر پەقەت ھەقىقىي تىزىملاتقانلار ۋە بۇلۇتتىن كېلىدۇ)
const INITIAL_AGENTS = [];
const FAKE_DEMO_AGENT_IDS = ['AGT-101', 'AGT-102', 'AGT-103', 'AGT-104'];
const FAKE_DEMO_AGENT_EMAILS = ['alijan@teklimakan.com', 'selim@teklimakan.com', 'meryem@teklimakan.com', 'ablikim@teklimakan.com'];

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
    "id": "PRD-100",
    "brand": "تەكلىماكان شىپا",
    "languageScope": "all",
    "name": "ئەنئەنىۋى نانكېنى (500g)",
    "category": "گۈلقەنت ۋە مۇراببالار",
    "price": 390,
    "oldPrice": 488,
    "stock": 28,
    "sales": 40,
    "rating": 5,
    "ratingCount": 18,
    "featured": true,
    "badge": "شىپالىق لەززەت",
    "image": "images/products/PRD-100.jpg",
    "description": "پىننە ۋە گۈل بەرگىنىڭ كۈچلۈك بىرىكمىسىدىن تەييارلانغان ئەنئەنىۋى نانكېنى.",
    "unit": "500g قاچا",
    "translations": {
      "ug": {
        "name": "ئەنئەنىۋى نانكېنى (500g)",
        "category": "گۈلقەنت ۋە مۇراببالار",
        "description": "پىننە ۋە گۈل بەرگىنىڭ كۈچلۈك بىرىكمىسىدىن تەييارلانغان ئەنئەنىۋى نانكېنى.",
        "unit": "500g قاچا",
        "badge": "شىپالىق لەززەت"
      },
      "tr": {
        "name": "Geleneksel Nanekani (500g)",
        "category": "Gülkand & Reçeller",
        "description": "Ferahlatıcı doğal nane ve gül yapraklarının şifalı birlikteliğiyle hazırlanan kadim geleneksel Nanekani.",
        "unit": "Adet",
        "badge": "Şifalı Lezzet"
      },
      "en": {
        "name": "Traditional Nanekani (500g)",
        "category": "Gulkand & Natural Jams",
        "description": "Ancient traditional Nanekani prepared from aromatic mint and mountain rose petals.",
        "unit": "500g Jar",
        "badge": "Healing Herbal"
      }
    }
  },
  {
    "id": "PRD-103",
    "brand": "تەكلىماكان تورى",
    "languageScope": "all",
    "name": "تۇرپان تەبىئىي يېشىل ئۈزۈمى (500g)",
    "category": "قۇرۇق يەل-يېمىشلەر",
    "price": 320,
    "oldPrice": 400,
    "stock": 150,
    "sales": 580,
    "rating": 5,
    "ratingCount": 18,
    "featured": true,
    "badge": "ساپ تەبىئىي",
    "image": "images/products/PRD-103.jpg",
    "description": "تۇرپان يالقۇن تېغى ئېتىكىدىكى تەبىئىي ئۈزۈملۈكلەردىن ئۈزۈلۈپ، سايىدا قۇرۇتۇلغان نۇقسانسىز يېشىل ئۈزۈم.",
    "unit": "500 گرام خالتا",
    "translations": {
      "ug": {
        "name": "تۇرپان تەبىئىي يېشىل ئۈزۈمى (500g)",
        "category": "قۇرۇق يەل-يېمىشلەر",
        "description": "تۇرپان يالقۇن تېغى ئېتىكىدىكى تەبىئىي ئۈزۈملۈكلەردىن ئۈزۈلۈپ، سايىدا قۇرۇتۇلغان نۇقسانسىز يېشىل ئۈزۈم.",
        "unit": "500 گرام خالتا",
        "badge": "ساپ تەبىئىي"
      },
      "tr": {
        "name": "Doğal Yeşil Kuru Üzüm (500g)",
        "category": "Kuruyemişler",
        "description": "تۇرپان ئۈزۈمچىلىك بازىسىنىڭ شامال كۈپىدە تەبىئىي قۇرۇتۇلغان ساپ يېشىل رەڭلىك، تاتلىق ھەم مېغىزلىق مەھسۇلاتى.",
        "unit": "Adet",
        "badge": "Fırsat Ürünü"
      },
      "en": {
        "name": "Doğal Yeşil Kuru Üzüm (500g)",
        "category": "Kuruyemişler",
        "description": "تۇرپان ئۈزۈمچىلىك بازىسىنىڭ شامال كۈپىدە تەبىئىي قۇرۇتۇلغان ساپ يېشىل رەڭلىك، تاتلىق ھەم مېغىزلىق مەھسۇلاتى.",
        "unit": "Item",
        "badge": ""
      }
    }
  },
  {
    "id": "PRD-113",
    "brand": "تۇرپان يېشىل",
    "languageScope": "all",
    "name": "تەبىئىي قىزىل كىشمىش ئۈزۈم (500g)",
    "category": "قۇرۇق يەل-يېمىشلەر",
    "price": 270,
    "oldPrice": 338,
    "stock": 160,
    "sales": 610,
    "rating": 4.9,
    "ratingCount": 18,
    "featured": false,
    "badge": "تاتلىق نېئمەت",
    "image": "images/products/PRD-113.jpg",
    "description": "شەربەتكە تويۇنغان ئېسىل قىزىل ئۈزۈم قۇرۇقى، تەبىئىي قۇۋۋەت مەنبەسى.",
    "unit": "500 گرام خالتا",
    "translations": {
      "ug": {
        "name": "تەبىئىي قىزىل كىشمىش ئۈزۈم (500g)",
        "category": "قۇرۇق يەل-يېمىشلەر",
        "description": "شەربەتكە تويۇنغان ئېسىل قىزىل ئۈزۈم قۇرۇقى، تەبىئىي قۇۋۋەت مەنبەسى.",
        "unit": "500 گرام خالتا",
        "badge": "تاتلىق نېئمەت"
      },
      "tr": {
        "name": "Kırmızı Kuru Üzüm (500g)",
        "category": "Kuruyemişler",
        "description": "تەبىئىي ئاپتاپتا قۇرۇتۇلغان، تەركىبىدە تۆمۈر ۋە مىنېرال ماددىلار مول بولغان ئالىي سۈپەتلىك تاتلىق قىزىل كىشمىش ئۈزۈم مەھسۇلاتى.",
        "unit": "Adet",
        "badge": "Fırsat Ürünü"
      },
      "en": {
        "name": "Kırmızı Kuru Üzüm (500g)",
        "category": "Kuruyemişler",
        "description": "تەبىئىي ئاپتاپتا قۇرۇتۇلغان، تەركىبىدە تۆمۈر ۋە مىنېرال ماددىلار مول بولغان ئالىي سۈپەتلىك تاتلىق قىزىل كىشمىش ئۈزۈم مەھسۇلاتى.",
        "unit": "Item",
        "badge": ""
      }
    }
  },
  {
    "id": "PRD-114",
    "brand": "تەكلىماكان كىلاسسىك",
    "languageScope": "all",
    "name": "خۇشپۇراق تەبىئىي قەلەمپۇر (100g)",
    "category": "ئۆسۈملۈك دورىلار",
    "price": 220,
    "oldPrice": 275,
    "stock": 80,
    "sales": 240,
    "rating": 5,
    "ratingCount": 18,
    "featured": true,
    "badge": "تەۋسىيە",
    "image": "images/products/PRD-114.jpg",
    "description": "خۇش پۇراقلىق، ئىرى دانىلىك، ساپ ۋە تەبىئىي دانە قەلەمپۇر.",
    "unit": "100 گرام خالتا",
    "translations": {
      "ug": {
        "name": "خۇشپۇراق تەبىئىي قەلەمپۇر (100g)",
        "category": "ئۆسۈملۈك دورىلار",
        "description": "خۇش پۇراقلىق، ئىرى دانىلىك، ساپ ۋە تەبىئىي دانە قەلەمپۇر.",
        "unit": "100 گرام خالتا",
        "badge": "تەۋسىيە"
      },
      "tr": {
        "name": "Doğal Tane Karanfil (100g)",
        "category": "Şifalı Bitkiler & Çaylar",
        "description": "خوتەن دەريا بويىنىڭ خۇشپۇراق ئەتىرگۈل غۇنچىلىرىدىن قۇرۇتۇلغان، تىنچلاندۇرۇش ۋە گۈزەللىككە پايدىلىق ئالىي چاي.",
        "unit": "Adet",
        "badge": "Tavsiye"
      },
      "en": {
        "name": "Doğal Tane Karanfil (100g)",
        "category": "Şifalı Bitkiler & Çaylar",
        "description": "خوتەن دەريا بويىنىڭ خۇشپۇراق ئەتىرگۈل غۇنچىلىرىدىن قۇرۇتۇلغان، تىنچلاندۇرۇش ۋە گۈزەللىككە پايدىلىق ئالىي چاي.",
        "unit": "Item",
        "badge": ""
      }
    }
  },
  {
    "id": "PRD-119",
    "brand": "تەكلىماكان تەبىئىي",
    "languageScope": "all",
    "name": "ئەنئەنىۋى گۈلكەنى - گۈلقەنتى (500g)",
    "category": "گۈلقەنت ۋە مۇراببالار",
    "price": 380,
    "oldPrice": 475,
    "stock": 40,
    "sales": 55,
    "rating": 5,
    "ratingCount": 18,
    "featured": true,
    "badge": "قۇياش پىشقى",
    "image": "images/products/PRD-119.jpg",
    "description": "خوتەن داغ قىزىلگۈلىنىڭ يېڭى پىشقان ساپ بەرگىلىرى ۋە تەبىئىي تاغ ھەسىلى بىلەن 2500 يىللىق ئەنئەنىۋى رېتسىپ ئاساسىدا قۇياش نۇرىدا 40 كۈن ئاستا پىشۇرۇلغان شىپالىق تەبىئىي گۈلكەنى ۋە گۈلقەنت. ئاشقازان ئوتىنى پەسەيتىپ، ھەزىمنى ياخشىلايدۇ ۋە جىسمانىي كۈچ-قۇۋۋەتنى ئاشۇرىدۇ.",
    "unit": "500g قاچا",
    "translations": {
      "ug": {
        "name": "ئەنئەنىۋى گۈلكەنى - گۈلقەنتى (500g)",
        "category": "گۈلقەنت ۋە مۇراببالار",
        "description": "خوتەن داغ قىزىلگۈلىنىڭ يېڭى پىشقان ساپ بەرگىلىرى ۋە تەبىئىي تاغ ھەسىلى بىلەن 2500 يىللىق ئەنئەنىۋى رېتسىپ ئاساسىدا قۇياش نۇرىدا 40 كۈن ئاستا پىشۇرۇلغان شىپالىق تەبىئىي گۈلكەنى ۋە گۈلقەنت. ئاشقازان ئوتىنى پەسەيتىپ، ھەزىمنى ياخشىلايدۇ ۋە جىسمانىي كۈچ-قۇۋۋەتنى ئاشۇرىدۇ.",
        "unit": "500g قاچا",
        "badge": "قۇياش پىشقى"
      },
      "tr": {
        "name": "Geleneksel Gülkani & Gülkand (500g)",
        "category": "Gülkand & Reçeller",
        "description": "Doğal Hotan dağ güllerinin taze taç yapraklarından, saf dağ balı ile geleneksel 2500 yıllık yöntemle güneşte 40 gün olgunlaştırılarak hazırlanan katkısız, şifalı Gülkani & Gülkand (Gülbeşeker). Mide hararetini dengeler, sindirimi rahatlatır ve vücuda doğal zindelik kazandırır.",
        "unit": "Adet",
        "badge": "Güneşte Pişen"
      },
      "en": {
        "name": "Traditional Sun-Cured Damask Rose Preserve - Gülkani & Gülkand (500g)",
        "category": "Gulkand & Natural Jams",
        "description": "Authentic sun-cured Damask rose preserve (Gülkani & Gülkand 500g). Prepared with wild mountain rose petals and pure honey using traditional 2500-year-old herbal recipes.",
        "unit": "500g Jar",
        "badge": "Sun-Cured"
      }
    }
  },
  {
    "id": "PRD-120",
    "brand": "تەكلىماكان تورى",
    "languageScope": "all",
    "name": "ساپ سىقىلغان زەيتۇن مېيى (500ml)",
    "category": "تەبىئىي ياغلار",
    "price": 420,
    "oldPrice": 525,
    "stock": 450,
    "sales": 38,
    "rating": 5,
    "ratingCount": 18,
    "featured": true,
    "badge": "ئەلا سۈپەت",
    "image": "images/products/PRD-120.jpg",
    "description": "دەسلەپكى سوغۇق سىقىش بىلەن ئېلىنغان %100 ساپ ۋە سۈزۈك ئاشپەزلىك ۋە شىپالىق زەيتۇن مېيى.",
    "unit": "500ml بوتۇلكا",
    "translations": {
      "ug": {
        "name": "ساپ سىقىلغان زەيتۇن مېيى (500ml)",
        "category": "تەبىئىي ياغلار",
        "description": "دەسلەپكى سوغۇق سىقىش بىلەن ئېلىنغان %100 ساپ ۋە سۈزۈك ئاشپەزلىك ۋە شىپالىق زەيتۇن مېيى.",
        "unit": "500ml بوتۇلكا",
        "badge": "ئەلا سۈپەت"
      },
      "tr": {
        "name": "Saf Sızma Zeytinyağı (500ml)",
        "category": "Doğal & Şifalı Yağlar",
        "description": "ساپ قارا تىرىك (قارا ئۇرۇق) ئۇرۇقىدىن سوغۇق پىرىسلاپ ئېلىنغان بىرىنچى قول تېبابەت مېيى. بەدەن كۈچىنى ئاشۇرىدۇ.",
        "unit": "Adet",
        "badge": "Tavsiye"
      },
      "en": {
        "name": "Saf Sızma Zeytinyağı (500ml)",
        "category": "Doğal & Şifalı Yağlar",
        "description": "ساپ قارا تىرىك (قارا ئۇرۇق) ئۇرۇقىدىن سوغۇق پىرىسلاپ ئېلىنغان بىرىنچى قول تېبابەت مېيى. بەدەن كۈچىنى ئاشۇرىدۇ.",
        "unit": "Item",
        "badge": ""
      }
    }
  },
  {
    "id": "PRD-121",
    "brand": "تەكلىماكان تورى",
    "languageScope": "all",
    "name": "ئۇيغۇر تېبابەت قامۇسى",
    "category": "كىتاب ۋە مەدەنىيەت",
    "price": 850,
    "oldPrice": 1063,
    "stock": 20,
    "sales": 15,
    "rating": 4.9,
    "ratingCount": 18,
    "featured": false,
    "badge": "مەدەنىيەت مىراسى",
    "image": "images/products/PRD-121.jpg",
    "description": "ئۇيغۇر مىللىي تېبابىتىنىڭ مىڭ يىللىق تەجرىبىلىرى ۋە شىپالىق رېتسىپلىرى جەملەنگەن نوپۇزلۇق قامۇس.",
    "unit": "توم",
    "translations": {
      "ug": {
        "name": "ئۇيغۇر تېبابەت قامۇسى",
        "category": "كىتاب ۋە مەدەنىيەت",
        "description": "ئۇيغۇر مىللىي تېبابىتىنىڭ مىڭ يىللىق تەجرىبىلىرى ۋە شىپالىق رېتسىپلىرى جەملەنگەن نوپۇزلۇق قامۇس.",
        "unit": "توم",
        "badge": "مەدەنىيەت مىراسى"
      },
      "tr": {
        "name": "Uygur Tıbbı Ansiklopedisi",
        "category": "Kitap & Kültür",
        "description": "ئەجدادلاردىن مىراس قالغان ئۇيغۇر مىللىي تېبابەت رېتسىپلىرى، ئۆسۈملۈك ۋە مىجەز ئىلمىنى ئۆز ئىچىگە ئالغان نوپۇزلۇق توپلام.",
        "unit": "Adet",
        "badge": "Kültür Mirası"
      },
      "en": {
        "name": "Uygur Tıbbı Ansiklopedisi",
        "category": "Kitap & Kültür",
        "description": "ئەجدادلاردىن مىراس قالغان ئۇيغۇر مىللىي تېبابەت رېتسىپلىرى، ئۆسۈملۈك ۋە مىجەز ئىلمىنى ئۆز ئىچىگە ئالغان نوپۇزلۇق توپلام.",
        "unit": "Item",
        "badge": ""
      }
    }
  },
  {
    "id": "PRD-125",
    "brand": "تەكلىماكان تورى",
    "languageScope": "all",
    "name": "تەبىئىي شىپالىق چىلان (500g)",
    "category": "ئۆسۈملۈك دورىلار",
    "price": 240,
    "oldPrice": 300,
    "stock": 80,
    "sales": 95,
    "rating": 4.9,
    "ratingCount": 18,
    "featured": false,
    "badge": "شىپالىق مېۋە",
    "image": "images/products/PRD-125.jpg",
    "description": "ئېمۇنىتېتنى كۈچەيتىدىغان، ۋىتامىنغا باي تەبىئىي قۇرۇتۇلغان كىچىك شىپالىق چىلان (500g).",
    "unit": "500g بولاق",
    "translations": {
      "ug": {
        "name": "تەبىئىي شىپالىق چىلان (500g)",
        "category": "ئۆسۈملۈك دورىلار",
        "description": "ئېمۇنىتېتنى كۈچەيتىدىغان، ۋىتامىنغا باي تەبىئىي قۇرۇتۇلغان كىچىك شىپالىق چىلان (500g).",
        "unit": "500g بولاق",
        "badge": "شىپالىق مېۋە"
      },
      "tr": {
        "name": "Doğal Şifalı Hünnap (500g)",
        "category": "Şifalı Bitkiler & Çaylar",
        "description": "قۇياش نۇرىدا تەبىئىي قۇرۇتۇلغان،  دانىلىق،  يۇمشاق ۋە شېرىن تىببىي چىلىنى.",
        "unit": "Adet",
        "badge": "Şifalı Meyve"
      },
      "en": {
        "name": "Natural Healing Jujube (500g)",
        "category": "Medicinal Herbs & Teas",
        "description": "Sun-dried natural healing jujube dates rich in vitamins and immune-boosting nutrients (500g).",
        "unit": "Pack (500g)",
        "badge": "Healing Fruit"
      }
    }
  },
  {
    "id": "PRD-128",
    "brand": "تەكلىماكان تورى",
    "languageScope": "all",
    "name": "ئەنئەنىۋى كاۋاپ تېتىتقۇ يۈرۈشلۈكى (250g)",
    "category": "قۇرۇق يەل-يېمىشلەر",
    "price": 260,
    "oldPrice": 325,
    "stock": 75,
    "sales": 88,
    "rating": 5,
    "ratingCount": 18,
    "featured": false,
    "badge": "ئالاھىدە تەم",
    "image": "images/products/PRD-128.jpg",
    "description": "ئۇيغۇر كىلاسسىك كاۋاپ ۋە گۆش تائاملىرى ئۈچۈن مەخسۇس ئارىلاشتۇرۇلغان تەبىئىي پۇراقلىق تېتىتقۇلار.",
    "unit": "250 گرام قۇتا",
    "translations": {
      "ug": {
        "name": "ئەنئەنىۋى كاۋاپ تېتىتقۇ يۈرۈشلۈكى (250g)",
        "category": "قۇرۇق يەل-يېمىشلەر",
        "description": "ئۇيغۇر كىلاسسىك كاۋاپ ۋە گۆش تائاملىرى ئۈچۈن مەخسۇس ئارىلاشتۇرۇلغان تەبىئىي پۇراقلىق تېتىتقۇلار.",
        "unit": "250 گرام قۇتا",
        "badge": "ئالاھىدە تەم"
      },
      "tr": {
        "name": "Geleneksel Kebap Baharat Seti (250g)",
        "category": "Kuruyemişler",
        "description": "ساپ زىرە، لازا، قارىمۇچ ۋە مەخسۇس ئۆسۈملۈك گۈل ئۇرۇقلىرى يانجىلغان ئەسلى ئۇيغۇرچە كاۋاپ دورا تېتىتقۇسى.",
        "unit": "Adet",
        "badge": "Tavsiye"
      },
      "en": {
        "name": "Geleneksel Kebap Baharat Seti (250g)",
        "category": "Kuruyemişler",
        "description": "ساپ زىرە، لازا، قارىمۇچ ۋە مەخسۇس ئۆسۈملۈك گۈل ئۇرۇقلىرى يانجىلغان ئەسلى ئۇيغۇرچە كاۋاپ دورا تېتىتقۇسى.",
        "unit": "Item",
        "badge": ""
      }
    }
  },
  {
    "id": "PRD-131",
    "brand": "تەكلىماكان تورى",
    "languageScope": "all",
    "name": "ساپ تەبىئىي پىلە غوزىسى (30 دانە)",
    "category": "ئۇيغۇر تىبابىتى",
    "price": 190,
    "oldPrice": 238,
    "stock": 40,
    "sales": 65,
    "rating": 4.9,
    "ratingCount": 18,
    "featured": true,
    "badge": "تەبىئىي گۈزەللىك",
    "image": "images/products/PRD-131.jpg",
    "description": "تەبىئىي يىپەك پىلە غوزىسى، تېرىنى چوڭقۇر تازىلاش، ئاقارتىش ۋە كوللاگېننى ئاشۇرۇش ئۈچۈن قەدىمىي تەبىئىي چارە.",
    "unit": "30 دانە قۇتا",
    "translations": {
      "ug": {
        "name": "ساپ تەبىئىي پىلە غوزىسى (30 دانە)",
        "category": "ئۇيغۇر تىبابىتى",
        "description": "تەبىئىي يىپەك پىلە غوزىسى، تېرىنى چوڭقۇر تازىلاش، ئاقارتىش ۋە كوللاگېننى ئاشۇرۇش ئۈچۈن قەدىمىي تەبىئىي چارە.",
        "unit": "30 دانە قۇتا",
        "badge": "تەبىئىي گۈزەللىك"
      },
      "tr": {
        "name": "Saf Doğal İpek Kozası (30 Adet)",
        "category": "Uygur Tıbbı Mirası",
        "description": "يۈرەك ۋە مېڭىگە پايدىلىق",
        "unit": "Adet",
        "badge": "Doğal Bakım"
      },
      "en": {
        "name": "Saf Doğal İpek Kozası (30 Adet)",
        "category": "Uygur Tıbbı Mirası",
        "description": "يۈرەك ۋە مېڭىگە پايدىلىق",
        "unit": "Item",
        "badge": ""
      }
    }
  },
  {
    "id": "PRD-132",
    "brand": "تەكلىماكان تورى",
    "languageScope": "all",
    "name": "ئۆسۈملۈك چاچ ئاسراش يۈرۈشلۈكى",
    "category": "گۈزەللىك ۋە ساغلاملىق",
    "price": 650,
    "oldPrice": 813,
    "stock": 35,
    "sales": 48,
    "rating": 5,
    "ratingCount": 18,
    "featured": true,
    "badge": "گۈزەللىك سىرى",
    "image": "images/products/PRD-132.jpg",
    "description": "ئوسما، ياڭاق پوستى ۋە شىپالىق ئۆسۈملۈك جەۋھەرلىرىدىن تەييارلانغان چاچ يىلتىزىنى چىڭىتىش يۈرۈشلۈكى.",
    "unit": "يۈرۈشلۈك",
    "translations": {
      "ug": {
        "name": "ئۆسۈملۈك چاچ ئاسراش يۈرۈشلۈكى",
        "category": "گۈزەللىك ۋە ساغلاملىق",
        "description": "ئوسما، ياڭاق پوستى ۋە شىپالىق ئۆسۈملۈك جەۋھەرلىرىدىن تەييارلانغان چاچ يىلتىزىنى چىڭىتىش يۈرۈشلۈكى.",
        "unit": "يۈرۈشلۈك",
        "badge": "گۈزەللىك سىرى"
      },
      "tr": {
        "name": "Bitkisel Saç Bakım Seti",
        "category": "Doğal Bakım & Güzellik",
        "description": "چاچ ئاسراش ۋە قۇۋۋەتلەش",
        "unit": "Adet",
        "badge": "Özel Seçim"
      },
      "en": {
        "name": "Bitkisel Saç Bakım Seti",
        "category": "Doğal Bakım & Güzellik",
        "description": "چاچ ئاسراش ۋە قۇۋۋەتلەش",
        "unit": "Item",
        "badge": ""
      }
    }
  },
  {
    "id": "PRD-218",
    "brand": "تەكلىماكان تورى",
    "languageScope": "all",
    "name": "زاراڭزا چېچىكى",
    "category": "ئۆسۈملۈك دورىلار",
    "price": 200,
    "oldPrice": 250,
    "stock": 300,
    "sales": 0,
    "rating": 5,
    "ratingCount": 18,
    "featured": false,
    "badge": "تەبىئىي چېچەك",
    "image": "images/products/zarangza-chechiki.jpg",
    "description": "قان ئايلىنىشنى جانلاندۇرۇش ۋە توسالغۇلارنى ئېچىش، قاننى سۇيۇلدۇرۇپ، قان تومۇرلاردىكى ئۇيۇشۇپ قالغان ماددىلارنى تارقىتىدۇ.",
    "unit": "100 گرام",
    "translations": {
      "ug": {
        "name": "زاراڭزا چېچىكى",
        "category": "ئۆسۈملۈك دورىلار",
        "description": "قان ئايلىنىشنى جانلاندۇرۇش ۋە توسالغۇلارنى ئېچىش، قاننى سۇيۇلدۇرۇپ، قان تومۇرلاردىكى ئۇيۇشۇپ قالغان ماددىلارنى تارقىتىدۇ.",
        "unit": "100 گرام",
        "badge": "تەبىئىي چېچەك"
      },
      "tr": {
        "name": "Şifalı Aspir Çiçeği",
        "category": "Şifalı Bitkiler & Çaylar",
        "description": "قان ئايلىنىشنى جانلاندۇرۇش ۋە توسالغۇلارنى ئېچىش، قاننى سۇيۇلدۇرۇپ، قان تومۇرلاردىكى ئۇيۇشۇپ قالغان ماددىلارنى تارقىتىدۇ، جىگەر ۋە تالدىكى توسالغۇلارنى راۋانلاشتۇرىدۇ.\nھەيىز ۋە سۈيدۈكنى راۋان قىلىش: ئاياللاردىكى ھەيىز تۇتۇلۇش، ھەيىزنىڭ تولا ئاغرىتىپ كېلىشى، \nبەدەندىكى ئارتۇقچە ھۆللۈك ۋە يەللەرنى ھەيدەيدۇ، بەلغەمنى بوشىتىدۇ.",
        "unit": "Adet",
        "badge": ""
      },
      "en": {
        "name": "Herbal Safflower Petals",
        "category": "Herbal Medicines",
        "description": "Invigorates blood circulation, supports cardiovascular health and relieves systemic inflammation naturally.",
        "unit": "100g Pack",
        "badge": "Pure Botanical"
      }
    }
  },
  {
    "id": "PRD-225",
    "brand": "تەكلىماكان تورى",
    "languageScope": "all",
    "name": "تۇخۇم سېرىقى يېغى (25ml)",
    "category": "تەبىئىي ياغلار",
    "price": 250,
    "oldPrice": 313,
    "stock": 50,
    "sales": 18,
    "rating": 5,
    "ratingCount": 18,
    "featured": true,
    "badge": "ساپ ۋە تەبىئىي",
    "image": "images/products/tuxum-yeghi.webp",
    "description": "ئەنئەنىۋى ساپ تۇخۇم سېرىقى يېغى (25ml تامچىلىق قۇتىدا). چاچ يىلتىزىنى كۈچلەندۈرۈپ، چاچ چۈشۈشنى توختىتىش، تېرە كۆيۈكى ۋە جاراھەتلەرنى ئەسلىگە كەلتۈرۈشكە تەبىئىي شىپا.",
    "unit": "25ml قۇتا",
    "translations": {
      "ug": {
        "name": "تۇخۇم سېرىقى يېغى (25ml)",
        "category": "تەبىئىي ياغلار",
        "description": "ئەنئەنىۋى ساپ تۇخۇم سېرىقى يېغى (25ml تامچىلىق قۇتىدا). چاچ يىلتىزىنى كۈچلەندۈرۈپ، چاچ چۈشۈشنى توختىتىش، تېرە كۆيۈكى ۋە جاراھەتلەرنى ئەسلىگە كەلتۈرۈشكە تەبىئىي شىپا.",
        "unit": "25ml قۇتا",
        "badge": "ساپ ۋە تەبىئىي"
      },
      "tr": {
        "name": "Yumurta Sarısı Yağı (25ml)",
        "category": "Doğal & Şifalı Yağlar",
        "description": "ئەنئەنىۋى ساپ تۇخۇم سېرىقى يېغى (25ml تامچىلىق قۇتىدا). چاچ يىلتىزىنى كۈچلەندۈرۈپ، چاچ چۈشۈشنى توختىتىش، تېرە كۆيۈكى ۋە جاراھەتلەرنى ئەسلىگە كەلتۈرۈشكە تەبىئىي شىپا.",
        "unit": "Adet",
        "badge": "Saf & Doğal"
      },
      "en": {
        "name": "Egg Yolk Oil (25ml)",
        "category": "Natural & Therapeutic Oils",
        "description": "Traditional pure egg yolk oil (25ml dropper bottle). Deeply nourishes hair follicles, prevents loss, and accelerates skin and wound regeneration.",
        "unit": "25ml Bottle",
        "badge": "Pure & Natural"
      }
    }
  },
  {
    "id": "PRD-226",
    "brand": "تەكلىماكان تورى",
    "languageScope": "all",
    "name": "كۆز ئاسراش مەجۈنى (250g)",
    "category": "پىششىق دورىلار",
    "price": 280,
    "oldPrice": 350,
    "stock": 100,
    "sales": 42,
    "rating": 5,
    "ratingCount": 18,
    "featured": true,
    "badge": "ئالاھىدە رېتسېپ",
    "image": "images/products/koz_asrash_mejuni.webp",
    "description": "ئۇيغۇر مىللىي تېبابىتىنىڭ ئەنئەنىۋى رېتسېپى بويىچە ساپ تاغ ھەسىلى، زەپە، كۆز ئوتى، كۆك بۆلجۈرگەن ۋە بۆرە مېۋىسى قاتارلىق ئەتىۋارلىق ئۆسۈملۈكلەردىن ئالاھىدە پىششىقلاپ ئىشلەنگەن. تېلېفون ۋە كومپيۇتېر نۇرىدىن كۆز قۇرغاقلىشىش، چارچاش ۋە تۇتۇقلىشىشنى تۈگىتىپ، كۆرۈش قۇۋۋىتى ۋە كۆز قان ئايلىنىشىنى ياخشىلايدۇ. %100 تە��ىئىي، ساپ مەھسۇلات.",
    "unit": "250g قۇتا",
    "translations": {
      "ug": {
        "name": "كۆز ئاسراش مەجۈنى (250g)",
        "category": "پىششىق دورىلار",
        "description": "ئۇيغۇر مىللىي تېبابىتىنىڭ ئەنئەنىۋى رېتسېپى بويىچە ساپ تاغ ھەسىلى، زەپە، كۆز ئوتى، كۆك بۆلجۈرگەن ۋە بۆرە مېۋىسى قاتارلىق ئەتىۋارلىق ئۆسۈملۈكلەردىن ئالاھىدە پىششىقلاپ ئىشلەنگەن. تېلېفون ۋە كومپيۇتېر نۇرىدىن كۆز قۇرغاقلىشىش، چارچاش ۋە تۇتۇقلىشىشنى تۈگىتىپ، كۆرۈش قۇۋۋىتى ۋە كۆز قان ئايلىنىشىنى ياخشىلايدۇ. %100 تە��ىئىي، ساپ مەھسۇلات.",
        "unit": "250g قۇتا",
        "badge": "ئالاھىدە رېتسېپ"
      },
      "tr": {
        "name": "Göz Bakım Macunu (250g)",
        "category": "Geleneksel Şifa Ürünleri",
        "description": "ئۇيغۇر مىللىي تېبابىتىنىڭ ئەنئەنىۋى رېتسېپى بويىچە تەبىئىي تاغ ھەسىلى، زەپە، گۈلسامساق ۋە ئەبرىشەم كۈلى قاتارلىق ئەتىۋارلىق ئۆسۈملۈكلەردىن ئالاھىدە پىششىقلاپ ئىشلەنگەن. كۆز قۇرغاقلىشىش، چارچاش، تېلېفون ۋە كومپيۇتېر نۇرىدىن كۆز سېزىمى تۆۋەنلەشنى تۈگىتىدۇ؛ كۆرۈش قۇۋۋىتىنى ئاشۇرۇپ، كۆز نېرۋىلىرى ۋە قان ئايلىنىشنى ياخشىلايدۇ. %100 تەبىئىي، كونسېرۋانتسىز ساپ مەھسۇلات.",
        "unit": "Adet",
        "badge": "Özel Formül"
      },
      "en": {
        "name": "Herbal Eye Care Paste (250g)",
        "category": "Traditional Remedies",
        "description": "Formulated with pure mountain honey, saffron, eyebright, wild bilberry, and wolfberry extracts based on traditional botanical wisdom. Relieves digital eye strain, dryness, and fatigue while supporting visual clarity and microcirculation. 100% natural, additive-free.",
        "unit": "250g Jar",
        "badge": "Special Formula"
      }
    }
  },
  {
    "id": "PRD-227",
    "brand": "تەكلىماكان شىپا",
    "languageScope": "all",
    "name": "زېھىن مەجۇنى (100g)",
    "category": "ئۇيغۇر تىبابىتى",
    "price": 190,
    "oldPrice": 238,
    "stock": 50,
    "sales": 18,
    "rating": 5,
    "ratingCount": 18,
    "featured": true,
    "badge": "ئالاھىدە رېتسىپ",
    "image": "images/products/zihin_macunu.webp",
    "description": "ئەنئەنىۋى يىپەك يولى تېبابەت رېتسىپى بويىچە مېڭە ھۈجەيرىلىرىنى قۇۋۋەتلەش، زېھىننى ئېچىش، ئەستە تۇتۇش قابىلىيىتىنى كۈچەيتىش ۋە تەپەككۇرنى جانلاندۇرۇش ئۈچۈن تەييارلانغان ساپ تەبىئىي مەجۇن (100g).",
    "unit": "100g قاچا",
    "translations": {
      "ug": {
        "name": "زېھىن مەجۇنى (100g)",
        "category": "ئۇيغۇر تىبابىتى",
        "description": "ئەنئەنىۋى يىپەك يولى تېبابەت رېتسىپى بويىچە مېڭە ھۈجەيرىلىرىنى قۇۋۋەتلەش، زېھىننى ئېچىش، ئەستە تۇتۇش قابىلىيىتىنى كۈچەيتىش ۋە تەپەككۇرنى جانلاندۇرۇش ئۈچۈن تەييارلانغان ساپ تەبىئىي مەجۇن (100g).",
        "unit": "100g قاچا",
        "badge": "ئالاھىدە رېتسىپ"
      },
      "tr": {
        "name": "Zihin Macunu (100g)",
        "category": "Geleneksel Şifa Ürünleri",
        "description": "ئەنئەنىۋى يىپەك يولى تېبابەت رېتسىپى بويىچە مېڭە ھۈجەيرىلىرىنى قۇۋۋەتلەش، زېھىننى ئېچىش، ئەستە تۇتۇش قابىلىيىتىنى كۈچەيتىش ۋە تەپەككۇرنى جانلاندۇرۇش ئۈچۈن تەييارلانغان ساپ تەبىئىي مەجۇن (100g).",
        "unit": "Adet",
        "badge": "Özel Formül"
      },
      "en": {
        "name": "Herbal Memory Paste (100g)",
        "category": "Traditional Herbal Remedies",
        "description": "Traditional Silk Road herbal remedy formulated to enhance cognitive function, mental clarity, and focus (100g). Prepared with premium organic botanical extracts.",
        "unit": "100g Jar",
        "badge": "Special Formula"
      }
    }
  },
  {
    "id": "PRD-228",
    "brand": "تەكلىماكان شىپا",
    "languageScope": "all",
    "name": "قۇۋۋەت مەجۇنى (100g)",
    "category": "ئۇيغۇر تىبابىتى",
    "price": 500,
    "oldPrice": 625,
    "stock": 45,
    "sales": 22,
    "rating": 5,
    "ratingCount": 18,
    "featured": true,
    "badge": "ئالاھىدە رېتسىپ",
    "image": "images/products/kuvvet_macunu.webp",
    "description": "ئەنئەنىۋى كىلاسسىك رېتسىپ بويىچە ساپ تاغ ھەسىلى ۋە ئالىي قۇۋۋەت ئۇرۇقلىرى بىلەن تەييارلانغان، بەل-بۆرەك قۇۋۋىتى ۋە جىسمانىي ھاياتى كۈچنى ئاشۇرغۇچى تەبىئىي قۇۋۋەت مەجۇنى (100g).",
    "unit": "100g قاچا",
    "translations": {
      "ug": {
        "name": "قۇۋۋەت مەجۇنى (100g)",
        "category": "ئۇيغۇر تىبابىتى",
        "description": "ئەنئەنىۋى كىلاسسىك رېتسىپ بويىچە ساپ تاغ ھەسىلى ۋە ئالىي قۇۋۋەت ئۇرۇقلىرى بىلەن تەييارلانغان، بەل-بۆرەك قۇۋۋىتى ۋە جىسمانىي ھاياتى كۈچنى ئاشۇرغۇچى تەبىئىي قۇۋۋەت مەجۇنى (100g).",
        "unit": "100g قاچا",
        "badge": "ئالاھىدە رېتسىپ"
      },
      "tr": {
        "name": "Kuvvet Macunu (100g)",
        "category": "Uygur Tıbbı Mirası",
        "description": "ئەنئەنىۋى كىلاسسىك رېتسىپ بويىچە ساپ تاغ ھەسىلى ۋە ئالىي قۇۋۋەت ئۇرۇقلىرى بىلەن تەييارلانغ��ن، بەل-بۆرەك قۇۋۋىتى ۋە جىسمانىي ھاياتى كۈچنى ئاشۇرغۇچى تەبىئىي قۇۋۋەت مەجۇنى (100g).",
        "unit": "Adet",
        "badge": "Özel Formül"
      },
      "en": {
        "name": "Herbal Vitality Paste (100g)",
        "category": "Uyghur Medicine Heritage",
        "description": "Traditional Silk Road herbal vitality remedy formulated with pure mountain honey and precious botanical extracts to support stamina, vigor, and physical wellness (100g).",
        "unit": "100g Jar",
        "badge": "Special Formula"
      }
    }
  },
  {
    "id": "PRD-292",
    "brand": "تەكلىماكان تورى",
    "languageScope": "all",
    "name": "ساپ ھىندى يېغى (25ml)",
    "category": "ئۇيغۇر تېبابىتى مىراسى",
    "price": 310,
    "oldPrice": 388,
    "stock": 100,
    "sales": 0,
    "rating": 5,
    "ratingCount": 18,
    "featured": false,
    "badge": "%100 ساپ",
    "image": "images/products/PRD-292.jpg",
    "description": "ئەنئەنىۋى سوغۇق پىرىسلانغان ساپ ئابدىمىلىك (ھىندى) يېغى (25ml ئەينەك قۇتىدا). تېرە، چاچ ۋە بوغۇم ئاسراشقا پايدىلىق.",
    "unit": "25ml قۇتا",
    "translations": {
      "ug": {
        "name": "ساپ ھىندى يېغى (25ml)",
        "category": "ئۇيغۇر تېبابىتى مىراسى",
        "description": "ئەنئەنىۋى سوغۇق پىرىسلانغان ساپ ئابدىمىلىك (ھىندى) يېغى (25ml ئەينەك قۇتىدا). تېرە، چاچ ۋە بوغۇم ئاسراشقا پايدىلىق.",
        "unit": "25ml قۇتا",
        "badge": "%100 ساپ"
      },
      "tr": {
        "name": "Saf Hint Yağı (25ml)",
        "category": "Uygur Tıbbı Mirası",
        "description": "چاچ يىلتىزىنى ئوزۇقلاندۇرۇپ، تۆكۈلۈشنىڭ ئالدىنى ئالىدۇ، چاچنى تېز ھەم قېلىن ئۆستۈرىدۇ.\n شالاڭلاشقان قاش ۋە تۈكۈلۈۋاتقان كىرپىكلەرنى تېز سۈرئەتتە زىچ، ئۇزۇن ۋە توم قىلىپ چىقىرىدۇ. قۇرغاق، يېرىلغان تېرىلەرنى ئەسلىگە كەلتۈرۈپ، تېرىنىڭ ئېلاستىكىلىقىنى ئاشۇرىدۇ ۋە قورۇق چۈشۈشنى كېچىكتۈرىدۇ. باكتېرىيەگە قارشى ئۈنۈمى يۇقىرى.",
        "unit": "Adet",
        "badge": "%100 Saf"
      },
      "en": {
        "name": "Pure Castor Oil (25ml)",
        "category": "Uyghur Medicine Heritage",
        "description": "Traditional cold-pressed pure castor oil (25ml glass bottle). Used for centuries for deep hair, skin, and joint nourishment.",
        "unit": "25ml Bottle",
        "badge": "100% Pure"
      }
    }
  },
  {
    "id": "PRD-325",
    "brand": "تەكلىماكان تەبىئىي",
    "languageScope": "all",
    "name": "ئەنئەنىۋى گۈلكەنى - گۈلقەنتى (1kg)",
    "category": "گۈلقەنت ۋە مۇراببالار",
    "price": 900,
    "oldPrice": 1125,
    "stock": 100,
    "sales": 15,
    "rating": 5,
    "ratingCount": 18,
    "featured": true,
    "badge": "قۇياش پىشقى",
    "image": "images/products/PRD-325.jpg",
    "description": "ئۇيغۇر مىللىي تې��ابىتىنىڭ 2500 يىللىق ئەنئەنىۋى مىراس رېتسېپى بويىچە ساپ تاغ ھەسىلى ۋە ئەتىرگۈل بەرگىلىرى بىلەن قۇياشتا تەييارلانغان ساپ گۈلكەنى ۋە گۈلقەنت (1 كىلوگرام قاچا).",
    "unit": "1 كىلو قاچا",
    "translations": {
      "ug": {
        "name": "ئەنئەنىۋى گۈلكەنى - گۈلقەنتى (1kg)",
        "category": "گۈلقەنت ۋە مۇراببالار",
        "description": "ئۇيغۇر مىللىي تې��ابىتىنىڭ 2500 يىللىق ئەنئەنىۋى مىراس رېتسېپى بويىچە ساپ تاغ ھەسىلى ۋە ئەتىرگۈل بەرگىلىرى بىلەن قۇياشتا تەييارلانغان ساپ گۈلكەنى ۋە گۈلقەنت (1 كىلوگرام قاچا).",
        "unit": "1 كىلو قاچا",
        "badge": "قۇياش پىشقى"
      },
      "tr": {
        "name": "Geleneksel Gülkani & Gülkand (1kg)",
        "category": "Gülkand & Reçeller",
        "description": "Geleneksel Uygur tıbbının 2500 yıllık kadim mirasıyla hazırlanan; saf dağ balı ve doğal gül yaprakları içeren, mideyi ve sindirimi kuvvetlendiren şifalı Gülkani & Gülkand (1kg kavanoz).",
        "unit": "Adet",
        "badge": "Güneşte Pişen"
      },
      "en": {
        "name": "Traditional Sun-Cured Damask Rose Preserve - Gülkani & Gülkand (1kg)",
        "category": "Gulkand & Natural Jams",
        "description": "Authentic sun-cured Damask rose preserve (Gülkani & Gülkand 1kg). Formulated with pure mountain honey and wild rose petals according to 2500-year-old traditional herbal recipes.",
        "unit": "1kg Jar",
        "badge": "Sun-Cured"
      }
    }
  },
  {
    "id": "PRD-341",
    "brand": "تەكلىماكان كىلاسسىك",
    "languageScope": "all",
    "name": "ساپ تاغ ئەتىرگۈل يېغى (25ml)",
    "category": "تەبىئىي ياغلار",
    "price": 450,
    "oldPrice": 563,
    "stock": 48,
    "sales": 2,
    "rating": 5,
    "ratingCount": 18,
    "featured": false,
    "badge": "%100 تەبىئىي",
    "image": "images/products/PRD-341.jpg",
    "description": "تاغ ئەتىرگۈلى گۈل بەرگىلىرىنى ئېرىتىپ ئايرىش ئارقىلىق ئېلىنغان خۇشبۇي تېرە ئاسراش مېيى (25ml ئەينەك قۇتىدا).",
    "unit": "25ml قۇتا",
    "translations": {
      "ug": {
        "name": "ساپ تاغ ئەتىرگۈل يېغى (25ml)",
        "category": "تەبىئىي ياغلار",
        "description": "تاغ ئەتىرگۈلى گۈل بەرگىلىرىنى ئېرىتىپ ئايرىش ئارقىلىق ئېلىنغان خۇشبۇي تېرە ئاسراش مېيى (25ml ئەينەك قۇتىدا).",
        "unit": "25ml قۇتا",
        "badge": "%100 تەبىئىي"
      },
      "tr": {
        "name": "Saf Dağ Gülü Uçucu Yağı (25ml)",
        "category": "Doğal & Şifalı Yağlar",
        "description": "ئىششىق ياندۇرۇش ،ئاغرىق پەسەيتىش ،ياللۇغ قايتۇرۇش ،قىچىشىشنى توختىتىش ،باش ئاغرىقى\nقۇلاق ئاغرىقى ،بوغۇم ياللۇغى \nۋە ھەرخىل تىرە كىسەللىكلىرى گە مەنپەئەت قىلىدۇ.",
        "unit": "Adet",
        "badge": "%100 Doğal"
      },
      "en": {
        "name": "Pure Mountain Rose Essential Oil (25ml)",
        "category": "Natural & Therapeutic Oils",
        "description": "Distilled from pure mountain rose petals; concentrated essential oil for aromatherapy and skincare (25ml glass bottle).",
        "unit": "25ml Bottle",
        "badge": "100% Natural"
      }
    }
  },
  {
    "id": "PRD-420",
    "brand": "تەكلىماكان تەبىئىي",
    "languageScope": "all",
    "name": "تەبىئىي قارا قۇلاق (250g)",
    "category": "قۇرۇق يەل-يېمىشلەر",
    "price": 1500,
    "oldPrice": 1875,
    "stock": 25,
    "sales": 0,
    "rating": 5,
    "ratingCount": 18,
    "featured": false,
    "badge": "شىپالىق زەمبۇرۇغ",
    "image": "images/products/PRD-420.jpg",
    "description": "تەبىئىي ئورمانلىقتىن تېرىلغان، قان ئايلىنىشنى ياخشىلاپ بەدەن ئىممۇنىتېتىنى ئاشۇرىدىغان قۇرۇتۇلغان ساپ قارا قۇلاق (250g).",
    "unit": "250g بولاق",
    "translations": {
      "ug": {
        "name": "تەبىئىي قارا قۇلاق (250g)",
        "category": "قۇرۇق يەل-يېمىشلەر",
        "description": "تەبىئىي ئورمانلىقتىن تېرىلغان، قان ئايلىنىشنى ياخشىلاپ بەدەن ئىممۇنىتېتىنى ئاشۇرىدىغان قۇرۇتۇلغان ساپ قارا قۇلاق (250g).",
        "unit": "250g بولاق",
        "badge": "شىپالىق زەمبۇرۇغ"
      },
      "tr": {
        "name": "Doğal Siyah Ağaç Mantarı (250g)",
        "category": "Kuruyemişler",
        "description": "Doğal ortamında yetişen, kan dolaşımını destekleyen ve bağışıklığı güçlendiren kurutulmuş siyah ağaç mantarı (250g).",
        "unit": "Adet",
        "badge": ""
      },
      "en": {
        "name": "Natural Black Wood Ear Mushroom (250g)",
        "category": "Nuts & Dried Fruits",
        "description": "Naturally harvested dried black fungus rich in minerals and antioxidants (250g).",
        "unit": "250g Pack",
        "badge": "Medicinal Mushroom"
      }
    }
  },
  {
    "id": "PRD-451",
    "brand": "تەكلىماكان تورى",
    "languageScope": "all",
    "name": "ماددەتۇلھايات مەجۈنى",
    "category": "ئۇيغۇر تېبابىتى مىراسى",
    "price": 550,
    "oldPrice": 688,
    "stock": 80,
    "sales": 0,
    "rating": 5,
    "ratingCount": 18,
    "featured": false,
    "badge": "كەسپىي رېتسىپ",
    "image": "images/products/PRD-451.jpg",
    "description": "2500 يىللىق ئەنئەنىۋى ئۇيغۇر تېبابىتىنىڭ ھاياتلىق جەۋھىرى مەجۈنى. جىسمانىي قۇۋۋەتنى ئاشۇرۇپ چارچاشنى تۈگىتىدۇ.",
    "unit": "500g قاچا",
    "translations": {
      "ug": {
        "name": "ماددەتۇلھايات مەجۈنى",
        "category": "ئۇيغۇر تېبابىتى مىراسى",
        "description": "2500 يىللىق ئەنئەنىۋى ئۇيغۇر تېبابىتىنىڭ ھاياتلىق جەۋھىرى مەجۈنى. جىسمانىي قۇۋۋەتنى ئاشۇرۇپ چارچاشنى تۈگىتىدۇ.",
        "unit": "500g قاچا",
        "badge": "كەسپىي رېتسىپ"
      },
      "tr": {
        "name": "Maddetül Hayat Macunu",
        "category": "Uygur Tıbbı Mirası",
        "description": "",
        "unit": "Adet",
        "badge": "تەۋسىيە"
      },
      "en": {
        "name": "Maddetul Hayat Herbal Vitality Paste",
        "category": "Uyghur Medicine Heritage",
        "description": "Ancient 2500-year-old vitality paste formulated with mountain honey and precious herbs to enhance endurance and vitality.",
        "unit": "500g Jar",
        "badge": "Ancient Formula"
      }
    }
  },
  {
    "id": "PRD-458",
    "brand": "تەكلىماكان تورى",
    "languageScope": "all",
    "name": "نېپىز قېپلىق قەغەز ياڭاق (500g)",
    "category": "قۇرۇق يەل-يېمىشلەر",
    "price": 290,
    "oldPrice": 363,
    "stock": 30,
    "sales": 0,
    "rating": 5,
    "ratingCount": 18,
    "featured": false,
    "badge": "قولدا چېقىلىدىغان",
    "image": "images/products/PRD-458.jpg",
    "description": "ئاقسۇنىڭ داڭلىق نېپىز قېپلىق ياڭىقى، مايلىق، قۇرۇق، مېغىزى ئاسان ۋە پۈتۈن چىقىدۇ.",
    "unit": "500 گرام خالتا",
    "translations": {
      "ug": {
        "name": "نېپىز قېپلىق قەغەز ياڭاق (500g)",
        "category": "قۇرۇق يەل-يېمىشلەر",
        "description": "ئاقسۇنىڭ داڭلىق نېپىز قېپلىق ياڭىقى، مايلىق، قۇرۇق، مېغىزى ئاسان ۋە پۈتۈن چىقىدۇ.",
        "unit": "500 گرام خالتا",
        "badge": "قولدا چېقىلىدىغان"
      },
      "tr": {
        "name": "İnce Kabuklu Ceviz (500g)",
        "category": "Kuruyemişler",
        "description": "1 كىلو",
        "unit": "Adet",
        "badge": "Çok Satan"
      },
      "en": {
        "name": "İnce Kabuklu Ceviz (500g)",
        "category": "Kuruyemişler",
        "description": "1 كىلو",
        "unit": "Item",
        "badge": ""
      }
    }
  },
  {
    "id": "PRD-474",
    "brand": "تەكلىماكان تەبىئىي",
    "languageScope": "all",
    "name": "تەبىئىي ئەنجۈر ئۇرۇقى مېيى (25ml)",
    "category": "تەبىئىي ياغلار",
    "price": 540,
    "oldPrice": 675,
    "stock": 18,
    "sales": 0,
    "rating": 5,
    "ratingCount": 18,
    "featured": false,
    "badge": "ئالاھىدە تاللانما",
    "image": "images/products/PRD-474.jpg",
    "description": "مول ۋىتامىن E ۋە ئومېگا ماي كىسلاتالىرىغا ئىگە، تېرە قېرىشىنى كېچىكتۈرگۈچى ساپ ئەنجۈر ئۇرۇقى مېيى (25ml تامچىلىق ئەينەك قۇتىدا).",
    "unit": "25ml قۇتا",
    "translations": {
      "ug": {
        "name": "تەبىئىي ئەنجۈر ئۇرۇقى مېيى (25ml)",
        "category": "تەبىئىي ياغلار",
        "description": "مول ۋىتامىن E ۋە ئومېگا ماي كىسلاتالىرىغا ئىگە، تېرە قېرىشىنى كېچىكتۈرگۈچى ساپ ئەنجۈر ئۇرۇقى مېيى (25ml تامچىلىق ئەينەك قۇتىدا).",
        "unit": "25ml قۇتا",
        "badge": "ئالاھىدە تاللانما"
      },
      "tr": {
        "name": "Doğal İncir Çekirdeği Yağı (25ml)",
        "category": "Doğal & Şifalı Yağlar",
        "description": "Yüksek E vitamini ve Omega yağ asitleri içeren, yaşlanma karşıtı ve hücre yenileyici saf incir çekirdeği yağı (25ml damlalıklı cam şişe).",
        "unit": "Adet",
        "badge": ""
      },
      "en": {
        "name": "Natural Fig Seed Oil (25ml)",
        "category": "Natural & Therapeutic Oils",
        "description": "High in Vitamin E and Omega fatty acids; anti-aging, cellular renewing pure cold-pressed fig seed oil (25ml dropper bottle).",
        "unit": "25ml Bottle",
        "badge": "Special Selection"
      }
    }
  },
  {
    "id": "PRD-520",
    "brand": "تەكلىماكان شىپا",
    "languageScope": "all",
    "name": "قىزىل قانتارون مېيى (25ml)",
    "category": "تەبىئىي ياغلار",
    "price": 360,
    "oldPrice": 450,
    "stock": 45,
    "sales": 0,
    "rating": 5,
    "ratingCount": 18,
    "featured": false,
    "badge": "ئەڭ قىزىق",
    "image": "images/products/PRD-520.webp",
    "description": "ئەنئەنىۋى رېتسىپ بويىچە ساپ زەيتۇن مېيىدا تەييارلانغان قىزىل قانتارون مېيى (25ml تامچىلىق ئەينەك قۇتىدا).",
    "unit": "25ml قۇتا",
    "translations": {
      "ug": {
        "name": "قىزىل قانتارون مېيى (25ml)",
        "category": "تەبىئىي ياغلار",
        "description": "ئەنئەنىۋى رېتسىپ بويىچە ساپ زەيتۇن مېيىدا تەييارلانغان قىزىل قانتارون مېيى (25ml تامچىلىق ئەينەك قۇتىدا).",
        "unit": "25ml قۇتا",
        "badge": "ئەڭ قىزىق"
      },
      "tr": {
        "name": "Doğal Kırmızı Kantaron Yağı (25ml)",
        "category": "Doğal & Şifalı Yağlar",
        "description": "Geleneksel soğuk maserasyon yöntemiyle saf zeytinyağında demlenmiş kırmızı kantaron yağı (25ml damlalıklı cam şişe). Cilt yenilenmesini destekler, yara ve yanık izlerinin iyileşmesine yardımcı olur.",
        "unit": "Adet",
        "badge": ""
      },
      "en": {
        "name": "Natural St. John's Wort Oil (25ml)",
        "category": "Natural & Therapeutic Oils",
        "description": "Traditional St. John's Wort oil macerated in pure olive oil (25ml dropper bottle). Supports skin regeneration and helps soothe burns and scars.",
        "unit": "25ml Bottle",
        "badge": "Bestseller"
      }
    }
  },
  {
    "id": "PRD-612",
    "brand": "تەكلىماكان تورى",
    "languageScope": "all",
    "name": "ئەلا سۈپەتلىك قىزىل زەپە",
    "category": "ئۆسۈملۈك دورىلار",
    "price": 700,
    "oldPrice": 875,
    "stock": 120,
    "sales": 0,
    "rating": 5,
    "ratingCount": 18,
    "featured": false,
    "badge": "ئالىي دەرىجىلىك",
    "image": "images/products/PRD-612.jpg",
    "description": "ساپ يىپەك يولى ئەلا سۈپەتلىك تاللانغان قىزىل زەپە، يۈرەك ۋە كەيپىياتنى ياخشىلاشقا مەنپەئەتلىك.",
    "unit": "ئەينەك قاچا",
    "translations": {
      "ug": {
        "name": "ئەلا سۈپەتلىك قىزىل زەپە",
        "category": "ئۆسۈملۈك دورىلار",
        "description": "ساپ يىپەك يولى ئەلا سۈپەتلىك تاللانغان قىزىل زەپە، يۈرەك ۋە كەيپىياتنى ياخشىلاشقا مەنپەئەتلىك.",
        "unit": "ئەينەك قاچا",
        "badge": "ئالىي دەرىجىلىك"
      },
      "tr": {
        "name": "Orijinal Kırmızı Safran",
        "category": "Şifalı Bitkiler & Çaylar",
        "description": "ئالاھىدە سۈپەتلىك زەپە",
        "unit": "Adet",
        "badge": "ئەڭ قىزىق"
      },
      "en": {
        "name": "Premium Pure Red Saffron",
        "category": "Herbal Medicines",
        "description": "Top-grade pure red saffron threads with intense aroma and authentic medicinal quality.",
        "unit": "Glass Vial",
        "badge": "Premium Grade"
      }
    }
  },
  {
    "id": "PRD-754",
    "brand": "تەكلىماكان تورى",
    "languageScope": "all",
    "name": "زەغىر ۋە زەپە مېيى (5L)",
    "category": "تەبىئىي ياغلار",
    "price": 1200,
    "oldPrice": 1500,
    "stock": 30,
    "sales": 0,
    "rating": 5,
    "ratingCount": 18,
    "featured": false,
    "badge": "كۆپ سېتىلغان",
    "image": "images/products/PRD-754.jpg",
    "description": "سوغۇق سىقىش ئۇسۇلى بىلەن تەييارلانغان %100 ساپ ۋە تەبىئىي زەغىر ۋە زەپە مېيى (5 لىتىرلىق تۇڭدا).",
    "unit": "5 لىتىر قۇتا",
    "translations": {
      "ug": {
        "name": "زەغىر ۋە زەپە مېيى (5L)",
        "category": "تەبىئىي ياغلار",
        "description": "سوغۇق سىقىش ئۇسۇلى بىلەن تەييارلانغان %100 ساپ ۋە تەبىئىي زەغىر ۋە زەپە مېيى (5 لىتىرلىق تۇڭدا).",
        "unit": "5 لىتىر قۇتا",
        "badge": "كۆپ سېتىلغان"
      },
      "tr": {
        "name": "Zığır & Aspir Yağı (5L)",
        "category": "Doğal & Şifalı Yağlar",
        "description": "تەبىئىي ۋە ساپ",
        "unit": "Adet",
        "badge": "Çok Satan"
      },
      "en": {
        "name": "Zığır & Aspir Yağı (5L)",
        "category": "Doğal & Şifalı Yağlar",
        "description": "تەبىئىي ۋە ساپ",
        "unit": "Item",
        "badge": ""
      }
    }
  },
  {
    "id": "PRD-755",
    "brand": "تەكلىماكان تورى",
    "languageScope": "all",
    "name": "قەغەز با��ام (500g)",
    "category": "قۇرۇق يەل-يېمىشلەر",
    "price": 600,
    "oldPrice": 750,
    "stock": 250,
    "sales": 0,
    "rating": 5,
    "ratingCount": 18,
    "featured": false,
    "badge": "يېڭى مەھسۇلات",
    "image": "images/products/qeghez-badam.jpg",
    "description": "مېڭە ۋە نېرۋىنى قۇۋۋەتلەيدۇ، ئەستە تۇتۇش قابىلىيىتىنى ئاشۇرىدۇ، قول بىلەن ئوڭاي چاقىلىدىغان قەغەز بادام.",
    "unit": "500g خالتا",
    "translations": {
      "ug": {
        "name": "قەغەز با��ام (500g)",
        "category": "قۇرۇق يەل-يېمىشلەر",
        "description": "مېڭە ۋە نېرۋىنى قۇۋۋەتلەيدۇ، ئەستە تۇتۇش قابىلىيىتىنى ئاشۇرىدۇ، قول بىلەن ئوڭاي چاقىلىدىغان قەغەز بادام.",
        "unit": "500g خالتا",
        "badge": "يېڭى مەھسۇلات"
      },
      "tr": {
        "name": "İnce Kabuklu Badem (500g)",
        "category": "Kuruyemişler",
        "description": "مېڭە ۋە نېرۋىنى قۇۋۋەتلەش: مېڭە يادرولىرىنى ئوزۇقلاندۇرىدۇ، ئەستە تۇتۇش قابىلىيىتىنى ئاشۇرىدۇ ھەم ئۇيقۇسىزلىق ۋە روھىي چارچاشنى پەسەيتىدۇ.\nئۆپكە ۋە كۆكرەكنى يۇمشىتىش: تىنچىق، كۆكرەك قۇرۇقلىقى ۋە سوزۇلما قۇرۇق يۆتەلگە مەنپەئەت قىلىدۇ، ئاۋازنى ياخشىلايدۇ.\nئۈچەينى سىلىقلاش: قۇرۇقلۇقتىن بولغان قەۋزىيەتنى يۇمشىتىپ، ھەزمنى ياخشىلايدۇ.\nئومۇمىي بەدەننى كۈچەيتىش: تەبىئىي ئېنېرگىيە ۋە مەنىينى كۆپەيتىدۇ، ئورۇق بەدەننى سەمرىتىدۇ، تېرىنى نۇرلاندۇرىدۇ.",
        "unit": "Adet",
        "badge": "يېڭى كەلگەن"
      },
      "en": {
        "name": "Thin-Shelled Paper Almonds (500g)",
        "category": "Dried Fruits & Nuts",
        "description": "Hand-crackable thin-shelled natural almonds rich in essential nutrients and brain-boosting healthy fats.",
        "unit": "500g Pack",
        "badge": "Recommended"
      }
    }
  },
  {
    "id": "PRD-759",
    "brand": "تەكلىماكان كىلاسسىك",
    "languageScope": "all",
    "name": "ساپ ئۈشمە يېغى (25ml)",
    "category": "تەبىئىي ياغلار",
    "price": 280,
    "oldPrice": 350,
    "stock": 48,
    "sales": 2,
    "rating": 5,
    "ratingCount": 18,
    "featured": false,
    "badge": "ئەڭ قىزىق",
    "image": "images/products/PRD-759.jpg",
    "description": "قاش، كىرپىك ۋە چاچ يىلتىزلىرىنى كۈچلەندۈرۈپ قۇۋۋەتلەيدىغان %100 ساپ ئۇيغۇر ئۈشمە يېغى (25ml تامچىلىق ئەينەك قۇتىدا).",
    "unit": "25ml قۇتا",
    "translations": {
      "ug": {
        "name": "ساپ ئۈشمە يېغى (25ml)",
        "category": "تەبىئىي ياغلار",
        "description": "قاش، كىرپىك ۋە چاچ يىلتىزلىرىنى كۈچلەندۈرۈپ قۇۋۋەتلەيدىغان %100 ساپ ئۇيغۇر ئۈشمە يېغى (25ml تامچىلىق ئەينەك قۇتىدا).",
        "unit": "25ml قۇتا",
        "badge": "ئەڭ قىزىق"
      },
      "tr": {
        "name": "Saf Uşma Yağı (25ml)",
        "category": "Doğal & Şifalı Yağlar",
        "description": "چاچنىڭ يىلتىزىنى قۇۋۋەتلەش \nچاچ چۈشۈشنىڭ ئالدىنى ئېلىش\nچاچ نى قارايتىش \nداۋاملىق ئىشلىتىپ بەگەندە چاچ چىقىرىش ئۈنۈمىگە ئىگە.",
        "unit": "Adet",
        "badge": "Çok Satan"
      },
      "en": {
        "name": "Pure Usma Oil (25ml)",
        "category": "Natural & Therapeutic Oils",
        "description": "100% pure traditional usma oil (25ml dropper bottle). Nourishes and strengthens eyebrows, eyelashes, and hair roots.",
        "unit": "25ml Bottle",
        "badge": "Bestseller"
      }
    }
  },
  {
    "id": "PRD-840",
    "brand": "تەكلىماكان تورى",
    "languageScope": "all",
    "name": "سېرىق ئوت",
    "category": "ئۆسۈملۈك دورىلار",
    "price": 300,
    "oldPrice": 375,
    "stock": 500,
    "sales": 0,
    "rating": 5,
    "ratingCount": 18,
    "featured": false,
    "badge": "ئېتىباردا",
    "image": "images/products/seriq-ot.jpg",
    "description": "ماغدۇرسىزلىق، بەل-پۇت ماغدۇرسىزلىقى ۋە ئاغرىقىنى پەسەيتىدۇ ، جىگەرنى كۈچەيتىپ كۆزنى نۇرلاندۇرۇش، جىگەر ئىقتىدارىنى تەڭشەپ، كۆز قاراڭغۇلىشىش ۋە كۆرۈش قۇۋۋىتى ئاجىزلاشنى ياخشىلايدۇ.",
    "unit": "100 گرام",
    "translations": {
      "ug": {
        "name": "سېرىق ئوت",
        "category": "ئۆسۈملۈك دورىلار",
        "description": "ماغدۇرسىزلىق، بەل-پۇت ماغدۇرسىزلىقى ۋە ئاغرىقىنى پەسەيتىدۇ ، جىگەرنى كۈچەيتىپ كۆزنى نۇرلاندۇرۇش، جىگەر ئىقتىدارىنى تەڭشەپ، كۆز قاراڭغۇلىشىش ۋە كۆرۈش قۇۋۋىتى ئاجىزلاشنى ياخشىلايدۇ.",
        "unit": "100 گرام",
        "badge": "ئېتىباردا"
      },
      "tr": {
        "name": "Şifalı Sarı Ot (Coptis)",
        "category": "Şifalı Bitkiler & Çaylar",
        "description": "ماغدۇرسىزلىق، بەل-پۇت ماغدۇرسىزلىقى ۋە ئاغرىقىنى پەسەيتىدۇ ،\nجىگەرنى كۈچەيتىپ كۆزنى نۇرلاندۇرۇش، جىگەر ئىقتىدارىنى تەڭشەپ، كۆز قاراڭغۇلىشىش ۋە كۆرۈش قۇۋۋىتى ئاجىزلاشنى ياخشىلايدۇ.\nھۈجەيرىلەرنى ياشارتىش ۋە كۈچ بېرىش، سۈيدۈك تۇتالماسلىق، قېرىشنىڭ ئالدىنى ئېلىش ۋە چاچ بالدۇر ئاقىرىشنىڭ ئالدىنى ئېلىشتا قىممەتلىك جەۋھەر.\nبەدەندىكى زىيادە سەۋدا ۋە بەلغەمنى ھەيدەپ، تەبىئىي ئېنېرگىيە بېرىدۇ.",
        "unit": "Adet",
        "badge": "ئېتىباردا"
      },
      "en": {
        "name": "Traditional Yellow Herb - Cuscuta",
        "category": "Herbal Medicines",
        "description": "Traditional herbal remedy for vitality, liver support, vision enhancement and restoring body balance.",
        "unit": "100g Pack",
        "badge": "Special Deal"
      }
    }
  },
  {
    "id": "PRD-910",
    "brand": "تەكلىماكان تورى",
    "languageScope": "all",
    "name": "تەبىئىي قارا كۈنجۈت (1kg)",
    "category": "قۇرۇق يەل-يېمىشلەر",
    "price": 1600,
    "oldPrice": 2000,
    "stock": 150,
    "sales": 0,
    "rating": 5,
    "ratingCount": 18,
    "featured": false,
    "badge": "ئېتىباردا",
    "image": "images/products/PRD-910.jpg",
    "description": "قان تولۇقلايدۇ، تەننى كۈچلەندۈرىدۇ، چاچ ۋە سۆڭەك ساغلاملىقىنى قوللايدىغان ساپ قارا كۈنجۈت.",
    "unit": "1 كىلو خالتا",
    "translations": {
      "ug": {
        "name": "تەبىئىي قارا كۈنجۈت (1kg)",
        "category": "قۇرۇق يەل-يېمىشلەر",
        "description": "قان تولۇقلايدۇ، تەننى كۈچلەندۈرىدۇ، چاچ ۋە سۆڭەك ساغلاملىقىنى قوللايدىغان ساپ قارا كۈنجۈت.",
        "unit": "1 كىلو خالتا",
        "badge": "ئېتىباردا"
      },
      "tr": {
        "name": "Doğal Kara Susam (1kg)",
        "category": "Kuruyemişler",
        "description": "قان تولۇقلايدۇ",
        "unit": "Adet",
        "badge": "ئېتىباردا"
      },
      "en": {
        "name": "Natural Black Sesame Seeds (1kg)",
        "category": "Dried Fruits & Nuts",
        "description": "Pure raw black sesame seeds, mineral-dense and nutrient-rich for vitality, hair and bone wellness.",
        "unit": "1kg Pack",
        "badge": "On Sale"
      }
    }
  }
];

const INITIAL_CATEGORIES = [
  { id: 'all', name: 'بارلىق تۈرلەر', order: 0, icon: 'fas fa-th-large', translations: { ug: 'بارلىق تۈرلەر', tr: 'Tüm Kategoriler', en: 'All Categories' } },
  { id: 'ئۇيغۇر تىبابىتى', name: 'ئۇيغۇر تىبابىتى', order: 1, icon: 'fas fa-mortar-pestle', translations: { ug: 'ئۇيغۇر تىبابىتى', tr: 'Uygur Tıbbı', en: 'Uyghur Medicine' } },
  { id: 'پىششىق دورىلار', name: 'پىششىق دورىلار', order: 2, icon: 'fas fa-pills', translations: { ug: 'پىششىق دورىلار', tr: 'Hazır & İşlenmiş İlaçlar', en: 'Prepared Medicines' } },
  { id: 'ئۆسۈملۈك دورىلار', name: 'ئۆسۈملۈك دورىلار', order: 3, icon: 'fas fa-leaf', translations: { ug: 'ئۆسۈملۈك دورىلار', tr: 'Şifalı Bitkiler & Otlar', en: 'Herbal Medicines' } },
  { id: 'تەبىئىي ياغلار', name: 'تەبىئىي ياغلار', order: 4, icon: 'fas fa-tint', translations: { ug: 'تەبىئىي ياغلار', tr: 'Doğal & Şifalı Yağlar', en: 'Natural Oils' } },
  { id: 'گۈزەللىك ۋە ساغلاملىق', name: 'گۈزەللىك ۋە ساغلاملىق', order: 5, icon: 'fas fa-heartbeat', translations: { ug: 'گۈزەللىك ۋە ساغلاملىق', tr: 'Güzellik & Sağlık', en: 'Beauty & Health' } },
  { id: 'گۈلقەنتلەر', name: 'گۈلقەنتلەر', order: 6, icon: 'fas fa-seedling', translations: { ug: 'گۈلقەنتلەر', tr: 'Gül Reçelleri & Macunlar', en: 'Rose Jams & Pastes' } },
  { id: 'قۇرۇق يەل-يېمىشلەر', name: 'قۇرۇق يەل-يېمىشلەر', order: 7, icon: 'fas fa-apple-alt', translations: { ug: 'قۇرۇق يەل-يېمىشلەر', tr: 'Kuru Meyve & Yemişler', en: 'Dried Fruits & Nuts' } },
  { id: 'مەدەنىيەت بۇيۇملىرى', name: 'مەدەنىيەت بۇيۇملىرى', order: 8, icon: 'fas fa-landmark', translations: { ug: 'مەدەنىيەت بۇيۇملىرى', tr: 'Kültür & Sanat Eşyaları', en: 'Cultural & Art Artifacts' } },
  { id: 'كىتاب ۋە مەدەنىيەت', name: 'كىتاب ۋە مەدەنىيەت', order: 9, icon: 'fas fa-book-open', translations: { ug: 'كىتاب ۋە مەدەنىيەت', tr: 'Kitap & Kültür', en: 'Books & Culture' } }
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

const DEFAULT_HERO_SLIDES = [
  {
    id: 'hero_1',
    order: 1,
    tag: 'ئەتىيازلىق ئېتىبار',
    tagColor: '#f59e0b',
    title: 'ساپ تەبىئىي، ئىشەنچلىك ئېسىل مەھسۇلاتلار',
    subtitle: 'يەرلىك ئەلا سۈپەتلىك تۇرپان ئۈزۈم مېغىزى، خوتەن قاشتېشى ۋە مىللىي قول سەنئىتى بۇيۇملىرى 20% ئېتىباردا سېتىلماقتا!',
    btnText: 'ھازىرلا كۆرۈپ سېتىۋېلىش',
    btnLink: '#catalogSection',
    image: 'images/hero_dried_fruits.jpg',
    enabled: true,
    translations: {
      tr: {
        tag: 'Bahar Kampanyası',
        title: 'Doğal, Güvenilir ve Seçkin Ürünler',
        subtitle: 'Turpan kurutulmuş üzüm çekirdeği, Hoten yeşim taşı ve geleneksel el sanatları %20 indirimle satışta!',
        btnText: 'Hemen İncele ve Satın Al'
      },
      en: {
        tag: 'Spring Campaign',
        title: 'Pure, Natural & Authentic Products',
        subtitle: 'Premium Turpan raisins, Hotan jade treasures and authentic ethnic handicrafts with 20% discount!',
        btnText: 'Shop Now'
      }
    }
  },
  {
    id: 'hero_2',
    order: 2,
    tag: 'يېڭى نۇسخىلار',
    tagColor: '#10b981',
    title: 'ئەنئەنىۋى ئەتلەس ۋە نەپىس قول ھۈنەر بۇيۇملىرى',
    subtitle: 'ساپ تەبىئىي يىپەك، يىپەك توقۇلمىلىرى ۋە ھۆسن تۈزەش گۈزەللىك يۈرۈشلۈكلىرى زاكاز قىلىشىڭىزنى كۈتمەكتە.',
    btnText: 'مەھسۇلاتلار تىزىملىكى',
    btnLink: '#catalogSection',
    image: 'images/hero_atlas_silk.jpg',
    enabled: true,
    translations: {
      tr: {
        tag: 'Yeni Koleksiyon',
        title: 'Geleneksel Atlas ve Modern Giyim',
        subtitle: 'Saf doğal ipek dokumalar, atlas kumaşlar ve doğal güzellik bakım ürünleri sizleri bekliyor.',
        btnText: 'Ürünleri İncele'
      },
      en: {
        tag: 'New Collection',
        title: 'Traditional Atlas Silk & Modern Fashion',
        subtitle: 'Pure natural mulberry silk garments, crafts and skincare essentials available now.',
        btnText: 'Explore Collection'
      }
    }
  },
  {
    id: 'hero_3',
    order: 3,
    tag: 'ئۇيغۇر تىبابىتى',
    tagColor: '#d97706',
    title: 'خوتەن قاشتېشى ۋە شىپالىق ئۆسۈملۈكلەر خەزىنىسى',
    subtitle: 'ساپ تاش قاشتېشى بىلەزۈكلىرى، تەبىئىي شىپالىق تاغ ھەسىلى ۋە ئەنئەنىۋى تىبابەت مەلھەملىرى تولۇق كاپالەتلىك.',
    btnText: 'شىپالىق ماللارنى كۆرۈش',
    btnLink: '#catalogSection',
    image: 'images/hero_uyghur_medicine.jpg',
    enabled: true,
    translations: {
      tr: {
        tag: 'Uygur Tıbbı & Şifa',
        title: 'Hoten Yeşim Taşı ve Doğal Şifalı Bitkiler',
        subtitle: 'Orijinal yeşim taşı bileklikler, yayla süzme balı ve şifalı bitkisel kürler %100 garantili.',
        btnText: 'Şifalı Ürünler'
      },
      en: {
        tag: 'Herbal & Healing',
        title: 'Hotan Jade & Herbal Remedies',
        subtitle: 'Authentic Hetian nephrite jade bracelets, mountain honey and traditional herbal infusions.',
        btnText: 'View Remedies'
      }
    }
  },
  {
    id: 'hero_4',
    order: 4,
    tag: 'ئالىي تەم ۋە ئىچىملىكلەر',
    tagColor: '#e11d48',
    title: 'تۈركىيە رىزە قارا چېيى ۋە قەدىمىي مىس چەينەك توپلىمى',
    subtitle: 'خۇش پۇراق تەبىئىي قارا چاي، نۇسخىلىق قولدا ئىشلەنگەن مىس چەينەك ۋە پىيالە يۈرۈشلۈكلىرى ئېتىبار باھادا.',
    btnText: 'چايلارنى تاللاش',
    btnLink: '#catalogSection',
    image: 'images/hero_turkish_tea.jpg',
    enabled: true,
    translations: {
      tr: {
        tag: 'Özel Çay & İçecek',
        title: 'Rize Doğal Çayı ve El İşlemesi Bakır Çaydanlık',
        subtitle: 'Kokusu ve demiyle ünlü Rize siyah çayı ve el dövmesi bakır demlikler özel fiyatla.',
        btnText: 'Çay Çeşitleri'
      },
      en: {
        tag: 'Premium Tea & Wares',
        title: 'Rize Black Tea & Handcrafted Copper Sets',
        subtitle: 'Aromatic pure black tea, vintage hand-embossed copper teapots and glasses at special prices.',
        btnText: 'Discover Teas'
      }
    }
  },
  {
    id: 'hero_5',
    order: 5,
    tag: 'كىتاپ ۋە مەدەنىيەت',
    tagColor: '#6366f1',
    title: 'يىپەك يولى مەدەنىيىتى ۋە كىلاسسىك ئەدەبىيات ئەسەرلىرى',
    subtitle: 'تارىخىي رەسىملىك قامۇسلار، مىللىي ئەتلەس يۆگەلمە كىتابلار ۋە زامانىۋى سىمسىز قۇلاقلىقلار كۆرگەزمىسى.',
    btnText: 'كىتابلارنى كۆرۈش',
    btnLink: '#catalogSection',
    image: 'images/hero_books_culture.jpg',
    enabled: true,
    translations: {
      tr: {
        tag: 'Kitap & Kültür Mirası',
        title: 'Tarihi İpek Yolu ve Klasik Kültür Eserleri',
        subtitle: 'Tarih atlasları, milli kültür kitapları ve seçkin edebiyat eserleri tek bir platformda.',
        btnText: 'Kitapları Keşfet'
      },
      en: {
        tag: 'Heritage & Books',
        title: 'Silk Road Heritage & Classic Literature',
        subtitle: 'Illustrated historical folios, classic cultural writings and literary anthologies.',
        btnText: 'Browse Books'
      }
    }
  }
];

// ==================== 🛍️ زامانىۋى ئۇپۇق سىيرىلما تاۋار بۆلەكلىرى (Trendyol Style Showcase Shelves) ====================
const DEFAULT_SHOWCASE_SHELVES = [
  {
    id: 'shelf_recommended',
    order: 1,
    enabled: true,
    title: 'سىزگە تەۋسىيە',
    subtitle: 'تاللانغان تەبىئىي، ساپ يەرلىك نېئمەتلەر',
    linkText: '',
    linkUrl: '#catalogSection',
    productSource: 'featured',
    manualProductIds: ['PRD-100', 'PRD-119', 'PRD-103', 'PRD-120', 'PRD-754', 'PRD-420'],
    badgeStripText: 'Cuma Kapında',
    badgeStripColor: '#059669',
    badgeStripBgType: 'green',
    showVerifiedBadge: true,
    showWishlistBtn: true,
    translations: {
      ug: {
        title: 'سىزگە تەۋسىيە',
        subtitle: 'تاللانغان تەبىئىي، ساپ يەرلىك نېئمەتلەر',
        linkText: '',
        badgeStripText: '🚚 ئەتە بوسۇغىڭىزدا'
      },
      tr: {
        title: 'Keşfetmen İçin Öneriler',
        subtitle: 'Sizin için seçilen özel doğal ürünler',
        linkText: '',
        badgeStripText: 'Cuma Kapında'
      },
      en: {
        title: 'Recommended for You',
        subtitle: 'Curated premium organic products',
        linkText: '',
        badgeStripText: 'Fast Delivery'
      }
    }
  },
  {
    id: 'shelf_special_deals',
    order: 2,
    enabled: true,
    title: 'ئالاھىدە باھالىق مەھسۇلاتلار',
    subtitle: 'چەكلىك ۋاقىتلىق ئېتىبار ۋە قىزىق نۇقتىدىكى تاللانمىلار',
    linkText: '',
    linkUrl: '#catalogSection',
    productSource: 'bestseller',
    manualProductIds: ['PRD-128', 'PRD-759', 'PRD-132', 'PRD-341', 'PRD-114', 'PRD-292'],
    badgeStripText: '🎁 75 TL',
    badgeStripColor: '#e11d48',
    badgeStripBgType: 'pink',
    showVerifiedBadge: true,
    showWishlistBtn: true,
    translations: {
      ug: {
        title: 'ئالاھىدە باھالىق مەھسۇلاتلار',
        subtitle: 'چەكلىك ۋاقىتلىق ئېتىبار ۋە قىزىق نۇقتىدىكى تاللانمىلار',
        linkText: '',
        badgeStripText: '🎁 ئالاھىدە ئېتىبار'
      },
      tr: {
        title: "Özel Fiyatlı Ürünler",
        subtitle: 'Özel fiyatlar ve popüler indirimli fırsatlar',
        linkText: '',
        badgeStripText: '🎁 75 TL'
      },
      en: {
        title: 'Special Price Products',
        subtitle: 'Exclusive discounts and hot deals',
        linkText: '',
        badgeStripText: '🎁 75 TL'
      }
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
  telegramBotToken: '',
  telegramChatId: '',
  whatsappEnabled: true,
  whatsappInstanceId: '',
  whatsappToken: '',
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
  },
  charityFund: {
    enabled: true,
    name: 'تەكلىماكان فوندى',
    percentage: 5,
    url: 'https://www.seidiye.com/category/mihri/',
    description: 'سۇپىمىزدىن سېتىۋېلىنغان ھەربىر تاۋارنىڭ %5 قىممىتى ئېھتىياجلىق قېرىنداشلىرىمىزغا ياردەم بېرىش ئۈچۈن «تەكلىماكان فوندى» ھېسابىغا ئاجرىتىلىدۇ.'
  }
};

class StoreManager {
  constructor() {
    // 💵 تىل بىلەن ماس قەدەمدە پۇل بىرلىكىنى بېكىتىش (ug/tr -> TRY, en -> USD)
    const currentLang = localStorage.getItem('teklimakan_language') || 'ug';
    this.currentCurrency = currentLang === 'en' ? 'USD' : 'TRY';
    this.telegram = typeof window !== 'undefined' ? window.TeklimakanTelegram : null;
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
    // 🛡️ سىستېما تاۋار ساندانىنى تازىلاش ۋە كونا ئۆچۈرۈلگەن قالدۇق سۈرەتلەرنى بارلىق تېلېفون / ئۈسكۈنىلەردە پۈتۈنلەي پاكىزلاش
    const STORE_PRODUCTS_RELEASE = 'v20260930_clean18';
    const currentRelease = localStorage.getItem('teklimakan_products_release');
    if (currentRelease !== STORE_PRODUCTS_RELEASE) {
      localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
      localStorage.setItem('teklimakan_products_release', STORE_PRODUCTS_RELEASE);
    }
    const STORE_SHELVES_RELEASE = 'v20260930_interleaved18';
    const currentShelvesRel = localStorage.getItem('teklimakan_shelves_release');
    if (currentShelvesRel !== STORE_SHELVES_RELEASE) {
      localStorage.removeItem(STORAGE_KEYS.SHOWCASE_SHELVES);
      localStorage.setItem('teklimakan_shelves_release', STORE_SHELVES_RELEASE);
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

    // يېڭى قوشۇلغان رەسمىي تاۋارلارنى (ئۆچۈرۈلمىگەن بولسا) ئاپتوماتىك قوشۇپ تولۇقلاش
    if (Array.isArray(INITIAL_PRODUCTS)) {
      INITIAL_PRODUCTS.forEach(ip => {
        const exists = prods.some(p => p.id === ip.id);
        if (!exists && !deletedIds.includes(ip.id)) {
          prods.push(JSON.parse(JSON.stringify(ip)));
          updated = true;
        }
      });
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
        // 🧹 سۈكۈتتىكى سىناق ۋاكالەتچىلىرىنى (AGT-101 ~ AGT-104) بىر قېتىمدىلا مەڭگۈلۈك چىقىرىۋېتىش ۋە ئۆچۈرۈلگەنلەرگە قوشۇش
    let deletedAgentIds = this.getDeletedAgentIds();
    let deletedChanged = false;
    FAKE_DEMO_AGENT_IDS.forEach(fid => {
      if (!deletedAgentIds.includes(fid)) {
        deletedAgentIds.push(fid);
        deletedChanged = true;
      }
    });
    if (deletedChanged) {
      try {
        localStorage.setItem(STORAGE_KEYS.DELETED_AGENTS, JSON.stringify(deletedAgentIds));
      } catch (e) {}
    }

    const storedAgents = localStorage.getItem(STORAGE_KEYS.AGENTS);
    if (!storedAgents) {
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify([]));
    } else {
      try {
        const parsedAgents = JSON.parse(storedAgents);
        if (Array.isArray(parsedAgents)) {
          const cleanedAgents = parsedAgents.filter(a => a && !FAKE_DEMO_AGENT_IDS.includes(a.id) && !FAKE_DEMO_AGENT_EMAILS.includes(a.email) && !deletedAgentIds.includes(a.id));
          if (cleanedAgents.length !== parsedAgents.length) {
            localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(cleanedAgents));
          }
        }
      } catch (e) {}
    }
    const storedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    let validCat = false;
    try {
      if (storedCategories) {
        let parsed = JSON.parse(storedCategories);
        if (Array.isArray(parsed) && parsed.length >= 6 && parsed.some(c => c.id === 'گۈلقەنتلەر')) {
          parsed = parsed.filter(c => c && (c.id === 'all' || (!isPseudoCategory(c.id) && !isPseudoCategory(c.name))));
          localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(parsed));
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
        // Client-side secrets are no longer supported. Purge values that may have
        // been saved by older builds and use server-side environment variables.
        curSet.telegramBotToken = '';
        curSet.telegramChatId = '';
        if (curSet.telegramEnabled === undefined) curSet.telegramEnabled = true;
        curSet.whatsappInstanceId = '';
        curSet.whatsappToken = '';
        if (curSet.whatsappEnabled === undefined) curSet.whatsappEnabled = true;
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
    // ☁️ بۇلۇتتىكى يېڭى مەزمۇنلارنى ھەر ئۈسكۈنىگە دەرھال تارقىتىش (Realtime WebSocket)
    if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.subscribeToChanges === 'function') {
      window.TeklimakanSupabase.subscribeToChanges(change => this.applyCloudChange(change));
    }

    // ☁️ Supabase بۇلۇت ئامبىرى بىلەن دەسلەپكى ماسلاشتۇرۇش (ئەقلىي تېجەشلىك)
    this.syncWithSupabase();

    // 🌐 پەقەت تور ئۈزۈلۈپ قايتا ئۇلانغاندىلا Realtime نى قايتا ئۇلاش
    window.addEventListener('online', () => {
      if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.isRealtimeConnected === 'function') {
        if (!window.TeklimakanSupabase.isRealtimeConnected()) {
          window.TeklimakanSupabase.reconnectRealtime?.();
        }
      }
    });

    // 📱 بەتكە قايتقاندا پەقەت Realtime ئۈزۈلگەن بولسىلا قايتا ئۇلاش (سانداننى قايتا-قايتا تولۇق تارتىپ ئېقىم ئىسراپ قىلماسلىق)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.isRealtimeConnected === 'function') {
          if (!window.TeklimakanSupabase.isRealtimeConnected()) {
            window.TeklimakanSupabase.reconnectRealtime?.();
          }
        }
      }
    });

    // 📲 قەرەللىك ساغلاملىق تەكشۈرۈش (ھەر 2 مىنۇتتا پەقەت Realtime ئۇلىنىشىنىلا قوغدايدۇ، سانداننى قايتا تارتمايدۇ، ئېقىم تېجەيدۇ)
    setInterval(() => {
      if (document.visibilityState !== 'hidden') {
        if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.isRealtimeConnected === 'function') {
          if (!window.TeklimakanSupabase.isRealtimeConnected()) {
            window.TeklimakanSupabase.reconnectRealtime?.();
          }
        }
      }
    }, 120000);

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

  async syncWithSupabase(options = {}) {
    if (!window.TeklimakanSupabase) return;
    if (this._isSyncingSupabase) return;

    const isAdminContext = typeof window !== 'undefined' && (
      window.location.pathname.includes('seidiye') ||
      !!document.getElementById('adminApp') ||
      !!document.getElementById('adminLoginForm')
    );

    const force = options && options.force === true;
    const now = Date.now();
    // تاۋارلارنى ماس قەدەملەشنى ئەقلىي كونترول قىلىش — يەرلىك تاۋار بولمىسا مەجبۇرىي تارتىمىز
    const localProductsEmpty = this.getProducts().length === 0;
    // تاۋارلارنى بۇلۇتتىن دەل ۋاقتىدا يېڭىلاش (ئەگەر force بولسا ياكى 10 سېكۇنتتىن ئاشقان بولسا قايتا تارتىدۇ)
    const shouldSyncProducts = force || localProductsEmpty || !this._lastProductsSyncTime || (now - this._lastProductsSyncTime > 10 * 1000);

    if (!shouldSyncProducts) {
      return;
    }

    this._isSyncingSupabase = true;
    try {
      // 1. مەھسۇلاتلارنى بۇلۇتتىن يېڭىلاش
      if (shouldSyncProducts) {
        const remoteProducts = await window.TeklimakanSupabase.fetchProducts(force);
        if (Array.isArray(remoteProducts) && remoteProducts.length > 0) {
          this._lastProductsSyncTime = Date.now();
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
              if (isAdminContext && window.TeklimakanSupabase && typeof window.TeklimakanSupabase.deleteProduct === 'function') {
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
              // بۇلۇتقا يېڭى يەرلىك نۇسخىنى پەقەت باشقۇرغۇچى سۇپىسىدىلا قايتا يوللاپ دەلىللەش
              if (isAdminContext && window.TeklimakanSupabase && typeof window.TeklimakanSupabase.upsertProduct === 'function') {
                window.TeklimakanSupabase.upsertProduct(localItem);
              }
              map.set(rp.id, localItem);
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

            const ugTrans = (rp.translations && rp.translations.ug) ? rp.translations.ug : null;
            const safeName = (ugTrans && ugTrans.name && !isCorrupted(ugTrans.name)) 
              ? ugTrans.name 
              : (initMatch?.name || (localItem?.name && /[؀-ۿ]/.test(localItem.name) ? localItem.name : rp.name));
            const safeBrand = isCorrupted(rp.brand) ? (localItem?.brand && !isCorrupted(localItem.brand) ? localItem.brand : initMatch?.brand || 'تەكلىماكان كىلاسسىك') : (rp.brand || 'تەكلىماكان كىلاسسىك');
            const safeCat = (ugTrans && ugTrans.category)
              ? ugTrans.category
              : (initMatch?.category || (window.appI18n ? window.appI18n.getCategoryName(rp.category, 'ug') : 'ئۇيغۇر تىبابىتى'));
            const rawUnit = (rp.translations?.unit && !isCorrupted(rp.translations.unit)) ? rp.translations.unit : (localItem?.unit || initMatch?.unit || 'دانە');
            const safeUnit = normalizeUnit(rawUnit);
            const safeDesc = (ugTrans && ugTrans.description)
              ? ugTrans.description
              : (initMatch?.description || (localItem?.description && !isCorrupted(localItem.description) ? localItem.description : rp.description || ''));

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
              slug: rp.slug || (rp.translations && rp.translations.slug) || localItem?.slug || transliterateToSlug(safeName),
              isUserEdited: isCloudEdited || isLocallyEdited,
              updatedAt: cloudUpdated || localUpdated || new Date().toISOString()
            };
            safeItem.translations = this.prepareProductTranslations(safeItem, localItem);

            map.set(rp.id, safeItem);

            if (isCloudEdited || (hasValidCloudImage && isInvalidLocalImage)) {
              userEdits[rp.id] = safeItem;
              editsUpdated = true;
            }

            // ئەگەر بۇلۇتتىكى مەلۇمات خەت كودلىنىشى جەھەتتە بۇزۇلۇپ قالغان بولسا، پەقەت باشقۇرغۇچى سۇپىسىدىلا قايتا داۋالاپ يوللاش
            if (isAdminContext && (isCorrupted(rp.name) || isCorrupted(rp.category)) && window.TeklimakanSupabase && typeof window.TeklimakanSupabase.upsertProduct === 'function') {
              window.TeklimakanSupabase.upsertProduct(safeItem);
            }
          });

          if (editsUpdated) {
            try {
              localStorage.setItem(STORAGE_KEYS.USER_EDITS, JSON.stringify(userEdits));
            } catch(e) {}
          }

          // رەسمىي تاۋارلارنى ۋە يەرلىك تەستىقلانغان/كۈتۈۋاتقان تاۋارلارنى ئەتراپلىق ساقلاپ قېلىش
          localProds.forEach(p => {
            if (!rpIds.has(p.id) && !deletedIds.includes(p.id)) {
              // 🛡️ پەقەت تېخى بۇلۇتقا ماس قەدەملىنىپ بولمىغان، يەرلىكتە يېڭى يوللانغان تەستىق كۈتۈۋاتقان تاۋارلارلا ساقلىنىدۇ
              if (p.approvalStatus === 'تەستىق كۈتۈۋاتىدۇ') {
                map.set(p.id, p);
              }
            }
          });

          const merged = Array.from(map.values());
          const mergedStr = JSON.stringify(merged);
          const currentProductsStr = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
          if (mergedStr !== currentProductsStr) {
            try {
              localStorage.setItem(STORAGE_KEYS.PRODUCTS, mergedStr);
            } catch (quotaErr) {
              console.warn('localStorage quota exceeded, cleaning temporary caches:', quotaErr);
              try {
                localStorage.removeItem('teklimakan_supabase_products_cache');
                localStorage.removeItem('teklimakan_supabase_orders_cache');
                localStorage.removeItem('teklimakan_supabase_agents_cache');
                localStorage.setItem(STORAGE_KEYS.PRODUCTS, mergedStr);
              } catch (e2) {}
            }
            this.notifyDataChange('products');
          }
        } else if (isAdminContext && Array.isArray(remoteProducts) && remoteProducts.length === 0) {
          // ئەگەر Supabase ئامبىرى يېڭى ھەم قۇرۇق بولسا، دەسلەپكى تاۋارلارنى بۇلۇتقا قاچىلاش (پەقەت باشقۇرغۇچىلا قىلىدۇ)
          const currentProds = this.getProducts();
          currentProds.forEach(p => {
            if (!this.getDeletedProductIds().includes(p.id)) {
              window.TeklimakanSupabase.upsertProduct(p);
            }
          });
        }
      }

      // 2. زاكازلار ۋە ۋاكالەتچىلەرنى بۇلۇتتىن يېڭىلاش (پەقەت باشقۇرغۇچى سۇپىسى ئۈچۈنلا - ئادەتتىكى بەتكە تارتىلمايدۇ، مەخپىيەتلىك ۋە ئېقىم تېجەيدۇ)
      if (isAdminContext) {
        // زاكازلار
        const remoteOrders = await window.TeklimakanSupabase.fetchOrders(force);
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

        // ۋاكالەتچىلەر
        const remoteAgents = await window.TeklimakanSupabase.fetchAgents(force);
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
            let proposedBrands = '';
            let notes = '';
            let legalAgreement = null;
            let suspendedUntil = null;
            let suspensionReason = '';
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

          // 🛡️ يەرلىكتە بار، لېكىن تېخى بۇلۇتقا چىقمىغان ھەقىقىي ۋاكالەتچىلەرنى قوغداش (سىناق ۋاكالەتچىلەر كىرمەيدۇ)
          localMap.forEach((la, id) => {
            if (!aMap.has(id) && !deletedAgentIds.includes(id) && !FAKE_DEMO_AGENT_IDS.includes(id) && !FAKE_DEMO_AGENT_EMAILS.includes(la.email)) {
              aMap.set(id, la);
            }
          });

          const mergedAgents = Array.from(aMap.values()).filter(a => a && !deletedAgentIds.includes(a.id) && !FAKE_DEMO_AGENT_IDS.includes(a.id) && !FAKE_DEMO_AGENT_EMAILS.includes(a.email));
          const agentsStr = JSON.stringify(mergedAgents);
          const currentAgentsStr = localStorage.getItem(STORAGE_KEYS.AGENTS);
          if (agentsStr !== currentAgentsStr) {
            localStorage.setItem(STORAGE_KEYS.AGENTS, agentsStr);
            this.notifyDataChange('agents');
          }
        } else if (Array.isArray(remoteAgents) && remoteAgents.length === 0) {
          // ئەگەر بۇلۇتتا ۋاكالەتچى بولمىسا، يەرلىكتىكى بار ۋاكالەتچىلەرنى بۇلۇتقا زاپاس يوللاش (پەقەت باشقۇرغۇچىلا قىلىدۇ)
          const localAgents = this.getAgents('none');
          localAgents.forEach(a => {
            if (!deletedAgentIds.includes(a.id)) {
              window.TeklimakanSupabase.upsertAgent(a);
            }
          });
        }
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
    const isAdmin = typeof window !== 'undefined' && (
      window.location.pathname.includes('seidiye') ||
      !!document.getElementById('adminApp') ||
      !!document.getElementById('adminLoginForm')
    );
    const effectiveCurrency = isAdmin ? 'TRY' : this.currentCurrency;
    const info = CURRENCY_RATES[effectiveCurrency] || CURRENCY_RATES['TRY'];
    const rate = info ? info.rate : 1.0;
    const num = Number(amountInTry);
    const validAmount = isNaN(num) ? 0 : num;
    const converted = Math.round(validAmount * rate);
    const formattedNum = converted.toLocaleString('en-US');
    if (effectiveCurrency === 'USD') {
      return `$${formattedNum}`;
    }
    return `${formattedNum} ₺`;
  }

  getFreeShippingThreshold() {
    return this.getCurrencyInfo().freeThreshold;
  }

  // ==================== ۋاكالەتچىلەر ۋە ماركا رۇخسىتى (Agents & Brand Auth) ====================
  getAgents(sortBy = 'name') {
    let raw = localStorage.getItem(STORAGE_KEYS.AGENTS);
    let agents = [];
    try {
      agents = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(agents)) agents = [];
    } catch (e) {
      agents = [];
    }
    const deletedAgentIds = this.getDeletedAgentIds();
    agents = agents.filter(a => a && a.id && !FAKE_DEMO_AGENT_IDS.includes(a.id) && !FAKE_DEMO_AGENT_EMAILS.includes(a.email) && !deletedAgentIds.includes(a.id));

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

  // 💾 بارلىق ۋاكالەتچىلەر سانلىق مەلۇماتىنى يەرلىككە ساقلاش ۋە ئۆزگىرىشنى ئۇقتۇرۇش
  saveAgents(agents) {
    if (!Array.isArray(agents)) return;
    try {
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
    } catch (e) {
      console.warn('saveAgents localStorage error:', e);
    }
    this.notifyDataChange('agents');
  }

  getAgentById(id) {
    if (!id) return null;
    const term = String(id).trim().toLowerCase();
    const cleanDigits = term.replace(/\D/g, '');
    const normPhone = typeof this.normalizePhoneNumber === 'function' ? this.normalizePhoneNumber(term) : '';
    const agents = this.getAgents('none');
    return agents.find(a => {
      if (!a) return false;
      if (a.id && String(a.id).trim().toLowerCase() === term) return true;
      if (a.email && typeof this.normalizeEmail === 'function' && this.normalizeEmail(a.email) === term) return true;
      if (normPhone && typeof this.normalizePhoneNumber === 'function' && this.normalizePhoneNumber(a.phone) === normPhone) return true;
      const aDigits = (a.phone || '').replace(/\D/g, '');
      if (cleanDigits && aDigits) {
        if (aDigits === cleanDigits) return true;
        if (cleanDigits.length >= 10 && aDigits.endsWith(cleanDigits.slice(-10))) return true;
        if (aDigits.length >= 10 && cleanDigits.endsWith(aDigits.slice(-10))) return true;
      }
      return false;
    }) || null;
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
    if (this._weeklyReportSendingDirect) {
      console.warn('Weekly report is already being dispatched. Skipping duplicate call.');
      return { success: false, reason: 'already_sending' };
    }
    this._weeklyReportSendingDirect = true;

    // تەكرارلىنىپ كېتىشنىڭ دەرھال ئالدىنى ئېلىش ئۈچۈن يوللاش ۋاقتىنى بېشىدىلا قۇلۇپلاش
    const sundayKey = new Date().toISOString().split('T')[0];
    localStorage.setItem('teklimakan_last_weekly_report_date', sundayKey);
    localStorage.setItem('teklimakan_last_weekly_report_sent_at', Date.now().toString());
    localStorage.setItem('teklimakan_weekly_report_cleared', 'false');

    try {
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
    } finally {
      this._weeklyReportSendingDirect = false;
    }
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
      // 🛡️ پەقەت باشقۇرۇش سۇپىسىدا (seidiye) كىرگەن ھالەتتىلا ئاپتوماتىك قوزغالسۇن
      // ئادەتتىكى خېرىدارلار دۇكاننى ئاچقاندا تەكرار ئاپتوماتىك ئۇچۇر كېتىپ قېلىشنىڭ 100% ئالدى ئېلىندى
      const isAdminContext = window.location.pathname.includes('seidiye') ||
                             !!document.getElementById('adminApp') ||
                             !!sessionStorage.getItem('teklimakan_admin_auth') ||
                             localStorage.getItem('teklimakan_admin_logged_in') === 'true';
      if (!isAdminContext) return;

      const now = new Date();
      const hour = now.getHours();

      // A. ھەر يەكشەنبە ئەتىگەن سائەت 08:00 دە ھەپتىلىك خۇلاسە
      if (now.getDay() === 0 && hour >= 8) {
        const todayStr = now.toISOString().split('T')[0];
        const lastSentDate = localStorage.getItem('teklimakan_last_weekly_report_date');
        const lastSentAt = parseInt(localStorage.getItem('teklimakan_last_weekly_report_sent_at') || '0', 10);

        // ئەگەر بۈگۈن ياكى يېقىنقى 12 سائەت ئىچىدە ئەۋەتىلگەن بولسا، ياكى نۆۋەتتە ئەۋەتىلىۋاتقان بولسا، قەتئىي توختىتىش
        if (lastSentDate === todayStr || (Date.now() - lastSentAt < 12 * 60 * 60 * 1000) || this._weeklyReportSending) {
          return;
        }

        this._weeklyReportSending = true;
        localStorage.setItem('teklimakan_last_weekly_report_date', todayStr);
        localStorage.setItem('teklimakan_last_weekly_report_sent_at', Date.now().toString());

        console.log('⏰ Auto-triggering Sunday 08:00 Weekly Agent Performance Report (Admin Context)...');
        this.sendWeeklyAgentReportAndEncouragements({ notifyTelegram: true, notifySms: true })
          .finally(() => {
            this._weeklyReportSending = false;
          });
      }

      // B. ھەر ئاينىڭ 1-كۈنى ئەتىگەن سائەت 08:00 دە ئايلىق خۇلاسە
      if (now.getDate() === 1 && hour >= 8) {
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const lastSentMonth = localStorage.getItem('teklimakan_last_monthly_report_month');
        const lastMonthlySentAt = parseInt(localStorage.getItem('teklimakan_last_monthly_report_sent_at') || '0', 10);

        if (lastSentMonth === monthKey || (Date.now() - lastMonthlySentAt < 24 * 60 * 60 * 1000) || this._monthlyReportSending) {
          return;
        }

        this._monthlyReportSending = true;
        localStorage.setItem('teklimakan_last_monthly_report_month', monthKey);
        localStorage.setItem('teklimakan_last_monthly_report_sent_at', Date.now().toString());

        console.log('⏰ Auto-triggering 1st of Month 08:00 Monthly Agent Performance Report (Admin Context)...');
        this.sendMonthlyAgentReport({ notifyTelegram: true, notifyEmail: true })
          .finally(() => {
            this._monthlyReportSending = false;
          });
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

  // 🛍️ ۋاكالەتچىنىڭ تاۋار سېتىش ۋە زاكاز تىزىملىكى (خېرىدار ئۇچۇرلىرى پۈتۈنلەي چىقىرىۋېتىلگەن، پەقەت نېمە ساتتى، قاچان ساتتى ۋە پايدا كۆرۈنىدۇ)
  getAgentSalesOrderList(agentId) {
    if (!agentId) return [];
    const agent = this.getAgentById(agentId);
    const products = this.getProductsByAgent(agentId) || [];
    const prodMap = new Map();
    products.forEach(p => prodMap.set(p.id, p));

    const orders = this.getOrders();
    const salesList = [];
    const rate = Number(agent?.commissionRate !== undefined ? agent.commissionRate : 15);

    orders.forEach(order => {
      const orderDate = order.date || order.createdAt || new Date().toISOString().split('T')[0];
      const orderStatus = (order.status || 'ساقلاۋاتىدۇ').trim();
      const orderMaskedId = order.id ? ('#TK-' + String(order.id).replace(/\D/g, '').slice(-4)) : '#TK-ORD';

      (order.items || []).forEach(item => {
        // تاۋار ۋاكالەتچىگە تەۋەمۇ تەكشۈرۈش
        const isMatched = prodMap.has(item.id) || (order.agentId && order.agentId === agentId);
        if (isMatched) {
          const qty = Number(item.quantity) || 1;
          const price = Number(item.price) || 0;
          const subTotal = price * qty;
          const profit = Math.round(subTotal * (rate / 100));
          const prodObj = prodMap.get(item.id);

          salesList.push({
            id: 'SALE-' + (order.id || Math.random()) + '-' + (item.id || Math.random()),
            orderId: orderMaskedId,
            productId: item.id,
            productName: item.name || (prodObj ? prodObj.name : 'مەھسۇلات'),
            productImage: item.image || (prodObj ? prodObj.image : 'images/default-product.png'),
            quantity: qty,
            unit: item.unit || (prodObj ? prodObj.unit : 'دانە'),
            unitPrice: price,
            totalAmount: subTotal,
            agentProfit: profit,
            commissionRate: rate,
            date: orderDate,
            status: orderStatus
          });
        }
      });
    });

    // ئەگەر سىستېمىدا ۋاكالەتچىنىڭ سېتىش سانى بولۇپ تېخى زاكاز تەپسىلاتى تىزىلمىغان بولسا، تاۋارلىرى بويىچە يۈزەكى سېتىش خاتىرىسى ھاسىللاش
    const targetCount = Math.max(salesList.length, Number(agent?.monthlyOrders || 0));
    if (salesList.length === 0 && targetCount > 0 && products.length > 0) {
      const sampleProd = products[0];
      const pPrice = Number(sampleProd.price || 190);
      const profit = Math.round(pPrice * (rate / 100));
      for (let i = 0; i < targetCount; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (i % 5));
        const dStr = d.toISOString().split('T')[0];
        salesList.push({
          id: 'SALE-GEN-' + (1001 + i),
          orderId: '#TK-' + (2026 + i),
          productId: sampleProd.id,
          productName: sampleProd.name,
          productImage: sampleProd.image || 'images/default-product.png',
          quantity: 1,
          unit: sampleProd.unit || 'دانە',
          unitPrice: pPrice,
          totalAmount: pPrice,
          agentProfit: profit,
          commissionRate: rate,
          date: dStr,
          status: i === 0 ? 'يوللاندى' : 'تاماملاندى'
        });
      }
    }

    // ۋاقىت بويىچە يېڭىدىن كوناغا تىزىش
    salesList.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    return salesList;
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
    if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.upsertAgent === 'function') {
      const currentAgent = this.getAgentById(agentData.id) || agents[0];
      if (currentAgent) {
        window.TeklimakanSupabase.upsertAgent(currentAgent).catch(e => console.warn('Supabase saveAgent error:', e));
        if (typeof window.TeklimakanSupabase.invalidateAgentsCache === 'function') {
          window.TeklimakanSupabase.invalidateAgentsCache();
        }
      }
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

  async updateAgentStatus(agentId, newStatus) {
    let agents = this.getAgents('none');
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      agent.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
      this.notifyDataChange('agents');
      if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.upsertAgent === 'function') {
        try {
          await window.TeklimakanSupabase.upsertAgent(agent);
          if (typeof window.TeklimakanSupabase.invalidateAgentsCache === 'function') {
            window.TeklimakanSupabase.invalidateAgentsCache();
          }
        } catch (e) {
          console.warn('Supabase agent status sync error:', e);
        }
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
    const raw = String(identifier).trim();
    const term = raw.toLowerCase();
    const normPhone = this.normalizePhoneNumber(term);
    const cleanDigits = raw.replace(/\D/g, '');
    const agents = this.getAgents('none');
    const agent = agents.find(a => {
      if (a.id && a.id.toLowerCase() === term) return true;
      if (a.email && this.normalizeEmail(a.email) === term) return true;
      if (normPhone && this.normalizePhoneNumber(a.phone) === normPhone) return true;
      const aDigits = (a.phone || '').replace(/\D/g, '');
      if (cleanDigits && aDigits) {
        if (aDigits === cleanDigits) return true;
        if (cleanDigits.length >= 10 && aDigits.endsWith(cleanDigits.slice(-10))) return true;
        if (aDigits.length >= 10 && cleanDigits.endsWith(aDigits.slice(-10))) return true;
      }
      return false;
    });

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

  // 🔍 ۋاكالەتچىنى تېلېفون، ئېلخەت ياكى ID ئارقىلىق ئىزدەش (يەرلىك ۋە Supabase بۇلۇتتىن تولۇق ئىزدىنىدۇ)
  async findAgentAsync(identifier, forceCloud = false) {
    if (!identifier) return null;
    const raw = String(identifier).trim();
    const term = raw.toLowerCase();
    const normPhone = this.normalizePhoneNumber(term);
    const cleanDigits = raw.replace(/\D/g, '');

    const matchAgent = (a) => {
      if (!a) return false;
      if (a.id && a.id.toLowerCase() === term) return true;
      if (a.email && this.normalizeEmail(a.email) === term) return true;
      if (normPhone && this.normalizePhoneNumber(a.phone) === normPhone) return true;
      const aDigits = (a.phone || '').replace(/\D/g, '');
      if (cleanDigits && aDigits) {
        if (aDigits === cleanDigits) return true;
        if (cleanDigits.length >= 10 && aDigits.endsWith(cleanDigits.slice(-10))) return true;
        if (aDigits.length >= 10 && cleanDigits.endsWith(aDigits.slice(-10))) return true;
      }
      return false;
    };

    // 1. ئالدى بىلەن يەرلىك ساقلىغۇچ (localStorage) دىن ئىزدەش
    let agents = this.getAgents('none');
    let agent = agents.find(matchAgent);

    // 2. ئەگەر agent تېپىلمىسا، ياكى forceCloud=true بولسا، ياكى agent ھالىتى تېخى «تەستىق كۈتۈۋاتىدۇ» بولسا،
    // دەرھال Supabase بۇلۇت ئامبىرىدىن تەكشۈرۈپ تەستىقلانغان ئەڭ يېڭى ھالەتنى مەجبۇرىي ئوقۇپ يەرلىككە قاچىلاش
    const shouldFetchCloud = forceCloud || !agent || (agent && agent.status === 'تەستىق كۈتۈۋاتىدۇ');

    if (shouldFetchCloud) {
      try {
        let remoteAgents = null;
        if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.fetchAgents === 'function') {
          remoteAgents = await window.TeklimakanSupabase.fetchAgents(true);
        }

        // 🛡️ ئەگەر SDK ئارقىلىق ئوقۇش بوش ياكى تېخى ئۇلانمىغان بولسا، بىۋاسىتە REST ئارقىلىق چاقىرىش (تولۇق كاپالەت)
        if (!Array.isArray(remoteAgents) || remoteAgents.length === 0) {
          try {
            const resp = await fetch('https://hvvxnnnpukgpmwexcniq.supabase.co/rest/v1/agents?select=*', {
              headers: {
                'apikey': 'sb_publishable_PGV3YrYULBIiX1Xgo0tgag_FQWem2Hp',
                'Authorization': 'Bearer sb_publishable_PGV3YrYULBIiX1Xgo0tgag_FQWem2Hp'
              }
            });
            if (resp.ok) {
              remoteAgents = await resp.json();
            }
          } catch(fetchErr) {
            console.warn('findAgentAsync direct REST fallback error:', fetchErr);
          }
        }

        if (Array.isArray(remoteAgents) && remoteAgents.length > 0) {
          const localMap = new Map();
          agents.forEach(a => {
            if (a && a.id) localMap.set(a.id, a);
          });

          remoteAgents.forEach(ra => {
            let authorizedBrands = [];
            let password = '';
            let trustedDevices = [];
            let proposedBrands = '';
            let notes = '';
            let legalAgreement = null;
            let suspendedUntil = null;
            let suspensionReason = '';

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

            // يەرلىكتىكى كونىراپ قالغان تىزىملاتمىلارنى ئېلخەت ياكى تېلېفون ئارقىلىق تونۇپ، ھالىتىنى يېڭىلاش
            let existingLocal = localMap.get(ra.id);
            if (!existingLocal) {
              for (const [locId, locAgent] of localMap.entries()) {
                const sameEmail = ra.email && locAgent.email && this.normalizeEmail(ra.email) === this.normalizeEmail(locAgent.email);
                const samePhone = ra.phone && locAgent.phone && this.normalizePhoneNumber(ra.phone) === this.normalizePhoneNumber(locAgent.phone);
                if (sameEmail || samePhone) {
                  existingLocal = locAgent;
                  localMap.delete(locId); // كونا تەستىقلانمىغان قالدۇق نۇسخىنى چىقىرىپ تاشلاش
                  break;
                }
              }
            }

            localMap.set(ra.id, {
              ...(existingLocal || {}),
              password: password || existingLocal?.password || '',
              trustedDevices: trustedDevices.length > 0 ? trustedDevices : (existingLocal?.trustedDevices || []),
              id: ra.id,
              name: ra.name,
              email: ra.email,
              phone: ra.phone,
              city: ra.city || existingLocal?.city || 'ئىستانبۇل',
              status: ra.status || 'تەستىقلاندى',
              reputation: ra.reputation || existingLocal?.reputation || 'ئىشەنچىلىك سودىگەر',
              canPublishMultilingual: !!ra.can_publish_multilingual,
              authorizedBrands: authorizedBrands.length > 0 ? authorizedBrands : (existingLocal?.authorizedBrands || []),
              registeredAt: ra.registered_at || existingLocal?.registeredAt,
              authExpireDate: ra.auth_expire_date || existingLocal?.authExpireDate,
              certCode: ra.cert_code || existingLocal?.certCode,
              productsCount: ra.products_count !== undefined ? ra.products_count : (existingLocal?.productsCount || 0),
              salesTotal: Number(ra.sales_total !== undefined ? ra.sales_total : (existingLocal?.salesTotal || 0)),
              monthlySales: Number(ra.monthly_sales !== undefined ? ra.monthly_sales : (existingLocal?.monthlySales || 0)),
              monthlyOrders: Number(ra.monthly_orders !== undefined ? ra.monthly_orders : (existingLocal?.monthlyOrders || 0)),
              commissionRate: Number(ra.commission_rate !== undefined ? ra.commission_rate : (existingLocal?.commissionRate || 15)),
              violationsCount: Number(ra.violations_count !== undefined ? ra.violations_count : (existingLocal?.violationsCount || 0)),
              proposedBrands: proposedBrands || existingLocal?.proposedBrands || '',
              notes: notes || existingLocal?.notes || '',
              legalAgreement: legalAgreement || existingLocal?.legalAgreement || null,
              suspendedUntil: suspendedUntil || existingLocal?.suspendedUntil || null,
              suspensionReason: suspensionReason || existingLocal?.suspensionReason || ''
            });
          });

          agents = Array.from(localMap.values());
          this.saveAgents(agents);

          agent = agents.find(matchAgent);
        }
      } catch (sbErr) {
        console.warn('findAgentAsync Supabase fetch error:', sbErr);
      }
    }

    return agent || null;
  }

  // ⚡ ۋاكالەتچى مەخپىي شىفىرىنى شەرتسىز، بىۋاسىتە يېڭىلاش (Direct Unconditional Password Reset)
  async resetAgentPasswordDirect(identifier, newPassword, deviceToken = '') {
    if (!identifier) {
      return { success: false, message: 'تېلېفون نومۇرى، ئېلخەت ياكى ۋاكالەتچى كودىڭىزنى كىرگۈزۈڭ!' };
    }
    const cleanPw = (newPassword || '').trim();
    if (!cleanPw || cleanPw.length < 6) {
      return { success: false, message: 'يېڭى مەخپىي شىفىر ئەڭ كەم دېگەندە 6 خانىلىق بولۇشى شەرت!' };
    }

    const agent = await this.findAgentAsync(identifier);
    if (!agent) {
      return { 
        success: false, 
        message: 'بۇ ئۇچۇرغا تەۋە ۋاكالەتچى بايقالمىدى! تېلېفون نومۇرى ياكى ئېلخېتىڭىزنى قايتا تەكشۈرۈپ كۆرۈڭ.' 
      };
    }

    // مەخپىي شىفىرنى يېڭىلاش
    agent.password = cleanPw;
    agent.passwordResetCode = null;
    agent.passwordResetExpires = null;

    if (deviceToken) {
      if (!Array.isArray(agent.trustedDevices)) agent.trustedDevices = [];
      if (!agent.trustedDevices.includes(deviceToken)) agent.trustedDevices.push(deviceToken);
    }

    let allAgents = this.getAgents('none');
    const idx = allAgents.findIndex(a => a.id === agent.id);
    if (idx !== -1) {
      allAgents[idx] = agent;
    } else {
      allAgents.unshift(agent);
    }
    this.saveAgents(allAgents);

    // 🌐 Supabase بۇلۇت ئامبىرىغا دەرھال يېڭىلاپ ساقلاش
    if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.upsertAgent === 'function') {
      try {
        await window.TeklimakanSupabase.upsertAgent(agent);
      } catch(sbErr) {
        console.warn('Supabase upsert error in resetAgentPasswordDirect:', sbErr);
      }
    }

    // 🤖 باشقۇرغۇچىغا Telegram ئارقىلىق بىخەتەرلىك ئۇقتۇرۇشى ئەۋەتىش
    try {
      this.sendTelegramAlert({
        title: `🔑 [ۋاكالەتچى پارولى يېڭىلاندى] ${agent.name}`,
        message: `👤 <b>ۋاكالەتچى:</b> <b>${agent.name}</b> (<code>${agent.id}</code>)\n` +
                 `📞 <b>تېلېفون:</b> <code>${agent.phone || '-'}</code>\n` +
                 `📧 <b>ئېلخەت:</b> <code>${agent.email || '-'}</code>\n` +
                 `🕒 <b>ۋاقتى:</b> ${new Date().toLocaleString('ug-CN', { hour12: false })}\n` +
                 `✅ مەخپىي شىفىر شەرتسىز مۇۋەپپەقىيەتلىك ئالماشتۇرۇلدى.`,
        isUrgent: false
      });
    } catch(e) {}

    // SMS ۋە سىستېما خاتىرىسى
    this.saveSmsLog({
      id: 'LOG-RESET-DIRECT-' + Date.now(),
      recipientName: agent.name,
      phone: agent.phone || agent.email || 'SYSTEM',
      recipientRole: 'ۋاكالەتچى',
      channel: 'agent_direct_reset',
      message: `[مەخپىي شىفىر ئالماشتۇرۇلدى] ۋاكالەتچى ${agent.name} مەخپىي شىفىرىنى مۇۋەپپەقىيەتلىك يېڭىلىدى.`,
      orderId: 'RESET-DIRECT',
      timestamp: new Date().toLocaleString('ug-CN', { hour12: false })
    });

    this.notifyDataChange('agents');

    return {
      success: true,
      agent,
      message: '✅ مەخپىي شىفىرىڭىز مۇۋەپپەقىيەتلىك يېڭىلاندى!'
    };
  }

  // 📩 پارول ئەسلىگە كەلتۈرۈش كودى تەلەپ قىلىش (Reset Code Request - ئەگەر قايتا ئىشلىتىلسە)
  async requestAgentPasswordReset(identifier) {
    if (!identifier) return { success: false, message: 'ئېلخەت ياكى تېلېفون نومۇرىنى كىرگۈزۈڭ!' };
    const agent = await this.findAgentAsync(identifier);

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

    // تېلېگرامغا ئەۋەتىش
    try {
      this.sendTelegramAlert({
        title: `🔑 [ۋاكالەتچى پارول ئەسلىگە كەلتۈرۈش] ${agent.name}`,
        message: `ۋاكالەتچى: ${agent.name} (${agent.id})\n📞 تېلېفون: ${agent.phone}\n📧 ئېلخەت: ${agent.email}\n🔢 دەلىللەش كودى: <b>${code}</b> (15 مىنۇت كۈچكە ئىگە)\n🔗 ئۇلانما: ${resetLink}`,
        isUrgent: false
      });
    } catch(e) {}

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
      message: `دەلىللەش كودى ۋە ئۇلانما ھاسىللاندى.`
    };
  }

  // ✅ دەلىللەش كودىنى تەكشۈرۈپ يېڭى پارول بېكىتىش
  async verifyAndResetAgentPassword(agentId, resetCode, newPassword, deviceToken = '') {
    if (!agentId || !newPassword) {
      return { success: false, message: 'بارلىق مەزمۇنلارنى تولدۇرۇڭ!' };
    }
    const agent = await this.findAgentAsync(agentId);
    if (!agent) return { success: false, message: 'ۋاكالەتچى بايقالمىدى!' };

    if (resetCode && agent.passwordResetCode && agent.passwordResetCode !== resetCode.trim()) {
      return { success: false, message: '❌ كىرگۈزگەن دەلىللەش كودى خاتا! قايتا تەكشۈرۈپ كىرگۈزۈڭ.' };
    }

    if (newPassword.trim().length < 6) {
      return { success: false, message: 'مەخپىي شىفىر كەم دېگەندە 6 خانىلىق بولۇشى شەرت!' };
    }

    return await this.resetAgentPasswordDirect(agent.id, newPassword, deviceToken);
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
      dailyFlashDealsDiscount: 15,
      dailyProductLimit: 1
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
    let agents = this.getAgents('none');
    const raw = String(agentIdentifier).trim();
    const term = raw.toLowerCase();
    const normPhone = this.normalizePhoneNumber(term);
    const cleanDigits = raw.replace(/\D/g, '');

    const idx = agents.findIndex(a => {
      if (!a) return false;
      if (a.id && a.id.toLowerCase() === term) return true;
      if (a.email && this.normalizeEmail(a.email) === term) return true;
      if (normPhone && this.normalizePhoneNumber(a.phone) === normPhone) return true;
      const aDigits = (a.phone || '').replace(/\D/g, '');
      if (cleanDigits && aDigits) {
        if (aDigits === cleanDigits) return true;
        if (cleanDigits.length >= 10 && aDigits.endsWith(cleanDigits.slice(-10))) return true;
        if (aDigits.length >= 10 && cleanDigits.endsWith(aDigits.slice(-10))) return true;
      }
      return false;
    });
    if (idx === -1) return { success: false, message: 'ۋاكالەتچى تېپىلمىدى!' };

    const agent = agents[idx];
    const rules = this.getAgentDailyRules();
    const todayStr = new Date().toISOString().split('T')[0];

    // ئەگەر بۈگۈن ئاللىقاچان ئىمزا قويغان بولسا
    if (agent.lastCheckInDate && agent.lastCheckInDate.startsWith(todayStr)) {
      return {
        success: false,
        alreadyCheckedIn: true,
        agent: agent,
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

    // 🌐 Supabase غا دەرھال ئۇلاش
    if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.upsertAgent === 'function') {
      try {
        window.TeklimakanSupabase.upsertAgent(agent);
      } catch (sbErr) {}
    }

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

  toWhatsAppChatId(phoneStr) {
    if (!phoneStr) return '';
    let digits = String(phoneStr).replace(/\D/g, '');
    if (digits.startsWith('0090')) digits = digits.slice(4);
    else if (digits.startsWith('90') && digits.length >= 12) digits = digits.slice(2);
    else if (digits.startsWith('0')) digits = digits.slice(1);
    
    if (digits.length === 10 && digits.startsWith('5')) {
      return '90' + digits + '@c.us';
    }
    if (digits.length >= 10) {
      return digits + '@c.us';
    }
    return '';
  }

  toCleanWhatsAppPhone(phoneStr) {
    const chatId = this.toWhatsAppChatId(phoneStr);
    return chatId ? chatId.replace('@c.us', '') : '';
  }

  // ==================== 💬 مەركىزىي WhatsApp ئاپتوماتىك خېرىدار ئۇقتۇرۇشى (Green-API) ====================
  async sendWhatsAppCustomerMessage(phoneStr, message) {
    try {
      const chatId = this.toWhatsAppChatId(phoneStr);
      if (!chatId) {
        console.warn('sendWhatsAppCustomerMessage: invalid phone number:', phoneStr);
        return { success: false, error: 'invalid_phone' };
      }

      const settings = this.getSettings() || {};
      if (settings.whatsappEnabled === false) return { success: false, error: 'disabled' };

      const res = await fetch('/api/whatsapp-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneStr, message })
      });

      const data = await res.json();
      const ok = res.ok && data && data.success === true;
      if (ok) {
        console.log('[WhatsApp API] Message sent successfully to', chatId, 'ID:', data.idMessage);
      } else {
        console.warn('[WhatsApp API] Failed to send message:', data);
      }
      return { success: ok, data };
    } catch (err) {
      console.warn('sendWhatsAppCustomerMessage error:', err);
      return { success: false, error: err.message };
    }
  }

  // ==================== 🤖 مەركىزىي Telegram دەل ۋاقتىدا ئۇقتۇرۇش ئەۋەتكۈچى ====================
  async sendTelegramAlert({ title, message, isUrgent = false, extraData = null }) {
    try {
      const settings = this.getSettings() || {};
      const enabled = settings.telegramEnabled !== false;

      if (!enabled && !isUrgent) {
        return { success: false, message: 'Telegram disabled' };
      }

      const res = await fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, isUrgent, extraData })
      });
      const data = await res.json();
      return { success: res.ok && data.success === true, data };
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

  // 📅 ۋاكالەتچىنىڭ كۈندىلىك مەھسۇلات يوللاش چېكىنى تەكشۈرۈش (Daily Upload Limit: Strictly 1 Product Per Day for Quality Inspection)
  checkAgentDailyProductLimit(agentIdentifier) {
    if (!agentIdentifier) {
      return { allowed: true, countToday: 0, limit: 1, remaining: 1, message: '' };
    }
    const agent = this.getAgentById(agentIdentifier);
    if (!agent) {
      return { allowed: true, countToday: 0, limit: 1, remaining: 1, message: '' };
    }

    if (agent.status === 'توختىتىلدى') {
      return { allowed: false, countToday: 0, limit: 0, remaining: 0, isSuspended: true, message: '⛔ ھېساباتىڭىز ۋاقىتلىق توختىتىلغان!' };
    }
    if (agent.status === 'تەستىق كۈتۈۋاتىدۇ') {
      return { allowed: false, countToday: 0, limit: 0, remaining: 0, isPending: true, message: '⏳ ئىلتىماسىڭىز تېخى تەستىقلانمىدى.' };
    }

    // ئەگەر ۋاكالەتچى چەكلىمىدىن كەچۈرۈم قىلىنغان بولسا
    if (agent.isExemptFromDailyRule) {
      return { allowed: true, countToday: 0, limit: 999, remaining: 999, message: 'چەكسىز' };
    }

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // سىستېمىدىكى تاۋارلاردىن بۈگۈن بۇ ۋاكالەتچى قوشقان يېڭى تاۋارلارنى ساناش (رەت قىلىنغان ياكى ئۆچۈرۈلگەنلەر ھېسابلانمايدۇ)
    const allProducts = this.getProducts();
    const uploadedToday = allProducts.filter(p => {
      if (!p || !p.isAgentSubmitted || String(p.agentId) !== String(agent.id)) return false;
      if (p.approvalStatus === 'رەت قىلىندى' || p.isDeleted === true) return false;
      if (!p.createdAt) return false;
      const d = new Date(p.createdAt);
      if (isNaN(d.getTime())) return false;
      const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return dStr === todayStr;
    });

    const count = uploadedToday.length;
    const rules = this.getAgentDailyRules();
    // ئالىي باشقۇرغۇچىنىڭ سۈپەتلىك تەكشۈرۈپ تەستىقلاپ يېتىشەلەيدىغان بولۇشى ئۈچۈن كۈنگە تەستىقلانغان چەك: مەھكەم 1 تال
    const limit = Number(agent.dailyProductLimit !== undefined ? agent.dailyProductLimit : (rules.dailyProductLimit !== undefined ? rules.dailyProductLimit : 1));

    if (count >= limit) {
      return {
        allowed: false,
        countToday: count,
        limit: limit,
        todayStr: todayStr,
        remaining: 0,
        message: '⚠️ بۈگۈنكى يېڭى تاۋار يوللاش پۇرسىتىڭىز توشتى (1/1)!\n\nھۆرمەتلىك سېتىش ۋاكالەتچىسى، باشقۇرغۇچىنىڭ ھەر بىر تاۋارنى ئەستايىدىل تەكشۈرۈپ تەستىقلىشىغا كاپالەتلىك قىلىش ئۈچۈن، كۈنىگە پەقەت 1 تال يېڭى مەھسۇلات يوللاشقا رۇخسەت قىلىنىدۇ. سىز بۈگۈن 1 تال تاۋار يوللاپ بولدىڭىز، كېيىنكى تاۋارنى ئەتە يوللىيالايسىز.\n\n💡 ئەسكەرتىش: مەۋجۇت تاۋارلىرىڭىزنىڭ باھاسى ۋە زاپىسىنى خالىغان ۋاقىتتا چەكلىمىسىز تەھرىرلىيەلەيسىز!'
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

  // 🔤 تاۋار نامىنى تەكشۈرۈش ۋە سېلىشتۇرۇش ئۈچۈن قېلىپلاشتۇرۇش
  normalizeProductName(name) {
    if (!name) return '';
    return String(name)
      .toLowerCase()
      .replace(/[\u064B-\u065F\u0670\u0640]/g, '') // ھەرىكەت، تەنۋىن ۋە سوزۇقلارنى چىقىرىش
      .replace(/ئ/g, '') // ھەمزىنى چىقىرىش
      .replace(/[\s\-_,.:;()\/\\+]+/g, ' ') // بوشلۇق ۋە بەلگىلەرنى بىردەك قىلىش
      .trim();
  }

  // ==================== 🛡️ ئەقلىي تاۋار تەكرارلىق ۋە ئوخشاشلىق تەكشۈرۈش سىستېمىسى (Smart Duplicate Detection) ====================

  // 1. ئالىي دەرىجىلىك ئۇيغۇرچە ۋە كۆپ تىللىق نام قېلىپلاشتۇرۇش
  normalizeProductNameAdv(name) {
    if (!name) return '';
    return String(name)
      .toLowerCase()
      .replace(/[\u064B-\u065F\u0670\u0640]/g, '') // ھەرىكەت ۋە تەنۋىن
      .replace(/ئ/g, '') // ھەمزە
      .replace(/[يىې]/g, 'ى') // سوزۇق ۋە ئۈزۈك «ي» شەكلى
      .replace(/[وۇۆۈ]/g, 'ۇ') // «ۋ/و/ۇ/ۆ/ۈ» نۇسخىلىرى
      .replace(/[كگڭ]/g, 'ك') // كاف تۈرلىرى
      .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
      .replace(/\bمېيى\b/g, 'يېغى').replace(/\bماي\b/g, 'ياغ')
      .replace(/\bسۈپەتلىك\b|\bئەلا\b|\bساپ\b|\bتەبىئىي\b|\bيېڭى\b|\bخالاس\b|\bمەھسۇلاتى\b|\bdoğal\b|\bsaf\b|\bkaliteli\b/gi, '')
      .replace(/[\s\-_,.:;()\/\\+]+/g, ' ')
      .trim();
  }

  // 2. مەھسۇلات ئۆلچىمى / سىغىمىنى ئايرىپ ئېلىش (Extract Capacity / Size / Spec)
  extractProductSpec(str) {
    if (!str) return null;
    const m = String(str).match(/(\d+(?:\.\d+)?)\s*(ml|l|g|kg|مىللىلېتىر|گىرام|دانە|تال|قۇتا)/i);
    if (!m) return null;
    let unit = m[2].toLowerCase();
    if (unit === 'مىللىلېتىر') unit = 'ml';
    if (unit === 'گىرام') unit = 'g';
    if (unit === 'تال') unit = 'دانە';
    return {
      raw: m[0].trim(),
      value: parseFloat(m[1]),
      unit: unit,
      normalized: String(parseFloat(m[1])) + unit
    };
  }

  // 3. ئۆلچەم بەلگىلىرىنى چىقىرىپ تاشلاپ تۈپ نامىنى ئېلىش
  stripProductSpecs(str) {
    if (!str) return '';
    return String(str)
      .replace(/\b\d+(?:\.\d+)?\s*(?:ml|l|g|kg|مىللىلېتىر|گىرام|دانە|تال|قۇتا)\b/gi, '')
      .replace(/[\s\-_,.:;()\/\\+]+/g, ' ')
      .trim();
  }

  // 4. تېكىست ئارىلىقىنى ھېسابلاش (Levenshtein Distance)
  calculateLevenshteinDistance(s1, s2) {
    const m = s1.length, n = s2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = s1[i - 1] === s2[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  }

  // 5. ئىككى مەھسۇلات نامىنىڭ ئەقلىي ئوخشاشلىقىنى سېلىشتۇرۇش
  calculateProductSimilarity(t1, t2) {
    if (!t1 || !t2) return { similarity: 0, diffSpecs: false, isMatch: false };
    const spec1 = this.extractProductSpec(t1);
    const spec2 = this.extractProductSpec(t2);
    const diffSpecs = !!(spec1 && spec2 && spec1.normalized !== spec2.normalized);

    const base1 = this.normalizeProductNameAdv(this.stripProductSpecs(t1));
    const base2 = this.normalizeProductNameAdv(this.stripProductSpecs(t2));

    if (base1 === base2 && base1.length >= 2) {
      const sim = diffSpecs ? 0.60 : 1.0;
      return {
        similarity: sim,
        diffSpecs: diffSpecs,
        spec1: spec1 ? spec1.raw : null,
        spec2: spec2 ? spec2.raw : null,
        isMatch: !diffSpecs
      };
    }

    const words1 = base1.split(' ').filter(w => w.length > 1);
    const words2 = base2.split(' ').filter(w => w.length > 1);
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    let intersection = 0;
    set1.forEach(w => { if (set2.has(w)) intersection++; });
    const union = new Set([...words1, ...words2]).size;
    const jaccard = union > 0 ? intersection / union : 0;
    const minWords = Math.min(set1.size, set2.size);
    const containment = minWords > 0 ? intersection / minWords : 0;

    const maxLen = Math.max(base1.length, base2.length);
    const levDist = this.calculateLevenshteinDistance(base1, base2);
    const levScore = maxLen > 0 ? 1 - (levDist / maxLen) : 1;

    let score = Math.max(jaccard, levScore);
    if (containment === 1 && minWords >= 2) {
      score = Math.max(score, 0.88);
    }

    if (diffSpecs) {
      score = score * 0.70; // سىغىم پەرقى بايقالسا تەكرارلىق جازاسى تۆۋەنلەيدۇ (يېڭى ئۆلچەم سۈپىتىدە قارىلىدۇ)
    }

    return {
      similarity: Math.round(score * 100) / 100,
      diffSpecs: diffSpecs,
      spec1: spec1 ? spec1.raw : null,
      spec2: spec2 ? spec2.raw : null,
      isMatch: score >= 0.75 && !diffSpecs
    };
  }

  // 6. 📸 سۈرەتنىڭ 64 بىتلىق پەرقلىق بارماق ئىزىنى ھېسابلاش (Compute 64-bit Perceptual dHash)
  async computeImageDHash(imageSource) {
    if (!imageSource) return null;
    if (typeof window === 'undefined' || !window.document) return null;
    return new Promise((resolve) => {
      try {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = 9;
            canvas.height = 8;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 9, 8);
            const imgData = ctx.getImageData(0, 0, 9, 8).data;
            const grays = [];
            for (let i = 0; i < imgData.length; i += 4) {
              grays.push(0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2]);
            }
            let hash = '';
            for (let y = 0; y < 8; y++) {
              for (let x = 0; x < 8; x++) {
                hash += (grays[y * 9 + x] > grays[y * 9 + x + 1] ? '1' : '0');
              }
            }
            resolve(hash);
          } catch (canvasErr) {
            resolve(null);
          }
        };
        img.onerror = () => resolve(null);
        if (typeof imageSource === 'string') {
          img.src = imageSource;
        } else if (imageSource && imageSource.src) {
          img.src = imageSource.src;
        } else {
          resolve(null);
        }
      } catch (e) {
        resolve(null);
      }
    });
  }

  // 7. 🔍 ئىككى سۈرەتنىڭ dHash ئارىلىقىنى سېلىشتۇرۇش (Hamming Distance)
  compareImageDHash(h1, h2) {
    if (!h1 || !h2 || h1.length !== 64 || h2.length !== 64) {
      return { distance: 64, similarity: 0, isMatch: false };
    }
    let dist = 0;
    for (let i = 0; i < 64; i++) {
      if (h1[i] !== h2[i]) dist++;
    }
    const similarity = (64 - dist) / 64;
    return {
      distance: dist,
      similarity: Math.round(similarity * 100) / 100,
      isMatch: dist <= 10 // <= 10 bits mismatch = >= 84.4% visual similarity
    };
  }

  // 8. 🛡️ تاۋار نامى ۋە سۈرىتى بويىچە بىر تۇتاش ئەقلىي تەكرارلىق ۋە كۋوتا تەكشۈرۈش
  checkProductDuplicate(options = {}) {
    const name = (options.name || '').trim();
    const currentId = options.id || options.currentProductId || null;
    const currentAgentId = options.agentId || null;
    const imageHash = options.imageHash || null;
    const maxQuota = options.maxQuota || 3;

    if (!name && !imageHash) {
      return { isDuplicate: false, blocked: false, severity: 'none', similarityScore: 0, message: '' };
    }

    const allProducts = this.getProducts();
    let highestMatch = null;
    let highestSim = 0;
    let matchType = 'none';
    let diffSpecs = false;
    let specInfo = null;
    const existingAgentIds = new Set();

    for (const p of allProducts) {
      if (!p || !p.name) continue;
      if (p.approvalStatus === 'رەت قىلىندى' || p.isDeleted) continue;
      if (currentId && String(p.id) === String(currentId)) continue;

      // 1. تاۋار نامى ئوخشاشلىقىنى سېلىشتۇرۇش
      if (name) {
        const simRes = this.calculateProductSimilarity(name, p.name);
        let trSim = 0;
        if (p.translations && p.translations.tr && p.translations.tr.name) {
          trSim = this.calculateProductSimilarity(name, p.translations.tr.name).similarity;
        }
        const effectiveSim = Math.max(simRes.similarity, trSim);

        if (effectiveSim > highestSim) {
          highestSim = effectiveSim;
          highestMatch = p;
          matchType = 'name';
          diffSpecs = simRes.diffSpecs;
          specInfo = { spec1: simRes.spec1, spec2: simRes.spec2 };
        }

        // سۇپىدا بۇ ئوخشاش تاۋارنى ساتىدىغان باشقا ۋاكالەتچىلەر سانىنى قوشۇش
        if (effectiveSim >= 0.80 && !simRes.diffSpecs) {
          const aId = p.agentId || (p.isAgentSubmitted ? ('agent_' + p.id) : null);
          if (aId) {
            if (!currentAgentId || String(aId) !== String(currentAgentId)) {
              existingAgentIds.add(String(aId));
            }
          }
        }
      }

      // 2. سۈرەتنىڭ dHash ئوخشاشلىقىنى سېلىشتۇرۇش
      if (imageHash && p.imageDHash) {
        const imgComp = this.compareImageDHash(imageHash, p.imageDHash);
        if (imgComp.isMatch && imgComp.similarity > highestSim) {
          highestSim = imgComp.similarity;
          highestMatch = p;
          matchType = 'image';
        }
      }
    }

    // كۋوتا ھېسابلاش
    const agentCount = existingAgentIds.size;
    const quotaReached = agentCount >= maxQuota;

    // ئەگەر ئۆلچىمى ياكى سىغىمى پەرقلىق بولسا (مەسىلەن: 25ml vs 100ml)، مۇستەقىل تۈر دەپ قارىلىدۇ
    if (diffSpecs && specInfo) {
      return {
        isDuplicate: false,
        blocked: false,
        severity: 'none',
        isVariant: true,
        specDiff: specInfo,
        matchedProduct: highestMatch,
        similarityScore: Math.round(highestSim * 100),
        message: 'ℹ️ «' + highestMatch.name + '» بىلەن ئوخشاش، ئەمما ئۆلچىمى پەرقلىق نۇسخا سۈپىتىدە قوشۇلىدۇ (' + (specInfo.spec1 || '') + ' vs ' + (specInfo.spec2 || '') + ').'
      };
    }

    const agentCode = currentAgentId ? ('&agent=' + currentAgentId) : '';
    const origin = (typeof window !== 'undefined' && window.location) ? (window.location.origin + window.location.pathname) : 'https://teklimakan.com';
    const coSellUrl = highestMatch ? (origin + '?prod=' + highestMatch.id + agentCode) : '';

    if (highestSim >= 0.80 || quotaReached) {
      const reason = quotaReached ? 'quota_reached' : (matchType === 'image' ? 'duplicate_image' : 'similar_name');
      let msg = '';
      if (quotaReached) {
        msg = '⚠️ «' + highestMatch.name + '» ناملىق تاۋارنى ئاللىقاچان ' + agentCount + ' نەپەر باشقا سېتىش ۋاكالەتچىسى ئېلان قىلىپ بولغان (ئەڭ كۆپ بولغاندا ' + maxQuota + ' كۋوتا تولدى).\n\nبۇ تاۋارنى تەكرار كىرگۈزمەي، بىۋاسىتە شۇ تاۋارنىڭ شەخسىي سېتىش ئۇلانمىسىنى ئېلىپ ساتسىڭىز پايدىڭىز ئوخشاشلا ھېسابلىنىدۇ!';
      } else if (matchType === 'image') {
        msg = '📸 سىز يۈكلىگەن رەسىم مەۋجۇت تاۋار «' + highestMatch.name + '» نىڭ رەسىمى بىلەن تەكرار (%' + Math.round(highestSim * 100) + ' ئوخشاشلىق)!\n\nتوربېكەت سۈپىتى ۋە Google SEO دەرىجىسى ئۈچۈن باشقا ئۆزگىچە رەسىم ئىشلىتىڭ ياكى سېتىش ئۇلانمىسى ئارقىلىق سېتىڭ.';
      } else {
        msg = '⚠️ دىققەت: دۇكاندا بۇ مەھسۇلاتقا ئوپمۇ-ئوخشاش «' + highestMatch.name + '» مەۋجۇت (%' + Math.round(highestSim * 100) + ' ئوخشاشلىق)!\n\nئوخشاش تاۋارنى قايتا يوللاپ سۈپەتسىز كارتوچكا كۆپەيتمەي، مەۋجۇت تاۋارنىڭ تارقىتىش ئۇلانمىسىنى ئېلىپ بىۋاسىتە ساتسىڭىز مەنپەئەتىڭىز كاپالەتكە ئىگە بولىدۇ.';
      }

      return {
        isDuplicate: true,
        blocked: true,
        severity: 'high',
        reason: reason,
        agentCount: agentCount,
        maxQuota: maxQuota,
        similarityScore: Math.round(highestSim * 100),
        matchedProduct: highestMatch,
        coSellUrl: coSellUrl,
        message: msg,
        shortBadge: quotaReached ? (agentCount + '/' + maxQuota + ' تولدى') : ('%' + Math.round(highestSim * 100) + ' تەكرار')
      };
    } else if (highestSim >= 0.60) {
      return {
        isDuplicate: false,
        blocked: false,
        severity: 'medium',
        reason: 'partial_name_match',
        agentCount: agentCount,
        maxQuota: maxQuota,
        similarityScore: Math.round(highestSim * 100),
        matchedProduct: highestMatch,
        coSellUrl: coSellUrl,
        message: '💡 تەۋسىيە: دۇكاندىكى «' + highestMatch.name + '» بىلەن يېقىن كېلىدۇ (%' + Math.round(highestSim * 100) + ' ئوخشاش). ئەگەر ئۆلچىمى ياكى ماركىسى پەرقلىق بولسا، نامىدا سىغىم ياكى ماركىنى ئېنىق ئەسكەرتىپ داۋاملاشتۇرۇڭ.',
        shortBadge: '%' + Math.round(highestSim * 100) + ' ئوخشاشلىق'
      };
    }

    return {
      isDuplicate: false,
      blocked: false,
      severity: 'none',
      similarityScore: Math.round(highestSim * 100),
      matchedProduct: null,
      message: '✅ بۇ مەھسۇلات تېخى يوق، تۇنجى بولۇپ سېتىش پۇرسىتى سىزدە!'
    };
  }

  // 👥 ئوخشاش مەھسۇلاتنى كۆپ بولغاندا 3 نەپەر ۋاكالەتچى سېتىش چېكىنى تەكشۈرۈش (Max 3 Agents Per Identical Product)
  checkProductAgentQuota(productName, currentProductId = null, currentAgentId = null, maxAgents = 3) {
    if (!productName || typeof productName !== 'string') {
      return { allowed: true, count: 0, max: maxAgents, remaining: maxAgents, message: '' };
    }

    const targetNorm = this.normalizeProductName(productName);
    if (!targetNorm || targetNorm.length < 2) {
      return { allowed: true, count: 0, max: maxAgents, remaining: maxAgents, message: '' };
    }

    const allProducts = this.getProducts();
    const existingAgentIds = new Set();

    allProducts.forEach(p => {
      if (!p || !p.name) return;
      // ئەگەر رەت قىلىنغان تاۋار بولسا ھېسابقا كىرمەيدۇ
      if (p.approvalStatus === 'رەت قىلىندى') return;
      // ئەگەر نۆۋەتتىكى تەھرىرلىنىۋاتقان تاۋار بولسا تاشلىۋېتىلىدۇ
      if (currentProductId && String(p.id) === String(currentProductId)) return;

      const pNorm = this.normalizeProductName(p.name);
      // ئوخشاش نام بولۇش شەرتى
      if (pNorm === targetNorm) {
        const aId = p.agentId || (p.isAgentSubmitted ? ('agent_' + p.id) : null);
        if (aId) {
          // ئەگەر مەزكۇر ۋاكالەتچى ئۆزى ئاللىقاچان بار بولسا چىقىرىۋېتىمىز
          if (currentAgentId && String(aId) === String(currentAgentId)) return;
          existingAgentIds.add(String(aId));
        }
      }
    });

    const count = existingAgentIds.size;

    if (count >= maxAgents) {
      return {
        allowed: false,
        count: count,
        max: maxAgents,
        remaining: 0,
        message: `⚠️ «${productName.trim()}» ناملىق مەھسۇلاتنى ئاللىقاچان ${count} نەپەر باشقا سېتىش ۋاكالەتچىسى ئېلان قىلىپ بولغان!\n\nسىستېما بەلگىلىمىسى بويىچە، بازار تەڭپۇڭلۇقى ۋە سېتىش سۈپىتىنى قوغداش ئۈچۈن ھەربىر مەھسۇلاتنى ئەڭ كۆپ بولغاندا ${maxAgents} نەپەر ۋاكالەتچى سېتالايدۇ (بۇ تاۋارنىڭ ۋاكالەتچىلىك كۋوتىسى توشتى).\n\nسىز بۇ تاۋارنى يوللىيالمايسىز؛ باشقا ئوخشىمايدىغان مەھسۇلات تاللاپ سۇنۇڭ.`
      };
    }

    return {
      allowed: true,
      count: count,
      max: maxAgents,
      remaining: maxAgents - count,
      message: count > 0 
        ? `بۇ مەھسۇلاتنى ھازىر ${count} ۋاكالەتچى سېتىۋاتىدۇ (يەنە ${maxAgents - count} نەپەر ۋاكالەتچى يوللىيالايدۇ).` 
        : 'بۇ مەھسۇلاتنى تېخى ھېچقانداق ۋاكالەتچى سۇنمىغان، تۇنجى بولۇپ سېتىش پۇرسىتى سىزدە!'
    };
  }

  submitAgentProduct(agentIdentifier, productData) {
    if (!agentIdentifier) {
      return { success: false, message: 'ۋاكالەتچى ئۇچۇرى مەلۇم ئەمەس!' };
    }
    const agent = this.getAgentById(agentIdentifier);
    if (!agent) {
      return { success: false, message: 'بۇ ئۇچۇر بىلەن تىزىملاتقان ۋاكالەتچى بايقالمىدى.' };
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
        message: `⛔ ۋاكالەتچىلىك ھېساباتىڭىز تېلېفون نومۇرى ياكى تور ئۇلانمىسى قوشۇش قائىدىسىگە خىلاپلىق قىلغانلىقىڭىز ئۈچۈن (${daysCount} كۈن) بارلىق مەشغۇلاتتىن توختىتىلغان! توختاش ئاخىرلىشىش ۋاقتى: ${untilText}.` 
      };
    }

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

    // 👥 ئوخشاش مەھسۇلاتنى كۆپ بولغاندا 3 نەپەر ۋاكالەتچى ئېلان قىلىش چېكى (Max 3 Agents Per Identical Product)
    const quotaCheck = this.checkProductAgentQuota(productData.name, productData.id, agent.id, 3);
    if (!quotaCheck.allowed) {
      return {
        success: false,
        productQuotaReached: true,
        message: quotaCheck.message
      };
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
    // 🛡️ ئەگەر يەرلىك ساندان قۇرۇق بولۇپ قالسا، دەسلەپكى تاۋارلار بىلەن دەرھال تولۇقلاپ بوش كۆرۈنۈشنىڭ ئالدىنى ئېلىش
    if (!Array.isArray(prods) || prods.length === 0) {
      if (typeof INITIAL_PRODUCTS !== 'undefined' && Array.isArray(INITIAL_PRODUCTS) && INITIAL_PRODUCTS.length > 0) {
        prods = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
        try {
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prods));
        } catch (e) {}
      } else {
        prods = [];
      }
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

    // 🛡️ ئۇيغۇرچە توربېكەتتە مەھسۇلات نامى ۋە تۈرىنىڭ تۈركچە چىقىپ قېلىشىنى 100% قوغداش
    if (lang === 'ug') {
      if (!/[؀-ۿ]/.test(name) || /Doğal|Şifalı|Uygur Tıbbı|Geleneksel|Kantaron|Çekirdeği|Mantarı|Uçucu|Zeytinyağı|Karanfil|Macunu|Ansiklopedisi|Baharat|Kuru Üzüm|Kozası|Hünnap|Badem|Susam|Uşma/i.test(name)) {
        if (p.translations && p.translations.ug && p.translations.ug.name) {
          name = p.translations.ug.name;
        } else if (typeof INITIAL_PRODUCTS !== 'undefined') {
          const match = INITIAL_PRODUCTS.find(ip => ip.id === p.id);
          if (match && match.name) name = match.name;
        }
      }
      if (window.appI18n && typeof window.appI18n.getCategoryName === 'function') {
        category = window.appI18n.getCategoryName(category, 'ug');
      }
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
      // 🛡️ تۈركچە ۋە ئىنگلىزچىدىكى تاۋار نامى ۋە چۈشەندۈرۈشىدىكى تەلەپپۇز سۆزلىرىنى ساپ، ئەقلىي تىلغا ئايلاندۇرۇش
      if (typeof window.appI18n.refineLocalizedProductName === 'function') {
        name = window.appI18n.refineLocalizedProductName(name, lang);
        if (description) {
          description = window.appI18n.refineLocalizedProductName(description, lang);
        }
      }
      if (typeof window.appI18n.getCategoryName === 'function') {
        category = window.appI18n.getCategoryName(category, lang);
      }
      if (typeof window.appI18n.getUnitName === 'function') {
        unit = window.appI18n.getUnitName(unit || p.unit || 'دانە', lang);
      }
    }

    // 🛡️ ھەر قانداق تىلدا (جۈملىدىن ئۇيغۇرچىدا) بەلگىنى 100% كەسپىي تەرجىمە قىلىش
    if (window.appI18n && typeof window.appI18n.getBadgeName === 'function' && badge) {
      badge = window.appI18n.getBadgeName(badge, lang);
    }

    return {
      ...p,
      name,
      description,
      category,
      unit,
      badge,
      brand: (() => {
        let b = p.brand || 'تەكلىماكان';
        if (p.translations && p.translations[lang] && p.translations[lang].brand) {
          return p.translations[lang].brand;
        }
        if (window.appI18n && typeof window.appI18n.getBrandName === 'function') {
          return window.appI18n.getBrandName(b, lang);
        }
        if (lang !== 'ug') {
          if (b.includes('تەكلىماكان كلاسسىك')) return 'Teklimakan Klasik';
          if (b.includes('تەكلىماكان ئالىي')) return 'Teklimakan Premium';
          if (b.includes('تەكلىماكان')) return 'Teklimakan Online';
          if (b.includes('تۇرپان يېشىل')) return 'Turpan Doğal';
          if (b.includes('خوتەن قاشتېشى')) return 'Hoten Yeşimi';
          if (b.includes('ئىلى')) return 'İli Doğal';
        }
        return b;
      })(),
      originalProduct: p
    };
  }

  getProductById(id, lang = null) {
    if (!id) return null;
    const cleanId = String(id).trim().toLowerCase();
    const products = this.getProducts();
    let p = products.find(prod => String(prod.id).trim().toLowerCase() === cleanId);
    if (!p) {
      const prdMatch = cleanId.match(/prd-\d+/i);
      if (prdMatch) {
        p = products.find(prod => String(prod.id).trim().toLowerCase() === prdMatch[0].toLowerCase());
      }
    }
    if (!p) {
      p = products.find(prod => {
        if (prod.slug && String(prod.slug).trim().toLowerCase() === cleanId) return true;
        if (prod.translations && prod.translations.slug && String(prod.translations.slug).trim().toLowerCase() === cleanId) return true;
        return false;
      });
    }
    if (!p) {
      p = products.find(prod => {
        const s = transliterateToSlug(prod.name);
        return s && s === cleanId;
      });
    }
    if (!p) return null;
    if (lang) return this.getLocalizedProduct(p, lang);
    return p;
  }

  getProductBySlug(slugOrId, lang = null) {
    return this.getProductById(slugOrId, lang);
  }

  transliterateToSlug(text) {
    return transliterateToSlug(text);
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

  // 🆔 مەھسۇلاتنى تەمىنلىگۈچى / يوللىغۇچى ۋاكالەتچىنى ئېلىش
  getProductAgent(product) {
    if (!product) return null;
    const agents = this.getAgents('none');
    // 1. بىۋاسىتە مەھسۇلاتتا ساقلانغان agentId ئارقىلىق
    if (product.agentId) {
      const found = agents.find(a => a.id === product.agentId);
      if (found) return found;
      return { id: product.agentId, name: product.agentName || product.agentId };
    }
    // 2. ئەگەر agentName ئىچىدە AGT-xxx كودى بار بولسا
    if (product.agentName) {
      const match = String(product.agentName).match(/AGT-\d+/i);
      if (match) {
        const agentCode = match[0].toUpperCase();
        const found = agents.find(a => a.id === agentCode);
        if (found) return found;
        return { id: agentCode, name: product.agentName };
      }
    }
    // 3. مەھسۇلاتنىڭ ماركىسىغا ھوقۇق بېرىلگەن ۋاكالەتچىنى تېپىش
    if (product.brand) {
      const found = agents.find(a => a.authorizedBrands && Array.isArray(a.authorizedBrands) && a.authorizedBrands.includes(product.brand));
      if (found) return found;
    }
    return null;
  }

  getProductAgentId(product) {
    const agent = this.getProductAgent(product);
    return agent ? agent.id : null;
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
      if (!updatedProduct.slug) {
        updatedProduct.slug = transliterateToSlug(updatedProduct.name);
      }
      if (updatedProduct.translations && !updatedProduct.translations.slug) {
        updatedProduct.translations.slug = updatedProduct.slug;
      }
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
      if (!newProduct.slug) {
        newProduct.slug = transliterateToSlug(newProduct.name);
      }
      if (newProduct.translations && !newProduct.translations.slug) {
        newProduct.translations.slug = newProduct.slug;
      }
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

  getCategoryIcon(catIdOrName) {
    if (!catIdOrName || catIdOrName === 'all') return 'fas fa-border-all';
    const c = String(catIdOrName).toLowerCase().trim();
    if (c.includes('tıbb') || c.includes('تىبابەت') || c.includes('apothecary') || c.includes('medicine')) return 'fas fa-mortar-pestle';
    if (c.includes('şifa') || c.includes('ilaç') || c.includes('دورا') || c.includes('remedy') || c.includes('hap') || c.includes('capsul')) return 'fas fa-capsules';
    if (c.includes('bitki') || c.includes('ot') || c.includes('ئۆسۈملۈك') || c.includes('herb')) return 'fas fa-leaf';
    if (c.includes('yağ') || c.includes('ياغ') || c.includes('oil')) return 'fas fa-droplet';
    if (c.includes('güzellik') || c.includes('bakım') || c.includes('sağlık') || c.includes('گۈزەللىك') || c.includes('beauty')) return 'fas fa-spa';
    if (c.includes('reçel') || c.includes('gülkand') || c.includes('macun') || c.includes('قەنت') || c.includes('گۈل') || c.includes('jam')) return 'fas fa-jar';
    if (c.includes('meyve') || c.includes('yemiş') || c.includes('kuruyemiş') || c.includes('قۇرۇق') || c.includes('fruit') || c.includes('baharat')) return 'fas fa-basket-shopping';
    if (c.includes('sanat') || c.includes('مەدەنىيەت') || c.includes('kültür') || c.includes('craft') || c.includes('eşya')) return 'fas fa-gem';
    if (c.includes('kitap') || c.includes('كىتاپ') || c.includes('كىتاب') || c.includes('book')) return 'fas fa-book-open';
    if (c.includes('halı') || c.includes('گىلەم') || c.includes('carpet')) return 'fas fa-rug';
    if (c.includes('çay') || c.includes('چاي') || c.includes('tea')) return 'fas fa-mug-hot';
    if (c.includes('bal') || c.includes('ھەسەل') || c.includes('honey')) return 'fas fa-cube';
    return 'fas fa-tag';
  }

  // ==================== تۈرلەر ====================
  getCategories(lang = 'ug') {
    let categories = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (raw) categories = JSON.parse(raw);
    } catch(e) {}

    // 🛡️ تۈرلەر تىزىملىكى چوقۇم 10 ئاساسىي ئۆلچەملىك تۈر بىلەن دەل ماسلىشىشى، تۈركچە ياكى قايتىلانغان تۈرلەر بولسا دەرھال ئەسلىگە كېلىشى كېرەك
    const isCorrupt = !Array.isArray(categories) || categories.length < 10 || categories.some(c => 
      !c || !c.id || /Şifa|Bitki|Yağlar|Kuruyemiş|Geleneksel|Uygur Tıbbı Mirası/i.test(c.id) || /Şifa|Bitki|Yağlar|Kuruyemiş/i.test(c.name)
    );

    if (isCorrupt) {
      categories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
      try { localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories)); } catch(e) {}
    }

    // 🛡️ كېرەكسىز ياكى قايتىلانغان ساختا تۈرلەرنى دەسلەپتىلا چىقىرىۋېتىش
    categories = categories.filter(c => c && (c.id === 'all' || (!isPseudoCategory(c.id) && !isPseudoCategory(c.name))));

    // 'all' ھەمىشە ئالدىدا بولىدۇ
    categories.sort((a, b) => {
      if (a.id === 'all') return -1;
      if (b.id === 'all') return 1;
      return (a.order || 0) - (b.order || 0);
    });

    const mapped = categories.map(c => {
      let displayName = '';
      if (c.id === 'all') {
        displayName = (window.appI18n && typeof window.appI18n.t === 'function')
          ? window.appI18n.t('allCategories', lang)
          : (lang === 'tr' ? 'Tüm Kategoriler' : (lang === 'en' ? 'All Categories' : 'بارلىق تۈرلەر'));
      } else if (lang === 'ug') {
        displayName = (window.appI18n && typeof window.appI18n.getCategoryName === 'function')
          ? window.appI18n.getCategoryName(c.name || c.id, 'ug')
          : (c.translations?.ug || c.name);
      } else if (c.translations && c.translations[lang]) {
        displayName = c.translations[lang];
      } else if (window.appI18n && typeof window.appI18n.getCategoryName === 'function') {
        displayName = window.appI18n.getCategoryName(c.name, lang);
      } else {
        displayName = c.name;
      }
      return { status: 'active', ...c, displayName };
    });

    // 🛡️ تۈرلەر نامىنىڭ قەتئىي قايتىلانماسلىقىغا (Zero duplicates by displayName) %100 كاپالەتلىك قىلىش
    const seenNames = new Set();
    const cleanCategories = [];
    for (const c of mapped) {
      const key = (c.displayName || c.name || '').trim();
      if (!key || seenNames.has(key)) continue;
      seenNames.add(key);
      cleanCategories.push(c);
    }

    return cleanCategories;
  }

  addCategory(categoryName, icon = 'fas fa-tag', translations = {}, order = null) {
    if (isPseudoCategory(categoryName)) return false;
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
    const ord = orders.find(o => String(o.id) === String(orderId));
    if (!ord) return { success: false, message: 'زاكاز تېپىلمىدى!' };

    ord.cargoCarrier = carrier || 'PTT Kargo';
    ord.cargoTrackingNo = trackingNo || '';
    ord.status = 'يوللاندى';
    ord.shippedAt = new Date().toISOString();
    ord.cargoTrackingUrl = this.getCargoTrackingUrl(ord.cargoCarrier, ord.cargoTrackingNo);
    ord.tracking = {
      carrier: ord.cargoCarrier,
      trackingNumber: ord.cargoTrackingNo,
      trackingUrl: ord.cargoTrackingUrl,
      updatedAt: ord.shippedAt
    };

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.notifyDataChange('orders');

    // ☁️ Supabase بۇلۇتقا يۈكلەش
    if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.updateOrderStatus === 'function') {
      this.trackCloudWrite(window.TeklimakanSupabase.updateOrderStatus(orderId, ord.status, {
        carrier: ord.cargoCarrier,
        number: ord.cargoTrackingNo,
        shippedAt: ord.shippedAt
      }), 'order tracking update');
    }

    // 🤖 Telegram غا كود يوللانغانلىق ئۇقتۇرۇشى ئەۋەتىش
    try {
      this.sendTelegramAlert({
        title: `🚚 زاكاز كارگوغا چىقىرىلدى! #${ord.id}`,
        message: `📦 <b>زاكاز نومۇرى:</b> <code>#${ord.id}</code>\n` +
                 `👤 <b>خېرىدار:</b> ${(ord.customer && ord.customer.name) || 'نامەلۇم'}\n` +
                 `📞 <b>تېلېفون:</b> <code>${(ord.customer && ord.customer.phone) || '-'}</code>\n` +
                 `🚚 <b>پوچتا شىركىتى:</b> <b>${ord.cargoCarrier}</b>\n` +
                 `🔢 <b>ئىز قوغلاش كودى:</b> <code>${ord.cargoTrackingNo}</code>\n` +
                 (ord.cargoTrackingUrl ? `🔗 <b>ئىز قوغلاش:</b> <a href="${ord.cargoTrackingUrl}">تور بەتتىن كۆرۈش</a>\n` : '') +
                 `💰 <b>سوممىسى:</b> ${ord.totalFormatted || this.formatPrice(ord.totalCny || ord.total)}`,
        isUrgent: false
      });
    } catch(tgErr) {
      console.warn('Telegram tracking alert failed:', tgErr);
    }

    // 💬 WhatsApp ئارقىلىق خېرىدارغا رەسمىي PTT كارگو ئۇقتۇرۇشىنى ئاپتوماتىك يوللاش
    if (ord.customer && ord.customer.phone && ord.cargoTrackingNo) {
      try {
        const details = (typeof window !== 'undefined' && window.TeklimakanCargoBridge)
          ? window.TeklimakanCargoBridge.parseOrderCargoDetails(ord)
          : null;
        const lang = ord.language || ord.lang || 'ug';
        const msg = (details && window.TeklimakanCargoBridge)
          ? window.TeklimakanCargoBridge.getCustomerWhatsAppText(details, ord.cargoTrackingNo, lang)
          : `ھۆرمەتلىك ${(ord.customer && ord.customer.name) || 'خېرىدار'}، سېتىۋالغان مېلىڭىز (#${ord.id}) رەتلەپ قاچىلىنىپ، پوسۇلكىڭىز ${ord.cargoCarrier} ئارقىلىق يوللاندى. پوچتا ئىز قوغلاش نومۇرى: ${ord.cargoTrackingNo}.`;

        this.sendWhatsAppCustomerMessage(ord.customer.phone, msg);
      } catch (waCargoErr) {
        console.warn('WhatsApp cargo tracking alert failed:', waCargoErr);
      }
    }

    // 📬 خېرىدارنىڭ سۇپا ئىچى زاكاز ساندۇقىغا كارگو ئۇقتۇرۇشى قوشۇش
    try {
      this.addCustomerInboxNotification({
        phone: (ord.customer && ord.customer.phone) || '',
        orderId: ord.id,
        title: 'پوسۇلكىڭىز كارگوغا تاپشۇرۇلدى',
        type: 'cargo_shipped',
        carrier: ord.cargoCarrier,
        trackingNo: ord.cargoTrackingNo,
        trackingUrl: ord.cargoTrackingUrl,
        message: `ھۆرمەتلىك ${(ord.customer && ord.customer.name) || 'خېرىدار'}، سېتىۋالغان مېلىڭىز (#${ord.id}) رەتلەپ قاچىلىنىپ، پوسۇلكىڭىز ${ord.cargoCarrier} ئارقىلىق يوللاندى. پوچتا ئىز قوغلاش نومۇرى: ${ord.cargoTrackingNo}.`,
        timestamp: new Date().toLocaleString('ug-CN', { hour12: false })
      });
    } catch(inbErr) {
      console.warn('Customer inbox cargo update failed:', inbErr);
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
      heroSlides: this.getRawHeroSlides(),
      showcaseShelves: this.getRawShowcaseShelves(),
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
      if (Array.isArray(backup.heroSlides)) {
        localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(backup.heroSlides));
      }
      if (Array.isArray(backup.showcaseShelves)) {
        localStorage.setItem(STORAGE_KEYS.SHOWCASE_SHELVES, JSON.stringify(backup.showcaseShelves));
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
    
    // 🎯 Meta (Facebook & Instagram) Pixel: AddToCart
    try {
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', 'AddToCart', {
          content_name: product.name,
          content_ids: [product.id],
          content_type: 'product',
          value: Number(product.price || 0) * (qty || 1),
          currency: this.currentCurrency || 'TRY'
        });
      }
    } catch (e) {}
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
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
    let updated = false;
    orders.forEach(o => {
      let orderTotal = Number(o.totalCny || o.total || 0);
      if (orderTotal <= 0) {
        const itemsList = Array.isArray(o.items) ? o.items : (typeof o.items === 'string' ? JSON.parse(o.items || '[]') : []);
        if (itemsList.length > 0) {
          const sumItems = itemsList.reduce((acc, it) => acc + ((Number(it.price) || 0) * (Number(it.quantity) || 1)), 0);
          if (sumItems > 0) {
            o.totalCny = sumItems;
            o.subtotalCny = sumItems;
            o.totalFormatted = this.formatPrice(sumItems);
            updated = true;
          }
        }
      }
    });
    if (updated) {
      try {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      } catch (e) {}
    }
    return orders;
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

    // 🤖 1. Telegram دەل ۋاقتىدا زاكاز ئۇقتۇرۇشى (Instant Telegram Bot Alert for New Order)
    try {
      const itemsList = (cartData.items || []).map((it, idx) => 
        `${idx + 1}. <b>${it.product.name}</b> × ${it.quantity} (${this.formatPrice(it.product.price * it.quantity)})`
      ).join('\n');

      const paymentMethodName = paymentMethod === 'kapida' || paymentMethod === 'قوبۇل قىلغاندا نەق پۇل'
        ? '💵 قوبۇل قىلغاندا نەق پۇل (Kapıda Ödeme)'
        : '💳 بانكا كارتىسى / تېز يۆتكەش (EFT / Havale)';

      const tgOrderMsg = 
        `🆔 <b>زاكاز نومۇرى:</b> <code>#${newOrder.id}</code>\n` +
        `👤 <b>خېرىدار:</b> ${customerData.name || 'نامەلۇم'}\n` +
        `📞 <b>تېلېفون:</b> <code>${customerData.phone || '-'}</code>\n` +
        `📍 <b>ئادرېس:</b> ${(customerData.city || '')} ${(customerData.district || '')} ${customerData.address || ''}\n` +
        `💳 <b>تۆلەش شەكلى:</b> ${paymentMethodName}\n` +
        `💰 <b>ئومۇمىي سومما:</b> <b>${this.formatPrice(finalTotalCny)}</b> (تەخمىنىي يەتكۈزۈش ھەققى: ${this.formatPrice(cartData.deliveryFeeCny)})\n\n` +
        `📦 <b>سېتىۋالغان ماللار (${cartData.items.length} خىل):</b>\n${itemsList}\n` +
        (notes ? `\n📝 <b>خېرىدار ئەسكەرتىشى:</b> ${notes}\n` : '') +
        (newOrder.agentId ? `\n🤝 <b>تەۋە ۋاكالەتچى ID:</b> <code>${newOrder.agentId}</code>\n` : '');

      this.sendTelegramAlert({
        title: `🛍️ يېڭى زاكاز تاپشۇرۇۋېلىندى! #${newOrder.id}`,
        message: tgOrderMsg,
        isUrgent: true
      });
    } catch (tgOrderErr) {
      console.warn('Telegram order alert failed:', tgOrderErr);
    }

    // 💬 WhatsApp ئارقىلىق خېرىدارغا دەرھال ئاپتوماتىك زاكاز ئۇقتۇرۇشى ئەۋەتىش
    if (customerData && customerData.phone) {
      try {
        const custName = customerData.name || 'خېرىدار';
        const itemsSummary = (cartData.items || []).map(it => `• ${it.product.name} (${it.quantity} دانە)`).join('\n');
        const waMsg = 
          `ئەسسالامۇئەلەيكۇم ھۆرمەتلىك ${custName}،\n\n` +
          `تەكلىماكان تور دۇكىنىمىزدىن بەرگەن #${newOrder.id} نومۇرلۇق زاكازىڭىز مۇۋەپپەقىيەتلىك قوبۇل قىلىندى! ✅\n\n` +
          `💰 ئومۇمىي سومما: ${this.formatPrice(finalTotalCny)}\n` +
          `📦 تاۋارلار:\n${itemsSummary}\n\n` +
          `ئامبىرىمىز ماللىرىڭىزنى ئەستايىدىل قاچىلاپ، كارگوغا تاپشۇرۇشقا تەييارلىماقتا.\n\n` +
          `تەكلىماكان سودا سۇپىسى\n` +
          `🌐 www.teklimakan.com`;

        this.sendWhatsAppCustomerMessage(customerData.phone, waMsg);
      } catch (waErr) {
        console.warn('WhatsApp storefront order alert failed:', waErr);
      }
    }

    // 🚀 İyi Seçenek سىستېمىسىغا خېرىدار زاكازلىرىنى ئارقا سۇپىدا ئاپتوماتىك چىقىرىش
    try {
      const settings = this.getSettings() || {};
      let iyiEmail = settings.iyisecenekEmail || '';
      let iyiPass = settings.iyisecenekPassword || '';
      try {
        const rawCreds = localStorage.getItem('teklimakan_iyisecenek_credentials_v1');
        if (rawCreds) {
          const parsed = JSON.parse(rawCreds);
          if (!iyiEmail && parsed.email) iyiEmail = parsed.email;
          if (!iyiPass && parsed.password) iyiPass = parsed.password;
        }
      } catch (e) {}

      if (iyiEmail && iyiPass && typeof fetch !== 'undefined') {
        fetch('/api/iyisecenek-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'sync_order',
            email: iyiEmail,
            password: iyiPass,
            order: newOrder
          })
        }).catch(() => {});
      }
    } catch (e) {}

    // 🚀 Vercel بۇلۇت مۇلازىمېتىرى ئارقىلىق تېلېفونغا ئاۋازلىق تېلېفون چېلىش ۋە جىددىي ئۇقتۇرۇش
    try {
      if (typeof fetch !== 'undefined') {
        fetch('/api/order-notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder)
        }).catch(err => console.warn('Order notify cloud trigger error:', err));
      }
    } catch (apiErr) {}

    // 📬 2. خېرىدارنىڭ سۇپا ئىچى زاكاز ساندۇقىغا دەسلەپكى ئۇقتۇرۇشنى قوشۇش (Order Inbox Notification)
    try {
      this.addCustomerInboxNotification({
        phone: customerData.phone || '',
        orderId: newOrder.id,
        title: 'مېلىڭىز مۇۋەپپەقىيەتلىك تاپشۇرۇۋېلىندى',
        type: 'order_created',
        message: `ھۆرمەتلىك ${customerData.name || 'خېرىدار'}، سېتىۋالغان مېلىڭىز (#${newOrder.id}) سىستېمىغا تىزىملاندى. ئومۇمىي سوممىسى: ${this.formatPrice(finalTotalCny)}. ئامبىرىمىز مېلىڭىزنى رەتلەپ، پوسۇلكىڭىزنى قاچىلاۋاتىدۇ.`,
        timestamp: formattedDate
      });
    } catch (inboxErr) {
      console.warn('Customer inbox initial notification failed:', inboxErr);
    }

    return { success: true, order: newOrder };
  }

  updateAdminOrder(orderId, orderData) {
    if (!orderId || !orderData) {
      return { success: false, message: 'زاكاز ئۇچۇرى تولۇق ئەمەس!' };
    }
    const orders = this.getOrders();
    const order = orders.find(o => String(o.id) === String(orderId));
    if (!order) {
      return { success: false, message: 'زاكاز تېپىلمىدى: ' + orderId };
    }

    const products = this.getProducts();
    const items = (orderData.items || []).map(it => {
      const prodId = it.id || it.productId;
      const matchedProd = products.find(p => p.id === prodId);
      return {
        id: prodId,
        productId: prodId,
        name: it.name || (matchedProd ? matchedProd.name : 'نامەلۇم مەھسۇلات'),
        price: Number(it.price) || (matchedProd ? Number(matchedProd.price) : 0),
        quantity: Math.max(1, Number(it.quantity) || 1),
        image: it.image || (matchedProd ? matchedProd.image : 'images/default_product.jpg'),
        agentId: it.agentId || (matchedProd ? matchedProd.agentId : null)
      };
    });

    const subtotal = items.reduce((s, it) => s + (it.price * it.quantity), 0);
    const deliveryFee = Math.max(0, Number(orderData.deliveryFeeCny) || 0);
    const discount = Math.max(0, Number(orderData.discountCny) || 0);
    const total = Math.max(0, subtotal + deliveryFee - discount);

    // خېرىدار ئۇچۇرلىرىنى يېڭىلاش
    const cust = orderData.customer || {};
    order.customer = {
      ...(typeof order.customer === 'object' ? order.customer : {}),
      name: (cust.name || '').trim(),
      phone: (cust.phone || '').trim(),
      city: (cust.city || '').trim(),
      district: (cust.district || '').trim(),
      address: (cust.address || '').trim(),
      email: (cust.email || '').trim()
    };

    order.items = items;
    order.subtotalCny = subtotal;
    order.discountCny = discount;
    order.deliveryFeeCny = deliveryFee;
    order.totalCny = total;
    order.total = total;
    order.totalFormatted = this.formatPrice(total);
    if (orderData.paymentMethod) order.paymentMethod = orderData.paymentMethod;
    if (orderData.status) order.status = orderData.status;
    if (orderData.notes !== undefined) order.notes = orderData.notes;
    if (orderData.cargoCarrier !== undefined) {
      order.cargoCarrier = orderData.cargoCarrier;
      order.trackingCarrier = orderData.cargoCarrier;
    }
    if (orderData.cargoTrackingNo !== undefined) {
      order.cargoTrackingNo = orderData.cargoTrackingNo;
      order.trackingNumber = orderData.cargoTrackingNo;
    }
    order.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.notifyDataChange('orders');

    // ☁️ Supabase بۇلۇت ئامبىرىغا يۈكلەش
    if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.insertOrder === 'function') {
      this.trackCloudWrite(window.TeklimakanSupabase.insertOrder(order), 'admin update order');
    }

    return { success: true, order };
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

  // ==================== ✍️ باشقۇرغۇچى مەخسۇس زاكاز قوشۇش (Manual Admin Order Creation) ====================
  addAdminManualOrder(orderData) {
    if (!orderData || !orderData.customer || !orderData.items || orderData.items.length === 0) {
      return { success: false, message: 'خېرىدار ئۇچۇرى ۋە كەم دېگەندە بىر مەھسۇلات تاللىنىشى كېرەك!' };
    }

    const orderId = orderData.id || ('ORD-' + (new Date().getFullYear()) + '-' + Math.floor(1000 + Math.random() * 9000) + ' UG');
    const now = new Date();
    const formattedDate = orderData.date || `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const products = this.getProducts();
    const items = orderData.items.map(it => {
      const prodId = it.id || it.productId;
      const matchedProd = products.find(p => p.id === prodId);
      return {
        id: prodId,
        name: it.name || (matchedProd ? matchedProd.name : 'نامەلۇم مەھسۇلات'),
        price: Number(it.price) || (matchedProd ? Number(matchedProd.price) : 0),
        quantity: Math.max(1, Number(it.quantity) || 1),
        image: it.image || (matchedProd ? matchedProd.image : 'images/default_product.jpg'),
        agentId: it.agentId || (matchedProd ? matchedProd.agentId : null)
      };
    });

    const subtotal = items.reduce((s, it) => s + (it.price * it.quantity), 0);
    const deliveryFee = Math.max(0, Number(orderData.deliveryFeeCny) || 0);
    const discount = Math.max(0, Number(orderData.discountCny) || 0);
    const total = Math.max(0, subtotal + deliveryFee - discount);

    const newOrder = {
      id: orderId,
      customer: {
        name: (orderData.customer.name || '').trim(),
        phone: (orderData.customer.phone || '').trim(),
        city: (orderData.customer.city || '').trim(),
        district: (orderData.customer.district || '').trim(),
        address: (orderData.customer.address || '').trim(),
        email: (orderData.customer.email || '').trim()
      },
      items: items,
      subtotalCny: subtotal,
      discountCny: discount,
      deliveryFeeCny: deliveryFee,
      totalCny: total,
      totalFormatted: this.formatPrice(total),
      paymentMethod: orderData.paymentMethod || 'بانكا ھېساباتىغا يۆتكەش',
      status: orderData.status || 'ساقلاۋاتىدۇ',
      date: formattedDate,
      notes: orderData.notes || '',
      cargoCarrier: orderData.cargoCarrier || '',
      cargoTrackingNo: orderData.cargoTrackingNo || '',
      trackingCarrier: orderData.cargoCarrier || '',
      trackingNumber: orderData.cargoTrackingNo || '',
      language: orderData.language || 'ug',
      currency: this.currentCurrency || 'TRY',
      isManualAdminOrder: true,
      createdBy: 'admin'
    };

    // 📦 ئامبار قالدۇقىنى كېمەيتىش (ئەگەر باشقۇرغۇچى ئامباردىن چىقىرىشنى تاللىغان بولسا)
    if (orderData.deductStock !== false) {
      let changedProds = false;
      items.forEach(it => {
        const prod = products.find(p => p.id === it.id);
        if (prod) {
          prod.stock = Math.max(0, (Number(prod.stock) || 0) - it.quantity);
          prod.sales = (Number(prod.sales) || 0) + it.quantity;
          prod.isUserEdited = true;
          prod.updatedAt = new Date().toISOString();
          this.saveUserEdit(prod);
          changedProds = true;
          if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.upsertProduct === 'function') {
            this.trackCloudWrite(window.TeklimakanSupabase.upsertProduct(prod), 'admin manual order inventory');
          }
        }
      });
      if (changedProds) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        this.notifyDataChange('products');
      }
    }

    const orders = this.getOrders();
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.notifyDataChange('orders');

    // ☁️ Supabase بۇلۇت ئامبىرىغا يۈكلەش
    if (window.TeklimakanSupabase && typeof window.TeklimakanSupabase.insertOrder === 'function') {
      this.trackCloudWrite(window.TeklimakanSupabase.insertOrder(newOrder), 'admin manual order');
    }

    // 🤖 Telegram ئارقىلىق باشقۇرغۇچىغا دەل ۋاقتىدا زاكاز ئۇقتۇرۇشى ئەۋەتىش
    try {
      const itemsList = (items || []).map((it, idx) => 
        `${idx + 1}. <b>${it.name || 'تاۋار'}</b> × ${it.quantity} (${this.formatPrice(it.price * it.quantity)})`
      ).join('\n');

      const tgOrderMsg = 
        `🆔 <b>زاكاز نومۇرى:</b> <code>#${newOrder.id}</code> (قولدا قۇرۇلدى)\n` +
        `👤 <b>خېرىدار:</b> ${newOrder.customer.name || 'نامەلۇم'}\n` +
        `📞 <b>تېلېفون:</b> <code>${newOrder.customer.phone || '-'}</code>\n` +
        `📍 <b>ئادرېس:</b> ${(newOrder.customer.city || '')} ${(newOrder.customer.district || '')} ${newOrder.customer.address || ''}\n` +
        `💳 <b>تۆلەش شەكلى:</b> ${newOrder.paymentMethod}\n` +
        `💰 <b>ئومۇمىي سومما:</b> <b>${this.formatPrice(total)}</b>\n\n` +
        `📦 <b>تاۋارلار تىزىملىكى (${items.length} خىل):</b>\n${itemsList}\n` +
        (newOrder.notes ? `\n📝 <b>ئىزاھات:</b> ${newOrder.notes}\n` : '');

      this.sendTelegramAlert({
        title: `✍️ يېڭى زاكاز قولدا قوشۇلدى! #${newOrder.id}`,
        message: tgOrderMsg,
        isUrgent: true
      });
    } catch (tgOrderErr) {
      console.warn('Telegram manual order alert failed:', tgOrderErr);
    }

    // 📬 خېرىدارنىڭ سۇپا ئىچى زاكاز ساندۇقىغا ئۇقتۇرۇش ئەۋەتىش
    if (orderData.sendNotification !== false && newOrder.customer && newOrder.customer.phone) {
      try {
        this.addCustomerInboxNotification({
          phone: newOrder.customer.phone,
          orderId: newOrder.id,
          title: 'سىزگە يېڭى زاكاز قۇرۇلدى',
          type: 'order_created',
          message: `ھۆرمەتلىك ${newOrder.customer.name || 'خېرىدار'}، سۇپىمىز ئارقىلىق زاكازىڭىز (#${newOrder.id}) تىزىملاندى. ئومۇمىي سوممىسى: ${this.formatPrice(total)}. ھالىتى: «${newOrder.status}». رەھمەت!`,
          timestamp: formattedDate
        });
      } catch (e) {}

      // 💬 WhatsApp ئارقىلىق خېرىدارغا ئاپتوماتىك زاكاز تىزىملىنىش ئۇقتۇرۇشى ئەۋەتىش
      try {
        const custName = newOrder.customer.name || 'خېرىدار';
        const itemsSummary = items.map(it => `• ${it.name || 'تاۋار'} (${it.quantity} دانە)`).join('\n');
        const waMsg = 
          `ئەسسالامۇئەلەيكۇم ھۆرمەتلىك ${custName}،\n\n` +
          `تەكلىماكان سۇپىسىدىن بەرگەن #${newOrder.id} نومۇرلۇق زاكازىڭىز مۇۋەپپەقىيەتلىك تىزىملاندى. ✅\n\n` +
          `💰 زاكاز سوممىسى: ${this.formatPrice(total)}\n` +
          `📦 تاۋارلار:\n${itemsSummary}\n\n` +
          `ئامبىرىمىز مېلىڭىزنى رەتلەپ قاچىلاۋاتىدۇ. پوسۇلكا كارگوغا چىقىرىلغاندا سىزگە ئىز قوغلاش نومۇرى ئەۋەتىلىدۇ.\n\n` +
          `تەكلىماكاننى تاللىغىنىڭىزغا رەھمەت!\n` +
          `🌐 www.teklimakan.com`;

        this.sendWhatsAppCustomerMessage(newOrder.customer.phone, waMsg);
      } catch (waErr) {
        console.warn('WhatsApp manual order alert failed:', waErr);
      }
    }

    return { success: true, order: newOrder };
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

    const list = items
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
          linkType: item.linkType || '',
          url: item.url || ''
        };
      });

    // 🤝 پەقەت ئۇيغۇرچىدا كۆرۈنسۇن: تەكلىماكان فوندى 5% ساخاۋەت ئۈلۈشىنى ئايلانما ئېلان تاختىسىغا كەسپىي قوشۇش
    if (lang === 'ug') {
      const charityCfg = (typeof this.getCharityFundConfig === 'function') ? this.getCharityFundConfig() : null;
      if (charityCfg && charityCfg.enabled !== false) {
        list.push({
          id: 'charity_fund_marquee',
          badge: `ساخاۋەت %${charityCfg.percentage || 5}`,
          text: `🤝 «${charityCfg.name || 'تەكلىماكان فوندى'}»: سۇپىمىزدىكى ھەربىر زاكازنىڭ %${charityCfg.percentage || 5} قىممىتى ئېھتىياجلىق قېرىنداشلارغا ياردەم ئۈچۈن ئاجرىتىلىدۇ`,
          badgeStyle: 'badge-charity',
          linkType: 'charity',
          url: charityCfg.url || 'https://www.seidiye.com/category/mihri/'
        });
      }
    }

    return list;
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

  // ==================== 🎨 تەشۋىقات تاختىسى (Hero Slider Banner) ====================
  getHeroSlides(lang = 'ug') {
    let slides = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
      if (stored) {
        slides = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading hero slides:', e);
    }

    if (!Array.isArray(slides) || slides.length === 0) {
      slides = JSON.parse(JSON.stringify(DEFAULT_HERO_SLIDES));
    }

    return slides.map((s, idx) => {
      let tag = s.tag || '';
      let title = s.title || '';
      let subtitle = s.subtitle || s.desc || '';
      let btnText = s.btnText || '';

      if (lang !== 'ug' && s.translations && s.translations[lang]) {
        if (s.translations[lang].tag) tag = s.translations[lang].tag;
        if (s.translations[lang].title) title = s.translations[lang].title;
        if (s.translations[lang].subtitle) subtitle = s.translations[lang].subtitle;
        if (s.translations[lang].btnText) btnText = s.translations[lang].btnText;
      }

      return {
        id: s.id || `hero_${idx + 1}`,
        order: typeof s.order === 'number' ? s.order : (idx + 1),
        tag: tag,
        tagColor: s.tagColor || '#f59e0b',
        title: title,
        subtitle: subtitle,
        desc: subtitle,
        btnText: btnText,
        btnLink: s.btnLink || '#catalogSection',
        image: s.image || 'images/hero_dried_fruits.jpg',
        enabled: s.enabled !== false,
        translations: s.translations || {}
      };
    });
  }

  getRawHeroSlides() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_HERO_SLIDES));
  }

  saveHeroSlides(slides) {
    if (!Array.isArray(slides)) return false;
    try {
      localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(slides));
      this.notifyDataChange('heroSlides');
      return true;
    } catch (e) {
      console.error('Failed to save hero slides:', e);
      return false;
    }
  }

  resetHeroSlides() {
    return this.saveHeroSlides(JSON.parse(JSON.stringify(DEFAULT_HERO_SLIDES)));
  }

  // ==================== 🛍️ زامانىۋى سىيرىلما تاۋار بۆلەكلىرى (Trendyol Style Shelves) ====================
  getShowcaseShelves(lang = 'ug') {
    let shelves = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SHOWCASE_SHELVES);
      if (stored) {
        shelves = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading showcase shelves:', e);
    }

    if (!Array.isArray(shelves) || shelves.length === 0) {
      shelves = JSON.parse(JSON.stringify(DEFAULT_SHOWCASE_SHELVES));
    }

    const allProducts = this.getProductsByLang(lang);

    return shelves
      .filter(s => s && s.enabled !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((s, idx) => {
        let title = s.title || '';
        let subtitle = s.subtitle || '';
        let linkText = s.linkText || '';
        let badgeStripText = s.badgeStripText || '';

        if (s.translations && s.translations[lang]) {
          if (s.translations[lang].title) title = s.translations[lang].title;
          if (s.translations[lang].subtitle) subtitle = s.translations[lang].subtitle;
          if (s.translations[lang].linkText) linkText = s.translations[lang].linkText;
          if (s.translations[lang].badgeStripText) badgeStripText = s.translations[lang].badgeStripText;
        }

        // Auto-cleanse competitor trademark 'Trendyol'
        if (title && (title.includes('Trendyol') || title.includes('trendyol'))) {
          title = title.replace(/Trendyol Plus'a Özel Fiyatlı Ürünler/gi, 'Özel Fiyatlı Ürünler')
                       .replace(/Trendyol Plus/gi, 'Teklimakan Plus')
                       .replace(/Trendyol/gi, 'Teklimakan');
        }

        // Auto-cleanse 'تالون' / 'Kupon' / 'Coupon'
        if (badgeStripText) {
          badgeStripText = badgeStripText.replace(/kupon|coupon|تالون/gi, '').trim();
          if (badgeStripText === '75 TL' || badgeStripText === '75TL') {
            badgeStripText = '🎁 75 TL';
          }
        }
        if (linkText && (linkText.includes('بارلىقىنى كۆرۈش') || linkText.includes('Tümünü') || linkText.includes('See All'))) {
          linkText = '';
        }

        // تاۋار مەنبەسى بويىچە تاۋارلارنى يىغىش (Resolve products)
        let resolvedProducts = [];
        const source = s.productSource || 'featured';

        if (source === 'manual' && Array.isArray(s.manualProductIds) && s.manualProductIds.length > 0) {
          resolvedProducts = s.manualProductIds
            .map(pid => allProducts.find(p => p.id === pid))
            .filter(Boolean);
        } else if (source === 'bestseller') {
          resolvedProducts = [...allProducts]
            .sort((a, b) => (Number(b.sales) || 0) - (Number(a.sales) || 0))
            .slice(0, 10);
        } else if (source === 'discounted') {
          resolvedProducts = allProducts
            .filter(p => p.oldPrice && Number(p.oldPrice) > Number(p.price))
            .slice(0, 10);
        } else {
          // featured or fallback
          resolvedProducts = allProducts.filter(p => p.featured);
          if (resolvedProducts.length < 4) {
            resolvedProducts = allProducts.slice(0, 8);
          }
        }
        if (resolvedProducts.length < 4 && allProducts.length > 0) {
          const fallback = allProducts.filter(p => !resolvedProducts.some(rp => rp.id === p.id));
          resolvedProducts = [...resolvedProducts, ...fallback].slice(0, 8);
        }

        return {
          id: s.id || `shelf_${idx + 1}`,
          order: typeof s.order === 'number' ? s.order : (idx + 1),
          title: title,
          subtitle: subtitle,
          linkText: linkText,
          linkUrl: s.linkUrl || '#catalogSection',
          productSource: source,
          manualProductIds: s.manualProductIds || [],
          badgeStripText: badgeStripText,
          badgeStripColor: s.badgeStripColor || '#059669',
          badgeStripBgType: s.badgeStripBgType || 'green',
          showVerifiedBadge: s.showVerifiedBadge !== false,
          showWishlistBtn: s.showWishlistBtn !== false,
          translations: s.translations || {},
          products: resolvedProducts
        };
      });
  }

  getRawShowcaseShelves() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SHOWCASE_SHELVES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_SHOWCASE_SHELVES));
  }

  saveShowcaseShelves(shelves) {
    if (!Array.isArray(shelves)) return false;
    try {
      localStorage.setItem(STORAGE_KEYS.SHOWCASE_SHELVES, JSON.stringify(shelves));
      this.notifyDataChange('showcaseShelves');
      return true;
    } catch (e) {
      console.error('Failed to save showcase shelves:', e);
      return false;
    }
  }

  resetShowcaseShelves() {
    return this.saveShowcaseShelves(JSON.parse(JSON.stringify(DEFAULT_SHOWCASE_SHELVES)));
  }

  getDashboardMetrics() {
    const products = this.getProducts();
    const orders = this.getOrders();

    const totalRevenueCny = orders
      .filter(o => o.status !== 'بىكار قىلىندى')
      .reduce((sum, o) => {
        let orderTotal = Number(o.totalCny || o.total || 0);
        if (orderTotal <= 0) {
          const itemsList = Array.isArray(o.items) ? o.items : (typeof o.items === 'string' ? JSON.parse(o.items || '[]') : []);
          if (itemsList.length > 0) {
            const sumItems = itemsList.reduce((acc, it) => acc + ((Number(it.price) || 0) * (Number(it.quantity) || 1)), 0);
            if (sumItems > 0) orderTotal = sumItems;
          }
        }
        return sum + orderTotal;
      }, 0);

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

  // ==================== 📬 سۇپا ئىچىدىكى خېرىدار زاكاز ۋە ئۇقتۇرۇش ساندۇقى (Customer Order Tracking Inbox) ====================
  getCustomerInboxNotifications() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER_INBOX)) || [];
    } catch (e) {
      return [];
    }
  }

  addCustomerInboxNotification(notif) {
    try {
      const list = this.getCustomerInboxNotifications();
      const newEntry = {
        id: notif.id || ('INB-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6)),
        phone: this.normalizePhone(notif.phone || ''),
        orderId: notif.orderId || '',
        title: notif.title || 'سۇپا ئۇقتۇرۇشى',
        type: notif.type || 'info', // order_created, cargo_shipped, order_completed, admin_message, info
        message: notif.message || '',
        carrier: notif.carrier || '',
        trackingNo: notif.trackingNo || '',
        trackingUrl: notif.trackingUrl || '',
        timestamp: notif.timestamp || new Date().toLocaleString('ug-CN', { hour12: false }),
        createdAt: new Date().toISOString(),
        isRead: false
      };
      list.unshift(newEntry);
      if (list.length > 300) list.pop();
      localStorage.setItem(STORAGE_KEYS.CUSTOMER_INBOX, JSON.stringify(list));
      this.notifyDataChange('customer_inbox');
      return newEntry;
    } catch (e) {
      console.error('Failed to add customer inbox notification:', e);
      return null;
    }
  }

  getCustomerInbox(phoneOrOrderQuery) {
    if (!phoneOrOrderQuery) return { orders: [], notifications: [] };
    const cleanQ = phoneOrOrderQuery.toString().trim();
    const cleanPhone = this.normalizePhone(cleanQ);
    const cleanDigits = cleanQ.replace(/\D/g, '');

    // 1. خېرىدارغا ئالاقىدار بارلىق زاكازلارنى تېپىش
    const allOrders = this.getOrders();
    const matchedOrders = allOrders.filter(o => {
      const oid = (o.id || '').toString().toLowerCase();
      const oPhone = this.normalizePhone(o.customer?.phone || '');
      const oPhoneDigits = (o.customer?.phone || '').toString().replace(/\D/g, '');
      const oTracking = (o.cargoTrackingNo || o.trackingNumber || '').toString().toLowerCase();

      if (cleanQ.toLowerCase() === oid) return true;
      if (cleanDigits && cleanDigits.length >= 6 && (oPhoneDigits.endsWith(cleanDigits) || cleanDigits.endsWith(oPhoneDigits))) return true;
      if (cleanPhone && oPhone && cleanPhone === oPhone) return true;
      if (oTracking && oTracking === cleanQ.toLowerCase()) return true;
      return false;
    });

    // 2. مەخسۇس ساقلانغان سۇپا ئۇقتۇرۇشلىرى
    const savedNotifs = this.getCustomerInboxNotifications();
    const matchedNotifs = savedNotifs.filter(n => {
      const nPhone = this.normalizePhone(n.phone || '');
      const nPhoneDigits = (n.phone || '').replace(/\D/g, '');
      const nOid = (n.orderId || '').toLowerCase();

      if (cleanQ.toLowerCase() === nOid) return true;
      if (cleanDigits && cleanDigits.length >= 6 && (nPhoneDigits.endsWith(cleanDigits) || cleanDigits.endsWith(nPhoneDigits))) return true;
      if (cleanPhone && nPhone && cleanPhone === nPhone) return true;
      if (matchedOrders.some(mo => mo.id === n.orderId)) return true;
      return false;
    });

    // 3. مۇناسىۋەتلىك SMS/سۇپا ئۇچۇرلىرىنى قوشۇش (ئەگەر خېرىدارغا باشقۇرۇش مەركىزىدىن خاس ئۇچۇر يوللانغان بولسا)
    const smsHistory = this.getSmsHistory();
    smsHistory.forEach(sms => {
      const smsPhoneDigits = (sms.phone || '').replace(/\D/g, '');
      const isMatch = (cleanDigits && cleanDigits.length >= 6 && (smsPhoneDigits.endsWith(cleanDigits) || cleanDigits.endsWith(smsPhoneDigits))) ||
                      (sms.orderId && sms.orderId.toLowerCase() === cleanQ.toLowerCase()) ||
                      matchedOrders.some(mo => mo.id === sms.orderId);
      if (isMatch) {
        const exists = matchedNotifs.some(mn => mn.message === sms.message && mn.timestamp === sms.timestamp);
        if (!exists) {
          matchedNotifs.push({
            id: 'SMS-' + sms.id,
            phone: sms.phone,
            orderId: sms.orderId || '',
            title: sms.channel === 'سۇپا' ? 'سۇپا باشقۇرغۇچىسى ئۇچۇرى' : 'خېرىدارلار مۇلازىمەت ئۇچۇرى',
            type: 'admin_message',
            message: sms.message,
            timestamp: sms.timestamp || '',
            createdAt: new Date().toISOString(),
            isRead: false
          });
        }
      }
    });

    // 4. ئەگەر بەزى زاكازلارنىڭ ساندۇق خاتىرىسى كەم بولسا، دەل ۋاقتىدا شەكىللەندۈرۈش
    matchedOrders.forEach(ord => {
      // مېلى تاپشۇرۇۋېلىش قەدىمى
      const hasCreated = matchedNotifs.some(n => n.orderId === ord.id && n.type === 'order_created');
      if (!hasCreated) {
        matchedNotifs.push({
          id: 'DYN-CREATE-' + ord.id,
          phone: ord.customer?.phone || '',
          orderId: ord.id,
          title: 'مېلىڭىز تاپشۇرۇۋېلىندى',
          type: 'order_created',
          message: `ھۆرمەتلىك ${ord.customer?.name || 'خېرىدار'}، سېتىۋالغان مېلىڭىز (#${ord.id}) سىستېمىغا تىزىملاندى. سوممىسى: ${ord.totalFormatted || this.formatPrice(ord.totalCny || ord.total)}.`,
          timestamp: ord.date || '',
          createdAt: ord.date || new Date().toISOString()
        });
      }

      // پوسۇلكا كارگو قەدىمى
      const carrier = ord.cargoCarrier || ord.trackingCarrier;
      const trackingNo = ord.cargoTrackingNo || ord.trackingNumber;
      if (carrier && trackingNo) {
        const hasCargo = matchedNotifs.some(n => n.orderId === ord.id && n.type === 'cargo_shipped');
        if (!hasCargo) {
          matchedNotifs.push({
            id: 'DYN-CARGO-' + ord.id,
            phone: ord.customer?.phone || '',
            orderId: ord.id,
            title: 'پوسۇلكىڭىز كارگوغا تاپشۇرۇلدى',
            type: 'cargo_shipped',
            carrier: carrier,
            trackingNo: trackingNo,
            trackingUrl: this.getCargoTrackingUrl(carrier, trackingNo),
            message: `ھۆرمەتلىك ${ord.customer?.name || 'خېرىدار'}، سېتىۋالغان مېلىڭىز (#${ord.id}) قاچىلىنىپ، پوسۇلكىڭىز ${carrier} ئارقىلىق يوللاندى. پوچتا ئىز قوغلاش كودى: ${trackingNo}.`,
            timestamp: ord.shippedAt ? new Date(ord.shippedAt).toLocaleString('ug-CN', { hour12: false }) : (ord.date || ''),
            createdAt: ord.shippedAt || ord.date || new Date().toISOString()
          });
        }
      }

      // يەتكۈزۈلۈپ تاماملانغانلىق قەدىمى
      if (ord.status === 'تاماملاندى') {
        const hasCompleted = matchedNotifs.some(n => n.orderId === ord.id && n.type === 'order_completed');
        if (!hasCompleted) {
          matchedNotifs.push({
            id: 'DYN-COMPL-' + ord.id,
            phone: ord.customer?.phone || '',
            orderId: ord.id,
            title: 'پوسۇلكىڭىز يەتكۈزۈلۈپ تاماملاندى',
            type: 'order_completed',
            message: `ھۆرمەتلىك ${ord.customer?.name || 'خېرىدار'}، سېتىۋالغان مېلىڭىز (#${ord.id}) ئوڭۇشلۇق يەتكۈزۈلۈپ، پوسۇلكىڭىز تاپشۇرۇلدى. تەكلىماكاننى تاللىغىنىڭىزغا تەشەككۈر!`,
            timestamp: ord.completedAt ? new Date(ord.completedAt).toLocaleString('ug-CN', { hour12: false }) : '',
            createdAt: ord.completedAt || new Date().toISOString()
          });
        }
      }
    });

    // ئەڭ يېڭى ئۇچۇر ئۈستىدە تەرتىپلەش
    matchedNotifs.sort((a, b) => {
      const ta = new Date(a.createdAt || a.timestamp || 0).getTime() || 0;
      const tb = new Date(b.createdAt || b.timestamp || 0).getTime() || 0;
      return tb - ta;
    });

    return {
      orders: matchedOrders,
      notifications: matchedNotifs
    };
  }

  getUnreadCustomerInboxCount(phone) {
    if (!phone) return 0;
    try {
      const { notifications } = this.getCustomerInbox(phone);
      const lastRead = Number(localStorage.getItem('teklimakan_inbox_last_read_' + this.normalizePhone(phone)) || 0);
      if (!lastRead) return notifications.length;
      return notifications.filter(n => {
        const t = new Date(n.createdAt || n.timestamp || 0).getTime();
        return t > lastRead;
      }).length;
    } catch (e) {
      return 0;
    }
  }

  markCustomerInboxAsRead(phone) {
    if (!phone) return;
    try {
      localStorage.setItem('teklimakan_inbox_last_read_' + this.normalizePhone(phone), Date.now().toString());
      this.notifyDataChange('customer_inbox_read');
    } catch (e) {}
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
    if (!Array.isArray(luckyWheel.slices) || luckyWheel.slices.length < 2) {
      luckyWheel.slices = defaults.luckyWheel.slices;
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

  getCustomerDailyFlashSaleProducts(lang = null) {
    const activeLang = lang || (window.appI18n ? window.appI18n.getLang() : 'ug');
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
      const localized = this.getLocalizedProduct(p, activeLang) || p;
      const origPrice = Number(localized.price) || Number(p.price) || 0;
      const flashPrice = Math.max(1, Math.round(origPrice * (1 - discountPct / 100)));
      return {
        ...localized,
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

  // 🔔 سانلىق مەلۇماتلارنىڭ ماس قەدەملىك ئۆزگىرىشىگە مۇشتەرى بولۇش (Event listener)
  on(type, callback) {
    if (typeof callback !== 'function') return () => {};
    const listener = (event) => {
      const detail = (event && event.detail) || {};
      if (type === '*' || detail.type === type) {
        try {
          callback(detail);
        } catch (e) {
          console.error(`[appStore.on] Error in listener for "${type}":`, e);
        }
      }
    };
    window.addEventListener('uyghur_store_sync', listener);
    return () => window.removeEventListener('uyghur_store_sync', listener);
  }

  // ==================== 🤝 تەكلىماكان خەير-ساخاۋەت فوندى باشقۇرۇش (Charity Fund 5%) ====================
  getCharityFundConfig() {
    const settings = this.getSettings() || {};
    const defaults = {
      enabled: true,
      name: 'تەكلىماكان فوندى',
      percentage: 5,
      url: 'https://www.seidiye.com/category/mihri/',
      description: 'سۇپىمىزدىن سېتىۋېلىنغان ھەربىر تاۋارنىڭ %5 قىممىتى ئېھتىياجلىق قېرىنداشلىرىمىزغا ياردەم بېرىش ئۈچۈن «تەكلىماكان فوندى» ھېسابىغا ئاجرىتىلىدۇ.'
    };
    const current = { ...defaults, ...(settings.charityFund || {}) };
    if (current.name === 'قېرىنداشلار فوندى' || !current.name) {
      current.name = 'تەكلىماكان فوندى';
      if (!current.description || current.description.includes('قېرىنداشلار فوندى')) {
        current.description = defaults.description;
      }
      settings.charityFund = current;
      try { this.updateSettings(settings); } catch (e) {}
    }
    return current;
  }

  saveCharityFundConfig(config) {
    const settings = this.getSettings() || {};
    settings.charityFund = {
      ...this.getCharityFundConfig(),
      ...config
    };
    this.updateSettings(settings);
    this.notifyDataChange('charityFund');
    return true;
  }

  getCharityPayouts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHARITY_PAYOUTS)) || {};
    } catch (e) {
      return {};
    }
  }

  setCharityMonthPayoutStatus(monthKey, status = 'paid', note = '') {
    const payouts = this.getCharityPayouts();
    payouts[monthKey] = {
      status, // 'paid' | 'pending'
      updatedAt: new Date().toISOString(),
      note: note || (status === 'paid' ? 'فوند ھېساباتىغا تولۇق ئۆتكۈزۈپ بېرىلدى' : 'تۆلەش كۈتۈلمەكتە')
    };
    try {
      localStorage.setItem(STORAGE_KEYS.CHARITY_PAYOUTS, JSON.stringify(payouts));
    } catch (e) {}
    this.notifyDataChange('charityPayouts');
    return true;
  }

  getCharityFundSummary() {
    const config = this.getCharityFundConfig();
    const rate = (Number(config.percentage) || 5) / 100;
    const orders = this.getOrders();
    const payouts = this.getCharityPayouts();

    const monthGroups = {};

    orders.forEach(order => {
      const st = String(order.status || '');
      if (st.includes('بىكار') || st.includes('ئەمەلدىن') || st.toLowerCase().includes('cancel')) {
        return;
      }

      let dateStr = order.date || order.createdAt || '';
      let d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        const match = String(dateStr).match(/(\d{4})[-/.](\d{1,2})/);
        if (match) {
          d = new Date(Number(match[1]), Number(match[2]) - 1, 1);
        } else {
          d = new Date();
        }
      }

      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const monthKey = `${y}-${m}`;

      let orderTotal = Number(order.totalCny || order.total || 0);
      if (orderTotal <= 0 && Array.isArray(order.items)) {
        orderTotal = order.items.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);
      }

      if (!monthGroups[monthKey]) {
        monthGroups[monthKey] = {
          monthKey,
          year: y,
          month: Number(m),
          orderCount: 0,
          totalSales: 0,
          charityAmount: 0
        };
      }

      monthGroups[monthKey].orderCount += 1;
      monthGroups[monthKey].totalSales += orderTotal;
    });

    const currentNow = new Date();
    const currentMonthKey = `${currentNow.getFullYear()}-${String(currentNow.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthGroups[currentMonthKey]) {
      monthGroups[currentMonthKey] = {
        monthKey: currentMonthKey,
        year: currentNow.getFullYear(),
        month: currentNow.getMonth() + 1,
        orderCount: 0,
        totalSales: 0,
        charityAmount: 0
      };
    }

    let allTimeSales = 0;
    let allTimeCharity = 0;
    let pendingPayoutsTotal = 0;

    const monthlyList = Object.keys(monthGroups)
      .sort((a, b) => b.localeCompare(a))
      .map(k => {
        const item = monthGroups[k];
        item.charityAmount = Math.round(item.totalSales * rate * 100) / 100;
        allTimeSales += item.totalSales;
        allTimeCharity += item.charityAmount;

        const payoutInfo = payouts[k] || { status: 'pending', updatedAt: null, note: '' };
        item.payoutStatus = payoutInfo.status;
        item.payoutNote = payoutInfo.note;
        item.payoutUpdatedAt = payoutInfo.updatedAt;

        if (item.payoutStatus !== 'paid') {
          pendingPayoutsTotal += item.charityAmount;
        }

        return item;
      });

    const currentMonthData = monthGroups[currentMonthKey] || {
      monthKey: currentMonthKey,
      orderCount: 0,
      totalSales: 0,
      charityAmount: 0,
      payoutStatus: (payouts[currentMonthKey] && payouts[currentMonthKey].status) || 'pending'
    };

    return {
      config,
      currentMonthKey,
      currentMonthSales: currentMonthData.totalSales,
      currentMonthOrders: currentMonthData.orderCount,
      currentMonthCharity: currentMonthData.charityAmount,
      currentMonthStatus: currentMonthData.payoutStatus,
      allTimeSales: Math.round(allTimeSales * 100) / 100,
      allTimeCharity: Math.round(allTimeCharity * 100) / 100,
      pendingPayoutsTotal: Math.round(pendingPayoutsTotal * 100) / 100,
      monthlyList
    };
  }
}

window.appStore = new StoreManager();
window.INITIAL_CATEGORIES = INITIAL_CATEGORIES;
window.DEFAULT_HERO_SLIDES = DEFAULT_HERO_SLIDES;
window.DEFAULT_SHOWCASE_SHELVES = DEFAULT_SHOWCASE_SHELVES;
window.INITIAL_PRODUCTS = INITIAL_PRODUCTS;
