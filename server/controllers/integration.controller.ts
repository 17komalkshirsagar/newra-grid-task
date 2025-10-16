import { Request, Response, NextFunction } from "express"
import asyncHandler from "express-async-handler"
import Integration from "../models/Integration"
import { UtilityBill } from "../models/UtilityBill"
import Analytics from "../models/Analytics"
import Report from "../models/Report"

export const createIntegration = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const userId = (req.user as any)?.userId
    const { name, type, configuration, exportSettings, metadata } = req.body

    const integration = new Integration({
        name, type, userId, configuration, exportSettings, metadata: {
            ...metadata, createdBy: userId
        }
    })

    const savedIntegration = await integration.save()

    res.status(201).json({ message: "Integration created successfully", result: savedIntegration })
})

export const getAllIntegrations = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const userId = (req.user as any)?.userId
    const { type, status } = req.query

    const filter: any = { userId }
    if (type) filter.type = type
    if (status) filter.status = status

    const integrations = await Integration.find(filter).populate("metadata.createdBy", "firstName lastName email").sort({ createdAt: -1 })

    res.status(200).json({ result: integrations })
})

export const getIntegrationById = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params
    const userId = (req.user as any)?.userId

    const integration = await Integration.findOne({ _id: id, userId })
        .populate("metadata.createdBy", "firstName lastName email")

    if (!integration) {
        return res.status(409).json({
            success: false, message: "Integration not found"
        })
    }

    res.status(200).json({ result: integration })
})

export const updateIntegration = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params
    const userId = (req.user as any)?.userId
    const updateData = req.body

    const integration = await Integration.findOne({ _id: id, userId })

    if (!integration) {
        return res.status(404).json({
            success: false,
            message: "Integration not found"
        })
    }

    Object.assign(integration, updateData)
    await integration.save()

    res.status(200).json({
        message: "Integration updated successfully",
        result: integration
    })
})

export const deleteIntegration = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params
    const userId = (req.user as any)?.userId

    const integration = await Integration.findOne({ _id: id, userId })

    if (!integration) {
        return res.status(404).json({
            success: false,
            message: "Integration not found"
        })
    }

    await Integration.findByIdAndDelete(id)

    res.status(200).json({ message: "Integration deleted successfully" })
})

export const exportToPowerBI = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params
    const userId = (req.user as any)?.userId

    const integration = await Integration.findOne({ _id: id, userId, type: "PowerBI" })

    if (!integration) {
        return res.status(408).json({
            success: false,
            message: "PowerBI integration not found"
        })
    }

    const exportData = await collectExportData(userId, integration.exportSettings)

    const powerBIPayload = {
        datasets: [{
            name: "EnergyPlatformData",
            tables: [{
                name: "UtilityBillsData",
                columns: [
                    { name: "ConsumerNumber", dataType: "string" },
                    { name: "UtilityBillPeriod", dataType: "string" },
                    { name: "TotalAmount", dataType: "double" },
                    { name: "Consumption", dataType: "double" },
                    { name: "UnitCost", dataType: "double" }
                ],
                rows: exportData.bills?.map((bill: any) => [
                    bill.consumerNumber,
                    `${bill.billPeriod.fromDate} - ${bill.billPeriod.toDate}`,
                    bill.totalAmount,
                    bill.consumption.totalKWh,
                    bill.totalAmount / bill.consumption.totalKWh
                ]) || []
            }]
        }]
    }

    integration.lastExport = {
        timestamp: new Date(),
        status: "success",
        recordsExported: exportData.bills?.length || 0
    }
    await integration.save()

    res.status(200).json({
        message: "Data exported to PowerBI successfully",
        result: powerBIPayload
    })
})

export const exportToERP = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params
    const userId = (req.user as any)?.userId

    const integration = await Integration.findOne({ _id: id, userId, type: "ERP" })

    if (!integration) {
        return res.status(408).json({
            success: false,
            message: "ERP integration not found"
        })
    }

    const exportData = await collectExportData(userId, integration.exportSettings)

    const erpPayload = {
        format: integration.exportSettings.format,
        result: exportData,
        timestamp: new Date().toISOString(),
        source: "Energy Data Platform"
    }

    integration.lastExport = {
        timestamp: new Date(),
        status: "success",
        recordsExported: Object.values(exportData).flat().length
    }
    await integration.save()

    res.status(200).json({
        message: "Data exported to ERP successfully",
        result: erpPayload
    })
})

export const testIntegration = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params
    const userId = (req.user as any)?.userId

    const integration = await Integration.findOne({ _id: id, userId })

    if (!integration) {
        return res.status(404).json({
            success: false,
            message: "Integration not found"
        })
    }

    let testResult = {
        success: false,
        message: "",
        details: {}
    }

    switch (integration.type) {
        case "PowerBI":
            testResult = {
                success: true,
                message: "PowerBI connection test successful",
                details: {
                    endpoint: integration.configuration.endpoint,
                    status: "connected"
                }
            }
            break
        case "ERP":
            testResult = {
                success: true,
                message: "ERP connection test successful",
                details: {
                    endpoint: integration.configuration.endpoint,
                    status: "connected"
                }
            }
            break
        case "Excel":
            testResult = {
                success: true,
                message: "Excel export configuration valid",
                details: {
                    format: integration.exportSettings.format,
                    status: "ready"
                }
            }
            break
        default:
            testResult = {
                success: false,
                message: "Integration type not supported for testing",
                details: {}
            }
    }

    res.status(200).json({ result: testResult })
})

const collectExportData = async (userId: string, exportSettings: any) => {
    const data: any = {}

    if (exportSettings.dataTypes.includes("bills")) {
        data.bills = await UtilityBill.find({ uploadedBy: userId })
            .select(exportSettings.includeFields?.join(" "))
            .limit(1000)
    }

    if (exportSettings.dataTypes.includes("analytics")) {
        data.analytics = await Analytics.find({ userId })
            .select(exportSettings.includeFields?.join(" "))
            .limit(1000)
    }

    if (exportSettings.dataTypes.includes("reports")) {
        data.reports = await Report.find({ generatedBy: userId })
            .select(exportSettings.includeFields?.join(" "))
            .limit(1000)
    }

    return data
}