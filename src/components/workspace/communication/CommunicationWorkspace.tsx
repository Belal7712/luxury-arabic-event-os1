import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  History,
  FileText,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  Eye,
} from 'lucide-react';
import {
  AudienceConfig,
  Campaign,
  CommunicationDraft,
  CommunicationInitContext,
  FailedRecipient,
  MessageConfig,
  MessageIntent,
} from './types';
import { mockCampaigns as initialMockCampaigns, mockInitialDraft, mockTemplates } from './mockData';
import { CommunicationHeader } from './CommunicationHeader';
import { AudienceSelector } from './AudienceSelector';
import { CampaignBuilder } from './CampaignBuilder';
import { MessagePreview } from './MessagePreview';
import { Guest } from '../guests/types';
import { SendConfirmationSheet } from './SendConfirmationSheet';
import { ScheduleSheet } from './ScheduleSheet';
import { CampaignHistory } from './CampaignHistory';
import { CampaignDetailsSheet } from './CampaignDetailsSheet';
import { mockEngine } from './MockCommunicationEngine';
import { DeliveryIntelligence } from './DeliveryIntelligence';

const LOCAL_STORAGE_DRAFT_KEY = 'luxury_event_os_comm_draft';
const LOCAL_STORAGE_CAMPAIGNS_KEY = 'luxury_event_os_comm_campaigns';

export interface CommunicationWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
  initContext?: CommunicationInitContext;
}

export type CommTab = 'compose' | 'campaigns' | 'templates';
export type MobileViewTab = 'compose' | 'preview' | 'reports';

