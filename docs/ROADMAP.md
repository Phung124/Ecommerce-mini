# ROADMAP E-COMMERCE MINI 🚀

Đây là Bản kế hoạch (Roadmap) siêu chi tiết mà chúng ta đã vạch ra để nâng cấp hệ thống E-Commerce này thành bản thương mại (Production). 
Được lưu lại để tránh việc chúng ta bị lạc hướng trong quá trình Code.

## 🎯 PHASE 1: Core E-Commerce Features (Nâng Cấp Nền Tảng Bắt Buộc)
Các tính năng bắt buộc phải có để trang web hoạt động giống một cái chợ.

- [ ] **Quản lý Danh mục (Category):**
  - Tạo `Category` Entity (id, name, description).
  - Thiết lập liên kết `@ManyToOne` từ `Product` tới `Category`.
  - Phân loại sản phẩm để khách hàng tìm kiếm dễ dàng.
- [ ] **Hồ sơ & Địa chỉ (UserProfile & Address):**
  - Tạo bảng `Address` liên kết với bảng `User`. Khách hàng có thể lưu nhiều địa chỉ (Nhà riêng, Cơ quan).
  - Khi đặt hàng, `Order` sẽ dán theo cái `Address` này chứ không lấy từ User mặc định nữa.
- [ ] **Giỏ Hàng Thực Thụ (Shopping Cart):**
  - Tạo `Cart` Entity (@OneToOne với `User`).
  - Tạo `CartItem` Entity (@ManyToOne tới `Cart` và `Product`).
  - Khách có thể gom 5-6 món nháp trước khi Checkout.

## 📦 PHASE 2: Operations & Integration (Nâng Tầm Trải Nghiệm & Vận Hành)
Giúp ứng dụng trông uy tín và chuyên nghiệp hơn rất nhiều.

- [ ] **Tích hợp Upload Ảnh Sản Phẩm (Media Storage):**
  - Bổ sung `imageUrl` vào `Product`.
  - Viết Service upload ảnh lưu local hoặc gọi API đẩy thẳng lên Cloudinary/S3.
- [ ] **Hệ thống Gửi Email Tự Động (Email Notifications):**
  - Nhúng `spring-boot-starter-mail`.
  - Gửi email hóa đơn tự động khi đặt hàng thành công.
  - Quên Mật Khẩu (Forgot Password) bằng mã xác nhận gửi tới email.

## 💳 PHASE 3: Enterprise & Real Money (Thanh Toán & Tối Ưu)
Tính năng đặc thù dùng cho các trang mạng lúc Đưa vào Kinh Doanh thực chiến.

- [ ] **Cổng Thanh Toán Trực Tuyến (Payment Gateway):**
  - Tích hợp VNPay, MoMo, hoặc Stripe thay vì chỉ dùng Tiền mặt (COD).
  - Đẻ thêm mô hình `PaymentTransaction`. Bổ sung trạng thái `PAID`, `FAILED`.
- [ ] **Redis Caching (Chống sập Website):**
  - Cài Redis để làm bộ đệm cực nhanh lưu danh sách Sản phẩm, ngăn sập Database lúc chạy sự kiện (Flash Sale).

---
> Ghi chú: Chúng ta sẽ đi từng bước một. Bắt đầu từ Phase 1.
