import { combineReducers } from "@reduxjs/toolkit";
import { reducer as coreReducer } from "./core";
import { coreApi } from "./core/reducer";
import { coursesApi } from "./courses/reducer";

const rootReducer = combineReducers({
  [coreReducer.name]: coreReducer.reducer,
  [coreApi.reducerPath]: coreApi.reducer,
  [coursesApi.reducerPath]: coursesApi.reducer,
});

export default rootReducer;
