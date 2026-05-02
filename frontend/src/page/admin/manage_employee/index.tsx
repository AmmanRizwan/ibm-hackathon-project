import { useState, useEffect } from 'react';
import { getAllUsers, deleteUser } from '@/service/user';
import { updateIsVerify as updateBillingVerify } from '@/service/billing_details';
import { updateIsVerify as updatePaymentVerify } from '@/service/payment_methods';
import type { IVerifiedEmployee, IBillingDetail, IPaymentMethod } from '@/service/user/interface';
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
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Loader2, CheckCircle2, XCircle, Eye, CreditCard, MapPin } from 'lucide-react';

const AdminBillingDetail = () => {
    const [employees, setEmployees] = useState<IVerifiedEmployee[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<IVerifiedEmployee | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch employees on component mount
    useEffect(() => {
        fetchEmployees();
    }, []);

    // Fetch all employees
    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllUsers();
            setEmployees(response.data as IVerifiedEmployee[]);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    // Handle delete employee
    const handleDelete = async () => {
        if (!selectedEmployee) return;

        try {
            setDeleting(true);
            setError(null);
            await deleteUser(selectedEmployee.id);
            setSuccessMessage('Employee deleted successfully');
            setDeleteDialogOpen(false);
            setSelectedEmployee(null);
            // Refresh employee list
            await fetchEmployees();
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete employee');
        } finally {
            setDeleting(false);
        }
    };

    // Handle verify individual billing detail
    const handleVerifyBilling = async (billingId: string) => {
        try {
            setUpdating(true);
            setError(null);
            await updateBillingVerify(billingId, { isVerify: true });
            setSuccessMessage('Billing detail verified successfully');
            await fetchEmployees();
            // Update selected employee to reflect changes
            if (selectedEmployee) {
                const updatedEmployee = employees.find(emp => emp.id === selectedEmployee.id);
                if (updatedEmployee) {
                    setSelectedEmployee(updatedEmployee);
                }
            }
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to verify billing detail');
        } finally {
            setUpdating(false);
        }
    };

    // Handle verify individual payment method
    const handleVerifyPayment = async (paymentId: string) => {
        try {
            setUpdating(true);
            setError(null);
            await updatePaymentVerify(paymentId, { isVerify: true });
            setSuccessMessage('Payment method verified successfully');
            await fetchEmployees();
            // Update selected employee to reflect changes
            if (selectedEmployee) {
                const updatedEmployee = employees.find(emp => emp.id === selectedEmployee.id);
                if (updatedEmployee) {
                    setSelectedEmployee(updatedEmployee);
                }
            }
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to verify payment method');
        } finally {
            setUpdating(false);
        }
    };

    // Handle verify all billing and payment details
    const handleVerifyAll = async () => {
        if (!selectedEmployee) return;

        try {
            setUpdating(true);
            setError(null);

            // Update all unverified billing details
            const billingPromises = selectedEmployee.billingDetails
                ?.filter(billing => !billing.isVerify)
                .map(billing => updateBillingVerify(billing.id, { isVerify: true })) || [];

            // Update all unverified payment methods
            const paymentPromises = selectedEmployee.paymentMethods
                ?.filter(payment => !payment.isVerify)
                .map(payment => updatePaymentVerify(payment.id, { isVerify: true })) || [];

            // Wait for all updates to complete
            await Promise.all([...billingPromises, ...paymentPromises]);

            setSuccessMessage('All pending details verified successfully');
            await fetchEmployees();
            // Update selected employee to reflect changes
            const updatedEmployee = employees.find(emp => emp.id === selectedEmployee.id);
            if (updatedEmployee) {
                setSelectedEmployee(updatedEmployee);
            }
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to verify details');
        } finally {
            setUpdating(false);
        }
    };

    // Count pending verifications
    const getPendingCount = (employee: IVerifiedEmployee) => {
        const pendingBilling = employee.billingDetails?.filter(b => !b.isVerify).length || 0;
        const pendingPayment = employee.paymentMethods?.filter(p => !p.isVerify).length || 0;
        return pendingBilling + pendingPayment;
    };

    // Open delete dialog
    const openDeleteDialog = (employee: IVerifiedEmployee) => {
        setSelectedEmployee(employee);
        setDeleteDialogOpen(true);
    };

    // Open edit dialog
    const openEditDialog = (employee: IVerifiedEmployee) => {
        setSelectedEmployee(employee);
        setEditDialogOpen(true);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="container mx-auto py-8 px-4">
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

            <Card>
                <CardHeader>
                    <CardTitle>Manage Employees</CardTitle>
                    <CardDescription>
                        View and manage all registered employees (non-admin users)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : employees.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No employees found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="text-left p-4 font-semibold">Name</th>
                                        <th className="text-left p-4 font-semibold">Email</th>
                                        <th className="text-left p-4 font-semibold">Phone</th>
                                        <th className="text-left p-4 font-semibold">Status</th>
                                        <th className="text-left p-4 font-semibold">Details</th>
                                        <th className="text-left p-4 font-semibold">Joined</th>
                                        <th className="text-center p-4 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((employee) => (
                                        <tr
                                            key={employee.id}
                                            className="border-b hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className="font-medium">{employee.name}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm">{employee.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm">{employee.phone}</div>
                                            </td>
                                            <td className="p-4">
                                                <Badge
                                                    variant={employee.isVerify ? 'default' : 'secondary'}
                                                    className={
                                                        employee.isVerify
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                    }
                                                >
                                                    {employee.isVerify ? (
                                                        <>
                                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                                            Verified
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="h-3 w-3 mr-1" />
                                                            Pending
                                                        </>
                                                    )}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-muted-foreground">
                                                            {employee.billingDetails?.length || 0} Billing
                                                        </span>
                                                        {employee.billingDetails?.some(b => !b.isVerify) && (
                                                            <Badge variant="outline" className="text-xs px-1 py-0">
                                                                {employee.billingDetails.filter(b => !b.isVerify).length} pending
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <CreditCard className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-muted-foreground">
                                                            {employee.paymentMethods?.length || 0} Payment
                                                        </span>
                                                        {employee.paymentMethods?.some(p => !p.isVerify) && (
                                                            <Badge variant="outline" className="text-xs px-1 py-0">
                                                                {employee.paymentMethods.filter(p => !p.isVerify).length} pending
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {formatDate(employee.createdAt)}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openEditDialog(employee)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View Details
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => openDeleteDialog(employee)}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* View Employee Details Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Employee Details & Verification</DialogTitle>
                        <DialogDescription>
                            Review and verify employee billing and payment information
                        </DialogDescription>
                    </DialogHeader>
                    {selectedEmployee && (
                        <div className="space-y-6">
                            {/* Employee Info Card */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Eye className="h-5 w-5" />
                                        Employee Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase">
                                                Full Name
                                            </label>
                                            <p className="text-base font-medium">{selectedEmployee.name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase">
                                                Email Address
                                            </label>
                                            <p className="text-base">{selectedEmployee.email}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase">
                                                Phone Number
                                            </label>
                                            <p className="text-base">{selectedEmployee.phone}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase">
                                                Account Status
                                            </label>
                                            <div>
                                                <Badge
                                                    variant={selectedEmployee.isVerify ? 'default' : 'secondary'}
                                                    className={
                                                        selectedEmployee.isVerify
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }
                                                >
                                                    {selectedEmployee.isVerify ? (
                                                        <>
                                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                                            Verified
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="h-3 w-3 mr-1" />
                                                            Pending Verification
                                                        </>
                                                    )}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase">
                                                Member Since
                                            </label>
                                            <p className="text-base">{formatDate(selectedEmployee.createdAt)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-muted-foreground uppercase">
                                                Role
                                            </label>
                                            <p className="text-base capitalize">{selectedEmployee.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Billing Details Section */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Billing Details
                                            <Badge variant="outline" className="ml-2">
                                                {selectedEmployee.billingDetails?.length || 0} Total
                                            </Badge>
                                        </CardTitle>
                                        {selectedEmployee.billingDetails?.some(b => !b.isVerify) && (
                                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                {selectedEmployee.billingDetails.filter(b => !b.isVerify).length} Pending
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {selectedEmployee.billingDetails && selectedEmployee.billingDetails.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedEmployee.billingDetails.map((billing, index) => (
                                                <Card key={billing.id} className="border-2">
                                                    <CardContent className="pt-4">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline">#{index + 1}</Badge>
                                                                <Badge
                                                                    variant={billing.isVerify ? 'default' : 'secondary'}
                                                                    className={
                                                                        billing.isVerify
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : 'bg-yellow-100 text-yellow-800'
                                                                    }
                                                                >
                                                                    {billing.isVerify ? (
                                                                        <>
                                                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                            Verified
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <XCircle className="h-3 w-3 mr-1" />
                                                                            Pending
                                                                        </>
                                                                    )}
                                                                </Badge>
                                                            </div>
                                                            {!billing.isVerify && (
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleVerifyBilling(billing.id)}
                                                                    disabled={updating}
                                                                    className="h-8"
                                                                >
                                                                    {updating ? (
                                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                                    ) : (
                                                                        <>
                                                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                            Verify
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                                            <div className="col-span-2">
                                                                <label className="text-xs font-semibold text-muted-foreground uppercase">
                                                                    Address
                                                                </label>
                                                                <p className="text-base mt-1">{billing.address}</p>
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-semibold text-muted-foreground uppercase">
                                                                    City
                                                                </label>
                                                                <p className="text-base mt-1">{billing.city}</p>
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-semibold text-muted-foreground uppercase">
                                                                    State
                                                                </label>
                                                                <p className="text-base mt-1">{billing.state}</p>
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-semibold text-muted-foreground uppercase">
                                                                    PIN Code
                                                                </label>
                                                                <p className="text-base mt-1 font-mono">{billing.pin}</p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                            <p>No billing details found</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Payment Methods Section */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <CreditCard className="h-5 w-5" />
                                            Payment Methods
                                            <Badge variant="outline" className="ml-2">
                                                {selectedEmployee.paymentMethods?.length || 0} Total
                                            </Badge>
                                        </CardTitle>
                                        {selectedEmployee.paymentMethods?.some(p => !p.isVerify) && (
                                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                {selectedEmployee.paymentMethods.filter(p => !p.isVerify).length} Pending
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {selectedEmployee.paymentMethods && selectedEmployee.paymentMethods.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedEmployee.paymentMethods.map((payment, index) => (
                                                <Card key={payment.id} className="border-2">
                                                    <CardContent className="pt-4">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline">#{index + 1}</Badge>
                                                                <Badge
                                                                    variant={payment.isVerify ? 'default' : 'secondary'}
                                                                    className={
                                                                        payment.isVerify
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : 'bg-yellow-100 text-yellow-800'
                                                                    }
                                                                >
                                                                    {payment.isVerify ? (
                                                                        <>
                                                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                            Verified
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <XCircle className="h-3 w-3 mr-1" />
                                                                            Pending
                                                                        </>
                                                                    )}
                                                                </Badge>
                                                            </div>
                                                            {!payment.isVerify && (
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleVerifyPayment(payment.id)}
                                                                    disabled={updating}
                                                                    className="h-8"
                                                                >
                                                                    {updating ? (
                                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                                    ) : (
                                                                        <>
                                                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                            Verify
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                                            <div>
                                                                <label className="text-xs font-semibold text-muted-foreground uppercase">
                                                                    Bank Name
                                                                </label>
                                                                <p className="text-base mt-1 font-medium">{payment.bank_name}</p>
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-semibold text-muted-foreground uppercase">
                                                                    Account Holder
                                                                </label>
                                                                <p className="text-base mt-1">{payment.account_holder_name}</p>
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-semibold text-muted-foreground uppercase">
                                                                    Account Number
                                                                </label>
                                                                <p className="text-base mt-1 font-mono">{payment.account_number}</p>
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-semibold text-muted-foreground uppercase">
                                                                    IFSC Code
                                                                </label>
                                                                <p className="text-base mt-1 font-mono">{payment.ifsc}</p>
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-semibold text-muted-foreground uppercase">
                                                                    Account Type
                                                                </label>
                                                                <p className="text-base mt-1 capitalize">{payment.account_type}</p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                            <p>No payment methods found</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setEditDialogOpen(false)}
                            disabled={updating}
                        >
                            Close
                        </Button>
                        {selectedEmployee && getPendingCount(selectedEmployee) > 0 && (
                            <Button
                                onClick={handleVerifyAll}
                                disabled={updating}
                            >
                                {updating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Verify All Pending ({getPendingCount(selectedEmployee)})
                                    </>
                                )}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this employee? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedEmployee && (
                        <div className="py-4">
                            <p className="text-sm">
                                <span className="font-semibold">Name:</span> {selectedEmployee.name}
                            </p>
                            <p className="text-sm">
                                <span className="font-semibold">Email:</span> {selectedEmployee.email}
                            </p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? (
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

export default AdminBillingDetail;

// Made with Bob
