import { useNavigate, Link, useLocation } from "react-router-dom";
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
import { useEffect, useState } from "react";
import {
  useVerifyOTPMutation,
  useSendOTPMutation
} from '../../redux/apis/auth.api';

const verifyOTPSchema = z.object({
  otp: z.string().min(4, { message: 'Please enter a valid OTP' }),
});

type VerifyOTPFormData = z.infer<typeof verifyOTPSchema>;

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
  const [sendOTP, { isLoading: resendLoading }] = useSendOTPMutation();

  // Get username from navigation state
  const { username, fromLogin } = location.state || {};
  const [countdown, setCountdown] = useState(30);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOTPFormData>({
    resolver: zodResolver(verifyOTPSchema),
  });

  useEffect(() => {
    if (!username) {
      navigate('/login');
      return;
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [username, navigate]);

  const onSubmit = async (data: VerifyOTPFormData) => {
    try {
      const result = await verifyOTP({
        username,
        otp: data.otp
      }).unwrap();
      console.log("result::", result);
      toast.success('OTP verified successfully');

      if (fromLogin) {
        navigate('/admin/dashboard');
      } else {

        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error?.message || error?.data?.message || 'Invalid OTP. Please try again.');
    }
  };


  const handleResendOTP = async () => {
    try {
      await sendOTP({ username }).unwrap();
      toast.success('OTP resent successfully');
      setCountdown(30);
    } catch (error: any) {
      toast.error(error?.message || error?.data?.message || 'Failed to resend OTP. Please try again.');
    }
  };


  const isEmail = username?.includes('@');
  const displayMethod = isEmail ? 'email' : 'phone number';
  const displayUsername = username || '';
  console.log("displayMethod::", displayMethod);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-center font-bold">Verify OTP</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter the verification code sent to your registered email address
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 text-center">
                You entered: <span className="font-medium">{displayUsername}</span><br />
                <span className="text-xs">OTP sent to your registered email address</span>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  {...register('otp')}
                />
                {errors.otp && (
                  <p className="text-red-500 text-sm">{errors.otp.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify OTP
              </Button>
            </form>

            <div className="mt-4 text-center">
              {countdown > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend OTP in {countdown} seconds
                </p>
              ) : (
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                  className="text-blue-600 hover:underline p-0"
                >
                  {resendLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Resend OTP
                </Button>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Separator />
            <div className="text-sm text-center w-full">
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-medium inline-flex items-center"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
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

export default VerifyOTPPage;