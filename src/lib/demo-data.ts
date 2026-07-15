// Barrel re-exports for back-compat. New code should import from
// @/lib/data/*, @/lib/utils/money, or @/lib/store/app-store directly.
export type { InvoiceStatus, LineItem, Client, Invoice } from "@/lib/data/types";
export { CURRENCIES, currencySymbol } from "@/lib/data/currencies";
export { formatMoney, computeTotals } from "@/lib/utils/money";
export {
  BUSINESS_PROFILE,
  SEED_CLIENTS as CLIENTS,
  SEED_INVOICES as INVOICES,
  FAQ,
  TESTIMONIALS,
} from "@/lib/data/seed";
