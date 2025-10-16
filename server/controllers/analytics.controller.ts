import { Request, Response, NextFunction } from "express"
import asyncHandler from "express-async-handler"
import Analytics from "../models/Analytics"
import { UtilityBill } from "../models/UtilityBill"
import Scenario from "../models/Scenario"
import { customValidator } from "../utils/validator"
import { createAnalyticsRules, getDashboardAnalyticsRules, getAnalyticsByIdRules, generateBillAnalyticsRules, compareScenarioAnalyticsRules, getKPITrendsRules } from "../rules/analytics.rules"

export const createAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const userId = (req.user as any)?.userId

    const { isError, error } = customValidator(req.body, createAnalyticsRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error });
    }

    const { billId, kpiMetrics, comparisonData, dashboardMetrics, reportingPeriod } = req.body

    const analytics = new Analytics({ userId, billId, kpiMetrics, comparisonData, dashboardMetrics, reportingPeriod })

    const savedAnalytics = await analytics.save()

    res.status(201).json({ message: "Analytics data created successfully", result: savedAnalytics })
})

export const getDashboardAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const userId = (req.user as any)?.userId
    const { timeRange = "12months" } = req.query
    const analytics = await Analytics.find({ userId }).populate("billId", "consumerNumber totalAmount billPeriod unitsConsumed").sort({ createdAt: -1 }).limit(12)

    if (!analytics.length) {
        return res.status(404).json({ message: "No analytics data found" })
    }


    const latestAnalytics = analytics[0]
    const previousAnalytics = analytics[1] || analytics[0]

    const kpiMetrics = {
        totalConsumption: analytics.reduce((sum, item) => sum + item.kpiMetrics.consumptionPatterns.monthlyTotal, 0),
        averageUnitCost: analytics.reduce((sum, item) => sum + item.dashboardMetrics.averageUnitCost, 0) / analytics.length,
        totalBillAmount: analytics.reduce((sum, item) => sum + item.kpiMetrics.costBreakdown.totalCost, 0),
        peakDemand: Math.max(...analytics.map(item => item.kpiMetrics.demandCharges.maxDemand)),
        consumptionTrend: ((latestAnalytics.kpiMetrics.consumptionPatterns.monthlyTotal - previousAnalytics.kpiMetrics.consumptionPatterns.monthlyTotal) / previousAnalytics.kpiMetrics.consumptionPatterns.monthlyTotal) * 100,
        costTrend: ((latestAnalytics.dashboardMetrics.averageUnitCost - previousAnalytics.dashboardMetrics.averageUnitCost) / previousAnalytics.dashboardMetrics.averageUnitCost) * 100,
        billTrend: ((latestAnalytics.kpiMetrics.costBreakdown.totalCost - previousAnalytics.kpiMetrics.costBreakdown.totalCost) / previousAnalytics.kpiMetrics.costBreakdown.totalCost) * 100,
        demandTrend: ((latestAnalytics.kpiMetrics.demandCharges.maxDemand - previousAnalytics.kpiMetrics.demandCharges.maxDemand) / previousAnalytics.kpiMetrics.demandCharges.maxDemand) * 100
    }

    const monthlyTrends = analytics.slice(0, 12).reverse().map((item, index) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const date = new Date(item.reportingPeriod.startDate)
        return {
            month: monthNames[date.getMonth()],
            consumption: item.kpiMetrics.consumptionPatterns.monthlyTotal,
            cost: item.kpiMetrics.costBreakdown.totalCost,
            demand: item.kpiMetrics.demandCharges.maxDemand
        }
    })


    const peakOffPeakData = [
        {
            time: '00:00',
            peak: latestAnalytics.kpiMetrics.peakOffPeakUsage.peakHours.consumption * 0.1,
            offPeak: latestAnalytics.kpiMetrics.peakOffPeakUsage.offPeakHours.consumption * 0.1,
            shoulder: latestAnalytics.kpiMetrics.peakOffPeakUsage.peakHours.consumption * 0.05
        },
        {
            time: '06:00',
            peak: latestAnalytics.kpiMetrics.peakOffPeakUsage.peakHours.consumption * 0.3,
            offPeak: latestAnalytics.kpiMetrics.peakOffPeakUsage.offPeakHours.consumption * 0.3,
            shoulder: latestAnalytics.kpiMetrics.peakOffPeakUsage.peakHours.consumption * 0.15
        },
        {
            time: '12:00',
            peak: latestAnalytics.kpiMetrics.peakOffPeakUsage.peakHours.consumption * 0.6,
            offPeak: latestAnalytics.kpiMetrics.peakOffPeakUsage.offPeakHours.consumption * 0.4,
            shoulder: latestAnalytics.kpiMetrics.peakOffPeakUsage.peakHours.consumption * 0.3
        },
        {
            time: '18:00',
            peak: latestAnalytics.kpiMetrics.peakOffPeakUsage.peakHours.consumption,
            offPeak: latestAnalytics.kpiMetrics.peakOffPeakUsage.offPeakHours.consumption * 0.6,
            shoulder: latestAnalytics.kpiMetrics.peakOffPeakUsage.peakHours.consumption * 0.4
        }
    ]


    const costBreakdown = [
        {
            name: 'Energy Charges',
            value: Math.round((latestAnalytics.kpiMetrics.costBreakdown.energyCharges / latestAnalytics.kpiMetrics.costBreakdown.totalCost) * 100),
            amount: latestAnalytics.kpiMetrics.costBreakdown.energyCharges
        },
        {
            name: 'Demand Charges',
            value: Math.round((latestAnalytics.kpiMetrics.costBreakdown.demandCharges / latestAnalytics.kpiMetrics.costBreakdown.totalCost) * 100),
            amount: latestAnalytics.kpiMetrics.costBreakdown.demandCharges
        },
        {
            name: 'Fixed Charges',
            value: Math.round((latestAnalytics.kpiMetrics.costBreakdown.fixedCharges / latestAnalytics.kpiMetrics.costBreakdown.totalCost) * 100),
            amount: latestAnalytics.kpiMetrics.costBreakdown.fixedCharges
        },
        {
            name: 'Taxes & Surcharges',
            value: Math.round((latestAnalytics.kpiMetrics.costBreakdown.taxes / latestAnalytics.kpiMetrics.costBreakdown.totalCost) * 100),
            amount: latestAnalytics.kpiMetrics.costBreakdown.taxes
        }
    ]


    const tariffComparison = [
        {
            category: 'Industrial',
            current: latestAnalytics.dashboardMetrics.averageUnitCost,
            optimized: latestAnalytics.dashboardMetrics.averageUnitCost * 0.85,
            savings: 15.0
        },
        {
            category: 'Commercial',
            current: latestAnalytics.dashboardMetrics.averageUnitCost * 0.9,
            optimized: latestAnalytics.dashboardMetrics.averageUnitCost * 0.8,
            savings: 11.1
        },
        {
            category: 'Time-of-Use',
            current: latestAnalytics.dashboardMetrics.averageUnitCost * 1.1,
            optimized: latestAnalytics.dashboardMetrics.averageUnitCost * 0.92,
            savings: 16.4
        }
    ]


    const insights = [
        {
            title: "Peak Demand Optimization",
            description: `Shifting ${Math.round((latestAnalytics.kpiMetrics.peakOffPeakUsage.peakHours.consumption / (latestAnalytics.kpiMetrics.peakOffPeakUsage.peakHours.consumption + latestAnalytics.kpiMetrics.peakOffPeakUsage.offPeakHours.consumption)) * 15)}% of peak usage to off-peak hours could save ₹${Math.round(latestAnalytics.dashboardMetrics.totalSavings * 0.8).toLocaleString()} annually`
        },
        {
            title: "Tariff Plan Recommendation",
            description: `Switching to Time-of-Use tariff could reduce costs by ${Math.round(((latestAnalytics.dashboardMetrics.averageUnitCost - latestAnalytics.dashboardMetrics.averageUnitCost * 0.92) / latestAnalytics.dashboardMetrics.averageUnitCost) * 100)}%`
        },
        {
            title: "Power Factor Improvement",
            description: `Improving power factor to 0.95 could eliminate penalty charges worth ₹${Math.round(latestAnalytics.kpiMetrics.costBreakdown.penalties || latestAnalytics.kpiMetrics.costBreakdown.totalCost * 0.02).toLocaleString()}`
        },
        {
            title: "Renewable Integration",
            description: `25% solar integration could provide ${Math.round(latestAnalytics.dashboardMetrics.totalSavings / latestAnalytics.kpiMetrics.costBreakdown.totalCost * 100)}% cost reduction with 3-year ROI`
        }
    ]

    const dashboardData = { kpiMetrics, monthlyTrends, peakOffPeakData, costBreakdown, tariffComparison, insights }

    res.status(200).json({ message: "Dashboard analytics fetched successfully", result: dashboardData })
})

