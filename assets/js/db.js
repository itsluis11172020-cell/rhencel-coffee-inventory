window.DB = {
  KEYS: {
    USERS: 'rh_users',
    PRODUCTS: 'rh_products',
    CATS: 'rh_cats',
    TRX: 'rh_trx',
    LOGS: 'rh_logs',
    SESSION: 'rh_session',
    COUNTERS: 'rh_counters'
  },

  init() {
    if (!localStorage.getItem(this.KEYS.USERS)) this.seed();
  },

  seed() {
    const users = [
      { id: 1, username: 'admin', email: 'admin@rhencel.com', password: 'Admin@123', fullName: 'System Administrator', role: 'owner', isActive: true, createdAt: new Date().toISOString() },
      { id: 2, username: 'staff', email: 'staff@rhencel.com', password: 'Staff@123', fullName: 'Juan Dela Cruz', role: 'staff', isActive: true, createdAt: new Date().toISOString() }
    ];

    const cats = [
      { id: 1, name: 'Coffee Beans', description: 'Various coffee bean varieties' },
      { id: 2, name: 'Syrups', description: 'Flavoring syrups' },
      { id: 3, name: 'Milk & Cream', description: 'Dairy and non-dairy' },
      { id: 4, name: 'Pastries', description: 'Breads and pastries' },
      { id: 5, name: 'Packaging', description: 'Cups, lids, straws' },
      { id: 6, name: 'Cleaning Supplies', description: 'Cleaning materials' }
    ];

    const products = [
      { id: 1, sku: 'COF-001', name: 'Arabica Coffee Beans', categoryId: 1, unit: 'kg', quantity: 25, minQuantity: 10, costPrice: 450, sellingPrice: 650, description: 'Premium Arabica', isActive: true, createdAt: new Date().toISOString() },
      { id: 2, sku: 'COF-002', name: 'Robusta Coffee Beans', categoryId: 1, unit: 'kg', quantity: 8, minQuantity: 10, costPrice: 350, sellingPrice: 500, description: 'Bold Robusta', isActive: true, createdAt: new Date().toISOString() },
      { id: 3, sku: 'SYR-001', name: 'Vanilla Syrup', categoryId: 2, unit: 'bottle', quantity: 15, minQuantity: 5, costPrice: 180, sellingPrice: 280, description: 'Premium vanilla', isActive: true, createdAt: new Date().toISOString() },
      { id: 4, sku: 'SYR-002', name: 'Caramel Syrup', categoryId: 2, unit: 'bottle', quantity: 3, minQuantity: 5, costPrice: 180, sellingPrice: 280, description: 'Rich caramel', isActive: true, createdAt: new Date().toISOString() },
      { id: 5, sku: 'MLK-001', name: 'Fresh Milk', categoryId: 3, unit: 'liter', quantity: 20, minQuantity: 10, costPrice: 85, sellingPrice: 120, description: 'Fresh dairy', isActive: true, createdAt: new Date().toISOString() },
      { id: 6, sku: 'MLK-002', name: 'Oat Milk', categoryId: 3, unit: 'liter', quantity: 5, minQuantity: 8, costPrice: 150, sellingPrice: 220, description: 'Plant-based', isActive: true, createdAt: new Date().toISOString() },
      { id: 7, sku: 'PAS-001', name: 'Croissant', categoryId: 4, unit: 'pcs', quantity: 30, minQuantity: 15, costPrice: 25, sellingPrice: 55, description: 'Butter croissant', isActive: true, createdAt: new Date().toISOString() },
      { id: 8, sku: 'PKG-001', name: 'Paper Cups 12oz', categoryId: 5, unit: 'pack', quantity: 50, minQuantity: 20, costPrice: 120, sellingPrice: 180, description: '50pcs/pack', isActive: true, createdAt: new Date().toISOString() },
      { id: 9, sku: 'PKG-002', name: 'Plastic Lids', categoryId: 5, unit: 'pack', quantity: 12, minQuantity: 20, costPrice: 80, sellingPrice: 130, description: '50pcs/pack', isActive: true, createdAt: new Date().toISOString() },
      { id: 10, sku: 'CLN-001', name: 'Cleaning Solution', categoryId: 6, unit: 'bottle', quantity: 10, minQuantity: 5, costPrice: 95, sellingPrice: 150, description: 'Multi-purpose', isActive: true, createdAt: new Date().toISOString() }
    ];

    const trx = [
      { id: 1, productId: 1, type: 'stock_in', quantity: 10, previousStock: 15, newStock: 25, referenceNo: 'PO-2024-001', notes: 'Initial stock', userId: 1, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: 2, productId: 3, type: 'stock_in', quantity: 5, previousStock: 10, newStock: 15, referenceNo: 'PO-2024-002', notes: 'Restock', userId: 1, createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: 3, productId: 5, type: 'stock_out', quantity: 5, previousStock: 25, newStock: 20, referenceNo: 'SO-2024-001', notes: 'Daily usage', userId: 2, createdAt: new Date(Date.now() - 3600000 * 5).toISOString() }
    ];

    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(this.KEYS.CATS, JSON.stringify(cats));
    localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
    localStorage.setItem(this.KEYS.TRX, JSON.stringify(trx));
    localStorage.setItem(this.KEYS.LOGS, JSON.stringify([]));
    localStorage.setItem(this.KEYS.COUNTERS, JSON.stringify({ users: 3, products: 11, trx: 4, logs: 1 }));
  },

  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
      return [];
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  nextId(key) {
    const counters = JSON.parse(localStorage.getItem(this.KEYS.COUNTERS)) || {};
    counters[key] = counters[key] || 1;
    const id = counters[key];
    counters[key] += 1;
    localStorage.setItem(this.KEYS.COUNTERS, JSON.stringify(counters));
    return id;
  },

  getUsers() {
    return this.get(this.KEYS.USERS);
  },

  getUserById(id) {
    return this.getUsers().find((u) => u.id === id);
  },

  getUserByUsername(input) {
    const value = String(input || '').trim().toLowerCase();
    return this.getUsers().find((u) => u.username.toLowerCase() === value || u.email.toLowerCase() === value);
  },

  saveUser(user) {
    const users = this.getUsers();
    if (user.id) {
      const index = users.findIndex((u) => u.id === user.id);
      if (index !== -1) users[index] = user;
    } else {
      user.id = this.nextId('users');
      user.createdAt = new Date().toISOString();
      users.push(user);
    }
    this.set(this.KEYS.USERS, users);
    return user;
  },

  deleteUser(id) {
    this.set(this.KEYS.USERS, this.getUsers().filter((u) => u.id !== id));
  },

  getCats() {
    return this.get(this.KEYS.CATS);
  },

  getCatById(id) {
    return this.getCats().find((c) => c.id === id);
  },

  getProducts() {
    return this.get(this.KEYS.PRODUCTS);
  },

  getProductById(id) {
    return this.getProducts().find((p) => p.id === id);
  },

  saveProduct(product) {
    const arr = this.getProducts();
    if (product.id) {
      const index = arr.findIndex((x) => x.id === product.id);
      if (index !== -1) {
        arr[index] = { ...arr[index], ...product, updatedAt: new Date().toISOString() };
      }
    } else {
      product.id = this.nextId('products');
      product.isActive = true;
      product.createdAt = new Date().toISOString();
      arr.push(product);
    }
    this.set(this.KEYS.PRODUCTS, arr);
    return product;
  },

  deleteProduct(id) {
    const arr = this.getProducts();
    const index = arr.findIndex((p) => p.id === id);
    if (index !== -1) {
      arr[index].isActive = false;
      this.set(this.KEYS.PRODUCTS, arr);
    }
  },

  getLowStock() {
    return this.getProducts()
      .filter((p) => p.isActive && p.quantity <= p.minQuantity)
      .sort((a, b) => a.quantity - b.quantity);
  },

  getTrx() {
    return this.get(this.KEYS.TRX).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  saveTrx(transaction) {
    const arr = this.get(this.KEYS.TRX);
    transaction.id = this.nextId('trx');
    transaction.createdAt = new Date().toISOString();
    arr.push(transaction);
    this.set(this.KEYS.TRX, arr);
    return transaction;
  },

  getLogs() {
    return this.get(this.KEYS.LOGS).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  addLog(action, details, userId = null) {
    const logs = this.get(this.KEYS.LOGS);
    logs.push({
      id: this.nextId('logs'),
      userId: userId || window.Auth.currentUser?.id,
      action,
      details,
      createdAt: new Date().toISOString()
    });
    this.set(this.KEYS.LOGS, logs);
  },

  getSession() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.SESSION));
    } catch (error) {
      return null;
    }
  },

  setSession(session) {
    localStorage.setItem(this.KEYS.SESSION, JSON.stringify(session));
  },

  clearSession() {
    localStorage.removeItem(this.KEYS.SESSION);
  },

  getStats() {
    const products = this.getProducts().filter((p) => p.isActive);
    const trx = this.getTrx();
    const today = new Date().toDateString();

    return {
      totalProducts: products.length,
      totalValue: products.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0),
      lowStock: products.filter((p) => p.quantity > 0 && p.quantity <= p.minQuantity).length,
      outOfStock: products.filter((p) => p.quantity === 0).length,
      todayTrx: trx.filter((t) => new Date(t.createdAt).toDateString() === today).length,
      totalTrx: trx.length
    };
  }
};

DB.init();
