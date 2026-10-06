/* STACKLY — Shop Page Product Catalog & Multi-Filter Engine */

const PRODUCTS_DATABASE = [
  {
    id: 1,
    title: 'STACKLY Urban Runner 01',
    category: 'Urban',
    gender: 'Unisex',
    price: 5999,
    rating: 5,
    colors: ['#111111', '#F5F2EA', '#2A1F18'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    image: 'assets/product-1.webp',
    badge: 'NEW',
    collection: 'Urban',
    availability: 'In Stock'
  },
  {
    id: 2,
    title: 'Street Classic Oversized Hoodie',
    category: 'Street',
    gender: 'Men',
    price: 4299,
    rating: 5,
    colors: ['#111111', '#B08D57'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'assets/product-2.webp',
    badge: 'HOT',
    collection: 'Street',
    availability: 'In Stock'
  },
  {
    id: 3,
    title: 'Air Flex Motion Jacket',
    category: 'Performance',
    gender: 'Women',
    price: 6999,
    rating: 4.8,
    colors: ['#111111', '#F5F2EA'],
    sizes: ['XS', 'S', 'M', 'L'],
    image: 'assets/product-3.webp',
    badge: 'TRENDING',
    collection: 'Performance',
    availability: 'In Stock'
  },
  {
    id: 4,
    title: 'Classic Oversized Cotton Shirt',
    category: 'Essentials',
    gender: 'Unisex',
    price: 3499,
    rating: 4.9,
    colors: ['#F5F2EA', '#111111'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'assets/product-4.webp',
    badge: 'BESTSELLER',
    collection: 'Essentials',
    availability: 'Low Stock'
  },
  {
    id: 5,
    title: 'Court Tailored Minimal Blazer',
    category: 'Classic',
    gender: 'Men',
    price: 8999,
    rating: 5,
    colors: ['#111111', '#B08D57'],
    sizes: ['M', 'L', 'XL'],
    image: 'assets/product-5.webp',
    badge: 'EXCLUSIVE',
    collection: 'Classic',
    availability: 'In Stock'
  },
  {
    id: 6,
    title: 'Essential Tailored Trousers',
    category: 'Essentials',
    gender: 'Women',
    price: 4999,
    rating: 4.7,
    colors: ['#111111', '#F5F2EA'],
    sizes: ['XS', 'S', 'M', 'L'],
    image: 'assets/product-6.webp',
    badge: 'ESSENTIAL',
    collection: 'Essentials',
    availability: 'In Stock'
  },
  {
    id: 7,
    title: 'Limited Monolith Trench Coat',
    category: 'Limited Edition',
    gender: 'Unisex',
    price: 12999,
    rating: 5,
    colors: ['#111111', '#B08D57'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'assets/product-7.webp',
    badge: 'LIMITED',
    collection: 'Limited Edition',
    availability: 'Low Stock'
  },
  {
    id: 8,
    title: 'Minimal Leather Runner',
    category: 'Urban',
    gender: 'Men',
    price: 7499,
    rating: 4.9,
    colors: ['#111111', '#F5F2EA'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'assets/product-8.webp',
    badge: 'NEW',
    collection: 'Urban',
    availability: 'In Stock'
  }
];

let activeFilters = {
  categories: [],
  genders: [],
  sizes: [],
  priceMax: 15000,
  sort: 'featured'
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('products-grid-container')) {
    initShopEngine();
  }
  if (document.getElementById('cd-secs')) {
    initCountdownTimer();
  }
});

function initShopEngine() {
  renderProducts(PRODUCTS_DATABASE);
  bindFilterEvents();
}

function initCountdownTimer() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!secsEl) return;

  const durationMs = (3 * 86400 + 14 * 3600 + 28 * 60 + 45) * 1000;
  let targetTime = localStorage.getItem('monolith_countdown_target');

  if (!targetTime || Date.now() >= parseInt(targetTime, 10)) {
    targetTime = Date.now() + durationMs;
    localStorage.setItem('monolith_countdown_target', targetTime);
  } else {
    targetTime = parseInt(targetTime, 10);
  }

  let prevSecs = '', prevMins = '', prevHours = '', prevDays = '';

  function updateTimer() {
    const now = Date.now();
    let diff = Math.max(0, Math.floor((targetTime - now) / 1000));

    if (diff === 0) {
      targetTime = Date.now() + durationMs;
      localStorage.setItem('monolith_countdown_target', targetTime);
      diff = Math.floor(durationMs / 1000);
    }

    const d = Math.floor(diff / 86400);
    const h = Math.floor((diff % 86400) / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;

    const dStr = String(d).padStart(2, '0');
    const hStr = String(h).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    const sStr = String(s).padStart(2, '0');

    setUnitValue(daysEl, dStr, prevDays);
    setUnitValue(hoursEl, hStr, prevHours);
    setUnitValue(minsEl, mStr, prevMins);
    setUnitValue(secsEl, sStr, prevSecs);

    prevDays = dStr;
    prevHours = hStr;
    prevMins = mStr;
    prevSecs = sStr;
  }

  function setUnitValue(el, newVal, oldVal) {
    if (!el) return;
    if (newVal !== oldVal) {
      el.textContent = newVal;
      el.classList.remove('tick-anim');
      void el.offsetWidth;
      el.classList.add('tick-anim');
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

function bindFilterEvents() {
  // Category Checkboxes
  document.querySelectorAll('.filter-category').forEach(cb => {
    cb.addEventListener('change', () => {
      const val = cb.value;
      if (cb.checked) {
        activeFilters.categories.push(val);
      } else {
        activeFilters.categories = activeFilters.categories.filter(c => c !== val);
      }
      applyFilters();
    });
  });

  // Gender Checkboxes
  document.querySelectorAll('.filter-gender').forEach(cb => {
    cb.addEventListener('change', () => {
      const val = cb.value;
      if (cb.checked) {
        activeFilters.genders.push(val);
      } else {
        activeFilters.genders = activeFilters.genders.filter(g => g !== val);
      }
      applyFilters();
    });
  });

  // Size Buttons
  document.querySelectorAll('.filter-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
      const val = btn.dataset.size;
      if (btn.classList.contains('selected')) {
        activeFilters.sizes.push(val);
      } else {
        activeFilters.sizes = activeFilters.sizes.filter(s => s !== val);
      }
      applyFilters();
    });
  });

  // Sort Select
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeFilters.sort = e.target.value;
      applyFilters();
    });
  }
}

