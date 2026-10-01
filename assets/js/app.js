window.App = {
  currentPage: 'dashboard',

  init() {
    document.getElementById('todayDate').textContent = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;
      const result = Auth.login(username, password);

      if (result.success) {
        this.showApp();
      } else {
        this.alert('loginAlert', result.message, 'danger');
      }
    });

    document.getElementById('togglePw').addEventListener('click', function () {
      const passwordField = document.getElementById('loginPassword');
      const icon = this.querySelector('i');

      if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.className = 'bi bi-eye-slash';
      } else {
        passwordField.type = 'password';
        icon.className = 'bi bi-eye';
      }
    });

    document.querySelectorAll('.sidebar-nav a').forEach((link) => {
      link.addEventListener('click', () => this.navigate(link.dataset.page));
    });

    document.getElementById('sidebarToggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('show');
    });

    if (Auth.isLoggedIn()) {
      this.showApp();
    } else {
      this.showLogin();
    }
  },

  alert(containerId, message, type = 'danger') {
    const el = document.getElementById(containerId);
    if (el) {
      el.innerHTML = `<div class="alert alert-${type}"><i class="bi bi-exclamation-triangle-fill"></i> ${Utils.esc(message)}</div>`;
    }
  },

  showLogin() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
  },

  showApp() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('sidebarName').textContent = Auth.currentUser.fullName;
    document.getElementById('sidebarRole').textContent = Auth.currentUser.role.charAt(0).toUpperCase() + Auth.currentUser.role.slice(1);
    document.getElementById('navUsers').style.display = Auth.isOwner() ? '' : 'none';
    this.navigate('dashboard');
  },

  navigate(page) {
    this.currentPage = page;

    document.querySelectorAll('.sidebar-nav a').forEach((link) => {
      link.classList.toggle('active', link.dataset.page === page);
    });

    document.getElementById('sidebar').classList.remove('show');

    const titles = {
      dashboard: 'Dashboard',
      products: 'Products & Supplies',
      transactions: 'Stock Transactions',
      inventory: 'Inventory Monitoring',
      reports: 'Reports',
      users: 'User Management'
    };

    document.getElementById('pageTitle').textContent = titles[page] || page;

    const container = document.getElementById('content');

    if (page === 'dashboard') Pages.dashboard(container);
    else if (page === 'products') Pages.products(container);
    else if (page === 'transactions') Pages.transactions(container);
    else if (page === 'inventory') Pages.inventory(container);
    else if (page === 'reports') Pages.reports(container);
    else if (page === 'users') Pages.users(container);
  },

  toast(message, type = 'success') {
    const id = 't' + Date.now();
    const icons = {
      success: 'check-circle-fill',
      danger: 'x-circle-fill',
      warning: 'exclamation-triangle-fill',
      info: 'info-circle-fill'
    };

    const html = `
      <div id="${id}" class="toast align-items-center text-bg-${type} border-0" role="alert">
        <div class="d-flex">
          <div class="toast-body"><i class="bi bi-${icons[type]}"></i> ${Utils.esc(message)}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>`;

    document.getElementById('toastContainer').insertAdjacentHTML('beforeend', html);
    const el = document.getElementById(id);
    const toast = new bootstrap.Toast(el, { delay: 3000 });
    toast.show();
    el.addEventListener('hidden.bs.toast', () => el.remove());
  },

  openModal(title, bodyHtml, footerHtml) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = bodyHtml;
    document.getElementById('modalFooter').innerHTML = footerHtml;
    return new bootstrap.Modal(document.getElementById('appModal'));
  }
};
