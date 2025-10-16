import mongoose, { Document, Schema } from "mongoose"

export interface IAnalytics extends Document {
    userId: mongoose.Types.ObjectId
    billId?: mongoose.Types.ObjectId
    kpiMetrics: {
        unitCostTrends: {
            current: number
            previous: number
            percentageChange: number
            trend: "increasing" | "decreasing" | "stable"
        }
        peakOffPeakUsage: {
            peakHours: {
                consumption: number
                cost: number
                hours: string[]
            }
            offPeakHours: {
                consumption: number
                cost: number
                hours: string[]
            }
            ratio: number
        }
        demandCharges: {
            maxDemand: number
            averageDemand: number
            demandCost: number
            demandPercentageOfTotal: number
        }
        consumptionPatterns: {
            dailyAverage: number
            monthlyTotal: number
            yearlyProjection: number
            seasonalVariation: any
        }
        costBreakdown: {
            energyCharges: number
            demandCharges: number
            fixedCharges: number
            taxes: number
            penalties: number
            totalCost: number
        }
    }
    comparisonData?: {
        baselineBillId: mongoose.Types.ObjectId
        optimizedScenarioId: mongoose.Types.ObjectId
        savings: {
            amount: number
            percentage: number
        }
        recommendations: string[]
    }
    dashboardMetrics: {
        totalSavings: number
        averageUnitCost: number
        powerFactor: number
        efficiency: number
        carbonFootprint: number
    }
    reportingPeriod: {
        startDate: Date
        endDate: Date
        frequency: "monthly" | "quarterly" | "yearly"
    }
    createdAt: Date
    updatedAt: Date
}

const analyticsSchema = new Schema<IAnalytics>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    billId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UtilityBill"
    },
    kpiMetrics: {
        unitCostTrends: {
            current: { type: Number, required: true },
            previous: { type: Number, required: true },
            percentageChange: { type: Number, required: true },
            trend: {
                type: String,
                enum: ["increasing", "decreasing", "stable"],
                required: true
            }
        },
        peakOffPeakUsage: {
            peakHours: {
                consumption: { type: Number, required: true },
                cost: { type: Number, required: true },
                hours: [{ type: String }]
            },
            offPeakHours: {
                consumption: { type: Number, required: true },
                cost: { type: Number, required: true },
                hours: [{ type: String }]
            },
            ratio: { type: Number, required: true }
        },
        demandCharges: {
            maxDemand: { type: Number, required: true },
            averageDemand: { type: Number, required: true },
            demandCost: { type: Number, required: true },
            demandPercentageOfTotal: { type: Number, required: true }
        },
        consumptionPatterns: {
            dailyAverage: { type: Number, required: true },
            monthlyTotal: { type: Number, required: true },
            yearlyProjection: { type: Number, required: true },
            seasonalVariation: Schema.Types.Mixed
        },
        costBreakdown: {
            energyCharges: { type: Number, required: true },
            demandCharges: { type: Number, required: true },
            fixedCharges: { type: Number, required: true },
            taxes: { type: Number, required: true },
            penalties: { type: Number, default: 0 },
            totalCost: { type: Number, required: true }
        }
    },
    comparisonData: {
        baselineBillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UtilityBill"
        },
        optimizedScenarioId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Scenario"
        },
        savings: {
            amount: { type: Number },
            percentage: { type: Number }
        },
        recommendations: [{ type: String }]
    },
    dashboardMetrics: {
        totalSavings: { type: Number, required: true },
        averageUnitCost: { type: Number, required: true },
        powerFactor: { type: Number, required: true },
        efficiency: { type: Number, required: true },
        carbonFootprint: { type: Number, required: true }
    },
    reportingPeriod: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        frequency: {
            type: String,
            enum: ["monthly", "quarterly", "yearly"],
            required: true
        }
    }
}, {
    timestamps: true
})

analyticsSchema.index({ userId: 1, createdAt: -1 })
analyticsSchema.index({ billId: 1 })
analyticsSchema.index({ "reportingPeriod.startDate": 1, "reportingPeriod.endDate": 1 })

export default mongoose.model<IAnalytics>("Analytics", analyticsSchema)