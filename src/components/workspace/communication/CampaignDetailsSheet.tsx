import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Users, FileText, AlertTriangle } from 'lucide-react';
import { Campaign, FailedRecipient } from './types';
import { DeliveryIntelligence } from './DeliveryIntelligence';
import { FailedMessagesSheet } from './FailedMessagesSheet';
import { INTENT_OPTIONS } from './MessageIntentSelector';

interface CampaignDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
  failedRecipients: FailedRecipient[];
  onRetry: (campaign: Campaign, recipientIds: string[]) => void;
}

export const CampaignDetailsSheet: React.FC<CampaignDetailsSheetProps> = ({
  isOpen,
  onClose,
  campaign,
  failedRecipients,
  onRetry
}) => {
  const [showFailedSheet, setShowFailedSheet] = useState(false);

  if (!isOpen || !campaign) return null;

  const intentLabel = INTENT_OPTIONS.find(i => i.id === campaign.intent)?.title || campaign.intent;

  return (
    <>
      <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4" dir="rtl">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full sm:max-w-2xl h-[90vh] sm:h-[800px] bg-[#18181B] sm:rounded-2xl rounded-t-3xl border-t sm:border border-white/10 shadow-2xl overflow-hidden mt-auto sm:mt-0 flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#121215] shrink-0">
            <div>
              <h3 className="text-base font-bold text-white">{campaign.title}</h3>
              <p className="text-xs text-zinc-400 mt-0.5">تفاصيل الحملة وإحصائيات التسليم</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            {/* Stats Overview */}
            <DeliveryIntelligence campaign={campaign} />

            {/* Failed Messages Banner */}
            {failedRecipients.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-rose-400">رسائل فاشلة</h4>
                    <p className="text-xs text-rose-400/80">تعذر تسليم {failedRecipients.length} رسالة</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFailedSheet(true)}
                  className="px-4 py-2 rounded-lg bg-rose-500 text-white text-xs font-medium hover:bg-rose-600 transition-colors"
                >
                  عرض التفاصيل والمحاولة
                </button>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-[#E5A93C] mb-4">
                  <FileText className="w-4 h-4" />
                  <h4 className="text-sm font-semibold">تفاصيل الرسالة</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">النوع</span>
                    <span className="text-white">{intentLabel}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">المرفقات</span>
                    <span className="text-white">
                       {[
                         campaign.message.attachments?.includeCard && 'بطاقة',
                         campaign.message.attachments?.includeLocation && 'موقع',
                         campaign.message.attachments?.includeQr && 'QR'
                       ].filter(Boolean).join('، ') || 'لا يوجد'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-blue-400 mb-4">
                  <Users className="w-4 h-4" />
                  <h4 className="text-sm font-semibold">الجمهور المستهدف</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">الفئة</span>
                    <span className="text-white">{campaign.audience.preset}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">إجمالي المستلمين</span>
                    <span className="text-white">{campaign.stats.total} ضيف</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Preview */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <h4 className="text-sm font-semibold text-white mb-3">محتوى الرسالة</h4>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-sm text-zinc-300 whitespace-pre-wrap font-sans">
                {campaign.message.content}
              </div>
            </div>

            {/* Timeline */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <h4 className="text-sm font-semibold text-white mb-3">التسلسل الزمني</h4>
              <div className="space-y-3 relative before:absolute before:inset-y-0 before:right-2 before:w-px before:bg-white/10">
                <div className="flex gap-4 relative">
                  <div className="w-4 h-4 rounded-full bg-[#E5A93C] border-4 border-[#18181B] relative z-10 shrink-0" />
                  <div>
                    <h5 className="text-xs font-medium text-white">إنشاء الحملة</h5>
                    <p className="text-[10px] text-zinc-500">{new Date(campaign.createdAt).toLocaleString('ar-SA')}</p>
                  </div>
                </div>
                {campaign.scheduledAt && (
                  <div className="flex gap-4 relative">
                    <div className="w-4 h-4 rounded-full bg-blue-400 border-4 border-[#18181B] relative z-10 shrink-0" />
                    <div>
                      <h5 className="text-xs font-medium text-white">وقت الجدولة</h5>
                      <p className="text-[10px] text-zinc-500">{new Date(campaign.scheduledAt).toLocaleString('ar-SA')}</p>
                    </div>
                  </div>
                )}
                {campaign.sentAt && (
                  <div className="flex gap-4 relative">
                    <div className="w-4 h-4 rounded-full bg-emerald-400 border-4 border-[#18181B] relative z-10 shrink-0" />
                    <div>
                      <h5 className="text-xs font-medium text-white">بدء الإرسال</h5>
                      <p className="text-[10px] text-zinc-500">{new Date(campaign.sentAt).toLocaleString('ar-SA')}</p>
                    </div>
                  </div>
                )}
                {['completed', 'partially_failed', 'failed'].includes(campaign.status) && (
                  <div className="flex gap-4 relative">
                    <div className="w-4 h-4 rounded-full bg-white/20 border-4 border-[#18181B] relative z-10 shrink-0" />
                    <div>
                      <h5 className="text-xs font-medium text-white">انتهاء المعالجة</h5>
                      <p className="text-[10px] text-zinc-500">{new Date(campaign.updatedAt).toLocaleString('ar-SA')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showFailedSheet && (
          <FailedMessagesSheet
            isOpen={showFailedSheet}
            onClose={() => setShowFailedSheet(false)}
            failedRecipients={failedRecipients}
            onRetry={(ids) => {
              onRetry(campaign, ids);
              setShowFailedSheet(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
