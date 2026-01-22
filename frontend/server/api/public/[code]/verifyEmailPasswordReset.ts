import { z } from "zod";

const bodySchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  email: z.string().email(),
  passwordConfirmed: z.string().min(1).optional(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);
  const config = useRuntimeConfig();
  const code = getQuery(event).code as string;

  // Docker networking logic: Use internal alias 'backend' if available
  const apiBase = config.apiSecret || config.public.apiBase;
  const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;

  // Define endpoints
  const VERIFY_EMAIL_PASSWORD_RESET_ENDPOINT = `${base}/v1/auth/verify_email_password/${code}`;

  try {
    // --- Step 1: Sign Up ---
    await $fetch(
      VERIFY_EMAIL_PASSWORD_RESET_ENDPOINT,
      {
        method: "POST",
        body: body,
        headers: { "Content-Type": "application/json" },
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Password Reset Process Failed:", error);

    // Check if it was the login or the profile fetch that failed
    const message =
      error.statusCode === 404
        ? "User profile endpoint not found"
        : "Invalid credentials or server error";

    throw createError({
      statusCode: 401,
      statusMessage: message,
    });
  }
});
