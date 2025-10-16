import mongoose from "mongoose"

export interface IReport extends mongoose.Document {
    title: string
    user: mongoose.Types.ObjectId


    type: 'PDF' | 'Excel'
    reportCategory: 'bill_analysis' | 'scenario_comparison' | 'kpi_dashboard' | 'cost_optimization' | 'powerbi_export' | 'erp_export'


    sourceData: {
        bill?: mongoose.Types.ObjectId[]
        simulation?: mongoose.Types.ObjectId[]
        analytics?: mongoose.Types.ObjectId[]
        dateRange?: {
            startDate: Date
            endDate: Date
        }
    }


    content: {

        summary?: {
            totalSavings: number
            percentageSavings: number
            recommendedActions: string[]
            implementationPriority: 'High' | 'Medium' | 'Low'
        }


        billAnalysis?: {
            baselineBill: any
            optimizedBill: any
            comparison: {
                energyChargesDiff: number
                demandChargesDiff: number
                fixedChargesDiff: number
                totalSavings: number
            }
        }

        // KPI Tracking Data
        kpiData?: {
            unitCostTrends: any[]
            peakOffPeakUsage: any
            demandCharges: any
            consumptionPatterns: any
            costBreakdown: any
        }

        // Scenario Comparisons
        scenarioComparisons?: {
            scenarios: any[]
            bestOption: any
            worstOption: any
            recommendations: string[]
        }

        // Charts and Visualizations
        charts?: {
            consumptionTrends: any
            costBreakdown: any
            savingsProjection: any
            demandPattern: any
        }

        // Export Data (for Power BI/ERP)
        exportData?: any
    }

    // File Information
    fileName: string
    filePath?: string
    fileSize?: number
    fileUrl?: string

    // Generation Status
    status: 'generating' | 'completed' | 'failed' | 'expired'
    generationTime?: number // milliseconds
    errorMessage?: string

    // Report Settings
    settings: {
        includeCharts: boolean
        includeRawData: boolean
        includeRecommendations: boolean
        language: 'en' | 'hi' // English or Hindi
        currency: 'INR' | 'USD'
        dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY'
    }

    // Access Control
    accessLevel: 'private' | 'shared' | 'public'
    userId: mongoose.Types.ObjectId
    expiryDate?: Date

    // Metadata
    tags?: string[]
    downloadCount: number
    lastDownloaded?: Date

    createdAt: Date
    updatedAt: Date
}

const reportSchema = new mongoose.Schema<IReport>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    type: {
        type: String,
        enum: ['PDF', 'Excel'],
        required: true
    },
    reportCategory: {
        type: String,
        enum: ['bill_analysis', 'scenario_comparison', 'kpi_dashboard', 'cost_optimization', 'powerbi_export', 'erp_export'],
        required: true
    },

    sourceData: {
        billId: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "UtilityBill"
        }],
        simulationId: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Scenario"
        }],
        analyticsId: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Analytics"
        }],
        dateRange: {
            startDate: { type: Date },
            endDate: { type: Date }
        }
    },

    content: {
        summary: {
            totalSavings: { type: Number },
            percentageSavings: { type: Number },
            recommendedActions: [{ type: String }],
            implementationPriority: {
                type: String,
                enum: ['High', 'Medium', 'Low']
            }
        },

        billAnalysis: {
            baselineBill: mongoose.Schema.Types.Mixed,
            optimizedBill: mongoose.Schema.Types.Mixed,
            comparison: {
                energyChargesDiff: { type: Number },
                demandChargesDiff: { type: Number },
                fixedChargesDiff: { type: Number },
                totalSavings: { type: Number }
            }
        },

        kpiData: {
            unitCostTrends: [mongoose.Schema.Types.Mixed],
            peakOffPeakUsage: mongoose.Schema.Types.Mixed,
            demandCharges: mongoose.Schema.Types.Mixed,
            consumptionPatterns: mongoose.Schema.Types.Mixed,
            costBreakdown: mongoose.Schema.Types.Mixed
        },

        scenarioComparisons: {
            scenarios: [mongoose.Schema.Types.Mixed],
            bestOption: mongoose.Schema.Types.Mixed,
            worstOption: mongoose.Schema.Types.Mixed,
            recommendations: [{ type: String }]
        },

        charts: {
            consumptionTrends: mongoose.Schema.Types.Mixed,
            costBreakdown: mongoose.Schema.Types.Mixed,
            savingsProjection: mongoose.Schema.Types.Mixed,
            demandPattern: mongoose.Schema.Types.Mixed
        },

        exportData: mongoose.Schema.Types.Mixed
    },

    fileName: {
        type: String,
        required: true
    },
    filePath: { type: String },
    fileSize: { type: Number },
    fileUrl: { type: String },

    status: {
        type: String,
        enum: ['generating', 'completed', 'failed', 'expired'],
        default: 'generating'
    },
    generationTime: { type: Number },
    errorMessage: { type: String },

    settings: {
        includeCharts: { type: Boolean, default: true },
        includeRawData: { type: Boolean, default: false },
        includeRecommendations: { type: Boolean, default: true },
        language: { type: String, enum: ['en', 'hi'], default: 'en' },
        currency: { type: String, enum: ['INR', 'USD'], default: 'INR' },
        dateFormat: { type: String, enum: ['DD/MM/YYYY', 'MM/DD/YYYY'], default: 'DD/MM/YYYY' }
    },

    accessLevel: {
        type: String,
        enum: ['private', 'shared', 'public'],
        default: 'private'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    expiryDate: { type: Date },

    tags: [{ type: String }],
    downloadCount: { type: Number, default: 0 },
    lastDownloaded: { type: Date }
}, {
    timestamps: true
})

reportSchema.index({ userId: 1, createdAt: -1 })
reportSchema.index({ reportCategory: 1 })
reportSchema.index({ status: 1 })
reportSchema.index({ type: 1 })
reportSchema.index({ expiryDate: 1 })

export default mongoose.model<IReport>("Report", reportSchema)