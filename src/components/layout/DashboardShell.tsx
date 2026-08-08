import { ReactNode } from 'react';
import { Search, Bell, Command, Sparkles, Grid, ChevronDown } from 'lucide-react';

interface Props {
  children: ReactNode;
  onOpenCmd: () => void;
  onOpenNotif: () => void;
}

export function DashboardShell({ children, onOpenCmd, onOpenNotif }: Props) {
  return (
    <div className="relative h-screen w-screen bg-[#000000] overflow-hidden text-zinc-50 font-sans selection:bg-[#E5A93C]/30">
      {/* OS-Level Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
        <div className="absolute top-[-10%] w-[80%] h-[40%] bg-[#E5A93C]/10 rounded-[100%] blur-[120px] mix-blend-screen opacity-50" />
        <div className="absolute top-[20%] left-[-10%] w-[30%] h-[40%] bg-zinc-600/10 rounded-full blur-[100px] mix-blend-screen opacity-50" />
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* Floating OS Status Bar */}
      <header className="absolute top-6 left-0 right-0 z-50 px-6 lg:px-12 flex justify-between items-start pointer-events-none">
        {/* Right side (RTL Start) - Context Switcher */}
        <div className="pointer-events-auto flex items-center gap-3 bg-[#0a0a0c]/70 backdrop-blur-3xl border border-white/5 p-1.5 pl-4 rounded-full shadow-2xl ring-1 ring-black/50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E5A93C] to-[#9C701C] flex items-center justify-center shadow-inner ring-1 ring-white/20">
            <Sparkles size={16} className="text-black/80" />
          </div>
          <div className="flex flex-col justify-center ml-2">
            <div className="flex items-center gap-1.5 cursor-pointer group">
              <span className="text-sm font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">زفاف محمد وسارة</span>
              <ChevronDown size={14} className="text-white/40 group-hover:text-white/70 transition-colors" />
            </div>
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mt-0.5">مساحة العمل الحالية</span>
          </div>
        </div>

        {/* Left side (RTL End) - Global Tools */}
        <div className="pointer-events-auto flex items-center gap-1 bg-[#0a0a0c]/70 backdrop-blur-3xl border border-white/5 p-1.5 rounded-full shadow-2xl ring-1 ring-black/50">
          <button 
            onClick={onOpenCmd}
            className="flex items-center gap-3 px-4 py-2.5 rounded-full hover:bg-white/5 transition-colors group"
          >
            <Search size={16} className="text-white/40 group-hover:text-white/90 transition-colors" />
            <span className="text-sm text-white/40 font-medium group-hover:text-white/90 transition-colors">بحث سريع</span>
            <div className="flex items-center gap-1 opacity-40 bg-black px-1.5 py-0.5 rounded text-[10px] font-sans border border-white/10 ml-2">
              <Command size={10} />
              <span>K</span>
            </div>
          </button>

          <div className="w-[1px] h-4 bg-white/10 mx-1" />

          <button 
            onClick={onOpenNotif}
            className="relative p-3 rounded-full hover:bg-white/5 transition-colors group"
          >
            <Bell size={18} className="text-white/40 group-hover:text-white/90 transition-colors" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#E5A93C] border-2 border-[#0a0a0c]" />
          </button>
          
          <button className="p-3 rounded-full hover:bg-white/5 transition-colors group">
            <Grid size={18} className="text-white/40 group-hover:text-white/90 transition-colors" />
          </button>
        </div>
      </header>

      {/* Main Workspace Canvas */}
      <main className="relative z-10 w-full h-full pt-32 pb-12 px-6 lg:px-12 overflow-y-auto scroll-smooth">
        <div className="max-w-[1400px] mx-auto min-h-full flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
