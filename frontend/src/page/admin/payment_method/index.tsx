import { useState, useEffect } from 'react';
// import { getAllVerifiedEmployees } from '@/service/user';
import type { IVerifiedEmployee } from '@/service/user/interface';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, DollarSign, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock data for verified employees
const mockEmployees: IVerifiedEmployee[] = [
    {
        id: '1',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@company.com',
        phone: '+91-9876543210',
        role: 'employee',
        isVerify: true,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T14:45:00Z',
        billingDetails: [
            {
                id: 'bd1',
                address: '123 MG Road',
                pin: '560001',
                city: 'Bangalore',
                state: 'Karnataka',
                isVerify: true,
            },
        ],
        paymentMethods: [
            {
                id: 'pm1',
                bank_name: 'State Bank of India',
                account_holder_name: 'Rajesh Kumar',
                account_number: '1234567890',
                ifsc: 'SBIN0001234',
                account_type: 'Savings',
                isVerify: true,
            },
        ],
    },
    {
        id: '2',
        name: 'Priya Sharma',
        email: 'priya.sharma@company.com',
        phone: '+91-9876543211',
        role: 'employee',
        isVerify: true,
        createdAt: '2024-02-10T09:15:00Z',
        updatedAt: '2024-02-15T11:30:00Z',
        billingDetails: [
            {
                id: 'bd2',
                address: '456 Park Street',
                pin: '700016',
                city: 'Kolkata',
                state: 'West Bengal',
                isVerify: true,
            },
        ],
        paymentMethods: [
            {
                id: 'pm2',
                bank_name: 'HDFC Bank',
                account_holder_name: 'Priya Sharma',
                account_number: '9876543210',
                ifsc: 'HDFC0001234',
                account_type: 'Savings',
                isVerify: true,
            },
        ],
    },
    {
        id: '3',
        name: 'Amit Patel',
        email: 'amit.patel@company.com',
        phone: '+91-9876543212',
        role: 'employee',
        isVerify: true,
        createdAt: '2024-03-05T08:00:00Z',
        updatedAt: '2024-03-10T16:20:00Z',
        billingDetails: [
            {
                id: 'bd3',
                address: '789 CG Road',
                pin: '380009',
                city: 'Ahmedabad',
                state: 'Gujarat',
                isVerify: true,
            },
        ],
        paymentMethods: [
            {
                id: 'pm3',
                bank_name: 'ICICI Bank',
                account_holder_name: 'Amit Patel',
                account_number: '5555666677',
                ifsc: 'ICIC0001234',
                account_type: 'Current',
                isVerify: true,
            },
        ],
    },
    {
        id: '4',
        name: 'Sneha Reddy',
        email: 'sneha.reddy@company.com',
        phone: '+91-9876543213',
        role: 'employee',
        isVerify: true,
        createdAt: '2024-04-01T07:30:00Z',
        updatedAt: '2024-04-05T13:45:00Z',
        billingDetails: [
            {
                id: 'bd4',
                address: '321 Banjara Hills',
                pin: '500034',
                city: 'Hyderabad',
                state: 'Telangana',
                isVerify: true,
            },
        ],
        paymentMethods: [
            {
                id: 'pm4',
                bank_name: 'Axis Bank',
                account_holder_name: 'Sneha Reddy',
                account_number: '1111222233',
                ifsc: 'UTIB0001234',
                account_type: 'Savings',
                isVerify: true,
            },
        ],
    },
    {
        id: '5',
        name: 'Vikram Singh',
        email: 'vikram.singh@company.com',
        phone: '+91-9876543214',
        role: 'employee',
        isVerify: true,
        createdAt: '2024-05-01T10:00:00Z',
        updatedAt: '2024-05-02T12:00:00Z',
        billingDetails: [
            {
                id: 'bd5',
                address: '654 Connaught Place',
                pin: '110001',
                city: 'New Delhi',
                state: 'Delhi',
                isVerify: true,
            },
        ],
        paymentMethods: [
            {
                id: 'pm5',
                bank_name: 'Punjab National Bank',
                account_holder_name: 'Vikram Singh',
                account_number: '9999888877',
                ifsc: 'PUNB0001234',
                account_type: 'Savings',
                isVerify: true,
            },
        ],
    },
];

