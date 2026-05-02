import { configureStore } from "@reduxjs/toolkit";
import authUserDetailReducer from "./auth";

export const store = configureStore({
    reducer: {
        auth: authUserDetailReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>;