import { validationRulesSchema } from "../utils/validator"

export const signInRules: validationRulesSchema = {
    email: {
        required: true,
        email: true
    },
    password: {
        required: true,
        min: 6
    }
}

export const sendOTPRules: validationRulesSchema = {
    username: {
        required: true,
        min: 3
    }
}

export const verifyOTPRules: validationRulesSchema = {
    username: {
        required: true,
        min: 3
    },
    otp: {
        required: true,
        min: 6,
        max: 6
    }
}

export const forgotPasswordRules: validationRulesSchema = {
    email: {
        required: true,
        email: true
    }
}

export const resetPasswordRules: validationRulesSchema = {
    password: {
        required: true,
        min: 6
    },
    confirmPassword: {
        required: true,
        min: 6
    },
    token: {
        required: true
    }
}

export const registerRules: validationRulesSchema = {
    firstName: {
        required: true,
        min: 2,
        max: 50
    },
    lastName: {
        required: true,
        min: 2,
        max: 50
    },
    email: {
        required: true,
        email: true
    },
    password: {
        required: true,
        min: 6
    },
    role: {
        required: true
    }
}

export const signUpRules: validationRulesSchema = {
    firstName: {
        required: true,
        min: 2,
        max: 50
    },
    lastName: {
        required: true,
        min: 2,
        max: 50
    },
    email: {
        required: true,
        email: true
    },
    phone: {
        required: true,
        min: 10
    },
    password: {
        required: true,
        min: 6
    },
    confirmPassword: {
        required: true,
        min: 6
    }
}