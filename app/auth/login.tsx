// app/auth/login.tsx
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import LoginView from '../../src/features/auth/views/loginView';
import { getPendingAction } from '../../src/utils/pendingAction';

export default function LoginPage() {
    const { login } = useAuth();

 const handleLoginSuccess = async () => {
    login();
    
    // Kiểm tra có pending action không
    const pendingAction = await getPendingAction();
    
    if (pendingAction) {
      console.log('Found pending action, redirecting to:', pendingAction.returnPath);
      
      // KHÔNG xóa pending action ở đây
      // Để màn hình đích tự xóa khi mount
      
      // Chuyển đến màn hình dự định
      router.replace(pendingAction.returnPath as any);
    } else {
      // Không có pending action → về trang chủ
      router.replace('/'); 
    }
  };
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
}