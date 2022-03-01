import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "./model";

let userJson: string | null = localStorage.getItem("app");
let init: any = JSON.parse(userJson ? userJson : `{}`);

const initialState: AppState = { ...{ isShowName: true }, ...init } as AppState;

const updateState = (state: AppState) => {
  let json = JSON.stringify(state);
  localStorage.setItem("app", json);
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    toggleShowName: (state) => {
      state.isShowName = !state.isShowName;
      updateState(state);
    },
  },
  extraReducers: (builder) => {},
});

export const { toggleShowName } = appSlice.actions;

export default appSlice.reducer;
