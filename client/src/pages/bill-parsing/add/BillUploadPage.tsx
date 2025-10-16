import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useUploadBillMutation } from '../../../redux/apis/bill.api';

const BillUploadPage = () => {
  const navigate = useNavigate();
  const [uploadBill, { isLoading: isUploading, isSuccess: isUploadSuccess, isError: isUploadError, }] = useUploadBillMutation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  console.log(dragActive);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.bmp', '.tiff']
    },
    maxSize: 10 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
      }
    },
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  // Toast notifications and navigation
  useEffect(() => {
    if (isUploadSuccess) {
      toast.success('Bill uploaded and processing started successfully');
      navigate('/admin/bill-parsing/table');
    }
  }, [isUploadSuccess, navigate]);

  useEffect(() => {
    if (isUploadError) {
      toast.error('Failed to upload bill');
    }
  }, [isUploadError]);

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('bill', selectedFile);

    try {
      await uploadBill(formData).unwrap();
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Bill Parsing & Data Extraction</h1>
          <p className="text-muted-foreground">
            Upload utility bills (PDF/Excel) to extract structured data automatically using AI-powered OCR
          </p>
        </div>

        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Utility Bill
            </CardTitle>
            <CardDescription>
              Supported formats: PDF, PNG, JPG, JPEG, BMP, TIFF (Max size: 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
                ${selectedFile ? 'border-green-500 bg-green-50' : ''}
                hover:border-primary hover:bg-primary/5
              `}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                {selectedFile ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <div className="space-y-1">
                      <p className="font-medium text-green-700">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button variant="outline" onClick={removeFile} size="sm">
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div className="space-y-1">
                      <p className="font-medium">Drop your utility bill here</p>
                      <p className="text-sm text-muted-foreground">
                        or click to select a file
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="flex-1"
              >
                {isUploading ? 'Uploading...' : 'Upload & Process Bill'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/admin/bill-parsing/table')}
              >
                View All Bills
              </Button>
            </div>


            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-blue-900">What happens after upload:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• AI-powered OCR extracts text from your document</li>
                <li>• Structured data fields are automatically identified</li>
                <li>• Consumer number, consumption, charges, and tariffs are parsed</li>
                <li>• Results are available in JSON/Excel format for analysis</li>
              </ul>
            </div>
          </CardContent>
        </Card>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">OCR Technology</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Advanced optical character recognition for accurate text extraction
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Structured Data</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Extracts 30+ data fields including charges, consumption, and tariffs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold">Real-time Processing</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Get results in seconds with live processing status updates
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BillUploadPage;