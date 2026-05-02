export interface ICreateInvoice {
    invoice_number: string;
    invoice_date?: string;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    total_amount: number;
    payment_status?: string;
    notes?: string;
    status?: string;
}

export interface IAdminCreateInvoice extends ICreateInvoice {
    userId: string;
}

export interface IUpdateInvoice {
    invoice_number?: string;
    invoice_date?: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    total_amount?: number;
    payment_status?: string;
    notes?: string;
    status?: string;
}

export interface IGetAllInvoicesQuery {
    page?: number;
    limit?: number;
}

export interface IGetUserInvoicesQuery {
    page?: number;
    limit?: number;
}

// Made with Bob