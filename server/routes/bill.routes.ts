import express from "express"
import * as billController from "../controllers/bill.controller"
import { upload } from "../controllers/bill.controller"

const billRouter = express.Router()


billRouter
    .post("/bill/upload", (req, res, next) => {
        console.log("Route hit: /bill/upload");
        next();
    }, upload.single('bill'), (req, res, next) => {
        console.log("After multer middleware");
        next();
    }, billController.uploadBill)
    .get("/get/all", billController.getAllBills)
    .get("/grt/bill/status/:billId", billController.getBillStatus)
    .get("/get/bill/data/:billId", billController.getUtilityBill)
    .get("/bill/analytics", billController.getBillsAnalytics)
    .get("/export/bill/powerbi", billController.exportForPowerBI)
    .get("/export/bill/erp", billController.exportForERP)
    .put("/update/bill/:billId", billController.updateUtilityBill)
    .delete("/delete/bill/:billId", billController.deleteBill)

export default billRouter