import { validationRulesSchema } from "../utils/validator"

export const uploadBillRules: validationRulesSchema = {

}

export const getBillStatusRules: validationRulesSchema = {
    billId: {
        required: true,
        min: 24,
        max: 24
    }
}

export const getUtilityBillRules: validationRulesSchema = {
    billId: {
        required: true,
        min: 24,
        max: 24
    }
}

export const updateUtilityBillRules: validationRulesSchema = {
    billId: {
        required: true,
        min: 24,
        max: 24
    },
    consumerNumber: {
        required: false,
        min: 5,
        max: 50
    },
    customerName: {
        required: false,
        min: 2,
        max: 100
    },
    totalAmount: {
        required: false,
        type: "number"
    },
    unitsConsumed: {
        required: false,
        type: "number"
    },
    paymentStatus: {
        required: false
    }
}

export const deleteBillRules: validationRulesSchema = {
    billId: {
        required: true,
        min: 24,
        max: 24
    }
}