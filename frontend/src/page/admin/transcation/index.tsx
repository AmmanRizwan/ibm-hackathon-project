import { useEffect, useState } from 'react';
import { getAllTransactions, createTransaction } from '@/service/transaction';
import type { ITransaction, ICreateTransaction } from '@/service/transaction/interface';
import { getAllInvoices } from '@/service/invoice';
import { getAllPaymentMethods } from '@/service/payment_methods';
import { getAllUsers } from '@/service/user';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, DollarSign, RefreshCw, Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface GroupedTransactions {
    [key: string]: ITransaction[];
}

const AdminTransaction = () => {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form data
    const [invoices, setInvoices] = useState<any[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [formData, setFormData] = useState<ICreateTransaction>({
        payer_bank_account_id: '',
        payee_bank_account_id: '',
        payer_name: '',
        payer_email: '',
        payee_name: '',
        payee_email: '',
        invoiceId: '',
        amount: 0,
        status: 'pending',
    });

    useEffect(() => {
        fetchTransactions();
        fetchFormData();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllTransactions({ limit: 1000 });
            setTransactions(response.data.transactions || []);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    const fetchFormData = async () => {
        try {
            const [invoicesRes, paymentMethodsRes, usersRes] = await Promise.all([
                getAllInvoices({ limit: 1000 }),
                getAllPaymentMethods({ limit: 1000 }),
                getAllUsers(),
            ]);
            setInvoices(invoicesRes.data.invoices || []);
            setPaymentMethods(paymentMethodsRes.data.paymentMethods || []);
            setUsers(usersRes.data || []);
        } catch (err: any) {
            console.error('Failed to fetch form data:', err);
        }
    };

    const handleInputChange = (field: keyof ICreateTransaction, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleUserSelect = (userId: string, type: 'payer' | 'payee') => {
        const user = users.find(u => u.id === userId);
        if (user) {
            if (type === 'payer') {
                setFormData(prev => ({
                    ...prev,
                    payer_name: user.name,
                    payer_email: user.email,
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    payee_name: user.name,
                    payee_email: user.email,
                }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Prepare data, converting empty strings to undefined for optional fields
            const submitData = {
                ...formData,
                payer_bank_account_id: formData.payer_bank_account_id || undefined,
            };
            await createTransaction(submitData);
            setIsDialogOpen(false);
            setFormData({
                payer_bank_account_id: '',
                payee_bank_account_id: '',
                payer_name: '',
                payer_email: '',
                payee_name: '',
                payee_email: '',
                invoiceId: '',
                amount: 0,
                status: 'pending',
            });
            fetchTransactions();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to create transaction');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Group transactions by month
    const groupTransactionsByMonth = (transactions: ITransaction[]): GroupedTransactions => {
        return transactions.reduce((acc: GroupedTransactions, transaction) => {
            const date = new Date(transaction.transaction_date);
            const monthYear = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
            });
            
            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(transaction);
            return acc;
        }, {});
    };

    // Sort months in descending order (most recent first)
    const getSortedMonths = (groupedTransactions: GroupedTransactions): string[] => {
        return Object.keys(groupedTransactions).sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateB.getTime() - dateA.getTime();
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'success':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'failed':
            case 'cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading transactions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-destructive">Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>No Transactions</CardTitle>
                        <CardDescription>
                            There are no transactions to display at this time.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    const groupedTransactions = groupTransactionsByMonth(transactions);
    const sortedMonths = getSortedMonths(groupedTransactions);

    return (
        <div className="container mx-auto py-6 px-4 max-w-7xl">
            <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">All Transactions</h1>
                        <p className="text-muted-foreground mt-2">
                            View and manage all transactions grouped by month
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create Transaction
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Create New Transaction</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details to create a new transaction
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Invoice Selection */}
                                        <div className="space-y-2">
                                            <Label htmlFor="invoiceId">Invoice *</Label>
                                            <Select
                                                value={formData.invoiceId}
                                                onValueChange={(value) => handleInputChange('invoiceId', value)}
                                                required
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select invoice" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {invoices.map((invoice) => (
                                                        <SelectItem key={invoice.id} value={invoice.id}>
                                                            {invoice.invoice_number} - ${invoice.total_amount}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Amount */}
                                        <div className="space-y-2">
                                            <Label htmlFor="amount">Amount *</Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                value={formData.amount}
                                                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
                                                required
                                            />
                                        </div>

                                        {/* Status */}
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <Select
                                                value={formData.status}
                                                onValueChange={(value) => handleInputChange('status', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="completed">Completed</SelectItem>
                                                    <SelectItem value="failed">Failed</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Payee Bank Account */}
                                        <div className="space-y-2">
                                            <Label htmlFor="payee_bank_account_id">Payee Bank Account *</Label>
                                            <Select
                                                value={formData.payee_bank_account_id}
                                                onValueChange={(value) => handleInputChange('payee_bank_account_id', value)}
                                                required
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select payee account" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {paymentMethods.map((pm) => (
                                                        <SelectItem key={pm.id} value={pm.id}>
                                                            {pm.account_holder_name} - {pm.account_number}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Payer Bank Account (Optional) */}
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="payer_bank_account_id">Payer Bank Account (Optional)</Label>
                                            <Select
                                                value={formData.payer_bank_account_id}
                                                onValueChange={(value) => handleInputChange('payer_bank_account_id', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select payer account" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">None</SelectItem>
                                                    {paymentMethods.map((pm) => (
                                                        <SelectItem key={pm.id} value={pm.id}>
                                                            {pm.account_holder_name} - {pm.account_number}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Payer Information */}
                                    <div className="space-y-2">
                                        <Label>Payer Information</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="payer_user">Select User (Optional)</Label>
                                                <Select
                                                    onValueChange={(value) => handleUserSelect(value, 'payer')}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select user to autofill" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {users.map((user) => (
                                                            <SelectItem key={user.id} value={user.id}>
                                                                {user.name} ({user.email})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="payer_name">Payer Name *</Label>
                                                <Input
                                                    id="payer_name"
                                                    value={formData.payer_name}
                                                    onChange={(e) => handleInputChange('payer_name', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="payer_email">Payer Email *</Label>
                                                <Input
                                                    id="payer_email"
                                                    type="email"
                                                    value={formData.payer_email}
                                                    onChange={(e) => handleInputChange('payer_email', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payee Information */}
                                    <div className="space-y-2">
                                        <Label>Payee Information</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="payee_user">Select User (Optional)</Label>
                                                <Select
                                                    onValueChange={(value) => handleUserSelect(value, 'payee')}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select user to autofill" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {users.map((user) => (
                                                            <SelectItem key={user.id} value={user.id}>
                                                                {user.name} ({user.email})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="payee_name">Payee Name *</Label>
                                                <Input
                                                    id="payee_name"
                                                    value={formData.payee_name}
                                                    onChange={(e) => handleInputChange('payee_name', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="payee_email">Payee Email *</Label>
                                                <Input
                                                    id="payee_email"
                                                    type="email"
                                                    value={formData.payee_email}
                                                    onChange={(e) => handleInputChange('payee_email', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsDialogOpen(false)}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? 'Creating...' : 'Create Transaction'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchTransactions}
                            className="gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Transactions</CardDescription>
                            <CardTitle className="text-2xl">{transactions.length}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Amount</CardDescription>
                            <CardTitle className="text-2xl">
                                {formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0))}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Completed</CardDescription>
                            <CardTitle className="text-2xl text-green-600">
                                {transactions.filter(t => t.status.toLowerCase() === 'completed').length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Pending</CardDescription>
                            <CardTitle className="text-2xl text-yellow-600">
                                {transactions.filter(t => t.status.toLowerCase() === 'pending').length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            </div>

            <Accordion type="multiple" className="w-full space-y-4">
                {sortedMonths.map((month) => {
                    const monthTransactions = groupedTransactions[month];
                    const totalAmount = monthTransactions.reduce(
                        (sum, t) => sum + t.amount,
                        0
                    );

                    return (
                        <AccordionItem
                            key={month}
                            value={month}
                            className="border rounded-lg px-4 bg-card"
                        >
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full pr-4 gap-2">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                                        <div className="text-left">
                                            <h3 className="text-base sm:text-lg font-semibold">{month}</h3>
                                            <p className="text-xs sm:text-sm text-muted-foreground">
                                                {monthTransactions.length} transaction
                                                {monthTransactions.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:ml-auto">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-semibold text-sm sm:text-base">
                                            {formatCurrency(totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-3 pt-4">
                                    {monthTransactions.map((transaction) => (
                                        <Card key={transaction._id} className="overflow-hidden hover:shadow-md transition-shadow">
                                            <CardContent className="p-4 sm:p-6">
                                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                                    <div className="flex-1 space-y-3">
                                                        {/* Status and Date */}
                                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                                            <Badge
                                                                variant={getStatusVariant(transaction.status)}
                                                                className="capitalize"
                                                            >
                                                                {transaction.status}
                                                            </Badge>
                                                            <span className="text-xs sm:text-sm text-muted-foreground">
                                                                {formatDate(transaction.transaction_date)}
                                                            </span>
                                                        </div>
                                                        
                                                        {/* Payer and Payee Info */}
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 text-sm">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-sm sm:text-base truncate">
                                                                    {transaction.payer_name}
                                                                </p>
                                                                <p className="text-muted-foreground text-xs truncate">
                                                                    {transaction.payer_email}
                                                                </p>
                                                            </div>
                                                            <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 hidden sm:block" />
                                                            <div className="flex items-center gap-2 sm:hidden">
                                                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                                                <span className="text-xs text-muted-foreground">to</span>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-sm sm:text-base truncate">
                                                                    {transaction.payee_name}
                                                                </p>
                                                                <p className="text-muted-foreground text-xs truncate">
                                                                    {transaction.payee_email}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Transaction Details */}
                                                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground pt-2 border-t">
                                                            <span className="flex items-center gap-1">
                                                                <span className="font-medium">Invoice:</span>
                                                                <span className="font-mono">{transaction.invoiceId}</span>
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <span className="font-medium">ID:</span>
                                                                <span className="font-mono">{transaction._id.slice(-8)}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Amount */}
                                                    <div className="text-left lg:text-right lg:pl-4 border-t lg:border-t-0 lg:border-l pt-3 lg:pt-0">
                                                        <p className="text-xs text-muted-foreground mb-1">Amount</p>
                                                        <p className="text-xl sm:text-2xl font-bold text-primary">
                                                            {formatCurrency(transaction.amount)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
};

export default AdminTransaction;

// Made with Bob
