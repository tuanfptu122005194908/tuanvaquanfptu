import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatNumber } from "@/lib/utils";
import { 
  BookOpen, 
  Code, 
  Users, 
  Zap, 
  FileText, 
  Video, 
  Award,
  Lightbulb,
  Star,
  MessageSquare,
  Tv,
  Palette,
  Bot,
  Scissors
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  in_stock: boolean;
  sold_count: number;
  total_available: number;
}

export const ServicesSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
      toast.error('Không thể tải dữ liệu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (name: string) => {
    if (name.toLowerCase().includes('mad') || name.toLowerCase().includes('mae') || name.toLowerCase().includes('mas')) return BookOpen;
    if (name.toLowerCase().includes('pro') || name.toLowerCase().includes('prf')) return Code;
    if (name.toLowerCase().includes('wed')) return Zap;
    if (name.toLowerCase().includes('src')) return FileText;
    if (name.toLowerCase().includes('rush')) return Star;
    if (name.toLowerCase().includes('edit')) return Video;
    if (name.toLowerCase().includes('debate')) return MessageSquare;
    if (name.toLowerCase().includes('kịch bản')) return Lightbulb;
    if (name.toLowerCase().includes('combo')) return Award;
    if (name.toLowerCase().includes('transcript')) return FileText;
    if (name.toLowerCase().includes('quizlet')) return BookOpen;
    if (name.toLowerCase().includes('chatgpt')) return Bot;
    if (name.toLowerCase().includes('netflix')) return Tv;
    if (name.toLowerCase().includes('canva')) return Palette;
    if (name.toLowerCase().includes('capcut')) return Scissors;
    return Users;
  };

  const handleServiceClick = (product: Product) => {
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      
      // Pre-fill the service in contact form
      setTimeout(() => {
        const serviceSelect = document.querySelector('select[name="service"]') as HTMLSelectElement;
        if (serviceSelect) {
          serviceSelect.value = product.name;
          serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, 500);
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-background" id="services">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Dịch vụ của chúng mình
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hỗ trợ toàn diện cho sinh viên từ học tập đến kỹ năng mềm
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-6 w-1/2 mx-auto" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-background" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Dịch vụ của chúng mình
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hỗ trợ toàn diện cho sinh viên từ học tập đến kỹ năng mềm
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="relative group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader className="text-center">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="secondary" className="text-xs">
                    Đã bán: {formatNumber(product.sold_count)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Còn lại: {formatNumber(product.total_available - product.sold_count)}
                  </Badge>
                </div>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                  {(() => {
                    const Icon = getServiceIcon(product.name);
                    return <Icon className="h-8 w-8 text-primary" />;
                  })()}
                </div>
                <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
                <CardDescription className="text-base">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold py-3"
                  onClick={() => handleServiceClick(product)}
                >
                  Đặt hàng ngay
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            ✨ Tất cả dịch vụ đều có cam kết chất lượng và hỗ trợ 24/7
          </p>
          <Button 
            size="lg"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            Liên hệ tư vấn miễn phí
          </Button>
        </div>
      </div>
    </section>
  );
};