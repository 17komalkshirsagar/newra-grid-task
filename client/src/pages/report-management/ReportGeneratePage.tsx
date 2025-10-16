// import  { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import toast from 'react-hot-toast';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { ArrowLeft, FileText, Download } from 'lucide-react';
// import { useGetAllBillsQuery } from '@/redux/apis/bill.api';

// const reportSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   type: z.enum(['PDF', 'Excel', 'CSV']),
//   reportCategory: z.enum([
//     'bill_analysis',
//     'scenario_comparison',
//     'kpi_dashboard',
//     'consumption_trends',
//     'cost_analysis',
//     'powerbi_export'
//   ]),
//   dateRangeStart: z.string().optional(),
//   dateRangeEnd: z.string().optional(),
//   includeCharts: z.boolean().default(true),
//   includeRawData: z.boolean().default(false),
//   includeRecommendations: z.boolean().default(true),
// });

// type ReportFormData = z.infer<typeof reportSchema>;

// const ReportGeneratePage = () => {
//   const navigate = useNavigate();
//   const { data: billsData } = useGetAllBillsQuery({});
//   const [selectedCategory, setSelectedCategory] = useState<string>('bill_analysis');

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm<ReportFormData>({
//     resolver: zodResolver(reportSchema),
//     defaultValues: {
//       type: 'PDF',
//       reportCategory: 'bill_analysis',
//       includeCharts: true,
//       includeRawData: false,
//       includeRecommendations: true,
//     }
//   });

//   const onSubmit = async (data: ReportFormData) => {
//     try {
//       console.log('Generating report:', data);

//       // TODO: Implement actual report generation API call
//       // await generateReport(data).unwrap();

//       toast.success('Report generation started! You will be notified when it\'s ready.', {
//         duration: 5000
//       });

//       // Redirect to reports table
//       setTimeout(() => {
//         navigate('/admin/report-management/table');
//       }, 2000);
//     } catch (error: any) {
//       toast.error(error?.message || 'Failed to generate report');
//     }
//   };

//   const reportCategories = [
//     { value: 'bill_analysis', label: 'Bill Analysis Report', description: 'Detailed analysis of utility bills' },
//     { value: 'scenario_comparison', label: 'Scenario Comparison', description: 'Compare different scenarios side-by-side' },
//     { value: 'kpi_dashboard', label: 'KPI Dashboard', description: 'Key performance indicators and metrics' },
//     { value: 'consumption_trends', label: 'Consumption Trends', description: 'Historical consumption patterns' },
//     { value: 'cost_analysis', label: 'Cost Analysis', description: 'Detailed cost breakdown and trends' },
//     { value: 'powerbi_export', label: 'PowerBI Export', description: 'Export data for PowerBI analysis' },
//   ];

//   const reportTypes = [
//     { value: 'PDF', label: 'PDF Document' },
//     { value: 'Excel', label: 'Excel Spreadsheet' },
//     { value: 'CSV', label: 'CSV File' },
//   ];

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex justify-between items-start">
//           <div className="space-y-2">
//             <Button variant="ghost" onClick={() => navigate('/admin/report-management/table')}>
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Reports
//             </Button>
//             <h1 className="text-3xl font-bold tracking-tight">Generate Report</h1>
//             <p className="text-muted-foreground">
//               Create custom reports with analytics, trends, and insights
//             </p>
//           </div>
//         </div>

//         {/* Report Generation Form */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <FileText className="h-5 w-5" />
//               Report Configuration
//             </CardTitle>
//             <CardDescription>
//               Configure your report settings and generate custom analytics
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit(onSubmit:any)} className="space-y-6">
//               {/* Report Title */}
//               <div className="space-y-2">
//                 <Label htmlFor="title">Report Title *</Label>
//                 <Input
//                   id="title"
//                   placeholder="e.g., Monthly Energy Report - January 2025"
//                   {...register('title')}
//                 />
//                 {errors.title && (
//                   <p className="text-sm text-red-600">{errors.title.message}</p>
//                 )}
//               </div>

//               {/* Report Category */}
//               <div className="space-y-2">
//                 <Label htmlFor="reportCategory">Report Type *</Label>
//                 <Select
//                   value={selectedCategory}
//                   onValueChange={(value) => {
//                     setSelectedCategory(value);
//                     setValue('reportCategory', value as any);
//                   }}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select report type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {reportCategories.map((category) => (
//                       <SelectItem key={category.value} value={category.value}>
//                         <div>
//                           <div className="font-medium">{category.label}</div>
//                           <div className="text-xs text-muted-foreground">{category.description}</div>
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {errors.reportCategory && (
//                   <p className="text-sm text-red-600">{errors.reportCategory.message}</p>
//                 )}
//               </div>

//               {/* Output Format */}
//               <div className="space-y-2">
//                 <Label htmlFor="type">Output Format *</Label>
//                 <Select
//                   defaultValue="PDF"
//                   onValueChange={(value) => setValue('type', value as any)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {reportTypes.map((type) => (
//                       <SelectItem key={type.value} value={type.value}>
//                         {type.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {errors.type && (
//                   <p className="text-sm text-red-600">{errors.type.message}</p>
//                 )}
//               </div>

//               {/* Date Range */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="dateRangeStart">Start Date (Optional)</Label>
//                   <Input
//                     id="dateRangeStart"
//                     type="date"
//                     {...register('dateRangeStart')}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="dateRangeEnd">End Date (Optional)</Label>
//                   <Input
//                     id="dateRangeEnd"
//                     type="date"
//                     {...register('dateRangeEnd')}
//                   />
//                 </div>
//               </div>

//               {/* Report Options */}
//               <div className="space-y-3">
//                 <Label>Report Options</Label>
//                 <div className="space-y-2">
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       id="includeCharts"
//                       className="rounded border-gray-300"
//                       defaultChecked
//                       {...register('includeCharts')}
//                     />
//                     <Label htmlFor="includeCharts" className="font-normal cursor-pointer">
//                       Include charts and visualizations
//                     </Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       id="includeRawData"
//                       className="rounded border-gray-300"
//                       {...register('includeRawData')}
//                     />
//                     <Label htmlFor="includeRawData" className="font-normal cursor-pointer">
//                       Include raw data tables
//                     </Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       id="includeRecommendations"
//                       className="rounded border-gray-300"
//                       defaultChecked
//                       {...register('includeRecommendations')}
//                     />
//                     <Label htmlFor="includeRecommendations" className="font-normal cursor-pointer">
//                       Include recommendations and insights
//                     </Label>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex justify-end gap-3 pt-4">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => navigate('/admin/report-management/table')}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit" className="gap-2">
//                   <Download className="h-4 w-4" />
//                   Generate Report
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>

//         {/* Info Card */}
//         <Card className="bg-blue-50 border-blue-200">
//           <CardContent className="pt-6">
//             <div className="space-y-2">
//               <h3 className="font-semibold text-blue-900">Report Generation</h3>
//               <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
//                 <li>Reports are generated asynchronously and may take a few minutes</li>
//                 <li>You will receive a notification when your report is ready</li>
//                 <li>Generated reports can be downloaded from the Reports table</li>
//                 <li>Reports include data from all your uploaded bills within the selected date range</li>
//               </ul>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ReportGeneratePage;



const ReportGeneratePage = () => {
  return (
    <div>ReportGeneratePage</div>
  )
}

export default ReportGeneratePage