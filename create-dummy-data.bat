@echo off
echo =====================================================
echo    TẠO DỮ LIỆU MẪU CHO CHATBOT
echo    (Products, Services, FAQs)
echo =====================================================
echo.

:: Thiết lập màu sắc
color 0A

echo [BƯỚC 1] Tạo thư mục chứa dữ liệu mẫu...
if not exist "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data" (
    mkdir "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data"
    echo [OK] Đã tạo thư mục dữ liệu mẫu
) else (
    echo [INFO] Thư mục dữ liệu mẫu đã tồn tại
)

echo.
echo [BƯỚC 2] Tạo dữ liệu mẫu cho sản phẩm...
echo.

echo {> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo   "products": [>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo     {>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "id": 1,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "name": "Áo thể thao Sun Movement Pro",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "description": "Áo thể thao cao cấp của Sun Movement, chất liệu thoáng khí, thấm hút mồ hôi tốt, phù hợp cho các hoạt động thể thao cường độ cao.",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "price": 450000,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "discountPrice": 400000,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "category": "Sportswear",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "stockQuantity": 25>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo     },>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo     {>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "id": 2,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "name": "Quần shorts tập gym Sun Movement",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "description": "Quần short thoáng mát, co giãn tốt, phù hợp cho các bài tập squat, deadlift và cardio.",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "price": 350000,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "discountPrice": null,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "category": "Sportswear",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "stockQuantity": 15>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo     },>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo     {>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "id": 3,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "name": "Giày tập gym Sun Movement Pro",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "description": "Giày thiết kế đặc biệt cho tập gym với đế phẳng, bám sàn tốt, hỗ trợ tối đa cho các bài tập nâng tạ.",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "price": 1200000,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "discountPrice": 1000000,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "category": "Sportswear",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "stockQuantity": 0>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo     },>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo     {>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "id": 4,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "name": "Whey Protein Sun Movement",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "description": "Bột protein chất lượng cao, giúp phục hồi và phát triển cơ bắp sau tập luyện. Hàm lượng 24g protein/khẩu phần.",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "price": 850000,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "discountPrice": null,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "category": "Supplements",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "stockQuantity": 30>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo     },>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo     {>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "id": 5,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "name": "Dây kháng lực Sun Movement",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "description": "Bộ dây kháng lực 5 mức độ khác nhau, giúp tập luyện linh hoạt tại nhà cho mọi nhóm cơ.",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "price": 500000,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "discountPrice": 450000,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "category": "Equipment",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo       "stockQuantity": 12>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo     }>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo   ]>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"
echo }>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json"

echo [OK] Đã tạo dữ liệu mẫu cho sản phẩm
echo.

echo [BƯỚC 3] Tạo dữ liệu mẫu cho dịch vụ...
echo.

echo {> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo   "services": [>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo     {>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo       "id": 1,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo       "name": "Lớp Yoga cơ bản",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo       "description": "Lớp Yoga dành cho người mới bắt đầu, tập trung vào các tư thế cơ bản và kỹ thuật thở.",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo       "price": 200000,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo       "type": "Yoga",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo       "features": "[\"Giảm căng thẳng\", \"Tăng độ dẻo dai\", \"Cải thiện thể chất và tinh thần\", \"Phù hợp cho người mới\"]">> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo     },>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo     {>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo       "id": 2,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo       "name": "Lớp Calisthenics nâng cao",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo       "description": "Lớp học dành cho những người đã có nền tảng, tập trung vào các động tác nâng cao như muscle up, front lever, human flag.",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo       "price": 300000,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo       "type": "Calisthenics",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo       "features": "[\"Tăng sức mạnh cơ bắp\", \"Cải thiện sự cân bằng\", \"Phát triển cơ đều đặn\", \"Động tác nâng cao\"]">> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo     },>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo     {>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo       "id": 3,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo       "name": "Huấn luyện viên cá nhân",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo       "description": "Chương trình tập luyện được thiết kế riêng với sự hướng dẫn của huấn luyện viên cá nhân có chứng chỉ quốc tế.",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo       "price": 500000,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo       "type": "Strength",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo       "features": "[\"Chương trình tập cá nhân hóa\", \"Theo dõi tiến độ chặt chẽ\", \"Đạt mục tiêu nhanh hơn\", \"Điều chỉnh theo thể trạng\"]">> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo     }>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo   ]>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"
echo }>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json"

