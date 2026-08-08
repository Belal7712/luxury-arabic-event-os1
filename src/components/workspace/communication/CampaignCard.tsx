import React from 'react';
import { Campaign } from './types';
import { Send, Clock, AlertTriangle, FileText, CheckCircle2, RotateCcw, Copy, Trash2, StopCircle } from 'lucide-react';
import { INTENT_OPTIONS } from './MessageIntentSelector';

interface CampaignCardProps {
  campaign: Campaign;
  onViewDetails: () => void;
  onReuse: () => void;
  onDuplicate: () => void;
  onCancelSchedule?: () => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onViewDetails,
  onReuse,
  onDuplicate,
  onCancelSchedule
}) => {
  const { title, intent, status, stats, createdAt, scheduledAt } = campaign;
  const intentLabel = INTENT_OPTIONS.find(i => i.id === intent)?.title || intent;
  
  const readPercent = Math.round((stats.read / (stats.delivered || 1)) * 100) || 0;
  
  const statusConfig = {
    draft: { label: 'مسودة', color: 'text-zinc-400', bg: 'bg-zinc-500/10' },
    scheduled: { label: 'مجدولة', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    queued: { label: 'قيد الانتظار', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    sending: { label: 'جارٍ الإرسال', color: 'text-[#E5A93C]', bg: 'bg-[#E5A93C]/10' },
    completed: { label: 'مكتملة', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    partially_failed: { label: 'مكتملة جزئياً', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    failed: { label: 'فشلت', color: 'text-rose-400', bg: 'bg-rose-500/10' },
    cancelled: { label: 'ملغاة', color: 'text-zinc-500', bg: 'bg-zinc-500/10' },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <div className="space-y-3 flex-1 w-full">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <h4 className="text-sm font-bold text-white">{title}</h4>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border border-current ${config.color} ${config.bg}`}>
            {config.label}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>{intentLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{scheduledAt && status === 'scheduled' ? new Date(scheduledAt).toLocaleString('ar-SA') : new Date(createdAt).toLocaleDateString('ar-SA')}</span>
          </div>
        </div>
        
        {['completed', 'partially_failed', 'sending', 'queued'].includes(status) && (
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="text-zinc-500">الإجمالي:</span>
              <span className="font-medium text-white">{stats.total}</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="text-zinc-500">تم التسليم:</span>
              <span className="font-medium text-emerald-400">{stats.delivered}</span>
            </div>
            {stats.failed > 0 && (
               <div className="flex items-center gap-1.5 text-rose-400">
                 <AlertTriangle className="w-3.5 h-3.5" />
                 <span className="font-medium">{stats.failed} فشل</span>
               </div>
            )}
            {stats.read > 0 && (
               <div className="flex items-center gap-1.5 text-[#E5A93C]">
                 <CheckCircle2 className="w-3.5 h-3.5" />
                 <span className="font-medium">{readPercent}% قراءة</span>
               </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
        <button
          onClick={onViewDetails}
          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors text-center"
        >
          التفاصيل
        </button>
        <button
          onClick={onReuse}
          title="إعادة استخدام المحتوى"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={onDuplicate}
          title="تكرار الحملة"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <Copy className="w-4 h-4" />
        </button>
        {status === 'scheduled' && onCancelSchedule && (
           <button
             onClick={onCancelSchedule}
             title="إلغاء الجدولة"
             className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-rose-400 transition-colors"
           >
             <StopCircle className="w-4 h-4" />
           </button>
        )}
      </div>
    </div>
  );
};
