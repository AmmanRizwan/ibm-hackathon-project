import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, Menu, X } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { cn } from "@/lib/utils";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const form = useForm<LoginFormValues>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            console.log("Login data:", data);
            // Add your login logic here
            // Example: await loginService(data);
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        {/* Toggle Button - Hidden when sidebar is open */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-20 left-4 z-50 p-2 bg-white transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r shadow-lg z-40 transition-transform duration-300 ease-in-out w-64',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
              {/* Close button for sidebar */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                <li>
                  <a
                    href="/auth/signup"
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <span>Sign Up</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/auth/forgot-password"
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <span>Forgot Password</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <span>Home</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        <div className="flex sm:min-h-screen sm:items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
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
                Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                            disabled={isLoading}
                            />
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
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                {...field}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                disabled={isLoading}
                            >
                                {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                                ) : (
                                <Eye className="h-4 w-4" />
                                )}
                            </button>
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <Button
                    type="submit"
                    className="w-full border hover:shadow"
                    disabled={isLoading}
                    >
                    {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
                </Form>
            </CardContent>
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
        </>
    )
}

export default Login;