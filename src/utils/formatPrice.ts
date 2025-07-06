/**
 * Format a number as a price with currency symbol
 * @param price - The price to format
 * @param currency - The currency code (default: USD)
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Calculate discount percentage
 * @param originalPrice - The original price
 * @param discountedPrice - The discounted price
 * @returns Discount percentage as a number
 */
export function calculateDiscountPercentage(
  originalPrice: number,
  discountedPrice: number
): number {
  if (originalPrice <= 0 || discountedPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

/**
 * Format a discount percentage
 * @param percentage - The discount percentage
 * @returns Formatted discount percentage string
 */
export function formatDiscountPercentage(percentage: number): string {
  return `${percentage}% OFF`;
}

/**
 * Check if a product is on sale
 * @param price - The current price
 * @param compareAtPrice - The original price to compare against
 * @returns Boolean indicating if the product is on sale
 */
export function isOnSale(price: number, compareAtPrice?: number): boolean {
  return !!compareAtPrice && compareAtPrice > price;
}

/**
 * Format a price range for products with variants
 * @param minPrice - The minimum price
 * @param maxPrice - The maximum price
 * @param currency - The currency code (default: USD)
 * @returns Formatted price range string
 */
export function formatPriceRange(minPrice: number, maxPrice: number, currency = 'USD'): string {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice, currency);
  }
  return `${formatPrice(minPrice, currency)} - ${formatPrice(maxPrice, currency)}`;
}
