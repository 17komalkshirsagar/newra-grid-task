// import { createSlice } from "@reduxjs/toolkit";
// import { authApi } from "../apis/auth.api";
// import { IUser } from "../../models/user.interface";

// interface InitialState {
//     user: IUser | null
// }

// const initialState: InitialState = {
//     user: localStorage.getItem("user")
//         ? JSON.parse(localStorage.getItem("user") as string)
//         : null
// }

// const authSlice = createSlice({
//     name: "authSlice",
//     initialState,
//     reducers: {},
//     extraReducers: builder => builder

//         .addMatcher(authApi.endpoints.signIn.matchFulfilled, (state, {payload}) => {
//             state.user = payload.result
//         })
//         .addMatcher(authApi.endpoints.signUp.matchFulfilled, (state, {payload}) => {
//             state.user = payload.result
//         })
//         .addMatcher(authApi.endpoints.signOut.matchFulfilled, (state) => {
//             state.user = null
//         })
// })

// export default authSlice.reducer

// export type { InitialState }


import { createSlice, } from "@reduxjs/toolkit";
import { authApi } from "../apis/auth.api";
import { IUser } from "../../models/user.interface";

interface InitialState {
    user: IUser | null;
    admin?: IUser | null;
    isSessionExpiredModalOpen: boolean;
}

const initialState: InitialState = {
    user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null,
    isSessionExpiredModalOpen: false,
};

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        logoutAdmin(state) {
            state.user = null;
            localStorage.removeItem("user");
        },
        openSessionExpiredModal(state) {
            state.isSessionExpiredModalOpen = true;
        },
        closeSessionExpiredModal(state) {
            state.isSessionExpiredModalOpen = false;
        },
    },
    extraReducers: (builder) =>
        builder
            .addMatcher(authApi.endpoints.signIn.matchFulfilled, (state, { payload }) => {
                state.user = payload.result;
            })
            .addMatcher(authApi.endpoints.signUp.matchFulfilled, (state, { payload }) => {
                state.user = payload.result;
            })
            .addMatcher(authApi.endpoints.signOut.matchFulfilled, (state) => {
                state.user = null;
            }),
});

export const { logoutAdmin, openSessionExpiredModal, closeSessionExpiredModal } =
    authSlice.actions;

export default authSlice.reducer;
export type { InitialState };
