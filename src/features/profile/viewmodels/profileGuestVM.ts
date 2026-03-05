import { useRouter } from "expo-router";

interface ProfileGuestVMProps {
  onLoginPress?: () => void;
}

export const useProfileGuestVM = ({ onLoginPress }: ProfileGuestVMProps) => {
  const router = useRouter();

  const handlePress = () => {
    if (onLoginPress) {
      onLoginPress();
    } else {
      router.push("/auth/login");
    }
  };

  return {
    handlePress,
  };
};
