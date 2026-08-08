import React from 'react';
import { MapPin, QrCode, Image as ImageIcon } from 'lucide-react';
import { MessageAttachments } from './types';

interface PreviewAttachmentProps {
  attachments: MessageAttachments;
}

export const PreviewAttachment: React.FC<PreviewAttachmentProps> = ({ attachments }) => {
  if (!attachments.includeCard && !attachments.includeLocation && !attachments.includeQr) {
    return null;
  }

  return (
    <div className="space-y-1 mt-1 mb-2">
      {attachments.includeCard && (
        <div className="flex flex-col bg-[#e7e1d5] rounded-[10px] overflow-hidden border border-[#d3cdb6]">
          <div className="aspect-[16/9] bg-[#d6c7a7] flex items-center justify-center text-amber-800">
            <ImageIcon className="w-6 h-6 opacity-60" />
          </div>
          <div className="px-2.5 py-1.5 text-[10px] font-semibold text-zinc-800 bg-[#EFEAE2]" dir="rtl">
            بطاقة الدعوة الرسمية
          </div>
        </div>
      )}

      {attachments.includeQr && (
        <div className="flex items-center gap-2 bg-[#EFEAE2] p-1.5 rounded-[10px] border border-[#d3cdb6]" dir="rtl">
          <div className="w-8 h-8 bg-purple-200 rounded-lg flex items-center justify-center text-purple-600 shrink-0">
            <QrCode className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-zinc-800">رمز الدخول السريع</span>
            <span className="text-[8.5px] text-zinc-500 font-mono">QR Code</span>
          </div>
        </div>
      )}

      {attachments.includeLocation && (
        <div className="flex items-center gap-2 bg-[#EFEAE2] p-1.5 rounded-[10px] border border-[#d3cdb6]" dir="rtl">
          <div className="w-8 h-8 bg-rose-200 rounded-lg flex items-center justify-center text-rose-600 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-zinc-800">موقع القاعة</span>
            <span className="text-[8.5px] text-blue-600 truncate font-mono" dir="ltr">goo.gl/maps/...</span>
          </div>
        </div>
      )}
    </div>
  );
};
