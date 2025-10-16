import { validationRulesSchema } from "../utils/validator"

export const createReportRules: validationRulesSchema = {
    title: {
        required: true,
        min: 3,
        max: 200
    },
    type: {
        required: true
    },
    billId: {
        required: false,
        min: 24,
        max: 24
    },
    scenarioId: {
        required: false,
        min: 24,
        max: 24
    },
    reportData: {
        required: true,
        object: true
    }
}

export const getAllReportsRules: validationRulesSchema = {
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
    },
    status: {
        required: false
    }
}

export const getReportByIdRules: validationRulesSchema = {
    id: {
        required: true,
        min: 24,
        max: 24
    }
}

export const updateReportStatusRules: validationRulesSchema = {
    id: {
        required: true,
        min: 24,
        max: 24
    },
    status: {
        required: true
    },
    fileUrl: {
        required: false
    },
    fileSize: {
        required: false,
        type: "number"
    }
}

export const deleteReportRules: validationRulesSchema = {
    id: {
        required: true,
        min: 24,
        max: 24
    }
}

export const generateComparisonReportRules: validationRulesSchema = {
    billId: {
        required: true,
        min: 24,
        max: 24
    },
    scenarioId: {
        required: true,
        min: 24,
        max: 24
    },
    title: {
        required: true,
        min: 3,
        max: 200
    },
    type: {
        required: false
    }
}