export type UserExcelData = {
  date: Date;
  email: string;
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
  watching_count: number;
  watching_users: string[];
};

export const excelMap = {
  Timestamp: "date",
  "Email Address": "email",
  "ชื่อ - นามสกุล": "name",
  อีเมล์สำหรับเข้าชมงาน: "email",
  หน่วยงาน: "organization",
  หมายเลขโทรศัพท์: "tel",
};

export const firstName = (user: UserExcelData): string => {
  return user.name.split(" ")[0];
};

export const lastName = (user: UserExcelData): string => {
  const names = user.name.split(" ");
  if (names.length == 1) {
    return "";
  }

  return names[1];
};
