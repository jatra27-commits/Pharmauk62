import { REST_EASY_PRODUCTS } from '../data/medicineCatalog';

export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  title?: string;
  image?: string;
  caption?: string;
}

export function generateSitemapXML(baseUrl?: string): { 
  xml: string; 
  entriesCount: number; 
  productsCount: number; 
  categoriesCount: number;
} {
  const SITE_URL = baseUrl || process.env.SITE_URL || 'https://puresleeppharma.co.uk';
  const today = new Date().toISOString().split('T')[0];

  // 1. Core High-Priority Pages
  const mainPages: SitemapEntry[] = [
    {
      url: `${SITE_URL}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: '1.00',
      title: 'PureSleep Pharma UK | Online Pharmacy & Genuine Medications'
    },
    {
      url: `${SITE_URL}/?tab=shop`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.95',
      title: 'Browse All UK Licensed Medications & Treatments'
    },
    {
      url: `${SITE_URL}/?tab=triage`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.90',
      title: 'Free UK Online Clinical Consultation & Pharmacist Triage'
    },
    {
      url: `${SITE_URL}/?tab=bnf-checker`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.85',
      title: 'British National Formulary (BNF) Drug Interaction Checker'
    },
    {
      url: `${SITE_URL}/?tab=auto-refill`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.80',
      title: 'Medication Repeat Subscriptions & Auto-Refills (10% Discount)'
    },
    {
      url: `${SITE_URL}/?tab=reviews`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.85',
      title: 'Verified Patient Reviews & UK Pharmacy Trust Ratings (4.9/5)'
    },
    {
      url: `${SITE_URL}/?tab=support`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.75',
      title: 'UK Pharmacy FAQs, Discreet Delivery & Payment Support'
    },
    {
      url: `${SITE_URL}/?tab=tracking`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.70',
      title: 'Live Royal Mail Tracked 24 Parcel Tracking Status'
    }
  ];

  // 2. Dynamic Categories Extracted from Catalog
  const uniqueCategories = Array.from(new Set(REST_EASY_PRODUCTS.map((p) => p.category)));

  const categoryEntries: SitemapEntry[] = uniqueCategories.map((category) => ({
    url: `${SITE_URL}/?category=${encodeURIComponent(category)}`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.85',
    title: `Buy Genuine ${category} Online UK - Next-Day Delivery`
  }));

  // 3. Dynamic Products Extracted from Catalog
  const productEntries: SitemapEntry[] = REST_EASY_PRODUCTS.map((product) => {
    const defaultImg = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&h=630&q=80';
    const productImg = product.imageUrl || defaultImg;
    const isPriority = product.isBestSeller || product.rating >= 4.85;

    return {
      url: `${SITE_URL}/?med=${encodeURIComponent(product.id)}`,
      lastmod: today,
      changefreq: 'daily',
      priority: isPriority ? '0.95' : '0.90',
      title: `Buy ${product.name} (${product.strength}) Online UK`,
      image: productImg,
      caption: `Genuine ${product.name} (${product.activeIngredient}) - Licensed UK Dispensary Supply with Royal Mail Tracked 24 Delivery`
    };
  });

  const allEntries = [...mainPages, ...categoryEntries, ...productEntries];

  // Build standard Google-compliant XML structure
  const xmlLines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"',
    '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">'
  ];

  for (const entry of allEntries) {
    xmlLines.push('  <url>');
    xmlLines.push(`    <loc>${entry.url}</loc>`);
    xmlLines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    xmlLines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    xmlLines.push(`    <priority>${entry.priority}</priority>`);
    
    if (entry.image) {
      xmlLines.push('    <image:image>');
      xmlLines.push(`      <image:loc>${entry.image}</image:loc>`);
      if (entry.title) {
        xmlLines.push(`      <image:title><![CDATA[${entry.title}]]></image:title>`);
      }
      if (entry.caption) {
        xmlLines.push(`      <image:caption><![CDATA[${entry.caption}]]></image:caption>`);
      }
      xmlLines.push('    </image:image>');
    }

    xmlLines.push('  </url>');
  }

  xmlLines.push('</urlset>');
  const xml = xmlLines.join('\n');

  return {
    xml,
    entriesCount: allEntries.length,
    productsCount: productEntries.length,
    categoriesCount: categoryEntries.length
  };
}
