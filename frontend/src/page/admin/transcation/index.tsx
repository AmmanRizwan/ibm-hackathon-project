import { useEffect, useState } from 'react';
import { getAllTransactions } from '@/service/transaction';
import type { ITransaction } from '@/service/transaction/interface';
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
import { Calendar, ArrowRight, DollarSign, RefreshCw } from 'lucide-react';

interface GroupedTransactions {
    [key: string]: ITransaction[];
}

const AdminTransaction = () => {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllTransactions({ limit: 1000 });
            // Backend returns transactions in response.data.transactions with pagination
            if (response.success && response.data) {
                setTransactions(response.data.transactions || []);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch transactions');
        } finally {
            setLoading(false);
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
                                {formatCurrency(transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0))}
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
                        (sum, t) => sum + (Number(t.amount) || 0),
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
                                        <Card key={transaction.id} className="overflow-hidden hover:shadow-md transition-shadow">
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
                                                                <span className="font-mono">{transaction.id.slice(-8)}</span>
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
