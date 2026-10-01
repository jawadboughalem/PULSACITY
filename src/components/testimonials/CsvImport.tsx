"use client";

import Link from "next/link";
import { useId, useRef, useState, useTransition } from "react";
import { type CsvImportResult, type CsvPreviewResult, importCsv, previewCsvImport } from "@/app/app/(espace)/temoignages/csv-import-actions";
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Checkbox } from "@/components/ui/Checkbox";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { cn } from "@/lib/cn";
import { formatDayMonthYear } from "@/lib/dates/format-french-date";
import { decodeCsvFile } from "@/lib/testimonials/csv/decode-csv-file";
import { CSV_COLUMNS, CSV_FILE_ERRORS, type CsvRow, MAX_CSV_LENGTH } from "@/lib/testimonials/csv/read-testimonial-csv";
import { formatExcerpt } from "@/lib/testimonials/format-excerpt";
import { CSV_CONSENT_TEXT } from "@/lib/testimonials/manual-consent";
import { FirstApprovalBanner } from "./FirstApprovalCelebration";

const TEMPLATE = `${CSV_COLUMNS.join(";")}\nCamille R.;Enseignante, Lyon;5;"En 30 jours j'ai arrêté de grignoter le soir.";Programme 30 jours;14/03/2026\n`;

const TEMPLATE_HREF = `data:text/csv;charset=utf-8,${encodeURIComponent(`﻿${TEMPLATE}`)}`;

const NETWORK_ERROR = "Le fichier n'a pas pu être envoyé. Vérifiez votre connexion, puis réessayez.";

type Step =
  | { name: "choose"; error: string | null }
  | { name: "preview"; fileName: string; text: string; preview: Extract<CsvPreviewResult, { ok: true }>["data"] }
  | { name: "report"; report: Extract<CsvImportResult, { ok: true }>["data"] };

const countLines = (count: number, singular: string, plural: string) => `${count} ${count > 1 ? plural : singular}`;

const describePlanPending = (pendingCount: number, planName: string, limit: number | null) =>
  `${countLines(pendingCount, "restera", "resteront")} en attente : votre plan ${planName} affiche ${limit} témoignages validés au plus.`;

type CsvImportProps = {
  testimonialsHref: string;
};

