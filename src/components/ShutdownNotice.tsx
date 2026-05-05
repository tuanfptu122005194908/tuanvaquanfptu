import { useEffect, useState } from "react";

export const ShutdownNotice = () => {
  const [countdown, setCountdown] = useState(15);
  const targetUrl = "https://tqmaster.vercel.app/";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = targetUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xl font-sans overflow-hidden">
      {/* Background Animated Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pink-600/30 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/30 blur-[120px] animate-pulse delay-1000"></div>

      <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-[90%] text-center transform transition-all hover:scale-[1.02] overflow-hidden">
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]"></div>

        <div className="mb-8 flex justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-violet-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <div className="relative h-24 w-24 bg-gradient-to-tr from-pink-500 to-violet-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.5)]">
            <svg className="w-12 h-12 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-violet-300 mb-4 tracking-tight drop-shadow-md">
          Chuyển Nhà Mới!
        </h1>
        
        <p className="text-gray-200 text-lg md:text-xl mb-8 leading-relaxed font-medium">
          Website này đã chính thức ngừng hoạt động. Mọi tính năng, dịch vụ và dữ liệu đã được nâng cấp và chuyển sang hệ thống mới.
        </p>
        
        <a 
          href={targetUrl}
          className="relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] hover:from-pink-400 hover:to-violet-500 hover:-translate-y-1 ring-2 ring-white/20 ring-offset-2 ring-offset-black/50 overflow-hidden group"
        >
          <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
          <span className="relative flex items-center gap-2">
            Trải nghiệm TQMaster ngay
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </a>
        
        <div className="mt-8 text-sm text-gray-400 font-medium bg-black/30 rounded-full py-2 px-4 inline-block">
          Đang tự động chuyển hướng sau <span className="text-pink-400 font-bold">{countdown}</span> giây...
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ShutdownNotice;
