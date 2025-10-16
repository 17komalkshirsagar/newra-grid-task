// import React, { useState, useCallback } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/button';

// interface BillUploadProps {
//   onUploadComplete?: (billId: string) => void;
// }

// interface UploadProgress {
//   status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
//   message: string;
//   billId?: string;
//   confidence?: number;
// }

// const BillUpload: React.FC<BillUploadProps> = ({ onUploadComplete }) => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [progress, setProgress] = useState<UploadProgress>({
//     status: 'idle',
//     message: ''
//   });
//   const [dragActive, setDragActive] = useState(false);

//   const handleFileSelect = useCallback((file: File) => {
//     // Validate file type
//     const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/tiff'];

//     if (!allowedTypes.includes(file.type)) {
//       setProgress({
//         status: 'error',
//         message: 'Invalid file type. Please select a PDF or image file.'
//       });
//       return;
//     }

//     // Validate file size (10MB limit)
//     if (file.size > 10 * 1024 * 1024) {
//       setProgress({
//         status: 'error',
//         message: 'File size too large. Maximum size is 10MB.'
//       });
//       return;
//     }

//     setSelectedFile(file);
//     setProgress({
//       status: 'idle',
//       message: `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
//     });
//   }, []);

//   const handleDrag = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === 'dragenter' || e.type === 'dragover') {
//       setDragActive(true);
//     } else if (e.type === 'dragleave') {
//       setDragActive(false);
//     }
//   }, []);

//   const handleDrop = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFileSelect(e.dataTransfer.files[0]);
//     }
//   }, [handleFileSelect]);

//   const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       handleFileSelect(e.target.files[0]);
//     }
//   }, [handleFileSelect]);

//   const uploadBill = async () => {
//     if (!selectedFile) return;

//     setProgress({
//       status: 'uploading',
//       message: 'Uploading bill...'
//     });

//     try {
//       const formData = new FormData();
//       formData.append('bill', selectedFile);

//       const token = localStorage.getItem('authToken');
//       const response = await fetch('/api/v1/bills/upload', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formData
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || 'Upload failed');
//       }

//       const billId = result.billId;
//       setProgress({
//         status: 'processing',
//         message: 'Bill uploaded successfully. Processing with OCR...',
//         billId
//       });

//       // Poll for processing status
//       pollProcessingStatus(billId);

//     } catch (error: any) {
//       setProgress({
//         status: 'error',
//         message: error.message || 'Upload failed'
//       });
//     }
//   };

//   const pollProcessingStatus = async (billId: string) => {
//     const maxAttempts = 30; // 5 minutes max
//     let attempts = 0;

//     const poll = async () => {
//       try {
//         const token = localStorage.getItem('authToken');
//         const response = await fetch(`/api/v1/bills/${billId}/status`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         const result = await response.json();

//         if (!response.ok) {
//           throw new Error(result.message || 'Failed to get status');
//         }

//         const { bill } = result;

//         if (bill.status === 'Completed') {
//           setProgress({
//             status: 'completed',
//             message: `Processing completed successfully! Confidence: ${bill.confidence}%`,
//             billId,
//             confidence: bill.confidence
//           });

//           if (onUploadComplete) {
//             onUploadComplete(billId);
//           }
//           return;
//         }

//         if (bill.status === 'Failed') {
//           setProgress({
//             status: 'error',
//             message: 'Bill processing failed. Please try again with a clearer image.'
//           });
//           return;
//         }

//         // Continue polling if still processing
//         attempts++;
//         if (attempts < maxAttempts) {
//           setTimeout(poll, 10000); // Poll every 10 seconds
//         } else {
//           setProgress({
//             status: 'error',
//             message: 'Processing timed out. Please check back later.'
//           });
//         }

//       } catch (error: any) {
//         setProgress({
//           status: 'error',
//           message: error.message || 'Failed to check processing status'
//         });
//       }
//     };

//     // Start polling after a short delay
//     setTimeout(poll, 2000);
//   };

//   const resetUpload = () => {
//     setSelectedFile(null);
//     setProgress({
//       status: 'idle',
//       message: ''
//     });
//   };

//   const getStatusColor = () => {
//     switch (progress.status) {
//       case 'uploading':
//       case 'processing':
//         return 'text-blue-600';
//       case 'completed':
//         return 'text-green-600';
//       case 'error':
//         return 'text-red-600';
//       default:
//         return 'text-gray-600';
//     }
//   };

