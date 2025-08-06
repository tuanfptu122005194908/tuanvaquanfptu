-- Add sold count column to products table
ALTER TABLE products ADD COLUMN sold_count integer DEFAULT 0;
ALTER TABLE products ADD COLUMN total_available integer DEFAULT 100;

-- Update existing SRC ôn FE description
UPDATE products 
SET description = 'Tài liệu source code tất cả các môn: MAD101, MAE101, MAS291, PRO192, PRF192, WED201, SSL101, CSI106, OBE102 để ôn thi FE'
WHERE name = 'SRC ôn FE';

-- Add new premium services
INSERT INTO products (name, description, price, in_stock, sold_count, total_available) VALUES
('QUIZLET PLUS 1 tháng', 'Gói QUIZLET PLUS premium 1 tháng - Học từ vựng hiệu quả', 15000, true, 23, 50),
('QUIZLET PLUS 1 năm', 'Gói QUIZLET PLUS premium 1 năm - Tiết kiệm 85%', 200000, true, 8, 20),
('ChatGPT PLUS 1 tháng', 'Gói ChatGPT PLUS 1 tháng - AI hỗ trợ học tập mạnh mẽ', 100000, true, 15, 30),
('NETFLIX PREMIUM 1 tháng', 'Gói NETFLIX PREMIUM 1 tháng - Giải trí chất lượng cao', 60000, true, 42, 100),
('CANVA PRO 1 năm', 'Gói CANVA PRO 1 năm - Thiết kế chuyên nghiệp', 100000, true, 18, 40),
('CAPCUT PRO 1 tháng', 'Gói CAPCUT PRO 1 tháng - Edit video chuyên nghiệp', 70000, true, 7, 25);

-- Update sold counts for existing products to make it realistic
UPDATE products SET sold_count = 45, total_available = 100 WHERE name LIKE 'Khóa học%';
UPDATE products SET sold_count = 67, total_available = 200 WHERE name = 'SRC ôn FE';
UPDATE products SET sold_count = 12, total_available = 50 WHERE name LIKE 'Rush Coursera%';
UPDATE products SET sold_count = 28, total_available = 80 WHERE name LIKE 'Support LUK%';
UPDATE products SET sold_count = 33, total_available = 100 WHERE name = 'Transcript';