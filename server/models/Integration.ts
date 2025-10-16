import mongoose, { Document, Schema } from "mongoose"

export interface IIntegration extends Document {
    name: string
    type: "PowerBI" | "ERP" | "Excel" | "API"
    userId: mongoose.Types.ObjectId
    configuration: {
        endpoint?: string
        apiKey?: string
        credentials?: any
        mapping?: any
        schedule?: {
            frequency: "manual" | "daily" | "weekly" | "monthly"
            time?: string
            dayOfWeek?: number
            dayOfMonth?: number
        }
    }
    exportSettings: {
        dataTypes: string[]
        filters?: any
        format: "JSON" | "XML" | "CSV" | "Excel"
        includeFields: string[]
        excludeFields?: string[]
    }
    lastExport?: {
        timestamp: Date
        status: "success" | "failed" | "partial"
        recordsExported: number
        errorMessage?: string
        exportUrl?: string
    }
    status: "active" | "inactive" | "error"
    metadata: {
        description?: string
        tags?: string[]
        createdBy: mongoose.Types.ObjectId
        version: string
    }
    createdAt: Date
    updatedAt: Date
}

const integrationSchema = new Schema<IIntegration>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ["PowerBI", "ERP", "Excel", "API"],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    configuration: {
        endpoint: { type: String },
        apiKey: { type: String },
        credentials: mongoose.Schema.Types.Mixed,
        mapping: mongoose.Schema.Types.Mixed,
        schedule: {
            frequency: {
                type: String,
                enum: ["manual", "daily", "weekly", "monthly"],
                default: "manual"
            },
            time: { type: String },
            dayOfWeek: { type: Number, min: 0, max: 6 },
            dayOfMonth: { type: Number, min: 1, max: 31 }
        }
    },
    exportSettings: {
        dataTypes: [{
            type: String,
            enum: ["bills", "scenarios", "analytics", "reports", "users"]
        }],
        filters: mongoose.Schema.Types.Mixed,
        format: {
            type: String,
            enum: ["JSON", "XML", "CSV", "Excel"],
            required: true
        },
        includeFields: [{ type: String }],
        excludeFields: [{ type: String }]
    },
    lastExport: {
        timestamp: { type: Date },
        status: {
            type: String,
            enum: ["success", "failed", "partial"]
        },
        recordsExported: { type: Number },
        errorMessage: { type: String },
        exportUrl: { type: String }
    },
    status: {
        type: String,
        enum: ["active", "inactive", "error"],
        default: "active"
    },
    metadata: {
        description: { type: String },
        tags: [{ type: String }],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        version: {
            type: String,
            default: "1.0.0"
        }
    }
}, {
    timestamps: true
})

integrationSchema.index({ userId: 1, type: 1 })
integrationSchema.index({ status: 1 })
integrationSchema.index({ "configuration.schedule.frequency": 1 })
integrationSchema.index({ "lastExport.timestamp": -1 })

export default mongoose.model<IIntegration>("Integration", integrationSchema)