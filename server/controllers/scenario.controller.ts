import { NextFunction, Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { IScenario, Scenario } from "../models/Scenario"
import { UtilityBill } from "../models/UtilityBill"
import { IUserProtected } from "../utils/protected"
import { customValidator } from "../utils/validator"
import { createScenarioRules, getAllScenariosRules, getScenarioByIdRules, updateScenarioRules, deleteScenarioRules } from "../rules/scenario.rules"


export const createScenario = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { isError, error } = customValidator(req.body, createScenarioRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error });
    }

    const user = req.user as IUserProtected
    const {
        billId,
        scenarioName,
        description,
        scenarioType,
        newTariffRate,
        newSupplierName,
        newSupplierRate,
        energyMixPercentage,
        consumptionReduction,
        newDemandChargeRate,
        newFixedChargeRate
    }: IScenario = req.body


    const baseBill = await UtilityBill.findOne({ _id: billId, userId: user.userId }).lean()

    if (!baseBill) {
        return res.status(404).json({ message: "Base bill not found" })
    }


    const simulationResult = calculateScenario({
        scenarioType,
        baseData: {
            unitsConsumed: baseBill.unitsConsumed,
            totalAmount: baseBill.totalAmount,
            demandCharges: baseBill.demandCharges,
            fixedCharges: baseBill.fixedCharges,
            energyCharges: baseBill.energyCharges || 0,
            taxes: (baseBill.gst || 0) + (baseBill.vat || 0) + (baseBill.electricityDuty || 0),
            unitRate: baseBill.unitRate || 0
        },
        parameters: {
            newTariffRate,
            newSupplierRate,
            energyMixPercentage,
            consumptionReduction,
            newDemandChargeRate,
            newFixedChargeRate
        }
    })

    const scenarioData = {
        userId: user.userId,
        billId,
        scenarioName,
        description,
        scenarioType,


        baseUnitsConsumed: baseBill.unitsConsumed,
        baseTotalAmount: baseBill.totalAmount,
        baseDemandCharges: baseBill.demandCharges,
        baseFixedCharges: baseBill.fixedCharges,
        baseEnergyCharges: baseBill.energyCharges || 0,
        baseTaxes: (baseBill.gst || 0) + (baseBill.vat || 0) + (baseBill.electricityDuty || 0),


        newTariffRate,
        newSupplierName,
        newSupplierRate,
        energyMixPercentage,
        consumptionReduction,
        newDemandChargeRate,
        newFixedChargeRate,


        ...simulationResult,

        simulationStatus: 'completed'
    }

    const result = await Scenario.create(scenarioData)

    res.status(201).json({ message: "Scenario created successfully", result })
})


export const getAllScenarios = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
                        { scenarioName: { $regex: searchQuery, $options: "i" } },
                        { scenarioType: { $regex: searchQuery, $options: "i" } },
                        { newSupplierName: { $regex: searchQuery, $options: "i" } }
                    ]
                }
                : {}
        ]
    }

    const totalScenarios = await Scenario.countDocuments(query)
    const totalPages = Math.ceil(totalScenarios / pageLimit)

    let result = []
    if (isFetchAll) {
        result = await Scenario.find({ userId: user.userId }).select("-__v").lean()
    } else {
        result = await Scenario.find(query).skip(skip).limit(pageLimit).select("-__v").lean()
    }

    res.status(200).json({ message: "Scenarios fetched successfully", result, totalPages, totalScenarios })
})


export const getScenarioById = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params
    const user = req.user as IUserProtected

    const result = await Scenario.findOne({ _id: id, userId: user.userId })
        .populate('billId', 'billNumber consumerNumber billingMonth billingYear').select("-__v").lean()

    if (!result) {
        return res.status(404).json({ message: `Scenario with ID: ${id} not found` })
    }

    res.status(200).json({ message: "Scenario fetched successfully", result })
})


