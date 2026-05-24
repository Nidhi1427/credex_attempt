export function formatCurrency(amountInUSD: number, currency: 'USD' | 'INR'): string {
  if (currency === 'INR') {
    const amountInINR = amountInUSD * 83; // Baseline stable exchange rate anchor
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amountInINR);
  }

  // Fallback to standard corporate USD format
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amountInUSD);
}