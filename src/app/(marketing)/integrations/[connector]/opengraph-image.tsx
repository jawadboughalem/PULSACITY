import { INTEGRATIONS, findIntegration } from "@/content/integrations";
import { SOCIAL_IMAGE_SIZE, SOCIAL_IMAGE_TYPE, renderSocialImage } from "@/lib/seo/render-social-image";

export const alt = "Témoignages automatiques, connecteur PULSACITY";

export const size = SOCIAL_IMAGE_SIZE;

export const contentType = SOCIAL_IMAGE_TYPE;

export const generateStaticParams = () => INTEGRATIONS.map((integration) => ({ connector: integration.slug }));

const SocialImage = async ({ params }: { params: Promise<{ connector: string }> }) => {
  const integration = findIntegration((await params).connector);
  return integration
    ? renderSocialImage(integration.heading, { kind: "tool", name: integration.name })
    : renderSocialImage("Intégrations");
};

export default SocialImage;
