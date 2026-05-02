import { createSlice } from "@reduxjs/toolkit";

interface INavToggle {
    toggle: boolean;
}

const initialState: INavToggle = {
    toggle: false,
}

export const navToggle = createSlice({
    name: 'navToggle',
    initialState,
    reducers: {
        toggleButton: (state, action) => {
            state.toggle = action.payload;
        }
    }
})

export const { toggleButton } = navToggle.actions;
export default navToggle.reducer;