export interface IIntegration {
    _id?: string;
    userId: string;
    name: string;
    type: "PowerBI" | "ERP" | "Excel" | "API";
    configuration: {
        endpoint?: string;
        apiKey?: string;
        credentials?: any;
        mapping?: any;
        schedule?: {
            frequency: "manual" | "daily" | "weekly" | "monthly";
            time?: string;
            dayOfWeek?: number;
            dayOfMonth?: number;
        };
    };
    exportSettings: {
        dataTypes: string[];
        filters?: any;
        format: "JSON" | "XML" | "CSV" | "Excel";
        includeFields: string[];
        excludeFields?: string[];
    };
    lastExport?: {
        timestamp: Date;
        status: "success" | "failed" | "partial";
        recordsExported: number;
        errorMessage?: string;
        exportUrl?: string;
    };
    status: "active" | "inactive" | "error";
    metadata: {
        description?: string;
        tags?: string[];
        createdBy: string;
        version: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IIntegrationTest {
    connectionStatus: "connected" | "failed";
    responseTime: number;
    dataPreview?: any[];
    errorMessage?: string;
}