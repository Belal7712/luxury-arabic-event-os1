import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Crown,
  Heart,
  UserCheck,
  Table as TableIcon,
  Check,
  Search,
  Filter,
  UserX,
  Sparkles,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { AudienceConfig, AudiencePreset } from './types';
import { AudienceChip } from './AudienceChip';
import { mockGuests } from '../guests/mockData';
import { Guest } from '../guests/types';

export interface AudienceSelectorProps {
  value: AudienceConfig;
  onChange: (newConfig: AudienceConfig) => void;
  onResolvedRecipientsChange?: (recipients: Guest[]) => void;
}

interface PresetOption {
  id: AudiencePreset;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const PRESET_OPTIONS: PresetOption[] = [
  {
    id: 'all',
    label: 'الجميع',
    icon: <Users className="w-4 h-4 text-[#E5A93C]" />,
    description: 'جميع المدعوين في قائمة الزفاف',
  },
  {
    id: 'confirmed',
    label: 'المؤكدون',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    description: 'الضيوف الذين أكدوا الحضور أو سجلوا الدخول',
  },
  {
    id: 'pending',
    label: 'لم يردوا',
    icon: <Clock className="w-4 h-4 text-amber-400" />,
    description: 'الضيوف بانتظار رد تأكيد الحضور',
  },
  {
    id: 'declined',
    label: 'المعتذرون',
    icon: <XCircle className="w-4 h-4 text-rose-400" />,
    description: 'الضيوف الذين اعتذروا عن الحضور',
  },
  {
    id: 'vip',
    label: 'كبار الشخصيات VIP',
    icon: <Crown className="w-4 h-4 text-[#E5A93C]" />,
    description: 'ضيوف قائمة VIP والطاولات الرئيسية',
  },
  {
    id: 'family',
    label: 'العائلة',
    icon: <Heart className="w-4 h-4 text-pink-400" />,
    description: 'أقارب العائلتين وأفراد الأسرة',
  },
  {
    id: 'friends',
    label: 'الأصدقاء',
    icon: <UserCheck className="w-4 h-4 text-blue-400" />,
    description: 'أصدقاء العريس والعروس والزملاء',
  },
  {
    id: 'table',
    label: 'طاولة محددة',
    icon: <TableIcon className="w-4 h-4 text-purple-400" />,
    description: 'اختيار ضيوف طاولات معينة في القاعة',
  },
  {
    id: 'manual',
    label: 'تحديد يدوي',
    icon: <Filter className="w-4 h-4 text-cyan-400" />,
    description: 'تحديد أسماء محددة باليد من القائمة',
  },
];

export const AudienceSelector: React.FC<AudienceSelectorProps> = ({
  value,
  onChange,
  onResolvedRecipientsChange,
}) => {
  // Modal / Surface toggles
  const [isTablePickerOpen, setIsTablePickerOpen] = useState(false);
  const [isManualPickerOpen, setIsManualPickerOpen] = useState(false);
  const [isExclusionOpen, setIsExclusionOpen] = useState(false);

  // Search query inside manual picker
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all available tables from guest list dynamically
  const availableTables = useMemo(() => {
    const tableMap = new Map<string, number>();
    mockGuests.forEach((g) => {
      if (g.table) {
        tableMap.set(g.table, (tableMap.get(g.table) || 0) + 1);
      }
    });
    return Array.from(tableMap.entries()).map(([tableId, count]) => ({
      id: tableId,
      name: `طاولة ${tableId}`,
      count,
    }));
  }, []);

  // Compute resolved recipients list dynamically based on all active filter criteria
  const resolvedRecipients = useMemo(() => {
    let result = [...mockGuests];

    // 1. Preset filter
    switch (value.preset) {
      case 'confirmed':
        result = result.filter(
          (g) => g.status === 'confirmed' || g.status === 'checked_in'
        );
        break;
      case 'pending':
        result = result.filter(
          (g) => g.status === 'pending' || g.status === 'maybe'
        );
        break;
      case 'declined':
        result = result.filter((g) => g.status === 'declined');
        break;
      case 'vip':
        result = result.filter((g) => g.isVip);
        break;
      case 'family':
        result = result.filter((g) => g.category === 'family');
        break;
      case 'friends':
        result = result.filter(
          (g) => g.category === 'friends' || g.category === 'colleagues'
        );
        break;
      case 'table':
        if (value.selectedTableId) {
          result = result.filter((g) => g.table === value.selectedTableId);
        }
        break;
      case 'manual':
        if (value.selectedGuestIds && value.selectedGuestIds.length > 0) {
          const set = new Set(value.selectedGuestIds);
          result = result.filter((g) => set.has(g.id));
        } else {
          result = [];
        }
        break;
      case 'all':
      default:
        break;
    }

    // 2. Additional Composable Table Filter (if active in addition to preset)
    if (value.preset !== 'table' && value.selectedTableId) {
      result = result.filter((g) => g.table === value.selectedTableId);
    }

    // 3. Category Filter
    if (value.categoryFilter) {
      result = result.filter((g) => g.category === value.categoryFilter);
    }

    // 4. Custom VIP / RSVP filters
    if (value.customFilters?.isVipOnly) {
      result = result.filter((g) => g.isVip);
    }
    if (value.customFilters?.rsvpStatus) {
      result = result.filter((g) => g.status === value.customFilters?.rsvpStatus);
    }

    // 5. Excluded Guest IDs
    if (value.excludedGuestIds && value.excludedGuestIds.length > 0) {
      const excludedSet = new Set(value.excludedGuestIds);
      result = result.filter((g) => !excludedSet.has(g.id));
    }

    return result;
  }, [value]);

  // Notify parent component of resolved recipients whenever they update
  useEffect(() => {
    onResolvedRecipientsChange?.(resolvedRecipients);
  }, [resolvedRecipients, onResolvedRecipientsChange]);

  // Handlers for Preset changes
  const handlePresetSelect = (preset: AudiencePreset) => {
    if (preset === 'table') {
      setIsTablePickerOpen(true);
    } else if (preset === 'manual') {
      setIsManualPickerOpen(true);
    }

    onChange({
      ...value,
      preset,
    });
  };

  // Toggle Table Selection
  const handleTableSelect = (tableId: string) => {
    const isCurrent = value.selectedTableId === tableId;
    onChange({
      ...value,
      preset: 'table',
      selectedTableId: isCurrent ? undefined : tableId,
    });
  };

  // Toggle Manual Guest Selection
  const handleToggleManualGuest = (guestId: string) => {
    const current = value.selectedGuestIds || [];
    const exists = current.includes(guestId);
    const updated = exists
      ? current.filter((id) => id !== guestId)
      : [...current, guestId];

    onChange({
      ...value,
      preset: 'manual',
      selectedGuestIds: updated,
    });
  };

  // Toggle Excluded Guest ID
  const handleToggleExcludedGuest = (guestId: string) => {
    const current = value.excludedGuestIds || [];
    const exists = current.includes(guestId);
    const updated = exists
      ? current.filter((id) => id !== guestId)
      : [...current, guestId];

    onChange({
      ...value,
      excludedGuestIds: updated,
    });
  };

  // Clear all composable sub-filters
  const handleResetFilters = () => {
    onChange({
      preset: 'all',
      selectedTableId: undefined,
      selectedGuestIds: undefined,
      excludedGuestIds: undefined,
      categoryFilter: undefined,
      genderFilter: undefined,
      customFilters: undefined,
    });
  };

  // Filtered list for Manual Picker Search
  const searchFilteredGuests = useMemo(() => {
    if (!searchQuery.trim()) return mockGuests;
    const q = searchQuery.toLowerCase().trim();
    return mockGuests.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.phone.includes(q) ||
        (g.table && g.table.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Check if any composable sub-filter is currently active
  const hasSubFilters = Boolean(
    value.selectedTableId ||
      value.categoryFilter ||
      value.customFilters?.isVipOnly ||
      value.customFilters?.rsvpStatus ||
      (value.excludedGuestIds && value.excludedGuestIds.length > 0)
  );

  return (
    <div className="space-y-5 text-right" dir="rtl">
      {/* 1. Recipient Count Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-white/[0.03] to-white/[0.01] border border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">الجمهور المستهدف:</span>
              <span className="text-xs font-bold text-[#E5A93C] bg-[#E5A93C]/10 px-2 py-0.5 rounded-lg border border-[#E5A93C]/20">
                {PRESET_OPTIONS.find((p) => p.id === value.preset)?.label || 'الجميع'}
              </span>
            </div>
            <p className="text-sm font-semibold text-white mt-0.5">
              سيتم التواصل مع{' '}
              <span className="text-[#E5A93C] font-bold text-base px-1">
                {resolvedRecipients.length}
              </span>{' '}
              ضيفاً
            </p>
          </div>
        </div>

        {/* Quick Action Badges / Reset */}
        <div className="flex items-center gap-2">
          {value.excludedGuestIds && value.excludedGuestIds.length > 0 && (
            <button
              type="button"
              onClick={() => setIsExclusionOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs hover:bg-rose-500/20 transition-colors"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>مستثنون ({value.excludedGuestIds.length})</span>
            </button>
          )}

          {hasSubFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white text-xs hover:bg-white/10 transition-colors"
              title="إعادة ضبط الفلاتر"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تفريغ الفلاتر</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Preset Selection Chips Bar */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-2">
          اختر شريحة الجمهور الرئيسية:
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
          {PRESET_OPTIONS.map((opt) => {
            const isActive = value.preset === opt.id;
            return (
              <AudienceChip
                key={opt.id}
                label={opt.label}
                icon={opt.icon}
                isActive={isActive}
                onClick={() => handlePresetSelect(opt.id)}
                ariaLabel={`شريحة ${opt.label}`}
              />
            );
          })}
        </div>
      </div>

      {/* 3. Composable Smart Filter Controls */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>فلاتر تركيبة مخصصة (تضييق النطاق)</span>
          </span>
          <span className="text-[11px] text-zinc-500">
            يمكنك دمج الشريحة الرئيسية مع الفلاتر التالية
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Table filter trigger */}
          <button
            type="button"
            onClick={() => setIsTablePickerOpen(!isTablePickerOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors min-h-[38px] ${
              value.selectedTableId
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>
              {value.selectedTableId
                ? `طاولة ${value.selectedTableId}`
                : 'تصفية بالطاولة'}
            </span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          {/* Category filter pills */}
          {[
            { id: 'family', label: 'العائلة' },
            { id: 'friends', label: 'الأصدقاء' },
            { id: 'colleagues', label: 'الزملاء' },
          ].map((cat) => {
            const isCatActive = value.categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  onChange({
                    ...value,
                    categoryFilter: isCatActive ? undefined : cat.id,
                  })
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors min-h-[38px] ${
                  isCatActive
                    ? 'bg-[#E5A93C]/20 text-[#E5A93C] border-[#E5A93C]/40'
                    : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}

          {/* VIP filter toggle */}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...value,
                customFilters: {
                  ...value.customFilters,
                  isVipOnly: !value.customFilters?.isVipOnly,
                },
              })
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors min-h-[38px] ${
              value.customFilters?.isVipOnly
                ? 'bg-[#E5A93C]/20 text-[#E5A93C] border-[#E5A93C]/40'
                : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-zinc-200'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>VIP فقط</span>
          </button>

          {/* Manual guest list trigger */}
          <button
            type="button"
            onClick={() => setIsManualPickerOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors min-h-[38px] ${
              value.preset === 'manual'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {value.selectedGuestIds && value.selectedGuestIds.length > 0
                ? `تحديد خاص (${value.selectedGuestIds.length})`
                : 'تحديد أسماء يدوياً'}
            </span>
          </button>
        </div>
      </div>

      {/* 4. Table Selection Drawer / Popover Panel */}
      <AnimatePresence>
        {isTablePickerOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-2xl bg-black/60 border border-purple-500/20 p-4 space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                <TableIcon className="w-4 h-4" />
                <span>اختر الطاولة المطلوبة:</span>
              </span>
              <button
                type="button"
                onClick={() => setIsTablePickerOpen(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                إغلاق
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {availableTables.map((tbl) => {
                const isSelected = value.selectedTableId === tbl.id;
                return (
                  <button
                    key={tbl.id}
                    type="button"
                    onClick={() => handleTableSelect(tbl.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-500/50 text-white font-semibold'
                        : 'bg-white/[0.02] border-white/5 text-zinc-300 hover:bg-white/[0.06]'
                    }`}
                  >
                    <span>{tbl.name}</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[10px] text-zinc-400">
                      {tbl.count} ضيوف
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Manual Guest Selection Popover Panel */}
      <AnimatePresence>
        {isManualPickerOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="rounded-2xl bg-[#0F0F12] border border-white/10 p-4 space-y-3 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-white">
                  التحديد اليدوي للضيوف
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  محدد: {value.selectedGuestIds?.length || 0}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsManualPickerOpen(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                تم الإنجاز
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم أو رقم الهاتف أو رقم الطاولة..."
                className="w-full pr-9 pl-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Guest List Grid */}
            <div className="max-h-56 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
              {searchFilteredGuests.length === 0 ? (
                <div className="p-4 text-center text-xs text-zinc-500">
                  لا يوجد ضيوف مطابقون لبحثك
                </div>
              ) : (
                searchFilteredGuests.map((guest) => {
                  const isSelected = (
                    value.selectedGuestIds || []
                  ).includes(guest.id);
                  const isExcluded = (
                    value.excludedGuestIds || []
                  ).includes(guest.id);

                  return (
                    <div
                      key={guest.id}
                      onClick={() => handleToggleManualGuest(guest.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                          : 'bg-white/[0.02] border-white/5 text-zinc-300 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            isSelected
                              ? 'bg-cyan-500 border-cyan-400 text-black'
                              : 'bg-white/5 border-white/10'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-white">
                              {guest.name}
                            </span>
                            {guest.isVip && (
                              <Crown className="w-3 h-3 text-[#E5A93C]" />
                            )}
                          </div>
                          <span
                            className="text-[10px] text-zinc-500 block font-mono"
                            dir="ltr"
                          >
                            {guest.phone}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {guest.table && (
                          <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-md text-zinc-400">
                            طاولة {guest.table}
                          </span>
                        )}
                        {/* Exclusion Toggle Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleExcludedGuest(guest.id);
                          }}
                          className={`p-1 rounded-lg text-[10px] transition-colors ${
                            isExcluded
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'text-zinc-500 hover:text-rose-400'
                          }`}
                          title={isExcluded ? 'إلغاء الاستثناء' : 'استثناء هذا الضيف'}
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Exclusion Manager Popover */}
      <AnimatePresence>
        {isExclusionOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl bg-rose-950/30 border border-rose-500/30 p-4 space-y-3 text-right"
          >
            <div className="flex items-center justify-between pb-2 border-b border-rose-500/20">
              <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                <UserX className="w-4 h-4" />
                <span>قائمة الضيوف المستثنين من الرسالة</span>
              </span>
              <button
                type="button"
                onClick={() => setIsExclusionOpen(false)}
                className="text-xs text-rose-400 hover:text-rose-200"
              >
                إغلاق
              </button>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
              {value.excludedGuestIds?.map((exId) => {
                const guestObj = mockGuests.find((g) => g.id === exId);
                return (
                  <div
                    key={exId}
                    className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-zinc-300"
                  >
                    <span>{guestObj?.name || exId}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleExcludedGuest(exId)}
                      className="text-rose-400 hover:text-rose-200 text-[11px] underline"
                    >
                      استعادة القبول
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
