import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';

interface Props {
  message: string;
  isVisible: boolean;
  onUndo: () => void;
  onClose: () => void;
}

export function UndoToast({ message, isVisible, onUndo, onClose }: Props) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-[150] flex items-center gap-4 bg-[#111] border border-white/10 px-5 py-3.5 rounded-full shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
        >
          <span className="text-white/90 text-sm font-medium tracking-wide">{message}</span>
          <div className="w-[1px] h-4 bg-white/10" />
          <button
            onClick={() => {
              onUndo();
              onClose();
            }}
            className="flex items-center gap-1.5 text-[#E5A93C] hover:text-[#C28A26] transition-colors"
          >
            <RotateCcw size={14} />
            <span className="text-sm font-bold">تراجع</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
