import { redirect } from "next/navigation";
import { type SignedInUser, getSignedInUser } from "./get-signed-in-user";

export const SIGN_IN_PATH = "/connexion";

export const requireSignedInUser = async (): Promise<SignedInUser> => {
  const signedInUser = await getSignedInUser();
  if (!signedInUser) redirect(SIGN_IN_PATH);
  return signedInUser;
};
