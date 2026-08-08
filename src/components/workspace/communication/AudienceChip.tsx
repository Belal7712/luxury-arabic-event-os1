import React from 'react';
import { X } from 'lucide-react';

export interface AudienceChipProps {
  label: string;
  icon?: React.ReactNode;
  count?: number;
  isActive: boolean;
  onClick: () => void;
  onRemove?: () => void;
  variant?: 'preset' | 'filter' | 'badge';
  disabled?: boolean;
  ariaLabel?: string;
}

export const AudienceChip: React.FC<AudienceChipProps> = ({
  label,
  icon,
  count,
  isActive,
  onClick,
  onRemove,
  variant = 'preset',
  disabled = false,
  ariaLabel,
}) => {
  return (
    <div className="inline-flex items-center group shrink-0">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel || label}
        aria-pressed={isActive}
        className={`relative inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs md:text-sm font-medium transition-all duration-200 select-none min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#E5A93C]/50 ${
          disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
        } ${
          isActive
            ? 'bg-gradient-to-r from-[#E5A93C]/20 to-[#C28A26]/10 text-white border border-[#E5A93C]/50 shadow-md shadow-[#E5A93C]/10'
            : variant === 'badge'
            ? 'bg-white/[0.03] text-zinc-300 border border-white/10 hover:bg-white/[0.08] hover:text-white'
            : 'bg-white/[0.02] text-zinc-400 border border-white/5 hover:bg-white/[0.06] hover:text-zinc-200 hover:border-white/10'
        }`}
      >
        {icon && <span className="shrink-0 text-current">{icon}</span>}
        <span className="truncate">{label}</span>

        {typeof count === 'number' && (
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide transition-colors ${
              isActive
                ? 'bg-[#E5A93C] text-black shadow-sm'
                : 'bg-white/10 text-zinc-300 group-hover:bg-white/20'
            }`}
          >
            {count}
          </span>
        )}

        {onRemove && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                onRemove();
              }
            }}
            aria-label={`إزالة ${label}`}
            className="inline-flex items-center justify-center w-4 h-4 mr-1 rounded-full bg-white/10 hover:bg-rose-500/30 text-zinc-400 hover:text-rose-300 transition-colors focus:outline-none"
          >
            <X className="w-3 h-3" />
          </span>
        )}
      </button>
    </div>
  );
};
