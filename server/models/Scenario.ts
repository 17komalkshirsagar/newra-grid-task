import mongoose, { Schema } from "mongoose";

export interface IScenario extends mongoose.Document {
    userId?: mongoose.Schema.Types.ObjectId
    billId?: mongoose.Schema.Types.ObjectId

    // Scenario Information
    scenarioName: string
    description?: string
    scenarioType: 'tariff_change' | 'supplier_change' | 'energy_mix' | 'consumption_optimization'

    // Base Data (from original bill)
    baseUnitsConsumed: number
    baseTotalAmount: number
    baseDemandCharges: number
    baseFixedCharges: number
    baseEnergyCharges: number
    baseTaxes: number

    // Simulation Parameters
    newTariffRate?: number
    newSupplierName?: string
    newSupplierRate?: number
    energyMixPercentage?: number // renewable energy percentage
    consumptionReduction?: number // percentage reduction
    newDemandChargeRate?: number
    newFixedChargeRate?: number

    // Simulated Results
    projectedUnitsConsumed: number
    projectedDemandCharges: number
    projectedFixedCharges: number
    projectedEnergyCharges: number
    projectedTaxes: number
    projectedTotalAmount: number

    // Comparison Metrics
    costSavings: number
    percentageSavings: number
    paybackPeriod?: number // in months
    annualSavings: number

    // Status
    simulationStatus: 'draft' | 'completed' | 'approved'
    createdDate: Date
    lastModified: Date
}

const scenarioSchema = new Schema<IScenario>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    billId: { type: mongoose.Schema.Types.ObjectId, ref: "UtilityBill" },

    // Scenario Information
    scenarioName: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    scenarioType: {
        type: String,
        enum: ['tariff_change', 'supplier_change', 'energy_mix', 'consumption_optimization'],
        required: true
    },

    // Base Data
    baseUnitsConsumed: { type: Number, required: true },
    baseTotalAmount: { type: Number, required: true },
    baseDemandCharges: { type: Number, required: true },
    baseFixedCharges: { type: Number, required: true },
    baseEnergyCharges: { type: Number, required: true },
    baseTaxes: { type: Number, required: true },

    // Simulation Parameters
    newTariffRate: { type: Number },
    newSupplierName: { type: String, trim: true },
    newSupplierRate: { type: Number },
    energyMixPercentage: { type: Number, min: 0, max: 100 },
    consumptionReduction: { type: Number, min: 0, max: 100 },
    newDemandChargeRate: { type: Number },
    newFixedChargeRate: { type: Number },

    // Simulated Results
    projectedUnitsConsumed: { type: Number, required: true },
    projectedDemandCharges: { type: Number, required: true },
    projectedFixedCharges: { type: Number, required: true },
    projectedEnergyCharges: { type: Number, required: true },
    projectedTaxes: { type: Number, required: true },
    projectedTotalAmount: { type: Number, required: true },

    // Comparison Metrics
    costSavings: { type: Number, required: true },
    percentageSavings: { type: Number, required: true },
    paybackPeriod: { type: Number },
    annualSavings: { type: Number, required: true },

    // Status
    simulationStatus: {
        type: String,
        enum: ['draft', 'completed', 'approved'],
        default: 'draft',
        required: true
    },
    createdDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now }
}, { timestamps: true });

export const Scenario = mongoose.model<IScenario>("Scenario", scenarioSchema);
export default Scenario;