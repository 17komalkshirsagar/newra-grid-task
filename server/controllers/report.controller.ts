import { Request, Response, NextFunction } from "express"
import asyncHandler from "express-async-handler"
import Report from "../models/Report"
import { UtilityBill } from "../models/UtilityBill"
import Scenario from "../models/Scenario"

export const createReport = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { title, type, billId, scenarioId, reportData } = req.body
    const userId = (req.user as any)?.userId

    const report = new Report({
        title,
        user: userId,
        userId,
        type,
        reportCategory: 'bill_analysis',
        sourceData: {
            billId: billId ? [billId] : [],
            simulationId: scenarioId ? [scenarioId] : []
        },
        content: reportData,
        fileName: `${title}_${Date.now()}.${type.toLowerCase()}`,
        status: "generating",
        settings: {
            includeCharts: true,
            includeRawData: false,
            includeRecommendations: true,
            language: 'en',
            currency: 'INR',
            dateFormat: 'DD/MM/YYYY'
        },
        accessLevel: 'private',
        downloadCount: 0
    })

    const savedReport = await report.save()

    res.status(201).json({
        message: "Report generation started",
        result: savedReport
    })
})

export const getAllReports = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const userId = (req.user as any)?.userId
    const { page = 1, limit = 10, type, status } = req.query

    const filter: any = { userId: userId }
    if (type) filter.type = type
    if (status) filter.status = status

    const reports = await Report.find(filter)
        .populate("sourceData.billId", "consumerNumber billPeriod totalAmount")
        .populate("sourceData.simulationId", "name description")
        .sort({ createdAt: -1 })
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit))

    const total = await Report.countDocuments(filter)


    const transformedReports = reports.map(report => ({
        _id: report._id,
        title: report.title,
        type: report.type,
        reportCategory: report.reportCategory,
        status: report.status,
        fileName: report.fileName,
        fileSize: report.fileSize,
        downloadCount: report.downloadCount,
        lastDownloaded: report.lastDownloaded,
        settings: report.settings,
        accessLevel: report.accessLevel,
        expiryDate: report.expiryDate,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt
    }))

    res.status(200).json({
        result: transformedReports, pagination: {
            current: Number(page),
            pages: Math.ceil(total / Number(limit)), total
        }
    })
})

export const getReportById = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params
    const userId = (req.user as any)?.userId

    const report = await Report.findOne({ _id: id, userId: userId })
        .populate("sourceData.billId")
        .populate("sourceData.simulationId")
        .populate("user", "firstName lastName email")

    if (!report) {
        return res.status(404).json({
            success: false,
            message: "Report not found"
        })
    }

    res.status(200).json({ result: report })
})

export const updateReportStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params
    const { status, fileUrl, fileSize } = req.body
    const userId = (req.user as any)?.userId

    const report = await Report.findOne({ _id: id, userId: userId })

    if (!report) {
        return res.status(404).json({
            success: false,
            message: "Report not found"
        })
    }

    report.status = status
    if (fileUrl) report.fileUrl = fileUrl
    if (fileSize) report.fileSize = fileSize

    await report.save()

    res.status(200).json({ message: "Report status updated", result: report })
})

export const deleteReport = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params
    const userId = (req.user as any)?.userId

    const report = await Report.findOne({ _id: id, userId: userId })

    if (!report) {
        return res.status(404).json({
            success: false,
            message: "Report not found"
        })
    }

    await Report.findByIdAndDelete(id)

    res.status(200).json({ message: "Report deleted successfully" })
})

export const downloadReport = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params
    const userId = (req.user as any)?.userId

    const report = await Report.findOne({ _id: id, userId: userId })

    if (!report) {
        return res.status(404).json({
            success: false,
            message: "Report not found"
        })
    }

    if (report.status !== 'completed') {
        return res.status(400).json({
            success: false,
            message: "Report is not ready for download"
        })
    }


    await Report.findByIdAndUpdate(id, {
        $inc: { downloadCount: 1 },
        lastDownloaded: new Date()
    })


    res.status(200).json({ message: "Report download initiated", fileUrl: report.fileUrl || `/downloads/${report.fileName}`, fileName: report.fileName })
})

export const generateComparisonReport = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { billId, scenarioId, title, type = "PDF" } = req.body
    const userId = (req.user as any)?.userId

    const bill = await UtilityBill.findById(billId)
    const scenario = await Scenario.findById(scenarioId)

    if (!bill || !scenario) {
        return res.status(404).json({
            success: false,
            message: "UtilityBill or scenario not found"
        })
    }

    const comparisonData = {
        baselineUtilityBill: bill,
        optimizedScenario: scenario,
        comparison: {
            costSavings: bill.totalAmount - scenario.projectedTotalAmount,
            percentageSavings: ((bill.totalAmount - scenario.projectedTotalAmount) / bill.totalAmount) * 100,
            recommendations: [`${scenario.scenarioType} scenario`, `Cost savings: ₹${scenario.costSavings.toFixed(2)}`, `Annual savings: ₹${scenario.annualSavings.toFixed(2)}`]
        }
    }

    const report = new Report({
        title,
        user: userId,
        userId,
        type,
        reportCategory: 'scenario_comparison',
        sourceData: {
            billId: [billId],
            simulationId: [scenarioId]
        },
        content: comparisonData,
        fileName: `comparison_${Date.now()}.${type.toLowerCase()}`,
        status: "generating",
        settings: {
            includeCharts: true,
            includeRawData: false,
            includeRecommendations: true,
            language: 'en',
            currency: 'INR',
            dateFormat: 'DD/MM/YYYY'
        },
        accessLevel: 'private',
        downloadCount: 0
    })

    const savedReport = await report.save()

    res.status(201).json({
        message: "Comparison report generation started", result: savedReport
    })
})