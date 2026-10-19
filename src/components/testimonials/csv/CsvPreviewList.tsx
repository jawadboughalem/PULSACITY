"use client";

import { useState } from "react";
import { DISCREET_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FILTER_CHIP_CHOSEN_CLASSES, FILTER_CHIP_CLASSES } from "@/components/ui/chip-styles";
import { Icon } from "@/components/ui/Icon";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { quoteInFrench } from "@/lib/french/typography";
import { type PreviewItem, groupPreviewRows } from "@/lib/testimonials/csv/group-preview-rows";
import type { CsvRow } from "@/lib/testimonials/csv/read-testimonial-csv";
import { formatExcerpt } from "@/lib/testimonials/format-excerpt";
import { RatingStars } from "../RatingStars";

type Filter = "all" | "ready" | "toFix";

/** Charte v2, Tableau: the header row on Ciel, 48 high, 15/22 700. */
const HEADER_CELL_CLASSES = "h-[48px] bg-sky pr-3 font-bold";

const SHOWN_FIRST_ON_DESKTOP = 4;
const SHOWN_FIRST_ON_MOBILE = 3;

const formatDay = (date: Date) =>
  new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(date);

const dateOf = (row: CsvRow) => (row.date ? formatDay(row.date) : row.cells.date || "Aujourd'hui");

const describeRun = (item: Extract<PreviewItem, { kind: "ready-run" }>) =>
  item.count === 1 ? `Ligne ${item.fromLine} : prête` : `Lignes ${item.fromLine} à ${item.toLine} : prêtes`;

const RowBadge = ({ isReady }: { isReady: boolean }) =>
  isReady ? (
    <ToneBadge tone="success" icon="valid" label="Prête" />
  ) : (
    <ToneBadge tone="error" icon="alert" label="À revoir" />
  );

const FilterChip = ({ label, isSelected, onSelect }: { label: string; isSelected: boolean; onSelect: () => void }) => (
  <button
    type="button"
    aria-pressed={isSelected}
    onClick={onSelect}
    className={cn(FILTER_CHIP_CLASSES, isSelected && FILTER_CHIP_CHOSEN_CLASSES)}
  >
    {isSelected ? <Icon name="check" size={16} /> : null}
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
      <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:justify-between">
        <h2 id="csv-preview" className="font-display text-h3">
          <span className="desktop:hidden">Aperçu</span>
          <span className="max-desktop:hidden">Aperçu ligne par ligne</span>
        </h2>
        <div className="hidden gap-2 desktop:flex" role="group" aria-label="Lignes affichées">
          <FilterChip label={`Toutes (${rows.length})`} isSelected={filter === "all"} onSelect={() => setFilter("all")} />
          <FilterChip label={`Prêtes (${ready.length})`} isSelected={filter === "ready"} onSelect={() => setFilter("ready")} />
          <FilterChip label={`À revoir (${toFix.length})`} isSelected={filter === "toFix"} onSelect={() => setFilter("toFix")} />
        </div>
      </div>

      <div className="hidden rounded-card bg-white p-2 desktop:block">
        <table className="w-full table-fixed border-separate border-spacing-[0] text-left text-small">
          <thead>
            <tr>
              <th scope="col" className={cn(HEADER_CELL_CLASSES, "w-[72px] rounded-l-field pl-4")}>Ligne</th>
              <th scope="col" className={cn(HEADER_CELL_CLASSES, "w-[112px]")}>Nom</th>
              <th scope="col" className={cn(HEADER_CELL_CLASSES, "w-[112px]")}>Titre</th>
              <th scope="col" className={cn(HEADER_CELL_CLASSES, "w-[108px]")}>Note</th>
              <th scope="col" className={HEADER_CELL_CLASSES}>Texte</th>
              <th scope="col" className={cn(HEADER_CELL_CLASSES, "w-[112px]")}>Formation</th>
              <th scope="col" className={cn(HEADER_CELL_CLASSES, "w-[104px]")}>Date</th>
              <th scope="col" className={cn(HEADER_CELL_CLASSES, "w-[128px] rounded-r-field")}>État</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) =>
              item.kind === "ready-run" ? (
                <tr key={`run-${item.fromLine}`}>
                  <td colSpan={8} className="py-3 pl-4 text-gray">
                    {describeRun(item)}
                  </td>
                </tr>
              ) : (
                <tr
                  key={item.row.line}
                  className={cn(
                    "align-top [&>td:first-child]:rounded-l-field [&>td:last-child]:rounded-r-field",
                    item.row.status !== "ready" && "[&>td]:bg-error-surface",
                  )}
                >
                  <td className={cn("py-4 pr-3 pl-4", item.row.status === "ready" ? "text-gray" : "text-error")}>
                    {item.row.line}
                  </td>
                  <td className="py-4 pr-3 font-bold break-words">{item.row.authorName || "—"}</td>
                  <td className="py-4 pr-3 break-words">{item.row.authorTitle ?? ""}</td>
                  <td className="py-4 pr-3">
                    {item.row.rating === null ? (
                      <span className="text-error">{item.row.cells.note || "—"}</span>
                    ) : (
                      <RatingStars rating={item.row.rating} size={18} />
                    )}
                  </td>
                  <td className="py-4 pr-3">{formatExcerpt(item.row.body, 90)}</td>
                  <td className="py-4 pr-3 break-words">{item.row.productName ?? "Sans offre"}</td>
                  <td className="py-4 pr-3">{dateOf(item.row)}</td>
                  <td className="py-4 pr-4">
                    <RowBadge isReady={item.row.status === "ready"} />
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      {isFolded ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className={cn(DISCREET_BUTTON_CLASSES, "hidden self-start desktop:inline-flex")}
        >
          Voir toutes les lignes
        </button>
      ) : null}

      <ul className="flex flex-col gap-3 desktop:hidden">
        {mobileRows.map((row) => (
          <li key={row.line} className="flex flex-col gap-2 rounded-card bg-white p-4">
            <span className="flex items-center justify-between gap-3">
              <span className="text-small text-gray">{`Ligne ${row.line}`}</span>
              <RowBadge isReady />
            </span>
            <span className="text-body">
              <span className="font-bold">{row.authorName}</span>
              {row.authorTitle ? <span className="text-gray">{` · ${row.authorTitle}`}</span> : null}
            </span>
            <span className="flex flex-col items-start gap-1">
              {row.rating === null ? null : <RatingStars rating={row.rating} size={16} />}
              <span className="text-small text-gray">{`${row.productName ?? "Sans offre"} · ${dateOf(row)}`}</span>
            </span>
            <span className="text-body">{quoteInFrench(formatExcerpt(row.body, 90))}</span>
          </li>
        ))}
      </ul>
      {hiddenOnMobile > 0 ? (
        <div className="flex flex-col gap-1 desktop:hidden">
          <p className="text-small text-gray">
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
