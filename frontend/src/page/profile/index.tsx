import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Lock, Edit2, X, Check, Shield, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageLoader from '@/components/custom/page-loader';
import { getMe, updateUserDetail } from '@/service/user';
import { setUser, removeUser, removeToken } from '@/store/auth';
import { useToast } from '@/components/ui/use-toast';

interface ProfileFormValues {
    name: string;
    phone: string;
}

interface PasswordFormValues {
    password: string;
    confirmPassword: string;
}

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
    const user = useSelector((state: any) => state.auth.user);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // Profile form
    const profileForm = useForm<ProfileFormValues>({
        defaultValues: {
            name: user?.name || '',
            phone: user?.phone || '',
        },
    });

    // Password form
    const passwordForm = useForm<PasswordFormValues>({
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    // Fetch user data on mount
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const response = await getMe();
            if (response.data) {
                dispatch(setUser(response.data));
                profileForm.reset({
                    name: response.data.name,
                    phone: response.data.phone,
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || 'Failed to fetch user data',
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onProfileSubmit = async (data: ProfileFormValues) => {
        setIsLoading(true);

        try {
            const response = await updateUserDetail({
                name: data.name.trim(),
                phone: data.phone.trim(),
            });

            toast({
                title: "Success",
                description: response.message || 'Profile updated successfully!',
            });
            setIsEditMode(false);

            // Update Redux store
            dispatch(setUser({
                ...user,
                name: data.name.trim(),
                phone: data.phone.trim(),
            }));

            // Refresh user data
            await fetchUserData();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || 'Failed to update profile',
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onPasswordSubmit = async (data: PasswordFormValues) => {
        setIsLoading(true);

        try {
            const response = await updateUserDetail({
                password: data.password,
            });

            toast({
                title: "Success",
                description: response.message || 'Password updated successfully!',
            });

            // Reset password form
            passwordForm.reset();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || 'Failed to update password',
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        profileForm.reset({
            name: user?.name || '',
            phone: user?.phone || '',
        });
    };

    const handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem('token');
        
        // Clear Redux store
        dispatch(removeUser());
        dispatch(removeToken());
        
        // Navigate to home page
        navigate('/');
    };

    const isAdmin = user?.role === 'admin';

    return (
        <div className="mx-auto py-8 px-4 max-w-4xl">
            <PageLoader isLoading={isLoading} />

            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Profile</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your account settings and preferences
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {isAdmin && (
                            <Badge variant="default" className="flex items-center gap-1 px-3 py-1">
                                <Shield className="h-4 w-4" />
                                Admin
                            </Badge>
                        )}
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleLogout}
                            className="hover:cursor-pointer text-white bg-red-400 hover:bg-red-500 flex items-center gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tabs for Profile and Password */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">Profile Information</TabsTrigger>
                    <TabsTrigger value="password">Change Password</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>
                                        View and update your profile details
                                    </CardDescription>
                                </div>
                                {!isEditMode && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsEditMode(true)}
                                        disabled={isLoading}
                                    >
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {!isEditMode ? (
                                // View Mode
                                <div className="space-y-6">
                                    {/* Name */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <User className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">Name</p>
                                            <p className="text-lg font-medium">{user?.name || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Mail className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">Email</p>
                                            <p className="text-lg font-medium">{user?.email || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Phone className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">Phone</p>
                                            <p className="text-lg font-medium">{user?.phone || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Role */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Shield className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">Role</p>
                                            <p className="text-lg font-medium capitalize">
                                                {user?.role || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Edit Mode
                                <Form {...profileForm}>
                                    <form
                                        onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                                        className="space-y-6"
                                    >
                                        {/* Name Field */}
                                        <FormField
                                            control={profileForm.control}
                                            name="name"
                                            rules={{
                                                required: 'Name is required',
                                                minLength: {
                                                    value: 2,
                                                    message: 'Name must be at least 2 characters',
                                                },
                                            }}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                placeholder="Enter your name"
                                                                disabled={isLoading}
                                                                {...field}
                                                            />
                                                            <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Email Field (Read-only) */}
                                        <div>
                                            <FormLabel>Email</FormLabel>
                                            <div className="relative">
                                                <Input
                                                    value={user?.email || ''}
                                                    disabled
                                                    className="bg-muted"
                                                />
                                                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Email cannot be changed
                                            </p>
                                        </div>

                                        {/* Phone Field */}
                                        <FormField
                                            control={profileForm.control}
                                            name="phone"
                                            rules={{
                                                required: 'Phone number is required',
                                                pattern: {
                                                    value: /^[0-9]{10}$/,
                                                    message: 'Phone number must be 10 digits',
                                                },
                                            }}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                placeholder="Enter your phone number"
                                                                maxLength={10}
                                                                disabled={isLoading}
                                                                {...field}
                                                            />
                                                            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Action Buttons */}
                                        <div className="flex gap-4 pt-4">
                                            <Button
                                                type="submit"
                                                className="flex-1"
                                                disabled={isLoading}
                                            >
                                                <Check className="h-4 w-4 mr-2" />
                                                {isLoading ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleCancelEdit}
                                                disabled={isLoading}
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Password Tab */}
                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>
                                Update your password to keep your account secure
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...passwordForm}>
                                <form
                                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                                    className="space-y-6"
                                >
                                    {/* New Password Field */}
                                    <FormField
                                        control={passwordForm.control}
                                        name="password"
                                        rules={{
                                            required: 'Password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters',
                                            },
                                        }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type="password"
                                                            placeholder="Enter new password"
                                                            disabled={isLoading}
                                                            {...field}
                                                        />
                                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Confirm Password Field */}
                                    <FormField
                                        control={passwordForm.control}
                                        name="confirmPassword"
                                        rules={{
                                            required: 'Please confirm your password',
                                            validate: (value) =>
                                                value === passwordForm.getValues('password') ||
                                                'Passwords do not match',
                                        }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm New Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type="password"
                                                            placeholder="Confirm new password"
                                                            disabled={isLoading}
                                                            {...field}
                                                        />
                                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Submit Button */}
                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            className="w-full border border-1 hover:shadow hover:cursor-pointer"
                                            disabled={isLoading}
                                        >
                                            <Lock className="h-4 w-4 mr-2" />
                                            {isLoading ? 'Updating...' : 'Update Password'}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Profile;

// Made with Bob