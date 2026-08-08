import { Search, SlidersHorizontal } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeFilter: string;
  setActiveFilter: (val: string) => void;
}

const FILTERS = ['الكل', 'مؤكد', 'بانتظار الرد', 'معتذر', 'VIP', 'العائلة', 'الأصدقاء'];

export function GuestSearch({ searchQuery, setSearchQuery, activeFilter, setActiveFilter }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 w-full">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <Search size={18} className="text-white/40 group-focus-within:text-[#E5A93C] transition-colors" />
          </div>
          <input
            type="text"
            placeholder="بحث بالاسم، الرقم، الطاولة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/[0.05] focus:border-[#E5A93C]/50 focus:bg-white/[0.04] rounded-2xl py-3.5 pr-12 pl-4 text-white placeholder-white/30 outline-none transition-all shadow-inner font-medium"
          />
        </div>
        
        <button className="flex items-center justify-center w-12 h-12 shrink-0 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1] transition-colors text-white/70 hover:text-white">
          <SlidersHorizontal size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 snap-start border min-h-[44px]",
                isActive 
                  ? "bg-white/10 text-white border-white/20 shadow-[0_4px_12px_rgba(255,255,255,0.05)]" 
                  : "bg-transparent text-white/50 border-transparent hover:text-white/80 hover:bg-white/5"
              )}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
