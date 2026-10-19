import { AudienceMeasurement } from "@/components/analytics/AudienceMeasurement";
import { AuthCardPage } from "@/components/auth/AuthCardPage";

const AuthLayout = ({ children }: LayoutProps<"/">) => (
  <>
    <AuthCardPage>{children}</AuthCardPage>
    <AudienceMeasurement />
  </>
);

export default AuthLayout;
