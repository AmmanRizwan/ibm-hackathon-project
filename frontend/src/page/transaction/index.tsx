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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { getUserTransactions } from '@/service/transaction';
import type { ITransaction } from '@/service/transaction/interface';
import { useToast } from '@/components/ui/use-toast';

interface Transaction extends ITransaction {}

const Transaction = () => {
    const { toast } = useToast();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const itemsPerPage = 10;

    // Fetch transactions from server
    useEffect(() => {
        fetchTransactions();
    }, [page]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch real data from server
            const response = await getUserTransactions({
                page,
                limit: itemsPerPage,
            });
            
            if (response.success && response.data) {
                setTransactions(response.data.transactions);
                setTotalPages(response.data.pagination.totalPages);
            }
        } catch (error: any) {
            console.error('Error fetching transactions:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to load transactions. Please try again later.';
            setError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
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
            ) : error ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <div className="text-destructive mb-4">
                            <ArrowUpDown className="h-12 w-12 mx-auto mb-2" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Error Loading Transactions</h3>
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <Button onClick={fetchTransactions} variant="outline">
                            Try Again
                        </Button>
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
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Transaction ID</TableHead>
                                        <TableHead>Payer</TableHead>
                                        <TableHead>Payee</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>
                                                <span className="font-mono text-sm">
                                                    {transaction.id}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">
                                                        {transaction.payer_name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {transaction.payer_email}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">
                                                        {transaction.payee_name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {transaction.payee_email}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {formatCurrency(transaction.amount)}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {formatDate(transaction.transaction_date)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={getStatusVariant(transaction.status)}
                                                >
                                                    {transaction.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewTransaction(transaction)}
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Transaction Cards - Mobile View */}
                    <div className="md:hidden space-y-4">
                        {transactions.map((transaction) => (
                            <Card key={transaction.id} className="overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <p className="font-mono text-xs text-muted-foreground mb-1">
                                                ID: {transaction.id}
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
                                        {selectedTransaction.id}
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