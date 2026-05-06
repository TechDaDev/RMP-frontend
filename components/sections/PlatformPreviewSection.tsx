import { SectionHeader } from "@/components/SectionHeader";
import type { Translations } from "@/types/i18n";

interface PlatformPreviewSectionProps {
  t: Translations;
}

export function PlatformPreviewSection({ t }: PlatformPreviewSectionProps) {
  return (
    <section className="section-space">
      <div className="container-grid">
        <SectionHeader title={t.preview.title} subtitle={t.preview.subtitle} />
        <div className="grid gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--card-shadow-lg)] lg:grid-cols-5">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 lg:col-span-2">
            <p className="text-xs font-medium text-[var(--color-muted)]">{t.preview.items[0].title}</p>
            <p className="mt-2 text-sm text-[var(--color-text)]">{t.preview.items[0].status}</p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
            <p className="text-xs font-medium text-[var(--color-muted)]">{t.preview.items[1].title}</p>
            <p className="mt-2 text-sm text-[var(--color-text)]">{t.preview.items[1].status}</p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
            <p className="text-xs font-medium text-[var(--color-muted)]">{t.preview.items[2].title}</p>
            <p className="mt-2 text-sm text-[var(--color-text)]">{t.preview.items[2].status}</p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
            <p className="text-xs font-medium text-[var(--color-muted)]">{t.preview.items[3].title}</p>
            <p className="mt-2 text-sm text-[var(--color-text)]">{t.preview.items[3].status}</p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 lg:col-span-2">
            <p className="text-xs font-medium text-[var(--color-muted)]">{t.preview.items[4].title}</p>
            <p className="mt-2 text-sm text-[var(--color-text)]">{t.preview.items[4].status}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
