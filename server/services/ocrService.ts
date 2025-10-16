import Tesseract from 'tesseract.js';
import pdf2pic from 'pdf2pic';
import pdfParse from 'pdf-parse';
import path from 'path';
import fs from 'fs';

export interface OCRResult {
    text: string;
    confidence: number;
    success: boolean;
    error?: string;
}

export interface ExtractedBillData {

    consumerNumber?: string;
    accountId?: string;
    billNumber?: string;
    billIssueDate?: string;
    billDueDate?: string;
    billingMonth?: string;
    billingYear?: number;


    customerName?: string;
    companyName?: string;
    supplyAddress?: string;


    unitsConsumed?: number;
    meterNumber?: string;
    meterReadingStart?: number;
    meterReadingEnd?: number;
    meterReadingDifference?: number;
    maximumDemand?: number;
    powerFactor?: number;


    peakUnits?: number;
    offPeakUnits?: number;
    shoulderUnits?: number;

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


    penalties?: number;
    surcharges?: number;
    latePaymentFees?: number;
    miscellaneousSurcharges?: number;


    gst?: number;
    vat?: number;
    electricityDuty?: number;
    totalTaxes?: number;


    previousBalance?: number;
    adjustments?: number;
    credits?: number;
    totalAmount?: number;
    netPayableAmount?: number;


    paymentStatus?: string;


    rawText: string;
    confidence: number;
}

class OCRService {


    async processPDF(filePath: string): Promise<OCRResult> {
        try {

            const dataBuffer = fs.readFileSync(filePath);
            const pdfData = await pdfParse(dataBuffer);

            if (pdfData.text && pdfData.text.trim().length > 100) {
                return {
                    text: pdfData.text,
                    confidence: 95,
                    success: true
                };
            }


            return await this.processPDFAsImages(filePath);

        } catch (error: any) {
            return {
                text: '',
                confidence: 0,
                success: false,
                error: `PDF processing failed: ${error.message}`
            };
        }
    }


    private async processPDFAsImages(filePath: string): Promise<OCRResult> {
        try {
            const options = {
                density: 300,
                saveFilename: "page",
                savePath: path.dirname(filePath),
                format: "png",
                width: 2000,
                height: 2000
            };

            const pdf2picInstance = pdf2pic.fromPath(filePath, options);
            const pages = await pdf2picInstance.bulk(-1);

            let allText = '';
            let totalConfidence = 0;
            let pageCount = 0;

            for (const page of pages) {
                if (page.path) {
                    const ocrResult = await this.processImage(page.path);
                    if (ocrResult.success) {
                        allText += ocrResult.text + '\n';
                        totalConfidence += ocrResult.confidence;
                        pageCount++;
                    }


                    try {
                        fs.unlinkSync(page.path);
                    } catch (cleanupError) {
                        console.warn('Failed to cleanup temp image:', cleanupError);
                    }
                }
            }

            const averageConfidence = pageCount > 0 ? totalConfidence / pageCount : 0;

            return {
                text: allText,
                confidence: averageConfidence,
                success: allText.length > 0
            };

        } catch (error: any) {
            return {
                text: '',
                confidence: 0,
                success: false,
                error: `PDF to image conversion failed: ${error.message}`
            };
        }
    }


    async processImage(imagePath: string): Promise<OCRResult> {
        try {

            const { data } = await Tesseract.recognize(imagePath, 'eng+hin', {
                logger: info => console.log('OCR Progress:', info)
            });

            return {
                text: data.text,
                confidence: data.confidence,
                success: true
            };

        } catch (error: any) {
            return {
                text: '',
                confidence: 0,
                success: false,
                error: `Image OCR failed: ${error.message}`
            };
        }
    }


