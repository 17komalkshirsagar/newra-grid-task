import express from "express"
import * as analyticsController from "../controllers/analytics.controller"

const analyticsRouter = express.Router()



analyticsRouter
    .post("/create/analytics", analyticsController.createAnalytics)
    .get("/dashboard/analytics", analyticsController.getDashboardAnalytics)
    .get("/kpi-trends/analytics", analyticsController.getKPITrends)
    .get("/get/analytics/:id", analyticsController.getAnalyticsById)
    .put("/update/analytics/:id", analyticsController.updateAnalytics)
    .delete("/delete/analytics/:id", analyticsController.deleteAnalytics)
    .post("/generate/analytics/:billId", analyticsController.generateUtilityBillAnalytics)
    .post("/compare/analytics", analyticsController.compareScenarioAnalytics)

export default analyticsRouter