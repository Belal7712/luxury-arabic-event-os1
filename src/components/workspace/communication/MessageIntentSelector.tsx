import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Clock,
  CheckCircle2,
  MapPin,
  QrCode,
  Heart,
  Edit3,
  AlertTriangle,
} from 'lucide-react';
import { MessageIntent } from './types';

export interface IntentOption {
  id: MessageIntent;
  title: string;
  description: string;
  icon: React.ReactNode;
  defaultTemplate: string;
}

export const INTENT_OPTIONS: IntentOption[] = [
  {
    id: 'invitation',
    title: 'دعوة',
    description: 'دعوة رسمية لحضور المناسبة مع بطاقة الدعوة',
    icon: <Send className="w-4 h-4 text-[#E5A93C]" />,
    defaultTemplate:
      'نرحب بكم أجمل ترحيب في حفل زفافنا الميمون.\nيسرنا حضوركم ومشاركتنا فرحتنا اليوم.\n\nالضيف العزيز: {{guest_name}}\nبطاقة الدعوة الخاصة بكم:\n{{invitation_link}}',
  },
  {
    id: 'reminder',
    title: 'تذكير',
    description: 'تذكير بموعد المناسبة وموقع القاعة للضيوف',
    icon: <Clock className="w-4 h-4 text-amber-400" />,
    defaultTemplate:
      'مرحباً {{guest_name}}،\nنذكّركم بموعد حفل الزفاف غداً في تمام الساعة {{event_time}}.\nالموقع: {{venue}}\n\nنتطلع لرؤيتكم واكتملت فرحتنا بحضوركم.',
  },
  {
    id: 'rsvp_confirmation',
    title: 'تأكيد حضور',
    description: 'طلب تأكيد الحضور وعدد المرافقين قبل الحفل',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    defaultTemplate:
      'مرحباً {{guest_name}}،\nعزيزنا الضيف، يسعدنا تواصلكم وتأكيد حضوركم لحفل الزفاف لتسهيل ترتيبات المقاعد.\n\nيرجى تأكيد الحضور عبر الرابط المباشر.',
  },
  {
    id: 'location',
    title: 'موقع المناسبة',
    description: 'توجيهات الوصول للخريطة والباركينج المخصص',
    icon: <MapPin className="w-4 h-4 text-rose-400" />,
    defaultTemplate:
      'مرحباً {{guest_name}}،\nيسعدنا مشاركتكم موقع حفل الزفاف:\n{{venue}}\n\nرابط الوصول المباشر عبر الخريطة:\nhttps://maps.google.com/?q=RiyadhPalace',
  },
  {
    id: 'qr_code',
    title: 'رمز QR',
    description: 'رمز الدخول السريع ورقم الطاولة للضيوف',
    icon: <QrCode className="w-4 h-4 text-[#E5A93C]" />,
    defaultTemplate:
      'مرحباً {{guest_name}}،\nهذا رمز الدخول السريع الخاص بكم لقاعة الزفاف.\nرقم الطاولة: {{table_number}}\n\nرابط رمز QR:\n{{qr_link}}',
  },
  {
    id: 'thank_you',
    title: 'شكر',
    description: 'رسالة شكر وتقدير للضيوف بعد ختام الحفل',
    icon: <Heart className="w-4 h-4 text-pink-400" />,
    defaultTemplate:
      'أنار حضوركم حفلنا وزادنا شرفاً وفرحاً.\nشكراً لك {{guest_name}} على مشاركتنا أجمل لحظات العمر.\nدامت دياركم بالمسرات.',
  },
  {
    id: 'custom',
    title: 'رسالة مخصصة',
    description: 'كتابة نص مخصص بحرية تامة',
    icon: <Edit3 className="w-4 h-4 text-cyan-400" />,
    defaultTemplate: '',
  },
];

export interface MessageIntentSelectorProps {
  selectedIntent: MessageIntent;
  currentContent: string;
  onSelectIntent: (intent: MessageIntent, newContent?: string) => void;
}

export const MessageIntentSelector: React.FC<MessageIntentSelectorProps> = ({
  selectedIntent,
  currentContent,
  onSelectIntent,
}) => {
  const [pendingIntent, setPendingIntent] = useState<IntentOption | null>(
    null
  );

  const handleIntentClick = (option: IntentOption) => {
    if (option.id === selectedIntent) return;

    // Check if there is existing text written that would be overwritten
    const isCustomTextWritten =
      currentContent.trim().length > 0 &&
      currentContent !== option.defaultTemplate;

    if (isCustomTextWritten && option.id !== 'custom') {
      // Trigger confirmation dialog
      setPendingIntent(option);
    } else {
      // Directly apply new intent and template
      onSelectIntent(
        option.id,
        option.id === 'custom' ? currentContent : option.defaultTemplate
      );
    }
  };

  const handleConfirmTemplate = () => {
    if (pendingIntent) {
      onSelectIntent(pendingIntent.id, pendingIntent.defaultTemplate);
      setPendingIntent(null);
    }
  };

  const handleCancelTemplate = () => {
    if (pendingIntent) {
      // Just change intent label without destroying written content
      onSelectIntent(pendingIntent.id, currentContent);
      setPendingIntent(null);
    }
  };

  return (
    <div className="space-y-3 text-right" dir="rtl">
      <label className="block text-xs font-semibold text-zinc-300">
        اختر هدف الرسالة (القالب الموصى به):
      </label>

      {/* Horizontal Scroll / Compact Grid of Intent Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {INTENT_OPTIONS.map((opt) => {
          const isSelected = selectedIntent === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleIntentClick(opt)}
              aria-pressed={isSelected}
              aria-label={`هدف الرسالة: ${opt.title}`}
              className={`relative flex flex-col items-start p-3 rounded-2xl border text-right transition-all duration-200 min-h-[72px] focus:outline-none focus:ring-2 focus:ring-[#E5A93C]/50 ${
                isSelected
                  ? 'bg-gradient-to-b from-[#E5A93C]/15 to-[#E5A93C]/5 border-[#E5A93C]/60 text-white shadow-md shadow-[#E5A93C]/10'
                  : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200 hover:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="p-1 rounded-lg bg-white/5">{opt.icon}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[#E5A93C] shadow-sm shadow-[#E5A93C]" />
                )}
              </div>
              <span className="text-xs font-bold text-white">{opt.title}</span>
              <span className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">
                {opt.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Confirmation Modal when switching intent with written content */}
      <AnimatePresence>
        {pendingIntent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-3"
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <p className="font-semibold text-amber-300">
                  تغيير هدف الرسالة والقالب
                </p>
                <p className="text-zinc-300 mt-0.5">
                  لديك نص رسالة مكتوب بالفعل. هل تريد استبداله بالنص الافتراضي لـ
                  &quot;{pendingIntent.title}&quot;؟
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={handleCancelTemplate}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 hover:bg-white/10"
              >
                الاحتفاظ بالنص الحالي
              </button>
              <button
                type="button"
                onClick={handleConfirmTemplate}
                className="px-3 py-1.5 rounded-xl bg-[#E5A93C] text-black text-xs font-semibold hover:bg-[#c28a26] shadow-sm"
              >
                استخدام القالب الجديد
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