    extractBillData(ocrText: string, confidence: number): ExtractedBillData {
        const data: ExtractedBillData = {
            rawText: ocrText,
            confidence
        };


        const text = ocrText.replace(/\s+/g, ' ').trim();


        const consumerPatterns = [
            /(?:consumer\s*(?:no|number|id)|account\s*(?:no|number|id))[:\s]*([A-Z0-9\-\/]+)/i,
            /(?:service\s*connection\s*no|connection\s*id)[:\s]*([A-Z0-9\-\/]+)/i,
            /(?:bp\s*no|bill\s*point|meter\s*no)[:\s]*([A-Z0-9\-\/]+)/i,
            /(?:kno|k\.no|consumer)[:\s]*([0-9]{8,16})/i,
            /(?:^|\s)([0-9]{10,16})(?:\s|$)/,
            /(?:ca\s*no|connection\s*no)[:\s]*([A-Z0-9\-\/]+)/i
        ];

        for (const pattern of consumerPatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                const value = match[1].trim();
                if (value.length >= 8) {
                    data.consumerNumber = value;
                    break;
                }
            }
        }


        const billNumberPatterns = [
            /(?:bill\s*(?:no|number)|invoice\s*(?:no|number))[:\s]*([A-Z0-9\-\/]+)/i,
            /(?:bill\s*id|receipt\s*no)[:\s]*([A-Z0-9\-\/]+)/i
        ];

        for (const pattern of billNumberPatterns) {
            const match = text.match(pattern);
            if (match) {
                data.billNumber = match[1].trim();
                break;
            }
        }


        const datePatterns = [
            /(?:bill\s*(?:for|period)|billing\s*period)[:\s]*([A-Z]+)\s*[,-]?\s*(\d{4})/i,
            /(?:month|period)[:\s]*([A-Z]+)\s*[,-]?\s*(\d{4})/i,
            /(?:reading\s*period|bill\s*month)[:\s]*([A-Z]+)\s*[,-]?\s*(\d{4})/i,
            /(\d{1,2})[\/\-](\d{4})/,
            /([A-Z]+)[\/\-\s]+(\d{4})/i,
            /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s*[,-]?\s*(\d{4})/i,
            /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/
        ];

        for (const pattern of datePatterns) {
            const match = text.match(pattern);
            if (match) {
                if (match[3]) {
                    const month = parseInt(match[2]);
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    data.billingMonth = monthNames[month - 1] || match[2];
                    data.billingYear = parseInt(match[3]);
                } else {
                    data.billingMonth = match[1];
                    data.billingYear = parseInt(match[2]);
                }
                break;
            }
        }


        const namePatterns = [
            /(?:name|customer)[:\s]*([A-Z\s\.]+)(?:\n|address|mobile)/i,
            /(?:m\/s|mr|mrs|ms)[:\s]*([A-Z\s\.]+)/i
        ];

        for (const pattern of namePatterns) {
            const match = text.match(pattern);
            if (match) {
                data.customerName = match[1].trim();
                break;
            }
        }


        const unitsPatterns = [
            /(?:units?\s*consumed|consumption|kwh\s*consumed)[:\s]*(\d+(?:\.\d+)?)/i,
            /(?:energy\s*consumed|total\s*units)[:\s]*(\d+(?:\.\d+)?)/i,
            /(\d+(?:\.\d+)?)\s*kwh/i
        ];

        for (const pattern of unitsPatterns) {
            const match = text.match(pattern);
            if (match) {
                data.unitsConsumed = parseFloat(match[1]);
                break;
            }
        }


        const meterPatterns = [
            /(?:present\s*reading|current\s*reading)[:\s]*(\d+)/i,
            /(?:previous\s*reading|last\s*reading)[:\s]*(\d+)/i,
            /(?:meter\s*no|meter\s*number)[:\s]*([A-Z0-9]+)/i
        ];

        const presentMatch = text.match(/(?:present\s*reading|current\s*reading)[:\s]*(\d+)/i);
        const previousMatch = text.match(/(?:previous\s*reading|last\s*reading)[:\s]*(\d+)/i);
        const meterMatch = text.match(/(?:meter\s*no|meter\s*number)[:\s]*([A-Z0-9]+)/i);

        if (presentMatch) data.meterReadingEnd = parseInt(presentMatch[1]);
        if (previousMatch) data.meterReadingStart = parseInt(previousMatch[1]);
        if (meterMatch) data.meterNumber = meterMatch[1];

        if (data.meterReadingEnd && data.meterReadingStart) {
            data.meterReadingDifference = data.meterReadingEnd - data.meterReadingStart;
        }


        const demandPatterns = [
            /(?:maximum\s*demand|max\s*demand|peak\s*demand)[:\s]*(\d+(?:\.\d+)?)/i,
            /(\d+(?:\.\d+)?)\s*kw/i
        ];

