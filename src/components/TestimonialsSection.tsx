import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Nguyễn Minh Anh",
    avatar: "MA",
    subject: "PRO192 - Lập trình hướng đối tượng",
    content: "Tôi học Java mà không biết bắt đầu từ đâu. Nhờ Tuấn & Quân mà mọi thứ dễ hơn rất nhiều! Code được giải thích chi tiết, dễ hiểu.",
    rating: 5,
    semester: "Học kỳ 2"
  },
  {
    name: "Trần Văn Bình",
    avatar: "TB",
    subject: "CSD201 - Cấu trúc dữ liệu",
    content: "Môn này khó nhưng với tài liệu của team và support tận tình, mình đã pass môn với điểm B+. Cảm ơn anh Tuấn và anh Quân!",
    rating: 5,
    semester: "Học kỳ 3"
  },
  {
    name: "Lê Thị Cúc",
    avatar: "LC",
    subject: "DBI202 - Cơ sở dữ liệu",
    content: "Database ban đầu thấy phức tạp lắm, nhưng được hỗ trợ làm project và giải thích query, giờ mình tự tin hơn rất nhiều.",
    rating: 5,
    semester: "Học kỳ 3"
  },
  {
    name: "Phạm Hoàng Duy",
    avatar: "PD",
    subject: "PRJ301 - Java Web Application",
    content: "Project cuối kỳ khá to, nhưng được support từ A-Z từ thiết kế database đến deploy. Kết quả A+ luôn!",
    rating: 5,
    semester: "Học kỳ 4"
  },
  {
    name: "Võ Thị Hương",
    avatar: "VH",
    subject: "SWR302 - Software Requirement",
    content: "Coursera course này khó hiểu, nhưng được anh hỗ trợ rush và làm assignment, cuối cùng cũng hoàn thành certificate.",
    rating: 5,
    semester: "Học kỳ 5"
  },
  {
    name: "Đặng Quốc Khánh",
    avatar: "DK",
    subject: "WED201c - Web Design",
    content: "Từ không biết gì về HTML/CSS đến làm được website hoàn chỉnh. Team support rất nhiệt tình và kiên nhẫn!",
    rating: 5,
    semester: "Học kỳ 2"
  },
  {
    name: "Bùi Thị Mai",
    avatar: "BM",
    subject: "PRF192 - Programming Fundamentals",
    content: "C programming lúc đầu mình hoàn toàn bó tay, nhưng được hướng dẫn step by step từ cơ bản đến nâng cao. Bây giờ tự tin code C rồi!",
    rating: 5,
    semester: "Học kỳ 1"
  },
  {
    name: "Ngô Anh Tuấn",
    avatar: "NT",
    subject: "MAD101 - Discrete Mathematics",
    content: "Toán rời rạc khó hiểu lắm, nhưng được giải thích bằng ví dụ thực tế và có bài tập mẫu chi tiết. Điểm A không còn xa vời!",
    rating: 5,
    semester: "Học kỳ 2"
  },
  {
    name: "Lý Văn Đức",
    avatar: "LD",
    subject: "OSG202 - Operating Systems",
    content: "Hệ điều hành phức tạp nhưng team giải thích rất dễ hiểu, có lab thực hành chi tiết. Giờ hiểu Linux command line như pro!",
    rating: 5,
    semester: "Học kỳ 2"
  },
  {
    name: "Hoàng Thị Lan",
    avatar: "HL",
    subject: "JPD113 - Japanese Elementary",
    content: "Học tiếng Nhật từ con số 0, được support vocab và grammar hàng ngày. N5 pass với điểm cao, cảm ơn team rất nhiều!",
    rating: 5,
    semester: "Học kỳ 3"
  },
  {
    name: "Phan Minh Tâm",
    avatar: "PT",
    subject: "SWT301 - Software Testing",
    content: "Testing các kiểu test case, automation test... team có kinh nghiệm thực tế nên dạy rất hay. Project cuối kì full mark!",
    rating: 5,
    semester: "Học kỳ 5"
  },
  {
    name: "Vũ Thị Nga",
    avatar: "VN",
    subject: "NWC204 - Computer Networking",
    content: "Mạng máy tính lý thuyết nhiều, nhưng được hướng dẫn config router, switch thực tế. Hiểu sâu hơn về network protocol!",
    rating: 5,
    semester: "Học kỳ 2"
  }
];

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Phản hồi thật từ sinh viên
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Những câu chuyện thành công thực tế từ các bạn sinh viên đã sử dụng dịch vụ của chúng mình
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-large transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-soft"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="w-12 h-12 mr-4">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.semester}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {testimonial.subject}
                  </span>
                </div>
                
                <div className="flex mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="text-muted-foreground italic">
                  "{testimonial.content}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span>⭐ 100+ đánh giá 5 sao</span>
            <span>🎯 95% sinh viên pass môn</span>
            <span>🚀 Support 24/7</span>
            <span>💯 Cam kết chất lượng</span>
          </div>
        </div>
      </div>
    </section>
  );
};