import {
  BaseQueryApi,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/serverApiConfig";
import { customQueryValue } from "../../types/models";
import { FetchBaseQueryArgs } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
import errorHandler from "../../request/errorHundler";

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

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  baseQuery: baseQuery({
    baseUrl: `${API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Articles"],
  endpoints: (builder) => ({
    getArticles: builder.query<
      {
        _id: string;
        author: string;
        name: string;
        text: string;
        createdAt: string;
      }[],
      void
    >({
      query: () => ({
        url: "articles",
        method: "GET",
      }),
      transformResponse: (response: {
        articles: {
          _id: string;
          author: string;
          name: string;
          text: string;
          createdAt: string;
        }[];
      }) => response.articles,
      providesTags: ["Articles"],
    }),
    getArticle: builder.query<
      {
        name: string;
        text: string;
      },
      { articleId: string | undefined | null }
    >({
      query: ({ articleId }) => ({
        url: "articles/" + articleId,
        method: "GET",
      }),
      transformResponse: (response: {
        article: {
          name: string;
          text: string;
        };
      }) => response.article,
    }),
    createArticle: builder.mutation<
      void,
      { name: string; text: string; teacherId: string }
    >({
      query: (body) => ({
        url: "articles",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Articles"],
    }),
    updateArticle: builder.mutation<
      void,
      { articleId: string | null; name: string; text: string }
    >({
      query: ({ articleId, name, text }) => ({
        url: "articles",
        method: "PUT",
        body: {
          text,
          name,
        },
        params: {
          articleId,
        },
      }),
      invalidatesTags: ["Articles"],
    }),
  }),
});

export const articlesApiHooks = articlesApi;
export default articlesApi;
