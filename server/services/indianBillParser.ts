import { createWorker } from 'tesseract.js';

export interface ExtractedBillData {

    consumerNumber?: string;
    accountId?: string;
    billNumber?: string;
    invoiceNumber?: string;
    billingMonth?: string;
    billingYear?: number;
    billIssueDate?: Date;
    billDueDate?: Date;
    paymentStatus?: string;


    customerName?: string;
    companyName?: string;
    supplyAddress?: string;
    meterNumber?: string;


    unitsConsumed?: number;
    meterReadingStart?: number;
    meterReadingEnd?: number;
    meterReadingDifference?: number;
    maximumDemand?: number;
    powerFactor?: number;


    peakUsage?: number;
    offPeakUsage?: number;
    shoulderUsage?: number;


    tariffPlan?: string;
    tariffCategory?: string;
    unitRate?: number;


    demandCharges?: number;
    fixedCharges?: number;
    energyCharges?: number;
    fuelSurchargeAdjustment?: number;
    wheelingCharges?: number;
    openAccessCharges?: number;
    renewableEnergyObligations?: number;


    gst?: number;
    vat?: number;
    electricityDuty?: number;
    penalties?: number;
    surcharges?: number;
    latePaymentFees?: number;
    miscellaneousSurcharges?: number;


    previousBalance?: number;
    adjustments?: number;
    credits?: number;
    totalAmount?: number;
    netPayableAmount?: number;


    extractionConfidence?: number;
    rawText?: string;
}

export class IndianBillParser {
    private worker: any;

    constructor() {
        this.initializeWorker();
    }

    private async initializeWorker() {
        this.worker = await createWorker('eng+hin', 1, {
            logger: m => console.log('OCR Progress:', m)
        });

        await this.worker.setParameters({
            tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,/-₹() :',
            tessedit_pageseg_mode: '6',
        });
    }

    async extractBillData(imagePath: string): Promise<ExtractedBillData> {
        try {
            const { data: { text } } = await this.worker.recognize(imagePath);
            console.log('Raw OCR Text:', text);

            const extractedData = this.parseIndianBillText(text);
            extractedData.rawText = text;
            extractedData.extractionConfidence = this.calculateConfidence(extractedData);

            return extractedData;
        } catch (error) {
            console.error('OCR extraction failed:', error);
            return { rawText: '', extractionConfidence: 0 };
        }
    }

    private parseIndianBillText(text: string): ExtractedBillData {
        const data: ExtractedBillData = {};
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);


        data.consumerNumber = this.extractPattern(text, [
            /consumer\s*(?:no|number|id)[\s:]*([0-9A-Z]{8,20})/i,
            /account\s*(?:no|number|id)[\s:]*([0-9A-Z]{8,20})/i,
            /service\s*(?:connection|no)[\s:]*([0-9A-Z]{8,20})/i,
            /(?:^|\s)([0-9]{10,16})(?:\s|$)/
        ]);


        data.billNumber = this.extractPattern(text, [
            /bill\s*(?:no|number)[\s:]*([0-9A-Z]{6,20})/i,
            /invoice\s*(?:no|number)[\s:]*([0-9A-Z]{6,20})/i,
            /receipt\s*(?:no|number)[\s:]*([0-9A-Z]{6,20})/i
        ]);

        data.customerName = this.extractPattern(text, [
            /(?:name|customer)[\s:]*([A-Z][A-Z\s]{5,50})/i,
            /(?:^|\n)([A-Z][A-Z\s]{10,40})(?:\n|$)/
        ]);


        const billingPeriod = this.extractBillingPeriod(text);
        data.billingMonth = billingPeriod.month;
        data.billingYear = billingPeriod.year;


        data.billDueDate = this.extractDate(text, [
            /due\s*date[\s:]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
            /pay\s*by[\s:]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i
        ]);


        data.unitsConsumed = this.extractNumber(text, [
            /units?\s*consumed[\s:]*(\d+)/i,
            /kwh\s*consumed[\s:]*(\d+)/i,
            /consumption[\s:]*(\d+)/i,
            /(\d+)\s*kwh/i
        ]);


        const meterReadings = this.extractMeterReadings(text);
        data.meterReadingStart = meterReadings.previous;
        data.meterReadingEnd = meterReadings.current;
        data.meterReadingDifference = meterReadings.difference;


        data.totalAmount = this.extractAmount(text, [
            /total\s*(?:amount|bill)[\s:]*₹?\s*(\d+(?:\.\d{2})?)/i,
            /net\s*payable[\s:]*₹?\s*(\d+(?:\.\d{2})?)/i,
            /amount\s*payable[\s:]*₹?\s*(\d+(?:\.\d{2})?)/i,
            /₹\s*(\d+(?:\.\d{2})?)/g
        ]);


