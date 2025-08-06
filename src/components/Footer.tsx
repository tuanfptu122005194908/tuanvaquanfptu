import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Facebook, Mail, Youtube, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tuấn & Quân
            </h3>
            <p className="text-muted-foreground">
              Người đồng hành học tập đáng tin cậy cho sinh viên đại học. 
              Hỗ trợ từ A đến Z, tuyệt đối nói không với gian lận!
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => window.open('https://www.facebook.com/tuanvaquan', '_blank')}
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => window.open('mailto:lequan12305@gmail.com', '_blank')}
              >
                <Mail className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => window.open('https://www.youtube.com/@tuanvaquanfptu', '_blank')}
              >
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Dịch vụ</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Rush Coursera</li>
              <li>• Tài liệu & Source Code</li>
              <li>• Khóa học trực tuyến</li>
              <li>• Support LUK (Media)</li>
              <li>• Project & Lab</li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Liên hệ</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>📧 lequan12305@gmail.com</p>
              <p>🏦 BIDV - 8816861222</p>
              <p>👤 Cao Thanh Quân</p>
              <p>🏆 Cộng đồng 1000+ thành viên</p>
            </div>
          </div>
        </div>
        
        <Separator className="mb-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-muted-foreground text-sm">
            © 2024 Tuấn & Quân. Thiết kế với 
            <Heart className="w-4 h-4 inline mx-1 text-red-500" />
            cho sinh viên Việt Nam.
          </p>
          <p className="text-muted-foreground text-sm mt-2 md:mt-0">
            ⚡ Hỗ trợ 24/7 | 💯 Cam kết chất lượng | 🚀 Giao hàng nhanh
          </p>
        </div>
      </div>
    </footer>
  );
};