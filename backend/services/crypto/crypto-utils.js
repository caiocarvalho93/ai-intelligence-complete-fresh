/**
 * 🛠️ CRYPTO UTILITIES
 * Helper functions for crypto data processing
 */

/**
 * Format large numbers with appropriate suffixes
 */
export function formatLargeNumber(num) {
  if (!num) return '0';
  
  const absNum = Math.abs(num);
  
  if (absNum >= 1e12) {
    return (num / 1e12).toFixed(2) + 'T';
  } else if (absNum >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  } else if (absNum >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  } else if (absNum >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  }
  
  return num.toFixed(2);
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(oldValue, newValue) {
  if (!oldValue || oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Format percentage with color coding
 */
export function formatPercentage(percentage, includeSign = true) {
  if (!percentage) return '0.00%';
  
  const sign = includeSign && percentage > 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
}

/**
 * Get color class based on percentage change
 */
export function getChangeColor(percentage) {
  if (!percentage) return 'text-gray-400';
  return percentage >= 0 ? 'text-green-400' : 'text-red-400';
}

/**
 * Format currency with proper decimals
 */
export function formatCurrency(amount, currency = 'USD', decimals = 2) {
  if (!amount) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
}

/**
 * Calculate market dominance
 */
export function calculateDominance(coinMarketCap, totalMarketCap) {
  if (!coinMarketCap || !totalMarketCap) return 0;
  return (coinMarketCap / totalMarketCap) * 100;
}

/**
 * Process sparkline data for charts
 */
export function processSparklineData(prices) {
  if (!prices || !Array.isArray(prices)) return [];
  
  return prices.map(([timestamp, price]) => ({
    time: new Date(timestamp).toISOString(),
    price: parseFloat(price),
    timestamp
  }));
}

/**
 * Get trend direction
 */
export function getTrendDirection(data) {
  if (!data || data.length < 2) return 'neutral';
  
  const start = data[0].price;
  const end = data[data.length - 1].price;
  
  if (end > start) return 'up';
  if (end < start) return 'down';
  return 'neutral';
}

/**
 * Calculate volatility (standard deviation of price changes)
 */
export function calculateVolatility(prices) {
  if (!prices || prices.length < 2) return 0;
  
  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    const change = (prices[i][1] - prices[i-1][1]) / prices[i-1][1];
    changes.push(change);
  }
  
  const mean = changes.reduce((sum, change) => sum + change, 0) / changes.length;
  const variance = changes.reduce((sum, change) => sum + Math.pow(change - mean, 2), 0) / changes.length;
  
  return Math.sqrt(variance) * 100; // Return as percentage
}

export default {
  formatLargeNumber,
  calculatePercentageChange,
  formatPercentage,
  getChangeColor,
  formatCurrency,
  calculateDominance,
  processSparklineData,
  getTrendDirection,
  calculateVolatility
};