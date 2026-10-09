// Antarctic Digital Twin - Centralized Authentication & RBAC Service

export class AuthService {
  constructor() {
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;
    this.subscribers = [];

    // Route Permissions Configuration
    this.routePermissions = {
      // General Common Routes
      dashboard: { roles: ['ADMIN', 'EMPLOYEE'], depts: ['ALL', 'INFRASTRUCTURE', 'ENERGY', 'LOGISTICS', 'ENVIRONMENT', 'RESEARCH', 'MEDICAL', 'COMMUNICATION', 'OPERATIONS'] },
      help: { roles: ['ADMIN', 'EMPLOYEE'], depts: ['ALL', 'INFRASTRUCTURE', 'ENERGY', 'LOGISTICS', 'ENVIRONMENT', 'RESEARCH', 'MEDICAL', 'COMMUNICATION', 'OPERATIONS'] },
      settings: { roles: ['ADMIN', 'EMPLOYEE'], depts: ['ALL', 'INFRASTRUCTURE', 'ENERGY', 'LOGISTICS', 'ENVIRONMENT', 'RESEARCH', 'MEDICAL', 'COMMUNICATION', 'OPERATIONS'] },

      // Command & Intelligence Routes
      tracking: { roles: ['ADMIN', 'EMPLOYEE'], depts: ['ALL', 'LOGISTICS', 'OPERATIONS', 'RESEARCH', 'INFRASTRUCTURE', 'ENVIRONMENT'] },
      liveTracking: { roles: ['ADMIN', 'EMPLOYEE'], depts: ['ALL', 'LOGISTICS', 'OPERATIONS', 'RESEARCH', 'INFRASTRUCTURE', 'ENVIRONMENT'] },
      expeditions: { roles: ['ADMIN', 'EMPLOYEE'], depts: ['ALL', 'LOGISTICS', 'OPERATIONS', 'RESEARCH', 'INFRASTRUCTURE', 'ENVIRONMENT'] },
      routeIntelligence: { roles: ['ADMIN', 'EMPLOYEE'], depts: ['ALL', 'LOGISTICS', 'OPERATIONS', 'RESEARCH', 'INFRASTRUCTURE', 'ENVIRONMENT'] },

      // Department Specific Routes
      energy: { roles: ['ADMIN'], depts: ['ALL', 'ENERGY'] },
      logistics: { roles: ['ADMIN'], depts: ['ALL', 'LOGISTICS'] },
      logisticsCommand: { roles: ['ADMIN'], depts: ['ALL', 'LOGISTICS'] },
      infrastructure: { roles: ['ADMIN'], depts: ['ALL', 'INFRASTRUCTURE'] },
      digitalTwin: { roles: ['ADMIN'], depts: ['ALL', 'INFRASTRUCTURE', 'ENERGY', 'OPERATIONS'] },
      environment: { roles: ['ADMIN'], depts: ['ALL', 'ENVIRONMENT', 'RESEARCH'] },
      envMonitoring: { roles: ['ADMIN'], depts: ['ALL', 'ENVIRONMENT', 'RESEARCH'] },
      research: { roles: ['ADMIN'], depts: ['ALL', 'RESEARCH', 'ENVIRONMENT'] },

      // Operations & Resources
      inventory: { roles: ['ADMIN'], depts: ['ALL', 'LOGISTICS', 'OPERATIONS'] },
      maintenance: { roles: ['ADMIN'], depts: ['ALL', 'INFRASTRUCTURE', 'ENERGY', 'OPERATIONS'] },
      alerts: { roles: ['ADMIN', 'EMPLOYEE'], depts: ['ALL', 'INFRASTRUCTURE', 'ENERGY', 'LOGISTICS', 'ENVIRONMENT', 'RESEARCH', 'OPERATIONS'] },
      personnel: { roles: ['ADMIN'], depts: ['ALL', 'OPERATIONS'] },

      // Admin Only Routes
      roles: { roles: ['ADMIN'], depts: ['ALL'] },
      reports: { roles: ['ADMIN', 'EMPLOYEE'], depts: ['ALL', 'INFRASTRUCTURE', 'ENERGY', 'LOGISTICS', 'ENVIRONMENT', 'RESEARCH', 'OPERATIONS'] }
    };

    // Attempt restoring session from local storage cache initially
    try {
      const cached = localStorage.getItem('ao_user_session');
      if (cached) {
        const parsed = JSON.parse(cached);
        this.user = parsed.user;
        this.token = parsed.token;
        this.isAuthenticated = !!this.user;
      }
    } catch {
      // Storage access error or invalid JSON
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(cb => cb(this.user, this.isAuthenticated));
  }

  async restoreSession() {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const res = await fetch('/api/auth/me', {
        headers,
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          this.user = data.user;
          this.isAuthenticated = true;
          this.persist();
          this.notify();
          return this.user;
        }
      }
      this.clearSession();
      return null;
    } catch {
      return this.user;
    }
  }

