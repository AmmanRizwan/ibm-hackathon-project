export interface ILogin {
    email: string;
    password: string;
}

export interface ILoginVerify {
    email: string;
    otp: string;
}

export interface ISignUp {
    name: string;
    email: string;
    password: string;
    phone: string;
}

export interface ISignUpVerify {
    email: string;
    otp: string;
}

export interface ISignUpResendOtp {
    email: string;
}

export interface IForgetEmail {
    email: string;
}

export interface IForgetVerifyOtp {
    email: string;
    otp: string;
}

export interface IForgetVerify {
    email: string;
    otp: string;
    newPassword: string;
}

// Made with Bob