        for (const pattern of demandPatterns) {
            const match = text.match(pattern);
            if (match) {
                data.maximumDemand = parseFloat(match[1]);
                break;
            }
        }


        const chargePatterns = [
            {
                key: 'demandCharges',
                patterns: [
                    /(?:demand\s*charge|md\s*charge|maximum\s*demand)[:\s]*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d+)?)/i,
                    /(?:kw\s*charge|demand)[:\s]*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d+)?)/i
                ]
            },
            {
                key: 'fixedCharges',
                patterns: [
                    /(?:fixed\s*charge|basic\s*charge|monthly\s*charge)[:\s]*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d+)?)/i,
                    /(?:service\s*charge|standing\s*charge)[:\s]*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d+)?)/i
                ]
            },
            {
                key: 'energyCharges',
                patterns: [
                    /(?:energy\s*charge|unit\s*charge|kwh\s*charge|electricity\s*charge)[:\s]*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d+)?)/i,
                    /(?:consumption\s*charge|variable\s*charge)[:\s]*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d+)?)/i
                ]
            },
            {
                key: 'fuelSurchargeAdjustment',
                patterns: [
                    /(?:fuel\s*(?:surcharge|adjustment)|fsa|fca)[:\s]*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d+)?)/i,
                    /(?:power\s*purchase\s*adjustment|ppa)[:\s]*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d+)?)/i
                ]
            },
            {
                key: 'electricityDuty',
                patterns: [
                    /(?:electricity\s*duty|duty)[:\s]*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d+)?)/i
                ]
            },
            {
                key: 'gst',
                patterns: [
                    /(?:gst|cgst|sgst|igst)[:\s]*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d+)?)/i,
                    /(?:tax|service\s*tax)[:\s]*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d+)?)/i
                ]
            },
            {
                key: 'penalties',
                patterns: [
                    /(?:penalty|late\s*(?:fee|payment)|surcharge|interest)[:\s]*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d+)?)/i,
                    /(?:additional\s*charge|miscellaneous)[:\s]*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d+)?)/i
                ]
            },
            {
                key: 'totalAmount',
                patterns: [
                    /(?:total\s*(?:amount|bill)|grand\s*total|amount\s*payable|net\s*payable)[:\s]*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d+)?)/i,
                    /(?:current\s*bill|this\s*month)[:\s]*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d+)?)/i,
                    /₹\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:total|payable)/i
                ]
            }
        ];

        for (const { key, patterns } of chargePatterns) {
            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match && match[1]) {

                    const cleanNumber = match[1].replace(/,/g, '');
                    const value = parseFloat(cleanNumber);
                    if (!isNaN(value) && value > 0) {
                        (data as any)[key] = value;
                        break;
                    }
                }
            }
        }


        const tariffPatterns = [
            /(?:tariff|rate|category)[:\s]*([A-Z0-9\-\s]+)/i,
            /(?:unit\s*rate)[:\s]*(?:rs\.?|₹)?\s*(\d+(?:\.\d+)?)/i
        ];

        const tariffMatch = text.match(tariffPatterns[0]);
        const rateMatch = text.match(tariffPatterns[1]);

        if (tariffMatch) data.tariffCategory = tariffMatch[1].trim();
        if (rateMatch) data.unitRate = parseFloat(rateMatch[1]);


        const validatedData = this.validateAndCleanData(data);
        Object.assign(data, validatedData);

        return data;
    }


    validateAndCleanData(data: ExtractedBillData): ExtractedBillData {

        if (data.consumerNumber) {
            data.consumerNumber = data.consumerNumber.replace(/\s/g, '');

            if (data.consumerNumber.length < 6 || data.consumerNumber.length > 20) {
                data.consumerNumber = 'PROCESSING';
            }
        }

        if (data.unitsConsumed) {
            if (data.unitsConsumed < 0 || data.unitsConsumed > 50000) {
                data.unitsConsumed = 0;
            }
        }


        if (data.totalAmount) {
            if (data.totalAmount < 0 || data.totalAmount > 1000000) {
                data.totalAmount = 0;
            }
        }


        if (!data.energyCharges && data.unitsConsumed && data.unitRate) {
            data.energyCharges = data.unitsConsumed * data.unitRate;
        }


        if (!data.netPayableAmount && data.totalAmount) {
            data.netPayableAmount = data.totalAmount;
        }


        if (data.meterReadingStart && data.meterReadingEnd) {
            if (data.meterReadingEnd < data.meterReadingStart) {

                data.meterReadingDifference = data.unitsConsumed || 0;
            } else {
                data.meterReadingDifference = data.meterReadingEnd - data.meterReadingStart;


                if (data.unitsConsumed && Math.abs(data.meterReadingDifference - data.unitsConsumed) > 100) {

                    data.meterReadingDifference = data.unitsConsumed;
                }
            }
        }


        if (data.customerName) {
            data.customerName = data.customerName.replace(/[^A-Za-z\s\.]/g, '').trim();
            if (data.customerName.length < 3) {
                data.customerName = 'PROCESSING';
            }
        }


        if (data.billingMonth) {
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const monthMatch = months.find(month =>
                data.billingMonth?.toUpperCase().includes(month)
            );
            if (monthMatch) {
                data.billingMonth = monthMatch;
            }
        }


        if (data.billingYear) {
            const currentYear = new Date().getFullYear();
            if (data.billingYear < currentYear - 5 || data.billingYear > currentYear + 1) {
                data.billingYear = currentYear;
            }
        }


        data.unitsConsumed = data.unitsConsumed || 0;
        data.demandCharges = data.demandCharges || 0;
        data.fixedCharges = data.fixedCharges || 0;
        data.energyCharges = data.energyCharges || 0;
        data.penalties = data.penalties || 0;
        data.surcharges = data.surcharges || 0;
        data.totalTaxes = data.totalTaxes || data.gst || 0;
        data.totalAmount = data.totalAmount || 0;
        data.netPayableAmount = data.netPayableAmount || data.totalAmount || 0;


        data.confidence = this.calculateConfidenceScore(data);

        return data;
    }


    calculateConfidenceScore(data: ExtractedBillData): number {
        let score = 0;
        let maxScore = 0;


        const criticalFields = [
            { field: 'consumerNumber', weight: 25 },
            { field: 'totalAmount', weight: 20 },
            { field: 'unitsConsumed', weight: 20 },
            { field: 'billingMonth', weight: 15 }
        ];

        const importantFields = [
            { field: 'customerName', weight: 10 },
            { field: 'energyCharges', weight: 10 },
            { field: 'billingYear', weight: 5 },
            { field: 'billNumber', weight: 5 }
        ];

        for (const { field, weight } of criticalFields) {
            maxScore += weight;
            const value = (data as any)[field];
            if (value && value !== 'PROCESSING' && value !== 0) {
                score += weight;
            } else if (value === 0 && (field === 'totalAmount' || field === 'unitsConsumed')) {

                score += weight * 0.5;
            }
        }


        for (const { field, weight } of importantFields) {
            maxScore += weight;
            const value = (data as any)[field];
            if (value && value !== 'PROCESSING') {
                score += weight;
            }
        }

        return Math.round((score / maxScore) * 100);
    }

    async processFile(filePath: string): Promise<ExtractedBillData> {
        const fileExtension = path.extname(filePath).toLowerCase();
        let ocrResult: OCRResult;

        try {
            if (fileExtension === '.pdf') {
                ocrResult = await this.processPDF(filePath);
            } else if (['.jpg', '.jpeg', '.png', '.bmp', '.tiff'].includes(fileExtension)) {
                ocrResult = await this.processImage(filePath);
            } else {
                throw new Error(`Unsupported file type: ${fileExtension}`);
            }

            if (!ocrResult.success) {
                throw new Error(ocrResult.error || 'OCR processing failed');
            }


            return this.extractBillData(ocrResult.text, ocrResult.confidence);

        } catch (error: any) {
            return {
                rawText: '',
                confidence: 0,
                unitsConsumed: 0,
                demandCharges: 0,
                fixedCharges: 0,
                penalties: 0,
                surcharges: 0,
                totalTaxes: 0,
                totalAmount: 0,
                netPayableAmount: 0
            };
        }
    }
}

export default new OCRService();