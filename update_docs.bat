@echo off
echo Updating project structure documentation...
if not exist docs mkdir docs

echo # Kien Truc Du An (Project Architecture) > docs\project_structure.md
echo. >> docs\project_structure.md
echo Duoi day la y nghia va vai tro cua tung thu muc trong du an: >> docs\project_structure.md
echo. >> docs\project_structure.md
echo - **config**: Chua cac cau hinh chung cua ung dung (VD: Class mapping, config...). >> docs\project_structure.md
echo - **controller**: Noi tiep nhan cac URL/API request tu nguoi dung va tra ve ket qua. >> docs\project_structure.md
echo - **model**: Chua cac thuc the (Entity) luu tru du lieu duoc anh xa vao Database. >> docs\project_structure.md
echo - **payload/request**: Chua cac lop format du lieu client gui len. >> docs\project_structure.md
echo - **payload/response**: Chua cac lop format du lieu truoc khi tra ve client. >> docs\project_structure.md
echo - **repository**: Chua cac interface de thao tac voi co so du lieu (JPA). >> docs\project_structure.md
echo - **security**: Chua toan bo logic ve bao mat, phan quyen nguo dung (Spring Security). >> docs\project_structure.md
echo - **security/jwt**: Xu ly cac logic tao, xac thuc token JWT. >> docs\project_structure.md
echo - **service**: Noi dinh nghia cac Interface chua khung ham danh cho xu ly nghiep vu. >> docs\project_structure.md
echo - **service/impl**: Noi chi tiet viet code logic xu ly (tinh toan, dieu kien...) thay vì de trong Controller. >> docs\project_structure.md
echo - **resources**: Chua file cau hinh resource cua du an v.v.. >> docs\project_structure.md
echo. >> docs\project_structure.md
echo --- >> docs\project_structure.md
echo. >> docs\project_structure.md
echo ## Cay Thu Muc Hien Tai (Tu Dong Cap Nhat) >> docs\project_structure.md
echo. >> docs\project_structure.md
echo ```text >> docs\project_structure.md

tree /A /F src >> docs\project_structure.md

echo ``` >> docs\project_structure.md

del docs\project_structure.txt 2>nul

echo Done! Kien truc du an da duoc cap nhat vao file docs\project_structure.md.
pause
