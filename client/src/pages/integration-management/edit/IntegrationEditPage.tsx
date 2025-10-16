import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { Plug, Settings, Clock, Database, ArrowLeft } from 'lucide-react';
import { useGetIntegrationByIdQuery, useUpdateIntegrationMutation } from '@/redux/apis/integration.api';

const integrationSchema = z.object({
  name: z.string().min(2, 'Integration name is required (min 2 characters)'),
  type: z.enum(['PowerBI', 'ERP', 'Excel', 'API']),
  description: z.string().optional(),
  endpoint: z.string().url('Invalid URL').optional(),
  apiKey: z.string().optional(),
  frequency: z.enum(['manual', 'daily', 'weekly', 'monthly']),
  time: z.string().optional(),
  format: z.enum(['JSON', 'XML', 'CSV', 'Excel']),
  dataTypes: z.array(z.string()).min(1, 'Select at least one data type'),
  includeFields: z.string().optional(),
  excludeFields: z.string().optional(),
  tags: z.string().optional(),
});

type IntegrationFormData = z.infer<typeof integrationSchema>;

const IntegrationEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { data: integration, isLoading, error } = useGetIntegrationByIdQuery(id!);
  const [updateIntegration] = useUpdateIntegrationMutation();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<IntegrationFormData>({
    resolver: zodResolver(integrationSchema),
    defaultValues: {
      type: 'PowerBI',
      frequency: 'manual',
      format: 'JSON',
      dataTypes: ['bills'],
    },
  });

  const selectedType = watch('type');
  const selectedFrequency = watch('frequency');

  useEffect(() => {
    if (integration) {
      reset({
        name: integration.name,
        type: integration.type,
        description: integration.metadata?.description || '',
        endpoint: integration.configuration?.endpoint || '',
        apiKey: integration.configuration?.apiKey || '',
        frequency: integration.configuration?.schedule?.frequency || 'manual',
        time: integration.configuration?.schedule?.time || '',
        format: integration.exportSettings?.format || 'JSON',
        dataTypes: integration.exportSettings?.dataTypes || ['bills'],
        includeFields: integration.exportSettings?.includeFields?.join(', ') || '',
        excludeFields: integration.exportSettings?.excludeFields?.join(', ') || '',
        tags: integration.metadata?.tags?.join(', ') || '',
      });
    }
  }, [integration, reset]);

  const onSubmit = async (data: IntegrationFormData) => {
    setIsSubmitting(true);
    try {
      const updateData = {
        name: data.name,
        type: data.type,
        configuration: {
          endpoint: data.endpoint,
          apiKey: data.apiKey,
          schedule: {
            frequency: data.frequency,
            time: data.time,
          },
        },
        exportSettings: {
          format: data.format,
          dataTypes: data.dataTypes,
          includeFields: data.includeFields ? data.includeFields.split(',').map(s => s.trim()) : [],
          excludeFields: data.excludeFields ? data.excludeFields.split(',').map(s => s.trim()) : [],
        },
        metadata: {
          description: data.description,
          tags: data.tags ? data.tags.split(',').map(s => s.trim()) : [],
          version: integration?.metadata?.version || '1.0.0',
          createdBy: integration?.metadata?.createdBy || '',
        },
      };

      await updateIntegration({ integrationData: updateData, id: id! }).unwrap();
      toast.success('Integration updated successfully');
      navigate('/admin/integration-management/table');
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to update integration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dataTypeOptions = [
    { value: 'bills', label: 'Utility Bills' },
    { value: 'scenarios', label: 'Scenarios' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'reports', label: 'Reports' },
    { value: 'users', label: 'Users' },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading integration...</div>
      </div>
    );
  }

  if (error || !integration) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Failed to load integration</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/integration-management/table')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Edit Integration</h1>
            <p className="text-muted-foreground">
              Update integration settings and configuration
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plug className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Configure the basic details of your integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Integration Name</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="PowerBI Energy Dashboard"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Integration Type</Label>
                  <Select onValueChange={(value) => setValue('type', value as any)} value={selectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select integration type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PowerBI">Power BI</SelectItem>
                      <SelectItem value="ERP">ERP System</SelectItem>
                      <SelectItem value="Excel">Excel Export</SelectItem>
                      <SelectItem value="API">Custom API</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-600">{errors.type.message}</p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Brief description of this integration..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Connection Settings
              </CardTitle>
              <CardDescription>
                Configure connection details for {selectedType}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(selectedType === 'PowerBI' || selectedType === 'API') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="endpoint">API Endpoint</Label>
                    <Input
                      id="endpoint"
                      {...register('endpoint')}
                      placeholder="https://api.powerbi.com/v1.0/..."
                    />
                    {errors.endpoint && (
                      <p className="text-sm text-red-600">{errors.endpoint.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      {...register('apiKey')}
                      placeholder="Enter API key or token"
                    />
                  </div>
                </div>
              )}

              {selectedType === 'ERP' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>ERP Integration:</strong> Configure your ERP system connection details.
                    This will create scheduled exports in your ERP-compatible format.
                  </p>
                </div>
              )}

              {selectedType === 'Excel' && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Excel Export:</strong> Generate Excel files with your data.
                    Files will be available for download or can be saved to a network location.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Schedule Settings
              </CardTitle>
              <CardDescription>
                Configure when and how often data should be exported
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Export Frequency</Label>
                  <Select onValueChange={(value) => setValue('frequency', value as any)} value={selectedFrequency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Export</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedFrequency !== 'manual' && (
                  <div className="space-y-2">
                    <Label htmlFor="time">Export Time</Label>
                    <Input
                      id="time"
                      type="time"
                      {...register('time')}
                      defaultValue="09:00"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Export Settings
              </CardTitle>
              <CardDescription>
                Configure what data to export and in which format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="format">Export Format</Label>
                  <Select onValueChange={(value) => setValue('format', value as any)} value={watch('format')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JSON">JSON</SelectItem>
                      <SelectItem value="XML">XML</SelectItem>
                      <SelectItem value="CSV">CSV</SelectItem>
                      <SelectItem value="Excel">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    {...register('tags')}
                    placeholder="energy, bills, analytics"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Data Types to Export</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {dataTypeOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={option.value}
                        defaultChecked={integration.exportSettings?.dataTypes?.includes(option.value)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={option.value} className="text-sm font-medium">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="includeFields">Include Fields (comma-separated)</Label>
                  <Input
                    id="includeFields"
                    {...register('includeFields')}
                    placeholder="totalAmount, unitsConsumed, customerName"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excludeFields">Exclude Fields (comma-separated)</Label>
                  <Input
                    id="excludeFields"
                    {...register('excludeFields')}
                    placeholder="apiKey, internalId, rawData"
                  />
                </div>
              </div>
            </CardContent>
          </Card>


          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Updating Integration...' : 'Update Integration'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/integration-management/table')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IntegrationEditPage;