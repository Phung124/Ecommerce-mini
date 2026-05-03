# Nhật Ký Phát Triển Dự Án (Project Development Log)

File này ghi lại toàn bộ lộ trình, các kế hoạch và những thay đổi quan trọng đã thực hiện trong dự án E-Commerce Mini.

---

## ✅ PHASE 1: Nền Tảng Cốt Lõi (Hoàn thành - 21/04/2026)
Giai đoạn này tập trung vào việc xây dựng bộ khung nghiệp vụ chuẩn Production.

### 📝 Thông số thay đổi:
- **Tổng số file mới**: ~20 file (Bao gồm Entity, Repository, DTO, Service và Controller cho 3 module).
- **Mục tiêu**: Giải quyết triệt để lỗi vòng lặp JSON và xây dựng luồng mua hàng khép kín.

### 🛡️ Chi tiết các Module & Cốt lõi:

#### 1. Module Danh mục (Category)
- **Số lượng file**: 7 file (`Category`, `CategoryRepository`, `CategoryRequest`, `CategoryResponse`, `CategoryService`, `CategoryServiceImpl`, `CategoryController`).
- **Cốt lõi**: Phá vỡ lỗi **Circular Reference** (Vòng lặp JSON) bằng cách sử dụng **DTO**. Chế độ xóa an toàn giúp bảo vệ dữ liệu sản phẩm khi danh mục cha bị xóa.
- **Công nghệ**: Hibernate `@OneToMany`, ModelMapper.

#### 2. Module Địa chỉ (Address)
- **Số lượng file**: 7 file (`Address`, `AddressRepository`, `AddressRequest`, `AddressResponse`, `AddressService`, `AddressServiceImpl`, `AddressController`).
- **Cốt lõi**: Quản lý tài nguyên theo User (**Ownership**). Đảm bảo User A không thể xem/sửa địa chỉ của User B thông qua JWT.
- **Công nghệ**: Spring Security Context, JPA Audit.

#### 3. Module Giỏ hàng (Shopping Cart)
- **Số lượng file**: 10 file (`Cart`, `CartItem` Entities; 2 Repositories; 3 DTOs; 1 Service & 1 Impl; 1 Controller).
- **Cốt lõi**: **Server-side Persistence**. Giỏ hàng được lưu trong DB thay vì LocalStorage, giúp khách hàng đăng nhập ở máy khác vẫn thấy hàng đã chọn.
- **Công nghệ**: `@OneToOne` User-Cart, `@ManyToOne` CartItem-Product.

#### 4. Module Thanh toán (Checkout Integration)
- **File chỉnh sửa**: 4 file chính (`OrderServiceImpl`, `Order`, `OrderRequest`, `OrderResponse`).
- **Cốt lõi**: **Data Snapshotting**. Thông tin địa chỉ được "chụp ảnh" lại và lưu vào đơn hàng ngay lúc đặt. Điều này cực kỳ quan trọng vì nếu sau này User xóa địa chỉ cũ, đơn hàng lịch sử vẫn phải biết đã giao đi đâu.
- **Lưu ý**: Tự động dọn dẹp (Clear) giỏ hàng ngay sau khi đơn hàng được tạo thành công để tránh đặt trùng.

---

## 🚀 PHASE 2: Nâng Tầm Trải Nghiệm (Đang thực hiện - 22/04/2026)
Mục tiêu: Tích hợp dịch vụ bên thứ ba (Media & Email) để chuyên nghiệp hóa hệ thống.

### 📝 Thông số kỹ thuật:
- **Công nghệ**: Cloudinary SDK (Media), Spring Boot Mail (Email), Spring Async (Xử lý ngầm).
- **Tổng số file mới**: ~10 file.

### 🛡️ Chi tiết các Module & Cốt lõi:

#### 1. Module Media Storage (Cloudinary) - [ĐÃ XONG]
- **Các file mới**:
  - `CloudinaryConfig.java`: Bean cấu hình Cloudinary.
  - `FileService.java` & `FileServiceImpl.java`: Logic upload/delete Media.
  - `FileController.java`: API `/api/files/upload`.
  - `FileUploadResponse.java`: DTO chứa kết quả upload.
- **Cốt lõi**: Chuyển đổi dữ liệu nhị phân (`MultipartFile`) thành `secure_url` thông qua Cloudinary API. 
- **Lưu ý**: Chỉ cho phép **ADMIN** upload để bảo vệ băng thông và lưu trữ.

#### 2. Module Email Notifications (Spring Mail) - [ĐANG LÀM]
- **Các file dự kiến**:
  - `EmailService.java` & `EmailServiceImpl.java`: Soạn và gửi mail HTML.
  - Tích hợp vào `OrderServiceImpl`: Tự động gửi biên lai khi chốt đơn.
- **Công nghệ**: **JavaMailSender** kết hợp với **Thymeleaf/String Templates**.
- **Cốt lõi**: Sử dụng `@Async` để gửi mail ngầm dưới nền, giúp ứng dụng không bị "đơ" khi chờ gửi mail (2-3 giây).

---

## 🛠️ Cấu Trúc File Quan Trọng
- `MapperConfig.java`: "Trái tim" của việc chuyển đổi dữ liệu.
- `OrderServiceImpl.java`: Nơi xử lý logic Checkout phức tạp nhất.
- `docs/ROADMAP.md`: Bản đồ chi tiết các tính năng tiếp theo.

---
*Lưu ý: File này sẽ được cập nhật liên tục sau mỗi bước tiến mới của dự án.*
