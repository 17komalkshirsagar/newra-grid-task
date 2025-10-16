import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import Report from '../models/Report';
import Analytics from '../models/Analytics';
import { User } from '../models/User';
import { UtilityBill } from '../models/UtilityBill';
import Scenario from '../models/Scenario';


dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://komal:itmTklEoGE6ASZIP@cluster0.g5tlf77.mongodb.net/energy-platform';


const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};


const createUtilityBills = async (userId: mongoose.Types.ObjectId) => {
  const bills = [
    {
      userId,
      consumerNumber: 'EN001234567890',
      billNumber: 'BILL-2024-001',
      billingMonth: 'January',
      billingYear: 2024,
      billIssueDate: new Date('2024-02-01'),
      billDueDate: new Date('2024-02-15'),
      paymentStatus: 'Paid',
      customerName: 'ABC Manufacturing Ltd',
      supplyAddress: '123 Industrial Area, Mumbai, Maharashtra 400001',
      meterNumber: 'MTR-123456789',
      unitsConsumed: 1200,
      meterReadingStart: 45000,
      meterReadingEnd: 46200,
      meterReadingDifference: 1200,
      maximumDemand: 25,
      powerFactor: 0.92,
      peakUsage: 720,
      offPeakUsage: 480,
      tariffPlan: 'Industrial',
      tariffCategory: 'HT-1',
      unitRate: 7.2,
      demandCharges: 1200,
      fixedCharges: 340,
      energyCharges: 6800,
      gst: 300,
      totalAmount: 8640,
      netPayableAmount: 8640,
      rawExtractedJson: { extracted: true },
      processingStatus: 'Completed',
      uploadDate: new Date('2024-01-15')
    },
    {
      userId,
      consumerNumber: 'EN001234567891',
      billNumber: 'BILL-2024-002',
      billingMonth: 'February',
      billingYear: 2024,
      billIssueDate: new Date('2024-03-01'),
      billDueDate: new Date('2024-03-15'),
      paymentStatus: 'Paid',
      customerName: 'ABC Manufacturing Ltd',
      supplyAddress: '123 Industrial Area, Mumbai, Maharashtra 400001',
      meterNumber: 'MTR-123456789',
      unitsConsumed: 1150,
      meterReadingStart: 46200,
      meterReadingEnd: 47350,
      meterReadingDifference: 1150,
      maximumDemand: 23,
      powerFactor: 0.89,
      peakUsage: 690,
      offPeakUsage: 460,
      tariffPlan: 'Industrial',
      tariffCategory: 'HT-1',
      unitRate: 7.2,
      demandCharges: 1150,
      fixedCharges: 340,
      energyCharges: 6500,
      gst: 290,
      totalAmount: 8280,
      netPayableAmount: 8280,
      rawExtractedJson: { extracted: true },
      processingStatus: 'Completed',
      uploadDate: new Date('2024-02-15')
    },
    {
      userId,
      consumerNumber: 'EN001234567892',
      billNumber: 'BILL-2024-003',
      billingMonth: 'March',
      billingYear: 2024,
      billIssueDate: new Date('2024-04-01'),
      billDueDate: new Date('2024-04-15'),
      paymentStatus: 'Paid',
      customerName: 'ABC Manufacturing Ltd',
      supplyAddress: '123 Industrial Area, Mumbai, Maharashtra 400001',
      meterNumber: 'MTR-123456789',
      unitsConsumed: 1300,
      meterReadingStart: 47350,
      meterReadingEnd: 48650,
      meterReadingDifference: 1300,
      maximumDemand: 28,
      powerFactor: 0.88,
      peakUsage: 780,
      offPeakUsage: 520,
      tariffPlan: 'Industrial',
      tariffCategory: 'HT-1',
      unitRate: 7.2,
      demandCharges: 1400,
      fixedCharges: 340,
      energyCharges: 7300,
      gst: 320,
      totalAmount: 9360,
      netPayableAmount: 9360,
      rawExtractedJson: { extracted: true },
      processingStatus: 'Completed',
      uploadDate: new Date('2024-03-15')
    }
  ];

  return await UtilityBill.insertMany(bills);
};


