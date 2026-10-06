/* STACKLY — Admin Dashboard Logic */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('admin-dashboard-page')) {
    if (!requireAuth('Admin')) return;
    
    initAdminKPIs();
    renderRecentOrdersAdmin();
    renderInventoryAlertsAdmin();
    initSalesChart();
    renderTopSellingProducts();
    renderNotificationsAdmin();

    // Comprehensive Admin View Renderers
    renderFullProductsAdmin();
    renderFullOrdersAdmin();
    renderCustomersAdmin();
    renderConciergeRequestsAdmin();
  }
});

function initAdminKPIs() {
  const kpis = [
    { id: 'kpi-products', target: 128 },
    { id: 'kpi-orders', target: 24 }
  ];

  kpis.forEach(item => {
    const el = document.getElementById(item.id);
    if (!el) return;

    if (typeof gsap !== 'undefined') {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: item.target,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = Math.floor(obj.val);
        }
      });
    } else {
      el.textContent = item.target;
    }
  });
}

function renderRecentOrdersAdmin() {
  const tableBody = document.getElementById('admin-recent-orders-tbody');
  if (!tableBody) return;

  const orders = getOrders();
  tableBody.innerHTML = orders.map(order => {
    let badgeClass = 'status-processing';
    if (order.status === 'Shipped') badgeClass = 'status-shipped';
    if (order.status === 'Delivered') badgeClass = 'status-delivered';

    return `
      <tr>
        <td><strong>${order.id}</strong></td>
        <td>${order.item}</td>
        <td style="color: #B08D57; font-weight: 600;">₹${order.price.toLocaleString('en-IN')}</td>
        <td><span class="status-badge ${badgeClass}">${order.status}</span></td>
      </tr>
    `;
  }).join('');
}

function refreshAdminOrders() {
  const btn = document.getElementById('refresh-orders-btn');
  if (btn && typeof gsap !== 'undefined') {
    gsap.to(btn, { rotation: '+=360', duration: 0.6 });
  }
  renderRecentOrdersAdmin();
  renderFullOrdersAdmin();
}

function renderInventoryAlertsAdmin() {
  const container = document.getElementById('admin-inventory-alerts');
  if (!container) return;

  const alerts = getInventoryAlerts();
  container.innerHTML = alerts.map(item => `
    <div style="padding: 1rem; background: #161616; border-left: 3px solid #B08D57; display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
      <div>
        <div style="font-weight: 600; font-size: 0.9rem;">${item.title}</div>
        <div style="font-size: 0.75rem; color: rgba(245,242,234,0.5);">Size: ${item.size} • ${item.stock > 0 ? `Only ${item.stock} left` : '0 in stock'}</div>
      </div>
      <span class="status-badge status-lowstock">${item.status}</span>
    </div>
  `).join('');
}

function initSalesChart() {
  const svgContainer = document.getElementById('admin-sales-svg');
  if (!svgContainer) return;

  drawChartLine([20, 45, 30, 60, 50, 85, 95]);

  document.querySelectorAll('.chart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const period = btn.dataset.period;
      
      let data = [20, 45, 30, 60, 50, 85, 95];
      if (period === '30') data = [15, 35, 55, 40, 70, 80, 110];
      if (period === '90') data = [30, 50, 40, 90, 85, 120, 140];
      if (period === '365') data = [50, 80, 110, 130, 160, 190, 240];
      
      drawChartLine(data);
    });
  });
}

