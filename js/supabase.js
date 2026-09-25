/**
 * ================================================================
 * Supabase بۇلۇت ئۇلىنىش تەڭشىكى ۋە ماسلاشتۇرغۇچ (supabase.js)
 * تەكلىماكان ئېلېكترونلۇق سودا سۇپىسى
 * ================================================================
 */

const SUPABASE_CONFIG = {
  url: 'https://hvvxnnnpukgpmwexcniq.supabase.co',
  anonKey: 'sb_publishable_PGV3YrYULBIiX1Xgo0tgag_FQWem2Hp'
};

// Supabase خېرىدارىنى قۇرۇش
let _supabaseClient = null;
function getSupabase() {
  if (!_supabaseClient && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      _supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    } catch(e) {
      console.warn('Supabase قوزغىتىشتا خاتالىق كۆرۈلدى:', e);
    }
  }
  return _supabaseClient;
}

window.TeklimakanSupabase = {
  config: SUPABASE_CONFIG,
  getClient: getSupabase,

  // تاۋارلارنى بۇلۇتتىن ئوقۇش
  async fetchProducts() {
    const sb = getSupabase();
    if (!sb) return null;
    try {
      const { data, error } = await sb.from('products').select('*').order('created_at', { ascending: false });
      if (error) {
        console.warn('Supabase fetchProducts خاتالىقى:', error.message);
        return null;
      }
      return data;
    } catch (e) {
      console.warn('Supabase products ئۇلىنىش خاتالىقى:', e);
      return null;
    }
  },

  // تاۋارنى بۇلۇتقا ساقلاش ياكى يېڭىلاش
  async upsertProduct(product) {
    const sb = getSupabase();
    if (!sb) return false;
    try {
      // unit نى translations JSONB ئىچىگە پۈتۈپ، بىرلىكنىڭ يوقاپ كەتمەسلىكىگە كاپالەتلىك قىلىش
      const translations = { ...(product.translations || {}) };
      if (product.unit) {
        translations.unit = product.unit;
      }

      const row = {
        id: product.id,
        name: product.name,
        brand: product.brand || '',
        category: product.category || '',
        price: Number(product.price),
        old_price: product.oldPrice ? Number(product.oldPrice) : null,
        stock: product.stock !== undefined ? Number(product.stock) : 0,
        sales: product.sales || 0,
        rating: product.rating || 5.0,
        rating_count: product.ratingCount || 1,
        image: product.image || '',
        description: product.description || '',
        badge: product.badge || '',
        featured: !!product.featured,
        approval_status: product.approvalStatus || 'تەستىقلاندى',
        language_scope: product.languageScope || 'all',
        merchant_badge: product.merchantBadge || 'ئىشەنچىلىك سودىگەر',
        agent_id: product.agentId || null,
        agent_name: product.agentName || null,
        translations: translations
      };
      const { error } = await sb.from('products').upsert(row, { onConflict: 'id' });
      if (error) {
        console.warn('Supabase upsertProduct خاتالىقى:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Supabase product ساقلاش خاتالىقى:', e);
      return false;
    }
  },

  // تاۋارنى بۇلۇتتىن ئۆچۈرۈش
  async deleteProduct(productId) {
    const sb = getSupabase();
    if (!sb) return false;
    try {
      const { error } = await sb.from('products').delete().eq('id', productId);
      if (error) console.warn('Supabase deleteProduct خاتالىقى:', error.message);
      return !error;
    } catch (e) {
      console.warn('Supabase product ئۆچۈرۈش خاتالىقى:', e);
      return false;
    }
  },
  async fetchOrders() {
    const sb = getSupabase();
    if (!sb) return null;
    try {
      const { data, error } = await sb.from('orders').select('*').order('created_at', { ascending: false });
      if (error) return null;
      return data;
    } catch (e) {
      return null;
    }
  },

  // زاكازنى بۇلۇتقا قوشۇش
  async insertOrder(order) {
    const sb = getSupabase();
    if (!sb) return false;
    try {
      const row = {
        id: order.id,
        customer: order.customer,
        items: order.items,
        subtotal_cny: order.subtotalCny || 0,
        discount_cny: order.discountCny || 0,
        delivery_fee_cny: order.deliveryFeeCny || 0,
        total_cny: order.totalCny || 0,
        total_formatted: order.totalFormatted || '',
        payment_method: order.paymentMethod || '',
        status: order.status || 'ساقلاۋاتىدۇ',
        date: order.date || '',
        notes: order.notes || '',
        language: order.language || 'ug',
        currency: order.currency || 'TRY',
        tracking_carrier: order.trackingCarrier || null,
        tracking_number: order.trackingNumber || null,
        shipped_at: order.shippedAt || null
      };
      const { error } = await sb.from('orders').upsert(row);
      return !error;
    } catch (e) {
      return false;
    }
  },

  // زاكاز ھالىتىنى يېڭىلاش
  async updateOrderStatus(orderId, status, tracking = {}) {
    const sb = getSupabase();
    if (!sb) return false;
    try {
      const patch = { status };
      if (tracking.carrier) patch.tracking_carrier = tracking.carrier;
      if (tracking.number) patch.tracking_number = tracking.number;
      if (tracking.shippedAt) patch.shipped_at = tracking.shippedAt;
      if (tracking.completedAt) patch.completed_at = tracking.completedAt;
      const { error } = await sb.from('orders').update(patch).eq('id', orderId);
      return !error;
    } catch (e) {
      return false;
    }
  },

  // خېرىدار شەخسىي ئۇچۇرىنى يېڭىلاش
  async updateOrderCustomer(orderId, customer) {
    const sb = getSupabase();
    if (!sb) return false;
    try {
      const { error } = await sb.from('orders').update({ customer }).eq('id', orderId);
      return !error;
    } catch (e) {
      return false;
    }
  },

  // 🛡️ 10 كۈندىن ئاشقان پۈتكەن زاكازنىڭ شەخسىي ئۇچۇرىنى بۇلۇتتا مەخپىيلەشتۈرۈش (Privacy Wipe)
  async anonymizeOrder(orderId) {
    const sb = getSupabase();
    if (!sb) return false;
    try {
      const anonymizedCustomer = {
        name: '[شەخسىي ئۇچۇر ئۆچۈرۈلدى]',
        phone: '',
        address: '',
        city: '',
        isAnonymized: true,
        anonymizedAt: new Date().toISOString()
      };
      const { error } = await sb.from('orders').update({
        customer: anonymizedCustomer,
        notes: '',
        tracking_number: null
      }).eq('id', orderId);
      return !error;
    } catch (e) {
      console.warn('Supabase anonymizeOrder error:', e);
      return false;
    }
  },

  // 🛡️ بارلىق 10 كۈندىن ئاشقان زاكازلارنى بۇلۇتتا تۈركۈملەپ مەخپىيلەشتۈرۈش
  async runCloudPrivacyCleanup(daysThreshold = 10) {
    const sb = getSupabase();
    if (!sb) return 0;
    try {
      // 1. ئالدى بىلەن مەخسۇس SQL فۇنكسىيەسى (RPC) نى چاقىرىشقا سىناش
      const { data, error } = await sb.rpc('anonymize_expired_orders', { days_threshold: daysThreshold });
      if (!error && typeof data === 'number') {
        return data;
      }
    } catch (e) {}

    // 2. ئەگەر RPC تېخى بېكىتىلمىگەن بولسا، سىستېما سۈزۈپ يېڭىلاش
    try {
      const { data: orders, error } = await sb.from('orders')
        .select('*')
        .in('status', ['تاماملاندى', 'بىكار قىلىندى']);
      if (error || !orders) return 0;

      const now = Date.now();
      const maxAgeMs = daysThreshold * 24 * 60 * 60 * 1000;
      let count = 0;

      for (const ord of orders) {
        const cust = (typeof ord.customer === 'string') ? JSON.parse(ord.customer || '{}') : (ord.customer || {});
        if (cust && cust.isAnonymized) continue;

        let ordTime = 0;
        if (ord.completed_at) ordTime = new Date(ord.completed_at).getTime();
        else if (ord.shipped_at) ordTime = new Date(ord.shipped_at).getTime();
        else if (ord.date) ordTime = new Date(ord.date.replace(/\//g, '-')).getTime();
        else if (ord.created_at) ordTime = new Date(ord.created_at).getTime();

        if (ordTime > 0 && (now - ordTime >= maxAgeMs)) {
          await this.anonymizeOrder(ord.id);
          count++;
        }
      }
      return count;
    } catch (e) {
      return 0;
    }
  },

  // ۋاكالەتچىلەرنى ئوقۇش
  async fetchAgents() {
    const sb = getSupabase();
    if (!sb) return null;
    try {
      const { data, error } = await sb.from('agents').select('*');
      if (error) return null;
      return data;
    } catch (e) {
      return null;
    }
  },

  // ۋاكالەتچىنى ساقلاش (Supabase agents جەدۋىلىگە ماس ھالەتتە)
  async upsertAgent(agent) {
    const sb = getSupabase();
    if (!sb) return false;
    try {
      // ماركىلار ۋە ئىلتىماس/كېلىشىم قوشۇمچە ئۇچۇرلىرىنى authorized_brands غا بىخەتەر قاچىلاش
      let brandsPayload = Array.isArray(agent.authorizedBrands) 
        ? agent.authorizedBrands.filter(b => typeof b === 'string') 
        : [];

      const metaObj = {
        _meta: true,
        proposedBrands: agent.proposedBrands || '',
        notes: agent.notes || '',
        legalAgreement: agent.legalAgreement || null,
        suspendedUntil: agent.suspendedUntil || null,
        suspensionReason: agent.suspensionReason || ''
      };
      brandsPayload.push(metaObj);

      const row = {
        id: agent.id,
        name: agent.name,
        email: agent.email || '',
        phone: agent.phone || '',
        city: agent.city || 'ئىستانبۇل',
        status: agent.status || 'تەستىقلاندى',
        reputation: agent.reputation || 'ئىشەنچىلىك سودىگەر',
        can_publish_multilingual: !!agent.canPublishMultilingual,
        authorized_brands: brandsPayload,
        registered_at: agent.registeredAt || new Date().toISOString().split('T')[0],
        auth_expire_date: agent.authExpireDate || '2027-09-18',
        cert_code: (agent.legalAgreement && agent.legalAgreement.contractNumber) || agent.certCode || ('TK-CERT-2026-' + (agent.id ? agent.id.replace(/\D/g, '') : '100')),
        products_count: Number(agent.productsCount || 0),
        sales_total: Number(agent.salesTotal || 0),
        monthly_sales: Number(agent.monthlySales || 0),
        monthly_orders: Number(agent.monthlyOrders || 0),
        commission_rate: Number(agent.commissionRate || 15),
        violations_count: Number(agent.violationsCount || 0)
      };

      const { error } = await sb.from('agents').upsert(row);
      if (error) {
        console.warn('Supabase upsertAgent error:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Supabase agent exception:', e);
      return false;
    }
  },

  // 📲 تېلېفون Web Push مۇشتەرىلىكىنى ساقلاش ۋە يېڭىلاش
  async savePushSubscription(subData) {
    // يەرلىك كۆرگۈچكە قوشۇمچە تۇراقلىق ساقلاپ قويۇش
    try {
      localStorage.setItem('teklimakan_local_push_sub', JSON.stringify(subData));
    } catch (e) {}

    const sb = getSupabase();
    if (!sb) return false;
    try {
      const { data, error } = await sb.from('push_subscriptions').upsert(subData, { onConflict: 'endpoint' });
      if (error) {
        console.warn('Supabase push_subscriptions ساقلاشتا خاتالىق:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Supabase push_subscriptions ئۇلىنىش خاتالىقى:', e);
      return false;
    }
  },

  // 📊 ئەسكەرتىش مۇشتەرىلىرى تىزىملىكى ۋە ستاتىستىكىسىنى ئوقۇش
  async getPushStats() {
    const sb = getSupabase();
    let localSub = null;
    try {
      localSub = JSON.parse(localStorage.getItem('teklimakan_local_push_sub') || 'null');
    } catch (e) {}

    if (!sb) {
      return {
        total: localSub ? 1 : 0,
        ug: localSub && localSub.preferred_lang === 'ug' ? 1 : 0,
        tr: localSub && localSub.preferred_lang === 'tr' ? 1 : 0,
        en: localSub && localSub.preferred_lang === 'en' ? 1 : 0,
        subscriptions: localSub ? [localSub] : []
      };
    }

    try {
      const { data, error } = await sb.from('push_subscriptions').select('*');
      if (error || !data) {
        return {
          total: localSub ? 1 : 0,
          ug: localSub && localSub.preferred_lang === 'ug' ? 1 : 0,
          tr: localSub && localSub.preferred_lang === 'tr' ? 1 : 0,
          en: localSub && localSub.preferred_lang === 'en' ? 1 : 0,
          subscriptions: localSub ? [localSub] : []
        };
      }

      const total = data.length;
      const ug = data.filter(d => d.preferred_lang === 'ug' || !d.preferred_lang).length;
      const tr = data.filter(d => d.preferred_lang === 'tr').length;
      const en = data.filter(d => d.preferred_lang === 'en').length;

      return { total, ug, tr, en, subscriptions: data };
    } catch (e) {
      return { total: 0, ug: 0, tr: 0, en: 0, subscriptions: [] };
    }
  },

  // 📝 ئەۋەتىلگەن Push ئۇچۇرلىرىنى بۇلۇتقا خاتىرىلەش
  async logPushBroadcast(broadcastData) {
    const sb = getSupabase();
    if (!sb) return false;
    try {
      await sb.from('push_broadcast_logs').insert([broadcastData]);
      return true;
    } catch (e) {
      return false;
    }
  }
};

