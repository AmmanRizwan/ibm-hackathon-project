export interface ICreateBillingDetail {
    address: string;
    pin: string;
    city: string;
    state: string;
}

export interface IUpdateBillingDetail {
    address?: string;
    pin?: string;
    city?: string;
    state?: string;
}

export interface IUpdateIsVerify {
    isVerify: boolean;
}

export interface IGetAllBillingDetailsQuery {
    page?: number;
    limit?: number;
}

// Made with Bob