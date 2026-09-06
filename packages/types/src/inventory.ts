export interface Inventory {
  _id: string;
  product: string;
  variant?: string;
  warehouse: string;
  sku: string;
  barcode: string;
  stock: number;
  reservedStock: number;
  availableStock: number;
  damagedStock: number;
  returnedStock: number;
  lowStockThreshold: number;
  batchNumber?: string;
  expiryDate?: string;
  lastRestockedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type InventoryLogType =
  | 'in'
  | 'out'
  | 'adjustment'
  | 'return'
  | 'damaged'
  | 'transfer';

export interface InventoryLog {
  _id: string;
  inventory: string;
  product: string;
  type: InventoryLogType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  reference?: string;
  performedBy: string;
  createdAt: string;
}

export interface Supplier {
  _id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  products: string[];
  balance: number;
  totalPurchases: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
  rating: number;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type PurchaseOrderStatus = 'pending' | 'ordered' | 'shipped' | 'received' | 'cancelled';

export interface PurchaseOrder {
  _id: string;
  poNumber: string;
  supplier: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: PurchaseOrderStatus;
  expectedDelivery?: string;
  receivedDate?: string;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paidAmount: number;
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  _id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  manager?: string;
  isActive: boolean;
  totalProducts: number;
  createdAt: string;
  updatedAt: string;
}
