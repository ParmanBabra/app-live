import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { grantApi, loginApi, registerApi } from "./api";
import {
  LoginRequest,
  LoginResult,
  RegisterRequest,
  RegisterResult,
  UserState,
} from "./model";

let userJson: string | null = localStorage.getItem("user");
let init: any = JSON.parse(userJson ? userJson : `{}`);

const initialState: UserState = init as UserState;

export const login = createAsyncThunk<LoginResult | null, LoginRequest>(
  "user/login",
  async (request, thunkApi) => {
    const response = await loginApi(request.email.toLowerCase());
    if (!response) throw "Email address not found";

    if (request.rememberMe) {
      let user: UserState = {
        email: response.email,
        name: response.name,
        isAdmin: response.is_admin,
        firstName: response.first_name,
        lastName: response.last_name,
        isLogin: true,
      };

      localStorage.setItem("user", JSON.stringify(user));
    }
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const register = createAsyncThunk<RegisterResult, RegisterRequest>(
  "user/register",
  async (request, thunkApi) => {
    let result = await registerApi(request);
    await grantApi(result.email);

    return result;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    logout: (state) => {
      // console.log(firestore);
      // const firestore = useFirestore();
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.email = null;
      state.name = null;
      state.isAdmin = null;
      state.firstName = null;
      state.lastName = null;
      state.isLogin = false;
      localStorage.setItem("user", "");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.email = action.payload?.email;
        state.name = action.payload?.name;
        state.isAdmin = action.payload?.is_admin;
        state.firstName = action.payload?.first_name;
        state.lastName = action.payload?.last_name;
        state.isLogin = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.email = null;
        state.name = null;
        state.firstName = null;
        state.lastName = null;
        state.isAdmin = null;
        state.isLogin = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.email = action.payload?.email;
        state.name = action.payload?.name;
        state.isAdmin = false;
        state.firstName = action.payload?.first_name;
        state.lastName = action.payload?.last_name;
        state.isLogin = true;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
