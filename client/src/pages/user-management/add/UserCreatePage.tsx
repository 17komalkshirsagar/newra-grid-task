import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Shield, Mail } from 'lucide-react';
import { useCreateUserMutation } from '../../../redux/apis/user.api';

const userSchema = z.object({
  firstName: z.string().min(2, 'First name is required (min 2 characters)'),
  lastName: z.string().min(2, 'Last name is required (min 2 characters)'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['Admin', 'Client']),
  department: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UserFormData = z.infer<typeof userSchema>;

const UserCreatePage = () => {
  const navigate = useNavigate();
  const [createUser, { isLoading: isCreating, isSuccess: isCreateSuccess, isError: isCreateError }] = useCreateUserMutation();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'Client',
    },
  });

  // Toast notifications and navigation
  useEffect(() => {
    if (isCreateSuccess) {
      toast.success('User created successfully');
      navigate('/admin/user-management/table');
    }
  }, [isCreateSuccess, navigate]);

  useEffect(() => {
    if (isCreateError) {
      toast.error('Failed to create user');
    }
  }, [isCreateError]);

  const onSubmit = async (data: UserFormData) => {
    const { confirmPassword, ...userData } = data;
    try {
      await createUser(userData as any).unwrap();
    } catch (err) {
      console.error('User creation failed:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">User & Access Management</h1>
          <p className="text-muted-foreground">
            Create new user accounts with role-based access and data segregation
          </p>
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

              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-blue-900">Role Permissions:</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div><strong>Admin:</strong> Full access to all bills, scenarios, analytics, and user management</div>
                  <div><strong>Client:</strong> Access only to their own bills and basic analytics</div>
                </div>
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Set initial password for the user account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="Minimum 6 characters"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                    placeholder="Re-enter password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> User will receive an email with login credentials and will be prompted to change password on first login.
                </p>
              </div>
            </CardContent>
          </Card>


          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isCreating}
              className="flex-1"
            >
              {isCreating ? 'Creating User...' : 'Create User Account'}
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
            <div className="space-y-2">
              <h4 className="font-medium">User Management Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Multi-user login system with secure authentication</li>
                <li>• Role-based access control (Admin/Client)</li>
                <li>• Data segregation and privacy protection</li>
                <li>• Audit trails for user actions and data access</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserCreatePage;