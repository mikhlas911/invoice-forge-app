import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Logo } from "@/lib/logo";
import { FAQ, TESTIMONIALS, formatMoney } from "@/lib/demo-data";
import { ArrowRight, Check, FileText, Users, Zap, Shield, Download, PieChart, Menu, X } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`sticky top-0 z-50 w-full transition-colors ${scrolled ? "border-b border-border bg-background/85 backdrop-blur" : "bg-transparent"}`}>
      <div className="container-page flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#templates" className="hover:text-foreground">Templates</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </nav>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/signup">Sign up free <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <button className="md:hidden p-2" aria-label="Open menu" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container-page flex flex-col gap-2 py-4 text-sm">
            <a href="#features" onClick={() => setOpen(false)} className="py-2">Features</a>
            <a href="#how" onClick={() => setOpen(false)} className="py-2">How it works</a>
            <a href="#templates" onClick={() => setOpen(false)} className="py-2">Templates</a>
            <a href="#pricing" onClick={() => setOpen(false)} className="py-2">Pricing</a>
            <a href="#faq" onClick={() => setOpen(false)} className="py-2">FAQ</a>
            <div className="mt-2 flex gap-2">
              <Button asChild variant="outline" className="flex-1"><Link to="/login">Log in</Link></Button>
              <Button asChild className="flex-1"><Link to="/signup">Sign up free</Link></Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function InvoicePreviewMock() {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-elevated">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Invoice</div>
          <div className="mt-1 text-lg font-semibold">INV-2026-0042</div>
        </div>
        <div className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">Paid</div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">From</div>
          <div className="mt-1 font-medium">Fieldwork Studio</div>
          <div className="text-xs text-muted-foreground">38 Union Square W, NYC</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Bill to</div>
          <div className="mt-1 font-medium">Meridian Consulting</div>
          <div className="text-xs text-muted-foreground">Priya Raman</div>
        </div>
      </div>
      <div className="mt-5 rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left font-medium">Description</th>
              <th className="px-3 py-2 text-right font-medium">Qty</th>
              <th className="px-3 py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-3 py-2">Brand strategy workshop</td>
              <td className="px-3 py-2 text-right">2</td>
              <td className="px-3 py-2 text-right">{formatMoney(3600)}</td>
            </tr>
            <tr>
              <td className="px-3 py-2">Visual identity system</td>
              <td className="px-3 py-2 text-right">1</td>
              <td className="px-3 py-2 text-right">{formatMoney(4275)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <div className="w-52 space-y-1 text-sm">
          <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatMoney(7875)}</span></div>
          <div className="flex justify-between text-muted-foreground"><span>Tax (8%)</span><span>{formatMoney(630)}</span></div>
          <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold"><span>Total</span><span>{formatMoney(8505)}</span></div>
        </div>
      </div>
    </div>
  );
}

