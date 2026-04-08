export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    MENU: '/menu',
    GAMES: '/games',
    CHECKOUT: '/checkout',
    LOGIN: '/login',
  },
  DASHBOARD: {
    ROOT: '/dashboard',
    SETTINGS: '/dashboard/settings',
    PRODUCTS: '/dashboard/products',
  },
  ADMIN: {
    LOGIN: '/admin/login',
  }
} as const;
