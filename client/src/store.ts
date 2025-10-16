import { configureStore } from "@reduxjs/toolkit";

import { authApi } from "./redux/apis/auth.api";
import { userApi } from "./redux/apis/user.api";
import { analyticsApi } from "./redux/apis/analytics.api";
import { billApi } from "./redux/apis/bill.api";
import { scenarioApi } from "./redux/apis/scenario.api";
import { integrationApi } from "./redux/apis/integration.api";
import { reportApi } from "./redux/apis/report.api";
import authSlice from "./redux/slices/auth.slice"




const reduxStore = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [billApi.reducerPath]: billApi.reducer,
    [scenarioApi.reducerPath]: scenarioApi.reducer,
    [integrationApi.reducerPath]: integrationApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,

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
    )
})


export type RootState = ReturnType<typeof reduxStore.getState>
export type AppDispatch = typeof reduxStore.dispatch

export default reduxStore

