import { useState, useEffect } from 'react';
import { Eye, ArrowUpDown, Calendar, User, Mail, DollarSign, CreditCard, FileCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

interface Transaction {
    _id: string;
    payer_bank_account_id: string;
    payee_bank_account_id: string;
    payer_name: string;
    payer_email: string;
    payee_name: string;
    payee_email: string;
    invoiceId: string;
    amount: number;
    transaction_date: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

// Mock transaction data
const mockTransactions: Transaction[] = [
    {
        _id: '1',
        payer_bank_account_id: 'BA-2024-001',
        payee_bank_account_id: 'BA-2024-002',
        payer_name: 'John Doe',
        payer_email: 'john.doe@example.com',
        payee_name: 'Acme Corporation',
        payee_email: 'billing@acme.com',
        invoiceId: 'INV-2024-001',
        amount: 1250.00,
        transaction_date: '2024-01-15T10:30:00Z',
        status: 'completed',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:35:00Z',
    },
    {
        _id: '2',
        payer_bank_account_id: 'BA-2024-003',
        payee_bank_account_id: 'BA-2024-004',
        payer_name: 'Jane Smith',
        payer_email: 'jane.smith@example.com',
        payee_name: 'Tech Solutions Inc',
        payee_email: 'payments@techsolutions.com',
        invoiceId: 'INV-2024-002',
        amount: 3500.50,
        transaction_date: '2024-01-16T14:20:00Z',
        status: 'pending',
        createdAt: '2024-01-16T14:20:00Z',
        updatedAt: '2024-01-16T14:20:00Z',
    },
    {
        _id: '3',
        payer_bank_account_id: 'BA-2024-005',
        payee_bank_account_id: 'BA-2024-006',
        payer_name: 'Robert Johnson',
        payer_email: 'robert.j@example.com',
        payee_name: 'Global Services Ltd',
        payee_email: 'finance@globalservices.com',
        invoiceId: 'INV-2024-003',
        amount: 875.25,
        transaction_date: '2024-01-17T09:15:00Z',
        status: 'completed',
        createdAt: '2024-01-17T09:15:00Z',
        updatedAt: '2024-01-17T09:20:00Z',
    },
    {
        _id: '4',
        payer_bank_account_id: 'BA-2024-007',
        payee_bank_account_id: 'BA-2024-008',
        payer_name: 'Emily Davis',
        payer_email: 'emily.davis@example.com',
        payee_name: 'Creative Agency',
        payee_email: 'accounts@creativeagency.com',
        invoiceId: 'INV-2024-004',
        amount: 2100.00,
        transaction_date: '2024-01-18T11:45:00Z',
        status: 'failed',
        createdAt: '2024-01-18T11:45:00Z',
        updatedAt: '2024-01-18T11:50:00Z',
    },
    {
        _id: '5',
        payer_bank_account_id: 'BA-2024-009',
        payee_bank_account_id: 'BA-2024-010',
        payer_name: 'Michael Brown',
        payer_email: 'michael.brown@example.com',
        payee_name: 'Consulting Group',
        payee_email: 'billing@consultinggroup.com',
        invoiceId: 'INV-2024-005',
        amount: 5250.75,
        transaction_date: '2024-01-19T16:30:00Z',
        status: 'completed',
        createdAt: '2024-01-19T16:30:00Z',
        updatedAt: '2024-01-19T16:35:00Z',
    },
    {
        _id: '6',
        payer_bank_account_id: 'BA-2024-011',
        payee_bank_account_id: 'BA-2024-012',
        payer_name: 'Sarah Wilson',
        payer_email: 'sarah.wilson@example.com',
        payee_name: 'Marketing Pro',
        payee_email: 'payments@marketingpro.com',
        invoiceId: 'INV-2024-006',
        amount: 1800.00,
        transaction_date: '2024-01-20T13:00:00Z',
        status: 'pending',
        createdAt: '2024-01-20T13:00:00Z',
        updatedAt: '2024-01-20T13:00:00Z',
    },
    {
        _id: '7',
        payer_bank_account_id: 'BA-2024-013',
        payee_bank_account_id: 'BA-2024-014',
        payer_name: 'David Martinez',
        payer_email: 'david.martinez@example.com',
        payee_name: 'Software Solutions',
        payee_email: 'finance@softwaresolutions.com',
        invoiceId: 'INV-2024-007',
        amount: 4200.50,
        transaction_date: '2024-01-21T10:00:00Z',
        status: 'completed',
        createdAt: '2024-01-21T10:00:00Z',
        updatedAt: '2024-01-21T10:05:00Z',
    },
    {
        _id: '8',
        payer_bank_account_id: 'BA-2024-015',
        payee_bank_account_id: 'BA-2024-016',
        payer_name: 'Lisa Anderson',
        payer_email: 'lisa.anderson@example.com',
        payee_name: 'Design Studio',
        payee_email: 'accounts@designstudio.com',
        invoiceId: 'INV-2024-008',
        amount: 950.00,
        transaction_date: '2024-01-22T15:30:00Z',
        status: 'processing',
        createdAt: '2024-01-22T15:30:00Z',
        updatedAt: '2024-01-22T15:30:00Z',
    },
    {
        _id: '9',
        payer_bank_account_id: 'BA-2024-017',
        payee_bank_account_id: 'BA-2024-018',
        payer_name: 'James Taylor',
        payer_email: 'james.taylor@example.com',
        payee_name: 'Business Advisors',
        payee_email: 'billing@businessadvisors.com',
        invoiceId: 'INV-2024-009',
        amount: 3100.25,
        transaction_date: '2024-01-23T09:45:00Z',
        status: 'completed',
        createdAt: '2024-01-23T09:45:00Z',
        updatedAt: '2024-01-23T09:50:00Z',
    },
    {
        _id: '10',
        payer_bank_account_id: 'BA-2024-019',
        payee_bank_account_id: 'BA-2024-020',
        payer_name: 'Patricia Thomas',
        payer_email: 'patricia.thomas@example.com',
        payee_name: 'Legal Services',
        payee_email: 'payments@legalservices.com',
        invoiceId: 'INV-2024-010',
        amount: 6500.00,
        transaction_date: '2024-01-24T14:15:00Z',
        status: 'pending',
        createdAt: '2024-01-24T14:15:00Z',
        updatedAt: '2024-01-24T14:15:00Z',
    },
];

const Transaction = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages] = useState(1);
    const itemsPerPage = 10;

    // Fetch transactions (using mock data)
    useEffect(() => {
        fetchTransactions();
    }, [page]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Paginate mock data
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedData = mockTransactions.slice(startIndex, endIndex);
            
            setTransactions(paginatedData);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    // View transaction details
    const handleViewTransaction = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsDialogOpen(true);
    };

    // Get status badge variant
    const getStatusVariant = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'processing':
                return 'outline';
            case 'failed':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    // Get status color for visual indication
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'text-green-600';
            case 'pending':
                return 'text-yellow-600';
            case 'processing':
                return 'text-blue-600';
            case 'failed':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Format date with time
    const formatDateTime = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="mx-auto py-8 px-4 max-w-7xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Transactions</h1>
                <p className="text-muted-foreground mt-1">
                    View all your transaction history
                </p>
            </div>

            {loading ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">Loading transactions...</p>
                    </CardContent>
                </Card>
            ) : transactions.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <ArrowUpDown className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                        <p className="text-muted-foreground">
                            You don't have any transactions yet
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Transaction Table - Desktop View */}
                    <Card className="hidden md:block">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50 border-b">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                                Transaction ID
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                                Payer
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                                Payee
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                                Amount
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                                Date
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {transactions.map((transaction) => (
                                            <tr
                                                key={transaction._id}
                                                className="hover:bg-muted/30 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-sm">
                                                        {transaction._id}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium">
                                                            {transaction.payer_name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {transaction.payer_email}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium">
                                                            {transaction.payee_name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {transaction.payee_email}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-semibold">
                                                    {formatCurrency(transaction.amount)}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    {formatDate(transaction.transaction_date)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        variant={getStatusVariant(transaction.status)}
                                                    >
                                                        {transaction.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewTransaction(transaction)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transaction Cards - Mobile View */}
                    <div className="md:hidden space-y-4">
                        {transactions.map((transaction) => (
                            <Card key={transaction._id} className="overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <p className="font-mono text-xs text-muted-foreground mb-1">
                                                ID: {transaction._id}
                                            </p>
                                            <p className="text-xl font-bold">
                                                {formatCurrency(transaction.amount)}
                                            </p>
                                        </div>
                                        <Badge variant={getStatusVariant(transaction.status)}>
                                            {transaction.status}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 mb-3">
                                        <div className="flex items-start gap-2">
                                            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-muted-foreground">Payer</p>
                                                <p className="text-sm font-medium truncate">
                                                    {transaction.payer_name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-muted-foreground">Payee</p>
                                                <p className="text-sm font-medium truncate">
                                                    {transaction.payee_name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-xs text-muted-foreground">Date</p>
                                                <p className="text-sm">
                                                    {formatDate(transaction.transaction_date)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => handleViewTransaction(transaction)}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex justify-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <div className="flex items-center px-4">
                                <span className="text-sm text-muted-foreground">
                                    Page {page} of {totalPages}
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* View Transaction Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileCheck className="h-5 w-5" />
                            Transaction Details
                        </DialogTitle>
                        <DialogDescription>
                            Complete information about this transaction
                        </DialogDescription>
                    </DialogHeader>

                    {selectedTransaction && (
                        <div className="space-y-6 mt-4">
                            {/* Transaction Header */}
                            <div className="flex justify-between items-start pb-4 border-b">
                                <div>
                                    <h3 className="text-lg font-semibold text-muted-foreground mb-1">
                                        Transaction ID
                                    </h3>
                                    <p className="font-mono text-xl font-bold">
                                        {selectedTransaction._id}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Amount
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {formatCurrency(selectedTransaction.amount)}
                                    </p>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Transaction Status
                                </p>
                                <Badge
                                    variant={getStatusVariant(selectedTransaction.status)}
                                    className="text-sm px-3 py-1"
                                >
                                    {selectedTransaction.status}
                                </Badge>
                            </div>

                            {/* Payer Information */}
                            <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Payer Information
                                </h4>
                                <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Name
                                            </p>
                                            <p className="text-base">
                                                {selectedTransaction.payer_name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Email
                                            </p>
                                            <p className="text-base">
                                                {selectedTransaction.payer_email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Bank Account ID
                                            </p>
                                            <p className="text-base font-mono">
                                                {selectedTransaction.payer_bank_account_id}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payee Information */}
                            <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Payee Information
                                </h4>
                                <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Name
                                            </p>
                                            <p className="text-base">
                                                {selectedTransaction.payee_name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Email
                                            </p>
                                            <p className="text-base">
                                                {selectedTransaction.payee_email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Bank Account ID
                                            </p>
                                            <p className="text-base font-mono">
                                                {selectedTransaction.payee_bank_account_id}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Details */}
                            <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    Transaction Details
                                </h4>
                                <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Amount
                                            </p>
                                            <p className="text-base font-semibold">
                                                {formatCurrency(selectedTransaction.amount)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <FileCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Invoice ID
                                            </p>
                                            <p className="text-base font-mono">
                                                {selectedTransaction.invoiceId}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Transaction Date
                                            </p>
                                            <p className="text-base">
                                                {formatDateTime(selectedTransaction.transaction_date)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timestamps */}
                            <div className="pt-4 border-t text-sm text-muted-foreground space-y-1">
                                <p>
                                    Created: {formatDateTime(selectedTransaction.createdAt)}
                                </p>
                                <p>
                                    Last Updated: {formatDateTime(selectedTransaction.updatedAt)}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Transaction;

// Made with Bob