import { validationRulesSchema } from "../utils/validator"

export const createAnalyticsRules: validationRulesSchema = {
    billId: {
        required: true,
        min: 24,
        max: 24
    },
    kpiMetrics: {
        required: true,
        object: true
    },
    dashboardMetrics: {
        required: true,
        object: true
    },
    reportingPeriod: {
        required: true,
        object: true
    }
}

export const getDashboardAnalyticsRules: validationRulesSchema = {
    period: {
        required: false
    }
}

export const getAnalyticsByIdRules: validationRulesSchema = {
    id: {
        required: true,
        min: 24,
        max: 24
    }
}

export const generateBillAnalyticsRules: validationRulesSchema = {
    billId: {
        required: true,
        min: 24,
        max: 24
    }
}

export const compareScenarioAnalyticsRules: validationRulesSchema = {
    baselineBillId: {
        required: true,
        min: 24,
        max: 24
    },
    scenarioId: {
        required: true,
        min: 24,
        max: 24
    }
}

export const getKPITrendsRules: validationRulesSchema = {
    months: {
        required: false,
        type: "number"
    }
}