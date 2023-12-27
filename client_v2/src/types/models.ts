import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";

export interface Model {
  test: string;
}

export interface UserSettings {
  login: string;
  password: string;
}

export type customQueryValue = QueryReturnValue<
  unknown,
  customQueryErrorValue,
  FetchBaseQueryMeta
>;

export type customQueryErrorValue = FetchBaseQueryError & {
  data: {
    message?: string;
    noNotifications?: string;
  };
};

export interface ITests {
  _id: string;
  title: string;
  course: string;
  questions: {
    _id?: string;
    title: string;
    type: "multiple" | "single";
    answers: {
      _id?: string;
      text: string;
      isCorrect: boolean;
    }[];
  }[];
}

export interface IFormTest {
  deleteTests?: number[];
  testObj: {
    _id: string;
    test_name: string;
    test_list: {
      answer_type: "single" | "multiple";
      question_name: string;
      answersList: {
        singleAnswer?: number;
        valueInput: string;
        multipleAnswers?: number[];
      }[];
    }[];
  }[];
}

export interface IResultTest {
  _id: string;
  testId: string;
  studentId: string;
  student?: string;
  title: string;
  questions: {
    title?: string;
    _id?: string;
    type: "multiple" | "single";
    questionIsCorrectResult: boolean;
    answers: {
      _id?: string;
      text?: boolean;
      isChoose: boolean;
      isCorrect: boolean;
    }[];
  }[];
}

export interface IResultTestGroup {
  results: IResultTest[];
  title: string;
}

export type Role = "Admin" | "Teacher" | "Student";
