import { useState } from 'react';
// import { getAllUsers, deleteUser } from '@/service/user';
import type { IUser } from '@/service/user/interface';
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
import { Trash2, Eye, Loader2 } from 'lucide-react';

// Mock employee data
const MOCK_EMPLOYEES: IUser[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        role: 'employee',
        isVerify: true,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-04-20T14:45:00Z',
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1 (555) 234-5678',
        role: 'employee',
        isVerify: true,
        createdAt: '2024-02-10T09:15:00Z',
        updatedAt: '2024-04-18T11:20:00Z',
    },
    {
        id: '3',
        name: 'Michael Johnson',
        email: 'michael.j@example.com',
        phone: '+1 (555) 345-6789',
        role: 'employee',
        isVerify: false,
        createdAt: '2024-03-05T13:45:00Z',
        updatedAt: '2024-03-05T13:45:00Z',
    },
    {
        id: '4',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        phone: '+1 (555) 456-7890',
        role: 'employee',
        isVerify: true,
        createdAt: '2024-01-20T08:00:00Z',
        updatedAt: '2024-04-22T16:30:00Z',
    },
    {
        id: '5',
        name: 'Robert Wilson',
        email: 'robert.w@example.com',
        phone: '+1 (555) 567-8901',
        role: 'employee',
        isVerify: false,
        createdAt: '2024-04-01T12:00:00Z',
        updatedAt: '2024-04-01T12:00:00Z',
    },
];

const AdminBillingDetail = () => {
    const [employees, setEmployees] = useState<IUser[]>(MOCK_EMPLOYEES);
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<IUser | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Handle delete employee (mock implementation)
    const handleDelete = () => {
        if (!selectedEmployee) return;

        setDeleting(true);
        setError(null);
        
        // Simulate API delay
        setTimeout(() => {
            // Remove employee from mock data
            setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
            setSuccessMessage('Employee deleted successfully');
            setDeleteDialogOpen(false);
            setSelectedEmployee(null);
            setDeleting(false);
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        }, 500);
    };

    // Open delete dialog
    const openDeleteDialog = (employee: IUser) => {
        setSelectedEmployee(employee);
        setDeleteDialogOpen(true);
    };

    // Open view dialog
    const openViewDialog = (employee: IUser) => {
        setSelectedEmployee(employee);
        setViewDialogOpen(true);
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
                                            <td className="p-4">{employee.name}</td>
                                            <td className="p-4">{employee.email}</td>
                                            <td className="p-4">{employee.phone}</td>
                                            <td className="p-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        employee.isVerify
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    {employee.isVerify ? 'Verified' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {formatDate(employee.createdAt)}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openViewDialog(employee)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
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

            {/* View Employee Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Employee Details</DialogTitle>
                        <DialogDescription>
                            View detailed information about the employee
                        </DialogDescription>
                    </DialogHeader>
                    {selectedEmployee && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-muted-foreground">
                                    Name
                                </label>
                                <p className="text-base mt-1">{selectedEmployee.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-muted-foreground">
                                    Email
                                </label>
                                <p className="text-base mt-1">{selectedEmployee.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-muted-foreground">
                                    Phone
                                </label>
                                <p className="text-base mt-1">{selectedEmployee.phone}</p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-muted-foreground">
                                    Role
                                </label>
                                <p className="text-base mt-1 capitalize">{selectedEmployee.role}</p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-muted-foreground">
                                    Verification Status
                                </label>
                                <p className="text-base mt-1">
                                    {selectedEmployee.isVerify ? 'Verified' : 'Not Verified'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-muted-foreground">
                                    Joined Date
                                </label>
                                <p className="text-base mt-1">
                                    {formatDate(selectedEmployee.createdAt)}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-muted-foreground">
                                    Last Updated
                                </label>
                                <p className="text-base mt-1">
                                    {formatDate(selectedEmployee.updatedAt)}
                                </p>
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
