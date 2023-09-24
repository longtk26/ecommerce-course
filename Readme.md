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
