/**
 * Navigation items — single source of truth for both
 * desktop nav and mobile drawer. Extend with children
 * for mega-menus in a future sprint.
 */
export const NAV_ITEMS = [
  { label: 'Home',       href: '/',            icon: 'Home' },
  { label: 'Shop',       href: '/collections',  icon: 'ShoppingBag' },
  { label: 'Customize',  href: '/studio/new',  icon: 'Palette',
    badge: 'New' },
  { label: 'Bulk Orders', href: '/bulk',         icon: 'Package' },
  { label: 'About',       href: '/about',        icon: 'Info' },
]