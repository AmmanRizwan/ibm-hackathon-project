export interface ICreateTransaction {
    payer_bank_account_id: string;
    payee_bank_account_id: string;
    payer_name: string;
    payer_email: string;
    payee_name: string;
    payee_email: string;
    invoiceId: string;
    amount: number;
    transaction_date?: string;
    status?: string;
}

export interface IUpdateTransaction {
    payer_bank_account_id?: string;
    payee_bank_account_id?: string;
    payer_name?: string;
    payer_email?: string;
    payee_name?: string;
    payee_email?: string;
    invoiceId?: string;
    amount?: number;
    transaction_date?: string;
    status?: string;
}

export interface IGetAllTransactionsQuery {
    page?: number;
    limit?: number;
    status?: string;
}

export interface IGetUserTransactionsQuery {
    page?: number;
    limit?: number;
    status?: string;
}

// Made with Bob