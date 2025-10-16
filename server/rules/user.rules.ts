import { validationRulesSchema } from "../utils/validator"

export const getAllUsersRules: validationRulesSchema = {
    page: {
        required: false,
        type: "number"
    },
    limit: {
        required: false,
        type: "number"
    },
    role: {
        required: false
    },
    search: {
        required: false,
        min: 1,
        max: 100
    }
}

export const getUserByIdRules: validationRulesSchema = {
    id: {
        required: true,
        min: 24,
        max: 24
    }
}

export const updateUserRules: validationRulesSchema = {
    id: {
        required: true,
        min: 24,
        max: 24
    },
    firstName: {
        required: false,
        min: 2,
        max: 50
    },
    lastName: {
        required: false,
        min: 2,
        max: 50
    },
    email: {
        required: false,
        email: true
    },
    phone: {
        required: false,
        min: 10,
        max: 15
    },
    role: {
        required: false
    }
}

export const deleteUserRules: validationRulesSchema = {
    id: {
        required: true,
        min: 24,
        max: 24
    }
}

export const updateProfileRules: validationRulesSchema = {
    firstName: {
        required: false,
        min: 2,
        max: 50
    },
    lastName: {
        required: false,
        min: 2,
        max: 50
    },
    email: {
        required: false,
        email: true
    },
    phone: {
        required: false,
        min: 10,
        max: 15
    }
}