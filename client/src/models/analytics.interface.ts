export interface IUnitCostTrends {
    current: number;
    previous: number;
    percentageChange: number;
    trend: "increasing" | "decreasing" | "stable";
}

export interface IPeakOffPeakUsage {
    peakHours: {
        consumption: number;
        cost: number;
        hours: string[];
    };
    offPeakHours: {
        consumption: number;
        cost: number;
        hours: string[];
    };
    ratio: number;
}

export interface IDemandCharges {
    maxDemand: number;
    averageDemand: number;
    demandCost: number;
    demandPercentageOfTotal: number;
}

export interface IConsumptionPatterns {
    dailyAverage: number;
    monthlyTotal: number;
    yearlyProjection: number;
    seasonalVariation: Record<string, number>;
}

export interface ICostBreakdown {
    energyCharges: number;
    demandCharges: number;
    fixedCharges: number;
    taxes: number;
    penalties: number;
    totalCost: number;
}

export interface IComparisonData {
    baselineBillId: string;
    optimizedScenarioId: string;
    savings: {
        amount: number;
        percentage: number;
    };
    recommendations: string[];
}

export interface IDashboardMetrics {
    totalSavings: number;
    averageUnitCost: number;
    powerFactor: number;
    efficiency: number;
    carbonFootprint: number;
}

export interface IReportingPeriod {
    startDate: Date;
    endDate: Date;
    frequency: "monthly" | "quarterly" | "yearly";
}

export interface IAnalytics {
    _id?: string;
    userId: string;
    billId?: string;
    kpiMetrics: {
        unitCostTrends: IUnitCostTrends;
        peakOffPeakUsage: IPeakOffPeakUsage;
        demandCharges: IDemandCharges;
        consumptionPatterns: IConsumptionPatterns;
        costBreakdown: ICostBreakdown;
    };
    comparisonData?: IComparisonData;
    dashboardMetrics: IDashboardMetrics;
    reportingPeriod: IReportingPeriod;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IDashboardResponseData {
    kpiSummary: {
        totalSavings: number;
        averageUnitCost: number;
        averageEfficiency: number;
        totalCarbonFootprint: number;
    };
    trends: Array<{
        period: IReportingPeriod;
        unitCost: IUnitCostTrends;
        consumption: IConsumptionPatterns;
        costBreakdown: ICostBreakdown;
    }>;
    peakOffPeakAnalysis: IPeakOffPeakUsage;
    demandAnalysis: IDemandCharges;
}

export interface IKPITrendsData {
    period: IReportingPeriod;
    unitCost: number;
    totalConsumption: number;
    totalCost: number;
    efficiency: number;
    savings: number;
}

export interface IComparisonResponseData extends IComparisonData {
    baselineUtilityBillId: string;
    optimizedScenarioId: string;
}

export interface IMessageResponse {
    message: string;
}

export interface ISingleResultResponse<T> extends IMessageResponse {
    result: T;
}

export interface ISuccessDataResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
