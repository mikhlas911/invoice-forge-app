export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "partial";

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  price: number;
  tax: number;
  discount: number;
};

export type Client = {
  id: string;
  name: string;
  company: string;
  email: string;
  address: string;
  invoicesCount: number;
  totalBilled: number;
};

export type Invoice = {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  clientCompany: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  currency: string;
  items: LineItem[];
  notes: string;
  terms: string;
  amountPaid: number;
};

export const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "CAD", symbol: "CA$" },
  { code: "AUD", symbol: "A$" },
  { code: "JPY", symbol: "¥" },
];

export function currencySymbol(code: string) {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code + " ";
}

export function formatMoney(amount: number, code = "USD") {
  const sym = currencySymbol(code);
  return `${sym}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

export const CLIENTS: Client[] = [
  { id: "c1", name: "Sara Whitfield", company: "Northwind Studio", email: "sara@northwind.co", address: "221B Baker St, London", invoicesCount: 8, totalBilled: 18420 },
  { id: "c2", name: "Marcus Lee", company: "Halcyon Labs", email: "marcus@halcyon.io", address: "500 Terry Francois, San Francisco", invoicesCount: 4, totalBilled: 9600 },
  { id: "c3", name: "Priya Raman", company: "Meridian Consulting", email: "priya@meridian.co", address: "12 Marina Blvd, Singapore", invoicesCount: 12, totalBilled: 34210 },
  { id: "c4", name: "Julia Ostberg", company: "Kestrel & Co.", email: "julia@kestrel.se", address: "Storgatan 4, Stockholm", invoicesCount: 3, totalBilled: 5220 },
  { id: "c5", name: "Diego Alvarez", company: "Cobalt Films", email: "diego@cobalt.film", address: "Av. Reforma 22, Mexico City", invoicesCount: 6, totalBilled: 14750 },
];

export const INVOICES: Invoice[] = [
  {
    id: "i1", number: "INV-2026-0042", clientId: "c3", clientName: "Priya Raman", clientCompany: "Meridian Consulting",
    issueDate: "2026-07-01", dueDate: "2026-07-15", status: "paid", currency: "USD",
    items: [
      { id: "l1", description: "Brand strategy workshop", quantity: 2, price: 1800, tax: 8, discount: 0 },
      { id: "l2", description: "Visual identity system", quantity: 1, price: 4500, tax: 8, discount: 5 },
    ],
    notes: "Thanks for the trust — invoice 3 of 4 for the Meridian engagement.",
    terms: "Payment due within 14 days. Late payments accrue 1.5% monthly.",
    amountPaid: 8748,
  },
  {
    id: "i2", number: "INV-2026-0041", clientId: "c1", clientName: "Sara Whitfield", clientCompany: "Northwind Studio",
    issueDate: "2026-06-28", dueDate: "2026-07-12", status: "overdue", currency: "USD",
    items: [{ id: "l1", description: "Landing page revamp", quantity: 1, price: 3200, tax: 0, discount: 0 }],
    notes: "", terms: "Net 14.", amountPaid: 0,
  },
  {
    id: "i3", number: "INV-2026-0040", clientId: "c2", clientName: "Marcus Lee", clientCompany: "Halcyon Labs",
    issueDate: "2026-07-05", dueDate: "2026-07-19", status: "sent", currency: "USD",
    items: [
      { id: "l1", description: "Product design retainer — July", quantity: 40, price: 120, tax: 0, discount: 0 },
    ],
    notes: "July retainer. Reports attached separately.", terms: "Net 14.", amountPaid: 0,
  },
  {
    id: "i4", number: "INV-2026-0039", clientId: "c5", clientName: "Diego Alvarez", clientCompany: "Cobalt Films",
    issueDate: "2026-06-20", dueDate: "2026-07-05", status: "partial", currency: "USD",
    items: [
      { id: "l1", description: "Motion graphics package", quantity: 1, price: 5400, tax: 8, discount: 10 },
      { id: "l2", description: "Sound design", quantity: 1, price: 1200, tax: 8, discount: 0 },
    ],
    notes: "", terms: "50% due on receipt, remainder in 30 days.", amountPaid: 3000,
  },
  {
    id: "i5", number: "INV-2026-0038", clientId: "c4", clientName: "Julia Ostberg", clientCompany: "Kestrel & Co.",
    issueDate: "2026-07-08", dueDate: "2026-07-22", status: "draft", currency: "EUR",
    items: [{ id: "l1", description: "Website audit", quantity: 1, price: 1450, tax: 25, discount: 0 }],
    notes: "Draft — pending scope confirmation.", terms: "Net 14.", amountPaid: 0,
  },
  {
    id: "i6", number: "INV-2026-0037", clientId: "c3", clientName: "Priya Raman", clientCompany: "Meridian Consulting",
    issueDate: "2026-06-10", dueDate: "2026-06-24", status: "paid", currency: "USD",
    items: [{ id: "l1", description: "Executive coaching sessions", quantity: 6, price: 450, tax: 8, discount: 0 }],
    notes: "", terms: "Net 14.", amountPaid: 2916,
  },
];

export const BUSINESS_PROFILE = {
  name: "Fieldwork Studio",
  ownerName: "Alex Morgan",
  email: "billing@fieldwork.studio",
  address: "38 Union Square W, New York, NY 10003",
  taxId: "EIN 88-2231108",
  logoInitials: "FS",
};

export const FAQ = [
  { q: "Do I need an account to try Ledgerly?", a: "No. Click 'See live preview' in the hero to try the builder instantly — you only need an account to save invoices and clients." },
  { q: "Can I export invoices as PDF?", a: "Yes. Every invoice can be exported to a print-ready PDF that matches the selected template — minimal, classic or modern." },
  { q: "Which currencies are supported?", a: "Ledgerly supports USD, EUR, GBP, CAD, AUD, JPY and 40+ more. Set a default per client or per invoice." },
  { q: "Does Ledgerly calculate tax and discounts?", a: "Yes — line-level tax and discount, with a running total. Set defaults in Settings to prefill new invoices." },
  { q: "Is my data safe?", a: "Your data is encrypted at rest and in transit. Export or delete everything at any time from Settings." },
  { q: "Can I switch invoice templates later?", a: "Absolutely. Choose Minimal, Classic or Modern per invoice — the preview updates instantly." },
];

export const TESTIMONIALS = [
  { name: "Elena Ruiz", role: "Founder, Ruiz Studio", quote: "I moved off spreadsheets in an afternoon. My clients now pay 40% faster because the invoices actually look professional." },
  { name: "Thomas Grant", role: "Freelance developer", quote: "The builder is fast enough that I invoice right after each call. It's changed my cash flow." },
  { name: "Anaya Kapoor", role: "Ops lead, Halcyon Labs", quote: "Ledgerly is the only billing tool our whole team agrees on. Clean UI, no bloat, honest pricing." },
];
