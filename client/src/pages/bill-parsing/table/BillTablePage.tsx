// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../store';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
// import { Plus, Eye, Trash2, Download, RefreshCw } from 'lucide-react';
// import { useGetAllBillsQuery, useDeleteBillMutation } from '../../../redux/apis/bill.api';
// import { IBill } from '../../../models/bill.interface';

// const BillTablePage = () => {
//   const navigate = useNavigate();
//   const user = useSelector((state: RootState) => state.auth.user);
//   const { data: billsData, isLoading, } = useGetAllBillsQuery({});
//   const [deleteBill, { isLoading: isDeleting, isSuccess: isDeleteSuccess, isError: isDeleteError }] = useDeleteBillMutation();
//   const [selectedBill, setSelectedBill] = useState<string | null>(null);

//   useEffect(() => {
//     if (isDeleteSuccess) {
//       toast.success('Bill deleted successfully');
//       setSelectedBill(null);
//     }
//   }, [isDeleteSuccess]);

//   useEffect(() => {
//     if (isDeleteError) {
//       toast.error('Failed to delete bill');
//     }
//   }, [isDeleteError]);

//   const handleDelete = async (billId: string) => {
//     try {
//       await deleteBill(billId).unwrap();
//     } catch (err) {
//       console.error('Delete failed:', err);
//     }
//   };

//   const hasValidFile = (bill: IBill) => {
//     // Check if bill has a valid file URL
//     if (bill.cloudinaryPublicId) return true;
//     if (bill.originalFile && bill.originalFile.startsWith('http')) return true;
//     if (bill.processedFile && bill.processedFile.startsWith('http')) return true;
//     // Check if it's a proper upload path
//     if (bill.originalFile && bill.originalFile.includes('/uploads/')) return true;
//     if (bill.processedFile && bill.processedFile.includes('/uploads/')) return true;
//     return false;
//   };

//   const handleDownload = (billId: string) => {
//     console.log('Download clicked for bill ID:', billId);

//     if (!user) {
//       toast.error('Please login to download bills');
//       navigate('/login');
//       return;
//     }

//     const bill = bills.find(b => b._id === billId);
//     if (!bill) {
//       toast.error('Bill not found');
//       return;
//     }

//     console.log('Bill data:', {
//       billNumber: bill.billNumber,
//       cloudinaryPublicId: bill.cloudinaryPublicId,
//       originalFile: bill.originalFile,
//       processedFile: bill.processedFile
//     });

//     // Check if this bill has a valid file
//     if (!hasValidFile(bill)) {
//       toast.error('No file available for this bill. This is demo data. Please upload a new bill to test download.', {
//         duration: 5000
//       });
//       return;
//     }

//     // Get file URL
//     let fileUrl = null;

//     if (bill.cloudinaryPublicId) {
//       fileUrl = `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${bill.cloudinaryPublicId}`;
//       console.log('Using Cloudinary URL:', fileUrl);
//     } else if (bill.originalFile?.startsWith('http')) {
//       fileUrl = bill.originalFile;
//       console.log('Using originalFile URL:', fileUrl);
//     } else if (bill.processedFile?.startsWith('http')) {
//       fileUrl = bill.processedFile;
//       console.log('Using processedFile URL:', fileUrl);
//     } else if (bill.originalFile?.includes('/uploads/')) {
//       fileUrl = `${import.meta.env.VITE_BACKEND_URL}${bill.originalFile}`;
//       console.log('Using originalFile with backend URL:', fileUrl);
//     } else if (bill.processedFile?.includes('/uploads/')) {
//       fileUrl = `${import.meta.env.VITE_BACKEND_URL}${bill.processedFile}`;
//       console.log('Using processedFile with backend URL:', fileUrl);
//     }

//     if (fileUrl) {
//       console.log('Opening file URL:', fileUrl);
//       window.open(fileUrl, '_blank');
//       toast.success('Opening file...');
//     } else {
//       console.log('No valid file URL found');
//       toast.error('Could not construct file URL. Please upload a new bill.');
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

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//     }).format(amount);
//   };

//   if (isLoading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex items-center justify-center h-64">
//           <RefreshCw className="h-6 w-6 animate-spin" />
//         </div>
//       </div>
//     );
//   }

