import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, UserPlus } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 cursor-pointer"
          />
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-full max-w-sm bg-[#0c0c0e] border-r border-zinc-800 z-50 shadow-2xl flex flex-col"
          >
            <div className="px-6 py-5 flex justify-between items-center border-b border-zinc-800/50">
              <div className="flex items-center gap-3">
                <Bell className="text-amber-500" size={20} />
                <h2 className="text-lg font-bold text-white">الإشعارات</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="p-4 rounded-2xl glass-panel bg-zinc-900/60 hover:bg-zinc-800/80 transition-colors cursor-pointer group">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex flex-shrink-0 items-center justify-center mt-0.5 border border-amber-500/20">
                      <UserPlus size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-200 group-hover:text-amber-400 transition-colors">تأكيد حضور جديد</h4>
                      <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed font-medium">قام "أحمد العبدالله" بتأكيد حضوره مع مرافق واحد.</p>
                      <span className="text-[10px] text-zinc-500 mt-2 block font-medium">منذ ١٠ دقائق</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
