import { Link, useRouter } from "expo-router";
import { ChevronLeft, Eye, EyeOff, Mail } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { authStyles as styles } from "../styles/auth.styles";
import { useLogin } from "../viewmodels/useLogin";
import { Colors } from "../constants/Colors";

interface LoginViewProps {
  onLoginSuccess: () => void;
}

const GOOGLE_LOGO_URI = "https://cdn-icons-png.flaticon.com/512/2991/2991148.png";

export default function LoginScreen({ onLoginSuccess }: LoginViewProps) {
  const router = useRouter();

  const {
    email, setEmail, password, setPassword, showPass, setShowPass,
    errors, emailHint, errorMessage, loading, clearAllErrors, onLoginPress,
  } = useLogin();

  const handleLogin = async () => {
    const success = await onLoginPress();
    if (success) onLoginSuccess();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng nhập</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {/* EMAIL */}
        <Text style={styles.label}>Email</Text>
        <View style={[styles.inputContainer, errors.email && { borderColor: Colors.alertBorder }]}>
          <TextInput
            style={styles.input}
            value={email}
            placeholder="Email"
            onChangeText={setEmail}
            onFocus={clearAllErrors}
            autoCapitalize="none"
          />
          <Mail size={24} color="black" style={styles.iconRight} />
        </View>
        {errors.email && <Text style={{ color: Colors.error, fontSize: 12, marginTop: 4 }}>{emailHint}</Text>}

        {/* PASSWORD */}
        <Text style={styles.label}>Mật khẩu</Text>
        <View style={[styles.inputContainer, errors.password && { borderColor: Colors.alertBorder }]}>
          <TextInput
            style={styles.input}
            secureTextEntry={!showPass}
            value={password}
            placeholder="Mật khẩu"
            onChangeText={setPassword}
            onFocus={clearAllErrors}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            {showPass ? <EyeOff size={24} color="black" style={styles.iconRight} /> : <Eye size={24} color="black" style={styles.iconRight} />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotPass}>
          <Text style={styles.forgotPassText}>Quên mật khẩu ?</Text>
        </TouchableOpacity>

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          style={[styles.btnMain, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Đăng nhập</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnGoogle}>
          <Image source={{ uri: GOOGLE_LOGO_URI }} style={styles.googleLogo} />
          <Text style={styles.googleText}>Đăng nhập bằng Google</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Bạn chưa có tài khoản ?</Text>
          <Link href="/auth/register" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}> Đăng ký</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {!!errorMessage && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}