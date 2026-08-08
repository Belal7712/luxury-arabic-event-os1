import { useState } from 'react';
import { DashboardShell } from './components/layout/DashboardShell';
import { CommandPalette } from './components/overlays/CommandPalette';
import { NotificationCenter } from './components/overlays/NotificationCenter';
import { WorkspaceHero } from './components/workspace/WorkspaceHero';
import { QuickActions } from './components/workspace/QuickActions';
import { LiveStats } from './components/workspace/LiveStats';
import { GuestWorkspace } from './components/workspace/guests/GuestWorkspace';

export default function App() {
  const [isCmdOpen, setCmdOpen] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);

  return (
    <DashboardShell onOpenCmd={() => setCmdOpen(true)} onOpenNotif={() => setNotifOpen(true)}>
      <div className="flex flex-col gap-10 md:gap-14 lg:gap-16">
        <WorkspaceHero />
        <QuickActions />
        <LiveStats />
        <div className="w-full h-px bg-white/5 my-4" />
        <GuestWorkspace />
      </div>
      <CommandPalette isOpen={isCmdOpen} onClose={() => setCmdOpen(false)} />
      <NotificationCenter isOpen={isNotifOpen} onClose={() => setNotifOpen(false)} />
    </DashboardShell>
  );
}
