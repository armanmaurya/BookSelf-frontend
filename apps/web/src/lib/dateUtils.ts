/**
 * Utility functions for consistent date formatting across server and client
 */

/**
 * Format date consistently for display
 * Uses a specific locale and options to avoid hydration mismatches
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    // Use a consistent format that works the same on server and client
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit", 
      day: "2-digit"
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

/**
 * Format date for display with month name
 */
export function formatDateLong(dateString: string): string {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

/**
 * Format date for ISO string (for datetime attributes)
 */
export function formatDateISO(dateString: string): string {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error("Error formatting date to ISO:", error);
    return "";
  }
}