import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Zap, DollarSign, Calendar, Download, } from 'lucide-react';
import { useGetDashboardAnalyticsQuery, } from '../../../redux/apis/analytics.api';
import toast from 'react-hot-toast';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [timeRange, setTimeRange] = useState('12months');

  const { data: analyticsData, isLoading, error } = useGetDashboardAnalyticsQuery({ timeRange } as any);


  useEffect(() => {
    if (error) {
      toast.error('Failed to load analytics data');
    }
  }, [error]);

  const handleExportReport = () => {
    if (!user) {
      toast.error('Please login to export reports');
      navigate('/login');
      return;
    }

    toast.success('Exporting report...');
  };


  const data = analyticsData as any;
  const monthlyTrends = data?.monthlyTrends || [];
  const peakOffPeakData = data?.peakOffPeakData || [];
  const costBreakdown = data?.costBreakdown || [];
  const tariffComparison = data?.tariffComparison || [];
  const kpiMetrics = data?.kpiMetrics || {
    totalConsumption: 0,
    averageUnitCost: 0,
    totalBillAmount: 0,
    peakDemand: 0,
    consumptionTrend: 0,
    costTrend: 0,
    billTrend: 0,
    demandTrend: 0,
  };


  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              KPI tracking, usage trends, and comparative cost analysis
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="12months">Last 12 Months</SelectItem>
                <SelectItem value="24months">Last 24 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Consumption</p>
                  <p className="text-2xl font-bold">{kpiMetrics.totalConsumption?.toLocaleString() || 0} kWh</p>
                  <p className={`text-xs flex items-center ${kpiMetrics.consumptionTrend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {kpiMetrics.consumptionTrend >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {Math.abs(kpiMetrics.consumptionTrend || 0).toFixed(1)}% vs last year
                  </p>
                </div>
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Unit Cost</p>
                  <p className="text-2xl font-bold">₹{(kpiMetrics.averageUnitCost || 0).toFixed(2)}/kWh</p>
                  <p className={`text-xs flex items-center ${kpiMetrics.costTrend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {kpiMetrics.costTrend >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {Math.abs(kpiMetrics.costTrend || 0).toFixed(1)}% vs last year
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bill Amount</p>
                  <p className="text-2xl font-bold">{formatCurrency(kpiMetrics.totalBillAmount || 0)}</p>
                  <p className={`text-xs flex items-center ${kpiMetrics.billTrend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {kpiMetrics.billTrend >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {Math.abs(kpiMetrics.billTrend || 0).toFixed(1)}% vs last year
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Peak Demand</p>
                  <p className="text-2xl font-bold">{(kpiMetrics.peakDemand || 0).toFixed(1)} kW</p>
                  <p className={`text-xs flex items-center ${kpiMetrics.demandTrend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {kpiMetrics.demandTrend >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {Math.abs(kpiMetrics.demandTrend || 0).toFixed(1)}% vs last year
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Consumption & Cost Trends</CardTitle>
              <CardDescription>
                Track your energy usage and costs over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {monthlyTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="consumption"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Consumption (kWh)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="cost"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="Cost (₹)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No consumption data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Peak/Off-Peak Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Peak vs Off-Peak Usage</CardTitle>
              <CardDescription>
                Time-of-use breakdown for demand optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {peakOffPeakData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={peakOffPeakData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="peak"
                      stackId="1"
                      stroke="#ff7c7c"
                      fill="#ff7c7c"
                      name="Peak Hours"
                    />
                    <Area
                      type="monotone"
                      dataKey="shoulder"
                      stackId="1"
                      stroke="#ffc658"
                      fill="#ffc658"
                      name="Shoulder Hours"
                    />
                    <Area
                      type="monotone"
                      dataKey="offPeak"
                      stackId="1"
                      stroke="#8dd1e1"
                      fill="#8dd1e1"
                      name="Off-Peak Hours"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No peak/off-peak data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of your electricity charges
              </CardDescription>
            </CardHeader>


            <CardContent>
              {costBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={costBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {/* {costBreakdown.map((entry:any, index:any) => ( */}
                      {costBreakdown.map((index: any) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [
                      `${formatCurrency(props.payload.amount)} (${value}%)`,
                      name
                    ]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No cost breakdown data available
                </div>
              )}
            </CardContent>
          </Card>


          {/* Tariff Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Tariff Optimization Opportunities</CardTitle>
              <CardDescription>
                Compare current vs optimized tariff scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tariffComparison.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tariffComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" fill="#8884d8" name="Current Rate (₹/kWh)" />
                    <Bar dataKey="optimized" fill="#82ca9d" name="Optimized Rate (₹/kWh)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No tariff comparison data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>


        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Insights & Recommendations</CardTitle>
            <CardDescription>
              Actionable insights to optimize your energy costs
            </CardDescription>
          </CardHeader>

          <CardContent>
            const data = analyticsData as any;

            <div className="space-y-4">
              {data?.insights && data.insights.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.insights.map((insight: any, index: number) => {
                    const colors = [
                      { bg: 'bg-green-50', border: 'border-green-500', title: 'text-green-800', text: 'text-green-700' },
                      { bg: 'bg-blue-50', border: 'border-blue-500', title: 'text-blue-800', text: 'text-blue-700' },
                      { bg: 'bg-orange-50', border: 'border-orange-500', title: 'text-orange-800', text: 'text-orange-700' },
                      { bg: 'bg-purple-50', border: 'border-purple-500', title: 'text-purple-800', text: 'text-purple-700' }
                    ];
                    const colorScheme = colors[index % colors.length];

                    return (
                      <div key={index} className={`p-4 ${colorScheme.bg} rounded-lg border-l-4 ${colorScheme.border}`}>
                        <h4 className={`font-semibold ${colorScheme.title}`}>{insight.title}</h4>
                        <p className={`text-sm ${colorScheme.text} mt-1`}>
                          {insight.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No insights available at this time
                </div>
              )}
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;