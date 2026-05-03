import { useState, useEffect } from 'react';
import { Eye, FileText, Calendar, User, Mail, Phone, DollarSign, FileCheck } from 'lucide-react';
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
import { getUserInvoices, getInvoiceById } from '@/service/invoice';

interface Invoice {
    id: string;
    invoice_number: string;
    invoice_date: string;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    total_amount: number;
    payment_status: string;
    status: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

const Invoice = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch invoices
    useEffect(() => {
        fetchInvoices();
    }, [page]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await getUserInvoices({ page, limit: 10 });
            setInvoices(response.data || []);
            setTotalPages(response.pagination?.totalPages || 1);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    // View invoice details
    const handleViewInvoice = async (invoiceId: string) => {
        try {
            const response = await getInvoiceById(invoiceId);
            if (response.data) {
                setSelectedInvoice(response.data);
                setIsDialogOpen(true);
            }
        } catch (error) {
            console.error('Error fetching invoice details:', error);
        }
    };

    // Get payment status badge variant
    const getPaymentStatusVariant = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'overdue':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    // Get status badge variant
    const getStatusVariant = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'default';
            case 'draft':
                return 'secondary';
            case 'cancelled':
                return 'destructive';
            default:
                return 'outline';
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
                <h1 className="text-3xl font-bold">Invoices</h1>
                <p className="text-muted-foreground mt-1">
                    View and manage your invoices
                </p>
            </div>

            {loading ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">Loading invoices...</p>
                    </CardContent>
                </Card>
            ) : invoices.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
                        <p className="text-muted-foreground">
                            You don't have any invoices yet
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Invoice Table */}
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invoice #</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Payment Status</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.map((invoice) => (
                                        <TableRow key={invoice.id}>
                                            <TableCell>
                                                <span className="font-medium">
                                                    {invoice.invoice_number}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">
                                                        {invoice.customer_name}
                                                    </p>
                                                    {invoice.customer_email && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {invoice.customer_email}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {formatDate(invoice.invoice_date)}
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {formatCurrency(invoice.total_amount)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={getPaymentStatusVariant(
                                                        invoice.payment_status
                                                    )}
                                                >
                                                    {invoice.payment_status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={getStatusVariant(invoice.status)}
                                                >
                                                    {invoice.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewInvoice(invoice.id)}
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

            {/* View Invoice Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileCheck className="h-5 w-5" />
                            Invoice Details
                        </DialogTitle>
                        <DialogDescription>
                            Complete information about this invoice
                        </DialogDescription>
                    </DialogHeader>

                    {selectedInvoice && (
                        <div className="space-y-6 mt-4">
                            {/* Invoice Header */}
                            <div className="flex justify-between items-start pb-4 border-b">
                                <div>
                                    <h3 className="text-2xl font-bold">
                                        {selectedInvoice.invoice_number}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Invoice Date: {formatDate(selectedInvoice.invoice_date)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Total Amount
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {formatCurrency(selectedInvoice.total_amount)}
                                    </p>
                                </div>
                            </div>

                            {/* Status Badges */}
                            <div className="flex gap-3">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Payment Status
                                    </p>
                                    <Badge
                                        variant={getPaymentStatusVariant(
                                            selectedInvoice.payment_status
                                        )}
                                        className="text-sm px-3 py-1"
                                    >
                                        {selectedInvoice.payment_status}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Invoice Status
                                    </p>
                                    <Badge
                                        variant={getStatusVariant(selectedInvoice.status)}
                                        className="text-sm px-3 py-1"
                                    >
                                        {selectedInvoice.status}
                                    </Badge>
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Customer Information
                                </h4>
                                <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Name
                                            </p>
                                            <p className="text-base">
                                                {selectedInvoice.customer_name}
                                            </p>
                                        </div>
                                    </div>

                                    {selectedInvoice.customer_email && (
                                        <div className="flex items-start gap-3">
                                            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Email
                                                </p>
                                                <p className="text-base">
                                                    {selectedInvoice.customer_email}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedInvoice.customer_phone && (
                                        <div className="flex items-start gap-3">
                                            <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Phone
                                                </p>
                                                <p className="text-base">
                                                    {selectedInvoice.customer_phone}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Additional Details
                                </h4>
                                <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Invoice Date
                                            </p>
                                            <p className="text-base">
                                                {formatDate(selectedInvoice.invoice_date)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Total Amount
                                            </p>
                                            <p className="text-base font-semibold">
                                                {formatCurrency(selectedInvoice.total_amount)}
                                            </p>
                                        </div>
                                    </div>

                                    {selectedInvoice.notes && (
                                        <div className="flex items-start gap-3">
                                            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Notes
                                                </p>
                                                <p className="text-base">{selectedInvoice.notes}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Timestamps */}
                            {(selectedInvoice.created_at || selectedInvoice.updated_at) && (
                                <div className="pt-4 border-t text-sm text-muted-foreground">
                                    {selectedInvoice.created_at && (
                                        <p>
                                            Created: {formatDate(selectedInvoice.created_at)}
                                        </p>
                                    )}
                                    {selectedInvoice.updated_at && (
                                        <p>
                                            Last Updated: {formatDate(selectedInvoice.updated_at)}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Invoice;

// Made with Bob