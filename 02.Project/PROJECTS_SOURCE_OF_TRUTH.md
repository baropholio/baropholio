# BAROPHOLIO — CANONICAL DATA ARCHITECTURE & SOURCE OF TRUTH
> **LƯU Ý QUAN TRỌNG CHO TẤT CẢ DEVELOPER & AI AGENT**:
> Đọc tài liệu này trước khi đếm, truy vấn hoặc đồng bộ danh sách dự án trong repository.

---

## 1. NGUỒN DỮ LIỆU CHUẨN (AUTHORITATIVE SOURCE OF TRUTH)

Hệ thống Baropholio có các dự án kiến trúc & quy hoạch đô thị chính thức được định nghĩa tại:

| Nguồn | File | Vai trò |
| :--- | :--- | :--- |
| **Master JSON** | `02.Project/projects_master.json` | **CHUẨN 10 DỰ ÁN KIẾN TRÚC & ĐÔ THỊ** (Có thư mục media tương ứng trong `02.Project/`) |
| **Admin Studio** | `admin_project_manager.html` | Studio CMS quản trị chỉnh sửa, đồng bộ 2 chiều với Supabase Database |
| **Cloud Database** | Supabase PostgreSQL `projects` | Kho lưu trữ Cloud chính thức phục vụ production |

---

## 2. GIẢI THÍCH CON SỐ 22 (LEGACY / HIỂU LẦM CŨ)

- **Tại sao từng xuất hiện con số 22?**
  File `02.Project/projects_data.json` từng chứa 22 mục vì trước đây được sinh ra từ việc gộp 21 thẻ giải thưởng/thành tích học thuật (text-only archival awards trong `DEFAULT_RECORDS` của `index.html`) + 1 dự án mẫu.
- **Thực tế:** Các thẻ giải thưởng/thành tích đó không phải là 22 dự án kiến trúc đầy đủ media.
- **Danh sách 10 Dự Án Chuẩn (`projects_master.json`)**:
  1. `fish-and-orchard` — Fish and Orchard (stt: 01)
  2. `windy-hill-neighborhood` — Windy Hill Neighborhood (stt: 02)
  3. `central-lake-eco-park` — Central Lake Eco Park (stt: 03)
  4. `cu-xa-scomeco-smart-community-and-eco-housing` — Cư Xá (S.COMECO) - Smart, Community and Eco Housing (stt: 04)
  5. `the-reborn-of-water-reservoirs-thuy-dai` — The Reborn of Water Reservoirs (Thuy Dai) (stt: 05)
  6. `sun-of-love-will-to-live-center` — Sun of Love - "Will to Live" Center (stt: 06)
  7. `saigon-in-sight-van-don-area-urban-design-guidelines` — Saigon in Sight - Van Don Area Urban Design Guidelines (stt: 07)
  8. `rocras-reborn-of-coalmine-restoration-and-sustainability` — ROCRAS - Reborn of Coalmine Restoration and Sustainability (stt: 08)
  9. `the-veil-national-art-museum-of-andorra` — The Veil - National Art Museum of Andorra (stt: 09)
  10. `me` — Me (stt: 10)

---

## 3. CƠ CHẾ MEDIA & STORAGE QUOTA
- Ảnh/Video tải lên Supabase Storage được lưu trong bucket `project-media`.
- Khi người dùng xóa Media trong `admin_project_manager.html`, hàm `deleteMediaFromSupabaseStorage()` sẽ tự động gọi Supabase Storage API (`supabase.storage.from('project-media').remove([filePath])`) để xóa file vật lý, tránh đầy dung lượng miễn phí.

