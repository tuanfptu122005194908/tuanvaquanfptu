import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Facebook, Mail, Youtube, CreditCard, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import qrPayment from "@/assets/qr-payment.jpg";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  in_stock: boolean;
}

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: ""
  });
  const [showPayment, setShowPayment] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.service) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Save contact request to database
      const { error } = await supabase
        .from('contact_requests')
        .insert({
          full_name: formData.name,
          email: formData.email,
          service: formData.service,
          message: formData.message
        });

      if (error) throw error;

      setShowPayment(true);
      toast({
        title: "Gửi yêu cầu thành công!",
        description: "Chúng mình sẽ liên hệ với bạn trong vòng 24h. Vui lòng thanh toán theo thông tin bên dưới.",
      });
    } catch (error) {
      console.error('Error saving contact request:', error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Liên hệ & Đặt dịch vụ
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Điền thông tin bên dưới hoặc liên hệ trực tiếp qua các kênh của chúng mình
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-large">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Form đặt dịch vụ
              </CardTitle>
              <CardDescription>
                Gửi yêu cầu và chúng mình sẽ liên hệ tư vấn miễn phí
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Họ và tên *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nhập họ tên của bạn"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="example@gmail.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="service">Chọn dịch vụ *</Label>
                  <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn dịch vụ bạn cần hỗ trợ" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.name}>
                          {product.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="Tư vấn khác">Tư vấn khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="message">Ghi chú</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Mô tả chi tiết yêu cầu của bạn..."
                    rows={4}
                  />
                </div>
                
                <Button type="submit" className="w-full" size="lg">
                  Gửi yêu cầu
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Contact Info & Payment */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Liên hệ trực tiếp</CardTitle>
                <CardDescription>
                  Kết nối với chúng mình qua các kênh sau
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('https://www.facebook.com/tuanvaquan', '_blank')}
                >
                  <Facebook className="w-5 h-5 mr-3 text-blue-600" />
                  Facebook: tuanvaquan
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('mailto:lequan12305@gmail.com', '_blank')}
                >
                  <Mail className="w-5 h-5 mr-3 text-red-600" />
                  Gmail: lequan12305@gmail.com
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('https://www.youtube.com/@tuanvaquanfptu', '_blank')}
                >
                  <Youtube className="w-5 h-5 mr-3 text-red-600" />
                  YouTube: @tuanvaquanfptu
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('tel:0375020190', '_self')}
                >
                  <Phone className="w-5 h-5 mr-3 text-green-600" />
                  Zalo: 0375020190
                </Button>
              </CardContent>
            </Card>
            
            {/* Payment Info */}
            {showPayment && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <CreditCard className="w-5 h-5" />
                    Thông tin thanh toán
                  </CardTitle>
                  <CardDescription>
                    Chuyển khoản theo thông tin bên dưới
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <img 
                      src={qrPayment} 
                      alt="QR Code Payment"
                      className="w-48 h-48 mx-auto rounded-lg shadow-medium"
                    />
                  </div>
                  
                  <div className="space-y-2 text-center">
                    <Badge variant="secondary" className="text-lg py-2 px-4">
                      BIDV - 8816861222
                    </Badge>
                    <p className="font-semibold text-lg">Cao Thanh Quân</p>
                    <p className="text-sm text-muted-foreground">
                      💡 Nếu có vấn đề về thanh toán, hãy liên hệ quản trị viên để được hỗ trợ!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Community Info */}
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardContent className="pt-6 text-center">
                <h3 className="font-bold text-xl mb-2">🏆 Cộng đồng học lập trình</h3>
                <p className="text-lg font-semibold text-primary">1000+ thành viên</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Tham gia cộng đồng để học hỏi và chia sẻ kinh nghiệm cùng nhau
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};