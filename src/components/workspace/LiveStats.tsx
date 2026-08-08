import { motion } from 'motion/react';
import { 
  Users, UserCheck, UserX, Clock, 
  Send, CheckCheck, Eye, QrCode, 
  Grid2X2, Percent, Mail, Activity 
} from 'lucide-react';
import { ElementType, useEffect, useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ----------------------------------------------------------------------
// DATA
// ----------------------------------------------------------------------

const statsData = [
  { id: 'guests', label: 'إجمالي المدعوين', value: 350, suffix: '', trend: '+12%', trendUp: true, icon: Users, color: 'text-zinc-100', bg: 'bg-zinc-800/50', realtime: false, sparkline: [10, 20, 15, 30, 40, 35, 50] },
  { id: 'confirmed', label: 'تم التأكيد', value: 210, suffix: '', trend: '+5%', trendUp: true, icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', realtime: true, sparkline: [5, 10, 20, 25, 40, 60, 80] },
  { id: 'pending', label: 'بانتظار الرد', value: 95, suffix: '', trend: '-2%', trendUp: false, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', realtime: false, sparkline: [50, 45, 40, 35, 30, 25, 20] },
  { id: 'declined', label: 'تم الاعتذار', value: 45, suffix: '', trend: '0%', trendUp: true, icon: UserX, color: 'text-rose-400', bg: 'bg-rose-500/10', realtime: false, sparkline: [10, 12, 11, 15, 14, 16, 18] },
  { id: 'sent', label: 'الرسائل المرسلة', value: 350, suffix: '', trend: '100%', trendUp: true, icon: Send, color: 'text-blue-400', bg: 'bg-blue-500/10', realtime: false, sparkline: [0, 50, 100, 200, 300, 350, 350] },
  { id: 'delivered', label: 'تم التسليم', value: 342, suffix: '', trend: '98%', trendUp: true, icon: CheckCheck, color: 'text-teal-400', bg: 'bg-teal-500/10', realtime: true, sparkline: [0, 40, 90, 190, 290, 342, 342] },
  { id: 'read', label: 'تمت القراءة', value: 280, suffix: '', trend: '80%', trendUp: true, icon: Eye, color: 'text-indigo-400', bg: 'bg-indigo-500/10', realtime: true, sparkline: [0, 20, 50, 100, 180, 250, 280] },
  { id: 'qr', label: 'تسجيل دخول QR', value: 15, suffix: '', trend: '+15', trendUp: true, icon: QrCode, color: 'text-purple-400', bg: 'bg-purple-500/10', realtime: true, sparkline: [0, 0, 0, 2, 5, 10, 15] },
  { id: 'tables', label: 'الطاولات المعينة', value: 24, suffix: '/30', trend: '80%', trendUp: true, icon: Grid2X2, color: 'text-zinc-300', bg: 'bg-zinc-700/50', realtime: false, sparkline: [0, 5, 10, 15, 20, 22, 24] },
  { id: 'occupancy', label: 'نسبة الإشغال', value: 75, suffix: '%', trend: '+5%', trendUp: true, icon: Percent, color: 'text-[#E5A93C]', bg: 'bg-[#E5A93C]/10', realtime: false, sparkline: [40, 45, 50, 55, 60, 70, 75] },
  { id: 'remaining', label: 'الدعوات المتبقية', value: 50, suffix: '', trend: '-10', trendUp: false, icon: Mail, color: 'text-zinc-400', bg: 'bg-zinc-800/40', realtime: false, sparkline: [100, 90, 80, 70, 60, 55, 50] },
  { id: 'response', label: 'معدل الاستجابة', value: 85, suffix: '%', trend: '+2%', trendUp: true, icon: Activity, color: 'text-emerald-300', bg: 'bg-emerald-400/10', realtime: true, sparkline: [60, 65, 70, 75, 80, 82, 85] },
];

// ----------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 1000; // 1 second animation
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * (value - startValue) + startValue));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value]);

  return (
    <div dir="ltr" className="flex items-baseline gap-1">
      <span className="text-3xl font-light text-white tracking-tighter tabular-nums">{count.toLocaleString('en-US')}</span>
      {suffix && <span className="text-lg font-medium text-white/40">{suffix}</span>}
    </div>
  );
}

