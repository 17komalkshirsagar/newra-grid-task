export interface IBill {
    _id?: string;
    userId?: string;
    fileName?: string;
    originalFile?: string;
    filePath?: string;
    fileSize?: number;
    uploadDate?: Date;
    consumerNumber?: string;
    billingMonth?: string;
    billingYear?: number;
    totalAmount?: number;
    unitsConsumed?: number;
    processingStatus: "pending" | "processing" | "completed" | "failed" | "Processing" | "Completed";
    extractedData?: {
        accountNumber?: string;
        billingPeriod?: {
            startDate: Date;
            endDate: Date;
        };
        totalAmount?: number;
        dueDate?: Date;
        consumption?: {
            current: number;
            previous: number;
            difference: number;
            unit: string;
        };
        tariffDetails?: {
            unitRate: number;
            fixedCharges: number;
            demandCharges?: number;
        };
        additionalCharges?: {
            taxes: number;
            penalties: number;
            adjustments: number;
        };
    };
    ocrText?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IBillUploadResponse {
    message: string;
    result: IBill;
}

export interface IBillData {
    _id: string;
    fileName: string;
    uploadDate: Date;
    processingStatus: string;
    extractedData: IBill['extractedData'];
}