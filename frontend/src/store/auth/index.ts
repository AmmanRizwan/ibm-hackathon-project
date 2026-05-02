import { createSlice } from "@reduxjs/toolkit";

interface IAuthUser {
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        role: string;
    },
    token: string
}

const initialState: IAuthUser = {
    user: {
        id: null,
        name: null,
        email: null,
        phone: null,
        role: null
    },
    token: null,
}

export const authUserDetail = createSlice({
    name: "auth",
    initialState,
    reducers: {
        removeUser: (state) => {
            const detail = {
                id: null,
                name: null,
                email: null,
                role: null,
                phone: null
            };
            state.user = detail;
        },
        setUser: (state, action) => {
            const detail = {
                id: action.payload.id,
                name: action.payload.name,
                email: action.payload.email,
                role: action.payload.role,
                phone: action.payload.phone,
            }
            state.user = detail;
        },
        setToken: (state) => {
            const token = localStorage.getItem("token");
            if (token) {
                state.token = token;
            }
        },
        removeToken: (state) => {
            state.token = null;
        }
    }
});

export const { removeUser, setUser, setToken, removeToken } = authUserDetail.actions;
export default authUserDetail.reducer;