import type { Metadata } from "next";
import Link from "next/link";
import { CopyCollectionLinkButton } from "@/components/dashboard/CopyCollectionLinkButton";
import { Figure } from "@/components/dashboard/DashboardFigures";
import { formatResponseRate, pluralize } from "@/components/dashboard/format-figures";
import {
  REQUEST_BADGES,
  REQUEST_STATUS_FILTERS,
  REQUEST_STATUS_PARAMETER,
  describeRequest,
  readRequestStatusFilter,
} from "@/components/requests/describe-request";
import { RequestActions } from "@/components/requests/RequestActions";
import { RequestReviewDialog } from "@/components/requests/RequestReviewDialog";
import { RequestStatusFilter } from "@/components/requests/RequestStatusFilter";
import { buildSpaceAccount } from "@/components/space/build-space-account";
import { SpaceMobileHeader } from "@/components/space/SpaceMobileHeader";
import { SpacePage } from "@/components/space/SpacePage";
import {
  ASK_FOR_REVIEW_PARAMETER,
  BILLING_HREF,
  READY_REQUEST_PARAMETER,
  REQUESTS_SECTION_HREF,
  SYSTEME_CONNECTOR_HREF,
  TESTIMONIALS_SECTION_HREF,
} from "@/components/space/space-sections";
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { SpaceAvatar } from "@/components/ui/SpaceAvatar";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { canSendRequest, getPlan } from "@/config/plans";
import { getDb } from "@/db";
import { buildCollectionUrl } from "@/lib/app-url";
import { cn } from "@/lib/cn";
import { endSentence } from "@/lib/french/typography";
import { findConnection } from "@/lib/connectors/connections";
import { formatDayMonth } from "@/lib/dates/format-french-date";
import { startOfNextParisMonth, toParisIsoDay } from "@/lib/dates/paris-date";
import {
  REQUESTS_PAGE_SIZE,
  type ReviewRequestStatus,
  countSpaceRequests,
  listSpaceRequests,
  loadReadyRequest,
} from "@/lib/requests/list-space-requests";
import { REMINDER_DELAY_DAYS } from "@/lib/requests/send-review-emails";
import { listAssociableProducts } from "@/lib/spaces/list-space-products";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";

export const metadata: Metadata = {
  title: "Demandes · PULSACITY",
};

/** The address parameter of « Afficher les … suivantes »: how many rows the list shows. */
const SHOWN_PARAMETER = "nombre";

const readParameter = (value: string | string[] | undefined): string | null => (Array.isArray(value) ? value[0] : value) ?? null;

const DAY_MS = 24 * 60 * 60 * 1000;

const readShownCount = (value: string | string[] | undefined): number => {
  const shown = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(shown) && shown > REQUESTS_PAGE_SIZE ? shown : REQUESTS_PAGE_SIZE;
};

const MONTH = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", month: "long" });

/** « d'octobre », « de novembre » */
const ofMonth = (date: Date): string => {
  const month = MONTH.format(date);
  return /^[aeiou]/.test(month) ? `d'${month}` : `de ${month}`;
};

/** « Et 10 autres demandes planifiées. » under a filtered list. */
const STATUS_WORDS = {
  scheduled: ["planifiée", "planifiées"],
  sent: ["envoyée", "envoyées"],
  reminded: ["relancée", "relancées"],
  completed: ["complétée", "complétées"],
  cancelled: ["annulée", "annulées"],
  failed: ["en échec", "en échec"],
} as const satisfies Record<ReviewRequestStatus, readonly [string, string]>;

const LINK_CLASSES =
  "text-small font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

const CHIP_CLASSES =
  "inline-flex h-[40px] items-center rounded-full border px-4 text-small whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

