import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
  Check,
  ArrowLeft,
  ArrowRight,
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
import { login, loginVerify } from "@/service/auth";
import type { ILogin, ILoginVerify } from "@/service/auth/interface";

interface LoginFormValues {
  email: string;
  password: string;
  otp: string;
}

const defaultValues: Partial<LoginFormValues> = {
  email: "",
  password: "",
  otp: "",
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    defaultValues,
    mode: "onChange",
  });

  const steps = ["Login", "Verify OTP"];

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (payload: ILogin) => login(payload),
    onSuccess: () => {
      setCurrentStep(1);
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      const errorMessage = error?.response?.data?.message || "Login failed. Please try again.";
      alert(errorMessage);
    },
  });

  // Verify OTP mutation
  const verifyOtpMutation = useMutation({
    mutationFn: (payload: ILoginVerify) => loginVerify(payload),
    onSuccess: (data) => {
      // Store the token in localStorage
      console.log(data.data.token);
      if (data.data.token) {
        localStorage.setItem("token", data.data.token);
      }
      navigate("/user/profile");
    },
    onError: (error: any) => {
      console.error("OTP verification error:", error);
      const errorMessage = error?.response?.data?.message || "OTP verification failed. Please try again.";
      alert(errorMessage);
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      const payload: ILogin = {
        email: data.email.trim(),
        password: data.password,
      };
      
      await loginMutation.mutateAsync(payload);
    } catch (error) {
      console.error("Login submission error:", error);
    }
  };

  const onOtpVerification = async (data: LoginFormValues) => {
    try {
      const payload: ILoginVerify = {
        email: data.email.trim(),
        otp: data.otp.trim(),
      };
      
      await verifyOtpMutation.mutateAsync(payload);
    } catch (error) {
      console.error("OTP verification submission error:", error);
    }
  };

  const isLoading = loginMutation.isPending || verifyOtpMutation.isPending;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onLoginSubmit, (data) => {
                console.log(data);
              })}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
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

              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
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
          <Form {...form} key="otp-form">
            <form
              onSubmit={form.handleSubmit(onOtpVerification)}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit OTP to{" "}
                  <strong>{form.getValues("email")}</strong>. Please enter it
                  below to verify your identity and complete your login.
                </p>
              </div>

              <FormField
                key={`otp-field-${currentStep}`}
                control={form.control}
                name="otp"
                rules={{
                  required: "OTP is required",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "OTP must be exactly 6 digits",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password (OTP)</FormLabel>
                    <FormControl>
                      <Input
                        key="otp-input"
                        placeholder="123456"
                        type="text"
                        maxLength={6}
                        className="text-center text-lg tracking-widest"
                        disabled={isLoading}
                        autoComplete="one-time-code"
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
                  onClick={() => setCurrentStep(0)}
                  disabled={isLoading}
                  className="hover:cursor-pointer"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="hover:shadow border hover:cursor-pointer"
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
            </form>
          </Form>
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
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your account
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription>
              Complete the steps below to access your account
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
            <div className="text-sm text-center">
              <a
                href="/auth/forgot-password"
                className="font-medium text-primary hover:text-primary/90"
              >
                Forgot your password?
              </a>
            </div>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Don't have an account?{" "}
              </span>
              <a
                href="/auth/signup"
                className="font-medium text-primary hover:text-primary/90"
              >
                Sign up
              </a>
            </div>
            <div className="flex items-center justify-center mt-2">
              <ShieldCheck className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">
                Secure login protected by enterprise-grade encryption
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}