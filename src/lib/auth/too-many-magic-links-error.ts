import { APIError } from "better-auth/api";

export class TooManyMagicLinksError extends APIError {
  constructor() {
    super("TOO_MANY_REQUESTS", { message: "Too many magic links were requested for this address." });
    this.name = "TooManyMagicLinksError";
  }
}
