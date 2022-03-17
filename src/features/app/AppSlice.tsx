import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { grantLiveApi, grantVideoApi } from "../admin-panel/api";
import { AppState, GrantPermission } from "./model";


let userJson: string | null = localStorage.getItem("app");
let init: any = JSON.parse(userJson ? userJson : `{}`);

const initialState: AppState = { ...{ isShowName: true }, ...init } as AppState;

const updateState = (state: AppState) => {
  let json = JSON.stringify(state);
  localStorage.setItem("app", json);
};

export const grantLive = createAsyncThunk<void, GrantPermission>(
  "live/grant",
  async (request, thunkApi) => {
    await grantLiveApi(request.key, request.email.toLowerCase());
  }
);

export const grantVideo = createAsyncThunk<void, GrantPermission>(
  "video/grant",
  async (request, thunkApi) => {
    await grantVideoApi(request.key, request.email.toLowerCase());
  }
);

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
