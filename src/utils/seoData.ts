import { MedicineProduct, ProductCategory, NavigationTab } from '../types';
import { REST_EASY_PRODUCTS, FREQUENTLY_ASKED_QUESTIONS, VERIFIED_REVIEWS } from '../data/medicineCatalog';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  ogImage: string;
  twitterCard: string;
  robots: string;
  jsonLd: Record<string, any>[];
  breadcrumb?: { name: string; url: string }[];
}

const SITE_URL = 'https://puresleeppharma.co.uk';
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&h=630&q=80';

// Convert product name or ID to a clean SEO slug
export function getProductSlug(product: MedicineProduct): string {
  const cleanName = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return `${cleanName}`;
}

// Find product by slug or ID
export function findProductBySlugOrId(identifier: string): MedicineProduct | undefined {
  if (!identifier) return undefined;
  const decoded = decodeURIComponent(identifier).toLowerCase().trim();
  
  return REST_EASY_PRODUCTS.find(p => 
    p.id.toLowerCase() === decoded ||
    getProductSlug(p) === decoded ||
    p.name.toLowerCase().includes(decoded) ||
    p.genericName.toLowerCase().includes(decoded) ||
    p.sku.toLowerCase() === decoded
  );
}

// Generate SEO for a specific medicine product
export function getProductSEOMetadata(product: MedicineProduct): SEOMetadata {
  const slug = getProductSlug(product);
  const canonicalUrl = `${SITE_URL}/?med=${product.id}`;
  const minPrice = Math.min(...product.packOptions.map(p => p.price));
  const maxPrice = Math.max(...product.packOptions.map(p => p.price));
  const popularPack = product.packOptions.find(p => p.popular) || product.packOptions[0];

  const title = `Buy ${product.name} Online UK | Next-Day Tracked 24 | PureSleep Pharma`;
  const description = `Order genuine ${product.name} (${product.activeIngredient}) from £${minPrice.toFixed(2)}. Licensed UK dispensary supply with discreet unmarked packaging, Royal Mail Tracked 24 delivery, and doctor-approved dosage guidance.`;
  
  const keywords = [
    `buy ${product.name.toLowerCase()} uk`,
    `order ${product.genericName.toLowerCase()} online uk`,
    `${product.name.toLowerCase()} next day delivery`,
    `${product.brand.toLowerCase()} uk pharmacy`,
    `genuine ${product.activeIngredient.toLowerCase()}`,
    `${product.category.toLowerCase()} uk`,
    `royal mail tracked 24 ${product.name.toLowerCase()}`,
    `${product.format.toLowerCase()} ${product.strength.toLowerCase()}`,
    `discreet sleep and anxiety medications uk`
  ].join(', ');

  // Schema.org Drug & Product Structured Data
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': ['Product', 'Drug'],
    name: product.name,
    description: product.description,
    image: product.imageUrl || DEFAULT_OG_IMAGE,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    manufacturer: {
      '@type': 'Organization',
      name: product.brand
    },
    activeIngredient: product.activeIngredient,
    dosageForm: product.format,
    strengthUnit: product.strength,
    legalStatus: product.legalCategory === 'POM' ? 'PrescriptionOnly' : 'OverTheCounter',
    prescriptionStatus: product.prescriptionRequired ? 'https://schema.org/PrescriptionOnly' : 'https://schema.org/OverTheCounter',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'GBP',
      lowPrice: minPrice.toFixed(2),
      highPrice: maxPrice.toFixed(2),
      offerCount: product.packOptions.length,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      priceValidUntil: '2027-12-31',
      seller: {
        '@type': 'Pharmacy',
        name: 'PureSleep Pharma UK',
        url: SITE_URL
      },
      offers: product.packOptions.map(pack => ({
        '@type': 'Offer',
        name: `${product.name} - ${pack.label}`,
        price: pack.price.toFixed(2),
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        sku: `${product.sku}-${pack.id}`,
        url: `${canonicalUrl}&pack=${pack.id}`
      }))
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
      bestRating: '5',
      worstRating: '1'
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'GB',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 14,
      returnMethod: 'https://schema.org/ReturnByMail'
    }
  };

  const breadcrumbs = [
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Treatments', url: `${SITE_URL}/?tab=shop` },
    { name: product.category, url: `${SITE_URL}/?category=${encodeURIComponent(product.category)}` },
    { name: product.name, url: canonicalUrl }
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: b.name,
      item: b.url
    }))
  };

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    ogTitle: `${product.name} - Next-Day UK Delivery | PureSleep Pharma`,
    ogDescription: description,
    ogType: 'product',
    ogImage: product.imageUrl || DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    jsonLd: [productSchema, breadcrumbSchema],
    breadcrumb: breadcrumbs
  };
}

