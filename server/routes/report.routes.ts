import express from "express"
import * as reportController from "../controllers/report.controller"

const reportRouter = express.Router()



reportRouter
    .post("/create/report", reportController.createReport)
    .get("/get/report", reportController.getAllReports)
    .get("/get/report/:id", reportController.getReportById)
    .put("/report/status/:id", reportController.updateReportStatus)
    .delete("/report/delete/:id", reportController.deleteReport)
    .get("/report/download/:id", reportController.downloadReport)
    .post("/report/comparison", reportController.generateComparisonReport)

export default reportRouter