function applyFilters() {
  let filtered = PRODUCTS_DATABASE.filter(product => {
    // Category Filter
    if (activeFilters.categories.length > 0 && !activeFilters.categories.includes(product.category)) {
      return false;
    }
    // Gender Filter
    if (activeFilters.genders.length > 0 && !activeFilters.genders.includes(product.gender)) {
      return false;
    }
    // Size Filter
    if (activeFilters.sizes.length > 0 && !product.sizes.some(s => activeFilters.sizes.includes(s))) {
      return false;
    }
    return true;
  });

  // Sort Logic
  if (activeFilters.sort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (activeFilters.sort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (activeFilters.sort === 'newest') {
    filtered.sort((a, b) => b.id - a.id);
  } else if (activeFilters.sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  renderProducts(filtered);
}

function renderProducts(products) {
  const container = document.getElementById('products-grid-container');
  const countEl = document.getElementById('results-count');

  if (!container) return;

  if (countEl) {
    countEl.textContent = `Showing ${products.length} products`;
  }

  if (products.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 5rem 1rem;">
        <h3 style="font-family: Cormorant Garamond, serif; font-size: 2rem;">NO MATCHING PRODUCTS FOUND</h3>
        <p style="color: rgba(17,17,17,0.6);">Try resetting your filters to explore our full collection.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(product => {
    const isWish = isInWishlist(product.id);
    const colorDots = product.colors.map(c => `<span class="color-dot" style="background-color: ${c}"></span>`).join('');
    const stars = '★'.repeat(Math.floor(product.rating)) + (product.rating % 1 !== 0 ? '½' : '');

    return `
      <div class="product-card">
        <div class="product-card-image">
          <span class="product-badge">${product.badge}</span>
          <button class="wishlist-toggle-btn ${isWish ? 'active' : ''}" data-product-id="${product.id}" onclick="handleWishlistClick(event, ${product.id})">
            <i class="${isWish ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
          <a href="Product.html?id=${product.id}">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
          </a>
          <button class="quick-add-btn" onclick="handleQuickAdd(${product.id})">QUICK ADD +</button>
        </div>
        <div class="product-card-content">
          <div class="product-category">${product.category} • ${product.gender}</div>
          <a href="Product.html?id=${product.id}">
            <h3 class="product-title">${product.title}</h3>
          </a>
          <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
          <div class="product-rating">${stars} (${product.rating})</div>
          <div class="color-dots">${colorDots}</div>
        </div>
      </div>
    `;
  }).join('');
}

function handleWishlistClick(e, productId) {
  e.preventDefault();
  e.stopPropagation();
  const product = PRODUCTS_DATABASE.find(p => p.id === productId);
  if (product) {
    toggleWishlist(product);
  }
}

function handleQuickAdd(productId) {
  const product = PRODUCTS_DATABASE.find(p => p.id === productId);
  if (product) {
    addToCart(product, 'M', 'Black', 1);
  }
}
