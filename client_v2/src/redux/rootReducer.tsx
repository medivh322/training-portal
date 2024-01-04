import { combineReducers } from "@reduxjs/toolkit";
import { reducer as coreReducer } from "./core";
import { coreApi } from "./core/reducer";
import courseSlice, { coursesApi } from "./courses/reducer";

const rootReducer = combineReducers({
  [coreReducer.name]: coreReducer.reducer,
  [courseSlice.name]: courseSlice.reducer,
  [coreApi.reducerPath]: coreApi.reducer,
  [coursesApi.reducerPath]: coursesApi.reducer,
});

export default rootReducer;
