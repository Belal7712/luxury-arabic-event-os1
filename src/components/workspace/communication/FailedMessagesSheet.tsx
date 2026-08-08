import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, RotateCcw } from 'lucide-react';
import { FailedRecipient } from './types';

interface FailedMessagesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  failedRecipients: FailedRecipient[];
  onRetry: (recipientIds: string[]) => void;
}

export const FailedMessagesSheet: React.FC<FailedMessagesSheetProps> = ({
  isOpen,
  onClose,
  failedRecipients,
  onRetry
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4" dir="rtl">
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
        className="relative w-full sm:max-w-2xl h-[80vh] sm:h-[600px] bg-[#18181B] sm:rounded-2xl rounded-t-3xl border-t sm:border border-white/10 shadow-2xl overflow-hidden mt-auto sm:mt-0 flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#121215] shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white">الرسائل الفاشلة</h3>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-xs border border-rose-500/20">
              {failedRecipients.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="space-y-3">
            {failedRecipients.length === 0 ? (
              <div className="text-center p-8 text-zinc-500 text-sm">
                لا توجد رسائل فاشلة.
              </div>
            ) : (
              failedRecipients.map((recipient, i) => (
                <div key={`${recipient.guestId}-${i}`} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-medium text-white">{recipient.name}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5" dir="ltr">{recipient.phone}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    <span className="text-xs text-rose-400 px-2 py-1 rounded bg-rose-500/10 whitespace-nowrap">
                      {recipient.reason}
                    </span>
                    {recipient.canRetry && (
                      <button
                        onClick={() => onRetry([recipient.guestId])}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                        title="إعادة المحاولة"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {failedRecipients.length > 0 && (
          <div className="p-4 border-t border-white/5 bg-[#121215] shrink-0">
            <button
              onClick={() => onRetry(failedRecipients.map(r => r.guestId))}
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة محاولة إرسال الكل ({failedRecipients.length})</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
