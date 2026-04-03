// app/auth/login.tsx
import { router } from 'expo-router';
import LoginView from '../../src/features/auth/views/loginView';
import { getPendingAction } from '../../src/utils/pendingAction';

export default function LoginPage() {
  const handleLoginSuccess = async () => {
    // Firebase onAuthStateChanged tự cập nhật trạng thái, không cần gọi login()
    const pendingAction = await getPendingAction();

    if (pendingAction) {
      console.log('Found pending action, redirecting to:', pendingAction.returnPath);
      router.replace(pendingAction.returnPath as any);
    } else {
      router.replace('/');
    }
  };

  return <LoginView onLoginSuccess={handleLoginSuccess} />;
}
