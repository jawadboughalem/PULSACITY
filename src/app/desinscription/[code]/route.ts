import { unsubscribeFromLink, unsubscribeInOneClick } from "@/lib/requests/unsubscribe-responses";

type Context = { params: Promise<{ code: string }> };

/**
 * Maquettes 3.6, « Version texte » : the address a customer sees carries no technical word, /desinscription/{code}.
 * The same one click as before, and the mail client's own button.
 */
export const GET = async (_request: Request, { params }: Context): Promise<Response> =>
  unsubscribeFromLink((await params).code);

export const POST = async (_request: Request, { params }: Context): Promise<Response> =>
  unsubscribeInOneClick((await params).code);
