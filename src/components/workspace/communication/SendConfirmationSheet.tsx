import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, AlertTriangle } from 'lucide-react';
import { CommunicationDraft } from './types';
import { Guest } from '../guests/types';

interface SendConfirmationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  draft: CommunicationDraft;
  audienceCount: number;
}

export const SendConfirmationSheet: React.FC<SendConfirmationSheetProps> = ({
  isOpen,
  onClose,
  onConfirm,
  draft,
  audienceCount,
}) => {
  if (!isOpen) return null;

  const intentLabels: Record<string, string> = {
    invitation: 'دعوة زفاف',
    reminder: 'تذكير بالموعد',
    rsvp_confirmation: 'تأكيد الحضور',
    location: 'مشاركة الموقع',
    qr_code: 'رمز الدخول (QR)',
    thank_you: 'رسالة شكر',
    custom: 'رسالة مخصصة',
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4" dir="rtl">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full sm:max-w-md bg-[#18181B] sm:rounded-2xl rounded-t-3xl border-t sm:border border-white/10 shadow-2xl overflow-hidden mt-auto sm:mt-0"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#121215]">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">تأكيد الإرسال</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">عدد المستلمين:</span>
              <span className="font-bold text-white">{audienceCount} ضيف</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">نوع الرسالة:</span>
              <span className="font-medium text-white">{intentLabels[draft.intent] || draft.intent}</span>
            </div>
            {draft.attachments && (draft.attachments.includeCard || draft.attachments.includeLocation || draft.attachments.includeQr) && (
               <div className="flex justify-between">
                 <span className="text-zinc-400">المرفقات:</span>
                 <span className="font-medium text-white text-left max-w-[60%]">
                   {[
                     draft.attachments.includeCard && 'بطاقة الدعوة',
                     draft.attachments.includeLocation && 'الموقع',
                     draft.attachments.includeQr && 'رمز الاستجابة'
                   ].filter(Boolean).join('، ')}
                 </span>
               </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs leading-relaxed flex items-start gap-2">
             <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
             <p>يرجى التأكد من محتوى الرسالة وقائمة المستلمين. لا يمكن التراجع عن هذه العملية بمجرد بدء الإرسال.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 py-3 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>تأكيد وبدء الإرسال</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
