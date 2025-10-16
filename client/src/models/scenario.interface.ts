export interface IScenario {
    _id?: string;
    userId: string;
    name: string;
    description?: string;
    configuration: {
        tariffOptimization?: {
            timeOfUseRates: boolean;
            demandChargeReduction: boolean;
            fixedChargeMinimization: boolean;
        };
        energyEfficiency?: {
            loadShifting: boolean;
            peakDemandReduction: boolean;
            powerFactorImprovement: boolean;
        };
        renewableIntegration?: {
            solarPanels: boolean;
            batteryStorage: boolean;
            gridTieConfiguration: boolean;
        };
        customParameters?: Record<string, any>;
    };
    simulationResults?: {
        projectedSavings: {
            monthly: number;
            yearly: number;
            percentage: number;
        };
        consumptionChanges: {
            peakReduction: number;
            loadShifting: number;
            overallEfficiency: number;
        };
        roi: {
            paybackPeriod: number;
            netPresentValue: number;
            internalRateOfReturn: number;
        };
    };
    status: "draft" | "simulated" | "implemented" | "archived";
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IScenarioComparison {
    scenario1: IScenario;
    scenario2: IScenario;
    comparison: {
        savingsComparison: {
            scenario1Savings: number;
            scenario2Savings: number;
            difference: number;
            betterOption: string;
        };
        implementationComplexity: {
            scenario1: "low" | "medium" | "high";
            scenario2: "low" | "medium" | "high";
        };
        recommendations: string[];
    };
}