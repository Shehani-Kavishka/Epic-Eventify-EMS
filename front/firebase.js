import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA_pIxQ3OHBidDKw3mn6cFYRNa_QRVNVN4",
  authDomain: "epiceventify-8f8dd.firebaseapp.com",
  projectId: "epiceventify-8f8dd",
  storageBucket: "epiceventify-8f8dd.appspot.com",
  messagingSenderId: "411551967040",
  appId: "1:411551967040:web:f4f3e91a8bd134fac7bca5",
  measurementId: "G-QJCWGM36ZH"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export {storage};