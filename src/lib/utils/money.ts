import { currencySymbol } from "@/lib/data/currencies";
import type { LineItem } from "@/lib/data/types";

export function formatMoney(amount: number, code = "USD") {
  const sym = currencySymbol(code);
  const fractionDigits = code === "JPY" ? 0 : 2;
  return `${sym}${amount.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

export function computeTotals(items: LineItem[]) {
  let subtotal = 0;
  let taxTotal = 0;
  let discountTotal = 0;
  for (const it of items) {
    const line = it.quantity * it.price;
    const disc = line * (it.discount / 100);
    const taxed = (line - disc) * (it.tax / 100);
    subtotal += line;
    discountTotal += disc;
    taxTotal += taxed;
  }
  const total = subtotal - discountTotal + taxTotal;
  return { subtotal, taxTotal, discountTotal, total };
}
