import { NextFunction, Request, Response } from "express"
import asyncHandler from "express-async-handler"
import bcryptjs from "bcryptjs"
import jwt, { JwtPayload } from "jsonwebtoken"
import crypto from "crypto"
import { IOTP, IUser, OTP, User } from "../models/User"
import { sendEmail } from "../utils/email"
import { customValidator } from "../utils/validator"
import { forgotPasswordRules, resetPasswordRules, sendOTPRules, signInRules, verifyOTPRules, signUpRules } from "../rules/auth.rules"
import { generateResetToken, generateToken } from "../utils/generateToken"
import { otpVerificationTemplate } from "../templates/otpVerificationTemplate"
import { resetPasswordTemplate } from "../templates/resetPasswordTemplate"
import dotenv from "dotenv";
dotenv.config({})

export const signUp = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { firstName, lastName, email, phone, password, confirmPassword }: IUser & { confirmPassword: string } = req.body

    const { isError, error } = customValidator(req.body, signUpRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error })
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" })
    }


    const existingUser = await User.findOne({ $or: [{ email }, { phone }] }).lean()

    if (existingUser) {
        if (existingUser.email === email) {
            return res.status(409).json({ message: "User with this email already exists" })
        }
        if (existingUser.phone === phone) {
            return res.status(409).json({ message: "User with this phone already exists" })
        }
    }


    const hashPass = await bcryptjs.hash(password, 10)


    const role = email === "admin@gmail.com" ? "Admin" : "Client"
    const permissions = {
        canUploadBills: true,
        canViewAllBills: role === "Admin",
        canCreateScenarios: true, canExportReports: true, canManageUsers: role === "Admin"
    }

    const newUser = await User.create({
        firstName, lastName, email, phone, password: hashPass, role, permissions, status: "active"
    })

    const token = generateToken({ userId: newUser._id, role: newUser.role })

    const result = {
        _id: newUser._id, firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email, role: newUser.role, token
    }

    res.status(201).json({ message: "User registered successfully", result })
})


export const signIn = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email, password }: IUser = req.body

    const { isError, error } = customValidator(req.body, signInRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error })
    }

    const user = await User.findOne({ email }).lean()
    if (!user) {
        return res.status(401).json({ message: "Invalid Credential - Email not found" })
    }

    const verifyPassword = await bcryptjs.compare(password, user.password)
    if (!verifyPassword) {
        return res.status(401).json({ message: "Invalid Credential - Password do not match" })
    }

    const token = generateToken({ userId: user._id, role: user.role })

    const result = {
        _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, profile: user.profile, role: user.role, token
    }
    res.status(200).json({ message: "Logged in successfully", result })
})


export const signOut = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    res.status(200).json({ message: "Logged out successfully" });
});


export const sendOTP = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    const { username }: IOTP = req.body
    const { isError, error } = customValidator(req.body, sendOTPRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error });
    }


    const user = await User.findOne({
        $or: [{ email: username }, { phone: username.toString() }]
    }).lean();

    if (!user) {
        return res.status(404).json({ message: "User not found with the provided email or phone number" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({ username, otp, expiry: otpExpiry })

    const otpVerificationTemp = otpVerificationTemplate(otp)


    await sendEmail({ to: user.email, subject: 'Your OTP Code', text: otpVerificationTemp, });

    res.status(200).json({ message: "OTP sent to your registered email address successfully", email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') })
})


export const verifyOTP = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { username, otp }: IOTP = req.body

    const { isError, error } = customValidator(req.body, verifyOTPRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error });
    }

    const result = await OTP.findOne({ username, otp })

    if (!result) {
        return res.status(400).json({ message: "Invalid OTP or expired" })
    }

    if (result) {
        if (new Date() > result?.expiry) {
            return res.status(400).json({ message: "OTP expired" })
        }

        if (result?.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" })
        }
    }

    await OTP.deleteOne({ username, otp });
    res.status(200).json({ message: "OTP verified successfully" })

})


export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email } = req.body

    const { isError, error } = customValidator(req.body, forgotPasswordRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error })
    }

    const user = await User.findOne({ email }).lean()

    if (!user) {
        return res.status(404).json({ message: "User not found with given email" })
    }

    const resetToken = await generateResetToken({ email })
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const resetPasswordTemp = resetPasswordTemplate(resetLink)

    await sendEmail({
        to: email,
        subject: "Password Reset Request",
        text: resetPasswordTemp
    });

    res.status(200).json({ message: "Password reset email sent successfully" });
})


export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { password, confirmPassword, token } = req.body

    const { isError, error } = customValidator(req.body, resetPasswordRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error })
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Password do not match" })
    }

    const secretKey = process.env.JWT_KEY

    let decodedToken: string | JwtPayload | null = null

    try {
        if (secretKey) {
            decodedToken = jwt.verify(token, secretKey);
        }
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired reset token" });
    }

    if (!decodedToken) {
        return res.status(401).json({ message: "Invalid or expired reset token" });
    }

    const email = (decodedToken as JwtPayload).email
    if (!email) {
        return res.status(422).json({ message: "Email not verified" })
    }

    const user = await User.findOne({ email }).lean()

    const hashPass = await bcryptjs.hash(password, 10)

    await User.findByIdAndUpdate(user?._id, { password: hashPass })

    res.status(200).json({ message: "Password reset success" })
})

