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
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

export let globalUserData = {
  name: "Người dùng",
  bio: "Giới thiệu thân thế",
  avatar: null as string | null,
};

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
  const [userData, setUserData] = useState(globalUserData);

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

  useFocusEffect(
    useCallback(() => {
      loadHistories();
      return () => {};
    }, [loadHistories])
  );

  useEffect(() => {
    setUserData({ ...globalUserData });
  }, []);

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
