import { GUIDES, findGuide } from "@/content/guides";
import { SOCIAL_IMAGE_SIZE, SOCIAL_IMAGE_TYPE, renderSocialImage } from "@/lib/seo/render-social-image";

export const alt = "Guide PULSACITY";

export const size = SOCIAL_IMAGE_SIZE;

export const contentType = SOCIAL_IMAGE_TYPE;

export const generateStaticParams = () => GUIDES.map((guide) => ({ slug: guide.slug }));

const SocialImage = async ({ params }: { params: Promise<{ slug: string }> }) =>
  renderSocialImage(findGuide((await params).slug)?.title ?? "Guides");

export default SocialImage;
