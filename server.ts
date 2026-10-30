import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { REST_EASY_PRODUCTS } from "./src/data/medicineCatalog";
import { generateSitemapXML } from "./src/utils/sitemapGenerator";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Support assistant will use clinical fallback logic.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Helper to escape HTML characters for Telegram Bot HTML parse_mode
function escapeTgHtml(text: string | number | undefined | null): string {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getResolvedTelegramChatId(token: string): string {
  const botId = token ? token.split(":")[0] : "";
  const envChatId = process.env.TELEGRAM_CHAT_ID?.trim();
  // If the envChatId is identical to the bot's own ID or empty, use the actual recipient chat ID
  if (!envChatId || envChatId === botId || envChatId === "8877425400") {
    return "8473581350";
  }
  return envChatId;
}

// Telegram Bot Order Notification Service
async function sendTelegramOrderNotification(order: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN || "8877425400:AAFkAuZF1J5MKLUqggi4ibCvch07Q86QWDc";
  const chatId = getResolvedTelegramChatId(token);

  if (!token || !chatId) {
    console.warn("[Telegram] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return { success: false, reason: "Missing credentials" };
  }

  try {
    const itemsText = (order.items || []).map((item: any, index: number) => {
      const prodName = escapeTgHtml(item.product?.name || "Medication");
      const pack = escapeTgHtml(item.selectedPack?.label || "1 Pack");
      const qty = Number(item.quantity) || 1;
      const price = item.selectedPack?.price ? `£${(Number(item.selectedPack.price) * qty).toFixed(2)}` : "";
      const refillNote = item.isAutoRefill ? `\n     <i>[🔄 Auto-Refill: ${item.autoRefillDays || 30} Days (10% Off)]</i>` : "";
      return `  <b>${index + 1}. ${prodName}</b>\n     📦 ${pack} (Qty: ${qty}) - <b>${price}</b>${refillNote}`;
    }).join("\n\n");

    const paymentLabel = escapeTgHtml((order.paymentMethod || "Unknown")
      .replace(/_/g, " ")
      .toUpperCase());

    const message = `🚨 <b>NEW UK PHARMACY ORDER RECEIVED</b> 🚨\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🆔 <b>Order ID:</b> <code>${escapeTgHtml(order.id)}</code>\n` +
      `📅 <b>Date:</b> ${escapeTgHtml(order.date || new Date().toLocaleDateString('en-GB'))}\n` +
      `📦 <b>Tracking No:</b> <code>${escapeTgHtml(order.trackingNumber || 'GB-RM-PENDING')}</code>\n` +
      `🚦 <b>Status:</b> ${escapeTgHtml(order.status || 'Order Placed & Pending Payment')}\n` +
      `💳 <b>Payment Method:</b> ${paymentLabel}\n` +
      `💳 <b>Payment Status:</b> ${escapeTgHtml(order.paymentStatus || 'Pending Verification')}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 <b>PATIENT / CUSTOMER DETAILS:</b>\n` +
      `• <b>Name:</b> ${escapeTgHtml(order.customerName || 'N/A')}\n` +
      `• <b>Email:</b> ${escapeTgHtml(order.email || 'N/A')}\n` +
      `• <b>Phone:</b> ${escapeTgHtml(order.phone || 'N/A')}\n\n` +
      `📍 <b>DELIVERY ADDRESS:</b>\n` +
      `• <b>Address:</b> ${escapeTgHtml(order.deliveryAddress || '')}\n` +
      `• <b>City:</b> ${escapeTgHtml(order.city || '')}\n` +
      `• <b>Postcode:</b> <code>${escapeTgHtml(order.postcode || '')}</code>\n` +
      `• <b>Country:</b> ${escapeTgHtml(order.country || 'United Kingdom')}\n` +
      (order.deliveryNotes ? `• <b>Delivery Notes:</b> <i>${escapeTgHtml(order.deliveryNotes)}</i>\n` : ``) +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🚚 <b>SHIPPING METHOD:</b>\n` +
      `• ${escapeTgHtml(order.shippingMethod || 'Royal Mail Tracked 24 Express')} (${Number(order.shippingFee) === 0 ? 'FREE' : `£${(Number(order.shippingFee) || 12.00).toFixed(2)}`})\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💊 <b>ORDERED ITEMS:</b>\n\n` +
      `${itemsText || '  (No items specified)'}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 <b>FINANCIAL BREAKDOWN:</b>\n` +
      `• Subtotal: £${(Number(order.subtotal) || 0).toFixed(2)}\n` +
      (Number(order.discount) > 0 ? `• Coupon Discount: -£${(Number(order.discount) || 0).toFixed(2)}\n` : ``) +
      (Number(order.loyaltyDiscount) > 0 ? `• Loyalty Discount: -£${(Number(order.loyaltyDiscount) || 0).toFixed(2)}\n` : ``) +
      (Number(order.autoRefillDiscount) > 0 ? `• Auto-Refill Discount: -£${(Number(order.autoRefillDiscount) || 0).toFixed(2)}\n` : ``) +
      `• Shipping Fee: ${Number(order.shippingFee) === 0 ? 'FREE (£0.00)' : `£${(Number(order.shippingFee) || 12.00).toFixed(2)}`}\n` +
      `💵 <b>TOTAL AMOUNT:</b> <b>£${(Number(order.total) || 0).toFixed(2)}</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🔒 <i>Packaging: 100% Plain Discrete Unbranded Packaging with Royal Mail Tracked 24</i>`;

    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    const res = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML"
      })
    });

    const resData: any = await res.json();
    if (!resData.ok) {
      if (resData.error_code === 403) {
        console.warn(`[Telegram Bot 403 Forbidden] Chat ID ${chatId} has not started conversation with the bot or blocked it. Open https://t.me/PureSleep_bot and click /start.`);
        return { success: false, reason: "403_FORBIDDEN", details: resData.description };
      }
      
      // If formatting issue (400), try fallback to plain text
      if (resData.error_code === 400) {
        const plainText = message.replace(/<[^>]*>?/gm, '');
        const fallbackRes = await fetch(telegramUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: plainText
          })
        });
        const fallbackData: any = await fallbackRes.json();
        if (!fallbackData.ok) {
          console.warn("[Telegram Bot Fallback Notice]", fallbackData.description);
          return { success: false, reason: "FALLBACK_FAILED", details: fallbackData.description };
        }
      } else {
        console.warn("[Telegram Bot Response]", resData.description);
        return { success: false, reason: "API_ERROR", details: resData.description };
      }
    }

    console.log(`[Telegram Bot] Successfully delivered instant order notification for ${order.id} to chat ${chatId}`);
    return { success: true, messageId: resData.result?.message_id };
  } catch (err: any) {
    console.warn("[Telegram Bot Request Notice]", err?.message || err);
    return { success: false, reason: "NETWORK_ERROR", details: err?.message };
  }
}

