import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  endLiveApi,
  getChats,
  startLiveApi,
  startNewLiveApi,
  uploadLiveFile,
  upsertUsers,
} from "./api";
import { StartLiveData, StartLiveUpdateData, UserExcelData } from "./model";
import writeXlsxFile from "write-excel-file";
import { Chat } from "../live/model";

const initialState = {};

type StartLiveRequest = {
  data: StartLiveData;
  users: UserExcelData[];
  preLiveImage?: File | null;
  errorImage?: File | null;
  channelImage?: File | null;
};

export const startLive = createAsyncThunk<void, StartLiveRequest>(
  "live/start",
  async (request, thunkApi) => {
    let { data } = request;
    let preLiveImageUrl = null;
    let errorImageUrl = null;
    let channelImageUrl = null;

    if (!request.preLiveImage) {
      preLiveImageUrl =
        "https://firebasestorage.googleapis.com/v0/b/app-live-36e59.appspot.com/o/stream-starting-soon.jpg?alt=media&token=0a808da2-9fa5-4adb-8fe1-3c1067a80818";
    } else {
      preLiveImageUrl = await uploadLiveFile(request.preLiveImage);
    }

    if (!request.errorImage) {
      errorImageUrl =
        "https://firebasestorage.googleapis.com/v0/b/app-live-36e59.appspot.com/o/error.jpeg?alt=media&token=9062d608-1c69-467f-96b1-b398fdccb059";
    } else {
      errorImageUrl = await uploadLiveFile(request.errorImage);
    }

    if (!request.channelImage) {
      channelImageUrl =
        "https://firebasestorage.googleapis.com/v0/b/app-live-36e59.appspot.com/o/channel.png?alt=media&token=d19a716a-28b5-4a11-881d-4b6b64dc54dd";
    } else {
      channelImageUrl = await uploadLiveFile(request.channelImage);
    }

    let grant_users = await upsertUsers(request.users);
    let saveData: StartLiveUpdateData = {
      create_date: data.createDate as Date,
      live_date: data.liveDate as Date,
      title: data.title,
      live_url: data.liveUrl,
      error_image: errorImageUrl,
      pre_live_image: preLiveImageUrl,
      channel_image: channelImageUrl,
      grant_users: grant_users,
      watching_count: 0,
      watching_users: [],
    };

    await startLiveApi(saveData);
  }
);

export const endLive = createAsyncThunk<void, void>(
  "live/end",
  async (request, thunkApi) => {
    await endLiveApi();
  }
);

export const startNewLive = createAsyncThunk<void, void>(
  "live/start_new",
  async (request, thunkApi) => {
    await startNewLiveApi();
  }
);

export const exportChats = createAsyncThunk<void, void>(
  "live/export-chats",
  async (request, thunkApi) => {
    const chats = await getChats();
    const now = new Date();

    const schema = [
      // Column #1
      {
        column: "Timestamp",
        type: String,
        value: (x: Chat) => x.create_date.toISOString(),
        width: 30,
      },
      {
        column: "Email", // Column title
        type: String,
        value: (x: Chat) => x.email,
        width: 30,
      },
      {
        column: "Name", // Column title
        type: String,
        value: (x: Chat) => x.username,
      },
      {
        column: "Message", // Column title
        type: String,
        value: (x: Chat) => x.message,
      },
    ];

    console.log(chats);

    try {
      await writeXlsxFile(chats, {
        schema: schema,
        fileName: `chats.xlsx`,
      });
    } catch (e) {
      console.log(e);
    }
  }
);

export const userSlice = createSlice({
  name: "live",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  extraReducers: (builder) => {
  },
});

export const {} = userSlice.actions;

export default userSlice.reducer;