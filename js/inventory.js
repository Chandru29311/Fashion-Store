/* STACKLY — Inventory Tracker Module */

const INVENTORY_ITEMS = [
  { id: 1, title: 'Urban Runner X', size: 'M', stock: 3, status: 'LOW STOCK' },
  { id: 4, title: 'Classic Oversized Shirt', size: 'L', stock: 2, status: 'LOW STOCK' },
  { id: 3, title: 'Flex Motion Jacket', size: 'S', stock: 0, status: 'OUT OF STOCK' }
];

function getInventoryAlerts() {
  return INVENTORY_ITEMS;
}