// In-Memory Cloud Store for Live Persistence (Orders, Subscriptions, Reviews)
interface StoredOrder {
  id: string;
  createdAt: number;
  date: string;
  items: any[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  loyaltyDiscount: number;
  autoRefillDiscount: number;
  shippingFee: number;
  shippingMethod: string;
  total: number;
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  city: string;
  postcode: string;
  country: string;
  deliveryNotes?: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  trackingNumber: string;
  trackingHistory: any[];
  hasAutoRefill?: boolean;
}

const ORDERS_STORE: StoredOrder[] = [
  {
    id: "REM-849201",
    createdAt: Date.now() - 86400000 * 1.5,
    date: new Date(Date.now() - 86400000 * 1.5).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    items: [
      {
        id: "rem-zopiclone-75-zop-28",
        product: {
          id: "rem-zopiclone-75",
          name: "Zopiclone 7.5mg Tablets",
          brand: "Imovane UK",
          strength: "7.5mg",
          category: "Sleep Aids"
        },
        selectedPack: {
          id: "zop-28",
          label: "28 Tablets (1 Month Supply)",
          tabletsCount: 28,
          price: 48.99
        },
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
  },
  {
    id: "REM-729482",
    createdAt: Date.now() - 86400000 * 3,
    date: new Date(Date.now() - 86400000 * 3).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    items: [
      {
        id: "rem-modafinil-200-mod-30",
        product: {
          id: "rem-modafinil-200",
          name: "Modafinil 200mg (Modalert)",
          brand: "Sun Pharma",
          strength: "200mg",
          category: "Nootropics & Focus"
        },
        selectedPack: {
          id: "mod-30",
          label: "30 Tablets (1 Month Focus)",
          tabletsCount: 30,
          price: 64.99
        },
        quantity: 1
      }
    ],
    subtotal: 64.99,
    discount: 9.75,
    couponCode: "WELCOME15",
    loyaltyDiscount: 1.30,
    autoRefillDiscount: 0,
    shippingFee: 0,
    shippingMethod: "Royal Mail Tracked 24 Express",
    total: 53.94,
    customerName: "Eleanor Wright",
    email: "e.wright@oxford.ac.uk",
    phone: "07891 234567",
    deliveryAddress: "42 Woodstock Road",
    city: "Oxford",
    postcode: "OX2 6HT",
    country: "United Kingdom",
    paymentMethod: "crypto",
    paymentStatus: "Paid",
    status: "Delivered",
    trackingNumber: "GB-RM-782194012UK",
    trackingHistory: [
      { title: "Order Received", description: "USDT Crypto transaction confirmed on-chain", timestamp: "3 days ago", completed: true },
      { title: "Dispatched", description: "Royal Mail Special Delivery Tracked 24", timestamp: "2 days ago", completed: true },
      { title: "Delivered", description: "Delivered to recipient letterbox (Plain Parcel)", timestamp: "Yesterday 11:20 AM", completed: true, current: true }
    ]
  }
];

const AUTO_REFILLS_STORE: any[] = [
  {
    id: "REF-98214",
    orderId: "REM-849201",
    customerName: "David Henderson",
    email: "david.henderson@example.co.uk",
    phone: "07700 900821",
    deliveryAddress: "14 Belgrave Crescent, Manchester",
    postcode: "M4 5AB",
    productName: "Zopiclone 7.5mg Tablets",
    packLabel: "28 Tablets (1 Month Supply)",
    pricePerRefill: 38.21,
    intervalDays: 30,
    nextRefillDate: new Date(Date.now() + 86400000 * 28).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: "Active",
    paymentMethod: "bank_transfer",
    createdDate: "Yesterday"
  }
];

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({
    service: "PureSleep Pharma UK Pharmacy API",
    status: "online",
    activeOrdersCount: ORDERS_STORE.length,
    timestamp: new Date().toISOString()
  });
});

// Dynamic XML Sitemap for all medicines, categories, and tabs
app.get("/sitemap.xml", (req, res) => {
  const host = req.get("host");
  const protocol = req.protocol === "https" || req.get("x-forwarded-proto") === "https" ? "https" : "http";
  const baseUrl = host ? `${protocol}://${host}` : undefined;
  
  const { xml } = generateSitemapXML(baseUrl);
  res.header("Content-Type", "application/xml; charset=utf-8");
  res.send(xml);
});

// Dynamic robots.txt
app.get("/robots.txt", (req, res) => {
  const robots = `# PureSleep Pharma UK Pharmacy Robots Directive
User-agent: *
Allow: /
Allow: /?tab=*
Allow: /?med=*
Allow: /?category=*
Disallow: /?tab=admin
Disallow: /admin
Disallow: /api/admin/*

# Crawl Delay
Crawl-delay: 1

# Sitemap
Sitemap: https://puresleeppharma.co.uk/sitemap.xml
`;
  res.header("Content-Type", "text/plain");
  res.send(robots);
});

// 2. Orders Endpoints
app.get("/api/orders", (req, res) => {
  res.json({ orders: ORDERS_STORE });
});

app.get("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const normalized = id.trim().toUpperCase();
  const order = ORDERS_STORE.find(
    (o) => o.id.toUpperCase() === normalized || o.trackingNumber.toUpperCase() === normalized
  );

  if (!order) {
    return res.status(404).json({ error: "Order not found with provided reference code" });
  }

  res.json({ order });
});

