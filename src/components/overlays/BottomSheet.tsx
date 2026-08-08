import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function BottomSheet({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 cursor-pointer"
          />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-[#0c0c0e] border-t border-zinc-800 rounded-t-[2.5rem] z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
          >
            <div className="flex justify-center p-4 shrink-0">
              <div className="w-16 h-1.5 bg-zinc-700 rounded-full" />
            </div>
            
            <div className="px-8 pb-4 flex justify-between items-center shrink-0 border-b border-zinc-800/50">
              <h2 className="text-2xl font-bold text-white">إجراء جديد</h2>
              <button onClick={onClose} className="p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              {/* Content Placeholder */}
              <div className="h-64 rounded-[2rem] glass-panel border-dashed flex items-center justify-center text-zinc-500">
                محتوى النافذة المنبثقة
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
