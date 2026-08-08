import React, { useState } from 'react';
import { ChevronDown, Search, User } from 'lucide-react';
import { Guest } from '../guests/types';
import { motion, AnimatePresence } from 'motion/react';

interface PreviewGuestSelectorProps {
  recipients: Guest[];
  selectedGuestId: string | null;
  onSelect: (guestId: string) => void;
}

export const PreviewGuestSelector: React.FC<PreviewGuestSelectorProps> = ({
  recipients,
  selectedGuestId,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedGuest = recipients.find((r) => r.id === selectedGuestId) || recipients[0];

  const filtered = recipients.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  if (recipients.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-zinc-500" dir="rtl">
        <User className="w-3.5 h-3.5" />
        <span>لا يوجد ضيوف للمعاينة</span>
      </div>
    );
  }

  return (
    <div className="relative" dir="rtl">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#E5A93C]/40"
      >
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-[#E5A93C]" />
          <span className="text-zinc-400">معاينة باسم:</span>
          <span className="text-white font-medium line-clamp-1">{selectedGuest?.name}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full right-0 mt-2 w-64 z-50 bg-[#121215] border border-white/10 rounded-2xl p-2 shadow-2xl"
            >
              <div className="relative mb-2">
                <Search className="absolute right-2.5 top-2 w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث عن ضيف..."
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-xs text-white focus:outline-none focus:border-[#E5A93C]/50"
                  autoFocus
                />
              </div>
              <div className="max-h-48 overflow-y-auto custom-scrollbar">
                {filtered.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      onSelect(r.id);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full text-right px-2.5 py-2 rounded-lg text-xs transition-colors ${
                      selectedGuest?.id === r.id
                        ? 'bg-[#E5A93C]/20 text-[#E5A93C]'
                        : 'text-zinc-300 hover:bg-white/5'
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="px-2.5 py-4 text-xs text-zinc-500 text-center">لا توجد نتائج</div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