function TrendBadge({ trend, trendUp }: { trend: string; trendUp: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-1 px-2 py-1 rounded-[12px] border text-[11px] font-bold tracking-wide backdrop-blur-md",
      trendUp 
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
    )}>
      <span>{trendUp ? '↑' : '↓'}</span>
      <span dir="ltr">{trend.replace(/[-+]/g, '')}</span>
    </div>
  );
}

function RealtimeBadge() {
  return (
    <div className="relative flex items-center justify-center w-2 h-2">
      <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
    </div>
  );
}

function SparklinePlaceholder({ data, colorClass }: { data: number[], colorClass: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-16 h-8 opacity-30 group-hover:opacity-60 transition-opacity duration-500">
      <svg viewBox="0 -10 100 120" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <polyline 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          points={points} 
          className={colorClass}
        />
      </svg>
    </div>
  );
}

function StatCard({ stat, index, status = 'success' }: { stat: typeof statsData[0]; index: number; status?: 'loading' | 'error' | 'empty' | 'success'; key?: string | number }) {
  const { icon: Icon } = stat;
  
  if (status === 'loading') {
    return (
      <div className="group relative overflow-hidden rounded-[24px] bg-white/[0.01] border border-white/[0.02] p-5 cursor-default h-full min-h-[144px] flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-[12px] bg-white/[0.03] animate-pulse" />
          <div className="w-16 h-6 rounded-[12px] bg-white/[0.03] animate-pulse" />
        </div>
        <div className="flex flex-col gap-2 mt-6">
          <div className="w-24 h-3 rounded bg-white/[0.03] animate-pulse" />
          <div className="w-32 h-8 rounded bg-white/[0.03] animate-pulse mt-1" />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="group relative overflow-hidden rounded-[24px] bg-rose-500/[0.02] border border-rose-500/[0.05] p-5 cursor-default h-full min-h-[144px] flex flex-col justify-center items-center text-center">
        <div className="w-10 h-10 rounded-[12px] bg-rose-500/10 flex items-center justify-center mb-3">
          <Activity size={18} className="text-rose-400" />
        </div>
        <span className="text-rose-400/80 text-xs font-medium">فشل تحميل البيانات</span>
        <button className="mt-2 text-[10px] text-white/40 hover:text-white transition-colors underline underline-offset-2">إعادة المحاولة</button>
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className="group relative overflow-hidden rounded-[24px] bg-white/[0.01] border border-white/[0.05] border-dashed p-5 cursor-default h-full min-h-[144px] flex flex-col justify-center items-center text-center">
        <Icon size={24} className="text-white/10 mb-2" />
        <span className="text-white/30 text-xs font-medium">لا توجد بيانات بعد</span>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index + 0.2, type: 'spring', stiffness: 50, damping: 15 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-[24px] bg-white/[0.02] border border-white/[0.05] p-5 cursor-default transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
    >
      {/* Soft Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Top Row: Icon & Trend */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-[12px] flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-inner ring-1 ring-white/10",
            stat.bg
          )}>
            <Icon size={18} strokeWidth={2} className={stat.color} />
          </div>
          {stat.realtime && <RealtimeBadge />}
        </div>
        
        <TrendBadge trend={stat.trend} trendUp={stat.trendUp} />
      </div>

      {/* Middle Row: Value & Label */}
      <div className="relative z-10 flex flex-col gap-1 mt-6">
        <h3 className="text-white/50 text-xs font-semibold tracking-wide">{stat.label}</h3>
        <div className="flex items-end justify-between mt-1">
          <AnimatedCounter value={stat.value} suffix={stat.suffix} />
          <SparklinePlaceholder data={stat.sparkline} colorClass={stat.color} />
        </div>
      </div>
    </motion.div>
  );
}

export function LiveStats() {
  return (
    <section className="">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-lg font-bold text-white tracking-wide">النبض المباشر</h2>
        <div className="flex items-center gap-2 text-white/40 text-xs font-medium">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>تحديث مباشر</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
        {statsData.map((stat, i) => (
          <StatCard key={stat.id} stat={stat} index={i} />
        ))}
      </div>
    </section>
  );
}