export const CommunicationWorkspace: React.FC<CommunicationWorkspaceProps> = ({
  isOpen,
  onClose,
  initContext,
}) => {
  // Active Navigation Tab State
  const [activeTab, setActiveTab] = useState<CommTab>('compose');
  const [mobileView, setMobileView] = useState<MobileViewTab>('compose');

  // Resolved Recipients State from AudienceSelector
  const [resolvedRecipients, setResolvedRecipients] = useState<Guest[]>([]);

  // Local Draft State
  const [draft, setDraft] = useState<CommunicationDraft>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback if localStorage parsing fails
    }
    return mockInitialDraft;
  });

  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [lastSavedTimeStr, setLastSavedTimeStr] = useState<string>('الآن');

  // Campaigns State
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CAMPAIGNS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return initialMockCampaigns;
  });

  // Resume processing on mount
  useEffect(() => {
    campaigns.forEach(c => {
      if ((c.status === 'queued' || c.status === 'sending') && c.recipients) {
        mockEngine.startCampaign(c, c.recipients);
      }
    });
    // We only want to run this once on mount, so no dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveCampaignsLocally = useCallback((updatedCampaigns: Campaign[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CAMPAIGNS_KEY, JSON.stringify(updatedCampaigns));
      setCampaigns(updatedCampaigns);
    } catch (e) {
      console.warn('Failed to persist campaigns to localStorage', e);
    }
  }, []);

  // UI states for modals
  const [isSendSheetOpen, setIsSendSheetOpen] = useState(false);
  const [isScheduleSheetOpen, setIsScheduleSheetOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);

  // Subscribe to engine
  useEffect(() => {
    const unsubscribe = mockEngine.subscribe((campaignId, updatedCampaign, newFailures) => {
      setCampaigns(prev => {
        const next = prev.map(c => c.id === campaignId ? { ...c, ...updatedCampaign } : c);
        localStorage.setItem(LOCAL_STORAGE_CAMPAIGNS_KEY, JSON.stringify(next));
        
        // update selected if it's the one we're viewing
        if (selectedCampaign?.id === campaignId) {
          setSelectedCampaign(updatedCampaign);
        }
        return next;
      });
    });
    return unsubscribe;
  }, [selectedCampaign?.id]);

  const handleSendNow = () => setIsSendSheetOpen(true);
  const handleOpenSchedule = () => setIsScheduleSheetOpen(true);

  const createCampaignObj = (status: 'queued' | 'scheduled', scheduledAt?: string): Campaign => {
    return {
      id: `cmp-${Date.now()}`,
      title: draft.title || `حملة ${new Date().toLocaleDateString('ar-SA')} - ${new Date().toLocaleTimeString('ar-SA')}`,
      intent: draft.intent,
      audience: draft.audience,
      message: {
        intent: draft.intent,
        content: draft.content,
        variables: {},
        attachments: draft.attachments,
        templateId: draft.templateId
      },
      status,
      scheduledAt,
      sentAt: status === 'queued' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: { total: resolvedRecipients.length, queued: 0, sending: 0, sent: 0, delivered: 0, read: 0, failed: 0 },
      recipients: resolvedRecipients,
      failedRecipients: []
    };
  };

  const confirmSendNow = () => {
    const newCampaign = createCampaignObj('queued');
    saveCampaignsLocally([...campaigns, newCampaign]);
    setIsSendSheetOpen(false);
    mockEngine.startCampaign(newCampaign, resolvedRecipients);
    setActiveTab('campaigns');
    setMobileView('reports');
  };

  const confirmSchedule = (dateStr: string) => {
    const newCampaign = createCampaignObj('scheduled', dateStr);
    saveCampaignsLocally([...campaigns, newCampaign]);
    setIsScheduleSheetOpen(false);
    setActiveTab('campaigns');
    setMobileView('reports');
  };

  const handleCancelSchedule = (campaign: Campaign) => {
    if (window.confirm('هل تريد إلغاء جدولة هذه الحملة؟ لن يتم إرسال الرسالة إلى الضيوف.')) {
      const updated = campaigns.map(c => c.id === campaign.id ? { ...c, status: 'cancelled' as const, updatedAt: new Date().toISOString() } : c);
      saveCampaignsLocally(updated);
    }
  };

  const handleDuplicate = (campaign: Campaign) => {
    const newDraft: CommunicationDraft = {
      ...draft,
      title: `${campaign.title} (نسخة)`,
      intent: campaign.intent,
      content: campaign.message.content,
      attachments: campaign.message.attachments,
      templateId: campaign.message.templateId,
      updatedAt: new Date().toISOString()
    };
    saveDraftLocally(newDraft);
    setActiveTab('compose');
    setMobileView('compose');
  };

  const handleReuse = (campaign: Campaign) => {
    const newDraft: CommunicationDraft = {
      ...draft,
      intent: campaign.intent,
      content: campaign.message.content,
      attachments: campaign.message.attachments,
      templateId: campaign.message.templateId,
      updatedAt: new Date().toISOString()
    };
    saveDraftLocally(newDraft);
    setActiveTab('compose');
    setMobileView('compose');
  };

  const handleRetry = (campaign: Campaign, recipientIds: string[]) => {
    if (!campaign.recipients) return;
    
    // Create a new child campaign or just restart the engine for this one?
    // Let's create a child campaign for retry
    const retryRecipients = campaign.recipients.filter(r => recipientIds.includes(r.id));
    const newCampaign: Campaign = {
      ...campaign,
      id: `cmp-retry-${Date.now()}`,
      title: `${campaign.title} (إعادة محاولة)`,
      status: 'queued',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      scheduledAt: undefined,
      stats: { total: retryRecipients.length, queued: 0, sending: 0, sent: 0, delivered: 0, read: 0, failed: 0 },
      recipients: retryRecipients,
      failedRecipients: []
    };
    saveCampaignsLocally([...campaigns, newCampaign]);
    mockEngine.startCampaign(newCampaign, retryRecipients);
  };
  const saveDraftLocally = useCallback((updatedDraft: CommunicationDraft) => {
    setIsSavingDraft(true);
    try {
      localStorage.setItem(
        LOCAL_STORAGE_DRAFT_KEY,
        JSON.stringify(updatedDraft)
      );
      setDraft(updatedDraft);
      setLastSavedTimeStr(
        new Date().toLocaleTimeString('ar-SA', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    } catch (e) {
      console.warn('Failed to persist draft to localStorage', e);
    } finally {
      setTimeout(() => setIsSavingDraft(false), 300);
    }
  }, []);

  const handleAudienceChange = (newAudience: AudienceConfig) => {
    const updated = {
      ...draft,
      audience: newAudience,
      updatedAt: new Date().toISOString(),
    };
    saveDraftLocally(updated);
  };

  // Initialize from context if provided when opening
  useEffect(() => {
    if (isOpen && initContext) {
      setDraft((prev) => {
        const nextAudience: AudienceConfig = {
          ...prev.audience,
          preset: initContext.initialAudiencePreset || prev.audience.preset,
          selectedGuestIds:
            initContext.initialGuestIds || prev.audience.selectedGuestIds,
        };

        const nextIntent: MessageIntent =
          initContext.initialIntent || prev.intent;
        const nextTemplateId =
          initContext.initialTemplateId || prev.templateId;

        const updated = {
          ...prev,
          audience: nextAudience,
          intent: nextIntent,
          templateId: nextTemplateId,
          updatedAt: new Date().toISOString(),
        };
        saveDraftLocally(updated);
        return updated;
      });
    }
  }, [isOpen, initContext, saveDraftLocally]);

  // Keyboard shortcut for ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isOpen, onClose]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8"
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="comm-workspace-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-5xl h-[88vh] max-h-[900px] flex flex-col bg-[#0A0A0C]/95 border border-white/10 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden z-10 text-right"
        >
          {/* Header */}
          <CommunicationHeader
            onClose={onClose}
            draftSavedAt={lastSavedTimeStr}
            isSavingDraft={isSavingDraft}
          />

          {/* Tab Navigation Sub-header */}
          <div className="flex items-center justify-between gap-2 px-5 py-3 border-b border-white/5 bg-white/[0.01] shrink-0 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('compose')}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 min-h-[44px] ${
                  activeTab === 'compose'
                    ? 'text-white bg-white/10 shadow-sm border border-white/10'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                <Send className="w-4 h-4 text-[#E5A93C]" />
                <span>إنشاء حملة رسائل</span>
                {activeTab === 'compose' && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 rounded-xl border border-[#E5A93C]/40 bg-[#E5A93C]/5 pointer-events-none"
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('campaigns')}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 min-h-[44px] ${
                  activeTab === 'campaigns'
                    ? 'text-white bg-white/10 shadow-sm border border-white/10'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                <History className="w-4 h-4 text-emerald-400" />
                <span>سجل الحملات والتسليم</span>
                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {campaigns.length}
                </span>
                {activeTab === 'campaigns' && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 rounded-xl border border-[#E5A93C]/40 bg-[#E5A93C]/5 pointer-events-none"
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('templates')}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 min-h-[44px] ${
                  activeTab === 'templates'
                    ? 'text-white bg-white/10 shadow-sm border border-white/10'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>مكتبة القوالب</span>
                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {mockTemplates.length}
                </span>
                {activeTab === 'templates' && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 rounded-xl border border-[#E5A93C]/40 bg-[#E5A93C]/5 pointer-events-none"
                  />
                )}
              </button>
            </div>

            {/* Current Audience Context Info Pill */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-400 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-xl">
              <Users className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>الجمهور المستهدف الحالي:</span>
              <span className="text-white font-medium">
                {resolvedRecipients.length} ضيفاً
              </span>
            </div>
          </div>

          {/* Main Body Area */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 custom-scrollbar">
            {activeTab === 'compose' && (
              <div className="flex flex-col h-full">
                
                {/* Mobile Segmented Toggle */}
                <div className="flex lg:hidden bg-white/5 p-1 rounded-xl mb-4 shrink-0">
                  <button
                    onClick={() => setMobileView('compose')}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                      mobileView === 'compose'
                        ? 'bg-[#E5A93C] text-black'
                        : 'text-zinc-400'
                    }`}
                  >
                    إنشاء
                  </button>
                  <button
                    onClick={() => setMobileView('preview')}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                      mobileView === 'preview'
                        ? 'bg-[#E5A93C] text-black'
                        : 'text-zinc-400'
                    }`}
                  >
                    معاينة
                  </button>
                  <button
                    onClick={() => setMobileView('reports')}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                      mobileView === 'reports'
                        ? 'bg-[#E5A93C] text-black'
                        : 'text-zinc-400'
                    }`}
                  >
                    تقارير
                  </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                  {/* Left/Top Column: Audience & Composer */}
                  <div className={`flex-1 flex flex-col space-y-6 ${mobileView !== 'compose' ? 'hidden lg:flex' : 'flex'}`}>
                    {/* Information Banner */}
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#E5A93C]/5 border border-[#E5A93C]/20 text-zinc-300 shrink-0">
                      <Info className="w-5 h-5 text-[#E5A93C] shrink-0 mt-0.5" />
                      <div className="text-xs md:text-sm leading-relaxed">
                        <p className="font-semibold text-[#E5A93C] mb-1">
                          محرك إرسال الرسائل والتذكيرات الفوري
                        </p>
                        <p className="text-zinc-300">
                          حدد شريحة الجمهور المستهدفة باستخدام الفلاتر المتقدمة،
                          ثم صمم الرسالة واستخدم المتغيرات الذكية لتخصيص كل رسالة.
                        </p>
                      </div>
                    </div>

                    {/* Audience Engine Section */}
                    <div className="p-5 rounded-3xl bg-white/[0.015] border border-white/10 space-y-4 shadow-xl shrink-0">
                      <AudienceSelector
                        value={draft.audience}
                        onChange={handleAudienceChange}
                        onResolvedRecipientsChange={setResolvedRecipients}
                      />
                    </div>

                    {/* Campaign Builder (Message Intent Selector & Composer with Smart Variables) */}
                    <div className="shrink-0">
                      <CampaignBuilder
                        draft={draft}
                        onUpdateDraft={saveDraftLocally}
                        audienceCount={resolvedRecipients.length}
                        resolvedRecipients={resolvedRecipients}
                        onSendNow={handleSendNow}
                        onSchedule={handleOpenSchedule}
                      />
                    </div>
                  </div>

                  {/* Right Column: Preview Simulator */}
                  <div className={`w-full lg:w-[380px] xl:w-[420px] shrink-0 flex flex-col ${mobileView === 'compose' ? 'hidden lg:flex' : mobileView === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
                    {mobileView !== 'reports' && (
                      <div className="p-5 rounded-3xl bg-white/[0.015] border border-white/10 shadow-xl flex flex-col sticky top-0">
                        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2 shrink-0">
                          <Eye className="w-4 h-4 text-[#E5A93C]" />
                          <span>المعاينة الحية</span>
                        </h3>
                        <div className="flex-1 min-h-0">
                          <MessagePreview
                            content={draft.content}
                            attachments={draft.attachments}
                            recipients={resolvedRecipients}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reports placeholder (mobile only for now) */}
                  {mobileView === 'reports' && (
                     <div className="flex-1 lg:hidden">
                       <CampaignHistory
                         campaigns={campaigns}
                         onViewDetails={(c) => {
                           setSelectedCampaign(c);
                           setIsDetailsSheetOpen(true);
                         }}
                         onReuse={handleReuse}
                         onDuplicate={handleDuplicate}
                         onCancelSchedule={handleCancelSchedule}
                       />
                     </div>
                  )}

                </div>
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <h3 className="text-sm font-semibold text-white">
                    سجل الحملات السابقة والإحصائيات
                  </h3>
                  <span className="text-xs text-zinc-400">
                    إجمالي الحملات: {campaigns.length}
                  </span>
                </div>

                <CampaignHistory
                  campaigns={campaigns}
                  onViewDetails={(c) => {
                    setSelectedCampaign(c);
                    setIsDetailsSheetOpen(true);
                  }}
                  onReuse={handleReuse}
                  onDuplicate={handleDuplicate}
                  onCancelSchedule={handleCancelSchedule}
                />
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <h3 className="text-sm font-semibold text-white">
                    قوالب الرسائل الجاهزة
                  </h3>
                  <span className="text-xs text-zinc-400">
                    عدد القوالب: {mockTemplates.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockTemplates.map((tpl) => (
                    <div
                      key={tpl.id}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#E5A93C]/30 transition-all group space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-white group-hover:text-[#E5A93C] transition-colors">
                          {tpl.title}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-300">
                          {tpl.intent}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2">
                        {tpl.description}
                      </p>
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-300 whitespace-pre-wrap font-sans">
                        {tpl.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isSendSheetOpen && (
          <SendConfirmationSheet
            isOpen={isSendSheetOpen}
            onClose={() => setIsSendSheetOpen(false)}
            onConfirm={confirmSendNow}
            draft={draft}
            audienceCount={resolvedRecipients.length}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isScheduleSheetOpen && (
          <ScheduleSheet
            isOpen={isScheduleSheetOpen}
            onClose={() => setIsScheduleSheetOpen(false)}
            onSchedule={confirmSchedule}
            draft={draft}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDetailsSheetOpen && selectedCampaign && (
          <CampaignDetailsSheet
            isOpen={isDetailsSheetOpen}
            onClose={() => setIsDetailsSheetOpen(false)}
            campaign={selectedCampaign}
            failedRecipients={selectedCampaign.failedRecipients || []}
            onRetry={handleRetry}
          />
        )}
      </AnimatePresence>
    </>
  );
};
