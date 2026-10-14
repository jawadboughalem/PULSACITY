"use client";

import Form from "next/form";
import { useRef } from "react";
import { FIELD_LABEL_CLASSES } from "@/components/ui/field-styles";
import { SelectControl } from "@/components/ui/SelectControl";
import { REQUEST_STATUS_PARAMETER } from "./describe-request";

type RequestStatusFilterProps = {
  action: string;
  value: string;
  /** « Toutes (55) », « Planifiées (12) »… */
  options: { value: string; label: string }[];
};

/** m19 on a phone: the status under its label, applied as soon as it is chosen. The chips take over on a desktop. */
export const RequestStatusFilter = ({ action, value, options }: RequestStatusFilterProps) => {
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
      className="flex flex-col gap-2 desktop:hidden"
    >
      <label htmlFor="request-status" className={FIELD_LABEL_CLASSES}>
        Statut
      </label>
      <SelectControl
        id="request-status"
        name={REQUEST_STATUS_PARAMETER}
        defaultValue={value}
        onChange={() => formRef.current?.requestSubmit()}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectControl>
    </Form>
  );
};