        data.energyCharges = this.extractAmount(text, [
            /energy\s*charges?[\s:]*₹?\s*(\d+(?:\.\d{2})?)/i,
            /electricity\s*charges?[\s:]*₹?\s*(\d+(?:\.\d{2})?)/i
        ]);

        data.fixedCharges = this.extractAmount(text, [
            /fixed\s*charges?[\s:]*₹?\s*(\d+(?:\.\d{2})?)/i,
            /monthly\s*charges?[\s:]*₹?\s*(\d+(?:\.\d{2})?)/i
        ]);


        data.demandCharges = this.extractAmount(text, [
            /demand\s*charges?[\s:]*₹?\s*(\d+(?:\.\d{2})?)/i,
            /maximum\s*demand[\s:]*₹?\s*(\d+(?:\.\d{2})?)/i
        ]);


        data.gst = this.extractAmount(text, [
            /gst[\s:]*₹?\s*(\d+(?:\.\d{2})?)/i,
            /igst[\s:]*₹?\s*(\d+(?:\.\d{2})?)/i,
            /cgst[\s:]*₹?\s*(\d+(?:\.\d{2})?)/i,
            /sgst[\s:]*₹?\s*(\d+(?:\.\d{2})?)/i
        ]);

        data.electricityDuty = this.extractAmount(text, [
            /electricity\s*duty[\s:]*₹?\s*(\d+(?:\.\d{2})?)/i,
            /duty[\s:]*₹?\s*(\d+(?:\.\d{2})?)/i
        ]);

        data.tariffCategory = this.extractPattern(text, [
            /tariff[\s:]*([A-Z0-9\-]{2,10})/i,
            /category[\s:]*([A-Z0-9\-]{2,10})/i
        ]);

        data.unitRate = this.extractNumber(text, [
            /rate[\s:]*₹?\s*(\d+(?:\.\d{2})?)/i,
            /₹\s*(\d+(?:\.\d{2})?)\s*per\s*unit/i
        ]);

        return data;
    }

    private extractPattern(text: string, patterns: RegExp[]): string | undefined {
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                return match[1].trim();
            }
        }
        return undefined;
    }

    private extractNumber(text: string, patterns: RegExp[]): number | undefined {
        const result = this.extractPattern(text, patterns);
        return result ? parseFloat(result) : undefined;
    }

    private extractAmount(text: string, patterns: RegExp[]): number | undefined {
        for (const pattern of patterns) {
            const matches = text.matchAll(pattern);
            for (const match of matches) {
                if (match[1]) {
                    const amount = parseFloat(match[1]);
                    if (amount > 0) return amount;
                }
            }
        }
        return undefined;
    }

    private extractDate(text: string, patterns: RegExp[]): Date | undefined {
        const dateStr = this.extractPattern(text, patterns);
        if (dateStr) {
            try {
                const date = new Date(dateStr);
                return isNaN(date.getTime()) ? undefined : date;
            } catch {
                return undefined;
            }
        }
        return undefined;
    }

    private extractBillingPeriod(text: string): { month?: string, year?: number } {
        const patterns = [
            /billing\s*period[\s:]*(\w+)\s*(\d{4})/i,
            /bill\s*for[\s:]*(\w+)\s*(\d{4})/i,
            /(\w+)\s*(\d{4})/g
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1] && match[2]) {
                return {
                    month: match[1],
                    year: parseInt(match[2])
                };
            }
        }

        return {};
    }

    private extractMeterReadings(text: string): { previous?: number, current?: number, difference?: number } {
        const patterns = {
            previous: [
                /previous\s*reading[\s:]*(\d+)/i,
                /last\s*reading[\s:]*(\d+)/i
            ],
            current: [
                /current\s*reading[\s:]*(\d+)/i,
                /present\s*reading[\s:]*(\d+)/i
            ]
        };

        const previous = this.extractNumber(text, patterns.previous);
        const current = this.extractNumber(text, patterns.current);
        const difference = (current && previous) ? current - previous : undefined;

        return { previous, current, difference };
    }

    private calculateConfidence(data: ExtractedBillData): number {
        let score = 0;
        let totalFields = 0;

        const criticalFields = ['consumerNumber', 'totalAmount', 'unitsConsumed', 'billingMonth'];
        const importantFields = ['customerName', 'billNumber', 'energyCharges', 'billDueDate'];
        const optionalFields = ['tariffCategory', 'gst', 'fixedCharges', 'demandCharges'];


        criticalFields.forEach(field => {
            totalFields += 40;
            if (data[field as keyof ExtractedBillData]) score += 40;
        });


        importantFields.forEach(field => {
            totalFields += 20;
            if (data[field as keyof ExtractedBillData]) score += 20;
        });


        optionalFields.forEach(field => {
            totalFields += 10;
            if (data[field as keyof ExtractedBillData]) score += 10;
        });

        return Math.round((score / totalFields) * 100);
    }

    async terminate() {
        if (this.worker) {
            await this.worker.terminate();
        }
    }
}

export default IndianBillParser;