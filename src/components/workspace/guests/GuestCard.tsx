import { Guest, RsvpStatus } from './types';
import { Phone, Users, MapPin, MoreHorizontal, MessageCircle, Star, CheckCircle, XCircle, Clock, CheckSquare } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, useAnimation, PanInfo } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  guest: Guest;
  onClick: () => void;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  onLongPress?: () => void;
  onUpdate?: (updates: Partial<Guest>) => void;
  onDelete?: () => void;
}

export function GuestCard({ 
  guest, 
  onClick, 
  isSelected, 
  isSelectionMode, 
  onLongPress,
  onUpdate,
  onDelete
}: Props) {
  const isConfirmed = guest.status === 'confirmed';
  const isPending = guest.status === 'pending';
  const isDeclined = guest.status === 'declined';
  const isMaybe = guest.status === 'maybe';
  const isCheckedIn = guest.status === 'checked_in';

  // Swipe logic
  const controls = useAnimation();
  const [swipeState, setSwipeState] = useState<'none' | 'left' | 'right'>('none');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const handlePointerDown = (e: import("react").PointerEvent) => {
    // Only trigger long press if not in selection mode and primary click
    if (!isSelectionMode && e.button === 0) {
      timerRef.current = setTimeout(() => {
        onLongPress?.();
      }, 500); // 500ms long press
    }
  };

  const handlePointerUp = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleDrag = (e: any, info: PanInfo) => {
    if (isSelectionMode) return;
    if (info.offset.x > 50) setSwipeState('right'); // Swipe right (Confirm)
    else if (info.offset.x < -50) setSwipeState('left'); // Swipe left (WhatsApp/Edit)
    else setSwipeState('none');
  };

  const handleDragEnd = (e: any, info: PanInfo) => {
    if (isSelectionMode) {
      controls.start({ x: 0 });
      return;
    }
    
    // Velocity or high offset threshold
    if (info.offset.x > 100 || info.velocity.x > 500) {
      // Trigger Confirm
      onUpdate?.({ status: 'confirmed' });
      controls.start({ x: 0 });
    } else if (info.offset.x < -100 || info.velocity.x < -500) {
      // Trigger WhatsApp (mock) or Edit
      // For now we just reset
      controls.start({ x: 0 });
    } else {
      controls.start({ x: 0 });
    }
    setSwipeState('none');
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl touch-pan-y"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Swipe Backgrounds */}
      {!isSelectionMode && (
        <div className="absolute inset-0 z-0 flex justify-between items-center px-6" aria-hidden="true">
          <div className={cn(
            "flex items-center gap-2 font-bold transition-opacity duration-300",
            swipeState === 'right' ? "opacity-100 text-emerald-400" : "opacity-0"
          )}>
            <CheckCircle size={20} />
            تأكيد الحضور
          </div>
          <div className={cn(
            "flex items-center gap-2 font-bold transition-opacity duration-300",
            swipeState === 'left' ? "opacity-100 text-[#E5A93C]" : "opacity-0"
          )}>
            واتساب
            <MessageCircle size={20} />
          </div>
        </div>
      )}

      {/* Main Card */}
      <motion.div 
        drag={isSelectionMode ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={controls}
        onClick={(e) => {
          onClick();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        tabIndex={0}
        role="button"
        aria-pressed={isSelected}
        aria-label={`تفاصيل الضيف ${guest.name}`}
        className={cn(
          "relative z-10 w-full rounded-3xl bg-[#0a0a0c] border p-5 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)] cursor-pointer group focus-within:ring-2 focus-within:ring-[#E5A93C] focus-within:border-transparent outline-none",
          isSelected 
            ? "border-[#E5A93C]/50 bg-[#E5A93C]/5" 
            : "border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1]"
        )}
      >
        {isSelectionMode && (
          <div className={cn(
            "absolute top-4 left-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
            isSelected ? "border-[#E5A93C] bg-[#E5A93C] text-black" : "border-white/20"
          )}>
            {isSelected && <CheckSquare size={14} className="ml-[1px]" />}
          </div>
        )}

        {/* Header: Avatar, Name, VIP, Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-lg font-bold text-white shrink-0 overflow-hidden" aria-hidden="true">
              {guest.name.charAt(0)}
              {guest.isVip && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  <Star size={10} className="text-[#E5A93C] fill-[#E5A93C]" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-white tracking-wide truncate max-w-[140px] sm:max-w-[180px]">{guest.name}</h3>
              <span className="text-white/40 text-xs font-medium font-mono tracking-widest mt-0.5" dir="ltr">{guest.phone}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full border shrink-0 backdrop-blur-md",
            isConfirmed && "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
            isPending && "bg-amber-500/10 border-amber-500/20 text-amber-400",
            isDeclined && "bg-rose-500/10 border-rose-500/20 text-rose-400",
            isMaybe && "bg-blue-500/10 border-blue-500/20 text-blue-400",
            isCheckedIn && "bg-purple-500/10 border-purple-500/20 text-purple-400"
          )}>
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              isConfirmed && "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
              isPending && "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse",
              isDeclined && "bg-rose-400",
              isMaybe && "bg-blue-400",
              isCheckedIn && "bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]"
            )} />
            <span className="text-[10px] font-bold tracking-wide">
              {isConfirmed ? 'مؤكد' : isPending ? 'بانتظار' : isDeclined ? 'معتذر' : isMaybe ? 'احتمال' : 'حضر'}
            </span>
          </div>
        </div>

        {/* Details Row */}
        <div className="flex flex-wrap items-center gap-4 mb-5 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-white/40" />
            <span className="text-sm font-medium text-white/80">
              {guest.companions} <span className="text-white/40 text-xs">مرافق</span>
            </span>
          </div>
          
          {guest.table && (
            <>
              <div className="w-[1px] h-3 bg-white/10" />
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-white/40" />
                <span className="text-sm font-medium text-white/80" dir="ltr">
                  {guest.table}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions & Last Interaction */}
        <div className="flex items-center justify-between mt-auto pt-2 min-h-[44px]">
          <span className="text-[10px] font-medium text-white/30 tracking-wide flex items-center gap-1.5">
            <Clock size={12} />
            {guest.lastInteraction ? guest.lastInteraction : 'لم يتفاعل'}
          </span>
          
          {!isSelectionMode && (
            <div className="hidden lg:flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
              <button 
                onClick={(e) => { e.stopPropagation(); /* Mock WhatsApp */ }}
                className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                aria-label="إرسال واتساب"
                tabIndex={0}
              >
                <MessageCircle size={16} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onUpdate?.({ status: 'confirmed' }) }}
                className="w-10 h-10 rounded-full bg-white/5 text-white/60 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="تأكيد الحضور"
                tabIndex={0}
              >
                <CheckCircle size={16} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
