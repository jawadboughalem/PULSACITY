export const REQUEST_TOKEN_PARAMETER = "r";

export const readRequestToken = (searchParams: Record<string, string | string[] | undefined>): string | null => {
  const value = searchParams[REQUEST_TOKEN_PARAMETER];
  const token = Array.isArray(value) ? value[0] : value;
  return token?.trim() || null;
};
