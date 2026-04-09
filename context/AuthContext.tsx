import { onAuthStateChanged, signOut, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm refresh user profile từ Firestore
  const refreshUserProfile = async () => {
    if (!auth.currentUser) return;
    
    try {
      // Force reload Firebase User để trigger re-render
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
    } catch (e) {
      console.error("[AuthContext] refreshUserProfile failed:", e);
    }
  };

  useEffect(() => {
    // Firebase tự động theo dõi trạng thái đăng nhập
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Luôn set firebaseUser trước để giữ nguyên Firebase User methods
      setUser(firebaseUser);
      setIsLoading(false);

      // Đảm bảo có document profile trong Firestore
      // CHỈ tạo document NÊU CHƯA TỒN TẠI (không ghi đè photoURL đã cập nhật)
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userRef);

        // Chỉ tạo document mới nếu chưa tồn tại
        if (!userDoc.exists()) {
          const displayName =
            firebaseUser.displayName ||
            (firebaseUser.email ? firebaseUser.email.split("@")[0] : "User");

          setDoc(userRef, {
            email: firebaseUser.email || null,
            displayName: displayName,
            photoURL: firebaseUser.photoURL || '',
            bio: '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }).catch((e) => {
            console.error("[AuthContext] Failed to create user profile:", e);
          });
        }
        // Nếu document đã tồn tại, KHÔNG làm gì cả để giữ nguyên photoURL đã cập nhật

        // Seed 1 record history mẫu khi lần đầu đăng nhập
        // để dữ liệu xuất hiện trên Firebase ngay (phục vụ demo đồ án).
        (async () => {
          try {
            const historiesRef = collection(
              db,
              "users",
              firebaseUser.uid,
              "histories"
            );
            const q = query(historiesRef, limit(1));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) return;

            const seedId = `seed-${firebaseUser.uid}`;
            await setDoc(
              doc(db, "users", firebaseUser.uid, "histories", seedId),
              {
                id: seedId,
                title: "Bệnh gỉ sắt",
                date: new Date().toLocaleDateString("vi-VN"),
                createdAt: serverTimestamp(),
              },
              { merge: true }
            );
          } catch (e) {
            console.error("[AuthContext] Seed history failed:", e);
          }
        })();
      }
    });
    return unsubscribe; // cleanup khi unmount
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, isLoading, logout, refreshUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
