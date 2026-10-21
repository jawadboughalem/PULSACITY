import { expandSignInLink } from "@/lib/auth/sign-in-link";

type Context = { params: Promise<{ code: string }> };

/** « Accéder à mon espace » (« Votre lien », maquettes 3.6): Better Auth checks the link and opens the session. */
export const GET = async (request: Request, { params }: Context): Promise<Response> => {
  const url = new URL(request.url);
  return Response.redirect(expandSignInLink(url.origin, (await params).code, url.search), 307);
};
