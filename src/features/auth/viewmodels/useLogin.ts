// src/features/auth/viewmodels/useLogin.ts
import { useState } from "react";
import { Alert, Platform } from "react-native";
import { AUTH_MESSAGES } from "../constants/auth.messages";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [errors, setErrors] = useState({ email: false, password: false });
  const [emailHint, setEmailHint] = useState(""); // Gợi ý email
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (emailStr: string) => {
    const trimmed = emailStr.trim();
    if (trimmed === "") return "Vui lòng nhập email";
    if (emailStr.includes(" ")) return "Email không được có khoảng trắng";
    if (emailStr.startsWith(".") || emailStr.endsWith("."))
      return "Không được bắt đầu/kết thúc bằng dấu chấm";
    if (emailStr.includes("..")) return "Không được có hai dấu chấm liên tiếp";
    if (!emailStr.includes("@")) return "Thiếu ký tự @ (Ví dụ: ten@gmail.com)";

    const parts = emailStr.split("@");
    if (parts.length !== 2 || parts[1] === "")
      return "Thiếu tên miền sau @ (Ví dụ: user@gmail.com)";
    if (!parts[1].includes("."))
      return "Tên miền cần có dấu chấm (Ví dụ: .com)";

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
    setErrorMessage("");

    const emailMsg = validateEmail(email);
    const isPassEmpty = password.trim() === "";

    setEmailHint(emailMsg);
    setErrors({
      email: emailMsg !== "",
      password: isPassEmpty,
    });

    if (emailMsg !== "" || isPassEmpty) {
      return false;
    }

    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 700));

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
  };
};
