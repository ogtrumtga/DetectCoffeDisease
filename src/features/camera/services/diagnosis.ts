// 1. Import thư viện lưu trữ cho Mobile (thay cho localStorage của Web)
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. POST   /api/camera/analyze
//    → Gửi ảnh lên server để AI phân tích
//    Body: FormData (image file)
//    Response: Diagnosis result

// 2. GET    /api/diagnosis/:id
//    → Lấy chi tiết một kết quả chẩn đoán

// 3. GET    /api/history
//    → Lấy toàn bộ lịch sử chẩn đoán

// 4. POST   /api/history
//    → Lưu kết quả chẩn đoán vào lịch sử

// 5. DELETE /api/history/:id
//    → Xóa một bản ghi lịch sử

// 6. DELETE /api/history
//    → Xóa toàn bộ lịch sử

// 7. GET    /api/medicines/:diseaseId
//    → Lấy danh sách thuốc theo bệnh


// GIỮ NGUYÊN: Dữ liệu mẫu của bạn
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

// GIỮ NGUYÊN: Hàm phân tích ảnh của bạn (Rất tốt cho việc demo Loading)
export const analyzeImage = (imageUri: string): Promise<any> => {
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

// ĐIỀU CHỈNH: Hàm lưu lịch sử (Chuyển localStorage sang AsyncStorage)
export const saveToHistory = async (diagnosis: any) => {
    try {
        // Mobile dùng AsyncStorage.getItem (bất đồng bộ) thay vì localStorage
        const historyData = await AsyncStorage.getItem('diagnosis_history');
        const history = historyData ? JSON.parse(historyData) : [];

        history.unshift({
            ...diagnosis,
            savedAt: new Date().toISOString()
        });

        // Mobile dùng AsyncStorage.setItem
        await AsyncStorage.setItem('diagnosis_history', JSON.stringify(history));
        return { success: true, message: 'Đã lưu vào lịch sử' };
    } catch (error) {
        return { success: false, message: 'Không thể lưu lịch sử' };
    }
};


//API Camera