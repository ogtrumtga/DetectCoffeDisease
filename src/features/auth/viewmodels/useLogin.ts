// src/features/auth/viewmodels/useLogin.ts
import { useState } from "react";
import { Alert, Platform } from "react-native";
import { AUTH_MESSAGES } from "../constants/auth.messages";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [errors, setErrors] = useState({ email: false, password: false });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const clearAllErrors = () => {
    setErrors({ email: false, password: false });
    setErrorMessage("");
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

    setErrorMessage("");

    const isEmailEmpty = email.trim() === "";
    const isPassEmpty = password.trim() === "";

    setErrors({
      email: isEmailEmpty,
      password: isPassEmpty,
    });

    if (isEmailEmpty || isPassEmpty) {
      return false;
    }

    try {
      setLoading(true);

      // 🔹 giả lập API delay
      await new Promise((r) => setTimeout(r, 700));

      if (email === "chataococup.6cai" && password === "123456") {
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
    errorMessage,
    loading,
    clearAllErrors,
    onLoginPress,
  };
};
