export interface IReport {
    _id?: string;
    userId: string;
    title: string;
    description?: string;
    type: "savings_analysis" | "consumption_report" | "cost_breakdown" | "efficiency_metrics" | "custom";
    format: "pdf" | "excel" | "csv" | "json";
    configuration: {
        dateRange: {
            startDate: Date;
            endDate: Date;
        };
        includedMetrics: string[];
        chartTypes: Array<{
            metric: string;
            chartType: "bar" | "line" | "pie" | "area";
        }>;
        filters?: {
            billIds?: string[];
            scenarioIds?: string[];
            categories?: string[];
        };
        customQueries?: Array<{
            name: string;
            query: string;
        }>;
    };
    data?: {
        summary: Record<string, any>;
        details: Array<Record<string, any>>;
        charts: Array<{
            title: string;
            type: string;
            data: any[];
        }>;
    };
    generatedAt?: Date;
    filePath?: string;
    status: "pending" | "generating" | "completed" | "failed";
    schedule?: {
        frequency: "once" | "daily" | "weekly" | "monthly" | "quarterly";
        nextRun?: Date;
        enabled: boolean;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IReportTemplate {
    _id?: string;
    name: string;
    description?: string;
    type: IReport['type'];
    defaultConfiguration: IReport['configuration'];
    isSystem: boolean;
    createdBy?: string;
    createdAt?: Date;
}