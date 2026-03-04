import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

// Biến global để dùng chung giữa các màn hình
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
  const [activeTab, setActiveTab] = useState("history");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState(globalHistoryData);
  const [userData, setUserData] = useState(globalUserData);

  useEffect(() => {
    setHistoryData([...globalHistoryData]);
    setUserData({ ...globalUserData });
  }, []);

  const deleteItem = async (id: string) => {
    setIsDeleting(id);
    setTimeout(() => {
      const isError = Math.random() < 0.15;
      setIsDeleting(null);
      if (isError) {
        router.push({
          pathname: "/error",
          params: {
            title: "Không thể xóa",
            message: "Đã xảy ra lỗi khi kết nối với máy chủ.",
          },
        });
      } else {
        const newData = historyData.filter((item) => item.id !== id);
        globalHistoryData = newData;
        setHistoryData(newData);
      }
    }, 1000);
  };

  const deleteAllHistory = () => {
    globalHistoryData = [];
    setHistoryData([]);
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
