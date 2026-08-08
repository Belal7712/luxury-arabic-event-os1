import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (table: string) => void;
  currentTable?: string;
}

const mockTables = [
  { id: 'VIP1', name: 'طاولة كبار الشخصيات ١', capacity: 8, occupied: 6 },
  { id: 'VIP2', name: 'طاولة كبار الشخصيات ٢', capacity: 8, occupied: 2 },
  { id: 'A1', name: 'طاولة العائلة ١', capacity: 10, occupied: 10 },
  { id: 'A2', name: 'طاولة العائلة ٢', capacity: 10, occupied: 4 },
  { id: 'B1', name: 'طاولة الأصدقاء ١', capacity: 6, occupied: 3 },
  { id: 'C1', name: 'طاولة زملاء العمل', capacity: 8, occupied: 0 },
];

export function TableAssignmentSheet({ isOpen, onClose, onAssign, currentTable }: Props) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
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
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            role="dialog" aria-modal="true" className="fixed inset-x-0 bottom-0 z-[120] lg:right-0 lg:left-auto lg:top-0 lg:bottom-auto lg:w-[400px] lg:h-screen lg:border-l lg:rounded-none bg-[#0a0a0c] border-t border-white/[0.08] shadow-[0_-20px_60px_rgba(0,0,0,0.5)] rounded-t-[32px] overflow-hidden flex flex-col pb-[env(safe-area-inset-bottom,24px)]"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.05]">
              <h3 className="text-lg font-bold text-white">تعيين طاولة</h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 pb-12 lg:pb-4">
              <button 
                onClick={() => {
                  onAssign('');
                  onClose();
                }}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border transition-all text-right",
                  !currentTable 
                    ? "bg-[#E5A93C]/10 border-[#E5A93C]/20 text-[#E5A93C]" 
                    : "bg-white/[0.02] border-white/5 text-white hover:bg-white/[0.04]"
                )}
              >
                <span className="font-bold">بدون طاولة</span>
                {!currentTable && <Check size={18} />}
              </button>

              {mockTables.map(table => {
                const isFull = table.occupied >= table.capacity;
                const isSelected = currentTable === table.id;
                
                return (
                  <button 
                    key={table.id}
                    disabled={isFull && !isSelected}
                    onClick={() => {
                      if (!isFull || isSelected) {
                        onAssign(table.id);
                        onClose();
                      }
                    }}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all text-right",
                      isSelected 
                        ? "bg-[#E5A93C]/10 border-[#E5A93C]/20 text-[#E5A93C]" 
                        : isFull 
                          ? "opacity-50 cursor-not-allowed bg-black/20 border-white/5" 
                          : "bg-white/[0.02] border-white/5 text-white hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-bold">{table.name}</span>
                      <div className="flex items-center gap-2 text-xs opacity-70">
                        <span dir="ltr">{table.id}</span>
                        <span>•</span>
                        <span>{table.occupied} / {table.capacity} مقاعد</span>
                      </div>
                    </div>
                    {isSelected && <Check size={18} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
