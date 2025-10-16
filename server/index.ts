import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cron from "node-cron";
import passport from "./services/passport";
import { authenticateUser } from "./utils/protected";
import authRouter from "./routes/auth.routes";
import billRouter from "./routes/bill.routes";
import userRouter from "./routes/user.routes";
import scenarioRouter from "./routes/scenario.routes";
import reportRouter from "./routes/report.routes";
import analyticsRouter from "./routes/analytics.routes";
import integrationRouter from "./routes/integration.routes";
import contactRouter from "./routes/contact.routes";
import { app, server } from "./utils/socket";




dotenv.config()
app.use(express.json())
app.use(express.static("dist"))
app.use(morgan("dev"))



app.use(express.urlencoded({ extended: true }))
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://newra-grids-7jhn.vercel.app",
    ""
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use(passport.initialize())



app.use("/api/v1/auth", authRouter)


app.use("/api/v1/users", authenticateUser, userRouter)
app.use("/api/v1/bills", authenticateUser, billRouter)
app.use("/api/v1/scenarios", authenticateUser, scenarioRouter)
app.use("/api/v1/reports", authenticateUser, reportRouter)
app.use("/api/v1/analytics", authenticateUser, analyticsRouter)
app.use("/api/v1/integrations", authenticateUser, integrationRouter)
app.use("/api/v1/contact", contactRouter)





app.use((req: Request, res: Response, next: NextFunction) => {

    res.status(404).json({ message: "Resource not found", });
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error occurred:", err);
    console.error("Stack:", err.stack);
    res.status(500).json({ message: "Something went wrong", error: err.message });
})

mongoose.connect(process.env.MONGO_URL || "").catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
});



const PORT = process.env.PORT || 5000
mongoose.connection.once("open", async () => {
    console.log("MongoDb Connected")
    server.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`)
    });
});

