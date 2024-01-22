import {createSlice} from "@reduxjs/toolkit";

const idToken  = localStorage.getItem("token");
const userId = localStorage.getItem("email");

const isLoggedIn = !!idToken;

const initialState = {
    isLoggedIn: isLoggedIn,
    userId: userId,
    idToken: idToken,
    emailVerified: false,

}

const authSlice = createSlice({
    name : "authentication",
    initialState,
    reducers: {
        login (state, action) {
           state.idToken = action.payload.idToken,
           state.userId = action.payload.userId,
           state.emailVerified = action.payload.emailVerified,
           state.isLoggedIn = true,
           localStorage.setItem("token", action.payload.idToken);
           localStorage.setItem("email", action.payload.userId);
        },

        logout (state) {
            state.isLoggedIn = false,
            state.idToken = null,
            state.userId = "",
            state.emailVerified = false,
            localStorage.removeItem("email");
            localStorage.removeItem("token");
        },

    },
});

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;