export const getAnalyticsById = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params

    const { isError, error } = customValidator(req.params, getAnalyticsByIdRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error });
    }

    const userId = (req.user as any)?.userId

    const analytics = await Analytics.findOne({ _id: id, userId })
        .populate("billId").populate("comparisonData.baselineUtilityBillId").populate("comparisonData.optimizedScenarioId")

    if (!analytics) { return res.status(409).json({ message: "Analytics data not found" }) }

    res.status(200).json({ message: "Analytics data fetched successfully", result: analytics })
})

export const generateUtilityBillAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { billId } = req.params
    const userId = (req.user as any)?.userId

    const bill = await UtilityBill.findById(billId)

    if (!bill) {
        return res.status(409).json({ success: false, message: "UtilityBill not found" })
    }

    const kpiMetrics = {
        unitCostTrends: {
            current: bill.totalAmount / bill.unitsConsumed,
            previous: bill.totalAmount / bill.unitsConsumed,
            percentageChange: 0, trend: "stable" as const
        },
        peakOffPeakUsage: {
            peakHours: {
                consumption: bill.peakUsage || 0,
                cost: (bill.energyCharges || 0) * 0.6,
                hours: ["09:00-18:00"]
            },
            offPeakHours: {
                consumption: bill.offPeakUsage || 0,
                cost: (bill.energyCharges || 0) * 0.4,
                hours: ["18:00-09:00"]
            },
            ratio: (bill.peakUsage || 0) / (bill.offPeakUsage || 1)
        },
        demandCharges: {
            maxDemand: bill.maximumDemand || 0,
            averageDemand: bill.maximumDemand || 0,
            demandCost: bill.demandCharges || 0,
            demandPercentageOfTotal: ((bill.demandCharges || 0) / bill.totalAmount) * 100
        },
        consumptionPatterns: {
            dailyAverage: bill.unitsConsumed / 30,
            monthlyTotal: bill.unitsConsumed,
            yearlyProjection: bill.unitsConsumed * 12,
            seasonalVariation: {}
        },
        costBreakdown: {
            energyCharges: bill.energyCharges || 0,
            demandCharges: bill.demandCharges || 0,
            fixedCharges: bill.fixedCharges,
            taxes: (bill.gst || 0) + (bill.vat || 0) + (bill.electricityDuty || 0),
            penalties: bill.penalties || 0,
            totalCost: bill.totalAmount
        }
    }

    const dashboardMetrics = {
        totalSavings: 0,
        averageUnitCost: bill.totalAmount / bill.unitsConsumed,
        powerFactor: bill.powerFactor || 0.85,
        efficiency: 85,
        carbonFootprint: bill.unitsConsumed * 0.82
    }

    const analytics = new Analytics({
        userId,
        billId,
        kpiMetrics,
        dashboardMetrics,
        reportingPeriod: {
            startDate: new Date(bill.billIssueDate || new Date()),
            endDate: new Date(bill.billDueDate || new Date()),
            frequency: "monthly"
        }
    })

    const savedAnalytics = await analytics.save()

    res.status(201).json({
        success: true, message: "UtilityBill analytics generated successfully", data: savedAnalytics
    })
})

