import { emailValidate } from "../../app/helper";
import { Chat } from "../live/model";

export type UserInExcel = {
  register_email: string;
};

export type VideoData = {
  key: string;
  title: string;
  create_date: any;
  live_date: any;
  end_live_date: any;
  live_url: string;
  error_image: string;
  pre_live_image: string;
  channel_image: string;
  grant_users: string[];
  report_users: string[];
};

export type VideoDataForm = {
  key?: string;
  title?: string | null;
  create_date: Date;
  live_date?: Date | null;
  end_live_date?: Date | null;
  live_url?: string | null;
  error_image: string;
  pre_live_image: string;
  channel_image: string;
  grant_users: string[];
  report_users: string[];
};

export type LiveData = {
  id: string;
  title: string;
  create_date: any;
  live_date: any;
  end_live_date: any;
  live_url: string;
  error_image: string;
  pre_live_image: string;
  channel_image: string;
  grant_users: string[];
  register_users: string[];
  step: number;
  watching_count: number;
  watching_users: string[];
  timing_watching_users: number[];
  show_watching_user: boolean;
};

export type LiveDataForm = {
  key?: string;
  title?: string | null;
  create_date: Date;
  live_date?: Date | null;
  end_live_date?: Date | null;
  live_url?: string | null;
  error_image: string;
  pre_live_image: string;
  channel_image: string;
  grant_users: string[];
  show_watching_user: boolean;
};

export type State = {
  loading: boolean;
  exportRegisterUserLoading: boolean;
  exportChatsLoading: boolean;
};

export type UserData = {
  email: string;
  first_name: string;
  last_name: string;
  organization?: string;
  tel?: string;
};

export type RegisterUser = {
  email: string;
  first_name: string;
  last_name: string;
  organization: string;
  tel: string;
  watching_time: string;
};

export type RegisterUsersInfomation = {
  liveTitle: string;
  registerUsers: RegisterUser[];
};

export type ChatsInfomation = {
  liveTitle: string;
  chats: Chat[];
};

export type EndLiveRequest = {
  live_url: string;
  key: string;
};

export const excelMap = {
  อีเมล์สำหรับเข้าชมงาน: {
    prop: "register_email",
    required: true,
    // A custom `type` can be defined.
    // A `type` function only gets called for non-empty cells.
    type: (value: any) => {
      const valid = emailValidate.test(value);
      if (!valid) {
        throw new Error("Email is invalid");
      }
      return value;
    },
  },
};
