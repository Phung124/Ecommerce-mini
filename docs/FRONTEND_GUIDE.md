# Hướng Dẫn Cơ Bản & Giải Thích Frontend (Cho Người Thay Thế) 🎨

Đừng lo lắng nếu bạn cảm thấy Frontend (FE) hơi xa lạ! Tài liệu này được viết ra bằng ngôn ngữ đơn giản nhất để bạn - một Developer mạnh về Backend có thể dễ dàng hiểu, quản lý và tùy chỉnh được phần Giao diện (Frontend) mà chúng ta vừa tích hợp vào dự án.

## 1. Kiến Trúc Của Chúng Ta Là Gì?

Frontend hiện tại được xây dựng dùng bộ ba kinh điển: **HTML, CSS và JavaScript (Vanilla)**. KHÔNG sử dụng React, Vue hay Angular. Tại sao lại như vậy?
- Vì hệ thống của bạn là **Spring Boot**, và chúng ta nhúng trực tiếp giao diện này vào thư mục `src/main/resources/static/`.
- Nhờ vậy, mỗi khi Spring Boot chạy, nó sẽ trở thành một Web Server, tự động cung cấp Frontend này ở đường dẫn `http://localhost:8081`. Rất gọn nhẹ, **không lo lỗi chạy port khác nhau**, **không lo lỗi CORS**.

## 2. Giải Đoán Các File Frontend 

Toàn bộ Source Code giao diện chỉ nằm trong `src/main/resources/static`. Cấu trúc của khối lệnh này chia làm 3 phần ứng với 3 file:

### 📄 `index.html` - "Bộ Xương"
- **Nơi chứa cái khung:** Nó định hình bố cục của trang web (Thanh điều hướng ở trên, Hình ảnh to ở giữa, Danh sách sản phẩm ở dưới cùng).
- Có những thẻ như `<div class="product-card">`. Bản thân nó không đẹp, nhưng nó chừa chỗ (class) để thằng CSS tô vẽ.
- Nó cũng chứa cái Modal Đăng nhập (tức là cái khung popup hiện lên khi bấm Đăng nhập, nó sẽ bị ẩn đi bằng CSS cho đến lúc được gọi).

### 🎨 `css/style.css` - "Lớp Da & Quần Áo"
- **Nơi làm đẹp:** Nó lấy các class (ví dụ class `.glass-card`, `.primary-btn`) từ file HTML và tô màu nó, chỉnh kích lỡ, hoặc bo tròn góc.
- **Glassmorphism:** Đây là hiệu ứng kính mờ xịn sò. Trong file CSS có đoạn `backdrop-filter: blur(12px)`. Nó có chức năng biến một màu nền bình thường trở nên hơi mờ mờ, nhìn xuyên được cảnh đằng sau giống y như miếng kính!
- **CSS Variables:** Ở tuốt trên cùng file CSS bạn sẽ thấy `:root { --primary-color: #6366f1; }`. Mình dùng "biến" này để nếu sau này bạn muốn đổi màu chủ đạo của cả trang web, bạn chỉ cần đổi 1 dòng này, mọi nút bấm và chữ sẽ tự động đổi màu theo!

### ⚙️ `js/app.js` - "Bộ Não & Cơ Bắp"
Nếu chỉ có HTML và CSS, trang web là một tấm ảnh chết! Javascript là thứ thổi hồn vào nó:
- **Quản lý sự kiện (Events):** Đoạn mã nhận biết khi bạn bấm nút "Sign In", mở cửa sổ Modal lên (`openLoginModal()`).
- **Gọi API (Fetch API):** Đây là phần quan trọng để FE nối với Backend của bạn. JS sử dụng hàm `fetch('http://localhost:8081/api/products')` để lấy thông tin. 
- **Đổ Dữ Liệu Lên Giao Diện (Render):** Sau khi lấy cục JSON từ Backend về, JS có một hàm `renderProducts()` chẻ danh sách JSON đó ra và nhét chúng vào thẻ `div` trống bên trong `index.html` tạo thành các sản phẩm có hình ảnh.
- **Dữ liệu giả (Mock Data):** Lỡ backend của bạn lỗi chưa trả về API `products`, code JS của mình khôn khéo bắt lỗi `catch` và lấy 5 mặt hàng mình tự vẽ ra. Giúp Web không bao giờ bị trắng trơn!

---

## 3. Cách Để Bạn (Một Backend Dev) Sửa Giao Diện:

1. **Muốn thêm chữ/sửa cấu trúc khối?** -> Vào `index.html` chèn thẻ `<div>`, `<h1>` hoặc `<button>`.
2. **Muốn đổi màu sắc nút hoặc thêm to nhỏ?** -> Chỉ cần xem cái class của nó ở HTML (VD: `<button class="btn">`) rồi mở `style.css` tìm chữ `.btn` mà chỉnh màu.
3. **Mới viết API tạo Sản phẩm mới bên Java (Backend) xong?**
   - Mở `js/app.js`.
   - Tìm tới phương thức `fetchProducts()`.
   - Đảm bảo cái hàm fetch trỏ đúng đường dẫn API mà bạn vừa vẽ trong Spring Controller. Dữ liệu sẽ tự tràn về FE!

Chúc bạn thành công với E-commerce Mini của mình!🚀