//   const getProgressIcon = () => {
//     switch (progress.status) {
//       case 'uploading':
//       case 'processing':
//         return (
//           <div className=\"animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600\"></div>
//         );
//       case 'completed':
//         return (
//           <svg className=\"h-5 w-5 text-green-600\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
//             <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M5 13l4 4L19 7\" />
//           </svg>
//         );
//       case 'error':
//         return (
//           <svg className=\"h-5 w-5 text-red-600\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
//             <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M6 18L18 6M6 6l12 12\" />
//           </svg>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <Card className=\"w-full max-w-2xl mx-auto\">
//       <CardHeader>
//         <CardTitle>Upload Utility Bill</CardTitle>
//         <CardDescription>
//           Upload a PDF or image of your utility bill for automatic data extraction
//         </CardDescription>
//       </CardHeader>
//       <CardContent className=\"space-y-6\">
//         {/* Drag and Drop Area */}
//         <div
//           className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
//             dragActive
//               ? 'border-blue-500 bg-blue-50'
//               : 'border-gray-300 hover:border-gray-400'
//           }`}
//           onDragEnter={handleDrag}
//           onDragLeave={handleDrag}
//           onDragOver={handleDrag}
//           onDrop={handleDrop}
//         >
//           <input
//             type=\"file\"
//             accept=\".pdf,.jpg,.jpeg,.png,.bmp,.tiff\"
//             onChange={handleFileInput}
//             className=\"absolute inset-0 w-full h-full opacity-0 cursor-pointer\"
//             disabled={progress.status === 'uploading' || progress.status === 'processing'}
//           />

//           <div className=\"space-y-4\">
//             <svg
//               className=\"mx-auto h-12 w-12 text-gray-400\"
//               fill=\"none\"
//               stroke=\"currentColor\"
//               viewBox=\"0 0 24 24\"
//             >
//               <path
//                 strokeLinecap=\"round\"
//                 strokeLinejoin=\"round\"
//                 strokeWidth={2}
//                 d=\"M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12\"
//               />
//             </svg>

//             <div>
//               <p className=\"text-lg font-medium text-gray-700\">
//                 Drop your bill here, or click to browse
//               </p>
//               <p className=\"text-sm text-gray-500 mt-2\">
//                 Supports PDF, JPG, PNG, BMP, TIFF (max 10MB)
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Selected File Info */}
//         {selectedFile && (
//           <div className=\"bg-gray-50 rounded-lg p-4\">
//             <div className=\"flex items-center justify-between\">
//               <div className=\"flex items-center space-x-3\">
//                 <svg className=\"h-8 w-8 text-blue-600\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
//                   <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z\" />
//                 </svg>
//                 <div>
//                   <p className=\"font-medium text-gray-900\">{selectedFile.name}</p>
//                   <p className=\"text-sm text-gray-500\">
//                     {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
//                   </p>
//                 </div>
//               </div>

//               {progress.status === 'idle' && (
//                 <button
//                   onClick={resetUpload}
//                   className=\"text-gray-400 hover:text-gray-600\"
//                 >
//                   <svg className=\"h-5 w-5\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
//                     <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M6 18L18 6M6 6l12 12\" />
//                   </svg>
//                 </button>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Progress Status */}
//         {progress.message && (
//           <div className=\"flex items-center space-x-3 p-4 bg-gray-50 rounded-lg\">
//             {getProgressIcon()}
//             <p className={`text-sm font-medium ${getStatusColor()}`}>
//               {progress.message}
//             </p>
//           </div>
//         )}

//         {/* Upload Button */}
//         {selectedFile && progress.status === 'idle' && (
//           <button
//             onClick={uploadBill}
//             className=\"w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200\"
//           >
//             Upload and Process Bill
//           </button>
//         )}

//         {/* Reset Button after completion */}
//         {progress.status === 'completed' && (
//           <button
//             onClick={resetUpload}
//             className=\"w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200\"
//           >
//             Upload Another Bill
//           </button>
//         )}

//         {/* Reset Button after error */}
//         {progress.status === 'error' && (
//           <button
//             onClick={resetUpload}
//             className=\"w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200\"
//           >
//             Try Again
//           </button>
//         )}

//         {/* Processing Info */}
//         <div className=\"text-xs text-gray-500 space-y-1\">
//           <p>• OCR will extract all structured data from your bill</p>
//           <p>• Processing typically takes 30-60 seconds</p>
//           <p>• Ensure bill text is clear and readable for best results</p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default BillUpload;



const BillUpload = () => {
  return (
    <div>BillUpload</div>
  )
}

export default BillUpload