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
  bonusStrips?: number;
  bonusLabel?: string;
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
  regionalAvailability?: string[]; // Allowed UK regions e.g. ['England', 'Scotland', 'Wales', 'Northern Ireland', 'Highlands & Islands', 'Channel Islands']
  digitalCodes?: string[]; // Digital verification / serial batch codes
  batchNumber?: string;
  expiryDate?: string;
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

  // Fraud / Suspicious Order Review
  isSuspicious?: boolean;
  suspiciousReason?: string;
  fraudRiskScore?: number; // 0 to 100
  reviewStatus?: 'Pending Review' | 'Flagged Suspicious' | 'Verified Safe';
  reviewedBy?: string;
  reviewedAt?: number;

  // Refund Management
  refundStatus?: 'None' | 'Requested' | 'Approved' | 'Rejected';
  refundAmount?: number;
  refundReason?: string;
  refundApprovedAt?: number;
  refundApprovedBy?: string;

  // Financial Breakdown
  gatewayFee?: number;
  netRevenue?: number;

  // Notification Status
  deliveryNotificationSent?: boolean;
  lastNotificationSentAt?: number;
}

export interface AutoRefillSubscription {
  id: string;
  orderId?: string;
  customerName: string;
  email?: string;
  customerEmail?: string;
  phone?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  postcode?: string;
  productName: string;
  packLabel: string;
  pricePerRefill?: number;
  packPrice?: number;
  intervalDays?: 30 | 60 | 90 | number;
  nextRefillDate: string;
  status: 'Active' | 'Paused' | 'Cancelled' | 'active' | 'paused' | 'cancelled';
  paymentMethod?: PaymentMethodType;
  createdDate?: string;
}

export interface VerifiedCustomerReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  productPurchased?: string;
  productName?: string;
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
  expiryDate?: string;
  active?: boolean;
  usageLimit?: number;
  usedCount?: number;
}

export interface LoyaltyTier {
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  minSpend: number;
  discountPercent: number;
  color: string;
  perks: string[];
}

export type StaffRole = 
  | 'Super Admin'
  | 'Finance Manager'
  | 'Order Manager'
  | 'Customer Support'
  | 'Inventory Manager';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  department: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  createdAt: number;
  phone?: string;
  avatarColor?: string;
}

export type AdminMenuKey = 
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'finance'
  | 'inventory'
  | 'staff'
  | 'categories'
  | 'coupons'
  | 'autorefill'
  | 'banners'
  | 'reviews'
  | 'subscribers'
  | 'analytics'
  | 'settings';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  itemCount?: number;
}

export type CategoryDefinition = CategoryItem;

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  ctaText?: string;
  buttonText?: string;
  ctaLinkTab?: string;
  targetTab?: string;
  imageUrl?: string;
  bgGradient?: string;
  gradient?: string;
  active: boolean;
  order: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  active: boolean;
  order: number;
}

export interface SubscriberRecord {
  id: string;
  email: string;
  subscribedAt: number;
  dateStr?: string;
  source?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline?: string;
  gphcRegNumber?: string;
  licenseNumber?: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber?: string;
  address?: string;
  physicalAddress?: string;
  city?: string;
  postcode?: string;
  currency?: string;
  freeShippingThreshold: number;
  adminPin: string;
  tracked48Fee?: number;
  shippingTracked48Fee?: number;
  tracked24Fee?: number;
  shippingTracked24Fee?: number;
  specialDeliveryFee?: number;
  shippingSpecialDeliveryFee?: number;
  dispatchCutoffTime?: string;
  bankName?: string;
  sortCode?: string;
  accountNumber?: string;
  accountName?: string;
  cryptoUsdtTrc20?: string;
  cryptoUsdtWallet?: string;
  cryptoBtcAddress?: string;
  cryptoBtcWallet?: string;
  telegramChatId?: string;
  notifyOnNewOrder?: boolean;
  notifyOnLowStock?: boolean;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  affectedItem: string;
  category: 'Products' | 'Orders' | 'Inventory' | 'Categories' | 'Coupons' | 'Banners' | 'Reviews' | 'FAQ' | 'Settings' | 'Subscribers';
  admin: string;
  timestamp: number;
  details?: string;
}
