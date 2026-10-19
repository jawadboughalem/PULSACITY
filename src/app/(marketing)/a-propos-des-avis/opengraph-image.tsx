import { SOCIAL_IMAGE_SIZE, SOCIAL_IMAGE_TYPE, renderSocialImage } from "@/lib/seo/render-social-image";

export const alt = "À propos de ces avis";

export const size = SOCIAL_IMAGE_SIZE;

export const contentType = SOCIAL_IMAGE_TYPE;

const SocialImage = () => renderSocialImage("À propos de ces avis");

export default SocialImage;
