import { useState, useEffect } from 'react';

import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  MessageSquare,
  Mail,
  Phone,
  Building,
  Calendar,
  Search,

  Trash2,
  Eye,

  Clock,
  MailCheck,
  Archive,
  RefreshCw
} from 'lucide-react';
import {
  useGetContactMessagesQuery,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
  ContactMessage
} from '@/redux/apis/contact.api';

const ContactMessagesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const queryParams = {
    searchQuery: debouncedSearch || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    inquiryType: inquiryTypeFilter !== 'all' ? inquiryTypeFilter : undefined,
  };

  const { data, isLoading, error, refetch } = useGetContactMessagesQuery(queryParams);
  const [updateStatus, { isSuccess: isUpdateSuccess }] = useUpdateContactStatusMutation();
  const [deleteMessage, { isSuccess: isDeleteSuccess }] = useDeleteContactMutation();

  // Log the response for debugging
  useEffect(() => {
    if (data) {
      console.log('Contact API Response:', data);
    }
    if (error) {
      console.error('Contact API Error:', error);
    }
  }, [data, error]);

  const messages: ContactMessage[] = data?.data || [];

  useEffect(() => {
    if (isUpdateSuccess) {
      toast.success('Status updated successfully');
    }
  }, [isUpdateSuccess]);

  useEffect(() => {
    if (isDeleteSuccess) {
      toast.success('Message deleted successfully');
      setSelectedMessage(null);
    }
  }, [isDeleteSuccess]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id).unwrap();
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsViewModalOpen(true);
    if (message.status === 'new') {
      handleStatusUpdate(message._id, 'read');
    }
  };

  const getStatusBadge = (status?: string) => {
    const statusConfig = {
      new: { variant: 'default' as const, color: 'bg-blue-100 text-blue-800', icon: Clock },
      read: { variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800', icon: Eye },
      responded: { variant: 'default' as const, color: 'bg-green-100 text-green-800', icon: MailCheck },
      archived: { variant: 'secondary' as const, color: 'bg-purple-100 text-purple-800', icon: Archive },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status?.charAt(0).toUpperCase()}{status?.slice(1)}
      </Badge>
    );
  };

  const getInquiryBadge = (type: string) => {
    const typeConfig = {
      sales: { color: 'bg-blue-100 text-blue-800', label: 'Sales' },
      support: { color: 'bg-orange-100 text-orange-800', label: 'Support' },
      partnership: { color: 'bg-purple-100 text-purple-800', label: 'Partnership' },
      general: { color: 'bg-gray-100 text-gray-800', label: 'General' },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.general;

    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStats = () => {
    return {
      total: messages.length,
      new: messages.filter((m) => m.status === 'new').length,
      read: messages.filter((m) => m.status === 'read').length,
      responded: messages.filter((m) => m.status === 'responded').length,
    };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Messages</h3>
              <p className="text-muted-foreground mb-4">
                {(error as any)?.data?.message || 'Failed to fetch contact messages'}
              </p>
              <Button onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">

        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
            <p className="text-muted-foreground">
              View and manage contact form submissions from customers
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total Messages</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{stats.new}</div>
              <p className="text-xs text-muted-foreground">New Messages</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-600">{stats.read}</div>
              <p className="text-xs text-muted-foreground">Read Messages</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.responded}</div>
              <p className="text-xs text-muted-foreground">Responded</p>
            </CardContent>
          </Card>
        </div>


        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>


              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>


                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>

              </Select>

              <Select value={inquiryTypeFilter} onValueChange={setInquiryTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by inquiry type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>
              {messages.length} message{messages.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No messages found</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Inquiry Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message) => (
                      <TableRow key={message._id}>
                        <TableCell>
                          <div className="font-medium">
                            {message.firstName} {message.lastName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              {message.email}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {message.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Building className="h-3 w-3" />
                            {message.company}
                          </div>
                        </TableCell>
                        <TableCell>{getInquiryBadge(message.inquiryType)}</TableCell>
                        <TableCell>{getStatusBadge(message.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(message.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewMessage(message)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <Select
                              value={message.status || 'new'}
                              onValueChange={(value) => handleStatusUpdate(message._id, value)}
                            >
                              <SelectTrigger className="w-[130px] h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="read">Read</SelectItem>
                                <SelectItem value="responded">Responded</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedMessage(message)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Message</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this message? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => selectedMessage && handleDelete(selectedMessage._id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>


      {selectedMessage && isViewModalOpen && (
        <AlertDialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center justify-between">
                <span>Message Details</span>
                {getStatusBadge(selectedMessage.status)}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {formatDate(selectedMessage.createdAt)}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Name</p>
                  <p className="text-base">
                    {selectedMessage.firstName} {selectedMessage.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Company</p>
                  <p className="text-base">{selectedMessage.company}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Email</p>
                  <p className="text-base">{selectedMessage.email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="text-base">{selectedMessage.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Inquiry Type</p>
                  {getInquiryBadge(selectedMessage.inquiryType)}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Message</p>
                <p className="text-base bg-gray-50 dark:bg-gray-800 p-4 rounded-lg whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              <Button
                onClick={() => {
                  window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.inquiryType} Inquiry`;
                }}
              >
                <Mail className="h-4 w-4 mr-2" />
                Reply via Email
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default ContactMessagesPage;
