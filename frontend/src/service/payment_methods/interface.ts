export interface ICreatePaymentMethod {
    bank_name: string;
    account_holder_name: string;
    account_type: string;
    ifsc: string;
    account_number: string;
}

export interface IUpdatePaymentMethod {
    bank_name?: string;
    account_holder_name?: string;
    account_type?: string;
    ifsc?: string;
    account_number?: string;
}

export interface IUpdateIsVerify {
    isVerify: boolean;
}

export interface IGetAllPaymentMethodsQuery {
    page?: number;
    limit?: number;
}

// Made with Bob