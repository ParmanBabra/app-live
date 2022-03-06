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
  where,
  query,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  ChatsInfomation,
  EndLiveRequest,
  firstName,
  lastName,
  LiveData,
  RegisterUser,
  RegisterUsersInfomation,
  StartLiveData,
  StartLiveUpdateData,
  UserExcelData,
} from "./model";
import _ from "lodash";
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
    const refDoc = doc(db, "user-infomations", user.register_email);
    let docUser = await getDoc(refDoc);
    let userData: any = docUser.data();
    let data = {
      ...userData,
      ...{
        first_name: firstName(user),
        last_name: lastName(user),
        name: user.name,
        organization: user.organization,
        tel: user.tel,
        email: user.register_email,
      },
    };

    data = _.omitBy(data, _.isNil);

    console.log(data);
    await setDoc(refDoc, data);
    emails.push(data.email);
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

export const startNewLiveApi = async (data: EndLiveRequest) => {
  const db = getFirestore();
  const refDoc = doc(db, "live", "current");
  const liveDoc = await getDoc(refDoc);

  const live = liveDoc.data() as LiveData;

  const newVideoRef = doc(collection(db, "video-on-demand"));

  await setDoc(newVideoRef, {
    key: newVideoRef.id,
    channel_image: live.channel_image,
    create_date: live.create_date,
    end_live_date: live.end_live_date,
    error_image: live.error_image,
    grant_users: live.grant_users,
    live_date: live.live_date,
    live_url: data.live_url,
    pre_live_image: live.pre_live_image,
    title: live.title,
  });

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
    register_users: [],
    watching_count: null,
    watching_users: [],
    step: 0,
    end_live_date: null,
  });

  for (const refDocChat of refChats.docs) {
    await deleteDoc(refDocChat.ref);
  }
};

export const getChats = async (): Promise<ChatsInfomation> => {
  const db = getFirestore();
  const refDoc = doc(db, "live", "current");
  const docLive = await getDoc(refDoc);
  const refCol = collection(refDoc, "chat");
  const docChats = await getDocs(refCol);
  const chats: Chat[] = docChats.docs.map((e) => ({
    create_date: e.data().create_date.toDate(),
    message: e.data().message,
    username: e.data().username,
    email: e.data().email,
  }));

  let live: any = docLive.data();

  return {
    liveTitle: live.title as string,
    chats: chats,
  };
};

export const getRegisterUsers = async (): Promise<RegisterUsersInfomation> => {
  const db = getFirestore();
  const refDoc = doc(db, "live", "current");
  const docLive = await getDoc(refDoc);

  let live: any = docLive.data();
  let register_users = live.register_users as string[];
  console.log(register_users);

  const collectionPath = collection(db, "user-infomations");
  const batches = [];

  while (register_users.length) {
    // firestore limits batches to 10
    const batch = register_users.splice(0, 10);

    // add the batch request to to a queue
    batches.push(
      getDocs(query(collectionPath, where("email", "in", [...batch]))).then(
        (results) =>
          results.docs.map((x) => {
            let data = x.data();
            return {
              email: data.email,
              first_name: data.first_name,
              last_name: data.last_name,
              organization: data.organization,
              tel: data.tel,
            };
          })
      )
    );
  }

  let results = await Promise.all(batches);
  const registerUsers: RegisterUser[] = results.flat();

  return {
    liveTitle: live.title as string,
    registerUsers: registerUsers,
  };
};

export const grantApi = async (email: string) => {
  let db = getFirestore();
  let docRef = doc(db, "live", "current");
  let ref = await getDoc(docRef);
  let live: any = ref.data();
  let grant_users: string[] = live.grant_users;
  let register_users: string[] = live.register_users;
  if (!grant_users.includes(email)) grant_users.push(email);
  if (!register_users.includes(email)) register_users.push(email);

  await updateDoc(docRef, {
    grant_users: grant_users,
    register_users: register_users,
  });
};

export const checkPermissionApi = async (email: string): Promise<boolean> => {
  let db = getFirestore();
  let docRef = doc(db, "live", "current");
  let ref = await getDoc(docRef);
  let live: any = ref.data();

  if (live.step === 0) return true;

  return live.grant_users.includes(email);
};
