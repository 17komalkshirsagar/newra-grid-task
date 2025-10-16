// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/button';

// interface BillData {
//   id: string;
//   // Core Information
//   consumerNumber?: string;
//   accountId?: string;
//   billNumber?: string;
//   billIssueDate?: string;
//   billDueDate?: string;
//   billingMonth?: string;
//   billingYear?: number;

//   // Customer Details
//   customerName?: string;
//   companyName?: string;
//   supplyAddress?: string;

//   // Consumption Data
//   unitsConsumed?: number;
//   meterNumber?: string;
//   meterReadingStart?: number;
//   meterReadingEnd?: number;
//   meterReadingDifference?: number;
//   maximumDemand?: number;
//   powerFactor?: number;

//   // Time-of-use Data
//   peakUnits?: number;
//   offPeakUnits?: number;
//   shoulderUnits?: number;

//   // Tariff Information
//   tariffPlan?: string;
//   tariffCategory?: string;
//   unitRate?: number;

//   // Charges
//   demandCharges?: number;
//   fixedCharges?: number;
//   energyCharges?: number;
//   fuelSurchargeAdjustment?: number;
//   wheelingCharges?: number;
//   openAccessCharges?: number;
//   renewableEnergyObligations?: number;

//   // Penalties and Surcharges
//   penalties?: number;
//   surcharges?: number;
//   latePaymentFees?: number;
//   miscellaneousSurcharges?: number;

//   // Taxes
//   gst?: number;
//   vat?: number;
//   electricityDuty?: number;
//   totalTaxes?: number;

//   // Financial Summary
//   previousBalance?: number;
//   adjustments?: number;
//   credits?: number;
//   totalAmount?: number;
//   netPayableAmount?: number;

//   // Payment Information
//   paymentStatus?: string;

//   // Metadata
//   confidence?: number;
//   originalFileName?: string;
//   uploadedAt?: string;
//   processedAt?: string;
// }

// interface BillDataDisplayProps {
//   billId: string;
//   onEdit?: () => void;
// }

// const BillDataDisplay: React.FC<BillDataDisplayProps> = ({ billId, onEdit }) => {
//   const [billData, setBillData] = useState<BillData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchBillData();
//   }, [billId]);

//   const fetchBillData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('authToken');
//       const response = await fetch(`/api/v1/bills/${billId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || 'Failed to fetch bill data');
//       }

//       setBillData(result.bill);
//     } catch (error: any) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatCurrency = (amount?: number) => {
//     if (amount === undefined || amount === null) return 'N/A';
//     return `₹${amount.toFixed(2)}`;
//   };

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-IN');
//   };

//   const getConfidenceColor = (confidence?: number) => {
//     if (!confidence) return 'text-gray-500';
//     if (confidence >= 80) return 'text-green-600';
//     if (confidence >= 60) return 'text-yellow-600';
//     return 'text-red-600';
//   };

//   const getPaymentStatusColor = (status?: string) => {
//     switch (status?.toLowerCase()) {
//       case 'paid': return 'text-green-600 bg-green-100';
//       case 'pending': return 'text-yellow-600 bg-yellow-100';
//       case 'overdue': return 'text-red-600 bg-red-100';
//       default: return 'text-gray-600 bg-gray-100';
//     }
//   };

//   if (loading) {
//     return (
//       <div className=\"flex items-center justify-center p-8\">
//         <div className=\"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600\"></div>
//         <span className=\"ml-2\">Loading bill data...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Card className=\"border-red-200\">
//         <CardContent className=\"p-6\">
//           <div className=\"text-red-600 text-center\">
//             <p className=\"font-medium\">Error loading bill data</p>
//             <p className=\"text-sm mt-1\">{error}</p>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (!billData) {
//     return (
//       <Card className=\"border-gray-200\">
//         <CardContent className=\"p-6\">
//           <p className=\"text-gray-500 text-center\">No bill data found</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className=\"space-y-6\">
//       {/* Header Card */}
//       <Card>
//         <CardHeader>
//           <div className=\"flex justify-between items-start\">
//             <div>
//               <CardTitle className=\"flex items-center space-x-2\">
//                 <span>Bill Data Extracted</span>
//                 <span className={`text-sm px-2 py-1 rounded ${getConfidenceColor(billData.confidence)}`}>
//                   {billData.confidence}% confidence
//                 </span>
//               </CardTitle>
//               <CardDescription>
//                 Processed from {billData.originalFileName}
//               </CardDescription>
//             </div>
//             {onEdit && (
//               <button
//                 onClick={onEdit}
//                 className=\"px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700\"
//               >
//                 Edit Data
//               </button>
//             )}
//           </div>
//         </CardHeader>
//       </Card>

