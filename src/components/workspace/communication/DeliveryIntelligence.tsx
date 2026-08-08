import React from 'react';
import { Campaign } from './types';
import { Send, CheckCircle2, Check, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export const DeliveryIntelligence: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
  const { stats, status } = campaign;
  const isComplete = ['completed', 'failed', 'partially_failed'].includes(status);
  const isScheduled = status === 'scheduled';
  
  const readPercent = Math.round((stats.read / (stats.delivered || 1)) * 100) || 0;
  const deliveryPercent = Math.round((stats.delivered / (stats.sent || 1)) * 100) || 0;
  const progressPercent = Math.round(((stats.sent + stats.failed) / (stats.total || 1)) * 100) || 0;

  return (
    <div className="space-y-6">
      {!isComplete && !isScheduled && (
        <div className="p-5 rounded-2xl bg-[#E5A93C]/5 border border-[#E5A93C]/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[#E5A93C] flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5A93C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E5A93C]"></span>
              </span>
              جارٍ الإرسال...
            </h4>
            <span className="text-xs text-[#E5A93C] font-medium">
              {stats.sent + stats.failed} / {stats.total}
            </span>
          </div>
          <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#E5A93C] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {isScheduled && (
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
          <Clock className="w-5 h-5 text-[#E5A93C]" />
          <div>
            <h4 className="text-sm font-semibold text-white">حملة مجدولة</h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              سيتم الإرسال في: {new Date(campaign.scheduledAt!).toLocaleString('ar-SA')}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Send className="w-3 h-3 text-blue-400" />
            </div>
            <span className="text-xs text-zinc-400">تم الإرسال</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.sent}</div>
        </div>
        
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-2">
               <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                 <Check className="w-3 h-3 text-emerald-400" />
               </div>
               <span className="text-xs text-zinc-400">تم التسليم</span>
             </div>
             {stats.sent > 0 && <span className="text-[10px] text-emerald-400">{deliveryPercent}%</span>}
          </div>
          <div className="text-2xl font-bold text-white">{stats.delivered}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#E5A93C]/10 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-[#E5A93C]" />
              </div>
              <span className="text-xs text-zinc-400">تمت القراءة</span>
            </div>
            {stats.delivered > 0 && <span className="text-[10px] text-[#E5A93C]">{readPercent}%</span>}
          </div>
          <div className="text-2xl font-bold text-white">{stats.read}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center">
              <AlertCircle className="w-3 h-3 text-rose-400" />
            </div>
            <span className="text-xs text-zinc-400">فشل الإرسال</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.failed}</div>
        </div>
      </div>
      
      {!isComplete && !isScheduled && (
        <div className="flex gap-4 p-4 rounded-xl bg-white/[0.01]">
          <div className="flex-1">
             <div className="text-xs text-zinc-500 mb-1">في الانتظار</div>
             <div className="text-sm font-medium text-white">{stats.queued}</div>
          </div>
          <div className="w-px bg-white/5" />
          <div className="flex-1">
             <div className="text-xs text-zinc-500 mb-1">قيد المعالجة الآن</div>
             <div className="text-sm font-medium text-white">{stats.sending}</div>
          </div>
        </div>
      )}
    </div>
  );
};