const createScenarios = async (userId: mongoose.Types.ObjectId) => {
  const scenarios = [
    {
      userId,
      scenarioName: 'Solar Integration Scenario',
      description: 'Implementing 25% solar power to reduce grid dependency',
      scenarioType: 'energy_mix',
      baseUnitsConsumed: 1200,
      baseTotalAmount: 8640,
      baseDemandCharges: 1200,
      baseFixedCharges: 340,
      baseEnergyCharges: 6800,
      baseTaxes: 300,
      energyMixPercentage: 25,
      projectedUnitsConsumed: 1200,
      projectedDemandCharges: 1020,
      projectedFixedCharges: 340,
      projectedEnergyCharges: 5780,
      projectedTaxes: 255,
      projectedTotalAmount: 7395,
      costSavings: 1245,
      percentageSavings: 14.4,
      annualSavings: 14940,
      paybackPeriod: 32,
      simulationStatus: 'completed'
    },
    {
      userId,
      scenarioName: 'Peak Load Shifting',
      description: 'Shifting 30% of peak consumption to off-peak hours',
      scenarioType: 'consumption_optimization',
      baseUnitsConsumed: 1200,
      baseTotalAmount: 8640,
      baseDemandCharges: 1200,
      baseFixedCharges: 340,
      baseEnergyCharges: 6800,
      baseTaxes: 300,
      consumptionReduction: 10,
      projectedUnitsConsumed: 1080,
      projectedDemandCharges: 1080,
      projectedFixedCharges: 340,
      projectedEnergyCharges: 6120,
      projectedTaxes: 270,
      projectedTotalAmount: 7810,
      costSavings: 830,
      percentageSavings: 9.6,
      annualSavings: 9960,
      paybackPeriod: 0,
      simulationStatus: 'completed'
    }
  ];

  return await Scenario.insertMany(scenarios);
};


const createAnalytics = async (userId: mongoose.Types.ObjectId, billIds: mongoose.Types.ObjectId[]) => {
  const analyticsData = [
    {
      userId,
      billId: billIds[0],
      kpiMetrics: {
        unitCostTrends: {
          current: 7.2,
          previous: 7.5,
          percentageChange: -4.0,
          trend: 'decreasing'
        },
        peakOffPeakUsage: {
          peakHours: {
            consumption: 720,
            cost: 4080,
            hours: ['09:00-18:00']
          },
          offPeakHours: {
            consumption: 480,
            cost: 2720,
            hours: ['18:00-09:00']
          },
          ratio: 1.5
        },
        demandCharges: {
          maxDemand: 25,
          averageDemand: 22,
          demandCost: 1200,
          demandPercentageOfTotal: 13.9
        },
        consumptionPatterns: {
          dailyAverage: 40,
          monthlyTotal: 1200,
          yearlyProjection: 14400,
          seasonalVariation: {
            summer: 1.2,
            monsoon: 0.9,
            winter: 1.0,
            spring: 1.1
          }
        },
        costBreakdown: {
          energyCharges: 6800,
          demandCharges: 1200,
          fixedCharges: 340,
          taxes: 300,
          penalties: 0,
          totalCost: 8640
        }
      },
      dashboardMetrics: {
        totalSavings: 1296,
        averageUnitCost: 7.2,
        powerFactor: 0.92,
        efficiency: 87,
        carbonFootprint: 984
      },
      reportingPeriod: {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        frequency: 'monthly'
      }
    },
    {
      userId,
      billId: billIds[1],
      kpiMetrics: {
        unitCostTrends: {
          current: 7.2,
          previous: 7.2,
          percentageChange: 0,
          trend: 'stable'
        },
        peakOffPeakUsage: {
          peakHours: {
            consumption: 690,
            cost: 3900,
            hours: ['09:00-18:00']
          },
          offPeakHours: {
            consumption: 460,
            cost: 2600,
            hours: ['18:00-09:00']
          },
          ratio: 1.5
        },
        demandCharges: {
          maxDemand: 23,
          averageDemand: 20,
          demandCost: 1150,
          demandPercentageOfTotal: 13.9
        },
        consumptionPatterns: {
          dailyAverage: 38.3,
          monthlyTotal: 1150,
          yearlyProjection: 13800,
          seasonalVariation: {
            summer: 1.2,
            monsoon: 0.9,
            winter: 1.0,
            spring: 1.1
          }
        },
        costBreakdown: {
          energyCharges: 6500,
          demandCharges: 1150,
          fixedCharges: 340,
          taxes: 290,
          penalties: 0,
          totalCost: 8280
        }
      },
      dashboardMetrics: {
        totalSavings: 864,
        averageUnitCost: 7.2,
        powerFactor: 0.89,
        efficiency: 85,
        carbonFootprint: 943
      },
      reportingPeriod: {
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-29'),
        frequency: 'monthly'
      }
    }
  ];

  return await Analytics.insertMany(analyticsData);
};


