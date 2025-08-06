import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ExternalLink } from "lucide-react";

const subjects = {
  "Học kỳ 1": ["SSL101c", "PRF192", "PFP191", "CSI106", "CEA201", "MAE101"],
  "Học kỳ 2": ["PRO192", "MAD101", "OSG202", "NWC204", "WED201c", "SSG104", "OBE102c"],
  "Học kỳ 3": ["CSD201", "DBI202", "JPD113", "WED201c"],
  "Học kỳ 4": ["PRJ301", "PRJ302", "JPD123", "IOT102", "MAS291", "SWE201c"],
  "Học kỳ 5": ["SWR302", "SWT301", "PRN212", "ITE302c"],
  "Học kỳ 6": ["SWD392", "SYB302c", "PMG201c", "PRU212"],
  "Học kỳ 7": ["MLN111", "MLN121", "WDU203c"]
};

const semesterColors = [
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-green-100 text-green-800 border-green-200", 
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-orange-100 text-orange-800 border-orange-200",
  "bg-red-100 text-red-800 border-red-200",
  "bg-indigo-100 text-indigo-800 border-indigo-200",
  "bg-pink-100 text-pink-800 border-pink-200"
];

export const SubjectsSection = () => {
  const handleSubjectClick = (subject: string) => {
    // Open Google Docs demo link
    window.open('https://docs.google.com/document/d/1THKvW20D4o-bPxCyrillclf1R5Z_29Os5EpOX6G--dw/edit?usp=sharing', '_blank');
  };

  return (
    <section id="subjects" className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tìm dịch vụ theo môn học
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Chọn môn học bạn cần hỗ trợ để xem tài liệu và dịch vụ phù hợp
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(subjects).map(([semester, subjectList], semesterIndex) => (
            <Card key={semester} className="hover:shadow-medium transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  {semester}
                </CardTitle>
                <CardDescription>
                  {subjectList.length} môn học
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  {subjectList.map((subject) => (
                    <Button
                      key={subject}
                      variant="outline"
                      size="sm"
                      className={`w-full justify-between group ${semesterColors[semesterIndex % semesterColors.length]} hover:scale-105 transition-transform`}
                      onClick={() => handleSubjectClick(subject)}
                    >
                      <span className="font-mono font-semibold">{subject}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12 space-y-4">
          <p className="text-muted-foreground">
            💡 Click vào môn học để xem demo tài liệu và dịch vụ hỗ trợ
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">📚 Tài liệu đầy đủ</Badge>
            <Badge variant="secondary">💻 Source code mẫu</Badge>
            <Badge variant="secondary">🎯 Đề thi có lời giải</Badge>
            <Badge variant="secondary">🚀 Hỗ trợ 24/7</Badge>
          </div>
        </div>
      </div>
    </section>
  );
};