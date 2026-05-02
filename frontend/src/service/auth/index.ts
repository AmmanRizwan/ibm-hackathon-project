import api from "../api";
import type { 
    ILogin, 
    ILoginVerify, 
    ISignUp, 
    ISignUpVerify, 
    ISignUpResendOtp, 
    IForgetEmail, 
    IForgetVerifyOtp, 
    IForgetVerify 
} from "./interface";

const login = async (payload: ILogin) => {
    const response = await api.post(`/auth/login`, payload);
    return response.data;
}

const loginVerify = async (payload: ILoginVerify) => {
    const response = await api.post(`/auth/login/verify`, payload);
    return response.data;
}

const signUp = async (payload: ISignUp) => {
    const response = await api.post(`/auth/signup`, payload);
    return response.data;
}

const signUpVerify = async (payload: ISignUpVerify) => {
    const response = await api.post(`/auth/signup/verify`, payload);
    return response.data;
}

const signUpResendOtp = async (payload: ISignUpResendOtp) => {
    const response = await api.post(`/auth/signup/resend`, payload);
    return response.data;
}

const forgetEmail = async (payload: IForgetEmail) => {
    const response = await api.post(`/auth/forgot-password`, payload);
    return response.data;
}

const forgetVerifyOtp = async (payload: IForgetVerifyOtp) => {
    const response = await api.post(`/auth/forgot-password/verify`, payload);
    return response.data;
}

const forgetVerify = async (payload: IForgetVerify) => {
    const response = await api.post(`/auth/forgot-password/update`, payload);
    return response.data;
}

export {
    login,
    loginVerify,
    signUp,
    signUpVerify,
    signUpResendOtp,
    forgetEmail,
    forgetVerifyOtp,
    forgetVerify
}

// Made with Bob
