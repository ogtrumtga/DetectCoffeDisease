// app/auth/login.tsx
import LoginView from '../../src/features/auth/views/loginView';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';

export default function LoginPage() {
    const { login } = useAuth();

 const handleLoginSuccess = () => {
    login();
    router.replace('/'); 
  };
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
}