import { getPlan } from "@/config/plans";
import type { SignedInUser } from "@/lib/auth/get-signed-in-user";
import type { OwnedSpace } from "@/lib/spaces/find-owned-space";
import type { SpaceAccount } from "./SpaceAccount";

export const buildSpaceAccount = (signedInUser: SignedInUser, space: OwnedSpace): SpaceAccount => ({
  name: signedInUser.name || space.name,
  detail: signedInUser.name ? space.name : signedInUser.email,
  email: signedInUser.email,
  planName: getPlan(space.plan).name,
  logoUrl: signedInUser.name ? null : space.logoUrl,
});
