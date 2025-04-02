import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}

const initialState: Partial<User> = {};

// Slice combines actions and reducers / no need to switch case of action
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // State is current value
        storeUser: (state, action: PayloadAction<User>) => {
            // return { ...action.payload };
            Object.assign(state, action.payload);
            // Or Object.assign(state, initialState)
        },
        removeUser: (state) => {
            // return {};
            Object.keys(state).forEach((key) => delete state[key as keyof User]);
        },
        updateUser: (state, action: PayloadAction<User>) => {
            // return { ...state, ...action.payload };
            Object.assign(state, action.payload);
        },
    },
});

export const { storeUser, removeUser, updateUser } = userSlice.actions;

export const userReducer = userSlice.reducer;