//       <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">
//         {/* Core Information */}
//         <Card>
//           <CardHeader>
//             <CardTitle className=\"text-lg\">Core Information</CardTitle>
//           </CardHeader>
//           <CardContent className=\"space-y-3\">
//             <div className=\"grid grid-cols-2 gap-4 text-sm\">
//               <div>
//                 <p className=\"font-medium text-gray-700\">Consumer Number</p>
//                 <p className=\"text-gray-900\">{billData.consumerNumber || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className=\"font-medium text-gray-700\">Bill Number</p>
//                 <p className=\"text-gray-900\">{billData.billNumber || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className=\"font-medium text-gray-700\">Billing Period</p>
//                 <p className=\"text-gray-900\">{billData.billingMonth} {billData.billingYear}</p>
//               </div>
//               <div>
//                 <p className=\"font-medium text-gray-700\">Payment Status</p>
//                 <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(billData.paymentStatus)}`}>
//                   {billData.paymentStatus || 'Unknown'}
//                 </span>
//               </div>
//               <div>
//                 <p className=\"font-medium text-gray-700\">Issue Date</p>
//                 <p className=\"text-gray-900\">{formatDate(billData.billIssueDate)}</p>
//               </div>
//               <div>
//                 <p className=\"font-medium text-gray-700\">Due Date</p>
//                 <p className=\"text-gray-900\">{formatDate(billData.billDueDate)}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Customer Details */}
//         <Card>
//           <CardHeader>
//             <CardTitle className=\"text-lg\">Customer Details</CardTitle>
//           </CardHeader>
//           <CardContent className=\"space-y-3\">
//             <div>
//               <p className=\"font-medium text-gray-700\">Name</p>
//               <p className=\"text-gray-900\">{billData.customerName || billData.companyName || 'N/A'}</p>
//             </div>
//             <div>
//               <p className=\"font-medium text-gray-700\">Supply Address</p>
//               <p className=\"text-gray-900\">{billData.supplyAddress || 'N/A'}</p>
//             </div>
//             <div>
//               <p className=\"font-medium text-gray-700\">Meter Number</p>
//               <p className=\"text-gray-900\">{billData.meterNumber || 'N/A'}</p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Consumption Data */}
//         <Card>
//           <CardHeader>
//             <CardTitle className=\"text-lg\">Consumption Data</CardTitle>
//           </CardHeader>
//           <CardContent className=\"space-y-4\">
//             <div className=\"grid grid-cols-2 gap-4 text-sm\">
//               <div>
//                 <p className=\"font-medium text-gray-700\">Units Consumed</p>
//                 <p className=\"text-lg font-semibold text-blue-600\">{billData.unitsConsumed || 0} kWh</p>
//               </div>
//               <div>
//                 <p className=\"font-medium text-gray-700\">Maximum Demand</p>
//                 <p className=\"text-lg font-semibold text-purple-600\">{billData.maximumDemand || 'N/A'} kW</p>
//               </div>
//               <div>
//                 <p className=\"font-medium text-gray-700\">Previous Reading</p>
//                 <p className=\"text-gray-900\">{billData.meterReadingStart || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className=\"font-medium text-gray-700\">Current Reading</p>
//                 <p className=\"text-gray-900\">{billData.meterReadingEnd || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className=\"font-medium text-gray-700\">Difference</p>
//                 <p className=\"text-gray-900\">{billData.meterReadingDifference || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className=\"font-medium text-gray-700\">Power Factor</p>
//                 <p className=\"text-gray-900\">{billData.powerFactor || 'N/A'}</p>
//               </div>
//             </div>

//             {/* Time-of-use breakdown if available */}
//             {(billData.peakUnits || billData.offPeakUnits || billData.shoulderUnits) && (
//               <div className=\"mt-4 pt-4 border-t\">
//                 <p className=\"font-medium text-gray-700 mb-2\">Time-of-use Breakdown</p>
//                 <div className=\"grid grid-cols-3 gap-2 text-sm\">
//                   <div>
//                     <p className=\"text-gray-600\">Peak</p>
//                     <p className=\"font-medium\">{billData.peakUnits || 0} kWh</p>
//                   </div>
//                   <div>
//                     <p className=\"text-gray-600\">Off-Peak</p>
//                     <p className=\"font-medium\">{billData.offPeakUnits || 0} kWh</p>
//                   </div>
//                   <div>
//                     <p className=\"text-gray-600\">Shoulder</p>
//                     <p className=\"font-medium\">{billData.shoulderUnits || 0} kWh</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Tariff Information */}
//         <Card>
//           <CardHeader>
//             <CardTitle className=\"text-lg\">Tariff Information</CardTitle>
//           </CardHeader>
//           <CardContent className=\"space-y-3\">
//             <div>
//               <p className=\"font-medium text-gray-700\">Tariff Category</p>
//               <p className=\"text-gray-900\">{billData.tariffCategory || 'N/A'}</p>
//             </div>
//             <div>
//               <p className=\"font-medium text-gray-700\">Tariff Plan</p>
//               <p className=\"text-gray-900\">{billData.tariffPlan || 'N/A'}</p>
//             </div>
//             <div>
//               <p className=\"font-medium text-gray-700\">Unit Rate</p>
//               <p className=\"text-gray-900\">{billData.unitRate ? `₹${billData.unitRate}/kWh` : 'N/A'}</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charges Breakdown */}
//       <Card>
//         <CardHeader>
//           <CardTitle className=\"text-lg\">Charges Breakdown</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4 text-sm\">
//             <div className=\"space-y-2\">
//               <p className=\"font-medium text-gray-700\">Basic Charges</p>
//               <div className=\"space-y-1\">
//                 <div className=\"flex justify-between\">
//                   <span>Fixed Charges:</span>
//                   <span>{formatCurrency(billData.fixedCharges)}</span>
//                 </div>
//                 <div className=\"flex justify-between\">
//                   <span>Energy Charges:</span>
//                   <span>{formatCurrency(billData.energyCharges)}</span>
//                 </div>
//                 <div className=\"flex justify-between\">
//                   <span>Demand Charges:</span>
//                   <span>{formatCurrency(billData.demandCharges)}</span>
//                 </div>
//               </div>
//             </div>

