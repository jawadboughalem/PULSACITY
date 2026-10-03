import type { Metadata } from "next";
import Link from "next/link";
import { Figure } from "@/components/dashboard/DashboardFigures";
import { formatResponseRate, pluralize } from "@/components/dashboard/format-figures";
import {
  REQUEST_BADGES,
  REQUEST_STATUS_FILTERS,
  describeRequest,
  readRequestStatusFilter,
} from "@/components/requests/describe-request";
import { RequestActions } from "@/components/requests/RequestActions";
import { REQUEST_STATUS_PARAMETER, RequestStatusFilter } from "@/components/requests/RequestStatusFilter";
import { MobilePageHeader } from "@/components/space/MobilePageHeader";
import { SpacePage } from "@/components/space/SpacePage";
import { BILLING_HREF, REQUESTS_SECTION_HREF, SYSTEME_CONNECTOR_HREF } from "@/components/space/space-sections";
import { TestimonialPagination } from "@/components/testimonials/TestimonialPagination";
import { DISCREET_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { canSendRequest, getPlan } from "@/config/plans";
import { getDb } from "@/db";
import { cn } from "@/lib/cn";
import { formatDayMonthYear } from "@/lib/dates/format-french-date";
import { startOfParisMonth } from "@/lib/dates/paris-date";
import { REQUESTS_PAGE_SIZE, countSpaceRequests, listSpaceRequests } from "@/lib/requests/list-space-requests";
import { countRequestsSentThisMonth } from "@/lib/requests/send-review-emails";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";

export const metadata: Metadata = {
  title: "Demandes · PULSACITY",
};

const readPage = (value: string | string[] | undefined): number => {
  const page = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(page) && page > 1 ? page : 1;
};

/** The first day of next month in Paris, for « les suivantes partiront le 1er novembre ». */
const startOfNextMonth = (now: Date): Date => startOfParisMonth(new Date(startOfParisMonth(now).getTime() + 32 * 24 * 60 * 60 * 1000));

/** The requests of the space: planned, sent, reminded, answered, with the response rate. */
const RequestsPage = async ({ searchParams }: PageProps<"/app/demandes">) => {
  const { space } = await getCurrentSpace();
  const search = await searchParams;
  const status = readRequestStatusFilter(search[REQUEST_STATUS_PARAMETER]);
  const page = readPage(search.page);
  const database = getDb();
  const now = new Date();
  const [counts, list, sentThisMonth] = await Promise.all([
    countSpaceRequests(database, space.id),
    listSpaceRequests(database, space.id, { status, page }),
    countRequestsSentThisMonth(database, space.id, now),
  ]);
  const plan = getPlan(space.plan);
  const isPlanLimitReached = !canSendRequest(space, sentThisMonth);
  const filterValue = REQUEST_STATUS_FILTERS.find((filter) => filter.status === status)?.value ?? "";
  const pageCount = Math.max(1, Math.ceil(list.total / REQUESTS_PAGE_SIZE));
  const pageHref = (target: number) => {
    const parameters = new URLSearchParams();
    if (filterValue) parameters.set(REQUEST_STATUS_PARAMETER, filterValue);
    if (target > 1) parameters.set("page", String(target));
    const query = parameters.toString();
    return `${REQUESTS_SECTION_HREF}${query ? `?${query}` : ""}`;
  };

  return (
    <>
      <MobilePageHeader title="Demandes" />
      <SpacePage>
        <header className="flex flex-col gap-2">
          <h1 className="hidden font-serif text-h1 font-medium desktop:block">Demandes</h1>
          <p className="max-w-text text-small text-slate-600 desktop:text-body">
            Les demandes d&apos;avis envoyées à vos clients après chaque vente, avec une seule relance.
          </p>
        </header>

        {isPlanLimitReached && plan.limits.monthlyRequests !== null ? (
          <section role="status" className="flex items-start gap-3 bg-paper-100 p-5 desktop:gap-4 desktop:p-6">
            <Icon name="info" size={24} className="shrink-0" />
            <div className="flex flex-col gap-2">
              <h2 className="text-body font-semibold">
                {`Vous avez envoyé ${plan.limits.monthlyRequests} demandes ce mois, le maximum du plan ${plan.name}.`}
              </h2>
              <p className="text-small">
                {`Rien n'est perdu : les suivantes partiront le ${formatDayMonthYear(startOfNextMonth(now))}. Avec le plan Essentiel, elles partent sans attendre.`}
              </p>
              <Link href={BILLING_HREF} className={cn(SECONDARY_BUTTON_CLASSES, "mt-3 self-start")}>
                Voir le plan Essentiel
              </Link>
            </div>
          </section>
        ) : null}

        {counts.all === 0 ? (
          <section className="flex flex-col gap-4 bg-paper-100 p-5 desktop:p-7">
            <h2 className="font-serif text-h2 font-medium">Pas encore de demande</h2>
            <p className="max-w-text text-body">
              Une demande part toute seule après chaque vente, au délai choisi pour l&apos;offre. Connectez Systeme.io pour
              commencer.
            </p>
            <Link href={SYSTEME_CONNECTOR_HREF} className={cn(SECONDARY_BUTTON_CLASSES, "self-start")}>
              Connecter Systeme.io
            </Link>
          </section>
        ) : (
          <>
            <section aria-label="Vos demandes" className="grid grid-cols-2 border-t border-ink-900 desktop:grid-cols-4 [&>*]:border-b">
              <Figure value={String(counts.scheduled)} className="pr-4 desktop:pr-5">
                {counts.scheduled > 1 ? "planifiées" : "planifiée"}
              </Figure>
              <Figure value={String(counts.sent)} className="border-l pl-4 desktop:px-5">
                {`${counts.sent > 1 ? "envoyées" : "envoyée"}, dont ${pluralize(counts.remindersSent, "relancée", "relancées")}`}
              </Figure>
              <Figure value={String(counts.completed)} className="pr-4 desktop:border-l desktop:px-5">
                {counts.completed > 1 ? "complétées par un avis" : "complétée par un avis"}
              </Figure>
              <Figure value={formatResponseRate(counts.answered, counts.sent)} className="border-l pl-4 desktop:px-5">
                taux de réponse
                {counts.sent > 0 ? (
                  <span className="hidden desktop:inline">{` · ${counts.answered} sur ${counts.sent} demandes envoyées`}</span>
                ) : null}
              </Figure>
            </section>

            <RequestStatusFilter key={filterValue} action={REQUESTS_SECTION_HREF} value={filterValue} />

            {list.total === 0 ? (
              <div className="flex flex-col items-start gap-2 border-t border-ink-900 pt-5">
                <p className="text-body">Aucune demande avec ce statut.</p>
                <Link href={REQUESTS_SECTION_HREF} className={DISCREET_BUTTON_CLASSES}>
                  Voir toutes les demandes
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex flex-col border-t border-ink-900">
                  {list.requests.map((request) => (
                    <li
                      key={request.id}
                      className="flex flex-col gap-3 border-b border-hairline-200 py-4 desktop:flex-row desktop:items-center desktop:gap-5"
                    >
                      <div className="flex min-w-[0] flex-1 flex-col gap-1">
                        <div className="flex items-start justify-between gap-3 desktop:justify-start">
                          <p className="min-w-[0] text-body">
                            <strong className="font-semibold">{request.customerName}</strong>
                            {` · ${request.productName}`}
                          </p>
                          <span className="desktop:hidden">
                            <ToneBadge {...REQUEST_BADGES[request.status]} />
                          </span>
                        </div>
                        <p className={cn("text-small", request.status === "failed" ? "text-error" : "text-slate-600")}>
                          {describeRequest(request, { now, isPlanLimitReached })}
                        </p>
                      </div>
                      <span className="hidden w-[128px] shrink-0 desktop:block">
                        <ToneBadge {...REQUEST_BADGES[request.status]} />
                      </span>
                      <div className="shrink-0 empty:hidden desktop:flex desktop:w-[304px] desktop:justify-end desktop:empty:flex">
                        <RequestActions
                          requestId={request.id}
                          status={request.status}
                          hasPendingReminder={request.reminderScheduledAt !== null && request.reminderSentAt === null}
                          customerName={request.customerName}
                          productName={request.productName}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
                <TestimonialPagination
                  page={Math.min(page, pageCount)}
                  pageSize={REQUESTS_PAGE_SIZE}
                  shownCount={list.requests.length}
                  total={list.total}
                  previousHref={page > 1 ? pageHref(page - 1) : null}
                  nextHref={page < pageCount ? pageHref(page + 1) : null}
                  noun={{ singular: "demande", plural: "demandes" }}
                />
              </>
            )}
          </>
        )}
      </SpacePage>
    </>
  );
};

export default RequestsPage;
