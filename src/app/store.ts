import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";

import { createStore, combineReducers, compose } from "redux";
import { reduxFirestore, firestoreReducer } from "redux-firestore";
import { initializeApp } from "firebase/app";
import "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdcu_2VyDQmQxK6KuC9fRWFSZh8w3grSU",
  authDomain: "app-live-36e59.firebaseapp.com",
  databaseURL:
    "https://app-live-36e59-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "app-live-36e59",
  storageBucket: "app-live-36e59.appspot.com",
  messagingSenderId: "381229955097",
  appId: "1:381229955097:web:b0696262749efbdb055288",
  measurementId: "G-PS5X0QZMYH",
};
const rfConfig = {}; 

const app = initializeApp(firebaseConfig);
initializeFirestore(app, {});

const createStoreWithFirebase = compose(
  reduxFirestore(app, rfConfig) 
)(createStore);

const rootReducer = combineReducers({
  counter: counterReducer,
  firestore: firestoreReducer,
});

// Create store with reducers and initial state
const initialState = {};
export const store = createStoreWithFirebase(rootReducer, initialState);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
