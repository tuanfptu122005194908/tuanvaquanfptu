-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- Price in VND
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  total_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid')),
  transaction_code TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_requests table
CREATE TABLE public.contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'replied', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (customers can view products)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Admin policies (for future admin authentication)
CREATE POLICY "Admin can manage products" 
ON public.products 
FOR ALL 
USING (true);

CREATE POLICY "Admin can manage customers" 
ON public.customers 
FOR ALL 
USING (true);

CREATE POLICY "Admin can manage orders" 
ON public.orders 
FOR ALL 
USING (true);

CREATE POLICY "Admin can manage order_items" 
ON public.order_items 
FOR ALL 
USING (true);

CREATE POLICY "Admin can manage contact_requests" 
ON public.contact_requests 
FOR ALL 
USING (true);

-- Create function to generate order code
CREATE OR REPLACE FUNCTION generate_order_code()
RETURNS TEXT AS $$
DECLARE
  today_date TEXT;
  counter INTEGER;
  order_code TEXT;
BEGIN
  today_date := TO_CHAR(NOW(), 'YYMMDD');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_code FROM 9) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.orders
  WHERE order_code LIKE 'HD' || today_date || '%';
  
  order_code := 'HD' || today_date || LPAD(counter::TEXT, 3, '0');
  
  RETURN order_code;
END;
$$ LANGUAGE plpgsql;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, description, price, image_url, in_stock) VALUES
('Rush Coursera', 'Hỗ trợ chọn khóa học, theo dõi tiến độ, làm bài', 135000, '', true),
('Tài liệu & Source Code', 'Đề thi, tài liệu PDF, code C, Java, Python, DB,...', 60000, '', true),
('Khóa học trực tuyến cấp tốc', 'Rút gọn, dễ hiểu, dễ thi', 200000, '', true),
('Edit video', 'Chỉnh sửa video chuyên nghiệp', 70000, '', true),
('Script kịch bản', 'Viết kịch bản sáng tạo', 40000, '', true),
('Combo Full Media', 'Gói combo đầy đủ dịch vụ media', 90000, '', true),
('Làm bảng điểm', 'Tạo bảng điểm chuyên nghiệp', 10000, '', true),
('Project Java', 'Hỗ trợ làm project Java', 300000, '', true),
('Project Python', 'Hỗ trợ làm project Python', 250000, '', true),
('Project Web', 'Hỗ trợ làm project Web', 400000, '', true),
('Project Database', 'Hỗ trợ làm project Database', 200000, '', true),
('Bài tập lớn', 'Hỗ trợ làm bài tập lớn các môn', 150000, '', true);