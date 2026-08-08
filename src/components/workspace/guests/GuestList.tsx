import { Guest } from './types';
import { GuestCard } from './GuestCard';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  guests: Guest[];
  onSelectGuest: (guest: Guest) => void;
  isSelectionMode?: boolean;
  selectedGuestIds?: Set<string>;
  onLongPress?: (id: string) => void;
  onUpdateGuest?: (id: string, updates: Partial<Guest>) => void;
  onDeleteGuest?: (id: string) => void;
}

export function GuestList({ 
  guests, 
  onSelectGuest, 
  isSelectionMode, 
  selectedGuestIds,
  onLongPress,
  onUpdateGuest,
  onDeleteGuest
}: Props) {
  if (guests.length === 0) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center text-center">
        <span className="text-white/40 text-sm font-medium">لا توجد نتائج مطابقة</span>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-[calc(6rem+env(safe-area-inset-bottom,0px))]">
      <AnimatePresence mode="popLayout">
        {guests.map((guest, index) => (
          <motion.div
            key={guest.id}
            layout
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.2) }}
          >
            <GuestCard 
              guest={guest} 
              onClick={() => onSelectGuest(guest)}
              isSelected={selectedGuestIds?.has(guest.id)}
              isSelectionMode={isSelectionMode}
              onLongPress={() => onLongPress?.(guest.id)}
              onUpdate={(updates) => onUpdateGuest?.(guest.id, updates)}
              onDelete={() => onDeleteGuest?.(guest.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
