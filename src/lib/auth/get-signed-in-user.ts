import { headers } from "next/headers";
import { getAuth } from "./get-auth";

export type SignedInUser = {
  id: string;
  email: string;
};

export const getSignedInUser = async (): Promise<SignedInUser | null> => {
  const requestHeaders = await headers();
  const signedIn = await getAuth().api.getSession({ headers: requestHeaders });
  if (!signedIn) return null;
  return { id: signedIn.user.id, email: signedIn.user.email };
};