function BuilderMock() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-medium">Editor</div>
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          <span className="h-2 w-2 rounded-full bg-primary" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="rounded-md border border-border p-3">
          <div className="text-xs text-muted-foreground">Client</div>
          <div className="mt-1 text-sm font-medium">Meridian Consulting</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border border-border p-3">
            <div className="text-xs text-muted-foreground">Issue date</div>
            <div className="mt-1 text-sm font-medium">Jul 1, 2026</div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="text-xs text-muted-foreground">Due</div>
            <div className="mt-1 text-sm font-medium">Jul 15, 2026</div>
          </div>
        </div>
        <div className="rounded-md border border-border p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">Line items</div>
            <div className="text-xs text-primary">+ Add</div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Brand strategy workshop</span><span className="text-muted-foreground">2 × $1,800</span></div>
            <div className="flex justify-between"><span>Visual identity system</span><span className="text-muted-foreground">1 × $4,500</span></div>
          </div>
        </div>
        <div className="rounded-md bg-primary/8 p-3 text-sm">
          <div className="flex justify-between font-medium"><span>Total due</span><span>{formatMoney(8505)}</span></div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-gradient-to-b from-accent/40 to-transparent" />
      <div className="container-page grid gap-12 pt-16 pb-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-24 lg:pb-28">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            New — recurring invoices &amp; auto-reminders
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
            Create professional invoices in minutes.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Ledgerly is the fast, uncluttered invoice generator for freelancers, agencies and small businesses. Build, send, track and export beautiful invoices — no spreadsheets.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to="/signup">Sign up free <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/app/invoices/new">See live preview</Link>
            </Button>
          </div>
          <div className="mt-6 flex items-center gap-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Unlimited invoices</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> PDF export</span>
          </div>
        </div>
        <div className="relative">
          <div className="grid gap-4 sm:grid-cols-[1fr_1.15fr] sm:items-start">
            <div className="sm:pt-10"><BuilderMock /></div>
            <div className="sm:-mt-4"><InvoicePreviewMock /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const names = ["Northwind", "Halcyon", "Meridian", "Kestrel", "Cobalt", "Fieldwork"];
  return (
    <section className="border-y border-border bg-surface-muted/60 py-10">
      <div className="container-page">
        <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Trusted by 12,000+ freelancers, agencies and small teams
        </p>
        <div className="mt-6 grid grid-cols-3 items-center gap-x-6 gap-y-4 opacity-70 sm:grid-cols-6">
          {names.map((n) => (
            <div key={n} className="text-center text-lg font-semibold tracking-tight text-muted-foreground">{n}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Zap, title: "Create invoices in under 2 minutes", body: "A keyboard-friendly builder with sensible defaults, so a new invoice takes seconds, not screens." },
    { icon: PieChart, title: "Auto-calculate tax, discounts & totals", body: "Line-level tax and discount, live totals, and multi-currency support baked in." },
    { icon: FileText, title: "Track paid, pending & overdue", body: "One dashboard for statuses, aging balances, and what needs a nudge this week." },
    { icon: Users, title: "Reusable client profiles", body: "Save clients once, prefill everything. Search, filter, and see billing history per client." },
    { icon: Download, title: "Polished PDF export", body: "Print or download PDF-ready invoices your clients will actually take seriously." },
    { icon: Shield, title: "Secure by default", body: "Encrypted in transit and at rest. Export or delete your data any time." },
  ];
  return (
    <section id="features" className="py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Features</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Everything you need to bill and get paid.</h2>
          <p className="mt-3 text-muted-foreground">No feature bloat. Just the tools you actually use every week — done well.</p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-surface p-6">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Add a client", body: "Import from your contacts or create a client profile in seconds — reuse it forever." },
    { n: "02", title: "Build the invoice", body: "Add line items, tax and discounts. Watch the live preview update as you type." },
    { n: "03", title: "Send, track, get paid", body: "Email a PDF, share a link, mark paid. Dashboard shows what's outstanding." },
  ];
  return (
    <section id="how" className="border-y border-border bg-surface-muted/50 py-24">
      <div className="container-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-primary">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">From draft to paid in three steps.</h2>
          </div>
          <Button asChild variant="outline"><Link to="/signup">Start free</Link></Button>
        </div>
        <ol className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="rounded-xl border border-border bg-surface p-6">
              <div className="text-sm font-medium text-primary">{s.n}</div>
              <div className="mt-3 text-lg font-semibold">{s.title}</div>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Templates() {
  const t = [
    { name: "Minimal", desc: "Clean, single-column, generous whitespace.", accent: "bg-foreground" },
    { name: "Classic", desc: "Structured header, table-forward layout.", accent: "bg-primary" },
    { name: "Modern", desc: "Bold typography, subtle color accents.", accent: "bg-info" },
  ];
  return (
    <section id="templates" className="py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Templates</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Pick a template your clients will respect.</h2>
          <p className="mt-3 text-muted-foreground">Three considered layouts. Switch any time — the data stays intact.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t.map((x) => (
            <div key={x.name} className="group overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-shadow hover:shadow-elevated">
              <div className="aspect-[3/4] bg-surface-muted p-5">
                <div className={`h-1.5 w-16 rounded-full ${x.accent}`} />
                <div className="mt-4 space-y-1.5">
                  <div className="h-3 w-24 rounded bg-foreground/80" />
                  <div className="h-2 w-16 rounded bg-muted-foreground/40" />
                </div>
                <div className="mt-6 space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-2 w-1/2 rounded bg-muted-foreground/30" />
                      <div className="h-2 w-14 rounded bg-muted-foreground/30" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 h-px w-full bg-border" />
                <div className="mt-3 flex justify-end">
                  <div className="h-3 w-20 rounded bg-foreground/70" />
                </div>
              </div>
              <div className="border-t border-border p-4">
                <div className="font-medium">{x.name}</div>
                <div className="text-sm text-muted-foreground">{x.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="border-y border-border bg-surface-muted/50 py-24">
      <div className="container-page">
        <p className="text-sm font-medium text-primary">Loved by billing teams</p>
        <h2 className="mt-2 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">Real teams. Faster invoices.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="rounded-xl border border-border bg-surface p-6">
              <blockquote className="text-sm leading-relaxed">"{t.quote}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="text-xs">
                  <div className="font-medium text-foreground">{t.name}</div>
                  <div className="text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Free", price: "$0", desc: "For getting started", features: ["Up to 5 invoices/mo", "1 client", "PDF export"] },
    { name: "Pro", price: "$12", desc: "For freelancers", features: ["Unlimited invoices", "Unlimited clients", "Recurring & reminders", "All templates"], featured: true },
    { name: "Team", price: "$29", desc: "For small teams", features: ["Everything in Pro", "5 team members", "Roles & audit log", "Priority support"] },
  ];
  return (
    <section id="pricing" className="py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Pricing</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Honest pricing. No per-invoice fees.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div key={t.name} className={`rounded-xl border p-6 ${t.featured ? "border-primary bg-primary/5 shadow-elevated" : "border-border bg-surface"}`}>
              <div className="flex items-baseline justify-between">
                <div className="font-semibold">{t.name}</div>
                {t.featured && <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">Popular</span>}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-semibold tracking-tight">{t.price}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{t.desc}</div>
              <ul className="mt-5 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-primary" /><span>{f}</span></li>
                ))}
              </ul>
              <Button asChild className="mt-6 w-full" variant={t.featured ? "default" : "outline"}>
                <Link to="/signup">Get started</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section id="faq" className="border-t border-border py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="text-sm font-medium text-primary">FAQ</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Answers, upfront.</h2>
          <p className="mt-3 text-muted-foreground">Still curious? <a href="mailto:hello@ledgerly.app" className="text-foreground underline underline-offset-4">Email us</a>.</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {FAQ.map((f, i) => (
            <AccordionItem key={i} value={`q${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-20">
      <div className="container-page">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-surface to-surface p-10 text-center sm:p-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Stop chasing invoices. Start getting paid.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Set up your business in under 5 minutes. Send your first invoice today.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg"><Link to="/signup">Sign up free <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/app/invoices/new">Try the builder</Link></Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-surface-muted/40">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">Professional invoicing for independent professionals and small teams.</p>
        </div>
        <div>
          <div className="text-sm font-medium">Product</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#features" className="hover:text-foreground">Features</a></li>
            <li><a href="#templates" className="hover:text-foreground">Templates</a></li>
            <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
            <li><Link to="/app/invoices/new" className="hover:text-foreground">Live preview</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium">Support</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="mailto:support@ledgerly.app" className="hover:text-foreground">Contact support</a></li>
            <li><a href="mailto:sales@ledgerly.app" className="hover:text-foreground">Contact sales</a></li>
            <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium">Legal</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">Privacy</a></li>
            <li><a href="#" className="hover:text-foreground">Terms</a></li>
            <li><a href="#" className="hover:text-foreground">DPA</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <span>© 2026 Ledgerly, Inc.</span>
          <span>Made for people who'd rather build than bill.</span>
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Features />
        <HowItWorks />
        <Templates />
        <Testimonials />
        <Pricing />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
