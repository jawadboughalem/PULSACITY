import type { Metadata } from "next";
import Link from "next/link";
import { MobilePageHeader } from "@/components/space/MobilePageHeader";
import { SpacePage } from "@/components/space/SpacePage";
import { ADD_TESTIMONIAL_HREF, TESTIMONIALS_SECTION_HREF } from "@/components/space/space-sections";
import { FirstApprovalCelebration } from "@/components/testimonials/FirstApprovalCelebration";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { TestimonialFiltersForm } from "@/components/testimonials/TestimonialFiltersForm";
import { TestimonialPagination } from "@/components/testimonials/TestimonialPagination";
import { TestimonialsEmptyState } from "@/components/testimonials/TestimonialsEmptyState";
import { TestimonialTableRow } from "@/components/testimonials/TestimonialTableRow";
import { DISCREET_BUTTON_CLASSES, ICON_BUTTON_CLASSES, PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { canAddTestimonial } from "@/config/plans";
import { getDb } from "@/db";
import { buildCollectionUrl } from "@/lib/app-url";
import { cn } from "@/lib/cn";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { listSpaceProducts } from "@/lib/spaces/list-space-products";
import {
  TESTIMONIALS_PAGE_SIZE,
  countTestimonialsByStatus,
  listSpaceTestimonials,
} from "@/lib/testimonials/list-space-testimonials";
import {
  buildTestimonialSearch,
  hasTestimonialFilter,
  readTestimonialFilters,
  readTestimonialPage,
} from "@/lib/testimonials/testimonial-filters";

export const metadata: Metadata = {
  title: "Témoignages · PULSACITY",
};

/** Charte v2, Tableau: the widths of the v1 columns, widened where the v2 controls need room (stars 18, badge). */
const TABLE_COLUMNS = [
  { heading: "Client", width: "w-[208px]" },
  { heading: "Témoignage", width: "" },
  { heading: "Note", width: "w-[106px]" },
  { heading: "Offre", width: "w-[128px]" },
  { heading: "Statut", width: "w-[128px]" },
  { heading: "En avant", width: "w-[80px]" },
];

const describeCounts = (counts: { approved: number; pending: number; hidden: number }) =>
  [
    `${counts.approved} ${counts.approved > 1 ? "validés" : "validé"}`,
    `${counts.pending} en attente`,
    `${counts.hidden} ${counts.hidden > 1 ? "masqués" : "masqué"}`,
  ].join(" · ");

const TestimonialsPage = async ({ searchParams }: PageProps<"/app/temoignages">) => {
  const { space } = await getCurrentSpace();
  const search = await searchParams;
  const filters = readTestimonialFilters(search);
  const page = readTestimonialPage(search);
  const database = getDb();
  const [counts, products, list] = await Promise.all([
    countTestimonialsByStatus(database, space.id),
    listSpaceProducts(database, space.id),
    listSpaceTestimonials(database, space.id, filters, page),
  ]);
  const isApprovalAllowed = canAddTestimonial(space, counts.approved);
  const shownPage = Math.min(page, list.pageCount);
  const pageHref = (target: number) => `${TESTIMONIALS_SECTION_HREF}${buildTestimonialSearch(filters, target)}`;
  const detailHref = (id: string) => `${TESTIMONIALS_SECTION_HREF}/${id}`;

  return (
    <>
      <MobilePageHeader
        title="Témoignages"
        action={
          <Link
            href={ADD_TESTIMONIAL_HREF}
            aria-label="Ajouter un témoignage"
            className={cn(ICON_BUTTON_CLASSES, "border-2 border-ink bg-white")}
          >
            <Icon name="plus" size={24} />
          </Link>
        }
      />
      <SpacePage>
        <FirstApprovalCelebration>
          <div className="flex flex-col gap-6 desktop:gap-8">
            <header className="flex items-start justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="hidden font-display text-h1 desktop:block">Témoignages</h1>
                <p className="text-small text-gray desktop:text-body">{describeCounts(counts)}</p>
              </div>
              <Link href={ADD_TESTIMONIAL_HREF} className={cn(PRIMARY_BUTTON_CLASSES, "hidden shrink-0 desktop:inline-flex")}>
                Ajouter un témoignage
              </Link>
            </header>
            {counts.all === 0 ? (
              <TestimonialsEmptyState collectionUrl={buildCollectionUrl(space.slug)} />
            ) : (
              <>
                <TestimonialFiltersForm
                  key={buildTestimonialSearch(filters)}
                  action={TESTIMONIALS_SECTION_HREF}
                  filters={filters}
                  products={products}
                />
                {list.total === 0 ? (
                  <div className="flex flex-col items-start gap-2">
                    <p className="text-body">Aucun témoignage ne correspond à ces filtres.</p>
                    {hasTestimonialFilter(filters) ? (
                      <Link href={TESTIMONIALS_SECTION_HREF} className={DISCREET_BUTTON_CLASSES}>
                        Effacer les filtres
                      </Link>
                    ) : null}
                  </div>
                ) : (
                  <>
                    <div className="hidden overflow-x-auto rounded-card bg-white p-2 desktop:block">
                      <table className="w-full min-w-[1000px] table-fixed border-separate border-spacing-[0] text-left">
                        <thead>
                          <tr>
                            {TABLE_COLUMNS.map((column) => (
                              <th
                                key={column.heading}
                                scope="col"
                                className={cn(
                                  "h-[48px] bg-sky pr-4 text-small font-bold whitespace-nowrap first:rounded-l-field first:pl-4",
                                  column.width,
                                )}
                              >
                                {column.heading}
                              </th>
                            ))}
                            <th scope="col" className="h-[48px] w-[252px] rounded-r-field bg-sky">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {list.testimonials.map((testimonial) => (
                            <TestimonialTableRow
                              key={testimonial.id}
                              testimonial={testimonial}
                              detailHref={detailHref(testimonial.id)}
                              isApprovalAllowed={isApprovalAllowed}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex flex-col gap-3 desktop:hidden">
                      {list.testimonials.map((testimonial) => (
                        <TestimonialCard
                          key={testimonial.id}
                          testimonial={testimonial}
                          variant="list"
                          detailHref={detailHref(testimonial.id)}
                          isApprovalAllowed={isApprovalAllowed}
                        />
                      ))}
                    </div>
                    <TestimonialPagination
                      page={shownPage}
                      pageSize={TESTIMONIALS_PAGE_SIZE}
                      shownCount={list.testimonials.length}
                      total={list.total}
                      previousHref={shownPage > 1 ? pageHref(shownPage - 1) : null}
                      nextHref={shownPage < list.pageCount ? pageHref(shownPage + 1) : null}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </FirstApprovalCelebration>
      </SpacePage>
    </>
  );
};

export default TestimonialsPage;