/** m19, « Demandes »: the requests of the space, planned, sent, reminded, answered, with the month's response rate. */
const RequestsPage = async ({ searchParams }: PageProps<"/app/demandes">) => {
  const { signedInUser, space } = await getCurrentSpace();
  const search = await searchParams;
  const status = readRequestStatusFilter(search[REQUEST_STATUS_PARAMETER]);
  const shownCount = readShownCount(search[SHOWN_PARAMETER]);
  const database = getDb();
  const now = new Date();
  const [counts, list, connection, offers, readyRequest] = await Promise.all([
    countSpaceRequests(database, space.id, now),
    listSpaceRequests(database, space.id, { status, limit: shownCount }),
    findConnection(database, space.id, "systeme"),
    listAssociableProducts(database, space.id),
    loadReadyRequest(database, space.id, readParameter(search[READY_REQUEST_PARAMETER])),
  ]);
  const plan = getPlan(space.plan);
  const monthlyRequests = plan.limits.monthlyRequests;
  // The month's requests sent are what the plan counts: past its limit, the planned ones wait for next month.
  const heldUntil =
    monthlyRequests !== null && !canSendRequest(space, counts.sentThisMonth) ? startOfNextParisMonth(now) : null;
  const filterValue = REQUEST_STATUS_FILTERS.find((filter) => filter.status === status)?.value ?? "";
  const filterHref = (value: string, shown = REQUESTS_PAGE_SIZE) => {
    const parameters = new URLSearchParams();
    if (value) parameters.set(REQUEST_STATUS_PARAMETER, value);
    if (shown > REQUESTS_PAGE_SIZE) parameters.set(SHOWN_PARAMETER, String(shown));
    const query = parameters.toString();
    return `${REQUESTS_SECTION_HREF}${query ? `?${query}` : ""}`;
  };
  const filters = [
    { value: "", label: "Toutes", count: counts.all },
    ...REQUEST_STATUS_FILTERS.map((filter) => ({ value: filter.value, label: filter.label, count: counts[filter.status] })),
  ];
  const remaining = list.total - list.requests.length;
  const nextCount = Math.min(REQUESTS_PAGE_SIZE, remaining);

  return (
    <>
      <SpaceMobileHeader account={buildSpaceAccount(signedInUser, space)} />
      <SpacePage>
        {/* m20: the confirmation sits above the title on a phone, under it on a desktop. */}
        <div className="flex flex-col-reverse gap-5 desktop:flex-col">
          <header className="flex flex-col gap-5 desktop:flex-row desktop:items-start desktop:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="font-serif text-h1 font-medium">Demandes</h1>
              <p className="max-w-text text-body text-slate-600">
                Une demande d&apos;avis part après chaque vente, au délai réglé dans Offres. Vous pouvez l&apos;envoyer plus
                tôt ou l&apos;annuler.
              </p>
            </div>
            <RequestReviewDialog
              spaceName={space.name}
              offers={offers.map(({ id, name, slug }) => ({ id, name, slug }))}
              collectionUrl={buildCollectionUrl(space.slug)}
              today={toParisIsoDay(now)}
              monthlyLimit={
                monthlyRequests !== null && heldUntil
                  ? { count: monthlyRequests, month: ofMonth(now), nextMonth: MONTH.format(heldUntil) }
                  : null
              }
              dailyLimit={plan.limits.manualRequestsPerDay}
              isOpenAtFirst={readParameter(search[ASK_FOR_REVIEW_PARAMETER]) !== null}
            />
          </header>
          {readyRequest?.status === "scheduled" ? (
            <section role="status" className="flex items-start gap-4 bg-success-surface p-4 desktop:p-5">
              <Icon name="valid" size={24} className="shrink-0 text-success" />
              <div className="flex min-w-[0] flex-1 flex-col gap-1">
                <p className="text-body font-semibold text-success">
                  {endSentence(`Demande prête pour ${readyRequest.customerName}`)}
                </p>
                <p className="text-small">
                  {heldUntil && readyRequest.scheduledAt < heldUntil
                    ? `Elle partira le 1er ${MONTH.format(heldUntil)}, au premier envoi du mois, à ${readyRequest.email}. Sans réponse, une relance partira quatre jours plus tard.`
                    : `Elle part au prochain envoi, dans les minutes qui suivent, à ${readyRequest.email}. ${endSentence(`Sans réponse, une relance partira le ${formatDayMonth(new Date(Math.max(now.getTime(), readyRequest.scheduledAt.getTime()) + REMINDER_DELAY_DAYS * DAY_MS))}`)}`}
                </p>
              </div>
              <Link
                href={REQUESTS_SECTION_HREF}
                aria-label="Fermer le message"
                className="-m-2 flex size-[44px] shrink-0 items-center justify-center focus-visible:outline-2 focus-visible:outline-ink-900"
              >
                <Icon name="close" size={20} />
              </Link>
            </section>
          ) : null}
        </div>

        {counts.all === 0 ? (
          <section className="flex flex-col gap-4 bg-paper-100 p-5 desktop:p-7">
            <h2 className="font-serif text-quote font-medium desktop:text-h2">Aucune demande pour l&apos;instant</h2>
            <p className="max-w-text text-body">
              Dès que Systeme.io nous envoie une vente, la demande d&apos;avis se prépare ici, avec sa date de départ. Vous
              pouvez aussi envoyer votre lien de collecte vous-même.
            </p>
            <div className="flex flex-col gap-3 desktop:flex-row">
              {connection?.status === "active" ? null : (
                <Link href={SYSTEME_CONNECTOR_HREF} className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
                  Connecter Systeme.io
                </Link>
              )}
              <CopyCollectionLinkButton url={buildCollectionUrl(space.slug)} label="Copier mon lien" />
            </div>
          </section>
        ) : (
          <>
            <section aria-label="Vos demandes" className="grid grid-cols-2 border-t border-ink-900 desktop:grid-cols-4 [&>*]:border-b">
              <Figure value={String(counts.scheduled)} className="pr-4 desktop:pr-5">
                {counts.scheduled > 1 ? "planifiées" : "planifiée"}
              </Figure>
              <Figure value={String(counts.sentThisMonth)} className="border-l pl-4 desktop:px-5">
                {`${counts.sentThisMonth > 1 ? "envoyées" : "envoyée"} ce mois`}
                {counts.remindedThisMonth > 0
                  ? `, dont ${pluralize(counts.remindedThisMonth, "relancée", "relancées")}`
                  : null}
              </Figure>
              <Figure value={String(counts.answeredThisMonth)} className="pr-4 desktop:border-l desktop:px-5">
                {counts.answeredThisMonth > 1 ? "complétées par un avis" : "complétée par un avis"}
              </Figure>
              <Figure
                value={formatResponseRate(counts.answeredThisMonth, counts.sentThisMonth)}
                className="border-l pl-4 desktop:px-5"
              >
                taux de réponse ce mois
              </Figure>
            </section>

            {monthlyRequests !== null && heldUntil ? (
              <section role="status" className="flex items-start gap-3 bg-paper-100 p-5 desktop:gap-4 desktop:p-6">
                <Icon name="info" size={24} className="shrink-0" />
                <div className="flex flex-col gap-2">
                  <h2 className="text-body font-semibold">{`Les ${monthlyRequests} demandes ${ofMonth(now)} sont parties.`}</h2>
                  <p className="text-small">
                    {`Le plan ${plan.name} envoie ${monthlyRequests} demandes par mois. Les suivantes partiront le 1er ${MONTH.format(heldUntil)} : rien n'est perdu. Avec le plan Essentiel, elles partent sans attendre.`}
                  </p>
                  <Link href={BILLING_HREF} className={cn(LINK_CLASSES, "self-start")}>
                    Voir le plan Essentiel
                  </Link>
                </div>
              </section>
            ) : null}

            <div className="flex flex-col gap-5">
              <RequestStatusFilter
                key={filterValue}
                action={REQUESTS_SECTION_HREF}
                value={filterValue}
                options={filters.map((filter) => ({ value: filter.value, label: `${filter.label} (${filter.count})` }))}
              />
              <nav aria-label="Statut des demandes" className="hidden items-center gap-3 desktop:flex">
                <span aria-hidden="true" className="text-small font-semibold">
                  Statut
                </span>
                <ul className="flex flex-wrap gap-3">
                  {filters.map((filter) => {
                    const isSelected = filter.value === filterValue;
                    return (
                      <li key={filter.value}>
                        <Link
                          href={filterHref(filter.value)}
                          aria-current={isSelected ? "page" : undefined}
                          className={cn(
                            CHIP_CLASSES,
                            isSelected
                              ? "border-ink-900 bg-paper-100 font-semibold"
                              : "border-hairline-200 bg-white hover:border-gray-400",
                          )}
                        >
                          {`${filter.label} (${filter.count})`}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {list.total === 0 ? (
                <div className="flex flex-col items-start gap-2 border-t border-ink-900 pt-5">
                  <p className="text-body">Aucune demande avec ce statut.</p>
                  <Link href={REQUESTS_SECTION_HREF} className={LINK_CLASSES}>
                    Voir toutes les demandes
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col border-t border-ink-900">
                  {list.requests.map((request) => (
                    <li
                      key={request.id}
                      className="flex items-start gap-4 border-b border-hairline-200 py-4 desktop:items-center desktop:gap-5"
                    >
                      <SpaceAvatar name={request.customerName} logoUrl={null} size={44} background="paper" />
                      <div className="flex min-w-[0] flex-1 flex-col gap-3 desktop:flex-row desktop:items-center desktop:gap-5">
                        <div className="flex min-w-[0] flex-1 flex-col gap-1">
                          <p className="text-body">
                            <strong className="font-semibold">{request.customerName}</strong>
                            {` · ${request.productName}`}
                          </p>
                          <p className={cn("text-small", request.status === "failed" ? "text-error" : "text-slate-600")}>
                            {describeRequest(request, { now, heldUntil })}
                          </p>
                        </div>
                        <span className="shrink-0 desktop:w-[160px]">
                          <ToneBadge {...REQUEST_BADGES[request.status]} />
                        </span>
                        <div className="shrink-0 empty:hidden desktop:flex desktop:w-[280px] desktop:justify-end desktop:empty:flex">
                          <RequestActions
                            requestId={request.id}
                            status={request.status}
                            hasPendingReminder={request.reminderScheduledAt !== null && request.reminderSentAt === null}
                            canSendNow={heldUntil === null}
                            customerName={request.customerName}
                            customerEmail={request.customerEmail}
                            productName={request.productName}
                            testimonialHref={
                              request.testimonialId ? `${TESTIMONIALS_SECTION_HREF}/${request.testimonialId}` : null
                            }
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {remaining > 0 ? (
                <div className="flex flex-col gap-3">
                  {status ? (
                    <p className="text-small text-slate-600">
                      {`Et ${remaining} ${remaining > 1 ? `autres demandes ${STATUS_WORDS[status][1]}` : `autre demande ${STATUS_WORDS[status][0]}`}.`}
                    </p>
                  ) : null}
                  <Link
                    href={filterHref(filterValue, list.requests.length + nextCount)}
                    scroll={false}
                    className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto desktop:self-start")}
                  >
                    {nextCount > 1 ? `Afficher les ${nextCount} suivantes` : "Afficher la suivante"}
                  </Link>
                </div>
              ) : null}
            </div>
          </>
        )}
      </SpacePage>
    </>
  );
};

export default RequestsPage;
