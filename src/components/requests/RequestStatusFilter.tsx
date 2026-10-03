"use client";

import Form from "next/form";
import { useRef } from "react";
import { FilterSelect } from "@/components/testimonials/FilterSelect";
import { REQUEST_STATUS_FILTERS } from "./describe-request";

export const REQUEST_STATUS_PARAMETER = "statut";

type RequestStatusFilterProps = {
  action: string;
  value: string;
};

/** The status of the list, applied as soon as it is chosen. */
export const RequestStatusFilter = ({ action, value }: RequestStatusFilterProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Form
      ref={formRef}
      action={action}
      onSubmit={(event) => {
        const select = event.currentTarget.elements.namedItem(REQUEST_STATUS_PARAMETER);
        if (!(select instanceof HTMLSelectElement) || select.value !== "") return;
        select.disabled = true;
        window.setTimeout(() => {
          select.disabled = false;
        });
      }}
      className="flex"
    >
      <FilterSelect
        name={REQUEST_STATUS_PARAMETER}
        label="Statut"
        value={value}
        onChange={() => formRef.current?.requestSubmit()}
        options={[{ value: "", label: "Toutes" }, ...REQUEST_STATUS_FILTERS.map(({ value: option, label }) => ({ value: option, label }))]}
      />
    </Form>
  );
};
