import { initializeApp } from "firebase/app";
import {getAuth, initializeAuth,getReactNativePersistence} from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getFirestore, initializeFirestore, memoryLocalCache,setLogLevel} from "firebase/firestore"
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgIVB53xhv5qvu_9A73JVKx8u8ze4C6pg",
  authDomain: "gobowl-2c7e1.firebaseapp.com",
  projectId: "gobowl-2c7e1",
  storageBucket: "gobowl-2c7e1.firebasestorage.app",
  messagingSenderId: "783085768870",
  appId: "1:783085768870:web:4e6371485dd082f8fae467"
};
//setLogLevel("debug")
// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
//export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP)
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP,{
    persistence: getReactNativePersistence(AsyncStorage)
})
export const db = getFirestore(FIREBASE_APP)
export const firestore = getFirestore(FIREBASE_APP)

