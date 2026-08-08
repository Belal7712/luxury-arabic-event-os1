import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, AlertCircle } from 'lucide-react';
import { MessageIntent, MessageTemplate, MessageAttachments } from './types';
import { SMART_VARIABLES } from './VariablePicker';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt' | 'source'>, updateId?: string) => void;
  initialContent: string;
  initialIntent: MessageIntent;
  initialAttachments?: MessageAttachments;
  editingTemplate?: MessageTemplate;
}

export const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialContent,
  initialIntent,
  initialAttachments,
  editingTemplate,
}) => {
  const [title, setTitle] = useState(editingTemplate?.title || '');
  const [description, setDescription] = useState(editingTemplate?.description || '');
  const [error, setError] = useState('');

  const detectedVariables = SMART_VARIABLES.filter(v => initialContent.includes(v.key)).map(v => v.key);

  const handleSave = (isUpdate: boolean) => {
    if (!title.trim()) {
      setError('أدخل اسم القالب');
      return;
    }
    if (!initialContent.trim()) {
      setError('اكتب محتوى الرسالة أولاً');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      intent: initialIntent,
      content: initialContent,
      variables: detectedVariables,
      attachments: initialAttachments,
    }, isUpdate ? editingTemplate?.id : undefined);
    
    setTitle('');
    setDescription('');
    setError('');
  };

  if (!isOpen) return null;

  return (
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
        className="relative w-full sm:max-w-md bg-[#18181B] sm:rounded-2xl rounded-t-3xl border-t sm:border border-white/10 shadow-2xl overflow-hidden mt-auto sm:mt-0"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#121215]">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-[#E5A93C]" />
            <h3 className="text-base font-bold text-white">{editingTemplate ? 'تحديث القالب' : 'حفظ كقالب جديد'}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">اسم القالب <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              placeholder="مثال: دعوة زفاف رسمية..."
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#E5A93C]/50"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">وصف مختصر (اختياري)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف لاستخدام هذا القالب..."
              rows={2}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#E5A93C]/50 resize-none custom-scrollbar"
            />
          </div>

          {detectedVariables.length > 0 && (
            <div className="space-y-2 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
              <span className="text-[11px] text-zinc-400">القالب يحتوي على المتغيرات التالية:</span>
              <div className="flex flex-wrap gap-1.5">
                {detectedVariables.map(key => {
                  const v = SMART_VARIABLES.find(s => s.key === key);
                  return v ? (
                     <span key={key} className="inline-flex items-center gap-1 text-[10px] text-[#E5A93C] bg-[#E5A93C]/10 px-2 py-0.5 rounded border border-[#E5A93C]/20">
                      {v.icon}
                      <span>{v.label}</span>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={() => handleSave(true)}
              className="w-full py-3 rounded-xl bg-[#E5A93C] text-black font-bold hover:bg-[#F6C667] transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{editingTemplate ? 'تحديث القالب' : 'حفظ القالب'}</span>
            </button>
            {editingTemplate && (
              <button
                onClick={() => handleSave(false)}
                className="w-full py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10"
              >
                حفظ كنسخة جديدة
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
