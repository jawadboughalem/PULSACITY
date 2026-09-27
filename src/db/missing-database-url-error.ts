export class MissingDatabaseUrlError extends Error {
  constructor() {
    super("DATABASE_URL is not set; the expected variables are listed in .env.example.");
    this.name = "MissingDatabaseUrlError";
  }
}
