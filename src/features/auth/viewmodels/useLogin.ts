// src/features/auth/viewmodels/useLogin.ts
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { AUTH_MESSAGES } from "../constants/auth.messages";

WebBrowser.maybeCompleteAuthSession();

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({ email: false, password: false });
  const [emailHint, setEmailHint] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // CÁCH MỚI: Dùng makeRedirectUri với tham số native để ép ra link HTTPS proxy
  // const redirectUri = AuthSession.makeRedirectUri({
  //   native: "https://auth.expo.io/@keriyu/MyNewProject",
  // });
  const redirectUri = "https://auth.expo.io/@keriyu/MyNewProject";
  const [request, response, promptAsync] = Google.useAuthRequest({
    // Sử dụng Web Client ID cho Expo Go
    clientId:
      "666124679736-e500findu3suhjfjjd36f56v6qhphlab.apps.googleusercontent.com",
    // iosClientId:
    //   "666124679736-hopigge19ut1k0tvj661hukrur20gu6o.apps.googleusercontent.com",
    // androidClientId:
    //   "666124679736-m1rcpu26ljlq3kf3hbeflvubheugk44d.apps.googleusercontent.com",
    redirectUri,
  });

  useEffect(() => {
    // Log để bạn kiểm tra link thực tế app đang gửi đi
    // if (request) console.log("Redirect URI đang dùng:", request.redirectUri);

    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        fetchUserInfo(authentication.accessToken);
      }
      showCrossPlatformAlert("Thành công", "Đăng nhập Google thành công!");
    }
  }, [response, request]);

  const fetchUserInfo = async (accessToken: string) => {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userInfo = await res.json();
      if (userInfo.email) setEmail(userInfo.email);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

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
      if (email === "chataococup@6cai.com" && password === "123456") {
        await showCrossPlatformAlert(
          AUTH_MESSAGES.loginSuccess.title,
          AUTH_MESSAGES.loginSuccess.body,
        );
        return true;
      } else {
        setErrorMessage(AUTH_MESSAGES.loginError);
        return false;
      }
    } finally {
      setLoading(false);
    }
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
    promptGoogleLogin: () => promptAsync(),
    googleRequestDisabled: !request,
  };
};
