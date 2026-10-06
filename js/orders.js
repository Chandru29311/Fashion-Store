/* STACKLY — Inventory, Orders & Notifications Helpers */

// Stock & Inventory Data
const INVENTORY_DATA = [
  { id: 1, title: 'Urban Runner X', size: 'M', stock: 3, status: 'LOW STOCK' },
  { id: 4, title: 'Classic Oversized Shirt', size: 'L', stock: 2, status: 'LOW STOCK' },
  { id: 3, title: 'Flex Motion Jacket', size: 'S', stock: 0, status: 'OUT OF STOCK' }
];

function getInventoryAlerts() {
  return INVENTORY_DATA;
}

// Orders Data Store
const INITIAL_ORDERS = [
  { id: '#ORD-1024', item: 'Urban Runner X', price: 5499, status: 'Out for Delivery', date: 'Oct 01, 2026', customer: 'Yukeshyuki18' },
  { id: '#ORD-1023', item: 'Street Classic', price: 4299, status: 'Shipped', date: 'Sep 29, 2026', customer: 'Arun K' },
  { id: '#ORD-1022', item: 'Air Flex Pro', price: 6999, status: 'Delivered', date: 'Sep 27, 2026', customer: 'Priya M' },
  { id: '#ORD-1018', item: 'Court Tailored Blazer', price: 8999, status: 'Delivered', date: 'Sep 20, 2026', customer: 'Yukeshyuki18' }
];

function getOrders() {
  const data = localStorage.getItem('stackly_orders');
  if (!data) {
    localStorage.setItem('stackly_orders', JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }
  return JSON.parse(data);
}

// Notifications Store
const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'New Order Received', desc: 'Order #ORD-1024 received from client', time: '10 mins ago' },
  { id: 2, title: 'Low Stock Alert', desc: 'Urban Runner X — Size M (3 left)', time: '1 hour ago' },
  { id: 3, title: 'New Product Review', desc: '5-star review received for Street Classic', time: '3 hours ago' },
  { id: 4, title: 'Return Request', desc: 'Order #ORD-1018 item inquiry', time: '1 day ago' }
];

function getNotifications() {
  const data = localStorage.getItem('stackly_notifications');
  if (!data) {
    localStorage.setItem('stackly_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  return JSON.parse(data);
}
