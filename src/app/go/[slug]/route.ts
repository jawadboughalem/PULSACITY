import { resolveShortLink } from "@/lib/acquisition/short-links";

/** A short link of the marketing plan (/go/linkedin): the home page, with the source of the visit in its address. */
export const GET = async (request: Request, { params }: RouteContext<"/go/[slug]">): Promise<Response> => {
  const { slug } = await params;
  return Response.redirect(new URL(resolveShortLink(slug), request.url), 307);
};