export const updateScenario = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params
    const user = req.user as IUserProtected

    const scenario = await Scenario.findOne({ _id: id, userId: user.userId })

    if (!scenario) {
        return res.status(404).json({ message: "Scenario not found" })
    }


    const {
        newTariffRate,
        newSupplierRate,
        energyMixPercentage,
        consumptionReduction,
        newDemandChargeRate,
        newFixedChargeRate
    } = req.body

    let updateData = { ...req.body, lastModified: new Date() }


    if (newTariffRate || newSupplierRate || energyMixPercentage || consumptionReduction || newDemandChargeRate || newFixedChargeRate) {
        const simulationResult = calculateScenario({
            scenarioType: req.body.scenarioType || scenario.scenarioType,
            baseData: {
                unitsConsumed: scenario.baseUnitsConsumed,
                totalAmount: scenario.baseTotalAmount,
                demandCharges: scenario.baseDemandCharges,
                fixedCharges: scenario.baseFixedCharges,
                energyCharges: scenario.baseEnergyCharges,
                taxes: scenario.baseTaxes,
                unitRate: newTariffRate || 0
            },
            parameters: {
                newTariffRate,
                newSupplierRate,
                energyMixPercentage,
                consumptionReduction,
                newDemandChargeRate,
                newFixedChargeRate
            }
        })

        updateData = { ...updateData, ...simulationResult }
    }

    await Scenario.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

    res.status(200).json({ message: "Scenario updated successfully" })
})


export const deleteScenario = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params
    const user = req.user as IUserProtected

    const scenario = await Scenario.findOne({ _id: id, userId: user.userId })

    if (!scenario) {
        return res.status(404).json({ message: "Scenario not found" })
    }

    await Scenario.findByIdAndDelete(id)

    res.status(200).json({ message: "Scenario deleted successfully" })
})


export const compareScenarios = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { scenarioIds } = req.body
    const user = req.user as IUserProtected

    if (!scenarioIds || !Array.isArray(scenarioIds) || scenarioIds.length < 2) {
        return res.status(400).json({ message: "At least 2 scenario IDs required for comparison" })
    }

    const scenarios = await Scenario.find({
        _id: { $in: scenarioIds },
        userId: user.userId
    }).select("-__v").lean()

    if (scenarios.length !== scenarioIds.length) {
        return res.status(404).json({ message: "One or more scenarios not found" })
    }


    const comparison = {
        scenarios,
        bestSavings: scenarios.reduce((best, current) =>
            current.costSavings > best.costSavings ? current : best
        ),
        averageSavings: scenarios.reduce((sum, s) => sum + s.costSavings, 0) / scenarios.length,
        totalPotentialSavings: scenarios.reduce((sum, s) => sum + s.annualSavings, 0)
    }

    res.status(200).json({ message: "Scenario comparison generated successfully", result: comparison })
})


const calculateScenario = ({ scenarioType, baseData, parameters }: any) => {
    let projectedUnitsConsumed = baseData.unitsConsumed
    let projectedDemandCharges = baseData.demandCharges
    let projectedFixedCharges = baseData.fixedCharges
    let projectedEnergyCharges = baseData.energyCharges
    let projectedTaxes = baseData.taxes

    if (parameters.consumptionReduction) {
        projectedUnitsConsumed = baseData.unitsConsumed * (1 - parameters.consumptionReduction / 100)
    }

    switch (scenarioType) {
        case 'tariff_change':
            if (parameters.newTariffRate) {
                projectedEnergyCharges = projectedUnitsConsumed * parameters.newTariffRate
            }
            break

        case 'supplier_change':
            if (parameters.newSupplierRate) {
                projectedEnergyCharges = projectedUnitsConsumed * parameters.newSupplierRate

                projectedDemandCharges = baseData.demandCharges * 0.95
            }
            break

        case 'energy_mix':
            if (parameters.energyMixPercentage) {

                const renewableDiscount = parameters.energyMixPercentage / 100 * 0.1
                projectedEnergyCharges = baseData.energyCharges * (1 - renewableDiscount)
                projectedTaxes = baseData.taxes * 0.8
            }
            break

        case 'consumption_optimization':

            projectedEnergyCharges = projectedUnitsConsumed * (baseData.energyCharges / baseData.unitsConsumed)
            break
    }


    if (parameters.newDemandChargeRate) {
        projectedDemandCharges = parameters.newDemandChargeRate
    }
    if (parameters.newFixedChargeRate) {
        projectedFixedCharges = parameters.newFixedChargeRate
    }

    const projectedTotalAmount = projectedDemandCharges + projectedFixedCharges + projectedEnergyCharges + projectedTaxes
    const costSavings = baseData.totalAmount - projectedTotalAmount
    const percentageSavings = (costSavings / baseData.totalAmount) * 100
    const annualSavings = costSavings * 12

    return {
        projectedUnitsConsumed,
        projectedDemandCharges,
        projectedFixedCharges,
        projectedEnergyCharges,
        projectedTaxes,
        projectedTotalAmount,
        costSavings,
        percentageSavings,
        annualSavings
    }
}