"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  type RequestEmailPreviewInput,
  previewRequestEmail,
} from "@/app/app/(espace)/reglages/settings-actions";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { DialogCloseButton } from "@/components/ui/DialogCloseButton";
import { DIALOG_ACTIONS_CLASSES, DIALOG_CLASSES, DIALOG_TITLE_CLASSES, isClickOnVeil } from "@/components/ui/dialog-styles";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";
import { StatusBanner } from "@/components/ui/StatusBanner";
import type { RequestEmailPreview as Preview } from "@/lib/spaces/render-request-email-preview";
import { cn } from "@/lib/cn";

type PreviewState = { status: "loading" } | { status: "ready"; preview: Preview } | { status: "failed" };

type RequestEmailPreviewProps = {
  /** What the creator has typed, saved or not, read when the window opens. */
  readInput: () => RequestEmailPreviewInput;
};

/** The width of a phone: the e-mail is drawn as it reads there, then scaled down to the room it has. */
const FRAME_WIDTH = 400;

/** The e-mail, drawn in a frame of its own: its styles stay inside, and it shows at its full height. */
const EmailFrame = ({ html }: { html: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(640);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / FRAME_WIDTH)));
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden rounded-card bg-white" style={{ height: contentHeight * scale }}>
      <iframe
        title="Aperçu de l'e-mail"
        srcDoc={html}
        sandbox="allow-same-origin"
        onLoad={(event) => {
          const body = event.currentTarget.contentDocument?.body;
          if (body) setContentHeight(body.scrollHeight);
        }}
        style={{ width: FRAME_WIDTH, height: contentHeight, transform: `scale(${scale})` }}
        className="pointer-events-none block origin-top-left"
      />
    </div>
  );
};

/**
 * Réglages, « Voir l'e-mail de demande »: the request a customer receives, with the creator's name, logo and postal
 * address as typed, for a fictitious customer.
 */
export const RequestEmailPreview = ({ readInput }: RequestEmailPreviewProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<PreviewState>({ status: "loading" });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const open = async () => {
    setState({ status: "loading" });
    setIsOpen(true);
    try {
      const result = await previewRequestEmail(readInput());
      setState(result.ok ? { status: "ready", preview: result.data } : { status: "failed" });
    } catch {
      setState({ status: "failed" });
    }
  };

  const close = () => setIsOpen(false);

  return (
    <>
      <button type="button" onClick={open} className={cn(SECONDARY_BUTTON_CLASSES, "self-start")}>
        <Icon name="mail" size={20} />
        Voir l&apos;e-mail de demande
      </button>
      <dialog
        ref={dialogRef}
        data-ouvert={isOpen}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (isClickOnVeil(event)) close();
        }}
        aria-labelledby={titleId}
        className={DIALOG_CLASSES}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className={DIALOG_TITLE_CLASSES}>
              Aperçu de l&apos;e-mail de demande
            </h2>
            <DialogCloseButton onClick={close} />
          </div>
          {state.status === "loading" ? (
            <p role="status" className="flex min-h-[120px] items-center justify-center gap-3 text-body">
              <Spinner size={20} />
              Préparation de l&apos;aperçu…
            </p>
          ) : null}
          {state.status === "failed" ? (
            <StatusBanner tone="error" title="L'aperçu n'a pas pu s'afficher.">
              Vérifiez votre connexion, puis rouvrez l&apos;aperçu.
            </StatusBanner>
          ) : null}
          {state.status === "ready" ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 rounded-card bg-cloud p-4 desktop:p-5">
                <p className="text-legal break-words">
                  <strong>De :</strong> {state.preview.sender} · <strong>Objet :</strong> {state.preview.subject}
                </p>
                <EmailFrame html={state.preview.html} />
              </div>
              <p className="text-small text-gray">
                Exemple, pour un client fictif. Le texte reste celui de PULSACITY ; votre nom, votre logo, votre
                couleur d&apos;accent et votre adresse postale s&apos;y appliquent.
              </p>
            </div>
          ) : null}
          <div className={DIALOG_ACTIONS_CLASSES}>
            <button type="button" onClick={close} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
              Fermer
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};
