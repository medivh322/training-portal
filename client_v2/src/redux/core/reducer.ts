import {
  BaseQueryApi,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/serverApiConfig";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CORE_REDUCER, LOADING_FULLSCREEN, SET_ID, SET_ROLE } from "./types";
import { Role, UserSettings, customQueryValue } from "../../types/models";
import { FetchBaseQueryArgs } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
import errorHandler from "../../request/errorHundler";
import { RcFile } from "antd/es/upload";

const initialState: {
  isLoadingFullScreen: boolean;
  userId: string | null;
  role: Role | null;
} = {
  userId: null,
  role: null,
  isLoadingFullScreen: false,
};

const coreReducer = createSlice({
  name: CORE_REDUCER,
  initialState,
  reducers: {
    [LOADING_FULLSCREEN]: (
      state,
      action: PayloadAction<{
        loading: boolean;
      }>
    ) => {
      state.isLoadingFullScreen = action.payload.loading;
    },
    [SET_ID]: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      state.userId = action.payload.id;
    },
    [SET_ROLE]: (
      state,
      action: PayloadAction<{
        role: Role;
      }>
    ) => {
      state.role = action.payload.role;
    },
  },
});

const baseQuery =
  (baseQueryOptions: FetchBaseQueryArgs) =>
  async (args: any, api: BaseQueryApi, extraOptions: any) => {
    const result = (await fetchBaseQuery(baseQueryOptions)(
      args,
      api,
      extraOptions
    )) as customQueryValue;
    if (result.error && !result.error.data?.noNotifications) {
      errorHandler(result.error);
    }

    return result;
  };

export const coreApi = createApi({
  reducerPath: "coreApi",
  baseQuery: baseQuery({
    baseUrl: `${API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    checkToken: builder.query<{ id: string; role: Role }, null>({
      query: () => ({
        url: "auth",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(coreReducer.actions.SET_ID({ id: data.id }));
          dispatch(coreReducer.actions[SET_ROLE]({ role: data.role }));
        } catch (error: any) {}
      },
    }),
    login: builder.mutation<{ role: Role }, UserSettings>({
      query: (loginParameters) => ({
        url: "login",
        method: "POST",
        body: loginParameters,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // dispatch(coreReducer.actions[LOADING_FULLSCREEN]({ loading: true }));
        try {
          const { data } = await queryFulfilled;
          dispatch(coreReducer.actions.SET_ROLE({ role: data.role }));
        } catch (error: any) {}
        // dispatch(coreReducer.actions[LOADING_FULLSCREEN]({ loading: false }));
      },
    }),
    signupMember: builder.mutation<
      boolean,
      { name: string; role: string; password: string }
    >({
      query: (body) => ({
        url: "registration",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const coreApiHooks = coreApi;
export const coreReducerState = coreReducer.getInitialState;
export default coreReducer;
