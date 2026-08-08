import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { CommunicationDraft, MessageAttachments, MessageIntent, MessageTemplate } from './types';
import { MessageIntentSelector, INTENT_OPTIONS } from './MessageIntentSelector';
import { MessageComposer } from './MessageComposer';
import { Guest } from '../guests/types';
import { TemplateLibrary } from './TemplateLibrary';
import { SaveTemplateModal } from './SaveTemplateModal';

const LOCAL_STORAGE_TEMPLATES_KEY = 'luxury_event_os_comm_templates';

export interface CampaignBuilderProps {
  draft: CommunicationDraft;
  onUpdateDraft: (updatedDraft: CommunicationDraft) => void;
  audienceCount: number;
  resolvedRecipients?: Guest[];
  onSendNow?: () => void;
  onSchedule?: () => void;
}

export const CampaignBuilder: React.FC<CampaignBuilderProps> = ({
  draft,
  onUpdateDraft,
  audienceCount,
  resolvedRecipients = [],
  onSendNow,
  onSchedule,
}) => {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Handle Intent Change
  const handleSelectIntent = (intent: MessageIntent, newContent?: string) => {
    const updated: CommunicationDraft = {
      ...draft,
      intent,
      content: newContent !== undefined ? newContent : draft.content,
      updatedAt: new Date().toISOString(),
    };
    onUpdateDraft(updated);
  };

  // Handle Content Change
  const handleChangeContent = (content: string) => {
    const updated: CommunicationDraft = {
      ...draft,
      content,
      updatedAt: new Date().toISOString(),
    };
    onUpdateDraft(updated);
  };

  // Handle Attachments Change
  const handleChangeAttachments = (attachments: MessageAttachments) => {
    const updated: CommunicationDraft = {
      ...draft,
      attachments,
      updatedAt: new Date().toISOString(),
    };
    onUpdateDraft(updated);
  };

  // Handle Reset Message Content & Attachments back to Intent default
  const handleResetMessage = () => {
    const matchedOption = INTENT_OPTIONS.find((i) => i.id === draft.intent);
    const defaultTemplate = matchedOption ? matchedOption.defaultTemplate : '';

    const updated: CommunicationDraft = {
      ...draft,
      content: defaultTemplate,
      attachments: {
        includeCard: draft.intent === 'invitation',
        includeLocation: draft.intent === 'location' || draft.intent === 'reminder',
        includeQr: draft.intent === 'qr_code',
      },
      updatedAt: new Date().toISOString(),
    };
    onUpdateDraft(updated);
  };

  // Handle Use Template
  const handleUseTemplate = (template: MessageTemplate) => {
    const updated: CommunicationDraft = {
      ...draft,
      intent: template.intent,
      content: template.content,
      templateId: template.id,
      attachments: template.attachments || draft.attachments,
      updatedAt: new Date().toISOString(),
    };
    onUpdateDraft(updated);
  };

  // Handle Save Template
  const handleSaveTemplate = (templateData: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt' | 'source'>, updateId?: string) => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_TEMPLATES_KEY);
      const userTemplates: MessageTemplate[] = stored ? JSON.parse(stored) : [];
      
      let updatedTemplates = [...userTemplates];
      
      if (updateId) {
        const index = updatedTemplates.findIndex(t => t.id === updateId);
        if (index > -1) {
          updatedTemplates[index] = {
            ...updatedTemplates[index],
            ...templateData,
            updatedAt: new Date().toISOString(),
          };
        }
      } else {
        const newTemplate: MessageTemplate = {
          ...templateData,
          id: `tpl-usr-${Date.now()}`,
          source: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        updatedTemplates.push(newTemplate);
      }
      
      localStorage.setItem(LOCAL_STORAGE_TEMPLATES_KEY, JSON.stringify(updatedTemplates));
      setIsSaveModalOpen(false);
    } catch (e) {
      console.error('Failed to save template', e);
    }
  };

  // Find currently editing template for pre-filling SaveTemplateModal
  const editingTemplate = draft.templateId?.startsWith('tpl-usr-') 
    ? (() => {
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_TEMPLATES_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            return parsed.find((t: MessageTemplate) => t.id === draft.templateId);
          }
        } catch (e) {
          // ignore
        }
        return undefined;
      })()
    : undefined;

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* 1. Message Intent & Template Recommendation */}
      <div className="p-5 rounded-3xl bg-white/[0.015] border border-white/10 space-y-4 shadow-xl">
        <MessageIntentSelector
          selectedIntent={draft.intent}
          currentContent={draft.content}
          onSelectIntent={handleSelectIntent}
        />
      </div>

      {/* 2. Message Composer & Smart Variable Engine */}
      <div className="p-5 rounded-3xl bg-white/[0.015] border border-white/10 space-y-4 shadow-xl">
        <MessageComposer
          intent={draft.intent}
          content={draft.content}
          attachments={draft.attachments}
          audienceCount={audienceCount}
          onChangeContent={handleChangeContent}
          onChangeAttachments={handleChangeAttachments}
          onResetMessage={handleResetMessage}
          onOpenTemplateLibrary={() => setIsLibraryOpen(true)}
          onSaveAsTemplate={() => setIsSaveModalOpen(true)}
        />
      </div>

      {/* 3. Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/5">
        <button
          onClick={onSendNow}
          disabled={audienceCount === 0 || !draft.content.trim()}
          className="w-full sm:flex-1 py-3 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          إرسال الآن
        </button>
        <button
          onClick={onSchedule}
          disabled={audienceCount === 0 || !draft.content.trim()}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-white/10"
        >
          جدولة الإرسال
        </button>
      </div>

      {/* Template Management Modals */}
      <AnimatePresence>
        {isLibraryOpen && (
          <TemplateLibrary
            isOpen={isLibraryOpen}
            onClose={() => setIsLibraryOpen(false)}
            onUseTemplate={handleUseTemplate}
            currentDraftContent={draft.content}
            recipients={resolvedRecipients}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSaveModalOpen && (
          <SaveTemplateModal
            isOpen={isSaveModalOpen}
            onClose={() => setIsSaveModalOpen(false)}
            onSave={handleSaveTemplate}
            initialContent={draft.content}
            initialIntent={draft.intent}
            initialAttachments={draft.attachments}
            editingTemplate={editingTemplate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
