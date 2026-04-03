import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAe8OgRrDhgalVG_E3GMpAaCwHIh50kvn8",
  authDomain: "coffe-detect.firebaseapp.com",
  projectId: "coffe-detect",
  storageBucket: "coffe-detect.firebasestorage.app",
  messagingSenderId: "824481768502",
  appId: "1:824481768502:web:48d48b0a0bf59d88602497",
  measurementId: "G-X9LYV4WPL4",
};

const app = initializeApp(firebaseConfig);

// Khởi tạo Auth - Firebase tự động xử lý persistence cho React Native
export const auth = getAuth(app);

// Firestore (Cloud Firestore) để lưu user/profile/history/posts/notifications
export const db = getFirestore(app);

export default app;
