import { NextFunction, Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { UtilityBill, IUtilityBill } from '../models/UtilityBill'
import ocrService, { ExtractedBillData } from '../services/ocrService'
import { IUserProtected } from '../utils/protected'
import multerMiddleware from '../utils/upload'
import { uploadToCloudinary, deleteFromCloudinary, CloudinaryUploadResult } from '../utils/cloudinaryUpload'
import { customValidator } from "../utils/validator"
import { uploadBillRules, getBillStatusRules, getUtilityBillRules, updateUtilityBillRules, deleteBillRules } from "../rules/bill.rules"

const billFileTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/bmp',
    'image/tiff'
];

export const upload = multerMiddleware(billFileTypes, 10);

export const uploadBill = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log("Upload bill function called");
    const user = req.user as IUserProtected
    console.log("User:", user);
    const file = req.file
    console.log("File:", file);

    if (!file) {
        return res.status(400).json({ message: "No file uploaded" })
    }

    if (!file.buffer) {
        return res.status(400).json({ message: "File buffer not available" })
    }

    try {
        console.log("Uploading to Cloudinary...");
        const cloudinaryResult = await uploadToCloudinary(file.buffer, file.originalname, 'utility-bills');
        console.log("Cloudinary upload successful:", cloudinaryResult.secure_url);

        const currentDate = new Date();
        const initialUtilityBill = {
            userId: user.userId,

            consumerNumber: 'PROCESSING',
            billNumber: 'PROCESSING',
            billingMonth: 'PROCESSING',
            billingYear: currentDate.getFullYear(),
            billIssueDate: currentDate,
            billDueDate: currentDate,
            paymentStatus: 'Pending',

            customerName: 'PROCESSING',
            supplyAddress: 'PROCESSING',
            meterNumber: 'PROCESSING',

            unitsConsumed: 0,
            meterReadingStart: 0,
            meterReadingEnd: 0,
            meterReadingDifference: 0,

            tariffPlan: 'PROCESSING',
            tariffCategory: 'PROCESSING',
            unitRate: 0,

            demandCharges: 0,
            fixedCharges: 0,
            energyCharges: 0,

            totalAmount: 0,
            netPayableAmount: 0,

            originalFile: file.originalname,
            processedFile: cloudinaryResult.secure_url,
            cloudinaryPublicId: cloudinaryResult.public_id,
            rawExtractedJson: {},
            extractionConfidence: 0,
            processingStatus: 'Processing',
            uploadDate: currentDate,
            lastModified: currentDate
        }

        const billRecord = await UtilityBill.create(initialUtilityBill)

        processBillAsync((billRecord._id as string).toString(), cloudinaryResult.secure_url)

        res.status(202).json({
            message: "Bill uploaded successfully to Cloudinary. Processing in background.",
            result: {
                billId: billRecord._id,
                status: 'Processing',
                cloudinaryUrl: cloudinaryResult.secure_url
            }
        })

    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return res.status(500).json({ message: "Failed to upload file to Cloudinary", error: error });
    }
})

export const getBillStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { billId } = req.params

    const { isError, error } = customValidator(req.params, getBillStatusRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error });
    }

    const user = req.user as IUserProtected

    const bill = await UtilityBill.findOne({
        _id: billId,
        userId: user.userId
    }).lean()

    if (!bill) {
        return res.status(409).json({ message: "Bill not found" })
    }

    const result = {
        id: bill._id,
        status: bill.processingStatus,
        confidence: bill.extractionConfidence,
        uploadedAt: bill.uploadDate,
        processedAt: bill.lastModified,
        originalFileName: bill.originalFile
    }

    res.status(200).json({ message: "Bill status fetched successfully", result })
})

export const getUtilityBill = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { billId } = req.params

    const { isError, error } = customValidator(req.params, getUtilityBillRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error });
    }

    const user = req.user as IUserProtected

    const bill = await UtilityBill.findOne({
        _id: billId,
        userId: user.userId
    }).lean()

    if (!bill) {
        return res.status(409).json({ message: "Bill not found" })
    }

    if (bill.processingStatus !== 'Completed') {
        return res.status(400).json({ message: "Bill processing not completed", result: { status: bill.processingStatus } })
    }

    res.status(200).json({ message: "Bill data fetched successfully", result: bill })
})