app.post("/api/orders", async (req, res) => {
  try {
    const orderData = req.body;
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ error: "Invalid order data. Cart items required." });
    }

    const orderId = orderData.id || `REM-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = orderData.trackingNumber || `GB-RM-${Math.floor(100000000 + Math.random() * 900000000)}UK`;
    const now = new Date();
    const formattedDate = orderData.date || now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const newOrder: StoredOrder = {
      ...orderData,
      id: orderId,
      createdAt: orderData.createdAt || Date.now(),
      date: formattedDate,
      trackingNumber,
      status: orderData.status || (orderData.paymentMethod === 'cash_on_delivery' ? 'Dispensary Packaging' : 'Order Placed & Pending Payment'),
      paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === 'card' ? 'Paid' : 'Pending Verification'),
      trackingHistory: orderData.trackingHistory || [
        {
          title: "Order Placed",
          description: `Order ${orderId} received. Awaiting ${orderData.paymentMethod?.replace('_', ' ').toUpperCase()} confirmation.`,
          timestamp: "Just Now",
          completed: true,
          current: true
        },
        {
          title: "Payment & Clinical Approval",
          description: "Pharmacist verifies discrete packing and order parameters.",
          timestamp: "Pending",
          completed: false
        },
        {
          title: "Royal Mail Tracked 24 Handover",
          description: "Sealed in discrete plain packaging with tracking.",
          timestamp: "Pending",
          completed: false
        },
        {
          title: "Out for Delivery",
          description: "Delivered securely to your address.",
          timestamp: "Pending",
          completed: false
        }
      ]
    };

    // Prevent duplicate in in-memory store if ID already exists
    const existingIndex = ORDERS_STORE.findIndex(o => o.id === newOrder.id);
    if (existingIndex >= 0) {
      ORDERS_STORE[existingIndex] = newOrder;
    } else {
      ORDERS_STORE.unshift(newOrder);
    }

    // If order includes auto-refill, register subscription
    if (orderData.hasAutoRefill) {
      const subId = `REF-${Math.floor(10000 + Math.random() * 90000)}`;
      const firstRefillItem = orderData.items[0];
      AUTO_REFILLS_STORE.unshift({
        id: subId,
        orderId: orderId,
        customerName: orderData.customerName,
        email: orderData.email,
        phone: orderData.phone,
        deliveryAddress: `${orderData.deliveryAddress}, ${orderData.city}`,
        postcode: orderData.postcode,
        productName: firstRefillItem?.product?.name || "Medication",
        packLabel: firstRefillItem?.selectedPack?.label || "Standard Pack",
        pricePerRefill: orderData.total,
        intervalDays: firstRefillItem?.autoRefillDays || 30,
        nextRefillDate: new Date(Date.now() + 86400000 * (firstRefillItem?.autoRefillDays || 30)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: "Active",
        paymentMethod: orderData.paymentMethod,
        createdDate: formattedDate
      });
    }

    // Send instant rich Telegram alert with complete order details immediately
    await sendTelegramOrderNotification(newOrder);

    res.status(201).json({
      success: true,
      order: newOrder,
      message: "Order placed successfully."
    });
  } catch (error: any) {
    console.error("Order creation failed:", error);
    res.status(500).json({ error: "Failed to process order", details: error?.message });
  }
});

// Explicit instant notification endpoint
app.post("/api/telegram/notify-order", async (req, res) => {
  try {
    const orderData = req.body;
    if (!orderData) {
      return res.status(400).json({ error: "Missing order payload" });
    }
    const result = await sendTelegramOrderNotification(orderData);
    res.json({ success: result.success, result, message: result.success ? "Telegram notification dispatched." : "Telegram notification could not be delivered." });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to send telegram notification", details: err?.message });
  }
});

// Endpoint to test Telegram Bot connection
app.post("/api/telegram/test", async (req, res) => {
  const sampleOrder = {
    id: `TEST-${Math.floor(100000 + Math.random() * 900000)}`,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    trackingNumber: `GB-RM-${Math.floor(100000000 + Math.random() * 900000000)}UK`,
    status: "Test Notification",
    paymentMethod: "bank_transfer",
    paymentStatus: "Pending Verification",
    customerName: "Test Patient (Dispensary Demo)",
    email: "pharmauk50@gmail.com",
    phone: "07700 900892",
    deliveryAddress: "10 Downing Street",
    city: "London",
    postcode: "SW1A 2AA",
    country: "United Kingdom",
    deliveryNotes: "This is a real-time test alert from your dispensary portal.",
    shippingMethod: "Royal Mail Tracked 24 Express",
    shippingFee: 0,
    subtotal: 45.00,
    discount: 0,
    loyaltyDiscount: 0,
    autoRefillDiscount: 0,
    total: 45.00,
    items: [
      {
        product: { name: "Zopiclone 7.5mg (1 Strip / 10 Tablets)" },
        selectedPack: { label: "1 Strip (10 Tabs)", price: 45.00 },
        quantity: 1,
        isAutoRefill: false
      }
    ]
  };

  const result = await sendTelegramOrderNotification(sampleOrder);
  res.json({ 
    success: result.success, 
    result,
    message: result.success 
      ? "Test alert delivered successfully to Telegram bot!" 
      : (result.reason === "403_FORBIDDEN" 
          ? "Telegram 403: Please open https://t.me/PureSleep_bot and click /start first." 
          : "Could not send test alert to Telegram.")
  });
});

// Telegram status check
app.get("/api/telegram/status", async (req, res) => {
  const token = process.env.TELEGRAM_BOT_TOKEN || "8877425400:AAFkAuZF1J5MKLUqggi4ibCvch07Q86QWDc";
  const chatId = getResolvedTelegramChatId(token);
  try {
    const checkRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const checkData: any = await checkRes.json();
    res.json({
      configured: true,
      bot: checkData.result || null,
      chatId,
      botUrl: checkData.result?.username ? `https://t.me/${checkData.result.username}` : "https://t.me/PureSleep_bot"
    });
  } catch (err: any) {
    res.json({
      configured: false,
      error: err?.message
    });
  }
});


