import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from '@firebase/firestore';
import { getStorage } from "firebase/storage";
import { getPerformance } from "firebase/performance";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBd7jR6EuB0tj8tw6op2VzdubR6hn7hJPU",
    authDomain: "vcarddo-2b240.firebaseapp.com",
    projectId: "vcarddo-2b240",
    storageBucket: "vcarddo-2b240.appspot.com",
    messagingSenderId: "885463388827",
    appId: "1:885463388827:web:95a070095afa7a7eb56c3e",
    measurementId: "G-34R8L1M34S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const perf = getPerformance(app);
export const auth = getAuth(app);

// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);