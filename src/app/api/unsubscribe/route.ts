import { unsubscribeFromLink, unsubscribeInOneClick } from "@/lib/requests/unsubscribe-responses";
import { UNSUBSCRIBE_TOKEN_PARAMETER } from "@/lib/requests/unsubscribe-token";

const readToken = (request: Request) => new URL(request.url).searchParams.get(UNSUBSCRIBE_TOKEN_PARAMETER);

/** The link of the e-mails sent before lot 4.8: they keep working. Since, /desinscription/{code}. */
export const GET = (request: Request): Promise<Response> => unsubscribeFromLink(readToken(request));

export const POST = (request: Request): Promise<Response> => unsubscribeInOneClick(readToken(request));
