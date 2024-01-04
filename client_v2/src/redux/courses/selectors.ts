import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { COURSES_REDUCER } from "./types";

const courseState = (state: RootState) => state[COURSES_REDUCER];
export const selectUploadingFile = createSelector(
  courseState,
  (sign) => sign.uploadingFile
);
