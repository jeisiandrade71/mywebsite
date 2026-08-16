import Logo from "@/components/Logo";
import { listActiveServices } from "@/lib/services";

export const revalidate = 60;

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export default async function Home() {
  const services = await listActiveServices();

  const phone = process.env.TWILIO_SMS_NUMBER || "";
  const phoneDisplay = phone.replace(
    /^\+1(\d{3})(\d{3})(\d{4})$/,
    "($1) $2-$3"
  );
  const smsHref = phone ? `sms:${phone}` : "#contact";
  const telHref = phone ? `tel:${phone}` : "#contact";

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-100 bg-white/90 backdrop-blur dark:border-zinc-900 dark:bg-zinc-950/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:flex">
            <a href="#services" className="hover:text-teal-600">
              Services
            </a>
            <a href="#about" className="hover:text-teal-600">
              About
            </a>
            <a href="#area" className="hover:text-teal-600">
              Service Area
            </a>
            <a href="#contact" className="hover:text-teal-600">
              Contact
            </a>
          </nav>
          <a
            href={smsHref}
            className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Text Us
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-6 py-24">
        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:bg-teal-950 dark:text-teal-400">
          Space Coast &amp; Treasure Coast
        </span>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Professional cleaning, tailored to you.
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          J&amp;A Cleaning Group brings a trained, fully insured team to every
          home — with a personalized approach built around what you actually
          need, not a one-size-fits-all checklist.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={smsHref}
            className="rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Text us at {phoneDisplay || "our number"}
          </a>
          <a
            href={telHref}
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-white"
          >
            Call
          </a>
        </div>
      </section>

      {/* Differentiators */}
      <section id="about" className="border-t border-zinc-100 bg-zinc-50 py-20 dark:border-zinc-900 dark:bg-zinc-900/40">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 sm:grid-cols-3">
          {[
            {
              title: "Personalized service",
              body: "Every home is different. We tailor the cleaning plan to your specific needs, not a generic checklist.",
            },
            {
              title: "Trained team",
              body: "Our cleaners are trained and consistent, so you get the same reliable quality every visit.",
            },
            {
              title: "Fully insured",
              body: "Work with confidence — J&A Cleaning Group is insured, protecting your home and peace of mind.",
            },
          ].map((item) => (
            <div key={item.title} className="flex flex-col gap-2">
              <div className="text-teal-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12.5L9.5 17L19 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-base font-semibold">{item.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-2xl font-bold tracking-tight">Services</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Text us and we&apos;ll help you pick the right fit.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <div
              key={service._id.toString()}
              className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-semibold">{service.name}</h3>
                <span className="whitespace-nowrap font-semibold text-teal-600">
                  {formatPrice(service.priceCents)}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {service.description}
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                ~{service.durationMinutes} min
              </p>
            </div>
          ))}
          {services.length === 0 && (
            <p className="text-sm text-zinc-500">
              Services coming soon — text us for a custom quote.
            </p>
          )}
        </div>
      </section>

      {/* Service area */}
      <section id="area" className="border-t border-zinc-100 bg-zinc-50 py-20 dark:border-zinc-900 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Where we work
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
              <h3 className="font-semibold">Space Coast</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Brevard County
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
              <h3 className="font-semibold">Treasure Coast</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Indian River County — Vero Beach
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 px-6 py-24">
        <h2 className="text-2xl font-bold tracking-tight">
          Ready for a cleaner home?
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Monday–Friday, 8am–6pm
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={smsHref}
            className="rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Text us at {phoneDisplay || "our number"}
          </a>
        </div>
      </section>

      <footer className="border-t border-zinc-100 py-10 dark:border-zinc-900">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 px-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <Logo className="scale-90" />
          <p>&copy; {new Date().getFullYear()} J&amp;A Cleaning Group. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
