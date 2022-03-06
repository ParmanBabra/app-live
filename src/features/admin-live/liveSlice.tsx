import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  endLiveApi,
  getChats,
  getRegisterUsers,
  startLiveApi,
  startNewLiveApi,
  uploadLiveFile,
  upsertUsers,
} from "./api";
import {
  EndLiveRequest,
  RegisterUser,
  StartLiveData,
  StartLiveUpdateData,
  UserExcelData,
} from "./model";
import writeXlsxFile from "write-excel-file";
import { Chat } from "../live/model";
import { getStorage } from "firebase/storage";
import { rrfProps } from "../../app/store";

const initialState = {
  loading: false,
  exportRegisterUserLoading: false,
  exportChatsLoading: false,
};

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

    // let e = getStorage(rrfProps.firebase.apps[0], "stream-starting-soon.jpg");

    // console.log(e);

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
      register_users: [],
      watching_count: 0,
      watching_users: [],
      show_watching_users: data.showWatchingUser,
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

export const startNewLive = createAsyncThunk<void, EndLiveRequest>(
  "live/start_new",
  async (request, thunkApi) => {
    await startNewLiveApi(request);
  }
);

export const exportRegisterUsers = createAsyncThunk<void, void>(
  "live/export-register-users",
  async (request, thunkApi) => {
    const live = await getRegisterUsers();

    const schema = [
      // Column #1
      {
        column: "email",
        type: String,
        value: (x: RegisterUser) => x.email,
        width: 30,
      },
      {
        column: "First Name", // Column title
        type: String,
        value: (x: RegisterUser) => x.first_name,
        width: 30,
      },
      {
        column: "Last Name", // Column title
        type: String,
        value: (x: RegisterUser) => x.last_name,
      },
      {
        column: "Organization", // Column title
        type: String,
        value: (x: RegisterUser) => x.organization,
      },
      {
        column: "Phonenumber", // Column title
        type: String,
        value: (x: RegisterUser) => x.tel,
      },
    ];

    try {
      console.log(live.registerUsers);
      await writeXlsxFile(live.registerUsers, {
        schema: schema,
        fileName: `register_users_${live.liveTitle.replace(" ", "_")}.xlsx`,
      });
    } catch (e) {
      console.log(e);
    }
  }
);

export const exportChats = createAsyncThunk<void, void>(
  "live/export-chats",
  async (request, thunkApi) => {
    const live = await getChats();
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

    try {
      await writeXlsxFile(live.chats, {
        schema: schema,
        fileName: `chats_${live.liveTitle.replace(" ", "_")}.xlsx`,
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
    builder
      .addCase(startLive.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(startLive.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(startLive.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(exportRegisterUsers.fulfilled, (state, action) => {
        state.exportRegisterUserLoading = false;
      })
      .addCase(exportRegisterUsers.pending, (state, action) => {
        state.exportRegisterUserLoading = true;
      })
      .addCase(exportRegisterUsers.rejected, (state, action) => {
        state.exportRegisterUserLoading = false;
      })
      .addCase(exportChats.fulfilled, (state, action) => {
        state.exportChatsLoading = false;
      })
      .addCase(exportChats.pending, (state, action) => {
        state.exportChatsLoading = true;
      })
      .addCase(exportChats.rejected, (state, action) => {
        state.exportChatsLoading = false;
      });
  },
});

export const {} = userSlice.actions;

export default userSlice.reducer;
