// src/features/auth/viewmodels/useRegister.ts
import { useRouter } from "expo-router";
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithCredential } from "firebase/auth";
import { useState } from "react";
import { Alert, Platform } from "react-native";
import { auth } from "../../../../config/firebase";
import { AUTH_MESSAGES } from "../constants/auth.messages";

export const useRegister = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", pass: "", confirmPass: "" });
  const [errors, setErrors] = useState({
    email: false,
    pass: false,
    confirmPass: false,
  });
  const [emailHint, setEmailHint] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [showGoogleWebView, setShowGoogleWebView] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const validateEmail = (email: string) => {
    const trimmed = email.trim();
    if (trimmed === "") return "Vui lòng nhập email";
    if (!email.includes("@")) return "Phải có ký tự @";
    return "";
  };

  const onRegisterPress = async () => {
    const emailMsg = validateEmail(form.email);
    const isPassEmpty = form.pass.trim() === "";
    const isConfirmError =
      form.confirmPass.trim() === "" || form.confirmPass !== form.pass;

    setEmailHint(emailMsg);
    setErrors({
      email: emailMsg !== "",
      pass: isPassEmpty,
      confirmPass: isConfirmError,
    });

    if (emailMsg !== "" || isPassEmpty || isConfirmError) return;

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, form.email.trim(), form.pass);
      
      // Lưu profile vào Firestore
      const { getFirestore, doc, setDoc } = await import('firebase/firestore');
      const db = getFirestore();
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        displayName: '',
        photoURL: '',
        bio: '',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const title = AUTH_MESSAGES.registerSuccess.title;
      const body = AUTH_MESSAGES.registerSuccess.body;
      if (Platform.OS === "web") {
        window.alert(`${title}\n${body}`);
        router.back();
      } else {
        Alert.alert(title, body, [
          { text: "Đóng", onPress: () => router.back() },
        ]);
      }
    } catch (error: any) {
      const msg =
        error.code === "auth/email-already-in-use"
          ? "Email này đã được đăng ký"
          : error.code === "auth/weak-password"
            ? "Mật khẩu phải có ít nhất 6 ký tự"
            : error.message;
      showCrossPlatformAlert("Lỗi", msg);
    } finally {
      setLoading(false);
    }
  };

  const promptGoogleRegister = () => {
    setShowGoogleWebView(true);
  };

  const handleGoogleSuccess = async (idToken: string, accessToken: string) => {
    try {
      setShowGoogleWebView(false);
      setLoading(true);
      
      console.log('[useRegister] Signing in with Firebase...');
      
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
        console.log('[useRegister] Created new user profile in Firestore');
      }
      
      await showCrossPlatformAlert("Thành công", "Đăng ký Google thành công!");
      
      // Quay về màn hình trước (login hoặc home)
      router.back();
      
      return true;
    } catch (error: any) {
      console.error('[useRegister] Firebase sign-in error:', error);
      await showCrossPlatformAlert("Lỗi", "Đăng ký Google thất bại: " + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCancel = () => {
    setShowGoogleWebView(false);
  };

  return {
    form,
    setForm,
    errors,
    emailHint,
    clearAllErrors: () => {
      setErrors({ email: false, pass: false, confirmPass: false });
      setEmailHint("");
    },
    showPass,
    setShowPass,
    showConfirm,
    setShowConfirm,
    rememberPassword,
    setRememberPassword,
    loading,
    onRegisterPress,
    promptGoogleRegister,
    googleRequestDisabled: false,
    showGoogleWebView,
    handleGoogleSuccess,
    handleGoogleCancel,
  };
};
