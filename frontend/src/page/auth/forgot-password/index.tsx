import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
  Check,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PageLoader from "@/components/custom/page-loader";
import { forgetEmail, forgetVerifyOtp, forgetVerify } from "@/service/auth";
import { useToast } from "@/components/ui/use-toast";

interface ForgotPasswordFormValues {
    email: string;
    password: string;
    confirmPassword: string;
    otp: string;
}

// FIXME: Remove this after testing
const defaultValues: Partial<ForgotPasswordFormValues> = {
  email: "",
  password: "",
  confirmPassword: "",
  otp: undefined,
};

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    defaultValues,
  });

  const steps = ["Enter Email", "Verify OTP", "Reset Password", "Success"];

  const onEmailSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await forgetEmail({ email: data.email });
      setCurrentStep(1);
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code.",
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to send OTP. Please try again.";
      setError(errorMessage);
      toast({
        title: "Failed to Send OTP",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Email submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpVerification = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await forgetVerifyOtp({
        email: data.email,
        otp: data.otp
      });
      setCurrentStep(2);
      toast({
        title: "OTP Verified",
        description: "Please enter your new password.",
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Invalid OTP. Please try again.";
      setError(errorMessage);
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("OTP verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async (data: ForgotPasswordFormValues) => {
    if (data.password !== data.confirmPassword) {
      const errorMessage = "Passwords do not match!";
      setError(errorMessage);
      toast({
        title: "Password Mismatch",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await forgetVerify({
        email: data.email,
        otp: data.otp,
        newPassword: data.password
      });
      setIsPasswordReset(true);
      setCurrentStep(3);
      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset successfully.",
      });
    } catch (err: any) {
      setIsPasswordReset(false);
      const errorMessage = err.response?.data?.message || "Failed to reset password. Please try again.";
      setError(errorMessage);
      toast({
        title: "Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Password reset error:", err);
      setCurrentStep(3);
    } finally {
      setIsLoading(false);
    }
  };

  const onRequestForgotPasswordOtp = async () => {
    const email = form.getValues("email");
    if (!email) {
      const errorMessage = "Email is required to resend OTP";
      setError(errorMessage);
      toast({
        title: "Email Required",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await forgetEmail({ email });
      setError(null);
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to resend OTP. Please try again.";
      setError(errorMessage);
      toast({
        title: "Resend Failed",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Resend OTP error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onEmailSubmit, (errors) => {
                console.log(errors);
              })}
              className="space-y-4"
            >
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative text-sm">
                  {error}
                </div>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="your.email@company.com"
                          type="email"
                          autoComplete="email"
                          disabled={isLoading}
                          {...field}
                        />
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  className="border hover:shadow w-full hover:cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        );
      case 1:
        return (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onOtpVerification)}
              className="space-y-4"
            >
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative text-sm">
                  {error}
                </div>
              )}
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit OTP to your {form.getValues("email")}.
                  Please enter it below to verify your account.
                </p>
              </div>

              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password (OTP)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456"
                        type="text"
                        maxLength={6}
                        className="text-center text-lg tracking-widest"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setError(null);
                    setCurrentStep(0);
                  }}
                  disabled={isLoading}
                  className="hover:cursor-pointer"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="border hover:shadow hover:cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify OTP <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center mt-4">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="text-xs hover:cursor-pointer"
                  onClick={onRequestForgotPasswordOtp}
                  disabled={isLoading}
                >
                  Didn't receive OTP? Resend
                </Button>
              </div>
            </form>
          </Form>
        );

      case 2:
        return (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onResetPassword, (errors) => {
                console.log(errors);
              })}
              className="space-y-4"
            >
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative text-sm">
                  {error}
                </div>
              )}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-center mt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full hover:cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        );
      case 3:
        return (
          <div className="space-y-6 text-center">
            {isPasswordReset ? (
              <>
                <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    Password Reset Successful!
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Your password has been reset successfully. You can now log
                    in with your new password.
                  </p>
                </div>
                <Button
                  className="border hover:shadow w-full hover:cursor-pointer"
                  onClick={() => navigate("/auth/login")}
                >
                  Go to Login
                </Button>
              </>
            ) : (
              <>
                <div className="mx-auto bg-red-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    Password Reset Failed
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    {error || "There was an error resetting your password. Please try again."}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setError(null);
                    setCurrentStep(2);
                  }}
                  className="border hover:shadow w-full hover:cursor-pointer"
                >
                  Try Again
                </Button>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <PageLoader isLoading={isLoading} />
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to reset your password
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              Complete the steps below to reset your password
            </CardDescription>
          </CardHeader>

          <div className="px-6 py-4">
            <div className="w-full flex justify-between mb-8">
              {steps.map((label, index) => (
                <div
                  key={label}
                  className={`flex flex-col items-center ${
                    index <= currentStep
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                      ${
                        index < currentStep
                          ? "bg-primary text-black border border-2"
                          : index === currentStep
                          ? "border-2 border-primary"
                          : "border-2 border-muted"
                      }`}
                  >
                    {index < currentStep ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className="text-xs text-center">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <CardContent>{renderStepContent()}</CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Remember your password?{" "}
              </span>
              <a
                href="/auth/login"
                className="font-medium text-primary hover:text-primary/90"
              >
                Sign in
              </a>
            </div>
            <div className="flex items-center justify-center mt-2">
              <ShieldCheck className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">
                Your data is protected with enterprise-grade encryption
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
