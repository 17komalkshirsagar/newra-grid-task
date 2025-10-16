// import { useEffect, useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';

// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
// import { Plus, Edit, Trash2, Play, Pause, Database, Search } from 'lucide-react';
// import { IIntegration } from '@/models/integration.interface';
// import { useGetAllIntegrationsQuery, useDeleteIntegrationMutation, useTestIntegrationMutation } from '@/redux/apis/integration.api';

// const IntegrationTablePage = () => {
//   const navigate = useNavigate();
//   const [selectedIntegration, setSelectedIntegration] = useState<IIntegration | null>(null);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');


//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   const { data: integrationsData, isLoading, error, refetch } = useGetAllIntegrationsQuery({

//   });
//   const [deleteIntegration] = useDeleteIntegrationMutation();
//   const [testIntegration] = useTestIntegrationMutation();


//   const allIntegrations = integrationsData?.result || [];
//   const integrations = useMemo(() => {
//     if (!debouncedSearchTerm) return allIntegrations;

//     return allIntegrations.filter(integration =>
//       integration.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
//       integration.type.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
//       integration.status.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
//       integration.exportSettings?.dataTypes?.some(type =>
//         type.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
//       ) ||
//       integration.metadata?.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
//     );
//   }, [allIntegrations, debouncedSearchTerm]);

//   const handleDelete = async (integrationId: string) => {
//     try {
//       await deleteIntegration(integrationId).unwrap();
//       toast.success('Integration deleted successfully');
//       setSelectedIntegration(null);
//       refetch();
//     } catch (err: any) {
//       toast.error(err?.data?.message || err?.message || 'Failed to delete integration');
//     }
//   };
//   const handleToggleStatus = async (currentStatus: string) => {


//     const newStatus = currentStatus === 'active' ? 'inactive' : 'active';


//     try {

//       toast.success(`Integration ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
//       refetch();
//     } catch (err: any) {
//       toast.error(err?.data?.message || err?.message || 'Failed to update integration status');
//     }
//   };

//   const handleRunNow = async (integrationId: string) => {
//     try {
//       await testIntegration(integrationId).unwrap();
//       toast.success('Export completed successfully');
//       refetch();
//     } catch (err: any) {
//       toast.error(err?.data?.message || err?.message || 'Failed to run export');
//     }
//   };

//   const getTypeBadge = (type: string) => {
//     const typeConfig = {
//       'PowerBI': { variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
//       'ERP': { variant: 'secondary' as const, color: 'bg-purple-100 text-purple-800' },
//       'Excel': { variant: 'outline' as const, color: 'bg-green-100 text-green-800' },
//       'API': { variant: 'destructive' as const, color: 'bg-orange-100 text-orange-800' },
//     };

//     const config = typeConfig[type as keyof typeof typeConfig] || typeConfig['API'];

//     return (
//       <Badge variant={config.variant} className={config.color}>
//         {type}
//       </Badge>
//     );
//   };

//   const getStatusBadge = (status: string) => {
//     const statusConfig = {
//       'active': { variant: 'default' as const, color: 'bg-green-100 text-green-800' },
//       'inactive': { variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' },
//       'error': { variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
//     };

//     const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['inactive'];

//     return (
//       <Badge variant={config.variant} className={config.color}>
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </Badge>
//     );
//   };

//   const getLastExportBadge = (lastExport?: IIntegration['lastExport']) => {
//     if (!lastExport) {
//       return <span className="text-gray-500">Never</span>;
//     }

//     const statusConfig = {
//       'success': 'text-green-600',
//       'failed': 'text-red-600',
//       'partial': 'text-yellow-600',
//     };

//     return (
//       <div className="space-y-1">
//         <div className={`text-sm font-medium ${statusConfig[lastExport.status]}`}>
//           {lastExport.status.charAt(0).toUpperCase() + lastExport.status.slice(1)}
//         </div>
//         <div className="text-xs text-gray-500">
//           {new Date(lastExport.timestamp).toLocaleDateString()} - {lastExport.recordsExported} records
//         </div>
//       </div>
//     );
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center">Loading integrations...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center text-red-600">Failed to load integrations</div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex justify-between items-start">
//           <div className="space-y-2">
//             <h1 className="text-3xl font-bold tracking-tight">Integration Management</h1>
//             <p className="text-muted-foreground">
//               Manage data exports to PowerBI, ERP systems, and external platforms
//             </p>
//           </div>
//           <Button onClick={() => navigate('/admin/integration-management/add')}>
//             <Plus className="h-4 w-4 mr-2" />
//             New Integration
//           </Button>
//         </div>

