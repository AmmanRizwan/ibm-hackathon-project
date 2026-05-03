import { useEffect, useState } from 'react';
import { getAllInvoices, adminUpdateInvoice, adminDeleteInvoice } from '@/service/invoice';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    FileText,
    Eye,
    Edit,
    Trash2,
    Loader2,
    User,
    Mail,
    Phone,
    RefreshCw,
} from 'lucide-react';

interface Invoice {
    id: string;
    invoice_number: string;
    invoice_date: string;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    total_amount: number;
    payment_status: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';
    status: 'draft' | 'sent' | 'viewed' | 'paid' | 'cancelled';
    notes?: string;
    userId: string;
    user?: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

const AdminInvoice = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationData>({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 10,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    // Dialog states
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    // Form states
    const [editForm, setEditForm] = useState({
        invoice_number: '',
        invoice_date: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        total_amount: '',
        payment_status: '',
        status: '',
        notes: '',
    });

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchInvoices();
    }, [pagination.currentPage]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllInvoices({
                page: pagination.currentPage,
                limit: pagination.limit,
            });
            setInvoices(response.data || []);
            if (response.pagination) {
                setPagination(response.pagination);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch invoices');
        } finally {
            setLoading(false);
        }
    };

    const handleViewInvoice = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setViewDialogOpen(true);
    };

    const handleEditInvoice = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setEditForm({
            invoice_number: invoice.invoice_number,
            invoice_date: invoice.invoice_date.split('T')[0],
            customer_name: invoice.customer_name,
            customer_email: invoice.customer_email || '',
            customer_phone: invoice.customer_phone || '',
            total_amount: invoice.total_amount.toString(),
            payment_status: invoice.payment_status,
            status: invoice.status,
            notes: invoice.notes || '',
        });
        setEditDialogOpen(true);
    };

    const handleDeleteInvoice = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setDeleteDialogOpen(true);
    };

    const handleUpdateSubmit = async () => {
        if (!selectedInvoice) return;

        try {
            setSubmitting(true);
            setError(null);
            await adminUpdateInvoice(selectedInvoice.id, {
                invoice_number: editForm.invoice_number,
                invoice_date: editForm.invoice_date,
                customer_name: editForm.customer_name,
                customer_email: editForm.customer_email || undefined,
                customer_phone: editForm.customer_phone || undefined,
                total_amount: parseFloat(editForm.total_amount),
                payment_status: editForm.payment_status,
                status: editForm.status,
                notes: editForm.notes || undefined,
            });
            setSuccessMessage('Invoice updated successfully');
            setEditDialogOpen(false);
            fetchInvoices();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update invoice');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteSubmit = async () => {
        if (!selectedInvoice) return;

        try {
            setSubmitting(true);
            setError(null);
            await adminDeleteInvoice(selectedInvoice.id);
            setSuccessMessage('Invoice deleted successfully');
            setDeleteDialogOpen(false);
            fetchInvoices();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete invoice');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getPaymentStatusVariant = (
        status: string
    ): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'default';
            case 'pending':
            case 'partial':
                return 'secondary';
            case 'overdue':
            case 'cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getStatusVariant = (
        status: string
    ): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (status.toLowerCase()) {
            case 'paid':
            case 'sent':
            case 'viewed':
                return 'default';
            case 'draft':
                return 'secondary';
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
                    <p className="mt-4 text-muted-foreground">Loading invoices...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 px-4 max-w-7xl">
            {/* Success Message */}
            {successMessage && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                    {successMessage}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">All Invoices</h1>
                        <p className="text-muted-foreground mt-2">
                            View and manage all invoices from all users
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchInvoices}
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Invoices</CardDescription>
                            <CardTitle className="text-2xl">{pagination.totalCount}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Amount</CardDescription>
                            <CardTitle className="text-2xl">
                                {formatCurrency(
                                    invoices.reduce((sum, inv) => {
                                        const amount = Number(inv.total_amount);
                                        return sum + (isNaN(amount) ? 0 : amount);
                                    }, 0)
                                )}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Paid</CardDescription>
                            <CardTitle className="text-2xl text-green-600">
                                {invoices.filter((inv) => inv.payment_status === 'paid').length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Pending</CardDescription>
                            <CardTitle className="text-2xl text-yellow-600">
                                {invoices.filter((inv) => inv.payment_status === 'pending').length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            </div>

            {/* Invoices Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Invoice List</CardTitle>
                    <CardDescription>
                        Showing {invoices.length} of {pagination.totalCount} invoices
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {invoices.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p>No invoices found</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice #</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">
                                            {invoice.invoice_number}
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
                                        <TableCell>
                                            {invoice.user && (
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {invoice.user.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {invoice.user.email}
                                                    </p>
                                                </div>
                                            )}
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
                                                className="capitalize"
                                            >
                                                {invoice.payment_status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={getStatusVariant(invoice.status)}
                                                className="capitalize"
                                            >
                                                {invoice.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewInvoice(invoice)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditInvoice(invoice)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteInvoice(invoice)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() =>
                            setPagination((prev) => ({
                                ...prev,
                                currentPage: prev.currentPage - 1,
                            }))
                        }
                        disabled={!pagination.hasPreviousPage}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center px-4">
                        <span className="text-sm text-muted-foreground">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() =>
                            setPagination((prev) => ({
                                ...prev,
                                currentPage: prev.currentPage + 1,
                            }))
                        }
                        disabled={!pagination.hasNextPage}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* View Invoice Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Invoice Details
                        </DialogTitle>
                        <DialogDescription>Complete invoice information</DialogDescription>
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
                                        {formatDate(selectedInvoice.invoice_date)}
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
                                        className="text-sm px-3 py-1 capitalize"
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
                                        className="text-sm px-3 py-1 capitalize"
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

                            {/* User Information */}
                            {selectedInvoice.user && (
                                <div>
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Created By
                                    </h4>
                                    <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                                        <p className="text-sm">
                                            <span className="font-medium">Name:</span>{' '}
                                            {selectedInvoice.user.name}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Email:</span>{' '}
                                            {selectedInvoice.user.email}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Phone:</span>{' '}
                                            {selectedInvoice.user.phone}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            {selectedInvoice.notes && (
                                <div>
                                    <h4 className="font-semibold mb-3">Notes</h4>
                                    <p className="text-sm bg-muted/30 p-4 rounded-lg">
                                        {selectedInvoice.notes}
                                    </p>
                                </div>
                            )}

                            {/* Timestamps */}
                            <div className="pt-4 border-t text-sm text-muted-foreground">
                                <p>Created: {formatDate(selectedInvoice.createdAt)}</p>
                                <p>Last Updated: {formatDate(selectedInvoice.updatedAt)}</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Invoice Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Invoice</DialogTitle>
                        <DialogDescription>Update invoice information</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="invoice_number">Invoice Number *</Label>
                                <Input
                                    id="invoice_number"
                                    value={editForm.invoice_number}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, invoice_number: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="invoice_date">Invoice Date *</Label>
                                <Input
                                    id="invoice_date"
                                    type="date"
                                    value={editForm.invoice_date}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, invoice_date: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="customer_name">Customer Name *</Label>
                            <Input
                                id="customer_name"
                                value={editForm.customer_name}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, customer_name: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="customer_email">Customer Email</Label>
                                <Input
                                    id="customer_email"
                                    type="email"
                                    value={editForm.customer_email}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, customer_email: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="customer_phone">Customer Phone</Label>
                                <Input
                                    id="customer_phone"
                                    value={editForm.customer_phone}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, customer_phone: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="total_amount">Total Amount *</Label>
                            <Input
                                id="total_amount"
                                type="number"
                                step="0.01"
                                value={editForm.total_amount}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, total_amount: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="payment_status">Payment Status *</Label>
                                <Select
                                    value={editForm.payment_status}
                                    onValueChange={(value) =>
                                        setEditForm({ ...editForm, payment_status: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="partial">Partial</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="overdue">Overdue</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="status">Status *</Label>
                                <Select
                                    value={editForm.status}
                                    onValueChange={(value) =>
                                        setEditForm({ ...editForm, status: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="sent">Sent</SelectItem>
                                        <SelectItem value="viewed">Viewed</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={editForm.notes}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, notes: e.target.value })
                                }
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditDialogOpen(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateSubmit} disabled={submitting}>
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Invoice'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this invoice? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedInvoice && (
                        <div className="py-4">
                            <p className="text-sm">
                                <span className="font-semibold">Invoice:</span>{' '}
                                {selectedInvoice.invoice_number}
                            </p>
                            <p className="text-sm">
                                <span className="font-semibold">Customer:</span>{' '}
                                {selectedInvoice.customer_name}
                            </p>
                            <p className="text-sm">
                                <span className="font-semibold">Amount:</span>{' '}
                                {formatCurrency(selectedInvoice.total_amount)}
                            </p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteSubmit}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminInvoice;

// Made with Bob