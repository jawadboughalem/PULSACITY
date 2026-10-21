/** « Gérer mon avis »: the step of the withdrawal in the address of the request's link, « ?r=…&retrait=confirmer ». */
export const WITHDRAWAL_PARAMETER = "retrait";

export const WITHDRAWAL_STEPS = { confirm: "confirmer", done: "fait" } as const;

export type WithdrawalStep = (typeof WITHDRAWAL_STEPS)[keyof typeof WITHDRAWAL_STEPS];

export const readWithdrawalStep = (
  searchParams: Record<string, string | string[] | undefined>,
): WithdrawalStep | null => {
  const value = searchParams[WITHDRAWAL_PARAMETER];
  const step = Array.isArray(value) ? value[0] : value;
  return step === WITHDRAWAL_STEPS.confirm || step === WITHDRAWAL_STEPS.done ? step : null;
};
