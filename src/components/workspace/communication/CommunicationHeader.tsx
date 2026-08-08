import React from 'react';
import { X, MessageSquare, Check, Sparkles } from 'lucide-react';

interface CommunicationHeaderProps {
  onClose: () => void;
  draftSavedAt?: string;
  isSavingDraft?: boolean;
}

export const CommunicationHeader: React.FC<CommunicationHeaderProps> = ({
  onClose,
  draftSavedAt,
  isSavingDraft = false,
}) => {
  return (
    <header className="relative flex items-center justify-between gap-4 p-5 md:p-6 border-b border-white/5 bg-[#0A0A0C]/80 backdrop-blur-2xl rounded-t-3xl text-right">
      {/* Right side (RTL Start): Title & Description */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E5A93C]/20 to-[#C28A26]/5 border border-[#E5A93C]/30 text-[#E5A93C] shrink-0 shadow-lg shadow-[#E5A93C]/5">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2
              id="comm-workspace-title"
              className="text-lg md:text-xl font-bold text-white tracking-wide truncate"
            >
              التواصل مع الضيوف
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E5A93C]/10 text-[#E5A93C] border border-[#E5A93C]/20">
              <Sparkles className="w-3 h-3" />
              <span>محرك الواتساب</span>
            </span>
          </div>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5 truncate">
            نظام إرسال الرسائل الذكي وتتبع وصول البطاقات والتذكيرات
          </p>
        </div>
      </div>

      {/* Left side (RTL End): Status Badge & Close Button */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Draft indicator */}
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-zinc-300 transition-colors"
          title="حالة المسودة المحلية"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isSavingDraft
                ? 'bg-amber-400 animate-pulse'
                : 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
            }`}
          />
          <span className="flex items-center gap-1 font-normal text-zinc-300">
            {isSavingDraft ? (
              'جارٍ حفظ المسودة...'
            ) : (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>مسودة محفوظة</span>
              </>
            )}
          </span>
          {draftSavedAt && !isSavingDraft && (
            <span className="text-[10px] text-zinc-500 border-r border-white/10 pr-2 mr-1">
              {draftSavedAt}
            </span>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="إغلاق حيز التواصل"
          className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12] border border-white/10 text-zinc-400 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E5A93C]/50 focus:border-[#E5A93C]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
