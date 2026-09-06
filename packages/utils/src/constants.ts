export const AGE_GROUPS = [
  { key: '0-12', label: '0-12 Months', min: 0, max: 1 },
  { key: '1-2', label: '1-2 Years', min: 1, max: 2 },
  { key: '3-5', label: '3-5 Years', min: 3, max: 5 },
  { key: '6-8', label: '6-8 Years', min: 6, max: 8 },
  { key: '9-12', label: '9-12 Years', min: 9, max: 12 },
  { key: '13', label: '13+ Years', min: 13, max: 99 },
] as const;

export const ROLES = [
  'customer',
  'admin',
  'manager',
  'inventory_manager',
  'order_manager',
  'support',
  'marketing',
  'content',
] as const;

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'packed',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'returned',
  'refund_requested',
  'refunded',
  'failed',
] as const;

export const PAYMENT_METHODS = ['cod', 'card', 'jazzcash', 'easypaisa', 'raast'] as const;

export const SHIPPING_METHODS = ['standard', 'express', 'same_day'] as const;

export const EDUCATIONAL_BENEFITS = [
  'STEM',
  'Mathematics',
  'Science',
  'Language',
  'Creativity',
  'Problem Solving',
  'Memory',
  'Fine Motor Skills',
  'Gross Motor Skills',
  'Social Skills',
  'Imagination',
  'Logic',
] as const;

export const MATERIALS = [
  'Plastic',
  'Wood',
  'Fabric',
  'Metal',
  'Rubber',
  'Cardboard',
  'Silicone',
  'Mixed',
] as const;

export const LOYALTY_TIERS = {
  bronze: { minSpent: 0, multiplier: 1 },
  silver: { minSpent: 20000, multiplier: 1.25 },
  gold: { minSpent: 50000, multiplier: 1.5 },
  vip: { minSpent: 100000, multiplier: 2 },
} as const;

export const POINTS_TO_RUPEE = 1000; // 1000 points = Rs. 100

export const REPORT_REASONS = [
  'Inappropriate content',
  'Spam or fake review',
  'Wrong product',
  'Misleading information',
  'Other',
] as const;