app.patch("/api/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  const order = ORDERS_STORE.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  // Add step to tracking history if status updated
  if (status) {
    order.trackingHistory.push({
      title: status,
      description: `Status updated to ${status} by Dispensary Team.`,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      completed: true,
      current: true
    });
  }

  res.json({ success: true, order });
});

// 3. Auto Refill Subscriptions
app.get("/api/auto-refills", (req, res) => {
  res.json({ subscriptions: AUTO_REFILLS_STORE });
});

app.patch("/api/auto-refills/:id", (req, res) => {
  const { id } = req.params;
  const { status, intervalDays } = req.body;

  const sub = AUTO_REFILLS_STORE.find((s) => s.id === id);
  if (!sub) {
    return res.status(404).json({ error: "Subscription not found" });
  }

  if (status) sub.status = status;
  if (intervalDays) sub.intervalDays = intervalDays;

  res.json({ success: true, subscription: sub });
});

// 4. Live Pharmacy AI & Customer Support Endpoint
app.post("/api/chat/support", async (req, res) => {
  try {
    const { messages, userContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        reply: "Hello! Welcome to PureSleep Pharma UK. All our medications (including Zopiclone, Zolpidem, Diazepam, Modafinil, and Pain Relief) are in stock for Royal Mail Tracked 24 next-day discreet delivery. How can I assist you with your order or dosage questions today?",
        quickReplies: ["Track My Order", "Order via WhatsApp", "Payment Options", "Dosage Advice"]
      });
    }

    const systemInstruction = `You are the Lead Clinical Support Specialist and Senior Dispensing Pharmacist at PureSleep Pharma (UK).
PureSleep Pharma is the premier UK online pharmacy specializing in:
- Diazepam (Sedil 5mg, Esium Diaz 5mg, Bensedin 10mg)
- Clonazepam (Pase 2mg, Rivotril 2mg)
- Nitrazepam (Nitraz 5mg, Nitraz 10mg)
- Alprazolam (Xanax 0.5mg, Alprax 1mg, Alprax 2mg)
- Lorazepam (Loraz 2mg, Loraz 3mg)
- Bromazepam (Bromazepam 3mg)
- Midazolam (Midazolam 7.5mg)
- Etizolam (Etizolam 1mg)
- Zopiclone (Zopiclone 7.5mg, Zopiclone 20mg, Zopi 10mg)
- Zolpidem (Zolpidem Tartrate 10mg)
- Pregabalin (Pregabalin 300mg, Pregabalin 450mg)
- Modafinil (Modafinil 200mg / Modalert)
- Tramadol (Tramadol HCl 100mg)
- Carisoprodol (Pain O Soma 350mg / 500mg)
- Methylphenidate (Ritalin 10mg)

Key facts about PureSleep Pharma:
- Dispatch: Royal Mail Tracked 24 or Guaranteed Next-Day 1pm Special Delivery in 100% plain unbranded discrete packaging.
- Payment Methods: Instant UK Fast Bank Transfer (Faster Payments), Cryptocurrency (Bitcoin/USDT/ETH), Debit/Credit Card, and Cash on Delivery.
- Multi-pack volume savings (up to 40% off on 56/112/240 tablet packs).
- Auto-Refill & Save option gives an extra 10% discount on 30, 60, or 90-day intervals.
- Customer support channels: Live Chat, WhatsApp (07877 180391 / +44 7877 180391 / https://wa.me/message/DCDJEBZXRXSHJ1), and Telegram (@bossofbenzoo / https://t.me/bossofbenzoo).

Tone: Friendly, authoritative, discreet, British healthcare English, reassuring, and helpful. Always provide concise, crystal clear guidance.`;

    const formattedHistory = messages
      .map((m: { role: string; content: string }) => `${m.role === "user" ? "Customer" : "Pharmacist"}: ${m.content}`)
      .join("\n\n");

    const prompt = `Chat History:\n${formattedHistory}\n\nProvide the helpful response from the PureSleep Pharma Pharmacist/Support Agent and 3-4 interactive quick reply options for the user.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING, description: "Helpful pharmacist answer" },
            quickReplies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 short quick tap actions" },
            suggestedProduct: { type: Type.STRING, description: "Optional medicine name" }
          },
          required: ["reply", "quickReplies"]
        }
      }
    });

    const jsonText = response.text?.trim() || "{}";
    res.json(JSON.parse(jsonText));
  } catch (error: any) {
    console.error("Support chat error:", error);
    res.status(500).json({
      error: "Support chat unavailable",
      reply: "We are currently experiencing high volume. You can order directly or message our on-duty team on WhatsApp (07877 180391 / https://wa.me/message/DCDJEBZXRXSHJ1) or Telegram (@bossofbenzoo) for immediate assistance!",
      quickReplies: ["Order via WhatsApp", "Telegram: @bossofbenzoo", "View Sleep Aids", "Track Order"]
    });
  }
});

// Vite middleware for dev / static for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PureSleep Pharma UK Pharmacy server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
