import { AudienceMeasurement } from "@/components/analytics/AudienceMeasurement";
import { TextColumnPage } from "@/components/ui/TextColumnPage";

const AuthLayout = ({ children }: LayoutProps<"/">) => (
  <>
    <TextColumnPage>{children}</TextColumnPage>
    <AudienceMeasurement />
  </>
);

export default AuthLayout;
