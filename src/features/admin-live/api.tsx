import { v4 as uuidv4 } from "uuid";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteField,
  deleteDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  firstName,
  lastName,
  StartLiveData,
  StartLiveUpdateData,
  UserExcelData,
} from "./model";
import { Chat } from "../live/model";

export const uploadLiveFile = async (file: File): Promise<string> => {
  const id = uuidv4();
  const extension = file.name.split(".").pop();
  const storage = getStorage();
  const storageRef = ref(storage, `live-image/${id}.${extension}`);

  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(
    ref(storage, `live-image/${id}.${extension}`)
  );

  return url;
};

export const upsertUsers = async (
  users: UserExcelData[]
): Promise<string[]> => {
  const db = getFirestore();
  let emails = [];

  for (const user of users) {
    const refDoc = doc(db, "user-infomations", user.email);
    await setDoc(refDoc, {
      first_name: firstName(user),
      last_name: lastName(user),
      name: user.name,
      organization: user.organization,
      tel: user.tel,
      email: user.email,
      is_admin: false,
    });
    emails.push(user.email);
  }

  return emails;
};

export const startLiveApi = async (data: StartLiveUpdateData) => {
  const db = getFirestore();
  const refDoc = doc(db, "live", "current");

  await setDoc(refDoc, { ...data, ...{ step: 1 } });
};

export const endLiveApi = async () => {
  const db = getFirestore();
  const refDoc = doc(db, "live", "current");

  await updateDoc(refDoc, { step: 2, end_live_date: new Date() });
};

export const startNewLiveApi = async () => {
  const db = getFirestore();
  const refDoc = doc(db, "live", "current");

  const refCol = collection(refDoc, "chat");
  const refChats = await getDocs(refCol);

  await setDoc(refDoc, {
    title: null,
    create_date: null,
    live_date: null,
    live_url: null,
    error_image: null,
    pre_live_image: null,
    grant_users: [],
    watching_count: null,
    watching_users: [],
    step: 0,
    end_live_date: null,
  });

  for (const refDocChat of refChats.docs) {
    await deleteDoc(refDocChat.ref);
  }
};

export const getChats = async (): Promise<Chat[]> => {
  const db = getFirestore();
  const refDoc = doc(db, "live", "current");
  const refCol = collection(refDoc, "chat");
  const refChats = await getDocs(refCol);
  const chats: Chat[] = refChats.docs.map((e) => ({
    create_date: e.data().create_date.toDate(),
    message: e.data().message,
    username: e.data().username,
    email: e.data().email,
  }));

  return chats;
};