export const getAllBills = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { page = 1, limit = 10, searchQuery = "", isFetchAll = false } = req.query
    const user = req.user as IUserProtected

    const currentPage = parseInt(page as string)
    const pageLimit = parseInt(limit as string)
    const skip: number = (currentPage - 1) * pageLimit

    const query = {
        $and: [
            { userId: user.userId },
            searchQuery
                ? {
                    $or: [
                        { consumerNumber: { $regex: searchQuery, $options: "i" } },
                        { billNumber: { $regex: searchQuery, $options: "i" } },
                        { customerName: { $regex: searchQuery, $options: "i" } },
                    ]
                }
                : {}
        ]
    }

    const totalBills = await UtilityBill.countDocuments(query)
    const totalPages = Math.ceil(totalBills / pageLimit)

    let result = []
    if (isFetchAll) {
        result = await UtilityBill.find({ userId: user.userId })
            .select('_id originalFile consumerNumber billingMonth billingYear totalAmount unitsConsumed processingStatus uploadDate')
            .lean()
    } else {
        result = await UtilityBill.find(query)
            .skip(skip)
            .limit(pageLimit)
            .select('_id originalFile consumerNumber billingMonth billingYear totalAmount unitsConsumed processingStatus uploadDate')
            .lean()
    }


    res.status(200).json({ message: "Bills fetched successfully", result, totalPages, totalBills })
})

export const updateUtilityBill = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { billId } = req.params

    const { isError, error } = customValidator({ ...req.params, ...req.body }, updateUtilityBillRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error });
    }

    const user = req.user as IUserProtected

    const bill = await UtilityBill.findOne({
        _id: billId,
        userId: user.userId
    })

    if (!bill) {
        return res.status(409).json({ message: "Bill not found" })
    }

    await UtilityBill.findByIdAndUpdate(billId, {
        ...req.body,
        lastModified: new Date()
    }, { new: true, runValidators: true })

    res.status(200).json({ message: "Bill updated successfully" })
})

export const deleteBill = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { billId } = req.params

    const { isError, error } = customValidator(req.params, deleteBillRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error });
    }

    const user = req.user as IUserProtected

    const bill = await UtilityBill.findOne({
        _id: billId,
        userId: user.userId
    })

    if (!bill) {
        return res.status(409).json({ message: "Bill not found" })
    }

    try {
        if (bill.cloudinaryPublicId) {
            console.log(`Deleting from Cloudinary: ${bill.cloudinaryPublicId}`);
            await deleteFromCloudinary(bill.cloudinaryPublicId);
        }

        await UtilityBill.findByIdAndDelete(billId)

        res.status(200).json({ message: "Bill deleted successfully from database and Cloudinary" })
    } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);

        await UtilityBill.findByIdAndDelete(billId)

        res.status(200).json({
            message: "Bill deleted from database. Cloudinary deletion failed.",
            warning: "File may still exist in Cloudinary"
        })
    }
})

export const getBillsAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = req.user as IUserProtected
    const { startDate, endDate, groupBy = 'month' } = req.query

    const matchQuery: any = { userId: user.userId }

    if (startDate && endDate) {
        matchQuery.uploadedAt = {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string)
        }
    }

    const aggregationPipeline = [
        { $match: matchQuery },
        {
            $group: {
                _id: groupBy === 'month'
                    ? { year: "$billingYear", month: "$billingMonth" }
                    : { year: "$billingYear" },
                totalBills: { $sum: 1 },
                totalUnitsConsumed: { $sum: "$unitsConsumed" },
                totalAmount: { $sum: "$totalAmount" },
                averageUnitRate: { $avg: "$unitRate" },
                totalDemandCharges: { $sum: "$demandCharges" },
                totalFixedCharges: { $sum: "$fixedCharges" },
                totalEnergyCharges: { $sum: "$energyCharges" },
                totalTaxes: { $sum: "$totalTaxes" }
            }
        },
        { $sort: { "_id.year": -1 as const, "_id.month": -1 as const } }
    ]

    const analytics = await UtilityBill.aggregate(aggregationPipeline)


    const totalStats = await UtilityBill.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: null,
                totalBills: { $sum: 1 },
                totalUnitsConsumed: { $sum: "$unitsConsumed" },
                totalAmountPaid: { $sum: "$totalAmount" },
                averageMonthlyConsumption: { $avg: "$unitsConsumed" },
                averageMonthlyBill: { $avg: "$totalAmount" },
                highestBill: { $max: "$totalAmount" },
                lowestBill: { $min: "$totalAmount" }
            }
        }
    ])

    const result = {
        analytics,
        summary: totalStats[0] || {}
    }
    res.status(200).json({ message: "Bills analytics fetched successfully", result })
})

