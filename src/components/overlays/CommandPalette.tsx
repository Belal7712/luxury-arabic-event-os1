import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: Props) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // Since we don't have a global toggle fn injected, this relies on the parent's state
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-md z-[60] cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-[#121214]/90 backdrop-blur-3xl border border-zinc-700/50 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-[60] overflow-hidden"
          >
            <div className="flex items-center px-6 py-5 border-b border-zinc-800/50 gap-4">
              <Search className="text-amber-500 shrink-0" size={24} />
              <input
                autoFocus
                type="text"
                placeholder="ابحث عن ضيف، إعداد، أو إجراء..."
                className="flex-1 bg-transparent border-none outline-none text-xl text-white placeholder-zinc-600"
              />
              <div className="flex items-center gap-1 text-xs font-sans font-medium text-zinc-500 bg-zinc-800/80 px-2 py-1 rounded-md border border-zinc-700/50">
                <span>ESC</span>
              </div>
            </div>
            
            <div className="p-4 max-h-[400px] overflow-y-auto">
               <div className="text-xs font-bold text-zinc-500 mb-3 px-3 uppercase tracking-wider">اقتراحات سريعة</div>
               <div className="space-y-1">
                 {['إضافة ضيف جديد', 'تعديل تصميم الدعوة', 'إرسال تذكير عبر الواتساب', 'إعدادات الخصوصية'].map((item, i) => (
                   <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-800/60 hover:text-amber-400 text-zinc-300 transition-all duration-200 group">
                     <span className="font-semibold">{item}</span>
                     <ArrowLeft size={18} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-500" />
                   </button>
                 ))}
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
