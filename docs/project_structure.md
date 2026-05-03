# Kien Truc Du An (Project Architecture) 
 
Duoi day la y nghia va vai tro cua tung thu muc trong du an: 
 
- **config**: Chua cac cau hinh chung cua ung dung (VD: Class mapping, config...). 
- **controller**: Noi tiep nhan cac URL/API request tu nguoi dung va tra ve ket qua. 
- **model**: Chua cac thuc the (Entity) luu tru du lieu duoc anh xa vao Database. 
- **payload/request**: Chua cac lop format du lieu client gui len. 
- **payload/response**: Chua cac lop format du lieu truoc khi tra ve client. 
- **repository**: Chua cac interface de thao tac voi co so du lieu (JPA). 
- **security**: Chua toan bo logic ve bao mat, phan quyen nguo dung (Spring Security). 
- **security/jwt**: Xu ly cac logic tao, xac thuc token JWT. 
- **service**: Noi dinh nghia cac Interface chua khung ham danh cho xu ly nghiep vu. 
- **service/impl**: Noi chi tiet viet code logic xu ly (tinh toan, dieu kien...) thay vì de trong Controller. 
- **resources**: Chua file cau hinh resource cua du an v.v.. 
 
--- 
 
## Cay Thu Muc Hien Tai (Tu Dong Cap Nhat) 
 
```text 
Folder PATH listing for volume OS
Volume serial number is 4464-56A4
C:\USERS\PHUC\.ANTIGRAVITY\EXTENSIONS\ECOMMERCE-MINI\SRC
+---main
|   +---java
|   |   \---com
|   |       \---example
|   |           \---ecommerce
|   |               |   EcommerceMiniApplication.java
|   |               |   
|   |               +---config
|   |               |       MapperConfig.java
|   |               |       SwaggerConfig.java
|   |               |       
|   |               +---controller
|   |               |       AuthController.java
|   |               |       OrderController.java
|   |               |       ProductController.java
|   |               |       UserController.java
|   |               |       
|   |               +---model
|   |               |       Order.java
|   |               |       OrderItem.java
|   |               |       OrderStatus.java
|   |               |       Product.java
|   |               |       RefreshToken.java
|   |               |       Role.java
|   |               |       RoleName.java
|   |               |       User.java
|   |               |       
|   |               +---payload
|   |               |   +---request
|   |               |   |       ChangePasswordRequest.java
|   |               |   |       LoginRequest.java
|   |               |   |       OrderItemRequest.java
|   |               |   |       OrderRequest.java
|   |               |   |       ProductRequest.java
|   |               |   |       SignupRequest.java
|   |               |   |       TokenRefreshRequest.java
|   |               |   |       
|   |               |   \---response
|   |               |           JwtResponse.java
|   |               |           MessageResponse.java
|   |               |           OrderItemResponse.java
|   |               |           OrderResponse.java
|   |               |           ProductDTO.java
|   |               |           TokenRefreshResponse.java
|   |               |           
|   |               +---repository
|   |               |       OrderRepository.java
|   |               |       ProductRepository.java
|   |               |       RefreshTokenRepository.java
|   |               |       RoleRepository.java
|   |               |       UserRepository.java
|   |               |       
|   |               +---security
|   |               |   |   WebSecurityConfig.java
|   |               |   |   
|   |               |   +---jwt
|   |               |   |       AuthEntryPointJwt.java
|   |               |   |       AuthTokenFilter.java
|   |               |   |       JwtUtils.java
|   |               |   |       
|   |               |   \---services
|   |               |           RefreshTokenService.java
|   |               |           UserDetailsImpl.java
|   |               |           UserDetailsServiceImpl.java
|   |               |           
|   |               \---service
|   |                   |   AuthService.java
|   |                   |   OrderService.java
|   |                   |   ProductService.java
|   |                   |   UserService.java
|   |                   |   
|   |                   \---impl
|   |                           AuthServiceImpl.java
|   |                           OrderServiceImpl.java
|   |                           ProductServiceImpl.java
|   |                           UserServiceImpl.java
|   |                           
|   \---resources
|       |   application.properties
|       |   
|       +---static
|       \---templates
\---test
    \---java
        \---com
            \---example
                \---ecommerce
                        EcommerceMiniApplicationTests.java
``` 
