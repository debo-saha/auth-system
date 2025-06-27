import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

import { sender, emailTransporter } from "./brevo.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace(
    "{verificationCode}",
    verificationToken
  );
  const mailOptions = {
    from: `"${sender.name}" <${sender.email}>`,
    to: email,
    subject: "Verify Your Email",
    html: htmlContent,
  };
  try {
    const info = await emailTransporter.sendMail(mailOptions);
    console.log("✅ Verification email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw new Error("Error sending verification email");
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await emailTransporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Welcome to Our Service!",
      html: WELCOME_EMAIL_TEMPLATE, // <-- dynamic name if needed
    });

    console.log("✅ Welcome email sent successfully:", response.messageId);
  } catch (error) {
    console.error("❌ Error sending welcome email:", error?.response || error);
    throw new Error("Failed to send welcome email");
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace(
    "{resetURL}",
    resetURL
  );

  try {
    const response = await emailTransporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Reset your password",
      html: htmlContent,
      category: "Password Reset",
    });

    console.log("✅ reset email sent successfully:", response.messageId);
  } catch (error) {
    console.error("❌ Error sending reset email:", error?.response || error);
    throw new Error("Failed to send reset email");
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const response = await emailTransporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });

    console.log("Password reset email sent successfully", response.messageId);
  } catch (error) {
    console.error(`Error sending password reset success email`, error);

    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
