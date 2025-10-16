import mongoose from "mongoose";

export interface IUtilityBill extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId

    consumerNumber: string
    accountId?: string
    billNumber: string
    invoiceNumber?: string
    billingMonth: string
    billingYear: number
    billIssueDate: Date
    billDueDate: Date
    paymentStatus: 'Paid' | 'Unpaid' | 'Pending' | 'Overdue'

    customerName: string
    companyName?: string
    supplyAddress: string
    meterNumber: string

    unitsConsumed: number // kWh
    meterReadingStart: number
    meterReadingEnd: number
    meterReadingDifference: number
    maximumDemand?: number // kW/kVA
    powerFactor?: number

    peakUsage?: number
    offPeakUsage?: number
    shoulderUsage?: number

    tariffPlan: string
    tariffCategory: string
    unitRate: number

    demandCharges: number
    fixedCharges: number
    energyCharges: number
    fuelSurchargeAdjustment?: number
    wheelingCharges?: number
    openAccessCharges?: number
    renewableEnergyObligations?: number

    gst?: number
    vat?: number
    electricityDuty?: number
    penalties?: number
    surcharges?: number
    latePaymentFees?: number
    miscellaneousSurcharges?: number

    previousBalance?: number
    adjustments?: number
    credits?: number
    totalAmount: number
    netPayableAmount: number

    originalFile?: string
    processedFile?: string
    cloudinaryPublicId?: string
    rawExtractedJson: any
    extractionConfidence?: number
    processingStatus: 'Pending' | 'Processing' | 'Completed' | 'Failed'

    uploadDate: Date
    lastModified: Date
}

const utilityBillSchema = new mongoose.Schema<IUtilityBill>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    consumerNumber: { type: String, required: true, trim: true },
    accountId: { type: String, trim: true },
    billNumber: { type: String, required: true, trim: true },
    invoiceNumber: { type: String, trim: true },
    billingMonth: { type: String, required: true, trim: true },
    billingYear: { type: Number, required: true },
    billIssueDate: { type: Date, required: true },
    billDueDate: { type: Date, required: true },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Unpaid', 'Pending', 'Overdue'],
        default: 'Pending',
        required: true
    },

    customerName: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true },
    supplyAddress: { type: String, required: true, trim: true },
    meterNumber: { type: String, required: true, trim: true },

    unitsConsumed: { type: Number, required: true },
    meterReadingStart: { type: Number, required: true },
    meterReadingEnd: { type: Number, required: true },
    meterReadingDifference: { type: Number, required: true },
    maximumDemand: { type: Number },
    powerFactor: { type: Number },

    peakUsage: { type: Number },
    offPeakUsage: { type: Number },
    shoulderUsage: { type: Number },

    tariffPlan: { type: String, required: true, trim: true },
    tariffCategory: { type: String, required: true, trim: true },
    unitRate: { type: Number, required: true },

    demandCharges: { type: Number, required: true },
    fixedCharges: { type: Number, required: true },
    energyCharges: { type: Number, required: true },
    fuelSurchargeAdjustment: { type: Number, default: 0 },
    wheelingCharges: { type: Number, default: 0 },
    openAccessCharges: { type: Number, default: 0 },
    renewableEnergyObligations: { type: Number, default: 0 },

    gst: { type: Number, default: 0 },
    vat: { type: Number, default: 0 },
    electricityDuty: { type: Number, default: 0 },
    penalties: { type: Number, default: 0 },
    surcharges: { type: Number, default: 0 },
    latePaymentFees: { type: Number, default: 0 },
    miscellaneousSurcharges: { type: Number, default: 0 },

    previousBalance: { type: Number, default: 0 },
    adjustments: { type: Number, default: 0 },
    credits: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    netPayableAmount: { type: Number, required: true },

    originalFile: { type: String, trim: true },
    processedFile: { type: String, trim: true },
    cloudinaryPublicId: { type: String, trim: true },
    rawExtractedJson: { type: mongoose.Schema.Types.Mixed },
    extractionConfidence: { type: Number, min: 0, max: 100 },
    processingStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Completed', 'Failed'],
        default: 'Pending',
        required: true
    },

    uploadDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now }
}, { timestamps: true });

export const UtilityBill = mongoose.model<IUtilityBill>("UtilityBill", utilityBillSchema);