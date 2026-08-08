import { motion } from 'motion/react';
import { 
  UserPlus, MessageCircle, Palette, 
  QrCode, Grid2X2,
  Command, Sparkles
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ElementType } from 'react';

// Utility for Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ----------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------

function PrimaryActionTile() {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type: 'spring', stiffness: 50, damping: 15 }}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full h-full min-h-[160px] lg:min-h-[224px] flex flex-col items-start justify-between p-6 rounded-[24px] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 overflow-hidden group text-right shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)] focus:outline-none focus:ring-2 focus:ring-[#E5A93C]/50"
      aria-label="إضافة ضيف جديد"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="w-14 h-14 rounded-full bg-white/[0.05] flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 shadow-inner ring-1 ring-white/10">
        <UserPlus size={26} className="text-white/80 group-hover:text-[#E5A93C] transition-colors" strokeWidth={2} />
      </div>

      <div className="relative z-10 w-full flex items-end justify-between">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl font-bold text-white tracking-wide">إضافة ضيف جديد</h3>
          <p className="text-[#E5A93C]/80 text-sm font-medium">تسجيل سريع لدعوة فردية</p>
        </div>
        
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white/40 text-xs font-mono tracking-widest" dir="ltr">
          <Command size={12} />
          <span>N</span>
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#E5A93C]/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-[#E5A93C]/20 transition-colors duration-500" />
    </motion.button>
  );
}

interface SecondaryActionProps {
  title: string;
  description: string;
  icon: ElementType;
  badge?: string;
  badgeColor?: 'amber' | 'blue' | 'emerald';
  bg: string;
  color: string;
  delay: number;
}

function SecondaryActionTile({ title, description, icon: Icon, badge, badgeColor, bg, color, delay }: SecondaryActionProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 50, damping: 15 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full h-[100px] sm:h-[104px] flex items-center p-5 rounded-[20px] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 overflow-hidden group text-right shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-2 focus:ring-white/20"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-center gap-4 w-full relative z-10">
        <div className={cn(
          "w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 shadow-inner ring-1 ring-white/10",
          bg
        )}>
          <Icon size={22} className={color} strokeWidth={2} />
        </div>
        
        <div className="flex flex-col flex-1 gap-1">
          <div className="flex justify-between items-center w-full">
            <h3 className="text-white font-bold tracking-wide text-[15px]">{title}</h3>
            {badge && (
               <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
                 <div className={cn(
                   "w-1.5 h-1.5 rounded-full", 
                   badgeColor === 'amber' ? 'bg-amber-400 animate-pulse' : 
                   badgeColor === 'emerald' ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'
                 )} />
                 <span className={cn(
                   "text-[10px] font-bold tracking-wide", 
                   badgeColor === 'amber' ? 'text-amber-400' : 
                   badgeColor === 'emerald' ? 'text-emerald-400' : 'text-blue-400'
                 )}>{badge}</span>
               </div>
            )}
          </div>
          <p className="text-white/40 text-xs font-medium">{description}</p>
        </div>
      </div>
    </motion.button>
  );
}

interface TertiaryActionProps {
  title: string;
  icon: ElementType;
  color: string;
  delay: number;
}

function TertiaryActionTile({ title, icon: Icon, color, delay }: TertiaryActionProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 50, damping: 15 }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.96 }}
      className="relative w-full h-[88px] flex flex-col items-center justify-center gap-2.5 p-3 rounded-[16px] bg-white/[0.015] border border-white/[0.03] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-400 group shadow-[0_4px_16px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-white/20"
      aria-label={title}
    >
       <div className={cn("transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-0.5", color)}>
         <Icon size={20} strokeWidth={2.5} />
       </div>
       <span className="text-white/60 text-xs font-semibold group-hover:text-white transition-colors duration-300">{title}</span>
    </motion.button>
  );
}

// ----------------------------------------------------------------------
// MAIN EXPORT
// ----------------------------------------------------------------------

export function QuickActions() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-lg font-bold text-white tracking-wide">إجراءات سريعة</h2>
        <div className="flex items-center gap-1.5 text-white/30 text-xs font-medium hover:text-white/60 transition-colors cursor-pointer">
          <Sparkles size={14} />
          <span>إجراءات ذكية</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 xl:gap-6">
        
        {/* PRIMARY ACTION BLOCK */}
        <div className="w-full lg:w-1/3 flex-shrink-0">
          <PrimaryActionTile />
        </div>

        {/* SECONDARY & TERTIARY ACTIONS BLOCK */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4 xl:gap-6">
          
          {/* SECONDARY ACTIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:gap-6">
            <div onClick={() => window.dispatchEvent(new CustomEvent('open-communication', { detail: { audiencePreset: 'all' } }))}>
              <SecondaryActionTile 
                title="بث واتساب"
                description="٣ رسائل بانتظار الإرسال"
                icon={MessageCircle}
                badge="معلق"
                badgeColor="amber"
                bg="bg-white/[0.04]"
                color="text-amber-400"
                delay={0.15}
              />
            </div>
            <SecondaryActionTile 
              title="تصميم الدعوة"
              description="مكتمل ٨٠٪"
              icon={Palette}
              bg="bg-white/[0.04]"
              color="text-emerald-400"
              delay={0.2}
            />
          </div>

          {/* TERTIARY ACTIONS */}
          <div className="grid grid-cols-2 gap-4 xl:gap-6">
            <TertiaryActionTile title="ماسح QR" icon={QrCode} color="text-white/70" delay={0.25} />
            <TertiaryActionTile title="الطاولات" icon={Grid2X2} color="text-white/70" delay={0.3} />
          </div>

        </div>
      </div>
    </section>
  );
}
