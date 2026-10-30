import { 
  db, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot 
} from './firebase';
import { 
  OrderRecord, 
  CartItem, 
  AutoRefillSubscription, 
  VerifiedCustomerReview,
  MedicineProduct,
  CouponDiscount,
  CategoryItem,
  BannerItem,
  FAQItem,
  SubscriberRecord,
  StoreSettings,
  AuditLogEntry,
  StaffMember
} from '../types';
import { REST_EASY_PRODUCTS, VERIFIED_REVIEWS, COUPON_CODES, FREQUENTLY_ASKED_QUESTIONS } from '../data/medicineCatalog';

// Firestore Collection Constants
export const PRODUCTS_COLLECTION = 'products';
export const ORDERS_COLLECTION = 'orders';
export const AUTO_REFILLS_COLLECTION = 'autoRefills';
export const REVIEWS_COLLECTION = 'reviews';
export const CART_COLLECTION = 'carts';
export const COUPONS_COLLECTION = 'coupons';
export const CONSULTATIONS_COLLECTION = 'consultations';
export const SETTINGS_COLLECTION = 'settings';
export const CATEGORIES_COLLECTION = 'categories';
export const BANNERS_COLLECTION = 'banners';
export const FAQS_COLLECTION = 'faqs';
export const SUBSCRIBERS_COLLECTION = 'subscribers';
export const AUDIT_LOGS_COLLECTION = 'auditLogs';
export const STAFF_COLLECTION = 'staff';

function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (key, value) => {
    return value === undefined ? null : value;
  }));
}

/**
 * Seed and persist all product catalog, coupons, reviews, and initial dispensary records into Firebase Firestore
 */
