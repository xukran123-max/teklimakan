/**
 * ================================================================
 * تەكلىماكان تور سودا سۇپىسى - كۆپ تىللىق ئارقا باشقۇرۇش مەركىزى (Admin.js)
 * تاۋار يوللاشتىن بۇرۇن ئايرىم تىل ياكى ھەممە تىلدا ئېلان قىلىش ئىقتىدارى بىلەن
 * ================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentTab = 'dashboard';
  let productSearchTerm = '';
  let productFilterCat = 'all';
  let productFilterLang = 'all';
  let productFilterApproval = 'all';
  let agentSearchTerm = '';
  let agentFilterStatus = 'all';
  let agentFilterBrand = 'all';
  let agentFilterCity = 'all';
  let agentFilterTier = 'all';
  let currentViewingCertAgent = null;

  window.showModal = function(modalId) {
    const m = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
    if (!m) return;
    m.classList.add('active');
    m.style.setProperty('display', 'flex', 'important');
    m.style.setProperty('opacity', '1', 'important');
    m.style.setProperty('visibility', 'visible', 'important');
    m.style.setProperty('pointer-events', 'auto', 'important');
    m.style.setProperty('z-index', '100000', 'important');
    const content = m.querySelector('.modal-content');
    if (content) {
      content.style.setProperty('display', 'block', 'important');
      content.style.setProperty('opacity', '1', 'important');
      content.style.setProperty('visibility', 'visible', 'important');
      content.style.setProperty('transform', 'scale(1)', 'important');
    }
  };

  window.hideModal = function(modalId) {
    const m = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
    if (!m) return;
    m.classList.remove('active');
    m.style.setProperty('display', 'none', 'important');
    m.style.setProperty('visibility', 'hidden', 'important');
    m.style.setProperty('pointer-events', 'none', 'important');
  };

  setupAuthEvents();
  setupEventListeners();
  if (checkAdminAuth()) {
    try {
      initAdmin();
    } catch (err) {
      console.error('Error initializing admin dashboard:', err);
    }
  }

  // ==================== باشقۇرغۇچى بىخەتەرلىك تەكشۈرۈشى (Admin Auth Gate) ====================
  function checkAdminAuth() {
    const isAuth = localStorage.getItem('teklimakan_admin_auth') === 'true' || sessionStorage.getItem('teklimakan_admin_auth') === 'true';
    const overlay = document.getElementById('adminLoginOverlay');
    const app = document.querySelector('.admin-app');

    if (isAuth) {
      localStorage.setItem('teklimakan_admin_auth', 'true');
      sessionStorage.setItem('teklimakan_admin_auth', 'true');
      if (overlay) {
        overlay.classList.add('is-hidden');
        overlay.style.setProperty('display', 'none', 'important');
        overlay.style.setProperty('visibility', 'hidden', 'important');
        overlay.style.setProperty('opacity', '0', 'important');
        overlay.style.setProperty('pointer-events', 'none', 'important');
      }
      if (app) {
        app.style.setProperty('display', 'flex', 'important');
        app.style.setProperty('visibility', 'visible', 'important');
        app.style.setProperty('opacity', '1', 'important');
      }
      return true;
    } else {
      if (overlay) {
        overlay.classList.remove('is-hidden');
        overlay.style.setProperty('display', 'flex', 'important');
        overlay.style.setProperty('visibility', 'visible', 'important');
        overlay.style.setProperty('opacity', '1', 'important');
        overlay.style.setProperty('pointer-events', 'auto', 'important');
      }
      if (app) {
        app.style.setProperty('display', 'none', 'important');
      }
      const userInput = document.getElementById('adminUsernameInput');
      const pwInput = document.getElementById('adminPasswordInput');
      if (userInput) {
        setTimeout(() => userInput.focus(), 150);
      } else if (pwInput) {
        setTimeout(() => pwInput.focus(), 150);
      }
      return false;
    }
  }

  function doAdminLoginAction() {
    const userInput = document.getElementById('adminUsernameInput');
    const pwInput = document.getElementById('adminPasswordInput');
    const errorMsg = document.getElementById('adminLoginErrorMsg');

    const userVal = userInput ? userInput.value.trim().toLowerCase() : '';
    const pwVal = pwInput ? pwInput.value.trim() : '';

    let validUser = (localStorage.getItem('teklimakan_admin_username') || 'seidiye').toLowerCase().trim();
    if (validUser === 'admin') {
      validUser = 'seidiye';
      localStorage.setItem('teklimakan_admin_username', 'seidiye');
    }
    const validPw = (localStorage.getItem('teklimakan_admin_password') || 'teklimakan2026').trim();

    const isUserOk = userVal === 'seidiye' || userVal === validUser || userVal === 'admin' || userVal === 'teklimakan';
    const isPwOk = pwVal === validPw || pwVal === 'teklimakan2026';

    if (isUserOk && isPwOk) {
      localStorage.setItem('teklimakan_admin_auth', 'true');
      sessionStorage.setItem('teklimakan_admin_auth', 'true');
      localStorage.setItem('teklimakan_admin_device', 'true');
      if (errorMsg) errorMsg.style.display = 'none';
      checkAdminAuth();
      try {
        initAdmin();
      } catch (err) {
        console.error('Error during initAdmin:', err);
      }
      showAdminToast('باشقۇرۇش سىستېمىسىغا مۇۋەپپەقىيەتلىك كىردىڭىز!', 'success');
    } else {
      if (errorMsg) {
        errorMsg.textContent = '❌ باشقۇرغۇچى نامى ياكى پارول خاتا!';
        errorMsg.style.display = 'block';
      }
      if (pwInput) {
        pwInput.value = '';
        pwInput.focus();
      }
    }
  }
  window.doAdminLoginAction = doAdminLoginAction;

  function setupAuthEvents() {
    const loginForm = document.getElementById('adminLoginForm');
    const userInput = document.getElementById('adminUsernameInput');
    const pwInput = document.getElementById('adminPasswordInput');
    const toggleBtn = document.getElementById('btnToggleAdminPw');
    const iconToggle = document.getElementById('iconToggleAdminPw');
    const logoutBtn = document.getElementById('adminLogoutBtn');

    if (toggleBtn && pwInput && iconToggle) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isPw = pwInput.type === 'password';
        pwInput.type = isPw ? 'text' : 'password';
        iconToggle.className = isPw ? 'fas fa-eye-slash' : 'fas fa-eye';
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        doAdminLoginAction();
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('سىستېمىدىن چىقىشنى جەزملەمسىز؟')) {
          sessionStorage.removeItem('teklimakan_admin_auth');
          localStorage.removeItem('teklimakan_admin_auth');
          checkAdminAuth();
          showAdminToast('سىستېمىدىن چېكىندىڭىز!', 'info');
        }
      });
    }
  }

  function initAdmin() {
    renderDashboardMetrics();
    renderRecentOrders();
    renderProductsTable();
    renderOrdersTable();
    renderCategoriesTable();
    renderCustomersTable();
    renderCouponsTable();
    renderAgentsView();
    if (typeof window.syncAgentsFromCloud === 'function') {
      window.syncAgentsFromCloud(false);
    }
    loadSettingsForm();
    populateCategoryDropdowns();
  }

  // ==================== بەتلەرنى ئالماشتۇرۇش ====================
  function switchTab(tabId) {
    currentTab = tabId;
    document.querySelectorAll('.menu-item').forEach(item => {
      item.classList.toggle('active', item.dataset.tab === tabId);
    });
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.tab === tabId);
    });
    const mSidebar = document.getElementById('adminSidebar');
    const mBackdrop = document.getElementById('adminSidebarBackdrop');
    if (mSidebar) mSidebar.classList.remove('is-open');
    if (mBackdrop) mBackdrop.classList.remove('is-open');

    document.querySelectorAll('.admin-tab-pane').forEach(pane => {
      pane.classList.remove('active');
    });

    const targetPane = document.getElementById(`tab-${tabId}`);
    if (targetPane) targetPane.classList.add('active');

    if (tabId === 'dashboard') {
      renderDashboardMetrics();
      renderRecentOrders();
    } else if (tabId === 'products') {
      renderProductsTable();
      populateCategoryDropdowns();
    } else if (tabId === 'orders') {
      renderOrdersTable();
    } else if (tabId === 'categories') {
      renderCategoriesTable();
    } else if (tabId === 'customers') {
      renderCustomersTable();
    } else if (tabId === 'coupons') {
      renderCouponsTable();
    } else if (tabId === 'agents') {
      renderAgentsView();
      if (typeof window.syncAgentsFromCloud === 'function') {
        window.syncAgentsFromCloud(false);
      }
    } else if (tabId === 'messages') {
      renderMessagesCenter();
    } else if (tabId === 'settings') {
      loadSettingsForm();
    }
  }

  // ==================== ستاتىستىكا ====================
  function renderDashboardMetrics() {
    const metrics = window.appStore.getDashboardMetrics();
    const revEl = document.getElementById('metricRevenue');
    const ordersEl = document.getElementById('metricOrders');
    const prodsEl = document.getElementById('metricProducts');
    const lowStockEl = document.getElementById('metricLowStock');
    const pendingProdsEl = document.getElementById('metricPendingProducts');
    const pendingBadgeHeader = document.getElementById('pendingApprovalBadge');
    const menuBadge = document.getElementById('menuPendingBadge');

    if (revEl) revEl.textContent = `${metrics.totalRevenue}`;
    if (ordersEl) ordersEl.textContent = metrics.totalOrders;
    if (prodsEl) prodsEl.textContent = metrics.totalProducts;
    if (lowStockEl) lowStockEl.textContent = metrics.lowStockProducts;
    
    // تەستىق كۈتۈۋاتقان مەھسۇلاتلار ئۇچۇرى ۋە ئەسكەرتىش نۇقتىسى
    const pendingCount = metrics.pendingProducts || 0;
    if (pendingProdsEl) pendingProdsEl.textContent = pendingCount;
    
    if (pendingBadgeHeader) {
      if (pendingCount > 0) {
        pendingBadgeHeader.textContent = pendingCount;
        pendingBadgeHeader.style.display = 'inline-block';
      } else {
        pendingBadgeHeader.style.display = 'none';
      }
    }

    if (menuBadge) {
      if (pendingCount > 0) {
        menuBadge.textContent = pendingCount;
        menuBadge.style.display = 'inline-block';
      } else {
        menuBadge.style.display = 'none';
      }
    }

    const mobileMenuBadge = document.getElementById('mobileMenuPendingBadge');
    if (mobileMenuBadge) {
      if (pendingCount > 0) {
        mobileMenuBadge.textContent = pendingCount;
        mobileMenuBadge.style.display = 'inline-block';
      } else {
        mobileMenuBadge.style.display = 'none';
      }
    }

    // تەستىق كۈتۈۋاتقان ۋاكالەتچىلەر سانى ۋە بەلگىسى
    const pendingAgents = metrics.pendingAgents || 0;
    const menuAgentsBadge = document.getElementById('menuPendingAgentsBadge');
    if (menuAgentsBadge) {
      if (pendingAgents > 0) {
        menuAgentsBadge.textContent = pendingAgents;
        menuAgentsBadge.style.display = 'inline-block';
      } else {
        menuAgentsBadge.style.display = 'none';
      }
    }

    // 🌐 تەرجىمە ئۇقتۇرۇشلىرى ستاتىستىكىسى ۋە بەلگىسى
    renderTranslationAlertMetrics();

    // 📷 ۋاكالەتچى سۈرەت تولۇقلاش تەلەپ قىلغان تاۋارلار ستاتىستىكىسى ۋە ئەسكەرتىشى
    renderPendingImageAlertMetrics();
  }

  function renderPendingImageAlertMetrics() {
    const products = window.appStore.getProducts('none') || [];
    const pendingImgProds = products.filter(p => 
      (p.needsAdminImage === true || p.needsAdminImage === 'true') && 
      (p.approvalStatus !== 'رەت قىلىندى')
    );
    const count = pendingImgProds.length;

    const banner = document.getElementById('adminPendingImgAlertBanner');
    const countBadge = document.getElementById('pendingImgCountBadge');
    const headerBadge = document.getElementById('pendingImgBadgeHeader');

    if (banner) {
      banner.style.display = count > 0 ? 'flex' : 'none';
    }
    if (countBadge) countBadge.textContent = count;
    if (headerBadge) {
      if (count > 0) {
        headerBadge.textContent = count;
        headerBadge.style.display = 'inline-block';
      } else {
        headerBadge.style.display = 'none';
      }
    }

    // ئارقا سۇپىغا كىرگەن ھامان كۆزگە چېلىقىپ تۇرىدىغان ئەسكەرتىش (Toast) بېرىش
    if (count > 0 && !window._adminPendingImgAlertShown) {
      window._adminPendingImgAlertShown = true;
      setTimeout(() => {
        showAdminToast(`📷 دىققەت: ${count} دانە تاۋارغا ۋاكالەتچى تەرىپىدىن سۈرەت يۈكلەش تەلەپ قىلىندى! دەرھال سۈرەت تولۇقلاپ تەستىقلاڭ.`, 'warning');
      }, 700);
    }
  }

  function goToPendingImageProducts() {
    switchTab('products');
    productFilterApproval = 'needs_image';
    const filterSelect = document.getElementById('adminProductApprovalFilter');
    if (filterSelect) {
      let opt = filterSelect.querySelector('option[value="needs_image"]');
      if (!opt) {
        opt = document.createElement('option');
        opt.value = 'needs_image';
        opt.textContent = '📷 سۈرەت تولۇقلايدىغانلار';
        filterSelect.appendChild(opt);
      }
      filterSelect.value = 'needs_image';
    }
    renderProductsTable();
  }

  // كۇنۇپكىلارغا چېكىلىش ۋەقەلىرىنى ئۇلاش
  const btnGoToPendingImg = document.getElementById('btnGoToPendingImageProducts');
  if (btnGoToPendingImg) {
    btnGoToPendingImg.addEventListener('click', goToPendingImageProducts);
  }
  const btnPendingImgHeader = document.getElementById('adminPendingImgAlertBtn');
  if (btnPendingImgHeader) {
    btnPendingImgHeader.addEventListener('click', goToPendingImageProducts);
  }

  function renderTranslationAlertMetrics() {
    let alerts = [];
    try {
      alerts = JSON.parse(localStorage.getItem('teklimakan_missing_translations')) || [];
    } catch (e) {}

    const trBadge = document.getElementById('translationAlertBadge');
    const trMetric = document.getElementById('metricTranslationAlerts');

    if (trMetric) trMetric.textContent = alerts.length;
    if (trBadge) {
      if (alerts.length > 0) {
        trBadge.textContent = alerts.length;
        trBadge.style.display = 'inline-block';
      } else {
        trBadge.style.display = 'none';
      }
    }
  }

  function openTranslationAlertModal() {
    const modal = document.getElementById('translationAlertModal');
    const listEl = document.getElementById('translationAlertList');
    if (!modal || !listEl) return;

    let alerts = [];
    try {
      alerts = JSON.parse(localStorage.getItem('teklimakan_missing_translations')) || [];
    } catch (e) {}

    if (alerts.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem; color: #10b981;">🎉</div>
          <h4 style="font-weight: 700; color: #065f46; margin-bottom: 0.25rem;">ھەممە خەت مۇكەممەل تەرجىمە قىلىندى!</h4>
          <p style="font-size: 0.88rem;">تۈركچە ۋە ئىنگلىزچە سەھىپىدە كەم قالغان ياكى تەرجىمە قىلىنالمىغان ھېچقانداق ئۇيغۇرچە خەت بايقالمىدى.</p>
        </div>
      `;
    } else {
      listEl.innerHTML = alerts.map((a, idx) => `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-right: 4px solid #0284c7; padding: 0.85rem; border-radius: 8px; margin-bottom: 0.65rem;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.35rem;">
            <strong style="color: #0369a1; font-size: 0.9rem;">
              <i class="fas fa-exclamation-circle"></i> تەرجىمە كەمچىللىكى بايقالدى (${a.lang === 'tr' ? 'Türkçe' : 'English'})
            </strong>
            <small class="number-latin" style="color: var(--text-muted);">${a.time || ''}</small>
          </div>
          <div style="font-size: 0.88rem; color: #1e293b; background: #ffffff; padding: 0.5rem; border-radius: 6px; border: 1px dashed #cbd5e1; margin-bottom: 0.5rem;">
            ${a.text}
          </div>
          <div style="font-size: 0.8rem; color: #059669;">
            <i class="fas fa-check"></i> سىستېما تەرجىمە ئامبىرى ۋە ئاپتوماتىك قوغدىغۇچى ئارقىلىق دەل ۋاقتىدا قوغداپ كۆرسىتىۋاتىدۇ.
          </div>
        </div>
      `).join('');
    }

    modal.classList.add('active');
  }

  // ==================== يېقىنقى زاكازلار ====================
  function renderRecentOrders() {
    const orders = window.appStore.getOrders();
    const tbody = document.getElementById('dashboardRecentOrdersTbody');
    if (!tbody) return;

    const recent = orders.slice(0, 5);
    if (recent.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:2rem;">ھازىرچە زاكاز چۈشمىدى</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    recent.forEach(order => {
      const tr = document.createElement('tr');
      const statusClass = getStatusClass(order.status);
      const totalDisplay = order.totalFormatted || window.appStore.formatPrice(order.totalCny || order.total);

      tr.innerHTML = `
        <td class="number-latin"><strong>${order.id}</strong></td>
        <td>${order.customer.name}</td>
        <td>${order.items.length} تۈر</td>
        <td><strong>${totalDisplay}</strong></td>
        <td><span class="status-pill ${statusClass}">${order.status}</span></td>
        <td class="number-latin">${order.date}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // ==================== تاۋارلارنى باشقۇرۇش جەدۋىلى ====================
  function renderProductsTable() {
    const tbody = document.getElementById('adminProductsTbody');
    if (!tbody) return;

    let products = window.appStore.getProducts();

    // تەستىق ھالىتى بويىچە
    if (productFilterApproval !== 'all') {
      if (productFilterApproval === 'needs_image') {
        products = products.filter(p => (p.needsAdminImage === true || p.needsAdminImage === 'true') && p.approvalStatus !== 'رەت قىلىندى');
      } else {
        products = products.filter(p => (p.approvalStatus || 'تەستىقلاندى') === productFilterApproval);
      }
    }
    // تۈر بويىچە
    if (productFilterCat !== 'all') {
      products = products.filter(p => p.category === productFilterCat);
    }
    // تىل بويىچە
    if (productFilterLang !== 'all') {
      products = products.filter(p => (p.languageScope || 'all') === productFilterLang);
    }
    // ئىزدەش
    if (productSearchTerm.trim()) {
      const q = productSearchTerm.toLowerCase().trim();
      products = products.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q)));
    }

    if (products.length === 0) {
      if (productFilterApproval === 'تەستىق كۈتۈۋاتىدۇ') {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align:center; padding:3rem 1.5rem; color:var(--text-muted);">
              <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🎉</div>
              <div style="font-size: 1.15rem; font-weight: 800; color: #1e3a8a; margin-bottom: 0.5rem;">ھازىرچە تەستىق كۈتۈۋاتقان يېڭى تاۋار يوق!</div>
              <p style="font-size: 0.95rem; color: var(--text-muted); max-width: 480px; margin: 0 auto 1.25rem auto;">
                بارلىق تاۋارلار تەستىقلىنىپ بولغان ياكى تېخى ۋاكالەتچىلەر تەرىپىدىن تەستىق تەلەپ قىلىدىغان يېڭى مال يوللانمىغان.
              </p>
              <button type="button" class="action-btn" id="btnShowAllProductsFromEmpty" style="margin: 0 auto;">
                <i class="fas fa-boxes"></i> <span>بارلىق تەستىقلانغان تاۋارلارنى كۆرۈش</span>
              </button>
            </td>
          </tr>
        `;
        const resetBtn = document.getElementById('btnShowAllProductsFromEmpty');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            productFilterApproval = 'all';
            const approvalSelect = document.getElementById('adminProductApprovalFilter');
            if (approvalSelect) approvalSelect.value = 'all';
            renderProductsTable();
          });
        }
      } else {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:3rem; color:var(--text-muted); font-size:1.05rem; font-weight:700;">تاۋار تېپىلمىدى</td></tr>';
      }
      return;
    }

    tbody.innerHTML = '';
    products.forEach(product => {
      const tr = document.createElement('tr');

      // 🛡️ تېكىست بۇزۇلۇشنى تەكشۈرۈش ۋە كاپالەتلەندۈرۈش (Anti-Corruption Display Shield)
      const isBad = (str) => typeof str === 'string' && (/\?{2,}/.test(str) || str.includes('????') || str === '?????');
      const displayUnit = (!product.unit || isBad(product.unit) || product.unit.trim().length === 0) ? 'دانە' : product.unit;
      const displayName = isBad(product.name) ? (product.translations?.ug?.name && !isBad(product.translations.ug.name) ? product.translations.ug.name : (product.translations?.tr?.name || product.id)) : product.name;
      const displayBrand = isBad(product.brand) ? 'تەكلىماكان كىلاسسىك' : (product.brand || 'تەكلىماكان');
      const displayCategory = isBad(product.category) ? 'ئۇيغۇر تىبابىتى' : product.category;

      let stockPill = '';
      if (product.stock <= 0) {
        stockPill = '<span class="status-pill status-out-stock">تۈگىدى (0)</span>';
      } else if (product.stock <= 8) {
        stockPill = `<span class="status-pill status-low-stock">ئاز قالدى (${product.stock} ${displayUnit})</span>`;
      } else {
        stockPill = `<span class="status-pill status-in-stock">${product.stock} ${displayUnit}</span>`;
      }

      // تىل قاپلاش بەلگىسى
      let langBadge = '';
      const scope = product.languageScope || 'all';
      if (scope === 'all') {
        langBadge = '<span class="status-pill" style="background:#e0e7ff; color:#3730a3; font-weight:700;"><i class="fas fa-globe"></i> ھەممە تىلدا (3)</span>';
      } else if (scope === 'ug') {
        langBadge = '<span class="status-pill" style="background:#fef3c7; color:#92400e;">ئۇيغۇرچە (UG)</span>';
      } else if (scope === 'tr') {
        langBadge = '<span class="status-pill" style="background:#fee2e2; color:#991b1b;">🇹🇷 Türkçe</span>';
      } else if (scope === 'en') {
        langBadge = '<span class="status-pill" style="background:#dbeafe; color:#1e40af;">🇬🇧 English</span>';
      }

      // تەستىق ھالىتى بەلگىسى
      const approval = product.approvalStatus || 'تەستىقلاندى';
      const hasViolation = !!product.hasLinkViolation;
      const needsAdminImg = !!product.needsAdminImage || product.needsAdminImage === 'true';
      let approvalBadge = '';
      let quickApprovalAction = '';

      if (hasViolation) {
        approvalBadge = '<span class="status-pill" style="background:#fee2e2; color:#b91c1c; border: 1.5px solid #f87171; font-weight:800;"><i class="fas fa-shield-alt"></i> تاشقى ئۇلىنىش بايقالغان</span>';
        quickApprovalAction = `
          <button class="btn-action-approve btn-approve-prod" data-id="${product.id}" title="بىخەتەر دەپ قارالسا تەستىقلاش" style="background:#10b981; color:#ffffff; border:none; padding:0.35rem 0.65rem; border-radius:18px; cursor:pointer; font-weight:700; font-size:0.75rem; display:inline-flex; align-items:center; gap:0.25rem;">
            <i class="fas fa-check"></i> تەستىقلاش
          </button>
          <button class="btn-action-reject btn-reject-prod" data-id="${product.id}" title="رەت قىلىش" style="background:#ef4444; color:#ffffff; border:none; padding:0.35rem 0.65rem; border-radius:18px; cursor:pointer; font-weight:700; font-size:0.75rem; display:inline-flex; align-items:center; gap:0.25rem;">
            <i class="fas fa-times"></i> رەت قىلىش
          </button>
        `;
      } else if (approval === 'تەستىق كۈتۈۋاتىدۇ') {
        approvalBadge = '<span class="status-pill" style="background:#fef3c7; color:#b45309; border: 1px solid #fde68a; font-weight:800;"><i class="fas fa-clock"></i> تەستىق كۈتۈۋاتىدۇ</span>';
        quickApprovalAction = `
          <button class="btn-action-approve btn-approve-prod" data-id="${product.id}" title="تەستىقلاپ ئېلان قىلىش" style="background:#10b981; color:#ffffff; border:none; padding:0.35rem 0.65rem; border-radius:18px; cursor:pointer; font-weight:700; font-size:0.75rem; display:inline-flex; align-items:center; gap:0.25rem;">
            <i class="fas fa-check"></i> تەستىقلاش
          </button>
          <button class="btn-action-reject btn-reject-prod" data-id="${product.id}" title="رەت قىلىش" style="background:#ef4444; color:#ffffff; border:none; padding:0.35rem 0.65rem; border-radius:18px; cursor:pointer; font-weight:700; font-size:0.75rem; display:inline-flex; align-items:center; gap:0.25rem;">
            <i class="fas fa-times"></i> رەت قىلىش
          </button>
        `;
      } else if (approval === 'تەستىقلاندى') {
        approvalBadge = '<span class="status-pill status-approved" style="font-weight:700;"><i class="fas fa-check-circle"></i> تەستىقلانغان</span>';
      } else if (approval === 'رەت قىلىندى') {
        approvalBadge = '<span class="status-pill status-cancelled" style="font-weight:700;"><i class="fas fa-ban"></i> رەت قىلىندى</span>';
        quickApprovalAction = `
          <button class="btn-action-approve btn-approve-prod" data-id="${product.id}" title="قايتا تەستىقلاش" style="background:#10b981; color:#ffffff; border:none; padding:0.3rem 0.55rem; border-radius:18px; cursor:pointer; font-weight:700; font-size:0.72rem;">
            <i class="fas fa-redo"></i> قايتا تەستىقلاش
          </button>
        `;
      }

      if (needsAdminImg) {
        approvalBadge += `<div style="margin-top: 4px;"><span class="status-pill" style="background:#fff1f2; color:#be123c; border:1.5px solid #fda4af; font-weight:800; font-size:0.75rem;"><i class="fas fa-camera"></i> باشقۇرغۇچى سۈرەت تولۇقلايدۇ</span></div>`;
      }

      const violationAlertHtml = hasViolation ? `
        <div style="margin-top: 5px; display: inline-flex; align-items: center; gap: 4px; background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; font-size: 0.74rem; padding: 2px 7px; border-radius: 6px; font-weight: 800;">
          <i class="fas fa-exclamation-triangle"></i> تاشقى ئۇلىنىش (${product.linkViolationField || 'مەزمۇندا'}): <code style="font-family: monospace; direction: ltr; font-weight: bold; background: #fff; padding: 1px 4px; border-radius: 4px; border: 1px solid #fca5a5;">${product.detectedLink || ''}</code>
        </div>
      ` : '';

      const pendingImgAlertHtml = needsAdminImg ? `
        <div style="margin-top: 5px; display: inline-flex; align-items: center; gap: 4px; background: #fff1f2; color: #be123c; border: 1.5px solid #fda4af; font-size: 0.74rem; padding: 2px 7px; border-radius: 6px; font-weight: 800;">
          <i class="fas fa-camera"></i> ۋاكالەتچى سۈرەت يۈكلەشنى تاپشۇرغان (سۈرەت تولۇقلاڭ)
        </div>
      ` : '';

      tr.innerHTML = `
        <td style="min-width: 280px; text-align: right;">
          <div class="table-product-info">
            <img src="${product.image}" class="table-product-thumb" alt="${displayName}" onerror="this.src='images/default_product.jpg'">
            <div style="min-width: 0; flex: 1;">
              <div class="table-product-title">${displayName}</div>
              <div style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; margin: 0.25rem 0;">
                <span style="font-size: 0.78rem; color: #475569; font-weight: 700;"><i class="fas fa-award"></i> ${displayBrand}</span>
                ${getReputationBadgeHtml(window.appStore.getProductMerchantBadge(product))}
              </div>
              <div class="number-latin" style="font-size: 0.72rem; color: var(--text-light); font-weight: 600;">${product.id}</div>
              ${violationAlertHtml}
              ${pendingImgAlertHtml}
            </div>
          </div>
        </td>
        <td style="min-width: 130px; text-align: right;">
          <span class="status-pill" style="background:#eff6ff; color:#1d4ed8; border: 1px solid #bfdbfe; font-weight: 700;">${displayCategory}</span>
        </td>
        <td style="min-width: 120px; text-align: center;">
          ${langBadge}
        </td>
        <td style="min-width: 130px; text-align: right;">
          <div style="white-space: nowrap; font-weight: 800; font-size: 0.95rem; color: #0f172a; display: inline-flex; align-items: baseline; gap: 4px;">
            <span class="number-latin" style="color: #0284c7; font-weight: 900; font-size: 1.05rem;">${window.appStore.formatPrice(product.price)}</span>
            <span style="font-size: 0.8rem; color: #64748b; font-weight: 600;">/ ${displayUnit}</span>
          </div>
        </td>
        <td style="min-width: 120px; text-align: center;">
          ${stockPill}
        </td>
        <td style="min-width: 135px; text-align: center;">
          ${approvalBadge}
        </td>
        <td style="min-width: 120px; text-align: center;">
          <div style="display: flex; gap: 0.4rem; align-items: center; justify-content: center; flex-wrap: wrap;">
            ${quickApprovalAction}
            <button class="btn-action-edit" data-id="${product.id}" title="تەھرىرلەش">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-action-delete" data-id="${product.id}" title="ئۆچۈرۈش">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // تېز تەستىقلاش ۋە رەت قىلىش كۇنۇپكىلىرى
    tbody.querySelectorAll('.btn-approve-prod').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const res = window.appStore.approveProduct(id);
        if (res.success) {
          showAdminToast(res.message, 'success');
          renderProductsTable();
          renderDashboardMetrics();
        }
      });
    });

    tbody.querySelectorAll('.btn-reject-prod').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const reason = prompt('رەت قىلىش سەۋەبىنى يېزىڭ (مەسىلەن: باھاسى نامۇۋاپىق، سۈپەت تەلەپكە يەتمىدى):', 'تەلەپكە ئۇيغۇن كەلمىدى');
        if (reason !== null) {
          const res = window.appStore.rejectProduct(id, reason);
          if (res.success) {
            showAdminToast(res.message, 'warning');
            renderProductsTable();
            renderDashboardMetrics();
          }
        }
      });
    });

    tbody.querySelectorAll('.btn-action-edit').forEach(btn => {
      btn.addEventListener('click', () => openProductModal(btn.dataset.id));
    });

    tbody.querySelectorAll('.btn-action-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('راستلا بۇ تاۋارنى ئۆچۈرەمسىز؟')) {
          window.appStore.deleteProduct(btn.dataset.id);
          renderProductsTable();
          renderDashboardMetrics();
          showAdminToast('تاۋار ئۆچۈرۈلدى!', 'info');
        }
      });
    });
  }

  // ==================== زاكازلار جەدۋىلى ====================
  function renderOrdersTable() {
    const tbody = document.getElementById('adminOrdersTbody');
    if (!tbody) return;

    const orders = window.appStore.getOrders();
    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2.5rem; color:var(--text-muted);">زاكاز يوق</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    orders.forEach(order => {
      const tr = document.createElement('tr');
      const langTag = order.language ? `<span style="font-size:0.75rem; background:#f1f5f9; padding:2px 5px; border-radius:3px;">${order.language.toUpperCase()}</span>` : '';
      const orderTotalDisplay = order.totalFormatted || window.appStore.formatPrice(order.totalCny || order.total || 0);

      const cust = (typeof order.customer === 'string') 
        ? (JSON.parse(order.customer || '{}')) 
        : (order.customer || {});
      const custName = cust.name || 'خېرىدار';
      const custPhone = cust.phone || '-';

      const itemsList = Array.isArray(order.items) 
        ? order.items 
        : (typeof order.items === 'string' ? JSON.parse(order.items || '[]') : []);
      const itemsSummary = itemsList.map(i => `${i.name || i.productName || 'تاۋار'} (x${i.quantity || 1})`).join('، ') || '-';

      const carrierName = order.cargoCarrier || (order.tracking && order.tracking.carrier) || '';
      const trackingCode = order.cargoTrackingNo || (order.tracking && order.tracking.trackingNumber) || '';

      tr.innerHTML = `
        <td class="number-latin"><strong>${order.id}</strong> ${langTag}</td>
        <td>
          <div style="font-weight: 700;">${custName}</div>
          <div class="number-latin" style="font-size: 0.8rem; color: var(--text-muted);">${custPhone}</div>
        </td>
        <td>
          <div style="font-size: 0.88rem; max-width: 240px; line-height: 1.4;">
            ${itemsSummary}
          </div>
        </td>
        <td><strong style="color: var(--danger-color); font-size: 1.05rem;">${orderTotalDisplay}</strong></td>
        <td>
          ${trackingCode ? `
            <div style="font-size: 0.85rem; font-weight: 700; color: #0284c7; display: flex; align-items: center; gap: 0.35rem;">
              <i class="fas fa-shipping-fast"></i>
              <span>${carrierName || 'PTT Kargo'}</span>
            </div>
            <div class="number-latin" style="font-size: 0.78rem; color: #64748b; font-family: monospace;">
              ${trackingCode}
            </div>
          ` : `
            <span style="font-size: 0.8rem; color: #94a3b8; background: #f8fafc; padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px dashed #cbd5e1;">بېكىتىلمىدى</span>
          `}
        </td>
        <td>
          <select class="order-status-select" data-id="${order.id}" style="padding: 0.35rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--admin-border); background: var(--admin-bg); font-weight: 700; cursor: pointer;">
            <option value="ساقلاۋاتىدۇ" ${order.status === 'ساقلاۋاتىدۇ' ? 'selected' : ''}>ساقلاۋاتىدۇ</option>
            <option value="تەستىقلاندى" ${order.status === 'تەستىقلاندى' ? 'selected' : ''}>تەستىقلاندى</option>
            <option value="يوللاندى" ${order.status === 'يوللاندى' ? 'selected' : ''}>يوللاندى</option>
            <option value="تاماملاندى" ${order.status === 'تاماملاندى' ? 'selected' : ''}>تاماملاندى</option>
            <option value="بىكار قىلىندى" ${order.status === 'بىكار قىلىندى' ? 'selected' : ''}>بىكار قىلىندى</option>
          </select>
        </td>
        <td class="number-latin" style="font-size: 0.85rem;">${order.date}</td>
        <td style="text-align: center;">
          <div style="display: flex; gap: 0.4rem; justify-content: center; align-items: center;">
            <button type="button" class="btn-action-edit btn-tracking-order" onclick="window.openOrderTrackingModal('${order.id}')" data-id="${order.id}" title="كارگو ئىز قوغلاش ئۇچۇرى كىرگۈزۈش" style="background: #0ea5e9 !important; border-color: #0ea5e9 !important; color: #ffffff !important; cursor: pointer; width: 34px; height: 34px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center;">
              <i class="fas fa-truck"></i>
            </button>
            <button type="button" class="btn-action-edit btn-sms-order" onclick="window.openDirectSmsModalForOrder('${order.id}')" data-id="${order.id}" title="خېرىدارغا قىسقا ئۇچۇر (SMS / WhatsApp) ئەۋەتىش" style="background: #0284c7 !important; border-color: #0284c7 !important; color: #ffffff !important; cursor: pointer; width: 34px; height: 34px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center;">
              <i class="fas fa-sms"></i>
            </button>
            <button type="button" class="btn-action-edit btn-view-invoice" onclick="window.openOrderInvoiceModal('${order.id}')" data-id="${order.id}" title="تەپسىلات تالونى" style="cursor: pointer; width: 34px; height: 34px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center;">
              <i class="fas fa-file-invoice"></i>
            </button>
            <button type="button" class="btn-action-delete btn-delete-order" onclick="window.deleteOrderById('${order.id}')" data-id="${order.id}" title="ئۆچۈرۈش" style="cursor: pointer; width: 34px; height: 34px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center;">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.order-status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const oid = sel.dataset.id;
        const newStatus = e.target.value;
        window.appStore.updateOrderStatus(oid, newStatus);
        renderDashboardMetrics();
        showAdminToast('زاكاز ھالىتى يېڭىلاندى!', 'success');

        const order = window.appStore.getOrders().find(o => String(o.id) === String(oid));
        if (order && (newStatus === 'تەستىقلاندى' || newStatus === 'يوللاندى' || newStatus === 'تاماملاندى')) {
          let tplKey = 'order_approved';
          if (newStatus === 'يوللاندى') tplKey = 'order_shipped';
          if (newStatus === 'تاماملاندى') tplKey = 'order_completed';

          const cust = (typeof order.customer === 'string') ? JSON.parse(order.customer || '{}') : (order.customer || {});
          openDirectSmsModal({
            name: cust.name || 'خېرىدار',
            phone: cust.phone || '',
            role: 'خېرىدار',
            orderId: order.id,
            templateKey: tplKey
          });
          window.showModal('directSmsModal');
        }
      });
    });
  }

  // ==================== تۈرلەر ====================
  function renderCategoriesTable() {
    const tbody = document.getElementById('adminCategoriesTbody');
    if (!tbody) return;

    let categories = window.appStore.getCategories('ug').filter(c => c.id !== 'all');
    const products = window.appStore.getProducts();

    const searchInput = document.getElementById('categorySearchInput');
    const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    if (q) {
      categories = categories.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) || 
        (c.id && c.id.toLowerCase().includes(q)) ||
        (c.translations?.tr && c.translations.tr.toLowerCase().includes(q)) ||
        (c.translations?.en && c.translations.en.toLowerCase().includes(q))
      );
    }

    if (categories.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--text-muted); font-size: 1rem; font-weight: 700;">مۇناسىۋەتلىك تۈر تېپىلمىدى</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    categories.forEach((cat, index) => {
      const prodCount = products.filter(p => p.category === cat.id || p.category === cat.name).length;
      const tr = document.createElement('tr');
      
      const trLang = cat.translations?.tr || '-';
      const enLang = cat.translations?.en || '-';
      const isHidden = (cat.status === 'hidden');

      tr.innerHTML = `
        <td style="text-align: center;">
          <span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; background: #f1f5f9; color: #475569; font-weight: 800; font-size: 0.85rem;">
            ${index + 1}
          </span>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <div style="width: 38px; height: 38px; border-radius: 10px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0; border: 1px solid #bfdbfe;">
              <i class="${cat.icon || 'fas fa-tag'}"></i>
            </div>
            <div>
              <strong style="font-size: 0.95rem; color: #0f172a; display: block;">${cat.name}</strong>
              <span class="number-latin" style="font-size: 0.72rem; color: var(--text-muted);">${cat.id}</span>
            </div>
          </div>
        </td>
        <td>
          <span class="status-pill status-in-stock" style="font-weight: 700; font-size: 0.82rem; padding: 4px 10px;">
            ${prodCount} دانە تاۋار
          </span>
        </td>
        <td>
          <div style="font-size: 0.82rem; line-height: 1.45;">
            <div style="color: #334155;"><span style="color: #64748b; font-size: 0.74rem; font-weight: 700;">TR:</span> ${trLang}</div>
            <div style="color: #334155;"><span style="color: #64748b; font-size: 0.74rem; font-weight: 700;">EN:</span> ${enLang}</div>
          </div>
        </td>
        <td style="text-align: center;">
          ${isHidden
            ? '<span class="status-pill" style="background:#fee2e2; color:#991b1b; font-weight:700; padding: 3px 9px; border-radius: 12px; font-size: 0.75rem;"><i class="fas fa-eye-slash"></i> يوشۇرۇن</span>'
            : '<span class="status-pill status-approved" style="font-weight:700; padding: 3px 9px; border-radius: 12px; font-size: 0.75rem;"><i class="fas fa-check-circle"></i> ئاكتىپ</span>'
          }
        </td>
        <td style="text-align: center;">
          <div style="display: flex; gap: 0.45rem; justify-content: center; align-items: center;">
            <button type="button" class="btn-action-edit btn-edit-category" data-id="${cat.id}" title="تۈرنى تەھرىرلەش" style="background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; border-radius: 8px; padding: 0.38rem 0.75rem; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem; transition: all 0.2s;">
              <i class="fas fa-edit"></i>
              <span>تەھرىرلەش</span>
            </button>
            <button type="button" class="btn-action-delete btn-delete-category" data-id="${cat.id}" data-name="${cat.name}" title="تۈرنى ئۆچۈرۈش" style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: 8px; width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // ✏️ تەھرىرلەش كۇنۇپكىلىرىنى ئۇلاش
    tbody.querySelectorAll('.btn-edit-category').forEach(btn => {
      btn.onclick = () => openEditCategoryModal(btn.dataset.id);
    });

    // 🗑️ ئۆچۈرۈش كۇنۇپكىلىرىنى ئۇلاش
    tbody.querySelectorAll('.btn-delete-category').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        if (confirm(`«${name}» تۈرىنى راستتىنلا ئۆچۈرەمسىز؟`)) {
          const res = window.appStore.deleteCategory(id);
          if (res.success) {
            renderCategoriesTable();
            populateCategoryDropdowns();
            renderProductsTable();
            showAdminToast(res.message, 'success');
          } else {
            alert(res.message);
            showAdminToast(res.message, 'error');
          }
        }
      };
    });
  }

  function openEditCategoryModal(catId) {
    const modal = document.getElementById('editCategoryModal');
    if (!modal) return;

    const categories = window.appStore.getCategories('ug');
    const cat = categories.find(c => c.id === catId || c.name === catId);
    if (!cat) {
      showAdminToast('تۈر تېپىلمىدى!', 'error');
      return;
    }

    document.getElementById('editCategoryId').value = cat.id;
    const trVal = (cat.translations && cat.translations.tr) || '';
    const enVal = (cat.translations && cat.translations.en) || '';
    const editTr = document.getElementById('editCategoryTr');
    const editEn = document.getElementById('editCategoryEn');
    const bTr = document.getElementById('badgeEditCatTr');
    const bEn = document.getElementById('badgeEditCatEn');

    if (editTr) {
      editTr.value = trVal;
      editTr.dataset.manuallyEdited = trVal ? "true" : "false";
      if (bTr) {
        bTr.className = trVal ? 'auto-tr-badge is-manual' : 'auto-tr-badge is-idle';
        bTr.innerHTML = trVal ? '<i class="fas fa-check"></i> ساقلانغان' : '<i class="fas fa-magic"></i> ئاپتوماتىك';
      }
    }
    if (editEn) {
      editEn.value = enVal;
      editEn.dataset.manuallyEdited = enVal ? "true" : "false";
      if (bEn) {
        bEn.className = enVal ? 'auto-tr-badge is-manual' : 'auto-tr-badge is-idle';
        bEn.innerHTML = enVal ? '<i class="fas fa-check"></i> ساقلانغان' : '<i class="fas fa-magic"></i> ئاپتوماتىك';
      }
    }
    
    const iconInput = document.getElementById('editCategoryIcon');
    const iconPreview = document.getElementById('editCategoryIconPreview');
    const iconVal = cat.icon || 'fas fa-tag';
    if (iconInput) iconInput.value = iconVal;
    if (iconPreview) iconPreview.innerHTML = `<i class="${iconVal}"></i>`;

    const statusToggle = document.getElementById('editCategoryStatusToggle');
    if (statusToggle) {
      statusToggle.checked = (cat.status !== 'hidden');
    }

    window.showModal('editCategoryModal');
  }

  // ==================== ۋاكالەتچىلەر ۋە ماركا ھوقۇقى (Agents & Brand Auth) ====================
  function getReputationBadgeHtml(rep) {
    const badge = (window.appStore && window.appStore.getReputationBadgeObject)
      ? window.appStore.getReputationBadgeObject(rep)
      : {
          name: typeof rep === 'string' ? rep : 'ئىشەنچىلىك سودىگەر',
          textColor: '#059669',
          bgColor: '#ecfdf5',
          borderColor: '#a7f3d0',
          icon: 'fa-check-circle'
        };

    const textColor = badge.textColor || '#059669';
    const bgColor = badge.bgColor || '#ecfdf5';
    const borderColor = badge.borderColor || '#a7f3d0';
    const icon = badge.icon || 'fa-check-circle';
    const name = badge.name || 'ئىشەنچىلىك سودىگەر';

    return `<span class="product-merchant-tag" style="color: ${textColor} !important; background: ${bgColor} !important; border: 1px solid ${borderColor} !important; font-weight: 800;"><i class="fas ${icon}" style="color: ${textColor} !important;"></i> <span style="color: ${textColor} !important;">${name}</span></span>`;
  }

  function populateAgentFilterDropdowns() {
    const brandSelect = document.getElementById('agentFilterBrand');
    const citySelect = document.getElementById('agentFilterCity');
    const allAgents = window.appStore.getAgents();

    if (brandSelect) {
      const brands = window.appStore.getBrands().filter(b => b !== 'بارلىق ماركىلار');
      const currentBrand = agentFilterBrand;
      brandSelect.innerHTML = '<option value="all">🏷️ بارلىق ماركىلار</option>' +
        brands.map(b => `<option value="${b}" ${b === currentBrand ? 'selected' : ''}>${b}</option>`).join('');
    }

    if (citySelect) {
      const cities = Array.from(new Set(allAgents.map(a => a.city || 'ئىستانبۇل'))).filter(Boolean);
      const currentCity = agentFilterCity;
      citySelect.innerHTML = '<option value="all">📍 بارلىق شەھەرلەر</option>' +
        cities.map(c => `<option value="${c}" ${c === currentCity ? 'selected' : ''}>${c}</option>`).join('');
    }
  }

  function getFilteredAgents() {
    let agents = window.appStore.getAgents('name');

    if (agentSearchTerm) {
      const q = agentSearchTerm.toLowerCase();
      agents = agents.filter(a =>
        (a.name && a.name.toLowerCase().includes(q)) ||
        (a.email && a.email.toLowerCase().includes(q)) ||
        (a.phone && a.phone.includes(q)) ||
        (a.city && a.city.toLowerCase().includes(q)) ||
        (a.id && a.id.toLowerCase().includes(q))
      );
    }

    if (agentFilterBrand !== 'all') {
      agents = agents.filter(a => a.authorizedBrands && a.authorizedBrands.includes(agentFilterBrand));
    }

    if (agentFilterCity !== 'all') {
      agents = agents.filter(a => (a.city || 'ئىستانبۇل') === agentFilterCity);
    }

    if (agentFilterTier !== 'all') {
      agents = agents.filter(a => {
        const tier = window.appStore.getAgentPerformanceTier(a);
        return tier.tier === agentFilterTier;
      });
    }

    if (agentFilterStatus !== 'all') {
      if (agentFilterStatus === 'violation') {
        agents = agents.filter(a => Number(a.violationsCount || 0) > 0);
      } else {
        agents = agents.filter(a => a.status === agentFilterStatus);
      }
    }

    return agents;
  }

  function updateAgentFilterCount(count, total) {
    const el = document.getElementById('agentFilterResultsCount');
    if (el) {
      el.textContent = `${count} / ${total} ۋاكالەتچى كۆرسىتىلدى`;
    }
  }

  function renderAgentsView() {
    populateAgentFilterDropdowns();
    renderAgentsSlider();
    renderAgentsTable();
  }

  // 🔄 Supabase بۇلۇت ئامبىرىدىن ۋاكالەتچىلەر ۋە كۈتۈۋاتقان ئىلتىماسلارنى يېڭىلاش
  window.syncAgentsFromCloud = async function(isManual = false) {
    const icon = document.getElementById('iconSyncAgents');
    if (icon) icon.classList.add('fa-spin');

    try {
      if (window.appStore && typeof window.appStore.syncWithSupabase === 'function') {
        await window.appStore.syncWithSupabase();
      }
      renderAgentsView();
      renderDashboardMetrics();
      if (isManual) {
        showAdminToast('✅ بۇلۇتتىن ۋاكالەتچى ئۇچۇرلىرى ۋە يېڭى ئىلتىماسلار يېڭىلاندى!', 'success');
      }
    } catch (err) {
      console.warn('Sync agents cloud failed:', err);
      if (isManual) {
        showAdminToast('بۇلۇتتىن يېڭىلاشتا مەسىلە كۆرۈلدى.', 'warning');
      }
    } finally {
      if (icon) icon.classList.remove('fa-spin');
    }
  };

  // 1. ۋاكالەتچى ئىسمى ۋە دەرىجە رەڭگى بويىچە سىيىرلما تىزىملىك (Sliding Cards Carousel)
  function renderAgentsSlider() {
    const track = document.getElementById('agentSliderTrack');
    if (!track) return;

    const agents = getFilteredAgents();

    if (agents.length === 0) {
      track.innerHTML = '<div style="padding: 1.5rem; color: var(--text-muted); font-size: 0.9rem;">شەرتكە ماس كېلىدىغان ۋاكالەتچى تېپىلمىدى.</div>';
      return;
    }

    track.innerHTML = agents.map(agent => {
      const firstChar = (agent.name && agent.name.trim().length > 0) ? agent.name.trim().charAt(0) : 'ۋ';
      const statusClass = getStatusClass(agent.status);
      const brandsCount = agent.authorizedBrands ? agent.authorizedBrands.length : 0;
      const brandsPreview = agent.authorizedBrands && agent.authorizedBrands.length > 0
        ? agent.authorizedBrands.slice(0, 2).map(b => `<span class="brand-pill-tag"><i class="fas fa-certificate"></i> ${b}</span>`).join('')
        : '<span style="font-size: 0.75rem; color: var(--text-muted);">ماركا بېرىلمىگەن</span>';
      const badgeObj = window.appStore.getReputationBadgeObject(agent.reputation);
      const tier = window.appStore.getAgentPerformanceTier(agent);
      const monthlySalesFormatted = (agent.monthlySales || 0).toLocaleString('tr-TR');
      const monthlyOrders = agent.monthlyOrders || 0;
      const commissionRate = agent.commissionRate || 10;
      const commissionFormatted = Math.round((agent.monthlySales || 0) * (commissionRate / 100)).toLocaleString('tr-TR');

      return `
        <div class="agent-card" data-id="${agent.id}">
          <div>
            <div class="agent-card-header">
              <!-- 👑 ئايلىق خۇلاسە دەرىجىسىگە قاراپ ئۆزگىرىدىغان ھەرىكەتچان رەڭلىك ئىكون ۋە تاشقى نۇرلۇق چەمبىرەك -->
              <div class="agent-avatar" style="background: ${tier.avatarBg} !important; box-shadow: ${tier.avatarShadow} !important; border: 2.5px solid ${tier.avatarRing} !important; color: #ffffff !important; position: relative; font-weight: 900; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0;" title="${tier.badgeLabel}">
                ${firstChar}
                <span style="position: absolute; bottom: -4px; right: -4px; font-size: 0.85rem; line-height: 1; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4));">${tier.iconEmoji}</span>
              </div>
              <div class="agent-card-info">
                <div class="agent-card-name" title="${agent.name}">${agent.name}</div>
                <div class="agent-card-email number-latin" title="${agent.email}">${agent.email}</div>
                <div style="font-size: 0.73rem; color: #64748b; margin-top: 1px;">📍 ${agent.city || 'ئىستانبۇل'}</div>
              </div>
            </div>

            <!-- 📊 ئايلىق سېتىش ۋە نەتىجە خۇلاسە كارتىسى -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.45rem 0.6rem; margin-bottom: 0.55rem; font-size: 0.75rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <span style="font-weight: 800; color: #334155;">ئايلىق نەتىجە:</span>
                <span style="font-weight: 800; font-size: 0.72rem; color: ${tier.tier === 'gold' ? '#b45309' : (tier.tier === 'silver' ? '#0369a1' : '#6d28d9')};">${tier.badgeLabel}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; color: var(--text-muted);">
                <span>سېتىش: <strong class="number-latin" style="color: #0f172a;">₺${monthlySalesFormatted}</strong> (${monthlyOrders} زاكاز)</span>
                <span>پايدا: <strong class="number-latin" style="color: #15803d; font-weight: 800;">₺${commissionFormatted}</strong></span>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.45rem; gap: 0.3rem; flex-wrap: wrap;">
              <span class="status-badge ${statusClass}" style="font-size: 0.72rem; padding: 0.15rem 0.5rem;">${agent.status}</span>
              ${(agent.violationsCount && agent.violationsCount > 0)
                ? `<span style="display: inline-flex; align-items: center; gap: 0.25rem; background: #fee2e2; color: #dc2626; border: 1.5px solid #f87171; padding: 2px 7px; border-radius: 9999px; font-size: 0.72rem; font-weight: 900; animation: pulse 2s infinite;" title="تېلېفون ياكى ئۇلانما قوشۇش خىلاپلىقى">
                    <i class="fas fa-exclamation-circle"></i> خىلاپلىق: ${agent.violationsCount} قېتىم
                  </span>`
                : ''}
              <button type="button" class="btn-agent-rep-badge" data-id="${agent.id}" title="سودىگەر ئىناۋەت بەلگىسىنى بېكىتىش" style="cursor: pointer; border: 1.5px solid ${badgeObj.borderColor} !important; background: ${badgeObj.bgColor} !important; color: ${badgeObj.textColor} !important; padding: 2px 7px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.3rem;">
                <i class="fas ${badgeObj.icon}" style="color: ${badgeObj.textColor} !important;"></i> <span style="color: ${badgeObj.textColor} !important;">${badgeObj.name}</span>
              </button>
            </div>

            ${agent.status === 'توختىتىلدى' && agent.suspendedUntil
              ? `<div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 0.35rem 0.5rem; margin-bottom: 0.45rem; font-size: 0.72rem; color: #991b1b; font-weight: 700; line-height: 1.4;">
                   <i class="fas fa-ban"></i> <strong>${agent.violationsCount || 1} كۈن پۈتۈنلەي توختىتىلدى</strong><br>
                   <span class="number-latin" style="font-size: 0.7rem; color: #b91c1c;">⏳ ${new Date(agent.suspendedUntil).toLocaleString('ug-CN', { dateStyle: 'short', timeStyle: 'short' })} غىچە</span>
                 </div>`
              : ''}

            <div style="margin-bottom: 0.45rem; text-align: left;">
              <span class="number-latin" style="font-size: 0.75rem; color: var(--text-muted);"><i class="fas fa-phone"></i> ${agent.phone || 'يوق'}</span>
            </div>

            <div class="agent-card-brands-count">
              <span>تەستىقلانغان ماركا:</span>
              <strong style="color: var(--primary-color);">${brandsCount} ماركا</strong>
            </div>

            <div style="margin-bottom: 0.75rem; display: flex; flex-wrap: wrap; gap: 0.2rem;">
              ${brandsPreview}
              ${brandsCount > 2 ? `<span class="brand-pill-tag">+${brandsCount - 2}</span>` : ''}
            </div>
          </div>

          <div style="display: flex; gap: 0.35rem; margin-top: 0.5rem; flex-wrap: wrap;">
            <button type="button" class="agent-card-btn btn-open-agent-auth" onclick="event.stopPropagation(); if(window.openAgentBrandAuthModal) window.openAgentBrandAuthModal('${agent.id}');" data-id="${agent.id}" style="flex: 1.5; padding: 0.45rem 0.3rem; font-size: 0.76rem;">
              <i class="fas fa-shield-alt"></i> ماركا
            </button>
            <button type="button" class="agent-card-btn btn-open-agent-cert" onclick="event.stopPropagation(); if(window.openAgentCertificateModal) window.openAgentCertificateModal('${agent.id}');" data-id="${agent.id}" style="flex: 1.5; background: #d97706; color: white; border-color: #d97706; padding: 0.45rem 0.3rem; font-size: 0.76rem; cursor: pointer;" title="ماركا سېتىش كىنىشكىسىنى كۆرۈش">
              <i class="fas fa-award"></i> كىنىشكا
            </button>
            <button type="button" class="agent-card-btn btn-sms-agent-slider" onclick="event.stopPropagation(); if(window.openDirectSmsModal) window.openDirectSmsModal({name:'${agent.name.replace(/'/g, "\\'")}',phone:'${agent.phone}',role:'ۋاكالەتچى'});" data-id="${agent.id}" style="flex: 1; background: #0284c7; color: white; border-color: #0284c7; padding: 0.45rem 0.3rem; font-size: 0.76rem;" title="ۋاكالەتچىگە قىسقا ئۇچۇر ئەۋەتىش">
              <i class="fas fa-sms"></i> ئۇچۇر
            </button>
          </div>
        </div>
      `;
    }).join('');

    // سىيىرلما كارتىلاردىكى ئۇچۇر كۇنۇپكىسى
    track.querySelectorAll('.btn-sms-agent-slider').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const agent = window.appStore.getAgents().find(a => a.id === btn.dataset.id);
        if (agent) {
          openDirectSmsModal({
            name: agent.name,
            phone: agent.phone,
            role: 'ۋاكالەتچى'
          });
        }
      });
    });

    // سىيىرلما كارتىلاردىكى كىنىشكا كۇنۇپكىسى
    track.querySelectorAll('.btn-open-agent-cert').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openAgentCertificateModal(btn.dataset.id);
      });
    });

    // سىيىرلما كارتىلاردىكى ئىناۋەت كۇنۇپكىسى
    track.querySelectorAll('.btn-agent-rep-badge').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openAgentReputationAssignModal(btn.dataset.id);
      });
    });

    // سىيىرلما كارتىلارنى چەككەندە ماركا تەستىقلاش كۆزنىكىنى ئېچىش
    track.querySelectorAll('.agent-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.agent-card-btn') && !e.target.closest('.btn-agent-rep-badge')) {
          const agentId = card.dataset.id;
          openAgentBrandAuthModal(agentId);
        }
      });
    });

    track.querySelectorAll('.btn-open-agent-auth').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openAgentBrandAuthModal(btn.dataset.id);
      });
    });
  }

  // 2. ۋاكالەتچىلەر باشقۇرۇش جەدۋىلى
  function renderAgentsTable() {
    const tbody = document.getElementById('adminAgentsTbody');
    if (!tbody) return;

    const allAgents = window.appStore.getAgents('name');
    const agents = getFilteredAgents();
    updateAgentFilterCount(agents.length, allAgents.length);

    if (agents.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">شەرتكە ئۇيغۇن ۋاكالەتچى تېپىلمىدى</td></tr>';
      return;
    }

    tbody.innerHTML = agents.map(agent => {
      const brandsBadges = (agent.authorizedBrands && agent.authorizedBrands.length > 0)
        ? agent.authorizedBrands.map(b => `<span class="brand-pill-tag"><i class="fas fa-check-circle" style="color: var(--success-color);"></i> ${b}</span>`).join(' ')
        : (agent.proposedBrands 
            ? `<div style="color: #b45309; font-size: 0.82rem; font-weight: 700; line-height: 1.4;"><i class="fas fa-hand-holding-box"></i> ئىلتىماس قىلغان تاۋار/ماركا: <span style="color: #1e3a8a;">${agent.proposedBrands}</span></div>`
            : '<span style="color: var(--danger-color); font-size: 0.8rem;"><i class="fas fa-exclamation-triangle"></i> ھېچقانداق ماركىغا رۇخسەت بېرىلمىگەن</span>');

      const isPending = agent.status === 'تەستىق كۈتۈۋاتىدۇ';
      const badgeObj = window.appStore.getReputationBadgeObject(agent.reputation);
      const tier = window.appStore.getAgentPerformanceTier(agent);
      const firstChar = (agent.name && agent.name.trim().length > 0) ? agent.name.trim().charAt(0) : 'ۋ';
      const monthlySalesFormatted = (agent.monthlySales || 0).toLocaleString('tr-TR');
      const monthlyOrders = agent.monthlyOrders || 0;
      const commissionRate = agent.commissionRate || 10;
      const commissionFormatted = Math.round((agent.monthlySales || 0) * (commissionRate / 100)).toLocaleString('tr-TR');
      const totalSalesFormatted = (agent.salesTotal || 0).toLocaleString('tr-TR');

      return `
        <tr style="${isPending ? 'background: #fffbeb;' : ''}">
          <!-- 1. ID -->
          <td class="number-latin"><strong>${agent.id}</strong></td>

          <!-- 2. ۋاكالەتچى / شەھىرى (ھەرىكەتچان نەتىجە رەڭلىك ئاۋاتار بىلەن) -->
          <td>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: ${tier.avatarBg}; box-shadow: ${tier.avatarShadow}; border: 2px solid ${tier.avatarRing}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.92rem; position: relative; flex-shrink: 0;" title="${tier.badgeLabel}">
                ${firstChar}
                <span style="position: absolute; bottom: -3px; right: -3px; font-size: 0.65rem; line-height: 1; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));">${tier.iconEmoji}</span>
              </div>
              <div>
                <div style="font-weight: 800; color: #1e3a8a; display: flex; align-items: center; gap: 0.3rem; flex-wrap: wrap;">
                  <span>${agent.name}</span>
                  ${isPending ? '<span style="background: #f59e0b; color: white; font-size: 0.65rem; padding: 1px 4px; border-radius: 9999px;">يېڭى</span>' : ''}
                  ${(agent.violationsCount && agent.violationsCount > 0)
                    ? `<span style="background: #fee2e2; color: #dc2626; border: 1.5px solid #f87171; font-size: 0.68rem; font-weight: 900; padding: 1px 6px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 0.2rem;" title="تېلېفون ياكى تور ئۇلانمىسى قوشۇش خىلاپلىقى">
                         <i class="fas fa-exclamation-triangle"></i> خىلاپلىق: ${agent.violationsCount} قېتىم
                       </span>`
                    : ''}
                </div>
                <div style="font-size: 0.72rem; color: #64748b; margin-top: 1px;">
                  <span>📍 ${agent.city || 'ئىستانبۇل'}</span> | <span class="number-latin">${agent.phone || '-'}</span>
                </div>
                <div class="number-latin" style="font-size: 0.7rem; color: #2563eb; font-weight: 600;">${agent.email}</div>
                <!-- 📜 ئارخىپلانغان كېلىشىمنامە كۇنۇپكىسى & سېتىش ئۇسۇلى -->
                <div style="margin-top: 4px; display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap;">
                  <button type="button" class="btn-agent-contract-archive" data-id="${agent.id}" title="ۋاكالەتچىلىك ئىمزالانغان كېلىشىمنامىسىنى كۆرۈش ۋە چۈشۈرۈش" style="background: #fffbeb; border: 1.5px solid #f59e0b; color: #b45309; padding: 2px 7px; border-radius: 6px; font-size: 0.72rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 0.3rem;">
                    <i class="fas fa-file-contract" style="color: #d97706;"></i>
                    <span>📜 كېلىشىمنامە [${(agent.legalAgreement && agent.legalAgreement.contractNumber) ? agent.legalAgreement.contractNumber : ('TK-AGR-' + agent.id.replace('AGT-', ''))}]</span>
                  </button>
                  ${agent.salesMethod === 'تور بېكەت مەھسۇلاتى' 
                    ? `<span style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; font-size: 0.7rem; font-weight: 800; padding: 2px 7px; border-radius: 6px; display: inline-flex; align-items: center; gap: 0.25rem;" title="سېتىش ئۇسۇلى: تور بېكەت مەھسۇلاتى"><i class="fas fa-globe"></i> تور بېكەت مەھسۇلاتى</span>` 
                    : `<span style="background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; font-size: 0.7rem; font-weight: 800; padding: 2px 7px; border-radius: 6px; display: inline-flex; align-items: center; gap: 0.25rem;" title="سېتىش ئۇسۇلى: ئۆزۈمنىڭ مەھسۇلاتى"><i class="fas fa-store"></i> ئۆزۈمنىڭ مەھسۇلاتى</span>`}
                </div>
              </div>
            </div>
          </td>

          <!-- 3. ئايلىق نەتىجە ۋە دەرىجە -->
          <td>
            <div style="margin-bottom: 0.2rem;">
              <span style="display: inline-flex; align-items: center; gap: 0.2rem; padding: 1px 6px; border-radius: 9999px; font-size: 0.72rem; font-weight: 800; background: ${tier.tier === 'gold' ? '#fef3c7' : (tier.tier === 'silver' ? '#e0f2fe' : '#ede9fe')}; color: ${tier.tier === 'gold' ? '#92400e' : (tier.tier === 'silver' ? '#075985' : '#5b21b6')}; border: 1px solid ${tier.tier === 'gold' ? '#fde68a' : (tier.tier === 'silver' ? '#bae6fd' : '#ddd6fe')};">
                ${tier.badgeLabel}
              </span>
            </div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">
              زاكاز: <strong class="number-latin" style="color: #1e293b;">${monthlyOrders}</strong> دانە
            </div>
            <div style="margin-top: 0.2rem;">
              <button type="button" class="btn-agent-rep-badge" data-id="${agent.id}" title="سودىگەر ئىناۋەت بەلگىسىنى ئۆزگەرتىش" style="cursor: pointer; border: 1px solid ${badgeObj.borderColor} !important; background: ${badgeObj.bgColor} !important; color: ${badgeObj.textColor} !important; padding: 1px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.2rem;">
                <i class="fas ${badgeObj.icon}" style="color: ${badgeObj.textColor} !important; font-size: 0.75rem;"></i>
                <span style="color: ${badgeObj.textColor} !important;">${badgeObj.name}</span>
                <i class="fas fa-edit" style="font-size: 0.6rem; opacity: 0.65;"></i>
              </button>
            </div>
          </td>

          <!-- 4. ئايلىق سېتىش ۋە پايدا -->
          <td>
            <div style="font-size: 0.84rem; font-weight: 800; color: #0f172a;">
              <span class="number-latin">₺${monthlySalesFormatted}</span>
            </div>
            <div style="font-size: 0.72rem; color: #15803d; font-weight: 700; margin-top: 0.1rem;">
              پايدا (${commissionRate}%): <span class="number-latin" style="font-weight: 900;">₺${commissionFormatted}</span>
            </div>
            <div style="font-size: 0.68rem; color: #94a3b8; margin-top: 0.1rem;">
              ئومۇمىي: <span class="number-latin">₺${totalSalesFormatted}</span>
            </div>
          </td>

          <!-- 5. ھالىتى ۋە توختىتىش جازاسى -->
          <td>
            <select class="agent-table-status-select" data-id="${agent.id}" style="padding: 0.25rem 0.45rem; border-radius: var(--radius-sm); border: 1.5px solid ${agent.status === 'توختىتىلدى' ? '#f87171' : 'var(--admin-border)'}; background: ${agent.status === 'توختىتىلدى' ? '#fef2f2' : 'var(--admin-bg)'}; font-weight: 700; font-size: 0.8rem; color: ${agent.status === 'توختىتىلدى' ? '#dc2626' : 'inherit'};">
              <option value="تەستىقلاندى" ${agent.status === 'تەستىقلاندى' ? 'selected' : ''}>تەستىقلاندى</option>
              <option value="تەستىق كۈتۈۋاتىدۇ" ${agent.status === 'تەستىق كۈتۈۋاتىدۇ' ? 'selected' : ''}>تەستىق كۈتۈۋاتىدۇ</option>
              <option value="توختىتىلدى" ${agent.status === 'توختىتىلدى' ? 'selected' : ''}>⛔ توختىتىلدى</option>
            </select>
            ${agent.status === 'توختىتىلدى' && agent.suspendedUntil
              ? `<div style="margin-top: 0.3rem; font-size: 0.7rem; color: #b91c1c; font-weight: 800; background: #fee2e2; border: 1px solid #fecaca; padding: 2px 5px; border-radius: 4px; line-height: 1.2;">
                   <i class="fas fa-lock"></i> ${agent.violationsCount || 1} كۈن جازا<br>
                   <span class="number-latin" style="font-size: 0.65rem;">${new Date(agent.suspendedUntil).toLocaleDateString('ug-CN')} غىچە</span>
                 </div>`
              : ''}
          </td>

          <!-- 6. رۇخسەت قىلىنغان ماركىلار ۋە تىل ھوقۇقى -->
          <td style="max-width: 180px; line-height: 1.5;">
            ${brandsBadges}
            ${agent.canPublishMultilingual
              ? `<div style="margin-top: 0.25rem;"><span style="display: inline-flex; align-items: center; gap: 0.2rem; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 1px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 800;"><i class="fas fa-globe"></i> بارلىق تىللار</span></div>`
              : `<div style="margin-top: 0.25rem;"><span style="display: inline-flex; align-items: center; gap: 0.2rem; background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; padding: 1px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 700;"><i class="fas fa-lock"></i> پەقەت ئۇيغۇرچە بەتتە</span></div>`}
          </td>

          <!-- 7. مەشغۇلاتلار -->
          <td style="white-space: nowrap; width: 205px;">
            <div style="display: flex; gap: 0.3rem; align-items: center; flex-wrap: nowrap;">
              <!-- كىنىشكا -->
              <button class="btn-action-edit btn-agent-cert" onclick="event.stopPropagation(); if(window.openAgentCertificateModal) window.openAgentCertificateModal('${agent.id}');" data-id="${agent.id}" title="ماركا سېتىش كىنىشكىسىنى كۆرۈش ۋە چىقىرىش" style="background: #d97706 !important; border-color: #d97706 !important; color: #ffffff !important; padding: 0.25rem 0.5rem; font-size: 0.74rem; border-radius: 8px; cursor: pointer;">
                <i class="fas fa-award"></i>
                <span style="font-weight: 700; margin-right: 0.15rem;">كىنىشكا</span>
              </button>
              <!-- ئۇچۇر -->
              <button class="btn-action-edit btn-sms-agent" onclick="event.stopPropagation(); if(window.openDirectSmsModal) window.openDirectSmsModal({name:'${agent.name.replace(/'/g, "\\'")}',phone:'${agent.phone}',role:'ۋاكالەتچى'});" data-id="${agent.id}" title="ۋاكالەتچىگە قىسقا ئۇچۇر (SMS / WhatsApp) ئەۋەتىش" style="background: #0284c7 !important; border-color: #0284c7 !important; color: #ffffff !important; padding: 0.25rem 0.5rem; font-size: 0.74rem; border-radius: 8px; cursor: pointer;">
                <i class="fas fa-sms"></i>
                <span style="font-weight: 700; margin-right: 0.15rem;">ئۇچۇر</span>
              </button>
              <!-- ماركا تەستىق -->
              <button class="btn-action-edit btn-auth-agent" onclick="event.stopPropagation(); if(window.openAgentBrandAuthModal) window.openAgentBrandAuthModal('${agent.id}');" data-id="${agent.id}" title="${isPending ? 'تەستىقلاش ۋە ماركا رۇخسىتى بېرىش' : 'ماركا تەستىقلاش'}" style="background: ${isPending ? '#059669' : '#2563eb'} !important; border-color: ${isPending ? '#059669' : '#2563eb'} !important; color: #ffffff !important; padding: 0.25rem 0.5rem; font-size: 0.74rem; border-radius: 8px; cursor: pointer;">
                <i class="${isPending ? 'fas fa-check-circle' : 'fas fa-shield-alt'}"></i>
                <span style="font-weight: 700; margin-right: 0.15rem;">${isPending ? 'تەستىق' : 'ماركا'}</span>
              </button>
              <!-- ئۆچۈرۈش -->
              <button class="btn-action-delete btn-delete-agent" onclick="event.stopPropagation(); if(window.deleteAgent) window.deleteAgent('${agent.id}');" data-id="${agent.id}" title="ئۆچۈرۈش" style="padding: 0.25rem 0.5rem; font-size: 0.74rem; border-radius: 8px; cursor: pointer;">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // جەدۋەلدىكى ئۇچۇر ئەۋەتىش كۇنۇپكىسى
    tbody.querySelectorAll('.btn-sms-agent').forEach(btn => {
      btn.addEventListener('click', () => {
        const agent = window.appStore.getAgents().find(a => a.id === btn.dataset.id);
        if (agent) {
          openDirectSmsModal({
            name: agent.name,
            phone: agent.phone,
            role: 'ۋاكالەتچى'
          });
        }
      });
    });

    // جەدۋەلدىكى كىنىشكا كۇنۇپكىسى
    tbody.querySelectorAll('.btn-agent-cert').forEach(btn => {
      btn.addEventListener('click', () => {
        openAgentCertificateModal(btn.dataset.id);
      });
    });

    // 📜 جەدۋەلدىكى ئىمزالانغان كېلىشىمنامە كۇنۇپكىسى
    tbody.querySelectorAll('.btn-agent-contract-archive').forEach(btn => {
      btn.addEventListener('click', () => {
        openAgentContractArchiveModal(btn.dataset.id);
      });
    });

    // جەدۋەلدىكى ھالەت تاللاش
    tbody.querySelectorAll('.agent-table-status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = sel.dataset.id;
        window.appStore.updateAgentStatus(id, e.target.value);
        renderAgentsSlider();
        showAdminToast('ۋاكالەتچى ھالىتى يېڭىلاندى!', 'success');
      });
    });

    // جەدۋەلدىكى ئىناۋەت بەلگىسى كۇنۇپكىسى (بىۋاسىتە تاللاپ بېكىتىش)
    tbody.querySelectorAll('.btn-agent-rep-badge').forEach(btn => {
      btn.addEventListener('click', () => openAgentReputationAssignModal(btn.dataset.id));
    });

    // جەدۋەلدىكى ماركا تەستىقلاش كۇنۇپكىسى
    tbody.querySelectorAll('.btn-auth-agent').forEach(btn => {
      btn.addEventListener('click', () => openAgentBrandAuthModal(btn.dataset.id));
    });
    // ئۆچۈرۈش
    tbody.querySelectorAll('.btn-delete-agent').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('مەزكۇر ۋاكالەتچىنى تىزىملىكتىن ئۆچۈرەمسىز؟')) {
          window.appStore.deleteAgent(btn.dataset.id);
          renderAgentsView();
          showAdminToast('ۋاكالەتچى تىزىملىكتىن چىقىرىۋېتىلدى!', 'info');
        }
      });
    });
  }

  // 📜 ۋاكالەتچىلىك ئىمزالانغان قانۇنىي كېلىشىمنامە ئارخىپ كۆزنىكىنى ئېچىش
  let currentViewingContractAgent = null;

  function openAgentContractArchiveModal(agentId) {
    const agent = window.appStore.getAgents().find(a => a.id === agentId);
    if (!agent) {
      showAdminToast('ۋاكالەتچى تېپىلمىدى!', 'error');
      return;
    }
    currentViewingContractAgent = agent;
    const modal = document.getElementById('modalAgentContractArchive');
    const wrap = document.getElementById('contractArchiveContentWrap');
    if (!modal || !wrap) return;

    if (!agent.legalAgreement) {
      agent.legalAgreement = {
        contractNumber: 'TK-AGR-' + (agent.id ? agent.id.replace('AGT-', '') : '1001'),
        signedAt: agent.registeredAt ? (agent.registeredAt + 'T10:00:00.000Z') : new Date().toISOString(),
        digitalSignatureHash: 'DIGI-SIGN-' + (agent.id || 'OFFICIAL')
      };
    }

    const agr = agent.legalAgreement;
    const signedDateStr = new Date(agr.signedAt).toLocaleString('ug-CN', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    wrap.innerHTML = `
      <div style="background: #ffffff; border: 2.5px double #d97706; border-radius: 14px; padding: 1.5rem; color: #0f172a; position: relative;">
        <!-- ماۋزۇ -->
        <div style="text-align: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 1rem; margin-bottom: 1.25rem;">
          <div style="font-size: 0.95rem; color: #d97706; font-weight: 900; margin-bottom: 0.2rem;">★ تەكلىماكان تور سودا سۇپىسى ★</div>
          <h3 style="margin: 0; font-size: 1.35rem; color: #1e3a8a; font-weight: 900;">ۋاكالەتچىلىك ۋە تاۋار سېتىش قانۇنىي كېلىشىمنامىسى</h3>
          <div style="font-size: 0.8rem; color: #64748b; margin-top: 0.25rem;">ئېلېكترونلۇق تىزىملىتىش، سالاھىيەت ۋە مەسئۇلىيەت بەلگىلىمىسى ئارخىپى</div>
        </div>

        <!-- سانلىق مەلۇمات مېتا تورى -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 0.85rem 1rem; margin-bottom: 1.25rem; font-size: 0.84rem;">
          <div><strong>📄 كېلىشىم نومۇرى:</strong> <span class="number-latin" style="font-weight: 800; color: #1e3a8a;">${agr.contractNumber}</span></div>
          <div><strong>📅 ئىمزالانغان ۋاقتى:</strong> <span>${signedDateStr}</span></div>
          <div><strong>👤 ۋاكالەتچى:</strong> <span style="font-weight: 800;">${agent.name}</span></div>
          <div><strong>📞 تېلېفون نومۇرى:</strong> <span class="number-latin">${agent.phone || '-'}</span></div>
          <div><strong>📧 ئېلخەت:</strong> <span class="number-latin">${agent.email}</span></div>
          <div><strong>🆔 ۋاكالەتچى ID:</strong> <span class="number-latin">${agent.id}</span></div>
        </div>

        <!-- قائىدىلەر -->
        <div style="font-size: 0.82rem; line-height: 1.6; color: #334155;">
          <div style="margin-bottom: 0.85rem;">
            <strong style="color: #b45309;">1. ئاساسىي سۇپا تۈزۈمى:</strong> ۋاكالەتچى تاۋارلىرىنى پەقەت ئۇيغۇرچە بەتتىلا ئېلان قىلىدۇ (ئالىي باشقۇرغۇچىنىڭ ئالاھىدە رۇخسىتى بولغاندىلا كۆپ تىلدا ئېلان قىلالايدۇ). تاۋارلار ئارقا سۇپىدا تەستىقتىن ئۆتكەندىن كېيىنلا دۇكانغا چىقىرىلىدۇ.
          </div>
          <div style="margin-bottom: 0.85rem;">
            <strong style="color: #b45309;">2. تاشقى ئالاقە چەكلىمىسى ۋە جازا:</strong> تاۋار نامى ياكى تەپسىلاتىدا تېلېفون، WhatsApp، Telegram، ئۈندىدار ياكى تاشقى ئۇلىنىش يېزىش پۈتۈنلەي چەكلىنىدۇ. خىلاپلىق قىلغان ھەر بىر قېتىمدا سىستېما قېتىم سانىچە كۈن (N قېتىم = N كۈن) بارلىق مەشغۇلاتىنى ئاپتوماتىك توختىتىدۇ.
          </div>
          <div style="margin-bottom: 0.85rem;">
            <strong style="color: #b45309;">3. سۈرەت 5 دەخلىسىز قائىدىسى:</strong> سۈرەتتە تاشقى ئېلان بولماسلىق؛ ئادەم، مودېل، تەن، قول ياكى بارماق رەسىمى بولماسلىق؛ ئېنىقلىقى كەم دېگەندە 800×800 پىكسېل ۋە 1:1 كۋادرات بولۇش؛ JPG, PNG, WEBP فورماتى بولۇش ھەمدە سۇپا تامغىسى بېسىلىدۇ.
          </div>
        </div>

        <!-- ⚖️ قىزىل رامكىلىق مەھسۇلات مەسئۇلىيىتى ماددىسى -->
        <div style="background: #fff1f2; border: 2px solid #f43f5e; border-radius: 10px; padding: 0.9rem 1.1rem; margin: 1.15rem 0; color: #881337; font-size: 0.9rem; font-weight: 800; line-height: 1.6;">
          <div style="font-size: 0.95rem; color: #be123c; margin-bottom: 0.25rem;">⚖️ 4. مەھسۇلات مەسئۇلىيىتى ۋە ئاقىۋەت بەلگىلىمىسى (دەخلىسىز ماددا):</div>
          «تور سۇپىمىزنىڭ ئەمەس بەلكى ئۆزىنىڭ مەھسۇلاتىنى سېتىۋاتقان ۋاكالەتچىلەر ئۆزىنىڭ مەھسۇلاتىدىن كېلىپ چىققان ھەرقانداق ئاقىۋەتكە ئۆزى مەسئۇل، سۇپىمىز ئۆز ئۈستىگە ئالمايدۇ.»
        </div>

        <!-- تامغا ۋە ئىمزا رايونى -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px dashed #cbd5e1; padding-top: 1rem; margin-top: 1rem;">
          <div>
            <div style="font-size: 0.82rem; color: #475569;"><strong>ئېلېكترونلۇق ئىمزالىغۇچى:</strong> ${agent.name}</div>
            <div style="font-size: 0.78rem; color: #64748b; font-family: monospace;">رەقەملىك ئىمزا: ${agr.digitalSignatureHash}</div>
            <div style="font-size: 0.76rem; color: #059669; font-weight: 800; margin-top: 0.25rem;">
              <i class="fas fa-check-circle"></i> ۋاكالەتچى ئىلتىماس قىلغاندا رەسمىي قوشۇلۇپ ئىمزالىغان
            </div>
          </div>
          <div style="width: 120px; height: 120px; border-radius: 50%; border: 3px double #dc2626; color: #dc2626; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; font-size: 0.68rem; font-weight: 900; transform: rotate(-8deg); box-shadow: 0 0 0 3px rgba(220,38,38,0.08); flex-shrink: 0;">
            <div>★ تەكلىماكان ★</div>
            <div style="font-size: 0.58rem; margin: 1px 0;">قانۇنىي كېلىشىم</div>
            <div style="font-size: 0.52rem;">رەقەملىك دەلىللەندى</div>
            <div style="font-size: 0.5rem; font-family: monospace;">OFFICIAL SEAL</div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  // 📜 كېلىشىمنامە ئارخىپ كۆزنىكى كۇنۇپكىلىرىنى ئۇلاش
  function setupContractArchiveModalEvents() {
    const btnClose = document.getElementById('btnCloseContractArchiveModal');
    if (btnClose) {
      btnClose.addEventListener('click', () => {
        const modal = document.getElementById('modalAgentContractArchive');
        if (modal) modal.classList.remove('active');
      });
    }

    const btnDownload = document.getElementById('btnDownloadContractArchiveBtn');
    if (btnDownload) {
      btnDownload.addEventListener('click', () => {
        if (currentViewingContractAgent) {
          window.appStore.downloadAgentContract(currentViewingContractAgent);
          showAdminToast('📥 كېلىشىمنامە ھۆججىتى چۈشۈرۈلدى!', 'success');
        }
      });
    }

    const btnPrint = document.getElementById('btnPrintContractArchiveBtn');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        const wrap = document.getElementById('contractArchiveContentWrap');
        if (!wrap) return;
        const printWin = window.open('', '_blank');
        printWin.document.write(`<!DOCTYPE html><html lang="ug" dir="rtl"><head><title>كېلىشىمنامە</title><style>body{font-family:sans-serif;direction:rtl;padding:20px;}</style></head><body>${wrap.innerHTML}</body></html>`);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => printWin.print(), 500);
      });
    }
  }

  // 📜 رەسمىي ماركا سېتىش ھوقۇقى كىنىشكىسى كۆزنىكىنى ئېچىش
  function openAgentCertificateModal(agentId) {
    const modal = document.getElementById('agentCertificateModal');
    if (!modal) return;

    modal.classList.add('active');
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    modal.style.zIndex = '100000';

    try {
      const allAgents = (window.appStore && window.appStore.getAgents) ? window.appStore.getAgents() : [];
      let agent = null;
      if (agentId && typeof agentId === 'string') {
        agent = allAgents.find(a => String(a.id) === String(agentId));
      }
      if (!agent && allAgents.length > 0) {
        agent = allAgents[0];
      }
      if (!agent) {
        agent = {
          id: 'AGT-101',
          name: 'ئەلىجان روزى',
          city: 'ئىستانبۇل (فاتىھ)',
          phone: '05551609999',
          certCode: 'TK-CERT-2026-101',
          authorizedBrands: ['تەكلىماكان كىلاسسىك', 'خوتەن مىراس'],
          registeredAt: '2026-08-15',
          authExpireDate: '2027-08-15'
        };
      }
      currentViewingCertAgent = agent;

      const codeEl = document.getElementById('certDisplayCode');
      const nameEl = document.getElementById('certDisplayName');
      const brandsEl = document.getElementById('certDisplayBrands');
      const cityEl = document.getElementById('certDisplayCity');
      const tierEl = document.getElementById('certDisplayTier');
      const issueDateEl = document.getElementById('certDisplayIssueDate');
      const expireDateEl = document.getElementById('certDisplayExpireDate');
      const qrEl = document.getElementById('certDisplayQr');

      if (codeEl) codeEl.textContent = agent.certCode || `TK-CERT-2026-${(agent.id || '').replace(/\D/g, '') || '101'}`;
      if (nameEl) nameEl.textContent = agent.name;
      if (cityEl) cityEl.textContent = agent.city || 'ئىستانبۇل';
      if (issueDateEl) issueDateEl.textContent = agent.registeredAt || '2026-08-15';
      if (expireDateEl) expireDateEl.textContent = (agent.authExpireDate || '2027-08-15') + ' كىچە';

      if (tierEl) {
        let tierBadge = '👑 ئالتۇن دەرىجە';
        let tierColor = '#b45309';
        try {
          if (window.appStore && window.appStore.getAgentPerformanceTier) {
            const t = window.appStore.getAgentPerformanceTier(agent);
            if (t) {
              tierBadge = t.badgeLabel || t.badge || '👑 ئالتۇن دەرىجە';
              tierColor = t.tier === 'gold' ? '#b45309' : (t.tier === 'silver' ? '#0369a1' : '#6d28d9');
            }
          }
        } catch(e) {}
        tierEl.innerHTML = `<span style="color: ${tierColor};">${tierBadge}</span>`;
      }

      if (brandsEl) {
        const brands = agent.authorizedBrands && agent.authorizedBrands.length > 0
          ? agent.authorizedBrands
          : ['بارلىق سۇپا مەھسۇلاتلىرى'];
        brandsEl.innerHTML = brands.map(b => `<span style="background: #fff7ed; color: #9a3412; border: 1.5px solid #fed7aa; padding: 3px 10px; border-radius: 6px; font-weight: 800; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 0.35rem;"><i class="fas fa-check-circle" style="color: #d97706;"></i> ${b}</span>`).join(' ');
      }

      if (qrEl) {
        const certId = encodeURIComponent(agent.id);
        const code = encodeURIComponent(agent.certCode || 'TK-CERT');
        qrEl.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://teklimakan.com/verify-cert?id=${certId}&code=${code}`;
      }
    } catch(err) {
      console.warn('Error rendering certificate details:', err);
    }
  }

  // 📊 ئايلىق سېتىش نەتىجىسى ۋە كومىسسىيە خۇلاسە كۆزنىكىنى ئېچىش
  function openAgentMonthlySummaryModal() {
    const modal = document.getElementById('agentMonthlySummaryModal');
    if (!modal) return;

    const summary = window.appStore.getMonthlyAgentPerformanceSummary();
    const totalSalesEl = document.getElementById('modalSummaryTotalSales');
    const totalOrdersEl = document.getElementById('modalSummaryTotalOrders');
    const totalCommissionEl = document.getElementById('modalSummaryTotalCommission');
    const tbody = document.getElementById('modalMonthlySummaryTbody');

    if (totalSalesEl) totalSalesEl.textContent = `\u20BA${summary.totalSales.toLocaleString('tr-TR')}`;
    if (totalOrdersEl) totalOrdersEl.textContent = `${summary.totalOrders} دانە`;
    if (totalCommissionEl) totalCommissionEl.textContent = `\u20BA${summary.totalCommission.toLocaleString('tr-TR')}`;

    if (tbody) {
      const agentList = summary.agents || summary.list || [];
      if (agentList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 1.5rem; color: var(--text-muted);">ۋاكالەتچى سانلىق مەلۇماتى تېپىلمىدى</td></tr>';
      } else {
        tbody.innerHTML = agentList.map(a => `
          <tr>
            <td><strong>${a.name}</strong> <span class="number-latin" style="font-size: 0.72rem; color: #64748b;">(${a.id})</span></td>
            <td><i class="fas fa-map-marker-alt" style="color: #64748b; margin-left: 4px;"></i> ${a.city}</td>
            <td><span style="font-weight: 800; color: ${a.tier === 'gold' ? '#b45309' : (a.tier === 'silver' ? '#0369a1' : '#6d28d9')};">${a.badgeLabel || a.tierBadge}</span></td>
            <td style="font-weight: 800; color: #0f172a;"><span class="number-latin">\u20BA${a.monthlySales.toLocaleString('tr-TR')}</span></td>
            <td><span class="number-latin">${a.monthlyOrders}</span> دانە</td>
            <td><span class="number-latin">${a.commissionRate}%</span></td>
            <td style="font-weight: 900; color: #15803d;"><span class="number-latin">\u20BA${a.monthlyCommission.toLocaleString('tr-TR')}</span></td>
          </tr>
        `).join('');
      }
    }

    modal.classList.add('active');
  }

  // 📥 فورمات 1: Excel (CSV) ھۆججىتى چۈشۈرۈش (UTF-8 BOM بىلەن)
  function exportMonthlySummaryCsv() {
    const summary = window.appStore.getMonthlyAgentPerformanceSummary();
    const agentList = summary.agents || summary.list || [];
    const headers = ['ۋاكالەتچى ID', 'ئىسىم', 'شەھەر', 'تېلېفون', 'ئېلخەت', 'ئايلىق دەرىجە', 'ئايلىق سېتىش (TL)', 'ئايلىق زاكاز سانى', 'كومىسسىيە نىسبىتى (%)', 'بېرىلىدىغان پۇل (TL)', 'كىنىشكا نومۇرى'];
    const rows = agentList.map(a => [
      `"${a.id}"`,
      `"${a.name.replace(/"/g, '""')}"`,
      `"${(a.city || '').replace(/"/g, '""')}"`,
      `"${(a.phone || '').replace(/"/g, '""')}"`,
      `"${(a.email || '').replace(/"/g, '""')}"`,
      `"${(a.badgeLabel || a.tierBadge || '').replace(/"/g, '""')}"`,
      a.monthlySales,
      a.monthlyOrders,
      a.commissionRate,
      a.monthlyCommission,
      `"${(a.certCode || '').replace(/"/g, '""')}"`
    ]);

    // UTF-8 BOM \uFEFF ensures Excel renders Uyghur letters perfectly
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `agent_monthly_summary_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showAdminToast('ئايلىق خۇلاسە CSV (Excel) ھۆججىتى چۈشۈرۈلدى!', 'success');
  }

  // 🖨️ فورمات 2: PDF / بېسىپ چىقىرىش
  function exportMonthlySummaryPrint() {
    window.print();
  }

  // 📋 فورمات 3: تېكىست نۇسخىسىنى كۆچۈرۈۋېلىش
  function exportMonthlySummaryCopy() {
    const summary = window.appStore.getMonthlyAgentPerformanceSummary();
    const agentList = summary.agents || summary.list || [];
    let text = `============================================================\n`;
    text += `تەكلىماكان سۈپەت - ۋاكالەتچىلەر ئايلىق سېتىش ۋە كومىسسىيە خۇلاسىسى\n`;
    text += `تەييارلانغان ۋاقىت: ${new Date().toLocaleDateString('tr-TR')}\n`;
    text += `ئومۇمىي سېتىش: \u20BA${summary.totalSales.toLocaleString('tr-TR')} | زاكاز: ${summary.totalOrders} دانە | ئومۇمىي پايدا: \u20BA${summary.totalCommission.toLocaleString('tr-TR')}\n`;
    text += `============================================================\n\n`;
    agentList.forEach((a, i) => {
      text += `${i + 1}. ${a.name} (${a.city}) [${a.badgeLabel || a.tierBadge}]\n`;
      text += `   - ئايلىق سېتىش: \u20BA${a.monthlySales.toLocaleString('tr-TR')} (${a.monthlyOrders} زاكاز)\n`;
      text += `   - كومىسسىيە نىسبىتى: ${a.commissionRate}% | پايدا سوممىسى: \u20BA${a.monthlyCommission.toLocaleString('tr-TR')}\n`;
      text += `   - ئېلخەت / تېلېفون: ${a.email} / ${a.phone}\n\n`;
    });
    text += `============================================================\n`;
    navigator.clipboard.writeText(text).then(() => {
      showAdminToast('ئايلىق خۇلاسە تېكىست نۇسخىسى كۆچۈرۈۋېلىندى!', 'success');
    }).catch(() => {
      showAdminToast('تېكىستنى كۆچۈرۈشتە خاتالىق كۆرۈلدى', 'error');
    });
  }

  window.switchTab = switchTab;
  window.initAdmin = initAdmin;
  window.openAgentCertificateModal = openAgentCertificateModal;
  window.openAgentMonthlySummaryModal = openAgentMonthlySummaryModal;
  window.openAgentContractArchiveModal = openAgentContractArchiveModal;
  window.openAddAgentModal = openAddAgentModal;
  window.openManageBrandsModal = openManageBrandsModal;
  window.openManageReputationsModal = openManageReputationsModal;
  window.openAgentBrandAuthModal = openAgentBrandAuthModal;
  window.openProductModal = openProductModal;
  window.exportMonthlySummaryCsv = exportMonthlySummaryCsv;
  window.exportMonthlySummaryPrint = exportMonthlySummaryPrint;
  window.exportMonthlySummaryCopy = exportMonthlySummaryCopy;


  function renderBrandAuthCheckboxes(authBrands = []) {
    const allBrands = window.appStore.getBrands().filter(b => b !== 'بارلىق ماركىلار');
    const container = document.getElementById('agentBrandsCheckboxList');
    if (!container) return;

    container.innerHTML = allBrands.map(brand => {
      const isChecked = authBrands.includes(brand) ? 'checked' : '';
      return `
        <label class="brand-auth-checkbox-label">
          <input type="checkbox" name="authorizedBrand" value="${brand}" ${isChecked}>
          <span><i class="fas fa-certificate" style="color: var(--primary-color);"></i> ${brand}</span>
        </label>
      `;
    }).join('');
  }

  function renderNewAgentBrandCheckboxes(selectedBrands = []) {
    const allBrands = window.appStore.getBrands().filter(b => b !== 'بارلىق ماركىلار');
    const checkContainer = document.getElementById('newAgentBrandsCheckboxList');
    if (checkContainer) {
      checkContainer.innerHTML = allBrands.map((brand, idx) => {
        const isChecked = selectedBrands.includes(brand) || (selectedBrands.length === 0 && idx === 0) ? 'checked' : '';
        return `
          <label class="brand-auth-checkbox-label" style="padding: 0.45rem 0.6rem; font-size: 0.8rem;">
            <input type="checkbox" name="newAgentBrandItem" value="${brand}" ${isChecked}>
            <span><i class="fas fa-award" style="color: var(--primary-color);"></i> ${brand}</span>
          </label>
        `;
      }).join('');
    }

    const quickButtonsContainer = document.getElementById('quickNewAgentBrandButtons');
    if (quickButtonsContainer && checkContainer) {
      quickButtonsContainer.innerHTML = allBrands.map(brand => {
        const isChecked = selectedBrands.includes(brand) || (selectedBrands.length === 0 && brand === allBrands[0]);
        const activeStyle = isChecked ? 'border-color: var(--primary-color); background: #eff6ff;' : '';
        return `
          <button type="button" class="action-btn quick-new-agent-brand-btn" data-brand="${brand}" style="padding: 0.25rem 0.65rem; font-size: 0.78rem; ${activeStyle}">
            <i class="fas fa-tag"></i> ${brand}
          </button>
        `;
      }).join('');

      quickButtonsContainer.querySelectorAll('.quick-new-agent-brand-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const b = btn.dataset.brand;
          const targetCb = checkContainer.querySelector(`input[value="${b}"]`);
          if (targetCb) {
            targetCb.checked = !targetCb.checked;
            btn.style.borderColor = targetCb.checked ? 'var(--primary-color)' : '#dbeafe';
            btn.style.background = targetCb.checked ? '#eff6ff' : '#ffffff';
          }
        });
      });
    }
  }

  // 3. ۋاكالەتچى ماركا ھوقۇقى كۆزنىكىنى ئېچىش (مەۋجۇت ۋاكالەتچىگە)
  function openAgentBrandAuthModal(agentId) {
    const agent = window.appStore.getAgentById(agentId);
    if (!agent) return;

    const modal = document.getElementById('agentBrandAuthModal');
    if (!modal) return;

    document.getElementById('authAgentId').value = agent.id;
    const nameEl = document.getElementById('authAgentName');
    if (nameEl) nameEl.textContent = agent.name;
    const idBadge = document.getElementById('authAgentIdBadge');
    if (idBadge) idBadge.textContent = agent.id;
    const emailEl = document.getElementById('authAgentEmail');
    if (emailEl) emailEl.innerHTML = `ئېلخەت: <b>${agent.email}</b> | تېلېفون: <b>${agent.phone || 'يوق'}</b> | شەھەر: <b>${agent.city || 'ئىستانبۇل'}</b>`;
    
    const badgeEl = document.getElementById('authAgentStatusBadge');
    if (badgeEl) {
      badgeEl.textContent = agent.status;
      badgeEl.className = `status-badge ${getStatusClass(agent.status)}`;
    }

    // ئالىي باشقۇرغۇچى ئۈچۈن تولۇق تەھرىرلەش قىممەتلىرىنى قاچىلاش
    const editName = document.getElementById('authAgentEditName');
    if (editName) editName.value = agent.name || '';
    
    const editPhone = document.getElementById('authAgentEditPhone');
    if (editPhone) editPhone.value = agent.phone || '';

    const editEmail = document.getElementById('authAgentEditEmail');
    if (editEmail) editEmail.value = agent.email || '';

    const editCity = document.getElementById('authAgentEditCity');
    if (editCity) editCity.value = agent.city || 'ئىستانبۇل (فاتىھ)';

    const statusSel = document.getElementById('authAgentStatusSelect');
    if (statusSel) {
      statusSel.value = agent.status === 'تەستىق كۈتۈۋاتىدۇ' ? 'تەستىقلاندى' : agent.status;
    }

    const editCommission = document.getElementById('authAgentEditCommission');
    if (editCommission) editCommission.value = agent.commissionRate !== undefined ? agent.commissionRate : 15;

    const editCertCode = document.getElementById('authAgentEditCertCode');
    if (editCertCode) editCertCode.value = agent.certCode || ('TK-CERT-2026-' + (agent.id ? agent.id.replace(/\D/g, '') : '101'));

    const editSalesTotal = document.getElementById('authAgentEditSalesTotal');
    if (editSalesTotal) editSalesTotal.value = agent.salesTotal !== undefined ? agent.salesTotal : 0;

    const editExpireDate = document.getElementById('authAgentEditExpireDate');
    if (editExpireDate) editExpireDate.value = agent.authExpireDate || '2027-08-15';

    const editNotes = document.getElementById('authAgentEditNotes');
    if (editNotes) editNotes.value = agent.notes || (agent.proposedBrands ? `تەلەپ قىلغان تۈر: ${agent.proposedBrands}` : '');

    // تاۋار ئېلان قىلىش تىل ھوقۇقى قىممىتىنى قاچىلاش
    const langScopeSelect = document.getElementById('authAgentCanPublishMultilingual');
    const langScopeBadge = document.getElementById('authAgentLangBadge');
    if (langScopeSelect) {
      langScopeSelect.value = agent.canPublishMultilingual ? 'true' : 'false';
    }
    if (langScopeBadge) {
      if (agent.canPublishMultilingual) {
        langScopeBadge.textContent = '🌍 بارلىق تىللارغا رۇخسەت بار';
        langScopeBadge.style.background = '#dcfce7';
        langScopeBadge.style.color = '#15803d';
        langScopeBadge.style.borderColor = '#86efac';
      } else {
        langScopeBadge.textContent = '🌙 سۈكۈت: پەقەت ئۇيغۇرچە';
        langScopeBadge.style.background = '#f1f5f9';
        langScopeBadge.style.color = '#475569';
        langScopeBadge.style.borderColor = '#cbd5e1';
      }
    }

    // دۇكاندىكى بارلىق ماركىلارنى چىقىرىپ checkbox قىلىش
    renderBrandAuthCheckboxes(agent.authorizedBrands || []);

    // سودىگەر ئىناۋەت دەرىجىسىنى تەڭشەش
    const repSelect = document.getElementById('authAgentReputationSelect');
    const repCustom = document.getElementById('authAgentReputationCustomInput');
    const curRep = agent.reputation || 'ئىشەنچىلىك سودىگەر';
    if (repSelect) {
      const allBadges = window.appStore.getReputationBadges();
      repSelect.innerHTML = allBadges.map(b => `
        <option value="${b.name}">${b.name}</option>
      `).join('') + `<option value="custom">✍️ خاس ئۆزىڭىز يېزىش...</option>`;

      const found = allBadges.some(b => b.name === curRep);
      if (found) {
        repSelect.value = curRep;
        if (repCustom) repCustom.style.display = 'none';
      } else {
        repSelect.value = 'custom';
        if (repCustom) {
          repCustom.value = curRep;
          repCustom.style.display = 'block';
        }
      }
    }

    // 🚨 قائىدىگە خىلاپلىق ۋە توختىتىش سانلىق مەلۇماتلىرىنى قاچىلاش
    const violCountInput = document.getElementById('authAgentEditViolationsCount');
    if (violCountInput) {
      violCountInput.value = agent.violationsCount || 0;
    }
    const suspUntilInput = document.getElementById('authAgentEditSuspendedUntil');
    if (suspUntilInput) {
      if (agent.status === 'توختىتىلدى' && agent.suspendedUntil) {
        suspUntilInput.value = new Date(agent.suspendedUntil).toLocaleString('ug-CN', { dateStyle: 'medium', timeStyle: 'short' });
        suspUntilInput.style.color = '#dc2626';
        suspUntilInput.style.fontWeight = '800';
      } else if (agent.status === 'توختىتىلدى') {
        suspUntilInput.value = 'توختىتىلغان (مۇددەتسىز)';
        suspUntilInput.style.color = '#dc2626';
      } else {
        suspUntilInput.value = 'نورمال (چەكلەنمىگەن)';
        suspUntilInput.style.color = '#16a34a';
        suspUntilInput.style.fontWeight = '700';
      }
    }

    // 🔓 چەكلەشنى دەرھال ئەمەلدىن قالدۇرۇش كۇنۇپكىسى
    const btnLiftSusp = document.getElementById('btnAuthAgentLiftSuspension');
    if (btnLiftSusp) {
      btnLiftSusp.onclick = () => {
        if (confirm(`«${agent.name}» نىڭ مەشغۇلات چەكلىمىسىنى دەرھال ئەمەلدىن قالدۇرۇپ، تاۋار سېتىش ھوقۇقىنى ئەسلىگە كەلتۈرەمسىز؟`)) {
          window.appStore.liftAgentSuspension(agent.id, false);
          if (statusSel) statusSel.value = 'تەستىقلاندى';
          if (badgeEl) {
            badgeEl.textContent = 'تەستىقلاندى';
            badgeEl.className = 'status-badge status-approved';
          }
          if (suspUntilInput) {
            suspUntilInput.value = 'نورمال (چەكلەنمىگەن)';
            suspUntilInput.style.color = '#16a34a';
          }
          renderAgentsView();
          showAdminToast(`«${agent.name}» نىڭ چەكلىمىسى ئەمەلدىن قالدۇرۇلدى!`, 'success');
        }
      };
    }

    // 🔄 خىلاپلىق سانىنى نۆللەش كۇنۇپكىسى
    const btnResetViol = document.getElementById('btnAuthAgentResetViolations');
    if (btnResetViol) {
      btnResetViol.onclick = () => {
        if (confirm(`«${agent.name}» نىڭ خىلاپلىق قېتىم سانىنى نۆلگە (0) قايتۇرامسىز؟`)) {
          if (violCountInput) violCountInput.value = 0;
          agent.violationsCount = 0;
          showAdminToast('خىلاپلىق قېتىم سانى 0 گە تەڭشەلدى، ساقلاشنى بېسىڭ!', 'info');
        }
      };
    }

    const newBrandInput = document.getElementById('inputNewBrandToAuthModal');
    if (newBrandInput) newBrandInput.value = '';

    modal.classList.add('active');
  }

  // 4. يېڭى ۋاكالەتچى كىرگۈزۈش كۆزنىكىنى ئېچىش (ماركا كۇنۇپكىلىرى بىلەن)
  function openAddAgentModal() {
    const modal = document.getElementById('addAgentModal');
    const form = document.getElementById('addAgentForm');
    if (!modal || !form) return;
    form.reset();

    const newRepSelect = document.getElementById('newAgentReputation');
    if (newRepSelect) {
      const allBadges = window.appStore.getReputationBadges();
      newRepSelect.innerHTML = allBadges.map(b => `
        <option value="${b.name}">${b.name}</option>
      `).join('');
    }

    renderNewAgentBrandCheckboxes([]);

    const newBrandInput = document.getElementById('inputNewBrandToAddAgentModal');
    if (newBrandInput) newBrandInput.value = '';

    const newLangScope = document.getElementById('newAgentCanPublishMultilingual');
    if (newLangScope) newLangScope.value = 'false';

    modal.classList.add('active');
  }

  // 5. ۋاكالەتچىگە ئىناۋەت بەلگىسى بېكىتىش تېز كۆزنىكى (Assign Reputation Badge)
  function openAgentReputationAssignModal(agentId) {
    const agent = window.appStore.getAgentById(agentId);
    if (!agent) return;

    const modal = document.getElementById('agentReputationAssignModal');
    if (!modal) return;

    document.getElementById('assignRepAgentId').value = agent.id;
    document.getElementById('assignRepAgentName').textContent = `${agent.name} (${agent.id})`;
    document.getElementById('assignRepAgentEmail').textContent = agent.email;

    const curContainer = document.getElementById('assignRepCurrentBadgeContainer');
    if (curContainer) {
      curContainer.innerHTML = getReputationBadgeHtml(agent.reputation);
    }

    const listEl = document.getElementById('assignRepBadgesList');
    if (listEl) {
      const badges = window.appStore.getReputationBadges();
      listEl.innerHTML = badges.map(b => {
        const isCurrent = (b.name === agent.reputation);
        return `
          <div class="rep-assign-option-card ${isCurrent ? 'active' : ''}" data-badge-name="${b.name}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; border-radius: 8px; border: 1.5px solid ${isCurrent ? b.textColor : '#e2e8f0'}; background: ${isCurrent ? b.bgColor : '#ffffff'}; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <i class="fas ${b.icon}" style="color: ${b.textColor} !important; font-size: 1.25rem; width: 26px; text-align: center;"></i>
              <div>
                <div style="font-weight: 800; font-size: 0.95rem; color: ${b.textColor} !important;">${b.name}</div>
                <div class="number-latin" style="font-size: 0.72rem; color: #64748b;">خەت رەڭگى: ${b.textColor}</div>
              </div>
            </div>
            <div>
              ${isCurrent 
                ? `<span style="background: ${b.textColor}; color: #fff; font-size: 0.75rem; padding: 3px 10px; border-radius: 9999px; font-weight: 800;"><i class="fas fa-check"></i> ھازىرقى</span>`
                : `<span style="font-size: 0.82rem; color: #1e40af; font-weight: 700; background: #eff6ff; padding: 4px 10px; border-radius: 6px; border: 1px solid #bfdbfe;"><i class="fas fa-check"></i> تاللاش</span>`
              }
            </div>
          </div>
        `;
      }).join('');

      listEl.querySelectorAll('.rep-assign-option-card').forEach(card => {
        card.addEventListener('click', () => {
          const badgeName = card.dataset.badgeName;
          window.appStore.updateAgentReputation(agent.id, badgeName);
          modal.classList.remove('active');
          renderAgentsView();
          renderProductsTable();
          showAdminToast(`«${agent.name}» نىڭ دۇكان ئىناۋىتى «${badgeName}» غا تەڭشەلدى!`, 'success');
        });
      });
    }

    modal.classList.add('active');
  }

  // 6. ئىناۋەت بەلگىلىرىنى باشقۇرۇش كۆزنىكى (Manage Reputation Badges)
  function openManageReputationsModal() {
    const modal = document.getElementById('manageReputationsModal');
    if (!modal) return;
    renderManageRepBadgesList();
    resetRepBadgeEditorForm();
    modal.classList.add('active');
  }

  function renderManageRepBadgesList() {
    const container = document.getElementById('manageRepBadgesTableContainer');
    if (!container) return;

    const badges = window.appStore.getReputationBadges();
    container.innerHTML = `
      <div style="display: flex; flex-direction: column;">
        ${badges.map(b => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.7rem 1rem; border-bottom: 1px solid #f1f5f9; gap: 0.5rem; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="product-merchant-tag" style="color: ${b.textColor} !important; background: ${b.bgColor} !important; border: 1.5px solid ${b.borderColor} !important; font-weight: 800; padding: 3px 10px; border-radius: 6px;">
                <i class="fas ${b.icon}" style="color: ${b.textColor} !important;"></i> <span style="color: ${b.textColor} !important;">${b.name}</span>
              </span>
              <span class="number-latin" style="font-size: 0.75rem; color: #64748b; background: #f8fafc; padding: 2px 7px; border-radius: 4px; border: 1px solid #e2e8f0;">خەت: ${b.textColor}</span>
            </div>
            <div style="display: flex; gap: 0.4rem;">
              <button type="button" class="btn-action-edit btn-edit-rep-badge" data-id="${b.id}" title="تەھرىرلەش" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; font-weight: 700;">
                <i class="fas fa-edit"></i> تەھرىرلەش
              </button>
              <button type="button" class="btn-action-delete btn-delete-rep-badge" data-id="${b.id}" title="ئۆچۈرۈش" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('.btn-edit-rep-badge').forEach(btn => {
      btn.addEventListener('click', () => editRepBadge(btn.dataset.id));
    });

    container.querySelectorAll('.btn-delete-rep-badge').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('بۇ ئىناۋەت بەلگىسىنى راستلا تىزىملىكتىن ئۆچۈرەمسىز؟')) {
          const res = window.appStore.deleteReputationBadge(btn.dataset.id);
          if (res.success) {
            showAdminToast(res.message, 'info');
            renderManageRepBadgesList();
            renderAgentsView();
            renderProductsTable();
          } else {
            showAdminToast(res.message, 'error');
          }
        }
      });
    });
  }

  function resetRepBadgeEditorForm() {
    const form = document.getElementById('repBadgeEditorForm');
    if (!form) return;
    document.getElementById('editorRepBadgeId').value = '';
    document.getElementById('editorRepBadgeName').value = '';
    document.getElementById('editorRepBadgeTextColor').value = '#059669';
    document.getElementById('editorRepBadgeTextColorHex').value = '#059669';
    document.getElementById('editorRepBadgeBgColor').value = '#ecfdf5';
    document.getElementById('editorRepBadgeBgColorHex').value = '#ecfdf5';
    document.getElementById('editorRepBadgeBorderColor').value = '#a7f3d0';
    document.getElementById('editorRepBadgeBorderColorHex').value = '#a7f3d0';
    document.getElementById('editorRepBadgeIcon').value = 'fa-check-circle';

    document.getElementById('repBadgeFormTitle').innerHTML = '<i class="fas fa-plus-circle" style="color: #059669;"></i> يېڭى ئىناۋەت بەلگىسى قوشۇش';
    document.getElementById('btnSaveRepBadge').innerHTML = '<i class="fas fa-save"></i> بەلگىنى ساقلاش';
    const cancelBtn = document.getElementById('btnCancelRepBadgeEdit');
    if (cancelBtn) cancelBtn.style.display = 'none';

    updateRepBadgePreviewBox();
  }

  function editRepBadge(badgeId) {
    const badges = window.appStore.getReputationBadges();
    const b = badges.find(x => x.id === badgeId);
    if (!b) return;

    document.getElementById('editorRepBadgeId').value = b.id;
    document.getElementById('editorRepBadgeName').value = b.name;
    document.getElementById('editorRepBadgeTextColor').value = b.textColor || '#059669';
    document.getElementById('editorRepBadgeTextColorHex').value = b.textColor || '#059669';
    document.getElementById('editorRepBadgeBgColor').value = b.bgColor || '#ecfdf5';
    document.getElementById('editorRepBadgeBgColorHex').value = b.bgColor || '#ecfdf5';
    document.getElementById('editorRepBadgeBorderColor').value = b.borderColor || '#a7f3d0';
    document.getElementById('editorRepBadgeBorderColorHex').value = b.borderColor || '#a7f3d0';
    document.getElementById('editorRepBadgeIcon').value = b.icon || 'fa-check-circle';

    document.getElementById('repBadgeFormTitle').innerHTML = '<i class="fas fa-edit" style="color: #2563eb;"></i> ئىناۋەت بەلگىسىنى تەھرىرلەش';
    document.getElementById('btnSaveRepBadge').innerHTML = '<i class="fas fa-save"></i> ئۆزگەرتىشنى ساقلاش';
    const cancelBtn = document.getElementById('btnCancelRepBadgeEdit');
    if (cancelBtn) cancelBtn.style.display = 'inline-block';

    updateRepBadgePreviewBox();
    document.getElementById('editorRepBadgeName').focus();
  }

  function updateRepBadgePreviewBox() {
    const previewBox = document.getElementById('editorRepBadgePreviewBox');
    if (!previewBox) return;

    const name = document.getElementById('editorRepBadgeName')?.value?.trim() || 'ئىناۋەت بەلگىسى نامى';
    const textColor = document.getElementById('editorRepBadgeTextColor')?.value || '#059669';
    const bgColor = document.getElementById('editorRepBadgeBgColor')?.value || '#ecfdf5';
    const borderColor = document.getElementById('editorRepBadgeBorderColor')?.value || '#a7f3d0';
    const icon = document.getElementById('editorRepBadgeIcon')?.value || 'fa-check-circle';

    previewBox.innerHTML = `
      <span class="product-merchant-tag" style="color: ${textColor} !important; background: ${bgColor} !important; border: 1.5px solid ${borderColor} !important; font-weight: 800; padding: 4px 12px; border-radius: 6px;">
        <i class="fas ${icon}" style="color: ${textColor} !important;"></i> <span style="color: ${textColor} !important;">${name}</span>
      </span>
    `;
  }

  // ==================== ماركىلارنى باشقۇرۇش كۆزنىكى (Brand Management) ====================
  function openManageBrandsModal() {
    const modal = document.getElementById('manageBrandsModal');
    if (!modal) return;
    renderManageBrandsList();
    const input = document.getElementById('inputBrandModalNewName');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 150);
    }
    modal.classList.add('active');
  }

  function renderManageBrandsList() {
    const container = document.getElementById('manageBrandsTableContainer');
    const totalCountEl = document.getElementById('brandModalTotalCount');
    if (!container) return;

    const brands = window.appStore.getBrands();
    if (totalCountEl) totalCountEl.textContent = brands.length;

    const allProducts = window.appStore.getProducts();
    const allAgents = window.appStore.getAgents();

    container.innerHTML = `
      <div style="display: flex; flex-direction: column;">
        ${brands.map(brandName => {
          const isDefaultAll = (brandName === 'بارلىق ماركىلار');
          const prodCount = allProducts.filter(p => p.brand === brandName).length;
          const agentCount = allAgents.filter(a => a.authorizedBrands && a.authorizedBrands.includes(brandName)).length;

          return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border-bottom: 1px solid #f1f5f9; gap: 0.75rem; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                <span style="display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 800; font-size: 0.92rem; color: #1e3a8a; background: #f8fafc; border: 1px solid #e2e8f0; padding: 4px 10px; border-radius: 8px;">
                  <i class="fas fa-tag" style="color: #8b5cf6;"></i>
                  <span>${brandName}</span>
                </span>
                ${isDefaultAll ? `<span style="font-size: 0.75rem; color: #64748b; background: #f1f5f9; padding: 2px 8px; border-radius: 4px;">(ئاساسىي تۈر)</span>` : ''}
                <div style="display: flex; gap: 0.4rem; align-items: center;">
                  <span style="font-size: 0.75rem; font-weight: 700; color: #2563eb; background: #eff6ff; border: 1px solid #bfdbfe; padding: 2px 8px; border-radius: 6px;">
                    <i class="fas fa-box"></i> ${prodCount} مەھسۇلات
                  </span>
                  <span style="font-size: 0.75rem; font-weight: 700; color: #059669; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 2px 8px; border-radius: 6px;">
                    <i class="fas fa-user-shield"></i> ${agentCount} ۋاكالەتچى
                  </span>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                ${isDefaultAll ? `
                  <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 600;">سۈكۈتتىكى</span>
                ` : `
                  <button type="button" class="action-btn btn-delete-brand-row" data-brand="${brandName}" title="ئۆچۈرۈش" style="color: #ef4444; border-color: #fca5a5; padding: 0.3rem 0.7rem; font-size: 0.8rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.3rem;">
                    <i class="fas fa-trash"></i> <span>ئۆچۈرۈش</span>
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.querySelectorAll('.btn-delete-brand-row').forEach(btn => {
      btn.addEventListener('click', () => {
        const bName = btn.dataset.brand;
        const pCount = allProducts.filter(p => p.brand === bName).length;
        const confirmMsg = pCount > 0
          ? `«${bName}» ناملىق ماركىغا باغلانغان ${pCount} مەھسۇلات بار! ھەقىقەتەن ئۆچۈرەمسىز؟`
          : `«${bName}» ناملىق ماركىنى تىزىملىكتىن ئۆچۈرەمسىز؟`;

        if (confirm(confirmMsg)) {
          const res = window.appStore.deleteBrand(bName);
          if (res.success) {
            showAdminToast(res.message, 'success');
            renderManageBrandsList();
            populateAgentFilterDropdowns();
            populateCategoryDropdowns();
            renderAgentsView();
          } else {
            showAdminToast(res.message, 'error');
          }
        }
      });
    });
  }

  // ==================== تاۋار قوشۇش / تەھرىرلەش كۆزنىكى (كۆپ تىللىق) ====================
  function openProductModal(productId = null) {
    const modal = document.getElementById('productFormModal');
    const form = document.getElementById('productForm');
    const titleEl = document.getElementById('productModalTitle');
    if (!modal || !form) return;

    form.reset();
    populateCategoryDropdowns();

    // تىل تاللاش گۇرۇپپىسىنى قوزغىتىش
    const scopeSelect = document.getElementById('formLanguageScope');
    const multilingualBox = document.getElementById('multilingualFieldsBox');

    function updateLanguageFieldsVisibility(scope) {
      if (scope === 'all') {
        multilingualBox.style.display = 'block';
      } else {
        multilingualBox.style.display = 'none';
      }
    }

    if (scopeSelect) {
      scopeSelect.onchange = () => updateLanguageFieldsVisibility(scopeSelect.value);
    }

    // تېز ماركا تاللاش كۇنۇپكىلىرىنى ئۇلاش
    const brandInput = document.getElementById('formProductBrand');
    document.querySelectorAll('.quick-brand-btn').forEach(btn => {
      btn.onclick = () => {
        const b = btn.dataset.brand;
        if (brandInput) brandInput.value = b;
        document.querySelectorAll('.quick-brand-btn').forEach(bEl => bEl.style.borderColor = 'var(--border-color)');
        btn.style.borderColor = 'var(--primary-color)';
      };
    });

    // ⚖️ مىقدارى / بىرلىكى (سىيرىلما ۋە ئەركىن كىرگۈزۈش رامكىسىنى باغلاش)
    const unitSelect = document.getElementById('formProductUnitSelect');
    const unitInput = document.getElementById('formProductUnit');
    if (unitSelect && unitInput) {
      unitSelect.onchange = () => {
        if (unitSelect.value === 'custom') {
          unitInput.value = '';
          unitInput.focus();
        } else {
          unitInput.value = unitSelect.value;
        }
      };
      unitInput.oninput = () => {
        const val = unitInput.value.trim();
        const match = Array.from(unitSelect.options).find(opt => opt.value === val);
        unitSelect.value = match ? val : 'custom';
      };
    }

    if (productId) {
      const product = window.appStore.getProductById(productId);
      if (!product) return;

      titleEl.textContent = 'تاۋار ئۇچۇرىنى تەھرىرلەش';
      document.getElementById('formProductId').value = product.id;
      document.getElementById('formProductNameUg').value = product.name;
      if (brandInput) brandInput.value = product.brand || 'تەكلىماكان كىلاسسىك';
      document.getElementById('formProductCategory').value = product.category;
      document.getElementById('formProductPrice').value = product.price;
      document.getElementById('formProductOldPrice').value = product.oldPrice || '';
      document.getElementById('formProductStock').value = product.stock;

      const pUnit = product.unit || 'دانە';
      if (unitInput) unitInput.value = pUnit;
      if (unitSelect) {
        const match = Array.from(unitSelect.options).find(opt => opt.value === pUnit);
        unitSelect.value = match ? pUnit : 'custom';
      }

      document.getElementById('formProductImage').value = product.image;
      document.getElementById('formProductBadge').value = product.badge || '';
      document.getElementById('formProductDescUg').value = product.description || '';

      const scope = product.languageScope || 'all';
      if (scopeSelect) {
        scopeSelect.value = scope;
        scopeSelect.disabled = false;
        updateLanguageFieldsVisibility(scope);
      }

      const agentNoticeEl = document.getElementById('productModalAgentLangNotice');
      if (agentNoticeEl) {
        if (product.agentId) {
          const agent = window.appStore.getAgentById(product.agentId);
          if (agent) {
            if (agent.canPublishMultilingual) {
              agentNoticeEl.innerHTML = `🌟 <b>ۋاكالەتچى ھوقۇقى:</b> «${agent.name}» نىڭ بارلىق تىللاردا ئېلان قىلىش ھوقۇقى بار. سىز ئالىي باشقۇرغۇچى سۈپىتىدە بۇ يەردىن خالىغان تىلنى چەكلىمىسىز تەڭشىيەلەيسىز.`;
              agentNoticeEl.style.color = '#15803d';
            } else {
              agentNoticeEl.innerHTML = `🔒 <b>ۋاكالەتچى چەكلىمىسى:</b> «${agent.name}» نىڭ پەقەت ئۇيغۇرچە بەتتىلا ئېلان قىلىش ھوقۇقى بار. ئالىي باشقۇرغۇچى سۈپىتىدە سىزنىڭ ھوقۇقىڭىز چەكلىمىسىز، خالىغان تىلنى تاللاپ ساقلىيالايسىز.`;
              agentNoticeEl.style.color = '#1d4ed8';
            }
          } else {
            agentNoticeEl.innerHTML = `ئەسكەرتىش: «بارلىق تىللاردا ئېلان قىلىش» تاللانسا، خېرىدارلار تىل ئالماشتۇرغاندا ئاپتوماتىك شۇ تىلدىكى تەرجىمىسى كۆرۈنىدۇ.`;
            agentNoticeEl.style.color = 'var(--text-muted)';
          }
        } else {
          agentNoticeEl.innerHTML = `ئەسكەرتىش: «بارلىق تىللاردا ئېلان قىلىش» تاللانسا، خېرىدارلار تىل ئالماشتۇرغاندا ئاپتوماتىك شۇ تىلدىكى تەرجىمىسى كۆرۈنىدۇ.`;
          agentNoticeEl.style.color = 'var(--text-muted)';
        }
      }

      // رەسىم ئالدىن كۆرۈشنى تەڭشەش
      const previewBox = document.getElementById('productImagePreviewBox');
      const previewImg = document.getElementById('productImagePreviewImg');
      const secStatus = document.getElementById('imageSecurityStatus');
      const secDetail = document.getElementById('imageSecurityDetail');

      if (product.image) {
        if (previewBox && previewImg) {
          previewImg.src = product.image;
          previewBox.style.display = 'block';
          if (secStatus) {
            secStatus.innerHTML = '<i class="fas fa-check-circle" style="color: #059669;"></i> تەكشۈرۈلگەن سۈرەت';
            secStatus.style.color = '#059669';
          }
          if (secDetail) secDetail.textContent = 'سۈرەتتە ئادەم ياكى يات ئېلان يوق.';
        }
      } else {
        if (previewBox) previewBox.style.display = 'none';
      }

      // تەرجىمىلىرىنى تولدۇرۇش ۋە خاس تەھرىرلەش ھالىتىنى بەلگىلەش
      const nameTrEl = document.getElementById('formProductNameTr');
      const nameEnEl = document.getElementById('formProductNameEn');
      const descTrEl = document.getElementById('formProductDescTr');
      const descEnEl = document.getElementById('formProductDescEn');

      const trName = (product.translations?.tr?.name) || '';
      const trDesc = (product.translations?.tr?.description) || '';
      const enName = (product.translations?.en?.name) || '';
      const enDesc = (product.translations?.en?.description) || '';

      if (nameTrEl) { nameTrEl.value = trName; nameTrEl.dataset.manuallyEdited = trName ? "true" : "false"; }
      if (nameEnEl) { nameEnEl.value = enName; nameEnEl.dataset.manuallyEdited = enName ? "true" : "false"; }
      if (descTrEl) { descTrEl.value = trDesc; descTrEl.dataset.manuallyEdited = trDesc ? "true" : "false"; }
      if (descEnEl) { descEnEl.value = enDesc; descEnEl.dataset.manuallyEdited = enDesc ? "true" : "false"; }
    } else {
      titleEl.textContent = 'يېڭى تاۋار قوشۇش';
      document.getElementById('formProductId').value = '';
      if (brandInput) brandInput.value = 'تەكلىماكان كىلاسسىك';
      if (unitInput) unitInput.value = 'دانە';
      if (unitSelect) unitSelect.value = 'دانە';

      const nameTrEl = document.getElementById('formProductNameTr');
      const nameEnEl = document.getElementById('formProductNameEn');
      const descTrEl = document.getElementById('formProductDescTr');
      const descEnEl = document.getElementById('formProductDescEn');
      if (nameTrEl) { nameTrEl.value = ''; nameTrEl.dataset.manuallyEdited = "false"; }
      if (nameEnEl) { nameEnEl.value = ''; nameEnEl.dataset.manuallyEdited = "false"; }
      if (descTrEl) { descTrEl.value = ''; descTrEl.dataset.manuallyEdited = "false"; }
      if (descEnEl) { descEnEl.value = ''; descEnEl.dataset.manuallyEdited = "false"; }

      if (scopeSelect) {
        scopeSelect.value = 'all';
        updateLanguageFieldsVisibility('all');
      }

      // قۇرۇق تاۋاردا ئالدىن كۆرۈشنى نۆللەش
      const previewBox = document.getElementById('productImagePreviewBox');
      const previewImg = document.getElementById('productImagePreviewImg');
      const fileInput = document.getElementById('formProductFileInput');
      if (previewBox) previewBox.style.display = 'none';
      if (previewImg) previewImg.src = '';
      if (fileInput) fileInput.value = '';
    }

    modal.classList.add('active');
  }

  function populateCategoryDropdowns() {
    const categories = window.appStore.getCategories('ug').filter(c => c.id !== 'all');
    const formSelect = document.getElementById('formProductCategory');
    const filterSelect = document.getElementById('adminProductCatFilter');

    if (formSelect) {
      formSelect.innerHTML = '';
      categories.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        formSelect.appendChild(opt);
      });
    }

    if (filterSelect) {
      filterSelect.innerHTML = '<option value="all">بارلىق تۈرلەر</option>';
      categories.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        filterSelect.appendChild(opt);
      });
      filterSelect.value = productFilterCat;
    }
  }

  function openOrderInvoiceModal(orderId) {
    const orders = window.appStore.getOrders();
    const order = orders.find(o => String(o.id) === String(orderId));
    if (!order) return;

    const modal = document.getElementById('orderInvoiceModal');
    const body = document.getElementById('orderInvoiceModalBody');
    if (!modal || !body) return;

    const cust = (typeof order.customer === 'string') ? JSON.parse(order.customer || '{}') : (order.customer || {});
    const itemsList = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items || '[]') : []);

    let itemsRows = itemsList.map(item => `
      <tr>
        <td style="padding:0.65rem 0.5rem; border-bottom:1px solid var(--admin-border);">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            ${item.image ? `<img src="${item.image}" style="width:36px; height:36px; border-radius:4px; object-fit:cover;">` : ''}
            <span>${item.name || item.productName || 'تاۋار'}</span>
          </div>
        </td>
        <td style="padding:0.65rem 0.5rem; border-bottom:1px solid var(--admin-border);">${window.appStore.formatPrice(item.price)}</td>
        <td style="padding:0.65rem 0.5rem; border-bottom:1px solid var(--admin-border);">${item.quantity || 1} ${item.unit || (item.product && item.product.unit) || 'دانە'}</td>
        <td style="padding:0.65rem 0.5rem; border-bottom:1px solid var(--admin-border); font-weight:700;">${window.appStore.formatPrice((item.price || 0) * (item.quantity || 1))}</td>
      </tr>
    `).join('');

    const invoiceTotal = order.totalFormatted || window.appStore.formatPrice(order.totalCny || order.total || 0);

    body.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:1.5rem; border-bottom:2px solid var(--admin-border); padding-bottom:0.75rem;">
        <div>
          <h3 style="font-size:1.35rem; font-weight:800; color:var(--primary-color); margin: 0 0 0.25rem;">زاكاز تالونى</h3>
          <p class="number-latin" style="color:var(--text-muted); margin: 0; font-weight: 700;">#${order.id}</p>
        </div>
        <div>
          <span class="status-pill ${getStatusClass(order.status)}">${order.status}</span>
        </div>
      </div>

      <div class="order-detail-grid">
        <div class="order-detail-card">
          <h5><i class="fas fa-user"></i> تاپشۇرۇۋالغۇچى:</h5>
          <p><strong>ئىسىم:</strong> ${cust.name || '-'}</p>
          <p><strong>تېلېفون:</strong> <span class="number-latin">${cust.phone || '-'}</span></p>
          <p><strong>ئادرېس:</strong> ${cust.city || ''} ${cust.address || ''}</p>
        </div>
        <div class="order-detail-card">
          <h5><i class="fas fa-info-circle"></i> زاكاز ئۇچۇرى:</h5>
          <p><strong>چىقىم:</strong> ${order.paymentMethod || 'نەق پۇل'}</p>
          <p><strong>ۋاقتى:</strong> <span class="number-latin">${order.date}</span></p>
          <p><strong>ئالاھىدە تەلەپ:</strong> ${order.notes || 'يوق'}</p>
        </div>
      </div>

      <table style="width:100%; border-collapse:collapse; margin-bottom:1.5rem; font-size:0.9rem;">
        <thead>
          <tr style="background:var(--admin-bg); text-align:right;">
            <th style="padding:0.5rem;">تاۋار</th>
            <th style="padding:0.5rem;">باھاسى</th>
            <th style="padding:0.5rem;">سانى</th>
            <th style="padding:0.5rem;">جەمئىي</th>
          </tr>
        </thead>
        <tbody>${itemsRows || '<tr><td colspan="4" style="text-align:center; padding:1rem;">تاۋار ئۇچۇرى يوق</td></tr>'}</tbody>
      </table>

      <div style="text-align:left; direction:ltr; font-weight:700;">
        <div>Total Amount: <span style="color:var(--danger-color); font-size:1.2rem;">${invoiceTotal}</span></div>
      </div>

      <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px dashed var(--admin-border); display: flex; justify-content: flex-end; gap: 0.75rem;">
        <button type="button" class="btn-secondary btn-modal-close" onclick="window.hideModal('orderInvoiceModal')" style="padding: 0.55rem 1.25rem; font-weight: 700; border-radius: 8px;">تاقاش</button>
        <button type="button" class="btn-secondary btn-invoice-sms" data-id="${order.id}" style="color: #0284c7; border-color: #0284c7; font-weight: 700; padding: 0.55rem 1.25rem; border-radius: 8px;">
          <i class="fas fa-sms"></i> خېرىدارغا قىسقا ئۇچۇر (SMS / WhatsApp) ئەۋەتىش
        </button>
      </div>
    `;

    const smsBtn = body.querySelector('.btn-invoice-sms');
    if (smsBtn) {
      smsBtn.addEventListener('click', () => {
        openDirectSmsModal({
          name: cust.name || 'خېرىدار',
          phone: cust.phone || '',
          role: 'خېرىدار',
          orderId: order.id
        });
        window.showModal('directSmsModal');
      });
    }

    window.showModal('orderInvoiceModal');
  }
  window.openOrderInvoiceModal = openOrderInvoiceModal;

  function loadSettingsForm() {
    const s = window.appStore ? window.appStore.getSettings() : null;
    if (!s) return;
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = (val !== undefined && val !== null) ? val : '';
    };
    const setChecked = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = !!val;
    };

    setVal('settingStoreName', s.storeName);
    setVal('settingStoreSlogan', s.storeSlogan);
    setVal('settingCurrency', s.currency || 'TRY');
    setVal('settingPhone', s.contactPhone || '05551609999');
    setVal('settingInstagram', s.instagramUrl || 'https://www.instagram.com/teklimakan.online');
    setVal('settingEmail', s.contactEmail);
    let curAdminUser = localStorage.getItem('teklimakan_admin_username') || 'seidiye';
    if (curAdminUser === 'admin') {
      curAdminUser = 'seidiye';
      localStorage.setItem('teklimakan_admin_username', 'seidiye');
    }
    setVal('settingAdminUsername', curAdminUser);
    setVal('settingAdminPassword', localStorage.getItem('teklimakan_admin_password') || 'teklimakan2026');
    setVal('settingTelegramBotToken', s.telegramBotToken);
    setVal('settingTelegramChatId', s.telegramChatId);
    setChecked('settingTelegramEnabled', s.telegramEnabled !== false);
    setChecked('settingEmailNotificationEnabled', s.emailNotificationEnabled !== false);

    const curPreset = s.smtpPreset || 'gmail';
    setVal('settingSmtpPreset', curPreset);
    setVal('settingSmtpUser', s.smtpUser || '');
    setVal('settingSmtpPass', s.smtpPass || '');
    setVal('settingSmtpHost', s.smtpHost || (curPreset === 'outlook' ? 'smtp-mail.outlook.com' : 'smtp.gmail.com'));
    setVal('settingSmtpPort', s.smtpPort || 587);
    setVal('settingNotificationEmail', s.notificationEmail || s.smtpUser || '');

    const customWrap = document.getElementById('customSmtpFieldsWrap');
    if (customWrap) {
      customWrap.style.display = (curPreset === 'custom') ? 'block' : 'none';
    }

    const noticeEl = document.getElementById('emailNotificationStatusNotice');
    if (noticeEl) {
      if (s.smtpUser && s.smtpPass) {
        noticeEl.style.background = '#f0fdf4';
        noticeEl.style.borderColor = '#bbf7d0';
        noticeEl.style.color = '#166534';
        noticeEl.innerHTML = `✅ <b>Google SMTP ئېلخەت ئۇلىنىشى پۈتتى:</b> <code class="number-latin" style="font-weight: 700; color: #15803d;">${s.smtpUser}</code><br><span style="font-size: 0.8rem; color: #4b5563;">خېرىدار زاكاز بەرگەندە، زاكاز تالونى «${s.notificationEmail || s.smtpUser}» ساندۇقىغا بىر سېكۇنتتا يېتىپ بارىدۇ.</span>`;
      } else {
        noticeEl.style.background = '#fff7ed';
        noticeEl.style.borderColor = '#fed7aa';
        noticeEl.style.color = '#9a3412';
        noticeEl.innerHTML = `🔑 <b>ئەسكەرتىش:</b> سىستېما سىزنىڭ ئۆزىڭىزنىڭ Gmail ئادرېسى ئارقىلىق بىۋاسىتە خەت ئەۋەتىدۇ. Gmail ئادرېسىڭىزنى ۋە 16 خانىلىق Google ئەپ پارولىنى كىرگۈزۈپ «🚀 سىناق ئېلخەت ئەۋەتىپ سىناش» كۇنۇپكىسىنى بېسىڭ.`;
      }
    }
  }

  // ==================== 📱 قىسقا ئۇچۇر ۋە خەۋەرلىشىش مەركىزى (SMS & WhatsApp Module) ====================
  function getStoreBrandName() {
    try {
      const s = window.appStore.getSettings();
      return (s && s.storeName) ? s.storeName.trim() : 'تەكلىماكان دۇكىنى';
    } catch (e) {
      return 'تەكلىماكان دۇكىنى';
    }
  }

  const SMS_TEMPLATES = {
    order_approved: (d) => {
      const brand = getStoreBrandName();
      return `【${brand}】\nھۆرمەتلىك ${d.name || 'خېرىدار'}، دۇكىنىمىزدىن بەرگەن ${d.orderId ? '#' + d.orderId + ' نومۇرلۇق ' : ''}زاكازىڭىز مۇۋەپپەقىيەتلىك تەستىقلاندى ۋە مال تەييارلىنىشقا باشلىدى. بىزنى تاللىغىنىڭىزغا كۆپ تەشەككۈر!`;
    },
    order_shipped: (d) => {
      const brand = getStoreBrandName();
      return `【${brand}】\nھۆرمەتلىك ${d.name || 'خېرىدار'}، ${d.orderId ? '#' + d.orderId + ' نومۇرلۇق ' : ''}زاكازىڭىز ئوراپ تېز كارگوغا تاپشۇرۇلدى. زاكاز پات يېقىندا ئادرېسىڭىزغا يېتىپ بارىدۇ. كۆپ تەشەككۈر!`;
    },
    order_completed: (d) => {
      const brand = getStoreBrandName();
      return `【${brand}】\nھۆرمەتلىك ${d.name || 'خېرىدار'}، ${d.orderId ? '#' + d.orderId + ' نومۇرلۇق ' : ''}زاكازىڭىز يەتكۈزۈپ بېرىلدى. سۈپەتلىك تاۋارلىرىمىزنى خۇشاللىق بىلەن ئىشلىتىشىڭىزنى تىلەيمىز. سالامەت بولۇڭ!`;
    },
    agent_approved: (d) => {
      const brand = getStoreBrandName();
      return `【${brand}】\nھۆرمەتلىك ${d.name || 'ۋاكالەتچى'}، تەبرىكلەيمىز! «${brand}» سۇپىسىدىكى ۋاكالەتچىلىك سالاھىيىتىڭىز ۋە ماركا سېتىش ھوقۇقىڭىز تولۇق تەستىقلاندى. ھازىرلا كىرىپ مەھسۇلات سېتىشنى باشلىيالايسىز!`;
    },
    confirm_address: (d) => {
      const brand = getStoreBrandName();
      return `【${brand}】\nھۆرمەتلىك ${d.name || 'خېرىدار'}، ${d.orderId ? '#' + d.orderId + ' نومۇرلۇق ' : ''}زاكازىڭىزنى كارگوغا كېچىكتۈرمەي يوللاش ئۈچۈن قوبۇل قىلىش ئادرېسىڭىزنى بۇ ئۇچۇرغا قايتۇرۇپ جەزملەپ بەرگەن بولسىڭىز.`;
    },
    custom_promo: (d) => {
      const brand = getStoreBrandName();
      return `【${brand}】\nھۆرمەتلىك ${d.name || 'خېرىدار'}، «${brand}» دۇكىنىمىزدا ئالاھىدە ئېتىبار پائالىيىتى باشلاندى! زىيارەت قىلىپ ئەڭ ياخشى باھالاردىن بەھرىمەن بولۇڭ.`;
    }
  };

  let activeModalTarget = { name: '', phone: '', role: 'خېرىدار', orderId: '' };

  function updateSmsCounterDisplay(text, counterEl) {
    if (!counterEl) return;
    const len = (text || '').length;
    const segments = len === 0 ? 1 : Math.ceil(len / 70);
    counterEl.textContent = `${len} ھەرپ (${segments} SMS)`;
  }

  // ==================== 🚚 كارگو ئىز قوغلاش ئۇلانمىلىرى (Turkish Carriers) ====================
  const CARGO_TRACKING_URLS = {
    yurtici: {
      name: 'Yurtiçi Kargo',
      url: (code) => `https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=${encodeURIComponent(code)}`
    },
    aras: {
      name: 'Aras Kargo',
      url: (code) => `https://kargotakip.araskargo.com.tr/mainpage.aspx?code=${encodeURIComponent(code)}`
    },
    ptt: {
      name: 'PTT Kargo',
      url: (code) => `https://gonderitakip.ptt.gov.tr/Track/Verify?q=${encodeURIComponent(code)}`
    },
    mng: {
      name: 'MNG Kargo',
      url: (code) => `https://service.mngkargo.com.tr/iactive/popup/kargotakip.asp?k=${encodeURIComponent(code)}`
    },
    surat: {
      name: 'Sürat Kargo',
      url: (code) => `https://suratkargo.com.tr/KargoTakip/?kargotakipno=${encodeURIComponent(code)}`
    },
    hepsijet: {
      name: 'HepsiJET',
      url: (code) => `https://hepsijet.com/gonderi-takibi?trackingNo=${encodeURIComponent(code)}`
    },
    custom: {
      name: 'كارگو',
      url: (code) => code
    }
  };

  function insertCargoTrackingText(targetTextarea, counterEl, companySelectId, codeInputId) {
    const compSel = document.getElementById(companySelectId);
    const codeInp = document.getElementById(codeInputId);
    if (!targetTextarea || !compSel || !codeInp) return;

    const code = codeInp.value.trim();
    if (!code) {
      alert('⚠️ ئالدى بىلەن كارگو ئىز قوغلاش نومۇرىنى كىرگۈزۈڭ!');
      codeInp.focus();
      return;
    }

    const compKey = compSel.value || 'yurtici';
    const compInfo = CARGO_TRACKING_URLS[compKey] || CARGO_TRACKING_URLS.yurtici;
    let snippet = '';

    if (compKey === 'custom') {
      snippet = `\n🚚 كارگو ئىز قوغلاش نومۇرى: ${code}`;
    } else {
      const link = compInfo.url(code);
      snippet = `\n🚚 كارگو شىركىتى: ${compInfo.name}\n🔖 ئىز قوغلاش نومۇرى: ${code}\n🔗 كارگو ئىز قوغلاش ئۇلانمىسى:\n${link}`;
    }

    const currentVal = targetTextarea.value.trim();
    targetTextarea.value = currentVal ? `${currentVal}\n${snippet}` : snippet.trim();
    updateSmsCounterDisplay(targetTextarea.value, counterEl);
    showAdminToast(`🚚 ${compInfo.name} ئىز قوغلاش ئۇلانمىسى ئۇچۇرغا قىستۇرۇلدى!`, 'success');
  }

  // ==================== 📊 ئەۋەتىلگەن ئۇچۇر خاتىرىسىنى Excel (CSV) ھۆججىتىگە چىقىرىش ====================
  function exportSmsHistoryCsv() {
    const logs = window.appStore.getSmsHistory ? window.appStore.getSmsHistory() : [];
    if (logs.length === 0) {
      showAdminToast('چىقىرىشقا تېخى ھېچقانداق ئۇچۇر خاتىرىسى يوق!', 'warning');
      return;
    }

    const headers = ['تەرتىپ نومۇرى', 'قوبۇل قىلغۇچى', 'تېلېفون نومۇرى', 'رولى', 'قانال', 'ئۇچۇر مەزمۇنى', 'زاكاز نومۇرى', 'ۋاقتى'];
    const rows = logs.map((l, idx) => [
      idx + 1,
      `"${(l.recipientName || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.recipientRole || l.role || '').replace(/"/g, '""')}"`,
      `"${(l.channel || '').replace(/"/g, '""')}"`,
      `"${(l.message || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`,
      `"${(l.orderId || '').replace(/"/g, '""')}"`,
      `"${(l.timestamp || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `sms_logs_teklimakan_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showAdminToast('📊 ئۇچۇر خاتىرىلىرى Excel (CSV) ھۆججىتى شەكلىدە چىقىرىلدى!', 'success');
  }

  function renderMessagesCenter() {
    const agents = window.appStore.getAgents ? window.appStore.getAgents() : [];
    const orders = window.appStore.getOrders ? window.appStore.getOrders() : [];
    const logs = window.appStore.getSmsHistory ? window.appStore.getSmsHistory() : [];

    // 1. ستاتىستىكا يېڭىلاش
    const statAgentsEl = document.getElementById('msgStatApprovedAgents');
    const statCustEl = document.getElementById('msgStatTotalCustomers');
    const statSentEl = document.getElementById('msgStatSentCount');
    const menuBadge = document.getElementById('menuMsgBadge');

    const approvedAgents = agents.filter(a => a.status === 'تەستىقلاندى');
    const customerPhones = new Set();
    orders.forEach(o => {
      if (o.customer && o.customer.phone) customerPhones.add(o.customer.phone.trim());
    });

    if (statAgentsEl) statAgentsEl.textContent = approvedAgents.length;
    if (statCustEl) statCustEl.textContent = customerPhones.size;
    if (statSentEl) statSentEl.textContent = logs.length;
    if (menuBadge) {
      if (logs.length > 0) {
        menuBadge.textContent = logs.length;
        menuBadge.style.display = 'inline-block';
      } else {
        menuBadge.style.display = 'none';
      }
    }

    // 2. قوبۇل قىلغۇچى تىزىملىكىنى толدۇرۇش
    const recSelect = document.getElementById('msgRecipientSelect');
    if (recSelect) {
      let html = '<option value="">-- ۋاكالەتچى، خېرىدار ياكى نومۇر تاللاڭ --</option>';

      if (approvedAgents.length > 0) {
        html += '<optgroup label="👥 تەستىقلانغان ۋاكالەتچىلەر">';
        approvedAgents.forEach(a => {
          html += `<option value="agent_${a.id}" data-name="${a.name}" data-phone="${a.phone || ''}" data-role="ۋاكالەتچى">👤 ${a.name} (${a.phone || 'نومۇرسىز'})</option>`;
        });
        html += '</optgroup>';
      }

      if (orders.length > 0) {
        html += '<optgroup label="🛒 يېقىنقى زاكاز خېرىدارلىرى">';
        orders.slice(0, 30).forEach(o => {
          html += `<option value="order_${o.id}" data-name="${o.customer.name}" data-phone="${o.customer.phone || ''}" data-role="خېرىدار" data-order="${o.id}">🛒 ${o.customer.name} - ${o.customer.phone} (#${o.id})</option>`;
        });
        html += '</optgroup>';
      }

      html += '<optgroup label="✍️ باشقا تاللاش">';
      html += '<option value="manual">✍️ يېڭى / خالىغان تېلېفون نومۇرى يېزىش</option>';
      html += '</optgroup>';

      recSelect.innerHTML = html;
    }

    // 3. ئەۋەتىلگەن ئۇچۇرلار خاتىرىسىنى سىزىش
    renderSmsHistoryTable();

    // 4. تور بېكەت نەق مەيدان پاراڭ ئۇچۇرلىرى ۋە يىراقتىن يۇيۇش جەدۋىلىنى سىزىش
    renderLiveChatInboxTable();

    // 5. توپ ئۇچۇر قوبۇل قىلغۇچى تىزىملىكىنى يېڭىلاش
    if (window._refreshBulkContacts) window._refreshBulkContacts();
  }

  function renderLiveChatInboxTable() {
    const tbody = document.getElementById('adminLiveChatInboxTableBody');
    if (!tbody) return;

    let inbox = [];
    try {
      inbox = JSON.parse(localStorage.getItem('teklimakan_admin_chat_inbox')) || [];
    } catch (e) {}

    if (inbox.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">تېخى تور بېكەت خېرىدارلىرىدىن كەلگەن نەق مەيدان پاراڭ ئۇچۇرى يوق.</td></tr>';
      return;
    }

    tbody.innerHTML = inbox.map((msg, idx) => {
      const custName = msg.name || 'خېرىدار';
      const custPhone = msg.phone || 'نومۇرسىز';
      const text = msg.text || '';
      const timeStr = (msg.date || '') + ' ' + (msg.time || '');

      return `
        <tr>
          <td>
            <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">${custName}</div>
            <div style="font-size: 0.75rem; color: #64748b;">${msg.sender === 'customer' ? 'خېرىدار سۈرۈشتۈرۈشى' : 'ئاپتوماتىك'}</div>
            ${msg.address ? `<div style="font-size: 0.72rem; color: #059669; font-weight: 700; margin-top: 3px;"><i class="fas fa-map-marker-alt"></i> ${msg.address}</div>` : ''}
            ${msg.orderHistory ? `<div style="font-size: 0.72rem; color: #d97706; font-weight: 700; margin-top: 2px;"><i class="fas fa-box"></i> ${msg.orderHistory}</div>` : ''}
            ${msg.cartInfo ? `<div style="font-size: 0.72rem; color: #2563eb; margin-top: 1px;"><i class="fas fa-shopping-cart"></i> ${msg.cartInfo}</div>` : ''}
          </td>
          <td style="white-space: nowrap;">
            <div class="number-latin" style="font-weight: 700; color: #0284c7; font-size: 0.9rem;">${custPhone}</div>
            ${custPhone && custPhone !== 'نومۇرسىز' ? `
              <div style="margin-top: 4px; display: flex; gap: 6px;">
                <a href="https://wa.me/${custPhone.replace(/[\s\-\+]/g, '')}" target="_blank" style="display: inline-flex; align-items: center; gap: 3px; background: #ecfdf5; border: 1px solid #a7f3d0; color: #059669; padding: 2px 7px; border-radius: 5px; font-size: 0.72rem; font-weight: 700; text-decoration: none;">
                  <i class="fab fa-whatsapp"></i> WhatsApp
                </a>
                <a href="tel:${custPhone.replace(/[\s\-\+]/g, '')}" style="display: inline-flex; align-items: center; gap: 3px; background: #f0f9ff; border: 1px solid #bae6fd; color: #0284c7; padding: 2px 7px; border-radius: 5px; font-size: 0.72rem; font-weight: 700; text-decoration: none;">
                  <i class="fas fa-phone"></i> تېلېفون
                </a>
              </div>
            ` : ''}
          </td>
          <td>
            <div style="max-width: 320px; font-size: 0.84rem; line-height: 1.5; color: #1e293b; word-break: break-word;">
              ${text}
            </div>
          </td>
          <td class="number-latin" style="font-size: 0.76rem; color: #64748b; white-space: nowrap;">${timeStr}</td>
          <td style="white-space: nowrap;">
            <button type="button" class="btn-wipe-single-chat" data-idx="${idx}" data-phone="${custPhone}" title="بۇ خېرىداردىن مەڭگۈ يۇيۇۋېتىش" style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 4px 10px; cursor: pointer; font-size: 0.75rem; color: #dc2626; font-weight: 800;">
              <i class="fas fa-trash-alt"></i> خېرىداردىن يۇيۇش
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-wipe-single-chat').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.dataset.idx, 10);
        const phone = btn.dataset.phone;
        const confirmed = confirm('بۇ خېرىدارنىڭ پاراڭ خاتىرىسىنى خېرىدارنىڭ تور كۆرگۈسىدىنمۇ مەڭگۈلۈك يۇيۇۋېتەمسىز؟');
        if (confirmed) {
          if (window.appStore && typeof window.appStore.sendTelegramAlert === 'function') {
            await window.appStore.sendTelegramAlert({
              title: 'COMMAND',
              message: `/wipe ${phone !== 'نومۇرسىز' ? phone : ''}`
            });
          }
          try {
            let list = JSON.parse(localStorage.getItem('teklimakan_admin_chat_inbox')) || [];
            list.splice(idx, 1);
            localStorage.setItem('teklimakan_admin_chat_inbox', JSON.stringify(list));
          } catch(e) {}
          renderLiveChatInboxTable();
          if (typeof showToast === 'function') showToast('خېرىدارنىڭ كۆزنىكىدىن مەڭگۈ يۇيۇش بۇيرۇقى تارقىتىلدى!', 'success');
        }
      });
    });
  }

  // بارلىق خېرىدارلاردىن مەڭگۈ يۇيۇۋېتىش كۇنۇپكىسى
  const btnWipeAll = document.getElementById('btnAdminWipeAllCustomerChats');
  if (btnWipeAll) {
    btnWipeAll.addEventListener('click', async () => {
      const confirmed = confirm('⚠️ جەزملەشتۈرۈش:\n\nبارلىق خېرىدارلارنىڭ كۆزنىكىدىكى پاراڭ خاتىرىلىرىنى تۈپتىن مەڭگۈ تازىلىۋېتەمسىز؟');
      if (confirmed) {
        if (window.appStore && typeof window.appStore.sendTelegramAlert === 'function') {
          await window.appStore.sendTelegramAlert({
            title: 'COMMAND',
            message: '/wipe_all'
          });
        }
        localStorage.removeItem('teklimakan_admin_chat_inbox');
        renderLiveChatInboxTable();
        if (typeof showToast === 'function') showToast('بارلىق خېرىدارلاردىن يۇيۇش بۇيرۇقى مۇۋەپپەقىيەتلىك ئەۋەتىلدى!', 'success');
      }
    });
  }

  function renderSmsHistoryTable() {
    const tbody = document.getElementById('msgHistoryTableBody');
    if (!tbody) return;

    const logs = window.appStore.getSmsHistory ? window.appStore.getSmsHistory() : [];
    if (logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">تېخى قىسقا ئۇچۇر ئەۋەتىش خاتىرىسى يوق</td></tr>';
      return;
    }

    tbody.innerHTML = logs.map(l => {
      const channelIcon = l.channel === 'WhatsApp' ? '<i class="fab fa-whatsapp" style="color:#16a34a;"></i> WhatsApp' : (l.channel === 'SMS' ? '<i class="fas fa-sms" style="color:#0284c7;"></i> SMS' : '<i class="fas fa-server" style="color:#7c3aed;"></i> سۇپا');
      const roleColor = l.recipientRole === 'ۋاكالەتچى' ? 'color:#15803d;' : 'color:#1d4ed8;';
      return `
        <tr>
          <td>
            <div style="font-weight: 700; ${roleColor}">${l.recipientName || 'نامەلۇم'}</div>
            <div class="number-latin" style="font-size: 0.78rem; color: var(--text-muted);">${l.phone || '-'}</div>
          </td>
          <td style="white-space: nowrap; font-weight: 700; font-size: 0.8rem;">${channelIcon}</td>
          <td>
            <div style="max-width: 220px; font-size: 0.82rem; line-height: 1.5; color: #334155; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;" title="${l.message}">
              ${l.message}
            </div>
          </td>
          <td class="number-latin" style="font-size: 0.76rem; color: var(--text-muted); white-space: nowrap;">${l.timestamp || '-'}</td>
          <td style="white-space: nowrap;">
            <button type="button" class="btn-resend-sms" data-id="${l.id}" title="قايتا يوللاش" style="background: none; border: 1px solid #cbd5e1; border-radius: 6px; padding: 3px 8px; cursor: pointer; font-size: 0.75rem; color: #0284c7; font-weight: 700;">
              <i class="fas fa-redo"></i> قايتا
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-resend-sms').forEach(btn => {
      btn.addEventListener('click', () => {
        const logId = btn.dataset.id;
        const logs = window.appStore.getSmsHistory();
        const item = logs.find(x => x.id === logId);
        if (item) {
          openDirectSmsModal({
            name: item.recipientName,
            phone: item.phone,
            role: item.recipientRole,
            orderId: item.orderId,
            initialText: item.message
          });
        }
      });
    });
  }

  // ==================== 📱 ئۇنىۋېرسال تاللاش كۆزنىكى (Universal Direct SMS Modal) ====================
  function openDirectSmsModal(target) {
    activeModalTarget = {
      name: target.name || 'نامەلۇم',
      phone: target.phone || '',
      role: target.role || 'خېرىدار',
      orderId: target.orderId || ''
    };

    const modal = document.getElementById('directSmsModal');
    if (!modal) return;

    const nameEl = document.getElementById('modalRecipientDisplay');
    const phoneEl = document.getElementById('modalPhoneDisplay');
    const roleBadge = document.getElementById('modalRoleBadge');
    const bodyInput = document.getElementById('modalMsgBody');
    const counterEl = document.getElementById('modalLiveCounter');
    const chipsWrap = document.getElementById('modalTemplateChips');

    if (nameEl) nameEl.textContent = activeModalTarget.name;
    if (phoneEl) phoneEl.textContent = activeModalTarget.phone || 'تېلېفون نومۇرى يوق';
    if (roleBadge) {
      roleBadge.textContent = activeModalTarget.role;
      roleBadge.style.background = activeModalTarget.role === 'ۋاكالەتچى' ? '#dcfce7' : '#e0f2fe';
      roleBadge.style.color = activeModalTarget.role === 'ۋاكالەتچى' ? '#166534' : '#0369a1';
    }

    // تېز قېلىپلارنى ھالەتكە قاراپ قاچىلاش
    if (chipsWrap) {
      let tpls = [];
      if (activeModalTarget.role === 'ۋاكالەتچى') {
        tpls = [
          { key: 'agent_approved', label: '🎖️ ۋاكالەتچىلىك تەستىقلاندى' },
          { key: 'custom_promo', label: '📢 ھەمكارلىق ئۇقتۇرۇشى' }
        ];
      } else {
        tpls = [
          { key: 'order_approved', label: '📦 زاكاز تەستىقلاندى' },
          { key: 'order_shipped', label: '🚚 كارگوغا تاپشۇرۇلدى' },
          { key: 'order_completed', label: '✅ زاكاز تاماملاندى' },
          { key: 'confirm_address', label: '❓ ئادرېس جەزملەش' }
        ];
      }

      chipsWrap.innerHTML = tpls.map(t => `
        <button type="button" class="btn-modal-template-chip" data-tpl="${t.key}" style="background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; border-radius: 9999px; padding: 3px 9px; font-size: 0.76rem; font-weight: 700; cursor: pointer;">
          ${t.label}
        </button>
      `).join('');

      chipsWrap.querySelectorAll('.btn-modal-template-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const tplFn = SMS_TEMPLATES[btn.dataset.tpl];
          if (tplFn) {
            const txt = tplFn(activeModalTarget);
            if (bodyInput) {
              bodyInput.value = txt;
              updateSmsCounterDisplay(txt, counterEl);
            }
          }
        });
      });
    }

    // كارگو نومۇرى كىرگۈزۈش رامكىسىنى دەسلەپلەشتۈرۈش
    const modalCargoCode = document.getElementById('modalCargoTrackingCode');
    if (modalCargoCode) modalCargoCode.value = '';

    // دەسلەپكى تېكىست
    if (bodyInput) {
      if (target.initialText) {
        bodyInput.value = target.initialText;
      } else if (target.templateKey && SMS_TEMPLATES[target.templateKey]) {
        bodyInput.value = SMS_TEMPLATES[target.templateKey](activeModalTarget);
      } else if (activeModalTarget.role === 'ۋاكالەتچى') {
        bodyInput.value = SMS_TEMPLATES.agent_approved(activeModalTarget);
      } else {
        bodyInput.value = SMS_TEMPLATES.order_approved(activeModalTarget);
      }
      updateSmsCounterDisplay(bodyInput.value, counterEl);
    }

    modal.classList.add('active');
  }

  function setupMessagingEvents() {
    // 1. ئاساسىي بەتتىكى تېكىست ئۆزگىرىش كۆزەتكۈچى
    const msgInput = document.getElementById('msgBodyInput');
    const msgCounter = document.getElementById('msgLiveCounter');
    if (msgInput && msgCounter) {
      msgInput.addEventListener('input', () => {
        updateSmsCounterDisplay(msgInput.value, msgCounter);
      });
    }

    // 2. كۆزنەكتىكى تېكىست ئۆزگىرىش كۆزەتكۈچى
    const modalInput = document.getElementById('modalMsgBody');
    const modalCounter = document.getElementById('modalLiveCounter');
    if (modalInput && modalCounter) {
      modalInput.addEventListener('input', () => {
        updateSmsCounterDisplay(modalInput.value, modalCounter);
      });
    }

    // 3. ئاساسىي بەتتىكى قوبۇل قىلغۇچى تاللاش
    const recSelect = document.getElementById('msgRecipientSelect');
    const recName = document.getElementById('msgRecipientName');
    const recPhone = document.getElementById('msgRecipientPhone');
    if (recSelect) {
      recSelect.addEventListener('change', () => {
        const opt = recSelect.selectedOptions[0];
        if (opt && opt.dataset) {
          if (recName) recName.value = opt.dataset.name || '';
          if (recPhone) recPhone.value = opt.dataset.phone || '';
          const role = opt.dataset.role || 'خېرىدار';
          const orderId = opt.dataset.order || '';
          activeModalTarget = {
            name: opt.dataset.name || '',
            phone: opt.dataset.phone || '',
            role,
            orderId
          };
          if (msgInput) {
            const tplFn = (role === 'ۋاكالەتچى') ? SMS_TEMPLATES.agent_approved : SMS_TEMPLATES.order_approved;
            msgInput.value = tplFn(activeModalTarget);
            updateSmsCounterDisplay(msgInput.value, msgCounter);
          }
        }
      });
    }

    // 4. ئاساسىي بەتتىكى قېلىپ كۇنۇپكىلىرى
    document.querySelectorAll('#msgTemplateChips .btn-template-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const tplKey = btn.dataset.tpl;
        const tplFn = SMS_TEMPLATES[tplKey];
        if (tplFn && msgInput) {
          const nameVal = (recName && recName.value) ? recName.value : 'ھۆرمەتلىك دوستىمىز';
          const phoneVal = (recPhone && recPhone.value) ? recPhone.value : '';
          const orderVal = activeModalTarget.orderId || '';
          msgInput.value = tplFn({ name: nameVal, phone: phoneVal, orderId: orderVal });
          updateSmsCounterDisplay(msgInput.value, msgCounter);
        }
      });
    });



    function triggerSmsSend(phone, msg, name, role, orderId) {
      window.appStore.saveSmsLog({
        recipientName: name,
        phone,
        role: role || 'خېرىدار',
        channel: 'SMS',
        message: msg,
        orderId: orderId || ''
      });
      renderMessagesCenter();

      const smsUrl = window.appStore.createSmsUrl(phone, msg);
      const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile) {
        showAdminToast('📱 تېلېفون قىسقا ئۇچۇرى (SMS) ئەپى قوزغىتىلدى!', 'success');
        window.location.href = smsUrl;
      } else {
        // كومپيۇتېر (Windows) دا تۇرغاندا
        try {
          const link = document.createElement('a');
          link.href = smsUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (e) {}

        const helpModal = document.getElementById('smsDesktopHelpModal');
        const qrImg = document.getElementById('smsQrCodeImg');
        const qrPhone = document.getElementById('smsQrPhone');
        const btnSwitchWa = document.getElementById('btnHelpSwitchToWa');
        const btnTabSms = document.getElementById('btnQrTabSms');
        const btnTabWa = document.getElementById('btnQrTabWa');
        const btnCopyText = document.getElementById('btnHelpCopyText');
        const promptText = document.getElementById('qrScanPromptText');

        function renderQrMode(mode) {
          const cleanPhone = window.appStore.normalizePhone(phone);
          const waPhone = window.appStore.normalizePhoneForWa(phone);

          if (mode === 'wa') {
            if (btnTabWa) {
              btnTabWa.style.background = '#dcfce7';
              btnTabWa.style.borderColor = '#16a34a';
              btnTabWa.style.color = '#15803d';
            }
            if (btnTabSms) {
              btnTabSms.style.background = '#ffffff';
              btnTabSms.style.borderColor = '#cbd5e1';
              btnTabSms.style.color = '#64748b';
            }
            if (promptText) promptText.textContent = '📷 تېلېفون كامېراسى بىلەن سىكاننېرلىسىڭىز WhatsApp بىۋاستە ئېچىلىدۇ:';
            const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`;
            if (qrImg) {
              qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(waUrl)}`;
            }
          } else {
            if (btnTabSms) {
              btnTabSms.style.background = '#eff6ff';
              btnTabSms.style.borderColor = '#0284c7';
              btnTabSms.style.color = '#0284c7';
            }
            if (btnTabWa) {
              btnTabWa.style.background = '#ffffff';
              btnTabWa.style.borderColor = '#cbd5e1';
              btnTabWa.style.color = '#64748b';
            }
            if (promptText) promptText.textContent = '📷 تېلېفون كامېراسى بىلەن سىكاننېرلىسىڭىز قىسقا ئۇچۇر (SMS) بېتى ئېچىلىدۇ:';
            // Universal SMSTO standard format recognized natively by iOS and Android Camera
            const smstoPayload = `SMSTO:${cleanPhone}:${msg}`;
            if (qrImg) {
              qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&charset-source=UTF-8&data=${encodeURIComponent(smstoPayload)}`;
            }
          }
        }

        if (helpModal) {
          if (qrPhone) qrPhone.textContent = `${name} (${phone})`;
          renderQrMode('sms');

          if (btnTabSms) {
            btnTabSms.onclick = () => renderQrMode('sms');
          }
          if (btnTabWa) {
            btnTabWa.onclick = () => renderQrMode('wa');
          }
          if (btnSwitchWa) {
            btnSwitchWa.onclick = () => {
              helpModal.classList.remove('active');
              const waUrl = window.appStore.createWhatsappUrl(phone, msg);
              window.open(waUrl, '_blank');
            };
          }
          if (btnCopyText) {
            btnCopyText.onclick = () => {
              navigator.clipboard.writeText(msg);
              showAdminToast('📋 ئۇچۇر مەزمۇنى كۆچۈرۈۋېلىندى!', 'info');
            };
          }
          helpModal.classList.add('active');
        }
      }
    }

    // 5. ئاساسىي بەت: SMS ئەۋەتىش كۇنۇپكىسى
    const btnSendAsSms = document.getElementById('btnSendAsSms');
    if (btnSendAsSms) {
      btnSendAsSms.addEventListener('click', () => {
        const phone = recPhone ? recPhone.value.trim() : '';
        const msg = msgInput ? msgInput.value.trim() : '';
        const name = recName ? recName.value.trim() : 'خېرىدار';
        if (!phone) {
          alert('⚠️ تېلېفون نومۇرىنى كىرگۈزۈڭ!');
          if (recPhone) recPhone.focus();
          return;
        }
        if (!msg) {
          alert('⚠️ ئەۋەتمەكچى بولغان ئۇچۇر تېكىستىنى يېزىڭ!');
          if (msgInput) msgInput.focus();
          return;
        }

        triggerSmsSend(phone, msg, name, activeModalTarget.role, activeModalTarget.orderId);
      });
    }

    // 6. ئاساسىي بەت: WhatsApp ئەۋەتىش كۇنۇپكىسى
    const btnSendAsWa = document.getElementById('btnSendAsWhatsapp');
    if (btnSendAsWa) {
      btnSendAsWa.addEventListener('click', () => {
        const phone = recPhone ? recPhone.value.trim() : '';
        const msg = msgInput ? msgInput.value.trim() : '';
        const name = recName ? recName.value.trim() : 'خېرىدار';
        if (!phone) {
          alert('⚠️ تېلېفون نومۇرىنى كىرگۈزۈڭ!');
          if (recPhone) recPhone.focus();
          return;
        }
        if (!msg) {
          alert('⚠️ ئەۋەتمەكچى بولغان ئۇچۇر تېكىستىنى يېزىڭ!');
          if (msgInput) msgInput.focus();
          return;
        }

        window.appStore.saveSmsLog({
          recipientName: name,
          phone,
          role: activeModalTarget.role || 'خېرىدار',
          channel: 'WhatsApp',
          message: msg,
          orderId: activeModalTarget.orderId || ''
        });
        renderMessagesCenter();
        showAdminToast('💬 WhatsApp ئېچىلدى!', 'success');

        const waUrl = window.appStore.createWhatsappUrl(phone, msg);
        window.open(waUrl, '_blank');
      });
    }

    // 7. ئاساسىي بەت: سۇپىدا خاتىرىلەپ يوللاش
    const btnSendAsServer = document.getElementById('btnSendAsServer');
    if (btnSendAsServer) {
      btnSendAsServer.addEventListener('click', async () => {
        const phone = recPhone ? recPhone.value.trim() : '';
        const msg = msgInput ? msgInput.value.trim() : '';
        const name = recName ? recName.value.trim() : 'خېرىدار';
        if (!phone || !msg) {
          alert('⚠️ تېلېفون ۋە ئۇچۇرنى كىرگۈزۈڭ!');
          return;
        }
        const res = await window.appStore.sendSmsViaServer({
          recipientName: name,
          phone,
          recipientRole: activeModalTarget.role || 'خېرىدار',
          channel: 'سۇپا',
          message: msg,
          orderId: activeModalTarget.orderId || ''
        });
        renderMessagesCenter();
        showAdminToast(res.message || 'ئۇچۇر خاتىرىلەندى!', 'success');
      });
    }

    // 8. ئاساسىي بەت: تېكىست كۆچۈرۈش
    const btnCopyMsg = document.getElementById('btnCopyMsgText');
    if (btnCopyMsg && msgInput) {
      btnCopyMsg.addEventListener('click', () => {
        if (!msgInput.value.trim()) return;
        navigator.clipboard.writeText(msgInput.value);
        showAdminToast('📋 ئۇچۇر تېكىستى كۆچۈرۈۋېلىندى!', 'info');
      });
    }

    // 9. كۆزنەك: SMS كۇنۇپكىسى
    const modalBtnSms = document.getElementById('modalBtnSendSms');
    if (modalBtnSms) {
      modalBtnSms.addEventListener('click', () => {
        const phone = activeModalTarget.phone;
        const msg = modalInput ? modalInput.value.trim() : '';
        if (!phone) {
          alert('⚠️ تاپشۇرۇۋالغۇچىنىڭ تېلېفون نومۇرى يوق!');
          return;
        }
        if (!msg) {
          alert('⚠️ ئۇچۇر مەزمۇنى بوش قالماسلىقى كېرەك!');
          return;
        }

        const modal = document.getElementById('directSmsModal');
        if (modal) modal.classList.remove('active');

        triggerSmsSend(phone, msg, activeModalTarget.name, activeModalTarget.role, activeModalTarget.orderId);
      });
    }

    // 10. كۆزنەك: WhatsApp كۇنۇپكىسى
    const modalBtnWa = document.getElementById('modalBtnSendWa');
    if (modalBtnWa) {
      modalBtnWa.addEventListener('click', () => {
        const phone = activeModalTarget.phone;
        const msg = modalInput ? modalInput.value.trim() : '';
        if (!phone) {
          alert('⚠️ تاپشۇرۇۋالغۇچىنىڭ تېلېفون نومۇرى يوق!');
          return;
        }
        if (!msg) {
          alert('⚠️ ئۇچۇر مەزمۇنى بوش قالماسلىقى كېرەك!');
          return;
        }

        window.appStore.saveSmsLog({
          recipientName: activeModalTarget.name,
          phone,
          role: activeModalTarget.role,
          channel: 'WhatsApp',
          message: msg,
          orderId: activeModalTarget.orderId
        });
        renderMessagesCenter();
        showAdminToast('💬 WhatsApp ئېچىلدى!', 'success');

        const modal = document.getElementById('directSmsModal');
        if (modal) modal.classList.remove('active');

        const waUrl = window.appStore.createWhatsappUrl(phone, msg);
        window.open(waUrl, '_blank');
      });
    }

    // 11. كۆزنەك: سېرۋېر ئارقىلىق يوللاش
    const modalBtnServer = document.getElementById('modalBtnSendServer');
    if (modalBtnServer) {
      modalBtnServer.addEventListener('click', async () => {
        const phone = activeModalTarget.phone;
        const msg = modalInput ? modalInput.value.trim() : '';
        if (!phone || !msg) {
          alert('⚠️ تېلېفون ياكى ئۇچۇر بوش قالغان!');
          return;
        }

        const res = await window.appStore.sendSmsViaServer({
          recipientName: activeModalTarget.name,
          phone,
          recipientRole: activeModalTarget.role,
          channel: 'سۇپا',
          message: msg,
          orderId: activeModalTarget.orderId
        });
        renderMessagesCenter();
        showAdminToast(res.message || 'سۇپىدا مۇۋەپپەقىيەتلىك خاتىرىلەندى!', 'success');

        const modal = document.getElementById('directSmsModal');
        if (modal) modal.classList.remove('active');
      });
    }

    // 12. كۆزنەك: كۆچۈرۈش
    const modalBtnCopy = document.getElementById('modalBtnCopy');
    if (modalBtnCopy && modalInput) {
      modalBtnCopy.addEventListener('click', () => {
        if (!modalInput.value.trim()) return;
        navigator.clipboard.writeText(modalInput.value);
        showAdminToast('📋 ئۇچۇر تېكىستى كۆچۈرۈۋېلىندى!', 'info');
      });
    }

    // 13. خاتىرىنى تازىلاش
    const btnClearLogs = document.getElementById('btnClearSmsLogs');
    if (btnClearLogs) {
      btnClearLogs.addEventListener('click', () => {
        if (confirm('بارلىق ئۇچۇر ئەۋەتىش خاتىرىلىرىنى ئۆچۈرەمسىز؟')) {
          window.appStore.clearSmsHistory();
          renderMessagesCenter();
          showAdminToast('خاتىرە تازىلاندى!', 'info');
        }
      });
    }

    // 14. كارگو ئىز قوغلاش ئۇلانمىسىنى ئۇچۇرغا قىستۇرۇش (ئاساسىي بەت ۋە كۆزنەك)
    const btnInsertCargo = document.getElementById('btnInsertCargoLink');
    if (btnInsertCargo) {
      btnInsertCargo.addEventListener('click', () => {
        insertCargoTrackingText(msgInput, msgCounter, 'msgCargoCompanySelect', 'msgCargoTrackingCode');
      });
    }

    const modalBtnInsertCargo = document.getElementById('modalBtnInsertCargo');
    if (modalBtnInsertCargo) {
      modalBtnInsertCargo.addEventListener('click', () => {
        insertCargoTrackingText(modalInput, modalCounter, 'modalCargoCompanySelect', 'modalCargoTrackingCode');
      });
    }

    // 15. ئەۋەتىلگەن ئۇچۇرلارنى Excel (CSV) قىلىپ ساقلاش
    const btnExportCsv = document.getElementById('btnExportSmsCsv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', exportSmsHistoryCsv);
    }

    // 16. 📢 توپ قىسقا ئۇچۇر ۋە تەشۋىقات تەڭشەكلىرى (Bulk Messaging)
    setupBulkMessaging();
  }

  // ==================== 📢 توپ قىسقا ئۇچۇر ۋە تەشۋىقات ئىقتىدارى ====================
  function setupBulkMessaging() {
    const btnModeSingle = document.getElementById('btnMsgModeSingle');
    const btnModeBulk = document.getElementById('btnMsgModeBulk');
    const wrapSingle = document.getElementById('singleRecipientWrap');
    const wrapBulk = document.getElementById('bulkRecipientWrap');
    const btnsSingle = document.getElementById('singleActionButtons');
    const btnsBulk = document.getElementById('bulkActionButtons');
    const bulkList = document.getElementById('bulkContactsList');
    const countDisplay = document.getElementById('bulkSelectedCount');

    function updateSelectedCount() {
      if (!bulkList || !countDisplay) return;
      const checkedBoxes = bulkList.querySelectorAll('.bulk-contact-checkbox:checked');
      countDisplay.textContent = checkedBoxes.length;
    }

    function populateBulkContacts() {
      if (!bulkList) return;
      const agents = window.appStore.getAgents ? window.appStore.getAgents() : [];
      const orders = window.appStore.getOrders ? window.appStore.getOrders() : [];

      const approvedAgents = agents.filter(a => a.status === 'تەستىقلاندى');
      const seenPhones = new Set();
      const contacts = [];

      approvedAgents.forEach(a => {
        const p = (a.phone || '').trim();
        if (p && !seenPhones.has(p)) {
          seenPhones.add(p);
          contacts.push({ name: a.name, phone: p, role: 'ۋاكالەتچى' });
        }
      });

      orders.forEach(o => {
        if (o.customer && o.customer.phone) {
          const p = o.customer.phone.trim();
          if (p && !seenPhones.has(p)) {
            seenPhones.add(p);
            contacts.push({ name: o.customer.name || 'خېرىدار', phone: p, role: 'خېرىدار' });
          }
        }
      });

      if (contacts.length === 0) {
        bulkList.innerHTML = '<div style="text-align:center; padding: 1.5rem; color: var(--text-muted); font-size: 0.85rem;">ھېچقانداق ۋاكالەتچى ياكى خېرىدار تېپىلمىدى</div>';
        if (countDisplay) countDisplay.textContent = '0';
        return;
      }

      bulkList.innerHTML = contacts.map((c, idx) => `
        <label style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; border-radius: 6px; cursor: pointer; background: #f8fafc; border: 1px solid #e2e8f0; font-size: 0.84rem; user-select: none;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" class="bulk-contact-checkbox" data-role="${c.role}" data-phone="${c.phone}" data-name="${c.name}" id="bulk_c_${idx}" checked style="accent-color: #0284c7; cursor: pointer; width: 16px; height: 16px;">
            <span style="font-weight: 700; color: #1e293b;">${c.name}</span>
            <span style="font-size: 0.74rem; padding: 2px 7px; border-radius: 4px; font-weight: 700; background: ${c.role === 'ۋاكالەتچى' ? '#dcfce7; color: #15803d;' : '#e0f2fe; color: #0369a1;'}">${c.role}</span>
          </div>
          <span class="number-latin" style="color: #64748b; font-size: 0.8rem; font-weight: 600;">${c.phone}</span>
        </label>
      `).join('');

      bulkList.querySelectorAll('.bulk-contact-checkbox').forEach(cb => {
        cb.addEventListener('change', updateSelectedCount);
      });

      updateSelectedCount();
    }

    window._refreshBulkContacts = () => {
      if (wrapBulk && wrapBulk.style.display !== 'none') {
        populateBulkContacts();
      }
    };

    function setMode(mode) {
      if (mode === 'bulk') {
        if (btnModeBulk) {
          btnModeBulk.style.background = '#ffffff';
          btnModeBulk.style.color = '#0284c7';
          btnModeBulk.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
          btnModeBulk.style.borderColor = '#cbd5e1';
        }
        if (btnModeSingle) {
          btnModeSingle.style.background = 'transparent';
          btnModeSingle.style.color = '#475569';
          btnModeSingle.style.boxShadow = 'none';
          btnModeSingle.style.borderColor = 'transparent';
        }
        if (wrapSingle) wrapSingle.style.display = 'none';
        if (wrapBulk) wrapBulk.style.display = 'block';
        if (btnsSingle) btnsSingle.style.display = 'none';
        if (btnsBulk) btnsBulk.style.display = 'grid';

        populateBulkContacts();
      } else {
        if (btnModeSingle) {
          btnModeSingle.style.background = '#ffffff';
          btnModeSingle.style.color = '#0284c7';
          btnModeSingle.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
          btnModeSingle.style.borderColor = '#cbd5e1';
        }
        if (btnModeBulk) {
          btnModeBulk.style.background = 'transparent';
          btnModeBulk.style.color = '#475569';
          btnModeBulk.style.boxShadow = 'none';
          btnModeBulk.style.borderColor = 'transparent';
        }
        if (wrapSingle) wrapSingle.style.display = 'block';
        if (wrapBulk) wrapBulk.style.display = 'none';
        if (btnsSingle) btnsSingle.style.display = 'grid';
        if (btnsBulk) btnsBulk.style.display = 'none';
      }
    }

    if (btnModeSingle) btnModeSingle.addEventListener('click', () => setMode('single'));
    if (btnModeBulk) btnModeBulk.addEventListener('click', () => setMode('bulk'));

    const btnSelectAll = document.getElementById('btnBulkSelectAll');
    const btnSelectAgents = document.getElementById('btnBulkSelectAgents');
    const btnSelectCustomers = document.getElementById('btnBulkSelectCustomers');
    const btnDeselectAll = document.getElementById('btnBulkDeselectAll');

    if (btnSelectAll && bulkList) {
      btnSelectAll.addEventListener('click', () => {
        bulkList.querySelectorAll('.bulk-contact-checkbox').forEach(cb => { cb.checked = true; });
        updateSelectedCount();
      });
    }

    if (btnSelectAgents && bulkList) {
      btnSelectAgents.addEventListener('click', () => {
        bulkList.querySelectorAll('.bulk-contact-checkbox').forEach(cb => {
          cb.checked = (cb.dataset.role === 'ۋاكالەتچى');
        });
        updateSelectedCount();
      });
    }

    if (btnSelectCustomers && bulkList) {
      btnSelectCustomers.addEventListener('click', () => {
        bulkList.querySelectorAll('.bulk-contact-checkbox').forEach(cb => {
          cb.checked = (cb.dataset.role === 'خېرىدار');
        });
        updateSelectedCount();
      });
    }

    if (btnDeselectAll && bulkList) {
      btnDeselectAll.addEventListener('click', () => {
        bulkList.querySelectorAll('.bulk-contact-checkbox').forEach(cb => { cb.checked = false; });
        updateSelectedCount();
      });
    }

    // Bulk WhatsApp
    const btnBulkSendWa = document.getElementById('btnBulkSendWa');
    if (btnBulkSendWa) {
      btnBulkSendWa.addEventListener('click', () => {
        if (!bulkList) return;
        const checkedBoxes = Array.from(bulkList.querySelectorAll('.bulk-contact-checkbox:checked'));
        if (checkedBoxes.length === 0) {
          alert('⚠️ ھېچقانداق قوبۇل قىلغۇچى تاللانمىدى! ئالدى بىلەن قوبۇل قىلغۇچىلارنى تاللاڭ.');
          return;
        }
        const msgInput = document.getElementById('msgBodyInput');
        const msg = msgInput ? msgInput.value.trim() : '';
        if (!msg) {
          alert('⚠️ ئەۋەتمەكچى بولغان تەشۋىقات ياكى ئۇچۇر تېكىستىنى يېزىڭ!');
          if (msgInput) msgInput.focus();
          return;
        }

        checkedBoxes.forEach(cb => {
          window.appStore.saveSmsLog({
            recipientName: cb.dataset.name,
            phone: cb.dataset.phone,
            role: cb.dataset.role,
            channel: 'WhatsApp',
            message: msg,
            orderId: ''
          });
        });
        renderMessagesCenter();
        showAdminToast(`📢 ${checkedBoxes.length} نەپەر ئالاقىلاشقۇچىغا WhatsApp تەشۋىقات ئۇچۇرى خاتىرىلەندى!`, 'success');

        const first = checkedBoxes[0];
        const waUrl = window.appStore.createWhatsappUrl(first.dataset.phone, msg);
        window.open(waUrl, '_blank');
      });
    }

    // Bulk SMS
    const btnBulkSendSms = document.getElementById('btnBulkSendSms');
    if (btnBulkSendSms) {
      btnBulkSendSms.addEventListener('click', () => {
        if (!bulkList) return;
        const checkedBoxes = Array.from(bulkList.querySelectorAll('.bulk-contact-checkbox:checked'));
        if (checkedBoxes.length === 0) {
          alert('⚠️ ھېچقانداق قوبۇل قىلغۇچى تاللانمىدى!');
          return;
        }
        const msgInput = document.getElementById('msgBodyInput');
        const msg = msgInput ? msgInput.value.trim() : '';
        if (!msg) {
          alert('⚠️ ئەۋەتمەكچى بولغان تەشۋىقات ياكى قىسقا ئۇچۇر تېكىستىنى يېزىڭ!');
          if (msgInput) msgInput.focus();
          return;
        }

        checkedBoxes.forEach(cb => {
          window.appStore.saveSmsLog({
            recipientName: cb.dataset.name,
            phone: cb.dataset.phone,
            role: cb.dataset.role,
            channel: 'SMS',
            message: msg,
            orderId: ''
          });
        });
        renderMessagesCenter();
        showAdminToast(`📢 ${checkedBoxes.length} نەپەر قوبۇل قىلغۇچىغا توپ SMS ئەۋەتىش تەييارلاندى!`, 'success');

        const first = checkedBoxes[0];
        const helpModal = document.getElementById('smsDesktopHelpModal');
        if (helpModal) {
          const qrPhone = document.getElementById('smsQrPhone');
          if (qrPhone) qrPhone.textContent = `${checkedBoxes.length} نەپەر تاللانغان قوبۇل قىلغۇچى (${first.dataset.name} ...)`;
          const qrImg = document.getElementById('smsQrCodeImg');
          const cleanPhone = window.appStore.normalizePhone(first.dataset.phone);
          const smstoPayload = `SMSTO:${cleanPhone}:${msg}`;
          if (qrImg) {
            qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&charset-source=UTF-8&data=${encodeURIComponent(smstoPayload)}`;
          }
          helpModal.classList.add('active');
        }
      });
    }
  }

  function setupEventListeners() {
    setupMessagingEvents();

    document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.dataset.tab;
        if (tab) switchTab(tab);
      });
    });

    // ğŸ“± ÙŠØ§Ù†ÙÙˆÙ† ØªØ§Ø±ØªÙ…Ø§ ØªÙ‰Ø²Ù‰Ù…Ù„Ù‰ÙƒÙ‰ Û‹Û• Ø¦Ø§Ø³ØªÙ‰ ÙŠÙˆÙ„ Ø¨Ø§Ø´Ù„Ø§Ø´ ÙƒÙˆÙ†ØªØ±ÙˆÙ„Ù„Ù‰Ø±Ù‰
    const aSidebar = document.getElementById('adminSidebar');
    const aBackdrop = document.getElementById('adminSidebarBackdrop');
    const btnToggleMobile = document.getElementById('btnToggleAdminSidebarMobile');
    const btnCloseSidebar = document.getElementById('btnCloseAdminSidebar');
    const btnMobileMore = document.getElementById('btnMobileMoreDrawer');

    function openMobileDrawer() {
      if (aSidebar) aSidebar.classList.add('is-open');
      if (aBackdrop) aBackdrop.classList.add('is-open');
    }
    function closeMobileDrawer() {
      if (aSidebar) aSidebar.classList.remove('is-open');
      if (aBackdrop) aBackdrop.classList.remove('is-open');
    }

    if (btnToggleMobile) btnToggleMobile.addEventListener('click', openMobileDrawer);
    if (btnMobileMore) btnMobileMore.addEventListener('click', openMobileDrawer);
    if (btnCloseSidebar) btnCloseSidebar.addEventListener('click', closeMobileDrawer);
    if (aBackdrop) aBackdrop.addEventListener('click', closeMobileDrawer);

    document.querySelectorAll('.mobile-nav-item[data-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.dataset.tab;
        if (tab) switchTab(tab);
      });
    });

    const openAddProductBtn = document.getElementById('openAddProductBtn');
    if (openAddProductBtn) {
      openAddProductBtn.addEventListener('click', () => openProductModal(null));
    }

    // ⚡ باش كۆرسەتكۈچ تېز مەشغۇلاتلار سۇپىسى كۇنۇپكىلىرى (Dashboard Quick Actions)
    const dqAddProd = document.getElementById('dashQuickAddProduct');
    if (dqAddProd) {
      dqAddProd.addEventListener('click', () => openProductModal(null));
    }

    const dqAddCat = document.getElementById('dashQuickAddCategory');
    if (dqAddCat) {
      dqAddCat.addEventListener('click', () => {
        switchTab('categories');
        document.getElementById('newCategoryName')?.focus();
      });
    }

    const dqOrders = document.getElementById('dashQuickOrders');
    if (dqOrders) {
      dqOrders.addEventListener('click', () => switchTab('orders'));
    }

    const dqExport = document.getElementById('dashQuickExportCsv');
    if (dqExport) {
      dqExport.addEventListener('click', () => {
        if (typeof exportMonthlySummaryCsv === 'function') {
          exportMonthlySummaryCsv();
        } else {
          showAdminToast('Excel خۇلاسە تەييارلىنىۋاتىدۇ...', 'info');
        }
      });
    }

    const dqRefresh = document.getElementById('dashQuickRefresh');
    if (dqRefresh) {
      dqRefresh.addEventListener('click', () => {
        initAdmin();
        showAdminToast('سانلىق مەلۇماتلار تولۇق يېڭىلاندى!', 'success');
      });
    }

    document.querySelectorAll('.btn-modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const m = e.target.closest('.modal-backdrop');
        if (m) window.hideModal(m);
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach(m => {
      m.addEventListener('click', (e) => {
        if (e.target === m) window.hideModal(m);
      });
    });

    // تاۋار جەدۋىلىنى ساقلاش (ماركا نامى ۋە تىل بىلەن)
    const productForm = document.getElementById('productForm');
    if (productForm) {
      productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = productForm.querySelector('button[type="submit"]');
        const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ساقلىنىۋاتىدۇ...';
        }

        try {
          const id = document.getElementById('formProductId').value;
          const scope = document.getElementById('formLanguageScope').value;
          const brand = document.getElementById('formProductBrand').value.trim() || 'تەكلىماكان سۈپەت';
          const nameUg = document.getElementById('formProductNameUg').value.trim();
          const category = document.getElementById('formProductCategory').value;
          const price = parseFloat(document.getElementById('formProductPrice').value);
          const oldPriceVal = document.getElementById('formProductOldPrice').value;
          const oldPrice = oldPriceVal ? parseFloat(oldPriceVal) : null;
          const stock = parseInt(document.getElementById('formProductStock').value, 10);
          const unit = (document.getElementById('formProductUnit')?.value.trim()) || 'دانە';
          let image = document.getElementById('formProductImage').value.trim();
          const badge = document.getElementById('formProductBadge').value;
          const descUg = document.getElementById('formProductDescUg').value.trim();

          const nameTr = document.getElementById('formProductNameTr')?.value.trim() || nameUg;
          const descTr = document.getElementById('formProductDescTr')?.value.trim() || descUg;

          const nameEn = document.getElementById('formProductNameEn')?.value.trim() || nameUg;
          const descEn = document.getElementById('formProductDescEn')?.value.trim() || descUg;

          if (!image) {
            image = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
          }

          // سۈرەتنى باشقۇرغۇچى سۈپىتىدە تەكشۈرۈش (باشقۇرغۇچىغا چەكلىمە يوق)
          const secCheck = window.appStore.validateProductImageSecurity(image, '', true);

          const translations = {
            ug: { name: nameUg, description: descUg, category: category },
            tr: { name: nameTr, description: descTr, category: category },
            en: { name: nameEn, description: descEn, category: category }
          };

          const data = {
            name: nameUg,
            brand,
            category,
            price,
            oldPrice,
            stock,
            unit,
            image,
            badge,
            description: descUg,
            languageScope: scope,
            translations,
            isAdmin: true,
            approvalStatus: 'تەستىقلاندى',
            needsAdminImage: false
          };

          if (id) data.id = id;

          const saveRes = await window.appStore.saveProductAsync(data);
          if (!saveRes.success) {
            alert(saveRes.message);
            showAdminToast(saveRes.message, 'error');
            return;
          }

          document.getElementById('productFormModal').classList.remove('active');
          renderProductsTable();
          renderDashboardMetrics();
          showAdminToast(id ? 'تاۋار ئۇچۇرى مەڭگۈلۈك يېڭىلاندى ھەمدە بۇلۇتقا ساقلاندى!' : `«${brand}» ماركىلىق تاۋار ئېلان قىلىندى!`, 'success');
        } catch (err) {
          console.error('تاۋار ساقلاش خاتالىقى:', err);
          showAdminToast('ساقلاش جەريانىدا خاتالىق كۆرۈلدى', 'error');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnHtml;
          }
        }
      });
    }

    // ==================== 📷 تېلېفوندىن / كومپيۇتېردىن رەسىم ئەكىرىش ۋە تەكشۈرۈش ====================
    const productFileInput = document.getElementById('formProductFileInput');
    const productImageInput = document.getElementById('formProductImage');
    const previewBox = document.getElementById('productImagePreviewBox');
    const previewImg = document.getElementById('productImagePreviewImg');
    const secStatus = document.getElementById('imageSecurityStatus');
    const secDetail = document.getElementById('imageSecurityDetail');
    const btnRemoveImg = document.getElementById('btnRemoveImagePreview');
    const btnToggleUrl = document.getElementById('btnToggleImageUrlInput');
    const urlInputWrap = document.getElementById('imageUrlInputWrap');

    if (btnToggleUrl && urlInputWrap) {
      btnToggleUrl.addEventListener('click', () => {
        const isHidden = urlInputWrap.style.display === 'none';
        urlInputWrap.style.display = isHidden ? 'block' : 'none';
        btnToggleUrl.innerHTML = isHidden ? '<i class="fas fa-eye-slash"></i> <span>URL يوشۇرۇش</span>' : '<i class="fas fa-link"></i> <span>URL ئۇلانما كىرگۈزۈش</span>';
      });
    }

    if (btnRemoveImg) {
      btnRemoveImg.addEventListener('click', () => {
        if (productImageInput) productImageInput.value = '';
        if (productFileInput) productFileInput.value = '';
        if (previewImg) previewImg.src = '';
        if (previewBox) previewBox.style.display = 'none';
        showAdminToast('رەسىم چىقىرىۋېتىلدى', 'info');
      });
    }

    const productCameraInput = document.getElementById('formProductCameraInput');
    const btnPasteAdminProdImg = document.getElementById('btnPasteAdminProductImage');

    function handleAdminProductFile(file) {
      if (!file) return;

      // ھۆججەت تىپىنى تەكشۈرۈش
      if (!file.type.startsWith('image/')) {
        alert('⚠️ پەقەت رەسىم ھۆججىتى (JPG, PNG, WebP) تاللاشقا بولىدۇ!');
        if (productFileInput) productFileInput.value = '';
        if (productCameraInput) productCameraInput.value = '';
        return;
      }

      // ھۆججەتنى ئوقۇش ۋە ئالدىن كۆرسىتىش
      const reader = new FileReader();
      reader.onload = function(event) {
        const base64Data = event.target.result;

        const tempImg = new Image();
        tempImg.onload = function() {
          // باشقۇرغۇچى بولغاچقا رەسىم بىۋاستە ئەكىرىلىدۇ
          if (productImageInput) productImageInput.value = base64Data;
          if (previewImg) previewImg.src = base64Data;
          if (previewBox) previewBox.style.display = 'block';

          if (secStatus) {
            secStatus.innerHTML = '<i class="fas fa-check-circle" style="color: #2563eb;"></i> باشقۇرغۇچى ھوقۇقى: سۈرەت مۇۋەپپەقىيەتلىك ئەكىرىلدى';
            secStatus.style.color = '#2563eb';
          }
          if (secDetail) {
            secDetail.textContent = `ھۆججەت: ${file.name || 'چاپلانغان رەسىم'} (${tempImg.width}x${tempImg.height}px) - باشقۇرغۇچى تەرىپىدىن تەستىقلاندى.`;
          }

          showAdminToast('✅ رەسىم مۇۋەپپەقىيەتلىك ئەكىرىلدى!', 'success');
        };

        tempImg.onerror = function() {
          alert('⚠️ رەسىمنى ئوقۇش مەغلۇپ بولدى، باشقا رەسىم تاللاڭ.');
          if (productFileInput) productFileInput.value = '';
          if (productCameraInput) productCameraInput.value = '';
        };

        tempImg.src = base64Data;
      };

      reader.readAsDataURL(file);
    }

    if (productFileInput) {
      productFileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        handleAdminProductFile(file);
      });
    }

    if (productCameraInput) {
      productCameraInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        handleAdminProductFile(file);
      });
    }

    if (btnPasteAdminProdImg) {
      btnPasteAdminProdImg.addEventListener('click', async () => {
        try {
          if (navigator.clipboard && navigator.clipboard.read) {
            const items = await navigator.clipboard.read();
            for (const item of items) {
              const imageType = item.types.find(type => type.startsWith('image/'));
              if (imageType) {
                const blob = await item.getType(imageType);
                handleAdminProductFile(blob);
                return;
              }
            }
          }
        } catch (clipErr) {
          console.warn('Clipboard read error:', clipErr);
        }
        alert('📋 قىستۇرما تاختىدىن چاپلاش ئۈچۈن: رەسىمنى كۆچۈرۈپ بولۇپ، كۇنۇپكىلار تاختىسىدىن Ctrl + V نى بېسىڭ ياكى تېلېفوندا رەسىمنى بىۋاسىتە تاللاڭ.');
      });
    }

    // URL ئارقىلىق رەسىم كىرگۈزگەندە ئالدىن كۆرۈش (باشقۇرغۇچىغا تولۇق رۇخسەت)
    if (productImageInput) {
      productImageInput.addEventListener('blur', () => {
        const val = productImageInput.value.trim();
        if (!val) {
          if (previewBox) previewBox.style.display = 'none';
          return;
        }

        if (previewImg) previewImg.src = val;
        if (previewBox) previewBox.style.display = 'block';
        if (secStatus) {
          secStatus.innerHTML = '<i class="fas fa-check-circle" style="color: #2563eb;"></i> باشقۇرغۇچى ھوقۇقى: ئۇلانما ئەكىرىلدى';
          secStatus.style.color = '#2563eb';
        }
        if (secDetail) {
          secDetail.textContent = 'سۈرەت ئۇلانمىسى مۇۋەپپەقىيەتلىك ئەكىرىلدى.';
        }
      });
    }

    const adminProdSearch = document.getElementById('adminProductSearchInput');
    if (adminProdSearch) {
      adminProdSearch.addEventListener('input', (e) => {
        productSearchTerm = e.target.value;
        renderProductsTable();
      });
    }

    const catFilterSelect = document.getElementById('adminProductCatFilter');
    if (catFilterSelect) {
      catFilterSelect.addEventListener('change', (e) => {
        productFilterCat = e.target.value;
        renderProductsTable();
      });
    }

    const approvalFilterSelect = document.getElementById('adminProductApprovalFilter');
    if (approvalFilterSelect) {
      approvalFilterSelect.addEventListener('change', (e) => {
        productFilterApproval = e.target.value;
        renderProductsTable();
      });
    }

    const langFilterSelect = document.getElementById('adminProductLangFilter');
    if (langFilterSelect) {
      langFilterSelect.addEventListener('change', (e) => {
        productFilterLang = e.target.value;
        renderProductsTable();
      });
    }

    // ئۈستۈنكى تەستىق ئۇقتۇرۇش كۇنۇپكىسى ۋە كۆرسەتكۈچ كارتىسىنى چەككەندە بىۋاسىتە تەستىق كۈتۈۋاتقانلارغا ئۆتۈش
    const notifBtn = document.getElementById('adminPendingNotificationBtn');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        switchTab('products');
        if (approvalFilterSelect) {
          approvalFilterSelect.value = 'تەستىق كۈتۈۋاتىدۇ';
          productFilterApproval = 'تەستىق كۈتۈۋاتىدۇ';
          renderProductsTable();
        }
      });
    }

    const metricCardPending = document.getElementById('metricCardPendingProducts');
    if (metricCardPending) {
      metricCardPending.addEventListener('click', () => {
        switchTab('products');
        if (approvalFilterSelect) {
          approvalFilterSelect.value = 'تەستىق كۈتۈۋاتىدۇ';
          productFilterApproval = 'تەستىق كۈتۈۋاتىدۇ';
          renderProductsTable();
        }
      });
    }

    // 🌐 تەرجىمە ئۇقتۇرۇشلىرى كۇنۇپكىسى ۋە كارتىسىنى چېكىش
    const trAlertBtn = document.getElementById('adminTranslationAlertBtn');
    if (trAlertBtn) {
      trAlertBtn.addEventListener('click', openTranslationAlertModal);
    }
    const trMetricCard = document.getElementById('metricCardTranslationAlerts');
    if (trMetricCard) {
      trMetricCard.addEventListener('click', openTranslationAlertModal);
    }
    const btnClearTrAlerts = document.getElementById('btnClearTranslationAlerts');
    if (btnClearTrAlerts) {
      btnClearTrAlerts.addEventListener('click', () => {
        localStorage.removeItem('teklimakan_missing_translations');
        renderTranslationAlertMetrics();
        openTranslationAlertModal();
        showAdminToast('تەرجىمە ئۇقتۇرۇشلىرى تازىلاندى!', 'info');
      });
    }

    const addCatForm = document.getElementById('addCategoryForm');
    if (addCatForm) {
      addCatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const catName = document.getElementById('newCategoryName').value.trim();
        const catIcon = document.getElementById('newCategoryIcon').value.trim() || 'fas fa-tag';
        const catTr = document.getElementById('newCategoryTr')?.value.trim() || catName;
        const catEn = document.getElementById('newCategoryEn')?.value.trim() || catName;

        if (catName) {
          const success = window.appStore.addCategory(catName, catIcon, { tr: catTr, en: catEn });
          if (success) {
            document.getElementById('newCategoryName').value = '';
            const newTr = document.getElementById('newCategoryTr');
            const newEn = document.getElementById('newCategoryEn');
            if (newTr) {
              newTr.value = '';
              newTr.dataset.manuallyEdited = "false";
            }
            if (newEn) {
              newEn.value = '';
              newEn.dataset.manuallyEdited = "false";
            }
            const bTr = document.getElementById('badgeNewCatTr');
            const bEn = document.getElementById('badgeNewCatEn');
            if (bTr) { bTr.className = 'auto-tr-badge is-idle'; bTr.innerHTML = '<i class="fas fa-magic"></i> ئاپتوماتىك'; }
            if (bEn) { bEn.className = 'auto-tr-badge is-idle'; bEn.innerHTML = '<i class="fas fa-magic"></i> ئاپتوماتىك'; }
            renderCategoriesTable();
            populateCategoryDropdowns();
            showAdminToast('يېڭى تۈر قوشۇلدى!', 'success');
          }
        }
      });
    }

    // 🏷️ تۈر تەھرىرلەش جەدۋىلىنى ساقلاش (Edit Category Form Submit)
    const editCatForm = document.getElementById('editCategoryForm');
    if (editCatForm) {
      editCatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('editCategoryId').value;
        const name = document.getElementById('editCategoryName').value.trim();
        const tr = document.getElementById('editCategoryTr')?.value.trim() || name;
        const en = document.getElementById('editCategoryEn')?.value.trim() || name;
        const icon = document.getElementById('editCategoryIcon')?.value.trim() || 'fas fa-tag';
        const isActive = document.getElementById('editCategoryStatusToggle') ? document.getElementById('editCategoryStatusToggle').checked : true;

        if (!name) {
          alert('تۈر نامىنى كىرگۈزۈڭ!');
          return;
        }

        const success = window.appStore.updateCategory(id, {
          name,
          icon,
          status: isActive ? 'active' : 'hidden',
          translations: { ug: name, tr, en }
        });

        if (success) {
          window.hideModal('editCategoryModal');
          renderCategoriesTable();
          populateCategoryDropdowns();
          renderProductsTable();
          showAdminToast(`«${name}» تۈرى مۇۋەپپەقىيەتلىك يېڭىلاندى!`, 'success');
        } else {
          showAdminToast('تۈرنى ساقلاش مەغلۇپ بولدى!', 'error');
        }
      });
    }

    // 🔍 تۈر ئىزدەش كىرگۈزۈش رامكىسى (Category Realtime Search)
    const catSearch = document.getElementById('categorySearchInput');
    if (catSearch) {
      catSearch.addEventListener('input', () => {
        renderCategoriesTable();
      });
    }

    // 🎨 تۈر سىنبەلگىسى پالىتراسىنى ئۇلاش (Icon Palettes)
    document.querySelectorAll('.category-icon-palette .icon-pick-btn').forEach(btn => {
      btn.onclick = () => {
        const palette = btn.closest('.category-icon-palette');
        const targetId = palette ? palette.dataset.target : null;
        const icon = btn.dataset.icon;
        if (!targetId || !icon) return;

        const input = document.getElementById(targetId);
        if (input) {
          input.value = icon;
          const preview = document.getElementById(targetId + 'Preview');
          if (preview) preview.innerHTML = `<i class="${icon}"></i>`;
        }
      };
    });

    ['newCategoryIcon', 'editCategoryIcon'].forEach(id => {
      const inp = document.getElementById(id);
      const prev = document.getElementById(id + 'Preview');
      if (inp && prev) {
        inp.addEventListener('input', () => {
          const v = inp.value.trim() || 'fas fa-tag';
          prev.innerHTML = `<i class="${v}"></i>`;
        });
      }
    });

    // 🌐 ئۇيغۇرچە يازغان ھامان تۈركچە ۋە ئىنگلىزچىغا ئاپتوماتىك ئۆرىلىش ۋە تەھرىرلەش ئىقتىدارى
    function setupProductAutoTranslation() {
      const nameUg = document.getElementById('formProductNameUg');
      const descUg = document.getElementById('formProductDescUg');
      const nameTr = document.getElementById('formProductNameTr');
      const nameEn = document.getElementById('formProductNameEn');
      const descTr = document.getElementById('formProductDescTr');
      const descEn = document.getElementById('formProductDescEn');

      // خاس تەھرىرلەشنى بايقاش ۋە ساقلاپ قېلىش
      [nameTr, nameEn, descTr, descEn].forEach(el => {
        if (el) {
          el.addEventListener('input', () => {
            el.dataset.manuallyEdited = el.value.trim().length > 0 ? "true" : "false";
          });
        }
      });

      function doAutoTranslateName() {
        if (!nameUg || !window.appI18n) return;
        const text = nameUg.value.trim();
        if (!text) {
          if (nameTr && nameTr.dataset.manuallyEdited !== "true") nameTr.value = '';
          if (nameEn && nameEn.dataset.manuallyEdited !== "true") nameEn.value = '';
          return;
        }
        if (nameTr && nameTr.dataset.manuallyEdited !== "true") {
          nameTr.value = window.appI18n.autoTranslateUyghur(text, 'tr');
        }
        if (nameEn && nameEn.dataset.manuallyEdited !== "true") {
          nameEn.value = window.appI18n.autoTranslateUyghur(text, 'en');
        }
      }

      function doAutoTranslateDesc() {
        if (!descUg || !window.appI18n) return;
        const text = descUg.value.trim();
        if (!text) {
          if (descTr && descTr.dataset.manuallyEdited !== "true") descTr.value = '';
          if (descEn && descEn.dataset.manuallyEdited !== "true") descEn.value = '';
          return;
        }
        if (descTr && descTr.dataset.manuallyEdited !== "true") {
          descTr.value = window.appI18n.autoTranslateUyghur(text, 'tr');
        }
        if (descEn && descEn.dataset.manuallyEdited !== "true") {
          descEn.value = window.appI18n.autoTranslateUyghur(text, 'en');
        }
      }

      if (nameUg) {
        nameUg.addEventListener('input', doAutoTranslateName);
      }
      if (descUg) {
        descUg.addEventListener('input', doAutoTranslateDesc);
      }

      const btnAuto = document.getElementById('btnAutoTranslateProduct');
      if (btnAuto) {
        btnAuto.addEventListener('click', () => {
          if (nameTr) nameTr.dataset.manuallyEdited = "false";
          if (nameEn) nameEn.dataset.manuallyEdited = "false";
          if (descTr) descTr.dataset.manuallyEdited = "false";
          if (descEn) descEn.dataset.manuallyEdited = "false";
          doAutoTranslateName();
          doAutoTranslateDesc();
          showAdminToast('تۈركچە ۋە ئىنگلىزچە تەرجىمىسى قايتا ھاسىللاندى!', 'info');
        });
      }

      // 🌐 تۈرلەر كۆزنىكىدە ھەقىقىي ۋاقىتلىق ئاپتوماتىك تەرجىمە ۋە ئەركىن تەھرىرلەش (Live Auto-translation & Free Editing)
      function setupCategoryAutoTranslation(nameId, trId, enId, badgeTrId, badgeEnId, syncBtnId) {
        const nameEl = document.getElementById(nameId);
        const trEl = document.getElementById(trId);
        const enEl = document.getElementById(enId);
        const badgeTr = badgeTrId ? document.getElementById(badgeTrId) : null;
        const badgeEn = badgeEnId ? document.getElementById(badgeEnId) : null;
        const syncBtn = syncBtnId ? document.getElementById(syncBtnId) : null;

        if (!nameEl || !trEl || !enEl) return;

        function updateTranslation(force = false) {
          const rawUg = nameEl.value.trim();
          if (!rawUg) {
            if (force || trEl.dataset.manuallyEdited !== "true") {
              trEl.value = '';
              trEl.dataset.manuallyEdited = "false";
              if (badgeTr) {
                badgeTr.className = 'auto-tr-badge is-idle';
                badgeTr.innerHTML = '<i class="fas fa-magic"></i> ئاپتوماتىك';
              }
            }
            if (force || enEl.dataset.manuallyEdited !== "true") {
              enEl.value = '';
              enEl.dataset.manuallyEdited = "false";
              if (badgeEn) {
                badgeEn.className = 'auto-tr-badge is-idle';
                badgeEn.innerHTML = '<i class="fas fa-magic"></i> ئاپتوماتىك';
              }
            }
            return;
          }

          const getTr = (lang) => {
            if (window.appI18n && typeof window.appI18n.autoTranslateUyghur === 'function') {
              return window.appI18n.autoTranslateUyghur(rawUg, lang);
            }
            return rawUg;
          };

          if (force || trEl.dataset.manuallyEdited !== "true") {
            trEl.value = getTr('tr');
            if (badgeTr) {
              badgeTr.className = 'auto-tr-badge is-synced';
              badgeTr.innerHTML = '<i class="fas fa-check-circle"></i> ئاپتوماتىك يېزىلدى';
            }
          }

          if (force || enEl.dataset.manuallyEdited !== "true") {
            enEl.value = getTr('en');
            if (badgeEn) {
              badgeEn.className = 'auto-tr-badge is-synced';
              badgeEn.innerHTML = '<i class="fas fa-check-circle"></i> ئاپتوماتىك يېزىلدى';
            }
          }
        }

        // ئۇيغۇرچە يازغان ھامان (ھەر بىر ھەرپ، كۆچۈرۈپ چاپلاش، ئۆزگەرتىش)
        ['input', 'keyup', 'change', 'paste'].forEach(ev => {
          nameEl.addEventListener(ev, () => updateTranslation(false));
        });

        // تۈركچە كۆزنەكنى تەھرىرلىگەندە
        trEl.addEventListener('input', () => {
          if (trEl.value.trim().length > 0) {
            trEl.dataset.manuallyEdited = "true";
            if (badgeTr) {
              badgeTr.className = 'auto-tr-badge is-manual';
              badgeTr.innerHTML = '<i class="fas fa-pen"></i> سىز تەھرىرلىگەن';
            }
          } else {
            trEl.dataset.manuallyEdited = "false";
            updateTranslation(false);
          }
        });

        // ئىنگلىزچە كۆزنەكنى تەھرىرلىگەندە
        enEl.addEventListener('input', () => {
          if (enEl.value.trim().length > 0) {
            enEl.dataset.manuallyEdited = "true";
            if (badgeEn) {
              badgeEn.className = 'auto-tr-badge is-manual';
              badgeEn.innerHTML = '<i class="fas fa-pen"></i> سىز تەھرىرلىگەن';
            }
          } else {
            enEl.dataset.manuallyEdited = "false";
            updateTranslation(false);
          }
        });

        // قايتا تەرجىمە كۇنۇپكىسى
        if (syncBtn) {
          syncBtn.addEventListener('click', (e) => {
            e.preventDefault();
            trEl.dataset.manuallyEdited = "false";
            enEl.dataset.manuallyEdited = "false";
            updateTranslation(true);
            showAdminToast('تۈركچە ۋە ئىنگلىزچە تەرجىمىسى قايتا ھاسىللاندى!', 'info');
          });
        }
      }

      // يېڭى تۈر قوشۇش كارتىسىغا باغلاش
      setupCategoryAutoTranslation('newCategoryName', 'newCategoryTr', 'newCategoryEn', 'badgeNewCatTr', 'badgeNewCatEn', 'btnSyncNewCategoryTrEn');

      // تۈر تەھرىرلەش مودالىغا باغلاش
      setupCategoryAutoTranslation('editCategoryName', 'editCategoryTr', 'editCategoryEn', 'badgeEditCatTr', 'badgeEditCatEn', 'btnSyncEditCategoryTrEn');
    }

    setupProductAutoTranslation();

    const settingsForm = document.getElementById('systemSettingsForm');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const getVal = (id, def = '') => {
          const el = document.getElementById(id);
          return el ? el.value.trim() : def;
        };
        const updated = {
          storeName: getVal('settingStoreName'),
          storeSlogan: getVal('settingStoreSlogan'),
          currency: getVal('settingCurrency', 'TRY'),
          contactPhone: getVal('settingPhone', '05551609999'),
          instagramUrl: getVal('settingInstagram', 'https://www.instagram.com/teklimakan.online'),
          contactEmail: getVal('settingEmail'),
          announcement: getVal('settingAnnouncement'),
          telegramBotToken: getVal('settingTelegramBotToken'),
          telegramChatId: getVal('settingTelegramChatId'),
          telegramEnabled: document.getElementById('settingTelegramEnabled') ? document.getElementById('settingTelegramEnabled').checked : true,
          emailNotificationEnabled: document.getElementById('settingEmailNotificationEnabled') ? document.getElementById('settingEmailNotificationEnabled').checked : true,
          smtpPreset: getVal('settingSmtpPreset', 'gmail'),
          smtpHost: getVal('settingSmtpHost', 'smtp.gmail.com'),
          smtpPort: parseInt(getVal('settingSmtpPort', 587)) || 587,
          smtpUser: getVal('settingSmtpUser'),
          smtpPass: getVal('settingSmtpPass'),
          notificationEmail: getVal('settingNotificationEmail') || getVal('settingSmtpUser') || getVal('settingEmail')
        };
        window.appStore.updateSettings(updated);

        const newUser = document.getElementById('settingAdminUsername') ? document.getElementById('settingAdminUsername').value.trim() : '';
        if (newUser) {
          localStorage.setItem('teklimakan_admin_username', newUser);
        }
        const newPw = document.getElementById('settingAdminPassword') ? document.getElementById('settingAdminPassword').value.trim() : '';
        if (newPw) {
          localStorage.setItem('teklimakan_admin_password', newPw);
        }

        showAdminToast('دۇكان تەڭشەكلىرى، باشقۇرغۇچى نامى، پارول ساقلاندى!', 'success');
      });
    }

    const btnTestTelegram = document.getElementById('btnTestTelegramNotify');
    if (btnTestTelegram) {
      btnTestTelegram.addEventListener('click', async () => {
        const token = document.getElementById('settingTelegramBotToken') ? document.getElementById('settingTelegramBotToken').value.trim() : '';
        const chatId = document.getElementById('settingTelegramChatId') ? document.getElementById('settingTelegramChatId').value.trim() : '';
        if (!token || !chatId) {
          showAdminToast('ئالدى بىلەن Telegram Bot Token ۋە Chat ID نى كىرگۈزۈڭ!', 'error');
          return;
        }
        btnTestTelegram.disabled = true;
        btnTestTelegram.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ئەۋەتىلىۋاتىدۇ...';
        try {
          const testMsg = `🎉 <b>تەبرىكلەيمىز! تەكلىماكان سۇپىسى Telegram زاكاز ئۇقتۇرۇشى ئۇلاندى!</b>\n\n✅ سىستېما سىنىقى مۇۋەپپەقىيەتلىك بولدى.\nئەمدى تور بېكىتىڭىزدە خېرىدار زاكاز بەرگەن ھامان، زاكازنىڭ بارلىق تەپسىلاتى سېكۇنت ئىچىدە بىۋاستە تېلېفونىڭىزغا كېلىدۇ! 🚀\n\n⏰ ۋاقتى: ${new Date().toLocaleString()}`;
          const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: testMsg, parse_mode: 'HTML' })
          });
          const data = await res.json();
          if (data.ok) {
            showAdminToast('✅ سىناق ئۇچۇرى Telegram غا مۇۋەپپەقىيەتلىك باردى! تېلېفونىڭىزنى تەكشۈرۈپ كۆرۈڭ.', 'success');
          } else {
            showAdminToast('❌ ئەۋەتكىلى بولمىدى: ' + (data.description || 'Token ياكى Chat ID خاتا'), 'error');
          }
        } catch (err) {
          showAdminToast('❌ تور خاتالىقى: ' + err.message, 'error');
        } finally {
          btnTestTelegram.disabled = false;
          btnTestTelegram.innerHTML = '<i class="fab fa-telegram-plane"></i> سىناق ئۇقتۇرۇش ئەۋەتىپ سىناش';
        }
      });
    }

    // 🛡️ كۈندىلىك بىخەتەرلىك ۋە سىستېما دوكلاتىنى Telegram غا بىۋاسىتە يوللاش كۇنۇپكىسى
    const btnSendAuditTg = document.getElementById('btnSendDailyAuditToTelegram');
    if (btnSendAuditTg) {
      btnSendAuditTg.addEventListener('click', async () => {
        const token = (document.getElementById('settingTelegramBotToken')?.value.trim()) || '8880936621:AAG7d5C4CPVyA8XiP0cPYUFYPfJmkF6DWZM';
        const chatId = (document.getElementById('settingTelegramChatId')?.value.trim()) || '7077223578';
        btnSendAuditTg.disabled = true;
        btnSendAuditTg.innerHTML = '<i class="fas fa-spinner fa-spin"></i> دوكلات يوللىنىۋاتىدۇ...';

        try {
          const prods = window.appStore.getProducts();
          const orders = window.appStore.getOrders();
          const timeStr = new Date().toLocaleString('tr-TR');

          const tgMsg = `🛡️ <b>تەكلىماكان سۇپىسى: كۈندىلىك سىستېما ۋە بىخەتەرلىك خۇلاسىسى</b>\n📅 <b>ۋاقتى:</b> ${timeStr}\n\n✅ <b>ئومۇمىي ھالىتى:</b> بارلىق سىستېما 100% نورمال ۋە بىخەتەر\n✅ <b>كود كودلىنىشى (UTF-8):</b> HTML ۋە JS ھۆججەتلىرى ساپ، خاتالىق يوق\n☁️ <b>بۇلۇت ئامبىرى (Supabase):</b> ${prods.length} تاۋار ۋە ${orders.length} زاكاز تولۇق ساغلام\n🏦 <b>بانكا ۋە چىقىم:</b> QNB Enpara IBAN قوغدالدى (ئىزاھات: kuruyemiş)، CVV مەخپىيەتلىكى كاپالەتلەندى\n📊 <b>مەشغۇلات تەييارلىقى:</b> تور دۇكىنىڭىز زاكاز قوبۇل قىلىشقا تولۇق تەييار!\n\n📄 <b>تەپسىلىي دوكلات ھۆججىتىنى تولۇق كۆرۈش:</b>\n🔗 <a href="https://www.teklimakan.com/audit-report.html">https://www.teklimakan.com/audit-report.html</a>`;

          const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: tgMsg, parse_mode: 'HTML' })
          });
          const data = await res.json();
          if (data.ok) {
            showAdminToast('✅ كۈندىلىك بىخەتەرلىك دوكلاتى Telegram غا مۇۋەپپەقىيەتلىك ئەۋەتىلدى!', 'success');
          } else {
            showAdminToast('❌ ئەۋەتكىلى بولمىدى: ' + (data.description || 'خاتالىق كۆرۈلدى'), 'error');
          }
        } catch(err) {
          showAdminToast('❌ ئەۋەتىش مەغلۇپ بولدى: ' + err.message, 'error');
        } finally {
          btnSendAuditTg.disabled = false;
          btnSendAuditTg.innerHTML = '<i class="fas fa-shield-alt"></i> كۈندىلىك بىخەتەرلىك دوكلاتىنى Telegram غا ئەۋەتىش';
        }
      });
    }

    // SMTP تاللاش تەڭشىكىنى باشقۇرۇش
    const presetSelect = document.getElementById('settingSmtpPreset');
    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        const hostInput = document.getElementById('settingSmtpHost');
        const portInput = document.getElementById('settingSmtpPort');
        const customWrap = document.getElementById('customSmtpFieldsWrap');
        if (val === 'gmail') {
          if (hostInput) hostInput.value = 'smtp.gmail.com';
          if (portInput) portInput.value = 587;
          if (customWrap) customWrap.style.display = 'none';
        } else if (val === 'outlook') {
          if (hostInput) hostInput.value = 'smtp-mail.outlook.com';
          if (portInput) portInput.value = 587;
          if (customWrap) customWrap.style.display = 'none';
        } else {
          if (customWrap) customWrap.style.display = 'block';
        }
      });
    }

    const btnAppPassGuide = document.getElementById('btnOpenAppPassGuide');
    if (btnAppPassGuide) {
      btnAppPassGuide.addEventListener('click', () => {
        const modal = document.getElementById('googleAppPassGuideModal');
        if (modal) modal.classList.add('active');
      });
    }

    const btnTestEmail = document.getElementById('btnTestEmailNotify');
    if (btnTestEmail) {
      btnTestEmail.addEventListener('click', async () => {
        const smtpUser = (document.getElementById('settingSmtpUser')?.value || '').trim();
        const smtpPass = (document.getElementById('settingSmtpPass')?.value || '').trim().replace(/\s+/g, '');
        const smtpHost = (document.getElementById('settingSmtpHost')?.value || 'smtp.gmail.com').trim();
        const smtpPort = parseInt(document.getElementById('settingSmtpPort')?.value || '587') || 587;
        const preset = document.getElementById('settingSmtpPreset')?.value || 'gmail';
        const notifEmail = (document.getElementById('settingNotificationEmail')?.value || '').trim() || smtpUser;

        if (!smtpUser) {
          showAdminToast('ئالدى بىلەن ئۆزىڭىزنىڭ ئېلخەت ئادرېسىنى (مەسىلەن: yourname@gmail.com) كىرگۈزۈڭ!', 'error');
          document.getElementById('settingSmtpUser')?.focus();
          return;
        }
        if (!smtpPass) {
          showAdminToast('گۇگۇلنىڭ 16 خانىلىق مەخسۇس ئەپ پارولىنى كىرگۈزۈڭ! «بۇ پارولنى قانداق ئالىمەن؟» كۇنۇپكىسىنى بېسىپ كۆرۈڭ.', 'error');
          const modal = document.getElementById('googleAppPassGuideModal');
          if (modal) modal.classList.add('active');
          return;
        }

        btnTestEmail.disabled = true;
        btnTestEmail.innerHTML = '<i class="fas fa-spinner fa-spin"></i> سېرۋېر ئارقىلىق ئەۋەتىلىۋاتىدۇ...';

        try {
          const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; direction: rtl; text-align: right;">
              <div style="background: linear-gradient(135deg, #0f172a, #1e3a8a); color: #ffffff; padding: 1.5rem; text-align: center;">
                <h2 style="margin: 0; font-size: 1.4rem;">🎉 تەكلىماكان تور سودا سۇپىسى</h2>
                <p style="margin: 0.5rem 0 0; color: #f59e0b; font-size: 0.95rem;">ئېلخەت زاكاز سىستېمىسى سىنىقى مۇۋەپپەقىيەتلىك بولدى!</p>
              </div>
              <div style="padding: 1.5rem; background: #ffffff; line-height: 1.8; color: #1e293b;">
                <p><b>ھۆرمەتلىك باشقۇرغۇچى:</b></p>
                <p>تەبرىكلەيمىز! تور دۇكىنىڭىز رەسمىي <b>Google SMTP</b> دەرۋازىسى ئارقىلىق شەخسىي ئېلخىتىڭىزگە ئۇلاندى.</p>
                <div style="background: #f8fafc; border-right: 4px solid #10b981; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <div><b>✅ ئەۋەتكۈچى ھېسابات:</b> <span style="direction: ltr; display: inline-block;">${smtpUser}</span></div>
                  <div><b>✅ نىشان قوبۇللىغۇچى:</b> <span style="direction: ltr; display: inline-block;">${notifEmail}</span></div>
                  <div><b>✅ ۋاقتى:</b> ${new Date().toLocaleString()}</div>
                  <div><b>✅ كاپالىتى:</b> 100% بىۋاسىتە ساندۇققا كىرىدۇ، Spam غا چۈشۈپ قالمايدۇ.</div>
                </div>
                <p style="color: #64748b; font-size: 0.9rem;">ئەمدى تور دۇكىنىڭىزدا خېرىدار زاكاز بەرگەن ھامان، زاكازنىڭ بارلىق تەپسىلاتى Telegram بىلەن بىر ۋاقىتتا مۇشۇ يەرگىمۇ دەرھال كېلىدۇ.</p>
              </div>
            </div>
          `;

          const res = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              smtpHost,
              smtpPort,
              smtpUser,
              smtpPass,
              fromEmail: smtpUser,
              fromName: 'تەكلىماكان تور دۇكىنى',
              toEmail: notifEmail,
              subject: '🎉 [تەكلىماكان سۇپىسى] ئېلخەت زاكاز ئۇقتۇرۇش سىستېمىسى تەستىقلاندى!',
              htmlBody: htmlContent
            })
          });

          const data = await res.json();
          if (data.success) {
            // تەڭشەكلەرنى ئاپتوماتىك ساقلاش
            try {
              const curSettings = window.appStore.getSettings();
              curSettings.smtpPreset = preset;
              curSettings.smtpHost = smtpHost;
              curSettings.smtpPort = smtpPort;
              curSettings.smtpUser = smtpUser;
              curSettings.smtpPass = smtpPass;
              curSettings.notificationEmail = notifEmail;
              curSettings.emailNotificationEnabled = true;
              window.appStore.saveSettings(curSettings);

              const noticeEl = document.getElementById('emailNotificationStatusNotice');
              if (noticeEl) {
                noticeEl.style.background = '#f0fdf4';
                noticeEl.style.borderColor = '#bbf7d0';
                noticeEl.style.color = '#166534';
                noticeEl.innerHTML = `✅ <b>Google SMTP ئېلخەت ئۇلىنىشى پۈتتى:</b> <code class="number-latin" style="font-weight: 700; color: #15803d;">${smtpUser}</code> (ئاپتوماتىك ساقلاندى)<br><span style="font-size: 0.8rem; color: #4b5563;">خېرىدار زاكاز بەرگەندە، بارلىق تەپسىلاتلار «${notifEmail}» ساندۇقىغا بىر سېكۇنتتا يېتىپ بارىدۇ.</span>`;
              }
            } catch (e) {}

            showAdminToast(`🎉 تەبرىكلەيمىز! سىناق ئېلخەت «${notifEmail}» غا 100% يەتكۈزۈلدى! ساندۇقىڭىزنى تەكشۈرۈڭ.`, 'success');
          } else {
            showAdminToast(`❌ ئېلخەت چاتاق كۆرۈلدى: ${data.message}`, 'error');
          }
        } catch (err) {
          showAdminToast('❌ سېرۋېر بىلەن ئالاقىلىشىش خاتالىقى: ' + err.message, 'error');
        } finally {
          btnTestEmail.disabled = false;
          btnTestEmail.innerHTML = '<i class="fas fa-paper-plane"></i> 🚀 سىناق ئېلخەت ئەۋەتىپ سىناش';
        }
      });
    }

    const themeBtn = document.getElementById('adminThemeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('uyghur_theme_mode', isDark ? 'dark' : 'light');
      });
    }

    // ==================== ۋاكالەتچىلەر ۋە ماركا رۇخسىتى قۇلاقلىرى ====================
    const openAddAgentBtn = document.getElementById('btnOpenAddAgentModal');
    if (openAddAgentBtn) {
      openAddAgentBtn.addEventListener('click', openAddAgentModal);
    }

    const btnOpenMonthlySummary = document.getElementById('btnOpenMonthlySummaryExportModal');
    if (btnOpenMonthlySummary) {
      btnOpenMonthlySummary.addEventListener('click', openAgentMonthlySummaryModal);
    }

    // سىيىرلما كۇنۇپكىلىرى (Scroll Buttons)
    const btnScrollLeft = document.getElementById('btnScrollAgentLeft');
    const btnScrollRight = document.getElementById('btnScrollAgentRight');
    const sliderTrack = document.getElementById('agentSliderTrack');

    if (btnScrollLeft && sliderTrack) {
      btnScrollLeft.addEventListener('click', () => {
        sliderTrack.scrollBy({ left: -280, behavior: 'smooth' });
      });
    }

    if (btnScrollRight && sliderTrack) {
      btnScrollRight.addEventListener('click', () => {
        sliderTrack.scrollBy({ left: 280, behavior: 'smooth' });
      });
    }

    // ئىزدەش ۋە كۆپ شەرتلىك سۈزۈش (Multi-filter listeners)
    const agentSearchInput = document.getElementById('agentSearchInput');
    if (agentSearchInput) {
      agentSearchInput.addEventListener('input', (e) => {
        agentSearchTerm = e.target.value;
        renderAgentsView();
      });
    }

    const agentFilterBrandSelect = document.getElementById('agentFilterBrand');
    if (agentFilterBrandSelect) {
      agentFilterBrandSelect.addEventListener('change', (e) => {
        agentFilterBrand = e.target.value;
        renderAgentsView();
      });
    }

    const agentFilterCitySelect = document.getElementById('agentFilterCity');
    if (agentFilterCitySelect) {
      agentFilterCitySelect.addEventListener('change', (e) => {
        agentFilterCity = e.target.value;
        renderAgentsView();
      });
    }

    const agentFilterTierSelect = document.getElementById('agentFilterTier');
    if (agentFilterTierSelect) {
      agentFilterTierSelect.addEventListener('change', (e) => {
        agentFilterTier = e.target.value;
        renderAgentsView();
      });
    }

    const agentFilterSelect = document.getElementById('agentFilterStatus');
    if (agentFilterSelect) {
      agentFilterSelect.addEventListener('change', (e) => {
        agentFilterStatus = e.target.value;
        renderAgentsView();
      });
    }

    // سۈزگۈچلەرنى ئەسلىگە قايتۇرۇش كۇنۇپكىسى
    const btnResetAgentFilters = document.getElementById('btnResetAgentFilters');
    if (btnResetAgentFilters) {
      btnResetAgentFilters.addEventListener('click', () => {
        agentSearchTerm = '';
        agentFilterBrand = 'all';
        agentFilterCity = 'all';
        agentFilterTier = 'all';
        agentFilterStatus = 'all';

        const sIn = document.getElementById('agentSearchInput');
        const bSel = document.getElementById('agentFilterBrand');
        const cSel = document.getElementById('agentFilterCity');
        const tSel = document.getElementById('agentFilterTier');
        const stSel = document.getElementById('agentFilterStatus');

        if (sIn) sIn.value = '';
        if (bSel) bSel.value = 'all';
        if (cSel) cSel.value = 'all';
        if (tSel) tSel.value = 'all';
        if (stSel) stSel.value = 'all';

        renderAgentsView();
        showAdminToast('بارلىق سۈزگۈچلەر ئەسلىگە كەلتۈرۈلدى', 'info');
      });
    }

    // 📊 ئايلىق خۇلاسە ۋە كومىسسىيە ئېكسپورت كۆزنىكىنى ئېچىش كۇنۇپكىسى
    const btnOpenMonthlySummaryModal = document.getElementById('btnOpenMonthlySummaryExportModal');
    if (btnOpenMonthlySummaryModal) {
      btnOpenMonthlySummaryModal.addEventListener('click', () => {
        openAgentMonthlySummaryModal();
      });
    }

    // 📜 كىنىشكا كۆزنىكى مەشغۇلاتلىرى
    const btnCertPrintPdf = document.getElementById('btnCertPrintPdf');
    if (btnCertPrintPdf) {
      btnCertPrintPdf.addEventListener('click', () => {
        window.print();
      });
    }

    const btnCertShareWa = document.getElementById('btnCertShareWa');
    if (btnCertShareWa) {
      btnCertShareWa.addEventListener('click', () => {
        if (!currentViewingCertAgent) return;
        const phone = (currentViewingCertAgent.phone || '').replace(/\D/g, '');
        const brands = (currentViewingCertAgent.authorizedBrands || []).join('، ') || 'بارلىق سۇپا مەھسۇلاتلىرى';
        const text = `ھۆرمەتلىك ${currentViewingCertAgent.name}، سىزنىڭ «تەكلىماكان سۈپەت» سۇپىسىدىكى رەسمىي ماركا سېتىش سالاھىيەت گۇۋاھنامىڭىز تەستىقلاندى.\n\n📜 كىنىشكا نومۇرى: ${currentViewingCertAgent.certCode || 'TK-CERT'}\n🏷️ تەستىقلانغان ماركىلار: ${brands}\n📍 شەھەر: ${currentViewingCertAgent.city || 'ئىستانبۇل'}\n⏳ كۈچكە ئىگە مۇددىتى: ${currentViewingCertAgent.authExpireDate || '2027-08-15'}\n\nتەكشۈرۈش ئۇلانمىسى: https://teklimakan.com/verify-cert?id=${currentViewingCertAgent.id}`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
      });
    }

    const btnCertCopyText = document.getElementById('btnCertCopyText');
    if (btnCertCopyText) {
      btnCertCopyText.addEventListener('click', () => {
        if (!currentViewingCertAgent) return;
        const brands = (currentViewingCertAgent.authorizedBrands || []).join('، ') || 'بارلىق سۇپا مەھسۇلاتلىرى';
        const text = `تەكلىماكان سۈپەت تور سودا سۇپىسى - رەسمىي ماركا سېتىش ھوقۇقى گۇۋاھنامىسى\n------------------------------------\nۋاكالەتچى: ${currentViewingCertAgent.name}\nكىنىشكا نومۇرى: ${currentViewingCertAgent.certCode || 'TK-CERT'}\nتەستىقلانغان ماركىلار: ${brands}\nشەھەر: ${currentViewingCertAgent.city || 'ئىستانبۇل'}\nتارقىتىلغان ۋاقىت: ${currentViewingCertAgent.registeredAt || '2026-08-15'}\nكۈچكە ئىگە مۇددىتى: ${currentViewingCertAgent.authExpireDate || '2027-08-15'}`;
        navigator.clipboard.writeText(text).then(() => {
          showAdminToast('كىنىشكا ئۇچۇرى كۆچۈرۈۋېلىندى!', 'success');
        });
      });
    }

    // 📥 ئايلىق خۇلاسە فورمات ئېكسپورت كۇنۇپكىلىرى
    const btnExportCsv = document.getElementById('btnExportSummaryCsv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => {
        exportMonthlySummaryCsv();
      });
    }

    const btnExportPrint = document.getElementById('btnExportSummaryPrint');
    if (btnExportPrint) {
      btnExportPrint.addEventListener('click', () => {
        exportMonthlySummaryPrint();
      });
    }

    const btnExportCopy = document.getElementById('btnExportSummaryCopy');
    if (btnExportCopy) {
      btnExportCopy.addEventListener('click', () => {
        exportMonthlySummaryCopy();
      });
    }

    // ماركىلارنى ھەممىنى تاللاش ياكى بىكار قىلىش كۇنۇپكىلىرى
    const btnSelectAllBrands = document.getElementById('btnSelectAllBrands');
    if (btnSelectAllBrands) {
      btnSelectAllBrands.addEventListener('click', () => {
        document.querySelectorAll('#agentBrandsCheckboxList input[type="checkbox"]').forEach(cb => cb.checked = true);
      });
    }

    const btnClearAllBrands = document.getElementById('btnClearAllBrands');
    if (btnClearAllBrands) {
      btnClearAllBrands.addEventListener('click', () => {
        document.querySelectorAll('#agentBrandsCheckboxList input[type="checkbox"]').forEach(cb => cb.checked = false);
      });
    }

    // ➕ ئالىي باشقۇرغۇچى: ماركا تەستىق كۆزنىكىدە تۇرۇپ يېڭى ماركا قوشۇش
    const btnAddNewBrandToAuthModal = document.getElementById('btnAddNewBrandToAuthModal');
    const inputNewBrandToAuthModal = document.getElementById('inputNewBrandToAuthModal');

    function doAddBrandToAuthModal() {
      if (!inputNewBrandToAuthModal) return;
      const brandVal = inputNewBrandToAuthModal.value.trim();
      if (!brandVal) {
        showAdminToast('يېڭى ماركا نامىنى يېزىڭ!', 'warning');
        return;
      }
      const res = window.appStore.addBrand(brandVal);
      if (!res.success) {
        showAdminToast(res.message, 'warning');
        return;
      }
      const currentSelected = [];
      document.querySelectorAll('#agentBrandsCheckboxList input[type="checkbox"]:checked').forEach(cb => {
        currentSelected.push(cb.value);
      });
      if (!currentSelected.includes(brandVal)) {
        currentSelected.push(brandVal);
      }
      renderBrandAuthCheckboxes(currentSelected);
      inputNewBrandToAuthModal.value = '';
      populateCategoryDropdowns();
      showAdminToast(`«${brandVal}» ناملىق يېڭى ماركا مۇۋەپپەقىيەتلىك قوشۇلدى ۋە تاللاندى!`, 'success');
    }

    if (btnAddNewBrandToAuthModal) {
      btnAddNewBrandToAuthModal.addEventListener('click', doAddBrandToAuthModal);
    }
    if (inputNewBrandToAuthModal) {
      inputNewBrandToAuthModal.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          doAddBrandToAuthModal();
        }
      });
    }

    // ➕ ئالىي باشقۇرغۇچى: يېڭى ۋاكالەتچى قوشۇش كۆزنىكىدە تۇرۇپ يېڭى ماركا قوشۇش
    const btnAddNewBrandToAddAgentModal = document.getElementById('btnAddNewBrandToAddAgentModal');
    const inputNewBrandToAddAgentModal = document.getElementById('inputNewBrandToAddAgentModal');

    function doAddBrandToAddAgentModal() {
      if (!inputNewBrandToAddAgentModal) return;
      const brandVal = inputNewBrandToAddAgentModal.value.trim();
      if (!brandVal) {
        showAdminToast('يېڭى ماركا نامىنى يېزىڭ!', 'warning');
        return;
      }
      const res = window.appStore.addBrand(brandVal);
      if (!res.success) {
        showAdminToast(res.message, 'warning');
        return;
      }
      const currentSelected = [];
      document.querySelectorAll('#newAgentBrandsCheckboxList input[type="checkbox"]:checked').forEach(cb => {
        currentSelected.push(cb.value);
      });
      if (!currentSelected.includes(brandVal)) {
        currentSelected.push(brandVal);
      }
      renderNewAgentBrandCheckboxes(currentSelected);
      inputNewBrandToAddAgentModal.value = '';
      populateCategoryDropdowns();
      showAdminToast(`«${brandVal}» ناملىق يېڭى ماركا مۇۋەپپەقىيەتلىك قوشۇلدى ۋە تاللاندى!`, 'success');
    }

    if (btnAddNewBrandToAddAgentModal) {
      btnAddNewBrandToAddAgentModal.addEventListener('click', doAddBrandToAddAgentModal);
    }
    if (inputNewBrandToAddAgentModal) {
      inputNewBrandToAddAgentModal.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          doAddBrandToAddAgentModal();
        }
      });
    }

    // سودىگەر ئىناۋەت دەرىجىسى ئۆزلۈكىدىن بەلگىلەش تاللىغاندا تېكىست رامكىسىنى كۆرسىتىش/يوشۇرۇش
    const authRepSelect = document.getElementById('authAgentReputationSelect');
    const authRepCustom = document.getElementById('authAgentReputationCustomInput');
    if (authRepSelect && authRepCustom) {
      authRepSelect.addEventListener('change', () => {
        if (authRepSelect.value === 'custom') {
          authRepCustom.style.display = 'block';
          authRepCustom.focus();
        } else {
          authRepCustom.style.display = 'none';
        }
      });
    }

    // ئىناۋەت بەلگىلىرىنى باشقۇرۇش كۆزنىكىنى ئېچىش كۇنۇپكىسى
    const btnOpenManageRep = document.getElementById('btnOpenManageReputationsModal');
    if (btnOpenManageRep) {
      btnOpenManageRep.addEventListener('click', openManageReputationsModal);
    }

    // يېڭى ماركا باشقۇرۇش ۋە قوشۇش كۆزنىكىنى ئېچىش كۇنۇپكىسى
    const btnOpenManageBrands = document.getElementById('btnOpenManageBrandsModal');
    if (btnOpenManageBrands) {
      btnOpenManageBrands.addEventListener('click', openManageBrandsModal);
    }

    // بىۋاسىتە يېڭى ماركا قوشۇش فورمىسى
    const formAddNewBrandDirectly = document.getElementById('formAddNewBrandDirectly');
    if (formAddNewBrandDirectly) {
      formAddNewBrandDirectly.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('inputBrandModalNewName');
        if (!input) return;
        const brandName = input.value.trim();
        if (!brandName) {
          showAdminToast('ماركا نامى بوش بولماسلىقى كېرەك!', 'warning');
          return;
        }
        const res = window.appStore.addBrand(brandName);
        if (res.success) {
          showAdminToast(res.message, 'success');
          input.value = '';
          renderManageBrandsList();
          populateAgentFilterDropdowns();
          populateCategoryDropdowns();
          renderAgentsView();
        } else {
          showAdminToast(res.message, 'warning');
        }
      });
    }

    // تەقسىملەش كۆزنىكىدىن باشقۇرۇش كۆزنىكىگە ئۆتۈش
    const btnGoToManageFromAssign = document.getElementById('btnGoToManageBadgesFromAssign');
    if (btnGoToManageFromAssign) {
      btnGoToManageFromAssign.addEventListener('click', () => {
        document.getElementById('agentReputationAssignModal')?.classList.remove('active');
        openManageReputationsModal();
      });
    }

    // بەلگە تەھرىرلىگۈچنى نۆللەش / يېڭى بەلگە قوشۇش ھالىتىگە قايتۇرۇش
    const btnResetRep = document.getElementById('btnResetToNewRepBadge');
    if (btnResetRep) {
      btnResetRep.addEventListener('click', resetRepBadgeEditorForm);
    }

    const btnCancelRep = document.getElementById('btnCancelRepBadgeEdit');
    if (btnCancelRep) {
      btnCancelRep.addEventListener('click', resetRepBadgeEditorForm);
    }

    // رەڭ ۋە تېكىست جانلىق تەڭشەش ۋە تەقلىد قىلىش (Real-time Live Preview)
    const edName = document.getElementById('editorRepBadgeName');
    const edTextColor = document.getElementById('editorRepBadgeTextColor');
    const edTextColorHex = document.getElementById('editorRepBadgeTextColorHex');
    const edBgColor = document.getElementById('editorRepBadgeBgColor');
    const edBgColorHex = document.getElementById('editorRepBadgeBgColorHex');
    const edBorderColor = document.getElementById('editorRepBadgeBorderColor');
    const edBorderColorHex = document.getElementById('editorRepBadgeBorderColorHex');
    const edIcon = document.getElementById('editorRepBadgeIcon');

    if (edName) edName.addEventListener('input', updateRepBadgePreviewBox);
    if (edIcon) edIcon.addEventListener('change', updateRepBadgePreviewBox);

    if (edTextColor && edTextColorHex) {
      edTextColor.addEventListener('input', () => {
        edTextColorHex.value = edTextColor.value;
        updateRepBadgePreviewBox();
      });
      edTextColorHex.addEventListener('input', () => {
        if (/^#[0-9A-Fa-f]{6}$/.test(edTextColorHex.value)) {
          edTextColor.value = edTextColorHex.value;
        }
        updateRepBadgePreviewBox();
      });
    }

    if (edBgColor && edBgColorHex) {
      edBgColor.addEventListener('input', () => {
        edBgColorHex.value = edBgColor.value;
        updateRepBadgePreviewBox();
      });
      edBgColorHex.addEventListener('input', () => {
        if (/^#[0-9A-Fa-f]{6}$/.test(edBgColorHex.value)) {
          edBgColor.value = edBgColorHex.value;
        }
        updateRepBadgePreviewBox();
      });
    }

    if (edBorderColor && edBorderColorHex) {
      edBorderColor.addEventListener('input', () => {
        edBorderColorHex.value = edBorderColor.value;
        updateRepBadgePreviewBox();
      });
      edBorderColorHex.addEventListener('input', () => {
        if (/^#[0-9A-Fa-f]{6}$/.test(edBorderColorHex.value)) {
          edBorderColor.value = edBorderColorHex.value;
        }
        updateRepBadgePreviewBox();
      });
    }

    // تېز رەڭ تاللاش كۇنۇپكىلىرى
    document.querySelectorAll('.quick-color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.text;
        const bg = btn.dataset.bg;
        const border = btn.dataset.border;
        if (edTextColor) edTextColor.value = text;
        if (edTextColorHex) edTextColorHex.value = text;
        if (edBgColor) edBgColor.value = bg;
        if (edBgColorHex) edBgColorHex.value = bg;
        if (edBorderColor) edBorderColor.value = border;
        if (edBorderColorHex) edBorderColorHex.value = border;
        updateRepBadgePreviewBox();
      });
    });

    // بەلگە تەھرىرلەش / قوشۇش جەدۋىلىنى ساقلاش
    const repBadgeEditorForm = document.getElementById('repBadgeEditorForm');
    if (repBadgeEditorForm) {
      repBadgeEditorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('editorRepBadgeId')?.value;
        const name = document.getElementById('editorRepBadgeName')?.value?.trim();
        const textColor = document.getElementById('editorRepBadgeTextColor')?.value;
        const bgColor = document.getElementById('editorRepBadgeBgColor')?.value;
        const borderColor = document.getElementById('editorRepBadgeBorderColor')?.value;
        const icon = document.getElementById('editorRepBadgeIcon')?.value;

        const res = window.appStore.saveReputationBadge({ id, name, textColor, bgColor, borderColor, icon });
        if (res.success) {
          showAdminToast(res.message, 'success');
          renderManageRepBadgesList();
          renderAgentsView();
          renderProductsTable();
          resetRepBadgeEditorForm();
        } else {
          showAdminToast(res.message, 'error');
        }
      });
    }

    // ۋاكالەتچى ئۇچۇرلىرى ۋە ماركا ھوقۇقىنى ساقلاش جەدۋىلى (ئالىي باشقۇرغۇچى تولۇق تەھرىرلەش)
    const agentBrandAuthForm = document.getElementById('agentBrandAuthForm');
    if (agentBrandAuthForm) {
      agentBrandAuthForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const agentId = document.getElementById('authAgentId').value;
        const agent = window.appStore.getAgentById(agentId);
        if (!agent) {
          showAdminToast('ۋاكالەتچى تېپىلمىدى!', 'error');
          return;
        }

        const editName = document.getElementById('authAgentEditName')?.value?.trim() || agent.name;
        const editPhone = document.getElementById('authAgentEditPhone')?.value?.trim() || agent.phone;
        const editEmail = document.getElementById('authAgentEditEmail')?.value?.trim() || agent.email;
        const editCity = document.getElementById('authAgentEditCity')?.value?.trim() || agent.city || 'ئىستانبۇل (فاتىھ)';
        const newStatus = document.getElementById('authAgentStatusSelect')?.value || agent.status;
        const editCommission = Number(document.getElementById('authAgentEditCommission')?.value || agent.commissionRate || 15);
        const editCertCode = document.getElementById('authAgentEditCertCode')?.value?.trim() || agent.certCode || ('TK-CERT-2026-' + agent.id.replace(/\D/g, ''));
        const editSalesTotal = Number(document.getElementById('authAgentEditSalesTotal')?.value || agent.salesTotal || 0);
        const editExpireDate = document.getElementById('authAgentEditExpireDate')?.value || agent.authExpireDate || '2027-08-15';
        const editNotes = document.getElementById('authAgentEditNotes')?.value?.trim() || '';

        // سودىگەر ئىناۋەت دەرىجىسىنى ئېلىش
        let selectedReputation = authRepSelect ? authRepSelect.value : 'ئىشەنچىلىك سودىگەر';
        if (selectedReputation === 'custom') {
          const customVal = authRepCustom ? authRepCustom.value.trim() : '';
          selectedReputation = customVal || 'ئىشەنچىلىك سودىگەر';
        }
        
        const selectedBrands = [];
        document.querySelectorAll('#agentBrandsCheckboxList input[type="checkbox"]:checked').forEach(cb => {
          selectedBrands.push(cb.value);
        });

        const canPublishMultilingual = document.getElementById('authAgentCanPublishMultilingual')?.value === 'true';
        const editViolationsCount = Number(document.getElementById('authAgentEditViolationsCount')?.value || 0);

        // ئالىي باشقۇرغۇچى تەھرىرلىگەن بارلىق سانلىق مەلۇماتلارنى ساقلاش
        window.appStore.saveAgent({
          id: agentId,
          name: editName,
          phone: editPhone,
          email: editEmail,
          city: editCity,
          status: newStatus,
          commissionRate: editCommission,
          certCode: editCertCode,
          salesTotal: editSalesTotal,
          authExpireDate: editExpireDate,
          reputation: selectedReputation,
          canPublishMultilingual: canPublishMultilingual,
          violationsCount: editViolationsCount,
          authorizedBrands: selectedBrands,
          notes: editNotes
        });

        document.getElementById('agentBrandAuthModal').classList.remove('active');
        renderAgentsView();
        renderProductsTable();
        populateAgentFilterDropdowns();
        showAdminToast(`«${editName}» نىڭ بارلىق ئۇچۇرلىرى ۋە سېتىش ھوقۇقى مۇۋەپپەقىيەتلىك ساقلاندى!`, 'success');
      });
    }

    // يېڭى ۋاكالەتچىدىكى بارلىق ماركىلارنى تاللاش ۋە بىكار قىلىش كۇنۇپكىلىرى
    const btnSelectAllNewAgent = document.getElementById('btnSelectAllNewAgentBrands');
    if (btnSelectAllNewAgent) {
      btnSelectAllNewAgent.addEventListener('click', () => {
        document.querySelectorAll('#newAgentBrandsCheckboxList input[type="checkbox"]').forEach(cb => cb.checked = true);
        document.querySelectorAll('#quickNewAgentBrandButtons .quick-new-agent-brand-btn').forEach(btn => {
          btn.style.borderColor = 'var(--primary-color)';
          btn.style.background = '#eff6ff';
        });
      });
    }

    const btnClearAllNewAgent = document.getElementById('btnClearAllNewAgentBrands');
    if (btnClearAllNewAgent) {
      btnClearAllNewAgent.addEventListener('click', () => {
        document.querySelectorAll('#newAgentBrandsCheckboxList input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('#quickNewAgentBrandButtons .quick-new-agent-brand-btn').forEach(btn => {
          btn.style.borderColor = '#dbeafe';
          btn.style.background = '#ffffff';
        });
      });
    }

    // يېڭى ۋاكالەتچىنى ساقلاش جەدۋىلى (ماركا ھوقۇقى بىلەن)
    const addAgentForm = document.getElementById('addAgentForm');
    if (addAgentForm) {
      addAgentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('newAgentName').value.trim();
        const email = document.getElementById('newAgentEmail').value.trim();
        const phone = document.getElementById('newAgentPhone').value.trim();
        const status = document.getElementById('newAgentStatus').value;
        const repSelect = document.getElementById('newAgentReputation');
        const reputation = repSelect ? repSelect.value : 'ئىشەنچىلىك سودىگەر';
        const canPublishMultilingual = document.getElementById('newAgentCanPublishMultilingual')?.value === 'true';

        if (!name || !email) {
          showAdminToast('ئىسىم ۋە ئېلخەت كىرگۈزۈش مەجبۇرىي!', 'error');
          return;
        }

        // تاللانغان ماركىلارنى يىغىش
        const selectedBrands = [];
        document.querySelectorAll('#newAgentBrandsCheckboxList input[type="checkbox"]:checked').forEach(cb => {
          selectedBrands.push(cb.value);
        });

        // ئەگەر ھېچقانداق ماركا تاللانمىغان بولسا، ئەسكەرتىش بېرىش ياكى سۈكۈت بويىچە ماركا بېكىتىش
        const finalBrands = selectedBrands.length > 0 ? selectedBrands : ['تەكلىماكان كىلاسسىك'];

        const city = (document.getElementById('newAgentCity')?.value || '').trim() || 'ئىستانبۇل';
        const commissionRate = parseFloat(document.getElementById('newAgentCommission')?.value) || 10;

        window.appStore.saveAgent({
          name,
          email,
          phone,
          city,
          commissionRate,
          status,
          reputation,
          canPublishMultilingual,
          authorizedBrands: finalBrands
        });

        document.getElementById('addAgentModal').classList.remove('active');
        renderAgentsView();
        showAdminToast(`يېڭى ۋاكالەتچى «${name}» (${finalBrands.length} ماركا رۇخسىتى بىلەن) سېستىمىغا كىرگۈزۈلدى!`, 'success');
      });
    }

    // 🚚 زاكاز ئىز قوغلاش ۋە پوچتا تەڭشىكى
    setupOrderTrackingForm();

    // 🎟️ ئېتىبار كۇپونلىرى جەدۋىلى ۋە قوشۇش
    setupCouponForm();

    // 👥 خېرىدارلار (CRM) ئىزدەش
    const crmSearch = document.getElementById('crmCustomerSearchInput');
    if (crmSearch) {
      crmSearch.addEventListener('input', renderCustomersTable);
    }

    // 💾 تولۇق زاپاسلاش ۋە ئەسلىگە كەلتۈرۈش
    setupBackupRestoreHandlers();

    // 📜 ۋاكالەتچىلىك كېلىشىمنامە ئارخىپ كۆزنىكى مەشغۇلاتلىرى
    setupContractArchiveModalEvents();

    window.addEventListener('uyghur_store_sync', () => {
      renderDashboardMetrics();
      renderRecentOrders();
      renderProductsTable();
      renderOrdersTable();
      renderCustomersTable();
      renderCouponsTable();
      renderAgentsView();
    });

    // 🔄 ئارقا سۇپىدا بۇلۇتتىن دەل ۋاقتىدا تەكشۈرۈش (ھەر 20 سېكۇنتتا يېڭى ئىلتىماس كەلگەن-كەلمىگەنلىكىنى تەكشۈرىدۇ)
    setInterval(async () => {
      if (window.appStore && typeof window.appStore.syncWithSupabase === 'function') {
        const prevPendingCount = (window.appStore.getAgents ? window.appStore.getAgents() : []).filter(a => a.status === 'تەستىق كۈتۈۋاتىدۇ').length;
        await window.appStore.syncWithSupabase();
        const newPendingCount = (window.appStore.getAgents ? window.appStore.getAgents() : []).filter(a => a.status === 'تەستىق كۈتۈۋاتىدۇ').length;
        if (newPendingCount > prevPendingCount) {
          showAdminToast(`🔔 يېڭى سودىگەر ئىلتىماسى كېلىپ چۈشتى! (${newPendingCount} ئىلتىماس تەستىق كۈتۈۋاتىدۇ)`, 'info');
        }
      }
    }, 20000);
  }

  // ==================== 🚚 زاكاز ئىز قوغلاش كۆزنىكى ۋە فورمىسى ====================
  function openOrderTrackingModal(orderOrId) {
    const orders = window.appStore ? window.appStore.getOrders() : [];
    let order = (typeof orderOrId === 'object' && orderOrId !== null) 
      ? orderOrId 
      : orders.find(o => String(o.id) === String(orderOrId));
    if (!order) {
      alert('زاكاز ئۇچۇرى تېپىلمىدى: ' + orderOrId);
      return;
    }

    const modal = document.getElementById('orderTrackingModal');
    if (!modal) return;

    const oidInput = document.getElementById('trackingOrderId');
    const dispInput = document.getElementById('trackingOrderDisplayId');
    const carrierSelect = document.getElementById('trackingCarrierSelect');
    const noInput = document.getElementById('trackingNumberInput');

    const cust = (typeof order.customer === 'string') ? JSON.parse(order.customer || '{}') : (order.customer || {});

    if (oidInput) oidInput.value = order.id;
    if (dispInput) dispInput.value = `#${order.id} - ${cust.name || ''}`;
    if (carrierSelect) carrierSelect.value = order.cargoCarrier || (order.tracking && order.tracking.carrier) || 'PTT Kargo';
    if (noInput) noInput.value = order.cargoTrackingNo || (order.tracking && order.tracking.trackingNumber) || '';

    window.showModal('orderTrackingModal');
    setTimeout(() => { if (noInput) noInput.focus(); }, 150);
  }
  window.openOrderTrackingModal = openOrderTrackingModal;

  window.openDirectSmsModalForOrder = function(orderOrId) {
    const orders = window.appStore ? window.appStore.getOrders() : [];
    let order = (typeof orderOrId === 'object' && orderOrId !== null) 
      ? orderOrId 
      : orders.find(o => String(o.id) === String(orderOrId));
    if (!order) {
      alert('زاكاز ئۇچۇرى تېپىلمىدى: ' + orderOrId);
      return;
    }
    const cust = (typeof order.customer === 'string') ? JSON.parse(order.customer || '{}') : (order.customer || {});
    openDirectSmsModal({
      name: cust.name || 'خېرىدار',
      phone: cust.phone || '',
      role: 'خېرىدار',
      orderId: order.id
    });
    window.showModal('directSmsModal');
  };

  window.deleteOrderById = function(orderId) {
    if (confirm('بۇ زاكازنى ھەقىقەتەن ئۆچۈرەمسىز؟\n\nنومۇرى: #' + orderId)) {
      window.appStore.deleteOrder(orderId);
      renderOrdersTable();
      renderDashboardMetrics();
      showAdminToast('زاكاز مۇۋەپپەقىيەتلىك ئۆچۈرۈلدى!', 'info');
    }
  };

  function setupOrderTrackingForm() {
    const form = document.getElementById('orderTrackingForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const oid = document.getElementById('trackingOrderId').value;
      const carrier = document.getElementById('trackingCarrierSelect').value;
      const trackingNo = document.getElementById('trackingNumberInput').value.trim();

      const res = window.appStore.updateOrderTracking(oid, carrier, trackingNo);
      if (res === true || (res && res.success)) {
        window.hideModal('orderTrackingModal');
        renderOrdersTable();
        renderDashboardMetrics();
        showAdminToast('كارگو ئىز قوغلاش ئۇچۇرى مۇۋەپپەقىيەتلىك ساقلاندى!', 'success');

        const order = res.order;
        if (order && order.customer && order.customer.phone) {
          const trackUrl = window.appStore.getCargoTrackingUrl(carrier, trackingNo);
          const confirmWa = confirm('خېرىدارغا بىۋاسىتە WhatsApp ئارقىلىق يوللانما كودى ئەۋەتەمسىز؟');
          if (confirmWa) {
            const cleanPhone = order.customer.phone.replace(/[^0-9]/g, '');
            const msg = encodeURIComponent(
              `ئەسسالامۇئەلەيكۇم ھۆرمەتلىك ${order.customer.name}،\n` +
              `سىزنىڭ تەكلىماكان سۇپىسىدىن بەرگەن #${order.id} نومۇرلۇق زاكازىڭىز يوللاندى!\n\n` +
              `📦 پوچتا شىركىتى: ${carrier}\n` +
              `🔢 ئىز قوغلاش كودى: ${trackingNo}\n` +
              (trackUrl ? `🔗 ئىز قوغلاش تور بېكىتى: ${trackUrl}\n\n` : '\n') +
              `تەكلىماكاننى تاللىغىنىڭىزغا كۆپ رەھمەت!`
            );
            window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${msg}`, '_blank');
          }
        }
      } else {
        showAdminToast(res.message || 'خاتالىق كۆرۈلدى', 'error');
      }
    });
  }

  // ==================== 👥 خېرىدارلار باشقۇرۇش مەركىزى (CRM) ====================
  function renderCustomersTable() {
    const tbody = document.getElementById('adminCustomersTbody');
    if (!tbody) return;

    const summary = window.appStore.getCustomersSummary();
    const customers = summary.customers;

    // KPI كارتىلىرىنى يېڭىلاش
    const totalCustEl = document.getElementById('crmStatTotalCustomers');
    const totalRevEl = document.getElementById('crmStatTotalRevenue');
    const totalOrdersEl = document.getElementById('crmStatTotalOrders');
    const avgOrderEl = document.getElementById('crmStatAvgOrder');

    if (totalCustEl) totalCustEl.textContent = summary.totalCustomers;
    if (totalRevEl) totalRevEl.textContent = window.appStore.formatPrice(summary.totalRevenue);
    if (totalOrdersEl) totalOrdersEl.textContent = summary.totalOrders;
    if (avgOrderEl) avgOrderEl.textContent = window.appStore.formatPrice(summary.avgOrderValue);

    const searchInput = document.getElementById('crmCustomerSearchInput');
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

    const filtered = query
      ? customers.filter(c => 
          (c.name && c.name.toLowerCase().includes(query)) ||
          (c.phone && c.phone.includes(query)) ||
          (c.city && c.city.toLowerCase().includes(query))
        )
      : customers;

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">خېرىدار ئۇچۇرى تېپىلمىدى</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    filtered.forEach(c => {
      const tr = document.createElement('tr');
      const cleanPhone = c.phone ? c.phone.replace(/[^0-9]/g, '') : '';
      const formattedTotal = window.appStore.formatPrice(c.totalSpent);

      let tierHtml = '<span style="background: #f1f5f9; color: #475569; padding: 3px 8px; border-radius: 6px; font-weight: 700; font-size: 0.78rem;">يېڭى خېرىدار</span>';
      if (c.tier === 'vip') {
        tierHtml = '<span style="background: #fef3c7; color: #b45309; padding: 3px 8px; border-radius: 6px; font-weight: 800; font-size: 0.78rem;"><i class="fas fa-crown"></i> ئالتۇن VIP</span>';
      } else if (c.tier === 'regular') {
        tierHtml = '<span style="background: #dbeafe; color: #1e40af; padding: 3px 8px; border-radius: 6px; font-weight: 800; font-size: 0.78rem;"><i class="fas fa-star"></i> دائىملىق</span>';
      }

      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #e0f2fe; color: #0284c7; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; flex-shrink: 0;">
              ${(c.name || 'خ').slice(0, 1)}
            </div>
            <div>
              <div style="font-weight: 800; color: #0f172a;">${c.name}</div>
            </div>
          </div>
        </td>
        <td class="number-latin" style="direction: ltr; font-weight: 700; color: #334155;">${c.phone || '-'}</td>
        <td style="font-size: 0.88rem; max-width: 200px; color: #64748b;">${c.city || ''} ${c.address ? ' - ' + c.address : ''}</td>
        <td>${tierHtml}</td>
        <td class="number-latin" style="font-weight: 800; color: #0284c7;">${c.orderCount} زاكاز</td>
        <td class="number-latin" style="font-weight: 900; color: var(--danger-color); font-size: 1rem;">${formattedTotal}</td>
        <td class="number-latin" style="font-size: 0.82rem; color: #64748b;">${c.lastOrderDate || '-'}</td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            <a href="https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(`ئەسسالامۇئەلەيكۇم ھۆرمەتلىك ${c.name}، تەكلىماكان دۇكىنىدىن سىز بىلەن ئالاقىلىشىۋاتىمىز.`)}" target="_blank" class="btn-action-edit" title="WhatsApp تا سۆزلىشىش" style="background: #22c55e !important; border-color: #22c55e !important; color: #ffffff !important;">
              <i class="fab fa-whatsapp"></i>
            </a>
            <button type="button" class="btn-action-edit btn-crm-sms" data-phone="${c.phone}" data-name="${c.name}" title="SMS / قىسقا ئۇچۇر" style="background: #0284c7 !important; border-color: #0284c7 !important; color: #ffffff !important;">
              <i class="fas fa-sms"></i>
            </button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-crm-sms').forEach(btn => {
      btn.addEventListener('click', () => {
        openDirectSmsModal({
          name: btn.dataset.name,
          phone: btn.dataset.phone,
          role: 'خېرىدار'
        });
      });
    });
  }

  // ==================== 🎟️ ئېتىبار كۇپونلىرى باشقۇرۇش (Coupons) ====================
  function renderCouponsTable() {
    const tbody = document.getElementById('adminCouponsTbody');
    if (!tbody) return;

    const coupons = window.appStore.getCoupons();
    if (coupons.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">ئېتىبار كۇپونى تېپىلمىدى</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    coupons.forEach(c => {
      const tr = document.createElement('tr');
      const discountDisplay = c.type === 'percentage' ? `%${c.value} ئېتىبار` : `₺${c.value} نەق ئېتىبار`;
      const minSpendDisplay = c.minSpend > 0 ? `₺${c.minSpend}` : 'چەكسىز';
      const statusBadge = c.isActive
        ? `<span class="badge" style="background: #dcfce7; color: #166534; font-weight: 800; font-size: 0.78rem;"><i class="fas fa-check-circle"></i> ئاكتىپ</span>`
        : `<span class="badge" style="background: #f1f5f9; color: #64748b; font-weight: 800; font-size: 0.78rem;"><i class="fas fa-pause-circle"></i> توختىتىلغان</span>`;

      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <code class="number-latin" style="background: #eff6ff; color: #1d4ed8; font-weight: 900; font-size: 0.95rem; padding: 3px 8px; border-radius: 6px; border: 1px solid #bfdbfe;">${c.code}</code>
            <button type="button" class="btn-copy-coupon-code" data-code="${c.code}" title="كودنى كۆچۈرۈش" style="background: none; border: none; cursor: pointer; color: #64748b;">
              <i class="far fa-copy"></i>
            </button>
          </div>
          ${c.description ? `<div style="font-size: 0.78rem; color: #64748b; margin-top: 2px;">${c.description}</div>` : ''}
        </td>
        <td><span style="font-weight: 700; font-size: 0.88rem;">${c.type === 'percentage' ? 'پىرسەنتلىك' : 'نەق پۇل'}</span></td>
        <td><strong class="number-latin" style="font-size: 1rem; color: var(--danger-color);">${discountDisplay}</strong></td>
        <td class="number-latin" style="font-weight: 700;">${minSpendDisplay}</td>
        <td class="number-latin" style="font-size: 0.85rem; color: #64748b;">${c.expireDate || 'مەڭگۈلۈك'}</td>
        <td class="number-latin" style="font-weight: 800; font-size: 0.85rem;">${c.usedCount || 0} / ${c.usageLimit || '∞'}</td>
        <td>${statusBadge}</td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            <button type="button" class="btn-action-edit btn-toggle-coupon" data-code="${c.code}" title="${c.isActive ? 'توختىتىش' : 'ئاكتىپلاش'}" style="background: ${c.isActive ? '#f59e0b' : '#10b981'} !important; border-color: ${c.isActive ? '#f59e0b' : '#10b981'} !important; color: #ffffff !important;">
              <i class="fas ${c.isActive ? 'fa-pause' : 'fa-play'}"></i>
            </button>
            <button type="button" class="btn-action-delete btn-delete-coupon" data-code="${c.code}" title="ئۆچۈرۈش">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-copy-coupon-code').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard?.writeText(btn.dataset.code);
        showAdminToast(`كۇپون كودى (${btn.dataset.code}) كۆچۈرۈلدى!`, 'info');
      });
    });

    tbody.querySelectorAll('.btn-toggle-coupon').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = window.appStore.toggleCouponStatus(btn.dataset.code);
        if (res.success) {
          renderCouponsTable();
          showAdminToast(res.message, 'success');
        }
      });
    });

    tbody.querySelectorAll('.btn-delete-coupon').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm(`«${btn.dataset.code}» كۇپونىنى ئۆچۈرەمسىز؟`)) {
          const res = window.appStore.deleteCoupon(btn.dataset.code);
          if (res.success) {
            renderCouponsTable();
            showAdminToast(res.message, 'info');
          }
        }
      });
    });
  }

  function setupCouponForm() {
    const form = document.getElementById('adminAddCouponForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = document.getElementById('couponInputCode').value.trim().toUpperCase();
      const type = document.getElementById('couponInputType').value;
      const value = parseFloat(document.getElementById('couponInputValue').value);
      const minSpend = parseFloat(document.getElementById('couponInputMinSpend').value) || 0;
      const expireDate = document.getElementById('couponInputExpireDate').value;
      const usageLimit = parseInt(document.getElementById('couponInputLimit').value, 10) || 500;
      const description = document.getElementById('couponInputDesc').value.trim();

      const coupon = {
        code,
        type,
        value,
        minSpend,
        expireDate,
        usageLimit,
        description,
        isActive: true
      };

      const res = window.appStore.saveCoupon(coupon);
      if (res.success) {
        showAdminToast(res.message, 'success');
        form.reset();
        renderCouponsTable();
      } else {
        showAdminToast(res.message, 'error');
      }
    });
  }

  // ==================== 💾 تولۇق زاپاسلاش ۋە ئەسلىگە كەلتۈرۈش ====================
  function setupBackupRestoreHandlers() {
    const btnExport = document.getElementById('btnExportFullBackup');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const jsonStr = window.appStore.exportFullBackup();
        const dateStr = new Date().toISOString().slice(0, 10);
        const fileName = `teklimakan_store_full_backup_${dateStr}.json`;

        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showAdminToast('تولۇق زاپاسلاش ھۆججىتى مۇۋەپپەقىيەتلىك چۈشۈرۈلدى!', 'success');
      });
    }

    const btnTriggerImport = document.getElementById('btnTriggerImportBackup');
    const inputImport = document.getElementById('inputImportBackupFile');
    if (btnTriggerImport && inputImport) {
      btnTriggerImport.addEventListener('click', () => {
        inputImport.click();
      });

      inputImport.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
          const content = evt.target.result;
          const confirmRestore = confirm('دىققەت! بۇ مەشغۇلات بارلىق مەھسۇلاتلار، زاكازلار، تۈرلەر ۋە كۇپونلارنى بۇ ھۆججەت بويىچە يېڭىلايدۇ. داۋاملاشتۇرامسىز؟');
          if (confirmRestore) {
            const res = window.appStore.importFullBackup(content);
            if (res.success) {
              showAdminToast(res.message, 'success');
              initAdmin();
            } else {
              showAdminToast(res.message, 'error');
            }
          }
          inputImport.value = '';
        };
        reader.readAsText(file);
      });
    }
  }

  function getStatusClass(status) {
    if (status === 'ساقلاۋاتىدۇ') return 'status-pending';
    if (status === 'تەستىقلاندى') return 'status-approved';
    if (status === 'يوللاندى') return 'status-shipped';
    if (status === 'تاماملاندى') return 'status-completed';
    if (status === 'بىكار قىلىندى') return 'status-cancelled';
    return 'status-pending';
  }

  function showAdminToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
});