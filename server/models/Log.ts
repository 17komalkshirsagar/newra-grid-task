import mongoose from "mongoose"

export interface ILog extends mongoose.Document {

    userId?: mongoose.Types.ObjectId
    sessionId?: string
    ipAddress?: string
    userAgent?: string


    action: string
    module: 'auth' | 'bill' | 'simulation' | 'report' | 'analytics' | 'integration' | 'user' | 'system'
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    endpoint?: string


    level: 'info' | 'warn' | 'error' | 'debug' | 'trace'


    message: string
    description?: string


    resourceType?: 'Bill' | 'Simulation' | 'Report' | 'User' | 'Analytics' | 'Integration'
    billId?: mongoose.Types.ObjectId
    simulationId?: mongoose.Types.ObjectId
    reportId?: mongoose.Types.ObjectId
    analyticsId?: mongoose.Types.ObjectId
    integrationId?: mongoose.Types.ObjectId

    requestData?: any
    responseData?: any
    responseStatus?: number
    responseTime?: number


    errorCode?: string
    errorMessage?: string
    stackTrace?: string


    executionTime?: number
    memoryUsage?: number
    cpuUsage?: number


    fileOperations?: {
        fileName?: string
        fileSize?: number
        processingTime?: number
        ocrConfidence?: number
        extractedFieldsCount?: number
    }


    businessContext?: {
        billProcessingStage?: 'upload' | 'ocr' | 'validation' | 'storage' | 'completed'
        simulationStage?: 'parameter_setup' | 'calculation' | 'optimization' | 'results_generation'
        reportGenerationStage?: 'data_collection' | 'processing' | 'formatting' | 'export'
        integrationStage?: 'authentication' | 'data_mapping' | 'export' | 'verification'
    }


    tags?: string[]
    environment: 'development' | 'staging' | 'production'
    version?: string


    timestamp: Date
    createdAt: Date
}

const logSchema = new mongoose.Schema<ILog>({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    sessionId: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },


    action: {
        type: String,
        required: true,
        trim: true
    },
    module: {
        type: String,
        enum: ['auth', 'bill', 'simulation', 'report', 'analytics', 'integration', 'user', 'system'],
        required: true
    },
    method: {
        type: String,
        enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    },
    endpoint: { type: String },


    level: {
        type: String,
        enum: ['info', 'warn', 'error', 'debug', 'trace'],
        required: true,
        default: 'info'
    },


    message: {
        type: String,
        required: true
    },
    description: { type: String },


    resourceType: {
        type: String,
        enum: ['UtilityBill', 'Simulation', 'Report', 'User', 'Analytics', 'Integration']
    },
    billId: { type: mongoose.Schema.Types.ObjectId, ref: "UtilityBill" },
    simulationId: { type: mongoose.Schema.Types.ObjectId, ref: "Simulation" },
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
    analyticsId: { type: mongoose.Schema.Types.ObjectId, ref: "Analytics" },
    integrationId: { type: mongoose.Schema.Types.ObjectId, ref: "Integration" },


    requestData: mongoose.Schema.Types.Mixed,
    responseData: mongoose.Schema.Types.Mixed,
    responseStatus: { type: Number },
    responseTime: { type: Number },


    errorCode: { type: String },
    errorMessage: { type: String },
    stackTrace: { type: String },


    executionTime: { type: Number },
    memoryUsage: { type: Number },
    cpuUsage: { type: Number },

    fileOperations: {
        fileName: { type: String },
        fileSize: { type: Number },
        processingTime: { type: Number },
        ocrConfidence: { type: Number },
        extractedFieldsCount: { type: Number }
    },


    businessContext: {
        billProcessingStage: {
            type: String,
            enum: ['upload', 'ocr', 'validation', 'storage', 'completed']
        },
        simulationStage: {
            type: String,
            enum: ['parameter_setup', 'calculation', 'optimization', 'results_generation']
        },
        reportGenerationStage: {
            type: String,
            enum: ['data_collection', 'processing', 'formatting', 'export']
        },
        integrationStage: {
            type: String,
            enum: ['authentication', 'data_mapping', 'export', 'verification']
        }
    },


    tags: [{ type: String }],
    environment: {
        type: String,
        enum: ['development', 'staging', 'production'],
        required: true,
        default: 'development'
    },
    version: { type: String },


    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: true
})

logSchema.index({ userId: 1, timestamp: -1 })
logSchema.index({ module: 1, timestamp: -1 })
logSchema.index({ level: 1, timestamp: -1 })
logSchema.index({ action: 1, timestamp: -1 })
logSchema.index({ resourceType: 1 })
logSchema.index({ billId: 1 })
logSchema.index({ simulationId: 1 })
logSchema.index({ reportId: 1 })
logSchema.index({ timestamp: -1 })
logSchema.index({ environment: 1, timestamp: -1 })


logSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 })

export default mongoose.model<ILog>("Log", logSchema)