import { Platform, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export const authStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // --- HEADER ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.headerBg,
    // Android cần padding trên để tránh thanh trạng thái
    paddingTop: Platform.OS === 'android' ? 50 : 60,
  },
  headerTitle: {
    fontSize: 22, // Chữ to hơn chút giống ảnh
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 15,
  },

  // --- BODY ---
  body: { padding: 30 },
  label: { fontWeight: 'bold', fontSize: 16, marginBottom: 10, marginTop: 20 },

  // Input bo tròn 2 đầu
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderColor: Colors.border, borderRadius: 30, // Bo tròn mạnh
    paddingHorizontal: 15, height: 55, backgroundColor: '#fff',
    marginBottom: 5
  },

  inputError: {
    borderColor: Colors.alertBorder,
    borderWidth: 1.2,
  },

  input: { flex: 1, height: '100%', fontSize: 16, paddingLeft: 10 },
  iconRight: { marginLeft: 10 }, // Icon nằm bên phải

  // Quên mật khẩu
  forgotPass: { alignSelf: 'flex-end', marginTop: 10 },
  forgotPassText: { color: Colors.grayText, fontSize: 14 },

  // --- NÚT CHÍNH (Xanh Mint) ---
  btnMain: {
    backgroundColor: Colors.primary, height: 55, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center', marginTop: 30, marginBottom: 20
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },

  // --- NÚT GOOGLE (Nền trắng, viền xám) ---
  btnGoogle: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', // Nền trắng
    borderWidth: 1, borderColor: Colors.googleBorder, // Viền xám
    height: 55, borderRadius: 15, // Bo nhẹ hơn nút chính
    marginTop: 10
  },
  googleLogo: { width: 24, height: 24, marginRight: 10 }, // Kích thước logo
  googleText: { fontSize: 16, fontWeight: '500', color: '#000' },

  // Footer text
  footer: { alignItems: 'center', marginTop: 30 },
  footerText: { color: Colors.grayText, fontSize: 14, marginBottom: 5 },
  linkText: { color: Colors.link, fontWeight: 'bold', fontSize: 15 },

  // --- RADIO BUTTON (Nhớ mật khẩu) ---
  rememberContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
    marginTop: 15
  },
  radioOuter: {
    height: 20, width: 20, borderRadius: 10, borderWidth: 2,
    borderColor: Colors.grayText, alignItems: 'center', justifyContent: 'center',
    marginLeft: 8
  },
  radioInner: {
    height: 10, width: 10, borderRadius: 5, backgroundColor: Colors.grayText
  },
  radioActiveColor: {
    borderColor: '#666', // Khi active viền đậm hơn
  },
  radioActiveFill: {
    backgroundColor: '#666' // Khi active nhân bên trong màu xám đậm
  },

  // Hộp lỗi
  errorBox: {
    marginTop: 20,
    backgroundColor: Colors.errorBg, // Nền hồng nhạt
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.error, // Viền đỏ mảnh
    alignItems: 'center',
    width: '100%'
  },
  errorText: {
    color: Colors.error, // Chữ đỏ
    fontWeight: '500',
    fontSize: 15
  }
});