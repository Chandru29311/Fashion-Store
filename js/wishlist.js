/* STACKLY — Wishlist Manager (localStorage) */
const WISHLIST_STORAGE_KEY = 'stackly_wishlist';

function getWishlist() {
  const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveWishlist(wishlist) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  updateWishlistBadges();
}

function toggleWishlist(product) {
  let wishlist = getWishlist();
  const index = wishlist.findIndex(item => item.id === product.id);
  let isAdded = false;

  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category
    });
    isAdded = true;
  }

  saveWishlist(wishlist);
  updateWishlistUI();
  return isAdded;
}

function isInWishlist(id) {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === id);
}

function getWishlistCount() {
  return getWishlist().length;
}

function updateWishlistBadges() {
  const count = getWishlistCount();
  document.querySelectorAll('.wishlist-count-badge').forEach(badge => {
    badge.textContent = count;
  });
}

function updateWishlistUI() {
  document.querySelectorAll('.wishlist-toggle-btn').forEach(btn => {
    const productId = parseInt(btn.getAttribute('data-product-id'), 10);
    if (productId && isInWishlist(productId)) {
      btn.classList.add('active');
      btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    } else if (productId) {
      btn.classList.remove('active');
      btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateWishlistBadges();
  updateWishlistUI();
});
