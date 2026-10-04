import { SOCIAL_IMAGE_SIZE, SOCIAL_IMAGE_TYPE, renderSocialImage } from "@/lib/seo/render-social-image";

export const alt = "Tarifs de PULSACITY";

export const size = SOCIAL_IMAGE_SIZE;

export const contentType = SOCIAL_IMAGE_TYPE;

const SocialImage = () => renderSocialImage("Un prix simple, qui suit vos ventes.");

export default SocialImage;
