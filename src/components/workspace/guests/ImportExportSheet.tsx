import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, FileSpreadsheet, FileText, Smartphone, Link as LinkIcon, QrCode } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportExportSheet({ isOpen, onClose }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
              <h3 className="text-lg font-bold text-white">الاستيراد والتصدير</h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 pb-12 lg:pb-6">
              
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold text-white/50 px-1">استيراد الضيوف</h4>
                <div className="grid grid-cols-2 gap-3">
                  <ActionCard 
                    icon={FileSpreadsheet}
                    title="Excel"
                    onClick={() => {}}
                    bg="bg-emerald-500/10"
                    color="text-emerald-400"
                  />
                  <ActionCard 
                    icon={FileText}
                    title="CSV"
                    onClick={() => {}}
                    bg="bg-blue-500/10"
                    color="text-blue-400"
                  />
                  <ActionCard 
                    icon={Smartphone}
                    title="جهات الاتصال"
                    desc="غير مدعوم"
                    disabled
                    onClick={() => {}}
                    bg="bg-white/5"
                    color="text-white/40"
                  />
                  <ActionCard 
                    icon={Upload}
                    title="لصق أرقام"
                    onClick={() => {}}
                    bg="bg-white/10"
                    color="text-white/80"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold text-white/50 px-1">تصدير البيانات</h4>
                <div className="grid grid-cols-2 gap-3">
                  <ActionCard 
                    icon={FileSpreadsheet}
                    title="Excel"
                    onClick={() => {}}
                    bg="bg-emerald-500/10"
                    color="text-emerald-400"
                  />
                  <ActionCard 
                    icon={FileText}
                    title="CSV"
                    onClick={() => {}}
                    bg="bg-blue-500/10"
                    color="text-blue-400"
                  />
                  <ActionCard 
                    icon={LinkIcon}
                    title="روابط الدعوات"
                    onClick={() => {}}
                    bg="bg-[#E5A93C]/10"
                    color="text-[#E5A93C]"
                  />
                  <ActionCard 
                    icon={QrCode}
                    title="قائمة QR"
                    onClick={() => {}}
                    bg="bg-purple-500/10"
                    color="text-purple-400"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ActionCard({ icon: Icon, title, desc, disabled, onClick, bg, color }: any) {
  return (
    <button 
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all text-center",
        disabled 
          ? "opacity-50 cursor-not-allowed bg-black/20 border-white/5" 
          : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
      )}
    >
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-1", disabled ? "bg-white/5 text-white/30" : bg, disabled ? "" : color)}>
        <Icon size={18} />
      </div>
      <span className={cn("text-sm font-bold", disabled ? "text-white/40" : "text-white/90")}>{title}</span>
      {desc && <span className="text-[10px] text-white/40 mt-1">{desc}</span>}
    </button>
  );
}
