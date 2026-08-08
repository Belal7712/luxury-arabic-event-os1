import { UserPlus, X, CheckSquare, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  totalGuests: number;
  isSelectionMode?: boolean;
  selectedCount?: number;
  onCancelSelection?: () => void;
  onSelectAll?: () => void;
  onOpenOptions?: () => void;
}

export function GuestHeader({ 
  totalGuests, 
  isSelectionMode, 
  selectedCount, 
  onCancelSelection, 
  onSelectAll,
  onOpenOptions
}: Props) {
  
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 h-auto md:h-16">
      <AnimatePresence mode="wait">
        {isSelectionMode ? (
          <motion.div 
            key="selection-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-4 bg-[#E5A93C]/10 border border-[#E5A93C]/20 px-4 py-2.5 rounded-2xl w-full md:w-auto"
          >
            <button 
              onClick={onCancelSelection}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            >
              <X size={16} />
            </button>
            <div className="flex flex-col">
              <span className="text-[#E5A93C] font-bold">{selectedCount} محدد</span>
              <span className="text-white/40 text-[10px] uppercase tracking-wider">وضعية التحديد</span>
            </div>
            
            <div className="w-[1px] h-6 bg-white/10 mx-2" />
            
            <button 
              onClick={onSelectAll}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors text-xs font-medium"
            >
              <CheckSquare size={14} />
              تحديد الكل
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="normal-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-2"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">إدارة الضيوف</h2>
            <div className="flex items-center gap-2 text-sm font-medium text-white/50">
              <span>إجمالي الضيوف</span>
              <span className="text-white/90">{totalGuests}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isSelectionMode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2 shrink-0"
          >
            <motion.button 
              onClick={onOpenOptions}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <MoreVertical size={18} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#E5A93C] text-black font-bold shadow-[0_4px_16px_rgba(229,169,60,0.2)] hover:shadow-[0_8px_24px_rgba(229,169,60,0.3)] transition-all"
            >
              <UserPlus size={18} strokeWidth={2.5} />
              <span>إضافة ضيف</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
