import React, { useState, useMemo } from 'react';
import { MessageAttachments } from './types';
import { Guest } from '../guests/types';
import { DeviceSimulator } from './DeviceSimulator';
import { PreviewAttachment } from './PreviewAttachment';
import { PreviewGuestSelector } from './PreviewGuestSelector';
import { resolveTemplateText } from './VariablePicker';
import { CheckCheck } from 'lucide-react';

interface MessagePreviewProps {
  content: string;
  attachments?: MessageAttachments;
  recipients: Guest[];
}

export const MessagePreview: React.FC<MessagePreviewProps> = ({
  content,
  attachments,
  recipients,
}) => {
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);

  const previewGuest = useMemo(() => {
    if (selectedGuestId) {
      const found = recipients.find((r) => r.id === selectedGuestId);
      if (found) return found;
    }
    return recipients.length > 0 ? recipients[0] : undefined;
  }, [selectedGuestId, recipients]);

  const resolvedContent = useMemo(() => {
    return resolveTemplateText(content, previewGuest);
  }, [content, previewGuest]);

  return (
    <div className="flex flex-col h-full space-y-4" dir="rtl">
      {/* Guest Selector Header */}
      <div className="shrink-0">
        <PreviewGuestSelector
          recipients={recipients}
          selectedGuestId={previewGuest?.id || null}
          onSelect={setSelectedGuestId}
        />
      </div>

      {/* Simulator Area */}
      <div className="flex-1 flex items-center justify-center min-h-[400px] overflow-hidden py-2">
        <DeviceSimulator>
          <div className="flex flex-col justify-end min-h-full">
            {content.trim() || (attachments && (attachments.includeCard || attachments.includeLocation || attachments.includeQr)) ? (
               <div className="bg-white rounded-[14px] rounded-tr-sm p-1.5 max-w-[85%] self-start shadow-sm relative text-right border border-black/5" dir="rtl">
                <PreviewAttachment attachments={attachments || {}} />
                
                {content.trim() && (
                  <div className="text-[12.5px] leading-relaxed text-[#111B21] whitespace-pre-wrap break-words px-1.5 pb-3">
                    {resolvedContent}
                  </div>
                )}
                
                <div className="flex items-center justify-end gap-1 px-1.5 absolute bottom-1 right-1.5" dir="ltr">
                  <span className="text-[9px] text-zinc-500 font-medium">12:45</span>
                  <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                </div>
              </div>
            ) : (
              <div className="bg-[#EFEAE2]/80 backdrop-blur-sm rounded-xl p-3 text-center self-center shadow-sm max-w-[80%] my-auto border border-[#d3cdb6]">
                <p className="text-[11px] text-zinc-600 font-medium leading-relaxed">
                  اكتب رسالتك لتظهر المعاينة هنا
                </p>
              </div>
            )}
          </div>
        </DeviceSimulator>
      </div>
    </div>
  );
};
