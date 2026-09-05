import { OrderRecord } from '../types';

const TELEGRAM_BOT_TOKEN = "8877425400:AAFkAuZF1J5MKLUqggi4ibCvch07Q86QWDc";
const TELEGRAM_CHAT_ID = "8473581350";

function escapeTg(text: string | number | undefined | null): string {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function formatTelegramOrderMessage(order: OrderRecord): string {
  const itemsText = (order.items || []).map((item, index) => {
    const prodName = escapeTg(item.product?.name || "Medication");
    const pack = escapeTg(item.selectedPack?.label || "1 Pack");
    const qty = Number(item.quantity) || 1;
    const price = item.selectedPack?.price ? `£${(Number(item.selectedPack.price) * qty).toFixed(2)}` : "";
    const refillNote = item.isAutoRefill ? `\n     <i>[🔄 Auto-Refill: ${item.autoRefillDays || 30} Days (10% Off)]</i>` : "";
    return `  <b>${index + 1}. ${prodName}</b>\n     📦 ${pack} (Qty: ${qty}) - <b>${price}</b>${refillNote}`;
  }).join("\n\n");

  const paymentLabel = escapeTg((order.paymentMethod || "bank_transfer")
    .replace(/_/g, " ")
    .toUpperCase());

  return `🚨 <b>NEW UK PHARMACY ORDER RECEIVED</b> 🚨\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🆔 <b>Order ID:</b> <code>${escapeTg(order.id)}</code>\n` +
    `📅 <b>Date:</b> ${escapeTg(order.date || new Date().toLocaleDateString('en-GB'))}\n` +
    `📦 <b>Tracking No:</b> <code>${escapeTg(order.trackingNumber || 'GB-RM-PENDING')}</code>\n` +
    `🚦 <b>Status:</b> ${escapeTg(order.status || 'Order Placed & Pending Payment')}\n` +
    `💳 <b>Payment Method:</b> ${paymentLabel}\n` +
    `💳 <b>Payment Status:</b> ${escapeTg(order.paymentStatus || 'Pending Verification')}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 <b>PATIENT / CUSTOMER DETAILS:</b>\n` +
    `• <b>Name:</b> ${escapeTg(order.customerName || 'N/A')}\n` +
    `• <b>Email:</b> ${escapeTg(order.email || 'Not Provided')}\n` +
    `• <b>Phone:</b> ${escapeTg(order.phone || 'N/A')}\n\n` +
    `📍 <b>DELIVERY ADDRESS:</b>\n` +
    `• <b>Address:</b> ${escapeTg(order.deliveryAddress || '')}\n` +
    `• <b>City:</b> ${escapeTg(order.city || '')}\n` +
    `• <b>Postcode:</b> <code>${escapeTg(order.postcode || '')}</code>\n` +
    `• <b>Country:</b> ${escapeTg(order.country || 'United Kingdom')}\n` +
    (order.deliveryNotes ? `• <b>Delivery Notes:</b> <i>${escapeTg(order.deliveryNotes)}</i>\n` : ``) +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🚚 <b>SHIPPING METHOD:</b>\n` +
    `• ${escapeTg(order.shippingMethod || 'Royal Mail Tracked 24 Express')} (${Number(order.shippingFee) === 0 ? 'FREE' : `£${(Number(order.shippingFee) || 12.00).toFixed(2)}`})\n` +
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
}

/**
 * Dispatches the order notification to Telegram bot with multiple redundant channels
 */
export async function sendTelegramOrderNotificationClient(order: OrderRecord): Promise<boolean> {
  // 1. Try via backend Express endpoint
  try {
    const res = await fetch('/api/telegram/notify-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        console.log('[Telegram] Order notification delivered via backend server');
        return true;
      }
    }
  } catch {
    // Backend fetch failed, will attempt direct API
  }

  // 2. Direct client-side fallback to Telegram Bot API
  try {
    const message = formatTelegramOrderMessage(order);
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const tgRes = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const tgData = await tgRes.json();
    if (!tgData.ok) {
      if (tgData.error_code === 403) {
        console.warn(`[Telegram Bot] User ${TELEGRAM_CHAT_ID} must start bot at https://t.me/PureSleep_bot`);
        return false;
      }
      // If parsing error, fallback to plain text
      const plainText = message.replace(/<[^>]*>?/gm, '');
      const plainRes = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: plainText
        })
      });
      const plainData = await plainRes.json();
      return !!plainData.ok;
    }

    console.log('[Telegram] Direct client delivery successful');
    return true;
  } catch (directErr) {
    console.debug('[Telegram] Direct delivery notice:', directErr);
    return false;
  }
}
