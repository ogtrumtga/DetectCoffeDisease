import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { CheckCircle, XCircle } from 'lucide-react-native';
import { Colors } from '../features/auth/constants/Colors';

// Định nghĩa các tham số truyền vào
interface CustomAlertProps {
    visible: boolean;            // Ẩn hay hiện
    type?: 'success' | 'error';  // Loại: Thành công (Xanh) hay Lỗi (Đỏ)
    title: string;               // Tiêu đề
    message: string;             // Nội dung
    onClose: () => void;         // Hàm chạy khi bấm đóng
}

export const CustomAlert = ({ visible, type = 'success', title, message, onClose }: CustomAlertProps) => {
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertBox}>

                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        {type === 'success' ? (
                            <CheckCircle size={50} color={Colors.primary} />
                        ) : (
                            <XCircle size={50} color={Colors.error} />
                        )}
                    </View>

                    {/* Tiêu đề & Nội dung */}
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    {/* Nút OK */}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: type === 'success' ? Colors.primary : Colors.error }]}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', alignItems: 'center',
    },
    alertBox: {
        width: Dimensions.get('window').width * 0.8,
        backgroundColor: '#fff', borderRadius: 20, padding: 20,
        alignItems: 'center', elevation: 5,
    },
    iconContainer: { marginBottom: 15 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 10 },
    message: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
    button: { width: '100%', paddingVertical: 12, borderRadius: 25, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});