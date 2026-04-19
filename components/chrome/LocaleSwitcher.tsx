"use client";

import { useLocale } from "next-intl";
import { usePathname, Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.22em]">
      {routing.locales.map((code, i) => {
        const active = code === locale;
        return (
          <span key={code} className="flex items-center gap-2">
            <Link
              href={pathname}
              locale={code}
              className={`transition-colors duration-[220ms] ease-out ${
                active
                  ? "text-paper"
                  : "text-paper-ghost hover:text-paper-dim"
              }`}
              aria-current={active ? "true" : undefined}
            >
              {code.toUpperCase()}
            </Link>
            {i < routing.locales.length - 1 && (
              <span className="text-paper-ghost" aria-hidden>
                ·
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
