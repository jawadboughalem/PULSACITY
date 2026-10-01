"use client";

import Form from "next/form";
import { useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { RATINGS } from "@/lib/testimonials/testimonial-form-schema";
import {
  MAX_SEARCH_LENGTH,
  STATUS_SEARCH_VALUES,
  TESTIMONIAL_SEARCH_PARAMS,
  type TestimonialFilters,
  WITHOUT_PRODUCT,
  WITHOUT_PRODUCT_SEARCH_VALUE,
} from "@/lib/testimonials/testimonial-filters";
import { FilterSelect } from "./FilterSelect";

type TestimonialFiltersFormProps = {
  action: string;
  filters: TestimonialFilters;
  products: { id: string; name: string }[];
};

const STATUS_OPTIONS = [
  { value: "", label: "Tous" },
  { value: STATUS_SEARCH_VALUES.pending, label: "En attente" },
  { value: STATUS_SEARCH_VALUES.approved, label: "Validés" },
  { value: STATUS_SEARCH_VALUES.hidden, label: "Masqués" },
];

const RATING_OPTIONS = [
  { value: "", label: "Toutes" },
  ...[...RATINGS].reverse().map((rating) => ({
    value: String(rating),
    label: `${rating} ${rating === 1 ? "étoile" : "étoiles"}`,
  })),
];

export const TestimonialFiltersForm = ({ action, filters, products }: TestimonialFiltersFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const productOptions = [
    { value: "", label: "Toutes les offres" },
    ...products.map((product) => ({ value: product.id, label: product.name })),
    { value: WITHOUT_PRODUCT_SEARCH_VALUE, label: "Sans offre" },
  ];
  const submit = () => formRef.current?.requestSubmit();

  /** Leaves the empty filters out of the address. */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const fields = [...event.currentTarget.elements].filter(
      (element): element is HTMLInputElement | HTMLSelectElement =>
        (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) && element.name !== "",
    );
    const emptyFields = fields.filter((field) => field.value.trim() === "");
    for (const field of emptyFields) field.disabled = true;
    window.setTimeout(() => {
      for (const field of emptyFields) field.disabled = false;
    });
  };

  return (
    <Form
      ref={formRef}
      action={action}
      onSubmit={handleSubmit}
      role="search"
      aria-label="Filtrer les témoignages"
      className="flex flex-col gap-3 desktop:grid desktop:grid-cols-[minmax(0,1fr)_auto_auto_auto] desktop:items-end desktop:gap-4"
    >
      <label className="flex flex-col gap-2">
        <span className="text-small font-semibold max-desktop:sr-only">Rechercher</span>
        <span className="relative flex">
          <Icon name="search" size={20} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2" />
          <input
            type="search"
            name={TESTIMONIAL_SEARCH_PARAMS.query}
            defaultValue={filters.query ?? ""}
            maxLength={MAX_SEARCH_LENGTH}
            placeholder="Un prénom, un mot…"
            className="h-[48px] w-full rounded-sm border border-gray-400 bg-white pr-4 pl-7 text-body text-ink-900 placeholder:text-slate-600 focus:border-2 focus:border-ink-900 focus:pl-[47px] focus:outline-none"
          />
        </span>
      </label>
      <div className="flex flex-wrap gap-2 desktop:contents">
        <FilterSelect
          name={TESTIMONIAL_SEARCH_PARAMS.status}
          label="Statut"
          options={STATUS_OPTIONS}
          value={filters.status ? STATUS_SEARCH_VALUES[filters.status] : ""}
          onChange={submit}
        />
        <FilterSelect
          name={TESTIMONIAL_SEARCH_PARAMS.productId}
          label="Offre"
          options={productOptions}
          value={filters.productId === WITHOUT_PRODUCT ? WITHOUT_PRODUCT_SEARCH_VALUE : (filters.productId ?? "")}
          onChange={submit}
        />
        <FilterSelect
          name={TESTIMONIAL_SEARCH_PARAMS.rating}
          label="Note"
          options={RATING_OPTIONS}
          value={filters.rating ? String(filters.rating) : ""}
          onChange={submit}
        />
      </div>
      <button type="submit" className="sr-only">
        Filtrer
      </button>
    </Form>
  );
};
