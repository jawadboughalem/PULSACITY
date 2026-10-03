import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/icon-paths";
import type { ConnectionEvent } from "@/lib/connectors/load-connection-overview";
import { cn } from "@/lib/cn";
import { formatListTime } from "@/lib/dates/format-relative-time";
import { type EventTone, describeConnectionEvent } from "./describe-connection-event";
import { ReplayEventButton } from "./ReplayEventButton";

const TONE_CLASSES = {
  success: "bg-success-surface text-success",
  attention: "bg-attention-surface text-attention",
  neutral: "bg-paper-100 text-slate-600",
  error: "bg-error-surface text-error",
} as const satisfies Record<EventTone, string>;

type RowProps = {
  icon: IconName;
  tone: EventTone;
  label: string;
  subject: string;
  detail: string;
  time: string;
  action?: ReactNode;
};

const EventRow = ({ icon, tone, label, subject, detail, time, action }: RowProps) => (
  <li className="flex items-start gap-4 border-b border-hairline-200 py-4 desktop:items-center">
    <span className={cn("flex size-[40px] shrink-0 items-center justify-center rounded-full", TONE_CLASSES[tone])}>
      <Icon name={icon} size={20} />
    </span>
    <div className="flex min-w-[0] flex-1 flex-col gap-3 desktop:flex-row desktop:items-center desktop:gap-5">
      <div className="flex min-w-[0] flex-1 flex-col gap-1">
        <p className="text-body">
          <strong className="font-semibold">{label}</strong>
          {subject ? ` · ${subject}` : ""}
        </p>
        <p className={cn("text-small", tone === "error" ? "text-error" : "text-slate-600")}>{detail}</p>
        <p className="text-small text-slate-600 desktop:hidden">{time}</p>
      </div>
      {action}
      <p className="hidden shrink-0 text-small text-slate-600 desktop:block">{time}</p>
    </div>
  </li>
);

type ConnectionEventListProps = {
  events: ConnectionEvent[];
  connectorName: string;
  /** The first event ever received is in the list: « Connexion établie » closes it. */
  firstEventAt: Date | null;
  now: Date;
};

/** Maquette 5, « Derniers événements reçus »: readable lines, « Rejouer » where an event was put aside. */
export const ConnectionEventList = ({ events, connectorName, firstEventAt, now }: ConnectionEventListProps) => (
  <ul className="flex flex-col border-t border-ink-900">
    {events.map((event) => {
      const described = describeConnectionEvent(event);
      return (
        <EventRow
          key={event.id}
          icon={described.icon}
          tone={described.tone}
          label={described.label}
          subject={described.subject}
          detail={described.detail}
          time={formatListTime(event.receivedAt, now)}
          action={
            described.canReplay ? (
              <ReplayEventButton eventId={event.id} eventLabel={[described.label, described.subject].filter(Boolean).join(" · ")} />
            ) : undefined
          }
        />
      );
    })}
    {firstEventAt ? (
      <EventRow
        icon="connection"
        tone="neutral"
        label="Connexion établie"
        subject={connectorName}
        detail="Première information reçue de votre compte"
        time={formatListTime(firstEventAt, now)}
      />
    ) : null}
  </ul>
);
