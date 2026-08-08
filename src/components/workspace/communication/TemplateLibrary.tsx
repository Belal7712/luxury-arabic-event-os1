import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Search, Filter, Library, AlertCircle, Plus, Edit2, Play
} from 'lucide-react';
import { MessageTemplate, MessageIntent } from './types';
import { mockTemplates } from './mockData';
import { TemplateCard } from './TemplateCard';
import { MessagePreview } from './MessagePreview';
import { Guest } from '../guests/types';
import { INTENT_OPTIONS } from './MessageIntentSelector';

const LOCAL_STORAGE_TEMPLATES_KEY = 'luxury_event_os_comm_templates';

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: MessageTemplate) => void;
  currentDraftContent: string;
  recipients: Guest[];
}

type FilterSource = 'all' | 'system' | 'user';
type FilterIntent = MessageIntent | 'all';

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  isOpen,
  onClose,
  onUseTemplate,
  currentDraftContent,
  recipients,
}) => {
  const [userTemplates, setUserTemplates] = useState<MessageTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<FilterSource>('all');
  const [intentFilter, setIntentFilter] = useState<FilterIntent>('all');
  
  const [previewTemplate, setPreviewTemplate] = useState<MessageTemplate | null>(null);
  const [deleteConfirmTemplate, setDeleteConfirmTemplate] = useState<MessageTemplate | null>(null);
  const [useConfirmTemplate, setUseConfirmTemplate] = useState<MessageTemplate | null>(null);
  const [duplicateConfirmTemplate, setDuplicateConfirmTemplate] = useState<MessageTemplate | null>(null);

  // Load user templates
  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_TEMPLATES_KEY);
        if (stored) {
          setUserTemplates(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load user templates', e);
      }
    }
  }, [isOpen]);

  const saveUserTemplates = (newTemplates: MessageTemplate[]) => {
    setUserTemplates(newTemplates);
    localStorage.setItem(LOCAL_STORAGE_TEMPLATES_KEY, JSON.stringify(newTemplates));
  };

  const allTemplates = useMemo(() => [...mockTemplates, ...userTemplates], [userTemplates]);

  const filteredTemplates = useMemo(() => {
    return allTemplates.filter(t => {
      // Source filter
      if (sourceFilter !== 'all' && t.source !== sourceFilter) return false;
      // Intent filter
      if (intentFilter !== 'all' && t.intent !== intentFilter) return false;
      
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const searchStr = `${t.title} ${t.description || ''} ${t.content} ${t.variables.join(' ')}`.toLowerCase();
        if (!searchStr.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [allTemplates, sourceFilter, intentFilter, searchQuery]);

  const handleDelete = (template: MessageTemplate) => {
    setDeleteConfirmTemplate(template);
  };

  const confirmDelete = () => {
    if (!deleteConfirmTemplate) return;
    saveUserTemplates(userTemplates.filter(t => t.id !== deleteConfirmTemplate.id));
    setDeleteConfirmTemplate(null);
  };

  const handleDuplicate = (template: MessageTemplate) => {
    const newTemplate: MessageTemplate = {
      ...template,
      id: `tpl-usr-${Date.now()}`,
      title: `${template.title} — نسخة شخصية`,
      source: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveUserTemplates([...userTemplates, newTemplate]);
  };

  const handleEdit = (template: MessageTemplate) => {
    if (template.source === 'system') {
      // Offer to create a personal copy
      setDuplicateConfirmTemplate(template);
    } else {
      // Load into composer and mark as editing
      onUseTemplate(template);
      onClose();
    }
  };

  const handleUse = (template: MessageTemplate) => {
    if (currentDraftContent.trim().length > 0 && currentDraftContent !== template.content) {
      setUseConfirmTemplate(template);
    } else {
      onUseTemplate(template);
      onClose();
    }
  };

  const confirmUse = () => {
    if (!useConfirmTemplate) return;
    onUseTemplate(useConfirmTemplate);
    setUseConfirmTemplate(null);
    onClose();
  };

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col md:flex-row md:items-center md:justify-center p-0 md:p-6" dir="rtl">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main Sheet / Modal */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="relative w-full h-full md:h-[90vh] md:max-w-5xl bg-[#121215] md:rounded-3xl border border-white/10 flex flex-col shadow-2xl overflow-hidden mt-auto md:mt-0 rounded-t-3xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 bg-[#0A0A0C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/10 flex items-center justify-center">
              <Library className="w-5 h-5 text-[#E5A93C]" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-white">مكتبة القوالب</h2>
              <p className="text-xs text-zinc-400">إدارة واستخدام قوالب الرسائل الجاهزة</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar (Search & Filters) */}
        <div className="p-4 border-b border-white/5 space-y-4 shrink-0 bg-[#0F0F12]">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="ابحث في القوالب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E5A93C]/50 transition-colors"
            />
          </div>

          <div className="overflow-x-auto custom-scrollbar pb-1">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/5 border border-white/10 ml-2">
                <FilterButton
                  active={sourceFilter === 'all'}
                  onClick={() => setSourceFilter('all')}
                  label="الكل"
                />
                <FilterButton
                  active={sourceFilter === 'system'}
                  onClick={() => setSourceFilter('system')}
                  label="قوالب النظام"
                />
                <FilterButton
                  active={sourceFilter === 'user'}
                  onClick={() => setSourceFilter('user')}
                  label="قوالبي"
                />
              </div>

              <div className="w-px h-6 bg-white/10 mx-1" />

              <FilterButton
                active={intentFilter === 'all'}
                onClick={() => setIntentFilter('all')}
                label="كل الأنواع"
              />
              {INTENT_OPTIONS.map(intent => (
                <FilterButton
                  key={intent.id}
                  active={intentFilter === intent.id}
                  onClick={() => setIntentFilter(intent.id)}
                  label={intent.title}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-black/20">
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onUse={handleUse}
                  onPreview={setPreviewTemplate}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={template.source === 'user' ? handleDelete : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-zinc-500">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-white font-medium mb-2">
                {sourceFilter === 'user' && userTemplates.length === 0 
                  ? 'لم تحفظ أي قوالب بعد'
                  : 'لم نجد قالباً مطابقاً'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSourceFilter('all');
                  setIntentFilter('all');
                }}
                className="text-[#E5A93C] text-sm hover:underline mt-2"
              >
                مسح البحث والفلاتر
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmTemplate && (
          <ModalOverlay onClose={() => setDeleteConfirmTemplate(null)}>
            <div className="p-6 text-right">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">هل تريد حذف هذا القالب؟</h3>
              <p className="text-sm text-zinc-400 mb-6">سيتم حذف "{deleteConfirmTemplate.title}" نهائياً ولا يمكن التراجع عن ذلك.</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors"
                >
                  حذف القالب
                </button>
                <button
                  onClick={() => setDeleteConfirmTemplate(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Duplicate System Template Confirmation Modal */}
      <AnimatePresence>
        {duplicateConfirmTemplate && (
          <ModalOverlay onClose={() => setDuplicateConfirmTemplate(null)}>
            <div className="p-6 text-right">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                <Edit2 className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">تعديل قالب النظام؟</h3>
              <p className="text-sm text-zinc-400 mb-6">
                قوالب النظام لا يمكن تعديلها مباشرة. هل تريد إنشاء نسخة شخصية من هذا القالب لتتمكن من تعديلها؟
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleDuplicate(duplicateConfirmTemplate);
                    setDuplicateConfirmTemplate(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors"
                >
                  إنشاء نسخة شخصية
                </button>
                <button
                  onClick={() => setDuplicateConfirmTemplate(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Use Confirmation Modal */}
      <AnimatePresence>
        {useConfirmTemplate && (
          <ModalOverlay onClose={() => setUseConfirmTemplate(null)}>
            <div className="p-6 text-right">
              <div className="w-12 h-12 rounded-full bg-[#E5A93C]/10 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-[#E5A93C]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">استبدال الرسالة الحالية؟</h3>
              <p className="text-sm text-zinc-400 mb-6">
                لديك رسالة مكتوبة بالفعل في المحرر. هل تريد استبدالها بمحتوى القالب "{useConfirmTemplate.title}"؟
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={confirmUse}
                  className="w-full py-2.5 rounded-xl bg-[#E5A93C] text-black font-bold hover:bg-[#F6C667] transition-colors"
                >
                  نعم، استخدم القالب
                </button>
                <button
                  onClick={() => setUseConfirmTemplate(null)}
                  className="w-full py-2.5 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10"
                >
                  الاحتفاظ برسالتي وإلغاء
                </button>
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Preview Sheet */}
      <AnimatePresence>
        {previewTemplate && (
          <ModalOverlay onClose={() => setPreviewTemplate(null)} className="md:max-w-md w-full !p-0 overflow-hidden bg-[#121215] border-white/10">
            <div className="flex flex-col h-[80vh] md:h-[600px] text-right">
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0A0A0C]">
                 <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-[#E5A93C]" />
                    <h3 className="text-base font-semibold text-white">معاينة القالب</h3>
                 </div>
                 <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 flex-1 overflow-hidden flex flex-col bg-black/20">
                <MessagePreview
                  content={previewTemplate.content}
                  attachments={previewTemplate.attachments}
                  recipients={recipients}
                />
              </div>
              <div className="p-4 border-t border-white/5 bg-[#0A0A0C]">
                <button
                  onClick={() => {
                    handleUse(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="w-full py-3 rounded-xl bg-[#E5A93C] text-black font-bold hover:bg-[#F6C667] transition-colors"
                >
                  استخدام هذا القالب
                </button>
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper subcomponents
const FilterButton: React.FC<{ active: boolean, onClick: () => void, label: string }> = ({ active, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap ${
      active
        ? 'bg-white/20 text-white shadow-sm'
        : 'text-zinc-400 hover:bg-white/10 hover:text-zinc-200'
    }`}
  >
    {label}
  </button>
);

const ModalOverlay = ({ children, onClose, className = '' }: { children: React.ReactNode, onClose: () => void, className?: string }) => (
  <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    />
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={`relative w-full sm:max-w-sm bg-[#18181B] sm:rounded-2xl rounded-t-3xl border-t sm:border border-white/10 shadow-2xl overflow-hidden mt-auto sm:mt-0 ${className}`}
    >
      {children}
    </motion.div>
  </div>
);
