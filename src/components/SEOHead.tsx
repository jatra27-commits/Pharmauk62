import React, { useEffect, useState } from 'react';
import { SEOMetadata } from '../utils/seoData';
import { Share2, Check, ExternalLink, ShieldCheck } from 'lucide-react';

interface SEOHeadProps {
  seo: SEOMetadata;
  showShareBadge?: boolean;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ seo, showShareBadge = false }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Update Document Title
    if (seo.title) {
      document.title = seo.title;
    }

    // Helper to safely set or create standard meta tags
    const setMetaTag = (attribute: 'name' | 'property', attrValue: string, content: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attribute}="${attrValue}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', seo.description);
    setMetaTag('name', 'keywords', seo.keywords);
    setMetaTag('name', 'robots', seo.robots || 'index, follow');
    setMetaTag('name', 'author', 'PureSleep Pharma UK Pharmacy');
    setMetaTag('name', 'geo.region', 'GB');
    setMetaTag('name', 'geo.placename', 'London, United Kingdom');
    setMetaTag('name', 'geo.position', '51.5133;-0.1384');
    setMetaTag('name', 'ICBM', '51.5133, -0.1384');

    // 3. Open Graph Tags
    setMetaTag('property', 'og:title', seo.ogTitle || seo.title);
    setMetaTag('property', 'og:description', seo.ogDescription || seo.description);
    setMetaTag('property', 'og:type', seo.ogType || 'website');
    setMetaTag('property', 'og:url', seo.canonicalUrl);
    setMetaTag('property', 'og:image', seo.ogImage);
    setMetaTag('property', 'og:site_name', 'PureSleep Pharma');
    setMetaTag('property', 'og:locale', 'en_GB');

    // 4. Twitter Card Tags
    setMetaTag('name', 'twitter:card', seo.twitterCard || 'summary_large_image');
    setMetaTag('name', 'twitter:title', seo.ogTitle || seo.title);
    setMetaTag('name', 'twitter:description', seo.ogDescription || seo.description);
    setMetaTag('name', 'twitter:image', seo.ogImage);
    setMetaTag('name', 'twitter:site', '@PureSleepPharma');

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', seo.canonicalUrl);

    // 6. Structured Data (JSON-LD)
    if (seo.jsonLd && seo.jsonLd.length > 0) {
      let scriptTag = document.getElementById('seo-schema-jsonld') as HTMLScriptElement;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'seo-schema-jsonld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(
        seo.jsonLd.length === 1 ? seo.jsonLd[0] : { '@context': 'https://schema.org', '@graph': seo.jsonLd }
      );
    }
  }, [seo]);

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(seo.canonicalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      console.error('Failed to copy link', e);
    }
  };

  if (!showShareBadge && (!seo.breadcrumb || seo.breadcrumb.length <= 1)) {
    return null;
  }

  return (
    <div className="bg-[#031d14]/70 border-b border-emerald-800/40 py-2 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Breadcrumb List for Visual and Semantic Crawling */}
        {seo.breadcrumb && seo.breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-emerald-400/80 overflow-x-auto py-0.5">
            {seo.breadcrumb.map((crumb, idx) => {
              const isLast = idx === seo.breadcrumb!.length - 1;
              return (
                <React.Fragment key={crumb.url + idx}>
                  {idx > 0 && <span className="text-emerald-700">/</span>}
                  {isLast ? (
                    <span className="text-emerald-200 font-semibold truncate max-w-[200px]" aria-current="page">
                      {crumb.name}
                    </span>
                  ) : (
                    <a
                      href={crumb.url}
                      className="hover:text-emerald-200 transition-colors whitespace-nowrap"
                    >
                      {crumb.name}
                    </a>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        {/* Share & Verified Permlink Action */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>GPhC Verified UK Link</span>
          </span>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-300 hover:text-white border border-emerald-700/50 transition-all text-[11px] cursor-pointer"
            title="Copy permanent shareable link"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3 h-3 text-emerald-400" />
                <span>Share URL</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
