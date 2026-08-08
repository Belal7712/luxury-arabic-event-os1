import { motion } from 'motion/react';

const tabs = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'guests', label: 'إدارة الضيوف' },
  { id: 'analytics', label: 'الإحصائيات' },
  { id: 'settings', label: 'الإعدادات' },
];

interface Props {
  activeTab: string;
  onChange: (id: string) => void;
}

export function WorkspaceTabs({ activeTab, onChange }: Props) {
  return (
    <div className="relative flex items-center gap-2 p-2 rounded-[1.5rem] glass-panel w-full overflow-x-auto no-scrollbar shadow-inner bg-zinc-900/60">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap z-10 ${
              isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-zinc-800 border border-zinc-700 rounded-xl shadow-md -z-10"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
              />
            )}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
