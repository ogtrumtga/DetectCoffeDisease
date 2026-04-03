import { onAuthStateChanged, signOut, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import {
  collection,
  doc,
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

  useEffect(() => {
    // Firebase tự động theo dõi trạng thái đăng nhập
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);

      // Đảm bảo có document profile trong Firestore
      // (Không cần tạo collection/doc thủ công)
      if (firebaseUser) {
        const name =
          firebaseUser.displayName ||
          (firebaseUser.email ? firebaseUser.email.split("@")[0] : "User");

        setDoc(
          doc(db, "users", firebaseUser.uid),
          {
            uid: firebaseUser.uid,
            email: firebaseUser.email || null,
            name,
            avatarUrl: null,
            bio: null,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        ).catch((e) => {
          console.error("[AuthContext] Failed to ensure user profile:", e);
        });

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
      value={{ user, isLoggedIn: !!user, isLoading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