export async function seedInitialFirestoreData(forceOverwrite: boolean = false) {
  try {
    // 1. Seed Products Catalog into Firestore if empty or forced
    const productsSnap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (productsSnap.empty || forceOverwrite) {
      console.log(`[Firebase] Initializing all ${REST_EASY_PRODUCTS.length} medications in Firestore...`);
      for (const prod of REST_EASY_PRODUCTS) {
        await setDoc(doc(db, PRODUCTS_COLLECTION, prod.id), sanitizeForFirestore({
          ...prod,
          updatedAt: Date.now()
        }), { merge: true });
      }
      console.log('[Firebase] All medications successfully persisted to Firestore.');
    }

    // 2. Seed Coupons into Firestore
    const couponsSnap = await getDocs(collection(db, COUPONS_COLLECTION));
    if (couponsSnap.empty || forceOverwrite) {
      console.log('[Firebase] Initializing discount coupons in Firestore...');
      for (const coup of COUPON_CODES) {
        await setDoc(doc(db, COUPONS_COLLECTION, coup.code), sanitizeForFirestore(coup), { merge: true });
      }
    }

    // 3. Seed Reviews into Firestore
    const reviewsSnap = await getDocs(collection(db, REVIEWS_COLLECTION));
    if (reviewsSnap.empty || forceOverwrite) {
      console.log('[Firebase] Initializing verified reviews in Firestore...');
      for (const rev of VERIFIED_REVIEWS) {
        await setDoc(doc(db, REVIEWS_COLLECTION, rev.id), sanitizeForFirestore({
          ...rev,
          createdAt: Date.now()
        }), { merge: true });
      }
    }

    // 4. Seed Sample Initial Orders & Subscriptions if empty
    const ordersSnap = await getDocs(collection(db, ORDERS_COLLECTION));
    if (ordersSnap.empty) {
      console.log('[Firebase] Initializing sample UK dispensary orders in Firestore...');
      
      const sampleOrder1: OrderRecord = {
        id: "REM-849201",
        createdAt: Date.now() - 86400000 * 1.5,
        date: new Date(Date.now() - 86400000 * 1.5).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: [
          {
            id: "rem-zopiclone-75-zop-28",
            product: REST_EASY_PRODUCTS[0],
            selectedPack: REST_EASY_PRODUCTS[0].packOptions[1],
            quantity: 1,
            isAutoRefill: true,
            autoRefillDays: 30
          }
        ],
        subtotal: 48.99,
        discount: 4.90,
        loyaltyDiscount: 0.98,
        autoRefillDiscount: 4.90,
        shippingFee: 0,
        shippingMethod: "Royal Mail Tracked 24 Express",
        total: 38.21,
        customerName: "David Henderson",
        email: "david.henderson@example.co.uk",
        phone: "07700 900821",
        deliveryAddress: "14 Belgrave Crescent",
        city: "Manchester",
        postcode: "M4 5AB",
        country: "United Kingdom",
        deliveryNotes: "Leave in secure porch if not home.",
        paymentMethod: "bank_transfer",
        paymentStatus: "Paid",
        status: "Dispatched (Royal Mail Tracked)",
        trackingNumber: "GB-RM-948210492UK",
        trackingHistory: [
          { title: "Order Received", description: "Order confirmed via UK Fast Bank Transfer", timestamp: "Yesterday 09:14 AM", completed: true },
          { title: "Clinical Verification", description: "In-house prescriber approved prescription dispense", timestamp: "Yesterday 09:30 AM", completed: true },
          { title: "Discreet Packaging", description: "Packed in plain brown unbranded protective envelope", timestamp: "Yesterday 11:45 AM", completed: true },
          { title: "Dispatched with Royal Mail", description: "Handed over to Royal Mail North West Sorting Depot", timestamp: "Yesterday 04:20 PM", completed: true, current: true },
          { title: "Out for Delivery", description: "With local Royal Mail postie", timestamp: "Expected Today by 1:00 PM", completed: false }
        ],
        hasAutoRefill: true
      };

      const sampleOrder2: OrderRecord = {
        id: "REM-729482",
        createdAt: Date.now() - 86400000 * 3,
        date: new Date(Date.now() - 86400000 * 3).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: [
          {
            id: "rem-modafinil-200-mod-30",
            product: REST_EASY_PRODUCTS.find(p => p.id === 'rem-modafinil-200') || REST_EASY_PRODUCTS[0],
            selectedPack: (REST_EASY_PRODUCTS.find(p => p.id === 'rem-modafinil-200') || REST_EASY_PRODUCTS[0]).packOptions[0],
            quantity: 1
          }
        ],
        subtotal: 64.99,
        discount: 3.25,
        loyaltyDiscount: 3.25,
        autoRefillDiscount: 0,
        shippingFee: 0,
        shippingMethod: "Guaranteed Next-Day Special Delivery (By 1pm)",
        total: 61.74,
        customerName: "Sarah Jenkins",
        email: "sarah.j@example.co.uk",
        phone: "07700 900331",
        deliveryAddress: "88 Kingsway Road",
        city: "London",
        postcode: "WC2B 6AH",
        country: "United Kingdom",
        paymentMethod: "card",
        paymentStatus: "Paid",
        status: "Delivered",
        trackingNumber: "GB-RM-728190382UK",
        trackingHistory: [
          { title: "Order Received", description: "Card payment confirmed", timestamp: "3 days ago", completed: true },
          { title: "Dispatched with Royal Mail", description: "Royal Mail Special Delivery 1pm", timestamp: "2 days ago", completed: true },
          { title: "Delivered", description: "Signed for by resident", timestamp: "Yesterday 11:20 AM", completed: true, current: true }
        ]
      };

      await setDoc(doc(db, ORDERS_COLLECTION, sampleOrder1.id), sanitizeForFirestore(sampleOrder1));
      await setDoc(doc(db, ORDERS_COLLECTION, sampleOrder2.id), sanitizeForFirestore(sampleOrder2));

      // Add subscription to autoRefills
      const sub1: AutoRefillSubscription = {
        id: "SUB-94021",
        orderId: "REM-849201",
        customerName: "David Henderson",
        email: "david.henderson@example.co.uk",
        phone: "07700 900821",
        deliveryAddress: "14 Belgrave Crescent, Manchester",
        postcode: "M4 5AB",
        productName: "Zopiclone 7.5mg Tablets",
        packLabel: "28 Tablets (1 Month Supply)",
        pricePerRefill: 44.09,
        intervalDays: 30,
        nextRefillDate: new Date(Date.now() + 86400000 * 27).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: "Active",
        paymentMethod: "bank_transfer",
        createdDate: "Yesterday"
      };
      await setDoc(doc(db, AUTO_REFILLS_COLLECTION, sub1.id), sanitizeForFirestore(sub1));
    }
  } catch (err) {
    console.warn('[Firebase] Firestore initial data seed notice:', err);
  }
}

// ─────────────────────────────────────────────────────────────
// 1. PRODUCTS IN FIRESTORE (Full Dynamic Catalog)
// ─────────────────────────────────────────────────────────────

