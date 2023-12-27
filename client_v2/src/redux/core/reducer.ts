import {
  BaseQueryApi,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/serverApiConfig";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CORE_REDUCER, SET_ID, SET_ROLE } from "./types";
import { Role, UserSettings, customQueryValue } from "../../types/models";
import { FetchBaseQueryArgs } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
import errorHandler from "../../request/errorHundler";
import { RcFile } from "antd/es/upload";

const initialState: {
  userId: string | null;
  role: Role | null;
} = {
  userId: null,
  role: null,
};

const coreReducer = createSlice({
  name: CORE_REDUCER,
  initialState,
  reducers: {
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
    if (result.error && result.error.data?.noNotifications) {
      errorHandler(result.error);
    }

    console.log(result);

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
    checkAuthUser: builder.query<{ id: string; role: Role }, void>({
      query: () => ({
        url: "auth",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(coreReducer.actions.SET_ID({ id: data.id }));
          dispatch(coreReducer.actions[SET_ROLE]({ role: data.role }));
        } catch (error: any) {}
      },
      providesTags: ["Auth"],
    }),
    login: builder.mutation<{ role: Role }, UserSettings>({
      query: (loginParameters) => ({
        url: "login",
        method: "POST",
        body: loginParameters,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(coreReducer.actions.SET_ROLE({ role: data.role }));
        } catch (error: any) {}
      },
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation<boolean, void>({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      invalidatesTags: ["Auth"],
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
    uploadFile: builder.mutation<
      void,
      { courseId: string | null; file: string | Blob | RcFile }
    >({
      query: ({ file, courseId }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "upload",
          method: "POST",
          params: {
            courseId,
          },
          body: formData,
        };
      },
    }),
    getFiles: builder.query<
      {
        files: { filename: string }[];
        totalCount: number;
      },
      { courseId: string | null; page?: string | null }
    >({
      query: ({ courseId, page }) => {
        return {
          url: "files",
          method: "GET",
          params: {
            courseId,
            page,
          },
        };
      },
    }),
  }),
});

export const coreApiHooks = coreApi;
export const coreReducerState = coreReducer.getInitialState;
export default coreReducer;
