import { PROMISE, SOCIAL_IMAGE_SIZE, SOCIAL_IMAGE_TYPE, renderSocialImage } from "@/lib/seo/render-social-image";

export const alt = "PULSACITY : vos ventes deviennent des témoignages, automatiquement.";

export const size = SOCIAL_IMAGE_SIZE;

export const contentType = SOCIAL_IMAGE_TYPE;

const SocialImage = () => renderSocialImage(PROMISE);

export default SocialImage;
