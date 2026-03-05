import React, { createContext, useContext, useEffect, useState } from "react";

// 1. Thêm isLoading vào định nghĩa ban đầu
const AuthContext = createContext({
  isLoggedIn: false,
  isLoading: true, // Thêm dòng này
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Mặc định là đang load

  useEffect(() => {
    // Giả lập kiểm tra token/session khi vừa mở app
    const checkAuth = async () => {
      try {
        // Bạn có thể thêm logic đọc AsyncStorage ở đây
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
