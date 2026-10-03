"use client";

import Form from "next/form";
import { useRef } from "react";
import { Icon } from "@/components/ui/Icon";
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
      <label htmlFor="request-status" className="text-small font-semibold">
        Statut
      </label>
      <span className="relative flex">
        <select
          id="request-status"
          name={REQUEST_STATUS_PARAMETER}
          defaultValue={value}
          onChange={() => formRef.current?.requestSubmit()}
          className="h-[48px] w-full appearance-none rounded-sm border border-gray-400 bg-white pr-7 pl-4 text-body text-ink-900 focus:border-2 focus:border-ink-900 focus:pl-[15px] focus:outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon name="chevronDown" size={20} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2" />
      </span>
    </Form>
  );
};
