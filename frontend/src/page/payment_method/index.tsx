import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Building2, User, Hash, CheckCircle, XCircle, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getUserPaymentMethods } from '@/service/payment_methods';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

interface PaymentMethodData {
    id: string;
    bank_name: string;
    account_holder_name: string;
    account_type: string;
    ifsc: string;
    account_number: string;
    isVerify: boolean;
    createdAt: string;
    updatedAt: string;
}

const PaymentMethod = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const fetchPaymentMethods = async () => {
        try {
            setLoading(true);
            const response = await getUserPaymentMethods();
            setPaymentMethods(response.data || []);
        } catch (error: any) {
            console.error('Error fetching payment methods:', error);
            // Handle error appropriately - could show error state in UI
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto py-8 px-4 max-w-4xl">
                <div className="flex justify-center items-center h-64">
                    <p className="text-muted-foreground">Loading payment methods...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto py-8 px-4 max-w-4xl">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Payment Methods</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your bank account details
                    </p>
                </div>
                {paymentMethods.length === 0 && (
                    <Button
                        className="border hover:shadow"
                        onClick={() => navigate('new')}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Payment Method
                    </Button>
                )}
            </div>

            <div className="grid gap-6">
                {paymentMethods.map((method) => (
                    <Card key={method.id} className="relative">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        {method.bank_name}
                                    </CardTitle>
                                    <CardDescription>
                                        {method.account_type} Account
                                    </CardDescription>
                                </div>
                                {
                                    user.role === "admin" ?
                                    (
                                        null
                                    ) :
                                    (
                                        <Badge variant={method.isVerify ? "default" : "secondary"}>
                                            {method.isVerify ? (
                                                <>
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Verified
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    Pending
                                                </>
                                            )}
                                        </Badge>
                                    )
                                }
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Account Holder Name */}
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Account Holder Name
                                        </p>
                                        <p className="text-base">{method.account_holder_name}</p>
                                    </div>
                                </div>

                                {/* Account Number */}
                                <div className="flex items-start gap-3">
                                    <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Account Number
                                        </p>
                                        <p className="text-base font-mono">
                                            {method.account_number.replace(/(\d{4})(?=\d)/g, '$1 ')}
                                        </p>
                                    </div>
                                </div>

                                {/* IFSC Code */}
                                <div className="flex items-start gap-3">
                                    <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            IFSC Code
                                        </p>
                                        <p className="text-base font-mono">{method.ifsc}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State (if no payment methods) */}
            {paymentMethods.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            No payment methods found
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            Add your first payment method to get started
                        </p>
                        <Button onClick={() => navigate('new')}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Payment Method
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default PaymentMethod;

// Made with Bob