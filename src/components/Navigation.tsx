import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, GraduationCap, MessageCircle, Play, Heart, Youtube, Facebook, Phone, Mail } from "lucide-react";
import { QRPaymentModal } from "./QRPaymentModal";

export const Navigation = () => {
  const [showQR, setShowQR] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigationItems = [
    { icon: Home, label: "Trang chủ", action: () => scrollToSection('hero'), color: "bg-green-500 hover:bg-green-600" },
    { icon: GraduationCap, label: "Khóa học", action: () => scrollToSection('services'), color: "bg-orange-500 hover:bg-orange-600" },
    { icon: MessageCircle, label: "Chat với AI", action: () => window.open('https://chatgpt.com', '_blank'), color: "bg-blue-500 hover:bg-blue-600" },
    { icon: Play, label: "Vào học ngay", action: () => window.open('https://www.youtube.com/@tuanvaquanfptu', '_blank'), color: "bg-purple-500 hover:bg-purple-600" },
  ];

  const socialLinks = [
    { icon: Youtube, url: "https://www.youtube.com/@tuanvaquanfptu", color: "bg-red-500 hover:bg-red-600" },
    { icon: Facebook, url: "https://facebook.com", color: "bg-blue-600 hover:bg-blue-700" },
    { icon: Phone, url: "tel:0375020190", color: "bg-green-600 hover:bg-green-700" },
    { icon: Mail, url: "mailto:contact@example.com", color: "bg-gray-600 hover:bg-gray-700" },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col gap-4 py-6">
                  <h2 className="text-lg font-semibold mb-4">Menu</h2>
                  
                  {navigationItems.map((item, index) => (
                    <Button
                      key={index}
                      onClick={item.action}
                      className={`w-full justify-start gap-3 h-12 text-white ${item.color}`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  ))}
                  
                  <div className="my-6 border-t pt-6">
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground">Liên hệ</h3>
                    <div className="flex gap-2">
                      {socialLinks.map((link, index) => (
                        <Button
                          key={index}
                          size="icon"
                          className={`${link.color} text-white`}
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          <link.icon className="h-4 w-4" />
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => setShowQR(true)}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white gap-2 h-12"
                  >
                    <Heart className="h-5 w-5" />
                    Ủng hộ
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tuấn & Quân
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {navigationItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={item.action}
                className="text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Button>
            ))}
            <Button
              onClick={() => setShowQR(true)}
              variant="outline"
              className="border-pink-500 text-pink-500 hover:bg-pink-50"
            >
              <Heart className="h-4 w-4 mr-2" />
              Ủng hộ
            </Button>
          </div>
        </div>
      </nav>

      <QRPaymentModal isOpen={showQR} onClose={() => setShowQR(false)} />
    </>
  );
};