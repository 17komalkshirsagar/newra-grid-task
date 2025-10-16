import express from "express"
import * as scenarioController from "../controllers/scenario.controller"

const scenarioRouter = express.Router()



scenarioRouter
    .post("/create/scenario", scenarioController.createScenario)
    .get("/get/scenario", scenarioController.getAllScenarios)
    .get("/get/by/id/scenario/:id", scenarioController.getScenarioById)
    .put("/update/scenario/:id", scenarioController.updateScenario)
    .delete("/delete/scenario/:id", scenarioController.deleteScenario)
    .post("/compare/scenario", scenarioController.compareScenarios)

export default scenarioRouter