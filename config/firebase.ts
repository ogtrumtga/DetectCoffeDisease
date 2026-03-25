import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

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

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default app;
