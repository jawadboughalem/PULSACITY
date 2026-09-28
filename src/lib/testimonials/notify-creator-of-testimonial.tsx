import { NewTestimonialEmail, buildNewTestimonialSubject } from "@/emails/NewTestimonialEmail";
import { getAppUrl } from "@/lib/app-url";
import { sendAccountEmail } from "@/lib/email/send-email";
import { SPACE_HOME_PATH } from "@/lib/spaces/space-paths";
import { getFirstName } from "./format-customer-name";
import type { NewTestimonialNotification } from "./submit-testimonial";

export const notifyCreatorOfTestimonial = async ({
  creatorEmail,
  ...testimonial
}: NewTestimonialNotification): Promise<void> => {
  await sendAccountEmail({
    to: creatorEmail,
    subject: buildNewTestimonialSubject(getFirstName(testimonial.authorName), testimonial.rating),
    body: <NewTestimonialEmail {...testimonial} spaceUrl={`${getAppUrl()}${SPACE_HOME_PATH}`} />,
  });
};
