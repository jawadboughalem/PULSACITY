import { getDb } from "@/db";
import { buildCollectionUrl } from "@/lib/app-url";
import { getSignedInUser } from "@/lib/auth/get-signed-in-user";
import { buildSpaceExport, buildSpaceExportFileName } from "@/lib/spaces/export-space-data";

/** Sent in pieces: a space with many testimonials never meets the size limit of a single response. */
const CHUNK_LENGTH = 64 * 1024;

const streamText = (text: string) => {
  const encoder = new TextEncoder();
  let position = 0;
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      if (position >= text.length) {
        controller.close();
        return;
      }
      controller.enqueue(encoder.encode(text.slice(position, position + CHUNK_LENGTH)));
      position += CHUNK_LENGTH;
    },
  });
};

/** Mon compte, « Préparer le fichier »: the data of the signed-in creator's space, and of no other, in one JSON file. */
export const GET = async (): Promise<Response> => {
  const signedInUser = await getSignedInUser();
  if (!signedInUser) return new Response("Connectez-vous pour exporter vos données.", { status: 401 });

  const now = new Date();
  const exported = await buildSpaceExport(getDb(), signedInUser.id, { now, buildCollectionUrl });
  if (!exported) return new Response("Aucun espace à exporter.", { status: 404 });

  const fileName = buildSpaceExportFileName(exported.spaceSlug, now);
  return new Response(streamText(`${JSON.stringify(exported.data, null, 2)}\n`), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
};
