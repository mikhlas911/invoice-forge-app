import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/lib/logo";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function AuthShell({ children, title, subtitle, aside }: { children: ReactNode; title: string; subtitle: string; aside?: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col p-6 sm:p-10">
        <Logo />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
        <div className="text-xs text-muted-foreground">© 2026 Ledgerly</div>
      </div>
      <div className="hidden bg-surface-muted/60 lg:block">
        <div className="flex h-full items-center justify-center p-10">
          {aside ?? <DefaultAside />}
        </div>
      </div>
    </div>
  );
}

function DefaultAside() {
  return (
    <div className="max-w-md">
      <div className="rounded-xl border border-border bg-surface p-6 shadow-elevated">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>INV-2026-0042</span>
          <span className="rounded-full bg-success/15 px-2 py-0.5 font-medium text-success">Paid</span>
        </div>
        <div className="mt-4 text-lg font-semibold">Meridian Consulting</div>
        <div className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between"><span>Brand strategy workshop</span><span>$3,600.00</span></div>
          <div className="flex justify-between"><span>Visual identity system</span><span>$4,275.00</span></div>
          <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold"><span>Total</span><span>$8,505.00</span></div>
        </div>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        "I moved off spreadsheets in an afternoon. My clients now pay 40% faster." — Elena Ruiz
      </p>
    </div>
  );
}

export function PasswordInput({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input id={id} type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} required minLength={6} className="pr-10" />
      <button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground">
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function GoogleButton() {
  return (
    <Button type="button" variant="outline" className="w-full" onClick={() => toast("Google sign-in is a demo in this preview")}>
      <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
      Continue with Google
    </Button>
  );
}

export function LoginForm() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => { toast.success("Welcome back!"); nav({ to: "/app" }); }, 400);
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <GoogleButton />
      <div className="relative py-1 text-center text-xs text-muted-foreground">
        <span className="relative z-10 bg-background px-2">or continue with email</span>
        <div className="absolute inset-x-0 top-1/2 -z-0 h-px bg-border" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Work email</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
        </div>
        <PasswordInput id="password" value={password} onChange={setPassword} />
      </div>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} /> Remember me for 30 days
      </label>
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Log in"}</Button>
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account? <Link to="/signup" className="font-medium text-foreground hover:underline">Sign up free</Link>
      </p>
    </form>
  );
}

export function SignupForm() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => { toast.success("Account ready — welcome!"); nav({ to: "/app" }); }, 500);
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <GoogleButton />
      <div className="relative py-1 text-center text-xs text-muted-foreground">
        <span className="relative z-10 bg-background px-2">or sign up with email</span>
        <div className="absolute inset-x-0 top-1/2 -z-0 h-px bg-border" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Morgan" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Work email</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <PasswordInput id="password" value={password} onChange={setPassword} />
        <p className="text-xs text-muted-foreground">At least 6 characters. Use a strong, unique password.</p>
      </div>
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Creating account…" : "Create account"}</Button>
      <p className="text-center text-xs text-muted-foreground">
        By signing up you agree to our Terms and Privacy Policy.
      </p>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="font-medium text-foreground hover:underline">Log in</Link>
      </p>
    </form>
  );
}

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  function submit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
    toast.success("Check your inbox for a reset link");
  }
  if (sent) {
    return (
      <div className="rounded-lg border border-border bg-accent/40 p-4 text-sm">
        We sent a password reset link to <span className="font-medium">{email}</span>. It expires in 30 minutes.
        <div className="mt-4">
          <Button asChild variant="outline" size="sm"><Link to="/login">Back to log in</Link></Button>
        </div>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
      </div>
      <Button type="submit" className="w-full">Send reset link</Button>
      <p className="text-center text-sm text-muted-foreground">
        Remembered it? <Link to="/login" className="font-medium text-foreground hover:underline">Log in</Link>
      </p>
    </form>
  );
}
