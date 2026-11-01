# Baropholio Web — Architecture & Spatial Design Archive

Trang web lưu trữ Portfolio cá nhân của Baro Nguyen — Thiết kế không gian, quy hoạch đô thị và field notes.

## 📌 Nguồn Dữ Liệu Dự Án (Canonical Source of Truth)
- Danh sách dự án kiến trúc & đô thị chuẩn: Xem chi tiết tại [02.Project/PROJECTS_SOURCE_OF_TRUTH.md](02.Project/PROJECTS_SOURCE_OF_TRUTH.md).
- File dữ liệu chính thức: `02.Project/projects_master.json` (10 dự án chuẩn).
- Trang quản trị CMS Studio: `admin_project_manager.html` (kết nối Supabase Realtime + Storage).
- Trang Portfolio chính: `index.html` (3D Fibonacci Sphere & Grid Canvas, fetch dữ liệu từ Supabase Cloud).

## 🚀 Supabase Integration
- **Postgres Table**: `projects` (tự động đồng bộ 2 chiều).
- **Storage Bucket**: `project-media` (tự động xóa file vật lý khi gỡ media trong Admin).

