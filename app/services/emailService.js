import nodemailer from "nodemailer";
import mg from "nodemailer-mailgun-transport";

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};

const transporter = nodemailer.createTransport(mg(auth));

/**
 * @description Send email using nodemailer
 * @module emailService - Send email using nodemailer
 * @param {string} options.fromAddress - From address
 * @param {string} options.fromName - From name
 * @param {string} options.to - To address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email body
 * @example import sendEmail from "./app/services/emailService.js";
 * await sendEmail({
      to: "example@email.com",
      subject: "Welcome",
      html: "<p>Welcome to our site</p>",
    });
  * @returns {Promise<void>}
  */
export const sendEmail = async ({
  fromAddress = process.env.EMAIL_FROM_ADDRESS,
  fromName = process.env.EMAIL_FROM_NAME,
  to,
  subject = "Welcome",
  html = "",
}) => {
  const mailOptions = {
    from: `${fromName} <${fromAddress}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
