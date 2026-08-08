import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { CommunicationDraft } from './types';

interface ScheduleSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: string) => void;
  draft: CommunicationDraft;
}

export const ScheduleSheet: React.FC<ScheduleSheetProps> = ({
  isOpen,
  onClose,
  onSchedule,
  draft,
}) => {
  // Setup default date: tomorrow at 10:00 AM
  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return d;
  };

  const [date, setDate] = useState<string>(getTomorrow().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('10:00');

  const handleConfirm = () => {
    const scheduledDate = new Date(`${date}T${time}:00`);
    onSchedule(scheduledDate.toISOString());
  };

  if (!isOpen) return null;

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
            <CalendarIcon className="w-5 h-5 text-[#E5A93C]" />
            <h3 className="text-base font-bold text-white">جدولة الإرسال</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-400">تاريخ الإرسال</label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-10 text-sm text-white focus:outline-none focus:border-[#E5A93C]/50"
                  style={{ colorScheme: 'dark' }}
                />
                <CalendarIcon className="w-4 h-4 text-zinc-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-400">وقت الإرسال</label>
              <div className="relative">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-10 text-sm text-white focus:outline-none focus:border-[#E5A93C]/50"
                  style={{ colorScheme: 'dark' }}
                />
                <Clock className="w-4 h-4 text-zinc-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-zinc-300">
            سيتم إرسال الحملة تلقائياً في الموعد المحدد.
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 rounded-xl bg-[#E5A93C] text-black font-bold hover:bg-[#F6C667] transition-colors"
            >
              تأكيد الجدولة
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