export async function getProductsFromFirestore(): Promise<MedicineProduct[]> {
  try {
    const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const list: MedicineProduct[] = [];
    snap.forEach((d) => {
      list.push(d.data() as MedicineProduct);
    });
    if (list.length > 0) {
      return list;
    }
  } catch (err) {
    console.warn('[Firebase] Products fetch notice, using default catalog:', err);
  }
  return REST_EASY_PRODUCTS;
}

export function listenToProductsFromFirestore(callback: (products: MedicineProduct[]) => void): () => void {
  try {
    const unsub = onSnapshot(collection(db, PRODUCTS_COLLECTION), (snap) => {
      const list: MedicineProduct[] = [];
      snap.forEach((d) => {
        list.push(d.data() as MedicineProduct);
      });
      if (list.length > 0) {
        callback(list);
      } else {
        callback(REST_EASY_PRODUCTS);
      }
    }, (error) => {
      console.warn('[Firebase] Products listener notice:', error);
      callback(REST_EASY_PRODUCTS);
    });
    return unsub;
  } catch (err) {
    console.warn('[Firebase] Products snapshot error:', err);
    callback(REST_EASY_PRODUCTS);
    return () => {};
  }
}

export async function saveProductToFirestore(product: MedicineProduct): Promise<boolean> {
  try {
    const prodRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(prodRef, sanitizeForFirestore({
      ...product,
      updatedAt: Date.now()
    }), { merge: true });
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to save product:', err);
    return false;
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<boolean> {
  try {
    const prodRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(prodRef);
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to delete product:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// 2. CART FIRESTORE SYNC (Persistent Realtime Cart)
// ─────────────────────────────────────────────────────────────

export function getDeviceId(): string {
  if (typeof window !== 'undefined') {
    let devId = (window as any).__dispensary_session_id;
    if (!devId) {
      devId = 'session_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      (window as any).__dispensary_session_id = devId;
    }
    return devId;
  }
  return 'dispensary_default_cart';
}

export async function saveCartToFirestore(deviceId: string, items: CartItem[]): Promise<void> {
  try {
    const cartRef = doc(db, CART_COLLECTION, deviceId);
    await setDoc(cartRef, sanitizeForFirestore({
      items,
      updatedAt: Date.now()
    }));
  } catch (err) {
    console.warn('[Firebase] Failed to save cart in Firestore:', err);
  }
}

export async function loadCartFromFirestore(deviceId: string): Promise<CartItem[] | null> {
  try {
    const cartRef = doc(db, CART_COLLECTION, deviceId);
    const snap = await getDoc(cartRef);
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.items)) {
        return data.items;
      }
    }
  } catch (err) {
    console.warn('[Firebase] Cart load notice:', err);
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// 3. ORDERS IN FIRESTORE (Full Lifecycle Tracking)
// ─────────────────────────────────────────────────────────────

export async function createOrderInFirestore(order: OrderRecord): Promise<OrderRecord> {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, order.id);
    const sanitizedOrder = sanitizeForFirestore(order);
    await setDoc(orderRef, sanitizedOrder);

    // If order has auto-refill items, automatically create subscriptions in Firestore
    if (order.hasAutoRefill && Array.isArray(order.items)) {
      for (const item of order.items) {
        if (item.isAutoRefill && item.selectedPack) {
          const intervalDays = (item.autoRefillDays || 30) as 30 | 60 | 90;
          const subId = `SUB-${Math.floor(10000 + Math.random() * 90000)}`;
          const nextDate = new Date(Date.now() + 86400000 * intervalDays).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
          
          const discountedPrice = Number((item.selectedPack.price * 0.90).toFixed(2));
          const subRecord: AutoRefillSubscription = {
            id: subId,
            orderId: order.id,
            customerName: order.customerName,
            email: order.email || '',
            phone: order.phone,
            deliveryAddress: `${order.deliveryAddress}, ${order.city}`,
            postcode: order.postcode,
            productName: item.product.name,
            packLabel: item.selectedPack.label,
            pricePerRefill: discountedPrice,
            intervalDays,
            nextRefillDate: nextDate,
            status: 'Active',
            paymentMethod: order.paymentMethod,
            createdDate: "Just now"
          };

          await setDoc(doc(db, AUTO_REFILLS_COLLECTION, subId), sanitizeForFirestore(subRecord));
        }
      }
    }
  } catch (err) {
    console.warn('[Firebase] Firestore order save notice:', err);
  }

  return order;
}

export async function getOrdersFromFirestore(): Promise<OrderRecord[]> {
  try {
    const ordersCol = collection(db, ORDERS_COLLECTION);
    const snap = await getDocs(ordersCol);
    const list: OrderRecord[] = [];
    snap.forEach((d) => {
      list.push(d.data() as OrderRecord);
    });
    if (list.length > 0) {
      return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
  } catch (err) {
    console.warn('[Firebase] Firestore orders fetch notice:', err);
  }

  // Fallback to Express backend API
  try {
    const res = await fetch('/api/orders');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.orders) && data.orders.length > 0) {
        return data.orders;
      }
    }
  } catch (e) {
    // Silent fallback
  }

  return [];
}