const createReports = async (userId: mongoose.Types.ObjectId, billIds: mongoose.Types.ObjectId[], scenarioIds: mongoose.Types.ObjectId[]) => {
  const reports = [
    {
      title: 'Energy Analytics Dashboard Q1 2024',
      user: userId,
      userId,
      type: 'PDF',
      reportCategory: 'kpi_dashboard',
      sourceData: {
        billId: [billIds[0], billIds[1]],
        dateRange: {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-03-31')
        }
      },
      content: {
        summary: {
          totalSavings: 2160,
          percentageSavings: 12.5,
          recommendedActions: [
            'Implement solar panel installation',
            'Optimize peak hour consumption',
            'Improve power factor to 0.95'
          ],
          implementationPriority: 'High'
        },
        kpiData: {
          unitCostTrends: [
            { month: 'Jan', cost: 7.2, consumption: 1200 },
            { month: 'Feb', cost: 7.2, consumption: 1150 },
            { month: 'Mar', cost: 7.2, consumption: 1300 }
          ]
        }
      },
      fileName: 'energy-analytics-q1-2024.pdf',
      fileSize: 2048576,
      status: 'completed',
      settings: {
        includeCharts: true,
        includeRawData: false,
        includeRecommendations: true,
        language: 'en',
        currency: 'INR',
        dateFormat: 'DD/MM/YYYY'
      },
      accessLevel: 'private',
      downloadCount: 15,
      lastDownloaded: new Date('2024-01-15T14:30:00')
    },
    {
      title: 'Bill Analysis Report - March 2024',
      user: userId,
      userId,
      type: 'Excel',
      reportCategory: 'bill_analysis',
      sourceData: {
        billId: [billIds[2]],
        dateRange: {
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-03-31')
        }
      },
      content: {
        billAnalysis: {
          baselineBill: {
            totalAmount: 9360,
            energyCharges: 7300,
            demandCharges: 1400
          },
          optimizedBill: {
            totalAmount: 7956,
            energyCharges: 6205,
            demandCharges: 1190
          },
          comparison: {
            energyChargesDiff: -1095,
            demandChargesDiff: -210,
            totalSavings: 1404
          }
        }
      },
      fileName: 'bill-analysis-march-2024.xlsx',
      fileSize: 1536000,
      status: 'completed',
      settings: {
        includeCharts: true,
        includeRawData: true,
        includeRecommendations: true,
        language: 'en',
        currency: 'INR',
        dateFormat: 'DD/MM/YYYY'
      },
      accessLevel: 'shared',
      downloadCount: 8,
      lastDownloaded: new Date('2024-04-10T16:45:00')
    },
    {
      title: 'Scenario Comparison Report',
      user: userId,
      userId,
      type: 'PDF',
      reportCategory: 'scenario_comparison',
      sourceData: {
        simulationId: scenarioIds,
        dateRange: {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31')
        }
      },
      content: {
        scenarioComparisons: {
          scenarios: [
            { name: 'Current State', annualCost: 103680 },
            { name: 'Solar Integration', annualCost: 88128 },
            { name: 'Load Shifting', annualCost: 93312 }
          ],
          bestOption: {
            name: 'Solar Integration',
            savings: 15552,
            paybackPeriod: 32
          },
          recommendations: [
            'Prioritize solar panel installation',
            'Consider time-of-use tariff optimization',
            'Implement demand response strategies'
          ]
        }
      },
      fileName: 'scenario-comparison-2024.pdf',
      status: 'generating',
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
    },
    {
      title: 'PowerBI Export Data',
      user: userId,
      userId,
      type: 'Excel',
      reportCategory: 'powerbi_export',
      sourceData: {
        billId: billIds,
        dateRange: {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-03-31')
        }
      },
      content: {
        exportData: {
          consumptionData: true,
          costData: true,
          demandData: true,
          tariffData: true
        }
      },
      fileName: 'powerbi-export-q1-2024.xlsx',
      status: 'failed',
      errorMessage: 'Export service temporarily unavailable',
      settings: {
        includeCharts: false,
        includeRawData: true,
        includeRecommendations: false,
        language: 'en',
        currency: 'INR',
        dateFormat: 'DD/MM/YYYY'
      },
      accessLevel: 'private',
      downloadCount: 0
    }
  ];

  return await Report.insertMany(reports);
};


const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    await connectDB();


    console.log('🧹 Clearing existing data...');
    await Report.deleteMany({});
    await Analytics.deleteMany({});
    await UtilityBill.deleteMany({});
    await Scenario.deleteMany({});

    let user = await User.findOne({ email: 'demo@energy-platform.com' });
    if (!user) {
      const hashedPassword = await bcryptjs.hash('password123', 10);
      user = await User.create({
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@energy-platform.com',
        password: hashedPassword,
        phone: '+91-9876543210',
        role: 'Admin',
        status: 'active'
      });
      console.log('👤 Created demo user');
    }

    const userId = user._id as mongoose.Types.ObjectId;


    console.log('📊 Creating utility bills...');
    const bills = await createUtilityBills(userId);
    const billIds = bills.map(bill => bill._id as mongoose.Types.ObjectId);

    console.log('🎯 Creating scenarios...');
    const scenarios = await createScenarios(userId);
    const scenarioIds = scenarios.map(scenario => scenario._id as mongoose.Types.ObjectId);

    console.log('📈 Creating analytics...');
    await createAnalytics(userId, billIds);

    console.log('📋 Creating reports...');
    await createReports(userId, billIds, scenarioIds);

    console.log(' Database seeding completed successfully!');
    console.log(` Demo user email: demo@energy-platform.com`);
    console.log(` Demo user password: password123`);

    process.exit(0);
  } catch (error) {
    console.error(' Error seeding database:', error);
    process.exit(1);
  }
};


if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };