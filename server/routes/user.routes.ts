import express from "express"
import * as userController from "../controllers/user.controller"
import multerMiddleware from "../utils/upload"

const upload = multerMiddleware()

const userRouter = express.Router()


userRouter
    .get("/get/all/user", userController.getAllUsers)
    .get("/get/by/user/:id", userController.getUserById)
    .post("/user/create", upload.single("profile"), userController.createUser)
    .put("/user/update/:id", upload.single("profile"), userController.updateUser)
    .put("/user/status/:id", userController.updateUserStatus)
    .delete("/user/delete/:id", userController.deleteUser)

export default userRouter