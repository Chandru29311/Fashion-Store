/* STACKLY — Product Detail Engine */

let currentSelectedSize = 'M';
let currentSelectedColor = 'Black';
let currentQuantity = 1;
let currentProduct = null;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('product-detail-section')) {
    initProductDetailPage();
  }
});

function initProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id') || '1', 10);
  
  currentProduct = PRODUCTS_DATABASE.find(p => p.id === productId) || PRODUCTS_DATABASE[0];
  
  renderProductDetails(currentProduct);
  initGalleryZoom();
  initTabSwitching();
}

function renderProductDetails(product) {
  // Title & Price & Rating
  const titleEl = document.getElementById('pd-title');
  const priceEl = document.getElementById('pd-price');
  const mainImgEl = document.getElementById('pd-main-img');
  
  if (titleEl) titleEl.textContent = product.title;
  if (priceEl) priceEl.textContent = `₹${product.price.toLocaleString('en-IN')}`;
  if (mainImgEl) mainImgEl.src = product.image;

  // Render Thumbnails
  const thumbGrid = document.getElementById('pd-thumb-grid');
  if (thumbGrid) {
    const thumbs = [
      product.image,
      'assets/product-thumb-1.webp',
      'assets/product-thumb-2.webp',
      'assets/product-thumb-3.webp'
    ];
    
    thumbGrid.innerHTML = thumbs.map((img, i) => `
      <div class="thumb-item ${i === 0 ? 'active' : ''}" onclick="switchMainImage('${img}', this)">
        <img src="${img}" alt="Thumbnail ${i + 1}">
      </div>
    `).join('');
  }

  // Color Selector Setup
  const colorContainer = document.getElementById('pd-color-selector');
  if (colorContainer) {
    const colors = [
      { name: 'Black', hex: '#111111', img: product.image },
      { name: 'Beige', hex: '#F5F2EA', img: 'assets/product-1-beige.webp' },
      { name: 'Brown', hex: '#2A1F18', img: 'assets/product-1-brown.webp' }
    ];
    
    colorContainer.innerHTML = colors.map((c, i) => `
      <div class="color-circle ${i === 0 ? 'selected' : ''}" style="background-color: ${c.hex}; ${c.hex === '#F5F2EA' ? 'border: 1px solid #111;' : ''}" title="${c.name}" onclick="selectColor('${c.name}', '${c.img}', this)"></div>
    `).join('');
  }

  // Size Selector Setup
  const sizeContainer = document.getElementById('pd-size-selector');
  if (sizeContainer) {
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    sizeContainer.innerHTML = sizes.map(s => `
      <div class="size-box ${s === currentSelectedSize ? 'selected' : ''}" onclick="selectSize('${s}', this)">${s}</div>
    `).join('');
  }
}

function switchMainImage(imgUrl, thumbElement) {
  const mainImg = document.getElementById('pd-main-img');
  if (mainImg) {
    mainImg.src = imgUrl;
  }
  document.querySelectorAll('.thumb-item').forEach(el => el.classList.remove('active'));
  if (thumbElement) thumbElement.classList.add('active');
}

function selectColor(colorName, imgUrl, el) {
  currentSelectedColor = colorName;
  document.querySelectorAll('.color-circle').forEach(c => c.classList.remove('selected'));
  if (el) el.classList.add('selected');
  switchMainImage(imgUrl, null);
}

function selectSize(sizeName, el) {
  currentSelectedSize = sizeName;
  document.querySelectorAll('.size-box').forEach(sb => sb.classList.remove('selected'));
  if (el) el.classList.add('selected');

  if (typeof gsap !== 'undefined') {
    gsap.fromTo(el, { scale: 0.9, borderColor: '#B08D57' }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
  }
}

function changeQuantity(delta) {
  currentQuantity = Math.max(1, currentQuantity + delta);
  const qtyValEl = document.getElementById('pd-qty-val');
  if (qtyValEl) qtyValEl.textContent = currentQuantity;
}

function handleAddToCartDetail() {
  const btn = document.getElementById('pd-add-to-cart-btn');
  if (!btn || !currentProduct) return;

  btn.disabled = true;
  btn.textContent = 'ADDING...';

  setTimeout(() => {
    addToCart(currentProduct, currentSelectedSize, currentSelectedColor, currentQuantity);
    btn.textContent = 'ADDED ✓';
    btn.style.backgroundColor = '#B08D57';
    btn.style.color = '#111111';

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'ADD TO CART';
      btn.style.backgroundColor = '';
      btn.style.color = '';
    }, 2000);
  }, 600);
}

function handleBuyNowDetail() {
  if (!currentProduct) return;
  addToCart(currentProduct, currentSelectedSize, currentSelectedColor, currentQuantity);
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartOverlay = document.querySelector('.cart-drawer-overlay');
  if (cartDrawer && cartOverlay) {
    cartOverlay.classList.add('active');
    cartDrawer.classList.add('active');
  }
}

function initGalleryZoom() {
  const container = document.querySelector('.main-image-container');
  const img = document.getElementById('pd-main-img');
  if (!container || !img) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
  });
}

function initTabSwitching() {
  const btns = document.querySelectorAll('.tab-header-btn');
  const contents = document.querySelectorAll('.tab-content');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      btns.forEach(b => b.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const targetContent = document.getElementById(`tab-${target}`);
      if (targetContent) targetContent.classList.add('active');
    });
  });
}
