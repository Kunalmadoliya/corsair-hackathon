import { Resend } from "resend";
import { env } from "../env";

const resend = new Resend(env.RESEND_API_KEY);



export async function sendVerificationEmail(
  email: string,
  verificationUrl: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: email,
      subject: "Verify your email",
      text: `Verify your email: ${verificationUrl}`,
      html: `
        <div>
          <h2>Verify your email</h2>
          <p>Please click the button below to verify your email address.</p>

          <a
            href="${verificationUrl}"
            style="
              display:inline-block;
              padding:12px 24px;
              background:#000;
              color:#fff;
              text-decoration:none;
              border-radius:6px;
            "
          >
            Verify Email
          </a>

          <p>If you did not create an account, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);

      throw new Error(
        `Failed to send verification email: ${error.message}`
      );
    }

    console.log("RESEND_API_KEY:", env.RESEND_API_KEY?.slice(0, 8));
console.log("EMAIL_FROM:", env.EMAIL_FROM);
console.log("TO:", email);

    return {
      success: true,
      emailId: data?.id,
    };
  } catch (error) {
    console.error("Email Service Error:", error);

    throw new Error("Unable to send verification email");
  }
}