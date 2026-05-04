import Link from "next/link";
import { Star, MessageSquare, QrCode, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-primary">
            Praisa
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-gray-900">
          Turn customer feedback into&nbsp;
          <span className="text-primary">5-star growth</span>
        </h1>
        <p className="mt-6 max-w-lg text-lg text-gray-600">
          Collect reviews via QR codes, respond with AI, and manage your
          reputation — all from one dashboard.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Start Free Trial
          </Link>
          <Link
            href="#pricing"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Everything you need
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: QrCode,
                title: "QR Codes",
                desc: "Generate scannable codes for instant feedback collection.",
              },
              {
                icon: MessageSquare,
                title: "Feedback",
                desc: "Centralize and manage all customer reviews in one place.",
              },
              {
                icon: Sparkles,
                title: "AI Replies",
                desc: "Craft professional responses powered by AI in seconds.",
              },
              {
                icon: Star,
                title: "Reputation",
                desc: "Track ratings and grow your online reputation effortlessly.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <f.icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Placeholder */}
      <section id="pricing" className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-gray-600">
            Plans that scale with your business. Coming soon.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {["Starter", "Pro", "Enterprise"].map((plan) => (
              <div
                key={plan}
                className="rounded-xl border border-gray-200 p-8"
              >
                <h3 className="text-lg font-semibold text-gray-900">{plan}</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">—</p>
                <p className="mt-1 text-sm text-gray-500">Coming soon</p>
                <button
                  disabled
                  className="mt-6 w-full rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-400"
                >
                  Notify Me
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Praisa. All rights reserved.
      </footer>
    </div>
  );
}
