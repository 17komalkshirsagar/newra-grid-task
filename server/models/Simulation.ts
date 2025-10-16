import mongoose from "mongoose"

export interface ISimulation extends mongoose.Document {
    name: string
    description?: string
    userId: mongoose.Types.ObjectId
    billId: mongoose.Types.ObjectId

    // Scenario Parameters (from PDF: tariff changes, alternative supplier pricing, energy mix variations)
    scenarioType: 'tariff_change' | 'supplier_pricing' | 'energy_mix' | 'demand_optimization' | 'custom'

    parameters: {
        // Tariff Changes
        tariffModifications?: {
            newTariffPlan?: string
            energyRateChange?: number // percentage change
            demandChargeChange?: number // percentage change
            fixedChargeChange?: number // percentage change
            peakRateMultiplier?: number
            offPeakRateMultiplier?: number
        }

        // Alternative Supplier Pricing
        supplierPricing?: {
            supplierName?: string
            newEnergyRate?: number // per kWh
            newDemandRate?: number // per kW
            newFixedCharges?: number
            contractTermMonths?: number
            greenEnergyPercentage?: number
        }

        // Energy Mix Variations
        energyMix?: {
            solarPercentage?: number
            windPercentage?: number
            gridPercentage?: number
            batteryStorageKWh?: number
            peakShavingEnabled?: boolean
            loadShiftingHours?: number[]
        }

        // Demand Optimization
        demandOptimization?: {
            targetMaxDemand?: number // kW
            loadScheduling?: boolean
            powerFactorImprovement?: number
            energyEfficiencyGain?: number // percentage
        }

        // Custom Parameters
        customParameters?: any
    }

    // Simulation Results (comparative cost projections)
    results: {
        baselineCost: number
        projectedCost: number
        savings: {
            amount: number
            percentage: number
        }
        breakdown: {
            energyChargesSavings: number
            demandChargesSavings: number
            fixedChargesSavings: number
            taxSavings: number
        }
        paybackPeriodMonths?: number
        roiPercentage?: number
    }

    // Time Analysis
    timeframe: {
        startDate: Date
        endDate: Date
        projectionMonths: number
    }

    // Recommendations
    recommendations?: string[]

    // Implementation Details
    implementationCost?: number
    feasibilityScore?: number // 0-100
    riskAssessment?: 'Low' | 'Medium' | 'High'

    status: 'draft' | 'running' | 'completed' | 'failed'
    simulationRunTime?: number // milliseconds

    createdAt: Date
    updatedAt: Date
}

const simulationSchema = new mongoose.Schema<ISimulation>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    billId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UtilityBill",
        required: true
    },

    scenarioType: {
        type: String,
        enum: ['tariff_change', 'supplier_pricing', 'energy_mix', 'demand_optimization', 'custom'],
        required: true
    },

    parameters: {
        tariffModifications: {
            newTariffPlan: { type: String },
            energyRateChange: { type: Number },
            demandChargeChange: { type: Number },
            fixedChargeChange: { type: Number },
            peakRateMultiplier: { type: Number },
            offPeakRateMultiplier: { type: Number }
        },

        supplierPricing: {
            supplierName: { type: String },
            newEnergyRate: { type: Number },
            newDemandRate: { type: Number },
            newFixedCharges: { type: Number },
            contractTermMonths: { type: Number },
            greenEnergyPercentage: { type: Number }
        },

        energyMix: {
            solarPercentage: { type: Number },
            windPercentage: { type: Number },
            gridPercentage: { type: Number },
            batteryStorageKWh: { type: Number },
            peakShavingEnabled: { type: Boolean },
            loadShiftingHours: [{ type: Number }]
        },

        demandOptimization: {
            targetMaxDemand: { type: Number },
            loadScheduling: { type: Boolean },
            powerFactorImprovement: { type: Number },
            energyEfficiencyGain: { type: Number }
        },

        customParameters: mongoose.Schema.Types.Mixed
    },

    results: {
        baselineCost: { type: Number, required: true },
        projectedCost: { type: Number, required: true },
        savings: {
            amount: { type: Number, required: true },
            percentage: { type: Number, required: true }
        },
        breakdown: {
            energyChargesSavings: { type: Number, default: 0 },
            demandChargesSavings: { type: Number, default: 0 },
            fixedChargesSavings: { type: Number, default: 0 },
            taxSavings: { type: Number, default: 0 }
        },
        paybackPeriodMonths: { type: Number },
        roiPercentage: { type: Number }
    },

    timeframe: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        projectionMonths: { type: Number, required: true }
    },

    recommendations: [{ type: String }],

    implementationCost: { type: Number },
    feasibilityScore: { type: Number, min: 0, max: 100 },
    riskAssessment: {
        type: String,
        enum: ['Low', 'Medium', 'High']
    },

    status: {
        type: String,
        enum: ['draft', 'running', 'completed', 'failed'],
        default: 'draft'
    },
    simulationRunTime: { type: Number }
}, {
    timestamps: true
})

simulationSchema.index({ userId: 1, createdAt: -1 })
simulationSchema.index({ billId: 1 })
simulationSchema.index({ scenarioType: 1 })
simulationSchema.index({ status: 1 })

export default mongoose.model<ISimulation>("Simulation", simulationSchema)