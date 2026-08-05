export function formatSAR(amount: number): string {
  return `${amount.toLocaleString("ar-SA")} ريال`;
}

export function formatSARCompact(amount: number): string {
  return `${amount} ريال`;
}

export function savingsAmount(fullPrice: number, offerPrice: number): number {
  return fullPrice - offerPrice;
}
