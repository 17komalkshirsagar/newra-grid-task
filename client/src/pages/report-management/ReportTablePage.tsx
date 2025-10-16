// import { useEffect, useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/store';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
// import { FileText, Download, Trash2, Eye, Filter, Search, BarChart3, FileSpreadsheet, Plus } from 'lucide-react';
// import { useGetAllReportsQuery, useDeleteReportMutation } from '@/redux/apis/report.api';

// interface IReport {
//   _id: string;
//   title: string;
//   type: 'PDF' | 'Excel';
//   reportCategory: 'bill_analysis' | 'scenario_comparison' | 'kpi_dashboard' | 'cost_optimization' | 'powerbi_export' | 'erp_export';
//   status: 'generating' | 'completed' | 'failed' | 'expired';
//   fileName: string;
//   fileSize?: number;
//   downloadCount: number;
//   lastDownloaded?: Date;
//   settings: {
//     includeCharts: boolean;
//     includeRawData: boolean;
//     includeRecommendations: boolean;
//     language: 'en' | 'hi';
//     currency: 'INR' | 'USD';
//   };
//   accessLevel: 'private' | 'shared' | 'public';
//   expiryDate?: Date;
//   createdAt: string;
//   updatedAt: string;
// }

// const ReportTablePage = () => {
//   const navigate = useNavigate();
//   const user = useSelector((state: RootState) => state.auth.user);
//   const { data: reportsData, isLoading, error, refetch } = useGetAllReportsQuery({});
//   const [deleteReport] = useDeleteReportMutation();

//   const reports: IReport[] = reportsData?.result || [];

//   const [filteredReports, setFilteredReports] = useState<IReport[]>(reports);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [typeFilter, setTypeFilter] = useState<string>('all');
//   const [selectedReport, setSelectedReport] = useState<string | null>(null);

//   useEffect(() => {
//     let filtered = reports;

//     if (searchTerm) {
//       filtered = filtered.filter(report =>
//         report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         report.fileName.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(report => report.status === statusFilter);
//     }

//     if (typeFilter !== 'all') {
//       filtered = filtered.filter(report => report.type === typeFilter);
//     }

//     setFilteredReports(filtered);
//   }, [reports, searchTerm, statusFilter, typeFilter]);

//   const handleDelete = async (reportId: string) => {
//     try {
//       await deleteReport(reportId).unwrap();
//       toast.success('Report deleted successfully');
//       setSelectedReport(null);
//       refetch();
//     } catch (err: any) {
//       toast.error(err?.data?.message || err?.message || 'Failed to delete report');
//     }
//   };

//   const handleDownload = async (reportId: string) => {
//     if (!user) {
//       toast.error('Please login to download reports');
//       navigate('/login');
//       return;
//     }

//     try {
//       const report = reports.find(r => r._id === reportId);
//       if (!report) {
//         toast.error('Report not found');
//         return;
//       }

//       if (report.status !== 'completed') {
//         toast.error(`Cannot download: Report is ${report.status}`);
//         return;
//       }

//       // TODO: Implement actual download API call
//       toast.success('Report downloaded successfully');
//       refetch(); // Refresh data to update download count
//     } catch (err) {
//       toast.error('Failed to download report');
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const statusConfig = {
//       'generating': { variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800' },
//       'completed': { variant: 'default' as const, color: 'bg-green-100 text-green-800' },
//       'failed': { variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
//       'expired': { variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' },
//     };

//     const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['completed'];

//     return (
//       <Badge variant={config.variant} className={config.color}>
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </Badge>
//     );
//   };

//   const getTypeBadge = (type: string) => {
//     const typeConfig = {
//       'PDF': { icon: <FileText className="h-3 w-3" />, color: 'bg-red-100 text-red-800' },
//       'Excel': { icon: <FileSpreadsheet className="h-3 w-3" />, color: 'bg-green-100 text-green-800' },
//     };

//     const config = typeConfig[type as keyof typeof typeConfig] || typeConfig['PDF'];

//     return (
//       <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
//         {config.icon}
//         {type}
//       </Badge>
//     );
//   };

//   const getCategoryBadge = (category: string) => {
//     const categoryNames = {
//       'bill_analysis': 'Bill Analysis',
//       'scenario_comparison': 'Scenario Comparison',
//       'kpi_dashboard': 'KPI Dashboard',
//       'cost_optimization': 'Cost Optimization',
//       'powerbi_export': 'PowerBI Export',
//       'erp_export': 'ERP Export',
//     };

//     return (
//       <Badge variant="outline" className="bg-purple-100 text-purple-800">
//         {categoryNames[category as keyof typeof categoryNames] || category}
//       </Badge>
//     );
//   };

//   const getAccessLevelBadge = (level: string) => {
//     const levelColors = {
//       'private': 'bg-gray-100 text-gray-800',
//       'shared': 'bg-blue-100 text-blue-800',
//       'public': 'bg-green-100 text-green-800',
//     };

//     return (
//       <Badge variant="outline" className={levelColors[level as keyof typeof levelColors]}>
//         {level.charAt(0).toUpperCase() + level.slice(1)}
//       </Badge>
//     );
//   };

//   const formatFileSize = (bytes?: number) => {
//     if (!bytes) return '-';
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(1024));
//     return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
//   };

