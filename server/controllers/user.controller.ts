import { NextFunction, Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { IUser, User } from "../models/User"
import { generatePassword } from "../utils/generatePassword"
import { registerRules } from "./../rules/auth.rules"
import { customValidator } from "./../utils/validator"
import bcryptjs from "bcryptjs"
import { sendEmail } from "../utils/email"
import cloudinary from "../utils/uploadConfig"
import { IUserProtected } from "../utils/protected"
import { welcomeTemplate } from "../templates/welcomeTemplate"



export const getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { page = 1, limit = 10, searchQuery = "", isFetchAll = false } = req.query

    const currentPage = parseInt(page as string)
    const pageLimit = parseInt(limit as string)
    const skip: number = (currentPage - 1) * pageLimit

    const query = {
        $and: [
            {},
            searchQuery
                ? {
                    $or: [
                        { firstName: { $regex: searchQuery, $options: "i" } },
                        { lastName: { $regex: searchQuery, $options: "i" } },
                        { email: { $regex: searchQuery, $options: "i" } },
                    ]
                }
                : {}
        ]
    }

    const totalUsers = await User.countDocuments(query)
    const totalPages = Math.ceil(totalUsers / pageLimit)

    let result = []
    if (isFetchAll) {
        result = await User.find().select("-password -__v").lean()
    } else {
        result = await User.find(query).skip(skip).limit(pageLimit).lean()
    }
    res.status(200).json({ message: "Users Fetch successfully", result, totalPages, totalUsers })
})


export const getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params

    const result = await User.findById(id).select("-password -__v").lean()

    if (!result) {
        return res.status(404).json({ message: `User with ID: ${id} not found` })
    }

    res.status(200).json({ message: "User fetch successfully", result })
})


export const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { firstName, lastName, email, phone, role, password }: IUser = req.body

    const user = await User.findOne({ $or: [{ email }, { phone }] })

    if (user) {
        if (user.email == email) {
            return res.status(409).json({ message: "Email already exist" })
        }
        if (user.phone == phone) {
            return res.status(409).json({ message: "Phone number already exist" })
        }
    }

    let profile = ""
    if (req.file) {
        const { secure_url } = await cloudinary.uploader.upload(req.file.path)
        profile = secure_url
    }

    if (role === "Admin" || role === "Client") {
        const generatedPassword = generatePassword(12)

        const x = req.user as IUserProtected

        const data = { ...req.body, password: generatedPassword, profile }

        const { isError, error } = customValidator(data, registerRules)

        if (isError) {
            return res.status(422).json({ message: "Validation errors", error });
        }

        const hashPassword = await bcryptjs.hash(generatedPassword, 10)

        const result = await User.create({ ...data, password: hashPassword })

        const welcomeTemp = welcomeTemplate({ firstName, lastName, email, password: generatedPassword })

        await sendEmail({
            to: email, subject: "Welcome to Our Service", text: welcomeTemp
        });

        return res.status(200).json({ message: "User registered and email sent successfully", result })
    }

    const { isError, error } = customValidator({ ...req.body, profile }, registerRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error });
    }

    const hashPassword = await bcryptjs.hash(password, 10)

    const result = await User.create({
        firstName, lastName, email, phone, password: hashPassword, role, profile
    })

    return res.status(200).json({ message: "User registered and email sent successfully", result })
})


export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params

    const user = await User.findById(id)

    let profile
    if (req.file) {
        const publicId = user?.profile?.split("/").pop()?.split(".")[0]
        publicId && await cloudinary.uploader.destroy(publicId)

        const { secure_url } = await cloudinary.uploader.upload(req.file.path)
        profile = secure_url
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    await User.findByIdAndUpdate(id, { ...req.body, profile }, { new: true, runValidators: true })

    res.status(200).json({ message: "User update successfully" })
})


export const updateUserStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { status } = req.body
    const { id } = req.params

    const user = await User.findById(id)

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    await User.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })

    res.status(200).json({ message: "User status update successfully" })
})


export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params

    const user = await User.findById(id)

    if (!user) {
        return res.status(400).json({ message: "User not found" })
    }

    await User.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true, runValidators: true })

    res.status(200).json({ message: "User delete successfully" })
})

