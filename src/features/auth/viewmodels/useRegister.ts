// src/features/auth/viewmodels/useRegister.ts
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { auth } from "../../../../config/firebase";
import { AUTH_MESSAGES } from "../constants/auth.messages";

WebBrowser.maybeCompleteAuthSession();

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

  // Giống login: hardcode proxy URI
  const redirectUri = "https://auth.expo.io/@keriyu/MyNewProject";

  const [request, response, promptAsync] = Google.useAuthRequest({
    // Chỉ dùng Web Client ID, giống login
    clientId:
      "666124679736-e500findu3suhjfjjd36f56v6qhphlab.apps.googleusercontent.com",
    redirectUri,
  });

  useEffect(() => {
    // Log kiểm tra URI, giống login
    if (request) console.log("Redirect URI đang dùng:", request.redirectUri);

    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        fetchUserInfo(authentication.accessToken);
      }
      showCrossPlatformAlert("Thành công", "Đăng ký Google thành công!");
    }

    if (response?.type === "error") {
      console.error("Google auth error:", response.error);
      showCrossPlatformAlert("Lỗi", "Đăng ký Google thất bại!");
    }
  }, [response, request]);

  const fetchUserInfo = async (accessToken: string) => {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userInfo = await res.json();
      if (userInfo.email) {
        setForm((prev) => ({ ...prev, email: userInfo.email }));
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
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
      await createUserWithEmailAndPassword(auth, form.email.trim(), form.pass);
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
    }
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
    onRegisterPress,
    promptGoogleRegister: () => promptAsync(),
    googleRequestDisabled: !request,
  };
};
