import { SOCIAL_IMAGE_SIZE, SOCIAL_IMAGE_TYPE, renderSocialImage } from "@/lib/seo/render-social-image";

export const alt = "Conditions générales d'utilisation de PULSACITY";

export const size = SOCIAL_IMAGE_SIZE;

export const contentType = SOCIAL_IMAGE_TYPE;

const SocialImage = () => renderSocialImage("Conditions générales d'utilisation");

export default SocialImage;