export const compareScenarioAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { baselineUtilityBillId, scenarioId } = req.body
    const userId = (req.user as any)?.userId

    const bill = await UtilityBill.findById(baselineUtilityBillId)
    const scenario = await Scenario.findById(scenarioId)

    if (!bill || !scenario) {
        return res.status(404).json({
            success: false,
            message: "UtilityBill or scenario not found"
        })
    }

    const savings = {
        amount: bill.totalAmount - scenario.projectedTotalAmount,
        percentage: ((bill.totalAmount - scenario.projectedTotalAmount) / bill.totalAmount) * 100
    }

    const comparisonAnalytics = {
        baselineUtilityBillId,
        optimizedScenarioId: scenarioId,
        savings,
        recommendations: [`${scenario.scenarioType} scenario`, `Projected savings: ₹${savings.amount.toFixed(2)}`, `Annual savings: ₹${scenario.annualSavings.toFixed(2)}`]
    }

    res.status(200).json({ success: true, data: comparisonAnalytics })
})

export const getKPITrends = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const userId = (req.user as any)?.userId
    const { months = 6 } = req.query

    const analytics = await Analytics.find({ userId })
        .sort({ createdAt: -1 })
        .limit(Number(months))

    const trends = analytics.map(item => ({
        period: item.reportingPeriod,
        unitCost: item.kpiMetrics.unitCostTrends.current,
        totalConsumption: item.kpiMetrics.consumptionPatterns.monthlyTotal,
        totalCost: item.kpiMetrics.costBreakdown.totalCost,
        efficiency: item.dashboardMetrics.efficiency,
        savings: item.dashboardMetrics.totalSavings
    }))

    res.status(200).json({ success: true, data: trends })
})

export const updateAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params
    const userId = (req.user as any)?.userId

    const { isError, error } = customValidator(req.body, createAnalyticsRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error });
    }

    const analytics = await Analytics.findOne({ _id: id, userId })

    if (!analytics) {
        return res.status(404).json({ message: "Analytics data not found" })
    }

    const updatedAnalytics = await Analytics.findByIdAndUpdate(id, { ...req.body, updatedAt: new Date() }, { new: true, runValidators: true })

    res.status(200).json({ message: "Analytics data updated successfully", result: updatedAnalytics })
})

export const deleteAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params
    const userId = (req.user as any)?.userId

    const analytics = await Analytics.findOne({ _id: id, userId })

    if (!analytics) {
        return res.status(404).json({ message: "Analytics data not found" })
    }

    await Analytics.findByIdAndDelete(id)

    res.status(200).json({ message: "Analytics data deleted successfully" })
})