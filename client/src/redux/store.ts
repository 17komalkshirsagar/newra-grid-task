import { configureStore } from "@reduxjs/toolkit";


import authSlice from "./slices/auth.slice"

import { authApi } from "./apis/auth.api";
import { userApi } from "./apis/user.api";
import { analyticsApi } from "./apis/analytics.api";
import { billApi } from "./apis/bill.api";
import { scenarioApi } from "./apis/scenario.api";
import { integrationApi } from "./apis/integration.api";
import { reportApi } from "./apis/report.api";
import { contactApi } from "./apis/contact.api";




const reduxStore = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [billApi.reducerPath]: billApi.reducer,
    [scenarioApi.reducerPath]: scenarioApi.reducer,
    [integrationApi.reducerPath]: integrationApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,

    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      analyticsApi.middleware,
      billApi.middleware,
      scenarioApi.middleware,
      integrationApi.middleware,
      reportApi.middleware,
      contactApi.middleware,
    )
})


export type RootState = ReturnType<typeof reduxStore.getState>
export type AppDispatch = typeof reduxStore.dispatch

export { reduxStore as store }
export default reduxStore

