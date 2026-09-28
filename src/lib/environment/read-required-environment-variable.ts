import { MissingEnvironmentVariableError } from "./missing-environment-variable-error";

export const readRequiredEnvironmentVariable = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new MissingEnvironmentVariableError(name);
  return value;
};
