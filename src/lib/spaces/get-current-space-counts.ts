import { cache } from "react";
import { getDb } from "@/db";
import { countSpaceTestimonials } from "./count-space-testimonials";

export const getCurrentSpaceCounts = cache((spaceId: string) => countSpaceTestimonials(getDb(), spaceId));
