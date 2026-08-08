import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, CheckCircle, MapPin, QrCode, Trash2, Download } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  isOpen: boolean;
  selectedCount: number;
  onAction: (action: string) => void;
}

export function BulkOperationsSheet({ isOpen, selectedCount, onAction }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        role="dialog" aria-label="الإجراءات المجمعة" className="fixed inset-x-0 bottom-0 z-[90] bg-[#0a0a0c] border-t border-white/[0.08] shadow-[0_-20px_60px_rgba(0,0,0,0.5)] rounded-t-[32px] overflow-hidden"
      >
        <div className="flex flex-col p-6 max-w-2xl mx-auto pb-[calc(1.5rem+env(safe-area-inset-bottom,16px))]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">إدارة {selectedCount} ضيوف</h3>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {confirmDelete ? (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 gap-4"
                >
                  <span className="text-rose-400 font-bold">تأكيد حذف {selectedCount} ضيوف نهائياً؟</span>
                  <div className="flex items-center gap-3 w-full">
                    <button 
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 h-12 rounded-full bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                    >
                      تراجع
                    </button>
                    <button 
                      onClick={() => {
                        setConfirmDelete(false);
                        onAction('delete');
                      }}
                      className="flex-1 h-12 rounded-full bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors shadow-[0_4px_16px_rgba(244,63,94,0.3)]"
                    >
                      تأكيد الحذف
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="actions"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-3"
                >
                  <ActionCard 
                    icon={MessageCircle}
                    title="إرسال واتساب"
                    desc="رسالة مجمعة"
                    color="text-emerald-400"
                    bg="bg-emerald-500/10"
                    onClick={() => onAction('whatsapp')}
                  />
                  <ActionCard 
                    icon={CheckCircle}
                    title="تأكيد الحضور"
                    desc="تغيير الحالة"
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                    onClick={() => onAction('confirm')}
                  />
                  <ActionCard 
                    icon={MapPin}
                    title="تعيين طاولة"
                    desc="نفس الطاولة"
                    color="text-[#E5A93C]"
                    bg="bg-[#E5A93C]/10"
                    onClick={() => onAction('table')}
                  />
                  <ActionCard 
                    icon={QrCode}
                    title="إنشاء QR"
                    desc="للجميع"
                    color="text-purple-400"
                    bg="bg-purple-500/10"
                    onClick={() => onAction('qr')}
                  />
                  <ActionCard 
                    icon={Download}
                    title="تصدير"
                    desc="CSV / Excel"
                    color="text-white/70"
                    bg="bg-white/5"
                    onClick={() => onAction('export')}
                  />
                  <ActionCard 
                    icon={Trash2}
                    title="حذف"
                    desc="نهائي"
                    color="text-rose-400"
                    bg="bg-rose-500/10"
                    onClick={() => setConfirmDelete(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ActionCard({ icon: Icon, title, desc, color, bg, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
    >
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-1", bg, color)}>
        <Icon size={18} />
      </div>
      <span className="text-sm font-bold text-white/90">{title}</span>
      <span className="text-[10px] text-white/40">{desc}</span>
    </button>
  );
}
