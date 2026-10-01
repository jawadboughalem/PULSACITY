"use client";

import { useState } from "react";
import { DISCREET_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { quoteInFrench } from "@/lib/french/typography";
import { type PreviewItem, groupPreviewRows } from "@/lib/testimonials/csv/group-preview-rows";
import type { CsvRow } from "@/lib/testimonials/csv/read-testimonial-csv";
import { formatExcerpt } from "@/lib/testimonials/format-excerpt";
import { RatingStars } from "../RatingStars";

type Filter = "all" | "ready" | "toFix";

const SHOWN_FIRST_ON_DESKTOP = 4;
const SHOWN_FIRST_ON_MOBILE = 3;

const formatDay = (date: Date) =>
  new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(date);

const dateOf = (row: CsvRow) => (row.date ? formatDay(row.date) : row.cells.date || "Aujourd'hui");

const describeRun = (item: Extract<PreviewItem, { kind: "ready-run" }>) =>
  item.count === 1 ? `Ligne ${item.fromLine} : prête` : `Lignes ${item.fromLine} à ${item.toLine} : prêtes`;

const RowBadge = ({ isReady }: { isReady: boolean }) =>
  isReady ? (
    <span className="inline-flex h-[28px] shrink-0 items-center gap-2 rounded-full bg-success-surface pr-3 pl-2 text-small font-medium whitespace-nowrap text-success">
      <Icon name="valid" size={16} />
      Prête
    </span>
  ) : (
    <span className="inline-flex h-[28px] shrink-0 items-center gap-2 text-small font-medium whitespace-nowrap text-error">
      <Icon name="alert" size={16} />À revoir
    </span>
  );

const FilterChip = ({ label, isSelected, onSelect }: { label: string; isSelected: boolean; onSelect: () => void }) => (
  <button
    type="button"
    aria-pressed={isSelected}
    onClick={onSelect}
    className={cn(
      "h-[40px] rounded-full border px-4 text-small whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900",
      isSelected ? "border-ink-900 bg-paper-100 font-semibold" : "border-hairline-200 bg-white hover:border-gray-400",
    )}
  >
    {label}
  </button>
);

type CsvPreviewListProps = {
  rows: CsvRow[];
};

/** Every line of the file before the import: a table on desktop, cards on a phone. */
export const CsvPreviewList = ({ rows }: CsvPreviewListProps) => {
  const [filter, setFilter] = useState<Filter>("all");
  const [isExpanded, setIsExpanded] = useState(false);
  const ready = rows.filter((row) => row.status === "ready");
  const toFix = rows.filter((row) => row.status !== "ready");
  const filtered = filter === "ready" ? ready : filter === "toFix" ? toFix : rows;
  const items: PreviewItem[] = isExpanded
    ? filtered.map((row) => ({ kind: "row", row }))
    : groupPreviewRows(filtered, SHOWN_FIRST_ON_DESKTOP);
  const isFolded = items.some((item) => item.kind === "ready-run");
  const mobileRows = isExpanded ? ready : ready.slice(0, SHOWN_FIRST_ON_MOBILE);
  const hiddenOnMobile = ready.length - mobileRows.length;

  return (
    <section aria-labelledby="csv-preview" className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 border-b border-ink-900 pb-3 desktop:flex-row desktop:items-center desktop:justify-between desktop:border-b-0 desktop:pb-0">
        <h2 id="csv-preview" className="font-serif text-quote font-medium">
          <span className="desktop:hidden">Aperçu</span>
          <span className="max-desktop:hidden">Aperçu ligne par ligne</span>
        </h2>
        <div className="hidden gap-2 desktop:flex" role="group" aria-label="Lignes affichées">
          <FilterChip label={`Toutes (${rows.length})`} isSelected={filter === "all"} onSelect={() => setFilter("all")} />
          <FilterChip label={`Prêtes (${ready.length})`} isSelected={filter === "ready"} onSelect={() => setFilter("ready")} />
          <FilterChip label={`À revoir (${toFix.length})`} isSelected={filter === "toFix"} onSelect={() => setFilter("toFix")} />
        </div>
      </div>

      <table className="hidden w-full table-fixed border-collapse text-left text-small desktop:table">
        <thead>
          <tr className="border-b border-ink-900">
            <th scope="col" className="w-[56px] pr-3 pb-3 font-semibold">Ligne</th>
            <th scope="col" className="w-[112px] pr-3 pb-3 font-semibold">Nom</th>
            <th scope="col" className="w-[112px] pr-3 pb-3 font-semibold">Titre</th>
            <th scope="col" className="w-[104px] pr-3 pb-3 font-semibold">Note</th>
            <th scope="col" className="pr-3 pb-3 font-semibold">Texte</th>
            <th scope="col" className="w-[112px] pr-3 pb-3 font-semibold">Formation</th>
            <th scope="col" className="w-[104px] pr-3 pb-3 font-semibold">Date</th>
            <th scope="col" className="w-[112px] pb-3 font-semibold">État</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) =>
            item.kind === "ready-run" ? (
              <tr key={`run-${item.fromLine}`} className="border-b border-hairline-200">
                <td colSpan={8} className="py-3 text-slate-600">
                  {describeRun(item)}
                </td>
              </tr>
            ) : (
              <tr
                key={item.row.line}
                className={cn("border-b border-hairline-200 align-top", item.row.status !== "ready" && "bg-error-surface")}
              >
                <td className={cn("py-4 pr-3 pl-2", item.row.status === "ready" ? "text-slate-600" : "text-error")}>
                  {item.row.line}
                </td>
                <td className="py-4 pr-3 font-semibold break-words">{item.row.authorName || "—"}</td>
                <td className="py-4 pr-3 break-words">{item.row.authorTitle ?? ""}</td>
                <td className="py-4 pr-3">
                  {item.row.rating === null ? (
                    <span className="text-error">{item.row.cells.note || "—"}</span>
                  ) : (
                    <RatingStars rating={item.row.rating} size={16} />
                  )}
                </td>
                <td className="py-4 pr-3">{formatExcerpt(item.row.body, 90)}</td>
                <td className="py-4 pr-3 break-words">{item.row.productName ?? "Sans offre"}</td>
                <td className="py-4 pr-3">{dateOf(item.row)}</td>
                <td className="py-4">
                  <RowBadge isReady={item.row.status === "ready"} />
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
      {isFolded ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className={cn(DISCREET_BUTTON_CLASSES, "hidden self-start desktop:inline-flex")}
        >
          Voir toutes les lignes
        </button>
      ) : null}

      <ul className="flex flex-col desktop:hidden">
        {mobileRows.map((row) => (
          <li key={row.line} className="flex flex-col gap-2 border-b border-hairline-200 py-4">
            <span className="flex items-center justify-between gap-3">
              <span className="text-small text-slate-600">{`Ligne ${row.line}`}</span>
              <RowBadge isReady />
            </span>
            <span className="text-body">
              <span className="font-semibold">{row.authorName}</span>
              {row.authorTitle ? <span className="text-slate-600">{` · ${row.authorTitle}`}</span> : null}
            </span>
            <span className="flex items-start gap-3">
              {row.rating === null ? null : <RatingStars rating={row.rating} size={16} />}
              <span className="text-small text-slate-600">{`${row.productName ?? "Sans offre"} · ${dateOf(row)}`}</span>
            </span>
            <span className="font-serif text-body">{quoteInFrench(formatExcerpt(row.body, 90))}</span>
          </li>
        ))}
      </ul>
      {hiddenOnMobile > 0 ? (
        <div className="flex flex-col gap-1 desktop:hidden">
          <p className="text-small text-slate-600">
            {hiddenOnMobile === 1 ? "Et 1 autre ligne prête." : `Et ${hiddenOnMobile} autres lignes prêtes.`}
          </p>
          <button type="button" onClick={() => setIsExpanded(true)} className={cn(DISCREET_BUTTON_CLASSES, "self-start")}>
            Voir toutes les lignes
          </button>
        </div>
      ) : null}
    </section>
  );
};
