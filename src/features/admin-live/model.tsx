import { emailValidate } from "../../app/helper";
import { Chat } from "../live/model";

export type UserExcelData = {
  date: Date;
  email: string;
  register_email: string;
  name: string;
  organization: string;
  tel: string;
};

export type StartLiveData = {
  title: string;
  createDate: Date;
  liveDate?: Date | null;
  liveUrl: string;
};

export type StartLiveUpdateData = {
  title: string;
  create_date: Date;
  live_date: Date;
  live_url: string;
  error_image: string;
  pre_live_image: string;
  channel_image: string;
  grant_users: string[];
  register_users: string[];
  watching_count: number;
  watching_users: string[];
};

export type ChatsInfomation = {
  liveTitle: string;
  chats: Chat[];
};

export type RegisterUser = {
  email: string;
  first_name: string;
  last_name: string;
  organization: string;
  tel: string;
};

export type RegisterUsersInfomation = {
  liveTitle: string;
  registerUsers: RegisterUser[];
};

export const excelMap = {
  Timestamp: {
    prop: "date",
  },
  "Email Address": {
    prop: "email",
  },
  "ชื่อ - นามสกุล": {
    prop: "name",
    required: true,
    type: String
  },
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
  หน่วยงาน: {
    prop: "organization",
  },
  หมายเลขโทรศัพท์: {
    prop: "tel",
  },
};

export const firstName = (user: UserExcelData): string => {
  return user.name.split(" ")[0];
};

export const lastName = (user: UserExcelData): string => {
  const names = user.name.split(" ");
  if (names.length <= 1) {
    return "";
  }

  return names[1];
};
