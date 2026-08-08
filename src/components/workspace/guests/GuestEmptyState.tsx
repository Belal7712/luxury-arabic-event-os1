import { UserPlus } from 'lucide-react';
import { motion } from 'motion/react';

export function GuestEmptyState() {
  return (
    <div className="w-full py-20 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 ring-1 ring-white/10">
        <UserPlus size={24} className="text-white/40" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">لا يوجد ضيوف بعد</h3>
      <p className="text-sm font-medium text-white/40 max-w-sm mb-6">
        قم بإضافة أول ضيف للبدء في إدارة الدعوات والمرافقين وتوزيع الطاولات.
      </p>
      
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/15 border border-white/10 font-bold transition-all"
      >
        <UserPlus size={16} strokeWidth={2.5} />
        <span>إضافة ضيف جديد</span>
      </motion.button>
    </div>
  );
}
