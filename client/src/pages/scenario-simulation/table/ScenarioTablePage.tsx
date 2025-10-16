// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
// import { Plus, Play, Eye, Trash2, Copy, TrendingUp } from 'lucide-react';
// import { useGetAllScenariosQuery, useDeleteScenarioMutation } from '../../../redux/apis/scenario.api';
// import { IScenario } from '../../../models/scenario.interface';

// const ScenarioTablePage = () => {
//   const navigate = useNavigate();
//   const { data: scenariosData, isLoading, refetch } = useGetAllScenariosQuery({});
//   const [deleteScenario, { isSuccess: isDeleteSuccess, isError: isDeleteError }] = useDeleteScenarioMutation();
//   // Remove the runScenario mutation since it doesn't exist in the API
//   const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

//   // Toast notifications
//   useEffect(() => {
//     if (isDeleteSuccess) {
//       toast.success('Scenario deleted successfully');
//       setSelectedScenario(null);
//     }
//   }, [isDeleteSuccess]);

//   useEffect(() => {
//     if (isDeleteError) {
//       toast.error('Failed to delete scenario');
//     }
//   }, [isDeleteError]);

//   // Remove run scenario effects since the API doesn't exist

//   const handleDelete = async (scenarioId: string) => {
//     try {
//       await deleteScenario(scenarioId).unwrap();
//     } catch (err) {
//       console.error('Delete failed:', err);
//     }
//   };

//   const handleRunScenario = async (scenarioId: string) => {
//     // Placeholder for run scenario functionality
//     toast.success('Scenario simulation started');
//   };

//   const getStatusBadge = (status: string) => {
//     const statusConfig = {
//       'draft': { variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' },
//       'running': { variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
//       'completed': { variant: 'default' as const, color: 'bg-green-100 text-green-800' },
//       'failed': { variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
//     };

//     const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || statusConfig['draft'];

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
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//         </div>
//       </div>
//     );
//   }

//   const scenarios = scenariosData?.result || [];

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex justify-between items-start">
//           <div className="space-y-2">
//             <h1 className="text-3xl font-bold tracking-tight">Scenario Management</h1>
//             <p className="text-muted-foreground">
//               Manage simulation scenarios and analyze "what-if" cost projections
//             </p>
//           </div>
//           <Button onClick={() => navigate('/admin/scenario-simulation/add')}>
//             <Plus className="h-4 w-4 mr-2" />
//             Create New Scenario
//           </Button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <Card>
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold">{scenarios.length}</div>
//               <p className="text-xs text-muted-foreground">Total Scenarios</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold text-green-600">
//                 {scenarios.filter(s => s.status === 'completed').length}
//               </div>
//               <p className="text-xs text-muted-foreground">Completed</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold text-blue-600">
//                 {scenarios.filter(s => s.status === 'running').length}
//               </div>
//               <p className="text-xs text-muted-foreground">Running</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="pt-6">
//               <div className="text-2xl font-bold text-orange-600">
//                 {scenarios.reduce((acc, s) => acc + (s.results?.savings || 0), 0).toLocaleString()}
//               </div>
//               <p className="text-xs text-muted-foreground">Total Savings (₹)</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Scenarios Table */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Simulation Scenarios</CardTitle>
//             <CardDescription>
//               All created scenarios with their parameters and simulation results
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {scenarios.length === 0 ? (
//               <div className="text-center py-8">
//                 <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//                 <p className="text-muted-foreground">No scenarios created yet</p>
//                 <Button
//                   variant="outline"
//                   onClick={() => navigate('/admin/scenario-simulation/add')}
//                   className="mt-4"
//                 >
//                   Create Your First Scenario
//                 </Button>
//               </div>
//             ) : (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Scenario Name</TableHead>
//                     <TableHead>Supplier Type</TableHead>
//                     <TableHead>Tariff Rate</TableHead>
//                     <TableHead>Estimated Cost</TableHead>
//                     <TableHead>Potential Savings</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Created Date</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {scenarios.map((scenario: IScenario) => (
//                     <TableRow key={scenario._id}>
//                       <TableCell>
//                         <div>
//                           <div className="font-medium">{scenario.name}</div>
//                           <div className="text-sm text-muted-foreground">
//                             {scenario.description?.substring(0, 50)}...
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <Badge variant="outline">
//                           {scenario.parameters?.supplierType || 'N/A'}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         ₹{scenario.parameters?.tariffRate || 0}/kWh
//                       </TableCell>
//                       <TableCell>
//                         {scenario.results?.estimatedCost
//                           ? formatCurrency(scenario.results.estimatedCost)
//                           : 'Not calculated'
//                         }
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-1">
//                           {scenario.results?.savings
//                             ? formatCurrency(scenario.results.savings)
//                             : 'N/A'
//                           }
//                           {scenario.results?.savings && scenario.results.savings > 0 && (
//                             <TrendingUp className="h-4 w-4 text-green-600" />
//                           )}
//                         </div>
//                       </TableCell>
//                       <TableCell>{getStatusBadge(scenario.status || 'draft')}</TableCell>
//                       <TableCell>{formatDate(scenario.createdAt)}</TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleRunScenario(scenario._id)}
//                             disabled={false}
//                           >
//                             <Play className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => navigate(`/admin/scenario-simulation/view/${scenario._id}`)}
//                           >
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => navigate(`/admin/scenario-simulation/duplicate/${scenario._id}`)}
//                           >
//                             <Copy className="h-4 w-4" />
//                           </Button>
//                           <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => setSelectedScenario(scenario._id)}
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>

//                             </AlertDialogTrigger>
//                             <AlertDialogContent>
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle>Delete Scenario</AlertDialogTitle>
//                                 <AlertDialogDescription>
//                                   Are you sure you want to delete this scenario? This action cannot be undone.
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter>
//                                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                 <AlertDialogAction
//                                   onClick={() => selectedScenario && handleDelete(selectedScenario)}
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

// export default ScenarioTablePage;



const ScenarioTablePage = () => {
  return (
    <div>ScenarioTablePage</div>
  )
}

export default ScenarioTablePage