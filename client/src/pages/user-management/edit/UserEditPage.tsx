import { useEffect } from 'react';
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
import { Users, Shield, ArrowLeft } from 'lucide-react';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../../redux/apis/user.api';

const userEditSchema = z.object({
  firstName: z.string().min(2, 'First name is required (min 2 characters)'),
  lastName: z.string().min(2, 'Last name is required (min 2 characters)'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['Admin', 'Client']),
  department: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

type UserEditFormData = z.infer<typeof userEditSchema>;

const UserEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: user, isLoading, error } = useGetUserByIdQuery(id!);
  const [updateUser, { isLoading: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError }] = useUpdateUserMutation();

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
  });


  // useEffect(() => {
  //   if (user) {
  //     reset({
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       email: user.email,
  //       role: user.role === 'Admin' ? 'Admin' : 'Client',
  //       department: user.department || '',
  //       phone: user.phone || '',
  //       status: user.status || 'active',
  //     });
  //   }
  // }, [user, reset]);

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.trim() === 'Admin' ? 'Admin' : 'Client',
        department: (user as any).department || '',

        phone: user.phone || '',
        status: user.status || 'active',
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (isUpdateSuccess) {
      toast.success('User updated successfully');
      navigate('/admin/user-management/table');
    }
  }, [isUpdateSuccess, navigate]);

  useEffect(() => {
    if (isUpdateError) {
      toast.error('Failed to update user');
    }
  }, [isUpdateError]);

  const onSubmit = async (data: UserEditFormData) => {
    if (!id) return;

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        formData.append(key, value);
      }
    });

    try {
      await updateUser({ userData: formData, id }).unwrap();
    } catch (err) {
      console.error('User update failed:', err);
    }
  };

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
            <div className="text-center text-red-600">
              <p>Error loading user data. Please try again.</p>
              <Button
                variant="outline"
                onClick={() => navigate('/admin/user-management/table')}
                className="mt-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p>User not found.</p>
              <Button
                variant="outline"
                onClick={() => navigate('/admin/user-management/table')}
                className="mt-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/user-management/table')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
            <p className="text-muted-foreground">
              Update user account information and permissions
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Information
              </CardTitle>
              <CardDescription>
                Basic user details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="user@company.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+91 99999 99999"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    {...register('department')}
                    placeholder="e.g., Operations, Finance"
                  />
                </div>
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Access Control
              </CardTitle>
              <CardDescription>
                Define user role and access permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">User Role</Label>
                  <Select onValueChange={(value) => setValue('role', value as 'Admin' | 'Client')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin - Full access to all modules</SelectItem>
                      <SelectItem value="Client">Client - Limited access to assigned data</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-red-600">{errors.role.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Account Status</Label>
                  <Select onValueChange={(value) => setValue('status', value as 'active' | 'inactive')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-600">{errors.status.message}</p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-blue-900">Role Permissions:</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div><strong>Admin:</strong> Full access to all bills, scenarios, analytics, and user management</div>
                  <div><strong>Client:</strong> Access only to their own bills and basic analytics</div>
                </div>
              </div>
            </CardContent>
          </Card>


          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isUpdating}
              className="flex-1"
            >
              {isUpdating ? 'Updating User...' : 'Update User'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/user-management/table')}
            >
              Cancel
            </Button>
          </div>
        </form>


        <Card>
          <CardContent className="pt-6">
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Password changes must be done through the password reset functionality for security reasons.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserEditPage;