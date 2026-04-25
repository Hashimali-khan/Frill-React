/**
 * formatPKR — Format integer amount to Pakistani Rupee display string
 * @param {number} amount  - Integer, e.g. 2999
 * @param {boolean} compact - "Rs. 3K" for compact display
 * @returns {string}
 */
export function formatPKR(amount, compact = false) {
  if (compact && amount >= 1000) {
    return `Rs. ${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`
  }
  return `Rs. ${amount.toLocaleString('en-PK')}`
}

// Usage: formatPKR(2999)    → "Rs. 2,999"
//        formatPKR(15000, true) → "Rs. 15K"