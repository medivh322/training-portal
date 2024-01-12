import { combineReducers } from "@reduxjs/toolkit";
import { reducer as coreSlice } from "./core";
import { coreApi } from "./core/reducer";
import courseSlice, { coursesApi } from "./courses/reducer";
import { reducer as articlesApi } from "./articles";

const rootReducer = combineReducers({
  [coreSlice.name]: coreSlice.reducer,
  [courseSlice.name]: courseSlice.reducer,
  [coreApi.reducerPath]: coreApi.reducer,
  [coursesApi.reducerPath]: coursesApi.reducer,
  [articlesApi.reducerPath]: articlesApi.reducer,
});

export default rootReducer;
