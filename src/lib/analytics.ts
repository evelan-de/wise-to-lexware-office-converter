/**
 * Umami Analytics Tracking Utilities
 *
 * Privacy-friendly event tracking for user interactions
 * Only tracks high-level events, no personal or financial data
 */

/**
 * Track a custom event in Umami Analytics
 * @param eventName - Name of the event to track
 * @param eventData - Optional event data (no personal/financial data)
 */
export function trackEvent(eventName: string, eventData?: Record<string, string | number | boolean>): void {
  // Only track in production and if Umami is loaded
  if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined' || !window.umami) {
    return;
  }

  try {
    window.umami.track(eventName, eventData);
  } catch (error) {
    // Silently fail - analytics should never break the app
    console.debug('Analytics tracking failed:', error);
  }
}

/**
 * Track file upload event
 * @param fileSize - Size of the uploaded file in bytes
 */
export function trackFileUpload(fileSize: number): void {
  trackEvent('file-uploaded', {
    // Only track file size category, not exact size
    sizeCategory: getFileSizeCategory(fileSize),
  });
}

/**
 * Track successful conversion event
 * @param transactionCount - Number of transactions converted
 */
export function trackConversionSuccess(transactionCount: number): void {
  trackEvent('conversion-success', {
    // Only track transaction count category, not exact count
    transactionCategory: getTransactionCountCategory(transactionCount),
  });
}

/**
 * Track conversion error event
 * @param errorType - Type of error (validation, parsing, etc.)
 */
export function trackConversionError(errorType: string): void {
  trackEvent('conversion-error', {
    errorType,
  });
}

/**
 * Get file size category for privacy-friendly tracking
 */
function getFileSizeCategory(bytes: number): string {
  if (bytes < 10 * 1024) return 'tiny'; // < 10 KB
  if (bytes < 100 * 1024) return 'small'; // < 100 KB
  if (bytes < 1024 * 1024) return 'medium'; // < 1 MB
  return 'large'; // >= 1 MB
}

/**
 * Get transaction count category for privacy-friendly tracking
 */
function getTransactionCountCategory(count: number): string {
  if (count < 10) return 'few'; // < 10
  if (count < 50) return 'medium'; // < 50
  if (count < 100) return 'many'; // < 100
  return 'very-many'; // >= 100
}
