import React from 'react';
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Table as TableIcon,
  Users,
  QrCode,
  Link,
  Sparkles,
} from 'lucide-react';

export interface VariableItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  example: string;
  fallback: string;
}

export const SMART_VARIABLES: VariableItem[] = [
  {
    key: '{{guest_name}}',
    label: 'اسم الضيف',
    icon: <User className="w-3.5 h-3.5 text-amber-400" />,
    example: 'سليمان العبدالله',
    fallback: 'ضيفنا العزيز',
  },
  {
    key: '{{event_name}}',
    label: 'اسم المناسبة',
    icon: <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />,
    example: 'حفل الزفاف الميمون',
    fallback: 'حفل الزفاف الميمون',
  },
  {
    key: '{{event_date}}',
    label: 'تاريخ المناسبة',
    icon: <Calendar className="w-3.5 h-3.5 text-blue-400" />,
    example: 'الجمعة، 15 أغسطس 2026',
    fallback: 'تاريخ حفل الزفاف',
  },
  {
    key: '{{event_time}}',
    label: 'وقت المناسبة',
    icon: <Clock className="w-3.5 h-3.5 text-cyan-400" />,
    example: '08:00 مساءً',
    fallback: 'الساعة 08:00 مساءً',
  },
  {
    key: '{{venue}}',
    label: 'مكان المناسبة',
    icon: <MapPin className="w-3.5 h-3.5 text-rose-400" />,
    example: 'قاعة اللؤلؤة - فندق الرياض',
    fallback: 'موقع المناسبة',
  },
  {
    key: '{{table_number}}',
    label: 'رقم الطاولة',
    icon: <TableIcon className="w-3.5 h-3.5 text-purple-400" />,
    example: 'VIP 2',
    fallback: '—',
  },
  {
    key: '{{guest_count}}',
    label: 'عدد الضيوف',
    icon: <Users className="w-3.5 h-3.5 text-emerald-400" />,
    example: '3',
    fallback: '1',
  },
  {
    key: '{{invitation_link}}',
    label: 'رابط الدعوة',
    icon: <Link className="w-3.5 h-3.5 text-indigo-400" />,
    example: 'https://event.sa/inv/G-1001',
    fallback: 'https://event.sa/inv/card',
  },
  {
    key: '{{qr_link}}',
    label: 'رابط رمز QR',
    icon: <QrCode className="w-3.5 h-3.5 text-teal-400" />,
    example: 'https://event.sa/qr/G-1001',
    fallback: 'https://event.sa/qr/code',
  },
];

export interface VariablePickerProps {
  onInsertVariable: (variableKey: string) => void;
  disabled?: boolean;
}

/**
 * Utility function to resolve template variables against a guest or default event data
 */
export function resolveTemplateText(
  templateText: string,
  guest?: { name?: string; table?: string; companions?: number; id?: string }
): string {
  if (!templateText) return '';

  const guestName = guest?.name || 'ضيفنا العزيز';
  const tableNum = guest?.table || '—';
  const guestCount = String((guest?.companions || 0) + 1);
  const guestId = guest?.id || 'G-000';

  return templateText
    .replace(/\{\{guest_name\}\}/g, guestName)
    .replace(/\{\{event_name\}\}/g, 'حفل الزفاف الميمون')
    .replace(/\{\{event_date\}\}/g, 'الجمعة، 15 أغسطس 2026')
    .replace(/\{\{event_time\}\}/g, '08:00 مساءً')
    .replace(/\{\{venue\}\}/g, 'قاعة اللؤلؤة - فندق الرياض')
    .replace(/\{\{table_number\}\}/g, tableNum)
    .replace(/\{\{guest_count\}\}/g, guestCount)
    .replace(/\{\{invitation_link\}\}/g, `https://event.sa/inv/${guestId}`)
    .replace(/\{\{qr_link\}\}/g, `https://event.sa/qr/${guestId}`)
    .replace(/\{\{location_link\}\}/g, 'https://maps.google.com/?q=RiyadhPalace')
    .replace(/\{\{rsvp_link\}\}/g, `https://event.sa/rsvp/${guestId}`);
}

export const VariablePicker: React.FC<VariablePickerProps> = ({
  onInsertVariable,
  disabled = false,
}) => {
  return (
    <div className="space-y-2 text-right" dir="rtl">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
          <span>المتغيرات الذكية (انقر للإدراج في مكان المؤشر):</span>
        </label>
        <span className="text-[11px] text-zinc-500 hidden sm:inline">
          سيتم استبدال كل متغير ببيانات كل ضيف تلقائياً
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {SMART_VARIABLES.map((v) => (
          <button
            key={v.key}
            type="button"
            disabled={disabled}
            onClick={() => onInsertVariable(v.key)}
            aria-label={`إدراج متغير ${v.label}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#E5A93C]/40 text-xs text-zinc-300 hover:text-white transition-all duration-150 min-h-[38px] active:scale-95 disabled:opacity-40 disabled:pointer-events-none group focus:outline-none focus:ring-2 focus:ring-[#E5A93C]/40"
            title={`مثال: ${v.example}`}
          >
            <span className="shrink-0">{v.icon}</span>
            <span className="font-medium">{v.label}</span>
            <span className="text-[10px] text-zinc-500 group-hover:text-amber-400/80 font-mono" dir="ltr">
              {v.key}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
