/* STACKLY — Cart Manager (localStorage) */
const CART_STORAGE_KEY = 'stackly_cart';

function getCart() {
  const data = localStorage.getItem(CART_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadges();
  renderCartDrawer();
}

function addToCart(product, size = 'M', color = 'Default', qty = 1) {
  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === product.id && item.size === size && item.color === color);
  
  if (existingIndex > -1) {
    cart[existingIndex].qty += qty;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      size: size,
      color: color,
      qty: qty
    });
  }
  
  saveCart(cart);
}

function removeFromCart(id, size, color) {
  let cart = getCart();
  cart = cart.filter(item => !(item.id === id && item.size === size && item.color === color));
  saveCart(cart);
}

function updateCartQuantity(id, size, color, newQty) {
  const cart = getCart();
  const item = cart.find(item => item.id === id && item.size === size && item.color === color);
  if (item) {
    if (newQty <= 0) {
      removeFromCart(id, size, color);
    } else {
      item.qty = newQty;
      saveCart(cart);
    }
  }
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getCartSubtotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function updateCartBadges() {
  const count = getCartCount();
  document.querySelectorAll('.cart-count-badge').forEach(badge => {
    badge.textContent = count;
  });
}

function renderCartDrawer() {
  const body = document.getElementById('cart-drawer-body');
  const totalEl = document.getElementById('cart-drawer-total');
  if (!body) return;

  const cart = getCart();
  if (cart.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem; color: rgba(17,17,17,0.5);">
        <i class="fa-solid fa-bag-shopping" style="font-size: 3rem; margin-bottom: 1rem; color: #B08D57;"></i>
        <p style="font-family: Cormorant Garamond, serif; font-size: 1.5rem; color: #111;">YOUR CART IS EMPTY</p>
        <p style="font-size: 0.85rem;">Discover our latest fashion drops.</p>
        <a href="Shop.html" class="btn-primary" style="margin-top: 1.5rem;">EXPLORE SHOP</a>
      </div>
    `;
    if (totalEl) totalEl.textContent = '₹0';
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title}</div>
        <div style="font-size: 0.75rem; color: rgba(17,17,17,0.5); text-transform: uppercase; margin-bottom: 0.3rem;">Size: ${item.size} | ${item.color}</div>
        <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateCartQuantity(${item.id}, '${item.size}', '${item.color}', ${item.qty - 1})"><i class="fa-solid fa-minus"></i></button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQuantity(${item.id}, '${item.size}', '${item.color}', ${item.qty + 1})"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id}, '${item.size}', '${item.color}')">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `).join('');

  if (totalEl) {
    totalEl.textContent = `₹${getCartSubtotal().toLocaleString('en-IN')}`;
  }
}

function showToast(message, redirect404 = true) {
  return;
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadges();
  renderCartDrawer();
});
