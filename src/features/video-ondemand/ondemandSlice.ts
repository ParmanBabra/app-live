import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import _ from "lodash";


export const register = createAsyncThunk<void, string>(
  "ondemand/register",
  async (request, thunkApi) => {
    // let db = getFirestore();
    // let ref = doc(db, "video-on-demand", request);
    // let docData = await getDoc(ref);
    // let data: any = docData.data();
    // let grant_users: string[] = data.grant_users;

    // console.log(data);

    // grant_users = _.union(grant_users, emails);

    // await updateDoc(ref, { grant_users });
  }
);

export const ondemandSlice = createSlice({
  name: "ondemand",
  initialState: {},
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  extraReducers: (builder) => {},
});

export const {} = ondemandSlice.actions;

export default ondemandSlice.reducer;
