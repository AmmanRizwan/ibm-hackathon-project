import { useState, useEffect } from 'react';
import { getAllVerifiedEmployees } from '@/service/user';
import { createTransaction } from '@/service/transaction';
import { adminCreateInvoice } from '@/service/invoice';
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
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Loader2, DollarSign, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
            
            // Fetch verified employees from API
            const response = await getAllVerifiedEmployees();
            
            // Filter employees who have both verified billing details and payment methods
            const fullyVerifiedEmployees = response.data.filter((employee: IVerifiedEmployee) => {
                const hasBillingDetails = employee.billingDetails &&
                    employee.billingDetails.length > 0 &&
                    employee.billingDetails.some(bd => bd.isVerify);
                
                const hasPaymentMethods = employee.paymentMethods &&
                    employee.paymentMethods.length > 0 &&
                    employee.paymentMethods.some(pm => pm.isVerify);
                
                return employee.isVerify && hasBillingDetails && hasPaymentMethods;
            });
            
            setEmployees(fullyVerifiedEmployees);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch verified employees');
            console.error('Error fetching verified employees:', err);
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
            const amount = parseFloat(fixedAmount);
            let successCount = 0;
            let failedCount = 0;
            const failedEmployees: string[] = [];

            // Process payment for each employee
            for (const employee of employees) {
                try {
                    const paymentMethod = getPaymentMethod(employee.paymentMethods);
                    
                    if (!paymentMethod) {
                        console.error(`No payment method found for ${employee.name}`);
                        failedCount++;
                        failedEmployees.push(`${employee.name} (No payment method)`);
                        continue;
                    }

                    if (!paymentMethod.id) {
                        console.error(`Invalid payment method ID for ${employee.name}`);
                        failedCount++;
                        failedEmployees.push(`${employee.name} (Invalid payment method)`);
                        continue;
                    }

                    // Generate unique invoice number
                    const invoiceNumber = `INV-${Date.now()}-${employee.id.substring(0, 8)}`;
                    
                    // Step 1: Create invoice for the employee using admin endpoint
                    const invoiceResponse = await adminCreateInvoice({
                        invoice_number: invoiceNumber,
                        invoice_date: new Date().toISOString(),
                        customer_name: employee.name,
                        customer_email: employee.email,
                        customer_phone: employee.phone,
                        total_amount: amount,
                        payment_status: 'paid',
                        notes: `Bulk payment processed on ${new Date().toLocaleDateString()}`,
                        status: 'paid',
                        userId: employee.id
                    });

                    // Validate invoice response
                    if (!invoiceResponse?.data?.id && !invoiceResponse?.data?._id) {
                        console.error(`Failed to create invoice for ${employee.name}: Invalid response`);
                        failedCount++;
                        failedEmployees.push(`${employee.name} (Invoice creation failed)`);
                        continue;
                    }

                    const invoiceId = invoiceResponse.data.id || invoiceResponse.data._id;

                    // Step 2: Create transaction for each employee using the invoice ID
                    await createTransaction({
                        payee_bank_account_id: paymentMethod.id,
                        payer_name: 'Admin',
                        payer_email: 'admin@company.com',
                        payee_name: employee.name,
                        payee_email: employee.email,
                        invoiceId: invoiceId,
                        amount: amount,
                        transaction_date: new Date().toISOString(),
                        status: 'completed'
                    });

                    successCount++;
                } catch (err: any) {
                    const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
                    console.error(`Failed to process payment for ${employee.name}:`, errorMessage, err);
                    failedCount++;
                    failedEmployees.push(`${employee.name} (${errorMessage})`);
                }
            }

            // Show success/failure message
            if (successCount > 0 && failedCount === 0) {
                setSuccessMessage(
                    `Successfully processed payments of ₹${fixedAmount} to ${successCount} employee(s). Invoices and transactions created.`
                );
            } else if (successCount > 0 && failedCount > 0) {
                setSuccessMessage(
                    `Processed ${successCount} payment(s) successfully. ${failedCount} failed: ${failedEmployees.join(', ')}`
                );
            } else {
                setError('Failed to process any payments. Please try again.');
            }

            setPaymentDialogOpen(false);

            // Refresh employee list
            await fetchVerifiedEmployees();

            // Clear success message after 8 seconds
            setTimeout(() => setSuccessMessage(null), 8000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to process payments');
            console.error('Error processing bulk payments:', err);
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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Bank Account</TableHead>
                                    <TableHead>IFSC Code</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.map((employee) => {
                                    const paymentMethod = getPaymentMethod(employee.paymentMethods);
                                    return (
                                        <TableRow key={employee.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{employee.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {employee.email}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
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
                                            </TableCell>
                                            <TableCell>
                                                {paymentMethod ? paymentMethod.ifsc : 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {formatAddress(employee.billingDetails)}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                ₹{fixedAmount}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={4} className="text-right font-semibold">
                                        Total Amount:
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-lg">
                                        ₹{(parseFloat(fixedAmount) * employees.length).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
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