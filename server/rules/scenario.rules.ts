import { validationRulesSchema } from "../utils/validator"

export const createScenarioRules: validationRulesSchema = {
    scenarioName: {
        required: true,
        min: 3,
        max: 100
    },
    description: {
        required: false,
        max: 500
    },
    scenarioType: {
        required: true
    },
    billId: {
        required: true,
        min: 24,
        max: 24
    },
    newTariffRate: {
        required: false,
        type: "number"
    },
    newSupplierName: {
        required: false,
        min: 2,
        max: 100
    },
    newSupplierRate: {
        required: false,
        type: "number"
    },
    energyMixPercentage: {
        required: false,
        type: "number"
    },
    consumptionReduction: {
        required: false,
        type: "number"
    }
}

export const getAllScenariosRules: validationRulesSchema = {
    page: {
        required: false,
        type: "number"
    },
    limit: {
        required: false,
        type: "number"
    },
    type: {
        required: false
    }
}

export const getScenarioByIdRules: validationRulesSchema = {
    id: {
        required: true,
        min: 24,
        max: 24
    }
}

export const updateScenarioRules: validationRulesSchema = {
    id: {
        required: true,
        min: 24,
        max: 24
    },
    scenarioName: {
        required: false,
        min: 3,
        max: 100
    },
    description: {
        required: false,
        max: 500
    },
    scenarioType: {
        required: false
    },
    newTariffRate: {
        required: false,
        type: "number"
    },
    newSupplierRate: {
        required: false,
        type: "number"
    }
}

export const deleteScenarioRules: validationRulesSchema = {
    id: {
        required: true,
        min: 24,
        max: 24
    }
}