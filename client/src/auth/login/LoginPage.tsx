

import { Link, useNavigate } from "react-router-dom";
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';

import { Zap, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useSignInMutation,
  useSendOTPMutation
} from '../../redux/apis/auth.api';
import { useForm, FieldErrors } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from "react";

const loginSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }),
  password: z.string().min(6, { message: 'Password Must Be Required' }),
});

const otpSchema = z.object({
  username: z.string().min(1, { message: 'Email or Phone is required' }),
});

type LoginFormData = z.infer<typeof loginSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const [signIn, { isSuccess: isAddSuccess, isError: isAddError, isLoading }] = useSignInMutation();
  const [sendOTP, { isLoading: otpLoading }] = useSendOTPMutation();
  const [useOTPLogin, setUseOTPLogin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData | OTPFormData>({
    resolver: zodResolver(useOTPLogin ? otpSchema : loginSchema),
  });


  const onSubmit = async (data: LoginFormData | OTPFormData) => {
    try {
      if (useOTPLogin) {
        // Send OTP for login
        await sendOTP({ username: (data as OTPFormData).username }).unwrap();
        toast.success('OTP sent successfully');
        navigate('/verify-otp', {
          state: {
            username: (data as OTPFormData).username,
            fromLogin: true
          }
        });
      } else {

        const loginData = data as LoginFormData;
        await signIn({ email: loginData.email, password: loginData.password }).unwrap();
      }
    } catch (error: any) {
      toast.error(error?.message || error?.data?.message || 'Login failed. Please try again.');
    }
  };


  useEffect(() => {
    if (isAddSuccess) {
      toast.success('Login successfully');
      navigate('/admin/dashboard');
    }
  }, [isAddSuccess, navigate]);

  useEffect(() => {
    if (isAddError) {
      toast.error('Login failed. Please try again.');
    }
  }, [isAddError]);



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-center font-bold">Energy Analytics Platform</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Sign in to access your energy data automation dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-4 flex gap-2">
              <Button
                type="button"
                variant={!useOTPLogin ? "default" : "outline"}
                onClick={() => {
                  setUseOTPLogin(false);
                  reset();
                }}
                className="flex-1"
              >
                Password Login
              </Button>
              <Button
                type="button"
                variant={useOTPLogin ? "default" : "outline"}
                onClick={() => {
                  setUseOTPLogin(true);
                  reset();
                }}
                className="flex-1"
              >
                OTP Login
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={useOTPLogin ? "username" : "email"}>
                  {useOTPLogin ? "Email or Phone" : "Email"}
                </Label>
                <Input
                  id={useOTPLogin ? "username" : "email"}
                  type="text"
                  placeholder={useOTPLogin ? "Enter your email or phone" : "Enter your email"}
                  {...register(useOTPLogin ? 'username' : 'email')}
                />
                {/* {useOTPLogin ? (
                errors.username && (
                  <p className="text-red-500 text-sm">{errors.username.message}</p>
                )
              ) : (
                errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )
              )} */}
                {useOTPLogin ? (
                  (errors as FieldErrors<{ username: string }>).username && (
                    <p className="text-red-500 text-sm">
                      {(errors as FieldErrors<{ username: string }>).username?.message}
                    </p>
                  )
                ) : (
                  (errors as FieldErrors<{ email: string; password: string }>).email && (
                    <p className="text-red-500 text-sm">
                      {(errors as FieldErrors<{ email: string; password: string }>).email?.message}
                    </p>
                  )
                )}

              </div>

              {!useOTPLogin && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register('password')}
                  />
                  {/* {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                  )} */}
                  {!useOTPLogin &&
                    (errors as FieldErrors<{ email: string; password: string }>).password?.message && (
                      <p className="text-red-500 text-sm">
                        {(errors as FieldErrors<{ email: string; password: string }>).password?.message}
                      </p>
                    )}

                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                disabled={isLoading || otpLoading}
              >
                {(isLoading || otpLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {useOTPLogin ? "Send OTP" : "Access Energy Dashboard"}
              </Button>
            </form>

          </CardContent>

          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <CardFooter className="flex flex-col space-y-4">
            <Separator />
            <div className="text-sm text-center w-full">
              New to Energy Analytics Platform?{' '}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Create Account
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

export default LoginPage; 
