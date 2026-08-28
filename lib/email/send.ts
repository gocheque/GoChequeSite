import { DEFAULT_FROM_EMAIL } from "@/lib/email/brand";

export function isTransactionalEmailConfigured(): boolean {
  const key = process.env.RESEND_API_KEY?.trim();
  return Boolean(key && key.startsWith("re_"));
}

export function getEmailFromAddress(): string {
  const configured = process.env.EMAIL_FROM?.trim();
  return configured || DEFAULT_FROM_EMAIL;
}

export async function sendTransactionalEmail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ sent: boolean; skipped?: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey || !apiKey.startsWith("re_")) {
    console.warn(
      "[email] RESEND_API_KEY missing — transactional email skipped:",
      options.subject,
    );
    return { sent: false, skipped: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getEmailFromAddress(),
      to: [options.to],
      subject: options.subject,
      html: options.html,
    }),
  });

  const body = (await response.json().catch(() => ({}))) as {
    id?: string;
    message?: string;
  };

  if (!response.ok) {
    throw new Error(body.message || `RESEND_${response.status}`);
  }

  return { sent: true, id: body.id };
}
