import { Link, useNavigate } from "react-router-dom";
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { Zap, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";
import { useForgotPasswordMutation } from '../../redux/apis/auth.api';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const result = await forgotPassword(data.email).unwrap();
      setIsSubmitted(true);
      toast.success(result || 'Password reset instructions sent to your email');
    } catch (error: any) {
      toast.error(error?.message || error?.data?.message || 'Failed to send reset instructions. Please try again.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <Zap className="h-10 w-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-center font-bold">Check Your Email</CardTitle>
              <CardDescription className="text-center text-gray-600">
                We've sent password reset instructions to your email address
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                <div className="text-green-600 mb-2">✓</div>
                <p className="text-sm text-green-700">
                  If an account with that email exists, you'll receive password reset instructions within a few minutes.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>

              <div className="text-sm text-center text-gray-500">
                Didn't receive an email? Check your spam folder or{' '}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-blue-600 hover:underline font-medium"
                >
                  try again
                </button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-center font-bold">Reset Password</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your email address and we'll send you instructions to reset your password
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Instructions
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Separator />
            <div className="text-sm text-center w-full">
              Remember your password?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                <ArrowLeft className="inline h-3 w-3 mr-1" />
                Back to Login
              </Link>
            </div>
            <div className="text-xs text-center text-gray-500">
              Secure energy data automation & analytics platform
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;