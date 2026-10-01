"use client";

import Link from "next/link";
import { useId, useRef, useState, useTransition } from "react";
import { type CsvImportResult, type CsvPreviewResult, importCsv, previewCsvImport } from "@/app/app/(espace)/temoignages/csv-import-actions";
import { DISCREET_BUTTON_CLASSES, PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Checkbox } from "@/components/ui/Checkbox";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { buildRejectedLinesCsv } from "@/lib/testimonials/csv/build-rejected-lines-csv";
import { decodeCsvFile } from "@/lib/testimonials/csv/decode-csv-file";
import { CSV_COLUMNS, CSV_FILE_ERRORS, MAX_CSV_LENGTH, MAX_CSV_ROWS } from "@/lib/testimonials/csv/read-testimonial-csv";
import { CSV_CONSENT_TEXT } from "@/lib/testimonials/manual-consent";
import { CsvColumnsGuide } from "./csv/CsvColumnsGuide";
import { CsvPlanNotice } from "./csv/CsvPlanNotice";
import { CsvPreviewList } from "./csv/CsvPreviewList";
import { CsvProblems } from "./csv/CsvProblems";
import { ImportStepper } from "./csv/ImportStepper";
import { FirstApprovalBanner } from "./FirstApprovalCelebration";

const TEMPLATE = `${CSV_COLUMNS.join(";")}\nCamille R.;Enseignante, Lyon;5;"En 30 jours j'ai arrêté de grignoter le soir.";Programme 30 jours;14/03/2026\n`;

const toCsvHref = (csv: string) => `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;

const TEMPLATE_HREF = toCsvHref(`﻿${TEMPLATE}`);

const NETWORK_ERROR = "Le fichier n'a pas pu être envoyé. Vérifiez votre connexion, puis réessayez.";

const ROWS_LIMIT = new Intl.NumberFormat("fr-FR").format(MAX_CSV_ROWS);

type Preview = Extract<CsvPreviewResult, { ok: true }>["data"];
type Report = Extract<CsvImportResult, { ok: true }>["data"];

type Step =
  | { name: "choose"; error: string | null }
  | { name: "preview"; fileName: string; text: string; preview: Preview }
  | { name: "report"; report: Report };

const count = (value: number, singular: string, plural: string) => `${value} ${value > 1 ? plural : singular}`;

const describeImported = (report: Report) => {
  const publishedCount = report.importedCount - report.pendingCount;
  if (report.pendingCount === 0) {
    return publishedCount > 1
      ? "Ils sont publiés et peuvent s'afficher dans vos widgets."
      : "Il est publié et peut s'afficher dans vos widgets.";
  }
  const published =
    publishedCount === 0
      ? null
      : publishedCount > 1
        ? `${publishedCount} sont publiés et peuvent s'afficher dans vos widgets.`
        : "1 est publié et peut s'afficher dans vos widgets.";
  const pending = `${report.pendingCount} ${report.pendingCount > 1 ? "restent" : "reste"} en attente, à cause de la limite du plan ${report.plan.name}.`;
  return [published, pending].filter(Boolean).join(" ");
};

type CsvImportProps = {
  testimonialsHref: string;
};

export const CsvImport = ({ testimonialsHref }: CsvImportProps) => {
  const [step, setStep] = useState<Step>({ name: "choose", error: null });
  const [hasConsent, setHasConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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
    const publishedCount = report.importedCount - report.pendingCount;
    return (
      <div className="flex flex-col gap-6">
        <ImportStepper current={2} />
        {report.isFirstApproval ? <FirstApprovalBanner /> : null}
        <section role="status" className="flex items-start gap-3 bg-success-surface p-5 desktop:gap-4 desktop:p-6">
          <Icon name="valid" size={24} className="mt-1 text-success" />
          <div className="flex flex-col gap-2">
            <h2 className="font-serif text-h2 font-medium">
              {`${count(report.importedCount, "témoignage importé", "témoignages importés")}.`}
            </h2>
            {report.importedCount > 0 ? <p className="text-body">{describeImported(report)}</p> : null}
          </div>
        </section>
        {report.pendingCount > 0 ? (
          <CsvPlanNotice
            pendingCount={report.pendingCount}
            publishedCount={publishedCount}
            planName={report.plan.name}
            limit={report.plan.testimonialLimit}
            isDone
          />
        ) : null}
        {report.notImported.length > 0 ? (
          <CsvProblems
            title={count(report.notImported.length, "ligne non importée", "lignes non importées")}
            intro={`Corrigez-${report.notImported.length > 1 ? "les" : "la"} dans votre fichier, puis importez-${
              report.notImported.length > 1 ? "les" : "la"
            } à nouveau.${
              report.importedCount > 0
                ? ` ${report.importedCount > 1 ? `Les ${report.importedCount} autres sont` : "L'autre est"} déjà dans votre espace.`
                : ""
            }`}
            rows={report.notImported}
          >
            <a
              href={toCsvHref(buildRejectedLinesCsv(report.notImported))}
              download="lignes-a-corriger.csv"
              className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto desktop:self-start")}
            >
              <Icon name="download" size={20} />
              {report.notImported.length > 1 ? `Télécharger ces ${report.notImported.length} lignes` : "Télécharger cette ligne"}
            </a>
          </CsvProblems>
        ) : null}
        <div className="flex flex-col gap-4 desktop:flex-row desktop:items-center desktop:gap-5">
          <Link href={testimonialsHref} className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
            Voir mes témoignages
          </Link>
          <button type="button" onClick={chooseAgain} className={cn(DISCREET_BUTTON_CLASSES, "self-start desktop:self-auto")}>
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
        <ImportStepper current={1} />
        <div className="flex flex-col gap-4 border border-hairline-200 p-4 desktop:flex-row desktop:items-center desktop:justify-between desktop:p-5">
          <div className="flex flex-col gap-3 desktop:flex-row desktop:items-start desktop:gap-4">
            <Icon name="copy" size={20} className="mt-[2px]" />
            <div className="flex min-w-[0] flex-col">
              <span className="text-body font-semibold break-all">{step.fileName}</span>
              <span className="text-small text-slate-600">
                {`${count(preview.rows.length, "ligne", "lignes")}, sans compter les titres de colonnes`}
              </span>
            </div>
          </div>
          <button type="button" onClick={chooseAgain} className={cn(DISCREET_BUTTON_CLASSES, "self-start desktop:self-auto")}>
            Changer de fichier
          </button>
        </div>
        <h2 className="border-b border-hairline-200 pb-5 font-serif text-h2 font-medium">
          {`${count(ready.length, "témoignage prêt", "témoignages prêts")}${
            toFix.length > 0 ? `, ${count(toFix.length, "ligne à revoir", "lignes à revoir")}` : ""
          }`}
        </h2>
        {toFix.length > 0 ? (
          <CsvProblems
            title={count(toFix.length, "ligne à revoir", "lignes à revoir")}
            intro={`${toFix.length > 1 ? "Elles ne seront pas importées" : "Elle ne sera pas importée"}. Corrigez votre fichier et chargez-le à nouveau, ou importez sans ${toFix.length > 1 ? "elles" : "elle"}.`}
            rows={toFix}
          />
        ) : null}
        <CsvPreviewList rows={preview.rows} />
        {pendingCount > 0 ? (
          <CsvPlanNotice
            pendingCount={pendingCount}
            publishedCount={ready.length - pendingCount}
            planName={preview.plan.name}
            limit={preview.plan.testimonialLimit}
            isDone={false}
          />
        ) : null}
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
            <div className="flex flex-col gap-4 desktop:flex-row desktop:items-center desktop:gap-5">
              <button
                type="button"
                onClick={() => handleImport(step.text)}
                disabled={isWorking}
                className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}
              >
                {isWorking ? "Import en cours…" : `Importer ${count(ready.length, "témoignage", "témoignages")}`}
              </button>
              {isWorking ? (
                <p className="text-small text-slate-600">Ne fermez pas la page.</p>
              ) : (
                <Link href={testimonialsHref} className={cn(DISCREET_BUTTON_CLASSES, "self-start desktop:self-auto")}>
                  Annuler
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-6">
        <ImportStepper current={0} />
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFile(event.dataTransfer.files[0]);
          }}
          className={cn(
            "flex flex-col items-center gap-4 border border-dashed bg-paper-100 px-5 py-7 text-center desktop:py-8",
            isDragging ? "border-ink-900" : "border-gray-400",
          )}
        >
          <span className="flex size-[64px] items-center justify-center rounded-full border-2 border-ink-900">
            <Icon name="upload" size={24} />
          </span>
          <p className="text-body font-semibold max-desktop:hidden">Déposez votre fichier ici</p>
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
              SECONDARY_BUTTON_CLASSES,
              "w-full cursor-pointer peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink-900 desktop:w-auto",
            )}
          >
            <Icon name="upload" size={20} />
            {isWorking ? "Lecture du fichier…" : "Choisir un fichier"}
          </label>
          <p className="text-small text-slate-600">
            {`Fichier CSV, ${ROWS_LIMIT} lignes au plus. Virgules ou points-virgules acceptés.`}
          </p>
        </div>
        {step.error ? <FieldError id="csv-file-error" message={step.error} /> : null}
      </div>
      <CsvColumnsGuide templateHref={TEMPLATE_HREF} />
    </div>
  );
};