//         {/* Search */}
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center space-x-2">
//               <Search className="h-4 w-4 text-gray-400" />
//               <Input
//                 placeholder="Search integrations by name, type, status, or data types..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="max-w-md"
//               />
//               {searchTerm && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setSearchTerm('')}
//                 >
//                   Clear
//                 </Button>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <Card>
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold">
//                 {integrations.length}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 {debouncedSearchTerm ? 'Filtered' : 'Total'} Integrations
//               </p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold text-green-600">
//                 {integrations.filter(i => i.status === 'active').length}
//               </div>
//               <p className="text-xs text-muted-foreground">Active</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold text-blue-600">
//                 {integrations.filter(i => i.lastExport?.status === 'success').length}
//               </div>
//               <p className="text-xs text-muted-foreground">Successful Exports</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold text-red-600">
//                 {integrations.filter(i => i.lastExport?.status === 'failed').length}
//               </div>
//               <p className="text-xs text-muted-foreground">Failed Exports</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Integrations Table */}
//         <Card>
//           <CardHeader>
//             <CardTitle>System Integrations</CardTitle>
//             <CardDescription>
//               {debouncedSearchTerm
//                 ? `Showing search results for "${debouncedSearchTerm}"`
//                 : 'All configured data export integrations and their status'
//               }
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {integrations.length === 0 ? (
//               <div className="text-center py-8">
//                 <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//                 <p className="text-muted-foreground">
//                   {debouncedSearchTerm ? 'No integrations match your search' : 'No integrations found'}
//                 </p>
//                 {!debouncedSearchTerm && (
//                   <Button
//                     variant="outline"
//                     onClick={() => navigate('/admin/integration-management/add')}
//                     className="mt-4"
//                   >
//                     Create First Integration
//                   </Button>
//                 )}
//                 {debouncedSearchTerm && (
//                   <Button
//                     variant="outline"
//                     onClick={() => setSearchTerm('')}
//                     className="mt-4"
//                   >
//                     Clear Search
//                   </Button>
//                 )}
//               </div>
//             ) : (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Integration</TableHead>
//                     <TableHead>Type</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Schedule</TableHead>
//                     <TableHead>Last Export</TableHead>
//                     <TableHead>Data Types</TableHead>
//                     <TableHead>Created</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {integrations.map((integration) => (
//                     <TableRow key={integration._id}>
//                       <TableCell>
//                         <div className="flex items-center gap-3">
//                           <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
//                             <Database className="h-4 w-4 text-blue-600" />
//                           </div>
//                           <div>
//                             <div className="font-medium">{integration.name}</div>
//                             <div className="text-sm text-muted-foreground">
//                               {integration.exportSettings?.format || 'N/A'} format
//                             </div>
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell>{getTypeBadge(integration.type)}</TableCell>
//                       <TableCell>{getStatusBadge(integration.status)}</TableCell>
//                       <TableCell>
//                         <span className="capitalize">{integration.configuration?.schedule?.frequency || 'manual'}</span>
//                       </TableCell>
//                       <TableCell>{getLastExportBadge(integration.lastExport)}</TableCell>
//                       <TableCell>
//                         <div className="text-sm">
//                           {integration.exportSettings?.dataTypes?.join(', ') || 'N/A'}
//                         </div>
//                       </TableCell>
//                       <TableCell>{integration.createdAt ? formatDate(integration.createdAt.toString()) : 'N/A'}</TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleRunNow(integration._id)}
//                             disabled={integration.status !== 'active'}
//                           >
//                             <Play className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => navigate(`/admin/integration-management/edit/${integration._id}`)}
//                           >
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleToggleStatus(integration._id, integration.status)}
//                           >
//                             {integration.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
//                           </Button>
//                           <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => setSelectedIntegration(integration._id)}
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent>
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle>Delete Integration</AlertDialogTitle>
//                                 <AlertDialogDescription>
//                                   Are you sure you want to delete this integration? This action cannot be undone and will stop all scheduled exports.
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter>
//                                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                 <AlertDialogAction
//                                   onClick={() => selectedIntegration && handleDelete(selectedIntegration)}
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

// export default IntegrationTablePage;   




const IntegrationTablePage = () => {
  return (
    <div>IntegrationTablePage</div>
  )
}

export default IntegrationTablePage