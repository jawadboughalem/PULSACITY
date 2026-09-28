type CustomerName = {
  firstName: string | null;
  lastName: string | null;
};

export const formatCustomerName = ({ firstName, lastName }: CustomerName): string => {
  const first = firstName?.trim() ?? "";
  const last = lastName?.trim() ?? "";
  if (first && last) return `${first} ${last.charAt(0).toUpperCase()}.`;
  return first || last;
};

export const getFirstName = (authorName: string): string => authorName.trim().split(/\s+/)[0] ?? "";
