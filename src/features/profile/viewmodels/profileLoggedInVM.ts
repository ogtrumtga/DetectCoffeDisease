// src/features/profile/viewmodels/profileLoggedInVM.ts
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "../../../../config/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

// ⚠️ KHÔNG dùng biến global nữa - sẽ gây bug khi đổi tài khoản
// export let globalUserData = { ... }

export type HistoryItem = {
  id: string;
  title: string;
  date: string;
  diseaseKey?: string;
  severity?: string;
  confidence?: number;
  imageUrl?: string | null;
};

export const useProfileLoggedInVM = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("history");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [userData, setUserData] = useState({
    name: "Người dùng",
    bio: "Giới thiệu thân thế",
    avatar: null as string | null,
  });

  /**
   * Load lịch sử từ collection diagnoses (top-level).
   * Query theo userId, sắp xếp mới nhất trước.
   */
  const loadHistories = useCallback(async () => {
    if (!user) {
      setHistoryData([]);
      return;
    }

    try {
      const q = query(
        collection(db, "diagnoses"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);

      const newData: HistoryItem[] = snapshot.docs.map((d) => {
        const data = d.data() as any;
        const createdAt = data.createdAt?.toDate?.() ?? null;
        const dateStr = createdAt
          ? createdAt.toLocaleDateString("vi-VN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "Không rõ ngày";

        return {
          id: d.id,
          title: String(data.diseaseNameVi ?? data.diseaseName ?? "Không xác định"),
          date: dateStr,
          diseaseKey: data.diseaseKey,
          severity: data.severity,
          confidence: data.confidence,
          imageUrl: data.imageUrl ?? null,
        };
      });

      setHistoryData(newData);
    } catch (e) {
      console.error("[profileLoggedInVM] loadHistories failed:", e);
      router.push({
        pathname: "/error",
        params: {
          title: "Không thể tải lịch sử",
          message: "Không kết nối được Firebase Firestore.",
        },
      });
    }
  }, [router, user]);

  /**
   * Load user profile từ Firestore
   * LUÔN ƯU TIÊN photoURL từ Firestore (đã cập nhật) thay vì Firebase Auth
   */
  const loadUserProfile = useCallback(async () => {
    if (!user) {
      setUserData({
        name: "Người dùng",
        bio: "Giới thiệu thân thế",
        avatar: null,
      });
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          name: data.displayName || data.name || user.displayName || "Người dùng",
          bio: data.bio || "Giới thiệu thân thế",
          avatar: data.photoURL || null, // ✅ Luôn lấy từ Firestore (đã cập nhật)
        });
      } else {
        // Fallback nếu chưa có document (trường hợp hiếm)
        setUserData({
          name: user.displayName || "Người dùng",
          bio: "Giới thiệu thân thế",
          avatar: user.photoURL || null,
        });
      }
    } catch (e) {
      console.error("[profileLoggedInVM] loadUserProfile failed:", e);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      console.log('[profileLoggedInVM] Screen focused, reloading data...');
      loadHistories();
      loadUserProfile();
      return () => {};
    }, [loadHistories, loadUserProfile])
  );

  /** Xóa một bản ghi chẩn đoán */
  const deleteItem = async (id: string) => {
    setIsDeleting(id);
    try {
      if (!user) return;
      await deleteDoc(doc(db, "diagnoses", id));
      await loadHistories();
    } catch (e) {
      console.error("[profileLoggedInVM] deleteItem failed:", e);
      router.push({
        pathname: "/error",
        params: {
          title: "Không thể xóa",
          message: "Đã xảy ra lỗi khi xóa khỏi Firebase.",
        },
      });
    } finally {
      setIsDeleting(null);
    }
  };

  /** Xóa toàn bộ lịch sử chẩn đoán của user */
  const deleteAllHistory = async () => {
    try {
      if (!user) return;
      const q = query(collection(db, "diagnoses"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      setHistoryData([]);
    } catch (e) {
      console.error("[profileLoggedInVM] deleteAllHistory failed:", e);
      router.push({
        pathname: "/error",
        params: {
          title: "Không thể xóa toàn bộ",
          message: "Đã xảy ra lỗi khi xóa khỏi Firebase.",
        },
      });
    }
  };

  const toggleLikePost = (postId: string) => {
    setActivityData((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      })
    );
  };

  // ✅ Load activity data từ API thật (posts của user)
  const [activityData, setActivityData] = useState<any[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  const loadUserActivity = useCallback(async () => {
    if (!user) {
      setActivityData([]);
      return;
    }

    try {
      setLoadingActivity(true);
      // Query posts của user từ Firestore
      const q = query(
        collection(db, "posts"),
        where("authorId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);

      const posts = snapshot.docs.map((d) => {
        const data = d.data();
        const createdAt = data.createdAt?.toDate?.() ?? new Date();
        return {
          id: d.id,
          userName: userData.name,
          date: createdAt.toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          title: data.title || "Không có tiêu đề",
          description: data.content || "",
          likes: data.likesCount || 0,
          comments: data.commentsCount || 0,
          isLiked: false,
        };
      });

      setActivityData(posts);
    } catch (e) {
      console.error("[profileLoggedInVM] loadUserActivity failed:", e);
      setActivityData([]);
    } finally {
      setLoadingActivity(false);
    }
  }, [user, userData.name]);

  // Load activity khi userData thay đổi
  useEffect(() => {
    if (activeTab === "activity" && user) {
      loadUserActivity();
    }
  }, [activeTab, user, loadUserActivity]);

  const navigateToDetail = (id: string) => {
    router.push({
      pathname: "/(tabs)/camera/detailCameraScreen",
      params: { id },
    });
  };

  const navigateToEditProfile = () => {
    router.push("/(tabs)/profile/detailProfileScreen");
  };

  return {
    activeTab,
    setActiveTab,
    isDeleting,
    historyData,
    activityData,
    userData,
    loadingActivity,
    deleteItem,
    deleteAllHistory,
    toggleLikePost,
    navigateToDetail,
    navigateToEditProfile,
    loadUserProfile, // Export để profileDetailVM có thể gọi sau khi update
  };
};
