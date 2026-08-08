import React from 'react';
import { MessageTemplate } from './types';
import { INTENT_OPTIONS } from './MessageIntentSelector';
import { FileText, Copy, Trash2, Edit2, Play, Check } from 'lucide-react';
import { SMART_VARIABLES } from './VariablePicker';

interface TemplateCardProps {
  template: MessageTemplate;
  onUse: (template: MessageTemplate) => void;
  onPreview: (template: MessageTemplate) => void;
  onEdit?: (template: MessageTemplate) => void;
  onDuplicate: (template: MessageTemplate) => void;
  onDelete?: (template: MessageTemplate) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onUse,
  onPreview,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const intentConfig = INTENT_OPTIONS.find((i) => i.id === template.intent);
  
  // Format date safely
  const formattedDate = new Date(template.updatedAt || template.createdAt).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col p-4 rounded-2xl bg-[#08080A] border border-white/5 hover:border-white/15 transition-all text-right" dir="rtl">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-[#E5A93C]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white line-clamp-1">{template.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                {intentConfig?.title || 'رسالة'}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded border ${
                template.source === 'system'
                  ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                  : 'text-purple-400 bg-purple-400/10 border-purple-400/20'
              }`}>
                {template.source === 'system' ? 'قالب النظام' : 'قالب شخصي'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Content Preview */}
      <div className="flex-1 mb-4">
        {template.description && (
          <p className="text-xs text-zinc-400 mb-2">{template.description}</p>
        )}
        <div className="text-[11px] text-zinc-500 line-clamp-2 bg-white/[0.02] p-2 rounded-lg border border-white/5 leading-relaxed">
          {template.content || <span className="italic">محتوى فارغ</span>}
        </div>
      </div>

      {/* Variables */}
      {template.variables && template.variables.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {template.variables.map((vKey) => {
            const vConfig = SMART_VARIABLES.find(v => v.key === vKey);
            if (!vConfig) return null;
            return (
              <span key={vKey} className="inline-flex items-center gap-1 text-[9px] text-[#E5A93C] bg-[#E5A93C]/10 px-1.5 py-0.5 rounded border border-[#E5A93C]/20">
                {vConfig.icon}
                <span>{vConfig.label}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Footer / Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <span className="text-[10px] text-zinc-600">
          آخر تحديث: {formattedDate}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPreview(template)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title="معاينة"
          >
            <Play className="w-3.5 h-3.5" />
          </button>
          
          <button
            type="button"
            onClick={() => onDuplicate(template)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title={template.source === 'system' ? 'إنشاء نسخة شخصية' : 'نسخ'}
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(template)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              title="تعديل"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {template.source === 'user' && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(template)}
              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 transition-colors"
              title="حذف"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="w-px h-4 bg-white/10 mx-1" />

          <button
            type="button"
            onClick={() => onUse(template)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E5A93C] text-black text-[11px] font-bold hover:bg-[#F6C667] transition-colors"
          >
            <Check className="w-3 h-3" />
            <span>استخدام</span>
          </button>
        </div>
      </div>
    </div>
  );
};