export const CsvImport = ({ testimonialsHref }: CsvImportProps) => {
  const [step, setStep] = useState<Step>({ name: "choose", error: null });
  const [hasConsent, setHasConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [isWorking, startWorking] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const chooseAgain = () => {
    setStep({ name: "choose", error: null });
    setHasConsent(false);
    setConsentError(false);
    setImportError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    startWorking(async () => {
      if (file.size > MAX_CSV_LENGTH * 4) {
        setStep({ name: "choose", error: CSV_FILE_ERRORS.tooLong });
        return;
      }
      const text = decodeCsvFile(await file.arrayBuffer());
      try {
        const result = await previewCsvImport(text);
        if (result.ok) setStep({ name: "preview", fileName: file.name, text, preview: result.data });
        else
          setStep({
            name: "choose",
            error: result.error === "file-error" ? result.message : "Votre espace est introuvable. Rechargez la page.",
          });
      } catch {
        setStep({ name: "choose", error: NETWORK_ERROR });
      }
    });
  };

  const handleImport = (text: string) => {
    if (!hasConsent) {
      setConsentError(true);
      return;
    }
    setImportError(null);
    startWorking(async () => {
      try {
        const result = await importCsv(text, true);
        if (result.ok) setStep({ name: "report", report: result.data });
        else setImportError(result.error === "file-error" ? result.message : NETWORK_ERROR);
      } catch {
        setImportError(NETWORK_ERROR);
      }
    });
  };

  if (step.name === "report") {
    const { report } = step;
    return (
      <div className="flex flex-col gap-6">
        {report.isFirstApproval ? <FirstApprovalBanner /> : null}
        <StatusBanner
          tone="success"
          title={`${countLines(report.importedCount, "témoignage importé", "témoignages importés")}.`}
        >
          {[
            report.pendingCount > 0
              ? describePlanPending(report.pendingCount, report.plan.name, report.plan.testimonialLimit)
              : null,
            report.createdProductNames.length > 0 ? `Offres créées : ${report.createdProductNames.join(", ")}.` : null,
          ]
            .filter(Boolean)
            .join(" ")}
        </StatusBanner>
        {report.notImported.length > 0 ? (
          <ProblemList
            title={`${countLines(report.notImported.length, "ligne n'a pas été importée", "lignes n'ont pas été importées")} :`}
            rows={report.notImported}
          />
        ) : null}
        <div className="flex flex-col gap-3 desktop:flex-row">
          <Link href={testimonialsHref} className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
            Voir mes témoignages
          </Link>
          <button type="button" onClick={chooseAgain} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
            Importer un autre fichier
          </button>
        </div>
      </div>
    );
  }

  if (step.name === "preview") {
    const { preview } = step;
    const ready = preview.rows.filter((row) => row.status === "ready");
    const toFix = preview.rows.filter((row) => row.status !== "ready");
    const pendingCount = ready.filter((row) => row.isPending).length;
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-small text-slate-600">{`Fichier : ${step.fileName}`}</p>
          <h2 className="font-serif text-h2 font-medium">
            {`${countLines(ready.length, "témoignage prêt", "témoignages prêts")}${
              toFix.length > 0 ? `, ${countLines(toFix.length, "ligne à revoir", "lignes à revoir")}` : ""
            }`}
          </h2>
        </div>
        {pendingCount > 0 || preview.newProductNames.length > 0 ? (
          <StatusBanner tone="waiting" title="Avant d'importer">
            {[
              pendingCount > 0
                ? describePlanPending(pendingCount, preview.plan.name, preview.plan.testimonialLimit)
                : null,
              preview.newProductNames.length > 0
                ? `Ces offres seront créées : ${preview.newProductNames.join(", ")}.`
                : null,
            ]
              .filter(Boolean)
              .join(" ")}
          </StatusBanner>
        ) : null}
        {toFix.length > 0 ? (
          <ProblemList title="Ces lignes ne seront pas importées :" rows={toFix} />
        ) : null}
        {ready.length > 0 ? <ReadyTable rows={ready} /> : null}
        {ready.length > 0 ? (
          <div className="flex flex-col gap-5 border-t border-hairline-200 pt-5">
            <div className="flex flex-col gap-2">
              <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-body">
                <Checkbox
                  checked={hasConsent}
                  hasError={consentError}
                  aria-describedby={consentError ? "csv-consent-error" : undefined}
                  onChange={(event) => {
                    setHasConsent(event.target.checked);
                    setConsentError(false);
                  }}
                />
                <span>{CSV_CONSENT_TEXT}</span>
              </label>
              {consentError ? (
                <FieldError
                  id="csv-consent-error"
                  message="Cochez la case : sans l'accord des personnes, ces témoignages ne peuvent pas être publiés."
                />
              ) : null}
            </div>
            {importError ? <FieldError id="csv-import-error" message={importError} /> : null}
            <div className="flex flex-col gap-3 desktop:flex-row">
              <button
                type="button"
                onClick={() => handleImport(step.text)}
                disabled={isWorking}
                className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}
              >
                {isWorking
                  ? "Import…"
                  : `Importer ${countLines(ready.length, "témoignage", "témoignages")}`}
              </button>
              <button type="button" onClick={chooseAgain} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
                Choisir un autre fichier
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={chooseAgain} className={cn(SECONDARY_BUTTON_CLASSES, "self-start")}>
            Choisir un autre fichier
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="csv-columns" className="flex flex-col gap-3 bg-paper-100 p-4 desktop:p-5">
        <h2 id="csv-columns" className="text-body font-semibold">
          Une ligne par témoignage, avec ces colonnes
        </h2>
        <ul className="flex flex-col gap-1 text-small">
          <li>
            <strong className="font-semibold">nom</strong>, <strong className="font-semibold">note</strong> et{" "}
            <strong className="font-semibold">texte</strong> : obligatoires. La note va de 1 à 5.
          </li>
          <li>
            <strong className="font-semibold">titre</strong>, <strong className="font-semibold">formation</strong> et{" "}
            <strong className="font-semibold">date</strong> : facultatifs. La date s&apos;écrit 14/03/2026.
          </li>
          <li>Une formation inconnue est ajoutée à vos offres.</li>
        </ul>
        <a
          href={TEMPLATE_HREF}
          download="modele-temoignages.csv"
          className="self-start text-small font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
        >
          Télécharger un modèle
        </a>
      </section>
      <div className="flex flex-col gap-3">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept=".csv,text/csv"
          className="peer sr-only"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
        <label
          htmlFor={inputId}
          aria-disabled={isWorking}
          className={cn(
            PRIMARY_BUTTON_CLASSES,
            "w-full cursor-pointer peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink-900 desktop:w-auto desktop:self-start",
          )}
        >
          <Icon name="upload" size={20} />
          {isWorking ? "Lecture du fichier…" : "Choisir un fichier CSV"}
        </label>
        {step.error ? <FieldError id="csv-file-error" message={step.error} /> : null}
      </div>
    </div>
  );
};

const ProblemList = ({ title, rows }: { title: string; rows: CsvRow[] }) => (
  <section className="flex flex-col gap-3 border-2 border-error bg-error-surface p-4 desktop:p-5" role="status">
    <p className="flex items-start gap-2 text-body font-semibold text-error">
      <Icon name="alert" size={20} className="mt-[2px]" />
      {title}
    </p>
    <ul className="flex flex-col gap-3">
      {rows.map((row) => (
        <li key={row.line} className="flex flex-col gap-1 border-t border-hairline-200 pt-3 text-small">
          <strong className="font-semibold">
            {`Ligne ${row.line}`}
            {row.authorName ? <span className="font-normal text-slate-600">{` · ${row.authorName}`}</span> : null}
          </strong>
          <ul className="flex flex-col gap-1">
            {row.problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </section>
);

const ReadyTable = ({ rows }: { rows: CsvRow[] }) => (
  <section aria-label="Témoignages prêts à importer" className="flex flex-col">
    <div className="hidden overflow-x-auto desktop:block">
      <table className="w-full min-w-[720px] table-fixed border-collapse text-left text-small">
        <thead>
          <tr className="border-b border-ink-900">
            <th scope="col" className="w-[72px] pr-4 pb-3 font-semibold">Ligne</th>
            <th scope="col" className="w-[176px] pr-4 pb-3 font-semibold">Nom</th>
            <th scope="col" className="w-[64px] pr-4 pb-3 font-semibold">Note</th>
            <th scope="col" className="pr-4 pb-3 font-semibold">Texte</th>
            <th scope="col" className="w-[160px] pr-4 pb-3 font-semibold">Formation</th>
            <th scope="col" className="w-[120px] pb-3 font-semibold">Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.line} className="border-b border-hairline-200 align-top">
              <td className="py-3 pr-4 text-slate-600">{row.line}</td>
              <td className="py-3 pr-4">
                <span className="block truncate font-semibold">{row.authorName}</span>
                {row.isPending ? <span className="text-attention">Restera en attente</span> : null}
              </td>
              <td className="py-3 pr-4">{`${row.rating}/5`}</td>
              <td className="py-3 pr-4 font-serif text-body">{formatExcerpt(row.body)}</td>
              <td className="py-3 pr-4 text-slate-600">{row.productName ?? "Sans offre"}</td>
              <td className="py-3 text-slate-600">{row.date ? formatDayMonthYear(row.date) : "Aujourd'hui"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <ul className="flex flex-col desktop:hidden">
      {rows.map((row) => (
        <li key={row.line} className="flex flex-col gap-1 border-b border-hairline-200 py-3 text-small">
          <span className="flex justify-between gap-3">
            <strong className="truncate font-semibold">{row.authorName}</strong>
            <span className="shrink-0 text-slate-600">{`Ligne ${row.line} · ${row.rating}/5`}</span>
          </span>
          <span className="font-serif text-body">{formatExcerpt(row.body)}</span>
          <span className="text-slate-600">
            {[row.productName ?? "Sans offre", row.date ? formatDayMonthYear(row.date) : "Aujourd'hui"].join(" · ")}
          </span>
          {row.isPending ? <span className="text-attention">Restera en attente</span> : null}
        </li>
      ))}
    </ul>
  </section>
);
