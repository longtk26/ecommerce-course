## Day 1: Init project

- helmet library
- compression library

## Day 2: Connect database

1. Nhược điểm của cách connect cũ
2. Sử dụng cách connect mới, khuyên dùng
   \_ Sử dụng Creational pattern - Singleton
   \_ Singleton đảm bảo rằng một class chỉ có một đối tượng
3. Kiểm tra hệ thống có bao nhiêu connect --> helper
4. Phát hiện connect đến hệ thống quá tải --> helper
5. Không cần disconnect liên tục trong mongodb
6. Poolsize là gì? Tại sao lại quan trọng ?
   \_ Trong mongoose nhóm kết nối là tập hợp các kết nối của cơ sở dữ liệu mà có thể tái sử dụng được
   \_ Ví dụ: Khi có một kết nối đến database thì mongoose sẽ kiểm tra xem kết nối đó đã tồn tại trong nhóm kết nối chưa, nếu có mongoose sẽ dùng kết nối trong nhóm để truy cập mà không cần phải tạo kết nối mới, nếu không mongoose sẽ tạo kết nối mới và thêm nó vào nhóm. Điều này giúp tăng hiệu suất tránh trường hợp chỉ có một kết nối từ bên ngoài nhưng lại tạo quá nhiều kết nối tới cơ sở dữ liệu.
   --> Nhiệm vụ: Đọc singleton, os và process trong nodejs

## Day 3: ENV config

## Day 4: API Sign up

1. Dùng http client cho việc test API
2. Tổ chức routes theo cấp thư mục
3. Dùng class để viết controller
4. Khi dùng try catch, ta nên quy định các code để chỉ rõ lỗi cụ thể
5. Dùng publicKey và privateKey

## Day5: API sign up

1. Tìm hiểu JWT là gì ?
2. Tại sao lại dùng JWT ?
3. accessToken và refreshToken, tại sao cần dùng cả hai ?
4. Hoạt động của publicKey và privateKey cùng thuật toán bất đối xứng
5. Quy trình khi thực hiện một chức năng sign up

   -- Kiểm tra sự tồn tại của email.
   -- Hash password và lưu tài khoản mới vào db (nhớ kiểm tra lỗi khi tạo).
   -- Sử dụng privateKey và publicKey để tạo accessToken và refreshToken (lưu trữ publicKey và privateKey trong db, trường hợp dùng thuật toán bất đối xứng chỉ cần lưu publicKey).
   -- Trả về cho người dùng token và những thông tin cần thiết.

## Day 6: Middleware API Key and permissions

1. Tạo apiKey model để lưu trữ trạng thái và quyền hạn của các api key
2. Kiểm tra req có kèm api key không --> Kiểm tra key có tồn tại trong db không --> next
3. Kiểm tra permission của apiKey có tồn tại không --> Nếu có kiểm tra xem permission đó có tồn tại hợp lệ với những permissions của apiKey được gửi không

## Day 7: Xử lý Error Handler trong API

1. Hạn chế dùng try catch
2. Catch error của controller bằng middleware (asyncHandler)
3. Custome error message và success message trong thư mục core
4. Catch error khi routes not found
5. Sử dụng error middleware function của express để catch error

## Day 8: Login và logout

1. Login flow

   - Kiểm tra sự tồn tại của email
   - Kiểm tra match password
   - Tạo AT,RT,PubK, PriK
   - Lưu RT, Pubk và PriK vào DB
   - Return thông tin user về client

2. Logout flow
   - Authenticate user before logging out (Viết middleware)
   - Các bước viết middleware khi logout
   * Check userId missing
   * Get refreshToken
   * Verify token
   * Check user in dbs
   * Check keyStore with this userId
   * OK all --> return next() mang theo keyStore
   - Viết removeKey service
   - Luôn phải mang theo: API key, userId, refreshToken khi muốn logout

## Day 9: Handle refresh token

1.  Kiểm tra refreshToken có nằm trong blacklist không --> hủy token yêu cầu đăng nhập lại
2.  Nếu refreshToken hợp lệ --> Tìm user hợp lệ của hệ thống
3.  Trả về cặp token mới

## Day 10: Schema product

1. Dùng Factory pattern cho product service
