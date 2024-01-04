import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { CORE_REDUCER } from "./types";

const coreState = (state: RootState) => state[CORE_REDUCER];
export const selectUserId = createSelector(coreState, (sign) => sign.userId);
export const selectRole = createSelector(coreState, (sign) => sign.role);
export const selectLoadingScreen = createSelector(
  coreState,
  (sign) => sign.isLoadingFullScreen
);
