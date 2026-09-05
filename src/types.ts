export type NavigationTab = 
  | 'home'
  | 'shop'
  | 'categories'
  | 'triage'
  | 'bnf-checker'
  | 'tracking'
  | 'track-order'
  | 'auto-refill'
  | 'reviews'
  | 'faq'
  | 'support'
  | 'admin';

export type ProductCategory = 
  | 'Sleep Aids'
  | 'Anxiety & Calm'
  | 'Pain Relief'
  | 'Nootropics & Focus';

export interface ProductPackOption {
  id: string;
  label: string; // e.g. "1 Strip (10 Tablets)", "2 Strips (20 Tablets)"
  stripsCount?: number; // e.g. 1, 2, 3, 5, 10
  tabletsCount: number;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  popular?: boolean;
  freeDelivery?: boolean;
}

export interface MedicineProduct {
  id: string;
  slug?: string;
  name: string;
  brand: string;
  genericName: string;
  category: ProductCategory;
  legalCategory: 'POM' | 'P' | 'GSL' | 'CD';
  basePrice: number; // Price for 1 Strip
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  strength: string;
  format: 'Tablets' | 'Capsules' | 'Liquid' | 'Spray' | 'Drops' | 'Cream';
  unitsPerStrip?: number; // e.g. 10 or 14 tablets per strip
  stripSize?: string; // e.g. "10 Tablets / Strip"
  activeIngredient: string;
  packOptions: ProductPackOption[];
  description: string;
  bnfIndication: string;
  dosageAdult: string;
  usageInstructions: string[];
  cautions: string[];
  commonSideEffects: string[];
  badge?: string;
  sku: string;
  tags?: string[];
  isBestSeller?: boolean;
  imageUrl?: string;
  deliveryEstimate: string; // e.g. "Next-Day Delivery via Royal Mail"
  prescriptionRequired: boolean; // Flag if traditionally POM, but dispensary handles clinician sign-off
}

export interface CartItem {
  id: string; // unique item id combining product id and pack id
  product: MedicineProduct;
  selectedPack: ProductPackOption;
  quantity: number;
  isAutoRefill?: boolean;
  autoRefillDays?: 30 | 60 | 90;
}

export type PaymentMethodType = 'bank_transfer' | 'crypto' | 'card' | 'cash_on_delivery';

export interface OrderTrackingStep {
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface OrderRecord {
  id: string; // e.g. "REM-904821"
  date: string;
  createdAt: number;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  loyaltyDiscount: number;
  autoRefillDiscount: number;
  shippingFee: number;
  shippingMethod: 'Royal Mail Tracked 48' | 'Royal Mail Tracked 24 Express' | 'Guaranteed Next-Day Special Delivery (By 1pm)';
  total: number;
  
  // Customer details
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  city: string;
  postcode: string;
  country: string;
  deliveryNotes?: string;
  
  // Payment
  paymentMethod: PaymentMethodType;
  paymentStatus: 'Pending Verification' | 'Paid' | 'Failed' | 'Refunded';
  
  // Order Status
  status: 
    | 'Order Placed & Pending Payment'
    | 'Payment Verified'
    | 'Dispensary Packaging'
    | 'Dispatched (Royal Mail Tracked)'
    | 'Out for Delivery'
    | 'Delivered';
  trackingNumber: string; // e.g. "GB-RM-492049182UK"
  trackingHistory: OrderTrackingStep[];
  
  // Recurring / Refill info
  hasAutoRefill?: boolean;
}

export interface AutoRefillSubscription {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  postcode: string;
  productName: string;
  packLabel: string;
  pricePerRefill: number;
  intervalDays: 30 | 60 | 90;
  nextRefillDate: string;
  status: 'Active' | 'Paused' | 'Cancelled';
  paymentMethod: PaymentMethodType;
  createdDate: string;
}

export interface VerifiedCustomerReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  productPurchased: string;
  verifiedBuyer: boolean;
  title: string;
  comment: string;
  category: ProductCategory;
}

export interface CouponDiscount {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSpend: number;
  description: string;
}

export interface LoyaltyTier {
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  minSpend: number;
  discountPercent: number;
  color: string;
  perks: string[];
}
