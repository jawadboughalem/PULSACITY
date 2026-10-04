import { INTEGRATIONS, findIntegration } from "@/content/integrations";
import { SOCIAL_IMAGE_SIZE, SOCIAL_IMAGE_TYPE, renderSocialImage } from "@/lib/seo/render-social-image";

export const alt = "Témoignages automatiques, connecteur PULSACITY";

export const size = SOCIAL_IMAGE_SIZE;

export const contentType = SOCIAL_IMAGE_TYPE;

export const generateStaticParams = () => INTEGRATIONS.map((integration) => ({ connector: integration.slug }));

const SocialImage = async ({ params }: { params: Promise<{ connector: string }> }) =>
  renderSocialImage(findIntegration((await params).connector)?.heading ?? "Intégrations");

export default SocialImage;
