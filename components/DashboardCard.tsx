import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
  title: string;
  value?: ReactNode;
  subtitle?: ReactNode;
  href?: string;
  cta?: string;
  tone?: "default" | "dark";
  children?: ReactNode;
}

export function DashboardCard({ title, value, subtitle, href, cta, tone = "default", children }: Props) {
  const isDark = tone === "dark";
  const className = [
    "block p-6 transition border",
    isDark ? "bg-ink-900 text-white border-ink-900" : "bg-canvas text-ink-900 border-hairline",
    href ? "hover:border-ink-900" : "",
  ].join(" ");

  const labelCls = isDark ? "text-on-dark-soft" : "text-muted";
  const subtitleCls = isDark ? "text-on-dark-soft" : "text-muted";

  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className={`label-uppercase ${labelCls}`}>{title}</div>
        {cta ? (
          <span className={`text-[11px] font-bold uppercase tracking-[1.5px] ${isDark ? "text-white" : "text-bmw-blue"}`}>
            {cta} ›
          </span>
        ) : null}
      </div>
      {value !== undefined ? (
        <div className="mt-3 text-3xl font-bold leading-tight">{value}</div>
      ) : null}
      {subtitle ? <div className={`mt-1 text-sm font-light ${subtitleCls}`}>{subtitle}</div> : null}
      {children}
    </>
  );

  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
