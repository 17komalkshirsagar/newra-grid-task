import mongoose from "mongoose"

export interface IUser extends mongoose.Document {
    firstName: string
    lastName: string
    email: string
    password: string
    phone: string
    profile?: string
    role: 'Admin' | 'Client'
    status: 'active' | 'inactive'
    permissions?: {
        canUploadBills: boolean
        canViewAllBills: boolean
        canCreateScenarios: boolean
        canExportReports: boolean
        canManageUsers: boolean
    }
    createdAt: Date
    updatedAt: Date
}

export interface IOTP extends mongoose.Document {
    username: string
    otp: string
    expiry: Date
}

const userSchema = new mongoose.Schema<IUser>({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    profile: { type: String, trim: true },
    role: {
        type: String,
        enum: ['Admin', 'Client'],
        default: "Client",
        required: true
    },
    status: {
        type: String,
        default: "active",
        enum: ['active', 'inactive']
    },
    permissions: {
        canUploadBills: { type: Boolean, default: true },
        canViewAllBills: { type: Boolean, default: false },
        canCreateScenarios: { type: Boolean, default: true },
        canExportReports: { type: Boolean, default: true },
        canManageUsers: { type: Boolean, default: false }
    }
}, { timestamps: true })

const OTPSchema = new mongoose.Schema<IOTP>({
    username: { type: String },
    otp: { type: String, required: true },
    expiry: { type: Date, required: true }
}, { timestamps: true })

export const User = mongoose.model<IUser>("User", userSchema)
export const OTP = mongoose.model<IOTP>("Otp", OTPSchema)