function drawChartLine(dataPoints) {
  const svgContainer = document.getElementById('admin-sales-svg');
  if (!svgContainer) return;

  const width = 600;
  const height = 200;
  const maxVal = Math.max(...dataPoints, 100);
  
  const points = dataPoints.map((val, idx) => {
    const x = (idx / (dataPoints.length - 1)) * (width - 40) + 20;
    const y = height - 30 - ((val / maxVal) * (height - 60));
    return `${x},${y}`;
  }).join(' ');

  svgContainer.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#B08D57" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#B08D57" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <polyline fill="url(#chartGrad)" stroke="none" points="20,${height - 30} ${points} ${width - 20},${height - 30}" />
      <polyline id="chart-line-path" fill="none" stroke="#B08D57" stroke-width="3" points="${points}" />
      ${dataPoints.map((val, idx) => {
        const x = (idx / (dataPoints.length - 1)) * (width - 40) + 20;
        const y = height - 30 - ((val / maxVal) * (height - 60));
        return `<circle cx="${x}" cy="${y}" r="4" fill="#F5F2EA" stroke="#B08D57" stroke-width="2"/>`;
      }).join('')}
    </svg>
  `;

  const path = document.getElementById('chart-line-path');
  if (path && typeof gsap !== 'undefined') {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(path, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' });
  }
}

function renderTopSellingProducts() {
  const container = document.getElementById('admin-top-products-list');
  if (!container) return;

  const topList = [
    { rank: '01', name: 'Urban Runner X', sales: '142 sold', img: 'assets/product-1.webp' },
    { rank: '02', name: 'Street Classic', sales: '118 sold', img: 'assets/product-2.webp' },
    { rank: '03', name: 'Flex Motion', sales: '96 sold', img: 'assets/product-3.webp' },
    { rank: '04', name: 'Classic Overshirt', sales: '81 sold', img: 'assets/product-4.webp' },
    { rank: '05', name: 'Court Jacket', sales: '74 sold', img: 'assets/product-5.webp' }
  ];

  container.innerHTML = topList.map(item => `
    <div class="top-product-item">
      <div class="top-product-rank">${item.rank}</div>
      <img src="${item.img}" alt="${item.name}">
      <div class="top-product-info">
        <div class="top-product-name">${item.name}</div>
        <div class="top-product-sales">${item.sales}</div>
      </div>
    </div>
  `).join('');
}

function renderNotificationsAdmin() {
  const container = document.getElementById('admin-notifications-list');
  if (!container) return;

  const notifs = getNotifications();
  container.innerHTML = notifs.map(n => `
    <div class="notification-card">
      <div class="notification-title">${n.title}</div>
      <div class="notification-desc">${n.desc} • <span style="color: #B08D57;">${n.time}</span></div>
    </div>
  `).join('');
}

function refreshAdminNotifications() {
  const btn = document.getElementById('refresh-notifs-btn');
  if (btn && typeof gsap !== 'undefined') {
    gsap.to(btn, { rotation: '+=360', duration: 0.6 });
  }
  renderNotificationsAdmin();
}

// Products View Functions
function getAdminProducts() {
  const localStr = localStorage.getItem('stackly_admin_custom_prods');
  const custom = localStr ? JSON.parse(localStr) : [];
  return typeof PRODUCTS_DATABASE !== 'undefined' ? [...PRODUCTS_DATABASE, ...custom] : custom;
}

function renderFullProductsAdmin(productsToRender) {
  const tbody = document.getElementById('admin-full-products-tbody');
  if (!tbody) return;

  const products = productsToRender || getAdminProducts();
  
  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: rgba(250,248,245,0.5); padding: 2rem;">No products match criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 0.9rem;">
          <img src="${p.image}" alt="${p.title}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 4px; border: 1px solid rgba(250,248,245,0.1);">
          <div>
            <div style="font-weight: 600; color: var(--secondary); font-size: 0.92rem;">${p.title}</div>
            <div style="font-size: 0.72rem; color: rgba(250,248,245,0.45);">SKU: STK-${1000 + (p.id % 9000)}</div>
          </div>
        </div>
      </td>
      <td><span class="admin-badge-tag">${p.category}</span></td>
      <td style="color: var(--accent); font-weight: 600;">₹${p.price.toLocaleString('en-IN')}</td>
      <td>
        <span class="status-badge ${p.availability === 'Low Stock' ? 'status-lowstock' : 'status-delivered'}">${p.availability || 'In Stock'}</span>
      </td>
      <td><span style="font-size: 0.75rem; color: rgba(250,248,245,0.7);">${p.badge || 'STANDARD'}</span></td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.72rem;">EDIT</button>
          <button class="btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.72rem; border-color: rgba(229,115,115,0.4); color: #E57373;" onclick="deleteAdminProduct(${p.id})">DELETE</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function toggleAddProductForm() {
  const drawer = document.getElementById('add-product-drawer');
  if (drawer) {
    drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
  }
}

function handleAddNewProduct(event) {
  event.preventDefault();
  const title = document.getElementById('new-prod-title').value;
  const category = document.getElementById('new-prod-category').value;
  const price = parseFloat(document.getElementById('new-prod-price').value);
  const stock = parseInt(document.getElementById('new-prod-stock').value);
  const badge = document.getElementById('new-prod-badge').value;
  const image = document.getElementById('new-prod-image').value || 'assets/product-1.webp';

  const newProd = {
    id: Date.now(),
    title,
    category,
    price,
    rating: 5,
    colors: ['#111111', '#B08D57'],
    sizes: ['S', 'M', 'L', 'XL'],
    image,
    badge,
    collection: category,
    availability: stock < 5 ? 'Low Stock' : 'In Stock'
  };

  const localStr = localStorage.getItem('stackly_admin_custom_prods');
  const custom = localStr ? JSON.parse(localStr) : [];
  custom.push(newProd);
  localStorage.setItem('stackly_admin_custom_prods', JSON.stringify(custom));

  renderFullProductsAdmin();
  toggleAddProductForm();

  document.getElementById('new-prod-title').value = '';
  document.getElementById('new-prod-price').value = '';
  document.getElementById('new-prod-stock').value = '';
}

function deleteAdminProduct(prodId) {
  const localStr = localStorage.getItem('stackly_admin_custom_prods');
  if (localStr) {
    let custom = JSON.parse(localStr);
    custom = custom.filter(p => p.id !== prodId);
    localStorage.setItem('stackly_admin_custom_prods', JSON.stringify(custom));
  }
  renderFullProductsAdmin();
}

function filterAdminProductsTable() {
  const search = (document.getElementById('admin-product-search')?.value || '').toLowerCase();
  const cat = document.getElementById('admin-product-category-filter')?.value || 'ALL';

  const all = getAdminProducts();
  const filtered = all.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search) || p.category.toLowerCase().includes(search);
    const matchCat = cat === 'ALL' || p.category === cat;
    return matchSearch && matchCat;
  });

  renderFullProductsAdmin(filtered);
}

// Orders View Functions
function renderFullOrdersAdmin(ordersToRender) {
  const tbody = document.getElementById('admin-all-orders-tbody');
  if (!tbody) return;

  const orders = ordersToRender || getOrders();
  tbody.innerHTML = orders.map(o => {
    return `
      <tr>
        <td><strong>${o.id}</strong></td>
        <td>
          <div style="font-weight: 600; color: var(--secondary);">${o.customer || 'Yukeshyuki18'}</div>
          <div style="font-size: 0.72rem; color: var(--accent);">VIP Privé Client</div>
        </td>
        <td>${o.item}</td>
        <td style="color: var(--accent); font-weight: 600;">₹${o.price.toLocaleString('en-IN')}</td>
        <td style="font-size: 0.8rem; color: rgba(250,248,245,0.6);">${o.date}</td>
        <td>
          <select onchange="updateAdminOrderStatus('${o.id}', this.value)" style="background: #0B0C10; border: 1px solid rgba(250,248,245,0.15); color: var(--secondary); padding: 0.35rem 0.6rem; font-size: 0.75rem; border-radius: 4px; cursor: pointer;">
            <option value="Out for Delivery" ${o.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
            <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
          </select>
        </td>
        <td>
          <button class="btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.72rem;"><i class="fa-solid fa-file-invoice"></i> INVOICE</button>
        </td>
      </tr>
    `;
  }).join('');
}

function updateAdminOrderStatus(orderId, newStatus) {
  let orders = getOrders();
  orders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
  localStorage.setItem('stackly_orders', JSON.stringify(orders));
  renderRecentOrdersAdmin();
  renderFullOrdersAdmin();
}

function filterAdminOrdersTable() {
  const search = (document.getElementById('admin-order-search')?.value || '').toLowerCase();
  const status = document.getElementById('admin-order-status-filter')?.value || 'ALL';

  const all = getOrders();
  const filtered = all.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search) || (o.customer && o.customer.toLowerCase().includes(search)) || o.item.toLowerCase().includes(search);
    const matchStatus = status === 'ALL' || o.status === status;
    return matchSearch && matchStatus;
  });

  renderFullOrdersAdmin(filtered);
}

// Customers View Functions
const ADMIN_CUSTOMERS_LIST = [
  { name: 'Yukeshyuki18', email: 'client@stackly.com', tier: 'VIP Privé Gold', orders: 3, spend: 17297, lastActive: 'Today, 10:15 AM' },
  { name: 'Arun K', email: 'arun.k@atelier.com', tier: 'VIP Privé Platinum', orders: 8, spend: 54900, lastActive: 'Yesterday' },
  { name: 'Priya M', email: 'priya.m@couture.com', tier: 'Privé Silver', orders: 4, spend: 28400, lastActive: 'Sep 27, 2026' },
  { name: 'Vikram R', email: 'vikram.r@design.com', tier: 'Standard Client', orders: 2, spend: 11998, lastActive: 'Sep 22, 2026' },
  { name: 'Ananya S', email: 'ananya.s@luxury.com', tier: 'VIP Privé Gold', orders: 6, spend: 41200, lastActive: 'Sep 18, 2026' }
];

function renderCustomersAdmin(custsToRender) {
  const tbody = document.getElementById('admin-customers-tbody');
  if (!tbody) return;

  const list = custsToRender || ADMIN_CUSTOMERS_LIST;
  tbody.innerHTML = list.map(c => `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 0.8rem;">
          <div class="avatar-circle" style="width: 34px; height: 34px; font-size: 0.85rem;">${c.name.charAt(0)}</div>
          <div style="font-weight: 600; color: var(--secondary);">${c.name}</div>
        </div>
      </td>
      <td style="color: rgba(250,248,245,0.7); font-size: 0.85rem;">${c.email}</td>
      <td><span class="status-badge status-delivered">${c.tier}</span></td>
      <td><strong>${c.orders} orders</strong></td>
      <td style="color: var(--accent); font-weight: 600;">₹${c.spend.toLocaleString('en-IN')}</td>
      <td style="font-size: 0.8rem; color: rgba(250,248,245,0.5);">${c.lastActive}</td>
      <td>
        <button class="btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.72rem;">DOSSIER</button>
      </td>
    </tr>
  `).join('');
}

function filterAdminCustomersTable() {
  const search = (document.getElementById('admin-client-search')?.value || '').toLowerCase();
  const filtered = ADMIN_CUSTOMERS_LIST.filter(c => c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search));
  renderCustomersAdmin(filtered);
}

function renderConciergeRequestsAdmin() {
  const container = document.getElementById('admin-concierge-requests-container');
  if (!container) return;

  const requests = [
    { client: 'Yukeshyuki18', topic: 'Coat Pairing Advice for Urban Runner X', time: 'Today, 09:40 AM', status: 'In Consultation' },
    { client: 'Arun K', topic: 'Bespoke Sizing Alterations — Monolith Trench Coat', time: 'Yesterday', status: 'Resolved' },
    { client: 'Ananya S', topic: 'Private Drop Early Access Inquiry', time: 'Sep 29, 2026', status: 'Approved' }
  ];

  container.innerHTML = requests.map(r => `
    <div class="concierge-request-card">
      <div>
        <div style="font-size: 0.75rem; color: var(--accent); font-weight: 700;">REQUEST FROM ${r.client.toUpperCase()}</div>
        <div style="font-weight: 600; color: var(--secondary); font-size: 0.92rem; margin: 0.2rem 0;">${r.topic}</div>
        <div style="font-size: 0.75rem; color: rgba(250,248,245,0.5);">${r.time}</div>
      </div>
      <button class="btn-outline" style="padding: 0.4rem 0.9rem; font-size: 0.75rem;">RESPOND</button>
    </div>
  `).join('');
}