const processBillAsync = async (billId: string, filePath: string) => {
    try {
        console.log(`Starting OCR processing for bill ${billId}`)

        const extractedData = await ocrService.processFile(filePath)

        const updateData: Partial<IUtilityBill> = {
            consumerNumber: extractedData.consumerNumber || 'UNKNOWN',
            accountId: extractedData.accountId,
            billNumber: extractedData.billNumber || 'UNKNOWN',
            billingMonth: extractedData.billingMonth || 'UNKNOWN',
            billingYear: extractedData.billingYear || new Date().getFullYear(),

            customerName: extractedData.customerName || 'UNKNOWN',
            companyName: extractedData.companyName,
            supplyAddress: extractedData.supplyAddress || 'UNKNOWN',

            unitsConsumed: extractedData.unitsConsumed || 0,
            meterNumber: extractedData.meterNumber || 'UNKNOWN',
            meterReadingStart: extractedData.meterReadingStart || 0,
            meterReadingEnd: extractedData.meterReadingEnd || 0,
            meterReadingDifference: extractedData.meterReadingDifference || 0,
            maximumDemand: extractedData.maximumDemand,
            powerFactor: extractedData.powerFactor,

            peakUsage: extractedData.peakUnits,
            offPeakUsage: extractedData.offPeakUnits,
            shoulderUsage: extractedData.shoulderUnits,

            tariffPlan: extractedData.tariffPlan || 'UNKNOWN',
            tariffCategory: extractedData.tariffCategory || 'UNKNOWN',
            unitRate: extractedData.unitRate || 0,

            demandCharges: extractedData.demandCharges || 0,
            fixedCharges: extractedData.fixedCharges || 0,
            energyCharges: extractedData.energyCharges || 0,
            fuelSurchargeAdjustment: extractedData.fuelSurchargeAdjustment,
            wheelingCharges: extractedData.wheelingCharges,
            openAccessCharges: extractedData.openAccessCharges,
            renewableEnergyObligations: extractedData.renewableEnergyObligations,

            penalties: extractedData.penalties || 0,
            surcharges: extractedData.surcharges || 0,
            latePaymentFees: extractedData.latePaymentFees,
            miscellaneousSurcharges: extractedData.miscellaneousSurcharges,

            gst: extractedData.gst,
            vat: extractedData.vat,
            electricityDuty: extractedData.electricityDuty,

            previousBalance: extractedData.previousBalance,
            adjustments: extractedData.adjustments,
            credits: extractedData.credits,
            totalAmount: extractedData.totalAmount || 0,
            netPayableAmount: extractedData.netPayableAmount || 0,

            paymentStatus: determinePaymentStatus(extractedData.paymentStatus),

            rawExtractedJson: extractedData,
            extractionConfidence: extractedData.confidence || 0,
            processingStatus: 'Completed',
            lastModified: new Date()
        }

        const currentDate = new Date();
        if (extractedData.billIssueDate) {
            updateData.billIssueDate = new Date(extractedData.billIssueDate)
        } else {
            updateData.billIssueDate = currentDate;
        }

        if (extractedData.billDueDate) {
            updateData.billDueDate = new Date(extractedData.billDueDate)
        } else {
            updateData.billDueDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        }

        await UtilityBill.findByIdAndUpdate(billId, updateData)

        console.log(`Bill ${billId} processed successfully`)

    } catch (error: any) {
        console.error(`Error processing bill ${billId}:`, error)

        await UtilityBill.findByIdAndUpdate(billId, {
            processingStatus: 'Failed',
            rawOcrText: error.message,
            processedAt: new Date()
        })
    }
}

export const exportForPowerBI = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = req.user as IUserProtected
    const { startDate, endDate } = req.query

    const matchQuery: any = { userId: user.userId }

    if (startDate && endDate) {
        matchQuery.uploadedAt = {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string)
        }
    }

    const bills = await UtilityBill.find(matchQuery)
        .select(`
            consumerNumber billNumber billingMonth billingYear customerName
            unitsConsumed demandCharges fixedCharges energyCharges totalTaxes
            totalAmount netPayableAmount uploadedAt processingStatus confidence
            meterReadingStart meterReadingEnd maximumDemand powerFactor
            tariffPlan tariffCategory unitRate gst vat electricityDuty
        `)
        .lean()


    const powerBIData = bills.map((bill: any) => ({
        ConsumerNumber: bill.consumerNumber,
        BillNumber: bill.billNumber,
        BillingPeriod: `${bill.billingMonth} ${bill.billingYear}`,
        CustomerName: bill.customerName,
        UnitsConsumed: bill.unitsConsumed,
        DemandCharges: bill.demandCharges,
        FixedCharges: bill.fixedCharges,
        EnergyCharges: bill.energyCharges,
        TotalTaxes: bill.totalTaxes,
        TotalAmount: bill.totalAmount,
        NetPayableAmount: bill.netPayableAmount,
        UploadDate: bill.uploadedAt,
        ProcessingStatus: bill.processingStatus,
        ExtractionConfidence: bill.confidence,
        MeterReadingStart: bill.meterReadingStart,
        MeterReadingEnd: bill.meterReadingEnd,
        MaximumDemand: bill.maximumDemand,
        PowerFactor: bill.powerFactor,
        TariffPlan: bill.tariffPlan,
        TariffCategory: bill.tariffCategory,
        UnitRate: bill.unitRate,
        GST: bill.gst,
        VAT: bill.vat,
        ElectricityDuty: bill.electricityDuty
    }))

    res.status(200).json({ message: "Data exported for Power BI successfully", result: { exportType: "PowerBI", recordCount: powerBIData.length, exportDate: new Date(), data: powerBIData } })
})