const AdminPaymentMethod = () => {
    const [employees, setEmployees] = useState<IVerifiedEmployee[]>([]);
    const [loading, setLoading] = useState(true);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [fixedAmount, setFixedAmount] = useState<string>('5000');

    // Fetch verified employees on component mount
    useEffect(() => {
        fetchVerifiedEmployees();
    }, []);

    const fetchVerifiedEmployees = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Use mock data instead of API call
            setEmployees(mockEmployees);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch verified employees');
        } finally {
            setLoading(false);
        }
    };

    // Handle pay all employees
    const handlePayAll = async () => {
        if (!fixedAmount || parseFloat(fixedAmount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            // Simulate payment processing
            // In a real application, this would call a backend API to process payments
            await new Promise(resolve => setTimeout(resolve, 2000));

            setSuccessMessage(
                `Successfully processed payments of ₹${fixedAmount} to ${employees.length} employee(s)`
            );
            setPaymentDialogOpen(false);

            // Clear success message after 5 seconds
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to process payments');
        } finally {
            setProcessing(false);
        }
    };

    // Open payment confirmation dialog
    const openPaymentDialog = () => {
        if (employees.length === 0) {
            setError('No verified employees available for payment');
            return;
        }
        setPaymentDialogOpen(true);
    };

    // Format address
    const formatAddress = (billingDetails: any[]) => {
        if (!billingDetails || billingDetails.length === 0) return 'N/A';
        const detail = billingDetails[0];
        return `${detail.address}, ${detail.city}, ${detail.state} - ${detail.pin}`;
    };

    // Get payment method details
    const getPaymentMethod = (paymentMethods: any[]) => {
        if (!paymentMethods || paymentMethods.length === 0) return null;
        return paymentMethods[0];
    };

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Success Message */}
            {successMessage && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    {successMessage}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Employee Payment Management</CardTitle>
                            <CardDescription>
                                Process payments for all verified employees with verified billing and bank details
                            </CardDescription>
                        </div>
                        <Button
                            onClick={openPaymentDialog}
                            disabled={loading || employees.length === 0}
                            size="lg"
                            className='bg-green-300 hover:bg-green-400'
                        >
                            <DollarSign className="h-5 w-5 mr-1" />
                            Pay All Employees
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : employees.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No verified employees found with complete billing and bank details
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="text-left p-4 font-semibold">Name</th>
                                        <th className="text-left p-4 font-semibold">Bank Account</th>
                                        <th className="text-left p-4 font-semibold">IFSC Code</th>
                                        <th className="text-left p-4 font-semibold">Address</th>
                                        <th className="text-right p-4 font-semibold">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((employee) => {
                                        const paymentMethod = getPaymentMethod(employee.paymentMethods);
                                        return (
                                            <tr
                                                key={employee.id}
                                                className="border-b hover:bg-muted/30 transition-colors"
                                            >
                                                <td className="p-4">
                                                    <div>
                                                        <div className="font-medium">{employee.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {employee.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {paymentMethod ? (
                                                        <div>
                                                            <div className="font-medium">
                                                                {paymentMethod.account_number}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {paymentMethod.account_holder_name}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {paymentMethod.bank_name}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    {paymentMethod ? paymentMethod.ifsc : 'N/A'}
                                                </td>
                                                <td className="p-4 text-sm">
                                                    {formatAddress(employee.billingDetails)}
                                                </td>
                                                <td className="p-4 text-right font-semibold">
                                                    ₹{fixedAmount}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 bg-muted/30">
                                        <td colSpan={4} className="p-4 text-right font-semibold">
                                            Total Amount:
                                        </td>
                                        <td className="p-4 text-right font-bold text-lg">
                                            ₹{(parseFloat(fixedAmount) * employees.length).toLocaleString()}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Payment Confirmation Dialog */}
            <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Payment</DialogTitle>
                        <DialogDescription>
                            You are about to process payments for all verified employees
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Fixed Amount per Employee (₹)</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={fixedAmount}
                                onChange={(e) => setFixedAmount(e.target.value)}
                                placeholder="Enter amount"
                                min="0"
                                step="100"
                            />
                        </div>
                        <div className="bg-muted p-4 rounded-md space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm font-medium">Number of Employees:</span>
                                <span className="text-sm font-semibold">{employees.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm font-medium">Amount per Employee:</span>
                                <span className="text-sm font-semibold">₹{fixedAmount}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                                <span className="font-semibold">Total Amount:</span>
                                <span className="font-bold text-lg">
                                    ₹{(parseFloat(fixedAmount || '0') * employees.length).toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            This will process payments to all {employees.length} verified employee(s) with
                            verified billing and bank details.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setPaymentDialogOpen(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button className='w-full border border-1 mb-2 hover:shadow hover:cursor-pointer' onClick={handlePayAll} disabled={processing}>
                            {processing ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Confirm Payment
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPaymentMethod;

// Made with Bob