//   const bills = billsData?.result || [];


//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="space-y-6">
//         <div className="flex justify-between items-start">
//           <div className="space-y-2">
//             <h1 className="text-3xl font-bold tracking-tight">Bill Management</h1>
//             <p className="text-muted-foreground">
//               View and manage all uploaded utility bills and their processing status
//             </p>
//           </div>
//           <Button onClick={() => navigate('/admin/bill-parsing/add')}>
//             <Plus className="h-4 w-4 mr-2" />
//             Upload New Bill
//           </Button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <Card>
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold">{bills.length}</div>
//               <p className="text-xs text-muted-foreground">Total Bills</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold text-green-600">
//                 {bills.filter(bill => bill.processingStatus === 'Completed').length}
//               </div>
//               <p className="text-xs text-muted-foreground">Processed</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold text-blue-600">
//                 {bills.filter(bill => bill.processingStatus === 'Processing').length}
//               </div>
//               <p className="text-xs text-muted-foreground">Processing</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold text-red-600">
//                 {bills.filter(bill => bill.processingStatus === 'Failed').length}
//               </div>
//               <p className="text-xs text-muted-foreground">Failed</p>
//             </CardContent>
//           </Card>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Uploaded Bills</CardTitle>
//             <CardDescription>
//               All utility bills with their processing status and extracted data
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {bills.length === 0 ? (
//               <div className="text-center py-8">
//                 <p className="text-muted-foreground">No bills uploaded yet</p>
//                 <Button
//                   variant="outline"
//                   onClick={() => navigate('/admin/bill-parsing/add')}
//                   className="mt-4"
//                 >
//                   Upload Your First Bill
//                 </Button>
//               </div>
//             ) : (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>File Name</TableHead>
//                     <TableHead>Consumer Number</TableHead>
//                     <TableHead>Billing Month</TableHead>
//                     <TableHead>Total Amount</TableHead>
//                     <TableHead>Units Consumed</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Upload Date</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {bills.map((bill: IBill) => (
//                     <TableRow key={bill._id}>
//                       <TableCell className="font-medium">{bill.originalFile || 'N/A'}</TableCell>
//                       <TableCell>{bill.consumerNumber || 'N/A'}</TableCell>
//                       <TableCell>
//                         {bill.billingMonth && bill.billingYear
//                           ? `${bill.billingMonth} ${bill.billingYear}`
//                           : 'N/A'
//                         }
//                       </TableCell>
//                       <TableCell>
//                         {bill.totalAmount !== undefined && bill.totalAmount !== null
//                           ? formatCurrency(bill.totalAmount)
//                           : 'N/A'
//                         }
//                       </TableCell>
//                       <TableCell>
//                         {bill.unitsConsumed !== undefined && bill.unitsConsumed !== null
//                           ? `${bill.unitsConsumed} kWh`
//                           : 'N/A kWh'
//                         }
//                       </TableCell>
//                       <TableCell>{getStatusBadge(bill.processingStatus)}</TableCell>
//                       <TableCell>
//                         {bill.uploadDate
//                           ? formatDate(new Date(bill.uploadDate).toString())
//                           : 'N/A'
//                         }
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => navigate(`/admin/bill-parsing/view/${bill._id}`)}
//                           >
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleDownload(bill._id!)}
//                             disabled={!hasValidFile(bill)}
//                             title={hasValidFile(bill) ? 'Download bill' : 'No file available (demo data)'}
//                           >
//                             <Download className="h-4 w-4" />
//                           </Button>
//                           <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => setSelectedBill(bill._id!)}
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent>
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle>Delete Bill</AlertDialogTitle>
//                                 <AlertDialogDescription>
//                                   Are you sure you want to delete this bill? This action cannot be undone.
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter>
//                                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                 <AlertDialogAction
//                                   onClick={() => selectedBill && handleDelete(selectedBill)}
//                                   disabled={isDeleting}
//                                 >
//                                   {isDeleting ? 'Deleting...' : 'Delete'}
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

// export default BillTablePage;



const BillTablePage = () => {
  return (
    <div>BillTablePage</div>
  )
}

export default BillTablePage