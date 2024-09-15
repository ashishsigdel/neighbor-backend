import { sendEmail } from "../app/services/emailService.js";

describe("Email Service", () => {
  it("Send email", async () => {
    const fromAddress = process.env.EMAIL_FROM_ADDRESS;
    const fromName = process.env.EMAIL_FROM_NAME;
    const to = "krishna.forkhaki@gmail.com";
    const subject = "Test email";
    const html = "<p>This is a test email</p>";

    await sendEmail({
      fromAddress,
      fromName,
      to,
      subject,
      html,
    });

    // success if no error in sendEmail
    expect(true).toBeTruthy();
  });
});
