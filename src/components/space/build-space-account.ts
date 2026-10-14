import { getPlan } from "@/config/plans";
import type { SignedInUser } from "@/lib/auth/get-signed-in-user";
import type { OwnedSpace } from "@/lib/spaces/find-owned-space";
import type { SpaceAccount } from "./SpaceAccount";

/** The account button shows the space (3.3: « Julie Nutrition », its logo), even once the creator gives a first name. */
export const buildSpaceAccount = (signedInUser: SignedInUser, space: OwnedSpace): SpaceAccount => ({
  name: space.name,
  email: signedInUser.email,
  planName: getPlan(space.plan).name,
  logoUrl: space.logoUrl,
});
