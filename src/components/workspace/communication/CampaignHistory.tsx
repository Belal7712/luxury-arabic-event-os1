import React from 'react';
import { Campaign, FailedRecipient } from './types';
import { CampaignCard } from './CampaignCard';
import { Calendar } from 'lucide-react';

interface CampaignHistoryProps {
  campaigns: Campaign[];
  onViewDetails: (campaign: Campaign) => void;
  onReuse: (campaign: Campaign) => void;
  onDuplicate: (campaign: Campaign) => void;
  onCancelSchedule?: (campaign: Campaign) => void;
}

export const CampaignHistory: React.FC<CampaignHistoryProps> = ({
  campaigns,
  onViewDetails,
  onReuse,
  onDuplicate,
  onCancelSchedule
}) => {
  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-white/5 border-dashed rounded-3xl bg-white/[0.01]">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-zinc-500" />
        </div>
        <h3 className="text-sm font-bold text-white mb-2">لا توجد حملات بعد</h3>
        <p className="text-xs text-zinc-400 max-w-sm">
          ابدأ بإنشاء أول حملة إرسال لضيوفك وسيظهر سجل الإرسال والإحصائيات هنا.
        </p>
      </div>
    );
  }

  // Sort campaigns by createdAt descending
  const sortedCampaigns = [...campaigns].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-4">
      {sortedCampaigns.map(campaign => (
        <CampaignCard 
          key={campaign.id} 
          campaign={campaign} 
          onViewDetails={() => onViewDetails(campaign)}
          onReuse={() => onReuse(campaign)}
          onDuplicate={() => onDuplicate(campaign)}
          onCancelSchedule={onCancelSchedule ? () => onCancelSchedule(campaign) : undefined}
        />
      ))}
    </div>
  );
};
