import Script from "next/script";

/**
 * Umami Analytics Component
 *
 * Self-hosted privacy-friendly analytics
 * - Script loaded from /stats/script.js (rewritten to analytics.evelan.de)
 * - Only loads in production
 * - GDPR compliant - no cookies, no personal data
 */
export function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const isProduction = process.env.NODE_ENV === "production";

  // Only load in production and if website ID is configured
  if (!isProduction || !websiteId) {
    return null;
  }

  return (
    <Script
      src="/stats/script.js"
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}
