import nodemailer from "nodemailer";

/**
 * Sends a transactional email via Gmail SMTP (App Password, not the account
 * password). Simplest start; swap for Resend/Postmark when you need volume.
 *
 * Errors are logged, not thrown — a failed notification must never break the
 * primary action (e.g. saving a record). Returns true on success.
 *
 * @param to      - recipient email address
 * @param subject - email subject
 * @param text    - plain-text body
 */
export async function sendEmail(
  to: string,
  subject: string,
  text: string,
): Promise<boolean> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.error("[email] GMAIL_USER / GMAIL_APP_PASSWORD not set — email skipped.");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.sendMail({ from: user, to, subject, text });
    return true;
  } catch (err) {
    console.error("[email] Sending failed:", err);
    return false;
  }
}
