import type { Metadata } from "next";
import { headers } from "next/headers";
import { AccountSettings } from "@/components/account/AccountSettings";
import type { ConnectedDevice } from "@/components/account/DevicesSection";
import { SettingsPageHeading } from "@/components/settings/SettingsSection";
import { buildSpaceAccount } from "@/components/space/build-space-account";
import { MobileBackLink } from "@/components/space/MobileBackLink";
import { SpaceMobileHeader } from "@/components/space/SpaceMobileHeader";
import { SpacePage } from "@/components/space/SpacePage";
import { describeDevice } from "@/lib/auth/describe-device";
import { getAuth } from "@/lib/auth/get-auth";
import { formatDayMonthYear } from "@/lib/dates/format-french-date";
import { NEW_LOGIN_ADDRESS_PARAMETER } from "@/lib/spaces/account-paths";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";

export const metadata: Metadata = {
  title: "Mon compte · PULSACITY",
};

type Session = { id: string; userAgent?: string | null; updatedAt: Date };

/** This device first, then the others from the most recently seen. */
const listDevices = (sessions: Session[], currentSessionId: string | null): ConnectedDevice[] =>
  sessions
    .map((session) => ({ session, isCurrent: session.id === currentSessionId }))
    .sort(
      (first, second) =>
        Number(second.isCurrent) - Number(first.isCurrent) ||
        new Date(second.session.updatedAt).getTime() - new Date(first.session.updatedAt).getTime(),
    )
    .map(({ session, isCurrent }) => ({
      id: session.id,
      ...describeDevice(session.userAgent ?? null),
      isCurrent,
      detail: isCurrent
        ? "Cet appareil · actif maintenant"
        : `Dernière visite le ${formatDayMonthYear(new Date(session.updatedAt))}`,
    }));

const AccountPage = async ({ searchParams }: PageProps<"/app/compte">) => {
  const { signedInUser, space } = await getCurrentSpace();
  const parameters = await searchParams;
  const requestHeaders = await headers();
  const auth = getAuth();
  const [current, sessions] = await Promise.all([
    auth.api.getSession({ headers: requestHeaders }),
    auth.api.listSessions({ headers: requestHeaders }),
  ]);

  return (
    <>
      <SpaceMobileHeader account={buildSpaceAccount(signedInUser, space)} />
      <SpacePage className="desktop:gap-8">
        <div className="flex flex-col gap-4">
          <MobileBackLink />
          <SettingsPageHeading
            title="Mon compte"
            lead="Ce qui vous concerne, vous : votre adresse de connexion, vos appareils, vos données."
          />
        </div>
        <AccountSettings
          email={signedInUser.email}
          firstName={signedInUser.name}
          spaceName={space.name}
          devices={listDevices(sessions, current?.session.id ?? null)}
          hasNewLoginEmail={parameters[NEW_LOGIN_ADDRESS_PARAMETER] !== undefined && parameters.error === undefined}
          hasExpiredLink={parameters.error !== undefined}
        />
      </SpacePage>
    </>
  );
};

export default AccountPage;
