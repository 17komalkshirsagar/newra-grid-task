import express from "express"
import * as authController from "../controllers/auth.controller"

const authRouter = express.Router()

authRouter
    .post("/sign-up", authController.signUp)
    .post("/sign-in", authController.signIn)
    .post("/sign-out", authController.signOut)
    .post("/send-otp", authController.sendOTP)
    .post("/verify-otp", authController.verifyOTP)
    .post("/forgot-password", authController.forgotPassword)
    .put("/reset-password", authController.resetPassword)

export default authRouter