import { validationRulesSchema } from "../utils/validator"

export const createIntegrationRules: validationRulesSchema = {
    name: {
        required: true,
        min: 3,
        max: 100
    },
    type: {
        required: true
    },
    configuration: {
        required: true,
        object: true
    },
    exportSettings: {
        required: true,
        object: true
    },
    metadata: {
        required: false,
        object: true
    }
}

export const getAllIntegrationsRules: validationRulesSchema = {
    type: {
        required: false
    },
    status: {
        required: false
    }
}

export const getIntegrationByIdRules: validationRulesSchema = {
    id: {
        required: true,
        min: 24,
        max: 24
    }
}

export const updateIntegrationRules: validationRulesSchema = {
    id: {
        required: true,
        min: 24,
        max: 24
    },
    name: {
        required: false,
        min: 3,
        max: 100
    },
    type: {
        required: false
    },
    configuration: {
        required: false,
        object: true
    },
    exportSettings: {
        required: false,
        object: true
    }
}

export const deleteIntegrationRules: validationRulesSchema = {
    id: {
        required: true,
        min: 24,
        max: 24
    }
}

export const exportToPowerBIRules: validationRulesSchema = {
    id: {
        required: true,
        min: 24,
        max: 24
    }
}

export const exportToERPRules: validationRulesSchema = {
    id: {
        required: true,
        min: 24,
        max: 24
    }
}

export const testIntegrationRules: validationRulesSchema = {
    id: {
        required: true,
        min: 24,
        max: 24
    }
}