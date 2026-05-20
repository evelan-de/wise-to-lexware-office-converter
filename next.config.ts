import type { NextConfig } from "next";

// Extract origin from Jexity widget URL for CSP headers
const jexityWidgetUrl = process.env.NEXT_PUBLIC_JEXITY_WIDGET_URL;
const jexityCdnOrigin = jexityWidgetUrl
  ? new URL(jexityWidgetUrl).origin
  : "";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/stats/:match*",
        destination: "https://analytics.evelan.de/:match*",
      },
    ];
  },

  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Allow Jexity widget script from its CDN (and localhost:3003 for local dev)
              `script-src 'self' 'unsafe-eval' 'unsafe-inline'${jexityCdnOrigin ? ` ${jexityCdnOrigin}` : ""}`,
              "style-src 'self' 'unsafe-inline'",
              // Allow https: images for chat avatars etc.
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              // Allow Jexity widget to reach its Convex backend (HTTPS + WebSocket + HTTP actions).
              // Wildcards avoid tying the embedder to a specific Convex deployment.
              `connect-src 'self'${jexityCdnOrigin ? ` ${jexityCdnOrigin}` : ""} https://*.convex.cloud wss://*.convex.cloud https://*.convex.site`,
              "object-src 'none'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
