import React, { useState, useEffect } from 'react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
)

interface AnalyticsData {
    _id: { year: number; month?: string }
    totalBills: number
    totalUnitsConsumed: number
    totalAmount: number
    averageUnitRate: number
    totalDemandCharges: number
    totalFixedCharges: number
    totalEnergyCharges: number
    totalTaxes: number
}

interface SummaryStats {
    totalBills: number
    totalUnitsConsumed: number
    totalAmountPaid: number
    averageMonthlyConsumption: number
    averageMonthlyBill: number
    highestBill: number
    lowestBill: number
}

const BillAnalytics: React.FC = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData[]>([])
    const [summary, setSummary] = useState<SummaryStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: '',
        groupBy: 'month'
    })

    useEffect(() => {
        loadAnalytics()
    }, [dateRange])

    const loadAnalytics = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (dateRange.startDate) params.append('startDate', dateRange.startDate)
            if (dateRange.endDate) params.append('endDate', dateRange.endDate)
            params.append('groupBy', dateRange.groupBy)

            const response = await fetch(`/api/v1/bills/analytics?${params}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            const result = await response.json()

            if (result.success) {
                setAnalytics(result.analytics)
                setSummary(result.summary)
            }
        } catch (error) {
            console.error('Error loading analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    const consumptionChartData = {
        labels: analytics.map(item =>
            dateRange.groupBy === 'month'
                ? `${item._id.month} ${item._id.year}`
                : `${item._id.year}`
        ),
        datasets: [
            {
                label: 'Units Consumed (kWh)',
                data: analytics.map(item => item.totalUnitsConsumed),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
            },
        ],
    }

    const costBreakdownData = {
        labels: analytics.map(item =>
            dateRange.groupBy === 'month'
                ? `${item._id.month} ${item._id.year}`
                : `${item._id.year}`
        ),
        datasets: [
            {
                label: 'Demand Charges',
                data: analytics.map(item => item.totalDemandCharges),
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
            },
            {
                label: 'Fixed Charges',
                data: analytics.map(item => item.totalFixedCharges),
                backgroundColor: 'rgba(245, 158, 11, 0.8)',
            },
            {
                label: 'Energy Charges',
                data: analytics.map(item => item.totalEnergyCharges),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
            },
            {
                label: 'Taxes',
                data: analytics.map(item => item.totalTaxes),
                backgroundColor: 'rgba(168, 85, 247, 0.8)',
            },
        ],
    }

    const totalChargesData = summary ? {
        labels: ['Demand Charges', 'Fixed Charges', 'Energy Charges', 'Taxes'],
        datasets: [
            {
                data: [
                    analytics.reduce((sum, item) => sum + item.totalDemandCharges, 0),
                    analytics.reduce((sum, item) => sum + item.totalFixedCharges, 0),
                    analytics.reduce((sum, item) => sum + item.totalEnergyCharges, 0),
                    analytics.reduce((sum, item) => sum + item.totalTaxes, 0),
                ],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                ],
            },
        ],
    } : null

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Energy Bill Analytics</h1>

            {/* Date Range Filter */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                            type="date"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Group By</label>
                        <select
                            value={dateRange.groupBy}
                            onChange={(e) => setDateRange(prev => ({ ...prev, groupBy: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="month">Month</option>
                            <option value="year">Year</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={loadAnalytics}
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading analytics...</div>
            ) : (
                <>
                    {/* Summary Cards */}
                    {summary && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-sm font-medium text-gray-500">Total Bills</h3>
                                <p className="text-2xl font-bold text-gray-900">{summary.totalBills}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-sm font-medium text-gray-500">Total Consumption</h3>
                                <p className="text-2xl font-bold text-gray-900">{summary.totalUnitsConsumed.toLocaleString()} kWh</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-sm font-medium text-gray-500">Total Amount Paid</h3>
                                <p className="text-2xl font-bold text-gray-900">¹{summary.totalAmountPaid.toLocaleString()}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-sm font-medium text-gray-500">Avg Monthly Bill</h3>
                                <p className="text-2xl font-bold text-gray-900">¹{Math.round(summary.averageMonthlyBill).toLocaleString()}</p>
                            </div>
                        </div>
                    )}

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Consumption Trend */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">Energy Consumption Trend</h3>
                            <Line data={consumptionChartData} options={chartOptions} />
                        </div>

                        {/* Cost Breakdown Pie Chart */}
                        {totalChargesData && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold mb-4">Total Cost Breakdown</h3>
                                <Doughnut data={totalChargesData} options={chartOptions} />
                            </div>
                        )}
                    </div>

                    {/* Cost Breakdown by Period */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h3 className="text-lg font-semibold mb-4">Cost Breakdown by Period</h3>
                        <Bar data={costBreakdownData} options={chartOptions} />
                    </div>

                    {/* Detailed Analytics Table */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Detailed Analytics</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-2 text-left">Period</th>
                                        <th className="px-4 py-2 text-left">Bills</th>
                                        <th className="px-4 py-2 text-left">Units (kWh)</th>
                                        <th className="px-4 py-2 text-left">Avg Rate (¹/kWh)</th>
                                        <th className="px-4 py-2 text-left">Demand Charges</th>
                                        <th className="px-4 py-2 text-left">Fixed Charges</th>
                                        <th className="px-4 py-2 text-left">Energy Charges</th>
                                        <th className="px-4 py-2 text-left">Taxes</th>
                                        <th className="px-4 py-2 text-left">Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.map((item, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="px-4 py-2">
                                                {dateRange.groupBy === 'month'
                                                    ? `${item._id.month} ${item._id.year}`
                                                    : `${item._id.year}`
                                                }
                                            </td>
                                            <td className="px-4 py-2">{item.totalBills}</td>
                                            <td className="px-4 py-2">{item.totalUnitsConsumed.toLocaleString()}</td>
                                            <td className="px-4 py-2">¹{item.averageUnitRate.toFixed(2)}</td>
                                            <td className="px-4 py-2">¹{item.totalDemandCharges.toLocaleString()}</td>
                                            <td className="px-4 py-2">¹{item.totalFixedCharges.toLocaleString()}</td>
                                            <td className="px-4 py-2">¹{item.totalEnergyCharges.toLocaleString()}</td>
                                            <td className="px-4 py-2">¹{item.totalTaxes.toLocaleString()}</td>
                                            <td className="px-4 py-2 font-semibold">¹{item.totalAmount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default BillAnalytics