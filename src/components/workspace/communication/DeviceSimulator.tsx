import React from 'react';

export const DeviceSimulator: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative mx-auto w-[280px] sm:w-[320px] aspect-[19.5/9] rounded-[2.5rem] border-[6px] border-zinc-900 bg-black shadow-2xl overflow-hidden ring-1 ring-white/10 shrink-0">
      {/* Dynamic Island / Notch */}
      <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
        <div className="w-20 h-5 bg-zinc-900 rounded-b-2xl flex justify-center items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-white/20"></div>
          <div className="w-1 h-1 rounded-full bg-white/10"></div>
        </div>
      </div>
      
      {/* Screen Content */}
      <div className="relative w-full h-full bg-[#efeae2] flex flex-col font-sans">
        {/* WhatsApp-like Header */}
        <div className="bg-[#008069] text-white px-3 pt-7 pb-2.5 flex items-center gap-2.5 z-10 shrink-0 shadow-sm border-b border-[#005e4d]">
          <div className="flex items-center gap-1 shrink-0">
            <div className="w-2 h-2 border-t-2 border-l-2 border-white rotate-[-45deg] opacity-80" />
            <div className="w-7 h-7 rounded-full bg-white/20 shrink-0 flex items-center justify-center text-xs font-bold text-white/90">
              ح
            </div>
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="font-semibold text-[13px] truncate leading-tight" dir="rtl">حفل الزفاف الميمون</div>
            <div className="text-[9px] text-white/80 leading-none mt-0.5" dir="rtl">حساب أعمال</div>
          </div>
        </div>
        
        {/* Chat Background Pattern */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', 
            backgroundSize: '16px 16px',
            backgroundPosition: 'center',
          }} 
        />
        <div className="absolute inset-0 z-0 bg-[#efeae2] mix-blend-color opacity-80 pointer-events-none" />

        {/* Scrollable Chat Area */}
        <div className="relative z-10 flex-1 overflow-y-auto p-3 custom-scrollbar flex flex-col">
           {children}
        </div>
        
        {/* Fake Composer Bar at Bottom */}
        <div className="bg-[#f0f2f5] px-2 py-2 flex items-center gap-2 shrink-0 z-10">
          <div className="flex-1 bg-white rounded-full h-8 flex items-center px-3 border border-black/5">
            <span className="text-[11px] text-zinc-400 font-medium">مراسلة...</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center shrink-0">
             <div className="w-3 h-3 bg-white" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)', marginLeft: '2px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
