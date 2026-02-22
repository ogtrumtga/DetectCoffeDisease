// src/features/auth/viewmodels/useLogin.ts
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { AUTH_MESSAGES } from '../constants/auth.messages';

export const useRegister = () => {
    const router = useRouter();
    // STATE: dữ liệu form đăng ký (email, pass, comfirm pass)
    const [form, setForm] = useState({ email: '', pass: '', confirmPass: '' });
    // STATE: trạng thái lỗi (dùng để highlight xanh các ô input nếu nhập sai/thiếu)
    const [errors, setErrors] = useState({ email: false, pass: false, confirmPass: false });

    // STATE: hiển thị mật khẩu (ẩn/hiện)
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    // STATE: ghi nhớ mật khẩu (lưu thông tin vào bộ nhớ máy)
    const [rememberPassword, setRememberPassword] = useState(false);

    // Reset toàn bộ lỗi 
    const clearAllErrors = () => {
        setErrors({ email: false, pass: false, confirmPass: false });
    };


    const onRegisterPress = () => {
        // VALIDATION: Kiểm tra dữ liệu đầu vào trước khi gửi đi
        const isEmailEmpty = form.email.trim() === '';
        const isPassEmpty = form.pass.trim() === '';
        // Kiểm tra confirm password có trống hoặc không khớp với password không
        const isConfirmError = form.confirmPass.trim() === '' || form.confirmPass !== form.pass;

        // UI: Cập nhật viền xanh cho các ô lỗi
        setErrors({
            email: isEmailEmpty,
            pass: isPassEmpty,
            confirmPass: isConfirmError
        });

        // STOP: Nếu dữ liệu chưa chuẩn thì dừng lại, không gọi lên Server
        if (isEmailEmpty || isPassEmpty || isConfirmError) {
            return;
        }

        // POST: gửi thông tin đăng nhập lên server

        // UI: Thông báo thành công và điều hướng người dùng
        Alert.alert(
            AUTH_MESSAGES.registerSuccess.title,
            AUTH_MESSAGES.registerSuccess.body,
            [
                {
                    text: "Đóng",
                    onPress: () => router.back() // Quay lại màn login sau khi nhấn OK
                }
            ]
        );
    };

    return {
        form, setForm,
        errors,
        clearAllErrors,
        showPass, setShowPass,
        showConfirm, setShowConfirm,
        rememberPassword, setRememberPassword,
        onRegisterPress
    };
};