export const exportForERP = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = req.user as IUserProtected
    const { startDate, endDate, format = 'json' } = req.query

    const matchQuery: any = { userId: user.userId }

    if (startDate && endDate) {
        matchQuery.uploadedAt = {
            $gte: new Date(startDate as string),
            $lte: new Date(endDate as string)
        }
    }

    const bills = await UtilityBill.find(matchQuery).lean()


    const erpData = bills.map((bill: any) => ({
        TransactionId: bill._id,
        VendorCode: "UTILITY_PROVIDER",
        AccountCode: bill.consumerNumber,
        InvoiceNumber: bill.billNumber,
        InvoiceDate: bill.billIssueDate,
        DueDate: bill.billDueDate,
        Description: `Utility Bill - ${bill.billingMonth} ${bill.billingYear}`,
        LineItems: [
            {
                ItemCode: "DEMAND_CHARGE",
                Description: "Demand Charges",
                Quantity: 1,
                UnitPrice: bill.demandCharges,
                TotalAmount: bill.demandCharges
            },
            {
                ItemCode: "FIXED_CHARGE",
                Description: "Fixed Charges",
                Quantity: 1,
                UnitPrice: bill.fixedCharges,
                TotalAmount: bill.fixedCharges
            },
            {
                ItemCode: "ENERGY_CHARGE",
                Description: "Energy Charges",
                Quantity: bill.unitsConsumed,
                UnitPrice: bill.unitRate,
                TotalAmount: bill.energyCharges
            },
            {
                ItemCode: "TAX",
                Description: "Taxes and Duties",
                Quantity: 1,
                UnitPrice: bill.totalTaxes,
                TotalAmount: bill.totalTaxes
            }
        ],
        SubTotal: bill.totalAmount - bill.totalTaxes,
        TaxAmount: bill.totalTaxes,
        TotalAmount: bill.totalAmount,
        Currency: "INR",
        PaymentStatus: bill.paymentStatus,
        CustomFields: {
            UnitsConsumed: bill.unitsConsumed,
            MeterNumber: bill.meterNumber,
            TariffCategory: bill.tariffCategory,
            ExtractionConfidence: bill.confidence
        }
    }))

    if (format === 'xml') {

        const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<BillExport>
    <ExportInfo>
        <ExportDate>${new Date().toISOString()}</ExportDate>
        <RecordCount>${erpData.length}</RecordCount>
    </ExportInfo>
    <Bills>
        ${erpData.map((bill: any) => `
        <Bill>
            <TransactionId>${bill.TransactionId}</TransactionId>
            <VendorCode>${bill.VendorCode}</VendorCode>
            <AccountCode>${bill.AccountCode}</AccountCode>
            <InvoiceNumber>${bill.InvoiceNumber}</InvoiceNumber>
            <TotalAmount>${bill.TotalAmount}</TotalAmount>
        </Bill>`).join('')}
    </Bills>
</BillExport>`

        res.set('Content-Type', 'application/xml')
        res.status(200).send(xmlData)
    } else {
        res.status(200).json({ message: "Data exported for ERP successfully", result: { exportType: "ERP", format: format, recordCount: erpData.length, exportDate: new Date(), data: erpData } })
    }
})

const determinePaymentStatus = (status?: string): 'Paid' | 'Unpaid' | 'Pending' | 'Overdue' => {
    if (!status) return 'Unpaid'

    const statusLower = status.toLowerCase()

    if (statusLower.includes('paid')) return 'Paid'
    if (statusLower.includes('pending')) return 'Pending'
    if (statusLower.includes('overdue') || statusLower.includes('due')) return 'Overdue'

    return 'Unpaid'
}