window.Pages = {
  dashboard(container) {
    const stats = DB.getStats();
    const lowStock = DB.getLowStock().slice(0, 5);
    const recentTrx = DB.getTrx().slice(0, 5);

    container.innerHTML = `
      <div class="row g-3 mb-4">
        <div class="col-md-6 col-xl-3">
          <div class="stat-card stat-primary">
            <div class="stat-icon"><i class="bi bi-box-seam"></i></div>
            <div class="stat-info"><h3>${stats.totalProducts}</h3><p>Total Products</p></div>
          </div>
        </div>
        <div class="col-md-6 col-xl-3">
          <div class="stat-card stat-success">
            <div class="stat-icon"><i class="bi bi-currency-exchange"></i></div>
            <div class="stat-info"><h3>${Utils.money(stats.totalValue)}</h3><p>Stock Value</p></div>
          </div>
        </div>
        <div class="col-md-6 col-xl-3">
          <div class="stat-card stat-warning">
            <div class="stat-icon"><i class="bi bi-exclamation-triangle"></i></div>
            <div class="stat-info"><h3>${stats.lowStock}</h3><p>Low Stock</p></div>
          </div>
        </div>
        <div class="col-md-6 col-xl-3">
          <div class="stat-card stat-danger">
            <div class="stat-icon"><i class="bi bi-x-circle"></i></div>
            <div class="stat-info"><h3>${stats.outOfStock}</h3><p>Out of Stock</p></div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <h5 class="mb-3"><i class="bi bi-lightning-charge"></i> Quick Actions</h5>
          <div class="d-flex flex-wrap gap-2">
            <button class="btn btn-primary" onclick="Pages.productForm()"><i class="bi bi-plus-circle"></i> Add Product</button>
            <button class="btn btn-success" onclick="Pages.trxForm('stock_in')"><i class="bi bi-box-arrow-in-down"></i> Stock In</button>
            <button class="btn btn-warning" onclick="Pages.trxForm('stock_out')"><i class="bi bi-box-arrow-up"></i> Stock Out</button>
            <button class="btn btn-info" onclick="App.navigate('reports')"><i class="bi bi-file-earmark-bar-graph"></i> Reports</button>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-lg-6">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0"><i class="bi bi-exclamation-triangle text-warning"></i> Low Stock Alerts</h5>
              <a class="btn btn-sm btn-outline-primary" onclick="App.navigate('inventory')">View All</a>
            </div>
            <div class="card-body p-0">
              ${lowStock.length === 0 ? '<div class="empty-state"><i class="bi bi-check-circle"></i>All products well-stocked!</div>' : `
                <div class="table-responsive">
                  <table class="table table-hover mb-0">
                    <thead>
                      <tr><th>Product</th><th>Stock</th><th>Min</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      ${lowStock.map((p) => `
                        <tr>
                          <td><strong>${Utils.esc(p.name)}</strong><br><small class="text-muted">${Utils.esc(p.sku)}</small></td>
                          <td><strong>${p.quantity}</strong> ${Utils.esc(p.unit)}</td>
                          <td>${p.minQuantity}</td>
                          <td>${Utils.stockBadge(p.quantity, p.minQuantity)}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              `}
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0"><i class="bi bi-clock-history"></i> Recent Transactions</h5>
              <a class="btn btn-sm btn-outline-primary" onclick="App.navigate('transactions')">View All</a>
            </div>
            <div class="card-body p-0">
              ${recentTrx.length === 0 ? '<div class="empty-state"><i class="bi bi-inbox"></i>No transactions yet.</div>' : `
                <div class="table-responsive">
                  <table class="table table-hover mb-0">
                    <thead>
                      <tr><th>Product</th><th>Type</th><th>Qty</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      ${recentTrx.map((t) => {
                        const p = DB.getProductById(t.productId);
                        return `
                          <tr>
                            <td>${Utils.esc(p?.name || 'N/A')}</td>
                            <td><span class="badge ${t.type === 'stock_in' ? 'badge-in' : 'badge-out'}">${t.type === 'stock_in' ? 'IN' : 'OUT'}</span></td>
                            <td>${t.quantity}</td>
                            <td><small>${Utils.date(t.createdAt)}</small></td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  products(container) {
    const cats = DB.getCats();
    container.innerHTML = `
      <div class="filter-bar">
        <div class="row g-2 align-items-end">
          <div class="col-md-5">
            <label class="form-label">Search</label>
            <input type="text" class="form-control" id="pSearch" placeholder="Search name or SKU..." />
          </div>
          <div class="col-md-3">
            <label class="form-label">Category</label>
            <select class="form-select" id="pCat">
              <option value="">All Categories</option>
              ${cats.map((c) => `<option value="${c.id}">${Utils.esc(c.name)}</option>`).join('')}
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Stock</label>
            <select class="form-select" id="pStock">
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="out">Out</option>
              <option value="ok">Available</option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn btn-primary w-100" onclick="Pages.productForm()"><i class="bi bi-plus-circle"></i> Add</button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-body p-0" id="productsTable"></div>
      </div>
    `;

    ['pSearch', 'pCat', 'pStock'].forEach((id) => {
      document.getElementById(id).addEventListener('input', Pages.renderProducts);
    });

    Pages.renderProducts();
  },

  renderProducts() {
    const query = document.getElementById('pSearch').value.toLowerCase();
    const cat = document.getElementById('pCat').value;
    const stock = document.getElementById('pStock').value;

    let list = DB.getProducts().filter((p) => p.isActive);

    if (query) {
      list = list.filter((p) => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query));
    }

    if (cat) {
      list = list.filter((p) => p.categoryId == cat);
    }

    if (stock === 'low') {
      list = list.filter((p) => p.quantity > 0 && p.quantity <= p.minQuantity);
    } else if (stock === 'out') {
      list = list.filter((p) => p.quantity === 0);
    } else if (stock === 'ok') {
      list = list.filter((p) => p.quantity > p.minQuantity);
    }

    const el = document.getElementById('productsTable');
    if (list.length === 0) {
      el.innerHTML = '<div class="empty-state"><i class="bi bi-inbox"></i>No products found.</div>';
      return;
    }

    el.innerHTML = `
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead>
            <tr>
              <th>SKU</th><th>Name</th><th>Category</th><th>Stock</th><th>Min</th><th>Cost</th><th>Price</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${list.map((p) => {
              const catInfo = DB.getCatById(p.categoryId);
              return `
                <tr>
                  <td><code>${Utils.esc(p.sku)}</code></td>
                  <td><strong>${Utils.esc(p.name)}</strong></td>
                  <td>${Utils.esc(catInfo?.name || '-')}</td>
                  <td><strong>${p.quantity}</strong> ${Utils.esc(p.unit)}</td>
                  <td>${p.minQuantity}</td>
                  <td>${Utils.money(p.costPrice)}</td>
                  <td>${Utils.money(p.sellingPrice)}</td>
                  <td>${Utils.stockBadge(p.quantity, p.minQuantity)}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="Pages.productForm(${p.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="Pages.deleteProduct(${p.id})"><i class="bi bi-trash"></i></button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  productForm(id = null) {
    const product = id
      ? DB.getProductById(id)
      : { sku: '', name: '', categoryId: '', unit: 'pcs', quantity: 0, minQuantity: 10, costPrice: 0, sellingPrice: 0, description: '' };

    const cats = DB.getCats();
    const body = `
      <form id="productForm">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">SKU *</label>
            <input class="form-control" name="sku" value="${Utils.esc(product.sku)}" required />
          </div>
          <div class="col-md-6">
            <label class="form-label">Name *</label>
            <input class="form-control" name="name" value="${Utils.esc(product.name)}" required />
          </div>
          <div class="col-md-6">
            <label class="form-label">Category</label>
            <select class="form-select" name="categoryId">
              <option value="">-- Select --</option>
              ${cats.map((c) => `<option value="${c.id}" ${product.categoryId == c.id ? 'selected' : ''}>${Utils.esc(c.name)}</option>`).join('')}
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Unit</label>
            <input class="form-control" name="unit" value="${Utils.esc(product.unit)}" placeholder="pcs, kg, liter..." />
          </div>
          <div class="col-md-4">
            <label class="form-label">Quantity</label>
            <input type="number" class="form-control" name="quantity" value="${product.quantity}" min="0" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Min Quantity</label>
            <input type="number" class="form-control" name="minQuantity" value="${product.minQuantity}" min="0" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Cost Price</label>
            <input type="number" step="0.01" class="form-control" name="costPrice" value="${product.costPrice}" min="0" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Selling Price</label>
            <input type="number" step="0.01" class="form-control" name="sellingPrice" value="${product.sellingPrice}" min="0" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Description</label>
            <input class="form-control" name="description" value="${Utils.esc(product.description)}" />
          </div>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
      <button class="btn btn-primary" onclick="Pages.saveProduct(${id || 'null'})"><i class="bi bi-save"></i> Save</button>
    `;

    const modal = App.openModal(id ? 'Edit Product' : 'Add Product', body, footer);
    modal.show();
  },

  saveProduct(id) {
    const form = document.getElementById('productForm');
    const data = {
      sku: form.sku.value.trim(),
      name: form.name.value.trim(),
      categoryId: form.categoryId.value ? parseInt(form.categoryId.value) : null,
      unit: form.unit.value.trim() || 'pcs',
      quantity: parseInt(form.quantity.value) || 0,
      minQuantity: parseInt(form.minQuantity.value) || 0,
      costPrice: parseFloat(form.costPrice.value) || 0,
      sellingPrice: parseFloat(form.sellingPrice.value) || 0,
      description: form.description.value.trim()
    };

    if (!data.sku || !data.name) {
      App.toast('SKU and Name required', 'danger');
      return;
    }

    if (id) data.id = id;
    DB.saveProduct(data);
    DB.addLog(id ? 'update_product' : 'add_product', `Product: ${data.name}`);

    bootstrap.Modal.getInstance(document.getElementById('appModal')).hide();
    App.toast(id ? 'Product updated' : 'Product added');
    Pages.renderProducts();
  },

  deleteProduct(id) {
    const product = DB.getProductById(id);
    if (!product) return;

    if (!confirm(`Delete "${product.name}"?`)) return;

    DB.deleteProduct(id);
    DB.addLog('delete_product', `Product: ${product.name}`);
    App.toast('Product deleted', 'warning');
    Pages.renderProducts();
  },

  transactions(container) {
    const trx = DB.getTrx();
    container.innerHTML = `
      <div class="d-flex flex-wrap gap-2 mb-3">
        <button class="btn btn-success" onclick="Pages.trxForm('stock_in')"><i class="bi bi-box-arrow-in-down"></i> Stock In</button>
        <button class="btn btn-warning" onclick="Pages.trxForm('stock_out')"><i class="bi bi-box-arrow-up"></i> Stock Out</button>
      </div>

      <div class="filter-bar">
        <div class="row g-2 align-items-end">
          <div class="col-md-4">
            <label class="form-label">Search Product</label>
            <input class="form-control" id="tSearch" placeholder="Product name..." />
          </div>
          <div class="col-md-3">
            <label class="form-label">Type</label>
            <select class="form-select" id="tType">
              <option value="">All</option>
              <option value="stock_in">Stock In</option>
              <option value="stock_out">Stock Out</option>
            </select>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body p-0" id="trxTable"></div>
      </div>
    `;

    ['tSearch', 'tType'].forEach((id) => {
      document.getElementById(id).addEventListener('input', Pages.renderTrx);
    });

    Pages.renderTrx();
  },

  renderTrx() {
    const query = document.getElementById('tSearch').value.toLowerCase();
    const type = document.getElementById('tType').value;

    let list = DB.getTrx();
    if (type) list = list.filter((t) => t.type === type);
    if (query) {
      list = list.filter((t) => {
        const product = DB.getProductById(t.productId);
        return product && product.name.toLowerCase().includes(query);
      });
    }

    const el = document.getElementById('trxTable');
    if (list.length === 0) {
      el.innerHTML = '<div class="empty-state"><i class="bi bi-inbox"></i>No transactions found.</div>';
      return;
    }

    el.innerHTML = `
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead>
            <tr><th>#</th><th>Date</th><th>Product</th><th>Type</th><th>Qty</th><th>Before</th><th>After</th><th>Ref</th><th>By</th></tr>
          </thead>
          <tbody>
            ${list.map((t) => {
              const product = DB.getProductById(t.productId);
              const user = DB.getUserById(t.userId);
              return `
                <tr>
                  <td>${t.id}</td>
                  <td><small>${Utils.date(t.createdAt)}</small></td>
                  <td><strong>${Utils.esc(product?.name || 'N/A')}</strong></td>
                  <td><span class="badge ${t.type === 'stock_in' ? 'badge-in' : 'badge-out'}">${t.type === 'stock_in' ? 'IN' : 'OUT'}</span></td>
                  <td>${t.quantity}</td>
                  <td>${t.previousStock}</td>
                  <td><strong>${t.newStock}</strong></td>
                  <td><small>${Utils.esc(t.referenceNo || '-')}</small></td>
                  <td><small>${Utils.esc(user?.fullName || '-')}</small></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  trxForm(type) {
    const products = DB.getProducts().filter((p) => p.isActive);
    const body = `
      <form id="trxForm">
        <div class="mb-3">
          <label class="form-label">Product *</label>
          <select class="form-select" name="productId" required>
            <option value="">-- Select Product --</option>
            ${products.map((p) => `<option value="${p.id}">${Utils.esc(p.name)} (Stock: ${p.quantity} ${p.unit})</option>`).join('')}
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Quantity *</label>
          <input type="number" class="form-control" name="quantity" min="1" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Reference No.</label>
          <input class="form-control" name="referenceNo" placeholder="PO-2024-001" />
        </div>
        <div class="mb-3">
          <label class="form-label">Notes</label>
          <textarea class="form-control" name="notes" rows="2"></textarea>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
      <button class="btn ${type === 'stock_in' ? 'btn-success' : 'btn-warning'}" onclick="Pages.saveTrx('${type}')">
        <i class="bi bi-save"></i> Confirm ${type === 'stock_in' ? 'Stock In' : 'Stock Out'}
      </button>
    `;

    const modal = App.openModal(type === 'stock_in' ? 'Stock In' : 'Stock Out', body, footer);
    modal.show();
  },

  saveTrx(type) {
    const form = document.getElementById('trxForm');
    const productId = parseInt(form.productId.value, 10);
    const quantity = parseInt(form.quantity.value, 10);

    if (!productId || !quantity || quantity < 1) {
      App.toast('Select product and valid quantity', 'danger');
      return;
    }

    const product = DB.getProductById(productId);
    if (!product) {
      App.toast('Product not found', 'danger');
      return;
    }

    if (type === 'stock_out' && quantity > product.quantity) {
      App.toast(`Insufficient stock. Available: ${product.quantity}`, 'danger');
      return;
    }

    const prev = product.quantity;
    const next = type === 'stock_in' ? prev + quantity : prev - quantity;
    product.quantity = next;
    DB.saveProduct(product);

    DB.saveTrx({
      productId,
      type,
      quantity,
      previousStock: prev,
      newStock: next,
      referenceNo: form.referenceNo.value.trim(),
      notes: form.notes.value.trim(),
      userId: Auth.currentUser.id
    });

    DB.addLog(type, `${product.name} qty ${quantity}, new stock ${next}`);
    bootstrap.Modal.getInstance(document.getElementById('appModal')).hide();
    App.toast(`Stock ${type === 'stock_in' ? 'added' : 'removed'} successfully`);
    Pages.renderTrx();
  },

  inventory(container) {
    const stats = DB.getStats();
    container.innerHTML = `
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="stat-card stat-primary">
            <div class="stat-icon"><i class="bi bi-boxes"></i></div>
            <div class="stat-info"><h3>${stats.totalProducts}</h3><p>Active Products</p></div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card stat-warning">
            <div class="stat-icon"><i class="bi bi-exclamation-triangle"></i></div>
            <div class="stat-info"><h3>${stats.lowStock}</h3><p>Low Stock</p></div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card stat-danger">
            <div class="stat-icon"><i class="bi bi-x-circle"></i></div>
            <div class="stat-info"><h3>${stats.outOfStock}</h3><p>Out of Stock</p></div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card stat-success">
            <div class="stat-icon"><i class="bi bi-currency-exchange"></i></div>
            <div class="stat-info"><h3>${Utils.money(stats.totalValue)}</h3><p>Total Value</p></div>
          </div>
        </div>
      </div>

      <div class="filter-bar">
        <div class="row g-2 align-items-end">
          <div class="col-md-6">
            <label class="form-label">Search</label>
            <input class="form-control" id="iSearch" placeholder="Search product..." />
          </div>
          <div class="col-md-3">
            <label class="form-label">Filter</label>
            <select class="form-select" id="iFilter">
              <option value="">All</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
              <option value="ok">Available</option>
            </select>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body p-0" id="invTable"></div>
      </div>
    `;

    ['iSearch', 'iFilter'].forEach((id) => {
      document.getElementById(id).addEventListener('input', Pages.renderInv);
    });

    Pages.renderInv();
  },

  renderInv() {
    const query = document.getElementById('iSearch').value.toLowerCase();
    const filter = document.getElementById('iFilter').value;

    let list = DB.getProducts().filter((p) => p.isActive);

    if (query) {
      list = list.filter((p) => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query));
    }

    if (filter === 'low') {
      list = list.filter((p) => p.quantity > 0 && p.quantity <= p.minQuantity);
    } else if (filter === 'out') {
      list = list.filter((p) => p.quantity === 0);
    } else if (filter === 'ok') {
      list = list.filter((p) => p.quantity > p.minQuantity);
    }

    const el = document.getElementById('invTable');
    if (list.length === 0) {
      el.innerHTML = '<div class="empty-state"><i class="bi bi-inbox"></i>No items.</div>';
      return;
    }

    el.innerHTML = `
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead>
            <tr><th>SKU</th><th>Product</th><th>Category</th><th>Stock</th><th>Min</th><th>Status</th><th>Value</th><th>Last Update</th></tr>
          </thead>
          <tbody>
            ${list.map((p) => {
              const category = DB.getCatById(p.categoryId);
              return `
                <tr>
                  <td><code>${Utils.esc(p.sku)}</code></td>
                  <td><strong>${Utils.esc(p.name)}</strong></td>
                  <td>${Utils.esc(category?.name || '-')}</td>
                  <td><strong>${p.quantity}</strong> ${Utils.esc(p.unit)}</td>
                  <td>${p.minQuantity}</td>
                  <td>${Utils.stockBadge(p.quantity, p.minQuantity)}</td>
                  <td>${Utils.money(p.quantity * p.costPrice)}</td>
                  <td><small>${Utils.date(p.updatedAt || p.createdAt)}</small></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  reports(container) {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    container.innerHTML = `
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="mb-3"><i class="bi bi-funnel"></i> Report Filters</h5>
          <div class="row g-2 align-items-end">
            <div class="col-md-3">
              <label class="form-label">Report Type</label>
              <select class="form-select" id="rType">
                <option value="inventory">Inventory Report</option>
                <option value="low">Low Stock Report</option>
                <option value="transactions">Transaction Report</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Start Date</label>
              <input type="date" class="form-control" id="rStart" value="${firstDay.toISOString().slice(0, 10)}" />
            </div>
            <div class="col-md-3">
              <label class="form-label">End Date</label>
              <input type="date" class="form-control" id="rEnd" value="${today.toISOString().slice(0, 10)}" />
            </div>
            <div class="col-md-3">
              <button class="btn btn-primary w-100" onclick="Pages.renderReport()"><i class="bi bi-search"></i> Generate</button>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body" id="reportOutput">
          <div class="empty-state"><i class="bi bi-file-earmark-bar-graph"></i>Select options and click Generate.</div>
        </div>
      </div>
    `;
  },

  renderReport() {
    const type = document.getElementById('rType').value;
    const start = new Date(document.getElementById('rStart').value);
    const end = new Date(document.getElementById('rEnd').value);
    end.setHours(23, 59, 59, 999);

    const el = document.getElementById('reportOutput');

    if (type === 'inventory') {
      const products = DB.getProducts().filter((p) => p.isActive);
      const total = products.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0);

      el.innerHTML = `
        <h5 class="mb-3">Inventory Report (${products.length} products)</h5>
        <div class="table-responsive">
          <table class="table table-sm table-bordered">
            <thead class="table-light">
              <tr><th>SKU</th><th>Name</th><th>Qty</th><th>Unit Cost</th><th>Total Value</th></tr>
            </thead>
            <tbody>
              ${products.map((p) => `
                <tr>
                  <td>${Utils.esc(p.sku)}</td>
                  <td>${Utils.esc(p.name)}</td>
                  <td>${p.quantity} ${Utils.esc(p.unit)}</td>
                  <td>${Utils.money(p.costPrice)}</td>
                  <td>${Utils.money(p.quantity * p.costPrice)}</td>
                </tr>
              `).join('')}
              <tr class="table-dark">
                <td colspan="4" class="text-end"><strong>Total:</strong></td>
                <td><strong>${Utils.money(total)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        <button class="btn btn-outline-primary mt-3" onclick="window.print()"><i class="bi bi-printer"></i> Print</button>
      `;
      return;
    }

    if (type === 'low') {
      const list = DB.getLowStock();
      el.innerHTML = `
        <h5 class="mb-3">Low Stock Report (${list.length} items)</h5>
        ${list.length === 0 ? '<div class="empty-state"><i class="bi bi-check-circle"></i>No low stock items.</div>' : `
          <div class="table-responsive">
            <table class="table table-sm table-bordered">
              <thead class="table-light">
                <tr><th>SKU</th><th>Name</th><th>Current</th><th>Min</th><th>Shortage</th><th>Status</th></tr>
              </thead>
              <tbody>
                ${list.map((p) => `
                  <tr>
                    <td>${Utils.esc(p.sku)}</td>
                    <td>${Utils.esc(p.name)}</td>
                    <td>${p.quantity} ${Utils.esc(p.unit)}</td>
                    <td>${p.minQuantity}</td>
                    <td class="text-danger"><strong>${Math.max(0, p.minQuantity - p.quantity)}</strong></td>
                    <td>${Utils.stockBadge(p.quantity, p.minQuantity)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <button class="btn btn-outline-primary mt-3" onclick="window.print()"><i class="bi bi-printer"></i> Print</button>
        `}
      `;
      return;
    }

    const list = DB.getTrx().filter((t) => {
      const d = new Date(t.createdAt);
      return d >= start && d <= end;
    });

    const stockInQty = list.filter((t) => t.type === 'stock_in').reduce((sum, t) => sum + t.quantity, 0);
    const stockOutQty = list.filter((t) => t.type === 'stock_out').reduce((sum, t) => sum + t.quantity, 0);

    el.innerHTML = `
      <h5 class="mb-3">Transaction Report (${list.length} records)</h5>
      <div class="row g-2 mb-3">
        <div class="col-md-4"><div class="alert alert-success mb-0">Stock In: <strong>${stockInQty}</strong></div></div>
        <div class="col-md-4"><div class="alert alert-warning mb-0">Stock Out: <strong>${stockOutQty}</strong></div></div>
        <div class="col-md-4"><div class="alert alert-info mb-0">Net: <strong>${stockInQty - stockOutQty}</strong></div></div>
      </div>
      ${list.length === 0 ? '<div class="empty-state"><i class="bi bi-inbox"></i>No transactions in range.</div>' : `
        <div class="table-responsive">
          <table class="table table-sm table-bordered">
            <thead class="table-light">
              <tr><th>Date</th><th>Product</th><th>Type</th><th>Qty</th><th>Before</th><th>After</th><th>Ref</th></tr>
            </thead>
            <tbody>
              ${list.map((t) => {
                const product = DB.getProductById(t.productId);
                return `
                  <tr>
                    <td><small>${Utils.date(t.createdAt)}</small></td>
                    <td>${Utils.esc(product?.name || 'N/A')}</td>
                    <td><span class="badge ${t.type === 'stock_in' ? 'badge-in' : 'badge-out'}">${t.type === 'stock_in' ? 'IN' : 'OUT'}</span></td>
                    <td>${t.quantity}</td>
                    <td>${t.previousStock}</td>
                    <td>${t.newStock}</td>
                    <td><small>${Utils.esc(t.referenceNo || '-')}</small></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
        <button class="btn btn-outline-primary mt-3" onclick="window.print()"><i class="bi bi-printer"></i> Print</button>
      `}
    `;
  },

  users(container) {
    if (!Auth.isOwner()) {
      container.innerHTML = '<div class="alert alert-danger">Access denied.</div>';
      return;
    }

    const users = DB.getUsers();
    container.innerHTML = `
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-primary" onclick="Pages.userForm()"><i class="bi bi-person-plus"></i> Add User</button>
      </div>

      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead>
                <tr><th>Username</th><th>Full Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                ${users.map((u) => `
                  <tr>
                    <td><code>${Utils.esc(u.username)}</code></td>
                    <td>${Utils.esc(u.fullName)}</td>
                    <td>${Utils.esc(u.email)}</td>
                    <td><span class="badge bg-${u.role === 'owner' ? 'primary' : 'secondary'}">${u.role}</span></td>
                    <td>${u.isActive ? '<span class="badge bg-success">Active</span>' : '<span class="badge bg-secondary">Inactive</span>'}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary" onclick="Pages.userForm(${u.id})"><i class="bi bi-pencil"></i></button>
                      ${u.id !== Auth.currentUser.id ? `<button class="btn btn-sm btn-outline-danger" onclick="Pages.deleteUser(${u.id})"><i class="bi bi-trash"></i></button>` : ''}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  userForm(id = null) {
    const user = id ? DB.getUserById(id) : { username: '', email: '', fullName: '', role: 'staff', password: '', isActive: true };
    const body = `
      <form id="userForm">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Username *</label>
            <input class="form-control" name="username" value="${Utils.esc(user.username)}" required />
          </div>
          <div class="col-md-6">
            <label class="form-label">Full Name *</label>
            <input class="form-control" name="fullName" value="${Utils.esc(user.fullName)}" required />
          </div>
          <div class="col-md-6">
            <label class="form-label">Email *</label>
            <input type="email" class="form-control" name="email" value="${Utils.esc(user.email)}" required />
          </div>
          <div class="col-md-6">
            <label class="form-label">Role</label>
            <select class="form-select" name="role">
              <option value="staff" ${user.role === 'staff' ? 'selected' : ''}>Staff</option>
              <option value="owner" ${user.role === 'owner' ? 'selected' : ''}>Owner</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Password ${id ? '(leave blank to keep)' : '*'}</label>
            <input type="text" class="form-control" name="password" ${id ? '' : 'required'} />
          </div>
          <div class="col-md-6">
            <label class="form-label">Status</label>
            <select class="form-select" name="isActive">
              <option value="1" ${user.isActive ? 'selected' : ''}>Active</option>
              <option value="0" ${!user.isActive ? 'selected' : ''}>Inactive</option>
            </select>
          </div>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
      <button class="btn btn-primary" onclick="Pages.saveUser(${id || 'null'})"><i class="bi bi-save"></i> Save</button>
    `;

    const modal = App.openModal(id ? 'Edit User' : 'Add User', body, footer);
    modal.show();
  },

  saveUser(id) {
    const form = document.getElementById('userForm');
    const data = {
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      fullName: form.fullName.value.trim(),
      role: form.role.value,
      isActive: form.isActive.value === '1'
    };

    if (!data.username || !data.email || !data.fullName) {
      App.toast('All required fields', 'danger');
      return;
    }

    if (form.password.value) data.password = form.password.value;

    if (id) {
      data.id = id;
      if (!data.password) delete data.password;
    } else {
      if (!data.password) {
        App.toast('Password required', 'danger');
        return;
      }
    }

    DB.saveUser(data);
    DB.addLog(id ? 'update_user' : 'add_user', `User: ${data.username}`);
    bootstrap.Modal.getInstance(document.getElementById('appModal')).hide();
    App.toast(id ? 'User updated' : 'User added');
    Pages.users(document.getElementById('content'));
  },

  deleteUser(id) {
    const user = DB.getUserById(id);
    if (!user) return;

    if (!confirm(`Delete user "${user.username}"?`)) return;

    DB.deleteUser(id);
    DB.addLog('delete_user', `User: ${user.username}`);
    App.toast('User deleted', 'warning');
    Pages.users(document.getElementById('content'));
  }
};