// Generate SEO for a specific category
export function getCategorySEOMetadata(category: ProductCategory | 'All'): SEOMetadata {
  const isAll = category === 'All';
  const canonicalUrl = isAll ? `${SITE_URL}/?tab=shop` : `${SITE_URL}/?category=${encodeURIComponent(category)}`;
  const title = isAll 
    ? 'UK Online Pharmacy & Genuine Medications | Next-Day Discrete Delivery | PureSleep Pharma'
    : `Buy ${category} Online UK | Royal Mail Tracked 24 Delivery | PureSleep Pharma`;

  const categoryDescriptions: Record<string, string> = {
    'Sleep Aids': 'Order genuine UK sleeping pills: Zopiclone 7.5mg/10mg/20mg, Zolpidem 10mg, Nitrazepam 5mg/10mg, and Midazolam 7.5mg. Discreet unmarked packaging with Royal Mail Tracked 24 delivery.',
    'Anxiety & Calm': 'Buy authentic Diazepam (Sedil, Easium, Elipam), Clonazepam (Pase, Rivotril), Xanax, Alprax, Lorazepam, Bromazepam, Etizolam, and Pregabalin. Safe UK clinical supply with confidential dispatch.',
    'Pain Relief': 'High strength pain relief medications: Tramadol 100mg and Pain O Soma (Carisoprodol 350mg/500mg muscle relaxant). Fast next-day UK delivery.',
    'Nootropics & Focus': 'Order Modafinil 200mg (Modalert) and Ritalin 10mg (Methylphenidate Hydrochloride) online in the UK. 100% genuine pharmaceuticals for focus, ADHD, and cognitive stamina.'
  };

  const description = (!isAll && categoryDescriptions[category])
    ? categoryDescriptions[category]
    : 'PureSleep Pharma UK — Licensed online pharmacy dispensary supplying genuine sleep aids, anxiety relief, pain management, and nootropics with 100% discreet Royal Mail Tracked 24 delivery.';

  const keywords = isAll
    ? 'uk online pharmacy, buy sleeping pills uk, diazepam uk, xanax uk, zopiclone 7.5mg uk, pregabalin 300mg uk, modafinil 200mg uk, ritalin uk, royal mail tracked 24 meds, discreet medication uk'
    : `buy ${category.toLowerCase()} uk, order ${category.toLowerCase()} online, genuine ${category.toLowerCase()}, next day delivery ${category.toLowerCase()}, registered uk dispensary`;

  const breadcrumbs = [
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Treatments', url: `${SITE_URL}/?tab=shop` }
  ];
  if (!isAll) {
    breadcrumbs.push({ name: category, url: canonicalUrl });
  }

  const categoryProducts = isAll 
    ? REST_EASY_PRODUCTS 
    : REST_EASY_PRODUCTS.filter(p => p.category === category);

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isAll ? 'All UK Medications' : `${category} Medications`,
    description,
    numberOfItems: categoryProducts.length,
    itemListElement: categoryProducts.map((prod, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: prod.name,
      url: `${SITE_URL}/?med=${prod.id}`
    }))
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: b.name,
      item: b.url
    }))
  };

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    ogTitle: title,
    ogDescription: description,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    robots: 'index, follow',
    jsonLd: [itemListSchema, breadcrumbSchema],
    breadcrumb: breadcrumbs
  };
}

