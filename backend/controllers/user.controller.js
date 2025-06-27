import db from "../db/connectDB.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailservice/email.js"; // You’ll create this
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"; // You’ll create this
const { Students, ValidStudents } = db;

export const signup = async (req, res) => {
  const { email, password, name, studentId, role } = req.body;

  try {
    if (!email || !password || !name || !studentId || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // ✅ Check if the student is allowed (exists in valid_students)

    const normalizedEmail = email.trim();
    const validStudent = await ValidStudents.findOne({
      where: { email: normalizedEmail, studentId: studentId, name },
    });

    if (!validStudent) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to register. Please recheck your details.",
      });
    }

    if (validStudent.is_registered) {
      return res.status(403).json({
        success: false,
        message: "This student is already registered.",
      });
    }

    // ✅ Check if email already exists

    const existingUser = await Students.findOne({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // ✅ Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // ✅ Generate OTP (6-digit) and expiry (10 mins)
    const verificationToken = crypto.randomInt(100000, 999999).toString();

    const verificationTokenExpiresAt = new Date(
      Date.now() + process.env.OTP_EXPIRY_MINUTES * 60 * 1000
    );

    // ✅ Create User
    const user = await Students.create({
      name,
      email,
      password: hashedPassword,
      role: role,
      studentId,
      verificationToken,
      verificationTokenExpiresAt,
      isVerified: false,
    });

    // ✅ Mark student as registered in valid_students
    await validStudent.update({ is_registered: true });

    // ✅ Send OTP via Brevo
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (err) {
      // Rollback user creation if email fails
      await user.destroy();
      await validStudent.update({ is_registered: false });
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Signup successful. Please verify your email via the OTP sent.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Signup failed", error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({
      success: false,
      message: "Email and verification code are required",
    });
  }

  try {
    const user = await Students.findOne({
      where: {
        email: email.trim(),
        verificationToken: code,
        verificationTokenExpiresAt: {
          [db.Sequelize.Op.gt]: new Date(new Date().toISOString()), // Ensure expiry is in future
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // Update user as verified
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during verification" });
  }
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await Students.findOne({
      where: { email: normalizedEmail, role: role },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ✅ Set JWT token in HTTP-only cookie
    generateTokenAndSetCookie(res, user.snro, user.role);

    // ✅ Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        snro: user.snro,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email.toLowerCase().trim();
  try {
    const user = await Students.findOne({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Optional: hide existence of user
      return res.status(200).json({
        success: true,
        message: "If this email exists, a reset link has been sent.",
      });
    }

    // Generate reset token

    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Generate raw token and hashed version
    const rawToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${rawToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    console.log("Params:", req.params); // ✅ check token
    console.log("Body:", req.body);
    const { token } = req.params;
    const { password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await Students.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpiresAt: { [db.Sequelize.Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};



export const checkAuth = async (req, res) => {
  try {
    // Sequelize equivalent of findById
    const user = await Students.findByPk(req.userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in checkAuth: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    const user = await Students.findOne({ where: { email: email.trim() } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }

    // Generate new OTP
    const newOtp = crypto.randomInt(100000, 999999).toString();
    const newExpiry = new Date(
      Date.now() + process.env.OTP_EXPIRY_MINUTES * 60 * 1000
    );

    user.verificationToken = newOtp;
    user.verificationTokenExpiresAt = newExpiry;
    await user.save();

    // Send new OTP email
    await sendVerificationEmail(user.email, newOtp);

    return res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email.",
    });
  } catch (error) {
    console.error("Error in resendOtp:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while resending OTP",
    });
  }
};
