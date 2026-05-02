import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Building2, Hash, Landmark } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import PageLoader from '@/components/custom/page-loader';
import { createUserPaymentMethod } from '@/service/payment_methods';

interface PaymentMethodFormValues {
    bank_name: string;
    account_holder_name: string;
    account_type: string;
    ifsc: string;
    account_number: string;
}

const CreatePaymentMethod = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const form = useForm<PaymentMethodFormValues>({
        defaultValues: {
            bank_name: '',
            account_holder_name: '',
            account_type: '',
            ifsc: '',
            account_number: '',
        },
    });

    const onSubmit = async (data: PaymentMethodFormValues) => {
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await createUserPaymentMethod({
                bank_name: data.bank_name.trim(),
                account_holder_name: data.account_holder_name.trim(),
                account_type: data.account_type,
                ifsc: data.ifsc.trim().toUpperCase(),
                account_number: data.account_number.trim(),
            });

            setSuccessMessage(response.message || 'Payment method created successfully!');
            setErrorMessage('');

            // Reset form
            form.reset();

            // Navigate back to payment methods list
            setTimeout(() => {
                navigate('/payment-methods');
            }, 1500);
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to create payment method');
            setSuccessMessage('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/payment-methods');
    };

    return (
        <div className="mx-auto py-8 px-4 max-w-2xl">
            <PageLoader isLoading={isLoading} />
            <Card>
                <CardHeader>
                    <CardTitle>Create Payment Method</CardTitle>
                    <CardDescription>
                        Add a new bank account for receiving payments
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Success Message */}
                    {successMessage && (
                        <Alert className="mb-6 bg-green-50 border-green-200">
                            <p className="text-green-800">{successMessage}</p>
                        </Alert>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <Alert className="mb-6 bg-red-50 border-red-200">
                            <p className="text-red-800">{errorMessage}</p>
                        </Alert>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Bank Name Field */}
                            <FormField
                                control={form.control}
                                name="bank_name"
                                rules={{
                                    required: 'Bank name is required',
                                    minLength: {
                                        value: 3,
                                        message: 'Bank name must be at least 3 characters',
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bank Name</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Enter bank name (e.g., State Bank of India)"
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

                            {/* Account Holder Name Field */}
                            <FormField
                                control={form.control}
                                name="account_holder_name"
                                rules={{
                                    required: 'Account holder name is required',
                                    minLength: {
                                        value: 3,
                                        message: 'Account holder name must be at least 3 characters',
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z\s]+$/,
                                        message: 'Account holder name should only contain letters',
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account Holder Name</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Enter account holder name"
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

                            {/* Account Type Field */}
                            <FormField
                                control={form.control}
                                name="account_type"
                                rules={{
                                    required: 'Account type is required',
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={isLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select account type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='bg-white'>
                                                <SelectItem value="Savings">Savings Account</SelectItem>
                                                <SelectItem value="Current">Current Account</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* IFSC Code Field */}
                            <FormField
                                control={form.control}
                                name="ifsc"
                                rules={{
                                    required: 'IFSC code is required',
                                    pattern: {
                                        value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                                        message: 'Invalid IFSC code format (e.g., SBIN0001234)',
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>IFSC Code</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Enter IFSC code (e.g., SBIN0001234)"
                                                    maxLength={11}
                                                    disabled={isLoading}
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value.toUpperCase());
                                                    }}
                                                />
                                                <Landmark className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Account Number Field */}
                            <FormField
                                control={form.control}
                                name="account_number"
                                rules={{
                                    required: 'Account number is required',
                                    pattern: {
                                        value: /^\d{9,18}$/,
                                        message: 'Account number must be 9-18 digits',
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account Number</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Enter account number"
                                                    maxLength={18}
                                                    disabled={isLoading}
                                                    {...field}
                                                    onChange={(e) => {
                                                        // Only allow numbers
                                                        const value = e.target.value.replace(/\D/g, '');
                                                        field.onChange(value);
                                                    }}
                                                />
                                                <Hash className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                                    {isLoading ? 'Creating...' : 'Create Payment Method'}
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

export default CreatePaymentMethod;

// Made with Bob