// Generate SEO for application tabs
export function getTabSEOMetadata(tab: NavigationTab): SEOMetadata {
  const pharmacySchema = {
    '@context': 'https://schema.org',
    '@type': 'Pharmacy',
    name: 'PureSleep Pharma UK',
    image: DEFAULT_OG_IMAGE,
    url: SITE_URL,
    telephone: '+44 7700 900892',
    priceRange: '££',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '142 Regent Street, Soho',
      addressLocality: 'London',
      postalCode: 'W1B 5AH',
      addressCountry: 'GB'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '51.5133',
      longitude: '-0.1384'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59'
      }
    ],
    paymentAccepted: 'Faster Payments Bank Transfer, Cryptocurrency, Debit Card, Cash on Delivery',
    currenciesAccepted: 'GBP'
  };

  switch (tab) {
    case 'triage': {
      return {
        title: 'Free UK Online Pharmacist Triage & Clinical Consultation | PureSleep Pharma',
        description: 'Instant confidential medical consultation and symptom assessment. Review BNF treatment guidelines for sleep, anxiety, chronic pain, and focus with our clinical dispensary system.',
        keywords: 'online doctor triage uk, free pharmacist consultation, sleep assessment uk, anxiety diagnosis advice, bnf treatment recommendations',
        canonicalUrl: `${SITE_URL}/?tab=triage`,
        ogTitle: 'Online Medical Triage Consultation - PureSleep Pharma UK',
        ogDescription: 'Instant confidential symptom assessment and clinical advice from UK registered pharmacists.',
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        twitterCard: 'summary_large_image',
        robots: 'index, follow',
        jsonLd: [
          pharmacySchema,
          {
            '@context': 'https://schema.org',
            '@type': 'MedicalWebPage',
            name: 'Online Clinical Triage Assessment',
            about: 'Assessment of insomnia, anxiety, and pain symptoms according to UK BNF protocols.'
          }
        ]
      };
    }

    case 'bnf-checker': {
      return {
        title: 'BNF Drug Interaction Checker UK | Clinical Safety Analysis | PureSleep Pharma',
        description: 'Real-time drug-drug interaction checker powered by the British National Formulary (BNF). Verify contraindications and safety between sedatives, opioids, and stimulants.',
        keywords: 'bnf interaction checker, drug contraindications uk, zopiclone diazepam interaction, codeine safety checker, pharmaceutical interactions',
        canonicalUrl: `${SITE_URL}/?tab=bnf-checker`,
        ogTitle: 'BNF Drug Interaction & Safety Checker | PureSleep Pharma',
        ogDescription: 'Verify interactions between medications safely against British National Formulary standards.',
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        twitterCard: 'summary_large_image',
        robots: 'index, follow',
        jsonLd: [
          pharmacySchema,
          {
            '@context': 'https://schema.org',
            '@type': 'MedicalWebPage',
            name: 'British National Formulary Drug Interaction Tool',
            description: 'Interactive clinical interaction checker for UK medicines.'
          }
        ]
      };
    }

    case 'tracking':
    case 'track-order': {
      return {
        title: 'Track Royal Mail Medication Parcel | Live UK Delivery Status | PureSleep Pharma',
        description: 'Track your confidential PureSleep Pharma parcel in real-time. Enter your REM tracking reference for live Royal Mail GPS scan updates and GPhC verified VAT invoices.',
        keywords: 'track royal mail 24 pharmacy parcel, medicine delivery status uk, puresleep tracking, royal mail special delivery 1pm tracking',
        canonicalUrl: `${SITE_URL}/?tab=tracking`,
        ogTitle: 'Live UK Order Tracking - Royal Mail Tracked 24 | PureSleep Pharma',
        ogDescription: 'Real-time parcel tracking for discreet pharmaceutical deliveries across the United Kingdom.',
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        twitterCard: 'summary_large_image',
        robots: 'index, follow',
        jsonLd: [pharmacySchema]
      };
    }

    case 'auto-refill': {
      return {
        title: 'Medication Auto-Refill Subscriptions | Save 10% on Every Order | PureSleep Pharma',
        description: 'Automate your repeat prescriptions and maintenance medications with flexible 30, 60, or 90-day intervals. Enjoy a 10% recurring discount, free priority shipping, and pause anytime.',
        keywords: 'repeat prescription subscription uk, automatic medicine refills, auto delivery sleeping pills uk, discount repeat meds',
        canonicalUrl: `${SITE_URL}/?tab=auto-refill`,
        ogTitle: 'Auto-Refill Medicine Subscriptions (10% Off) | PureSleep Pharma UK',
        ogDescription: 'Never run out of essential treatments. Flexible repeat delivery with automatic 10% discount and discreet packaging.',
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        twitterCard: 'summary_large_image',
        robots: 'index, follow',
        jsonLd: [pharmacySchema]
      };
    }

    case 'reviews': {
      return {
        title: 'Verified UK Patient Reviews & Trust Ratings (4.9/5) | PureSleep Pharma',
        description: 'Read 4,800+ authentic reviews from UK patients. Verified feedback on genuine blister-packed medicines, fast bank transfer processing, and discrete plain letterbox delivery.',
        keywords: 'puresleep pharma reviews, uk pharmacy trust ratings, genuine sleeping pills reviews, authentic diazepam uk review, royal mail delivery feedback',
        canonicalUrl: `${SITE_URL}/?tab=reviews`,
        ogTitle: 'Verified Customer Reviews & Ratings | PureSleep Pharma UK',
        ogDescription: '4.9/5 Rating from over 4,800 verified UK patients.',
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        twitterCard: 'summary_large_image',
        robots: 'index, follow',
        jsonLd: [
          pharmacySchema,
          {
            '@context': 'https://schema.org',
            '@type': 'AggregateRating',
            itemReviewed: {
              '@type': 'Pharmacy',
              name: 'PureSleep Pharma UK'
            },
            ratingValue: '4.94',
            reviewCount: '4820',
            bestRating: '5',
            worstRating: '1'
          }
        ]
      };
    }

    case 'support': {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FREQUENTLY_ASKED_QUESTIONS.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      };

      return {
        title: 'UK Pharmacy FAQs, Discrete Delivery & Payment Help | PureSleep Pharma',
        description: 'Find clear answers about our genuine UK medications, discrete packaging, Royal Mail Tracked 24 postage, Bank Transfer & Crypto payments, and WhatsApp ordering.',
        keywords: 'uk pharmacy faq, discreet shipping questions, bank transfer medication uk, crypto payment pharmacy, order via whatsapp',
        canonicalUrl: `${SITE_URL}/?tab=support`,
        ogTitle: 'Frequently Asked Questions & Patient Support | PureSleep Pharma',
        ogDescription: 'Everything you need to know about discreet delivery, genuine blister packs, and secure payment methods.',
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        twitterCard: 'summary_large_image',
        robots: 'index, follow',
        jsonLd: [pharmacySchema, faqSchema]
      };
    }

    case 'admin': {
      return {
        title: 'Dispensary Staff Portal | PureSleep Pharma UK',
        description: 'Internal dispensary order management and tracking dispatch console.',
        keywords: 'dispensary admin, order management',
        canonicalUrl: `${SITE_URL}/?tab=admin`,
        ogTitle: 'Dispensary Admin Console',
        ogDescription: 'Internal staff management system.',
        ogType: 'website',
        ogImage: DEFAULT_OG_IMAGE,
        twitterCard: 'summary',
        robots: 'noindex, nofollow',
        jsonLd: []
      };
    }

    case 'home':
    case 'shop':
    default:
      return getCategorySEOMetadata('All');
  }
}
