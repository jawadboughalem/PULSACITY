export class MissingEnvironmentVariableError extends Error {
  readonly variableName: string;

  constructor(variableName: string) {
    super(`${variableName} is not set; the expected variables are listed in .env.example.`);
    this.name = "MissingEnvironmentVariableError";
    this.variableName = variableName;
  }
}
