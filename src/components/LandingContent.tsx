"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { LANG_LABELS, translations, type Lang } from "@/lib/landingTranslations";

interface ServiceView {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  durationMinutes: number;
}

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function detectInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem("lang");
  if (stored === "en" || stored === "pt" || stored === "es") return stored;
  const nav = window.navigator.language.slice(0, 2);
  if (nav === "pt") return "pt";
  if (nav === "es") return "es";
  return "en";
}

export default function LandingContent({
  services,
  phone,
}: {
  services: ServiceView[];
  phone: string;
}) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    setLang(detectInitialLang());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function selectLang(next: Lang) {
    setLang(next);
    window.localStorage.setItem("lang", next);
  }

  const t = translations[lang];
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
              {t.nav.services}
            </a>
            <a href="#about" className="hover:text-teal-600">
              {t.nav.about}
            </a>
            <a href="#area" className="hover:text-teal-600">
              {t.nav.area}
            </a>
            <a href="#contact" className="hover:text-teal-600">
              {t.nav.contact}
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex overflow-hidden rounded-full border border-zinc-200 text-xs font-semibold dark:border-zinc-800">
              {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => selectLang(l)}
                  className={
                    l === lang
                      ? "bg-teal-600 px-2.5 py-1.5 text-white"
                      : "px-2.5 py-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  }
                >
                  {LANG_LABELS[l]}
                </button>
              ))}
            </div>
            <a
              href={smsHref}
              className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
            >
              {t.textUs}
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-6 py-24">
        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:bg-teal-950 dark:text-teal-400">
          {t.badge}
        </span>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          {t.heroTitle}
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          {t.heroBody}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={smsHref}
            className="rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            {t.textUsAt} {phoneDisplay || t.ourNumber}
          </a>
          <a
            href={telHref}
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-white"
          >
            {t.call}
          </a>
        </div>
      </section>

      {/* Differentiators */}
      <section
        id="about"
        className="border-t border-zinc-100 bg-zinc-50 py-20 dark:border-zinc-900 dark:bg-zinc-900/40"
      >
        <div className="mx-auto grid max-w-5xl gap-8 px-6 sm:grid-cols-3">
          {t.differentiators.map((item) => (
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
        <h2 className="text-2xl font-bold tracking-tight">
          {t.servicesTitle}
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {t.servicesSubtitle}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.id}
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
                ~{service.durationMinutes} {t.perMin}
              </p>
            </div>
          ))}
          {services.length === 0 && (
            <p className="text-sm text-zinc-500">{t.noServices}</p>
          )}
        </div>
      </section>

      {/* Service area */}
      <section
        id="area"
        className="border-t border-zinc-100 bg-zinc-50 py-20 dark:border-zinc-900 dark:bg-zinc-900/40"
      >
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold tracking-tight">{t.areaTitle}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
              <h3 className="font-semibold">{t.spaceCoastTitle}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {t.spaceCoastBody}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
              <h3 className="font-semibold">{t.treasureCoastTitle}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {t.treasureCoastBody}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section
        id="contact"
        className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 px-6 py-24"
      >
        <h2 className="text-2xl font-bold tracking-tight">{t.ctaTitle}</h2>
        <p className="text-zinc-600 dark:text-zinc-400">{t.hours}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={smsHref}
            className="rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            {t.textUsAt} {phoneDisplay || t.ourNumber}
          </a>
        </div>
      </section>

      <footer className="border-t border-zinc-100 py-10 dark:border-zinc-900">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 px-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <Logo className="scale-90" />
          <p>
            &copy; {new Date().getFullYear()} J&amp;A Cleaning Group. {t.footerRights}
          </p>
        </div>
      </footer>
    </div>
  );
}