echo [OK] Đã tạo dữ liệu mẫu cho dịch vụ
echo.

echo [BƯỚC 4] Tạo dữ liệu mẫu cho FAQs...
echo.

echo {> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo   "faqs": [>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo     {>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "id": 1,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "question": "Giờ làm việc của Sun Movement là gì?",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "answer": "Sun Movement mở cửa từ 6:00 đến 22:00 các ngày trong tuần, cuối tuần từ 8:00 đến 20:00.",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "category": "General">> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo     },>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo     {>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "id": 2,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "question": "Chính sách đổi trả như thế nào?",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "answer": "Chính sách đổi trả của Sun Movement cho phép bạn đổi sản phẩm trong vòng 7 ngày nếu còn nguyên tem nhãn và hoá đơn mua hàng.",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "category": "Returns">> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo     },>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo     {>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "id": 3,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "question": "Chính sách bảo hành sản phẩm ra sao?",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "answer": "Các sản phẩm của chúng tôi được bảo hành từ 6-12 tháng tuỳ loại sản phẩm. Chi tiết bảo hành được ghi rõ trên phiếu bảo hành đi kèm.",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "category": "Products">> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo     },>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo     {>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "id": 4,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "question": "Các phương thức thanh toán nào được chấp nhận?",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "answer": "Chúng tôi chấp nhận thanh toán bằng tiền mặt, chuyển khoản ngân hàng, và tất cả các loại thẻ tín dụng/ghi nợ phổ biến.",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "category": "Payment">> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo     },>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo     {>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "id": 5,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "question": "Huấn luyện viên cá nhân có chứng chỉ gì?",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "answer": "Đội ngũ huấn luyện viên của Sun Movement gồm các chuyên gia được đào tạo chuyên nghiệp với chứng chỉ quốc tế về fitness và dinh dưỡng.",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "category": "Services">> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo     },>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo     {>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "id": 6,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "question": "Chương trình thành viên có những gì?",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "answer": "Chương trình thành viên của chúng tôi có 3 hạng: Bạc, Vàng, và Kim cương với nhiều đặc quyền khác nhau. Bạn có thể đăng ký tại quầy lễ tân hoặc trên website.",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "category": "Services">> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo     },>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo     {>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "id": 7,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "question": "Chính sách giao hàng như thế nào?",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "answer": "Chúng tôi giao hàng miễn phí trong nội thành cho đơn hàng từ 500.000đ trở lên, thời gian giao hàng từ 1-3 ngày làm việc.",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "category": "Delivery">> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo     },>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo     {>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "id": 8,>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "question": "Làm thế nào để liên hệ với Sun Movement?",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "answer": "Bạn có thể liên hệ với Sun Movement qua số điện thoại 1900 6789, email info@sunmovement.vn hoặc trực tiếp tại các cửa hàng.",>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo       "category": "General">> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo     }>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo   ]>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"
echo }>> "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json"

echo [OK] Đã tạo dữ liệu mẫu cho FAQs
echo.

echo [BƯỚC 5] Cập nhật actions.py để sử dụng dữ liệu mẫu...
echo.

echo [HOÀN TẤT] Đã tạo đầy đủ dữ liệu mẫu!
echo.
echo Dữ liệu đã được lưu tại:
echo - d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\products.json
echo - d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\services.json
echo - d:\DATN\DATN\sun-movement-chatbot\data\dummy_data\faqs.json
echo.
echo Bây giờ bạn có thể chạy "start-action-server.bat" để khởi động action server
echo với dữ liệu mẫu và kiểm tra chatbot!
