/* STACKLY — Client Dashboard Controller */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('client-dashboard-page')) {
    if (!requireAuth('Client')) return;

    initClientKPICards();
    renderClientOrders();
    initTrackingTimelineGSAP();
    renderClientWishlist();
    renderClientRecommendations();
  }
});

function initClientKPICards() {
  const cards = document.querySelectorAll('.client-kpi-card');
  if (cards.length > 0 && typeof gsap !== 'undefined') {
    gsap.fromTo(cards, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', clearProps: 'opacity' }
    );
  }
}

function renderClientOrders() {
  const container = document.getElementById('client-orders-container');
  const fullContainer = document.getElementById('client-full-orders-container');
  if (!container && !fullContainer) return;

  const orders = getOrders();
  const html = orders.map(o => `
    <div style="background: #1E1E1E; border: 1px solid rgba(245,242,234,0.1); padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <div style="font-family: Cormorant Garamond, serif; font-size: 1.4rem; font-weight: 600;">${o.item}</div>
        <div style="font-size: 0.85rem; color: #B08D57; font-weight: 600; margin-bottom: 0.2rem;">₹${o.price.toLocaleString('en-IN')}</div>
        <div style="font-size: 0.75rem; color: rgba(245,242,234,0.5);">${o.id} • ${o.date}</div>
      </div>
      <div style="display: flex; align-items: center; gap: 1rem;">
        <span class="status-badge ${o.status === 'Out for Delivery' ? 'status-processing' : 'status-delivered'}">${o.status}</span>
        <button class="btn-outline" style="padding: 0.4rem 1rem; font-size: 0.75rem;" onclick="viewOrderDetails('${o.id}')">VIEW</button>
      </div>
    </div>
  `).join('');

  if (container) container.innerHTML = html;
  if (fullContainer) fullContainer.innerHTML = html;
}

function viewOrderDetails(orderId) {
  return;
}

function handleSendConciergeMessage(event) {
  event.preventDefault();
  const input = document.getElementById('chat-input-field');
  const chatArea = document.getElementById('concierge-chat-area');
  if (!input || !chatArea) return;

  const text = input.value.trim();
  if (!text) return;

  // Append client message
  const clientBubble = document.createElement('div');
  clientBubble.className = 'chat-bubble client';
  clientBubble.textContent = text;
  chatArea.appendChild(clientBubble);

  input.value = '';
  chatArea.scrollTop = chatArea.scrollHeight;

  // Automated reply from Stylist after short delay
  setTimeout(() => {
    const stylistBubble = document.createElement('div');
    stylistBubble.className = 'chat-bubble stylist';
    stylistBubble.textContent = `Thank you for reaching out! I've noted your request regarding "${text.slice(0, 30)}${text.length > 30 ? '...' : ''}". I am personally curating options for you right now.`;
    chatArea.appendChild(stylistBubble);
    chatArea.scrollTop = chatArea.scrollHeight;
  }, 600);
}

function initTrackingTimelineGSAP() {
  const line = document.querySelector('.tracking-progress-line');
  if (line && typeof gsap !== 'undefined') {
    gsap.fromTo(line, 
      { width: '0%' }, 
      { width: '75%', duration: 1.5, ease: 'power2.inOut', delay: 0.3 }
    );
  }
}

function renderClientWishlist() {
  const container = document.getElementById('client-wishlist-container');
  if (!container) return;

  const wishlist = getWishlist();
  if (wishlist.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: rgba(245,242,234,0.5); grid-column: 1 / -1;">
        <i class="fa-regular fa-heart" style="font-size: 2.5rem; margin-bottom: 1rem; color: #B08D57;"></i>
        <p style="font-family: Cormorant Garamond, serif; font-size: 1.4rem; color: #F5F2EA;">YOUR WISHLIST IS EMPTY</p>
        <p style="font-size: 0.85rem;">Explore our shop to save your favorite looks.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = wishlist.map(item => `
    <div style="background: #1E1E1E; border: 1px solid rgba(176,141,87,0.3); padding: 1rem; display: flex; flex-direction: column; gap: 0.8rem;">
      <img src="${item.image}" alt="${item.title}" style="width: 100%; aspect-ratio: 4/5; object-fit: cover;">
      <div>
        <div style="font-family: Cormorant Garamond, serif; font-size: 1.2rem; font-weight: 600;">${item.title}</div>
        <div style="color: #B08D57; font-weight: 600; font-size: 0.95rem;">₹${item.price.toLocaleString('en-IN')}</div>
      </div>
      <div style="display: flex; gap: 0.5rem; margin-top: auto;">
        <a href="Product.html?id=${item.id}" class="btn-primary" style="flex: 1; padding: 0.5rem; font-size: 0.7rem; text-align: center; display: inline-block;">VIEW</a>
        <button class="btn-outline" style="padding: 0.5rem; font-size: 0.7rem;" onclick="removeClientWishlist(${item.id})">REMOVE</button>
      </div>
    </div>
  `).join('');
}

function removeClientWishlist(productId) {
  const wishlist = getWishlist();
  const product = wishlist.find(p => p.id === productId);
  if (product) {
    toggleWishlist(product);
    renderClientWishlist();
  }
}

function renderClientRecommendations() {
  const container = document.getElementById('client-recs-container');
  if (!container) return;

  const recs = PRODUCTS_DATABASE.slice(0, 3);
  container.innerHTML = recs.map(p => `
    <div style="background: #1E1E1E; border: 1px solid rgba(245,242,234,0.1); padding: 1rem;">
      <img src="${p.image}" alt="${p.title}" style="width: 100%; aspect-ratio: 4/5; object-fit: cover; margin-bottom: 0.8rem;">
      <div style="font-size: 0.7rem; color: #B08D57; text-transform: uppercase; letter-spacing: 0.1em;">${p.category}</div>
      <div style="font-family: Cormorant Garamond, serif; font-size: 1.2rem; font-weight: 600; margin: 0.2rem 0;">${p.title}</div>
      <div style="color: #F5F2EA; font-weight: 600; margin-bottom: 0.8rem;">₹${p.price.toLocaleString('en-IN')}</div>
      <a href="Product.html?id=${p.id}" class="btn-outline" style="display: block; text-align: center; padding: 0.5rem; font-size: 0.75rem;">EXPLORE</a>
    </div>
  `).join('');
}
