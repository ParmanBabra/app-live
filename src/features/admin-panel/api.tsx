import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { Chat } from "../live/model";
import {
  ChatsInfomation,
  EndLiveRequest,
  LiveData,
  LiveDataForm,
  RegisterUser,
  RegisterUsersInfomation,
  UserData,
  VideoDataForm,
} from "./model";

export const uploadFile = async (file: File): Promise<string> => {
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

export const updateVideo = async (data: VideoDataForm) => {
  const db = getFirestore();
  const refDoc = doc(db, "video-on-demand", data.key as string);

  await updateDoc(refDoc, {
    key: data.key,
    title: data.title,
    create_date: data.create_date,
    live_date: data.live_date,
    live_url: data.live_url,
    error_image: data.error_image,
    pre_live_image: data.pre_live_image,
    channel_image: data.channel_image,
    grant_users: data.grant_users,
    end_live_date: data.end_live_date,
  });
};

export const insertVideo = async (data: VideoDataForm) => {
  const db = getFirestore();
  const refCol = collection(db, "video-on-demand");

  const result = await addDoc(refCol, {
    key: "",
    title: data.title,
    create_date: data.create_date,
    live_date: data.live_date,
    live_url: data.live_url,
    error_image: data.error_image,
    pre_live_image: data.pre_live_image,
    channel_image: data.channel_image,
    grant_users: data.grant_users,
    end_live_date: data.end_live_date,
  });

  const refDoc = doc(db, "video-on-demand", result.id);
  await updateDoc(refDoc, {
    key: result.id,
  });
};

export const deleteVideo = async (id: string) => {
  const db = getFirestore();

  await deleteDoc(doc(db, "video-on-demand", id));
};

export const updateLive = async (data: LiveDataForm) => {
  const db = getFirestore();
  const refDoc = doc(db, "live", data.key as string);

  await updateDoc(refDoc, {
    key: data.key,
    title: data.title,
    create_date: data.create_date,
    live_date: data.live_date,
    live_url: data.live_url,
    error_image: data.error_image,
    pre_live_image: data.pre_live_image,
    channel_image: data.channel_image,
    grant_users: data.grant_users,
    show_watching_users: data.show_watching_user,
  });
};

export const insertLive = async (data: LiveDataForm) => {
  const db = getFirestore();
  const refCol = collection(db, "live");

  const result = await addDoc(refCol, {
    key: "",
    title: data.title,
    create_date: data.create_date,
    live_date: data.live_date,
    live_url: data.live_url,
    error_image: data.error_image,
    pre_live_image: data.pre_live_image,
    channel_image: data.channel_image,
    grant_users: data.grant_users,
    end_live_date: null,
    step: 1,
    register_users: [],
    watching_count: 0,
    watching_users: [],
    show_watching_users: data.show_watching_user,
  });

  const refDoc = doc(db, "live", result.id);
  await updateDoc(refDoc, {
    key: result.id,
  });
};

export const deleteLive = async (id: string) => {
  const db = getFirestore();

  await deleteDoc(doc(db, "live", id));
};

export const endLive = async (key: string) => {
  const db = getFirestore();
  const refDoc = doc(db, "live", key);

  await updateDoc(refDoc, {
    end_live_date: new Date(),
    step: 2,
  });
};

export const getAllUsers = async (): Promise<UserData[]> => {
  const db = getFirestore();

  const col = collection(db, "user-infomations");

  const docs = await getDocs(col);
  return docs.docs.map((x) => x.data() as UserData);
};

export const getRegisterUsers = async (
  key: string
): Promise<RegisterUsersInfomation> => {
  const db = getFirestore();
  const refDoc = doc(db, "live", key);
  const docLive = await getDoc(refDoc);

  let live: any = docLive.data();
  let register_users = live.register_users as string[];

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

export const getChats = async (key: string): Promise<ChatsInfomation> => {
  const db = getFirestore();
  const refDoc = doc(db, "live", key);
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

export const startNewLiveApi = async (data: EndLiveRequest) => {
  const db = getFirestore();
  const refDoc = doc(db, "live", data.key);
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

  await deleteDoc(refDoc);
};

export const grantLiveApi = async (key: string, email: string) => {
  let db = getFirestore();
  let docRef = doc(db, "live", key);
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

export const grantVideoApi = async (key: string, email: string) => {
  try {
    let db = getFirestore();
    let docRef = doc(db, "video-on-demand", key);
    let ref = await getDoc(docRef);
    let live: any = ref.data();
    let grant_users: string[] = live.grant_users;
    if (!grant_users.includes(email)) grant_users.push(email);

    await updateDoc(docRef, {
      grant_users: grant_users,
    });
  } catch (error) {
    console.log(error);
  }
};
