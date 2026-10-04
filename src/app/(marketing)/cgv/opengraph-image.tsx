import { SOCIAL_IMAGE_SIZE, SOCIAL_IMAGE_TYPE, renderSocialImage } from "@/lib/seo/render-social-image";

export const alt = "Conditions générales de vente de PULSACITY";

export const size = SOCIAL_IMAGE_SIZE;

export const contentType = SOCIAL_IMAGE_TYPE;

const SocialImage = () => renderSocialImage("Conditions générales de vente");

export default SocialImage;
