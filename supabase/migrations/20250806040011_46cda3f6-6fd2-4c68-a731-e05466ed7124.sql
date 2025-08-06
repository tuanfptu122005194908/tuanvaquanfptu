-- Clear existing products and add new structured services
DELETE FROM products;

-- Khóa học cấp tốc online (120k each, includes materials)
INSERT INTO products (name, description, price, in_stock) VALUES
('Khóa học MAD101', 'Khóa học cấp tốc online môn MAD101 - Được tặng tài liệu', 120000, true),
('Khóa học MAE101', 'Khóa học cấp tốc online môn MAE101 - Được tặng tài liệu', 120000, true),
('Khóa học MAS291', 'Khóa học cấp tốc online môn MAS291 - Được tặng tài liệu', 120000, true),
('Khóa học PRO192', 'Khóa học cấp tốc online môn PRO192 - Được tặng tài liệu', 120000, true),
('Khóa học PRF192', 'Khóa học cấp tốc online môn PRF192 - Được tặng tài liệu', 120000, true),
('Khóa học WED201', 'Khóa học cấp tốc online môn WED201 - Được tặng tài liệu', 120000, true),

-- SRC ôn FE - All subjects source code
('SRC ôn FE', 'Tài liệu source code tất cả các môn để ôn thi FE', 60000, true),

-- Rush Coursera services
('Rush Coursera WED201', 'Hỗ trợ rush coursera môn WED201', 130000, true),
('Rush Coursera SSL101', 'Hỗ trợ rush coursera môn SSL101', 130000, true),
('Rush Coursera CSI106', 'Hỗ trợ rush coursera môn CSI106', 50000, true),
('Rush Coursera OBE102', 'Hỗ trợ rush coursera môn OBE102', 70000, true),

-- Support LUK services (4 separate services)
('Support LUK Edit video', 'Dịch vụ hỗ trợ edit video chuyên nghiệp', 150000, true),
('Support LUK Debate', 'Dịch vụ hỗ trợ chuẩn bị và thực hiện debate', 100000, true),
('Support LUK Kịch bản', 'Dịch vụ viết kịch bản sáng tạo', 120000, true),
('Support LUK Full combo', 'Combo đầy đủ các dịch vụ Support LUK', 300000, true),
('Transcript', 'Dịch vụ transcript chuyên nghiệp', 80000, true);