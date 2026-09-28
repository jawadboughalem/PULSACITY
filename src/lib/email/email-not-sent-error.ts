export class EmailNotSentError extends Error {
  readonly providerCode: string;
  readonly providerMessage: string;

  constructor(providerCode: string, providerMessage: string) {
    super(`The e-mail provider refused the message (${providerCode}): ${providerMessage}`);
    this.name = "EmailNotSentError";
    this.providerCode = providerCode;
    this.providerMessage = providerMessage;
  }
}
