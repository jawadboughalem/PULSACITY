const UNIQUE_VIOLATION = "23505";

/** Postgres refused a value already taken (a unique constraint), whichever driver or wrapper raised it. */
export const isUniqueViolation = (error: unknown): boolean => {
  let current: unknown = error;
  for (let depth = 0; depth < 5 && current instanceof Object; depth += 1) {
    if ("code" in current && current.code === UNIQUE_VIOLATION) return true;
    current = "cause" in current ? current.cause : undefined;
  }
  return false;
};
