// src/features/profile/viewmodels/profileLoggedInVM.ts
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "../../../../config/firebase";
import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";

export let globalHistoryData = [
  { id: "1", title: "C", date: "8 tháng 1" },
  { id: "2", title: "không khô quả", date: "Ngày 1 tháng 12 năm 2025" },
];

export let globalUserData = {
  name: "Đăng Vinh",
  bio: "Giới thiệu thân thế",
  avatar: null as string | null,
};

export const useProfileLoggedInVM = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("history");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState(globalHistoryData);
  const [userData, setUserData] = useState(globalUserData);

  const loadHistories = useCallback(async () => {
    if (!user) {
      setHistoryData([]);
      globalHistoryData = [];
      return;
    }

    try {
      const historiesRef = collection(db, "users", user.uid, "histories");
      const q = query(historiesRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const newData = snapshot.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          title: String(data.title ?? ""),
          date: String(data.date ?? ""),
        };
      });

      globalHistoryData = newData;
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

  useFocusEffect(
    useCallback(() => {
      loadHistories();
      return () => {};
    }, [loadHistories])
  );

  useEffect(() => {
    // Vẫn giữ mock userData nếu chưa có UI chỉnh profile từ Firestore
    setUserData({ ...globalUserData });
  }, []);

  const deleteItem = async (id: string) => {
    setIsDeleting(id);
    try {
      if (!user) return;
      await deleteDoc(doc(db, "users", user.uid, "histories", id));
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

  const deleteAllHistory = async () => {
    try {
      if (!user) return;
      const historiesRef = collection(db, "users", user.uid, "histories");
      const snapshot = await getDocs(historiesRef);
      await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
      globalHistoryData = [];
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
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      }),
    );
  };

  const [activityData, setActivityData] = useState([
    {
      id: "act1",
      userName: globalUserData.name,
      date: "Ngày 21 tháng 5 năm 2025",
      title: "Câu hỏi",
      description: "Mô là bánh",
      likes: 0,
      comments: 0,
      isLiked: false,
    },
  ]);
    //GET /api/auth/me
    //GET /api/history  
    //DELETE /api/history/:id
    //DELETE /api/history 
    //GET /api/posts
    //GET /api/users/me/activity
    //DELETE /api/posts/:id
    //POST /api/posts/:id/like
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
    deleteItem,
    deleteAllHistory,
    toggleLikePost,
    navigateToDetail,
    navigateToEditProfile,
  };
};
