export const STAFF_ROLES = [
  'admin',
  'manager',
  'inventory_manager',
  'order_manager',
  'support',
  'marketing',
  'content',
] as const

export const isStaffRole = (role?: string): boolean =>
  !!role && (STAFF_ROLES as readonly string[]).includes(role)

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  manager: 'Manager',
  inventory_manager: 'Inventory Manager',
  order_manager: 'Order Manager',
  support: 'Support',
  marketing: 'Marketing',
  content: 'Content',
}