/** A sale or an enrollment the connector recognises, but cannot read: the event is put aside, not lost. */
export class InvalidPayloadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPayloadError";
  }
}
