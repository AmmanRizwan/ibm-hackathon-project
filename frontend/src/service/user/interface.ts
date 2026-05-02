export interface IUpdateUserDetail {
    name?: string;
    phone?: string;
    password?: string;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isVerify: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IBillingDetail {
    id: string;
    address: string;
    pin: string;
    city: string;
    state: string;
    isVerify: boolean;
}

export interface IPaymentMethod {
    id: string;
    bank_name: string;
    account_holder_name: string;
    account_number: string;
    ifsc: string;
    account_type: string;
    isVerify: boolean;
}

export interface IVerifiedEmployee {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isVerify: boolean;
    createdAt: string;
    updatedAt: string;
    billingDetails: IBillingDetail[];
    paymentMethods: IPaymentMethod[];
}

// Made with Bob