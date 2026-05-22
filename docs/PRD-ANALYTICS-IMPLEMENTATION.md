# PRD: Umami Analytics Implementation for Next.js Projects

## Overview

This document provides a comprehensive guide for implementing privacy-friendly Umami Analytics in Next.js 15+ projects. The implementation uses self-hosted Umami, Next.js rewrites for script proxying, and TypeScript for type-safe event tracking.

**Key Benefits:**
- GDPR compliant (no cookies, no personal data)
- Self-hosted for full data ownership
- Ad-blocker resistant (via rewrites)
- Lightweight (~2KB script)
- TypeScript support

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Architecture Overview](#2-architecture-overview)
3. [Implementation Steps](#3-implementation-steps)
4. [File Structure](#4-file-structure)
5. [Code Implementation](#5-code-implementation)
6. [Usage Examples](#6-usage-examples)
7. [Testing](#7-testing)
8. [Deployment Checklist](#8-deployment-checklist)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites

### Required
- Next.js 15+ with App Router
- Self-hosted Umami instance (e.g., on Vercel, Railway, or your own server)
- Website ID from Umami dashboard

### Umami Setup
1. Deploy Umami to your infrastructure
2. Create a new website in Umami dashboard
3. Copy the Website ID (UUID format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

**Recommended Umami hosting options:**
- Self-hosted on your VPS
- Vercel (free tier available)
- Railway
- Docker on any cloud provider

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js Application                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐    ┌──────────────────┐    ┌──────────────┐  │
│   │   Layout     │───►│ Analytics        │    │ Analytics    │  │
│   │   (layout.tsx)│   │ Component        │    │ Utils        │  │
│   └──────────────┘    │ (script loader)  │    │ (tracking)   │  │
│                       └────────┬─────────┘    └──────┬───────┘  │
│                                │                      │          │
│                                ▼                      ▼          │
│                       ┌────────────────────────────────┐        │
│                       │     window.umami               │        │
│                       │     (global tracking object)   │        │
│                       └────────────────┬───────────────┘        │
│                                        │                         │
├────────────────────────────────────────┼─────────────────────────┤
│                    Next.js Rewrites    │                         │
│                                        ▼                         │
│                       /stats/* ──► analytics.yourdomain.com/*   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────┐
                        │   Umami Analytics Server  │
                        │   (self-hosted)           │
                        └───────────────────────────┘
```

### Why Use Rewrites?

1. **Ad-blocker resistance**: The script loads from your domain (`/stats/script.js`) instead of a third-party domain
2. **Privacy**: No cross-origin requests visible to users
3. **Performance**: Same-origin requests benefit from connection reuse
4. **CSP compliance**: Easier Content Security Policy configuration

---

## 3. Implementation Steps

### Step 1: Environment Variables

Create or update `.env.local`:

```env
# Umami Analytics
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id-here
```

Create `.env.example` for documentation:

```env
# Umami Analytics (optional - only needed for production)
# Get your website ID from your Umami dashboard
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
```

### Step 2: Configure Next.js Rewrites

Update `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Proxy analytics requests through your domain
        source: "/stats/:match*",
        destination: "https://analytics.yourdomain.com/:match*",
      },
    ];
  },
};

export default nextConfig;
```

**Replace** `analytics.yourdomain.com` with your Umami instance URL.

### Step 3: Create TypeScript Types

Create `src/types/umami.d.ts`:

```typescript
/**
 * Umami Analytics Type Definitions
 * @see https://umami.is/docs/tracker-functions
 */

interface UmamiEventData {
  [key: string]: string | number | boolean;
}

interface Umami {
  /**
   * Track a custom event
   * @param eventName - Name of the event
   * @param eventData - Optional event data
   */
  track(eventName: string, eventData?: UmamiEventData): void;

  /**
   * Track a custom event with a callback
   * @param callback - Callback function
   * @param eventName - Name of the event
   * @param eventData - Optional event data
   */
  track(
    callback: () => void,
    eventName: string,
    eventData?: UmamiEventData
  ): void;

  /**
   * Identify a user (for session tracking)
   * @param data - User identification data
   */
  identify(data: UmamiEventData): void;
}

declare global {
  interface Window {
    umami?: Umami;
  }
}

export {};
```

### Step 4: Create Analytics Component

Create `src/components/analytics.tsx`:

```typescript
import Script from "next/script";

/**
 * Umami Analytics Component
 *
 * Self-hosted privacy-friendly analytics
 * - Script loaded from /stats/script.js (rewritten to your Umami instance)
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
```

### Step 5: Create Analytics Utilities

Create `src/lib/analytics.ts`:

```typescript
/**
 * Umami Analytics Tracking Utilities
 *
 * Privacy-friendly event tracking for user interactions
 * Only tracks high-level events, no personal data
 */

/**
 * Track a custom event in Umami Analytics
 * @param eventName - Name of the event to track
 * @param eventData - Optional event data (no personal data!)
 */
export function trackEvent(
  eventName: string,
  eventData?: Record<string, string | number | boolean>
): void {
  // Only track in production and if Umami is loaded
  if (
    process.env.NODE_ENV !== "production" ||
    typeof window === "undefined" ||
    !window.umami
  ) {
    return;
  }

  try {
    window.umami.track(eventName, eventData);
  } catch (error) {
    // Silently fail - analytics should never break the app
    console.debug("Analytics tracking failed:", error);
  }
}

// ============================================
// Domain-Specific Tracking Functions
// ============================================
// Add your own tracking functions below based on your app's needs

/**
 * Example: Track a button click
 */
export function trackButtonClick(buttonName: string): void {
  trackEvent("button-click", { button: buttonName });
}

/**
 * Example: Track a form submission
 */
export function trackFormSubmit(formName: string, success: boolean): void {
  trackEvent("form-submit", {
    form: formName,
    success,
  });
}

/**
 * Example: Track a feature usage
 */
export function trackFeatureUsage(featureName: string): void {
  trackEvent("feature-used", { feature: featureName });
}

/**
 * Example: Track an error occurrence (without sensitive details)
 */
export function trackError(errorType: string): void {
  trackEvent("error-occurred", { type: errorType });
}
```

### Step 6: Add to Layout

Update `src/app/layout.tsx`:

```typescript
import { Analytics } from "@/components/analytics";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Umami Analytics - loads only in production */}
        <Analytics />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 4. File Structure

```
your-nextjs-project/
├── src/
│   ├── app/
│   │   └── layout.tsx              # Import and use <Analytics />
│   ├── components/
│   │   └── analytics.tsx           # Script loader component
│   ├── lib/
│   │   └── analytics.ts            # Tracking utility functions
│   └── types/
│       └── umami.d.ts              # TypeScript definitions
├── next.config.ts                  # Rewrites configuration
├── .env.local                      # NEXT_PUBLIC_UMAMI_WEBSITE_ID
└── .env.example                    # Template for env vars
```

---

## 5. Code Implementation

### Complete Analytics Component

```typescript
// src/components/analytics.tsx
import Script from "next/script";

export function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const isProduction = process.env.NODE_ENV === "production";

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
```

### Complete Analytics Utilities with Privacy Patterns

```typescript
// src/lib/analytics.ts

/**
 * Core tracking function
 */
export function trackEvent(
  eventName: string,
  eventData?: Record<string, string | number | boolean>
): void {
  if (
    process.env.NODE_ENV !== "production" ||
    typeof window === "undefined" ||
    !window.umami
  ) {
    return;
  }

  try {
    window.umami.track(eventName, eventData);
  } catch (error) {
    console.debug("Analytics tracking failed:", error);
  }
}

// ============================================
// Privacy-Friendly Categorization Helpers
// ============================================

/**
 * Categorize file sizes for privacy-friendly tracking
 * Never track exact file sizes - use categories instead
 */
export function getFileSizeCategory(bytes: number): string {
  if (bytes < 10 * 1024) return "tiny"; // < 10 KB
  if (bytes < 100 * 1024) return "small"; // < 100 KB
  if (bytes < 1024 * 1024) return "medium"; // < 1 MB
  if (bytes < 10 * 1024 * 1024) return "large"; // < 10 MB
  return "very-large"; // >= 10 MB
}

/**
 * Categorize counts for privacy-friendly tracking
 * Never track exact counts - use categories instead
 */
export function getCountCategory(count: number): string {
  if (count < 5) return "few";
  if (count < 20) return "some";
  if (count < 100) return "many";
  return "very-many";
}

/**
 * Categorize durations for privacy-friendly tracking
 */
export function getDurationCategory(ms: number): string {
  if (ms < 1000) return "instant"; // < 1s
  if (ms < 5000) return "fast"; // < 5s
  if (ms < 30000) return "normal"; // < 30s
  return "slow"; // >= 30s
}

// ============================================
// Domain-Specific Tracking Functions
// ============================================

/**
 * Track file upload
 */
export function trackFileUpload(fileSize: number): void {
  trackEvent("file-uploaded", {
    sizeCategory: getFileSizeCategory(fileSize),
  });
}

/**
 * Track successful operation
 */
export function trackSuccess(operation: string, itemCount?: number): void {
  const data: Record<string, string | number | boolean> = { operation };
  if (itemCount !== undefined) {
    data.countCategory = getCountCategory(itemCount);
  }
  trackEvent("operation-success", data);
}

/**
 * Track error (type only, no sensitive details)
 */
export function trackError(errorType: string): void {
  trackEvent("operation-error", { errorType });
}

/**
 * Track page/feature engagement
 */
export function trackEngagement(feature: string, action: string): void {
  trackEvent("user-engagement", { feature, action });
}
```

### Complete Next.js Config

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/stats/:match*",
        destination: "https://analytics.yourdomain.com/:match*",
      },
    ];
  },

  // Optional: Add security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "connect-src 'self'", // Analytics works via same-origin
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## 6. Usage Examples

### Basic Page View Tracking

Page views are tracked automatically by Umami. No code needed.

### Button Click Tracking

```typescript
// src/components/my-button.tsx
"use client";

import { trackEvent } from "@/lib/analytics";

export function MyButton() {
  const handleClick = () => {
    trackEvent("cta-clicked", { location: "hero" });
    // ... rest of your logic
  };

  return <button onClick={handleClick}>Get Started</button>;
}
```

### Form Submission Tracking

```typescript
// src/components/contact-form.tsx
"use client";

import { trackEvent } from "@/lib/analytics";

export function ContactForm() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitForm();
      trackEvent("form-submitted", { form: "contact", success: true });
    } catch (error) {
      trackEvent("form-submitted", { form: "contact", success: false });
    }
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

### File Upload Tracking (Privacy-Friendly)

```typescript
// src/components/file-uploader.tsx
"use client";

import { trackFileUpload } from "@/lib/analytics";

export function FileUploader() {
  const handleFileSelect = (file: File) => {
    // Track only the size category, not the exact size
    trackFileUpload(file.size);
    // ... process file
  };

  return <input type="file" onChange={(e) => handleFileSelect(e.target.files![0])} />;
}
```

### Error Tracking (Without Sensitive Data)

```typescript
// src/lib/error-handler.ts
import { trackError } from "@/lib/analytics";

export function handleError(error: Error): void {
  // Categorize the error - never send the actual message
  const errorType = categorizeError(error);
  trackError(errorType);

  // Show user-friendly error message
  // ...
}

function categorizeError(error: Error): string {
  if (error.message.includes("network")) return "network-error";
  if (error.message.includes("validation")) return "validation-error";
  if (error.message.includes("timeout")) return "timeout-error";
  return "unknown-error";
}
```

### Feature Usage Tracking

```typescript
// src/hooks/use-feature-tracking.ts
"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function useFeatureTracking(featureName: string) {
  useEffect(() => {
    trackEvent("feature-viewed", { feature: featureName });

    return () => {
      trackEvent("feature-left", { feature: featureName });
    };
  }, [featureName]);
}

// Usage in a component:
export function DashboardPage() {
  useFeatureTracking("dashboard");
  return <div>{/* ... */}</div>;
}
```

---

## 7. Testing

### Development Mode

Analytics is disabled in development by default. To test:

1. **Verify component renders null in dev:**
   ```typescript
   // The Analytics component returns null in development
   // Check browser DevTools - no /stats/script.js request
   ```

2. **Test tracking functions don't throw:**
   ```typescript
   // Tracking functions silently no-op in development
   trackEvent("test-event"); // No error, no network request
   ```

### Production Testing

1. **Build and start production:**
   ```bash
   npm run build
   npm start
   ```

2. **Verify script loads:**
   - Open DevTools → Network tab
   - Look for `/stats/script.js` request
   - Should return 200 with Umami script

3. **Verify events track:**
   - Open Umami dashboard
   - Navigate your site
   - Events should appear in real-time

### Unit Testing Analytics Functions

```typescript
// src/lib/__tests__/analytics.test.ts
import { getFileSizeCategory, getCountCategory } from "../analytics";

describe("analytics utilities", () => {
  describe("getFileSizeCategory", () => {
    it("categorizes tiny files", () => {
      expect(getFileSizeCategory(1024)).toBe("tiny");
    });

    it("categorizes small files", () => {
      expect(getFileSizeCategory(50 * 1024)).toBe("small");
    });

    it("categorizes medium files", () => {
      expect(getFileSizeCategory(500 * 1024)).toBe("medium");
    });

    it("categorizes large files", () => {
      expect(getFileSizeCategory(5 * 1024 * 1024)).toBe("large");
    });
  });

  describe("getCountCategory", () => {
    it("categorizes few items", () => {
      expect(getCountCategory(3)).toBe("few");
    });

    it("categorizes many items", () => {
      expect(getCountCategory(50)).toBe("many");
    });
  });
});
```

---

## 8. Deployment Checklist

### Before Deployment

- [ ] Umami instance is running and accessible
- [ ] Website created in Umami dashboard
- [ ] `NEXT_PUBLIC_UMAMI_WEBSITE_ID` added to deployment platform (Vercel, etc.)
- [ ] Rewrite URL in `next.config.ts` points to your Umami instance
- [ ] TypeScript types are in place
- [ ] Analytics component is in layout

### After Deployment

- [ ] Visit production site
- [ ] Check DevTools Network tab for `/stats/script.js` (200 OK)
- [ ] Check Umami dashboard for page views
- [ ] Test custom events by triggering tracked actions
- [ ] Verify events appear in Umami dashboard

### Environment Variables by Platform

**Vercel:**
```
Settings → Environment Variables → Add:
NEXT_PUBLIC_UMAMI_WEBSITE_ID = your-website-id
```

**Netlify:**
```
Site settings → Environment variables → Add:
NEXT_PUBLIC_UMAMI_WEBSITE_ID = your-website-id
```

**Docker:**
```dockerfile
ENV NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
```

---

## 9. Troubleshooting

### Script Not Loading

**Symptom:** No `/stats/script.js` request in Network tab

**Solutions:**
1. Verify `NODE_ENV=production` in your deployment
2. Check `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is set
3. Verify the Analytics component is in your layout's `<head>`

### 404 on /stats/script.js

**Symptom:** Script request returns 404

**Solutions:**
1. Verify your Umami instance is running
2. Check the rewrite URL in `next.config.ts`
3. Test the Umami URL directly: `https://analytics.yourdomain.com/script.js`

### Events Not Appearing in Dashboard

**Symptom:** Page views work but custom events don't show

**Solutions:**
1. Check browser console for errors
2. Verify `window.umami` exists before calling track
3. Events may have a short delay (1-2 minutes)
4. Check Umami dashboard → Events tab (not just Overview)

### CORS Errors

**Symptom:** CORS error when loading script

**Solutions:**
1. Rewrites should prevent CORS issues - verify rewrite is working
2. Check that your Umami instance allows requests from your domain
3. If using Cloudflare, ensure it's not blocking the proxy

### TypeScript Errors

**Symptom:** `Property 'umami' does not exist on type 'Window'`

**Solutions:**
1. Ensure `src/types/umami.d.ts` exists
2. Check `tsconfig.json` includes the types directory:
   ```json
   {
     "compilerOptions": {
       "typeRoots": ["./node_modules/@types", "./src/types"]
     }
   }
   ```

---

## Privacy Best Practices

### DO Track

- Feature usage (which features are popular)
- Error types (not messages)
- File size categories (not exact sizes)
- Count categories (not exact numbers)
- Success/failure of operations
- User flow/journey (page sequences)

### DON'T Track

- Personal information (names, emails)
- Financial data (amounts, account numbers)
- Exact file sizes or counts
- Error messages (may contain sensitive data)
- Form field contents
- Search queries (may contain sensitive data)
- IP addresses (Umami anonymizes by default)

### Example: Safe vs Unsafe

```typescript
// ❌ UNSAFE - Don't do this
trackEvent("file-uploaded", {
  fileName: file.name,        // Could contain personal info
  fileSize: file.size,        // Exact size
  userEmail: user.email,      // Personal data
});

// ✅ SAFE - Do this instead
trackEvent("file-uploaded", {
  fileType: getFileExtension(file.name),  // Just the type
  sizeCategory: getFileSizeCategory(file.size),  // Category only
});
```

---

## Summary

This implementation provides:

1. **Privacy-first analytics** - No cookies, no personal data, GDPR compliant
2. **Self-hosted control** - Your data stays on your infrastructure
3. **Ad-blocker resistant** - Script served from your domain via rewrites
4. **Type-safe** - Full TypeScript support for event tracking
5. **Production-only** - Automatically disabled in development
6. **Graceful degradation** - Never breaks the app if analytics fails

For questions about Umami itself, see the [official documentation](https://umami.is/docs).
