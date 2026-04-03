// src/features/auth/viewmodels/useLogin.ts
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, Platform } from "react-native";
import { auth } from "../../../../config/firebase";
import { AUTH_MESSAGES } from "../constants/auth.messages";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({ email: false, password: false });
  const [emailHint, setEmailHint] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGoogleWebView, setShowGoogleWebView] = useState(false);

  const validateEmail = (emailStr: string) => {
    const trimmed = emailStr.trim();
    if (trimmed === "") return "Vui lòng nhập email";
    if (!emailStr.includes("@")) return "Email không hợp lệ";
    return "";
  };

  const clearAllErrors = () => {
    setErrors({ email: false, password: false });
    setErrorMessage("");
    setEmailHint("");
  };

  const showCrossPlatformAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n${message}`);
      return Promise.resolve(true);
    }
    return new Promise<boolean>((resolve) => {
      Alert.alert(title, message, [
        { text: "OK", onPress: () => resolve(true) },
      ]);
    });
  };

  const onLoginPress = async (): Promise<boolean> => {
    if (loading) return false;
    const emailMsg = validateEmail(email);
    const isPassEmpty = password.trim() === "";
    setEmailHint(emailMsg);
    setErrors({ email: emailMsg !== "", password: isPassEmpty });
    if (emailMsg !== "" || isPassEmpty) return false;

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      await showCrossPlatformAlert(
        AUTH_MESSAGES.loginSuccess.title,
        AUTH_MESSAGES.loginSuccess.body
      );
      return true;
    } catch (error: any) {
      const msg =
        error.code === "auth/invalid-credential" ||
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found"
          ? AUTH_MESSAGES.loginError
          : error.message;
      setErrorMessage(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const promptGoogleLogin = () => {
    setShowGoogleWebView(true);
  };

  const handleGoogleSuccess = async (idToken: string, accessToken: string) => {
    try {
      setShowGoogleWebView(false);
      setLoading(true);

      console.log('[useLogin] Signing in with Firebase...');

      // Ưu tiên dùng ID token
      const credential = idToken
        ? GoogleAuthProvider.credential(idToken)
        : GoogleAuthProvider.credential(null, accessToken);

      const userCredential = await signInWithCredential(auth, credential);

      // Lưu profile vào Firestore nếu là user mới
      const { getFirestore, doc, getDoc, setDoc } = await import('firebase/firestore');
      const db = getFirestore();
      const userRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // User mới - tạo profile trong Firestore
        await setDoc(userRef, {
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || '',
          photoURL: userCredential.user.photoURL || '',
          bio: '',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log('[useLogin] Created new user profile in Firestore');
      }

      await showCrossPlatformAlert("Thành công", "Đăng nhập Google thành công!");

      // Trả về true để loginView biết đăng nhập thành công
      return true;
    } catch (error: any) {
      console.error('[useLogin] Firebase sign-in error:', error);
      setErrorMessage("Đăng nhập Google thất bại: " + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCancel = () => {
    setShowGoogleWebView(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPass,
    setShowPass,
    errors,
    emailHint,
    errorMessage,
    loading,
    clearAllErrors,
    onLoginPress,
    promptGoogleLogin,
    googleRequestDisabled: false,
    showGoogleWebView,
    handleGoogleSuccess,
    handleGoogleCancel,
  };
};
