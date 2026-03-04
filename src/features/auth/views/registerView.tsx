// src/features/auth/views/registerView.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Mail, Eye, EyeOff, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { authStyles as styles } from '../styles/auth.styles';
import { useRegister } from '../viewmodels/useRegister';
import { Colors } from '../constants/Colors';

const GOOGLE_LOGO_URI = "https://cdn-icons-png.flaticon.com/512/2991/2991148.png";

export default function RegisterScreen() {
    const router = useRouter();
    const {
        form, setForm,
        errors, emailHint,
        clearAllErrors,
        showPass, setShowPass,
        showConfirm, setShowConfirm,
        rememberPassword, setRememberPassword,
        onRegisterPress
    } = useRegister();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ChevronLeft size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đăng ký</Text>
            </View>

            <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
                {/* Email */}
                <Text style={styles.label}>Email</Text>
                <View style={[styles.inputContainer, errors.email && { borderColor: Colors.alertBorder }]}>
                    <TextInput
                        style={styles.input}
                        placeholder=""
                        value={form.email}
                        onChangeText={(t) => setForm({ ...form, email: t })}
                        onFocus={clearAllErrors}
                        autoCapitalize="none"
                    />
                    <Mail size={24} color="black" style={styles.iconRight} />
                </View>
                {errors.email && <Text style={{ color: Colors.error, fontSize: 12, marginTop: 4 }}>{emailHint}</Text>}

                {/* Mật khẩu */}
                <Text style={styles.label}>Mật khẩu</Text>
                <View style={[styles.inputContainer, errors.pass && { borderColor: Colors.alertBorder }]}>
                    <TextInput
                        style={styles.input} secureTextEntry={!showPass}
                        onChangeText={(t) => setForm({ ...form, pass: t })}
                        onFocus={clearAllErrors}
                    />
                    <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                        {showPass ? <EyeOff size={24} color="black" style={styles.iconRight} /> : <Eye size={24} color="black" style={styles.iconRight} />}
                    </TouchableOpacity>
                </View>

                {/* Xác nhận mật khẩu */}
                <Text style={styles.label}>Xác nhận mật khẩu</Text>
                <View style={[styles.inputContainer, errors.confirmPass && { borderColor: Colors.alertBorder }]}>
                    <TextInput
                        style={styles.input} secureTextEntry={!showConfirm}
                        onChangeText={(t) => setForm({ ...form, confirmPass: t })}
                        onFocus={clearAllErrors}
                    />
                    <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                        {showConfirm ? <EyeOff size={24} color="black" style={styles.iconRight} /> : <Eye size={24} color="black" style={styles.iconRight} />}
                    </TouchableOpacity>
                </View>

                <View style={styles.rememberContainer}>
                    <Text style={{ color: Colors.grayText }}>Nhớ mật khẩu</Text>
                    <TouchableOpacity onPress={() => setRememberPassword(!rememberPassword)}>
                        <View style={[styles.radioOuter, rememberPassword && styles.radioActiveColor]}>
                            {rememberPassword && <View style={[styles.radioInner, styles.radioActiveFill]} />}
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.btnMain} onPress={onRegisterPress}>
                    <Text style={styles.btnText}>Đăng ký</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnGoogle}>
                    <Image source={{ uri: GOOGLE_LOGO_URI }} style={styles.googleLogo} />
                    <Text style={styles.googleText}>Đăng ký bằng Google</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Bạn đã có tài khoản ?</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.linkText}> Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}