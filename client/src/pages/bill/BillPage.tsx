import React, { useState, useCallback } from 'react'

interface Bill {
    _id: string
    originalFileName: string
    billingMonth: string
    billingYear: number
    totalAmount: number
    processingStatus: 'Processing' | 'Completed' | 'Failed'
    confidence: number
    uploadedAt: string
    processedAt?: string
}

interface ExtractedBillData {
    consumerNumber: string
    billNumber: string
    customerName: string
    unitsConsumed: number
    totalAmount: number
    billingMonth: string
    billingYear: number
    demandCharges: number
    fixedCharges: number
    penalties: number
    surcharges: number
    gst: number
    confidence: number
}

const BillPage: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [bills, setBills] = useState<Bill[]>([])
    const [selectedBill, setSelectedBill] = useState<ExtractedBillData | null>(null)
    const [loading, setLoading] = useState(false)

    const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/tiff']
            if (allowedTypes.includes(file.type)) {
                setSelectedFile(file)
            } else {
                alert('Please select a PDF or image file')
            }
        }
    }, [])

    const handleUpload = useCallback(async () => {
        if (!selectedFile) return

        setUploading(true)
        const formData = new FormData()
        formData.append('bill', selectedFile)

        try {
            const response = await fetch('/api/v1/bills/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            })

            const result = await response.json()

            if (result.success) {
                alert('Bill uploaded successfully! Processing...')
                setSelectedFile(null)
                loadUserBills()
            } else {
                alert(`Upload failed: ${result.message}`)
            }
        } catch (error) {
            console.error('Upload error:', error)
            alert('Upload failed. Please try again.')
        } finally {
            setUploading(false)
        }
    }, [selectedFile])

    const loadUserBills = useCallback(async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/v1/bills', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            const result = await response.json()

            if (result.success) {
                setBills(result.bills)
            }
        } catch (error) {
            console.error('Error loading bills:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    const viewBillDetails = useCallback(async (billId: string) => {
        try {
            const response = await fetch(`/api/v1/bills/${billId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            const result = await response.json()

            if (result.success) {
                setSelectedBill(result.bill)
            }
        } catch (error) {
            console.error('Error loading bill details:', error)
        }
    }, [])

    React.useEffect(() => {
        loadUserBills()
    }, [loadUserBills])

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Energy Bill Processing</h1>

            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Upload Utility Bill</h2>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.bmp,.tiff"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="bill-upload"
                    />

                    <label htmlFor="bill-upload" className="cursor-pointer">
                        <div className="text-gray-600">
                            <svg className="mx-auto h-12 w-12 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
                            </svg>
                            <p className="text-lg">Click to upload or drag and drop</p>
                            <p className="text-sm text-gray-500">PDF or image files only</p>
                        </div>
                    </label>

                    {selectedFile && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-700">Selected: {selectedFile.name}</p>
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="mt-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            >
                                {uploading ? 'Processing...' : 'Upload & Process'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bills List */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Your Bills</h2>

                {loading ? (
                    <p>Loading bills...</p>
                ) : bills.length === 0 ? (
                    <p className="text-gray-500">No bills uploaded yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-2 text-left">File Name</th>
                                    <th className="px-4 py-2 text-left">Billing Period</th>
                                    <th className="px-4 py-2 text-left">Amount</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Confidence</th>
                                    <th className="px-4 py-2 text-left">Uploaded</th>
                                    <th className="px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.map((bill) => (
                                    <tr key={bill._id} className="border-b">
                                        <td className="px-4 py-2">{bill.originalFileName}</td>
                                        <td className="px-4 py-2">{bill.billingMonth} {bill.billingYear}</td>
                                        <td className="px-4 py-2">¹{bill.totalAmount}</td>
                                        <td className="px-4 py-2">
                                            <span className={`px-2 py-1 rounded text-sm ${
                                                bill.processingStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                                                bill.processingStatus === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {bill.processingStatus}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">{bill.confidence}%</td>
                                        <td className="px-4 py-2">{new Date(bill.uploadedAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">
                                            {bill.processingStatus === 'Completed' && (
                                                <button
                                                    onClick={() => viewBillDetails(bill._id)}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                                >
                                                    View Details
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Bill Details Modal */}
            {selectedBill && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Bill Details</h3>
                            <button
                                onClick={() => setSelectedBill(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Basic Information</h4>
                                <p><strong>Consumer Number:</strong> {selectedBill.consumerNumber}</p>
                                <p><strong>Bill Number:</strong> {selectedBill.billNumber}</p>
                                <p><strong>Customer Name:</strong> {selectedBill.customerName}</p>
                                <p><strong>Billing Period:</strong> {selectedBill.billingMonth} {selectedBill.billingYear}</p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Consumption & Charges</h4>
                                <p><strong>Units Consumed:</strong> {selectedBill.unitsConsumed} kWh</p>
                                <p><strong>Demand Charges:</strong> ¹{selectedBill.demandCharges}</p>
                                <p><strong>Fixed Charges:</strong> ¹{selectedBill.fixedCharges}</p>
                                <p><strong>Penalties:</strong> ¹{selectedBill.penalties}</p>
                                <p><strong>Surcharges:</strong> ¹{selectedBill.surcharges}</p>
                                <p><strong>GST:</strong> ¹{selectedBill.gst}</p>
                                <p><strong>Total Amount:</strong> ¹{selectedBill.totalAmount}</p>
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-gray-100 rounded">
                            <p className="text-sm">
                                <strong>Extraction Confidence:</strong> {selectedBill.confidence}%
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BillPage