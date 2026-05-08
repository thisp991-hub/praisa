import Link from "next/link";
import { Star, ShieldCheck, QrCode } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
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
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-gray-900">
          Get More Real Google Reviews —{" "}
          <span className="text-primary">Without Chasing Customers</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Praisa helps local businesses collect real customer feedback through QR
          codes, send happy customers to Google reviews, and capture unhappy
          feedback privately.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Start Free Trial
          </Link>
          <Link
            href="#how-it-works"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            See How It Works
          </Link>
        </div>
      </section>

      {/* Benefit Cards */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Why businesses choose Praisa
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: Star,
                title: "More Real Reviews",
                desc: "Automatically direct happy customers to leave Google reviews — boosting your online reputation with genuine 5-star ratings.",
              },
              {
                icon: ShieldCheck,
                title: "Private Negative Feedback",
                desc: "Unhappy customers share feedback privately with you instead of posting negative reviews online. Fix issues before they go public.",
              },
              {
                icon: QrCode,
                title: "QR Code Review Flow",
                desc: "Generate a simple QR code for your counter, receipt, or table. Customers scan, rate, and you capture every experience.",
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
                <p className="text-sm leading-relaxed text-gray-600">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">
            How it works
          </h2>
          <p className="mb-12 text-center text-gray-600">
            Three simple steps to start collecting feedback today.
          </p>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Create your feedback QR code",
                desc: "Sign up, enter your business name, and your personalized QR code is ready in seconds.",
              },
              {
                step: "2",
                title: "Customers scan and rate",
                desc: "Place the QR code at your counter, receipt, or waiting area. Customers scan and rate their experience.",
              },
              {
                step: "3",
                title: "Happy → Google, Unhappy → Private",
                desc: "Customers who rate 4-5 stars are sent to Google Reviews. Those who rate 1-3 stars leave private feedback just for you.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                  {s.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Placeholder */}
      <section
        id="pricing"
        className="border-t border-gray-100 bg-gray-50 px-6 py-20"
      >
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
                className="rounded-xl border border-gray-200 bg-white p-8"
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
