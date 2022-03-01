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
  let docRef = doc(db, "user-infomations", email.trim().toLowerCase());
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

  let docUser = doc(db, "user-infomations", request.email.trim().toLowerCase());
  let refUser = await getDoc(docUser);
  let dataUser = refUser.data();

  let user: any = {
    email: request.email.trim().toLowerCase(),
    first_name: request.firstName,
    last_name: request.lastName,
    name: `${request.firstName} ${request.lastName}`,
    organization: request.organization,
    tel: request.tel,
  };

  let result = {
    ...dataUser,
    ...user,
  };

  await setDoc(
    doc(db, "user-infomations", request.email.trim().toLowerCase()),
    result
  );

  return result as RegisterResult;
};
