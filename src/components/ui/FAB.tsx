import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export function FAB({ onClick }: { onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', delay: 0.8 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="fixed bottom-8 left-8 md:bottom-12 md:left-12 z-40 flex items-center justify-center gap-2 bg-gradient-to-tr from-amber-600 to-amber-400 text-zinc-950 p-4 rounded-full shadow-[0_8px_30px_rgba(245,158,11,0.4)] hover:shadow-[0_12px_40px_rgba(245,158,11,0.6)] border border-amber-300/30 transition-all duration-300"
    >
      <Plus size={24} strokeWidth={3} className="transition-transform duration-300 group-hover:rotate-90" />
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="overflow-hidden whitespace-nowrap font-bold text-sm pl-2"
          >
            إجراء جديد
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
