import { motion } from 'motion/react';
import { Share, Eye, Globe, MoreHorizontal, Calendar, MapPin, Clock } from 'lucide-react';
import { ElementType } from 'react';

export function WorkspaceHero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 1.2, type: 'spring', bounce: 0, stiffness: 50 }}
      className="relative w-full overflow-hidden rounded-[2.5rem] bg-[#050505] border border-white/[0.08] shadow-2xl group min-h-[340px] sm:min-h-[400px] md:min-h-[460px] lg:min-h-[520px] flex flex-col justify-end"
    >
      {/* Cover Image & Advanced Masking */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.03, 1] }} 
          transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full transform-gpu origin-top"
        >
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80" 
            alt="Wedding Cover"
            className="w-full h-full object-cover opacity-50 mix-blend-luminosity"
          />
        </motion.div>
        
        {/* Luxury Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/90 via-[#000000]/40 to-transparent" />
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
        
        {/* Optical Glow */}
        <div className="absolute -bottom-32 left-1/4 w-1/2 h-64 bg-[#E5A93C]/10 blur-[120px] mix-blend-screen" />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end p-6 sm:p-8 md:p-14 gap-8 lg:gap-10 w-full mt-auto">
        
        {/* Right (RTL Start): Event Identity */}
        <div className="flex flex-col gap-6 max-w-3xl">
          {/* Status & Type - Ultra Minimal */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-2 h-2">
                <div className="absolute inset-0 rounded-full bg-[#E5A93C] animate-ping opacity-40" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#E5A93C] shadow-[0_0_10px_rgba(229,169,60,0.8)]" />
              </div>
              <span className="text-[#E5A93C] text-xs font-semibold tracking-widest uppercase">مفتوح للتأكيد</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-white/50 text-xs font-medium tracking-widest uppercase">حفل زفاف</span>
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] drop-shadow-2xl"
          >
            زفاف محمد وسارة
          </motion.h1>

          {/* Meta Details */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-2"
          >
            <MetaItem icon={Calendar} text="٢٤ سبتمبر ٢٠٢٤" />
            <MetaItem icon={Clock} text="٨:٠٠ مساءً" />
            <MetaItem icon={MapPin} text="قاعة الريتز كارلتون، الرياض" />
          </motion.div>
        </div>

        {/* Left (RTL End): Action Dock & Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1, type: "spring", stiffness: 60 }}
          className="flex flex-col items-start lg:items-end gap-8 shrink-0 w-full lg:w-auto"
        >
          {/* Minimalist Countdown */}
          <div className="flex flex-col items-start lg:items-end text-right mr-2 lg:mr-0">
            <span className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase mb-2">الوقت المتبقي</span>
            <div dir="ltr" className="flex items-baseline gap-2">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-light text-white tabular-nums tracking-tighter">14</span>
                <span className="text-sm text-white/50 font-medium">يوم</span>
              </div>
              <span className="text-3xl font-light text-white/20 tabular-nums tracking-tighter mx-1 pb-1">:</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-light text-white tabular-nums tracking-tighter">08</span>
                <span className="text-sm text-white/50 font-medium">ساعة</span>
              </div>
            </div>
          </div>

          {/* Premium Action Dock */}
          <div className="flex items-center p-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)] w-full lg:w-auto justify-between lg:justify-start">
            <ActionButton icon={Share} label="مشاركة" />
            <ActionButton icon={Eye} label="معاينة" />
            <ActionButton icon={Globe} label="نشر" primary />
            <div className="w-[1px] h-6 bg-white/10 mx-2 hidden sm:block" />
            <button className="w-10 h-10 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function MetaItem({ icon: Icon, text }: { icon: ElementType, text: string }) {
  return (
    <div className="flex items-center gap-3 group cursor-default">
      <div className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:bg-white/[0.08] group-hover:border-white/[0.1] transition-all duration-300 shadow-[inset_0_0_10px_rgba(255,255,255,0.02)]">
        <Icon size={15} className="text-white/60 group-hover:text-[#E5A93C] transition-colors" />
      </div>
      <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">{text}</span>
    </div>
  );
}

interface ActionButtonProps {
  icon: ElementType;
  label: string;
  primary?: boolean;
}

function ActionButton({ icon: Icon, label, primary }: ActionButtonProps) {
  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={`flex flex-1 sm:flex-none items-center justify-center gap-2.5 px-5 py-2.5 rounded-full font-medium transition-all duration-300 relative overflow-hidden ${
        primary 
          ? 'bg-gradient-to-b from-[#E5A93C] to-[#C28A26] text-black shadow-[0_0_20px_rgba(229,169,60,0.2)] hover:shadow-[0_0_30px_rgba(229,169,60,0.4)] border border-white/20 mr-1' 
          : 'text-white/70 hover:text-white hover:bg-white/10 bg-transparent'
      }`}
    >
      {primary && (
        <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
      )}
      <Icon size={16} strokeWidth={2} className={`relative z-10 shrink-0 ${primary ? "text-black/80" : ""}`} />
      <span className={`text-sm relative z-10 tracking-wide ${primary ? "font-bold" : ""}`}>{label}</span>
    </motion.button>
  );
}


