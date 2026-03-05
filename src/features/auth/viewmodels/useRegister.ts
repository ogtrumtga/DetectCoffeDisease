// src/features/auth/viewmodels/useRegister.ts
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Platform } from "react-native";
import { AUTH_MESSAGES } from "../constants/auth.messages";

export const useRegister = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", pass: "", confirmPass: "" });
  const [errors, setErrors] = useState({
    email: false,
    pass: false,
    confirmPass: false,
  });
  const [emailHint, setEmailHint] = useState(""); // Lưu thông báo gợi ý cụ thể

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);

  // Logic kiểm tra 6 ràng buộc email
  const validateEmail = (email: string) => {
    const trimmed = email.trim();
    if (trimmed === "") return "Vui lòng nhập email";
    if (email.includes(" ")) return "Email không được chứa khoảng trắng";
    if (email.startsWith(".") || email.endsWith("."))
      return "Không được bắt đầu hoặc kết thúc bằng dấu chấm";
    if (email.includes("..")) return "Không được có hai dấu chấm liên tiếp";
    if (!email.includes("@")) return "Phải có ký tự @ (Ví dụ: user@gmail.com)";

    const parts = email.split("@");
    if (parts.length !== 2 || parts[1] === "")
      return "Sau @ phải có tên miền (Ví dụ: user@gmail.com)";
    if (!parts[1].includes("."))
      return "Tên miền phải có dấu chấm (Ví dụ: gmail.com)";

    return ""; // Hợp lệ
  };

  const clearAllErrors = () => {
    setErrors({ email: false, pass: false, confirmPass: false });
    setEmailHint("");
  };

  const onRegisterPress = () => {
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

    // Thông báo thành công đa nền tảng
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
  };

  return {
    form,
    setForm,
    errors,
    emailHint,
    clearAllErrors,
    showPass,
    setShowPass,
    showConfirm,
    setShowConfirm,
    rememberPassword,
    setRememberPassword,
    onRegisterPress,
  };
};