//   const formatDate = (dateString: string | Date) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const isExpired = (expiryDate?: Date) => {
//     return expiryDate && new Date() > new Date(expiryDate);
//   };

//   const reportCounts = {
//     total: reports.length,
//     completed: reports.filter(r => r.status === 'completed').length,
//     generating: reports.filter(r => r.status === 'generating').length,
//     failed: reports.filter(r => r.status === 'failed').length,
//   };

//   if (isLoading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center text-red-600">Failed to load reports</div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex justify-between items-start">
//           <div className="space-y-2">
//             <h1 className="text-3xl font-bold tracking-tight">Report Management</h1>
//             <p className="text-muted-foreground">
//               Manage generated reports, analytics, and data exports
//             </p>
//           </div>
//           <Button onClick={() => navigate('/admin/report-management/generate')}>
//             <Plus className="h-4 w-4 mr-2" />
//             Generate Report
//           </Button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <Card>
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold">{reportCounts.total}</div>
//               <p className="text-xs text-muted-foreground">Total Reports</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold text-green-600">{reportCounts.completed}</div>
//               <p className="text-xs text-muted-foreground">Completed</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold text-blue-600">{reportCounts.generating}</div>
//               <p className="text-xs text-muted-foreground">Generating</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold text-red-600">{reportCounts.failed}</div>
//               <p className="text-xs text-muted-foreground">Failed</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Filters */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Filter className="h-5 w-5" />
//               Filters
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="search">Search</Label>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="search"
//                     placeholder="Search reports..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="status">Status</Label>
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value="completed">Completed</SelectItem>
//                     <SelectItem value="generating">Generating</SelectItem>
//                     <SelectItem value="failed">Failed</SelectItem>
//                     <SelectItem value="expired">Expired</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="type">Type</Label>
//                 <Select value={typeFilter} onValueChange={setTypeFilter}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Types</SelectItem>
//                     <SelectItem value="PDF">PDF</SelectItem>
//                     <SelectItem value="Excel">Excel</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Reports Table */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Generated Reports</CardTitle>
//             <CardDescription>
//               Showing {filteredReports.length} of {reports.length} reports
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {filteredReports.length === 0 ? (
//               <div className="text-center py-8">
//                 <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//                 <p className="text-muted-foreground">No reports found</p>
//                 <Button
//                   variant="outline"
//                   onClick={() => navigate('/admin/report-management/generate')}
//                   className="mt-4"
//                 >
//                   Generate First Report
//                 </Button>
//               </div>
//             ) : (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Report</TableHead>
//                     <TableHead>Type</TableHead>
//                     <TableHead>Category</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>File Size</TableHead>
//                     <TableHead>Downloads</TableHead>
//                     <TableHead>Access</TableHead>
//                     <TableHead>Created</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredReports.map((report) => (
//                     <TableRow key={report._id} className={isExpired(report.expiryDate) ? 'opacity-60' : ''}>
//                       <TableCell>
//                         <div className="flex items-center gap-3">
//                           <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
//                             <FileText className="h-4 w-4 text-blue-600" />
//                           </div>
//                           <div>
//                             <div className="font-medium">{report.title}</div>
//                             <div className="text-sm text-muted-foreground">
//                               {report.fileName}
//                             </div>
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell>{getTypeBadge(report.type)}</TableCell>
//                       <TableCell>{getCategoryBadge(report.reportCategory)}</TableCell>
//                       <TableCell>{getStatusBadge(report.status)}</TableCell>
//                       <TableCell>{formatFileSize(report.fileSize)}</TableCell>
//                       <TableCell>
//                         <div className="space-y-1">
//                           <div className="font-medium">{report.downloadCount}</div>
//                           {report.lastDownloaded && (
//                             <div className="text-xs text-muted-foreground">
//                               Last: {formatDate(report.lastDownloaded)}
//                             </div>
//                           )}
//                         </div>
//                       </TableCell>
//                       <TableCell>{getAccessLevelBadge(report.accessLevel)}</TableCell>
//                       <TableCell>{formatDate(report.createdAt)}</TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleDownload(report._id)}
//                           >
//                             <Download className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => {/* View report details */ }}
//                           >
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                           <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => setSelectedReport(report._id)}
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent>
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle>Delete Report</AlertDialogTitle>
//                                 <AlertDialogDescription>
//                                   Are you sure you want to delete this report? This action cannot be undone and the file will be permanently removed.
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter>
//                                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                 <AlertDialogAction
//                                   onClick={() => selectedReport && handleDelete(selectedReport)}
//                                 >
//                                   Delete
//                                 </AlertDialogAction>
//                               </AlertDialogFooter>
//                             </AlertDialogContent>
//                           </AlertDialog>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ReportTablePage; 


const ReportTablePage = () => {
  return (
    <div>ReportTablePage</div>
  )
}

export default ReportTablePage