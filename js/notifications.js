/* STACKLY — Notifications Helper Module */

const SYSTEM_NOTIFICATIONS = [
  { id: 1, title: 'New Order Received', desc: 'Order #ORD-1024 received from client', time: '10 mins ago' },
  { id: 2, title: 'Low Stock Alert', desc: 'Urban Runner X — Size M (3 left)', time: '1 hour ago' },
  { id: 3, title: 'New Product Review', desc: '5-star review received for Street Classic', time: '3 hours ago' },
  { id: 4, title: 'Return Request', desc: 'Order #ORD-1018 item inquiry', time: '1 day ago' }
];

function getNotifications() {
  const stored = localStorage.getItem('stackly_notifications');
  if (!stored) {
    localStorage.setItem('stackly_notifications', JSON.stringify(SYSTEM_NOTIFICATIONS));
    return SYSTEM_NOTIFICATIONS;
  }
  return JSON.parse(stored);
}