  async login(identifier, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ identifier, password })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login failed. Please check credentials.');
    }

    this.user = data.user;
    this.token = data.token;
    this.isAuthenticated = true;
    this.persist();
    this.notify();

    return data.user;
  }

  applyDevDemoSession() {
    if (!import.meta.env.DEV) return false;

    this.user = {
      _id: 'dev-demo-user',
      name: 'Development Operator',
      email: 'dev@polar-twin.local',
      role: 'ADMIN',
      department: 'ALL',
      station: 'MAITRI',
      permissions: ['admin.all']
    };
    this.token = null;
    this.isAuthenticated = true;
    this.notify();
    return true;
  }

  async logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch {
      // Ignore network errors during logout
    }

    this.clearSession();
    this.notify();
  }

  async updateProfile(data) {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const res = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Failed to update profile.');
    }

    this.user = result.user;
    this.persist();
    this.notify();
    return result.user;
  }

  persist() {
    try {
      if (this.user && this.token) {
        localStorage.setItem('ao_user_session', JSON.stringify({
          user: this.user,
          token: this.token
        }));
      }
    } catch {
      // Storage access error
    }
  }

  clearSession() {
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;
    try {
      localStorage.removeItem('ao_user_session');
    } catch {
      // Storage access error
    }
  }

  hasRole(role) {
    if (!this.user) return false;
    return this.user.role === role;
  }

  hasDepartment(dept) {
    if (!this.user) return false;
    if (this.user.role === 'ADMIN' || this.user.department === 'ALL') return true;
    return this.user.department === dept;
  }

  hasPermission(permissionKey) {
    if (!this.user) return false;
    if (this.user.role === 'ADMIN' || (this.user.permissions && this.user.permissions.includes('admin.all'))) {
      return true;
    }
    return Array.isArray(this.user.permissions) && this.user.permissions.includes(permissionKey);
  }

  canAccessRoute(routeId) {
    if (!this.isAuthenticated || !this.user) return false;
    if (this.user.role === 'ADMIN' || this.user.department === 'ALL') return true;

    const rule = this.routePermissions[routeId];
    if (!rule) return true; // Default allow if not explicitly locked

    // Check role condition
    if (rule.roles && !rule.roles.includes(this.user.role)) {
      return false;
    }

    // Check department condition
    if (rule.depts && !rule.depts.includes(this.user.department) && !rule.depts.includes('ALL')) {
      return false;
    }

    return true;
  }

  getDefaultRoute() {
    if (!this.user) return 'dashboard';
    if (this.user.role === 'ADMIN') return 'dashboard';

    switch (this.user.department) {
      case 'ENERGY':
        return 'energy';
      case 'LOGISTICS':
        return 'logistics';
      case 'ENVIRONMENT':
        return 'environment';
      case 'INFRASTRUCTURE':
        return 'infrastructure';
      case 'RESEARCH':
        return 'research';
      default:
        return 'dashboard';
    }
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }
}

export const authService = new AuthService();
