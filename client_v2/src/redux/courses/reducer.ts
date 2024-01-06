import {
  BaseQueryApi,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/serverApiConfig";
import {
  Attachment,
  IFormTest,
  IResultTest,
  ITests,
  customQueryValue,
} from "../../types/models";
import { FetchBaseQueryArgs } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
import errorHandler from "../../request/errorHundler";
import { Key } from "antd/es/table/interface";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CHANGE_STATUS_UPLOAD_FILE, COURSES_REDUCER } from "./types";

const initialState: {
  uploadingFile: boolean;
} = {
  uploadingFile: false,
};

const courseSlice = createSlice({
  name: COURSES_REDUCER,
  initialState,
  reducers: {
    [CHANGE_STATUS_UPLOAD_FILE]: (
      state,
      action: PayloadAction<{
        status: boolean;
      }>
    ) => {
      state.uploadingFile = action.payload.status;
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

    return result;
  };

export const coursesApi = createApi({
  reducerPath: "coursesApi",
  baseQuery: baseQuery({
    baseUrl: `${API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Courses", "Tests", "Members", "ResultTest", "Attachments"],
  endpoints: (builder) => ({
    getCourses: builder.query<
      { value: string; label: string }[],
      { teacherId: string | null }
    >({
      query: ({ teacherId }) => ({
        url: "courses/all",
        method: "GET",
        params: {
          teacherId,
        },
      }),
      transformResponse: (response: {
        courses: { title: string; _id: string }[];
      }) => {
        return response.courses.map((course) => ({
          value: course._id,
          label: course.title,
        }));
      },
      providesTags: ["Courses"],
    }),
    getCoursesForStudent: builder.query<
      { value: string; label: string }[],
      { studentId: string | null }
    >({
      query: ({ studentId }) => ({
        url: "courses/all/student",
        method: "GET",
        params: {
          studentId,
        },
      }),
      transformResponse: (response: {
        courses: { value: string; label: string }[];
      }) => response.courses,
    }),
    createCourses: builder.mutation<void, { teacherId: string; title: string }>(
      {
        query: ({ teacherId, title }) => ({
          url: "courses",
          method: "POST",
          body: {
            teacherId,
            title,
          },
        }),
        invalidatesTags: ["Courses"],
      }
    ),
    deleteCourse: builder.mutation<void, { courseId: string | null }>({
      query: ({ courseId }) => ({
        url: "courses",
        method: "DELETE",
        params: {
          courseId,
        },
      }),
      invalidatesTags: ["Courses"],
    }),
    getTests: builder.query<
      IFormTest | ITests[],
      { courseId: string | null | undefined; convertData?: boolean }
    >({
      query: ({ courseId }) => ({
        url: "tests",
        method: "GET",
        params: { courseId },
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response: { tests: ITests[] }, meta, args) => {
        if (args.convertData) {
          return {
            testObj: response.tests.map((test) => ({
              _id: test._id,
              test_name: test.title,
              test_list: test.questions.map((question) => ({
                answer_type: question.type,
                question_name: question.title,
                answersList: question.answers.map((answer, i) => {
                  let addParameters: {
                    singleAnswer?: number;
                    multipleAnswers?: number[];
                  } = {};
                  if (i === 0) {
                    addParameters =
                      question.type === "single"
                        ? {
                            singleAnswer: question.answers.findIndex(
                              (answer) => answer.isCorrect
                            ),
                          }
                        : {
                            multipleAnswers: question.answers.reduce<number[]>(
                              (acc, answer, i) => {
                                if (answer.isCorrect) {
                                  acc.push(i);
                                }
                                return acc;
                              },
                              []
                            ),
                          };
                  }
                  return {
                    ...addParameters,
                    valueInput: answer.text,
                  };
                }),
              })),
            })),
          };
        }
        return response.tests;
      },
      providesTags: ["Tests"],
    }),
    getTest: builder.query<
      { test?: ITests; testCompleted?: boolean },
      {
        testId: string | undefined | null;
        studentId: string | undefined | null;
      }
    >({
      query: ({ testId, studentId }) => ({
        url: "test",
        method: "GET",
        params: {
          testId,
          studentId,
        },
      }),
      providesTags: ["ResultTest"],
    }),
    saveResultTest: builder.mutation<
      void,
      {
        testId: string | null;
        result: { [key: string]: number | number[] };
        userId: string | null;
        courseId: string | null;
      }
    >({
      query: ({ testId, result, userId, courseId }) => ({
        url: "test/r/save",
        method: "POST",
        body: {
          result,
        },
        params: {
          testId,
          userId,
          courseId,
        },
      }),
      invalidatesTags: ["ResultTest"],
    }),
    getAllResults: builder.query<
      IResultTest[],
      {
        courseId: string | null;
        studentId: string | null;
        teacherMode: boolean;
      }
    >({
      query: ({ courseId, studentId, teacherMode }) => ({
        url: "tests/results",
        method: "GET",
        params: {
          courseId,
          studentId,
          teacherMode: teacherMode ? true : "",
        },
      }),
      transformResponse: (response: { results: IResultTest[] }) =>
        response.results,
    }),
    createTests: builder.mutation<void, ITests[]>({
      query: (schemaTest) => ({
        url: "tests",
        method: "POST",
        body: schemaTest,
      }),
      invalidatesTags: ["Tests"],
    }),
    updateTests: builder.mutation<
      void,
      { tests: ITests[]; deleteList: number[] | undefined }
    >({
      query: ({ tests, deleteList }) => ({
        url: "tests",
        method: "PUT",
        body: { tests, deleteList },
      }),
      invalidatesTags: ["Tests"],
    }),
    searchMembers: builder.mutation<
      {
        key: string;
        name: string;
      }[],
      { courseId: string | undefined; query: string }
    >({
      query: ({ courseId, query }) => ({
        url: "courses/s/members",
        method: "GET",
        params: {
          courseId,
          query,
        },
      }),
      transformResponse: (response: {
        members: {
          key: string;
          name: string;
        }[];
      }) => response.members,
    }),
    setMembers: builder.mutation<
      void,
      { membersArray: Key[]; courseId: string | undefined }
    >({
      query: ({ membersArray, courseId }) => ({
        url: "courses/members",
        method: "POST",
        body: {
          membersArray,
          courseId,
        },
      }),
      invalidatesTags: ["Members"],
    }),
    searchCourses: builder.mutation<
      { value: string; label: string }[],
      { query: string }
    >({
      query: ({ query }) => ({
        url: "courses/s",
        method: "GET",
        params: {
          query,
        },
      }),
      transformResponse: (response: {
        courses: { value: string; label: string }[];
      }) => response.courses,
    }),
    getFiles: builder.query<
      {
        files: Attachment[];
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
      keepUnusedDataFor: 0,
      providesTags: ["Attachments"],
    }),
    getMembers: builder.query<
      {
        _id: string;
        name: string;
      }[],
      { courseId: string | undefined }
    >({
      query({ courseId }) {
        return {
          url: "courses/members",
          method: "GET",
          params: {
            courseId,
          },
        };
      },
      transformResponse: (response: {
        members: { _id: string; name: string }[];
      }) => response.members,
      providesTags: ["Members"],
    }),
  }),
});

export const coursesApiHooks = coursesApi;
export const courseSliceState = courseSlice.getInitialState;
export const courseSlicerAction = courseSlice.actions;
export default courseSlice;