export function listenToOrdersFromFirestore(callback: (orders: OrderRecord[]) => void): () => void {
  try {
    const unsub = onSnapshot(collection(db, ORDERS_COLLECTION), (snap) => {
      const list: OrderRecord[] = [];
      snap.forEach((d) => {
        list.push(d.data() as OrderRecord);
      });
      callback(list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    }, (error) => {
      console.warn('[Firebase] Orders listener notice:', error);
    });
    return unsub;
  } catch (err) {
    return () => {};
  }
}

export async function getOrderByIdFromFirestore(id: string): Promise<OrderRecord | null> {
  if (!id) return null;
  const cleanId = id.trim().toUpperCase();

  try {
    const orderRef = doc(db, ORDERS_COLLECTION, cleanId);
    const snap = await getDoc(orderRef);
    if (snap.exists()) {
      return snap.data() as OrderRecord;
    }
  } catch (err) {
    console.warn(`[Firebase] Firestore lookup notice for ${cleanId}:`, err);
  }

  // Fallback to backend API
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(cleanId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.order) {
        return data.order;
      }
    }
  } catch (apiErr) {
    // API fallback failed silently
  }

  return null;
}

export async function updateOrderStatusInFirestore(id: string, newStatus: string): Promise<boolean> {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, id);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: Date.now()
    });
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to update order status in Firestore:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// 4. AUTO REFILL SUBSCRIPTIONS IN FIRESTORE
// ─────────────────────────────────────────────────────────────

export async function getAutoRefillsFromFirestore(): Promise<AutoRefillSubscription[]> {
  try {
    const ref = collection(db, AUTO_REFILLS_COLLECTION);
    const snap = await getDocs(ref);
    const list: AutoRefillSubscription[] = [];
    snap.forEach((d) => {
      list.push(d.data() as AutoRefillSubscription);
    });
    return list;
  } catch (err) {
    console.error('[Firebase] Failed to get auto-refills from Firestore:', err);
    return [];
  }
}

export function listenToAutoRefillsFromFirestore(callback: (refills: AutoRefillSubscription[]) => void): () => void {
  try {
    const unsub = onSnapshot(collection(db, AUTO_REFILLS_COLLECTION), (snap) => {
      const list: AutoRefillSubscription[] = [];
      snap.forEach((d) => {
        list.push(d.data() as AutoRefillSubscription);
      });
      callback(list);
    }, (error) => {
      console.warn('[Firebase] Auto-refills listener notice:', error);
    });
    return unsub;
  } catch (err) {
    return () => {};
  }
}

export async function updateAutoRefillInFirestore(id: string, updates: Partial<AutoRefillSubscription>): Promise<boolean> {
  try {
    const ref = doc(db, AUTO_REFILLS_COLLECTION, id);
    await updateDoc(ref, sanitizeForFirestore({
      ...updates,
      updatedAt: Date.now()
    }));
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to update auto-refill in Firestore:', err);
    return false;
  }
}

