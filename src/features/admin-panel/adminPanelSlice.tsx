import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import writeXlsxFile from "write-excel-file";
import { Chat } from "../live/model";
import {
  deleteLive as deleteLiveAPI,
  deleteVideo as deleteVideoAPI, endLive as endLiveAPI, getAllUsers, getChats, getRegisterUsers, insertLive as insertLiveAPI,
  insertVideo as insertVideoAPI, startNewLiveApi, updateLive as updateLiveAPI,
  updateVideo as updateVideoAPI, uploadFile
} from "./api";
import {
  EndLiveRequest,
  LiveDataForm,
  RegisterUser,
  State,
  UserData,
  VideoDataForm
} from "./model";

const initialState: State = {
  loading: false,
  exportRegisterUserLoading: false,
  exportChatsLoading: false,
};

type UpdateVideoRequest = {
  data: VideoDataForm;
  grant_users: string[];
  pre_live_image?: File | null;
  error_image?: File | null;
  channel_image?: File | null;
};

type UpdateLiveRequest = {
  data: LiveDataForm;
  grant_users: string[];
  pre_live_image?: File | null;
  error_image?: File | null;
  channel_image?: File | null;
};

export const updateVideo = createAsyncThunk<void, UpdateVideoRequest>(
  "video/update",
  async (request, thunkApi) => {
    let { data, grant_users, pre_live_image, error_image, channel_image } =
      request;

    if (pre_live_image) {
      data.pre_live_image = await uploadFile(pre_live_image);
    }

    if (error_image) {
      data.error_image = await uploadFile(error_image);
    }

    if (channel_image) {
      data.channel_image = await uploadFile(channel_image);
    }

    data.grant_users = grant_users;
    await updateVideoAPI(data);
  }
);

export const insertVideo = createAsyncThunk<void, UpdateVideoRequest>(
  "video/insert",
  async (request, thunkApi) => {
    let { data, grant_users, pre_live_image, error_image, channel_image } =
      request;

    if (pre_live_image) {
      data.pre_live_image = await uploadFile(pre_live_image);
    }

    if (error_image) {
      data.error_image = await uploadFile(error_image);
    }

    if (channel_image) {
      data.channel_image = await uploadFile(channel_image);
    }

    data.grant_users = grant_users;
    await insertVideoAPI(data);
  }
);

export const deleteVideo = createAsyncThunk<void, string>(
  "video/delete",
  async (request, thunkApi) => {
    await deleteVideoAPI(request);
  }
);

export const updateLive = createAsyncThunk<void, UpdateLiveRequest>(
  "live/update",
  async (request, thunkApi) => {
    let { data, grant_users, pre_live_image, error_image, channel_image } =
      request;

    if (pre_live_image) {
      data.pre_live_image = await uploadFile(pre_live_image);
    }

    if (error_image) {
      data.error_image = await uploadFile(error_image);
    }

    if (channel_image) {
      data.channel_image = await uploadFile(channel_image);
    }

    data.grant_users = grant_users;

    await updateLiveAPI(data);
  }
);

export const insertLive = createAsyncThunk<void, UpdateLiveRequest>(
  "live/insert",
  async (request, thunkApi) => {
    let { data, grant_users, pre_live_image, error_image, channel_image } =
      request;

    if (pre_live_image) {
      data.pre_live_image = await uploadFile(pre_live_image);
    }

    if (error_image) {
      data.error_image = await uploadFile(error_image);
    }

    if (channel_image) {
      data.channel_image = await uploadFile(channel_image);
    }

    data.grant_users = grant_users;
    await insertLiveAPI(data);
  }
);

export const endLive = createAsyncThunk<void, string>(
  "live/end",
  async (request, thunkApi) => {
    await endLiveAPI(request);
  }
);

export const deleteLive = createAsyncThunk<void, string>(
  "live/delete",
  async (request, thunkApi) => {
    await deleteLiveAPI(request);
  }
);

export const exportAllUsers = createAsyncThunk<void, void>(
  "users/export-users",
  async (request, thunkApi) => {
    const users = await getAllUsers();

    const schema = [
      {
        column: "email",
        type: String,
        value: (x: UserData) => {
          return x.email == null ? "" : x.email;
        },
        width: 30,
      },
      {
        column: "First Name",
        type: String,
        value: (x: UserData) => (x.first_name == null ? "" : x.first_name),
        width: 30,
      },
      {
        column: "Last Name",
        type: String,
        value: (x: UserData) => (x.last_name == null ? "" : x.last_name),
      },
      {
        column: "Organization",
        type: String,
        value: (x: UserData) => convertEmpty(x.organization),
      },
      {
        column: "Phonenumber",
        type: String,
        value: (x: UserData) => {
          return convertEmpty(x.tel);
        },
      },
    ];

    try {
      console.log(users);
      await writeXlsxFile(users, {
        schema: schema,
        fileName: `users.xlsx`,
      });
    } catch (e) {
      console.log(e);
    }
  }
);

export const exportRegisterUsers = createAsyncThunk<void, string>(
  "live/export-register-users",
  async (request, thunkApi) => {
    const live = await getRegisterUsers(request);

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
      await writeXlsxFile(live.registerUsers, {
        schema: schema,
        fileName: `register_users_${live.liveTitle.replace(" ", "_")}.xlsx`,
      });
    } catch (e) {
      console.log(e);
    }
  }
);

export const exportChats = createAsyncThunk<void, string>(
  "live/export-chats",
  async (request, thunkApi) => {
    const live = await getChats(request);
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

export const toVideo = createAsyncThunk<void, EndLiveRequest>(
  "live/to_video",
  async (request, thunkApi) => {
    await startNewLiveApi(request);
  }
);

const convertEmpty = (value: string | null | undefined) => {
  if (value === null) return "";
  if (value === undefined) return "";
  if (!value) return "";

  if (typeof value === "number") {
    let numberValue = value as number;
    return numberValue.toString();
  }

  try {
    return value.trim();
  } catch (error) {
    return "";
  }
};
export const adminSlice = createSlice({
  name: "admin",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateVideo.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(insertVideo.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(insertVideo.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteVideo.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateLive.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateLive.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(insertLive.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(insertLive.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteLive.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteLive.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(exportAllUsers.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(exportAllUsers.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(toVideo.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(toVideo.pending, (state, action) => {
        state.loading = true;
      });
  },
});

export const {} = adminSlice.actions;

export default adminSlice.reducer;
