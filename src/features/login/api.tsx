import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { RootState, AppThunk } from "../../app/store";
import { LoginResult, RegisterRequest, RegisterResult } from "./model";

export const loginApi = async (email: string) => {
  let db = getFirestore();
  let docRef = doc(db, "user-infomations", email.toLowerCase());
  let ref = await getDoc(docRef);
  let user = ref.data();

  if (!user) return null;

  user = { ...user, ...{ email } };

  return user as LoginResult;
};

export const registerApi = async (
  request: RegisterRequest
): Promise<RegisterResult> => {
  let db = getFirestore();

  let user: RegisterResult = {
    email: request.email,
    first_name: request.firstName,
    last_name: request.lastName,
    name: `${request.firstName} ${request.lastName}`,
    organization: request.organization,
    tel: request.tel,
  };

  await setDoc(doc(db, "user-infomations", request.email), user);

  return user;
};

export const grantApi = async (email: string) => {
  let db = getFirestore();
  let docRef = doc(db, "live", "current");
  let ref = await getDoc(docRef);
  let live: any = ref.data();
  live.grant_users.push(email);

  await updateDoc(docRef, { grant_users: live.grant_users });
};
