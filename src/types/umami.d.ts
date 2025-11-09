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
   * Identify a user
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