//             <div className=\"space-y-2\">
//               <p className=\"font-medium text-gray-700\">Additional Charges</p>
//               <div className=\"space-y-1\">
//                 <div className=\"flex justify-between\">
//                   <span>FSA:</span>
//                   <span>{formatCurrency(billData.fuelSurchargeAdjustment)}</span>
//                 </div>
//                 <div className=\"flex justify-between\">
//                   <span>Wheeling:</span>
//                   <span>{formatCurrency(billData.wheelingCharges)}</span>
//                 </div>
//                 <div className=\"flex justify-between\">
//                   <span>Open Access:</span>
//                   <span>{formatCurrency(billData.openAccessCharges)}</span>
//                 </div>
//               </div>
//             </div>

//             <div className=\"space-y-2\">
//               <p className=\"font-medium text-gray-700\">Penalties & Surcharges</p>
//               <div className=\"space-y-1\">
//                 <div className=\"flex justify-between\">
//                   <span>Penalties:</span>
//                   <span>{formatCurrency(billData.penalties)}</span>
//                 </div>
//                 <div className=\"flex justify-between\">
//                   <span>Late Fee:</span>
//                   <span>{formatCurrency(billData.latePaymentFees)}</span>
//                 </div>
//                 <div className=\"flex justify-between\">
//                   <span>Other Surcharges:</span>
//                   <span>{formatCurrency(billData.miscellaneousSurcharges)}</span>
//                 </div>
//               </div>
//             </div>

//             <div className=\"space-y-2\">
//               <p className=\"font-medium text-gray-700\">Taxes</p>
//               <div className=\"space-y-1\">
//                 <div className=\"flex justify-between\">
//                   <span>GST:</span>
//                   <span>{formatCurrency(billData.gst)}</span>
//                 </div>
//                 <div className=\"flex justify-between\">
//                   <span>VAT:</span>
//                   <span>{formatCurrency(billData.vat)}</span>
//                 </div>
//                 <div className=\"flex justify-between\">
//                   <span>Electricity Duty:</span>
//                   <span>{formatCurrency(billData.electricityDuty)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Financial Summary */}
//       <Card className=\"border-2 border-blue-200\">
//         <CardHeader>
//           <CardTitle className=\"text-lg text-blue-800\">Financial Summary</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4\">
//             <div className=\"text-center p-4 bg-gray-50 rounded-lg\">
//               <p className=\"text-sm text-gray-600\">Previous Balance</p>
//               <p className=\"text-lg font-semibold\">{formatCurrency(billData.previousBalance)}</p>
//             </div>
//             <div className=\"text-center p-4 bg-blue-50 rounded-lg\">
//               <p className=\"text-sm text-gray-600\">Current Charges</p>
//               <p className=\"text-lg font-semibold text-blue-600\">{formatCurrency(billData.totalAmount)}</p>
//             </div>
//             <div className=\"text-center p-4 bg-green-50 rounded-lg\">
//               <p className=\"text-sm text-gray-600\">Adjustments/Credits</p>
//               <p className=\"text-lg font-semibold text-green-600\">{formatCurrency(billData.adjustments)}</p>
//             </div>
//             <div className=\"text-center p-4 bg-orange-50 rounded-lg border-2 border-orange-200\">
//               <p className=\"text-sm text-gray-600\">Net Payable</p>
//               <p className=\"text-xl font-bold text-orange-600\">{formatCurrency(billData.netPayableAmount)}</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default BillDataDisplay;


const BillDataDisplay = () => {
  return (
    <div>BillDataDisplay</div>
  )
}

export default BillDataDisplay