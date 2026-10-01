window.Auth = {
  currentUser: null,

  init() {
    const session = DB.getSession();
    if (session && session.userId) {
      const user = DB.getUserById(session.userId);
      if (user && user.isActive) {
        this.currentUser = user;
        return true;
      }
    }

    this.currentUser = null;
    return false;
  },

  login(username, password) {
    if (!username || !password) {
      return { success: false, message: 'Please enter username and password' };
    }

    const user = DB.getUserByUsername(username);
    if (!user) {
      DB.addLog('failed_login', `Failed login: ${username}`);
      return { success: false, message: 'Invalid username or password' };
    }

    if (!user.isActive) {
      return { success: false, message: 'Account is deactivated' };
    }

    if (user.password !== password) {
      DB.addLog('failed_login', `Failed login: ${username}`, user.id);
      return { success: false, message: 'Invalid username or password' };
    }

    this.currentUser = user;
    DB.setSession({
      userId: user.id,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      loginAt: new Date().toISOString()
    });

    DB.addLog('login', 'User logged in', user.id);
    return { success: true };
  },

  logout() {
    if (this.currentUser) {
      DB.addLog('logout', 'User logged out', this.currentUser.id);
    }

    this.currentUser = null;
    DB.clearSession();
    App.showLogin();
  },

  isLoggedIn() {
    if (!this.currentUser) this.init();
    return this.currentUser !== null;
  },

  isOwner() {
    return this.currentUser?.role === 'owner';
  }
};
