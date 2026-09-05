import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSitemapXML } from '../src/utils/sitemapGenerator.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SITE_URL = process.env.SITE_URL || 'https://resteasymeds.co.uk';

export function writeSitemapFiles(): void {
  const { xml, entriesCount, productsCount, categoriesCount } = generateSitemapXML(SITE_URL);

  // 1. Ensure public directory exists and write public/sitemap.xml
  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const publicSitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(publicSitemapPath, xml, 'utf8');
  console.log(`✅ [Sitemap Generator] Wrote: ${publicSitemapPath}`);

  // 2. If dist directory exists, write dist/sitemap.xml for production server static fallback
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    const distSitemapPath = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(distSitemapPath, xml, 'utf8');
    console.log(`✅ [Sitemap Generator] Wrote: ${distSitemapPath}`);
  }

  console.log(`\n🎉 Sitemap Generation Complete!`);
  console.log(`   ────────────────────────────────────────`);
  console.log(`   📍 Total URLs Indexed:      ${entriesCount}`);
  console.log(`   💊 Individual Medications:  ${productsCount}`);
  console.log(`   🏷️  Product Categories:     ${categoriesCount}`);
  console.log(`   🌐 Canonical Base URL:      ${SITE_URL}`);
  console.log(`   ────────────────────────────────────────\n`);
}

// Execute directly if run as script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeSitemapFiles();
}
