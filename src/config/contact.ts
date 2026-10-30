export const CONTACT_INFO = {
  phone: '07877 180391',
  phoneFormatted: '+44 7877 180391',
  phoneRaw: '07877180391',
  phoneInternationalRaw: '447877180391',
  whatsappNumber: '+44 7877 180391',
  whatsappDisplay: '+44 7877 180391',
  whatsappShortUrl: 'https://wa.me/message/DCDJEBZXRXSHJ1',
  whatsappLink: 'https://wa.me/message/DCDJEBZXRXSHJ1',
  telegramHandle: '@bossofbenzoo',
  telegramUrl: 'https://t.me/bossofbenzoo',
  supportEmail: 'support@puresleeppharma.co.uk',
};

/**
 * Returns the direct Telegram URL.
 */
export function getTelegramUrl(): string {
  return CONTACT_INFO.telegramUrl;
}

/**
 * Returns the direct WhatsApp URL.
 * If text is provided, appends the message query param so the customer
 * has their order / question pre-filled in their chat.
 */
export function getWhatsAppUrl(text?: string): string {
  if (text) {
    return `https://wa.me/447877180391?text=${encodeURIComponent(text)}`;
  }
  return CONTACT_INFO.whatsappShortUrl;
}
