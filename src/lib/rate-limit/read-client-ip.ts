const UNKNOWN_CLIENT_IP = "unknown";

export const readClientIp = (requestHeaders: Headers): string => {
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwardedFor) return forwardedFor;
  return requestHeaders.get("x-real-ip")?.trim() || UNKNOWN_CLIENT_IP;
};
