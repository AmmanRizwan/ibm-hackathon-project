import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MapPin, Building2, Map, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageLoader from '@/components/custom/page-loader';
import { createUserBillingDetail } from '@/service/billing_details';
import { useToast } from '@/components/ui/use-toast';

interface BillingDetailFormValues {
    address: string;
    pin: string;
    city: string;
    state: string;
}

const CreateBillingDetail = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<BillingDetailFormValues>({
        defaultValues: {
            address: '',
            pin: '',
            city: '',
            state: '',
        },
    });

    const onSubmit = async (data: BillingDetailFormValues) => {
        setIsLoading(true);

        try {
            const response = await createUserBillingDetail({
                address: data.address.trim(),
                pin: data.pin.trim(),
                city: data.city.trim(),
                state: data.state.trim(),
            });

            toast({
                title: "Success",
                description: response.message || 'Billing detail created successfully!',
            });

            // Reset form
            form.reset();

            // Navigate back to billing details list
            setTimeout(() => {
                navigate('/user/billing_detail');
            }, 1500);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || 'Failed to create billing detail',
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/user/billing_detail');
    };

    return (
        <div className="mx-auto py-8 px-4 max-w-2xl">
            <PageLoader isLoading={isLoading} />
            <Card>
                <CardHeader>
                    <CardTitle>Create Billing Detail</CardTitle>
                    <CardDescription>
                        Add a new billing address for your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Address Field */}
                            <FormField
                                control={form.control}
                                name="address"
                                rules={{
                                    required: 'Address is required',
                                    minLength: {
                                        value: 10,
                                        message: 'Address must be at least 10 characters',
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Enter your complete address"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* PIN Code Field */}
                            <FormField
                                control={form.control}
                                name="pin"
                                rules={{
                                    required: 'PIN code is required',
                                    pattern: {
                                        value: /^\d{6}$/,
                                        message: 'PIN code must be 6 digits',
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>PIN Code</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Enter 6-digit PIN code"
                                                    maxLength={6}
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                                <Navigation className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* City Field */}
                            <FormField
                                control={form.control}
                                name="city"
                                rules={{
                                    required: 'City is required',
                                    minLength: {
                                        value: 2,
                                        message: 'City must be at least 2 characters',
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Enter your city"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                                <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* State Field */}
                            <FormField
                                control={form.control}
                                name="state"
                                rules={{
                                    required: 'State is required',
                                    minLength: {
                                        value: 2,
                                        message: 'State must be at least 2 characters',
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Enter your state"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                                <Map className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                                    className="flex-1 border hover:shadow"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Creating...' : 'Create Billing Detail'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateBillingDetail;

// Made with Bob