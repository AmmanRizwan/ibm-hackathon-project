import { configureStore } from "@reduxjs/toolkit";
import authUserDetailReducer from "./auth";
import navToggleReducer from "./nav-toggle";

export const store = configureStore({
    reducer: {
        auth: authUserDetailReducer,
        navToggle: navToggleReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ReturnType<typeof store.dispatch>;