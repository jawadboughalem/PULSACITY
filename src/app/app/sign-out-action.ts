"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth/get-auth";
import { SIGN_IN_PATH } from "@/lib/auth/require-signed-in-user";

export const signOut = async (): Promise<void> => {
  await getAuth().api.signOut({ headers: await headers() });
  redirect(SIGN_IN_PATH);
};
