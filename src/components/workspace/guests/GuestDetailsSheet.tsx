import { Guest, RsvpStatus } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Phone, MessageCircle, MapPin, Users, QrCode, 
  Link, MoreHorizontal, Copy, ExternalLink, Star,
  Clock, Edit2, History
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useEffect, useState, useRef } from 'react';
import { TableAssignmentSheet } from './TableAssignmentSheet';
import { WhatsAppSheet } from './WhatsAppSheet';
import { UndoToast } from './UndoToast';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  guest: Guest | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<Guest>) => void;
}

export function GuestDetailsSheet({ guest, isOpen, onClose, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [showTableSheet, setShowTableSheet] = useState(false);
  const [showWhatsAppSheet, setShowWhatsAppSheet] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setIsEditing(false);
    setShowTableSheet(false);
    setShowWhatsAppSheet(false);
  }, [guest]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !showTableSheet && !showWhatsAppSheet) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, showTableSheet, showWhatsAppSheet]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      previousFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        containerRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!guest) return null;

  const isConfirmed = guest.status === 'confirmed';
  const isPending = guest.status === 'pending';
  const isDeclined = guest.status === 'declined';
  const isMaybe = guest.status === 'maybe';
  const isCheckedIn = guest.status === 'checked_in';

  const handleCopy = (text: string, msg: string) => {
    navigator.clipboard.writeText(text);
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              onClick={onClose}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />
            
            <motion.div
              ref={containerRef}
              tabIndex={-1}
              className="fixed inset-x-0 bottom-0 z-[101] max-h-[90vh] md:max-h-[85vh] lg:h-[100vh] lg:max-h-[100vh] lg:top-0 lg:bottom-auto lg:right-0 lg:left-auto lg:w-[480px] flex flex-col bg-[#0a0a0c] lg:border-l border-t lg:border-t-0 border-white/[0.08] shadow-[0_-20px_60px_rgba(0,0,0,0.5)] rounded-t-[24px] lg:rounded-none overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="guest-details-title"
            >
              <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mt-3 mb-4 shrink-0 lg:hidden" />

              <div className="flex items-center justify-between px-6 pb-4 lg:pt-8 shrink-0">
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="تعديل الضيف"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="خيارات إضافية"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-4 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors font-medium text-sm"
                    >
                      إلغاء
                    </button>
                  )}
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="إغلاق"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] lg:pb-[calc(3rem+env(safe-area-inset-bottom,0px))] scrollbar-hide">
                {isEditing ? (
                  <GuestEditForm 
                    guest={guest} 
                    onSave={(updates) => {
                      onUpdate(updates);
                      setIsEditing(false);
                    }}
                  />
                ) : (
                  <>
                    <div className="flex flex-col items-center text-center mb-8">
                      <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-3xl font-bold text-white mb-4 shrink-0 overflow-hidden shadow-2xl">
                        {guest.name.charAt(0)}
                        {guest.isVip && (
                          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-black rounded-full flex items-center justify-center border-2 border-black">
                            <Star size={14} className="text-[#E5A93C] fill-[#E5A93C]" />
                          </div>
                        )}
                      </div>
                      <h2 id="guest-details-title" className="text-2xl font-bold text-white tracking-wide mb-1">{guest.name}</h2>
                      <div className="flex items-center gap-3 text-white/50 text-sm font-medium">
                        <span className="font-mono" dir="ltr">{guest.phone}</span>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <span>{
                          guest.category === 'family' ? 'العائلة' :
                          guest.category === 'friends' ? 'الأصدقاء' :
                          guest.category === 'colleagues' ? 'زملاء العمل' : 'أخرى'
                        }</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-3 mb-10">
                      <button 
                        onClick={() => setShowWhatsAppSheet(true)}
                        className="flex-1 max-w-[140px] flex items-center justify-center gap-2 h-12 rounded-full bg-emerald-500/10 text-emerald-400 font-bold hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                      >
                        <MessageCircle size={18} />
                        <span>واتساب</span>
                      </button>
                      <button className="flex-1 max-w-[140px] flex items-center justify-center gap-2 h-12 rounded-full bg-blue-500/10 text-blue-400 font-bold hover:bg-blue-500/20 transition-colors border border-blue-500/20">
                        <Phone size={18} />
                        <span>اتصال</span>
                      </button>
                    </div>

                    <div className="flex flex-col gap-6">
                      <Section title="حالة الحضور">
                        <div className="flex flex-col gap-3">
                          <div className="grid grid-cols-3 gap-2">
                            <RsvpButton 
                              active={isConfirmed}
                              label="مؤكد"
                              colorClass="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                              onClick={() => onUpdate({ status: 'confirmed' })}
                            />
                            <RsvpButton 
                              active={isPending}
                              label="بانتظار الرد"
                              colorClass="text-amber-400 bg-amber-500/10 border-amber-500/20"
                              onClick={() => onUpdate({ status: 'pending' })}
                            />
                            <RsvpButton 
                              active={isDeclined}
                              label="معتذر"
                              colorClass="text-rose-400 bg-rose-500/10 border-rose-500/20"
                              onClick={() => onUpdate({ status: 'declined' })}
                            />
                            <RsvpButton 
                              active={isMaybe}
                              label="احتمال"
                              colorClass="text-blue-400 bg-blue-500/10 border-blue-500/20"
                              onClick={() => onUpdate({ status: 'maybe' })}
                            />
                            <RsvpButton 
                              active={isCheckedIn}
                              label="حضر"
                              colorClass="text-purple-400 bg-purple-500/10 border-purple-500/20"
                              onClick={() => onUpdate({ status: 'checked_in' })}
                            />
                          </div>
                        </div>
                      </Section>

                      <Section title="المرافقين والتنظيم">
                        <div className="flex gap-3">
                          <div className="flex-1 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                            <div className="flex items-center gap-2 text-white/50 mb-1">
                              <Users size={16} />
                              <span className="text-xs font-medium">المرافقين</span>
                            </div>
                            <span className="text-lg font-bold text-white">{guest.companions}</span>
                          </div>
                          <button 
                            onClick={() => setShowTableSheet(true)}
                            className="flex-1 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors text-right"
                          >
                            <div className="flex items-center gap-2 text-white/50 mb-1">
                              <MapPin size={16} />
                              <span className="text-xs font-medium">الطاولة</span>
                            </div>
                            <span className="text-lg font-bold text-white" dir="ltr">{guest.table || 'غير معين'}</span>
                          </button>
                        </div>
                      </Section>

                      <Section title="الدعوة والدخول">
                        <div className="flex flex-col gap-3">
                          <button 
                            onClick={() => handleCopy('https://invite.link/mock', 'تم نسخ رابط الدعوة')}
                            className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
                          >
                            <div className="flex items-center gap-3 text-white/70">
                              <Link size={18} className="text-indigo-400" />
                              <span className="font-medium text-sm group-hover:text-white transition-colors">رابط الدعوة الخاص</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/40">
                              <Copy size={16} className="group-hover:text-white transition-colors" />
                            </div>
                          </button>
                          
                          <button 
                            onClick={() => {
                              onUpdate({ qrStatus: 'ready' });
                              setToastMessage('تم إنشاء الـ QR');
                              setTimeout(() => setToastMessage(''), 3000);
                            }}
                            className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
                          >
                            <div className="flex items-center gap-3 text-white/70">
                              <QrCode size={18} className="text-purple-400" />
                              <div className="flex flex-col items-start gap-0.5">
                                <span className="font-medium text-sm group-hover:text-white transition-colors">رمز الدخول QR</span>
                                <span className="text-[10px] font-mono text-white/30" dir="ltr">
                                  {guest.qrStatus === 'none' ? 'غير منشأ' : guest.qrStatus === 'ready' ? guest.qrCode : 'مستخدم'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-white/40">
                              <ExternalLink size={16} className="group-hover:text-white transition-colors" />
                            </div>
                          </button>
                        </div>
                      </Section>

                      {guest.notes && (
                        <Section title="ملاحظات">
                          <div className="p-4 rounded-2xl bg-[#E5A93C]/5 border border-[#E5A93C]/10 text-[#E5A93C]/90 text-sm font-medium leading-relaxed">
                            {guest.notes}
                          </div>
                        </Section>
                      )}

                      <Section title="سجل النشاط">
                        <div className="flex flex-col gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                          <TimelineItem 
                            icon={MessageCircle} 
                            title="تحديث نشاط" 
                            time={guest.lastInteraction || "اليوم"} 
                            isLast={false} 
                          />
                          <TimelineItem 
                            icon={History} 
                            title="إضافة الضيف" 
                            time="٢٣ سبتمبر ٢٠٢٤" 
                            isLast={true} 
                          />
                        </div>
                      </Section>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <TableAssignmentSheet 
        isOpen={showTableSheet}
        onClose={() => setShowTableSheet(false)}
        currentTable={guest?.table}
        onAssign={(table) => onUpdate({ table })}
      />

      <WhatsAppSheet 
        isOpen={showWhatsAppSheet}
        onClose={() => setShowWhatsAppSheet(false)}
        guestName={guest?.name}
        onSend={() => {
          setToastMessage('تم إرسال رسالة واتساب');
          setTimeout(() => setToastMessage(''), 3000);
        }}
      />

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-white text-black px-4 py-2 rounded-full font-bold shadow-lg whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function RsvpButton({ active, label, colorClass, onClick }: { active: boolean, label: string, colorClass: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "py-2 px-2 rounded-xl border text-xs font-bold transition-all",
        active ? colorClass : "bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.04]"
      )}
    >
      {label}
    </button>
  );
}

function Section({ title, children }: { title: string, children: import("react").ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-bold text-white/80 tracking-wide px-1">{title}</h4>
      {children}
    </div>
  );
}

function TimelineItem({ icon: Icon, title, time, isLast }: { icon: any, title: string, time: string, isLast: boolean }) {
  return (
    <div className="flex gap-4 relative">
      {!isLast && <div className="absolute top-8 bottom-[-20px] right-3.5 w-[2px] bg-white/5" />}
      <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0 z-10 border border-white/10">
        <Icon size={12} className="text-white/60" />
      </div>
      <div className="flex flex-col gap-0.5 pt-1">
        <span className="text-sm font-medium text-white/90">{title}</span>
        <span className="text-[10px] text-white/40 font-medium">{time}</span>
      </div>
    </div>
  );
}

function GuestEditForm({ guest, onSave }: { guest: Guest, onSave: (u: Partial<Guest>) => void }) {
  const [formData, setFormData] = useState({
    name: guest.name,
    phone: guest.phone,
    companions: guest.companions,
    category: guest.category,
    notes: guest.notes || ''
  });

  return (
    <motion.div 
      className="flex flex-col gap-6 pb-6"
    >
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold text-white mb-2">تعديل بيانات الضيف</h3>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-white/50 px-1">الاسم الكامل</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#E5A93C]/50 focus:bg-white/[0.04] transition-all"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-white/50 px-1">رقم الهاتف</label>
          <input 
            type="text" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            dir="ltr"
            className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#E5A93C]/50 focus:bg-white/[0.04] transition-all text-right"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-white/50 px-1">عدد المرافقين</label>
            <input 
              type="number" 
              value={formData.companions}
              onChange={(e) => setFormData({...formData, companions: parseInt(e.target.value) || 0})}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#E5A93C]/50 focus:bg-white/[0.04] transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-white/50 px-1">التصنيف</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value as any})}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#E5A93C]/50 transition-all appearance-none"
            >
              <option value="family">العائلة</option>
              <option value="friends">الأصدقاء</option>
              <option value="colleagues">زملاء العمل</option>
              <option value="other">أخرى</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-white/50 px-1">ملاحظات إضافية</label>
          <textarea 
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows={3}
            className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#E5A93C]/50 focus:bg-white/[0.04] transition-all resize-none"
          />
        </div>
      </div>

      <button 
        onClick={() => onSave(formData)}
        className="w-full flex items-center justify-center h-12 rounded-full bg-[#E5A93C] text-black font-bold hover:bg-[#C28A26] transition-colors shadow-[0_4px_16px_rgba(229,169,60,0.2)]"
      >
        حفظ التغييرات
      </button>
    </motion.div>
  );
}
