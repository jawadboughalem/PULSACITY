import { redirect } from "next/navigation";
import { SPACE_HOME_PATH } from "@/lib/spaces/space-paths";
import { getSignedInUser } from "./get-signed-in-user";

export const redirectSignedInUser = async (): Promise<void> => {
  if (await getSignedInUser()) redirect(SPACE_HOME_PATH);
};
