import emailjs from "@emailjs/browser";

interface SignupEmailPayload {
  name: string;
  email: string;
}

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

function canSendEmail() {
  return Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
}

export async function sendSignupEmail(payload: SignupEmailPayload) {
  if (!canSendEmail()) {
    console.warn("EmailJS env vars missing; skipping welcome email.");
    return;
  }

  try {
    await emailjs.send(
      SERVICE_ID!,
      TEMPLATE_ID!,
      {
        user_name: payload.name || "Traveler",
        user_email: payload.email,
      },
      PUBLIC_KEY!
    );
  } catch (err) {
    console.error("Failed to send signup email", err);
  }
}
