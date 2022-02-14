import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";

// import { createStore, combineReducers, compose } from "redux";
// import { reduxFirestore, firestoreReducer } from "redux-firestore";
// import { initializeApp } from "firebase/app";
// import "firebase/auth";
// import { getFirestore } from "firebase/firestore";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore"; // <- needed if using firestore
import { createStore, combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import { createFirestoreInstance, firestoreReducer } from "redux-firestore"; //

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

const rrfConfig = {
  // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

const rootReducer = combineReducers({
  counter: counterReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer, // <- needed if using firestore
});

const initialState = {};
export const store = createStore(rootReducer, initialState);

export const rrfProps = {
  firebase: firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance, // <- needed if using firestore
};

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
