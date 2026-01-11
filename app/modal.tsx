// Dữ liệu mẫu cho chẩn đoán
export const mockDiagnoses = [
  {
    id: 1,
    disease: "Bệnh rỉ sắt",
    confidence: 92,
    symptoms: "Bệnh rỉ sắt xuất hiện chủ yếu trên lá, các vết bệnh màu vàng nâu, dạng chấm nhỏ, phát triển lớn dần thành ổ bào tử hạ màu vàng nâu. Cuối cùng biến thành các vết như rỉ sắt màu nâu đen.",
    causes: ["Nấm Puccinia spp.", "Độ ẩm cao", "Nhiệt độ 20-25°C"],
    prevention: ["Vệ sinh vườn", "Tỉa bỏ lá bệnh", "Phun thuốc phòng định kỳ"],
    medicines: [
      { id: 1, name: "Azoxystrobin", type: "Thuốc trừ nấm" },
      { id: 2, name: "Propiconazole", type: "Thuốc trị rỉ sắt" },
      { id: 3, name: "Mancozeb", type: "Thuốc phòng bệnh" }
    ]
  },
  {
    id: 2,
    disease: "Bệnh đốm lá",
    confidence: 87,
    symptoms: "Xuất hiện các đốm tròn màu nâu trên lá, viền vàng xung quanh, lá vàng và rụng sớm.",
    causes: ["Nấm Cercospora", "Ẩm ướt kéo dài"],
    prevention: ["Thoát nước tốt", "Bón phân cân đối"],
    medicines: [
      { id: 1, name: "Chlorothalonil", type: "Thuốc phổ rộng" },
      { id: 2, name: "Copper hydroxide", type: "Thuốc gốc đồng" }
    ]
  },
  {
    id: 3,
    disease: "Bệnh phấn trắng",
    confidence: 95,
    symptoms: "Lớp phấn trắng như bột trên bề mặt lá, làm lá cong queo, còi cọc.",
    causes: ["Nấm Oidium", "Khô hạn ban ngày, ẩm ban đêm"],
    prevention: ["Trồng thưa", "Tưới nước buổi sáng"],
    medicines: [
      { id: 1, name: "Sulfur", type: "Thuốc trị phấn trắng" },
      { id: 2, name: "Myclobutanil", type: "Thuốc đặc trị" }
    ]
  }
];

export const analyzeImage = (imageUri: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockDiagnoses.length);
      const diagnosis = mockDiagnoses[randomIndex];
      
      resolve({
        success: true,
        diagnosis,
        timestamp: new Date().toISOString(),
        imageId: `img_${Date.now()}`
      });
    }, 2000);
  });
};

export const saveToHistory = (diagnosis: any) => {
  const history = JSON.parse(localStorage.getItem('diagnosis_history') || '[]');
  history.unshift({
    ...diagnosis,
    savedAt: new Date().toISOString()
  });
  localStorage.setItem('diagnosis_history', JSON.stringify(history));
  return { success: true, message: 'Đã lưu vào lịch sử' };
};