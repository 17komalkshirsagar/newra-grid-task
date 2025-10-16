// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { ArrowLeft, Download, Edit, Trash2, FileText, Calendar, User, Zap, TrendingUp, DollarSign } from 'lucide-react';
// import { useGetBillByIdQuery } from '../../../redux/apis/bill.api';

// const BillViewPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { data: bill, isLoading, error } = useGetBillByIdQuery(id || '');

//   const handleDownload = () => {
//     if (!bill) {
//       toast.error('Bill not found');
//       return;
//     }

//     // Check if original file exists
//     if (!bill.originalFile && !bill.processedFile && !bill.cloudinaryPublicId) {
//       toast.error('No file available. This is demo data without uploaded files. Please upload a new bill to test download.', {
//         duration: 5000,
//       });
//       return;
//     }

//     // Priority: Cloudinary URL > Original File > Processed File
//     let fileUrl = null;

//     if (bill.cloudinaryPublicId) {
//       // Construct Cloudinary URL from public ID
//       fileUrl = `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${bill.cloudinaryPublicId}`;
//     } else if (bill.originalFile) {
//       fileUrl = bill.originalFile;
//     } else if (bill.processedFile) {
//       fileUrl = bill.processedFile;
//     }

//     if (fileUrl) {
//       // If it's a Cloudinary URL or external URL, open in new tab
//       if (fileUrl.startsWith('http')) {
//         window.open(fileUrl, '_blank');
//         toast.success('Opening file...');
//       } else {
//         // If it's a relative path, construct the full URL
//         const downloadUrl = `${import.meta.env.VITE_BACKEND_URL}/${fileUrl}`;
//         window.open(downloadUrl, '_blank');
//         toast.success('Downloading file...');
//       }
//     } else {
//       toast.error('File URL not available');
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const statusConfig = {
//       'Pending': { variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' },
//       'Processing': { variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
//       'Completed': { variant: 'default' as const, color: 'bg-green-100 text-green-800' },
//       'Failed': { variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
//     };

//     const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pending'];

//     return (
//       <Badge variant={config.variant} className={config.color}>
//         {status}
//       </Badge>
//     );
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//     }).format(amount);
//   };

//   const formatDate = (dateString: string | Date) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
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

//   if (error || !bill) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center">
//           <p className="text-red-600 mb-4">Failed to load bill details</p>
//           <Button onClick={() => navigate('/admin/bill-parsing/table')}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Bills
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex justify-between items-start">
//           <div className="space-y-2">
//             <Button variant="ghost" onClick={() => navigate('/admin/bill-parsing/table')}>
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Bills
//             </Button>
//             <h1 className="text-3xl font-bold tracking-tight">Bill Details</h1>
//             <p className="text-muted-foreground">
//               Complete utility bill information and extracted data
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <Button variant="outline" onClick={handleDownload}>
//               <Download className="h-4 w-4 mr-2" />
//               Download
//             </Button>
//             <Button variant="outline" onClick={() => navigate(`/admin/bill-parsing/edit/${id}`)}>
//               <Edit className="h-4 w-4 mr-2" />
//               Edit
//             </Button>
//           </div>
//         </div>

//         {/* Bill Status */}
//         <Card>
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <div>
//                 <CardTitle>Bill Status</CardTitle>
//                 <CardDescription>Processing and extraction status</CardDescription>
//               </div>
//               {getStatusBadge(bill.processingStatus)}
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <p className="text-sm text-muted-foreground">Upload Date</p>
//                 <p className="font-medium">{formatDate(bill.uploadDate)}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Extraction Confidence</p>
//                 <p className="font-medium">{bill.extractionConfidence || 0}%</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Original File</p>
//                 <p className="font-medium truncate">{bill.originalFile || 'N/A'}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Customer Information */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <User className="h-5 w-5" />
//               Customer Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm text-muted-foreground">Customer Name</p>
//                 <p className="font-medium">{bill.customerName || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Company Name</p>
//                 <p className="font-medium">{bill.companyName || 'N/A'}</p>
//               </div>
//               <div className="md:col-span-2">
//                 <p className="text-sm text-muted-foreground">Supply Address</p>
//                 <p className="font-medium">{bill.supplyAddress || 'N/A'}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Bill Information */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <FileText className="h-5 w-5" />
//               Bill Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               <div>
//                 <p className="text-sm text-muted-foreground">Consumer Number</p>
//                 <p className="font-medium">{bill.consumerNumber || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Account ID</p>
//                 <p className="font-medium">{bill.accountId || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Bill Number</p>
//                 <p className="font-medium">{bill.billNumber || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Billing Period</p>
//                 <p className="font-medium">
//                   {bill.billingMonth && bill.billingYear
//                     ? `${bill.billingMonth} ${bill.billingYear}`
//                     : 'N/A'}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Bill Issue Date</p>
//                 <p className="font-medium">
//                   {bill.billIssueDate ? formatDate(bill.billIssueDate) : 'N/A'}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Bill Due Date</p>
//                 <p className="font-medium">
//                   {bill.billDueDate ? formatDate(bill.billDueDate) : 'N/A'}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Meter Number</p>
//                 <p className="font-medium">{bill.meterNumber || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Payment Status</p>
//                 <Badge variant={bill.paymentStatus === 'Paid' ? 'default' : 'destructive'}>
//                   {bill.paymentStatus || 'N/A'}
//                 </Badge>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Consumption Data */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Zap className="h-5 w-5" />
//               Consumption Data
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div>
//                 <p className="text-sm text-muted-foreground">Units Consumed</p>
//                 <p className="font-medium text-lg">{bill.unitsConsumed || 0} kWh</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Meter Reading Start</p>
//                 <p className="font-medium">{bill.meterReadingStart || 0}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Meter Reading End</p>
//                 <p className="font-medium">{bill.meterReadingEnd || 0}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Difference</p>
//                 <p className="font-medium">{bill.meterReadingDifference || 0}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Maximum Demand</p>
//                 <p className="font-medium">{bill.maximumDemand || 0} kW</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Power Factor</p>
//                 <p className="font-medium">{bill.powerFactor || 0}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Peak Usage</p>
//                 <p className="font-medium">{bill.peakUsage || 0} kWh</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Off-Peak Usage</p>
//                 <p className="font-medium">{bill.offPeakUsage || 0} kWh</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Tariff Information */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="h-5 w-5" />
//               Tariff Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <p className="text-sm text-muted-foreground">Tariff Plan</p>
//                 <p className="font-medium">{bill.tariffPlan || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Tariff Category</p>
//                 <p className="font-medium">{bill.tariffCategory || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Unit Rate</p>
//                 <p className="font-medium">₹{bill.unitRate || 0}/kWh</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Charges Breakdown */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <DollarSign className="h-5 w-5" />
//               Charges Breakdown
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-2">
//                 <div className="flex justify-between border-b pb-2">
//                   <span className="text-sm text-muted-foreground">Demand Charges</span>
//                   <span className="font-medium">{formatCurrency(bill.demandCharges || 0)}</span>
//                 </div>
//                 <div className="flex justify-between border-b pb-2">
//                   <span className="text-sm text-muted-foreground">Fixed Charges</span>
//                   <span className="font-medium">{formatCurrency(bill.fixedCharges || 0)}</span>
//                 </div>
//                 <div className="flex justify-between border-b pb-2">
//                   <span className="text-sm text-muted-foreground">Energy Charges</span>
//                   <span className="font-medium">{formatCurrency(bill.energyCharges || 0)}</span>
//                 </div>
//                 <div className="flex justify-between border-b pb-2">
//                   <span className="text-sm text-muted-foreground">Fuel Surcharge</span>
//                   <span className="font-medium">{formatCurrency(bill.fuelSurchargeAdjustment || 0)}</span>
//                 </div>
//                 <div className="flex justify-between border-b pb-2">
//                   <span className="text-sm text-muted-foreground">Wheeling Charges</span>
//                   <span className="font-medium">{formatCurrency(bill.wheelingCharges || 0)}</span>
//                 </div>
//                 <div className="flex justify-between border-b pb-2">
//                   <span className="text-sm text-muted-foreground">Open Access Charges</span>
//                   <span className="font-medium">{formatCurrency(bill.openAccessCharges || 0)}</span>
//                 </div>
//                 <div className="flex justify-between border-b pb-2">
//                   <span className="text-sm text-muted-foreground">GST</span>
//                   <span className="font-medium">{formatCurrency(bill.gst || 0)}</span>
//                 </div>
//                 <div className="flex justify-between border-b pb-2">
//                   <span className="text-sm text-muted-foreground">Electricity Duty</span>
//                   <span className="font-medium">{formatCurrency(bill.electricityDuty || 0)}</span>
//                 </div>
//                 <div className="flex justify-between border-b pb-2">
//                   <span className="text-sm text-muted-foreground">Penalties</span>
//                   <span className="font-medium">{formatCurrency(bill.penalties || 0)}</span>
//                 </div>
//                 <div className="flex justify-between border-b pb-2">
//                   <span className="text-sm text-muted-foreground">Late Payment Fees</span>
//                   <span className="font-medium">{formatCurrency(bill.latePaymentFees || 0)}</span>
//                 </div>
//               </div>

//               <Separator />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-lg font-semibold">Total Amount</span>
//                   <span className="text-2xl font-bold text-blue-600">
//                     {formatCurrency(bill.totalAmount || 0)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-lg font-semibold">Net Payable Amount</span>
//                   <span className="text-2xl font-bold text-green-600">
//                     {formatCurrency(bill.netPayableAmount || 0)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default BillViewPage;




const BillViewPage = () => {
  return (
    <div>BillViewPage</div>
  )
}

export default BillViewPage