export async function deleteAutoRefillFromFirestore(id: string): Promise<boolean> {
  try {
    const ref = doc(db, AUTO_REFILLS_COLLECTION, id);
    await deleteDoc(ref);
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to delete auto-refill from Firestore:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// 5. REVIEWS IN FIRESTORE
// ─────────────────────────────────────────────────────────────

export async function getReviewsFromFirestore(): Promise<VerifiedCustomerReview[]> {
  try {
    const reviewsCol = collection(db, REVIEWS_COLLECTION);
    const snap = await getDocs(reviewsCol);
    const list: VerifiedCustomerReview[] = [];
    snap.forEach((d) => {
      list.push(d.data() as VerifiedCustomerReview);
    });
    if (list.length > 0) {
      return list;
    }
    return VERIFIED_REVIEWS;
  } catch (err) {
    console.warn('[Firebase] Reviews load notice:', err);
    return VERIFIED_REVIEWS;
  }
}

export function listenToReviewsFromFirestore(callback: (reviews: VerifiedCustomerReview[]) => void): () => void {
  try {
    const unsub = onSnapshot(collection(db, REVIEWS_COLLECTION), (snap) => {
      const list: VerifiedCustomerReview[] = [];
      snap.forEach((d) => {
        list.push(d.data() as VerifiedCustomerReview);
      });
      if (list.length > 0) {
        callback(list);
      } else {
        callback(VERIFIED_REVIEWS);
      }
    }, (error) => {
      console.warn('[Firebase] Reviews listener notice:', error);
      callback(VERIFIED_REVIEWS);
    });
    return unsub;
  } catch (err) {
    callback(VERIFIED_REVIEWS);
    return () => {};
  }
}

export async function addReviewToFirestore(review: VerifiedCustomerReview): Promise<void> {
  try {
    const ref = doc(db, REVIEWS_COLLECTION, review.id);
    await setDoc(ref, sanitizeForFirestore({
      ...review,
      createdAt: Date.now()
    }));
  } catch (err) {
    console.error('[Firebase] Failed to save review in Firestore:', err);
  }
}

// ─────────────────────────────────────────────────────────────
// 6. COUPONS IN FIRESTORE
// ─────────────────────────────────────────────────────────────

export async function getCouponsFromFirestore(): Promise<CouponDiscount[]> {
  try {
    const snap = await getDocs(collection(db, COUPONS_COLLECTION));
    const list: CouponDiscount[] = [];
    snap.forEach((d) => {
      list.push(d.data() as CouponDiscount);
    });
    if (list.length > 0) {
      return list;
    }
  } catch (err) {
    console.warn('[Firebase] Coupons fetch notice:', err);
  }
  return COUPON_CODES;
}

export async function saveCouponToFirestore(coupon: CouponDiscount): Promise<void> {
  try {
    const ref = doc(db, COUPONS_COLLECTION, coupon.code);
    await setDoc(ref, sanitizeForFirestore(coupon), { merge: true });
  } catch (err) {
    console.error('[Firebase] Failed to save coupon in Firestore:', err);
  }
}

export async function deleteCouponFromFirestore(code: string): Promise<boolean> {
  try {
    const ref = doc(db, COUPONS_COLLECTION, code);
    await deleteDoc(ref);
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to delete coupon in Firestore:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// 7. CLINICAL TRIAGE MESSAGES IN FIRESTORE
// ─────────────────────────────────────────────────────────────

export async function saveConsultationMessage(sessionId: string, message: any): Promise<void> {
  try {
    const consultRef = collection(db, CONSULTATIONS_COLLECTION, sessionId, 'messages');
    await addDoc(consultRef, sanitizeForFirestore({
      ...message,
      createdAt: Date.now()
    }));
  } catch (err) {
    console.error('[Firebase] Failed to save consultation message in Firestore:', err);
  }
}

export async function deleteReviewFromFirestore(id: string): Promise<boolean> {
  try {
    const ref = doc(db, REVIEWS_COLLECTION, id);
    await deleteDoc(ref);
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to delete review from Firestore:', err);
    return false;
  }
}

export async function updateReviewInFirestore(id: string, updates: Partial<VerifiedCustomerReview>): Promise<boolean> {
  try {
    const ref = doc(db, REVIEWS_COLLECTION, id);
    await updateDoc(ref, sanitizeForFirestore({
      ...updates,
      updatedAt: Date.now()
    }));
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to update review in Firestore:', err);
    return false;
  }
}

export async function updateOrderInFirestore(id: string, updates: Partial<OrderRecord>): Promise<boolean> {
  try {
    const ref = doc(db, ORDERS_COLLECTION, id);
    await updateDoc(ref, sanitizeForFirestore({
      ...updates,
      updatedAt: Date.now()
    }));
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to update order in Firestore:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// 8. CATEGORIES IN FIRESTORE
// ─────────────────────────────────────────────────────────────

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'cat-sleep', name: 'Sleep Aids', slug: 'sleep-aids', description: 'Zopiclone (7.5mg, 10mg, 20mg), Zolpidem, Nitrazepam & Midazolam', active: true },
  { id: 'cat-anxiety', name: 'Anxiety & Calm', slug: 'anxiety-calm', description: 'Diazepam, Clonazepam, Xanax, Lorazepam & Pregabalin', active: true },
  { id: 'cat-pain', name: 'Pain Relief', slug: 'pain-relief', description: 'OxyContin 80mg, Tramadol 100mg & Pain O Soma (Carisoprodol 350mg/500mg)', active: true },
  { id: 'cat-nootropics', name: 'Nootropics & Focus', slug: 'nootropics-focus', description: 'Modafinil 200mg & Ritalin 10mg (Methylphenidate)', active: true }
];

export async function getCategoriesFromFirestore(): Promise<CategoryItem[]> {
  try {
    const snap = await getDocs(collection(db, CATEGORIES_COLLECTION));
    const list: CategoryItem[] = [];
    snap.forEach((d) => {
      list.push(d.data() as CategoryItem);
    });
    if (list.length > 0) {
      return list;
    }
  } catch (err) {
    console.warn('[Firebase] Categories fetch notice:', err);
  }
  return DEFAULT_CATEGORIES;
}

export async function saveCategoryToFirestore(category: CategoryItem): Promise<boolean> {
  try {
    const ref = doc(db, CATEGORIES_COLLECTION, category.id);
    await setDoc(ref, sanitizeForFirestore(category), { merge: true });
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to save category in Firestore:', err);
    return false;
  }
}

export async function deleteCategoryFromFirestore(id: string): Promise<boolean> {
  try {
    const ref = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(ref);
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to delete category in Firestore:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// 9. BANNERS IN FIRESTORE
// ─────────────────────────────────────────────────────────────

export const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: 'banner-free-delivery',
    title: 'Free Royal Mail Tracked 24 Delivery',
    subtitle: 'All orders containing Zopiclone (7.5mg, 10mg, 20mg) or Ritalin 10mg include complimentary tracked shipping across the UK.',
    badge: 'Limited Dispense Offer',
    ctaText: 'View Eligible Treatments',
    ctaLinkTab: 'shop',
    bgGradient: 'from-emerald-950 via-teal-900 to-[#01140e]',
    active: true,
    order: 1
  },
  {
    id: 'banner-discrete-packaging',
    title: '100% Discrete Plain Packaging Guaranteed',
    subtitle: 'Zero pharmacy branding, plain unmarked protective padded envelopes delivered directly through your letterbox.',
    badge: 'Dispensary Security',
    ctaText: 'How Discreet Delivery Works',
    ctaLinkTab: 'support',
    bgGradient: 'from-[#031d14] via-[#052b1e] to-[#01140e]',
    active: true,
    order: 2
  },
  {
    id: 'banner-same-day',
    title: 'Same-Day Dispatch Before 3:00 PM',
    subtitle: 'Orders confirmed with UK Faster Payments or Crypto before 3:00 PM dispatched same afternoon for next-day arrival.',
    badge: 'Fast Express',
    ctaText: 'Order Now',
    ctaLinkTab: 'shop',
    bgGradient: 'from-cyan-950 via-teal-950 to-[#01140e]',
    active: true,
    order: 3
  }
];

export async function getBannersFromFirestore(): Promise<BannerItem[]> {
  try {
    const snap = await getDocs(collection(db, BANNERS_COLLECTION));
    const list: BannerItem[] = [];
    snap.forEach((d) => {
      list.push(d.data() as BannerItem);
    });
    if (list.length > 0) {
      return list.sort((a, b) => a.order - b.order);
    }
  } catch (err) {
    console.warn('[Firebase] Banners fetch notice:', err);
  }
  return DEFAULT_BANNERS;
}

export async function saveBannerToFirestore(banner: BannerItem): Promise<boolean> {
  try {
    const ref = doc(db, BANNERS_COLLECTION, banner.id);
    await setDoc(ref, sanitizeForFirestore(banner), { merge: true });
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to save banner in Firestore:', err);
    return false;
  }
}

export async function deleteBannerFromFirestore(id: string): Promise<boolean> {
  try {
    const ref = doc(db, BANNERS_COLLECTION, id);
    await deleteDoc(ref);
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to delete banner in Firestore:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// 10. FAQS IN FIRESTORE
// ─────────────────────────────────────────────────────────────

export async function getFAQsFromFirestore(): Promise<FAQItem[]> {
  try {
    const snap = await getDocs(collection(db, FAQS_COLLECTION));
    const list: FAQItem[] = [];
    snap.forEach((d) => {
      list.push(d.data() as FAQItem);
    });
    if (list.length > 0) {
      return list.sort((a, b) => a.order - b.order);
    }
  } catch (err) {
    console.warn('[Firebase] FAQs fetch notice:', err);
  }
  return FREQUENTLY_ASKED_QUESTIONS.map((f, i) => ({
    id: `faq-${i + 1}`,
    question: f.question,
    answer: f.answer,
    active: true,
    order: i + 1,
    category: 'General'
  }));
}

export async function saveFAQToFirestore(faq: FAQItem): Promise<boolean> {
  try {
    const ref = doc(db, FAQS_COLLECTION, faq.id);
    await setDoc(ref, sanitizeForFirestore(faq), { merge: true });
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to save FAQ in Firestore:', err);
    return false;
  }
}

export async function deleteFAQFromFirestore(id: string): Promise<boolean> {
  try {
    const ref = doc(db, FAQS_COLLECTION, id);
    await deleteDoc(ref);
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to delete FAQ in Firestore:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// 11. SUBSCRIBERS IN FIRESTORE
// ─────────────────────────────────────────────────────────────

export async function getSubscribersFromFirestore(): Promise<SubscriberRecord[]> {
  try {
    const snap = await getDocs(collection(db, SUBSCRIBERS_COLLECTION));
    const list: SubscriberRecord[] = [];
    snap.forEach((d) => {
      list.push(d.data() as SubscriberRecord);
    });
    return list.sort((a, b) => b.subscribedAt - a.subscribedAt);
  } catch (err) {
    console.warn('[Firebase] Subscribers fetch notice:', err);
    return [];
  }
}

export async function addSubscriberToFirestore(email: string, source: string = 'Website Footer'): Promise<boolean> {
  if (!email || !email.includes('@')) return false;
  const cleanEmail = email.trim().toLowerCase();
  const id = `sub_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;
  try {
    const ref = doc(db, SUBSCRIBERS_COLLECTION, id);
    await setDoc(ref, sanitizeForFirestore({
      id,
      email: cleanEmail,
      subscribedAt: Date.now(),
      dateStr: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      source
    }), { merge: true });
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to add subscriber:', err);
    return false;
  }
}

export async function deleteSubscriberFromFirestore(id: string): Promise<boolean> {
  try {
    const ref = doc(db, SUBSCRIBERS_COLLECTION, id);
    await deleteDoc(ref);
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to delete subscriber:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// 12. STORE SETTINGS IN FIRESTORE
// ─────────────────────────────────────────────────────────────

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "PureSleep UK Pharmacy",
  tagline: "Premier UK Online Pharmacy & Discreet Dispensary",
  gphcRegNumber: "GPhC #9012384",
  contactEmail: "dispensary@puresleeppharma.co.uk",
  contactPhone: "07877 180391",
  whatsappNumber: "+44 7877 180391",
  address: "71 Queen Victoria Street",
  city: "London",
  postcode: "EC4V 4BE",
  currency: "GBP (£)",
  freeShippingThreshold: 60.00,
  adminPin: "2026",
  tracked48Fee: 3.99,
  tracked24Fee: 5.99,
  specialDeliveryFee: 9.99,
  dispatchCutoffTime: "15:00",
  bankName: "Barclays Commercial UK",
  sortCode: "20-45-12",
  accountNumber: "83921049",
  accountName: "PureSleep Dispensary Ltd",
  cryptoUsdtTrc20: "TX9zV2aG7KLM90nBx4pQ12837482910kd",
  cryptoBtcAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  telegramChatId: "8473581350",
  notifyOnNewOrder: true,
  notifyOnLowStock: true
};

export async function getStoreSettingsFromFirestore(): Promise<StoreSettings> {
  try {
    const ref = doc(db, SETTINGS_COLLECTION, 'store_config');
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { ...DEFAULT_STORE_SETTINGS, ...snap.data() } as StoreSettings;
    }
  } catch (err) {
    console.warn('[Firebase] Settings fetch notice:', err);
  }
  return DEFAULT_STORE_SETTINGS;
}

export async function saveStoreSettingsToFirestore(settings: StoreSettings): Promise<boolean> {
  try {
    const ref = doc(db, SETTINGS_COLLECTION, 'store_config');
    await setDoc(ref, sanitizeForFirestore({
      ...settings,
      updatedAt: Date.now()
    }), { merge: true });
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to save settings in Firestore:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// 13. AUDIT LOGS IN FIRESTORE
// ─────────────────────────────────────────────────────────────

export async function getAuditLogsFromFirestore(): Promise<AuditLogEntry[]> {
  try {
    const snap = await getDocs(collection(db, AUDIT_LOGS_COLLECTION));
    const list: AuditLogEntry[] = [];
    snap.forEach((d) => {
      list.push(d.data() as AuditLogEntry);
    });
    return list.sort((a, b) => b.timestamp - a.timestamp).slice(0, 100);
  } catch (err) {
    console.warn('[Firebase] Audit logs fetch notice:', err);
    return [];
  }
}

export async function logAdminActivity(
  action: string,
  category: AuditLogEntry['category'],
  affectedItem: string,
  details?: string,
  admin: string = 'Senior Pharmacist Admin'
): Promise<void> {
  try {
    const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const logEntry: AuditLogEntry = {
      id: logId,
      action,
      category,
      affectedItem,
      details,
      admin,
      timestamp: Date.now()
    };
    await setDoc(doc(db, AUDIT_LOGS_COLLECTION, logId), sanitizeForFirestore(logEntry));
  } catch (err) {
    console.warn('[Firebase] Failed to record audit log:', err);
  }
}

// ─────────────────────────────────────────────────────────────
// 14. STAFF & RBAC IN FIRESTORE
// ─────────────────────────────────────────────────────────────

export const DEFAULT_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Dr. Alistair Vance',
    email: 'pharmauk50@gmail.com',
    role: 'Super Admin',
    department: 'Superintendent Pharmacist & Executive Director',
    status: 'Active',
    lastLogin: 'Active now',
    createdAt: Date.now() - 86400000 * 45,
    phone: '+44 7877 180391',
    avatarColor: 'from-emerald-500 to-teal-700'
  },
  {
    id: 'staff-2',
    name: 'Fiona Gallagher',
    email: 'fiona.gallagher@puresleep.co.uk',
    role: 'Finance Manager',
    department: 'Accounts, Reconciliation & Gateway Settlement',
    status: 'Active',
    lastLogin: '25 mins ago',
    createdAt: Date.now() - 86400000 * 30,
    phone: '+44 7700 900142',
    avatarColor: 'from-amber-500 to-orange-700'
  },
  {
    id: 'staff-3',
    name: 'Liam Davies',
    email: 'liam.davies@puresleep.co.uk',
    role: 'Order Manager',
    department: 'Dispense Operations, Verification & Dispatch',
    status: 'Active',
    lastLogin: '1 hour ago',
    createdAt: Date.now() - 86400000 * 20,
    phone: '+44 7700 900581',
    avatarColor: 'from-blue-500 to-indigo-700'
  },
  {
    id: 'staff-4',
    name: 'Chloe Patel',
    email: 'chloe.patel@puresleep.co.uk',
    role: 'Customer Support',
    department: 'Patient Care & Consultation Queries',
    status: 'Active',
    lastLogin: '5 mins ago',
    createdAt: Date.now() - 86400000 * 15,
    phone: '+44 7700 900892',
    avatarColor: 'from-purple-500 to-pink-700'
  },
  {
    id: 'staff-5',
    name: 'Marcus Reynolds',
    email: 'marcus.reynolds@puresleep.co.uk',
    role: 'Inventory Manager',
    department: 'Central Stockroom & Denomination Procurement',
    status: 'Active',
    lastLogin: '3 hours ago',
    createdAt: Date.now() - 86400000 * 35,
    phone: '+44 7700 900334',
    avatarColor: 'from-teal-500 to-emerald-800'
  }
];

export async function getStaffMembersFromFirestore(): Promise<StaffMember[]> {
  try {
    const snap = await getDocs(collection(db, STAFF_COLLECTION));
    const list: StaffMember[] = [];
    snap.forEach((d) => list.push(d.data() as StaffMember));
    if (list.length > 0) return list;
  } catch (err) {
    console.warn('[Firebase] Staff fetch notice:', err);
  }
  return DEFAULT_STAFF_MEMBERS;
}

export async function saveStaffMemberToFirestore(staff: StaffMember): Promise<boolean> {
  try {
    await setDoc(doc(db, STAFF_COLLECTION, staff.id), sanitizeForFirestore(staff), { merge: true });
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to save staff member in Firestore:', err);
    return false;
  }
}

export async function deleteStaffMemberFromFirestore(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, STAFF_COLLECTION, id));
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to delete staff member from Firestore:', err);
    return false;
  }
}



