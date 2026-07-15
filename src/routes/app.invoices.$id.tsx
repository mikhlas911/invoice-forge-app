import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { INVOICES, BUSINESS_PROFILE, formatMoney, computeTotals } from "@/lib/demo-data";
import { ArrowLeft, Printer, Download, Copy, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/invoices/$id")({
  head: ({ params }) => ({ meta: [{ title: `Invoice ${params.id} — Ledgerly` }] }),
  loader: ({ params }) => {
    const inv = INVOICES.find((i) => i.id === params.id);
    if (!inv) throw notFound();
    return { inv };
  },
  notFoundComponent: () => (
    <div className="container-page py-16 text-center">
      <p className="text-sm text-muted-foreground">Invoice not found.</p>
      <Button asChild className="mt-4"><Link to="/app/invoices">Back to invoices</Link></Button>
    </div>
  ),
  errorComponent: () => <div className="container-page py-16 text-center text-sm text-muted-foreground">Something went wrong loading this invoice.</div>,
  component: InvoiceView,
});

function InvoiceView() {
  const { inv } = Route.useLoaderData();
  const totals = computeTotals(inv.items);
  const due = totals.total - inv.amountPaid;

  return (
    <div className="container-page py-6 sm:py-8">
      <div className="no-print mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm"><Link to="/app/invoices"><ArrowLeft className="mr-1 h-4 w-4" /> Invoices</Link></Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold tracking-tight">{inv.number}</h1>
              <StatusBadge status={inv.status} />
            </div>
            <p className="text-sm text-muted-foreground">Billed to {inv.clientCompany}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success("Invoice duplicated")}><Copy className="mr-1.5 h-4 w-4" /> Duplicate</Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Sent to client")}><Send className="mr-1.5 h-4 w-4" /> Send</Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="mr-1.5 h-4 w-4" /> Print</Button>
          <Button size="sm" onClick={() => { window.print(); toast("Use 'Save as PDF' in the print dialog"); }}><Download className="mr-1.5 h-4 w-4" /> Download PDF</Button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl rounded-xl border border-border bg-surface p-8 shadow-card sm:p-12">
        <header className="flex items-start justify-between gap-6">
          <div>
            <div className="grid h-10 w-10 place-items-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">{BUSINESS_PROFILE.logoInitials}</div>
            <div className="mt-3 font-semibold">{BUSINESS_PROFILE.name}</div>
            <div className="text-xs text-muted-foreground">{BUSINESS_PROFILE.address}</div>
            <div className="text-xs text-muted-foreground">{BUSINESS_PROFILE.email}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Invoice</div>
            <div className="text-xl font-semibold">{inv.number}</div>
            <div className="mt-2 text-xs text-muted-foreground">Issued {new Date(inv.issueDate).toLocaleDateString()}</div>
            <div className="text-xs text-muted-foreground">Due {new Date(inv.dueDate).toLocaleDateString()}</div>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Bill to</div>
            <div className="mt-1 font-medium">{inv.clientCompany}</div>
            <div className="text-muted-foreground">{inv.clientName}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Amount due</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">{formatMoney(due, inv.currency)}</div>
          </div>
        </div>

        <table className="mt-8 w-full text-sm">
          <thead>
            <tr className="border-y border-border text-xs uppercase tracking-wider text-muted-foreground">
              <th className="py-2 text-left font-medium">Description</th>
              <th className="py-2 text-right font-medium">Qty</th>
              <th className="py-2 text-right font-medium">Price</th>
              <th className="py-2 text-right font-medium">Tax</th>
              <th className="py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {inv.items.map((it) => {
              const line = it.quantity * it.price;
              const disc = line * (it.discount / 100);
              const amt = (line - disc) * (1 + it.tax / 100);
              return (
                <tr key={it.id} className="border-b border-border">
                  <td className="py-3">{it.description}{it.discount ? <span className="ml-2 text-xs text-muted-foreground">−{it.discount}%</span> : null}</td>
                  <td className="py-3 text-right tabular-nums">{it.quantity}</td>
                  <td className="py-3 text-right tabular-nums">{formatMoney(it.price, inv.currency)}</td>
                  <td className="py-3 text-right tabular-nums">{it.tax}%</td>
                  <td className="py-3 text-right tabular-nums">{formatMoney(amt, inv.currency)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <div className="w-64 space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="tabular-nums">{formatMoney(totals.subtotal, inv.currency)}</span></div>
            {totals.discountTotal > 0 && <div className="flex justify-between text-muted-foreground"><span>Discount</span><span className="tabular-nums">−{formatMoney(totals.discountTotal, inv.currency)}</span></div>}
            {totals.taxTotal > 0 && <div className="flex justify-between text-muted-foreground"><span>Tax</span><span className="tabular-nums">{formatMoney(totals.taxTotal, inv.currency)}</span></div>}
            <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold"><span>Total</span><span className="tabular-nums">{formatMoney(totals.total, inv.currency)}</span></div>
            {inv.amountPaid > 0 && (
              <>
                <div className="flex justify-between text-muted-foreground"><span>Amount paid</span><span className="tabular-nums">−{formatMoney(inv.amountPaid, inv.currency)}</span></div>
                <div className="flex justify-between text-primary font-semibold"><span>Balance due</span><span className="tabular-nums">{formatMoney(due, inv.currency)}</span></div>
              </>
            )}
          </div>
        </div>

        {(inv.notes || inv.terms) && (
          <div className="mt-10 grid gap-4 border-t border-border pt-6 text-xs sm:grid-cols-2">
            {inv.notes && <div><div className="mb-1 font-medium uppercase tracking-wider text-muted-foreground">Notes</div><p>{inv.notes}</p></div>}
            {inv.terms && <div><div className="mb-1 font-medium uppercase tracking-wider text-muted-foreground">Terms</div><p>{inv.terms}</p></div>}
          </div>
        )}
      </div>
    </div>
  );
}
