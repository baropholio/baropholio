# HƯỚNG DẪN QUẢN LÝ VÀ CẬP NHẬT DỰ ÁN (PROJECTS) CHO BAROPHOLIO

Hệ thống quản lý dự án đã được thiết kế hoàn toàn độc lập và linh hoạt, giúp bạn cập nhật dễ dàng mà **không cần chỉnh sửa mã nguồn phức tạp của file HTML chính**.

---

## 📁 Cấu trúc thư mục

```
Baropholio web/
│
├── 01.Logo/                         <-- Chứa logo và palette bar
│   ├── Baropholio logo2-01.png
│   └── palette bar-01.png
│
├── 02.Project/                      <-- Thư mục quản lý dự án của bạn
│   ├── projects_data.js             <-- File danh sách dự án (JSON / JS)
│   ├── HUONG_DAN_QUAN_LY_DU_AN.md  <-- Tài liệu này
│   ├── du-an-01.jpg                 <-- Ảnh của bạn bỏ vào đây
│   ├── du-an-02.png
│   └── ...
│
└── baropholio_baro_nguyen_portfolio.html   <-- Trang web chính
```

---

## 🚀 3 Bước để cập nhật hoặc thêm dự án mới:

### Bước 1: Thả ảnh dự án vào thư mục `02.Project`
- Bạn có thể đặt tên file ảnh bất kỳ (ví dụ: `ha-tu.jpg`, `hcmc-2040.png`, `project-01.jpg`).
- *Khuyến nghị:* Ảnh ngang tỉ lệ **3:2** hoặc **16:9** (độ phân giải khoảng `1200x800` đến `1920x1080`) để hiển thị đẹp nhất trên cả quả cầu 3D, lưới Grid và Lightbox.

---

### Bước 2: Mở file `02.Project/projects_data.js` để điền thông tin
Bạn mở file [projects_data.js](file:///e:/WORK/Baropholio%20web/02.Project/projects_data.js) bằng bất kỳ trình soạn thảo nào (VS Code, Notepad, Sublime Text).

Mỗi dự án có cấu trúc như sau:
```javascript
{
  id: 1,
  title: "Tên dự án của bạn",
  category: "MASTERPLANNING",      // Thể loại (VUPDA, RESEARCH, ARCHIVE, v.v.)
  year: "2024",                    // Năm thực hiện
  organization: "Tên cơ quan / tổ chức / trường học",
  award: "Giải thưởng hoặc ghi chú ngắn",
  description: "Mô tả chi tiết đồ án...",
  image: "02.Project/ha-tu.jpg",   // <-- Điền đúng tên file ảnh bạn đã bỏ vào thư mục
  link: "https://..."             // Link bài báo hoặc link ngoài (nếu có, nếu không để "")
},
```

---

### Bước 3: Lưu file và nhấn `F5` trên trình duyệt!
- Tấm thẻ trên **Quả cầu 3D** sẽ tự động hiển thị ảnh đại diện nền của dự án.
- Khi người xem nhấp chuột vào thẻ, **Lightbox** sẽ mở to tấm ảnh chất lượng cao kèm toàn bộ thông tin chi tiết và link xem bài viết.
- Trong chế độ **Works (Lưới Flat Grid)**, ảnh đại diện cũng xuất hiện gọn gàng và tinh tế.

---

### 🛡️ Cơ chế tự động bảo vệ (Fallback an toàn):
- Nếu bạn chưa có ảnh hoặc gõ nhầm tên file ảnh: Thẻ dự án vẫn sẽ tự động hiển thị đồ họa kiến trúc typographic chuẩn Harvard GSD như hiện tại, **không bao giờ bị lỗi icon vỡ ảnh**!
