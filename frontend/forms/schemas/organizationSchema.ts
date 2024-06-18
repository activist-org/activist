import { z } from "zod";

export const organizationSchema = z.object({
    name: z.string().min(1, "Name must have at least 1 character").max(55, "Name must be less than 55 characters"),
    location: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
    tagline: z.string().max(100).optional(),
    social_accounts: z.array(z.string()).optional(),
    topics: z.array(z.string()).min(1).optional(),
  });
