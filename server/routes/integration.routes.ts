import express from "express"
import * as integrationController from "../controllers/integration.controller"

const integrationRouter = express.Router()



integrationRouter
    .post("/create/integration", integrationController.createIntegration)
    .get("/get/all/integrations", integrationController.getAllIntegrations)
    .get("/get/integration/:id", integrationController.getIntegrationById)
    .put("/update/integration/:id", integrationController.updateIntegration)
    .delete("/delete/integration/:id", integrationController.deleteIntegration)
    .post("/powerbi/integration/:id", integrationController.exportToPowerBI)
    .post("/erp/integration/:id", integrationController.exportToERP)
    .post("/test/integration/:id", integrationController.testIntegration)

export default integrationRouter