import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  RotateCcw,
  Paperclip,
  Eye,
  Check,
  QrCode,
  MapPin,
  Image as ImageIcon,
  AlertCircle,
  Users,
  Sparkles,
  HelpCircle,
  Library,
  Save,
} from 'lucide-react';
import { MessageAttachments, MessageIntent } from './types';
import { VariablePicker, SMART_VARIABLES, resolveTemplateText } from './VariablePicker';
import { INTENT_OPTIONS } from './MessageIntentSelector';

export interface MessageComposerProps {
  intent: MessageIntent;
  content: string;
  attachments?: MessageAttachments;
  audienceCount: number;
  onChangeContent: (newContent: string) => void;
  onChangeAttachments: (attachments: MessageAttachments) => void;
  onResetMessage: () => void;
  onOpenTemplateLibrary?: () => void;
  onSaveAsTemplate?: () => void;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  intent,
  content,
  attachments = { includeCard: true, includeLocation: true, includeQr: false },
  audienceCount,
  onChangeContent,
  onChangeAttachments,
  onResetMessage,
  onOpenTemplateLibrary,
  onSaveAsTemplate,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showLivePreviewModal, setShowLivePreviewModal] = useState(false);

  // Insert variable safely at current cursor position
  const handleInsertVariable = (varKey: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChangeContent(content + ' ' + varKey);
      return;
    }

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const newText =
      content.substring(0, start) + varKey + content.substring(end);

    onChangeContent(newText);

    // Reposition cursor right after inserted variable
    setTimeout(() => {
      textarea.focus();
      const cursorPosition = start + varKey.length;
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    }, 50);
  };

  // Detect used smart variables in current message content
  const usedVariables = useMemo(() => {
    return SMART_VARIABLES.filter((v) => content.includes(v.key));
  }, [content]);

  // Handle Attachment Toggle
  const handleToggleAttachment = (key: keyof MessageAttachments) => {
    onChangeAttachments({
      ...attachments,
      [key]: !attachments[key],
    });
  };

  // Handle Reset with confirmation
  const handleResetClick = () => {
    if (content.trim().length > 0) {
      setShowResetConfirm(true);
    } else {
      onResetMessage();
    }
  };

  const handleConfirmReset = () => {
    onResetMessage();
    setShowResetConfirm(false);
  };

  // Sample resolved preview text
  const sampleResolvedText = useMemo(() => {
    return resolveTemplateText(content, {
      id: 'G-1001',
      name: 'سليمان العبدالله',
      table: 'VIP 2',
      companions: 2,
    });
  }, [content]);

  return (
    <div className="space-y-4 text-right" dir="rtl">
      {/* Header Info & Character Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#E5A93C]" />
          <h3 className="text-xs font-semibold text-white">محرر الرسالة والوسائط</h3>
          <span className="text-[11px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded-lg border border-white/10 hidden sm:inline-block">
            {INTENT_OPTIONS.find((i) => i.id === intent)?.title || 'رسالة'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenTemplateLibrary && (
            <button
              type="button"
              onClick={onOpenTemplateLibrary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E5A93C]/10 hover:bg-[#E5A93C]/20 border border-[#E5A93C]/30 text-[#E5A93C] text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#E5A93C]/40"
            >
              <Library className="w-3.5 h-3.5" />
              <span>القوالب الجاهزة</span>
            </button>
          )}
          {onSaveAsTemplate && content.trim().length > 0 && (
            <button
              type="button"
              onClick={onSaveAsTemplate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>حفظ كقالب</span>
            </button>
          )}
        </div>
      </div>

      {/* Audience Info & Stats Toolbar */}
      <div className="flex items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded-xl">
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span>سيتم تجهيزها لـ</span>
          <span className="text-white font-bold">{audienceCount}</span>
          <span>ضيفاً</span>
        </div>

        <div className="flex items-center gap-1 bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded-xl">
          <span>عدد الحروف:</span>
          <span className="text-[#E5A93C] font-mono font-bold">
            {content.length}
          </span>
        </div>
      </div>

      {/* Smart Variables Toolbar */}
      <VariablePicker onInsertVariable={handleInsertVariable} />

      {/* Message Textarea Container */}
      <div className="relative group">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChangeContent(e.target.value)}
          rows={6}
          dir="rtl"
          placeholder="اكتب نص الرسالة هنا، أو استخدم المتغيرات الذكية أعلاه لتخصيص محتوى كل ضيف..."
          aria-label="نص الرسالة"
          className="w-full p-4 rounded-2xl bg-black/50 border border-white/10 focus:border-[#E5A93C]/60 text-xs md:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#E5A93C]/30 leading-relaxed custom-scrollbar font-sans resize-y min-h-[140px]"
        />

        {/* Reset & Quick Helper Actions */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetClick}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300 border border-white/10 text-[11px] transition-colors"
            title="إعادة تعيين الرسالة والمرفقات"
          >
            <RotateCcw className="w-3 h-3" />
            <span>إعادة تعيين</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Banner */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>هل أنت تأكد من إرجاع النص والمرفقات للحالة الافتراضية؟</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-2.5 py-1 rounded-lg bg-white/5 text-zinc-300 hover:bg-white/10"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-2.5 py-1 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-600"
              >
                إعادة تعيين
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detected Used Variables Chips */}
      {usedVariables.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
          <span className="text-zinc-400 text-[11px] font-medium ml-1">
            المتغيرات المستخدمة في النص:
          </span>
          {usedVariables.map((v) => (
            <span
              key={v.key}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C] text-[11px]"
            >
              {v.icon}
              <span>{v.label}</span>
            </span>
          ))}
        </div>
      )}

      {/* Attachments Selector Section */}
      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
        <label className="block text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
          <Paperclip className="w-3.5 h-3.5 text-[#E5A93C]" />
          <span>المرفقات المضمنة مع الرسالة:</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Card attachment */}
          <button
            type="button"
            onClick={() => handleToggleAttachment('includeCard')}
            aria-pressed={Boolean(attachments.includeCard)}
            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
              attachments.includeCard
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>بطاقة الدعوة الرسمية</span>
            </div>
            <div
              className={`w-4 h-4 rounded flex items-center justify-center border ${
                attachments.includeCard
                  ? 'bg-amber-500 border-amber-400 text-black'
                  : 'border-white/20'
              }`}
            >
              {attachments.includeCard && <Check className="w-3 h-3" />}
            </div>
          </button>

          {/* Location attachment */}
          <button
            type="button"
            onClick={() => handleToggleAttachment('includeLocation')}
            aria-pressed={Boolean(attachments.includeLocation)}
            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
              attachments.includeLocation
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>خريطة القاعة والموقع</span>
            </div>
            <div
              className={`w-4 h-4 rounded flex items-center justify-center border ${
                attachments.includeLocation
                  ? 'bg-rose-500 border-rose-400 text-white'
                  : 'border-white/20'
              }`}
            >
              {attachments.includeLocation && <Check className="w-3 h-3" />}
            </div>
          </button>

          {/* QR Code attachment */}
          <button
            type="button"
            onClick={() => handleToggleAttachment('includeQr')}
            aria-pressed={Boolean(attachments.includeQr)}
            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
              attachments.includeQr
                ? 'bg-purple-500/10 border-purple-500/40 text-purple-200'
                : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-purple-400" />
              <span>رمز الدخول السريع QR</span>
            </div>
            <div
              className={`w-4 h-4 rounded flex items-center justify-center border ${
                attachments.includeQr
                  ? 'bg-purple-500 border-purple-400 text-white'
                  : 'border-white/20'
              }`}
            >
              {attachments.includeQr && <Check className="w-3 h-3" />}
            </div>
          </button>
        </div>
      </div>

      {/* Resolved Text Sample Preview Card */}
      <div className="p-4 rounded-2xl bg-[#08080A] border border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>معاينة حل المتغيرات لضيف نموذجي (سليمان العبدالله):</span>
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            اختبار المتغيرات
          </span>
        </div>

        <div className="p-3 rounded-xl bg-black/60 border border-white/5 text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans">
          {sampleResolvedText || (
            <span className="text-zinc-500 italic">
              اكتب نصاً في المحرر لرؤية معاينة استبدال المتغيرات...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
